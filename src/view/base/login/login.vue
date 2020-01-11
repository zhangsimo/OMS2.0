
<template>
  <GpartLoginPage @on-commit="commit">{{loginPageTitle}}</GpartLoginPage>
</template>

<script>
  import {mapActions} from 'vuex'
  import GpartLoginPage from '_c/login'

  export default {
    data () {
      return {
        loginPageTitle: '欢迎使用极配订单管理系统'
      }
    },
    components: {GpartLoginPage},
    methods: {
      ...mapActions([
        'handleLogin',
        'getUserInfo'
      ]),
      commit({username, password, errCallback}) {
        this.handleLogin({username, password}).then(res => {
          localStorage.setItem('username', username)
          this.getUserInfo(username).then(res => {
              let data = {}
                  data.tenantId = res.tenantId
                  data.shopId = res.shopId
                  data.shopkeeper = res.shopkeeper
          localStorage.setItem('oms2-userList' , JSON.stringify(data))
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
