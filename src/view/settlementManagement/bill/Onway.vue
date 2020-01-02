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
            <Date-picker :value="value" type="daterange" placeholder="选择日期" class="w200" @on-change="dateChange"></Date-picker>
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
            <input type="text" class="h30" v-model="company"/>
            <i class="iconfont iconcaidan input" @click="Dealings"></i>
          </div>
          <div class="db">
            <span>调拨单号：</span>
            <input type="text" class="h30" v-model="fno">
          </div>
          <div class="db ml5">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="select">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
          <div class="db ml10">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="report" v-has="'export'">导出</button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <Table border :columns="columns" :data="data" class="waytable" ref="summary" show-summary :summary-method="handleSummary"></Table>
      </div>
    </section>
    <selectDealings ref="selectDealings" @getOne="getOne"/>
  </div>
</template>

<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import selectDealings from './components/selectCompany'
import {creat} from './../components'
import {getOnWay} from "@/api/bill/saleOrder";
import moment from 'moment'
export default {
  components: {
    quickDate,
    selectDealings
  },
  data() {
    return {
      fno:'',//调拨单号
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
          title: '品牌车型',
          key: 'partBrand',
          className: 'tc'
        },
        {
          title: '单位',
          key: 'unit',
          className: 'tc'
        },
        {
          title: '规格',
          key: 'spec',
          className: 'tc'
        },
        {
          title: '出库数量',
          key: 'hasOutQty',
          className: 'tc'
        },
        {
          title: '在途数量',
          key: 'onOrderQty',
          className: 'tc'
        },
        {
          title: '已入库数量',
          key: 'inStockQty',
          className: 'tc'
        },
        {
          title: '未入库数量',
          key: 'noStockQty',
          className: 'tc'
        },
        {
          title: '分店名称',
          key: 'groupName',
          className: 'tc'
        },
        {
          title: '出库单号',
          key: 'outOrderNo',
          className: 'tc'
        },
        {
          title: '客户名称',
          key: 'customerName',
          className: 'tc'
        },
        {
          title: '出库日期',
          key: 'outStockDate',
          className: 'tc'
        },
        {
          title: '仓库',
          key: 'storeName',
          className: 'tc'
        },
        {
          title: '含税标记',
          key: 'taxSign',
          className: 'tc'
        },
        {
          title: '税率',
          key: 'taxRate',
          className: 'tc'
        },
        {
          title: '调拨单价',
          key: 'orderPrice',
          className: 'tc'
        },
        {
          title: '调拨金额',
          key: 'orderAmt',
          className: 'tc'
        },
        {
          title: '成本单价',
          key: 'taxPrice',
          className: 'tc'
        },
        {
          title: '成本金额',
          key: 'taxAmt',
          className: 'tc'
        },
        {
          title: '受理人',
          key: 'hasAcceptUname',
          className: 'tc'
        },
        {
          title: '受理单号',
          key: 'hasAcceptOrderNo',
          className: 'tc'
        },
        {
          title: '供应商',
          key: 'guestName',
          className: 'tc'
        },
        {
          title: '订单备注',
          key: 'remark',
          className: 'tc'
        }
      ],
      data: [],
       company: "", //往来单位
      companyId: "", //往来单位id
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
    // 日期选择
    dateChange(data){
      this.value = data
    },
    select(){
      this.getGeneral()
    },
    // 往来单位选择
    getOne(data) {
      this.company = data.fullName;
      this.companyId = data.id;
    },
    // 快速查询
    quickDate(data){
      this.value = data
    },
    Dealings() {
      this.$refs.selectDealings.openModel()
    },
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
      let data={
        startTime:moment(this.value[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime:moment(this.value[1]).format('YYYY-MM-DD HH:mm:ss'),
        orgId:this.model1,
        code:this.fno,
        guestId:this.companyId
      }
      getOnWay(data).then(res => {
        console.log(res);
        if(res.data.length !==0){
          res.data.map(item=>{
            item.taxSign = item.taxSign ? '是' : '否'
          })
          this.data = res.data
        } else {
          this.data = []
        }
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