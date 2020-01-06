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
            <span>类型：</span>
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
        <Table border :columns="columns" :data="data" ref="summary" show-summary highlight-row @on-row-click="election" :summary-method="handleSummary"></Table>
        <button class="mt10 ivu-btn ivu-btn-default" type="button">配件明细</button>
        <Table border :columns="columns1" :data="data1" class="mt10" ref="parts" show-summary></Table>
      </div>
    </section>
    <selectDealings ref="selectDealings" @getOne="getOne" />
  </div>
</template>

<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import selectDealings from "./components/selectCompany";
import { creat } from "./../components";
import { transferWarehousing, transferParts } from "@/api/bill/saleOrder";
import moment from 'moment'
export default {
  components: {
    quickDate,
    selectDealings
  },
  data() {
    return {
      auditStatus:'', //审核状态
      Branchstore: [],
      model1: "",
      modal1: false,
      value: [],
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
          title: "入库单号",
          key: "serviceId",
          className: "tc"
        },
        {
          title: "供应商",
          key: "guestName",
          width: 120,
          className: "tc"
        },
        {
          title: "订单号",
          key: "code",
          className: "tc"
        },
        {
          title: "单据类型",
          key: "orderTypeId",
          className: "tc"
        },
        {
          title: "仓库",
          key: "storeName",
          className: "tc"
        },
        {
          title: "创建人",
          key: "createUname",
          className: "tc"
        },
        {
          title: "创建日期",
          key: "createTime",
          className: "tc"
        },
        {
          title: "审核日期",
          key: "createTime",
          className: "tc"
        },
        {
          title: "是否直发",
          key: "sourceType",
          className: "tc"
        },
        {
          title: "金额",
          key: "orderAmt",
          className: "tc"
        },
        {
          title: "单据状态",
          key: "billstate",
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
          key: "carModel",
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
          key: "hasOutQty",
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
      data: [],
      data1: [],
      typelist: [
        {
          value: "1",
          label: "调拨入库"
        },
        {
          value: "3",
          label: "调入退货"
        }
      ],
      company: "", //往来单位
      companyId: "", //往来单位id
      type: '1'//类型
    };
  },
  async mounted() {
    let arr = await creat(this.$refs.quickDate.val, this.$store);
    this.value = arr[0];
    this.model1 = arr[1];
    this.Branchstore = arr[2];
    this.getTransferWarehousing();
  },
  methods: {
    // 日期选择
    dateChange(data){
      this.value = data
    },
    // 表格合计方式
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
    query(){
      this.getTransferWarehousing()
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
      this.$refs.selectDealings.init();
    },
    // 主表查询
    getTransferWarehousing() {
      let obj = {
        createTimeStart: moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss"),
        createTimeEnd:  moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss"),
        orgid: this.model1,
        guestId: this.companyId,
        orderTypeId:this.type
      };
      transferWarehousing(obj).then(res => {
        console.log(res);
        if (res.data.length !== 0){
          res.data.map((item, index) => {
            item.num = index + 1;
            item.billstate = "已审";
            item.orderTypeId = item.orderTypeId === 1 ? '调拨入库' : '调入退货'
            item.sourceType = item.sourceType === 3 ? '是' : '否'
          });
          this.data = res.data;
        } else {
          this.data = []
        }
      });
    },
    // 导出汇总/配件明细
    report(type) {
      if (type) {
        if (this.data1.length !== 0) {
          this.$refs.parts.exportCsv({
            filename: "调拨入库单汇总-配件信息"
          });
        } else {
          this.$message.error("调拨入库单汇总-配件信息暂无数据");
        }
      } else {
        if (this.data.length !== 0) {
          this.$refs.summary.exportCsv({
            filename: "调拨入库单汇总"
          });
        } else {
          this.$message.error("调拨入库单汇总暂无数据");
        }
      }
    },
    // 选中数据
    election(row) {
      transferParts({mainId: row.id}).then(res => {
        console.log(res);
        if(res.data.length !== 0){
          res.data.map((item,index)=>{
            item.num = index + 1
          })
          this.data1 = res.data
        } else {
          this.data1 = []
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