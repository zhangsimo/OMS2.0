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
            <span>调拨单号：</span>
            <input type="text" class="h30">
          </div>
          <div class="db ml5">
            <button class="mr10 ivu-btn ivu-btn-default" type="button">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
          <div class="db ml10">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="report">导出</button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <Table border :columns="columns" :data="data" class="waytable" ref="summary" show-summary></Table>
      </div>
    </section>
    <selectDealings ref="selectDealings"/>
  </div>
</template>

<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import selectDealings from './components/selectCompany'
import {creat} from './../components'
import {getOnWay} from "@/api/bill/saleOrder";
export default {
  components: {
    quickDate,
    selectDealings
  },
  data() {
    return {
      value: [],
      Branchstore: [],
      model1: "",
      columns: [
        {
          title: '序号',
          key: 'num',
          width: 40,
          className: 'tc'
        },
        {
          title: '配件编码',
          key: 'partCode',
          className: 'tc'
        },
        {
          title: '配件名称',
          key: 'partName',
          className: 'tc'
        },
        {
          title: 'OEM码',
          key: 'oemCode',
          className: 'tc'
        },
        {
          title: '品牌',
          key: 'partBrand',
          className: 'tc'
        },
        {
          title: '厂牌',
          key: 'factory',
          className: 'tc'
        },
        {
          title: '车型',
          key: 'carModelName',
          className: 'tc'
        },
        {
          title: '配件类别一级',
          key: 'carTypef',
          className: 'tc'
        },
        {
          title: '配件类别二级',
          key: 'carTypes',
          className: 'tc'
        },
        {
          title: '数量',
          key: 'orderQty',
          className: 'tc'
        },
        {
          title: '单位',
          key: 'outUnitId',
          className: 'tc'
        },
        {
          title: '已入库数量',
          key: 'didnumber',
          className: 'tc'
        },
        {
          title: '未入库数量',
          key: 'nonumber',
          className: 'tc'
        },
        {
          title: '分店名称',
          key: 'storename',
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
          className: 'tc'
        },
        {
          title: '出库日期',
          key: 'stockdate',
          className: 'tc'
        },
        {
          title: '仓库',
          key: 'Warehouse',
          className: 'tc'
        },
        {
          title: '含税标记',
          key: 'Taxmark',
          className: 'tc'
        },
        {
          title: '税率',
          key: 'taxrate',
          className: 'tc'
        },
        {
          title: '销售单价',
          key: 'saleprice',
          className: 'tc'
        },
        {
          title: '销售金额',
          key: 'salemoney',
          className: 'tc'
        },
        {
          title: '成本单价',
          key: 'costprice',
          className: 'tc'
        },
        {
          title: '成本金额',
          key: 'costmoney',
          className: 'tc'
        },
        {
          title: '损益',
          key: 'sunyi',
          className: 'tc'
        },
        {
          title: '毛利',
          key: 'profit',
          className: 'tc'
        },
        {
          title: '成本率',
          key: 'Costrate',
          className: 'tc'
        },
        {
          title: '毛利率',
          key: 'profitrate',
          className: 'tc'
        },
        {
          title: '业务员',
          key: 'Salesman',
          className: 'tc'
        },
        {
          title: '销售订单',
          key: 'saleid',
          className: 'tc'
        },
        {
          title: '供应商',
          key: 'Supplier',
          className: 'tc'
        },
        {
          title: '整单备注',
          key: 'Wholeremarks',
          className: 'tc'
        },
        {
          title: '明细备注',
          key: 'Detailedremarks',
          className: 'tc'
        }
      ],
      data: []
    };
  },
  async mounted () {
    // console.log(this.$refs.quickDate.val)
    let arr = await creat (this.$refs.quickDate.val,this.$store)
    this.value = arr[0];
    this.model1 = arr[1];
    this.Branchstore = arr[2];
    this.getGeneral()
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
    cancel (){},
    // 导出
    report(){
      if(this.data.length !==0){
        this.$refs.summary.exportCsv({
          filename: '在途库存'
        })
      } else {
        this.$message.error('在途库存暂无数据')
      }
    },
    // 总表查询
    getGeneral() {
      getOnWay({}).then(res => {
        console.log(res);
      });
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
.pro span {
  display: inline-block;
  width: 100px;
  text-align: right;
}
.inner-box {
  overflow-x: scroll;
}
.waytable {
  width: 3000px;
}
</style>