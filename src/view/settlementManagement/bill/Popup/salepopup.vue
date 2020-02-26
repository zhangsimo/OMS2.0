<template>
  <Modal v-model="modal1" title="销售开票申请" width="1300">
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="preservation"
      v-has="'examine'"
    >保存草稿</button>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="submission"
      v-has="'examine'"
    >提交申请</button>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="add"
      v-has="'examine'"
    >增加不含税销售开票申请</button>
    <h4 class="mt10 mb10">基本信息</h4>
    <Row>
      <Col span="6">
        <span>分店名称：</span>
      </Col>
      <Col span="6">
        <span>分店店号：</span>
      </Col>
      <Col span="6">
        <span>往来单位：</span>
      </Col>
      <Col span="6">
        <span>对账单号：</span>
      </Col>
    </Row>
    <Row class="mt10 ml10">
      <Col span="6">
        <span>开票申请单号：</span>
      </Col>
      <Col span="6">
        <span>申请时间：</span>
      </Col>
    </Row>
    <h4 class="mt10 mb10">发票数据</h4>
    <Form ref="formCustom" :model="invoice" :rules="invoiceRule" :label-width="100">
      <div style="display: flex">
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="发票单位">
            <Select v-model="invoice.unitInvoice" class="ml5 w200">
              <Option
                v-for="item in invoice.unitInvoiceList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="开票单位">
            <Select v-model="invoice.issuingOffice" class="ml5 w200">
              <Option
                v-for="item in invoice.issuingOfficeList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="快递收件人">
            <Input v-model="invoice.paragraphDuty" class="ml5 w200" />
          </FormItem>
          <FormItem label="费用承担">
            <Select v-model="invoice.bearingCost" class="ml5 w200">
              <Option
                v-for="item in invoice.bearingCostList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="对账单欠票金额">
            <Input v-model="invoice.owedBill" class="ml5 w200" />
          </FormItem>
          <FormItem label="申请开票金额">
            <Input v-model="invoice.invoiceClaim" class="ml5 w200" />
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="税号">
            <Input v-model="invoice.paragraphDuty" class="ml5 w200" />
          </FormItem>
          <FormItem label="开票类型">
            <Select v-model="invoice.typeBilling" class="ml5 w200">
              <Option
                v-for="item in invoice.typeBillingList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="收件地址">
            <Input v-model="invoice.rceivingAddress" class="ml5 w200" />
          </FormItem>
          <FormItem label="备注">
            <Input v-model="invoice.remarks" class="ml5 w200" />
          </FormItem>
          <FormItem label="本次申请开票含税金额">
            <Input v-model="invoice.thisApplicationTaxAmount" class="ml5 w200" />
          </FormItem>
          <FormItem label="欠票未全金额开具说明">
            <Input v-model="invoice.owedAmountExplain" class="ml5 w200" />
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="地址电话">
            <Input v-model="invoice.addressTel" class="ml5 w200" />
          </FormItem>
          <FormItem label="开票税率">
            <Select v-model="invoice.rateBilling" class="ml5 w200">
              <Option
                v-for="item in invoice.rateBillingList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="电话">
            <Input v-model="invoice.phone" class="ml5 w200" />
          </FormItem>
          <FormItem>
            <span style="color:#0099FF">引用上次申请信息</span>
          </FormItem>
          <FormItem label="不含税金额">
            <Input v-model="invoice.noTaxAmount" class="ml5 w200" disabled />
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="开户行及账号">
            <Input v-model="invoice.bankOpening" class="ml5 w200" />
          </FormItem>
          <FormItem label="收款方式">
            <Select v-model="invoice.paymentMethod" class="ml5 w200">
              <Option
                v-for="item in invoice.paymentMethodList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="寄件方式">
            <Select v-model="invoice.waySending" class="ml5 w200">
              <Option
                v-for="item in invoice.waySendingList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Input class="ml5 w200" style="opacity:0" />
          </FormItem>
          <FormItem label="外加税点">
            <Input v-model="invoice.additionalTaxPoint" class="ml5 w200" disabled />
          </FormItem>
        </div>
      </div>
    </Form>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="seleteSale"
      v-has="'examine'"
    >选择必开销售单</button>
    <h4 class="mt10">开票配件</h4>
    <Table border :columns="accessoriesBilling" :data="accessoriesBillingData" show-summary :summary-method="billSum"></Table>
    <div class="mt10">
      <h4>开票申请进度</h4>
      <approval :approvalTit='approvalTit'/>
    </div>
    <SeleteSale ref="SeleteSale" :popupTit='popupTit'/>
    <noTax ref="noTax"/>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import approval from './approval'
import SeleteSale from './seleteSale'
import noTax from './noTax'
export default {
  components:{
    approval,
    SeleteSale,
    noTax
  },
  data() {
    return {
      approvalTit:'开票申请流程',//审批流程
      popupTit:'选择必开销售单',//选择必开销售单弹框标题
      modal1: false, // 弹框开关
      invoice: {
        unitInvoice: "", // 发票单位
        unitInvoiceList: [], //发票单位列表
        paragraphDuty: "", //税号
        addressTel: "", //地址电话
        bankOpening: "", //开户行及账号
        issuingOffice: "", //开票单位
        issuingOfficeList: [], //开票单位列表
        typeBilling: "", //开票类型
        typeBillingList: [], //开票类型列表
        rateBilling: "", //开票税率
        rateBillingList: [], //开票税率列表
        paymentMethod: "", //收款方式
        paymentMethodList: [], //收款方式列表
        bearingCost: "", //费用承担
        bearingCostList: [
          {
            value: 0,
            label: "现付"
          },
          {
            value: 1,
            label: "到付"
          },
          {
            value: 2,
            label: "自取"
          }
        ], //费用承担列表
        owedBill: "", //对账单欠票金额
        invoiceClaim: "", //申请开票金额
        rceivingAddress: "", //收件地址
        remarks: "", //备注
        thisApplicationTaxAmount: "", //本次申请开票含税金额
        owedAmountExplain: "", //欠票未全金额开具说明
        phone: "", //电话
        noTaxAmount: "", //不含税金额
        waySending: "", //寄件方式
        waySendingList: [], //寄件方式列表
        additionalTaxPoint: "" //外加税点
      }, //发票数据表单
      invoiceRule: {}, //发票数据表单验证规则
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
      accessoriesBillingData: [] //开票配件数据
    };
  },
  methods: {
    // 增加不含税销售开票申请
    add() {
      this.$refs.noTax.modal1=true
    },
    // 提交申请
    preservation() {},
    // 保存草稿
    submission() {},
    // 选择必开销售单
    seleteSale(){
      this.$refs.SeleteSale.modal1 = true
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
    }
  }
};
</script>
