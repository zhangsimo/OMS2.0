<template>
  <Form :label-width="100" :model='data' :rules='rules' ref="form">
    <FormItem label='姓名：' prop="userName">
      <Input placeholder='请输入姓名' v-model='data.userName' disabled style="width: 300px"></Input>
    </FormItem>
    <FormItem label='账号前缀：' prop="account">
      <Input placeholder='请输入账号前缀' v-model='data.account' style="width: 300px" :disabled="userShow"></Input>
    </FormItem>
    <FormItem label='登录账号：'>
      <Input v-model='prefix' style="width: 300px" disabled></Input>
    </FormItem>
  </Form>
</template>

<script>
  export default {
    name: "setpassword",
    props: {
      data: ''
    },
    data() {
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
        userShow: false,//
        rules: {
          userName: [
            {required: true, message: '姓名不能为空', trigger: 'blur'}
          ],
          account: [
            // {required: true, validator: account, trigger: 'blur'},
            {required: true, trigger: 'blur'},
          ]
        }

      }

    },
    computed:{
      prefix(){
        let currentCompany=this.$store.state.user.userData
        if(currentCompany!=null){
          return `${this.data.account==undefined?"":this.data.account}@${currentCompany.domain}${currentCompany.prefix}`;
        }else{
          return `${this.data.account}`
        }
      }
    },
    methods: {
      //打开的时候
      open() {
        this.userShow = false
        if (this.data.openSystem == 0) {
          this.userShow = true
          this.data.account = this.data.loginName
        }

      },
      resetFields() {
        this.$refs.form.resetFields()
      },
      handleSubmit(callback) {
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
