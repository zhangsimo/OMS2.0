<template>
  <div class="content-oper content-oper-flex loadingClass">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf wlf-center">
          <div class="db">
            <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>
            <Select v-model="purchaseType" class="w90 mr10" @on-change="SelectChange">
              <Option
                v-for="item in statusArr"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}
              </Option>
            </Select>
          </div>
          <div class="db">
            <Button type="default" @click="moreaa" class="mr10">
              <i class="iconfont mr5 iconchaxunicon"></i>更多
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="addProoo" v-has="'add'">
              <Icon type="md-add"/>
              新增
            </Button>
          </div>
          <div class="db">
            <Button
              type="default"
              @click="SaveMsg"
              v-has="'save'"
              :loading="saveLoading"
              class="mr10"
              :disabled="buttonDisable || presentrowMsg !== 0"
            >
              <i class="iconfont mr5 iconbaocunicon"></i>保存
            </Button>
          </div>
          <div class="db">
            <Button
              class="mr10"
              @click="instance"
              v-has="'submit'"
              :loading="commitLoading"
              :disabled="buttonDisable || presentrowMsg !== 0"
            >
              <i class="iconfont mr5 iconziyuan2"></i>提交
            </Button>
          </div>
          <div class="db">
            <Button
              class="mr10"
              :disabled="presentrowMsg !== 1 || datadata.isWms === 1"
              @click="salesReturn"
              v-has="'return'"
              :loading="returnLoading"
            >
              <i class="iconfont mr5 iconziyuan2"></i>退货
            </Button>
          </div>
          <div class="db">
            <Button
              @click="cancellation"
              v-has="'cancellation'"
              class="mr10"
              :loading="cancelLoading"
              :disabled="buttonDisable || presentrowMsg !== 0"
            >
              <Icon type="md-close" size="14"/>
              作废
            </Button>
          </div>
          <div class="db">
            <Button @click="stamp" class="mr10" v-has="'print'">
              <i class="iconfont mr5 icondayinicon"></i> 打印
            </Button>
          </div>
          <div class="db">
            <Button
              class="mr10"
              @click="returnBack"
              :disabled="presentrowMsg!=1"
              v-has="'returnBack'"
            >
              <i class="iconfont mr5 iconziyuan14"></i>返单
            </Button>
          </div>
          <div class="db">
            <div class="mt5">
              <Checkbox v-model="showSelf" @on-change="showOwen">显示个人单据</Checkbox>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <div class="con-split" ref="paneLeft">
          <Split v-model="split1" min="200" max="500" @on-moving="getDomHeight">
            <div slot="left" class="con-split-pane-left" style="overflow-y:auto;">
              <div class="pane-made-hd">采购退货列表</div>
              <Table
                :height="leftTableHeight"
                @on-current-change="selectTabelData"
                size="small"
                highlight-row
                border
                :stripe="true"
                :columns="Left.columns"
                :data="Left.tbdata"
                @on-row-click="selection"
                ref="currentRowTable"
              ></Table>
              <Page
                class-name="fl pt10"
                size="small"
                :current="Left.page.num"
                :total="Left.page.total"
                :page-size="Left.page.size"
                @on-change="changePageLeft"
                @on-page-size-change="changeSizeLeft"
                show-sizer
                show-total
                :page-size-opts="[20, 50, 100, 200]"
              ></Page>
            </div>
            <div slot="right" class="con-split-pane-right pl5 goods-list-form">
              <div class="pane-made-hd">采购退货信息</div>
              <div class="clearfix purchase" ref="planForm">
                <Form
                  inline
                  :model="formPlan"
                  :show-message="false"
                  ref="formPlan"
                  :rules="ruleValidate"
                  :label-width="100"
                >
                  <FormItem label="供应商：" prop="guestName" class="fs12">
                    <Row>
                      <Col span="22">
                        <Tooltip :content="formPlan.guestName" placement="top">
                          <GoodCus
                            style="width: 120px"
                            :title="formPlan.guestName"
                            placeholder="请输入供应商"
                            :search-value="formPlan.guestName"
                            @throwName="throwNameFun"
                            :disabled-prop="buttonDisable"
                          ></GoodCus>
                          <!-- <Input
                            placeholder="请选择供应商"
                            v-model="formPlan.guestName"
                            readonly
                            disabled
                          />-->
                        </Tooltip>
                        <!-- <Select v-model="formPlan.guestName" filterable :disabled="buttonDisable || presentrowMsg !== 0" @on-change="SelectGuest">
                            <Option v-for="item in ArraySelect" :value="item.id" :key="item.id">{{ item.fullName }}</Option>
                        </Select>-->
                      </Col>
                      <Col span="2">
                        <Button
                          class="ml5"
                          size="small"
                          type="default"
                          @click="addSuppler"
                          :disabled="buttonDisable || presentrowMsg !== 0"
                        >
                          <i class="iconfont iconxuanzetichengchengyuanicon"></i>
                        </Button>
                      </Col>
                    </Row>
                  </FormItem>
                  <!--<FormItem label="退货员：" prop="storeId">-->
                  <!--<Select-->
                  <!--class="w160"-->
                  <!--:disabled="presentrowMsg !== 0 || buttonDisable"-->
                  <!--v-model="formPlan.storeId"-->
                  <!--filterable-->
                  <!--label-in-value-->
                  <!--@on-change="selectOrderMan"-->
                  <!--&gt;-->
                  <!--<Option-->
                  <!--v-for="item in userMap"-->
                  <!--:value="item.id"-->
                  <!--:key="item.id"-->
                  <!--&gt;{{ item.label }}-->
                  <!--</Option>-->
                  <!--</Select>-->
                  <!--</FormItem>-->
                  <FormItem label="退货日期：" prop="orderDate" class="fs12">
                    <DatePicker
                      style="width: 160px"
                      type="date"
                      placeholder="请选择调拨申请日期"
                      v-model="formPlan.orderDate"
                      :disabled="presentrowMsg !== 0 || buttonDisable"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="采退单号：" prop="numbers" class="fs12">
                    <Tooltip :content="formPlan.numbers">
                      <Input class="w160" :disabled="true" v-model="formPlan.numbers"/>
                    </Tooltip>
                  </FormItem>
                  <FormItem label="退货原因：" prop="cause">
                    <Select
                      class="w120"
                      :disabled="presentrowMsg !== 0 || buttonDisable"
                      v-model="formPlan.cause"
                    >
                      <Option
                        v-for="item in purchaseTypeArr"
                        :value="item.value"
                        :key="item.value"
                      >{{ item.label }}
                      </Option>
                    </Select>
                  </FormItem>
                  <!--<FormItem label="票据类型：" prop="billType">-->
                    <!--<Select-->
                      <!--class="w160"-->
                      <!--:disabled="presentrowMsg !== 0 || buttonDisable"-->
                      <!--v-model="formPlan.billType"-->
                    <!--&gt;-->
                      <!--<Option-->
                        <!--v-for="item in invoiceMap"-->
                        <!--:value="item.value"-->
                        <!--:key="item.value"-->
                      <!--&gt;{{ item.label }}</Option>-->
                    <!--</Select>-->
                  <!--</FormItem>-->
                  <FormItem label="结算方式：" prop="clearing">
                    <Select
                      class="w120"
                      :disabled="presentrowMsg !== 0 || buttonDisable"
                      v-model="formPlan.clearing"
                    >
                      <Option
                        v-for="item in settleMethods"
                        :value="item.value"
                        :key="item.value"
                      >{{ item.label }}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="备注：" prop="remark">
                    <Tooltip :content="formPlan.remark">
                      <Input
                        class="w160 remark-input"
                        maxlength="100"
                        show-word-limit
                        :disabled="presentrowMsg !== 0 || buttonDisable"
                        v-model="formPlan.remark"
                      ></Input>
                    </Tooltip>
                  </FormItem>
                  <FormItem label="退货仓库：" prop="warehouse">
                    <Select
                      class="w160"
                      :disabled="presentrowMsg !== 0 || buttonDisable"
                      v-model="formPlan.warehouse"
                    >
                      <Option
                        v-for="item in inStores"
                        :value="item.value"
                        :key="item.value"
                      >{{ item.label }}
                      </Option>
                    </Select>
                  </FormItem>
                  <!-- <FormItem label="采购订单:" prop="planOrderNum" class="">
                    <Input
                      class="w160"
                      :disabled="buttonDisableTwo"
                      v-model="formPlan.serviceId"
                    ></Input>
                  </FormItem>-->
                </Form>
              </div>
              <div class="flex plan-cz-btn" ref="planBtn">
                <div class="clearfix">
                  <div class="fl mb5">
                    <Button
                      size="small"
                      class="mr10"
                      @click="addPro"
                      v-has="'selectProject'"
                      :disabled="presentrowMsg !== 0"
                    >
                      <Icon type="md-add"/>
                      添加配件
                    </Button>
                  </div>
                  <div class="fl mb5">
                    <Button
                      size="small"
                      class="mr10"
                      :disabled="presentrowMsg !== 0"
                      @click="Delete"
                      v-has="'delete'"
                    >
                      <i class="iconfont mr5 iconlajitongicon"></i>
                      删除配件
                    </Button>
                  </div>
                </div>
              </div>
              <vxe-table
                ref="xTable"
                border
                resizable
                show-footer
                @select-change="selectChange"
                @edit-closed="editClosedEvent"
                @select-all="selectAll"
                :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true}"
                @keydown="keydown"
                size="mini"
                :edit-rules="validRules"
                :height="rightTableHeight"
                :data="Right.tbdata"
                :footer-method="addFooter"
                @edit-actived="editActivedEvent"
                show-overflow
                :edit-config="{ trigger: 'click', mode: 'cell' }"
                @filter-change="filterChange"
              >
                <vxe-table-column
                  type="seq"
                  fixed="left"
                  title="序号"
                  width="50"
                ></vxe-table-column>
                <vxe-table-column type="checkbox" fixed="left" width="50"></vxe-table-column>
                <vxe-table-column
                  field="partCode"
                  fixed="left"
                  title="配件编码"
                  :filters="[]"
                  :filter-method="filterOrderNo"
                ></vxe-table-column>
                <vxe-table-column
                  field="partName"
                  fixed="left"
                  title="配件名称"
                  :filters="[]"
                  :filter-method="filterOrderNo"
                ></vxe-table-column>
                <vxe-table-column
                  fixed="left"
                  field="partInnerId"
                  title="配件内码"
                ></vxe-table-column>
                <vxe-table-column
                  fixed="left"
                  field="partBrand"
                  title="品牌"
                  :filters="[]"
                  :filter-method="filterOrderNo"
                ></vxe-table-column>
                <vxe-table-column field="outUnitId" title="单位"></vxe-table-column>
                <vxe-table-column field="canReQty" title="入库数量"></vxe-table-column>
                <vxe-table-column
                  field="orderQty"
                  title="退货数量"
                  :edit-render="{ name: 'input',autoselect: true, attrs: { disabled: false } }"
                ></vxe-table-column>
                <vxe-table-column
                  field="orderPrice"
                  title="退货单价"
                  :edit-render="{ name: 'input',autoselect: true }"
                ></vxe-table-column>
                <vxe-table-column field="orderAmt" title="退货金额">
                  <template v-slot="{ row }">{{ countAmount(row) | priceFilters }}</template>
                </vxe-table-column>
                <vxe-table-column
                  field="remark"
                  title="备注"
                  :edit-render="{
                    name: 'input',
                    attrs: { disabled: presentrowMsg !== 0 }
                  }"
                ></vxe-table-column>
                <vxe-table-column
                  field="stockOutQty"
                  title="缺货数量"
                  :filters="[]"
                  :filter-method="filterOrderNo"
                >
                  <template v-slot="{ row }">
                    <div v-if="presentrowMsg !== 1">
                      {{
                      row.stockOutQty - (row.canReQty - row.orderQty) >=
                      0
                      ? row.stockOutQty - (row.canReQty - row.orderQty)
                      : 0
                      }}
                    </div>
                    <div v-else>{{ row.stockOutQty || 0 }}</div>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="storeShelf" title="仓位"></vxe-table-column>
                <vxe-table-column field="oemCode" title="OE码"></vxe-table-column>
                <vxe-table-column field="spec" title="规格"></vxe-table-column>
              </vxe-table>
              <!--<div ref="planPage">-->
              <!--<Page size="small" class-name="page-con" :current="Right.page.num" :total="Right.page.total" :page-size="Right.page.size" @on-change="changePage"-->
              <!--@on-page-size-change="changeSize" show-sizer show-total></Page>-->
              <!--</div>-->
              <div class="table-bottom-text flex"><span>创建人：{{datadata?datadata.createUname:""}}</span><span>创建日期：{{datadata?datadata.createTime:""}}</span><span>提交人：{{datadata?datadata.auditor:""}}</span><span>提交日期：{{datadata?datadata.auditDate:""}}</span>
              </div>
            </div>
          </Split>
        </div>
      </div>
    </section>
    <!--更多弹框-->
    <More @sendMsg="getMsg" ref="moremore"></More>
    <!--选择采购计划弹窗-->
    <procurement
      ref="procurementModal"
      :guestId="guestidId"
      :storeId="formPlan.warehouse"
      :billType="formPlan.billType"
      @getPlanOrder="getPlanOrder"
      @dblclickfun="getPlanOrder"
    ></procurement>
    <!--供应商资料-->
    <select-supplier ref="selectSupplier" header-tit="供应商资料" @selectSupplierName="getSupplierName"></select-supplier>
  </div>
</template>
<script>
  import * as tools from "../../../../utils/tools";
  import QuickDate from "../../../../components/getDate/dateget";
  import More from "./compontents/More";
  import SelectSupplier from "../../../goods/goodsList/components/supplier/selectSupplier";
  import "../../../lease/product/lease.less";
  import "../../../goods/goodsList/goodsList.less";
  // import ProcurementModal from '../../../goods/plannedPurchaseOrder/components/ProcurementModal.vue';
  import Procurement from "@/components/Procurement";
  import {hideLoading, showLoading} from "@/utils/loading";


  import {
    optGroup,
    findPageByDynamicQuery,
    saveDraft,
    sellOrderReturn,
    saveCommit,
    returnPchs,
    saveObsolete,
    queryByConditions,
  } from "../../../../api/business/supplierListApi";
  import {getSupplierList, returnBack} from "_api/purchasing/purchasePlan";
  import {getSales} from "@/api/salesManagment/salesOrder";
  import {v4} from "uuid";
  import GoodCus from "_c/allocation/GoodCus.vue";

  export default {
    name: "supplierList",
    components: {
      QuickDate,
      More,
      Procurement,
      SelectSupplier,
      GoodCus,
    },
    data() {
      let changeNumber = ({cellValue, row: {canReQty}}) => {
        // console.log(canReQty, cellValue);
        const reg = /^[1-9]\d{0,}$/;
        if (!reg.test(cellValue)) {
          return Promise.reject(new Error("数量输入不正确"));
        }
        if (canReQty < cellValue) {
          return Promise.reject(new Error("退货数量不能大于可退数量"));
        }
      };

      let money = ({cellValue}) => {
        const reg = /^\d+(\.\d{0,2})?$/i;
        if (!reg.test(cellValue)) {
          return Promise.reject(new Error("最多保留2位小数"));
        }
      };
      return {
        saveLoading: false,
        commitLoading: false,
        cancelLoading: false,
        returnLoading: false,
        showSelf: true,
        defaultStore: "",
        ArraySelect: [], //供应商下拉框
        checkboxArr: [], // checkbox选中
        disSave: false, // 保存按钮是否禁用
        PTrow: {
          //新增当前行
          new: true,
          _highlight: true,
          billStatusId: {name: "草稿", value: 0, enum: "DRAFT"},
          guestId: "", //调出方
          orderMan: this.$store.state.user.userData.id, //退货员
          orderDate: tools.transTime(new Date()), //退货日期
          serviceId: "", //采退单号
          rtnReasonId: "", //退货原因
          settleTypeId: "", //结算方式
          //billTypeId :"",//票据类型
          remark: "", //备注
          storeId: "", //退货仓库
          code: "", //采购订单
          details: "", //子表格
        },
        //表单验证
        ruleValidate: {
          guestName: [
            {
              required: true,
              type: "string",
              message: "供应商不能为空",
              trigger: "change",
            },
          ],
          // storeId: [
          //   {
          //     required: true,
          //     type: "string",
          //     message: "请选择退货员",
          //     trigger: "change",
          //   },
          // ],
          // orderDate: [{ required: true, type: 'date', message: '请选择', trigger: 'change' }],
          cause: [
            {
              required: true,
              type: "string",
              message: "请选择退货原因",
              trigger: "change",
            },
          ],
          // billType: [
          //   {
          //     required: true,
          //     message: "票据类型不能为空",
          //     trigger: "change"
          //   },
          // ],
          clearing: [
            {
              required: true,
              type: "string",
              message: "请选择结算方式",
              trigger: "change",
            },
          ],
          warehouse: [
            {
              required: true,
              type: "string",
              message: "请选择退货仓库",
              trigger: "change",
            },
          ],
        },
        datadata: null,
        rowId: "", //当前行的id
        buttonDisable: true,
        buttonDisableTwo: true,
        split1: 0.2,
        purchaseType: "99",
        statusArr: [], //状态
        settleMethods: [], //结算方式
        //票据类型
        invoiceMap: [],
        inStores: [], //退货仓
        purchaseTypeArr: [], //退货原因
        userMap: [], //退货员
        //校验输入框的值
        validRules: {
          orderQty: [{required: true, validator: changeNumber}],
          orderPrice: [{required: true, validator: money}],
          // remark: [
          //   { required: true, validator:changeNumber }
          // ]
        },
        List: [],
        Left: {
          page: {
            num: 1,
            size: 20,
            total: 0,
          },
          loading: false,
          columns: [
            {
              title: "序号",
              width: 50,
              type: "index",
              resizable:true
            },
            {
              title: "状态",
              key: "billStatusId",
              width: 70,
              render: (h, params) => {
                let name = params.row.billStatusId.name;
                return h("span", name);
              },
              resizable:true,
            },
            {
              title: "供应商",
              key: "guestName",
              width: 170,
              resizable:true
            },
            {
              title: "创建日期",
              key: "createTime",
              width: 120,
              resizable:true
            },
            {
              title: "创建人",
              key: "createUname",
              width: 100,
              resizable:true
            },
            {
              title: "采退单号",
              key: "serviceId",
              width: 120,
              resizable:true
            },
            {
              title: "打印次数",
              key: "printTimes",
              width: 70,
              resizable:true
            },
            {
              title: "提交人",
              key: "auditor",
              width: 100,
              resizable:true
            },
            {
              title: "提交日期",
              align: "center",
              key: "auditDate",
              width: 170,
              resizable:true
            },
          ],
          tbdata: [],
        },
        tableData: [],
        //左侧表格高度
        leftTableHeight: 0,
        //右侧表格高度
        rightTableHeight: 0,
        Right: {
          page: {
            num: 1,
            size: 10,
            total: 0,
          },
          loading: false,
          tbdata: [],
        },
        advanced: false, //更多模块的弹框
        GainInformation: false, //编辑收获信息
        rowData: "", //声明一个数据，用于赋值右边内容
        selectArr: [], //快速查询的数组 用于赋值,
        moreArr: {},
        presentrowMsg: 0,
        guestidId: "", //给后台传值保存调出方的id
        isAdd: true, //判断是否能新增
        formPlan: {
          cause: "", //退货原因
          clearing: "020502", //结算方式
          //billType:'',//票据类型
          guestName: "", //供应商
          storeId: this.$store.state.user.userData.id, //退货员id
          storeName: "", //退货员名称
          orderDate: tools.transTime(new Date()), //退货日期
          remark: "", //备注
          warehouse: "", //退货仓库
          serviceId: "", //采购单号
          numbers: "", //采退单号
        },
        mainId: null, //选中行的id
        clickdelivery: false,
        Flaga: false, //判断是否出现退出弹框
        Acode: "", //保存,提交时需给后台传的code
        AcodeId: "", //保存,提交时需给后台传的codeId
        successNOid: "", //没有id
        successHaveId: "", //有id,
        selectLeftItemId: "", //左侧点击的id
        leftCurrentItem: null, //记录左侧点击的数据
        filterCheckObj: {}, //筛选条件
      };
    },
    methods: {
      //------------------------------------------------------------------------//
      //表格tab切换可编辑部位
      async editNextCell($table) {
        // @ts-ignore
        const {row, column, $rowIndex, $columnIndex, columnIndex, rowIndex} =
        (await $table.getActiveRecord()) || {};
        if (row) {
          // 当前为编辑状态
          // console.log('row', row)
          // 当前列属性
          const nowField = column.property;
          // 获取展示的列
          const {visibleColumn} = $table.getTableColumn();
          // 当前列属性（可以编辑的属性）
          const columnsField = visibleColumn.reduce((a, v, i) => {
            if (i !== 0 && i !== visibleColumn.length - 1 && v.editRender) {
              // 不是操作和序号且不可以编辑
              a.push(v.property);
            }
            return a;
          }, []);
          const nowIndex = columnsField.findIndex((v) => v === nowField);
          // 判断当前是否是可编辑倒数地二行
          const isLastColumn = nowIndex === columnsField.length - 2;
          // console.log('isLastColumn', isLastColumn)
          if (isLastColumn) {
            // 插入数据

            // 跳转到下一行
            // 判断当前是否为临时数据
            const isInsertByRow = $table.isInsertByRow(row);
            const ROW_INDEX = isInsertByRow
              ? await $table.$getRowIndex(row)
              : rowIndex;
            const insertRecords = $table.getInsertRecords(); // 临时数据
            let nextRow = {};
            // 不是最后一条临时数据
            if (isInsertByRow && insertRecords.length - 1 !== ROW_INDEX) {
              nextRow = $table.getInsertRecords()[ROW_INDEX + 1];
            } else {
              // 当前是最后一条临时数据
              if (isInsertByRow) {
                nextRow = $table.getData()[0];
              } else {
                nextRow = $table.getData()[ROW_INDEX + 1];
              }
            }
            if (nextRow) {
              await $table.scrollTo(0);
              await $table.setActiveCell(nextRow, columnsField[0]);
            }
          } else {
            // 跳转下一个编辑
            await $table.setActiveCell(row, columnsField[nowIndex + 1]);
          }
        }
      },

      keydown($event) {
        if ($event.$event.keyCode == 9) {
          this.editNextCell($event.$table);
        }
      },
      //计算表格数据
      countAmount(row) {
        row.orderAmt =
          this.$utils.toNumber(row.orderQty) *
          this.$utils.toNumber(row.orderPrice);
        return row.orderAmt;
      },
      //判断从表input能不能编辑
      editActivedEvent({row}) {
        let xTable = this.$refs.xTable;
        let orderQtyColumn = xTable.getColumnByField("orderQty");
        let remarkColumn = xTable.getColumnByField("remark");
        let isDisabled = this.presentrowMsg !== 0;
        orderQtyColumn.editRender.attrs.disabled = isDisabled;
        remarkColumn.editRender.attrs.disabled = isDisabled;
      },
      //删除配件
      async Delete() {
        if (this.checkboxArr.length > 0) {
          let data = [];
          let arr = [];
          let ids = [];
          this.checkboxArr.forEach((item) => {
            if (item.id) {
              data.push(item.id);
              ids.push(item.uuid);
            } else {
              arr.push({oid: item.uuid});
              ids.push(item.uuid);
            }
          });

          let res = {code: 0};

          if (arr.length > 0) {
            res = {code: 0};
          }

          if (data.length > 0) {
            res = await sellOrderReturn(data);
          }

          if (res.code == 0) {
            this.$Message.success("删除配件成功");

            this.Right.tbdata = this.Right.tbdata.filter((el) => {
              return !ids.includes(el.uuid);
            });
            this.setFilterArr(this.Right.tbdata || [])
            this.Left.tbdata.forEach((el) => {
              if (el._highlight == true) {
                el.details = this.Right.tbdata;
              }
            });

            this.$refs.xTable.clearCheckboxRow();

            this.checkboxArr.length = 0;
          }
        } else {
          this.$Message.warning("请选择要删除的配件！");
        }
      },
      //更多按钮
      moreaa() {
        this.$refs.moremore.init();
      },
      // 计算尾部总和
      countAllAmount(data) {
        let count = 0;
        data.forEach((row) => {
          count += this.countAmount(row);
        });
        count = count.toFixed(2);
        this.totalMoney = count;
        return count;
      },
      // 新增按钮
      addProoo() {
        this.$refs.formPlan.resetFields();
        this.buttonDisable = false;
        this.presentrowMsg = 0;
        if (!this.isAdd) {
          return this.$Message.error("请先保存数据");
        }
        //置空左侧选中数据
        this.selectLeftItemId = "";
        this.leftCurrentItem = null;
        for (let item of this.Left.tbdata) {
          item._highlight = false;
        }
        (this.formPlan.cause = ""), //退货原因
          (this.formPlan.clearing = "020502"), //结算方式
          (this.formPlan.guestName = ""), //供应商
          (this.formPlan.storeId = this.$store.state.user.userData.id), //退货员
          (this.formPlan.orderDate = tools.transTime(new Date())), //退货日期
          (this.formPlan.remark = ""), //备注
          (this.formPlan.warehouse = this.defaultStore), //退货仓库
          (this.formPlan.serviceId = ""), //采购单号
          (this.formPlan.numbers = ""), //采退单号
          (this.Right.tbdata = []);
        this.setFilterArr(this.Right.tbdata || [])
        this.isAdd = false;
        this.Left.tbdata.unshift(this.PTrow);
        this.datadata = this.PTrow;
        this.rowId = "";
        if (this.selectLeftItemId) {
          for (let item of this.Left.tbdata) {
            item._highlight = false;
            if (item.id == this.selectLeftItemId) {
              item._highlight = true;
              // this.setRightData(item);
              break;
            }
          }
        } else {
          this.Left.tbdata[0]._highlight = true;
          // this.setRightData(this.Left.tbdata[0]);
          return;
        }
        // console.log(this.Left.tbdata)
      },
      //删除配件的全选
      selectAll(aaa) {
        this.checkboxArr = aaa.selection;
        // console.log(this.checkboxArr)
      },
      //添加配件按钮
      addPro() {
        if (!this.guestidId || !this.formPlan.warehouse)
          return this.$Message.error("请先选择供应商和退货仓库");
        this.showModel("procurementModal");
      },
      //显示子组件封装的方法
      showModel(name) {
        let ref = this.$refs[name];
        ref.init();
      },
      // 下拉框查询
      SelectChange() {
        this.leftgetList();
      },
      //获取销售员
      selectOrderMan(val) {
        // console.log(val)
        this.formPlan.storeId = val.value;
        // this.formPlan.orderManId = val.value
      },
      //供应商下拉查询
      selecQuery() {
        let req = {};
        getSupplierList(req).then((res) => {
          if (res.code === 0) {
            this.ArraySelect = res.data || [];
            // console.log(this.ArraySelect)
          }
        });
      },
      //供应商下拉框发生改变
      SelectGuest(val) {
        this.guestidId = val;
        let SameId = this.ArraySelect.filter((item) => item.id === val);
        // console.log(SameId[0].settTypeId)
        if (SameId && SameId.length > 0) {
          this.formPlan.clearing = SameId[0].settTypeId;
        }
      },
      //选择采购入库单
      getPlanOrder(Msg) {
        let arr = JSON.parse(JSON.stringify(Msg || []));

        if (arr.length <= 0) return;
        // sourceDetailId
        let flag = false;
        for (let i = 0; i < this.Right.tbdata.length; i++) {
          let el = this.Right.tbdata[i];
          for (let j = 0; j < arr.length; j++) {
            let em = arr[j];
            // console.log(em.sourceDetailId, el.sourceDetailId)
            if (el.sourceDetailId == em.sourceDetailId) {
              arr.splice(j, 1);
              flag = true;
            }
          }
        }

        if (flag) {
          this.$message.error("同一批次配件不重复添加");
        }

        arr.map((item) => {
          item.outUnitId = item.enterUnitId;
          item.unit = item.enterUnitId;
          item.systemUnitId = item.enterUnitId;
          item.canReQty = item.enterQty;
          item.orginOrderQty = item.orderQty;
          item.orderQty = item.rtnableQty;
          item.orderPrice = item.enterPrice;
          item.partInnerId = item.partId;
          item.uuid = v4();
        });

        this.Right.tbdata = this.Right.tbdata.concat(arr);
        this.setFilterArr(this.Right.tbdata || [])

        if (!flag) {
          this.$message.success("已添加");
        }
      },
      selectTabelData() {
      },
      //获取orderMan 值 走流程到 报表那一块
      getOrderMan(orderManId) {
        this.userMap.map((item) => {
          if (item.id == orderManId) {
            this.formPlan.orderMan = item.label;
            return;
          }
        });
      },
      //保存按钮
      SaveMsg() {
        this.getOrderMan(this.formPlan.storeId);
        this.$refs.formPlan.validate(async (valid) => {
          if (valid) {
            try {
              await this.$refs.xTable.validate();
              let data = {};
              data.code = this.Acode || this.formPlan.serviceId;
              data.codeId = this.AcodeId;
              data.id = this.rowId;
              data.guestId = this.guestidId; //调出方
              data.guestName = this.formPlan.guestName; //调出方
              data.orderManId = this.formPlan.storeId; //退货员id
              data.orderMan = this.formPlan.orderMan; //退货员
              data.orderDate = tools.transTime(this.formPlan.orderDate); //退货日期
              data.serviceId = this.formPlan.numbers; //采退单号
              data.rtnReasonId = this.formPlan.cause; //退货原因
              data.settleTypeId = this.formPlan.clearing; //结算方式
              //data.billTypeId = this.formPlan.billType;//票据类型
              data.remark = this.formPlan.remark; //备注
              data.storeId = this.formPlan.warehouse; //退货仓库
              // data.code = this.formPlan.serviceId //采购订单
              data.details = this.Right.tbdata;
              let noBack = data.details.filter((item) => {
                // return (
                //   item.stockOutQty - (item.canReQty - item.orderQty) > 0
                // );
                return item.canReQty - item.stockOutQty < item.orderQty
              });
              if (noBack.length > 0) {
                this.$message.error("明细中存在缺货数量，请调整");
                return;
              }
              if (data.details.length > 0) {
                data.details.map((item) => {
                  item.stockOutQty = 0;
                });
              }
              this.saveLoading = true;
              saveDraft(data).then((res) => {
                if (res.code === 0) {
                  this.$message.success("保存成功！");
                  this.$refs.formPlan.resetFields();
                  this.leftgetList();
                  this.isAdd = true;
                  this.saveLoading = false;
                  this.rowId = "";
                  this.formPlan.guestName = ""; //调出方
                  this.formPlan.storeId = ""; //退货员
                  // tools.transTime(this.formPlan.orderDate)  //退货日期
                  this.formPlan.numbers = ""; //采退单号
                  this.formPlan.cause = ""; //退货原因
                  this.formPlan.clearing = ""; //结算方式
                  //this.formPlan.billType = "";//票据类型
                  this.formPlan.remark = ""; //备注
                  this.formPlan.warehouse = ""; //退货仓库
                  this.formPlan.serviceId = ""; //采购订单
                  this.Right.tbdata = []; //子表格
                  if (this.selectLeftItemId) {
                    for (let item of this.Left.tbdata) {
                      item._highlight = false;
                      if (item.id == this.selectLeftItemId) {
                        item._highlight = true;
                        this.setRightData(item);
                        break;
                      }
                    }
                  } else {
                    this.Left.tbdata[0]._highlight = true;
                    this.setRightData(this.Left.tbdata[0]);
                    return;
                  }
                  this.$refs.formPlan.resetFields();
                }
                this.saveLoading = false;
              }).catch(e => {
                this.saveLoading = false;
              });
            } catch (errMap) {
              // this.$XModal.message({
              //   status: "error",
              //   message: "申请数量必须输入大于0的正整数！"
              // });
            }
          } else {
            // console.log(this.isAdd)
            this.$Message.error("*为必填！");
          }
        });
      },
      //作废
      cancellation() {
        this.$Modal.confirm({
          title: "是否作废",
          onOk: async () => {
            let params = {};
            params.id = this.rowId;
            try {
              this.cancelLoading = true;
              let res = await saveObsolete({params: params});
              if (res.code == 0) {
                this.$Message.success("作废成功");
                this.leftgetList();
                this.isAdd = true;
              }
              this.cancelLoading = false;
            } catch (error) {
              this.cancelLoading = false;
            }
          },
          onCancel: () => {
            this.$Message.info("取消作废");
          },
        });
      },
      //创建a标签
      openwin(url) {
        var a = document.createElement("a"); //创建a对象
        a.setAttribute("href", url);
        a.setAttribute("target", "_blank");
        a.setAttribute("id", "camnpr");
        document.body.appendChild(a);
        a.click(); //执行当前对象
        document.body.removeChild(a)
      },
      // 打印
      stamp() {
        let order = {};
        order.name = "采购退货单";
        order.route = this.$route.name;
        order.id = this.mainId;
        let routeUrl = this.$router.resolve({name: "print", query: order});
        // window.open(routeUrl.href, "_blank");
        this.openwin(routeUrl.href)
        this.leftgetList();
      },
      //返单
      returnBack() {
        this.$Modal.confirm({
          title: "是否返单",
          onOk: async () => {
            let params = {};
            params.id = this.mainId;
            try {
              this.cancelLoading = true;
              let res = await returnBack(params);
              if (res.code == 0) {
                this.$Message.success("返单成功");
                this.leftgetList();
              }
              this.cancelLoading = false;
            } catch (error) {
              this.cancelLoading = false;
            }
          },
          onCancel: () => {
            this.$Message.info("取消返单");
          },
        });
      },
      //右侧表格复选框选中
      selectChange(msg) {
        // console.log(msg.selection)
        this.checkboxArr = msg.selection;
        // console.log(this.checkboxArr)
      },
      //分页
      changePageLeft(p) {
        this.Left.page.num = p;
        this.leftgetList();
      },
      changeSizeLeft(size) {
        this.Left.page.num = 1;
        this.Left.page.size = size;
        this.leftgetList();
      },
      //右部分分页
      changePage(p) {
        this.Left.page.num = p;
        // this.getList()
      },
      changeSize(size) {
        this.Left.page.num = 1;
        this.Left.page.size = size;
        // this.getList()
      },
      // 查询下拉框
      getDataQuick(v) {
        // console.log(v)
        this.selectArr = v;
        this.leftgetList();
      },
      //footer计算
      addFooter({columns, data}) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return "和值";
            }
            if (columnIndex === 2) {
              return `共${(data||[]).length}条`
            }
            if (
              ["canReQty", "orderQty", "orderPrice"].includes(column.property)
            ) {
              return this.$utils.sum(data, column.property, columnIndex);
            }
            if (column.property === "orderAmt") {
              return ` ${this.countAllAmount(data)} `;
            }
            return null;
          }),
        ];
      },
      //表格编辑状态下被关闭的事件
      editClosedEvent() {
      },
      //获取销售员
      async getAllSales() {
        let res = await getSales();
        if (res.code === 0) {
          this.userMap = res.data.content;
          this.userMap.map((item) => {
            item.label = item.userName;
          });
        }
      },
      // 更多子组件的参数
      getMsg(msg) {
        this.moreArr = msg;
        // console.log(this.moreArr)
        this.LeftgetlistTwo();
        // console.log(msg)
      },
      //供应商弹框
      addSuppler() {
        this.$refs.selectSupplier.init();
      },
      throwNameFun(v) {
        this.getSupplierName(v);
      },
      // 供应商子组件内容
      getSupplierName(a) {
        // console.log(a)
        this.formPlan.guestName = a.fullName;
        this.guestidId = a.id;
        //赋值票据类型id
        //this.formPlan.billType = a.billTypeId || "";
        this.Right.tbdata = []
      },
      leftgetList() {
        let data = {};
        let params = {};
        data.showSelf = this.showSelf;
        params.page = this.Left.page.num - 1;
        params.size = this.Left.page.size;
        //快速选择
        if (this.selectArr !== "9999") {
          data.startTime = this.selectArr[0];
          data.endTime = this.selectArr[1];
        }
        //状态
        if (this.purchaseType !== "99") {
          data.billStatusId = this.purchaseType;
        }

        // console.log(data);

        findPageByDynamicQuery({params: params, data: data}).then((res) => {
          if (res.code === 0) {
            this.Left.tbdata = res.data.content || [];
            this.Left.page.total = res.data.totalElements;

            for (let item of this.Left.tbdata) {
              item._highlight = false;
              item.details.forEach((el) => {
                el.orginOrderQty = el.orderQty;
                el.uuid = v4();
              });
              if (this.selectLeftItemId) {
                for (let item of this.Left.tbdata) {
                  item._highlight = false;
                  if (item.id == this.selectLeftItemId) {
                    item._highlight = true;
                    this.setRightData(item);
                    break;
                  }
                }
              } else {
                this.Left.tbdata[0]._highlight = true;
                this.setRightData(this.Left.tbdata[0]);
                return;
              }
            }
          }
        });
      },
      // 更多查询单独接口
      LeftgetlistTwo() {
        let data = {};
        let params = {};
        data.showSelf = this.showSelf;
        params.page = this.Left.page.num - 1;
        params.size = this.Left.page.size;
        //创建日期
        if (this.moreArr.createData != null && this.moreArr.createData[0] != "") {
          // console.log(this.moreArr.createData);
          data.startTime = this.moreArr.createData[0] + " 00:00:00";
          data.endTime = this.moreArr.createData[1] + " 23:59:59";
        }
        //提交日期
        if (this.moreArr.submitData != null && this.moreArr.submitData[0] != "") {
          data.auditStartTime = this.moreArr.submitData[0] + " 00:00:00";
          data.auditEndTime = this.moreArr.submitData[1] + " 23:59:59";
        }
        //供应商
        if (this.moreArr.callout != null) {
          data.guestId = this.moreArr.guestId;
        }
        //采退单号
        if (this.moreArr.numbers != null) {
          data.serviceId = this.moreArr.numbers;
        }
        //配件编码
        if (this.moreArr.coding != null) {
          data.partCode = this.moreArr.coding;
        }
        //配件名称
        if (this.moreArr.Name != null) {
          data.partName = this.moreArr.Name;
        }
        //采购订单
        if (this.moreArr.purchase != null) {
          data.code = this.moreArr.purchase;
        }
        //退货员
        if (this.moreArr.Return != null) {
          data.orderMan = this.moreArr.Return;
        }
        //创建人
        if (this.moreArr.Accessories != null) {
          data.createUname = this.moreArr.Accessories;
        }
        //提交人
        if (this.moreArr.submitter != null) {
          data.auditor = this.moreArr.submitter;
        }
        //是否显示单据
        // if (this.moreArr.Ischeck) {
        //   data.showSelf = true;
        // } else {
        //   data.showSelf = false;
        // }
        queryByConditions({params: params, data: data}).then((res) => {
          if (res.code === 0) {
            this.Left.tbdata = res.data.content || [];
            this.Left.page.total = res.data.totalElements;
            this.selection(this.Left.tbdata[0])
          }
        });
      },
      // 左边部分的当前行
      selection(row) {
        if (row == null || !row.id) return;
        this.selectLeftItemId = row.id;
        this.leftCurrentItem = row;
        let currentRowTable = this.$refs["currentRowTable"];
        if (!this.Flaga && !this.isAdd && row.id) {
          this.$Modal.confirm({
            title: "您正在编辑单据，是否需要保存",
            onOk: () => {
              currentRowTable.clearCurrentRow();
              this.$refs.formPlan.validate((valid) => {
                if (valid) {
                  let data = {};
                  data.id = this.rowId;
                  // data.guestId = this.guestidId   //调出方
                  data.guestId = this.guestidId; //调出方
                  data.orderManId = this.formPlan.storeId; //退货员id
                  data.orderMan = this.formPlan.orderMan; //退货员
                  data.orderDate = tools.transTime(this.formPlan.orderDate); //退货日期
                  data.serviceId = this.formPlan.numbers; //采退单号
                  data.rtnReasonId = this.formPlan.cause; //退货原因
                  data.settleTypeId = this.formPlan.clearing; //结算方式
                  //data.billTypeId = this.formPlan.billType;//票据类型
                  data.remark = this.formPlan.remark; //备注
                  data.storeId = this.formPlan.warehouse; //退货仓库
                  data.code = this.formPlan.serviceId; //采购订单
                  data.details = this.Right.tbdata;

                  let noBack = data.details.filter(
                    (item) => item.canReQty - item.stockOutQty < item.orderQty
                  );
                  if (noBack.length > 0) {
                    this.$message.error("明细中存在缺货数量，请调整");
                    return;
                  }
                  data.details.map((item) => {
                    item.stockOutQty = 0;
                  });
                  saveDraft(data).then((res) => {
                    if (res.code === 0) {
                      this.$message.success("保存成功！");
                      this.$refs.formPlan.resetFields();
                      this.leftgetList();
                      this.isAdd = true;
                      this.rowId = "";
                      this.formPlan.guestName = ""; //调出方
                      this.formPlan.storeId = ""; //退货员
                      // tools.transTime(this.formPlan.orderDate)  //退货日期
                      this.formPlan.numbers = ""; //采退单号
                      this.formPlan.cause = ""; //退货原因
                      this.formPlan.clearing = ""; //结算方式
                      //this.formPlan.billType = '';//票据类型
                      this.formPlan.remark = ""; //备注
                      this.formPlan.warehouse = ""; //退货仓库
                      this.formPlan.serviceId = ""; //采购订单
                      this.Right.tbdata = []; //子表格
                      this.$refs.formPlan.resetFields();
                    }
                  });
                } else {
                  this.$Message.error("*为必填！");
                }
              });
            },
            onCancel: () => {
              this.Left.tbdata.splice(0, 1);
              currentRowTable.clearCurrentRow();
              this.isAdd = true;
              this.rowId = "";
              this.formPlan.guestName = ""; //调出方
              this.formPlan.storeId = ""; //退货员
              // tools.transTime(this.formPlan.orderDate)  //退货日期
              this.formPlan.numbers = ""; //采退单号
              this.formPlan.cause = ""; //退货原因
              this.formPlan.clearing = ""; //结算方式
              //this.formPlan.billType = "";//票据类型
              this.formPlan.remark = ""; //备注
              this.formPlan.warehouse = ""; //退货仓库
              this.formPlan.serviceId = ""; //采购订单
              this.Right.tbdata = []; //子表格
              if (this.selectLeftItemId) {
                for (let item of this.Left.tbdata) {
                  item._highlight = false;
                  if (item.id == this.selectLeftItemId) {
                    item._highlight = true;
                    this.setRightData(item);
                    break;
                  }
                }
              } else {
                this.Left.tbdata[0]._highlight = true;
                this.setRightData(this.Left.tbdata[0]);
              }
            },
          });
        } else {
          if (row.id) {
            // this.leftgetList();
            this.setRightData(row);
          } else {
            this.formPlan.guestName = "";
            this.formPlan.storeId = "";
            this.formPlan.orderDate = "";
            this.formPlan.numbers = "";
            this.formPlan.cause = "";
            this.formPlan.clearing = "";
            //this.formPlan.billType = "";//票据类型
            this.formPlan.remark = "";
            this.formPlan.warehouse = "";
            this.formPlan.serviceId = "";
            this.Right.tbdata = [];
            this.$refs.formPlan.resetFields();
          }
        }
      },

      //右侧填充数据
      setRightData(row) {
        // this.selectLeftItemId = "";
        this.mainId = row.id;
        this.guestidId = row.guestId;
        this.datadata = row;
        this.formPlan.guestId = this.datadata.guestId;
        this.formPlan.guestName = this.datadata.guestName;
        this.formPlan.storeId = this.datadata.orderManId;
        this.formPlan.orderDate = this.datadata.orderDate;
        this.formPlan.numbers = this.datadata.serviceId;
        this.formPlan.cause = this.datadata.rtnReasonId;
        this.formPlan.clearing = this.datadata.settleTypeId;
        //this.formPlan.billType = this.datadata.billTypeId;//票据类型
        this.formPlan.remark = this.datadata.remark;
        this.formPlan.warehouse = this.datadata.storeId;
        this.formPlan.serviceId = this.datadata.code;
        if (row.details.length > 0) {
          row.details.map((item) => {
            item.orderPrice = Number(item.orderPrice).toFixed(2);
          });
        }
        if (this.datadata.details.length > 0) {
          this.Right.tbdata = this.datadata.details.map((el) => {
            el.orginOrderQty = el.orderQty;
            return el;
          });
          this.setFilterArr(this.Right.tbdata || [])
        }else{
          this.Right.tbdata=[];
        }
        this.presentrowMsg = row.billStatusId.value;
        // console.log(this.presentrowMsg)
        this.rowId = row.id;
        this.buttonDisable = false;
      },

      // 仓库下拉框
      warehouse() {
      },
      Determined() {
      },
      // 提交按钮
      instance() {
        this.getOrderMan(this.formPlan.storeId);
        if (this.Right.tbdata.length > 0) {
          this.$Modal.confirm({
            title: "是否提交",
            onOk: async () => {
              let data = {};
              data.code = this.Acode || this.formPlan.serviceId;
              data.codeId = this.AcodeId;
              data.id = this.rowId;
              data.guestId = this.guestidId; //调出方
              data.orderManId = this.formPlan.storeId; //退货员id
              data.orderMan = this.formPlan.orderMan; //退货员
              data.orderDate = tools.transTime(this.formPlan.orderDate); //退货日期
              data.serviceId = this.formPlan.numbers; //采退单号
              data.rtnReasonId = this.formPlan.cause; //退货原因
              data.settleTypeId = this.formPlan.clearing; //结算方式
              //data.billTypeId = this.formPlan.billType;//票据类型
              data.remark = this.formPlan.remark; //备注
              data.storeId = this.formPlan.warehouse; //退货仓库
              // data.code = this.formPlan.serviceId //采购订单
              data.details = this.Right.tbdata;

              let noBack = data.details.filter(
                (item) => item.canReQty - item.stockOutQty < item.orderQty
              );
              if (noBack.length > 0) {
                this.$message.error("明细中存在缺货数量，请调整");
                return;
              }
              data.details.map((item) => {
                item.stockOutQty = 0;
              });
              try {
                this.commitLoading = true;
                showLoading(".loadingClass", "数据加载中，请勿操作")
                let res = await saveCommit(data);
                if (res.code == 0) {
                  this.$Message.success("提交成功");
                  this.leftgetList();
                  this.isAdd = true;
                }
                hideLoading()
                this.commitLoading = false;
              } catch (error) {
                hideLoading()
                this.commitLoading = false;
              }
            },
            onCancel: () => {
              this.$Message.info("取消提交");
            },
          });
        } else {
          this.$Message.warning("请添加配件后再提交!");
        }
      },
      // 退货
      salesReturn() {
        this.getOrderMan(this.formPlan.storeId);
        this.$Modal.confirm({
          title: "是否退货",
          onOk: async () => {
            let data = {};
            data.id = this.rowId;
            data.guestId = this.guestidId; //调出方
            data.orderDate = tools.transTime(this.formPlan.orderDate); //退货日期
            data.orderMan = this.formPlan.orderMan; //退货员
            data.serviceId = this.formPlan.numbers; //采退单号
            data.rtnReasonId = this.formPlan.cause; //退货原因
            data.settleTypeId = this.formPlan.clearing; //结算方式
            //data.billTypeId = this.formPlan.billType;//票据类型
            data.remark = this.formPlan.remark; //备注
            data.storeId = this.formPlan.warehouse; //退货仓库
            data.code = this.formPlan.serviceId; //采购订单
            data.details = this.Right.tbdata;
            try {
              this.returnLoading = true;
              let res = await returnPchs(data);
              if (res.code == 0) {
                this.$Message.success("退货成功");
                this.leftgetList();
                this.isAdd = true;
              } else {
                this.leftgetList();
                this.isAdd = true;
              }
              this.returnLoading = false;
            } catch (error) {
              this.returnLoading = false;
            }
          },
          onCancel: () => {
            this.$Message.info("取消退货");
          },
        });
      },
      //所有下拉框
      allSelect() {
        let data = {};
        optGroup(data).then((res) => {
          if (res.code === 0) {
            const {
              billStatusMap,
              companyMap,
              guestMap,
              invoiceMap,
              levelMap,
              rtnReasonMap,
              sellOrderStatusMap,
              settlementMap,
              storeMap,
              userMap,
              defaultStore,
            } = res.data;
            // 结算方式
            for (let el in settlementMap) {
              this.settleMethods.push({value: settlementMap[el], label: el});
            }
            // 退货仓
            for (let el in storeMap) {
              this.inStores.push({value: storeMap[el], label: el});
            }
            this.defaultStore = defaultStore;
            // 状态
            for (let el in sellOrderStatusMap) {
              if (["草稿", "已提交", "已作废", "已退货", "所有"].includes(el)) {
                this.statusArr.push({value: sellOrderStatusMap[el], label: el});
              }
            }
            //退货原因
            for (let el in rtnReasonMap) {
              this.purchaseTypeArr.push({value: rtnReasonMap[el], label: el});
            }
            this.purchaseTypeArr = this.purchaseTypeArr.sort((a,b) =>a.value-b.value)
            // userMap 用户
            for (let el in userMap) {
              this.userMap.push({value: userMap[el], label: el});
            }
            //票据类型
            if (invoiceMap) {
              for (let v in invoiceMap) {
                let objData = {
                  label: v,
                  value: invoiceMap[v]
                };
                this.invoiceMap.push(objData);
              }
            }
          }
        });
      },
      getDomHeight() {
        this.$nextTick(() => {
          let wrapH = this.$refs.paneLeft.offsetHeight;
          let planFormH = this.$refs.planForm.offsetHeight;
          let planBtnH = this.$refs.planBtn.offsetHeight;
          // let planPageH = this.$refs.planPage.offsetHeight;
          //获取左侧侧表格高度
          this.leftTableHeight = wrapH - 100;
          //获取右侧表格高度
          this.rightTableHeight = wrapH - planFormH - planBtnH - 68;
        });
      },
      showOwen() {
        tools.setSession("self", {supplierList: this.showSelf});
        this.leftgetList();
      },
      returnData(rData,cos){
        let arrData = [];
        let arr = rData.map(el => el[cos])
        let set = new Set(arr);
        set.forEach(el => {
          let filterData = this.filterCheckObj[cos]||[]
          if(filterData.includes(el)){
            arrData.push({ label: el, value: el ,checked:true});
          }else{
            arrData.push({ label: el, value: el });
          }

        });
        this.$nextTick(()=>{
          const xtable = this.$refs.xTable;
          const column = xtable.getColumnByField(cos);
          xtable.setFilter(column, arrData);
          xtable.updateData();
        });
      },

      setFilterArr(rData){
        this.returnData(rData,'partCode');
        this.returnData(rData,'partName');
        this.returnData(rData,'partBrand');
        this.returnData(rData,'stockOutQty');
      },

      filterOrderNo({ value, row, column }){
        let {property} = column;
        if(!value){
          return !row[property]
        }
        if(row[property]){
          return row[property] == value;
        }else{
          return false
        }
      },
      filterChange({property, values}){
        this.filterCheckObj[property] = values;
      }
    },
    mounted() {
      let self = tools.getSession("self");
      this.showSelf = Reflect.has(self, "supplierList")
        ? self.supplierList
        : true;
      setTimeout(() => {
        this.getDomHeight();
      }, 0);
      this.allSelect();
      this.leftgetList();
      // this.selecQuery();
      this.getAllSales();
    },
  };
</script>
<style lang="less">
  .remark-input {
    .ivu-input {
      padding-right: 45px !important;
    }

    .ivu-input-word-count {
      right: 4px;
      background: none;
    }
  }
</style>
