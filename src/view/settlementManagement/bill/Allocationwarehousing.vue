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
            <Select :model.sync="model1" style="width:200px">
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
        <Table border :columns="columns" :data="data" ref="summary" show-summary highlight-row @on-row-click="election"></Table>
        <button class="mt10 ivu-btn ivu-btn-default" type="button">配件明细</button>
        <Table border :columns="columns1" :data="data1" class="mt10" ref="parts" show-summary></Table>
      </div>
    </section>
    <selectDealings ref="selectDealings" />
    <Modal v-model="modal1" title="高级查询" @on-ok="ok" @on-cancel="cancel">
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
        <Select v-model="auditStatus" style="width:200px">
          <Option v-for="item in statelist" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
    </Modal>
  </div>
</template>

<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import selectDealings from "./components/selectCompany";
import { creat } from "./../components";
import { transferWarehousing, transferParts } from "@/api/bill/saleOrder";
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
      statelist: [
        {
          value: "weishen",
          label: "未审"
        },
        {
          value: "yishen",
          label: "已审"
        }
      ],
      columns: [
        {
          title: "序号",
          key: "num",
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
          key: "num",
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
          value: "Warehousing",
          label: "调拨入库"
        },
        {
          value: "Return",
          label: "调入退货"
        }
      ]
    };
  },
  async mounted() {
    // console.log(this.$refs.quickDate.val)
    let arr = await creat(this.$refs.quickDate.val, this.$store);
    this.value = arr[0];
    this.model1 = arr[1];
    this.Branchstore = arr[2];
    let obj = {
      startDate: this.value[0],
      endDate: this.value[1],
      orgId: this.model1
    };
    this.getTransferWarehousing(obj);
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
    // 主表查询
    getTransferWarehousing(obj) {
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
    // 高级查询
    ok() {},
    cancel() {},
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