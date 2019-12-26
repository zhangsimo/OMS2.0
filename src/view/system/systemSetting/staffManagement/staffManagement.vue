<template>
    <div class="staff-box">
        <div class="staff-header">
          <span>姓名:</span>
          <input type="text" class="staff-name mr10" v-model="staffName">
          <span>手机号码:</span>
          <input type="text" class="staff-phone-number mr10" v-model="staffphoneNumber">
          <span>是否离职:</span>
          <Select v-model="dimission" style="width:80px" >
            <Option v-for="item in isDimission" :value="item.value" :key="item.value">{{ item.name }}</Option>
          </Select>
          <i-button  type="warning" class="staff-btn" @click="inquireStaff"><Icon custom="iconfont iconchaxunicon" /> 查询</i-button>
        </div>
      <div class="staff-change">
       <a class="mr10" @click="findRootGroup"><Icon custom="iconfont iconxinzengicon icons"/> 新增 </a>
        <a class="mr10" @click="changStaffList"><Icon custom="iconfont iconbianjixiugaiicon icons"/> 修改</a>
        <a class="mr10" @click =changeDimission v-if="!oneStaffChange.office"><Icon custom="iconfont iconlizhiicon icons"/> 离职</a>
        <a class="mr10" @click =changeDimission v-if="oneStaffChange.office"><Icon type="md-person-add" /> 复职</a>
        <a class="mr10" @click="giveUser" v-if="!oneStaffChange.office && oneStaffChange.openSystem == 1" ><Icon custom="iconfont iconziyuan1 icons"/> 开通账号</a>
        <a class="mr10" @click="restPassword"><Icon custom="iconfont iconziyuan1 icons"/> 重置密码</a>
        <i-button  type="warning" class="staff-btn mr10" @click="openCompany"><Icon custom="iconfont iconxuanzetichengchengyuanicon" /> 新增兼职公司</i-button>
        <i-button  type="warning" class="staff-btn mr10" @click="lookCompany"><Icon custom="iconfont iconchaxunicon" />查看兼职公司</i-button>
      </div>
      <div class="staffList">
        <Table class="table-highlight-row"  :loading="loading" size="small" highlight-row  border :stripe="true" :columns="columns" :data="staffList" @on-current-change="selection"></Table>
        <Page :total="page.total" :page-size="page.size" :current="page.num" show-sizer show-total class-name="page-con"
              @on-change="selectNum" @on-page-size-change="selectPage"></Page>
      </div>

<!--      添加的萌态框-->
      <Modal v-model='modalShow' :title="title" width="700px" :closable="false">
        <addStaff ref='child' :data="newStaff"></addStaff>
        <div slot='footer'>
          <Button type='default' @click="modalShow = false">取消</Button>
          <Button type='primary' @click='submit' >确定</Button>
        </div>
      </Modal>

<!--      重置密码-->
      <Modal v-model="prassword" :title="password">
        <div style="text-align: center;line-height: 100px">
          <span class="iconziyuan3">确定将密码重置为00000</span>
        </div>
        <div slot='footer'>
          <Button type='primary' @click='submitPassword'>确定</Button>
          <Button type='default' @click='prassword = false'>取消</Button>
        </div>
      </Modal>

<!--      开通账号-->
      <Modal v-model="setPasswordShow" :title="setpasswordName" width="400px">
        <setPassword v-if="oneStaffChange" :data="oneStaffChange" ref="gopassword"></setPassword>
        <div slot='footer'>
          <Button type='primary' @click='dredge'>确定</Button>
          <Button type='default' @click='setPasswordShow = false'>取消</Button>
        </div>
      </Modal>

<!--  新增兼职公司    -->
      <Modal title="选择兼职公司" v-model="PtCompany" width="800px" :footer-hide="true">
        <PTCompany v-if="oneStaffChange" ref="addNew" :data="oneStaffChange" @colseMdole = 'colsePtCompany'></PTCompany>
      </Modal>
<!--      查询兼职公司-->
      <Modal title="查看兼职公司" v-model="findAllCompany" width="800px" :footer-hide="true">
        <div class="clearfix pb20">
          <div class="headr-box2">
            <span class="mr10">快速查询:</span>
            <input type="text" class="mr10"  v-model="shopCode" placeholder="请输入店号">
            <input type="text" class="mr10"  v-model="compentName" placeholder="请输入公司名称">
            <Button @click="inquireShop2" class="mr10" type='default'><Icon type="ios-search" size="14" /> 查询</Button>
            <Button type="default" class="mr10 w90" @click="delect"><i class="iconfont mr5 iconlajitongicon"></i>删除</Button>
          </div>
          <div class="companyList">
            <Table :columns="columns2" highlight-row border :data="companyList" height="200" size="small" @on-current-change="getOneCliemt"></Table>
          </div>
          <Page :total="page2.total" :page-size="page2.size" :current="page2.num" show-sizer show-total class-name="page-con"
                @on-change="selectNum2" @on-page-size-change="selectPage2" style="float: right"></Page>
        </div>
      </Modal>
    </div>
</template>

<script>
  import {getStaffList , editUser , changeeditUser ,findCompanyList, putNewCompany, restpasswd ,setCliemt} from '@/api/system/systemSetting/staffManagenebt'
  import {transTime} from '../utils'
  import addStaff from "./addStaff";
  import setPassword from "./setpassword";
  import PTCompany from "./PTCompany";
  import {frozenStaff} from '_api/admin/userApi'
  import moment from 'moment'

  export default {
        name: "staffManagement",
        components:{
            addStaff,
            setPassword,
            PTCompany,
        },
        data() {
            return {
                isDimission :[
                    {name: '是' , value:1},
                    {name: '否' , value:0}
                ],
                shopCode:'',
                loading: true,
                compentName:'',
                prassword: false, //重置密码
                password:'系统提示',
                dimission: 0,
                setPasswordShow: false,
                findAllCompany: false,
                staffphoneNumber:'',
                staffName:'',
                PtCompany: false,
                // changepasswordData:'',
                staffList:[],
                page: {
                    size: 10,
                    num: 1,
                    total: 0
                },
                page2: {
                    size: 10,
                    num: 1,
                    total: 0
                },
                columns:[
                    {
                        title: '选择',
                        key: 'id',
                        width: 70,
                        align: 'center',
                        render: (h, params) => {
                         return h('span',{class:'table-radio'})
                        }
                    },
                    {
                        title: '姓名',
                        align: 'center',
                        key: 'userName'
                    },
                    {
                        title: '手机号码',
                        align: 'center',
                        key: 'phone',
                        minWidth: 80
                    },
                    {
                        title: '性别',
                        align: 'center',
                        key: '',
                        render:(h ,params)=>{
                            let text = params.row.gender == 0 ? '男' : '女'
                            return h('span' ,{}, text)
                        }
                    },
                    {
                        title: '生日',
                        align: 'center',
                        key: 'birthDay',
                        // render: (h, params) => {
                        //     return h('span', {}, transTime(params.row.birthDay))
                        // },
                    },
                    {
                        title:'登录账号',
                        align: 'center',
                        key:'loginName'
                    },
                    {
                        title:'是否开通系统',
                        align: 'center',
                        key:'',
                        render:(h , params) => {
                            let text = params.row.openSystem == 1 ? '否':'是'
                            return h('span' , {} ,text)
                        }
                    },
                    {
                        title:'是否离职',
                        align: 'center',
                        key:'',
                        render:(h ,params) => {
                            let text = params.row.office ? '是' : '否'
                            return h('span' ,{} ,text)
                        }
                    },
                    {
                        title:'所属机构',
                        align: 'center',
                        key:'groupName'
                    },
                    {
                        title:'建档人',
                        align: 'center',
                        key:'createName'
                    },
                    {
                        title:'建档日期',
                        align: 'center',
                        key:'',
                        render: (h, params) => {
                            return h('span', {}, transTime(params.row.createTime))
                        },
                    }
                ],
                columns2:[
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
                companyList:[],
                title:'新增员工',
                setpasswordName:'设置密码',
                modalShow:false,
                oneStaffChange:'',
                newStaff:{
                    userName:'', //用户名
                    phone:'',   //电话
                    gender:0, //性别
                    birthDay:'',//生日
                    cardId:'', //身份证
                    wechatId:'', //微信号
                    entryTime:'',//入职日期
                    emergencyContact:'', //紧急联系人
                    emergencyContactPhone:'', //紧急联系人电话
                    costPrice:'',
                    salesman:'', //
                    id:'',      //id
                    sureCost:0, //成本价
                    business:0, // 业务员
                    single: false, //允许查看
                    singtwo:false, //允许提交
                    office:0, //是否在职默认在职
                    openSystem:0,
                    groupId:0 //所属机构
                },
                oneCliemt:{},//点击获取到当前要删除的兼职公司
            }

        },
      mounted(){
            this.getAllStaffList()
      },
      methods:{
            getAllStaffList(){
                let stop = this.$loading()
                let data = {}
                data.size = this.page.size
                data.page = this.page.num -1
                data.userName =  this.staffName
                data.phone = this.staffphoneNumber
                data.office = this.dimission
                getStaffList(data).then(res => {
                    stop()
                    this.loading = false
                    if(res.code == 0){
                        this.staffList = res.data.content
                        this.page.total = res.data.totalElements
                    }
                }).catch(err => {
                    stop()
                })
            },
          //切换分页条数
          selectPage(size) {
              this.page.size = size
              this.getAllStaffList()
          },
          //分页
          selectNum(num) {
              this.page.num = num
              this.getAllStaffList()
          },
          inquireStaff(){
              this.page.num = 1
              this.getAllStaffList()
          },
          //关闭model
          cancel(){
           this.modalShow =false
           this.title ='新增员工'
          this.newStaff.userName='', //用户名
          this.newStaff.phone='',   //电话
          this.newStaff.gender=0, //性别
          this.newStaff.birthDay='',//生日
          this.newStaff.cardId='', //身份证
          this.newStaff.wechatId='', //微信号
          this.newStaff.entryTime='',//入职日期
          this.newStaff.emergencyContact='', //紧急联系人
          this.newStaff.emergencyContactPhone='', //紧急联系人电话
          this.newStaff.costPrice='',
          this.newStaff.salesman='', //
          this.newStaff.id='',      //id
          this.newStaff.sureCost=0, //成本价
          this.newStaff.business=0, // 业务员
          this.newStaff.single= false, //允许查看
          this.newStaff.singtwo=false, //允许提交
          this.newStaff.office=0, //是否在职默认在职
          this.newStaff.openSystem=0,
          this.newStaff.groupId=0 //所属机构

          this.$refs.child.resetFields()
          },
          //冻结
          setFrozenStaff(){
              let stop = this.$loading()

              let data = {
                  id: id,
                  frozen: frozen
              }
              frozenStaff(data).then(res => {
                  stop()
                  if (res.code == 0) {
                      this.$Message.success(res.message)
                      this.getUserList()
                  }
              }).catch(err => {
                  stop()
              })
          },
          //新增员工
          findRootGroup(){
              this. cancel()
              this.newStaff ={
                  single: false,
                  singtwo: false
              }
              this.modalShow =true
          },
          // 确认
          submit(){
              this.$refs.child.handleSubmit( () => {
                  let stop = this.$loading()
                  this.modalShow = false
                 if(this.title == '新增员工'){
                     let data = {}
                     data = JSON.parse(JSON.stringify(this.newStaff))
                     data.single =  data.single ? 1 : 0
                     data.singtwo =  data.single ? 1 : 0
                     data.groundIds = JSON.stringify(data.groundIds)
                     // data.entryTime = moment(data.entryTime).format('yyyy-MM-dd HH:mm:ss')
                     editUser(data , this.$store.state.user.userData.groupId).then( res => {
                         stop()
                         if(res.code ==0){
                             this.$Message.success('新增成功')
                             this.$refs.child.resetFields()
                             this. cancel()
                             this.getAllStaffList()
                         }
                     }).catch(err => {
                         this.$refs.child.resetFields()
                         stop()
                     })
                 }else {
                     let data = {}
                     data = JSON.parse(JSON.stringify(this.newStaff))
                     data.single =  data.single ? 1 : 0
                     data.singtwo =  data.single ? 1 : 0
                     data.groundIds = JSON.stringify(data.groundIds)
                     // data.entryTime = moment(data.entryTime).format('yyyy-MM-dd HH:mm:ss')
                     changeeditUser(data).then( res => {
                         stop()
                         if(res.code ==0){
                             this.$Message.success('修改成功')
                             this.oneStaffChange = {}
                             this.getAllStaffList()
                         }
                     }).catch(err => {
                         stop()
                     })
                 }
              })
          },
          //获取当前数据
          selection(currentRow){
                console.log(currentRow , 999)
              this.oneStaffChange = currentRow
          },
          //修改信息
          changStaffList(){
              if(!this.oneStaffChange.id){
                  this.$Message.error('请至选择一条员工信息')
                  return false
              }
              this.title= '修改员工信息'
              this.newStaff=this.oneStaffChange //用户名
                  this.newStaff.single= this.newStaff.single == 1 ? true: false  //允许查看
                  this.newStaff.singtwo=this.newStaff.singtwo == 1 ? true : false, //允许提交
                  // this.newStaff.groundIds = JSON.parse(this.newStaff.groundIds)
              this.modalShow =true
          },
          //员工离职
          changeDimission(){
              if(!this.oneStaffChange){
                  this.$Message.error('请至选择一条员工信息')
                  return false
              }
              let stop = this.$loading()
              this.oneStaffChange.office =  this.oneStaffChange.office == 0 ? 1 :0
              this.oneStaffChange.singtwo=this.oneStaffChange.singtwo == 1 ? true : false, //允许提交
                  this.oneStaffChange.groundIds = JSON.stringify(this.oneStaffChange.groundIds)
              changeeditUser(this.oneStaffChange).then( res => {
                  stop()
                  if(res.code ==0){
                      this.$Message.success('修改成功')
                      this.oneStaffChange ={}
                      this.getAllStaffList()
                  }
              }).catch(err => {
                  stop()
              })

          },
          //重置密码
          restPassword(){
              if(!this.oneStaffChange){
                  this.$Message.error('请至选择一条员工信息')
                  return false
              }
              if(this.oneStaffChange.openSystem == 1){
                  this.$Message.error('未开通账号')
                  return false
              }
              this.prassword = true
          },
          //确认重置密码
          submitPassword(){
                this.prassword =false
              let stop = this.$loading()

              let data = {}
              data.tenantUid = this.oneStaffChange.id
              restpasswd(data).then( res => {
                  stop()
                  if(res.code == 0){
                      this.$Message.success('重置成功')
                  }
              })
          },
          //开通账号
          giveUser(){
              if(!this.oneStaffChange){
                  this.$Message.error('请至选择一条员工信息')
                  return false
              }
              this.setPasswordShow = true
          },
          // 确认开通
          dredge(){
              this.$refs.gopassword.handleSubmit( ()=> {
                  let stop = this.$loading()
                  let data = {}
                  data.staffName = this.oneStaffChange.userName
                  data.username = this.oneStaffChange.account
                  data.passwd = '000000'
                  data.groupId = this.oneStaffChange.groupId
                  data.tenantUid  = this.oneStaffChange.id
                  putNewCompany(data ,  this.$store.state.user.userData.groupId).then( res => {
                      stop()
                  if(res.code == 0){
                      this.getAllStaffList()
                      this.oneStaffChange = {}
                      this.$Message.success('开通成功')
                  }
                  })
                  this.setPasswordShow = false
              })
          },
          openCompany(){
              if(!this.oneStaffChange){
                  this.$Message.error('请至选择一条员工信息')
                  return false
              }
              this.$refs.addNew.getlist()
              this.$refs.addNew.clearList()
              this.PtCompany = true
          },
          //关闭公司选项
          colsePtCompany(){
              this.getAllStaffList()
              this.PtCompany = false
          },
          //查看公司
          lookCompany(){
              if(!this.oneStaffChange){
                  this.$Message.error('请至选择一条员工信息')
                  return false
              }
            this.findAllCompany = true
              this.shopCode = ''
              this.compentName = ''
              this.getLookCompany()
          },
          //兼职公司查询
          inquireShop2(){
               this.page2.num = 1
               this.getLookCompany()
          },
          selectPage2(size) {
              this.page2.size = size
              this.getLookCompany()
          },
          getOneCliemt(val){
                console.log(val)
                this.oneCliemt = val
          },
          //删除兼职公司
         async delect(){
             if(!this.oneCliemt.id){
                 this.$message.error('请选择一条需要删除的兼职公司')
                 return
             }
             let data ={}
                data.id = this.oneStaffChange.id
                data.companyList = '(' + this.oneCliemt.id + ')'
            let res = await setCliemt(data)
             console.log(res)
             if (res.code === 0){
                 this.page2.num = 1
                 this.getLookCompany()
                 this.oneCliemt = {}
             }
          },
          getLookCompany(){
              let  data = {}
              data.size = this.page2.size
              data.page = this.page2.num -1
              data.orgid = this.shopCode
              data.tenantCompanyName = this.compentName
              data.id = this.oneStaffChange.id
              data.allCompanyList = this.oneStaffChange.allCompanyList || ''
              findCompanyList(data).then( res => {
                  if (res.code == 0){
                      this.companyList = res.data.content
                      this.page2.total = res.data.totalElements
                  }
              })
          },

          //分页
          selectNum2(num) {
              this.page2.num = num
              this.getLookCompany()
          },
      }
    }
</script>

<style scoped lang="less">
.staff-box {
  background: #ffffff;
  .staff-header {
    line-height: 57px;
    border-bottom: 1px solid #eee;
    padding-left: 20px;
  }
  .staff-name {
    height: 30px;
    width: 140px;
  }
  .center{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .staff-phone-number{
    height: 30px;
    width: 140px;
  }
  .staff-btn {
    margin-left: 20px;
    cursor: pointer;
  }
  .staff-change {
    padding-left: 20px;
    border-bottom: 1px solid #eee;
    line-height: 57px;
  }
  .staffList{
    padding: 20px;
  }
}
.headr-box2 {
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
