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
            <Select  v-model="model1" filterable class="w150" @on-change="getGeneral" :disabled="selectShopList">
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
            <span>调拨单号：</span>
            <input type="text" class="h30" v-model="fno">
          </div>
          <div class="db ml5">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="select">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
          <div class="db ml10">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="report" v-has="'export'">导出</button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <Table border :columns="columns" :data="data" class="waytable" ref="summary" show-summary :summary-method="handleSummary" max-height="500"></Table>
      </div>
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
    </section>
    <selectDealings ref="selectDealings" @selectSearchName="getOne" />
  </div>
</template>

<script>
import quickDate from "@/components/getDate/dateget_noEmit.vue";
import selectDealings from './components/selectCompany'
import {creat} from './../components'
import {getOnWay} from "@/api/bill/saleOrder";
import { goshop } from '@/api/settlementManagement/shopList';
import moment from 'moment'
import {showLoading, hideLoading} from "@/utils/loading"
import {onWayExport/**导出*/} from "@/api/settlementManagement/Import/index.js"
export default {
  name: "billOnway",
  components: {
    quickDate,
    selectDealings
  },
  data() {
    return {
      fno:'',//调拨单号
      value: [],
      Branchstore: [
        {id:0 ,name:'全部'}
      ], //分店名称
      model1: "",
      columns: [
        {
          title: '序号',
          key: 'index',
          minWidth: 40,
          className: 'tc'
        },
        {
          title: '配件编码',
          key: 'partCode',
          className: 'tc',
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
                  title: params.row.partCode
                }
              }, params.row.partCode)
            ])
          }
        },
        {
          title: '配件名称',
          key: 'partName',
          className: 'tc',
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
                  title: params.row.partName
                }
              }, params.row.partName)
            ])
          }
        },
        {
          title: 'OEM码',
          key: 'oemCode',
          className: 'tc',
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
                  title: params.row.oemCode
                }
              }, params.row.oemCode)
            ])
          }
        },
        {
          title: '品牌车型',
          key: 'partBrand',
          className: 'tc',
          minWidth: 100,
        },
        {
          title: '单位',
          key: 'unit',
          className: 'tc',
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
                  title: params.row.unit
                }
              }, params.row.unit)
            ])
          }
        },
        {
          title: '规格',
          key: 'spec',
          className: 'tc',
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
                  title: params.row.spec
                }
              }, params.row.spec)
            ])
          }
        },
        {
          title: '出库数量',
          key: 'hasOutQty',
          className: 'tc',
          minWidth: 120
        },
        {
          title: '在途数量',
          key: 'onOrderQty',
          className: 'tc',
          minWidth: 120
        },
        {
          title: '已入库数量',
          key: 'inStockQty',
          className: 'tc',
          minWidth: 120
        },
        {
          title: '未入库数量',
          key: 'noStockQty',
          className: 'tc',
          minWidth: 120,
        },
        {
          title: '分店名称',
          key: 'groupName',
          className: 'tc',
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
                  title: params.row.groupName
                }
              }, params.row.groupName)
            ])
          }
        },
        {
          title: '出库单号',
          key: 'outOrderNo',
          className: 'tc',
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
                  title: params.row.outOrderNo
                }
              }, params.row.outOrderNo)
            ])
          }
        },
        {
          title: '客户名称',
          key: 'customerName',
          className: 'tc',
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
                  title: params.row.customerName
                }
              }, params.row.customerName)
            ])
          }
        },
        {
          title: '出库日期',
          key: 'outStockDate',
          className: 'tc',
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
                  title: params.row.outStockDate
                }
              }, params.row.outStockDate)
            ])
          }
        },
        {
          title: '仓库',
          key: 'storeName',
          className: 'tc',
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
          title: '含税标记',
          key: 'taxSign',
          className: 'tc',
          minWidth: 100,
        },
        {
          title: '税率',
          key: 'taxRate',
          className: 'tc',
          minWidth: 100,
          render: (h,params) =>{
            return h('span',(params.row.taxRate).toFixed(2))
          }
        },
        {
          title: '调拨单价',
          key: 'taxPrice',
          className: 'tc',
          minWidth: 100,
          render: (h,params) =>{
            return h('span',params.row.taxPrice ? (params.row.taxPrice).toFixed(2):'')
          }
        },
        {
          title: '调拨金额',
          key: 'taxAmt',
          className: 'tc',
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
                  title: params.row.taxAmt
                }
              }, params.row.taxAmt?  (params.row.taxAmt).toFixed(2):'')
            ])
          }
        },
        {
          title: '成本单价',
          key: 'taxPrice',
          className: 'tc',
          minWidth: 100,
          render: (h,params) =>{
            return h('span',(params.row.taxPrice).toFixed(2))
          }
        },
        {
          title: '成本金额',
          key: 'taxAmt',
          className: 'tc',
          minWidth: 180,
          render: (h,params) =>{
            return h('span',(params.row.taxAmt).toFixed(2))
          }
        },
        {
          title: '受理人',
          key: 'hasAcceptUname',
          className: 'tc',
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
                  title: params.row.hasAcceptUname
                }
              }, params.row.hasAcceptUname)
            ])
          }
        },
        {
          title: '受理单号',
          key: 'hasAcceptOrderNo',
          className: 'tc',
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
                  title: params.row.hasAcceptOrderNo
                }
              }, params.row.hasAcceptOrderNo)
            ])
          }
        },
        {
          title: '供应商',
          key: 'guestName',
          className: 'tc',
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
          title: '订单备注',
          key: 'remark',
          className: 'tc',
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
      page: {
        total: 0,
        sizeArr: [10, 20, 30, 40, 50],
        size: 10,
        num: 1
      },
      data: [],
       company: "", //往来单位
      companyId: "", //往来单位id
    };
  },
  async mounted () {
    let arr = await creat (this.$refs.quickDate.val,this.$store)
    this.value = arr[0];
    this.model1 = arr[1];
    this.getShop();
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
    changePage(p) {
      this.page.num = p;
      this.getGeneral();
    },
    changeSize(size) {
      this.page.num = 1;
      this.page.size = size;
      this.getGeneral();
    },
    //获取门店
    async getShop(){
      let data ={}
      let res = await goshop(data)
      if (res.code === 0) return this.Branchstore = [...this.Branchstore , ...res.data]
    },
    // 总表格合计方式
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
        if (index > 6 && index<11 || index ===19  ||index===21) {
          if (!values.every(value => isNaN(value))) {
            const v = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            if(index===19||index===21){
              sums[key] = {
                key,
                value: v.toFixed(2)
              };
            } else {
              sums[key] = {
                key,
                value: v
              };
            }
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
    // 日期选择
    dateChange(data){
      this.value = data;
      this.getGeneral()
    },
    select(){
      this.getGeneral()
    },
    // 往来单位选择
    getOne(data) {
      this.company = data.fullName;
      this.companyId = data.id;
      this.getGeneral()
    },
    // 快速查询
    quickDate(data){
      this.value = data
      this.getGeneral()
    },
    Dealings() {
      this.$refs.selectDealings.init()
    },
    // 导出
    report(){
      if(this.data.length !==0){
        let params=""
        let obj={
          size: this.page.total,
          page: 0,
          startTime:this.value[0] ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss") : '',
          endTime:this.value[1] ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss").split(' ')[0]+" 23:59:59" : '',
          orgid:this.model1,
          code:this.fno,
          guestId:this.company?this.companyId:""
        }
        for(var i in obj){
          params+=`${i}=${obj[i]}&`
        }
        location.href=onWayExport(params)
      } else {
        this.$message.error('在途库存暂无数据')
      }
    },
    // 总表查询
    getGeneral() {
      let data = {
        size: this.page.size,
        page: this.page.num - 1,
        startTime:this.value[0] ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss") : '',
        endTime:this.value[1] ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss").split(' ')[0]+" 23:59:59" : '',
        orgid:this.model1,
        code:this.fno,
        guestId:this.company?this.companyId:""
      }
      showLoading(".loadingClass", "数据加载中，请勿操作")
      getOnWay(data).then(res => {
        if(res.data.content.length !==0){
          res.data.content.map((item,index)=>{
            item.index = index +1
            if ([1, "1", "是"].includes(item.taxSign)) {
              item.taxSign = true;
            }
            if ([0, "0", "否"].includes(item.taxSign)) {
              item.taxSign = false;
            }
          })
          this.data = res.data.content
          this.page.total=res.data.totalElements
          hideLoading()
        } else {
          this.data = []
          hideLoading()
        }
      }).catch(e => {
        hideLoading()
      });
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
.inner-box {
  overflow-x: scroll;
}
.waytable {
  width: 3000px;
}
</style>
