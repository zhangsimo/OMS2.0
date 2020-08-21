<template>
  <Modal v-model="modal1" title="对账单选择" width="600" @on-visible-change="visChange">
    <span class="mr5">对账期间：</span>
    <DatePicker v-model="dateQuery" type="daterange" placement="bottom-start" style="width: 200px"></DatePicker>
    <!-- <div class="db ml20"> -->
    <span class="ml10">往来单位：</span>
    <Input v-model="company" readonly style="width: 100px" />
    <i class="iconfont iconcaidan input" @click="Dealings"></i>
    <!-- </div> -->
    <Button @click="query">查询</Button>
    <Table
      class="mt10"
      :columns="account"
      :data="accountData"
      highlight-row
      max-height="450"
      @on-current-change="seleteDate"
    ></Table>
    <div slot="footer">
      <Button type="primary" @click="determine">确定</Button>
      <Button @click="modal1=false">取消</Button>
    </div>
    <idDetailed ref="idDetailed" />
    <selectDealings ref="selectDealings" @selectSearchName="getOne"  />
  </Modal>
</template>
<script>
import idDetailed from "./../components/idDetailed";
import { seleteAccount } from "@/api/bill/popup";
import selectDealings from "../components/selectCompany"
import bus from "./Bus";
import moment from "moment";
export default {
  props: ["information"],
  components: {
    idDetailed,
    selectDealings
  },
  data() {
    return {
      dateQuery: "", //时间
      company: "", //往来单位
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
          key: "guestName",
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
                    this.$refs.idDetailed.modal1 = true;
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
          key: "guestName",
          className: "tc"
        },
        {
          title: "实际收付款金额",
          key: "settlementTotal",
          className: "tc"
        }
      ], //选择不含税对账单单
      accountData: [{ index: 1,serviceId:'sss' }, { index: 1 }, { index: 1 }], //选择不含税对账单单表格数据
      seleteData: {} //单选数据
    };
  },
  methods: {
    // 往来单位
    Dealings() {
      this.$refs.selectDealings.init();
    },
    // 往来单位选择
    getOne(data) {
      this.company = data.fullName;
      this.companyId = data.id;
    },
    // 对话框是否显示
    visChange(flag) {
      if (flag) {
        this.seleteQuery();
      }
    },
    seleteQuery() {
      let obj = {
        startDate: this.dateQuery[0]
          ? moment(this.dateQuery[0]).format("YYYY-MM-DD")+" 00:00:00"
          : "",
        endDate: this.dateQuery[1]
          ? moment(this.dateQuery[1]).format("YYYY-MM-DD")+" 23:59:59"
          : "",
        orgId: this.information.orgId,
        guestId:this.companyId
      };
      obj.page = 0
      obj.size = 9999
      seleteAccount(obj).then(res => {
        if (res.code === 0) {
          res.data.content.map(item => {
            item.billingTypeName = item.billingType.name;
          });
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
        this.seleteData.statementMasterId = this.seleteData.id
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
