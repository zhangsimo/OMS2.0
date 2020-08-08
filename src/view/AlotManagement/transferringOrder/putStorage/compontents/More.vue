<template>
  <div class="navbox">
    <Row>
      <Col span="12">
        <span class="w40">创建日期从：</span>
        <DatePicker
          v-model="form.createTimeStart"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          style="width: 180px"
        ></DatePicker>
      </Col>
      <Col span="12">
        <span class="w40 ml10">至：</span>
        <DatePicker
          v-model="form.createTimeEnd"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          style="width: 180px"
        ></DatePicker>
      </Col>
    </Row>
    <row class="mt15">
      <Col span="12">
        <span class="w40">入库日期从：</span>
        <DatePicker
          v-model="form.startDate"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          style="width: 180px"
        ></DatePicker>
      </Col>
      <Col span="12">
        <span class="w40 ml10">至：</span>
        <DatePicker
          v-model="form.endDate"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          style="width: 180px"
        ></DatePicker>
      </Col>
    </row>
    <row class="mt15">
      <span>调 出 方 ：</span>
      <!-- <Input v-model="form.guestName" style="width: 398px" /> -->
      <Select style="width: 398px" v-model="form.guestName" label-in-value>
        <Option v-for="item in ArrayValue1" :value="item" :key="item">
          {{item }}
        </Option>
      </Select>
      <Button @click="showModel" class="ml5" size="small" type="default">
        <i class="iconfont iconxuanzetichengchengyuanicon"></i>
      </Button>
    </row>
    <row class="mt15">
      <span>入库单号 ：</span>
      <Input v-model="form.serviceId" style="width: 398px" />
    </row>
    <row class="mt15">
      <span>申请单号 ：</span>
      <Input v-model="form.code" style="width: 398px" />
    </row>
    <row class="mt15">
      <span>配 件 编 码 ：</span>
      <Input v-model="form.partCode" style="width: 398px" />
    </row>
    <row class="mt15">
      <span>配件名称：</span>
      <Input v-model="form.partName" style="width: 398px" />
    </row>
    <row class="mt15">
      <span class="ml5">入 库 人：</span>
      <Input v-model="form.createUname" style="width: 398px" />
    </row>
  </div>
</template>

<script>
import moment from "moment";
import { findForAllot } from "_api/purchasing/purchasePlan";
export default {
  name: "More",
  data() {
    return {
      moment: moment,
      ArrayValue1: [],
      form: {
        partCode: "", //申请单号
        partName: "", //申请单号
        productPartCode: "", //编码
        startDate: "", //配件人
        endDate: "",
        createTimeEnd: "",
        guestId: "",
        guestName: this.dcName,
        createTimeStart: "",
        code: ""
      }
    };
  },
  // watch: {
  //   dcName: {
  //     handler(newVal) {
  //       this.form.guestName = newVal;
  //     },
  //     deep: true
  //   },
  //   dcId: {
  //     handler(newVal) {
  //       this.form.guestId = newVal;
  //     },
  //     deep: true
  //   }
  // },
  props: {
    dcName: {
      type: String,
      default: ""
    },
    dcId: {
      type: String,
      default: ""
    },
  },

  methods: {
    getArrayParams() {
      if(this.ArrayValue1.length > 0) {
        return;
      }
      var req = {};
      req.page = 1;
      req.size = 20;
      findForAllot(req).then(res => {
        const { content } = res.data;
        this.getArray = content;
        content.forEach(item => {
          this.ArrayValue1.push(item.fullName);
        });
      });
    },
    //展示方
    showModel() {
      this.$emit("getName", "1");
    },
    //选择创建开始日期
    establish(date) {
      this.form.createTimeStart = date;
    },
    //选择创建结束日期
    submit(date) {
      this.form.createTimeEnd = date;
    },
    // 选择审核开始日期
    check(date) {
      this.form.shenCreateTime = date;
    },
    // 选择审核结束日期
    checkSubmit(date) {
      this.form.shenEndTime = date;
    },
    getITPWE() {
      if (this.form.createTimeStart) {
        this.form.createTimeStart = moment(this.form.createTimeStart).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      if (this.form.createTimeEnd) {
        this.form.createTimeEnd = moment(this.form.createTimeEnd).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      if (this.form.startDate) {
        this.form.startDate = moment(this.form.startAuditDate).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      if (this.form.endDate) {
        this.form.endDate = moment(this.form.endAuditDate).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      for (var k in this.form) {
        if (!this.form[k]) {
          delete this.form[k];
        }
      }
      return this.form;
    },
    reset() {
      this.getArrayParams();
      // this.form = {
      //   partCode: "", //申请单号
      //   partName: "", //申请单号
      //   productPartCode: "", //编码
      //   startData: "", //配件人
      //   endDate: "",
      //   createTimeEnd: "",
      //   guestId: "",
      //   guestName: "",
      //   createTimeStart: ""
      // };
    }
  }
};
</script>
<style scoped>
.navbox {
  padding: 20px;
}
</style>

<style scoped></style>
