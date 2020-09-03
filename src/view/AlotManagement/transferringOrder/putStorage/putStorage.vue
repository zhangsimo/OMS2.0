<template>
  <main
    class="bigBox"
    style="background-color: #fff; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1); height:100%"
  >
    <div class="content-oper content-oper-flex" style="box-shadow:none">
      <section class="oper-box">
        <div class="oper-top flex">
          <div class="wlf">
            <div class="db">
              <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>
              <Select v-model="form.status" @on-change="getDataType" class="w90 mr10">
                <Option
                  v-for="item in purchaseTypeArr"
                  :value="item.value"
                  :key="item.value"
                >{{item.label}}</Option>
              </Select>
            </div>
            <div class="db">
              <Button type="default" @click="more" class="mr10">
                <i class="iconfont mr5 iconchaxunicon"></i>更多
              </Button>
            </div>
            <div class="db">
              <Button v-has="'add'" class="mr10" @click="xinzeng">
                <Icon type="md-add" />新增
              </Button>
            </div>
            <div class="db">
              <Button v-has="'save'" type="default" class="mr10" @click="baocun1">
                <i class="iconfont mr5 iconbaocunicon"></i>保存
              </Button>
            </div>
            <!-- <div class="db">
              <Button v-has="'submit'" class="mr10" @click="tijiao1">
                <Icon type="md-checkmark" size="14" />提交
              </Button>
            </div>-->
            <div class="db">
              <Button v-has="'godown'" class="mr10" @click="chuku" :disabled="Status == 1 || Status == 2">
                <Icon type="md-checkmark" size="14" />入库
              </Button>
            </div>
            <div class="db">
              <Button v-has="'cancellation'" class="mr10" @click="zuofei1" :disabled="Status == 1 || Status == 2">
                <Icon type="md-close" size="14" />作废
              </Button>
            </div>
            <div class="db">
              <Button v-has="'print'" class="mr10" @click="printTable">
                <i class="iconfont mr5 icondayinicon"></i> 打印
              </Button>
            </div>
            <div class="db">
              <div class="mt5"><Checkbox v-model="showSelf" @on-change="showOwen">显示个人单据</Checkbox></div>
            </div>
          </div>
        </div>
      </section>
      <section class="con-box">
        <div class="inner-box">
          <div class="con-split" ref="paneLeft">
            <Split v-model="split1" min="200" @on-moving="getDomHeight">
              <div slot="left" class="con-split-pane-left" style="overflow-y: auto; height: 100%;">
                <div class="pane-made-hd">调拨入库列表</div>
                <Table
                  ref="tableref"
                  :height="leftTableHeight"
                  @on-current-change="selectTabelData"
                  size="small"
                  highlight-row
                  border
                  :stripe="true"
                  :columns="Left.columns"
                  :data="Left.tbdata"
                ></Table>
                <Page
                  size="small"
                  :total="Left.page.total"
                  :page-size="Left.page.size"
                  :current="Left.page.num"
                  :page-size-opts="Left.page.opts"
                  show-sizer
                  show-total
                  class-name="page-con"
                  @on-change="changePage"
                  @on-page-size-change="changeSize"
                  class="mr10"
                ></Page>
              </div>
              <div slot="right" class="con-split-pane-right pl5 goods-list-form">
                <div class="pane-made-hd">调拨入库信息</div>
                <div v-if="showit" class="clearfix purchase" ref="planForm">
                  <Form inline :show-message="false" ref="formPlan" :label-width="120">
                    <FormItem label="调出方：" prop="supplyName" class="redIT">
                      <Row>
                        <Col span="22">
                          <Tooltip :content="Leftcurrentrow.guestName">
                          <Input
                            readonly
                            :disabled="true"
                            v-model="Leftcurrentrow.guestName"
                            placeholder="请选择调出方"
                          ></Input>
                          </Tooltip>
                        </Col>
                        <!--<Col span="2">-->
                        <!--&lt;!&ndash;<Button&ndash;&gt;-->
                        <!--&lt;!&ndash;:disabled="Leftcurrentrow.status.value != 0"&ndash;&gt;-->
                        <!--&lt;!&ndash;@click="showModel"&ndash;&gt;-->
                        <!--&lt;!&ndash;class="ml5"&ndash;&gt;-->
                        <!--&lt;!&ndash;size="small"&ndash;&gt;-->
                        <!--&lt;!&ndash;type="default"&ndash;&gt;-->
                        <!--&lt;!&ndash;&gt;&ndash;&gt;-->
                        <!--&lt;!&ndash;<i class="iconfont iconxuanzetichengchengyuanicon"></i>&ndash;&gt;-->
                        <!--&lt;!&ndash;</Button>&ndash;&gt;-->
                        <!--</Col>-->
                      </Row>
                    </FormItem>
                    <FormItem label="调入仓库：" prop="storeId" class="redIT">
                      <Row class="w160">
                        <Col span="24">
                          <Select v-model="Leftcurrentrow.storeId" :disabled="true">
                            <!--<Option-->
                            <!--v-for="item in cangkuListall"-->
                            <!--:value="item.value"-->
                            <!--:key="item.value"-->
                            <!--&gt;{{item.label}}</Option>-->
                            <Option
                              v-for="item in cangkuListall"
                              :value="item.id"
                              :disabled="item.isDisabled"
                              :key="item.id"
                            >{{ item.name }}</Option>
                          </Select>
                        </Col>
                      </Row>
                    </FormItem>
                    <FormItem label="调拨申请日期：" prop="billType" class="redIT">
                      <DatePicker
                        :disabled="true"
                        :value="Leftcurrentrow.createTime"
                        format="yyyy-MM-dd HH:mm:ss"
                        type="date"
                        class="w160"
                      ></DatePicker>
                    </FormItem>
                    <FormItem label="备注：" prop="remark">
                      <Tooltip :content="Leftcurrentrow.remark">
                      <Input disabled v-model="Leftcurrentrow.remark" class="w160"></Input>
                      </Tooltip>
                    </FormItem>
                    <FormItem label="创建人：" prop="createUname">
                      <Input class="w160" disabled :value="Leftcurrentrow.createUname"></Input>
                    </FormItem>
                    <FormItem label="申请单号：" prop="code">
                      <Tooltip :content="Leftcurrentrow.code">
                      <Input disabled :value="Leftcurrentrow.code" class="w160"></Input>
                      </Tooltip>
                    </FormItem>
                    <FormItem label="入库单号：" prop="serviceId">
                      <Tooltip :content="Leftcurrentrow.serviceId">
                      <Input class="w160" disabled :value="Leftcurrentrow.serviceId"></Input>
                      </Tooltip>
                    </FormItem>
                  </Form>
                </div>
                <div v-show="staaa" class="flex plan-cz-btn" ref="planBtn">
                  <div class="clearfix">
                    <div v-show="staaa" class="fl mb5">
                      <Button v-has="'addProoo'" size="small" class="mr10" @click="addProoo">
                        <Icon type="md-add" />选择调拨入库单
                      </Button>
                    </div>
                    <div v-show="staaa" class="fl mb5">
                      <Button v-has="'delete'" size="small" class="mr10" @click="shanchu">
                        <i class="iconfont mr5 iconlajitongicon"></i> 删除配件
                      </Button>
                    </div>
                  </div>
                </div>
                <vxe-table
                  v-if="showit"
                  border
                  resizable
                  ref="xTable1"
                  show-footer
                  size="mini"
                  highlight-current-row
                  highlight-hover-row
                  @select-all="selectAllEvent"
                  @select-change="selectChangeEvent"
                  :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true}"
                  @keydown="keydown"
                  :height="rightTableHeight"
                  :data="ArrayValue"
                  :edit-rules="validRules"
                  :edit-config="{trigger: 'click', mode: 'cell'}"
                >
                  <vxe-table-column  show-overflow="tooltip" type="seq" width="60" title="序号" fixed="left"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="partCode" title="配件编码" fixed="left" width="100"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="partName" title="配件名称" fixed="left" width="100"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="partBrand" title="品牌" fixed="left" width="100"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="applyQty" title="申请数量" width="100"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="hasAcceptQty" title="受理数量" width="100"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="hasOutQty" title="出库数量" width="100"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip"
                    field="hasInQty"
                    title="入库数量"
                    :edit-render="{name: 'input'}"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip"
                    field="storeShelf"
                    :edit-render="{name: 'input'}"
                    title="入库仓位"
                    width="100"
                  >
                    <!--<template v-slot:edit="{ row,rowIndex }">-->
                      <!--<vxe-input type="text" v-model="row.storeShelf" @blur="blurFun(row.storeShelf,rowIndex)"></vxe-input>-->
                    <!--</template>-->
                    <!--<template v-slot="{ row }">{{ row.storeShelf }}</template>-->
                  </vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="carBrandName" title="品牌车型" width="100"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="unit" title="单位" width="100"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="oemCode" title="OE码" width="100"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="spec" title="规格" ></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="partInnerId" title="配件内码" width="100"></vxe-table-column>
                </vxe-table>
              </div>
            </Split>
          </div>
        </div>
      </section>
      <!--更多弹框-->
      <Modal v-model="advanced" title="高级查询" width="600px">
        <Form @keydown.native.enter="Determined">
        <More
          ref="naform"
          @getName="showModel2"
          :dcName="diaochuName"
          :dcId="diaochuID"
        ></More>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="Determined">确定</Button>
          <Button type="default" @click="advanced = false">取消</Button>
        </div>
      </Modal>
    </div>
    <!--      添加配件-->
    <select-part-com ref="selectPartCom" @selectPartName="getPartNameList"></select-part-com>
    <!-- 选择调出方 -->
    <!--<select-supplier @selectSearchName="selectSupplierName" ref="selectSupplier" headerTit="调出方资料"></select-supplier>-->
    <select-supplier
      ref="selectSupplier"
      header-tit="调出方资料"
      @selectSupplierName="selectSupplierName"
    ></select-supplier>

    <add-in-com
      @getArray="getArrayFun"
      :tbdata="tableData1"
      @getName="showModel3"
      :dcName="diaochuName"
      :dcId="diaochuID"
      :dcList="dcData"
      @search21="searchPro"
      @ok="getOkList"
      @selectAddName="selectAddlierName"
      ref="addInCom"
      headerTit="配件成品选择"
      :pageDataObj="propPageObj"
    ></add-in-com>
    <Print-show ref="printBox" :curenrow="Leftcurrentrow"></Print-show>
  </main>
  <!-- 配件组装 -->
</template>

<script>
import * as tools from "../../../../utils/tools";
import SelectSupplier from "../../transferringOrder/applyFor/compontents/supplier/selectSupplier2";
import AddInCom from "./compontents/AddInCom";
import More from "./compontents/More";
import "../../../lease/product/lease.less";
import PrintShow from "./compontents/PrintShow";
import selectPartCom from "./compontents/selectPartCom";
import moment from "moment";
import QuickDate from "../../../../components/getDate/dateget";
// import SelectSupplier from './compontents/selectSupplier'

import {
  getList1,
  baocun,
  tijiao,
  shanqu,
  zuofei,
  chengping,
  cangkulist2,
  outDataList,
  getListDetail
} from "@/api/AlotManagement/putStorage.js";

import { queryByOrgid,validityPosition } from "../../../../api/AlotManagement/transferringOrder";
export default {
  name: "putStorage",
  inject: ["reload"],
  components: {
    More,
    QuickDate,
    AddInCom,
    SelectSupplier,
    PrintShow,
    selectPartCom
  },
  data() {
    const posValid = ({ cellValue }) => {
      return new Promise((resolve, reject) => {
        if (cellValue) {
          let req = {
            "storeId":this.Leftcurrentrow.storeId,
            "name":cellValue
          }
          validityPosition(req).then(res => {
            if(!res){
              reject(new Error('仓位不存在'))
            }else{
              resolve();
            }
          })
        }else{
          resolve();
        }
      })
    }

    return {
      showSelf: true,
      propPageObj:{},
      Status: 0,
      // serviceIdValue: "",
      codeValue: "",
      ArrayValue: [],
      getArray: [],
      staaa: false,
      dcData: [],
      showit: true,
      form: {
        status: "",
        qucikTime: ""
      },
      tabKey: "0",
      modal2: true,
      split1: 0.2,
      tabIndex: 0,
      curronly: false,
      purchaseType: 1, //查询选项
      purchaseTypeArr: [
        {
          label: "所有",
          value: ""
        },
        {
          label: "草稿",
          value: "DRAFT"
        },
        {
          label: "已入库",
          value: "HAS_ENTER"
        },
        {
          label: "已作废",
          value: "INVALID"
        }
      ],
      advanced: false, //更多模块的弹框
      //左侧表格高度
      leftTableHeight: 0,
      tableData: [
        {
          name: "a",
          role: "a",
          sex: "a",
          num6: "",
          date12: "",
          data: [
            {
              name: 1
            },
            { name: 2 }
          ]
        },
        {
          name: "b",
          role: "b",
          sex: "b",
          num6: "",
          date12: ""
        },
        {
          name: "c",
          role: "c",
          sex: "c",
          num6: "",
          date12: ""
        },
        {
          name: "d",
          role: "d",
          sex: "d",
          num6: "",
          date12: ""
        }
      ],
      // 所需零件数据
      components: [],
      //右侧表格高度
      rightTableHeight: 0,
      //左侧的表头内容
      Left: {
        page: {
          num: 1,
          size: 20,
          total: 0,
          opts: [20, 50, 100, 200]
        },
        loading: false,
        columns: [
          {
            title: "序号",
            minWidth: 50,
            key: "index"
          },
          {
            title: "状态",
            key: "statuName",
            minWidth: 70
          },
          {
            title: "调出方",
            key: "guestName",
            minWidth: 120
          },
          {
            title: "创建日期",
            key: "createTime",
            minWidth: 140,
            render(h, params) {
              return h("span", {}, moment(params.row.createTime).format("YYYY-MM-DD HH:mm:ss"));
            }
          },
          {
            title: "创建人",
            key: "createUname",
            minWidth: 100
          },
          {
            title: "入库单号",
            key: "serviceId",
            minWidth: 240
          },
          {
            title: "入库人",
            key: "commitUname",
            minWidth: 100
          },
          {
            title: "入库日期",
            key: "commitDate",
            minWidth: 160
          },
          {
            title: "打印次数",
            key: "printing",
            minWidth: 100
          }
        ],
        tbdata: []
      },
      objectValue: {},
      Right: {
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        loading: false,
        columns: [
          {
            title: "序号",
            minWidth: 50,
            key: "id"
          },
          {
            title: "状态",
            key: "venderSkuNo",
            minWidth: 70
          },
          {
            title: "调出方",
            key: "name",
            minWidth: 170
          },
          {
            title: "创建日期",
            key: "address",
            minWidth: 120
          },
          {
            title: "申请人",
            key: "isCycle",
            minWidth: 140
          },
          {
            title: "申请单号",
            key: "disable",
            minWidth: 200
          },
          {
            title: "提交人",
            key: "remark",
            minWidth: 100
          },
          {
            title: "提交日期",
            align: "center",
            key: "qualitySourceName",
            minWidth: 170
          },
          {
            title: "打印次数",
            key: "categoryName",
            minWidth: 170
          }
        ],
        tbdata: []
      },
      dayinCureen: {},
      currentrow: {
        id: "1",
        name: "2"
      },
      duoxuanList: [],
      currentData: [],
      Leftcurrentrow: {
        status: {
          value: 1
        },
        storeName: "",
        createTime: "",
        orderMan: "",
        remark: "",
        serviceId: "",
        planOrderNum: "",
        detailVOS: []
      },
      currentDataP: [],
      cangkuListall: [],
      tableData1: [],
      currentNum: 1,
      val: "0",
      diaochuName: "",
      diaochuID: "",
      validRules: {
        storeShelf: [
          { validator: posValid,trigger:"blur"}
        ]
      }
    };
  },
  // watch: {
  //   Leftcurrentrow: {
  //     handler(newVal) {
  //       this.Leftcurrentrow = newVal;
  //     },
  //     deep: true
  //   }
  // },
  created() {
    // 调接口获取配件组装列表信息
    // this.getList(this.form);
    //调取仓库
    this.getWareHouse();
    // this.getArrayParams();
  },
  methods: {
    //------------------------------------------------------------------------//
    //表格tab切换可编辑部位
    async editNextCell($table){
      // @ts-ignore
      const { row, column, $rowIndex, $columnIndex, columnIndex, rowIndex } = await $table.getActiveRecord() || {}
      if (row) { // 当前为编辑状态
        // console.log('row', row)
        // 当前列属性
        const nowField = column.property
        // 获取展示的列
        const { visibleColumn } = $table.getTableColumn()
        // 当前列属性（可以编辑的属性）
        const columnsField = visibleColumn.reduce((a, v, i) => {
          if (i !== 0 && i !== visibleColumn.length - 1 && v.editRender) { // 不是操作和序号且不可以编辑
            a.push(v.property)
          }
          return a
        }, [])
        const nowIndex = columnsField.findIndex(v => v === nowField)
        // 判断当前是否是可编辑倒数地二行
        const isLastColumn = nowIndex === columnsField.length - 1
        // console.log('isLastColumn', isLastColumn)
        if (isLastColumn) {
          // 插入数据

          // 跳转到下一行
          // 判断当前是否为临时数据
          const isInsertByRow = $table.isInsertByRow(row)
          const ROW_INDEX = isInsertByRow ? await $table.$getRowIndex(row) : rowIndex
          const insertRecords = $table.getInsertRecords() // 临时数据
          let nextRow = {}
          // 不是最后一条临时数据
          if (isInsertByRow && insertRecords.length - 1 !== ROW_INDEX) {
            nextRow = $table.getInsertRecords()[ROW_INDEX + 1]
          } else {
            // 当前是最后一条临时数据
            if (isInsertByRow) {
              nextRow = $table.getData()[0]
            } else {
              nextRow = $table.getData()[ROW_INDEX + 1]
            }
          }
          if (nextRow) {
            await $table.scrollTo(0)
            await $table.setActiveCell(nextRow, columnsField[0])
          }
        } else {
          // 跳转下一个编辑
          await $table.setActiveCell(row, columnsField[nowIndex + 1])
        }
      }
    },

    keydown($event){
      if ($event.$event.keyCode == 9){
        this.editNextCell($event.$table)
      }
    },

    //------------------------------------------------------------------------//

    showOwen() {
      tools.setSession("self", { putStorage: this.showSelf });
      this.getList();
    },
    blurFun(pos,index){
      let req = {
        "storeId":this.Leftcurrentrow.storeId,
        "name":pos
      }
      validityPosition(req).then(res => {

      })
    },
    getArrayFun(data) {
      this.ArrayValue = data;
      // this.Leftcurrentrow.detailVOS = data;
    },
    warehouse() {
      queryByOrgid().then(res => {
        if (res.code === 0) {
          this.cangkuListall = res.data;
        }
      });
    },
    //配件返回的参数
    getPartNameList(val) {
      this.$refs.formPlan.validate(async valid => {
        if (valid) {
          let data = {};
          data = this.Leftcurrentrow;
          data.detailVOS = conversionList(val);
          let res = await baocun(data);
          if (res.code === 0) {
            this.getList();
          }
        } else {
          this.$Message.error("*为必填项");
        }
      });
    },
    selectAllEvent({ checked }) {},
    getDataType() {
      // const params = {
      //   status: this.form.status
      // };
      this.getList();
    },
    selectChangeEvent({ checked, row }) {
      //console.log(checked ? "勾选事件" : "取消事件");
    },
    async baocun1() {
      if (this.ArrayValue != []) {
        for (var i = 0; i < this.ArrayValue.length; i++) {
          if (this.ArrayValue[i].hasInQty > this.ArrayValue[i].hasOutQty) {
            this.$Message.error("入库数量不能大于出库数量");
            return;
          }
        }
      }
      if (
        !this.Leftcurrentrow.storeId ||
        !this.Leftcurrentrow.createTime ||
        !this.Leftcurrentrow.guestName
      ) {
        this.$Message.info("仓库和创建时间以及调出方为必输项");
        return;
      }
      if (this.Leftcurrentrow.status.value !== 0) {
        this.$Message.info("只有草稿状态才能进行保存操作");
        return;
      }

      const errMap = await this.$refs.xTable1.validate().catch(errMap => errMap)
      if (errMap) {
        return
      }

      const params = JSON.parse(JSON.stringify(this.Leftcurrentrow));
      if (params.xinzeng) {
        delete params.status;
      }
      for (var i = 0; i < this.getArray.length; i++) {
        if (this.getArray[i].shortName == this.Leftcurrentrow.guestName) {
          params.guestOrgid = this.getArray[i].isInternalId;
          params.guestId = this.getArray[i].id;
        }
      }

      if (params.status && params.status.name) {
        params.status = params.status.value;
      }
      if (params.orderTypeId && params.orderTypeId.name) {
        params.orderTypeId = params.orderTypeId.value;
      }
      if (params.settleStatus && params.settleStatus.name) {
        params.settleStatus = params.settleStatus.value;
      }

      params["voList"] = this.ArrayValue;
      //配件组装保存
      baocun(params)
        .then(res => {
          // 点击列表行==>配件组装信息
          if (res.code == 0) {
            // this.Leftcurrentrow = {};
            this.getList();
            this.$Message.success("保存成功");
          }
        })
        // .catch(e => {
        //   this.$Message.info("保存配件组装信息失败");
        // });
    },
    xinzeng() {
      // this.$refs.tableref.clearCurrentRow();
      if (this.Left.tbdata.length === 0) {
      } else {
        if (this.Left.tbdata[0]["xinzeng"] === "1") {
          this.$Message.info(
            "调拨入库单已有一个新增单等待操作,请先保存当前操作新增单据"
          );
          return;
        }
      }
      this.addProoo();
    },
    zuofei1() {
      if (this.Leftcurrentrow.xinzeng === "1") {
        this.$Message.info("请先保存新增入库单！");
        return;
      }
      // if (!this.Leftcurrentrow.serviceId) {
      //   this.$Message.info("请先选择加工单");
      //   return;
      // }
      if (this.Leftcurrentrow.status.value !== 0) {
        this.$Message.info("只有草稿状态调拨入库单能进行作废操作");
        return;
      }
      const params = {
        id: this.Leftcurrentrow.id
      };
      // 配件组装作废
      zuofei(params)
        .then(res => {
          // 点击列表行==>配件组装信息
          this.Status = 2;
          if (res.code == 0) {
            this.getList();
            this.$Message.success("作废成功");
          }
          // this.reload();
        })
    },
    //选择单据
    selectAddlierName(row) {
      this.Left.tbdata = [...row];
      this.Right = row;
    },
    // 新增按钮
    addProoo() {
      this.$refs.addInCom.init();
      this.$refs.addInCom.dcName=""
      let showSelf = this.$refs.addInCom.showSelf;
      let data = { enterSelect: 123, orderTypeId: "ALLOT_APPLY" };
      if(showSelf) {
        let createUid = this.$store.state.user.userData.id;
        data.createUid = createUid;
      } else {
        Reflect.deleteProperty(data, "createUid")
      }
      data.status = "STOCKING";
      chengping(data, 10, 1)
        .then(res => {
          // 导入成品, 并把成品覆盖掉当前配件组装信息list
          if (res.code == 0) {
            this.tableData1 = res.data.content;
            this.$refs.addInCom.tabList = res.data.content;
            this.propPageObj = res.data||{};
          }
        })
        // .catch(e => {
        //   this.$Message.info("获取成品失败");
        // });
      // 获取成品列表把data赋值给子组件中
      // this.getListPro()
    },
    //打印表格
    printTable() {
      let order = this.$store.state.dataList.oneOrder;
      order.name="调拨入库"
      order.route=this.$route.name
      order.id=this.Leftcurrentrow.id
      let routeUrl=this.$router.resolve({name:"print",query:order})
      window.open(routeUrl.href,"_blank");
      this.getList()
    },
    async chuku() {
      this.$Modal.confirm({
          title: "是否确定入库？",
          onOk: async () => {
            const params = {
              id: this.Leftcurrentrow.id,
              voList: this.ArrayValue,
              storeId:this.Leftcurrentrow.storeId
            };
            // 配件组装作废
            let res = await outDataList(params);
            // console.log("res", res);
            if (res.code == 0) {
              this.getList();
              this.$Message.success("入库成功");
              // this.reload();
              return;
            }
            if(res && res.message && res.message.indexOf("成功") > -1) {
              this.getList();
              // this.reload();
              return;
            }
          },
          onCancel: () => {}
        });
    },
    searchPro(params, size, page) {
      chengping({ ...params }, size, page)
        .then(res => {
          // 导入成品, 并把成品覆盖掉当前配件组装信息list
          if (res.code == 0) {
            this.tableData1 = res.data.content;
            this.$refs.addInCom.tabList = res.data.content;
            this.propPageObj = res.data||{};
          }
        })
        // .catch(e => {
        //   this.$Message.info("获取成品失败");
        // });
      // 获取成品列表把data赋值给子组件中
      // this.getListPro()
    },
    // 组装
    currentChangeEvent({ row }) {
      this.currentrow = row;
    },
    //获取表格高度
    getDomHeight() {
      this.$nextTick(() => {
        let wrapH = this.$refs.paneLeft.offsetHeight;
        let planFormH = this.$refs.planForm.offsetHeight;
        let planBtnH = this.$refs.planBtn.offsetHeight;
        // let planPageH = this.$refs.planPage.offsetHeight;
        //获取左侧侧表格高度
        this.leftTableHeight = wrapH - 144;
        //获取右侧表格高度
        this.rightTableHeight = wrapH - planFormH - planBtnH - 38;
      });
    },
    getDataQuick(v) {
      // const params = {
      //   createTimeStart: v[0],
      //   createTimeEnd: v[1]
      // };
      this.form.createTimeStart = v[0];
      this.form.createTimeEnd = v[1];
      this.getList();
    },
    //更多按钮
    more() {
      this.$refs.naform.reset();
      this.advanced = true;
    },
    //左边列表选中当前行
    async selectTabelData(row) {
      this.dayinCureen = row;
      this.Leftcurrentrow = row;
      this.Status = row.status.value;
      this.Leftcurrentrow.storeId = row.storeId;
      if (row.id == undefined) {
        this.ArrayValue = row.detailVOS;
      } else {
        const params = {
          mainId: row.id
        };
        const res = await getListDetail(params);
        this.ArrayValue = res.data;
      }

      this.showit = false;
      const that = this;
      setTimeout(() => {
        that.showit = true;
      }, 100);
      cangkulist2(this.$store.state.user.userData.groupId)
        .then(res => {
          if (res.code == 0) {
            res.data.map(item => {
              item["label"] = item.name;
              item["value"] = item.id;
            });
            // this.cangkuListall = res.data
            this.dcData = res.data;
          }
        })
        // .catch(e => {
        //   this.$Message.info("获取仓库列表失败");
        // });
    },
    //获取仓库
    getWareHouse() {
      cangkulist2(this.$store.state.user.userData.groupId)
        .then(res => {
          if (res.code == 0) {
            res.data.map(item => {
              item["label"] = item.name;
              item["value"] = item.id;
            });
            this.cangkuListall = res.data;
            this.dcData = res.data;
          }
        })
        // .catch(e => {
        //   this.$Message.info("获取仓库列表失败");
        // });
    },

    //分页
    changePage(p) {
      this.Left.page.num = p;
      this.getList();
    },
    changeSize(size) {
      this.Left.page.size = size;
      this.getList();
    },
    //表格编辑状态下被关闭的事件
    editClosedEvent() {},
    //footer计算
    addFooter() {},
    // 确定
    Determined() {
      // this.$refs.naform.getSupplierNamea();
      const params = { ...this.form, ...this.$refs.naform.getITPWE() };
      for (var i = 0; i < this.getArray.length; i++) {
        if (this.getArray[i].shortName == params.guestName) {
          params.guestId = this.getArray[i].id;
        }
      }
      this.form = params;
      delete this.form.gustName;
      this.getList();
      this.advanced = false;
    },
    ok() {},
    cancel() {},
    shanchu() {
      if (this.Leftcurrentrow.status.value !== 0) {
        this.$Message.info("只有草稿状态才能进行删除操作");
        return;
      }
      // 组装删除
      const seleList = this.$refs.xTable1.getSelectRecords();
      const id = seleList[0].id;
      shanqu(id)
        .then(res => {
          // 导入成品, 并把成品覆盖掉当前配件组装信息list
          if (res.code == 0) {
            this.Leftcurrentrow.detailVOS = this.array_diff(
              this.Leftcurrentrow.detailVOS,
              seleList
            );
            this.$Message.success("删除成功");
          }
        })
        // .catch(e => {
        //   this.$Message.info("删除成品失败");
        // });
    },
    //展示方
    showModel() {
      this.val = "0";
      this.$refs.selectSupplier.init();
    },
    showModel2(val) {
      this.val = val;
      this.$refs.selectSupplier.init();
    },
    showModel3(val) {
      this.val = val;
      this.$refs.selectSupplier.init();
    },
    //选择方
    selectSupplierName(row) {
      // row.shortName;
      if (this.val == "0") {
        this.showit = false;
        this.Leftcurrentrow.guestName = row.shortName;
        this.Leftcurrentrow.guestId = row.id;
        const tata = this;
        setTimeout(() => {
          tata.showit = true;
        }, 200);
      } else {
        let more = this.$refs.naform;
        if(!more.ArrayValue1.includes(row.shortName)) {
          more.ArrayValue1.push(row.shortName);
        }
        more.form.guestId = row.id;
        this.Leftcurrentrow.guestId = row.id;
        this.diaochuName = row.shortName;
        this.diaochuID = row.id;
      }
      this.$refs['naform'].form.guestName=row.shortName
    },
    getOkList(list) {
      this.$refs.tableref.clearCurrentRow();
      this.Left.tbdata.forEach(el=> el._highlight = false);
      this.codeValue = list.id;
      const item = {
        index: 1,
        xinzeng: "1",
        status: {
          enum: "DRAFT",
          name: "草稿",
          value: 0
        },
        codeId: list.id,
        code: list.serviceId,
        statuName: "草稿",
        storeName: "",
        guestName: list.guestName,
        createTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        orderMan: this.$store.state.user.userData.staffName,
        remark: list.remark,
        serviceId: "",
        storeId: list.storeId,
        detailVOS: list.detailVOS,
        new: true,
        _highlight: true
      };
      this.ArrayValue = list.detailVOS;
      for (var i = 0; i < this.ArrayValue.length; i++) {
        this.ArrayValue[i].hasInQty = this.ArrayValue[i].hasOutQty;
      }
      this.Left.tbdata.unshift(item);
      this.Left.tbdata.map((item, index) => {
        item.index = index + 1;
      });
      this.Leftcurrentrow = item;
      this.Status = 0;
      this.$refs.addInCom.init1();
    },
    getList() {
      let params = this.form;
      if (params.qucikTime) {
        params.createTime = params.qucikTime[0]
        params.endTime = params.qucikTime[1]
        // delete params.qucikTime;
      } else {
        delete params.qucikTime;
      }
      if(this.showSelf) {
        let createUid = this.$store.state.user.userData.id;
        params.createUid = createUid;
      } else {
        Reflect.deleteProperty(params, "createUid")
      }
      getList1(params, this.Left.page.size, this.Left.page.num)
        .then(async res => {
          if (res.code == 0) {
            if (!res.data.content) {
              this.Left.tbdata = [];
              this.Left.page.total = 0;
            } else {
              res.data.content.map((item, index) => {
                item["index"] = index + 1;
                item["statuName"] = item.status.name;
              });
              this.Left.tbdata = res.data.content || [];
              this.Left.page.total = res.data.totalElements;
            }
            if(this.Leftcurrentrow.id) {
              for (let b of this.Left.tbdata) {
                b._highlight = false;
                if(b.id == this.Leftcurrentrow.id) {
                  b._highlight = true;
                  this.Leftcurrentrow = b;
                  const params = {
                    mainId: b.id
                  };
                  const res = await getListDetail(params);
                  this.Leftcurrentrow.detailVOS = this.ArrayValue = res.data;
                  return;
                }
              }
            } else {
              this.Left.tbdata[0]._highlight = true;
              this.Leftcurrentrow = this.Left.tbdata[0];
              const params = {
                mainId: b.id
              };
              const res = await getListDetail(params);
              this.Leftcurrentrow.detailVOS = this.ArrayValue = res.data;
              return;
            }
          }
        })
    },
    getListPro() {
      let showSelf = this.$refs.addInCom.showSelf
      let data = {};
      if(showSelf) {
        let createUid = this.$store.state.user.userData.id;
        data.createUid = createUid;
      } else {
        Reflect.deleteProperty(data, "createUid")
      }
      data.status = "STOCKING";
      chengping(data)
        .then(res => {
          if (res.code == 0) {
            this.tbdata = res.data || [];
            this.page.total = res.totalElements;
          }
        })
    },
    array_diff(a, b) {
      for (var i = 0; i < b.length; i++) {
        for (var j = 0; j < a.length; j++) {
          if (a[j].name === b[i].name) {
            a.splice(j, 1);
            j = j - 1;
          }
        }
      }
      return a;
    }
  },
  mounted() {
    let self = tools.getSession("self");
    this.showSelf = Reflect.has(self, "putStorage") ? self.putStorage : true;
    setTimeout(() => {
      this.getDomHeight();
    }, 0);

    window.onresize = () => {
      this.getDomHeight();
    };
    this.warehouse();
  }
};
</script>

<style lang="less" scoped>
.ivu-tabs-bar {
  margin: 0;
}
.tabs-ulwarp {
  padding-top: 17px;
  border-bottom: solid 1px #ddd;
}
.tabs {
  list-style: none;
  display: flex;
  height: 100%;

  li {
    margin: 0;
    margin-right: 4px;
    height: 31px;
    padding: 5px 16px 4px;
    border: 1px solid #ddd;
    border-bottom: 0;
    border-radius: 2px 2px 0 0;
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
    background: #f8f8f8;
    cursor: pointer;
  }

  li.tab-active {
    height: 32px;
    padding-bottom: 5px;
    background: #fff;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    border-color: #ddd;
    color: #fd5c5c;
  }
}
.page-warp {
  padding-right: 20px;
}
.look-nav {
  text-align: center;
  height: 40px;
  margin-top: 20px;
}
.con-box {
  height: 600px;
}
.w550 {
  width: 580px;
}
.mt20 {
  margin-top: 20px;
}
.look {
  width: 100px;
  height: 100px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%);
}

.goods-list-form {
  * {
    font-size: 12px !important;
  }
  .ivu-form-item {
    margin-bottom: 0px;
  }
  .plan-cz-btn {
    border-top: 1px solid #ddd;
    margin-top: 6px;
    justify-content: space-between;
    padding: 8px 10px 4px;
    align-items: center;
  }
  .t-price {
    white-space: nowrap;
  }
}
</style>
<style>
.it-box .ivu-tabs-nav-scroll {
  margin-left: 10px;
}
.it-box .ivu-tabs-bar {
  margin-bottom: 0;
}
.it-box .ivu-tabs-content.ivu-tabs-content-animated {
  height: 100%;
}
.redIT .ivu-form-item-label {
  color: red;
}
</style>
