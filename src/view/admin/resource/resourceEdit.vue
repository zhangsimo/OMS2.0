<template>
    <Form :rules='rules' :label-width="80" ref='form' :model='data'>
      <FormItem label='上级资源:'>
        <Input disabled v-model='parentName' ></Input>
      </FormItem>
      <FormItem label='类型:' prop='type'>
        <Select v-model="data.resType">
          <Option value="0" key="0">菜单</Option>
          <Option value="1" key="1">按钮</Option>
        </Select>
      </FormItem>
      <FormItem label='名称:' prop='displayName'>
        <Input placeholder="请填写资源名称" v-model='data.displayName' ></Input>
      </FormItem>
      <FormItem label='标识:' prop='name'>
        <Input placeholder="请填写资源标识" v-model='data.name' ></Input>
      </FormItem>
      <FormItem label='链接:' prop='urlMatcher'>
        <Input placeholder="请填写资源链接" v-model='data.urlMatcher' ></Input>
      </FormItem>
      <FormItem label='排序:' prop='urlMatcher'>
        <InputNumber :min="1" :max="999" v-model='data.displayOrder'></InputNumber>
      </FormItem>
    </Form>
</template>
<script>
  import { isExisted } from '_api/admin/resourceApi'
  export default {
    props: {
      data: Object,
      parentName: String,
      name: String
    },
    data () {
      const checkName = (rule, value, callback) => {
        if (this.name == value) {
          callback([])
          return
        }
        value = value.trim()
        isExisted(value).then(res => {
          if (res.code) {
            callback(new Error('资源标识已存在'))
          } else {
            callback([])
          }
        }).catch(err => {})
      }
      return {
        rules: {
          displayName: [
            {required:true, message:'不能为空', trigger:'blur'},
            {max: 10, message:'最大长度10', trigger:'blur'}
          ],
          name: [
            {required:true, message:'不能为空', trigger:'blur'},
            {max: 50, message:'最大长度50', trigger:'blur'},
            {validator: checkName, trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
    },
    methods: {
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
