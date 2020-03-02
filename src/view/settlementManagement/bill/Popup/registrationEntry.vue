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
    <h4 class="mt10 mb10">分店名称：{{orgName}}</h4>
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
      ref="xTable"
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
        <template v-slot="{row}">
          <Select v-model="row.invoicePurchaserId">
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
        <template v-slot="{row}">
          <Select v-model="row.taxRate">
            <Option v-for="item in taxRate" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
      </vxe-table-column>
      <vxe-table-column field="payType" title="付款方式">
        <template v-slot="{row}">
          <Select v-model="row.payType">
            <Option
              v-for="item in paymentMethod"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </template>
      </vxe-table-column>
      <vxe-table-column field="invoiceSort" title="发票分类">
        <template v-slot="{row}">
          <Select v-model="row.invoiceSort">
            <Option v-for="item in invoiceSortList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
      </vxe-table-column>
      <vxe-table-column field="billingType" title="开票清单类型">
        <template v-slot="{row}">
          <Select v-model="row.billingType">
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
import { getDataDictionaryTable } from "@/api/system/dataDictionary/dataDictionaryApi";
import { submit, deleteRows } from "@/api/bill/popup";
export default {
  components: {
    account
  },
  data() {
    return {
      orgName: "", //分店名称
      validRules: {
        invoiceSort:[{ required: true, message: "发票分类必填" }],
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
      ], //对账单
      accountData: [], //对账单
      purchaserList: [], //发票采购方名称
      paymentMethod: [], //付款方式
      listType: [], //开票清单类型
      taxRate: [], //税率
      invoiceSortList:[],//发票分类
      tableData: [], //登记表格
      currentRow: {} //选中行数据
    };
  },
  async mounted() {
    this.getDictionary("PAYMENT_TYPE");//付款方式
    this.getDictionary("CS00107");//税率
    this.getDictionary("BILL_LIST_TYPE");//开票清单
    this.getDictionary("INVOICE_TYPE")//发票分类
  },
  methods: {
    // 数据字典
    getDictionary(dictCode) {
      getDataDictionaryTable({ dictCode }).then(res => {
        if (res.data[0].dictCode === "PAYMENT_TYPE") {
          res.data.map(item => {
            this.paymentMethod.push({
              value: item.itemCode,
              label: item.itemName
            });
          });
        } else if (res.data[0].dictCode === "CS00107") {
          res.data.map(item => {
            if (item.itemValueOne !== "0") {
              this.taxRate.push({
                value: item.itemCode,
                label: (item.itemValueOne * 100).toFixed(0) + "%"
              });
            }
          });
        } else if (res.data[0].dictCode === "BILL_LIST_TYPE"){
          res.data.map(item => {
            this.listType.push({
              value: item.itemCode,
              label: item.itemName
            });
          });
        } else if (res.data[0].dictCode === "INVOICE_TYPE") {
          res.data.map(item => {
            this.invoiceSortList.push({
              value: item.itemCode,
              label: item.itemName
            });
          });
        }
      });
    },
    // 保存并提交
    async submission() {
      const errMap = await this.$refs.xTable.validate().catch(errMap => errMap);
      console.log(this.tableData)
      if (!errMap) {
        let data = {
          details: this.tableData,
          masterList: this.accountData
        };
        submit(data).then(res => {
          // console.log(res);
          if (res.code === 0) this.$message.success("保存成功");
        });
      }
    },
    //增加核销对账单
    addAccount() {
      this.$refs.account.modal1 = true;
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
            value: ' '
          };
        }
        // if (index > 2) {
        // if (!values.every(value => isNaN(value))) {
        // console.log(value)
        //   const v = values.reduce((prev, curr) => {
        //     // const value = Number(curr);
        //       return prev*1 + curr*1;
        //     // if (!isNaN(value)) {
        //     // } else {
        //     //   return prev;
        //     // }
        //   }, 0);
        //   sums[key] = {
        //     key,
        //     value: v.toFixed(2)
        //   };
        // }
        // } else {
        // sums[key] = {
        //   key,
        //   value: " x"
        // };
        // }
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
      this.purchaserList = this.$parent.Branchstore;
      this.tableData.push({
        registrationDate: date,
        registrationTypeName: "人工登记",
        invoiceSort: "采购"
      });
    },
    // 删除行
    deleteRows() {
      if (Object.keys(this.currentRow).length !== 0) {
        if (this.currentRow.id) {
          if (this.currentRow.canceled) {
            this.$Modal.confirm({
              title: "删除发票将还原已核销的金额，是否确认删除",
              onOk: () => {
                this.deleteIncome(this.currentRow.id);
              },
              onCancel: () => {}
            });
          } else {
            this.deleteIncome(this.currentRow.id);
            this.$refs.xTable.remove(this.currentRow);
          }
        } else {
          this.$refs.xTable.remove(this.currentRow);
          this.tableData = this.tableData.filter(itm=> !this.currentRow._XID.includes(itm._XID))
        }
      } else {
        this.$message.error("请先选择一条数据");
      }
    },
    // 选中行
    currentChangeEvent({ row }) {
      this.currentRow = row;
    },
    //进项登记删除行接口
    deleteIncome(id) {
      deleteRows({ id }).then(res => {
        console.log(res);
      });
    }
  }
};
</script>
