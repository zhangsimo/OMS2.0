<template>
  <div class="content-oper" style="background: #fff">
    <Tabs style="min-height: 500px">
      <TabPane label="调拨入库单明细表">
        <panne :type="1" @search="search1" @export="exportxls('tabOne')" />
        <tabOne ref="tabOne" />
      </TabPane>
      <TabPane label="调拨出库明细表">
        <panne :type="2" @search="search2" @export="exportxls('tabTwo')" />
        <tabTwo ref="tabTwo" />
      </TabPane>
      <TabPane label="调入退回明细表">
        <panne :type="3" @search="search3" @export="exportxls('tabThree')" />
        <tabThree ref="tabThree" />
      </TabPane>
      <TabPane label="调出退回明细表">
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
        data.ctimeStart ? data2.createTimeStart = data.ctimeStart : "";
        data.ctimeEnd ? data2.createTimeEnd = data.ctimeEnd : "";
        data.timeEnd ? data2.allotEnterTimeEnd = data.timeEnd : "";
        data.timeStart ? data2.allotEnterTimeStart = data.timeStart : "";
        data.guestId ? data2.guestId = data.guestId : "";
        data.serviceId ? data2.acceptCode = data.serviceId : "";
        data.code ? data2.code = data.code : "";
        if(data.partCode) {
          if(/[\u4e00-\u9fa5]/.test(data.partCode)) {
            data2.partName = data.partCode;
          } else {
            data2.partCode = data.partCode;
          }
        }
        data.partBrand ? data2.partBrand = data.partBrand : "";
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.orderman ? data2.commitUid = data.orderman : "";
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
        data.timeEnd ? data2.allotFinishedEndDate = data.timeEnd : "";
        data.timeStart ? data2.allotFinishedStartDate = data.timeStart : "";
        data.guestId ? data2.guestId = data.guestId : "";
        data.serviceId ? data2.acceptCode = data.serviceId : "";
        data.code ? data2.code = data.code : "";
        data.outCode ? data2.serviceId = data.outCode : "";
        if(data.partCode) {
          if(/[\u4e00-\u9fa5]/.test(data.partCode)) {
            data2.partName = data.partCode;
          } else {
            data2.partCode = data.partCode;
          }
        }
        data.partBrand ? data2.partBrand = data.partBrand : "";
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.orderman ? data2.commitUid = data.orderman : "";
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
        data.timeEnd ? data2.allotFinishedEndDate = data.timeEnd : "";
        data.timeStart ? data2.allotFinishedStartDate = data.timeStart : "";
        data.guestId ? data2.guestId = data.guestId : "";
        data.serviceId ? data2.acceptCode = data.serviceId : "";
        data.code ? data2.code = data.code : "";
        data.outCode ? data2.serviceId = data.outCode : "";
        if(data.partCode) {
          if(/[\u4e00-\u9fa5]/.test(data.partCode)) {
            data2.partName = data.partCode;
          } else {
            data2.partCode = data.partCode;
          }
        }
        data.partBrand ? data2.partBrand = data.partBrand : "";
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.orderman ? data2.commitUid = data.orderman : "";
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
        data.timeEnd ? data2.allotEnterTimeEnd = data.timeEnd : "";
        data.timeStart ? data2.allotEnterTimeStart = data.timeStart : "";
        data.guestId ? data2.guestId = data.guestId : "";
        data.serviceId ? data2.acceptCode = data.serviceId : "";
        data.code ? data2.code = data.code : "";
        data.outCode ? data2.serviceId = data.outCode : "";
        if(data.partCode) {
          if(/[\u4e00-\u9fa5]/.test(data.partCode)) {
            data2.partName = data.partCode;
          } else {
            data2.partCode = data.partCode;
          }
        }
        data.partBrand ? data2.partBrand = data.partBrand : "";
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.orderman ? data2.commitUid = data.orderman : "";
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
