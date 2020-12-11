<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box headerTitlefen">
      <div class="headerbox">
        <Row>
          <Col span="20">
            <Row class="db">
              <Col span="6">
                <span class="title">门店：</span>
                <span class="pl10">{{ orgName }}</span>
              </Col>
              <Col span="6">
                <span class="title">对账单金额:</span>
                <span>{{
                  currentAccount.row
                    ? currentAccount.row.actualCollectionOrPayment
                    : ""
                }}</span>
              </Col>
              <Col span="6">
                <span class="title">认领款金额:</span>
                <span>{{ claimedAmt }}</span>
              </Col>
              <Col span="6">
                <span class="title">差异</span>
                <span>{{ difference ? difference.toFixed(2) : "" }}</span>
              </Col>
            </Row>
          </Col>
          <Col span="4">
            <Button class="ml10" @click="write">核销对账单</Button>
          </Col>
        </Row>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <Split v-model="split1">
          <div slot="left" v-show="!rightValue">
            <h4 class="mb10 p5 pl10" style="background:#F2F2F2">未核销对账单</h4>
            <div style="line-height: 36px">
              <quickDate class="w60 mr10" ref="quickDate" @quickDate="quickDate"></quickDate>
              <span>申请日期：</span>
              <Date-picker
                format="yyyy-MM-dd"
                :value="value"
                @on-change="changedate"
                type="daterange"
                placeholder="选择日期"
                class="w200 mr10"
              ></Date-picker>
              <span>分店名称：</span>
              <Select
                v-model="model1"
                filterable
                class="w150 mr10"
                :disabled="selectShopList"
              >
                <Option v-for="item in orgList" :value="item.id" :key="item.id"
                  >{{ item.shortName }}
                </Option>
              </Select>
              <span>往来单位：</span>
              <Select
                v-model="companyIdNo"
                class="w100 mr10"
                clearable
                filterable
                remote
                :loading="remoteloading"
                :remote-method="getOne"
              >
                <Option
                  v-for="item in company"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
              <!--            <span class="ml10">收付类型：</span>-->
              <!--            <Select v-model="paymentId" class="w100" filterable>-->
              <!--              <Option-->
              <!--                v-for="item in paymentList"-->
              <!--                :value="item.value"-->
              <!--                :key="item.value"-->
              <!--              >{{ item.label }}-->
              <!--              </Option>-->
              <!--            </Select>-->
              <span class="ml10">金额：</span>
              <InputNumber v-model="amtNo" class="w80" />
              <button
                class="ivu-btn ivu-btn-default ml10 mr10"
                type="button"
                @click="queryNoWrite"
              >
                <i class="iconfont iconchaxunicon"></i>
                <span>查询</span>
              </button>
              <button
              v-has="'export'"
                class="ivu-btn ivu-btn-default ml10 mr10"
                type="button"
                @click="leftExport"
              >
                <span>导出</span>
              </button>
              <Tooltip
                :content="leftValue ? '缩小' : '放大'"
                placement="bottom"
              >
                <Icon
                  @click.native="handleChangeLeft"
                  :custom="
                    leftValue
                      ? 'iconfont iconsuoxiaoicon icons'
                      : 'iconfont iconkuodaicon icons'
                  "
                  style="cursor: pointer"
                ></Icon>
              </Tooltip>
            </div>
            <accountNoWriteTable
              :table-data="accountNoWriteData"
              :loading="accountNoWriteLoading"
              @currEvent="accountNoWriteChange"
            ></accountNoWriteTable>
            <Page
              show-sizer
              show-total
              show-elevator
              class="mt10 tr mr10"
              size="small"
              :total="accountPage.total"
              :current="accountPage.page"
              :page-size="accountPage.size"
              @on-change="pageChangeNo"
              @on-page-size-change="sizeChangeNo"
            />
          </div>
          <div slot="right" style="height: 100%;" v-show="!leftValue">
            <Tabs type="card">
              <TabPane label="本店待认领款" style="height: 100%;">
                <div class="card" style="height: 100%;">
                  <div style="line-height: 36px">
                    <quickDate
                      class="w80 mr10"
                      ref="quickDate2"
                      @quickDate="quickDate2"
                    ></quickDate>
                    <span>申请日期：</span>
                    <Date-picker
                      format="yyyy-MM-dd"
                      :value="value2"
                      @on-change="changedate2"
                      type="daterange"
                      placeholder="选择日期"
                      class="w200 mr10"
                    ></Date-picker>
                    <span>分店名称：</span>
                    <Select
                      v-model="model2"
                      filterable
                      class="w150 mr10"
                      :disabled="selectShopList"
                    >
                      <Option
                        v-for="item in orgList"
                        :value="item.id"
                        :key="item.id"
                        >{{ item.shortName }}
                      </Option>
                    </Select>
                    <span class="ml10">往来单位：</span>
                    <Select
                      v-model="companyIdClaim"
                      class="w100"
                      clearable
                      filterable
                      remote
                      :loading="remoteloading2"
                      :remote-method="getOne2"
                    >
                      <Option
                        v-for="item in company2"
                        :value="item.value"
                        :key="item.value"
                        >{{ item.label }}</Option
                      >
                    </Select>
                    <span class="ml10">金额：</span>
                    <InputNumber v-model="amtClaim" class="w80" />
                    <span class="ml10">对方户名：</span>
                    <Input v-model="bankNameOClaim" class="w100 mr10" />
                    <span>业务类别：</span>
                    <Select v-model="businessType" clearable class="w150 mr10">
                      <Option
                        v-for="item in businessTypeList"
                        :value="item.itemName"
                        :key="item.id"
                        >{{ item.itemName }}
                      </Option>
                    </Select>
                    <button
                      class="ivu-btn ivu-btn-default ml10 mr10"
                      type="button"
                      @click="queryClaimed"
                    >
                      <i class="iconfont iconchaxunicon"></i>
                      <span>查询</span>
                    </button>
                    <button
                    v-has="'export'"
                      class="ivu-btn ivu-btn-default ml10 mr10"
                      type="button"
                      @click="rightone"
                    >
                      <span>导出</span>
                    </button>
                    <Tooltip
                      :content="rightValue ? '缩小' : '放大'"
                      placement="bottom"
                    >
                      <Icon
                        @click.native="handleChangeRight"
                        :custom="
                          leftValue
                            ? 'iconfont iconsuoxiaoicon icons'
                            : 'iconfont iconkuodaicon icons'
                        "
                        style="cursor: pointer"
                      ></Icon>
                    </Tooltip>
                  </div>
                  <br />
                  <Button
                    class="mt10 ml10"
                    v-has="'revoke'"
                    @click="distributionDelete"
                    :disabled="cancelDis"
                    >撤销分配</Button
                  >
                  <Button
                    class="mt10 ml10"
                    v-has="'now'"
                    @click="openSubjecMoadl"
                    >转当期损益</Button
                  >
                  <Button
                    class="mt10 ml10"
                    @click="openOtherCollectionClaims('预收款认领')"
                    >预收款认领</Button
                  >
                  <Button
                    class="mt10 ml10"
                    @click="openOtherPaymentClaims('预付款认领')"
                    >预付款认领</Button
                  >
                  <Button
                    class="mt10 ml10"
                    @click="openOtherCollectionClaims('其他收款认领')"
                    >其他收款认领</Button
                  >
                  <Button
                    class="mt10 ml10"
                    @click="openOtherPaymentClaims('其他付款认领')"
                    >其他付款认领</Button
                  >
                  <Button class="mt10 ml10" @click="openAccrued"
                    >转应收应付</Button
                  >
                  <claim ref="claim" @selection="selectionChange" />
                </div>
              </TabPane>
              <TabPane label="连锁待分配款项">
                <div class="card">
                  <div style="line-height: 36px">
                    <quickDate
                      class="w60 mr10"
                      ref="quickDate3"
                      @quickDate="quickDate3"
                    ></quickDate>
                    <span>发生日期：</span>
                    <Date-picker
                      format="yyyy-MM-dd"
                      :value="value3"
                      @on-change="changedate3"
                      type="daterange"
                      placeholder="选择日期"
                      class="w200 mr10"
                      transfer
                    ></Date-picker>
                    <span class="ml10">区域：</span>
                    <Select
                      transfer
                      v-model="areaId"
                      class="w100"
                      @on-change="getShop(areaId)"
                      filterable
                    >
                      <!--                  :disabled="selectShopList"-->
                      <Option
                        v-for="item in areaList"
                        :value="item.value"
                        :key="item.value"
                        >{{ item.label }}
                      </Option>
                    </Select>
                    <span class="ml10">门店：</span>
                    <Select transfer v-model="orgId" class="w150" filterable>
                      <!--                  :disabled="selectShopList"-->
                      <Option
                        v-for="item in orgList"
                        :value="item.id"
                        :key="item.id"
                        >{{ item.shortName }}</Option
                      >
                    </Select>
                    <span class="ml10">金额：</span>
                    <InputNumber v-model="amtDis" class="w80" />
                    <span class="ml10">对方户名：</span>
                    <Input v-model="bankNameODis" class="w100" />
                    <button
                      class="ivu-btn ivu-btn-default ml10"
                      type="button"
                      @click="queryDistribution"
                    >
                      <i class="iconfont iconchaxunicon"></i>
                      <span>查询</span>
                    </button>
                    <button
                    v-has="'export'"
                      class="ivu-btn ivu-btn-default ml10"
                      type="button"
                     @click="rightTwoExport"
                    >
                      <span>导出</span>
                    </button>
                    <button
                      class="ivu-btn ivu-btn-default ml10 mr10"
                      type="button"
                      :disabled="distributionLoading"
                      @click="distributionShop"
                    >分配至本店
                    </button>
                    <Tooltip :content="rightValue ? '缩小' : '放大'" placement="bottom">
                      <Icon @click.native="handleChangeRight"
                            :custom="leftValue ? 'iconfont iconsuoxiaoicon icons' : 'iconfont iconkuodaicon icons'"
                            style="cursor: pointer;"></Icon>
                    </Tooltip>
                  </div>
                  <vxe-table
                    border
                    class="mt10"
                    auto-resize
                    resizable
                    align="center"
                    size="mini"
                    show-overflow="title"
                    :data="distributionData"
                    max-height="550"
                    @select-change="distributionSelection"
                    @select-all="distributionSelection"
                    @select-cancel="distributionSelection"
                  >
                    <vxe-table-column type="selection" width="60"></vxe-table-column>
                    <vxe-table-column type="seq" title="序号" width="40"></vxe-table-column>
                    <vxe-table-column field="businessType" title="业务类别" width="100"></vxe-table-column>
                    <vxe-table-column field="createTime" title="发生日期" width="100"></vxe-table-column>
                    <vxe-table-column field="incomeMoney" title="收入金额" width="100"></vxe-table-column>
                    <vxe-table-column field="paidMoney" title="支出金额" width="100"></vxe-table-column>
                    <vxe-table-column field="reciprocalAccountName" title="对方户名" width="100"></vxe-table-column>
                    <vxe-table-column field="area" title="所属区域" width="100"></vxe-table-column>
                    <vxe-table-column field="shopName" title="所属门店" width="100"></vxe-table-column>
                    <vxe-table-column field="shopCode" title="所属店号" width="100"></vxe-table-column>
                    <vxe-table-column field="accountName" title="账户" width="100"></vxe-table-column>
                    <vxe-table-column field="accountCode" title="账号" width="100"></vxe-table-column>
                    <vxe-table-column field="bankName" title="开户行" width="100"></vxe-table-column>
                    <vxe-table-column field="mateAccountName" title="对应科目" width="100"></vxe-table-column>
                    <vxe-table-column field="tradingNote" title="交易备注" width="100"></vxe-table-column>
                  </vxe-table>
                  <Page
                    show-sizer
                    show-total
                    show-elevator
                    class="mt10 tr"
                    size="small"
                    placement="top"
                    :total="distributionPage.total"
                    :current="distributionPage.page"
                    :page-size="distributionPage.size"
                    @on-change="pageChange"
                    @on-page-size-change="sizeChange"
                  />
                </div>
              </TabPane>
            </Tabs>

            <!-- 转当期损益 -->
            <subject ref="subjecModal" :clime="claimedSubjectList"></subject>
            <!-- 预收款认领 collectionClaims-->
            <!-- 预付款认领 paymentClaim-->
            <!-- 其他收款认领 otherCollectionClaims  预收款认领 collectionClaims-->
            <otherCollectionClaims
              ref="otherCollectionClaims"
              :accrued="claimedSubjectList"
            ></otherCollectionClaims>
            <!-- 其他付款认领 otherPaymentClaim-->
            <otherPaymentClaim
              ref="otherPaymentClaim"
              :accrued="claimedSubjectList"
              :selectItem="selectItem"
            ></otherPaymentClaim>
            <!-- 转应收应付 accrued-->
            <accrued ref="accrued" :accrued="claimedSubjectList"></accrued>
          </div>
        </Split>
      </div>
    </section>
    <advance ref="advance" />
    <expenditure ref="expenditure" :title="title" />
    <settlement ref="settlement" />
    <chargeAdvance ref="chargeAdvance" />
  </div>
</template>
<script>
import { getbayer } from "@/api/AlotManagement/threeSupplier";
import { getSupplierList } from "_api/purchasing/purchasePlan";
import advance from "./components/Advance";
import chargeAdvance from "./components/chargeAdvance";
import expenditure from "./components/expenditure";
import settlement from "./components/settlement";
import claim from "../../components/claimed";
import accountNoWriteTable from "./components/accountNoWriteTable";
import { getDataDictionaryTable } from "@/api/system/dataDictionary/dataDictionaryApi";
import {
  getPayablesExportqileft,
  getPayablesExportqirightone,
  getPayablesExportqirighttwo,
  accountNoSelete,
  distributionSelete,
  claimedFund,
  distributionShop,
  distributionRevoke,
} from "_api/settlementManagement/fundsManagement/claimWrite.js";
import { are } from "@/api/settlementManagement/fundsManagement/capitalChain";
import { goshop } from "@/api/settlementManagement/shopList";
import { findGuest } from "_api/settlementManagement/advanceCollection.js";
import { creat } from "../../components";
import bus from "../../bill/Popup/Bus";
import subject from "./components/Subject";
import * as all from "_api/reportForm/index.js";
import accrued from "./components/accrued";
import otherCollectionClaims from "./components/otherCollectionClaims";
import otherPaymentClaim from "@/view/settlementManagement/fundsManagement/claimWrite/components/otherPaymentClaim";
import quickDate from "@/components/getDate/dateget_bill.vue";
import moment from "moment";

export default {
  name: "claimWrite",
  components: {
    advance,
    expenditure,
    settlement,
    accountNoWriteTable,
    claim,
    chargeAdvance,
    subject,
    accrued,
    otherCollectionClaims,
    otherPaymentClaim,
    quickDate,
  },
  data() {
    return {
      cancelDis: false, //控制撤销分配按钮禁用
      distributionLoading: false, //控制分配至本店按钮禁用
      model1: "", //未核销对账单 查询分店绑定model
      value: [], //未核销对账单 查询快速
      // applyDate:"",//未核销对账单 查询申请日期value
      model2: "", //本店待认领款 查询分店绑定model
      value2: [], //本店待认领款 快速查询
      // applyDate2:"",//本店待认领款 查询申请日期value
      // model3:[],//连锁待分配款项 查询分店绑定model
      value3: [], //连锁待分配款项 快速查询
      // applyDate3:"",//连锁待分配款项 查询申请日期
      remoteloading: false,
      remoteloading2: false,
      title: "预付款认领", //弹框标题
      split1: 0.4, //左右面板分割
      orgName: "", //门店
      companyIdNo: "", //未核销往来单位
      companyIdClaim: "", //待认领往来单位
      businessType: "收回应收", //本店待认领款 业务类别 绑定值
      businessTypeList: [], //本店待认领款 业务类别 下拉框
      company: [], //往来单位下拉框
      company2: [], //往来单位下拉框
      orgId: "", //门店  连锁待分配款项
      orgList: [{ id: "", name: "全部", shortName: "全部" }], //分店名称
      claimedSubjectList: [], //获取到点击到的本店认领数据
      areaId: 0, //区域
      areaList: [{ value: 0, label: "全部" }], //区域
      bankNameOClaim: "", //对方户名
      bankNameODis: "", //对方户名
      paymentId: "YJDZ", //收付类型
      // paymentList: [], //收付类型下拉框
      amtNo: null, //金额
      amtClaim: null, //金额
      amtDis: null, //金额
      accountPage: {
        page: 1,
        total: 0,
        size: 10,
      }, //未核销分页
      currentAccount: {}, //未核销选中的数据
      accountNoWriteLoading: false, //为核销对账单 loading
      accountNoWriteData: [], //未核销对账单表格数据
      distribution: [
        {
          title: "选择",
          type: "selection",
          align: "center",
          width: 40,
          resizable: true,
        },
        {
          title: "序号",
          type: "index",
          align: "center",
          width: 40,
          resizable: true,
        },
        //businessType
        {
          title: "业务类别",
          key: "businessType",
          align: "center",
          width: 100,
          resizable: true,
        },
        {
          title: "发生日期",
          key: "createTime",
          align: "center",
          width: 100,
          resizable: true,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                  domProps: {
                    title: params.row.createTime,
                  },
                },
                params.row.createTime
              ),
            ]);
          },
        },
        {
          title: "收入金额",
          key: "incomeMoney",
          align: "center",
          width: 100,
          resizable: true,
        },
        {
          title: "支出金额",
          key: "paidMoney",
          align: "center",
          width: 100,
          resizable: true,
        },
        {
          title: "对方户名",
          key: "reciprocalAccountName",
          align: "center",
          width: 100,
          resizable: true,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                  domProps: {
                    title: params.row.reciprocalAccountName,
                  },
                },
                params.row.reciprocalAccountName
              ),
            ]);
          },
        },
        {
          title: "所属区域",
          key: "area",
          align: "center",
          width: 100,
          resizable: true,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                  domProps: {
                    title: params.row.area,
                  },
                },
                params.row.area
              ),
            ]);
          },
        },
        {
          title: "所属门店",
          key: "shopName",
          align: "center",
          width: 100,
          resizable: true,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                  domProps: {
                    title: params.row.shopName,
                  },
                },
                params.row.shopName
              ),
            ]);
          },
        },
        {
          title: "所属店号",
          key: "shopCode",
          align: "center",
          width: 100,
          resizable: true,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                  domProps: {
                    title: params.row.shopCode,
                  },
                },
                params.row.shopCode
              ),
            ]);
          },
        },
        {
          title: "账户",
          key: "accountName",
          align: "center",
          width: 100,
          resizable: true,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                  domProps: {
                    title: params.row.accountName,
                  },
                },
                params.row.accountName
              ),
            ]);
          },
        },
        {
          title: "账号",
          key: "accountCode",
          align: "center",
          width: 100,
          resizable: true,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                  domProps: {
                    title: params.row.accountCode,
                  },
                },
                params.row.accountCode
              ),
            ]);
          },
        },
        {
          title: "开户行",
          key: "bankName",
          align: "center",
          width: 100,
          resizable: true,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                  domProps: {
                    title: params.row.bankName,
                  },
                },
                params.row.bankName
              ),
            ]);
          },
        },
        {
          title: "对应科目",
          key: "mateAccountName",
          align: "center",
          width: 100,
          resizable: true,
        },
        {
          title: "交易备注",
          key: "tradingNote",
          align: "center",
          width: 100,
          resizable: true,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                  domProps: {
                    title: params.row.tradingNote,
                  },
                },
                params.row.tradingNote
              ),
            ]);
          },
        },
      ], //连锁待分配款项
      distributionData: [], //连锁待分配款项列表
      distributionPage: {
        page: 1,
        total: 0,
        size: 10,
      }, //连锁待分配款项分页
      currentDistribution: [], //本店待认领款选中的数据
      claimedAmt: null, //认领款勾选金额
      difference: null, //差异
      leftValue: false, //左侧方法判断
      rightValue: false, //右侧判断方法
      writeBool: false, //判断 是否可以打开核销对账单
      selectItem: [],
    };
  },
  //keepalive 数据劫持是调用数据
  activated() {
    if (this.$route.params.id) {
      this.value = ["", ""];
      this.paramsNoWrite();
    }
  },

  async mounted() {
    getDataDictionaryTable({ dictCode: "YWLX" }).then((res2) => {
      this.businessTypeList = res2.data || [];
    });
    let arr = await creat([], this.$store);
    this.orgName = arr[3];
    this.$nextTick(() => {
      this.areaId = arr[0];
      this.setAreaDef();
      this.orgId = arr[1];
      this.model1 = arr[1];
      this.model2 = arr[1];
      if (this.$route.params.id) {
        this.value = ["", ""];
        this.paramsNoWrite();
      } else {
        this.queryNoWrite();
      }
      this.claimedList();
      this.distributionList();
    });
    this.getAllAre();
  },
  computed: {
    selectShopList() {
      if (this.$store.state.user.userData.currentCompany != null) {
        return this.$store.state.user.userData.currentCompany.isMaster
          ? true
          : false;
      } else {
        return true;
      }
    },
  },
  methods: {
    selectionChange(row) {
      this.selectItem = row;
    },
    //左侧点击放大
    handleChangeLeft() {
      if (this.leftValue) {
        this.leftValue = !this.leftValue;
        this.split1 = 0.4;
      } else {
        this.split1 = 1;
        this.leftValue = !this.leftValue;
      }
    },

    //右侧点击放大
    handleChangeRight() {
      if (this.rightValue) {
        this.rightValue = !this.rightValue;
        this.split1 = 0.4;
      } else {
        this.split1 = 0;
        this.rightValue = !this.rightValue;
      }
    },

    // 快速查询 未核销对账单
    quickDate(data) {
     // this.accountPage.page=1;
      this.value = data ? data : ["", ""];
      // this.queryNoWrite();
    },
    // 快速查询 本店待认领款
    quickDate2(data) {
      this.value2 = data ? data : ["", ""];
      // this.queryClaimed();
    },
    // 快速查询 连锁待分配款项
    quickDate3(data) {
      this.value3 = data ? data : ["", ""];
      // this.queryDistribution();
    },
    // 选择日期 未核销对账单
    changedate(daterange) {
      this.value = daterange;
      this.queryNoWrite();
    },
    // 选择日期 未核销对账单
    changedate2(daterange) {
      this.value2 = daterange;
      this.queryClaimed();
    },
    // 选择日期 连锁待分配款项
    changedate3(daterange) {
      this.value3 = daterange;
      this.queryDistribution();
    },
    //获取门店
    async getShop(areaId) {
      let data = {};
      data.supplierTypeSecond = areaId;
      this.orgList = [{ id: "", name: "全部", shortName: "全部" }];
      let res = await goshop(data);
      if (res.code === 0) {
        this.orgList = Array.from(new Set([...this.orgList, ...res.data]));
        // this.setAreaDef();
      }
    },
    setAreaDef() {
      if (this.areaList.length > 0) {
        this.areaList.map((item) => {
          this.orgList.map((item2) => {
            if (this.selectShopList) {
              if (
                item.parentId == item2.supplierTypeFirst &&
                item.value == item2.supplierTypeSecond
              ) {
                this.areaId = item.value;
              }
            } else {
              this.areaId = 0;
            }
          });
        });
      }
    },
    // 往来单位选择
    async getOne(query) {
      this.company = [];
      if (query != "") {
        this.remoteloading = true;
        findGuest({ fullName: query, size: 20 }).then((res) => {
          if (res.code === 0) {
            this.company = [];
            res.data.content.map((item) => {
              this.company.push({
                value: item.id,
                label: item.fullName,
              });
            });
            this.remoteloading = false;
          }
        });
      } else {
        this.company = [];
      }
    },
    async getOne2(query) {
      this.company2 = [];
      if (query != "") {
        this.remoteloading2 = true;
        findGuest({ fullName: query, size: 20 }).then((res) => {
          if (res.code === 0) {
            this.company2 = [];
            res.data.content.map((item) => {
              this.company2.push({
                value: item.id,
                label: item.fullName,
              });
            });

            this.remoteloading2 = false;
          }
        });
      } else {
        this.company2 = [];
      }
    },
    //核销对账单
    write() {
      if (Object.keys(this.currentAccount).length === 0)
        return this.$message.error("请选择一条未核销对账单");
      if (this.$refs.claim.currentClaimed.length === 0)
        return this.$message.error("至少选择一条本店待认领款");
      this.$refs.claim.currentClaimed.map((item) => {
        if (item.incomeMoney > 0 && item.paidMoney == 0) {
          item.incomeMoney = item.unClaimedAmt;
          item.paidMoney = "";
        }
        if (Math.abs(item.paidMoney) > 0 && item.incomeMoney <= 0) {
          item.paidMoney = item.unClaimedAmt;
          item.incomeMoney = "";
        }
      });
      if (this.currentAccount.row.actualCollectionOrPayment > 0) {
        this.$refs.claim.currentClaimed.map((item) => {
          if (item.incomeMoney > 0) {
            this.$refs.settlement.Settlement = true;
          } else {
            this.$Message.error("收款类型对账单只能核销收款类资金");
          }
        });
      } else {
        this.$refs.claim.currentClaimed.map((item) => {
          if (item.paidMoney > 0) {
            this.$refs.settlement.Settlement = true;
          } else {
            this.$Message.error("付款类型对账单只能核销支出类资金");
          }
        });
      }
    },

    //打开选择会计科目
    openSubjecMoadl() {
      if (this.$refs.claim.currentClaimed.length == 0) {
        this.$message.error("请先选择数据");
      } else if (this.$refs.claim.currentClaimed.length > 1) {
        this.$message.error("只能为一条数据进行当前转益");
      } else {
        this.claimedSubjectList = this.$refs.claim.currentClaimed;
        this.$refs.subjecModal.open();
      }
    },
    // 打开应收应付弹框
    openAccrued() {
      if (this.$refs.claim.currentClaimed.length == 0) {
        this.$message.error("请先选择数据");
      } else if (this.$refs.claim.currentClaimed.length > 1) {
        this.$message.error("只能为一条数据进行转应收应付操作");
      } else {
        this.claimedSubjectList = this.$refs.claim.currentClaimed;
        if (this.claimedSubjectList[0].incomeMoney > 0) {
          this.$refs.accrued.bool = false;
        } else {
          this.$refs.accrued.bool = true;
        }
        this.claimedSubjectList.map((item) => {
          item.rpAmt = Math.abs(item.paidMoney || item.incomeMoney);
          // item.incomeMoney=item.rpAmt
          item.balanceMoney = Math.abs(item.unClaimedAmt);
        });
        this.$refs.accrued.open();
      }
    },
    // 打开   预收款认领/其他收款认领   弹框
    openOtherCollectionClaims(claimTit) {
      if (this.$refs.claim.currentClaimed.length == 0) {
        this.$message.error("请先选择数据");
      } else if (this.$refs.claim.currentClaimed.length > 1) {
        this.$message.error("只能为一条数据进行转应收应付操作");
      } else {
        this.claimedSubjectList = this.$refs.claim.currentClaimed;
        this.$refs.otherCollectionClaims.claimTit = claimTit;
        if (this.claimedSubjectList[0].incomeMoney > 0) {
          this.claimedSubjectList.map((item) => {
            item.incomeMoney = item.unClaimedAmt;
            if ((claimTit = "预收款认领")) {
              item.rpAmt = Math.abs(item.paidMoney || item.incomeMoney);
              item.balanceMoney = Math.abs(item.unClaimedAmt);
              // item.incomeMoney=item.rpAmt
            } else {
              item.balanceMoney = Math.abs(item.unClaimedAmt);
            }
          });
          this.$refs.otherCollectionClaims.open();
        } else {
          claimTit == "预收款认领"
            ? this.$message.error("预收款认领不能选择支出类资金")
            : this.$message.error("其他收款认领不能选择支出类资金");
        }
      }
    },
    // 打开   预付款认领/其他付款认领   弹框
    openOtherPaymentClaims(claimTit) {
      if (this.$refs.claim.currentClaimed.length == 0) {
        this.$message.error("请先选择数据");
      } else if (this.$refs.claim.currentClaimed.length > 1) {
        this.$message.error("只能为一条数据进行转应收应付操作");
      } else {
        // this.claimedSubjectList.map(item=>{
        //   item.paidMoney=JSON.stringify(item.paidMoney).split("-")[1]
        // })
        this.claimedSubjectList = this.$refs.claim.currentClaimed;
        this.$refs.otherPaymentClaim.claimTit = claimTit;
        if (
          Math.abs(this.claimedSubjectList[0].paidMoney) > 0 ||
          this.claimedSubjectList[0].incomeMoney <= 0
        ) {
          this.claimedSubjectList.map((item) => {
            item.paidMoney = item.unClaimedAmt;
            if ((claimTit = "预付款认领")) {
              item.rpAmt = Math.abs(item.paidMoney || item.incomeMoney);
              // item.incomeMoney=item.rpAmt
            } else {
              item.balanceMoney = Math.abs(item.unClaimedAmt);
            }
          });
          this.$refs.otherPaymentClaim.open();
        } else {
          claimTit == "预付款认领"
            ? this.$message.error("预付款认领不能选择收入类资金")
            : this.$message.error("其他付款认领不能选择收入类资金");
        }
      }
    },
    //未核销对账单查询
    queryNoWrite() {
      this.accountPage.page=1;
      this.noWrite();
    },
    // 本店待认领款查询
    queryClaimed() {
      this.$refs.claim.claimedPage.page = 1;
      this.$refs.claim.currentClaimed = [];
      this.selectItem = [];
      this.claimedList();
    },
    //连锁待分配款项
    queryDistribution() {
      this.distributionPage.page=1;
      this.distributionList();
    },
    //撤销分配
    distributionDelete() {
      if (this.$refs.claim.currentClaimed.length !== 0) {
        this.$Modal.confirm({
          title: "是否撤回分配",
          onOk: () => {
            let arr = [];
            this.$refs.claim.currentClaimed.map((item) => {
              arr.push(item.id);
            });
            this.cancelDis = true;
            distributionRevoke(arr)
              .then((res) => {
                if (res.code === 0) {
                  this.$message.success("撤销成功");
                  this.$refs.claim.currentClaimed = [];
                  this.claimedList();
                  this.distributionList();
                }
                this.cancelDis = false;
              })
              .catch((e) => {
                this.cancelDis = false;
              });
          },
          onCancel: () => {},
        });
      } else {
        this.$message.error("请先选择数据");
      }
    },
    //预收款认领/预收款支出认领
    clim(type) {
      if (
        this.$refs.claim.currentClaimed.length !== 0 &&
        this.$refs.claim.currentClaimed[0].incomeMoney
      ) {
        if (type) {
          this.$refs.chargeAdvance.modal = true;
        } else {
          this.$refs.advance.init();
        }
      } else {
        this.$message.error("至少选择一条数据且是收款数据");
      }
    },
    //预付款认领/预付款收回认领
    expenditureClim(type) {
      if (
        this.$refs.claim.currentClaimed.length !== 0 &&
        this.$refs.claim.currentClaimed[0].paidMoney
      ) {
        if (type) {
          this.title = "预付款收回认领";
        } else {
          this.title = "预付款认领";
        }
        this.$refs.expenditure.modal = true;
      } else {
        this.$message.error("至少选择一条数据且是付款数据");
      }
    },
    //分配至本店
    distributionShop() {
      console.log(this.currentDistribution,'asdf')
      if (this.currentDistribution.length !== 0) {
        let obj = [];
        this.currentDistribution.map((item) => {
          obj.push({ id: item.id });
        });
        this.distributionLoading = true;
        distributionShop(obj)
          .then((res) => {
            if (res.code === 0) {
              this.$message.success("分配成功");
              this.currentDistribution = [];
              this.distributionList();
              this.claimedList();
            }
            this.distributionLoading = false;
          })
          .catch((e) => {
            this.distributionLoading = false;
          });
      } else {
        this.$message.error("请先选择数据");
      }
    },
    //未核销选中的数据
    accountNoWriteChange(currentRow) {
      this.currentAccount = currentRow;
      this.difference =
        Math.abs(currentRow.row.actualCollectionOrPayment) -
        Math.abs(this.claimedAmt);
    },
    //连锁待分配款项选中的数据
    distributionSelection({selection}) {
      this.currentDistribution = selection;
    },
    //未核销对账单导出接口
    leftExport() {
      if (this.accountNoWriteData.length <= 0) {
        return this.$message.warning("暂无数据导出");
      }
      let data = {
        amount: this.amtNo,
        guestId: this.companyIdNo,
        receivePaymentType: this.paymentId,
        orgId: this.model1, //分店名称
        pagesize: this.accountPage.total,
         id: this.$route.params.id,
      };
      let hh = this.$refs.quickDate;
      if (hh.val.length > 0) {
        data.startDate = hh.val[0];
        data.endDate = hh.val[1];
      } else {
        data.startDate = "";
        data.endDate = "";
      }
      let params="";
      for (let d in data) {
        if (!data[d]) {
          delete data[d];
        }
      }
      for (var i in data) {
        params += `${i}=${data[i]}&`;
      }
      
      //this.accountNoWriteLoading=true;
       location.href = getPayablesExportqileft(params)

    },
    //对账单跳转页面后接口
    //未核销对账单查询接口
    paramsNoWrite() {
      let obj = {
        amount: this.amtNo,
        guestId: this.companyIdNo,
        receivePaymentType: this.paymentId,
        page: this.accountPage.page - 1,
        size: this.accountPage.size,
        orgId: this.model1, //分店名称
        id: this.$route.params.id,
        startDate: "",
        endDate: "", //结束时间参数
        // createTime:this.applyDate //日期查询时间发生日期
      };
      this.accountNoWriteLoading = true;
      accountNoSelete(obj)
        .then((res) => {
          if (res.code === 0) {
            this.accountNoWriteData = res.data.content;
            this.accountPage.total = res.data.totalElements;
          }
          this.accountNoWriteLoading = false;
        })
        .catch((err) => {
          this.accountNoWriteLoading = false;
        });
    },
    //未核销对账单查询接口
    noWrite() {
      let obj = {
        amount: this.amtNo,
        guestId: this.companyIdNo,
        receivePaymentType: this.paymentId,
        page: this.accountPage.page - 1,
        size: this.accountPage.size,
        orgId: this.model1, //分店名称
        startDate: this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD") + " 00:00:00"
          : "", //开始时间参数
        endDate: this.value[1]
          ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
          : "", //结束时间参数
        // createTime:this.applyDate //日期查询时间发生日期
      };
      this.accountNoWriteLoading = true;
      accountNoSelete(obj)
        .then((res) => {
          if (res.code === 0) {
            this.accountNoWriteData = res.data.content;
            this.accountPage.total = res.data.totalElements;
          }
          this.accountNoWriteLoading = false
        }).catch(err => {
          this.accountNoWriteLoading = false;
        })
      },
      //本店待认领款查询接口
      claimedList() {
        let obj = {
          amount: this.amtClaim,
          suppliers: this.companyIdClaim,
          reciprocalAccountName: this.bankNameOClaim,
          page: this.$refs.claim.claimedPage.page - 1,
          size: this.$refs.claim.claimedPage.size,
          claimShopCode: this.$store.state.user.userData.currentCompany ? this.$store.state.user.userData.currentCompany.code ? this.$store.state.user.userData.currentCompany.code : '' : '',
          orgId: this.model2,//分店
          startDate: this.value2[0]
            ? moment(this.value2[0]).format("YYYY-MM-DD") + " 00:00:00"
            : "",    //开始时间参数
          endDate: this.value2[1]
            ? moment(this.value2[1]).format("YYYY-MM-DD") + " 23:59:59"
            : "",     //结束时间参数
          businessType: this.businessType || ""
          // createTime:this.applyDate2 //日期查询时间发生日期
        };
        claimedFund(obj).then(res => {
          if (res.code === 0) {
            this.$refs.claim.claimedData = res.data.content;
            this.$refs.claim.claimedPage.total = res.data.totalElements;
          }
        });
    },
    //本店待认领款导出接口
    rightone(){
      if (this.$refs.claim.claimedData.length <= 0) {
        return this.$message.warning("暂无数据导出");
      }
        let data = {
        amount: this.amtClaim,
        suppliers: this.companyIdClaim,
        reciprocalAccountName: this.bankNameOClaim,
        claimShopCode: this.$store.state.user.userData.currentCompany
          ? this.$store.state.user.userData.currentCompany.code
            ? this.$store.state.user.userData.currentCompany.code
            : ""
          : "",
        orgId: this.model2, //分店
        pagesize:this.$refs.claim.claimedPage.total,
        startDate: this.value2[0]
          ? moment(this.value2[0]).format("YYYY-MM-DD") + " 00:00:00"
          : "", //开始时间参数
        endDate: this.value2[1]
          ? moment(this.value2[1]).format("YYYY-MM-DD") + " 23:59:59"
          : "", //结束时间参数
        businessType: this.businessType || "",
        // createTime:this.applyDate2 //日期查询时间发生日期
      };
      let params="";
      for (let d in data) {
        if (!data[d]) {
          delete data[d];
        }
      }
      for (var i in data) {
        params += `${i}=${data[i]}&`;
      }
      location.href =getPayablesExportqirightone(params)
    },
    //本店待认领款查询接口
    claimedList() {
      let obj = {
        amount: this.amtClaim,
        suppliers: this.companyIdClaim,
        reciprocalAccountName: this.bankNameOClaim,
        page: this.$refs.claim.claimedPage.page - 1,
        size: this.$refs.claim.claimedPage.size,
        claimShopCode: this.$store.state.user.userData.currentCompany
          ? this.$store.state.user.userData.currentCompany.code
            ? this.$store.state.user.userData.currentCompany.code
            : ""
          : "",
        orgId: this.model2, //分店
        startDate: this.value2[0]
          ? moment(this.value2[0]).format("YYYY-MM-DD") + " 00:00:00"
          : "", //开始时间参数
        endDate: this.value2[1]
          ? moment(this.value2[1]).format("YYYY-MM-DD") + " 23:59:59"
          : "", //结束时间参数
        businessType: this.businessType || "",
        // createTime:this.applyDate2 //日期查询时间发生日期
      };
      claimedFund(obj).then((res) => {
        if (res.code === 0) {
          this.$refs.claim.claimedData = res.data.content;
          this.$refs.claim.claimedPage.total = res.data.totalElements;
        }
      });
    },
    //连锁待分配款项导出接口
    rightTwoExport(){
      if (this.distributionData.length <= 0) {
        return this.$message.warning("暂无数据导出");
      }
        let data = {
        area: this.areaId,
        orgId: this.orgId,
        amount: this.amtDis,
        reciprocalAccountName: this.bankNameODis,
        startDate: this.value3[0]
          ? moment(this.value3[0]).format("YYYY-MM-DD") + " 00:00:00"
          : "", //开始时间参数
        endDate: this.value3[1]
          ? moment(this.value3[1]).format("YYYY-MM-DD") + " 23:59:59"
          : "", //结束时间参数
        // createTime:this.applyDate3 //日期查询时间发生日期
      };
      data.pagesize=this.distributionPage.total
      let params="";
      for (let d in data) {
        if (!data[d]) {
          delete data[d];
        }
      }
      for (var i in data) {
        params += `${i}=${data[i]}&`;
      }
      location.href = getPayablesExportqirighttwo(params)
    },
    //连锁待分配款项查询接口
    distributionList() {
      let obj = {
        area: this.areaId,
        orgId: this.orgId,
        amount: this.amtDis,
        reciprocalAccountName: this.bankNameODis,
        page: this.distributionPage.page - 1,
        size: this.distributionPage.size,

        startDate: this.value3[0]
          ? moment(this.value3[0]).format("YYYY-MM-DD") + " 00:00:00"
          : "", //开始时间参数
        endDate: this.value3[1]
          ? moment(this.value3[1]).format("YYYY-MM-DD") + " 23:59:59"
          : "", //结束时间参数
        // createTime:this.applyDate3 //日期查询时间发生日期
      };
      distributionSelete(obj).then((res) => {
        if (res.code === 0) {
          this.distributionData = res.data.content;
          this.distributionPage.total = res.data.totalElements;
        }
      });
    },
    //获取全部地址
    async getAllAre() {
      let res = await are();
      if (res.code === 0) {
        res.data.map((item) => {
          this.areaList.push({
            value: item.id,
            label: item.companyName,
            parentId: item.parentId,
          });
        });
      }
    },
    //未核销对账单页码改变
    pageChangeNo(val) {
      this.accountPage.page = val;
      this.noWrite();
    },
    //未核销对账单每页条数改变
    sizeChangeNo(val) {
      this.accountPage.page = 1;
      this.accountPage.size = val;
      this.noWrite();
    },
    // 连锁待分配款项页码
    pageChange(val) {
      this.distributionPage.page = val;
      this.distributionList();
    },
    // 连锁待分配款项每页条数
    sizeChange(val) {
      this.distributionPage.page = 1;
      this.distributionPage.size = val;
      this.distributionList();
    },
  },
};
</script>
<style scoped lang="less">
.top-pane,
.bottom-pane {
  overflow: auto;
}
.card {
  padding-left: 10px;
}
.headerTitlefen {
  padding-left: 10px;
  width: 100%;
  height: 46px;
  position: relative;
  .headerbox {
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    box-sizing: border-box;
    span {
      display: inline-block;
      line-height: 30px;
    }
  }
  .db {
    border: 1px #ddd solid;
    border-left: none;
  }
  .title {
    width: 100px;
    text-align: center;
    border-right: 1px #ddd solid;
    border-left: 1px #ddd solid;
  }
}
</style>
