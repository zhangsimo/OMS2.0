<template>
  <section class="con-box">
    <vxe-table
      border
      auto-resize
      resizable
      align="center"
      size="mini"
      ref="xTable"
      max-height="400"
      show-footer
      class="mytable-style"
      header-cell-class-name="headerClass"
      :footer-method="footerMethod"
      :data="tableData"
    >
      <vxe-table-column  show-overflow="tooltip" field="group0" title="基础数据">
        <vxe-table-column  show-overflow="tooltip" type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="区域" width="100"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="门店" width="70"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="店号" width="70"></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group1" title="存货数据">
        <vxe-table-column  show-overflow="tooltip" field="" title="期初库存" width="80"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="期末库存" width="80"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="增减金额" width="80"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="非统釆库存" width="110"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="统釆库存" width="80"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="库龄半年以内库存" width="140"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="库龄半年至一年库存" width="140"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="库龄一年至二年库存" width="140"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="库龄二年至三年库存" width="140"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="库龄三年以上库存" width="140"></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group2" title="采购数据">
        <vxe-table-column  show-overflow="tooltip" field="" title="内采金额" width="80"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="外采金额" width="80"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="采购合计" width="80"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="外采率(%)" width="110"></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group3" title="外部销售数据">
        <vxe-table-column  show-overflow="tooltip" field="" title="外部销售" width="70"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="外部毛利" width="70"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="外部毛利率(%)" width="110"></vxe-table-column>
<!--        <vxe-table-column  show-overflow="tooltip" field="" title="外部税点毛利" width="110"></vxe-table-column>-->
<!--        <vxe-table-column  show-overflow="tooltip" field="" title="外部非税点毛利" width="120"></vxe-table-column>-->
<!--        <vxe-table-column  show-overflow="tooltip" field="" title="外部非税点毛利率(%)" width="140"></vxe-table-column>-->
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group4" title="HS销售数据">
        <vxe-table-column  show-overflow="tooltip" field="" title="HS销售" width="70"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="HS毛利" width="70"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="HS毛利率(%)" width="110"></vxe-table-column>
<!--        <vxe-table-column  show-overflow="tooltip" field="" title="HS税点毛利" width="110"></vxe-table-column>-->
<!--        <vxe-table-column  show-overflow="tooltip" field="" title="HS非税点毛利" width="120"></vxe-table-column>-->
<!--        <vxe-table-column  show-overflow="tooltip" field="" title="HS非税点毛利率(%)" width="130"></vxe-table-column>-->
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group5" title="内部销售数据">
        <vxe-table-column  show-overflow="tooltip" field="" title="内部销售" width="70"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="内部毛利" width="70"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="内部毛利率(%)" width="110"></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group6" title="销售数据">
        <vxe-table-column  show-overflow="tooltip" field="" title="销售合计" width="70"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="毛利合计" width="70"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="" title="合计毛利率(%)" width="120"></vxe-table-column>
<!--        <vxe-table-column  show-overflow="tooltip" field="" title="合计税点毛利" width="140"></vxe-table-column>-->
<!--        <vxe-table-column  show-overflow="tooltip" field="" title="合计非税点毛利" width="140"></vxe-table-column>-->
<!--        <vxe-table-column  show-overflow="tooltip" field="" title="合计非税点毛利率(%)" width="140"></vxe-table-column>-->
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
        let res = await api.getSalesAndInventoryList(this.body, params);
        if (res.code == 0 && res.data != null) {
          this.tableData = (res.data.content || []).map(el => {
            return el;
          });

          this.page.total = res.data.totalElements;
        } else {
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
      //表尾合计
      footerMethod({ columns, data }) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return "合计";
            }
            if (
              [
                // "onOrderQty",
                // "inStockQty",
                // "noStockQty",
                // "taxPrice",
                // "taxAmt",
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
<style type="less" scoped>
  .mytable-style .vxe-header--column.headerClass{
    background-color: rgb(222, 237, 247) !important;
  }
</style>
