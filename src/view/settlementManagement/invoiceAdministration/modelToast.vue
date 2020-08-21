<template>
  <Modal v-model="modal6" title="进项发票修改" width="90%" @on-visible-change="visChange">
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="addAccount"
      v-has="'examine'"
    >增加核销对账单</button>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      v-has="'examine'"
      @click="submission"
    >保存并提交</button>
    <h4 class="mt10 mb10">分店名称：{{orgName}}</h4>
    <Table
      class="mt10 mb10"
      border
      :columns="columns"
      :data="data1"
      show-summary
      :summary-method="billSum"
    ></Table>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      v-has="'examine'"
      @click="addRows"
    >添加行</button>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      v-has="'examine'"
      @click="deleteRows"
    >删除行</button>
    <vxe-table
      class="mt10"
      height="300"
      ref="xTable"
      border
      resizable
      auto-resize
      show-footer
      highlight-current-row
      @current-change="currentChangeEvent"
      :data="tableData"
      :footer-method="footerMethod"
      :edit-config="{trigger: 'click', mode: 'cell',showStatus: true}"
      :edit-rules="validRules"
    >
      <vxe-table-column title="序号" type="seq" width="60"></vxe-table-column>
      <vxe-table-column title="登记日期" width="100" field="registrationDate"></vxe-table-column>
      <vxe-table-column field="invoicePurchaserId" width="120" title="发票采购方名称">
        <template v-slot="{row}">
          <Select v-model="row.invoicePurchaserId">
            <Option v-for="item in purchaserList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="invoiceCode"
        title="发票代码"
        width="110"
        :edit-render="{name: 'input', attrs: {type: 'number',placeholder:'输入10位数字'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="invoiceNo"
        title="发票号"
        width="100"
        :edit-render="{name: 'input', attrs: {type: 'number',placeholder:'输入8位数字'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="invoiceSellerName"
        title="发票销售方名称"
        width="150"
        :edit-render="{name: 'input', attrs: {type: 'text'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="billingDate"
        title="开票日期"
        width="110"
        :edit-render="{name: 'input', attrs: {type: 'date'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="totalAmt"
        title="价税合计金额"
        width="140"
        :edit-render="{name: 'input', attrs: {type: 'number'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="invoiceAmt"
        title="不含税金额"
        width="120"
        :edit-render="{name: 'input', attrs: {type: 'number'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="taxAmt"
        title="税额"
        width="80"
        :edit-render="{name: 'input', attrs: {type: 'number'}}"
      ></vxe-table-column>
      <vxe-table-column field="taxRate" title="税率" width="120">
        <template v-slot="{row}">
          <Select v-model="row.taxRate">
            <Option
              v-for="item in taxRate"
              :value="Number(item.itemValueOne)"
              :key="item.itemCode"
            >{{Math.floor(item.itemValueOne * 100)}} %</Option>
          </Select>
        </template>
      </vxe-table-column>
      <vxe-table-column field="payType" title="付款方式" width="120">
        <template v-slot="{row}">
          <Select v-model="row.payType">
            <Option
              v-for="item in paymentMethod"
              :value="item.itemCode"
              :key="item.itemCode"
            >{{ item.itemName }}</Option>
          </Select>
        </template>
      </vxe-table-column>
      <vxe-table-column field="invoiceSort" width="120" title="发票分类">
        <template v-slot="{row}">
          <Select v-model="row.invoiceSort">
            <Option
              v-for="item in invoiceSortList"
              :value="item.itemCode"
              :key="item.itemCode"
            >{{ item.itemName }}</Option>
          </Select>
        </template>
      </vxe-table-column>
      <vxe-table-column field="billingType" width="120" title="开票清单类型">
        <template v-slot="{row}">
          <Select v-model="row.billingType">
            <Option
              v-for="item in listType"
              :value="item.itemCode"
              :key="item.itemCode"
            >{{ item.itemName }}</Option>
          </Select>
        </template>
      </vxe-table-column>
      <vxe-table-column field="registrationTypeName" width="100" title="登记类型"></vxe-table-column>
    </vxe-table>
    <div slot="footer"></div>
    <account ref="account" @accountOrder="seleteData" />
  </Modal>
</template>
<script>
import account from "./addAccount.vue";
import {
  getToastDataList,
  saveSubmit,
  deleteSubtabulation
} from "_api/salesManagment/invoiceAdministration";
export default {
  components: { account },
  data() {
    return {
      arrId: [],
      orgName: "",
      columns: [
        {
          title: "序号",
          type: "index",
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
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.reconciliation.toFixed(2));
          }
        },
        {
          title: "应付返利",
          key: "dealingRebates",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.dealingRebates.toFixed(2));
          }
        },
        {
          title: "应付坏账",
          key: "payingBadDebts",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.payingBadDebts.toFixed(2));
          }
        },
        {
          title: "应付合计",
          key: "actualPayment",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.actualPayment.toFixed(2));
          }
        },
        {
          title: "已收进项金额",
          key: "receiptsAmount",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.receiptsAmount.toFixed(2));
          }
        },
        {
          title: "剩余进项未收",
          key: "remainingInputAmount",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.remainingInputAmount.toFixed(2));
          }
        }
      ],
      data1: [],
      modal6: false,
      tableData: [],
      validRules: {
        invoiceSort: [{ required: true, message: "发票分类必填" }],
        invoiceCode: [
          { required: true, message: "必须是10位数字", min: 10, max: 10 }
        ],
        invoiceNo: [
          { required: true, message: "必须是8位数字", min: 8, max: 8 }
        ],
        invoicePurchaserId: [{ required: true, message: "发票采购方名称必填" }],
        invoiceSellerName: [{ required: true, message: "发票销售方名称必填" }],
        billingDate: [{ required: true, message: "开票日期必填" }],
        totalAmt: [{ required: true, message: "价税合计金额必填" }],
        invoiceAmt: [{ required: true, message: "不含税金额必填" }],
        taxAmt: [{ required: true, message: "税额必填" }],
        taxRate: [{ required: true, message: "税率必填" }],
        payType: [{ required: true, message: "付款方式必填" }],
        billingType: [{ required: true, message: "开票清单类型必填" }]
      },
      accountNo: "",
      purchaserList: [], //发票采购方
      taxRate: [], //税率
      paymentMethod: [], //付款方式
      invoiceSortList: [], //发票类型
      listType: [], //开票清单，
      currentRow: {},
      totalAmt: 0, //价税
      actualPayment: 0 //应付金额综合
    };
  },
  mounted() {},
  methods: {
    footerMethod({ columns, data }) {
      if (!data.length) {
        this.totalAmt = 0;
        return [];
      } else {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return "合计";
            }
            if (
              ["invoiceAmt", "taxAmt", "totalAmt"].includes(column.property)
            ) {
              return this.handleSum(data, column.property);
            }
          })
        ];
      }
    },
    //数据
    handleSum(list, field) {
      var total = 0;
      let num = 0;
      for (var index = 0; index < list.length; index++) {
        if (field == "totalAmt") {
          num += Number(list[index][field] || 0);
          this.totalAmt = num;
        }
        total += Number(list[index][field] || 0);
      }
      return total;
    },
    // 表格合计
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
        if (index === 7) {
          const v = values.reduce((prev, curr) => {
            return prev * 1 + curr * 1;
          }, 0);
          this.actualPayment = v.toFixed(2);
        }
        if (index > 3) {
          const v = values.reduce((prev, curr) => {
            return prev * 1 + curr * 1;
          }, 0);
          sums[key] = {
            key,
            value: v.toFixed(2)
          };
        } else {
          sums[key] = {
            key,
            value: " "
          };
        }
      });
      return sums;
    },
    seleteData(data) {
      data.map(item => {
        this.data1.push(item);
        if (item.details.length !== 0) {
          item.details.map(itm => {
            this.tableData.push(itm);
          });
        }
      });
    },
    visChange(flag) {
      if (flag) {
        this.purchaserList = this.$parent.purchaserOptionList;
        this.taxRate = this.$parent.taxOptionList;
        this.paymentMethod = this.$parent.payOptionList;
        this.invoiceSortList = this.$parent.invoiceOptionList;
        this.listType = this.$parent.billingOptionList;
      }
    },
    getToastData() {
      this.data1 = [];
      this.tableData = [];
      getToastDataList({ accountNo: this.accountNo }).then(res => {
        if (res.code == 0) {
          this.orgName = res.data.orgName;
          this.data1.push(res.data);
          this.tableData = res.data.details;
        }
      });
    },
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
        registrationTypeName: "人工登记"
      });
    },
    deleteRows() {
      if (Object.keys(this.currentRow).length !== 0) {
        if (this.currentRow.row.id) {
          // if (this.currentRow.canceled) {
          this.$Modal.confirm({
            title: "删除发票将还原已核销的金额，是否确认删除",
            onOk: () => {
              this.deleteIncome();
              this.$refs.xTable.remove(this.currentRow);
              this.tableData = this.tableData.filter(
                itm => !this.currentRow.rowid.includes(itm._XID)
              );
            },
            onCancel: () => {}
          });
          // } else {
          //   this.deleteIncome();
          //   this.$refs.xTable.remove(this.currentRow);
          //   this.tableData = this.tableData.filter(
          //     itm => !this.currentRow._XID.includes(itm._XID)
          //   );
          // }
        } else {
          this.$refs.xTable.remove(this.currentRow);
          this.tableData = this.tableData.filter(
            itm => !this.currentRow.rowid.includes(itm._XID)
          );
        }
      } else {
        this.$message.error("请先选择一条数据");
      }
    },
    currentChangeEvent(row) {
      this.currentRow = row;
    },
    //进项登记删除行接口
    deleteIncome() {
      deleteSubtabulation({ id: this.currentRow.row.id }).then(res => {});
    },
    //增加核销对账单
    addAccount() {
      this.$refs.account.modal1 = true;
    },
    submission() {
      if (this.totalAmt > this.actualPayment) {
        this.$message.error("价税合计总金额不得大于应付合计总金额");
      } else {
        const errMap = this.$refs.xTable.validate().catch(errMap => errMap);
        if (errMap) {
          let data = {
            details: this.tableData,
            masterList: this.data1
          };
          saveSubmit(data).then(res => {
            if (res.code === 0) {
              this.$message.success("保存成功");
              this.modal6 = false;
            }
          });
        }
      }
    }
  }
};
</script>
<style lang="less" >
.ivu-select .ivu-select-dropdown {
  width: 100px !important;
}
</style>
