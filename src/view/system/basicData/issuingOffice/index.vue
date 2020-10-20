<template>
  <div class="content-oper content-oper-flex loadingClass">
    <section class="oper-box">
      <!-- 对采购计划订单以及采购计划信息的操作 -->
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr20">
            <span class="mr10">门店</span>
            <Select v-model="shopId" style="width:150px" @on-change='changeShop' label-in-value>
              <Option v-for="item in shopListArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db">
            <span class="mr10">开票单位</span>
            <Input class="w160 mr20"/>
          </div>
          <div class="db">
            <Button class="mr10" @click="addOrder" v-has="'add'">
              <Icon type="md-add" />查询
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="addIssuing" v-has="'add'">
              <Icon type="md-add" />新增
            </Button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <vxe-table
          border
          resizable
          size="mini"
          :data="tableData"
        >
          <vxe-table-column
            show-overflow="tooltip"
            type="seq"
            width="50"
            title="序号"
          ></vxe-table-column>
          <vxe-table-column
            field="unsalableQty"
            title="操作"
            width="120"
          >
            <template v-slot="{row}">
              <Button class="mr10" size="small" @click="addOrder" v-has="'add'">编辑</Button>
              <Button size="small" @click="addOrder" v-has="'add'">删除</Button>
            </template>
          </vxe-table-column>
          <vxe-table-column
            show-overflow="tooltip"
            field="partCode"
            title="所属区域"
            width="100"
          ></vxe-table-column>
          <vxe-table-column
            show-overflow="tooltip"
            field="partName"
            title="所属门店"
            width="100"
          ></vxe-table-column>
          <vxe-table-column
            show-overflow="tooltip"
            field="partInnerId"
            title="所属店号"
            width="80"
          ></vxe-table-column>
          <vxe-table-column
            show-overflow="tooltip"
            field="partBrand"
            title="开票单位"
            width="100"
          ></vxe-table-column>
          <vxe-table-column
            show-overflow="tooltip"
            field="totalStockQty"
            title="发票种类"
            width="100"
          ></vxe-table-column>
          <vxe-table-column
            show-overflow="tooltip"
            field="masterStockQty"
            title="发票种类编码"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            show-overflow="tooltip"
            field="branchStockQty"
            title="发票版本"
            width="100"
          ></vxe-table-column>
          <vxe-table-column
            show-overflow="tooltip"
            field="onWayQty"
            title="适用税率"
            width="100"
          ></vxe-table-column>
          <vxe-table-column
            show-overflow="tooltip"
            field="unsalableQty"
            title="开票限额"
            width="100"
          ></vxe-table-column>
          <vxe-table-column
            show-overflow="tooltip"
            field="unsalableQty"
            title="可见门店"
            width="100"
          ></vxe-table-column>
        </vxe-table>
      </div>
    </section>
    <Modal
      v-model="issuingInfo"
      title="开票信息"
      width="700"
      @on-cancel="CancelModal"
      @on-visible-change="modelShowHide"
    >
      <Form ref="proModalForm" :model="formValidate" :rules="ruleValidate" :label-width="110">
        <Row>
          <Col span="11">
            <FormItem label="所属区域：" prop="qualityTypeId">
              <Select v-model="formValidate.areaId" style="width:200px" @on-change='changeArea' label-in-value>
                <Option v-for="item in Branchstore" :value="item.id" :key="item.id">{{ item.companyName }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="所属门店：" prop="partBrandId">
              <Select v-model="formValidate.shopNumber" style="width:200px" @on-change='changeShop' label-in-value>
                <Option v-for="item in shopListArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="所属店号：" prop="code">
              <Input v-model="formValidate.code"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="发票单位：" prop="name">
              <Input
                @on-click="showName"
                icon="ios-more"
                v-model="formValidate.name"
                readonly="readonly"
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="发票种类：" prop="partTypeF">
              <Select v-model="formValidate.partTypeF" @on-change="changetype" filterable>
                <Option
                  v-for="item in invoiceMap"
                  :value="item.itemCode"
                  :key="item.itemCode"
                >{{item.itemName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="发票版本：" prop="partTypeS">
              <Select v-model="formValidate.version" @on-change="changetypeS" filterable>
                <Option
                  v-for="item in InvoiceVersion"
                  :value="item.value"
                  :key="item.value"
                >{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="适用税率：" prop="partTypeF">
              <Select v-model="formValidate.rate" @on-change="changetype" filterable>
                <Option
                  v-for="item in taxRate"
                  :value="item.itemValueOne"
                  :key="item.itemValueOne"
                >{{item.itemName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="开票限额：" prop="partTypeS">
              <Input :value="((formValidate.version||0)*(1+(formValidate.rate)||0)).toFixed(0)"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22">
            <FormItem label="可见门店：" prop="partTypeF">
              <Input class="w300" :value="formValidate.shopListName"></Input>
              <Button class="ml10" @click="openStoreModal">选择</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button class="mr10" type="primary" @click="addOrder" v-has="'add'">保存</Button>
        <Button @click="addOrder" v-has="'add'">取消</Button>
      </div>
    </Modal>
    <store-alocated ref="StoreModal" @TreeValue="getTreeValue"></store-alocated>
  </div>
</template>

<script>
  import {are, goshop,getIssuingList} from '@/api/settlementManagement/fundsManagement/capitalChain'
  import {getDigitalDictionary} from "../../../../api/system/essentialData/clientManagement";
  import StoreAlocated
    from "../../../settlementManagement/fundsManagement/accountRegistration/components/components/StoreAlocated";
	export default {
		name: "index",
    components: {StoreAlocated},
    data(){
		  return {
		    //查询值
        shopId:'',
		    //开票信息层
        issuingInfo:false,
        //开票信息数据字段
        formValidate:{
          shopListName:'111'
        },
        Branchstore: [{id: "0", companyName: '全部'}], //区域数组
        shopListArr: [{id: "0", name: '全部'}], //门店数组
        taxRate:[],//税率
        invoiceMap:[],//发票
        //发票版本
        InvoiceVersion:[
          {
            value:"10000",
            label:"一万限额"
          },
          {
            value:"100000",
            label:"十万限额"
          },
          {
            value:"1000000",
            label:"百万限额"
          }
        ],
        //可见门店id
        shopList:[],
        tableData:[{}],
      }
    },
    mounted(){
		  this.getAllAre();
		  this.getShop();
		  this.getList();
    },
    methods:{
      //获取全部地址
      async getAllAre() {
        let res = await are()
        if (res.code === 0) {
          this.Branchstore = [...this.Branchstore, ...res.data]
        }
      },

      //获取门店
      async getShop() {
        let data = {}
        data.supplierTypeSecond = this.formValidate.areaId ? this.formValidate.areaId : '0';
        // console.log(this.ChangeData.areaId)
        this.shopListArr = [{id: "0", name: '全部'}]
        let res = await goshop(data)
        if (res.code === 0) {
          this.shopListArr = [...this.shopListArr, ...res.data]
          this.shopId = this.$store.state.user.userData.currentShopId ||"";
        }
      },

      addIssuing(){
        this.issuingInfo = true;
      },

      //显示门店弹框
      openStoreModal() {
        this.$refs.StoreModal.openModal({shopList:this.shopList})
      },
      //获取子组件显示门店
      getTreeValue(value) {
        let newArr = value.map(item => {
          return item.title
        })
        this.shopList = value.map(item => {
          return item.id;
        })

        this.formValidate.shopListName = newArr.join(";");
        this.shopList=Array.from(new Set(this.shopList))
        console.log(this.shopList)
        // console.log(this.shopList,value,1111)
      },

      //获取费用类型
      async getRate() {
        let data = {};
        //107票据类型
        data = ["CS00107", "FYLX", "TaxRate"];
        let res = await getDigitalDictionary(data);
        if (res.code == 0) {
          //费用类型
          this.moneyTypeList = res.data["FYLX"] || [];
          //税率
          this.taxRate = res.data["TaxRate"] || [];
          //票据类型
          this.invoiceMap = res.data["CS00107"] || [];
        }
      },

      async getList(){
        let rep = await getIssuingList({shopId:this.shopId,page:0,pageSize:0});

      },

      modelShowHide(v){
        if(v){
          this.getRate();
        }
      }
    }
	}
</script>

<style scoped>

</style>
