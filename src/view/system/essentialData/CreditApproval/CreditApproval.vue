<template>
  <div class="all-box">
  <div class="oper-top">
        <span class="mr10">快速查询：</span>
        <Select v-model="searchType1" class="w100 mr10">
          <Option v-for="item in List" :value="item.value" :key="item.value">{{ item.name }}</Option>
        </Select>
        <span class="mr10">申请日期：</span>
        <DatePicker @on-change="selectDate" type="daterange" placement="bottom-start" placeholder="选择日期"
                    class="w200 mr20">
        </DatePicker>
        <Button type="warning" class="mr20" ><Icon custom="iconfont iconchaxunicon icons"/>查询</Button>
        <Button type="warning" class="mr10" @click="openDetail" >查看明细</Button>
     </div>
    <div class="Credtitle">
      <Table height="400" class="table-highlight-row" size="small" highlight-row  border :stripe="true" :columns="columns" :data="creditList" border show-summary :summary-method="handleSummary"></Table>
    </div>
    <div class="flowImg">
      <div style=" border: 1px solid #eee;">
    <p style="line-height:35px;border-bottom: 1px solid #eee;padding: 0 10px">流程图</p>
        <div class="flowTitle">
          <span>开始</span>
          <span>1 -></span>
          <span>提交申请</span>
          <span>2 -></span>
          <span>店长审核</span>
          <span>3 -></span>
          <span>区域总经理</span>
          <span>4 -></span>
          <span>佳配财务总检</span>
          <span>-></span>
          <span>结束</span>
        </div>
      </div>
    </div>
    <div class="flow">
        <div class="titlecenter">
          <p class="oneHeight">对账流程</p>
          <p class="twoHeight">审批人</p>
          <p class="twoHeight">审批意见</p>
          <p class="twoHeight">审批时间</p>
        </div>
    </div>

<!--信用额度查看-->
    <Modal v-model="CreditLineApplicationShow" title="客户信用额度表" width="900">
      <CreditLineApplication :data="creaditList"></CreditLineApplication>
      <div slot='footer'>
        <Button type='primary' >确定</Button>
        <Button type='default' >取消</Button>
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
                List:[
                    {name:'昨日', value:'yesterday'},
                    {name:'今日', value:'today'},
                    {name:'上周', value:'lastWeek'},
                    {name:'本周', value:'week'},
                ],
                searchType1:'today',
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
                creaditList:{}
            }
        },
        methods:{
            selectDate(data){
            console.log(data)
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

  }
  .flowTitle {
    line-height: 57px;
    font-size: 24px;
    padding-left: 10px;
  }
  .flow {
    font-size: 14px;
    padding: 10px 0;
    .titlecenter{
      width: 100px;
      text-align: center;
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
