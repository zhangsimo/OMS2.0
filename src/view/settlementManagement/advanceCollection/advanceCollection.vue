<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <quickDate class="mr10" ref="quickDate" @quickDate="quickDate"></quickDate>
          </div>
          <div class="db ml20">
            <span>对账期间：</span>
            <Date-picker :value="value" type="daterange" placeholder="选择日期" class="w200"></Date-picker>
          </div>
          <div class="db ml20">
            <span>分店名称：</span>
            <Select v-model="BranchstoreId" class="w150">
              <Option
                v-for="item in Branchstore"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db ml20">
            <span>往来单位：</span>
            <Select v-model="companyId" class="w150" filterable>
              <Option v-for="item in company" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
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
        <Button class="ml10" @click="modal=true">预收款认领</Button>
        <Button class="ml10">预收款核销</Button>
        <Button class="ml10">预收款支出</Button>
        <Button class="ml10">预收款支出认领</Button>
        <Button class="ml10">预收款撤回</Button>
        <Button class="ml10">预收款核销撤回</Button>
        <Button class="ml10">预收款支出撤回</Button>
        <Button class="ml10">导出</Button>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <div class="box mb10">
          <vxe-table
            class="boxData"
            auto-resize
            resizable
            border
            max-height="400"
            :data="tableData"
            align="center"
            highlight-current-row
            @current-change="currentChangeEvent"
          >
            <vxe-table-column title="基本信息">
              <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
              <vxe-table-column field="serviceId" title="预收款单号"></vxe-table-column>
              <vxe-table-column field="guestName" title="往来单位"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="金额信息">
              <vxe-table-column field="claimAmt" title="预收款认领金额"></vxe-table-column>
              <vxe-table-column field="writeOffReceiptNo" title="预收款核销收款单号"></vxe-table-column>
              <vxe-table-column field="writeOffAmt" title="预收款核销收款金额"></vxe-table-column>
              <vxe-table-column field="expenditureNo" title="预收款支出单号"></vxe-table-column>
              <vxe-table-column field="expenditureAmt" title="预收款支出金额"></vxe-table-column>
              <vxe-table-column field="expenditureClaimAmt" title="预收款支出已认领金额"></vxe-table-column>
              <vxe-table-column field="remainingAmt" title="预收款余额"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="收款方式">
              <vxe-table-column field="role" title="账户">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.receiveType" :key="index" class="flex">
                      <span class="listChild">{{item.account}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="sex" title="金额">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.receiveType" :key="index" class="flex">
                      <span class="listChild">{{item.amt}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="age" title="收款所属门店">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.receiveType" :key="index" class="flex">
                      <span class="listChild">{{item.ownStoreName}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="付款方式">
              <vxe-table-column field="role" title="账户">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.paymentType" :key="index" class="flex">
                      <span class="listChild">{{item.account}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="sex" title="金额">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.paymentType" :key="index" class="flex">
                      <span class="listChild">{{item.amt}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="age" title="付款所属门店">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.paymentType" :key="index" class="flex">
                      <span class="listChild">{{item.ownStoreName}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="其他信息">
              <vxe-table-column field="receiver" title="收款人"></vxe-table-column>
              <vxe-table-column field="receiveDate" title="收款日期"></vxe-table-column>
              <vxe-table-column field="receiveRemark" title="收款备注"></vxe-table-column>
              <vxe-table-column field="receiveAuditor" title="收款审核人"></vxe-table-column>
              <vxe-table-column field="receiveAuditDate" title="收款审核日期"></vxe-table-column>
              <vxe-table-column field="payer" title="付款人"></vxe-table-column>
              <vxe-table-column field="paymentDate" title="付款日期"></vxe-table-column>
              <vxe-table-column field="paymentRemark" title="付款备注"></vxe-table-column>
              <vxe-table-column field="paymentAuditor" title="付款审核人"></vxe-table-column>
              <vxe-table-column field="paymentAuditDate" title="付款审核日期"></vxe-table-column>
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
    <Modal v-model="modal" title="预收款认领" width="800">
      <span class="ml10">金额：</span>
      <InputNumber v-model="amt" class="w50" />
      <span class="ml10">对方户名：</span>
      <Input v-model="bankNameO" class="w100" />
      <button class="ivu-btn ivu-btn-default ml10" type="button" @click="queryClaimed">
        <i class="iconfont iconchaxunicon"></i>
        <span>查询</span>
      </button>
      <Button class="ml10" @click="claimCollection">预收款认领</Button>
      <claim ref="claim" />
      <claimGuest ref="claimGuest" />
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import { getbayer } from "@/api/AlotManagement/threeSupplier";
import { getSupplierList } from "_api/purchasing/purchasePlan";
import { findAdvance } from "_api/settlementManagement/advanceCollection.js";
import { claimedFund } from "_api/settlementManagement/fundsManagement/claimWrite.js";
import { creat } from "./../components";
import claim from "../components/claimed";
import Record from "../components/Record";
import claimGuest from './components/claimGuest'
import moment from "moment";
export default {
  components: {
    quickDate,
    claim,
    Record,
    claimGuest
  },
  data() {
    return {
      amt: 0, //金额
      bankNameO: "", //对方户名
      modal: false, //预收款弹框
      value: [], //日期
      company: [], //往来单位
      companyId: "", //往来单位
      Branchstore: [], //分店名称
      BranchstoreId: "", //分店名称
      tableData: [], //总表数据
      page: {
        num: 1,
        size: 10,
        total: 0,
        opts: [20, 50, 100, 200]
      },
      currRow: {}, //选中行
      serviceId: ""
    };
  },
  async mounted() {
    let arr = await creat(this.$refs.quickDate.val, this.$store);
    this.value = arr[0];
    this.BranchstoreId = arr[1];
    this.Branchstore = arr[2];
    this.getOne();
    this.getQuery();
    this.claimedList();
  },
  methods: {
    // 往来单位选择
    async getOne() {
      const res = await getSupplierList({});
      const res1 = await getbayer({});
      this.company = [];
      let data = [];
      let result = [];
      let obj = {};
      if (res.data.length !== 0 && res1.data.content.length !== 0) {
        data = [...res.data, ...res1.data.content];
      } else if (res.data.length !== 0) {
        data = res.data;
      } else if (res1.data.content.length !== 0) {
        data = res.data.content;
      }
      for (let i in data) {
        if (!obj[data[i].id]) {
          result.push(data[i]);
          obj[data[i].id] = 1;
        }
      }
      data = result;
      data.map(item => {
        this.company.push({
          label: item.fullName,
          value: item.id
        });
      });
    },
    // 快速查询
    quickDate(data) {
      this.value = data;
      this.getQuery();
    },
    //查询
    query() {
      this.getQuery();
    },
    // 选中行
    currentChangeEvent({ row }) {
      this.currRow = row;
      this.serviceId = row.serviceId;
      console.log(789, this.serviceId);
      this.$refs.Record.init();
    },
    //查询接口
    getQuery() {
      let obj = {
        startDate: this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endDate: this.value[1]
          ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        orgid: this.BranchstoreId,
        guestId: this.companyId,
        size: this.page.size,
        page: this.page.num - 1
      };
      findAdvance(obj).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.content;
          this.page.total = res.data.totalElements;
        }
      });
      this.serviceId = "";
      this.$refs.Record.init();
      this.currRow = null;
    },
    // 预收款认领查询
    queryClaimed() {
      this.claimedList();
    },
    //预收款认领
    claimCollection() {},

    //预收款认领弹窗查询
    claimedList() {
      let obj = {
        amount: this.amt,
        reciprocalAccountName: this.bankNameO,
        page: this.$refs.claim.claimedPage.page - 1,
        size: this.$refs.claim.claimedPage.size
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
    }
  }
};
</script>
<style>
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
  padding: 5px;
}
.vxe-table .vxe-cell {
  padding: 0;
}
.vxe-table .vxe-body--column:not(.col--ellipsis) {
  padding: 0;
}
</style>