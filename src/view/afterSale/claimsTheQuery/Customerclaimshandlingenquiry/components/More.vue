<template>
  <Modal
    v-model="getShowMore"
    title="高级查询"
    width="600px"
    @on-ok="moreOk"
    @on-cancel="moreCancel"
  >
    <Form @keydown.native.enter="moreOk">
      <div class="navbox">
        <row>
            <span >创建日期：</span>
            <DatePicker
              v-model="moreData.createTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="date"
              class=" mr10"
              style="width: 400px"
            ></DatePicker>
        </row>
        <row class="mt15">
          <span>处理类型：</span>
          <Select v-model="moreData.purchaseType" @on-change="getDataType1" class=" mr10" style="width: 400px">
            <Option
              v-for="item in purchaseTypeArr"
              filterable
              :value="item.value"
              :key="item.value"
              >{{ item.label }}
            </Option>
          </Select>
        </row>
        <row class="mt15">
          <span>客户类型：</span>
          <Select
            v-model="moreData.customerType"
            filterable
            style="width: 400px"
            @on-change="getSupplierNamea1"
          >
            <Option
              v-for="item in customerArr"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </row>
        <row class="mt15">
          <span class="span">处理人：</span>
          <Input
            v-model="moreData.people"
          
            style="width: 400px"
            clearable
          />
        </row>
        <row class="mt15">
          <span>处理单号：</span>
          <Input v-model="moreData.serviceId" style="width: 400px" />
        </row>
        <row class="mt15">
          <span>返回单号：</span>
          <Input v-model="moreData.code" style="width: 400px" />
        </row>
      </div>
    </Form>
    <Button class="btn">清空条件</Button>
  </Modal>
</template>

<script>
//import SelectSupplier from "../../../transferringOrder/applyFor/compontents/supplier/selectSupplier";
import { findForAllot } from "_api/purchasing/purchasePlan";
// import Selects from "./Selects.vue"
export default {
  name: "Moresss",
  components: {},
  data() {
    return {
      purchaseTypeArr: [
        { label: "所有", value: "99" },
        { label: "草稿", value: "0" },
        { label: "已提交", value: "1" },
        { label: "已完成", value: "3" },
      ],
      customerArr: [
        { label: "所有", value: "99" },
        { label: "草稿", value: "0" },
        { label: "已提交", value: "1" },
        { label: "已完成", value: "3" },
      ],
      moreData: {
       createTime:'',//创建日期
       customerType:'99', //客户类型
        purchaseType: "99",//处理类型
        serviceId: "", //处理单号
        singlenumber: "", //返回单号
        partCode: "", //配件内码
        partName: "", //配件名称,
        orderUnit: "", //理赔单位
        people:''
      },
    };
  },
  props: {
    getShowMore: Boolean,
  },
  mounted() {},
  methods: {
    //理赔单位
    // getOne(val) {
    //   this.moreData.orderUnit = val.fullName;
    //   console.log(val.fullName);
    // },
    getDataType1(){

    },
    //打开选择开关
    // Dealings(){
    //   this.$refs.selects.addressShow = true;
    // },
    init() {
      //this.getArrayParams();
    },
    getArray(data) {
      // console.log(data, "data");
    },
    // 子组件的参数
    getSupplierNamea(a) {
      this.moreData.orderMan = a.shortName;
      this.moreData.guestId = a.id;
    },
    getSupplierNamea1(a) {
      console.log(a)
      // console.log(this.moreData.orderMan, "this.moreData.orderMan");
    },
    getArrayParams() {
      //   if(this.ArrayValue.length > 0) return;
      //   var req = {};
      //   req.page = 1;
      //   req.size = 20;
      //   findForAllot(req).then(res => {
      //     if (res.code === 0) {
      //       this.ArrayValue = res.data.content;
      //       // console.log(this.ArrayValue, "this.ArrayValue");
      //     }
      //   });
    },
    //更多弹窗-取消
    moreCancel() {
      this.$emit("getMoreStatus", false);
      this.moreData = {
        acceptEnterTimeStart: "", //创建日期
        acceptEnterTimeEnd: "", //创建日期
        allotEnterTimeStart: "", //完成日期
        allotEnterTimeEnd: "", //完成日期
        orderMan: "", //申请人
        serviceId: "", //返回单号
        code: "", //申请单号
        partCode: "", //配件编码
        partName: "", //配件名称
      };
    },
    //更多弹窗-确定
    moreOk() {
      // console.log(this.moreData, "this.moreData ==>94");
      this.$emit("getMoreData", this.moreData);
      this.$emit("getMoreStatus", false); //弹框false传出
      // this.Time1 = [];
      // this.Time2 = [];
      // this.moreData.acceptEnterTimeStart = "";
      // this.moreData.acceptEnterTimeEnd = "";
      // this.moreData.allotEnterTimeStart = "";
      // this.moreData.allotEnterTimeEnd = "";
      this.moreData = {
        acceptEnterTimeStart: "", //创建日期
        acceptEnterTimeEnd: "", //创建日期
        allotEnterTimeStart: "", //完成日期
        allotEnterTimeEnd: "", //完成日期
        orderMan: "", //申请人
        serviceId: "", //返回单号
        code: "", //申请单号
        partCode: "", //配件编码
        partName: "", //配件名称
      };
    },
    submit(s) {
      this.moreData.allotEnterTimeStart = s[0] + " 00:00:00";
      this.moreData.allotEnterTimeEnd = s[1] + " 23:59:59";
    },
    //供应商弹框
    addSuppler() {
      this.$refs.selectSupplier.init();
    },
  },
};
</script>
<style scoped>
.navbox {
  padding: 20px;
}
.input {
  position: relative;
  left: -25px;
  top: 3px;
}
.date{
  display: inline-block;
}
.span{
  margin-right: 14px;
}
.row{
  position: relative;
}
.btn{
  position: relative;
  top:42px;
  left: 413px;
  
}
</style>

