<template>
  <div class="content-oper content-oper-flex" style="background-color: #fff;">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr15">
            <span>快速查询：</span>
          </div>
          <div class="db mr15">
            <quick-date
              class="mr10"
              ref="quickDate"
              @quickDate="getDataQuick"
            ></quick-date>
          </div>
          <div class="db ml15">
            <span>起止日期：</span>
            <Date-picker
              v-model="dates"
              type="daterange"
              placeholder="选择日期"
              class="w200"
            ></Date-picker>
          </div>
          <div class="db ml15">
            <span>区域：</span>
            <Select v-model="areaId" class="w150" @on-change="changeArea" :disabled="selectShopList">
              <Option v-for="item in areas" :value="item.id" :key="item.id">{{item.companyName}}</Option>
            </Select>
          </div>
          <div class="db ml15">
            <span>门店名称：</span>
            <Select v-model="BranchstoreId" class="w150" :disabled="selectShopList">
              <Option
                v-for="item in Branchstore"
                :value="item.id"
                :key="item.id"
                >{{ item.name }}</Option
              >
            </Select>
          </div>
          <div class="db ml15">
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="query"
            >
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <div class="mt15 warp_table">
      <Table
        :columns="columns"
        :data="tableData"
        height="600"
        size="small"
        border
        stripe
      ></Table>
    </div>
  </div>
</template>

<script>
import {
  are,
  // goshop,
} from "@/api/settlementManagement/fundsManagement/capitalChain";
import { goshop } from '@/api/settlementManagement/shopList';
import * as api from "_api/settlementManagement/financialStatement.js";
import QuickDate from "@/components/getDate/dateget_bill.vue";
import moment from "moment";
export default {
  name: "statistical",
  components: {
    QuickDate
  },
  data() {
    return {
      // 数据类
      columns: [
        {
          title: "序号",
          type: "index",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "区域",
          key: "area",
          width: 100,
          fixed: "left"
        },
        {
          title: "门店",
          key: "shopName",
          width: 100,
          fixed: "left"
        },
        {
          title: "店号",
          key: "shopCode",
          width: 80,
          fixed: "left"
        },
        {
          title: "账户",
          key: "accountName",
          width: 100,
          fixed: "left"
        },
        {
          title: "账号",
          key: "accountCode",
          width: 100,
          fixed: "left"
        },
        {
          title: "开户行",
          key: "bankName",
          width: 100,
          fixed: "left"
        },
        {
          title: "对应科目",
          key: "mateAccountName",
          width: 120,
          fixed: "left"
        },
        {
          title: "期初余额",
          key: "initialBalanceMoney",
          width: 100
        },
        {
          title: "收回应收",
          key: "recoveryMoney",
          width: 100
        },
        {
          title: "管理费收入",
          key: "administrativeFeeMoney",
          width: 100
        },
        {
          title: "销售收入小计",
          key: "saleMoney",
          width: 100
        },
        {
          title: "税费返还等财政补助",
          key: "refundMoney",
          width: 100
        },
        {
          title: "行政性收入",
          key: "administrativeMoney",
          width: 100
        },
        {
          title: "其他收入",
          key: "otherMoney",
          width: 100
        },
        {
          title: "走账",
          key: "keepAccountsMoney",
          width: 100
        },
        {
          title: "利息收入",
          key: "interestIncomeMoney",
          width: 100
        },
        {
          title: "本日经营活动收入小计",
          key: "businessActivitiesMoney",
          width: 100
        },
        {
          title: "内部往来：拨入",
          key: "dialingMoney",
          width: 100
        },
        {
          title: "投、融资活动产生的现金收入",
          key: "financingActivitiesMoney",
          width: 100
        },
        {
          title: "本日资金收入小计",
          key: "dayMoney",
          width: 100
        },
        {
          title: "付出应付",
          key: "payCopeMoney",
          width: 100
        },
        {
          title: "付出应付（总部代付）",
          key: "headPaycopeMoney",
          width: 100
        },
        {
          title: "采购支出合计",
          key: "purchaseMoney",
          width: 100
        },
        {
          title: "人工费用支出",
          key: "staffCostsMoney",
          width: 100
        },
        {
          title: "上缴税金支出",
          key: "taxesMoney",
          width: 100
        },
        {
          title: "行政性费用支出",
          key: "administrationExpendMoney",
          width: 100
        },
        {
          title: "厂车、运输费",
          key: "factoryTransportationMoney",
          width: 100
        },
        {
          title: "其他支出",
          key: "otherExpensesMoney",
          width: 100
        },
        {
          title: "走账款",
          key: "takeAccountMoney",
          width: 100
        },
        {
          title: "手续费",
          key: "procedureFeeMoney",
          width: 100
        },
        {
          title: "因公借支",
          key: "deathMoney",
          width: 100
        },
        {
          title: "本日资金支出小计",
          key: "deathMoney",
          width: 100
        },
        {
          title: "费用报销业务类型",
          key: "expenseReimbursement",
          width: 100
        },
        {
          title: "内部往来：拨出",
          key: "pulloutMoney",
          width: 100
        },
        {
          title: "投、融资活动产生的现金支",
          key: "outActivitiesMoney",
          width: 100
        },
        {
          title: "本日资金支出小计",
          key: "capitalSpendingMoney",
          width: 100
        }
      ],
      tableData: [], // 主表
      dates: [], // 查询日期
      areaId: 0, // 区域id
      areas: [{ id: 0, companyName: "全部" }], // 区域
      BranchstoreId: "", // 门店id
      Branchstore: [{ id: 0, name: "全部" }] // 门店
    };
  },
  async mounted() {
    this.dates = this.$refs.quickDate.val;
    this.getArea();
    this.getShop();
    this.query();
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
  methods: {
    // 快速查询
    getDataQuick(v) {
      this.dates = v;
      this.query();
    },
    // 区域
    async getArea() {
      let res = await are();
      if (res.code === 0) return (this.areas = [...this.areas, ...res.data]);
    },

    //当前非管理员状态情况下获取门店地址
    async getThisArea() {
      let data = {};
      data.shopkeeper = 1;
      data.shopNumber = this.$store.state.user.userData.shopId;
      data.tenantId = this.$store.state.user.userData.tenantId;
      let res = await are(data);
      if (res.code === 0) {
        this.areas=[...res.data]
        this.areas.unshift({ id: 0, companyName: "全部" })
      }
    },

    //切换地址重新调取门店接口
    changeArea() {
      if (this.$store.state.user.userData.shopkeeper == 0) {
        this.shopCode = 0;
        this.getShop();
      }
    },

    //获取门店
    async getShop() {
      let data = {};
      data.supplierTypeSecond = this.BranchstoreId;
      this.Branchstore = [{ id: 0, name: "全部" }];
      let res = await goshop(data);
      if (res.code === 0) {
        this.Branchstore = [...this.Branchstore, ...res.data];
        this.$nextTick(() => {
          this.BranchstoreId = this.$store.state.user.userData.shopId;
        });
        if(this.areas.length>0){
          this.areas.map(item=>{
            this.Branchstore.map(item2=>{
              if(this.selectShopList){
                if(item.parentId==item2.supplierTypeFirst && item.id==item2.supplierTypeSecond){
                  this.areaId=item.id
                }
              }else{
                this.areaId=0
              }
            })
          })
        }
        if (this.$store.state.user.userData.shopkeeper != 0) {
          this.getThisArea(); //获取当前门店地址
        }
      }
    },

    // 查询
    async query() {
      let params = {
        areaId: this.areaId,
        shopNumber: this.BranchstoreId,
        size: 10000,
      }

      if (this.dates.length === 2 && this.dates[0]) {
        params.startTime = moment(this.dates[0]).format("YYYY-MM-DD");
        params.endTime = moment(this.dates[1]).format("YYYY-MM-DD");
      }

      params.page = 0;

      for (let key in params) {
        if (!params[key]) {
          Reflect.deleteProperty(params, key)
        }
      }

      let res = await api.findListPageAllReport(params);

      if (res.code == 0) {
        this.tableData = res.data.content;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.oper-top input {
  border: 1px solid #dddddd;
  text-indent: 4px;
}
.oper-top .input {
  position: relative;
  left: -26px;
  bottom: -5px;
}
.pro span {
  display: inline-block;
  width: 100px;
  text-align: right;
}
.inner-box {
  overflow-x: scroll;
}
.warp_table {
  padding: 1px;
}
</style>
