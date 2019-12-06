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
            <Date-picker
              format="yyyy-MM-dd"
              :value="value"
              @on-change="changedate"
              type="daterange"
              placeholder="选择日期"
              class="w200"
            ></Date-picker>
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
            <span>对账单状态：</span>
            <Select v-model="Reconciliationtype" class="w150">
              <Option
                v-for="item in Reconciliationlist"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db ml10">
            <button class="ivu-btn ivu-btn-default" type="button" @click="query">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
          <div class="db ml10">
            <button class="mr10 ivu-btn ivu-btn-default" type="button">导出</button>
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="modal1 = true">
              <i class="iconfont iconcaidan"></i>
              <span>更多</span>
            </button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <Table border :columns="columns1" :data="data1" class="mt10" max-height="400"></Table>
        <Page :total="100" show-elevator class="mt10 tr" />
        <div class="flex mt20">
          <div class="db" style="flex:1;">
            <button class="ivu-btn ivu-btn-default" type="button">收/付款单记录</button>
            <Table class="mt15" border :columns="columns2" :data="data2" max-height="400"></Table>
          </div>
          <Tabs value="name1" class="ml20" style="flex:1" :animated="false">
            <TabPane label="应收单据明细" name="name1">
              <Table border :columns="columns3" :data="data3" max-height="400"></Table>
            </TabPane>
            <TabPane label="应付单据明细" name="name2">
              <Table border :columns="columns3" :data="data4" max-height="400"></Table>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </section>
    <Modal v-model="modal1" title="高级查询" @on-ok="senior">
      <div class="db pro mt20">
        <span>转单日期：</span>
        <Date-picker
          :value="value"
          format="yyyy-MM-dd"
          type="daterange"
          placeholder="选择日期"
          class="w200"
          @on-change="changedate"
        ></Date-picker>
      </div>
      <div class="db pro mt20">
        <span>客户类型：</span>
        <Select v-model="model2" style="width:200px">
          <Option v-for="item in typelist" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="db pro mt20">
        <span>客户名称：</span>
        <input type="text" class="w200" v-model="nametext" />
      </div>
      <div class="db pro mt20">
        <span>分店名称：</span>
        <Select v-model="model1" style="width:200px">
          <Option
            v-for="item in Branchstore"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </div>
      <div class="db pro mt20">
        <span>业务类型：</span>
        <Select v-model="model3" style="width:200px">
          <Option v-for="item in business" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="db pro mt20">
        <span>业务单号：</span>
        <input type="text" class="w200" v-model="text" />
      </div>
    </Modal>
  </div>
</template>
<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import { creat } from "./../components";
export default {
  components:{
    quickDate,
  },
  data (){
    return {
      value: [],
      model1: "",
      model2: "",
      model3: '',
      Reconciliationtype: 'QB',
      Branchstore: [],
      modal1: false,
      text: '',
      nametext: '',
      typelist: [
        {
          value: "HS",
          label: "华胜"
        },
        {
          value: "NB",
          label: "内部"
        },
        {
          value: "WB",
          label: "外部"
        }
      ],
      business: [
        {
          value: "CGRK",
          label: "采购入库"
        },
        {
          value: "CGTH",
          label: "采购退货"
        },
        {
          value: "XSCK",
          label: "销售出库"
        },
        {
          value: "XSTH",
          label: "销售退货"
        }
      ],
      Reconciliationlist:[
        {
          value: 'QB',
          label: '全部'
        },
        {
          value: 'CG',
          label: '草稿'
        },
        {
          value: 'SHZ',
          label: '审核中'
        },
        {
          value: 'SPTG',
          label: '审批通过'
        },
        {
          value: 'JSZ',
          label: '结算中'
        },
        {
          value: 'JSWC',
          label: '结算完成'
        }
      ],
      columns1:[
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
          title: "门店名称",
          key: "accountNo",
          className: "tc"
        },
        {
          title: "对账单号",
          key: "accountNo",
          className: "tc"
        },
        {
          title: "往来单位",
          key: "num",
          className: "tc"
        },
        {
          title: "收付类型",
          key: "num",
          className: "tc"
        },
        {
          title: "对账应收",
          key: "num",
          className: "tc"
        },
        {
          title: "应收返利",
          key: "num",
          className: "tc"
        },
        {
          title: "应收坏账",
          key: "num",
          className: "tc"
        },
        {
          title: "对账应付",
          key: "num",
          className: "tc"
        },
        {
          title: "应付返利",
          key: "num",
          className: "tc"
        },
        {
          title: "应付坏账",
          key: "num",
          className: "tc"
        },
        {
          title: "实际收款/付款",
          key: "num",
          className: "tc"
        },
        {
          title: "已收金额",
          key: "num",
          className: "tc"
        },
        {
          title: "未收金额",
          key: "num",
          className: "tc"
        },
        {
          title: "已付金额",
          key: "num",
          className: "tc"
        },
        {
          title: "未付金额",
          key: "num",
          className: "tc"
        },
        {
          title: "计算结算类型",
          key: "num",
          className: "tc"
        },
        {
          title: "对账单状态",
          key: "num",
          className: "tc"
        },
        {
          title: "对账人",
          key: "num",
          className: "tc"
        },
        {
          title: "最近一次回款时间",
          key: "num",
          className: "tc"
        },
        {
          title: "备注",
          key: "num",
          className: "tc"
        },
        {
          title: "流程是否通过",
          key: "num",
          className: "tc"
        },
      ],
      columns2:[
        {
          title: "序号",
          key: "num",
          width: 40,
          className: "tc"
        },
        {
          title: "收/付款单号",
          key: "num",
          className: "tc"
        },
        {
          title: "收/付款时间",
          key: "num",
          className: "tc"
        },
        {
          title: "收/付款方式",
          key: "num",
          className: "tc"
        },
        {
          title: "收付类型",
          key: "num",
          className: "tc"
        },
        {
          title: "收/付款账户",
          key: "num",
          className: "tc"
        },
        {
          title: "收/付款金额",
          key: "num",
          className: "tc"
        },
        {
          title: "审核状态",
          key: "num",
          className: "tc"
        },
        {
          title: "审核人",
          key: "num",
          className: "tc"
        },
        {
          title: "审核日期",
          key: "num",
          className: "tc"
        },
        {
          title: "备注",
          key: "num",
          className: "tc"
        },
      ],
      columns3:[
        {
          title: "序号",
          key: "num",
          width: 40,
          className: "tc"
        },
        {
          title: "门店",
          key: "num",
          className: "tc"
        },
        {
          title: "客户",
          key: "num",
          className: "tc"
        },
        {
          title: "销售单号",
          key: "num",
          className: "tc"
        },
        {
          title: "应收金额",
          key: "num",
          className: "tc"
        },
        {
          title: "已收金额",
          key: "num",
          className: "tc"
        },
        {
          title: "未收金额",
          key: "num",
          className: "tc"
        }
      ],
      data1:[],
      data2:[],
      data3:[],
      data4:[]
    }
  },
  async mounted() {
    let arr = await creat(this.$refs.quickDate.val, this.$store);
    this.value = arr[0];
    this.model1 = arr[1];
    this.Branchstore = arr[2];
  },
  methods:{
    // 选择日期
    changedate(daterange) {
      this.value = daterange;
    },
    // 查询
    query () {},
    // 更多查询
    senior(){}
  }
}
</script>
<style scoped>
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
</style>