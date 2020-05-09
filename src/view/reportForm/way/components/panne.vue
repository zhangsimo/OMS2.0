<template>
  <section class="oper-box">
    <div class="oper-top flex">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr10">
            <quick-date @quickDate="getDataQuick"></quick-date>
          </div>
          <div class="db mr10">
            <span>出库日期：</span>
            <DatePicker
              v-model="search.submitDate"
              type="daterange"
              placement="bottom-start"
              placeholder="选择日期"
              class="w140 mr10"
            >
            </DatePicker>
          </div>
          <div class="db mr10">
            <Input
              v-model="search.content"
              placeholder="配件编码/名称"
              class="w200 mr10"
              clearable
            />
          </div>
          <div class="db mr10">
            <Input
              v-model="search.orderCode"
              placeholder="出库单号"
              class="w200 mr10"
              clearable
            />
          </div>
          <div class="db mr10">
            <Select
              v-model="search.guestId"
              class="w120"
              placeholder="请选择供应商"
            >
              <Option
                v-for="item in supplityArr"
                :value="item.value"
                :key="item.value"
                >{{ item.name }}</Option
              >
            </Select>
          </div>
          <div class="db mr10">
            <Select
              v-model="search.storeId"
              class="w120"
              placeholder="请选择分店"
            >
              <Option
                v-for="item in stores"
                :value="item.value"
                :key="item.value"
                >{{ item.name }}</Option
              >
            </Select>
          </div>
          <div class="db">
            <Button type="warning" @click="query" class="mr10">查询</Button>
            <Button @click="exportxls">导出</Button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import moment from "moment";
import QuickDate from "_c/getDate/dateget";
export default {
  components: { QuickDate },
  props: {
    type: {
      default: 0,
      type: Number,
    }
  },
  data() {
    return {
      supplityArr: [], // 供应商
      stores: [], // 门店
      search: {
        orderCode: "", // 出库单号
        quickDates: [], // 快速日期查询
        submitDate: [], // 提交日期
        content: "", // 编码名称
        guestId: "", // 供应商
        storeId: "" // 门店
      }
    };
  },
  methods: {
    // 快速日期查询
    getDataQuick(v) {
      this.search.quickDates = v;
    },
    // 查询
    query() {
      let data = {
        submitDate: [],
      };
      for (let key in this.search) {
        if (this.search[key]) {
          if (key == "submitDate") {
            data.submitDate[0] = moment(this.search.submitDate[0]).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            data.submitDate[1] = moment(this.search.submitDate[1]).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          } else {
            data[key] = this.search[key];
          }
        }
      }
      this.$emit("search", data);
    },
    getmoreData(data) {
      //  console.log(data)
      if (data != null) {
        this.$emit("search", data);
      }
    },
    // 导出
    exportxls() {}
  }
};
</script>
