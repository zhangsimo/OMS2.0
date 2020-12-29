<template>
  <section class="mt10">
    <vxe-table
      border
      align="left"
      size="mini"
      ref="xTable"
      height="400"
      auto-resize
      resizable
      show-overflow="title"
      show-footer
      :footer-method="footerMethod"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="shortName" title="分店名称" width="100"></vxe-table-column>
      <vxe-table-column field="partInnerId" title="配件内码" width="100"></vxe-table-column>
      <vxe-table-column field="partCode" title="配件编码" width="100"></vxe-table-column>
      <vxe-table-column field="partName" title="配件名称" width="100"></vxe-table-column>
      <vxe-table-column field="oemCode" title="OEM码" width="100"></vxe-table-column>
      <vxe-table-column field="partBrand" title="品牌" width="50"></vxe-table-column>
      <vxe-table-column field="carModelName" title="车型" width="50"></vxe-table-column>
      <vxe-table-column field="direction" title="方向" width="50"></vxe-table-column>
      <vxe-table-column field="unit" title="单位" width="50"></vxe-table-column>
      <vxe-table-column field="recordQty" title="本次操作数量" width="100"></vxe-table-column>
      <vxe-table-column field="balanceQty" title="结存数量" width="100"></vxe-table-column>
      <vxe-table-column field="recordTypeStatus" title="单据类型" width="100"></vxe-table-column>
      <vxe-table-column field="operationType" title="操作类型" width="100"></vxe-table-column>
      <vxe-table-column field="createUname" title="操作人" width="100"></vxe-table-column>
      <vxe-table-column field="createTime" title="操作日期" width="100"></vxe-table-column>
      <vxe-table-column field="guestName" title="客户/供应商" width="110"></vxe-table-column>
      <vxe-table-column field="afterSaleCode" title="单号" width="150"></vxe-table-column>
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

<script>
  import * as api from "_api/afterSale/claimsTheQuery/index.js";
  import {showLoading , hideLoading } from "../../../../../utils/loading";

  export default {
    data() {
      return {
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        pageOpts: [10, 20, 30, 50],
        body: {},
        tableData: [],
        total: {}
      };
    },
    mounted() {
      // this.getList();
    },
    methods: {
      // 查询表
      async getList() {
        let params = {
          page: this.page.num - 1,
          size: this.page.size,
        };
        showLoading()
        let res = await api.inAndOutLogQuery(params,this.body);
        if (res.code == 0 && res.data != null) {
          this.tableData = (res.data.content || []).map(el=>{
            //单据类型  1 理赔出库 1；2 理赔入库
            switch (el.recordType) {
              case "1":el.recordTypeStatus="理赔出库";break;
              case "2":el.recordTypeStatus="理赔入库";break;
              default: "1";
            }
            return el;
          })
          // this.total = res.data.purchaseOrderBean
          this.page.total = res.data.totalElements;
          hideLoading()
        } else {
          this.page.total = 0;
          this.tableData = [];
          hideLoading()
        }
      },
      //分页
      changePage(p) {
        this.page.num = p;
        this.getList();
      },
      changeSize(size) {
        this.page.num = 1;
        this.page.size = size;
        this.getList();
      },
      //表尾合计
      footerMethod({columns, data}) {
        return [
          // columns.map((column, columnIndex) => {
          //   if (columnIndex === 0) {
          //     return "总合计";
          //   }
          //   for (let key in this.total) {
          //     if (key == column.property) {
          //       return this.total[key]
          //     }
          //   }
          //   return null;
          // })
        ];
      }
    }
  };
</script>
<style scoped>
  /*.vxe-table.border--full */
  /*.vxe-table>.vxe-cell{*/
  /*  margin-left: -16px!important;*/
  /*}*/
</style>
