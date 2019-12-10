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
            <Select v-model="Reconciliationtype" class="w150" placeholder="全部">
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
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="statementSettlement"
        >对账单结算</button>
        <button class="ivu-btn ivu-btn-default mr10" type="button" @click="viewStatement">查看对账单</button>
        <button class="ivu-btn ivu-btn-default mr10" type="button">撤销</button>
        <Table
          border
          :columns="columns1"
          :data="data1"
          class="mt10"
          max-height="400"
          @on-row-click="morevis"
          highlight-row
        ></Table>
        <Page :total="pagetotal" show-elevator class="mt10 tr" @on-change="pageCode" show-total />
        <div class="flex mt20">
          <div class="db" style="flex:1;">
            <button class="ivu-btn ivu-btn-default" type="button">收/付款单记录</button>
            <Table
              class="mt15"
              border
              :columns="columns2"
              :data="data2"
              max-height="400"
              show-summary
            ></Table>
          </div>
          <Tabs value="name1" class="ml20" style="flex:1" :animated="false">
            <TabPane label="应收单据明细" name="name1">
              <Table border :columns="columns3" :data="data3" max-height="400" show-summary></Table>
            </TabPane>
            <TabPane label="应付单据明细" name="name2">
              <Table border :columns="columns4" :data="data4" max-height="400" show-summary></Table>
            </TabPane>
          </Tabs>
        </div>
        <div class="db mt10" v-if="falg">
          <h4 class="p10 mb10" style="background-color:#f8f8f8">审批进度</h4>
          <Steps :current="1">
            <Step title="提交人">
              <div slot="content">
                <span>审批人：{{}}</span><br/>
                <span>审批时间：{{}}</span>
              </div>
            </Step>
            <Step title="店长">
              <div slot="content">
                <span>审批人：{{}}</span><br/>
                <span>审批时间：{{}}</span>
              </div>
            </Step>
            <Step title="会计">
              <div slot="content">
                <span>审批人：{{}}</span><br/>
                <span>审批时间：{{}}</span>
              </div>
            </Step>
            <Step title="财务总监">
              <div slot="content">
                <span>审批人：{{}}</span><br/>
                <span>审批时间：{{}}</span>
              </div>
            </Step>
            <Step title="总经理">
              <div slot="content">
                <span>审批人：{{}}</span><br/>
                <span>审批时间：{{}}</span>
              </div>
            </Step>
            <Step title="出纳">
              <div slot="content">
                <span>审批人：{{}}</span><br/>
                <span>审批时间：{{}}</span>
              </div>
            </Step>
          </Steps>
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
          <Option v-for="item in Branchstore" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
    <Modal v-model="Settlement" title="收付款结算" width="1200">
      <div class="db">
        <button class="ivu-btn ivu-btn-default mr10" type="button">保存</button>
        <button class="ivu-btn ivu-btn-default mr10" type="button">关闭</button>
      </div>
      <div class="db p15 settlement mt10 mb10">
        <div class="db_top flex mb15">
          <span style="flex:1">门店：{{}}</span>
          <span style="flex:1">往来单位：{{}}</span>
          <span style="flex:1">收付类型：{{}}</span>
        </div>
        <div class="db_bottom flex mt15">
          <span style="flex:1">对账单号：{{}}</span>
          <span style="flex:1">实际收款/付款：{{}}</span>
          <span style="flex:1">收付款单号：{{}}</span>
        </div>
      </div>
      <div class="flex">
        <vxe-table
          style="flex:6"
          border
          resizable
          :data="tableData"
          auto-resize
          :edit-config="{trigger: 'click', mode: 'cell'}"
          @edit-actived="editActivedEvent"
          @edit-closed="editClosedEvent"
        >
          <vxe-table-column field="businessType" title="业务类型"></vxe-table-column>
          <vxe-table-column field="accountsReceivable" title="对账金额"></vxe-table-column>
          <vxe-table-column field="accepted" title="已收金额"></vxe-table-column>
          <vxe-table-column field="uncollected" title="未收金额"></vxe-table-column>
          <vxe-table-column
            field="noCharOffAmt"
            title="本次核销金额"
            width="140"
            :edit-render="{name: 'input', attrs: {type: 'number'}}"
          ></vxe-table-column>
          <vxe-table-column field="remainingUncollected" title="剩余未收"></vxe-table-column>
        </vxe-table>
        <vxe-table
          class="ml10"
          style="flex:4"
          border
          resizable
          :data="tableData"
          auto-resize
          :edit-config="{trigger: 'click', mode: 'cell'}"
          @edit-actived="editActivedEvent"
          @edit-closed="editClosedEvent"
        >
          <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
          <vxe-table-column field="name" title="收款账户"></vxe-table-column>
          <vxe-table-column
            field="role"
            title="金额"
            :edit-render="{name: 'input', attrs: {type: 'number'}}"
          ></vxe-table-column>
          <vxe-table-column field="sex" title="所属门店"></vxe-table-column>
        </vxe-table>
      </div>
      <div slot="footer"></div>
    </Modal>
    <reconciliation ref="reconciliation"></reconciliation>
    <Monthlyreconciliation ref="Monthlyreconciliation"></Monthlyreconciliation>
  </div>
</template>
<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import { creat } from "./../components";
import {
  AccountStatement,
  Record,
  detailsDocuments
} from "@/api/bill/saleOrder";
import reconciliation from "./components/reconciliation.vue";
import Monthlyreconciliation from "./../paymentmanage/Monthlyreconciliation";
export default {
  components: {
    quickDate,
    reconciliation,
    Monthlyreconciliation
  },
  data() {
    return {
      falg: true,
      reconciliationStatement: {},
      tableData: [],
      Settlement: false,
      pagetotal: 0,
      value: [],
      model1: "",
      model2: "",
      model3: "",
      Reconciliationtype: "",
      Branchstore: [],
      modal1: false,
      text: "",
      nametext: "",
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
      Reconciliationlist: [
        {
          value: "CG",
          label: "草稿"
        },
        {
          value: "SHZ",
          label: "审核中"
        },
        {
          value: "SHTG",
          label: "审批通过"
        },
        {
          value: "JSZ",
          label: "结算中"
        },
        {
          value: "JSWC",
          label: "结算完成"
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
          title: "门店名称",
          key: "orgName",
          className: "tc"
        },
        {
          title: "对账单号",
          key: "accountNo",
          className: "tc"
        },
        {
          title: "往来单位",
          key: "guestName",
          className: "tc"
        },
        {
          title: "收付类型",
          key: "paymentTypeName",
          className: "tc"
        },
        {
          title: "对账应收",
          key: "accountsReceivable",
          className: "tc"
        },
        {
          title: "应收返利",
          key: "receivableRebate",
          className: "tc"
        },
        {
          title: "应收坏账",
          key: "badDebtReceivable",
          className: "tc"
        },
        {
          title: "对账应付",
          key: "reconciliation",
          className: "tc"
        },
        {
          title: "应付返利",
          key: "dealingRebates",
          className: "tc"
        },
        {
          title: "应付坏账",
          key: "payingBadDebts",
          className: "tc"
        },
        {
          title: "实际收款/付款",
          key: "receiptPayment",
          className: "tc"
        },
        {
          title: "已收金额",
          key: "amountReceived",
          className: "tc"
        },
        {
          title: "未收金额",
          key: "noCharOffAmt",
          className: "tc"
        },
        {
          title: "已付金额",
          key: "amountPaid",
          className: "tc"
        },
        {
          title: "未付金额",
          key: "unpaidAmount",
          className: "tc"
        },
        {
          title: "计算结算类型",
          key: "billingTypeName",
          className: "tc"
        },
        {
          title: "对账单状态",
          key: "statementStatusName",
          className: "tc"
        },
        {
          title: "对账人",
          key: "auditor",
          className: "tc"
        },
        {
          title: "最近一次回款时间",
          key: "lastPaymentDate",
          className: "tc"
        },
        {
          title: "备注",
          key: "remark",
          className: "tc"
        },
        {
          title: "流程是否通过",
          key: "passName",
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
          title: "收/付款单号",
          key: "fno",
          className: "tc"
        },
        {
          title: "收/付款时间",
          key: "rpDate",
          className: "tc"
        },
        {
          title: "收/付款方式",
          key: "sortName",
          className: "tc"
        },
        {
          title: "收/付款账户",
          key: "paymentAmtType",
          className: "tc"
        },
        {
          title: "收/付款金额",
          key: "checkAmt",
          className: "tc"
        },
        {
          title: "审核状态",
          key: "startStatus",
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
      columns3: [
        {
          title: "序号",
          key: "num",
          width: 40,
          className: "tc"
        },
        {
          title: "门店",
          key: "orgName",
          className: "tc"
        },
        {
          title: "客户",
          key: "guestName",
          className: "tc"
        },
        {
          title: "销售单号",
          key: "orderNo",
          className: "tc"
        },
        {
          title: "应收金额",
          key: "rpAmt",
          className: "tc"
        },
        {
          title: "已收金额",
          key: "charOffAmt",
          className: "tc"
        },
        {
          title: "未收金额",
          key: "noCharOffAmt",
          className: "tc"
        }
      ],
      columns4: [
        {
          title: "序号",
          key: "num",
          width: 40,
          className: "tc"
        },
        {
          title: "门店",
          key: "orgName",
          className: "tc"
        },
        {
          title: "客户",
          key: "guestName",
          className: "tc"
        },
        {
          title: "采购单号",
          key: "orderNo",
          className: "tc"
        },
        {
          title: "应付金额",
          key: "rpAmt",
          className: "tc"
        },
        {
          title: "已付金额",
          key: "charOffAmt",
          className: "tc"
        },
        {
          title: "未付金额",
          key: "noCharOffAmt",
          className: "tc"
        }
      ],
      data1: [],
      data2: [],
      data3: [],
      data4: []
    };
  },
  async mounted() {
    let arr = await creat(this.$refs.quickDate.val, this.$store);
    this.value = arr[0];
    this.model1 = arr[1];
    this.Branchstore = arr[2];
    let obj = {
      startDate: this.value[0],
      endDate: this.value[1],
      orgId: this.model1,
      statementStatus: this.Reconciliationtype
    };
    this.getAccountStatement(obj);
  },
  methods: {
    // 快速查询日期
    quickDate(data) {
      this.value = data;
    },
    // 选择日期
    changedate(daterange) {
      this.value = daterange;
    },
    // 应收/付单据接口
    getdetailsDocuments(obj) {
      detailsDocuments(obj).then(res => {
        if (res.data.one.length !== 0) {
          res.data.one.map((item, index) => {
            item.num = index + 1;
          });
          this.data3 = res.data.one;
        } else {
          this.data3 = [];
        }
        if (res.data.two.length !== 0) {
          res.data.two.map((item, index) => {
            item.num = index + 1;
          });
          this.data4 = res.data.two;
        } else {
          this.data4 = [];
        }
      });
    },
    // 收付款单记录接口
    getRecord(obj) {
      Record(obj).then(res => {
        if (res.data.length !== 0) {
          res.data.map((item, index) => {
            item.num = index + 1;
            item.sortName = item.sort.name;
          });
          this.data2 = res.data;
        }
      });
    },
    // 对账总表
    getAccountStatement(obj) {
      AccountStatement(obj).then(res => {
        this.pagetotal = res.data.totalElements;
        if (res.data.content.length !== 0) {
          res.data.content.map((item, index) => {
            item.num = index + 1;
            item.paymentTypeName = item.paymentType.name;
            item.billingTypeName = item.billingType.name;
            item.statementStatusName = item.statementStatus.name;
          });
          this.data1 = res.data.content;
        } else {
          this.data1 = [];
        }
      });
    },
    // 页码
    pageCode(page) {
      let obj = {
        startDate: this.value[0],
        endDate: this.value[1],
        orgId: this.model1,
        page: page - 1,
        statementStatus: this.Reconciliationtype
      };
      this.getAccountStatement(obj);
    },
    // 查询
    query() {
      let obj = {
        startDate: this.value[0],
        endDate: this.value[1],
        orgId: this.model1,
        statementStatus: this.Reconciliationtype
      };
      this.getAccountStatement(obj);
    },
    // 更多查询
    senior() {
      let obj = {
        startDate: this.value[0],
        endDate: this.value[1],
        orgId: this.model1,
        statementStatus: this.Reconciliationtype,
        guestType: this.model2,
        tenantName: this.nametext,
        serviceType: this.model3,
        serviceId: this.text
      };
      this.getAccountStatement(obj);
    },
    // 点击总表查询明细
    morevis(row, index) {
      this.reconciliationStatement = row;
      let obj = {
        orgId: row.orgId,
        startDate: this.value[0],
        endDate: this.value[1],
        guestId: row.guestId,
        accountNo: row.accountNo,
        serviceId: row.serviceId
      };
      this.getRecord(obj);
      this.getdetailsDocuments(obj);
    },
    // 查看对账单
    viewStatement() {
      if (Object.keys(this.reconciliationStatement).length !== 0) {
        this.$refs.reconciliation.modal = true;
        if (this.reconciliationStatement.statementStatusName === "草稿") {
          this.$refs.Monthlyreconciliation.modal = true
        } else {
          this.$refs.reconciliation.modal = true
        }
      } else {
        this.$message.error("请勾选要查看的对账单");
      }
    },
    // 对账单结算
    statementSettlement() {
      if (Object.keys(this.reconciliationStatement).length !== 0) {
        if (
          this.reconciliationStatement.pass &&
          (this.reconciliationStatement.statementStatusName === "审核通过" ||
            this.reconciliationStatement.statementStatusName === "结算中")
        ) {
          this.Settlement = true;
        } else {
          this.$message.error(
            "请勾选流程通过且对账单状态为审核通过或结算中的数据"
          );
        }
      } else {
        this.$message.error("请勾选要对账数据");
      }
    },
    editActivedEvent() {},
    editClosedEvent() {}
  }
};
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
.settlement {
  border: 1px solid #dddddd;
}
</style>