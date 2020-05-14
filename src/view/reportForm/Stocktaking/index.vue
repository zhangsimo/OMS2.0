<template>
  <div class="content-oper" style="background: #fff">
    <Tabs style="min-height: 500px">
      <TabPane label="盘盈入库明细表">
        <panne :type="1" @search="search1" @export="exportxls('tabOne')" />
        <tabOne ref="tabOne" />
      </TabPane>
      <TabPane label="盘亏出库明细表">
        <panne :type="2" @search="search2" @export="exportxls('tabOne')" />
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
  name: "reporIndex",
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
        data2 = data;
      } else {
        if(data.partCode) {
          if(/[\u4e00-\u9fa5]/.test(data.partCode)) {
            data2.partName = data.partCode;
          } else {
            data2.partCode = data.partCode;
          }
        }
        data.startTime ? data2.enterDateStart = data.startTime : "";
        data.endTime ? data2.enterDateEnd = data.endTime : "";
        data.auditDate ? data2.auditDate = data.auditDate : "";
        data.serviceId ? data2.serviceId = data.serviceId : "";
        data.code ? data2.code = data.code : "";
        data.partBrand ? data2.partBrand = data.partBrand : "";
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.warehouseId2 ? data2.sourceId = data.warehouseId2 : "";
        data.orderman ? data2.auditor = data.orderman : "";
      }
      this.$refs.tabOne.getList(data2);
    },
    search2(data) {
      let data2 = {};
      if(data.isPanne) {
        // 基本查询
        delete data.isPanne;
        data2 = data;
      } else {
        if(data.partCode) {
          if(/[\u4e00-\u9fa5]/.test(data.partCode)) {
            data2.partName = data.partCode;
          } else {
            data2.partCode = data.partCode;
          }
        }
        data.startTime ? data2.outDateStart = data.startTime : "";
        data.endTime ? data2.outDateEnd = data.endTime : "";
        data.serviceId ? data2.serviceId = data.serviceId : "";
        data.code ? data2.code = data.code : "";
        data.partBrand ? data2.partBrand = data.partBrand : "";
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.warehouseId2 ? data2.sourceId = data.warehouseId2 : "";
        data.orderman ? data2.auditor = data.orderman : "";
      }
      this.$refs.tabTwo.getList(data2);
    },
    exportxls(refname) {
      this.$refs[refname].$refs.xTable.exportData({
        filename: '采购订单明细表',
        isHeader: true,
        isFooter: true,
        data: this.$refs[refname].tableDataAll,
      })
    },
  }
};
</script>
