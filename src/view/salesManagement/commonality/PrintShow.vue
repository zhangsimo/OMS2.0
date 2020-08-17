<template>
  <Modal v-model="printShow" closable id="printBoxBig"  width="1030">
    <div id="printBox" style="height: 600px;page-break-after:always !important;">
      <div class="titler">
        <Row style="border: 1px #000000 solid;color:#000;">
          <Col span="16" class="pl10">
            <h5
              style="font-size: 20px;line-height: 44px;"
            >{{onelist.userCompany}}</h5>
          </Col>
          <Col span="8" class="pl10">
            <p style="font-weight: 600;font-size: 12px">销售订单:</p>
            <p style="font-size: 12px">No: {{onelist.serviceId}}</p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="16" class="pl10">
            <p>
              <span style="font-size: 12px">地址:</span>
              <span style="font-size: 12px">{{onelist.addr}}</span>
            </p>
            <p>
              <span style="font-size: 12px">电话:</span>
              <span style="font-size: 12px">{{onelist.tel}}</span>
            </p>
          </Col>
          <Col span="8" class="pl10">
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
          <Col span="10" class="pl10" style="border-right: 1px #000000 solid;">
            <p>
              <span style="font-size: 12px">客户:</span>
              <span style="font-size: 12px">{{onelist.guestName}}</span>
            </p>
            <p>
              <span style="font-size: 12px">地址:</span>
              <span style="font-size: 12px">{{onelist.guestAddr}}</span>
            </p>
          </Col>
          <Col span="4" class="pl10" style="border-right: 1px #000000 solid;">
            <p>
              <span style="font-size: 12px">联系人:</span>
              <span style="font-size: 12px">{{onelist.contactor}}</span>
            </p>
            <p>
              <span style="font-size: 12px">票据类型:</span>
              <span style="font-size: 12px">{{onelist.billTypeName}}</span>
            </p>
          </Col>
          <Col span="10" class="pl10">
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
            <th style="width:40px">序号</th>
            <th style="width:90px">配件编码</th>
            <th style="width:90px">配件名称</th>
            <th style="max-width:90px;white-space:nowrap;overflow: hidden;">OEM码</th>
            <th>品牌</th>
            <th style="max-width: 40px;overflow: hidden;white-space:nowrap;">车型</th>
            <th style="max-width:90px;white-space:nowrap;overflow: hidden;">规格</th>
            <th>单位</th>
            <th>数量</th>
            <th style="width:50px">单价</th>
            <th style="width:50px">金额</th>
            <th style="width:50px">仓位</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td style="width:40px">{{index + 1}}</td>
            <td style="width:90px">{{item.partCode}}</td>
            <td style="width:90px">{{item.partName}}</td>
            <td style="max-width: 80px;white-space:nowrap;overflow:hidden;">{{item.oemCode}}</td>
            <td>{{item.partBrand}}</td>
            <td style="max-width: 40px;overflow:hidden;white-space:nowrap;">{{item.carModelName}}</td>
            <td style="max-width:90px;white-space:nowrap;overflow: hidden;">{{item.spec}}</td>
            <td>{{item.unit}}</td>
            <td>{{item.orderQty}}</td>
            <td style="width:50px">{{item.orderPrice}}</td>
            <td style="width:50px">{{item.orderAmt}}</td>
            <td style="width:50px">{{item.storeShelf}}</td>
          </tr>
          </tbody>
        </table>

        <Row style="border: 1px #000000 solid;color:#000;">
          <Col class="pl10" span="8" style="border-right: 1px #000000 solid">
            <span>合计:</span>
            <span>{{ onelist.orderAmt | toChies}}</span>
          </Col>
          <Col class="pl10" span="8" style="border-right: 1px #000000 solid">
            <span>总数:</span>
            <span>{{onelist.orderQty}}</span>
          </Col>
          <Col class="pl10" span="8">
            <span>合计:</span>
            <span>{{onelist.orderAmt}}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="6" class="pl10" style="border-right: 1px #000000 solid">
            <span>制单人:</span>
            <span>{{onelist.orderMan}}</span>
          </Col>
          <Col span="6" class="pl10" style="border-right: 1px #000000 solid">
            <span>提交人:</span>
            <span>{{onelist.auditor}}</span>
          </Col>
          <Col span="6" class="pl10" style="border-right: 1px #000000 solid">
            <span>送货人:</span>
            <span>{{onelist.deliverer}}</span>
          </Col>
          <Col span="6" class="pl10">
            <span>收货人:</span>
            <span>{{onelist.receiver}}</span>
          </Col>
        </Row>
        <p style="border: 1px #000000 solid;border-top: none;color:#000;" class="pl10">
          备 注：
          <span>{{onelist.remark}}</span>
        </p>
        <p style="color:#000;"
           class="pl10"
        >兹收到上列货物完整无缺，所有电器配件货物出门概不退货，灯，胶，玻璃等易碎货品必须当面检验清楚，事后概不负责！此单据一经客户或其代理人签名，将作为客户欠款凭证，特此声明！</p>
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
        let parent = document.getElementById("parent2")
        let route = document.getElementById("routes")
        let footer = document.getElementById("footer")
        let printBox=document.getElementById("printBox")
        let printBoxBig=document.getElementById("printBoxBig")

        // 1.设置要打印的区域 div的className
        // var newstr = document.getElementById("printBox").innerHTML
        // 2. 还原：将旧的页面储存起来，当打印完成后返给给页面。
        // var oldstr = document.body.innerHTML;
        // 3. 复制给body，并执行window.print打印功能
        // let body = document.body
        // body.style.overflow = 'visible'
        // body.innerHTML = newstr;
        parent.style.display = "none"
        route.style.display = "none"
        footer.style.display = "none"
        // printBoxBig.style.display="none"
        // this.printShow=false;
        printBox.style.position="fixed";
        printBox.style.top="0"
        printBox.style.left="0"
        printBox.style.width = "100%"
        printBox.style.height = "100%"
        printBox.style.display = "flex"
        if (!!window.ActiveXObject || "ActiveXObject" in window) { //是否ie
          this.remove_ie_header_and_footer();
        }
        window.frames.print();
        // console.log(window.frames,11133333)
        // this.printShow=true;
        parent.style.display = "flex"
        route.style.display = "flex"
        footer.style.display = "block"
        printBox.style.position="";
        printBox.style.width="1000";
        printBox.style.height="600";
        printBox.style.margin="0 auto";
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
    width: 1000px;
    margin: 0 auto;
    overflow: hidden;
    overflow-y: scroll;

    .titler {
      padding-left: 10px;
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

  //表格样式
  table.gridtable {
    width: 100%;
    font-family: verdana, arial, sans-serif;
    font-size: 12px !important;
    color: #000000;
    border-width: 1px;
    border-color: #000000;
    text-align: left;
    border-collapse: collapse;
  }

  table.gridtable th {
    border-width: 1px;
    padding: 4px;
    border-style: solid;
    border-color: #000000;
    background-color: #dedede;
  }

  table.gridtable td {
    border-width: 1px;
    padding: 4px;
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
