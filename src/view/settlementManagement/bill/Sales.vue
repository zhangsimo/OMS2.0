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
            <Select v-model="model1" class="w150">
              <Option
                v-for="item in Branchstore"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db ml20">
            <span>供应商：</span>
            <input type="text" class="h30" v-model="company" />
            <i class="iconfont iconcaidan input" @click="Dealings"></i>
          </div>
          <div class="db">
            <span>往来类型：</span>
            <Select v-model="type" style="width:200px">
              <Option
                v-for="item in typelist"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db ml5">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="query">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
          <div class="db ml10">
            <Poptip placement="bottom">
              <button class="mr10 ivu-btn ivu-btn-default" type="button" v-has="'export'">导出</button>
              <div slot="content">
                <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="report(0)">导出汇总</button>
                <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="report(1)">导出配件明细</button>
              </div>
            </Poptip>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <Table border :columns="columns" :data="data" ref="summary" show-summary highlight-row :summary-method="handleSummary"
          @on-row-click="election" max-height="400"></Table>
        <button class="mt10 ivu-btn ivu-btn-default" type="button">配件明细</button>
        <Table border :columns="columns1" :data="data1" class="mt10" ref="parts" show-summary :summary-method="summary"></Table>
      </div>
    </section>
    <selectDealings ref="selectDealings" @selectSupplierName="getOne" />
  </div>
</template>

<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import selectDealings from "./components/selectCompany";
import { getOrderlist, getPartList } from "@/api/bill/saleOrder";
import { creat } from "./../components";
import moment from 'moment'
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
          title: "序号",
          type: "index",
          width: 40,
          className: "tc"
        },
        {
          title: "分店名称",
          key: "guestOrgName",
          className: "tc"
        },
        {
          title: "订单号",
          key: "serviceId",
          className: "tc"
        },
        {
          title: "来源",
          key: "sourceType",
          className: "tc"
        },
        {
          title: "客户",
          key: "guestName",
          className: "tc"
        },
        {
          title: "客户编码",
          key: "guestId",
          className: "tc"
        },
        {
          title: "往来类型",
          key: "belongSystem",
          className: "tc"
        },
        {
          title: "仓库",
          key: "storeName",
          className: "tc"
        },
        {
          title: "制单人",
          key: "createUname",
          className: "tc"
        },
        {
          title: "制单日期",
          key: "createTime",
          className: "tc"
        },
        {
          title: "金额",
          key: "orderAmt",
          className: "tc"
        },
        {
          title: "备注",
          key: "remark",
          className: "tc"
        },
        {
          title: "单据状态",
          key: "billstate",
          className: "tc"
        }
      ],
      columns1: [
        {
          title: "序号",
          type: "index",
          width: 40,
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
          width: 120,
          className: "tc"
        },
        {
          title: "品牌",
          key: "partBrand",
          className: "tc"
        },
        {
          title: "车型",
          key: "carModelName",
          className: "tc"
        },
        {
          title: "OEM码",
          key: "oemCode",
          className: "tc"
        },
        {
          title: "数量",
          key: "orderQty",
          className: "tc"
        },
        {
          title: "单价",
          key: "orderPrice",
          className: "tc"
        },
        {
          title: "金额",
          key: "orderAmt",
          className: "tc"
        }
      ],
      data:[],
      data1: [],
      typelist: [
        {
          value: 0,
          label: "华胜连锁"
        },
        {
          value: 1,
          label: "体系外"
        },
        {
          value: 2,
          label: "体系内"
        }
      ],
      company: "", //往来单位
      companyId: "", //往来单位id
      type:0,
    };
  },
  async mounted() {
    let arr = await creat(this.$refs.quickDate.val, this.$store);
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
    // 配件明细合计
    summary({ columns, data }){
      const sums = {};
      columns.forEach((column, index) => {
        const key = column.key;
        if (index === 0) {
          sums[key] = {
            key,
            value: "合计"
          };
          return;
        }
        const values = data.map(item => Number(item[key]));
        if (index >= 6) {
          if (!values.every(value => isNaN(value))) {
            const v = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[key] = {
              key,
              value: v
            };
          }
        } else {
          sums[key] = {
            key,
            value: " "
          };
        }
      });
      return sums;
    },
    // 总表格合计方式
    handleSummary({ columns, data }) {
      //   console.log(columns,data)
      const sums = {};
      columns.forEach((column, index) => {
        const key = column.key;
        if (index === 0) {
          sums[key] = {
            key,
            value: "合计"
          };
          return;
        }
        const values = data.map(item => Number(item[key]));
        if (index === 11) {
          if (!values.every(value => isNaN(value))) {
            const v = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[key] = {
              key,
              value: v
            };
          }
        } else {
          sums[key] = {
            key,
            value: " "
          };
        }
      });
      return sums;
      //
    },
    //查询
    query() {
      this.getGeneral();
    },
    // 往来单位选择
    getOne(data) {
      this.company = data.fullName;
      this.companyId = data.id;
    },
    // 快速查询
    quickDate(data) {
      this.value = data;
    },
    Dealings() {
      this.$refs.selectDealings.init();
    },
    // 导出汇总/配件明细
    report(type) {
      if (type) {
        if (this.data1.length !== 0) {
          this.$refs.parts.exportCsv({
            filename: "销售订单汇总-配件信息"
          });
        } else {
          this.$message.error("销售订单汇总-配件信息暂无数据");
        }
      } else {
        if (this.data.length !== 0) {
          this.$refs.summary.exportCsv({
            filename: "销售订单汇总"
          });
        } else {
          this.$message.error("销售订单汇总暂无数据");
        }
      }
    },
    // 总表查询
    getGeneral() {
      let obj ={
        belongSystem: this.type,
        startTime: this.value[0] ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss") : '',
        endTime: this.value[1] ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss") : '',
        orgId: this.model1,
        guestId: this.companyId
      }
      getOrderlist(obj).then(res => {
        // console.log(res);
        if(res.data.length !== 0){
          res.data.map((item,index)=>{
            if(item.orderType){
              item.orderTypeName = item.orderType.name
            }
            item.num = index + 1
          })
          this.data = res.data
        } else {
          this.data = []
        }
      });
    },
    // 选中总表查询明细
    election(row) {
      getPartList({ mainId: row.id }).then(res => {
        if(res.code===0){
          this.data1 = res.data.content
        }
      });
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
.pro span {
  display: inline-block;
  width: 100px;
  text-align: right;
}
</style>