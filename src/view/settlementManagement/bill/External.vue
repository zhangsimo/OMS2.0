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
            <Select v-model="model1" class="w150" filterable @on-change="getGeneral" :disabled="selectShopList">
              <Option
                v-for="item in Branchstore"
                :value="item.id"
                :key="item.id"
              >{{ item.shortName }}
              </Option>
            </Select>
          </div>
          <div class="db ml20">
            <span>供应商：</span>
            <Input type="text" class="w200" v-model="company" readonly clearable/>
            <i class="iconfont iconcaidan input" @click="Dealings"></i>
          </div>
          <div class="db">
            <span>类型：</span>
            <Select v-model="type" style="width:200px" @on-change="getGeneral">
              <Option
                v-for="item in typelist"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}
              </Option>
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
                <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="report(0)">导出全部</button>
                <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="report(1)">导出勾选</button>
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
    <selectDealings ref="selectDealings" @selectSearchName="getOne"/>
  </div>
</template>

<script>
  import quickDate from "@/components/getDate/dateget_noEmit.vue";
  import selectDealings from "./components/selectCompany";
  import {creat} from "./../components";
  import {
    getWarehousingList,
    getWarehousingPart,
    getOutStockList,
    getOutStockPart
  } from "@/api/bill/saleOrder";
  import {goshop} from '@/api/settlementManagement/shopList';
  import {
    enteralExport/**采购入库 导出全部及导出勾选*/,
    enteralReturnExport/**采购退货 导出全部及导出勾选*/
  } from "@/api/settlementManagement/Import/index.js"
  import moment from "moment";
  import {showLoading, hideLoading} from "@/utils/loading"

  export default {
    name: "billExternal",
    components: {
      quickDate,
      selectDealings
    },
    data() {
      return {
        value: [],
        Branchstore: [
          {id: 0, shortName: '全部'}
        ], //分店名称
        page: {
          total: 0,
          sizeArr: [10, 20, 30, 40, 50],
          size: 10,
          num: 1
        },
        total: {},//总合计对象
        model1: "",
        modal1: false,
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
            title: "分店名称",
            key: "guestOrgName",
            width: 150,
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
                    title: params.row.guestOrgName
                  }
                }, params.row.guestOrgName)
              ])
            }
          },
          {
            title: "单号",
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
            title: "供应商",
            key: "guestName",
            width: 150,
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
            title: "订单号",
            key: "orderCode",
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
            width: 80
          },
          {
            title: "仓库",
            key: "storeName",
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
            title: "审核日期",
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
            title: "是否含税",
            key: "taxSign",
            className: "tc",
            resizable: true,
            width: 70
          },
          {
            title: "金额",
            key: "outAmt",
            className: "tc",
            resizable: true,
            width: 90
          },
          {
            title: "单据状态",
            key: "auditSign",
            className: "tc",
            resizable: true,
            width: 80
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
            width: 150
          },
        ],
        selectTabArr: [],//选中数组
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
            tooltip: true,
            className: "tc",
            width: 150,
            resizable: true,
          },
          {
            title: "配件名称",
            key: "partName",
            width: 120,
            tooltip: true,
            className: "tc",
            resizable: true,
          },
          {
            title: "品牌",
            key: "partBrand",
            tooltip: true,
            className: "tc",
            width: 150,
            resizable: true,
          },
          {
            title: "车型",
            key: "carModelName",
            tooltip: true,
            className: "tc",
            width: 150,
            resizable: true,
          },
          {
            title: "OEM码",
            key: "oemCode",
            tooltip: true,
            className: "tc",
            width: 150,
            resizable: true,
          },
          {
            title: "是否含税",
            key: "taxSign",
            className: "tc",
            width: 150,
            resizable: true,
          },
          {
            title: "不含税单价",
            key: "noTaxPrice",
            className: "tc",
            width: 150,
            resizable: true,
            render: (h, params) => {
              return h("span", params.row.noTaxPrice.toFixed(2));
            }
          },
          {
            title: "不含税金额",
            key: "noTaxAmt",
            className: "tc",
            width: 150,
            resizable: true,
            render: (h, params) => {
              return h("span", params.row.noTaxAmt.toFixed(2));
            }
          },
          {
            title: "含税单价",
            key: "taxPrice",
            className: "tc",
            width: 150,
            resizable: true,
            render: (h, params) => {
              return h("span", params.row.taxPrice.toFixed(2));
            }
          },
          {
            title: "含税金额",
            key: "taxAmt",
            className: "tc",
            width: 150,
            resizable: true,
            render: (h, params) => {
              return h("span", params.row.taxAmt.toFixed(2));
            }
          },
          {
            title: "数量",
            key: "enterQty",
            className: "tc",
            width: 150,
            resizable: true,
            render: (h, params) => {
              let qty = params.row.enterQty ? params.row.enterQty : params.row.rtnableQty
              return h("span", qty);
            }
          },
          {
            title: "单价",
            key: "enterPrice",
            className: "tc",
            width: 150,
            resizable: true,
            render: (h, params) => {
              return h("span", params.row.enterPrice.toFixed(2));
            }
          },
          {
            title: "金额",
            key: "sellAmt",
            className: "tc",
            width: 150,
            resizable: true,
            render: (h, params) => {
              return h("span", params.row.sellAmt.toFixed(2));
            }
          }
        ],
        data: [],
        data1: [],
        typelist: [
          {
            value: "050101",
            label: "采购入库"
          },
          {
            value: "050201",
            label: "采购退货"
          }
        ],
        type: "050101",
        company: "", //往来单位
        companyId: "" //往来单位id
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
      let arr = await creat(this.$refs.quickDate.val, this.$store);
      this.value = arr[0];
      this.model1 = arr[1];
      this.getShop()
      this.$refs.quickDate.getval(1);
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
        this.getGeneral()
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
      summary({columns, data}) {
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
          if (index > 6 && index !== 11) {
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
      //查询
      query() {
        this.data1 = [];
        this.getGeneral();
      },
      changePage(p) {
        this.page.num = p;
        this.query();
      },
      changeSize(size) {
        this.page.num = 1;
        this.page.size = size;
        this.query();
      },
      selectTab(selection) {
        this.selectTabArr = selection
      },
      // 往来单位选择
      getOne(data) {
        this.company = data.fullName;
        this.companyId = data.id;
        this.getGeneral()
      },
      // 快速查询
      quickDate(data) {
        this.value = data;
        this.getGeneral();
      },
      // 往来单位
      Dealings() {
        this.$refs.selectDealings.init();
      },
      // 导出全部/勾选
      report(type) {
        if (this.data.length < 1) {
          return this.$Message.error("暂无数据可导出!")
        }
        if (type == 0) {
          //导出全部
          let params = ""
          let obj = {
            orgid: this.model1 == 0 ? "" : this.model1,
            guestId: this.company ? this.companyId : "",
            enterTypeId: this.type,
            pagesize: this.page.total,
          };
          obj.enterDateStart = this.value[0]
            ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
            : "";
          obj.enterDateEnd = this.value[1]
            ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
            : ""
          for (var i in obj) {
            params += `${i}=${obj[i]}&`
          }
          if (this.type == "050101") {
            //采购入库
            location.href = enteralExport(params)
          } else {
            //采购退货
            location.href = enteralReturnExport(params)
          }
        } else {
          //导出勾选
          if (this.selectTabArr.length < 1) {
            return this.$Message.error("请勾选需要导出的数据!")
          }
          let params = ""
          let str = ""
          this.selectTabArr.map(vb => {
            str += `ids=${vb.id}&`
          })
          params = `${str}pagesize=${this.selectTabArr.length}&enterTypeId=${this.type}&`
          if (this.type == "050101") {
            //采购入库
            location.href = enteralExport(params)
          } else {
            //采购退货
            location.href = enteralReturnExport(params)
          }
        }
      },
      // 总表查询
      getGeneral() {
        let obj = {
          orgid: this.model1 == 0 ? "" : this.model1,
          guestId: this.company ? this.companyId : "",
          enterTypeId: this.type
        };
        let params = {
          size: this.page.size,
          page: this.page.num - 1
        }
        // console.log(this.value)
        if (this.type === "050101") {
          (obj.enterDateStart = this.value[0]
            ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
            : ""),
            (obj.enterDateEnd = this.value[1]
              ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
              : ""),
            showLoading(".loadingClass", "数据加载中，请勿操作")
          getWarehousingList(params, obj).then(res => {
            if (res.data.vos) {
              res.data.vos.map((item, index) => {
                item.index = index + 1;
                item.taxSign = item.taxSign ? "是" : "否";
                item.auditSign = item.billStatusId ? "已入库" : "草稿";
              });
              this.data = res.data.vos;
              this.page.total = res.data.TotalElements;
              // this.total = res.data.AllotOutMainVO
              this.selectTabArr = []
              hideLoading()
            } else {
              hideLoading()
              this.data = [];
              this.selectTabArr = []
            }
          }).catch(e => {
            hideLoading()
          });
        } else if (this.type === "050201") {
          (obj.outDateStart = this.value[0]
            ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
            : ""),
            (obj.outDateEnd = this.value[1]
              ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
              : ""),
            getOutStockList(params, obj).then(res => {
              if (res.data.vos.length !== 0) {
                res.data.vos.map((item, index) => {
                  item.index = index + 1;
                  item.taxSign = item.taxSign ? "是" : "否";
                  item.auditSign = item.billStatusId ? "已入库" : "草稿";
                });
                this.data = res.data.vos;
                this.page.total = res.data.TotalElements;
                // this.total = res.data.AllotOutMainVO
                this.selectTabArr = []
              } else {
                this.data = [];
                this.selectTabArr = []
              }
            });
        }
      },
      // 总表查询
      getGeneralAll(param) {
        let obj = {
          orgid: this.model1 == 0 ? "" : this.model1,
          guestId: this.company ? this.companyId : "",
          enterTypeId: this.type
        };
        let params = {
          size: param.size,
          page: param.num - 1
        }
        // console.log(this.value)
        if (this.type === "050101") {
          (obj.enterDateStart = this.value[0]
            ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
            : ""),
            (obj.enterDateEnd = this.value[1]
              ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
              : ""),
            getWarehousingList(params, obj).then(res => {
              if (res.data.vos) {
                res.data.vos.map((item, index) => {
                  item.index = index + 1;
                  item.taxSign = item.taxSign ? "是" : "否";
                  item.auditSign = item.billStatusId ? "已入库" : "草稿";
                });
                this.data = res.data.vos;
                if (this.data.length == params.size) {
                  this.data = res.data.vos;
                  this.$refs.summary.exportCsv({
                    types: ["csv"],
                    filename: "采购入库单汇总",
                    columns: this.columns,
                    data: res.data.vos,
                  });
                }
              } else {
                this.data = [];
              }
            });
        } else if (this.type === "050201") {
          (obj.outDateStart = this.value[0]
            ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
            : ""),
            (obj.outDateEnd = this.value[1]
              ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
              : ""),
            getOutStockList(params, obj).then(res => {
              if (res.data.vos.length !== 0) {
                res.data.vos.map((item, index) => {
                  item.index = index + 1;
                  item.taxSign = item.taxSign ? "是" : "否";
                  item.auditSign = item.billStatusId ? "已入库" : "草稿";
                });
                this.data = res.data.vos;
                if (this.data.length == params.size) {
                  this.data = res.data.vos;
                  this.$refs.summary.exportCsv({
                    types: ["csv"],
                    filename: "采购退货单汇总",
                    columns: this.columns,
                    data: res.data.vos,
                  });
                }
              } else {
                this.data = [];
              }
            });
        }
      },
      // 选中总表查询明细
      election(row) {
        if (this.type === "050201") {
          getOutStockPart({mainId: row.id}).then(res => {
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
          getWarehousingPart({mainId: row.id}).then(res => {
            if (res.data.length !== 0) {
              res.data.map((item, index) => {
                item.index = index + 1;
                item.taxSign = item.taxSign ? "是" : "否";
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
