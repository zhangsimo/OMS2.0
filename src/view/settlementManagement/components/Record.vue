<template>
  <Table class="mt10" border :columns="columns1" :data="data1"></Table>
</template>
<script>
export default {
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
        {
          title: "收付款业务类型",
          key: "furpose",
          align: "center"
        },
        {
          title: "往来单位",
          key: "guestName",
          align: "center"
        },
        {
          title: "收付款方式",
          key: "sortName",
          align: "center"
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
          align: "center"
        },
        {
          title: "审核状态",
          key: "startStatusName",
          align: "center"
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
      data1: []
    };
  }
};
</script>