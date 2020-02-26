<template>
  <Modal v-model="modal1" title="对账单选择" width=600>
    <span class="mr5">对账期间：</span>
    <DatePicker type="daterange" placement="bottom-start" style="width: 200px"></DatePicker>
    <!-- <div class="db ml20"> -->
      <span class="ml10">往来单位：</span>
      <Input v-model="company" readonly  style="width: 100px"/>
      <i class="iconfont iconcaidan input"></i>
    <!-- </div> -->
    <Button @click="query">查询</Button>
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
  </Modal>
</template>
<script>
import idDetailed from './../components/idDetailed'
export default {
  components:{
    idDetailed
  },
  data() {
    return {
      company: "", //往来单位
      modal1: false, //弹窗展示
      account: [
        {
          title: "序号",
          key: "index",
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
          key: "accountNo",
          className: "tc"
        },
        {
          title: "对账单号",
          key: "guestName",
          className: "tc",
          render:(h,params)=>{
            return h("span",
              {
                style: {
                  cursor: "pointer",
                  color: "#87CEFA"
                },
                on: {
                  click: () => {
                    this.$refs.idDetailed.modal1=true
                  }
                }
              },
              params.row.serviceId)
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
          key: "guestName",
          className: "tc"
        }
      ], //选择不含税对账单单
      accountData: [{ index: 1,serviceId:'sss' }, { index: 1 }, { index: 1 }], //选择不含税对账单单表格数据
      seleteData: {} //单选数据
    };
  },
  methods: {
    // 日期查询
    query() {},
    // 确认按钮
    determine() {
      if (Object.keys(this.seleteData).length !== 0) {
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