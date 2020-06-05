<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf wlf-center">
          <div class="db mr10">
            <span>公司编号：</span>
            <Select v-model="company" class="w200 mr10" placeholder="选择公司" filterable clearable>
              <Option v-for="item in hsStore" :value="item.erpCompCode" :key="item.erpCompCode">{{ item.fullName }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <span>查询项：</span>
            <Select v-model="searchData.partType" class="w120 mr10">
              <Option v-for="item in partType" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
            <Input v-model="searchData.partName" class="w250 mr10" />
          </div>
          <div class="db">
            <Button class="mr15 w90" type="primary" @click="resetData" v-has="'examine'">
              查询
            </Button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <Table size="small" height="389" ref="hsOrder" :loading="loading" border :stripe="true" :columns="columnsPart" :data="templateData"></Table>
        <div ref="planPage">
          <Page size="small" class-name="page-con tr" :current="page.num" :total="page.total" :page-size="page.size" @on-change="selectNum"
                @on-page-size-change="selectPage" show-sizer show-total></Page>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
  import {getAllTemplate,getAllFile,getStock,getHsStore} from "../../../../api/system/systemSetting/systemset";
  import api from '_conf/url'
  import { TOKEN_KEY } from "@/libs/util";
  import Cookies from "js-cookie";
  export default {
    name: "hsStockIndex",
    data(){
      return {
        company:'',
        hsStore:[],

        //查询项
        partType:[
          {
            "name":"配件编码",
            "value":"partCode"
          },
          {
            "name":"品牌名称",
            "value":"brandName"
          },
          {
            "name":"配件ID",
            "value":"partID"
          },
        ],
        //分页
        page: {
          total: 0,
          size:10,
          num: 1
        },
        //配件名称查询层表头
        columnsPart: [
          {
            title: "序号",
            width: 50,
            type: "index"
          },
          {
            title: "配件ID",
            key: "partID",
            minWidth: 150
          },
          {
            title: "配件编码",
            key: "partCode",
            minWidth: 150
          },
          {
            title: "配件名称",
            key: "partName",
            minWidth: 120
          },
          {
            title: "品牌名称",
            key: "brandName",
            minWidth: 120
          },
          {
            title: "入库数量",
            key: "amount",
            minWidth: 120
          },
          {
            title: "可出库数",
            key: "outAmount",
            minWidth: 120
          },
          {
            title: "门店名称",
            key: "shortname",
            minWidth: 120
          },
          {
            title: "单位",
            key: "unit",
            minWidth: 120
          },
          {
            title: "入库日期",
            key: "deliveryDue",
            minWidth: 60
          },
        ],

        loading:false,
        //tabs切换标签
        //模板数据
        templateData:[],
        //搜索条件
        searchData:{
          partName:'',
          partType:'partCode',
        },
        //表格勾选数据
        selectTableDataArr:[],
        headers: {
          Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
        },
      }
    },
    computed:{
    },
    mounted(){
      this.getTemplateList();
      this.getHsStoreFun();
    },
    methods:{
      async getTemplateList(){
        let req = {};
        let params = {};
        if(this.searchData.partName.trim()){
          req[this.searchData.partType] = this.searchData.partName;
        }
        if(this.company){
          req['compcodes'] = [this.company];
        }
        req.page = this.page.num;
        req.pageSize = this.page.size;
        this.loading = true;
        let rep = await getStock(req,params);
        this.loading = false;
        if(rep.code===0){
          this.templateData = rep.data.data.items||[];
          this.page.total = rep.data.data.total;
        }
      },
      async getHsStoreFun(){
        let rep = await getHsStore();
        if(rep.code==0){
          this.hsStore = rep.data;
        }
      },
      resetData(){
        this.page.num = 1;
        this.page.size = 10;
        this.getTemplateList();
      },
      //切换页面
      selectNum(val) {
        this.page.num = val;
        this.getTemplateList();
      },
      //切换页数
      selectPage(val) {
        this.page.num = 1;
        this.page.size = val;
        this.getTemplateList();
      },
    }
  }
</script>

<style scoped>

</style>
