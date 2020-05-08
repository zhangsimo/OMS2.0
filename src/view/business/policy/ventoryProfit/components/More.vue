<template>
  <Modal v-model="getShowMore" title="高级查询" width="600px" @on-ok="moreOk" @on-cancel="moreCancel">
    <div class="navbox">
      <Row class="mb15">
        <Col>
          <span class="w40">创建日期：</span>
          <DatePicker
            v-model="moreData.createTime"
            type="daterange"
            placeholder="请选择创建日期"
            @on-change="establish"
            style="width: 450px"
          ></DatePicker>
        </Col>
      </Row>
      <Row>
        <Col>
          <span class="w40">提交日期：</span>
          <DatePicker
            v-model="moreData.enterTime"
            type="daterange"
            placeholder="请选择提交日期"
            @on-change="submit"
            style="width: 450px"
          ></DatePicker>
        </Col>
      </Row>
      <row class="mt15">
        <span>盘点单号：</span>
        <Input placeholder="请输入盘点单号" v-model="moreData.serviceId" icon="ios-clock-outline" style="width: 450px" />
      </row>
      <row class="mt15">
        <span>配件编码：</span>
        <Input v-model="moreData.partCode" placeholder="请输入配件编码" style="width: 450px" />
      </row>
      <row class="mt15">
        <span>配件名称：</span>
        <Input v-model="moreData.partName" placeholder="请输入配件名称" style="width: 450px" />
      </row>
    </div>
  </Modal>
</template>

<script>
import { getLeftList } from "../../../../../api/inventory/salesList";
import moment from "moment";
export default {
  name: "More",
  data() {
    return {
      moreData: {
        createTime:'',//创建时间
        enterTime:'',//提交日期
        startTime: "", //创建日期开始
        endTime: "", //创建日期结束
        auditStartTime: "", //提交时间开始
        auditEndTime: "", //提交时间结束
        serviceId: "", //移库仓号
        partCode: "", //配件编码
        partName: "" //配件名称
      }
    };
  },
  props: {
    getShowMore: Boolean,
    billStatusId: '',
  },
  methods: {
    //选择创建日期
    establish(date) {
      // console.log(date);
      this.moreData.createTime= date
      this.moreData.startTime = moment(date[0]).format("YYYY-MM-DD HH:mm:ss");
      this.moreData.endTime = date[1]+" 23:59:59";
    },
    //选择提交日期
    submit(date) {
      this.moreData.enterTime = date
      this.moreData.auditStartTime = moment(date[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.moreData.auditEndTime = date[1]+" 23:59:59"
    },
    // getITPWE() {
    //   this.moreData.createTime = moment(this.moreData.createTime).format('YYYY-MM-DD HH:mm:ss')
    //   this.moreData.submit = moment(this.moreData.submit).format('YYYY-MM-DD HH:mm:ss')
    // },
    //更多弹窗-确定
    moreOk() {
      let obj = {
        startTime: this.moreData.startTime,
        endTime: this.moreData.endTime,
        auditStartTime: this.moreData.auditStartTime,
        auditEndTime: this.moreData.auditEndTime,
        serviceId: this.moreData.serviceId,
        partCode: this.moreData.partCode,
        partName: this.moreData.partName
      }
      if (this.billStatusId != '') {
        obj.billStatusId = this.billStatusId
      }
      getLeftList(obj, 0, 10)
        .then(res => {
          if (res.code === 0) {
            //res传出去
            this.$emit("getMoreData", res); //更多查询调拨申请列表传出
            this.$emit("getMoreStatus", false); //弹框false传出
          } else {
            this.$Message.info("更多查询列表错误");
            this.$emit("getMoreStatus", false);
          }
        })
        .catch(err => {
          this.$Message.info("更多查询列表失败");
          this.$emit("getMoreStatus", false);
        });
      this.reset();
    },
    //更多弹窗-取消
    moreCancel() {
      this.$emit("getMoreStatus", false);
    },
    reset() {
      this.moreData = {
        createTime:'',//创建时间
        enterTime:'',//提交日期
        startTime: "", //创建日期开始
        endTime: "", //创建日期结束
        auditStartTime: "", //提交时间开始
        auditEndTime: "", //提交时间结束
        serviceId: "", //移库仓号
        partCode: "", //配件编码
        partName: "" //配件名称
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

