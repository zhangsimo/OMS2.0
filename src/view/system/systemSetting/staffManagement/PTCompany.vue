<template>
    <div class="clearfix pb20">
      <div class="headr-box">
      <span class="mr10">快速查询:</span>
        <input type="text" class="mr10"  v-model="shopCode" placeholder="请输入店号">
        <input type="text" class="mr10"  v-model="compentName" placeholder="请输入公司名称">
        <a class="mr20 iconfont iconchaxunicon" @click="inquireShop"> 查询</a>
        <a class="mr20 iconfont iconxuanzetichengchengyuanicon" @click="addCompany"> 确定</a>
        <a class="mr20 iconfont iconshanchuicon" @click="cancel"> 取消</a>
      </div>
      <div class="companyList">
        <Table :columns="columns" border :loading="loading" stripe :data="companyList" height="440" size="small"
               @on-selection-change="selectRow"
               @on-select-all="seleteAll"
               @on-select-all-cancel="cancelAll"></Table>
      </div>
      <Page :total="page.total" :page-size="page.size" :current="page.num" show-sizer show-total class-name="page-con"
            @on-change="selectNum" @on-page-size-change="selectPage" style="float: right"></Page>
    </div>
</template>

<script>
  import {getCompanyList , addEditUser} from '@/api/system/systemSetting/staffManagenebt'
    export default {
        name: "PTCompany",
        props:{
            data:''
        },
        data(){
            return {
                compentName:'' ,
                shopCode:'',
                companyList:[],
                allCompanyList:[],
                loading: true,
                selectedArr:[],
                page:{
                    size:10,
                    num:1,
                    total:0
                },
                columns:[
                    {
                        title:'选择',
                        width: 60,
                        align: 'center',
                        type: 'selection',
                        // render:( h , params) => {
                        //     return h('checkbox' ,{type: 'selection'} , '选择')
                        // }
                    },
                    {
                        title: '店号',
                        align: 'center',
                        key: 'orgid'
                    },
                    {
                        title: '公司名称',
                        align: 'center',
                        key: 'tenantCompanyName',
                        minWidth: 80
                    },
                    {
                        title: '公司地址',
                        align: 'center',
                        key: 'address',
                    },
                ],
            }
        },
        mounted(){
        },
        methods:{
          getlist(){
              let  data = {}
              data.size = this.page.size
              data.page = this.page.num -1
              data.orgid = this.shopCode
              data.tenantCompanyName = this.compentName
              getCompanyList(data).then( res => {
                  this.loading =false
                if (res.code == 0){
                    this.companyList = res.data.content
                    this.page.total = res.data.totalElements


                }
              })
          },
            //切换分页条数
            selectPage(size) {
                this.loading = true
                this.page.size = size
                this.getlist()
            },
            selectNum(num) {
                this.loading = true
                this.page.num = num
                this.getlist()
            },
            //搜索
            inquireShop() {
              this.page.num = 1
                this.getlist()
            },
            //选择航
            selectRow(selection, row) {
              this.selectedArr= selection
            },
            // 全选
            seleteAll(selection) {
                this.selectedArr = selection
            },
            // 取消全选
            cancelAll(selection) {
                this.selectedArr = []
            },
            addCompany(){
              if(this.selectedArr.length < 1){
                  this.$Message.error('至少选择一个公司')
                  return false
              }
              let companyList = ''
                this.selectedArr.forEach( item => {
                    companyList += item.id + ','
                })
                companyList = companyList.substring(0 ,companyList.length -1 )
                this.data.companyList = '('+ companyList + ')'
                let stop = this.$loading()
                addEditUser(this.data).then( res => {
                    stop()
                    this.getlist()
                    this.$emit('colseMdole' , res)
                })
            },
          cancel(){
            this.shopCode=''
            this.compentName=''
            this.$emit('colseMdole' , this.data)
            this.getlist()
          }
        }
    }
</script>

<style scoped lang="less">
.headr-box {
  /*line-height: 57px;*/
  padding-left: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  input {
    height: 25px;
  }
  .mr20 {
  }
}
.companyList {
  margin-bottom: 10px;
}
</style>
