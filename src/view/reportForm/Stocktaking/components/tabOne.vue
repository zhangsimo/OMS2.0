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
          field="name"
          title="入库单号"
          width="180"
        ></vxe-table-column>
        <vxe-table-column
          field="age"
          title="创建人"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="age"
          title="入库日期"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="age"
          title="入库仓库"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="age"
          title="票据类型"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="age"
          title="备注"
          width="120"
        ></vxe-table-column>
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
      <vxe-table-column field="group3" title="数量/价格">
        <vxe-table-column
          field="sex"
          title="入库数量"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="sex"
          title="单价"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="sex"
          title="金额"
          width="120"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group4" title="税率信息">
         <vxe-table-column
          field="date3"
          title="是否含税"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="date3"
          title="税率"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="date3"
          title="含税单价"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="address"
          title="含税金额"
          width="200"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="date3"
          title="不含税单价"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="address"
          title="不含税金额"
          width="200"
          show-overflow
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group4" title="其他">
        <vxe-table-column
          field="date3"
          title="关联单号"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="date3"
          title="创建日期"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="date3"
          title="来源"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="address"
          title="提交人"
          width="200"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="address"
          title="提交日期"
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
