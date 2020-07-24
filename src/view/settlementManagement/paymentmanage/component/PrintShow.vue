<template>
  <Modal v-model="printShow" width="1300" closable>
    <div id="printBox" style="height: 600px">
      <div class="titler">
        <Row style="border: 1px #000000 solid">
          <Col span="12" class="pl10" style="line-height: 24px">
            <h5
              style="font-size: 20px;line-height: 44px;border-right: 1px #000000 solid"
            >{{onelist.orgName || ' '}}</h5>
          </Col>
          <Col span="12" class="pl10">
            <p>{{title}}:</p>
            <p>No: {{onelist.serviceId}}</p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none">
          <Col span="12" class="pl10" style="border-right: 1px #000000 solid">
            <p>
              <span>地址:</span>
              <span>{{onelist.orgAddress || ' '}}</span>
            </p>
            <p>
              <span>电话:</span>
              <span>{{onelist.orgTel || ' '}}</span>
            </p>
          </Col>
          <Col span="12" class="pl10">
            <p>
              <span>创建日期:</span>
              <span>{{onelist.creationDate || ' '}}</span>
            </p>
            <p>
              <span>打印日期:</span>
              <span>{{onelist.printDate}}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none">
          <Col span="8" class="pl10" style="border-right: 1px #000000 solid">
            <p>
              <span>供应商:</span>
              <span>{{onelist.guestName}}</span>
            </p>
            <p>
              <span>地址:</span>
              <span>{{onelist.guestAddress}}</span>
            </p>
          </Col>
          <Col span="8" class="pl10" style="border-right: 1px #000000 solid">
            <p>
              <span>联系人:</span>
              <span>{{onelist.contactPerson}}</span>
            </p>
            <p>
              <span>票据类型:</span>
              <span>{{onelist.ticketTypeName}}</span>
            </p>
          </Col>
          <Col span="8" class="pl10">
            <p>
              <span>联系电话:</span>
              <span>{{onelist.personTel}}</span>
            </p>
            <p>
              <span>结算方式:</span>
              <span>{{onelist.settlementMethodName}}</span>
            </p>
          </Col>
        </Row>
<!--        <Table-->
<!--          resizable-->
<!--          size="small"-->
<!--          style="margin: 0 auto"-->
<!--          width="990"-->
<!--          border-->
<!--          :columns="columns2"-->
<!--          :data="onelist.orderDetailList"-->
<!--          class="ml10"-->
<!--        ></Table>-->
        <table class="gridtable">
          <thead>
          <tr>
            <th>序号</th>
            <th>配件编码</th>
            <th>配件名称</th>
            <th>品牌</th>
            <th>品牌车型</th>
            <th>规格	</th>
            <th>单位	</th>
            <th>数量</th>
            <th>单价</th>
            <th>金额</th>
            <th>仓库	</th>
            <th>仓位</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.orderDetailList" :key="index">
            <td>{{index + 1}}</td>
            <td>{{item.partCode}}</td>
            <td>{{item.partName}}</td>
            <td>{{item.partBrand}}</td>
            <td>{{item.carModelName}}</td>
            <td>{{item.spec}}</td>
            <td>{{item.unit}}</td>
            <td>{{item.orderQty}}</td>
            <td>{{item.orderPrice}}</td>
            <td>{{item.orderAmt}}</td>
            <td>{{item.storeName}}</td>
            <td>{{item.storeShelf}}</td>
          </tr>
          </tbody>
        </table>
        <Row style="border: 1px #000000 solid">
          <Col class="pl10" span="8" style="border-right: 1px #000000 solid">
            <span>合计:</span>
            <span>{{ onelist.totalAmt | toChies}}</span>
          </Col>
          <Col class="pl10" span="8" style="border-right: 1px #000000 solid">
            <span>总数:</span>
            <span>{{onelist.totalNumber }}</span>
          </Col>
          <Col class="pl10" span="8">
            <span>合计:</span>
            <span>{{onelist.totalAmt}}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none">
          <Col span="8" class="pl10" style="border-right: 1px #000000 solid">
            <span>制单人:</span>
            <span>{{onelist.createName}}</span>
          </Col>

          <Col span="8" class="pl10" style="border-right: 1px #000000 solid">
            <span>送货人:</span>
            <span>{{onelist.deliveryMan}}</span>
          </Col>
          <Col span="8" class="pl10">
            <span>收货人:</span>
            <span>{{onelist.receiver}}</span>
          </Col>
        </Row>
        <p style="border: 1px #000000 solid;border-top: none" class="pl10">
          备 注：
          <span>{{onelist.remark}}</span>
        </p>
      </div>

      <div></div>
    </div>
    <div slot="footer">
      <Button type="success" @click="print">打印</Button>
      <Button type="default" @click="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
import { Printing } from "@/api/bill/saleOrder";

export default {
  name: "PrintShow",
  props: { title: "" },
  data() {
    return {
      printShow: false, //模态框隐藏
      columns2: [
        {
          title: "序号",
          type: "index",
          width: 40,
          className: "tc"
        },
        {
          title: "配件编码",
          key: "partCode",
          className: "tc"
        },
        {
          title: "配件名称",
          key: "partName",
          className: "tc"
        },
        {
          title: "配件规格",
          key: "specification",
          className: "tc"
        },
        {
          title: "配件车型",
          key: "carModel",
          className: "tc"
        },
        {
          title: "配件品牌",
          key: "partBrand",
          className: "tc"
        },
        {
          title: "配件厂牌",
          key: "factoryBrand",
          className: "tc"
        },
        {
          title: "OEM码",
          key: "oemCode",
          className: "tc"
        },
        {
          title: "税率",
          key: "taxRate",
          className: "tc"
        },
        {
          title: "数量",
          key: "qty",
          className: "tc"
        },
        {
          title: "单位",
          key: "unitId",
          className: "tc"
        },
        {
          title: "单价",
          key: "price",
          className: "tc"
        },
        {
          title: "金额",
          key: "orderAmt",
          className: "tc"
        },
        {
          title: "备注",
          key: "remark",
          className: "tc"
        }
      ],
      onelist: {} //打印数据
    };
  },
  methods: {
    //打印
    print() {
      // 1.设置要打印的区域 div的className
      var newstr = document.getElementById("printBox").innerHTML
      // 2. 还原：将旧的页面储存起来，当打印完成后返给给页面。
      // var oldstr = document.body.innerHTML;
      // 3. 复制给body，并执行window.print打印功能
      let body = document.body
      body.style.overflow = 'visible'
      body.innerHTML = newstr;
      window.print();
      // 重新加载页面，以刷新数据
      window.location.reload();
      // document.body.innerHTML = oldstr;
    },
    async openModal() {
      this.printShow = true;
      let arr = [];
      if (this.title === "销售出库") {
        arr = this.$parent.data3[0];
      } else if (this.title === "采购入库") {
        arr = this.$parent.data4[0];
      }
      let data = {
        orderCode: arr.orderCode,
        orderType: arr.orderType,
        orgId: arr.orgId,
        guestId: arr.guestId
      };
      let res = await Printing(data);
      res.data.orderDetailList.map((item, index) => {
        item.num = index + 1;
      });
      if (res.code === 0) {
        this.onelist = res.data;
      }
    },
    close() {
      this.printShow = false;
    }
  }
};
</script>

<style scoped lang="less">
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
  font-family: verdana,arial,sans-serif;
  font-size:11px;
  color:#000000;
  border-width: 1px;
  border-color: #000000;
  text-align: center;
  border-collapse: collapse;
}
table.gridtable th {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #000000;
  background-color: #dedede;
}
table.gridtable td {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #000000;
  background-color: #ffffff;
}
table.gridtable tr {
  page-break-inside:avoid;
}
</style>
