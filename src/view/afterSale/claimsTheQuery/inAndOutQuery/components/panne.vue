<template>
  <section class="oper-box">
    <div class="con-box  flex p15">
      <div class="con-box pt10 flex">
        <div class="wlf pt10">
          <div class="db mr10">
            <span>操作日期：</span>
            <DatePicker
              @on-change="getDataQuick"
              :value="search.auditDate"
              type="daterange"
              placement="bottom-start"
              placeholder="年/月/日"
              class="w200 mr10"
            >
            </DatePicker>
          </div>
          <div class="db mr10">
            <Select
              v-model="search.orgid"
              class="w120"
              placeholder="请选择门店"
              :disabled="selectShopList"
              filterable
            >
              <Option
                v-for="item in stores"
                :value="item.id"
                :key="item.id"
              >{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <span>配件编码/名称/内码:</span>
            <Input type="text" class="ml10 w150" v-model="search.partCode" clearable></Input>
          </div>
          <div class="mr10 db">
            <span>操作人:</span>
            <Input type="text" class="ml10 w150" v-model="search.createUname" clearable></Input>
          </div>
          <div class="db mr10">
            <span>方向:</span>
            <Select v-model="search.direction" class="w120" clearable>
              <Option v-for="item in directionList" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <span>单号:</span>
            <Input type="text" class="ml10 w150" v-model="search.afterSaleCode" clearable></Input>
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
  import * as api from "_api/reportForm/index.js";
  import {creat} from "@/view/settlementManagement/components";
  import {ToDayStr} from "_c/getDate/index_bill.js"

  export default {
    props: {},
    data() {
      return {
        stores: [{id: 0, name: "全部"}], // 门店
        quickDates: [], // 快速日期查询
        directionList:[
          {value:0,label:"全部"},
          {value:1,label:"进"},
          {value:2,label:"出"}
        ],
        search: {
          isPanne: true,
          auditDate: ToDayStr(), // 提交日期
          orgid:"",
          direction:0,
          partCode:"",//配件编码/名称/内码
          createUname:"",//操作人
          afterSaleCode:""//单号
        }
      };
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
    async mounted() {
      let resE = await api.getStorelist();
      if (resE.code == 0) {
        let data = resE.data;
        Object.keys(data).forEach(key => {
          this.stores.push({id: key, name: data[key]})
        })
      }
      var arr = await creat("", this.$store);
      this.search.orgid = arr[1];
      this.query()
    },
    methods: {
      // 快速日期查询
      async getDataQuick(v) {
        this.search.auditDate = v;
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
            if (key == "auditDate") {
              if (this.search["auditDate"][0]) {
                data.createStartTime =this.search["auditDate"][0]!=""?
                  moment(this.search["auditDate"][0]).startOf('day').format("YYYY-MM-DD HH:mm:ss"):""
                data.createEndTime =this.search["auditDate"][1]!=""?
                  moment(this.search["auditDate"][1]).endOf('day').format("YYYY-MM-DD HH:mm:ss"):""
              }
            }  else {
              data[key] = this.search[key];
            }
          }
        }
        this.$emit("search", data);
      },
      // 导出
      exportxls() {
        this.$emit("export");
      }
    }
  };
</script>
<style scoped>
  .main .ivu-layout .con-box {
    border: 0;
    padding-top: 0;
  }

  .wlf > div {
    padding-top: 0;
  }
</style>
