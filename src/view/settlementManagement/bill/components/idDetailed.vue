<template>
  <Modal v-model="modal1" title="对账单号明细" width="1200" @on-visible-change="visChange">
    <Tabs class="mt10">
      <Tab-pane label="销售清单" name="key1">
        <Table
          border
          :columns="columns1"
          :data="data1"
          class="mt10"
          max-height="400"
          show-summary
          :summary-method="handleSummary"
          ref="sale"
        ></Table>
      </Tab-pane>
      <Tab-pane label="采购清单" name="key2">
        <Table
          border
          :columns="columns2"
          :data="data2"
          class="mt10"
          max-height="400"
          show-summary
          :summary-method="handleSummary"
          ref="purchase"
        ></Table>
      </Tab-pane>
    </Tabs>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import { getSalelist } from "@/api/bill/saleOrder";
export default {
  data() {
    return {
      guestId: "",
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
          key: "orgId",
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
          className: "tc"
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
        {
          title: "油品/配件",
          key: "speciesName",
          className: "tc"
        },
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
          key: "orgId",
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
          className: "tc"
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
        {
          title: "油品/配件",
          key: "speciesName",
          className: "tc"
        },
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
      data1: [],
      data2: []
    };
  },
  methods: {
    // 对话框是否显示
    visChange(flag) {
      if (flag) {
        getSalelist({guestId:this.guestId}).then(res => {
          console.log(res)
          if(res.code===0){
            this.data1 = res.data.one
            this.data2 = res.data.two
          }
        });
      }
    },
    // 表格合计方式
    handleSummary({ columns, data }) {
      const sums = {};
      columns.forEach((column, index) => {
        const key = column.key;
        if (index === 0) {
          sums[key] = {
            key,
            value: "合计"
          };
          return;
        }
        const values = data.map(item => Number(item[key]));
        if (index > 11 && index < 19 && index !== 15) {
          if (!values.every(value => isNaN(value))) {
            const v = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[key] = {
              key,
              value: v.toFixed(2)
            };
          }
        } else {
          sums[key] = {
            key,
            value: " "
          };
        }
      });
      return sums;
      //
    }
  }
};
</script>