<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box paddinSize">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <quickDate class="mr10" ref="quickDate" @quickDate="quickDate"></quickDate>
          </div>
          <div class="db ml20">
            <span>申请时间：</span>
            <Date-picker
              format="yyyy-MM-dd"
              :value="value"
              @on-change="changedate"
              type="daterange"
              placeholder="选择日期"
              class="w200"
            ></Date-picker>
          </div>
          <div class="ml20 flexd" >
             <span>分店名称：</span>
              <Select v-model="form.orgName" style="width:180px" :disabled="selectShopList">
                <Option v-for="item in proTypeList" :value="item.id" :key="item.id">{{item.name}}</Option>
              </Select>
            <!-- <i class="iconfont iconcaidan input" @click="Dealings(1)"></i> -->
          </div>
          <div class="db ml20">
            <span>客户：</span>
<!--              <Select v-model="form.guestId" style="width:180px">-->
<!--                <Option v-for="item in guestNameList" :value="item.id" :key="item.id">{{item.fullName}}</Option>-->
<!--              </Select>-->
            <Select
              v-model="form.guestId"
              clearable
              filterable
              :loading=loading1
              remote
              :remote-method="remoteMethod"
              style="width:200px;padding-left: 5px"
            >
              <Option
                v-for="item in company"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}
              </Option
              >
            </Select>
          </div>
          <div class="db ml10">
            <button class="ivu-btn ivu-btn-default" v-noresub="1000" @click="query" type="button">
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
        </div>
      </div>
      <div>
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="operation(1)"
          v-has="'exportAll'"
        >导出汇总</button>
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="operation(2)"
          v-has="'exportList'"
        >导出明细</button>
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="operation(3)"
          v-has="'ai'"
        >智能核销</button>
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="operation(4)"
          v-has="'labour'"
        >人工核销</button>
        <button
          class="ivu-btn ivu-btn-default"
          type="button"
          @click="operation(5)"
          v-has="'backout'"
        >撤销核销</button>
      </div>
      <div class="mt20">
        <Button class="mr10" :type="isActive===''?'info':'default'" @click="chooseTable('')">全部显示</Button>
        <Button class="mr10" :type="isActive==1?'info':'default'" @click="chooseTable(1)">已核销</Button>
        <Button :type="isActive===0?'info':'default'" @click="chooseTable(0)">未核销</Button>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <Table
          border
          :columns="columns"
          :data="data"
          ref="summary"
          highlight-row
          @on-selection-change="requires"
          max-height="400"
        ></Table>
        <Page
          :total="pagetotal"
          show-elevator
          class="mt10 fr"
          show-sizer
          @on-change="pageCode"
          show-total
          size="small"
        />
        <button class="mt30 ivu-btn ivu-btn-default" type="button">开票申请配件明细</button>
        <Table border :columns="columns1" :data="data1" class="mt10" max-hight="400" ref="parts"></Table>
      </div>
    </section>
    <invoiceApplyModelTost ref="Toast"></invoiceApplyModelTost>
  </div>
</template>
<script>
import {
  getInvoiceList,
  getDetailsList,
  getDetailsListApply,
  IntelligenceList,
  updateNumber,
  writeData,
  getOptionFdList,
  getOptionGuesList
} from "_api/salesManagment/invoiceApply";
import { goshop } from '@/api/settlementManagement/shopList';
import invoiceApplyModelTost from "./invoiceApplyModelTost.vue";
import quickDate from "@/components/getDate/dateget_bill.vue";
import {getGuestShortName} from "@/api/documentApproval/documentApproval/documentApproval";
import moment from "moment";

/**
 * 序号	分店名称	店号	往来单位	      申请日期	  对账单号	 开票申请单号	发票种类	  购方税号	      购方邮箱	购方开户行及账号	 购方地址、电话	开票单位	   配件名称	配件编码
        orgName	orgCode	guestName	applyDate	accountNo	applyNo	invoiceKind	customDuty	customMail	customAccount	tel	       invoiceUnit	partName	partCode
 油品包装规格	油品换算单位	油品换算数量	单位	数量	    商品含税单价	商品含税金额	开票税率	出库单号	销售单价	销售金额	已开票金额	未开票金额	       外加税点	          申请开票总金额	收款方式	开票清单类型	备注	       快递方式	发票性质	推送手机	税收分类编码	是否享受优惠政策	优惠政策名称	零税率标识	扣除额	折扣金额	收款人（只有快递收件人和收款方式）	复核人	开票人（只有导入开票单位和申请人）
 oilsSpec	oilsUnit	oilsQty	unit	qty	         taxPrice	   taxAmt    	taxRate	  outNo  	salePrice	saleAmt	invoiceAmt	invoiceNotAmt	additionalTaxPoint	applyAmt	collectionType	isOilPart	remark	sendingWay
 *
 * */
export default {
  name: "invoiceAdministrationInvoiceApply",
  components: {
    invoiceApplyModelTost,
    quickDate
  },
  data() {
    return {
      btnTestDir:false,

      proTypeList:[],//分店
      columns: [
        {
          title: "选择",
          minWidth: 40,
          type: "selection",
          fixed: "left"
        },
        {
          title: "序号",
          key:"seq",
          className: "tc",
          minWidth: 40,
          fixed: "left"
        },
        {
          title: "分店名称",
          key: "orgName",
          className: "tc",
          minWidth: 100,
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
          title: "店号",
          key: "orgCode",
          className: "tc",
          minWidth: 100,
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
                  title: params.row.orgCode
                }
              }, params.row.orgCode)
            ])
          }
        },
        {
          title: "开票申请单",
          key: "applyNo",
          className: "tc",
          minWidth: 180,
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: "red"
                },
                on: {
                  click: () => {
                    // this.details.accountNo = params.row.accountNo;
                    this.details.id = params.row.id;
                    this.getDetails();
                  }
                }
              },
              params.row.applyNo
            );
          }
        },
        {
          title: "往来单位",
          key: "guestName",
          className: "tc",
          minWidth: 100,
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
          title: "申请日期",
          key: "applyDate",
          className: "tc",
          minWidth: 100,
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
                  title: params.row.applyDate
                }
              }, params.row.applyDate)
            ])
          }
        },
        {
          title: "对账单号",
          key: "accountNo",
          className: "tc",
          minWidth: 180,
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
          title: "开票单位",
          key: "receiptUnit",
          className: "tc",
          minWidth: 100,
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
                  title: params.row.receiptUnit
                }
              }, params.row.receiptUnit)
            ])
          }
        },
        {
          title:"税点",
          key:"additionalTaxPoint",
          className: "tc",
          minWidth: 80,
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
                  title: params.row.additionalTaxPoint
                }
              }, params.row.additionalTaxPoint)
            ])
          }
        },
        {
          title: "申请开票金额",
          key: "applyAmt",
          className: "tc",
          minWidth: 180,
        },
        {
          title: "开票公司",
          key: "invoiceUnit",
          className: "tc",
          minWidth: 100,
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
                  title: params.row.invoiceUnit
                }
              }, params.row.invoiceUnit)
            ])
          }
        },
        // {
        //   title: "开票清单类型",
        //   key: "species",
        //   className: "tc"
        // },
        {
          title: "寄件方式",
          key: "sendingWay",
          className: "tc",
          minWidth: 150
        },
        {
          title: "快递单号",
          key: "sendingNumber",
          className: "tc",
          minWidth: 100,
          render: (h, params) => {
            return h("Input", {
              style: {
                width: "60px",
                display: 'inline-block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
              props: {
                type: "text",
                // value:this.data1[params.index].sort
                value: params.row.sendingNumber
              },
              on: {
                "on-blur": event => {
                  // this.data1[params.index].sort =event.target.value
                  let form = {
                    id: params.row.id,
                    sendingNumber: event.target.value
                  };
                  updateNumber(form).then(res => {
                    if (res.code === 0) {
                      this.$Message.success(res.data);
                      this.getDataList();
                    }
                  });
                }
              }
            });
          }
        },
        {
          title: "发票代码",
          key: "invoiceCode",
          className: "tc",
          minWidth: 100,
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
                  title: params.row.invoiceCode
                }
              }, params.row.invoiceCode)
            ])
          }
        },
        {
          title: "发票号码",
          key: "invoiceNo",
          className: "tc",
          minWidth: 100,
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
                  title: params.row.invoiceNo
                }
              }, params.row.invoiceNo)
            ])
          }
        },
        {
          title: "导入开票单位",
          key: "importInvoiceUnit",
          className: "tc",
          minWidth: 100,
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
                  title: params.row.importInvoiceUnit
                }
              }, params.row.importInvoiceUnit)
            ])
          }
        },
        {
          title: "验证开票单位",
          key: "verifyInvoiceUnit",
          className: "tc",
          minWidth: 100,
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
                  title: params.row.verifyInvoiceUnit
                }
              }, params.row.verifyInvoiceUnit)
            ])
          }
        },
        {
          title: "增发票价税合计加类型",
          key: "priceTaxTotal",
          className: "tc",
          minWidth: 220,
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
                  title: params.row.priceTaxTotal
                }
              }, params.row.priceTaxTotal)
            ])
          }
        },
        {
          title: "发票不含税金额",
          key: "notTaxAmt",
          className: "tc",
          minWidth: 180
        },
        {
          title: "发票税额",
          key: "invoiceTax",
          className: "tc",
          minWidth: 180
        },
        {
          title: "已核销金额",
          key: "canceledTax",
          className: "tc",
          minWidth: 180
        },
        {
          title: "剩余未核销开票",
          key: "remainCancelTax",
          className: "tc",
          minWidth: 150,
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
                  title: params.row.remainCancelTax
                }
              }, params.row.remainCancelTax)
            ])
          }
        }
      ],
      data: [],
      columns1: [
        {
          title: "序号",
          key:"seq",
          width: 40,
          className: "tc"
        },
        {
          title: "分店名称",
          key: "orgName",
          minWidth: 100,
          className: "tc",
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
          title: "店号",
          key: "orgCode",
          minWidth: 60,
          className: "tc",
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
                  title: params.row.orgCode
                }
              }, params.row.orgCode)
            ])
          }
        },
        {
          title: "往来单位",
          minWidth: 100,
          key: "guestName",
          className: "tc"
        },
        {
          title: "申请日期",
          minWidth: 100,
          key: "applyDate",
          className: "tc",
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
                  title: params.row.applyDate
                }
              }, params.row.applyDate)
            ])
          }
        },
        {
          title: "对账单号",
          minWidth: 100,
          key: "accountNo",
          className: "tc",
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
          title: "开票申请单号",
          minWidth: 160,
          key: "oilsListOrder",
          className: "tc",
          render: (h, params) => {
            let no = params.row.applyNo;// params.row.oilsListOrder || params.row.partsListOrder;
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
                  title: no
                }
              }, no)
            ])
          }
        },
        {
          title: "发票种类",
          minWidth: 100,
          className: "tc",
          render: (h , params) => {
            return h('span' , params.row.invoiceKind == 1 ? '增值税普通发票' : '增值税专用发票')
          }
        },
        {
          title: "购方税号",
          minWidth: 100,
          key: "customDuty",
          className: "tc",
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
                  title: params.row.customDuty
                }
              }, params.row.customDuty)
            ])
          }
        },
        {
          title: "购方邮箱",
          minWidth: 100,
          key: "customMail",
          className: "tc",
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
                  title: params.row.customMail
                }
              }, params.row.customMail)
            ])
          }
        },
        {
          title: "购方开户行及账号",
          minWidth: 130,
          key: "customAccount",
          className: "tc",
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
                  title: params.row.customAccount
                }
              }, params.row.customAccount)
            ])
          }
        },
        {
          title: "购方开户行",
          minWidth: 100,
          key: "customBank",
          className: "tc"
        },
        {
          title: "购方地址、电话",
          minWidth: 100,
          key: "tel",
          className: "tc",
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
                  title: params.row.tel
                }
              }, params.row.tel)
            ])
          }
        },
        {
          title: "开票单位",
          minWidth: 100,
          key: "invoiceUnitName",
          className: "tc",
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
                  title: params.row.invoiceUnitName
                }
              }, params.row.invoiceUnitName)
            ])
          }
        },
        // {
        //   title: "客户税号",
        //   minWidth: 100,
        //   key: "taxNo",
        //   className: "tc",
        //   render: (h, params) => {
        //     return h('div', [
        //       h('span', {
        //         style: {
        //           display: 'inline-block',
        //           width: '100%',
        //           overflow: 'hidden',
        //           textOverflow: 'ellipsis',
        //           whiteSpace: 'nowrap'
        //         },
        //         domProps: {
        //           title: params.row.taxNo
        //         }
        //       }, params.row.taxNo)
        //     ])
        //   }
        // },
        // {
        //   title: "地址电话",
        //   minWidth: 100,
        //   key: "tel",
        //   className: "tc",
        //   render: (h, params) => {
        //     return h('div', [
        //       h('span', {
        //         style: {
        //           display: 'inline-block',
        //           width: '100%',
        //           overflow: 'hidden',
        //           textOverflow: 'ellipsis',
        //           whiteSpace: 'nowrap'
        //         },
        //         domProps: {
        //           title: params.row.tel
        //         }
        //       }, params.row.tel)
        //     ])
        //   }
        // },
        // {
        //   title: "银行账号",
        //   minWidth: 100,
        //   key: "bankAccountNumber",
        //   className: "tc",
        //   render: (h, params) => {
        //     return h('div', [
        //       h('span', {
        //         style: {
        //           display: 'inline-block',
        //           width: '100%',
        //           overflow: 'hidden',
        //           textOverflow: 'ellipsis',
        //           whiteSpace: 'nowrap'
        //         },
        //         domProps: {
        //           title: params.row.bankAccountNumber
        //         }
        //       }, params.row.bankAccountNumber)
        //     ])
        //   }
        // },
        {
          title: "配件名称",
          minWidth: 100,
          key: "partName",
          className: "tc",
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
                  title: params.row.partName
                }
              }, params.row.partName)
            ])
          }
        },
        {
          title: "配件编码",
          key: "partCode",
          minWidth: 100,
          className: "tc",
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
                  title: params.row.partCode
                }
              }, params.row.partCode)
            ])
          }
        },
        {
          title: "油品包装规格",
          minWidth: 100,
          key: "oilsSpec",
          className: "tc"
        },
        {
          title: "油品换算单位",
          minWidth: 100,
          key: "oilsUnit",
          className: "tc"
        },
        {
          title: "油品换算数量",
          minWidth: 100,
          key: "oilsQty",
          className: "tc"
        },
        {
          title: "单位",
          minWidth: 100,
          key: "unit",
          className: "tc",
        },
        {
          title: "数量",
          minWidth: 100,
          key: "qty",
          className: "tc"
        },
        {
          title: "商品含税单价",
          minWidth: 100,
          key: "taxPrice",
          className: "tc"
        },
        {
          title: "商品含税金额",
          minWidth: 100,
          key: "taxAmt",
          className: "tc"
        },
        {
          title: "开票税率",
          minWidth: 100,
          key: "taxRate",
          className: "tc"
        },
        {
          title: "出库单号",
          minWidth: 100,
          key: "outNo",
          className: "tc",
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
                  title: params.row.outNo
                }
              }, params.row.outNo)
            ])
          }
        },
        {
          title: "销售单价",
          minWidth: 100,
          key: "salePrice",
          className: "tc"
        },
        {
          title: "销售金额",
          minWidth: 100,
          key: "saleAmt",
          className: "tc"
        },
        {
          title: "已开票金额",
          minWidth: 100,
          key: "invoiceAmt",
          className: "tc"
        },
        {
          title: "未开票金额",
          minWidth: 100,
          key: "invoiceNotAmt",
          className: "tc"
        },
        {
          title: "外加税点",
          minWidth: 100,
          key: "additionalTaxPoint",
          className: "tc"
        },
        {
          title: "申请开票总金额",
          key: "applyAmt",
          minWidth: 100,
          className: "tc"
        },
        // {
        //   title: "开票公司",
        //   minWidth: 100,
        //   key: "receiptUnit",
        //   className: "tc",
        //   render: (h, params) => {
        //     return h('div', [
        //       h('span', {
        //         style: {
        //           display: 'inline-block',
        //           width: '100%',
        //           overflow: 'hidden',
        //           textOverflow: 'ellipsis',
        //           whiteSpace: 'nowrap'
        //         },
        //         domProps: {
        //           title: params.row.receiptUnit
        //         }
        //       }, params.row.receiptUnit)
        //     ])
        //   }
        // },
        {
          title: "收款方式",
          minWidth: 100,
          key: "collectionTypeName",
          className: "tc"
        },
        // {
        //   title: "发票类型",
        //   minWidth: 100,
        //   key: "invoiceType",
        //   className: "tc"
        // },
        {
          title: "开票清单类型",
          minWidth: 100,
          key:"isOilPartText",
          className: "tc"
        },
        {
          title: "备注",
          minWidth: 100,
          key: "remark",
          className: "tc",
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
          title: "快递方式",
          minWidth: 100,
          key: "sendingWayName",
          className: "tc"
        }
      ],
      data1: [],
      value: [],
      model1: "",
      Branchstore: [1, 2, 3, 4, 5],
      Reconciliationlist: [],
      pagetotal: 0,
      Reconciliationtype: "",
      isActive: "",
      guestNameList:[],
      form: {
        orgName:'',
        guestId:'',
        page: 0,
        size: 10,
        startDate: "",
        endDate: "",
        cancalStatus: '',
      },
      details: {
        page: 0,
        size: 10,
        accountNo: ""
      },
      allTablist: [],
      flag: true,
      loading1: false,//查询时判断
    };
  },
  computed:{
    selectShopList(){
      if(this.$store.state.user.userData.currentCompany!=null){
        return this.$store.state.user.userData.currentCompany.isMaster ? true : false
      }else{
        return true
      }
    }
  },
  methods: {
    //选择查询条件
    chooseTable(num) {
      this.isActive = num;
      this.form.page = 0;
      this.form.cancalStatus = num;
      this.getDataList();
    },
    quickDate(data){
      this.value = data;
      this.form.startDate=this.value[0]?moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss"): ""
      this.form.endDate=this.value[1]? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss"): "",
      this.getDataList();
    },
    query() {
      this.form.startDate = this.value.length ? this.value[0] : "";
      this.form.endDate = this.value.length ? this.value[1] : "";
      this.getDataList();
    },
    exportSummary(){
      this.$refs.summary.exportCsv({
        filename:"开票申请查询与核销汇总表",
        data:this.data,
        columns:this.columns.filter((item)=>{if(item.title!="选择"){return item}})
      })
    },
    modifyData(){
      this.$refs.parts.exportCsv({
        filename:"开票申请配件明细表",
        data:this.data1,
        columns:this.columns1
      })
    },
    operation(num) {
      switch (num) {
        case 1:
          this.exportSummary();
          break;
        case 2:
          this.modifyData();
          break;
        case 3:
          this.Intelligence();
          break;
        case 4:
          this.cancellation();
          break;
        case 5:
          this.writeDataList();
          break;
      }
    },
    Dealings(num) {},
    //撤销核销
    writeDataList() {
      if (!this.allTablist.length) {
        return this.$Message.warning("请选择要撤销核销的数据");
      } else {
        let writeList = [];
        this.allTablist.forEach((item, index) => {
          writeList.push({
            id: item.id
          });
          if (item.canceledTax == 0 || item.canceledTax == null) {
            return (this.flag = false);
          } else {
            this.flag = true;
          }
        });
        if (this.flag) {
          this.$Modal.confirm({
            title: "警告",
            content: "<p>确认撤回核销？</p>",
            onOk: () => {
              writeData(writeList).then(res => {
                if (res.code === 0) {
                  this.$Message.success(res.data);
                  this.getDataList();
                }
              });
            },
            onCancel: () => {}
          });
        } else {
          return this.$Message.warning("请选择已核销金额不为0的数据");
        }
      }
    },
    //表格全选的时候
    requires(val) {
      this.allTablist = val;
    },
    //只能核销
    async Intelligence(){
      let data ={}
      let res = await IntelligenceList(data)
      if (res.code === 0) return this.$Message.success(res.data)
    },

    cancellation() {
      if (!this.allTablist.length) {
        return this.$Message.warning("请选择要核销的数据！");
      } else if (this.allTablist.length >= 2) {
        return this.$Message.warning("请选择一条要核销的数据！");
      } else {
        this.$refs.Toast.data = this.allTablist;
        this.$refs.Toast.modals = true;
      }
    },
    // 选择日期
    changedate(daterange) {
      this.value = daterange;
      this.getDataList()
    },
    pageCode() {},
    getDetails() {
      // getDetailsList(this.details).then(res => {
      //   if (res.code === 0) {
      //     this.data1 = res.data.content;
      //   }
      // });
      getDetailsListApply(this.details).then(res => {
        if (res.code === 0) {
          this.data1 = res.data.map((item,index)=>{
            item.isOilPart==0?item.isOilPartText="不含税":(item.isOilPart==1?item.isOilPartText="含税油品":item.isOilPartText="含税配件")
            item.seq=index+1
            return item
          });
        }
      });
    },
    getDataList() {
      getInvoiceList(this.form).then(res => {
        if (res.code === 0) {
          this.data = res.data.content.map((item,index)=>{
            item.seq=index + this.form.page * this.form.size + 1
            return item
          });
          this.pagetotal = res.data.totalElements;
        }
      });
    },
    async getShop(){
      let data ={}
      data.supplierTypeSecond = this.model1
      let res = await goshop(data)
      if (res.code === 0) {
        this.proTypeList = [...this.proTypeList , ...res.data]
        this.$nextTick( () => {
            this.form.orgName = this.$store.state.user.userData.currentShopId
        })
      }
    },

    //往来单位查询
    async remoteMethod(query) {
      this.company = [];
      if (query !== "") {
        this.loading1 = true
        let arr = []
        let req = {
          shortName: query,
          size: 50,
        }
        let res = await getGuestShortName(req);
        if (res.code == 0) {
          this.loading1 = false
          res.data.content.map(item => {
            arr.push({
              value: item.id,
              label: item.shortName,
            });
          });
        }
        let arrJson = new Set(arr)
        this.company = Array.from(arrJson)
      } else {
        this.company = [];
      }
    },
  },
  async mounted() {
    this.getDataList();
    // getOptionFdList().then(res=>{
    //   if(res.code===0){
    //     this.proTypeList=res.data
    //   }
    // })
    this.getShop()
    this.proTypeList.map(itm => {
      this.$refs.registrationEntry.orgName = itm.name;
    });
   },

};
</script>
<style lang="less" scoped>
.input {
  position: relative;
  left: -26px;
  bottom: -2px;
}
.flexd{
  display: flex;
  align-items: center;
}
</style>
