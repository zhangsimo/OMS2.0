<template>
    <div class="customerCredit-box">
      <div class="customerCredit-header">
        <span>客户名称:</span>
        <Input  class="mr10"  style="width: 150px" />
        <span>授权业务员:</span>
        <Input  class="mr10"  style="width: 150px" />
        <span>业务员电话:</span>
        <Input  class="mr10"  style="width: 150px" />
        <Button type="warning" class="w90 mr10">
              <span class="center">
                <Icon custom="iconfont iconchaxunicon icons" />查询
              </span>
        </Button>
        <Button class=" mr10" @click="addLimit ">
              <span class="center">
               申请信用额度
              </span>
        </Button>
        <Button class=" mr10">
              <span class="center">
               申请信用调查
              </span>
        </Button>
        <Button class=" mr10">
              <span class="center">
               修改信用调查
              </span>
        </Button>
        <Button class=" mr10">
              <span class="center">
               额度调整
              </span>
        </Button>
      </div>
      <div class="customerCredit-title">
        <div style="width: 3000px;padding-right: 10px">
        <Table stripe  :columns="columns" :data="creditList" size="small" :loading="Loading" border height="350"></Table>
        </div>
      </div>
      <Page class="mr10" :total="page.total" :page-size="page.size" :current="page.num" show-sizer show-total class-name="page-con"
            @on-change="selectNum" @on-page-size-change="selectPage"></Page>
      <div class="record">
         <span class="creditRecord">客户信用额度记录</span>
        <div class="creditTitle">

            <Row :gutter="10">
              <Col span="12">
                <div style="margin-bottom: 10px">客户信用额度记录表</div>
                <Table :columns="columns1" border stripe size="small" ></Table>
              </Col>
              <Col span="12">
                <div style="margin-bottom: 10px">客户信用额度记录表</div>
                <Table :columns="columns2" border stripe size="small" ></Table>
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
    export default {
        name: "customerCredit",
        components:{
            CreditLineApplication,
            SurveyList,
            QuotaAdjustment
        },
        data(){
            return {
                creditList:[],
                Loading: true,
                columns:[
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '基本信息',
                        align: 'center',
                        key: 'name',
                        children:[
                            {
                                title: '是否客户调查',
                                align: 'center',
                                key: 'name'
                            },
                            {
                                title: '客户名称',
                                align: 'center',
                                key: 'name'
                            },
                            {
                                title: '信用额度',
                                align: 'center',
                                key: 'name'
                            },
                            {
                                title: '客户分类',
                                align: 'center',
                                key: 'name'
                            },
                            {
                                title: '注册号',
                                align: 'center',
                                key: 'name'
                            },
                            {
                                title: '法定人',
                                align: 'center',
                                key: 'name'
                            },
                            {
                                title: '负责人电话',
                                align: 'center',
                                key: 'name'
                            },
                            {
                                title: '注册地址',
                                type: 'index',
                                align: 'center',
                                key: 'name'
                            },
                            {
                                title: '经营地址',
                                align: 'center',
                                key: 'name'
                            },
                            {
                                title: '注册资本(万)',
                                align: 'center',
                                key: 'name'
                            },
                            {
                                title: '授权采购',
                                align: 'center',
                                key: 'name'
                            },
                            {
                                title: '采购员电话',
                                align: 'center',
                                key: 'name'
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
                                key: 'name'
                            },
                            {
                                title: '制单日期',
                                align: 'center',
                                key: 'name'
                            },
                            {
                                title: '审核人',
                                align: 'center',
                                key: 'name'
                            },
                            {
                                title: '审核日期',
                                align: 'center',
                                key: 'name'
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
                        key:'name'
                    },
                    {
                        title:'本次申请额度',
                        align: 'center',
                        key:'name'
                    },
                    {
                        title:'调整后总额度',
                        align: 'center',
                        key:'name'
                    },
                    {
                        title:'申请额度类型',
                        align: 'center',
                        key:'name'
                    },
                    {
                        title:'申请额度原因',
                        align: 'center',
                        key:'name'
                    },
                    {
                        title:'申请人',
                        align: 'center',
                        key:'name'
                    },
                    {
                        title:'申请日期',
                        align: 'center',
                        key:'name'
                    },
                    {
                        title:'审核人',
                        align: 'center',
                        key:'name'
                    },
                    {
                        title:'审核日期',
                        align: 'center',
                        key:'name'
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
                        key:'name'
                    },
                    {
                        title:'申请人',
                        align: 'center',
                        key:'name'
                    },
                    {
                        title:'申请日期',
                        align: 'center',
                        key:'name'
                    },
                    {
                        title:'审核人',
                        align: 'center',
                        key:'name'
                    },
                    {
                        title:'审核日期',
                        align: 'center',
                        key:'name'
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
            }
        },
        methods:{
            selectNum(){},
            selectPage(){},
            addLimit(){
                this.CreditLineApplicationShow = true
            }
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
