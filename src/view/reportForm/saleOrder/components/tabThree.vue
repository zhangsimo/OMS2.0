<template>
  <section class="con-box">
    <vxe-table
      border
      align="left"
      size="mini"
      ref="xTable"
      max-height="700"
      show-footer
      :footer-method="footerMethod"
      :data="tableData"
    >
      <vxe-table-column show-overflow="tooltip" field="group0" title="基本信息" fixed="left">
        <vxe-table-column show-overflow="tooltip" type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column show-overflow="tooltip" field="shortName" title="分店名称" width="100"></vxe-table-column>
        <vxe-table-column show-overflow="tooltip" field="guestFirm" title="店号" width="60"></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="serviceId"
          title="销退入库单号"
          width="164"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="guestFullName"
          title="客户"
          width="120"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="group1" title="单据信息">
        <vxe-table-column
          show-overflow="tooltip"
          field="enterDate"
          title="入库日期"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="storeName"
          title="仓库"
          width="80"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="orderType0"
          title="订单类型"
          width="80"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="group2" title="配件信息">
        <vxe-table-column
          show-overflow="tooltip"
          field="partName"
          title="配件名称"
          width="110"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="partCode"
          title="配件编码"
          width="110"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="partBrand"
          title="品牌"
          width="80"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="oemCode"
          title="OE码"
          width="110"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="carBrandName"
          title="厂牌"
          width="110"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="carModelName"
          title="品牌车型"
          width="110"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="spec"
          title="规格"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="partId"
          title="配件内码"
          width="70"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="unit"
          title="单位"
          width="50"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="group3" title="数量/单价">
        <vxe-table-column
          show-overflow="tooltip"
          field="orderQty"
          title="销退数量"
          width="70"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="orderPrice"
          title="销退单价"
          width="70"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="orderAmt"
          title="金额"
          width="80"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="detailRemark"
          title="明细备注"
          width="80"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="group4" title="销售税率信息">
        <vxe-table-column show-overflow="tooltip" field="sellTaxSign" title="销售含税" width="70">
          <template v-slot="{ row }">
            <Checkbox disabled v-model="row.sellTaxSign"></Checkbox>
          </template>
        </vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="sellTaxRate"
          title="销售税率"
          width="70"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="sellTaxPrice"
          title="含税销价"
          width="70"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="sellTaxAmt"
          title="含税金额"
          width="80"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="sellNoTaxPrice"
          title="不含税销价"
          width="80"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="sellNoTaxAmt"
          title="不含税金额"
          width="80"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="taxQuota"
          title="销售税额"
          width="70"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="group5" title="成本信息">
        <vxe-table-column
          show-overflow="tooltip"
          field="enterPrice"
          title="成本单价"
          width="70"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="enterAmt"
          title="成本金额"
          width="80"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip" field="sellTaxSign" title="成本含税" width="70">
          <template v-slot="{ row }">
            <Checkbox disabled v-model="row.sellTaxSign"></Checkbox>
          </template>
        </vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="sellTaxRate"
          title="成本税率"
          width="70"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="sellTaxPrice"
          title="含税单价"
          width="70"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="sellTaxAmt"
          title="含税金额"
          width="80"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="sellNoTaxPrice"
          title="不含税单价"
          width="80"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="sellNoTaxAmt"
          title="不含税金额"
          width="80"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="taxDiff"
          title="成本税额"
          width="70"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="entenrGuestName"
          title="最近供应商"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="firstGuestFullName"
          title="第一供应商"
          width="120"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="group6" title="利润信息">
        <vxe-table-column show-overflow="tooltip"
                          field="profit"
                          title="损益"
                          width="60"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="maoLi"
                          title="毛利"
                          width="70"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="taxMaoLi"
                          title="税金毛利"
                          width="80"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="noTaxMaoLi"
                          title="非税金毛利"
                          width="80"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="costRate"
                          title="成本率"
                          width="70"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="maoLiRate"
                          title="毛利率"
                          width="70"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="noTaxMaoLiRate"
                          title="非税金毛利率"
                          width="100"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="group7" title="其他">
        <vxe-table-column
          show-overflow="tooltip"
          field="code"
          title="订单单号"
          width="164"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="orderMan"
          title="销售员"
          width="70"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="auditor"
          title="提交人"
          width="70"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="auditDate"
          title="提交日期"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="billTypeIdName"
          title="票据类型"
          width="80"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="settleTypeIdName"
          title="结算方式"
          width="80"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="mainRemark"
          title="订单备注"
          width="240"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="rtnReasonName"
          title="原因"
          width="240"
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
        pageOpts: [10, 20, 30, 50],
        tableDataAll: [],
        body: {},
        tableData: [],
        total: {}
      };
    },
    mounted() {
      // this.getList();
    },
    methods: {
      // 查询表
      async getList() {
        let params = {
          page: this.page.num - 1,
          size: this.page.size,
        };
        let res = await api.getPjSellOutRtnMainDetails(this.body, params);
        if (res.code == 0 && res.data != null) {
          this.tableData = (res.data.content || []).map(el => {
            if ([1, "1", "是"].includes(el.taxSign)) {
              el.taxSign = true;
            }
            if ([0, "0", "否"].includes(el.taxSign)) {
              el.taxSign = false;
            }
            if ([1, "1", "是"].includes(el.sellTaxSign)) {
              el.sellTaxSign = true;
            }
            if ([0, "0", "否"].includes(el.taxSign)) {
              el.sellTaxSign = false;
            }
            if ([1, "1", "是"].includes(el.sellTaxSign)) {
              el.isMakActivity = true;
            }
            if ([0, "0", "否"].includes(el.taxSign)) {
              el.isMakActivity = false;
            }
            return el;
          });
          this.total = res.data.purchaseEnterBean
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
        let res = await api.getPjSellOutRtnMainDetails(this.body, params);
        if (res.code == 0 && res.data != null) {
          this.total = res.data.purchaseEnterBean
          tableDataAll = (res.data.content || []).map(el => {
            if ([1, "1", "是"].includes(el.taxSign)) {
              el.taxSign = "是";
            }
            if ([0, "0", "否"].includes(el.taxSign)) {
              el.taxSign = "否";
            }
            el.isMakActivity = "否";
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
      footerMethod({columns, data}) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return "合计";
            }
            if (
              [
                "enterQty",
                "rtnPrice",
                "rtnAmt",
                "taxPrice",
                "taxAmt",
                "taxQuota",
                "noTaxPrice",
                "noTaxAmt",
                "enterPrice",
                "enterAmt",
                "sellTaxPrice",
                "sellTaxAmt",
                "sellNoTaxPrice",
                "sellNoTaxAmt",
                "taxDiff",
                "orderQty",
                "orderPrice",
                "orderAmt",
                "taxMaoLi",
                "noTaxMaoLi",
                "cbTaxPrice",
                "cbTaxAmt",
                "cbNoTaxPrice",
                "cbNoTaxAmt",
                "maoLi",
                "profit"
              ].includes(column.property)
            ) {
              return this.$utils.sum(data, column.property);
            }
            return null;
          }),
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return "总合计";
            }
            for (let key in this.total) {
              if (key == column.property) {
                return this.total[key]
              }
            }
            return null;
          })
        ];
      }
    }
  };
</script>
