<template>
  <div id="printBoxBig">
    <div v-if="onelist.name=='null'" style="font-size:30px;color:#000c17;text-align:center;width:100%;">请稍等一会...</div>
    <div id="printBox" style="border: 1px solid #000c17;">
      <div class="titler" v-if="onelist.name.startsWith('销售订单')">
        <table class="gridtable">
          <thead>
          <tr>
            <th colspan="7"
                style="line-height: 18px;text-align: left;font-size: 18px;line-height: 18px;font-weight: 600">
              {{ onelist.userCompany }}
            </th>
            <th colspan="5" style="text-align: left;">
              <p style="font-size: 15px;font-weight: 600;padding:0">{{onelist.name}}:</p>
              <p style="font-size: 12px;font-weight:400;padding:0;margin-top:-10px;">No: {{onelist.serviceId}}</p>
            </th>
          </tr>
          <tr style="padding-top: 0px;margin-top: 0px;">
            <th colspan="7" style="font-weight: 400;text-align: left;">
              <div><span
                style="font-size: 12px;">地址: {{ onelist.addr }}</span></div>
              <div><span style="font-size: 12px;">电话: {{ onelist.tel }}</span></div>
            </th>
            <th colspan="5" style="font-weight: 400;text-align: left;">
              <div>
                <span style="font-size: 12px;">订单日期:</span><span
                style="font-size: 12px">{{ onelist.orderDate }}</span>
              </div>
              <div>
                <span style="font-size: 12px;">打印日期:</span>
                <span style="font-size: 12px;">{{ onelist.printDate }}</span>
              </div>
            </th>
          </tr>
          <tr style="border-top:1px solid #000;">
            <th colspan="5"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">客户:</span> <span
                style="font-size: 12px">{{ onelist.guestName }}</span>
              </div>
              <div>
                <span style="font-size: 12px">地址:</span> <span
                style="font-size: 12px">{{ onelist.guestAddr }}</span>
              </div>
            </th>
            <th colspan="3"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">联系人:</span> <span
                style="font-size: 12px">{{ onelist.contactor }}</span>
              </div>
              <div>
                <span style="font-size: 12px">票据类型:</span> <span
                style="font-size: 12px">{{ onelist.billTypeName }}</span>
              </div>
            </th>
            <th colspan="4" style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;">
              <div style="">
                <span style="font-size: 12px">联系电话:</span><span
                style="font-size: 12px">{{ onelist.contactorTel }}</span>
              </div>
              <div style="display: flex;">
                <div style="flex: 1">
                  <span style="font-size: 12px">结算方式:</span>
                  <span style="font-size: 12px">{{onelist.settleTypeName}}</span>
                </div>
                <div style="flex: 1">
                  <span style="font-size: 12px">仓库:</span>
                  <span style="font-size: 12px">{{onelist.storeName}}</span>
                </div>
              </div>
            </th>
          </tr>
          <tr style="text-align: left;line-height: 12px;">
            <th
              style="width:5%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              序号
            </th>
            <th
              style="width:13%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件编码
            </th>
            <th
              style="width:12%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件名称
            </th>
            <th
              style="width: 12%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              OEM码
            </th>
            <th
              style="width: 5%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              品牌
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              车型
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              规格
            </th>
            <th
              style="width: 4%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              单位
            </th>
            <th
              style="width: 5%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              数量
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              单价
            </th>
            <th
              style="width: 8%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              金额
            </th>
            <th
              style="width: 15%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-bottom:1px solid #000;">
              仓位
            </th>
          </tr>
          </thead>
          <tbody style="text-align: left;">
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td
              style="font-size: 12px; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              {{index + 1}}
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.oemCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partBrand}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.carModelName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.spec}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.unit}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.orderQty}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.orderPrice}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.orderAmt}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.storeShelf}}
              </div>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="8" style="padding: 0 2px;margin-top: 0;border-right: 1px #000000 solid;">
              <span>合计:</span>
              <span>{{ onelist.orderAmt | toChies }}</span>
            </td>
            <td colspan="2" style="padding: 0 2px;border-right: 1px #000000 solid;">
              <span>总数: </span>
              <span>{{ onelist.orderQty }}</span>
            </td>
            <td colspan="2" style="padding: 0 2px;">
              <span>合计: </span>
              <span>{{ onelist.orderAmt }}</span>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="3"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>制单人:</span>
              <span>{{ onelist.orderMan }}</span>
            </td>
            <td colspan="3"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>提交人:</span>
              <span>{{ onelist.auditor }}</span>
            </td>
            <td colspan="3"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>送货人:</span>
              <span>{{ onelist.deliverer }}</span>
            </td>
            <td colspan="3"
                style="padding: 2px;margin-top: 0;;border: 1px #000000 solid;border-left: none;border-right: none;">
              <span>收货人:</span>
              <span>{{ onelist.receiver }}</span>
            </td>
          </tr>
          <tr>
            <td colspan="12" style="border-bottom: 1px solid #000c17;padding: 0;margin: 0">
              <span style="color:#000;font-size: 14px;font-weight: 600;">备注：{{onelist.remark}}</span>
            </td>
          </tr>
          <tr>
            <td colspan="12" style="padding: 0;margin: 0">
              <span style="color:#000;font-size: 14px;">兹收到上列货物完整无缺，所有电器配件货物出门概不退货，灯，胶，玻璃等易碎货品必须当面检验清楚，事后概不负责！此单据一经客户或其代理人签名，将作为客户欠款凭证，特此声明！</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="titler" v-if="onelist.name.startsWith('销售退货')">
        <table class="gridtable">
          <thead>
          <tr>
            <th colspan="7"
                style="line-height: 18px;text-align: left;font-size: 18px;line-height: 18px;font-weight: 600">
              {{ onelist.orgName }}
            </th>
            <th colspan="5" style="text-align: left;">
              <p style="font-size: 15px;font-weight: 600;padding:0">{{onelist.name}}:</p>
              <p style="font-size: 12px;font-weight:400;padding:0;margin-top:-10px;">No: {{onelist.serviceId}}</p>
            </th>
          </tr>
          <tr style="padding-top: 0px;margin-top: 0px;">
            <th colspan="7" style="font-weight: 400;text-align: left;">
              <div><span
                style="font-size: 12px;">地址: {{ onelist.orgAddress }}</span></div>
              <div><span style="font-size: 12px;">电话: {{ onelist.orgTel }}</span></div>
            </th>
            <th colspan="5" style="font-weight: 400;text-align: left;">
              <div>
                <span style="font-size: 12px;">订单日期:</span><span
                style="font-size: 12px">{{ onelist.orderDate }}</span>
              </div>
              <div>
                <span style="font-size: 12px;">打印日期:</span>
                <span style="font-size: 12px;">{{ onelist.printDate }}</span>
              </div>
            </th>
          </tr>
          <tr style="border-top:1px solid #000;">
            <th colspan="5"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">客户:</span> <span
                style="font-size: 12px">{{ onelist.guestName }}</span>
              </div>
              <div>
                <span style="font-size: 12px">地址:</span> <span
                style="font-size: 12px">{{ onelist.guestAddress }}</span>
              </div>
            </th>
            <th colspan="3"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">联系人:</span> <span
                style="font-size: 12px">{{ onelist.guestContactor }}</span>
              </div>
              <div>
                <span style="font-size: 12px">票据类型:</span> <span
                style="font-size: 12px">{{ onelist.billTypeName }}</span>
              </div>
            </th>
            <th colspan="4" style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;">
              <div style="">
                <span style="font-size: 12px">联系电话:</span><span
                style="font-size: 12px">{{ onelist.guestTel }}</span>
              </div>
              <div style="display: flex;">
                <div style="flex: 1">
                  <span style="font-size: 12px">结算方式:</span>
                  <span style="font-size: 12px">{{onelist.settleTypeName}}</span>
                </div>
                <div style="flex: 1">
                  <span style="font-size: 12px">仓库:</span>
                  <span style="font-size: 12px">{{onelist.storeName}}</span>
                </div>
              </div>
            </th>
          </tr>
          <tr style="text-align: left;line-height: 12px;">
            <th
              style="width:5%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              序号
            </th>
            <th
              style="width:15%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件编码
            </th>
            <th
              style="width:10%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件名称
            </th>
            <th
              style="width: 12%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              OEM码
            </th>
            <th
              style="width: 5%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              品牌
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              车型
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              规格
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              单位
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              数量
            </th>
            <th
              style="width: 8%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              单价
            </th>
            <th
              style="width: 8%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              金额
            </th>
            <th
              style="width: 10%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-bottom:1px solid #000;">
              仓位
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td
              style="font-size: 12px; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              {{index + 1}}
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.oemCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partBrand}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.carModelName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.spec}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.unit}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.orderQty}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{parseFloat(item.orderPrice).toFixed(2)}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{parseFloat(item.orderAmt).toFixed(2)}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.storeShelf}}
              </div>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="8" style="padding: 0 2px;margin-top: 0;border-right: 1px #000000 solid;">
              <span>合计:</span>
              <span>{{ onelist.orderAmt | toChies }}</span>
            </td>
            <td colspan="2" style="padding: 0 2px;border-right: 1px #000000 solid;">
              <span>总数: </span>
              <span>{{ onelist.orderQty }}</span>
            </td>
            <td colspan="2" style="padding: 0 2px;">
              <span>合计: </span>
              <span>{{ onelist.orderAmt }}</span>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="3"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>制单人:</span>
              <span>{{ onelist.orderMan }}</span>
            </td>
            <td colspan="3"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>提交人:</span>
              <span>{{ onelist.auditor }}</span>
            </td>
            <td colspan="3"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>送货人:</span>
              <span>{{ onelist.deliverer }}</span>
            </td>
            <td colspan="3"
                style="padding: 2px;margin-top: 0;;border: 1px #000000 solid;border-left: none;border-right: none;">
              <span>收货人:</span>
              <span>{{ onelist.receiver }}</span>
            </td>
          </tr>
          <tr>
            <td colspan="12" style="border-bottom: 1px solid #000c17;padding: 0;margin: 0">
              <span style="color:#000;font-size: 14px;font-weight: 600;">备注：{{onelist.remark}}</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="titler" v-if="onelist.name.startsWith('采购订单')">
        <table class="gridtable">
          <thead>
          <tr>
            <th colspan="7"
                style="line-height: 18px;text-align: left;font-size: 18px;line-height: 18px;font-weight: 600">
              {{ onelist.orgName }}
            </th>
            <th colspan="5" style="text-align: left;">
              <p style="font-size: 15px;font-weight: 600;padding:0">{{onelist.name}}:</p>
              <p style="font-size: 12px;font-weight:400;padding:0;margin-top:-10px;">No: {{onelist.serviceId}}</p>
            </th>
          </tr>
          <tr style="padding-top: 0px;margin-top: 0px;">
            <th colspan="7" style="font-weight: 400;text-align: left;">
              <div><span
                style="font-size: 12px;">地址: {{ onelist.orgAddress }}</span></div>
              <div><span style="font-size: 12px;">电话: {{ onelist.orgTel }}</span></div>
            </th>
            <th colspan="5" style="font-weight: 400;text-align: left;">
              <div>
                <span style="font-size: 12px;">订单日期:</span><span
                style="font-size: 12px">{{ onelist.orderDate }}</span>
              </div>
              <div>
                <span style="font-size: 12px;">打印日期:</span>
                <span style="font-size: 12px;">{{ onelist.printDate }}</span>
              </div>
            </th>
          </tr>
          <tr style="border-top:1px solid #000;">
            <th colspan="5"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">供应商:</span> <span
                style="font-size: 12px">{{ onelist.guestName }}</span>
              </div>
              <div>
                <span style="font-size: 12px">地址:</span> <span
                style="font-size: 12px">{{ onelist.guestAddress }}</span>
              </div>
            </th>
            <th colspan="3"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">联系人:</span> <span
                style="font-size: 12px">{{ onelist.contactor }}</span>
              </div>
              <div>
                <span style="font-size: 12px">票据类型:</span> <span
                style="font-size: 12px">{{ onelist.billTypeName }}</span>
              </div>
            </th>
            <th colspan="4" style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;">
              <div style="">
                <span style="font-size: 12px">联系电话:</span><span
                style="font-size: 12px">{{ onelist.guestTel }}</span>
              </div>
              <div style="display: flex;">
                <div style="flex: 1">
                  <span style="font-size: 12px">结算方式:</span>
                  <span style="font-size: 12px">{{onelist.settleTypeName}}</span>
                </div>
                <div style="flex: 1">
                  <span style="font-size: 12px">仓库:</span>
                  <span style="font-size: 12px">{{onelist.storeName}}</span>
                </div>
              </div>
            </th>
          </tr>
          <tr style="text-align: left;line-height: 12px;">
            <th
              style="width:5%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              序号
            </th>
            <th
              style="width:15%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件编码
            </th>
            <th
              style="width:10%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件名称
            </th>
            <th
              style="width: 12%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              OEM码
            </th>
            <th
              style="width: 5%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              品牌
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              车型
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              规格
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              单位
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              数量
            </th>
            <th
              style="width: 8%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              单价
            </th>
            <th
              style="width: 8%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              金额
            </th>
            <th
              style="width: 10%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-bottom:1px solid #000;">
              仓位
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td
              style="font-size: 12px; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              {{index + 1}}
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.oemCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partBrand}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.carModelName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.spec}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.unit}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.orderQty}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.orderPrice}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.orderAmt}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.storeShelf}}
              </div>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="8" style="padding: 0 2px;margin-top: 0;border-right: 1px #000000 solid;">
              <span>合计:</span>
              <span>{{ onelist.totalAmt | toChies }}</span>
            </td>
            <td colspan="2" style="padding: 0 2px;border-right: 1px #000000 solid;">
              <span>总数: </span>
              <span>{{ onelist.orderQty }}</span>
            </td>
            <td colspan="2" style="padding: 0 2px;">
              <span>合计: </span>
              <span>{{ onelist.totalAmt }}</span>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="4"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>制单人:</span>
              <span>{{ onelist.orderMan }}</span>
            </td>
            <td colspan="4"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>送货人:</span>
              <span>{{ onelist.deliverer }}</span>
            </td>
            <td colspan="4"
                style="padding: 2px;margin-top: 0;;border: 1px #000000 solid;border-left: none;border-right: none;">
              <span>收货人:</span>
              <span>{{ onelist.receiver }}</span>
            </td>
          </tr>
          <tr>
            <td colspan="12" style="border-bottom: 1px solid #000c17;padding: 0;margin: 0">
              <span style="color:#000;font-size: 14px;font-weight: 600;">备注：{{onelist.remark}}</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="titler" v-if="onelist.name.startsWith('采购退货')">
        <table class="gridtable">
          <thead>
          <tr>
            <th colspan="7"
                style="line-height: 18px;text-align: left;font-size: 18px;line-height: 18px;font-weight: 600">
              {{ onelist.orgName }}
            </th>
            <th colspan="5" style="text-align: left;">
              <p style="font-size: 15px;font-weight: 600;padding:0">{{onelist.name}}:</p>
              <p style="font-size: 12px;font-weight:400;padding:0;margin-top:-10px;">No: {{onelist.serviceId}}</p>
            </th>
          </tr>
          <tr style="padding-top: 0px;margin-top: 0px;">
            <th colspan="7" style="font-weight: 400;text-align: left;">
              <div><span
                style="font-size: 12px;">地址: {{ onelist.orgAddress }}</span></div>
              <div><span style="font-size: 12px;">电话: {{ onelist.orgTel }}</span></div>
            </th>
            <th colspan="5" style="font-weight: 400;text-align: left;">
              <div>
                <span style="font-size: 12px;">订单日期:</span><span
                style="font-size: 12px">{{ onelist.orderDate }}</span>
              </div>
              <div>
                <span style="font-size: 12px;">打印日期:</span>
                <span style="font-size: 12px;">{{ onelist.printDate }}</span>
              </div>
            </th>
          </tr>
          <tr style="border-top:1px solid #000;">
            <th colspan="5"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">供应商:</span> <span
                style="font-size: 12px">{{ onelist.guestName }}</span>
              </div>
              <div>
                <span style="font-size: 12px">地址:</span> <span
                style="font-size: 12px">{{ onelist.guestAddress }}</span>
              </div>
            </th>
            <th colspan="3"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">联系人:</span> <span
                style="font-size: 12px">{{ onelist.contactor }}</span>
              </div>
              <div>
                <span style="font-size: 12px">退货原因:</span> <span
                style="font-size: 12px">{{ onelist.rtnReasonName }}</span>
              </div>
            </th>
            <th colspan="4" style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;">
              <div style="">
                <span style="font-size: 12px">联系电话:</span><span
                style="font-size: 12px">{{ onelist.guestTel }}</span>
              </div>
              <div style="display: flex;">
                <div style="flex: 1">
                  <span style="font-size: 12px">结算方式:</span>
                  <span style="font-size: 12px">{{onelist.settleTypeName}}</span>
                </div>
                <div style="flex: 1">
                  <span style="font-size: 12px">仓库:</span>
                  <span style="font-size: 12px">{{onelist.storeName}}</span>
                </div>
              </div>
            </th>
          </tr>
          <tr style="text-align: left;line-height: 12px;">
            <th
              style="width:5%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              序号
            </th>
            <th
              style="width:15%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件编码
            </th>
            <th
              style="width:10%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件名称
            </th>
            <th
              style="width: 12%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              OEM码
            </th>
            <th
              style="width: 5%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              品牌
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              车型
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              规格
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              单位
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              数量
            </th>
            <th
              style="width: 8%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              单价
            </th>
            <th
              style="width: 8%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              金额
            </th>
            <th
              style="width: 10%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-bottom:1px solid #000;">
              仓位
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td
              style="font-size: 12px; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              {{index + 1}}
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.oemCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partBrand}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.carModelName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.spec}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.unit}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.orderQty || item.acceptQty || item.trueQty||item.applyQty}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.orderPrice}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.orderAmt}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.storeShelf}}
              </div>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="8" style="padding: 0 2px;margin-top: 0;border-right: 1px #000000 solid;">
              <span>合计:</span>
              <span>{{ onelist.totalAmt | toChies }}</span>
            </td>
            <td colspan="2" style="padding: 0 2px;border-right: 1px #000000 solid;">
              <span>总数: </span>
              <span>{{ onelist.orderQty }}</span>
            </td>
            <td colspan="2" style="padding: 0 2px;">
              <span>合计: </span>
              <span>{{ onelist.totalAmt }}</span>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="4"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>制单人:</span>
              <span>{{ onelist.orderMan }}</span>
            </td>
            <td colspan="4"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>送货人:</span>
              <span>{{ onelist.deliverer }}</span>
            </td>
            <td colspan="4"
                style="padding: 2px;margin-top: 0;;border: 1px #000000 solid;border-left: none;border-right: none;">
              <span>收货人:</span>
              <span>{{ onelist.receiver }}</span>
            </td>
          </tr>
          <tr>
            <td colspan="12" style="border-bottom: 1px solid #000c17;padding: 0;margin: 0">
              <span style="color:#000;font-size: 14px;font-weight: 600;">备注：{{onelist.remark}}</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="titler" v-if="onelist.name.startsWith('预售单')">
        <table class="gridtable">
          <thead>
          <tr>
            <th colspan="7"
                style="line-height: 18px;text-align: left;font-size: 18px;line-height: 18px;font-weight: 600">
              {{ onelist.userCompany }}
            </th>
            <th colspan="5" style="text-align: left;">
              <p style="font-size: 15px;font-weight: 600;padding:0">{{onelist.name}}:</p>
              <p style="font-size: 12px;font-weight:400;padding:0;margin-top:-10px;">No: {{onelist.serviceId}}</p>
            </th>
          </tr>
          <tr style="padding-top: 0px;margin-top: 0px;">
            <th colspan="7" style="font-weight: 400;text-align: left;">
              <div><span
                style="font-size: 12px;">地址: {{ onelist.addr }}</span></div>
              <div><span style="font-size: 12px;">电话: {{ onelist.tel }}</span></div>
            </th>
            <th colspan="5" style="font-weight: 400;text-align: left;">
              <div>
                <span style="font-size: 12px;">订单日期:</span><span
                style="font-size: 12px">{{ onelist.orderDate }}</span>
              </div>
              <div>
                <span style="font-size: 12px;">打印日期:</span>
                <span style="font-size: 12px;">{{ onelist.printDate }}</span>
              </div>
            </th>
          </tr>
          <tr style="border-top:1px solid #000;">
            <th colspan="5"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">客户:</span> <span
                style="font-size: 12px">{{ onelist.guestName }}</span>
              </div>
              <div>
                <span style="font-size: 12px">地址:</span> <span
                style="font-size: 12px">{{ onelist.guestAddr }}</span>
              </div>
            </th>
            <th colspan="3"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">联系人:</span> <span
                style="font-size: 12px">{{ onelist.contactor }}</span>
              </div>
              <div>
                <span style="font-size: 12px">票据类型:</span> <span
                style="font-size: 12px">{{ onelist.billType }}</span>
              </div>
            </th>
            <th colspan="4" style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;">
              <div style="">
                <span style="font-size: 12px">联系电话:</span><span
                style="font-size: 12px">{{ onelist.contactorTel }}</span>
              </div>
              <div style="display: flex;">
                <div style="flex: 1">
                  <span style="font-size: 12px">结算方式:</span>
                  <span style="font-size: 12px">{{onelist.settleType}}</span>
                </div>
                <div style="flex: 1">
                  <span style="font-size: 12px">仓库:</span>
                  <span style="font-size: 12px">{{onelist.storeName}}</span>
                </div>
              </div>
            </th>
          </tr>
          <tr style="border-top:1px solid #000;">
            <th colspan="4"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <span style="font-size: 12px">仓库:{{onelist.storeName}}</span>
            </th>
            <th colspan="4"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <span style="font-size: 12px">预计发货日期:{{onelist.planSendDate}}</span>
            </th>
            <th colspan="4" style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;">
              <span style="font-size: 12px">预计到货日期:{{onelist.planArriveDate}}</span>
            </th>
          </tr>
          <tr style="text-align: left;line-height: 12px;">
            <th
              style="width:5%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              序号
            </th>
            <th
              style="width:15%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件编码
            </th>
            <th
              style="width:10%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件名称
            </th>
            <th
              style="width: 12%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              OEM码
            </th>
            <th
              style="width: 5%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              品牌
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              车型
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              规格
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              单位
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              数量
            </th>
            <th
              style="width: 8%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              单价
            </th>
            <th
              style="width: 8%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              金额
            </th>
            <th
              style="width: 10%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-bottom:1px solid #000;">
              仓位
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td
              style="font-size: 12px; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              {{index + 1}}
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.oemCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partBrand}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.carModelName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.spec}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.unit}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.orderQty}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.orderPrice}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.orderAmt}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.storeShelf}}
              </div>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="8" style="padding: 0 2px;margin-top: 0;border-right: 1px #000000 solid;">
              <span>合计:</span>
              <span>{{ onelist.orderAmt | toChies }}</span>
            </td>
            <td colspan="2" style="padding: 0 2px;border-right: 1px #000000 solid;">
              <span>总数: </span>
              <span>{{ onelist.orderQty }}</span>
            </td>
            <td colspan="2" style="padding: 0 2px;">
              <span>合计: </span>
              <span>{{parseFloat(onelist.orderAmt).toFixed(2)}}</span>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="3"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>制单人:</span>
              <span>{{ onelist.createUname }}</span>
            </td>
            <td colspan="3"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>提交人:</span>
              <span>{{ onelist.auditor }}</span>
            </td>
            <td colspan="3"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>送货人:</span>
              <span>{{ onelist.deliverer }}</span>
            </td>
            <td colspan="3"
                style="padding: 2px;margin-top: 0;;border: 1px #000000 solid;border-left: none;border-right: none;">
              <span>收货人:</span>
              <span>{{ onelist.receiver }}</span>
            </td>
          </tr>
          <tr>
            <td colspan="12" style="border-bottom: 1px solid #000c17;padding: 0;margin: 0">
              <span style="color:#000;font-size: 14px;font-weight: 600;">备注：{{onelist.remark}}</span>
            </td>
          </tr>
          </tbody>
        </table>
        <p style="color:#000;font-size:14px;padding:0 2px;margin-top: 0px;">
          兹收到上列货物完整无缺，所有电器配件货物出门概不退货，灯，胶，玻璃等易碎货品必须当面检验清楚，事后概不负责！此单据一经客户或其代理人签名，将作为客户欠款凭证，特此声明！</p>
      </div>
      <div class="titler" v-if="onelist.name.startsWith('调拨申请')">
        <table class="gridtable">
          <thead>
          <tr>
            <th colspan="7"
                style="line-height: 18px;text-align: left;font-size: 18px;line-height: 18px;font-weight: 600">
              {{ onelist.orgName }}
            </th>
            <th colspan="5" style="text-align: left;">
              <p style="font-size: 15px;font-weight: 600;padding:0">{{onelist.name}}:</p>
              <p style="font-size: 12px;font-weight:400;padding:0;margin-top:-10px;">No: {{onelist.serviceId}}</p>
            </th>
          </tr>
          <tr style="padding-top: 0px;margin-top: 0px;">
            <th colspan="7" style="font-weight: 400;text-align: left;">
              <div><span
                style="font-size: 12px;">地址: {{ onelist.orgAdd }}</span></div>
              <div><span style="font-size: 12px;">电话: {{ onelist.orgTel }}</span></div>
            </th>
            <th colspan="5" style="font-weight: 400;text-align: left;">
              <div>
                <span style="font-size: 12px;">订单日期:</span><span
                style="font-size: 12px">{{ onelist.createTime }}</span>
              </div>
              <div>
                <span style="font-size: 12px;">打印日期:</span>
                <span style="font-size: 12px;">{{ onelist.printDate }}</span>
              </div>
            </th>
          </tr>
          <tr style="border-top:1px solid #000;">
            <th colspan="5"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">调出方:</span> <span
                style="font-size: 12px">{{ onelist.guestName }}</span>
              </div>
              <div>
                <span style="font-size: 12px">地址:</span> <span
                style="font-size: 12px">{{ onelist.guestAdd }}</span>
              </div>
            </th>
            <th colspan="3"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">联系人:</span> <span
                style="font-size: 12px">{{ onelist.guestPeo }}</span>
              </div>
              <div>
                <span style="font-size: 12px">联系电话:</span> <span
                style="font-size: 12px">{{ onelist.guestTel }}</span>
              </div>
            </th>
            <th colspan="4" style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;">
              <div style="">
                <span style="font-size: 12px">仓库:</span><span
                style="font-size: 12px">{{ onelist.storeName }}</span>
              </div>
            </th>
          </tr>
          <tr style="text-align: left;line-height: 12px;">
            <th
              style="width:5%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              序号
            </th>
            <th
              style="width:15%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件编码
            </th>
            <th
              style="width:10%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件名称
            </th>
            <th
              style="width: 12%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              OEM码
            </th>
            <th
              style="width: 5%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              品牌
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              车型
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              规格
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              单位
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              数量
            </th>
            <th
              style="width: 10%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-bottom:1px solid #000;">
              仓位
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td
              style="font-size: 12px; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              {{index + 1}}
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.oemCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partBrand}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.carModelName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.spec}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.unit}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.applyQty}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.storeShelf}}
              </div>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="2" style="padding: 0 2px;">
              <span>总数: </span>
              <span>{{ onelist.totalNum }}</span>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="3"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>制单人:</span>
              <span>{{ onelist.orderMan }}</span>
            </td>
            <td colspan="3"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>提交人:</span>
              <span>{{ onelist.commitUname }}</span>
            </td>
            <td colspan="3"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>送货人:</span>
              <span>{{ onelist.deliverer }}</span>
            </td>
            <td colspan="3"
                style="padding: 2px;margin-top: 0;;border: 1px #000000 solid;border-left: none;border-right: none;">
              <span>收货人:</span>
              <span>{{ onelist.receiver }}</span>
            </td>
          </tr>
          <tr>
            <td colspan="12" style="border-bottom: 1px solid #000c17;padding: 0;margin: 0">
              <span style="color:#000;font-size: 14px;font-weight: 600;">备注：{{onelist.remark}}</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="titler" v-if="onelist.name.startsWith('调拨出库')">
        <table class="gridtable">
          <thead>
          <tr>
            <th colspan="7"
                style="line-height: 18px;text-align: left;font-size: 18px;line-height: 18px;font-weight: 600">
              {{onelist.applyGuest.shortName||onelist.applyGuest.name}}
            </th>
            <th colspan="5" style="text-align: left;">
              <p style="font-size: 15px;font-weight: 600;padding:0">{{onelist.name}}:</p>
              <p style="font-size: 12px;font-weight:400;padding:0;margin-top:-10px;">No: {{onelist.apply.serviceId}}</p>
            </th>
          </tr>
          <tr style="padding-top: 0px;margin-top: 0px;">
            <th colspan="7" style="font-weight: 400;text-align: left;">
              <div><span
                style="font-size: 12px;">地址: {{onelist.applyGuest.addr ||
               ( (onelist.applyGuest.province || "") + (onelist.applyGuest.city || "") +
                (onelist.applyGuest.district || "") + (onelist.applyGuest.streetAddress || ""))
                }}</span></div>
              <div><span style="font-size: 12px;">电话: {{ onelist.applyGuest.tel||""}}</span></div>
            </th>
            <th colspan="5" style="font-weight: 400;text-align: left;">
              <div>
                <span style="font-size: 12px;">订单日期:</span><span
                style="font-size: 12px">{{ onelist.apply.orderDate }}</span>
              </div>
              <div>
                <span style="font-size: 12px;">打印日期:</span>
                <span style="font-size: 12px;">{{ onelist.printDate }}</span>
              </div>
            </th>
          </tr>
          <tr style="border-top:1px solid #000;">
            <th colspan="5"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">调入方:</span> <span
                style="font-size: 12px">{{onelist.logisticsRecord!=null?onelist.logisticsRecord.guestName : ""}}</span>
              </div>
              <div>
                <span style="font-size: 12px">地址:</span> <span
                style="font-size: 12px">{{ onelist.guest.address}}</span>
              </div>
            </th>
            <th colspan="3"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">联系人:</span> <span
                style="font-size: 12px">{{onelist.logisticsRecordVO?onelist.logisticsRecordVO.receiver:onelist.logisticsRecord!=null?onelist.logisticsRecord.receiver:''}}</span>
              </div>
              <div>
                <span style="font-size: 12px">联系电话:</span> <span
                style="font-size: 12px">{{onelist.logisticsRecordVO?onelist.logisticsRecordVO.receiverMobile:onelist.logisticsRecord!=null?onelist.logisticsRecord.receiverMobile:''}}</span>
              </div>
            </th>
            <th colspan="4" style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;">
              <div style="">
                <span style="font-size: 12px">出库仓库:</span><span
                style="font-size: 12px">{{onelist.storeVO.name}}</span>
              </div>
            </th>
          </tr>
          <tr style="text-align: left;line-height: 12px;">
            <th
              style="width:5%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              序号
            </th>
            <th
              style="width:15%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件编码
            </th>
            <th
              style="width:10%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件名称
            </th>
            <th
              style="width: 12%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              OEM码
            </th>
            <th
              style="width: 5%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              品牌
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              车型
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              规格
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              单位
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              数量
            </th>
            <th
              style="width: 10%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-bottom:1px solid #000;">
              仓位
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td
              style="font-size: 12px; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              {{index + 1}}
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.oemCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partBrand}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.carModelName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.spec}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.unit}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.acceptQty}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.storeShelf}}
              </div>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="2" style="padding: 0 2px;">
              <span>总数: </span>
              <span>{{ onelist.orderQty }}</span>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="3"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>制单人:</span>
              <span>{{onelist.apply.createUname}}</span>
            </td>
            <td colspan="3"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>提交人:</span>
              <span>{{onelist.apply.auditor}}</span>
            </td>
            <td colspan="3"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>送货人:</span>
            </td>
            <td colspan="3"
                style="padding: 2px;margin-top: 0;;border: 1px #000000 solid;border-left: none;border-right: none;">
              <span>收货人:</span>
              <span>{{onelist.logisticsRecord!=null?onelist.logisticsRecord.receiver:""}}</span>
            </td>
          </tr>
          <tr>
            <td colspan="12" style="border-bottom: 1px solid #000c17;padding: 0;margin: 0">
              <span style="color:#000;font-size: 14px;font-weight: 600;">备注：{{onelist.apply.remark}}</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="titler" v-if="onelist.name.startsWith('调拨入库')">
        <table class="gridtable">
          <thead>
          <tr>
            <th colspan="7"
                style="line-height: 18px;text-align: left;font-size: 18px;line-height: 18px;font-weight: 600">
              {{onelist.guestVO.fullName}}
            </th>
            <th colspan="5" style="text-align: left;">
              <p style="font-size: 15px;font-weight: 600;padding:0">{{onelist.name}}:</p>
              <p style="font-size: 12px;font-weight:400;padding:0;margin-top:-10px;">No:
                {{onelist.enterOrder.serviceId}}</p>
            </th>
          </tr>
          <tr style="padding-top: 0px;margin-top: 0px;">
            <th colspan="7" style="font-weight: 400;text-align: left;">
              <div><span
                style="font-size: 12px;">地址: {{onelist.guestVO.addr || onelist.guestVO.streetAddress}}</span></div>
              <div><span style="font-size: 12px;">电话: {{onelist.guestVO.tel}}</span></div>
            </th>
            <th colspan="5" style="font-weight: 400;text-align: left;">
              <div>
                <span style="font-size: 12px;">订单日期:</span><span
                style="font-size: 12px">{{onelist.enterOrder.createTime}}</span>
              </div>
              <div>
                <span style="font-size: 12px;">打印日期:</span>
                <span style="font-size: 12px;">{{ onelist.printDate }}</span>
              </div>
            </th>
          </tr>
          <tr style="border-top:1px solid #000;">
            <th colspan="5"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">调出方:</span> <span
                style="font-size: 12px">{{onelist.applyGuest.fullName}}</span>
              </div>
              <div>
                <span style="font-size: 12px">地址:</span> <span
                style="font-size: 12px">{{onelist.applyGuest.addr || onelist.applyGuest.streetAddress}}</span>
              </div>
            </th>
            <th colspan="3"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">联系人:</span> <span
                style="font-size: 12px">{{onelist.applyGuest.contactor}}</span>
              </div>
              <div>
                <span style="font-size: 12px">入库仓库:</span> <span
                style="font-size: 12px">{{onelist.store.name}}</span>
              </div>
            </th>
            <th colspan="4" style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;">
              <div style="">
                <span style="font-size: 12px">联系电话:</span><span
                style="font-size: 12px">{{onelist.applyGuest.tel }}</span>
              </div>
              <div style="">
                <div>
                  <span style="font-size: 12px">备注:</span>
                  <span style="font-size: 12px">{{ onelist.remark }}</span>
                </div>
              </div>
            </th>
          </tr>
          <tr style="text-align: left;line-height: 12px;">
            <th
              style="width:5%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              序号
            </th>
            <th
              style="width:15%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件编码
            </th>
            <th
              style="width:10%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件名称
            </th>
            <th
              style="width: 12%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              OEM码
            </th>
            <th
              style="width: 5%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              品牌
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              车型
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              规格
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              单位
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              数量
            </th>
            <th
              style="width: 10%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-bottom:1px solid #000;">
              仓位
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td
              style="font-size: 12px; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              {{index + 1}}
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.oemCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partBrand}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.carModelName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.spec}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.unit}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.hasOutQty}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.storeShelf}}
              </div>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="2" style="padding: 0 2px;">
              <span>总数: </span>
              <span>{{onelist.orderQty}}</span>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="4"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>制单人:</span>
              <span>{{onelist.enterOrder.orderMan}}</span>
            </td>
            <td colspan="4"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>送货人:</span>
              <span>{{onelist.enterOrder.deliverer}}</span>
            </td>
            <td colspan="4"
                style="padding: 2px;margin-top: 0;;border: 1px #000000 solid;border-left: none;border-right: none;">
              <span>收货人:</span>
              <span>{{onelist.guestVO.receiver}}</span>
            </td>
          </tr>
          <tr>
            <td colspan="12" style="border-bottom: 1px solid #000c17;padding: 0;margin: 0">
              <span style="color:#000;font-size: 14px;font-weight: 600;">备注：{{onelist.guestVO.remark}}</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="titler" v-if="onelist.name.startsWith('移仓单')">
        <table class="gridtable">
          <thead>
          <tr>
            <th colspan="7"
                style="line-height: 18px;text-align: left;font-size: 18px;line-height: 18px;font-weight: 600">
              {{onelist['applyGuest'].fullName}}
            </th>
            <th colspan="5" style="text-align: left;">
              <p style="font-size: 15px;font-weight: 600;padding:0">{{onelist.name}}:</p>
              <p style="font-size: 12px;font-weight:400;padding:0;margin-top:-10px;">No:
                {{onelist['stockShift'].serviceId}}</p>
            </th>
          </tr>
          <tr style="padding-top: 0px;margin-top: 0px;">
            <th colspan="7" style="font-weight: 400;text-align: left;">
              <div><span
                style="font-size: 12px;">地址: {{onelist['applyGuest'].streetAddress}}</span></div>
              <div><span style="font-size: 12px;">电话: {{onelist['applyGuest'].contactorTel}}</span></div>
            </th>
            <th colspan="5" style="font-weight: 400;text-align: left;">
              <div>
                <span style="font-size: 12px;">订单日期:</span><span
                style="font-size: 12px">{{onelist['stockShift'].createTime}}</span>
              </div>
              <div>
                <span style="font-size: 12px;">打印日期:</span>
                <span style="font-size: 12px;">{{ onelist.printDate }}</span>
              </div>
            </th>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="4"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border-left: none;border-bottom: none;">
              <span>移出仓库:</span>
              <span>{{onelist['store'].name}}</span>
            </td>
            <td colspan="4"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border-left: none;border-bottom: none;">
              <span>移入仓库:</span>
              <span>{{onelist['receiveStore'].name}}</span>
            </td>
            <td colspan="4"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border-left: none;border-right: none;border-bottom: none;">
              <span>移仓日期:</span>
              <span>{{onelist['stockShift'].auditDate}}</span>
            </td>
          </tr>
          <tr style="text-align: left;line-height: 12px;">
            <th
              style="width:5%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              序号
            </th>
            <th
              style="width:15%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件编码
            </th>
            <th
              style="width:10%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件名称
            </th>
            <th
              style="width: 16%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              OEM码
            </th>
            <th
              style="width: 5%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              品牌
            </th>
            <th
              style="width: 11%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              车型
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              规格
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              单位
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              数量
            </th>
            <th
              style="width: 18%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-bottom:1px solid #000;">
              仓位
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td
              style="font-size: 12px; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              {{index + 1}}
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.oemCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partBrand}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.carModelName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.spec}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.unit}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.orderQty}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.storeShelf}}
              </div>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="2" style="padding: 0 2px;">
              <span>总数: </span>
              <span>{{onelist.orderQty}}</span>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="6" style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border-left: none;">
              <span>制单人:</span>
              <span>{{onelist['stockShift'].orderMan}}</span>
            </td>
            <td colspan="6"
                style="padding: 2px;margin-top: 0;;border: 1px #000000 solid;border-left: none;border-right: none;">
              <span>提交人:</span>
              <span>{{onelist['stockShift'].createUname}}</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="titler" v-if="onelist.name.startsWith('调入退回申请')">
        <table class="gridtable">
          <thead>
          <tr>
            <th colspan="7"
                style="line-height: 18px;text-align: left;font-size: 18px;line-height: 18px;font-weight: 600">
              {{onelist.apply.orgName}}
            </th>
            <th colspan="5" style="text-align: left;">
              <p style="font-size: 15px;font-weight: 600;padding:0">{{onelist.name}}:</p>
              <p style="font-size: 12px;font-weight:400;padding:0;margin-top:-10px;">No: {{onelist.apply.serviceId}}</p>
            </th>
          </tr>
          <tr style="padding-top: 0px;margin-top: 0px;">
            <th colspan="7" style="font-weight: 400;text-align: left;">
              <div><span
                style="font-size: 12px;">地址: {{onelist.applyGuest.address}}</span></div>
              <div><span style="font-size: 12px;">电话: {{onelist.applyGuest.tel}}</span></div>
            </th>
            <th colspan="5" style="font-weight: 400;text-align: left;">
              <div>
                <span style="font-size: 12px;">订单日期:</span><span
                style="font-size: 12px">{{onelist.apply.orderDate}}</span>
              </div>
              <div>
                <span style="font-size: 12px;">打印日期:</span>
                <span style="font-size: 12px;">{{ onelist.printDate }}</span>
              </div>
            </th>
          </tr>
          <tr style="border-top:1px solid #000;">
            <th colspan="5"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">调出方:</span> <span
                style="font-size: 12px">{{onelist.guest.name}}</span>
              </div>
              <div>
                <span style="font-size: 12px">地址:</span> <span
                style="font-size: 12px">{{onelist.guest.address || onelist.guest.province+onelist.guest.city+onelist.guest.district+onelist.guest.streetAddress}}</span>
              </div>
            </th>
            <th colspan="3"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">收货单位:</span> <span
                style="font-size: 12px">{{onelist.applyGuest.name}}</span>
              </div>
              <div>
                <span style="font-size: 12px">收货人:</span> <span
                style="font-size: 12px">{{onelist.applyGuest.contactor}}</span>
              </div>
            </th>
            <th colspan="4" style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;">
              <div style="">
                <span style="font-size: 12px">联系电话:</span><span
                style="font-size: 12px">{{onelist.guest.tel}}</span>
              </div>
              <div style="">
                <span style="font-size: 12px">出库仓库:</span>
                <span style="font-size: 12px">{{onelist.storeVO.name}}</span>
              </div>
            </th>
          </tr>
          <tr style="text-align: left;line-height: 12px;">
            <th
              style="width:5%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              序号
            </th>
            <th
              style="width:15%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件编码
            </th>
            <th
              style="width:10%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件名称
            </th>
            <th
              style="width: 12%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              OEM码
            </th>
            <th
              style="width: 5%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              品牌
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              车型
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              规格
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              单位
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              数量
            </th>
            <th
              style="width: 10%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-bottom:1px solid #000;">
              仓位
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td
              style="font-size: 12px; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              {{index + 1}}
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.oemCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partBrand}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.carModelName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.spec}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.unit}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.acceptQty}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.storeShelf}}
              </div>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="2" style="padding: 0 2px;">
              <span>总数: </span>
              <span>{{onelist.orderQty}}</span>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="4"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border-left: none;">
              <span>制单人:</span>
              <span>{{onelist.apply.createUname}}</span>
            </td>
            <td colspan="4"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border-left: none;">
              <span>送货人:</span>
              <span></span>
            </td>
            <td colspan="4"
                style="padding: 2px;margin-top: 0;;border: 1px #000000 solid;border-left: none;border-right: none;">
              <span>收货人:</span>
              <span></span>
            </td>
          </tr>
          </tbody>
        </table>
        <p style="margin-top:0;color:#000;padding:2px;font-size: 14px;font-weight: 600;">
          备 注：
          <span>{{onelist.apply.remark}}</span>
        </p>
      </div>
      <div class="titler" v-if="onelist.name.startsWith('调出退回入库')">
        <table class="gridtable">
          <thead>
          <tr>
            <th colspan="7"
                style="line-height: 18px;text-align: left;font-size: 18px;line-height: 18px;font-weight: 600">
              {{onelist.guestVO.fullName}}
            </th>
            <th colspan="5" style="text-align: left;">
              <p style="font-size: 15px;font-weight: 600;padding:0">{{onelist.name}}:</p>
              <p style="font-size: 12px;font-weight:400;padding:0;margin-top:-10px;">No:
                {{onelist.enterOrder.serviceId}}</p>
            </th>
          </tr>
          <tr style="padding-top: 0px;margin-top: 0px;">
            <th colspan="7" style="font-weight: 400;text-align: left;">
              <div><span
                style="font-size: 12px;">地址: {{onelist.guestVO.addr || onelist.guestVO.streetAddress}}</span></div>
              <div><span style="font-size: 12px;">电话: {{onelist.guestVO.tel}}</span></div>
            </th>
            <th colspan="5" style="font-weight: 400;text-align: left;">
              <div>
                <span style="font-size: 12px;">订单日期:</span><span
                style="font-size: 12px">{{onelist.enterOrder.orderDate}}</span>
              </div>
              <div>
                <span style="font-size: 12px;">打印日期:</span>
                <span style="font-size: 12px;">{{ onelist.printDate }}</span>
              </div>
            </th>
          </tr>
          <tr style="border-top:1px solid #000;">
            <th colspan="6"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">申请方:</span> <span
                style="font-size: 12px">{{onelist.applyGuest.fullName}}</span>
              </div>
              <div>
                <span style="font-size: 12px">申请单号:</span> <span
                style="font-size: 12px">{{onelist.enterOrder.code}}</span>
              </div>
            </th>
            <th colspan="6"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;">
              <div>
                <span style="font-size: 12px">入库仓库:</span> <span
                style="font-size: 12px">{{onelist.store.name}}</span>
              </div>
              <div>
                <span style="font-size: 12px">处理人:</span> <span
                style="font-size: 12px">{{onelist.enterOrder.auditor}}</span>
              </div>
            </th>
          </tr>
          <tr style="text-align: left;line-height: 12px;">
            <th
              style="width:5%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              序号
            </th>
            <th
              style="width:15%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件编码
            </th>
            <th
              style="width:10%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件名称
            </th>
            <th
              style="width: 12%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              OEM码
            </th>
            <th
              style="width: 5%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              品牌
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              车型
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              规格
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              单位
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              数量
            </th>
            <th
              style="width: 10%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-bottom:1px solid #000;">
              仓位
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td
              style="font-size: 12px; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              {{index + 1}}
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.oemCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partBrand}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.carModelName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.spec}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.unit}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.applyQty}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.storeShelf}}
              </div>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="2" style="padding: 0 2px;">
              <span>总数: </span>
              <span>{{onelist.orderQty}}</span>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="4"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>制单人:</span>
              <span>{{onelist.enterOrder.createUname}}</span>
            </td>
            <td colspan="4"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>送货人:</span>
              <span></span>
            </td>
            <td colspan="4"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border-left: none;border-right: none;">
              <span>收货人:</span>
              <span></span>
            </td>
          </tr>
          <tr>
            <td colspan="12" style="border-bottom: 1px solid #000c17;padding: 0;margin: 0">
              <span style="color:#000;font-size: 14px;font-weight: 600;">备注：{{onelist.enterOrder.remark}}</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="titler" v-if="routeN.startsWith('procurementAndStorage')">
        <table class="gridtable">
          <thead>
          <tr>
            <th colspan="7"
                style="line-height: 18px;text-align: left;font-size: 18px;line-height: 18px;font-weight: 600">
              {{onelist.orgName || ' '}}
            </th>
            <th colspan="5" style="text-align: left;">
              <p style="font-size: 15px;font-weight: 600;padding:0">{{onelist.name}}:</p>
              <p style="font-size: 12px;font-weight:400;padding:0;margin-top:-10px;">No: {{onelist.serviceId}}</p>
            </th>
          </tr>
          <tr style="padding-top: 0px;margin-top: 0px;">
            <th colspan="7" style="font-weight: 400;text-align: left;">
              <div><span
                style="font-size: 12px;">地址: {{onelist.orgAddr || ' '}}</span></div>
              <div><span style="font-size: 12px;">电话: {{onelist.orgTel || ' '}}</span></div>
            </th>
            <th colspan="5" style="font-weight: 400;text-align: left;">
              <div>
                <span style="font-size: 12px;">创建日期:</span><span
                style="font-size: 12px">{{onelist.createTime || ' '}}</span>
              </div>
              <div>
                <span style="font-size: 12px;">打印日期:</span>
                <span style="font-size: 12px;">{{ onelist.printDate }}</span>
              </div>
            </th>
          </tr>
          <tr style="border-top:1px solid #000;">
            <th colspan="5"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">供应商:</span> <span
                style="font-size: 12px">{{ onelist.guestName}}</span>
              </div>
              <div>
                <span style="font-size: 12px">地址:</span> <span
                style="font-size: 12px">{{ onelist.streetAddress}}</span>
              </div>
            </th>
            <th colspan="3"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">联系人:</span> <span
                style="font-size: 12px">{{onelist.contactor}}</span>
              </div>
              <div>
                <span style="font-size: 12px">票据类型:</span> <span
                style="font-size: 12px">{{onelist.billTypeName}}</span>
              </div>
            </th>
            <th colspan="4" style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;">
              <div style="">
                <span style="font-size: 12px">联系电话:</span><span
                style="font-size: 12px">{{onelist.contactorTel}}</span>
              </div>
              <div style="display: flex;">
                <div style="flex: 1">
                  <span style="font-size: 12px">结算方式:</span>
                  <span style="font-size: 12px">{{onelist.settleTypeName}}</span>
                </div>
                <div style="flex: 1">
                  <span style="font-size: 12px">仓库:</span>
                  <span style="font-size: 12px">{{onelist.storeName}}</span>
                </div>
              </div>
            </th>
          </tr>
          <tr style="text-align: left;line-height: 12px;">
            <th
              style="width:5%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              序号
            </th>
            <th
              style="width:15%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件编码
            </th>
            <th
              style="width:10%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件名称
            </th>
            <th
              style="width: 12%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              OEM码
            </th>
            <th
              style="width: 5%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              品牌
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              车型
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              规格
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              单位
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              数量
            </th>
            <th
              style="width: 8%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              单价
            </th>
            <th
              style="width: 8%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              金额
            </th>
            <th
              style="width: 10%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-bottom:1px solid #000;">
              仓位
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.details" :key="index">
            <td
              style="font-size: 12px; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              {{index + 1}}
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.oemCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partBrand}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.carModelName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.spec}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.unit}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.orderQty}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{parseFloat(item.orderPrice).toFixed(2)}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{parseFloat(item.orderAmt).toFixed(2)}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.storeShelf}}
              </div>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="8" style="padding: 0 2px;margin-top: 0;border-right: 1px #000000 solid;">
              <span>合计:</span>
              <span>{{ onelist.orderAmt | toChies }}</span>
            </td>
            <td colspan="2" style="padding: 0 2px;border-right: 1px #000000 solid;">
              <span>总数: </span>
              <span>{{ onelist.orderQty }}</span>
            </td>
            <td colspan="2" style="padding: 0 2px;">
              <span>合计: </span>
              <span>{{ onelist.orderAmt }}</span>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="4"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>制单人:</span>
              <span>{{ onelist.orderMan }}</span>
            </td>
            <td colspan="4"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>送货人:</span>
              <span>{{ onelist.deliverer }}</span>
            </td>
            <td colspan="4"
                style="padding: 2px;margin-top: 0;;border: 1px #000000 solid;border-left: none;border-right: none;">
              <span>收货人:</span>
              <span>{{ onelist.receiver }}</span>
            </td>
          </tr>
          <tr>
            <td colspan="12" style="border-bottom: 1px solid #000c17;padding: 0;margin: 0">
              <span style="color:#000;font-size: 14px;font-weight: 600;">备注：{{onelist.remark}}</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="titler" v-if="onelist.name.startsWith('盘点单')">
        <table class="gridtable">
          <thead>
          <tr>
            <th colspan="7"
                style="line-height: 18px;text-align: left;font-size: 18px;line-height: 18px;font-weight: 600">
              {{onelist.orgName}}
            </th>
            <th colspan="5" style="text-align: left;">
              <p style="font-size: 15px;font-weight: 600;padding:0">{{onelist.name}}:</p>
              <p style="font-size: 12px;font-weight:400;padding:0;margin-top:-10px;">No: {{onelist.serviceId}}</p>
            </th>
          </tr>
          <tr style="padding-top: 0px;margin-top: 0px;">
            <th colspan="7" style="font-weight: 400;text-align: left;">
              <div><span
                style="font-size: 12px;">地址: {{onelist.orgAddr}}</span></div>
              <div><span style="font-size: 12px;">电话: {{onelist.orgTel}}</span></div>
            </th>
            <th colspan="5" style="font-weight: 400;text-align: left;">
              <div>
                <span style="font-size: 12px;">订单日期:</span><span
                style="font-size: 12px">{{onelist.createTime}}</span>
              </div>
              <div>
                <span style="font-size: 12px;">打印日期:</span>
                <span style="font-size: 12px;">{{ onelist.printDate }}</span>
              </div>
            </th>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="6"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border-left: none;border-bottom: none;">
              <span>盘点仓库:</span>
              <span>{{onelist.storeName}}</span>
            </td>
            <td colspan="6" style="padding: 2px;margin-top: 0;border-top: 1px #000000 solid;">
              <span>盘点日期:</span>
              <span>{{onelist.checkDate}}</span>
            </td>
          </tr>
          <tr style="text-align: left;line-height: 12px;">
            <th
              style="width:5%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              序号
            </th>
            <th
              style="width:15%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件编码
            </th>
            <th
              style="width:10%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件名称
            </th>
            <th
              style="width: 16%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              OEM码
            </th>
            <th
              style="width: 5%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              品牌
            </th>
            <th
              style="width: 11%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              车型
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              规格
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              单位
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              数量
            </th>
            <th
              style="width: 18%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-bottom:1px solid #000;">
              仓位
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td
              style="font-size: 12px; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              {{index + 1}}
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.oemCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partBrand}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.carModelName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.spec}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.unit}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.trueQty}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.storeShelf}}
              </div>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="2" style="padding: 0 2px;">
              <span>总数: </span>
              <span>{{onelist.orderQty}}</span>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="6" style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border-left: none;">
              <span>制单人:</span>
              <span>{{onelist.createUname}}</span>
            </td>
            <td colspan="6"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border-left: none;border-right: none;">
              <span>盘点人:</span>
              <span>{{onelist.orderMan}}</span>
            </td>
          </tr>
          <tr>
            <td colspan="12" style="border-bottom: 1px solid #000c17;padding: 0;margin: 0">
              <span style="color:#000;font-size: 14px;font-weight: 600;">备注：{{onelist.remark}}</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="titler"
           v-if="(onelist.name.startsWith('销售出库') || onelist.name.startsWith('采购入库')) && !routeN.startsWith('procurementAndStorage')">
        <table class="gridtable">
          <thead>
          <tr>
            <th colspan="12" style="text-align: left;">
              <p style="font-size: 15px;font-weight: 600;padding:0">{{onelist.name}}:</p>
              <p style="font-size: 12px;font-weight:400;padding:0;margin-top:-10px;">No: {{onelist.serviceId}}</p>
            </th>
          </tr>
          <tr style="padding-top: 0px;margin-top: 0px;">
            <th colspan="7" style="font-weight: 400;text-align: left;">
              <div><span
                style="font-size: 12px;">地址: {{onelist.orgAddress || ' '}}</span></div>
              <div><span style="font-size: 12px;">电话: {{onelist.orgTel || ' '}}</span></div>
            </th>
            <th colspan="5" style="font-weight: 400;text-align: left;">
              <div>
                <span style="font-size: 12px;">创建日期:</span><span
                style="font-size: 12px">{{onelist.creationDate || ' '}}</span>
              </div>
              <div>
                <span style="font-size: 12px;">打印日期:</span>
                <span style="font-size: 12px;">{{ onelist.printDate }}</span>
              </div>
            </th>
          </tr>
          <tr style="border-top:1px solid #000;">
            <th colspan="5"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">供应商:</span> <span
                style="font-size: 12px">{{onelist.guestName}}</span>
              </div>
              <div>
                <span style="font-size: 12px">地址:</span> <span
                style="font-size: 12px">{{onelist.guestAddress}}</span>
              </div>
            </th>
            <th colspan="3"
                style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;border-right:1px solid #000;">
              <div>
                <span style="font-size: 12px">联系人:</span> <span
                style="font-size: 12px">{{onelist.contactPerson}}</span>
              </div>
              <div>
                <span style="font-size: 12px">票据类型:</span> <span
                style="font-size: 12px">{{onelist.ticketTypeName}}</span>
              </div>
            </th>
            <th colspan="4" style="line-height: 12px;font-weight: 400;text-align: left;border-top:1px solid #000;">
              <div style="">
                <span style="font-size: 12px">联系电话:</span><span
                style="font-size: 12px">{{onelist.personTel}}</span>
              </div>
              <div style="">
                <span style="font-size: 12px">结算方式:</span>
                <span style="font-size: 12px">{{onelist.settlementMethodName}}</span>
              </div>
            </th>
          </tr>
          <tr style="text-align: left;line-height: 12px;">
            <th
              style="width:5%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              序号
            </th>
            <th
              style="width:15%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件编码
            </th>
            <th
              style="width:10%;padding: 2px 0;font-size: 12px; font-weight: 400;border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              配件名称
            </th>
            <th
              style="width: 12%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              OEM码
            </th>
            <th
              style="width: 5%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              品牌
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              车型
            </th>
            <th
              style="width: 7%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              规格
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              单位
            </th>
            <th
              style="width: 6%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              数量
            </th>
            <th
              style="width: 8%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              单价
            </th>
            <th
              style="width: 8%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;border-bottom:1px solid #000;">
              金额
            </th>
            <th
              style="width: 10%;padding: 2px 0;font-size: 12px;font-weight: 400; border-top: 2px solid #000; text-align: left;border-bottom:1px solid #000;">
              仓位
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td
              style="font-size: 12px; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              {{index + 1}}
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partName}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.oemCode}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.partBrand}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.carModel}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.specification}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.unitId}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.qty}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.price}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.orderAmt}}
              </div>
            </td>
            <td style="border-bottom: 1px solid #000; text-align: left;padding: 2px 0;">
              <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 12px;height: 12px">
                {{item.storeShelf}}
              </div>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="8" style="padding: 0 2px;margin-top: 0;border-right: 1px #000000 solid;">
              <span>合计:</span>
              <span>{{ onelist.totalAmt | toChies }}</span>
            </td>
            <td colspan="2" style="padding: 0 2px;border-right: 1px #000000 solid;">
              <span>总数: </span>
              <span>{{ onelist.totalNumber }}</span>
            </td>
            <td colspan="2" style="padding: 0 2px;">
              <span>合计: </span>
              <span>{{ onelist.totalAmt }}</span>
            </td>
          </tr>
          <tr style="font-size: 12px;line-height: 12px;">
            <td colspan="4"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>制单人:</span>
              <span>{{ onelist.createName }}</span>
            </td>
            <td colspan="4"
                style="padding: 2px;margin-top: 0;border: 1px #000000 solid;border: 1px #000000 solid;border-left: none;">
              <span>送货人:</span>
              <span>{{ onelist.deliveryMan }}</span>
            </td>
            <td colspan="4"
                style="padding: 2px;margin-top: 0;;border: 1px #000000 solid;border-left: none;border-right: none;">
              <span>收货人:</span>
              <span>{{ onelist.receiver }}</span>
            </td>
          </tr>
          <tr>
            <td colspan="12" style="border-bottom: 1px solid #000c17;padding: 0;margin: 0">
              <span style="color:#000;font-size: 14px;font-weight: 600;">备注：{{onelist.remark}}</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import {getprintList} from "@/api/salesManagment/salesOrder";//销售订单
  import {getPrint} from "_api/salesManagment/sellReturn.js";  //销售退货
  import {print} from "_api/procurement/plan"; //采购订单
  import * as supplierList from '@/api/business/supplierListApi'; //采购退货 print
  import * as prePrint from "_api/salesManagment/presell.js"; //预售单

  import {pointAdd} from "@/api/AlotManagement/transferringOrder"; //调拨申请
  import * as stockRemocal from "@/api/AlotManagement/stockRemoval.js";//调拨出库  getprintList
  import * as putStorage from "@/api/AlotManagement/putStorage.js";//调拨入库 getprintList
  import * as procurementAndStorage from '@/api/business/procurementAndStorage' //采购入库  getPrintShow
  import * as moveStorehouse from '@/api/business/moveStorehouse'//移仓单 getPrint
  import * as twoBackApply from "@/api/AlotManagement/twoBackApply.js";//调入退回申请 getprintList
  import * as smsInventory from '@/api/inventory/salesList' //盘点单  getprintList
  import {Printing} from "@/api/bill/saleOrder"; //应收应付
  import * as tools from "../../utils/tools";

  export default {
    name: "PrintShow",
    data() {
      return {
        onelist: {}, //打印数据
        num: "12323.09",
        num2: 78723,
        routeN: ""
      };
    },
    computed: {
      outKu() {
        let sum = 0
        this.onelist.detailList.forEach(item => {
          sum += Number(item.hasOutQty)
        })
        return sum
      }
    },
    beforeCreate() {
      this.onelist.name = 'null';
    },
    mounted() {
      // this.openModal(this.$route.query).then(() => {
      //   this.print()
      // })
    },
    methods: {
      //打印
      print() {
        let iframe = document.getElementById("print-iframe");
        if (!iframe) {
          let el = document.getElementById("printBox");
          iframe = document.createElement('IFRAME');
          let doc = null;
          iframe.setAttribute("id", "print-iframe");
          iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
          document.body.appendChild(iframe);
          doc = iframe.contentWindow.document;
          doc.write('<div>' + el.innerHTML + '</div>');
          doc.close();
          iframe.contentWindow.focus();
        }
        iframe.contentWindow.print();
        document.body.removeChild(iframe);
        this.routeN = ""
      },
      //去除页眉页脚
      remove_ie_header_and_footer() {
        var hkey_path;
        hkey_path = "HKEY_CURRENT_USER\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
        try {
          var RegWsh = new ActiveXObject("WScript.Shell");
          RegWsh.RegWrite(hkey_path + "header", "");
          RegWsh.RegWrite(hkey_path + "footer", "");
        } catch (e) {
        }
      },
      async openModal(order) {
        // console.log(order)
        if (order.id) {
          let data = {};
          data.id = order.id;
          var res;
          switch (order.route) {
            case "salesOrder": //销售订单
              res = await getprintList(data);
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || "";
                setTimeout(() => {
                  this.print()
                })
              }
              break;
            case "sellReturn": //销售退货
              res = await getPrint(data.id);
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.detailList = this.onelist.details
                setTimeout(() => {
                  this.print()
                })
              }
              break;
            case "InterPurchase": //国际采购
              res = await print(data.id);
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.detailList = this.onelist.details
                this.onelist.printDate = tools.transTime(new Date());
                if (this.onelist.detailList == [] || this.onelist.detailList == undefined) {
                  this.onelist.storeName = ""
                } else {
                  this.onelist.detailList.map((item, index) => {
                    if (index == 0) {
                      this.onelist.storeName = item.storeName
                    }
                  })
                }
                setTimeout(() => {
                  this.print()
                })
              }
              break;
            case "TemporaryPurchase": //临时采购
              res = await print(data.id);
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.detailList = this.onelist.details
                this.onelist.printDate = tools.transTime(new Date());
                if (this.onelist.detailList == [] || this.onelist.detailList == undefined) {
                  this.onelist.storeName = ""
                } else {
                  this.onelist.detailList.map((item, index) => {
                    if (index == 0) {
                      this.onelist.storeName = item.storeName
                    }
                  })
                }
                setTimeout(() => {
                  this.print()
                })
              }
              break;
            case "OutsidePurchase": //外采订单
              res = await print(data.id);
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.detailList = this.onelist.details
                this.onelist.printDate = tools.transTime(new Date());
                if (this.onelist.detailList == [] || this.onelist.detailList == undefined) {
                  this.onelist.storeName = ""
                } else {
                  this.onelist.detailList.map((item, index) => {
                    if (index == 0) {
                      this.onelist.storeName = item.storeName
                    }
                  })
                }
                setTimeout(() => {
                  this.print()
                })
              }
              break;
            case "PlannedPurchaseOrder": //计划采购
              res = await print(data.id);
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.detailList = this.onelist.details
                this.onelist.printDate = tools.transTime(new Date());
                this.onelist.orderQty = this.onelist.detailList.reduce((total, curr) => total += parseInt(curr.orderQty), 0);
                this.onelist.totalAmt = parseFloat(this.onelist.detailList.reduce((total, curr) => total += (curr.orderAmt), 0)).toFixed(2);
                if (this.onelist.detailList == [] || this.onelist.detailList == undefined) {
                  this.onelist.storeName = ""
                } else {
                  this.onelist.detailList.map((item, index) => {
                    if (index == 0) {
                      this.onelist.storeName = item.storeName
                    }
                  })
                }
                setTimeout(() => {
                  this.print()
                })
              }
              break;
            case "supplierList": //采购退货
              res = await supplierList.print(data)
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.detailList = this.onelist.details
                this.onelist.storeName = order.storeName
                this.onelist.printDate = tools.transTime(new Date());
                if (this.onelist.detailList == [] || this.onelist.detailList == undefined) {
                  this.onelist.orderQty = 0
                } else {
                  this.onelist.detailList.map((item, index) => {
                    this.onelist.orderQty += item.orderQty
                  })
                }
                setTimeout(() => {
                  this.print()
                })
              }
              break;
            case "presell": //预售单
              res = await prePrint.getPrint(data.id);
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""

                this.onelist.detailList = this.onelist.detailVOList
                this.onelist.printDate = tools.transTime(new Date());
                setTimeout(() => {
                  this.print()
                })
              }
              break;
            case "applyFor": //调拨申请
              res = await pointAdd(data);
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.printDate = tools.transTime(new Date());
                this.onelist.detailList = this.onelist.detailVOS
                this.onelist.orderQty = this.onelist.detailList.reduce((total, curr) => total += parseInt(curr.applyQty), 0);
                setTimeout(() => {
                  this.print()
                })
              }
              break;
            case "stockRemoval": //调拨出库
              res = await stockRemocal.getprintList(data)
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.printDate = tools.transTime(new Date());
                this.onelist.detailList = this.onelist.apply.detailVOS
                this.onelist.orderQty = this.onelist.detailList.reduce((total, curr) => total += parseInt(curr.acceptQty), 0);
                setTimeout(() => {
                  this.print()
                })
              }
              break;
            case "putStorage": //调拨入库
              res = await putStorage.getprintList(data);
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.printDate = tools.transTime(new Date());
                this.onelist.detailList = this.onelist.enterOrder.voList
                this.onelist.orderQty = this.onelist.detailList.reduce((total, curr) => total += parseInt(curr.hasOutQty), 0);
                setTimeout(() => {
                  this.print()
                })
              }
              break;
            case "moveStorehouse": //移仓单
              res = await moveStorehouse.getPrint(data);
              if (res.code === 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.printDate = tools.transTime(new Date());
                this.onelist.detailList = this.onelist['stockShift'].detailVOList
                this.onelist.orderQty = this.onelist.detailList.reduce((total, curr) => total += parseInt(curr.orderQty), 0);
                setTimeout(() => {
                  this.print()
                })
              }
              break;
            case "twoBackApply": //调入退回申请
              res = await twoBackApply.getprintList(data)
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.printDate = tools.transTime(new Date());
                this.onelist.detailList = this.onelist.apply.detailVOS
                this.onelist.orderQty = this.onelist.detailList.reduce((total, curr) => total += parseInt(curr.acceptQty), 0);
                setTimeout(() => {
                  this.print()
                })
              }
              break;
            case "twoBackInStorage": //调出退回入库
              res = await putStorage.getprintList(data);
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.printDate = tools.transTime(new Date());
                this.onelist.detailList = this.onelist.enterOrder.voList
                this.onelist.orderQty = this.onelist.detailList.reduce((total, curr) => total += parseInt(curr.applyQty), 0);
                setTimeout(() => {
                  this.print()
                })
              }
              break;
            case "procurementAndStorage"://采购入库
              this.routeN = "procurementAndStorage"
              res = await procurementAndStorage.getPrintShow(data);
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.printDate = tools.transTime(new Date());
                this.onelist.storeName=order.storeName;
                this.onelist.orderQty = this.onelist.details.reduce((total, curr) => total += parseInt(curr.orderQty), 0);
                setTimeout(() => {
                  this.print()
                })
              }
              break;
            case "smsInventory": //盘点单
              res = await smsInventory.getprintList(data);
              if (res.code == 0) {
                let repData = res.data || {}
                this.onelist = repData
                this.onelist.name = order.name || "" || ""
                this.onelist.printDate = tools.transTime(new Date());
                this.onelist.storeName=order.storeName;
                this.onelist.detailList = this.onelist.detailVOList
                this.onelist.orderQty = this.onelist.detailList.reduce((total, curr) => total += parseInt(curr.trueQty), 0);
                setTimeout(() => {
                  this.print()
                })
              }
              break;
            case "payMentmanage": //应收应付
              data.orderCode = order.orderCode
              data.orderType = order.orderType
              data.orgId = order.orgId
              data.guestId = order.guestId
              res = await Printing(data);
              if (res.code == 0) {
                this.onelist = res.data;
                res.data.orderDetailList.map((item, index) => {
                  item.num = index + 1;
                });
                this.onelist.name = order.name || ""
                this.onelist.detailList = res.data.orderDetailList
                setTimeout(() => {
                  this.print()
                })
              }
          }
          // this.print()
        } else {
          this.$message.error("至少选择一条信息");
        }
      }
    }
  };
</script>

<style scoped lang="less">
  /*@media print*/
  /*{*/
  /*  #printBox {page-break-after:always !important;}*/
  /*}*/
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
