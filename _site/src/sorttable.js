define(function(require, exports, module) {
  var Widget = require('arale/widget/1.0.2/widget-debug');
  var $ = require('$');

  var Sorttable = Widget.extend({
    attrs : {
      trigger : {
        value : '>thead>tr>th',
        getter : function(val) {
          return this.$(val);
        }
      },
      rows : {
        value : '>tbody:eq(0)>tr',
        getter : function(val) {
          return this.$(val);
        }
      }
    },
    setup : function () {
      var that = this;
      Sorttable.superclass.setup.call(this);
      _bindSortEvent(this);
    },
    /**
     * 排序
     * 1. 如果order不传，或为空，则自动排序/倒序
     * 2. 如果指定order='asc/desc'，则按指定方向排序
     * @param {number} colIndex   按第(column)列排序
     * @param {string} order    排序方向，可选
     */
    sort : function(colIndex, order) {

    },

    
  });

  // 常见货币符号
  var CoinSymbol = '$ ￥ ￠ ￡ HKD CNY TWD EUR DEM GBP USD KPW JPY INR'.split(' ');

  /**
   * 鼠标移动事件
   * @return {[type]} [description]
   */
  var _bindMouseOverEvent = function() {
  };

  var _getData = function(text, type) {
    var data = text;
    switch(type) {
      case 'coin':
        for (var i = 0, l = CoinSymbol.length; i < l; i++) {
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
   * 判断数据类型
   * @param  {string} str 传入的html片段、或者数据
   * @return {string}     数据类型
   */
  var _detectType = function(str) {
    // 空节点
    if (str.trim() === '') return 'other';
    for (var i = 0, l = CoinSymbol.length; i < l; i++) {
      // 首尾有货币符号时，则定义为货币
      if (str.indexOf(CoinSymbol[i]) === 0 ||
          (str.indexOf(CoinSymbol[i]) > 0) && (str.indexOf(CoinSymbol[i]) === str.length - CoinSymbol[i].length)) {
        return 'coin';
      }
    }
    // 数字类型检测
    // TODO: 兼容科学计数法
    if (/^([-]*\d{1,3}(,\d{3})*(\.\d+)?|\d+(\.\d+)?)$/.test(str)) return 'number';
    // 西文字母&标点(如果字母数字标点占比大于50%，则认为这是一个字符串)
    if (str.replace(/[^a-zA-Z0-9,.!?:;\ ]/g, '').length / str.length > 0.5) return 'character';
    // 中文
    if (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(str)) return 'chinese';
    return 'other';
  };

  /**
   * 排序
   * @param {number} data     需要排序的数据
   * @param {string} order    排序方向，可选
   */
  //!!! 如果当前列已经是asc/desc状态，则只需要倒序或不动即可
  var _sort = function(data, order) {
    // eg: data = {str : '原始字符串', data : '格式化后的数据', index : '在表格中的行数', type : '数据类型'}
    var types = [];
    $(data).each(function() {
      types.push(this.type = _detectType(this.str));
      this.data = _getData(this.str, this.type);
    });
    // 排序规则： other/character > chinese > coin/number
    if (types.indexOf('other') != -1 || types.indexOf('character') != -1 ) {
      data.sort(function(a, b) {
        return (a.data + '').localeCompare(b.data + '');
      });
    } else if (types.indexOf('chinese') != -1 ) {
      data.sort(function(a, b) {
        return (a.data + '').localeCompare(b.data + '');
      });
    } else if (types.indexOf('coin') != -1 || types.indexOf('number') != -1 ) {
      data.sort(function(a, b) {
        return a.data > b.data;
      });
    }
    return data;
  };

  /**
   * 绑定th上的排序事件
   * @param  {[type]} that [description]
   * @return {[type]}      [description]
   */
  var _bindSortEvent = function(that) {
    var trigger = that.get('trigger');
    $(trigger).bind('click', function (e) {
      var colIndex = -1;
      for (var i = 0, l = trigger.length; i < l; i++){
        if (trigger[i] == e.currentTarget){
          colIndex = i;
          break;
        }
      }
      var rows = _getRows(that.element);          //得到所有列
      var colData = _getColData(rows, colIndex);  //得到所有列的数据
      var order = $(e.currentTarget).data('order') == 'undefined' ?
        'asc' : ($(e.currentTarget).data('order') == 'asc' ? 'desc' : 'asc');
      var sortOrder = _sort(colData, order);      //将数据排序后的index顺序返回
      _sortRow(that, sortOrder);                        //排序表格
    });
  };

  /**
   * 得到所有的行
   * @return {[type]} [description]
   */
  var _getRows = function (table) {
    return $(table).find('tbody:eq(0)>tr');
  };

  /**
   * 得到对应列的数据
   * @return {[type]} [description]
   */
  var _getColData = function(rows, colIndex) {
    var colData = [];
    $(rows).each(function(index) {
      colData.push({
        str   : $(this).children().eq(colIndex).text().trim(),
        index : index //记录现在的index值，用于排序
      });
    });
    return colData;
  };

  /**
   * 移动行
   * @return {[type]} [description]
   */
  // TODO: 效率问题
  var _sortRow = function (that, data) {
    var newTbody = [];
    $(data).each(function() {
      newTbody.push(that.get('rows').eq(this.index)[0].outerHTML);
    });
    that.element.find('tbody:eq(0)>tr').remove();
    that.element.find('tbody:eq(0)').append(newTbody.join(' '));
  };

  module.exports = Sorttable;
});
