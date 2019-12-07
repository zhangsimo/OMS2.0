<template>
  <div class="db">
    <Modal v-model="modal" title="对账单" width="1200" @on-visible-change="hander">
      <div class="content-oper content-oper-flex">
        <section class="oper-box mb10">
          <div class="oper-top flex">
            <div class="wlf">
              <div class="db ml20">
                <span>对账门店：</span>
                <Select v-model="model1" class="w150">
                  <Option
                    v-for="item in Branchstore"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </div>
              <div class="db ml20">
                <span>往来单位：</span>
                <input type="text" class="h30" :value="companyInfo" />
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
            <Table :columns="columns" :data="data" border max-height="400"></Table>
            <div class="db mt20">
              <h5>应收业务销售出库/退货对账</h5>
              <Table
                :columns="columns1"
                :data="data1"
                border
                max-height="400"
                @on-select="collectCheckout"
                @on-select-all="collectCheckoutAll"
                @on-select-cancel="collectNoCheckout"
                @on-select-all-cancel="collectNoCheckoutAll"
              ></Table>
            </div>
            <div class="db mt20">
              <h5>应付业务采购入库/退货对账</h5>
              <Table
                :columns="columns1"
                :data="data2"
                border
                max-height="400"
                @on-select="paymentCheckout"
                @on-select-all="paymentCheckoutAll"
                @on-select-cancel="paymentNoCheckout"
                @on-select-all-cancel="paymentNoCheckoutAll"
              ></Table>
            </div>
            <div class="flex mt20">
              <div class="totalcollect p10">
                <span class="mr5">应收合计</span>
                <input type="text" v-model="totalcollect" disabled class="w60 mr10 tc" />
                <span class="mr5">应收坏账</span>
                <input type="number" v-model.number="collectBaddebt" class="w60 mr10 tc" />
                <span class="mr5">应收返利</span>
                <input type="number" v-model.number="collectRebate" class="w60 mr10 tc" />
                <span class="mr5" style="color:#f66">实际应收合计</span>
                <input v-model="Actualtotalcollect" type="text" class="w60 mr10 tc" disabled />
              </div>
              <div class="totalpayment p10 ml10">
                <span class="mr5">应付合计</span>
                <input type="text" v-model="totalpayment" disabled class="w60 mr10 tc" />
                <span class="mr5">应付坏账</span>
                <input
                  type="number"
                  v-model.number="paymentBaddebt"
                  class="w60 mr10 tc"
                  @change="paymentBaddebt"
                />
                <span class="mr5">应付返利</span>
                <input type="number" v-model.number="paymentRebate" class="w60 mr10 tc" />
                <span class="mr5" style="color:#f66">实际应付合计</span>
                <input :value="Actualtotalpayment" type="text" class="w60 mr10 tc" disabled />
              </div>
            </div>
            <div class="db total mt20 p10">
              <span class="mr5">本次对账结算合计(整数收款)</span>
              <input type="text" v-model="Reconciliationtotal" disabled class="w60 mr10 tc" />
              <span class="mr5">计划结算类型</span>
              <Select class="w100 mr10" v-model="totalvalue">
                <Option
                  v-for="item in SettlementType"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
              <span class="mr5">应收返利请示单号</span>
              <input type="text" v-model="Rebateid" class="w60 mr10 tc" />
              <span class="mr5">应收坏账请示单号</span>
              <input type="text" v-model="BadDebtid" class="w60 mr10 tc" />
              <span class="mr5">备注</span>
              <input type="text" v-model="remark" class="w60 mr10 tc" />
            </div>
          </div>
        </section>
        <selectDealings ref="selectDealings" @getOne="getOne"/>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="Reconciliation" title="本次不对账" width="1200" @on-ok="noReconciliation">
      <div class="flex mb20">
        <span class="mr5">门店</span>
        <input type="text" disabled class="w140 mr15 tc" :value="store">
        <span class="mr5">单据编号</span>
        <input type="text" disabled class="w180 mr15 tc" :value="bill">
        <span class="mr5">业务类型</span>
        <input type="text" disabled class="w140 mr15 tc" :value="business">
        <span class="mr5">往来单位信息</span>
        <input type="text" disabled class="w140 mr15 tc" :value="companyInfo">
        <span class="mr5">单据日期</span>
        <input type="text" disabled class="w140 mr15 tc" :value="billDate">
      </div>
      <Table :columns="Reconciliationlist" :data="Reconciliationcontent" border max-height="400"></Table>
    </Modal>
  </div>
</template>

<script>
import selectDealings from "./../bill/components/selectCompany";
import { creat } from "./../components";
import { getReconciliation,getSettlement } from "@/api/bill/saleOrder";
export default {
  components: {
    selectDealings
  },
  data() {
    return {
      store:'',
      bill:'',
      business:'',
      companyInfo:'',
      billDate:'',
      Rebateid: "", //返利单号
      BadDebtid: "", //坏帐单号
      remark: "", //备注
      totalpayment: 0, //应付合计
      paymentBaddebt: 0, //应付坏账
      paymentRebate: 0, //应付返利
      totalcollect: 0, //应收合计
      collectBaddebt: 0, //应收坏账
      collectRebate: 0, //应收返利
      Reconciliation: false,
      modifyAccountAmt: 0,
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
          className: "tc",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  cursor: "pointer",
                  color: "#87CEFA"
                },
                on: {
                  click: () => {
                    this.Reconciliation = true;
                    this.Reconciliationcontent= params.row.detailDtoList
                    this.store = params.row.orgId
                    this.bill = params.row.serviceId
                    this.business = params.row.serviceType
                    this.companyInfo = '车'
                    this.billDate = params.row.transferDate
                  }
                }
              },
              params.row.thisNoAccountAmt
            );
          }
        },
        {
          title: "本次对账金额",
          key: "thisAccountAmt",
          className: "tc"
        }
      ],
      SettlementType: [
        {
          value: "FK",
          label: "付款"
        },
        {
          value: "DC",
          label: "对冲"
        },
        {
          value: "SK",
          label: "收款"
        }
      ],
      Reconciliationlist: [
        {
          title: "序号",
          key: "num",
          width: '40',
          className: "tc"
        },
        {
          title: "配件编码",
          key: "partCode",
          className: "tc"
        },
        {
          title: "配件名称",
          key: "partName",
          className: "tc"
        },
        {
          title: "规格型号",
          key: "partSpecification",
          className: "tc"
        },
        {
          title: "适用车型",
          key: "Detailedstatistics",
          className: "tc"
        },
        {
          title: "单价",
          key: "price",
          className: "tc"
        },
        {
          title: "数量",
          key: "quantity",
          className: "tc"
        },
        {
          title: "金额",
          key: "amount",
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
          className: "tc",
          render: (h, params) => {
            return h("Input", {
              style: {
                width: "60px"
              },
              props: {
                value: params.row.thisNoAccountAmt
              },
              on: {
                'on-change': (event)=>{
                  this.modifyAccountAmt = event.target.value
                  console.log(params.row)
                  // 配件金额-前期已对账金额-本次不对账金额
                  params.row.thisAccountAmt = params.row
                }
              }
            });
          }
        },
        {
          title: "本次对账金额",
          key: "thisAccountAmt",
          className: "tc"
        },
        {
          title: "差异原因",
          key: "diffeReason",
          className: "tc",
          render: (h, params) => {
            return h("Input", {
              style: {
                width: "60px"
              },
              props: {
                value: ""
              }
            });
          }
        }
      ],
      data: [],
      data1: [],
      data2: [],
      Reconciliationcontent: [],
      parameter: {},
      paymentlist: [],
      collectlist: []
    };
  },
  async mounted() {
    let arr = await creat([], this.$store);
    this.value = arr[0];
    this.model1 = arr[1];
    this.Branchstore = arr[2];
  },
  computed: {
    Actualtotalpayment() {
      this.paymentBaddebt = this.paymentBaddebt ? this.paymentBaddebt : 0;
      this.totalpayment = this.totalpayment ? this.totalpayment : 0;
      return this.totalpayment - this.paymentBaddebt - this.paymentRebate;
    },
    Actualtotalcollect (){
      this.paymentBaddebt = this.paymentBaddebt ? this.paymentBaddebt : 0;
      this.totalpayment = this.totalpayment ? this.totalpayment : 0;
      return this.totalcollect - this.collectBaddebt - this.collectRebate;
    },
    Reconciliationtotal (){
      return this.Actualtotalcollect - this.Actualtotalpayment
    },
    totalvalue (){
      if (this.paymentlist.length !== 0 || this.collectlist.length !== 0) {
        if (this.Reconciliationtotal > 0){
          return 'SK'
        } else if(this.Reconciliationtotal < 0) {
          return 'FK'
        } else {
          return 'DC'
        }
      } else {
        return 'SK'
      }
    }
  },
  methods: {
    // 对账单弹框出现加载数据
    hander() {
      let { orgId, startDate, endDate, guestId } = this.parameter;
      let obj = { orgId, startDate, endDate, guestId };
      getReconciliation(obj).then(res => {
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
        if (res.data.two.length !== 0) {
          let num = 0;
          let rpAmt = 0;
          let accountAmt = 0;
          let noAccountAmt = 0;
          let thisNoAccountAmt = 0;
          let thisAccountAmt = 0;
          res.data.two.map(item => {
            item.num = ++num;
            item.serviceTypeName = item.serviceType.name;
            item.speciesName = item.species.name;
            rpAmt += item.rpAmt;
            accountAmt += item.accountAmt;
            noAccountAmt += item.noAccountAmt;
            thisNoAccountAmt += item.thisNoAccountAmt;
            thisAccountAmt += item.thisAccountAmt;
          });
          this.data1 = res.data.two;
          this.data1.push({
            num: "合计",
            rpAmt,
            accountAmt,
            noAccountAmt,
            thisNoAccountAmt,
            thisAccountAmt
          });
        }
        if (res.data.three.length !== 0) {
          let num = 0;
          let rpAmt = 0;
          let accountAmt = 0;
          let noAccountAmt = 0;
          let thisNoAccountAmt = 0;
          let thisAccountAmt = 0;
          res.data.three.map(item => {
            item.num = ++num;
            item.serviceTypeName = item.serviceType.name;
            item.speciesName = item.species.name;
            rpAmt += item.rpAmt;
            accountAmt += item.accountAmt;
            noAccountAmt += item.noAccountAmt;
            thisNoAccountAmt += item.thisNoAccountAmt;
            thisAccountAmt += item.thisAccountAmt;
          });
          this.data2 = res.data.three;
          this.data2.push({
            num: "合计",
            rpAmt,
            accountAmt,
            noAccountAmt,
            thisNoAccountAmt,
            thisAccountAmt
          });
        }
      });
    },
    getOne (data) {
      this.companyInfo = data.shortName
    },
    // 往来单位
    Dealings() {
      this.$refs.selectDealings.openModel();
    },
    // 已勾选结算类型计算
    getSettlementComputed () {
      getSettlement({one:this.collectlist,two:this.paymentlist}).then(res=>{
        this.$set(this.data,1 ,{
            Detailedstatistics: "对账金额",
            Statementexcludingtax: res.data.one,
            Taxincludedpartsstatement: res.data.two,
            Statementoilincludingtax: res.data.three
          })
      })
    },
    // 应付选中
    paymentCheckout(selection, row) {
      this.paymentlist = selection
      this.totalpayment = 0;
      selection.map(item => {
        this.totalpayment += item.thisAccountAmt;
      });
      this.getSettlementComputed()
    },
    // 应收选中
    collectCheckout(selection, row) {
      this.collectlist = selection
      this.totalcollect = 0;
      this.Actualtotalcollect = 0;
      selection.map(item => {
        this.totalcollect += item.thisAccountAmt;
      });
      this.getSettlementComputed()
    },
    // 应收全选
    collectCheckoutAll(selection) {
      this.collectlist = selection
      this.totalcollect = selection[selection.length-1].thisAccountAmt;
      this.getSettlementComputed()
    },
    // 应付全选
    paymentCheckoutAll(selection) {
      this.paymentlist = selection
      this.totalpayment = selection[selection.length-1].thisAccountAmt;
      this.getSettlementComputed()
    },
    // 应付取消选中
    paymentNoCheckout(selection, row) {
      this.paymentlist = selection
      this.totalpayment -= row.thisAccountAmt;
      this.getSettlementComputed()
    },
    // 应收取消选中
    collectNoCheckout(selection, row) {
      this.collectlist = selection
      this.totalcollect -= row.thisAccountAmt;
      this.getSettlementComputed()
    },
    // 应付取消全选
    paymentNoCheckoutAll() {
      this.paymentlist = []
      this.totalpayment = 0;
      this.Actualtotalpayment = 0;
      this.getSettlementComputed()
    },
    // 应收取消全选
    collectNoCheckoutAll() {
      this.collectlist = 0
      this.totalcollect = 0;
      this.Actualtotalcollect = 0;
      this.getSettlementComputed()
    },
    // 本次不对帐金额弹窗
    noReconciliation (){
      console.log(this.modifyAccountAmt)
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
.totalcollect,
.totalpayment,
.total {
  border: 1px solid #dddddd;
}
</style>