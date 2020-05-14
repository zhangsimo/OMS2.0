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
          field="role"
          title="配件编码"
          width="300"
        ></vxe-table-column>
        <vxe-table-column
          field="sex"
          title="配件名称"
          width="200"
        ></vxe-table-column>
        <vxe-table-column
          field="sex"
          title="OE码"
          width="200"
        ></vxe-table-column>
        <vxe-table-column
          field="sex"
          title="品牌"
          width="200"
        ></vxe-table-column>
        <vxe-table-column
          field="sex"
          title="品牌车型"
          width="200"
        ></vxe-table-column>
        <vxe-table-column
          field="sex"
          title="单位"
          width="200"
        ></vxe-table-column>
        <vxe-table-column
          field="sex"
          title="规格"
          width="200"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group3" title="在途信息">
        <vxe-table-column
          field="sex"
          title="在途数量"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="sex"
          title="已入库数量"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="sex"
          title="未入数量"
          width="120"
        ></vxe-table-column>
      </vxe-table-column>
       <vxe-table-column field="group4" title="基本信息">
        <vxe-table-column
          field="date3"
          title="公司名称"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="address"
          title="出库单号"
          width="200"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="address"
          title="客户名称"
          width="200"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="address"
          title="出库日期"
          width="200"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="address"
          title="仓库"
          width="200"
          show-overflow
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group4" title="税率信息">
        <vxe-table-column
          field="date3"
          title="是否含税"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="address"
          title="税率"
          width="200"
          show-overflow
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group4" title="成本信息">
        <vxe-table-column
          field="date3"
          title="成本单价"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="address"
          title="成本金额"
          width="200"
          show-overflow
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group4" title="其他">
        <vxe-table-column
          field="date3"
          title="受理人"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="address"
          title="受理单号"
          width="200"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="address"
          title="第一供应商"
          width="200"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="address"
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
export default {
  data() {
    return {
      page: {
        num: 1,
        size: 10,
        total: 0
      },
      tableData: [],
    };
  },
  methods: {
    // 查询表
    getList() {},
    //分页
    changePage(p) {
      this.page.num = p
      this.getList()
    },
    changeSize(size) {
      this.page.num = 1
      this.page.size = size
      this.getList()
    },
    //表尾合计
    footerMethod ({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['applyAmt', 'writeOffAmount','paymentRegainAmt','paymentBalance'].includes(column.property)) {
            return this.$utils.sum(data, column.property)
          }
          return null
        })
      ]
    },
  },
};
</script>
