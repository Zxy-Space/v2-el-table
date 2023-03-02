<template>
  <div tabindex="1" class="table-box" v-loading="myLoading">
    <el-row class="operate">
      <span class="operate-list">
        <i class="iconfont iconshuaxin" v-on:click="handleCurrentChange(1)"></i>
      </span>
      <el-popover
        placement="bottom"
        width="520"
        trigger="click"
        v-model="setTableConfig"
        popper-class="pad0"
      >
        <div style="max-height:350px;overflow-y:auto;padding:16px">
          <div v-if="specialcol ? specialcol.indexOf('number') > -1 : false">
            <el-checkbox disabled :value="true"></el-checkbox>
            <span class="F666 marL15 text12">序号</span>
          </div>
          <el-row
            v-for="(item, index) in preTableConfig"
            class="marT10"
            type="flex"
            justify="space-between"
            style="align-items:center"
          >
            <el-col :span="8" style="padding-right:10px;">
              <el-checkbox
                v-model="item.isShow"
                v-on:change="setTableCol"
                :disabled="item.required"
              ></el-checkbox>
              <span class="F666 marL15 text12" style="white-space: inherit;">{{
                item.label
              }}</span>
            </el-col>
            <el-col :span="7" style="padding-right:10px;">
              <span class="text12">宽度</span
              ><el-input
                v-model="item.width"
                class="hasupdown"
                type="number"
                style="width:70px;margin-left:5px;"
                size="small"
              ></el-input>
            </el-col>
            <el-col :span="6">
              <template
                v-if="
                  preTableConfig.filter(e => e.fixed).length != 2 || item.fixed
                "
              >
                <span class="F666 text12">是否固定</span>
                <el-switch
                  v-model="item.fixed"
                  active-color="#257FEA"
                  inactive-color="#E1E3E6"
                >
                </el-switch>
              </template>
            </el-col>
            <el-col :span="3" class="operate-moves">
              <i
                class="iconfont el-icon-sort-down"
                v-on:click="tableConfigMove('down', index)"
                v-if="index != preTableConfig.length - 1"
              ></i>
              <i
                class="iconfont el-icon-sort-up"
                v-on:click="tableConfigMove('up', index)"
                v-if="index != 0"
              ></i>
            </el-col>
          </el-row>
        </div>
        <el-row
          class="tRight"
          style="padding:15px 10px 10px; box-shadow: 0px -3px 6px rgba(123,123,123,0.06);"
        >
          <el-button plain v-on:click="saveTableConfig(true)"
            >恢复默认</el-button
          >
          <el-button plain v-on:click="cancelTableConfig">取消</el-button>
          <el-button type="primary" plain v-on:click="saveTableConfig(false)"
            >保存</el-button
          >
        </el-row>
        <span class="operate-list" slot="reference">
          <i class="iconfont iconliepeizhi"></i>
          <span class="text12">列配置</span>
        </span>
      </el-popover>
    </el-row>

    <!------------- 表格开始 ----------->
    <el-table
      ref="defultTable"
      :data="tabledata"
      :height="tableHeight"
      :row-style="{ height: '40px' }"
      :cell-style="{ padding: '3.5px 0' }"
      :header-row-style="{ height: '40px' }"
      :header-cell-style="{ padding: '10px 0' }"
      :default-sort="{ prop: '', order: 'ascending' }"
      border
      v-on:selection-change="handleSelectionChange"
      highlight-current-row
      :row-key="getRowKeys"
    >
      <el-table-column
        fixed
        type="selection"
        width="40"
        v-if="specialcol ? specialcol.indexOf('selection') > -1 : false"
        :reserve-selection="isReserveRow"
      >
      </el-table-column>
      <el-table-column
        fixed
        type="index"
        :index="indexMethod"
        width="50"
        label="序号"
        v-if="specialcol ? specialcol.indexOf('number') > -1 : false"
      >
      </el-table-column>
      <el-table-column
        v-for="(item, index) in tableConfigData"
        :key="index"
        :prop="item.prop"
        :fixed="item.fixed"
        :label="item.label"
        :width="lastShowColIndex == index ? 'auto' : item.width"
        min-width="140"
        :sortable="item.sortable"
        :align="item.align ? item.align : 'left'"
        :header-align="item.headerAlign ? item.headerAlign : 'left'"
        v-if="item.isShow"
        :show-overflow-tooltip="item.tooltip"
      >
        <template #default="scope" v-if="item.slot">
          <slot :name="item.slot" :row="scope.row"></slot>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        v-if="specialcol ? specialcol.indexOf('operate') > -1 : false"
        width="140"
        fixed="right"
      >
        <template slot-scope="scope">
          <slot name="operate" :rowdata="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
    <!------------- 表格结束 ----------->

    <!------------- 分页器开始 ----------->
    <div
      v-if="pageconfig"
      :class="
        tableheight ? 'table-pagination table-height' : 'table-pagination'
      "
    >
      <el-pagination
        v-on:size-change="handleSizeChange"
        v-on:current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :pager-count="5"
        :page-sizes="pageconfig.sizes ? pageconfig.sizes : [20, 50, 100, 150]"
        :page-size="pageconfig.pageSize ? pageconfig.pageSize : 50"
        :current-page="pageconfig.pageIndex ? pageconfig.pageIndex : 1"
        :total="pageconfig.total"
      >
      </el-pagination>
    </div>
    <!------------- 分页器结束 ----------->
  </div>
</template>
<script>
export default {
  props: {
    //分页是否占据高度
    tableheight: {
      type: Boolean,
      default: false
    },
    //当前设置弹窗列参数
    preTableConfig: {
      type: Array,
      default: []
    },
    //全量列参数原始数据
    initTableConfig: {
      type: Array,
      default: []
    },
    //数据列详细配置数据
    tableconfig: {
      type: Array
    },
    //分页器配置
    pageconfig: {
      type: Object
    },
    tableheight: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: "600"
    },
    //特殊列配置(选框,序号,操作)
    specialcol: {
      type: String
    },
    //展示数据
    tabledata: {
      type: Array
    }
  },
  data() {
    return {
      myLoading: false, //页面loading状态
      setTableConfig: false, //列配置弹框
      tableHeight: this.tableheight
        ? this.height
        : this.pageconfig
        ? this.height - 37
        : this.height,
      tableConfigData: JSON.parse(JSON.stringify(this.tableconfig)), //展示列
      lastShowColIndex: this.tableconfig.length - 1,
      isReserveRow: this.reserverow ? true : false
    };
  },
  watch: {
    tableconfig: function(val) {
      //外部修改列配置后赋值给显示使用的tableconfig
      this.tableConfigData = val;
    }
  },
  mounted() {},
  methods: {
    /**
     * @desc 绑定行key
     */
    getRowKeys(row) {
      if (this.reserverow) {
        return row[this.reserverow];
      }
    },
    /**
     * @desc 序号计算
     */
    indexMethod(index) {
      return this.pageconfig
        ? (this.pageconfig.pageIndex - 1) * this.pageconfig.pageSize + index + 1
        : index + 1;
    },
    /**
     * @desc 页码改变时触发
     */
    handleCurrentChange(val) {
      this.pageconfig.pageIndex = val;
      this.$emit("page-change");
      //滚动条复位
      this.$nextTick(() => {
        // this.$refs.defultTable.bodyWrapper.scrollTop = 0;
      });
    },
    /**
     * @desc 分页条数改变时触发
     */
    handleSizeChange(val) {
      this.pageconfig.pageSize = val;
      this.pageconfig.pageIndex = 1;
      this.$emit("page-change");
      //滚动条复位
      this.$nextTick(() => {
        // this.$refs.defultTable.bodyWrapper.scrollTop = 0;
      });
    },
    /**
     * @desc 取消列配置
     */
    cancelTableConfig() {
      this.setTableConfig = false;
    },
    /**
     * @desc 保存及恢复默认列配置
     */
    saveTableConfig(defaults) {
      var that = this;
      if (defaults == true) {
        that.tableConfigData = JSON.parse(JSON.stringify(this.initTableConfig));
        that.preTableConfig = JSON.parse(JSON.stringify(this.initTableConfig));
      } else {
        that.tableConfigData = JSON.parse(JSON.stringify(this.preTableConfig));
      }
      this.setTableConfig = false;
      this.$nextTick(() => {
        this.countColWidth();
      });
    },
    /**
     * @desc 列配置设置
     */
    setTableCol() {
      this.countColWidth();
    },
    /**
     * @desc 核算宽度
     */
    countColWidth() {
      let arr = JSON.parse(JSON.stringify(this.tableConfigData));
      let i = arr.reverse().findIndex(e => e.isShow == true);
      this.lastShowColIndex = arr.length - 1 - i;
    },
    /**
     * @desc 表格排序变化
     */
    tableConfigMove(direction, index) {
      this.$nextTick(() => {
        if (direction == "up") {
          this.preTableConfig[index] = this.preTableConfig.splice(
            index - 1,
            1,
            this.preTableConfig[index]
          )[0];
        } else if (direction == "down") {
          this.preTableConfig[index + 1] = this.preTableConfig.splice(
            index,
            1,
            this.preTableConfig[index + 1]
          )[0];
        }
      });
    },
    /**
     * @desc 选择框点击事件
     */
    handleSelectionChange(val) {
      this.$emit("multi-select", val);
    },
    /**
     * @desc 小按钮点击事件
     */
    lableBtnClick(val, row, e) {
      e.currentTarget.classList.add("active");
      this.$emit("lable-btn", val, row);
    }
  }
};
</script>
<style lang="scss" scoped>
.th-hide {
  font-size: 12px;
  color: rgb(136, 136, 136);
  display: inline-block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  vertical-align: middle;
  padding-left: 10px;
  padding-right: 10px;
}

.el-table__fixed-right-patch {
  background-color: rgb(240, 245, 253);
}

.el-table th > .cell {
  white-space: nowrap;
}
/*排序按钮大小调整
  */
.el-table .caret-wrapper {
  height: 12px;
}

.el-table .sort-caret.ascending {
  top: -8px;
}

.el-table .sort-caret.descending {
  bottom: -3px;
}

.el-table .cell {
  overflow: inherit;
  line-height: normal;
}

.el-table thead {
  font-size: 12px;
  font-weight: bold;
  color: #888888;
}

.el-table th {
  background-color: #f0f5fd;
}

.el-table__body tr {
  color: #303133;
  font-size: 12px;
  font-weight: 400;
}

.t-lable {
  display: inline-block;
  background: #ecf4ff;
  border-radius: 2px;
  font-size: 12px;
  color: #909399;
  padding: 4px 6px;
  margin: 3px;
}

.t-lable-icon {
  display: inline-block;
  margin: 3px;
  vertical-align: bottom;
}

.table-status {
  display: flex;
  align-items: baseline;
}

.lable-btn {
  font-size: 14px;
  color: rgb(34, 99, 230);
  margin-right: 10px;
  cursor: pointer;
  display: none;
  position: absolute;
  top: 50%;
  margin-top: -9px;
  right: 6px;
}

.lable-btn:hover {
}

.lable-btn.active {
}

.el-table__row.hover-row .lable-btn {
  display: block;
}

.el-table__row.current-row .lable-btn {
  display: block;
}

.el-table .iconarrow-bottom {
  font-size: 12px;
  margin-left: 6px;
}

.table-box {
  background-color: #fff;
  position: relative;
  z-index: 1;
}

.table-box:focus {
  outline: none;
}

.table-pagination {
  display: flex;
  justify-content: flex-end;
  padding-top: 5px;
}

.table-pagination.table-height {
  position: absolute;
  bottom: -36px;
  right: 0;
  padding: 0;
}

.el-pagination button:disabled,
.el-pager li,
.el-pagination .btn-prev,
.el-pagination button:disabled,
.el-pagination .btn-next {
  background-color: transparent;
}

.operate {
  position: absolute;
  top: -25px;
  right: 0px;
}

.operate-list {
  color: #2263e6;
  cursor: pointer;
  margin-left: 14px;
}

.operate-list i {
  color: #2263e6;
  font-size: 12px;
}

.el-table__fixed-right::before,
.el-table__fixed::before {
  display: none;
}

input[type="number"] {
  padding-right: 0;
}

.el-input__inner.input-error {
  border-color: #f56c6c;
}
.el-pagination button,
.el-pagination span:not([class*="suffix"]),
.el-pagination__sizes .el-input .el-input__inner {
  font-size: 12px;
}
.iconfont {
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
