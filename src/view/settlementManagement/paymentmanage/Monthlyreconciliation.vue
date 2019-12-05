<template>
  <Modal
    v-model="modal"
    title="对账单"
    @on-ok="ok"
    @on-cancel="cancel"
    width="1200"
    @on-visible-change="hander"
  >
    <div class="content-oper content-oper-flex">
      <section class="oper-box mb10">
        <div class="oper-top flex">
          <div class="wlf">
            <div class="db ml20">
              <span>对账门店：</span>
              <i-select v-model="model1" class="w150">
                <i-option
                  v-for="item in Branchstore"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</i-option>
              </i-select>
            </div>
            <div class="db ml20">
              <span>往来单位：</span>
              <input type="text" class="h30" value="车享汽配" />
              <i class="iconfont iconcaidan input" @click="Dealings"></i>
            </div>
            <div class="db ml5">
              <button class="mr10 ivu-btn ivu-btn-default" type="button">
                <i class="iconfont iconchaxunicon"></i>
                <span>查询</span>
              </button>
            </div>
            <div class="db ml10">
              <button class="mr10 ivu-btn ivu-btn-default" type="button">保存草稿</button>
              <button class="mr10 ivu-btn ivu-btn-default" type="button">保存并提交</button>
              <button class="mr10 ivu-btn ivu-btn-default" type="button">导出对账清单</button>
              <button class="mr10 ivu-btn ivu-btn-default" type="button">导出配件明细</button>
            </div>
          </div>
        </div>
      </section>
      <section class="con-box">
        <div class="inner-box">
          <i-table :columns="columns" :data="data" border></i-table>
          <div class="db mt20">
            <h5>应收业务销售出库/退货对账</h5>
            <i-table :columns="columns1" :data="data1" class="tab" border></i-table>
          </div>
          <div class="db mt20">
            <h5>应收业务采购入库/退货对账</h5>
            <i-table :columns="columns1" :data="data2" class="tab" border></i-table>
          </div>
        </div>
      </section>
      <selectDealings ref="selectDealings" />
    </div>
    <div slot="footer"></div>
  </Modal>
</template>

<script>
import selectDealings from "./../bill/components/selectCompany";
import { creat } from "./../components";
import { getReconciliation } from "@/api/bill/saleOrder";
export default {
  components: {
    selectDealings
  },
  data() {
    return {
      modal: false,
      Branchstore: [],
      model1: "",
      columns: [
        {
          title: "已勾选明细统计",
          key: "Detailedstatistics",
          className: "tc"
        },
        {
          title: "不含税对账单",
          key: "Statementexcludingtax",
          className: "tc"
        },
        {
          title: "含税配件对账单",
          key: "Taxincludedpartsstatement",
          className: "tc"
        },
        {
          title: "含税油品对账单",
          key: "Statementoilincludingtax",
          className: "tc"
        }
      ],
      columns1: [
        {
          type: "selection",
          width: 40,
          align: "center"
        },
        {
          title: "序号",
          key: "num",
          width: 40,
          className: "tc"
        },
        {
          title: "客户名称",
          key: "guestName",
          className: "tc"
        },
        {
          title: "日期",
          key: "transferDate",
          className: "tc"
        },
        {
          title: "业务单据号",
          key: "serviceId",
          width: 120,
          className: "tc"
        },
        {
          title: "来源",
          key: "serviceSourceName",
          className: "tc"
        },
        {
          title: "业务类型",
          key: "serviceTypeName",
          className: "tc"
        },
        {
          title: "含税标志",
          key: "taxSignName",
          className: "tc"
        },
        {
          title: "油品/配件",
          key: "speciesName",
          className: "tc"
        },
        {
          title: "单据金额",
          key: "rpAmt",
          className: "tc"
        },
        {
          title: "前期已对账金额",
          key: "accountAmt",
          className: "tc"
        },
        {
          title: "前期未对账金额",
          key: "noAccountAmt",
          className: "tc"
        },
        {
          title: "本次不对账金额",
          key: "thisNoAccountAmt",
          className: "tc"
        },
        {
          title: "本次对账金额",
          key: "thisAccountAmt",
          className: "tc"
        }
      ],
      data: [],
      data1: [],
      data2: [],
      parameter: {}
    };
  },
  async mounted() {
    let arr = await creat([], this.$store);
    this.value = arr[0];
    this.model1 = arr[1];
    this.Branchstore = arr[2];
  },
  methods: {
    hander() {
      let { orgId, startDate, endDate, guestId } = this.parameter;
      let obj = { orgId, startDate, endDate, guestId };
      getReconciliation(obj).then(res => {
        console.log(res)
        let Statementexcludingtax = 0;
        let Taxincludedpartsstatement = 0;
        let Statementoilincludingtax = 0;
        let Statementexcludingtax1 = 0;
        let Taxincludedpartsstatement1 = 0;
        let Statementoilincludingtax1 = 0;
        for (let i of res.data.one) {
          if (i.number === 1) {
            Statementexcludingtax = i.accountNo;
            Statementexcludingtax1 = i.accountSumAmt;
          } else if (i.number === 2) {
            Taxincludedpartsstatement = i.accountNo;
            Taxincludedpartsstatement1 = i.accountSumAmt;
          } else {
            Statementoilincludingtax = i.accountNo;
            Statementoilincludingtax1 = i.accountSumAmt;
          }
        }
        this.data = [
          {
            Detailedstatistics: "对账单号",
            Statementexcludingtax,
            Taxincludedpartsstatement,
            Statementoilincludingtax
          },
          {
            Detailedstatistics: "对账金额",
            Statementexcludingtax: Statementexcludingtax1,
            Taxincludedpartsstatement: Taxincludedpartsstatement1,
            Statementoilincludingtax: Statementoilincludingtax1
          }
        ];
        this.data1 = res.data.two;
        this.data2 = res.data.three;
      });
    },
    Dealings() {
      this.$refs.selectDealings.openModel();
    },
    ok() {},
    cancel() {}
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
.tab {
  max-height: 400px;
  overflow: auto;
}
</style>