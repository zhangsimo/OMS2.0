<template>
  <Modal
    v-model="moreQueryShow"
    title="高级查询"
   >
    <div class="box">
      <Form ref="formInline" :model="data" :label-width="100">
        <FormItem label="创建日期:">
          <DatePicker type="daterange" v-model="data.creatDate" placement="bottom" placeholder="选择日期" style="width: 350px"></DatePicker>
        </FormItem>
        <FormItem label="提交日期:">
          <DatePicker type="daterange" placement="bottom" placeholder="选择日期" style="width: 350px"></DatePicker>
        </FormItem>
        <FormItem label="客户:">
        <Select v-model="data.asd" filterable style="width: 350px">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        </FormItem>
        <FormItem label="订单号:">
          <Input v-model="data.text" maxlength="100" :rows="4" show-word-limit type="textarea" placeholder="请输入单号" style="width: 350px" />
        </FormItem>
        <FormItem label="配件编码:">
          <Input v-model="data.text" maxlength="100" :rows="4" show-word-limit type="textarea" placeholder="请输入单号" style="width: 350px" />
        </FormItem>
        <FormItem label="配件名称:">
          <Input v-model="data.text"    placeholder="请输入配件名称" style="width: 350px" />
        </FormItem>
        <FormItem label="品牌:">
          <Input v-model="data.text"    placeholder="请输入配件名称" style="width: 350px" />
        </FormItem>
        <FormItem label="销售人员:">
          <Input v-model="data.text"    placeholder="请输入配件名称" style="width: 350px" />
        </FormItem>
        <FormItem label="提交人:">
          <Input v-model="data.text"    placeholder="请输入配件名称" style="width: 350px" />
        </FormItem>
        <Checkbox v-model="data.isdisabad" class="ml100 ">显示个人单据</Checkbox>
      </Form>
    </div>
    <div slot='footer'>
      <Button type='primary'>确定</Button>
      <Button type='default' @click="addressShow=false">取消</Button>
    </div>
  </Modal>
</template>

<script>
  import {getClient} from '@/api/salesManagment/salesOrder'
    export default {
        name: "MoreQuery",
        props:{
            data:''
        },
        data(){
            return {
                moreQueryShow: false,//模态框是否展示
                cityList:[],//客户下拉框
            }
        },
        mounted(){
            this.getAllClient()
        },
        methods:{
            openModal(){
                this.moreQueryShow = true
            },
           async getAllClient(){
                let res = await getClient()
               console.log(res,999)
            }
        }
    }
</script>

<style scoped>
.box >>> .ivu-form-item {
  margin-bottom: 8px;
}
</style>
