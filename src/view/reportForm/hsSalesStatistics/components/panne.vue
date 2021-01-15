<template>
  <section class="oper-box">
    <div class="oper-top flex">
      <div class="oper-top flex">
        <div class="wlf">
          <!--<div class="db mr10">-->
            <!--<quick-date ref="quickDate" @quickDate="getDataQuick"></quick-date>-->
          <!--</div>-->
          <div class="db mr10">
            <span class="mr10">年份:</span>
            <Select
              v-model="search.year"
              class="w80"
              placeholder="年份"
            >
              <Option
                v-for="item in yearList"
                :value="item"
                :key="item"
              >{{ item }}
              </Option
              >
            </Select>
          </div>
          <div class="db mr10">
            <span class="mr10">月份:</span>
            <Select
              v-model="search.month"
              class="w80"
              placeholder="月份"
            >
              <Option
                v-for="item in monthList"
                :value="item.value"
                :key="item.value"
              >{{ item.name }}
              </Option
              >
            </Select>
          </div>
          <div class="db mr10">
            <span class="mr10">区域:</span>
            <Select
              v-model="search.areaId"
              @on-change="changeArea"
              class="w120"
              placeholder="区域"
              :disabled="selectShopList"
            >
              <Option
                v-for="item in areaList"
                :value="item.id"
                :key="item.id"
              >{{ item.companyName }}
              </Option
              >
            </Select>
          </div>
          <div class="db mr10">
            <span class="mr10">门店：</span>
            <Select
              v-model="search.orgid"
              class="w200"
              placeholder="门店"
              filterable
              :disabled="selectShopList"
              clearable
            >
              <Option
                v-for="item in storeList"
                :value="item.id"
                :key="item.id"
              >{{ item.shortName }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <span class="mr10">华胜分店:</span>
            <el-select
              v-model="search.guestId"
              filterable
              clearable
              remote
              @clear="clearHsList"
              reserve-keyword
              placeholder="请输入关键词"
              size="small"
              :remote-method="getlist"
              :loading="loading">
              <el-option
                v-for="item in hsStoreData"
                :key="item.id"
                :label="item.shortName"
                :value="item.id">
              </el-option>
            </el-select>
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
  import QuickDate from "_c/getDate/dateget_concise2";
  import {ThisMonthStr} from "_c/getDate/index_bill.js"
  import * as api from "_api/reportForm/index.js";
  import {creat} from "@/view/settlementManagement/components";
  import {getCustomerInformation} from "../../../../api/system/essentialData/clientManagement";
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
        monthList: [
          {name: "1", value: 1},
          {name: "2", value: 2},
          {name: "3", value: 3},
          {name: "4", value: 4},
          {name: "5", value: 5},
          {name: "6", value: 6},
          {name: "7", value: 7},
          {name: "8", value: 8},
          {name: "9", value: 9},
          {name: "10", value: 10},
          {name: "11", value: 11},
          {name: "12", value: 12}
        ],//月份数组
        yearList: [],//年份数组
        search: {
          month: (new Date()).getMonth() + 1,
          year: (new Date()).getFullYear(),
          orgid: "", // 供应商
          guestId:'',
          //区域
          areaId:'9999',
          //分店
          orgid:''
        },
        hsStoreData:[],
        loading:false,
        //区域数据
        areaList:[],
        //门店数据
        storeList:[],

      };
    },
    async mounted() {
      this.getArea();
      let arrYear = []
      for (let i = 2020; i <= (new Date()).getFullYear(); i++) {
        arrYear.push(i)
      }
      this.yearList = arrYear
      // let resS = await api.getClient();
      let resE = await api.getStorelist();
      // if (resS.code == 0) {
      //   this.supplityArr = resS.data;
      // }
      if (resE.code == 0) {
        let data = resE.data;
        Object.keys(data).forEach(key => {
          this.stores.push({value: key, name: data[key]})
        })
      }
    },
    computed: {
      selectShopList() {
        if (this.$store.state.user.userData.currentCompany != null) {
          return this.$store.state.user.userData.currentCompany.isMaster ? true : false
        } else {
          return true
        }
      },
      selectShopArea() {
        if (this.$store.state.user.userData.currentCompany != null) {
          return this.$store.state.user.userData.currentCompany.supplierTypeSecond;
        }else{
          return "";
        }
      }
    },
    methods: {

      //获取区域
      async getArea(){
        let rep = await api.getComPanyArea();
        if(rep.code==0){
          let allJpStore = [];
          (rep.data||[]).filter(item => item.companyVOList).map(item => {
            item.companyVOList.map(item1 => {
              allJpStore.push(item1);
            })
          });
          //加入全部数据
          let ObjData = {
            companyName:'全连锁',
            id:'9999',
            companyVOList:allJpStore
          }
          rep.data.unshift(ObjData)
          this.areaList = rep.data
          this.getJpStore(this.search.areaId);
        }
      },

      changeArea(v){
        this.getJpStore(v);
      },

      //获取极配门店
      async getJpStore(id){
        this.search.orgid = undefined;
        let filterData = this.areaList.filter(item => item.id==id);
        if (filterData.length>0){
          this.storeList = filterData[0].companyVOList;
        }else{
          this.storeList = [];
        }

        let arr = await creat("", this.$store);
        if(this.selectShopList){
          this.search.orgid = arr[1];
          this.search.areaId = this.selectShopArea;
        }
        this.query();

      },

      //获取全部表格数据
      async getlist(query) {
        if (query !== '') {
          this.loading = true;
          let data = {};
          data.page = 0;
          data.size = 10;
          data.fullName = query;
          data.lever = 1;
          data.leverId = '1264767385896296448';
          let res = await getCustomerInformation(data);
          if (res.code == 0) {
            this.loading = false;
            this.hsStoreData = res.data.content;
          }
        } else {
          this.hsStoreData = [];
        }
      },
      clearHsList(){
        this.hsStoreData = [];
      },



      // 快速日期查询
      async getDataQuick(v) {
        var arr = await creat("", this.$store);
        this.search.orgid = arr[1];
        switch (this.$refs.quickDate.searchQuick) {
          case "0"://本月
            this.search.month = (new Date()).getMonth() + 1;
            break;
          case "5"://本月
            this.search.month = (new Date()).getMonth() + 1;
            break;
          case "6"://上月
            this.search.month = (new Date()).getMonth();
            break;
        }
        if(this.search.month===0){
          this.search.year = new Date().getFullYear()-1;
          this.search.month = 12;
        }else{
          this.search.year = new Date().getFullYear();
        }
        this.query();
      },
      // 查询
      query() {
        let reqData = {...this.search};
        if(reqData.areaId=='9999'){
          delete reqData.areaId;
        }
        this.$emit("search", reqData);
      },
      getmoreData(data) {
        if (data != null) {
          this.$emit("search", data);
        }
      },
      // 导出
      exportxls() {
        this.$Modal.info({
          title: '通知',
          content: '此业务请联系IT服务台导出报表数据'
        });
        //this.$emit("export");
      }
    }
  };
</script>
