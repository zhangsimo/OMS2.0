<template>
 <Form :label-width="100"  :model='data' :rules="rules" ref="form">
   <div class="header-box clearfix">
          <span class="isDisabeld">
          是否禁用
          <Checkbox v-model="data.isClient"></Checkbox>
        </span>
     <span class="isDisabeld">
          供应商
          <Checkbox v-model="clientDisable" disabled></Checkbox>
        </span>
     <span class="isDisabeld">
          客户
          <Checkbox v-model="data.isDisabled"></Checkbox>
        </span>
   </div>
<!--   切换栏-->
   <div class="tabList">
     <Tabs type="card">
       <TabPane label="基本信息">
         <div style="display: flex">
           <div style="flex-flow: row nowrap;width: 100%" >
             <FormItem label='客户简称:' prop="shortName" >
               <Input v-model='data.shortName' style="width: 180px" ></Input>
             </FormItem>
           </div>
         </div>
         <FormItem label='客户全称:' prop="fullName">
           <Input v-model='data.fullName' style="width: 480px" ></Input>
         </FormItem>
         <div style="display: flex">
           <div style="flex-flow: row nowrap;width: 100%" >
             <FormItem label='票据类型:' prop="billTypeId">
               <Select v-model="data.billTypeId" style="width:180px" class="mr10">
                 <Option v-for="item in dataList.CS00107" :value="item.id" :key="item.id">{{ item.itemName }}</Option>
               </Select>
             </FormItem>
             <FormItem label='联系人:' prop="contactor" >
               <Input v-model='data.contactor' style="width: 180px" ></Input>
             </FormItem>
             <FormItem label='省份:' prop="provinceId">
               <Select v-model="data.provinceId" style="width:180px" class="mr10">
                 <Option v-for="item in provincearr" v-if="item.parentId==0" :key="item.id" :value="item.id" >{{ item.name}}</Option>
               </Select>
             </FormItem>
           </div>
           <div style="flex-flow: row nowrap;width: 100%" >
             <FormItem label='结算方式:' prop="settTypeId">
               <Select v-model="data.settTypeId" style="width:180px" class="mr10">
                 <Option v-for="item in dataList.CS00106" :value="item.id" :key="item.id">{{ item.itemName }}</Option>
               </Select>
             </FormItem>
             <FormItem label='联系方式:' prop="contactorTel">
               <Input v-model='data.contactorTel' style="width: 180px" ></Input>
             </FormItem>
             <FormItem label='城市:' prop="cityId">
               <Select v-model="data.cityId" style="width:180px" class="mr10">
                 <Option v-for="item in provincearr" v-if="data.provinceId==item.parentId" :key="item.id" :value="item.id" >{{ item.name}}</Option>
               </Select>
             </FormItem>
           </div>
         </div>
         <FormItem label='地址:' >
           <Input v-model='data.streetAddress' style="width: 380px" ></Input>
         </FormItem>
         <div style="display: flex">
           <div style="flex-flow: row nowrap;width: 100%" >
             <FormItem label='业务员:' >
               <Input v-model='data.salesman' style="width: 180px" ></Input>
             </FormItem>
<!--             <FormItem label='信用等级:' >-->
<!--               <Select v-model="data.use" style="width:180px" class="mr10">-->
<!--                 <Option v-for="item in list" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
<!--               </Select>-->
<!--             </FormItem>-->
             <FormItem label='职务:' >
               <Select v-model="data.salesmanDuty" style="width:180px" class="mr10">
                 <Option v-for="item in dataList.CS00110" :value="item.id" :key="item.id">{{ item.itemName }}</Option>
               </Select>
             </FormItem>
             <FormItem label='供应类型:' >
               <Select v-model="data.supplierType" style="width:180px" class="mr10">
                 <Option v-for="item in dataList.CS00111" :value="item.id" :key="item.id">{{ item.itemName }}</Option>
                 </Select>
             </FormItem>
             <FormItem label='邮箱:' >
               <Input v-model='data.email' style="width: 180px" ></Input>
             </FormItem>
             <FormItem label='QQ/微信:' >
               <Input v-model='data.instantMsg' style="width: 180px" ></Input>
             </FormItem>

           </div>
           <div style="flex-flow: row nowrap;width: 100%" >
             <FormItem label='业务员手机:' >
                 <Input v-model='data.salesmanTel' style="width: 180px" ></Input>
             </FormItem>
<!--             <FormItem label='信誉额度:' >-->
<!--                 <Input v-model='data.contactor' style="width: 180px" ></Input>-->
<!--             </FormItem>-->
             <FormItem label='邮政编码:' >
               <Input v-model='data.postalCode' style="width: 180px" ></Input>
             </FormItem>
             <FormItem label='优势品牌/产品:' >
               <Input v-model='data.advantageCarbrandId' style="width: 180px" ></Input>
             </FormItem>
             <FormItem label='电话:' >
               <Input v-model='data.tel' style="width: 180px" ></Input>
             </FormItem>
           </div>
         </div>
         <FormItem label="备注:">
           <Input v-model='data.remark' style="width: 480px" ></Input>
         </FormItem>
         <Row>
           <Col span="12">
             <FormItem label='一级分类:' prop="supplierTypeFirst">
               <Select v-model="data.supplierTypeFirst" style="width:180px" class="mr10">
                 <Option v-for="item in treelist" v-if="item.lever == 1" :value="item.id" :key="item.code">{{ item.title }}</Option>
               </Select>
             </FormItem>
           </Col>
           <Col span="12">
             <FormItem label='二级分类:'prop="supplierTypeSecond">
               <Select v-model="data.supplierTypeSecond" style="width:180px" class="mr10">
                 <Option v-for="item in treelist "  v-if="data.supplierTypeFirst == item.parentId" :value="item.id" :key="item.id">{{ item.title }}</Option>
               </Select>
             </FormItem>
           </Col>
         </Row>
       </TabPane>
       <TabPane label="其他信息">
         <div>
             <div>
             <FormItem label='银行账号:' >
               <Input v-model='data.accountBankNo' style="width: 450px" ></Input>
             </FormItem>
             <FormItem label='开户银行:' >
               <Input v-model='data.accountBank' style="width: 450px" ></Input>
             </FormItem>
             <div style="display: flex">
               <div style="flex-flow: row nowrap;width: 100%" >
                 <FormItem label='纳税人编码:' prop="phone">
                   <Input  v-model='data.taxpayerCode' style="width: 150px" ></Input>
                 </FormItem>
               </div>
               <div style="flex-flow: row nowrap;width: 100%" >
                 <FormItem label='纳税人电话:' prop="phone">
                   <Input v-model='data.taxpayerTel' style="width: 150px" ></Input>
                 </FormItem>
               </div>
             </div>
             <FormItem label='纳税人名称:' >
               <Input v-model='data.taxpayerName' style="width: 450px" ></Input>
             </FormItem>
           </div>
           <p style="margin-bottom: 10px">其他信息</p>
           <FormItem label='网址:' >
             <Input v-model='data.website' style="width: 450px" ></Input>
           </FormItem>
           <FormItem label='传真:' >
             <Input v-model='data.fax' style="width: 450px" ></Input>
           </FormItem>
           <FormItem label='经营地址:' >
             <Input v-model='data.addr' style="width: 450px" ></Input>
           </FormItem>
           <FormItem label='会员卡号:' >
             <Input v-model='data.memCarNo' style="width: 450px" ></Input>
           </FormItem>
           <div style="display: flex">
             <div style="flex-flow: row nowrap;width: 100%" >
               <FormItem label='会员等级:' prop="phone">
                 <Input  v-model='data.memLevelId' style="width: 150px" ></Input>
               </FormItem>
             </div>
             <div style="flex-flow: row nowrap;width: 100%" >
               <FormItem label='信誉额度:' prop="phone">
                 <Input  v-model='data.creditLimit' style="width: 150px" ></Input>
               </FormItem>
             </div>
           </div>
         </div>
       </TabPane>
     </Tabs>
   </div>
 </Form>
</template>

<script>
  import {getDigitalDictionary } from '@/api/system/essentialData/clientManagement'

  export default {
        name: "Data",
        components:{
        },
        props:{
            data:'',
            provincearr:'',
            treelist:''
        },
        data(){
            const validatePhone = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机号不能为空'));
                } else if (!/^1[345789]\d{9}$/.test(value)) {
                    callback(new Error('手机号格式不正确'));
                } else {
                    callback();
                }
            };
            return {
                list:[
                    {
                        label: 123,
                        value:1
                    },
                    {
                        label: 456,
                        value:2
                    }
                ],
                clientDisable:true,
                rules:{
                    shortName:[
                        {required: true, message: '不能为空', trigger: 'blur'}
                    ],
                    fullName:[
                        {required: true, message: '不能为空', trigger: 'blur'}
                    ],
                    billTypeId:[
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],
                    contactor:[
                        {required: true, message: '不能为空', trigger: 'blur'}
                    ],
                    provinceId:[
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],
                    settTypeId:[
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],
                    contactorTel:[
                        {required: true, validator:validatePhone, trigger: 'blur'}
                    ],
                    cityId:[
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],
                    supplierTypeFirst:[
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],
                    supplierTypeSecond:[
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],

                },
                dataList:''
            }
        },
        created(){
          this.getList()
        },
        methods:{
            //获取客户属性
            async  getList(){
                let data ={}
                data =['CS00107','CS00106','CS00111','CS00110']
                let res = await  getDigitalDictionary(data)
                console.log(res)
                if(res.code == 0){
                    this.dataList = res.data
                }

            },
            //清除内容
            resetFields() {
                this.$refs.form.resetFields()
            },
            //校验表单
            handleSubmit (callback) {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        callback && callback()
                    } else {
                        this.$Message.error('信息填写错误');
                    }
                })
            },
            selection(){

            },
            addPlace(){
                this.newplace =true
            },
        }
    }
</script>

<style scoped lang="less">
.isDisabeld {
  float: right;
}
.place{
  line-height: 40px;
  padding-left: 10px;
  border: 1px solid #eee;
}
.staff-name {
  width: 200px;
}
</style>
<style scoped>
.tabList>>>.ivu-form-item {
  margin-bottom: 10px;
}

</style>
