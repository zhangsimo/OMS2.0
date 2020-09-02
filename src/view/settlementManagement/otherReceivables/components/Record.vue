<template>
  <Table
    class="mt10"
    border
    :columns="columns1"
    :data="recordLists"
  ></Table>
  <!--show-summary-->
  <!--:summary-method="handleSummary"-->
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
          title: "收付款单号",
          key: "fno",
          align: "center"
        },
        {
          title: "对账单号",
          key: "accountNo",
          align: "center"
        },
        {
          title: "收款人/付款人",
          key: "createUname",
          align: "center"
        },
        {
          title: "收付款时间",
          key: "rpDate",
          align: "center"
        },
        // {
        //   title: "收付款业务类型",
        //   key: "furpose",
        //   align: "center",
        //   render: (h, p) => {
        //     let val = p.row.furpose.name;
        //     return h("span", val);
        //   }
        // },
        {
          title: "核销方式",
          key: "",
          align: "center",
          render: (h, p) => {
            let val = p.row.furpose.name;
            return h("span", val);
          }
        },
        {
          title: "往来单位",
          key: "guestName",
          align: "center"
        },
        {
          title: "收付款类型",
          key: "sort",
          align: "center",
          render: (h, p) => {
            let val = p.row.sort.name;
            return h("span", val);
          }
        },
        {
          title: "账户所属门店",
          key: "accountStoreName",
          align: "center"
        },
        {
          title: "收付款账户",
          key: "account",
          align: "center"
        },
        {
          title: "收付款开户行",
          key: "accountBank",
          align: "center"
        },
        {
          title: "收付款账号",
          key: "accountBankNo",
          align: "center"
        },
        {
          title: "对方户名",
          key: "otherAccountName",
          align: "center"
        },
        {
          title: "对方开户行",
          key: "otherAccountBank",
          align: "center"
        },
        {
          title: "对方账号",
          key: "otherAccountBankNo",
          align: "center"
        },
        {
          title: "收付款金额",
          key: "checkAmt",
          align: "center",
          // render: (h, p) => {
          //   let Number = p.row.checkAmt;
          //   let val = p.row.sort.value;
          //  if(val == 0){
          //    Number = -Number
          //  }
          //   return h("span", Number);
          // }
        },
        {
          title: "审核状态",
          key: "startStatus",
          align: "center",
          render: (h, p) => {
            let val = p.row.startStatus.name;
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
          this.recordLists = res.data;
          if(this.recordLists.length > 0 ){
            this.$emit('Message',this.recordLists)
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
            value: "总价"
          };
          return;
        }
        if (key === "checkAmt") {
          const values = data.map(item => {
            return item.sort.value === 0 ? -Number(item[key]) : Number(item[key]);
          });
          if (!values.every(value => isNaN(value))) {
            const v = values.reduce((prev, curr) => {
              const valuea = Number(curr);
              if (!isNaN(valuea)) {
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
