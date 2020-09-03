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
            <Select v-model="model1" class="w150" @on-change="getGeneral" :disabled="selectShopList">
              <Option
                v-for="item in Branchstore"
                :value="item.id"
                :key="item.id"
              >{{ item.shortName}}</Option>
            </Select>
          </div>
          <div class="db ml20">
            <span>客户名称：</span>
            <input type="text" class="h30" v-model="company" readonly/>
            <i class="iconfont iconcaidan input" @click="Dealings"></i>
          </div>
          <div class="db">
            <span>类型：</span>
            <Select v-model="typeName" style="width:200px" @on-change="type">
              <Option
                v-for="item in typelist"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db ml5">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="query">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
          <div class="db ml10">
            <Poptip placement="bottom">
              <button class="mr10 ivu-btn ivu-btn-default" type="button" v-has="'export'">导出</button>
              <div slot="content">
                <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="report(0)">导出汇总</button>
                <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="report(1)">导出配件明细</button>
              </div>
            </Poptip>
          </div>
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
          :summary-method="handleSummary"
          highlight-row
          @on-row-click="election"
          max-height="400"
        ></Table>
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
        <Table
          border
          :columns="columns1"
          :data="data1"
          class="mt10"
          ref="parts"
          show-summary
          :summary-method="summary"
          max-height="400"
        ></Table>
      </div>
    </section>
    <selectDealings ref="selectDealings" @getOne="getOne" />
  </div>
</template>

<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import selectDealings from "./components/SelectTheCustomer";
import { creat } from "./../components";
import {
  getWarehousingList,
  getWarehousingPart,
  getOutStockList,
  getOutStockPart
} from "@/api/bill/saleOrder";
import { goshop } from '@/api/settlementManagement/shopList';
import moment from "moment";
export default {
  name: "billStock",
  components: {
    quickDate,
    selectDealings
  },
  data() {
    return {
      value: [],
      Branchstore: [
        {id:"",name:'全部'}
      ], //分店名称
      page:{
        total:0,
        sizeArr:[10,20,30,40,50],
        size:10,
        num:1
      },
      total:{},//合计数据对象
      model1: "",
      modal1: false,
      columns: [
        {
          key: "index",
          title: "序号",
          width: 40,
          className: "tc"
        },
        {
          title: "分店名称",
          key: "guestOrgName",
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
          width: 70
        },
        {
          title: "销售类别",
          key: "orderType",
          className: "tc",
          width: 70
        },
        {
          title: "仓库",
          key: "storeName",
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
                  title: params.row.createUname
                }
              }, params.row.createUname)
            ])
          }
        },
        {
          title: "制单日期",
          key: "createTime",
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
                  title: params.row.createTime
                }
              }, params.row.createTime)
            ])
          }
        },
        {
          title: "审核日期",
          key: "createTime",
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
          width: 90,
        },
        {
          title: "单据状态",
          key: "accountSign",
          className: "tc",
          width: 80
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
          title: "退货原因",
          key: "rtnReasonName",
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
                  title: params.row.rtnReasonName
                }
              }, params.row.rtnReasonName)
            ])
          }
        }
      ],
      columns1: [
        {
          key: "index",
          title: "序号",
          width: 40,
          className: "tc"
        },
        {
          title: "配件编码",
          key: "partCode",
          className: "tc"
        },
        {
          title: "配件名称",
          key: "partName",
          width: 120,
          className: "tc"
        },
        {
          title: "品牌",
          key: "partBrand",
          className: "tc",
          width: 80,
        },
        {
          title: "车型",
          key: "carModelName",
          className: "tc"
        },
        {
          title: "OEM码",
          key: "oemCode",
          className: "tc"
        },
        {
          title: "是否含税",
          key: "taxSign",
          className: "tc",
          width: 70,
        },
        {
          title: "不含税单价",
          key: "noTaxPrice",
          className: "tc",
          width: 80,
          render: (h, params) => {
            return h("span", params.row.noTaxPrice.toFixed(2));
          }
        },
        {
          title: "不含税金额",
          key: "noTaxAmt",
          className: "tc",
          width: 80,
          render: (h, params) => {
            return h("span", params.row.noTaxAmt.toFixed(2));
          }
        },
        {
          title: "含税单价",
          key: "taxPrice",
          className: "tc",
          width: 70,
          render: (h, params) => {
            return h("span", params.row.taxPrice.toFixed(2));
          }
        },
        {
          title: "含税金额",
          key: "taxAmt",
          className: "tc",
          width: 80,
          render: (h, params) => {
            return h("span", params.row.taxAmt.toFixed(2));
          }
        },
        {
          title: "数量",
          key: "sellQty",
          className: "tc",
          width: 70,
        },
        {
          title: "单价",
          key: "sellPrice",
          className: "tc",
          width: 80,
          render: (h, params) => {
            if(this.typeName === "050202") {
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
          width: 80,
          render: (h, params) => {
            if(this.typeName === "050202") {
              return h("span", params.row.sellAmt.toFixed(2));
            } else {
              return h("span", params.row. rtnAmt.toFixed(2));
            }
          }
        },
        {
          title: "供应商",
          key: "guestName",
          className: "tc",
          width: 80
        }
      ],
      data: [],
      data1: [],
      typelist: [
        {
          value: "050202",
          label: "销售出库"
        },
        {
          value: "050102",
          label: "销售退货"
        }
      ],
      typeName: "050202",
      company: "", //往来单位
      companyId: "" //往来单位id
    };
  },
  async mounted() {
    this.getShop()
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
    //获取门店
    async getShop(){
      let data ={}
      let res = await goshop(data)
      if (res.code === 0) return this.Branchstore = [...this.Branchstore , ...res.data]
    },
    // 日期选择
    dateChange(data) {
      this.value = data;
      this.getGeneral()
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
    // 配件表格合计方式
    summary({ columns, data }) {
      const sums = {};
      columns.forEach((column, index) => {
        let key = column.key;
        if(this.typeName == "050102") {
          if (key == "sellAmt") {
            key = "rtnAmt";
          }
          if (key == "sellPrice") {
            key = "rtnPrice";
          }
          column.key = key;
        }
        if (index === 0) {
          sums[key] = {
            key,
            value: "合计"
          };
          return;
        }
        if(key=="guestName") {
          sums[key] = {
            key,
            value: " "
          };
          return;
        }
        const values = data.map(item => Number(item[key]));
        if (index > 6 && index !== 11) {
          if (!values.every(value => isNaN(value))) {
            const v = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return parseFloat(prev.toFixed(2)) + parseFloat(curr.toFixed(2))
              } else {
                return prev;
              }
            }, 0);
            sums[key] = {
              key,
              value: v.toFixed(2)
            };
          }
        } else if (index === 11) {
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
        }else {
          sums[key] = {
            key,
            value: " "
          };
        }
      });
      return sums;
      //
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
      this.getGeneral()
    },
    // 快速查询
    async quickDate(data) {
      if(this.model1==""){
        let arr = await creat(this.$refs.quickDate.val, this.$store);
        this.model1 = arr[1];
        this.value = arr[0];
        this.getGeneral();
      }else{
        this.value = data;
        this.getGeneral();
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
      if (type) {
        if (this.data1.length !== 0) {
          this.$refs.parts.exportCsv({
            filename: "销售出库汇总-配件信息"
          });
        } else {
          this.$message.error("销售出库汇总-配件信息暂无数据");
        }
      } else {
        let page={}
        page.size=this.page.total;
        page.num=1
        if (this.data.length !== 0) {
          this.getGeneralAll(page)
        } else {
          this.$message.error("销售出库汇总暂无数据");
        }
      }
    },
    // 类型
    type(value) {
      this.typeName = value;
      this.getGeneral()
    },
    // 总表查询
    getGeneralAll(param) {
      this.data1 = [];
      let obj = {
        orgid: this.model1,
        guestId: this.companyId,
        enterTypeId: this.typeName
      };
      let params={
        size: param.size,
        page: param.num - 1
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
        getOutStockList(params,obj).then(res => {
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
            if(this.data.length==params.size){
              this.data = res.data.vos;
              this.$refs.summary.exportCsv({
                types: ["csv"],
                filename: "销售出库汇总",
                columns:this.columns,
                data: res.data.vos,
              });
            }
          } else {
            this.data = [];
          }
        });
      } else if (this.typeName === "050102") {
        (obj.enterDateStart = this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
          : ""),
          (obj.enterDateEnd = this.value[1]
            ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
            : ""),
          getWarehousingList(params,obj).then(res => {
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
              if(this.data.length==params.size){
                this.data = res.data.vos;
                this.$refs.summary.exportCsv({
                  types: ["csv"],
                  filename: "销售出库汇总",
                  columns:this.columns,
                  data: res.data.vos,
                });
              }
            } else {
              this.data = [];
            }
          });
      }
    },
    // 总表查询
    getGeneral() {
      this.data1 = [];
      let obj = {
        orgid: this.model1,
        guestId: this.companyId,
        enterTypeId: this.typeName
      };
      let params={
        size: this.page.size,
        page: this.page.num - 1
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
          getOutStockList(params,obj).then(res => {
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
              this.page.total=res.data.TotalElements;
              this.total=res.data.AllotOutMainVO
            } else {
              this.data = [];
            }
          });
      } else if (this.typeName === "050102") {
        (obj.enterDateStart = this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
          : ""),
          (obj.enterDateEnd = this.value[1]
            ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
            : ""),
          getWarehousingList(params,obj).then(res => {
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
              this.page.total=res.data.TotalElements;
              this.total=res.data.AllotOutMainVO
            } else {
              this.data = [];
            }
          });
      }
    },
    // 选中总表查询明细
    election(row) {
      if (this.typeName === "050102") {
        getWarehousingPart({ mainId: row.id }).then(res => {
          // console.log(res);
          if (res.data.length !== 0) {
            res.data.map((item, index) => {
              item.taxSign = item.taxSign ? "是" : "否";
              item.index = index + 1;
            });
            this.data1 = res.data;
          } else {
            this.data1 = [];
          }
        });
      } else {
        getOutStockPart({ mainId: row.id }).then(res => {
          if (res.data.length !== 0) {
            res.data.map((item, index) => {
              item.taxSign = item.taxSign ? "是" : "否";
              item.index = index + 1;
            });
            this.data1 = res.data;
          } else {
            this.data1 = [];
          }
        });
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
