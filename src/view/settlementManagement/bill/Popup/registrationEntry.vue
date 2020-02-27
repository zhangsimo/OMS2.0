<template>
  <Modal v-model="modal1" title="进项登记及修改" width="1200">
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="addAccount"
      v-has="'examine'"
    >增加核销对账单</button>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="submission"
      v-has="'examine'"
    >保存并提交</button>
    <h4 class="mt10 mb10">分店名称：</h4>
    <Table
      class="mt10 mb10"
      border
      :columns="account"
      :data="accountData"
      show-summary
      :summary-method="billSum"
    ></Table>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="addRows"
      v-has="'examine'"
    >添加行</button>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="deleteRows"
      v-has="'examine'"
    >删除行</button>
    <vxe-table
      class="mt10"
      height="300"
      border
      resizable
      auto-resize
      highlight-current-row
      @current-change="currentChangeEvent"
      :data="tableData"
      :edit-config="{trigger: 'click', mode: 'cell'}"
      :edit-rules="validRules"
    >
      <vxe-table-column title="序号" type="seq" width="60"></vxe-table-column>
      <vxe-table-column title="登记日期" field="registrationDate"></vxe-table-column>
      <vxe-table-column field="invoicePurchaserId" title="发票采购方名称">
        <template>
          <Select>
            <Option
              v-for="item in purchaserList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="invoiceCode"
        title="发票代码"
        :edit-render="{name: 'input', attrs: {type: 'number',placeholder:'输入10位数字'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="invoiceNo"
        title="发票号"
        :edit-render="{name: 'input', attrs: {type: 'number',placeholder:'输入8位数字'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="invoiceSellerName"
        title="发票销售方名称"
        :edit-render="{name: 'input', attrs: {type: 'text'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="billingDate"
        title="开票日期"
        :edit-render="{name: 'input', attrs: {type: 'date'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="totalAmt"
        title="价税合计金额"
        :edit-render="{name: 'input', attrs: {type: 'number'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="invoiceAmt"
        title="不含税金额"
        :edit-render="{name: 'input', attrs: {type: 'number'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="taxAmt"
        title="税额"
        :edit-render="{name: 'input', attrs: {type: 'number'}}"
      ></vxe-table-column>
      <vxe-table-column field="taxRate" title="税率">
        <template>
          <Select>
            <Option v-for="item in taxRate" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
      </vxe-table-column>
      <vxe-table-column field="payType" title="付款方式">
        <template>
          <Select>
            <Option
              v-for="item in paymentMethod"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </template>
      </vxe-table-column>
      <vxe-table-column field="invoiceSort" title="发票分类"></vxe-table-column>
      <vxe-table-column field="billingType" title="开票清单类型">
        <template>
          <Select>
            <Option v-for="item in listType" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
      </vxe-table-column>
      <vxe-table-column field="registrationTypeName" title="登记类型"></vxe-table-column>
    </vxe-table>
    <div slot="footer"></div>
    <account ref="account" />
  </Modal>
</template>
<script>
import account from "./accountregistration";
// import { creat } from "../../components";
export default {
  components: {
    account
  },
  data() {
    return {
      validRules: {
        invoiceCode: [{required: true, message: '必须是10位数字',min: 10, max: 10}],
        invoiceNo: [{required: true, message: '必须是8位数字',min: 8, max: 8}],
        invoicePurchaserId: [{required: true, message: '必须是10位数字'}],
        invoiceSellerName: [{required: true, message: '必须是8位数字'}],
        billingDate: [{required: true, message: '必须是10位数字'}],
        totalAmt: [{required: true, message: '必须是8位数字'}],
        invoiceAmt: [{required: true, message: '必须是10位数字'}],
        taxAmt: [{required: true, message: '必须是8位数字'}],
        taxRate: [{required: true, message: '必须是10位数字'}],
        payType: [{required: true, message: '必须是10位数字'}],
        billingType: [{required: true, message: '必须是10位数字'}]
      }, //表格校验
      modal1: false, //弹窗显示
      account: [
        {
          title: "序号",
          key: "index",
          width: 40,
          className: "tc"
        },
        {
          title: "公司名称",
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
          title: "应付合计",
          key: "actualPayment",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.actualPayment);
          }
        },
        {
          title: "已收进项金额",
          key: "receiptsAmount",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.receiptsAmount);
          }
        },
        {
          title: "剩余进项未收",
          key: "remainingInputAmount",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.remainingInputAmount);
          }
        }
      ], //对账单
      accountData: [], //对账单
      purchaserList: [], //发票采购方名称
      paymentMethod: [], //付款方式
      listType: [
        {
          value: 0,
          label: "油品"
        },
        {
          value: 1,
          label: "配件"
        }
      ], //开票清单类型
      taxRate: [], //税率
      tableData: [], //登记表格
      currentRow: {} //选中行数据
    };
  },
  async mounted() {},
  methods: {
    // 保存并提交
    submission() {},
    //增加核销对账单
    addAccount() {
      this.$refs.account.modal1 = true;
    },
    // 表格合计
    billSum({ columns, data }) {
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
        if (index > 2) {
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
              value: v.toFixed(2)
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
    // 添加行
    addRows() {
      let date = new Date();
      let m =
        date.getMonth() < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      date = date.getFullYear().toString() + m + d;
      this.tableData.push({
        registrationDate: date,
        registrationTypeName: "人工登记",
        invoiceSort: "采购"
      });
      console.log(this.purchaserList);
    },
    // 删除行
    deleteRows() {
      if (Object.keys(this.currentRow).length !== 0) {
      } else {
        this.$message.error("请先选择一条数据");
      }
    },
    // 选中行
    currentChangeEvent({ row }) {
      this.currentRow = row;
    }
  }
};
</script>
<style lang="less" scoped>
// .hierarchy{
//   z-index: 222
// }
</style>