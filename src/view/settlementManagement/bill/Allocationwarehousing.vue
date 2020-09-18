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
            <Date-picker :value="value" type="daterange" placeholder="选择日期" class="w200" @on-change="dateChange"></Date-picker>
          </div>
          <div class="db ml20">
            <span>分店名称：</span>
            <Select v-model="model1" filterable class="w150" @on-change="getTransferWarehousing" :disabled="selectShopList">
              <Option
                v-for="item in Branchstore"
                :value="item.id"
                :key="item.id"
              >{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db ml20">
            <span>供应商：</span>
            <Input type="text" class="w200" v-model="company" readonly clearable/>
            <i class="iconfont iconcaidan input" @click="Dealings"></i>
          </div>
          <div class="db">
            <span>类型：</span>
            <Select v-model="type" style="width:200px" @on-change="getTransferWarehousing">
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
        <Table border :columns="columns" :data="data" ref="summary" show-summary highlight-row @on-row-click="election" :summary-method="handleSummary"></Table>
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
        <Table border :columns="columns1" :data="data1" class="mt10" ref="parts" show-summary :summary-method="summary"></Table>
      </div>
    </section>
    <selectDealings ref="selectDealings" @selectSearchName="getOne"  />
  </div>
</template>

<script>
import quickDate from "@/components/getDate/dateget_noEmit.vue";
import selectDealings from "./components/selectCompany";
import { creat } from "./../components";
import { goshop } from '@/api/settlementManagement/shopList'
import { transferWarehousing, wouseParts } from "@/api/bill/saleOrder";
import moment from 'moment'
import {showLoading, hideLoading} from "@/utils/loading"
export default {
  name: "billAllocationwarehousing",
  components: {
    quickDate,
    selectDealings
  },
  data() {
    return {
      auditStatus:'', //审核状态
      Branchstore: [
        {id:0 ,name:'全部'}
      ], //分店名称
      model1: "",
      modal1: false,
      page: {
        total: 0,
        sizeArr: [10, 20, 30, 40, 50],
        size: 10,
        num: 1
      },
      total: {},//总合计对象
      value: [],
      columns: [
        {
          key:'index',
          title: "序号",
          minWidth: 40,
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
          title: "入库单号",
          key: "serviceId",
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
                  title: params.row.serviceId
                }
              }, params.row.serviceId)
            ])
          }
        },
        {
          title: "供应商",
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
          title: "单据类型",
          key: "orderTypeId",
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
                  title: params.row.orderTypeId
                }
              }, params.row.orderTypeId)
            ])
          }
        },
        {
          title: "仓库",
          key: "storeName",
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
                  title: params.row.storeName
                }
              }, params.row.storeName)
            ])
          }
        },
        {
          title: "创建人",
          key: "createUname",
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
                  title: params.row.createUname
                }
              }, params.row.createUname)
            ])
          }
        },
        {
          title: "创建日期",
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
          title: "提交日期",
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
          title: "是否直发",
          key: "sourceType",
          className: "tc",
          minWidth: 100
        },
        {
          title: "金额",
          key: "orderAmt",
          className: "tc",
          minWidth: 100,
        },
        {
          title: "单据状态",
          key: "status",
          className: "tc",
          minWidth: 100
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
        }
      ],
      columns1: [
        {
          key:'index',
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
          className: "tc"
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
          className: "tc"
        },
        {
          title: "不含税单价",
          key: "noTaxPrice",
          className: "tc",
          render: (h,params) =>{
            return h('span',(params.row.noTaxPrice).toFixed(2))
          }
        },
        {
          title: "不含税金额",
          key: "noTaxAmt",
          className: "tc",
          render: (h,params) =>{
            return h('span',(params.row.noTaxAmt).toFixed(2))
          }
        },
        {
          title: "含税单价",
          key: "taxPrice",
          className: "tc",
          render: (h,params) =>{
            return h('span',(params.row.taxPrice).toFixed(2))
          }
        },
        {
          title: "含税金额",
          key: "taxAmt",
          className: "tc",
          render: (h,params) =>{
            return h('span',(params.row.taxAmt).toFixed(2))
          }
        },
        {
          title: "数量",
          key: "hasOutQty",
          className: "tc"
        },
        {
          title: "单价",
          key: "orderPrice",
          className: "tc",
          render: (h,params) =>{
            return h('span',(params.row.orderPrice).toFixed(2))
          }
        },
        {
          title: "金额",
          key: "orderAmt",
          className: "tc",
        }
      ],
      data: [],
      data1: [],
      typelist: [
        {
          value: "0",
          label: "调拨入库"
        },
        {
          value: "2",
          label: "调入退货"
        }
      ],
      company: "", //往来单位
      companyId: "", //往来单位id
      type: '0'//类型
    };
  },
  async mounted() {
    let arr = await creat(this.$refs.quickDate.val, this.$store);
    this.value = arr[0];
    this.model1 = arr[1];
    this.getShop()
    this.$refs.quickDate.getval(1);
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
    dateChange(data){
        if(data[0]){
            data[0]=data[0]+' 00:00:00';
        }
        if(data[1]){
            data[1]=data[1]+' 23:59:59';
        }
      this.value = data;
      this.getTransferWarehousing();
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
        if (index > 6 && index !==11) {
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
        } else if(index === 11){
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
    query(){
      this.data1 = []
      this.getTransferWarehousing()
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
      this.getTransferWarehousing()
    },
    // 快速查询
    quickDate(data) {
      this.value = data;
      // this.model1 = this.$store.state.user.userData.shopId
      this.getTransferWarehousing();
    },
    // 往来单位
    Dealings() {
      this.$refs.selectDealings.init();
    },
    // 主表查询
    getTransferWarehousing() {
      let obj = {
        createTimeStart: this.value[0] ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss") : '',
        createTimeEnd:  this.value[1] ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss") : '',
        orgid: this.model1,
        guestId: this.company?this.companyId:"",
        orderTypeId:this.type
      };
      let params = {
        size: this.page.size,
        page: this.page.num - 1
      }
      showLoading(".loadingClass", "数据加载中，请勿操作")
      transferWarehousing(params,obj).then(res => {
        if (res.data.vos.length !== 0){
          res.data.vos.map((item, index) => {
            item.index = index + 1;
            item.status = item.status.value ? '已入库':'草稿';
            item.orderTypeId = item.orderTypeId.value ? '调入退货' : '调拨入库'
            item.sourceType = item.sourceType === 3 ? '是' : '否'
          });
          this.data = res.data.vos;
          this.page.total = res.data.TotalElements;
          this.total = res.data.AllotOutMainVO
          hideLoading()
        } else {
          hideLoading()
          this.data = []
        }
      }).catch(e => {
        hideLoading()
      });
    },
    getTransferWarehousingAll(param) {
      let obj = {
        createTimeStart: this.value[0] ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss") : '',
        createTimeEnd:  this.value[1] ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss") : '',
        orgid: this.model1,
        guestId: this.company?this.companyId:"",
        orderTypeId:this.type
      };
      let params = {
        size: param.size,
        page: param.num - 1
      }
      transferWarehousing(params,obj).then(res => {
        if (res.data.vos.length !== 0){
          res.data.vos.map((item, index) => {
            item.index = index + 1;
            item.status = item.status.value ? '已入库':'草稿';
            item.orderTypeId = item.orderTypeId.value ? '调入退货' : '调拨入库'
            item.sourceType = item.sourceType === 3 ? '是' : '否'
          });
          this.data = res.data.vos;
          if(this.data.length==params.size){
            this.data = res.data.vos;
            this.$refs.summary.exportCsv({
              types: ["csv"],
              filename: "调拨入库单汇总",
              columns:this.columns,
              data: res.data.vos,
            });
          }
        } else {
          this.data = []
        }
      });
    },
    // 导出汇总/配件明细
    report(type) {
      if (type) {
        if (this.data1.length !== 0) {
          this.$refs.parts.exportCsv({
            filename: "调拨入库单汇总-配件信息"
          });
        } else {
          this.$message.error("调拨入库单汇总-配件信息暂无数据");
        }
      } else {
        let page={}
        page.size=this.page.total;
        page.num=1
        if (this.data.length !== 0) {
          this.getTransferWarehousingAll(page)
        } else {
          this.$message.error("调拨入库单汇总暂无数据");
        }
      }
    },
    // 选中数据
    election(row) {
      wouseParts({mainId: row.id}).then(res => {
        if(res.data.length !== 0){
          res.data.map((item,index)=>{
            item.index = index +1
            item.taxSign = item.taxSign ? '是' : '否'
          })
          this.data1 = res.data
        } else {
          this.data1 = []
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
