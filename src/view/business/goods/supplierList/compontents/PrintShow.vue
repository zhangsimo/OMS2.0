<template>
  <Modal v-model="printShow" width="1300" closable>
    <div id="printBox" style="height: 600px">
      <div class="titler">
        <Row style="border: 1px #000000 solid">
          <Col span="12" class="pl10">
            <h5 style="font-size: 20px;line-height: 44px;border-right: 1px #000000 solid">
              {{ onelist.orgName }}
            </h5>
          </Col>
          <Col span="12" class="pl10">
            <p>采购退货单:</p>
            <p>No: {{ onelist.serviceId }}</p>
          </Col>
        </Row>
        <Row class="pt10 pd10" style="border: 1px #000000 solid;border-top: none">
          <Col span="12" class="pl10" style="border-right: 1px #000000 solid">
            <p><span>地址: {{ onelist.orgAddress }}</span></p>
            <p><span>电话: {{ onelist.orgTel }}</span></p>
          </Col>
          <Col span="12" class="pl10">
            <p>
              <span>订单日期:</span><span>{{ onelist.orderDate }}</span>
            </p>
            <p>
              <span>打印日期:</span>
              <span>{{ onelist.printDate }}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none">
          <Col span="8" class="pl10" style="border-right: 1px #000000 solid">
            <p>
              <span>供应商:</span> <span>{{ onelist.guestName }}</span>
            </p>
            <p>
              <span>地址:</span> <span>{{ onelist.guestAddress }}</span>
            </p>
          </Col>
          <Col span="8" class="pl10" style="border-right: 1px #000000 solid">
            <p>
              <span>联系人:</span> <span>{{ onelist.contactor }}</span>
            </p>
            <p>
              <span>退货原因:</span><span>{{ onelist.rtnReasonName }}</span>
            </p>
          </Col>
          <Col span="8" class="pl10">
            <p>
              <span>联系电话:</span><span>{{ onelist.guestTel }}</span>
            </p>
            <p>
              <span>结算方式:</span><span>{{ onelist.settleTypeName }}</span>
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
          :data="details"
          class="ml10"
        ></Table>
        <Row style="border: 1px #000000 solid">
          <Col class="pl10" span="12" style="border-right: 1px #000000 solid">
            <span>合计:</span>
            <span>{{ totalsPrice | toChies }}</span>
          </Col>
          <!--<Col class="pl10" span="8" style="border-right: 1px #000000 solid">-->
            <!--<span>总数:</span>-->
            <!--<span>{{ onelist.orderQty }}</span>-->
          <!--</Col>-->
          <Col class="pl10" span="12">
            <span>合计:</span>
            <span>{{ totalsPrice|priceFilters }}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none">
          <Col span="6" class="pl10" style="border-right: 1px #000000 solid">
            <span>制单人:</span>
            <span>{{ onelist.orderMan }}</span>
          </Col>
          <Col span="6" class="pl10" style="border-right: 1px #000000 solid">
            <span>送货人:</span>
            <span>{{ onelist.deliverer }}</span>
          </Col>
          <Col span="6" class="pl10">
            <span>收货人:</span>
            <span>{{ onelist.receiver }}</span>
          </Col>
        </Row>
      </div>

      <div></div>
    </div>
    <div slot="footer">
      <Button type="success" @click="print">打印</Button>
      <Button type="default" @click="printShowfalse">取消</Button>
    </div>
  </Modal>
</template>

<script>
  import * as api from "_api/procurement/plan";
  import * as tools from "../../../../../utils/tools";
  import { print } from '../../../../../api/business/supplierListApi';

  export default {
    name: "PrintShow",
    props: ['orderId'],
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
            align: "center",
            render:(h,p) => {
              return h('span',(p.row.orderQty*p.row.orderPrice).toFixed(2))
            }
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
        details: [],
        num: "12323.09",
        num2: 78723
      };
    },
    computed:{
      totalsPrice(){
        let arrData = this.details||[]
        let total = arrData.reduce((total, num)=> {
            return total+(num.orderQty*num.orderPrice)
          },0
        )
        return total
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
        if (this.orderId) {
          let res = await print({id:this.orderId});
          if (res.code === 0) {
            this.printShow = true;
            this.onelist = res.data;
            // this.onelist.printDate = tools.transTime(new Date());
            this.details = res.data.details;
          }
        } else {
          this.$message.error("至少选择一条信息");
        }
      },
      //取消
      printShowfalse(){
        this.printShow = false
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
</style>
