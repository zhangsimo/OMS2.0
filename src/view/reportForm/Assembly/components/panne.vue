<template>
  <section class="oper-box">
    <div class="oper-top flex">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr10">
            <quick-date @quickDate="getDataQuick"></quick-date>
          </div>
          <div class="db mr10">
            <span>提交日期：</span>
            <DatePicker
              v-model="search.submitDate"
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
import QuickDate from "_c/getDate/dateget";
import more from "./more";
import * as api from "_api/reportForm/index.js";
import { creat } from "@/view/settlementManagement/components";
import {v4} from "uuid";
import Cookies from "js-cookie";
import {TOKEN_KEY} from "../../../../libs/util";
import Api from "_conf/url";
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
        submitDate: null, // 提交日期
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
  },
  methods: {
    //获取仓库
    async getWares(orgId) {
      orgId==0?orgId="":orgId=orgId
      let res = JSON.parse(localStorage.getItem('oms2-userList'))
      let tenantId = res.tenantId || 0
      let shopkeeper = res.shopkeeper || 0
      let uuid = v4()
      let params={tenantId:tenantId,shopId:orgId,shopkeeper:shopkeeper,uuid:uuid,scope:"oms"}
      await this.ajaxAll.get(`${Api.wmsApi}/comStore/stores/findByShopId`,{
        params:params,
        headers:{
          Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
        }
      }).then((res2)=>{
        if(res2.data.code === 0) {
          this.warehouse = res2.data.data;
        }
      })
    },
    // 快速日期查询
    async getDataQuick(v) {
      this.search.submitDate = v;
      if(v.length >= 2) {
        let arr = await creat("", this.$store);
        this.search.orgid = arr[1];
        this.search.content="";this.search.storeId=""
        this.getWares(this.search.orgid)
        this.$emit("search", { isPanne: true, startAuditDate: v[0], endAuditDate: v[1],orgid:this.search.orgid });
      } else {
        this.search.content="";this.search.storeId=""
        this.$emit("search", { isPanne: true, orgid:this.search.orgid });
      }
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
            data.partCode = this.search.content;
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
