<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box paddinSize">
         <Button class="mr10"  v-has="'export'" @click="operation(1)">导入发票</Button> 
         <Button class="mr10"  v-has="'export'" @click="operation(2)">修改</Button> 
         <Button class="mr10"  v-has="'export'" @click="operation(3)">删除导入</Button> 
         <Button class="mr10"  v-has="'export'" @click="operation(4)">发票作废</Button> 
         <Button class="mr10"  v-has="'export'" @click="operation(5)">红字核销</Button> 
         <div class="mt20">
            <Button class="mr10" :type="isActive==1?'info':''" @click="chooseTable(1)">全部显示</Button> 
            <Button class="mr10" :type="isActive==2?'info':''" @click="chooseTable(2)">已核销</Button> 
            <Button :type="isActive==3?'info':''" @click="chooseTable(3)">未核销</Button>
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
      </div>
    </section>
  </div>
</template>
<script>
export default {
    data(){
        return{
            columns:[
                {
                key:'index',
                title: "序号",
                width: 40,
                className: "tc"
                },
                {
                title: "发票类型",
                key: "guestOrgName",
                className: "tc"
                },
                {
                title: "开票公司",
                key: "serviceId",
                className: "tc"
                },
                {
                title: "分店",
                key: "sourceType",
                className: "tc"
                },
                {
                title: "店号",
                key: "guestName",
                className: "tc"
                },
                {
                title: "收款方式",
                key: "guestId",
                className: "tc"
                },
                {
                title: "发票号码",
                key: "belongSystem",
                className: "tc"
                },
                {
                title: "开票单位",
                key: "storeName",
                className: "tc"
                },
                {
                title: "开票日期",
                key: "createUname",
                className: "tc"
                },
                {
                title: "价税合计",
                key: "createTime",
                className: "tc"
                },
                {
                title: "发票金额",
                key: "orderAmt",
                className: "tc",
                render: (h,params) =>{
                    return h('span',(params.row.orderAmt).toFixed(2))
                }
                },
                {
                title: "发票税额",
                key: "remark",
                className: "tc"
                },
                {
                title: "往来单位",
                key: "billstate",
                className: "tc"
                },
                {
                title: "开票清单类型",
                key: "billstate",
                className: "tc"
                },
                {
                title: "开票业务",
                key: "billstate",
                className: "tc"
                },
                {
                title: "税率",
                key: "billstate",
                className: "tc"
                },
                {
                title: "备注",
                key: "billstate",
                className: "tc"
                },
                {
                title: "导入人",
                key: "billstate",
                className: "tc"
                },
                {
                title: "导入时间",
                key: "billstate",
                className: "tc"
                },
                {
                title: "是否作废",
                key: "billstate",
                className: "tc"
                },
                {
                title: "作废经办人",
                key: "billstate",
                className: "tc"
                },
                {
                title: "作废时间",
                key: "billstate",
                className: "tc"
                },
                {
                title: "是否红冲核销",
                key: "billstate",
                className: "tc"
                },
                {
                title: "红冲经办人",
                key: "billstate",
                className: "tc"
                },
                {
                title: "红冲时间",
                key: "billstate",
                className: "tc"
                },
                {
                title: "核销开票申请单号",
                key: "billstate",
                className: "tc"
                },
            ],
            data:[],
            pagetotal: 0,
            isActive:1
        }
    },
    methods:{
        //选择查询条件
        chooseTable(num){
            this.isActive=num
        },
        //操作
        operation(){

        },
        election(){

        },
        handleSummary(){

        },
        pageCode(){

        }
    }
}
</script>
<style lang="less" scoped>
    
</style>