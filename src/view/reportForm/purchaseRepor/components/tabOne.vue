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
          title="订单单号"
          width="180"
        ></vxe-table-column>
        <vxe-table-column
          field="guestFullName"
          title="供应商"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="orderMan"
          title="采购员"
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
          field="orderDate"
          title="订货日期"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="storeName"
          title="仓库"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="orderType"
          title="订单类型"
          width="120"
        >
          <template v-slot="{ row }">
            <span>{{ row.orderType.name }}</span>
          </template>
        </vxe-table-column>
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
          title="订单数量"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="orderPrice"
          title="采购单价"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="orderAmt"
          title="金额"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="adjustQty"
          title="调整数量"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="trueEnterQty"
          title="入库数量"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="detailRemark"
          title="备注"
          width="120"
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
      <vxe-table-column field="group4" title="国际采购各项费用">
        <vxe-table-column
          field="currency"
          title="币种"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="exchangeRate"
          title="汇率"
          width="200"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="fcPrice"
          title="裸价外币"
          width="200"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="rmbPrice"
          title="裸价人民币"
          width="200"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="rmbAmt"
          title="裸价金额"
          width="200"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="tariffAmt"
          title="关税费"
          width="200"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="transportAmt"
          title="运杂费"
          width="200"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="vatAmt"
          title="增值税费"
          width="200"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="otherAmt"
          title="其他费用"
          width="200"
          show-overflow
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group4" title="其他">
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
      let res = await api.getPjPchsOrderMainDetailList(this.body, params);
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
      }
    },
    async getAll() {
      let tableDataAll = [];
      let params = {
        page: 0,
        size: 10000,
      };
      let res = await api.getPjPchsOrderMainDetailList(this.body, params);
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
      }

      return tableDataAll;
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
              "orderQty",
              "orderPrice",
              "orderAmt",
              "adjustQty",
              "trueEnterQty",
              "fcPrice",
              "rmbPrice",
              "rmbAmt",
              "tariffAmt",
              "transportAmt",
              "vatAmt",
              "otherAmt"
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
