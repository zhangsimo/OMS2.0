<template>
  <div class="content-oper content-oper-flex loadingClass" style="background-color: #fff;">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr15">
            <span>快速查询：</span>
            <quick-date
              class="mr10"
              ref="quickDate"
              @quickDate="getDataQuick"
            ></quick-date>
          </div>
          <div class="db mr15">
            <span>起止日期：</span>
            <Date-picker
              v-model="dates"
              type="daterange"
              placeholder="选择日期"
              class="w200"
            ></Date-picker>
          </div>
          <div class="db mr15">
            <span>对应科目：</span>
            <el-cascader
              ref="casecader"
              size="small"
              :options="options"
              @change="getKemuList"
              :props="{ multiple: true, children: 'children',label:'titleName',value:'id' }"
              collapse-tags
              clearable></el-cascader>
          </div>
          <div class="db mr15">
            <span>账号：</span>
            <Input v-model="accountCode" class="w140" />
          </div>
          <div class="db mr15">
            <span>区域：</span>
            <Select v-model="areaId" class="w150" @on-change="changeArea" :disabled="selectShopList">
              <Option v-for="item in areas" :value="item.id" :key="item.id">{{item.companyName}}</Option>
            </Select>
          </div>
          <div class="db mr15">
            <span>门店名称：</span>
            <Select v-model="BranchstoreId" class="w150" :disabled="selectShopList">
              <Option
                v-for="item in Branchstore"
                :value="item.id"
                :key="item.id"
                >{{ item.shortName }}</Option
              >
            </Select>
          </div>
          <div class="db">
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

    <div class="mt15">
      <!--<Table-->
        <!--:columns="columns"-->
        <!--:data="tableData"-->
        <!--height="600"-->
        <!--border-->
        <!--stripe-->
      <!--&gt;</Table>-->
      <vxe-table
        height="600"
        ref="xTable"
        size="mini"
        border
        auto-resize
        resizable
        :data="tableData"
      >
        <vxe-table-column title="序号" type="seq" width="60" fixed="left"></vxe-table-column>
        <vxe-table-column field="area" title="区域" width="100" fixed="left">
        </vxe-table-column>
        <vxe-table-column title="门店" field="shopName" width="200" fixed="left"></vxe-table-column>
        <vxe-table-column
          field="shopCode"
          width="100"
          title="店号"
          fixed="left"
          >
        </vxe-table-column>
        <vxe-table-column
          field="accountName"
          title="账户"
          width="120"
          fixed="left"
          ></vxe-table-column>
        <vxe-table-column
          field="accountCode"
          title="账号"
          width="100"
          ></vxe-table-column>
<!--        fixed="left"-->
        <vxe-table-column
          field="bankName"
          title="开户行"
          width="150"
        >
<!--          fixed="left"-->
        </vxe-table-column>
        <vxe-table-column
          field="mateAccountName"
          title="对应科目"
          width="150"
        >
<!--          fixed="left"-->
        </vxe-table-column>
        <vxe-table-column
          field="initialBalanceMoney"
          title="期初余额"
          width="100">
        </vxe-table-column>
        <vxe-table-column
          field="recoveryMoney"
          title="收回应收"
          width="100">
        </vxe-table-column>
        <vxe-table-column
          field="administrativeFeeMoney"
          title="管理费收入"
          width="100">
        </vxe-table-column>
        <vxe-table-column
          field="saleMoney"
          title="销售收入小计"
          width="100">
        </vxe-table-column>
        <vxe-table-column
          field="refundMoney"
          title="税费返还等财政补助"
          width="130">
        </vxe-table-column>
        <vxe-table-column
          field="administrativeMoney"
          title="行政性收入"
          width="100">
        </vxe-table-column>
        <vxe-table-column
          field="otherMoney"
          title="其他收入"
          width="100">
        </vxe-table-column>
        <vxe-table-column
          field="keepAccountsMoney"
          title="走账"
          width="100">
        </vxe-table-column>
        <vxe-table-column
          field="interestIncomeMoney"
          title="利息收入"
          width="100">
        </vxe-table-column>
        <vxe-table-column
          field="businessActivitiesMoney"
          title="本日经营活动收入小计"
          width="150">
        </vxe-table-column>
        <vxe-table-column
          field="dialingMoney"
          title="内部往来：拨入"
          width="150">
        </vxe-table-column>
        <vxe-table-column
          field="financingActivitiesMoney"
          title="投、融资活动产生的现金收入"
          width="200">
        </vxe-table-column>
        <vxe-table-column
          field="dayMoney"
          title="本日资金收入小计"
          width="150">
        </vxe-table-column>
        <vxe-table-column
          field="payCopeMoney"
          title="付出应付"
          width="100">
        </vxe-table-column>
        <vxe-table-column
          field="headPaycopeMoney"
          title="付出应付（总部代付）"
          width="150">
        </vxe-table-column>
        <vxe-table-column
          field="purchaseMoney"
          title="采购支出合计"
          width="100">
        </vxe-table-column>
        <vxe-table-column
          field="staffCostsMoney"
          title="人工费用支出"
          width="100">
        </vxe-table-column>
        <vxe-table-column
          field="taxesMoney"
          title="上缴税金支出"
          width="100">
        </vxe-table-column>
        <vxe-table-column
          field="administrationExpendMoney"
          title="行政性费用支出"
          width="150">
        </vxe-table-column>
        <vxe-table-column
          field="factoryTransportationMoney"
          title="厂车、运输费"
          width="100">
        </vxe-table-column>
        <vxe-table-column
          field="otherExpensesMoney"
          title="其他支出"
          width="100">
        </vxe-table-column>
        <vxe-table-column
          field="takeAccountMoney"
          title="走账款"
          width="100">
        </vxe-table-column>
        <vxe-table-column
          field="procedureFeeMoney"
          title="手续费"
          width="100">
        </vxe-table-column>
        <vxe-table-column
          field="deathMoney"
          title="因公借支"
          width="100">
        </vxe-table-column>
<!--        <vxe-table-column-->
<!--          field="expenseReimbursement"-->
<!--          title="费用报销业务类型"-->
<!--          width="150">-->
<!--        </vxe-table-column>-->
        <vxe-table-column
          field="deathMoney"
          title="本日资金支出小计"
          width="150">
        </vxe-table-column>
        <vxe-table-column
          field="pulloutMoney"
          title="内部往来：拨出"
          width="150">
        </vxe-table-column>
        <vxe-table-column
          field="outActivitiesMoney"
          title="投、融资活动产生的现金支"
          width="200">
        </vxe-table-column>
        <vxe-table-column
          field="capitalSpendingMoney"
          title="本日资金支出小计"
          width="150">
        </vxe-table-column>
        <vxe-table-column
          field="endingBalanceMoney"
          title="期末余额"
          width="100">
        </vxe-table-column>
      </vxe-table>
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
import {getTreeList} from "../../../api/accountant/accountant";
import {getTableList}from '@/api/accountant/accountant'
import {showLoading, hideLoading} from "@/utils/loading"

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
          width: 130
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
          width: 150
        },
        {
          title: "内部往来：拨入",
          key: "dialingMoney",
          width: 100
        },
        {
          title: "投、融资活动产生的现金收入",
          key: "financingActivitiesMoney",
          width: 200
        },
        {
          title: "本日资金收入小计",
          key: "dayMoney",
          width: 150
        },
        {
          title: "付出应付",
          key: "payCopeMoney",
          width: 100
        },
        {
          title: "付出应付（总部代付）",
          key: "headPaycopeMoney",
          width: 150
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
        // {
        //   title: "费用报销业务类型",
        //   key: "expenseReimbursement",
        //   width: 150
        // },
        {
          title: "本日资金支出小计",
          key: "deathMoney",
          width: 150
        },
        {
          title: "内部往来：拨出",
          key: "pulloutMoney",
          width: 100
        },
        {
          title: "投、融资活动产生的现金支",
          key: "outActivitiesMoney",
          width: 200
        },
        {
          title: "本日资金支出小计",
          key: "capitalSpendingMoney",
          width: 150
        },
        {
          title: "期末余额",
          key: "endingBalanceMoney",
          width: 200
        },
      ],
      tableData: [], // 主表
      dates: [], // 查询日期
      areaId: 0, // 区域id
      areas: [{ id: 0, companyName: "全部" }], // 区域
      BranchstoreId: "", // 门店id
      Branchstore: [{ id: 0, name: "全部",shortName:"全部" }], // 门店

      accountCode:'',//账号
      mateAccountCode:'',//对应科目
      options:[]
    };
  },
  async mounted() {
    this.dates = this.$refs.quickDate.val;
    this.getArea();
    this.getShop();
    this.query();
    this.getTreeListFun();
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
    async getTreeListFun(){
      let rep2 = await getTableList({parentCode :101})
      if(rep2.code ==0){
        let content = rep2.data||[];
        this.options = this.treeDataFun(content)
      }
    },
    treeDataFun(content){
      let level1 = content.filter(item =>item.titleLevel===1&&(item.titleCode=='1001'||item.titleCode=='1002'||item.titleCode=='1012'));
      return this.treeFilterData(level1,content);
    },

    treeFilterData(treeData,content){
      treeData.map(item => {
        let arrData = content.filter(item1 => item1.parentCode==item.titleCode);
        if(arrData.length>0){
          item.children = this.treeFilterData(arrData,content)
        }else{
          item.children = null
        }
      })
      return treeData
    },


    getKemuList(v){
      if(v.length==0){
        return this.mateAccountCode = ""
      }
      let req = []
      v.map(item => {
        if(item.length>0){
          let end = item.slice(-1)
          req.push(end.join(''))
        }
      })
      this.mateAccountCode = req.join(',')
    },

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
      data.shopNumber = this.$store.state.user.userData.currentCompany.id || "";
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
      this.Branchstore = [{ id: 0, name: "全部",shortName:"全部" }];
      let res = await goshop(data);
      if (res.code === 0) {
        this.Branchstore = [...this.Branchstore, ...res.data];
        this.$nextTick(() => {
          this.BranchstoreId = this.$store.state.user.userData.currentShopId ||"";
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

      params.mateAccountCode = this.mateAccountCode;
      params.accountCode = this.accountCode;

      params.page = 0;

      for (let key in params) {
        if (!params[key]) {
          Reflect.deleteProperty(params, key)
        }
      }
      try {
        showLoading(".loadingClass", "数据加载中，请勿操作")
        let res = await api.findListPageAllReport(params);
        if (res.code == 0) {
          this.tableData = res.data||[];
        }
        hideLoading()
      } catch (error) {
        hideLoading()
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
.warp_table {
  padding: 1px;
}
</style>
