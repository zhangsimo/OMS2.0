<template>
  <div class="content-oper content-oper-flex loadingClass">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <quickDate class="mr10" ref="quickDate" @quickDate="quickDate"></quickDate>
          </div>
          <div class="db ml20">
            <span>查询日期：</span>
            <Date-picker
              format="yyyy-MM-dd"
              :value="value"
              type="daterange"
              placeholder="选择日期"
              class="w200"
              @on-change="changedate"
            ></Date-picker>
          </div>
          <div class="db ml20">
            <span>分店名称：</span>
            <Select v-model="BranchstoreId" class="w150" filterable clearable @on-change="query" :disabled="selectShopList">
              <Option v-for="item in Branchstore" :value="item.id" :key="item.id">{{ item.shortName }}</Option>
            </Select>
          </div>
          <div class="db ml20">
            <span>往来单位：</span>
            <!-- <Select
              v-model="companyId"
              class="w150"
              clearable
              filterable
              remote
              :loading="remoteloading"
              :remote-method="getOne"
              @on-change="query"
            >
              <Option v-for="item in company" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select> -->
            <Input type="text" class="h30 w200 mr10" v-model="companyId" />
          </div>
          <div class="db ml5">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="query">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
        </div>
      </div>
      <div class="mt10 mb10">
        <Button class="ml10" @click="claimCollect(1)" v-has="'claim'">预收款认领</Button>
        <Button
          class="ml10"
          @click="collectWirte"
          :disabled="currRow.remainingAmt <= 0"
          v-has="'cancel'"
        >预收款核销</Button>
        <Button
          v-has="'expend'"
          class="ml10"
          @click="collectWPay"
          :disabled="Boolean(currRow.expenditureNo)"
        >预收款支出</Button>
        <Button v-has="'expendCancel'" class="ml10" @click="claimCollect(2)">预收款支出认领</Button>
        <Button
          v-has="'revoke'"
          class="ml10"
          @click="revokeCollection(0)"
          :disabled="currRow.writeOffReceiptNo!=null || currRow.expenditureNo!=null"
        >预收款撤回</Button>
        <Button
          class="ml10"
          @click="revokeCollection(1)"
          :disabled="!currRow.writeOffReceiptNo"
          v-has="'backout'"
        >预收款核销撤回</Button>
        <Button
          v-has="'claimBackout'"
          class="ml10"
          @click="revokeCollection(2)"
          :disabled="!currRow.expenditureNo"
        >预收款支出撤回</Button>
        <Button v-has="'export'" class="ml10" @click="exportTable">导出</Button>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <div class="box mb10">
          <vxe-table
            auto-resize
            resizable
            show-overflow
            border
            max-height="400"
            :data="tableData"
            align="center"
            highlight-current-row
            @current-change="currentChangeEvent"
          >
            <vxe-table-column title="基本信息" fixed="left">
              <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
              <vxe-table-column field="serviceId" width="100" title="预收款单号"></vxe-table-column>
              <vxe-table-column field="guestName" width="100" title="往来单位"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="金额信息">
              <vxe-table-column field="claimAmt" width="120" title="预收款认领金额"></vxe-table-column>
              <vxe-table-column field="writeOffReceiptNo" width="140" title="预收款核销单号"></vxe-table-column>
              <vxe-table-column field="writeOffAmt" width="140" title="预收款核销金额"></vxe-table-column>
              <vxe-table-column field="expenditureNo" width="140" title="预收款支出单号"></vxe-table-column>
              <vxe-table-column field="expenditureAmt" width="140" title="预收款支出金额"></vxe-table-column>
              <vxe-table-column field="expenditureClaimAmt" width="160" title="预收款支出已认领金额"></vxe-table-column>
              <vxe-table-column field="remainingAmt" width="120" title="预收款余额"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="收款方式">
              <vxe-table-column field="role" title="账户" width="90">
                <template v-slot="{ row }">
                  <ul class="list">
                    <li v-for="(item, index) of row.receiveType" :key="index" class="flex">
                      <span class="listChild">{{ item.accountName }}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="sex" title="金额" width="70">
                <template v-slot="{ row }">
                  <ul class="list">
                    <li v-for="(item, index) of row.receiveType" :key="index" class="flex">
                      <span class="listChild">{{ item.amt }}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="age" title="收款所属门店" width="140">
                <template v-slot="{ row }">
                  <ul class="list">
                    <li v-for="(item, index) of row.receiveType" :key="index" class="flex">
                      <span class="listChild">{{ item.ownStoreName }}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="付款方式">
              <vxe-table-column field="role" title="账户" width="90">
                <template v-slot="{ row }">
                  <ul class="list">
                    <li v-for="(item, index) of row.paymentType" :key="index" class="flex">
                      <span class="listChild">{{ item.accountName }}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="sex" title="金额" width="90">
                <template v-slot="{ row }">
                  <ul class="list">
                    <li v-for="(item, index) of row.paymentType" :key="index" class="flex">
                      <span class="listChild">{{ item.amt }}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="age" title="付款所属门店" width="140">
                <template v-slot="{ row }">
                  <ul class="list">
                    <li v-for="(item, index) of row.paymentType" :key="index" class="flex">
                      <span class="listChild">{{ item.ownStoreName }}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="其他信息">
              <vxe-table-column field="receiver" title="收款人" width="90"></vxe-table-column>
              <vxe-table-column field="receiveDate" title="收款日期" width="120"></vxe-table-column>
              <vxe-table-column field="receiveRemark" title="收款备注" width="120"></vxe-table-column>
              <vxe-table-column field="receiveAuditor" title="收款审核人" width="140"></vxe-table-column>
              <vxe-table-column field="receiveAuditDate" title="收款审核日期" width="160"></vxe-table-column>
              <vxe-table-column field="payer" title="付款人" width="100"></vxe-table-column>
              <vxe-table-column field="paymentDate" title="付款日期" width="120"></vxe-table-column>
              <!--              <vxe-table-column field="paymentRemark" title="付款备注"></vxe-table-column>-->
              <vxe-table-column field="paymentAuditor" title="付款审核人" width="140"></vxe-table-column>
              <vxe-table-column field="paymentAuditDate" title="付款审核日期" width="160"></vxe-table-column>
            </vxe-table-column>
          </vxe-table>
          <div class="clearfix">
            <Page
              class-name="fr mb10 mt10"
              size="small"
              :current="page.num"
              :total="page.total"
              :page-size="page.size"
              @on-change="changePage"
              @on-page-size-change="changeSize"
              show-sizer
              show-total
            ></Page>
          </div>
        </div>
        <Button>收付款单记录</Button>
        <Record ref="Record" :serviceId="serviceId" />
      </div>
    </section>
    <!-- 认领弹框 -->
    <!-- <Modal v-model="claimModal" :title="claimTit" width="800" @on-visible-change="visChangeClaim">
      <span>往来单位：</span>
      <Select
        v-model="companyId"
        class="w150"
        filterable
        remote
        :loading="remoteloading"
        :remote-method="getOne"
        @on-change="queryClaimed"
      >
        <Option v-for="item in company" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <span class="ml10">金额：</span>
      <InputNumber v-model="amt" class="w50" />
      <span class="ml10">对方户名：</span>
      <Input v-model="bankNameO" class="w100" />
      <button class="ivu-btn ivu-btn-default ml10" type="button" @click="queryClaimed">
        <i class="iconfont iconchaxunicon"></i>
        <span>查询</span>
      </button>
      <Button class="ml10" v-if="claimTit == '预收款支出认领'" @click="claimPay">认领</Button>
      <Button class="ml10" v-else @click="claimCollection">预收款认领</Button>
      <claim ref="claim" @selection="selection" />
      <claimGuest ref="claimGuest" />
      <div slot="footer"></div>
    </Modal> -->
    <!-- 认领支付弹框11 -->
    <ClaimModal ref="claimModal" :titleName="claimTit" :amountType="amountType"></ClaimModal>
    <!-- 撤回弹框 -->
    <Modal v-model="revoke" :title="revokeTit" @on-visible-change="visChange">
      <span>撤销原因</span>
      <Input class="w200 ml10" v-model="reason" />
      <div slot="footer">
        <Button type="primary" @click="revokeDetaim">确认</Button>
        <Button @click="revoke = false">取消</Button>
      </div>
    </Modal>
    <CreditSpending ref="credit" :list="modelType" @updateD="query" />
    <settlement ref="settlement" @updateD="query" />
    <payApply ref="payApply" />
  </div>
</template>
<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import { getbayer } from "@/api/AlotManagement/threeSupplier";
import { getSupplierList } from "_api/purchasing/purchasePlan";
import {
  findAdvance,
  revoke,
  findGuest
} from "_api/settlementManagement/advanceCollection.js";
import { claimedFund } from "_api/settlementManagement/fundsManagement/claimWrite.js";
import settlement from "../bill/components/settlement";
import { creat } from "./../components";
import claim from "./components/claimed";
import ClaimModal from "./components/ClaimModal"
import Record from "../components/Record";
// import Record from "../otherReceivables/components/Record";
import claimGuest from "./components/claimGuest";
import payApply from "./components/payApply";
import CreditSpending from "@/view/documentApproval/component/CreditSpending";
import {
  getComenAndGo,
  getAllSalesList,
  getPayList
} from "@/view/documentApproval/component/utils";
import {advanceCollectionExport/**导出*/} from "@/api/settlementManagement/Import/index.js"
import { goshop } from "@/api/settlementManagement/shopList";
import _ from "lodash";

import moment from "moment";
import {showLoading, hideLoading} from "@/utils/loading"

export default {
  name: "settlementManagementAdvanceCollection",
  components: {
    quickDate,
    claim,
    Record,
    claimGuest,
    settlement,
    payApply,
    CreditSpending,
    ClaimModal
  },
  data() {
    return {
      amountType: null,
      // claimType: null,
      // claimTitle: "",
      // condition: undefined,
      // loanId: "",
      remoteloading: false,
      amt: null, //金额
      bankNameO: "", //对方户名
      revoke: false, //撤销弹框
      reason: "", //撤销原因
      revokeTit: "", //撤销弹框标题
      claimTit: "", //预收款弹框标题
      claimModal: false, //预收款弹框
      value: [], //日期
      company: [], //往来单位
      companyId: "", //往来单位
      Branchstore: [{ id: "0", name: "全部" ,shortName:"全部"}], //分店名称
      BranchstoreId: "", //分店名称
      tableData: [], //总表数据
      page: {
        num: 1,
        size: 10,
        total: 0,
        opts: [20, 50, 100, 200]
      },
      currRow: {}, //选中行
      serviceId: "",
      claimSelection: [],
      reconciliationStatement: {},
      paymentId: "",
      //打开模态框状态 type 1 新增 2修改 3查看 4审核
      modelType: {
        type: 5,
        id: ""
      },
    };
  },
  async mounted() {
    let arr = await creat(this.$refs.quickDate.val, this.$store);
    this.value = arr[0];
    this.$nextTick(() => {
      this.BranchstoreId = arr[1];
    });
    this.getShop();
    // this.getOne();
    this.getQuery();
    this.modelType.allSalesList = await getAllSalesList();
    this.modelType.salesList = await getComenAndGo();
    this.modelType.payList = await getPayList();
  },
  computed:{
    selectShopList(){
      if(this.$store.state.user.userData.currentCompany!=null){
        return this.$store.state.user.userData.currentCompany.isMaster ? true : false
      }else{
        return true
      }
    }
  },
  methods: {
    //获取门店
    async getShop() {
      let data = {};
      let res = await goshop(data);
      if (res.code === 0)
        return (this.Branchstore = [...this.Branchstore, ...res.data]);
    },
    //撤回弹框是否打开
    visChange(type) {
      if (!type) {
        this.reason = "";
      }
    },
    //预收款弹框是否打开
    visChangeClaim(type) {
      if (!type) {
        this.companyId = "";
        this.amt = null;
        this.bankNameOthis = "";
        this.claimSelection = [];
        this.$refs.settlement.tableData = [];
      }
    },
    // 往来单位选择
    async getOne(query) {
      this.company = [];
      if (query != "") {
        this.remoteloading = true;
        findGuest({ fullName: query, size: 20 }).then(res => {
          if (res.code === 0) {
            this.company = [];
            res.data.content.map(item => {
              this.company.push({
                value: item.id,
                label: item.fullName
              });
            });
            this.remoteloading = false;
          }
        });
      } else {
        this.company = [];
      }
    },
    changedate(daterange) {
      this.value = daterange;
      this.query();
    },
    // 快速查询
    async quickDate(data) {
      this.value = data;
      // if(this.selectShopList){
        let arr = await creat(this.$refs.quickDate.val, this.$store);
        this.value = arr[0];
        this.BranchstoreId = arr[1];
        this.getQuery();
      // }
    },
    //查询
    query() {
      this.page.num = 1
      this.getQuery();
    },
    // 选中行
    currentChangeEvent({ row }) {
      this.currRow = row;
      this.reconciliationStatement.accountNo = row.serviceId;
      this.serviceId = row.serviceId;
      this.$refs.Record.init();
    },
    //撤回
    revokeCollection(type) {
      switch (type) {
        case 0:
          this.revokeTit = "预收款撤回";
          break;
        case 1:
          this.revokeTit = "预收款核销撤回";
          break;
        case 2:
          this.revokeTit = "预收款支出撤回";
          break;
      }
      if (Object.keys(this.currRow).length !== 0) {
        this.revoke = true;
      } else {
        this.$message.error("请选择数据");
      }
    },
    //撤回弹框确认
    revokeDetaim() {
      if (!this.reason) return this.$message.error("撤销原因必填");
      let sign =
        this.revokeTit.indexOf("核销") != -1
          ? 2
          : this.revokeTit.indexOf("支出") != -1
          ? 3
          : 1;
      let obj = {
        id: this.currRow.id,
        revokeReason: this.reason,
        sign: sign
      };
      revoke(obj).then(res => {
        if (res.code === 0) {
          this.$message.success("撤回成功");
          this.revoke = false;
          this.getQuery();
        }
      });
      this.query();
    },
    //预收款核销
    collectWirte() {
      if (Object.keys(this.currRow).length !== 0) {
        this.$refs.settlement.Settlement = true;
        this.$refs.settlement.showchange = true;
        this.paymentId = "YSK";
      } else {
        this.$message.error("请选择数据");
      }
    },
    //认领弹框
    claimCollect(type) {
      if (type === 1) {
        this.$refs.claimModal.open();
        this.amountType = 1
        this.claimTit = "预收款认领";    // 预收款管理 amountType = 1
        // this.claimedList(1);

      } else {
        this.claimTit = "预收款支出认领";
        if (
          Object.keys(this.currRow).length !== 0 &&
          this.currRow.expenditureNo &&
          !this.currRow.expenditureClaimAmt
        ) {
          this.$refs.claimModal.open();
          this.amountType = 2
        } else {
          this.$message.error("请选择有预收款支出单号且未支出认领的数据");
        }
      }


    },
    //预收款支出认领
    claimPay() {
      if (
        Math.abs(this.$refs.claim.currentClaimed.paidMoney) <=
        this.currRow.remainingAmt
      ) {
        this.$refs.settlement.Settlement = true;
        this.paymentId = "YSKZC";
      } else {
        this.$message.error("金额大于预收款余额，无法认领");
      }
    },
    //查询接口
    getQuery() {
      let obj = {
        startDate: this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endDate: this.value[1]
          ? moment(this.value[1]).format("YYYY-MM-DD")+" 23:59:59"
          : "",
        orgid: this.BranchstoreId=="0"?"":this.BranchstoreId,
        guestName: this.companyId.trim(),
        size: this.page.size,
        page: this.page.num - 1
      };
      showLoading(".loadingClass", "数据加载中，请勿操作")
      findAdvance(obj).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.content;
          this.page.total = res.data.totalElements;
        }
        hideLoading()
      }).catch(e => {
        hideLoading()
      });
      this.serviceId = "";
      this.$refs.Record.init();
      this.currRow = {};
    },
    //导出
    exportTable(){
      if(this.tableData.length<1){
        return this.$Message.error("暂无数据导出")
      }else{
        let obj = {
          startDate: this.value[0]
            ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
            : "",
          endDate: this.value[1]
            ? moment(this.value[1]).format("YYYY-MM-DD")+" 23:59:59"
            : "",
          orgid: this.BranchstoreId=="0"?"":this.BranchstoreId,
          guestName: this.companyId,
          pagesize: this.page.total,
        };
        let params="";
        for(var i in obj){
          params+=`${i}=${obj[i]}&`
        }
        location.href=advanceCollectionExport(params)
      }
    },
    // 预收款认领查询
    queryClaimed() {
      if (this.claimTit === "预收款认领") {
        this.claimedList(1);
      } else {
        this.claimedList(2);
      }
    },
    //预收款支出
    collectWPay() {
      if (Object.keys(this.currRow).length !== 0) {
        this.modelType.rowMessage = this.currRow;
        this.$refs.credit.open();
      } else {
        this.$message.error("请先选择数据");
      }
    },
    //预收款认领
    claimCollection() {
      if (this.claimSelection.length !== 0) {
        this.$refs.claimGuest.modal = true;
        this.claimModal = false;
      } else {
        this.$message.error("请先选择数据");
      }
      this.query();
    },
    //传参数据
    selection(arr) {
      this.claimSelection = [];
      this.claimSelection.push({ id: arr.id });
    },
    //预收款认领弹窗查询suppliers
    claimedList(type) {
      let obj = {
        amount: this.amt,
        reciprocalAccountName: this.bankNameO,
        page: this.$refs.claim.claimedPage.page - 1,
        size: this.$refs.claim.claimedPage.size,
        amountType: type,
        guestId: this.companyId,
        claimShopCode:this.$store.state.user.userData.currentCompany.code
      };
      claimedFund(obj).then(res => {
        if (res.code === 0) {
          this.$refs.claim.claimedData = res.data.content;
          this.$refs.claim.claimedPage.total = res.data.totalElements;
        }
      });
    },
    //分页
    changePage(p) {
      this.page.num = p;
      this.getQuery();
    },
    changeSize(size) {
      this.page.num = 1;
      this.page.size = size;
      this.getQuery();
    },
  }
};
</script>

<style scoped>
.box {
  overflow: auto;
}
.boxData {
  width: 2200px;
  /* overflow: auto; */
}
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.listChild {
  display: inline-block;
  border: 1px solid #e8eaec;
  flex: 1;
  line-height: 24px;
  padding:0 5px;
}
.vxe-table .vxe-cell {
  padding: 0;
}
.vxe-table .vxe-body--column:not(.col--ellipsis) {
  padding: 0px 10px !important;
}
.el-input-number{
  width: 100px;
}
</style>
