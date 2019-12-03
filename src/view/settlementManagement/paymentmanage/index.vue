<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <quickDate class="mr10" ref="quickDate"></quickDate>
          </div>
          <div class="db ml20">
            <span>转单期间：</span>
            <Date-picker :value="value" type="daterange" placeholder="选择日期" class="w200"></Date-picker>
          </div>
          <div class="db ml20">
            <span>分店名称：</span>
            <i-select v-model="model1" class="w150">
              <i-option
                v-for="item in Branchstore"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</i-option>
            </i-select>
          </div>
          <div class="db ml5">
            <button class="mr10 ivu-btn ivu-btn-default" type="button">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
          <div class="db ml10">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="modal1 = true">
              <i class="iconfont iconcaidan"></i>
              <span>更多</span>
            </button>
          </div>
          <div class="db ml10">
            <Poptip placement="bottom">
              <button class="mr10 ivu-btn ivu-btn-default" type="button">导出</button>
              <div slot="content">
                <button class="mr10 ivu-btn ivu-btn-default" type="button">导出汇总</button>
                <button class="mr10 ivu-btn ivu-btn-default" type="button">导出单据</button>
                <button class="mr10 ivu-btn ivu-btn-default" type="button">导出配件明细</button>
              </div>
            </Poptip>
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="Monthlyreconciliation">月结对账</button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <i-table border :columns="columns" :data="data"></i-table>
        <Tabs active-key="key1" class="mt10">
          <Tab-pane label="销售清单" key="key1">
            <i-table border :columns="columns1" :data="data1" class="mt10"></i-table>
          </Tab-pane>
          <Tab-pane label="采购清单" key="key2">
            <i-table border :columns="columns2" :data="data2" class="mt10"></i-table>
          </Tab-pane>
        </Tabs>
      </div>
    </section>
    <selectDealings ref="selectDealings" />
    <Modal v-model="modal1" title="高级查询" @on-ok="ok" @on-cancel="cancel">
      <div class="db pro mt20">
        <span>转单日期：</span>
        <Date-picker type="date" placeholder="选择日期" class="w100"></Date-picker>
        <i class="ml5 mr5">至</i>
        <Date-picker type="date" placeholder="选择日期" class="w100"></Date-picker>
      </div>
      <div class="db pro mt20">
        <span>客户类型：</span>
        <i-select :model.sync="model1" style="width:200px">
          <i-option v-for="item in typelist" :value="item.value" :key="item.value">{{ item.label }}</i-option>
        </i-select>
      </div>
      <div class="db pro mt20">
        <span>客户名称：</span>
        <input type="text" class="w200" />
      </div>
      <div class="db pro mt20">
        <span>分店名称：</span>
        <i-select  v-model="model1" style="width:200px">
          <i-option v-for="item in Branchstore" :value="item.value" :key="item.value">{{ item.label }}</i-option>
        </i-select>
      </div>
      <div class="db pro mt20">
        <span>业务类型：</span>
        <i-select :model.sync="model1" style="width:200px">
          <i-option v-for="item in business" :value="item.value" :key="item.value">{{ item.label }}</i-option>
        </i-select>
      </div>
      <div class="db pro mt20">
        <span>业务单号：</span>
        <input type="text" class="w200" />
      </div>
    </Modal>
    <Monthlyreconciliation ref="Monthlyreconciliation" />
  </div>
</template>

<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import selectDealings from "./../bill/components/selectCompany";
import Monthlyreconciliation from './Monthlyreconciliation.vue';
import {getStorelist,getreceivable} from '@/api/bill/saleOrder';
import {creat} from './../components'
export default {
  components: {
    quickDate,
    selectDealings,
    Monthlyreconciliation
  },
  data() {
    return {
      value: [],
      model1: "",
      modal1: false,
      flag: false,
      columns: [
        {
          title: "序号",
          key: "id",
          width: 40,
          className: "tc"
        },
        // {
        //   title: "区域",
        //   key: "area",
        //   className: "tc"
        // },
        {
          title: "店号",
          key: "storeid",
          className: "tc"
        },
        {
          title: "客户/供应商名称",
          key: "Customername",
          className: "tc"
        },
        {
          title: "客户/供应商类别",
          key: "Customertype",
          className: "tc"
        },
        {
          title: "对账类别",
          key: "Reconciliationtype",
          className: "tc"
        },
        {
          title: "采购入库",
          key: "Purchasewarehousing",
          className: "tc"
        },
        {
          title: "采购退货",
          key: "Purchasereturns",
          className: "tc"
        },
        {
          title: "销售出库",
          key: "Salesoutlet",
          className: "tc"
        },
        {
          title: "销售退货",
          key: "Salesreturns",
          className: "tc"
        },
        {
          title: "应收应付金额",
          key: "Amountreceivable",
          className: "tc"
        },
        {
          title: "已对账未收金额",
          key: "ReconciledUncollected",
          className: "tc"
        },
        {
          title: "已对账未付金额",
          key: "ReconciledUnpaid",
          className: "tc"
        },
        {
          title: "已对账合计",
          key: "ReconciledTotal",
          className: "tc"
        },
        {
          title: "未对账应收金额",
          key: "Noreconciliationreceivable",
          className: "tc"
        },
        {
          title: "未对账应付金额",
          key: "Noreconciliationcopewith",
          className: "tc"
        },
        {
          title: "未对账合计",
          key: "NoreconciliationTotal",
          className: "tc"
        }
      ],
      columns1: [
        {
          title: "序号",
          key: "id",
          width: 40,
          className: "tc"
        },
        // {
        //   title: "区域",
        //   key: "area",
        //   className: "tc"
        // },
        {
          title: "店号",
          key: "storeid",
          className: "tc"
        },
        {
          title: "客户/供应商名称",
          key: "Customername",
          className: "tc"
        },
        {
          title: "客户供应商类别",
          key: "Customertype",
          className: "tc"
        },
        {
          title: "销售订单号",
          key: "saleid",
          className: "tc"
        },
        {
          title: "出库单号",
          key: "outstockid",
          className: "tc"
        },
        {
          title: "来源",
          key: "source",
          className: "tc"
        },
        {
          title: "业务类型",
          key: "Businesstype",
          className: "tc"
        },
        {
          title: "含税标志",
          key: "Taxmark",
          className: "tc"
        },
        {
          title: "油品/配件",
          key: "Oilaccessories",
          className: "tc"
        },
        {
          title: "转单日期",
          key: "Changeorderdate",
          className: "tc"
        },
        {
          title: "应收金额",
          key: "receivable",
          className: "tc"
        },
        {
          title: "已收金额",
          key: "Accepted",
          className: "tc"
        },
        {
          title: "未收金额",
          key: "Uncollected",
          className: "tc"
        },
        {
          title: "业务员",
          key: "Salesman",
          className: "tc"
        },
        {
          title: "已对账金额",
          key: "Reconciled",
          className: "tc"
        },
        {
          title: "未对账金额",
          key: "Noreconciliation",
          className: "tc"
        },
        {
          title: "草稿金额",
          key: "draft",
          className: "tc"
        },
        {
          title: "备注",
          key: "remarks",
          className: "tc"
        },
        {
          title: "对账门店",
          key: "Reconciliationstore",
          className: "tc"
        },
        {
          title: "对账人",
          key: "Reconciliant",
          className: "tc"
        },
        {
          title: "对账订单",
          key: "Reconciliationorder",
          className: "tc"
        }
      ],
      columns2: [
        {
          title: "序号",
          key: "id",
          width: 40,
          className: "tc"
        },
        // {
        //   title: "区域",
        //   key: "area",
        //   className: "tc"
        // },
        {
          title: "店号",
          key: "storeid",
          className: "tc"
        },
        {
          title: "客户/供应商名称",
          key: "Customername",
          className: "tc"
        },
        {
          title: "客户供应商类别",
          key: "Customertype",
          className: "tc"
        },
        {
          title: "采购订单号",
          key: "Purchaseid",
          className: "tc"
        },
        {
          title: "入库单号",
          key: "Warehousingid",
          className: "tc"
        },
        {
          title: "来源",
          key: "source",
          className: "tc"
        },
        {
          title: "业务类型",
          key: "Businesstype",
          className: "tc"
        },
        {
          title: "含税标志",
          key: "Taxmark",
          className: "tc"
        },
        {
          title: "油品/配件",
          key: "Oilaccessories",
          className: "tc"
        },
        {
          title: "转单日期",
          key: "Changeorderdate",
          className: "tc"
        },
        {
          title: "应付金额",
          key: "copewith",
          className: "tc"
        },
        {
          title: "已付金额",
          key: "paid",
          className: "tc"
        },
        {
          title: "未付金额",
          key: "Unpaid",
          className: "tc"
        },
        {
          title: "业务员",
          key: "Salesman",
          className: "tc"
        },
        {
          title: "已对账金额",
          key: "Reconciled",
          className: "tc"
        },
        {
          title: "未对账金额",
          key: "Noreconciliation",
          className: "tc"
        },
        {
          title: "草稿金额",
          key: "draft",
          className: "tc"
        },
        {
          title: "备注",
          key: "remarks",
          className: "tc"
        },
        {
          title: "对账门店",
          key: "Reconciliationstore",
          className: "tc"
        },
        {
          title: "对账人",
          key: "Reconciliant",
          className: "tc"
        },
        {
          title: "对账订单",
          key: "Reconciliationorder",
          className: "tc"
        }
      ],
      data: [
        {
          id: "1",
          companyname: "上海虹梅南路店",
          reconciliationid: "XS201941445452313",
          collectionpaymentid: "454455454",
          currentcompany: "华胜215店",
          payment: "收",
          paymoney: "35648",
          offset: "121",
          notoffset: "0",
          purpose: "预收款",
          person: "张三",
          time: "2019-09-19",
          remarks: "",
          reviewed: "已审",
          reviewedperson: "王五",
          revieweddate: "2019/10/10"
        }
      ],
      data1: [
        {
          id: "1",
          receivablesid: "XS201941445452313",
          receivablestime: "2019/10/10",
          receivablestype: "现金",
          receivablesaccount: "佳配零部件",
          receivablesmoney: "35648",
          reviewedstate: "已审",
          person: "张三",
          revieweddate: "2019-09-19"
        }
      ],
      data2: [
        {
          id: "1",
          payid: "XS201941445452313",
          paytime: "2019/10/10",
          paytype: "现金",
          payaccount: "佳配零部件",
          paymoney: "35648",
          reviewedstate: "已审",
          person: "张三",
          revieweddate: "2019-09-19"
        }
      ],
      typelist: [
        {
          value: "type1",
          label: "外部"
        },
        {
          value: "type2",
          label: "华胜"
        },
        {
          value: "type3",
          label: "内部"
        }
      ],
      Branchstore: [],
      business: [
        {
          value: 'business1',
          label: '销售出库'
        },
        {
          value: 'business2',
          label: '采购入库'
        },
        {
          value: 'business3',
          label: '采购退货'
        },
        {
          value: 'business4',
          label: '销售退货'
        }
      ]
    };
  },
  async mounted () {
    let arr = await creat (this.$refs.quickDate.val,this.$store)
    getreceivable().then(res=>{
      console.log(res)
    })
    this.value = arr[0];
    this.model1 = arr[1];
    this.Branchstore = arr[2];
  },
  methods: {
    Dealings() {
      this.$refs.selectDealings.openModel();
    },
    Monthlyreconciliation(){
      this.$refs.Monthlyreconciliation.modal = true
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
.ivu-poptip-popper .ivu-poptip-body {
  padding: 0;
  height: 150px;
}
</style>