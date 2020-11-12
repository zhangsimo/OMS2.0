<template>
  <section>
<!--    class="con-box"-->
    <vxe-table
      border
      align="left"
      size="mini"
      ref="xTable"
      height="400"
      auto-resize
      resizable
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
          title="订单单号"
          width="164"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="guestFullName"
          title="供应商"
          width="120"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="group1" title="订单信息">
        <vxe-table-column
          show-overflow="tooltip"
          field="storeName"
          title="仓库"
          width="90"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="orderType"
          title="订单类型"
          width="70"
        >
          <template v-slot="{ row }">
            <span>{{ row.orderType.name }}</span>
          </template>
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="group2" title="配件信息">
        <vxe-table-column
          show-overflow="tooltip"
          field="partCode"
          title="配件编码"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="partName"
          title="配件名称"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="oemCode"
          title="OE码"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="partBrand"
          title="品牌"
          width="70"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="carModelName"
          title="品牌车型"
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="unit"
          title="单位"
          width="50"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="spec"
          title="规格"
          width="100"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="group3" title="数量/价格">
        <vxe-table-column
          show-overflow="tooltip"
          field="orderQty"
          title="订单数量"
          width="70"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="orderPrice"
          title="采购单价"
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
          field="adjustQty"
          title="调整数量"
          width="70"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="trueEnterQty"
          title="入库数量"
          width="70"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="detailRemark"
          title="备注"
          width="70"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip"  title="税率信息">
        <vxe-table-column show-overflow="tooltip" field="taxSign" title="是否含税" width="70">
          <template v-slot="{ row }">
            <Checkbox disabled v-model="row.taxSign"></Checkbox>
          </template>
        </vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="taxRate"
          title="税率"
          width="50"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip"  title="国际采购各项费用">
        <vxe-table-column
          show-overflow="tooltip"
          field="currency"
          title="币种"
          width="60"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="exchangeRate"
          title="汇率"
          width="50"

        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="fcPrice"
          title="裸价外币"
          width="70"

        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="rmbPrice"
          title="裸价人民币"
          width="80"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="rmbAmt"
          title="裸价金额"
          width="80"

        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="tariffAmt"
          title="关税费"
          width="70"

        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="transportAmt"
          title="运杂费"
          width="70"

        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="vatAmt"
          title="增值税费"
          width="70"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="otherAmt"
          title="其他费用"
          width="70"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip"  title="其他">
        <vxe-table-column
          show-overflow="tooltip"
          field="settleTypeIdName"
          title="结算方式"
          width="80"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="billTypeIdName"
          title="票据类型"
          width="80"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="orderDate"
          title="订货日期"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="orderMan"
          title="采购员"
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
          field="mainRemark"
          title="订单备注"
          width="240"
        ></vxe-table-column>
      </vxe-table-column>
    </vxe-table>
    <div class="page-warp fw">
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
    </div>
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
        let res = await api.getPjPchsOrderMainDetailList(this.body, params);
        if (res.code == 0 && res.data != null) {
          this.tableData = (res.data.content || []).map(el => {
            if ([1, "1", "是"].includes(el.taxSign)) {
              el.taxSign = true;
            }
            if ([0, "0", "否"].includes(el.taxSign)) {
              el.taxSign = false;
            }
            // if(el.taxRate){
            //   el.taxRate=`${el.taxRate*100}%`
            // }
            return el;
          });
          // this.total = res.data.purchaseOrderBean
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
          size: this.page.total,
        };
        let res = await api.getPjPchsOrderMainDetailList(this.body, params);
        if (res.code == 0 && res.data != null) {
          // this.total = res.data.purchaseOrderBean
          tableDataAll = (res.data.content || []).map(el => {
            if ([1, "1", "是"].includes(el.taxSign)) {
              el.taxSign = "是";
            }
            if ([0, "0", "否"].includes(el.taxSign)) {
              el.taxSign = "否";
            }
            el.orderType = el.orderType.name
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
          }),
          // columns.map((column, columnIndex) => {
          //   if (columnIndex === 0) {
          //     return "总合计";
          //   }
          //   for (let key in this.total) {
          //     if (key == column.property) {
          //       return this.total[key]
          //     }
          //   }
          //   return null;
          // })
        ];
      }
    }
  };
</script>
<style scoped>
  /*.vxe-table.border--full */
  /*.vxe-table>.vxe-cell{*/
  /*  margin-left: -16px!important;*/
  /*}*/
</style>
