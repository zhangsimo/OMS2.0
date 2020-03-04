<template>
  <Modal v-model="modal1" title="增加不含税销售开票申请" width="1200" @on-visible-change="visChange">
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="submission"
      v-has="'examine'"
    >提交申请</button>
    <h4 class="mt10 mb10">基本信息</h4>
    <Row>
      <Col span="8">
        <span>分店名称：{{information.orgName}}</span>
      </Col>
      <Col span="8">
        <span>分店店号：{{information.orgId}}</span>
      </Col>
      <Col span="8">
        <span>往来单位：{{information.guestName}}</span>
      </Col>
    </Row>
    <Row class="mt10">
      <Col span="8">
        <span>不含税开票申请单号：{{information.noTaxApply}}</span>
      </Col>
      <Col span="8">
        <span>申请时间：{{information.applicationDate}}</span>
      </Col>
    </Row>
    <h4 class="mt10 mb10">发票数据</h4>
    <Form ref="formCustom" :model="invoice" :rules="invoiceRule" :label-width="160">
      <div style="display: flex">
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="对账单号" prop='reconciliationId'>
            <Input v-model="invoice.reconciliationId" class="ml5 w100" readonly />
            <i class="iconfont iconcaidan input" @click="seleteAccount"></i>
          </FormItem>
          <FormItem label="产生税费" prop='taxation'>
            <Input v-model="invoice.taxation" class="ml5 w100" readonly />
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="不含税对账单未开金额" prop='noTaxAmount'>
            <Input v-model="invoice.noTaxAmount" class="ml5 w100" readonly />
          </FormItem>
          <FormItem label="实际增加开票金额" prop='actualAmount'>
            <Input v-model="invoice.actualAmount" class="ml5 w100" readonly />
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="本次含税开票金额" prop='thisTaxAmount'>
            <Input v-model="invoice.thisTaxAmount" class="ml5 w100" />
          </FormItem>
          <FormItem label="申请说明">
            <Input v-model="invoice.remarks" class="ml5 w400" />
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="申请税点" prop='taxApplication'>
            <Select v-model="invoice.taxApplication" class="ml5 w100">
              <Option
                v-for="item in invoice.taxApplicationList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
        </div>
      </div>
    </Form>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="seleteSale"
      v-has="'examine'"
    >选择必开不含税销售单</button>
    <h4 class="mt10">不含税开票清单</h4>
    <Table
      border
      :columns="accessoriesBilling"
      :data="accessoriesBillingData"
      show-summary
      :summary-method="billSum"
    ></Table>
    <div class="mt10">
      <h4>不含税销售开票申请</h4>
      <approval :approvalTit="approvalTit" />
    </div>
    <!-- 选择销售单据 -->
    <SeleteSale ref="SeleteSale" :popupTit="popupTit" :parameter="parameter" />
    <!-- 选择对账单 -->
    <saleAccount ref="saleAccount" :parameter="parameter" />
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import SeleteSale from "./seleteSale";
import approval from "./approval";
import saleAccount from "./saleAccount";
import { noTaxApplyNo } from "@/api/bill/popup";
import bus from './Bus'
export default {
  components: {
    SeleteSale,
    approval,
    saleAccount
  },
  props: ["information", "parameter"],
  data() {
    return {
      modal1: false, //弹窗显示
      approvalTit: "开票申请流程", //审批流程
      popupTit: "选择必开不含税单据", //选择销售单据标题
      accessoriesBilling: [
        {
          title: "序号",
          key: "index",
          width: 40,
          className: "tc"
        },
        {
          title: "配件名称",
          key: "orgName",
          className: "tc"
        },
        {
          title: "配件编码",
          key: "accountNo",
          className: "tc"
        },
        {
          title: "单位",
          key: "guestName",
          className: "tc"
        },
        {
          title: "数量",
          key: "paymentTypeName",
          className: "tc"
        },
        {
          title: "商品含税单价",
          key: "accountsReceivable",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.badDebtReceivable.toFixed(2));
          }
        },
        {
          title: "商品含税金额",
          key: "receivableRebate",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.badDebtReceivable.toFixed(2));
          }
        },
        {
          title: "开票税率",
          key: "badDebtReceivable",
          className: "tc"
        },
        {
          title: "出库单号",
          key: "badDebtReceivable",
          className: "tc"
        },
        {
          title: "销售单价",
          key: "badDebtReceivable",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.badDebtReceivable.toFixed(2));
          }
        },
        {
          title: "申请开票金额",
          key: "badDebtReceivable",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.badDebtReceivable.toFixed(2));
          }
        },
        {
          title: "外加税点",
          key: "badDebtReceivable",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.badDebtReceivable.toFixed(2));
          }
        }
      ], //开票配件
      accessoriesBillingData: [], //开票配件数据
      invoice: {
        taxApplication: "", //申请税点
        taxApplicationList: [
          {
            value: 0,
            label: "6%"
          },
          {
            value: 1,
            label: "7%"
          }
        ], //申请税点列表
        reconciliationId: "", //对账单号
        taxation: "", //产生税费
        noTaxAmount: "", //不含税对账单未开金额
        actualAmount: "", //实际增加开票金额
        thisTaxAmount: "", //本次含税开票金额
        remarks: "" //申请说明
      }, //发票数据表单
      invoiceRule: {
        taxApplication: [
          {
            required: true,
            message: "申请税点不能为空"
          }
        ],
        reconciliationId: [
          {
            required: true,
            message: "对账单号不能为空"
          }
        ],
        taxation: [
          {
            required: true,
            message: "产生税费不能为空"
          }
        ],
        noTaxAmount: [
          {
            required: true,
            message: "不含税对账单未开金额不能为空"
          }
        ],
        actualAmount: [
          {
            required: true,
            message: "实际增加开票金额不能为空"
          }
        ],
        thisTaxAmount: [
          {
            required: true,
            message: "本次含税开票金额不能为空"
          }
        ]
      } //发票数据表单验证规则
    };
  },
  mounted() {
    // 不含税申请单号
    noTaxApplyNo().then(res => {
      if (res.code === 0) {
        this.information.noTaxApply = res.data;
      }
    });
    bus.$on('accountNo',val=>{
      console.log(val)
    })
    bus.$on('partsData',val=>{
      console.log(val)
    })
  },
  methods: {
    // 对话框是否显示
    visChange(flag) {
      if (flag) {
      }
    },
    // 提交申请
    submission() {},
    // 选择必开不含税销售单
    seleteSale() {
      this.$refs.SeleteSale.modal1 = true;
    },
    // 开票配件合计
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
        if (index >= 11) {
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
    seleteAccount() {
      this.$refs.saleAccount.modal1 = true;
    }
  }
};
</script>
<style lang="less" scoped>
.input {
  position: relative;
  left: -26px;
  bottom: -5px;
}
</style>