<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf wlf-center">
          <div class="db">
            <getDate class="mr10" @quickDate="getvalue"></getDate>
          </div>
          <div class="db">
            <Select
              v-model="billStatusId"
              style="width:100px"
              class="mr10"
              @on-change="getOrderType"
            >
              <Option
                v-for="item in typeList"
                :value="item.value"
                :key="item.value"
                >{{ item.name }}</Option
              >
            </Select>
          </div>
          <div class="db">
            <Button type="default" class="mr10" @click="moreQueryShowModal">
              <Icon type="ios-more" />更多
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="addOneList" v-has="'add'">
              <Icon type="md-add" />新增
            </Button>
          </div>
          <div class="db">
            <Button
              type="default"
              class="mr10"
              :disabled="draftShow != 0 || isNew"
              @click="isSave"
              v-has="'save'"
            >
              <i class="iconfont mr5 iconbaocunicon"></i>保存
            </Button>
          </div>
          <div class="db">
            <Button
              class="mr10"
              :disabled="draftShow != 0 || isNew"
              @click="isSubmit"
              v-has="'submit'"
            >
              <i class="iconfont mr5 iconziyuan2"></i>提交并入库
            </Button>
          </div>
          <div class="db">
            <Button
              class="mr10"
              @click="cancellation"
              :disabled="draftShow != 0 || !formPlan.id"
              v-has="'cancellation'"
            >
              <Icon type="md-close" size="14" />作废
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="printTable" v-has="'print'">
              <i class="iconfont mr5 icondayinicon"></i> 打印
            </Button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <div class="con-split" ref="paneLeft">
          <Split v-model="split1" min="300" max="500">
            <!--            左侧表格-->
            <div
              slot="left"
              class="con-split-pane-left"
              style="overflow-y: auto; height: 100%;"
            >
              <div class="pane-made-hd">销售退货列表</div>
              <Table
                ref="currentRowTable"
                :queryTime="queryTime"
                :billStatusId="billStatusId"
                :height="leftTableHeight"
                size="small"
                highlight-row
                border
                :stripe="true"
                :loading="sellOrderTable.loading"
                :columns="sellOrderTable.columns"
                :data="sellOrderTable.tbdata"
                @on-current-change="selectTabelData"
              ></Table>
              <!--              分页-->
              <Page
                :total="page.total"
                :page-size="page.size"
                :current="page.num"
                show-sizer
                show-total
                size="small"
                class-name="page-con"
                @on-change="selectNum"
                @on-page-size-change="selectPage"
                :page-size-opts="[20, 50, 100, 200]"
                class="mr10"
              ></Page>
            </div>
            <!--            右侧表格-->
            <div
              slot="right"
              class="con-split-pane-right pl5 goods-list-form"
              style="overflow-y: auto; height: 100%;"
            >
              <div class="pane-made-hd">销售退货信息</div>
              <Form
                inline
                ref="formPlan"
                :model="formPlan"
                :label-width="120"
                :rules="ruleValidate"
                :show-message="false"
              >
                <div class="clearfix purchase" ref="planForm">
                  <FormItem label="客户：" prop="guestId">
                    <Row>
                      <!--<Tooltip :content="formPlan.fullName">-->
                      <!--<Input-->
                        <!--placeholder="请选择客户"-->
                        <!--v-model="formPlan.fullName"-->
                        <!--readonly-->
                        <!--disabled-->
                        <!--style="width:200px;"-->
                      <!--/>-->
                      <!--</Tooltip>-->
                      <sales-cus style="width:200px; display: inline-block" :disabled-prop="draftShow != 0 || isNew" :title="formPlan.fullName" placeholder="请输入客户" :search-value="formPlan.fullName" @throwName="throwNameFun"></sales-cus>
                      <Button
                        class="ml5"
                        size="small"
                        type="default"
                        @click="CustomerShowModel"
                        :disabled="draftShow != 0 || isNew"
                      >
                        <Icon type="md-checkmark" />
                      </Button>
                    </Row>
                  </FormItem>
                  <FormItem label="退货员：" prop="orderManId">
                    <Select
                      :value="formPlan.orderManId"
                      @on-change="selectOrderMan"
                      filterable
                      style="width: 200px"
                      :disabled="draftShow != 0 || isNew"
                      label-in-value
                    >
                      <Option
                        v-for="item in salesList"
                        :value="item.id"
                        :key="item.id"
                        >{{ item.label }}</Option
                      >
                    </Select>
                  </FormItem>
                  <FormItem label="退货日期：" prop="orderDate">
                    <DatePicker
                      style="width: 160px"
                      type="date"
                      placeholder="请选择退货日期"
                      @quickDate="setDataFun"
                      v-model="formPlan.orderDate"
                      :disabled="draftShow != 0 || isNew"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="往来单号：">
                    <Tooltip :content="formPlan.code">
                    <Input class="w160" v-model="formPlan.code" disabled />
                    </Tooltip>
                  </FormItem>
                  <FormItem label="入库仓库：" prop="storeId">
                    <Select
                      v-model="formPlan.storeId"
                      style="width:233px"
                      :disabled="draftShow != 0 || isNew"
                      @on-change="getStore"
                    >
                      <Option
                        v-for="item in WareHouseList"
                        :disabled="item.isDisabled"
                        :value="item.id"
                        :key="item.id"
                        >{{ item.name }}</Option
                      >
                    </Select>
                  </FormItem>
                  <FormItem label="退货原因：" prop="rtnReasonId">
                    <Select
                      class="w200"
                      v-model="formPlan.rtnReasonId"
                      :disabled="draftShow != 0 || isNew"
                    >
                      <Option
                        v-for="item in settleTypeList.CS00116"
                        :key="item.itemCode"
                        :value="item.itemCode"
                        >{{ item.itemName }}</Option
                      >
                    </Select>
                  </FormItem>
                  <FormItem label="结算方式：" prop="settleTypeId">
                    <Select
                      v-model="formPlan.settleTypeId"
                      style="width:160px"
                      :disabled="draftShow != 0 || isNew"
                    >
                      <Option
                        v-for="item in settleTypeList.CS00106"
                        :value="item.itemCode"
                        :key="item.itemCode"
                      >
                        {{ item.itemName }}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="备注：">
                    <Tooltip :content="formPlan.remark">
                    <Input
                      placeholder="请输入备注"
                      class="w160"
                      v-model="formPlan.remark"
                      :disabled="draftShow != 0 || isNew"
                      :edit-render="{
                        name: 'input',
                        attrs: { disabled: false }
                      }"
                    />
                    </Tooltip>
                  </FormItem>

                  <FormItem label="退货单号：">
                    <Tooltip :content="formPlan.serviceId">
                    <Input class="w160" v-model="formPlan.serviceId" disabled />
                    </Tooltip>
                  </FormItem>
                </div>
                <div class="flex plan-cz-btn" ref="planBtn">
                  <div class="clearfix">
                    <div class="fl mb5">
                      <Button
                        size="small"
                        class="mr10"
                        @click="SalesOutboundShowModel"
                        v-has="'SalesOutbound'"
                        :disabled="draftShow != 0 || isNew"
                      >
                        添加配件
                      </Button>
                    </div>
                    <div class="fl mb5">
                      <Button
                        size="small"
                        class="mr10"
                        :disabled="draftShow != 0 || isNew"
                        @click="deletePart"
                        v-has="'deletePart'"
                      >
                        <Icon
                          custom="iconfont iconlajitongicon icons"
                        />删除配件
                      </Button>
                    </div>
                  </div>
                </div>
                <vxe-table
                  border
                  resizable
                  show-footer
                  :edit-rules="validRules"
                  :footer-method="footerMethod"
                  size="mini"
                  auto-resize
                  @select-change="selectTable"
                  @select-all="selectAllTable"
                  @edit-actived="editActivedEvent"
                  :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true}"
                  @keydown="keydown"
                  ref="xTable"
                  :height="rightTableHeight"
                  :data="formPlan.details"
                  :edit-config="{ trigger: 'click', mode: 'cell' }"
                >
                  <vxe-table-column  show-overflow="tooltip"
                    type="index"
                    title="序号"
                    fixed="left"
                  ></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" type="checkbox" fixed="left"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip"
                    field="partCode"
                    title="配件编码"
                    fixed="left"
                  ></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip"
                    field="partName"
                    title="配件名称"
                    fixed="left"
                  ></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip"
                    field="partBrand"
                    title="品牌"
                    fixed="left"
                  ></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip"
                    field="orderQty"
                    title="数量"
                    :edit-render="{ name: 'input', attrs: { disabled: false } }"
                  ></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip"
                    field="orderPrice"
                    title="销价"
                    :edit-render="{ name: 'input', attrs: { disabled: false } }"
                  ></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" title="金额">
                    <template v-slot="{ row }">
                      <span>{{ countAmount(row) | priceFilters }}</span>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip"
                    field="remark"
                    title="备注"
                    :edit-render="{ name: 'input', attrs: { disabled: false } }"
                  ></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="storeName" title="仓库" disabled>
                    <template v-slot:edit="{ row }">
                      <Select style="width:100px">
                        <Option
                          v-for="item in WareHouseList"
                          :value="item.id"
                          :key="item.id"
                          >{{ item.name }}</Option
                        >
                      </Select>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip"
                    field="storeShelf"
                    title="仓位"
                    :edit-render="{
                      name: 'input',
                      immediate: true,
                      events: { blur: checkSelf }
                    }"
                  ></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" title="品牌车型">
                    <template v-slot="{ row, rowIndex }">
                      <span>{{ row.carBrandName }} {{ row.carModelName }}</span>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip"
                    field="unit"
                    title="单位"
                  ></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip"
                    field="oemCode"
                    title="OE码"
                  ></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip"
                    field="spec"
                    title="规格"
                  ></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="partInnerId" title="配件内码" width="120"></vxe-table-column>
                </vxe-table>
              </Form>
            </div>
          </Split>
        </div>
      </div>
    </section>
    <!--        打印-->
    <Print-show ref="printBox" :id="id"></Print-show>
    <!--    选择客户-->
    <select-the-customer
      ref="selectTheCustomer"
      @getOne="setOneClient"
    ></select-the-customer>
    <!--更多 搜索-->
    <More-search
      :data="moreQueryList"
      ref="morequeryModal"
      @moreQuery="queryList"
    ></More-search>
    <!-- 选择销售出库单 -->
    <Sales-outbound
      ref="salesOutbound"
      :guestId="formPlan.guestId"
      @salesOutList="getOutList"
    ></Sales-outbound>
    <procurement
      ref="procurementModal"
      :type="'sale'"
      :guestId="formPlan.guestId"
      :storeId="formPlan.storeId"
      @getPlanOrder="getPlanOrder"
    ></procurement>
  </div>
</template>

<script>
import {
  getSales,
  getLeftList,
  getClient,
  getWarehouseList,
  getDelete,
  returnWareHouse,
  getDeleteList,
  getSave,
  getSubmit
} from "_api/salesManagment/sellReturn.js";
import { getDigitalDictionary } from "@/api/system/essentialData/clientManagement";
import selectTheCustomer from "../commonality/SelectTheCustomer.vue";
import SalesOutbound from "./components/SalesOutbound.vue";
import getDate from "@/components/getDate/dateget";
import PrintShow from "./components/PrintShow";
import MoreSearch from "./components/MoreSearch";
import * as tools from "../../../utils/tools";
import { save } from "../../../api/AlotManagement/transferringOrder";
import { checkStore } from "@/api/system/systemApi";
import Procurement from "@/components/Procurement";
import { v4 } from "uuid"
import SalesCus from "../../../components/allocation/salesCus";
import moment from 'moment'


export default {
  name: "sellReturn",
  inject: ["reload"],
  components: {
    SalesCus,
    selectTheCustomer,
    SalesOutbound,
    getDate,
    MoreSearch,
    PrintShow,
    Procurement
  },
  data() {
    let changeNumber = ({ cellValue, row: { rtnableQty } }) => {
      const reg = /^[1-9]\d{0,}$/;
      if (!reg.test(cellValue)) {
        return Promise.reject(new Error("数量输入不正确"));
      }
      if (rtnableQty < cellValue) {
        return Promise.reject(new Error("数量输入不正确"));
      }
    };

    let money = ({ cellValue }) => {
      const reg = /^\d+(\.\d{0,2})?$/i;
      if (!reg.test(cellValue)) {
        return Promise.reject(new Error("最多保留2位小数"));
      }
    };
    return {
      isSelfOk: true,
      StoreId: "", //默认仓
      //左侧表格高度
      leftTableHeight: 0,
      rightTableHeight: 0,
      isNew: true, //页面开始禁用
      draftShow: "", //判定是不是草稿
      isAdd: true, //判断是否新增
      isWms: true, //判断是否提交,返回
      currentRow: null,
      PTrow: {
        _highlight: true,
        billStatusId: { name: "草稿", value: 0 },
        billStatusName: "草稿",
        orderManId: this.$store.state.user.userData.id,
        orderMan: this.$store.state.user.userData.staffName
      },
      page: {
        total: 0,
        size: 20,
        num: 1
      },
      moreQueryList: {}, //更多查询
      oneRow: {}, //点击详情的数据
      billStatusId: 99, //快速查询状态
      typeList: [
        { value: 99, name: "所有" },
        { value: 0, name: "草稿" },
        { value: 2, name: "待入库" },
        { value: 4, name: "已入库" },
        { value: 6, name: "已作废" }
      ],

      queryTime: "", //快速查询时间
      client: [], //客户列表

      sellOrderTable: {
        loading: false,
        columns: [
          {
            title: "序号",
            minWidth: 50,
            type: "index",
            align: "center"
          },
          {
            title: "状态",
            render: (h, params) => {
              let tex = params.row.billStatusName;
              return h("span", {}, tex);
            },
            minWidth: 70
          },
          {
            title: "客户",
            key: "guestName",
            minWidth: 170
          },
          {
            title: "退货日期",
            key: "orderDate",
            minWidth: 120,
            render:( h , params) => {
            let date = moment(params.row.orderDate).format("YYYY-MM-DD")
            return h('span' ,{},date)
            }
          },
          {
            title: "退货员",
            key: "orderMan",
            minWidth: 120
          },

          {
            title: "退货单号",
            key: "serviceId",
            minWidth: 200
          },
          {
            title: "打印次数",
            key: "printCount",
            minWidth: 120
          },
          {
            title: "创建人",
            key: "createUname",
            minWidth: 100
          },
          {
            title: "创建日期",
            align: "center",
            key: "createTime",
            minWidth: 170
          },
          {
            title: "提交人",
            key: "auditor",
            minWidth: 100
          },
          {
            title: "提交日期",
            align: "center",
            key: "auditDate",
            minWidth: 170
          }
        ],
        tbdata: []
      }, //表格属性
      salesList: [], //销售员列表
      formPlan: {
        details: [],
        storeId: ""
      }, //表单对象
      split1: 0.2, //左右框
      WareHouseList: [], // 入库仓
      settleTypeList: {}, //结账类型
      tableData: [], //右侧表格list
      thTypes: [], //退货类型
      ruleValidate: {
        //表单校验
        guestId: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ],
        orderManId: [
          { required: true, type: "string", message: "  ", trigger: "change" }
        ],
        rtnReasonId: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ],
        storeId: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ],
        orderDate: [
          { required: true, type: "date", message: "采购退货日期不能为空", trigger: "change" }
        ],
        settleTypeId: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ]
      },
      validRules: {
        orderQty: [{ required: true, validator: changeNumber }],
        orderPrice: [{ required: true, validator: money }]
      }, //表格校验

      id: "", //点击左侧表格拿到的id
      selectTableList: [], //右侧table表格选中的数据
      Flag: false //判断是否已提交
    };
  },
  mounted() {
    this.getLeftList();
    // this.getAllClient();
    this.getType();
    this.getWarehouse();
    this.getAllSales();
    this.getDomHeight();
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
        const isLastColumn = nowIndex === columnsField.length -3
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
    //选择日期
    setDataFun(v) {
      this.formPlan.orderDate = v;
    },
    getDomHeight() {
      this.$nextTick(() => {
        let wrapH = this.$refs.paneLeft.offsetHeight;
        let planFormH = this.$refs.planForm.offsetHeight;
        //获取左侧侧表格高度
        this.leftTableHeight = wrapH - 90;
        this.rightTableHeight = wrapH - planFormH - 120;
      });
    },
    //检验仓位（参照采购入库）
    checkSelf({ row: { storeShelf } }) {
      if (storeShelf == "") {
        this.isSelfOk = true;
      } else {
        checkStore({ storeId: this.formPlan.storeId, name: storeShelf }).then(
          res => {
            if (res.code == 0 && res.data != null) {
              this.isSelfOk = true;
            } else {
              this.isSelfOk = false;
            }
          }
        );
      }
    },
    //判断表格能不能编辑
    editActivedEvent({ row }) {
      let xTable = this.$refs.xTable;
      let orderQtyColumn = xTable.getColumnByField("orderQty");
      let orderPriceColumn = xTable.getColumnByField("orderPrice");
      let remarkColumn = xTable.getColumnByField("remark");
      let isDisabled = this.draftShow != 0;
      orderQtyColumn.editRender.attrs.disabled = isDisabled;
      orderPriceColumn.editRender.attrs.disabled = isDisabled;
      remarkColumn.editRender.attrs.disabled = isDisabled;
    },
    //获取销售员
    async getAllSales() {
      let res = await getSales();
      if (res.code === 0) {
        this.salesList = res.data.content;
        this.salesList.map(item => {
          item.label = item.userName;
        });
      }
    },
    //获取销售员
    selectOrderMan(val) {
      // this.formPlan.orderMan = val.label;
      // this.formPlan.orderManId = val.value;
      this.formPlan.orderMan = val ? (val.label ? val.label : "") : "";
      this.formPlan.orderManId = val ? (val.value ? val.value : "") : "";
    },
    //多选内容
    selectTable(data) {
      this.selectTableList = data.selection;
    },
    //全选内容
    selectAllTable(data) {
      this.selectTableList = data.selection;
    },
    //计算表格数据
    countAmount(row) {
      return (
        this.$utils.toNumber(row.orderQty) *
        this.$utils.toNumber(row.orderPrice)
      );
    },
    //获取左侧表格一行选中的数据
    selectTabelData(v) {
      if (v == null) return;
      let currentRowTable = this.$refs["currentRowTable"];
      this.currentRow = v;
      if (!this.Flag && !this.isAdd) {
        this.$Modal.confirm({
          title: "您正在编辑单据，是否需要保存",
          onOk: () => {
            currentRowTable.clearCurrentRow();
            this.isSave();
          },
          onCancel: () => {
            this.sellOrderTable.tbdata.splice(0, 1);
            currentRowTable.clearCurrentRow();
            this.isAdd = true;
            this.currentRow = v;
            this.id = v.id;
            this.formPlan.orderDate = new Date(v.orderDate);
            this.tableData = v.details;
            this.formPlan = v;
            this.draftShow = v.billStatusId.value;
            this.selectTableList = [];
            this.$refs.formPlan.resetFields();
            if (this.id) {
              for (let b of this.tbdata) {
                b._highlight = false
                if (b.id == this.sellOrderTable.tbdata) {
                  b._highlight = true;
                  break;
                }
              }
            } else {
              this.sellOrderTable.tbdata[0]._highlight = true
            }
          }
        });
      } else {
        if (v.id) {
          v.fullName = v.guestName;
          this.isNew = false;
          this.currentRow = v;
          this.id = v.id;
          this.formPlan.orderDate = new Date(v.orderDate);
          this.tableData = v.details;
          this.formPlan = v;
          this.draftShow = v.billStatusId.value;
          this.selectTableList = [];
        }
      }
      // console.log(v.orderDate,tools.transTime(v.orderDate),new Date(v.orderDate),111111)
    },
    //新增按钮
    addOneList() {
      this.$refs.formPlan.resetFields();
      this.isNew = false;
      this.tableData = [];
      this.formPlan = {
        details: [],
        orderManId: this.PTrow.orderManId,
        orderDate:tools.transTime(new Date()),
        orderMan: this.PTrow.orderMan,
        storeId: this.StoreId //调入仓库
      };
      this.draftShow = 0;
      if (!this.isAdd) {
        return this.$Message.error("请先保存数据");
      }
      for (let b of this.sellOrderTable.tbdata) {
        b._highlight = false;
      }
      this.sellOrderTable.tbdata.unshift(this.PTrow);
      console.log(this.sellOrderTable.tbdata , 7879)

      // this.sellOrderTable.tbdata[0]._highlight = true;
      this.isAdd = false;
    },
    //获取客户属性
    async getType() {
      let data = {};
      //107票据类型
      //106结算方式
      data = ["CS00106", "CS00107", "CS00116"];
      let res = await getDigitalDictionary(data);
      if (res.code == 0) {
        this.settleTypeList = res.data;
      }
    },
    //获取选择状态类型
    getOrderType(v) {
      this.billStatusId = v;
    },
    //打开新增客户
    CustomerShowModel() {
      this.$refs.selectTheCustomer.openModel();
    },
    //客户列表
    getAllClient() {
      if (!this.client || this.client.length <= 0) {
        getClient().then(res => {
          if (res.code === 0) {
            this.client = res.data;
          }
        });
      }
    },
    //改变客户
    changeClient(value) {
      if (!value) {
        return false;
      }
      let oneClient = [];
      oneClient = this.client.filter(item => {
        return item.id === value;
      });
      for (var i in oneClient) {
        this.formPlan.settleTypeId = oneClient[i].settTypeId;
      }
    },
    //选择销售出库单
    SalesOutboundShowModel() {
      if (!this.formPlan.guestId || !this.formPlan.storeId)
        return this.$Message.error("请先选择客户和入库仓库");
      this.$refs.procurementModal.init();
    },
    //选择更多
    moreQueryShowModal(row) {
      this.oneRow = row;
      // this.moreQueryList = {};
      this.$refs.morequeryModal.openModal();
    },
    //获取时间
    getvalue(date) {
      this.queryTime = date;
    },
    // 获取仓库
    async getWarehouse() {
      let res = await getWarehouseList({
        groupId: this.$store.state.user.userData.groupId
      });
      if (res.code === 0) {
        this.WareHouseList = res.data;
        res.data.map(item => {
          if (item.isDefault == true) {
            this.formPlan.storeId = item.id;
            this.StoreId = item.id;
          }
        });
      }
    },
    //仓库改变右侧表格改变
    getStore(data) {
      if (this.formPlan.details > 0) {
        let house = this.WareHouseList.filter(item => item.id == data);
        this.formPlan.details.map(val => {
          val.storeName = house[0].name;
        });
      }
    },
    //切换页面
    selectNum(val) {
      this.page.num = val;
      this.getLeftList();
    },
    //切换页数
    selectPage(val) {
      this.page.num = 1;
      this.page.size = val;
      this.getLeftList();
    },
    //更多搜索
    queryList() {
      this.page.num = 1;
      this.getLeftList();
      // let page = this.page.num - 1;
      // let size = this.page.size;
      // let data = this.moreQueryList;
      // getLeftList(page, size, data).then(res => {
      //   if (res.code === 0) {
      //     this.sellOrderTable.tbdata = res.data.content || [];
      //     this.sellOrderTable.tbdata.forEach(el => {
      //       if(Array.isArray(el.details)) {
      //         el.details.forEach(dl => {
      //           dl.uuid = v4();
      //         })
      //       }
      //     })
      //     this.page.total = res.data.totalElements;
      //   }
      // });
    },
    throwNameFun(v){
      this.setOneClient(v);
    },


    //获取搜索框内的数
    setOneClient(val) {
      this.$set(this.formPlan, "guestId", val.id);
      this.$set(this.formPlan, "fullName", val.fullName);
      this.$set(this.formPlan, "billTypeId", val.billTypeId);
      this.$set(this.formPlan, "settleTypeId", val.settTypeId);
    },
    //获取左侧表格数据
    getLeftList() {
      let data = {...this.moreQueryList};
      data.startTime = this.queryTime[0] || "";
      data.endTime = this.queryTime[1] || "";
      data.billStatusId = this.billStatusId;
      let page = this.page.num - 1;
      let size = this.page.size;
      getLeftList(page, size, data).then(res => {
        if (res.code === 0) {
          this.sellOrderTable.tbdata = res.data.content || [];
          this.sellOrderTable.tbdata.forEach(el => {
            if(Array.isArray(el.details)) {
              el.details.forEach(dl => {
                dl.uuid = v4();
              })
            }
          })
          this.page.total = res.data.totalElements;
          if (this.id) {
            for (let b of this.sellOrderTable.tbdata) {
              b._highlight = false
              if (b.id == this.id) {
                b._highlight = true;
                this.selectTabelData(b);
                break;
              }
            }
          } else {
            this.sellOrderTable.tbdata[0]._highlight = true
            this.selectTabelData(this.sellOrderTable.tbdata[0]);
          }
        }
      });
    },

    //作废按钮
    cancellation() {
      if (this.id) {
        this.$Modal.confirm({
          title: "是否确定作废",
          onOk: async () => {
            let id = this.id;
            let res = await getDelete(id);
            if (res.code == 0) {
              this.$Message.success("作废成功");
              this.formPlan = {};
              this.getLeftList();
              this.id = null;
              this.$refs.formPlan.resetFields();
            }
          },
          onCancel: () => {
            this.$Message.info("取消作废");
          }
        });
      } else {
        this.$Message.warning("请选择草稿状态下的一条有效数据");
      }
    },

    //打印弹出框
    printTable() {
      this.$refs.printBox.openModal();
    },
    // 计算尾部总和
    countAllAmount(data) {
      let count = 0;
      data.forEach(row => {
        count += this.countAmount(row);
      });
      this.totalMoney = count.toFixed(2);
      return count.toFixed(2);
    },
    //保存
    isSave() {
      this.formPlan.orderDate=new Date(this.formPlan.orderDate)
      if (!this.isSelfOk) {
        return this.$message.error("请填写正确的仓位!");
      }
      let orderT=tools.transTime(this.formPlan.orderDate)
      this.$refs.formPlan.validate(async valid => {
        let preTime = "";
        if (valid) {
          preTime = JSON.parse(JSON.stringify(this.formPlan.orderDate));
          this.formPlan.orderDate=orderT;
          try {
            await this.$refs.xTable.validate();
            let data = {};
            data = this.formPlan;
            data.billStatusId = null;
            let res = await getSave(data);
            if (res.code === 0) {
              this.isAdd = true;
              this.isNew = true;
              this.$Message.success("保存成功");
              this.formPlan = {};
              this.id=null
              this.getLeftList();
              this.$refs.formPlan.resetFields();
            } else {
              this.formPlan.orderDate = preTime;
            }
          } catch (errMap) {
            this.$XModal.message({
              status: "error",
              message: "表格校验不通过！"
            });
          }
        } else {
          this.$set(this.sellOrderTable.tbdata, 0, this.PTrow);
          this.$Message.error("*为必填项");
        }
      });
    },

    getPlanOrder(Msg) {
      let arr = Msg || [];
      arr = JSON.parse(JSON.stringify(arr));
      if (arr.length <= 0) return;

      let flag = false;

      if(this.formPlan.details == null) {
        this.formPlan.details = [];
      }

      for(let i = 0; i < this.formPlan.details.length; i++) {
        let el = this.formPlan.details[i];
        for(let j = 0; j < arr.length; j++) {
          let em = arr[j];
          // console.log(em.sourceDetailId, el.sourceDetailId)
          if(el.sourceDetailId == em.sourceDetailId) {
            arr.splice(j, 1);
            flag = true;
          }
        }
      }

      if(flag) {
        this.$message.error("同一批次配件不重复添加");
      }

      arr.forEach(item => {
        item.partInnerId = item.partId;
        item.prevDetailId = item.sourceDetailId;
        item.outUnitId = item.systemUnitId;
        item.unit = item.systemUnitId;
        item.enterUnitId = item.systemUnitId;
        item.orderQty = item.rtnableQty;
        item.orderPrice = item.sellPrice;
        item.oid = v4();
        item.uuid = item.oid;
        // Reflect.deleteProperty(item, "sourceDetailId");
      });
      if (!this.formPlan.details) {
        this.formPlan.details = [];
      }
      this.formPlan.details = this.formPlan.details.concat(arr);
      if(!flag) {
        this.$message.success("已添加");
      }
    },

    //提交
    isSubmit() {
      this.formPlan.orderDate=new Date(this.formPlan.orderDate)
      if (!this.isSelfOk) {
        return this.$message.error("请填写正确的仓位!");
      }
      this.$refs.formPlan.validate(async valid => {
        let preTime = "";
        if (valid) {
          preTime = JSON.parse(JSON.stringify(this.formPlan.orderDate));
          this.formPlan.orderDate=moment(this.formPlan.orderDate).format("YYYY-MM-DD")+" 00:00:00"
          try {
            await this.$refs.xTable.validate();
            this.$Modal.confirm({
              title: "是否确定提交订单",
              onOk: async () => {
                let data = {};
                data = this.formPlan;
                data.billStatusId = null;
                // data.orderDate = tools.transTime(this.formPlan.orderDate);
                let res = await getSubmit(data);
                if (res.code == 0) {
                  this.$Message.success("提交成功");
                  this.isNew = true;
                  this.formPlan = {};
                  this.id = null;
                  this.$refs.formPlan.resetFields();
                  this.getLeftList();
                  // this.reload();
                } else {
                  this.formPlan.orderDate = preTime;
                }
              },
              onCancel: () => {
                this.$Message.info("取消提交");
              }
            });
          } catch (errMap) {
            // this.$XModal.message({ status: 'error', message: '表格校验不通过！' })
          }
        } else {
          this.$Message.error("*为必填项");
        }
      });
    },

    //选择销售出库单
    getOutList(val) {
      if (this.formPlan.details == null) {
        this.formPlan.details = [];
      }
      val.forEach(item => {
        item.orderQty = item.rtnableQty;
        item.orderPrice = item.sellPrice;
        item.uuid = v4();
        this.formPlan.details.push(item);
      });
      // console.log('我是formplan',this.formPlan.details)
    },

    //删除配件
    async deletePart() {
      if (this.selectTableList.length > 0) {
        let data = [];
        let arr = [];
        let ids = [];
        this.selectTableList.forEach(item => {
          if (item.id) {
            data.push({ id: item.id });
            ids.push(item.uuid);
          } else {
            arr.push({ oid: item.oid });
            ids.push(item.uuid);
          }
        });

        let res = { code: 0 };

        if(arr.length > 0) {
          res = { code: 0 }
        }

        if(data.length > 0) {
          res = await getDeleteList(data);
        }

        if(res.code == 0) {
          this.$Message.success("删除配件成功");

          this.formPlan.details = this.formPlan.details.filter(el => {
            return !ids.includes(el.uuid);
          })

          this.$refs.xTable.clearCheckboxRow();

          this.selectTableList = [];
        }
      } else {
        this.$Message.error("请选择一条有效数据");
      }
    },
    //获取尾部总数
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "和值";
          }
          if (["orderPrice", "orderAmt"].includes(column.property)) {
            return this.$utils.sum(data, column.property).toFixed(2);
          }
          if (columnIndex === 7) {
            return ` ${this.countAllAmount(data)} `;
          }
          return null;
        })
      ];
    }
  },
  watch: {
    //监听时间
    queryTime: function(val, old) {
      this.page.num = 1;
      this.page.size = 10;
      this.getLeftList();
    },
    //监听状态
    billStatusId: function(val, old) {
      this.page.num = 1;
      this.page.size = 10;
      this.getLeftList();
    },
    formPlan: {
      handler(val, old) {},
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../lease/product/lease.less");
@import url("./index");
.goods-list-form .ivu-form-item {
  margin-bottom: 0px;
}
</style>
<style scoped>
.purchase >>> .ivu-form-item .ivu-form-item-label {
  font-size: 12px !important;
}
</style>
