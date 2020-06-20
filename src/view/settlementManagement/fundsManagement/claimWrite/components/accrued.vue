<template>
  <Modal v-model="modal" title="转应收应付">
    <vxe-table border align="center" ref="xTable" highlight-hover-row auto-resize height="300" @radio-change="getRaido" :radio-config="{labelField: 'name', checkMethod}" size="mini" :data="tableData">
      <vxe-table-column type="seq" title="序号"></vxe-table-column>
      <vxe-table-column field="area" title="所属区域"></vxe-table-column>
      <vxe-table-column field="shopName" title="所属门店"></vxe-table-column>
      <vxe-table-column field="shopId" title="所属店号"></vxe-table-column>
      <vxe-table-column field="account" title="账户"></vxe-table-column>
      <vxe-table-column field="accountId" title="账号"></vxe-table-column>
      <vxe-table-column field="bankName" title="开户行"></vxe-table-column>
      <vxe-table-column field="subject" title="对应科目"></vxe-table-column>
      <vxe-table-column field="dateHappen" title="发生日期"></vxe-table-column>
      <vxe-table-column field="collectionMoney" title="收入金额"></vxe-table-column>
      <vxe-table-column field="paymentMoney" title="支出金额"></vxe-table-column>
      <vxe-table-column field="moneyClaim" :edit-render="{name: 'input', attrs: {type: 'number'}}" title="本次认领金额"></vxe-table-column>
      <vxe-table-column field="accountName" title="对方户名"></vxe-table-column>
      <vxe-table-column field="tradingNote" :edit-render="{name: 'input', attrs: {type: 'string'}}" title="交易备注"></vxe-table-column>
    </vxe-table>
  </Modal>
</template>
<script>
export default {

};
</script>