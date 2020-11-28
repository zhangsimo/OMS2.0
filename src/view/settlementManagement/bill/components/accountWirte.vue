<template>
  <Modal v-model="modal1" title="对账单查询" width="1000" @on-visible-change="visChange">
    <span class="mr5">对账期间：</span>
    <DatePicker v-model="dateQuery" class="mr10" type="daterange" placement="bottom-start" style="width: 200px"></DatePicker>
    <Checkbox v-model="checkSingle" @on-change="canShopList" :disabled="paymentId != 'YJDZ'" >是否跨店搜索</Checkbox>
    <span class="ml10">往来单位：</span>
    <Select
      ref="companyGuset"
      v-model="companyName"
      filterable
      clearable
      remote
      class="w150"
      :disabled="isCanChange"
      :remote-method="getOrignCompany"
      @on-change="getAccountNameListFun"
      :loading="searchLoading">
      <Option v-for="(option, index) in company" :value="option.id" :key="index">{{option.fullName}}</Option>
    </Select>
    <!--<Select v-model="companyId" class="w150" filterable>-->
      <!--<Option v-for="item in company" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
    <!--</Select>-->
    <span class="ml10">收付款类型：</span>
    <Select v-model="paymentId" class="w150" filterable disabled>
      <Option v-for="item in paymentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <Button @click="query" class="ml10">查询</Button>
    <Table
      class="mt10"
      :columns="account"
      :data="accountData"
      ref="table"
      max-height="450"
      highlight-row
      @on-current-change="seleteDate"
    ></Table>
    <div slot="footer">
      <Button type="primary" @click="determine">确定</Button>
      <Button @click="modal1=false">取消</Button>
    </div>
    <idDetailed ref="idDetailed" />
    <!-- <selectDealings ref="selectDealings" @selectSearchName="getOne"  /> -->
  </Modal>
</template>
<script>
import idDetailed from "./idDetailed";
import { findGuest } from "_api/settlementManagement/advanceCollection.js";
import { findAccount } from "_api/settlementManagement/seleteAccount.js";
import { getDataDictionaryTable } from "@/api/system/dataDictionary/dataDictionaryApi"; /*拉取收付款类型字典详情*/
import bus from "../Popup/Bus";
import moment from "moment";
export default {
  props: ["information"],
  components: {
    idDetailed
    // selectDealings
  },
  data() {
    return {
      dateQuery: "", //时间
      company: [], //往来单位
      companyId: "", //往来单位id
      companyName:"",//往来单位name
      searchLoading:false,
      modal1: false, //弹窗展示
      account: [
        {
          title: "序号",
          type: "index",
          width: 40,
          className: "tc"
        },
        {
          title: "门店",
          key: "orgName",
          className: "tc"
        },
        {
          title: "对账日期",
          key: "createTime",
          className: "tc"
        },
        {
          title: "对账单号",
          key: "accountNo",
          className: "tc",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  cursor: "pointer",
                  color: "#87CEFA"
                },
                on: {
                  click: () => {
                    this.$refs.idDetailed.modal1 = true;
                    this.$refs.idDetailed.infoData = {
                      orgId:params.row.orgId,
                      guestId:params.row.guestId,
                      accountNo:params.row.accountNo
                    }
                  }
                }
              },
              params.row.accountNo
            );
          }
        },
        {
          title: "往来单位",
          key: "guestName",
          className: "tc"
        },
        {
          title: "收付类型",
          key: "receivePaymentTypeName",
          className: "tc"
        },
        {
          title: "实际收付款金额",
          key: "actualCollectionOrPayment",
          className: "tc"
        }
      ], //选择不含税对账单单
      accountData: [], //选择不含税对账单单表格数据
      seleteData: {}, //单选数据
      paymentId: "YJDZ", //收付类型
      paymentList: [], //收付类型下拉框,
      sort:'', // 判断是预收款还是预付款其他为空
      isCanChange:false,//往来单位是否可选
      checkSingle:false,
    };
  },
  methods: {
    //  是否可以跨店搜索
    canShopList(e){
      this.$refs.companyGuset.query = this.$parent.$parent.reconciliationStatement.guestName||""
      this.companyId = this.$parent.$parent.reconciliationStatement.guestId||"";
      this.seleteQuery();
      this.isCanChange = e
    },

    //获取往来单位
    async getOrignCompany(query){
      if (query !== '') {
        this.searchLoading = true;
        let req = {
          fullName:query,
          size:100,
        }
        let rep = await findGuest(req);
        this.searchLoading = false;
        if(rep.code==0){
          this.company = rep.data.content;
        }
      } else {
        this.company = [];
      }
    },


    // 对话框是否显示
    visChange(flag) {
      if (flag) {
        this.companyId = this.$parent.$parent.reconciliationStatement.guestId||"";
        this.$refs.companyGuset.query = this.$parent.$parent.reconciliationStatement.guestName||""
        //收付类型数据字典
        getDataDictionaryTable({ dictCode: "RECEIVE_PAYMENT_TYPE" }).then(
          res => {
            this.paymentList = [];
            res.data.map(item => {
              this.paymentList.push({
                value: item.itemCode,
                label: item.itemName
              });
            });
          }
        );
        // this.getOne();
        this.seleteQuery();
      }
    },
    getAccountNameListFun(v){
      this.companyId = v;
      this.seleteQuery();
    },
    seleteQuery() {
      let obj = {
        startDate: this.dateQuery[0]
          ? moment(this.dateQuery[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endDate: this.dateQuery[1]
          ? moment(this.dateQuery[1]).format("YYYY-MM-DD 23:59:59")
          : "",
        receivePaymentType: this.paymentId,
        guestId: this.companyId,
        sort:this.sort,
        crossStoreSearch: this.checkSingle? 1 : 0
      };
      obj.size = 9999
      obj.page = 0
      findAccount(obj).then(res => {
        if (res.code === 0) {
          this.accountData = res.data.content;
        }
      });
    },
    // 日期查询
    query() {
      this.seleteQuery();
    },
    // 确认按钮
    determine() {
      if (this.seleteData&&Object.keys(this.seleteData).length !== 0) {
        bus.$emit("accountHedNo", this.seleteData,this.seleteData.accountNo);
        this.modal1 = false;
      } else {
        this.$message.error("请选择一条对账单");
      }
    },
    // 单选数据
    seleteDate(currentRow) {
      let list = this.$parent.$parent.BusinessType;
      if (currentRow&& list.find( item => item.accountNo === currentRow.accountNo )) {
        this.$refs.table.clearCurrentRow()
        return this.$message.error("对账单号已存在");
      } else {
        this.seleteData = currentRow;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.input {
  position: relative;
  left: -26px;
  bottom: -5px;
}
</style>
