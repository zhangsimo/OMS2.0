<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf wlf-center">
          <div class="db mr10">
            <getDate class="mr10" @quickDate="getvalue"></getDate>
          </div>
          <div class="db mr10">
            <span class="">入库日期：</span>
            <Date-picker
              type="daterange"
              :value="queryTime"
              clearable
              class="w200 mr10"
              @on-change="getvalue"
              placeholder="年/月/日-年/月/日"
            >
            </Date-picker>
          </div>
          <div class="db mr10">
            <Select v-model="searchData.type" class="w120 mr10">
              <Option v-for="item in searchType" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Input v-model="searchData.partName" class="w150 mr10" />
          </div>
          <div class="db mr10">
            <span>状态：</span>
            <Select v-model="searchData.status" class="w120 mr10" placeholder="选择公司" filterable clearable @on-change="getStatus">
              <Option v-for="item in statusArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db">
            <Button class="mr15 w90" type="primary" @click="resetData">
              查询
            </Button>
            <Button class="mr15 w90" type="primary" @click="showSet">
              处理过账
            </Button>
          </div>
        </div>
      </div>
    </section>

    <section class="con-box">
      <div class="inner-box">
        <!--<div>-->
          <!--<Table size="small" height="100" ref="hsOrder" @on-selection-change="selectTabelData" :loading="loading" border :stripe="true" :columns="columnsPart" :data="hsOrderList1"></Table>-->
        <!--</div>-->

        <vxe-table
          border
          size="mini"
          show-overflow
          :loading="loading"
          highlight-current-row
          @current-change="currentChangeEvent"
          :data="hsOrderList1">
          <vxe-table-column title="序号" type="seq" width="60" fixed="left"></vxe-table-column>
          <vxe-table-column width="200" field="serviceNo" title="采购单号" fixed="left"></vxe-table-column>
          <vxe-table-column width="120" field="areaName" title="区域" fixed="left"></vxe-table-column>
          <vxe-table-column width="120" field="compName" title="分店名称" fixed="left"></vxe-table-column>
          <vxe-table-column width="120" field="isSupplyName" title="发货供应商" fixed="left"></vxe-table-column>
          <vxe-table-column width="120" field="clientName" title="结算单位" fixed="left"></vxe-table-column>
          <vxe-table-column width="120" field="status" title="状态" fixed="left">
            <template v-slot="{row}">
              {{row.status===0?'未处理':'已处理'}}
            </template>
          </vxe-table-column>
          <vxe-table-column width="120" field="deliveryDue" title="入库日期" fixed="left"></vxe-table-column>
          <vxe-table-column width="120" field="invoiNo" title="票据号"></vxe-table-column>
          <vxe-table-column width="120" field="buyerName" title="采购员"></vxe-table-column>
          <vxe-table-column width="120" field="auditor" title="点货员"></vxe-table-column>
          <vxe-table-column width="120" field="partId" title="配件内码"></vxe-table-column>
          <vxe-table-column width="120" field="partName" title="配件名称"></vxe-table-column>
          <vxe-table-column width="120" field="partBrand" title="品牌"></vxe-table-column>
          <!--<vxe-table-column width="120" field="address" title="配件类别"></vxe-table-column>-->
          <!--<vxe-table-column width="120" field="address" title="子类别"></vxe-table-column>-->
          <vxe-table-column width="120" field="carModelName" title="品牌车型"></vxe-table-column>
          <vxe-table-column width="120" field="unit" title="单位"></vxe-table-column>
          <vxe-table-column width="120" field="amount" title="数量"></vxe-table-column>
          <vxe-table-column width="120" field="outAmount" title="可出库数量"></vxe-table-column>
          <vxe-table-column width="120" field="flowWay" title="流向"></vxe-table-column>
          <vxe-table-column width="120" field="enterPrice" title="单价"></vxe-table-column>
          <vxe-table-column width="120" field="enterAmt" title="金额"></vxe-table-column>
          <vxe-table-column width="120" field="taxPrice" title="含税单价"></vxe-table-column>
          <vxe-table-column width="120" field="taxAmt" title="含税金额"></vxe-table-column>
          <vxe-table-column width="120" field="noTaxPrice" title="不含税单价"></vxe-table-column>
          <vxe-table-column width="120" field="noTaxAmt" title="不含税金额"></vxe-table-column>
          <vxe-table-column width="120" field="remark" title="单价备注"></vxe-table-column>
        </vxe-table>

        <div ref="planPage">
        <Page size="small" class-name="page-con tr" :current="page.num" :total="page.total" :page-size="page.size" @on-change="selectNum"
        @on-page-size-change="selectPage" show-sizer show-total></Page>
        </div>
      </div>
    </section>
    <!--复制单号-->
    <Modal v-model="modal3" title="提示" @on-ok="modal3=false">
      <p style="font-size: 16px">
        操作成功
      </p>
      <div>
        <span class="fs14">外采订单：</span>
        <span style="width:300px" class="courier">
          <input
            type="text"
            readonly
            v-model="danhao"
            id="danhao"
            style="border:none;background-color: #ffff;width:200px"
          />
        </span>
        <span class="sp1" style="color: #40a6ff;cursor: pointer" @click="copy(danhao,'.sp1')">复制单号</span>
      </div>
      <div>
        <span class="fs14">销售订单：</span>
        <span style="width:300px" class="courier">
          <input
            type="text"
            readonly
            v-model="danhao1"
            id="danhao1"
            style="border:none;background-color: #ffff;width:200px"
          />
        </span>
        <span class="sp2" style="color: #40a6ff;cursor: pointer" @click="copy(danhao1,'.sp2')">复制单号</span>
      </div>
    </Modal>
    <!--处理过账-->
    <Modal v-model="modal1" title="提示">
      <p class="fs20">
        此操作自动生成已入库外采订单和草稿销售订单
      </p>
      <p class="pt10">填写备注</p>
      <p class="pt5"><Input v-model="remarkText" class="mr10" /></p>
      <div slot="footer">
        <Button type="primary" @click="submitFun">确定</Button>
        <Button type="default" @click="modal1=false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {getHsOrderList,setPostDetail} from "_api/salesManagment/acceptance.js";
  import getDate from '@/components/getDate/dateget_concise'
  export default {
    name: "hsPayment",
    components: {
      getDate
    },
    data() {
      return {
        modal1:false,
        modal3:false,
        danhao:'',
        danhao1:'',
        remarkText:'',
        //入库日期
        queryTime:[],
        //分页
        page: {
          total: 0,
          size:10,
          num: 1
        },
        //状态
        statusArr:[
          {label:'未处理',value:0},
          {label:'已处理',value:1},
          {label:'全部',value:999}
        ],
        //搜索条件
        searchType:[
          {label:'发货供应商',value:'isSupplyName'},
          {label:'采购单号',value:'serviceNo'},
          {label:'华胜分店',value:'compName'}
        ],
        loading:false,
        //hs订单数据
        hsOrderList1:[],
        //搜索条件
        searchData:{
          status:0,
          type:'isSupplyName',
          partName:''
        },
        //表格勾选数据
        selectTableDataArr:{},
        loading:false,
      }

    },
    mounted() {
      //this.getListData();
    },
    methods: {
      showSet(){
        if(this.selectTableDataArr&&this.selectTableDataArr.hasOwnProperty("serviceNo")){
          if(this.selectTableDataArr.status!==0){
            this.$Message.error("只可处理未处理的数据")
          }else{
            this.modal1 = true;
            this.remarkText = `华胜分店代付业务。单号：${(this.selectTableDataArr.serviceNo||"")}`
          }
        }else{
          this.$Message.error("请选择要处理的信息")
        }
      },
      getStatus(){
        this.getListData();
      },


      async getListData(){
        let params = {};
        let data = {};
        if(this.searchData.status!=999){
          data.status = this.searchData.status;
        }
        if(this.searchData.partName.trim()){
          data[this.searchData.type] = this.searchData.partName.trim();
        }
        data.startDate = this.queryTime[0]?this.queryTime[0]: ''
        data.endDate = this.queryTime[1]?this.queryTime[1]: ''

        params.page = this.page.num - 1;
        params.size = this.page.size;
        this.loading = true;
        let repData = await getHsOrderList(params,data);
        this.loading = false;
        if(repData.code===0){
          this.hsOrderList1 = repData.data.content||[];
          this.page.total = repData.data.totalElements
        }
      },

      async submitFun(){
        let req = {}
        req.remark = this.remarkText;
        req.serviceNo = this.selectTableDataArr.serviceNo;
        let rep = await setPostDetail(req);
        if(rep.code==0){
          this.modal3 = true;
          this.danhao = rep.data.CGDD||"";
          this.danhao1 = rep.data.XSDD||"";
        }else{
          this.$message.error(rep.message)
        }
      },


      resetData(){
        this.page.num = 1;
        this.page.size = 10;
        this.selectTableDataArr = [];
        this.getListData();
      },
      //复制
      copy(str,cl) {
        var save = function(e) {
          e.clipboardData.setData('text/plain', str);
          e.preventDefault();
        };
        document.querySelector(cl).addEventListener('copy', save);
        document.execCommand('copy');
        document.removeEventListener('copy', save);
        this.$Message.success("复制成功");
      },


      //获取时间
      getvalue(date) {
        if(date[0]&&date[0].split(' ').length==1){
          date[0] = date[0]?date[0]+' 00:00:00' : ''
          date[1] = date[1]?date[1]+' 23:59:59' : ''
        }
        this.queryTime = date
        this.resetData();
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

      //获取下侧表格一行选中的数据
      currentChangeEvent({row}) {
        this.selectTableDataArr = row;
      }
    },
    watch: {

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
