<template>
  <div>
    <Table
      border
      class="mt10"
      :columns="claimed"
      :data="claimedData"
      max-height="400"
      highlight-row
      @on-current-change="claimedSelection"
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
import * as api from "_api/settlementManagement/advanceCharge";
import { mapGetters,mapMutations } from "vuex";
import bus from '../../bill/Popup/Bus'
export default {
  data() {
    return {
      claimedPage: {
        page: 1,
        total: 0,
        size: 10
      }, //本店待认领款分页
      claimed: [
        {
          title: "序号",
          type: "index",
          align: "center",
          width: 40
        },
        {
          title: "业务类别",
          key: "businessType",
          align: "center"
        },
        {
          title: "所属区域",
          key: "area",
          align: "center"
        },
        {
          title: "所属门店",
          key: "shopName",
          align: "center"
        },
        {
          title: "所属店号",
          key: "shopCode",
          align: "center"
        },
        {
          title: "账户",
          key: "accountName",
          align: "center"
        },
        {
          title: "账号",
          key: "accountCode",
          align: "center"
        },
        {
          title: "开户行",
          key: "bankName",
          align: "center"
        },
        {
          title: "对应科目",
          key: "mateAccountName",
          align: "center"
        },
        {
          title: "发生日期",
          key: "createTime",
          align: "center"
        },
        {
          title: "收入金额",
          key: "incomeMoney",
          align: "center"
        },
        {
          title: "支出金额",
          key: "paidMoney",
          align: "center"
        },
        {
          title: "对方户名",
          key: "reciprocalAccountName",
          align: "center"
        },
        {
          title: "交易备注",
          key: "tradingNote",
          align: "center"
        },
        {
          title: "智能匹配往来单位",
          key: "suppliers",
          align: "center"
        }
      ], //本店待认领款
      claimedData: [] ,//本店待认领款
      currentClaimed:{}
    };
  },
  methods: {
    //本店待认领款选中的数据
    claimedSelection(selection) {
      this.currentClaimed = selection
      bus.$emit("paymentInfo", [selection]);
      this.$emit('selection',selection)
    },
    //本店待认领款页码
    pageChangeAmt(val) {
      this.claimedPage.page = val;
      let type = ""
      switch (this.$store.state.businessBorrowing.claimType) {
        case 2:
          type = 2
          break;
        case 3:
          type = 1
          break;
        default:
          break;
      }
      this.$parent.$parent.claimedList(type)
    },
    //本店待认领款每页条数
    sizeChangeAmt(val) {
      this.claimedPage.page = 1;
      this.claimedPage.size = val;
      let type = ""
      switch (this.$store.state.businessBorrowing.claimType) {
        case 2:
          type = 2
          break;
        case 3:
          type = 1
          break;
        default:
          break;
      }
      this.$parent.$parent.claimedList(type)
    }
  },
  watch: {
    currentClaimed: {
      handler(val, od) {
        if (val !== od) {
          if(this.$parent.difference!==undefined){
            const that = this.$parent
            that.claimedAmt = 0;
            val.map(item => {
              if(item.paidMoney) {
                that.claimedAmt += item.paidMoney * 1;
              } else{
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
