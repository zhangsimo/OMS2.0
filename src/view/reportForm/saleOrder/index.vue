<template>
  <div class="content-oper" style="background: #fff">
    <Tabs style="min-height: 500px">
      <TabPane label="销售订单明细表">
        <panne :type="1" ref="panne1" @search="search1" @export="exportxls('tabOne')" />
        <tabOne ref="tabOne" />
      </TabPane>
      <TabPane label="销售出库明细表">
        <panne :type="2" ref="panne2" @search="search2" @export="exportxls('tabTwo')" />
        <tabTwo ref="tabTwo" />
      </TabPane>
      <TabPane label="销售退货明细表">
        <panne :type="3" ref="panne3" @search="search3" @export="exportxls('tabThree')" />
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
import moment from "moment";

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
      this.$refs.tabTwo.getAllMoney();
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
      this.$refs.tabThree.getAllMoney();
      this.$refs.tabThree.getList();
    },
    async exportxls(refname) {
      let filename = "";
      // this.$Modal.warning({
      //   title:"通知",
      //   content:"此业务请联系IT服务台导出报表数据"
      // })
      switch(refname) {
        case "tabOne":
          // filename = "销售订单明细表";
          let str = ""
          let search1=Object.assign({},this.$refs.panne1.search)
          search1.orgid==0?search1.orgid="":search1.orgid;
          search1.auditStartTime=search1.auditDate?moment(search1.auditDate[0]).format("YYYY-MM-DD")+" 00:00:00":""
          search1.auditEndTime=search1.auditDate?moment(search1.auditDate[1]).format("YYYY-MM-DD")+" 23:59:59":""
          search1.pageSize=1000000
          search1.page=0
          delete search1.auditDate
          delete search1.isPanne
          for(var i in search1){
            if(search1[i]!=undefined){
              str+=`${i}=${search1[i]}&`
            }
          }
          let paymentDetailUrl = api.omsOrder_h +
            `/sellOrderMain/export/PjSellOrderMainDetail?${str.slice(0,str.length-1)}&access_token=` +
            Cookies.get(TOKEN_KEY);
          location.href = paymentDetailUrl
          break;
        case "tabTwo":
          // filename = "销售出库明细表";
          let str2 = ""
          let search2=Object.assign({},this.$refs.panne2.search)
          search2.orgid==0?search2.orgid="":search2.orgid;
          search2.startOutDate=search2.auditDate?moment(search2.auditDate[0]).format("YYYY-MM-DD")+" 00:00:00":""
          search2.endOutDate=search2.auditDate?moment(search2.auditDate[1]).format("YYYY-MM-DD")+" 23:59:59":""
          search2.pageSize=1000000
          search2.page=0
          delete search2.auditDate
          delete search2.isPanne
          for(var i in search2){
            if(search2[i]!=undefined){
              str2+=`${i}=${search2[i]}&`
            }
          }
          let paymentDetailUrl2 = api.omsOrder_h +
            `/sellOutMain/export/PjSellOutMainDetails?${str2.slice(0,str2.length-1)}&access_token=` +
            Cookies.get(TOKEN_KEY);
          location.href = paymentDetailUrl2
          break;
        case "tabThree":
          let str3 = ""
          let search3=Object.assign({},this.$refs.panne3.search)
          search3.orgid==0?search3.orgid="":search3.orgid;
          search3.auditStartDate=search3.auditDate?moment(search3.auditDate[0]).format("YYYY-MM-DD")+" 00:00:00":""
          search3.auditEndDate=search3.auditDate?moment(search3.auditDate[1]).format("YYYY-MM-DD")+" 23:59:59":""
          search3.pageSize=1000000
          search3.page=0
          delete search3.auditDate
          delete search3.isPanne
          for(var i in search3){
            if(search3[i]!=undefined){
              str3+=`${i}=${search3[i]}&`
            }
          }
          let paymentDetailUrl3 = api.omsOrder_h +
            `/pchsOrderMain/export/PjSellEnterMainDetails?${str3.slice(0,str3.length-1)}&access_token=` +
            Cookies.get(TOKEN_KEY);
          location.href = paymentDetailUrl3
          // filename = "销售退货明细表";
          break;
        default:
          // filename = "";
          break;
      }
    },
  }
};
</script>
