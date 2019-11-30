<template>
  <Form :rules='rules' :label-width="80" ref='form' :model='data'>
    <FormItem label='所属组织:'>
      <Input type="text" disabled v-model='groupName'></Input>
    </FormItem>
    <FormItem label='名称:' prop='displayName'>
      <Input type="text" placeholder="请填写角色名称" v-model='data.displayName'></Input>
    </FormItem>
    <FormItem label='标识:' prop='name'>
      <Input type="text" placeholder="请填写角色标识" v-model='data.name'></Input>
    </FormItem>
    <FormItem label='资源:'>
      <Tree ref="resTree" :data='res' show-checkbox children-key="childs" @on-check-change='checkChange'></Tree>
    </FormItem>
  </Form>
</template>
<script>
  import {isExisted} from '_api/admin/roleApi'

  export default {
    data() {
      const checkDispalyName = (rule, value, callback) => {
        if (this.oDisplayname == value) {
          callback([])
          return
        }
        value = value.trim()
        isExisted(value).then(res => {
          if (res.code) {
            callback(new Error('角色名称已存在'))
          } else {
            callback([])
          }
        }).catch(err => {})
      }
      const checkName = (rule, value, callback) => {
        if (this.oname == value) {
          callback([])
          return
        }
        value = value.trim()
        isExisted(value).then(res => {
          if (res.code) {
            callback(new Error('角色标识已存在'))
          } else {
            callback([])
          }
        }).catch(err => {})
      }
      return {
        auth: [],
        rules: {
          displayName: [
            {required:true, message:'不能为空', trigger:'blur'},
            {max: 10, message:'最大长度15', trigger:'blur'},
            {validator: checkDispalyName, trigger: 'blur'}
          ],
          name: [
            {required:true, message:'不能为空', trigger:'blur'},
            {max: 50, message:'最大长度50', trigger:'blur'},
            {validator: checkName, trigger: 'blur'}
          ]
        },

      }
    },
    props: {
      groupName: String,
      res: Array,
      data: Object,
      oname: String,
      oDisplayname: String
    },
    mounted() {
    },
    methods: {
      checkChange() {
        let checkedIds = []
        let nodes = this.$refs.resTree.flatState
        nodes.map(item => {
          if (item.node.checked || item.node.indeterminate)
            checkedIds.push(item.node.id)
        })
        this.data.resIds = checkedIds
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
