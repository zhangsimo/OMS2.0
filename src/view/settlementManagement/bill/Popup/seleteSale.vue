<template>
  <Modal v-model="modal1" :title="popupTit" width="800">
    <Table
      :columns="saleSingle"
      :data="saleSingleData"
      @on-selection-change="seleteDate"
    ></Table>
    <div slot="footer">
      <Button type="primary" @click="determine">确定</Button>
      <Button @click="modal1=false">取消</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: ["popupTit"],
  data() {
    return {
      modal1: false, //弹框展示
      saleSingle: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "序号",
          key: "index",
          width: 40,
          className: "tc"
        },
        {
          title: "客户名称",
          key: "orgName",
          className: "tc"
        },
        {
          title: "日期",
          key: "accountNo",
          className: "tc"
        },
        {
          title: "业务单据号",
          key: "guestName",
          className: "tc"
        },
        {
          title: "出库单号",
          key: "paymentTypeName",
          className: "tc"
        },
        {
          title: "含税标志",
          key: "accountsReceivable",
          className: "tc"
        },
        {
          title: "油品/配件",
          key: "receivableRebate",
          className: "tc"
        },
        {
          title: "单据金额",
          key: "badDebtReceivable",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.badDebtReceivable.toFixed(2));
          }
        }
      ], //选择单据表格
      saleSingleData: [
        {
          index: 1
        },
        {
          index: 1
        },
        {
          index: 1
        }
      ], //选择单据表格数据
      seleteData: [] //选中的数据
    };
  },
  methods: {
    //选择一条数据
    determine() {
      if (this.seleteData.length!==0) {
        this.$message.error("请先选择一条ghhghg销售单");
      } else {
        this.$message.error("请先选择一条销售单");
      }
    },
    seleteDate(selection) {
      this.seleteData = selection;
    }
  }
};
</script>