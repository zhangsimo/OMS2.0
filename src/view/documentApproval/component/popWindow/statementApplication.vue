<template>
  <Modal v-model="modelShow" title="对账单申请" width="1200px" @on-visible-change="hander">
    <div>
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
    </div>
    <reconcil ref="reconcil" :modelType="modelType" :list="allList" @closeModal="colse"/>
    <!--<flow v-if="modelType.type === 3" />-->
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import reconcil from "./reconciliation.vue";
import { getThisAllList } from '@/api/documentApproval/documentApproval/documentApproval'
import moment from "moment";
import flow from "../Flow.vue";
export default {
  props: ["modelType"],
  components: {
    reconcil,
    flow
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
        paymentOrgName: "",
        applyNo:''
      }, //所有数据对象
      modelShow: false,
      allList:{},//获取返回所有数据
      row: {}, //申请单页面选择的数据
    };
  },
  methods: {
    // 对账单弹框出现加载数据
    async hander(type) {
      if (type) {
          if(this.modelType.type == 1){
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
          }else{
            this.getList()
          }

        }
        this.$nextTick( ()=> {
          this.$refs.reconcil.Initialization();
        })
      },
      async getList(){
        let data ={};
        data.id = this.modelType.id || ''
        let res = await getThisAllList(data);
        if(res.code == 0){
          this.allList = res.data
          this.formInline = this.row
        }
      },

    //保存提交关闭模态框
    colse(){
      this.modelShow = false
      this.$emit("updateD")
    },
    init(row) {
      this.hander();
      this.row = row
      this.modelShow = true
    },
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
