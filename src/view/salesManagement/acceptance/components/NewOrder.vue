<template>
  <Modal v-model="showNew" title="新增采购订单" width="600">
    <div class="newOrderInfo">
      <div class="header">
        <Form  ref="formPlan" :model="formPlan" :label-width="80">
<!--          <div class="db ml20 mb10">-->
<!--            <Button type="warning" class="mr10"-->
<!--            ><i class="iconfont mr5 iconbaocunicon"></i>保存-->
<!--            </Button-->
<!--            >-->
<!--            <Button class="mr10"-->
<!--            >-->
<!--              <Icon type="md-close" size="14"/>-->
<!--              取消-->
<!--            </Button-->
<!--            >-->
<!--          </div>-->
          <Row>
            <FormItem label="往来单位:">
              <Col span="19">
                <Input
                  type="text"
                  placeholder="请选择往来单位"
                  v-model="formPlan.supplyName"
                />
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
                label="票据类型:">
                <Select v-model="formPlan.billTypeId"
                        placeholder="请选择票据类型">
                  <Option v-for="item in settleTypeList.CS00107" :value="item.id" :key="item.id">{{ item.itemName  }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="结算方式:">
                <Select v-model="formPlan.settleTypeId"
                        placeholder="请选择结算方式">
                  <Option v-for="item in settleTypeList.CS00106" :value="item.id" :key="item.id">{{ item.itemName }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="备注:">
            <Input
              type="text"
              placeholder="备注"

              v-model="formPlan.mark"
            />
          </FormItem>
        </Form>
      </div>
      <div class="main clearfix mt20">
        <!-- 销售出库单下 -->
        <vxe-table
          border
          resizable
          size="mini"
          :data="data.detailVOList"
          :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
          highlight-current-row
        >
          <vxe-table-column
            type="index"
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
            :edit-render="{name: 'input'}"
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
      <Button type='default' @click="showNew=false">取消</Button>
    </div>
    <!--选择供应商-->
    <select-supplier ref="selectSupplier" header-tit="供应商资料" @selectSupplierName="getSupplierName"></select-supplier>
  </Modal>

</template>

<script>
  import SelectSupplier from "../../../goods/goodsList/components/supplier/selectSupplier";
  import {getDigitalDictionary } from '@/api/system/essentialData/clientManagement'
  import {newPurchaseOrder} from "_api/salesManagment/acceptance.js";
  export default {
    name: 'NewOrder',
    components:{
      SelectSupplier
    },
    props:{
      data:''
    },
    data() {
      return {
        pjTypeList: [ //票据类型
          {
            value: '汇票',
            label: '汇票'
          },
          {
            value: '承兑',
            label: '承兑'
          },
        ],
        jsTypeList: [ //结算方式
          {
            value: '月结',
            label: '月结'
          },
          {
            value: '现结',
            label: '现结'
          },
        ],
        settleTypeList: {},//结账类型
        showNew: false, // 新增采购订单信息——表单
        formPlan: {
          supplyName: '', //往来单位
           mark: '', //备注
          // pjtype: '',//票据类型
          // jstype: '',//结算方式
          guestId:'',//客户id
          billTypeId:''
        },
        tableDataBottom: [], //下面表格数据
        SalesOutboundTable: {  // 销售出库单列表
          loading: false,
        },
        page: {
          num: 1,
          size: 10,
          total: 0
        }
      }

    },
    mounted() {
      // console.log('李敏反反复复',this.$parent)
      this.getType()
      // console.log(this.$refs)
    },
    methods: {
      //选择供应商
      addSuppler(){
        this.$refs.selectSupplier.init()
      },
      openModal() {
        this.showNew = true;
        this.tableDataBottom=this.$parent.BottomTableData
        // console.log('哈哈哈哈哈',this.$parent)
      },
      getSupplierName(v){
        // console.log(v);
        //赋值供应商名称
        this.formPlan.supplyName = v.fullName||"";
        //赋值供应商id
        this.formPlan.guestId = v.guestId||"";
        //赋值票据类型id
        this.formPlan.billType = v.billTypeId||"";
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
       //生成采购订单
      addPurchaseOrder(){
        let data={}
        newPurchaseOrder(data).then(res=>{
          // console.log('88888888888',res)
        })
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
