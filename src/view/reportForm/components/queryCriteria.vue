<template>
  <div>
    <span>快速查询：</span>
    <QuickDate class="mr10" ref="selectDate" @quickDate="quickDate" v-if="flag"></QuickDate>
    <QuickDate1 class="mr10" ref="selectDate" @quickDate="quickDate" v-else></QuickDate1>
    <span>年份：</span>
    <Select v-model="yearParticular" class="w100 mr10">
      <Option v-for="item in yesrList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <span>月份：</span>
    <Select v-model="monthParticular" class="w100 mr10">
      <Option v-for="item in monthList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <span class="ml10 mr10" v-if="!flag">至</span>
    <span v-if="!flag">年份：</span>
    <Select v-model="yearParticular1" class="w100 mr10" v-if="!flag">
      <Option v-for="item in yesrList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <span v-if="!flag">月份：</span>
    <Select v-model="monthParticular1" class="w100 mr10" v-if="!flag">
      <Option v-for="item in monthList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <span v-if="store">门店：</span>
    <Select v-if="store" v-model="shopId" style="width:200px" class="mr10" clearable>
      <Option v-for="item in shoppingList" :value="item.id" :key="item.id">{{ item.shortName }}</Option>
    </Select>
  </div>
</template>
<script>
import QuickDate from "../../../components/getDate/dateget1";
import QuickDate1 from "../../../components/getDate/dateget_bill";
import { getShop } from "@/api/set/userManagement";

export default {
  components: { QuickDate, QuickDate1 },
  props: ["flag", "store"],
  data() {
    return {
      shoppingList: [],
      shopId: "",
      yearParticular: "", //年份
      yesrList: [], //年份
      monthParticular: "", //月份
      monthList: [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 },
        { value: 4, label: 4 },
        { value: 5, label: 5 },
        { value: 6, label: 6 },
        { value: 7, label: 7 },
        { value: 8, label: 8 },
        { value: 9, label: 9 },
        { value: 10, label: 10 },
        { value: 11, label: 11 },
        { value: 12, label: 12 }
      ], //月份
      yearParticular1: "", //第二个年份
      monthParticular1: "" //第二个月份
    };
  },
  mounted() {
    this.getShopList();
    let year = new Date().getFullYear();
    for (let i = year; i > year - 5; i--) {
      this.yesrList.push({
        value: i,
        label: i
      });
    }
    this.yearParticular = year;
    this.monthParticular = (new Date().getMonth())*1+1;
    this.yearParticular1 = year;
    this.monthParticular1 = (new Date().getMonth())*1+1;
  },
  methods: {
    async getShopList() {
      let res = await getShop();
      if (res.code === 0) {
        this.shoppingList = res.data;
      }
    },
    quickDate(val) {
      this.yearParticular = Number(val[0].split("-")[0]);
      this.monthParticular = Number(val[0].split("-")[1]);
      this.yearParticular1 = Number(val[1].split("-")[0]);
      this.monthParticular1 = Number(val[1].split("-")[1]);
      this.$parent.getList();
    }
  }
};
</script>