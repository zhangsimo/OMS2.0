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
            <span>对账期间：</span>
            <Date-picker :value="value" type="daterange" placeholder="选择日期" class="w200"></Date-picker>
          </div>
          <div class="db ml20">
            <span>分店名称：</span>
            <Select v-model="BranchstoreId" class="w150" @on-change="fendian">
              <Option
                v-for="item in Branchstore"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db ml20">
            <span>往来单位：</span>
            <input type="text" class="h30" v-model="company" />
            <i class="iconfont iconcaidan input" @click="Dealings"></i>
          </div>
          <div class="db ml5">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="query">
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
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="report">导出</button>
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
          highlight-row
          @on-row-click="election"
          max-height="400"
        ></Table>
        <Tabs v-model="tab" class="mt10" @click="tabName">
          <Tab-pane label="收款单记录" name="key1">
            <Table
              border
              :columns="columns1"
              :data="data1"
              class="mt10"
              ref="receivables"
              show-summary
              max-height="400"
            ></Table>
          </Tab-pane>
          <Tab-pane label="付款单记录" name="key2">
            <Table
              border
              :columns="columns2"
              :data="data2"
              class="mt10"
              ref="payment"
              show-summary
              max-height="400"
            ></Table>
          </Tab-pane>
        </Tabs>
      </div>
    </section>
    <selectDealings ref="selectDealings" @getOne="getOne" />
    <Modal v-model="modal1" title="高级查询" @on-ok="ok" @on-cancel="cancel">
      <Form label-width="120">
        <FormItem label="对账单号：">
          <Input type="text" class="w200" v-model="accountNo" />
        </FormItem>
        <FormItem label="收付款单号：">
          <Input type="text" class="w200" v-model="fno" />
        </FormItem>
        <FormItem label="收付款人：">
          <Input type="text" class="w200" v-model="createUname" />
        </FormItem>
        <FormItem label="审核状态：">
          <Select v-model="startStatusName" style="width:200px">
            <Option v-for="item in statelist" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import selectDealings from "./components/selectCompany";
import { creat } from "./../components";
import {
  getReceiptsPaymentsSummary,
  getReceiptsPaymentsList
} from "@/api/bill/saleOrder";
export default {
  components: {
    quickDate,
    selectDealings
  },
  data() {
    return {
      BranchstoreId: "",
      tab: "key1",
      value: [],
      Branchstore: [],
      model1: "",
      modal1: false,
      statelist: [
        {
          value: "0",
          label: "未审"
        },
        {
          value: "1",
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
          title: "公司名称",
          key: "groupName",
          className: "tc"
        },
        {
          title: "对账单号",
          key: "accountNo",
          className: "tc"
        },
        {
          title: "对账单收付款单号",
          key: "fno",
          width: 120,
          className: "tc"
        },
        {
          title: "往来单位",
          key: "guestName",
          className: "tc"
        },
        {
          title: "收付类型",
          key: "sortName",
          className: "tc"
        },
        {
          title: "收付款金额",
          key: "paymoney",
          className: "tc"
        },
        {
          title: "已冲减/已审核",
          key: "ycAmt",
          className: "tc"
        },
        {
          title: "未冲减/未审核",
          key: "wcAmt",
          className: "tc"
        },
        {
          title: "收款目的",
          key: "purpose",
          className: "tc"
        },
        {
          title: "收付款人",
          key: "createUname",
          className: "tc"
        },
        {
          title: "收付款时间",
          key: "rpDate",
          className: "tc"
        },
        {
          title: "备注",
          key: "remark",
          className: "tc"
        },
        {
          title: "审核状态",
          key: "startStatusName",
          className: "tc"
        },
        {
          title: "审核人",
          key: "auditor",
          className: "tc"
        },
        {
          title: "审核日期",
          key: "auditorDate",
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
          title: "收款单号",
          key: "fno",
          className: "tc"
        },
        {
          title: "收款时间",
          key: "rpDate",
          className: "tc"
        },
        {
          title: "收款方式",
          key: "serviceTypeName",
          width: 120,
          className: "tc"
        },
        {
          title: "收款账户",
          key: "paymentAmtType",
          className: "tc"
        },
        {
          title: "收款金额",
          key: "checkAmt",
          className: "tc"
        },
        {
          title: "审核状态",
          key: "startStatusName",
          className: "tc"
        },
        {
          title: "审核人",
          key: "auditor",
          className: "tc"
        },
        {
          title: "审核日期",
          key: "auditorDate",
          className: "tc"
        },
        {
          title: "备注",
          key: "remark",
          className: "tc"
        }
      ],
      columns2: [
        {
          title: "序号",
          key: "num",
          width: 40,
          className: "tc"
        },
        {
          title: "付款单号",
          key: "fno",
          className: "tc"
        },
        {
          title: "付款时间",
          key: "rpDate",
          className: "tc"
        },
        {
          title: "付款方式",
          key: "serviceTypeName",
          width: 120,
          className: "tc"
        },
        {
          title: "付款账户",
          key: "paymentAmtType",
          className: "tc"
        },
        {
          title: "付款金额",
          key: "checkAmt",
          className: "tc"
        },
        {
          title: "审核状态",
          key: "startStatusName",
          className: "tc"
        },
        {
          title: "审核人",
          key: "auditor",
          className: "tc"
        },
        {
          title: "审核日期",
          key: "auditorDate",
          className: "tc"
        },
        {
          title: "备注",
          key: "remark",
          className: "tc"
        }
      ],
      data: [],
      data1: [],
      data2: [],
      company: "", //往来单位
      companyId: "", //往来单位id
      fno: "", //更多查询收付款单号
      accountNo: "", //更多查询对账单号
      createUname: "", //收付款人
      startStatusName:''//审核状态
    };
  },
  async mounted() {
    let arr = await creat(this.$refs.quickDate.val, this.$store);
    this.value = arr[0];
    this.model1 = arr[1];
    this.Branchstore = arr[2];
    this.getGeneral();
  },
  methods: {
    //查询
    query() {
      this.getGeneral();
    },
    // 往来单位选择
    getOne(data) {
      this.company = data.fullName;
      this.companyId = data.id;
    },
    // 分店切换
    fendian(val) {
      this.BranchstoreId = val;
    },
    // 快速查询
    quickDate(data) {
      this.value = data;
    },
    // 往来单位
    Dealings() {
      this.$refs.selectDealings.openModel();
    },
    // tab标签页的name
    tabName(name) {
      this.tab = name;
    },
    // 导出
    report() {
      if (this.data.length !== 0) {
        this.$refs.summary.exportCsv({
          filename: "收付款查询"
        });
      } else {
        this.$message.error("收付款总表暂无数据");
      }
      if (this.tab === "key1") {
        if (this.data1.length !== 0) {
          this.$refs.receivables.exportCsv({
            filename: "收款单明细"
          });
        } else {
          this.$message.error("收款单明细暂无数据");
        }
      } else if (this.tab === "key2") {
        if (this.data2.length !== 0) {
          this.$refs.payment.exportCsv({
            filename: "付款单明细"
          });
        } else {
          this.$message.error("付款单明细暂无数据");
        }
      }
    },
    // 高级查询确认
    ok() {
      this.getGeneral()
    },
    cancel() {},
    // 总表查询
    getGeneral() {
      let data = {
        startDate: this.value[0],
        endDate: this.value[1],
        orgId: this.BranchstoreId,
        guestId: this.companyId,
        accountNo:this.accountNo,
        fno:this.fno,
        createUname:this.createUname,
        documentStatus: this.startStatusName
      };
      getReceiptsPaymentsSummary(data).then(res => {
        console.log(res);
        if (res.data.length !== 0) {
          res.data.map((item, index) => {
            item.num = index + 1;
            item.sortName = item.sort.name;
            item.startStatusName = item.startStatus.name;
          });
          this.data = res.data;
        } else {
          this.data = [];
        }
      });
    },
    // 选中总表查询明细
    election(row) {
      getReceiptsPaymentsList({ fno: row.fno }).then(res => {
        if (res.data.length !== 0) {
          res.data.map((item, index) => {
            item.num = index + 1;
            item.serviceTypeName = item.serviceType.name;
            item.startStatusName = item.startStatus.name;
          });
          this.data1 = res.data;
          this.data2 = res.data;
        } else {
          this.data1 = [];
          this.data2 = [];
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