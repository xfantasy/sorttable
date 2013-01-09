# 演示文档

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
      <th>标题</th>
      <th>标题</th>
      <th>标题</th>
      <th>标题</th>
      <th>标题</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>$ 4</td>
      <td>345,40.00000001</td>
      <td>arale</td>
      <td>*</td>
      <td>中文</td>
    </tr>
    <tr>
      <td>￥ 8,000</td>
      <td>123</td>
      <td>seajs</td>
      <td>^</td>
      <td>排序</td>
    </tr>
    <tr>
      <td>123 CNY</td>
      <td>123</td>
      <td>jquery</td>
      <td></td>
      <td>是</td>
    </tr>
    <tr>
      <td>89000.0</td>
      <td>1234</td>
      <td>YUI</td>
      <td>)</td>
      <td>很</td>
    </tr>
    <tr>
      <td>-123,034.00</td>
      <td>345,40.001</td>
      <td>zepto</td>
      <td>#</td>
      <td>麻烦的</td>
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
    element : '#demo-table'
  });
  
});
````
