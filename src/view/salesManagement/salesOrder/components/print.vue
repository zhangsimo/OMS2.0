<template>
  <Modal v-model="printShow" width="1300" closable>
    <div style="padding-bottom:10px;">
      <Button type="success" @click="print" class="mr10">打印</Button>
      <Button type="default" @click="printShow = false">取消</Button>
    </div>
    <div id="printBox" style="height: 100%">
      <div class="titler">
        <table class="gridtable" width="100%" cellPadding="0" cellSpacing="0" style="text-align: left;">
          <thead>
          <tr>
            <th colspan="4">
              <h3 style="text-align: center;line-height: 36px">发货申请</h3>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td width="14%" style="font-size: 12px; line-height: 26px; border-bottom: 1px solid #000;border-left: 1px solid #000;border-top: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;">收货单位</td>
            <td width="86%" colspan="3" style="border-bottom: 1px solid #000; text-align: left; border-top: 1px solid #000;border-right: 1px solid #000;padding:0 4px;">{{onelist.receiveComp}}</td>
          </tr>
          <tr>
            <td width="14%" style="line-height: 26px;font-size: 12px;border-left: 1px solid #000; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;">收货人</td>
            <td width="36%" style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;">{{onelist.receiver}}</td>
            <td width="14%" style="font-size: 12px; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;">联系电话</td>
            <td width="36%" style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;">{{onelist.receiverMobile}}</td>
          </tr>
          <tr>
            <td style="font-size: 12px;line-height: 26px;border-left: 1px solid #000; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;">收货地址</td>
            <td colspan="3" style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;">{{onelist.receiveAddress}}</td>
          </tr>
          <tr>
            <td style="line-height: 26px;font-size: 12px;border-left: 1px solid #000; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;">配送方式</td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;">{{onelist.deliveryType==0?'自配':onelist.deliveryType==1?'客户自提':onelist.deliveryType==2?'快递':'物流'}}</td>
            <td style="font-size: 12px; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;">发货物流</td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;">{{onelist.LogisticsName}}</td>
          </tr>
          <tr>
            <td style="line-height: 26px;font-size: 12px;border-left: 1px solid #000; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;">结算方式</td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;">{{onelist.settleType==2?'月结':onelist.settleType==0?'到付':'现结'}}</td>
            <td style="font-size: 12px; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;">发货备注</td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;">{{onelist.remark}}</td>
          </tr>
          <tr>
            <td style="line-height: 26px;font-size: 12px;border-left: 1px solid #000; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;">业务单号</td>
            <td colspan="3" style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;">{{onelist.businessNum}}</td>
          </tr>
          <tr>
            <td style="line-height: 26px;font-size: 12px;border-left: 1px solid #000; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;">件数</td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;"></td>
            <td style="font-size: 12px; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;">体积/重量</td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;"></td>
          </tr>
          <tr>
            <td style="line-height: 26px;font-size: 12px;border-left: 1px solid #000; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;">申请人</td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;">{{onelist.createUname}}</td>
            <td style="font-size: 12px; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;">打印人</td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;">{{onelist.printUname}}</td>
          </tr>
          <tr>
            <td style="line-height: 26px;font-size: 12px;border-left: 1px solid #000; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;">申请时间</td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;">{{onelist.createTime}}</td>
            <td style="font-size: 12px; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;">打印日期</td>
            <td style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;">{{onelist.printDate}}</td>
          </tr>
          <tr>
            <td style="height:32px;font-size: 12px;border-left: 1px solid #000; border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding: 4px;"></td>
            <td colspan="3" style="border-bottom: 1px solid #000; text-align: left;border-right: 1px solid #000;padding:0 4px;"></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div slot="footer">

    </div>
  </Modal>
</template>

<script>
  import * as api from "_api/procurement/plan";
  import * as tools from "../../../../utils/tools";
  import {logistics } from "_api/business/goodsInfos"

  export default {
    name: "print",
    props: ['orderId'],
    data() {
      return {
        printShow: false, //模态框隐藏
        onelist: {}, //打印数据
        details: [],
        num: "0",
        num2: 0,
        logisArr:[]//发货物流
      };
    },
    methods: {
      //打印
      print() {

        //判断iframe是否存在，不存在则创建iframe
        let iframe=document.getElementById("print-iframe");
        if(!iframe){
          let el = document.getElementById("printBox");
          iframe = document.createElement('IFRAME');
          let doc = null;
          iframe.setAttribute("id", "print-iframe");
          iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
          document.body.appendChild(iframe);
          doc = iframe.contentWindow.document;
          //这里可以自定义样式
          //doc.write("<LINK rel="stylesheet" type="text/css" href="css/print.css">");
          doc.write('<div>' + el.innerHTML + '</div>');
          doc.close();
          iframe.contentWindow.focus();
        }
        iframe.contentWindow.print();
        // if (navigator.userAgent.indexOf("MSIE") > 0){
        document.body.removeChild(iframe);
        // }




        // // 1.设置要打印的区域 div的className
        // var newstr = document.getElementById("printBox").innerHTML
        // // 2. 还原：将旧的页面储存起来，当打印完成后返给给页面。
        // // var oldstr = document.body.innerHTML;
        // // 3. 复制给body，并执行window.print打印功能
        // let body = document.body
        // body.style.overflow = 'visible'
        // body.innerHTML = newstr;
        // window.print();
        // 重新加载页面，以刷新数据
        // window.location.reload();
        // document.body.innerHTML = oldstr;
      },
      async openModal() {
        // this.printShow = true;
        let selectItemId = this.$parent.$parent.$parent.selectItemId||"";
        if (selectItemId) {
          let res = await api.printTableFHSQ({id:selectItemId});
          let log = await logistics()
          this.logisArr = log.data
          if (res.code === 0) {
            this.printShow = true;
            this.onelist = res.data;
            this.onelist.printDate = tools.transTime(new Date());
            this.onelist.printUname = this.$store.state.user.userData.staffName;
            this.onelist.LogisticsName = "";
            let wlFilter = this.logisArr.filter(item => this.onelist.deliveryLogistics==item.id)
            if(wlFilter.length>0){
              this.onelist.LogisticsName = wlFilter[0].shortName;
            }
            this.details = res.data.details;
            if(this.details==[] || this.details==undefined){
              this.onelist.storeName=""
            }else{
              this.details.map((item,index)=>{
                if(index==0){
                  this.onelist.storeName=item.storeName
                }
              })
            }
          }
        } else {
          this.$message.error("至少选择一条信息");
        }
      }
    }
  };
</script>

<style scoped lang="less">
  /*.vertical-center-modal {*/
  /*display: flex;*/
  /*align-items: center;*/
  /*justify-content: center;*/

  /*.ivu-modal {*/
  /*top: 0;*/
  /*}*/
  /*}*/
  /*#printBox {*/
  /*width: 1000px;*/
  /*margin: 0 auto;*/
  /*color:#000;*/
  /*.titler {*/
  /*padding-left: 10px;*/
  /*width: 900px;*/
  /*}*/
  /*}*/
  /*#printBox::-webkit-scrollbar {*/
  /*display: none;*/
  /*}*/
  /*#printBox {*/
  /*-ms-overflow-style: none;*/
  /*}*/
  /*#printBox::-webkit-scrollbar {*/
  /*width: 0 !important;*/
  /*}*/
  /*#printBox {*/
  /*overflow: -moz-scrollbars-none;*/
  /*color:#000;*/
  /*}*/
  /*//表格样式*/
  /*table.gridtable {*/
  /*width: 100%;*/
  /*font-family: verdana,arial,sans-serif;*/
  /*font-size:12px !important;*/
  /*color:#000000;*/
  /*border-width: 1px;*/
  /*border-color: #000000;*/
  /*text-align: left;*/
  /*border-collapse: collapse;*/
  /*}*/
  /*table.gridtable th {*/
  /*border-width: 1px;*/
  /*padding: 4px;*/
  /*border-style: solid;*/
  /*border-color: #000000;*/
  /*background-color: #dedede;*/
  /*}*/
  /*table.gridtable td {*/
  /*border-width: 1px;*/
  /*padding: 4px;*/
  /*border-style: solid;*/
  /*border-color: #000000;*/
  /*background-color: #ffffff;*/
  /*}*/
  /*table.gridtable tr {*/
  /*page-break-inside:avoid;*/
  /*}*/
  /*table.gridtable tr th{*/
  /*font-weight: 400 !important;*/
  /*}*/
</style>
