<template>
  <Modal
    v-model="moreQueryShow"
    title="高级查询"
   >
    <div class="box">
      <Form ref="formInline" :model="formData" :label-width="100" @keydown.native.enter="emit">
        <FormItem label="创建日期:">
          <DatePicker type="daterange" v-model="formData.start"  @on-change="getCreatDate" placement="bottom" :editable=false  placeholder="选择日期" style="width: 350px"></DatePicker>
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
          <Input v-model="formData.serviceId" type="text" placeholder="请输入单号" style="width: 350px" />
        </FormItem>
        <FormItem label="往来单号:">
          <Input v-model="formData.code" type="text" placeholder="请输入往来单号" style="width: 350px" />
        </FormItem>
        <FormItem label="配件编码:">
          <Input v-model="formData.partCode" type="text" placeholder="请输入配件编码" style="width: 350px" />
        </FormItem>
        <FormItem label="配件名称:">
          <Input v-model="formData.partName"  type="text"  placeholder="请输入配件名称" style="width: 350px" />
        </FormItem>
        <FormItem label="品牌:">
          <Select v-model="formData.partBrandCode" filterable style="width: 350px">
            <Option v-for="item in brandList" :value="item.code" :key="item.code">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="订单金额:">
          <Select v-model="formData.amtType" style="width: 350px">
            <Option v-for="item in orderPriceArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Row>
            <Col span="6" v-if="formData.amtType">
              <vxe-input @change="amtMinChange" size="mini" v-model="amtMin" style="width: 100%" type="float"></vxe-input>
            </Col>
            <Col v-if="formData.amtType=='4'" span="2" class="tc" style="color: #999">—</Col>
            <Col v-if="formData.amtType=='4'" span="6">
              <vxe-input size="mini"  :min="amtMin" v-model="amtMax" style="width: 100%" type="float"></vxe-input>
            </Col>
          </Row>
          <!--<Row v-if="formData.orderPriceType&&formData.orderPriceType!='qj'">-->
            <!--<Col span="10">-->
              <!--<InputNumber :min="0" v-model="amtMax" style="width: 100%"></InputNumber>-->
            <!--</Col>-->
          <!--</Row>-->
        </FormItem>
        <FormItem label="创建人:">
          <Select v-model="formData.createUid" label-in-value filterable style="width: 350px">
            <Option v-for="item in salesList" :value="item.id" :key="item.id">{{ item.label }}</Option>
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
      <Button type='default' @click="clearCondition">清空条件</Button>
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
                orderPriceArr:[
                  {
                    label:'等于',
                    value:'1'
                  },
                  {
                    label:'小于等于',
                    value:'2'
                  },
                  {
                    label:'大于等于',
                    value:'3'
                  },
                  {
                    label:'区间',
                    value:'4'
                  }
                ],
              amtMin : 0,
              amtMax : 0,
            }
        },
        mounted(){

        },
        methods:{
            //清空更多弹框的条件
            clearCondition(){
              // this.$refs.formInline.resetFields()
              this.formData = {}
              this.amtMax = 0;
              this.amtMin = 0;
            },
            //打开模态框框
            openModal(){
              this.getAllClient()
              this.getAllBrand();
              this.getAllSales();
              this.moreQueryShow = true
            },
            //获取创建时间
            getCreatDate(date){
              if(date[0] === ''){
                this.$delete(this.formData, 'startTime')
                this.$delete(this.formData, 'endTime')
                return
              }
                this.formData.startTime = date[0] +  " " + "00:00:00"
                this.formData.endTime = date[1] +' '+ '23:59:59'
            },
            //提交日期
            submitDate(date){
                if(date[0] === ''){
                  this.$delete(this.formData, 'auditStartTime')
                  this.$delete(this.formData, 'auditEndTime')
                  return
                }
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
          amtMinChange({value}){
              if(parseFloat(this.amtMax)<parseFloat(value)){
                this.amtMax = value
              }
          },
            //确定
            emit(){
              if(this.formData.amtType){
                if(this.formData.amtType=='4'){
                  this.formData.amtMin = this.amtMin;
                  this.formData.amtMax = this.amtMax;
                }else{
                  this.formData.amtMin = this.amtMin;
                }
              }
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
