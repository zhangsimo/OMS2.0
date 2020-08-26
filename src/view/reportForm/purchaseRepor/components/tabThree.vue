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
          title="采购出库单号"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="serviceId0"
          title="最近入库单号"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="guestFullName"
          title="最近供应商"
          width="120"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group1" title="订单信息">
        <vxe-table-column
          show-overflow="tooltip"
          field="firstServiceId0"
          title="首次入库单号"
          width="180"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="firstGuestFullName"
          title="首次供应商"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="orderMan"
          title="采购员"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="auditor"
          title="退货员"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="billTypeIdName"
          title="票据类型"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="settleTypeIdName"
          title="结算方式"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="enterDate0"
          title="入库日期"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="storeName0"
          title="采购仓库"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="orderType0"
          title="采购入库类型"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="outDate"
          title="退货日期"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="storeName"
          title="退货仓库"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="rtnReasonName"
          title="退货原因"
          width="120"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group2" title="配件信息">
        <vxe-table-column  show-overflow="tooltip"
          field="partCode"
          title="配件编码"
          width="300"
        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="partName"
          title="配件名称"
          width="200"
        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="oemCode"
          title="OE码"
          width="200"
        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="partBrand"
          title="品牌"
          width="200"
        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="carModelName"
          title="品牌车型"
          width="200"
        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="unit"
          title="单位"
          width="200"
        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="spec"
          title="规格"
          width="200"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group3" title="数量/价格">
        <vxe-table-column
          show-overflow="tooltip"
          field="orderQty0"
          title="采购数量"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="orderPrice0"
          title="采购单价"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="orderAmt0"
          title="采购金额"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="orderQty"
          title="退货数量"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="orderPrice"
          title="退货单价"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="orderAmt"
          title="退货金额"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="detailRemark"
          title="备注"
          width="120"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group4" title="含税信息">
        <vxe-table-column  show-overflow="tooltip" field="taxSign" title="是否含税" width="140">
          <template v-slot="{ row }">
            <Checkbox disabled v-model="row.taxSign"></Checkbox>
          </template>
        </vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="taxRate"
          title="税率"
          width="200"
        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="taxPrice"
          title="含税单价"
          width="140"
        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="taxAmt"
          title="含税金额"
          width="200"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group4" title="不含税信息">
        <vxe-table-column  show-overflow="tooltip"
          field="noTaxPrice"
          title="不含税单价"
          width="140"
        ></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip"
          field="noTaxAmt"
          title="不含税金额"
          width="200"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="taxQuota"
          title="税额"
          width="200"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column  show-overflow="tooltip" field="group4" title="其他">
        <vxe-table-column
          show-overflow="tooltip"
          field="pcshOrderCode"
          title="采购订单单号"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="auditor0"
          title="采购提交人"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="auditDate0"
          title="采购提交日期"
          width="200"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="manualCode"
          title="采退订单单号"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="auditor"
          title="采退提交人"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="auditDate"
          title="采退提交日期"
          width="200"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="mainRemark"
          title="订单备注"
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
        size: 1000,
        total: 0
      },
      body: {},
      pageOpts: [1000, 2000, 3000, 5000],
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
      let res = await api.getPjPchsRtnMainDetails(this.body, params);
      if (res.code == 0 && res.data != null) {
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
        this.total = res.data.sellOutBean
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
      let res = await api.getPjPchsRtnMainDetails(this.body, params);
      if (res.code == 0 && res.data != null) {
        this.total = res.data.sellOutBean
        tableDataAll = (res.data.content || []).map(el => {
          // el.outDate = el.outDate ? moment(el.outDate).format("YYYY-MM-DD") :''
          // el.auditDate = el.auditDate ? moment(el.auditDate).format("YYYY-MM-DD") :''
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
              "orderQty",
              "orderPrice",
              "orderAmt",
              "taxQuota",
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
        }),
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "总合计";
          }
          for(let key in this.total){
            if(key==column.property){
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
