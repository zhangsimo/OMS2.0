<template>
  <Modal v-model="getShowMore" title="高级查询" width="600px" @on-ok="moreOk" @on-cancel="moreCancel">
    <div class="navbox">
      <Row class="mb15">
        <Col span="22">
          <span class="w40">创建日期：</span>
          <DatePicker
            type="daterange"
            placeholder="请选择创建日期！"
            @on-change="establish"
            style="width: 450px"
          ></DatePicker>
        </Col>
        <!-- <Col span="12">
          <span class="w40">至：</span>
          <DatePicker
            type="daterange"
            placeholder="请选择提交日期！"
            @on-change="establish2"
            style="width: 190px"
          ></DatePicker>
        </Col> -->
      </Row>
      <Row>
        <Col span="22">
          <span class="w40">提交日期：</span>
          <DatePicker
            type="daterange"
            placeholder="请选择提交日期！"
            @on-change="submit"
            style="width: 450px"
          ></DatePicker>
        </Col>
        <!-- <Col span="12">
          <span class="w40">至：</span>
          <DatePicker
            type="daterange"
            placeholder="请选择提交日期！"
            @on-change="submit2"
            style="width: 190px"
          ></DatePicker>
        </Col> -->
      </Row>
      <row class="mt15">
        <span >盘点单号：</span>
        <Input
          v-model="moreData.serviceId"
          icon="ios-clock-outline"
          style="width: 450px"
        />
      </row>
      <row class="mt15">
        <span>配件编码：</span>
        <Input v-model="moreData.partCode" placeholder="请输入受理单号！" style="width: 450px" />
      </row>
      <row class="mt15">
        <span>配件名称：</span>
        <Input v-model="moreData.partName" placeholder="请输入配件名称" style="width: 450px" />
      </row>
    </div>
  </Modal>
</template>

<script>
import { getLeftList } from '../../../../../api/business/takeStock.js'
export default {
  name: 'More',
  data() {
    return {
      moreData: {
        createTime: '', //创建日期
        submitTime: '', //提交日期
        serviceId: '', //移库仓号
        partCode: '', //配件编码
        partName: '', //配件名称
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
    // getITPWE() {
    //   this.moreData.createTime = moment(this.moreData.createTime).format('YYYY-MM-DD HH:mm:ss')
    //   this.moreData.submit = moment(this.moreData.submit).format('YYYY-MM-DD HH:mm:ss')
    // },
    //更多弹窗-确定
    moreOk() {
      getLeftList(this.moreData,0,10)
        .then(res => {
          if (res.code === 0) {
            //res传出去
            this.$emit('getMoreData', res) //更多查询调拨申请列表传出
            this.$emit('getMoreStatus', false) //弹框false传出
          } else {
            this.$Message.info('更多查询列表错误')
            this.$emit('getMoreStatus', false)
          }
        })
        .catch(err => {
          this.$Message.info('更多查询列表失败')
          this.$emit('getMoreStatus', false)
        })
        this.reset()
    },
    //更多弹窗-取消
    moreCancel() {
      this.$emit('getMoreStatus', false)
    },
    reset() {
      this.moreData = {
        createTime: '', //创建日期
        submitTime: '', //提交日期
        serviceId: '', //移库仓号
        partCode: '', //配件编码
        partName: '', //配件名称
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

