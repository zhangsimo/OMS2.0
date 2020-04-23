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
            <span>门店：</span>
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
      <div>
        <div class="head">
          <span>昨日余额</span>
          <span>{{ headData.o }}</span>
          <span>本日收款</span>
          <span>{{ headData.o }}</span>
          <span>本日付款</span>
          <span>{{ headData.o }}</span>
          <span>本日余额</span>
          <span>{{ headData.o }}</span>
        </div>
      </div>
    </section>

    <div class="mt15 warp_table">
      <vxe-table
        border
        resizable
        height="300"
        :span-method="mergeRowMethod"
        :data="tableData"
      >
        <vxe-table-column title="项目信息">
          <vxe-table-column title="大项" filed="temp"></vxe-table-column>
          <vxe-table-column title="现金流科目" filed="temp"></vxe-table-column>
          <vxe-table-column title="行次" filed="temp"></vxe-table-column>
          <vxe-table-column
            title="具体项目类别"
            filed="temp"
          ></vxe-table-column>
          <vxe-table-column
            title="凭证对应会计科目"
            filed="temp"
          ></vxe-table-column>
        </vxe-table-column>
        <vxe-table-column title="金额信息">
          <vxe-table-column title="现金" filed="temp"></vxe-table-column>
          <vxe-table-column title="银行卡" filed="temp"></vxe-table-column>
          <vxe-table-column title="银行账户" filed="temp"></vxe-table-column>
          <vxe-table-column title="资金合计" filed="temp"></vxe-table-column>
        </vxe-table-column>
        <vxe-table-column title="其他信息">
          <vxe-table-column title="备注" filed="temp"></vxe-table-column>
        </vxe-table-column>
      </vxe-table>
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
      headData: {
        o: 0
      },
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
    mergeRowMethod({ row, $rowIndex, column, data }) {
      const fields = ["key"];
      const cellValue = XEUtils.get(row, column.property);
      if (cellValue && fields.includes(column.property)) {
        const prevRow = data[$rowIndex - 1];
        let nextRow = data[$rowIndex + 1];
        if (prevRow && XEUtils.get(prevRow, column.property) === cellValue) {
          return { rowspan: 0, colspan: 0 };
        } else {
          let countRowspan = 1;
          while (
            nextRow &&
            XEUtils.get(nextRow, column.property) === cellValue
          ) {
            nextRow = data[++countRowspan + $rowIndex];
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 };
          }
        }
      }
    },
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
.head {
  display: flex;
  align-items: center;
  padding: 0 15px;
  text-align: center;
}
.head span {
  flex: auto;
  border: 1px solid #ccc;
  line-height: 1.5rem;
  margin-left: -1px;
}

.head span:nth-of-type(odd) {
  background-color: skyblue;
  color: #fff;
}
</style>
