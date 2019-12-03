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
            <span>制单日期：</span>
            <Date-picker :value="value" type="daterange" placeholder="选择日期" class="w200"></Date-picker>
          </div>
          <div class="db ml20">
            <span>分店名称：</span>
            <i-select  v-model="model1" class="w150">
              <i-option
                v-for="item in Branchstore"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</i-option>
            </i-select>
          </div>
          <div class="db ml20">
            <span>供应商：</span>
            <input type="text" class="h30" value="车享汽配" />
            <i class="iconfont iconcaidan input" @click="Dealings"></i>
          </div>
          <div class="db">
            <span>类型：</span>
            <i-select :model.sync="model1" style="width:200px">
              <i-option v-for="item in typelist" :value="item.value" :key="item.value">{{ item.label }}</i-option>
            </i-select>
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
        <i-table border :columns="columns" :data="data"></i-table>
        <button class="mt10 ivu-btn ivu-btn-default" type="button">配件明细</button>
        <i-table border :columns="columns1" :data="data1" class="mt10"></i-table>
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
          <i-select :model.sync="model1" style="width:200px">
            <i-option v-for="item in statelist" :value="item.value" :key="item.value">{{ item.label }}</i-option>
          </i-select>
        </div>
    </Modal>
  </div>
</template>

<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import selectDealings from './components/selectCompany'
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
          title: '出库单号',
          key: 'stockid',
          className: 'tc'
        },
        {
          title: '客户名称',
          key: 'Customer',
          width: 120,
          className: 'tc'
        },
        {
          title: '订单号',
          key: 'Orderid',
          className: 'tc'
        },
        {
          title: '单据类型',
          key: 'billtype',
          className: 'tc'
        },
        {
          title: '销售类别',
          key: 'saletype',
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
          title: '审核日期',
          key: 'revieweddate',
          className: 'tc'
        },
        {
          title: '是否开票',
          key: 'Invoice',
          className: 'tc'
        },
        {
          title: '金额',
          key: 'money',
          className: 'tc'
        },
        {
          title: '单据状态',
          key: 'billstate',
          className: 'tc'
        },
        {
          title: '收款状态',
          key: 'paymentstate',
          className: 'tc'
        },
        {
          title: '备注',
          key: 'remarks',
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
          title: '是否含税',
          key: 'Whether',
          className: 'tc'
        },
        {
          title: '不含税单价',
          key: 'notaxprice',
          className: 'tc'
        },
        {
          title: '不含税金额',
          key: 'notaxmoney',
          className: 'tc'
        },
        {
          title: '含税单价',
          key: 'taxprice',
          className: 'tc'
        },
        {
          title: '含税金额',
          key: 'taxmoney',
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
          stockid: 'XSCDS000-20190500001',
          Customer: 'HS-215-上海虹梅南路店',
          Orderid: 'CGRDS000-20190500001',
          billtype: '销售出库',
          saletype: '人工开单',
          Warehouse:'门店仓库',
          Single: 'sys',
          Singledata:'2019-5-6 17:56',
          revieweddate:'2019-5-6 17:57',
          Invoice:'开票',
          money: '45.00',
          billstate: '已审',
          paymentstate:'未付款',
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
          reviewedstate:'已审',
          OEMCode:'03H103483',
          Whether:'1',
          notaxprice: '38.793',
          notaxmoney: '77.586',
          taxprice:'45',
          taxmoney: '90',
          number: '2',
          price: '45',
          money: '￥90.00'
        }
      ],
      typelist: [
        {
          value: 'Warehousing',
          label: '采购入库'
        },
        {
          value: 'Return',
          label: '采购退货'
        }
      ]
    };
  },
  async mounted () {
    // console.log(this.$refs.quickDate.val)
    let arr = await creat (this.$refs.quickDate.val,this.$store)
    this.value = arr[0];
    this.model1 = arr[1];
    this.Branchstore = arr[2];
  },
  methods: {
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