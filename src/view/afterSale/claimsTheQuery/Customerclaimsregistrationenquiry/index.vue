<template>
  <div class="afterSale">
    <div class="top">
      <quick-date
        ref="quickdate"
        class="mr10"
        v-on:quickDate="getDataQuick"
      ></quick-date>
      <span>创建日期:</span>
      <DatePicker
        v-model="createTime"
        format="yyyy-MM-dd HH:mm:ss"
        type="date"
        class="date"
      ></DatePicker>

      <span class="ml5">理赔单位：</span>
      <Input
        v-model="orderUnit"
        placeholder="请输入理赔单位"
        style="width: 200px"
        clearable
      />
      <i class="iconfont iconcaidan input" @click="Dealings"></i>
      <span>品牌：</span>
      <Select v-model="brand" @on-change="getDataType" class="w90 mr10">
        <Option
          v-for="item in brandArr"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select>
      <span class="ml5">配件编码/名称/内码：</span>
      <Input v-model="Fittingscode" style="width: 200px" clearable />
      <span>状态：</span>
      <Select v-model="state" @on-change="getDataType1" class="w90 mr10">
        <Option
          v-for="item in stateArr"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select>
      <Button @click="query">查询</Button>
      <Button v-has="'export'">导出</Button>
    </div>
    <Selectss ref="Selectss" @getOne="getOne" />
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
        :data="tableData"
      >
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="revokeNum" title="分店名称" width="100"></vxe-table-column>
        <vxe-table-column field="revokeType" title="理赔单号" width="100">
          <template v-slot="{ row }">{{
            row.revokeType ? row.revokeType.name : ""
          }}</template>
        </vxe-table-column>
        <vxe-table-column field="source" title="理赔单位" width="100"></vxe-table-column>
        <vxe-table-column field="verifyNum" title="理赔日期" width="100"></vxe-table-column>
        <vxe-table-column
          field="billCreateTime"
          title="备注"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="billCreateUname"
          title="状态"
          width="100"
        ></vxe-table-column>
        <vxe-table-column field="billAmt" title="配件内码" width="100"></vxe-table-column>
        <vxe-table-column
          field="createTime"
          title="配件编码"
          width="100"
        ></vxe-table-column>
        <vxe-table-column field="createUname" title="配件名称" width="100"></vxe-table-column>
        <vxe-table-column
          field="revokeReason"
          title="OEM码"
          width="100"
        ></vxe-table-column>
       <vxe-table-column
          field="revokeReason"
          title="品牌"
          width="100"
        ></vxe-table-column> 
         <vxe-table-column
          field="revokeReason"
          title="品牌车型"
          width="100"
        ></vxe-table-column>
         <vxe-table-column
          field="revokeReason"
          title="单位"
          width="100"
        ></vxe-table-column>
         <vxe-table-column
          field="revokeReason"
          title="理赔数量"
          width="100"
        ></vxe-table-column>
         <vxe-table-column
          field="revokeReason"
          title="理赔原因"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="revokeReason"
          title="已处理数量"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="revokeReason"
          title="未处理数量"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="revokeReason"
          title="规格"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="revokeReason"
          title="配件类别一级"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="revokeReason"
          title="配件类别二级"
          width="100"
        ></vxe-table-column>
         <vxe-table-column
          field="revokeReason"
          title="创建人"
          width="100"
        ></vxe-table-column>
         <vxe-table-column
          field="revokeReason"
          title="创建日期"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="revokeReason"
          title="提交人"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="revokeReason"
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
.footer{
  margin-top: 5px;
}
</style>

