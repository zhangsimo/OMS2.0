<template>
  <Modal
    v-model="moreQueryShow"
    title="高级查询"
  >
    <div class="box">
      <Form ref="formInline" :model="data" :label-width="100" @keydown.native.enter="getMoreSearch">
        <FormItem label="创建日期:" >
          <DatePicker type="daterange" v-model="data.start"  :editable=false @on-change="getCreatDate"  placement="bottom" placeholder="选择日期" style="width: 350px"></DatePicker>
        </FormItem>
        <FormItem label="提交日期:">
          <DatePicker type="daterange" v-model="data.end"   :editable=false @on-change="submitDate" placement="bottom" placeholder="选择日期" style="width: 350px"></DatePicker>
        </FormItem>
        <FormItem label="客户:">
          <Select
            v-model="data.guestId"
            filterable
            style="width: 350px"
            placeholder="请输入公司全称"
            remote
            :remote-method="getAllClient"
            :loading="loading">
            <Option v-for="(item, index) in clientList" :value="item.id" :key="index">{{item.fullName}}</Option>
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
          <Select v-model="data.orderMan" class="w300 ml5" label-in-value filterable>
            <Option v-for="item in salesList" :value="item.label" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="创建人:">
          <Select v-model="data.createUname" class="w300 ml5" label-in-value filterable>
            <Option v-for="item in salesList" :value="item.label" :key="item.value">{{ item.label }}</Option>
          </Select>
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
  import {getClient, getCRman, getSales, getTreeClient} from '@/api/salesManagment/salesOrder'
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
        salesList: [],
        // data:{},  //表单数据 prop已经赋值过了你再赋值干嘛???
        page: {
          total: 0,
          size: 10,
          num: 1
        },
        loading:false, //模糊查询框
      }
    },
    mounted(){
    },
    methods: {
      setDate(date) {
        let s = date[0] + " 00:00:00"
        let e = date[1] + " 23:59:59"
        return [s, e]
      },
      openModal() {
        this.getAllClient()
        this.getAllSales()
        this.moreQueryShow = true
      },
      async getAllSales() {
        if(this.salesList.length > 0) {
          return;
        }
      let res = await getSales();
      if (res.code === 0) {
        this.salesList = res.data.content;
        this.salesList.forEach(item => {
          item.label = item.userName;
          item.value = item.id;
        });
      }
    },
      //获取公司
      async getAllClient(query) {
        if (query && query.trim()) {
          this.loading = true;
          let data ={}
          data.fullName = query
          data.page = 0
          data.size = 30
          let res = await getTreeClient(data)
          if(res.code === 0 ){
            this.loading = false;
            this.clientList = res.data.content;
          }else{
            this.loading = false;
          }
        }else {
          this.clientList = []
        }
      },
      //获取创建时间
      getCreatDate(date) {
        [this.data.startTime, this.data.endTime] = this.setDate(date)
      },
      //提交日期
      submitDate(date) {
        [this.data.auditStartDate,this.data.auditEndDate] = this.setDate(date)
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
