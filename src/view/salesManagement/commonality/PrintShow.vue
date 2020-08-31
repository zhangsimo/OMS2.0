<template>
  <Modal v-model="printShow" closable id="printBoxBig" width="1300">
    <div id="printBox">
      <div class="titler">
        <Row style="border: 1px #000000 solid;color:#000;border-bottom: none;padding: 0px 2px;">
          <Col span="16" style="padding:0 2px;">
            <h5
              style="font-size: 18px;line-height: 44px;"
            >{{onelist.userCompany}}</h5>
          </Col>
          <Col span="8" style="padding:0 2px;">
            <p style="font-weight: 600;font-size: 16px">销售订单:</p>
            <p style="font-size: 12px">No: {{onelist.serviceId}}</p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;padding:0 2px;">
          <Col span="16" style="padding:0 2px">
            <p>
              <span style="font-size: 12px">地址:</span>
              <span style="font-size: 12px">{{onelist.addr}}</span>
            </p>
            <p>
              <span style="font-size: 12px">电话:</span>
              <span style="font-size: 12px">{{onelist.tel}}</span>
            </p>
          </Col>
          <Col span="8" style="padding:0 2px;">
            <p>
              <span style="font-size: 12px">订单日期:</span>
              <span style="font-size: 12px">{{onelist.orderDate}}</span>
            </p>
            <p>
              <span style="font-size: 12px">打印日期:</span>
              <span style="font-size: 12px">{{onelist.printDate}}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="10" style="padding:0 2px;border-right: 1px #000000 solid;">
            <p>
              <span style="font-size: 12px">客户:</span>
              <span style="font-size: 12px">{{onelist.guestName}}</span>
            </p>
            <p>
              <span style="font-size: 12px">地址:</span>
              <span style="font-size: 12px">{{onelist.guestAddr}}</span>
            </p>
          </Col>
          <Col span="4" style="padding:0 2px;border-right: 1px #000000 solid;">
            <p>
              <span style="font-size: 12px">联系人:</span>
              <span style="font-size: 12px">{{onelist.contactor}}</span>
            </p>
            <p>
              <span style="font-size: 12px">票据类型:</span>
              <span style="font-size: 12px">{{onelist.billTypeName}}</span>
            </p>
          </Col>
          <Col span="10" style="padding:0 2px;">
            <p>
              <span style="font-size: 12px">联系电话:</span>
              <span style="font-size: 12px">{{onelist.contactorTel}}</span>
            </p>
            <Row>
              <Col span="12">
                <p>
                  <span style="font-size: 12px">结算方式:</span>
                  <span style="font-size: 12px">{{onelist.settleTypeName}}</span>
                </p>
              </Col>
              <Col span="12">
                <p>
                  <span style="font-size: 12px">仓库:</span>
                  <span style="font-size: 12px">{{onelist.storeName}}</span>
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
        <table class="gridtable">
          <thead>
          <tr>
            <th style="width:30px !important;">序号</th>
            <th style="width:85px;overflow: hidden;white-space:nowrap;">配件编码</th>
            <th style="width:85px;overflow: hidden;white-space:nowrap;">配件名称</th>
            <th style="width:85px;overflow: hidden;white-space:nowrap;">OEM码</th>
            <th style="width:50px;overflow: hidden;white-space:nowrap;">品牌</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">车型</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">规格</th>
            <th style="width:30px;overflow: hidden;white-space:nowrap;">单位</th>
            <th style="width:40px !important;">数量</th>
            <th style="width:60px !important;">单价</th>
            <th style="width:65px !important;">金额</th>
            <th style="width:80px !important;">仓位</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td style="width:30px !important;">{{index + 1}}</td>
            <td style="width:85px;overflow: hidden;white-space:nowrap;">{{item.partCode}}</td>
            <td style="width:85px;overflow: hidden;white-space:nowrap;">{{item.partName}}</td>
            <td style="width:85px;overflow:hidden;white-space:nowrap;">{{item.oemCode}}</td>
            <td style="width:50px;overflow: hidden;white-space:nowrap;">{{item.partBrand}}</td>
            <td style="width:40px;overflow:hidden;white-space:nowrap;">{{item.carModelName}}</td>
            <td style="width:40px;overflow: hidden;white-space:nowrap;">{{item.spec}}</td>
            <td style="width:30px;overflow: hidden;white-space:nowrap;">{{item.unit}}</td>
            <td style="width:40px !important;">{{item.orderQty}}</td>
            <td style="width:60px !important;">{{item.orderPrice}}</td>
            <td style="width:65px !important;">{{item.orderAmt}}</td>
            <td style="width:80px !important;">{{item.storeShelf}}</td>
          </tr>
          </tbody>
        </table>

        <Row style="border: 1px #000000 solid;color:#000;font-size: 10px;display: flex;">
          <Col style="border-right: 1px #000000 solid;padding:2px;width: 640px">
            <span>合计:</span>
            <span>{{ onelist.orderAmt | toChies}}</span>
          </Col>
          <Col style="border-right: 1px #000000 solid;padding:2px;width:160px">
            <span>总数:</span>
            <span>{{onelist.orderQty}}</span>
          </Col>
          <Col style="padding:2px;width: 200px;">
            <span>合计:</span>
            <span>{{onelist.orderAmt}}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;font-size: 10px;">
          <Col span="6" style="border-right: 1px #000000 solid;padding:2px;">
            <span>制单人:</span>
            <span>{{onelist.orderMan}}</span>
          </Col>
          <Col span="6" style="border-right: 1px #000000 solid;padding:2px;">
            <span>提交人:</span>
            <span>{{onelist.auditor}}</span>
          </Col>
          <Col span="6" style="border-right: 1px #000000 solid;padding:2px;">
            <span>送货人:</span>
            <span>{{onelist.deliverer}}</span>
          </Col>
          <Col span="6" style="padding:2px;">
            <span>收货人:</span>
            <span>{{onelist.receiver}}</span>
          </Col>
        </Row>
        <p style="border: 1px #000000 solid;border-top: none;color:#000;padding:2px;font-size: 10px;">
          备 注：
          <span>{{onelist.remark}}</span>
        </p>
        <p style="color:#000;padding:2px;font-size: 10px;">
          兹收到上列货物完整无缺，所有电器配件货物出门概不退货，灯，胶，玻璃等易碎货品必须当面检验清楚，事后概不负责！此单据一经客户或其代理人签名，将作为客户欠款凭证，特此声明！</p>
      </div>

      <div></div>
    </div>
    <div slot="footer" id="footer">
      <Button type="success" @click="print">打印</Button>
      <Button type="default" @click="printShow = false">取消</Button>
    </div>
  </Modal>
</template>

<script>
  import {getprintList} from "@/api/salesManagment/salesOrder";

  export default {
    name: "PrintShow",
    data() {
      return {
        printShow: false, //模态框隐藏
        columns2: [
          {
            title: "序号",
            type: "index",
            align: "center"
          },
          {
            title: "配件编码",
            key: "partCode",
            align: "center"
          },
          {
            title: "配件名称",
            key: "partName",
            align: "center"
          },
          {
            title: "品牌",
            key: "partBrand",
            align: "center"
          },
          {
            title: "品牌车型",
            key: "carModelName",
            align: "center"
          },
          {
            title: "规格",
            key: "spec",
            align: "center"
          },
          {
            title: "单位",
            key: "unit",
            align: "center"
          },
          {
            title: "数量",
            key: "orderQty",
            align: "center"
          },
          {
            title: "单价",
            key: "orderPrice",
            align: "center"
          },
          {
            title: "金额",
            key: "orderAmt",
            align: "center"
          },
          {
            title: "仓库",
            key: "storeName",
            align: "center"
          },
          {
            title: "仓位",
            key: "storeShelf",
            align: "center"
          }
        ],
        onelist: {}, //打印数据
        num: "12323.09",
        num2: 78723,
      };
    },
    methods: {
      //打印
      async print() {
        // let tableStyle = `#printBox {width: 700px;margin: 0 auto;}
        //     #printBox #titler {width: 100%;padding-left: 2px;}
        //     #printBox::-webkit-scrollbar {display: none;}
        //     #printBox {-ms-overflow-style: none;}
        //     #printBox::-webkit-scrollbar {width: 0 !important;}
        //     #printBox {overflow: -moz-scrollbars-none;}
        //     #gridtable {width: 100%;font-family: verdana, arial, sans-serif;font-size: 10px !important;table-layout:fixed !important;color: #000000;border-color: #000000;text-align: left;border-collapse: collapse;}
        //     #gridtable th {border-width: 1px;padding: 2px;border-style: solid;border-color: #000000;background-color: #dedede;}
        //     #gridtable td {height:14px;border-width: 1px;padding: 1px;border-style: solid;border-color: #000000;background-color: #ffffff;overflow:hidden !important;}
        //     #gridtable tr {page-break-inside: avoid;text-align: left;}#gridtable tr th {font-weight: 400 !important;text-align: left;}`
        // let printBox = document.getElementById("printBox")
        // let titler = document.getElementById("titler")
        // let pageHead = document.getElementById("pageHead")
        // let tabTHead = document.getElementById("tabTHead")
        // let pageFooter=document.getElementById("pageFooter")
        // // console.log(tabTHead,1111)
        // let gridtable = document.getElementById("gridtable")
        // //表格头部数组
        // let tableHeadArr = [
        //   {name: "序号", width: 40, height: 14},
        //   {name: "配件编码", key: "partCode", width: 90, height: 14},
        //   {name: "配件名称", key: "partName", width: 90, height: 14},
        //   {name: "OEM码", key: "oemCode", width: 85, height: 14},
        //   {name: "品牌", key: "partBrand", width: 50, height: 14},
        //   {name: "车型", key: "carModelName", width: 35, height: 14},
        //   {name: "规格", key: "spec", width: 35, height: 14},
        //   {name: "单位", key: "unit", width: 35, height: 14},
        //   {name: "数量", key: "orderQty", width: 35, height: 14},
        //   {name: "单价", key: "orderPrice", width: 50, height: 14},
        //   {name: "金额", key: "orderAmt", width: 65, height: 14},
        //   {name: "仓位", key: "storeShelf", width: 80, height: 14},
        // ]
        //   let argument = {
        //     style: tableStyle/**样式*/,
        //     tablePrint: gridtable/**表格打印部分的html内容*/,
        //     pageHead: pageHead/**页头内容*/,
        //     data: this.onelist.detailList/**表格数据*/,
        //     tableHeadArr: tableHeadArr/**表格头部数组*/,
        //     pageFooter: pageFooter/**打印页面带出页尾*/
        //   }
        // print(argument)
        // const printHtml = document.querySelector('#printBox').innerHTML; // 需要打印的内容
        // const newWin = window.open(`${this.$route.fullPath}`,"_blank")
        // body.innerHTML = newstr;
        // newWin.print();
        // newWin.close();
        // 打印完成后关闭
        // 1.设置要打印的区域 div的className
        var newstr = document.getElementById("printBox").innerHTML
        // 2. 还原：将旧的页面储存起来，当打印完成后返给给页面。
        var oldstr = document.body.innerHTML;
        // 3. 复制给body，并执行window.print打印功能
        let body = document.body
        body.style.overflow = 'visible'
        body.innerHTML = newstr;
        if (!!window.ActiveXObject || "ActiveXObject" in window) { //是否ie
          this.remove_ie_header_and_footer();
        }
        window.print();
        this.printShow = false
        body.innerHTML = oldstr;
        window.location.reload()
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
      async openModal() {
        let order = this.$store.state.dataList.oneOrder;
        if (order.id) {
          let data = {};
          data.id = order.id;
          let strName = ""
          let res = await getprintList(data);
          if (res.code === 0) {
            this.printShow = true;
            this.onelist = res.data;
          }
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
    width: 700px;
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
    padding: 2px;
    border-style: solid;
    border-color: #000000;
    background-color: #dedede;
  }

  table.gridtable td {
    border-width: 1px;
    padding: 1px;
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
