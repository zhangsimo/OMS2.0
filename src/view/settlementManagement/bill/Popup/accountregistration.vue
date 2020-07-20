<template>
  <Modal v-model="modal1" title="选择对账单" @on-visible-change="visChange">
    <span class="mr5">对账期间：</span>
    <DatePicker type="daterange" placement="bottom-start" style="width: 200px" v-model="accountDate"></DatePicker>
    <Button @click="query" class="ml10">查询</Button>
    <Table class="mt10" :columns="noTax" :data="noTaxData" @on-selection-change="seleteDate"></Table>
    <div slot="footer">
      <Button type="primary" @click="determine">确定</Button>
      <Button @click="modal1=false">取消</Button>
    </div>
    <idDetailed ref="idDetailed" />
  </Modal>
</template>
<script>
import idDetailed from "../components/idDetailed";
import { verificationIncrease } from "@/api/bill/popup";
import Bus from './Bus'
import moment from "moment";
export default {
  components: {
    idDetailed
  },
  props: ["arrId"],
  data() {
    return {
      accountDate:'',//对账时间
      modal1: false, //弹窗展示
      noTax: [
        {
          type: "selection",
          width: 40,
          align: "center"
        },
        {
          title: "序号",
          type: "index",
          width: 40,
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
                    this.$refs.idDetailed.guestId = this.arrId[1];
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
          title: "对账应付",
          key: "reconciliation",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.reconciliation.toFixed(2));
          }
        },
        {
          title: "应付返利",
          key: "dealingRebates",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.dealingRebates.toFixed(2));
          }
        },
        {
          title: "应付坏账",
          key: "payingBadDebts",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.payingBadDebts.toFixed(2));
          }
        },
        {
          title: "应付合计",
          key: "actualPayment",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.actualPayment.toFixed(2));
          }
        }
      ], //选择不含税对账单
      noTaxData: [], //选择不含税对账单表格数据
      seleteData: [] //单选数据
    };
  },
  // mounted(){

  // },
  methods: {

    // 对话框是否显示
    visChange(flag) {
      if (flag) {
        this.addSelete();
      }
    },
    // 日期查询
    query() {
      this.addSelete();
    },
    // 确认按钮
    determine() {
      if (this.seleteData.length !== 0) {
        Bus.$emit('accountOrder',this.seleteData)
        this.modal1 = false
      } else {
        this.$message.error("请选择一条对账单");
      }
    },
    // 多选数据
    seleteDate(selection) {
      this.seleteData = selection;
    },
    //增加核销对账单接口
    addSelete() {
      let obj = {
        orgId: this.arrId[0],
        guestId: this.arrId[1],
        id: this.arrId[2],
        startDate: this.accountDate[0] ? moment(
          this.accountDate[0]
        ).format("YYYY-MM-DD HH:mm:ss") : '',
        endDate: this.accountDate[1] ? moment(
          this.accountDate[0]
        ).format("YYYY-MM-DD HH:mm:ss") : ''
      };
      verificationIncrease(obj).then(res => {
        if(res.code===0){
          this.noTaxData = res.data.content
        }
      });
    }
  }
};
</script>
