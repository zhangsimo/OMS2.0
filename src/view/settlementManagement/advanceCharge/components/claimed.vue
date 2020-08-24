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
import * as api from "_api/settlementManagement/advanceCharge";
import { mapGetters, mapMutations } from "vuex";
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
          width: 40
        },
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
          key: "supliers",
          align: "center"
        }
      ], //本店待认领款
      claimedData: [] //本店待认领款
    };
  },
  computed: {
    ...mapGetters(["getClaimedSearch"]),
  },
  methods: {
    ...mapMutations(["setClaimedSelectionList"]),
    init() {
      this.claimedPage = {
        page: 1,
        total: 0,
        size: 10
      }
      this.getList();
    },
    //本店待认领款选中的数据
    claimedSelection(selection) {
      if (selection.length !== 1 && selection.length) {
        let s = 0;
        let n = 0;
        selection.map(item => {
          if (item.incomeMoney) s++;
          if (item.paidMoney) n++;
        });
        if (!s && n||s&&!n) {
          this.currentClaimed = selection;
        } else {
          this.$message.error("不能同时选中收入和支出");
        }
      } else {
        this.currentClaimed = selection;
      }
      this.setClaimedSelectionList(this.currentClaimed);
      this.$emit("selection", this.currentClaimed);
    },
    // 获取数据
    async getList() {
      let body = {
        size: this.claimedPage.size,
        page: this.claimedPage.page - 1,
        ...this.getClaimedSearch,
      }
      let res = await api.findPageToBeClaimedFund(body);
      if (res.code == 0) {
        this.currentClaimed = [];
        this.claimedData = res.data.content;
        this.claimedPage.total = res.data.totalElements;
      }
    },
    //本店待认领款页码
    pageChangeAmt(val) {
      this.claimedPage.page = val;
      this.getList();
    },
    //本店待认领款每页条数
    sizeChangeAmt(val) {
      this.claimedPage.page = 1;
      this.claimedPage.size = val;
      this.getList();
    }
  }
};
</script>
