<template>
  <div class="titler">
    <table class="gridtable">
      <thead>
        <tr>
          <th
            colspan="7"
            style="
              line-height: 18px;
              text-align: left;
              font-size: 18px;
              line-height: 18px;
              font-weight: 600;
            "
          >
            {{ onelist.orgName }}
          </th>
          <th colspan="5" style="text-align: left">
            <p style="font-size: 15px; font-weight: 600; padding: 0">
              {{ onelist.name }}:
            </p>
            <p
              style="
                font-size: 12px;
                font-weight: 400;
                padding: 0;
                margin-top: -10px;
              "
            >
              No: {{ onelist.serviceId }}
            </p>
          </th>
        </tr>
        <tr style="padding-top: 0px; margin-top: 0px">
          <th colspan="7" style="font-weight: 400; text-align: left">
            <div>
              <span style="font-size: 12px"
                >地址: {{ onelist.orgAddress }}</span
              >
            </div>
            <div>
              <span style="font-size: 12px">电话: {{ onelist.orgTel }}</span>
            </div>
          </th>
          <th colspan="5" style="font-weight: 400; text-align: left">
            <div>
              <span style="font-size: 12px">订单日期:</span
              ><span style="font-size: 12px">{{ onelist.orderDate }}</span>
            </div>
            <div>
              <span style="font-size: 12px">打印日期:</span>
              <span style="font-size: 12px">{{ onelist.printDate }}</span>
            </div>
          </th>
        </tr>
        <tr style="border-top: 1px solid #000">
          <th
            colspan="5"
            style="
              line-height: 12px;
              font-weight: 400;
              text-align: left;
              border-top: 1px solid #000;
              border-right: 1px solid #000;
            "
          >
            <div>
              <span style="font-size: 12px">客户:</span>
              <span style="font-size: 12px">{{ onelist.guestName }}</span>
            </div>
            <div>
              <span style="font-size: 12px">地址:</span>
              <span style="font-size: 12px">{{ onelist.guestAddress }}</span>
            </div>
          </th>
          <th
            colspan="3"
            style="
              line-height: 12px;
              font-weight: 400;
              text-align: left;
              border-top: 1px solid #000;
              border-right: 1px solid #000;
            "
          >
            <div>
              <span style="font-size: 12px">联系人:</span>
              <span style="font-size: 12px">{{ onelist.guestContactor }}</span>
            </div>
            <div>
              <span style="font-size: 12px">手工单号：</span>
              <span style="font-size: 12px">{{ onelist.billTypeName }}</span>
            </div>
          </th>
          <th
            colspan="4"
            style="
              line-height: 12px;
              font-weight: 400;
              text-align: left;
              border-top: 1px solid #000;
            "
          >
            <div style="">
              <span style="font-size: 12px">联系电话:</span
              ><span style="font-size: 12px">{{ onelist.guestTel }}</span>
            </div>
          </th>
        </tr>
        <tr style="text-align: left; line-height: 12px">
          <th
            style="
              width: 5%;
              padding: 2px 0;
              font-size: 12px;
              font-weight: 400;
              border-top: 2px solid #000;
              text-align: left;
              border-right: 1px solid #000;
              border-bottom: 1px solid #000;
            "
          >
            序号
          </th>
          <th
            style="
              width: 15%;
              padding: 2px 0;
              font-size: 12px;
              font-weight: 400;
              border-top: 2px solid #000;
              borer-left: 2px solid #000;
              text-align: left;
              border-right: 1px solid #000;
              border-bottom: 1px solid #000;
            "
          >
            配件内码
          </th>
          <th
            style="
              width: 10%;
              padding: 2px 0;
              font-size: 12px;
              font-weight: 400;
              border-top: 2px solid #000;
              borer-left: 2px solid #000;
              text-align: left;
              border-right: 1px solid #000;
              border-bottom: 1px solid #000;
            "
          >
            配件编码
          </th>
          <th
            style="
              width: 12%;
              padding: 2px 0;
              font-size: 12px;
              font-weight: 400;
              border-top: 2px solid #000;
              borer-left: 2px solid #000;
              text-align: left;
              border-right: 1px solid #000;
              border-bottom: 1px solid #000;
            "
          >
            配件名称
          </th>
          <th
            style="
              width: 5%;
              padding: 2px 0;
              font-size: 12px;
              font-weight: 400;
              border-top: 2px solid #000;
              text-align: left;
              border-right: 1px solid #000;
              border-bottom: 1px solid #000;
            "
          >
            品牌
          </th>
          <th
            style="
              width: 7%;
              padding: 2px 0;
              font-size: 12px;
              font-weight: 400;
              border-top: 2px solid #000;
              text-align: left;
              border-right: 1px solid #000;
              border-bottom: 1px solid #000;
            "
          >
            品牌车型
          </th>
          <th
            style="
              width: 7%;
              padding: 2px 0;
              font-size: 12px;
              font-weight: 400;
              border-top: 2px solid #000;
              text-align: left;
              border-right: 1px solid #000;
              border-bottom: 1px solid #000;
            "
          >
            规格
          </th>
          <th
            style="
              width: 6%;
              padding: 2px 0;
              font-size: 12px;
              font-weight: 400;
              border-top: 2px solid #000;
              text-align: left;
              border-right: 1px solid #000;
              border-bottom: 1px solid #000;
            "
          >
            单位
          </th>
          <th
            style="
              width: 6%;
              padding: 2px 0;
              font-size: 12px;
              font-weight: 400;
              border-top: 2px solid #000;
              text-align: left;
              border-right: 1px solid #000;
              border-bottom: 1px solid #000;
            "
          >
            数量
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in onelist.detailList" :key="index">
          <td
            style="
              font-size: 12px;
              border-bottom: 1px solid #000;
              text-align: left;
              border-right: 1px solid #000;
              padding: 2px 0;
            "
          >
            {{ index + 1 }}
          </td>
          <td
            style="
              border-bottom: 1px solid #000;
              text-align: left;
              border-right: 1px solid #000;
              padding: 2px 0;
            "
          >
            <div
              style="
                font-size: 12px;
                overflow: hidden;
                word-break: break-all;
                line-height: 12px;
                height: 12px;
              "
            >
              {{ item.partCode }}
            </div>
          </td>
          <td
            style="
              border-bottom: 1px solid #000;
              text-align: left;
              border-right: 1px solid #000;
              padding: 2px 0;
            "
          >
            <div
              style="
                font-size: 12px;
                overflow: hidden;
                word-break: break-all;
                line-height: 12px;
                height: 12px;
              "
            >
              {{ item.partName }}
            </div>
          </td>
          <td
            style="
              border-bottom: 1px solid #000;
              text-align: left;
              border-right: 1px solid #000;
              padding: 2px 0;
            "
          >
            <div
              style="
                font-size: 12px;
                overflow: hidden;
                word-break: break-all;
                line-height: 12px;
                height: 12px;
              "
            >
              {{ item.oemCode }}
            </div>
          </td>
          <td
            style="
              border-bottom: 1px solid #000;
              text-align: left;
              border-right: 1px solid #000;
              padding: 2px 0;
            "
          >
            <div
              style="
                font-size: 12px;
                overflow: hidden;
                word-break: break-all;
                line-height: 12px;
                height: 12px;
              "
            >
              {{ item.partBrand }}
            </div>
          </td>
          <td
            style="
              border-bottom: 1px solid #000;
              text-align: left;
              border-right: 1px solid #000;
              padding: 2px 0;
            "
          >
            <div
              style="
                font-size: 12px;
                overflow: hidden;
                word-break: break-all;
                line-height: 12px;
                height: 12px;
              "
            >
              {{ item.carModelName }}
            </div>
          </td>
          <td
            style="
              border-bottom: 1px solid #000;
              text-align: left;
              border-right: 1px solid #000;
              padding: 2px 0;
            "
          >
            <div
              style="
                font-size: 12px;
                overflow: hidden;
                word-break: break-all;
                line-height: 12px;
                height: 12px;
              "
            >
              {{ item.spec }}
            </div>
          </td>
          <td
            style="
              border-bottom: 1px solid #000;
              text-align: left;
              border-right: 1px solid #000;
              padding: 2px 0;
            "
          >
            <div
              style="
                font-size: 12px;
                overflow: hidden;
                word-break: break-all;
                line-height: 12px;
                height: 12px;
              "
            >
              {{ item.unit }}
            </div>
          </td>
          <td
            style="
              border-bottom: 1px solid #000;
              text-align: left;
              border-right: 1px solid #000;
              padding: 2px 0;
            "
          >
            <div
              style="
                font-size: 12px;
                overflow: hidden;
                word-break: break-all;
                line-height: 12px;
                height: 12px;
              "
            >
              {{ item.orderQty }}
            </div>
          </td>
          <td
            style="
              border-bottom: 1px solid #000;
              text-align: left;
              border-right: 1px solid #000;
              padding: 2px 0;
            "
          >
            <div
              style="
                font-size: 12px;
                overflow: hidden;
                word-break: break-all;
                line-height: 12px;
                height: 12px;
              "
            >
              {{ parseFloat(item.orderPrice).toFixed(2) }}
            </div>
          </td>
          <td
            style="
              border-bottom: 1px solid #000;
              text-align: left;
              border-right: 1px solid #000;
              padding: 2px 0;
            "
          >
            <div
              style="
                font-size: 12px;
                overflow: hidden;
                word-break: break-all;
                line-height: 12px;
                height: 12px;
              "
            >
              {{ parseFloat(item.orderAmt).toFixed(2) }}
            </div>
          </td>
          <td
            style="
              border-bottom: 1px solid #000;
              text-align: left;
              padding: 2px 0;
            "
          >
            <!-- <div
              style="
                font-size: 12px;
                overflow: hidden;
                word-break: break-all;
                line-height: 12px;
                height: 12px;
              "
            >
              {{ item.storeShelf }}
            </div> -->
          </td>
        </tr>
        <tr style="font-size: 12px; line-height: 12px">
          <td
            colspan="8"
            style="
              padding: 0 2px;
              margin-top: 0;
              border-right: 1px #000000 solid;
            "
          >
            <span>合计:</span>
            <span>{{ onelist.orderAmt | toChies }}</span>
          </td>
          <td
            colspan="2"
            style="padding: 0 2px; border-right: 1px #000000 solid"
          >
            <span>总数: </span>
            <span>{{ onelist.orderQty }}</span>
          </td>
          <td colspan="2" style="padding: 0 2px">
            <span>合计: </span>
            <span>{{ onelist.orderAmt }}</span>
          </td>
        </tr>
        <tr style="font-size: 12px; line-height: 12px">
          <td
            colspan="3"
            style="
              padding: 2px;
              margin-top: 0;
              border: 1px #000000 solid;
              border: 1px #000000 solid;
              border-left: none;
            "
          >
            <span>制单人:</span>
            <span>{{ onelist.orderMan }}</span>
          </td>
          <td
            colspan="3"
            style="
              padding: 2px;
              margin-top: 0;
              border: 1px #000000 solid;
              border: 1px #000000 solid;
              border-left: none;
            "
          >
            <span>提交人:</span>
            <span>{{ onelist.auditor }}</span>
          </td>
          <td
            colspan="3"
            style="
              padding: 2px;
              margin-top: 0;
              border: 1px #000000 solid;
              border: 1px #000000 solid;
              border-left: none;
            "
          >
            <span>送货人:</span>
            <span>{{ onelist.deliverer }}</span>
          </td>
          <td
            colspan="3"
            style="
              padding: 2px;
              margin-top: 0;
              border: 1px #000000 solid;
              border-left: none;
              border-right: none;
            "
          >
            <span>收货人:</span>
            <span>{{ onelist.receiver }}</span>
          </td>
        </tr>
        <tr>
          <td
            colspan="12"
            style="border-bottom: 1px solid #000c17; padding: 0; margin: 0"
          >
            <span style="color: #000; font-size: 14px; font-weight: 600"
              >备注：{{ onelist.remark }}</span
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import * as tools from "@/utils/tools";
import {pointAdd} from "@/api/AlotManagement/transferringOrder"; //调拨申请
export default {
  data() {
    return {
        onelist:{
            detailList:[]
        }
    };
  },
  methods: {
    print() {
      let iframe = document.getElementById("print-iframe");
      if (!iframe) {
        let el = document.getElementById("printBox");
        iframe = document.createElement("IFRAME");
        let doc = null;
        iframe.setAttribute("id", "print-iframe");
        iframe.setAttribute(
          "style",
          "position:absolute;width:0px;height:0px;left:-500px;top:-500px;"
        );
        document.body.appendChild(iframe);
        doc = iframe.contentWindow.document;
        doc.write("<div>" + el.innerHTML + "</div>");
        doc.close();
        iframe.contentWindow.focus();
      }
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
      this.routeN = "";
    },
    //去除页眉页脚
    remove_ie_header_and_footer() {
      var hkey_path;
      hkey_path =
        "HKEY_CURRENT_USER\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
      try {
        var RegWsh = new ActiveXObject("WScript.Shell");
        RegWsh.RegWrite(hkey_path + "header", "");
        RegWsh.RegWrite(hkey_path + "footer", "");
      } catch (e) {}
    },
    //客户理赔登记打印
    async openModel(order) {
      if (order.id) {
        let data = {};
        data.id = order.id;
        let res = await pointAdd(data);
        console.log(res)
        if (res.code == 0) {
          this.onelist = res.data || {};
          this.onelist.name = order.name || "";
          setTimeout(() => {
            this.print();
          });
        }
      }
    },
  },
  created() {},
};
</script>

<style lang="less">
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}

#printBox {
  width: 730px;
  margin: 0 auto;
  overflow: hidden;
  overflow-y: scroll;

  .titler {
    width: 100%;
    padding-left: 2px;
  }
}

#printBox::-webkit-scrollbar {
  display: none;
}

#printBox {
  -ms-overflow-style: none;
}

#printBox::-webkit-scrollbar {
  width: 0 !important;
}

#printBox {
  overflow: -moz-scrollbars-none;
}

#printBox.ivu-modal-wrap.ivu-modal-content.ivu-modal-close {
  display: none !important;
  width: 0 !important;
  z-index: -1 !important;
}

//表格样式
table.gridtable {
  width: 100%;
  font-family: verdana, arial, sans-serif;
  font-size: 10px !important;
  table-layout: fixed; /*列宽由表格宽度和列宽度设定。*/
  color: #000000;
  border-width: 1px;
  border-color: #000000;
  text-align: left;
  border-collapse: collapse;
  /*page-break-before: always;*/
  /*bor*/
}

table.gridtable th {
  border-width: 1px;
  padding: 4px 2px;
  border-style: solid;
  border-color: #000000;
  background-color: #dedede;
}

table.gridtable td {
  border-width: 1px;
  padding: 4px 2px;
  border-style: solid;
  border-color: #000000;
  background-color: #ffffff;
}

table.gridtable tr {
  page-break-inside: avoid;
}

table.gridtable tr th {
  font-weight: 400 !important;
}
</style>