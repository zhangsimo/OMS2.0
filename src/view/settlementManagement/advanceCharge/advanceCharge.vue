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
            <span>对账期间：</span>
            <Date-picker
              v-model="value"
              type="daterange"
              placeholder="选择日期"
              class="w200"
            ></Date-picker>
          </div>
          <div class="db ml20">
            <span>分店名称：</span>
            <Select v-model="BranchstoreId" class="w150" filterable>
              <Option
                v-for="item in Branchstore"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </div>
          <div class="db ml20">
            <span>往来单位：</span>
            <Select v-model="companyId" class="w150" filterable>
              <Option
                v-for="item in company"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </div>
          <div class="db ml5">
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="query"
            >
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
        </div>
      </div>
      <div class="mt10 mb10">
        <Button :disabled="currRow == null" class="ml10" @click="openModal('预付款认领')">预付款认领</Button>
        <Button :disabled="currRow == null" class="ml10">预付款核销</Button>
        <Button :disabled="currRow == null" class="ml10" @click="openModal('预付款收回认领')">预付款收回认领</Button>
        <Button :disabled="btnIsdisable.one" class="ml10" @click="openShow('预付款撤回')">预付款撤回</Button>
        <Button :disabled="btnIsdisable.two" class="ml10" @click="openShow('预付款核销撤回')">预付款核销撤回</Button>
        <Button :disabled="btnIsdisable.three" class="ml10" @click="openShow('预付款回收撤回')">预付款回收撤回</Button>
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
            highlight-hover-row
            highlight-current-row
            @current-change="currentChangeEvent"
            max-height="400"
            :data="tableData"
            align="center"
            show-footer
            :footer-method="footerMethod"
          >
            <vxe-table-column title="基本信息">
              <vxe-table-column
                title="序号"
                type="seq"
                width="60"
              ></vxe-table-column>
              <vxe-table-column
                field="serviceId"
                title="预付款对账单号"
              ></vxe-table-column>
              <vxe-table-column
                field="orderNo"
                title="预付款采购订单号"
              ></vxe-table-column>
              <vxe-table-column
                field="guestName"
                title="往来单位"
              ></vxe-table-column>
              <vxe-table-column
                field="applicant"
                title="申请人"
              ></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="金额信息">
              <vxe-table-column
                field="payAmt"
                title="预付款金额"
              ></vxe-table-column>
              <vxe-table-column
                field="paymentNo"
                title="预付款付款单号"
              ></vxe-table-column>
              <vxe-table-column
                field="claimAmt"
                title="预付款已认领金额"
              ></vxe-table-column>
              <vxe-table-column
                field="writeOffReceiptNo"
                title="预付款核销单号"
              ></vxe-table-column>
              <vxe-table-column
                field="writeOffAmt"
                title="预付款核销金额"
              ></vxe-table-column>
              <vxe-table-column
                field="returnNo"
                title="预付款收回单号"
              ></vxe-table-column>
              <vxe-table-column
                field="returnClaimAmt"
                title="预付款收回认领金额"
              ></vxe-table-column>
              <vxe-table-column
                field="remainingAmt"
                title="预付款余额"
              ></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="付款方式">
              <vxe-table-column field="role" title="账户">
                <template v-slot="{ row }">
                  <ul class="list">
                    <li
                      v-for="(item, index) of row.paymentType"
                      :key="index"
                      class="flex"
                    >
                      <span class="listChild">{{ item.account }}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="sex" title="金额">
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
              <vxe-table-column field="age" title="付款所属门店">
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
            <vxe-table-column title="收款方式">
              <vxe-table-column field="role" title="账户">
                <template v-slot="{ row }">
                  <ul class="list">
                    <li
                      v-for="(item, index) of row.receiveType"
                      :key="index"
                      class="flex"
                    >
                      <span class="listChild">{{ item.account }}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="sex" title="金额">
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
              <vxe-table-column field="age" title="收款所属门店">
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
            <vxe-table-column title="其他信息">
              <vxe-table-column field="payer" title="付款人"></vxe-table-column>
              <vxe-table-column
                field="paymentDate"
                title="付款日期"
              ></vxe-table-column>
              <vxe-table-column
                field="paymentRemark"
                title="付款备注"
              ></vxe-table-column>
              <vxe-table-column
                field="paymentAuditor"
                title="付款审核人"
              ></vxe-table-column>
              <vxe-table-column
                field="paymentAuditDate"
                title="付款审核日期"
              ></vxe-table-column>
              <vxe-table-column
                field="receiver"
                title="收款人"
              ></vxe-table-column>
              <vxe-table-column
                field="receiveDate"
                title="收款日期"
              ></vxe-table-column>
              <vxe-table-column
                field="receiveRemark"
                title="收款备注"
              ></vxe-table-column>
              <vxe-table-column
                field="receiveAuditor"
                title="收款审核人"
              ></vxe-table-column>
              <vxe-table-column
                field="receiveAuditDate"
                title="收款审核日期"
              ></vxe-table-column>
            </vxe-table-column>
          </vxe-table>
        </div>
        <div class="clearfix">
          <Page
            class-name="fr mb10"
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
    <Modal 
      v-model="modalShow" 
      :title="reTitle" @on-ok="reClose"
      @on-cancel="cancel"
    >
      <Row>
        <Col span="4"><span>撤回原因：</span></Col>
        <Col span="20">
          <Input v-model="revokeReason" />
        </Col>
      </Row>
    </Modal>
    <Modal v-model="modal" :title="claimedButtonType" width="800">
      <span>往来单位：</span>
      <Select v-model="suppliers" class="w150" filterable>
        <Option
          v-for="item in company"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select>
      <span class="ml10">对方户名：</span>
      <Input v-model="reciprocalAccountName" class="w100" />
      <span class="ml10">金额：</span>
      <InputNumber v-model="amount" class="w50" />
      <button
        class="ivu-btn ivu-btn-default ml10"
        type="button"
        @click="queryClaimed"
      >
        <i class="iconfont iconchaxunicon"></i>
        <span>查询</span>
      </button>
      <Button class="ml10" @click="claimOk">预收款回收认领</Button>
      <claim ref="claim" @selection="selection" />
      <div slot="footer"></div>
    </Modal>
    <settlementadv ref="settlementadv" />
  </div>
</template>
<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import { getbayer } from "@/api/AlotManagement/threeSupplier";
import { getSupplierList } from "_api/purchasing/purchasePlan";
import * as api from "_api/settlementManagement/advanceCharge";
import { creat } from "../components";
import claim from "../components/claimed";
import Record from "../components/Record";
import settlementadv from "../bill/components/settlementadv" 
import moment from "moment";
import { mapMutations } from "vuex";
export default {
  components: {
    quickDate,
    claim,
    Record,
    settlementadv,
  },
  data() {
    return {
      modalShow: false,
      reTitle: "",
      revokeReason: "",
      amount: 0, //认领-金额
      reciprocalAccountName: "", // 认领-对方户名
      suppliers: "", // 认领-往来单位
      modal: false, //预收款弹框
      claimedButtonType: "预付款认领", // claimed 用以判断弹窗按钮坐用
      claimedSelectData: [], // 认领弹窗选择的数据
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
      loading: false,
      currRow: null,
      serviceId: "",
      btnIsdisable: {
        one: true,
        two: true,
        three: true,
      },
    };
  },
  async mounted() {
    let arr = await creat(this.$refs.quickDate.val, this.$store);
    // this.value = arr[0];
    // this.BranchstoreId = arr[1];
    this.Branchstore = arr[2];
    this.getOne();
  },
  methods: {
    ...mapMutations(["setClaimedSearch", "setSign"]),
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
    //查询接口
    async getQuery() {
      let obj = {
        startTime: this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endTime: this.value[1]
          ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        orgId: this.BranchstoreId,
        guestId: this.companyId,
        size: this.page.size,
        page: this.page.num - 1
      };
      for (let key in obj) {
        if (!obj[key]) {
          Reflect.deleteProperty(obj, key);
        }
      }
      let res = await api.findPageByDynamicQuery(obj);
      if (res.code == 0) {
        this.tableData = res.data.content;
        this.page.total = res.data.totalElements;
      }
      this.serviceId = "";
      this.$refs.Record.init();
      this.currRow = null;
    },
    // 选中行
    currentChangeEvent({ row }) {
      this.currRow = row;
      // one 1 !2 !3
      // two 1 2 !3
      // three 1 3
      this.btnIsdisable = {
        one: true,
        two: true,
        three: true,
      }
      const { 
        paymentNo,
        writeOffReceiptNo,
        returnNo,
      } = row;
      let [one, two, three] = [true, true, true]; 
      if(row.paymentNo) {
        one = true;
      } else {
        one = false;
      }
      if(row.writeOffReceiptNo) {
        two = true;
      } else {
        two = false;
      }
      if(row.returnNo) {
        three = true;
      } else {
        three = false;
      }
      if (one && !two && !three) {
        this.btnIsdisable.one = false;
      }
      if (one && two && !three) {
        this.btnIsdisable.two = false;
      }
      if (one && three) {
        this.btnIsdisable.three = false;
      }
      this.serviceId = row.serviceId;
      this.$refs.Record.init();
    },
    // 撤回
    async reClose() {
      if(this.revokeReason.trim().length <= 0) {
        return this.$message.error("请输入撤回原因");
      }
      let data = {
        revokeReason: this.revokeReason,
        id: this.currRow.id,
      }
      switch(this.reTitle) {
        case "预付款撤回":
          data.sign = 1;
          break;
        case "预付款核销撤回":
          data.sign = 2;
          break;
        case "预付款回收撤回":
          data.sign = 3;
          break;
        default:
          break;
      }
      let res = await api.addWithdraw(data);
      if(res.code == 0) {
        this.$message.success("撤回成功");
        this.modalShow = false;
        this.getQuery();
      }
    },
    cancel() {
      this.modalShow = false;
      this.$message.info("取消撤回");
    },
    // 表尾
    footerMethod({ columns, data }) {
      const sum = (arr, filed) => {
        return arr.reduce((total, next) => total + next[filed], 0);
      };
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex == 0) {
            return "合计";
          }
          switch (column.property) {
            case "payAmt":
              return sum(data, "payAmt");
            case "writeOffAmt":
              return sum(data, "writeOffAmt");
            case "returnClaimAmt":
              return sum(data, "returnClaimAmt");
            case "remainingAmt":
              return sum(data, "remainingAmt");
            default:
              return null;
          }
          return null;
        })
      ];
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
    openModal(name) {
      this.claimedButtonType = name;
      this.amount = 0
      this.reciprocalAccountName = "";
      this.suppliers = "";
      this.queryClaimed();
      this.modal = true;
    },
    // 预收款认领查询
    queryClaimed() {
      if(this.claimedButtonType == "预付款认领") {
        this.setClaimedSearch({
          amount: this.amount,
          reciprocalAccountName: this.reciprocalAccountName,
          suppliers: this.suppliers,
          amountType: 2
        });
      } else {
        this.setClaimedSearch({
          amount: this.amount,
          reciprocalAccountName: this.reciprocalAccountName,
          suppliers: this.suppliers,
          amountType: 1
        });
      }
      this.claimedSelectData = [];
      this.$refs.claim.init();
    },
    selection(arr) {
      this.claimedSelectData = arr;
    },
    // 认领
    async claimOk() {
      if (this.claimedSelectData.length <= 0) {
        return this.$message.error("请先选择要认领的数据!");
      }
      const userData = this.$store.state.user.userData;
      let obj = {
        tenantId: userData.tenantId,
        orgid: userData.shopId,
        paymentTypeList: [],
        guestId: this.currRow.guestId,
        id: this.currRow.id,
      }
      for (let key in obj) {
        if(!obj[key]) {
          delete obj[key];
        }
      }
      obj.claimAmt = 0;
      if(this.claimedButtonType == "预付款认领") {
        this.claimedSelectData.forEach(el => {
          let item = {
            account: el.accountCode,
            amt: el.incomeMoney,
            ownStoreId: el.shopId,
            ownStoreName: el.shopName,
            accountBank: el.bankName,
            accountBankNo: el.accountCode,
            accountName: el.accountName,
            subjectName: el.mateAccountName,
            transRemarkL: el.tradingNote,
          }
          obj.claimAmt += el.paidMoney;
          obj.paymentTypeList.push(item);
        })
        let res = await api.addClaim(obj);
        if(res.code == 0) {
          this.modal = false;
          return this.$message.success("认领成功");
        }
      }else if(this.claimedButtonType == "预付款收回认领") {
        this.setSign({type: "5", accountNo: this.currRow.serviceId});
        this.modal = false;
        this.$refs.settlementadv.Settlement = true;
        console.log(this.$refs.settlementadv.Settlement)
      }
    },
    // 撤回弹窗
    openShow(name) {
      this.reTitle = name;
      this.modalShow = true;
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
