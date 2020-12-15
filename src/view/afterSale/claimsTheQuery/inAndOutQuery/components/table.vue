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
      show-overflow="tooltip"
      show-footer
      :footer-method="footerMethod"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="shortName" title="分店名称" width="100"></vxe-table-column>
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
        let res = await api.inAndOutLogQuery(this.body, params);
        if (res.code == 0 && res.data != null) {
          this.tableData = (res.data.content || [])
          // this.total = res.data.purchaseOrderBean
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
