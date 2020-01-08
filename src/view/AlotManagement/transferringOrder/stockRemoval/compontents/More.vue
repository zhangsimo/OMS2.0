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
        <span class="w40">提交日期从：</span>
        <DatePicker
          v-model="form.commitDateStart"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          style="width: 180px"
        ></DatePicker>
      </Col>
      <Col span="12">
        <span class="w40 ml10">至：</span>
        <DatePicker
          v-model="form.commitDateEnd"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          style="width: 180px"
        ></DatePicker>
      </Col>
    </row>
    <row class="mt15">
      <span>调 入 方 ：</span>
      <!-- <Input v-model="form.guestName" style="width: 398px" readonly /> -->
      <Select style="width: 398px" v-model="form.guestName" label-in-value filterable>
        <Option v-for="item in ArrayValue" :value="item" :key="item">{{ item }}</Option>
      </Select>
      <Button @click="showModel" class="ml5" size="small" type="default">
        <i class="iconfont iconxuanzetichengchengyuanicon"></i>
      </Button>
    </row>
    <row class="mt15">
      <span>受理单号 ：</span>
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
      <span class="ml5">受 理 人：</span>
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
        commitDateStart: "", //配件人
        commitDateEnd: "",
        createTimeEnd: "",
        guestId: "",
        guestName: "",
        createTimeStart: "",
        code: ""
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
    ArrayValue: {
      type: Array,
      default: ""
    },
    dcId: {
      type: String,
      default: ""
    }
  },
  created() {
    this.showModel();
  },

  methods: {
    cancelTrim() {
      if (this.form.serviceId != undefined) {
        this.form.serviceId = this.form.serviceId.trim();
      }
    },
    //展示方
    showModel() {
      this.$emit("getName", "1");
    },
    //选择创建开始日期
    establish(date) {
      this.form.createTimeStart = data;
    },
    //选择创建结束日期
    submit(date) {
      this.form.createTimeEnd = data;
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
      console.log(this.form.createTimeStart, "this.form.createTimeStart==>156");
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
      if (this.form.commitDateStart) {
        this.form.commitDateStart = moment(this.form.startAuditDate).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      if (this.form.commitDateEnd) {
        this.form.commitDateEnd = moment(this.form.endAuditDate).format(
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
      this.form = {
        partCode: "", //申请单号
        partName: "", //申请单号
        productPartCode: "", //编码
        startData: "", //配件人
        commitDateEnd: "",
        createTimeEnd: "",
        guestId: "",
        guestName: "",
        createTimeStart: ""
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
