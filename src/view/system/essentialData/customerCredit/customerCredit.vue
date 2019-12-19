<template>
    <div class="customerCredit-box">
      <div class="customerCredit-header">
        <span>客户名称:</span>
        <Input  class="mr10"  style="width: 150px" v-model="Name" placeholder="请输入客户名称！"/>
        <span>授权业务员:</span>
        <Input  class="mr10"  style="width: 150px" v-model="salesman" placeholder="请输入授权业务员"/>
        <span>业务员电话:</span>
        <Input  class="mr10"  style="width: 150px" v-model="telephone" placeholder="请输入业务员电话"/>
        <Button type="warning" class="w90 mr10" @click="search">
              <span class="center">
                <Icon custom="iconfont iconchaxunicon icons" />查询
              </span>
        </Button>
        <Button class=" mr10" @click="addLimit">
              <span class="center">
               申请信用额度
              </span>
        </Button>
        <Button class=" mr10" @click="opensurveyShow" v-show="this.state == 0">
              <span class="center">
               申请信用调查
              </span>
        </Button>
        <Button class=" mr10" v-show="this.state === 1 && this.researchStatus === 2" @click="opensurveyShow">
              <span class="center">
               修改信用调查
              </span>
        </Button>
        <Button class=" mr10" @click="openAdjustment" v-show="this.state === 1 && this.researchStatus === 2">
              <span class="center">
               额度调整
              </span>
        </Button>
      </div>
      <div class="customerCredit-title">
        <div style="width: 3000px;padding-right: 10px">
          <Table class="table-highlight-row" size="small" highlight-row :loading="Loading" border :stripe="true" :columns="columns" :data="creditList" @on-row-click="selection" height="350"></Table>
        </div>
      </div>
      <Page class="mr10" :total="page.total" :page-size="page.size" :current="page.num" show-sizer show-total class-name="page-con"
            @on-change="selectNum" @on-page-size-change="selectPage"></Page>
      <div class="record">
         <span class="creditRecord">客户信用额度记录</span>
        <div class="creditTitle">

            <Row :gutter="10">
              <Col span="12" style="padding-top: 10px">
                <div style="margin-bottom: 10px">客户信用额度记录表</div>
                <div style="overflow: auto"><Table :columns="columns1" border stripe size="small" height="200" :data="creditArr"></Table></div>
              </Col>
              <Col span="12"  style="padding-top: 10px">
                <div style="margin-bottom: 10px">客户信息变更记录表</div>
                <div style="overflow: auto"><Table :columns="columns2" border stripe size="small" height="200" :data="alterArr"></Table></div>
              </Col>
            </Row>

          </div>
        </div>

<!--      申请信用额度-->
      <Modal v-model="CreditLineApplicationShow" title="申请信用额度" width="1100">
        <CreditLineApplication :data="creaditList" :sendMsg="applicationArr" :payable="payable" :quality="quality"></CreditLineApplication>
        <div slot='footer'>
          <Button type='primary' @click="Determined">确定</Button>
          <Button type='default' @click="cancel2">取消</Button>
        </div>
      </Modal>
      <!--      申请信用调查-->
      <div class="credit">
        <Modal v-model="surveyShow" title="信用调查表" width="1000" style="top: 50px!important;">
          <SurveyList :data="creaditList" :dataMsg="costList" ref="SurveyList"></SurveyList>
          <div slot='footer'>
            <Button type='primary' @click="confirm">确定</Button>
            <Button type='default' @click="cancel">取消</Button>
          </div>
        </Modal>
      </div>

      <!--      修改信用调查-->
      <Modal v-model="surveyShow" title="信用调查表" width="1000">
        <SurveyList :data="creaditList" :dataMsg="costList" ref="SurveyList"></SurveyList>
        <div slot='footer'>
          <Button type='primary' @click="confirm">确定</Button>
          <Button type='default' @click="cancel">取消</Button>
        </div>
      </Modal>
<!--      额度调整-->
      <Modal v-model="adjustment" title="客户信用额度调整表">
        <QuotaAdjustment :data="creaditList" :dataMsg="adjustmentMsg" :datetoday="today"></QuotaAdjustment>
        <div slot='footer'>
          <Button type='primary' @click="adjustmentconfirm">确定</Button>
          <Button type='default' @click="cancelChange">取消</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
  import CreditLineApplication from "./CreditLineApplication";
  import QuotaAdjustment from "./QuotaAdjustment";
  import SurveyList from "./SurveyList";
  import {queryCreditList,guestCreditHistory,saveOrUpdate,adjustment,save,guestAdjust} from '../../../../api/system/CustomerManagement/CustomerManagement'
  import { getDigitalDictionary } from '@/api/system/essentialData/clientManagement'
  import * as tools from "../../../../utils/tools";
  export default {
        name: "customerCredit",
        components:{
            CreditLineApplication,
            SurveyList,
            QuotaAdjustment
        },
        data(){
            return {
              creditArr:[],
              alterArr:[],
                Name:'',  //客户名称
                salesman:'', //授权业务员
                telephone:'', //业务员电话
                creditList:[],
                Loading: true,
                columns:[
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        key: ''
                    },
                    {
                        title: '基本信息',
                        align: 'center',
                        key: '',
                        children:[
                            {
                                title: '是否客户调查',
                                align: 'center',
                                key: 'isGuestResearch',
                                render:(h,params) => {
                                let state = params.row.isGuestResearch
                                let zi = ''
                                if (state === 0){
                                  zi = "否"
                                }
                                if(state === 1) {
                                  zi = "是"
                                }
                                return h('span',zi)
                              }
                            },
                            {
                                title: '客户名称',
                                align: 'center',
                                key: 'fullName'
                            },
                            {
                                title: '信用额度',
                                align: 'center',
                                key: 'creditLimit'
                            },
                            {
                                title: '客户分类',
                                align: 'center',
                                key: 'guestTypeName'
                            },
                            {
                                title: '注册号',
                                align: 'center',
                                key: 'bizLicenseNo'
                            },
                            {
                                title: '法定人',
                                align: 'center',
                                key: 'legalPerson'
                            },
                            {
                                title: '负责人电话',
                                align: 'center',
                                key: 'chargeManTel'
                            },
                            {
                                title: '注册地址',
                                align: 'center',
                                key: 'registAddress'
                            },
                            {
                                title: '经营地址',
                                align: 'center',
                                key: 'shopAddress'
                            },
                            {
                                title: '注册资本(万)',
                                align: 'center',
                                key: 'registMoney'
                            },
                            {
                                title: '授权采购',
                                align: 'center',
                                key: 'salesman'
                            },
                            {
                                title: '采购员电话',
                                align: 'center',
                                key: 'salesmanTel'
                            },
                        ]
                    },
                  {
                    title:'业务信息',
                    align:'center',
                    children: [
                      {
                        title: '回款方式',
                        align: 'center',
                        key: 'cashModeName'
                      },
                      {
                        title: '对账日期',
                        align: 'center',
                        key: 'accountDate'
                      },
                      {
                        title: '信用级别',
                        align: 'center',
                        key: 'tgradeName'
                      },
                      {
                        title: '信用积分',
                        align: 'guestIntegrals',
                        key: ''
                      },
                      {
                        title: '备注',
                        align: 'center',
                        key: 'remark'
                      },
                    ]
                  },
                  {
                        title:'审核信息',
                        align:'center',
                        children: [
                            {
                                title: '制单人',
                                align: 'center',
                                key: 'createUname'
                            },
                            {
                                title: '制单日期',
                                align: 'center',
                                key: 'createTime'
                            },
                            {
                                title: '审核人',
                                align: 'center',
                                key: 'auditor'
                            },
                            {
                                title: '审核日期',
                                align: 'center',
                                key: 'auditDate'
                            },
                        ]
                    },
                  {
                    title:'修改信息',
                    align:'center',
                    children: [
                      {
                        title: '修改人',
                        align: 'center',
                        key: 'updateUname'
                      },
                      {
                        title: '修改日期',
                        align: 'center',
                        key: 'updateTime'
                      }
                    ]
                  }
                ],
                columns1:[
                    {
                        title:'序号',
                        type:'index',
                        align: 'center'
                    },
                    {
                        title:'申请额度原因',
                        align: 'center',
                        key:'quotaReason'
                    },
                    {
                        title:'申请增加额度合计',
                        align: 'center',
                        key:'addTotalQuota'
                    },
                    {
                        title:'调整后总额度',
                        align: 'center',
                        key:'totalQuota'
                    },
                    {
                        title:'调整后剩余余额',
                        align: 'center',
                        key:'afterAdjustQuota'
                    },
                    {
                        title:'申请时间',
                        align: 'center',
                        key:'applyDate'
                    },
                    {
                        title:'审核人',
                        align: 'center',
                        key:'auditor'
                    },
                    {
                    title:'审核日期',
                    align: 'center',
                    key:'auditDate'
                  },
                ],
                columns2:[
                    {
                        title:'序号',
                        type:'index',
                        align: 'center'
                    },
                    {
                        title:'调整原因',
                        align: 'center',
                        key:'adjustReason'
                    },
                    {
                        title:'申请人',
                        align: 'center',
                        key:'applyMan'
                    },
                    {
                        title:'申请日期',
                        align: 'center',
                        key:'applyDate'
                    },
                    {
                        title:'审核人',
                        align: 'center',
                        key:'auditor'
                    },
                    {
                        title:'审核日期',
                        align: 'center',
                        key:'auditDate'
                    },
                ],
                page: {
                    size: 10,
                    num: 1,
                    total: 0
                },
                CreditLineApplicationShow: false, //申请信用额度
                surveyShow:false, //申请信用调查
                adjustment: false, //额度调整
                creaditList:{},
                surveyAllList:[],
                adjustmentOne:{},//额度调整信息
                ID: '', //保存当前行id
                state: -1,//保存当前行的客户调查状态
                Limitstate: '', //保存当前的额度状态
                rowMessage:'', //当前的客户信息
                costList: '', //数据字典数据
                researchStatus: '' ,//保存当前的申请状态
                adjustmentMsg: '' , //给子组件的调整信息
                today: ''   ,//发送子组件的当前日期
                applicationArr: [],//申请信用额度的传给子组件的数组
                payable: '' ,//传给子组件的应收应付
                quality:'',//某个值
                total: '' ,//调整后剩余额度
                totalSuma: ''
            }
        },
        methods:{
          // totalSum(suma){
          //   console.log(suma)
          //   this.totalSuma = suma
          // },
          // total(sum) {
          //   // console.log(sum)
          //   this.total = sum
          // },
          // @total="total" @totalSum="totalSum"
          //搜索
          search(){
            this.page.num = 1
            this.getListTop()
          },
            selectNum(p){
              // console.log(p)
              this.page.num = p
              this.getListTop()
            },
          //当前行
          selection(row){
            this.rowMessage = row
            console.log(this.rowMessage)
            this.state = row.isGuestResearch
            this.ID = row.guestId
            // console.log(this.ID)
            this.Limitstate = JSON.parse(row.researchStatus).value
             this.creaditList = this.rowMessage
            this.researchStatus = row.researchStatus?JSON.parse(row.researchStatus).value:'';
            this.credit()
          },
            selectPage(size){
              console.log(size)
              this.page.num = 1
              this.page.size = size
              this.getListTop()
            },
            //申请信用额度
            addLimit(){
            if(this.ID){
              // console.log(1112)
                if(this.Limitstate === 1){
                    this.$Message.warning('正在审批中，请等待审批完成!')
                }else if(this.Limitstate === 3){
                    this.$Message.warning('禁止额度申请中，请联系管理员!')
                }else{
                    this.CreditLineApplicationShow = true
                    this.alertBox()
              }
            }else{
              this.$Message.warning('请选择要申请的客户！')
            }
            },
            //申请信用调查
            opensurveyShow(){
              this.$refs.SurveyList.handleReset()
                this.surveyShow = true
            },
            //额度调用
            openAdjustment(){
                this.adjustment = true
                this.adjustmenttt()
            },
            //初始化top部分
          getListTop(){
              let params = {}
            params.page = this.page.num - 1
            params.size = this.page.size
            if(this.Name){
              params.fullName = this.Name
            }
            if(this.salesman){
              params.salesman = this.salesman
            }
            if(this.telephone){
              params.salesmanTel = this.telephone
            }

            queryCreditList(params).then(res => {
              this.Loading = false
              if(res.code === 0){
                this.creditList = res.data.content || []
                this.page.total = res.data.totalElements
              }
            })
          },
          //信誉额度记录表
          credit(){
            let data = {}
            data.guestId = this.ID
            guestCreditHistory(data).then(res => {
                if(res.code === 0){
                    this.creditArr = res.data.guestAdjustVOList || []
                    this.alterArr = res.data.changeVOList || []
                }
            })
          },
          //数据字典
          async information(){
            let data ={}
            data =['CS00106','CS00118','CS00117']
            let res = await getDigitalDictionary(data)
            // console.log(res.data)
            if(res.code === 0){
              this.costList = res.data
            }
          },
          // 信用等级
          async informationTwo(){
            let data ={}
            data =['CS00112']
            let res = await getDigitalDictionary(data)
            console.log(res.data.CS00112)
            if(res.code === 0){
              this.quality = res.data.CS00112
            }
          },
          //确定按钮
          confirm(){
             this.$refs['SurveyList'].$refs['formInline'].validate((valid) => {
                if (valid) {
                  let data = this.creaditList
                  data.registerDate = tools.transTime(this.creaditList.registerDate)
                  data.operationEnd = tools.transTime(this.creaditList.operationEnd)
                  data.operationStart = tools.transTime(this.creaditList.operationStart)
                  data.tempStart = tools.transTime(this.creaditList.tempStart)
                  data.guestId = this.ID
                  // console.log(data)
                  saveOrUpdate(data).then(res => {
                      if(res.code === 0){
                          this.getListTop()
                          this.surveyShow = false
                          this.$Message.warning('成功！')
                      }
                  })
                }else {
                  this.$message.warning('* 为必填！')
                  console.log(this.creaditList)
                }
              })
          },
          //取消a按钮
          cancel(){
            this.surveyShow = false
          },
          //调整额度的接口
          adjustmenttt(){
            let params = {}
            params.guestId = this.rowMessage.guestId
            params.orgId = this.rowMessage.orgid
            adjustment(params).then(res => {
              console.log(res.data)
              if(res.code === 0){
                  this.adjustmentMsg = res.data
                  console.log(this.adjustmentMsg)
              }
            })
          },
          //调整信用额度的确定
          adjustmentconfirm(){
                let data = {}
                data.guestId = this.creaditList.guestId
                // data.applyDate = this.today
                data.payableAmt = this.adjustmentMsg.payableAmt
                data.receivableAmt = this.adjustmentMsg.receivableAmt
                data.sumAmt = this.adjustmentMsg.sumAmt
                data.thirtyAmt = this.adjustmentMsg.thirtyAmt
                data.sixtyAmt = this.adjustmentMsg.sixtyAmt
                data.moreSixtyAmt = this.adjustmentMsg.moreSixtyAmt
                data.fixationQuotaTotal = this.creaditList.fixationQuotaTotal
                this.creaditList.isForbid ? this.creaditList.isForbid = 1 : this.creaditList.isForbid = 0
                data.isForbid = this.creaditList.isForbid
                data.quotaReason = this.creaditList.quotaReason
                data.totalQuota = +this.creaditList.creditLimit + this.creaditList.tempCreditLimit
                data.beforeAdjustTempQuota = this.creaditList.tempCreditLimit
                data.tempQuotaTotal = this.creaditList.tempCreditLimit
                data.tempStart = this.creaditList.tempStart
                data.tempEnd = this.creaditList.tempEnd
                data.orgId = this.creaditList.orgid
                data.adjustType = 1
                data.afterAdjustQuota = this.adjustmentMsg.payableAmt - this.adjustmentMsg.fixationQuotaTotal
                console.log(data,123)
                save(data).then(res => {
                  if(res.code === 0){
                    this.adjustment = false
                    this.$Message.warning('保存成功')
                    this.getListTop()
                  }
                  // console.log(res);
                })
          },
          //调整取消框
          cancelChange(){
            this.adjustment = false
          },
          //子组件的参数
          getMsg(msg){
            console.log(msg)
            // this.today = a
          },
          //申请信用额度弹框
          alertBox(){
            let dataa = {}
            dataa.guestId = this.rowMessage.guestId
            dataa.orgId = this.rowMessage.orgid
            // console.log(dataa)
            guestAdjust(dataa).then(res => {
                if(res.code === 0){
                    this.applicationArr = res.data
                    this.payable = res.data.payable||{}
                }
            })
          },
          //确定申请
          Determined(){
            let data = {}
            data.guestId = this.rowMessage.guestId
            data.orgId = this.rowMessage.orgid
            data.fixationQuotaTotal = +this.creaditList.applyQuota+this.creaditList.creditLimit || 0 + (+this.creaditList.applyQuota)
            data.tempQuotaTotal = +this.creaditList.tempQuota + this.creaditList.tempCreditLimit || 0 + (+this.creaditList.tempQuota)
            data.applyQuota = this.creaditList.applyQuota || 0
            data.tempQuota = this.creaditList.tempQuota || 0
            data.tempStart = tools.transTime(this.creaditList.tempStart)
            data.tempEnd = tools.transTime(this.creaditList.tempEnd)
            data.payableAmt = this.payable.payableAmt || 0
            data.tgrade = this.creaditList.tgrade || ''
            data.thirtyAmt = this.payable.thirtyAmt || 0
            data.sixtyAmt = this.payable.sixtyAmt || 0
            data.moreSixtyAmt = this.payable.moreSixtyAmt || 0
            data.afterAdjustQuota = this.creaditList.totalSum
            data.quotaReason = this.creaditList.quotaReason || ''
            data.receivableAmt = this.payable.receivableAmt || 0
            data.totalQuota = (+this.creaditList.applyQuota+this.creaditList.creditLimit) + (+this.creaditList.tempQuota + this.creaditList.tempCreditLimit) || 0
            data.addTotalQuota = this.creaditList.tototo || 0
            data.adjustType = 0
            console.log(data)
            // save(data).then(res => {
            //   if(res.code === 0){
            //     this.CreditLineApplicationShow = false
            //     this.$Message.warning('保存成功')
            //     this.getListTop()
            //   }
            // })
          },
          //确定取消
          cancel2(){
            this.CreditLineApplicationShow = false
          }
        },
      mounted(){
          this.getListTop()
          this.information()
          this.informationTwo()
        const ToDayStr = () => {
          var returnStr = '';
          var date = new Date();      //当前时间
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          var day = date.getDate();
          //var hour = date.getHours();
          //var minutes = date.getMinutes();
          //var second = date.getSeconds();
          month = month < 10 ? "0" + month : month;
          day = day < 10 ? "0" + day : day;
          returnStr = year + "-" + month + "-" + day
          return returnStr;
        }
        this.today = ToDayStr()
        // console.log(this.today)
      }
    }
</script>

<style scoped lang="less">
  .customerCredit-box {
    background-color: #fff;
    border: 1px solid #eee;
    height: 100%;

  }
  .customerCredit-header{
    line-height: 57px;
    padding: 0 20px;
    border-bottom: 1px solid #eee;
  }
.customerCredit-title {
  padding: 10px;
  overflow: hidden;
  overflow-x: scroll;
}
  .record{
    height: calc(~"100% - 560px");
    padding: 10px;
    position: relative;
    padding-top: 21px;
  }
.creditRecord {
 line-height: 30px;
  border: 1px solid #eee;
  border-bottom: none;
  position: absolute;
  padding: 0 10px;
  background-color: #fff;
    top: -9px;
}
  .creditTitle {
    height: 100%;
    width: 100%;
    border: 1px solid #eee;
    display: flex;
  }
</style>
