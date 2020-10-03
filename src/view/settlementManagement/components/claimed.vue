<template>
  <div>
    <Table
      border
      class="mt10"
      :columns="claimed"
      :data="claimedData"
      max-height="400"
      @on-selection-change="claimedSelection"
    ></Table>
    <Page
      show-sizer
      show-total
      show-elevator
      class="mt10 tr"
      size="small"
      :total="claimedPage.total"
      :current="claimedPage.page"
      :page-size="claimedPage.size"
      @on-change="pageChangeAmt"
      @on-page-size-change="sizeChangeAmt"
    />
  </div>
</template>
<script>
  import * as api from "@/api/settlementManagement/advanceCharge";
  import {mapGetters, mapMutations} from "vuex";
  import bus from '@/view/settlementManagement/bill/Popup/Bus'
  // import bus from '../bill/Popup/Bus'
  export default {
    data() {
      return {
        claimedPage: {
          page: 1,
          total: 0,
          size: 10
        }, //本店待认领款分页
        currentClaimed: [], //本店待认领款选中的数据
        claimed: [
          {
            title: "选择",
            type: "selection",
            align: "center",
            resizable: true,
            width: 40
          },
          {
            title: "序号",
            type: "index",
            align: "center",
            resizable: true,
            width: 40
          },
          {
            title: "业务类别",
            key: "businessType",
            align: "center",
            resizable: true,
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
                    title: params.row.businessType
                  }
                }, params.row.businessType)
              ])
            }
          },
          {
            title: "发生日期",
            key: "createTime",
            align: "center",
            resizable: true,
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
                    title: params.row.createTime
                  }
                }, params.row.createTime)
              ])
            }
          },
          {
            title: "收入金额",
            key: "incomeMoney",
            align: "center",
            resizable: true,
            minWidth: 100
          },
          {
            title: "支出金额",
            key: "paidMoney",
            align: "center",
            resizable: true,
            minWidth: 100
          },
          {
            title: "未认领金额",
            key: "unClaimedAmt",
            align: "center",
            resizable: true,
            minWidth: 100
          },
          {
            title: "对方户名",
            key: "reciprocalAccountName",
            align: "center",
            resizable: true,
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
                    title: params.row.reciprocalAccountName
                  }
                }, params.row.reciprocalAccountName)
              ])
            }
          },
          {
            title: "智能匹配往来单位",
            key: "suppliers",
            align: "center",
            resizable: true,
            minWidth: 160,
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
                    title: params.row.suppliers
                  }
                }, params.row.suppliers)
              ])
            }
          },
          {
            title: "所属区域",
            key: "area",
            align: "center",
            resizable: true,
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
                    title: params.row.area
                  }
                }, params.row.area)
              ])
            }
          },
          {
            title: "所属门店",
            key: "shopName",
            align: "center",
            resizable: true,
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
                    title: params.row.shopName
                  }
                }, params.row.shopName)
              ])
            }
          },
          {
            title: "所属店号",
            key: "shopCode",
            align: "center",
            resizable: true,
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
                    title: params.row.shopCode
                  }
                }, params.row.shopCode)
              ])
            }
          },
          {
            title: "账户",
            key: "accountName",
            align: "center",
            resizable: true,
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
                    title: params.row.accountName
                  }
                }, params.row.accountName)
              ])
            }
          },
          {
            title: "账号",
            key: "accountCode",
            align: "center",
            resizable: true,
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
                    title: params.row.accountCode
                  }
                }, params.row.accountCode)
              ])
            }
          },
          {
            title: "开户行",
            key: "bankName",
            align: "center",
            resizable: true,
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
                    title: params.row.bankName
                  }
                }, params.row.bankName)
              ])
            }
          },
          {
            title: "对应科目",
            key: "mateAccountName",
            align: "center",
            resizable: true,
            minWidth: 100
          },
          {
            title: "已认领金额",
            key: "claimedAmt",
            align: "center",
            resizable: true,
            minWidth: 100
          },
          {
            title: "交易备注",
            key: "tradingNote",
            align: "center",
            resizable: true,
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
                    title: params.row.tradingNote
                  }
                }, params.row.tradingNote)
              ])
            }
          },
        ], //本店待认领款
        claimedData: [] //本店待认领款
      };
    },
    methods: {
      //本店待认领款选中的数据
      claimedSelection(selection) {
        if (selection.length !== 1 && selection.length) {
          let s = 0;
          let n = 0;
          selection.map(item => {
            if (item.incomeMoney) s++;
            if (item.paidMoney) n++;
          });
          if (!s && n || s && !n) {
            this.currentClaimed = selection;
          } else {
            this.$message.error("不能同时选中收入和支出");
          }
        } else {
          this.currentClaimed = selection;
        }
        bus.$emit("paymentInfo", selection);
        this.$emit('selection', selection)
      },
      //本店待认领款页码
      pageChangeAmt(val) {
        this.claimedPage.page = val;
        this.$parent.$parent.$parent.claimedList()
      },
      //本店待认领款每页条数
      sizeChangeAmt(val) {
        this.claimedPage.page = 1;
        this.claimedPage.size = val;
        this.$parent.$parent.$parent.claimedList()
      }
    },
    watch: {
      currentClaimed: {
        handler(val, od) {
          if (val !== od) {
            if (this.$parent.$parent.$parent.difference !== undefined) {
              const that = this.$parent.$parent.$parent
              that.claimedAmt = 0;
              val.map(item => {
                if (item.paidMoney) {
                  that.claimedAmt += item.paidMoney * 1;
                } else {
                  that.claimedAmt += item.incomeMoney * 1;
                }
              });
              that.difference = that.currentAccount.actualCollectionOrPayment
                ? that.currentAccount.actualCollectionOrPayment - that.claimedAmt
                : 0 - that.claimedAmt;
            }
          }
        },
        deep: true
      }
    }
  };
</script>
