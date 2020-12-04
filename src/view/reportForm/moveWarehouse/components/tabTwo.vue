<template>
  <section>
<!--    class="con-box"-->
    <vxe-table
      border
      align="left"
      size="mini"
      ref="xTable"
      height="400"
      show-footer
      auto-resize
      resizable
      :footer-method="footerMethod"
      :data="tableData"
    >
      <vxe-table-column show-overflow="tooltip" field="group0" title="基本信息">
        <vxe-table-column show-overflow="tooltip" type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column show-overflow="tooltip" field="shortName" title="分店名称" width="100"></vxe-table-column>
        <vxe-table-column show-overflow="tooltip" field="guestFirm" title="店号" width="60"></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="group1" title="订单信息">
        <vxe-table-column show-overflow="tooltip"
                          field="serviceId"
                          title="移仓出库单号"
                          width="180"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="orderMan"
                          title="业务员"
                          width="120"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="auditDate"
                          title="移仓日期"
                          width="120"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="storeName"
                          title="移出仓库"
                          width="120"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="receiveStoreName"
                          title="移入仓库"
                          width="120"
        ></vxe-table-column>
        <!--        <vxe-table-column  show-overflow="tooltip"-->
        <!--          field="detailRemark"-->
        <!--          title="备注"-->
        <!--          width="120"-->
        <!--        ></vxe-table-column>-->
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="group2" title="配件信息">
        <vxe-table-column show-overflow="tooltip"
                          field="partCode"
                          title="配件编码"
                          width="300"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="partName"
                          title="配件名称"
                          width="200"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="oemCode"
                          title="OE码"
                          width="200"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="partBrand"
                          title="品牌"
                          width="200"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="carModelName"
                          title="品牌车型"
                          width="200"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="unit"
                          title="单位"
                          width="200"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="spec"
                          title="规格"
                          width="200"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="group3" title="数量">
        <vxe-table-column show-overflow="tooltip"
                          field="orderQty"
                          title="移入数量"
                          width="120"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="group3" title="成本信息">
        <vxe-table-column show-overflow="tooltip"
                          field="orderPrice"
                          title="成本单价"
                          width="120"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="orderAmt"
                          title="成本金额"
                          width="120"
        ></vxe-table-column>
<!--      </vxe-table-column>-->
      <vxe-table-column show-overflow="tooltip" field="taxSign" title="是否含税" width="140">
        <template v-slot="{ row }">
          <Checkbox disabled v-model="row.taxSign"></Checkbox>
        </template>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip"
                        field="taxRate"
                        title="税率"
                        width="140"
      ></vxe-table-column>
      <vxe-table-column show-overflow="tooltip"
                        field="taxPrice"
                        title="含税单价"
                        width="140"
      ></vxe-table-column>
      <vxe-table-column show-overflow="tooltip"
                        field="taxAmt"
                        title="含税金额"
                        width="200"

      ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip"  title="不含税信息">
        <vxe-table-column show-overflow="tooltip"
                          field="noTaxPrice"
                          title="不含税单价"
                          width="140"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="noTaxAmt"
                          title="不含税金额"
                          width="200"

        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip" title="其他">
        <vxe-table-column show-overflow="tooltip"
                          field="code"
                          title="移仓单号"
                          width="140"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="auditor"
                          title="提交人"
                          width="140"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="auditDate"
                          title="提交日期"
                          width="200"

        ></vxe-table-column>
      </vxe-table-column>
    </vxe-table>
    <Page
      class-name="page-con"
      :current="page.num"
      :total="page.total"
      :page-size="page.size"
      :page-size-opts="pageOpts"
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
        data: {},
        pageOpts: [10, 20, 30, 50],
        tableDataAll: [],
        tableData: []
      };
    },
    mounted() {
      // this.getList();
    },
    methods: {
      // 查询表
      async getList(data = {}) {
        let res = await api.getStockShiftOut(data, this.page);
        if (res.code == 0) {
          this.tableDataAll = (res.data.content || []).map(el => {
            if ([1, "1", "是"].includes(el.taxSign)) {
              el.taxSign = true;
            }
            if ([0, "0", "否"].includes(el.taxSign)) {
              el.taxSign = false;
            }
            return el;
          });

          this.tableData = this.tableDataAll;
          this.page.total = res.data.totalElements;
        }
      },
      //导出
      async exportFun() {
        let pageObj = {
          page: 0,
          size: this.page.total
        }
        return new Promise(async (resolve, reject) => {
          let res = await api.getStockShiftOut(this.data, pageObj);
          if (res.code == 0) {
            let arrData = (res.data.content || []).map(el => {
              if ([1, "1", "是"].includes(el.taxSign)) {
                el.taxSign = "是";
              }
              if ([0, "0", "否"].includes(el.taxSign)) {
                el.taxSign = "否";
              }
              return el;
            });
            resolve(arrData);
          } else {
            reject()
          }
        })
      },
      //分页
      changePage(p) {
        this.page.page = p - 1;
        this.getList(this.searchData);
      },
      changeSize(size) {
        this.page.page = 0;
        this.page.size = size;
        this.getList(this.searchData);
      },
      //表尾合计
      footerMethod({columns, data}) {
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
