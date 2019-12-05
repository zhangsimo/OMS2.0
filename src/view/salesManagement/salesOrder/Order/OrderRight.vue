<template>
    <div style="height: 100%;">
      <Form inline :show-message="false" ref="formPlan" :model="formPlan" :rules="ruleValidate"  :label-width="100">
      <div class="pane-made-hd">
        <span class="titler mr5">固定额度:</span>
        <span class="titler mr10">{{ limitList.fixationQuota |priceFilters}}</span>
        <span class="titler mr5">临时额度:</span>
        <span class="titler mr10">{{ limitList.tempQuota |priceFilters}}</span>
        <span class="titler mr5">可用余额:</span>
        <span class="titler mr5">{{ limitList.sumAmt |priceFilters}}</span>
      </div>
      <div class="clearfix purchase" ref="planForm">
            <FormItem label="客户：" prop="guestId" >
              <Row  style="width: 310px">
                <Select v-model="formPlan.guestId" filterable style="width: 240px" :disabled="draftShow != 0">
                  <Option v-for="item in client" :value="item.id" :key="item.id">{{ item.fullName }}</Option>
                </Select>
                <Button  class="ml5" size="small" type="default" @click="openAddCustomer" :disabled="draftShow != 0"><Icon type="md-checkmark" /></Button>
                <Button  class="ml5" size="small" type="default" @click="openAddNewClient" :disabled="draftShow != 0"><Icon type="md-add" /></Button>
              </Row>
            </FormItem>
            <FormItem label="销售员：" prop="orderMan">
              <Input class="w160" v-model="formPlan.orderMan" :disabled="draftShow != 0"></Input>
            </FormItem>
            <FormItem label="订单类型：" >
              <Select v-model="formPlan.orderTypeValue" style="width:100px" disabled>
                <Option v-for="item in orderType" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="往来单号：" >
              <Input class="w210" v-model="formPlan.code" disabled></Input>
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
        <FormItem label="备注：">
          <Input style="width: 370px" v-model="formPlan.remark" :disabled="draftShow != 0"></Input>
        </FormItem>
        <FormItem label="订单号:">
          <Input class="w210" v-model="formPlan.serviceId" disabled></Input>
        </FormItem>
        <FormItem label="计划发货日期:">
          <DatePicker :value="formPlan.planSendDate" @on-change="getplanSendDate" type="date" placeholder="选择日期" style="width: 120px" :disabled="draftShow != 0"></DatePicker>
        </FormItem>
        <FormItem label="计划到货日期:">
          <DatePicker :value="formPlan.planArriveDate" @on-change="getplanArriveDate" type="date" placeholder="选择日期" style="width: 120px" :disabled="draftShow != 0"></DatePicker>
        </FormItem>
        <FormItem label="交货仓库：" prop="storeId">
          <Select v-model="formPlan.storeId" style="width:200px" :disabled="draftShow != 0">
            <Option v-for="item in WarehouseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>

      </div>
      <div class="flex plan-cz-btn" ref="planBtn">
        <div class="clearfix">
          <div class="fl mb5">
            <Button size="small" class="mr10" @click="addMountings "><Icon type="md-add"/> 添加配件</Button>
          </div>
          <div class="fl mb5">
            <Button size="small" class="mr10" ><i class="iconfont mr5 iconlajitongicon"></i> 删除配件</Button>
          </div>
          <div class="fl mb5">
            <Button size="small" class="mr10"> 批次配件</Button>
          </div>
          <div class="fl mb5">
            <Button size="small" class="mr10">
              <span class="center"><Icon custom="iconfont icondaoruicon icons" />导入配件</span>
            </Button>
          </div>
          <div class="fl mb5">
            <Button size="small" class="mr10" @click="openActivityModal"> 选择活动</Button>
          </div>
          <div class="fl mb5">
            <Button size="small" class="mr10" @click="openGodownEntryModal"> 选择入库单</Button>
          </div>
          <div class="fl mb5">
            <Button size="small" class="mr10" @click="openAddressShow"> 编辑发货信息</Button>
          </div>
        </div>
      </div>
      <div class="tableBox">
        <vxe-table
          border
          align="center"
          size="mini"
          resizable
          stripe
          ref="xTable"
          show-footer
          :footer-method="footerMethod"
          showOverflow="true"
          height="400"
          :edit-rules="validRules"
          :data="formPlan.detailList"
          @edit-actived="editActivedEvent"
          style="width: 2000px"
          :edit-config="{trigger: 'click', mode: 'cell'}"
        >
          <vxe-table-column type="index" width="50" title="序号"></vxe-table-column>
          <vxe-table-column type="checkbox" width="50"></vxe-table-column>
          <vxe-table-column  title="操作" >
            <template v-slot="{ row,rowIndex }">
              <a @click="openFileModal(row)">查看</a>
            </template>
          </vxe-table-column>
          <vxe-table-column field="partCode" title="配件编码"></vxe-table-column>
          <vxe-table-column field="partName" title="配件名称"></vxe-table-column>
          <vxe-table-column field="partBrand" title="品牌"></vxe-table-column>
          <vxe-table-column field="orderQty" title="数量"   :edit-render="{name: 'input',attrs: {disabled: false}}"></vxe-table-column>
          <vxe-table-column field="orderPrice" title="单价"  :edit-render="{name: 'input' ,attrs: {disabled: false}}"></vxe-table-column>
          <vxe-table-column  title="金额" >
            <template v-slot="{ row }">
              <span>{{ countAmount(row) }} </span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="remark" title="备注" ></vxe-table-column>
          <vxe-table-column field="storeShelf" title="仓位"></vxe-table-column>
          <vxe-table-column field="stockOutQty" title="缺货数量"></vxe-table-column>
          <vxe-table-column field="" title="批次" >
            <template v-slot="{ row,rowIndex }">
              <Checkbox disabled :value="row.isMarkBatch == 1"></Checkbox>
            </template>
          </vxe-table-column>
          <vxe-table-column  title="活动" >
            <template v-slot="{ row,rowIndex }">
              <Checkbox disabled :value="row.isMarkActivity == 1"></Checkbox>
            </template>
          </vxe-table-column>
          <vxe-table-column  title="品牌车型">
            <template v-slot="{row,rowIndex}">
              <span>{{row.carBrandName}} {{row.carModelName}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="unit" title="单位"></vxe-table-column>
          <vxe-table-column field="oemCode" title="OE码"></vxe-table-column>
          <vxe-table-column field="spec" title="规格"></vxe-table-column>
          <vxe-table-column field="showDirection" title="方向"></vxe-table-column>
        </vxe-table>
      </div>
      </Form>

      <!--   新增客户资料-->
      <Modal v-model="clientDataShow" title="客户资料"  width="700">
        <ClientData :data="clientList" :provincearr="provinceArr" :treelist="treeDiagramList" ref="child"></ClientData>
        <div slot='footer'>
          <Button type='primary' @click = addNewClient>确定</Button>
          <Button type='default' @click='clientDataShow = false'>取消</Button>
        </div>
      </Modal>

      <!--  编辑发货地址 -->
      <Modal v-model="addressShow" title="收货信息"  width="1000">
<!--        <goods-info></goods-info>-->
        <div slot='footer'>
          <Button type='primary' @click = changeShippingAddress>确定</Button>
          <Button type='default' @click='addressShow = false'>取消</Button>
        </div>
      </Modal>

<!--      添加配件-->
      <select-part-com ref="selectPartCom" @selectPartName="getPartNameList" ></select-part-com>
<!--      选择客户-->
      <Select-the-customer ref="AddCustomerModel"></Select-the-customer>
<!--      选择入库单-->
      <Godown-entry ref="GodownEntryModal"></Godown-entry>
<!--      选择活动-->
      <Activity ref="activity"></Activity>
<!--      查看详情-->
      <See-file ref="fileList" :data="oneRow"></See-file>
    </div>
</template>

<script>
import ClientData from "../../../system/essentialData/clientManagement/ClientData";
import goodsInfo from "../../../../components/goodsInfo/goodsInfo";
import selectPartCom from "../components/selectPartCom";
import SelectTheCustomer from "../../commonality/SelectTheCustomer";
import GodownEntry from "../../commonality/GodownEntry";
import Activity from "../../commonality/Activity";
import SeeFile from "../../commonality/SeeFile";
import {area} from '@/api/lease/registerApi'
import {getClient , getRightList,getWarehouseList ,getLimit , getSave , getStockOut , getSubmitList} from '@/api/salesManagment/salesOrder'
import {getDigitalDictionary } from '@/api/system/essentialData/clientManagement'
import {getNewClient} from '@/api/system/essentialData/clientManagement'



    export default {
        name: "OrderRight",
        components:{
            ClientData,
            goodsInfo,
            selectPartCom,
            SelectTheCustomer,
            GodownEntry,
            Activity,
            SeeFile
        },
        data(){
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
                formPlan: {},//获取到数据
                model1: '',
                orderType: [
                    {
                        value: 0,
                        label: '销售开单'
                    },
                    {
                        value: 1,
                        label: '电商订单'
                    }
                ],//订单类型
                clientList: {}, //新增客户资料
                provinceArr: {},//获取数据字典地址
                treeDiagramList: [], //新增客户树形图信息
                clientDataShow: false, //新增客户模态框关闭
                addressShow: false,//收货地址显示
                leftOneOrder: {},//获取到的左侧数据
                draftShow: '',//判定是不是草稿
                settleTypeList: {},//结账类型
                WarehouseList: [],//仓库
                oneRow: {},//点击详情的数据
                limitList: {},//额度信息
                totalMoney: '',//总价
                client: [],//客户列表
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
                },
              //form表单校验
                validRules: {
                    orderQty: [
                        { required: true,validator:changeNumber },

                    ],
                    orderPrice: [
                        { required: true, validator:changeNumber }
                    ]
                }, //表格校验
            }
        },
        mounted(){
         this.getAdress()
            this.getAllClient()
            this.getType()
            this.getWarehouse()

        },
        computed:{
            getOneOrder(){
                return this.$store.state.dataList.oneOrder
            }
        },
        methods:{
            //获取右侧数据
          async getList(){
              let data ={}
              let stop = this.$loading()
                data.id =this.leftOneOrder.id
                 let res = await  getRightList(data)
              if( res.code === 0 ){
                  stop()
                  this.draftShow = JSON.parse(res.data.billStatusId)
                  res.data.orderType =  JSON.parse(res.data.orderType)
                  res.data.orderTypeValue = res.data.orderType.value
                  this.formPlan = res.data
                  this.draftShow = this.draftShow.value
              }
              if(res.code !== 0){
                  stop()
              }
            },
            //获取客户额度
          async getAllLimit(){
              let data = {}
              data.guestId = this.leftOneOrder.guestId
               let res = await getLimit(data)
                if( res.code === 0){
                    this.limitList = res.data
                }
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
                }

            },
            //获取公司
            async getAllClient(){
                let res = await getClient()
                if(res.code === 0 ){
                    this.client = res.data
                }
            },
            // 获取仓库
            async getWarehouse(){
              let res = await  getWarehouseList({groupId:this.$store.state.user.userData.groupId})
                if(res.code === 0){
                    this.WarehouseList = res.data
                }
            },
            //打开新增客户
            openAddNewClient(){
                this.clientList ={}
                this.clientDataShow = true
            },
            //获取新增客户二级分类
            getList(){
                getClientTreeList().then( res => {
                    if (res.code == 0){
                        this.treeDiagramList = res.data
                        let leverOne = res.data.filter( item => item.lever ==1)
                        leverOne.map( item => {
                            item.children =[]
                            item.code = item.id
                            this.treeDiagramList.forEach( el => {
                                if (item.id == el.parentId){
                                    item.children.push(el)
                                }
                            })
                        })
                    }
                })
            },

            //新增客户确认
            addNewClient(){
                this.$refs.child.handleSubmit( async () =>{
                    let data ={}
                    data = this.clientList
                    data.isNeedPack ? data.isNeedPack = 1 : data.isNeedPack =0
                    data.isSupplier ? data.isSupplier = 1 : data.isSupplier =0
                    data.isDisabled ? data.isDisabled = 1 : data.isDisabled =0
                    let res = await getNewClient(this.clientList)
                    if(res.code == 0){
                        this.clientDataShow =false
                    }
                })

            },
            //获取数据字典地址
            getAdress(){
                area().then(res => {
                    if(res.code == 0){
                        this.provinceArr = res.data
                    }
                })
            },
            //确认新增客户
            addNewClient(){},
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
                        if (['orderQty', 'orderPrice',].includes(column.property)) {
                            return this.$utils.sum(data, column.property)
                        }
                        if (columnIndex === 8) {
                            return ` ${this.countAllAmount(data)} `
                        }
                        return null
                    })
                ]
            },
            //打开收货地址
            openAddressShow(){
               this.addressShow =true
            },
            //确认收货地址
            changeShippingAddress(){},
            //添加配件
            addMountings(){
                this.$refs.selectPartCom.init()
            },
            //计划发货日期
            getplanSendDate(data){
                this.formPlan.planSendDate = data + ' '+ "00:00:00"
            },
            //计划到货日期
            getplanArriveDate(data){
                this.formPlan.planArriveDate = data + ' '+ "00:00:00"
            },
            //配件返回的参数
            getPartNameList(){

            },
            //打开客户选择
            openAddCustomer(){
                this.$refs.AddCustomerModel.openModel()
            },
            //打开选择入库单
            openGodownEntryModal(){
                this.$refs.GodownEntryModal.openModal()
            },
            //打开活动
            openActivityModal(){
                this.$refs.activity.openModal()
            },
            //打开查看模态框
            openFileModal(row){
                this.oneRow = row
                this.$nextTick( function () {
                    this.$refs.fileList.openModal()
                })
            },
            //保存
             save(){
                this.$refs.formPlan.validate(async (valid) => {
                    if (valid) {
                        try {
                            await this.$refs.xTable.validate()

                            if((+this.totalMoney) >  (+this.limitList.sumAmt) ){
                                return this.$message.error('可用余额不足')
                            }

                            this.formPlan.orderType = JSON.stringify(this.formPlan.orderType)
                              let res = await getSave(this.formPlan)
                              if(res.code === 0){
                                  this.$Message.success('保存成功');
                                  return res
                              }
                        } catch (errMap) {
                            this.$XModal.message({ status: 'error', message: '表格校验不通过！' })
                        }
                    } else {
                        this.$Message.error('*为必填项');
                    }
                })

            },
            //判断表格能不能编辑
                editActivedEvent ({ row }) {
                    let xTable = this.$refs.xTable
                    let orderQtyColumn = xTable.getColumnByField('orderQty')
                    let orderPriceColumn = xTable.getColumnByField('orderPrice')
                    let sexColumn = xTable.getColumnByField('sex')
                    let isDisabled = this.draftShow != 0
                    orderQtyColumn.editRender.attrs.disabled = isDisabled
                    orderPriceColumn.editRender.attrs.disabled = isDisabled
                },
            //出库
            stockOut(){
                this.$refs.formPlan.validate(async (valid) => {
                    if (valid) {
                        try {
                            await this.$refs.xTable.validate()

                            if((+this.totalMoney) >  (+this.limitList.sumAmt) ){
                                return this.$message.error('可用余额不足')
                            }

                            this.formPlan.orderType = JSON.stringify(this.formPlan.orderType)
                            let res = await getStockOut(this.formPlan)
                            if(res.code === 0){
                                this.$Message.success('出库成功成功');
                                return res
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
            //getSubmitList
            submitList(){
                this.$refs.formPlan.validate(async (valid) => {
                    if (valid) {
                        try {
                            await this.$refs.xTable.validate()

                            if((+this.totalMoney) >  (+this.limitList.sumAmt) ){
                                return this.$message.error('可用余额不足')
                            }
                            this.formPlan.orderType = JSON.stringify(this.formPlan.orderType)
                            let res = await getSubmitList(this.formPlan)
                            if(res.code === 0){
                                this.$Message.success('出库成功成功');
                                return res
                            }
                        } catch (errMap) {
                            this.$XModal.message({ status: 'error', message: '表格校验不通过！' })
                        }
                    } else {
                        this.$Message.error('*为必填项');
                    }
                })

            },


        },
        watch:{
            getOneOrder:{
                handler(old ,ov){
                    this.leftOneOrder = old
                    this.getList()
                    this.getAllLimit()
                },
                deep:true
            }
        }
    }
</script>

<style scoped lang="less">
.purchase {
padding-top: 10px;
padding-left: 10px;
border-bottom:1px #e8eaec solid;

}
  .pane-made-hd{
    line-height: 30px;
    border-bottom:1px #e8eaec solid;
    background-color: #f8f8f8;
    padding-left: 15px

  }
.plan-cz-btn{
  justify-content:space-between;
  padding: 10px 15px 10px;
  align-items: center;
}
.center{
  display: flex;
  justify-content: center;
  align-items: center;
}
  .tableBox {
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-x: scroll;
  }
</style>
<style scoped>
  .purchase >>> .ivu-form-item {
    margin-bottom: 10px ;
  }
</style>
