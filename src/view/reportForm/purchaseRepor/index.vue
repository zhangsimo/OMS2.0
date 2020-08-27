<template>
  <div class="content-oper" style="background: #fff">
    <Tabs style="min-height: 500px">
      <TabPane label="采购订单明细表">
        <panne :type="1" @search="search1" @export="exportxls('tabOne')" />
        <tabOne ref="tabOne" />
      </TabPane>
      <TabPane label="采购入库明细表">
        <panne :type="2" @search="search2" @export="exportxls('tabTwo')" />
        <tabTwo ref="tabTwo" />
      </TabPane>
      <TabPane label="采购退货明细表">
        <panne :type="3" @search="search3" @export="exportxls('tabThree')" />
        <tabThree ref="tabThree" />
      </TabPane>
      <TabPane label="滚动计划明细表">
        <panne :type="4" @search="search4" @export="exportxls('tabFour')" />
        <tabFour ref="tabFour" />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import * as api from "_api/reportForm/index.js";
import panne from "./components/panne";
import tabOne from "./components/tabOne";
import tabTwo from "./components/tabTwo";
import tabThree from "./components/tabThree";
import tabFour from "./components/tabFour";
export default {
  name: "reportFormProcurement",
  components: { panne, tabOne, tabTwo, tabThree, tabFour },
  data() {
    return {};
  },
  async mounted() {},
  methods: {
    search1(data) {
      let data2 = {};
      if(data.isPanne) {
        // 基本查询
        delete data.isPanne;
        data2 = data;
      } else {
        // 更多查询
        data.orgid?data2.orgid=data.orgid:"";
        data.ctimeStart ? data2.startTime = data.ctimeStart : "";
        data.ctimeEnd ? data2.endTime = data.ctimeEnd : "";
        data.atimeStart ? data2.auditStartDate = data.atimeStart : "";
        data.atimeEnd ? data2.auditEndDate = data.atimeEnd : "";
        data.guestFullName ? data2.guestFullName = data.guestFullName : "";
        data.serviceId ? data2.serviceId = data.serviceId : "";
        data.code ? data2.code = data.code : "";
        data.partCode ? data2.partCode = data.partCode : "";
        data.partBrand ? data2.partBrand = data.partBrand :"";
        data.orderType ? data2.orderType = data.orderType : "";
        data.warehouseId ? data2.directCompanyId = data.warehouseId : "";
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
        data.ctimeStart ? data2.startEnterDate = data.ctimeStart : "";
        data.ctimeEnd ? data2.endEnterDate = data.ctimeEnd : "";
        data.guestFullName ? data2.guestFullName = data.guestFullName : "";
        data.serviceId ? data2.serviceId = data.serviceId : "";
        data.code ? data2.code = data.code : "";
        data.partCode ? data2.partCode = data.partCode : "";
        data.partBrand ? data2.partBrand = data.partBrand : "";
        data.warehouseId ? data2.directCompanyId = data.warehouseId : "";
        data.orderman ? data2.orderManId = data.orderman : "";
      }
      this.$refs.tabTwo.body = data2;
      this.$refs.tabTwo.getList();
    },
    search3(data) {
      let data2 = {};
      if(data.isPanne) {
        // 基本查询
        delete data.isPanne;
        data2 = data;
      } else {
        // 更多查询
        data.orgid?data2.orgid=data.orgid:"";
        data.ctimeStart ? data2.startOutDate = data.ctimeStart : "";
        data.ctimeEnd ? data2.endOutDate = data.ctimeEnd : "";
        data.guestFullName ? data2.guestFullName = data.guestFullName : "";
        data.serviceId ? data2.outCode = data.serviceId : "";
        data.code ? data2.serviceId = data.code : "";
        data.partCode ? data2.partCode = data.partCode : "";
        data.partBrand ? data2.partBrand = data.partBrand : "";
        data.warehouseId ? data2.directCompanyId = data.warehouseId : "";
        data.orderman ? data2.orderManId = data.orderman : "";
      }
      this.$refs.tabThree.body = data2;
      this.$refs.tabThree.getList();
    },
    search4(data) {
      let data2 = {};
      if(data.isPanne) {
        // 基本查询
        delete data.isPanne;
        data2 = data;
      } else {
        // 更多查询
        data.orgid?data2.orgid=data.orgid:"";
        data.ctimeStart ? data2.startTime = data.ctimeStart : "";
        data.ctimeEnd ? data2.endTime = data.ctimeEnd : "";
        data.atimeStart ? data2.auditStartDate = data.atimeStart : "";
        data.atimeEnd ? data2.auditEndDate = data.atimeEnd : "";
        data.guestFullName ? data2.guestFullName = data.guestFullName : "";
        data.serviceId ? data2.serviceId = data.serviceId : "";
        data.code ? data2.directCompanyId = data.code : "";
        data.partCode ? data2.partCode = data.partCode : "";
        data.partBrand ? data2.partBrand = data.partBrand : "";
        data.orderman ? data2.orderManId = data.orderman : "";
        data.auditor ? data2.auditorId = data.auditor : "";
        data.createUname ? data2.createUid = data.createUname : "";
        data.directCompanyId ? data2.directCompanyId = data.directCompanyId : "";
      }
      this.$refs.tabFour.body = data2;
      this.$refs.tabFour.getList();
    },
    async exportxls(refname) {
      let filename = "";
      switch(refname) {
        case "tabOne":
          filename = "采购订单明细表";
          break;
        case "tabTwo":
          filename = "采购入库明细表";
          break;
        case "tabThree":
          filename = "采购退货明细表";
          break;
        case "tabFour":
          filename = "滚动计划明细表";
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

