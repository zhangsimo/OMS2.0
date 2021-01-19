<template>
  <div style="flex: 1; height: 0px">
    <div class="pb10 show-list">
      <Checkbox v-model="showArea" :disabled="selectShopList" @on-change="hideCol" class="show-item">显示区域</Checkbox>
      <Checkbox v-model="showStore" :disabled="selectShopList" @on-change="hideCol" class="show-item">显示门店</Checkbox>
      <Checkbox v-model="showGuest" @on-change="hideCol" class="show-item">显示华胜分店</Checkbox>
      <Checkbox v-model="showBusinessUnit" @on-change="hideCol" class="show-item">显示事业部</Checkbox>
    </div>
    <section class="con-box" style="height: calc(100% - 88px);border: none; padding: 0px 10px">
      <vxe-table
        border
        auto-resize
        resizable
        align="left"
        size="mini"
        ref="xTable"
        height="auto"
        highlight-hover-row
        highlight-current-row
        show-footer
        class="mytable-style"
        header-cell-class-name="headerClass"
        :footer-method="footerMethod"
        :data="tableData"
        :sort-config="{multiple: false,remote:true}"
        @sort-change="sortChange"
      >
        <vxe-table-column show-overflow="tooltip" type="seq" title="序号" width="60">
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="area" title="区域" min-width="100" :visible="false"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="orgName" title="门店" min-width="150" :visible="false"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="guestName" title="华胜分店" min-width="150" :visible="false"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="businessUnit" title="事业部" min-width="150" :visible="false"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="sellAmt" title="销售净收入" sortable min-width="120">
          <template v-slot="{row}">
            {{row.sellAmt|NumFormat}}
          </template>
          <template v-slot:footer>
            <span>
              {{totalObj.sellAmt|NumFormat}}
            </span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="costAmt" title="销售净成本" sortable min-width="120">
          <template v-slot="{row}">
            {{row.costAmt|NumFormat}}
          </template>
          <template v-slot:footer>
            <span>
              {{totalObj.costAmt|NumFormat}}
            </span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="sellGrossMargin" title="销售毛利" sortable min-width="120">
          <template v-slot="{row}">
            {{row.sellGrossMargin|NumFormat}}
          </template>
          <template v-slot:footer>
            <span>
              {{totalObj.sellGrossMargin|NumFormat}}
            </span>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="preSellAmt" title="人均销售收入" sortable min-width="120">
          <template v-slot="{row}">
            {{row.preSellAmt|NumFormat}}
          </template>

        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="preGrossMargin" title="人均销售毛利" sortable min-width="120">
          <template v-slot="{row}">
            {{row.preGrossMargin|NumFormat}}
          </template>

        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="person" title="人数" min-width="120">
          <template v-slot:footer>
            <span>
              {{totalObj.person}}
            </span>
          </template>
        </vxe-table-column>
      </vxe-table>
    </section>
    <Page
      style="text-align: right;padding: 10px 0"
      :current="page.num"
      :total="page.total"
      :page-size="page.size"
      :page-size-opts="pageOpts"
      @on-change="changePage"
      @on-page-size-change="changeSize"
      show-sizer
      size="small"
      show-total
      transfer
    ></Page>
  </div>
</template>

<script>
  import * as api from "_api/reportForm/index.js";
  import {showLoading,hideLoading} from "../../../../utils/loading";
  export default {
    data() {
      return {
        showArea:false,
        showStore:false,
        showGuest:false,
        showBusinessUnit:false,
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        pageOpts: [10, 20, 30, 50],
        body: {},
        tableData: [],
        tongbi:{},
        showFooter:false,
        //排序
        sortObj:{},
        //合计
        totalObj:{}
      };
    },
    mounted() {
      this.showArea = this.selectShopList?true:false;
      this.showStore = this.selectShopList?true:false;
      this.hideColCom();
      // this.getList();
    },
    methods: {
      hideCol(){
        this.$nextTick(() => {
          this.hideColCom()
          this.page.num = 1;
          this.getList();
        })
      },
      hideColCom(){
        this.$nextTick(() => {
          if(this.showArea){
            this.$refs.xTable.showColumn(this.$refs.xTable.getColumnByField('area'));
          }else{
            this.$refs.xTable.hideColumn(this.$refs.xTable.getColumnByField('area'));
          }
          if(this.showStore){
            this.$refs.xTable.showColumn(this.$refs.xTable.getColumnByField('orgName'));
          }else{
            this.$refs.xTable.hideColumn(this.$refs.xTable.getColumnByField('orgName'));
          }
          if(this.showGuest){
            this.$refs.xTable.showColumn(this.$refs.xTable.getColumnByField('guestName'));
          }else{
            this.$refs.xTable.hideColumn(this.$refs.xTable.getColumnByField('guestName'));
          }
          if(this.showBusinessUnit){
            this.$refs.xTable.showColumn(this.$refs.xTable.getColumnByField('businessUnit'));
          }else{
            this.$refs.xTable.hideColumn(this.$refs.xTable.getColumnByField('businessUnit'));
          }
        })
      },
      // 查询表
      async getList() {
        showLoading('.bigbox');
        let params = {};
        params.page = this.page.num-1;
        params.size = this.page.size;
        this.body.showArea = this.showArea?1:0;
        this.body.showStore = this.showStore?1:0;
        this.body.showGuest = this.showGuest?1:0;
        this.body.showBusinessUnit = this.showBusinessUnit?1:0;
        let reqObj = {...this.body,...this.sortObj};
        let res = await api.getHarsonSaleReport(params,reqObj);
        let resTotal = await api.getHarsonSaleReportTotal({},reqObj);
        this.showFooter = false;
        hideLoading();
        if (res.code == 0 && res.data != null) {
          this.tableData = (res.data.content || []).map(el => {
            return el;
          });
          this.page.total = res.data.totalElements||0
        } else {
          this.tableData = [];
        }
        if(resTotal.code==0){
          this.totalObj = resTotal.data||{};
        }
      },

      sortChange({field,order}){
        this.sortObj = {};
        switch (field) {
          case 'sellAmt':
            this.sortObj['sellSort'] = order;
            break;
          case 'costAmt':
            this.sortObj['costSort'] = order;
            break;
          case 'sellGrossMargin':
            this.sortObj['grossMarginSort'] = order;
            break;
          case 'preSellAmt':
            this.sortObj['preSellSort'] = order;
            break;
          case 'preGrossMargin':
            this.sortObj['preGrossMarginSort'] = order;
            break;
        }
        this.page.num = 1;
        this.getList();
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
            // if (column.property=="sellAmt") {
            //   return this.totalObj.sellAmt
            // }
            // if (column.property=="costAmt") {
            //   return this.totalObj.costAmt
            // }
            // if (column.property=="sellGrossMargin") {
            //   return this.totalObj.sellGrossMargin
            // }
            // if (column.property=="preSellAmt") {
            //   return this.totalObj.preSellAmt
            // }
            // if (column.property=="preGrossMargin") {
            //   return this.totalObj.preGrossMargin
            // }
            // if (column.property=="person") {
            //   return this.totalObj.person
            // }
            return null;
          })
        ];
      }
    },
    computed: {
      selectShopList() {
        if (this.$store.state.user.userData.currentCompany != null) {
          return this.$store.state.user.userData.currentCompany.isMaster ? true : false
        } else {
          return true
        }
      },
      selectShopArea() {
        if (this.$store.state.user.userData.currentCompany != null) {
          return this.$store.state.user.userData.currentCompany.supplierTypeSecond;
        }else{
          return "";
        }
      }
    },
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
