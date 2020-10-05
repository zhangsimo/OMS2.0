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
      <vxe-table-column  show-overflow="tooltip" field="group0" title="">
        <vxe-table-column  show-overflow="tooltip" type="seq" title="序号" width="60"></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group2" title="配件信息">
        <vxe-table-column  show-overflow="tooltip"
          field="partCode"
          title="配件编码"
          width="120"
        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="partName"
          title="配件名称"
          width="120"
        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="oemCode"
          title="OE码"
          width="120"
        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="partBrand"
          title="品牌"
          width="80"
        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="carModelName"
          title="品牌车型"
          width="120"
        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="unit"
          title="单位"
          width="50"
        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="spec"
          title="规格"
          width="120"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group3" title="在途信息">
        <vxe-table-column  show-overflow="tooltip"
          field="onOrderQty"
          title="在途数量"
          width="70"
        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="inStockQty"
          title="已入库数量"
          width="80"
        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="noStockQty"
          title="未入库数量"
          width="80"
        ></vxe-table-column>
      </vxe-table-column>
       <vxe-table-column  show-overflow="tooltip" field="group4" title="基本信息">
        <vxe-table-column  show-overflow="tooltip"
          field="groupName"
          title="公司名称"
          width="120"
        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="outOrderNo"
          title="出库单号"
          width="164"
        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="customerName"
          title="客户名称"
          width="120"
        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="outStockDate"
          title="出库日期"
          width="100"

        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="storeName"
          title="仓库"
          width="90"

        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group4" title="税率信息">
        <vxe-table-column  show-overflow="tooltip" field="taxSign" title="是否含税" width="70">
          <template v-slot="{ row }">
            <Checkbox disabled v-model="row.taxSign"></Checkbox>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="taxRate"
          title="税率"
          width="50"

        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group4" title="成本信息">
        <vxe-table-column  show-overflow="tooltip"
          field="taxPrice"
          title="成本单价"
          width="70"
        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="taxAmt"
          title="成本金额"
          width="80"

        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group4" title="其他">
        <vxe-table-column  show-overflow="tooltip"
          field="hasAcceptUname"
          title="受理人"
          width="70"
        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="hasAcceptOrderNo"
          title="受理单号"
          width="164"

        ></vxe-table-column>
<!--        <vxe-table-column  show-overflow="tooltip"-->
<!--          field="guestName"-->
<!--          title="第一供应商"-->
<!--          width="130"-->

<!--        ></vxe-table-column>-->
        <vxe-table-column  show-overflow="tooltip"
          field="remark"
          title="订单备注"
          width="120"

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
            el.taxSign = "是";
          }
          if ([0, "0", "否"].includes(el.taxSign)) {
            el.taxSign = "否";
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
