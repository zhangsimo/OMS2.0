<template>
  <Form :label-width="100" :model='data' :rules='rules' ref="form">
    <FormItem label='姓名：' prop="userName">
      <Input placeholder='请输入姓名' v-model='data.userName' disabled style="width: 250px" ></Input>
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
          let account = (rule, value, callback) => {
            if (!value) {
              callback(new Error("登录账号只能输入长度大于2位的字母或数字"));
            } else {
              const reg = /^[a-zA-Z0-9]{2,}$/
              if (reg.test(value)) {
                callback();
              } else {
                callback(new Error("登录账号只能输入长度大于2位的字母或数字"));

              }
            }
          };
            return {
                rules:{
                    userName:[
                        {required: true, message: '姓名不能为空', trigger: 'blur'}
                    ],
                    account:[
                        {required: true,  validator: account, trigger: 'blur'}
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
