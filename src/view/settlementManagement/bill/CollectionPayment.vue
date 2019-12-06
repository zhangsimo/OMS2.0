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
            <span>对账期间：</span>
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
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="modal1 = true">
              <i class="iconfont iconcaidan"></i>
              <span>更多</span>
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
        <Tabs active-key="key1" class="mt10">
          <Tab-pane label="收款单记录" key="key1">
            <Table border :columns="columns1" :data="data1" class="mt10"></Table>
          </Tab-pane>
          <Tab-pane label="付款单记录" key="key2">
            <Table border :columns="columns2" :data="data2" class="mt10"></Table>
          </Tab-pane>
        </Tabs>
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
          title: '公司名称',
          key: 'companyname',
          className: 'tc'
        },
        {
          title: '对账单号',
          key: 'reconciliationid',
          className: 'tc'
        },
        {
          title: '对账单收付款单号',
          key: 'collectionpaymentid',
          width: 120,
          className: 'tc'
        },
        {
          title: '往来单位',
          key: 'currentcompany',
          className: 'tc'
        },
        {
          title: '收付类型',
          key: 'payment',
          className: 'tc'
        },
        {
          title: '收付款金额',
          key: 'paymoney',
          className: 'tc'
        },
        {
          title: '已冲减/已审核',
          key: 'offset',
          className: 'tc'
        },
        {
          title: '未冲减/未审核',
          key: 'notoffset',
          className: 'tc'
        },
        {
          title: '收款目的',
          key: 'purpose',
          className: 'tc'
        },
        {
          title: '收付款人',
          key: 'person',
          className: 'tc'
        },
        {
          title: '收付款时间',
          key: 'time',
          className: 'tc'
        },
        {
          title: '备注',
          key: 'remarks',
          className: 'tc'
        },
        {
          title: '审核状态',
          key: 'reviewed',
          className: 'tc'
        },
        {
          title: '审核人',
          key: 'reviewedperson',
          className: 'tc'
        },
        {
          title: '审核日期',
          key: 'revieweddate',
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
          title: '收款单号',
          key: 'receivablesid',
          className: 'tc'
        },
        {
          title: '收款时间',
          key: 'receivablestime',
          className: 'tc'
        },
        {
          title: '收款方式',
          key: 'receivablestype',
          width: 120,
          className: 'tc'
        },
        {
          title: '收款账户',
          key: 'receivablesaccount',
          className: 'tc'
        },
        {
          title: '收款金额',
          key: 'receivablesmoney',
          className: 'tc'
        },
        {
          title: '审核状态',
          key: 'reviewedstate',
          className: 'tc'
        },
        {
          title: '审核人',
          key: 'person',
          className: 'tc'
        },
        {
          title: '审核日期',
          key: 'revieweddate',
          className: 'tc'
        },
        {
          title: '备注',
          key: 'remarks',
          className: 'tc'
        }
      ],
      columns2: [
        {
          title: '序号',
          key: 'id',
          width: 40,
          className: 'tc'
        },
        {
          title: '付款单号',
          key: 'payid',
          className: 'tc'
        },
        {
          title: '付款时间',
          key: 'paytime',
          className: 'tc'
        },
        {
          title: '付款方式',
          key: 'paytype',
          width: 120,
          className: 'tc'
        },
        {
          title: '付款账户',
          key: 'payaccount',
          className: 'tc'
        },
        {
          title: '付款金额',
          key: 'paymoney',
          className: 'tc'
        },
        {
          title: '审核状态',
          key: 'reviewedstate',
          className: 'tc'
        },
        {
          title: '审核人',
          key: 'person',
          className: 'tc'
        },
        {
          title: '审核日期',
          key: 'revieweddate',
          className: 'tc'
        },
        {
          title: '备注',
          key: 'remarks',
          className: 'tc'
        }
      ],
      data: [
        {
          id: '1',
          companyname: '上海虹梅南路店',
          reconciliationid: 'XS201941445452313',
          collectionpaymentid: '454455454',
          currentcompany: '华胜215店',
          payment: '收',
          paymoney: '35648',
          offset:'121',
          notoffset: '0',
          purpose:'预收款',
          person:'张三',
          time:'2019-09-19',
          remarks: '',
          reviewed: '已审',
          reviewedperson: '王五',
          revieweddate:'2019/10/10'
        }
      ],
      data1: [
        {
          id: '1',
          receivablesid: 'XS201941445452313',
          receivablestime: '2019/10/10',
          receivablestype: '现金',
          receivablesaccount: '佳配零部件',
          receivablesmoney: '35648',
          reviewedstate:'已审',
          person:'张三',
          revieweddate:'2019-09-19'
        }
      ],
      data2: [
        {
          id: '1',
          payid: 'XS201941445452313',
          paytime: '2019/10/10',
          paytype: '现金',
          payaccount: '佳配零部件',
          paymoney: '35648',
          reviewedstate:'已审',
          person:'张三',
          revieweddate:'2019-09-19'
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