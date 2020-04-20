<template>
  <div class="content-oper content-oper-flex" style="background-color: #fff;">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr15">
            <span>快速查询：</span>
          </div>
          <div class="db">
            <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>
          </div>
          <div class="db ml15">
            <span>查询日期：</span>
            <Date-picker
              v-model="dates"
              type="daterange"
              placeholder="选择日期"
              class="w200"
            ></Date-picker>
          </div>
          <div class="db ml15">
            <span>分店名称：</span>
            <Select v-model="store" class="w150">
              <Option
                v-for="item in Branchstore"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </div>
          <div class="db ml15">
            <span>往来单位：</span>
            <Select v-model="reciprocalId" class="w150">
              <Option
                v-for="item in Reciprocals"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </div>
          <div class="db ml15">
            <span>收付款单号：</span>
            <input type="text" v-model="payOrderNo" />
          </div>
          <div class="db ml15">
            <span>收付款单号：</span>
            <input type="text" v-model="orderNo" />
          </div>
          <div class="db ml15">
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="query"
            >
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
          <div class="db ml5">
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="SubmitAudit"
            >
              <span>审核</span>
            </button>
          </div>

          <div class="db ml5">
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="reAudit"
            >
              <span>撤销</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <div class="mt15">
      <Tabs type="card" value="capitalChain1">
        <TabPane label="应收审核" name="capitalChain1">
          <table-one />
        </TabPane>
        <TabPane label="应付审核" name="capitalChain2">
          <table-two />
        </TabPane>
        <TabPane label="费用报销审核" name="capitalChain3">
          <table-three />
        </TabPane>
        <TabPane label="预收款/核销支出" name="capitalChain4">
          <table-four />
        </TabPane>
        <TabPane label="其他审核" name="capitalChain5">
          <table-five />
        </TabPane>
      </Tabs>
    </div>

    <!-- 资金审核撤销 -->
    <Modal v-model="isShow" title="资金审核撤销">
      <span>撤销原因：</span>
      <Input class="w200 ml10" v-model="content" />
      <div slot="footer">
        <Button type="primary" @click="reAuditOk">确认</Button>
        <Button @click="isShow = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import QuickDate from "_c/getDate/dateget";
import TableOne from "./components/TableOne";
import TableTwo from "./components/TableTwo";
import TableThree from "./components/TableThree";
import TableFour from "./components/TableFour";
import TableFive from "./components/TableFive";
export default {
  components: {
    QuickDate,
    TableOne,
    TableTwo,
    TableThree,
    TableFour,
    TableFive,
  },
  data() {
    return {
      // 数据类
      quickDate: [], // 快速查询
      oneList: null, // 表格选中
      tableData: [], // 未审核
      tableData1: [], // 已审核
      dates: null, // 查询日期
      store: "", // 分店id
      Branchstore: [], // 分店
      reciprocalId: "", // 往来单位id
      Reciprocals: [], // 往来单位
      payOrderNo: "", // 收付款单号
      orderNo: "", // 对账单号
      content: "", // 撤销原因
      // 状态类
      isShow: false // 撤销原因modal
    };
  },
  async mounted() {},
  methods: {
    // 快速查询
    getDataQuick(v) {
      this.quickDate = v;
      this.query();
    },
    // 获取门店列表
    getStores() {},

    // 查询
    query() {},
    //点击获取表格数据
    getOneList(val) {
      this.oneList = val.row;
    },
    // 审核
    SubmitAudit() {
      this.$Modal.confirm({
        title: "资金审核",
        content: "确认审核？",
        onOk() {},
        onCancel() {}
      });
    },
    // 撤销审核
    reAudit() {
      this.isShow = true;
    },
    // 撤销审核 ok
    reAuditOk() {},
    // 修改凭证
    putVoucher() {}
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
</style>
