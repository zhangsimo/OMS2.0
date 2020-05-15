<template>
  <div class="content-oper" style="background: #fff">
    <Tabs style="min-height: 500px">
      <TabPane label="销售订单明细表">
        <panne :type="1" @search="search1" @export="exportxls('tabOne')" />
        <tabOne ref="tabOne" />
      </TabPane>
      <TabPane label="销售出库明细表">
        <panne :type="2" @search="search2" @export="exportxls('tabOne')" />
        <tabTwo ref="tabTwo" />
      </TabPane>
      <TabPane label="销售退货明细表">
        <panne :type="3" @search="search3" @export="exportxls('tabOne')" />
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
  name: "reporIndex",
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
        data.ctimeStart ? data2.startTime = data.ctimeStart : "";
        data.ctimeEnd ? data2.endTime = data.ctimeEnd : "";
        data.atimeStart ? data2.auditStartTime = data.atimeStart : "";
        data.atimeEnd ? data2.auditEndTime = data.atimeEnd : "";
        data.guestId ? data2.guestId = data.guestId : "";
        data.serviceId ? data2.serviceId = data.serviceId : "";
        data.code ? data2.code = data.code : "";
        if(data.partCode) {
          if(/[\u4e00-\u9fa5]/.test(data.partCode)) {
            data2.partName = data.partCode;
          } else {
            data2.partCode = data.partCode;
          }
        }
        data.partBrand ? data2.partBrandCode = data.partBrand : "";
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.orderman ? data2.orderManId = data.orderman : "";
        data.auditor ? data2.auditorId = data.auditor : "";
        data.createUname ? data2.createUname = data.createUname : "";
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
        data.ctimeStart ? data2.startOutDate = data.ctimeStart : "";
        data.ctimeEnd ? data2.endOutDate = data.ctimeEnd : "";
        data.guestId ? data2.guestId = data.guestId : "";
        data.serviceId ? data2.outCode = data.serviceId : "";
        data.code ? data2.serviceId = data.code : "";
        if(data.partCode) {
          if(/[\u4e00-\u9fa5]/.test(data.partCode)) {
            data2.partName = data.partCode;
          } else {
            data2.partCode = data.partCode;
          }
        }
        data.partBrand ? data2.partBrand = data.partBrand : "";
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.orderman ? data2.orderManId = data.orderman : "";
      }
      this.$refs.tabTwo.getList(data2);
    },
    search3(data) {
      let data2 = {};
      if(data.isPanne) {
        // 基本查询
        delete data.isPanne;
        data2 = data;
      } else {
        data.ctimeStart ? data2.auditStartDate = data.ctimeStart : "";
        data.ctimeEnd ? data2.auditEndDate = data.ctimeEnd : "";
        data.guestId ? data2.guestId = data.guestId : "";
        data.serviceId ? data2.outCode = data.serviceId : "";
        data.code ? data2.serviceId = data.code : "";
        if(data.partCode) {
          if(/[\u4e00-\u9fa5]/.test(data.partCode)) {
            data2.partName = data.partCode;
          } else {
            data2.partCode = data.partCode;
          }
        }
        data.partBrand ? data2.partBrand = data.partBrand : "";
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.orderman ? data2.orderManId = data.orderman : "";
      }
      this.$refs.tabThree.getList(data2);
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
