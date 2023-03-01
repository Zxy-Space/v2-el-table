## 表格效果
vue+element 实现表格可配置，列排序，列搜索，单元格双击修改，单击行修改，键盘上下左右选中input，拖动改变列宽等功能
（持续更新中，欢迎大家提出宝贵意见）
![在这里插入图片描述](https://images.gitee.com/uploads/images/2020/0525/112228_4b0e4513_7497832.png)![在这里插入图片描述](https://images.gitee.com/uploads/images/2020/0525/112229_e1f41d4c_7497832.png)
![在这里插入图片描述](https://images.gitee.com/uploads/images/2020/0525/112228_a40e6e60_7497832.png)
### jst-table更新日志
|时间	|废除|新增
-------- | ----------|-----
2020.02.12|无|新增specialevent(特殊事件)参数：disabledEdit(禁止所有edit模板不可编辑);详见attrConfig
2020.01.10|废除keyboard(键盘操作)<br>废除字段type(配置选择列，序号列)<br>废除字段operate{操作列)|新增specialcol（特殊列）详见attrConfig<br>新增specialevent（特殊事件）详见attrConfig<br>新增edit-row-save事件（单击行编辑状态）详见Events
2020.03.02|无|新增input纯输入框模板详见template
2020.03.03|无|新增列配置(详见colconfig)aline和headerAlign(列对齐和头部对齐方式)，详见tableConfig<br>新增tableheight，分页是否不占高度，详见attrConfig
2020.03.09|无|新增获取ref的方法get-ref，详见Events
2020.04.14|无|新增选框选中行后数据更新，选框回选。reserverow: String(唯一属性的列名称)
2020.04.22|废除size-change、current-change事件<br>废除pageconfig中的size字段|新增page-change事件(前两个废除事件的整合，无返回值)<br>新增pageconfig中的pageSize字段
2020.04.26|无|新增模板image(可鼠标移入查看大图)
**2020.05.07**|**无**|**新增列配置排序可拖动排序<br>新增表格数据排序sort-change详见Events**
### jst-table表格组件使用方法
```html
<jst-table 
:tabledata="tableData" 
:tableconfig="tableConfig" 
:pageconfig="pageConfig" 
specialcol="selection,number,operate"
specialevent="keyboard,rowClickEdit"
@multi-select="multiSelect"
@edit-save="editSave"
@edit-row-save="editRowSave"
@press-key="pressKey" 
@lable-btn="lableBtn" 
@search-col="searchCol" 
@page-change="pageChange" >
	  <!--如果设置了operate(含有操作列，则需要自定义以下代码)-->
      <template slot="operate" slot-scope="data">
           <span class="cursorP F2263E5" @@click="editRow(data.rowdata)">编辑</span>
           <span class="cursorP F32735 marL15" @@click="deleteRow(data.rowdata)">删除</span>
      </template>
      <!--如果tableconfig(列配置项添加了非内定模板)则对应需要添加一下代码，slot须与tableconfig中的template对应-->
      <template slot="image" slot-scope="data">
      		<!--data.celldata   单元格数据-->
      		<!--data.rowdata    行数据-->
          这里写自有样式
      </template>
      <!--简单的计算列样例,此时slot的值要与tableconfig中的template对应
      （注意：数据库没有的列需要展示也需要配置到tableconfig中）-->
      <template slot="cal" slot-scope="data">
          <span>{{Number(data.rowdata.bi.value)+ Number(data.rowdata.yu.value)}}</span>
      </template>
</jst-table>
```
```javascript
var vue= new Vue({
        el: '#app',
        components: {
            'jstTable': jstTable,
        }
}
```
#### attrConfig
属性配置
|事件名	|说明	|  参数
-------- | ------|-----
tabledata|表格数据|Object
tableconfig| 表格列配置|Object
pageconfig| 分页配置|Object
height| 表格高度|number
specialcol| 特殊列配置(选框,序号,操作)|string(selection,number,operate)
specialevent|特殊事件(键盘操作,单击行编辑(若需双击单个修改不配置即可),禁止所有edit模板不可编辑)|string(keyboard,rowClickEdit,disabledEdit)
tableheight|分页是否占据高度|Boolean(默认false)
**colconfig**|**列配置设置功能**|**Object**

#### tabledata
表格数据(根据现有需求结合vue暂定表格数据格式)
交互效果	|原数据|  现数据 
-------- | ------|-----|---
只控制显示| address1:'上海市普陀区金沙江路 1518 弄'|address1: {value:'上海市普陀区金沙江路 1518 弄',isShow:false},
包含小按钮+弹出框| ouderNum: 20215719|ouderNum: {value: 20215719,content: '详',modal: 'tableDetails'},
显示不同样式| status: 'deliverying',|status: {value:  'deliverying', name: '发货中', color: '#F94406'},
#### colconfig
列配置设置
|参数	|说明	|  类型 |可选值
-------- | ------|-----|---
elementId| 对应表格id(为区分一个页面多个表格)|string|选填(多个表格时必填)
key| 区分某一页的列配置|string|必填(一般用路由)

#### tableConfig
列配置
|参数	|说明	|  类型 |可选值
-------- | ------|-----|---
prop| 对应数据|string|必填
label| 对应数据列名称|string|必填
**isShow**| **该列是否显示**|**boolean**|**必填**
fixed| 列固定|boolean|非必填
sortable| 列排序|boolean|非必填
isSearch| 列搜索|boolean|非必填
aline| 内容对齐方式|string|非必填(left/center/right)
headerAlign| 表头对齐方式<br>(若不传参数，则使用aline对齐方式)|string|非必填(left/center/right)
template| 渲染模板|string|见templat模板介绍


#### template
内置模板
|模板名	|说明 | 所需数据
-------- | ------   |----
default|默认只展示|String
hover-modul|鼠标移入出操作按钮(图示2)|Object<br />({ouderNum: 20215719,content: '详',modal: 'tableDetails'})
label|标签模板(默认包含鼠标移入操作按钮，图示3)|Array<br /> [{status: 'defult',name: '复制订单'},{status: 'icon',name: 'purple',color: '#E836FD'}]
double|上下双行数据(图示4)|Array<br/>['12321312','栗鼠']
status|带图标+颜色(图示5)|Object<br/>{color: "#FF06A4", status: "Delivering", name: "发货中", msg: "平台快递公司未映射", describe: "描述"}
edit|双击修改当前单元格(图示6)|Object<br />{value: '上海市普陀区金沙江路 1518 弄',isShow: false,isDisabled:false},
input|纯输入框(数据格式 name:value,若传递时对象则支持设置不可编辑)|String,Object({isDisabled:true,value:'21'})
**image**|**图片模板(鼠标移入可查看大图)(图示7)**|**String**

图示：
![在这里插入图片描述](https://images.gitee.com/uploads/images/2020/0525/112228_e262cb16_7497832.png)
![在这里插入图片描述](https://images.gitee.com/uploads/images/2020/0525/112228_ef78ac6b_7497832.png)![在这里插入图片描述](https://images.gitee.com/uploads/images/2020/0525/112228_a40e6e60_7497832.png)
#### pageconfig
分页配置
|事件名	|说明	|  参数
-------- | ------|-----
total|总条数|number
pageSize| 每页显示条|number
pageIndex|当前页|number
sizes| 每页显示个数选择器的选项设置|arr

#### Events
操作事件
|事件名	|触发的事件| 返回值
-------- | ------|-----
row-click|单击行时|选中行数据
multi-select| 多选框勾选时|选中行数据
edit-save| 输入框修改完成时(数据有修改才会触发)|行Id，列名称，修改后的值
edit-row-save| 选中其他行或再次单击行时触发(数据有修改才会触发)|修改后行数据
press-key| 键盘上下左右键选中|当前选中行数据
lable-btn| 小按钮“详”，“改”等点击事件|当前选中行数据，对应弹出框名称
search-col| 列搜索，点击搜索按钮时触发的事件|列名称，搜索内容
page-change| 分页选择每页/条，页面切换时触发|无
get-ref| 无|抛出ref
**sort-change**|**点击列上的排序按钮时**|**{列名，排序方向}**

### jstTable.vue下载地址（涵盖数据样板）
链接: [https://pan.baidu.com/s/1i73IrmHX9r6eEE0-9VZ3Xw](https://pan.baidu.com/s/1i73IrmHX9r6eEE0-9VZ3Xw) 提取码: hqtq

#### 数据样板
```javascript
tableData: [{
                    id: '00001',
                    date: {
                        ouderNum: 20215719,
                        content: '详',
                        modal: 'tableDetails'
                    },
                    label: [{
                        status: 'defult',
                        name: '复制订单'
                    },
                    {
                        status: 'icon',
                        name: 'purple',
                        color: '#E836FD'
                    }],
                    goods: [{
                        id: 00000,
                        name: '商品1',
                        num: 100,
                        imgurl: 'https://img.alicdn.com/imgextra/i2/1046707508/TB2xwsghCtYBeNjSspkXXbU8VXa_!!1046707508.jpg_430x430q90.jpg',
                        skus: [{
                            id: 424225262622,
                            status: '线上锁定',
                            befor_amount: 0.01,
                            num: 1,
                            amount: 0.01,
                            name: '测试用-【集单】测试商品请不要拍',
                            imgurl: 'https://img.alicdn.com/imgextra/i2/1046707508/TB2xwsghCtYBeNjSspkXXbU8VXa_!!1046707508.jpg_430x430q90.jpg',
                            color: '白色',
                            size: 'S',
                            weight: 0,
                            inventory: 0
                        }]
                    }],
                    accountAndstore: ['113267147', '乐迪'],
                    status: {
                        status: 'paymented',
                        name: '待付款',
                        color: '#1642F3'
                    },
                    address1: {
                        value: '上海市普陀区金沙江路 1518 弄',
                        isShow: false
                    },
                    address2: '上海市普陀区金沙江路 1518 弄',
                    zip: {
                        value: 200333,
                        isShow: false
                    },
}]
tableConfig: [{
                    prop: "date", //对应数据
                    label: "内部订单号", //列名称
                    width: '120', //列宽
                    isShow:true,//是否显示
                    fixed: true, //是否固定
                    sortable: true, //是否排序
                    isSearch: false, //是否下拉搜索
                    template: "hover-modul", //ui模板(hover-modul,label,double,status,default,edit)
}]
```