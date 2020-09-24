<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <quickDate ref="quickDate" @quickDate="quickDate"></quickDate>
          </div>
          <div class="db ml10">
            <Date-picker
              format="yyyy-MM-dd "
              :value="value"
              @on-change="changedate"
              type="daterange"
              placeholder="选择日期"
              class="w200"
            ></Date-picker>
          </div>
          <div class="db ml10">
            <span>申请状态：</span>
            <Select
              v-model="Reconciliationtype"
              class="w120"
              placeholder="全部"
              @on-change="SelectChange"
            >
              <Option
                v-for="item in Reconciliationlist"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db ml10">
            <span>申请类型：</span>
            <Select
              v-model="ApplicationType"
              class="w120"
              placeholder="全部"
              @on-change="SelectChange"
            >
              <Option
                v-for="item in ApplicationTypelist"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db ml10" v-if="headquarters == 0">
            <span>门店：</span>
            <Select v-model="shopCode" class="w150" filterable clearable @on-change="SelectChange">
              <Option v-for="item in shopListArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db ml10">
            <Select v-model="searchType" class="w100 mr5" @on-change="changeSelect">
              <Option
                v-for="item in searchTypeArr"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
            <Input
              type="text"
              v-model="searchTypeValue"
              style="width: 200px"
              :placeholder="placeholderValue"
            />
          </div>
          <div class="db ml15">
            <button class="ivu-btn ivu-btn-default mr10" type="button" @click="query">
              <i class="iconfont iconchaxunicon mr5"></i>
              <span>查询</span>
            </button>
            <button class="ivu-btn ivu-btn-default" type="button" @click="deleteFun">
              <span>删除</span>
            </button>
          </div>
          <div class="db ml15">
            <el-checkbox v-model="apply" >我的申请</el-checkbox>
          </div>
          <div class="db ml15">
            <el-checkbox v-model="approve">经我审批</el-checkbox>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <vxe-table
        border
        resizable
        ref="xTable"
        stripe
        size="mini"
        align="center"
        :auto-resize="true"
        highlight-hover-row
        highlight-current-row
        :height="500"
        show-overflow
        @current-change="currentChangeEvent"
        :data="tableData"
        :checkbox-config="{strict: true, checkMethod: checCheckboxkMethod}"
        @checkbox-all="selectDataFun"
        @checkbox-change="selectDataFun"
      >
        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
        <vxe-table-column title="操作">
          <template v-slot="{ row }">
            <template>
              <!--<vxe-button @click="redact(row)">编辑</vxe-button>-->
              <!--<a @click="redact(row)" class="mr10">编 辑</a>-->
              <a @click="lookOver(row)">查 看</a>
              <!--<vxe-button @click="remove(row)">删除</vxe-button>-->
            </template>
          </template>
        </vxe-table-column>
        <vxe-table-column field="billStatusName" title="当前状态"></vxe-table-column>
        <vxe-table-column field="applyNo" title="申请单号"></vxe-table-column>
        <vxe-table-column field="applyTime" title="申请日期"></vxe-table-column>
        <vxe-table-column field="applicant" title="申请人"></vxe-table-column>
        <vxe-table-column field="applyTypeName" title="申请类型"></vxe-table-column>
        <vxe-table-column field="topic" title="主题"></vxe-table-column>
        <vxe-table-column field="amtTotal" title="总金额">
          <template v-slot="{row}">
            {{row.amtTotal||0}}
          </template>
        </vxe-table-column>
        <vxe-table-column field="orgName" title="门店"></vxe-table-column>
      </vxe-table>
      <Page
        :current="page.num"
        :total="page.total"
        :page-size="page.size"
        :page-size-opts="page.opts"
        @on-change="changePage"
        @on-page-size-change="changeSize"
        class="mt10 tr"
        show-elevator
        show-sizer
        show-total
      ></Page>
      <div class="db mt10" v-if="falg">
        <h4 class="p10 mb10" style="background-color:#f8f8f8">审批进度</h4>
        <section class="data-container">
          <div class="modal-data">
            <span class="data-name">流程节点:</span>
            <div class="data-value flex-center">
              <template v-for="(item,i) in statusData">
                <div class="status-box flex-center" :key="i">
                  <span class="status">{{item.userName}}</span>
                  <span class="arrow-box" v-if="i<statusData.length-1"></span>
                  <!--<span-->
                  <!--class="words"-->
                  <!--:class="{res:item.operationResult=='REFUSE'}"-->
                  <!--&gt;{{item.operationResult|status}}</span>-->
                </div>
              </template>
            </div>
          </div>
          <div class="modal-data">
            <span class="data-name">审批状态:</span>
            <div class="data-value flex-center">
              <template v-for="(item,i) in statusData">
                <div class="status-box flex-center" :key="i">
                  <span
                    class="words"
                    :class="{res:item.operationResult == 'REFUSE'}"
                  >{{item.operationResult|status}}</span>
                </div>
              </template>
            </div>
          </div>
          <div class="modal-data">
            <span class="data-name">审批意见:</span>
            <div class="data-value flex-center">
              <template v-for="(item,i) in statusData">
                <div class="status-box flex-center" :key="i">
                  <span class="remark">{{item.remark}}</span>
                </div>
              </template>
            </div>
          </div>
          <div class="modal-data">
            <span class="data-name">审批日期:</span>
            <div class="data-value flex-center">
              <template v-for="(item,i) in statusData">
                <div class="status-box flex-center" :key="i">
                  <span class="date">{{item.date}}</span>
                </div>
              </template>
            </div>
          </div>
        </section>
      </div>
    </section>

    <!--<approval :approvalTit="approvalTit"></approval>-->
    <!--      对应各个模态框-->
    <!--      费用报销报销-->
    <ExpenseReimbursement ref="ExpenseReimbursement" :list="modelType" @updateD="query"></ExpenseReimbursement>
    <!--      其他付款申请-->
    <OtherPayment ref="OtherPayment" :list="modelType" @updateD="query"></OtherPayment>
    <!--      应公借支申请-->
    <PublicRequest ref="PublicRequest" :list="modelType" @updateD="query"></PublicRequest>
    <!--      请示单申请-->
    <AskForInstrucions ref="AskForInstrucions" :list="modelType" @updateD="query"></AskForInstrucions>
    <!--      预收款支出申请-->
    <CreditSpending ref="CreditSpending" :list="modelType" @updateD="query"></CreditSpending>
    <!--      预付款申请-->
    <AdvanceApply ref="AdvanceApply" :list="modelType" @updateD="query"></AdvanceApply>
    <!--      内部资金调拨-->
    <InternalFinance ref="InternalFinance" :list="modelType" @updateD="query"></InternalFinance>
    <!--      发票对冲申请-->
    <invoice-offset-request ref="invoiceOffsetRequest" :modelType="modelType"></invoice-offset-request>
    <!--      销售开票-->
    <sales-invoice-application ref="salesInvoiceApplication" :modelType="modelType"></sales-invoice-application>
    <!--      不含税开票-->
    <tax-exclusive-application ref="taxExclusiveApplication" :modelType="modelType"></tax-exclusive-application>
    <!--对账单申请-->
    <statement-application ref="statementApplication" :modelType="modelType" @updateD="query"></statement-application>
    <!--其他查看-->
    <view-other-model ref="viewOtherModel" :main-store="mainStore" :bill-type-arr="settleTypeList"></view-other-model>
    <!--客户信用调查-->
    <apply-model-view ref="clientApply" :bill-type-arr="settleTypeList"></apply-model-view>
    <!--客户信用额度-->
    <quota-apply-model ref="quotaApply" :bill-type-arr="settleTypeList"></quota-apply-model>
    <!--配件审核-->
    <part-info ref="partInfo"></part-info>
    <!--供应商申请-->
    <view-suppler-model ref="suppler"></view-suppler-model>
  </div>
</template>

<script>
import moment from "moment";
import quickDate from "@/components/getDate/dateget_noEmit.vue";
import approval from "@/view/settlementManagement/bill/Popup/approval";
import { goshop } from "@/api/settlementManagement/fundsManagement/capitalChain";
import { approvalStatus } from "_api/base/user";

import ExpenseReimbursement from "../component/ExpenseReimbursement";
import OtherPayment from "../component/OtherPayment";
import PublicRequest from "../component/PublicRequest";
import AskForInstrucions from "../component/AskForInstructions";
import CreditSpending from "../component/CreditSpending";
import AdvanceApply from "../component/AdvanceApply";
import InternalFinance from "../component/InternalFinance";
import invoiceOffsetRequest from "../component/popWindow/invoiceOffsetRequest";
import salesInvoiceApplication from "../component/popWindow/salesInvoiceApplication";
import taxExclusiveApplication from "../component/popWindow/taxExclusiveApplication";
import statementApplication from "../component/popWindow/statementApplication";

import {
  findPageByDynamicQuery,
  findUserShopKeeper,
  findByStore,
  getBillType
} from "@/api/documentApproval/documentApproval/documentApproval";
import { getComenAndGo, getAllSalesList, getPayList } from "../component/utils";
import ViewOtherModel from "../component/viewOtherModel";
import { getDigitalDictionary,deleteBatch } from "../../../api/system/essentialData/clientManagement";
import ApplyModelView from "../component/viewApplyModel";
import QuotaApplyModel from "../component/quotaApplyModel";
import PartInfo from "../component/partInfo/partInfo";
import ViewSupplerModel from "../component/viewSupplerModel";

export default {
  name: "myApplication",
  components: {
    ViewSupplerModel,
    PartInfo,
    QuotaApplyModel,
    ApplyModelView,
    ViewOtherModel,
    quickDate,
    approval,
    //11种类型
    ExpenseReimbursement,
    OtherPayment,
    PublicRequest,
    AskForInstrucions,
    CreditSpending,
    AdvanceApply,
    InternalFinance,
    invoiceOffsetRequest,
    salesInvoiceApplication,
    taxExclusiveApplication,
    statementApplication
  },
  data() {
    return {
      value: [], //日期控件的数组
      Reconciliationtype: "1", //申请状态
      Reconciliationlist: [
        {
          value: "99",
          label: "全部"
        },
        {
          value: "0",
          label: "草稿"
        },
        {
          value: "1",
          label: "审批中"
        },
        {
          value: "2",
          label: "审批通过"
        },
        {
          value: "3",
          label: "审批不通过"
        }
      ], //申请状态数组
      ApplicationType: "99", //申请类型
      ApplicationTypelist: [
        {
          value: "99",
          label: "全部"
        },
        {
          value: "0",
          label: "费用报销"
        },
        {
          value: "1",
          label: "预收款支出"
        },
        {
          value: "2",
          label: "请示单申请"
        },
        {
          value: "3",
          label: "采购预付款"
        },
        {
          value: "4",
          label: "因公借支"
        },
        {
          value: "5",
          label: "内部资金调拨"
        },
        {
          value: "6",
          label: "其他付款"
        },
        {
          value: "7",
          label: "对账单"
        },
        {
          value: "8",
          label: "销售开票"
        },
        {
          value: "9",
          label: "不含税开票"
        },
        {
          value: "10",
          label: "发票对冲"
        },
        {
          value: "11",
          label: "采购计划单"
        },
        {
          value: "12",
          label: "临时采购订单"
        },
        {
          value: "13",
          label: "门店外采订单"
        },
        {
          value: "14",
          label: "盘亏出库"
        },
        {
          value: "15",
          label: "盘盈入库"
        },
        {
          value: "16",
          label: "客户信用调查"
        },
        {
          value: "17",
          label: "客户信用额度"
        },
        {
          value: "20",
          label: "配件资料"
        }
      ], //申请类型数组
      tableData: [], //表格内容
      falg: false, //判断审批进度是否显示
      statusData: [], //进度数据
      approvalTit: "流程节点", //审批流程
      page: {
        num: 1,
        size: 10,
        total: 0,
        opts: [10, 20, 50, 100, 200]
      }, //分页
      searchTypeArr: [
        {
          value: "0",
          label: "申请单号"
        },
        {
          value: "1",
          label: "申请人"
        },
        {
          value: "2",
          label: "审批人"
        }
      ], //申请类型数组
      searchType: "0", //申请类型
      searchTypeValue: "", //申请类型的值
      placeholderValue: "请输入申请单号", //动态改变placeholder
      shopCode: 0, //门店
      shopListArr: [{ id: 0, name: "全部" }], //门店数组
      //打开模态框状态 type 1 新增 2修改 3查看 4审核
      modelType: {
        type: 1,
        id: ""
      },
      headquarters: 2,
      apply: false,
      approve: false,
      mainStore: [], //仓库数据
      settleTypeList: {}, //票据类型
      selectTableList:[],
    };
  },
  async mounted() {
    // this.$refs.partInfo.init();
    this.getShop();
    // console.log(this.$store.state.user.userData)
    this.$refs.salesInvoiceApplication.$refs.salepopup.modal1 = false;
    this.$refs.invoiceOffsetRequest.$refs.hedgingInvoice.modal1 = false;
    this.$refs.taxExclusiveApplication.$refs.noTax.modal1 = false;
    this.modelType.allSalesList = await getAllSalesList();
    this.modelType.salesList = await getComenAndGo();
    this.modelType.payList = await getPayList();
    if (this.$route.query.applyNo !== undefined) {
      this.searchTypeValue = this.$route.query.applyNo;
      this.getList();
    }else{
      this.$nextTick(()=>{
        this.$refs.quickDate.searchQuick = "5";
        this.$refs.quickDate.getval(5);
      })
    }
    this.getUser();
    this.getStroe();
    this.getType();
  },
  methods: {
    // 快速查询日期
    quickDate(data) {
      this.value = data;
      let obj = {
        startDate: this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endDate: this.value[1]
          ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        orgId: this.model1,
        statementStatus: this.Reconciliationtype
      };
      // this.getAccountStatement(obj);
      this.getList();
    },
    // 选择日期
    changedate(daterange) {
      this.value = daterange;
    },
    // 查询按钮
    query() {
      this.getList();
    },
    //获取仓库
    async getStroe() {
      let rep = await findByStore();
      if (rep.code == 0) {
        this.mainStore = rep.data || [];
      }
    },
    async getType() {
      let data = {};
      //107票据类型`
      //106结算方式
      data = ["CS00106", "CS00107", "CS00118", "CS00117", "CS00112"];
      let res = await getDigitalDictionary(data);
      if (res.code == 0) {
        this.settleTypeList = res.data;
      }
    },

    //初始化数据
    async getList() {
      let params = {};
      params.page = this.page.num - 1;
      params.size = this.page.size;
      if (this.value.length != 0) {
        params.startTime = this.value[0]? moment(this.value[0])
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss"):"";
        params.endTime = this.value[1]?moment(this.value[1])
          .endOf("day")
          .format("YYYY-MM-DD HH:mm:ss"):"";
      }
      params.billStatus = this.Reconciliationtype;
      params.applyType = this.ApplicationType;
      params.orgid = this.shopCode;
      this.apply ? params.applicant = this.$store.state.user.userData.staffName : params
      this.approve ? params.approveUname = this.$store.state.user.userData.staffName : params
      switch (this.searchType) {
        case "0":
          params.applyNo = this.searchTypeValue!=""?this.searchTypeValue.trim():"";
          break;
        case "1":
          params.applicant = this.searchTypeValue!=""?this.searchTypeValue.trim():"";
          break;
        case "2":
          params.approveUname = this.searchTypeValue!=""?this.searchTypeValue.trim():"";
          break;
      }
      //清空复选框选中数据
      this.selectTableList = [];
      let res = await findPageByDynamicQuery(params);
      if (res.code === 0) {
        this.tableData = res.data.content;
        this.page.total = res.data.totalElements;
      }
    },

    //起草申请
    TheApplication() {
      this.$router.push({ name: "documentApproval-draftingOfApplication" });
    },

    //编辑
    redact(row) {
      // console.log(row.applyTypeName);
    },

    //下拉框改变
    SelectChange() {
      this.page.num = 1;
      this.getList();
    },

    //获取门店
    async getShop() {
      let data = {};
      data.supplierTypeSecond = 0;
      // this.shopListArr = [{id:0 , name:'全部'}]
      let res = await goshop(data);
      if (res.code === 0) {
        this.shopListArr = [...this.shopListArr, ...res.data];
        // if (this.$store.state.user.userData.shopkeeper != 0) {
        //   this.getThisArea(); //获取当前门店地址
        // }
      }
    },

    //查看
    lookOver(row) {
      if (row.billStatus == 0 || row.billStatus == 3) {
        this.modelType.type = 2;
        this.modelType.id = row.id;
      } else {
        this.modelType.type = 3;
        this.modelType.id = row.id;
      }
      switch (row.applyTypeName) {
        case "费用报销":
          this.$refs.ExpenseReimbursement.open();
          break;
        case "预收款支出":
          this.$refs.CreditSpending.open();
          break;
        case "请示申请":
          this.$refs.AskForInstrucions.open();
          break;
        case "采购预付款":
          this.$refs.AdvanceApply.open();
          // this.$refs.AdvanceApply.formInline.receiveGuestId
          break;
        case "因公借支":
          this.$refs.PublicRequest.open();
          break;
        case "内部资金调拨":
          this.$refs.InternalFinance.open();
          break;
        case "其他付款":
          this.$refs.OtherPayment.open();
          break;
        case "对账单":
          this.$refs.statementApplication.init();
          break;
        case "销售开票":
          this.$refs.salesInvoiceApplication.$refs.salepopup.modal1 = true;
          break;
        case "不含税开票":
          this.$refs.taxExclusiveApplication.$refs.noTax.modal1 = true;
          break;
        case "发票对冲":
          this.$refs.invoiceOffsetRequest.$refs.hedgingInvoice.modal1 = true;
          break;
        case "客户信用调查":
          this.$refs.clientApply.init(row);
          break;
        case "客户信用额度":
          this.$refs.quotaApply.init(row);
          break;
        case "盘亏出库":
        case "盘盈入库":
        case "采购计划单":
        case "临时采购订单":
        case "门店外采订单":
        case "活动申请":
          this.$refs.viewOtherModel.init(row);
          break;
        case "配件资料审批申请":
          this.$refs.partInfo.getPartDetail(row);
          break;
        case "供应商资料审批申请":
          this.$refs.suppler.init(row);
          break;
      }
    },

    //删除
    remove(row) {},

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

    //根据类型select改变事件
    changeSelect(val) {
      switch (val) {
        case "0":
          this.placeholderValue = "请输入申请单号";
          break;
        case "1":
          this.placeholderValue = "请输入申请人";
          break;
        case "2":
          this.placeholderValue = "请输入审批人";
          break;
      }
    },

    //点击主列表本行数据
    currentChangeEvent({ row }) {
      // console.log(row.processInstance)
      if (row.processInstance) {
        approvalStatus({ instanceId: row.processInstance }).then(res => {
          if (res.code == 0) {
            this.falg = true;
            this.statusData = res.data.operationRecords;
          } else {
            this.statusData = [];
          }
        });
      } else {
        this.falg = false;
        this.statusData = [];
      }
    },

    //获取是否为总部接口
    getUser() {
      let params = {};
      findUserShopKeeper(params).then(res => {
        if (res.code === 0) {
          this.headquarters = res.data.shopkeeperUser;
        }
      });
    },
    checCheckboxkMethod({ row }){
      return row.billStatusName=="草稿" || row.billStatusName=="审批不通过";
    },
    selectDataFun({selection}){
      this.selectTableList = selection;
    },
    async deleteFun(){
      if(this.selectTableList.length==0){
        return this.$Message.error("请选择要删除的数据");
      }
      let reqIds = this.selectTableList.filter(item => item.id).map(item => item.id);
      let rep = await deleteBatch({ids:reqIds});
      if(rep.code==0){
        this.$Message.success("删除成功");
        this.getList();
      }
    }
  },
  filters: {
    date(value = 0) {
      let date = new Date(value).toLocaleDateString();
      let time = new Date(value).toLocaleTimeString();
      value = date.split("/").join("-") + " " + time.substr(2);
      return value;
    },
    status(value = "") {
      value = value.toLowerCase();
      switch (value) {
        case "none":
          value = "已提交";
          break;
        case "agree":
          value = "已同意";
          break;
        case "refuse":
          value = "已拒绝";
          break;
        case "redirected":
          value = "已转交";
          break;
      }
      return value;
    }
  }
};
</script>

<style lang="less" scoped>
.pro span {
  display: inline-block;
  width: 100px;
  text-align: right;
}
.pro i {
  font-style: normal;
}
.pro input {
  border: 1px solid #dddddd;
  height: 28px;
}
.settlement {
  border: 1px solid #dddddd;
}
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.zZindex {
  z-index: 3000 !important;
}
.data-container {
  padding: 20px 10px;
  .modal-data {
    height: 34px;
    margin-bottom: 20px;
    line-height: 34px;
    .data-name {
      width: 70px;
      margin-right: 40px;
      float: left;
    }
    .data-value {
      float: left;
    }
  }
  .status-box {
    .status {
      width: 120px;
      height: 32px;
      border: 1px solid #0099ff;
      border-radius: 4px;
      line-height: 32px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .words {
      width: 120px;
      color: #00cc66;
      text-align: center;
      margin-left: 70px;
    }
    .date {
      width: 120px;
      text-align: center;
      margin-left: 70px;
      font-size: 12px;
    }
    .remark {
      width: 120px;
      text-align: center;
      margin-left: 70px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
    }
    &:first-child {
      .words {
        margin-left: 0;
      }
      .date {
        margin-left: 0;
      }
      .remark {
        margin-left: 0;
      }
    }
  }
  .arrow-box {
    width: 60px;
    height: 2px;
    position: relative;
    margin: 0 7px 4px 3px;
    background-color: #0099ff;
    &:after {
      content: "";
      width: 0;
      height: 0;
      border-right: 5px solid transparent;
      border-left: 5px solid #0099ff;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      position: absolute;
      top: -4px;
      right: -10px;
    }
  }
}
.res {
  color: #ff3600 !important;
}
.hide1 {
  overflow-x: auto;
}
.flexone {
  display: flex;
  justify-content: right;
}
.aBlue {
  color: #2d8cf0 !important;
}
</style>

