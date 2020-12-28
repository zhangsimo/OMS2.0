<template>
  <div class="afterSale">
    <div class="top">
      <quick-date
        ref="quickdate"
        class="mr10"
        v-on:quickDate="getvalue"
      ></quick-date>
      <span>创建日期:</span>
      <DatePicker
        @on-change="getDataQuick"
        :value="search.orderDate"
        type="daterange"
        placement="bottom-start"
        placeholder="选择日期"
        class="w200"
        clearable
      >
      </DatePicker>

      <span class="ml5">理赔单位：</span>
      <Input
        v-model.trim="search.guestName"
        placeholder="请输入理赔单位"
        style="width: 200px"
        clearable
      
      />
     
      <span>品牌：</span>
      <Select
        class="w120"
        clearable
        label-in-value
        filterable
        @on-change="select1"
        v-model.trim="search.partBrand"
        placeholder="请选择品牌"
      >
        <Option v-for="item in brandArr" :value="item.label" :key="item.id">{{
          item.label
        }}</Option>
      </Select>
      <span class="ml5">配件编码/名称/内码：</span>
      <Input v-model.trim="search.partCode" style="width: 200px" clearable />
      <span>状态：</span>
      <Select v-model.trim="search.orderSign" @on-change="getDataType1" class="w90 mr10">
        <Option
          v-for="item in typeList"
          :value="item.value"
          :key="item.value"
          >{{ item.name }}</Option
        >
      </Select>
      <Button type="warning" @click="query">查询</Button>
      <Button v-has="'export'">导出</Button>
    </div>
   
    <div class="footer">
      <vxe-table
        border
        ref="xTable"
        resizable
        size="mini"
        align="center"
        auto-resize
        resizeable
        highlight-hover-row
        highlight-current-row
        show-overflow
        @current-change="getOneClinet"
        height="400"
        :data="claimSupplierData"
      >
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column
          field="shortAname"
          title="分店名称"
          width="100"
        ></vxe-table-column>
        <vxe-table-column field="serviceId" title="理赔单号" width="100">
        </vxe-table-column>
        <vxe-table-column
          field="guestName"
          title="理赔单位"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="afterSaleDate"
          title="理赔日期"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="remark"
          title="备注"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="orderSign"
          title="状态"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="partInnerId"
          title="配件内码"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="partCode"
          title="配件编码"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="partName"
          title="配件名称"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="oemCode"
          title="OEM码"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="partBrand"
          title="品牌"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="carBrandName"
          title="品牌车型"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="unit"
          title="单位"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="afterSaleQty"
          title="理赔数量"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="afterSaleReason"
          title="理赔原因"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="processedQty"
          title="已处理数量"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="untreatedQty"
          title="未处理数量"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="spec"
          title="规格"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="carTypef"
          title="配件类别一级"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="carTypes"
          title="配件类别二级"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="createUname"
          title="创建人"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="createTime"
          title="创建日期"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="orderMan"
          title="提交人"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="orderDate"
          title="提交日期"
          width="100"
        ></vxe-table-column>
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
    </div>
  </div>
</template>

<script src="./index.ts">
</script>

<style lang="less" scoped>
.afterSale {
  width: 100%;
  height: 100%;
  background-color: white;
  padding: 5px 10px;
}
.date {
  width: 150px;
  margin: 0 10px;
}
.input {
  position: relative;
  left: -25px;
  top: 3px;
}
span {
  margin-left: 15px;
}
button {
  margin-left: 10px;
}
.footer {
  margin-top: 5px;
}
</style>

