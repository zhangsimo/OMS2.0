<template>
  <Modal v-model="searchPartLayer" title="已入库的调拨入库单" width="1000" @on-ok="ok">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr10">
            <span>快速查询:</span>
          </div>
          <div class="db mr10">
            <span class>入库日期从：</span>
            <DatePicker v-model="penSalesData.allotEnterTime" type="daterange" style="width:120px"></DatePicker>
          </div>
          <div class="db mr10">
            <span>调 出 方 ：</span>
            <Input v-model="penSalesData.guestName" style="width: 398px" />
            <!-- <Select
              placeholder="请选择调出方！"
              v-model="penSalesData.guestName"
              filterable
              style="width: 400px"
              @on-change="getSupplierNamea1"
            >
              <Option v-for="item in ArrayValue" :value="item.id" :key="item.id">{{ item.fullName }}</Option>
            </Select> -->
            <Button @click="getName" class="ml5" size="small" type="default">
              <i class="iconfont iconxuanzetichengchengyuanicon"></i>
            </Button>
          </div>
          <div class="db mr10">
            <Input
              v-model="penSalesData.serviceId"
              placeholder="入库单号"
              style="width: 160px"
              class="mr10"
            ></Input>
          </div>
          <div class="db mr10">
            <Button @click="search(pageList.size, pageList.page)" type class="mr20">查询</Button>
          </div>
          <div class="db mr10 btn">
            <Button @click="ok" type="warning" class="mr20">选入</Button>
          </div>
          <div class="db mr10 btn">
            <Button @click="init1" type="warning" class="mr20">取消</Button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <!--上表格-->
      <div class="topTableDate">
        <vxe-table
          auto-resize
          border
          resizable
          ref="xtale"
          size="mini"
          height="200"
          align="center"
          :data="tabList"
          highlight-current-row
          highlight-hover-row
          @current-change="selectTabelData"
          :radio-config="{ trigger: 'row' }"
        >
          <vxe-table-column type="radio" title="选择" width="100"></vxe-table-column>
          <vxe-table-column type="seq" width="100" title="序号"></vxe-table-column>
          <!-- <vxe-table-column field="name" title="客户" width="100"></vxe-table-column> -->
          <vxe-table-column field="serviceId" title="入库单号"></vxe-table-column>
          <vxe-table-column field="guestName" title="调出方"></vxe-table-column>
          <vxe-table-column field="finishDate" title="入库日期"></vxe-table-column>
          <vxe-table-column field="code" title="申请单号"></vxe-table-column>
          <vxe-table-column field="remark" title="备注"></vxe-table-column>
        </vxe-table>
      </div>

      <!--     分页-->
      <Row class="mt10 mb10">
        <Col span="12" offset="12" style="text-align:right">
          <div>
            <Page
              :current="pageList.page"
              :total="tabList.length"
              :page-size="pageList.pageSize"
              :page-size-opts="pageList.pageSizeOpts"
              show-sizer
              @on-change="changePage"
              @on-page-size-change="changeSize"
            />
          </div>
        </Col>
      </Row>
      <!--        下表格-->
      <div class="bottomTableDate">
        <vxe-table auto-resize border resizable height="150" :data="currentData">
          <vxe-table-column type="seq" title="序号"></vxe-table-column>
          <vxe-table-column field="partCode" title="配件编码"></vxe-table-column>
          <vxe-table-column field="partName" title="配件名称" width="100"></vxe-table-column>
          <vxe-table-column field="partBrand" title="品牌"></vxe-table-column>
          <vxe-table-column field="oemCode" title="OE码"></vxe-table-column>
          <vxe-table-column field="unit" title="单位"></vxe-table-column>
          <vxe-table-column field="carBrandName" title="品牌车型"></vxe-table-column>
          <vxe-table-column field="hasInQty" title="入库数量"></vxe-table-column>
          <vxe-table-column field="remark" title="备注"></vxe-table-column>
        </vxe-table>
      </div>
    </section>
    <div slot="footer"></div>
  </Modal>
</template>

<script >
// import '@/view/lease/product/lease.less'
// import '@/view/goods/goodsList/goodsList.less'
import { findForAllot } from "_api/purchasing/purchasePlan";
import { chengpingDetail } from "@/api/AlotManagement/twoBackApply.js";
import moment from "moment";
export default {
  data() {
    return {
      searchPartLayer: false,
      ArrayValue: [],
      // 日期数据
      options1: [],
      tabList: [],
      // 调出方查询
      penSalesData: {
        allotEnterTime: [], //申请单号
        allotEnterTimeStart: "",
        allotEnterTimeEnd: "",
        guestName: "",
        guestId: "",
        serviceId: ""
      },
      customerListOptions: [], //调出方下拉列表
      tableData: [{ name1: "123" }, {}, {}, {}],
      TopTableData: [], //上侧表格list
      BottomTableData: [], //下侧表格list
      // 分页数据
      pageList: {
        page: 1,
        total: 0,
        size: 10,
        pageSize: 50,
        pageSizeOpts: [50, 100, 150, 200]
      },
      xuanzhognList: [],
      checkRow: null,
      currentData: [],
      code: "",
      codeId: "",
    };
  },
  watch: {
    tbdata: {
      handler(newVal) {
        this.tabList = newVal;
      },
      deep: true
    },
    dcList: {
      handler(newVal) {
        this.diaochuList = newVal;
      },
      deep: true
    },
    dcName: {
      handler(newVal) {
        this.penSalesData.guestName = newVal;
      },
      deep: true
    },
    dcId: {
      handler(newVal) {
        this.penSalesData.guestId = newVal;
      },
      deep: true
    }
  },
  props: {
    tbdata: {
      type: Array,
      default: function() {
        return [];
      }
    },
    dcList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    dcName: {
      type: String,
      default: ""
    },
    dcId: {
      type: String,
      default: ""
    }
  },
  methods: {
    getSupplierNamea1(a) {
      this.penSalesData.guestId = a;
      // console.log(this.moreData.orderMan, "this.moreData.orderMan");
    },
    getArrayParams() {
      this.checkRow == null;
      var req = {};
      req.page = 1;
      req.size = 20;
      findForAllot(req).then(res => {
        if (res.code === 0) {
          this.ArrayValue = res.data.content;
        }
      });
    },
    //分页
    changePage(p) {
      this.pageList.page = p;
      this.search(this.pageList.size, p);
    },
    changeSize(size) {
      this.pageList.size = size;
      this.search(size, this.pageList.page);
    },
    getName() {
      this.$emit("getName", 2);
    },
    init() {
      this.searchPartLayer = true;
      this.penSalesData.allotEnterTime = [];
      this.penSalesData.allotEnterTimeStart = "";
      this.penSalesData.allotEnterTimeEnd = "";
      this.penSalesData.guestName = "";
      this.penSalesData.guestId = "";
      this.penSalesData.serviceId = "";
      this.checkRow = null;
      this.getArrayParams();
    },
    init1() {
      this.searchPartLayer = false;
      this.penSalesData.allotEnterTime = [];
      this.penSalesData.allotEnterTimeStart = "";
      this.penSalesData.allotEnterTimeEnd = "";
      this.penSalesData.guestName = "";
      this.penSalesData.guestId = "";
      this.penSalesData.serviceId = "";
      this.checkRow = null;
      this.getArrayParams();
    },
    //选中的日期
    selectDate(date) {
      this.penSalesData.option1 = date;
    },
    //搜索
    search(size, num) {
      this.checkRow == null;
      if (this.penSalesData.allotEnterTime[0]) {
        this.penSalesData.allotEnterTimeStart = moment(
          this.penSalesData.allotEnterTime[0]
        ).format("YYYY-MM-DD HH:mm:ss");
        this.penSalesData.allotEnterTimeEnd = moment(
          this.penSalesData.allotEnterTime[1]
        ).format("YYYY-MM-DD 23:59:59");
      }
      for (var k in this.penSalesData) {
        if (!this.penSalesData[k]) {
          delete this.penSalesData[k];
        }
      }
      delete this.penSalesData.allotEnterTime;
      this.$emit("search21", this.penSalesData, size, num);
    },
    getParams() {
      this.$emit("getLisw", this.penSalesData);
    },
    //确定
    chose() {
      // 将选中的行添加到下面
      // this.bData.push(this.checkRow)
    },
    //取消
    cancel() {},
    echoDate() {},
    async selectTabelData({ row }) {
      console.log(row, "row  ==>272");
      this.checkRow = row;
      this.codeId = row.codeId;
      this.code = row.code;
      const params = {
        mainId: row.id
      };
      const res = await chengpingDetail(params);
      this.currentData = res.data;
    },
    selectTabelData1() {
      console.log(122);
    },
    ok() {
      // 将选好的成品传父组件
      const sendList = this.$refs.xtale.getSelectRecords();
      if (this.checkRow == null) {
        this.$Message.info("请勾选需要选入的行");
        return;
      } else {
        this.$emit("ok", this.currentData, this.checkRow, this.codeId, this.code);
        this.searchPartLayer = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.wlf {
  margin-bottom: 10px;
  .abd {
    padding-top: 18px;
    margin-right: -15px;
  }
  .abc {
    margin-right: 15px;
  }
  .btn {
    margin-right: 0px;
  }
}
.goods-list-form {
  * {
    font-size: 12px !important;
  }
  .ivu-form-item {
    margin-bottom: 0px;
  }
  .plan-cz-btn {
    border-top: 1px solid #ddd;
    margin-top: 6px;
    justify-content: space-between;
    padding: 8px 10px 4px;
    align-items: center;
  }
  .t-price {
    white-space: nowrap;
  }
}
//lease
.lease-model-body {
  height: 400px;
  border: 1px solid #ddd;
  .model-left-hd {
    border-bottom: 1px solid #ddd;
    padding: 10px;
    min-width: 300px;
  }
  .ivu-split-pane {
    overflow: auto;
  }
  .ivu-tree {
    min-width: 300px;
    padding: 10px;
  }
}

.ivu-modal {
  top: 50px;
}

.con-split {
  & * {
    font-size: 12px;
  }
  .pane-made-hd {
    height: 30px;
    background-color: #f8f8f8;
    line-height: 30px;
    border: 1px solid #ddd;
    border-bottom: 0;
    padding: 0 9px;
    color: #333;
    font-size: 12px;
    font-weight: bold;
  }
  .right-pane {
    border-right: 1px solid #ddd;
    .pane-made-hd {
      border-right: 0;
    }
  }
}

.purchase {
  padding-top: 10px;
  border-top: 1px solid #ddd;
}

.purchase-label {
  width: 86px;
  display: inline-block;
  text-align: right;
  margin-bottom: 10px;
  line-height: 30px;
}

.con-datadictionary-split {
  & * {
    font-size: 14px;
  }
  .pane-made-hd {
    height: 40px;
    background-color: #f8f8f8;
    line-height: 40px;
    border: 1px solid #ddd;
    border-right: 0px;
    border-left: 0px;
    padding: 0 9px;
    color: #333;
    font-size: 14px;
    font-weight: bold;
  }
  .con-split-pane-left {
    border-left: 1px solid #ddd;
    .data-dic-wrap {
      min-width: 300px;
      border: 1px solid #e8e8e8;
      margin: 0 10px;
      .ivu-tree {
        & > ul > li {
          position: relative;
          margin: 0;
          padding: 0 10px;

          &:after {
            background: #f8f8f8;
            content: "";
            position: absolute;
            left: 0px;
            top: 0px;
            width: 100%;
            height: 32px;
            z-index: 0;
            border-bottom: 1px solid #e8e8e8;
          }
          & > span,
          & > label,
          & > div {
            z-index: 2;
            position: relative;
          }
        }
        ul {
          li {
            margin: 0px;
          }
        }
      }
      .data-dic-th {
        width: 95%;
        span {
          text-align: center;
          line-height: 30px;
          display: inline-block;
          width: 200px;

          &:last-child {
            border-right: none;
          }
          &:first-child {
            width: 400px;
          }
        }
      }
      .data-dic-th2 {
        span {
          background: none;
          &:first-child {
            width: 382px;
            text-align: left;
          }
        }
      }
      .data-dic-th3 {
        span {
          &:first-child {
            width: 364px;
            text-align: left;
          }
        }
      }
    }
  }
}
.dicTypeTop {
  border-top: 1px solid #ddd;
}
.data-dic-select {
  background: #a8e3fd;
}
.lease-model-right {
  padding-left: 5px;
}
</style>
