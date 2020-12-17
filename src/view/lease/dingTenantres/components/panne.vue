<template>
  <section class="oper-box pl10 pt10 pb10">
    <div class="flex">
      <div class="con-box  flex">
        <div class="wlf">
          <div class="db mr10">
            <Input type="text" clearable v-model.trim="search.tenantId" placeholder="请输入租户ID"/>
          </div>
          <div class="db mr10">
            <Select v-model="search.configStatus" class="w120" placeholder="请选择配置状态" filterable clearable>
              <Option v-for="item in configStatusList" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <Select v-model="search.dictionariesConfigCode" class="w120" placeholder="请选择" filterable clearable>
              <Option v-for="item in dictionariesConfigCodeList" :value="item.itemCode" :key="item.itemCode">
                {{item.itemName}}
              </Option>
            </Select>
          </div>
          <div class="db">
            <Button type="warning" @click="query" class="mr10">查询</Button>
          </div>
          <div class="db mr10">
            <Button type="warning" @click="add">新增</Button>
          </div>
<!--          <div class="db mr10">-->
<!--            <Button type="warning" @click="change">修改</Button>-->
<!--          </div>-->
        </div>
      </div>
    </div>
    <addDing ref="addDing" :data="addDingList" :dictionariesConfigCodeList="dictionariesConfigCodeList"></addDing>
  </section>
</template>

<script>
  import {getUserAllCompany} from '@/api/base/user'
  import addDing from "./addDing";
  import {getDictionary} from "@/api/documentApproval/ExpenseReimbursement.js"

  export default {
    props: {
      type: {
        default: 0,
        type: Number,
      }
    },
    components: {
      addDing
    },
    data() {
      return {
        company: this.$store.state.user.userData.currentCompany ? this.$store.state.user.userData.currentCompany.shortName ? this.$store.state.user.userData.currentCompany.shortName : '' : "",
        stores: [{id: 0, name: "全部", shortName: "全部"}], // 门店
        configStatusList: [
          {value: -1, label: "失效"},
          {value: 1, label: "未生效"},
          {value: 0, label: "当前生效"}
        ],//配置状态数组
        quickDates: [], // 快速日期查询
        search: {
          isPanne: true,
          tenantId: this.$store.state.user.userData.tenantId,
          dictionariesConfigCode: "",
          configStatus: 0
        },
        dictionariesConfigCodeList: [],
        addDingList: {
          tenantId: "",
          dictionariesConfigCode: "",
          corpId: "", cropName: "",
          agentId: "", appName: "", appKey: "", appSecret: "",
          appId: "", suiteId: "", suiteName: "", suiteKey: "", suiteSecret: "",
          appId2: "", appSecret2: "", appName2: "",
          dingTalkBpmsConfigs: []
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
      this.getShop()
      this.query();
      this.getdictionariesConfigCodeList()
    },
    methods: {
      // 查询
      query() {
        let data = {};
        for (let key in this.search) {
          data[key] = this.search[key];
        }
        this.$emit("search", data);
      },
      async getdictionariesConfigCodeList() {
        let res = await getDictionary({dictCode: "TENANT_CONFIG"});
        if (res.code === 0) {
          this.dictionariesConfigCodeList = res.data;
        }
      },
      //获取所有公司信息
      async getShop() {
        let data = {}
        data.size = 10000
        data.page = 0
        data.id = this.$store.state.user.userData.id
        data.tenantCompanyName = ""
        let res = await getUserAllCompany(data)
        if (res.code === 0) {
          this.stores = [...this.stores, ...res.data.content]
        }
      },
      add() {
        this.$refs.addDing.addDingBool = true;
      },
      change() {
        let data=this.$parent.$refs.tabOne.selections
        console.log(data,111)
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
