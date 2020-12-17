<template>
  <div class="content-oper content-oper-flex loadingClass">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <!--<span>快速查询：</span>-->
            <quickDate class="mr10" ref="quickDate" @quickDate="quickDate"></quickDate>
          </div>
          <div class="db ml20">
            <span>制单日期：</span>
            <Date-picker
              :value="value"
              type="daterange"
              placeholder="选择日期"
              class="w200"
              @on-change="dateChange"
            ></Date-picker>
          </div>
          <div class="db ml20">
            <span>分店名称：</span>
            <Select v-model="model1" class="w150" @on-change="changePage(1)" :disabled="selectShopList">
              <Option
                v-for="item in Branchstore"
                :value="item.id"
                :key="item.id"
              >{{ item.shortName}}
              </Option>
            </Select>
          </div>
          <div class="db ml20">
            <span>客户名称：</span>
            <Input type="text" class="w200" v-model="company" readonly clearable/>
            <i class="iconfont iconcaidan input" @click="Dealings"></i>
          </div>
          <div class="db mr10">
            <span>类型：</span>
            <Select v-model="typeName" style="width:200px" @on-change="changePage(1)">
              <Option
                v-for="item in typelist"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}
              </Option>
            </Select>
          </div>
          <div class="db mr10">
            <Input
              v-model="partCodeOrName"
              placeholder="配件编码/名称"
              class="w200"
              clearable
            />
          </div>
          <div class="db ml5">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="changePage(1)">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
<!--          <div class="db ml10">-->
<!--            <Poptip placement="bottom">-->
<!--              <button class="mr10 ivu-btn ivu-btn-default" type="button" v-has="'export'">导出</button>-->
<!--              <div slot="content">-->
<!--                <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="report(0)">导出全部</button>-->
<!--                <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="report(1)">导出勾选</button>-->
<!--              </div>-->
<!--            </Poptip>-->
<!--          </div>-->
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <Table
          border
          :columns="columns"
          :data="data"
          ref="summary"
          show-summary
          :summary-method="summaryMethod"
          highlight-row
          @on-row-click="election"
          @on-selection-change="selectTab"
          @on-select-all="selectTab"
          max-height="400"
        ></Table>
        <!--        :summary-method="handleSummary"-->
        <div class="clearfix">
          <Page
            class-name="fr mb10 mt10"
            size="small"
            :current="page.num"
            :total="page.total"
            :page-size="page.size"
            :page-size-opts="page.sizeArr"
            @on-change="changePage"
            @on-page-size-change="changeSize"
            show-sizer
            show-total
          ></Page>
        </div>
        <button class="mt10 ivu-btn ivu-btn-default" type="button">配件明细</button>
<!--        <Table-->
<!--          border-->
<!--          :columns="columns1"-->
<!--          :data="data1"-->
<!--          class="mt10"-->
<!--          ref="parts"-->
<!--          show-summary-->
<!--          :summary-method="summary"-->
<!--          max-height="400"-->
<!--        ></Table>-->
        <vxe-table
          border
          auto-resize
          resizable
          stripe
          align="center"
          show-overflow="title"
          size="mini"
          :data="data1"
          :loading="detailLoading"
          class="mt10"
          max-hight="400"
          :footer-method="summary"
          ref="parts"
          show-footer
        >
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column title="分店名称" field="shortName" width="60"></vxe-table-column>
          <vxe-table-column title="出库/入库单号" field="serviceId" width="100"></vxe-table-column>
          <vxe-table-column title="出库/入库日期" field="outDate" width="100"></vxe-table-column>
          <vxe-table-column title="客户/供应商" field="entenrGuestName" width="100"></vxe-table-column>
          <vxe-table-column title="制单人" field="orderMan" width="80"></vxe-table-column>
          <vxe-table-column title="数量" field="sellQty" width="80"></vxe-table-column>
          <vxe-table-column title="单价" field="sellPrice" width="60"></vxe-table-column>
          <vxe-table-column title="金额" field="sellAmt" width="60"></vxe-table-column>
          <vxe-table-column title="单位" field="unit" width="60"></vxe-table-column>
          <vxe-table-column title="配件名称" field="partName" width="80"></vxe-table-column>
          <vxe-table-column title="配件编码" field="partCode" width="80"></vxe-table-column>
          <vxe-table-column title="OE码" field="oemCode" width="80"></vxe-table-column>
          <vxe-table-column title="品牌" field="partBrand" width="100"></vxe-table-column>
          <vxe-table-column title="品牌车型" field="carModelName" width="100"></vxe-table-column>
          <vxe-table-column title="规格" field="spec" width="60"></vxe-table-column>
          <vxe-table-column title="配件明细备注" field="detailRemark" width="100"></vxe-table-column>
          <vxe-table-column title="订单类型" field="orderType" width="110"></vxe-table-column>
          <vxe-table-column title="票据类型" field="billTypeIdName" width="100"></vxe-table-column>
          <vxe-table-column title="结算方式" field="settleTypeIdName" width="100"></vxe-table-column>
          <vxe-table-column title="仓库" field="storeName" width="80"></vxe-table-column>
          <vxe-table-column title="订单号" field="code" width="100"></vxe-table-column>
          <vxe-table-column title="提交人" field="auditor" width="100"></vxe-table-column>
          <vxe-table-column title="提交日期" field="auditDate" width="110"></vxe-table-column>
          <vxe-table-column title="退货原因" field="rtnReasonName" width="120"></vxe-table-column>
          <vxe-table-column title="订单备注" field="mainRemark" width="120"></vxe-table-column>
        </vxe-table>
      </div>
    </section>
    <!--打印 销售出库-->
    <stockPrint ref="stockPrint"></stockPrint>
    <!--打印 销售退货-->
    <stockReturnPrint ref="stockReturnPrint"></stockReturnPrint>
    <selectDealings ref="selectDealings" @getOne="getOne"/>
  </div>
</template>

<script>
  import quickDate from "@/components/getDate/dateget_bill.vue";
  import selectDealings from "./components/SelectTheCustomer";
  //打印 销售出库
  import stockPrint from "./components/printShow/stockPrint";
  import stockReturnPrint from "./components/printShow/stockReturnPrint";
  import {creat} from "./../components";
  import {
    getWarehousingList,
    getWarehousingPart,
    getOutStockList,
    getOutStockPart,
    getAllList
  } from "@/api/bill/saleOrder";
  import {
    stockExport/**销售出库 导出全部及导出勾选*/,
    stockReturnExport/**销售退货 导出全部及导出勾选*/
  } from "@/api/settlementManagement/Import/index.js"
  import {goshop} from '@/api/settlementManagement/shopList';
  import moment from "moment";
  import {showLoading, hideLoading} from "@/utils/loading"

  export default {
    name: "billStock",
    components: {
      quickDate,
      selectDealings,
      stockPrint,//打印 销售出库
      stockReturnPrint,//打印 销售退货
    },
    data() {
      return {
        value: [],
        Branchstore: [
          {id: "0", shortName: '全部'}
        ], //分店名称
        page: {
          total: 0,
          sizeArr: [10, 20, 30, 40, 50],
          size: 10,
          num: 1
        },
        total: {},//合计数据对象
        model1: "",
        modal1: false,
        partCodeOrName:'',
        columns: [
          {
            type: 'selection',
            width: 40,
            className: "tc",
            resizable: true,
          },
          {
            key: "index",
            title: "序号",
            width: 40,
            className: "tc",
            resizable: true,
          },
          {
            title: "操作",
            width: 60,
            className: "tc",
            resizable: true,
            render:(h,params)=>{
              return h('div', [
                h('span', {
                  style: {
                    color: "#40a6ff",
                    cursor: "pointer"
                  },
                  domProps: {
                    title: "打印"
                  },
                  on:{
                    click:async ()=>{
                      if(params.row.enterTypeIdName=="销售出库"){
                        this.$refs.stockPrint.openModal(params.row)
                      }else if(params.row.enterTypeIdName=="销售退货"){
                        this.$refs.stockReturnPrint.openModal(params.row)
                      }
                    }
                  }
                }, "打印")
              ])
            }
          },
          {
            title: "分店名称",
            key: "guestOrgName",
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
                    title: params.row.guestOrgName
                  }
                }, params.row.guestOrgName)
              ])
            }
          },
          {
            title: "出库单号",
            key: "code",
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
                    title: params.row.code
                  }
                }, params.row.code)
              ])
            }
          },
          {
            title: "客户名称",
            key: "guestName",
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
                    title: params.row.guestName
                  }
                }, params.row.guestName)
              ])
            }
          },
          {
            title: "订单号",
            key: "orderCode",
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
                    title: params.row.orderCode
                  }
                }, params.row.orderCode)
              ])
            }
          },
          {
            title: "单据类型",
            key: "enterTypeIdName",
            className: "tc",
            resizable: true,
            width: 100
          },
          {
            title: "销售类别",
            key: "orderType",
            className: "tc",
            resizable: true,
            width: 100
          },
          {
            title: "仓库",
            key: "storeName",
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
                    title: params.row.storeName
                  }
                }, params.row.storeName)
              ])
            }
          },
          {
            title: "制单人",
            key: "createUname",
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
                    title: params.row.createUname
                  }
                }, params.row.createUname)
              ])
            }
          },
          {
            title: "制单日期",
            key: "auditDate",
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
                    title: params.row.auditDate
                  }
                }, params.row.auditDate)
              ])
            }
          },
          {
            title: "审核日期",
            key: "createTime",
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
                    title: params.row.createTime
                  }
                }, params.row.createTime)
              ])
            }
          },
          {
            title: "金额",
            key: "outAmt",
            className: "tc",
            resizable: true,
            width: 90,
          },
          {
            title: "单据状态",
            key: "accountSign",
            className: "tc",
            resizable: true,
            width: 100
          },
          {
            title: "备注",
            key: "remark",
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
                    title: params.row.remark
                  }
                }, params.row.remark)
              ])
            }
          },
          {
            title: "退货原因",
            key: "rtnReasonName",
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
                    title: params.row.rtnReasonName
                  }
                }, params.row.rtnReasonName)
              ])
            }
          }
        ],
        selectTabArr: [],
        columns1: [
          {
            key: "index",
            title: "序号",
            width: 40,
            className: "tc",
            resizable: true,
          },
          {
            title: "配件编码",
            key: "partCode",
            className: "tc",
            width: 150,
            resizable: true,
          },
          {
            title: "配件名称",
            key: "partName",
            width: 150,
            className: "tc",
            resizable: true,
          },
          {
            title: "品牌",
            key: "partBrand",
            className: "tc",
            resizable: true,
            width: 150,
          },
          {
            title: "车型",
            key: "carModelName",
            className: "tc",
            width: 150,
            resizable: true,
          },
          {
            title: "OEM码",
            key: "oemCode",
            className: "tc",
            width: 150,
            resizable: true,
          },
          {
            title: "是否含税",
            key: "taxSign",
            className: "tc",
            resizable: true,
            width: 100,
          },
          {
            title: "不含税单价",
            key: "noTaxPrice",
            className: "tc",
            resizable: true,
            width: 150,
            render: (h, params) => {
              return h("span", params.row.noTaxPrice);
            }
          },
          {
            title: "不含税金额",
            key: "noTaxAmt",
            className: "tc",
            resizable: true,
            width: 150,
            render: (h, params) => {
              return h("span", params.row.noTaxAmt.toFixed(2));
            }
          },
          {
            title: "含税单价",
            key: "taxPrice",
            className: "tc",
            resizable: true,
            width: 100,
            render: (h, params) => {
              return h("span", params.row.taxPrice.toFixed(2));
            }
          },
          {
            title: "含税金额",
            key: "taxAmt",
            className: "tc",
            resizable: true,
            width: 100,
            render: (h, params) => {
              return h("span", params.row.taxAmt.toFixed(2));
            }
          },
          {
            title: "数量",
            key: "sellQty",
            className: "tc",
            resizable: true,
            width: 80,
          },
          {
            title: "单价",
            key: "sellPrice",
            className: "tc",
            resizable: true,
            width: 80,
            render: (h, params) => {
              if (this.typeName === "050202") {
                return h("span", params.row.sellPrice.toFixed(2));
              } else {
                return h("span", params.row.rtnPrice.toFixed(2));
              }
            }
          },
          {
            title: "金额",
            key: "sellAmt",
            className: "tc",
            resizable: true,
            width: 100,
            render: (h, params) => {
              if (this.typeName === "050202") {
                return h("span", params.row.sellAmt.toFixed(2));
              } else {
                return h("span", params.row.rtnAmt.toFixed(2));
              }
            }
          },
          {
            title: "供应商",
            key: "guestName",
            className: "tc",
            resizable: true,
            width: 150
          }
        ],
        data: [],
        data1: [],
        detailLoading:false,
        typelist: [
          {
            value:'0',
            label:'全部'
          },
          {
            value: "050202",
            label: "销售出库"
          },
          {
            value: "050102",
            label: "销售退货"
          },
        ],
        typeName: "050202",
        company: "", //往来单位
        companyId: "" //往来单位id
      };
    },
    async mounted() {
      this.getShop()
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
      //获取门店
      async getShop() {
        let data = {}
        let res = await goshop(data)
        if (res.code === 0) return this.Branchstore = [...this.Branchstore, ...res.data]
      },
      // 日期选择
      dateChange(data) {
        this.value = data;
        this.changePage(1)
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
              value: "总合计"
            };
            return;
          }
          const values = data.map(item => Number(item[key]));
          if (index === 11) {
            sums[key] = {
              key,
              value: this.total[key] == null ? " " : this.total[key]
            };
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
      summaryMethod({columns,data}){
        const sums = {};
        columns.forEach((column, index) => {
          const key = column.key;
          if (index === 1) {
            sums[key] = {
              key,
              value: "合计"
            };
            return;
          }
          const values = (data || []).map(item => Number(item[key]));
          if (index === 13) {
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
      // 配件表格合计方式
      summary({columns, data}) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return "合计";
            }
            if (
              [
                "sellQty",
                "sellPrice",
                "sellAmt",
              ].includes(column.property)
            ) {
              return this.$utils.sum(data, column.property);
            }
            return null;
          }),]
      },
      selectTab(selection) {
        this.selectTabArr = selection
      },
      //查询
      query() {
        this.data1 = [];
        this.getGeneral();
      },
      // 往来单位选择
      getOne(data) {
        this.company = data.fullName;
        this.companyId = data.id;
        this.changePage(1)
      },
      // 快速查询
      async quickDate(data) {
        if (this.model1 == "") {
          let arr = await creat(this.$refs.quickDate.val, this.$store);
          this.model1 = arr[1];
          this.value = arr[0];
          this.changePage(1)
        } else {
          this.value = data;
          this.changePage(1)
        }
      },
      changePage(p) {
        this.page.num = p;
        this.getGeneral();
      },
      changeSize(size) {
        this.page.num = 1;
        this.page.size = size;
        this.getGeneral();
      },
      // 往来单位
      Dealings() {
        this.$refs.selectDealings.addressShow = true;
      },
      // 导出汇总/配件明细
      report(type) {
        if (this.data.length < 1) {
          return this.$Message.error("暂无数据可导出!")
        }
        if (type == 0) {
          //全部
          let params = "";
          let obj = {
            orgid: this.model1 == "0" ? "" : this.model1,
            guestId: this.company ? this.companyId : "",
            enterTypeId: this.typeName,
            outDateStart: this.value[0] ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss") : "",
            outDateEnd: this.value[1] ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59" : "",
            pagesize: this.page.total,
          };
          for (var i in obj) {
            params += `${i}=${obj[i]}&`
          }
          if (this.typeName == "050202") {
            location.href = stockExport(params);
          } else {
            location.href = stockReturnExport(params);
          }
        } else {
          //勾选
          if (this.selectTabArr.length < 1) {
            return this.$Message.error("请勾选需要导出的数据!")
          }
          let params = ""
          let str = ""
          this.selectTabArr.map(vb => {
            str += `ids=${vb.id}&`
          })
          params = `${str}pagesize=${this.selectTabArr.length}&enterTypeId=${this.typeName}&`
          if (this.typeName == "050202") {
            location.href = stockExport(params);
          } else {
            location.href = stockReturnExport(params);
          }
        }
      },
      // 类型
      type(value) {
        this.typeName = value;
        this.getGeneral()
      },
      // 总表查询
      getGeneral() {
        this.data1 = [];
        let obj = {
          orgid: this.model1 == "0" ? "" : this.model1,
          guestId: this.company ? this.companyId : "",
          enterTypeId: this.typeName
        };
        let params = {
          size: this.page.size,
          page: this.page.num - 1
        }
        if(this.partCodeOrName){
          obj.partCode = this.partCodeOrName;
        }
        if (this.typeName === "050202") {
          obj.outDateStart = this.value[0]
            ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
            : ""
          obj.outDateEnd = this.value[1]
            ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
            : ""
          if (obj.outDateEnd) {
            obj.outDateEnd = obj.outDateEnd.split(' ')[0] + " 23:59:59"
          }
          showLoading(".loadingClass", "数据加载中，请勿操作")
          getOutStockList(params, obj).then(res => {
            if (res.data.vos.length !== 0) {
              res.data.vos.map((item, index) => {
                item.index = index + 1;
                item.accountSign = item.billStatusId ? "已出库" : "草稿";
                item.orderType = item.orderType
                  ? item.orderType === 1
                    ? "电商订单"
                    : "华胜订单"
                  : "销售开单";
              });
              this.data = res.data.vos;
              this.page.total = res.data.TotalElements;
              // this.total=res.data.AllotOutMainVO
              hideLoading()
            } else {
              hideLoading()
              this.data = [];
            }
          }).catch(e => {
            hideLoading()
          });
        } else if (this.typeName === "050102") {
          (obj.enterDateStart = this.value[0]
            ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
            : ""),
            (obj.enterDateEnd = this.value[1]
              ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
              : ""),
            getWarehousingList(params, obj).then(res => {
              if (res.data.vos.length !== 0) {
                res.data.vos.map((item, index) => {
                  item.index = index + 1;
                  item.accountSign = item.billStatusId ? "已入库" : "草稿";
                  item.orderType = item.orderType
                    ? item.orderType === 1
                      ? "电商订单"
                      : "华胜订单"
                    : "销售开单";
                });
                this.data = res.data.vos;
                this.page.total = res.data.TotalElements;
              } else {
                this.data = [];
              }
            });
        }else if (this.typeName === "0"){
          obj.outDateStart = this.value[0]
            ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
            : ""
          obj.outDateEnd = this.value[1]
            ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
            : ""
          if (obj.outDateEnd) {
            obj.outDateEnd = obj.outDateEnd.split(' ')[0] + " 23:59:59"
          }
          params.orderTypeId = this.typeName
          showLoading(".loadingClass", "数据加载中，请勿操作")
          getAllList(params, obj).then(res => {
            if (res.data.vos.length !== 0) {
              res.data.vos.map((item, index) => {
                item.index = index + 1;
                item.accountSign = item.billStatusId ? "已出库" : "草稿";
                item.orderType = item.orderType
                  ? item.orderType === 1
                    ? "电商订单"
                    : "华胜订单"
                  : "销售开单";
              });
              this.data = res.data.vos;
              this.page.total = res.data.TotalElements;
              // this.total=res.data.AllotOutMainVO
              hideLoading()
            } else {
              hideLoading()
              this.data = [];
            }
          }).catch(e => {
            hideLoading()
          });
        }
      },
      // 选中总表查询明细
      election(row) {
        this.detailLoading=true;
        if (this.typeName === "050102" || row.enterTypeId=="050102") {
          getWarehousingPart({mainId: row.id}).then(res => {
            // console.log(res);
            if (res.data.length !== 0) {
              this.data1 = res.data.map((item, index) => {
                item.taxSign = item.taxSign ? "是" : "否";
                item.index = index + 1;
                item.orderType = item.orderTypeIdName;
                item.outDate=item.enterDate;
                item.sellQty=item.orderQty;
                item.sellPrice=item.orderPrice;
                item.sellAmt=item.orderAmt;
                item.entenrGuestName=item.guestFullName;
                item.orderType=item.orderTypeIdName;
                return item;
              });
              this.detailLoading=false;
            } else {
              this.data1 = [];
              this.detailLoading=false;
            }
          }).catch(err=>{
            this.detailLoading=false;
          })
        } else {
          getOutStockPart({mainId: row.id}).then(res => {
            if (res.data.length !== 0) {
              this.data1 =res.data.map((item, index) => {
                item.taxSign = item.taxSign ? "是" : "否";
                item.index = index + 1;
                return item;
              });
              this.detailLoading=false;
            } else {
              this.data1 = [];
              this.detailLoading=false;
            }
          }).catch(err=>{
            this.detailLoading=false;
          })
        }
      }
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
</style>
