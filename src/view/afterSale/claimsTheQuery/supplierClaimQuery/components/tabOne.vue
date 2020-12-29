<template>
  <section class="oper-box ml10">
    <vxe-table
      border
      auto-resize
      resizable
      :data="claimSupplierData"
      size="mini"
      ref="xTable"
      show-overflow="title"
      class="mt20"
    >
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="shortName" title="分店名称" width="100"></vxe-table-column>
      <vxe-table-column field="serviceId" title="处理单号" width="100"></vxe-table-column>
      <vxe-table-column field="guestName" title="供应商" width="110"></vxe-table-column>
      <vxe-table-column field="orderDate" title="处理日期" width="100"></vxe-table-column>
      <vxe-table-column field="handleTypeStatus" title="处理类型" width="100"></vxe-table-column>
      <vxe-table-column field="claimsCode" title="理赔单号" width="80"></vxe-table-column>
      <vxe-table-column field="returnCode" title="返回单号" width="80"></vxe-table-column>
      <vxe-table-column field="partInnerId" title="配件内码" width="100"></vxe-table-column>
      <vxe-table-column field="partCode" title="配件编码" width="100"></vxe-table-column>
      <vxe-table-column field="partName" title="配件名称" width="100"></vxe-table-column>
      <vxe-table-column field="oemCode" title="OEM码" width="100"></vxe-table-column>
      <vxe-table-column field="partBrand" title="品牌" width="50"></vxe-table-column>
      <vxe-table-column field="carModelName" title="品牌车型" width="100"></vxe-table-column>
      <vxe-table-column field="unit" title="单位" width="50"></vxe-table-column>
      <vxe-table-column field="afterSaleQty" title="理赔数量" width="80"></vxe-table-column>
      <vxe-table-column field="afterSaleReason" title="理赔原因" width="120"></vxe-table-column>
      <vxe-table-column field="claimDemageCode" title="索赔编号" width="120"></vxe-table-column>
      <vxe-table-column field="processedQty" title="处理数量" width="80"></vxe-table-column>
      <vxe-table-column field="remark" title="备注" width="100"></vxe-table-column>
      <vxe-table-column field="orderMan" title="处理人" width="100"></vxe-table-column>
      <vxe-table-column field="spec" title="规格" width="80"></vxe-table-column>
      <vxe-table-column field="carTypef" title="配件类别一" width="80"></vxe-table-column>
      <vxe-table-column field="carTypes" title="配件类别二" width="80"></vxe-table-column>
    </vxe-table>
    <div class="page-warp fw">
      <Page
        class-name="page-con"
        :current="page.num"
        :total="page.total"
        :page-size="page.size"
        :page-size-opts="pageOpts"
        @on-change="changePage"
        @on-page-size-change="changeSize"
        show-sizer
        show-total
        transfer
      ></Page>
    </div>
  </section>
</template>
<script lang="ts">
  import {Vue, Component, Watch} from "vue-property-decorator";
  import * as api from "@/api/afterSale/claimsTheQuery/index.js"
  import {showLoading , hideLoading } from "@/utils/loading";

  @Component
  export default class tabOne extends Vue{
    private claimSupplierData:Array<any>=new Array<any>();
    private body:any={};
    private page:any={
      num:1,
      size:10,
      total:0
    };
    private pageOpts:Array<number>= [10, 20, 30, 50];
    private claimSupplierSelData:Array<any>=new Array<any>();
    private exportData(){

    }
    //分页
    private changePage(p) {
      this.page.num = p;
      this.getList();
    }
    private changeSize(size) {
      this.page.num = 1;
      this.page.size = size;
      this.getList();
    }
    private async getList(){
      let params:any={
        page:this.page.num-1,
        size:this.page.size
      }
      showLoading()
      // @ts-ignore
      let res:any=await api.supplierClaimQuery(params,this.body)
      if(res.code===0){
        this.claimSupplierData=(res.data.content || []).map(el=>{
          switch (el.handleType) {
            case 1:
              el.handleTypeStatus = "原货退还";
              break;
            case 2:
              el.handleTypeStatus = "换货";
              break;
            case 3:
              el.handleTypeStatus = "退款";
              break;
            case 4:
              el.handleTypeStatus = "原物销毁";
              break;
          }
          return el;
        });
        this.page.total=res.data.totalElements
        hideLoading()
      }else{
        this.claimSupplierData=[]
        this.page.total=0;
        hideLoading()
      }
    }
  }
</script>
<style lang="less"></style>
