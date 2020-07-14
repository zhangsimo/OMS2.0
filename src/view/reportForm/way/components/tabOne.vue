<template>
  <section class="con-box">
    <vxe-table
      border
      align="center"
      size="mini"
      ref="xTable"
      height="400"
      show-footer
      :footer-method="footerMethod"
      :data="tableData"
    >
      <vxe-table-column field="group0" title="">
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group2" title="配件信息">
        <vxe-table-column
          field="partCode"
          title="配件编码"
          width="300"
        ></vxe-table-column>
        <vxe-table-column
          field="partName"
          title="配件名称"
          width="200"
        ></vxe-table-column>
        <vxe-table-column
          field="oemCode"
          title="OE码"
          width="200"
        ></vxe-table-column>
        <vxe-table-column
          field="partBrand"
          title="品牌"
          width="200"
        ></vxe-table-column>
        <vxe-table-column
          field="carModelName"
          title="品牌车型"
          width="200"
        ></vxe-table-column>
        <vxe-table-column
          field="unit"
          title="单位"
          width="200"
        ></vxe-table-column>
        <vxe-table-column
          field="spec"
          title="规格"
          width="200"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group3" title="在途信息">
        <vxe-table-column
          field="onOrderQty"
          title="在途数量"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="inStockQty"
          title="已入库数量"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="noStockQty"
          title="未入数量"
          width="120"
        ></vxe-table-column>
      </vxe-table-column>
       <vxe-table-column field="group4" title="基本信息">
        <vxe-table-column
          field="groupName"
          title="公司名称"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="outOrderNo"
          title="出库单号"
          width="200"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="customerName"
          title="客户名称"
          width="200"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="outStockDate"
          title="出库日期"
          width="200"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="storeName"
          title="仓库"
          width="200"
          show-overflow
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group4" title="税率信息">
        <vxe-table-column field="taxSign" title="是否含税" width="140">
          <template v-slot="{ row }">
            <Checkbox disabled v-model="row.taxSign"></Checkbox>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="taxRate"
          title="税率"
          width="200"
          show-overflow
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group4" title="成本信息">
        <vxe-table-column
          field="taxPrice"
          title="成本单价"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="taxAmt"
          title="成本金额"
          width="200"
          show-overflow
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group4" title="其他">
        <vxe-table-column
          field="hasAcceptUname"
          title="受理人"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="hasAcceptOrderNo"
          title="受理单号"
          width="200"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="guestName"
          title="第一供应商"
          width="200"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="remark"
          title="订单备注"
          width="200"
          show-overflow
        ></vxe-table-column>
      </vxe-table-column>
    </vxe-table>
    <Page
      class-name="page-con"
      :current="page.num"
      :total="page.total"
      :page-size="page.size"
      @on-change="changePage"
      @on-page-size-change="changeSize"
      show-sizer
      show-total transfer
    ></Page>
  </section>
</template>

<script>
import * as api from "_api/reportForm/index.js";
export default {
  data() {
    return {
      page: {
        num: 1,
        size: 10,
        total: 0
      },
      body: {},
      tableData: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 查询表
    async getList() {
      let params = {
        page: this.page.num - 1,
        size: this.page.size,
      };
      let res = await api.getOnOrderStock(this.body, params);
      if (res.code == 0 && res.data != null) {
        this.tableData = (res.data.content || []).map(el => {
          if ([1, "1", "是"].includes(el.taxSign)) {
            el.taxSign = true;
          }
          if ([0, "0", "否"].includes(el.taxSign)) {
            el.taxSign = false;
          }
          return el;
        });

        this.page.total = res.data.totalElements;
      } else {
        this.page.total = 0;
        this.tableData = [];
      }
    },
    async getAll() {
      let tableDataAll = [];
      let params = {
        page: 0,
        size: 10000,
      };
      let res = await api.getOnOrderStock(this.body, params);
      if (res.code == 0 && res.data != null) {
        tableDataAll = (res.data.content || []).map(el => {
          if ([1, "1", "是"].includes(el.taxSign)) {
            el.taxSign = true;
          }
          if ([0, "0", "否"].includes(el.taxSign)) {
            el.taxSign = false;
          }
          return el;
        });

        return tableDataAll;
      }
    },
    //分页
    changePage(p) {
      this.page.num = p;
      this.getList();
    },
    changeSize(size) {
      this.page.num = 1;
      this.page.size = size;
      this.getList();
    },
    //表尾合计
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "合计";
          }
          if (
            [
              "onOrderQty",
              "inStockQty",
              "noStockQty",
              "taxPrice",
              "taxAmt",
            ].includes(column.property)
          ) {
            return this.$utils.sum(data, column.property);
          }
          return null;
        })
      ];
    }
  }
};
</script>
