<template>
  <Form :rules='rules' ref='form' :label-width="90" :model='data'>
    <FormItem label='姓名：'  prop='staffName'>
      <Input placeholder='请输入姓名' v-model='data.staffName'></Input>
    </FormItem>
    <FormItem label='用户名：' prop='username'>
      <Input placeholder='请输入账号' :disabled="disabled" v-model='data.username'></Input>
    </FormItem>
    <FormItem label='电子邮箱：' prop='staffEmail'>
      <Input placeholder='请输入邮箱' v-model='data.staffEmail'></Input>
    </FormItem>
<!--    <FormItem label='公司名称：' >-->
<!--      <i-select  style="width:200px" @on-change="changId">-->
<!--        <i-option v-for="(item, index) in company" :key="index" :value="item.id">{{ item.tenantCompanyName }}</i-option>-->
<!--      </i-select>-->
<!--    </FormItem>-->
<!--     <FormItem label='联系电话：'>
      <Input v-model='data.phone'></Input>
    </FormItem> -->
    <FormItem label='工作组：'>
      <Tree style="max-height: 400px;overflow-y: auto"
        ref="tree" :data='groupData' multiple children-key="childs" @on-select-change='selectChange'></Tree>
    </FormItem>
  </Form>
</template>
<script>
  import {isExisted} from '_api/admin/userApi'
  export default {
    props: {
      groupData: Array,
      data: Object,
      disabled: Boolean,
      company:Array
    },
    data () {
      const checkName = (rule, value, callback) => {
        if (this.disabled) {
          callback([])
          return
        }
        isExisted(value).then(res => {
          if (res.code) {
            callback(new Error('用户名已存在'))
          } else {
            callback([])
          }
        }).catch(err => {})
      }
      const checkEmail = (rule, value, callback) => {
        let reg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g
        if (!reg.test(value)) callback(new Error('邮箱不合法'))
      }
      return {
          model1:'',
        rules: {
          staffName: [
            {required:true, message:'姓名不能为空', trigger:'blur'}
          ],
          username: [
            {required: true, message:'用户名不能为空', trigger:'blur'},
            {validator: checkName, trigger: 'blur'}
          ],
          staffEmail: [
            // {required: true, message:'邮箱不能为空', trigger:'blur'},
            {type: 'email', message: '邮箱不合法', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
        changId(val){
            this.data.tenantId = val
        },
      handleSubmit (callback) {
        this.$refs.form.validate(valid => {
          if (valid) {
            callback && callback()
          }
        })
      },
      resetFields() {
        this.$refs.form.resetFields()
      },
      selectChange(rows) {
        this.data.groupIds = rows.map(item => item.id)
      }
    }
  }
</script>
<style scoped>
  .ivu-tree ul li {
    border-top: 1px solid #eee;
    padding-top: 10px;
  }
</style>
