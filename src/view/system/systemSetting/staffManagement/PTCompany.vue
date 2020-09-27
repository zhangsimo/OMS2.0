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
        <FormItem label="系统角色:" style="position: relative">
          <Cascader
            style="width:60%"
            :data="jobList"
            v-model="userRoleId"
            placeholder=""
            @on-change="getJob"
          ></Cascader>
          <div class="jobTags">
            <Tag
              v-for="item in formValidate.userRoles"
              :key="item.id"
              :name="item.id"
              :color=" item.systemType === 0 ? 'error': 'success'"
              closable
              @on-close="handleClose"
            >
              {{ item.displayName}}
            </Tag>
          </div>
        </FormItem>
<!--        <FormItem label="角色名称:" prop="userRoleIdTwo">-->
<!--          <Select v-model="formValidate.userRoleIdTwo" style="width:150px" >-->
<!--            <Option v-for="item in jobList" :value="item.id" :key="item.id">{{ item.displayName }}</Option>-->
<!--          </Select>-->
<!--        </FormItem>-->
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
  import { findAllJob } from "_api/admin/roleApi.js";

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
                userRoleIdTwo:'',
                userRoles:[]
              },//表单总数据
              ruleValidate:{
                userRoleIdTwo:[
                  {required: true,type:'string', message: '请选择岗位', trigger: 'change'}
                ],
              },//表单校验
              jobList:[],//角色列表
              userRoleId:[], //选择获取到的岗位
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
              this.formValidate = {
                userRoles:[]
              }
              this.getlist()
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

                  let companyList = ''
                  this.selectedArr.forEach( item => {
                    companyList += item.id + ','
                  })
                  companyList = companyList.substring(0 ,companyList.length -1 )
                  this.data.companyList = '('+ companyList + ')'
                  this.data.userRolesNew = this.formValidate.userRoles || []
                  this.data.groundIds = this.data.groundIdsStr.split(',')
                  delete this.data.userRoles
                  this.data.userRolesNew.forEach( item => {
                     delete item.system
                    delete  item.del
                  })

                  let stop = this.$loading()
                  addEditUser(this.data).then( res => {
                    stop()
                    if (res.code === 0){
                      this.getlist()
                      this.$emit('colseMdole' , res)
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
          //获取全部角色
          async getLeftList() {
            let res = await findAllJob();
            if (res.code == 0) {
              this.jobList = res.data
              this.changeTreeList(this.jobList)
            }
          },

          //重组角色树形图数据
          changeTreeList(val){
            if (Array.isArray(val) && val.length > 0){
              val.forEach(item => {
                item.value = item.id
                item.label = item.displayName
                item.children = item.roles ? item.roles : ''
                if (item.children) {
                  this.changeTreeList(item.children)
                }
              })
            }
          },
          //获取角色push斤tag清除所获取数据
          getJob(value, selectedData){
            this.userRoleId = []
            let cont = selectedData[selectedData.length -1]
            //判断父级是否是重复如果重复则覆盖原先选择的数据保证当钱系统只有条
            let index
            this.formValidate.userRoles.forEach( (item , i)  => {
              if(item.systemType == cont.systemType){
                index = i
              } })
            if (Number.isFinite(index)){
              this.$set(this.formValidate.userRoles , index , cont )
            }else {
              this.formValidate.userRoles.push(cont)
            }
          },

          //关闭获取到角色tag
          handleClose(event, name){
            const index = this.formValidate.userRoles.indexOf(name);
            this.formValidate.userRoles.splice(index, 1);
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
.jobTags {
  position: absolute;
  top: -2px;
  left: 5px;
}

</style>
