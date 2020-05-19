<template>
    <Form :rules='rules' :label-width="80" ref='form' :model='data'>
      <FormItem label='上级组织:'>
        <Input disabled v-model='parentName' ></Input>
      </FormItem>
      <FormItem label='组织名称:' prop='name'>
        <Input placeholder="请填写组织名称" v-model='data.name' ></Input>
      </FormItem>
<!--      <FormItem label='公司名称：' >-->
<!--        <i-select  style="width:200px" @on-change="changId">-->
<!--          <i-option v-for="item in company" :value="item.id">{{ item.tenantCompanyName }}</i-option>-->
<!--        </i-select>-->
<!--      </FormItem>-->
    </Form>
</template>
<script>
  import { isExisted } from '_api/admin/groupApi'

  export default {
    props: {
      data: Object,
      parentName: String,
      company:'',
    },
    data () {
      const checkName = (rule, value, callback) => {
        if (this.disabled) {
          callback([])
          return
        }
      }
      return {
        rules: {
          name: [
            {required:true, message:'组织名称不能为空', trigger:'blur'},
          ]
        }
      }
    },
    mounted () {
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
      }
    }
  }
</script>
