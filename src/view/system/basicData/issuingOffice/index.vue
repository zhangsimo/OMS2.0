<template>
  <div class="content-oper content-oper-flex loadingClass">
    <section class="oper-box">
      <!-- 对采购计划订单以及采购计划信息的操作 -->
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr20">
            <span class="mr10">门店</span>
            <Select v-model="shopId" style="width:250px" @on-change='changeShop'>
              <Option v-for="item in shopListArr" :value="item.id" :key="item.id">{{ item.shortName }}</Option>
            </Select>
          </div>
          <div class="db">
            <span class="mr10">开票单位</span>
            <Input class="w160 mr20" v-model="name"/>
          </div>
          <div class="db">
            <Button class="mr10" @click="getList">
              查询
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="addIssuing">
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
          :loading="loading"
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
              <Button class="mr10" size="small" v-has="'add'">编辑</Button>
              <Button size="small" v-has="'add'">删除</Button>
            </template>
          </vxe-table-column>
          <vxe-table-column
            show-overflow="tooltip"
            field="areaName"
            title="所属区域"
            width="100"
          ></vxe-table-column>
          <vxe-table-column
            show-overflow="tooltip"
            field="shopName"
            title="所属门店"
            width="100"
          ></vxe-table-column>
          <vxe-table-column
            show-overflow="tooltip"
            field="shopCode"
            title="所属店号"
            width="80"
          ></vxe-table-column>
          <vxe-table-column
            show-overflow="tooltip"
            field="name"
            title="开票单位"
            width="100"
          ></vxe-table-column>
          <vxe-table-column
            show-overflow="tooltip"
            field="invoiceTypeName"
            title="发票种类"
            width="100"
          ></vxe-table-column>
          <vxe-table-column
            show-overflow="tooltip"
            field="invoiceTypeCode"
            title="发票种类编码"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            show-overflow="tooltip"
            field="invoiceVersionName"
            title="发票版本"
            width="100"
          ></vxe-table-column>
          <vxe-table-column
            show-overflow="tooltip"
            field="taxRateName"
            title="适用税率"
            width="100"
          ></vxe-table-column>
          <vxe-table-column
            show-overflow="tooltip"
            field="invoiceQuota"
            title="开票限额"
            width="100"
          ></vxe-table-column>
          <vxe-table-column
            show-overflow="tooltip"
            field="unsalableQty"
            title="可见门店"
            min-width="200"
          >
            <template v-slot="{row}">
              <tag v-for="v in row.shopNameList">{{v.shopName}}</tag>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
    </section>
    <Modal
      v-model="issuingInfo"
      title="开票信息"
      width="700"
      @on-visible-change="modelShowHide"
    >
      <Form ref="proModalForm" :model="formValidate" :rules="ruleValidate" :label-width="110">
        <Row>
          <Col span="11">
            <FormItem label="所属区域：" prop="areaId">
              <Select v-model="formValidate.areaId" style="width:190px" label-in-value>
                <Option v-if="item.id!=='0'" v-for="item in Branchstore" :value="item.id" :key="item.id">{{ item.companyName }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="所属门店：" prop="orgid">
              <Select v-model="formValidate.orgid" style="width:190px" @on-change="changeShopIssuing">
                <Option v-if="item.id!=='0'" v-for="item in shopListArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="所属店号：" prop="shopCode">
              <Input v-model="formValidate.shopCode" style="width:190px" disabled></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="发票单位：" prop="name">
              <Input
                v-model="formValidate.name"
                style="width:190px"
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="发票种类：" prop="invoiceTypeCode">
              <Select v-model="formValidate.invoiceTypeCode" style="width:190px" filterable>
                <Option
                  v-for="item in invoiceMap"
                  :value="item.itemCode"
                  :key="item.itemCode"
                >{{item.itemName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="发票版本：" prop="invoiceVersion">
              <Select v-model="formValidate.invoiceVersion" style="width:190px" filterable>
                <Option
                  v-for="item in InvoiceVersion"
                  :value="item.itemValueOne"
                  :key="item.itemValueOne"
                >{{item.itemName}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="适用税率：" prop="taxRate">
              <Select v-model="formValidate.taxRate" style="width:190px" filterable>
                <Option
                  v-for="item in taxRate"
                  :value="item.itemValueOne"
                  :key="item.itemValueOne"
                >{{item.itemName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="开票限额：">
              <Input disabled style="width:190px" :value="issuingXE"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22">
            <FormItem label="可见门店：" prop="strShopList">
              <Input class="w350" v-model="formValidate.strShopList"></Input>
              <Button class="ml10" @click="openStoreModal">选择</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button class="mr10" type="primary" v-has="'add'">保存</Button>
        <Button v-has="'add'">取消</Button>
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
        loading:true,
		    //查询值
        shopId:this.$store.state.user.userData.currentShopId ||"",
        //开票单位
        name:'',
		    //开票信息层
        issuingInfo:false,
        //开票信息数据字段
        formValidate:{
          shopListName:'111'
        },

        ruleValidate:{

        },

        Branchstore: [{id: "0", companyName: '全部'}], //区域数组
        shopListArr: [{id: "0", name: '全部'}], //门店数组
        taxRate:[],//税率
        invoiceMap:[],//发票
        //发票版本
        InvoiceVersion:[],
        //可见门店id
        shopList:[],
        tableData:[],
      }
    },
    computed:{
		  issuingXE(){
        return ((this.formValidate.version||0)*(1+(this.formValidate.rate)||0)).toFixed(0)
      },
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
          this.shopListArr = [...this.shopListArr, ...res.data];
        }
      },

      addIssuing(row){
        this.issuingInfo = true;
        if(row){

          // this.formValidate.shopNumber =
        }
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
        data = ["FPZL", "TaxRate","FPBB"];
        let res = await getDigitalDictionary(data);
        if (res.code == 0) {
          //税率
          this.taxRate = res.data["TaxRate"] || [];
          //票据类型
          this.invoiceMap = res.data["FPZL"] || [];
          //发票版本
          this.InvoiceVersion = res.data["FPBB"]||[];
        }
      },

      changeShop(v){
        this.getList();
      },

      //开票信息层切换门店
      changeShopIssuing(v){
        let filterData = this.shopListArr.filter(item => item.id==v);
        if(filterData.length>0){
          this.formValidate.code = filterData[0].code;
        }
      },

      async getList(){
        this.loading = true;
        //请求参数
        let req = {};
        if(this.name.trim()){
          req.name = this.name
        }
        req.orgid = this.shopId;
        const rep = await getIssuingList(req);
        this.loading = false;
        if(rep.code==0){
          this.tableData = rep.data['content']||[];
          this.tableData.map(item => {
            if(item.shopNameList){
              item.shopNameList = JSON.parse(item.shopNameList)
            }
          })
        }

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
