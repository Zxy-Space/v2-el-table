// 查询表单配置
export const formList = [
  {
    prop: "deptName",
    label: "部门名称",
    formType: "el-input",
    clearable: true
  },
  {
    prop: "status",
    label: "状态",
    formType: "el-select",
    dictKey: "sys_normal_disable", //字典key
    options: [], // 死字典
    clearable: true
  }
];

// 按钮组配置
export const buttons = [
  {
    label: "新增",
    useKey: "add",
    icon: "el-icon-plus",
    type: "primary",
    btnPer: ["system:dept:add"]
  }
];

export const tableDatas = [
  {
    date: "2016-05-02",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1518 弄",
    orgCn:'社会部门',
    age:18,
    phone:110,
    useHeight:179,
    School:'社会大学',
    Occupation:'社会人员'
  },
];
export const tableConfigList = [
  {
    prop: "name", //对应数据
    label: "姓名", //列名称
    width: "", //列宽
    isShow: true, //是否显示
    fixed: true, //是否固定
    sortable: false //是否排序
  },
  {
    prop: "date", //对应数据
    label: "日期", //列名称
    width: "", //列宽
    isShow: true, //是否显示
    fixed: false, //是否固定
    sortable: false //是否排序
  },
  {
    prop: "address", //对应数据
    label: "地址", //列名称
    width: "", //列宽
    isShow: true, //是否显示
    fixed: false, //是否固定
    sortable: false, //是否排序
    tooltip:true,//超出是否隐藏
    slot: "address"
  },
  {
    prop: "orgCn", //对应数据
    label: "部门", //列名称
    width: "", //列宽
    isShow: true, //是否显示
    fixed: false, //是否固定
    sortable: false, //是否排序
  },
  {
    prop: "age", //对应数据
    label: "年龄", //列名称
    width: "", //列宽
    isShow: true, //是否显示
    fixed: false, //是否固定
    sortable: false, //是否排序
  },
  {
    prop: "phone", //对应数据
    label: "联系方式", //列名称
    width: "", //列宽
    isShow: true, //是否显示
    fixed: false, //是否固定
    sortable: false, //是否排序
  },
  {
    prop: "useHeight", //对应数据
    label: "身高", //列名称
    width: "", //列宽
    isShow: true, //是否显示
    fixed: false, //是否固定
    sortable: false, //是否排序
  },
  {
    prop: "School", //对应数据
    label: "地址", //列名称
    width: "", //列宽
    isShow: true, //是否显示
    fixed: false, //是否固定
    sortable: false, //是否排序
  },
  {
    prop: "Occupation", //对应数据
    label: "职业", //列名称
    width: "", //列宽
    isShow: true, //是否显示
    fixed: false, //是否固定
    sortable: false, //是否排序
  }
];

export const colconfig = {
  key: "address1"
};

export const initTableConfig = [
  "name",
  "age",
  "address",
  "phone",
  "status",
  "imges"
];
export const preTableConfig = [
  "name",
  "age",
  "address",
  "phone",
  "status",
  "imges"
];
