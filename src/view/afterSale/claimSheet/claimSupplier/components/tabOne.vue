<template>
  <section class="oper-box ml10">
    <div class="flex">
      <div class="wlf">
        <Button type="default" class="mr10" @click="claim(1)">原货退还</Button>
        <Button type="default" class="mr10" @click="claim(2)">换货处理</Button>
        <Button type="default" class="mr10" @click="claim(3)">退货处理</Button>
        <Button type="default" class="mr10" @click="claim(4)">原物销毁</Button>
        <Button type="default" class="mr10" @click="exportData">导出</Button>
      </div>
    </div>
    <vxe-table
      border
      auto-resize
      resizable
      :data="claimSupplierData"
      size="mini"
      show-overflow="title"
      class="mt20"
      @checkbox-all="claimSupplierSel"
      @checkbox-change="claimSupplierSel"
      @checkbox-cancel="claimSupplierSel"
    >
      <vxe-table-column type="seq" title="序号" width="40"></vxe-table-column>
      <vxe-table-column type="selection" width="50"></vxe-table-column>
      <vxe-table-column field="orderDate" title="提交日期" width="100"></vxe-table-column>
      <vxe-table-column field="serviceId" title="理赔单号" width="100"></vxe-table-column>
      <vxe-table-column field="partInnerId" title="配件内码" width="100"></vxe-table-column>
      <vxe-table-column field="partCode" title="配件编码" width="100"></vxe-table-column>
      <vxe-table-column field="partName" title="配件名称" width="100"></vxe-table-column>
      <vxe-table-column field="oemCode" title="OEM码" width="100"></vxe-table-column>
      <vxe-table-column field="partBrand" title="品牌" width="80"></vxe-table-column>
      <vxe-table-column field="afterSaleReason" title="理赔原因" width="120"></vxe-table-column>
      <vxe-table-column field="claimDemageCode" title="索赔编号" width="120"></vxe-table-column>
      <vxe-table-column field="afterSaleQty" title="理赔数量" width="80"></vxe-table-column>
      <vxe-table-column field="processedQty" title="已处理数量" width="80"></vxe-table-column>
      <vxe-table-column field="untreatedQty" title="未处理数量" width="80"></vxe-table-column>
      <vxe-table-column field="treatedThisQty" title="本次处理数量" width="80">
        <template v-slot="{row}">
          <vxe-input type="integer" v-model="row.treatedThisQty" :min="1" :max="row.untreatedQty"/>
        </template>
      </vxe-table-column>
      <vxe-table-column field="remark" title="备注" width="80">
        <template v-slot="{row}">
          <vxe-input type="string" v-model="row.remark" maxlength="50"/>
        </template>
      </vxe-table-column>
    </vxe-table>
  </section>
</template>
<script lang="ts">
  import {Vue, Component, Watch} from "vue-property-decorator";
  import moment from "moment";
  @Component
  export default class tabOne extends Vue{
    private claimSupplierData:Array<any>=new Array<any>();
    private body:any={};
    private page:any={};
    private claimSupplierSel(){

    }
    private claim(type:number){

    }
    private exportData(){

    }
  }
</script>
<style lang="less"></style>
