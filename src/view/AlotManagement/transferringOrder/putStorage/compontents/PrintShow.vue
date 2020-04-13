<template>
  <Modal v-model="printShow" width="1300" closable>
    <div id="printBox" style="height: 600px">
      <div class="titler">
        <Row style="border: 1px #000000 solid">
          <Col span="12" class="pl10">
            <h5
              style="font-size: 20px;line-height: 44px;border-right: 1px #000000 solid"
            >{{onelist.guestVO.fullName}}</h5>
          </Col>
          <Col span="12" class="pl10">
            <p>调拨入库单</p>
            <p>No: {{onelist.enterOrder.serviceId}}</p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none">
          <Col span="12" class="pl10" style="border-right: 1px #000000 solid">
            <p>
              <span>地址:{{onelist.guestVO.addr || onelist.guestVO.streetAddress}}</span>
            </p>
            <p>
              <span>电话:{{onelist.guestVO.tel}}</span>
            </p>
          </Col>
          <Col span="12" class="pl10">
            <p>
              <span>订单日期:</span>
              <span>{{onelist.enterOrder.orderDate}}</span>
            </p>
            <p>
              <span>打印日期:</span>
              <span>{{printDate}}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none">
          <Col span="8" class="pl10" style="border-right: 1px #000000 solid">
            <p>
              <span>调出方:</span>
              <span>{{onelist.applyGuest.fullName}}</span>
            </p>
            <p>
              <span>地址:</span>
              <span>{{onelist.applyGuest.addr || onelist.applyGuest.streetAddress}}</span>
            </p>
          </Col>
          <Col span="8" class="pl10" style="border-right: 1px #000000 solid">
            <p>
              <span>联系人:</span>
              <span>{{onelist.applyGuest.contactor}}</span>
            </p>
            <p>
              <span>入库仓库:</span>
              <span>{{onelist.store.name}}</span>
            </p>
          </Col>
          <Col span="8" class="pl10">
            <p>
              <span>联系电话:</span>
              <span>{{onelist.applyGuest.tel}}</span>
            </p>
            <p>
              <span>备注:</span>
              <span>{{onelist.enterOrder.remark}}</span>
            </p>
          </Col>
        </Row>
        <Table
          resizable
          size="small"
          style="margin: 0 auto"
          width="990"
          border
          :columns="columns2"
          :data="onelist.enterOrder.voList"
          class="ml10"
        ></Table>
        <Row style="border: 1px #000000 solid">
          <Col class="marginLeft" span="8">
            <span>合计:</span>
            <span>{{totalQty}}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none">
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
          key: "carBrandName",
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
          key: "applyQty",
          align: "center"
        },
        {
          title: "备注",
          key: "remark",
          align: "center"
        }
      ],
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
      var newstr = document.getElementById("printBox").innerHTML;
      // 2. 还原：将旧的页面储存起来，当打印完成后返给给页面。
      var oldstr = document.body.innerHTML;
      // 3. 复制给body，并执行window.print打印功能
      document.body.innerHTML = newstr;
      window.print();
      // 重新加载页面，以刷新数据
      window.location.reload();
      document.body.innerHTML = oldstr;
    },
    async openModal() {
      if (this.curenrow.id) {
        let data = {};
        data["id"] = this.curenrow.id;
        let res = await getprintList(data);
        if (res.code == 0) {
          this.printShow = true;
          this.onelist = res.data;
          console.log(this.onelist)
          this.totalQty = this.onelist.enterOrder.voList.reduce((total, curr) => total += parseInt(curr.applyQty), 0);
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
</style>
