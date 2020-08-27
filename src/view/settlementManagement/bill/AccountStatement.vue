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
            <Select v-model="model1" class="w150" :disabled="selectShopList">
              <Option
                v-for="item in Branchstore"
                :value="item.id"
                :key="item.id"
              >{{ item.name }}
              </Option>
            </Select>
          </div>
          <div class="db ml20">
            <span>对账单状态：</span>
            <Select v-model="Reconciliationtype" class="w150" placeholder="全部">
              <Option
                v-for="item in Reconciliationlist"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}
              </Option>
            </Select>
          </div>
          <div class="db ml10">
            <span>往来单位:</span>
            <Select
              v-model="receiveGuestId"
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
            <button class="ivu-btn ivu-btn-default" type="button" @click="query">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
          <div class="db ml10">
            <Poptip placement="bottom">
              <button class="mr10 ivu-btn ivu-btn-default" type="button" v-has="'export'">导出</button>
              <div slot="content">
                <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="report(0)">导出对账单</button>
                <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="report(1)">导出单据明细</button>
              </div>
            </Poptip>
            <!-- <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="modal1 = true">
              <i class="iconfont iconcaidan"></i>
              <span>更多</span>
            </button>-->
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="statementSettlement(0)"
          v-has="'reconciliation'"
          :disabled="statementStatusflag"
        >对账单对冲
        </button>
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="statementSettlement(1)"
          v-has="'writeDown'"
          :disabled="statementStatusflag"
        >冲减预收
        </button>
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="statementSettlement(2)"
          v-has="'prepayment'"
          :disabled="statementStatusflag"
        >冲减预付
        </button>
        <!-- <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="statementSettlement"
          v-has="'examine'"
        >对账单结算</button>-->
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="viewStatement"
          v-has="'look'"
        >查看对账单
        </button>
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="capitalWrite"
          v-has="'claim'"
          :disabled="statementStatusflag"
        >认领款核销
        </button>
        <!--        <button-->
        <!--          class="ivu-btn ivu-btn-default mr10"-->
        <!--          type="button"-->
        <!--          @click="statementSettlement"-->
        <!--          v-has="'print'"-->
        <!--        >打印流程</button>-->
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="saleApplication"
          v-has="'market'"
          :disabled="taxArrearsfalg"
        >销售开票申请
        </button>
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="queryApplication"
          v-has="'query'"
        >查询开票申请
        </button>
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="hedgingInvoice"
          v-has="'incoice'"
          :disabled="hedgingfalg"
        >发票对冲
        </button>
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="registrationEntry"
          v-has="'register'"
          :disabled="receivefalg"
        >进项登记及修改
        </button>
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="queryEntry"
          v-noresub
          :disabled="ownEnterList"
          v-has="'input'"
        >进项发票核销
        </button>
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          v-has="'revocation'"
          @click="withdrawTheApplication"
          :disabled="ifRecallApply"
        >撤回申请
        </button>
        <!--        <button-->
        <!--          class="ivu-btn ivu-btn-default mr10"-->
        <!--          type="button"-->
        <!--          @click="Revoke"-->
        <!--          v-has="'revocation'"-->
        <!--        >撤回开票</button>-->
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          v-has="'revocation'"
          @click="backCancel"
          :disabled="ifRecallWriteOff"
        >撤回核销
        </button>
        <Table
          border
          :columns="columns1"
          :data="data1"
          class="mt10 accountStateCla"
          max-height="400"
          @on-row-click="morevis"
          highlight-row
          ref="accountStatement"
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
              :summary-method="summary"
            ></Table>
          </div>
          <Tabs v-model="tab" class="ml20" style="flex:1" :animated="false" @click="tabName">
            <TabPane label="应收单据明细" name="name1">
              <Table
                border
                :columns="columns3"
                :data="data3"
                max-height="400"
                show-summary
                :summary-method="handleSummary"
                ref="collectBill"
              ></Table>
            </TabPane>
            <TabPane label="应付单据明细" name="name2">
              <Table
                border
                :columns="columns4"
                :data="data4"
                max-height="400"
                show-summary
                :summary-method="handleSummary"
                ref="payBill"
              ></Table>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </section>
    <Modal v-model="Settlement" title="收付款结算" width="1200" @on-visible-change="hander">
      <div class="db">
        <button class="ivu-btn ivu-btn-default mr10" type="button" @click="conserve">保存</button>
        <button class="ivu-btn ivu-btn-default mr10" type="button" @click="close">关闭</button>
      </div>
      <div class="db p15 settlement mt10 mb10">
        <div class="db_top flex mb15">
          <span style="flex:1">门店：{{reconciliationStatement.orgName}}</span>
          <span style="flex:1">往来单位：{{reconciliationStatement.guestName}}</span>
          <span style="flex:1">收付类型：{{reconciliationStatement.billingTypeName}}</span>
        </div>
        <div class="db_bottom flex mt15">
          <span style="flex:1">对账单号：{{reconciliationStatement.accountNo}}</span>
          <span style="flex:1">实际收款/付款：{{reconciliationStatement.receiptPayment}}</span>
          <span style="flex:1">收付款单号：{{collectPayId}}</span>
        </div>
      </div>
      <Row>
        <Col span="12">
          <vxe-table
            style="flex:6"
            border
            resizable
            :data="BusinessType"
            auto-resize
            :edit-config="{trigger: 'click', mode: 'cell'}"
            @edit-closed="editClosedEvent"
          >
            <vxe-table-column field="serviceTypeName" title="业务类型"></vxe-table-column>
            <vxe-table-column field="accountAmt" title="对账金额"></vxe-table-column>
            <vxe-table-column field="endAmt" title="已收金额"></vxe-table-column>
            <vxe-table-column field="uncollectedAmt" title="未收金额"></vxe-table-column>
            <vxe-table-column
              field="checkAmt"
              title="本次核销金额"
              width="140"
              :edit-render="{name: 'input', attrs: {type: 'number'}}"
            ></vxe-table-column>
            <vxe-table-column field="unAmt" title="剩余未收"></vxe-table-column>
          </vxe-table>
          <div>
            <section class="flex">
              <p
                class="w90 pl5 pr10"
                style="border:1px solid #ddd;border-top:0;border-right:0;line-height: 40px"
              >核对</p>
              <input
                type="text"
                size="large"
                class="w500"
                style="border:1px solid #ddd;border-top:none;text-indent:5px"
                v-model="check"
              />
            </section>
            <section class="flex">
              <p
                class="w90 pl5 pr10"
                style="border:1px solid #ddd;border-top:0;border-right:0;line-height: 40px"
              >备注</p>
              <input
                type="text"
                size="large"
                class="w500"
                style="border:1px solid #ddd;border-top:none;text-indent:5px"
                v-model="remark"
              />
            </section>
          </div>
        </Col>
        <Col span="12">
          <vxe-table
            class="ml10"
            style="flex:4"
            border
            resizable
            :data="tableData"
            auto-resize
            :edit-config="{trigger: 'click', mode: 'cell'}"
          >
            <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
            <vxe-table-column field="paymentAmtName" title="收款账户"></vxe-table-column>
            <vxe-table-column
              field="checkAmt"
              title="金额"
              :edit-render="{name: 'input', attrs: {type: 'number'}}"
            ></vxe-table-column>
            <vxe-table-column field="orgName" title="所属门店"></vxe-table-column>
          </vxe-table>
        </Col>
      </Row>
      <div slot="footer"></div>
    </Modal>
    <reconciliation ref="reconciliation"></reconciliation>
    <Monthlyreconciliation ref="Monthlyreconciliation"></Monthlyreconciliation>
    <!--    <Modal v-model="revoke" title="对账单撤销" @on-ok="confirmRevocation">撤销后该对账单将变为草稿状态！</Modal>-->
    <Modal v-model="modalShow" :title="reTitle">
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
        <Button type='default' @click='cancel'>取消</Button>
      </div>
    </Modal>
    <salepopup ref="salepopup"/>
    <hedgingInvoice ref="hedgingInvoice"/>
    <registrationEntry ref="registrationEntry"/>
    <settlementMoadl ref="settlementMoadl" @getNewList="getNeWlist"/>
    <no-tax ref="noTax" :information="reconciliationStatement" :parameter="{}"></no-tax>
    <!--    //人工对账-->
    <invoiceApplyTost ref="invoiceApplyTost" @getnewList="getNeWlist"></invoiceApplyTost>


  </div>
</template>
<script>
  import settlementMoadl from "./components/settlement";
  import hedgingInvoice from "./Popup/hedgingInvoice";
  import registrationEntry from "./Popup/registrationEntry";
  import quickDate from "@/components/getDate/dateget_bill.vue";
  import salepopup from "./Popup/salepopup";
  import {creat} from "./../components";
  import moment from "moment";
  import {
    AccountStatement,
    Record,
    detailsDocuments,
    dictionaries,
    getId,
    settlement,
    settlementPreservation,
    setCanwithdraw,
    setApply,
    setCancal,
    account
  } from "@/api/bill/saleOrder";
  import {hedgingApplyNo, applyNo} from "@/api/bill/popup";
  import {goshop} from '@/api/settlementManagement/shopList'
  import {approvalStatus} from "_api/base/user";
  import reconciliation from "./components/reconciliation.vue";
  import Monthlyreconciliation from "./components/Monthlyreconciliation";
  import bus from './Popup/Bus'
  import NoTax from "./Popup/noTax";
  import {getGuestShortName} from "@/api/documentApproval/documentApproval/documentApproval";
  import invoiceApplyTost from "@/view/settlementManagement/invoiceAdministration/components/invoiceApplyTost"


  export default {
    name: 'accountStatement',
    components: {
      NoTax,
      registrationEntry,
      quickDate,
      reconciliation,
      Monthlyreconciliation,
      salepopup,
      hedgingInvoice,
      settlementMoadl,
      invoiceApplyTost
    },
    data() {
      return {
        type: 0,//对冲，冲减标识
        accountType: false,
        statusData: [
          {name: "提交", status: "已提交"},
          {name: "产品总监审批", status: "已审批"}
        ],
        check: "",
        remark: "",
        Write: "", //核销编码
        collectPayId: "", //收付款单号
        tab: "name1",
        falg: false,
        reconciliationStatement: {}, //点击主表获取当当前一行数据
        tableData: [],
        BusinessType: [],
        Settlement: false,
        pagetotal: 0,
        value: [],
        model1: "",
        model2: "",
        model3: "",
        Reconciliationtype: "",
        Branchstore: [
          {id: '0', name: '全部'}
        ],
        modal1: false,
        text: "",
        nametext: "",
        Reconciliationlist: [
          {
            value: "",
            label: "全部"
          },
          {
            value: "SHZ",
            label: "审批中"
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
            key: "index",
            width: 40,
            className: "tc",
            fixed: "left"
          },
          {
            title: "申请时间",
            key: 'createTime',
            className: 'tc',
            minWidth: 140,
          },
          {
            title: "公司名称",
            key: "orgName",
            className: "tc",
            minWidth: 120,
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
            minWidth: 120,
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
            minWidth: 120,
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
            title: "收付类型",
            key: "paymentTypeName",
            className: "tc",
            minWidth: 120
          },
          {
            title: "对账应收",
            key: "accountsReceivable",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.accountsReceivable.toFixed(2));
            }
          },
          {
            title: "应收返利",
            key: "receivableRebate",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.receivableRebate.toFixed(2));
            }
          },
          {
            title: "应收坏账",
            key: "badDebtReceivable",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.badDebtReceivable.toFixed(2));
            }
          },
          {
            title: "对账应付",
            key: "reconciliation",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.reconciliation.toFixed(2));
            }
          },
          {
            title: "应付返利",
            key: "dealingRebates",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.dealingRebates.toFixed(2));
            }
          },
          {
            title: "应付坏账",
            key: "payingBadDebts",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.payingBadDebts.toFixed(2));
            }
          },
          {
            title: "运费",
            key: "transportExpenses",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.transportExpenses.toFixed(2));
            }
          },
          {
            title: "保险费",
            key: "insuranceExpenses",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.insuranceExpenses.toFixed(2));
            }
          },
          {
            title: "手续费",
            key: "serviceCharge",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.serviceCharge.toFixed(2));
            }
          },
          {
            title: "配件管理费",
            key: "partsManagementFee",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.partsManagementFee.toFixed(2));
            }
          },
          {
            title: "其他费用",
            key: "otherFees",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.otherFees.toFixed(2));
            }
          },
          {
            title: "实际收款/付款",
            key: "receiptPayment",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.receiptPayment.toFixed(2));
            }
          },
          {
            title: "已收金额",
            key: "amountReceived",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.amountReceived.toFixed(2));
            }
          },
          {
            title: "未收金额",
            key: "noCharOffAmt",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.noCharOffAmt.toFixed(2));
            }
          },
          {
            title: "已付金额",
            key: "amountPaid",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.amountPaid.toFixed(2));
            }
          },
          {
            title: "未付金额",
            key: "unpaidAmount",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.unpaidAmount.toFixed(2));
            }
          },
          {
            title: "对账单状态",
            key: "statementStatusName",
            className: "tc",
            minWidth: 120,
            fixed: "left"
          },
          {
            title: "计算结算类型",
            key: "billingTypeName",
            className: "tc",
            minWidth: 120,
            fixed: "left"
          },

          {
            title: "对账人",
            key: "createUname",
            className: "tc",
            minWidth: 120
          },
          {
            title: "最近一次回款时间",
            key: "lastPaymentDate",
            className: "tc",
            minWidth: 120,
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
            minWidth: 120
          },
          {
            title: "最近一次开票申请人",
            key: "recentApplier",
            className: "tc",
            minWidth: 140
          },
          {
            title: "最近一次开票申请时间",
            key: "recentTime",
            className: "tc",
            minWidth: 140,
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
            minWidth: 120
          },
          {
            title: "含税油品",
            key: "taxAmountOfOil",
            className: "tc",
            minWidth: 120
          },
          {
            title: "不含税金额",
            key: "noTaxAmount",
            className: "tc",
            minWidth: 120

          },
          {
            title: "含税配件已开",
            key: "taxAmountOfPartOpened",
            className: "tc",
            minWidth: 120
          },
          {
            title: "含税油品已开",
            key: "taxAmountOfOilOpened",
            className: "tc",
            minWidth: 120
          },
          {
            title: "不含税增加税点",
            key: "increasePointExcludingTax",
            className: "tc",
            minWidth: 120
          },
          {
            title: "收到配件进项发票",
            key: "receiveInputInvoiceAmount",
            className: "tc",
            minWidth: 120
          },
          {
            title: "收到含税油品金额",
            key: "receiveTaxOfOilAmount",
            className: "tc",
            minWidth: 120
          },
          {
            title: "对冲配件发票",
            key: "hedgingInvoiceOfPart",
            className: "tc",
            minWidth: 120
          },
          {
            title: "对冲油品发票",
            key: "hedgingInvoiceOfOil",
            className: "tc",
            minWidth: 120
          },
          {
            title: "含税配件欠票",
            key: "taxArrearsOfPart",
            className: "tc",
            minWidth: 120,
            // render:(h, params) => {
            //   let tax = this.$utils.subtract(params.row.taxAmountOfPart , params.row.taxAmountOfPartOpend)
            //   return h("span" , tax)
            // }
          },
          {
            title: "含税油品欠票",
            key: "taxArrearsOfOil",
            className: "tc",
            minWidth: 120
          },
          {
            title: "不含税未开",
            key: "taxNotIncluded",
            className: "tc",
            minWidth: 120
          },
          {
            title: "最近一次开票公司",
            key: "recentInvoiceCompany",
            className: "tc",
            minWidth: 120,
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
            minWidth: 120,
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
        columns2: [
          {
            title: "序号",
            type: "index",
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
            key: "account",
            className: "tc"
          },
          {
            title: "收/付款金额",
            key: "checkAmt",
            className: "tc",
            render: (h, params) => {
              return h("span", params.row.checkAmt.toFixed(2));
            }
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
            key: "index",
            width: 40,
            className: "tc"
          },
          {
            title: "门店",
            key: "orgName",
            className: "tc",
            minWidth: 80,
          },
          {
            title: "客户",
            key: "guestName",
            minWidth: 80,
            className: "tc"
          },
          {
            title: "销售单号",
            key: "orderNo",
            minWidth: 80,
            className: "tc"
          },
          {
            title: "出库单号",
            key: "serviceId",
            minWidth: 80,
            className: "tc"
          },
          {
            title: "应收金额",
            key: "rpAmt",
            className: "tc",
            minWidth: 80,
            render: (h, params) => {
              return h("span", params.row.rpAmt.toFixed(2));
            }
          },
          {
            title: "前期已对账金额",
            key: "accountAmt",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.accountAmt.toFixed(2));
            }
          },
          {
            title: "前期未对账金额",
            key: "noAccountAmt",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.noAccountAmt.toFixed(2));
            }
          },
          {
            title: "本次不对账金额",
            key: "thisNoAccountAmt",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.thisNoAccountAmt.toFixed(2));
            }
          },
          {
            title: "本次对账金额",
            key: "thisAccountAmt",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.thisAccountAmt.toFixed(2));
            }
          }
        ],
        columns4: [
          {
            title: "序号",
            key: "index",
            width: 40,
            className: "tc"
          },
          {
            title: "门店",
            key: "orgName",
            minWidth: 80,
            className: "tc"
          },
          {
            title: "客户",
            key: "guestName",
            minWidth: 80,
            className: "tc"
          },
          {
            title: "采购单号",
            key: "orderNo",
            minWidth: 80,
            className: "tc"
          },
          {
            title: "入库单号",
            key: "serviceId",
            minWidth: 80,
            className: "tc"
          },
          {
            title: "应付金额",
            key: "rpAmt",
            className: "tc",
            minWidth: 80,
            render: (h, params) => {
              return h("span", params.row.rpAmt.toFixed(2));
            }
          },
          {
            title: "前期已对账金额",
            key: "accountAmt",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.accountAmt.toFixed(2));
            }
          },
          {
            title: "前期未对账金额",
            key: "noAccountAmt",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.noAccountAmt.toFixed(2));
            }
          },
          {
            title: "本次不对账金额",
            key: "thisNoAccountAmt",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.thisNoAccountAmt.toFixed(2));
            }
          },
          {
            title: "本次对账金额",
            key: "thisAccountAmt",
            className: "tc",
            minWidth: 120,
            render: (h, params) => {
              return h("span", params.row.thisAccountAmt.toFixed(2));
            }
          }
        ],
        data1: [],
        data2: [],
        data3: [],
        data4: [],
        total: 0,
        page: {
          num: 1,
          size: 10
        },
        statementStatusflag: false,//对账单状态是结算完成，不能点击对账单对冲、冲减预收、冲减预付、认领款核销
        taxArrearsfalg: false,//含税配件欠票、含税油品欠票都是0 ，不能点击销售开票申请；
        hedgingfalg: false,//对冲配件发票/对冲油品发票=含税配件/油品金额，不能点击发票对冲;
        receivefalg: false,//收到配件/油品进项发票=含税配件/油品金额，不能点击进项登记及修改
        paymentId: '',//判定付款默认类型
        receiveGuestId: '',//获取往来单位id
        company: [],//查询到往来单位数据
        loading1: false,//查询时判断
        revokeReason: '',//撤销原因
        modalShow: false,//撤销模态框状态
        reTitle: '撤回原因',//撤销模态框title
        ifRecallApply: true,//是否可以撤回申请
        ifRecallWriteOff: true,//是否可以撤回审核
        ownEnterList: false,//判断是否可以进项发票核销
      };
    },
    async mounted() {
      let arr = await creat(this.$refs.quickDate.val, this.$store);
      this.value = arr[0];
      // let obj = {
      //   startDate: this.value[0]
      //     ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
      //     : "",
      //   endDate: this.value[1]
      //     ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
      //     : "",
      //   orgId: this.model1,
      //   statementStatus: this.Reconciliationtype
      // };
      // obj.page = this.page.num -1
      // obj.size = this.page.size
      // this.getAccountStatement(obj);
      // this.query()
      this.$nextTick(() => {
        this.model1 = arr[1]
        this.getAccountStatement()
      })
      this.getShop()
    },
    computed: {
      selectShopList() {
        if(this.$store.state.user.userData.currentCompany!=null){
          return this.$store.state.user.userData.currentCompany.isMaster ? true : false
        }else{
          return true
        }
      }
    },
    filters: {
      date(value = 0) {
        let date = new Date(value).toLocaleDateString();
        let time = new Date(value).toLocaleTimeString();
        value = date.split("/").join("-") + " " + time.substr(2);
        return value;
      },
      status(value = "") {
        value = value.toLowerCase();
        switch (value) {
          case "none":
            value = "已提交";
            break;
          case "agree":
            value = "已同意";
            break;
          case "refuse":
            value = "已拒绝";
            break;
          case "redirected":
            value = "已转交";
            break;
        }
        return value;
      }
    },
    methods: {
      //取消撤回
      cancel() {
        this.modalShow = false;
        this.$message.info("取消撤回");
      },
      //撤销确定
      async reClose() {
        if (!this.revokeReason) return this.$Message.error('撤回原因必填')
        if (!this.ifRecallApply) {
          let data = {}
          data.id = this.reconciliationStatement.id
          data.revokeReason = this.revokeReason
          let res = await setApply(data)
          if (res.code === 0) {
            this.modalShow = false;
            this.$Message.success('撤回成功')
            this.getAccountStatement();
          }
        }
        if (!this.ifRecallWriteOff) {
          let data = {}
          data.id = this.reconciliationStatement.id
          data.revokeReason = this.revokeReason
          let res = await setCancal(data)
          if (res.code === 0) {
            this.modalShow = false;
            this.$Message.success('撤回成功')
            this.getAccountStatement();
          }
        }
      },
      //撤销申请
      withdrawTheApplication() {
        this.reTitle = '撤回申请'
        this.revokeReason = ''
        this.modalShow = true;
      },

      //撤回核销
      backCancel() {
        this.reTitle = '撤回核销'
        this.revokeReason = ''
        this.modalShow = true;
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
      //对冲之后刷新页面接口
      getNeWlist() {
        this.getAccountStatement()
      },
      //获取门店
      async getShop() {
        let data = {}
        let res = await goshop(data)
        if (res.code === 0) return this.Branchstore = [...this.Branchstore, ...res.data]
      },
      //资金认领核销
      capitalWrite() {
        if (Object.keys(this.reconciliationStatement).length !== 0) {
          // bus.$emit('account',this.reconciliationStatement)
          // console.log(this.reconciliationStatement , 123)
          this.$router.push({name: "claimWrite", params: {id: this.reconciliationStatement.id}});
        } else {
          this.$message.error("请选择一条对账单");
        }
      },
      // 进项发票登记及修改
      registrationEntry() {
        if (
          Object.keys(this.reconciliationStatement).length !== 0 &&
          this.reconciliationStatement.ownEnterList === 1
        ) {
          this.$refs.registrationEntry.accountData = [];
          this.$refs.registrationEntry.accountData.push(
            this.reconciliationStatement
          );
          this.$refs.registrationEntry.arrId = [];
          this.$refs.registrationEntry.arrId.push(
            this.reconciliationStatement.orgId,
            this.reconciliationStatement.guestId,
            this.reconciliationStatement.id
          );
          this.$refs.registrationEntry.modal1 = true;
        } else {
          this.$message.error("只能勾选计划对账类型为付款的对账单");
        }
      },
      // 进项发票核销
      queryEntry() {
        this.$refs.invoiceApplyTost.init(this.reconciliationStatement);

        // this.$router.push({ name: "invoiceAdministrationInvoiceManagement" });
      },
      // 查询发票申请
      queryApplication() {
        this.$router.push({name: "invoiceAdministrationInvoiceApply"});
      },
      // 发票对冲
      hedgingInvoice() {
        if (Object.keys(this.reconciliationStatement).length !== 0) {
          this.$refs.hedgingInvoice.modal1 = true;
          this.reconciliationStatement.applyTime = moment(new Date()).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          this.reconciliationStatement.statementMasterId = this.reconciliationStatement.id;
          this.reconciliationStatement.applicant = this.$store.state.user.username;
          this.$refs.hedgingInvoice.information = JSON.parse(
            JSON.stringify(this.reconciliationStatement)
          );
          delete this.$refs.hedgingInvoice.information.id;
          hedgingApplyNo().then(res => {
            this.$refs.hedgingInvoice.information.serviceId = res.data;
          });
        } else {
          this.$message.error("请先选择一条数据");
        }
      },
      // 销售开票申请
      saleApplication() {
        if (
          Object.keys(this.reconciliationStatement).length !== 0 &&
          this.reconciliationStatement.billingTypeName === "收款"
        ) {
          if (this.reconciliationStatement.ownSellOutList === 0) {
            return this.$Message.error('该对账单不包含销售出库单据，不能开票！')
          }
          if (0 >= this.reconciliationStatement.statementAmtOwed) return this.$Message.error('剩余欠票金额为0不能继续开票')
          if (this.reconciliationStatement.taxSign === 1) {
            this.$refs.salepopup.parameter = this.reconciliationStatement;
            this.reconciliationStatement.applyNo = this.$refs.salepopup.information.applyNo;
            this.reconciliationStatement.code = this.$refs.salepopup.information.code;
            this.reconciliationStatement.noTaxApply = this.$refs.salepopup.information.noTaxApply;
            this.$refs.salepopup.information = JSON.parse(JSON.stringify(this.reconciliationStatement));
            this.$refs.salepopup.information.applicationDate = moment(
              new Date()
            ).format("YYYY-MM-DD HH:mm:ss");
            if (this.reconciliationStatement.owned === 0) {
              // 申请单号
              applyNo({orgid: this.reconciliationStatement.orgId}).then(res => {
                if (res.code === 0) {
                  this.$refs.salepopup.information.applyNo = res.data.applyNo;
                  this.$refs.salepopup.information.code = res.data.orgCode;
                  if (this.reconciliationStatement.statementType.value == 1) {
                    this.$refs.salepopup.information.oilsListOrder = ""
                    this.$refs.salepopup.information.partsListOrder = res.data.partsListOrder;
                  } else if (this.reconciliationStatement.statementType.value == 2) {
                    this.$refs.salepopup.information.oilsListOrder = res.data.oilsListOrder;
                    this.$refs.salepopup.information.partsListOrder = ""
                  }
                }
              });
            }

            this.$refs.salepopup.accessoriesBillingData1 = []
            this.$refs.salepopup.accessoriesBillingData2 = []
            setTimeout(() => {
              this.$refs.salepopup.modal1 = true;
            }, 500);
          } else {
            this.$refs.noTax.init();
          }
        } else {
          this.$message.error("只能勾选计划对账类型为收款的对账单");
        }
      },
      // 单据合计方式
      handleSummary({columns, data}) {
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
          if (index > 4) {
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
        //
      },
      // 收付款单合计方式
      summary({columns, data}) {
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
          if (index === 5) {
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
        //
      },
      // 快速查询日期
      quickDate(data) {
        this.value = data;
        this.page.num = 1
        this.getAccountStatement();
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
              item.index = index + 1;
            });
            this.data3 = res.data.one;
          } else {
            this.data3 = [];
          }
          if (res.data.two.length !== 0) {
            res.data.two.map((item, index) => {
              item.index = index + 1;
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
              item.index = index + 1;
              item.sortName = item.sort ? item.sort.name : '';
              item.paymentAmtType = item.paymentAmtType ? item.paymentAmtType.name : '';
              item.startStatus = item.startStatus ? item.startStatus.name : '';
            });
            this.data2 = res.data;
          }
        });
      },
      // 对账总表
      getAccountStatement() {
        let obj = {
          startDate: this.value[0]
            ? moment(this.value[0]).format("YYYY-MM-DD") + " 00:00:00"
            : "",
          endDate: this.value[1]
            ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
            : "",
          orgId: this.model1,
          statementStatus: this.Reconciliationtype,
          guestId: this.receiveGuestId
        };
        obj.page = this.page.num - 1
        obj.size = this.page.size
        AccountStatement(obj).then(res => {
          this.pagetotal = res.data.totalElements;
          if (res.data.content.length !== 0) {
            res.data.content.map((item, index) => {
              item.index = index + 1;
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
        this.page.num = page
        this.getAccountStatement();
      },
      // 查询
      query() {
        this.getAccountStatement();
      },

      // 点击总表查询明细
      morevis(row, index) {
        this.taxArrearsfalg = false
        this.statementStatusflag = false
        this.hedgingfalg = false
        this.receivefalg = false
        if (row.statementStatus.value == 4) {
          this.statementStatusflag = true
        }
        if (row.taxSign === 1) {
          if (row.taxArrearsOfPart == 0 && row.taxArrearsOfOil == 0) {
            this.taxArrearsfalg = true
          }
        } else {
          if (row.taxNotIncluded <= 0) {
            this.taxArrearsfalg = true
          }
        }
        if (row.hedgingInvoiceOfPart == row.taxAmountOfPart && row.hedgingInvoiceOfOil == row.taxAmountOfOil) {
          this.hedgingfalg = true
        }
        if (row.receiveInputInvoiceAmount == row.taxAmountOfPart && row.receiveTaxOfOilAmount == row.taxAmountOfOil) {
          this.receivefalg = true
        }
        this.ownEnterList = row.ownEnterList == 0 ? true : false
        this.reconciliationStatement = row;
        this.reconciliationStatement.index = index;
        this.data2 = []
        this.data3 = []
        this.data4 = []
        setCanwithdraw({id: row.id}).then(
          res => {
            if (res.code === 0) {
              this.ifRecallApply = !res.data.ifRecallApply
              this.ifRecallWriteOff = !res.data.ifRecallWriteOff
            }
          }
        )
        getId({orgId: row.orgId, incomeType: row.paymentType.value}).then(
          res => {
            this.collectPayId = !res.data.fno;
            this.Write = !res.data.checkId;
          }
        );
        let date = {
          startDate: this.value[0]
            ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
            : "",
          endDate: moment(this.value[1]).endOf('day').format("YYYY-MM-DD HH:mm:ss")
        };
        // this.$refs.Monthlyreconciliation.parameter = { ...row, ...date };
        this.$refs.reconciliation.parameter = {...row, ...date};
        let obj = {
          orgId: row.orgId,
          startDate: this.value[0]
            ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
            : "",
          endDate: this.value[1]
            ? moment(this.value[1]).endOf('day').format("YYYY-MM-DD HH:mm:ss")
            : "",
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
          this.$refs.reconciliation.accountModal = true;
          // if (this.reconciliationStatement.statementStatusName === "草稿") {
          //   this.$refs.Monthlyreconciliation.modal = true;
          //   this.$refs.reconciliation.modal = false;
          // } else {
          //   this.$refs.reconciliation.modal = true;
          //   this.$refs.Monthlyreconciliation.modal = false;
          // }
        } else {
          this.$message({
            message: "请勾选要查看的对账单",
            customClass: "zZindex",
            type: "error"
          });
        }
      },
      // 对账单收付款结算
      statementSettlement(type) {
        if (Object.keys(this.reconciliationStatement).length !== 0) {
          if (
            this.reconciliationStatement.pass &&
            (this.reconciliationStatement.statementStatusName === "审批通过" ||
              this.reconciliationStatement.statementStatusName === "结算中")
          ) {
            this.paymentId = "DYD"
            this.$refs.settlementMoadl.showchange = false
            if (type == 1) {
              this.paymentId = 'YS'
              this.$refs.settlementMoadl.showchange = true
            } else if (type == 2) {
              this.paymentId = 'YF'
              this.$refs.settlementMoadl.showchange = true
            }
            this.$refs.settlementMoadl.Settlement = true;
            this.type = !type ? 0 : type === 1 ? 1 : 2
          } else {
            this.$message({
              message: "请勾选流程通过且对账单状态为审核通过或结算中的数据",
              customClass: "zZindex",
              type: "error"
            });
          }
        } else {
          this.$message({
            message: "请勾选要对账数据",
            customClass: "zZindex",
            type: "error"
          });
        }
      },
      // 核销单元格编辑状态下被关闭时
      editClosedEvent({row, rowIndex}) {
        row.unAmt =
          row.accountAmt * 1 -
          this.reconciliationStatement.amountReceived * 1 -
          row.checkAmt * 1;
        row.endAmt =
          this.reconciliationStatement.amountReceived * 1 + row.checkAmt * 1;
        row.uncollectedAmt = row.accountAmt * 1 - row.checkAmt;
        this.$set(this.BusinessType, rowIndex, row);
        let obj = {
          serviceTypeName: "合计",
          accountAmt: this.BusinessType[0].accountAmt,
          endAmt: this.BusinessType[0].endAmt,
          uncollectedAmt: this.BusinessType[0].uncollectedAmt,
          checkAmt: this.BusinessType[0].checkAmt,
          unAmt: this.BusinessType[0].unAmt
        };
        let total = this.getTotal(obj);
        this.$set(this.BusinessType, 5, obj);
      },
      // // 收付款单元格关闭
      // collectPay({row}) {
      //   this.total += row.checkAmt * 1;
      //   // console.log(this.total)
      // },
      // 导出对账单/单据明细
      report(type) {
        if (type) {
          if (this.tab === "name1") {
            if (this.data3.length !== 0) {
              this.$refs.collectBill.exportCsv({
                filename: "应收单据明细"
              });
            } else {
              this.$message({
                message: "应收单据明细暂无数据",
                customClass: "zZindex",
                type: "error"
              });
            }
          } else if (this.tab === "name2") {
            if (this.data4.length !== 0) {
              this.$refs.payBill.exportCsv({
                filename: "应付单据明细"
              });
            } else {
              this.$message({
                message: "应付单据明细暂无数据",
                customClass: "zZindex",
                type: "error"
              });
            }
          }
        } else {
          if (this.data1.length !== 0) {
            this.$refs.accountStatement.exportCsv({
              filename: "对账单"
            });
          } else {
            this.$message({
              message: "对账单暂无数据",
              customClass: "zZindex",
              type: "error"
            });
          }
        }
      },
      // tab标签页当前的name
      tabName(name) {
        this.tab = name;
      },
      // 收付款结算计算合计
      getTotal(obj) {
        this.BusinessType.map((item, index) => {
          if (index < 5 && index !== 0) {
            if (index > 2) {
              obj.accountAmt += item.accountAmt * 1;
              obj.endAmt += item.endAmt * 1;
              obj.uncollectedAmt += item.uncollectedAmt * 1;
              obj.checkAmt += item.checkAmt * 1;
              obj.unAmt += item.unAmt * 1;
            } else {
              obj.accountAmt -= item.accountAmt * 1;
              obj.endAmt -= item.endAmt * 1;
              obj.uncollectedAmt -= item.uncollectedAmt * 1;
              obj.checkAmt -= item.checkAmt * 1;
              obj.unAmt -= item.unAmt * 1;
            }
          }
        });
        return obj;
      },
      // 业务类型/收款账户
      hander() {
        this.total = 0;
        settlement({
          orgId: this.reconciliationStatement.orgId,
          accountNo: this.reconciliationStatement.accountNo
        }).then(res => {
          if (res.data.one.length !== 0 && res.data.two.length !== 0) {
            let accountAmt = res.data.one[0].accountAmt;
            let endAmt = res.data.one[0].endAmt;
            let uncollectedAmt = res.data.one[0].uncollectedAmt;
            let checkAmt = res.data.one[0].checkAmt;
            let unAmt = res.data.one[0].unAmt;
            res.data.one.map((item, index) => {
              item.serviceTypeName = item.serviceType.name;
              if (index !== 0) {
                if (
                  item.serviceTypeName === "供应商坏账" ||
                  item.serviceTypeName === "供应商返利"
                ) {
                  accountAmt += item.accountAmt;
                  endAmt += item.endAmt;
                  uncollectedAmt += item.uncollectedAmt;
                  checkAmt += item.checkAmt;
                  unAmt += item.unAmt;
                } else {
                  accountAmt -= item.accountAmt;
                  endAmt -= item.endAmt;
                  uncollectedAmt -= item.uncollectedAmt;
                  unAmt += item.unAmt;
                  checkAmt -= item.checkAmt;
                }
              }
            });
            res.data.one.push({
              serviceTypeName: "合计",
              accountAmt,
              endAmt,
              uncollectedAmt,
              checkAmt,
              unAmt
            });
            res.data.two.map(item => {
              item.paymentAmtName = item.paymentAmt.name;
              // this.total += item.checkAmt;
            });
            this.BusinessType = res.data.one;
            this.tableData = res.data.two;
          } else {
            dictionaries({dictCode: "BUSINESS_TYPE"}).then(res => {
              // accountsReceivable:应收账款(对账应收字段)
              // receivableRebate:客户返利(应收返利字段)
              // badDebtReceivable:客户坏账(应收坏账字段)
              // reconciliation:应付账款(对账应付字段)
              // dealingRebates:供应商返利(应付返利字段)
              // payingBadDebts:供应商坏账(应付坏账字段)
              // accountAmt:对账金额
              // endAmt:已收金额
              // uncollectedAmt:未收金额
              // checkAmt:本次核销金额
              // unAmt:剩余未收
              res.data.itemVOS[0] = {
                serviceType: {
                  name: res.data.itemVOS[0].itemName,
                  enum: res.data.itemVOS[0].itemCode,
                  value: 0
                },
                serviceTypeName: res.data.itemVOS[0].itemName,
                accountAmt: this.reconciliationStatement.reconciliation,
                endAmt: 0,
                uncollectedAmt: this.reconciliationStatement.reconciliation,
                checkAmt: this.reconciliationStatement.reconciliation,
                unAmt: 0
              };
              res.data.itemVOS[1] = {
                serviceType: {
                  name: res.data.itemVOS[1].itemName,
                  enum: res.data.itemVOS[1].itemCode,
                  value: 1
                },
                serviceTypeName: res.data.itemVOS[1].itemName,
                accountAmt: this.reconciliationStatement.badDebtReceivable,
                endAmt: 0,
                uncollectedAmt: this.reconciliationStatement.badDebtReceivable,
                checkAmt: this.reconciliationStatement.badDebtReceivable,
                unAmt: 0
              };
              res.data.itemVOS[2] = {
                serviceType: {
                  name: res.data.itemVOS[2].itemName,
                  enum: res.data.itemVOS[2].itemCode,
                  value: 2
                },
                serviceTypeName: res.data.itemVOS[2].itemName,
                accountAmt: this.reconciliationStatement.receivableRebate,
                endAmt: 0,
                uncollectedAmt: this.reconciliationStatement.receivableRebate,
                checkAmt: this.reconciliationStatement.receivableRebate,
                unAmt: 0
              };
              res.data.itemVOS[3] = {
                serviceType: {
                  name: res.data.itemVOS[3].itemName,
                  enum: res.data.itemVOS[3].itemCode,
                  value: 3
                },
                serviceTypeName: res.data.itemVOS[3].itemName,
                accountAmt: this.reconciliationStatement.payingBadDebts,
                endAmt: 0,
                uncollectedAmt: this.reconciliationStatement.payingBadDebts,
                checkAmt: this.reconciliationStatement.payingBadDebts,
                unAmt: 0
              };
              res.data.itemVOS[4] = {
                serviceType: {
                  name: res.data.itemVOS[4].itemName,
                  enum: res.data.itemVOS[4].itemCode,
                  value: 4
                },
                serviceTypeName: res.data.itemVOS[4].itemName,
                accountAmt: this.reconciliationStatement.dealingRebates,
                endAmt: 0,
                uncollectedAmt: this.reconciliationStatement.dealingRebates,
                checkAmt: this.reconciliationStatement.dealingRebates,
                unAmt: 0
              };
              this.BusinessType = res.data.itemVOS;
              let obj = {
                accountAmt: this.BusinessType[0].accountAmt,
                endAmt: this.BusinessType[0].endAmt,
                uncollectedAmt: this.BusinessType[0].uncollectedAmt,
                checkAmt: this.BusinessType[0].checkAmt,
                unAmt: this.BusinessType[0].unAmt
              };
              let total = this.getTotal(obj);
              this.BusinessType.push({
                serviceType: {name: "合计", enum: "HJ", value: 5},
                serviceTypeName: "合计",
                accountAmt: total.accountAmt,
                endAmt: total.endAmt,
                uncollectedAmt: total.uncollectedAmt,
                checkAmt: total.checkAmt,
                unAmt: total.unAmt
              });
            });
            dictionaries({dictCode: "PAYMENT_AMT_TYPE"}).then(res => {
              res.data.itemVOS.map((item, index) => {
                item.paymentAmtName = item.itemName;
                item.paymentAmt = {
                  name: item.itemName,
                  enum: item.itemCode,
                  value: index
                };
                item.orgName = this.reconciliationStatement.orgName;
                item.checkAmt = 0;
              });
              this.tableData = res.data.itemVOS;
            });
          }
        });
      },
      // 收付款保存
      conserve() {
        this.BusinessType.map(item => {
          item.endAmt += item.checkAmt * 1;
        });
        this.tableData.map(item => {
          this.total += item.checkAmt * 1;
        });
        if (
          this.total === this.BusinessType[5].checkAmt &&
          this.total === this.reconciliationStatement.receiptPayment
        ) {
          let one = [
            {
              checkId: this.Write,
              orgId: this.reconciliationStatement.orgId,
              guestId: this.reconciliationStatement.guestId,
              sort: this.reconciliationStatement.billingType,
              accountNo: this.reconciliationStatement.accountNo,
              fno: this.collectPayId,
              serviceId: this.reconciliationStatement.serviceId
            }
          ];
          settlementPreservation({
            one,
            two: this.BusinessType,
            three: this.tableData
          }).then(res => {
            if (res.code === 0) {
              let ind = this.reconciliationStatement.index;
              this.$set(
                this.data1[ind],
                "amountReceived",
                this.BusinessType[5].endAmt
              );
              this.Settlement = false;
              this.$message({
                message: "保存成功",
                type: "success",
                customClass: "zZindex"
              });
            }
          });
        } else {
          this.$message({
            message: "收款金额与本次核销金额不相等且不能大于实际收付款",
            type: "error",
            customClass: "zZindex"
          });
        }
      },
      // 收付款关闭
      close() {
        this.Settlement = false;
      },
      // 撤销按钮
      Revoke() {
        if (Object.keys(this.reconciliationStatement).length !== 0) {
          this.revoke = true;
          if (
            this.reconciliationStatement.statementStatusName === "审核中" ||
            this.reconciliationStatement.statementStatusName === "审核通过"
          ) {
            this.revoke = true;
          } else {
            this.$message({
              message: "此状态无法撤销",
              type: "error",
              customClass: "zZindex"
            });
          }
        } else {
          this.$message({
            message: "请勾选要撤销的对账单",
            type: "error",
            customClass: "zZindex"
          });
        }
      },
      // 确认撤销
      //   confirmRevocation() {
      //     accountRevoke({
      //       id: this.reconciliationStatement.id
      //     }).then(res => {
      //       // console.log(res);
      //       if (res.code === 0) {
      //         this.$message({
      //           message: "撤销成功",
      //           type: "success",
      //           customClass: "zZindex"
      //         });
      //       }
      //     });
      //   }
    }
  };
</script>
<style lang="less" scoped>
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

  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .zZindex {
    z-index: 3000 !important;
  }

  .data-container {
    padding: 20px 10px;

    .modal-data {
      height: 34px;
      margin-bottom: 20px;
      line-height: 34px;

      .data-name {
        width: 70px;
        margin-right: 40px;
        float: left;
      }

      .data-value {
        float: left;
      }
    }

    .status-box {
      .status {
        width: 120px;
        height: 32px;
        border: 1px solid #0099ff;
        border-radius: 4px;
        line-height: 32px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .words {
        width: 120px;
        color: #00cc66;
        text-align: center;
        margin-left: 70px;
      }

      .date {
        width: 120px;
        text-align: center;
        margin-left: 70px;
        font-size: 12px;
      }

      .remark {
        width: 120px;
        text-align: center;
        margin-left: 70px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
      }

      &:first-child {
        .words {
          margin-left: 0;
        }

        .date {
          margin-left: 0;
        }

        .remark {
          margin-left: 0;
        }
      }
    }

    .arrow-box {
      width: 60px;
      height: 2px;
      position: relative;
      margin: 0 7px 4px 3px;
      background-color: #0099ff;

      &:after {
        content: "";
        width: 0;
        height: 0;
        border-right: 5px solid transparent;
        border-left: 5px solid #0099ff;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        position: absolute;
        top: -4px;
        right: -10px;
      }
    }
  }

  .res {
    color: #ff3600 !important;
  }

  /*.accountStateCla {*/
  /*  overflow-x: scroll;*/
  /*}*/
  ::-webkit-scrollbar {
    width: 1500px !important;
    color: #adc6ff !important;
  }
  ::-webkit-scrollbar :hover{
    width: 1500px !important;
    color: #adc6ff !important;
  }
</style>
