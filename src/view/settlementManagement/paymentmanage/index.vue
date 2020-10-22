<template>
  <div class="content-oper content-oper-flex loadingClass">
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
              >{{ item.shortName }}
              </Option>
            </Select>
          </div>
          <div class="db ml20">
            <span>往来单位：</span>
            <Select v-model="guestId" filterable clearable class="w150"
                    :loading="searchLoading"
                    :remote-method="getAllClient"
                    @on-change="getAccountNameListFun"
            >
              <Option v-for="item in clientList" :value="item.id" :key="item.id">{{ item.fullName }}</Option>
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
            <button class="mr10 ivu-btn ivu-btn-default" type="button" v-has="'export'" @click="exportSummary">导出
            </button>
            <!--            <Poptip placement="bottom">-->
            <!--              <button class="mr10 ivu-btn ivu-btn-default" type="button" v-has="'export'">导出</button>-->
            <!--              <div slot="content">-->
            <!--                <button-->
            <!--                  class="mr10 ivu-btn ivu-btn-default"-->
            <!--                  type="button"-->
            <!--                  @click="exportSummary"-->
            <!--                >导出全部-->
            <!--                </button>-->
            <!--                <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="exportList">导出勾选</button>-->
            <!--              </div>-->
            <!--            </Poptip>-->
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="Monthlyreconciliation"
              v-has="'reconciliation'"
            >月结对账
            </button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <!--<Table-->
        <!--max-height="400"-->
        <!--highlight-row-->
        <!--border-->
        <!--:columns="columns"-->
        <!--:data="data"-->
        <!--@on-row-click="selete"-->
        <!--ref="summary"-->
        <!--&gt;</Table>-->
        <vxe-table
          border
          show-overflow="title"
          max-height="200"
          auto-resize
          resizable
          size="mini"
          :data="data"
          ref="summary"
          highlight-current-row
          @current-change="selete"
        >
          <!--          @select-all="selectBox"-->
          <!--          @select-change="selectBox"-->
          <!--          <vxe-table-column width="50" type="selection" align="center"></vxe-table-column>-->
          <vxe-table-column width="50" type="seq" title="序号" align="center"></vxe-table-column>
          <vxe-table-column field="code" title="店号" align="center" width="70"></vxe-table-column>
          <vxe-table-column field="area" title="区域" align="center" width="70"></vxe-table-column>
          <vxe-table-column field="orgName" title="门店" align="center" width="140"></vxe-table-column>
          <vxe-table-column field="guestName" title="客户/供应商名称" align="center" width="140"></vxe-table-column>
          <vxe-table-column field="guestTypeName" title="客户/供应商类别" align="center" width="120"></vxe-table-column>
          <vxe-table-column field="paymentTypeName" title="对账类别" align="center" width="80"></vxe-table-column>
          <vxe-table-column field="stockAmtIn" title="采购入库" align="center" width="80"></vxe-table-column>
          <vxe-table-column field="stockAmtOut" title="采购退货" align="center" width="140"></vxe-table-column>
          <vxe-table-column field="salesAmtOut" title="销售出库" align="center" width="140"></vxe-table-column>
          <vxe-table-column field="salesAmtReturn" title="销售退货" align="center" width="140"></vxe-table-column>
          <vxe-table-column field="duePayableAmt" title="应收应付金额" align="center" width="140"></vxe-table-column>
          <vxe-table-column field="receivedAmt" title="已对账未收金额" align="center" width="120"></vxe-table-column>
          <vxe-table-column field="paidAmt" title="已对账未付金额" align="center" width="120"></vxe-table-column>
          <vxe-table-column
            field="reconciledSumAmt"
            title="已对账合计"
            align="center"
            width="100"
          >

          </vxe-table-column>
          <vxe-table-column field="uncollectedAmt" title="未对账应收金额" align="center" width="120">
          </vxe-table-column>
          <vxe-table-column field="unpaidAmt" title="未对账应付金额" align="center" width="120">
          </vxe-table-column>
          <vxe-table-column field="unReconciledSumAmt" title="未对账合计" align="center" width="100">
          </vxe-table-column>
        </vxe-table>
        <vxe-pager
          background
          :current-page.sync="pageObj.num"
          :page-size.sync="pageObj.size"
          :total="pageObj.total"
          @page-change="pageChange"
          :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']">
        </vxe-pager>
        <Tabs v-model="detailedList" class="mt10" @click="tabName">
          <Tab-pane label="销售清单" name="key1">
            <Table
              border
              :columns="columns1"
              :data="data1"
              size="small"
              class="mt10"
              max-height="400"
              ref="sale"
            ></Table>
            <vxe-pager
              background
              :current-page.sync="pageObj1.num"
              :page-size.sync="pageObj1.size"
              :total="pageObj1.total"
              @page-change="pageChange1"
              :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']">
            </vxe-pager>
          </Tab-pane>
          <Tab-pane label="采购清单" name="key2">
            <Table
              border
              :columns="columns2"
              :data="data2"
              class="mt10"
              size="small"
              max-height="400"
              ref="purchase"
            ></Table>
            <vxe-pager
              background
              :current-page.sync="pageObj2.num"
              :page-size.sync="pageObj2.size"
              :total="pageObj2.total"
              @page-change="pageChange2"
              :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']">
            </vxe-pager>
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
        <input type="text" class="w200" v-model="text"/>
      </div>
    </Modal>
    <Modal v-model="outStock" :title="title" width="1200">
      <div class="db">
        <button
          class="mr10 ivu-btn ivu-btn-default"
          type="button"
          @click="print(0)"
        >打印
        </button>
        <button
          class="mr10 ivu-btn ivu-btn-default"
          type="button"
          @click="exportDetail(0)"
        >导出
        </button>
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
        >打印
        </button>
        <button
          class="mr10 ivu-btn ivu-btn-default"
          type="button"
          @click="exportDetail(1)"
        >导出
        </button>
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
    <Monthlyreconciliation ref="Monthlyreconciliation"/>
    <PrintShow ref="PrintShow" :title="tit"/>
  </div>
</template>

<script>
  import quickDate from "@/components/getDate/dateget_noEmit.vue";
  import Monthlyreconciliation from "./Monthlyreconciliation.vue";
  import PrintShow from "./component/PrintShow";
  import {
    getreceivable,
    getSalelist,
    getNumberList
  } from "@/api/bill/saleOrder";
  import {
    payColExportAll/**导出汇总*/,
    payColExportDetail/**导出明细*/,
    payColSelOrPurchaseExport/**销售清单采购清单导出*/,
    payColExportSelect/**导出勾选*/
  } from "@/api/settlementManagement/Import/index.js"
  import {goshop} from '@/api/settlementManagement/shopList';
  import {creat} from "./../components";
  import moment from "moment";
  import {findGuest} from "../../../api/settlementManagement/advanceCollection";
  import {showLoading, hideLoading} from "@/utils/loading"
  export default {
    name: 'payMentmanage',
    components: {
      quickDate,
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
        clientList: [],//客户下拉数据
        searchLoading: true,
        guestId: "",//客户选中id
        pageObj: {
          size: 10,
          total: 0,
          num: 1
        },
        pageObj1: {
          size: 10,
          total: 0,
          num: 1
        },
        pageObj2: {
          size: 10,
          total: 0,
          num: 1
        },
        columns: [
          {
            title: "序号",
            type: "index",
            width: 40,
            className: "tc"
          },
          {
            title: "店号",
            key: "code",
            className: "tc",
            width: 70,
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
            width: 80,
            className: "tc"
          },
          {
            title: "门店",
            key: "orgName",
            width: 100,
            className: "tc"
          },
          {
            title: "客户/供应商名称",
            key: "guestName",
            className: "tc",
            width: 120,
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
            width: 120
          },
          {
            title: "对账类别",
            key: "paymentTypeName",
            className: "tc",
            width: 90
          },
          {
            title: "采购入库",
            key: "stockAmtIn",
            className: "tc",
            width: 90
          },
          {
            title: "采购退货",
            key: "stockAmtOut",
            className: "tc",
            width: 90
          },
          {
            title: "销售出库",
            key: "salesAmtOut",
            className: "tc",
            width: 90
          },
          {
            title: "销售退货",
            key: "salesAmtReturn",
            className: "tc",
            width: 90
          },
          {
            title: "应收应付金额",
            key: "duePayableAmt",
            className: "tc",
            width: 120,
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
            width: 100
          },
          {
            title: "已对账未付金额",
            key: "paidAmt",
            className: "tc",
            width: 100
          },
          {
            title: "已对账合计",
            key: "reconciledSumAmt",
            className: "tc",
            width: 100
          },
          {
            title: "未对账应收金额",
            key: "uncollectedAmt",
            className: "tc",
            width: 100
          },
          {
            title: "未对账应付金额",
            key: "unpaidAmt",
            className: "tc",
            width: 100
          },
          {
            title: "未对账合计",
            key: "unReconciledSumAmt",
            className: "tc",
            width: 100
          }
        ],
        columns1: [
          {
            title: "序号",
            type: "index",
            key: "index",
            width: 40,
            className: "tc",
            resizable: true,
          },
          {
            title: "店号",
            key: "shopCode",
            className: "tc",
            resizable: true,
            width: 60,
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
            width: 80,
            tooltip: true,
            className: "tc",
            resizable: true,
          },
          {
            title: "门店",
            key: "orgName",
            width: 200,
            className: "tc",
            resizable: true,
            tooltip: true
          },
          {
            title: "客户/供应商名称",
            key: "guestName",
            className: "tc",
            resizable: true,
            width: 120,
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
            resizable: true,
            width: 80,
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
            resizable: true,
            width: 50,
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
            resizable: true,
            width: 80
          },
          {
            title: "已收金额",
            key: "charOffAmt",
            className: "tc",
            resizable: true,
            width: 80
          },
          {
            title: "未收金额",
            key: "noCharOffAmt",
            className: "tc",
            resizable: true,
            width: 80
          },
          {
            title: "业务员",
            key: "salesman",
            className: "tc",
            resizable: true,
            width: 100,
            tooltip: true
          },
          {
            title: "已对账金额",
            key: "accountAmt",
            className: "tc",
            resizable: true,
            width: 80
          },
          {
            title: "未对账金额",
            key: "noAccountAmt",
            className: "tc",
            resizable: true,
            width: 80
          },
          {
            title: "草稿金额",
            key: "draftAmt",
            className: "tc",
            resizable: true,
            width: 80
          },
          {
            title: "备注",
            key: "remark",
            className: "tc",
            resizable: true,
            width: 60,
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
            resizable: true,
            width: 100,
            tooltip: true
          },
          {
            title: "对账订单",
            key: "accountNo",
            className: "tc",
            resizable: true,
            width: 150,
            tooltip: true
          }
        ],
        columns2: [
          {
            title: "序号",
            type: "index",
            key: "index",
            width: 40,
            className: "tc",
            resizable: true,
          },
          {
            title: "店号",
            key: "shopCode",
            className: "tc",
            resizable: true,
            width: 70,
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
            width: 70,
            tooltip: true,
            className: "tc",
            resizable: true,
          },
          {
            title: "门店",
            key: "orgName",
            tooltip: true,
            width: 200,
            className: "tc",
            resizable: true,
          },
          {
            title: "客户/供应商名称",
            key: "guestName",
            className: "tc",
            resizable: true,
            width: 120,
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
            resizable: true,
            width: 120,
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
            resizable: true,
            width: 80,
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
            resizable: true,
            width: 50,
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
            resizable: true,
            width: 80
          },
          {
            title: "已付金额",
            key: "charOffAmt",
            className: "tc",
            resizable: true,
            width: 80
          },
          {
            title: "未付金额",
            key: "noCharOffAmt",
            className: "tc",
            resizable: true,
            width: 80
          },
          {
            title: "业务员",
            key: "salesman",
            className: "tc",
            resizable: true,
            tooltip: true,
            width: 80
          },
          {
            title: "已对账金额",
            key: "accountAmt",
            className: "tc",
            resizable: true,
            width: 80
          },
          {
            title: "未对账金额",
            key: "noAccountAmt",
            className: "tc",
            resizable: true,
            width: 80
          },
          {
            title: "草稿金额",
            key: "draftAmt",
            className: "tc",
            resizable: true,
            width: 80
          },
          {
            title: "备注",
            key: "remark",
            className: "tc",
            resizable: true,
            width: 60,
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
                    title: params.row.accountOrgName
                  }
                }, params.row.accountOrgName)
              ])
            }
          },
          {
            title: "对账人",
            key: "accountMan",
            tooltip: true,
            className: "tc",
            resizable: true,
            width: 80
          },
          {
            title: "对账订单",
            key: "accountNo",
            tooltip: true,
            className: "tc",
            resizable: true,
            width: 80
          }
        ],
        columns3: [
          {
            title: "序号",
            type: "index",
            width: 40,
            className: "tc",
            resizable: true,
          },
          {
            title: "区域",
            key: "area",
            className: "tc",
            resizable: true,
            width: 80
          },
          {
            title: "店号",
            key: "shopCode",
            className: "tc",
            resizable: true,
            width: 80
          },
          {
            title: "入库时间",
            key: "auditDate",
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
                    title: params.row.auditDate
                  }
                }, params.row.auditDate)
              ])
            }
          },
          {
            title: "客户/供应商名称",
            key: "guestName",
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
                    title: params.row.guestName
                  }
                }, params.row.guestName)
              ])
            }
          },
          {
            title: "配件编码",
            key: "partCode",
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
            resizable: true,
            width: 80
          },
          {
            title: "配件车型",
            key: "carModel",
            className: "tc",
            resizable: true,
            tooltip: true,
            width: 80
          },
          {
            title: "配件品牌",
            key: "partBrand",
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
            resizable: true,
            tooltip: true,
            width: 80
          },
          {
            title: "OEM码",
            key: "oemCode",
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
            resizable: true,
            width: 60
          },
          {
            title: "数量",
            key: "qty",
            className: "tc",
            resizable: true,
            width: 60
          },
          {
            title: "单位",
            key: "unitId",
            className: "tc",
            resizable: true,
            width: 60
          },
          {
            title: "单价",
            key: "price",
            className: "tc",
            resizable: true,
            width: 60
          },
          {
            title: "金额",
            key: "orderAmt",
            className: "tc",
            resizable: true,
            width: 60
          },
          {
            title: "备注",
            key: "remark",
            className: "tc",
            resizable: true,
            width: 60,
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
            className: "tc",
            resizable: true,
          },
          {
            title: "门店名称",
            key: "orgName",
            className: "tc",
            width: 80,
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
            title: "区域",
            key: "area",
            className: "tc",
            resizable: true,
            tooltip: true,
            width: 80
          },
          {
            title: "店号",
            key: "shopCode",
            tooltip: true,
            className: "tc",
            resizable: true,
            width: 80
          },
          {
            title: "入库时间",
            key: "auditDate",
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
                    title: params.row.auditDate
                  }
                }, params.row.auditDate)
              ])
            }
          },
          {
            title: "客户/供应商名称",
            key: "guestName",
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
                    title: params.row.guestName
                  }
                }, params.row.guestName)
              ])
            }
          },
          {
            title: "是否直发",
            key: "isDirect",
            className: "tc",
            resizable: true,
            width: 80
          },
          {
            title: "配件编码",
            key: "partCode",
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
            resizable: true,
            width: 80
          },
          {
            title: "配件车型",
            key: "carModel",
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
            resizable: true,
            width: 60
          },
          {
            title: "数量",
            key: "qty",
            className: "tc",
            resizable: true,
            width: 60
          },
          {
            title: "单位",
            key: "unitId",
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
            resizable: true,
            width: 60
          },
          {
            title: "金额",
            key: "orderAmt",
            className: "tc",
            resizable: true,
            width: 60,
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
            resizable: true,
            width: 60,
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
            resizable: true,
            width: 80,
            render: (h, params) => {
              let noTaxPrice = parseFloat(params.row.noTaxPrice || 0).toFixed(2)
              return h('span', noTaxPrice)
            }
          },
          {
            title: "不含税金额",
            key: "noTaxAmt",
            className: "tc",
            resizable: true,
            width: 80,
            render: (h, params) => {
              let noTaxPrice = parseFloat(params.row.noTaxAmt || 0).toFixed(2)
              return h('span', noTaxPrice)
            }
          },
          {
            title: "含税单价",
            key: "taxPrice",
            className: "tc",
            resizable: true,
            width: 80,
            render: (h, params) => {
              let noTaxPrice = parseFloat(params.row.taxPrice || 0).toFixed(2)
              return h('span', noTaxPrice)
            }
          },
          {
            title: "含税金额",
            key: "taxAmt",
            className: "tc",
            resizable: true,
            width: 80,
            render: (h, params) => {
              let noTaxPrice = parseFloat(params.row.taxAmt || 0).toFixed(2)
              return h('span', noTaxPrice)
            }
          }
        ],
        data: [],
        data1: [],
        data2: [],
        selectTabJson: {},
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
          {id: '0', name: '全部', shortName: "全部"}
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
        ],
        data1Loading: false,
        copyData: [],
        copyData1: [],
        copyData2: [],
        selectBoxList: []//应收应付 数组 勾选
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
    async mounted() {
      this.parameter = [];
      let arr = await creat(this.$refs.quickDate.val, this.$store);
      // let obj = {
      //   orgId: arr[1],
      //   startDate: this.value[0]
      //     ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
      //     : "",
      //   endDate: this.value[1]
      //     ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
      //     : ""
      // };
      // this.getGeneral(obj);
      this.value = arr[0];
      this.model1 = arr[1];
      this.getShop();
      this.$refs.quickDate.getval(1);
    },
    methods: {
      //获取门店
      async getShop() {
        let data = {}
        let res = await goshop(data)
        if (res.code === 0) return this.Branchstore = [...this.Branchstore, ...res.data]
      },
      // 表格合计方式
      handleSummary({columns, data}) {
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
      summary({columns, data}) {
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
      summary1({columns, data}) {
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
        this.query();
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
        this.model3 = ''
        this.text = ''
        this.clientList = []
        this.Branchstore = []
        this.modal1 = true
        this.getShop()
      },
      // 更多条件查询
      async senior() {
        this.data1 = [];
        this.data2 = [];
        let obj = {
          orgId: this.model1,
          startDate: this.value[0]
            ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
            : "",
          endDate: this.value[1]
            ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
            : "",
          guestType: this.model2,
          tenantName: this.nametext,
          serviceType: this.model3,
          serviceId: this.text,
        };
        await this.getGeneral(obj);
        if (this.selectShopList) {
          await this.getShop();
          let arr = await creat(this.$refs.quickDate.val, this.$store);
          this.model1 = arr[1];
        }
      },
      // 查询应收/应付总表
      query() {
        this.data1 = [];
        this.data2 = [];
        let obj = {
          orgId: this.model1,
          startDate: this.value[0]
            ? moment(this.value[0]).format("YYYY-MM-DD") + " 00:00:00"
            : "",
          endDate: this.value[1]
            ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
            : "",
          guestId: this.guestId
        };
        this.getGeneral(obj);
      },
      // 应收应付接口
      getGeneral(obj) {
        if (obj.endDate) {
          obj.endDate = obj.endDate.split(' ')[0] + " 23:59:59"
        }
        this.data1Loading = true;
        this.data = [];
        this.copyData = [];
        this.pageObj.total = 0;
        this.pageObj.num = 1;
        showLoading(".loadingClass", "数据加载中，请勿操作")
        getreceivable(obj).then(res => {
          this.data1Loading = false;
          if (res.data.length !== 0) {
            //去除 已对账未收金额和已对账未付金额 同时为0
            let arrData = (res.data || []);
            arrData.map((item, index) => {
              item.num = index + 1;
              switch (item.belongSystem) {
                case 0:
                  item.guestTypeName = "华胜连锁";
                  break;
                case 1:
                  item.guestTypeName = "体系外";
                  break;
                case 2:
                  item.guestTypeName = "体系内";
                  break;
              }
            });
            // this.data = arrData;
            this.copyData = arrData
            this.pageObj.total = arrData.length;
            this.data = this.changePageList(this.pageObj.num, this.pageObj.size, this.copyData);

          }
          hideLoading()
        }).catch(e => {
          hideLoading()
        });
      },
      pageChange({type, currentPage, pageSize, $event}) {
        this.pageObj.num = currentPage;
        this.pageObj.size = pageSize;
        this.data = this.changePageList(currentPage, pageSize, this.copyData);
      },
      pageChange1({type, currentPage, pageSize, $event}) {
        this.pageObj1.num = currentPage;
        this.pageObj1.size = pageSize;
        this.data1 = this.changePageList(currentPage, pageSize, this.copyData1);
      },
      pageChange2({type, currentPage, pageSize, $event}) {
        this.pageObj2.num = currentPage;
        this.pageObj2.size = pageSize;
        this.data2 = this.changePageList(currentPage, pageSize, this.copyData2);
      },
      changePageList(currentPage, pageSize, sourceData) {
        let firstNum = pageSize * (currentPage - 1);
        let lastNum = firstNum + pageSize;
        let arrData = (sourceData || []).slice(firstNum, lastNum);
        return arrData || [];
      },
      // 销售/采购接口
      getDetailed(data, obj) {
        this.pageObj1.total = 0;
        this.pageObj1.num = 1;
        this.pageObj2.total = 0;
        this.pageObj2.num = 1;
        getSalelist({
          tenantId: data.tenantId,
          orgId: data.orgId,
          startDate: obj[0]
            ? moment(obj[0]).format("YYYY-MM-DD") + " 00:00:00"
            : "",
          endDate: obj[1]
            ? moment(obj[1]).format("YYYY-MM-DD") + " 23:59:59"
            : "",
          guestId: data.guestId
        }).then(res => {
          if (res.data.one) {

            let arrData = res.data.one.filter(item => item.noCharOffAmt != 0 || item.noAccountAmt != 0);

            arrData.map((item, index) => {
              item.num = index + 1;
              item.guestTypeName = item.guestType.name;
              item.serviceTypeName = item.serviceType.name;
              item.speciesName = item.species.name;
            });
            this.copyData1 = arrData;
            this.pageObj1.total = arrData.length;
            this.data1 = this.changePageList(this.pageObj1.num, this.pageObj1.size, this.copyData1);
          } else {
            this.data1 = [];
          }
          if (res.data.two) {
            let arrData2 = res.data.two.filter(item => item.noCharOffAmt != 0 || item.noAccountAmt != 0)
            arrData2.map((item, index) => {
              item.num = index + 1;
              item.guestTypeName = item.guestType.name;
              item.serviceTypeName = item.serviceType.name;
              item.speciesName = item.species.name;
            });
            this.copyData2 = arrData2;
            this.pageObj2.total = arrData2.length;
            this.data2 = this.changePageList(this.pageObj2.num, this.pageObj2.size, this.copyData2);
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
        // this.$refs.MonthlyreconciliatiTableSummaryon.modal = true;
        if (JSON.stringify(this.$refs.Monthlyreconciliation.parameter) !== "{}") {
          this.$refs.Monthlyreconciliation.modal = true;
          this.$refs.Monthlyreconciliation.data1 = [];
          this.$refs.Monthlyreconciliation.data2 = [];
        } else {
          this.$Message.warning("请选择要对账的数据");
        }
      },
      // 点击总汇表数据查询销售/采购清单
      selete({row}) {
        let date = {
          startDate: this.value[0]
            ? moment(this.value[0]).format("YYYY-MM-DD") + " 00:00:00"
            : "",
          endDate: this.value[1]
            ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
            : ""
        };
        this.selectTabJson = row;
        this.$refs.Monthlyreconciliation.parameter = {...row, ...date};
        this.getDetailed(row, this.value);
      },
      selectBox({selection}) {
        this.selectBoxList = selection;
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
        return {detailed};
      },
      // 导出汇总/全部
      exportSummary() {
        if (this.data.length !== 0) {
          let obj = {
            orgId: this.model1,
            startDate: this.value[0]
              ? moment(this.value[0]).format("YYYY-MM-DD") + " 00:00:00"
              : "",
            endDate: this.value[1]
              ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
              : "",
            guestId: this.guestId
          };
          let params = ""
          for (var i in obj) {
            params += `${i}=${obj[i]}&`
          }
          location.href = payColExportAll(params)
        } else {
          this.$message.error("应收应付汇总表暂无数据");
        }
      },
      //导出勾选
      exportList() {
        if (this.selectBoxList.length < 1) {
          return this.$Message.error("请勾选需要导出的数据")
        }
        let params = "";
        for (let i = 0; i < this.selectBoxList.length; i++) {
          params += `ids=${this.selectBoxList[i].id}&`
        }
        location.href = payColExportSelect(params);
      },
      // 当前标签页的name
      tabName(name) {
        this.detailedList = name;
      },
      // 导出单据
      exportBill() {
        if (this.data1.length < 1 && this.data2.length < 1) {
          return this.$message.error("暂无单据明细!")
        }
        let obj = {
          tenantId: this.selectTabJson.tenantId,
          orgId: this.selectTabJson.orgId,
          startDate: this.value[0]
            ? moment(this.value[0]).format("YYYY-MM-DD") + " 00:00:00"
            : "",
          endDate: this.value[1]
            ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
            : "",
          guestId: this.selectTabJson.guestId
        }
        let params = ""
        for (var i in obj) {
          params += `${i}=${obj[i]}&`
        }
        location.href = payColExportDetail(params)
      },
      // 出/入库明细导出
      exportDetail(type) {
        if (type == 0) {
          if (this.data3.length < 1) {
            return this.$Message.error("暂无数据可导出")
          }
          let obj = {
            orderCode: this.data3[0].orderCode,
            orderType: this.data3[0].orderType
          };
          let params = ""
          for (var i in obj) {
            params += `${i}=${obj[i]}&`
          }
          location.href = payColSelOrPurchaseExport(params)
        } else {
          if (this.data4.length < 1) {
            return this.$Message.error("暂无数据可导出")
          }
          let obj = {
            orderCode: this.data4[0].orderCode,
            orderType: this.data4[0].orderType
          };
          let params = ""
          for (var i in obj) {
            params += `${i}=${obj[i]}&`
          }
          location.href = payColSelOrPurchaseExport(params)
        }
      },
      // 打印
      print(type) {
        type ? (this.tit = "采购入库") : (this.tit = "销售出库");
        setTimeout(() => {
          let arr = {};
          if (this.tit === "销售出库") {
            arr = this.data3[0];
          } else if (this.tit === "采购入库") {
            arr = this.data4[0];
          }
          let order = {
            orderCode: arr.orderCode,
            orderType: arr.orderType,
            orgId: arr.orgId,
            guestId: arr.guestId,
            name: this.tit,
            id: "0",
            route: this.$route.name
          };
          let routeUrl = this.$router.resolve({name: "print", query: order})
          window.open(routeUrl.href, "_blank");
        }, 0)
      },
      //获取公司
      async getAllClient(query) {
        if (query !== '') {
          this.searchLoading = true;
          let req = {
            fullName: query,
            size: 20,
          }
          let rep = await findGuest(req);
          this.searchLoading = false;
          if (rep.code == 0) {
            this.clientList = rep.data.content;
          }
        } else {
          this.companyList = [];
        }
      },
      getAccountNameListFun(v) {
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
