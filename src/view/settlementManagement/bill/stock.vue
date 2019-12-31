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
            <input type="text" class="h30" v-model="company" />
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
        <Table
          border
          :columns="columns"
          :data="data"
          ref="summary"
          show-summary
          :summary-method="handleSummary"
          highlight-row
          @on-row-click="election"
          max-height="400"
        ></Table>
        <button class="mt10 ivu-btn ivu-btn-default" type="button">配件明细</button>
        <Table
          border
          :columns="columns1"
          :data="data1"
          class="mt10"
          ref="parts"
          show-summary
          max-height="400"
        ></Table>
      </div>
    </section>
    <selectDealings ref="selectDealings" @getOne="getOne" />
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
  getReturnGoodsPart,
  getWarehousingList
} from "@/api/bill/saleOrder";
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
      modal1: false,
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
          title: "出库单号",
          key: "code",
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
          key: "orderId",
          className: "tc"
        },
        {
          title: "单据类型",
          key: "enterTypeIdName",
          className: "tc"
        },
        {
          title: "销售类别",
          key: "orderType",
          className: "tc"
        },
        {
          title: "仓库",
          key: "enterTypeIdName",
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
          title: "审核日期",
          key: "auditDate",
          className: "tc"
        },
        {
          title: "金额",
          key: "outQty",
          className: "tc"
        },
        {
          title: "单据状态",
          key: "auditSign",
          className: "tc"
        },
        {
          title: "备注",
          key: "remark",
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
          title: "是否含税",
          key: "taxSign",
          className: "tc"
        },
        {
          title: "不含税单价",
          key: "noTaxPrice",
          className: "tc"
        },
        {
          title: "不含税金额",
          key: "noTaxAmt",
          className: "tc"
        },
        {
          title: "含税单价",
          key: "taxPrice",
          className: "tc"
        },
        {
          title: "含税金额",
          key: "taxAmt",
          className: "tc"
        },
        {
          title: "数量",
          key: "sellQty",
          className: "tc"
        },
        {
          title: "销售单价",
          key: "sellPrice",
          className: "tc"
        },
        {
          title: "销售金额",
          key: "sellAmt",
          className: "tc"
        }
      ],
      data: [],
      data1: [],
      typelist: [
        {
          value: "050202",
          label: "销售出库"
        },
        {
          value: "050102",
          label: "销售退货"
        }
      ],
      typeName: "050202",
      company: "", //往来单位
      companyId: "" //往来单位id
    };
  },
  async mounted() {
    let arr = await creat(this.$refs.quickDate.val, this.$store);
    this.value = arr[0];
    this.model1 = arr[1];
    this.Branchstore = arr[2];
    this.getGeneral({ enterTypeId: this.typeName });
  },
  methods: {
    // 表格合计方式
    handleSummary({ columns, data }) {
      //   console.log(columns,data)
      const sums = {};
      columns.forEach((column, index) => {
        const key = column.key;
        if (index === 0) {
          sums[key] = {
            key,
            value: "总价"
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
      let obj = {
        outDateStart: moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss"),
        outDateEnd: moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss"),
        orgid: this.model1,
        guestId: this.companyId,
        enterTypeId: this.typeName
      };
      if (this.typeName === "050202") {
        getOutStockList(obj).then(res => {
          console.log(res);
          if (res.data.length !== 0) {
            res.data.map((item, index) => {
              item.num = index + 1;
              item.accountSign = item.accountSign ? "已审" : "未审";
            });
            this.data = res.data;
          } else {
            this.data = [];
          }
        });
      } else if(this.typeName === "050102") {
        getWarehousingList(obj).then(res=>{
          console.log(res);
          if (res.data.length !== 0) {
            res.data.map((item, index) => {
              item.num = index + 1;
              item.accountSign = item.accountSign ? "已审" : "未审";
            });
            this.data = res.data;
          } else {
            this.data = [];
          }
        })
      }

      // if (this.typeName === "Warehousing") {
      //   getOutStockList({}).then(res => {
      //     console.log(res);
      //   });
      // } else if (this.typeName === "Return") {
      //   getReturnGoodsList(obj).then(res => {
      //     console.log(res);
      //   });
      // }
    },
    // 选中总表查询明细
    election(row) {
      getOutStockPart({ mainId: "1204603211449745408" }).then(res => {
        console.log(res);
        if (res.data.length !== 0) {
          res.data.map((item, index) => {
            item.taxSign = item.taxSign ? "是" : "否";
            item.num = index + 1;
          });
          this.data1 = res.data;
        }
      });
      // if (this.typeName === "Warehousing") {
      //   getOutStockPart({mainId:row.id}).then(res => {
      //     console.log(res);
      //   });
      // } else if (this.typeName === "Return") {
      //   getReturnGoodsPart({mainId:row.id}).then(res => {
      //     console.log(res);
      //   });
      // }
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