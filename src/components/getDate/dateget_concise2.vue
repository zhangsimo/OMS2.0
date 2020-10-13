<template>
  <Select v-model="searchQuick" class="w90" @on-change="getval" transfer>
    <Option v-for="item in dateQiuck" :value="item.value" :key="item.value">{{ item.label }}</Option>
    <slot></slot>
  </Select>
</template>

<script>
  import {
    ToDayStr,
    YesterDayStr,
    ThisWeekStr,
    LastWeekStr,
    ThisMonthStr,
    prevMonthStr,
    prevYearStr,
    ThisYearStr
  } from "./index_bill";
  export default {
    name: "quickDate",
    components: {},
    data() {
      return {
        val: [],
        searchQuick: "5",
        dateQiuck: [
          { value: "0", label: "请选择" },
          { value: "5", label: "本月" },
          { value: "6", label: "上月" }
        ]
      };
    },
    props: {},
    created() {},
    mounted() {
      this.getval(this.searchQuick)
    },
    methods: {
      getval(type) {
        // 日期快速选择
        switch (type) {
          case 0:
          case "0":
            this.val = '';
            break;
          case 1:
          case "1":
            this.val = ToDayStr();
            break;
          case 2:
          case "2":
            this.val = YesterDayStr();
            break;
          case 3:
          case "3":
            this.val = ThisWeekStr();
            break;
          case 4:
          case "4":
            this.val = LastWeekStr();
            break;
          case 5:
          case "5":
            this.val = ThisMonthStr();
            break;
          case 6:
          case "6":
            this.val = prevMonthStr();
            break;
          case 7:
          case "7":
            this.val = ThisYearStr();
            break;
          case 8:
          case "8":
            this.val = prevYearStr();
            break;
          default:
            this.val = ToDayStr();
            break;
        }
        this.$emit("quickDate", this.val);
      },
      resetFun(){
        this.getval(this.searchQuick='1');
      }
    },
    computed: {}
  };
</script>

<style lang="less" scoped>
</style>
