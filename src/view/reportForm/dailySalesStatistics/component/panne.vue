<template>
  <section class="oper-box">
    <div class="oper-top flex">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr10">
            <quick-date @quickDate="getDataQuick"></quick-date>
          </div>
          <div class="db mr10">
            <span>日期：</span>
            <DatePicker
              :value="search.submitDate"
              v-model="search.submitDate"
              type="daterange"
              placement="bottom-start"
              placeholder="选择日期"
              class="w200 mr10"
            >
            </DatePicker>
          </div>
          <div class="db mr10">
            <span class="mr10">门店：</span>
            <Select
              v-model="search.orgid"
              class="w120"
              filterable clearable
              :disabled="selectShopList"
            >
              <Option
                v-for="item in stores"
                :value="item.value"
                :key="item.value"
              >{{ item.name }}
              </Option
              >
            </Select>
          </div>
          <div class="db">
            <Button type="warning" @click="query" class="mr10">查询</Button>
            <Button @click="exportxls" v-has="'export'">导出</Button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import moment from "moment";
  import QuickDate from "_c/getDate/dateget_noEmit";
  import {ToDayStr} from "_c/getDate/index_bill.js"
  import * as api from "_api/reportForm/index.js";
  import {creat} from "@/view/settlementManagement/components";

  export default {
    components: {QuickDate},
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
        quickDates: [], // 快速日期查询
        search: {
          submitDate: ToDayStr(), // 提交日期
          guestId: "", // 供应商
          orgid: "" // 门店
        }
      };
    },
    async mounted() {
      let resE = await api.getStorelist();
      if (resE.code == 0) {
        let data = resE.data;
        Object.keys(data).forEach(key => {
          this.stores.push({value: key, name: data[key]})
        })
      }
      var arr = await creat("", this.$store);
      this.search.orgid = arr[1];
    },
    computed: {
      selectShopList() {
        if (this.$store.state.user.userData.currentCompany != null) {
          return this.$store.state.user.userData.currentCompany.isMaster ? true : false
        } else {
          return true
        }
      }
    },
    methods: {
      // 快速日期查询
      async getDataQuick(v) {
        this.search.submitDate = v;
        if (this.selectShopList) {
          var arr = await creat("", this.$store);
          this.search.orgid = arr[1];
        }
        this.query();
      },
      // 查询
      query() {
        let data = {};
        for (let key in this.search) {
          if (this.search[key]) {
            if (key == "submitDate") {
              if (this.search["submitDate"][0]) {
                data.createTimeStart = moment(this.search["submitDate"][0]).format("YYYY-MM-DD") + " 00:00:00";
                data.createTimeEnd = moment(this.search["submitDate"][1]).format("YYYY-MM-DD") + " 23:59:59";
              }
            } else {
              data[key] = this.search[key];
            }
          }
        }
        this.$emit("search", data);
      },
      getmoreData(data) {
        if (data != null) {
          this.$emit("search", data);
        }
      },
      // 导出
      exportxls() {
        this.$emit("export");
      }
    }
  };
</script>
