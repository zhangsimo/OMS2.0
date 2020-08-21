<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf wlf-center">
          <div class="db mr10">
            <getDate class="mr10" @quickDate="getvalue"></getDate>
          </div>
          <div class="db mr10">
            <span class="">订单日期：</span>
            <Date-picker
              type="daterange"
              :value="queryTime"
              clearable
              class="w200 mr10"
              @on-change="getvalue2"
              placeholder="年/月/日-年/月/日"
            >
            </Date-picker>
          </div>
          <div class="db mr10">
            <span>华胜门店：</span>
            <Select v-model="company" class="w200 mr10" placeholder="选择公司" filterable clearable @on-change="getCompany">
              <Option v-for="item in hsStore" :value="item.id" :key="item.id">{{ item.fullName }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <span>配件编码/名称：</span>
            <Input v-model="searchData.partName" class="w150 mr10" />
          </div>
          <div class="db">
            <Button class="mr15 w90" type="primary" @click="resetData" v-has="'examine'">
              查询
            </Button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-btn">
      <Button :disabled="tabsName!='name1'" class="mr15 w90" @click="changeStatus1(1)" v-has="'pending'">
        转待处理
      </Button>
      <Button :disabled="tabsName!='name2'" class="mr15" @click="changeStatus1(0)" v-has="'cancel'">
        取消待处理
      </Button>
      <Button class="mr15" @click="generateSalesOrder" :disabled="tabsName!='name2'" v-has="'sales'">
        生成销售订单
      </Button>

      <Poptip placement="bottom" width="200">
        <Button class="mr15" :disabled="tabsName!='name2'" v-has="'allot'">
          生成调拨申请单
        </Button>
        <div slot="content" class="tc lh30 layer-db">
          <p class="fs16" @click="generateApplicationOrder(1)">按本店缺货数量生成</p>
          <p class="fs16" @click="generateApplicationOrder(2)">按订单数量生成</p>
        </div>
      </Poptip>
      <Button class="mr15 w90" @click="exportHandle" v-has="'output'">
        导出
      </Button>
    </section>

    <section class="con-box">
      <div class="inner-box">
        <Tabs v-model="tabsName" :animated="false" @on-click="changeTab">
          <TabPane label="可处理信息" name="name1">
            <Table size="small" height="389" ref="hsOrder" @on-selection-change="selectTabelData" :loading="loading" border :stripe="true" :columns="columnsPart" :data="hsOrderList1"></Table>
          </TabPane>
          <TabPane label="待处理" name="name2">
            <Table size="small" ref="hsOrder" height="389" @on-selection-change="selectTabelData" :loading="loading" border :stripe="true" :columns="columnsPart" :data="hsOrderList1"></Table>
          </TabPane>
          <TabPane label="已处理配件查询" name="name3">
            <Table size="small" height="389" @on-selection-change="selectTabelData" :loading="loading" border :stripe="true" :columns="columnsPart2" :data="hsOrderList1"></Table>
          </TabPane>
          <TabPane label="历史订单" name="name4">
            <Table size="small" height="389" @on-selection-change="selectTabelData" :loading="loading" border :stripe="true" :columns="columnsPart2" :data="hsOrderList1"></Table>
          </TabPane>
        </Tabs>
        <div ref="planPage">
        <Page size="small" class-name="page-con tr" :current="page.num" :total="page.total" :page-size="page.size" @on-change="selectNum"
        @on-page-size-change="selectPage" show-sizer show-total></Page>
        </div>
      </div>
    </section>
    <Modal
      title="生成销售订单"
      v-model="showModel1"
      :styles="{ top: '50px', width: '700px' }"
      :footer-hide="true"
    >
      <Form
        inline
        ref="formPlan"
        :model="formPlan"
        :rules="rulePlan"
        :label-width="100"
      >

        <FormItem label="客户：" prop="guestName">
          <Input
            v-model="formPlan.guestName"
            placeholder="客户"
            class="w200"
            readonly
          />
          <!--<sales-cus style="width:200px; display: inline-block" :disabled-prop="false" :title="formPlan.guestName" placeholder="请输入客户" :search-value="formPlan.guestName" @throwName="throwNameFun"></sales-cus>-->
        </FormItem>
        <FormItem label="销售员：" prop="orderManId">
          <Select
            :value="formPlan.orderManId"
            filterable
            style="width: 200px"
            label-in-value
          >
            <Option v-for="item in salesList" :value="item.id" :key="item.id">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="票据类型：" prop="billTypeId">
          <Select v-model="formPlan.billTypeId"
                  class="w200"
                  filterable
          >
            <Option v-for="item in settleTypeList.CS00107" :value="item.itemCode" :key="item.itemCode">{{ item.itemName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="结算方式：" prop="settleTypeId">
          <Select v-model="formPlan.settleTypeId"
                  class="w200"
                  filterable
          >
            <Option v-for="item in settleTypeList.CS00106" :value="item.itemCode" :key="item.itemCode">{{ item.itemName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="交货仓库：" prop="storeId">
          <Select
            v-model="formPlan.storeId"
            style="width:200px"
          >
            <Option v-for="item in WarehouseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="备注：" prop="remark">
          <Input
            class="w200"
            v-model="formPlan.remark"
            maxlength="100"
          />
        </FormItem>
      </Form>
      <div class="tc pb20">
        <Button type="primary" class="w80" @click="handleSubmit('formPlan')">确定</Button>
        <Button class="w80" @click="showModel1=false" style="margin-left: 8px">取消</Button>
      </div>

    </Modal>
    <!--生成调拨申请单-->
    <Modal
      title="生成调拨申请单"
      v-model="showModel2"
      :styles="{ top: '50px', width: '800px' }"
      :footer-hide="true"
    >
      <Form inline
            :model="formPlan2"
            ref="formPlan2"
            :rules="ruleValidate"
            :label-width="120">
        <FormItem label="调出方：" prop="guestName" class="fs12">
          <Row >
            <Col span="16">
              <!--<Select class="200" placeholder="请选择调出方" @on-change="selectOption" v-model="formPlan2.guestName" label-in-value filterable>-->
                <!--<Option v-for="item in ArrayValue" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
              <!--</Select>-->
              <allocation-cus class="210" :title="formPlan2.guestName" placeholder="请输入调出方" :search-value="formPlan2.guestName" @throwName="throwNameFun2" :disabled-prop="false"></allocation-cus>


            </Col>
            <Col span="2">
              <Button class="ml5" size="small" type="default" @click="addSuppler"><i class="iconfont iconxuanzetichengchengyuanicon"></i></Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="调拨申请日期：" prop="orderDate" class="">
          <DatePicker
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            style="width: 200px"
            placeholder="请选择调拨申请日期"
            v-model="formPlan2.orderDate"
          ></DatePicker>
        </FormItem>
        <FormItem class="formItem" label="调入仓库：" prop="storeId" >
          <Select class="w200" v-model="formPlan2.storeId">
            <Option v-for="item in WarehouseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem class="formItem" style="margin-left: 50px" label="备注：" prop="remark">
          <Input class="w200" v-model="formPlan2.remark" :maxlength="100"></Input>
        </FormItem>
      </Form>
      <div class="tc pb20">
        <Button type="primary" class="w80" @click="handleSubmit2('formPlan2')">确定</Button>
        <Button class="w80" @click="showModel2=false" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <select-supplier ref="selectSupplier" header-tit="供应商资料" @selectSupplierName="getSupplierName"></select-supplier>
<!--复制单号-->
    <Modal v-model="modal3" title="提示" @on-ok="modal3=false">
      <p>
        <Icon type="information"></Icon>{{modal3Text}}
      </p>
      <span style="width:300px" class="courier">
          <input
            type="text"
            readonly
            v-model="danhao"
            id="danhao"
            style="border:none;background-color: #ffff;width:200px"
          />
        </span>
      <span class="sp1" style="color: #40a6ff;cursor: pointer" @click="copy(danhao)">复制单号</span>
    </Modal>
  </div>
</template>

<script>
  import {getTopList, getClient, selectCompany} from "_api/salesManagment/acceptance.js";
  import {getHuaShengOrders,setHuaShengOrder,getClientInfo,getHsStore} from "../../../api/salesManagment/sellReturn";
  import getDate from '@/components/getDate/dateget'
  import {getDigitalDictionary} from "../../../api/system/essentialData/clientManagement";
  import {transTime} from "../../../utils/tools";
  import {
    getWarehouseList,
    getSales,
    getSave
  } from "@/api/salesManagment/salesOrder";


  import {findForAllot} from "_api/purchasing/purchasePlan";
  import {save} from "../../../api/AlotManagement/transferringOrder";
  import SelectSupplier from "@/view/AlotManagement/transferringOrder/applyFor/compontents/supplier/selectSupplier2";
  import SalesCus from "../../../components/allocation/salesCus";
  import AllocationCus from "../../../components/allocation/allocationCus";


  export default {
    name: "hsOrder",
    components: {
      AllocationCus,
      SalesCus,
      SelectSupplier,
      getDate
    },
    data() {
      return {
        conditionData: {
          character: "",  // 快速查询
          status: '1',  //受理状态
        },
        orderType: 1,
        typeList: [
          {value: 1, name: '待受理'},
          {value: 3, name: '已受理'},
          {value: 4, name: '已完成'},

        ],
        id:'',
        company: '', //公司选择
        companyListOptions: [],//选择公司下拉列表
        guestId: '',
        // company: '',
        client: [],//选择客户列表
        TopTableData: [],//上侧表格list
        BottomTableData: [],//下侧表格list
        //分页
        page: {
          total: 0,
          size:10,
          num: 1
        },
        totalMoney: '',//总价
        queryTime: '',//快速查询时间
        queryDate: '',//获取查询日期
        clickRow:'',//打开采购订单信息
        danhao:'',//生成单号
        modal3:false,
        modal3Text:'生成销售订单成功',
        //配件名称查询层表头
        columnsPart: [
          {
            title: "序号",
            width: 50,
            type: "index",
            tooltip: true,
          },
          {
            title: "序号",
            type: "selection",
            minWidth: 80,
            tooltip: true,
          },
          {
            title: "订单单号",
            key: "ordersNo",
            minWidth: 150,
            tooltip: true,
          },
          {
            title: "下单门店",
            key: "companyName",
            minWidth: 120,
            tooltip: true,
          },
          {
            title: "备注",
            key: "remark",
            minWidth: 120,
            tooltip: true,
          },
          {
            title: "配件内码",
            key: "partInnerId",
            minWidth: 120,
            tooltip: true,
          },
          {
            title: "配件编码",
            key: "partCode",
            minWidth: 120,
            tooltip: true,
          },
          {
            title: "配件名称",
            key: "partName",
            minWidth: 120,
            tooltip: true,
          },
          {
            title: "规格",
            key: "unit",
            minWidth: 60,
            tooltip: true,
          },
          {
            title: "OEM码",
            key: "oemCode",
            minWidth: 120,
            tooltip: true,
          },
          {
            title: "实物码",
            key: "inkindNo",
            minWidth: 80,
            tooltip: true,
          },
          {
            title: "订单数量",
            key: "orderQty",
            minWidth: 80,
            tooltip: true,
          },
          {
            title: "转销售订单数",
            key: "sellOrderQty",
            minWidth: 100,
            tooltip: true,
          },
          {
            title: "转调拨单数",
            key: "allotOrderQty",
            minWidth: 100,
            tooltip: true,
          },
          {
            title: "本店库存",
            key: "shopStock",
            minWidth: 80,
            tooltip: true,
          },
          {
            title: "总部库存",
            key: "headquartersStock",
            minWidth: 80,
            tooltip: true,
          },
          {
            title: "配件品质",
            key: "partQuality",
            minWidth: 80,
            tooltip: true,
          },
          {
            title: "品牌",
            key: "partBrand",
            minWidth: 80,
            tooltip: true,
          },
          {
            title: "厂牌",
            key: "carBrandName",
            minWidth: 80,
            tooltip: true,
          },
          {
            title: "品牌车型",
            key: "carModelName",
            minWidth: 120,
            tooltip: true,
          },
          {
            title: "单位",
            key: "spec",
            minWidth: 60,
            tooltip: true,
          },
          {
            title: "一级分类",
            key: "carTypef",
            minWidth: 180,
            tooltip: true,
          },
          {
            title: "二级分类",
            key: "carTypes",
            minWidth: 180,
            tooltip: true,
          },
          {
            title: "订单来源",
            key: "orderSource",
            minWidth: 180,
            tooltip: true,
          },
          {
            title: "订单人",
            key: "createUname",
            minWidth: 180,
            tooltip: true,
          },
          {
            title: "订单日期",
            key: "createTime",
            minWidth: 180,
            tooltip: true,
          },
        ],
        columnsPart2: [
          {
            title: "序号",
            width: 50,
            type: "index",
            tooltip: true,
          },
          {
            title: "订单单号",
            key: "ordersNo",
            minWidth: 150,
            tooltip: true,
          },
          {
            title: "下单门店",
            key: "companyName",
            minWidth: 120,
            tooltip: true,
          },
          {
            title: "备注",
            key: "remark",
            minWidth: 120,
            tooltip: true,
          },
          {
            title: "配件内码",
            key: "partInnerId",
            minWidth: 120,
            tooltip: true,
          },
          {
            title: "配件编码",
            key: "partCode",
            minWidth: 120,
            tooltip: true,
          },
          {
            title: "配件名称",
            key: "partName",
            minWidth: 120,
            tooltip: true,
          },
          {
            title: "规格",
            key: "unit",
            minWidth: 60,
            tooltip: true,
          },
          {
            title: "OEM码",
            key: "oemCode",
            minWidth: 120,
            tooltip: true,
          },
          {
            title: "实物码",
            key: "inkindNo",
            minWidth: 80,
            tooltip: true,
          },
          {
            title: "订单数量",
            key: "orderQty",
            minWidth: 80,
            tooltip: true,
          },
          {
            title: "转销售订单数",
            key: "sellOrderQty",
            minWidth: 100,
            tooltip: true,
          },
          {
            title: "转调拨单数",
            key: "allotOrderQty",
            minWidth: 100,
            tooltip: true,
          },
          {
            title: "处理数量",
            key: "setOrderNum",
            minWidth: 100,
            tooltip: true,
            render:(h,p) => {
              return h('span',p.row.sellOrderQty||p.row.allotOrderQty)
            }
          },
          {
            title: "处理类型",
            key: "state",
            minWidth: 100,
            render:(h,p) => {
              return h('span',p.row.state===1?"转销售订单":"转调拨订单")
            },
            tooltip: true,
          },
          {
            title: "生成单号",
            key: "serviceId",
            minWidth: 200,
            tooltip: true,
          },
          {
            title: "处理人",
            key: "updateUname",
            minWidth: 100,
            tooltip: true,
          },
          {
            title: "处理日期",
            key: "updateTime",
            minWidth: 150,
            tooltip: true,
          },
          {
            title: "本店库存",
            key: "shopStock",
            minWidth: 80,
            tooltip: true,
          },
          {
            title: "总部库存",
            key: "headquartersStock",
            minWidth: 80,
            tooltip: true,
          },
          {
            title: "配件品质",
            key: "partQuality",
            minWidth: 80,
            tooltip: true,
          },
          {
            title: "品牌",
            key: "partBrand",
            minWidth: 80,
            tooltip: true,
          },
          {
            title: "厂牌",
            key: "carBrandName",
            minWidth: 80,
            tooltip: true,
          },
          {
            title: "品牌车型",
            key: "carModelName",
            minWidth: 120,
            tooltip: true,
          },
          {
            title: "单位",
            key: "spec",
            minWidth: 60,
            tooltip: true,
          },
          {
            title: "一级分类",
            key: "carTypef",
            minWidth: 180,
            tooltip: true,
          },
          {
            title: "二级分类",
            key: "carTypes",
            minWidth: 180,
            tooltip: true,
          },
          {
            title: "订单来源",
            key: "orderSource",
            minWidth: 180,
            tooltip: true,
          },
          {
            title: "订单人",
            key: "createUname",
            minWidth: 180,
            tooltip: true,
          },
          {
            title: "订单日期",
            key: "createTime",
            minWidth: 180,
            tooltip: true,
          },
        ],
        loading:false,
        //tabs切换标签
        tabsName:'name1',
        //hs订单数据
        hsOrderList1:[],
        //搜索条件
        searchData:{
          status:0,
          partName:''
        },
        //表格勾选数据
        selectTableDataArr:[],
        showModel1:false,
        showModel2:false,
        //计划采购信息
        formPlan: {
          guestName:"",
          guestId: "",
          orderManId:""||this.$store.state.user.userData.id,
          billTypeId:"",
          settleTypeId:"",
          storeId:"",
          remark:"",
        },
        rulePlan: {
          guestName: [
            { required: true, message: "客户不能为空", trigger: "blur" }
          ],
          orderManId: [
            {
              required: true,
              message: "销售员不能为空",
              trigger: "blur"
            }
          ],
          billTypeId: [
            { required: true,message: "票据类型不能为空", trigger: "blur" }
          ],
          settleTypeId: [
            { required: true, message: "结算方式不能为空", trigger: "blur" }
          ],
          storeId: [
            { required: true, message: "交货不能为空", trigger: "blur" }
          ]
        },
        settleTypeList:{},
        WarehouseList:[],
        salesList: [],

        //调拨申请数据
        formPlan2: {
          guestName:'',//调出方
          storeId: '', //调入仓库
          orderDate: new Date(), //申请调拨日期
          remark: '', //备注
        },
        //表单验证
        ruleValidate: {
          guestName: [{ required: true, type:'string',message: '调出方不能为空', trigger: 'change' }],
          storeId: [{ required: true,type:'string', message: '调入仓库不能为空', trigger: 'change' }],
          orderDate: [{ required: true, type: 'date', message: '请选择', trigger: 'change' }],
          remark:[{max: 100, message:'备注长度输入小于100个字符', trigger:'blur'}]
        },
        ArrayValue: [],
        isInternalId:'',//后端需要的供应商的一个id
        guestidId:'',
        getArray:[],
        selectvalue:'',
        applyForType:'',//生成调拨单类型 1按本店缺货数量生成 2按订单数量生成
        hsStore:[],
      }

    },
    mounted() {
      //this.getListData()
      this.getType();
      this.getAllCompany();
      this.getHsStoreFun();
    },
    methods: {
      async getListData(){
        let params = {};
        let data = {};
        data.status = this.searchData.status;
        if(this.searchData.partName.trim()){
          data.partName = this.searchData.partName.trim();
        }
        // if (this.purchaseType !== 9999 && this.purchaseType) {
        //   data.billStatusId = this.purchaseType;
        // }
        // if (this.dateTime.length > 0) {
        //   data.startTime = this.dateTime[0];
        //   data.endTime = this.dateTime[1];
        // }
        if(this.queryTime[0]){
          data.startDate = this.queryTime[0] || ''
          data.endDate = this.queryTime[1] || ''
        }
        if(this.company){
          data.companyId = this.company
        }
        params.page = this.page.num - 1;
        params.size = this.page.size;
        this.loading = true;
        let repData = await getHuaShengOrders(params,data);
        this.loading = false;
        if(repData.code===0){
          this.hsOrderList1 = repData.data.content||[];
          this.page.total = repData.data.totalElements
        }
      },

      async getHsStoreFun(){
        let rep = await getHsStore({});
        if(rep.code==0){
          this.hsStore = rep.data||[];

        }
      },

      changeTab(name){
        switch (name) {
          case 'name1':
            this.searchData.status = 0;
            break;
          case 'name2':
            this.searchData.status = 1;
            break;
          case 'name3':
            this.searchData.status = 2;
            break;
          case 'name4':
            delete this.searchData.status;
            break;
        };
        this.resetData();
      },
      resetData(){
        this.page.num = 1;
        this.page.size = 10;
        this.selectTableDataArr = [];
        this.showModel1 = false;
        this.showModel2 = false;
        this.getListData();
      },
      //转待处理 //取消待处理
      async changeStatus1(status){
        let textString = "";
        if(status===1){
          textString = '是否确定转待处理';
        }
        if(status===0){
          textString = '是否确定取消待处理';
        }
        if(this.selectTableDataArr.length>0){
          this.$Modal.confirm({
            title: textString,
            onOk: async () => {
              this.changeListStatus(status)
            },
            onCancel: () => {
            },
          })
        }else{
          this.$Message.error("请勾选要处理的数据");
        }
      },
      async changeListStatus(status,type){//status 0可处理状态1待处理状态2已处理状态,type 1生成销售单 2生成调拨单
        let newArr = this.selectTableDataArr.map(iv => {
          let item = {...iv}
          item.status = status;
          if(status==2&&type==1){
            item.sellOrderQty = item.orderQty;
            item.state = 1;
            item.serviceId = this.danhao;
          }
          if(status==2&&type==2){
            if(this.applyForType==1){
              item.allotOrderQty = Math.abs(item.outAbleQty-item.orderQty);
            }
            if(this.applyForType==2){
              item.allotOrderQty = item.orderQty;
            }

            item.state = 2;
            item.serviceId = this.danhao;
          }
          return item;
        })
        let rep = await setHuaShengOrder(newArr);
        if(rep.code==0){
          if(status!=2){
            this.$Message.success("成功");
          }
          this.resetData();
        }else{
          this.$Message.error("失败")
        }
      },

      async getType() {
        let data = {}
        //107票据类型`
        //106结算方式
        data = ['CS00106', 'CS00107', 'CS00118','CS00117','CS00112']
        let res = await getDigitalDictionary(data)
        if (res.code == 0) {
          this.settleTypeList = res.data
        }
      },

      // 获取仓库
      async getWarehouse() {
        let res = await getWarehouseList({
          groupId: this.$store.state.user.userData.groupId
        });
        if (res.code === 0) {
          this.WarehouseList = res.data;
          this.WarehouseList.map(item => {
            if(item.isDefault){
              this.formPlan2.storeId = item.id;
            }
          })
        }
      },

      //获取销售员
      async getAllSales() {
        let res = await getSales();
        if (res.code === 0) {
          this.salesList = res.data.content;
          this.salesList.map(item => {
            item.label = item.userName;
          });
        }
      },

      //生成销售订单
      generateSalesOrder(){
        if(this.selectTableDataArr.length>0){
          let filterArr = this.selectTableDataArr.filter(item => item.companyId===this.selectTableDataArr[0].companyId);
          if(filterArr.length!==this.selectTableDataArr.length){
            this.$Message.error("选择的数据只能是相同门店");
          }else{
            if(this.salesList.length==0){
              this.getAllSales();
            }
            if(this.client.length==0){
              this.getAllClient();
            }
            if(this.WarehouseList.length==0){
              this.getWarehouse();
            }

            this.showModel1 = true;
            let firstObj = this.selectTableDataArr[0];
            this.formPlan.guestName = firstObj.companyName;
            this.formPlan.guestId = firstObj.companyId;
            this.getClientInfo(firstObj.companyId);
          }
        }else{
          this.$Message.error("请勾选要处理的数据");
        }
      },

      throwNameFun(v){
        this.formPlan.guestName = v.fullName;
        this.formPlan.guestId = v.id;
        this.formPlan.billTypeId = v.billTypeId||"010103";
        this.formPlan.settleTypeId = v.settTypeId||"020502";
      },

      //获取当前客户信息
      async getClientInfo(id){
        let rep = await getClientInfo({'isInternalId':id})
        if(rep.code==0){
          let objData = rep.data||{};
          this.formPlan.billTypeId = objData.billTypeId||"";
          this.formPlan.settleTypeId = objData.settTypeId||"";
        }
      },

      handleSubmit (name) {
        this.$refs[name].validate(async (valid) => {
          if (valid) {
            let reqData = {...this.formPlan};
            let detailList = this.selectTableDataArr.map(item => {
              let objData = {...item}
              delete objData.id;
              return objData
            })
            reqData.detailList = detailList;
            reqData.detailList.map(item => {
              item.orderQty = item.orderQty-item.allotOrderQty-item.sellOrderQty
            });

            let res = await getSave(reqData);
            if (res.code === 0) {
              this.modal3 = true;
              let objData = res.data||{}
              this.danhao = objData.serviceId;
              this.modal3Text = "生成销售订单成功";
              this.changeListStatus(2,1);
            }else{
              this.$Message.error("操作失败，请重试");
            }
          }
        })
      },

      //生成调拨申请单
      generateApplicationOrder(type){//1按本店缺货数量生成 2按订单数量生成
        if(this.selectTableDataArr.length>0){
          let filterArr = this.selectTableDataArr.filter(item => item.companyId===this.selectTableDataArr[0].companyId);
          if(filterArr.length!==this.selectTableDataArr.length){
            this.$Message.error("选择的数据只能是相同门店");
          }else{
            if(this.ArrayValue.length==0){
              //this.getArrayParams();
            }
            if(this.WarehouseList.length==0){
              this.getWarehouse();
            }

            this.showModel2 = true;
            // let firstObj = this.selectTableDataArr[0];
            // this.formPlan2.guestName = firstObj.companyName;
            // this.formPlan2.guestId = firstObj.companyId;
            //
            // let oneClient = [];
            // oneClient = this.client.filter(item => {
            //   return item.id === firstObj.companyId;
            // });
            // this.formPlan.billTypeId = oneClient.length>0?oneClient[0].billTypeId:"010103";
            // this.formPlan.settleTypeId = oneClient.length>0?oneClient[0].settTypeId:"020502";
            this.applyForType = type;
          }
        }else{
          this.$Message.error("请勾选要处理的数据");
        }
      },
      throwNameFun2(v){
        this.formPlan.guestName = v.fullName;
        this.formPlan.guestId = v.id;
        this.formPlan.billTypeId = v.billTypeId||"010103";
        this.formPlan.settleTypeId = v.settTypeId||"020502";


        this.guestidId = v.id;
        this.isInternalId = v.isInternalId;
        this.formPlan2.guestName = v.fullName;
      },

      addSuppler(){
        this.$refs.selectSupplier.init()
      },

      // 供应商子组件内容
      getSupplierName(a){
        console.log(a)
        // this.isInternalId = a.isInternalId
        // this.formPlan.guestName = a.id
        this.formPlan2.guestName = a.shortName
        this.guestidId = a.guestId
        this.isInternalId = a.id
      },
      //生成调拨单
      handleSubmit2 (name) {
        this.$refs[name].validate(async (valid) => {
          if (valid) {
            let reqData = {...this.formPlan2};
            let detailList = this.selectTableDataArr.map(item => {
              let objData = {...item}
              delete objData.updateUname;
              delete objData.id;
              return objData
            })
            reqData.orderDate = transTime(reqData.orderDate)
            reqData.detailVOS = detailList;
            if(this.applyForType===1){
              this.modal3Text = "按本店缺货数量生成调拨申请单成功";
              //判断配件列表，是否有存才不缺货状态
              let isQh = 0;
              reqData.detailVOS.map(item => {
                if(item.outAbleQty-item.orderQty>0){
                  isQh++
                }
                item.applyQty = Math.abs(item.outAbleQty-item.orderQty)
              });

              if(isQh>0){
                this.$Message.error("存在配件不缺货，无法按缺货数量生成调拨单")
                return
              }
            }else if(this.applyForType===2){
              this.modal3Text = "按订单数量生成订单调拨申请单成功";
              reqData.detailVOS.map(item => {
                item.applyQty = item.orderQty
              })
            }
            // for (let i = 0; i < this.getArray.length; i++) {
            //   if (this.getArray[i].id == this.formPlan.guestName) {
            //     reqData.guestOrgid = this.getArray[i].isInternalId;
            //     reqData.guestId = this.getArray[i].id;
            //   }
            // }
            reqData.guestOrgid = this.isInternalId;
            reqData.guestId = this.guestidId;

            let res = await save(reqData);
            if (res.code === 0) {
              this.modal3 = true;
              let objData = res.data||{}
              this.danhao = objData.serviceId;
              this.changeListStatus(2,2);
            }else{
              this.$Message.error("操作失败，请重试");
            }
          }
        })
      },
      //复制
      copy(str) {
        var save = function(e) {
          e.clipboardData.setData('text/plain', str);
          e.preventDefault();
        };
        document.querySelector(".sp1").addEventListener('copy', save);
        document.execCommand('copy');
        document.removeEventListener('copy', save);
        this.$Message.success("复制成功");
      },
      //导出
      exportHandle(){
        if(this.selectTableDataArr.length==0){
          this.$Message.error("请选择要导出的数据");
          return
        }
        this.$refs.hsOrder.exportCsv({
          filename: '华胜订单数据',
          columns: this.columnsPart,
          data:this.selectTableDataArr
        });
      },

      getArrayParams() {
        var req = {};
        req.page = 0;
        req.size = 1000;
        req.isDisabled= 0;
        findForAllot(req).then(res => {
          const {content} = res.data;
          this.getArray = content;
          content.forEach(item => {
            this.ArrayValue.push({value: item.id, label: item.fullName});
          });
        });
      },
      //

      //获取选择状态类型
      getOrderType(v) {
        this.orderType = v
      },
      //获取选择客户
      getCustomer(v) {
        this.guestId = v
      },
      //获取选择公司
      getCompany(v) {
        console.log('vvv',v)
        this.company = v
      },
      //获取时间
      getvalue(date) {
        this.queryTime = date
        this.resetData();
      },
      getvalue2(date) {
        if(date[0]){
          this.queryTime = [date[0]+' 00:00:00',date[1]+' 23:59:59']
        }else{
          this.queryTime = '';
        }
        this.resetData();
      },
      //客户列表
      getAllClient() {
        getClient().then(res => {
          if (res.code === 0) {
            this.client = res.data
          }
        })
      },
      newArr(arr) {
        // console.log(arr)
        return arr.reduce((pre, cur) => {
          // console.log(pre, cur)
          let flag = Array.isArray(cur.childs) && Array.isArray(cur.childs)
          return pre.concat(flag ? this.newArr(cur.childs) : cur)
        }, [])
      },
      toList(arr) {
        // console.log(arr)v
        return arr.reduce((ret, v) => {
          // console.log(ret, v)
          let item = this.deepClone(v)
          delete item.childs
          this.companyListOptions.push(item)
          let flag = Array.isArray(v.childs) && v.childs.length > 0
          return ret.concat(flag ? this.toList(v.childs) : v)
        }, [])
      },
      deepClone(obj) {
        let ret
        ret = JSON.stringify(obj)
        ret = JSON.parse(ret)
        return ret
      },
      //获取公司信息列表
      getAllCompany() {
        // selectCompany({pId: this.$store.state.user.userData.groupId}).then(res => {
        //   if (res.code === 0) {
        //     let data = res.data
        //     let item = this.deepClone(data)
        //     delete item.childs
        //     this.companyListOptions.push(item)
        //     this.toList(data.childs)
        //   }
        // })
        selectCompany().then(res=>{

          if(res.code==0){
            this.companyListOptions=[]
            Object.keys(res.data).forEach((key)=>{
              // this.companyListOptions=res.data[key]
              this.companyListOptions.push({
                id: key,
                name: res.data[key]
              })
            })
            // console.log('res',this.companyListOptions)
          }
        })
      },
      selectOption(date) {
        this.selectvalue = date.value
      },
      //切换页面
      selectNum(val) {
        this.page.num = val
        this.getListData()
      },
      //切换页数
      selectPage(val) {
        this.page.num = 1
        this.page.size = val
        this.getListData()
      },
      showNewOrder(row) { //弹出生成采购订单模态框
        this.clickRow = JSON.parse(JSON.stringify(row));
        console.log(this.clickRow)
        this.$refs.newOrder.openModal()
      },
      //分页查询预售单受理信息上
      getTopList() {
        let data = {}
        this.companyListOptions.map(item=>{
          if (item.name===this.company){
            data.orgid=item.id
          }
        })
        data.commitTimeStart = this.queryTime[0] || ''
        data.commitTimeEnd = this.queryTime[1] || ''
        data.guestId = this.guestId
        data.status = this.orderType
        let page = this.page.num - 1
        let size = this.page.size
        getTopList(size, page, data).then(res => {
          // console.log('shuhuhuhu',res)
          if (res.code === 0) {
            // res.data.content.map(item => item.status = JSON.parse(item.status))
            this.page.total = res.data.totalElements
            this.TopTableData = res.data.content
          }

        })

      },
      //获取下侧表格一行选中的数据
      selectTabelData(v) {
        this.selectTableDataArr = v;
      },
      //计算表格数据
      countAmount(row) {
        return this.$utils.toNumber(row.orderQty) * this.$utils.toNumber(row.orderPrice)
      },
      // 计算尾部总和
      countAllAmount(data) {
        let count = 0
        data.forEach(row => {
          count += this.countAmount(row)
        })
        this.totalMoney = count
        return count.toFixed(2);
      },
      //获取尾部总数
      footerMethod({columns, data}) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return '和值'
            }
            if (['orderPrice', 'orderAmt'].includes(column.property)) {
              return this.$utils.sum(data, column.property).toFixed(2);
            }
            // if (['orderQty'].includes(column.property)) {
            //   return this.$utils.sum(data, column.property).toFixed(0);
            // }
            if (columnIndex === 6) {
              return ` ${this.countAllAmount(data)} `
            }
            return null
          })
        ]
      },
    },
    watch: {
      //监听时间
      // queryTime: function (val, old) {
      //   this.page.num = 1
      //   this.page.size = 10
      //   this.getTopList()
      // },
      // //监听日期
      // queryDate:function (val,old) {
      //   this.page.num = 1
      //   this.page.size = 10
      //   this.getTopList()
      //
      // }
      //监听客户状态
      guestId: function (val, old) {
        this.page.num = 1
        this.page.size = 10
        this.getTopList()
      },
      //监听状态
      orderType: function (val, old) {
        this.page.num = 1
        this.page.size = 10
        this.getTopList()
      },
      //监听公司
      company: function (val, old) {
        this.page.num = 1
        this.page.size = 10
        this.resetData();
      }
    }
  }
</script>

<style lang="less" scoped>


  * {
    font-size: 12px !important;
  }

  .ivu-form-item {
  }

  .wlf-center {
    display: flex;
    align-items: center;
  }

  .main .ivu-layout .page-con {
    text-align: left;
    padding-left: 10px;
  }

  .ivu-row {
    margin-right: 10px;
  }
  .con-btn{
    background: #fff;
    padding:10px 20px;
    border-top: 1px solid #eee;
  }
  .layer-db{
    p{
      cursor: pointer;
      border-bottom: 1px solid #ddd;
      font-size: 16px;
      &:last-child{
        border-bottom: 0px;
      }
      &:hover{
        background: #eee;
      }
    }
  }
</style>
