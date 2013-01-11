define(function(require, exports, module) {
  var Widget = require('arale/widget/1.0.2/widget-debug');
  var $ = require('$');
  require('./sorttable.css');

  // 常见货币符号
  var CoinSymbol = '$ ￥ ￠ ￡ HKD CNY TWD EUR DEM GBP USD KPW JPY INR'.split(' ');

  // 用于记录每一列的数据类型
  var dataType = [];

  // 当前排序的列次，以及正序/倒序状态当前排序状态
  var orderStatus = {
    'colIndex': -1,
    'order': undefined
  };  

  var Sorttable = Widget.extend({
    attrs: {

      // 触发器，默认为表头
      'trigger': {
        value: '>thead>tr>th',
        getter: function(val) {
          return this.$(val);
        }
      },

      // 需要排序的单元格
      'rows': {
        value: '>tbody:eq(0)>tr',
        getter: function(val) {
          return this.$(val);
        }
      },

      // 正序的className
      'ascClass': 'sort-table-asc',

      // 倒序的className
      'descClass': 'sort-table-desc',

      // 过滤器，定义了从td中取那一部分数据来排序
      'dataFilter': {
        value: function(td) {
          return $(td).text();
        }
      },

      // 用于记录每一列的数据类型
      'dataType': {
        value: [],
        geter: function() {
          return dataType;
        }
      },
    },

    setup: function() {
      Sorttable.superclass.setup.call(this);

      // 将每一列的dataType记录下来
      dataType = this.get('dataType');

      // 所有行
      var rows = this.get('rows');
      // 得到每一列的dataType，为后面的排序做准备
      for(var i = 0, l = rows.eq(0).children().length; i < l; i++) {
        if(typeof dataType[i] !== 'string' || dataType[i] === '') {
          dataType[i] = __detectType(__getColData(this, rows, i));
        }
      };

      // 存在trigger时才绑定click事件
      if(this.get('trigger').length) {
        __bindSortEvent(this);
      }
    },

    // 返回表格的排序状态
    getOrderStatus: function() {
      return orderStatus;
    },

    /**
     * 排序
     * 1. 如果order不传，或为空，则自动排序/倒序
     * 2. 如果指定order='asc/desc'，则按指定方向排序
     * @param {number} colIndex   按第(column)列排序
     * @param {string} order    排序方向，可选
     */
    sort: function(colIndex, order) {
      var trigger = this.get('trigger');

      // 得到所有行
      var rows = __getRows(this);
      var colCount = $(rows).eq(0).children().length - 1;
      var colIndex = colIndex || 0;
      colIndex = colIndex < 0 ? 0 : (colIndex > colCount ? colCount : colIndex);

      // 如果当前需要排序的列已经是有序态，且跟要排序的方向一致，则不用排啦
      if(colIndex == orderStatus.colIndex && orderStatus.order == order) return orderStatus;

      // 得到所有列的数据
      var colData = __getColData(this, rows, colIndex);

      // 倒序
      if(colIndex == orderStatus.colIndex) {
        var orderData = colData.reverse();
        orderStatus.order = orderStatus.order == 'desc' ? 'asc' : 'desc';
      // 排序
      } else {
        var orderData = __sort(colData, dataType[colIndex]);
        orderData = order == 'desc' ? orderData.reverse() : orderData;
        orderStatus.order = order == 'desc' ? 'desc' : 'asc'; //默认正序
        orderStatus.colIndex = colIndex;
      }

      // 给triggers设置样式
      if(trigger.length) {
        $(trigger).removeClass(this.get('descClass') + ' ' + this.get('ascClass'));
        $(trigger).eq(colIndex).addClass(orderStatus.order == 'asc' ? this.get('ascClass') : this.get('descClass'));
      }

      var html = __sortRow(rows, orderData);
      rows.remove();
      this.element.find('tbody:eq(0)').append(html);
      return orderStatus;
    },
  });

  /**
   * 绑定th上的排序事件
   */
  var __bindSortEvent = function(that) {
    var trigger = that.get('trigger');
    $(trigger).bind('click', function(e) {
      var currentTarget = $(e.currentTarget);
      var colIndex = -1;
      for(var i = 0, l = trigger.length; i < l; i++) {
        if(trigger[i] == e.currentTarget) {
          colIndex = i;
          break;
        }
      }
      return that.sort(colIndex, $(e.currentTarget).data('order'));
    });
  };

  /**
   * 转换文本为对应数据
   * @param  {string} text 需要转换的文本
   * @param  {string} type 需要转换的类型
   * @return {string} 转换后的数据
   */
  var __convertData = function(text, type) {
    var data = text;
    switch(type) {
    case 'coin':
      for(var i = 0, l = CoinSymbol.length; i < l; i++) {
        data = data.replace(CoinSymbol[i], '');
      }
    case 'coin':
    case 'number':
      data = data.trim().replace(/[,]/g, '') * 1
      break;
    default:
    }
    return data;
  };

  /**
   * 判断数据类型(给出一组数据，跟据不同元素的类型，决定这一组元素的总体类型)
   * @param  {string} str 传入的html片段、或者数据
   * @return {string}     数据类型
   */
  var __detectType = function(data, target) {
    var types = [];
    // 类型检测
    var detectType = function(str) {
        if(str.trim() === '') return 'other';
        for(var i = 0, l = CoinSymbol.length; i < l; i++) {
          // 首尾有货币符号时，则定义为货币
          if(str.indexOf(CoinSymbol[i]) === 0 || (str.indexOf(CoinSymbol[i]) > 0) && (str.indexOf(CoinSymbol[i]) === str.length - CoinSymbol[i].length)) {
            return 'coin';
          }
        }
        // 数字类型检测( 千分位记数法 || 普通数字和科学记数法 )
        if(/^([-]*\d{1,3}(,\d{3})*(\.\d+)?|\d+(\.\d+)?)$/.test(str) || str * 1 === str * 1) return 'number';
        // 中文(首字母为中文，则为中文)
        if(/^[\u4E00-\u9FA5\uF900-\uFA2D]/ig.test(str)) return 'chinese';

        // 西文字母&标点(如果字母数字标点占比大于50%，则认为这是一个字符串)
        // TODO：更精确的西文字符检测方法
        // if (str.replace(/[^a-zA-Z0-9,.!?:;\ ]/g, '').length / str.length > 0.5) return 'character';
        return 'character';
      };
    for(var i = 0, l = data.length; i < l; i++) {
      types.push(detectType(data[i].str.trim()));
    }
    // 返回值，根据types数组中的类型组合决定
    if(types.indexOf('other') != -1 || types.indexOf('character') != -1) {
      return 'character';
    } else if(types.indexOf('chinese') != -1) {
      return 'chinese';
    } else if(types.indexOf('coin') != -1) {
      return 'coin';
    } else if(types.indexOf('number') != -1) {
      return 'number';
    }
  };

  /**
   * 排序函数
   * @param  {array}  data     [需要排序的数组]
   * @param  {string} dataType [数据类型]
   * @return {array}           [排序后的数据]
   */
  var __sort = function(data, dataType) {
    // 按指定的数据类型处理原始数据
    $(data).each(function() {
      this.data = __convertData(this.str, dataType);
    });
    // 按指定的数据类型排序
    if(dataType === 'character') {
      data.sort(function(a, b) {
        return(a.data + '').localeCompare(b.data + '');
      });
    } else if(dataType === 'chinese') {
      data.sort(function(a, b) {
        return(a.data + '').localeCompare(b.data + '');
      });
    } else if(dataType === 'number' || dataType === 'coin') {
      data.sort(function(a, b) {
        return a.data * 1 > b.data * 1;
      });
    }
    return data;
  };

  /**
   * 得到所有需要排序的行
   */
  var __getRows = function(that) {
    return $(that.element).find(that.get('rows'));
  };

  /**
   * 得到对应单元格的数据
   * @param  {object} that     Sorttable
   * @param  {DOM} rows     所有的行
   * @param  {number} colIndex 列索引
   * @return {string}  返回单元格里的文本，或由dataFilter过滤后的文本
   */
  var __getColData = function(that, rows, colIndex) {
    var colData = [];
    $(rows).each(function(index) {
      colData.push({
        str   : that.get('dataFilter')($(this).children().eq(colIndex)),
        index : index //记录现在的index值，用于排序
      });
    });
    return colData;
  };

  /**
   * 移动行
   * @param  {DOM} rows  排序前的DOM
   * @param  {array} data 排序后的HTML
   * @return {HTML} 排序后的html
   */
  var __sortRow = function(rows, data) {
    var newTbody = [];
    $(data).each(function() {
      newTbody.push($(rows).eq(this.index)[0].outerHTML);
    });
    return newTbody.join(' ');
  };

  module.exports = Sorttable;
});