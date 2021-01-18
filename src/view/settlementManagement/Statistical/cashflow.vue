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
            <Select v-model="areaId" class="w150" :disabled="selectShopList">
              <Option v-for="item in areas" :value="item.id" :key="item.id">{{
                item.companyName
              }}</Option>
            </Select>
          </div>
          <div class="db ml15">
            <span>门店：</span>
            <Select v-model="BranchstoreId" class="w150" @on-change="query" :disabled="selectShopList">
              <Option
                v-for="item in Branchstore"
                :value="item.id"
                :key="item.id"
                >{{ item.shortName }}</Option
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
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              v-has="'export'"
              @click="getExport"
            >
              <span>导出</span>
            </button>
          </div>
        </div>
      </div>
      <div>
        <div class="head">
          <span>昨日余额</span>
          <span>{{ headData.yesterdayMoney }}</span>
          <span>本日收款</span>
          <span>{{ headData.incomeMoney }}</span>
          <span>本日付款</span>
          <span>{{ headData.paidMoney }}</span>
          <span>本日余额</span>
          <span>{{ headData.balanceMoney }}</span>
        </div>
        <div class="head">
          <span>本期期初余额</span>
          <span>{{ headData.startMoney||0  }}</span>
          <span>本期累计收款</span>
          <span>{{ headData.totalIncomeMoney||0  }}</span>
          <span>本期累计付款</span>
          <span>{{ headData.totalPaidMoney||0  }}</span>
          <span>本期期末余额</span>
          <span>{{ headData.totalBalanceMoney||0  }}</span>
        </div>
      </div>
    </section>

    <Tabs type="card" class="mt20" v-model="currentTab">
        <TabPane label="现金流量表" name="cash">
          <div class="warp_table">
            <vxe-table
              border
              resizable
              auto-resize
              align="center"
              height="600"
              :span-method="mergeRowMethod"
              :data="tableData"
            >
              <vxe-table-column title="《现金流量表》">
                <vxe-table-column title="项目信息">
                  <vxe-table-column title="大项" field="maxterm"></vxe-table-column>
                  <vxe-table-column
                    title="现金流科目"
                    field="cashAccount"
                  ></vxe-table-column>
                  <vxe-table-column title="行次" field="rowNo"></vxe-table-column>
                  <vxe-table-column
                    title="具体项目类别"
                    field="accountType"
                  ></vxe-table-column>
                  <vxe-table-column
                    title="凭证对应会计科目"
                    field="voucherAccount"
                  ></vxe-table-column>
                </vxe-table-column>
                <vxe-table-column title="金额信息">
                  <vxe-table-column title="现金" field="cashMoney"></vxe-table-column>
                  <vxe-table-column
                    title="银行卡"
                    field="cartoonMoney"
                  ></vxe-table-column>
                  <vxe-table-column
                    title="银行账户"
                    field="accountMoney"
                  ></vxe-table-column>
                  <vxe-table-column
                    title="资金合计"
                    field="totalMoney"
                  ></vxe-table-column>
                </vxe-table-column>
                <vxe-table-column title="其他信息">
                  <vxe-table-column title="备注" field="remarks"></vxe-table-column>
                </vxe-table-column>
              </vxe-table-column>
            </vxe-table>
          </div>
        </TabPane>
        <TabPane label="账户余额表" name="account">
          <div >
            <vxe-table
              border
              resizable
              auto-resize
              align="center"
              height="600"
              size="small"
              :data="accountData"
              show-footer
              :footer-method="footerMethod"
            >
              <vxe-table-column title="序号" type="seq" width="60"></vxe-table-column>
              <vxe-table-column title="所属区域" field="area"></vxe-table-column>
              <vxe-table-column title="所属店号" field="shopCode"></vxe-table-column>
              <vxe-table-column title="所属门店" field="shopName"></vxe-table-column>
              <vxe-table-column title="账户" field="accountName"></vxe-table-column>
              <vxe-table-column title="账号" field="accountCode"></vxe-table-column>
              <vxe-table-column title="开户行" field="bankName"></vxe-table-column>
              <vxe-table-column title="对应科目" field="mateAccountName"></vxe-table-column>
              <vxe-table-column title="期初余额" field="balanceMoney"></vxe-table-column>
              <vxe-table-column title="累计收款" field="inComeMoney"></vxe-table-column>
              <vxe-table-column title="累计付款" field="paidMoney"></vxe-table-column>
              <vxe-table-column title="期末余额" field="endMoney"></vxe-table-column>
            </vxe-table>
            <div class="forShow">
              <Page
                :total="page.total"
                :current="page.pageNum"
                :page-size="page.pageSize"
                :page-size-opts="page.pageSizeO"
                show-sizer
                show-total
                show-elevator 
                @on-change="changeNum"
                @on-page-size-change="changeSize"
              />
            </div>
          </div>
        </TabPane>
    </Tabs>
  </div>
</template>

<script>
import {
  are,
  // goshop
} from "@/api/settlementManagement/fundsManagement/capitalChain";
import { goshop } from '@/api/settlementManagement/shopList';
import * as api from "_api/settlementManagement/financialStatement.js";
import QuickDate from "@/components/getDate/dataget2.vue";
import moment from "moment";
import XEUtils from "xe-utils";
import {showLoading, hideLoading} from "@/utils/loading"
export default {
  name: "cashflow",
  components: {
    QuickDate
  },
  data() {
    return {
      // 数据类
      headData: {
        balanceMoney: 0,
        incomeMoney: 0,
        paidMoney: 0,
        yesterdayMoney: 0,
        startMoney:0,
        totalBalanceMoney:0,
        totalPaidMoney:0,
        totalIncomeMoney:0
      },
      tableData: [], // 主表
      dates: [], // 查询日期
      areaId: "", // 区域id
      areas: [], // 区域
      BranchstoreId: this.$store.state.user.userData.currentCompany.id, // 门店id
      Branchstore: [], // 门店
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        pageSizeO: [10,20,50,100]
      },//账户余额表分页对象
      accountData: [],//账户余额表数据
      currentTab: 'cash',
      balanceMoneyTotal: 0,
      endMoneyTotal: 0,
      incomeMoneyTotal: 0,
      paidMoneyTotal: 0,
    };
  },
  async mounted() {
    this.dates = this.$refs.quickDate.val;
    this.getArea();
    this.getShop();
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
    //分页页码改变
    changeNum(num){     
      this.page.pageNum = num
      this.queryAccount()
    },
    //分页每页条数改变
    changeSize(size){
      this.page.pageNum = 1
      this.page.pageSize = size
      this.queryAccount()
    },
    mergeRowMethod({ row, $rowIndex, column, data }) {
      const fields = ["maxterm"];
      const cellValue = XEUtils.get(row, column.property);
      if (cellValue && fields.includes(column.property)) {
        const prevRow = data[$rowIndex - 1];
        let nextRow = data[$rowIndex + 1];
        if (prevRow && XEUtils.get(prevRow, column.property) === cellValue) {
          return { rowspan: 0, colspan: 0 };
        } else {
          let countRowspan = 1;
          while (
            nextRow &&
            XEUtils.get(nextRow, column.property) === cellValue
          ) {
            nextRow = data[++countRowspan + $rowIndex];
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 };
          }
        }
      }
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
    // 门店
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
      this.Branchstore = [{ id: 0, name: "全部",shortName:"全部" }];
      let res = await goshop(data);
      if (res.code === 0) {
        this.Branchstore = [...this.Branchstore, ...res.data];
        this.$nextTick(() => {
          this.BranchstoreId = this.$store.state.user.userData.currentCompany.id ||"";
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
        this.query()
      }
    },
    //导出
      getExport() {
      if(this.$refs.quickDate._data.searchQuick=="0"){
       return this.$message.warning("请选择查询日期范围");
      }
       if(!this.dates[0]){
        return this.$message.warning("请选择查询日期范围");
      }
         if (this.tableData <= 0) {
        return this.$message.warning("暂无数据导出");
      }
      let data = {};
      data.areaId = this.areaId == "0" ? "" : this.areaId
      data.shopNumber = this.BranchstoreId == "0" ? "" : this.BranchstoreId
      if (this.dates.length === 2 && this.dates[0]) {
        data.startTime = moment(this.dates[0]).format("YYYY-MM-DD");
        data.endTime = moment(this.dates[1]).format("YYYY-MM-DD");
      }
      data.mateAccountCode = this.mateAccountCode;
      data.accountCode = this.accountCode;
      let params = "";
      for (let d in data) {
        if (!data[d]) {
          delete data[d];
        }
      }
      for (var i in data) {
        params += `${i}=${data[i]}&`;
      }
      location.href = api.getPayablesExportsix(params)
    },
    query(){
      if(this.currentTab === 'cash'){
        this.queryCash()
      }else{
        this.page.pageNum = 1
        this.queryAccount()
      }
    },
    // 查询
    async queryCash() {
      let params = {
        areaId: this.areaId,
        shopNumber: this.BranchstoreId,
        size: 10000
      };
      if (this.dates.length === 2 && this.dates[0]) {
        params.startTime =
          moment(this.dates[0]).format("YYYY-MM-DD");
        params.endTime =
          moment(this.dates[1]).format("YYYY-MM-DD");
      }
      params.page = 0;
      for (let key in params) {
        if (!params[key]) {
          Reflect.deleteProperty(params, key);
        }
      }
      try {
        showLoading(".loadingClass", "数据加载中，请勿操作")
        let res = await api.findListPageAllCashFlowChange(params);
        if (res.code == 0) {
          this.tableData = res.data.flowList;
          this.headData = res.data.moneyList
        }
        hideLoading()
      } catch (error) {
        hideLoading()
      }
    },

    //账户余额表的数据查询
    async queryAccount() {
      let params = {
        areaId: this.areaId,
        shopNumber: this.BranchstoreId,
        page: this.page.pageNum - 1,
        size: this.page.pageSize,
      };
      if (this.dates.length === 2 && this.dates[0]) {
        params.startTime =
          moment(this.dates[0]).format("YYYY-MM-DD");
        params.endTime =
          moment(this.dates[1]).format("YYYY-MM-DD");
      }
      for (let key in params) {
        if (!params[key]) {
          Reflect.deleteProperty(params, key);
        }
      }
     
      try {
        showLoading(".loadingClass", "数据加载中，请勿操作")
        let res = await api.findAccountBalanceList(params);
        if (res.code == 0) {
          this.accountData = res.data.voList
          this.page.total = res.data.totalElements
          this.balanceMoneyTotal = res.data.balanceMoneyTotal
          this.endMoneyTotal = res.data.endMoneyTotal
          this.incomeMoneyTotal = res.data.incomeMoneyTotal
          this.paidMoneyTotal = res.data.paidMoneyTotal
        }
        hideLoading()
      } catch (error) {
        hideLoading()
      }
    },
    //表尾合计
    footerMethod({columns, data}) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "合计";
          }
          if (columnIndex === 8) {
            return this.balanceMoneyTotal;
          }
          if (columnIndex === 9) {
            return this.incomeMoneyTotal;
          }
          if (columnIndex === 10) {
            return this.paidMoneyTotal;
          }
          if (columnIndex === 11) {
            return this.endMoneyTotal;
          }
          return null;
        }),
        // columns.map((column, columnIndex) => {
        //   if (columnIndex === 0) {
        //     return "总合计";
        //   }
        //   for (let key in this.total) {
        //     if (key == column.property) {
        //       return this.total[key]
        //     }
        //   }
        //   return null;
        // })
      ];
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
.head {
  display: flex;
  align-items: center;
  padding: 5px 15px;
  text-align: center;
}
.head span {
  flex: 1;
  border: 1px solid #ccc;
  line-height: 1.5rem;
  margin-left: -1px;
}

.head span:nth-of-type(odd) {
  background-color: skyblue;
  color: #fff;
}
.forShow{
  margin-top: 10px;
  margin-bottom: 200px;
  float: right;
}
</style>
