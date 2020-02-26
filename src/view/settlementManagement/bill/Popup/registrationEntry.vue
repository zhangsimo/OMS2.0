<template>
  <Modal v-model="modal1" title="进项登记及修改" width="1200">
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="addAccount"
      v-has="'examine'"
    >增加核销对账单</button>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="submission"
      v-has="'examine'"
    >保存并提交</button>
    <h4 class="mt10 mb10">分店名称：</h4>
    <Table
      class="mt10 mb10"
      border
      :columns="account"
      :data="accountData"
      show-summary
      :summary-method="billSum"
    ></Table>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="submission"
      v-has="'examine'"
    >添加行</button>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="submission"
      v-has="'examine'"
    >删除行</button>
    <div slot="footer"></div>
    <account ref="account" />
  </Modal>
</template>
<script>
import account from './accountregistration'
export default {
  components:{
    account
  },
  data() {
    return {
      modal1: false, //弹窗显示
      account: [
        {
          title: "序号",
          key: "index",
          width: 40,
          className: "tc"
        },
        {
          title: "公司名称",
          key: "orgName",
          className: "tc"
        },
        {
          title: "对账单号",
          key: "accountNo",
          className: "tc"
        },
        {
          title: "往来单位",
          key: "accountNo",
          className: "tc"
        },
        {
          title: "对账应付",
          key: "accountNo",
          className: "tc"
        },
        {
          title: "应付返利",
          key: "accountNo",
          className: "tc"
        },
        {
          title: "应付坏账",
          key: "accountNo",
          className: "tc"
        },
        {
          title: "应付合计",
          key: "accountNo",
          className: "tc",
          render:(h, params) => {
            return h('span',params.row.accountNo)
          }
        },
        {
          title: "已收进项金额",
          key: "accountNo",
          className: "tc",
          render:(h, params) => {
            return h('span',params.row.accountNo)
          }
        },
        {
          title: "剩余进项未收",
          key: "accountNo",
          className: "tc",
          render:(h, params) => {
            return h('span',params.row.accountNo)
          }
        }
      ], //对账单
      accountData: [] //对账单
    };
  },
  methods: {
    // 保存并提交
    submission() {},
    //增加核销对账单
    addAccount() {
      this.$refs.account.modal1=true
    },
    // 表格合计
    billSum({ columns, data }) {
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
        if (index > 2) {
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
    }
  }
};
</script>