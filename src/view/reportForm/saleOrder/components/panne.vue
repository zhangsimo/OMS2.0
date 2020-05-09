<template>
  <section class="oper-box">
    <div class="oper-top flex">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr10">
            <quick-date @quickDate="getDataQuick"></quick-date>
          </div>
          <div class="db mr10">
            <span>入库日期：</span>
            <DatePicker
              v-model="search.submitDate"
              type="date"
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
            <Select
              v-model="search.bandId"
              class="w120"
              placeholder="请选择品牌"
            >
              <Option
                v-for="item in bandArr"
                :value="item.value"
                :key="item.value"
                >{{ item.name }}</Option
              >
            </Select>
          </div>
          <div class="db mr10">
            <Select
              v-model="search.guestId"
              class="w120"
              placeholder="请选择客户"
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
              v-model="search.warehouseId"
              class="w120"
              placeholder="请选择仓库"
            >
              <Option
                v-for="item in warehouse"
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
              placeholder="请选择门店"
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
            <Button @click="moreOpen" class="mr10">更多查询</Button>
            <Button @click="exportxls">导出</Button>
          </div>
        </div>
      </div>
    </div>
    <more :type="type" ref="more" @getmoreData="getmoreData"></more>
  </section>
</template>

<script>
import moment from "moment";
import QuickDate from "_c/getDate/dateget";
import more from "./more";
export default {
  components: { QuickDate, more },
  props: {
    type: {
      default: 0,
      type: Number,
    }
  },
  data() {
    return {
      bandArr: [], // 品牌
      supplityArr: [], // 供应商
      stores: [], // 门店
      warehouse: [], // 仓库
      search: {
        quickDates: [], // 快速日期查询
        submitDate: null, // 提交日期
        content: "", // 编码名称
        bandId: "", // 品牌
        guestId: "", // 供应商
        storeId: "", // 门店
        warehouseId: "", // 仓库
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
      let data = {};
      for (let key in this.search) {
        if (this.search[key]) {
          if (key == "submitDate") {
            data.submitDate = moment(this.search.submitDate).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          } else {
            data[key] = this.search[key];
          }
        }
      }
      this.$emit("search", data);
    },
    // 更多
    moreOpen() {
      this.$refs.more.init();
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
