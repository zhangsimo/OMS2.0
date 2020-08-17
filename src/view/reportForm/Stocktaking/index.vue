<template>
  <div class="content-oper" style="background: #fff">
    <Tabs style="min-height: 500px">
      <TabPane label="盘盈入库明细表">
        <panne :type="1" @search="search1" @export="exportxls('tabOne')" />
        <tabOne ref="tabOne" />
      </TabPane>
      <TabPane label="盘亏出库明细表">
        <panne :type="2" @search="search2" @export="exportxls('tabTwo')" />
        <tabTwo ref="tabTwo" />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import panne from "./components/panne";
import tabOne from "./components/tabOne";
import tabTwo from "./components/tabTwo";

export default {
  name: "procurementStocktaking",
  components: { panne, tabOne, tabTwo },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    search1(data) {
      let data2 = {};
      if(data.isPanne) {
        // 基本查询
        delete data.isPanne;
        data2 = {...data};
      } else {
        data.orgid?data2.orgid=data.orgid:"";
        data.partCode ? data2.partCode = data.partCode : "";
        data.startTime ? data2.enterDateStart = data.startTime : "";
        data.endTime ? data2.enterDateEnd = data.endTime : "";
        data.atimeStart ? data2.createTimeStart = data.atimeStart : "";
        data.atimeEnd ? data2.createTimeEnd = data.atimeEnd : "";
        data.serviceId ? data2.serviceId = data.serviceId : "";
        data.code ? data2.code = data.code : "";
        data.partBrand ? data2.partBrand = data.partBrand : "";
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.warehouseId2 ? data2.sourceId = data.warehouseId2 : "";
        data.orderman ? data2.auditorId = data.orderman : "";
      }
      this.$refs.tabOne.searchData=data2
      this.$refs.tabOne.page.page=0;
      this.$refs.tabOne.getList(data2);
    },
    search2(data) {
      let data2 = {};
      if(data.isPanne) {
        // 基本查询
        delete data.isPanne;
        data2 = {...data};
      } else {
        data.orgid?data2.orgid=data.orgid:"";
        data.partCode ? data2.partCode = data.partCode : "";
        data.startTime ? data2.outDateStart = data.startTime : "";
        data.endTime ? data2.outDateEnd = data.endTime : "";
        data.serviceId ? data2.serviceId = data.serviceId : "";
        data.code ? data2.code = data.code : "";
        data.partBrand ? data2.partBrand = data.partBrand : "";
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.warehouseId2 ? data2.sourceId = data.warehouseId2 : "";
        data.orderman ? data2.auditor = data.orderman : "";
      }
      this.$refs.tabTwo.searchData=data2
      this.$refs.tabTwo.page.page=0;
      this.$refs.tabTwo.getList(data2);
    },
    async exportxls(refname) {
      let expData = await this.$refs[refname].exportFun();
      let tabName = "盘盈入库明细表";
      switch (refname) {
        case "tabOne":
          tabName = "盘盈入库明细表";
          break;
        case "tabTwo":
          tabName = "盘亏出库明细表";
          break;
      }
      this.$refs[refname].$refs.xTable.exportData({
        filename: tabName,
        isHeader: true,
        isFooter: true,
        data: expData,
      })
    },
  }
};
</script>
