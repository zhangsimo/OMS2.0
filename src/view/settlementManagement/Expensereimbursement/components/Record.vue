<template>
  <div>
    <Table
      class="mt10"
      border
      show-summary
      :summary-method="handleSummary"
      :columns="columns1"
      :data="recordLists"
    ></Table>
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
          width: 40
        },
        {
          title: "报销申请单号",
          key: "accountNo",
          align: "center"
        },
        {
          title: "报销付款/核销单号",
          key: "fno",
          align: "center"
        },
        {
          title: "付款时间",
          key: "rpDate",
          align: "center"
        },
        {
          title: "付款人",
          key: "createUname",
          align: "center"
        },
        {
          title: "核销方式",
          key: "",
          align: "center",
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
          align: "center"
        },
        {
          title: "付款账户",
          key: "account",
          align: "center"
        },
        {
          title: "付款开户行",
          key: "accountBank",
          align: "center"
        },
        {
          title: "付款账号",
          key: "accountBankNo",
          align: "center"
        },
        {
          title: "对方收款户名",
          key: "otherAccountName",
          align: "center"
        },
        {
          title: "对方收款开户行",
          key: "otherAccountBank",
          align: "center"
        },
        {
          title: "对方收款账号",
          key: "otherAccountBankNo",
          align: "center"
        },
        {
          title: "付款金额",
          key: "checkAmt",
          align: "center",
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
          align: "center"
        },
        {
          title: "审核日期",
          key: "auditorDate",
          align: "center"
        },
        {
          title: "备注",
          key: "remark",
          align: "center"
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
