<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf wlf-center">
          <div class="db">
            <getDate class="mr10" @quickDate="getvalue"></getDate>
          </div>
          <div class="db">
            <Select v-model="orderType" style="width:100px" class="mr10" @on-change="getOrderType">
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db">
            <Button type="default" class="mr10" @click="moreQueryShowModal">
              <Icon type="ios-more" />更多
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="addOrder" v-has="'add'">
              <Icon type="md-add" />新增
            </Button>
          </div>
          <div class="db">
            <Button
              type="default"
              class="mr10"
              :disabled="draftShow != 0||isNew"
              @click="isSave"
              v-has="'save'"
            >
              <i class="iconfont mr5 iconbaocunicon"></i>保存
            </Button>
          </div>
          <div class="db">
            <Button
              class="mr10"
              @click="isSubmit"
              :disabled="draftShow != 0||isNew"
              v-has="'submit'"
            >
              <i class="iconfont mr5 iconziyuan2"></i>提交
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="printTable" v-has="'print'">
              <i class="iconfont mr5 icondayinicon"></i> 打印
            </Button>
          </div>

          <div class="db">
            <Button class="mr10" @click="isDelete" :disabled="draftShow != 0" v-has="'delete'">
              <Icon type="md-close" size="14" />作废
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="Output" v-has="'output'">
              <i class="iconfont mr5 icondaochuicon"></i> 导出
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" :disabled="draftShow != 3" @click="finish" v-has="'finish'">
              <i class="iconfont mr5"></i> 完成销售
            </Button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <div class="con-split" ref="paneLeft">
          <Split v-model="split1" min="200" max="500" @on-moving="getDomHeight">
            <!--   左边表格-->
            <div slot="left" class="con-split-pane-left" style="height: 100%;">
              <div class="pane-made-hd">预销售单列表</div>
              <Table
                ref="currentRowTable"
                :queryTime="queryTime"
                :orderType="orderType"
                :height="leftTableHeight"
                size="small"
                highlight-row
                border
                :stripe="true"
                :loading="preSellOrderTable.loading"
                :columns="preSellOrderTable.columns"
                :data="preSellOrderTable.tbData"
                @on-current-change="selectTabelData"
              ></Table>

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
                class="mr10"
                :page-size-opts="[20, 50, 100, 200]"
              ></Page>
            </div>
            <!-- 右边表格-->
            <div
              slot="right"
              class="con-split-pane-right pl5 goods-list-form"
              style="height: 100%;"
            >
              <div class="pane-made-hd">
                <span class="titler mr5">固定额度:</span>
                <span class="titler mr10">{{this.limitList.fixationQuota |priceFilters}}</span>
                <span class="titler mr5">临时余额:</span>
                <span class="titler mr10">{{this.limitList.tempQuota |priceFilters}}</span>
                <span class="titler mr5">可用余额:</span>
                <span class="titler mr5">{{ this.limitList.sumAmt | priceFilters}}</span>
              </div>
              <Form
                inline
                :show-message="false"
                ref="formPlan"
                :model="formPlan"
                :label-width="120"
                :rules="ruleValidate"
              >
                <div class="clearfix purchase" ref="planForm">
                  <FormItem label="客户：" prop="guestId">
                    <Row>
                      <!--<Tooltip :content="formPlan.fullName">-->
                      <!--<Input placeholder="请选择客户" v-model="formPlan.fullName" readonly disabled style="width:200px;" />-->
                      <!--</Tooltip>-->
                      <sales-cus style="width:200px; display: inline-block" :disabled-prop="draftShow != 0||isNew" :title="formPlan.fullName" placeholder="请输入客户" :search-value="formPlan.fullName" @throwName="throwNameFun"></sales-cus>
                      <!-- <Select
                        v-model="formPlan.guestId"
                        filterable
                        style="width: 240px"
                        :disabled="draftShow != 0||isNew"
                        @on-change="changeClient"
                      >
                        <Option
                          v-for="item in client"
                          :value="item.id"
                          :key="item.id"
                        >{{ item.fullName }}</Option>
                      </Select> -->
                      <Button
                        class="ml5"
                        size="small"
                        type="default"
                        @click="CustomerShowModel"
                        :disabled="draftShow != 0||isNew"
                      >
                        <Icon type="md-checkmark" />
                      </Button>
                    </Row>
                  </FormItem>
                  <FormItem label="业务员：" prop="orderManId">
                    <!--                    <Input-->
                    <!--                      class="w160"-->
                    <!--                      placeholder="请输入业务员"-->
                    <!--                      v-model="formPlan.orderMan"-->
                    <!--                      :disabled="draftShow != 0||isNew"-->
                    <!--                    />-->
                    <Select
                      v-model="formPlan.orderManId"
                      @on-change="selectOrderMan"
                      filterable
                      style="width: 180px"
                      :disabled="draftShow != 0||isNew"
                      label-in-value
                    >
                      <Option
                        v-for="item in salesList"
                        :value="item.id"
                        :key="item.id"
                      >{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="交货仓库：" prop="storeId">
                    <Select
                      v-model="formPlan.storeId"
                      style="width:180px"
                      :disabled="draftShow != 0||isNew"
                      @on-change="getStore"
                    >
                      <Option
                        v-for="item in WareHouseList"
                        :value="item.id"
                        :disabled="item.sellSign||item.isDisabled"
                        :key="item.id"
                      >{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="票据类型:" prop="billTypeId">
                    <Select
                      v-model="formPlan.billTypeId"
                      style="width:100px"
                      :disabled="draftShow != 0||isNew"
                    >
                      <Option
                        v-for="item in settleTypeList.CS00107"
                        :value="item.itemCode"
                        :key="item.itemCode"
                      >
                        {{
                        item.itemName }}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="预售单号：">
                    <Input class="w230" style="margin-right: 3px" v-model="formPlan.serviceId" disabled />
                  </FormItem>
                  <FormItem label="预计发货日期:">
                    <DatePicker
                      :value="formPlan.planSendDate"
                      @on-change="getplanSendDate"
                      @on-clear="clearplanSendDate"
                      v-bind:options="planSendDatePicker"
                      type="date"
                      placeholder="选择日期"
                      style="width: 180px"
                      :disabled="draftShow != 0||isNew"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="预计到货日期:">
                    <DatePicker
                      :value="formPlan.planArriveDate"
                      @on-change="getplanArriveDate"
                      v-bind:options="planArriveDatePicker"
                      type="date"
                      placeholder="选择日期"
                      @on-clear="clearplanArriveDate"
                      style="width: 180px"
                      :disabled="draftShow != 0||isNew"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="结算方式：" prop="settleTypeId">
                    <Select
                      v-model="formPlan.settleTypeId"
                      style="width:100px"
                      :disabled="draftShow != 0||isNew"
                    >
                      <Option
                        v-for="item in settleTypeList.CS00106"
                        :value="item.itemCode"
                        :key="item.itemCode"
                      >
                        {{
                        item.itemName }}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="备注：">
                    <Tooltip :content="formPlan.remark">
                    <Input
                      style="width: 370px"
                      v-model="formPlan.remark"
                      :disabled="draftShow != 0||isNew"
                    />
                    </Tooltip>
                  </FormItem>
                </div>
                <div class="flex plan-cz-btn" ref="planBtn">
                  <div class="clearfix">
                    <div class="fl mb5">
                      <Button
                        size="small"
                        class="mr10"
                        v-has="'addMountings'"
                        @click="addMountings "
                        :disabled="draftShow != 0||isNew"
                      >
                        <Icon type="md-add" />添加配件
                      </Button>
                    </div>
                    <div class="fl mb5">
                      <Button
                        size="small"
                        class="mr10"
                        :disabled="draftShow != 0||isNew"
                        @click="deletePart"
                        v-has="'deletePart'"
                      >
                        <Icon custom="iconfont iconlajitongicon icons" />删除配件
                      </Button>
                    </div>
                    <div class="fl mb5">
                      <Upload
                        ref="upload"
                        style="display: inline-block"
                        :show-upload-list="false"
                        :action="upurl"
                        :headers="headers"
                        :format="['xlsx','xls']"
                        :on-format-error="onFormatError"
                        :on-success="onSuccess"
                        :before-upload="beforeUpload"
                      >
                        <Button
                          size="small"
                          class="mr10"
                          @click="getRUl"
                          v-has="'getRUl'"
                          :disabled="draftShow != 0||isNew||!isAdd"
                        >
                          <span class="center">
                            <Icon custom="iconfont icondaoruicon icons" />导入配件
                          </span>
                        </Button>
                      </Upload>
                    </div>
                    <div class="fl mb5 mr10">
                      <Button size="small" @click="down" v-has="'down'">
                        <Icon custom="iconfont iconxiazaiicon icons" />下载模板
                      </Button>
                    </div>
                    <div class="fl mb5">
                      <Button
                        size="small"
                        class="mr10"
                        @click="openAddressShow"
                        v-has="'editAddress'"
                        :disabled="draftShow != 0||isNew"
                      >编辑发货信息</Button>
                    </div>
                  </div>
                </div>
                <vxe-table
                  border
                  :edit-rules="validRules"
                  show-footer
                  :footer-method="footerMethod"
                  resizable
                  auto-resize
                  size="mini"
                  ref="xTable"
                  :height="rightTableHeight"
                  @select-change="selectTable"
                  @select-all="selectAllTable"
                  @edit-actived="editActivedEvent"
                  :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true}"
                  @keydown="keydown"
                  :data="formPlan.detailVOList"
                  :edit-config="{ trigger: 'click', mode: 'cell' }"
                >
                  <vxe-table-column  show-overflow="tooltip" type="seq" title="序号" fixed="left" width="60"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" type="checkbox" fixed="left" width="60"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" title="操作" fixed="left" width="100">
                    <template v-slot="{ row,rowIndex }">
                      <a @click="openFileModal(row)">查看</a>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="partCode" title="配件编码" fixed="left" width="100"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="partName" title="配件名称" fixed="left" width="100"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="partBrand" title="品牌" fixed="left" width="100"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip"
                    field="orderQty"
                    title="数量"
                    width="100"
                    :edit-render="{name: 'input',attrs: {disabled: false}}"
                  ></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip"
                    field="orderPrice"
                    title="销价"
                    width="100"
                    :edit-render="{name: 'input',attrs: {disabled: false}}"
                  ></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" title="金额" width="100">
                    <template v-slot="{ row }">
                      <span>{{ countAmount(row) | priceFilters}}</span>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip"
                    field="remark"
                    title="备注"
                    width="160"
                    :edit-render="{name: 'input',attrs: {disabled: false}}"
                  ></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="storeName" title="仓库" disabled width="100">
                    <template v-slot:edit="{ row }">
                      <Select style="width:100px">
                        <Option
                          v-for="item in WareHouseList"
                          :value="item.id"
                          :key="item.id"
                        >{{ item.name }}</Option>
                      </Select>
                    </template>
                  </vxe-table-column>

                  <vxe-table-column  show-overflow="tooltip" title="品牌车型" width="100">
                    <template v-slot="{row, rowIndex}">
                      <span>{{row.carBrandName}} {{row.carModelName}}</span>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="unit" title="单位" width="100"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="oemCode" title="OEM码" width="100"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="spec" title="规格" width="100"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="showDirection" title="方向" width="100"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="partInnerId" title="配件内码" width="120"></vxe-table-column>
                </vxe-table>
              </Form>
            </div>
          </Split>
        </div>
      </div>
    </section>
    <!--      添加配件-->
    <select-part-com ref="selectPartCom" @selectPartName="getPartNameList" :store-id="formPlan.storeId"></select-part-com>
    <!--    选择客户-->
    <select-the-customer ref="selectTheCustomer" @getOne="setOneClient"></select-the-customer>
    <!--更多 搜索-->
    <More-search :data="moreQueryList" ref="morequeryModal" @moreQuery="queryList"></More-search>
    <!--      查看详情-->
    <See-file ref="fileList" :data="oneRow"></See-file>
    <goods-info ref="goodsInfo" :guestId="formPlan.guestId" :mainId="id" :row="this.currentRow"></goods-info>
  </div>
</template>

<script>
import baseUrl from "_conf/url";
import { TOKEN_KEY } from "@/libs/util";
import {
  getSales,
  getLeftList,
  getClient,
  getWarehouseList,
  getDelete,
  getSave,
  getSubmit,
  getLimit,
  finishSales,
  getDeleteList,
  getup
} from "_api/salesManagment/presell.js";
import getDate from "@/components/getDate/dateget";
import goodsInfo from "../../AlotManagement/transferringOrder/applyFor/compontents/goodsInfo/GoodsInfo";
import selectTheCustomer from "../commonality/SelectTheCustomer.vue";
import selectPartCom from "../salesOrder/components/selectPartCom";
import MoreSearch from "./components/MoreSearch";
import SeeFile from "../commonality/SeeFile";
import { getDigitalDictionary } from "@/api/system/essentialData/clientManagement";
import { conversionList } from "@/components/changeWbList/changewblist";
import * as tools from "../../../utils/tools";
import Cookies from "js-cookie";
import SalesCus from "../../../components/allocation/salesCus";
export default {
  name: "presell",
  components: {
    SalesCus,
    getDate,
    goodsInfo,
    selectTheCustomer,
    selectPartCom,
    MoreSearch,
    SeeFile,
  },
  data() {
    let changeNumber = ({cellValue }) => {
      const reg = /^[1-9]\d{0,}$/;
      if(!reg.test(cellValue)) {
        return Promise.reject(new Error('数量输入不正确'))
      }
    };

    let money = ({cellValue}) => {
      const reg = /^\d+(\.\d{0,2})?$/i;
      if (!reg.test(cellValue)) {
          return Promise.reject(new Error('最多保留2位小数'))
      }
    };
    return {
      leftTableHeight:0,
      rightTableHeight:0,
      isNew: true, //判断页面开始是否禁用
      headers: {
        Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
      }, //请求头
      upurl: getup, //导入地址
      oneRow: {}, //点击详情的数据
      draftShow: "", //判定是不是草稿
      settleTypeList: {}, //结账类型
      moreQueryList: {}, //更多查询
      model1: "",
      WareHouseList: [], //交货仓库
      limitList: [], //客户额度
      currentRow: null,
      //分页
      page: {
        total: 0,
        size: 20,
        num: 1
      },
      split1: 0.2, //左右框
      preSellOrderTable: {
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
            minWidth: 70,
            render: (h, params) => {
              let tex = params.row.status.name;
              return h("span", {}, tex);
            }
          },
          {
            title: "客户",
            key: "guestName",
            minWidth: 170
          },
          {
            title: "创建日期",
            key: "createTime",
            minWidth: 120
          },
          {
            title: "创建人",
            key: "createUname",
            minWidth: 100
          },
          {
            title: "预售单单号",
            key: "serviceId",
            minWidth: 200
          },
          {
            title: "打印次数",
            key: "printTime",
            minWidth: 120
          },
          {
            title: "提交人",
            key: "commitUname",
            minWidth: 100
          },
          {
            title: "提交日期",
            align: "center",
            key: "commitTime",
            minWidth: 170
          }
        ],
        tbData: []
      }, //表格属性
      orderType: 99, //快速查询状态
      typeList: [
        { value: 99, name: "所有" },
        { value: 0, name: "草稿" },
        { value: 1, name: "待受理" },
        { value: 3, name: "已受理" },
        { value: 4, name: "已完成" },
        { value: 5, name: "已作废" }
      ],
      //右侧表格数据
      tableData: [],
      formPlan: {
        orderMan: "",
        orderManId: "",
        detailVOList: [],
        guestId: "",
        billTypeId: "",
        settleTypeId: "",
        storeId: ""
      }, //表单对象
      addressShow: false, //收货地址显示
      query: {}, //更多搜索信息
      client: [], //客户列表
      totalMoney: "", //总价
      ruleValidate: {
        //表单校验
        guestId: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ],
        orderManId: [
          { required: true, type: "string", message: "  ", trigger: "change" }
        ],
        billTypeId: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ],
        settleTypeId: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ],
        storeId: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ]
      },
      validRules: {
        //表格校验
        orderQty: [{ required: true, validator: changeNumber }],
        orderPrice: [{ required: true, validator: money }]
      },
      queryTime: "", //快速查询时间
      isAdd: true, //判断是否新增
      Flag: false, //判断是否已提交
      salesList: [], //业务员列表
      id: "", //左侧表格id
      PTrow: {
        _highlight: true,
        status: { name: "草稿", value: 0 },
        orderMan: this.$store.state.user.userData.staffName,
        orderManId: this.$store.state.user.userData.id
      },
      selectTableList: [], //右侧table表格选的数据
      // isCommit: false, //判断是否已提交
      planSendDatePicker: {
        disabledDate: function(date) {
          //不能选择小于当前时间的日期；
          return (
            date.getTime() < new Date(new Date().toLocaleDateString()).getTime()
          );
        }
      },
      planArriveDatePicker: {},
      submitloading:false,
    };
  },
  mounted() {
    this.getLeftList();
    // this.getAllClient();
    this.getWarehouse();
    this.getType();
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
        const isLastColumn = nowIndex === columnsField.length - 2
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
    getDomHeight() {
      this.$nextTick(() => {
        let wrapH = this.$refs.paneLeft.offsetHeight;
        let planFormH = this.$refs.planForm.offsetHeight;
        //获取左侧侧表格高度
        this.leftTableHeight = wrapH - 90;
        this.rightTableHeight = wrapH - planFormH  - 120;
      });
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
    //多选内容
    selectTable(data) {
      this.selectTableList = data.selection;
    },
    //全选内容
    selectAllTable(data) {
      this.selectTableList = data.selection;
    },
    //获取销售员
    selectOrderMan(val) {
      this.formPlan.orderMan = val.label;
      this.formPlan.orderManId = val.value;
    },
    //导出
    Output() {
      let id = this.id;
      if (!id) {
        this.$message.error("请选择一条有效数据");
        return false;
      } else {
        location.href =
          baseUrl.omsOrder +
          "/guestOrderMain/export?id=" +
          id +
          "&access_token=" +
          Cookies.get(TOKEN_KEY);
      }
    },
    //打印弹出框
    printTable() {
      let order = {};
      order.name="预售单"
      order.route=this.$route.name
      order.id=this.id
      let routeUrl=this.$router.resolve({name:"print",query:order})
      window.open(routeUrl.href,"_blank");
      this.getLeftList()
    },

    //获取客户额度
    getAllLimit() {
      const guestId = this.formPlan.guestId;
      const id = this.formPlan.id
      getLimit({guestId,id}).then(res => {
        if (res.code === 0) {
          this.limitList = res.data;
        }
      });
    },
    //改变客户
    async changeClient(value) {
      if (!value) {
        return false;
      }
      let oneClient = [];
      oneClient = this.client.filter(item => {
        return item.id === value;
      });
      for (var i in oneClient) {
        this.formPlan.billTypeId = oneClient[i].billTypeId;
        this.formPlan.settleTypeId = oneClient[i].settTypeId;
      }
      let guestId = value;
      let res = await getLimit({guestId,id:''});
      if (res.code === 0) {
        this.limitList = res.data;
      }
    },

    //更多搜索
    queryList() {
      this.page.num = 1;
      let page = this.page.num - 1;
      let size = this.page.size;
      let data = this.moreQueryList;
      getLeftList(size, page, data).then(res => {
        if (res.code === 0) {
          this.preSellOrderTable.tbData = res.data.content || [];
          this.page.total = res.data.totalElements;
        }
      });
    },

    //仓库改变右侧表格改变
    getStore(data) {
      // let house = this.WareHouseList.filter(item => item.id == data);
      // this.formPlan.detailVOList = [];
      // this.formPlan.detailVOList.map(val => {
      //   val.storeName = house[0].name;
      // });
    },
    throwNameFun(v){
      this.setOneClient(v);
    },
    //获取搜索框内的数据
    setOneClient(val) {
      this.$set(this.formPlan, "guestId", val.id);
      this.$set(this.formPlan, "fullName", val.fullName);
      this.$set(this.formPlan, "billTypeId", val.billTypeId);
      this.$set(this.formPlan, "settleTypeId", val.settTypeId);
    },
    //获取表单预计发货时间
    getplanSendDate(data) {
      this.formPlan.planSendDate = tools.transTime(data);

      //选择日期时，不能小于预计发货日期
      let statDt = this.formPlan.planSendDate;
      this.planArriveDatePicker = {
        disabledDate(endTime) {
          return endTime.getTime() < new Date(statDt).getTime();
        }
      };
    },
    //获取表单计划到货日期
    getplanArriveDate(data) {
      this.formPlan.planArriveDate = tools.transTime(data);
    },
    //清空日期
    clearplanSendDate(v) {
      this.formPlan.planSendDate = null;
    },
    clearplanArriveDate(v) {
      this.formPlan.planArriveDate = null;
    },
    //获取选择状态类型
    getOrderType(v) {
      this.orderType = v;
    },
    //获取时间
    getvalue(date) {
      this.queryTime = date;
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
    //打开新增客户
    CustomerShowModel() {
      this.$refs.selectTheCustomer.openModel();
    },
    //选择更多
    moreQueryShowModal(row) {
      this.oneRow = row;
      this.moreQueryList = {};
      this.$refs.morequeryModal.openModal();
    },
    //点击查看
    openFileModal(row) {
      this.oneRow = row;
      this.$nextTick(function() {
        this.$refs.fileList.openModal();
      });
    },
    //打开收货地址
    openAddressShow() {
      if(!this.currentRow.id) {
        return this.$message.error("请先保存预售单")
      }
      this.$refs.goodsInfo.init();
    },
    //添加配件
    addMountings() {
      this.$refs.selectPartCom.init();
    },

    //配件返回的参数
    getPartNameList(val) {
      this.$refs.formPlan.validate(async valid => {
        if (valid) {
          var datas = conversionList(val);
          datas.forEach(item => {
            if(!item.orderQty) {
              item.orderQty = undefined;
            }
            if(!(item.orderPrice * 1)) {
              item.orderPrice = undefined;
            }
            this.formPlan.detailVOList.push(item);
          });
          this.$Message.success("已添加");
        } else {
          this.$Message.error("*为必填项");

        }
      });
    },
    //客户列表
    getAllClient() {
      getClient().then(res => {
        if (res.code === 0) {
          this.client = res.data;
        }
      });
    },
    //分页查询预售单信息左侧
    getLeftList() {
      let data = {};
      data.createTimeStart = this.queryTime[0] || "";
      data.createTimeEnd = this.queryTime[1] || "";
      data.status = this.orderType;
      let page = this.page.num - 1;
      let size = this.page.size;
      getLeftList(size, page, data).then(res => {
        if (res.code === 0) {
          // this.draftShow = value
          this.preSellOrderTable.tbData = res.data.content || [];
          this.page.total = res.data.totalElements;
          for(let b of this.preSellOrderTable.tbData){
            b._highlight = false
            if(b.id==this.currentRow.id){
              b._highlight = true;
              this.setRightData(b);
              break;
            }
          }

        }
      });
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
            this.preSellOrderTable.tbData.splice(0, 1);
            currentRowTable.clearCurrentRow();
            this.isAdd = true;
            this.currentRow = v;
            this.id = v.id;
            this.tableData = v.detailVOList;
            this.formPlan = v;
            this.draftShow = v.status.value;
            this.selectTableList = [];
            this.$refs.formPlan.resetFields();
            for(let b of this.preSellOrderTable.tbData){
                b._highlight = false
                if(b.id==this.id){
                    b._highlight = true;
                    break;
                }
            }
          }
        });
        {
        }
      } else {
        if (v.id) {
          v.fullName = v.guestName;
          this.isNew = false;
          this.currentRow = v;
          this.id = v.id;
          this.tableData = v.detailVOList;
          this.formPlan = v;
          this.draftShow = v.status.value;
          this.selectTableList = [];
          this.limitList = {};
        }
      }
    },
    // 获取仓库
    async getWarehouse() {
      let res = await getWarehouseList({
        groupId: this.$store.state.user.userData.groupId
      });
      if (res.code === 0) {
        this.WareHouseList = res.data;
      }
    },
    //计算表格数据
    countAmount(row) {
      return (
        this.$utils.toNumber(row.orderQty) *
        this.$utils.toNumber(row.orderPrice)
      );
    },
    // 计算尾部总和
    countAllAmount(data) {
      let count = 0;
      data.forEach(row => {
        count += this.countAmount(row);
      });
      this.totalMoney = count;
      return count.toFixed(2);
    },
    //获取尾部总数
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "和值";
          };
          if (
            ["orderPrice", "orderAmt"].includes(column.property)
          ) {
            return this.$utils.sum(data, column.property).toFixed(2);
          };
          // if (
          //   ["orderQty"].includes(column.property)
          // ) {
          //   return this.$utils.sum(data, column.property).toFixed(0);
          // }
          if (columnIndex === 8) {
            return ` ${this.countAllAmount(data)} `;
          }
          return null;
        })
      ];
    },
    //获取客户属性
    async getType() {
      let data = {};
      //107票据类型
      //106结算方式
      data = ["CS00106", "CS00107"];
      let res = await getDigitalDictionary(data);
      if (res.code == 0) {
        this.settleTypeList = res.data;
      }
    },

    //新增按钮
    addOrder() {
      this.formPlan = {};
      this.$refs.formPlan.resetFields();
      this.isNew = false;
      this.tableData = [];
      this.formPlan.detailVOList=[];
      this.formPlan = {
        detailVOList: [],
        orderMan: this.PTrow.orderMan,
        orderManId: this.PTrow.orderManId
      };
      this.limitList = [];
      this.draftShow = 0;
      this.currentRow = {};
      if (!this.isAdd) {
        return this.$Message.error("请先保存数据");
      }
      this.WareHouseList.map(item=>{
          if(item.isDefault){
            this.formPlan.storeId = item.id;
          }
      })
        for(let b of this.preSellOrderTable.tbData){
            b._highlight = false
        }
        this.preSellOrderTable.tbData.unshift(this.PTrow);
      this.isAdd = false;
    },
    //作废按钮
    isDelete() {
      if(this.submitloading){ return }
      if (this.id) {
        this.$Modal.confirm({
          title: "是否确定作废",
          onOk: async () => {
            let id = this.id;
            this.submitloading=true
            let res = await getDelete(id);
            if (res.code == 0) {
              this.$Message.success("作废成功");
              this.id = null;
              this.formPlan = {};
              this.getLeftList();
              this.isNew = true;
              this.submitloading=false;
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
    //保存
    isSave() {
      if(this.submitloading){ return }
      let zero = tools.isZero(this.formPlan.detailVOList, {qty: "orderQty", price: "orderPrice"});
      if(zero) return;
      this.$refs.formPlan.validate(async valid => {
        if (valid) {
          try {
            await this.$refs.xTable.validate();
            if (+this.totalMoney > +this.limitList.outOfAmt) {
              return this.$message.error("可用余额不足");
            }
            this.submitloading=true
            let res = await getSave(this.formPlan);
            if (res.code === 0) {
              this.isAdd = true;
              this.isNew = true;
              this.$Message.success("保存成功");
              this.formPlan = {};
              this.limitList = {};
              this.getLeftList();
              this.submitloading=false;
              this.$refs.formPlan.resetFields();
            }else{
              this.submitloading=false;
            }
          } catch (errMap) {
            this.$XModal.message({
              status: "error",
              message: "表格校验不通过！"
            });
          }
        } else {
            this.$set(this.preSellOrderTable.tbData,0,this.PTrow);
          this.$Message.error("*为必填项");
        }
      });
    },
    //提交
    isSubmit() {
      if(this.submitloading){ return }
      let zero = tools.isZero(this.formPlan.detailVOList, {qty: "orderQty", price: "orderPrice"});
      if(zero) return;
      this.$refs.formPlan.validate(async valid => {
        if (valid) {
          try {
            await this.$refs.xTable.validate();
            if (+this.totalMoney > +this.limitList.outOfAmt) {
              return this.$message.error("可用余额不足");
            }
            this.$Modal.confirm({
              title: "是否确定提交订单",
              onOk: async () => {
                this.submitloading=true;
                let data = {};
                data = this.formPlan;
                let res = await getSubmit(data);
                if (res.code == 0) {
                  this.$Message.success("提交成功");
                  this.isNew = true;
                  this.isAdd = true;
                  this.formPlan = {};
                  // this.id = null;
                  this.limitList = [];
                  this.$refs.formPlan.resetFields();
                  this.getLeftList();
                  this.submitloading=false;
                }else{
                  this.submitloading=false;
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

    //完成销售
    finish() {
      if(this.submitloading){ return }
      if (this.id) {
        this.$Modal.confirm({
          title: "是否确定已完成销售",
          onOk: async () => {
            this.submitloading=true;
            let id = this.id;
            let res = await finishSales(id);
            if (res.code == 0) {
              this.$Message.success("操作成功");
              this.id = null;
              this.limitList = [];
              this.$refs.formPlan.resetFields();
              this.formPlan = {};
              this.getLeftList();
              this.submitloading=false;
            }else{
              this.submitloading=false;
            }
          },
          onCancel: () => {
            this.$Message.info("取消成功");
          }
        });
      } else {
        this.$Message.warning("请选择已受理状态下的一条有效数据");
      }
    },

    //删除配件
    deletePart() {
      let checkedData = this.$refs.xTable.getSelectRecords();
      if (checkedData.length > 0) {
        let data = [];
        this.selectTableList.forEach(item => {
          data.push({ id: item.id });
        });
        const arr = this.formPlan.detailVOList.filter(v => !checkedData.includes(v));
        this.$set(this.formPlan, "detailVOList", arr);
        if(!data[0].id) return
        this.preSellOrderTable.tbData.map((item, index) => {
          if (item.id === this.formPlan.id) {
            this.$set(
              this.preSellOrderTable.tbData[index],
              "detailVOList",
              arr
            );
          }
        });
        getDeleteList(data).then(res => {
          if (res.code === 0) {
            this.$Message.success("删除配件成功");
          }
        });
      } else {
        this.$Message.error("请选择一条有效数据");
      }
    },
    //批量上传失败
    onFormatError(file) {
      this.$Message.error("只支持xls xlsx后缀的文件");
    },
    // 上传成功函数
    onSuccess(response) {
      if (response.code == 0) {
        let txt = "上传成功";
        if (response.data.length > 0) {
          this.warning(response.data)
        }else{
          this.$Notice.warning({
            title: "导入成功",
            desc: txt,
            duration: 0
          });
        }
      } else {
        this.$Message.error(response.message);
      }
      this.getLeftList();
    },
    warning(nodesc) {
      let str=""
      if(nodesc.length>0){
        nodesc.map((item,index)=>{
          if(index!=nodesc.length-1){
            str+=`${item}<br/>`
          }else{
            str+=`${item}`
          }
        })
      }
      this.$Notice.warning({
        title: "上传错误信息",
        desc: str,
        duration:0
      });
    },
    setRightData(v){
      if (v.id) {
        this.isNew = false;
        this.currentRow = v;
        this.id = v.id;
        this.tableData = v.detailVOList;
        this.formPlan = v;
        this.draftShow = v.status.value;
        this.selectTableList = [];
        this.limitList = {};
      }
    },

    //上传之前清空
    beforeUpload() {
      this.$refs.upload.clearFiles();
    },

    //导入配件
    getRUl() {
      let id = this.id;
      this.upurl = getup + "id=" + id;
    },
    //下载模板
    down() {
      location.href =
        baseUrl.omsOrder +
        "/guestOrderMain/template?access_token=" +
        Cookies.get(TOKEN_KEY);
    }
  },
  watch: {
    //监听时间
    queryTime: function(val, old) {
      this.page.num = 1;
      this.page.size = 20;
      this.getLeftList();
    },
    //监听状态
    orderType: function(val, old) {
      this.page.num = 1;
      this.page.size = 20;
      this.getLeftList();
    },
    formPlan: {
      handler(val, old) {
        if (!val.id) {
          return false;
        }
        this.getAllLimit();
      },
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../lease/product/lease.less");

.goods-list-form {
  * {
    font-size: 12px !important;
  }

  .ivu-form-item {
    margin-bottom: 0px;
    .ivu-form-item-label{
      font-size: 12px!important;
    }
  }

  .plan-cz-btn {
    border-top: 1px solid #ddd;
    margin-top: 6px;
    justify-content: space-between;
    padding: 8px 10px 4px;
    align-items: center;
  }
}

.wlf-center {
  display: flex;
  align-items: center;
}
</style>
<style scoped>
  .purchase .ivu-form-item .ivu-form-item-label{
    font-size: 12px!important;
  }
</style>
