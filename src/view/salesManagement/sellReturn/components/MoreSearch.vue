<template>
  <Modal
    v-model="moreQueryShow"
    title="高级查询"
  >
    <div class="box">
      <Form ref="formInline" :model="data" :label-width="100">
        <FormItem label="创建日期:" >
          <DatePicker type="daterange" v-model="data.start"  :editable=false @on-change="getCreatDate"  placement="bottom" placeholder="选择日期" style="width: 350px"></DatePicker>
        </FormItem>
        <FormItem label="提交日期:">
          <DatePicker type="daterange" v-model="data.end"   :editable=false @on-change="submitDate" placement="bottom" placeholder="选择日期" style="width: 350px"></DatePicker>
        </FormItem>
        <FormItem label="客户:">
          <Select v-model="data.guestId" filterable style="width: 350px">
            <Option v-for="item in clientList" :value="item.id" :key="item.id">{{ item.fullName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="退货单号:">
          <Input v-model="data.serviceId" maxlength="100" :rows="4" show-word-limit type="textarea"  style="width: 350px" />
        </FormItem>
        <FormItem label="配件编码:">
          <Input v-model="data.partCode" maxlength="100" :rows="4" show-word-limit type="textarea"  style="width: 350px" />
        </FormItem>
        <FormItem label="配件名称:">
          <Input v-model="data.partName"  style="width: 350px" />
        </FormItem>
        <FormItem label="退货员:">
          <Input v-model="data.orderMan"  style="width: 350px" />
        </FormItem>
        <FormItem label="创建人:">
          <Input v-model="data.createUname"  style="width: 350px" />
        </FormItem>

      </Form>
    </div>
    <div slot='footer'>
      <Button type='primary' @click="getMoreSearch">确定</Button>
      <Button type='default'  @click="moreQueryShow=false">取消</Button>
    </div>
  </Modal>
</template>

<script>
  import {getClient} from '@/api/salesManagment/salesOrder'
  import {getMoreList} from "_api/salesManagment/presell.js";
  import * as tools from "../../../../utils/tools";
  export default {
    name: "MoreSearh",
    props:{
      data:''
    },
    data(){
      return {
        moreQueryShow: false,//模态框是否展示
        clientList:[],//客户下拉框
        // data:{},  //表单数据 prop已经赋值过了你再赋值干嘛???
        page: {
          total: 0,
          size: 10,
          num: 1
        },
      }
    },
    mounted(){
      this.getAllClient()
    },
    methods: {
      openModal() {
        this.moreQueryShow = true
      },
      //获取公司
      async getAllClient() {
        let res = await getClient()
        if (res.code === 0) {
          this.clientList = res.data
        }
        // console.log(res,999)
      },
      //获取创建时间
      getCreatDate(date) {
        // console.log(date)
        // this.data.startTime = date[0] + " " + "00:00:00"
        // this.data.endTime = date[1] + ' ' + '23:59:59'
        this.data.startTime=tools.transTime(date[0])
        this.data.endTime =tools.transTime(date[1])
        // console.log('666',this.data.startTime,  this.data.endTime)
      },
      //提交日期
      submitDate(date) {
        // console.log('444',date)
        // this.data.auditStartDate = date[0] + " " + "00:00:00"
        // this.data.auditEndDate= date[1] + ' ' + '23:59:59'
        this.data.auditStartDate =tools.transTime(date[0])
          this.data.auditEndDate=tools.transTime(date[1])
        // console.log('777',this.data.auditStartDate, this.data.auditEndDate)
      },
      //更多搜索
      getMoreSearch() {
        // console.log('999999999999',this.data)
        this.$emit('moreQuery' , this.data)
        this.moreQueryShow=false

      }
    }
  }
</script>

<style scoped>
  .box >>> .ivu-form-item {
    margin-bottom: 8px;
  }
</style>
