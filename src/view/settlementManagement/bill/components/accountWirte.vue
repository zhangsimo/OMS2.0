<template>
  <Modal v-model="modal1" title="对账单查询" width="860" @on-visible-change="visChange">
    <span class="mr5">对账期间：</span>
    <DatePicker v-model="dateQuery" type="daterange" placement="bottom-start" style="width: 200px"></DatePicker>
    <span class="ml10">往来单位：</span>
    <Select v-model="companyId" class="w150" filterable>
      <Option v-for="item in company" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <span class="ml10">收付款类型：</span>
    <Select v-model="paymentId" class="w150" filterable>
      <Option v-for="item in paymentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <Button @click="query" class="ml10">查询</Button>
    <Table
      class="mt10"
      :columns="account"
      :data="accountData"
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
import { getSupplierList } from "_api/purchasing/purchasePlan";
import { getbayer } from "@/api/AlotManagement/threeSupplier";
import { findAccount } from "_api/settlementManagement/seleteAccount.js";
import { getDataDictionaryTable } from "@/api/system/dataDictionary/dataDictionaryApi";
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
      paymentList: [], //收付类型下拉框
    };
  },
  methods: {
    // 往来单位下拉框
    async getOne() {
      const res = await getSupplierList({});
      const res1 = await getbayer({});
      this.company = [];
      let data = [];
      let result = [];
      let obj = {};
      if (res.data.length !== 0 && res1.data.content.length !== 0) {
        data = [...res.data, ...res1.data.content];
      } else if (res.data.length !== 0) {
        data = res.data;
      } else if (res1.data.content.length !== 0) {
        data = res.data.content;
      }
      for (let i in data) {
        if (!obj[data[i].id]) {
          result.push(data[i]);
          obj[data[i].id] = 1;
        }
      }
      data = result;
      data.map(item => {
        this.company.push({
          label: item.fullName,
          value: item.id
        });
      });
    },
    // 对话框是否显示
    visChange(flag) {
      if (flag) {
        //收付类型数据字典
        getDataDictionaryTable({ dictCode: "RECEIVE_PAYMENT_TYPE" }).then(
          res => {
            res.data.map(item => {
              this.paymentList.push({
                value: item.itemCode,
                label: item.itemName
              });
            });
          }
        );
        this.getOne();
        this.seleteQuery();
      }
    },
    seleteQuery() {
      let obj = {
        startDate: this.dateQuery[0]
          ? moment(this.dateQuery[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endDate: this.dateQuery[1]
          ? moment(this.dateQuery[1]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        receivePaymentType: this.paymentId,
        guestId: this.companyId
      };
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
      if (Object.keys(this.seleteData).length !== 0) {
        bus.$emit("accountHedNo", this.seleteData);
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
