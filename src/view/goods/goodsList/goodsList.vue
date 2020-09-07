<template>
  <!-- 采购计划页面 -->
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <!-- 对采购计划订单以及采购计划信息的操作 -->
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>
            <Select @on-change="search" v-model="purchaseType" class="w90 mr10">
              <Option
                v-for="item in purchaseTypeArr"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db">
            <Button type="default" @click="showModel('moreSearch')" class="mr10">
              <i class="iconfont mr5 iconchaxunicon"></i>更多
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
              :disabled="![0, 4].includes(selectPlanOrderItem.billStatusId)"
              @click="submit(1)"
              :loading="saveLoading"
              v-has="'save'"
              class="mr10"
            >
              <i class="iconfont mr5 iconbaocunicon"></i>保存
            </Button>
          </div>
          <div class="db">
            <Button
              class="mr10"
              :disabled="![0, 4].includes(selectPlanOrderItem.billStatusId)"
              @click="submit(2)"
              v-has="'submit'"
              :loading="commitLoading"
            >
              <i class="iconfont mr5 iconziyuan2"></i>提交
            </Button>
          </div>
          <div class="db">
            <Button
              class="mr10"
              @click="saveObsoleteFun(1)"
              :disabled="![0, 4].includes(selectPlanOrderItem.billStatusId)"
              v-has="'invalidate'"
              :loading="cancelLoading"
            >
              <Icon type="md-close" size="14" />作废
            </Button>
          </div>
          <div class="db">
            <Button
              @click="saveObsoleteFun(2)"
              class="mr10"
              :disabled="selectPlanOrderItem.billStatusId != 5"
              v-has="'invalid'"
              :loading="fcanLoading"
            >
              <i class="iconfont mr5 iconfanhuiicon"></i> 反作废
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="exportHandle" v-has="'invalid'">
              <i class="iconfont mr5 icondaochuicon"></i> 导出
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" :disabled="hideSp" @click="showStatus" v-has="'check'">
              <i class="iconfont mr5 iconshenheicon"></i> 查看审批
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
            <!-- 左侧采购计划列表 -->
            <div slot="left" class="con-split-pane-left" style="overflow-y: auto; height: 100%;">
              <div class="pane-made-hd">采购计划单列表</div>
              <!-- 表格 @on-current-change开启 highlight-row（是否支持高亮选中的行，即单选） 后有效，当表格的当前行发生变化的时候会触发-->
              <Table
                :height="leftTableHeight"
                @on-current-change="selectTabelData"
                ref="planOrderTable"
                size="small"
                highlight-row
                border
                :stripe="true"
                :columns="columns"
                :data="tbdata"
              ></Table>
              <!-- 分页操作 -->
              <Page
                class-name="fl pt10"
                size="small"
                :current="page.num"
                :total="page.total"
                :page-size="page.size"
                @on-change="changePage"
                :page-size-opts="page.opts"
                @on-page-size-change="changeSize"
                show-sizer
                show-total
              ></Page>
            </div>
            <!-- 右侧采购计划信息 -->
            <div slot="right" class="con-split-pane-right pl5 goods-list-form">
              <div class="pane-made-hd">采购计划信息</div>
              <div class="clearfix purchase" ref="planForm">
                <!-- 采购计划信息的上半部分表单部分 -->
                <Form
                  inline
                  :show-message="false"
                  ref="formPlan"
                  :model="formPlan"
                  :rules="rulePlan"
                  :label-width="100"
                >
                  <FormItem label="供应商：" prop="supplyName">
                    <Row class="w160">
                      <Col span="19">
                        <Tooltip :content="formPlan.supplyName">
                          <GoodCus
                            style="width: 120px"
                            :title="formPlan.supplyName"
                            placeholder="请输入供应商"
                            :search-value="formPlan.supplyName"
                            @throwName="throwNameFun"
                            :disabled-prop="isinput"
                          ></GoodCus>
                        </Tooltip>
                        <!-- <Select v-model="formPlan.guestId"
                          clearable
                          filterable
                          remote
                          :loading="remoteloading"
                          :remote-method="getOne"
                          @on-change="query2"
                          >
                          <Option
                            v-for="item in ArrayList"
                            :value="item.value"
                            :key="item.value"
                          >{{ item.label }}</Option>
                        </Select>-->
                        <!-- <Input
                          v-model="formPlan.supplyName"
                          :disabled="isinput"
                          placeholder="请选择供应商"
                          readonly
                        />-->
                      </Col>
                      <Col span="5">
                        <Button
                          :disabled="![0, 4].includes(selectPlanOrderItem.billStatusId)"
                          @click="addSuppler"
                          class="ml5"
                          size="small"
                          type="default"
                        >
                          <i class="iconfont iconxuanzetichengchengyuanicon"></i>
                        </Button>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem label="计划采购日期：" prop="planArriveDate">
                    <!--<Input class="w160" v-model="formValidate.planArriveDate"></Input>-->
                    <DatePicker
                      :disabled="isinput"
                      :readonly="![0, 4].includes(selectPlanOrderItem.billStatusId)"
                      v-model="formPlan.planArriveDate"
                      class="w160"
                      placeholder="选择日期"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="计划员：" prop="orderManId">
                    <Select
                      v-model="formPlan.orderManId"
                      class="w160"
                      :disabled="isinput"
                      filterable
                    >
                      <Option
                        v-for="item in salesList"
                        :value="item.value"
                        :key="item.value"
                      >{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="备注：">
                    <Tooltip :content="formPlan.remark">
                      <Input
                        class="w160"
                        :disabled="isinput"
                        :readonly="![0, 4].includes(selectPlanOrderItem.billStatusId)"
                        v-model="formPlan.remark"
                        maxlength="100"
                      />
                    </Tooltip>
                  </FormItem>
                  <FormItem label="票据类型：" prop="billType">
                    <Select
                      class="w160"
                      :disabled="![0, 4].includes(selectPlanOrderItem.billStatusId)"
                      v-model="formPlan.billType"
                    >
                      <Option
                        v-for="item in invoiceMap"
                        :value="item.value"
                        :key="item.value"
                      >{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="直发门店：">
                    <Select
                      class="w160"
                      :disabled="![0, 4].includes(selectPlanOrderItem.billStatusId)"
                      v-model="formPlan.directCompanyId"
                      clearable
                      filterable
                    >
                      <Option
                        v-for="item in companyMap"
                        :value="item.value"
                        :key="item.value"
                        v-show="item.value!=$store.state.user.userData.shopId"
                      >{{ item.label}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="计划单号：">
                    <Tooltip :content="formPlan.planOrderNum">
                      <Input
                        class="w160"
                        readonly
                        :disabled="isinput"
                        v-model="formPlan.planOrderNum"
                      />
                    </Tooltip>
                  </FormItem>
                  <FormItem label="其他费用：">
                    <el-input-number
                      class="w160"
                      :disabled="isinput"
                      :readonly="![0, 4].includes(selectPlanOrderItem.billStatusId)"
                      v-model="formPlan.otherPrice"
                      @on-change="changeTotals"
                      :min="0"
                      :precision="2"
                      :controls="false"
                      size="small"
                    />
                  </FormItem>
                  <FormItem label="合计总金额：">
                    <el-input-number
                      class="w160"
                      :disabled="true"
                      readonly
                      v-model="formPlan.totalPrice"
                      :min="0"
                      :precision="2"
                      :controls="false"
                      size="small"
                    />
                  </FormItem>
                </Form>
              </div>
              <div class="flex plan-cz-btn" ref="planBtn">
                <div class="clearfix">
                  <div class="fl mb5">
                    <Button
                      size="small"
                      class="mr10"
                      :disabled="![0, 4].includes(selectPlanOrderItem.billStatusId)"
                      @click="addPro"
                      v-has="'AddAccessories'"
                    >
                      <Icon type="md-add" />添加配件
                    </Button>
                  </div>
                  <div class="fl mb5">
                    <Upload
                      ref="upload"
                      :show-upload-list="false"
                      :action="upurl"
                      :format="['xlsx', 'xls', 'csv']"
                      :headers="headers"
                      :before-upload="handleBeforeUpload"
                      :on-success="handleSuccess"
                      :on-format-error="onFormatError"
                      :disabled="![0, 4].includes(selectPlanOrderItem.billStatusId) || selectPlanOrderItem.new"
                    >
                      <Button
                        size="small"
                        class="mr10"
                        v-has="'import'"
                        :disabled="![0, 4].includes(selectPlanOrderItem.billStatusId) || selectPlanOrderItem.new"
                      >导入</Button>
                    </Upload>
                  </div>
                  <div class="fl mb5 mr10">
                    <Button size="small" @click="down">
                      <Icon custom="iconfont iconxiazaiicon icons" />下载模板
                    </Button>
                  </div>
                  <div class="fl mb5">
                    <Button
                      size="small"
                      class="mr10"
                      :disabled="![0, 4].includes(selectPlanOrderItem.billStatusId)"
                      @click="delTableData"
                      v-has="'delete'"
                    >
                      <i class="iconfont mr5 iconlajitongicon"></i>
                      删除
                    </Button>
                  </div>
                  <!-- <div class="fl mb5">
                    │
                    <span class="ml10">配件品牌：</span>
                    <Select size="small" class="w100 mr10" v-model="formPlan.billType">
                      <Option value="beijing">New York</Option>
                      <Option value="shanghai">London</Option>
                      <Option value="shenzhen">Sydney</Option>
                    </Select>
                  </div>
                  <div class="fl mb5">
                    <span>销量排名前：</span>
                    <Input size="small" class="w50 mr10" v-model="formPlan.totalPrice"></Input>
                  </div>
                  <div class="fl mb5">
                    │
                    <span class="ml10">备货级别：</span>
                    <Select size="small" class="w100 mr10" v-model="formPlan.billType">
                      <Option value="beijing">New York</Option>
                      <Option value="shanghai">London</Option>
                      <Option value="shenzhen">Sydney</Option>
                    </Select>
                  </div>
                  <div class="fl mb5">
                    <Button size="small" class="mr10" @click="addPro"><i class="iconfont mr5 iconxiazaiicon"></i> 获取配件</Button>
                  </div>-->
                  <div class="fl mb5">
                    <Button
                      size="small"
                      class="mr10"
                      :disabled="selectPlanOrderItem.billStatusId != 2"
                      @click="showModel('adjustModel')"
                    >
                      <i class="iconfont mr5 iconbianjixiugaiicon"></i>
                      计划调整
                    </Button>
                  </div>
                </div>
                <!-- <div class="t-price">
                  采购计划金额：120000.00
                </div>-->
              </div>
              <vxe-table
                border
                resizable
                show-footer
                @select-all="selectAll"
                @select-change="selectVxeData"
                :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true}"
                @keydown="keydown"
                size="mini"
                :height="rightTableHeight"
                :data="tableData"
                :footer-method="addFooter"
                :edit-config="{ trigger: 'click', mode: 'cell' }"
              >
                <vxe-table-column
                  show-overflow="tooltip"
                  fixed="left"
                  type="seq"
                  width="50"
                  title="序号"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip" fixed="left" type="checkbox" width="50"></vxe-table-column>
                <vxe-table-column
                  show-overflow="tooltip"
                  fixed="left"
                  field="partCode"
                  title="配件编码"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  show-overflow="tooltip"
                  fixed="left"
                  field="partName"
                  title="配件名称"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  show-overflow="tooltip"
                  fixed="left"
                  field="partInnerId"
                  title="配件内码"
                  width="80"
                ></vxe-table-column>
                <vxe-table-column
                  show-overflow="tooltip"
                  fixed="left"
                  field="partBrand"
                  title="品牌"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  show-overflow="tooltip"
                  field="totalStockQty"
                  title="连锁库存"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  show-overflow="tooltip"
                  field="masterStockQty"
                  title="总部库存"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  show-overflow="tooltip"
                  field="branchStockQty"
                  title="门店库存"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  show-overflow="tooltip"
                  field="onWayQty"
                  title="采购在途库存"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  show-overflow="tooltip"
                  field="unsalableQty"
                  title="滞销库存"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  show-overflow="tooltip"
                  field="orderQty"
                  title="计划采购数量"
                  :edit-render="{ name: 'input' }"
                  width="160"
                  size="mini"
                >
                  <template v-slot:edit="{ row }">
                    <el-input-number
                      :max="9999"
                      :min="1"
                      v-model="row.orderQty"
                      :controls="false"
                      size="small"
                      :precision="0"
                    />
                  </template>
                </vxe-table-column>
                <vxe-table-column
                  field="orderPrice"
                  title="计划采购单价"
                  :edit-render="{ name: 'input' }"
                  width="160"
                  size="mini"
                  show-overflow="tooltip"
                >
                  <template v-slot:edit="{ row }">
                    <el-input-number
                      :min="0"
                      v-model="row.orderPrice"
                      :precision="2"
                      :controls="false"
                      size="small"
                    />
                  </template>
                  <template v-slot="{ row }">{{ row.orderPrice | priceFilters }}</template>
                </vxe-table-column>
                <vxe-table-column
                  show-overflow="tooltip"
                  title="计划采购金额"
                  width="120"
                  field="orderAmt"
                >
                  <template v-slot="{ row }">{{ (row.orderPrice * row.orderQty) | priceFilters }}</template>
                </vxe-table-column>
                <vxe-table-column
                  show-overflow="tooltip"
                  field="remark"
                  title="备注"
                  :edit-render="{ name: 'input' }"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip" title="不含税单价" width="100">
                  <template v-slot="{ row }">{{ row.noTaxPrice | priceFilters }}</template>
                </vxe-table-column>
                <vxe-table-column show-overflow="tooltip" title="不含税金额" width="100">
                  <template v-slot="{ row }">{{ row.noTaxPrice * row.orderQty |priceFilters}}</template>
                </vxe-table-column>
                <vxe-table-column show-overflow="tooltip" title="最近采购单价" width="100">
                  <template v-slot="{ row }">{{ row.recentPrice | priceFilters }}</template>
                </vxe-table-column>
                <vxe-table-column show-overflow="tooltip" title="单价差" width="100">
                  <template v-slot="{ row }">{{ (row.orderPrice - row.recentPrice) | priceFilters }}</template>
                </vxe-table-column>
                <vxe-table-column show-overflow="tooltip" field="upLimit" title="库存上限" width="100"></vxe-table-column>
                <vxe-table-column
                  show-overflow="tooltip"
                  field="downLimit"
                  title="库存下限"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  show-overflow="tooltip"
                  field="carModelName"
                  title="品牌车型"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip" field="unit" title="单位" width="100"></vxe-table-column>
                <vxe-table-column show-overflow="tooltip" field="oemCode" title="OE码" width="100"></vxe-table-column>
                <vxe-table-column show-overflow="tooltip" field="spec" title="规格" width="100"></vxe-table-column>
                <vxe-table-column
                  show-overflow="tooltip"
                  field="notEnterQty"
                  title="计划取消数量"
                  width="100"
                ></vxe-table-column>
              </vxe-table>
              <!--<div ref="planPage">-->
              <!--<Page size="small" class-name="page-con" :current="page.num" :total="page.total" :page-size="page.size" @on-change="changePage"-->
              <!--@on-page-size-change="changeSize" show-sizer show-total></Page>-->
              <!--</div>-->
            </div>
          </Split>
        </div>
      </div>
    </section>
    <!--添加配件-->
    <select-part-com
      ref="selectPartCom"
      :formPlanmain="formPlan"
      @selectPartName="getPartNameList"
      @selectPartName2="getPartNameList2"
      :is-show-add-part-btn="true"
    ></select-part-com>
    <!--选择供应商-->
    <select-supplier
      @func="getArray"
      ref="selectSupplier"
      header-tit="供应商资料"
      @selectSupplierName="getSupplierName"
    ></select-supplier>
    <!-- 更多 -->
    <more-search type="采购计划" :getBrand="getBrand" @getmoreData="getmoreData" ref="moreSearch"></more-search>
    <!-- 采购计划信息的订单调整 -->
    <adjust-model ref="adjustModel" :mainId="mainId"></adjust-model>
    <!--审批状态-->
    <status-model ref="StatusModel" :orderId="selectPlanOrderItem"></status-model>
  </div>
</template>
<script>
import adjustModel from "./components/AdjustModel.vue";
import StatusModel from "../plannedPurchaseOrder/components/checkApprovalModal.vue";
import MoreSearch from "../plannedPurchaseOrder/components/MoreSearch.vue";
import "../../lease/product/lease.less";
import "./goodsList.less";
import { getPurchaseInit } from "_api/purchasing/purchasePlan";
import { getLeaseProlist, saveProduct } from "../../../api/lease/leaseApi";
import QuickDate from "../../../components/getDate/dateget";
// import {purchaseTypeList} from './goodsList'
import { mixGoodsData } from "./mixGoodsList";
import SelectPartCom from "./components/selectPartCom";
import SelectSupplier from "./components/supplier/selectSupplier";
import { getParamsBrand } from "_api/purchasing/purchasePlan";
import { getSales } from "@/api/salesManagment/salesOrder";
import { TOKEN_KEY } from "@/libs/util";
import Cookies from "js-cookie";
import baseUrl from "_conf/url";
import { down } from "@/api/system/essentialData/commoditiesInShortSupply.js";
import * as fapi from "_api/procurement/plan";
import GoodCus from "_c/allocation/GoodCus.vue";
export default {
  name: "goodsList",
  components: {
    SelectSupplier,
    SelectPartCom,
    QuickDate,
    StatusModel,
    adjustModel,
    MoreSearch,
    GoodCus,
  },
  inject: ["reload"],
  mixins: [mixGoodsData],
  data() {
    let price = (rule, value, callback) => {
      if (!value && value != 0) {
        callback(new Error("单次扣减华币不能为空"));
      } else {
        let reg = /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^([^0][0-9]+|0)$/;

        if (!reg.test(value)) {
          callback("请输入正确格式");
        } else {
          callback();
        }
      }
    };
    let price2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error("销售价不能为空"));
      } else {
        if (!/[^\d.]/g.test(value)) {
          if (/[.]/g.test(value)) {
            let reg = /^\d+\.\d{1,2}$/;
            if (!reg.test(value)) {
              callback("请输入正确格式");
            } else {
              callback();
            }
          } else {
            callback();
          }
        } else {
          callback("请输入数字格式");
        }
        //
        //
        // if(!reg.test(value)){
        //
        // }else{
        //   callback()
        // }
      }
    };
    return {
      commitLoading: false,
      saveLoading: false,
      cancelLoading: false,
      fcanLoading: false,
      remoteloading: false,
      ArrayList: [],
      showSelf: true,
      submitloading: false,
      getBrand: [],
      newadd: false,
      isinput: true,
      isMore: false,
      moreData: {},

      //快速订单查询状态
      purchaseType: "",
      purchaseTypeArr: [],
      //高级搜索层
      advancedSearch: false,

      mainId: "",
      linkModal: false,
      proModal: false,
      proModalTit: "",
      split1: 0.2,
      searchValue: "",
      dateTime: "",

      formValidate: {
        name: "",
        type: 0,
        salesPrice: "",
        isCycle: "",
        remark: "",
        disable: "1",
        address: "",
        coin: 0,
      },
      ruleValidate: {
        name: [
          { required: true, message: "产品名称不能为空", trigger: "blur" },
        ],
        salesPrice: [{ required: true, validator: price2, trigger: "blur" }],
        isCycle: [
          { required: true, message: "有效期不能为空", trigger: "blur" },
        ],
        address: [
          { required: true, message: "接口地址不能为空", trigger: "blur" },
        ],
        coin: [
          { required: true, validator: price, trigger: ["blur", "change"] },
        ],
      },
      proType: [],
      valus: null,
      page: {
        num: 1,
        size: 20,
        total: 0,
        opts: [20, 50, 100, 200],
      },
      loading: false,
      columns: [
        {
          title: "序号",
          minWidth: 50,
          type: "index",
          key: "id",
        },
        {
          title: "状态",
          key: "billStatusId",
          minWidth: 70,
          render: (h, params) => {
            let val = params.row.billStatusId.name || "";
            return h("span", val);
          },
        },
        {
          title: "供应商",
          key: "guestName",
          minWidth: 170,
        },
        {
          title: "创建日期",
          key: "createTime",
          minWidth: 120,
        },
        {
          title: "创建人",
          key: "createUname",
          minWidth: 140,
        },
        {
          title: "计划员",
          key: "orderMan",
          minWidth: 120,
        },
        {
          title: "计划单号",
          key: "serviceId",
          minWidth: 200,
        },
        {
          title: "提交人",
          key: "auditor",
          minWidth: 100,
        },
        {
          title: "提交日期",
          key: "auditDate",
          minWidth: 170,
        },
      ],
      tbdata: [],

      //左侧表格高度
      leftTableHeight: 0,
      //右侧表格高度
      rightTableHeight: 0,
      salesList: [],
    };
  },
  mounted() {
    this.initStart();
    setTimeout(() => {
      this.getDomHeight();
    }, 0);
    getPurchaseInit({}).then((res) => {
      //票据类型
      if (res.code == 0) {
        const { planBillStatusMap } = res.data;
        for (let el in planBillStatusMap) {
          this.purchaseTypeArr.push({
            value: planBillStatusMap[el],
            label: el,
          });
        }
      }
    });
    this.getAllSales();
  },
  created() {
    getParamsBrand().then((res) => {
      // console.log(res.data, 11111111111);
      this.getBrand = res.data;
    });
  },
  methods: {
    query2() {
      console.log(this.formPlan.supplyName);
      this.ArrayList.forEach((el) => {
        if (el.value === this.formPlan.guestId) {
          this.formPlan.supplyName = el.label;
        }
      });
    },

    async getOne(query) {
      if (query != "") {
        this.remoteloading = true;
        fapi.getSupplier({ fullName: query, size: 20, num: 0 }).then((res) => {
          if (res.code === 0) {
            this.ArrayList = [
              {
                label: this.formPlan.supplyName,
                value: this.formPlan.guestId,
              },
            ];
            res.data.content.map((item) => {
              this.ArrayList.push({
                value: item.id,
                label: item.shortName,
              });
            });
            this.remoteloading = false;
          }
        });
      }
    },
    //获取表格高度
    getDomHeight() {
      this.$nextTick(() => {
        let wrapH = this.$refs.paneLeft.offsetHeight;
        let planFormH = this.$refs.planForm.offsetHeight;
        let planBtnH = this.$refs.planBtn.offsetHeight;
        // let planPageH = this.$refs.planPage.offsetHeight;
        //获取左侧侧表格高度
        this.leftTableHeight = wrapH - 100;
        //获取右侧表格高度
        this.rightTableHeight = wrapH - planFormH - planBtnH - 40;
      });
    },
    initStart() {
      this.getList();
    },
    async getAllSales() {
      let res = await getSales();
      if (res.code === 0) {
        this.salesList = res.data.content;
        this.salesList.forEach((item) => {
          item.label = item.userName;
          item.value = item.id;
        });
      }
    },
    showStatus() {
      this.$refs["StatusModel"].init();
    },
    showModel(name) {
      this.$refs[name].init();
    },
    getmoreData(data) {
      // console.log(data)
      this.moreData = data;
      if (data != null) {
        this.isMore = true;
        this.getList();
      } else {
        this.isMore = false;
      }
    },
    //选择供应商
    addSuppler() {
      this.$refs.selectSupplier.init();
    },
    //添加配件
    addPro() {
      this.$refs.selectPartCom.init();
    },
    print() {
      const ref = this.$refs.PrintModel;
      ref.openModal();
    },
    //分页
    changePage(p) {
      this.page.num = p;
      this.getList();
    },
    changeSize(size) {
      this.page.num = 1;
      this.page.size = size;
      this.getList();
    },
    //搜索
    selectDate(date) {
      this.dateTime = date;
      this.search();
    },
    search() {
      this.page.num = 1;
      this.getList();
    },

    //快速查询日期
    getDataQuick(v) {
      this.selectDate(v);
    },

    //下载模板
    down() {
      down("1800000000");
    },
  },
};
</script>
