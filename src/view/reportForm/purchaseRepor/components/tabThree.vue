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
          title="采退出库单号"
          width="180"
        ></vxe-table-column>
        <vxe-table-column
          field="guestFullName"
          title="供应商"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="orderMan"
          title="退货员"
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
          title="退货日期"
          width="120"
        >
        </vxe-table-column>
        <vxe-table-column
          field="storeName"
          title="退货仓库"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="rtnReasonName"
          title="退货原因"
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
          title="退货数量"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="orderPrice"
          title="退货单价"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="orderAmt"
          title="退货金额"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="mainRemark"
          title="备注"
          width="120"
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
          width="200"
          show-overflow
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group4" title="含税信息">
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
      <vxe-table-column field="group4" title="不含税信息">
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
      <vxe-table-column field="group4" title="其他">
        <vxe-table-column
          field="manualCode"
          title="采退订单单号"
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
          field="detailRemark"
          title="订单备注"
          width="200"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="pcshOrderCode"
          title="采购订单"
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
import moment from 'moment'
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
      let res = await api.getPjPchsRtnMainDetails(this.body, params);
      if (res.code == 0) {
        this.tableData = (res.data.content || []).map(el => {
          // el.outDate = el.outDate ? moment(el.outDate).format("YYYY-MM-DD") :''
          // el.auditDate = el.auditDate ? moment(el.auditDate).format("YYYY-MM-DD") :''
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
              "enterPrice",
              "enterAmt",
              "taxPrice",
              "taxAmt",
              "noTaxPrice",
              "noTaxAmt"
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
