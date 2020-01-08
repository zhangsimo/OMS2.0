<template>
  <div class="navbox">
    <Row>
      <Col span="12">
        <span class="w40">创建日期从：</span>
        <DatePicker
          v-model="form.startTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          style="width: 180px"
        ></DatePicker>
      </Col>
      <Col span="12">
        <span class="w40 ml10">至：</span>
        <DatePicker
          v-model="form.endTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          style="width: 180px"
        ></DatePicker>
      </Col>
    </Row>
    <row class="mt15">
      <Col span="12">
        <span class="w40">提交日期从：</span>
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
      <Input readonly v-model="form.guestName" style="width: 398px" />
      <Button @click="showModel" class="ml5" size="small" type="default">
        <i class="iconfont iconxuanzetichengchengyuanicon"></i>
      </Button>
    </row>
    <row class="mt15">
      <span>退回申请单号 ：</span>
      <Input v-model="form.serviceId" style="width: 398px" />
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
      <span class="ml5">创 建 人：</span>
      <Input v-model="form.createUname" style="width: 398px" />
    </row>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "More",
  data() {
    return {
      moment: moment,
      form: {
        partCode: "", //申请单号
        partName: "", //申请单号
        productPartCode: "", //编码
        startDate: "", //配件人
        endDate: "",
        endTime: "",
        guestId: "",
        guestName: "",
        startTime: ""
      }
    };
  },
  watch: {
    dcName: {
      handler(newVal) {
        this.form.guestName = newVal;
      },
      deep: true
    },
    dcId: {
      handler(newVal) {
        this.form.guestId = newVal;
      },
      deep: true
    }
  },
  props: {
    dcName: {
      type: String,
      default: ""
    },
    dcId: {
      type: String,
      default: ""
    }
  },
  methods: {
    //展示方
    showModel() {
      this.$emit("getName", "1");
    },
    //选择创建开始日期
    establish(date) {
      this.form.startTime = date;
    },
    //选择创建结束日期
    submit(date) {
      this.form.endTime = date;
    },
    // 选择审核开始日期
    check(date) {
      this.form.shenCreateTime = data;
    },
    // 选择审核结束日期
    checkSubmit(date) {
      this.form.shenEndTime = data;
    },
    getITPWE() {
      if (this.form.startTime) {
        this.form.startTime = moment(this.form.startTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      if (this.form.endTime) {
        this.form.endTime = moment(this.form.endTime).format(
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
      return this.form;
    },
    reset() {
      this.form = {
        partCode: "", //申请单号
        partName: "", //申请单号
        productPartCode: "", //编码
        startData: "", //配件人
        endDate: "",
        endTime: "",
        guestId: "",
        guestName: "",
        startTime: ""
      };
    }
  }
};
</script>
<style scoped>
.navbox {
  padding: 20px;
}
</style>

<style scoped>
</style>
