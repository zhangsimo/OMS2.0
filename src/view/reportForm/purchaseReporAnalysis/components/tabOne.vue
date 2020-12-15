<template>
  <section class="con-box">
    <vxe-table
      border
      align="left"
      size="mini"
      ref="xTable"
      height="400"
      auto-resize
      resizable
      show-footer
      :footer-method="footerMethod"
      :sort-config="{trigger: 'cell', defaultSort: {field: 'createTime', order: 'asc'}, orders: ['desc', 'asc']}"
      @sort-change="sortMethod"
      :data="tableData"
    >
      <vxe-table-column show-overflow="tooltip" type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="orgName" title="公司简称" width="130"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="guestCode" title="供应商编码" width="90"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="belongSystem" title="所属体系" width="80"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="guestType" title="供应商分类" width="100"></vxe-table-column>
      <!--      <vxe-table-column show-overflow="tooltip" field="guestClassfily" title="供应商等级" width="80"></vxe-table-column>-->
      <vxe-table-column show-overflow="tooltip" field="guestName" title="供应商名称" width="140"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="enterQty" remote-sort title="入库数量"
                        width="100"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="enterAmt" remote-sort title="入库金额"
                        width="100"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="rtnableQty" remote-sort title="退货数量"
                        width="90"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="rtAmt" remote-sort title="退货金额" width="100"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="trueQty" remote-sort title="实际入库数量"
                        width="110"></vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="trueAmt" remote-sort title="实际入库金额"
                        width="110"></vxe-table-column>
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
  import {showLoading, hideLoading} from "../../../../utils/loading";

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
        totalObj:{}
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
            el.guestClassfily = "一级"
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
      async getAllMoney(){
        showLoading()
        let resp2 = await api.pchsEnterMain(this.body)
        if(resp2.code==0){
          hideLoading()
          this.totalObj = resp2.data||{};
        }else{
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
      sortMethod({ column, property, order}) {
        //order:asc 升序 desc 降序
        //property:多个排序时所点击的头部
        //column:本列
        switch (property) {
          case "enterQty":
            this.body.enterQty=order == "asc" ? 0 : 1;
            this.body.enterAmt=undefined;
            this.body.rtnableQty=undefined;
            this.body.rtAmt=undefined;
            this.body.trueQty=undefined;
            this.body.trueAmt=undefined;
            break;
          case "enterAmt":
            this.body.enterQty=undefined;
            this.body.enterAmt=order == "asc" ? 0 : 1;
            this.body.rtnableQty=undefined;
            this.body.rtAmt=undefined;
            this.body.trueQty=undefined;
            this.body.trueAmt=undefined;
            break;
          case "rtnableQty":
            this.body.enterQty=undefined;
            this.body.enterAmt=undefined;
            this.body.rtnableQty=order == "asc" ? 0 : 1;
            this.body.rtAmt=undefined;
            this.body.trueQty=undefined;
            this.body.trueAmt=undefined;
            break;
          case "rtAmt":
            this.body.enterQty=undefined;
            this.body.enterAmt=undefined;
            this.body.rtnableQty=undefined;
            this.body.rtAmt=order == "asc" ? 0 : 1;
            this.body.trueQty=undefined;
            this.body.trueAmt=undefined;
            break;
          case "trueQty":
            this.body.enterQty=undefined;
            this.body.enterAmt=undefined;
            this.body.rtnableQty=undefined;
            this.body.rtAmt=undefined;
            this.body.trueQty=order == "asc" ? 0 : 1;
            this.body.trueAmt=undefined;
            break;
          case "trueAmt":
            this.body.enterQty=undefined;
            this.body.enterAmt=undefined;
            this.body.rtnableQty=undefined;
            this.body.rtAmt=undefined;
            this.body.trueQty=undefined;
            this.body.trueAmt=order == "asc" ? 0 : 1;
            break;
        }
        this.body.sort = order == "asc" ? 0 : 1
        this.getList();
      },
      exportXls() {
        let params = "";
        for (var i in this.body) {
          params += `${i}=${this.body[i]}&`
        }
        location.href = api.purchaseReporAnalysisExport(`${params}page=0&size=${this.page.total}`)
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
              return this.totalObj[column.property]||0
            }
            return null;
          })
        ];
      }
    }
  };
</script>
