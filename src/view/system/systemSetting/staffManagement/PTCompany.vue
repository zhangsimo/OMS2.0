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
      <Form ref="formValidate" :model="formValidate"  :rules="ruleValidate" :label-width="80">
        <FormItem label="角色名称:" prop="userRoleIdTwo">
          <Select v-model="formValidate.userRoleIdTwo" style="width:150px" >
            <Option v-for="item in jobList" :value="item.id" :key="item.id">{{ item.displayName }}</Option>
          </Select>
        </FormItem>
      </Form>
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
  import {queryRolesByPage } from '_api/admin/roleApi.js';

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
                        key: 'shortName',
                        minWidth: 80
                    },
                    {
                        title: '公司地址',
                        align: 'center',
                        key: 'address',
                    },
                ],
              formValidate:{
                userRoleIdTwo:''
              },//表单总数据
              ruleValidate:{
                userRoleIdTwo:[
                  {required: true,type:'string', message: '请选择岗位', trigger: 'change'}
                ],
              },//表单校验
              jobList:[],//角色列表
            }
        },
        mounted(){
          this.getLeftList()
        },
        methods:{
          getlist(){
              let  data = {}
              data.size = this.page.size
              data.page = this.page.num -1
              data.orgid = this.shopCode
              data.shortName = this.compentName
              data.id = this.data.id
              getCompanyList(data).then( res => {
                  this.loading =false
                if (res.code == 0){
                    this.companyList = res.data.content
                    this.page.total = res.data.totalElements
                }
              })
          },

            //清空数据
            clearList(){
                this.page.num = 1
                this.selectedArr = []
                this.shopCode = ''
                this.compentName = ''
              this.$refs.formValidate.resetFields()
            },
            //切换分页条数
            selectPage(size) {
                this.loading = true
              this.page.num = 1
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

          //确定添加兼职公司职能
            addCompany(){
              if(this.selectedArr.length < 1){
                return  this.$Message.error('至少选择一个公司')
              }
              this.$refs.formValidate.validate(valid => {
                if (valid) {
                  let companyList = ''
                  this.selectedArr.forEach( item => {
                    companyList += item.id + ','
                  })
                  companyList = companyList.substring(0 ,companyList.length -1 )
                  this.data.companyList = '('+ companyList + ')'
                  this.data.userRoleIdNew = this.formValidate.userRoleIdTwo
                  this.data.groundIds = this.data.groundIdsStr.split(',')

                  let stop = this.$loading()
                  addEditUser(this.data).then( res => {
                    stop()
                    this.getlist()
                    this.$emit('colseMdole' , res)
                  })
                } else {
                  this.$Message.error('兼职岗位必选');
                }
              })


            },
          //清空
            cancel(){
            this.shopCode=''
            this.compentName=''
            this.$emit('colseMdole' , this.data)
            this.getlist()
          },
          //获取全部岗位
          async getLeftList(){
            let data ={}
            data.size = 9999
            data.page = 0
            data.systemType = 0
            let res = await queryRolesByPage(data)
            if(res.code == 0){
              this.jobList = res.data.content
            }
          },
          //清空校验
          resetFields() {
            this.$refs.formValidate.resetFields()
          },

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
