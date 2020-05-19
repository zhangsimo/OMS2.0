<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :src="userAvator"/>
      <span>您好，{{userData.staffName}}</span>
      <Icon :size="12" type="arrow-down-b"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="changePwd">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal v-model="show" width="400" :mask-closable="false" :closable="false" title="修改密码">
      <Form :rules='rules' :label-width="80" ref='form' :model='data'>
        <FormItem label='原密码:' prop='oldPwd'>
          <Input type="password" placeholder="原密码" v-model='data.oldPwd'></Input>
        </FormItem>
        <FormItem label='新密码:' prop='newPwd'>
          <Input type="password" placeholder="新密码" v-model='data.newPwd'></Input>
        </FormItem>
        <FormItem label='确认密码:' prop='newPwd2'>
          <Input type="password" placeholder="确认密码" v-model='data.newPwd2'></Input>
        </FormItem>
      </Form>
      <div slot='footer'>
        <Button type='text' @click='cancel'>取消</Button>
        <Button type='primary' @click='changePwdClick'>确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'

export default {
  name: 'User',
  data() {
    const checkPwd = (rule, value, callback) => {
      value = value.trim()
      if (value != this.data.newPwd) {
        callback(new Error('确认密码和新密码不一致'))
      } else {
        callback([])
      }
    }

    return {
      show: false,
      data: {
        oldPwd: '',
        newPwd: '',
        newPwd2: ''
      },
      rules: {
        oldPwd: [
          {required:true, message:'不能为空', trigger:'blur'}
        ],
        newPwd: [
          {required:true, message:'不能为空', trigger:'blur'},
          {min: 6, message:'最小长度6', trigger:'blur'},
          {max: 16, message:'最大长度16', trigger:'blur'}
        ],
        newPwd2: [
          {required:true, message:'不能为空', trigger:'blur'},
          {min: 6, message:'最小长度6', trigger:'blur'},
          {max: 16, message:'最大长度16', trigger:'blur'},
          {validator: checkPwd, trigger: 'blur'}
        ]
      }
    }
  },
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    userData: Object
  },
  methods: {
    ...mapActions([
      'handleLogOut', 'changePwd'
    ]),
    cancel() {
      this.show = false
      this.$refs.form.resetFields()
    },
    changePwdClick() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let oldPwd = this.data.oldPwd.trim()
          let newPwd = this.data.newPwd.trim()
          this.changePwd({oldPwd, newPwd}).then((res) => {
            if (res.code == 0) {
              this.$Message.success(res.message)
              this.cancel()
            }
          })
        }
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout':
          this.handleLogOut().then(() => {
            this.$router.push({
              name: 'login'
            })
          })
          break
        case 'changePwd':
          this.show = true
          break
      }
    }
  }
}
</script>
