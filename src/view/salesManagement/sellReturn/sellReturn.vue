<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf wlf-center">
          <div class="db">
            <span>快速查询：</span>
          </div>
          <div class="db">
<!--            <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>-->
            <getDate class="mr10"  @quickDate="getvalue" ></getDate>
          </div>
          <div class="db">
<!--            <Select v-model="salesType" class="w90 mr10">-->
<!--              <Option-->
<!--                v-for="item in salesTypeArr"-->
<!--                :value="item.value"-->
<!--                :key="item.value"-->
<!--                >{{ item.label }}</Option-->
<!--              >-->
<!--            </Select>-->
            <Select v-model="orderType" style="width:100px" class="mr10" @on-change="getOrderType">
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db">
            <Button
              type="default"
              class="mr10"
              @click=" moreQueryShowModal"
            >
              <Icon type="ios-more" />更多</Button
            >
          </div>
          <div class="db">
            <Button class="mr10"
              ><Icon type="md-add" /> 新增</Button
            >
          </div>
          <div class="db">
            <Button type="default"  class="mr10"
              ><i class="iconfont mr5 iconbaocunicon"></i>保存</Button
            >
          </div>
          <div class="db">
            <Button class="mr10"
              ><i class="iconfont mr5 iconziyuan2"></i>提交</Button
            >
          </div>
          <div class="db">
            <Button class="mr10"
              ><i class="iconfont mr5 iconshenheicon"></i> 退货入库</Button
            >
          </div>
          <div class="db">
            <Button  class="mr10"
              ><Icon type="md-close" size="14" /> 作废</Button
            >
          </div>
          <div class="db">
            <Button  class="mr10"
              ><i class="iconfont mr5 icondayinicon"></i> 打印</Button
            >
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <div class="con-split" ref="paneLeft">
          <Split v-model="split1" min="300" max="500">
            <div
              slot="left"
              class="con-split-pane-left"
              style="overflow-y: auto; height: 100%;"
            >
              <div class="pane-made-hd">
                销售退货列表
              </div>
              <Table
                :queryTime="queryTime"
                :orderType ="orderType"
                height="660"
                size="small"
                highlight-row
                border
                :stripe="true"
                :loading="sellOrderTable.loading"
                :columns="sellOrderTable.columns"
                :data="sellOrderTable.tbdata"
              ></Table>


              <Page :total="page.total" :page-size="page.size" :current="page.num" show-sizer show-total class-name="page-con"
                    @on-change="selectNum" @on-page-size-change="selectPage" class="mr10"></Page>
            </div>
            <div slot="right" class="con-split-pane-right pl5 goods-list-form"  style="overflow-y: auto; height: 100%;">
              <div class="pane-made-hd">
                销售退货信息
              </div>
              <div class="clearfix purchase" ref="planForm">
                <Form
                  inline
                  ref="formPlan"
                  :model="formPlan"
                  :label-width="120"
                  :rules="ruleValidate"
                >
                  <FormItem label="客户：">
                    <Row>
                      <Select v-model="formPlan.guestId" filterable style="width: 240px">
                        <Option v-for="item in client" :value="item.id" :key="item.id">{{ item.fullName }}</Option>
                      </Select>
                      <Button  class="ml5" size="small" type="default"  @click="CustomerShowModel"><Icon type="md-checkmark" /></Button>

                    </Row>
                  </FormItem>
                  <FormItem label="退货员：" >
                    <Input
                      class="w160"
                      placeholder="请输入退货员"
                      v-model="formPlan.purchaser"
                    />
                  </FormItem>
                  <FormItem label="退货日期：">
                    <DatePicker
                      style="width: 160px"
                      type="date"
                      placeholder="请选择退货日期"
                      v-model="formPlan.orderDate"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="往来单号：">
                    <Input class="w160" v-model="formPlan.orderId" />
                  </FormItem>
                  <FormItem label="退货原因：" >
                    <Select class="w160" v-model="formPlan.ReturnType">
                      <Option
                        v-for="item in thTypes"
                        :key="item.value"
                        :value="item.value"
                        >{{ item.label }}</Option
                      >
                    </Select>
                  </FormItem>

                  <FormItem label="结算方式：" >
                    <Select class="w160" v-model="formPlan.settlement">
                      <Option
                        v-for="item in settleMethods"
                        :key="item.value"
                        :value="item.value"
                        >{{ item.label }}</Option
                      >
                    </Select>
                  </FormItem>
                  <FormItem label="备注：">
                    <Input
                      placeholder="请输入备注"
                      class="w160"
                      v-model="formPlan.mark"
                    />
                  </FormItem>
                  <FormItem label="入库仓：">
                    <Select class="w160" v-model="formPlan.warehouse">
                      <Option
                        v-for="item in inStores"
                        :key="item.value"
                        :value="item.value"
                        >{{ item.label }}</Option
                      >
                    </Select>
                  </FormItem>
                  <FormItem label="退货单号：">
                    <Input class="w160" v-model="formPlan.returnId" />
                  </FormItem>
                </Form>
              </div>
              <div class="flex plan-cz-btn" ref="planBtn">
                <div class="clearfix">
                  <div class="fl mb5">
                    <Button
                      size="small"
                      class="mr10"
                      @click="SalesOutboundShowModel"
                    >
                      选择销售出库单</Button
                    >
                  </div>
                  <div class="fl mb5">
                    <Button size="small" class="mr10"
                      ><Icon custom="iconfont iconlajitongicon icons" />
                      删除配件</Button
                    >
                  </div>
                </div>
              </div>
              <vxe-table
                border
                resizable
                size="mini"
                height='500'
                :data="tableData"
                :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
              >
                <vxe-table-column
                  type="index"
                  width="60"
                  title="序号"
                ></vxe-table-column>
                <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                <!-- <vxe-table-column title="操作" width="80">
                  <template v-slot="{ row }">
                    <Button type="text">查看</Button>
                  </template>
                </vxe-table-column> -->

                <vxe-table-column
                  field="name"
                  title="配件编码"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="role"
                  title="配件名称"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="sex"
                  title="品牌"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column field="num" title="可退数量" width="120">
                  <template v-slot:edit="{ row }">
                    <InputNumber
                      :max="9999"
                      :min="0"
                      v-model="row.num"
                    ></InputNumber>
                  </template>
                </vxe-table-column>

                <vxe-table-column field="num" title="退货数量" width="120" :edit-render="{name: 'input'}" >
                  <template v-slot:edit="{ row }">
                    <InputNumber
                      :max="9999"
                      :min="0"
                      v-model="row.num"
                    ></InputNumber>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="price" title="单价" width="120" :edit-render="{name: 'input'}">
                  <template v-slot:edit="{ row }">
                    <InputNumber
                      :max="9999"
                      :min="0"
                      v-model="row.price"
                    ></InputNumber>
                  </template>
                  <template v-slot="{ row }">
                    {{ row.price | priceFilters }}
                  </template>
                </vxe-table-column>
                <vxe-table-column title="金额" filed="totalprice" width="120":edit-render="{name: 'input'}" >
                  <template v-slot="{ row }">
                    {{ (row.price * row.num) | priceFilters }}
                  </template>
                </vxe-table-column>
                <vxe-table-column
                  field="num6"
                  title="备注"
                  width="100"
                  :edit-render="{name: 'input'}"
                ></vxe-table-column>
                <vxe-table-column
                  field="date12"
                  title="仓库"
                 :edit-render="{name: 'select', options: inStores}"
                  width="100"

                ></vxe-table-column>
                <vxe-table-column
                  field="date12"
                  title="仓位"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="date12"
                  title="品牌车型"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="date12"
                  title="单位"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="date12"
                  title="OE码"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="date12"
                  title="规格"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="date12"
                  title="方向"
                  width="100"
                ></vxe-table-column>

                <vxe-table-column
                  field="date12"
                  title="配件内码"
                  width="100"
                ></vxe-table-column>
              </vxe-table>
            </div>
          </Split>
        </div>
      </div>
    </section>

  <!--    选择客户-->
    <select-the-customer ref="selectTheCustomer" @getOne="setOneClient"></select-the-customer>
    <!--更多 搜索-->
    <More-query :data="moreQueryList" ref="moreQuery"></More-query>
    <!-- 选择销售出库单 -->
    <Sales-outbound ref="salesOutbound"></Sales-outbound>
  </div>
</template>

<script>

  import {getLeftList,getClient} from "_api/salesManagment/sellReturn.js";
  import selectTheCustomer from '../commonality/SelectTheCustomer.vue'
  import SalesOutbound from './components/SalesOutbound.vue';
  import MoreQuery from "../commonality/MoreQuery.vue";
  import getDate from '@/components/getDate/dateget'
  export default {
    name:'sellReturn',
    components: {
      // QuickDate,
      selectTheCustomer,
      SalesOutbound,
      MoreQuery,
      getDate
    },
    data(){
      return {
        page:{
          total:0,
          size:10,
          num:1
        },
        moreQueryList:{},//更多查询
        orderType:99,  //快速查询状态
        typeList:[
          {value:99,name:'所有'},
          {value:0,name:'草稿'},
          {value:2,name:'待入库'},
          {value:4,name:'已入库'},
          {value:7,name:'已作废'}
        ],

        queryTime:'',  //快速查询时间
        client:[],//客户列表
        sellOrderTable:{
          loading: false,
          columns: [
            {
              title: '序号',
              minWidth: 50,
              type: 'index',
              align: 'center'
            },
            {
              title: '状态',
              render: (h, params) => {
                let tex = params.row.status.name
                return h('span', {}, tex)

              },
              minWidth: 70
            },
            {
              title: '客户',
              key: 'guestName',
              minWidth: 170
            },
            {
              title: '退货日期',
              key: 'orderDate',
              minWidth: 120
            },
            {
              title: '退货员',
              key: 'orderMan',
              minWidth: 120
            },

            {
              title: '退货单号',
              key: 'serviceId',
              minWidth: 200
            },
            {
              title: '打印次数',
              key: 'printTimes',
              minWidth: 120
            },
            {
              title: '创建人',
              key: 'auditor',
              minWidth: 100
            },
            {
              title: '创建日期',
              align:'center',
              key: 'createTime',
              minWidth: 170
            },
            {
              title: '提交人',
              key: 'auditDate',
              minWidth: 100
            },
            {
              title: '提交日期',
              align:'center',
              key: 'submitDate',
              minWidth: 170
            },

          ],
          tbdata:[],

        }, //表格属性
        formPlan:{},//表单对象
        split1:0.2,//左右框
        inStores:[],// 入库仓
        settleMethods:[],//结算方式
        tableData:[],//右侧表格list
        thTypes:[], //退货类型
       ruleValidate:{ //表单校验
       name: [
       { required: true, message: 'The name cannot be empty', trigger: 'blur' }
     ],
   }
      }
    },
    mounted() {
      this.getLeftList()
    },
    methods:{
      //获取选择状态类型
      getOrderType(v){
        this.orderType=v
        console.log('获取的状态时间',this.orderType)
      },
      //打开新增客户
      CustomerShowModel(){
        this.$refs.selectTheCustomer.openModel()
      },
      //客户列表
      getAllClient(){
        getClient().then(res=>{
          // console.log('打印出来的客户数据',res)
          if(res.code===0){
            this.client = res.data
          }
        })
      },
      //选择销售出库单
       SalesOutboundShowModel(){
        // console.log(this.$refs.salesOutbound)
        this.$refs.salesOutbound.openModal()
       },
      //选择更多
      moreQueryShowModal(){
        this.$refs.moreQuery.openModal()
      },
      //获取时间
      getvalue(date){
        this.queryTime = date
        console.log('获取的时间啊啊',this.queryTime[0])
      },
      //切换页面
      selectNum(){},
      //切换页数
      selectPage(){},
      //获取搜索框内的数据
      setOneClient(val){
        console.log('数据',val)
        this.$set(this.formPlan,"guestId",val.id);
      },
      //获取左侧数据
      getLeftList(){
        let data={}
         data.startTime =this.queryTime[0]||''
         data.endTime = this.queryTime[1]||''
        // data.status= this.orderType
        // params=this.query
        let page = this.page.num -1
        let size = this.page.size
        getLeftList(page,size,data).then(res=>{
          console.log('左侧数据',res)
          if(res.code===0){
            this.sellOrderTable.tbdata = res.data.content || []
            this.page.total = res.data.totalElements
          }
        })
      }
    },
    watch:{
      //监听时间
      queryTime:function (val ,old) {
        this.page.num = 1
        this.page.size = 10
        this.getLeftList()
      },
      //监听状态
      orderType:function (val ,old) {
        this.page.num = 1
        this.page.size = 10
        this.getLeftList()

      },
      formPlan:{
        handler(val ,old){
        },
        deep:true
      }
    }
  }
</script>

<style lang="less" scoped>
@import url("../../lease/product/lease.less");
@import url("./index");
</style>
