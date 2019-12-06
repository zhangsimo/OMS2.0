<template>
  <Modal
    v-model="moreQueryShow"
    title="高级查询"
  >
    <div class="box">
      <Form ref="formInline" :model="data" :label-width="100">
        <FormItem label="创建日期:">
          <DatePicker type="daterange"  @on-change="getCreatDate"  placement="bottom" placeholder="选择日期" style="width: 350px"></DatePicker>
        </FormItem>
        <FormItem label="提交日期:">
          <DatePicker type="daterange"  @on-change="submitDate" placement="bottom" placeholder="选择日期" style="width: 350px"></DatePicker>
        </FormItem>
        <FormItem label="客户:">
          <Select v-model="data.guestId" filterable style="width: 350px">
            <Option v-for="item in clientList" :value="item.value" :key="item.value">{{ item.fullName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="预售单号:">
          <Input v-model="data.serviceId" maxlength="100" :rows="4" show-word-limit type="textarea" placeholder="请输入预售单号" style="width: 350px" />
        </FormItem>
        <FormItem label="配件编码:">
          <Input v-model="data.partCode" maxlength="100" :rows="4" show-word-limit type="textarea" placeholder="请输入配件编码" style="width: 350px" />
        </FormItem>
        <FormItem label="配件名称:">
          <Input v-model="data.partName"    placeholder="请输入配件名称" style="width: 350px" />
        </FormItem>
        <FormItem label="创建人:">
          <Input v-model="data.createUname"    placeholder="请输入创建人" style="width: 350px" />
        </FormItem>
        <FormItem label="提交人:">
          <Input v-model="data.commitUname"    placeholder="请输入提交人" style="width: 350px" />
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
  export default {
    name: "MoreSearh",
    props:{
      data:''
    },
    data(){
      return {
        moreQueryShow: false,//模态框是否展示
        clientList:[],//客户下拉框
        data:{},  //表单数据
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
    methods:{
      openModal(){
        this.moreQueryShow = true
      },
      //获取公司
      async getAllClient(){
        let res = await getClient()
        if(res.code === 0 ){
          this.clientList = res.data
        }
        // console.log(res,999)
      },
      //获取创建时间
      getCreatDate(date){
        // console.log(date)
        this.data.createTimeStart = date[0] +  " " + "00:00:00"
        this.data.createTimeEnd = date[1] +' '+ '23:59:59'
        // console.log('666',this.data.createTimeStart,this.data.createTimeEnd)
      },
      //提交日期
      submitDate(date){
        // console.log('444',date)
        this.data.commitTimeStart = date[0] +  " " + "00:00:00"
        this.data.commitTimeEnd = date[1] +' '+ '23:59:59'
        // console.log('777',this.data.createTimeStart,this.data.createTimeStart)
      },
      //更多搜索
      getMoreSearch(){

        let data={}
         data.createTimeStart=this.data.createTimeStart
         data.createTimeEnd=this.data.createTimeEnd
         data.commitTimeStart=this.data.commitTimeStart
         data.commitTimeEnd=this.data.commitTimeEnd
         data.guestId=this.data.guestId
         data.partCode=this.data.partCode
         data.partName=this.data.partName
         data.createUname=this.data.createUname
         data.commitUname=this.data.commitUname;
         data.serviceId=this.data.serviceId
         // this.$parent.getLeftList(data)
        let page = this.page.num -1
        let size = this.page.size
        getMoreList(size,page,data).then(res =>{
          // console.log('打印出来的数据434344444',res)
       if(res.code==0){
         this.moreQueryShow=false
         this.data.serviceId=""
       }

        })
        },

       }
  }
</script>

<style scoped>
  .box >>> .ivu-form-item {
    margin-bottom: 8px;
  }
</style>
