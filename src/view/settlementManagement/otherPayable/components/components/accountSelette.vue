<template>
  <Modal
    v-model="modal1"
    title="对账单查询"
    width="860"
    @on-visible-change="visChange"
  >
    <span class="mr5">对账期间：</span>
    <DatePicker
      v-model="dateQuery"
      type="daterange"
      placement="bottom-start"
      style="width: 200px"
    ></DatePicker>
    <span class="ml10">往来单位：</span>
    <Select v-model="companyId" class="w150" filterable>
      <Option v-for="item in company" :value="item.value" :key="item.value">{{
        item.label
      }}</Option>
    </Select>
    <span class="ml10">收付款类型：</span>
    <Select v-model="receivePaymentType" class="w150" filterable>
      <Option
        v-for="item in receivePayments"
        :value="item.value"
        :key="item.value"
        >{{ item.label }}</Option
      >
    </Select>
    <Button @click="query" class="ml10">查询</Button>
    <Table
      class="mt10"
      :columns="account"
      :data="accountData"
      highlight-row
      @on-current-change="seleteDate"
    ></Table>
    <Page
      class-name="fr mb10"
      size="small"
      :current="page.num"
      :total="page.total"
      :page-size="page.size"
      @on-change="changePage"
      @on-page-size-change="changeSize"
      show-sizer
      show-total
    ></Page>
    <div slot="footer">
      <Button type="primary" @click="determine">确定</Button>
      <Button @click="modal1 = false">取消</Button>
    </div>
    <idDetailed ref="idDetailed" />
    <!-- <selectDealings ref="selectDealings" @selectSearchName="getOne"  /> -->
  </Modal>
</template>
<script>
import idDetailed from "./idDetailed";
import { getSupplierList } from "_api/purchasing/purchasePlan";
import { getbayer } from "@/api/AlotManagement/threeSupplier";
import * as api from "_api/settlementManagement/advanceCharge";
import { getDataDictionaryTable } from "@/api/system/dataDictionary/dataDictionaryApi";
import { findGuest} from "_api/settlementManagement/advanceCollection.js";
import bus from "../../../bill/Popup/Bus";
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
      modal1: false, //弹窗展示
      page: {
        num: 1,
        size: 10,
        total: 0,
        opts: [20, 50, 100, 200]
      },
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
      receivePaymentType: "YJDZ", // 收付款类型
      receivePayments: [] // 收付款类型
    };
  },
  mounted() {
    getDataDictionaryTable({ dictCode: "RECEIVE_PAYMENT_TYPE" }).then(res => {
      res.data.map(item => {
        this.receivePayments.push({
          value: item.itemCode,
          label: item.itemName
        });
      });
    });
  },
  methods: {
    // 往来单位下拉框
    async getOne() {
      findGuest({size:2000}).then(res => {
        if (res.code === 0) {
          this.company=[]
          res.data.content.map(item=>{
            this.company.push({
              value:item.id,
              label:item.fullName
            })
          })
        }
      });
    },
    // 对话框是否显示
    visChange(flag) {
      if (flag) {
        this.getOne();
      }
      this.page = {
        num: 1,
        size: 10,
        total: 0,
        opts: [20, 50, 100, 200]
      }
      this.seleteQuery();
      this.accountData = [];
    },
    async seleteQuery() {
      const userData = this.$store.state.user.userData;
      let obj = {
        startDate: this.dateQuery[0]
          ? moment(this.dateQuery[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endDate: this.dateQuery[1]
          ? moment(this.dateQuery[1]).format("YYYY-MM-DD 23:59:59")
          : "",
        guestId: this.companyId,
        tenantId: userData.tenantId,
        orgid: "", // userData.shopId
        receivePaymentType: this.receivePaymentType
      };
      for (let key in obj) {
        if (!obj[key]) {
          delete obj[key];
        }
      }
      obj = { ...obj, size: this.page.size, page: this.page.num - 1 };
      let res = await api.findPageByCapitalQuery(obj);
      if (res.code == 0) {
        this.accountData = res.data.content;
        this.page.total = res.data.totalElements;
      }
      this.seleteData = {};
    },
    // 日期查询
    query() {
      this.seleteQuery();
    },
    //分页
    changePage(p) {
      this.page.num = p;
      this.seleteQuery();
    },
    changeSize(size) {
      this.page.num = 1;
      this.page.size = size;
      this.seleteQuery();
    },
    // 确认按钮
    determine() {
      if (Object.keys(this.seleteData).length !== 0) {
        this.$emit("accountHedNo", this.seleteData);
        // bus.$emit("accountHedNo", this.seleteData);
        this.modal1 = false;
      } else {
        this.$message.error("请选择一条对账单");
      }
    },
    // 单选数据
    seleteDate(currentRow) {
      this.seleteData = currentRow;
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
