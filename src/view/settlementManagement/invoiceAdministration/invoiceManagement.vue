<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box paddinSize">
         <Button class="mr10"  v-has="'export'" @click="operation(1)">导入</Button> 
         <Button class="mr10"  v-has="'export'" @click="operation(2)">修改</Button> 
         <Button class="mr10"  v-has="'export'" @click="operation(3)">删除</Button> 
         <Button class="mr10"  v-has="'export'" @click="operation(4)">智能核销</Button> 
         <Button class="mr10"  v-has="'export'" @click="operation(5)">发票退回</Button> 
         <Button class="mr10"  v-has="'export'" @click="operation(5)">红字进项转出</Button> 
         <Button class="mr10"  v-has="'export'" @click="operation(5)">导入勾选认证时间</Button> 
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
                title: "选择",
                width: 40,
                className: "tc"
                },
                {
                title: "序号",
                key: "guestOrgName",
                className: "tc"
                },
                {
                title: "登记日期",
                key: "guestOrgName",
                className: "tc"
                },
                {
                title: "发票采购方名称",
                key: "serviceId",
                className: "tc"
                },
                {
                title: "店号",
                key: "sourceType",
                className: "tc"
                },
                {
                title: "发票代码",
                key: "guestName",
                className: "tc"
                },
                {
                title: "发票号",
                key: "guestId",
                className: "tc"
                },
                {
                title: "发票销售方名称",
                key: "belongSystem",
                className: "tc"
                },
                {
                title: "开票日期",
                key: "storeName",
                className: "tc"
                },
                {
                title: "价税合计金额",
                key: "createUname",
                className: "tc"
                },
                {
                title: "金额",
                key: "createTime",
                className: "tc"
                },
                {
                title: "税额",
                key: "orderAmt",
                className: "tc",
                render: (h,params) =>{
                    return h('span',(params.row.orderAmt).toFixed(2))
                }
                },
                {
                title: "税率",
                key: "remark",
                className: "tc"
                },
                {
                title: "往来单位",
                key: "billstate",
                className: "tc"
                },
                {
                title: "付款方式",
                key: "billstate",
                className: "tc"
                },
                {
                title: "发票分类",
                key: "billstate",
                className: "tc"
                },
                {
                title: "开票清单类型",
                key: "billstate",
                className: "tc"
                },
                {
                title: "增加类型",
                key: "billstate",
                className: "tc"
                },
                {
                title: "导入经办人",
                key: "billstate",
                className: "tc"
                },
                {
                title: "登记时间",
                key: "billstate",
                className: "tc"
                },
                {
                title: "勾选认证时间",
                key: "billstate",
                className: "tc"
                },
                {
                title: "是否退回",
                key: "billstate",
                className: "tc"
                },
                {
                title: "退回经办人",
                key: "billstate",
                className: "tc"
                },
                {
                title: "退回时间",
                key: "billstate",
                className: "tc"
                },
                 {
                title: "是否红字转出",
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
                }
            ],
            data:[],
            pagetotal: 0,
        }
    },
    methods:{
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