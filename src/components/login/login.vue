<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login flex" @keydown.enter="handleSubmit">
    <div class="login-left">
      <span>
        <img src="../../assets/images/logo.png"/>
        <em>不·卖·假·件</em>
      </span>
      <strong class="login-left-tip">
        科技<i>·</i>互联<i>·</i>效率
      </strong>
    </div>
    <div class="login-right">
      <p class="login-right-top"><a href="javascript:void(0)" @click="register">点击注册</a><a href="javascript:void(0)">设为首页</a><a href="javascript:void(0)" @click="addFavorite">加入收藏</a>
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
              <FormItem prop="username" style="margin-bottom: 20px">
                <Input v-model="form.username" :class="{nodata:!form.username}" placeholder="请输入用户名">
                <span slot="prepend">
                      <Icon :size="16" type="person"></Icon>
                    </span>
                </Input>
              </FormItem>
              <FormItem prop="password" class="mb0">
                <Input type="password" :class="{nodata:!form.password}" v-model="form.password" placeholder="请输入密码">
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
                <Button @click="handleSubmit" size="large" :loading="loading" class="login-con-submit" long>登录</Button>
              </FormItem>
            </Form>
            <!--<login-form @on-success-valid="handleSubmit"></login-form>-->
          </div>
        </div>
        <p class="login-right-tip">不卖假件<i>·</i>不用假件</p>
      </div>
    </div>
  </div>
</template>

<script>
  import SlideValidate from './slide-validate'
  import Message from '../message'

  export default {
    name: 'gpart-login-page',
    components: {SlideValidate},
    data () {
      return {
        form: {
          username: localStorage.getItem('username') || '',
          password: ''
        },
        rules: {
          username: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        },
        single:false,
        loading:false
      }
    },
    methods: {
      register() {
        this.$router.push("/register")
      },
      handleSubmit () {
        this.form.username = this.form.username.trim()
        this.loading = true
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            let username = this.form.username
            let password = this.form.password
            this.$emit('on-commit', {username, password, errCallback: this.errCallback})
          } else {
            this.loading = false
          }
        })
      },
      errCallback() {
        this.loading = false
      },
      addFavorite() {
        var url = window.location;
        var title = document.title;
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("msie 8") > -1) {
          external.AddToFavoritesBar(url, title, '');//IE8
        } else {
          try {
            window.external.addFavorite(url, title);
          } catch (e) {
            try {
              window.sidebar.addPanel(title, url, "");//firefox
            } catch (e) {
              alert("加入收藏失败，请使用Ctrl+D进行添加");
            }
          }
        }
      },
      setHome() {
        const obj = this
        const vrl = window.location
        try {
          obj.style.behavior = 'url(#default#homepage)';
          obj.setHomePage(vrl);
        }
        catch (e) {
          if (window.netscape) {
            try {
              netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            }
            catch (e) {
              alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");
            }
            var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
            prefs.setCharPref('browser.startup.homepage', vrl);
          }
        }
      }

    }
  }
</script>

<style>

</style>
