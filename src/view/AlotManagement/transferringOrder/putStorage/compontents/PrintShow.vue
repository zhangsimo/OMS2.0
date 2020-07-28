<template>
  <Modal v-model="printShow" width="1300" closable>
    <div id="printBox" style="height: 600px">
      <div class="titler">
        <Row style="border: 1px #000000 solid;color:#000;">
          <Col span="16" class="pl10">
            <h5
              style="font-size: 20px;line-height: 44px;"
            >{{onelist.guestVO.fullName}}</h5>
          </Col>
          <Col span="8" class="pl10">
            <p style="font-weight: 600;font-size: 12px">调拨入库单</p>
            <p style="font-size: 12px">No: {{onelist.enterOrder.serviceId}}</p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="16" class="pl10">
            <p>
              <span style="font-size: 12px">地址:{{onelist.guestVO.addr || onelist.guestVO.streetAddress}}</span>
            </p>
            <p>
              <span style="font-size: 12px">电话:{{onelist.guestVO.tel}}</span>
            </p>
          </Col>
          <Col span="8" class="pl10">
            <p>
              <span style="font-size: 12px">订单日期:</span>
              <span style="font-size: 12px">{{onelist.enterOrder.orderDate}}</span>
            </p>
            <p>
              <span style="font-size: 12px">打印日期:</span>
              <span style="font-size: 12px">{{printDate}}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="10" class="pl10" style="border-right: 1px #000000 solid">
            <p>
              <span style="font-size: 12px">调出方:</span>
              <span style="font-size: 12px">{{onelist.applyGuest.fullName}}</span>
            </p>
            <p>
              <span style="font-size: 12px">地址:</span>
              <span style="font-size: 12px">{{onelist.applyGuest.addr || onelist.applyGuest.streetAddress}}</span>
            </p>
          </Col>
          <Col span="4" class="pl10" style="border-right: 1px #000000 solid">
            <p>
              <span style="font-size: 12px">联系人:</span>
              <span style="font-size: 12px">{{onelist.applyGuest.contactor}}</span>
            </p>
            <p>
              <span style="font-size: 12px">入库仓库:</span>
              <span style="font-size: 12px">{{onelist.store.name}}</span>
            </p>
          </Col>
          <Col span="10" class="pl10">
            <p>
              <span style="font-size: 12px">联系电话:</span>
              <span style="font-size: 12px">{{onelist.applyGuest.tel}}</span>
            </p>
            <Row>
              <Col span="12">
                <p>
                  <span style="font-size: 12px">备注:</span>
                  <span style="font-size: 12px">{{ onelist.remark }}</span>
                </p>
              </Col>
              <Col span="12">
                <p>
                  <span style="font-size: 12px">出库仓库:</span>
                  <span style="font-size: 12px">{{onelist.storeName}}</span>
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
<!--        <Table-->
<!--          resizable-->
<!--          size="small"-->
<!--          style="margin: 0 auto"-->
<!--          width="990"-->
<!--          border-->
<!--          :columns="columns2"-->
<!--          :data="onelist.enterOrder.voList"-->
<!--          class="ml10"-->
<!--        ></Table>-->
        <table class="gridtable">
          <thead>
          <tr>
            <th style="width:40px">序号</th>
            <th style="width:90px">配件编码</th>
            <th style="width:90px">配件名称</th>
            <th style="max-width:90px;white-space:nowrap;overflow: hidden;">OEM码</th>
            <th>品牌</th>
            <th style="max-width: 40px;overflow: hidden;white-space:nowrap;">车型</th>
            <th>规格	</th>
            <th>单位	</th>
            <th>数量</th>
            <th style="width:50px">单价</th>
            <th style="width:50px">金额</th>
            <th style="width:50px">仓位</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.enterOrder.voList" :key="index">
            <td style="width:40px">{{index + 1}}</td>
            <td style="width:90px">{{item.partCode}}</td>
            <td style="width:90px">{{item.partName}}</td>
            <td style="max-width: 80px;white-space:nowrap;overflow:hidden;">{{item.oemCode}}</td>
            <td>{{item.partBrand}}</td>
            <td style="max-width: 40px;overflow:hidden;white-space:nowrap;">{{item.carModelName}}</td>
            <td>{{item.spec}}</td>
            <td>{{item.unit}}</td>
            <td>{{item.orderQty}}</td>
            <td style="width:50px">{{item.orderPrice}}</td>
            <td style="width:50px">{{item.orderAmt}}</td>
            <td style="width:50px">{{item.storeShelf}}</td>
          </tr>
          </tbody>
        </table>
        <Row style="border: 1px #000000 solid;color:#000;">
          <Col class="marginLeft" span="8">
            <span>合计:</span>
            <span>{{totalQty}}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;color:#000;">
          <Col span="8" class="pl10" style="border-right: 1px #000000 solid">
            <span>制单人:</span>
            <span>{{username}}</span>
          </Col>
          <Col span="8" class="pl10" style="border-right: 1px #000000 solid">
            <span>送货人:</span>
            <span></span>
          </Col>
          <Col span="8" class="pl10">
            <span>收货人:</span>
            <span></span>
          </Col>
        </Row>
      </div>
      <div></div>
    </div>
    <div slot="footer">
      <Button type="success" @click="print">打印</Button>
      <Button type="default" @click="printShow = false">取消</Button>
    </div>
  </Modal>
</template>

<script>
import * as tools from "_utils/tools";
import { getprintList } from "@/api/AlotManagement/putStorage.js";
export default {
  name: "PrintShow",
  data() {
    return {
      username: JSON.parse(sessionStorage.getItem("vuex")).user.userData.staffName,
      totalQty: 0,
      printDate: tools.transTime(new Date()),
      printShow: false, //模态框隐藏
      // columns2: [
      //   {
      //     title: "序号",
      //     type: "index",
      //     align: "center"
      //   },
      //   {
      //     title: "配件编码",
      //     key: "partCode",
      //     align: "center"
      //   },
      //   {
      //     title: "配件名称",
      //     key: "partName",
      //     align: "center"
      //   },
      //   {
      //     title: "品牌",
      //     key: "partBrand",
      //     align: "center"
      //   },
      //   {
      //     title: "品牌车型",
      //     key: "carBrandName",
      //     align: "center"
      //   },
      //   {
      //     title: "规格",
      //     key: "spec",
      //     align: "center"
      //   },
      //   {
      //     title: "单位",
      //     key: "unit",
      //     align: "center"
      //   },
      //   {
      //     title: "数量",
      //     key: "applyQty",
      //     align: "center"
      //   },
      //   {
      //     title: "备注",
      //     key: "remark",
      //     align: "center"
      //   }
      // ],
      onelist: {}, //打印数据
      num: "0",
      num2: 0
    };
  },
  props: {
    curenrow: {
      type: Object,
      default: function() {
        return {};
      }
    }
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
      if (this.curenrow.id) {
        let data = {};
        data["id"] = this.curenrow.id;
        let res = await getprintList(data);
        if (res.code == 0) {
          this.printShow = true;
          this.onelist = res.data;
          this.totalQty = this.onelist.enterOrder.voList.reduce((total, curr) => total += parseInt(curr.applyQty), 0);
          if(this.onelist.enterOrder.voList==[] || this.onelist.enterOrder.voList==undefined){
            this.onelist.storeName=""
          }else{
            this.onelist.enterOrder.voList.map((item,index)=>{
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
.marginLeft {
  margin-left: 460px;
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
  font-size:12px !important;
  color:#000000;
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
  page-break-inside:avoid;
}
table.gridtable tr th{
  font-weight: 400 !important;
}
</style>
