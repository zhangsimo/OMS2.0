<template>
  <Modal v-model="showNew" title="新增采购订单" width="600">
    <div class="newOrderInfo">
      <div class="header">
        <Form  ref="formPlan" :model="formPlan"  :rules="ruleValidate" :label-width="80">
          <Row>
            <FormItem label="往来单位:">
              <Col span="19">
                <!--<Input-->
                  <!--type="text"-->
                  <!--placeholder="请选择往来单位"-->
                  <!--v-model="formPlan.supplyName"-->
                <!--/>-->
                <supplier-cus :search-value="formPlan.supplyName" :title="formPlan.supplyName" placeholder="请输入客户" :disabled-prop="false" @throwName="throwNameFun"></supplier-cus>
              </Col>
              <Col>
                <Col span="5"
                >
                  <Button
                    @click="addSuppler"
                    class="ml5"
                    size="small"
                    type="default"
                  ><i
                    class="iconfont iconxuanzetichengchengyuanicon"
                  ></i></Button
                  >
                </Col>
              </Col>
            </FormItem>
          </Row>
          <Row>
            <Col span="12">
              <FormItem
                label="票据类型:" prop="billTypeId">
                <Select v-model="formPlan.billTypeId"
                        placeholder="请选择票据类型">
                  <Option v-for="item in settleTypeList.CS00107" :value="item.itemCode" :key="item.itemCode">{{ item.itemName  }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="结算方式:" prop="settleTypeId">
                <Select v-model="formPlan.settleTypeId"
                        placeholder="请选择结算方式">
                  <Option v-for="item in settleTypeList.CS00106" :value="item.itemCode" :key="item.itemCode">{{ item.itemName }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="备注:">
            <Input
              type="text"
              placeholder="备注"

              v-model="formPlan.remark"
            />
          </FormItem>
        </Form>
      </div>
      <div class="main clearfix mt20">
        <!-- 销售出库单下 -->
        <vxe-table
          border
          resizable
          :edit-rules="validRules"
          size="mini"
          :data="data.detailVOList"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
          highlight-current-row
        >
          <vxe-table-column
            type="seq"
            title="序号"
          ></vxe-table-column>
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
          <vxe-table-column
            field="unit"
            title="单位"
          ></vxe-table-column>

          <vxe-table-column
            field="orderQty"
            title="采购数量"
            disabled
          ></vxe-table-column>
          <vxe-table-column
            field="orderPrice"
            title="采购单价"
            :edit-render="{name: 'input'}"
          ></vxe-table-column>
        </vxe-table>
      </div>
    </div>
    <div slot='footer'>
      <Button type='primary' @click="addPurchaseOrder">确定</Button>
      <Button type='default' @click="handleReset">取消</Button>
    </div>
    <!--选择供应商-->
    <select-supplier ref="selectSupplier" header-tit="供应商资料" @selectSupplierName="getSupplierName"></select-supplier>
  </Modal>

</template>

<script>
  import SelectSupplier from "../../../goods/goodsList/components/supplier/selectSupplier";
  import {getDigitalDictionary } from '@/api/system/essentialData/clientManagement'
  import {newPurchaseOrder} from "_api/salesManagment/acceptance.js";
  import SupplierCus from "../../../../components/allocation/supplierCus";
  export default {
    name: 'NewOrder',
    components:{
      SupplierCus,
      SelectSupplier
    },
    props:{
      data:''
    },
    data() {
      // let changeNumber = (rule, value, callback) => {
      //   if (!value && value != '0') {
      //     callback(new Error("请输入大于或等于0的正整数"));
      //   } else {
      //     const reg = /^([0]|[1-9][0-9]*)$/
      //     if (reg.test(value)) {
      //       callback();
      //     } else {
      //       callback(new Error("请输入大于或等于0的正整数"));
      //
      //     }
      //   }
      // };
     let changeNumber = ({cellValue }) => {
        const reg = /^[1-9]\d{0,}$/;
        if(!reg.test(cellValue)) {
          return Promise.reject(new Error('角色输入不正确'))
        }
      };
      return {
        settleTypeList: {},//结账类型
        showNew: false, // 新增采购订单信息——表单
        formPlan: {
          supplyName: '', //往来单位
           remark: '', //备注
          guestId:'',//客户id
          billTypeId:'',//票据类型
          settleTypeId:'' //结算方式
        },
        tableDataBottom: [], //下面表格数据
        SalesOutboundTable: {  // 销售出库单列表
          loading: false,
        },
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        validRules: {
          orderQty: [
            { required: true,validator:changeNumber },

          ],
          orderPrice: [
            { required: true, validator:changeNumber }
          ]
        }, //表格校验
        ruleValidate: { //表单校验
          billTypeId: [
            {required: true, type: 'string', message: ' ', trigger: 'change'}
          ],
          settleTypeId: [
            {required: true, type: 'string', message: ' ', trigger: 'change'}
          ]

        },
      }

    },
    mounted() {
      this.getType();
      // console.log(this.$refs)
    },
    methods: {

      //选择供应商
      addSuppler(){
        this.$refs.selectSupplier.init()
      },
      openModal() {
        // console.log('父组件数据',this.$parent.TopTableData)
        this.showNew = true;
        this.tableDataBottom=this.$parent.BottomTableData
         let company='';
        let guestId='';
        let billTypeId='';
        let settleTypeId='';
          for(let i in this.$parent.TopTableData){
            company=this.$parent.TopTableData[i].company
            guestId=this.$parent.TopTableData[i].guestId;
              settleTypeId=this.$parent.TopTableData[i].settleTypeId;
              billTypeId=this.$parent.TopTableData[i].billTypeId;

          }
        this.formPlan.supplyName=company
        this.formPlan.guestId=guestId;
          this.formPlan.billTypeId=billTypeId;
          this.formPlan.settleTypeId=settleTypeId;
        // console.log('哈哈哈哈哈',this.$parent)
      },
      throwNameFun(v){
        this.getSupplierName(v);
      },
      getSupplierName(v){
        // console.log('打印出来的选择数据是是是',v);
        //赋值供应商名称
        this.formPlan.supplyName = v.fullName||"";
        //赋值供应商id

        this.formPlan.guestId = v.id||"";
        //赋值票据类型id
        this.formPlan.billTypeId = v.billTypeId||"";
        //赋值结算类型id
        this.formPlan.settleTypeId = v.settTypeId ||''
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
       //生成采购订单
      addPurchaseOrder(){
        this.$refs.formPlan.validate(async (valid) => {
          if (valid) {
            let data={}
            data = this.formPlan
            data.id = this.data.id
            data.guestId=this.formPlan.guestId
            data.details= this.data.detailVOList
            newPurchaseOrder(data).then(res=>{
              if(res.code==0){
                this.$Message.success('新增采购订单成功');
                this.formPlan.supplyName=""
                this.formPlan.billTypeId=""
                this.formPlan.remark=""
                this.formPlan.settleTypeId=""
                this.showNew = false;
                this.$parent.getTopList();
                this.$refs.formPlan.resetFields()
              }
            })
          } else {
            this.$Message.error('*为必填项');
          }
        })

      },
      handleReset(){
        this.showNew=false
        this.formPlan.supplyName=""
        this.formPlan.billTypeId=""
        this.formPlan.remark=""
        this.formPlan.settleTypeId=""
        this.$refs.formPlan.resetFields()
      }

    }

  }
</script>

<style lang="less" scoped>
  .bgc {
    color: #000;
    background-color: #e8e8e8;
  }

  .h40 {
    line-height: 40px;
    padding-left: 5px;
  }
</style>
