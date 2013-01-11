# 排序表格演示文档

---
<style type="text/css">
  .sort-table{
    font-size: 14px;
  }
  .sort-table td,
  .sort-table th{
    border: 1px solid #ccc;
    width: 140px;
    text-align: center;
    padding: 5px 4px;
  }
  .sort-table th{
    padding: 7px 6px;
    font-weight: bold;
    background-color: #eee;
  }
</style>

<table id='demo-table' class='sort-table'>
  <thead>
    <tr>
      <th>金额</th>
      <th>数字</th>
      <th>西文</th>
      <th>符号</th>
      <th>按卡号</th>
      <th>中文</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>$ 4</td>
      <td>345,40.00000001</td>
      <td>arale</td>
      <td>****</td>
      <td>CBC: <span class='card'>4309 7898 1298</span></td>
      <td>變</td>
    </tr>
    <tr>
      <td>￥ 8,000</td>
      <td>123</td>
      <td>seajs</td>
      <td>^</td>
      <td>BBC: <span class='card'>4309 8898 1298</span></td>
      <td>錒</td>
    </tr>
    <tr>
      <td>123 CNY</td>
      <td>123</td>
      <td>jquery</td>
      <td></td>
      <td>ABC: <span class='card'>4309 9898 1298</span></td>
      <td>畅</td>
    </tr>
    <tr>
      <td>89000.0</td>
      <td>1234</td>
      <td>YUI</td>
      <td>)</td>
      <td>ICBC: <span class='card'>4309 1898 1298</span></td>
      <td>看来</td>
    </tr>
    <tr>
      <td>-123,034.00</td>
      <td>345,40.001</td>
      <td>zepto</td>
      <td>#</td>
      <td>BC: <span class='card'>5309 1898 1298</span></td>
      <td>中文</td>
    </tr>
  </tbody>
 <tfoot>
    <tr>
      <td colspan='5'>Counter: </td>
    </tr>
  </tfoot>
</table>

````javascript
seajs.use(['$', 'sorttable'], function($, Sorttable){
  a = new Sorttable({
    element     : '#demo-table',
    dataFilter  : function(td) {
      // 自定义特殊字段的特殊取值方式
      if ($(td).find('.card').length) {
        return $(td).find('.card').text();
      }
      // 默认取整个td里的文本
      return $(td).text();
    }
  });
});
````
