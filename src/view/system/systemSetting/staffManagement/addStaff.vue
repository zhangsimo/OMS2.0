<template>
    <Form :label-width="150" label-position="left" :rules='rules' :model='data' style="text-align: left" ref="form">
      <div style="display: flex">
        <div style="flex-flow: row nowrap;width: 100%" >
          <FormItem label='姓名：'prop="userName">
            <Input placeholder='请输入姓名' v-model='data.userName' style="width: 150px" ></Input>
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%" >
          <FormItem label='性别：' >
            <Radio-group v-model="data.gender">
              <Radio :label="0" >
                <span>男</span>
              </Radio>
              <Radio :label="1">
                <span>女</span>
              </Radio>
            </Radio-group>
          </FormItem>
        </div>
      </div>
      <div style="display: flex">
        <div style="flex-flow: row nowrap;width: 100%" >
          <FormItem label='手机号码:' prop="phone">
            <Input placeholder='请输入手机号码' v-model='data.phone' style="width: 150px" ></Input>
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%" >
          <FormItem label='生日：' >
            <Date-picker :value="data.birthDay" type="date" placeholder="选择日期" style="width: 150px" @on-change="changeBirthday"></Date-picker>
          </FormItem>
        </div>
      </div>
      <FormItem label='身份证号码:' prop="cardId" >
        <Input placeholder='请输入身份证号码' v-model='data.cardId' style="width: 250px" ></Input>
      </FormItem>
      <FormItem label='入职部门:' prop="ground" >
        <Cascader :data="list" v-model="data.ground" placeholder='选择部门' style="width: 250px"  @on-change="selectGroust"></Cascader>
      </FormItem>
      <div style="display: flex">
        <div style="flex-flow: row nowrap;width: 100%" >
          <FormItem label='入职时间：' style="">
            <Date-picker :value="data.entryTime" type="date" placeholder="选择日期" style="width: 150px" @on-change="changeEntryTime"></Date-picker>
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%" >
          <FormItem label='微信/QQ号：' >
            <Input placeholder='请输入微信/QQ号码' v-model='data.wechatId' style="width: 150px" ></Input>
          </FormItem>
        </div>
      </div>
      <div style="display: flex">
      <div style="flex-flow: row nowrap;width: 100%" >
        <FormItem label='紧急联系人：' >
          <Input placeholder='请输入紧急联系人名称' v-model='data.emergencyContact' style="width: 150px" ></Input>
        </FormItem>
      </div>
      <div style="flex-flow: row nowrap;width: 100%" >
        <FormItem label='紧急联系人电话：' >
          <Input placeholder='请输入紧急联系人电话' v-model='data.emergencyContactPhone' style="width: 150px" ></Input>
        </FormItem>
      </div>
      </div>
      <div style="display: flex">
        <div style="flex-flow: row nowrap;width: 100%" >
          <FormItem label='是否低于成本价销售:' >
            <Select v-model="data.sureCost" style="width:150px" >
              <Option v-for="item in costList" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%" >
          <FormItem label='是否业务人员：' >
            <Select v-model="data.business" style="width:150px" >
              <Option v-for="item in businessList" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </div>
      </div>
      <div style="display: flex">
        <div style="flex-flow: row nowrap;width: 100%" >
          <div>
            是否允许查看他人创建的单据：
            <Checkbox v-model="data.single"></Checkbox>
          </div>
        </div>
        <div style="flex-flow: row nowrap;width: 100%" >
          <div>
            是否允许提交他人创建的单据：
            <Checkbox v-model="data.singtwo"></Checkbox>
          </div>
        </div>
      </div>

    </Form>

</template>

<script>
  import {getcompany} from '@/api/system/systemSetting/staffManagenebt'
    export default {
        name: "addStaff",
        props:{
            data:''
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
                rules: {
                    userName: [
                        {required: true, message: '姓名不能为空', trigger: 'blur'}
                    ],
                    phone: [
                        { required: true,validator:validatePhone,trigger:'blur'}
                    ],
                    cardId:[
                        {required: true, message: '身份证号码不能为空', trigger: 'blur'}
                    ],
                    ground:[
                        {required: true,type:'array', message: '请选择部门', trigger: 'change'}
                    ]
                },
                costList:[
                    {name:'是',value:0},
                    {name:'否',value:1}
                ],
                businessList:[
                    {name:'是',value:0},
                    {name:'否',value:1}
                ],
                business:0,
                list:[], //公司信息
            }
        },
    mounted(){
      this.getList()
    },
    methods:{
            //获取公司
       async getList(){
           let data = {}
              data.groupId = this.$store.state.user.userData.tenantGroupId
           let res = await getcompany(data)
           if(res.code === 0){
               let list = []
               res.data.childs.forEach(item => {
                   if(item.childs.length > 0){
                    list.push({value: item.id ,label: item.name ,children:item.childs})
                   }else {
                       list.push({value: item.id ,label: item.name ,children:[]})
                   }
               })
                list.forEach( item => {
                    if(item.children.length > 0){
                        item.children.map( val => {
                           val.value = val.id
                           val.label = val.name
                           if(val.childs.length > 0){
                               val.children = val.childs
                               val.children.map( v => {
                                   v.value = v.id
                                   v.label = v.name
                               })
                           }else{
                               val.children = []
                           }
                        })
                    }
                })
               this.list = list
           }
        },
        resetFields() {
            this.$refs.form.resetFields()
        },
        changeEntryTime(data){
            this.data.entryTime = data
        },
        handleSubmit (callback) {
            this.$refs.form.validate(valid => {
                if (valid) {
                    callback && callback()
                } else {
                    this.$Message.error('信息填写错误');
                }
            })
        },
        changeBirthday(data){
            this.data.birthDay = data
        },
        //获取到公司
        selectGroust(value , selectedData){
            this.data.groundId = value[value.length - 1]
        }
    }
    }
</script>

<style scoped>

</style>
