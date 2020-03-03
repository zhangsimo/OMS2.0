<template>
  <Modal
    v-model="moreQueryShow"
    title="高级查询"
   >
    <div class="box">
      <Form ref="formInline" :model="data" :label-width="100">
        <FormItem label="创建日期:">
          <DatePicker type="daterange" v-model="data.start" @on-change="getCreatDate" placement="bottom":editable=false  placeholder="选择日期" style="width: 350px"></DatePicker>
        </FormItem>
        <FormItem label="提交日期:">
          <DatePicker type="daterange" v-model="data.end" @on-change="submitDate" placement="bottom"  :editable=false  placeholder="选择日期" style="width: 350px"></DatePicker>
        </FormItem>
        <FormItem label="客户:">
        <Select v-model="data.guestId" filterable style="width: 350px">
          <Option v-for="item in clientList" :value="item.id" :key="item.id">{{ item.fullName }}</Option>
        </Select>
        </FormItem>
        <FormItem label="订单号:">
          <Input v-model="data.serviceId" maxlength="100" :rows="4" show-word-limit type="textarea" placeholder="请输入单号" style="width: 350px" />
        </FormItem>
        <FormItem label="配件编码:">
          <Input v-model="data.partCode" maxlength="100" :rows="4" show-word-limit type="textarea" placeholder="请输入单号" style="width: 350px" />
        </FormItem>
        <FormItem label="配件名称:">
          <Input v-model="data.partName"    placeholder="请输入配件名称" style="width: 350px" />
        </FormItem>
        <FormItem label="品牌:">
          <Select v-model="data.partBrandCode" filterable style="width: 350px">
            <Option v-for="item in brandList" :value="item.code" :key="item.code">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="销售人员:">
          <Input v-model="data.orderMan"    placeholder="请输入销售人员名称" style="width: 350px" />
        </FormItem>
        <FormItem label="提交人:">
          <Input v-model="data.auditor"    placeholder="请输入提交人名称" style="width: 350px" />
        </FormItem>
        <Checkbox v-model="data.showPerson" class="ml100 ">显示个人单据</Checkbox>
      </Form>
    </div>
    <div slot='footer'>
      <Button type='primary' @click="emit">确定</Button>
      <Button type='default' @click="moreQueryShow=false">取消</Button>
    </div>
  </Modal>
</template>

<script>
  import {getClient , getBrandList} from '@/api/salesManagment/salesOrder'
    export default {
        name: "MoreQuery",
        props:{
            data:''
        },
        data(){
            return {
                moreQueryShow: false,//模态框是否展示
                clientList:[],//客户下拉框
                brandList:[],//品牌下拉框
            }
        },
        mounted(){
            this.getAllClient()
            this.getAllBrand()
        },
        methods:{
            //打开模态框框
            openModal(){
                this.moreQueryShow = true
            },
            //获取创建时间
            getCreatDate(date){
                this.data.startTime = date[0] +  " " + "00:00:00"
                this.data.endTime = date[1] +' '+ '23:59:59'
            },
            //提交日期
            submitDate(date){
                this.data.auditStartTime = date[0] +  " " + "00:00:00"
                this.data.auditEndTime = date[1] +' '+ '23:59:59'
            },
            //获取公司
           async getAllClient(){
                let res = await getClient()
               if(res.code === 0 ){
                   this.clientList = res.data
               }
            },
            //获取品牌
            async getAllBrand(){
                let res = await getBrandList({pageSize:10000})
                if(res.code === 0 ){
                    let arr = []
                    res.data.content.forEach( item => {
                        arr.push(...item.children)
                    })
                    this.brandList = arr
                }
            },
            //确定
            emit(){
              this.$store.commit('setOrederQuery' , this.data)
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
