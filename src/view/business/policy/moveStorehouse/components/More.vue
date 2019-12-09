<template>
  <Modal v-model="getShowMore" title="高级查询" width="600px" @on-ok="moreOk" @on-cancel="moreCancel">
    <div class="navbox">
      <Row class="mb15">
        <Col span="12">
          <span class="w40">创建日期：</span>
          <DatePicker
            type="daterange"
            placeholder="请选择创建日期！"
            @on-change="establish"
            style="width: 190px"
          ></DatePicker>
        </Col>
        <Col span="12">
          <span class="w40">至：</span>
          <DatePicker
            type="daterange"
            placeholder="请选择提交日期！"
            @on-change="submit"
            style="width: 190px"
          ></DatePicker>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <span class="w40">提交日期：</span>
          <DatePicker
            type="daterange"
            placeholder="请选择提交日期！"
            @on-change="establish"
            style="width: 190px"
          ></DatePicker>
        </Col>
        <Col span="12">
          <span class="w40">至：</span>
          <DatePicker
            type="daterange"
            placeholder="请选择提交日期！"
            @on-change="submit"
            style="width: 190px"
          ></DatePicker>
        </Col>
      </Row>
      <row class="mt15">
        <span >移仓单号：</span>
        <Input
          v-model="callin"
          icon="ios-clock-outline"
          style="width: 450px"
        />
      </row>
      <row class="mt15">
        <span>配件编码：</span>
        <Input v-model="numbers" placeholder="请输入受理单号！" style="width: 450px" />
      </row>
      <row class="mt15">
        <span>配件名称：</span>
        <Input v-model="Name" placeholder="请输入配件名称" style="width: 450px" />
      </row>
    </div>
  </Modal>
</template>

<script>
import { getDataMoreList } from '../../../../../api/AlotManagement/putStorage'
export default {
  name: 'More',
  data() {
    return {
      moreData: {
        createTime: '', //创建日期
        submitTime: '', //提交日期
        callin: '', //调入方
        numbers: '', //受理单号
        applyNumbers: '', //申请单号
        coding: '', //配件编码
        Name: '', //配件名称
        Accessories: '' //受理人
      }
    }
  },
  props: {
    getShowMore: Boolean
  },
  methods: {
    //选择创建日期
    establish(date) {
      console.log(date)
      this.moreData.createTime = data
    },
    //选择提交日期
    submit(date) {
      console.log(date)
      this.moreData.submitTime = data
    },
    //更多弹窗-确定
    moreOk() {
      getDataMoreList()
        .then(res => {
          if (res.code === 0) {
            //res传出去
            this.$emit('getMoreData', res) //更多查询调拨申请列表传出
            this.$emit('getMoreStatus', false) //弹框false传出
          } else {
            this.$Message.info('更多查询调拨申请列表错误')
            this.$emit('getMoreStatus', false)
          }
        })
        .catch(err => {
          this.$Message.info('更多查询调拨申请列表失败')
          this.$emit('getMoreStatus', false)
        })
    },
    //更多弹窗-取消
    moreCancel() {
      this.$emit('getMoreStatus', false)
    }
  }
}
</script>
<style scoped>
.navbox {
  padding: 20px;
}
</style>

