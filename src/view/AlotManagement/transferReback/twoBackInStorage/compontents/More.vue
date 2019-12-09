<template>
  <Modal v-model="getShowMore" title="高级查询" width="600px" @on-ok="moreOk" @on-cancel="moreCancel">
    <div class="navbox">
      <Row>
        <Col span="12">
          <span class="w40">受理日期：</span>
          <DatePicker
            type="daterange"
            placeholder="请选择创建日期！"
            v-model="Time1"
            @on-change="establish"
            style="width: 180px"
          ></DatePicker>
        </Col>
        <Col span="12">
          <span class="w40">入库日期：</span>
          <DatePicker
            type="daterange"
            v-model="Time2"
            placeholder="请选择入库日期！"
            @on-change="submit"
            style="width: 180px"
          ></DatePicker>
        </Col>
      </Row>
      <row class="mt15">
        <span class="ml5">申 请 方：</span>
        <Input
          v-model="moreData.orderMan"
          icon="ios-clock-outline"
          placeholder="请选择申请方！"
          style="width: 450px"
        />
      </row>
      <row class="mt15">
        <span>退回单号：</span>
        <Input v-model="moreData.serviceId" placeholder="请输入退回单号！" style="width: 450px" />
      </row>
      <row class="mt15">
        <span>申请单号：</span>
        <Input v-model="moreData.code" placeholder="请输入申请单号！" style="width: 450px" />
      </row>
      <row class="mt15">
        <span>配件编码：</span>
        <Input v-model="moreData.partCode" placeholder="请输入配件编码！" style="width: 450px" />
      </row>
      <row class="mt15">
        <span>配件名称：</span>
        <Input v-model="moreData.partName" placeholder="请输入配件名称" style="width: 450px" />
      </row>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'More',
  data() {
    return {
      Time1: [],
      Time2: [],
      moreData: {
        createTimeStart: '', //创建日期
        createTimeEnd: '', //创建日期
        allotEnterTimeStart: '', //完成日期
        allotEnterTimeEnd: '', //完成日期
        orderMan: '', //申请人
        serviceId: '', //返回单号
        code: '', //申请单号
        partCode: '', //配件编码
        partName: '' //配件名称
      }
    }
  },
  props: {
    getShowMore: Boolean
  },
  methods: {
    //更多弹窗-确定
    moreOk() {
      this.$emit('getMoreData', this.moreData)
      this.$emit('getMoreStatus', false) //弹框false传出
      this.Time1 = []
      this.Time2 = []
      this.moreData = {
        createTimeStart: '', //创建日期
        createTimeEnd: '', //创建日期
        allotEnterTimeStart: '', //完成日期
        allotEnterTimeEnd: '', //完成日期
        orderMan: '', //申请人
        serviceId: '', //返回单号
        code: '', //申请单号
        partCode: '', //配件编码
        partName: '' //配件名称
      }
    },
    //更多弹窗-取消
    moreCancel() {
      this.$emit('getMoreStatus', false)
    },
    establish(o) {
      this.moreData.createTimeStart = this.$moment(o[0]).format(
        'YYYY-MM-DD HH:mm:ss'
      )
      this.moreData.createTimeStart = this.$moment(o[1]).format(
        'YYYY-MM-DD HH:mm:ss'
      )
    },
    submit(s) {
      this.moreData.allotEnterTimeStart = this.$moment(s[0]).format(
        'YYYY-MM-DD HH:mm:ss'
      )
      this.moreData.allotEnterTimeEnd = this.$moment(s[0]).format(
        'YYYY-MM-DD HH:mm:ss'
      )
    }
  }
}
</script>
<style scoped>
.navbox {
  padding: 20px;
}
</style>

