<template>
  <div class="content-oper" style="background: #fff">
    <Tabs style="min-height: 500px">
      <TabPane label="组装成品入库明细表">
        <panne :type="1" @search="search1" @export="exportxls('tabOne')" />
        <tabOne ref="tabOne" />
      </TabPane>
      <TabPane label="组装半成品出库明细表">
        <panne :type="2" @search="search2" @export="exportxls('tabTwo')" />
        <tabTwo ref="tabTwo" />
      </TabPane>
      <TabPane label="拆分成品出库明细表">
        <panne :type="3" @search="search3" @export="exportxls('tabThree')" />
        <tabThree ref="tabThree" />
      </TabPane>
      <TabPane label="拆分半成品入库明细表">
        <panne :type="4" @search="search4" @export="exportxls('tabFour')" />
        <tabFour ref="tabFour" />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import panne from "./components/panne";
import tabOne from "./components/tabOne";
import tabTwo from "./components/tabTwo";
import tabThree from "./components/tabThree";
import tabFour from "./components/tabFour";

export default {
  name: "procurementAssembly",
  components: { panne, tabOne, tabTwo, tabThree, tabFour },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    search1(data) {
      // console.log(data)
      let data2 = {}
      if (data.isPanne) {
        // 基本查询
        delete data.isPanne;
        data2 = data;
      } else {
        data.orgid?data2.orgid=data.orgid:"";
        data.createTime ? data2.startTime = data.createTime : "";
        data.endTime ? data2.endTime = data.endTime : "";
        data.startAuditDate ? data2.startAuditDate = data.startAuditDate : "";
        data.endAuditDate ? data2.endAuditDate = data.endAuditDate : "";
        data.partCode ? data2.partCode = data.partCode : "";
        data.serviceId ? data2.serviceId = data.serviceId : "";
        data.partBrandList ? data2.partBrandList = data.partBrandList : [];
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.orderman ? data2.orderManId = data.orderman : "";
        data.createUname ? data2.createUid = data.createUname : "";
        data.auditor ? data2.auditorId = data.auditor : "";
      }
      this.$refs.tabOne.page.page = 0;
      this.$refs.tabOne.getList(data2);
    },
    search2(data) {
      let data2 = {}
      if (data.isPanne) {
        // 基本查询
        delete data.isPanne;
        data2 = data;
      } else {
        data.orgid?data2.orgid=data.orgid:"";
        data.createTime ? data2.startTime = data.createTime : "";
        data.endTime ? data2.endTime = data.endTime : "";
        data.startAuditDate ? data2.startAuditDate = data.startAuditDate : "";
        data.endAuditDate ? data2.endAuditDate = data.endAuditDate : "";
        data.partCode ? data2.partCode = data.partCode : "";
        data.serviceId ? data2.serviceId = data.serviceId : "";
        data.partBrandList ? data2.partBrandList = data.partBrandList : [];
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.orderman ? data2.orderManId = data.orderman : "";
        data.createUname ? data2.createUid = data.createUname : "";
        data.auditor ? data2.auditorId = data.auditor : "";
      }
      this.$refs.tabTwo.page.page = 0;
      this.$refs.tabTwo.getList(data2);
    },
    search3(data) {
      let data2 = {}
      if (data.isPanne) {
        // 基本查询
        delete data.isPanne;
        data2 = data;
      } else {
        data.orgid?data2.orgid=data.orgid:"";
        data.createTime ? data2.startTime = data.createTime : "";
        data.endTime ? data2.endTime = data.endTime : "";
        data.startAuditDate ? data2.startAuditDate = data.startAuditDate : "";
        data.endAuditDate ? data2.endAuditDate = data.endAuditDate : "";
        data.partCode ? data2.partCode = data.partCode : "";
        data.serviceId ? data2.serviceId = data.serviceId : "";
        data.partBrandList ? data2.partBrandList = data.partBrandList : [];
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.orderman ? data2.orderManId = data.orderman : "";
        data.createUname ? data2.createUid = data.createUname : "";
        data.auditor ? data2.auditorId = data.auditor : "";
      }
      this.$refs.tabThree.page.page = 0;
      this.$refs.tabThree.getList(data2);
    },
    search4(data) {
      let data2 = {}
      if (data.isPanne) {
        // 基本查询
        delete data.isPanne;
        data2 = data;
      } else {
        data.orgid?data2.orgid=data.orgid:"";
        data.createTime ? data2.startTime = data.createTime : "";
        data.endTime ? data2.endTime = data.endTime : "";
        data.startAuditDate ? data2.startAuditDate = data.startAuditDate : "";
        data.endAuditDate ? data2.endAuditDate = data.endAuditDate : "";
        data.partCode ? data2.partCode = data.partCode : "";
        data.serviceId ? data2.serviceId = data.serviceId : "";
        data.partBrandList ? data2.partBrandList = data.partBrandList : [];
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.orderman ? data2.orderManId = data.orderman : "";
        data.createUname ? data2.createUid = data.createUname : "";
        data.auditor ? data2.auditorId = data.auditor : "";
      }
      this.$refs.tabFour.page.page = 0;
      this.$refs.tabFour.getList(data2);
    },
    async exportxls(refname) {
      let expData = await this.$refs[refname].exportFun();
      let tabName = "组装成品入库明细表";
      switch (refname) {
        case "tabOne":
          tabName = "组装成品入库明细表";
          break;
        case "tabTwo":
          tabName = "组装半成品出库明细表";
          break;
        case "tabThree":
          tabName = "拆分成品出库明细表";
          break;
        case "tabFour":
          tabName = "拆分半成品入库明细表";
          break
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
