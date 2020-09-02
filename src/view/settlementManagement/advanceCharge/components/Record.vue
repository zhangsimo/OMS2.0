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
  props: {
    service:''
  },
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
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.fno
                }
              }, params.row.fno)
            ])
          }
        },
        {
          title: "对账单号",
          key: "accountNo",
          align: "center",
          minWidth: 80,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.accountNo
                }
              }, params.row.accountNo)
            ])
          }
        },
        {
          title: "收款人/付款人",
          key: "createUname",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.createUname
                }
              }, params.row.createUname)
            ])
          }
        },
        {
          title: "收付款时间",
          key: "rpDate",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.rpDate
                }
              }, params.row.rpDate)
            ])
          }
        },
        {
          title: "收付款业务类型",
          key: "furpose",
          align: "center",
          minWidth: 120,
          render: (h, p) => {
            let val = p.row.furpose.name;
            return h("span", val);
          }
        },
        {
          title: "往来单位",
          key: "guestName",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.guestName
                }
              }, params.row.guestName)
            ])
          }
        },
        {
          title: "收付款方式",
          key: "sort",
          align: "center",
          minWidth: 100,
          render: (h, p) => {
            let val = p.row.sort.name;
            return h("span", val);
          }
        },
        {
          title: "账户所属门店",
          key: "accountStoreName",
          align: "center",
          minWidth: 120,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.accountStoreName
                }
              }, params.row.accountStoreName)
            ])
          }
        },
        {
          title: "收付款账户",
          key: "account",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.account
                }
              }, params.row.account)
            ])
          }
        },
        {
          title: "收付款开户行",
          key: "accountBank",
          align: "center",
          minWidth: 120,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.accountBank
                }
              }, params.row.accountBank)
            ])
          }
        },
        {
          title: "收付款账号",
          key: "accountBankNo",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.accountBankNo
                }
              }, params.row.accountBankNo)
            ])
          }
        },
        {
          title: "对方户名",
          key: "otherAccountName",
          align: "center",
          minWidth: 80,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.otherAccountName
                }
              }, params.row.otherAccountName)
            ])
          }
        },
        {
          title: "对方开户行",
          key: "otherAccountBank",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.otherAccountBank
                }
              }, params.row.otherAccountBank)
            ])
          }
        },
        {
          title: "对方账号",
          key: "otherAccountBankNo",
          align: "center",
          minWidth: 80,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.otherAccountBankNo
                }
              }, params.row.otherAccountBankNo)
            ])
          }
        },
        {
          title: "收付款金额",
          key: "checkAmt",
          align: "center",
          minWidth: 100,
          // render: (h, p) => {
          //   let val = p.row.sort.value == "0" ? -p.row.checkAmt : p.row.checkAmt;
          //   return h("span", val);
          // }
        },
        {
          title: "审核状态",
          key: "startStatus",
          align: "center",
          minWidth: 80,
          render: (h, p) => {
            let val = p.row.startStatus.name;
            return h("span", val);
          }
        },
        {
          title: "审核人",
          key: "auditor",
          align: "center",
          minWidth: 70,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.auditor
                }
              }, params.row.auditor)
            ])
          }
        },
        {
          title: "审核日期",
          key: "auditorDate",
          align: "center",
          minWidth: 80,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.auditorDate
                }
              }, params.row.auditorDate)
            ])
          }
        },
        {
          title: "备注",
          key: "remark",
          align: "center",
          minWidth: 60,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.remark
                }
              }, params.row.remark)
            ])
          }
        }
      ],
      recordLists: [],
    };
  },
  methods: {
    async init() {

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
  },
  watch:{
    service: async function(val) {
      if (!val)  return  this.recordLists =[]
      let res = await api.findByAccountNo({ accountNo: val});
      if(res.code == 0) {
        this.recordLists = res.data;
        this.recordLists.map(item => {
          item.checkAmt = item.sort.value == 0 ? -item.checkAmt : item.checkAmt;
        })
      }
    }
  }
};
</script>
