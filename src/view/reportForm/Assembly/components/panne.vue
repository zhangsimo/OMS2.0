<template>
  <section class="oper-box">
    <div class="flex">
      <div class="con-box  flex">
        <div class="wlf">
          <div class="db mr10">
            <quick-date @quickDate="getDataQuick"></quick-date>
          </div>
          <div class="db mr10">
            <span>提交日期：</span>
            <DatePicker
              @on-change="getDataQuick2"
              :value="search.submitDate"
              type="daterange"
              placement="bottom-start"
              placeholder="选择日期"
              class="w200 mr10"
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
              v-model="search.orgid"
              class="w120"
              placeholder="请选择门店"
              :disabled="selectShopList"
              @on-change="getWares(search.orgid)"
              filterable clearable
            >
              <Option
                v-for="item in stores"
                :value="item.id"
                :key="item.id"
                >{{ item.name }}</Option
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
          <div class="db">
            <Button type="warning" @click="query" class="mr10">查询</Button>
            <Button @click="moreOpen" class="mr10">更多查询</Button>
            <Button @click="exportxls" v-has="'export'">导出</Button>
          </div>
        </div>
      </div>
    </div>
    <more :type="type" ref="more" @getmoreData="getmoreData"></more>
  </section>
</template>

<script>
import moment from "moment";
import QuickDate from "_c/getDate/dateget_noEmit";
import more from "./more";
import * as api from "_api/reportForm/index.js";
import { creat } from "@/view/settlementManagement/components";
import {getWares} from "@/view/reportForm/until";
import {ToDayStr} from "_c/getDate/index_bill.js"
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
      warehouse: [], // 仓库
      stores: [{id:0,name:"全部"}], // 门店
      quickDates: [], // 快速日期查询
      search: {
        isPanne: true,
        submitDate: ToDayStr(), // 提交日期
        content: "", // 编码名称
        storeId: "",
        orgid: "" // 门店
      }
    };
  },
  computed:{
    selectShopList(){
      if(this.$store.state.user.userData.currentCompany!=null){
        return this.$store.state.user.userData.currentCompany.isMaster ? true : false
      }else{
        return true
      }
    }
  },
  async mounted() {
    let resE = await api.getStorelist();
    if(resE.code == 0) {
       let data = resE.data;
        Object.keys(data).forEach(key => {
          this.stores.push({id: key, name: data[key]})
        })
    }
    var arr = await creat("", this.$store);
    this.search.orgid = arr[1];
    this.getWares(this.search.orgid)
    this.query()
  },
  methods: {
    //获取仓库
    async getWares(orgId) {
      this.warehouse=await getWares(orgId)
    },
    // 快速日期查询
    async getDataQuick(v) {
      this.search.submitDate = v;
      if(this.selectShopList){
        var arr = await creat("", this.$store);
        this.search.orgid = arr[1];
      }
      this.query();
    },
    getDataQuick2(v){
      this.search.submitDate = v;
    },
    // 查询
    query() {
      let data = {};
      for (let key in this.search) {
        if (this.search[key]) {
          if (key == "submitDate") {
            if (this.search["submitDate"][0]) {
              data.startAuditDate = moment(this.search["submitDate"][0]).format("YYYY-MM-DD") + " 00:00:00";
              data.endAuditDate = moment(this.search["submitDate"][1]).format("YYYY-MM-DD") + " 23:59:59";
            }
          } else if (key == "content" && this.search.content) {
            data.partCode = this.search.content.trim();
          } else {
            data[key] = this.search[key];
          }
        }
      }
      if(this.quickDates.length >= 2 && this.quickDates[0]) {
        data.startAuditDate = this.quickDates[0];
        data.endAuditDate = this.quickDates[1];
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
<style scoped>
  .main .ivu-layout .con-box{
    border: 0;
    padding-top: 0;
  }
  .wlf>div{
    padding-top:0;
  }
</style>
