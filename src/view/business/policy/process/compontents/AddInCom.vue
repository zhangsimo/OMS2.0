<template>
  <Modal
    v-model="searchPartLayer"
    title="选择配件"
    width="1000"
    @on-ok="ok"
    footer-hide
  >
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <!--<div class="db mr10">-->
          <!--<Input-->
          <!--v-model="penSalesData.productCode"-->
          <!--placeholder="配件编码"-->
          <!--style="width: 160px"-->
          <!--class="mr10"-->
          <!--&gt;</Input>-->
          <!--</div>-->
          <div class="db mr10">
            <Input
              v-model="penSalesData.productName"
              placeholder="配件编码/名称"
              style="width: 160px"
            ></Input>
          </div>
          <div class="db mr10">
            <Button @click="search" type>查询</Button>
          </div>
          <div class="db mr10 btn">
            <Button @click="ok" type="warning">选入</Button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <!--上表格-->
<!--      <div class="topTableDate">-->
        <vxe-table
          ref="xTable"
          border
          resizable
          size="mini"
          :height="200"
          auto-resize
          align="center"
          :data="tabList"
          highlight-current-row
          highlight-hover-row
          :radio-config="{ labelField: 'name', trigger: 'row' }"
          @radio-change="radioChangeEvent"
        >
          <vxe-table-column
            type="index"
            width="60"
            title="序号"
          ></vxe-table-column>
          <vxe-table-column
            type="radio"
            width="60"
            title=" "
          ></vxe-table-column>
          <!-- <vxe-table-column field="name" title="客户" width="100"></vxe-table-column> -->
          <vxe-table-column
            field="partCode"
            title="配件编码"
            width="200"
          ></vxe-table-column>
          <vxe-table-column
            field="partName"
            title="配件名称"
            width="200"
          ></vxe-table-column>
          <vxe-table-column
            field="fullName"
            title="配件全称"
            width="200"
          ></vxe-table-column>
          <vxe-table-column
            field="carBrandModel"
            title="品牌车型"
            width="200"
          ></vxe-table-column>
          <vxe-table-column field="oemCode"min-width="200" title="OE码"></vxe-table-column>
        </vxe-table>
<!--      </div>-->

      <!--     分页-->
      <Row class="mt10 mb10">
        <Col span="12" offset="12" style="text-align:right">
          <div>
            <Page
              :current="pageList.page"
              :total="pageList.total"
              :page-size="pageList.size"
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
        <vxe-table
          border
          resizable
          auto-resize
          height="150"
          align="center"
          :data="currentData"
        >
          <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
          <vxe-table-column
            field="partCode"
            title="配件编码"
            width="160"
          ></vxe-table-column>
          <vxe-table-column
            field="partName"
            title="配件名称"
            width="160"
          ></vxe-table-column>
          <vxe-table-column
            field="fullName"
            title="配件全称"
            width="160"
          ></vxe-table-column>
          <vxe-table-column field="qty"width="160" title="数量"></vxe-table-column>
          <vxe-table-column field="ratio"width="160" title="成本比例"></vxe-table-column>
          <vxe-table-column field="remark"width="160" title="备注"></vxe-table-column>
        </vxe-table>
      </div>
    </section>
  </Modal>
</template>

<script>
// import '@/view/lease/product/lease.less'
// import '@/view/goods/goodsList/goodsList.less'
import { chengping } from "../../../../../api/business/process.js";
export default {
  data() {
    return {
      searchPartLayer: false,
      // 日期数据
      options1: [],
      tabList: [],
      // 调出方查询
      penSalesData: {
        options1: [], //日期
        customer: "", //调出方
        productName: "", //申请单号
        productCode: ""
      },
      customerListOptions: [], //调出方下拉列表
      tableData: [],
      TopTableData: [], //上侧表格list
      BottomTableData: [], //下侧表格list
      // 分页数据
      pageList: {
        page: 1,
        total: 0,
        size: 20,
        pageSizeOpts: [20, 100, 150, 200]
      },
      xuanzhognList: [],
      checkRow: {},
      currentData: []
    };
  },
  watch: {
    tbdata: {
      handler(newVal) {
        this.tabList = newVal;
      },
      deep: true
    }
  },
  props: {},
  methods: {
    init() {
      // this.$refs.xTable.recalculate(true)
      this.getList();
      this.searchPartLayer = true;
    },
    init1() {
      this.searchPartLayer = false;
    },
    getList(productCode = "", productName = "") {
      let params = {
        page: this.pageList.page - 1,
        size: this.pageList.size,
      }
      chengping(productCode, productName, params)
        .then(res => {
          // 导入成品, 并把成品覆盖掉当前配件组装信息list
          if (res.code == 0) {
            this.tabList = res.data;
            this.pageList.total = res.totalElements;
            this.$Message.success("获取成品列表成功");
          }
        })
        .catch(e => {
          this.$Message.info("获取成品失败");
        });
    },
    //选中的日期
    selectDate(date) {
      this.penSalesData.option1 = date;
      console.log(this.penSalesData.option1);
    },
    changePage(p) {
      this.pageList.page = p
      this.getList();
    },
    changeSize(size) {
      this.pageList.page = 1
      this.pageList.size = size
      this.getList();
    },
    //搜索
    search() {
      this.pageList.page = 1;
      this.getList(this.penSalesData.productCode, this.penSalesData.productName);
      // this.$emit('search21', this.penSalesData)
    },
    getParams() {
      // this.$emit('getLisw', this.penSalesData)
    },
    //确定
    chose() {
      // 将选中的行添加到下面
      // this.bData.push(this.checkRow)
    },
    //取消
    cancel() {},
    echoDate() {},
    radioChangeEvent({ row }) {
      console.log(row);
      this.checkRow = row;
      this.currentData = row.detailList;
    },
    ok() {
      // 将选好的成品传父组件
      if (this.checkRow.id) {
        this.$emit("ok", this.checkRow);
      } else {
        this.$Message.error("请先选择配件");
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
