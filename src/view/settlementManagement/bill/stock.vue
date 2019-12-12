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
            <input type="text" class="h30" value="车享汽配" />
            <i class="iconfont iconcaidan input" @click="Dealings"></i>
          </div>
          <div class="db">
            <span>类型：</span>
            <Select v-model="typeName" style="width:200px" @on-change="type">
              <Option
                v-for="item in typelist"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db ml5">
            <button class="mr10 ivu-btn ivu-btn-default" type="button">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
          <div class="db ml10">
            <Poptip placement="bottom">
              <button class="mr10 ivu-btn ivu-btn-default" type="button">导出</button>
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
        <Table border :columns="columns" :data="data" ref="summary" show-summary highlight-row
          @on-row-click="election"></Table>
        <button class="mt10 ivu-btn ivu-btn-default" type="button">配件明细</button>
        <Table border :columns="columns1" :data="data1" class="mt10" ref="parts" show-summary></Table>
      </div>
    </section>
    <selectDealings ref="selectDealings" />
  </div>
</template>

<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import selectDealings from "./components/selectCompany";
import { creat } from "./../components";
import {
  getOutStockList,
  getOutStockPart,
  getReturnGoodsList,
  getReturnGoodsPart
} from "@/api/bill/saleOrder";
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
      modal1: false,
      columns: [
        {
          title: "序号",
          key: "num",
          width: 40,
          className: "tc"
        },
        {
          title: "分店名称",
          key: "companyname",
          className: "tc"
        },
        {
          title: "出库单号",
          key: "stockid",
          className: "tc"
        },
        {
          title: "客户名称",
          key: "Customer",
          width: 120,
          className: "tc"
        },
        {
          title: "订单号",
          key: "Orderid",
          className: "tc"
        },
        {
          title: "单据类型",
          key: "billtype",
          className: "tc"
        },
        {
          title: "销售类别",
          key: "saletype",
          className: "tc"
        },
        {
          title: "仓库",
          key: "Warehouse",
          className: "tc"
        },
        {
          title: "制单人",
          key: "Single",
          className: "tc"
        },
        {
          title: "制单日期",
          key: "Singledata",
          className: "tc"
        },
        {
          title: "审核日期",
          key: "revieweddate",
          className: "tc"
        },
        {
          title: "是否开票",
          key: "Invoice",
          className: "tc"
        },
        {
          title: "金额",
          key: "money",
          className: "tc"
        },
        {
          title: "单据状态",
          key: "billstate",
          className: "tc"
        },
        {
          title: "收款状态",
          key: "paymentstate",
          className: "tc"
        },
        {
          title: "备注",
          key: "remarks",
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
        {
          title: "配件内码",
          key: "partsInternal",
          className: "tc"
        },
        {
          title: "配件编码",
          key: "partsCode",
          className: "tc"
        },
        {
          title: "配件名称",
          key: "partsname",
          width: 120,
          className: "tc"
        },
        {
          title: "品牌",
          key: "brand",
          className: "tc"
        },
        {
          title: "车型",
          key: "Vehicle",
          className: "tc"
        },
        {
          title: "OEM码",
          key: "OEMCode",
          className: "tc"
        },
        {
          title: "是否含税",
          key: "Whether",
          className: "tc"
        },
        {
          title: "不含税单价",
          key: "notaxprice",
          className: "tc"
        },
        {
          title: "不含税金额",
          key: "notaxmoney",
          className: "tc"
        },
        {
          title: "含税单价",
          key: "taxprice",
          className: "tc"
        },
        {
          title: "含税金额",
          key: "taxmoney",
          className: "tc"
        },
        {
          title: "数量",
          key: "number",
          className: "tc"
        },
        {
          title: "单价",
          key: "price",
          className: "tc"
        },
        {
          title: "金额",
          key: "money",
          className: "tc"
        }
      ],
      data: [],
      data1: [],
      typelist: [
        {
          value: "Warehousing",
          label: "销售出库"
        },
        {
          value: "Return",
          label: "销售退货"
        }
      ],
      typeName: "Warehousing"
    };
  },
  async mounted() {
    // console.log(this.$refs.quickDate.val)
    let arr = await creat(this.$refs.quickDate.val, this.$store);
    this.value = arr[0];
    this.model1 = arr[1];
    this.Branchstore = arr[2];
    this.getGeneral()
  },
  methods: {
    // 快速查询
    quickDate(data) {
      this.value = data;
    },
    // 往来单位
    Dealings() {
      this.$refs.selectDealings.openModel();
    },
    // 导出汇总/配件明细
    report(type) {
      if (type) {
        if (this.data1.length !== 0) {
          this.$refs.parts.exportCsv({
            filename: "销售出库汇总-配件信息"
          });
        } else {
          this.$message.error("销售出库汇总-配件信息暂无数据");
        }
      } else {
        if (this.data.length !== 0) {
          this.$refs.summary.exportCsv({
            filename: "销售出库汇总"
          });
        } else {
          this.$message.error("销售出库汇总暂无数据");
        }
      }
    },
    // 类型
    type(value) {
      this.typeName = value;
    },
    // 总表查询
    getGeneral() {
      if (this.typeName === "Warehousing") {
        getOutStockList({}).then(res => {
          console.log(res);
        });
      } else if (this.typeName === "Return") {
        getReturnGoodsList({}).then(res => {
          console.log(res);
        });
      }
    },
    // 选中总表查询明细
    election(row){
      if (this.typeName === "Warehousing") {
        getOutStockPart({mainId:row.id}).then(res => {
          console.log(res);
        });
      } else if (this.typeName === "Return") {
        getReturnGoodsPart({mainId:row.id}).then(res => {
          console.log(res);
        });
      }
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