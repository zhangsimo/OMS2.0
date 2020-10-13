<template>
  <div class="content-oper content-oper-flex loadingClass" style="background-color: #fff;">
    <div class="oper-top pl10">
      <span class="mr5">快速查询：</span>
      <quickDate class="mr10" ref="quickDate" @quickDate="quickDate"></quickDate>
      <span class="mr5">期间：</span>
      <Date-picker
        :value="value"
        type="daterange"
        placeholder="选择日期"
        class="w200 mr15"
        @on-change="dateChange"
      ></Date-picker>
      <span class="mr5">分店名称：</span>
      <Select v-model="shopCode" filterable class="w150 mr15" :disabled="selectShopList">
        <Option v-for="item in shopList" :value="item.id" :key="item.id">{{ item.shortName }}</Option>
      </Select>
      <button class="mr15 ivu-btn ivu-btn-default" type="button" @click="query">
        <i class="iconfont iconchaxunicon"></i>
        <span>查询</span>
      </button>
      <button
        class="ivu-btn ivu-btn-default"
        type="button"
        @click="exportSelectEvent"
        v-has="'export'"
      >
        <span>导出</span>
      </button>
    </div>
    <vxe-table
      border
      ref="xTable"
      resizable
      size="mini"
      align="center"
      auto-resize
      resizeable
      highlight-hover-row
      highlight-current-row
      show-overflow
      height="600"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="revokeNum" title="撤销单号"></vxe-table-column>
      <vxe-table-column field="revokeType" title="撤单类型">
        <template v-slot="{row}">{{row.revokeType ? row.revokeType.name : ''}}</template>
      </vxe-table-column>
      <vxe-table-column field="source" title="撤销来源"></vxe-table-column>
      <vxe-table-column field="verifyNum" title="对账单号"></vxe-table-column>
      <vxe-table-column field="billCreateTime" title="单号生成时间"></vxe-table-column>
      <vxe-table-column field="billCreateUname" title="单号制单人"></vxe-table-column>
      <vxe-table-column field="billAmt" title="单号金额"></vxe-table-column>
      <vxe-table-column field="createTime" title="撤销时间"></vxe-table-column>
      <vxe-table-column field="createUname" title="撤销人"></vxe-table-column>
      <vxe-table-column field="revokeReason" title="撤销原因"></vxe-table-column>
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
  </div>
</template>

<script>
  import quickDate from "@/components/getDate/dateget_bill.vue";
  import {creat} from "../../components";
  import {runningWater} from "@/api/settlementManagement/documentsToQuery/undoFlowQuery";
  import {goshop} from "@/api/settlementManagement/shopList";
  import {undoFlowQueryExport/**导出*/} from "@/api/settlementManagement/Import/index.js";
  import moment from "moment";
  import {showLoading, hideLoading} from "@/utils/loading"

  export default {
    name: "UndoFlowQuery",
    components: {
      quickDate
    },
    data() {
      return {
        fno: "", //调拨单号
        value: [],
        shopList: [{id: 0, shortName: "全部"}],
        shopCode: this.$store.state.user.userData.currentShopId ? this.$store.state.user.userData.currentShopId ? this.$store.state.user.userData.currentShopId : '' : '',
        tableData: [],//表格数据
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        pageOpts: [10, 20, 30, 40, 50],
      };
    },
    computed: {
      selectShopList() {
        if (this.$store.state.user.userData.currentCompany != null) {
          return this.$store.state.user.userData.currentCompany.isMaster ? true : false
        } else {
          return true
        }
      }
    },
    async mounted() {
      let arr = await creat(this.$refs.quickDate.val, this.$store);
      this.value = arr[0];
      this.getShop(arr); //获取门店
    },
    methods: {
      //获取门店
      async getShop(arr) {
        let data = {};
        data.supplierTypeSecond = 0;
        let res = await goshop(data);
        if (res.code === 0) {
          this.shopList = [...this.shopList, ...res.data]
          // if (this.$store.state.user.userData.currentCompany.isMaster){
          //   this.shopCode = arr[1]
          // }
        }
      },

      //获取表格数据
      async getList() {
        let data = {};
        data.page = this.page.num - 1;
        data.size = this.page.size;
        data.orgId = this.shopCode;
        data.startDate = this.value[0]
          ? moment(this.value[0])
            .startOf("day")
            .format("YYYY-MM-DD HH:mm:ss")
          : "";
        data.endDate = this.value[1]
          ? moment(this.value[1])
            .endOf("day")
            .format("YYYY-MM-DD HH:mm:ss")
          : "";
        try {

          showLoading(".loadingClass", "数据加载中，请勿操作")
          let res = await runningWater(data);
          if (res.code === 0) {
            this.tableData = res.data.content;
            this.page.total=res.data.totalElements
          }
          hideLoading()
        } catch (error) {
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
      // 快速查询
      quickDate(data) {
        this.value = data;
        this.getList();
      },

      //查询
      query() {
        this.getList();
      },

      // 日期选择
      dateChange(data) {
        this.value = data;
      },

      //导出数据
      exportSelectEvent() {
        if (this.tableData.length === 0)
          return this.$Message.error("暂无数据导出");
        let params="";
        let data={};
        data.orgId = this.shopCode;
        data.startDate = this.value[0]
          ? moment(this.value[0])
            .startOf("day")
            .format("YYYY-MM-DD HH:mm:ss")
          : "";
        data.endDate = this.value[1]
          ? moment(this.value[1])
            .endOf("day")
            .format("YYYY-MM-DD HH:mm:ss")
          : "";
        data.pagesize=this.page.total;
        for(var i in data){
          params+=`${i}=${data[i]}&`
        }
        location.href=undoFlowQueryExport(params)
      }
    }
  };
</script>

<style lang="less" scoped>
  .oper-top {
    line-height: 50px;
    border-bottom: 1px #dddddd solid;
  }
</style>
