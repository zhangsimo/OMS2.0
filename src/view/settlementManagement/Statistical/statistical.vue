<template>
  <div class="content-oper content-oper-flex" style="background-color: #fff;">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr15">
            <span>快速查询：</span>
          </div>
          <div class="db mr15">
            <quick-date
              class="mr10"
              ref="quickDate"
              @quickDate="getDataQuick"
            ></quick-date>
          </div>
          <div class="db ml15">
            <span>起止日期：</span>
            <Date-picker
              v-model="dates"
              type="daterange"
              placeholder="选择日期"
              class="w200"
            ></Date-picker>
          </div>
          <div class="db ml15">
            <span>区域：</span>
            <Select v-model="areaId" class="w150">
              <Option
                v-for="item in areas"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </div>
          <div class="db ml15">
            <span>门店名称：</span>
            <Select v-model="BranchstoreId" class="w150">
              <Option
                v-for="item in Branchstore"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </div>
          <div class="db ml15">
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="query"
            >
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <div class="mt15 warp_table">
      <Table
        :columns="columns"
        :data="tableData"
        height="600"
        size="small"
        border
        stripe
      ></Table>
    </div>
  </div>
</template>

<script>
import QuickDate from "_c/getDate/dateget";
import moment from "moment";
export default {
  components: {
    QuickDate
  },
  data() {
    return {
      // 数据类
      columns: [
        {
          title: "序号",
          type: "index",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "区域",
          key: "tmp",
          width: 100,
          fixed: "left"
        },
        {
          title: "门店",
          key: "tmp",
          width: 100,
          fixed: "left"
        },
        {
          title: "店号",
          key: "tmp",
          width: 80,
          fixed: "left"
        },
        {
          title: "账户",
          key: "tmp",
          width: 100,
          fixed: "left"
        },
        {
          title: "账号",
          key: "tmp",
          width: 100,
          fixed: "left"
        },
        {
          title: "开户行",
          key: "tmp",
          width: 100,
          fixed: "left"
        },
        {
          title: "对应科目",
          key: "tmp",
          width: 120,
          fixed: "left"
        },
        {
          title: "期初余额",
          key: "tmp",
          width: 100
        },
        {
          title: "收回应收",
          key: "tmp",
          width: 100
        },
        {
          title: "管理费收入",
          key: "tmp",
          width: 100
        },
        {
          title: "销售收入小计",
          key: "tmp",
          width: 100
        },
        {
          title: "税费返还等财政补助",
          key: "tmp",
          width: 100
        },
        {
          title: "行政性收入",
          key: "tmp",
          width: 100
        },
        {
          title: "其他收入",
          key: "tmp",
          width: 100
        },
        {
          title: "走账",
          key: "tmp",
          width: 100
        },
        {
          title: "利息收入",
          key: "tmp",
          width: 100
        },
        {
          title: "本日经营活动收入小计",
          key: "tmp",
          width: 100
        },
        {
          title: "内部往来：拨入",
          key: "tmp",
          width: 100
        },
        {
          title: "投、融资活动产生的现金收入",
          key: "tmp",
          width: 100
        },
        {
          title: "本日资金收入小计",
          key: "tmp",
          width: 100
        },
        {
          title: "付出应付",
          key: "tmp",
          width: 100
        },
        {
          title: "付出应付（总部代付）",
          key: "tmp",
          width: 100
        },
        {
          title: "采购支出合计",
          key: "tmp",
          width: 100
        },
        {
          title: "人工费用支出",
          key: "tmp",
          width: 100
        },
        {
          title: "上缴税金支出",
          key: "tmp",
          width: 100
        },
        {
          title: "行政性费用支出",
          key: "tmp",
          width: 100
        },
        {
          title: "厂车、运输费",
          key: "tmp",
          width: 100
        },
        {
          title: "其他支出",
          key: "tmp",
          width: 100
        },
        {
          title: "走账款",
          key: "tmp",
          width: 100
        },
        {
          title: "手续费",
          key: "tmp",
          width: 100
        },
        {
          title: "因公借支",
          key: "tmp",
          width: 100
        },
        {
          title: "本日经营活动支出小计",
          key: "tmp",
          width: 100
        },
        {
          title: "内部往来：拨出",
          key: "tmp",
          width: 100
        },
        {
          title: "投、融资活动产生的现金支",
          key: "tmp",
          width: 100
        }
      ],
      tableData: [], // 主表
      dates: [], // 查询日期
      areaId: "", // 区域id
      areas: [], // 区域
      BranchstoreId: "", // 门店id
      Branchstore: [] // 门店
    };
  },
  async mounted() {
    this.getArea();
    this.getCompany();
    this.query();
  },
  methods: {
    // 快速查询
    getDataQuick(v) {
      this.dates = v;
      this.query();
    },
    // 区域
    async getArea() {},
    // 门店
    async getCompany() {},
    // 查询
    async query() {}
  }
};
</script>

<style lang="less" scoped>
.oper-top input {
  border: 1px solid #dddddd;
  text-indent: 4px;
}
.oper-top .input {
  position: relative;
  left: -26px;
  bottom: -5px;
}
.pro span {
  display: inline-block;
  width: 100px;
  text-align: right;
}
.inner-box {
  overflow-x: scroll;
}
.warp_table {
    padding: 1px;
}
</style>
