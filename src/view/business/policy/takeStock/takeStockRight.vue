<template>
  <div style="height: 100%;">
    <div class="orderList">
      <h5>盘点信息</h5>
    </div>
    <Form inline :show-message="false" ref="formPlan" :model="formPlan" :label-width="100">
      <div class="clearfix purchase" ref="planForm">
        <FormItem label="盘点仓库：">
          <Select v-model="model1" style="width:100px">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="盘点员：">
          <Input class="w160" v-model="formPlan.planDate"></Input>
        </FormItem>
        <FormItem label="盘点日期：">
          <DatePicker type="date" placeholder="请选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="盘点单号: ">
          <Input class="w160" v-model="formPlan.type"></Input>
        </FormItem>
      </div>
    </Form>
    <div class="flex plan-cz-btn" ref="planBtn">
      <div class="clearfix pt10 pb10">
        <div class="fl mb5">
          <Button size="small" class="mr10">
            <Icon type="md-add"/>
            添加配件
          </Button>
        </div>
        <div class="fl mb5">
          <Button size="small" class="mr10"><i class="iconfont mr5 iconlajitongicon"></i> 删除配件</Button>
        </div>
        <div class="fl mb5">
          <Button size="small" class="mr10"> 导入</Button>
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
        height="450"
        :data="tableData"
        style="width: 2000px"
        :edit-config="{trigger: 'click', mode: 'cell'}"
      >
        <vxe-table-column type="index" width="50" title="序号"></vxe-table-column>
        <vxe-table-column type="checkbox" width="50"></vxe-table-column>
        <vxe-table-column field="name" title="配件编码"></vxe-table-column>
        <vxe-table-column field="name" title="配件名称"></vxe-table-column>
        <vxe-table-column field="name" title="品牌"></vxe-table-column>
        <vxe-table-column field="role" title="规格"></vxe-table-column>
        <vxe-table-column field="role" title="品牌车型"></vxe-table-column>
        <vxe-table-column field="role" title="单位"></vxe-table-column>
        <vxe-table-column field="role" title="系统数量"></vxe-table-column>
        <vxe-table-column field="name1" title="实盘数量" :edit-render="{name: 'input'}"></vxe-table-column>
        <vxe-table-column field="role1" title="成本单价" :edit-render="{name: 'input'}"></vxe-table-column>
        <vxe-table-column field="role" title="盈亏状态"></vxe-table-column>
        <vxe-table-column field="role" title="盈亏数量"></vxe-table-column>
        <vxe-table-column field="role" title="盈亏金额(参考)"></vxe-table-column>
        <vxe-table-column field="name" title="系统成本"></vxe-table-column>
        <vxe-table-column field="name" title="OE码"></vxe-table-column>
        <vxe-table-column field="name" title="方向"></vxe-table-column>
      </vxe-table>
    </div>
    <!--      添加配件-->
    <!--    <select-part-com ref="selectPartCom" @selectPartName="getPartNameList" ></select-part-com>-->
    <!--      选择客户-->
    <Select-the-customer ref="AddCustomerModel"></Select-the-customer>
  </div>
</template>

<script>
    // import ClientData from "../../../system/essentialData/clientManagement/ClientData";
    import goodsInfo from "../../../../components/goodsInfo/goodsInfo";
    // import selectPartCom from "../components/selectPartCom";
    import SelectTheCustomer from "../../../salesManagement/commonality/SelectTheCustomer";
    // import Activity from "../../commonality/Activity";
    import {area} from '@/api/lease/registerApi'
    export default {
        name: "takeStockRight",
        components: {
            goodsInfo,
            SelectTheCustomer
        },
        data() {
            return {
                formPlan: {},
                model1: '',
                cityList: [
                    {
                        value: 'New York',
                        label: 'New York'
                    },
                    {
                        value: 'New York1',
                        label: 'New York1'
                    },
                ],
                tableData: [
                    {role: 12, name: 5, role1: 8, name1: 1},
                    {role: 12, name: 5, role1: 8, name1: 1},
                    {role: 12, name: 5},
                ],
                clientList: {}, //新增客户资料
                provinceArr: {},//获取数据字典地址
                treeDiagramList: [], //新增客户树形图信息
                clientDataShow: false, //新增客户模态框关闭
                addressShow: false,//收货地址显示
            }
        },
        mounted() {
            this.getAdress()
        },
        methods: {
            //打开新增客户
            openAddNewClient() {
                this.clientList = {}
                this.clientDataShow = true
            },
            //获取数据字典地址
            getAdress() {
                area().then(res => {
                    if (res.code == 0) {
                        this.provinceArr = res.data
                    }
                })
            },
            //确认新增客户
            addNewClient() {},
            //计算表格数据
            footerMethod({columns, data}) {
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
            openAddressShow() {
                this.addressShow = true
            },
            //确认收货地址
            changeShippingAddress() {},
            //添加配件
            // addMountings() {
            //     this.$refs.selectPartCom.init()
            // },
            //配件返回的参数
            getPartNameList() {},
            //打开客户选择
            openAddCustomer() {
                this.$refs.AddCustomerModel.openModel()
            },
            //打开选择入库单
            openGodownEntryModal() {
                this.$refs.GodownEntryModal.openModal()
            },
            //打开活动
            openActivityModal() {
                this.$refs.activity.openModal()
            }
        }
    }
</script>

<style scoped lang="less">
  .purchase {
    padding-top: 10px;
    padding-left: 10px;
    border-bottom: 1px #e8eaec solid;

  }

  .pane-made-hd {
    line-height: 30px;
    border-bottom: 1px #e8eaec solid;
    background-color: #f8f8f8;
    padding-left: 15px

  }

  .plan-cz-btn {
    justify-content: space-between;
    padding: 10px 15px 10px;
    align-items: center;
  }

  .center {
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
  .orderList {
    text-align: center;
    line-height: 30px;
    padding-left: 10px;
    /*border-bottom: 1px solid #dcdee2;*/
    background-color: #f8f8f8;

  }
  /*.purchase >>> .ivu-form-item {*/
  /*  margin-bottom: 10px;*/
  /*}*/
</style>
