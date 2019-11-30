<template>
    <div style="height: 100%;">
      <Form inline :show-message="false" ref="formPlan" :model="formPlan"  :label-width="100">
      <div class="pane-made-hd">
        <span class="titler mr5">固定额度:</span>
        <span class="titler mr10">{{ 31231 |priceFilters}}</span>
        <span class="titler mr5">临时余额:</span>
        <span class="titler mr10">{{ 31231 |priceFilters}}</span>
        <span class="titler mr5">可用余额:</span>
        <span class="titler mr5">{{ 31231 |priceFilters}}</span>
      </div>
      <div class="clearfix purchase" ref="planForm">
            <FormItem label="客户：" >
              <Row  style="width: 310px">
                <Input style="width: 240px" v-model="formPlan.planDate" disabled></Input>
                <Button  class="ml5" size="small" type="default" @click="openAddCustomer"><Icon type="md-checkmark" /></Button>
                <Button  class="ml5" size="small" type="default" @click="openAddNewClient"><Icon type="md-add" /></Button>
              </Row>
            </FormItem>
            <FormItem label="销售员：" >
              <Input class="w160" v-model="formPlan.planDate"></Input>
            </FormItem>
            <FormItem label="订单类型：" >
              <Select v-model="model1" style="width:100px">
                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="往来单号：" >
              <Input class="w160" v-model="formPlan.planDate"></Input>
            </FormItem>
            <FormItem label="票据类型:">
              <Select v-model="model1" style="width:100px">
                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
        <FormItem label="结算方式：" >
          <Select v-model="model1" style="width:100px">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="备注：">
          <Input style="width: 370px" v-model="formPlan.type"></Input>
        </FormItem>
        <FormItem label="订单号:">
          <Input class="w160" v-model="formPlan.type"></Input>
        </FormItem>
        <FormItem label="计划发货日期:">
          <DatePicker type="date" placeholder="选择日期" style="width: 100px"></DatePicker>
        </FormItem>
        <FormItem label="计划到货日期:">
          <DatePicker type="date" placeholder="选择日期" style="width: 100px"></DatePicker>
        </FormItem>
        <FormItem label="交货仓库：" >
          <Select v-model="model1" style="width:100px">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>

      </div>
      </Form>
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
            <Button size="small" class="mr10"> 选择活动</Button>
          </div>
          <div class="fl mb5">
            <Button size="small" class="mr10"> 选择入库单</Button>
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
          :data="tableData"
          style="width: 2000px"
          :edit-config="{trigger: 'click', mode: 'cell'}"
        >
          <vxe-table-column type="index" width="50" title="序号"></vxe-table-column>
          <vxe-table-column type="checkbox" width="50"></vxe-table-column>
          <vxe-table-column  title="操作" >
            <template v-slot="{ row,rowIndex }">
              <a>查看</a>
            </template>
          </vxe-table-column>
          <vxe-table-column field="name" title="配件编码"></vxe-table-column>
          <vxe-table-column field="name" title="配件名称"></vxe-table-column>
          <vxe-table-column field="name" title="品牌"></vxe-table-column>
          <vxe-table-column field="role" title="数量" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="name1" title="单价" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="role1" title="金额" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="role" title="备注" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="name" title="仓位"></vxe-table-column>
          <vxe-table-column field="name" title="缺货数量"></vxe-table-column>
          <vxe-table-column  title="批次" >
            <template v-slot="{ row,rowIndex }">
              <Checkbox disabled></Checkbox>
            </template>
          </vxe-table-column>
          <vxe-table-column  title="活动" >
            <template v-slot="{ row,rowIndex }">
              <Checkbox disabled></Checkbox>
            </template>
          </vxe-table-column>
          <vxe-table-column field="name" title="品牌车型"></vxe-table-column>
          <vxe-table-column field="name" title="单位"></vxe-table-column>
          <vxe-table-column field="name" title="OE码"></vxe-table-column>
          <vxe-table-column field="name" title="规格"></vxe-table-column>
          <vxe-table-column field="name" title="方向"></vxe-table-column>
        </vxe-table>
      </div>

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
        <goods-info></goods-info>
        <div slot='footer'>
          <Button type='primary' @click = changeShippingAddress>确定</Button>
          <Button type='default' @click='addressShow = false'>取消</Button>
        </div>
      </Modal>

<!--      添加配件-->
      <select-part-com ref="selectPartCom" @selectPartName="getPartNameList" ></select-part-com>
<!--      选择客户-->
      <Select-the-customer ref="AddCustomerModel"></Select-the-customer>
    </div>
</template>

<script>
import ClientData from "../../../system/essentialData/clientManagement/ClientData";
import goodsInfo from "../../../../components/goodsInfo/goodsInfo";
import selectPartCom from "../components/selectPartCom";
import SelectTheCustomer from "../../commonality/SelectTheCustomer";
import {area} from '@/api/lease/registerApi'

    export default {
        name: "OrderRight",
        components:{
            ClientData,
            goodsInfo,
            selectPartCom,
            SelectTheCustomer
        },
        data(){
            return {
                formPlan:{},
                model1:'',
                cityList:[
                    {
                        value: 'New York',
                        label: 'New York'
                    },
                    {
                        value: 'New York1',
                        label: 'New York1'
                    },
                ],
                tableData:[
                    {role:12,name:5,role1:8,name1:1},
                    {role:12,name:5,role1:8,name1:1},
                    {role:12,name:5},
                ],
                clientList:{}, //新增客户资料
                provinceArr:{},//获取数据字典地址
                treeDiagramList:[], //新增客户树形图信息
                clientDataShow:false, //新增客户模态框关闭
                addressShow:false,//收货地址显示
            }
        },
        mounted(){
         this.getAdress()
        },
        methods:{
            //打开新增客户
            openAddNewClient(){
                this.clientList ={}
                this.clientDataShow = true
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
            footerMethod ({ columns, data }) {
                return [
                    columns.map((column, columnIndex) => {
                        if (columnIndex === 0) {
                            return '和值'
                        }
                        if (['role1', 'name1'].includes(column.property)) {
                            return this.$utils.sum(data, column.property)
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
            //配件返回的参数
            getPartNameList(){

            },
            //打开客户选择
            openAddCustomer(){
                this.$refs.AddCustomerModel.openModel()
            },
            //打印表格
            printEvent () {
                this.$refs.xTable.print()
            },
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
