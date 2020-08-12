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
              v-model="search.auditDate"
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
              class="w240"
              multiple
              v-model="search.partBrandList"
              placeholder="请选择品牌"
              @on-change="select1"
            >
              <Option
                v-for="item in bandArr"
                :value="item.label"
                :key="item.id"
              >{{ item.label }}</Option
              >
            </Select>
          </div>
          <div class="db mr10">
            <Input
              v-model="search.guestFullName"
              placeholder="请输入客户"
              class="w120"
              clearable
            />
<!--            <Select-->
<!--              v-model="search.guestId"-->
<!--              class="w120"-->
<!--              placeholder="请选择客户"-->
<!--              filterable clearable-->
<!--            >-->
<!--              <Option-->
<!--                v-for="item in supplityArr"-->
<!--                :value="item.id"-->
<!--                :key="item.id"-->
<!--                >{{ item.fullName }}</Option-->
<!--              >-->
<!--            </Select>-->
          </div>
          <div class="db mr10">
            <Select
              v-model="search.orgid"
              class="w120"
              placeholder="请选择门店"
              :disabled="selectShopList"
              @on-change="getWares(search.orgid)"
              filterable
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
<!--getWares-->
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
      bandArr: [], // 品牌
      stores: [{id:0,name:"全部"}], // 门店
      warehouse: [], // 仓库
      quickDates: [], // 快速日期查询
      search: {
        isPanne: true,
        auditDate: [], // 提交日期
        content: "", // 编码名称
        partBrandList: [], // 品牌
        guestFullName: "", // 客户
        orgid: "", // 门店
        storeId: "", // 仓库
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
    let resB = await api.getParamsBrandPart();
    let resE = await api.getStorelist();
    if(resB.code == 0) {
      for (let quality of resB.data.content) {
        if (quality.children.length <= 0) {
          break;
        }
        quality.children.forEach(el => {
          el.label = el.name;
          el.value = el.code;
          el.id = el.id;
          this.bandArr.push(el);
        });
      }
    }
    if(resE.code == 0) {
       let data = resE.data;
        Object.keys(data).forEach(key => {
          this.stores.push({id: key, name: data[key]})
        })
    }
  },
  methods: {
    select1(option) {
      if (option.slice(-1)[0] == 1) {
        option = [1];
      } else if (option.includes(1)) {
        option = option.filter(el => el != 1);
      }
      this.search.partBrandList = option;
    },
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
      this.search.auditDate = v;
      let arr = await creat("", this.$store);
      this.search.orgid = arr[1];
      if(v.length >= 2) {
        this.search.content="";this.search.guestFullName="";this.search.storeId="";this.search.partBrandList=[]
        this.getWares(this.search.orgid)
        this.$emit("search", { isPanne: true, startTime: v[0], endTime: v[1],orgid:this.search.orgid });
      } else {
        this.search.content="";this.search.guestFullName="";this.search.storeId="";this.search.partBrandList=[]
        this.$emit("search", { isPanne: true, orgid:this.search.orgid });
      }
    },
    // 查询
    query() {
      let data = {};
      for (let key in this.search) {
        if (this.search[key]) {
          if (key == "auditDate") {
            if (this.search["auditDate"][0]) {
              if (this.type == 1) {
                data.auditStartTime =
                  moment(this.search["auditDate"][0]).format("YYYY-MM-DD") +
                  " 00:00:00";
                data.auditEndTime =
                  moment(this.search["auditDate"][1]).format("YYYY-MM-DD") +
                  " 23:59:59";
              } else if (this.type == 2) {
                data.startOutDate =
                  moment(this.search["auditDate"][0]).format("YYYY-MM-DD") +
                  " 00:00:00";
                data.endOutDate =
                  moment(this.search["auditDate"][1]).format("YYYY-MM-DD") +
                  " 23:59:59";
              } else if (this.type == 3) {
                data.auditStartDate =
                  moment(this.search["auditDate"][0]).format("YYYY-MM-DD") +
                  " 00:00:00";
                data.auditEndDate =
                  moment(this.search["auditDate"][1]).format("YYYY-MM-DD") +
                  " 23:59:59";
              }
            }
          }  else if (key == "content" && this.search.content) {
            data.partCode = this.search.content;
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
