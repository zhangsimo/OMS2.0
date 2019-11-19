<template>
  <div class="all-box">
  <div class="oper-top">
      <span class="ml10">快速查询：</span>
      <Select v-model="searchType1" class="w100 mr10" clearable>
        <Option v-for="item in List" :value="item.value" :key="item.value">{{ item.name }}</Option>
      </Select>
      <span class="mr10">申请日期：</span>
      <Date-picker
        @on-change="getBeginDate"
        :options='startTimeOption'
        :value="dateObj.startTime"
        class="w200 mr10"
        type="date"
        placeholder="选择开始日期"
      ></Date-picker>
      <Date-picker
        @on-change="getEndDate"
        :options="endTimeOption"
        :value="dateObj.endTime"
        class="w200 mr20"
        type="date"
        placeholder="选择结束日期"
      ></Date-picker>
      <!-- <DatePicker @on-change="selectDate" type="daterange" placement="bottom-start" placeholder="选择日期"
                  class="w200 mr20">
      </DatePicker> -->
      <Button type="warning" class="mr20" ><Icon custom="iconfont iconchaxunicon icons"/>查询</Button>
      <Button type="default" class="mr10" @click="openDetail"><Icon custom="iconfont iconshenheicon icons"/>查看明细</Button>
    </div>
    <div class="Credtitle">
      <Table height="400" class="table-highlight-row" size="small" highlight-row  border :stripe="true" :columns="columns" :data="creditList" border show-summary :summary-method="handleSummary"></Table>
    </div>
    <div class="flowImg">
      <div style=" border: 1px solid #eee;">
        <p class="flowImg-title">额度审批流程</p>
        <!-- <div class="flow">
          <div class="titlecenter">
            <p class="oneHeight">额度审批流程</p>
            <p class="oneHeight">审批人</p>
            <p class="oneHeight">审批意见</p>
            <p class="oneHeight">审批时间</p>
          </div>
        </div> -->
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
    <Modal v-model="CreditLineApplicationShow" title="客户信用额度表" width="900">
      <CreditLineApplication :data="creaditList"></CreditLineApplication>
      <div slot='footer'>
        <!-- <Button type='primary' >确定</Button> -->
        <Button type='default'>关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import CreditLineApplication from './CreditLineApplication'
    export default {
        name: "CreditApproval",
        components:{
            CreditLineApplication
        },
        data(){
            return {
              // 申请日期数据
                dateObj:{
                  startTime: '',
                  endTime: '',
                },
                startTimeOption:{},
                endTimeOption:{},
                // 快速查询数据
                List:[
                    {name:'昨日', value:'yesterday'},
                    {name:'今日', value:'today'},
                    {name:'上周', value:'lastWeek'},
                    {name:'本周', value:'week'},
                ],
                searchType1:'today',
                // 表格数据
                columns:[
                    {
                        title: '序号',
                        key: 'id',
                        width: 70,
                        align: 'center',
                        // render: (h, params) => {
                        //     return h('span',{class:'table-radio'})
                        // }
                    },
                    {
                        title: '业务单号',
                        align: 'center',
                        key: 'userName'
                    },
                    {
                        title: '单据状态',
                        align: 'center',
                        key: 'phone',
                        minWidth: 80
                    },
                    {
                        title: '主题',
                        align: 'center',
                        key: '',
                        render:(h ,params)=>{
                            let text = params.row.gender == 0 ? '男' : '女'
                            return h('span' ,{}, text)
                        }
                    },
                    {
                        title: '客户名称',
                        align: 'center',
                        key: 'birthDay',
                        // render: (h, params) => {
                        //     return h('span', {}, transTime(params.row.birthDay))
                        // },
                    },
                    {
                        title:'客户编码',
                        align: 'center',
                        key:'loginName'
                    },
                    {
                        title:'当前额度',
                        align: 'center',
                        key:'',
                        render:(h , params) => {
                            let text = params.row.openSystem ? '是':'否'
                            return h('span' , {} ,text)
                        }
                    },
                    {
                        title:'申请时间',
                        align: 'center',
                        key:'',
                        render:(h ,params) => {
                            let text = params.row.office ? '是' : '否'
                            return h('span' ,{} ,text)
                        }
                    },
                    {
                        title:'提交人',
                        align: 'center',
                        key:'groupName'
                    },

                ],
                creditList:[],
                CreditLineApplicationShow:false,
                creaditList:{},
                // 步骤条数据
                stepsCurrent: 2,
                stepsStatus: 'error'
            }
        },
        methods:{
            // selectDate(data){
            // console.log(data)
            // },
                // 获取申请开始日期
            getBeginDate(startTime) {
              // console.log(startTime);
              this.endTimeOption = {
                disabledDate(endTime) {
                  return endTime < new Date(startTime)
                }
              }
              this.dateObj.startTime = startTime;
            },
            // 获取申请结束日期
            getEndDate(endTime) {
              // console.log(endTime);
              this.startTimeOption = {
                  disabledDate(startTime) {
                      return startTime > new Date(endTime) || startTime > Date.now()
                  }
              }
              this.dateObj.endTime = endTime;
            },
            handleSummary ({ columns, data }) {
                const sums = {};
                columns.forEach((column, index) => {
                    const key = column.key;
                    if (index === 0) {
                        sums[key] = {
                            key,
                            value: '总价'
                        };
                        return;
                    }
                    const values = data.map(item => Number(item[key]));
                    if (!values.every(value => isNaN(value))) {
                        const v = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[key] = {
                            key,
                            value: v + ' 元'
                        };
                    } else {
                        sums[key] = {
                            key,
                            value: 'N/A'
                        };
                    }
                });

                return sums;
            },
            openDetail(){
                this.CreditLineApplicationShow = true
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
