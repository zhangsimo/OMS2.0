<template>
  <Modal v-model="modelShow" title="对账单申请" width="1200px" @on-visible-change="hander">
    <div v-if="modelType.type===3">
      <div class="mb10">
        <span class="mr5">申请单号：</span>
        <Input type="text" v-model="formInline.applyNo" style="width: 200px" disabled />
      </div>
      <Row class="tableBox">
        <Col class="inner" span="4">申请人</Col>
        <Col class="inner" span="4">{{formInline.applicant || ''}}</Col>
        <Col class="inner" span="4">部门名称</Col>
        <Col class="inner" span="4">{{formInline.deptName || ' '}}</Col>
        <Col class="inner" span="4">门店店号</Col>
        <Col class="inner" span="4">{{formInline.shopCode || ' '}}</Col>
      </Row>
      <Row class="tableBox twoTable">
        <Col class="inner" span="4">门店名称</Col>
        <Col class="inner" span="4">{{formInline.orgName || ' '}}</Col>
        <Col class="inner" span="4">申请类型</Col>
        <Col class="inner" span="4">{{formInline.applyTypeName || ' '}}</Col>
        <Col class="inner" span="4">申请时间</Col>
        <Col class="inner" span="4">{{formInline.applyTime}}</Col>
      </Row>
      <h4 class="mb10 mt10">对账单明细</h4>
    </div>
    <Monthlyreconciliation ref="Monthlyreconciliation" v-if="modelType.type===1" />
    <reconcil ref="reconcil" v-if="modelType.type===2||modelType.type===3" />
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import reconcil from "./reconciliation.vue";
import Monthlyreconciliation from "./Monthlyreconciliation";
import moment from "moment";
export default {
  props: ["modelType"],
  components: {
    reconcil,
    Monthlyreconciliation
  },
  data() {
    return {
      formInline: {
        applicant: "",
        deptName: "",
        shopCode: "",
        orgName: "",
        applyTypeName: "",
        applyTime: "",
        paymentOrgName: ""
      }, //所有数据对象
      modelShow: false
    };
  },
  methods: {
    // 对账单弹框出现加载数据
    hander(type) {
      if (type && this.modelType.type === 1) {
        this.$refs.Monthlyreconciliation.Initialization();
      } else {
        if (this.modelType.type === 3) {
          let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            user = this.$store.state.user.userData;
          this.formInline.applicant = user.staffName;
          this.formInline.deptName =
            user.groups[user.groups.length - 1].name || " 　　";
          this.formInline.shopCode = user.shopCode || " 　　";
          this.formInline.orgName = user.shopName;
          this.formInline.applyTypeName = "对账单申请";
          this.formInline.applyTime = date;
          this.formInline.paymentOrgName = user.shopName;
        }
        this.$refs.reconcil.Initialization();
      }
    }
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