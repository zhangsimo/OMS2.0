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
            <span v-if="type == 3">出库日期：</span>
            <span v-if="type == 4">入库日期：</span>
            <DatePicker
              @on-change="getDataQuick2"
              :value="search.auditDate"
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
              v-model="search.guestId"
              class="w120"
              :placeholder="placeHMod"
              filterable
              clearable
            >
              <Option
                v-for="item in outArr"
                :value="item.id"
                :key="item.id"
                >{{ item.shortName }}</Option
              >
            </Select>
          </div>
          <div class="db mr10">
            <Select
              v-model="search.orgid"
              class="w120"
              placeholder="请选择门店"
              :disabled="selectShopList"
              clearable
              filterable
              @on-change="getWares(search.orgid)"
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
import QuickDate from "_c/getDate/dateget";
import more from "./more";
import * as api from "_api/reportForm/index.js";
import { creat } from "@/view/settlementManagement/components";
import {getWares} from "@/view/reportForm/until.js"
import {
  transferringFindForAllot
} from "_api/purchasing/purchasePlan";
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
      outArr: [], // 调出方
      warehouse: [], // 仓库
      stores: [{id:0,name:"全部"}], // 门店
      quickDates: [], // 快速日期查询
      search: {
        isPanne: true,
        auditDate: [], // 提交日期
        content: "", // 编码名称
        guestId: "", // 调出方
        orgid:"",
        storeId: "" // 仓库
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
    },
    placeHMod(){
      if(this.type==1 || this.type==3){
        return "请选择调出方"
      }else{
        return "请选择调入方"
      }
    }
  },
  async mounted() {
    let resS = await transferringFindForAllot({page:0,size:1000});
    // let resS = await api.getSupplier();
    let resE = await api.getStorelist();
    if (resS.code == 0) {
      console.log(resS , 7879)
      this.outArr = resS.data.content||[];
      // this.outArr = resS.data||[];
    }
    if(resE.code == 0) {
       let data = resE.data;
        Object.keys(data).forEach(key => {
          this.stores.push({id: key, name: data[key]})
        })
    }
  },
  methods: {
    async getWares(orgId) {
      this.warehouse=await getWares(orgId)
    },
    // 快速日期查询
    async getDataQuick(v) {
      this.search.auditDate = v;
      if(v.length >= 2) {
        let arr = await creat("", this.$store);
        this.search.orgid = arr[1];
        this.search.content="";this.search.guestId="";this.search.storeId="";
        this.getWares(this.search.orgid)
        this.$emit("search", { isPanne: true, createTimeStart: v[0], createTimeEnd: v[1] , orgid:this.search.orgid });
      } else {
        let arr = await creat("", this.$store);
        this.search.orgid = arr[1];
        this.search.content="";this.search.guestId="";this.search.storeId=""
        this.$emit("search", { isPanne: true, orgid:this.search.orgid});
      }
    },
    getDataQuick2(v){
      this.search.auditDate = v;
    },
    // 查询
    query() {
      let data = {};
      for (let key in this.search) {
        if (this.search[key]) {
          if (key == "auditDate") {
            if (this.search["auditDate"][0]) {
              if(this.type == 1 || this.type ==4) {
                data.allotEnterTimeStart = moment(this.search["auditDate"][0]).format("YYYY-MM-DD") + " 00:00:00";
                data.allotEnterTimeEnd = moment(this.search["auditDate"][1]).format("YYYY-MM-DD") + " 23:59:59";
              } else {
                data.allotFinishedStartDate = moment(this.search["auditDate"][0]).format("YYYY-MM-DD") + " 00:00:00";
                data.allotFinishedEndDate = moment(this.search["auditDate"][1]).format("YYYY-MM-DD") + " 23:59:59";
              }
            }
          } else if (key == "content" && this.search.content) {
            data.partCode = this.search.content;
          } else {
            data[key] = this.search[key];
          }
        }
      }
      if(this.quickDates.length >= 2 && this.quickDates[0]) {
        data.createTimeStart = this.quickDates[0];
        data.createTimeEnd = this.quickDates[1];
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
