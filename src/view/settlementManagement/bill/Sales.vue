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
            <span>制单日期：</span>
            <Date-picker :value="value" type="daterange" placeholder="选择日期" class="w200"></Date-picker>
          </div>
          <div class="db ml20">
            <span>分店名称：</span>
            <Select  v-model="model1" class="w150">
              <Option
                v-for="item in Branchstore"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db ml20">
            <span>供应商：</span>
            <input type="text" class="h30" value="车享汽配" />
            <i class="iconfont iconcaidan input" @click="Dealings"></i>
          </div>
          <div class="db">
            <span>往来类型：</span>
            <Select :model.sync="model1" style="width:200px">
              <Option v-for="item in typelist" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db ml5">
            <button class="mr10 ivu-btn ivu-btn-default" type="button">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
          <div class="db ml10">
            <button class="mr10 ivu-btn ivu-btn-default" type="button">导出</button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <Table border :columns="columns" :data="data"></Table>
        <button class="mt10 ivu-btn ivu-btn-default" type="button">配件明细</button>
        <Table border :columns="columns1" :data="data1" class="mt10"></Table>
      </div>
    </section>
    <selectDealings ref="selectDealings"/>
    <Modal
        v-model="modal1"
        title="高级查询"
        @on-ok="ok"
        @on-cancel="cancel">
        <div class="db pro mt20">
          <span>对账单号：</span>
          <input type="text" class="w200" />
        </div>
        <div class="db pro mt20">
          <span>收付款单号：</span>
          <input type="text" class="w200" />
        </div>
        <div class="db pro mt20">
          <span>收付款人：</span>
          <input type="text" class="w200" />
        </div>
        <div class="db pro mt20">
          <span>审核状态：</span>
          <Select :model.sync="model1" style="width:200px">
            <Option v-for="item in statelist" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
    </Modal>
  </div>
</template>

<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import selectDealings from './components/selectCompany'
import {getOrderlist} from '@/api/bill/saleOrder'
import {creat} from './../components'
export default {
  components: {
    quickDate,
    selectDealings
  },
  data() {
    return {
      Branchstore: [],
      model1: "",
      modal1: false,
      statelist: [
        {
          value: 'weishen',
          label: '未审'
        },
        {
          value: 'yishen',
          label: '已审'
        }
      ],
      columns: [
        {
          title: '序号',
          key: 'id',
          width: 40,
          className: 'tc'
        },
        {
          title: '分店名称',
          key: 'companyname',
          className: 'tc'
        },
        {
          title: '订单号',
          key: 'Orderid',
          className: 'tc'
        },
        {
          title: '来源',
          key: 'source',
          className: 'tc'
        },
        {
          title: '客户',
          key: 'Customer',
          className: 'tc'
        },
        {
          title: '客户编码',
          key: 'CustomerCode',
          className: 'tc'
        },
        {
          title: '往来类型',
          key: 'Dealingstype',
          className: 'tc'
        },
        {
          title: '仓库',
          key: 'Warehouse',
          className: 'tc'
        },
        {
          title: '制单人',
          key: 'Single',
          className: 'tc'
        },
        {
          title: '制单日期',
          key: 'Singledata',
          className: 'tc'
        },
        {
          title: '金额',
          key: 'money',
          className: 'tc'
        },
        {
          title: '备注',
          key: 'remarks',
          className: 'tc'
        },
        {
          title: '单据状态',
          key: 'billstate',
          className: 'tc'
        }
      ],
      columns1:  [
        {
          title: '序号',
          key: 'id',
          width: 40,
          className: 'tc'
        },
        {
          title: '配件内码',
          key: 'partsInternal',
          className: 'tc'
        },
        {
          title: '配件编码',
          key: 'partsCode',
          className: 'tc'
        },
        {
          title: '配件名称',
          key: 'partsname',
          width: 120,
          className: 'tc'
        },
        {
          title: '品牌',
          key: 'brand',
          className: 'tc'
        },
        {
          title: '车型',
          key: 'Vehicle',
          className: 'tc'
        },
        {
          title: 'OEM码',
          key: 'OEMCode',
          className: 'tc'
        },
        {
          title: '数量',
          key: 'number',
          className: 'tc'
        },
        {
          title: '单价',
          key: 'price',
          className: 'tc'
        },
        {
          title: '金额',
          key: 'money',
          className: 'tc'
        }
      ],
      data: [
        {
          id: '1',
          companyname: '上海佳配总部',
          Orderid: 'CGRDS000-20190500001',
          source: '人工开单',
          Customer: '法雷奥汽车零部件贸易（上海）有限公司',
          CustomerCode:'145',
          Dealingstype: '内部客户',
          Warehouse:'品牌仓',
          Single:'陈凤彩',
          Singledata:'2019-5-6 17:57',
          money: '45.00',
          billstate: '作废',
          remarks: ''
        },
        {
          id: '合计',
          money: '15'
        }
      ],
      data1: [
        {
          id: '1',
          partsInternal: '18009602',
          partsCode: '03H103483',
          partsname: '气门室盖密封垫',
          brand: '原厂品牌',
          Vehicle: 'Q7',
          number: '2',
          price: '45',
          money: '￥90.00'
        }
      ],
      typelist: [
        {
          value: 'Warehousing',
          label: '内部客户'
        },
        {
          value: 'Return',
          label: '外部客户'
        },
        {
          value: 'huasheng',
          label: '华胜'
        }
      ]
    };
  },
  async mounted () {
    let arr = await creat (this.$refs.quickDate.val,this.$store)
    // getreceivable().then(res=>{
    //   console.log(res)
    // })
    this.value = arr[0];
    this.model1 = arr[1];
    this.Branchstore = arr[2];
    // getOrderlist({}).then(res=>{
    //   console.log(res)
    // })
  },
  methods: {
    // 快速查询
    quickDate(data){
      this.value = data
    },
    Dealings() {
      this.$refs.selectDealings.openModel()
    },
    ok (){},
    cancel (){}

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
</style>