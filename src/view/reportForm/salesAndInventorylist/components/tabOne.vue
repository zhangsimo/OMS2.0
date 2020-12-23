<template>
  <section class="con-box" style="height: calc(100% - 84px)">
    <vxe-table
      border
      auto-resize
      resizable
      align="center"
      size="mini"
      ref="xTable"
      height="auto"
      @current-change="getTongbi"
      highlight-current-row
      :show-footer="showFooter"
      class="mytable-style"
      header-cell-class-name="headerClass"
      :footer-method="footerMethod"
      :data="tableData"
    >
      <vxe-table-column  show-overflow="tooltip" field="group0" title="基础数据">
        <vxe-table-column  show-overflow="tooltip" type="seq" title="序号" width="60">
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="companyArea" title="区域" width="100"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="companyName" title="门店" width="70"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="companyCode" title="店号" width="70"></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group1" title="存货数据">
        <vxe-table-column  show-overflow="tooltip" field="qcAmt" title="期初库存" width="80">
          <template v-slot:footer>
            <span>{{tongbi.qcAmt+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="balaAmt" title="期末库存" width="80">
          <template v-slot:footer>
            <span>{{tongbi.balaAmt+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="regulationAmt" title="增减金额" width="80">
          <template v-slot:footer>
            <span>{{tongbi.regulationAmt+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="noTcAmt" title="非统釆库存" width="110">
          <template v-slot:footer>
            <span>{{tongbi.noTcAmt+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="tcAmt" title="统釆库存" width="80">
          <template v-slot:footer>
            <span>{{tongbi.tcAmt+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="stockAgeHalf" title="库龄半年以内库存" width="140">
          <template v-slot:footer>
            <span>{{tongbi.stockAgeHalf+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="stockAgeOne" title="库龄半年至一年库存" width="140">
          <template v-slot:footer>
            <span>{{tongbi.stockAgeOne+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="stockAgeTwo" title="库龄一年至二年库存" width="140">
          <template v-slot:footer>
            <span>{{tongbi.stockAgeTwo+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="stockAgeThree" title="库龄二年至三年库存" width="140">
          <template v-slot:footer>
            <span>{{tongbi.stockAgeThree+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="stockAgeMore" title="库龄三年以上库存" width="140">
          <template v-slot:footer>
            <span>{{tongbi.stockAgeMore+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group2" title="采购数据">
        <vxe-table-column  show-overflow="tooltip" field="ncAmt" title="内采金额" width="80">
          <template v-slot:footer>
            <span>{{tongbi.ncAmt+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="wcAmt" title="外采金额" width="80">
          <template v-slot:footer>
            <span>{{tongbi.wcAmt+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="cgTotalAmt" title="采购合计" width="80">
          <template v-slot:footer>
            <span>{{tongbi.cgTotalAmt+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="wcRate" title="外采率(%)" width="110">
          <template v-slot="{row}">
            <span>{{row.wcRate}}%</span>
          </template>
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group3" title="外部销售数据">
        <vxe-table-column  show-overflow="tooltip" field="wbSell" title="外部销售" width="70">
          <template v-slot:footer>
            <span>{{tongbi.wbSell+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="wbGrossMargin" title="外部毛利" width="70">
          <template v-slot:footer>
            <span>{{tongbi.wbGrossMargin+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="wbMaoliRate" title="外部毛利率(%)" width="110">
          <template v-slot="{row}">
            <span>{{row.wbMaoliRate}}%</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="wbTaxGrossMargin" title="外部税点毛利" width="110">
          <template v-slot:footer>
            <span>{{tongbi.wbTaxGrossMargin+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="wbNoTaxGrossMargin" title="外部非税点毛利" width="120">
          <template v-slot:footer>
            <span>{{tongbi.wbNoTaxGrossMargin+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="wbNoTaxMaoliRate" title="外部非税点毛利率(%)" width="140">
          <template v-slot="{row}">
            <span>{{row.wbNoTaxMaoliRate}}%</span>
          </template>
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group4" title="HS销售数据">
        <vxe-table-column  show-overflow="tooltip" field="hsSell" title="HS销售" width="70">
          <template v-slot:footer>
            <span>{{tongbi.hsSell+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="hsGrossMargin" title="HS毛利" width="70">
          <template v-slot:footer>
            <span>{{tongbi.hsGrossMargin+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="hsMaoliRate" title="HS毛利率(%)" width="110">
          <template v-slot="{row}">
            <span>{{row.hsMaoliRate}}%</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="hsTaxGrossMargin" title="HS税点毛利" width="110">
          <template v-slot:footer>
            <span>{{tongbi.hsTaxGrossMargin+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="hsNoTaxGrossMargin" title="HS非税点毛利" width="120">
          <template v-slot:footer>
            <span>{{tongbi.hsNoTaxGrossMargin+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="hsNoTaxMaoliRate" title="HS非税点毛利率(%)" width="130">
          <template v-slot="{row}">
            <span>{{row.hsNoTaxMaoliRate}}%</span>
          </template>
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group5" title="内部销售数据">
        <vxe-table-column  show-overflow="tooltip" field="domesticSales" title="内部销售" width="70">
          <template v-slot:footer>
            <span>{{tongbi.domesticSales+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="domesticGrossMargin" title="内部毛利" width="70">
          <template v-slot:footer>
            <span>{{tongbi.domesticGrossMargin+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="nxMaoliRate" title="内部毛利率(%)" width="110">
          <template v-slot="{row}">
            <span>{{row.nxMaoliRate}}%</span>
          </template>
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group6" title="销售数据">
        <vxe-table-column  show-overflow="tooltip" field="saleTotal" title="销售合计" width="70">
          <template v-slot:footer>
            <span>{{tongbi.saleTotal+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="grossMarginTotal" title="毛利合计" width="70">
          <template v-slot:footer>
            <span>{{tongbi.grossMarginTotal+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="totalMaoliRate" title="合计毛利率(%)" width="120">
          <template v-slot="{row}">
            <span>{{row.totalMaoliRate}}%</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="totalTaxMaoli" title="合计税点毛利" width="140">
          <template v-slot:footer>
            <span>{{tongbi.totalTaxMaoli+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="totalNoTaxMaoli" title="合计非税点毛利" width="140">
          <template v-slot:footer>
            <span>{{tongbi.totalNoTaxMaoli+'%'||0+'%'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="totalNoTaxMaoliRate" title="合计非税点毛利率(%)" width="140">
          <template v-slot="{row}">
            <span>{{row.totalNoTaxMaoliRate}}%</span>
          </template>
        </vxe-table-column>
      </vxe-table-column>
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
        showLoading();
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
              return "环比";
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
</style>
