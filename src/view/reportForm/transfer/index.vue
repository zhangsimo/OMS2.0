<template>
  <div class="content-oper" style="background: #fff">
    <Tabs style="min-height: 500px">
      <TabPane label="调拨入库明细表">
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
  name: "procurementTransfer",
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
        data.orgid?data2.orgid=data.orgid:"";
        data.ctimeStart ? data2.createTimeStart = data.ctimeStart : "";
        data.ctimeEnd ? data2.createTimeEnd = data.ctimeEnd : "";
        data.timeEnd ? data2.allotEnterTimeEnd = data.timeEnd : "";
        data.timeStart ? data2.allotEnterTimeStart = data.timeStart : "";
        data.guestId ? data2.guestId = data.guestId : "";
        data.inCode ? data2.serviceId = data.inCode  : "";//入库单号
        data.code ? data2.code = data.code : "";  //受理单号
        data.serviceId ? data2.acceptCode=data.serviceId:"" //申请单号
        data.partCode ? data2.partCode = data.partCode : "";
        data.partBrand ? data2.partBrand = data.partBrand : "";
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.orderman ? data2.commitUid = data.orderman : "";
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
        data.createTimeStart ? data2.allotFinishedStartDate = data.createTimeStart : "";
        data.createTimeEnd ? data2.allotFinishedEndDate = data.createTimeEnd : "";
      } else {
        data.orgid?data2.orgid=data.orgid:"";
        data.timeEnd ? data2.allotFinishedEndDate = data.timeEnd : "";
        data.timeStart ? data2.allotFinishedStartDate = data.timeStart : "";
        data.guestId ? data2.guestId = data.guestId : "";
        data.serviceId ? data2.acceptCode = data.serviceId : "";
        data.code ? data2.code = data.code : "";
        data.outCode ? data2.serviceId = data.outCode : "";
        data.partCode ? data2.partCode = data.partCode : "";
        data.partBrand ? data2.partBrand = data.partBrand : "";
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.orderman ? data2.commitUid = data.orderman : "";
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
        data.createTimeStart ? data2.allotFinishedStartDate = data.createTimeStart : "";
        data.createTimeEnd ? data2.allotFinishedEndDate = data.createTimeEnd : "";
      } else {
        data.orgid?data2.orgid=data.orgid:"";
        data.timeEnd ? data2.allotFinishedEndDate = data.timeEnd : "";
        data.timeStart ? data2.allotFinishedStartDate = data.timeStart : "";
        data.guestId ? data2.guestId = data.guestId : "";
        data.serviceId ? data2.acceptCode = data.serviceId : "";
        data.outCode ? data2.code = data.outCode : "";
        data. code ? data2.serviceId = data.code : "";
        data.partCode ? data2.partCode = data.partCode : "";
        data.partBrand ? data2.partBrand = data.partBrand : "";
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.orderman ? data2.commitUid = data.orderman : "";
      }
      this.$refs.tabThree.body = data2
      this.$refs.tabThree.getList();
    },
    search4(data) {
      let data2 = {};
      if(data.isPanne) {
        // 基本查询
        delete data.isPanne;
        data2 = data;
        data.createTimeStart ? data2.allotEnterTimeStart = data.createTimeStart : "";
        data.createTimeEnd ? data2.allotEnterTimeEnd = data.createTimeEnd : "";
      } else {
        data.orgid?data2.orgid=data.orgid:"";
        data.timeEnd ? data2.allotEnterTimeEnd = data.timeEnd : "";
        data.timeStart ? data2.allotEnterTimeStart = data.timeStart : "";
        data.guestId ? data2.guestId = data.guestId : "";
        data.serviceId ? data2.acceptCode = data.serviceId : "";
        data.code ? data2.code = data.code : "";
        data.outCode ? data2.serviceId = data.outCode : "";
        data.partCode ? data2.partCode = data.partCode : "";
        data.partBrand ? data2.partBrand = data.partBrand : [];
        data.warehouseId ? data2.storeId = data.warehouseId : "";
        data.orderman ? data2.commitUid = data.orderman : "";
      }
      this.$refs.tabFour.body = data2
      this.$refs.tabFour.getList();
    },
    async exportxls(refname) {
      let filename = "";
      switch(refname) {
        case "tabOne":
          filename = "调拨入库单明细表";
          break;
        case "tabTwo":
          filename = "调拨出库明细表";
          break;
        case "tabThree":
          filename = "调入退回明细表";
          break;
        case "tabFour":
          filename = "调出退回明细表";
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
