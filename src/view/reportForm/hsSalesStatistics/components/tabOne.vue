<template>
  <div style="flex: 1; height: 0px">
    <div class="pb10 show-list">
      <Checkbox v-model="single" class="show-item">显示区域</Checkbox>
      <Checkbox v-model="single" class="show-item">显示门店</Checkbox>
      <Checkbox v-model="single" class="show-item">显示华胜分店</Checkbox>
      <Checkbox v-model="single" class="show-item">显示事业部</Checkbox>
    </div>
    <section class="con-box" style="height: calc(100% - 42px);border: none; padding: 0px 10px">
      <vxe-table
        border
        auto-resize
        resizable
        align="left"
        size="mini"
        ref="xTable"
        height="auto"
        @current-change="getTongbi"
        highlight-current-row
        show-footer
        class="mytable-style"
        header-cell-class-name="headerClass"
        :footer-method="footerMethod"
        :data="tableData"
      >
        <vxe-table-column show-overflow="tooltip" type="seq" title="序号" width="60">
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="companyArea" title="区域" width="100"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="companyName" title="门店" width="150"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="companyCode" title="华胜分店" width="150"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="companyCode" title="销售净收入" sortable width="120"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="companyCode" title="销售净成本" sortable width="120"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="companyCode" title="销售毛利" sortable width="120"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="companyCode" title="人均销售收入" sortable width="120"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="companyCode" title="人均销售毛利" sortable width="120"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="companyCode" title="人数" width="120"></vxe-table-column>
      </vxe-table>
      <!--<Page-->
      <!--class-name="page-con"-->
      <!--:current="page.num"-->
      <!--:total="page.total"-->
      <!--:page-size="page.size"-->
      <!--:page-size-opts="pageOpts"-->
      <!--@on-change="changePage"-->
      <!--@on-page-size-change="changeSize"-->
      <!--show-sizer-->
      <!--show-total-->
      <!--transfer-->
      <!--&gt;</Page>-->
    </section>
  </div>
</template>

<script>
  import * as api from "_api/reportForm/index.js";
  import {showLoading,hideLoading} from "../../../../utils/loading";
  export default {
    data() {
      return {
        single:false,
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        pageOpts: [10, 20, 30, 50],
        body: {},
        tableData: [],
        tongbi:{},
        showFooter:false
      };
    },
    mounted() {
      // this.getList();
    },
    methods: {
      // 查询表
      async getList() {
        showLoading('.bigbox');
        let res = await api.omsInvoicingReport(this.body);
        this.showFooter = false;
        hideLoading();
        if (res.code == 0 && res.data != null) {
          this.tableData = (res.data || []).map(el => {
            return el;
          });
        } else {
          this.tableData = [];
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

      async getTongbi({row}){
        let res = await api.monthToMonth({id:row.id});
        if (res.code == 0 && res.data != null) {
          this.tongbi = res.data||{};
          this.showFooter = true;
          this.$nextTick(()=>{
            this.$refs.xTable.updateFooter();
          })
        }
      },

      //表尾合计
      footerMethod({ columns, data }) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return "合计";
            }
            // if (
            //   [
            //     // "onOrderQty",
            //     // "inStockQty",
            //     // "noStockQty",
            //     // "taxPrice",
            //     // "taxAmt",
            //   ].includes(column.property)
            // ) {
            //   return this.$utils.sum(data, column.property);
            // }
            return null;
          })
        ];
      }
    }
  };
</script>
<style type="less" scoped>
  .mytable-style .vxe-header--column.headerClass{
    background-color: rgb(222, 237, 247) !important;
  }
  .show-list{
    border-top: 1px solid #ddd;
    padding: 10px;
  }
  .show-list .show-item{
    margin-right: 20px!important;
  }
</style>
