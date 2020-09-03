<template>
  <div class="content-oper" style="background: #fff">
    <Tabs style="min-height: 500px">
      <TabPane label="销售订单明细表">
        <panne :type="1" ref="panne" @search="search1" @export="exportxls('tabOne')" />
        <tabOne ref="tabOne" />
      </TabPane>
      <TabPane label="销售出库明细表">
        <panne :type="2" ref="panne1" @search="search2" @export="exportxls('tabTwo')" />
        <tabTwo ref="tabTwo" />
      </TabPane>
      <TabPane label="销售退货明细表">
        <panne :type="3" ref="panne2" @search="search3" @export="exportxls('tabThree')" />
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

import Cookies from "js-cookie";
import {TOKEN_KEY} from "../../../libs/util";
import api from "_conf/url";
import {v4} from "uuid";

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
          // filename = "销售订单明细表";
          let str = ""
          this.$refs.panne.search.orgid==0?this.$refs.panne.search.orgid="":this.$refs.panne.search.orgid;
          for(var i in this.$refs.panne.search){
            str+=`${i}=${this.$refs.panne.search[i]}&`
          }
          let page={size:this.$refs.tabOne.page.total,num:0}
          for(var i in page){
            str+=`${i}=${page[i]}&`
          }
          let paymentDetailUrl = api.omsOrder +
            `/sellOrderMain/export/PjSellOrderMainDetail?${str.slice(0,str.length-1)}&access_token=` +
            Cookies.get(TOKEN_KEY);
          location.href = paymentDetailUrl
          break;
        case "tabTwo":
          // filename = "销售出库明细表";
          let str2 = ""
          this.$refs.panne1.search.orgid==0?this.$refs.panne1.search.orgid="":this.$refs.panne1.search.orgid;
          for(var i in this.$refs.panne1.search){
            str2+=`${i}=${this.$refs.panne1.search[i]}&`
          }
          let page2={size:this.$refs.tabTwo.page.total,num:0}
          for(var i in page2){
            str2+=`${i}=${page2[i]}&`
          }
          let paymentDetailUrl2 = api.omsOrder +
            `/sellOutMain/export/PjSellOutMainDetails?${str2.slice(0,str2.length-1)}&access_token=` +
            Cookies.get(TOKEN_KEY);
          location.href = paymentDetailUrl2
          break;
        case "tabThree":
          let str3 = ""
          this.$refs.panne2.search.orgid==0?this.$refs.panne2.search.orgid="":this.$refs.panne2.search.orgid;
          for(var i in this.$refs.panne2.search){
            str3+=`${i}=${this.$refs.panne2.search[i]}&`
          }
          let page3={size:this.$refs.tabThree.page.total,num:0}
          for(var i in page3){
            str3+=`${i}=${page3[i]}&`
          }
          let paymentDetailUrl3 = api.omsOrder +
            `/pchsOrderMain/export/PjSellEnterMainDetails?${str3.slice(0,str3.length-1)}&access_token=` +
            Cookies.get(TOKEN_KEY);
          location.href = paymentDetailUrl3
          // filename = "销售退货明细表";
          break;
        default:
          // filename = "";
          break;
      }
      // let table = await this.$refs[refname].getAll();
      // this.$refs[refname].$refs.xTable.exportData({
      //   filename,
      //   isHeader: true,
      //   isFooter: true,
      //   data: table,
      // })
    },
  }
};
</script>
