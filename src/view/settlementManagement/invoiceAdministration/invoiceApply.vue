<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box paddinSize">
         <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <!-- <quickDate class="mr10" ref="quickDate" @quickDate="quickDate"></quickDate>
             -->
            <Select v-model="model1" class="w150">
              <Option
                v-for="item in Branchstore"
                :value="item"
                :key="item"
              >{{ item}}</Option>
            </Select>
          </div>
          <div class="db ml20">
            <span>申请时间：</span>
            <Date-picker
              format="yyyy-MM-dd"
              :value="value"
              @on-change="changedate"
              type="daterange"
              placeholder="选择日期"
              class="w200"
            ></Date-picker>
          </div>
          <div class="db ml20">
            <span>分店名称：</span>
            <input type="text" class="h30" v-model="model1" readonly />
            <i class="iconfont iconcaidan input" @click="Dealings(1)"></i>
          </div>
          <div class="db ml20">
            <span>客户：</span>
            <input type="text" class="h30" v-model="model1" readonly />
            <i class="iconfont iconcaidan input" @click="Dealings(2)"></i>
          </div>
          <div class="db ml10">
            <button class="ivu-btn ivu-btn-default" type="button" @click="query">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
          <div class="db ml10">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="modal1 = true">
              <i class="iconfont iconcaidan"></i>
              <span>更多</span>
            </button>
          </div>
        </div>
      </div>
       <div>
            <button class="ivu-btn ivu-btn-default mr10" type="button" @click="operation(1)" v-has="'export'">导出汇总</button>
            <button class="ivu-btn ivu-btn-default mr10" type="button" @click="operation(2)" v-has="'export'">导出明细</button>
            <button class="ivu-btn ivu-btn-default mr10" type="button" @click="operation(3)" v-has="'export'">智能核销</button>
            <button class="ivu-btn ivu-btn-default mr10" type="button" @click="operation(4)" v-has="'export'">人工核销</button>
            <button class="ivu-btn ivu-btn-default" type="button" @click="operation(5)" v-has="'export'">撤销核销</button>
        </div>
        <div class="mt20">
            <Button class="mr10" :type="isActive==1?'info':'default'" @click="chooseTable(1)">全部显示</Button>
            <Button class="mr10" :type="isActive==2?'info':'default'" @click="chooseTable(2)">已核销</Button>
            <Button :type="isActive==3?'info':'default'" @click="chooseTable(3)">未核销</Button>
        </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <Table border :columns="columns" :data="data" ref="summary" show-summary highlight-row :summary-method="handleSummary"
          @on-row-click="election" max-height="400"></Table>
         <Page
          :total="pagetotal"
          show-elevator
          class="mt10 fr"
          show-sizer
          @on-change="pageCode"
          show-total
          size="small"
        />
        <button class="mt30 ivu-btn ivu-btn-default" type="button">开票申请配件明细</button>
        <Table
          border
          :columns="columns1"
          :data="data1"
          class="mt10"
          max-hight="400"
          :summary-method="summary"
          ref="parts"
          show-summary
        ></Table>
      </div>
    </section>

  </div>
</template>
<script>
// import { getInvoiceList } from '_api/salesManagment/invoiceApply'
export default {
    data(){
        return{
            columns:[
                {
                key:'index',
                title: "选择",
                width: 40,
                className: "tc"
                },
                {
                title: "序号",
                key: "guestOrgName",
                className: "tc",
                render: (h,params) => {
                  return h('span',params.index + (this.form.page)*this.form.size + 1 )
                }
                },
                {
                title: "分店名称",
                key: "orgName",
                className: "tc"
                },
                {
                title: "店号",
                key: "orgId",
                className: "tc"
                },
                {
                title: "往来单位",
                key: "sourceType",
                className: "tc"
                },
                {
                title: "申请日期",
                key: " applyDate",
                className: "tc"
                },
                {
                title: "对账单号",
                key: "accountNo",
                className: "tc"
                },
                {
                title: "开票单位",
                key: "receiptUnit",
                className: "tc"
                },
                {
                title: "申请开票金额",
                key: "applyAmt",
                className: "tc"
                },
                {
                title: "开票公司",
                key: "tenantName",
                className: "tc"
                },
                {
                title: "开票清单类型",
                key: "species",
                className: "tc"
                },
                {
                title: "寄件方式",
                key: "sendingWay",
                className: "tc",
                // render: (h,params) =>{
                //     return h('span',(params.row.orderAmt).toFixed(2))
                // }
                },
                {
                title: "快递单号",
                key: "sendingNumber",
                className: "tc"
                },
                {
                title: "发票代码",
                key: "invoiceCode",
                className: "tc"
                },
                {
                title: "发票号码",
                key: "invoiceNo",
                className: "tc"
                },
                {
                title: "导入开票单位",
                key: "importInvoiceUnit",
                className: "tc"
                },
                {
                title: "验证开票单位",
                key: "verifyInvoiceUnit",
                className: "tc"
                },
                {
                title: "增发票价税合计加类型",
                key: "priceTaxTotal",
                className: "tc"
                },
                {
                title: "发票不含税金额",
                key: "notTaxAmt",
                className: "tc"
                },
                {
                title: "发票税额",
                key: "invoiceTax",
                className: "tc"
                },
                {
                title: "已核销金额",
                key: "canceledTax",
                className: "tc"
                },
                {
                title: "剩余未核销开票",
                key: "remainCancelTax",
                className: "tc"
                }
            ],
            data:[],
            columns1:[
                {
                key:'index',
                title: "序号",
                width: 40,
                className: "tc"
                },
                {
                title: "分店名称",
                key: "guestOrgName",
                className: "tc"
                },
                {
                title: "店号",
                key: "serviceId",
                className: "tc"
                },
                {
                title: "往来单位",
                key: "sourceType",
                className: "tc"
                },
                {
                title: "申请日期",
                key: "guestName",
                className: "tc"
                },
                {
                title: "对账单号",
                key: "guestId",
                className: "tc"
                },
                 {
                title: "开票申请单号",
                key: "belongSystem",
                className: "tc"
                },
                {
                title: "开票单位",
                key: "belongSystem",
                className: "tc"
                },
                {
                title: "客户税号",
                key: "storeName",
                className: "tc"
                },
                {
                title: "地址电话",
                key: "createUname",
                className: "tc"
                },
                {
                title: "银行账号",
                key: "createTime",
                className: "tc"
                },
                {
                title: "配件名称",
                key: "orderAmt",
                className: "tc",
                render: (h,params) =>{
                    return h('span',(params.row.orderAmt).toFixed(2))
                }
                },
                {
                title: "配件编码",
                key: "remark",
                className: "tc"
                },
                {
                title: "单位",
                key: "billstate",
                className: "tc"
                },
                {
                title: "数量",
                key: "billstate",
                className: "tc"
                },
                {
                title: "商品含税单价",
                key: "billstate",
                className: "tc"
                },
                {
                title: "商品含税金额",
                key: "billstate",
                className: "tc"
                },
                {
                title: "开票税率",
                key: "billstate",
                className: "tc"
                },
                {
                title: "出库单号",
                key: "billstate",
                className: "tc"
                },
                {
                title: "销售单价",
                key: "billstate",
                className: "tc"
                },
                {
                title: "销售金额",
                key: "billstate",
                className: "tc"
                },
                {
                title: "外加税点",
                key: "billstate",
                className: "tc"
                },
                {
                title: "申请开票总金额",
                key: "billstate",
                className: "tc"
                },
                {
                title: "开票公司",
                key: "billstate",
                className: "tc"
                },
                {
                title: "收款方式",
                key: "billstate",
                className: "tc"
                },
                {
                title: "发票类型",
                key: "billstate",
                className: "tc"
                },
                {
                title: "开票清单类型",
                key: "billstate",
                className: "tc"
                },
                {
                title: "备注",
                key: "billstate",
                className: "tc"
                },
                {
                title: "快递方式",
                key: "billstate",
                className: "tc"
                }
            ],
            data1:[],
            value:[],
            model1:'',
            Branchstore:[
                1,2,3,4,5
            ],
            Reconciliationlist:[],
            pagetotal: 0,
            Reconciliationtype:'',
            isActive:1,
            form:{
              page:1,
              size:10,
              writeOffStatus:0
            }
        }
    },
    methods:{
        //选择查询条件
        chooseTable(num){
            this.isActive=num
        },
        query(){

        },
        operation(){

        },
        Dealings(num){

        },
        election(){

        },
        // 选择日期
        changedate(daterange) {
            this.value = daterange;
        },
        pageCode(){

        },
        handleSummary(){

        },
        summary(){

        },
        // getDataList(){
        //   this.form.page -= 1;
        //   getInvoiceList(this.form).then(res=>{
        //     if(res.code===0){
        //       this.data=res.data.content
        //     }
        //   })
        // }
    },
    mounted(){
      this.getDataList()
    }
}
</script>
<style lang="less" scoped>
.input {
  position: relative;
  left: -26px;
  bottom: -2px;
}
</style>
