<template>
  <div class="all-box">
  <div class="oper-top">
      <span class="ml10">快速查询：</span>
      <dateget class="mr10" @quickDate="quickDate"></dateget>
      <span class="mr10">申请日期：</span>
      <Date-picker
        type="daterange" 
        class="w200 mr20" 
        :options="options3"
        @on-change="dateChange" 
        placeholder="请选择日期"
        >
        </Date-picker>
      <Button type="warning" class="mr20" @click="serchCredit"><Icon custom="iconfont iconchaxunicon icons"/>查询</Button>
      <Button type="default" class="mr10" @click="openDetail"><Icon custom="iconfont iconshenheicon icons"/>查看明细</Button>
    </div>
    <div class="Credtitle">
      <Table height="400" @on-row-click="onRowClick" highlight-row border :columns="columns" :data="creditList" show-summary :summary-method="handleSummary"></Table>
    </div>
    <div class="flowImg">
      <div style=" border: 1px solid #eee;">
        <p class="flowImg-title">额度审批流程</p>
        <div>
          <Row class="expand-row">
            <Col class="mr50 " span="2">
                <span>额度审批流程</span>
            </Col>
            <Col span="14" class="mt10">
              <Steps :current="stepsCurrent" :status="stepsStatus">
                <Step title="提交申请"></Step>
                <Step title="店长审批"></Step>
                <Step title="区域总经理"></Step>
                <Step title="财务总监"></Step>
              </Steps>
            </Col>
          </Row>
          <Row class="expand-row">
            <Col class="mr50 " span="2">
                <span>审批人</span>
            </Col>
            <Col span="4">
                <span>苏义（员工）</span>
            </Col>
            <Col span="4">
                <span>黄春贵（店长）</span>
            </Col>
            <Col span="4">
              <span>王华（销售总监）</span>
            </Col>
            <Col span="4">
              <span></span>
            </Col>
          </Row>
          <Row class="expand-row">
            <Col class="mr50 " span="2">
                <span>审批意见</span>
            </Col>
            <Col span="4">
                <span style="color: #40A6FF">提交申请</span>
            </Col>
            <Col span="4">
                <span style="color: #40A6FF">同意</span>
            </Col>
            <Col span="4">
              <span style="color: #FD5C5C">审批不通过</span>
            </Col>
            <Col span="4">
              <span></span>
            </Col>
          </Row>
          <Row class="expand-row">
            <Col class="mr50 " span="2">
                <span>审批时间</span>
            </Col>
            <Col span="4">
                <span>2019-11-19 15:00:00</span>
            </Col>
            <Col span="4">
                <span>2019-11-19 15:00:00</span>
            </Col>
            <Col span="4">
              <span>2019-11-19 15:00:00</span>
            </Col>
            <Col span="4">
              <span></span>
            </Col>
          </Row>
        </div>
      </div>
    </div>
<!--信用额度查看-->
    <Modal v-model="CreditLineApplicationShow" title="客户信用额度表" width="900" :mask-closable="false">
      <CreditLineApplication :data="creaditList"></CreditLineApplication>
      <div slot='footer'>
        <!-- <Button type='primary' >确定</Button> -->
        <Button type='default' @click="CreditLineApplicationShow = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import CreditLineApplication from './CreditLineApplication'
  import dateget from '../../../../components/getDate/dateget'
  import '../../../../components/getDate/index'
  import {
    getCreditApprovalTable,
    conditionalQuery
    } from '../../../../api/system/essentialData/creditApproval'
    export default {
        name: "CreditApproval",
        components:{
            CreditLineApplication,
            dateget
        },
        data(){
            return {
              options3: {
                disabledDate (date) {
                  return date && date.valueOf() > Date.now();
                }
              },
              // 申请日期数据
                dateList: {
                  startApplyTime:"",
                  endApplyTime:"",
                  startTime: "",
                  endTime: ""
                },
                dateArray: [],
                // 快速查询数据
                quickList: {
                  startTime:"",
                  endTime:""
                },
                quickArray: [],
                searchType1:'',
                // 表格数据
                columns:[
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center',
                        // render: (h, params) => {
                        //     return h('span',{class:'table-radio'})
                        // }
                    },
                    {
                        title: '业务单号',
                        align: 'center',
                        key: 'serviceId'
                    },
                    {
                        title: '单据状态',
                        align: 'center',
                        key: 'auditSign',
                        Width: 40,
                        render:(h ,params)=>{
                          // console.log(params)
                          let JsonString = params.row.auditSign
                          let auditsign = JSON.parse(JsonString)
                          // console.log(auditsign)
                          if (auditsign === null) {
                            return h('span', {}, "")
                          }else{
                            return h('span', {}, auditsign.name)
                          }
                        }
                    },
                    {
                        title: '主题',
                        align: 'center',
                        key: 'quotaReason',
                        // render:(h ,params)=>{
                        //     let text = params.row.gender == 0 ? '男' : '女'
                        //     return h('span' ,{}, text)
                        // }
                    },
                    {
                        title: '客户名称',
                        align: 'center',
                        key: 'guestName',
                        // render: (h, params) => {
                        //     return h('span', {}, transTime(params.row.birthDay))
                        // },
                    },
                    {
                        title:'客户编码',
                        align: 'center',
                        key:'guestCode'
                    },
                    {
                        title:'当前额度',
                        align: 'center',
                        key:'applyQuota',
                        // render:(h , params) => {
                        //     let text = params.row.openSystem ? '是':'否'
                        //     return h('span' , {} ,text)
                        // }
                    },
                    {
                        title:'申请时间',
                        align: 'center',
                        key:'applyDate',
                        // render:(h ,params) => {
                        //     let text = params.row.office ? '是' : '否'
                        //     return h('span' ,{} ,text)
                        // }
                    },
                    {
                        title:'提交人',
                        align: 'center',
                        key:'applyMan'
                    },

                ],
                creditList:[],
                creditData:{
                  id: ''
                },
                CreditLineApplicationShow:false,
                creaditList:{},
                // 步骤条数据
                stepsCurrent: 2,
                stepsStatus: 'error'
            }
        },
        mounted () {
          this.getCredit()
        },
        methods:{

          // 获取页面数据
          getCredit () {
            getCreditApprovalTable().then(res => {
              if (res.code === 0 ) {
                this.creditList = res.data
              }
            })
          },
          // 根据条件查询数据
          serchCredit () {
              if(this.dateArray[0]){
              this.dateList.startApplyTime = this.dateArray[0] + " " + "00:00:00"
              this.dateList.endApplyTime = this.dateArray[1] + " " + "23:59:59"
              }else{
              this.dateList.startTime = this.quickArray[0] || ''
              this.dateList.endTime = this.quickArray[1] || ''
              }
              conditionalQuery(this.dateList).then(res => {
                if(res.code === 0){
                  this.creditList = res.data
                }
            }) 
          },
          // 获取快速查询
          quickDate (item) {
            // console.log(item)
            this.quickArray = item
            // this.quickList.startTime = item[0]
            // this.quickList.endTime = item[1]
            // console.log(this.quickList)
          },
          // 获取日期
          dateChange (value) {
            // console.log(value)
            this.dateArray = value
            // if(value[0] === ""){
            //   this.dateList = {}
            // }else {
            //   this.dateList.startApplyTime = value[0] + " " + "00:00:00"
            //   this.dateList.endApplyTime = value[1] + " " + "23:59:59"
            // }
          },
          handleSummary({ columns, data }) {
            // console.log(columns, data);
            const sums = {};
            columns.forEach((column, index) => {
              const key = column.key;
              if (key === "serviceId") {
                sums[key] = {
                  key,
                  value: data.length
                };
                return;
              }
              sums[key] = {
                key,
                value: ""
              };
            });

            return sums;
          },
          // 查看明细
          openDetail(){
            if (this.creditData.id === '') {
              this.$Message.error('请选择一条数据')
            } else {
              this.CreditLineApplicationShow = true
            }
          },
          // 单击表格行获取行数据
          onRowClick (value) {
            // console.log(value)
            this.creditData.id = value.id
          }
        }
    }
</script>

<style scoped lang="less">
.all-box {
  background-color: #fff;
  .oper-top {
    line-height: 57px;
    border-bottom: 1px solid #eee;
  }
  .Credtitle {
    padding: 10px;
  }
  .flowImg {
    padding: 10px;
    // background-color: #EEDEE2;
    .flowImg-title {
      line-height:35px;
      border-bottom: 1px solid #eee;
      padding: 0 10px;
      font-size: 18px;
      font-weight: bold;
    }
    .expand-row{
      margin-left: 20px;
      line-height: 50px;
    }
  }
  .flowTitle {
    line-height: 57px;
    // font-size: 24px;
    padding-left: 10px;
  }
  .flow {
    font-size: 14px;
    padding: 10px 0;
    overflow: hidden;
    .titlecenter{
      width: 120px;
      text-align: right;  
      /*background-color: #000;*/
      .oneHeight {
        line-height: 50px;
      }
      .twoHeight {
        line-height: 30px;
      }
    }
  }
}
</style>
