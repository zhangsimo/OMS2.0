<template>
  <Modal v-model="getShowMore" title="高级查询" width="600px" @on-ok="moreOk" @on-cancel="moreCancel">
    <div class="navbox">
      <Row class="mb15">
        <span class="w40">创建日期：</span>
          <DatePicker
            type="daterange"
            placeholder="请选择创建日期！"
            @on-change="establish"
            style="width: 450px"
          ></DatePicker>
      </Row>
      <Row>
          <span class="w40">提交日期：</span>
          <DatePicker
            type="daterange"
            placeholder="请选择提交日期！"
            @on-change="submit"
            style="width: 450px"
          ></DatePicker>
      </Row>
      <row class="mt15">
        <span >移仓单号：</span>
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
// import { getDataMoreList } from '../../../../../api/putStorage'
import {getLeftList} from "../../../../../api/business/moveStorehouse.js";
import * as tools from "../../../../../utils/tools";
export default {
  name: 'More',
  data() {
    return {
      moreData: {
        createStartDate: '', //创建日期
        commitEndDat:'',
        commitStartDate: '', //提交日期
        commitEndDat:'',
        serviceId: '', //移仓单号
        partCode: '', //配件编码
        partName: '', //配件名称
      },
      Left:{
        page: {
          num: 1,
          size: 10,
          total: 0
        },
      }
    }
  },
  props: {
    getShowMore: Boolean

  },
  methods: {
    //选择创建日期
    establish(date) {
      this.moreData.createStartDate = tools.transTime(date[0])
      this.moreData.createEndDate = tools.transTime(date[1])
    },
    //选择提交日期
    submit(date) {
      console.log(date)
      this.moreData.commitStartDate =tools.transTime(date[0])
      this.moreData.commitEndDate = tools.transTime(date[1])
    },
    //更多弹窗-确定
    moreOk() {
      console.log(this.moreData)

      let page = this.Left.page.num - 1;
      let size = this.Left.page.size;
      getLeftList(this.moreData,page, size)
        .then(res => {
          console.log('res',res)
          if (res.code === 0) {
            //res传出去
            res.data.content.map((item, index) => {
              item["index"] = index + 1;
              item["statuName"] = item.status.name;
            });
            this.$emit('getMoreData', res) //更多查询调拨申请列表传出
            this.$emit('getMoreStatus', false) //弹框false传出
            this.moreData={}
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
    },
    reset() {
      this.moreData = {
         createStartDate: '', //创建日期
        commitEndDat:'',
        commitStartDate: '', //提交日期
        commitEndDat:'',
        serviceId: '', //移仓单号
        partCode: '', //配件编码
        partName: '', //配件名称
      }
    },
  }
}
</script>
<style scoped>
.navbox {
  padding: 20px;
}
</style>

