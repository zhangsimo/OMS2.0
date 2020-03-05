<template>
  <Modal v-model="modal1" title="销售开票申请" width="1300" @on-visible-change="visChange">
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
        <span>分店名称：{{information.orgName}}</span>
      </Col>
      <Col span="6">
        <span>分店店号：{{information.orgId}}</span>
      </Col>
      <Col span="6">
        <span>往来单位：{{information.guestName}}</span>
      </Col>
      <Col span="6">
        <span>对账单号：{{information.accountNo}}</span>
      </Col>
    </Row>
    <Row class="mt10 ml10">
      <Col span="6">
        <span>开票申请单号：{{information.applyNo}}</span>
      </Col>
      <Col span="6">
        <span>申请时间：{{information.applicationDate}}</span>
      </Col>
    </Row>
    <h4 class="mt10 mb10">发票数据</h4>
    <Form ref="formCustom" :model="invoice" :rules="invoiceRule" :label-width="100">
      <div style="display: flex">
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="发票单位" prop="receiptUnit">
            <Select v-model="invoice.receiptUnit" class="ml5 w200" @on-change="invoiceChange">
              <Option
                v-for="item in invoice.receiptUnitList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="开票单位" prop="invoiceUnit">
            <Select v-model="invoice.invoiceUnit" class="ml5 w200">
              <Option
                v-for="item in invoice.issuingOfficeList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="快递收件人" prop="consignee">
            <Input v-model="invoice.consignee" class="ml5 w200" />
          </FormItem>
          <FormItem label="费用承担" prop="costBear">
            <Select v-model="invoice.costBear" class="ml5 w200">
              <Option
                v-for="item in invoice.bearingCostList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="对账单欠票金额" prop="statementAmountOwed">
            <Input v-model="invoice.statementAmountOwed" class="ml5 w200" disabled />
          </FormItem>
          <FormItem label="申请开票金额" prop="applyMoney">
            <Input v-model="invoice.applyMoney" class="ml5 w200" disabled />
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="税号" prop="taxNo">
            <Input v-model="invoice.taxNo" class="ml5 w200" />
          </FormItem>
          <FormItem label="开票类型" prop="invoiceType">
            <Select v-model="invoice.invoiceType" class="ml5 w200">
              <Option
                v-for="item in invoice.typeBillingList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="收件地址" prop="address">
            <Input v-model="invoice.address" class="ml5 w200" />
          </FormItem>
          <FormItem label="备注">
            <Input v-model="invoice.remark" class="ml5 w200" />
          </FormItem>
          <FormItem label="本次申请开票含税金额" prop="applyMoneyTax">
            <Input v-model="invoice.applyMoneyTax" class="ml5 w200" />
          </FormItem>
          <FormItem label="欠票未全金额开具说明" prop="underTicketExplain">
            <Input v-model="invoice.underTicketExplain" class="ml5 w200" />
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="地址电话" prop="tel">
            <Input v-model="invoice.tel" class="ml5 w200" />
          </FormItem>
          <FormItem label="开票税率" prop="invoiceTax">
            <Select v-model="invoice.invoiceTax" class="ml5 w200">
              <Option
                v-for="item in invoice.rateBillingList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="电话" prop="phone">
            <Input v-model="invoice.phone" class="ml5 w200" />
          </FormItem>
          <FormItem>
            <span style="color:#0099FF;cursor:pointer;" @click="quote">引用上次申请信息</span>
          </FormItem>
          <FormItem label="不含税金额" prop="amountExcludingTax">
            <Input v-model="invoice.amountExcludingTax" class="ml5 w200" disabled />
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="开户行及账号" prop="bankOpening">
            <Input v-model="invoice.bankOpening" class="ml5 w200" />
          </FormItem>
          <FormItem label="收款方式" prop="collectionType">
            <Select v-model="invoice.collectionType" class="ml5 w200">
              <Option
                v-for="item in invoice.paymentMethodList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="寄件方式" prop="sendingWay">
            <Select v-model="invoice.sendingWay" class="ml5 w200">
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
          <FormItem label="外加税点" prop="additionalTaxPoint">
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
    <Table
      border
      :columns="accessoriesBilling"
      :data="accessoriesBillingData"
      show-summary
      :summary-method="billSum"
    ></Table>
    <div class="mt10">
      <h4>开票申请进度</h4>
      <approval :approvalTit="approvalTit" />
    </div>
    <SeleteSale ref="SeleteSale" :popupTit="popupTit" :parameter="parameter" />
    <noTax ref="noTax" :information="information" :parameter="parameter" />
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import approval from "./approval";
import SeleteSale from "./seleteSale";
import noTax from "./noTax";
import { getDataDictionaryTable } from "@/api/system/dataDictionary/dataDictionaryApi";
import { applyNo, ditInvoice,informationCitation,partsInvoice } from "@/api/bill/popup";
import bus from './Bus'
export default {
  components: {
    approval,
    SeleteSale,
    noTax
  },
  data() {
    return {
      parameter: {}, //销售单参数
      information: {}, //基本信息数据
      approvalTit: "开票申请流程", //审批流程
      popupTit: "选择必开销售单", //选择必开销售单弹框标题
      modal1: false, // 弹框开关
      invoice: {
        consignee: "", //快递收件人
        receiptUnit: "", // 发票单位
        receiptUnitList: [], //发票单位列表
        taxNo: "", //税号
        tel: "", //地址电话
        bankOpening: "", //开户行及账号
        invoiceUnit: "", //开票单位
        issuingOfficeList: [], //开票单位列表
        invoiceType: "", //开票类型
        typeBillingList: [], //开票类型列表
        invoiceTax: "", //开票税率
        rateBillingList: [], //开票税率列表
        collectionType: "", //收款方式
        paymentMethodList: [], //收款方式列表
        costBear: "", //费用承担
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
        statementAmountOwed: "", //对账单欠票金额
        applyMoney: "", //申请开票金额
        address: "", //收件地址
        remark: "", //备注
        applyMoneyTax: "", //本次申请开票含税金额
        underTicketExplain: "", //欠票未全金额开具说明
        phone: "", //电话
        amountExcludingTax: "", //不含税金额
        sendingWay: "", //寄件方式
        waySendingList: [], //寄件方式列表
        additionalTaxPoint: "" //外加税点
      }, //发票数据表单
      invoiceRule: {
        consignee: [
          {
            required: true,
            message: "快递收件人不能为空"
          }
        ],
        receiptUnit: [
          {
            required: true,
            message: "发票单位不能为空"
          }
        ],
        taxNo: [
          {
            required: true,
            message: "税号不能为空"
          }
        ],
        tel: [
          {
            required: true,
            message: "地址电话不能为空"
          }
        ],
        bankOpening: [
          {
            required: true,
            message: "开户行及账号不能为空"
          }
        ],
        invoiceUnit: [
          {
            required: true,
            message: "开票单位不能为空",
            trigger: "change"
          }
        ],
        invoiceType: [
          {
            required: true,
            message: "开票类型不能为空",
            trigger: "change"
          }
        ],
        invoiceTax: [
          {
            required: true,
            message: "开票税率不能为空",
            trigger: "change"
          }
        ],
        collectionType: [
          {
            required: true,
            message: "收款方式不能为空",
            trigger: "change"
          }
        ],
        costBear: [
          {
            required: true,
            message: "费用承担不能为空",
            trigger: "change"
          }
        ],
        statementAmountOwed: [
          {
            required: true,
            message: "对账单欠票金额不能为空"
          }
        ],
        applyMoney: [
          {
            required: true,
            message: "申请开票金额不能为空"
          }
        ],
        address: [
          {
            required: true,
            message: "收件地址不能为空"
          }
        ],
        applyMoneyTax: [
          {
            required: true,
            message: "本次申请开票含税金额不能为空"
          }
        ],
        underTicketExplain: [
          {
            required: true,
            message: "欠票未全金额开具说明不能为空"
          }
        ],
        phone: [
          {
            required: true,
            message: "电话不能为空"
          }
        ],
        sendingWay: [
          {
            required: true,
            message: "寄件方式不能为空",
            trigger: "blur"
          }
        ]
      }, //发票数据表单验证规则
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
          className: "tc"
          // render: (h, params) => {
          //   return h("span", params.row.badDebtReceivable.toFixed(2));
          // }
        },
        {
          title: "商品含税金额",
          key: "receivableRebate",
          className: "tc"
          // render: (h, params) => {
          //   return h("span", params.row.badDebtReceivable.toFixed(2));
          // }
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
          className: "tc"
          // render: (h, params) => {
          //   return h("span", params.row.badDebtReceivable.toFixed(2));
          // }
        },
        {
          title: "申请开票金额",
          key: "badDebtReceivable",
          className: "tc"
          // render: (h, params) => {
          //   return h("span", params.row.badDebtReceivable.toFixed(2));
          // }
        },
        {
          title: "外加税点",
          key: "badDebtReceivable",
          className: "tc"
          // render: (h, params) => {
          //   return h("span", params.row.badDebtReceivable.toFixed(2));
          // }
        }
      ], //开票配件
      accessoriesBillingData: [] //开票配件数据
    };
  },
  mounted() {
    // 税率和开票类型数据字典
    getDataDictionaryTable({ dictCode: "CS00107" }).then(res => {
      res.data.map(item => {
        this.invoice.typeBillingList.push({
          value: item.itemCode,
          label: item.itemName
        });
        this.invoice.rateBillingList.push({
          value: item.itemCode,
          label: (item.itemValueOne * 100).toFixed(0) + "%"
        });
      });
    });
    // 收款方式数据字典
    getDataDictionaryTable({ dictCode: "RECEIVABLE_TYPE" }).then(res => {
      res.data.map(item => {
        this.invoice.paymentMethodList.push({
          value: item.itemCode,
          label: item.itemName
        });
      });
    });
    // 寄件方式数据字典
    getDataDictionaryTable({ dictCode: "MAIL_TYPE" }).then(res => {
      res.data.map(item => {
        this.invoice.waySendingList.push({
          value: item.itemCode,
          label: item.itemName
        });
      });
    });
    // 开票单位数据字典
    getDataDictionaryTable({ dictCode: "KPDW" }).then(res => {
      res.data.map(item => {
        this.invoice.issuingOfficeList.push({
          value: item.itemCode,
          label: item.itemName
        });
      });
    });
    // 申请单号
    applyNo().then(res => {
      if (res.code === 0) {
        this.information.applyNo = res.data;
      }
    });
    // 选择销售单
    bus.$on('partsData',val=>{
      console.log(val)
    })
  },
  methods: {
    // 引用上次申请信息
    quote(){
      informationCitation({guestId:this.information.guestId}).then(res=>{
        if(res.code===0){
          this.invoice.consignee = res.data.consignee
          this.invoice.address = res.data.address
          this.invoice.phone = res.data.phone
        }
      })
    },
    // 发票单位带出税号等信息
    invoiceChange(val) {
      this.invoice.receiptUnitList.map(item => {
        if (item.value === val) {
          this.invoice.taxNo = item.taxpayerCode
          this.invoice.tel = item.taxpayerTel
          this.invoice.bankOpening = item.accountBankNo
        }
      });
    },
    // 对话框是否显示
    visChange(flag) {
      if (flag) {
        this.$refs.formCustom.resetFields()
        this.invoice.statementAmountOwed =
          this.information.taxArrearsOfPart + this.information.taxArrearsOfOil;
        this.invoice.applyMoneyTax = this.invoice.statementAmountOwed;
        this.invoice.applyMoney =
          this.invoice.applyMoneyTax + this.invoice.amountExcludingTax;
          // 发票单位
        ditInvoice({ guestId: this.information.guestId}).then(res => {
          if (res.code === 0) {
            res.data.map(item => {
              item.label = item.taxpayerName;
              item.value = item.id;
            });
            this.invoice.receiptUnitList = res.data;
          }
        });
        // 开票配件
        console.log(this.information)
        partsInvoice({mainId,id}).then(res=>{

        })
      }
    },
    // 增加不含税销售开票申请
    add() {
      this.$refs.noTax.modal1 = true;
    },
    // 保存草稿
    preservation() {
      this.$refs.formCustom.validate(vald => {
        if (vald) {
        }
      });
    },
    // 提交申请
    submission() {
      this.$refs.formCustom.validate(vald => {
        if (vald) {
        }
      });
    },
    // 选择必开销售单
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
    }
  }
};
</script>
