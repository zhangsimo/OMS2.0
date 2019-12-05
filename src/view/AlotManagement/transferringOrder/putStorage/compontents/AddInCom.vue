<template>
  <div style="width:500px; height: 300px">
    <Modal v-model="searchPartLayer" title="选择调拨申请单" width="1000">
      <section class="oper-box">
        <div class="oper-top flex">
          <div class="wlf">
            <div class="db mr10 abd">
              <span class="mr10">快速查询：</span>
            </div>
            <div class="db mt40 mrt10 abc">
              <span class="mr10">申请日期:</span>
              <Date-picker
                v-model="penSalesData.option1"
                @on-change="selectDate"
                type="daterange"
                placement="bottom-end"
                placeholder="选择日期"
                style="width: 200px"
              ></Date-picker>
            </div>
            <div class="db mr10">
              <Select
                v-model="penSalesData.customer"
                class="w100 mr10"
                placeholder="调出方"
                filterable
                clearable
              >
                <Option
                  v-for="item in customerListOptions"
                  :value="item.name"
                  :key="item.id"
                >{{ item.name }}</Option>
              </Select>
            </div>
            <div class="db mr10">
              <Input
                v-model="penSalesData.productName"
                placeholder="申请单号"
                style="width: 160px"
                class="mr10"
              ></Input>
            </div>
            <div class="db mr10">
              <Button @on-click="search" type class="mr20">查询</Button>
            </div>
            <div class="db mr10 btn">
              <Button @on-click="chose" type="warning" class="mr20">选择</Button>
            </div>
            <div class="db mr10">
              <Button @on-click="cancel" type class="mr20">取消</Button>
            </div>
          </div>
        </div>
      </section>
      <section class="con-box">
        <!--上表格-->
        <div class="topTableDate">
          <vxe-table border resizable auto-resize height="100" :data="TopTableData">
            <vxe-table-column type="index" title="序号"></vxe-table-column>
            <vxe-table-column field="item2" title="选择"></vxe-table-column>
            <vxe-table-column field="item3" title="申请单号"></vxe-table-column>
            <vxe-table-column field="item4" title="调出方"></vxe-table-column>
            <vxe-table-column field="item5" title="受理状态"></vxe-table-column>
            <vxe-table-column field="item6" title="申请人"></vxe-table-column>
            <vxe-table-column field="item7" title="申请日期" width="100"></vxe-table-column>
            <vxe-table-column field="item8" title="提交人" width="100"></vxe-table-column>
            <vxe-table-column field="item9" title="提交日期" width="100"></vxe-table-column>
            <vxe-table-column field="item10" title="备注" width="100"></vxe-table-column>
          </vxe-table>
        </div>

        <!--     分页-->
        <Row class="mt10 mb10">
          <Col span="12" offset="12" style="text-align:right">
            <div>
              <Page
                :current="pageList.page"
                :total="this.pageList.total"
                :page-size="pageList.pageSize"
                :page-size-opts="pageList.pageSizeOpts"
                show-sizer
              />
            </div>
          </Col>
        </Row>
        <!--        下表格-->
        <div class="bottomTableDate">
          <vxe-table border resizable auto-resize height="100" :data="BottomTableData">
            <vxe-table-column type="index" title="序号"></vxe-table-column>
            <vxe-table-column field="item2" title="配件编码"></vxe-table-column>
            <vxe-table-column field="item3" title="配件名称" width="100"></vxe-table-column>
            <vxe-table-column field="item4" title="品牌"></vxe-table-column>
            <vxe-table-column field="item5" title="单位"></vxe-table-column>
            <vxe-table-column field="item6" title="品牌车型"></vxe-table-column>
            <vxe-table-column field="item7" title="申请数量"></vxe-table-column>
            <vxe-table-column field="item8" title="受理数量"></vxe-table-column>
            <vxe-table-column field="item9" title="取消数量"></vxe-table-column>
            <vxe-table-column field="item10" title="已入库数量"></vxe-table-column>
            <vxe-table-column field="item11" title="备注"></vxe-table-column>
          </vxe-table>
        </div>
      </section>
    </Modal>
  </div>
</template>

<script >
// import '@/view/lease/product/lease.less'
// import '@/view/goods/goodsList/goodsList.less'
export default {
  data() {
    return {
      searchPartLayer: false,
      // 日期数据
      options1: [],
      // 调出方查询
      penSalesData: {
        options1: [], //日期
        customer: '', //调出方
        productName: '' //申请单号
      },
      customerListOptions: [], //调出方下拉列表
      TopTableData: [
        {
          item2: '2',
          item3: '3',
          item4: '4',
          item5: '5',
          item6: '6',
          item7: '7',
          item8: '8',
          item9: '9',
          item10: '10'
        }
      ], //上侧表格list
      BottomTableData: [
        {
          item2: '2',
          item3: '3',
          item4: '4',
          item5: '5',
          item6: '6',
          item7: '7',
          item8: '8',
          item9: '9',
          item10: '10',
          item11: '11'
        }
      ], //下侧表格list
      // 分页数据
      pageList: {
        page: 1,
        total: 0,
        size: 50,
        pageSize: 50,
        pageSizeOpts: [50, 100, 150, 200]
      }
    }
  },
  methods: {
    init() {
      this.searchPartLayer = true
    },
    //选中的日期
    selectDate(date) {
      this.penSalesData.option1 = date
      console.log(this.penSalesData.option1)
    },
    //搜索
    search() {
      // this.getList()
    },
    //确定
    chose() {},
    //取消
    cancel() {}
  }
}
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
            content: '';
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
