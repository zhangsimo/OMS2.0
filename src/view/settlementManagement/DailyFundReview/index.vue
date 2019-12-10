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
            <Date-picker :value="value" type="daterange" placeholder="选择日期" class="w200"></Date-picker>
          </div>
          <div class="db ml20">
            <span>分店名称：</span>
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
            <input type="text" class="h30" value="车享汽配" />
            <i class="iconfont iconcaidan input" @click="Dealings"></i>
          </div>
          <div class="db ml20">
            <span>收付款单号：</span>
            <input type="text" class="h30" />
          </div>
          <div class="db ml20">
            <span>对账单号：</span>
            <input type="text" class="h30" />
          </div>
          <div class="db ml5">
            <button class="mr10 ivu-btn ivu-btn-default" type="button">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
          <div class="db ml10">
            <button class="mr10 ivu-btn ivu-btn-default" type="button">审核</button>
            <button class="mr10 ivu-btn ivu-btn-default" type="button">撤销</button>
            <button class="mr10 ivu-btn ivu-btn-default" type="button">导出</button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <Tabs active-key="key1" class="mt10 waytable">
          <Tab-pane label="应收审核" key="key1">
            <Table border :columns="columns" :data="data1" class="mt10" max-height="400"></Table>
          </Tab-pane>
          <Tab-pane label="应付审核" key="key2">
            <Table border :columns="columns1" :data="data2" class="mt10" max-height="400"></Table>
          </Tab-pane>
        </Tabs>
      </div>
    </section>
    <selectDealings ref="selectDealings" />
  </div>
</template>
<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import selectDealings from "./../bill/components/selectCompany";
import {creat} from './../components'
import {capitalAudit} from "@/api/bill/saleOrder";
export default {
  components: {
    selectDealings,
    quickDate
  },
  async mounted () {
    let arr = await creat (this.$refs.quickDate.val,this.$store)
    this.value = arr[0];
    this.model1 = arr[1];
    this.Branchstore = arr[2];
    capitalAudit().then(res=>{
      console.log(res)
      if(res.data.one.length !==0){
        res.data.one.map((item,index)=>{
          item.num = index + 1
          item.sortName = item.sort.name
          item.furposeName = item.furpose.name
        })
        this.data1 = res.data.one
      }
      if(res.data.two.lenght !==0){
        res.data.two.map((item,index)=>{
          item.num = index + 1
          item.sortName = item.sort.name
          item.furposeName = item.furpose.name
        })
        this.data2 = res.data.two
      }
    })
  },
  data() {
    return {
      columns: [
        {
          title: '序号',
          key: 'num',
          width: 40,
          className: 'tc'
        },
        {
          title: '收款单号',
          key: 'fno',
          className: 'tc'
        },
        {
          title: '对账单单号',
          key: 'serviceId',
          className: 'tc'
        },
        {
          title: '往来单位',
          key: 'guestName',
          className: 'tc'
        },
        {
          title: '收付类型',
          key: 'sortName',
          className: 'tc'
        },
        {
          title: '核销方式',
          key: 'furposeName',
          className: 'tc'
        },
        {
          title: '对账应收',
          key: 'accountsReceivable',
          className: 'tc'
        },
        {
          title: '应收返利',
          key: 'receivableRebate',
          className: 'tc'
        },
        {
          title: '应收坏账',
          key: 'badDebtReceivable',
          className: 'tc'
        },
        {
          title: '对账应付',
          key: 'reconciliation',
          className: 'tc'
        },
        {
          title: '应付返利',
          key: 'dealingRebates',
          className: 'tc'
        },
        {
          title: '应付坏账',
          key: 'badDebtPaying',
          className: 'tc'
        },
        {
          title: '其他应收款',
          key: 'otherAmt',
          className: 'tc'
        },
        {
          title: '预收账款',
          key: 'advanceReceipt',
          className: 'tc'
        },
        {
          title: '收款合计',
          key: 'sumAmt',
          className: 'tc'
        },
        {
          title: '现金',
          key: 'cashAmt',
          className: 'tc'
        },
        {
          title: 'A卡',
          key: 'aCardAmt',
          className: 'tc'
        },
        {
          title: 'B卡',
          key: 'bCardAmt',
          className: 'tc'
        },
        {
          title: 'C卡',
          key: 'cCardAmt',
          className: 'tc'
        },
        {
          title: 'D卡',
          key: 'dCardAmt',
          className: 'tc'
        },
        {
          title: '基本开户A',
          key: 'aBasicAmt',
          className: 'tc'
        },
        {
          title: '基本开户B',
          key: 'bBasicAmt',
          className: 'tc'
        },
        {
          title: '一般户A',
          key: 'aOrdinaryAmt',
          className: 'tc'
        },
        {
          title: '一般户B',
          key: 'bOrdinaryAmt',
          className: 'tc'
        },
        {
          title: '运费',
          key: 'freightAmt',
          className: 'tc'
        },
        {
          title: '手续费',
          key: 'formalitiesAmt',
          className: 'tc'
        },
        {
          title: '利息收入',
          key: 'interestIncomeAmt',
          className: 'tc'
        },
        {
          title: '利息支出',
          key: 'interestExpenseAmt',
          className: 'tc'
        },
        {
          title: '代收代付',
          key: 'paymentAmt',
          className: 'tc'
        },
        {
          title: '收款所属门店',
          key: 'orgName',
          className: 'tc'
        },
        {
          title: '收款人',
          key: 'collectionName',
          className: 'tc'
        },
        {
          title: '收款日期',
          key: 'receiptDate',
          className: 'tc'
        },
        {
          title: '备注',
          key: 'remark',
          className: 'tc'
        }
      ],
      columns1: [
        {
          title: '序号',
          key: 'num',
          width: 40,
          className: 'tc'
        },
        {
          title: '付款单号',
          key: 'fno',
          className: 'tc'
        },
        {
          title: '对账单单号',
          key: 'serviceId',
          className: 'tc'
        },
        {
          title: '往来单位',
          key: 'guestName',
          className: 'tc'
        },
        {
          title: '收付类型',
          key: 'sortName',
          className: 'tc'
        },
        {
          title: '核销方式',
          key: 'furposeName',
          className: 'tc'
        },
        {
          title: '对账应收',
          key: 'accountsReceivable',
          className: 'tc'
        },
        {
          title: '应收返利',
          key: 'receivableRebate',
          className: 'tc'
        },
        {
          title: '应收坏账',
          key: 'badDebtReceivable',
          className: 'tc'
        },
        {
          title: '对账应付',
          key: 'reconciliation',
          className: 'tc'
        },
        {
          title: '应付返利',
          key: 'dealingRebates',
          className: 'tc'
        },
        {
          title: '应付坏账',
          key: 'badDebtPaying',
          className: 'tc'
        },
        {
          title: '其他应付款',
          key: 'otherAmt',
          className: 'tc'
        },
        {
          title: '预付账款',
          key: 'advanceReceipt',
          className: 'tc'
        },
        {
          title: '付款合计',
          key: 'sumAmt',
          className: 'tc'
        },
        {
          title: '现金',
          key: 'cashAmt',
          className: 'tc'
        },
        {
          title: 'A卡',
          key: 'aCardAmt',
          className: 'tc'
        },
        {
          title: 'B卡',
          key: 'bCardAmt',
          className: 'tc'
        },
        {
          title: 'C卡',
          key: 'cCardAmt',
          className: 'tc'
        },
        {
          title: 'D卡',
          key: 'dCardAmt',
          className: 'tc'
        },
        {
          title: '基本开户A',
          key: 'aBasicAmt',
          className: 'tc'
        },
        {
          title: '基本开户B',
          key: 'bBasicAmt',
          className: 'tc'
        },
        {
          title: '一般户A',
          key: 'aOrdinaryAmt',
          className: 'tc'
        },
        {
          title: '一般户B',
          key: 'bOrdinaryAmt',
          className: 'tc'
        },
        {
          title: '运费',
          key: 'freightAmt',
          className: 'tc'
        },
        {
          title: '手续费',
          key: 'formalitiesAmt',
          className: 'tc'
        },
        {
          title: '利息收入',
          key: 'interestIncomeAmt',
          className: 'tc'
        },
        {
          title: '利息支出',
          key: 'interestExpenseAmt',
          className: 'tc'
        },
        {
          title: '代收代付',
          key: 'paymentAmt',
          className: 'tc'
        },
        {
          title: '付款所属门店',
          key: 'orgName',
          className: 'tc'
        },
        {
          title: '付款人',
          key: 'collectionName',
          className: 'tc'
        },
        {
          title: '付款日期',
          key: 'receiptDate',
          className: 'tc'
        },
        {
          title: '备注',
          key: 'remark',
          className: 'tc'
        }
      ],
      Branchstore: [],
      value: [],
      model1: '',
      data1: [],
      data2: []
    };
  },
  methods: {
    // 快速查询
    quickDate(data){
      this.value = data
    },
    Dealings() {
      this.$refs.selectDealings.openModel();
    },
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