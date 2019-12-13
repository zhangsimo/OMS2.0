<template>
    <Form ref="form" :label-width="100" :model='data' class="clearfix" :rules="rules">
      <FormItem label='收货单位:' prop="receiveCompName">
        <Input v-model='data.receiveCompName' style="width: 380px" ></Input>
      </FormItem>
      <div style="display: flex" >
        <div style="flex-flow: row nowrap;width: 100%" >
          <FormItem label='收货人:' prop="receiveMan">
            <Input v-model='data.receiveMan' style="width: 180px" ></Input>
          </FormItem>
          <FormItem label='省份:' prop="provinceId">
            <Select v-model="data.provinceId" style="width:180px" class="mr10">
              <Option v-for="item in place" v-if="item.parentId==0" :key="item.id" :value="item.id" >{{ item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label='地区:'  prop="countyId">
            <Select v-model="data.countyId" style="width:180px" class="mr10">
              <Option v-for="item in place"  v-if="data.cityId==item.parentId" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%" >
          <FormItem label='联系方式:' prop="contactor">
            <Input v-model='data.contactor' style="width: 180px" ></Input>
          </FormItem>
          <FormItem label='城市:' prop="cityId">
            <Select v-model="data.cityId" style="width:180px" class="mr10">
              <Option v-for="item in place" v-if="data.provinceId==item.parentId" :key="item.id" :value="item.id" >{{ item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label='街道:' prop="streetAddress">
              <Input v-model='data.streetAddress' style="width: 180px" ></Input>
          </FormItem>
        </div>
      </div>
      <FormItem label='详细地址:' >
        <Input v-model='data.address' style="width: 400px" ></Input>
      </FormItem>
      <FormItem label='备注:' style="float: left">
        <Input v-model='data.remark' style="width: 330px" ></Input>
      </FormItem>
      <div style="float: left;line-height: 30px;padding-left: 10px">
        <Checkbox v-model="data.isDefault"></Checkbox>是否默认
      </div>
    </Form>
</template>

<script>
    export default {
        name: "Newplace",
        props:{
            data:'',
            place:''
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
                list:[],
                rules:{
                    provinceId:[
                        {required: true, message:'不能为空 ',trigger: 'change'}
                    ],
                    cityId:[
                        {required: true, message:'不能为空 ',trigger: 'change'}
                    ],
                    receiveMan:[
                        {required: true,message:'不能为空 ', trigger: 'blur'}
                    ],
                    receiveCompName:[
                        {required: true,message:'不能为空', trigger: 'blur'}
                    ],
                    contactor:[
                        {required: true,validator:validatePhone, trigger: 'blur'}
                    ],
                    streetAddress:[
                        {required: true,message:'不能为空', trigger: 'blur'}
                    ],
                  countyId:
                    [
                      {required: true,message:'地区不可为空', trigger: 'blur'}
                    ]
                }
            }
        },
         methods:{

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
                         this.$Message.error('带*为必填');
                     }
                 })
             },
         }
    }
</script>

<style scoped>

</style>
