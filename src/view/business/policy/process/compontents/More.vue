<template>
  <div class="navbox">
    <Row>
      <Col span="12">
        <span class="w40">创建日期从：</span>
        <DatePicker v-model="form.createTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" style="width: 180px"></DatePicker>
      </Col>
      <Col span="12">
        <span class="w40 ml10">至：</span>
        <DatePicker v-model="form.endTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" style="width: 180px"></DatePicker>
      </Col>
    </Row>
    <row class="mt15">
      <Col span="12">
        <span class="w40">提交日期从：</span>
        <DatePicker v-model="form.startAuditDate" type="datetime" format="yyyy-MM-dd HH:mm:ss" style="width: 180px"></DatePicker>
      </Col>
      <Col span="12">
        <span class="w40 ml10">至：</span>
        <DatePicker v-model="form.endAuditDate" type="datetime" format="yyyy-MM-dd HH:mm:ss" style="width: 180px"></DatePicker>
      </Col>
    </row>
    <row class="mt15">
      <span>成 品 编 码 ：</span>
      <Input v-model="form.productPartCode" style="width: 398px" />
    </row>
    <row class="mt15">
      <span>半成品编码：</span>
      <Input v-model="form.partCode" style="width: 398px" />
    </row>
    <row class="mt15">
      <span class="ml5">单 号：</span>
      <Input v-model="form.showPerson" style="width: 398px" />
    </row>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'More',
  data() {
    return {
      moment: moment,
      form: {
        showPerson: '', //调出方
        partCode: '', //申请单号
        productPartCode: '', //编码
        endAuditDate: '', //配件人
        startAuditDate: '', //配件名称,
        createTime: '',
        endTime: ''
      }
    }
  },
  methods: {
    //选择创建开始日期
    establish(date) {
      this.form.createTime = data
    },
    //选择创建结束日期
    submit(date) {
      this.form.endTime = data
    },
    // 选择审核开始日期
    check(date) {
      this.form.shenCreateTime = data
    },
    // 选择审核结束日期
    checkSubmit(date) {
      this.form.shenEndTime = data
    },
    getITPWE() {
      if (this.form.createTime) {
        this.form.createTime = moment(this.form.createTime).format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.form.endTime) {
        this.form.endTime = moment(this.form.endTime).format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.form.startAuditDate) {
        this.form.startAuditDate = moment(this.form.startAuditDate).format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.form.endAuditDate) {
        this.form.endAuditDate = moment(this.form.endAuditDate).format('YYYY-MM-DD HH:mm:ss')
      }
      return this.form
    },
    reset() {
      this.form = {
        showPerson: '', //调出方
        partCode: '', //申请单号
        productPartCode: '', //编码
        endAuditDate: '', //配件人
        startAuditDate: '', //配件名称,
        createTime: '',
        endTime: ''
      }
    }
  }
}
</script>
<style scoped>
.navbox {
  padding: 20px;
}
</style>

<style scoped>
</style>
