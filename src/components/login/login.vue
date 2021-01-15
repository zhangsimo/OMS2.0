<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login flex" @keydown.enter="handleSubmit">
    <div class="login-left">
      <span>
        <img src="../../assets/images/logo.png" />
        <em>不·卖·假·件</em>
      </span>
      <strong class="login-left-tip">
        科技
        <i>·</i>互联
        <i>·</i>效率
      </strong>
    </div>
    <div class="login-right">
      <p class="login-right-top">
        <a href="javascript:void(0)" @click="register">点击注册</a>
<!--        <a href="javascript:void(0)" @click="setHomePage">设为首页</a>-->
        <a href="javascript:void(0)" @click="addFavorite">加入收藏</a>
      </p>
      <div class="login-con">
        <h3 class="login-con-header">极配正品</h3>
        <div class="form-con">
          <p class="login-con-icon"></p>
          <p class="login-con-tit">
            <slot></slot>
          </p>
          <div class="form-con-inner">
            <Form ref="loginForm" :model="form" :rules="rules">
              <FormItem class="mb30">
                <Select v-model="form.scope">
                  <Option
                    v-for="item in accountTypeList"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
              <FormItem prop="username" class="mb30">
                <Input
                  v-model="form.username"
                  :class="{nodata:!form.username}"
                  placeholder="请输入用户名"
                >
                  <span slot="prepend">
                    <Icon :size="16" type="person"></Icon>
                  </span>
                </Input>
              </FormItem>
              <FormItem prop="password" class="mb0">
                <Input
                  type="password"
                  :class="{nodata:!form.password}"
                  v-model="form.password"
                  placeholder="请输入密码"
                >
                  <span slot="prepend">
                    <Icon :size="14" type="locked"></Icon>
                  </span>
                </Input>
              </FormItem>
              <div class="pt15 pb20 login-tip flex just-s">
                <!--<Checkbox v-model="single">十天内免登陆</Checkbox>-->
                <!--<a href="#">忘记密码</a>-->
              </div>
              <!--<FormItem>-->
              <!--<SlideValidate></SlideValidate>-->
              <!--</FormItem>-->
              <FormItem>
                <Button
                  @click="handleSubmit"
                  size="large"
                  :loading="loading"
                  class="login-con-submit"
                  long
                >登录</Button>
              </FormItem>
            </Form>
            <!--<login-form @on-success-valid="handleSubmit"></login-form>-->
          </div>
        </div>
        <p class="login-right-tip">
          不卖假件
          <i>·</i>不用假件
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import SlideValidate from "./slide-validate";
import Message from "../message";

export default {
  name: "gpart-login-page",
  components: { SlideValidate },
  data() {
    return {
      accountTypeList: [
        { label: "oms", value: "oms" },
        { label: "wms", value: "wms" },
        { label: "auth", value: "auth" },
        // { label: "tax", value: "tax" },
      ],
      form: {
        username: localStorage.getItem("username") || "",
        password: "",
        scope: "oms"
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      },
      single: false,
      loading: false
    };
  },
  methods: {
    register() {
      this.$router.push("/register");
    },
    handleSubmit() {
      this.form.username = this.form.username.trim();
      this.loading = true;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          let username = this.form.username;
          let password = this.form.password;
          if (password == '000000'){
            this.$store.commit('setChangePassword' , true)
          } else {
            this.$store.commit('setChangePassword' , false)
          }
          let scope = this.form.scope;
          localStorage.setItem("userScope", scope);
          this.$emit("on-commit", {
            username,
            password,
            scope,
            errCallback: this.errCallback
          });
        } else {
          this.loading = false;
        }
      });
    },
    errCallback() {
      this.loading = false;
    },
    addFavorite() {
        var url = window.location;
        var title = document.title;
        var ua = navigator.userAgent.toLowerCase();
      try
      {
        window.external.addFavorite(url, title);
      }
      catch (e)
      {
        try
        {
          window.sidebar.addPanel(title, url, "");
        }
        catch (e)
        {
          alert("收藏失败，此操作被浏览器拒绝！\n请使用Ctrl+D进行收藏！");
        }
      }
    },
    setHomePage() {
        var url = window.location.href;
        var o = document.body;
        try {
            o.style.behavior = 'url(#default#homepage)';
            o.setHomePage(url);
        } catch (e) {
            if (window.sidebar) {
                if (window.netscape) {
                    try {
                        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                    } catch (e) {
                        alert("抱歉！您的浏览器不支持直接设为首页。请在浏览器地址栏输入'about:config'并回车然后将[signed.applets.codebase_principal_support]设置为'true'，点击'加入收藏'后忽略安全提示，即可设置成功。");
                    }
                    var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
                    prefs.setCharPref('browser.startup.homepage', url);
                }
            } else {
                alert("抱歉！您的浏览器不支持直接设为首页。");
            }
        }
    }
  }
};
</script>
<style>
</style>
