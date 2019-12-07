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
            <Select v-model="orderType" style="width:100px" class="mr10" @on-change="getOrderType">
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db">
            <Button
              type="default"
              class="mr10"
              @click="moreQueryShowModal"
            >
              <Icon type="ios-more"/>
              更多
            </Button
            >
          </div>
          <div class="db">
            <Button class="mr10"
            >
              <Icon type="md-add"/>
              新增
            </Button
            >
          </div>
          <div class="db">
            <Button type="default" class="mr10"
            ><i class="iconfont mr5 iconbaocunicon"></i>保存
            </Button
            >
          </div>
          <div class="db">
            <Button class="mr10"
            ><i class="iconfont mr5 iconziyuan2"></i>提交
            </Button
            >
          </div>
          <div class="db">
            <Button class="mr10"
            ><i class="iconfont mr5 icondayinicon"></i> 打印
            </Button
            >
          </div>

          <div class="db">
            <Button class="mr10"
            >
              <Icon type="md-close" size="14"/>
              作废
            </Button
            >
          </div>
          <div class="db">
            <Button class="mr10"
            ><i class="iconfont mr5 icondaochuicon"></i> 导出
            </Button
            >
          </div>
          <div class="db">
            <Button class="mr10"
            ><i class="iconfont mr5 "></i> 完成销售
            </Button
            >
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <div class="con-split" ref="paneLeft">
          <Split v-model="split1" min="300" max="500">
            <!--   左边表格-->
            <div
              slot="left"
              class="con-split-pane-left"
              style="overflow-y: auto; height: 100%;"
            >
              <div class="pane-made-hd">
                预销售单列表
              </div>
              <Table
                :queryTime="queryTime"
                :orderType ="orderType"
                height="660"
                size="small"
                highlight-row
                border
                :stripe="true"
                :loading="preSellOrderTable.loading"
                :columns="preSellOrderTable.columns"
                :data="preSellOrderTable.tbData"
                @on-current-change="selectTabelData"
              ></Table>


              <Page :total="page.total" :page-size="page.size" :current="page.num" show-sizer show-total
                    class-name="page-con"
                    @on-change="selectNum" @on-page-size-change="selectPage" class="mr10"></Page>
            </div>
            <!-- 右边表格-->
            <div slot="right" class="con-split-pane-right pl5 goods-list-form" style="overflow-y: auto; height: 100%;">
              <div class="pane-made-hd">
                <span class="titler mr5">固定额度:</span>
                <span class="titler mr10">{{ 31231 |priceFilters}}</span>
                <span class="titler mr5">临时余额:</span>
                <span class="titler mr10">{{ 31231 |priceFilters}}</span>
                <span class="titler mr5">可用余额:</span>
                <span class="titler mr5">{{ 31231 |priceFilters}}</span>
              </div>
              <div class="clearfix purchase" ref="planForm">
                <Form
                  inline
                  ref="formPlan"
                  :model="formPlan"
                  :label-width="120"
                  :rules="ruleValidate"
                >
                  <FormItem label="客户：" prop="guestId">
                    <Row  style="width: 310px">
                      <Select v-model="formPlan.guestId" filterable style="width: 240px" :disabled="draftShow != 0" >
                        <Option v-for="item in client" :value="item.id" :key="item.id">{{ item.fullName }}</Option>
                      </Select>
                      <Button  class="ml5" size="small" type="default"  @click="CustomerShowModel" :disabled="draftShow != 0"><Icon type="md-checkmark" /></Button>

                    </Row>
                  </FormItem>
                  <FormItem label="业务员：" prop="orderMan">
                    <Input
                      class="w160"
                      placeholder="请输入业务员"
                      v-model="formPlan.orderMan"
                      :disabled="draftShow != 0"
                    />
                  </FormItem>

                  <FormItem label="交货仓库：" prop="storeId" >
                    <Select v-model="formPlan.storeId" style="width:200px" :disabled="draftShow != 0">
                      <Option v-for="item in WareHouseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="预售单号：">
                    <Input class="w160" v-model="formPlan.serviceId" disabled/>
                  </FormItem>
                  <FormItem label="票据类型:" prop="billTypeId">
                    <Select v-model="formPlan.billTypeId" style="width:100px" :disabled="draftShow != 0">
                      <Option v-for="item in settleTypeList.CS00107" :value="item.id" :key="item.id">{{ item.itemName  }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="结算方式：" prop="settleTypeId">
                    <Select v-model="formPlan.settleTypeId" style="width:100px" :disabled="draftShow != 0">
                      <Option v-for="item in settleTypeList.CS00106" :value="item.id" :key="item.id">{{ item.itemName }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="预计发货日期:">
                    <DatePicker type="date" placeholder="选择日期" style="width: 150px" v-model="formPlan.planSendDate" :disabled="draftShow != 0"></DatePicker>
                  </FormItem>
                  <FormItem label="预计到货日期:">
                    <DatePicker type="date" placeholder="选择日期" style="width: 150px" v-model="formPlan.planArriveDate" :disabled="draftShow != 0"></DatePicker>
                  </FormItem>
                  <FormItem label="备注：">
                    <Input style="width: 370px" v-model="formPlan.remark" :disabled="draftShow != 0"></Input>
                  </FormItem>
                </Form>
              </div>
              <div class="flex plan-cz-btn" ref="planBtn">
                <div class="clearfix">
                  <div class="fl mb5">
                    <Button size="small" class="mr10" @click="addMountings ">
                      <Icon type="md-add"/>
                      添加配件
                    </Button>
                  </div>
                  <div class="fl mb5">
                    <Button size="small" class="mr10"
                    >
                      <Icon custom="iconfont iconlajitongicon icons"/>
                      删除配件
                    </Button
                    >
                  </div>
                  <div class="fl mb5">
                    <Button size="small" class="mr10">
                      <span class="center"><Icon custom="iconfont icondaoruicon icons"/>导入配件</span>
                    </Button>
                  </div>
                  <div class="fl mb5">
                    <Button size="small" class="mr10" @click="openAddressShow"> 编辑发货信息</Button>
                  </div>
                </div>
              </div>
              <vxe-table
                border
                :edit-rules="validRules"
                show-footer
                :footer-method="footerMethod"
                resizable
                size="mini"
                height='500'
                :data="tableData"
                :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
              >
                <vxe-table-column
                  type="index"
                  title="序号"
                ></vxe-table-column>
                <vxe-table-column type="checkbox"></vxe-table-column>
                <vxe-table-column  title="操作" >
                  <template v-slot="{ row,rowIndex }">
                    <a @click="openFileModal(row)">查看</a>
                  </template>
                </vxe-table-column>
                <vxe-table-column
                  field="partCode"
                  title="配件编码"
                ></vxe-table-column>
                <vxe-table-column
                  field="partName"
                  title="配件名称"
                ></vxe-table-column>
                <vxe-table-column
                  field="partBrand"
                  title="品牌"
                ></vxe-table-column>
                <vxe-table-column field="orderQty" title="数量"   :edit-render="{name: 'input'}"></vxe-table-column>
                <vxe-table-column field="orderPrice" title="销价"  :edit-render="{name: 'input'}"></vxe-table-column>
                <vxe-table-column  title="金额" >
                  <template v-slot="{ row }">
                    <span>{{ countAmount(row) }} </span>
                  </template>
                </vxe-table-column>
                <vxe-table-column
                  field="remark"
                  title="备注"
                  :edit-render="{name: 'input'}"
                ></vxe-table-column>
                <vxe-table-column
                   field="storeName"
                   title="仓库"
                   disabled
                >
                  <template v-slot:edit="{ row }">
                    <Select  style="width:100px">
                      <Option
                        v-for="item in WareHouseList"
                        :value="item.id"
                        :key="item.id"
                      >{{ item.name }}</Option
                      >
                    </Select>
                  </template>

                </vxe-table-column>

                <vxe-table-column  title="品牌车型">
                  <template v-slot="{row,rowIndex}">
                    <span>{{row.carBrandName}} {{row.carModelName}}</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column
                  field="unit"
                  title="单位"
                ></vxe-table-column>
                <vxe-table-column
                  field="oemCode"
                  title="OEM码"
                ></vxe-table-column>
                <vxe-table-column
                  field="spec"
                  title="规格"
                ></vxe-table-column>
                <vxe-table-column
                  field="showDirection"
                  title="方向"
                ></vxe-table-column>
              </vxe-table>
            </div>
          </Split>
        </div>
      </div>
    </section>
    <select-part-com ref="selectPartCom" @selectPartName="getPartNameList"></select-part-com>
    <!--    选择客户-->
    <select-the-customer ref="selectTheCustomer"></select-the-customer>
    <!--更多 搜索-->
    <More-search :data="moreQueryList" ref="morequeryModal"></More-search>
    <!--      查看详情-->
    <See-file ref="fileList" :data="oneRow"></See-file>
    <!--  编辑发货地址 -->
    <Modal v-model="addressShow" title="收货信息" width="1000">
      <goods-info></goods-info>
      <div slot='footer'>
        <Button type='primary' @click=changeShippingAddress>确定</Button>
        <Button type='default' @click='addressShow = false'>取消</Button>
      </div>
    </Modal>
  </div>

</template>

<script>
  import {getLeftList,getClient,getWarehouseList} from "_api/salesManagment/presell.js";
  // import QuickDate from '_c/getDate/dateget';
  import getDate from '@/components/getDate/dateget'
  import goodsInfo from "../../../components/goodsInfo/goodsInfo";
  import selectTheCustomer from '../commonality/SelectTheCustomer.vue'
  import selectPartCom from "../salesOrder/components/selectPartCom";
  import MoreSearch from "./components/MoreSearch";
  import SeeFile from "../commonality/SeeFile";
  import {getDigitalDictionary } from '@/api/system/essentialData/clientManagement'
  export default {
    name: "presell",
    components: {
      // QuickDate,
      getDate,
      goodsInfo,
      selectTheCustomer,
      selectPartCom,
      MoreSearch,
      SeeFile
    },
    data() {
      let changeNumber = (rule, value, callback) => {
        if (!value && value != '0') {
          callback(new Error("请输入大于或等于0的正整数"));
        } else {
          const reg = /^([0]|[1-9][0-9]*)$/
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error("请输入大于或等于0的正整数"));

          }
        }
      };
      return {
        oneRow: {},//点击详情的数据
        draftShow:'',//判定是不是草稿
        settleTypeList: {},//结账类型
        moreQueryList: {},//更多查询
        model1: '',
        WareHouseList: [], //交货仓库
        //分页
        page: {
          total: 0,
          size: 10,
          num: 1
        },
        split1: 0.2,//左右框
        preSellOrderTable: {
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

              minWidth: 70,
              render: (h, params) => {
                let tex = params.row.status.name
                return h('span', {}, tex)

              }
            },
            {
              title: '客户',
              key: 'guestName',
              minWidth: 170
            },
            {
              title: '创建日期',
              key: 'createTime',
              minWidth: 120
            },
            {
              title: '创建人',
              key: 'createUname',
              minWidth: 100
            },
            {
              title: '预售单单号',
              key: 'serviceId',
              minWidth: 200
            },
            {
              title: '打印次数',
              key: 'printTime',
              minWidth: 120
            },
            {
              title: '提交人',
              key: 'commitUname',
              minWidth: 100
            },
            {
              title: '提交日期',
              align: 'center',
              key: 'commitTime',
              minWidth: 170
            },

          ],
          tbData: [],

        }, //表格属性
        orderType:99,
        typeList:[
          {value:99,name:'所有'},
          {value:0,name:'草稿'},
          {value:1,name:'待受理'},
          {value:3,name:'已受理'},
          {value:4,name:'已完成'},
          {value:5,name:'已作废'}
        ],
        //右侧表格数据
        tableData: [],
        formPlan: {},//表单对象
        addressShow: false,//收货地址显示
        query:{},//更多搜索信息
        client:[],//客户列表
        totalMoney: '',//总价
        ruleValidate: {
          guestId: [
            {required: true, type: 'string', message: ' ', trigger: 'change'}
          ],
          orderMan:[
            {required: true, message: '  ', trigger: 'blur'}
          ],
          billTypeId:[
            {required: true, type: 'string', message: ' ', trigger: 'change'}
          ],
          settleTypeId:[
            {required: true, type: 'string', message: ' ', trigger: 'change'}
          ],
          storeId:[
            {required: true, type: 'string', message: ' ', trigger: 'change'}
          ]
        },//表单校验
        validRules: {
          orderQty: [
            { required: true,validator:changeNumber },

          ],
          orderPrice: [
            { required: true, validator:changeNumber }
          ]
        }, //表格校验
        queryTime:'',//快速查询时间

      }


    },
    mounted(){
      this.getLeftList()
      this.getAllClient()
      this.getWarehouse()
      this.getType()
    },
    methods: {
      //获取选择状态类型
      getOrderType(v){
        this.orderType=v
        // console.log('获取的状态时间',this.orderType)
      },
      //获取时间
      getvalue(date){
        this.queryTime = date
        // console.log('获取的时间啊啊',this.queryTime)
      },
      //切换页面
      selectNum(val) {
        this.page.num = val
        this.getLeftList()
      },
      //切换页数
      selectPage(val) {
        this.page.num = 1
        this.page.size = val
        this.getLeftList()
      },
      // // 快速查询日期
      // getDataQuick(v) {
      //   // console.log(v);
      //   //  this.startTime=v[0]
      //   //  this.endTime=v[1]
      //   // console.log(this.startTime,this.endTime)
      // },
      //打开新增客户
      CustomerShowModel() {
        // console.log(44)
        this.$refs.selectTheCustomer.openModel()
      },
      //选择更多
      moreQueryShowModal(row) {
        this.oneRow = row
        this.$refs.morequeryModal.openModal()
      },
      //点击查看
      openFileModal(){
        this.$refs.fileList.openModal()
      },
      //打开收货地址
      openAddressShow() {
        this.addressShow = true
      },
      //添加配件
      addMountings() {
        this.$refs.selectPartCom.init()
      },
      //配件返回的参数
      getPartNameList() {

      },
      //确认收货地址
      changeShippingAddress() {
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
      //分页查询预售单信息左侧
      getLeftList(){
        let data={}
        data.commitTimeStart = this.queryTime[0] || ''
        data.commitTimeEnd = this.queryTime[1] || ''
        data.status= this.orderType
        // params=this.query
        let page = this.page.num -1
        let size = this.page.size
        getLeftList(size,page,data).then(res =>{
          // console.log('打印出来的数据',res)

          if(res.code===0){
            // this.draftShow = value
            this.preSellOrderTable.tbData = res.data.content || []
            console.log(this.preSellOrderTable.tbData)
            this.page.total = res.data.totalElements
            // this.draftShow = this.draftShow.value
          }

        })

      },
      //获取左侧表格一行选中的数据
      selectTabelData(v){
        this.currentRow=v
        // console.log('97779999',this.currentRow)
        // this.draftShow = JSON.parse(v.billStatusId)
        // v.orderType =  JSON.parse(v.orderType)
        // v.orderTypeValue = v.orderType.value
        // this.draftShow = this.draftShow.value
        this.draftShow=v.status.value
        this.tableData=v.detailVOList
        this.formPlan = v
        // console.log('打印的表单数据',this.formPlan)
      },
      // 获取仓库
      async getWarehouse(){
        let res = await  getWarehouseList({groupId:this.$store.state.user.userData.groupId})
        // console.log('3333',res)
        if(res.code === 0){
          this.WareHouseList = res.data
          // console.log('获取到的仓库列表',this.WareHouseList)
        }
      },
      //计算表格数据
      countAmount (row) {
        return this.$utils.toNumber(row.orderQty) * this.$utils.toNumber(row.orderPrice)
      },
      // 计算尾部总和
      countAllAmount (data) {
        let count = 0
        data.forEach(row => {
          count += this.countAmount(row)
        })
        this.totalMoney = count
        return count
      },
      //获取尾部总数
      footerMethod ({ columns, data }) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return '和值'
            }
            if (['orderQty', 'orderPrice','orderAmt'].includes(column.property)) {
              return this.$utils.sum(data, column.property)
            }
            if (columnIndex === 8) {
              return ` ${this.countAllAmount(data)} `
            }
            return null
          })
        ]
      },
      //获取客户属性
      async getType(){
        let data ={}
        //107票据类型
        //106结算方式
        data =['CS00106','CS00107']
        let res = await getDigitalDictionary(data)
        if(res.code == 0){
          this.settleTypeList = res.data
          // console.log('6666666666666',this.settleTypeList)
        }

      },
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
      //更多搜索
      queryall:{
        handler(v,ov){
          this.page.num = 1
          this.page.size = 10
          let page = this.page.num -1
          let size = this.page.size
          getLeftList(page, size,v).then( res => {
            if(res.code === 0){
              // res.data.content.map( item => item.billStatusId = JSON.parse(item.billStatusId))
              this.tableData = res.data.content
              this.page.total = res.data.totalElements
            }
          })

        },
        deep:true
      },
    }
  }
</script>

<style lang="less" scoped>
  @import url("../../lease/product/lease.less");

  .goods-list-form {
    * {
      font-size: 12px !important;
    }

    .ivu-form-item {
      margin-bottom: 0px;
    }

    .plan-cz-btn {
      border-top: 1px solid #ddd;
      margin-top: 6px;
      justify-content: space-between;
      padding: 8px 10px 4px;
      align-items: center;
    }
  }

  .wlf-center {
    display: flex;
    align-items: center;
  }


</style>
