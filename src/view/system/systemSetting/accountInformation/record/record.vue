<template>
    <div>
      <section class="oper-box">
        <div class="oper-top flex">
          <div class="wlf">
            <div class="db mr10">
              <span>快速查询：</span>
              <quickDate @quickDate="getData"></quickDate>
            </div>
            <div class="db flex">
              <span>开始日期：</span>
              <DatePicker @on-change="selectDate" type="daterange" placement="bottom-start" placeholder="选择日期"
                          class="w200 mr20">
              </DatePicker>
            </div>
            <div class="db mr10">
              <Select v-model="searchType2" class="w100">
                <Option v-for="item in ListTwo" :value="item.value" :key="item.value">{{ item.name }}</Option>
              </Select>
            </div>
            <div class="db">
              <Input v-model="productName" placeholder="请输入产品名称" style="width: 100px" class="mr10"></Input>
              <Button type="warning" class="mr10 w90" @click="search"><Icon custom="iconfont iconchaxunicon icons"/>查询</Button>
            </div>
          </div>
        </div>
      </section>
      <section class="con-box">
        <Table class="table-highlight-row" size="small" highlight-row :loading="loading" border :stripe="true" :columns="columns" :data="tbdata" @on-row-click="selection"></Table>
        <Page class-name="page-con" :current="page.num" :total="page.total" :page-size="page.size" @on-change="changePage"
              @on-page-size-change="changeSize" show-sizer show-total>
        </Page>
      </section>
    </div>
</template>

<script>
  import quickDate from '../../../../../components/getDate/dateget'
  import { findPageByDynamicQuery } from '../../../../../api/system/account/account'
  export default {
        name: "record",
      components: { quickDate },
      data(){
          return{
            ListTwo: [{
              value: 9999,
              name: '全部'
            },
              {
                value: 1,
                name: '功能购买'
              },
              {
                value: 2,
                name: '充值华币'
              },
              {
                value: 3,
                name: '调用接口'
              },
              {
                value: 4,
                name: '赠送华币'
              }],
            productName: '',
            searchType2: 9999,
            loading:true,
            columns: [
              {
                title: '序号',
                align: 'center',
                type: 'index',
                width: 70
              },
              {
                title: '产品名称',
                align:'left',
                minWidth: 100,
                key:'productName'
              },
              {
                title: '购买/调用结果',
                align:'left',
                key: 'callStatus',
                minWidth: 120
              },
              {
                title: '支付金额',
                align:'left',
                key: 'costPrice',
                minWidth: 170
              },
              {
                title: '支付华币',
                align:'left',
                key: '',
                minWidth: 120
              },
              {
                title: '华币剩余数量',
                align:'left',
                key: 'costCoin',
                minWidth: 120
              },
              {
                title: '时间',
                align:'left',
                key: 'createTime',
                minWidth: 120
              }
            ],
            tbdata: [],
            page: {
              num: 1,
              size: 10,
              total: 0
            },
            dateTime:[],
            selectOne:null
          }
      },
      methods:{
          //表格选中某行的数据
        selection(a){
            console.log(a)
        },
        //选中的日期
        selectDate(date){
          this.dateTime = date
          console.log(this.dateTime)
        },
        //分页
        changePage(p) {
          // console.log(p)
          this.page.num = p
          this.getList()
        },
        changeSize(size) {
          // console.log(size)
          this.page.num = 1
          this.page.size = size
          this.getList()
        },
        //初始化
        getList(){
          let params = {}
          params.page = this.page.num - 1
          params.size = this.page.size
          let data = {}
          if(this.selectOne){
            data.startTime = this.selectOne[0] + " 00:00:00"
            data.endTime = this.selectOne[1] + " 23:59:59"
          }
          if(this.dateTime[0]){
            data.startTime = this.dateTime[0] + " 00:00:00"
            data.endTime = this.dateTime[1] + " 23:59:59"
          }
          if(this.searchType2 !== 9999){
            data.type = this.searchType2
          }
          if(this.productName){
            data.productName = this.productName
          }
          findPageByDynamicQuery({data:data,params:params}).then(res => {
              if(res.code === 0){
                this.loading = false
                this.tbdata = res.data.content
                this.page.total = res.data.totalElements
              }
          })
        },
        //从子组件拿来的数据
        getData(A){
          console.log(A)
          this.selectOne = A
        },
        //搜索
        search(){
          this.getList()
        }
      },
    mounted(){
          this.getList()
      }
    }
</script>

<style scoped>
@import "../../../../lease/lease/index.css";
</style>
