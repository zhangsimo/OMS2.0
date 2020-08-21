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
            <span>查询期间：</span>
            <Date-picker
              :value="value"
              type="daterange"
              placeholder="选择日期"
              class="w200"
              @on-change="dateChange"
            ></Date-picker>
          </div>
          <div class="db ml20">
            <span>分店名称：</span>
            <Select v-model="model1" class="w150">
              <Option
                v-for="item in Branchstore"
                :value="item.id"
                :key="item.id"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db ml20">
            <span>往来单位：</span>
            <input type="text" class="h30" :value="companyDealings" readonly/>
            <i class="iconfont iconcaidan input" @click="Dealings"></i>
          </div>
          <div class="db ml20">
            <span>收付款单号：</span>
            <input type="text" class="h30" v-model="collectPayId" />
          </div>
          <div class="db ml20">
            <span>对账单号：</span>
            <input type="text" class="h30" v-model="reconciliationId" />
          </div>
          <div class="db ml5">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="quick">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
          <div class="db ml10">
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="examine"
              v-has="'audit'"
            >审核</button>
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="revokecapital"
              v-has="'revoke'"
            >撤销</button>
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="report"
              v-has="'export'"
            >导出</button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <Tabs v-model="tabName" class="mt10 waytable" @click="tab">
          <Tab-pane label="应收审核" name="key1">
            <Table
              border
              :columns="columns"
              :data="data1"
              class="mt10"
              max-height="400"
              highlight-row
              @on-row-click="selectExamine"
              ref="collectExamine"
            ></Table>
          </Tab-pane>
          <Tab-pane label="应付审核" name="key2">
            <Table
              border
              :columns="columns1"
              :data="data2"
              class="mt10"
              max-height="400"
              highlight-row
              @on-row-click="selectExamine"
              ref="payExamine"
            ></Table>
          </Tab-pane>
        </Tabs>
      </div>
    </section>
    <selectDealings ref="selectDealings" @selectSupplierName="getOne" />
    <Modal v-model="capitalexamine" title="资金审核" @on-ok="confirmExamine">
      <p class="tc">确认审核?</p>
    </Modal>
    <Modal v-model="revoke" title="资金审核撤销" @on-ok="confirmRemove">
      <div class="db flex">
        <span>撤销原因：</span>
        <Input
          v-model="revokeReason"
          type="text"
          class="w300"
          @on-change="removeChange"
          placeholder="只能输入100字以内"
        />
      </div>
    </Modal>
  </div>
</template>
<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import selectDealings from "./../bill/components/selectCompany";
import moment from "moment";
import { creat } from "./../components";
import { capitalAudit, examineBtn, revokeBtn } from "@/api/bill/saleOrder";
export default {
  components: {
    selectDealings,
    quickDate
  },
  async mounted() {
    let arr = await creat(this.$refs.quickDate.val, this.$store);
    this.value = arr[0];
    this.model1 = arr[1];
    this.getShop()
    this.Branchstore.map(itm => {
        this.$refs.registrationEntry.orgName = itm.name;
    });
    let obj = {
      startDate: this.value[0]
        ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
        : "",
      endDate: this.value[1]
        ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
        : "",
      orgId: this.model1
    };
    this.getcapitalAudit(obj);
  },
  data() {
    return {
      tabName: "key1",
      collectPayId: "",
      reconciliationId: "",
      companyDealings: "",
      companyDealingsId: "",
      capitalexamine: false,
      revoke: false,
      revokeReason: "",
      columns: [
        {
          title: "序号",
          type: "index",
          width: 40,
          className: "tc"
        },
        {
          title: "收款单号",
          key: "fno",
          className: "tc"
        },
        {
          title: "对账单单号",
          key: "serviceId",
          className: "tc"
        },
        {
          title: "往来单位",
          key: "guestName",
          className: "tc"
        },
        {
          title: "收付类型",
          key: "sortName",
          className: "tc"
        },
        {
          title: "核销方式",
          key: "furposeName",
          className: "tc"
        },
        {
          title: "对账应收",
          key: "accountsReceivable",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.accountsReceivable.toFixed(2));
          }
        },
        {
          title: "应收返利",
          key: "receivableRebate",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.receivableRebate.toFixed(2));
          }
        },
        {
          title: "应收坏账",
          key: "badDebtReceivable",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.badDebtReceivable.toFixed(2));
          }
        },
        {
          title: "对账应付",
          key: "reconciliation",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.reconciliation.toFixed(2));
          }
        },
        {
          title: "应付返利",
          key: "dealingRebates",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.dealingRebates.toFixed(2));
          }
        },
        {
          title: "应付坏账",
          key: "badDebtPaying",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.badDebtPaying.toFixed(2));
          }
        },
        {
          title: "其他应收款",
          key: "otherAmt",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.otherAmt.toFixed(2));
          }
        },
        {
          title: "预收账款",
          key: "advanceReceipt",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.advanceReceipt.toFixed(2));
          }
        },
        {
          title: "收款合计",
          key: "sumAmt",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.sumAmt.toFixed(2));
          }
        },
        {
          title: "现金",
          key: "cashAmt",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.cashAmt.toFixed(2));
          }
        },
        {
          title: "A卡",
          key: "acardAmt",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.acardAmt.toFixed(2));
          }
        },
        {
          title: "B卡",
          key: "bcardAmt",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.bcardAmt.toFixed(2));
          }
        },
        {
          title: "C卡",
          key: "ccardAmt",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.ccardAmt.toFixed(2));
          }
        },
        {
          title: "D卡",
          key: "dcardAmt",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.dcardAmt.toFixed(2));
          }
        },
        {
          title: "基本开户A",
          key: "abasicAmt",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.abasicAmt.toFixed(2));
          }
        },
        {
          title: "基本开户B",
          key: "bbasicAmt",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.bbasicAmt.toFixed(2));
          }
        },
        {
          title: "一般户A",
          key: "aordinaryAmt",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.aordinaryAmt.toFixed(2));
          }
        },
        {
          title: "一般户B",
          key: "bordinaryAmt",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.bordinaryAmt.toFixed(2));
          }
        },
        {
          title: "运费",
          key: "freightAmt",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.freightAmt.toFixed(2));
          }
        },
        {
          title: "手续费",
          key: "formalitiesAmt",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.formalitiesAmt.toFixed(2));
          }
        },
        {
          title: "利息收入",
          key: "interestIncomeAmt",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.interestIncomeAmt.toFixed(2));
          }
        },
        {
          title: "利息支出",
          key: "interestExpenseAmt",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.interestExpenseAmt.toFixed(2));
          }
        },
        {
          title: "代收代付",
          key: "paymentAmt",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.paymentAmt.toFixed(2));
          }
        },
        {
          title: "收款所属门店",
          key: "orgName",
          className: "tc"
        },
        {
          title: "收款人",
          key: "collectionName",
          className: "tc"
        },
        {
          title: "收款日期",
          key: "receiptDate",
          className: "tc"
        },
        {
          title: "备注",
          key: "remark",
          className: "tc"
        }
      ],
      columns1: [
        {
          title: "序号",
          type: "index",
          width: 40,
          className: "tc"
        },
        {
          title: "付款单号",
          key: "fno",
          className: "tc"
        },
        {
          title: "对账单单号",
          key: "serviceId",
          className: "tc"
        },
        {
          title: "往来单位",
          key: "guestName",
          className: "tc"
        },
        {
          title: "收付类型",
          key: "sortName",
          className: "tc"
        },
        {
          title: "核销方式",
          key: "furposeName",
          className: "tc"
        },
        {
          title: "对账应收",
          key: "accountsReceivable",
          className: "tc"
        },
        {
          title: "应收返利",
          key: "receivableRebate",
          className: "tc"
        },
        {
          title: "应收坏账",
          key: "badDebtReceivable",
          className: "tc"
        },
        {
          title: "对账应付",
          key: "reconciliation",
          className: "tc"
        },
        {
          title: "应付返利",
          key: "dealingRebates",
          className: "tc"
        },
        {
          title: "应付坏账",
          key: "badDebtPaying",
          className: "tc"
        },
        {
          title: "其他应付款",
          key: "otherAmt",
          className: "tc"
        },
        {
          title: "预付账款",
          key: "advanceReceipt",
          className: "tc"
        },
        {
          title: "付款合计",
          key: "sumAmt",
          className: "tc"
        },
        {
          title: "现金",
          key: "cashAmt",
          className: "tc"
        },
        {
          title: "A卡",
          key: "aCardAmt",
          className: "tc"
        },
        {
          title: "B卡",
          key: "bCardAmt",
          className: "tc"
        },
        {
          title: "C卡",
          key: "cCardAmt",
          className: "tc"
        },
        {
          title: "D卡",
          key: "dCardAmt",
          className: "tc"
        },
        {
          title: "基本开户A",
          key: "aBasicAmt",
          className: "tc"
        },
        {
          title: "基本开户B",
          key: "bBasicAmt",
          className: "tc"
        },
        {
          title: "一般户A",
          key: "aOrdinaryAmt",
          className: "tc"
        },
        {
          title: "一般户B",
          key: "bOrdinaryAmt",
          className: "tc"
        },
        {
          title: "运费",
          key: "freightAmt",
          className: "tc"
        },
        {
          title: "手续费",
          key: "formalitiesAmt",
          className: "tc"
        },
        {
          title: "利息收入",
          key: "interestIncomeAmt",
          className: "tc"
        },
        {
          title: "利息支出",
          key: "interestExpenseAmt",
          className: "tc"
        },
        {
          title: "代收代付",
          key: "paymentAmt",
          className: "tc"
        },
        {
          title: "付款所属门店",
          key: "orgName",
          className: "tc"
        },
        {
          title: "付款人",
          key: "collectionName",
          className: "tc"
        },
        {
          title: "付款日期",
          key: "receiptDate",
          className: "tc"
        },
        {
          title: "备注",
          key: "remark",
          className: "tc"
        }
      ],
      Branchstore: [],
      value: [],
      model1: "",
      data1: [],
      data2: [],
      row: {}
    };
  },
  methods: {
    //获取门店
    async getShop(){
      let data ={}
      data.supplierTypeSecond = this.model1
      this.Branchstore = [{id:0 , name:'全部'}]
      let res = await goshop(data)
      if (res.code === 0) {
        this.Branchstore = [...this.Branchstore , ...res.data]
        this.$nextTick( () => {
            this.BranchstoreId = this.$store.state.user.userData.shopId
        })
        if (this.$store.state.user.userData.shopkeeper != 0){
          this.getThisArea()//获取当前门店地址
        }
      }
    },
    // 日期选择
    dateChange(data) {
      this.value = data;
    },
    // 撤销原因
    removeChange(event) {
      if (event.target.value.length < 100) {
        this.revokeReason = event.target.value;
      } else {
        this.$message.error("只能输入100字以内");
      }
    },
    // 往来单位
    getOne(data) {
      this.companyDealings = data.shortName;
      this.companyDealingsId = data.id;
    },
    // 查询
    quick() {
      let obj = {
        fno: this.collectPayId,
        serviceId: this.reconciliationId,
        startDate: this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endDate: this.value[1]
          ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        orgId: this.model1,
        guestId: this.companyDealingsId
      };
      this.getcapitalAudit(obj);
    },
    //审核数据接口
    getcapitalAudit(obj) {
      capitalAudit().then(res => {
        if (res.data.one.length !== 0) {
          res.data.one.map((item, index) => {
            item.num = index + 1;
            item.sortName = item.sort.name;
            if (item.furpose) {
              item.furposeName = item.furpose.name;
            }
          });
          this.data1 = res.data.one;
        }
        if (res.data.two.lenght !== 0) {
          res.data.two.map((item, index) => {
            item.num = index + 1;
            item.sortName = item.sort.name;
            if (item.furpose) {
              item.furposeName = item.furpose.name;
            }
          });
          this.data2 = res.data.two;
        }
      });
    },
    // 快速查询(日期)
    quickDate(data) {
      this.value = data;
      let obj = {
        startDate: this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endDate: this.value[1]
          ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        orgId: this.model1
      };
      this.getcapitalAudit(obj);
    },
    // 往来单位
    Dealings() {
      this.$refs.selectDealings.init();
    },
    // 确认审核
    confirmExamine() {
      let obj = {
        guestId: this.row.guestId,
        checkId: this.row.checkId,
        orgId: this.model1,
        fno: this.row.fno,
        id: this.row.id,
        sort: this.row.sort.value,
        serviceId: this.row.serviceId
      };
      examineBtn(obj).then(res => {
        if (res.code === "0") {
          location.reload();
        } else {
          this.$message.error("审核失败");
        }
      });
    },
    // 选中数据
    selectExamine(row) {
      this.row = row;
    },
    // 审核按钮
    examine() {
      if (Object.keys(this.row).length !== 0) {
        this.capitalexamine = true;
      } else {
        this.$message.error("请选择审核的数据");
      }
    },
    // 撤销按钮
    revokecapital() {
      if (Object.keys(this.row).length !== 0) {
        this.revoke = true;
      } else {
        this.$message.error("请选择撤销的数据");
      }
    },
    // 导出
    report() {
      if (this.tabName === "key1") {
        if (this.data1.length !== 0) {
          this.$refs.collectExamine.exportCsv({
            filename: "应收审核"
          });
        } else {
          this.$message.error("应收审核暂无数据");
        }
      } else if (this.tabName === "key2") {
        if (this.data2.length !== 0) {
          this.$refs.payExamine.exportCsv({
            filename: "应付审核"
          });
        } else {
          this.$message.error("应付审核暂无数据");
        }
      }
    },
    // 当前标签页的name
    tab(name) {
      this.tabName = name;
    },
    // 确认撤销
    confirmRemove() {
      revokeBtn({
        id: this.row.id,
        remark: this.revokeReason,
        orgId: this.model1,
        guestId: this.row.guestId,
        fno: this.row.fno,
        serviceId: this.row.serviceId
      }).then(res => {
        console.log(res);
      });
    }
  }
};
</script>
<style lang="less" scoped>
.oper-top input {
  border: 1px solid #dddddd;
  text-indent: 4px;
}
.oper-top .input {
  position: relative;
  left: -26px;
  bottom: -5px;
}
.inner-box {
  overflow-x: scroll;
}
.waytable {
  width: 4000px;
}
</style>
