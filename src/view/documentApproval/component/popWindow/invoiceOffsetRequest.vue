<template>
  <hedgingInvoice ref="hedgingInvoice" :modelType='modelType'/>
</template>
<script>
import hedgingInvoice from "./hedgingInvoice";
import moment from "moment";
export default {
  props: ["modelType"],
  components: {
    hedgingInvoice
  },
  data() {
    return{}
  },
  mounted(){
    this.$refs.hedgingInvoice.modal1 = true
  },
  methods: {
    // // 对账单弹框出现加载数据
    // hander(type) {
    //   if (type && this.modelType === 1) {
    //     this.$refs.Monthlyreconciliation.Initialization();
    //   } else {
    //     if (this.modelType === 3) {
    //       let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    //         user = this.$store.state.user.userData;
    //       this.formInline.applicant = user.staffName;
    //       this.formInline.deptName =
    //         user.groups[user.groups.length - 1].name || " 　　";
    //       this.formInline.shopCode = user.shopCode || " 　　";
    //       this.formInline.orgName = user.shopName;
    //       this.formInline.applyTypeName = "对账单申请";
    //       this.formInline.applyTime = date;
    //       this.formInline.paymentOrgName = user.shopName;
    //     }
    //     this.$refs.reconcil.Initialization();
    //   }
    // }
  }
};
</script>
<style scoped lang="less">
.tableBox {
  line-height: 38px;
  text-align: center;
  border: #cccccc 1px solid;
  border-right: none;
  .inner {
    border-right: #cccccc 1px solid;
    height: 38px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .inner:nth-child(2n-1) {
    background: #f9f9f9;
  }
}

.twoTable {
  border-top: none;
}
</style>