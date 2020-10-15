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
            <Date-picker :value="value" type="daterange" placeholder="选择日期" class="w200"
                         @on-change="dateChange"></Date-picker>
          </div>
          <div class="db ml20">
            <span>分店名称：</span>
            <Select v-model="model1" class="w150" filterable @on-change="getGeneral" :disabled="selectShopList">
              <Option
                v-for="item in Branchstore"
                :value="item.id"
                :key="item.id"
              >{{ item.name }}
              </Option>
            </Select>
          </div>
          <div class="db ml20">
            <span>客户名称：</span>
            <Input type="text" class="w200" v-model="company" readonly clearable/>
            <i class="iconfont iconcaidan input" @click="Dealings"></i>
          </div>
          <div class="db">
            <span>往来类型：</span>
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
        <Table border :columns="columns" :data="data" ref="summary" show-summary highlight-row
               @on-row-click="election" @on-selection-change="selectTab" @on-select-all="selectTab" max-height="400"></Table>
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
        <Table border :columns="columns1" :data="data1" class="mt10" ref="parts" show-summary
               :summary-method="summary"></Table>
      </div>
    </section>
    <selectDealings ref="selectDealings" @getOne="getOne"/>
  </div>
</template>

<script>
  import quickDate from "@/components/getDate/dateget_noEmit.vue";
  import selectDealings from "./components/SelectTheCustomer";
  import {getOrderlist, getPartList} from "@/api/bill/saleOrder";
  import {salesExport/**导出全部及导出勾选*/} from "@/api/settlementManagement/Import/index.js"
  import {goshop} from '@/api/settlementManagement/shopList';
  import {creat} from "./../components";
  import moment from 'moment'
  import {showLoading, hideLoading} from "@/utils/loading"

  export default {
    name: "billSales",
    components: {
      quickDate,
      selectDealings
    },
    data() {
      return {
        value: [],
        Branchstore: [
          {id: 0, name: '全部'}
        ], //分店名称
        page: {
          total: 0,
          sizeArr: [10, 20, 30, 40, 50],
          size: 10,
          num: 1
        },
        total: {},//总合计对象
        model1: "",
        columns: [
          {
            type: 'selection',
            width: 40,
            className: "tc",
            resizable: true,
          },
          {
            key: 'index',
            title: "序号",
            width: 40,
            className: "tc",
            resizable: true,
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
            title: "订单号",
            key: "serviceId",
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
                    title: params.row.serviceId
                  }
                }, params.row.serviceId)
              ])
            }
          },
          {
            title: "来源",
            key: "sourceType",
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
                    title: params.row.sourceType
                  }
                }, params.row.sourceType)
              ])
            }
          },
          {
            title: "客户",
            key: "guestName",
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
                    title: params.row.guestName
                  }
                }, params.row.guestName)
              ])
            }
          },
          {
            title: "客户编码",
            key: "guestId",
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
                    title: params.row.guestId
                  }
                }, params.row.guestId)
              ])
            }
          },
          {
            title: "往来类型",
            key: "belongSystem",
            className: "tc",
            resizable: true,
            width: 140
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
            title: "金额",
            key: "orderAmt",
            className: "tc",
            resizable: true,
            width: 120,
          },
          {
            title: "备注",
            key: "remark",
            className: "tc",
            resizable: true,
            width:200,
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
            title: "单据状态",
            key: "billstate",
            className: "tc",
            resizable: true,
            width: 150
          }
        ],
        selectTabArr: [],//选中数组
        columns1: [
          {
            key: 'index',
            title: "序号",
            width: 80,
            className: "tc",
            resizable: true,
          },
          {
            title: "配件编码",
            key: "partCode",
            className: "tc",
            width: 200,
            resizable: true,
          },
          {
            title: "配件名称",
            key: "partName",
            width: 200,
            className: "tc",
            resizable: true,
          },
          {
            title: "品牌",
            key: "partBrand",
            className: "tc",
            width: 200,
            resizable: true,
          },
          {
            title: "车型",
            key: "carModelName",
            className: "tc",
            width: 200,
            resizable: true,
          },
          {
            title: "OEM码",
            key: "oemCode",
            className: "tc",
            width: 200,
            resizable: true,
          },
          {
            title: "数量",
            key: "orderQty",
            className: "tc",
            width: 200,
            resizable: true,
          },
          {
            title: "单价",
            key: "orderPrice",
            className: "tc",
            width: 200,
            resizable: true,
            render: (h, params) => {
              return h('span', Number(params.row.orderPrice).toFixed(2))
            }
          },
          {
            title: "金额",
            key: "orderAmt",
            className: "tc",
            width: 200,
            resizable: true,
            render: (h, params) => {
              return h('span', Number(params.row.orderAmt).toFixed(2))
            }
          }
        ],
        data: [],
        data1: [],
        typelist: [
          {
            value: 0,
            label: "华胜连锁"
          },
          {
            value: 1,
            label: "体系外"
          },
          {
            value: 2,
            label: "体系内"
          }
        ],
        company: "", //往来单位
        companyId: "", //往来单位id
        type: 0,
      };
    },
    async mounted() {
      let arr = await creat(this.$refs.quickDate.val, this.$store);
      this.value = arr[0];
      this.model1 = arr[1];
      this.getShop();
      this.$refs.quickDate.getval(1);
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
        this.value = data
        this.getGeneral()
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
              value: "合计"
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
      // 总表格合计方式
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
          if (index === 10) {
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
      //查询
      query() {
        this.data1 = []
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
      // 往来单位选择
      getOne(data) {
        this.company = data.fullName;
        this.companyId = data.id;
        this.getGeneral()
      },
      // 快速查询
      quickDate(data) {
        this.value = data;
        this.getGeneral()
      },
      Dealings() {
        this.$refs.selectDealings.addressShow = true;
      },
      selectTab(selection) {
        this.selectTabArr = selection
      },
      // 导出汇总/配件明细
      report(type) {
        if (this.data.length < 1) {
          return this.$Message.error("暂无数据可导出!")
        }
        if (type == 0) {
          //导出全部
          let obj = {
            belongSystem: this.type,
            startTime: this.value[0] ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss") : '',
            endTime: this.value[1] ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss") : '',
            orgid: this.model1,
            guestId: this.company ? this.companyId : "",
            pagesize: this.page.total,
          }
          let params = ""
          for (var i in obj) {
            params += `${i}=${obj[i]}&`
          }
          location.href = salesExport(params)
        } else {
          //导出勾选
          if (this.selectTabArr.length < 1) {
            return this.$Message.error("请勾选需要导出的数据!")
          }
          let params = "";
          let str = ""
          this.selectTabArr.map(vb => {
            str += `ids=${vb.id}&`
          })
          params = `${str}pagesize=${this.selectTabArr.length}&`
          location.href = salesExport(params)
        }
      },
      // 总表查询
      getGeneral() {
        let obj = {
          belongSystem: this.type,
          startTime: this.value[0] ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss") : '',
          endTime: this.value[1] ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59" : '',
          orgid: this.model1==0?"":this.model1,
          guestId: this.company ? this.companyId : ""
        }
        let params = {
          size: this.page.size,
          page: this.page.num - 1
        }
        showLoading(".loadingClass", "数据加载中，请勿操作")
        getOrderlist(params, obj).then(res => {
          // console.log(res);
          if (res.data.vos.length !== 0) {
            res.data.vos.map((item, index) => {
              switch (item.sourceType) {
                case '0':
                  item.sourceType = '普通单据';
                  break;
                case '1':
                  item.sourceType = '采购订单';
                  break;
                case '2':
                  item.sourceType = '销售出库';
                  break;
                case '3':
                  item.sourceType = 'WMS';
                  break;
                default:
                  item.sourceType = ''
              }
              item.belongSystem = item.belongSystem ? item.belongSystem === 1 ? '体系外' : '体系内' : '华胜连锁'
              item.orderTypeName = item.orderType ? item.orderType.name : ''
              item.billstate = item.billStatusId ? item.billStatusId.name : ''
              item.index = index + 1
            })
            this.data = res.data.vos;
            this.page.total = res.data.TotalElements;
            // this.total = res.data.AllotOutMainVO
            this.selectTabArr = []
            hideLoading()
          } else {
            hideLoading()
            this.data = []
            this.page.total = res.data.TotalElements;
            this.selectTabArr = []
          }
        }).catch(e => {
          hideLoading()
        });
      },
      // 选中总表查询明细
      election(row) {
        getPartList({mainId: row.id}).then(res => {
          if (res.code === 0) {
            this.data1 = res.data.content
            this.data1.map((item, index) => {
              item.index = index + 1
            })
          }
        });
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
