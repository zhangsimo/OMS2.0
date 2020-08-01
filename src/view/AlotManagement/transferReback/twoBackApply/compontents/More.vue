<template>
  <div class="navbox">
    <Row>
      <Col>
        <span class="w40">创建日期：</span>
        <DatePicker
          type="daterange"
          placement="bottom-end"
          style="width: 300px"
          v-model="createDate"
        ></DatePicker>
      </Col>
    </Row>
    <row class="mt15">
      <Col>
        <span class="w40">提交日期：</span>
        <DatePicker
          type="daterange"
          placement="bottom-end"
          style="width: 300px"
          v-model="commitDate"
        ></DatePicker>
      </Col>
    </row>
    <row class="mt15">
      <span>调 出 方 ：</span>
      <Input readonly v-model="form.guestName" style="width: 398px" />
      <!-- <Select
        placeholder="请选择调出方！"
        v-model="form.guestName"
        filterable
        style="width: 400px"
        @on-change="getSupplierNamea1"
      >
        <Option v-for="item in ArrayValue" :value="item.id" :key="item.id">{{ item.fullName }}</Option>
      </Select> -->
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
import { findForAllot } from "_api/purchasing/purchasePlan";

export default {
  name: "More",
  data() {
    return {
      ArrayValue: [],
      moment: moment,
      createDate: [],
      commitDate: [],
      form: {
        partCode: "", //申请单号
        partName: "", //申请单号
        productPartCode: "", //编码
        commitDateStart: "", //配件人
        commitDateEnd: "",
        createTimeEnd: "",
        guestId: "",
        guestName: "",
        createTimeStart: ""
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
  mounted() {
  },
  methods: {
    commitstart(date) {
      this.form.commitDateStart = date;
    },
    commitend(date) {
      this.form.commitDateEnd = date;
    },
    //展示方
    showModel() {
      this.$emit("getName", "1");
    },
    getSupplierNamea1(a) {
      this.form.guestId = a;
      // console.log(this.moreData.orderMan, "this.moreData.orderMan");
    },
    getArrayParams() {
      if (this.ArrayValue.length > 0) {
        return;
      }
      var req = {};
      req.page = 1;
      req.size = 20;
      findForAllot(req).then(res => {
        if (res.code === 0) {
          this.ArrayValue = res.data.content;
        }
      });
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
      this.form.shenCreateTime = data;
    },
    // 选择审核结束日期
    checkSubmit(date) {
      this.form.shenEndTime = data;
    },
    getITPWE() {
      if (this.createDate[0] instanceof Date) {
        this.form.createTimeStart = moment(this.createDate[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.form.createTimeEnd = moment(this.createDate[0]).format(
          "YYYY-MM-DD 23:59:59"
        );
      } else {
        Reflect.deleteProperty(this.form, "createTimeStart")
        Reflect.deleteProperty(this.form, "createTimeEnd")
      }
      if (this.commitDate[0] instanceof Date) {
        this.form.commitDateStart = moment(this.commitDate[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.form.commitDateEnd = moment(this.commitDate[0]).format(
          "YYYY-MM-DD 23:59:59"
        );
      } else {
        Reflect.deleteProperty(this.form, "commitDateStart")
        Reflect.deleteProperty(this.form, "commitDateEnd")
      }
      return this.form;
    },
    reset() {
      this.getArrayParams();
      // this.createDate = [];
      // this.commitDate = [];
      // this.form = {
      //   partCode: "", //申请单号
      //   partName: "", //申请单号
      //   productPartCode: "", //编码
      //   startData: "", //配件人
      //   commitDateEnd: "",
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

<style scoped>
</style>
