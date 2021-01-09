<template>
  <div style="width: 100%;height: 100%;background-color:#fff;">
    <section class="Creditbox">
      <div class="db mr10">
        <span>快速查询：</span>
        <quickDate @quickDate="getvalue" class="mr10" ref="quickDate"></quickDate>
        <span>调整日期：</span>
        <DatePicker
          @on-change="getDate"
          type="daterange"
          placement="bottom-start"
          placeholder="选择日期"
          class="w200 mr20"
        ></DatePicker>
        <Button @click="query" type="warning" class="mr10 w90">
          <Icon custom="iconfont iconchaxunicon icons" />查询
        </Button>
      </div>
    </section>
    <div>
      <Table
        class="table-highlight-row"
        :loading="loading"
        size="small"
        highlight-row
        border
        :stripe="true"
        :columns="columns"
        :data="staffList"
      ></Table>
    </div>
  </div>
</template>

<script>
import quickDate from "@/components/getDate/dateget";
import { getTableList } from "@/api/system/essentialData/lineOfCredit";
export default {
  name: "LineOfCredit",
  components: {
    quickDate
  },
  data() {
    return {
      loading: true,
      columns: [
        {
          type: "index",
          width: 50,
          align: "center",
          title: "序号"
        },
        {
          title: "客户名称",
          align: "center",
          key: "guestName"
        },
        {
          title: "调整时间",
          align: "center",
          key: "applyDate"
        },
        {
          title: "调整人",
          align: "center",
          key: "applyMan"
        },
        {
          title: "调整时应付",
          align: "center",
          key: "payableAmt"
        },
        {
          title: "调整时应收",
          align: "center",
          key: "receivableAmt"
        },
        {
          title: "调整时应收应付合计",
          align: "center",
          key: "sumAmt",
          width: "125px"
        },
        {
          title: "应收30天金额",
          align: "center",
          key: "thirtyAmt"
        },
        {
          title: "应收30-60天",
          align: "center",
          key: "sixtyAmt"
        },
        {
          title: "应收60天以上",
          align: "center",
          key: "moreSixtyAmt"
        },
        {
          title: "调整前临时额度",
          align: "center",
          render: (h, params) => {
            let tex =
              params.row.beforeAdjustTempQuota == null ? 0 : params.row.beforeAdjustTempQuota;
            return h("span", {}, tex);
          }
        },
        {
          title: "调整后临时额度",
          align: "center",
          render: (h, params) => {
            let tex =
              params.row.tempQuotaTotal == null ? 0 : params.row.tempQuotaTotal;
            return h("span", {}, tex);
          }
        },
        {
          title: "临时额度开始时间",
          align: "center",
          key: "tempStart"
        },
        {
          title: "临时额度结束时间",
          align: "center",
          key: "tempEnd"
        },
        {
          title: "调整后剩余额度",
          align: "center",
          render: (h, params) => {
            let tex =
              params.row.afterAdjustQuota == null
                ? 0
                : params.row.afterAdjustQuota;
            return h("span", {}, tex);
          }
        },
        {
          title: "是否禁止额度调整申请",
          align: "center",
          key: "auditSign",
          render:(h,p) => {
            let auditSign = p.row.auditSign?JSON.parse(p.row.auditSign):{};
            return h('span',auditSign&&auditSign.value==3?"是":"否");
          }
        },
        {
          title: "额度调整原因",
          align: "center",
          key: "quotaReason"
        },
      ],
      staffList: [],
      thisdata: [],
      dateVal: []
    };
  },
  created() {
    this.$refs.quickDate.searchQuick='1'
    this.getTable();
  },
  mounted() {
    this.$refs.quickDate.searchQuick='1'
  },
  methods: {
    // async getTable(date) {
    //   let { code, data } = await getTableList(date)
    //   if (code === 0) {
    //     this.staffList = data
    //     this.loading = false
    //   } else {
    //     this.loading = true
    //   }
    // },
    getTable() {
      let data = {};
      if (this.thisdata) {
        data.startTime = this.thisdata[0];
        data.endTime = this.thisdata[1];
      }
      if (this.dateVal[0]) {
        data.startTime = this.dateVal[0] + " " + "00:00:00";
        data.endTime = this.dateVal[1] + " " + "23:59:59";
      }
      data.adjustType = 1
      getTableList(data).then(res => {
        if (res.code === 0) {
          this.staffList = res.data;
          this.loading = false;
        } else {
          this.loading = true;
        }
      });
    },
    getvalue(date) {
      this.thisdata = date;
      this.getTable();
      // this.Date.startTime = date[0]
      // this.Date.endTime = date[1]
      // this.getTable(this.Date)
    },
    getDate(val) {
      this.dateVal = val;
    },
    query() {
      this.getTable();
    }
  }
};
</script>

<style scoped lang="less">
.Creditbox {
  padding-left: 10px;
  line-height: 57px;
  border-bottom: 1px #e0e0e0 solid;
}
</style>
