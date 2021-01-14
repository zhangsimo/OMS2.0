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
            resizable: true,
            width: 40
          },
          {
            title: "收付款单号",
            key: "fno",
            tooltip: true,
            resizable: true,
            width: 150,
            align: "center"
          },
          {
            title: "对账单号",
            key: "accountNo",
            tooltip: true,
            resizable: true,
            width: 150,
            align: "center"
          },
          {
            title: "收款人/付款人",
            key: "createUname",
            tooltip: true,
            resizable: true,
            width: 100,
            align: "center"
          },
          {
            title: "收付款时间",
            key: "rpDate",
            tooltip: true,
            resizable: true,
            width: 150,
            align: "center"
          },
          // {
          //   title: "收付款业务类型",
          //   key: "furpose",
          //   align: "center",
//resizable: true,
          //   render: (h, p) => {
          //     let val = p.row.furpose.name;
          //     return h("span", val);
          //   }
          // },
          {
            title: "核销方式",
            key: "",
            align: "center",
            resizable: true,
            width: 150,
            render: (h, p) => {
              let val = p.row.furpose.name;
              return h("span", val);
            }
          },
          {
            title: "往来单位",
            key: "guestName",
            tooltip: true,
            resizable: true,
            width: 150,
            align: "center"
          },
          {
            title: "收付款类型",
            key: "sort",
            align: "center",
            resizable: true,
            width: 150,
            render: (h, p) => {
              let val = p.row.sort.name;
              return h("span", val);
            }
          },
          {
            title: "账户所属门店",
            key: "accountStoreName",
            tooltip: true,
            resizable: true,
            width: 150,
            align: "center"
          },
          {
            title: "收付款账户",
            key: "account",
            tooltip: true,
            resizable: true,
            width: 150,
            align: "center"
          },
          {
            title: "收付款开户行",
            key: "accountBank",
            tooltip: true,
            resizable: true,
            width: 150,
            align: "center"
          },
          {
            title: "收付款账号",
            key: "accountBankNo",
            tooltip: true,
            resizable: true,
            width: 150,
            align: "center"
          },
          {
            title: "对方户名",
            key: "otherAccountName",
            tooltip: true,
            resizable: true,
            width: 150,
            align: "center"
          },
          {
            title: "对方开户行",
            key: "otherAccountBank",
            tooltip: true,
            resizable: true,
            width: 150,
            align: "center"
          },
          {
            title: "对方账号",
            key: "otherAccountBankNo",
            tooltip: true,
            resizable: true,
            width: 150,
            align: "center"
          },
          {
            title: "收付款金额",
            key: "checkAmt",
            tooltip: true,
            width: 150,
            align: "center",
            resizable: true,
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
            resizable: true,
            width: 150,
            render: (h, p) => {
              let val = p.row.startStatus.name;
              return h("span", val);
            }
          },
          {
            title: "审核人",
            key: "auditor",
            tooltip: true,
            resizable: true,
            width: 150,
            align: "center"
          },
          {
            title: "审核日期",
            key: "auditorDate",
            tooltip: true,
            resizable: true,
            width: 150,
            align: "center"
          },
          {
            title: "备注",
            key: "remark",
            tooltip: true,
            resizable: true,
            width: 150,
            align: "center"
          }
        ],
        recordLists: [],
      };
    },
    methods: {
      async init() {
        if (!this.$parent.serviceId) {
          this.recordLists = []
        } else {
          let res = await api.findByAccountNo({accountNo: this.$parent.serviceId});
          if (res.code == 0) {
            if(res.data){
            this.recordLists = res.data;
            if (this.recordLists.length > 0) {
              this.$emit('Message', this.recordLists)
            }else{
              this.recordLists = []
              this.$emit('Message',this.recordLists)
            }
            }
          }
        }
      },
      handleSummary({columns, data}) {
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
