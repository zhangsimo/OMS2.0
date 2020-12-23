<template>
  <section>
    <!--    class="con-box"-->
    <vxe-table
      border
      align="left"
      size="mini"
      ref="xTable"
      max-height="700"
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
          title="订单单号"
          width="164"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="guestFullName"
          title="客户"
          width="120"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="group1" title="订单信息">
        <vxe-table-column show-overflow="tooltip"
                          field="storeName"
                          title="仓库"
                          width="90"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="orderType"
                          title="订单来源"
                          width="70"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="group2" title="配件信息">
        <vxe-table-column show-overflow="tooltip"
                          field="partCode"
                          title="配件编码"
                          width="120"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="partName"
                          title="配件名称"
                          width="120"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="oemCode"
                          title="OE码"
                          width="120"
        ></vxe-table-column>
        <vxe-table-column
          show-overflow="tooltip"
          field="carBrandName"
          title="厂牌"
          width="110"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="partBrand"
                          title="品牌"
                          width="70"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="carModelName"
                          title="品牌车型"
                          width="120"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="unit"
                          title="单位"
                          width="50"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="spec"
                          title="规格"
                          width="100"
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip" field="group3" title="数量/价格">
        <vxe-table-column show-overflow="tooltip"
                          field="orderQty"
                          title="订单数量"
                          width="70"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="orderPrice"
                          title="订单单价"
                          width="70"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="orderAmt"
                          title="订单金额"
                          width="80"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="detailRemark"
                          title="备注"
                          width="70"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip" field="isMakActivity" title="活动" width="50">
          <template v-slot="{ row }">
            <Checkbox disabled v-model="row.isMakActivity"></Checkbox>
          </template>
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip"  title="税率信息">
        <vxe-table-column show-overflow="tooltip" field="taxSign" title="是否含税" width="70">
          <template v-slot="{ row }">
            <Checkbox disabled v-model="row.taxSign"></Checkbox>
          </template>
        </vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="taxRate"
                          title="税率"
                          width="50"

        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column show-overflow="tooltip"  title="其他">
        <vxe-table-column show-overflow="tooltip"
                          field="orderMan"
                          title="销售员"
                          width="70"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="billTypeIdName"
                          title="票据类型"
                          width="80"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="settleTypeIdName"
                          title="结算方式"
                          width="80"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="createUname"
                          title="创建人"
                          width="70"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="createTime"
                          title="创建日期"
                          width="100"

        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="auditor"
                          title="提交人"
                          width="70"
        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="auditDate"
                          title="提交日期"
                          width="100"

        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="mainRemark"
                          title="订单备注"
                          width="200"

        ></vxe-table-column>
        <vxe-table-column show-overflow="tooltip"
                          field="orderCode"
                          title="往来单号"
                          width="168"

        ></vxe-table-column>
        <vxe-table-column field="dutyMan" title="产品负责人" width="100"></vxe-table-column>
        <vxe-table-column field="businessUnit" title="所属事业部" width="100"></vxe-table-column>
        <vxe-table-column field="isTc" title="是否统采" width="100">
          <template v-slot="{row}">
            <checkbox disabled v-model="row.isTc?true:false"></checkbox>
          </template>
        </vxe-table-column>
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
import { hideLoading, showLoading } from '@/utils/loading';
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
        total:{}
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
        try {
          showLoading('.content-oper')
          let res = await api.getPjSellOrderMainDetailList(this.body, params);
  
          if (res.code == 0 && res.data != null) {
            this.tableData = (res.data.content || []).map(el => {
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
            // this.total=res.data.sellOrderBean
            this.page.total = res.data.totalElements;
          } else {
            this.page.total = 0;
            this.tableData = [];
          }
          hideLoading()
        } catch (error) {
          hideLoading()
        }
      },
      async getAll() {
        let tableDataAll = [];
        let params = {
          page: 0,
          size: this.page.total,
        };
        let res = await api.getPjSellOrderMainDetailList(this.body, params);
        if (res.code == 0 && res.data != null) {
          // this.total=res.data.sellOrderBean
          tableDataAll = (res.data.content || []).map(el => {
            if ([1, "1", "是"].includes(el.taxSign)) {
              el.taxSign = "是";
            }
            if ([0, "0", "否"].includes(el.taxSign)) {
              el.taxSign = "否";
            }
            if ([1, "1", "是"].includes(el.isMakActivity)) {
              el.isMakActivity = "是";
            }
            if ([0, "0", "否"].includes(el.isMakActivity)) {
              el.isMakActivity = "否";
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
