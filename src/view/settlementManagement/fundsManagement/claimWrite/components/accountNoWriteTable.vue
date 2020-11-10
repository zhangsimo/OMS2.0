<template>
  <vxe-table
    border
    auto-resize
    resizable
    highlight-current-row
    @current-change="currEvent"
    show-overflow="title"
    :loading="loading"
    size="mini"
    :max-height="500"
    align="center"
    :data="tableData"
  >
    <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
    <vxe-table-column title="往来单位" field="guestName" width="100"></vxe-table-column>
    <vxe-table-column title="实际收款/付款" field="actualCollectionOrPayment" width="100"></vxe-table-column>
    <vxe-table-column title="已收/已付金额" field="amountReceivedOrPaid" width="100"></vxe-table-column>
    <vxe-table-column title="未收/未付金额" field="amountNoCharOffOrUnpaid" width="100"></vxe-table-column>
    <vxe-table-column title="对账单号" field="accountNo" width="100"></vxe-table-column>
    <vxe-table-column title="门店名称" field="orgName" width="100"></vxe-table-column>
    <vxe-table-column title="发生日期" field="createTime" width="100"></vxe-table-column>
    <vxe-table-column title="收付类型" field="receivePaymentTypeName" width="100"></vxe-table-column>
  </vxe-table>
</template>
<script>
  export default{
    props:['tableData','loading'],
    data(){
      return {}
    },
    methods:{
      currEvent(row){
        this.$emit('currEvent',row)
      }
    }
  }
</script>
<style>

</style>
