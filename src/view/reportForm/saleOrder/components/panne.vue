<template>
  <section class="oper-box">
    <div class="oper-top flex">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr10">
            <quick-date @quickDate="getDataQuick"></quick-date>
          </div>
          <div class="db mr10">
            <span v-if="type == 1">入库日期：</span>
            <span v-if="type == 2">出库日期：</span>
            <span v-if="type == 3">入库日期：</span>
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
              v-model="search.partBrandCode"
              class="w120"
              placeholder="请选择品牌"
              filterable clearable
            >
              <Option
                v-for="(item, index) in bandArr"
                :value="item"
                :key="index"
                >{{ item }}</Option
              >
            </Select>
          </div>
          <div class="db mr10">
            <Select
              v-model="search.guestId"
              class="w120"
              placeholder="请选择客户"
              filterable clearable
            >
              <Option
                v-for="item in supplityArr"
                :value="item.id"
                :key="item.id"
                >{{ item.fullName }}</Option
              >
            </Select>
          </div>
          <div class="db mr10">
            <Select
              v-model="search.storeId"
              class="w120"
              placeholder="请选择仓库"
              filterable clearable
            >
              <Option
                v-for="item in warehouse"
                :value="item.id"
                :key="item.id"
                >{{ item.name }}</Option
              >
            </Select>
          </div>
          <div class="db mr10">
            <Select
              v-model="search.orgid"
              class="w120"
              placeholder="请选择门店"
              filterable clearable
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
import * as api from "_api/reportForm/index.js";
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
      supplityArr: [], // 客户
      stores: [], // 门店
      warehouse: [], // 仓库
      quickDates: [], // 快速日期查询
      search: {
        isPanne: true,
        auditDate: null, // 提交日期
        content: "", // 编码名称
        partBrandCode: "", // 品牌
        guestId: "", // 客户
        orgid: "", // 门店
        storeId: "", // 仓库
      }
    };
  },
  async mounted() {
    let resS = await api.getClient();
    let resB = await api.getParamsBrand();
    let resE = await api.getStorelist();
    let resW = await api.getWarehouse();
    if(resW.code == 0) {
      this.warehouse = resW.data;
    }
    if (resS.code == 0) {
      this.supplityArr = resS.data;
    }
    if(resB.code == 0) {
      this.bandArr = resB.data;
    }
    if(resE.code == 0) {
       let data = resE.data;
        Object.keys(data).forEach(key => {
          this.stores.push({value: key, name: data[key]})
        })
    }
  },
  methods: {
    // 快速日期查询
    getDataQuick(v) {
      this.quickDates = v;
      if(v.length >= 2) {
        this.$emit("search", { isPanne: true, startTime: v[0], endTime: v[1] });
      } else {
        this.$emit("search", { isPanne: true });
      }
    },
    // 查询
    query() {
      let data = {};
      for (let key in this.search) {
        if (this.search[key]) {
          if (key == "auditDate") {
            data.auditDate = moment(this.search.auditDate).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }  else if (key == "content" && this.search.content) {
            if(/[\u4e00-\u9fa5]/.test(this.search.content)) {
              data.partName = this.search.content;
            } else {
              data.partCode = this.search.content;
            }
          } else {
            data[key] = this.search[key];
          }
        }
      }
      if(this.quickDates.length >= 2 && this.quickDates[0]) {
        data.startTime = this.quickDates[0];
        data.endTime = this.quickDates[1];
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
    exportxls() {
      this.$emit("export");
    }
  }
};
</script>
