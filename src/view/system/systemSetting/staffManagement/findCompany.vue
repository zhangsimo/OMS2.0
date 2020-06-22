<template>
  <div class="clearfix pb20">
    <div class="headr-box">
      <span class="mr10">快速查询:</span>
      <input type="text" class="mr10"  v-model="shopCode" placeholder="请输入店号">
      <input type="text" class="mr10"  v-model="compentName" placeholder="请输入公司名称">
      <a class="mr20 iconfont iconchaxunicon" @click="inquireShop"> 查询</a>
    </div>
    <div class="companyList2">
      <Table :columns="columns" stripe :data="companyList" height="200" size="small" @on-selection-change="getorderID"></Table>
    </div>
    <Page :total="page.total" :page-size="page.size" :current="page.num" show-sizer show-total class-name="page-con"
          @on-change="selectNum" @on-page-size-change="selectPage" style="float: right"></Page>
  </div>
</template>

<script>
    import {getCompanyList } from '@/api/system/systemSetting/staffManagenebt'
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
                page:{
                    size:10,
                    num:1,
                    total:0
                },
                columns:[
                    {
                        title:'选择',
                        type: 'selection',
                        width: 60,
                        align: 'center'
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
                    title: "角色",
                    align: "center",
                    key: "userRoleName",
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
                    if (res.code == 0){
                        this.companyList = res.data.content
                        this.page.total = res.data.totalElements
                    }
                })
            },
            //切换分页条数
            selectPage(size) {
                this.page.size = size
                this.getlist()
            },
            selectNum(num) {
                this.page.num = num
                this.getlist()
            },
            //搜索
            inquireShop() {
                this.page.num = 1
                this.getlist()
            },
            //选择公司
            getorderID(selection){
                this.allCompanyList = selection
            },
        }
    }
</script>

<style scoped lang="less">
  .headr-box2 {
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
  .companyList2 {
    margin-bottom: 10px;
  }
</style>
