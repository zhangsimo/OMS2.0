<template>
  <Modal
    v-model="moreQueryShow"
    title="高级查询"
   >
    <div class="box">
      <Form ref="formInline" :model="formData" :label-width="100" @keydown.native.enter="emit">
        <FormItem label="创建日期:">
          <DatePicker type="daterange" v-model="formData.start" @on-change="getCreatDate" placement="bottom":editable=false  placeholder="选择日期" style="width: 350px"></DatePicker>
        </FormItem>
        <FormItem label="提交日期:">
          <DatePicker type="daterange" v-model="formData.end" @on-change="submitDate" placement="bottom"  :editable=false  placeholder="选择日期" style="width: 350px"></DatePicker>
        </FormItem>
        <FormItem label="客户:">
          <Select
            v-model="formData.guestId"
            filterable
            style="width: 350px"
            placeholder="请输入公司全称"
            remote
            :remote-method="getAllClient"
            :loading="loading">
            <Option v-for="(item, index) in clientList" :value="item.id" :key="index">{{item.fullName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="订单号:">
          <Input v-model="formData.serviceId" maxlength="100" :rows="4" show-word-limit type="textarea" placeholder="请输入单号" style="width: 350px" />
        </FormItem>
        <FormItem label="配件编码:">
          <Input v-model="formData.partCode" maxlength="100" :rows="4" show-word-limit type="textarea" placeholder="请输入单号" style="width: 350px" />
        </FormItem>
        <FormItem label="配件名称:">
          <Input v-model="formData.partName"    placeholder="请输入配件名称" style="width: 350px" />
        </FormItem>
        <FormItem label="品牌:">
          <Select v-model="formData.partBrandCode" filterable style="width: 350px">
            <Option v-for="item in brandList" :value="item.code" :key="item.code">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="销售人员:">
          <Select v-model="formData.orderMan" label-in-value filterable style="width: 350px">
            <Option v-for="item in salesList" :value="item.label" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="提交人:">
          <Select v-model="formData.auditor"  label-in-value filterable style="width: 350px">
            <Option v-for="item in salesList" :value="item.label" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <!-- <Checkbox v-model="formData.showPerson" class="ml100 ">显示个人单据</Checkbox> -->
      </Form>
    </div>
    <div slot='footer'>
      <Button type='primary' @click="emit">确定</Button>
      <Button type='default' @click="moreQueryShow=false">取消</Button>
    </div>
  </Modal>
</template>

<script>
  import {getClient , getBrandList,getSales, getTreeClient} from '@/api/salesManagment/salesOrder'
    export default {
        name: "MoreQuery",
        props:{
            data:''
        },
        data(){
            return {
                moreQueryShow: false,//模态框是否展示
                clientList:[],//客户下拉框
                brandList:[],//品牌下拉框,
                formData:this.data,
                salesList:[],
                loading:false, //模糊查询框
            }
        },
        mounted(){
        },
        methods:{
            //打开模态框框
            openModal(){
              this.getAllClient()
              this.getAllBrand();
              this.getAllSales();
              this.moreQueryShow = true
            },
            //获取创建时间
            getCreatDate(date){
                this.formData.startTime = date[0] +  " " + "00:00:00"
                this.formData.endTime = date[1] +' '+ '23:59:59'
            },
            //提交日期
            submitDate(date){
                this.formData.auditStartTime = date[0] +  " " + "00:00:00"
                this.formData.auditEndTime = date[1] +' '+ '23:59:59'
            },
            //获取公司
           async getAllClient(query){
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
            //获取品牌
            async getAllBrand(){
              if(this.brandList.length > 0) {
                return;
              }
                let res = await getBrandList({pageSize:10000})
                if(res.code === 0 ){
                    let arr = []
                    res.data.content.forEach( item => {
                        arr.push(...item.children)
                    })
                    this.brandList = arr
                }
            },
            //获取销售员
            async getAllSales() {
              if(this.salesList.length > 0) {
                return;
              }
                let res = await getSales();
                if (res.code === 0) {
                    this.salesList = res.data.content;
                    this.salesList.map(item => {
                        item.label = item.userName;
                    });
                }
            },
            //确定
            emit(){
              this.$emit('resetData', this.formData);
              this.$store.commit('setOrederQuery' , this.formData)
              this.moreQueryShow = false
            }
        }
    }
</script>

<style scoped>
.box >>> .ivu-form-item {
  margin-bottom: 8px;
}
</style>
