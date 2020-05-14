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
      <TabPane label="采购计划明细表">
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
  name: "reporIndex",
  components: { panne, tabOne, tabTwo, tabThree, tabFour },
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
        // 更多查询
        data.createDate ? data2.enterTime = data.createDate : "";
        data.auditDate ? data2.auditDate = data.auditDate : "";
        data.guestId ? data2.guestFullName = data.guestId : "";
        data.serviceId ? data2.serviceId = data.serviceId : "";
        data.code ? data2.code = data.code : "";
        if(data.partCode) {
          if(/[\u4e00-\u9fa5]/.test(data.partCode)) {
            data2.partName = data.partCode;
          } else {
            data2.partCode = data.partCode;
          }
        }
        data.partBrand ? data2.partBrand = data.partBrand : "";
        data.orderType ? data2.orderType = data.orderType : "";
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.orderman ? data2.orderManId = data.orderman : "";
        data.auditor ? data2.auditorId = data.auditor : "";
        data.createUname ? data2.createUid = data.createUname : "";
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
        data.createDate ? data2.createTime = data.createDate : "";
        data.guestId ? data2.guestFullName = data.guestId : "";
        data.serviceId ? data2.serviceId = data.serviceId : "";
        data.code ? data2.pchsServiceId = data.code : "";
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
        // 更多查询
        data.createDate ? data2.outDate = data.createDate : "";
        data.guestId ? data2.guestFullName = data.guestId : "";
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
    search4(data) {
      let data2 = {};
      if(data.isPanne) {
        // 基本查询
        delete data.isPanne;
        data2 = data;
      } else {
        // 更多查询
        data.createDate ? data2.orderDate = data.createDate : "";
        data.auditDate ? data2.auditEndDate = data.auditDate : "";
        data.guestId ? data2.guestFullName = data.guestId : "";
        data.serviceId ? data2.serviceId = data.serviceId : "";
        data.code ? data2.directCompanyId = data.code : "";
        if(data.partCode) {
          if(/[\u4e00-\u9fa5]/.test(data.partCode)) {
            data2.partName = data.partCode;
          } else {
            data2.partCode = data.partCode;
          }
        }
        data.partBrand ? data2.partBrand = data.partBrand : "";
        data.orderman ? data2.orderManId = data.orderman : "";
        data.auditor ? data2.auditorId = data.auditor : "";
        data.createUname ? data2.createUid = data.createUname : "";
      }
      this.$refs.tabFour.getList(data2);
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
