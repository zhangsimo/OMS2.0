<template>
  <Modal v-model="modal1" title="对账单号明细" width="1200" @on-visible-change="visChange">
    <Tabs class="mt10">
      <Tab-pane label="销售清单" name="key1">
<!--        <Table-->
<!--          border-->
<!--          :columns="columns1"-->
<!--          :data="data1"-->
<!--          class="mt10"-->
<!--          max-height="400"-->
<!--          show-summary-->
<!--          :summary-method="handleSummary"-->
<!--          ref="sale"-->
<!--        ></Table>-->
        <vxe-table
          border
          ref="sale"
          show-overflow="title"
          max-height="400"
          auto-resize
          resizable
          size="mini"
          align="center"
          :data="data1"
          :loading="dataloading1"
          highlight-hover-row
          highlight-current-row
          show-footer
          :footer-method="handleSummary"
        >
          <vxe-table-column width="50" type="seq" title="序号" ></vxe-table-column>
          <vxe-table-column field="area" title="区域"  width="60"></vxe-table-column>
          <vxe-table-column field="code" title="店号"  width="60"></vxe-table-column>
          <vxe-table-column field="guestName" title="客户/供应商名称"  width="120"></vxe-table-column>
          <vxe-table-column field="guestTypeName" title="客户供应商类别"  width="120"></vxe-table-column>
          <vxe-table-column field="orderNo" title="销售订单号"  width="100"></vxe-table-column>
          <vxe-table-column field="serviceId" title="出库单号"  width="100">
            <template v-slot="{row}">
              <span style="cursor:pointer;color:#87CEFA" @click="openData3(row)">{{row.serviceId}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="serviceSourceName" title="来源"  width="60"></vxe-table-column>
          <vxe-table-column field="serviceTypeName" title="业务类型"  width="100"></vxe-table-column>
          <vxe-table-column field="taxSignName" title="含税标志"  width="100"></vxe-table-column>
          <vxe-table-column field="transferDate" title="转单日期"  width="100"></vxe-table-column>
          <vxe-table-column field="rpAmt" title="应收金额"  width="100"></vxe-table-column>
          <vxe-table-column field="charOffAmt" title="已收金额"  width="100"></vxe-table-column>
          <vxe-table-column field="noCharOffAmt" title="未收金额"  width="100"></vxe-table-column>
          <vxe-table-column field="salesman" title="业务员"  width="100"></vxe-table-column>
          <vxe-table-column field="accountAmt" title="已对账金额"  width="100"></vxe-table-column>
          <vxe-table-column field="noAccountAmt" title="未对账金额"  width="100"></vxe-table-column>
          <vxe-table-column field="draftAmt" title="草稿金额"  width="100"></vxe-table-column>
          <vxe-table-column field="remark" title="备注"  width="100"></vxe-table-column>
          <vxe-table-column field="accountOrgName" title="对账门店"  width="100"></vxe-table-column>
          <vxe-table-column field="accountMan" title="对账人"  width="100"></vxe-table-column>
          <vxe-table-column field="accountNo" title="对账订单"  width="100"></vxe-table-column>
        </vxe-table>
      </Tab-pane>
      <Tab-pane label="采购清单" name="key2">
<!--        <Table-->
<!--          border-->
<!--          :columns="columns2"-->
<!--          :data="data2"-->
<!--          class="mt10"-->
<!--          max-height="400"-->
<!--          show-summary-->
<!--          :summary-method="handleSummary"-->
<!--          ref="purchase"-->
<!--        ></Table>-->
        <vxe-table
          border
          ref="sale"
          show-overflow="title"
          max-height="400"
          auto-resize
          resizable
          size="mini"
          align="center"
          :data="data2"
          :loading="dataloading1"
          highlight-hover-row
          highlight-current-row
          show-footer
          :footer-method="handleSummary"
        >
          <vxe-table-column width="50" type="seq" title="序号" ></vxe-table-column>
          <vxe-table-column field="area" title="区域"  width="60"></vxe-table-column>
          <vxe-table-column field="code" title="店号"  width="60"></vxe-table-column>
          <vxe-table-column field="guestName" title="客户/供应商名称"  width="120"></vxe-table-column>
          <vxe-table-column field="guestTypeName" title="客户供应商类别"  width="120"></vxe-table-column>
          <vxe-table-column field="orderNo" title="采购订单号"  width="100"></vxe-table-column>
          <vxe-table-column field="serviceId" title="入库单号"  width="100">
            <template v-slot="{row}">
              <span style="cursor:pointer;color:#87CEFA" @click="openData4(row)">{{row.serviceId}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="serviceSourceName" title="来源"  width="60"></vxe-table-column>
          <vxe-table-column field="serviceTypeName" title="业务类型"  width="100"></vxe-table-column>
          <vxe-table-column field="taxSignName" title="含税标志"  width="100"></vxe-table-column>
          <vxe-table-column field="transferDate" title="转单日期"  width="100"></vxe-table-column>
          <vxe-table-column field="rpAmt" title="应收金额"  width="100"></vxe-table-column>
          <vxe-table-column field="charOffAmt" title="已收金额"  width="100"></vxe-table-column>
          <vxe-table-column field="noCharOffAmt" title="未收金额"  width="100"></vxe-table-column>
          <vxe-table-column field="salesman" title="业务员"  width="100"></vxe-table-column>
          <vxe-table-column field="accountAmt" title="已对账金额"  width="100"></vxe-table-column>
          <vxe-table-column field="noAccountAmt" title="未对账金额"  width="100"></vxe-table-column>
          <vxe-table-column field="draftAmt" title="草稿金额"  width="100"></vxe-table-column>
          <vxe-table-column field="remark" title="备注"  width="100"></vxe-table-column>
          <vxe-table-column field="accountOrgName" title="对账门店"  width="100"></vxe-table-column>
          <vxe-table-column field="accountMan" title="对账人"  width="100"></vxe-table-column>
          <vxe-table-column field="accountNo" title="对账订单"  width="100"></vxe-table-column>
        </vxe-table>
      </Tab-pane>
    </Tabs>
    <div slot="footer"></div>
    <Modal v-model="outStock" :title="title" width="1200">
      <div class="db">
        <!-- <button
          class="mr10 ivu-btn ivu-btn-default"
          type="button"
          @click="print(0)"
          v-has="'print'"
        >打印</button> -->
        <button
          class="mr10 ivu-btn ivu-btn-default"
          type="button"
          @click="exportDetail(0)"
          v-has="'export'"
        >导出</button>
      </div>
      <Table
        border
        :columns="columns3"
        :data="data3"
        class="mt10"
        max-height="400"
        show-summary
        ref="noWarehousing"
      ></Table>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="onStock" title="入库明细" width="1200">
      <div class="db">
        <!-- <button
          class="mr10 ivu-btn ivu-btn-default"
          type="button"
          @click="print(1)"
          v-has="'print'"
        >打印</button> -->
        <button
          class="mr10 ivu-btn ivu-btn-default"
          type="button"
          @click="exportDetail(1)"
          v-has="'export'"
        >导出</button>
      </div>
      <Table
        border
        :columns="columns4"
        :data="data4"
        class="mt10"
        max-height="400"
        show-summary
        ref="warehousing"
      ></Table>
      <div slot="footer"></div>
    </Modal>
  </Modal>
</template>
<script>
import { detailsDocuments,getNumberList } from "@/api/bill/saleOrder";
import {showLoading, hideLoading} from "@/utils/loading"
export default {
  data() {
    return {
      title: "出库明细",
      outStock: false,
      onStock: false,
      dataloading1:false,
      infoData: {},
      modal1: false,
      columns1: [
        {
          title: "序号",
          type: "index",
          width: 40,
          className: "tc"
        },
        {
          title: "区域",
          key: "area",
          className: "tc"
        },
        {
          title: "店号",
          key: "code",
          className: "tc"
        },
        {
          title: "客户/供应商名称",
          key: "guestName",
          className: "tc"
        },
        {
          title: "客户供应商类别",
          key: "guestTypeName",
          className: "tc"
        },
        {
          title: "销售订单号",
          key: "orderNo",
          className: "tc"
        },
        {
          title: "出库单号",
          key: "serviceId",
          className: "tc",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  cursor: "pointer",
                  color: "#87CEFA"
                },
                on: {
                  click: async () => {
                    if (params.row.serviceTypeName == "销售出库") {
                      this.title = "出库明细";
                    } else {
                      this.title = "退货明细";
                    }
                    this.outStock = true;
                    let obj = {
                      orderCode: params.row.serviceId,
                      orderType: params.row.serviceType.value
                    };
                    let res = await this.getList(obj);
                    res.detailed.map(item => {
                      item.orderCode = params.row.serviceId;
                      item.orderType = params.row.serviceType.value;
                      item.orgId = params.row.orgId;
                      item.guestId = params.row.guestId;
                    });
                    this.data3 = res.detailed;
                  }
                }
              },
              params.row.serviceId
            );
          }
        },
        {
          title: "来源",
          key: "serviceSourceName",
          className: "tc"
        },
        {
          title: "业务类型",
          key: "serviceTypeName",
          className: "tc"
        },
        {
          title: "含税标志",
          key: "taxSignName",
          className: "tc"
        },
        // {
        //   title: "油品/配件",
        //   key: "speciesName",
        //   className: "tc"
        // },
        {
          title: "转单日期",
          key: "transferDate",
          className: "tc"
        },
        {
          title: "应收金额",
          key: "rpAmt",
          className: "tc"
        },
        {
          title: "已收金额",
          key: "charOffAmt",
          className: "tc"
        },
        {
          title: "未收金额",
          key: "noCharOffAmt",
          className: "tc"
        },
        {
          title: "业务员",
          key: "salesman",
          className: "tc"
        },
        {
          title: "已对账金额",
          key: "accountAmt",
          className: "tc"
        },
        {
          title: "未对账金额",
          key: "noAccountAmt",
          className: "tc"
        },
        {
          title: "草稿金额",
          key: "draftAmt",
          className: "tc"
        },
        {
          title: "备注",
          key: "remark",
          className: "tc"
        },
        {
          title: "对账门店",
          key: "accountOrgName",
          className: "tc"
        },
        {
          title: "对账人",
          key: "accountMan",
          className: "tc"
        },
        {
          title: "对账订单",
          key: "accountNo",
          className: "tc"
        }
      ],
      columns2: [
        {
          title: "序号",
          type: "index",
          width: 40,
          className: "tc"
        },
        {
          title: "区域",
          key: "area",
          className: "tc"
        },
        {
          title: "店号",
          key: "code",
          className: "tc"
        },
        {
          title: "客户/供应商名称",
          key: "guestName",
          className: "tc"
        },
        {
          title: "客户供应商类别",
          key: "guestTypeName",
          className: "tc"
        },
        {
          title: "采购订单号",
          key: "orderNo",
          className: "tc"
        },
        {
          title: "入库单号",
          key: "serviceId",
          className: "tc",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  cursor: "pointer",
                  color: "#87CEFA"
                },
                on: {
                  click: async () => {
                    this.onStock = true;
                    let obj = {
                      orderCode: params.row.serviceId,
                      orderType: params.row.serviceType.value
                    };
                    let res = await this.getList(obj);
                    res.detailed.map(item => {
                      item.orderCode = params.row.serviceId;
                      item.orderType = params.row.serviceType.value;
                      item.orgId = params.row.orgId;
                      item.guestId = params.row.guestId;
                    });
                    this.data4 = res.detailed;
                  }
                }
              },
              params.row.serviceId
            );
          }
        },
        {
          title: "来源",
          key: "serviceSourceName",
          className: "tc"
        },
        {
          title: "业务类型",
          key: "serviceTypeName",
          className: "tc"
        },
        {
          title: "含税标志",
          key: "taxSignName",
          className: "tc"
        },
        // {
        //   title: "油品/配件",
        //   key: "speciesName",
        //   className: "tc"
        // },
        {
          title: "转单日期",
          key: "transferDate",
          className: "tc"
        },
        {
          title: "应付金额",
          key: "rpAmt",
          className: "tc"
        },
        {
          title: "已付金额",
          key: "charOffAmt",
          className: "tc"
        },
        {
          title: "未付金额",
          key: "noCharOffAmt",
          className: "tc"
        },
        {
          title: "业务员",
          key: "salesman",
          className: "tc"
        },
        {
          title: "已对账金额",
          key: "accountAmt",
          className: "tc"
        },
        {
          title: "未对账金额",
          key: "noAccountAmt",
          className: "tc"
        },
        {
          title: "草稿金额",
          key: "draftAmt",
          className: "tc"
        },
        {
          title: "备注",
          key: "remark",
          className: "tc"
        },
        {
          title: "对账门店",
          key: "accountOrgName",
          className: "tc"
        },
        {
          title: "对账人",
          key: "accountMan",
          className: "tc"
        },
        {
          title: "对账订单",
          key: "accountNo",
          className: "tc"
        }
      ],
      columns3: [
        {
          title: "序号",
          type: "index",
          width: 40,
          className: "tc"
        },
        {
          title: "配件编码",
          key: "partCode",
          className: "tc"
        },
        {
          title: "配件名称",
          key: "partName",
          className: "tc"
        },
        {
          title: "配件规格",
          key: "specification",
          className: "tc"
        },
        {
          title: "配件车型",
          key: "carModel",
          className: "tc"
        },
        {
          title: "配件品牌",
          key: "partBrand",
          className: "tc"
        },
        {
          title: "配件厂牌",
          key: "factoryBrand",
          className: "tc"
        },
        {
          title: "OEM码",
          key: "oemCode",
          className: "tc"
        },
        {
          title: "税率",
          key: "taxRate",
          className: "tc"
        },
        {
          title: "数量",
          key: "qty",
          className: "tc"
        },
        {
          title: "单位",
          key: "unitId",
          className: "tc"
        },
        {
          title: "单价",
          key: "price",
          className: "tc"
        },
        {
          title: "金额",
          key: "orderAmt",
          className: "tc"
        },
        {
          title: "备注",
          key: "remark",
          className: "tc"
        }
      ],
      columns4: [
        {
          title: "序号",
          type: "index",
          width: 40,
          className: "tc"
        },
        {
          title: "门店名称",
          key: "orgName",
          className: "tc"
        },
        {
          title: "是否直发",
          key: "isDirect",
          className: "tc"
        },
        {
          title: "配件编码",
          key: "partCode",
          className: "tc"
        },
        {
          title: "配件名称",
          key: "partName",
          className: "tc"
        },
        {
          title: "配件规格",
          key: "specification",
          className: "tc"
        },
        {
          title: "配件车型",
          key: "carModel",
          className: "tc"
        },
        {
          title: "配件品牌",
          key: "partBrand",
          className: "tc"
        },
        {
          title: "配件厂牌",
          key: "factoryBrand",
          className: "tc"
        },
        {
          title: "OEM码",
          key: "oemCode",
          className: "tc"
        },
        {
          title: "税率",
          key: "taxRate",
          className: "tc"
        },
        {
          title: "数量",
          key: "qty",
          className: "tc"
        },
        {
          title: "单位",
          key: "unitId",
          className: "tc"
        },
        {
          title: "单价",
          key: "price",
          className: "tc"
        },
        {
          title: "金额",
          key: "orderAmt",
          className: "tc"
        },
        {
          title: "备注",
          key: "remark",
          className: "tc"
        },
        {
          title: "不含税价格",
          key: "noTaxPrice",
          className: "tc",
          render: (h, params) => {
            let noTaxPrice = parseFloat(params.row.noTaxPrice || 0).toFixed(2);
            return h("span", noTaxPrice);
          }
        },
        {
          title: "不含税金额",
          key: "noTaxAmt",
          className: "tc",
          render: (h, params) => {
            let noTaxPrice = parseFloat(params.row.noTaxAmt || 0).toFixed(2);
            return h("span", noTaxPrice);
          }
        },
        {
          title: "含税单价",
          key: "taxPrice",
          className: "tc",
          render: (h, params) => {
            let noTaxPrice = parseFloat(params.row.taxPrice || 0).toFixed(2);
            return h("span", noTaxPrice);
          }
        },
        {
          title: "含税金额",
          key: "taxAmt",
          className: "tc",
          render: (h, params) => {
            let noTaxPrice = parseFloat(params.row.taxAmt || 0).toFixed(2);
            return h("span", noTaxPrice);
          }
        }
      ],
      data1: [],
      data2: [],
      data3: [],
      data4: []
    };
  },
  methods: {
    async getList(obj) {
      let detailed = [];
      await getNumberList(obj).then(res => {
        res.data.map((item, index) => {
          item.num = index + 1;
        });
        detailed = res.data;
      })
      return { detailed };
    },
    // 对话框是否显示
    visChange(flag) {
      if (flag) {
        this.dataloading1=true
        detailsDocuments(this.infoData).then(res => {
          if (res.code === 0) {
            this.data1 =( res.data.one || []).map(el=>{
              el.guestTypeName=el.guestType.name;
              return el;
            });
            this.data2 =(  res.data.two || []).map(el=>{
              el.guestTypeName=el.guestType.name;
              return el;
            });;
            this.dataloading1=false;
          }else{
            this.dataloading1=false;
          }
        }).catch(err=>{
          this.dataloading1=false;
        })
      }else{
        this.data1=[];
        this.data2=[]
      }
    },
    // 表格合计方式
    handleSummary({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "合计";
          }
          if (
            [
              "rpAmt",
              "charOffAmt",
              "noCharOffAmt",
              "accountAmt",
              "noAccountAmt",
              "draftAmt",
            ].includes(column.property)
          ) {
            return this.$utils.sum(data, column.property);
          }
          return null;
        })
      ];
      // const sums = {};
      // columns.forEach((column, index) => {
      //   const key = column.key;
      //   if (column._index === 0) {
      //     sums[key] = {
      //       key,
      //       value: "合计"
      //     };
      //     return;
      //   }
      //   const values = data.map(item => Number(item[key]));
      //   if (column.title.indexOf('金额')!=-1) {
      //     if (!values.every(value => isNaN(value))) {
      //       const v = values.reduce((prev, curr) => {
      //         const value = Number(curr);
      //         if (!isNaN(value)) {
      //           return prev + curr;
      //         } else {
      //           return prev;
      //         }
      //       }, 0);
      //       sums[key] = {
      //         key,
      //         value: v.toFixed(2)
      //       };
      //     }else {
      //       sums[key] = {
      //         key,
      //         value: 0
      //       };
      //     }
      //   } else {
      //     sums[key] = {
      //       key,
      //       value: " "
      //     };
      //   }
      // });
      // return sums;
    },
    async openData3(row){
      if (row.serviceTypeName == "销售出库") {
        this.title = "出库明细";
      } else {
        this.title = "退货明细";
      }
      this.outStock = true;
      let obj = {
        orderCode: row.serviceId,
        orderType:row.serviceType.value
      };
      let res = await this.getList(obj);
      res.detailed.map(item => {
        item.orderCode = row.serviceId;
        item.orderType = row.serviceType.value;
        item.orgId = row.orgId;
        item.guestId = row.guestId;
      });
      this.data3 = res.detailed;
    },
    async openData4(row){
      this.onStock = true;
      let obj = {
        orderCode:  row.serviceId,
        orderType:  row.serviceType.value
      };
      let res = await this.getList(obj);
      res.detailed.map(item => {
        item.orderCode =  row.serviceId;
        item.orderType =  row.serviceType.value;
        item.orgId =  row.orgId;
        item.guestId =  row.guestId;
      });
      this.data4 = res.detailed;
    },
    // 出/入库明细导出
    exportDetail(type) {
      if (type) {
        this.$refs.warehousing.exportCsv({
          filename: "入库单配件明细"
        });
      } else {
        this.$refs.noWarehousing.exportCsv({
          filename: "出库单配件明细"
        });
      }
    }
  }
};
</script>
