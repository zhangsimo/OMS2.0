<template>
  <Modal v-model="modal1" title="对账单查询" width="860" @on-visible-change="visChange">
    <span class="mr5">对账期间：</span>
    <DatePicker v-model="dateQuery" type="daterange" placement="bottom-start" style="width: 200px"></DatePicker>
    <span>往来单位：</span>
    <Select
      v-model="companyId"
      class="w150"
      clearable
      filterable
      remote
      :loading="remoteloading"
      :remote-method="getOne"
    >
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
      ref="table"
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
import { findByDynamicQuery } from "_api/settlementManagement/otherPayable/otherPayable";
import { getDataDictionaryTable } from "@/api/system/dataDictionary/dataDictionaryApi";
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
      account: [
        {
          title: "序号",
          type: "index",
          width: 40,
          className: "tc"
        },
        // {
        //   title: "门店",
        //   key: "",
        //   className: "tc"
        // },
        {
          title: "对账日期",
          key: "collectionTime",
          className: "tc",
          // render: (h, params) => {
          //   return h(
          //     "span",
          //     params.row.otherInfo[0].collectionTime !== null ? params.row.otherInfo[0].collectionTime : ''
          //   );
          // }
        },
        {
          title: "对账单号",
          key: "serviceId",
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
              params.row.serviceId
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
          key: "orderTypeName",
          className: "tc",
          render: (h, params) => {
            return h(
              "span","其他应付款"
            );
          }
        },
        {
          title: "实际收付款金额",
          key: "amountCollected",
          className: "tc"
        }
      ], //选择不含税对账单单
      accountData: [], //选择不含税对账单单表格数据
      seleteData: {}, //单选数据
      paymentId: "QTYFK", //收付类型
      paymentList: [], //收付类型下拉框
      remoteloading: false, //搜索框loading
    };
  },
  methods: {
    // 往来单位选择
    async getOne(query) {
      this.company = [];
      if (query != "") {
        this.remoteloading = true;
        findGuest({ fullName: query, size: 20 }).then(res => {
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
    // 对话框是否显示
    visChange(flag) {
      if (flag) {
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
        this.seleteQuery();
      }
    },
    seleteQuery() {
      let obj = {
        startTime: this.dateQuery[0]
          ? moment(this.dateQuery[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endTime: this.dateQuery[1]
          ? moment(this.dateQuery[1]).format("YYYY-MM-DD 23:59:59")
          : "",
        receivePaymentType: this.paymentId,
        guestId: this.companyId,
        writeOffStatus: "0"
      };
      findByDynamicQuery(obj).then(res => {
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
      if (this.seleteData && Object.keys(this.seleteData).length !== 0) {
        bus.$emit("accountHedNo", this.seleteData);
        this.modal1 = false;
      } else {
        this.$message.error("请选择一条对账单");
      }
    },
    // 单选数据
    seleteDate(currentRow) {
      let account = this.$parent.$parent.$parent.reconciliationStatement;
      if (currentRow&&account && account.accountNo === currentRow.accountNo) {
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
