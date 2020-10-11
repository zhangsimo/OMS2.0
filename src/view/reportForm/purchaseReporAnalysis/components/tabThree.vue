<template>
  <section class="con-box">
    <vxe-table
      border
      align="left"
      size="mini"
      ref="xTable"
      height="400"
      show-footer
      auto-resize
      resizable
      :footer-method="footerMethod"
      :data="tableData"
    >
      <vxe-table-column show-overflow="tooltip" type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="orgName" title="公司简称" width="130"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="partBrandCode" title="品牌编码" width="90"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="partBrand" title="品牌名称" width="100"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="enterQty" title="入库数量" width="100"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="enterAmt" title="入库金额" width="100"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="rtnableQty" title="退货数量" width="90"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="rtAmt" title="退货金额" width="100"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="trueQty" title="实际入库数量" width="110"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="trueAmt" title="实际入库金额" width="110"></vxe-table-column>
    </vxe-table>
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
  </section>
</template>

<script>
  import * as api from "_api/reportForm/index.js";
  import {showLoading,hideLoading} from "../../../../utils/loading";

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
        tableData: []
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
        let res = await api.getPurchaseReporAnalysis(this.body, params);
        if (res.code == 0 && res.data != null) {
          this.tableData = (res.data.content || []).map(el => {
            return el;
          });

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
      exportXls(){
        let params="";
        for(var i in this.body){
          params+=`${i}=${this.body[i]}&`
        }
        location.href=api.purchaseReporAnalysisExport(`${params}page=0&size=${this.page.total}`)
      },
      //表尾合计
      footerMethod({columns, data}) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return "合计";
            }
            if (
              [
                "enterQty",
                "enterAmt",
                "rtnableQty",
                "rtAmt",
                "trueQty",
                "trueAmt",
              ].includes(column.property)
            ) {
              return this.$utils.sum(data, column.property);
            }
            return null;
          })
        ];
      }
    }
  };
</script>
