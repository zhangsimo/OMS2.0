<template>
  <Modal title="本店待认领款" width="1000" v-model="visibal">
    <div class="clearfix mb20">
      <div class="mr10 fl">
        <span>查询日期：</span>
        <Date-picker
          formate="yyy-MM-dd"
          v-model="dateValue"
          type="daterange"
          placeholder="请选择日期"
          class="w180"
          @on-change="changeDate"
        ></Date-picker>
      </div>
      <div class="mr10 fl">
        <span>金额：</span>
        <Input class="w80" v-model="amount"/>
      </div>
      <div class="mr10 fl">
        <span>对方户名：</span>
        <Input class="w100" v-model="account"/>
      </div>
      <div class="mr10 fl">
        <span>业务类别：</span>
        <Select 
          class="w100"
          clearable
          v-model="category"
        >
          <Option v-for="(item, index) in options" :value="item.itemName" :key="index">{{item.itemName}}</Option>
        </Select>
      </div>
      <div>
        <Button @click="queryClaimed" icon="ios-search">查询</Button>
      </div>
    </div>
    <vxe-table
      border
      stripe
      highlight-hover-row
      show-overflow="title"
      :data="tableData"
      :auto-resize="true"
      size="mini"
      align="center"
      @checkbox-all="selectAll"
      @checkbox-change="selectData"
    >
      <vxe-table-column type="checkbox"></vxe-table-column>
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column title="所属门店" field="shopName"></vxe-table-column>
      <vxe-table-column title="发生日期" field="createTime"></vxe-table-column>
      <vxe-table-column title="业务类别" field="businessType"></vxe-table-column>
      <vxe-table-column title="支出金额" field="paidMoney"></vxe-table-column>
      <vxe-table-column title="收入金额" field="incomeMoney"></vxe-table-column>
      <vxe-table-column title="未认领金额" field="unClaimedAmt"></vxe-table-column>
      <vxe-table-column title="对方户名" field="reciprocalAccountName"></vxe-table-column>
      <vxe-table-column title="账户" field="accountName"></vxe-table-column>
      <vxe-table-column title="交易备注" field="tradingNote"></vxe-table-column>
      <vxe-table-column title="智能匹配往来单位" field="suppliers"></vxe-table-column>
    </vxe-table>
    <Page
      show-sizer
      show-total
      show-elevator
      class="mt10 tr"
      size="small"
      :total="claimedPage.total"
      :current="claimedPage.page"
      :page-size="claimedPage.size"
      @on-change="pageChangeAmt"
      @on-page-size-change="sizeChangeAmt"
    />
    <div slot="footer">
      <Button type="primary" @click="confirm">确定</Button>
      <Button @click="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
import { forEach } from '@/libs/tools';
import {claimedFund} from "_api/settlementManagement/fundsManagement/claimWrite";
// import {creat} from "../../components"; // 获取业务类别
import {getDataDictionaryTable} from "@/api/system/dataDictionary/dataDictionaryApi";
import moment from "moment";


export default {
  data(){
    return {
      visibal: false, // 控制弹窗显示隐藏
      dateValue: '',  // 时间搜索条件
      amount: '', // 金额搜索条件
      account: '',  // 账户搜索条件
      category: '', // 业务分类搜索条件
      options: [], // 获取业务分类数组
      tableData: [],  
      claimedPage: {
        page: 1,
        total: 0,
        size: 10
      }, //分页
      selectList: [], //选中的表格数据
    }
  },
  mounted(){
    this.getCategory()
  },
  methods: {
    open(){
      this.visibal = true
      this.getList()
    },
    close(){
      this.visibal = false
      this.dateValue = ''
      this.amount = ''
      this.account = ''
      this.category = ''
    },
    changeDate(val){
    },
    //页码改变
    pageChangeAmt(val){
      this.claimedPage.page = val
      this.getList()
    },
    //条数改变
    sizeChangeAmt(val){
      this.claimedPage.page = 1
      this.claimedPage.size = val
      this.getList()
    },
    getList(){
      let obj = {
        startDate: this.dateValue[0] ? moment(this.dateValue[0]).format("YYYY-MM-DD")+" 00:00:00" : '',
        endDate: this.dateValue[1] ? moment(this.dateValue[1]).format("YYYY-MM-DD")+" 23:59:59" : '',
        businessType: this.category,
        reciprocalAccountName: this.account,
        loanId: this.$parent.$parent.currRow.id,
        amount: this.amount,
        page: this.claimedPage.page - 1,
        size: this.claimedPage.size,
        amountType: this.$parent.$parent.amountType,
        claimShopCode:this.$store.state.user.userData.currentCompany.code
      };
      Object.keys(obj).map((item) => {
        if (!obj[item]) {
          delete obj[item];
        }
        return true;
      })
      claimedFund(obj).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.content.filter(item => item.unClaimedAmt != 0);
          this.claimedPage.total = res.data.totalElements;
        }
      })
    },

    // 选中的数据
    selectData({checked,records}){
      this.selectList = records
    },
    // 全选
    selectAll({checked,records}){
      this.selectList = records
    },

    // 认领弹框查询
    queryClaimed() {
      this.claimedPage.page = 1;
      // let t = 0;
      // if (this.claimCollectType == 1) {
      //   t = 2
      // } else {
      //   t = 1
      // }
      this.getList()
    },

    confirm(){
      this.$parent.setSelectData(this.selectList)
      this.close()
    },

    //获取业务类别
    getCategory(){
      getDataDictionaryTable({dictCode: "YWLX"}).then(res => {
        this.options = res.data || []
      })
    }
    
  }
}
</script>

<style lang="less" scoped>

</style>