<template>
  <Modal v-model="modals" title="人工核销" width="90%">
    <div>
      <div class="mb20 flex">
        <div class="mr10">
          <span>申请日期：</span>
          <Date-picker
            format="yyyy-MM-dd"
            :value="value"
            @on-change="changedate"
            type="daterange"
            placeholder="选择日期"
            class="w200"
          ></Date-picker>
        </div>
        <div class="mr10 flexd">
          <span>往来单位：</span>
          <Select
            v-model="form.guestId"
            class="w150"
            clearable
            filterable
            remote
            :loading="remoteloading"
            :remote-method="getOne"
          >
            <Option
              v-for="item in company"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </div>
        <Button class="ml10" type="info" @click="query">查询</Button>
        <Button class="ml10" type="info" @click="submitConfig">确认核销</Button>
      </div>
      <div>
        <Table
          border
          :columns="columns"
          :data="data2"
          ref="summary"
          highlight-row
          max-height="400"
          @on-selection-change="requireMore"
        ></Table>
        <Page
          :total="pagetotal"
          show-elevator
          class="mt10 tr"
          :page-size="page.size"
          :current="page.num"
          @on-change="pageCode"
          show-total
          size="small"
        />
      </div>
    </div>
    <div class="mt20">
      <div><span>进项发票导入数据</span></div>
      <div style="display:flex" class="mt20 mb20">
        <div class="db mr20">
          <span>发票号码：</span>
          <input type="text" class="h30" v-model="form1.invoiceNo" />
        </div>
        <div class="db mr20">
          <span>开票单位：</span>
          <Select
            v-model="form1.invoiceSellerName"
            style="width:180px"
            clearable
          >
            <Option
              v-for="item in invoice.issuingOfficeList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </div>
        <!-- <div class="mr10 flexd">
          <span>分店名称：</span>
          <Select v-model="form.orgId" style="width:200px" clearable>
            <Option
              v-for="item in proTypeList"
              :value="item.id"
              :key="item.id"
              >{{ item.name }}</Option
            >
          </Select>
        </div> -->
        <div class="db ml10">
          <Button class="ml10" type="info" @click="queryDataList">查询</Button>
        </div>
      </div>
      <div>
        <Table
          border
          :columns="columns1"
          :data="data1"
          highlight-row
          @on-selection-change="requireMore2"
          max-height="400"
        ></Table>
      </div>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import { getManualList, subManualList2 } from "_api/salesManagment/invoiceApply";
import { goshop } from "@/api/settlementManagement/shopList";
import { getDataDictionaryTable } from "@/api/system/dataDictionary/dataDictionaryApi";
import { findGuest } from "_api/settlementManagement/advanceCollection.js";
import { getManageList } from "_api/salesManagment/invoiceAdministration";
import { AccountStatement } from "@/api/bill/saleOrder";
import moment from "moment";
export default {
  data() {
    return {
      remoteloading: false,
      value: [],
      model1: "",
      modals: false,
      hxOjb: {
        invoiceApplyId: "",
        salesInvoiceId: ""
      },
      columns: [
        {
          title: "序号",
          key: "index",
          width: 40,
          className: "tc",
          fixed:"left"
        },
        {
          title:"申请时间",
          key:'createTime',
          className:'tc',
          minWidth:140,
        },
        {
          title: "公司名称",
          key: "orgName",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.orgName
                }
              }, params.row.orgName)
            ])
          }
        },
        {
          title: "对账单号",
          key: "accountNo",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.accountNo
                }
              }, params.row.accountNo)
            ])
          }
        },
        {
          title: "往来单位",
          key: "guestName",
          className: "tc",
          minWidth:120,
          fixed:"left",
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.guestName
                }
              }, params.row.guestName)
            ])
          }
        },
        {
          title: "收付类型",
          key: "paymentTypeName",
          className: "tc",
          minWidth:120
        },
        {
          title: "对账应收",
          key: "accountsReceivable",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h("span", params.row.accountsReceivable.toFixed(2));
          }
        },
        {
          title: "应收返利",
          key: "receivableRebate",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h("span", params.row.receivableRebate.toFixed(2));
          }
        },
        {
          title: "应收坏账",
          key: "badDebtReceivable",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h("span", params.row.badDebtReceivable.toFixed(2));
          }
        },
        {
          title: "对账应付",
          key: "reconciliation",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h("span", params.row.reconciliation.toFixed(2));
          }
        },
        {
          title: "应付返利",
          key: "dealingRebates",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h("span", params.row.dealingRebates.toFixed(2));
          }
        },
        {
          title: "应付坏账",
          key: "payingBadDebts",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h("span", params.row.payingBadDebts.toFixed(2));
          }
        },
        {
          title: "运费",
          key: "transportExpenses",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h("span", params.row.transportExpenses.toFixed(2));
          }
        },
        {
          title: "保险费",
          key: "insuranceExpenses",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h("span", params.row.insuranceExpenses.toFixed(2));
          }
        },
        {
          title: "手续费",
          key: "serviceCharge",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h("span", params.row.serviceCharge.toFixed(2));
          }
        },
        {
          title: "配件管理费",
          key: "partsManagementFee",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h("span", params.row.partsManagementFee.toFixed(2));
          }
        },
        {
          title: "其他费用",
          key: "otherFees",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h("span", params.row.otherFees.toFixed(2));
          }
        },
        {
          title: "实际收款/付款",
          key: "receiptPayment",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h("span", params.row.receiptPayment.toFixed(2));
          }
        },
        {
          title: "已收金额",
          key: "amountReceived",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h("span", params.row.amountReceived.toFixed(2));
          }
        },
        {
          title: "未收金额",
          key: "noCharOffAmt",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h("span", params.row.noCharOffAmt.toFixed(2));
          }
        },
        {
          title: "已付金额",
          key: "amountPaid",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h("span", params.row.amountPaid.toFixed(2));
          }
        },
        {
          title: "未付金额",
          key: "unpaidAmount",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h("span", params.row.unpaidAmount.toFixed(2));
          }
        },
        {
          title: "对账单状态",
          key: "statementStatusName",
          className: "tc",
          minWidth:120,
          fixed:"left"
        },
        {
          title: "计算结算类型",
          key: "billingTypeName",
          className: "tc",
          minWidth:120,
          fixed:"left"
        },

        {
          title: "对账人",
          key: "createUname",
          className: "tc",
          minWidth:120
        },
        {
          title: "最近一次回款时间",
          key: "lastPaymentDate",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.lastPaymentDate
                }
              }, params.row.lastPaymentDate)
            ])
          }
        },
        {
          title: "备注",
          key: "remark",
          className: "tc",
          minWidth:100,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.remark
                }
              }, params.row.remark)
            ])
          }
        },
        {
          title: "流程是否通过",
          key: "passName",
          className: "tc",
          minWidth:120
        },
        {
          title: "最近一次开票申请人",
          key: "recentApplier",
          className: "tc",
          minWidth:140
        },
        {
          title: "最近一次开票申请时间",
          key: "recentTime",
          className: "tc",
          minWidth:140,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.recentTime
                }
              }, params.row.recentTime)
            ])
          }
        },
        {
          title: "含税配件金额",
          key: "taxAmountOfPart",
          className: "tc",
          minWidth:120
        },
        {
          title: "含税油品",
          key: "taxAmountOfOil",
          className: "tc",
          minWidth:120
        },
        {
          title: "不含税金额",
          key: "noTaxAmount",
          className: "tc",
          minWidth:120

        },
        {
          title: "含税配件已开",
          key: "taxAmountOfPartOpened",
          className: "tc",
          minWidth:120
        },
        {
          title: "含税油品已开",
          key: "taxAmountOfOilOpened",
          className: "tc",
          minWidth:120
        },
        {
          title: "不含税增加税点",
          key: "increasePointExcludingTax",
          className: "tc",
          minWidth:120
        },
        {
          title: "收到配件进项发票",
          key: "receiveInputInvoiceAmount",
          className: "tc",
          minWidth:120
        },
        {
          title: "收到含税油品金额",
          key: "receiveTaxOfOilAmount",
          className: "tc",
          minWidth:120
        },
        {
          title: "对冲配件发票",
          key: "hedgingInvoiceOfPart",
          className: "tc",
          minWidth:120
        },
        {
          title: "对冲油品发票",
          key: "hedgingInvoiceOfOil",
          className: "tc",
          minWidth:120
        },
        {
          title: "含税配件欠票",
          key: "taxArrearsOfPart",
          className: "tc",
          minWidth:120,
          // render:(h, params) => {
          //   let tax = this.$utils.subtract(params.row.taxAmountOfPart , params.row.taxAmountOfPartOpend)
          //   return h("span" , tax)
          // }
        },
        {
          title: "含税油品欠票",
          key: "taxArrearsOfOil",
          className: "tc",
          minWidth:120
        },
        {
          title: "不含税未开",
          key: "taxNotIncluded",
          className: "tc",
          minWidth:120
        },
        {
          title: "最近一次开票公司",
          key: "recentInvoiceCompany",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.recentInvoiceCompany
                }
              }, params.row.recentInvoiceCompany)
            ])
          }
        },
        {
          title: "最近一次开票名称",
          key: "recentInvoiceName",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.recentInvoiceName
                }
              }, params.row.recentInvoiceName)
            ])
          }
        }
      ],
      data2: [],
      columns1: [
        {
          title: "选择",
          minWidth: 50,
          type: "selection",
          fixed: "left"
        },
        {
          title: "序号",
          minWidth: 50,
          fixed: "left",
          render: (h, params) => {
            return h(
              "span",
              params.index + this.form.page * this.form.size + 1
            );
          }
        },
        {
          title: "登记日期",
          key: "registrationDate",
          minWidth: 70,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.registrationDate
                  }
                },
                params.row.registrationDate
              )
            ]);
          }
        },
        {
          title: "发票采购方名称",
          key: "invoicePurchaserName",
          minWidth: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.invoicePurchaserName
                  }
                },
                params.row.invoicePurchaserName
              )
            ]);
          }
        },
        {
          title: "店号",
          key: "shopNo",
          minWidth: 60,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.shopNo
                  }
                },
                params.row.shopNo
              )
            ]);
          }
        },
        {
          title: "发票代码",
          key: "invoiceCode",
          minWidth: 70,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.invoiceCode
                  }
                },
                params.row.invoiceCode
              )
            ]);
          }
        },
        {
          title: "发票号",
          key: "invoiceNo",
          minWidth: 65,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.invoiceNo
                  }
                },
                params.row.invoiceNo
              )
            ]);
          }
        },
        {
          title: "发票销售方名称",
          key: "invoiceSellerName",
          minWidth: 110,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.invoiceSellerName
                  }
                },
                params.row.invoiceSellerName
              )
            ]);
          }
        },
        {
          title: "开票日期",
          key: "billingDate",
          minWidth: 70,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.billingDate
                  }
                },
                params.row.billingDate
              )
            ]);
          }
        },
        {
          title: "对账应付",
          key: "reconciliation",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h("span", params.row.reconciliation.toFixed(2));
          }
        },
        {
          title: "应付返利",
          key: "dealingRebates",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h("span", params.row.dealingRebates.toFixed(2));
          }
        },
        {
          title: "应付坏账",
          key: "payingBadDebts",
          className: "tc",
          minWidth:120,
          render: (h, params) => {
            return h("span", params.row.payingBadDebts.toFixed(2));
          }
        },
        {
          title: "本次核销金额",
          key: "rpAmt",
          className: "tc",
          width: 180,
          render: (h, params) => {
            return h("el-input-number", {
              props: {
                precision: 2,
                controls: false,
                value: params.row.paymentBalance || 0.0,
                size: "small",
                min: 0.0,
                max:
                  params.row.paymentBalance < this.data[0].applyAmt
                    ? params.row.paymentBalance
                    : this.data[0].applyAmt
              },
              on: {
                input: val => {
                  this.data1[params.index].rpAmt = val;
                }
              }
            });
          }
        },
        {
          title: "已核销金额",
          key: "writeOffAmount",
          className: "tc"
        },
        {
          title: "剩余未核销金额",
          key: "paymentBalance",
          className: "tc"
        },
        {
          title: "价税合计金额",
          key: "totalAmt",
          minWidth: 90
        },
        {
          title: "金额",
          key: "invoiceAmt",
          minWidth: 70
        },
        {
          title: "税额",
          key: "taxAmt",
          minWidth: 70
        },
        {
          title: "税率",
          key: "taxRate",
          minWidth: 70
        },
        {
          title: "往来单位",
          key: "guestName",
          minWidth: 70,
          fixed: "left",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.guestName
                  }
                },
                params.row.guestName
              )
            ]);
          }
        },
        {
          title: "付款方式",
          key: "payTypeName",
          minWidth: 70
        },
        {
          title: "发票分类",
          key: "invoiceSortName",
          minWidth: 70
        },
        {
          title: "开票清单类型",
          key: "billingTypeName",
          minWidth: 90
        },
        {
          title: "增加类型",
          key: "addTypeName",
          minWidth: 70
        },
        {
          title: "导入经办人",
          key: "importUname",
          minWidth: 80,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.importUname
                  }
                },
                params.row.importUname
              )
            ]);
          }
        },
        {
          title: "登记时间",
          key: "registrationTime",
          minWidth: 70,
          className: "tc",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.registrationTime
                  }
                },
                params.row.registrationTime
              )
            ]);
          }
        },
        {
          title: "勾选认证时间",
          key: "checkCertificationTime",
          minWidth: 90,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.checkCertificationTime
                  }
                },
                params.row.checkCertificationTime
              )
            ]);
          }
        },
        {
          title: "是否退回",
          key: "returned",
          className: "tc",
          minWidth: 70,
          render: (h, params) => {
            return h("span", params.row.returned ? "是" : "否");
          }
        },
        {
          title: "退回经办人",
          key: "returnUname",
          minWidth: 80,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.returnUname
                  }
                },
                params.row.returnUname
              )
            ]);
          }
        },
        {
          title: "退回时间",
          key: "returnTime",
          minWidth: 70,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.returnTime
                  }
                },
                params.row.returnTime
              )
            ]);
          }
        },
        {
          title: "是否红字转出",
          key: "redHedged",
          minWidth: 90,
          render: (h, params) => {
            return h("span", params.row.redHedged ? "是" : "否");
          }
        },
        {
          title: "红冲经办人",
          key: "hedgeUname",
          minWidth: 80,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.hedgeUname
                  }
                },
                params.row.hedgeUname
              )
            ]);
          }
        },
        {
          title: "红冲时间",
          key: "hedgeTime",
          minWidth: 70,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.hedgeTime
                  }
                },
                params.row.hedgeTime
              )
            ]);
          }
        },
        {
          title: "对号账单",
          key: "accountNo",
          width: 70,
          render: (h, params) => {
            let arr = [];
            if (params.row.accountNo != null) {
              params.row.accountNo.forEach((item, i) => {
                arr.push(
                  h(
                    "span",
                    {
                      style: {
                        color: "red",
                        display: "inline-block",
                        width: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      },
                      on: {
                        click: () => {
                          this.$refs.Toast.modal6 = true;
                          this.$refs.Toast.accountNo = item;
                          this.$refs.Toast.getToastData();
                        }
                      }
                    },
                    item
                  )
                );
              });
            }
            return h("div", arr);
          }
        },
        {
          title: "核销人",
          key: "cancelUname",
          minWidth: 70,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.cancelUname
                  }
                },
                params.row.cancelUname
              )
            ]);
          }
        },
        {
          title: "核销时间",
          key: "cancelTime",
          minWidth: 70,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.cancelTime
                  }
                },
                params.row.cancelTime
              )
            ]);
          }
        }
      ],
      data1: [],
      form: {
        orgid: "",
        invoiceNo: "",
        receiptUnit: "",
        page: 0,
        size: 9999,
        guestId: ""
      },
      allSelectList: [],
      allSelectListBottom: [],
      proTypeList: [],
      invoice: {
        issuingOfficeList: []
      },
      company: [],
      form1: {
        invoiceNo: "",
        invoiceSellerName: ""
      },
      pagetotal: 0,
      page: {
        num: 1,
        size: 10
      }
    };
  },
  methods: {
    init(data) {
      if (Array.isArray(data)) {
        this.query();
        this.data1 = data;
      }else{
        this.data2 = []
        this.data2.push(data)
      }
      this.modals = true;
    },
    changedate(daterange) {
      this.value = daterange;
    },
    async getOne(query) {
      this.company = [];
      if (query != "") {
        this.remoteloading = true;
        findGuest({ fullName: query, size: 20 }).then(res => {
          if (res.code === 0) {
            this.company = [];
            res.data.content.map(item => {
              this.company.push({
                value: item.id,
                label: item.fullName
              });
            });
            this.remoteloading = false;
          }
        });
      } else {
        this.company = [];
      }
    },
    query() {
      this.page.num = 1
      this.getAccountStatement();
    },
    pageCode(page) {
      this.page.num = page
      this.getAccountStatement();
    },
    // 对账总表
    getAccountStatement() {
      let obj = {
        startDate: this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD")+" 00:00:00"
          : "",
        endDate: this.value[1]
          ? moment(this.value[1]).format("YYYY-MM-DD")+" 23:59:59"
          : "",
        guestId: this.form.guestId
      };
      obj.page = this.page.num - 1;
      obj.size = this.page.size;
      AccountStatement(obj).then(res => {
        this.pagetotal = res.data.totalElements;
        if (res.data.content.length !== 0) {
          res.data.content.map((item, index) => {
            item.index = index + 1;
            item.paymentTypeName = item.paymentType.name;
            item.billingTypeName = item.billingType.name;
            item.statementStatusName = item.statementStatus.name;
          });
          this.data2 = res.data.content;
        } else {
          this.data2 = [];
        }
      });
    },
    submitConfig() {
      if (!(this.allSelectList.length && this.allSelectListBottom.length)) {
        this.$Message.warning("请选择要核销的数据");
      } else if (this.allSelectList.length >= 2 || this.allSelectListBottom.length >= 2) {
        this.$Message.warning("请选择一条数据");
      } else {
        this.hxOjb.salesInvoiceId = this.allSelectList[0].id;
        this.hxOjb.invoiceApplyId = this.allSelectListBottom[0].id;
        let d = this.data1.find(el => el.id == this.allSelectListBottom[0].id);
        this.hxOjb.rpAmt = d.rpAmt;
        subManualList2(this.hxOjb).then(res => {
          if (res.code === 0) {
            this.$Message.warning("核销成功");
            this.model1 = false;
            this.hxOjb = {
              invoiceApplyId: "",
              salesInvoiceId: ""
            };
            if(this.$parent.getDataList) {
              this.$parent.getDataList();
            }
            this.$emit('getnewList' ,{})
          }
        });
      }
    },
    queryDataList() {
      this.getTabList();
    },
    requireMore(val) {
      this.allSelectList = val;
    },
    requireMore2(val) {
      this.allSelectListBottom = val;
    },
    getTabList() {
      let data = this.form1;
      getManageList(data)
        .then(res => {
          if (res.code === 0) {
            this.data1 = res.data.content;
          }
        })
        .catch(err => {});
    },
    async getShop() {
      let data = {};
      data.supplierTypeSecond = this.model1;
      let res = await goshop(data);
      if (res.code === 0) {
        this.proTypeList = [...this.proTypeList, ...res.data];
        this.$nextTick(() => {
          if (localStorage.getItem("oms2-userList")) {
            this.BranchstoreId = JSON.parse(
              localStorage.getItem("oms2-userList")
            ).shopId;
          } else {
            this.BranchstoreId = this.$store.state.user.userData.shopId;
          }
        });
      }
    }
  },
  mounted() {
    this.form1.invoiceSellerName = this.$store.state.user.userData.makeCode
    this.getShop();
    this.proTypeList.map(itm => {
      this.$refs.registrationEntry.orgName = itm.name;
    });
    getDataDictionaryTable({ dictCode: "KPDW" }).then(res => {
      res.data.map(item => {
        this.invoice.issuingOfficeList.push({
          value: item.itemCode,
          label: item.itemName
        });
      });
    });
  }
};
</script>
<style lang="less" scoped></style>
