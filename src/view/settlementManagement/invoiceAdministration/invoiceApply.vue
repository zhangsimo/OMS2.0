<template>
  <div class="content-oper content-oper-flex loadingClass">
    <section class="oper-box paddinSize">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <quickDate class="mr10" ref="quickDate" @quickDate="quickDate"></quickDate>
          </div>
          <!--          <div class="db ml20">-->
          <!--            <span>申请时间：</span>-->
          <!--            <Date-picker-->
          <!--              format="yyyy-MM-dd"-->
          <!--              :value="value"-->
          <!--              @on-change="changedate"-->
          <!--              type="daterange"-->
          <!--              placeholder="选择日期"-->
          <!--              class="w200"-->
          <!--            ></Date-picker>-->
          <!--          </div>-->
          <div class="db ml20">
            <span>申请日期：</span>
            <Date-picker
              :value="value"
              @on-change="changedate"
              type="daterange"
              placeholder="选择日期"
              class="w200"
            ></Date-picker>
          </div>
          <div class="ml20 flexd">
            <span>分店名称：</span>
            <Select v-model="form.orgId" style="width:180px" :disabled="selectShopList">
              <Option v-for="item in proTypeList" :value="item.id" :key="item.id">{{item.shortName}}</Option>
            </Select>
            <!-- <i class="iconfont iconcaidan input" @click="Dealings(1)"></i> -->
          </div>
          <div class="db ml20">
            <span>往来单位：</span>
            <!--              <Select v-model="form.guestId" style="width:180px">-->
            <!--                <Option v-for="item in guestNameList" :value="item.id" :key="item.id">{{item.fullName}}</Option>-->
            <!--              </Select>-->
            <!-- <Select
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
            </Select> -->
            <input type="text" class="h30" v-model="form.guestName">
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
        >导出汇总
        </button>
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="operation(2)"
          v-has="'exportList'"
        >导出明细
        </button>
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="operation(3)"
          v-has="'ai'"
        >智能核销
        </button>
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="operation(4)"
          v-has="'labour'"
        >人工核销
        </button>
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="operation(5)"
          v-has="'backout'"
        >撤销核销
        </button>
        <button
          v-has="'backout'"
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="backCancel"
        >撤回申请
        </button>
        <Button class="ml10" @click="saveSendingNumber" v-has="'saveSendingNumber'">保存</Button>
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
          :page-size="form.size"
          :current="form.page"
          @on-change="changePage"
          :page-size-opts="pageSizeOpts"
          @on-page-size-change="changeSize"
          show-total
          size="small"
        />
        <button class="mt30 ivu-btn ivu-btn-default" type="button">开票申请配件明细</button>
        <Table border :columns="columns1" :data="data1" class="mt10" max-hight="400" ref="parts"></Table>
      </div>
    </section>
    <invoiceApplyModelTost ref="Toast"></invoiceApplyModelTost>

    <!--    //撤销审核模态框-->
    <Modal v-model="modalShow" title="撤回申请">
      <Row>
        <Col span="4">
          <span>撤回原因：</span>
        </Col>
        <Col span="20">
          <Input v-model="revokeReason"/>
        </Col>
      </Row>
      <div slot="footer">
        <Button type='primary' @click='reClose'>确定</Button>
        <Button type='default' @click='modalShow = false'>取消</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
  import {
    getInvoiceList,
    getDetailsList,
    getDetailsListApply,
    IntelligenceList,
    updateNumberList,
    writeData,
    exportModifyData/**导出配件明细*/,
    exportAll/**导出汇总*/,
    getOptionFdList,
    getOptionGuesList,
    backApply
  } from "_api/salesManagment/invoiceApply";
  import {goshop} from '@/api/settlementManagement/shopList';
  import invoiceApplyModelTost from "./invoiceApplyModelTost.vue";
  import quickDate from "@/components/getDate/dateget_bill.vue";
  import {getGuestShortName} from "@/api/documentApproval/documentApproval/documentApproval";
  import moment from "moment";
  import {showLoading, hideLoading} from "@/utils/loading"

  export default {
    name: "invoiceAdministrationInvoiceApply",
    components: {
      invoiceApplyModelTost,
      quickDate
    },
    data() {
      return {
        btnTestDir: false,

        proTypeList: [{id: '0', shortName: '全部'}],//分店
        columns: [
          {
            title: "选择",
            width: 40,
            type: "selection",
            fixed: "left",
            className: "tc",
            resizable: true,
          },
          {
            title: "序号",
            // key: "seq",
            type: "index",
            className: "tc",
            resizable: true,
            width: 40,
            fixed: "left"
          },
          {
            title: "分店名称",
            key: "orgName",
            className: "tc",
            resizable: true,
            width: 100,
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
            resizable: true,
            width: 100,
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
            resizable: true,
            width: 180,
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
                      this.details.applyAmt = params.row.applyAmt
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
            resizable: true,
            width: 100,
            fixed: "left",
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
            resizable: true,
            width: 100,
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
          // {
          //   title: "审核日期",
          //   key: "updateTime",
          //   className: "tc",
          //   width: 100,
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
          //           title: params.row.updateTime
          //         }
          //       }, params.row.updateTime)
          //     ])
          //   }
          // },
          {
            title: "对账单号",
            key: "accountNo",
            className: "tc",
            resizable: true,
            width: 180,
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
            title: "发票单位",
            key: "receiptUnit",
            className: "tc",
            resizable: true,
            width: 100,
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
            title: "税点",
            key: "additionalTaxPoint",
            className: "tc",
            resizable: true,
            width: 80,
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
            resizable: true,
            width: 180,
          },
          {
            title: "开票单位",
            key: "invoiceUnit",
            className: "tc",
            resizable: true,
            width: 100,
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
            resizable: true,
            width: 150
          },
          {
            title: "快递单号",
            key: "sendingNumber",
            className: "tc",
            resizable: true,
            width: 100,
            render: (h, params) => {
              return h("el-input", {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                props: {
                  type: "text",
                  value: params.row.sendingNumber
                },
                domProps: {
                  title: params.row.sendingNumber
                },
                on: {
                  input: val => {
                    this.data[params.index].sendingNumber = val;
                  }
                }
                // on: {
                //   "on-blur": event => {
                //     // this.data1[params.index].sort =event.target.value
                //     let form = {
                //       id: params.row.id,
                //       sendingNumber: event.target.value
                //     };
                //     updateNumber(form).then(res => {
                //       if (res.code === 0) {
                //         this.$Message.success(res.data);
                //         this.getDataList();
                //       }
                //     });
                //   }
                // }
              });
            }
          },
          {
            title: "发票代码",
            key: "invoiceCode",
            className: "tc",
            resizable: true,
            width: 100,
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
            resizable: true,
            width: 100,
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
            resizable: true,
            width: 100,
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
            resizable: true,
            width: 100,
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
            resizable: true,
            width: 220,
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
            resizable: true,
            width: 180
          },
          {
            title: "发票税额",
            key: "invoiceTax",
            className: "tc",
            resizable: true,
            width: 180
          },
          {
            title: "已核销金额",
            key: "canceledTax",
            className: "tc",
            resizable: true,
            width: 180
          },
          {
            title: "剩余未核销开票",
            key: "remainCancelTax",
            className: "tc",
            resizable: true,
            width: 150,
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
            key: "seq",
            width: 40,
            className: "tc",
            resizable: true,
          },
          {
            title: "分店名称",
            key: "orgName",
            width: 100,
            className: "tc",
            resizable: true,
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
            width: 60,
            className: "tc",
            resizable: true,
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
            width: 100,
            key: "guestName",
            className: "tc",
            resizable: true,
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
            width: 100,
            key: "applyDate",
            className: "tc",
            resizable: true,
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
            width: 100,
            key: "accountNo",
            className: "tc",
            resizable: true,
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
            width: 160,
            className: "tc",
            resizable: true,
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
            width: 100,
            className: "tc",
            resizable: true,
            render: (h, params) => {
              let text = null;
              switch (params.row.invoiceKind) {
                case "010101":
                  text = null//收据
                  break;
                case "010102":
                  text = "c";//普票
                  break;
                case "010103":
                  text = "s";//专票
                  break;
                default:
                  text = null;
                  break;
              }
              return h('span', text)
            }
          },
          {
            title: "发票单位",
            width: 100,
            className: "tc",
            resizable: true,
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
                    title: params.row.receiptUnitName
                  }
                }, params.row.receiptUnitName)
              ])
            }
          },
          {
            title: "税号",
            width: 100,
            key: "customDuty",
            className: "tc",
            resizable: true,
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
            title: "地址",
            width: 100,
            key: "tel",
            className: "tc",
            resizable: true,
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
            title: "电话",
            width: 100,
            key: "",
            className: "tc",
            resizable: true,
          },
          {
            title: "开户行",
            width: 130,
            key: "customAccount",
            className: "tc",
            resizable: true,
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
            title: "账号",
            width: 100,
            key: "",
            className: "tc",
            resizable: true,
          },
          {
            title: "发票性质",
            width: 100,
            key: "isOilPart",
            className: "tc",
            resizable: true,
            render: (h, params) => {
              let text = ""
              params.row.isOilPart == 1 ? text = "1" : text = "0"
              return h("span", text)
            }
          },
          {
            title: "推送手机",
            width: 100,
            key: "",
            className: "tc",
            resizable: true,
          },
          {
            title: "邮箱",
            width: 100,
            key: "customMail",
            className: "tc",
            resizable: true,
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
            title: "备注",
            width: 100,
            key: "",
            className: "tc",
            resizable: true,
          },
          {
            title: "商品名称",
            width: 100,
            key: "partName",
            className: "tc",
            resizable: true,
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
            title: "税率",
            width: 100,
            key: "taxRate",
            className: "tc",
            resizable: true,
          },
          {
            title: "规格型号",
            key: "partCode",
            width: 100,
            className: "tc",
            resizable: true,
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
            title: "计量单位",
            width: 100,
            key: "calculateUnit",
            className: "tc",
            resizable: true,
          },
          {
            title: "数量",
            width: 100,
            key: "qty",
            className: "tc",
            resizable: true,
          },
          {
            title: "含税单价",
            width: 100,
            key: "taxPrice",
            className: "tc",
            resizable: true,
          },
          {
            title: "金额",
            width: 100,
            key: "applyAmtSell",
            className: "tc",
            resizable: true,
          },
          {
            title: "税收分类编码",
            width: 100,
            key: "",
            className: "tc",
            resizable: true,
          },
          {
            title: "是否享受优惠政策",
            width: 110,
            className: "tc",
            resizable: true,
            render: (h, params) => {
              let text = "";
              //1 是 0 否
              // params.row.offsetQty=="1"?text="是":text="否"
              return h("span", "")
            }
          },
          {
            title: "优惠政策名称",
            width: 100,
            key: "",
            className: "tc",
            resizable: true,
          },
          {
            title: "零税率标识",
            width: 100,
            key: "",
            className: "tc",
            resizable: true,
          },
          {
            title: "扣除额",
            width: 100,
            key: "",
            className: "tc",
            resizable: true,
          },
          {
            title: "折扣金额",
            width: 100,
            key: "",
            className: "tc",
            resizable: true,
          },
          {
            title: "收款人",
            width: 100,
            key: "",
            className: "tc",
            resizable: true,
          },
          {
            title: "复核人",
            width: 100,
            key: "",
            className: "tc",
            resizable: true,
          },
          {
            title: "开票人",
            width: 100,
            key: "",
            className: "tc",
            resizable: true,
          },
          {
            title: "出库单号",
            width: 100,
            key: "outNo",
            className: "tc",
            resizable: true,
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
            title: "单位",
            width: 100,
            key: "unit",
            className: "tc",
            resizable: true,
          },
          {
            title: "油品包装规格",
            width: 100,
            key: "oilsSpec",
            className: "tc",
            resizable: true,
          },
          {
            title: "油品换算单位",
            width: 100,
            key: "oilsUnit",
            className: "tc",
            resizable: true,
          },
          {
            title: "油品换算数量",
            width: 100,
            key: "oilsQty",
            className: "tc",
            resizable: true,
          },
          {
            title: "数量",
            width: 50,
            key: "matchQty",
            className: "tc",
            resizable: true,
          },
          {
            title: "销售单价",
            width: 100,
            key: "salePrice",
            className: "tc",
            resizable: true,
          },
          {
            title: "销售金额",
            width: 100,
            key: "saleAmt",
            className: "tc",
            resizable: true,
          },
          {
            title: "已开票金额",
            width: 100,
            key: "invoiceAmt",
            className: "tc",
            resizable: true,
          },
          {
            title: "未开票金额",
            width: 100,
            key: "invoiceNotAmt",
            className: "tc",
            resizable: true,
          },
          {
            title: "申请开票总金额",
            key: "applyAmt",
            width: 100,
            className: "tc",
            resizable: true,
          },
          {
            title: "外加税点",
            width: 100,
            key: "additionalTaxPoint",
            className: "tc",
            resizable: true,
          },
          {
            title: "开票清单类型",
            width: 100,
            key: "isOilPartText",
            className: "tc",
            resizable: true,
          },
          {
            title: "开票单位",
            width: 100,
            key: "invoiceUnitName",
            className: "tc",
            resizable: true,
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
          {
            title: "收款方式",
            width: 100,
            key: "collectionTypeName",
            className: "tc",
            resizable: true,
          },
          {
            title: "收件地址",
            width: 100,
            key: "address",
            className: "tc",
            resizable: true,
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
                    title: params.row.address
                  }
                }, params.row.address)
              ])
            }
          },
          {
            title: "快递方式",
            width: 100,
            key: "sendingWayName",
            className: "tc",
            resizable: true,
          },
          {
            title: "备注",
            width: 100,
            key: "remark",
            className: "tc",
            resizable: true,
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
          }
        ],
        data1: [],
        value: [],
        model1: "",
        Branchstore: [1, 2, 3, 4, 5],
        Reconciliationlist: [],
        pagetotal: 0,
        pageSizeOpts:[10,50,100,200],
        Reconciliationtype: "",
        isActive: "",
        guestNameList: [],
        form: {
          orgId: '',
          guestName: '',
          page: 1,
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
        company: [],
        modalShow: false,//撤销模态框
        revokeReason: '',//撤销理由
      };
    },
    computed: {
      selectShopList() {
        if (this.$store.state.user.userData.currentCompany != null) {
          return this.$store.state.user.userData.currentCompany.isMaster ? true : false
        } else {
          return true
        }
      }
    },
    methods: {

      //撤销模态框
      backCancel() {
        if (this.allTablist.length === 0) return this.$Message.error('请选择一条需要撤回的申请')
        if (this.allTablist.length > 1) return this.$Message.error('只能选择一条需要撤回的申请')
        if (this.allTablist.length === 1 && this.allTablist[0].cancalStatus === 1) return this.$Message.error('该条数据已核销不能撤回')
        this.revokeReason = ''
        this.modalShow = true;
      },
      //批量保存快递单号
      saveSendingNumber() {
        if (this.allTablist.length < 1) {
          return this.$message.error("请选择要保存的快递单号")
        }
        let arr=[];
        this.allTablist.map(el=>{
          let form = {
            id: el.id,
            sendingNumber: el.sendingNumber
          };
          arr.push(form)
        })
        showLoading()
        updateNumberList(arr).then(res => {
          if (res.code === 0) {
            this.$Message.success(res.data);
            this.getDataList();
            //清空选中
            this.$refs.summary.selectAll(false);
            hideLoading()
          }
        }).catch(err=>{
          hideLoading()
        })
      },
      //确定撤销
      async reClose() {
        if (!this.revokeReason.trim()) return this.$Message.error('撤回原因必须')
        let data = {}
        data.id = this.allTablist[0].id
        data.revokeReason = this.revokeReason
        let res = await backApply(data)
        if (res.code === 0) {
          this.modalShow = false;
          this.$Message.success('撤销成功')
          this.query()
        }

      },

      //选择查询条件
      chooseTable(num) {
        this.isActive = num;
        this.form.page = 1;
        this.form.cancalStatus = num;
        this.getDataList();
      },
      quickDate(data) {
        this.value = data;
        if (this.selectShopList == true) {
          this.form.orgId = this.$store.state.user.userData.currentCompany != null ? this.$store.state.user.userData.currentCompany.id : ""
        }
        this.form.startDate = this.value[0] ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss") : ""
        this.form.endDate = this.value[1] ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59" : "",
        this.form.page = 1
          this.getDataList();
      },
      query() {
        this.form.page = 1
        this.form.startDate = this.value[0] ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss") : "";
        this.form.endDate = this.value[1] ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59" : "";
        this.getDataList();
      },
      exportSummary() {
        // this.$refs.summary.exportCsv({
        //   filename:"开票申请查询与核销汇总表",
        //   data:this.data,
        //   columns:this.columns.filter((item)=>{if(item.title!="选择"){return item}})
        // })
        if (this.data.length < 1) {
          return this.$message.error("暂无数据可导出")
        }
        let params = "";
        let obj = {
          orgId: this.form.orgId == '0' ? '' : this.form.orgId,
          guestName: this.form.guestName,
          pagesize: this.pagetotal,
          startDate: this.form.startDate,
          endDate: this.form.endDate,
          cancalStatus: this.form.cancalStatus,
        };
        for (var i in obj) {
          params += `${i}=${obj[i]}&`
        }
        location.href = exportAll(params)
      },
      modifyData() {
        // this.$refs.parts.exportCsv({
        //   filename:"开票申请配件明细表",
        //   data:this.data1,
        //   columns:this.columns1
        // })
        if (this.allTablist.length < 1) {
          return this.$Message.error("请选择需要导出的数据")
        }
        location.href = exportModifyData(this.allTablist)
      },
      //分页
      changePage(p) {
        this.form.page = p;
        this.getDataList();
      },
      changeSize(s) {
        this.form.page = 1;
        this.form.size = s;
        this.getDataList();
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
      Dealings(num) {
      },
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
              onCancel: () => {
              }
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
      async Intelligence() {
        let data = {}
        let res = await IntelligenceList(data)
        if (res.code === 0) return this.$Message.success(res.data)
      },

      cancellation() {
        if (!this.allTablist.length) {
          return this.$Message.warning("请选择要核销的数据！");
        } else if (this.allTablist.length >= 2) {
          return this.$Message.warning("请选择一条要核销的数据！");
        } else if (this.allTablist[0].remainCancelTax <= 0) {
          return this.$Message.warning("剩余未核销金额为0")
        } else {
          this.$refs.Toast.data = this.allTablist;
          this.$refs.Toast.modals = true;
        }
      },
      // 选择日期
      changedate(daterange) {
        this.value = daterange;
        this.form.startDate = this.value[0] ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss") : "";
        this.form.endDate = this.value[1] ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59" : "";
        this.getDataList()
      },
      pageCode() {
      },
      getDetails() {
        // getDetailsList(this.details).then(res => {
        //   if (res.code === 0) {
        //     this.data1 = res.data.content;
        //   }
        // });
        getDetailsListApply(this.details).then(res => {
          if (res.code === 0) {
            this.data1 = res.data.map((item, index) => {
              item.isOilPart == 0 ? item.isOilPartText = "不含税" : (item.isOilPart == 1 ? item.isOilPartText = "含税油品" : item.isOilPartText = "含税配件")
              item.applyAmtSell = item.applyAmt
              item.applyAmt = this.details.applyAmt
              // item.
              item.seq = index + 1
              return item
            });
          }
        });
      },
      getDataList() {
        showLoading(".loadingClass", "数据加载中，请勿操作")
        let params = {
          page: this.form.page-1,
          size: this.form.size
        }
        this.form.guestName = this.form.guestName.trim()
        if(this.form.orgId == '0'){
          this.form.orgId = ''
        }
        getInvoiceList(params, this.form).then(res => {
          if (res.code === 0) {
            this.data = res.data.content.map((item, index) => {
              item.seq = index + this.form.page * this.form.size + 1
              return item
            });
            this.pagetotal = res.data.totalElements;
            this.allTablist=[]
            hideLoading();
          }
          hideLoading()
        }).catch(e => {
          hideLoading()
        });
      },
      async getShop() {
        let data = {}
        data.supplierTypeSecond = this.model1
        let res = await goshop(data)
        if (res.code === 0) {
          this.proTypeList = [...this.proTypeList, ...res.data]
          this.$nextTick(() => {
            this.form.orgId = this.$store.state.user.userData.currentShopId
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

  .flexd {
    display: flex;
    align-items: center;
  }
</style>
