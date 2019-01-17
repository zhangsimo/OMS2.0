
<template>
  <GpartLoginPage @on-commit="commit">{{loginPageTitle}}</GpartLoginPage>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    data () {
      return {
        loginPageTitle: '欢迎使用极配订单管理系统'
      }
    },
    methods: {
      ...mapActions([
        'handleLogin',
        'getUserInfo'
      ]),
      commit({username, password, errCallback}) {
        this.handleLogin({username, password}).then(res => {
          localStorage.setItem('username', username)
          this.getUserInfo(username).then(res => {
            this.$router.push({
              name: 'home'
            })
          })
        }).catch(err => {
          errCallback && errCallback()
        })
      }
    }
  }
</script>
