<template>
  <Modal v-model="getShowMore" title="高级查询" width="600px" @on-ok="moreOk" @on-cancel="moreCancel">
    <Form @keydown.native.enter="moreOk1(e)">
    <div class="navbox">
      <Row>
        <Col span="12">
          <span class="w40">创建日期：</span>
          <DatePicker
            v-model="Time1"
            type="daterange"
            placeholder="请选择创建日期！"
            @on-change="establish"
            style="width: 180px"
          ></DatePicker>
        </Col>
        <Col span="12">
          <span class="w40">提交日期：</span>
          <DatePicker
            v-model="Time2"
            type="daterange"
            placeholder="请选择提交日期！"
            @on-change="submit"
            style="width: 180px"
          ></DatePicker>
        </Col>
      </Row>
     
      <row class="mt15">
        <span class="ml5">理赔单位：</span>
        <Input v-model="moreData.orderUnit" placeholder="请输入退回单号！" style="width: 250px"  clearable/>
         <i class="iconfont iconcaidan input" @click="Dealings"></i>
      </row>
      <row class="mt15">
        <span>理赔单号：</span>
        <Input v-model="moreData.serviceId" placeholder="请输入退回单号！" style="width: 450px" />
      </row>
      <row class="mt15">
        <span>配件编码：</span>
        <Input v-model="moreData.code" placeholder="请输入申请单号！" style="width: 450px" />
      </row>
      <row class="mt15">
        <span>配件内码：</span>
        <Input v-model="moreData.partCode" placeholder="请输入配件编码！" style="width: 450px" />
      </row>
      <row class="mt15">
        <span>配件名称：</span>
        <Input v-model="moreData.partName" placeholder="请输入配件名称" style="width: 450px" />
      </row>
       <row class="mt15">
        <span class="ml5">创建人：</span>
        <Select
          placeholder="请选择创建人！"
          v-model="moreData.orderMan"
          filterable
          style="width: 400px"
          @on-change="getSupplierNamea1"
        >
          <Option v-for="item in ArrayValue" :value="item.id" :key="item.id">{{ item.fullName }}</Option>
        </Select>
        <!-- <Input disabled class="w240" v-model="moreData.orderMan" /> -->
        <!-- <Button class="ml5" size="small" type="default" @click="addSuppler">
          <i class="iconfont iconxuanzetichengchengyuanicon"></i>
        </Button> -->
      </row>
    </div>
    </Form> 
    <Selectss ref="Selects" @getOne="getOne"/>
    <!-- <select-supplier ref="selectSupplier" header-tit="供应商资料" @selectSupplierName="getSupplierNamea"></select-supplier> -->
  </Modal>
 
</template>

<script>
//import SelectSupplier from "../../../transferringOrder/applyFor/compontents/supplier/selectSupplier";
import { findForAllot } from "_api/purchasing/purchasePlan";
import Selectss from "./Selects.vue"
export default {
  name: "Moressss",
  components: { Selectss },
  data() {
    return {
      ArrayValue: [],
      Time1: [],
      Time2: [],
      moreData: {
        acceptEnterTimeStart: "", //创建日期
        acceptEnterTimeEnd: "", //创建日期
        allotEnterTimeStart: "", //完成日期
        allotEnterTimeEnd: "", //完成日期
        orderMan: "", //申请人
        serviceId: "", //理赔单号
        code: "", //配件编码
        partCode: "", //配件内码
        partName: "", //配件名称,
        orderUnit: "" //理赔单位
      }
    }
  },
  props:{
    getShowMore: Boolean
  },
  mounted() {
  },
  methods: {
    //理赔单位
    getOne(val){
      this.moreData.orderUnit=val.fullName
      console.log(val.fullName)
    },
    //打开选择开关
    Dealings(){
      this.$refs.Selects.addressShow = true;
    },
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
      this.moreData.guestId = a;
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
      this.Time1=[]
      this.Time2=[]
      this.moreData = {
         acceptEnterTimeStart: "", //创建日期
        acceptEnterTimeEnd: "", //创建日期
        allotEnterTimeStart: "", //完成日期
        allotEnterTimeEnd: "", //完成日期
        orderMan: "", //申请人
        serviceId: "", //返回单号
        code: "", //申请单号
        partCode: "", //配件编码
        partName: "" //配件名称
      };
    },
    establish(o) {
      if (o[0] == "") {
        this.moreData.acceptEnterTimeStart = "";
        this.moreData.acceptEnterTimeEnd = "";
      } else {
        this.moreData.acceptEnterTimeStart = o[0] + " 00:00:00";
        this.moreData.acceptEnterTimeEnd = o[1] + " 23:59:59";
      }
    },
    //更多弹窗-确定
    moreOk1(e){
      console.log(e)
    },
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
      this.Time1=[]
      this.Time2=[]
      this.moreData = {

         acceptEnterTimeStart: "", //创建日期
        acceptEnterTimeEnd: "", //创建日期
        allotEnterTimeStart: "", //完成日期
        allotEnterTimeEnd: "", //完成日期
        orderMan: "", //申请人
        serviceId: "", //返回单号
        code: "", //申请单号
        partCode: "", //配件编码
        partName: "" //配件名称
      };
    },
    submit(s){
      this.moreData.allotEnterTimeStart = s[0] + " 00:00:00";
      this.moreData.allotEnterTimeEnd = s[1] + " 23:59:59";
    },
    //供应商弹框
    addSuppler() {
      this.$refs.selectSupplier.init();
    }
  }
};
</script>
<style scoped>
.navbox {
  padding: 20px;
}
.input{

  position: relative;
  left:-25px;
  top:3px
}
</style>

