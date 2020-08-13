<template>
  <div class="content-oper" style="background: #fff">
    <Tabs style="min-height: 500px">
      <TabPane label="移仓入库明细表">
        <panne :type="1" @search="search1" @export="exportxls('tabOne')" />
        <tabOne ref="tabOne" />
      </TabPane>
      <TabPane label="移仓出库明细表">
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
  name: "procurementMoveWarehouse",
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
        data2.receiveStoreId = data2.storeId;
        delete data2.storeId;
      } else {
        data.orgid?data2.orgid=data.orgid:"";
        data.commitStartDate ? data2.commitStartDate = data.commitStartDate : "";
        data.commitEndDate ? data2.commitEndDate = data.commitEndDate : "";
        data.serviceId ? data2.enterServiceId = data.serviceId : "";
        data.code ? data2.serviceId = data.code : "";
        data.partCode ? data2.partCode = data.partCode : "";
        data.partBrandList ? data2.partBrandList = data.partBrandList : [];
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.warehouseId2 ? data2.receiveStoreId = data.warehouseId2 : "";
        data.orderman ? data2.orderManId = data.orderman : "";
      }
      this.$refs.tabOne.page.page=0;
      this.$refs.tabOne.getList(data2);
    },
    search2(data) {
      let data2 = {};
      if(data.isPanne) {
        // 基本查询
        delete data.isPanne;
        data2 = data;
      } else {
        data.orgid?data2.orgid=data.orgid:"";
        data.commitStartDate ? data2.commitStartDate = data.commitStartDate : "";
        data.commitEndDate ? data2.commitEndDate = data.commitEndDate : "";
        data.serviceId ? data2.enterServiceId = data.serviceId : "";
        data.code ? data2.serviceId = data.code : "";
        data.partCode ? data2.partCode = data.partCode : "";
        data.partBrandList ? data2.partBrandList = data.partBrandList : [];
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.warehouseId2 ? data2.receiveStoreId = data.warehouseId2 : "";
        data.orderman ? data2.orderManId = data.orderman : "";
      }
      this.$refs.tabTwo.page.page = 0;
      this.$refs.tabTwo.getList(data2);
    },
    async exportxls(refname) {
      let expData = await this.$refs[refname].exportFun();
      let tabName = "移仓入库明细表";
      switch (refname) {
        case "tabOne":
          tabName = "移仓入库明细表";
          break;
        case "tabTwo":
          tabName = "移仓出库明细表";
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
