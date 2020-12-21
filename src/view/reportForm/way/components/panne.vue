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
              :value="search.submitDate"
              type="daterange"
              placement="bottom-start"
              placeholder="选择日期"
              class="w200 mr10"
              @on-change="changeDate"
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
              v-model="search.serviceId"
              placeholder="出库单号"
              class="w200 mr10"
              clearable
            />
          </div>
          <div class="db mr10">
<!--            <Select-->
<!--              v-model="search.guestId"-->
<!--              class="w120"-->
<!--              placeholder="请选择供应商"-->
<!--              filterable clearable-->
<!--            >-->
<!--              <Option-->
<!--                v-for="item in supplityArr"-->
<!--                :value="item.id"-->
<!--                :key="item.id"-->
<!--                >{{ item.fullName }}</Option-->
<!--              >-->
<!--            </Select>-->
              <Input
                v-model="search.guestFullName"
                placeholder="请输入供应商"
                class="w120"
                clearable
              />
          </div>
          <div class="db mr10">
            <Select
              v-model="search.orgid"
              class="w120"
              placeholder="请选择分店"
              filterable clearable
              :disabled="selectShopList"
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
<!--            <Button @click="exportxls" v-has="'export'">导出</Button>-->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import moment from "moment";
import QuickDate from "_c/getDate/dateget_w";
import {ToDayStr} from "_c/getDate/index_bill.js"
import * as api from "_api/reportForm/index.js";
import {creat} from "@/view/settlementManagement/components";

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
      quickDates: [], // 快速日期查询
      search: {
        serviceId: "", // 出库单号
        submitDate: ToDayStr(), // 提交日期
        content: "", // 编码名称
        guestId: "", // 供应商
        orgid: this.$store.state.user.userData ? this.$store.state.user.userData.currentCompany.id : ''// 门店
      }
    };
  },
  async created() {
    let resS = await api.getClient();
    let resE = await api.getStorelist();
    if (resS.code == 0) {
      this.supplityArr = resS.data;
    }
    if(resE.code == 0) {
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
    changeDate(v){
       if(!this.search.content&&this.getnew(v)>31){
        return this.$message({message:'日期跨度不能超过一个月',type:'error'})
      }
      this.search.submitDate = v
    },
    // 快速日期查询
    async getDataQuick(v) {
      this.search.submitDate = v;
      this.search.auditDate = v;
      if(this.selectShopList){
        var arr = await creat("", this.$store);
        this.search.orgid = arr[1];
        this.search.submitDate = arr[0]
      }
      this.query();
    },
     getnew(data){
        let hh=data[1].substr(0,10);
      let ha=data[0].substr(0,10);
      let d=(new Date(hh).getTime()-new Date(ha).getTime())/(1000*3600*24)
      return d
    },
    // 查询
    query() {
      let val=this.getnew(this.search.submitDate)
      if(val>30&&this.search.content){
          this.search.content=""
        return this.$message({message:'日期跨度不能超过一个月',type:'error'})
      }
      if(!this.search.submitDate[0]){
        return this.$message({message:'日期范围不能为空',type:'error'})
      }
      let data = {};
      for (let key in this.search) {
        if (this.search[key]) {
          if (key == "submitDate") {
            if (this.search["submitDate"][0]) {
              data.allotFinishedStartDate = moment(this.search["submitDate"][0]).format("YYYY-MM-DD") + " 00:00:00";
              data.allotFinishedEndDate = moment(this.search["submitDate"][1]).format("YYYY-MM-DD") + " 23:59:59";
            }
          }  else if (key == "content" && this.search.content) {
            data.partCode = this.search.content;
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
