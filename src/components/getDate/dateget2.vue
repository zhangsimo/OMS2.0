<template>
  <Select :size="sizeString" v-model="searchQuick" class="w90" @on-change="getval">
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
    prevMonthStr
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
          { value: "1", label: "今天" },
          { value: "2", label: "昨天" },
          { value: "3", label: "本周" },
          { value: "4", label: "上周" },
          { value: "5", label: "本月" },
          { value: "6", label: "上月" }
        ]
      };
    },
    props: {
      sizeString:""
    },
    // watch: {
    //   dataSource: {
    //     immediate: true, // 这句重要
    //     handler(val) {
    //       this.searchQuick = val;
    //     }
    //   }
    // },
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
            this.val = "";
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
          default:
            this.val = ThisMonthStr();
            break;
        }
        this.$emit("quickDate", this.val);
      }
    },
    computed: {}
  };
</script>

<style lang="less" scoped>
</style>
