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
      <vxe-table-column field="group1" title="订单信息">
        <vxe-table-column
          field="serviceId"
          title="销售出库单号"
          width="180"
        ></vxe-table-column>
        <vxe-table-column
          field="guestFullName"
          title="客户"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="orderMan"
          title="销售员"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="billTypeIdName"
          title="票据类型"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="settleTypeIdName"
          title="结算方式"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="outDate"
          title="出库日期"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="storeName"
          title="仓库"
          width="120"
        ></vxe-table-column>
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
      <vxe-table-column field="group3" title="数量/价格">
        <vxe-table-column
          field="orderQty"
          title="销售数量"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="orderPrice"
          title="销售单价"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="orderAmt"
          title="销售金额"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="detailRemark"
          title="备注"
          width="120"
        ></vxe-table-column>
        <vxe-table-column field="isMakActivity" title="活动" width="120">
          <template v-slot="{ row }">
            <Checkbox disabled v-model="row.isMakActivity"></Checkbox>
          </template>
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group4" title="税率信息">
        <vxe-table-column field="taxSign" title="是否含税" width="140">
          <template v-slot="{ row }">
            <Checkbox disabled v-model="row.taxSign"></Checkbox>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="taxRate"
          title="税点"
          width="200"
          show-overflow
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group4" title="销价含税信息">
        <vxe-table-column
          field="taxPrice"
          title="含税单价"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="taxAmt"
          title="含税金额"
          width="200"
          show-overflow
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group4" title="销价不含税信息">
        <vxe-table-column
          field="noTaxPrice"
          title="不含税单价"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="noTaxAmt"
          title="不含税金额"
          width="200"
          show-overflow
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group4" title="成本信息">
        <vxe-table-column
          field="enterPrice"
          title="成本单价"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="enterAmt"
          title="成本金额"
          width="140"
        ></vxe-table-column>
        <vxe-table-column field="taxSign" title="是否含税" width="140">
          <template v-slot="{ row }">
            <Checkbox disabled v-model="row.taxSign"></Checkbox>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="taxRate"
          title="税点"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="sellTaxPrice"
          title="含税成本单价"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="sellTaxAmt"
          title="含税成本金额"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="sellNoTaxPrice"
          title="不含税成本单价"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="sellNoTaxAmt"
          title="不含税成本金额"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="taxDiff"
          title="成本税额"
          width="140"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group4" title="利润信息">
        <vxe-table-column
          field="profit"
          title="损益"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="maori"
          title="毛利"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="taxMaoLi"
          title="税金毛利"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="noTaxMaoLi"
          title="非税金毛利"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="costRate"
          title="成本率"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="maoriRate"
          title="毛利率"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="noTaxMaoLiRate"
          title="非税金毛利率"
          width="140"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group4" title="其他">
        <vxe-table-column
          field="code"
          title="订单单号"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="auditor"
          title="提交人"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="auditDate"
          title="提交日期"
          width="200"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="mainRemark"
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
      show-total
      transfer
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
      tableDataAll: [],
      tableData: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 查询表
    async getList(data = {}) {
      let res = await api.getPjSellOutMainDetails(data);
      if (res.code == 0) {
        this.tableDataAll = (res.data || []).map(el => {
          if ([1, "1", "是"].includes(el.taxSign)) {
            el.taxSign = true;
          }
          if ([0, "0", "否"].includes(el.taxSign)) {
            el.taxSign = false;
          }
          if ([1, "1", "是"].includes(el.isMakActivity)) {
            el.isMakActivity = true;
          }
          if ([0, "0", "否"].includes(el.isMakActivity)) {
            el.isMakActivity = false;
          }
          return el;
        });

        this.tableData = this.tableDataAll.slice(0, this.page.size);
        this.page.total = this.tableDataAll.length;
      }
    },
    //分页
    changePage(p) {
      this.page.num = p;
      let start = (p - 1) * this.page.size;
      let end = p * this.page.size;
      this.tableData = this.tableDataAll.slice(start, end);
    },
    changeSize(size) {
      this.page.num = 1;
      this.page.size = size;
      this.tableData = this.tableDataAll.slice(
        this.page.num - 1,
        this.page.size
      );
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
              "orderQty",
              "orderPrice",
              "orderAmt",
              "sellTaxPrice",
              "sellTaxAmt",
              "sellNoTaxPrice",
              "sellNoTaxAmt",
              "enterPrice",
              "enterAmt",
              "taxPrice",
              "taxAmt",
              "noTaxPrice",
              "noTaxAmt",
              "taxDiff",
              "profit",
              "maori",
              "taxMaoLi",
              "noTaxMaoLi"
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
