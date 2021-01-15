<template>
  <Modal v-model="getShowMore" title="高级查询" width="600px" @on-ok="moreOk" @on-cancel="moreCancel">
  
    <div class="navbox">
      <Row class="mt15">
       
          <span class="w40">创建日期：</span>
          <DatePicker
            v-model="Time1"
            type="daterange"
            @on-change="establish"
            style="width: 450px"
          ></DatePicker>
       </Row>
        <row class="mt15">
  <span class="w40">提交日期：</span>
          <DatePicker
            v-model="Time2"
            type="daterange"
           
            @on-change="submit"
            style="width: 450px"
          ></DatePicker>

        </row>
        
      <row class="mt15">
        <span>理赔单位：</span>
        <Input v-model.trim="moreData.orderUnit"  style="width: 450px"  clearable/>
         <!-- <i class="iconfont iconcaidan input" @click="Dealings"></i> -->
      </row>
      <row class="mt15">
        <span>理赔单号：</span>
        <Input v-model.trim="moreData.serviceId"  style="width: 450px" />
      </row>
      <row class="mt15">
        <span>配件编码：</span>
        <Input v-model.trim="moreData.code"  style="width: 450px" />
      </row>
      <row class="mt15">
        <span>配件内码：</span>
        <Input v-model.trim="moreData.partCode"  style="width: 450px" />
      </row>
      <row class="mt15">
        <span>配件名称：</span>
        <Input v-model.trim="moreData.partName"  style="width: 450px" />
      </row>
       <row class="mt15">
        <span class="ml5 span" >创建人：</span>
        
        <Input v-model.trim="moreData.orderMan"  style="width: 450px" />
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
import Selectss from "./Selects.vue";
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
        orderUnit: "", //理赔单位
        //orderId: "", //理赔单位id
      },
    };
  },
  props: {
    getShowMore: Boolean,
  },
  mounted() {},
  methods: {
    //理赔单位
    getOne(val) {
      this.moreData.orderUnit = val.fullName;
      //this.moreData.orderId = val.id;
      //console.log(val.fullName,val.id)
    },
    //打开选择开关
    Dealings() {
      this.$refs.Selects.addressShow = true;
    },
    init() {
      //this.getArrayParams();
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
      this.Time1 = [];
      this.Time2 = [];
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
    moreOk1(e) {
      console.log(e);
    },
    moreOk() {
      let data = {};
      this.$emit("getMoreStatus", false);
      // console.log(this.moreData, "this.moreData ==>94");
      this.$emit("getMoreData", this.moreData);
      this.Time1 = [];
      this.Time2 = [];
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
        orderId: "", //配件id
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
.span {
  margin-right: 8px;
}
</style>

