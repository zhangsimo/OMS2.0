<template>
  <Modal v-model="printShow" width="1300" closable>
    <!--    :mask-closable="false"-->
    <div style="padding-bottom:10px;">
      <Button type="success" @click="print" class="mr10">打印</Button>
      <Button type="default" @click="printShow = false">取消</Button>
    </div>
    <div ref="printBox" style="height: 100%">
      <div class="titler">
        <div class="detail-con">
          <table class="gridtable" width="100%" cellPadding="0" cellSpacing="0" style="text-align: left;">
            <thead>
            <tr>
              <th colspan="12" style="line-height: 18px;font-weight: 400;">
                <div style="display: flex; flex-flow: row nowrap">
                  <div style="flex: 1;padding: 4px;">
                    {{ onelist.orgName || "" }}
                  </div>
                  <div style="flex: 1;padding: 4px;">
                    <div style="font-size: 12px;">销售退货单</div>
                    <div style="font-size: 12px;">No： {{ onelist.serviceId }}</div>
                  </div>
                </div>
              </th>
            </tr>
            <tr>
              <th colspan="12" style="line-height: 18px;font-weight: 400;">
                <div style="display: flex; flex-flow: row nowrap">
                  <div style="flex: 1;padding: 4px;">
                    <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis"><span
                      style="font-size: 12px;">地址: {{ onelist.orgAddress }}</span></div>
                    <div><span style="font-size: 12px;">电话: {{ onelist.orgTel }}</span></div>
                  </div>
                  <div style="flex: 1;padding: 4px;">
                    <div>
                      <span style="font-size: 12px;">订单日期:</span><span style="font-size: 12px">{{ onelist.orderDate }}</span>
                    </div>
                    <div>
                      <span style="font-size: 12px;">打印日期:</span>
                      <span style="font-size: 12px;">{{ onelist.printDate }}</span>
                    </div>
                  </div>
                </div>
              </th>
            </tr>
            <tr>
              <th colspan="12" style="line-height: 18px;font-weight: 400;border-top:1px solid #000;">
                <div style="display: flex; flex-flow: row nowrap">
                  <div style="flex: 4;border-right: 1px solid #000;padding: 4px;">
                    <div>
                      <span style="font-size: 12px">客户:</span> <span
                      style="font-size: 12px">{{ onelist.guestName }}</span>
                    </div>
                    <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis">
                      <span style="font-size: 12px">地址:</span> <span
                      style="font-size: 12px">{{ onelist.guestAddress }}</span>
                    </div>
                  </div>
                  <div style="flex: 3;border-right: 1px solid #000;padding: 4px;">
                    <div>
                      <span style="font-size: 12px">联系人:</span> <span style="font-size: 12px">{{ onelist.guestContactor }}</span>
                    </div>
                    <div>
                      <span style="font-size: 12px">结算方式:</span>
                      <span style="font-size: 12px">{{onelist.settleTypeName}}</span>
                    </div>
                  </div>
                  <div style="flex: 3;padding: 4px;">
                    <div style="">
                      <span style="font-size: 12px">联系电话:</span><span
                      style="font-size: 12px">{{ onelist.guestTel }}</span>
                    </div>
                    <div>
                      <span style="font-size: 12px">仓库:</span>
                      <span style="font-size: 12px">{{onelist.storeName}}</span>
                    </div>
                  </div>
                </div>
              </th>
            </tr>
            <tr>
              <th
                style="width:5%;font-size: 12px; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;border-bottom:1px solid #000;">
                序号
              </th>
              <th
                style="width:12%;font-size: 12px; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;border-bottom:1px solid #000;">
                配件编码
              </th>
              <th
                style="width:12%;font-size: 12px; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;border-bottom:1px solid #000;">
                配件名称
              </th>
              <th
                style="width: 12%;font-size: 12px; border-top: 2px solid #000;borer-left:2px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;border-bottom:1px solid #000;">
                OEM码
              </th>
              <th
                style="width: 10%;font-size: 12px; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;border-bottom:1px solid #000;">
                品牌
              </th>
              <th
                style="width: 5%;font-size: 12px; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;border-bottom:1px solid #000;">
                车型
              </th>
              <th
                style="width: 6%;font-size: 12px; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;border-bottom:1px solid #000;">
                规格
              </th>
              <th
                style="width: 6%;font-size: 12px; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;border-bottom:1px solid #000;">
                单位
              </th>
              <th
                style="width: 6%;font-size: 12px; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;border-bottom:1px solid #000;">
                数量
              </th>
              <th
                style="width: 8%;font-size: 12px; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;border-bottom:1px solid #000;">
                单价
              </th>
              <th
                style="width: 8%;font-size: 12px; border-top: 2px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;border-bottom:1px solid #000;">
                金额
              </th>
              <th
                style="width: 10%;font-size: 12px; border-top: 2px solid #000; text-align: left;padding: 4px;border-bottom:1px solid #000;">
                仓位
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item ,index) in details" :key="index">
              <td
                style="font-size: 12px;; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;">
                {{index + 1}}
              </td>
              <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;">
                <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 24px;height: 24px">
                  {{item.partCode}}
                </div>
              </td>
              <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;">
                <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 24px;height: 24px">
                  {{item.partName}}
                </div>
              </td>
              <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;">
                <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 24px;height: 24px">
                  {{item.oemCode}}
                </div>
              </td>
              <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;">
                <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 24px;height: 24px">
                  {{item.partBrand}}
                </div>
              </td>
              <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;">
                <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 24px;height: 24px">
                  {{item.carModelName}}
                </div>
              </td>
              <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;">
                <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 24px;height: 24px">
                  {{item.spec}}
                </div>
              </td>
              <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;">
                <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 24px;height: 24px">
                  {{item.unit}}
                </div>
              </td>
              <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;">
                <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 24px;height: 24px">
                  {{item.orderQty}}
                </div>
              </td>
              <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;">
                <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 24px;height: 24px">
                  {{parseFloat(item.orderPrice).toFixed(2)}}
                </div>
              </td>
              <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;">
                <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 24px;height: 24px">
                  {{parseFloat(item.orderAmt).toFixed(2)}}
                </div>
              </td>
              <td style="border-bottom: 1px solid #000; text-align: left;padding:0 4px;">
                <div style="font-size: 12px;overflow: hidden;word-break:break-all;line-height: 24px;height: 24px">
                  {{item.storeShelf}}
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="12">
                <div
                  style="border-top: 1px #000000 solid;color:#000;font-size: 12px;text-align: left;display: flex;flex-flow: row nowrap;">
                  <div style="border-right: 1px #000000 solid; padding: 4px 0; width: 50%">
                    <span>合计:</span>
                    <span>{{ onelist.totalAmt | toChies }}</span>
                  </div>
                  <div style="padding: 4px; width: 25%">
                    <span>合计: </span>
                    <span>-{{ onelist.totalNumber }}</span>
                  </div>
                  <div style="flex: 1;padding: 4px">
                    <span>-{{ onelist.totalAmt }}</span>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="12">
                <div
                  style="border-top: 1px #000000 solid;border-bottom:1px solid #000;color:#000;font-size: 12px;text-align: left;display: flex;flex-flow: row nowrap;">
                  <div style="border-right: 1px #000000 solid; padding:4px 0;width: 33.33%">
                    <span>制单人:</span>
                    <span>{{ onelist.createName }}</span>
                  </div>
                  <div style="border-right: 1px #000000 solid; padding: 4px;width: 33.33%">
                    <span>送货人:</span>
                    <span></span>
                  </div>
                  <div style="flex: 1; padding: 4px">
                    <span>收货人:</span>
                    <span></span>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="12" style="border-bottom: 1px solid #000c17">
                <span style="color:#000;font-size: 14px;font-weight: 600;">备注：{{onelist.remark}}</span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div slot="footer">

    </div>
  </Modal>
</template>

<script>
  import * as tools from "../../../../../utils/tools";
  import {enternalPrintApi} from "@/api/bill/saleOrder"; //采购入库 销售退货

  export default {
    data() {
      return {
        printShow: false, //模态框隐藏
        onelist: {}, //打印数据
        details: [],
        num: "0",
        num2: 0
      };
    },
    computed: {
      selectShopList() {
        if (this.$store.state.user.userData.currentCompany != null) {
          return this.$store.state.user.userData.currentCompany.shortName
        } else {
          return ""
        }
      }
    },
    methods: {
      //打印
      print() {
        let iframe = document.getElementById("print-iframe");
        if (!iframe) {
          let el = this.$refs.printBox;
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
      },
      async openModal(order) {
        if (order.hasOwnProperty("id")) {
          let res = await enternalPrintApi({id:order.mainId});
          if (res.code == 0) {
            this.printShow=true
            this.onelist = res.data || {};
            this.onelist.printDate = tools.transTime(new Date());
            this.details = res.data.pchsEnterDetailVOS;
          }else{
            this.printShow=false;
          }
        } else {
          this.$message.error("至少选择一条信息");
        }
      }
    }
  };
</script>

<style scoped lang="less">
  .detail-con {
    max-height: 400px;
    overflow-y: auto;
  }
</style>
