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
                    @click="addOrder"
            >
              <Icon type="md-add"/>
              新增
            </Button
            >
          </div>
          <div class="db">
            <Button type="default" class="mr10"
                    :disabled="draftShow != 0"
                    @click="isSave"
            ><i class="iconfont mr5 iconbaocunicon"></i>保存
            </Button
            >
          </div>
          <div class="db">
            <Button class="mr10"
                    @click="isSubmit"
                    :disabled="draftShow != 0"
            ><i class="iconfont mr5 iconziyuan2"></i>提交
            </Button
            >
          </div>
          <div class="db">
            <Button class="mr10"
                    @click="printTable"
            ><i class="iconfont mr5 icondayinicon"></i> 打印
            </Button
            >
          </div>

          <div class="db">
            <Button class="mr10"
                    @click="isDelete"
                    :disabled="draftShow != 0&&draftShow==5"
            >
              <Icon type="md-close" size="14"/>
              作废
            </Button
            >
          </div>
          <div class="db">
            <Button class="mr10"
                    @click="Output"
            ><i class="iconfont mr5 icondaochuicon"></i> 导出
            </Button
            >
          </div>
          <div class="db">
            <Button class="mr10"
                    :disabled="draftShow != 3"
                    @click="finish"
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
                <span class="titler mr10">{{this.limitList.fixationQuota |priceFilters}}</span>
                <span class="titler mr5">临时余额:</span>
                <span class="titler mr10">{{this.limitList.tempQuota |priceFilters}}</span>
                <span class="titler mr5">可用余额:</span>
                <span class="titler mr5">{{ this.limitList.sumAmt |priceFilters}}</span>
              </div>
              <Form
                inline
                ref="formPlan"
                :model="formPlan"
                :label-width="120"
                :rules="ruleValidate"
              >
              <div class="clearfix purchase" ref="planForm">

                  <FormItem label="客户：" prop="guestId">
                    <Row  style="width: 310px">
                      <Select v-model="formPlan.guestId" filterable style="width: 240px" :disabled="draftShow != 0" @on-change="getLimit">
                        <Option v-for="item in client" :value="item.id" :key="item.id">{{ item.fullName }}</Option>
                      </Select>
                      <Button  class="ml5" size="small" type="default"  @click="CustomerShowModel" :disabled="draftShow != 0"><Icon type="md-checkmark" /></Button>

                    </Row>
                  </FormItem>
                  <FormItem label="业务员：" prop="salesman">
                    <Input
                      class="w160"
                      placeholder="请输入业务员"
                      v-model="formPlan.salesman"
                      :disabled="draftShow != 0"
                    />
                  </FormItem>
                  <FormItem label="交货仓库：" prop="storeId">
                    <Select v-model="formPlan.storeId" style="width:200px" :disabled="draftShow != 0" @on-change="getStore">
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
                    <DatePicker :value="formPlan.planSendDate" @on-change="getplanSendDate" type="date" placeholder="选择日期" style="width: 120px" :disabled="draftShow != 0"></DatePicker>
                  </FormItem>
                  <FormItem label="预计到货日期:">
                    <DatePicker :value="formPlan.planArriveDate" @on-change="getplanArriveDate" type="date" placeholder="选择日期" style="width: 120px" :disabled="draftShow != 0"></DatePicker>
                  </FormItem>
                  <FormItem label="备注：">
                    <Input style="width: 370px" v-model="formPlan.remark" :disabled="draftShow != 0"></Input>
                  </FormItem>
              </div>
              <div class="flex plan-cz-btn" ref="planBtn">
                <div class="clearfix">
                  <div class="fl mb5">
                    <Button size="small" class="mr10" @click="addMountings " :disabled="draftShow != 0">
                      <Icon type="md-add"/>
                      添加配件
                    </Button>
                  </div>
                  <div class="fl mb5">
                    <Button size="small" class="mr10" :disabled="draftShow != 0"
                            @click="deletePart"
                    >
                      <Icon custom="iconfont iconlajitongicon icons"/>
                      删除配件
                    </Button
                    >
                  </div>
                  <div class="fl mb5">
                    <Upload
                      ref="upload"
                      style="display: inline-block"
                      :show-upload-list="false"
                      :action="upurl"
                      :headers="headers"
                      :format="['xlsx','xls']"
                      :on-format-error="onFormatError"
                      :on-success="onSuccess"
                      :before-upload ='beforeUpload'
                    >
                    <Button size="small" class="mr10"  @click="getRUl" :disabled="draftShow != 0">
                      <span class="center"><Icon custom="iconfont icondaoruicon icons"/>导入配件</span>
                    </Button>
                    </Upload>
                  </div>
                  <div class="fl mb5">
                    <Button size="small" class="mr10" @click="openAddressShow" :disabled="draftShow != 0"> 编辑发货信息</Button>
                  </div>
                </div>
              </div>
              <vxe-table
                border
                :edit-rules="validRules"
                show-footer
                :footer-method="footerMethod"
                resizable
                auto-resize
                size="mini"
                ref="xTable"
                height='500'
                @select-change="selectTable"
                @select-all="selectAllTable"
                :data="formPlan.detailVOList"
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
              </Form>
            </div>
          </Split>
        </div>
      </div>
    </section>
    <!--        打印-->
    <Print-show ref="printBox" :id="id"></Print-show>
<!--      添加配件-->
    <select-part-com ref="selectPartCom" @selectPartName="getPartNameList"></select-part-com>
    <!--    选择客户-->
    <select-the-customer ref="selectTheCustomer" @getOne="setOneClient"></select-the-customer>
    <!--更多 搜索-->
    <More-search :data="moreQueryList"  ref="morequeryModal" @moreQuery="queryList"></More-search>
    <!--      查看详情-->
    <See-file ref="fileList" :data="oneRow"></See-file>
    <!--  编辑发货地址 -->
<!--    <Modal v-model="addressShow" title="收货信息" width="1000">-->
<!--      <goods-info></goods-info>-->
<!--      <div slot='footer'>-->
<!--        <Button type='primary' @click=changeShippingAddress>确定</Button>-->
<!--        <Button type='default' @click='addressShow = false'>取消</Button>-->
<!--      </div>-->
<!--    </Modal>-->
    <goods-info ref="goodsInfo" :mainId="id"></goods-info>
  </div>

</template>

<script>
  import baseUrl from '_conf/url'
  import {TOKEN_KEY} from '@/libs/util'
  import {getLeftList,getClient,getWarehouseList,getDelete,getSave,getSubmit,getLimit,finishSales,getDeleteList,getOutput,getup} from "_api/salesManagment/presell.js";
  // import QuickDate from '_c/getDate/dateget';
  import getDate from '@/components/getDate/dateget'
  // import goodsInfo from "../../../components/goodsInfo/goodsInfo";
  import goodsInfo from "../../goods/plannedPurchaseOrder/components/GoodsInfo";
  import selectTheCustomer from '../commonality/SelectTheCustomer.vue'
  import selectPartCom from "../salesOrder/components/selectPartCom";
  import MoreSearch from "./components/MoreSearch";
  import PrintShow from "./components/PrintShow";
  import SeeFile from "../commonality/SeeFile";
  import {getDigitalDictionary } from '@/api/system/essentialData/clientManagement'
  import {conversionList} from '@/components/changeWbList/changewblist'
  import * as tools from "../../../utils/tools";
  import Cookies from "js-cookie";
  export default {
    name: "presell",
    components: {
      // QuickDate,
      getDate,
      goodsInfo,
      selectTheCustomer,
      selectPartCom,
      MoreSearch,
      SeeFile,
      PrintShow
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
      let money = (rule, value, callback) => {
        if (!value && value != '0') {
          callback(new Error("最多保留4位小数"));
        } else {
          const reg = /^[+-]?\d+\.\d{0,4}$/i
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error("最多保留4位小数"));

          }
        }
      };
      return {

        headers:  {
          Authorization:'Bearer ' + Cookies.get(TOKEN_KEY)
        },//请求头
        upurl: getup,//导入地址
        oneRow: {},//点击详情的数据
        draftShow:'',//判定是不是草稿
        settleTypeList: {},//结账类型
        moreQueryList: {},//更多查询
        model1: '',
        WareHouseList: [], //交货仓库
        limitList:[], //客户额度
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
        orderType:99,  //快速查询状态
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
          salesman:[
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
            { required: true, validator:money }
          ]
        }, //表格校验
        queryTime:'',//快速查询时间
        isAdd:true, //判断是否新增
        id:'',  //作废需要传入的id
      //   detail:{},
      //   PTrow:{
      //   new: true,
      //   _highlight: true,
      //   id: '0',
      //   billStatusId: '0',
      //   createTime: tools.transTime(new Date()),
      //   details: [],
      // }
        PTrow:{},
        selectTableList:[], //右侧table表格选中的数据

      }


    },
    mounted(){
      this.getLeftList()
      this.getAllClient()
      this.getWarehouse()
      this.getType()

    },
    methods: {
      //多选内容
      selectTable(data){
        this.selectTableList = data.selection
        // console.log('多选内容', this.selectTableList)


      },
      //全选内容
      selectAllTable(data){
        this.selectTableList = data.selection
        // console.log('全选内容', this.selectTableList )
      },
      //导出

      Output(){
        let id=this.id
        if(!id){
          this.$message.error('请选择一条有效数据')
          return false
        }else {
          location.href = baseUrl.omsOrder + '/guestOrderMain/export?id='+ id +'&access_token=' + Cookies.get(TOKEN_KEY)
        }

      },
      //打印弹出框
      printTable(){
        this.$refs.printBox.openModal()
      },
      getLimit(){
        this.getAllLimit()
      },
      //获取客户额度
      getAllLimit(){
        let guestId = this.formPlan.guestId
        getLimit(guestId).then(res=>{
          // console.log('客户额度数据',res)
          if( res.code === 0){
            this.limitList = res.data
          }
        })
      },
      //更多搜索
      queryList(){
        this.page.num = 1
        let page = this.page.num -1
        let size = this.page.size
        let data= this.moreQueryList
        getLeftList(size,page,data).then(res =>{
          if(res.code===0){
            // this.draftShow = value
            this.preSellOrderTable.tbData = res.data.content || []
            this.page.total = res.data.totalElements

          }

        })
      },


      //仓库改变右侧表格改变
      getStore(data){
        let house = this.WareHouseList.filter( item => item.id == data)
        this.formPlan.detailVOList.map( val => {
          val.storeName = house[0].name
        })

      },
      //获取搜索框内的数据
      setOneClient(val){
        this.$set(this.formPlan,"guestId",val.id);
      },
      //获取表单预计发货时间
      getplanSendDate(data){
        this.formPlan.planSendDate = data + ' '+ "00:00:00"
      },
      //获取表单计划到货日期
      getplanArriveDate(data){
        this.formPlan.planArriveDate = data + ' '+ "00:00:00"
      },

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
        this.moreQueryList = {}
        this.$refs.morequeryModal.openModal()
      },
      //点击查看
      openFileModal(row){
        this.oneRow = row
        this.$nextTick( function () {
          this.$refs.fileList.openModal()
        })
      },
      //打开收货地址
      openAddressShow(){
        this.$refs.goodsInfo.init()
      },
      //添加配件
      addMountings() {
        this.$refs.selectPartCom.init()
      },

      //配件返回的参数
      getPartNameList(val){
        this.$refs.formPlan.validate(async (valid) => {
          if (valid) {
            let data ={}
            data = this.formPlan
            data.detailVOList= conversionList(val)
            let res = await  getSave(data)
            if(res.code === 0){
              this.getLeftList()
            }
          } else {
            this.$Message.error('*为必填项');
          }
        })

      },
      // getPartNameList(v) {
      //   console.log('配件返回的参数',v)
      //
      //
      //       // v.forEach( item => {
      //       //   arr.push(
      //       //     {partId: item.id ,
      //       //       partInnerId:item.code,
      //       //       partCode: item.partCode,
      //       //       partName:item.partStandardName,
      //       //       fullName:item.fullName,
      //       //       oemCode:item.oeCode,
      //       //       partBrand: item.partBrand,
      //       //       carBrandName:item.adapterCarBrand,
      //       //       carModelName:item.adapterCarModel,
      //       //       spec:item.specifications,
      //       //       unit:item.minUnit,
      //       //       carTypef:item.baseType.firstType.typeName,
      //       //       carType:item.sbaseType.secondType.typeName,
      //       //       carTypet:item.baseType.thirdType.typeName
      //       //
      //       //     })
      //       // })
      //    getSave(arr).then(res=>{
      //      console.log('9999999999999',res)
      //    })
      //   // row.carBrandName=v.adapterCarBrand
      //   // row.carModelName=v.adapterCarBrand
      // },
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
          if(res.code===0){
            // this.draftShow = value
            this.preSellOrderTable.tbData = res.data.content || []
            console.log(this.preSellOrderTable.tbData)
            this.page.total = res.data.totalElements
          }

        })

      },
      //获取左侧表格一行选中的数据
      selectTabelData(v){
        console.log(v)
        this.currentRow=v
        this.id = v.id
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

      //新增按钮
      addOrder(){
        this.tableData=[]
        this.formPlan = {}

        // console.log('4444',ref)
        if (!this.isAdd) {
           return this.$Message.error('请先保存数据');
         }
        this.preSellOrderTable.tbData.unshift(this.PTrow)
        this.isAdd=false;
         console.log('新增的数据',this.PTrow)
      },
      //作废按钮
       isDelete(){
        if(this.id){
          let id=this.id
          console.log(id)
          getDelete(id).then(res=>{
            if(res.code==0){
              this.$Message.success('作废成功');
              // console.log('作废的数据',res)
              this.getLeftList()
            }
          })
        }else{
          this.$message.error("至少选择一条信息");
        }
      },
   //保存
      isSave(){
        this.$refs.formPlan.validate(async (valid) => {
          if (valid) {
            try {
              await this.$refs.xTable.validate()

              if((+this.totalMoney) >  (+this.limitList.sumAmt) ){
                return this.$message.error('可用余额不足')
              }

              // this.formPlan.orderType = JSON.stringify(this.formPlan.orderType)
              let res = await getSave(this.formPlan)
              if(res.code === 0){
                this.isAdd=true;
                this.$Message.success('保存成功');
               this.getLeftList()
                this.formPlan={}
              }
            } catch (errMap) {
              this.$XModal.message({ status: 'error', message: '表格校验不通过！' })
            }
          } else {
            this.$Message.error('*为必填项');
          }
        })

      },
      //提交
      isSubmit(){
        let data={}
          data = this.formPlan
        getSubmit(data).then(res=>{
         if(res.code===0){
           this.$Message.success('提交成功');
           // console.log('提交',res)
           this.getLeftList()
         }
        })
      },

      //完成销售
   finish(){
       let id=this.id
       // console.log('我是IDIDiidididid',id)
       finishSales(id).then(res=>{
         // console.log('哈哈哈哈哈',res)
         if(res.code === 0){
           this.getLeftList()
         }
       })
   },

      //删除配件
      deletePart(){
        if (this.selectTableList.length > 0){
          let data= []
          this.selectTableList.forEach( item => {
            data.push({id: item.id})
          })
          // console.log(data)
          getDeleteList(data).then( res => {
            if(res.code === 0){
              this.formPlan={}
              this.$Message.success('删除配件成功');
              this.getLeftList()
            }
          })
        }else {
          this.$Message.error('请选择一条有效数据')
        }
      },
      //批量上传失败
      onFormatError(file) {
        this.$Message.error('只支持xls xlsx后缀的文件')
      },
      // 上传成功函数
      onSuccess (response) {
        if(response.code != 0 ){
          this.$Message.error(response.message)
        }else {
          this.$Message.success(response.message)
        }
        this.getLeftList()
      },
      //上传之前清空
      beforeUpload(){
        this.$refs.upload.clearFiles()
      },

      //导入配件
      getRUl(){
        // console.log('导入',v)
        let id=this.id
        this.upurl = getup +'id='+id
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
          if(!val.id){
            return false
          }
         this.getAllLimit()
        },
        deep:true
      }
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
