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
      <vxe-table-column show-overflow="tooltip" field="group0" title="基本信息" fixed="left">
        <vxe-table-column show-overflow="tooltip" type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column show-overflow="tooltip" field="shortName" title="分店名称" width="100"></vxe-table-column>
        <vxe-table-column show-overflow="tooltip" field="guestFirm" title="店号" width="60"></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="serviceId"
          title="采购入库"
          width="164"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="guestFullName"
          title="供应商"
          width="120"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="group1" title="单据信息">
        <vxe-table-column
          show-overflow="tooltip"
          field="enterDate"
          title="提交日期"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="storeName"
          title="仓库"
          width="90"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="orderType"
          title="采购类型"
          width="80"
        >
        </vxe-table-column>
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
          title="数量"
          width="70"
        >
          <template v-slot:footer>
            <span style="color: red">{{allMoneyList.orderQty || 0 }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="orderPrice"
          title="单价"
          width="70"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="orderAmt"
          title="金额"
          width="80"
        >
          <template v-slot:footer>
            <span style="color: red">{{allMoneyList.orderAmt || 0 }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="detailRemark"
          title="明细备注"
          width="80"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="group4" title="成本信息">
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
        >
          <template v-slot:footer>
            <span style="color: red">{{allMoneyList.enterAmt || 0 }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column show-overflow="tooltip" field="taxSign" title="是否含税" width="80">
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
        <vxe-table-column
          show-overflow="tooltip"
          field="taxPrice"
          title="含税单价"
          width="80"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="taxAmt"
          title="含税金额"
          width="80"
        >
          <template v-slot:footer>
            <span style="color: red">{{allMoneyList.taxAmt || 0 }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="noTaxPrice"
          title="不含税单价"
          width="80"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="noTaxAmt"
          title="不含税金额"
          width="80"
        >
          <template v-slot:footer>
            <span style="color: red">{{allMoneyList.noTaxAmt || 0 }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="taxQuota"
          title="税额"
          width="70"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="group5" title="其他">
        <vxe-table-column
          show-overflow="tooltip"
          field="code"
          title="订单单号"
          width="164"
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
          width="150"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="mainRemark0"
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
        body: {},
        tableData: [],
        total: {},
        allMoneyList:{}
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
          size: this.page.size
        };
        let res = await api.getPjPchsEnterMainDetails(this.body, params);
        if (res.code == 0 && res.data != null) {
          this.tableData = (res.data.content || []).map(el => {
            if ([1, "1", "是"].includes(el.taxSign)) {
              el.taxSign = true;
            }
            if ([0, "0", "否"].includes(el.taxSign)) {
              el.taxSign = false;
            }
            el.orderType=el.orderType.name
            return el;
          });
          // this.total = res.data.purchaseEnterBean
          this.page.total = res.data.totalElements;
        } else {
          this.page.total = 0;
          this.tableData = [];
        }
      },
      async getAllMoney(){
        let params = {
          page: this.page.num - 1,
          size: this.page.size
        };
        let obj = await api.getPjPchsEnterMainDetailsCount(this.body, params)
        if (obj.code === 0){
          this.allMoneyList = (obj.data.content || [] ).length > 0 ? obj.data.content[0] : {}
        }
      },
      async getAll() {
        let tableDataAll = [];
        let params = {
          page: 0,
          size: this.page.total
        };
        let obj = await api.getPjPchsEnterMainDetailsCount(this.body, params)
        if (obj.code === 0){
          this.allMoneyList = (obj.data.content || [] ).length > 0 ? obj.data.content[0] : {}
        }
        let res = await api.getPjPchsEnterMainDetails(this.body, params);
        if (res.code == 0 && res.data != null) {
          tableDataAll = (res.data.content || []).map(el => {
            if ([1, "1", "是"].includes(el.taxSign)) {
              el.taxSign = "是";
            }
            if ([0, "0", "否"].includes(el.taxSign)) {
              el.taxSign = "否";
            }
            el.orderType=el.orderType.name
            return el;
          });
          // this.total = res.data.purchaseEnterBean
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
              ["six"
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
