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
            <span>查询日期：</span>
            <Date-picker :value="dates" type="daterange" placeholder="选择日期" class="w200"
                         @on-change="changedate"></Date-picker>
          </div>
          <div class="db ml15">
            <span>分店名称：</span>
            <Select v-model="BranchstoreId" :disabled="selectShopList" class="w150" @on-change="query">
              <Option
                v-for="item in Branchstore"
                :value="item.id"
                :key="item.id"
              >{{ item.shortName }}
              </Option>
            </Select>
          </div>
          <div class="db ml15">
            <span>往来单位：</span>
            <!-- <Select
              v-model="companyId"
              class="w150"
              clearable
              filterable
              remote
              :loading="remoteloading"
              :remote-method="getOne"
              @on-change="query"
            >
              <Option v-for="item in company" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select> -->
            <input type="text" class="h30" v-model="companyId" />
          </div>
          <div class="db ml15">
            <span>收付款单号：</span>
            <Input type="text" v-model="payOrderNo" style="width: 120px"/>
          </div>
          <div class="db ml15">
            <span>收付款单号：</span>
            <Input type="text" v-model="orderNo" style="width: 120px"/>
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
          <div class="db ml5">
            <Button type="default" @click="exportTable" v-has="'export'">
              <i class="icon icon-"></i>
              导出
            </Button>
          </div>
          <div class="db ml5">
            <button
              class="ivu-btn ivu-btn-default"
              type="button"
              @click="SubmitAudit"
              :disabled="oneList.length <= 0"
              v-has="'audit'"
            >
              <span>审核</span>
            </button>
          </div>
          <div class="db ml5">
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="reAudit"
              :disabled="oneList.length <= 0"
              v-has="'revoke'"
            >
              <span>撤销</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <div class="mt15">
      <Tabs type="card" v-model="tabName" @on-click="clickTabs">
        <TabPane label="应收审核" name="capitalChain1">
          <table-one ref="capitalChain1" :tbdata="tableData1" @selection="selection"/>
        </TabPane>
        <TabPane label="应付审核" name="capitalChain2">
          <table-two ref="capitalChain2" :tbdata="tableData2" @selection="selection"/>
        </TabPane>
        <TabPane label="预收款审核" name="capitalChain3">
          <table-three ref="capitalChain3" :tbdata="tableData3" @selection="selection"/>
        </TabPane>
        <TabPane label="预付款审核" name="capitalChain4">
          <table-four ref="capitalChain4" :tbdata="tableData4" @selection="selection"/>
        </TabPane>
        <TabPane label="其他应收款审核" name="capitalChain5">
          <table-five ref="capitalChain5" :tbdata="tableData5" @selection="selection"/>
        </TabPane>
        <TabPane label="其他应付款审核" name="capitalChain6">
          <table-six ref="capitalChain6" :tbdata="tableData6" @selection="selection"/>
        </TabPane>
        <TabPane label="费用报销/因公借支审核" name="capitalChain7">
          <table-seven ref="capitalChain7" :tbdata="tableData7" @selection="selection"/>
        </TabPane>
        <TabPane label="转损益审核" name="capitalChain8">
          <table-eight ref="capitalChain8" :tbdata="tableData8" @selection="selection"/>
        </TabPane>
      </Tabs>
      <div class="clearfix">
        <Page
          class-name="fr mb10 mt10"
          size="small"
          :current="page.num"
          :total="page.total"
          :page-size="page.size"
          :page-size-opts="page.sizeArr"
          @on-change="changePage"
          @on-page-size-change="changeSize"
          show-sizer
          show-total
        ></Page>
      </div>
    </div>

    <!-- 资金审核撤销 -->
    <Modal v-model="isShow" title="资金审核撤销">
      <span>撤销原因：</span>
      <Input class="w200 ml10" v-model="content"/>
      <div slot="footer">
        <Button type="primary" @click="reAuditOk">确认</Button>
        <Button @click="isShow = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import QuickDate from "_c/getDate/dateget";
  import TableOne from "./components/TableOne";
  import TableTwo from "./components/TableTwo";
  import TableThree from "./components/TableThree";
  import TableFour from "./components/TableFour";
  import TableFive from "./components/TableFive";
  import TableSix from "./components/TableSix";
  import TableSeven from "./components/TableSeven";
  import TableEight from "./components/TableEight";
  import {exportDailyFundAudit /**导出*/} from "../../../api/settlementManagement/Import";
  import {findGuest} from "_api/settlementManagement/advanceCollection.js";
  import * as api from "_api/settlementManagement/Dailyfundaudit/index.js";
  import {goshop} from '@/api/settlementManagement/shopList';
  import {creat} from "./../components";
  import moment from "moment";
  import {showLoading, hideLoading} from "@/utils/loading"

  export default {
    name: 'settlementManagementDailyfundaudit',
    components: {
      QuickDate,
      TableOne,
      TableTwo,
      TableThree,
      TableFour,
      TableFive,
      TableSix,
      TableSeven,
      TableEight
    },
    data() {
      return {
        remoteloading: false,
        // 数据类
        page: {
          total: 0,
          sizeArr: [10, 20, 30, 40, 50],
          size: 10,
          num: 1
        },//分页
        tabName: "capitalChain1", // tabs栏
        oneList: [], // 表格选中
        tableData1: [], // 应收审核
        tableData2: [], // 应付审核
        tableData3: [], // 预收款审核
        tableData4: [], // 预付款审核
        tableData5: [], // 其他应收款审核
        tableData6: [], // 其他应付款审核
        tableData7: [], // 费用报销/因公借支审核
        tableData8: [], // 转损益审核
        dates: [], // 查询日期
        BranchstoreId: "", // 分店id
        Branchstore: [
          {id: '0', shortName: '全部'}
        ], //分店名称
        companyId: "", // 往来单位id
        company: [], // 往来单位
        payOrderNo: "", // 收付款单号
        orderNo: "", // 对账单号
        content: "", // 撤销原因
        // 状态类
        isShow: false // 撤销原因modal
      };
    },
    async mounted() {
      let arr = await creat(this.$refs.quickDate.val, this.$store);
      this.dates = arr[0];
      this.$nextTick(() => {
        this.BranchstoreId = arr[1]
        this.query();
      })
      this.getShop()
      // this.getCompany();
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
      //获取门店
      async getShop() {
        let data = {}
        let res = await goshop(data)
        if (res.code === 0) return this.Branchstore = [...this.Branchstore, ...res.data]
      },
      // 快速查询
      getDataQuick(v) {
        this.dates = v;
        this.query();
      },
      changedate(daterange) {
        this.value = daterange;
        this.query()
      },
      // 往来单位
      async getOne(query) {
        this.company = [];
        if (query != "") {
          this.remoteloading = true;
          findGuest({fullName: query, size: 20}).then(res => {
            if (res.code === 0) {
              this.company = [];
              res.data.content.map(item => {
                this.company.push({
                  value: item.id,
                  label: item.fullName
                });
              });
              this.remoteloading = false;
            }
          });
        } else {
          this.company = [];
        }
      },
      // 查询
      async query() {
        this.page.num = 1
        this.oneList = [];
        this.getPageList(this.tabName)
        //
        // let params = {
        //   startTime: this.dates[0],
        //   endTime: this.dates[1],
        //   guestSourceId: this.companyId,
        //   businessNumbers: this.payOrderNo,
        //   businessNumbersList: this.orderNo,
        //   shopNumber: this.BranchstoreId==0?"":this.BranchstoreId,
        //   size: this.page.size,
        // }
        //
        // if (this.dates.length === 2 && this.dates[0]) {
        //   params.startTime = moment(this.dates[0]).format("YYYY-MM-DD") + " 00:00:00";
        //   params.endTime = moment(this.dates[1]).format("YYYY-MM-DD") + " 23:59:59";
        // }
        //
        // for (let key in params) {
        //   if (!params[key]) {
        //     Reflect.deleteProperty(params, key)
        //   }
        // }
        //
        // params.page = this.page.num - 1;
        // try {
        //   [
        //     this.tableData1,
        //     this.tableData2,
        //     this.tableData3,
        //     this.tableData4,
        //     this.tableData5,
        //     this.tableData6,
        //     this.tableData7,
        //     this.tableData8
        //   ] = await api.getTableData(params);
        //   this.getPageList(this.tabName)
        // } catch (error) {
        // }
      },
      // 切换tabs
      clickTabs(data) {
        this.$refs[data].clear();
        this.page.size = 10;
        this.page.num = 1;
        this.getPageList(data)
      },
      getPageList(data) {
        let params = {
          startTime: this.dates[0]?moment(this.dates[0]).format("YYYY-MM-DD") + " 00:00:00":"",
          endTime: this.dates[1]?moment(this.dates[1]).format("YYYY-MM-DD") + " 23:59:59":"",
          guestSourceName: this.companyId.trim(),
          businessNumbers: this.payOrderNo,
          businessNumbersList: this.orderNo,
          shopNumber: this.BranchstoreId==0?"":this.BranchstoreId,
          size: this.page.size,
          page: this.page.num - 1
        }
        // console.log(this.tabName,11112222)
        switch (data) {
          case "capitalChain1":
            this.$refs[data].getList(params)
            break;
          case "capitalChain2":
            this.$refs[data].getList(params)
            break;
          case "capitalChain3":
            this.$refs[data].getList(params)
            break;
          case "capitalChain4":
            this.$refs[data].getList(params)
            break;
          case "capitalChain5":
            this.$refs[data].getList(params)
            break;
          case "capitalChain6":
            this.$refs[data].getList(params)
            break;
          case "capitalChain7":
            this.$refs[data].getList(params)
            break;
          case "capitalChain8":
            this.$refs[data].getList(params)
            break;
        }
      },
      changePage(p) {
        this.page.num = p;
        this.getPageList(this.tabName)
      },
      changeSize(size) {
        this.page.num = 1;
        this.page.size = size;
        // console.log(this.tabName, 1111)
        this.getPageList(this.tabName)
      },
      exportTable(){
        if(this.tableData1.length<1&&this.tableData2.length<1&&this.tableData3.length<1&&this.tableData4.length<1&&this.tableData5.length<1&&this.tableData6.length<1&&this.tableData7.length<1&&this.tableData8){
          return this.$message.error("暂无数据可导出")
        }
        let data={
          startTime: this.dates[0]?moment(this.dates[0])
            .startOf("day")
            .format("YYYY-MM-DD HH:mm:ss"):"",
          endTime: this.dates[1]?moment(this.dates[1])
            .endOf("day")
            .format("YYYY-MM-DD HH:mm:ss"):"",
          guestSourceName: this.companyId,
          businessNumbers: this.payOrderNo,
          businessNumbersList: this.orderNo,
          shopNumber: this.BranchstoreId==0?"":this.BranchstoreId
        }
        let params=""
        for(let i in data){
          params+=`${i}=${data[i]}&`
        }
        location.href=exportDailyFundAudit(params)
      },
      // 勾选的数据
      selection(arr) {
        this.oneList = arr || [];
      },
      // 审核
      SubmitAudit() {
        this.$Modal.confirm({
          title: '资金审核',
          content: '<p>确认审核</p>',
          onOk: async () => {
            let ids = this.oneList.map(el => el.id)
            let res = await api.dailyFundAudit({ids})
            if (res.code == 0) {
              if(res.data instanceof Array){
                if(res.data[0]){
                  this.$message.error(res.data[0])
                }else{
                  this.$message.success('审核成功！')
                }
              }
            }
            this.query()
          },
          onCancel: () => {
          }
        });
      },
      // 撤销审核
      reAudit() {
        this.isShow = true;
        this.content = "";
      },
      // 撤销审核 ok
      async reAuditOk() {
        let remark = this.content.trim();
        if (remark.length <= 0) {
          return this.$message.error("请输入撤销原因")
        }
        if(this.oneList.length>1){
          return this.$message.error("只能操作一笔订单");
        }
        let id = this.oneList.map(el => el.id).join('');
        let res = await api.withdraw({
          id, remark
        })
        if (res.code == 0) {
          this.$message.success(res.data)
          this.isShow = false;
          this.query();
        }
      },
      // 修改凭证
      putVoucher() {
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
</style>
