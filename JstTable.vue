<template>
    <div tabindex="1" v-on:keyup.up="onkeyUp" v-on:keyup.down="onkeyDown" v-on:keyup.left="onkeyLeft"
         v-on:keyup.right="onkeyRight"
         v-on:mouseleave="onMouseLeave"
         class="table-box" v-loading="myLoading">
        <el-row class="operate" v-if="colconfig">
            <span class="operate-list">
                <i class="iconfont iconshuaxin"  v-on:click="handleCurrentChange(1)"></i>
            </span>
            <el-popover placement="bottom"
                        width="520"
                        trigger="click"
                        v-model="setTableConfig"
                        popper-class="pad0">
                <div style="max-height:350px;overflow-y:auto;padding:16px">
                    <div v-if="specialcol?specialcol.indexOf('number')>-1:false">
                        <el-checkbox disabled :value="true"></el-checkbox>
                        <span class="F666 marL15 text12">序号</span>
                    </div>
                    <el-row v-for="(item,index) in tableConfigData" class="marT10" type="flex" justify="space-between" style="align-items:center">
                        <el-col :span="8" style="padding-right:10px;">
                            <el-checkbox v-model="item.isShow" v-on:change="setTableCol" :disabled="item.required"></el-checkbox>
                            <span class="F666 marL15 text12" style="white-space: inherit;">{{item.label}}</span>
                        </el-col>
                        <el-col :span="7" style="padding-right:10px;">
                            <span class="text12">宽度</span><el-input v-model="item.width" class="hasupdown" type="number" style="width:70px;margin-left:5px;" size="small"></el-input>
                        </el-col>
                        <el-col :span="6">
                            <template v-if="(tableConfigData.filter(e=>e.fixed)).length!=3||item.fixed">
                                <span class="F666 text12">是否固定</span>
                                <el-switch v-model="item.fixed"
                                           active-color="#257FEA"
                                           inactive-color="#E1E3E6">
                                </el-switch>
                            </template>
                        </el-col>
                        <el-col :span="3" class="operate-moves">
                            <i class="iconfont iconshangyi1" v-on:click="tableConfigMove('up',index)" v-if="index != 0"></i>
                            <i class="iconfont iconxiayi" v-on:click="tableConfigMove('down',index)" v-if="index != tableConfigData.length-1"></i>
                        </el-col>
                    </el-row>
                </div>
                <el-row class="tRight" style="padding:15px 10px 10px; box-shadow: 0px -3px 6px rgba(123,123,123,0.06);">
                    <el-button plain v-on:click="saveTableConfig(true)">恢复默认</el-button>
                    <el-button plain v-on:click="cancelTableConfig">取消</el-button>
                    <el-button type="primary" plain v-on:click="saveTableConfig">保存</el-button>
                </el-row>
                <span class="operate-list" slot="reference">
                    <i class="iconfont iconliepeizhi"></i>
                    <span class="text12">列配置</span>
                </span>
            </el-popover>
        </el-row>
        <el-table ref="defultTable" :data="tabledata" :height="tableHeight" :row-style="{height:'40px'}" :cell-style="{padding:'3.5px 0'}"
                  :header-row-style="{height:'40px'}" :header-cell-style="{padding:'10px 0'}" :default-sort="{prop: '', order: 'ascending'}" border
                  v-on:selection-change="handleSelectionChange" highlight-current-row v-on:row-click="rowClick"
                  :row-key="getRowKeys">
            <el-table-column fixed type="selection" width="40" v-if="specialcol?specialcol.indexOf('selection')>-1:false" :reserve-selection="isReserveRow">
            </el-table-column>
            <el-table-column fixed type="index"  :index="indexMethod" width="50" label="序号 v-if="specialcol?specialcol.indexOf('number')>-1:false">
            </el-table-column>
            <el-table-column v-for="(item,index) in tableConfigData" :prop="item.prop" :fixed="item.fixed"
                             :label="item.isSearch?'':item.label" :width="lastShowColIndex==index?'auto':item.width" min-width="140"
                             :sortable="item.sortable" :key="index" :align="item.align?item.align:'left'"
                             :header-align="item.headerAlign?item.headerAlign:'left'"
                             v-if="item.isShow">
                <template slot="header" v-if="item.isSearch">
                    <el-popover placement="bottom-start" width="200" trigger="click">
                        <el-input placeholder="请输入内容" v-model="searchVal" v-on:focus="focusInput($event)" size="small" v-on:keyup.enter.native="serachCol">
                            <i slot="suffix" class="el-input__icon el-icon-search" v-on:click="serachCol(item.prop)"></i>
                        </el-input>
                        <span slot="reference" class="cursorP">
                            {{item.label}}
                            <el-tooltip content="点击关闭tooltip功能" placement="top" effect="light">
                                <span class="label-tip"></span>
                            </el-tooltip>
                            <i class="iconfont iconarrow-bottom"></i>
                        </span>
                    </el-popover>
                </template>
                <template slot-scope="scope">
                    <template v-if="item.template=='hover-modul'">
                        <span>{{scope.row[item.prop].ouderNum}}</span>
                        <i class="iconfont iconxiangqing lable-btn" v-on:click="lableBtnClick(scope.row[item.prop].modal,scope.row,$event)"></i>
                    </template>
                    <template v-else-if="item.template=='label'">
                        <template v-for="(lable,i) in scope.row[item.prop]">
                            <span class="t-lable-icon " v-if="lable.status == 'icon'">
                                <i class="iconfont iconbiaoji"
                                   :style="{'font-size': '24px','color':lable.color}"></i>
                            </span>

                            <span class="t-lable" v-else>{{lable.name }}</span>
                        </template>
                        <i class="lable-btn iconfont iconxiugai1" v-on:click="lableBtnClick('labelModify',scope.row[item.prop],$event)"></i>
                    </template>
                    <template v-else-if="item.template=='double'">
                        <p>{{scope.row[item.prop][0]}}</p>
                        <p class="marT5 F909399">{{scope.row[item.prop][1]}}</p>
                    </template>
                    <template v-else-if="item.template=='status'">
                        <div class="table-status">
                            <i class="iconfont icondayuan" style="font-size: 12px;" :style="{'color': scope.row[item.prop].color}"></i>
                            <div :style="{'color': scope.row[item.prop].color}" class="marL5">
                                <p class="">{{scope.row[item.prop].name}}</p>
                                <P class="marT5">{{scope.row[item.prop].msg}}</P>
                                <P class="marT5" style="color:#985A0A">{{scope.row[item.prop].describe}}</P>
                            </div>
                        </div>
                    </template>
                    <template v-else-if="item.template=='edit'">
                        <div class="cursorP" v-if="(specialevent?specialevent.indexOf('disabledEdit')>-1:false)||(scope.row[item.prop].isDisabled?true:false)">
                            <p class="padY10">
                                {{ scope.row[item.prop].value}}
                            </p>
                        </div>
                        <template v-else-if="specialevent?specialevent.indexOf('rowClickEdit')>-1:false">
                            <el-input v-model="scope.row[item.prop].value"
                                      v-show="scope.row[item.prop].isEdit"
                                      size="small" v-on:click.native.stop
                                      v-on:input="changVal({val:scope.row[item.prop].value,interval:item.interval})"
                                      v-on:focus="focusInput($event)"
                                      :type="item.type?item.type:'text'"></el-input>
                            <p class="cursorP padY10" v-show="!scope.row[item.prop].isEdit">
                                {{ scope.row[item.prop].value}}
                            </p>
                        </template>
                        <template v-else>
                            <el-input v-model="scope.row[item.prop].value" v-show="scope.row[item.prop].isEdit" size="small"
                                      v-on:blur="editSave({index:scope.$index, row:scope.row,val:scope.row[item.prop].value,key:item.prop,interval:item.interval,event:$event})"
                                      v-on:focus="focusInput($event,scope.row[item.prop].value)"
                                      :type="item.type?item.type:'text'"></el-input>
                            <p v-show="!scope.row[item.prop].isEdit" class="cursorP padY10" v-on:dblclick.stop="editCon(scope.$index, scope.row,$event,item.prop)">
                                {{ scope.row[item.prop].value}}
                            </p>
                        </template>
                    </template>
                    <template v-else-if="item.template=='input'">
                        <template v-if="typeof scope.row[item.prop]==='object'">
                            <div class="cursorP" v-if="scope.row[item.prop].isDisabled?true:false">
                                <p class="padY10">
                                    {{ scope.row[item.prop].value}}
                                </p>
                            </div>
                            <template v-else>
                                <el-input v-model="scope.row[item.prop].value"
                                          v-on:blur="editSave({index:scope.$index, row:scope.row,val:scope.row[item.prop].value,key:item.prop,isHide:true,interval:item.interval,event:$event})"
                                          v-on:focus="focusInput($event,scope.row[item.prop].value)"
                                          size="small"
                                          :type="item.type?item.type:'text'"></el-input>
                            </template>
                        </template>
                        <template v-else>
                            <el-input v-model="scope.row[item.prop]"
                                      v-on:blur="editSave({index:scope.$index, row:scope.row,val:scope.row[item.prop],key:item.prop,isHide:true,interval:item.interval,event:$event})"
                                      v-on:focus="focusInput($event,scope.row[item.prop])"
                                      size="small"
                                      :type="item.type?item.type:'text'"></el-input>
                        </template>
                    </template>
                    <template v-else-if="item.template!='default'&&item.template">
                        <slot :name="item.template" :celldata="scope.row[item.prop]" :rowdata="scope.row"></slot>
                    </template>
                    <template v-else>
                        {{ scope.row[item.prop] }}
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="操作" v-if="specialcol?specialcol.indexOf('operate')>-1:false" width="140" fixed="right">
                <template slot-scope="scope">
                    <slot name="operate" :rowdata="scope.row"></slot>
                </template>
            </el-table-column>
            <template slot="empty">
                <div style="line-height:20px;">
                    <el-image style="width: 58px; height: 36px"
                              src="../../image/other/table_nodata.svg"
                              fit="fill"></el-image>
                    <p style="line-height:22px;color:#C0C4CB;">暂无数据</p>
                </div>
            </template>
        </el-table>
        <div v-if="pageconfig" :class="tableheight?'table-pagination table-height':'table-pagination'">
            <el-pagination v-on:size-change="handleSizeChange"
                           v-on:current-change="handleCurrentChange"
                           layout="total, sizes, prev, pager, next, jumper"
                           :pager-count="5"
                           :page-sizes="pageconfig.sizes?pageconfig.sizes:[20,50,100,150]"
                           :page-size="pageconfig.pageSize?pageconfig.pageSize:50"
                           :current-page="pageconfig.pageIndex?pageconfig.pageIndex:1"
                           :total="pageconfig.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    module.exports = {
        data()
        {
            return {
                curcellIndex: 0,
                curtbody: '',
                curRowIndex: 0,
                tableFixed: '',
                tableHeight: this.tableheight ? this.height : (this.pageconfig ? (this.height - 37) : this.height),
                searchVal: '',
                showEditData: null,
                showEdit: null,
                beforChangeValue: '',
                clickRowIndex: -1,
                inputChange: false,
                setTableConfig: false,
                myLoading: false,
                isReserveRow: this.reserverow ? true : false,
                initTableConfig: JSON.parse(JSON.stringify(this.tableconfig)),
                preTableConfig: [],
                tableConfigData: JSON.parse(JSON.stringify(this.tableconfig)),
                lastShowColIndex: this.tableconfig.length - 1
            }
        },
        props: {
            //查询loading、默认值为false
            tabledata: {
                type: Array,
            },
            tableconfig: {
                type: Array,
            },
            pageconfig: {
                type: Object,
            },
            specialevent: {
                type: String,
            },
            height: {
                type: String,
                default: '600'
            },
            operate: {
                type: String,
            },
            specialcol: {
                type: String,
            },
            tableheight: {
                type: Boolean,
                default: false
            },
            colconfig: {
                type: Object,
            },
            reserverow: {
                type: String
            }
        },
        watch: {
            height: function (val)
            {
                //外部修改高度后 赋值给使用的高度
                this.tableHeight = val
            },
            tableconfig: function (val)
            {
                //外部修改列配置后赋值给显示使用的tableconfig
                this.tableConfigData = val;
            }
        },
        methods: {
            //绑定行key
            getRowKeys(row)
            {
                if (this.reserverow)
                {
                    return row[this.reserverow]
                }
            },
            //序号计算
            indexMethod(index)
            {

                return this.pageconfig?((this.pageconfig.pageIndex - 1) * this.pageconfig.pageSize + index + 1):(index+1)
            },
            //列配置设置
            setTableCol()
            {
                this.countColWidth();
            },
            //核算宽度
            countColWidth()
            {
                let arr = JSON.parse(JSON.stringify(this.tableConfigData))
                let i = arr.reverse().findIndex(e => e.isShow == true);
                this.lastShowColIndex = arr.length - 1 - i;
            },
            //取消列配置
            cancelTableConfig()
            {
                this.setTableConfig = false;
                this.tableConfigData = this.preTableConfig.length ? JSON.parse(JSON.stringify(this.preTableConfig)) : JSON.parse(JSON.stringify(this.initTableConfig));
                this.countColWidth();
            },
            //获取tableconfig
            getTableConfig()
            {
                let localUpDate = false;
                var that = this;
                that.myLoading = true;
                axios.post('/goods/sample/getJstTableConfigs', { 'key': that.colconfig.key,'elementId':that.colconfig.elementId })
                    .then((response) =>
                    {
                        that.myLoading = false;
                        if (response.data.Data.length == 0)
                        {
                            return;
                        }
                        let resTableConfig = JSON.parse(response.data.Data[0].Value);
                        that.tableConfigData.forEach((e, i) =>
                        {
                            if (!resTableConfig.find(ele => e.prop == ele.prop))
                            {
                                resTableConfig.splice(i, 0, e);
                                localUpDate = true;
                            }
                        });
                        resTableConfig.forEach((e, i) =>
                        {
                            if (!that.tableConfigData.find(ele => e.prop == ele.prop))
                            {
                                resTableConfig.splice(i, 1);
                                localUpDate = true;
                                return false;
                            }
                            that.tableConfigData.forEach((ele, j) =>
                            {
                                if (e.prop == ele.prop)
                                {
                                    e.template = ele.template;
                                    e.prop = ele.prop;
                                    e.label = ele.label;
                                }
                            })

                        });
                        that.tableConfigData = resTableConfig;
                        that.preTableConfig = JSON.parse(JSON.stringify(that.tableConfigData));
                        this.countColWidth();
                        if (localUpDate)
                        {
                            that.colconfig.value = JSON.stringify(that.tableConfigData);
                            axios.post('/goods/sample/saveJstTableConfig', that.colconfig);
                        }
                    })
                    .catch((error) =>
                    {
                        that.myLoading = false;
                    });
            },
            //保存及恢复默认列配置
            saveTableConfig(defaults)
            {

                var that = this;
                if (defaults == true)
                {
                    that.tableConfigData = JSON.parse(JSON.stringify(this.initTableConfig));
                }
                that.colconfig.value = JSON.stringify(this.tableConfigData);
                this.setTableConfig = false;
                axios.post('/goods/sample/saveJstTableConfig', that.colconfig)
                    .then((response) =>
                    {
                        this.$message({ message: response.data.Message, type: 'success' });
                    })
                    .catch((error) =>
                    {
                    });
            },
            //表格排序变化
            tableConfigMove(direction, index)
            {
                if (direction == 'up')
                {
                    this.tableConfigData[index] = this.tableConfigData.splice(index - 1, 1, this.tableConfigData[index])[0];
                } else if (direction == 'down')
                {
                    this.tableConfigData[index + 1] = this.tableConfigData.splice(index, 1, this.tableConfigData[index + 1])[0];
                }
            },
            //选择框点击事件
            handleSelectionChange(val)
            {
                this.$emit('multi-select', val)
            },
            //值改变时触发
            changVal(edit = {})
            {
                if (edit.interval)
                {
                    if (edit.interval[0] != null && edit.interval[0] > Number(edit.val))
                    {
                        this.$message({
                            message: '值必须大于或等于' + edit.interval[0],
                            type: 'error'
                        })
                        window.event.srcElement.classList.add('input-error')
                        return false;
                    } else if (edit.interval[1] != null && edit.interval[1] < Number(edit.val))
                    {
                        this.$message({
                            message: '值必须小于或等于' + edit.interval[1],
                            type: 'error'
                        })
                        window.event.srcElement.classList.add('input-error')
                        return false;
                    } else
                    {
                       window.event.srcElement.classList.remove('input-error')
                    }
                }
                if (!this.inputChange)
                {
                    this.inputChange = true;
                }
            },
            //双击修改事件
            editCon(index, row, e, key)
            {
                row[key].isEdit = true;
                this.$set(this.tabledata, this.tabledata.indexOf(row), row);
                this.$nextTick(() =>
                {
                    e.currentTarget.previousElementSibling.children[0].focus();
                });
                this.showEdit = {
                    row, key, index
                }
            },
            //input失去光标保存事件
            editSave(edit = {})
            {
                if (edit.interval)
                {
                    if (edit.interval[0] != null&&edit.interval[0] > Number(edit.val))
                    {
                        this.$message({
                            message: '值必须大于或等于' + edit.interval[0],
                            type: 'error'
                        })
                        edit.event.currentTarget.classList.add('input-error')
                        return false;
                    } else if (edit.interval[1] != null&&edit.interval[1] < Number(edit.val))
                    {
                        this.$message({
                            message: '值必须小于或等于' + edit.interval[1],
                            type: 'error'
                        })
                        edit.event.currentTarget.classList.add('input-error')
                        return false;
                    } else
                    {
                        edit.event.currentTarget.classList.remove('input-error')
                    }
                }
                if (!edit.isHide)
                {
                    //input模板 不需要设置
                    edit.row[edit.key].isEdit = false;
                    this.showEdit = null;
                    this.$set(this.tabledata, edit.index, edit.row);
                }
                //判断值是否做出修改
                if (edit.val !== this.beforChangeValue)
                {
                    this.$emit('edit-save', { id: edit.row.id, data:edit.key, val:edit.val, row: edit.row })
                } else
                {
                    this.$notify({
                       title: '提示',
                       message: '暂未修改!',
                       type: 'warning',
                       duration: 1500,
                       position: 'bottom-right'
                    });
                }
            },
            //单击行事件
            rowClick(row, column, event)
            {
                let index = this.tabledata.indexOf(row);
                let flag = true;
                this.clickRowIndex = index;
                //判断是否已有编辑的行存在
                if (this.showEditData)
                {
                    for (let i in this.showEditData.row)
                    {
                        if (this.showEditData.row[i].isEdit != undefined)
                        {
                            this.showEditData.row[i].isEdit = false;
                        }
                    }
                    this.$set(this.tabledata, this.showEditData.index, this.showEditData.row);
                    if (this.inputChange)
                    {
                        this.$emit('edit-row-save', this.showEditData.row)
                        this.inputChange = false;
                    }
                    if (this.showEditData.index == index)
                    {
                        flag = false;
                    }
                    this.showEditData = null
                }
                if (flag)
                {
                    if (this.specialevent ? this.specialevent.indexOf('rowClickEdit') > -1 : false)
                    {
                        this.showEditData = {
                            index,
                            row
                        };
                        for (let i in row)
                        {
                            if (row[i].isEdit != undefined)
                            {
                                row[i].isEdit = true;
                            }
                        }
                        this.$set(this.tabledata, index, row);
                        if (this.curtbody)
                        {
                            this.$nextTick(() =>
                            {
                                //纯input框获取光标
                                this.curtbody.children[index].getElementsByClassName('el-input__inner')[this.curcellIndex].focus();
                            })
                        }
                    }
                    this.$emit('row-click', row);
                }
            },
            //input选中内容
            focusInput(e, val)
            {
                e.currentTarget.select();
                if (val)
                {
                    this.beforChangeValue = val;
                }
                let input = document.activeElement;//当前input
                let curel = input.parentElement.parentElement.parentElement;//当前input单元格

                let inputAll = curel.parentElement.getElementsByClassName('el-input__inner');//当前行所有input
                this.curRowIndex = curel.parentElement.sectionRowIndex; //当前input行的索引；
                this.curtbody = curel.parentElement.parentElement;//所有tr
                for (let i = 0; i < inputAll.length; i++)
                {
                    if (input == inputAll[i])
                    {
                        this.curcellIndex = i;//第几个input
                        break;
                    }
                }
            },
            //键盘向上
            onkeyUp(ev)
            {
                if (this.specialevent ? !(this.specialevent.indexOf('keyboard') > -1) : true)
                {
                    return;
                }
                if (this.curtbody)
                {
                    let index = this.clickRowIndex - 1;
                    if (index < 0)
                    {
                        index = this.tabledata.length - 1;
                    }
                    let row = this.tabledata[index];
                    this.$refs.defultTable.setCurrentRow(row);
                    this.clickRowIndex = index;
                    //prev input获取光标
                    if (this.specialevent ? this.specialevent.indexOf('rowClickEdit') > -1 : false)
                    {
                        //行编辑模板获取光标
                        this.rowClick(row);
                    } else
                    {
                        //纯input框获取光标
                        this.curtbody.children[index].getElementsByClassName('el-input__inner')[this.curcellIndex].focus();
                    }
                    this.$emit('press-key', row)
                }
            },
            //键盘向下
            onkeyDown(ev)
            {
                if (this.specialevent ? !(this.specialevent.indexOf('keyboard') > -1) : true)
                {
                    return;
                }
                if (this.curtbody)
                {

                    let index = this.clickRowIndex + 1;
                    if (index > this.tabledata.length - 1)
                    {
                        index = 0;
                    }
                    let row = this.tabledata[index];
                    this.$refs.defultTable.setCurrentRow(row);
                    this.clickRowIndex = index;
                    //next input获取光标
                    if (this.specialevent ? this.specialevent.indexOf('rowClickEdit') > -1 : false)
                    {
                        //行编辑模板获取光标
                        this.rowClick(row);
                    } else
                    {
                        //纯input框获取光标
                        this.curtbody.children[index].getElementsByClassName('el-input__inner')[this.curcellIndex].focus();
                    }
                    this.$emit('press-key', row)
                }
            },
            //键盘向左
            onkeyLeft(ev)
            {
                if (this.specialevent ? !(this.specialevent.indexOf('keyboard') > -1) : true)
                {
                    return;
                }
                this.curcellIndex -= 1;
                let inputAll = this.curtbody.children[this.curRowIndex].getElementsByClassName('el-input__inner');
                if (this.curcellIndex < 0)
                {
                    this.curcellIndex = inputAll.length - 1;
                }
                let isHidden = inputAll[this.curcellIndex].parentElement.parentElement.parentElement.classList.contains('is-hidden');
                if (isHidden)
                {
                    let table = this.curtbody.parentElement.parentElement;
                    inputAll = table.classList.contains('el-table__fixed-body-wrapper') ? table.parentElement.previousSibling.previousSibling.getElementsByClassName('el-table__row')[this.curRowIndex].getElementsByClassName('el-input__inner') : table.nextSibling.nextSibling.getElementsByClassName('el-table__row')[this.curRowIndex].getElementsByClassName('el-input__inner');
                }
                inputAll[this.curcellIndex].focus();
            },
            //键盘向右
            onkeyRight(ev)
            {
                if (this.specialevent ? !(this.specialevent.indexOf('keyboard') > -1) : true)
                {
                    return;
                }
                this.curcellIndex += 1;
                let inputAll = this.curtbody.children[this.curRowIndex].getElementsByClassName('el-input__inner');
                if (this.curcellIndex == inputAll.length)
                {
                    this.curcellIndex = 0;
                }
                let isHidden = inputAll[this.curcellIndex].parentElement.parentElement.parentElement.classList.contains('is-hidden');
                if (isHidden)
                {
                    let table = this.curtbody.parentElement.parentElement;
                    inputAll = table.classList.contains('el-table__fixed-body-wrapper') ? table.parentElement.previousSibling.previousSibling.getElementsByClassName('el-table__row')[this.curRowIndex].getElementsByClassName('el-input__inner') : table.nextSibling.nextSibling.getElementsByClassName('el-table__row')[this.curRowIndex].getElementsByClassName('el-input__inner');
                }
                inputAll[this.curcellIndex].focus();
            },
            //鼠标离开事件
            onMouseLeave()
            {
                //鼠标离开表格时取消表格的编辑状态
                if ((this.specialevent ? this.specialevent.indexOf('rowClickEdit') > -1 : false) && this.showEditData)
                {
                    //行编辑取消
                    this.rowClick(this.showEditData.row);
                } else if (this.showEdit)
                {
                    //双击编辑球销
                    this.showEdit.row[this.showEdit.key].isEdit = false;
                    this.$set(this.tabledata, this.showEdit.index, this.showEdit.row);
                    this.showEdit = null;
                }
            },
            //小按钮点击事件
            lableBtnClick(val, row, e)
            {
                e.currentTarget.classList.add("active");
                this.$emit('lable-btn', val, row)
            },
            //列搜索事件
            serachCol(col)
            {
                //解决点击搜索后不能影藏搜索框
                document.getElementsByClassName('table-box')[0].click();
                this.$emit('search-col', {
                    col: col,
                    value: this.searchVal
                })
            },
            //分页条数改变时触发
            handleSizeChange(val)
            {
                this.pageconfig.pageSize = val;
                this.pageconfig.pageIndex = 1;
                this.$emit('page-change');
                //滚动条复位
                this.$nextTick(() =>
                {
                    this.$refs.defultTable.bodyWrapper.scrollTop = 0;
                })
            },
            //页码改变时触发
            handleCurrentChange(val)
            {
                this.pageconfig.pageIndex = val;
                this.$emit('page-change');
                //滚动条复位
                this.$nextTick(() =>
                {
                    this.$refs.defultTable.bodyWrapper.scrollTop = 0;
                })
            },
            //根据ref执行的外部事件
            getRef()
            {
                this.$emit('get-ref', this.$refs.defultTable);
            },
        },
        mounted()
        {
            //抛出ref
            this.getRef();
            if (this.colconfig)
            {
                this.getTableConfig();
            }
        }
    }
</script>

<style scoped>

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
        background-color: #F0F5FD;
    }

    .el-table__body tr {
        color: #303133;
        font-size: 12px;
        font-weight: 400;
    }

    .t-lable {
        display: inline-block;
        background: #ECF4FF;
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

    .el-pagination button:disabled, .el-pager li, .el-pagination .btn-prev,.el-pagination button:disabled,.el-pagination .btn-next {
        background-color: transparent;
    }

    .operate {
        position: absolute;
        top: -25px;
        right: 0px;
    }

    .operate-list {
        color: #2263E6;
        cursor: pointer;
        margin-left: 14px;
    }

        .operate-list i {
            color: #2263E6;
            font-size: 12px;
        }




    .el-table__fixed-right::before, .el-table__fixed::before {
        display: none
    }

    input[type="number"] {
        padding-right: 0;
    }

    .el-input__inner.input-error {
        border-color: #F56C6C;
    }
    .el-pagination button, .el-pagination span:not([class*=suffix]) ,.el-pagination__sizes .el-input .el-input__inner{
        font-size: 12px;
    }
</style>