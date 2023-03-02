<template>
  <div class="app-container">
    <!-- 查询表单 -->
    <RisleyQueryForm
      :model="queryFormModel"
      :formList="formList"
      @handleQuery="handleQuery"
    />
    <!-- 按钮组 -->
    <div class="risley-buttons-container">
      <RisleyButtons :buttons="buttons" @handleClick="handleAboveClick" />
    </div>

    <!-- 表格排序变化 -->
    <RisleyCustomTable
      :preTableConfig="preTableConfig"
      :initTableConfig="initTableConfig"
      :tableconfig="tableconfig"
      :pageconfig="pageconfig"
      :specialcol="'selection,number,operate'"
      :tabledata="tabledata"
    >
      <template #address="{ row }">
        {{ row.address }}
      </template>
      <template slot="operate" slot-scope="data">
        <el-button type="text">编辑</el-button>
        <el-button type="text">详情</el-button>
      </template>
    </RisleyCustomTable>
  </div>
</template>
<script>
import * as FORMMODEL from "./formModel";
export default {
  data() {
    return {
      // 查询参数
      queryFormModel: {
        deptName: "", //部门名称
        status: undefined // 状态
      },
      formList: FORMMODEL.formList,
      buttons: FORMMODEL.buttons,
      preTableConfig: JSON.parse(JSON.stringify(FORMMODEL.tableConfigList)),
      initTableConfig: JSON.parse(JSON.stringify(FORMMODEL.tableConfigList)),
      tableconfig: FORMMODEL.tableConfigList,
      tabledata: FORMMODEL.tableDatas,
      pageconfig: {
        total: 0,
        pageSize: 10,
        pageIndex: 1,
        sizes: [10, 20, 50, 100]
      }
    };
  },
  mounted() {
    console.log(FORMMODEL.tableConfigList);
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery(query) {
      this.getList();
    },
    // 按钮组点击回调
    handleAboveClick(buttons, index) {
      console.log(buttons, index);
      if (buttons.useKey === "add") {
        this.handleAdd();
      }
    },

    multiSelect(val, data, node) {
      console.log(val, data, node, "多选框勾选时");
    },

    editSave(val, data, node) {
      console.log(val, data, node, "输入框修改完成时");
    },
    editRowSave(val, data, node) {
      console.log(val, data, node, "选中其他行或再次单击行时触发");
    },
    pressKey(val, data, node) {
      console.log(val, data, node, "键盘上下左右键选中");
    },
    lableBtn(val, data, node) {
      console.log(val, data, node, "小按钮“详”，“改”等点击事件");
    },
    searchCol(val, data, node) {
      console.log(val, data, node, "列搜索，点击搜索按钮时触发的事件");
    },
    pageChange(val, data, node) {
      console.log(val, data, node, "分页选择每页/条，页面切换时触发");
    }
  }
};
</script>
<style lang="scss" scoped>
.risley-buttons-container {
  margin-bottom: 18px;
}
</style>
