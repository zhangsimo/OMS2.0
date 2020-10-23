<template>
  <section class="con-box">
    <vxe-table
      border
      align="left"
      size="mini"
      ref="xTable"
      height="400"
      show-footer
      :data="tableData"
    >
<!--      :footer-method="footerMethod"-->
      <vxe-table-column  show-overflow="tooltip" field="group0" title="本日销售数据">
        <vxe-table-column  show-overflow="tooltip" type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="dateTime" title="日期" width="100"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="num" title="开单数" width="70"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="guestNum" title="客户数" width="70"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="sellAmt" title="销售金额" width="100"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="grossSales" title="销售毛利" width="100"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="grossMargin" title="毛利率(%)" width="80"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="grossProfit" title="税点毛利" width="100"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="nonGrossProfit" title="非税点毛利" width="100"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="nonGrossMargin" title="非税点毛利率(%)" width="120"></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group1" title="外部销售数据">
        <vxe-table-column  show-overflow="tooltip" field="sellOut" title="外部销售" width="70"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="grossSalesOut" title="外部毛利" width="70"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="grossMarginOut" title="外部毛利率(%)" width="110"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="grossProfitOut" title="外部税点毛利" width="110"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="nonGrossProfitOut" title="外部非税点毛利" width="120"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="nonGrossMarginOut" title="外部非税点毛利率(%)" width="140"></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group2" title="HS销售数据">
        <vxe-table-column  show-overflow="tooltip" field="sellHs" title="HS销售" width="70"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="grossSalesHs" title="HS毛利" width="70"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="grossMarginHs" title="HS毛利率(%)" width="110"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="grossProfitHs" title="HS税点毛利" width="110"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="nonProfitHs" title="HS非税点毛利" width="120"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="nonGrossMarginHs" title="HS非税点毛利率(%)" width="130"></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group3" title="内部销售数据">
        <vxe-table-column  show-overflow="tooltip" field="sellInternal" title="内部销售" width="70"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="salesInternal" title="内部毛利" width="70"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="grossMarginInternal" title="内部毛利率(%)" width="110"></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group4" title="未审销售数据">
        <vxe-table-column  show-overflow="tooltip" field="outUnreviewedNumber" title="外部未审单数" width="110"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="outUnreviewedAmt" title="外部未审金额" width="110"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="internalUnreviewedNumber" title="内部未审单数" width="110"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="internalUnreviewedAmt" title="内部未审金额" width="110"></vxe-table-column>
      </vxe-table-column>
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
        let res = await api.getDailySalesStatistics(this.body, params);
        if (res.code == 0 && res.data != null) {
          this.tableData = (res.data.content || []).map(el => {
            return el;
          });
          hideLoading()
          this.page.total = res.data.totalElements;
        } else {
          hideLoading()
          this.page.total = 0;
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
      export(){
        if(this.tableData.length<=0){
          return this.$message.warning("暂无数据导出")
        }
        let params="";
        this.body.page=0;
        this.body.size=this.page.total;
        for(var i in this.body){
          params+=`${i}=${this.body[i]}&`
        }
        location.href=api.getDailySalesStatisticsExport(`${params}`)
      },
      // //表尾合计
      // footerMethod({ columns, data }) {
      //   return [
      //     columns.map((column, columnIndex) => {
      //       if (columnIndex === 0) {
      //         return "合计";
      //       }
      //       if (
      //         [
      //           "num","guestNum","sellAmt"
      //         ].includes(column.property)
      //       ) {
      //         return this.$utils.sum(data, column.property);
      //       }
      //       return null;
      //     })
      //   ];
      // }
    }
  };
</script>
