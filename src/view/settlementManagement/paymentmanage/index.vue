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
            <Select v-model="model1" filterable class="w150" :disabled="selectShopList">
              <Option
                v-for="item in Branchstore"
                :value="item.id"
                :key="item.id"
              >{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db ml5">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="query">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
          <div class="db ml10">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="open">
              <i class="iconfont iconcaidan"></i>
              <span>更多</span>
            </button>
          </div>
          <div class="db ml10">
            <Poptip placement="bottom">
              <button class="mr10 ivu-btn ivu-btn-default" type="button" v-has="'export'">导出</button>
              <div slot="content">
                <button
                  class="mr10 ivu-btn ivu-btn-default"
                  type="button"
                  @click="exportSummary"
                >导出汇总</button>
                <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="exportBill">导出单据</button>
              </div>
            </Poptip>
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="Monthlyreconciliation"
              v-has="'reconciliation'"
            >月结对账</button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <Table
          max-height="400"
          highlight-row
          border
          :columns="columns"
          :data="data"
          @on-row-click="selete"
          ref="summary"
        ></Table>
        <Tabs v-model="detailedList" class="mt10" @click="tabName">
          <Tab-pane label="销售清单" name="key1">
            <Table
              border
              :columns="columns1"
              :data="data1"
              class="mt10"
              max-height="400"
              show-summary
              :summary-method="handleSummary"
              ref="sale"
            ></Table>
          </Tab-pane>
          <Tab-pane label="采购清单" name="key2">
            <Table
              border
              :columns="columns2"
              :data="data2"
              class="mt10"
              max-height="400"
              show-summary
              :summary-method="handleSummary"
              ref="purchase"
            ></Table>
          </Tab-pane>
        </Tabs>
      </div>
    </section>
    <Modal v-model="modal1" title="高级查询" @on-ok="senior">
      <div class="db pro mt20">
        <span>转单日期：</span>
        <Date-picker
          :value="value"
          format="yyyy-MM-dd"
          type="daterange"
          placeholder="选择日期"
          class="w200"
          @on-change="changedate"
        ></Date-picker>
      </div>
      <div class="db pro mt20">
        <span>客户类型：</span>
        <Select v-model="model2" style="width:200px">
          <Option v-for="item in typelist" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="db pro mt20">
        <span>往来单位：</span>
        <Select v-model="guestId" filterable class="w200"
              :loading="searchLoading"
              :remote-method="getAllClient"
              @on-change="getAccountNameListFun"
        >
          <Option v-for="item in clientList" :value="item.id" :key="item.id">{{ item.fullName }}</Option>
        </Select>
      </div>
      <div class="db pro mt20">
        <span>分店名称：</span>
        <Select v-model="model1" style="width:200px">
          <Option v-for="item in Branchstore" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </div>
      <div class="db pro mt20">
        <span>业务类型：</span>
        <Select v-model="model3" style="width:200px">
          <Option v-for="item in business" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="db pro mt20">
        <span>业务单号：</span>
        <input type="text" class="w200" v-model="text" />
      </div>
    </Modal>
    <Modal v-model="outStock" :title="title" width="1200">
      <div class="db">
        <button
          class="mr10 ivu-btn ivu-btn-default"
          type="button"
          @click="print(0)"
        >打印</button>
        <button
          class="mr10 ivu-btn ivu-btn-default"
          type="button"
          @click="exportDetail(0)"
        >导出</button>
      </div>
      <Table
        border
        :columns="columns3"
        :data="data3"
        class="mt10"
        max-height="400"
        show-summary
        :summary-method="summary"
        ref="noWarehousing"
      ></Table>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="onStock" title="入库明细" width="1200">
      <div class="db">
        <button
          class="mr10 ivu-btn ivu-btn-default"
          type="button"
          @click="print(1)"
        >打印</button>
        <button
          class="mr10 ivu-btn ivu-btn-default"
          type="button"
          @click="exportDetail(1)"
        >导出</button>
      </div>
      <Table
        border
        :columns="columns4"
        :data="data4"
        class="mt10"
        max-height="400"
        show-summary
        :summary-method="summary1"
        ref="warehousing"
      ></Table>
      <div slot="footer"></div>
    </Modal>
    <Monthlyreconciliation ref="Monthlyreconciliation" />
    <PrintShow ref="PrintShow" :title="tit" />
  </div>
</template>

<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import {getClient} from '@/api/salesManagment/salesOrder'
// import selectDealings from "./../bill/components/selectCompany";
import Monthlyreconciliation from "./Monthlyreconciliation.vue";
import PrintShow from "./component/PrintShow";
import {
  getStorelist,
  getreceivable,
  getSalelist,
  getNumberList
} from "@/api/bill/saleOrder";
import { goshop } from '@/api/settlementManagement/shopList';
import {getCustomerInformation} from "@/api/system/essentialData/clientManagement";
import { creat } from "./../components";
import moment from "moment";
import {findGuest} from "../../../api/settlementManagement/advanceCollection";
export default {
  name:'payMentmanage',
  components: {
    quickDate,
    // selectDealings,
    Monthlyreconciliation,
    PrintShow
  },
  data() {
    return {
      title: "出库明细",
      tit: "",
      detailedList: "key1",
      value: [],
      model1: "",
      model2: "",
      model3: "",
      text: "",
      nametext: "",
      modal1: false,
      outStock: false,
      onStock: false,
      flag: false,
      clientList:[],//客户下拉数据
      searchLoading:true,
      guestId:"",//客户选中id
      columns: [
        {
          title: "序号",
          type: "index",
          minWidth: 40,
          className: "tc"
        },
        {
          title: "店号",
          key: "code",
          className: "tc",
          minWidth: 70,
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
                  title: params.row.code
                }
              }, params.row.code)
            ])
          }
        },
        {
          title: "区域",
          key: "area",
          minWidth: 70,
          className: "tc"
        },
        {
          title: "门店",
          key: "orgName",
          minWidth: 70,
          className: "tc"
        },
        {
          title: "客户/供应商名称",
          key: "guestName",
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
                  title: params.row.guestName
                }
              }, params.row.guestName)
            ])
          }
        },
        {
          title: "客户/供应商类别",
          key: "guestTypeName",
          className: "tc",
          minWidth: 120
        },
        {
          title: "对账类别",
          key: "paymentTypeName",
          className: "tc",
          minWidth: 90
        },
        {
          title: "采购入库",
          key: "stockAmtIn",
          className: "tc",
          minWidth: 90
        },
        {
          title: "采购退货",
          key: "stockAmtOut",
          className: "tc",
          minWidth: 90
        },
        {
          title: "销售出库",
          key: "salesAmtOut",
          className: "tc",
          minWidth: 90
        },
        {
          title: "销售退货",
          key: "salesAmtReturn",
          className: "tc",
          minWidth: 90
        },
        {
          title: "应收应付金额",
          key: "duePayableAmt",
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
                  title: params.row.duePayableAmt
                }
              }, params.row.duePayableAmt)
            ])
          }
        },
        {
          title: "已对账未收金额",
          key: "receivedAmt",
          className: "tc",
          minWidth: 100
        },
        {
          title: "已对账未付金额",
          key: "paidAmt",
          className: "tc",
          minWidth: 100
        },
        {
          title: "已对账合计",
          key: "reconciledSumAmt",
          className: "tc",
          minWidth: 100
        },
        {
          title: "未对账应收金额",
          key: "uncollectedAmt",
          className: "tc",
          minWidth: 100
        },
        {
          title: "未对账应付金额",
          key: "unpaidAmt",
          className: "tc",
          minWidth: 100
        },
        {
          title: "未对账合计",
          key: "unReconciledSumAmt",
          className: "tc",
          minWidth: 100
        }
      ],
      columns1: [
        {
          title: "序号",
          type: "index",
          key:"index",
          width: 40,
          className: "tc"
        },
        {
          title: "店号",
          key: "shopCode",
          className: "tc",
          minWidth: 60,
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
                  title: params.row.shopCode
                }
              }, params.row.shopCode)
            ])
          }
        },
        {
          title: "区域",
          key: "area",
          minWidth: 70,
          className: "tc"
        },
        {
          title: "门店",
          key: "orgName",
          minWidth: 70,
          className: "tc"
        },
        {
          title: "客户/供应商名称",
          key: "guestName",
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
                  title: params.row.guestName
                }
              }, params.row.guestName)
            ])
          }
        },
        {
          title: "客户供应商类别",
          key: "guestTypeName",
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
                  title: params.row.guestTypeName
                }
              }, params.row.guestTypeName)
            ])
          }
        },
        {
          title: "销售订单号",
          key: "orderNo",
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
                  title: params.row.orderNo
                }
              }, params.row.orderNo)
            ])
          }
        },
        {
          title: "出库单号",
          key: "serviceId",
          className: "tc",
          minWidth: 80,
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  cursor: "pointer",
                  color: "#87CEFA",
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                on: {
                  click: async () => {
                    if (params.row.serviceTypeName == "销售出库") {
                      this.title = "出库明细";
                    } else {
                      this.title = "退货明细";
                    }
                    this.outStock = true;
                    let obj = {
                      orderCode: params.row.serviceId,
                      orderType: params.row.serviceType.value
                    };
                    let res = await this.getList(obj);
                    res.detailed.map(item => {
                      item.orderCode = params.row.serviceId;
                      item.orderType = params.row.serviceType.value;
                      item.orgId = params.row.orgId;
                      item.guestId = params.row.guestId;
                    });
                    this.data3 = res.detailed;
                  }
                },
                domProps: {
                  title: params.row.serviceId
                }
              },
              params.row.serviceId
            );
          }
        },
        {
          title: "来源",
          key: "serviceSourceName",
          className: "tc",
          minWidth: 50,
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
                  title: params.row.serviceSourceName
                }
              }, params.row.serviceSourceName)
            ])
          }
        },
        {
          title: "业务类型",
          key: "serviceTypeName",
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
                  title: params.row.serviceTypeName
                }
              }, params.row.serviceTypeName)
            ])
          }
        },
        {
          title: "含税标志",
          key: "taxSignName",
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
                  title: params.row.taxSignName
                }
              }, params.row.taxSignName)
            ])
          }
        },
        // {
        //   title: "油品/配件",
        //   key: "speciesName",
        //   className: "tc"
        // },
        {
          title: "转单日期",
          key: "transferDate",
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
                  title: params.row.transferDate
                }
              }, params.row.transferDate)
            ])
          }
        },
        {
          title: "应收金额",
          key: "rpAmt",
          className: "tc",
          minWidth: 80
        },
        {
          title: "已收金额",
          key: "charOffAmt",
          className: "tc",
          minWidth: 80
        },
        {
          title: "未收金额",
          key: "noCharOffAmt",
          className: "tc",
          minWidth: 80
        },
        {
          title: "业务员",
          key: "salesman",
          className: "tc",
          minWidth: 60
        },
        {
          title: "已对账金额",
          key: "accountAmt",
          className: "tc",
          minWidth: 80
        },
        {
          title: "未对账金额",
          key: "noAccountAmt",
          className: "tc",
          minWidth: 80
        },
        {
          title: "草稿金额",
          key: "draftAmt",
          className: "tc",
          minWidth: 80
        },
        {
          title: "备注",
          key: "remark",
          className: "tc",
          minWidth: 60,
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
          title: "对账门店",
          key: "accountOrgName",
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
                  title: params.row.accountOrgName
                }
              }, params.row.accountOrgName)
            ])
          }
        },
        {
          title: "对账人",
          key: "accountMan",
          className: "tc",
          minWidth: 80
        },
        {
          title: "对账订单",
          key: "accountNo",
          className: "tc",
          minWidth: 80
        }
      ],
      columns2: [
        {
          title: "序号",
          type: "index",
          key:"index",
          width: 40,
          className: "tc"
        },
        {
          title: "店号",
          key: "shopCode",
          className: "tc",
          minWidth: 70,
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
                  title: params.row.shopCode
                }
              }, params.row.shopCode)
            ])
          }
        },
        {
          title: "区域",
          key: "area",
          minWidth: 70,
          className: "tc"
        },
        {
          title: "门店",
          key: "orgName",
          minWidth: 70,
          className: "tc"
        },
        {
          title: "客户/供应商名称",
          key: "guestName",
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
                  title: params.row.guestName
                }
              }, params.row.guestName)
            ])
          }
        },
        {
          title: "客户供应商类别",
          key: "guestTypeName",
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
                  title: params.row.guestTypeName
                }
              }, params.row.guestTypeName)
            ])
          }
        },
        {
          title: "采购订单号",
          key: "orderNo",
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
                  title: params.row.orderNo
                }
              }, params.row.orderNo)
            ])
          }
        },
        {
          title: "入库单号",
          key: "serviceId",
          className: "tc",
          minWidth: 80,
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  cursor: "pointer",
                  color: "#87CEFA",
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                on: {
                  click: async () => {
                    this.onStock = true;
                    let obj = {
                      orderCode: params.row.serviceId,
                      orderType: params.row.serviceType.value
                    };
                    let res = await this.getList(obj);
                    res.detailed.map(item => {
                      item.orderCode = params.row.serviceId;
                      item.orderType = params.row.serviceType.value;
                      item.orgId = params.row.orgId;
                      item.guestId = params.row.guestId;
                    });
                    this.data4 = res.detailed;
                  }
                },
                domProps: {
                  title: params.row.serviceId
                }
              },
              params.row.serviceId
            );
          }
        },
        {
          title: "来源",
          key: "serviceSourceName",
          className: "tc",
          minWidth: 50,
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
                  title: params.row.serviceSourceName
                }
              }, params.row.serviceSourceName)
            ])
          }
        },
        {
          title: "业务类型",
          key: "serviceTypeName",
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
                  title: params.row.serviceTypeName
                }
              }, params.row.serviceTypeName)
            ])
          }
        },
        {
          title: "含税标志",
          key: "taxSignName",
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
                  title: params.row.taxSignName
                }
              }, params.row.taxSignName)
            ])
          }
        },
        // {
        //   title: "油品/配件",
        //   key: "speciesName",
        //   className: "tc"
        // },
        {
          title: "转单日期",
          key: "transferDate",
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
                  title: params.row.transferDate
                }
              }, params.row.transferDate)
            ])
          }
        },
        {
          title: "应付金额",
          key: "rpAmt",
          className: "tc",
          minWidth: 80
        },
        {
          title: "已付金额",
          key: "charOffAmt",
          className: "tc",
          minWidth: 80
        },
        {
          title: "未付金额",
          key: "noCharOffAmt",
          className: "tc",
          minWidth: 80
        },
        {
          title: "业务员",
          key: "salesman",
          className: "tc",
          minWidth: 80
        },
        {
          title: "已对账金额",
          key: "accountAmt",
          className: "tc",
          minWidth: 80
        },
        {
          title: "未对账金额",
          key: "noAccountAmt",
          className: "tc",
          minWidth: 80
        },
        {
          title: "草稿金额",
          key: "draftAmt",
          className: "tc",
          minWidth: 80
        },
        {
          title: "备注",
          key: "remark",
          className: "tc",
          minWidth: 60,
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
          title: "对账门店",
          key: "accountOrgName",
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
                  title: params.row.accountOrgName
                }
              }, params.row.accountOrgName)
            ])
          }
        },
        {
          title: "对账人",
          key: "accountMan",
          className: "tc",
          minWidth: 80
        },
        {
          title: "对账订单",
          key: "accountNo",
          className: "tc",
          minWidth: 80
        }
      ],
      columns3: [
        {
          title: "序号",
          type: "index",
          width: 40,
          className: "tc"
        },
        {
          title: "配件编码",
          key: "partCode",
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
                  title: params.row.partCode
                }
              }, params.row.partCode)
            ])
          }
        },
        {
          title: "配件名称",
          key: "partName",
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
                  title: params.row.partName
                }
              }, params.row.partName)
            ])
          }
        },
        {
          title: "配件规格",
          key: "specification",
          className: "tc",
          minWidth: 80
        },
        {
          title: "配件车型",
          key: "carModel",
          className: "tc",
          minWidth: 80
        },
        {
          title: "配件品牌",
          key: "partBrand",
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
                  title: params.row.partBrand
                }
              }, params.row.partBrand)
            ])
          }
        },
        {
          title: "配件厂牌",
          key: "factoryBrand",
          className: "tc",
          minWidth: 80
        },
        {
          title: "OEM码",
          key: "oemCode",
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
                  title: params.row.oemCode
                }
              }, params.row.oemCode)
            ])
          }
        },
        {
          title: "税率",
          key: "taxRate",
          className: "tc",
          minWidth: 60
        },
        {
          title: "数量",
          key: "qty",
          className: "tc",
          minWidth: 60
        },
        {
          title: "单位",
          key: "unitId",
          className: "tc",
          minWidth: 60
        },
        {
          title: "单价",
          key: "price",
          className: "tc",
          minWidth: 60
        },
        {
          title: "金额",
          key: "orderAmt",
          className: "tc",
          minWidth:60
        },
        {
          title: "备注",
          key: "remark",
          className: "tc",
          minWidth: 60,
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
      columns4: [
        {
          title: "序号",
          type: "index",
          width: 40,
          className: "tc"
        },
        {
          title: "门店名称",
          key: "orgName",
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
                  title: params.row.orgName
                }
              }, params.row.orgName)
            ])
          }
        },
        {
          title: "是否直发",
          key: "isDirect",
          className: "tc",
          minWidth: 80
        },
        {
          title: "配件编码",
          key: "partCode",
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
                  title: params.row.partCode
                }
              }, params.row.partCode)
            ])
          }
        },
        {
          title: "配件名称",
          key: "partName",
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
                  title: params.row.partName
                }
              }, params.row.partName)
            ])
          }
        },
        {
          title: "配件规格",
          key: "specification",
          className: "tc",
          minWidth: 80
        },
        {
          title: "配件车型",
          key: "carModel",
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
                  title: params.row.carModel
                }
              }, params.row.carModel)
            ])
          }
        },
        {
          title: "配件品牌",
          key: "partBrand",
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
                  title: params.row.partBrand
                }
              }, params.row.partBrand)
            ])
          }
        },
        {
          title: "配件厂牌",
          key: "factoryBrand",
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
                  title: params.row.factoryBrand
                }
              }, params.row.factoryBrand)
            ])
          }
        },
        {
          title: "OEM码",
          key: "oemCode",
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
                  title: params.row.oemCode
                }
              }, params.row.oemCode)
            ])
          }
        },
        {
          title: "税率",
          key: "taxRate",
          className: "tc",
          minWidth: 60
        },
        {
          title: "数量",
          key: "qty",
          className: "tc",
          minWidth: 60
        },
        {
          title: "单位",
          key: "unitId",
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
                  title: params.row.unitId
                }
              }, params.row.unitId)
            ])
          }
        },
        {
          title: "单价",
          key: "price",
          className: "tc",
          minWidth: 60
        },
        {
          title: "金额",
          key: "orderAmt",
          className: "tc",
          minWidth: 60,
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
                  title: params.row.orderAmt
                }
              }, params.row.orderAmt)
            ])
          }
        },
        {
          title: "备注",
          key: "remark",
          className: "tc",
          minWidth: 60,
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
          title: "不含税价格",
          key: "noTaxPrice",
          className: "tc",
          minWidth: 80,
          render:(h,params) => {
            let noTaxPrice = parseFloat(params.row.noTaxPrice||0).toFixed(2)
            return h('span',noTaxPrice)
          }
        },
        {
          title: "不含税金额",
          key: "noTaxAmt",
          className: "tc",
          minWidth: 80,
          render:(h,params) => {
            let noTaxPrice = parseFloat(params.row.noTaxAmt||0).toFixed(2)
            return h('span',noTaxPrice)
          }
        },
        {
          title: "含税单价",
          key: "taxPrice",
          className: "tc",
          minWidth: 80,
          render:(h,params) => {
            let noTaxPrice = parseFloat(params.row.taxPrice||0).toFixed(2)
            return h('span',noTaxPrice)
          }
        },
        {
          title: "含税金额",
          key: "taxAmt",
          className: "tc",
          minWidth: 80,
          render:(h,params) => {
            let noTaxPrice = parseFloat(params.row.taxAmt||0).toFixed(2)
            return h('span',noTaxPrice)
          }
        }
      ],
      data: [],
      data1: [],
      data2: [],
      data3: [],
      data4: [],
      typelist: [
        {
          value: "HS",
          label: "华胜"
        },
        {
          value: "NB",
          label: "内部"
        },
        {
          value: "WB",
          label: "外部"
        }
      ],
      Branchstore: [
        {id:'0' ,name:'全部'}
      ],
      business: [
        {
          value: "CGRK",
          label: "采购入库"
        },
        {
          value: "CGTH",
          label: "采购退货"
        },
        {
          value: "XSCK",
          label: "销售出库"
        },
        {
          value: "XSTH",
          label: "销售退货"
        }
      ]
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
  async mounted() {
    this.parameter = [];
      let arr = await creat(this.$refs.quickDate.val, this.$store);
      let obj = {
        orgId: arr[1],
        startDate: this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endDate: this.value[1]
          ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
          : ""
      };
      this.getGeneral(obj);
    this.value = arr[0];
    this.$nextTick( () => {
      this.model1 = arr[1]
    })
    this.getShop()
  },
  methods: {
    //获取门店
    async getShop(){
      let data ={}
      let res = await goshop(data)
      if (res.code === 0) return this.Branchstore = [...this.Branchstore , ...res.data]
    },
    // 表格合计方式
    handleSummary({ columns, data }) {
      //   console.log(columns,data)
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
        if (index > 10 && index < 18 && index !== 14) {
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
    // 出库明细表格合计方式
    summary({ columns, data }) {
      //   console.log(columns,data)
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
        if (index === 9 || index === 12) {
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
    // 入库出库明细表格合计方式
    summary1({ columns, data }) {
      //   console.log(columns,data)
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
        if (index === 11 || index === 14 || index === 17 || index === 19) {
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
    // // 子组件传参
    // getOne(val){

    // },
    // 快速查询
    quickDate(data) {
      this.value = data ? data : ["", ""];
      this.data1 = [];
      this.data2 = [];
      let obj = {
        orgId: this.model1,
        startDate: this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endDate: this.value[1]
          ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
          : ""
      };
      this.getGeneral(obj);
    },
    // 选择日期
    changedate(daterange) {
      this.value = daterange;
      this.query()
    },
    open() {
      this.value = []
      this.model2 = ''
      this.nametext = ''
      this.model1 = ''
      this.model3 = ''
      this.text = ''
      this.clientList=[]
      this.Branchstore=[]
      this.modal1 = true
      this.getShop()
    },
    // 更多条件查询
    senior() {
      this.data1 = [];
      this.data2 = [];
      let obj = {
        orgId: this.model1,
        startDate: this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endDate: this.value[1]
          ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        guestType: this.model2,
        tenantName: this.nametext,
        serviceType: this.model3,
        serviceId: this.text,
        guestId:this.guestId
      };
      this.getGeneral(obj);
    },
    // 查询应收/应付总表
    query() {
      this.data1 = [];
      this.data2 = [];
      let obj = {
        orgId: this.model1,
        startDate: this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endDate: this.value[1]
          ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
          : ""
      };
      this.getGeneral(obj);
    },
    // 应收应付接口
    getGeneral(obj) {
      if (obj.endDate) {
        obj.endDate = obj.endDate.split(' ')[0] + " 23:59:59"
      }
      getreceivable(obj).then(res => {
        if (res.data.length !== 0) {
          res.data.map((item, index) => {
            item.num = index + 1;
          });
          this.data = res.data;
        } else {
          this.data = [];
        }
      });
    },
    // 销售/采购接口
    getDetailed(data, obj) {
      getSalelist({
        tenantId: data.tenantId,
        orgId: data.orgId,
        startDate: obj[0]
          ? moment(obj[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endDate: obj[1]
          ? moment(obj[1]).format("YYYY-MM-DD HH:mm:ss").split(' ')[0]+" 23:59:59"
          : "",
        guestId: data.guestId
      }).then(res => {
        if (res.data.one) {
          res.data.one.map((item, index) => {
            item.num = index + 1;
            item.guestTypeName = item.guestType.name;
            item.serviceTypeName = item.serviceType.name;
            item.speciesName = item.species.name;
          });
          this.data1 = res.data.one;
        } else {
          this.data1 = [];
        }
        if (res.data.two) {
          res.data.two.map((item, index) => {
            item.num = index + 1;
            item.guestTypeName = item.guestType.name;
            item.serviceTypeName = item.serviceType.name;
            item.speciesName = item.species.name;
          });
          this.data2 = res.data.two;
        } else {
          this.data2 = [];
        }
      });
    },
    // // 往来单位
    // Dealings() {
    //   this.$refs.selectDealings.openModel();
    // },
    // 月结对账
    Monthlyreconciliation() {
      // this.$refs.Monthlyreconciliation.modal = true;
      if (JSON.stringify(this.$refs.Monthlyreconciliation.parameter) !== "{}") {
        this.$refs.Monthlyreconciliation.modal = true;
      } else {
        this.$Message.warning("请选择要对账的数据");
      }
    },
    // 点击总汇表数据查询销售/采购清单
    selete(data) {
      let date = {
        startDate: this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endDate: this.value[1]
          ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
          : ""
      };

      this.$refs.Monthlyreconciliation.parameter = { ...data, ...date };
      this.getDetailed(data, this.value);
    },
    // 查询出/入库单号明细
    async getList(obj) {
      let detailed = [];
      await getNumberList(obj).then(res => {
        res.data.map((item, index) => {
          item.num = index + 1;
        });
        detailed = res.data;
      });
      return { detailed };
    },
    // 导出汇总
    exportSummary() {
      if (this.data.length !== 0) {
        let arrData = [...this.data]
        arrData.map(item=>{
          item.orgId = "\t"+item.orgId
        })
        this.$refs.summary.exportCsv({
          filename: "应收应付汇总表",
          original:false,
          columns:this.columns,
          data:arrData
        });
      } else {
        this.$message.error("应收应付汇总表暂无数据");
      }
    },
    // 当前标签页的name
    tabName(name) {
      this.detailedList = name;
    },
    // 导出单据
    exportBill() {
      if (this.detailedList === "key1") {
        if (this.data1.length !== 0) {
          let arrData = [...this.data1]
          arrData.map((item,index) => {
            item.orgId = "\t"+item.orgId
            item.index = index+1
          })
          this.$refs.sale.exportCsv({
            filename: "销售清单",
            original:false,
            columns:this.columns1,
            data:arrData
          });
        } else {
          this.$message.error("销售清单暂无数据");
        }
      } else if (this.detailedList === "key2") {
        if (this.data2.length !== 0) {
          let arrData = [...this.data2]
          arrData.map((item,index) => {
            item.orgId = "\t"+item.orgId
            item.index = index+1
          })
          this.$refs.purchase.exportCsv({
            filename: "采购清单",
            original:false,
            columns:this.columns2,
            data:arrData
          });
        } else {
          this.$message.error("销售清单暂无数据");
        }
      }
    },
    // 出/入库明细导出
    exportDetail(type) {
      if (type) {
        this.$refs.warehousing.exportCsv({
          filename: "入库单配件明细"
        });
      } else {
        this.$refs.noWarehousing.exportCsv({
          filename: "出库单配件明细"
        });
      }
    },
    // 打印
    print(type) {
      type ? (this.tit = "采购入库") : (this.tit = "销售出库");
      setTimeout(() => {
        this.$refs.PrintShow.openModal();
      },0)

    },
    //获取公司
    async getAllClient(query){
      if (query !== '') {
        this.searchLoading = true;
        let req = {
          fullName:query,
          size:1000,
        }
        let rep = await getCustomerInformation(req);
        this.searchLoading = false;
        if(rep.code==0){
          this.clientList = rep.data.content;
        }
      } else {
        this.companyList = [];
      }
    },
    getAccountNameListFun(v){
      this.guestId = v;

    },
  }
};
</script>

<style lang="less" scoped>
.oper-top input {
  border: 1px solid #dddddd;
  text-indent: 4px;
}
.oper-top .input {
  position: relative;
  left: -26px;
  bottom: -5px;
}
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
</style>
