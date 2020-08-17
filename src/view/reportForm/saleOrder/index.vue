<template>
  <div class="content-oper" style="background: #fff">
    <Tabs style="min-height: 500px">
      <TabPane label="销售订单明细表">
        <panne :type="1" @search="search1" @export="exportxls('tabOne')" />
        <tabOne ref="tabOne" />
      </TabPane>
      <TabPane label="销售出库明细表">
        <panne :type="2" @search="search2" @export="exportxls('tabTwo')" />
        <tabTwo ref="tabTwo" />
      </TabPane>
      <TabPane label="销售退货明细表">
        <panne :type="3" @search="search3" @export="exportxls('tabThree')" />
        <tabThree ref="tabThree" />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import panne from "./components/panne";
import tabOne from "./components/tabOne";
import tabTwo from "./components/tabTwo";
import tabThree from "./components/tabThree";

export default {
  name: "procurementSaleOrder",
  components: { panne, tabOne, tabTwo, tabThree },
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
        data.orgid?data2.orgid=data.orgid:""
        data.ctimeStart ? data2.startTime = data.ctimeStart : "";
        data.ctimeEnd ? data2.endTime = data.ctimeEnd : "";
        data.atimeStart ? data2.auditStartTime = data.atimeStart : "";
        data.atimeEnd ? data2.auditEndTime = data.atimeEnd : "";
        data.guestFullName ? data2.guestFullName = data.guestFullName : "";
        data.serviceId ? data2.serviceId = data.serviceId : "";
        data.code ? data2.code = data.code : "";
        data.partCode ? data2.partCode = data.partCode : "";
        data.partBrand ? data2.partBrand = data.partBrand : "";
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.orderman ? data2.orderManId = data.orderman : "";
        data.auditor ? data2.auditorId = data.auditor : "";
        data.createUname ? data2.createUid = data.createUname : "";
      }
      this.$refs.tabOne.body = data2
      this.$refs.tabOne.getList();
    },
    search2(data) {
      let data2 = {};
      if(data.isPanne) {
        // 基本查询
        delete data.isPanne;
        data2 = data;
      } else {
        data.orgid?data2.orgid=data.orgid:"";
        data.ctimeStart ? data2.startOutDate = data.ctimeStart : "";
        data.ctimeEnd ? data2.endOutDate = data.ctimeEnd : "";
        data.guestFullName ? data2.guestFullName = data.guestFullName : "";
        data.code? data2.outCode = data.code : "";
        data.serviceId ? data2.serviceId = data.serviceId : "";
        data.partCode ? data2.partCode = data.partCode : "";
        data.partBrand ? data2.partBrand = data.partBrand : "";
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.orderman ? data2.orderManId = data.orderman : "";
      }
      this.$refs.tabTwo.body = data2
      this.$refs.tabTwo.getList();
    },
    search3(data) {
      let data2 = {};
      if(data.isPanne) {
        // 基本查询
        delete data.isPanne;
        data2 = data;
      } else {
        data.orgid?data2.orgid=data.orgid:"";
        data.ctimeStart ? data2.auditStartDate = data.ctimeStart : "";
        data.ctimeEnd ? data2.auditEndDate = data.ctimeEnd : "";
        data.guestFullName ? data2.guestFullName = data.guestFullName : "";
        data.code? data2.outCode = data.code : "";
        data.serviceId ? data2.serviceId = data.serviceId : "";
        data.partCode ? data2.partCode = data.partCode : "";
        data.partBrand ? data2.partBrand = data.partBrand : "";
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.orderman ? data2.orderManId = data.orderman : "";
      }
      this.$refs.tabThree.body = data2
      this.$refs.tabThree.getList();
    },
    async exportxls(refname) {
      let filename = "";
      switch(refname) {
        case "tabOne":
          filename = "销售订单明细表";
          break;
        case "tabTwo":
          filename = "销售出库明细表";
          break;
        case "tabThree":
          filename = "销售退货明细表";
          break;
        default:
          filename = "";
          break;
      }
      let table = await this.$refs[refname].getAll();
      this.$refs[refname].$refs.xTable.exportData({
        filename,
        isHeader: true,
        isFooter: true,
        data: table,
      })
    },
  }
};
</script>
