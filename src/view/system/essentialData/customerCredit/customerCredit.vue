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
        <Button class=" mr10" v-show="this.state === 1 && this.Limitstate === 2">
              <span class="center">
               修改信用调查
              </span>
        </Button>
        <Button class=" mr10" @click="openAdjustment" v-show="this.state === 1 && this.Limitstate === 2">
              <span class="center">
               额度调整
              </span>
        </Button>
      </div>
      <div class="customerCredit-title">
        <div style="width: 3000px;padding-right: 10px">
          <!--<Table :stripe="true"  :columns="columns" :data="creditList" size="small" :loading="Loading" border @on-row-click="selection" class="table-highlight-row" highlight-row></Table>-->
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
        <CreditLineApplication :data="creaditList"></CreditLineApplication>
        <div slot='footer'>
          <Button type='primary' >确定</Button>
          <Button type='default' >取消</Button>
        </div>
      </Modal>
<!--      申请信用调查-->

      <Modal v-model="surveyShow" title="信用调查表" width="900">
        <SurveyList :data="surveyAllList"></SurveyList>
        <div slot='footer'>
          <Button type='primary' >确定</Button>
          <Button type='default' >取消</Button>
        </div>
      </Modal>
<!--      额度调整-->
      <Modal v-model="adjustment" title="客户信用额度调整表">
        <QuotaAdjustment :data="adjustmentOne"></QuotaAdjustment>
        <div slot='footer'>
          <Button type='primary' >确定</Button>
          <Button type='default' >取消</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
  import CreditLineApplication from "./CreditLineApplication";
  import QuotaAdjustment from "./QuotaAdjustment";
  import SurveyList from "./SurveyList";
  import {queryCreditList,guestCreditHistory} from '../../../../api/system/CustomerManagement/CustomerManagement'
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
                                key: 'salesMan   '
                            },
                            {
                                title: '采购员电话',
                                align: 'center',
                                key: 'salesManTel'
                            },
                        ]
                    },
                    {
                        title:'业务信息',
                        align:'centre',
                        children: [
                            {
                                title: '制单人',
                                align: 'center',
                                key: ' createUname'
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
                rowMessage:'' //当前的客户信息
            }
        },
        methods:{
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
            this.state = row.isGuestResearch
            this.ID = row.guestId
            this.Limitstate = JSON.parse(row.auditSign).value
            // console.log(this.Limitstate)
            this.rowMessage = row
             this.creaditList = this.rowMessage
            console.log(this.creaditList)
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
              console.log(1112)
                if(this.Limitstate === 1){
                    this.$Message.warning('正在审批中，请等待审批完成!')
                }else if(this.Limitstate === 3){
                    this.$Message.warning('禁止额度申请中，请联系管理员!')
                }else{
                    this.CreditLineApplicationShow = true
              }
            }else{
              this.$Message.warning('请选择要申请的客户！')
            }
            },
            //申请信用调查
            opensurveyShow(){
                this.surveyShow = true
            },
            //额度调用
            openAdjustment(){
                this.adjustment = true
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
              params.salesMan = this.salesman
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
          }
        },
      mounted(){
          this.getListTop()
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
