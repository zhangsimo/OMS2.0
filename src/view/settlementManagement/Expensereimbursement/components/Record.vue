<template>
  <div>
    <Table
      class="mt10"
      border
      :columns="columns1"
      :data="recordLists"
    ></Table>
    <!--show-summary-->
    <!--:summary-method="handleSummary"-->
  </div>
</template>
<script>
import * as api from "_api/settlementManagement/advanceCharge";
export default {
  props: ["serviceId"],
  data() {
    return {
      columns1: [
        {
          title: "序号",
          type: "index",
          align: "center",
          width: 40,
          resizable:true,
        },
        {
          title: "报销申请单号",
          key: "accountNo",
          tooltip: true,
          align: "center",
          width: 100,
          resizable:true,
        },
        {
          title: "报销付款/核销单号",
          key: "fno",
          tooltip: true,
          width: 120,
          align: "center",
          resizable:true
        },
        {
          title: "付款时间",
          key: "rpDate",
          tooltip: true,
          width: 100,
          align: "center",
          resizable:true
        },
        {
          title: "付款人",
          key: "createUname",
          tooltip: true,
          align: "center",
          width: 80,
          resizable:true
        },
        {
          title: "核销方式",
          key: "",
          align: "center",
          width: 100,
          resizable:true,
          render: (h, p) => {
            let val = "";
            if (p.row.furpose) {
              val = p.row.furpose.name;
            }
            return h("span", val);
          }
        },
        {
          title: "付款方式",
          key: "",
          align: "center",
          width: 100,
          resizable:true,
          render: (h, p) => {
            let val = "";
            if (p.row.sort) {
              val = p.row.sort.name;
            }
            return h("span", val);
          }
        },
        {
          title: "账户所属门店",
          key: "accountStoreName",
          tooltip: true,
          align: "center",
          width: 120,
          resizable:true,
        },
        {
          title: "付款账户",
          key: "account",
          tooltip: true,
          align: "center",
          width: 100,
          resizable:true,
        },
        {
          title: "付款开户行",
          key: "accountBank",
          tooltip: true,
          align: "center",
          width: 110,
          resizable:true,
        },
        {
          title: "付款账号",
          key: "accountBankNo",
          tooltip: true,
          align: "center",
          width: 100,
          resizable:true,
        },
        {
          title: "对方收款户名",
          key: "otherAccountName",
          tooltip: true,
          align: "center",
          width: 120,
          resizable:true,
        },
        {
          title: "对方收款开户行",
          key: "otherAccountBank",
          tooltip: true,
          align: "center",
          width: 120,
          resizable:true,
        },
        {
          title: "对方收款账号",
          key: "otherAccountBankNo",
          tooltip: true,
          align: "center",
          width: 120,
          resizable:true,
        },
        {
          title: "付款金额",
          key: "checkAmt",
          tooltip: true,
          align: "center",
          width: 100,
          resizable:true,
          // render: (h , p) => {
          //   let val = p.row.checkAmt
          //   if (p.row.sort.name == '付款'){
          //       val = - val
          //   }
          //   return h('span' , val)
          // }
        },
        {
          title: "审核状态",
          key: "",
          align: "center",
          width: 100,
          resizable:true,
          render: (h, p) => {
            let val = "";
            if (p.row.startStatus) {
              val = p.row.startStatus.name;
            }
            return h("span", val);
          }
        },
        {
          title: "审核人",
          key: "auditor",
          align: "center",
          width: 70,
          resizable:true,
        },
        {
          title: "审核日期",
          key: "auditorDate",
          tooltip: true,
          align: "center",
          width: 100,
          resizable:true,
        },
        {
          title: "备注",
          key: "remark",
          tooltip: true,
          align: "center",
          width: 100,
          resizable:true,
        }
      ],
      recordLists: [],
    };
  },
  methods: {
    async init() {
      if(!this.$parent.serviceId) {
        this.recordLists = []
      } else {
        let res = await api.findByAccountNo({ accountNo: this.$parent.serviceId });
        if(res.code == 0) {
          if(res.data&&res.data.length>0){
            res.data.map( item => {
              if (item.sort.name == '付款'){
                item.checkAmt = -item.checkAmt
              }
            })
            this.recordLists = res.data;
          }
        }
      }
    },
    handleSummary({ columns, data }) {
      const sums = {};
      columns.forEach((column, index) => {
        const key = column.key;
        if (index === 0) {
          sums[key] = {
            key,
            value: "合计 ： "
          };
          return;
        }
        if (key == "checkAmt") {
          const values = data.map(item => Number(item[key]));
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
              value: v
            };
          }
        } else {
          sums[key] = {
            key,
            value: ""
          };
        }
      });
      return sums;
    }
  }
};
</script>
