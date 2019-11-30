<style lang="less">
  @import './login.less';
  @import './register.less';

</style>

<template>
  <div class="login flex" @keydown.enter="handleSubmit">
    <div class="login-left">
      <span>
        <img src="../../../assets/images/logo.png"/>
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
          <p class="title">欢迎注册</p>
          <p class="login-con-tit">
            <slot></slot>
          </p>
          <div class="form-con-inner">
            <Form ref="registerForm" :model="form" :rules="rules" inline>
              <FormItem prop="companyName" style="margin-bottom: 20px">
                <Input style="width: 300px" size="large" v-model="form.companyName" placeholder="请输入公司名称">

                </Input>
              </FormItem>
              <FormItem prop="mobile" style="margin-bottom: 20px">
                <Input style="width: 300px" size="large" v-model="form.mobile"  placeholder="手机号码">

                </Input>
              </FormItem>
               <FormItem  style="margin-bottom: 20px">
                <Input style="width: 140px" size="large" v-model="form.username"  placeholder="请输入验证码"></Input>
                <div class="fr ml10"> <a href="javascript:void(0)" @click="getCo"><span style="color: white!important;cursor: pointer;">获取验证码</span></a> </div>
              </FormItem>
               <FormItem prop="username" style="margin-bottom: 20px">
                <Select  clearable style="width:300px" size="large" v-model="modell">
                  <Option v-for="item in type" :value="item.dictCode" :key="item.dictCode">{{ item.dictName }}</Option>
                </Select>
              </FormItem>
              <Row>
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" class="flex zzzz">
                  <FormItem prop="province">
                    <Select v-model="formValidate.province" placeholder="请选择省份" style="width: 142px;height: 38px;" class="mr5 plh">
                      <Option v-for="item in provinceArr" v-if="item.parentId==0" :key="item.id" :value="item.id" >{{ item.name}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem prop="city">
                    <Select v-model="formValidate.city" placeholder="请选择城市" style="width: 142px;height: 38px!important;" class="mr10">
                      <Option v-for="item in provinceArr" v-if="formValidate.province==item.parentId" :key="item.id" :value="item.id" >{{ item.name}}</Option>
                    </Select>
                  </FormItem>
                </Form>
              </Row>
                <div class="flex mt15">
                  <div style="color: #7c1c1a">
                  注册即同意
                  </div>
                  <div class="ml20">
                    <a href="javascript:void(0)"><span style="color: white!important;cursor: pointer;">隐私政策/用户协议</span></a>
                  </div>

                </div>
              <FormItem>
                <Button style="width: 300px" @click="registerA" size="large" :loading="loading" class="login-con-submit mt10" long>注册</Button>
              </FormItem>
              <div class="flex">
                    <div class="ml5" style="color: #7c1c1a">已有账号?</div>
                    <div class="ml20">
                      <a href="javascript:void(0)" @click="goLogin" ><span style="color: white!important;cursor: pointer;font-size: 16px">登录</span></a>
                    </div>
                  </div>

            </Form>
          </div>
        </div>
        <p class="login-right-tip">不卖假件<i>·</i>不用假件</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { sendMessage , findByDynamicQuery ,findByDictCode ,register} from '../../../api/lease/registerLogin'
  // import { getCode } from './register'
  // import SlideValidate from './slide-validate'
  import Message from '_c/message'

  export default {
    name: 'gpart-login-page',
    components: {},
    data () {
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
        formValidate: {},//省份城市
        provinceArr: [],//省市
        ruleValidate:{},
        //公司类型下拉框数组
        company:[],
        //省下拉框
        province :[],
        //市下拉框
        city:[],
        form: {
          companyName: '',
          mobile: '',
        },
         rules: {
                companyName: [
                    {required: true, message: '公司名称不能为空', trigger: ['blur','change']}
                ],
                mobile: [
                    { required: true,validator:validatePhone,trigger:['blur', 'change']}
                ],
                code: [
                    { required: true,trigger:['blur', 'change']}
                ]
            },
        single:false,
        loading:false,
        type: [],//类型
        modell:'', //下拉框
      }
    },
    methods: {
      //获取验证码
      getCo() {
        let tel = {}
        tel.mobile =this.form.mobile
        // console.log(this.form.mobile)
        sendMessage(tel).then(res => {
          // console.log(res)
        })
      },
      //已有账号去登录
      goLogin() {
        this.$router.push("/login")
      },
      register() {
        this.$router.push("/register")
      },
      handleSubmit () {
        this.form.username = this.form.username.trim()
        this.loading = true
        this.$refs.registerForm.validate((valid) => {
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
      },
      // 省份城市
      citya(){
        let params = {}
        findByDynamicQuery(params).then(res => {
          // console.log(res)
          if(res.code === 0){
            this.provinceArr = res.data
          }
        })
      },
      //数据字典
      findBy(){
        findByDictCode().then(res => {
          if(res.code === 0){
            this.type = res.data
            // console.log(this.type)
          }
        })
      },
      //注册
      registerA(){
        let formData = new FormData();
        formData.append('companyName', this.form.companyName);
        formData.append('mobile', this.form.mobile);
        formData.append('code', this.form.username);
        formData.append('type', this.modell);
        formData.append('provinceId', this.formValidate.province);
        formData.append('cityId', this.formValidate.city);

        // console.log(formData);
        register(formData).then(res => {
            if(res.code === 0){
              this.$Message.success('注册成功')
             this.$router.push("/login")
            }
        })
      }
    },
    mounted(){
      this.citya()
      this.findBy()
    }
  }
</script>

<style scoped>
  .zzzz >>> .ivu-select-single .ivu-select-selection{
    height: 38px!important;
  }
  .zzzz >>> .ivu-select-single .ivu-select-selection .ivu-select-placeholder{
    height: 38px!important;
    line-height: 38px;
  }
  .zzzz >>> .ivu-form-item{
    margin-bottom: 0!important;
  }
</style>
