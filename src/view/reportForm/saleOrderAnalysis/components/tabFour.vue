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
      :sort-config="{trigger: 'cell', defaultSort: {field: 'createTime', order: 'asc'}, orders: ['desc', 'asc']}"
      @sort-change="sortMethod"
      :footer-method="footerMethod"
      :data="tableData"
    >
      <vxe-table-column show-overflow="tooltip" type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="orgName" title="公司简称" width="130"></vxe-table-column>
      <!--<vxe-table-column show-overflow="tooltip" field="partTypeCode" title="类型编码" width="90"></vxe-table-column>-->
      <vxe-table-column show-overflow="tooltip" field="partTypeNameS" title="类型名称" width="100"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="sellQty" remote-sort title="销售数量" width="100"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="sellAmt" remote-sort title="销售金额" width="100"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="rtnableQty" remote-sort title="退货数量" width="90"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="rtAmt" remote-sort title="退货金额" width="100"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="trueQty" remote-sort title="实销数量" width="110"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="trueAmt" remote-sort title="实销金额" width="110"></vxe-table-column>
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
        let res = await api.getPjSellAnalyze(this.body, params);
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
      exportXls(){
        let params="";
        for(var i in this.body){
          params+=`${i}=${this.body[i]}&`
        }
        location.href=api.purchaseReporAnalysisExport(`${params}page=0&size=${this.page.total}`)
      },
      sortMethod({ column, property, order}) {
        //order:asc 升序 desc 降序
        //property:多个排序时所点击的头部
        //column:本列
        switch (property) {
          case "sellQty":
            this.body.sellQty=order == "asc" ? 0 : 1;
            this.body.sellAmt=undefined;
            this.body.rtnableQty=undefined;
            this.body.rtAmt=undefined;
            this.body.trueQty=undefined;
            this.body.trueAmt=undefined;
            this.body.enterAmt=undefined;
            break;
          case "sellAmt":
            this.body.sellQty=undefined;
            this.body.sellAmt=order == "asc" ? 0 : 1;
            this.body.rtnableQty=undefined;
            this.body.rtAmt=undefined;
            this.body.trueQty=undefined;
            this.body.trueAmt=undefined;
            this.body.enterAmt=undefined;
            break;
          case "rtnableQty":
            this.body.sellQty=undefined;
            this.body.sellAmt=undefined;
            this.body.rtnableQty=order == "asc" ? 0 : 1;
            this.body.rtAmt=undefined;
            this.body.trueQty=undefined;
            this.body.trueAmt=undefined;
            this.body.enterAmt=undefined;
            break;
          case "rtAmt":
            this.body.sellQty=undefined;
            this.body.sellAmt=undefined;
            this.body.rtnableQty=undefined;
            this.body.rtAmt=order == "asc" ? 0 : 1;
            this.body.trueQty=undefined;
            this.body.trueAmt=undefined;
            this.body.enterAmt=undefined;
            break;
          case "trueQty":
            this.body.sellQty=undefined;
            this.body.sellAmt=undefined;
            this.body.rtnableQty=undefined;
            this.body.rtAmt=undefined;
            this.body.trueQty=order == "asc" ? 0 : 1;
            this.body.trueAmt=undefined;
            this.body.enterAmt=undefined;
            break;
          case "trueAmt":
            this.body.sellQty=undefined;
            this.body.sellAmt=undefined;
            this.body.rtnableQty=undefined;
            this.body.rtAmt=undefined;
            this.body.trueQty=undefined;
            this.body.trueAmt=order == "asc" ? 0 : 1;
            this.body.enterAmt=undefined;
            break;
          case "enterAmt":
            this.body.sellQty=undefined;
            this.body.sellAmt=undefined;
            this.body.rtnableQty=undefined;
            this.body.rtAmt=undefined;
            this.body.trueQty=undefined;
            this.body.trueAmt=undefined;
            this.body.enterAmt=order == "asc" ? 0 : 1;
            break;
        }
        this.body.sort = order == "asc" ? 0 : 1
        this.getList();
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
                "sellQty",
                "sellAmt",
                "rtnableQty",
                "rtAmt",
                "trueQty",
                "trueAmt"
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
