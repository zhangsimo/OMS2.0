<template>
  <Modal v-model="modal1" title="选择不含税对账单" @on-visible-change="visChange">
    <span class="mr5">对账期间：</span>
    <DatePicker type="daterange" v-model="dateQuery" placement="bottom-start" style="width: 200px"></DatePicker>
    <Button @click="query" class="ml10">查询</Button>
    <Table
      class="mt10"
      :columns="noTax"
      :data="noTaxData"
      highlight-row
      @on-current-change="seleteDate"
    ></Table>
    <div slot="footer">
      <Button type="primary" @click="determine">确定</Button>
      <Button @click="modal1=false">取消</Button>
    </div>
    <idDetailed ref="idDetailed" />
  </Modal>
</template>
<script>
import idDetailed from "../components/idDetailed";
import { noTaxAccount } from "@/api/bill/popup";
import bus from "./Bus";
import render from "../../../../components/message/base/render";
import moment from 'moment'
export default {
  props: ["parameter"],
  components: {
    idDetailed
  },
  data() {
    return {
      dateQuery: [], //日期
      modal1: false, //弹窗展示
      noTax: [
        {
          title: "序号",
          type: "index",
          width: 40,
          className: "tc"
        },
        {
          title: "客户名称",
          key: "guestName",
          className: "tc"
        },
        {
          title: "日期",
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
                    this.$refs.idDetailed.guestId = this.parameter.guestId;
                  }
                }
              },
              params.row.accountNo
            );
          }
        },
        {
          title: "对账金额",
          key: "serviceAmt",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.settlementTotal.toFixed(2));
          }
        }
      ], //选择不含税对账单单
      noTaxData: [], //选择不含税对账单单表格数据
      seleteData: {} //单选数据
    };
  },
  methods: {
    // 对话框是否显示
    visChange(flag) {
      if (flag) {
        this.accountSelete()
      }
    },
    //对账单查询接口
    accountSelete() {
      let obj = {
        startDate: this.dateQuery[0]
          ? moment(this.dateQuery[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endDate: this.dateQuery[1]
          ? moment(this.dateQuery[1]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        guestId: this.parameter.guestId,
        taxSign: 0
      };
      noTaxAccount(obj).then(res => {
        if (res.code === 0) {
          this.noTaxData = res.data;
        }
      });
    },
    // 日期查询
    query() {
      this.accountSelete()
    },
    // 确认按钮
    determine() {
      if (Object.keys(this.seleteData).length !== 0) {
        bus.$emit("accountNo", this.seleteData);
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
