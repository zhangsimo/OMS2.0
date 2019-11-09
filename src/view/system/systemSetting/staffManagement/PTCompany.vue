<template>
    <div class="clearfix pb20">
      <div class="headr-box">
      <span class="mr10">快速查询:</span>
        <input type="text" class="mr10"  v-model="shopCode" placeholder="请输入店号">
        <input type="text" class="mr10"  v-model="compentName" placeholder="请输入公司名称">
        <a class="mr20 iconfont iconchaxunicon" @click="inquireShop"> 查询</a>
        <a class="mr20 iconfont iconxuanzetichengchengyuanicon" @click="addCompany"> 确定</a>
        <a class="mr20 iconfont iconshanchuicon" @click="getlist"> 取消</a>
      </div>
      <div class="companyList">
        <Table :columns="columns" border :loading="loading" stripe :data="companyList" height="440" size="small"
               @on-select="selectRow"
               @on-select-cancel="cancelSelectRow"
               @on-select-all="seleteAll"
               @on-select-all-cancel="cancelAll"></Table>
      </div>
      <Page :total="page.total" :page-size="page.size" :current="page.num" show-sizer show-total class-name="page-con"
            @on-change="selectNum" @on-page-size-change="selectPage" style="float: right"></Page>
    </div>
</template>

<script>
  import {getCompanyList , changeeditUser} from '@/api/system/systemSetting/staffManagenebt'
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
            this.getlist()
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
                    this.selectedArr.forEach( item => {
                        this.allCompanyList.forEach( el => {
                            if (item.orgid == el.orgid){
                                item._checked = true
                            }
                        })
                    })
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
              this.selectedArr.push(row)
            },
            // 取消选择行
            cancelSelectRow(selection, row) {
                this.selectedArr =  this.selectedArr.filter( item => { return  item.id != row.id})
                console.log(this.selectedArr)
            },
            // 全选
            seleteAll(selection) {
                let arr = selection
                let arr1 = [...this.selectedArr]
                arr = arr.filter(item => {
                    let arrlist = arr1.map(v => v.id)
                    return !arrlist.includes(item.id)
                })
                this.selectedArr = arr
            },
            // 取消全选
            cancelAll(selection) {
                this.selectedArr = []
            },
            addCompany(){
              if(this.allCompanyList.length < 1){
                  this.$Message.error('至少选择一个公司')
                  return false
              }
              let companyList = ''
                this.allCompanyList.forEach( item => {
                    companyList += item.orgid + ','
                })
                companyList = companyList.substring(0 ,companyList.length -1 )
                this.data.companyList = '('+ companyList + ')'
                let stop = this.$loading()
                changeeditUser(this.data).then( res => {
                    stop()
                    this.getlist()
                    this.$emit('colseMdole' , res)
                })
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
