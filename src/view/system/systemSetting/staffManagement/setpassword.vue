<template>
  <Form :label-width="100" :model='data' :rules='rules' ref="form">
    <FormItem label='姓名：' prop="userName">
      <Input placeholder='请输入姓名' v-model='data.userName' style="width: 250px" ></Input>
    </FormItem>
    <FormItem label='登录账号：' prop="account">
      <Input placeholder='请输入账号名称' v-model='data.account' style="width: 250px" ></Input>
    </FormItem>
    <FormItem label='默认密码：'>
      <Input placeholder='000000'  style="width: 250px" :disabled="true" ></Input>
    </FormItem>
  </Form>
</template>

<script>
    export default {
        name: "setpassword",
        props:{
            data:''
        },
        data(){
            return {
                rules:{
                    userName:[
                        {required: true, message: '姓名不能为空', trigger: 'blur'}
                    ],
                    account:[
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ]
                }
            }

        },
        methods:{
            resetFields() {
                this.$refs.form.resetFields()
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
        }
    }
</script>

<style scoped>

</style>
