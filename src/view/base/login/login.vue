
<template>
  <GpartLoginPage @on-commit="commit">{{loginPageTitle}}</GpartLoginPage>
</template>

<script>
import { mapActions } from "vuex";
import GpartLoginPage from "_c/login";
import systemUri from "_conf/systemUri";
import { loginSystem } from "_api/base/user";
import secret from "../../../utils/secret"
export default {
  data() {
    return {
      loginPageTitle: "欢迎使用极配订单管理系统"
    };
  },
  components: { GpartLoginPage },
  methods: {
    ...mapActions(["handleLogin", "getUserInfo"]),
    commit({ username, password, scope, errCallback }) {
      switch (scope) {
        case "wms":
          // systemUri
          loginSystem({ uri: systemUri.wmsTokenApi, username, password }).then(
            res => {
              if (res.code == 0) {
                // systemUri.wms = 'http://192.168.30.129:8088'
                let up = secret.encrypt(`username=${username}&password=${password}`);
                const uri =
                  systemUri.wms + `?up=${up}`;
                location.href = uri;
              }
            }
          ).catch(err => {
            errCallback && errCallback();
          });
          break;
          // case 'tax':
        case "oms":
        default:
          this.handleLogin({ username, password })
            .then(res => {
              localStorage.setItem("username", username);
              this.getUserInfo(username).then(res => {
                let data = {};
                data.tenantId = res.currentCompany ? res.currentCompany.tenantId ?res.currentCompany.tenantId : '' : ''
                data.shopId = res.currentCompany ? res.currentCompany.id ?res.currentCompany.id : '' : ''
                data.shopkeeper = res.shopkeeper;
                localStorage.setItem("oms2-userList", JSON.stringify(data));
                // this.$router.go(-1)
                this.$router.push({
                  name: "home"
                });
              });
            })
            .catch(err => {
              errCallback && errCallback();
            });
          break;
      }
    }
  }
};
</script>
