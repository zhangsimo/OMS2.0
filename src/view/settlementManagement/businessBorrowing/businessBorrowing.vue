<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <quickDate
              class="mr10"
              ref="quickDate"
              @quickDate="quickDate"
            ></quickDate>
          </div>
          <div class="db ml20">
            <span>查询日期：</span>
            <Date-picker
              v-model="value"
              type="daterange"
              placeholder="选择日期"
              class="w200"
            ></Date-picker>
          </div>
          <div class="db ml20">
            <span>分店名称：</span>
            <Select v-model="BranchstoreId"  :disabled="selectShopList" class="w150" filterable clearable>
              <Option
                v-for="item in Branchstore"
                :value="item.id"
                :key="item.id"
                >{{ item.name }}</Option
              >
            </Select>
          </div>
          <div class="db ml20">
            <span>因公借支申请单号：</span>
            <Input v-model="requestCode" class="w120" />
          </div>
          <div class="db ml20">
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="query"
            >
              <i class="iconfont iconchaxunicon mr5"></i>
              <span>查询</span>
            </button>
          </div>
        </div>
      </div>
      <div class="mt10 mb10">
        <Button v-has="'clima'" class="ml10" @click="claimCollect(1)"
          >因公借支认领</Button
        >
        <Button v-has="'cancel'" class="ml10" @click="openWriteOffModel"
          >因公借支核销</Button
        >
        <Button v-has="'back'" class="ml10" @click="claimCollect(2)"
          >因公借支收回</Button
        >
        <Button
          v-has="'revoke'"
          class="ml10"
          @click="revokeCollection(3)"
          :disabled="currRow == null"
          >因公借支申请撤回</Button
        >
        <Button
          class="ml10"
          @click="revokeCollection(0)"
          :disabled="currRow == null"
          v-has="'claimRevoke'"
          >因公借支认领撤回</Button
        >
        <Button
          class="ml10"
          @click="revokeCollection(1)"
          :disabled="currRow == null"
          v-has="'borrowRevoke'"
          >因公借支核销撤回</Button
        >
        <Button
          class="ml10"
          @click="revokeCollection(2)"
          :disabled="currRow == null"
          v-has="'payRevoke'"
          >因公借支收回撤回</Button
        >
        <!--<Button class="ml10">导出</Button>-->
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <div class="box mb10">
          <vxe-table
            auto-resize
            resizable
            border
            show-overflow
            highlight-hover-row
            highlight-current-row
            ref="xTable"
            @current-change="currentChangeEvent"
            :data="tableData"
            align="center"
            show-footer
            :footer-method="footerMethod"
          >
            <vxe-table-column
              type="seq"
              width="60"
              title="序号"
              fixed="left"
            ></vxe-table-column>
            <vxe-table-column
              field="serviceId"
              title="因公借支申请单号"
              width="140"
              fixed="left"
            ></vxe-table-column>
            <vxe-table-column
              field="payAmt"
              title="因公借支金额"
              width="120"
              fixed="left"
            ></vxe-table-column>
            <vxe-table-column title="基本信息">
              <vxe-table-column
                field="applyTime"
                title="申请时间"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="applicant"
                title="申请人"
                width="90"
              ></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="金额信息">
              <vxe-table-column
                field="paymentNo"
                title="因公借支付款单号"
                width="140"
              ></vxe-table-column>
              <vxe-table-column
                field="expenseClaimAmount"
                title="因公借支已认领金额"
                width="150"
              ></vxe-table-column>
              <vxe-table-column
                field="writeOffReceiptNo"
                title="因公借支核销单号"
                width="140"
              ></vxe-table-column>
              <vxe-table-column
                field="writeOffAmount"
                title="因公借支核销金额"
                width="140"
              ></vxe-table-column>
              <vxe-table-column
                field="paymentReturnNo"
                title="因公借支收回单号"
                width="140"
              ></vxe-table-column>
              <vxe-table-column
                field="paymentReturnAmount"
                title="因公借支收回金额"
                width="140"
              ></vxe-table-column>
              <vxe-table-column
                field="paymentReturnBalance"
                title="因公借支未核销余额"
                width="150"
              ></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="收款方式">
              <vxe-table-column field="role" title="账户" width="60">
                <template v-slot="{ row }">
                  <ul class="list">
                    <li
                      v-for="(item, index) of row.receiveType"
                      :key="index"
                      class="flex"
                    >
                      <span class="listChild">{{ item.accountName }}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="amt" title="金额" width="60">
                <template v-slot="{ row }">
                  <ul class="list">
                    <li
                      v-for="(item, index) of row.receiveType"
                      :key="index"
                      class="flex"
                    >
                      <span class="listChild">{{ item.amt }}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="age" title="收款所属门店" width="120">
                <template v-slot="{ row }">
                  <ul class="list">
                    <li
                      v-for="(item, index) of row.receiveType"
                      :key="index"
                      class="flex"
                    >
                      <span class="listChild">{{ item.ownStoreName }}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="付款方式">
              <vxe-table-column field="role" title="账户" width="60">
                <template v-slot="{ row }">
                  <ul class="list">
                    <li
                      v-for="(item, index) of row.paymentType"
                      :key="index"
                      class="flex"
                    >
                      <span class="listChild">{{ item.accountName }}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="sex" title="金额" width="60">
                <template v-slot="{ row }">
                  <ul class="list">
                    <li
                      v-for="(item, index) of row.paymentType"
                      :key="index"
                      class="flex"
                    >
                      <span class="listChild">{{ item.amt }}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="age" title="付款所属门店" width="120">
                <template v-slot="{ row }">
                  <ul class="list">
                    <li
                      v-for="(item, index) of row.paymentType"
                      :key="index"
                      class="flex"
                    >
                      <span class="listChild">{{ item.ownStoreName }}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="其他信息">
              <vxe-table-column
                field="receiver"
                title="收款人"
                width="90"
              ></vxe-table-column>
              <vxe-table-column
                field="receiveDate"
                title="收款日期"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="receiveRemark"
                title="收款备注"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="receiveAuditor"
                title="收款审核人"
                width="120"
              ></vxe-table-column>
              <vxe-table-column
                field="receiveAuditDate"
                title="收款审核日期"
                width="120"
              ></vxe-table-column>
              <vxe-table-column field="payer" title="付款人" width="90"></vxe-table-column>
              <vxe-table-column
                field="paymentDate"
                title="付款日期"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="paymentRemark"
                title="付款备注"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="paymentAuditor"
                title="付款审核人"
                width="120"
              ></vxe-table-column>
              <vxe-table-column
                field="paymentAuditDate"
                title="付款审核日期"
                width="120"
              ></vxe-table-column>
            </vxe-table-column>
          </vxe-table>
        </div>
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
        <Button>收付款单记录</Button>
        <Record ref="Record" :serviceId="serviceId" />
      </div>
    </section>
    <!-- 认领弹框 -->
    <Modal
      v-model="claimModal"
      :title="claimTit"
      width="1000"
      @on-visible-change="visChangeClaim"
    >
      <!-- <span>往来单位：</span>
      <Select
        v-model="companyId"
        class="w150"
        clearable
        filterable
        remote
        :loading="remoteloading"
        :remote-method="getOne"
        @on-change="query"
      >
        <Option v-for="item in company" :value="item.value" :key="item.value">{{
          item.label
        }}</Option>
      </Select> -->
      <span class="ml10">金额：</span>
      <InputNumber v-model="amt" class="w50" />
      <span class="ml10">对方户名：</span>
      <Input v-model="bankNameO" class="w100" />
      <button
        class="ivu-btn ivu-btn-default ml10"
        type="button"
        @click="queryClaimed"
      >
        <i class="iconfont iconchaxunicon"></i>
        <span>查询</span>
      </button>
      <Button class="ml10" @click="claimPay">认领</Button>
      <!--<Button class="ml10" v-else @click="claimCollection">预收款认领</Button>-->
      <claim ref="claim" @selection="selection" />
      <div slot="footer"></div>
    </Modal>
    <!--点击认领后弹框-->
    <claimGuest ref="claimGuest" />
    <!-- 撤回弹框 -->
    <Modal v-model="revoke" :title="revokeTit" @on-visible-change="visChange">
      <span>撤销原因</span>
      <Input class="w200 ml10" v-model="reason" />
      <div slot="footer">
        <Button type="primary" @click="revokeDetaim">确认</Button>
        <Button @click="revoke = false">取消</Button>
      </div>
    </Modal>
    <!--其他收款核销-->
    <!--<settlement ref="settlement"></settlement>-->
    <!--因公借支核销-->
    <write-off ref="writeOff" :table="currRow"></write-off>
  </div>
</template>

<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import claim from "./components/claimed";
// import settlement from "./components/settlement";
import { creat } from "./../components";
import Record from "./components/Record";
import { claimedFund } from "_api/settlementManagement/fundsManagement/claimWrite";
import * as api from "_api/settlementManagement/businessBorrowing";
import {
  findAdvance,
  revoke,
  findGuest
} from "_api/settlementManagement/advanceCollection.js";
import {
  findByDynamicQuery,
  withdraw
} from "_api/settlementManagement/otherReceivables/otherReceivables";
import { goshop } from "@/api/settlementManagement/shopList";
import verification from "./components/verification";
import claimGuest from "./components/claimGuest";
import writeOff from "./components/writeOff";
// otherReceivables
import moment from "moment";

export default {
  inject: ["reload"],
  name: "settlementManagementBusinessBorrowing",
  components: {
    quickDate,
    claim,
    // settlement,
    Record,
    verification,
    writeOff,
    claimGuest
  },
  data() {
    return {
      remoteloading: false,
      loanId: "",
      value: [], //查询日期数组
      BranchstoreId: "", //分店名称
      company: [], //往来单位数组
      Branchstore: [{ id: "0", name: "全部" }], //分店名称
      requestCode: "", //申请单号
      currRow: null, //选中行
      claimModal: false, //认领弹框
      revoke: false, //撤回弹框
      claimTit: "", //认领弹框标题
      revokeTit: "", //撤回弹框标题
      amt: null, //认领弹框金额
      bankNameO: "", //认领弹框对方户名
      reason: "", //撤销原因
      companyId: "", //往来单位
      tableData: [], //表格信息
      claimSelection: [],
      selectionData: {},
      claimCollectType: 1,
      signType: 0,
      page: {
        num: 1,
        size: 10,
        total: 0,
        opts: [20, 50, 100, 200]
      }, //分页
      serviceId: "" //给子组件传的值
    };
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
    async getShop(){
      let data ={}
      let res = await goshop(data)
      if (res.code === 0) return this.Branchstore = [...this.Branchstore , ...res.data]
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
    //其他付款认领/其他收款收回
    claimCollect(type) {
      if (!this.currRow || !this.currRow.id) {
        return this.$message.error("请选择数据");
      }
      this.$refs.claim.claimedPage = {
        page: 1,
        total: 0,
        size: 10
      };
      if (type == 1) {
        this.claimModal = true;
        this.claimTit = "因公借支认领";
        this.claimCollectType = 1;
        this.$store.commit("setClaimType", 2);
        this.claimedList(2);
      } else {
        this.claimModal = true;
        this.claimTit = "因公借支收回";
        this.claimCollectType = 2;
        this.$store.commit("setClaimType", 3);
        this.claimedList(1);
      }
    },
    //其他收款认领弹窗查询
    claimedList(type) {
      let obj = {
        loanId: this.loanId,
        amount: this.amt,
        page: this.$refs.claim.claimedPage.page - 1,
        size: this.$refs.claim.claimedPage.size,
        amountType: type,
        suppliers: this.companyId,
        claimShopCode:this.$store.state.user.userData.currentCompany.code
      };
      if (this.bankNameO) {
        obj.reciprocalAccountName = this.bankNameO;
      }
      claimedFund(obj).then(res => {
        if (res.code === 0) {
          this.$refs.claim.claimedData = res.data.content;
          this.$refs.claim.claimedPage.total = res.data.totalElements;
        }
      });
    },
    //预收款弹框是否打开
    visChangeClaim(type) {
      this.companyId = "";
      this.amt = null;
      this.bankNameOthis = "";
      this.claimSelection = [];
      // if (!type) {
      //   this.companyId = "";
      //   this.amt =null;
      //   this.bankNameOthis = "";
      //   this.claimSelection=[]
      //   this.$refs.settlement.tableData=[]
      // }
    },
    openWriteOffModel() {
      if (!this.currRow) {
        return this.$message.error("请选择数据");
      }
      if (this.currRow.expenseClaimAmount == 0) {
        return this.$message.error("未认领资金不能核销");
      }
      if (this.currRow.paymentReturnBalance == 0) {
        return this.$message.error("因公借支未核销金额为0不能再次核销");
      }
      this.$refs.writeOff.open();
    },
    //撤回按钮点击事件
    revokeCollection(type) {
      switch (type) {
        case 0:
          this.revokeTit = "因公借支认领撤回";
          this.signType = 2;
          break;
        case 1:
          this.revokeTit = "因公借支核销撤回";
          this.signType = 3;
          break;
        case 2:
          this.revokeTit = "因公借支收回撤回";
          this.signType = 4;
          break;
        case 3:
          this.revokeTit = "因公借支申请撤回";
          this.signType = 1;
          break;
      }
      this.reason = "";
      this.revoke = true;
    },
    //其他收款核销
    collectWirte() {
      // if (Object.keys(this.currRow).length !== 0) {
      this.$refs.settlement.Settlement = true;
      //   this.paymentId = "YSK";
      // } else {
      //   this.$message.error("请选择数据");
      // }
    },
    //认领弹框查询
    queryClaimed() {
      let t = 0;
      if (this.claimCollectType == 1) {
        t = 2;
      } else {
        t = 1;
      }
      this.claimedList(t);
    },
    //初始化
    getQuery() {
      let params = {
        size: this.page.size,
        page: this.page.num - 1
      };
      let data = {
        startTime: this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD") + " 00:00:00"
          : "",
        endTime: this.value[1]
          ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
          : "",
        orgid: this.BranchstoreId,
        serviceId: this.requestCode
        // guestId: this.companyId,
      };
      for (let d in data) {
        if (!data[d]) {
          delete data[d];
        }
      }
      api.findListPageAll(params, data).then(res => {
        if (res.code == 0) {
          this.tableData = res.data.content;
          this.page.total = res.data.totalElements;
        }
      });
      this.serviceId = "";
      this.$refs.Record.init();
      this.currRow = null;
      this.$refs.xTable.clearCurrentRow();
    },
    //认领弹框认领
    claimPay() {
      if (this.claimSelection.length !== 0) {
        // currRow
        if (this.claimCollectType == 1) {
          if (this.selectionData.paidMoney > this.currRow.payAmt) {
            return this.$message.error("金额大于因公借支金额金额，无法认领");
          }
        } else {
          if (
            this.selectionData.incomeMoney > this.currRow.paymentReturnBalance
          ) {
            return this.$message.error("金额大于因公借支金额金额，无法认领");
          }
        }
        let obj = {
          financeAccountCashList: this.$store.state.businessBorrowing.financeAccountCashList,
          loanId: this.$store.state.businessBorrowing.loanId,
          claimType: this.$store.state.businessBorrowing.claimType,
        }
        api.addClaim(obj).then(res => {
          if (res.code === 0) {
            this.$message.success('认领成功')
            this.modal = false
            this.getQuery()
            // this.$parent.reload();
          }
        })
        this.claimModal = false;
      } else {
        this.$message.error("请选择因公借支数据");
      }
    },
    //认领弹框传参数据
    selection(selection) {
      this.claimSelection = [];
      this.selectionData = selection;
      this.$store.commit("setFinanceAccountCashList", [{ id: selection.id }]);
      this.claimSelection.push({ id: selection.id });
    },
    //撤回弹框是否打开
    visChange(type) {
      if (!type) {
        // this.guestId = ''
        // this.company = ''
        // this.$refs.table.clearCurrentRow()
      }
    },
    //撤销弹框确定按钮
    revokeDetaim() {
      if (this.reason.trim().length <= 0) {
        return this.$message.error("请输入撤回原因");
      }
      let data = {
        revokeReason: this.reason.trim(),
        id: this.currRow.id,
        sign: this.signType
      };
      api.loanRevoke(data).then(res => {
        if (res.code == 0) {
          this.$message.success("撤销成功");
          this.revoke = false;
          // this.reload();
        }
      });
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
    // 选中行
    currentChangeEvent({ row }) {
      this.currRow = row;
      this.loanId = row.id;
      this.$store.commit("setLoanId", row.id);
      // this.reconciliationStatement.accountNo = row.serviceId;
      this.serviceId = row.serviceId;
      this.$refs.Record.init();
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
    //表尾合计
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "合计";
          }
          if (
            [
              "payAmt",
              "writeOffAmt",
              "returnClaimAmt",
              "remainingAmt"
            ].includes(column.property)
          ) {
            return this.$utils.sum(data, column.property);
          }
          return null;
        })
      ];
    }
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
  }
};
</script>

<style scoped>
.main .content-oper {
  min-height: 100%;
  height: auto;
}
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
