<template>
  <div class="content-oper">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>订单单号：</span>
            <Input v-model="orderNo" placeholder="输入订单号" class="w200 mr10"></Input>
          </div>
          <div class="db">
            <span>租户ID：</span>
            <Input v-model="tenantId" placeholder="输入租户ID" class="w100 mr10"></Input>
          </div>
          <div class="db">
            <span>租户名称：</span>
            <Input v-model="tenantName" placeholder="输入租户名称" class="w150 mr10"></Input>
          </div>
          <div class="db">
            <span>联系电话：</span>
            <Input v-model="mobile" placeholder="输入电话" class="w150 mr10"></Input>
          </div>
          <div class="db">
            <span>付款状态：</span>
            <Select v-model="isPayment" class="w120 mr10">
              <Option value="1">已付款</Option>
              <Option value="0">未付款</Option>
              <Option value="2">已关闭</Option>
              <Option value="9999">全部</Option>
            </Select>
          </div>
          <div class="db">
            <span>订单日期：</span>
            <DatePicker @on-change="selectDate" type="daterange" placeholder="年/月/日 - 年/月/日" class="w200 mr10"></DatePicker>
            <Button type="warning" @click="search" class="mr10 w90"><Icon type="ios-search" size="14" /> 查询</Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="get30Day"><Icon type="md-time" size="14" /> 即将到期(30天内)</Button>
            <Button class="mr10 w90" @click="noPay"><Icon type="md-card" size="14"/> 未付款</Button>
            <Button class="mr10" v-has="'close'" v-if="selectTableDataStatus==0" @click="closeNoPayOrder"><Icon type="md-close" size="14" /> 关闭未付款订单</Button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <Table class="table-highlight-row" highlight-row size="small" @on-current-change="selectTable" :loading="loading" border :stripe="true" :columns="columns" :data="tbdata"></Table>
      <Page class-name="page-con" :current="page.num" :total="page.total" :page-size="page.size" @on-change="changePage"
            @on-page-size-change="changeSize" show-sizer show-total show-elevator></Page>
    </section>
  </div>
</template>
<script>
  // import './lease.less'
  import {getLeaseOrderlist,getExpire30list,closeNoPayOrder} from '../../../api/lease/leaseApi'

  export default {
    name: 'leaseOrder',
    data() {
      return {
        orderNo: '',
        tenantName:'',
        mobile:'',
        isPayment:'9999',
        dateTime: '',
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        loading: false,
        selectTableData:'',
        selectTableDataStatus:'',
        columns: [
          {
            title: '选择',
            align:'center',
            key: 'venderSkuNo',
            minWidth: 80,
            render:(h,params) => {
              return h('span',{
                class:'table-radio'
              })
            }
          },
          {
            title: '租户ID',
            align:'center',
            minWidth: 80,
            key:'tenantId'
          },
          {
            title: '租户名称',
            key: 'tenantName',
            minWidth: 170,
            align:'left',
            // render:(h,params) => {
            //   let stat = params.row.status||1
            //   let className = 'red'
            //   if(stat==1){
            //     className = 'blue'
            //   }
            //   return h('span',{
            //     class:className
            //   },params.row.fullName?'● '+params.row.fullName:'')
            // }
          },
          {
            title: '联系电话',
            align:'center',
            key: 'mobile',
            minWidth: 120
          },
          {
            title: '订单单号',
            align:'center',
            key: 'orderNum',
            minWidth: 200
          },
          {
            title: '订单时间',
            align:'center',
            key: 'orderDate',
            minWidth: 130
          },
          {
            title: '产品名称',
            align:'center',
            key: 'productName',
            minWidth: 200
          },
          {
            title: '产品类型',
            align:'center',
            key: 'colour',
            minWidth: 100,
            render:(h,params) => {
              let objType = params.row.type||0
              return h('span',objType===1?'接口调用':'功能模块')
            }
          },
          {
            title: '开通时间',
            align:'center',
            key: 'startDate',
            minWidth: 170
          },
          {
            title: '结束时间',
            align:'center',
            key: 'endDate',
            minWidth: 170
          },
          {
            title: '是否付款',
            align:'center',
            key: 'former',
            minWidth: 100,
            render:(h,params) => {
              let objType = params.row.isPayment||0
              let paymentText = '未付款'
              if(objType===1){
                paymentText = '已付款'
              }else if(objType===2){
                paymentText = '已关闭'
              }

              return h('span',paymentText)
            }
          },
          {
            title: '付款时间',
            align:'center',
            key: 'paymentDate',
            minWidth: 170
          },
          {
            title: '付款方式',
            align:'center',
            key: 'createTime',
            minWidth: 170,
            render:(h,params) => {
              let objType = params.row.paymentType||0
              let text = "支付宝"
              if(objType==1){
                text = "微信"
              }else if(objType==2){
                text = "现金"
              }
              return h('span',text)
            }
          },
          {
            title: '订单状态',
            align:'center',
            key: 'status',
            minWidth: 170,
            render:(h,params) => {
              let objType = params.row.status||0
              return h('span',objType==1?'失败':'成功')
            }
          }
        ],
        tbdata: []
      }
    },
    mounted() {
      this.initStart()

    },
    methods: {
      initStart() {
        this.getList()
      },
      //初始化
      getList() {
        const params = {
        }
        params.page = this.page.num - 1
        params.size = this.page.size

        if (this.dateTime[0]) {
          params.startDate = this.dateTime[0] + " 00:00:00"
          params.endDate = this.dateTime[1] + " 23:59:59"
        }
        if(this.orderNo){
          params.orderNum = this.orderNo
        }
        if(this.tenantId){
          params.tenantId = this.tenantId
        }
        if(this.tenantName){
          params.tenantName = this.tenantName
        }
        if(this.mobile){
          params.mobile = this.mobile
        }
        if(this.isPayment!=9999){
          params.isPayment = this.isPayment
        }

        this.loading = true
        getLeaseOrderlist(params).then(res => {
          this.loading = false
          if (res.code == 0) {
            this.tbdata = res.data.content || []
            this.page.total = res.data.totalElements
          }
        })
      },

      //获取30天到期订单
      get30Day(){
        this.loading = true
        getExpire30list({}).then(res=>{
          this.loading = false
          if (res.code == 0) {
            this.tbdata = res.data.content || []
            this.page.total = res.data.totalElements
          }
        })
      },

      //分页
      changePage(p) {
        this.page.num = p
        this.getList()
      },
      changeSize(size) {
        this.page.num = 1
        this.page.size = size
        this.getList()
      },
      //搜索
      selectDate(date) {
        this.dateTime = date
        this.search()
      },
      search() {
        this.page.num = 1
        this.getList()
      },
      //关闭未付款订单按钮
      closeNoPayOrder(){
        if(this.selectTableData){
          closeNoPayOrder({id:this.selectTableData.id}).then(res => {
            if (res.code == 0) {
              this.$message.success('修改成功');
              this.search();
            }
          })
        }else{
          this.$Message.error("请至少选中一条记录")
        }
      },
      //表格选中数据
      selectTable(v){
        this.selectTableData = v
        this.selectTableDataStatus = v.isPayment
      },
      //未付款按钮
      noPay(){
        this.isPayment = 0
        this.search()
      },
    },
  }
</script>
