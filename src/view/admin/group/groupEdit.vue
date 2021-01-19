<template>
  <Form :rules='rules' :label-width="80" ref='form' :model='data'>
    <FormItem label='上级组织:' prop="pId">
      <Select v-model="data.pId" :disabled="data.id==null||data.pId=='0'">
        <Option v-for="item in parentList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
    </FormItem>
    <FormItem label='组织名称:' prop='name'>
      <Input placeholder="请填写组织名称" v-model='data.name'></Input>
    </FormItem>
    <FormItem label='所属门店:'>
      <Select  v-model="data.orgId" clearable>
        <Option v-for="item in company" :value="item.id" :key="item.id">{{ item.shortName }}</Option>
      </Select>
    </FormItem>
  </Form>
</template>
<script>
  import {isExisted} from '_api/admin/groupApi'

  export default {
    props: {
      data: Object,
      parentName: String,
      company: '',
      parentList: ""
    },
    data() {
      const checkName = (rule, value, callback) => {
        if (this.disabled) {
          callback([])
          return
        }
      }
      return {
        rules: {
          name: [
            {required: true, message: '组织名称不能为空', trigger: 'blur'},
          ],
          pId: [
            {required: true, message: '上级组织不能为空', trigger: 'blur'},
          ]
        }
      }
    },
    mounted() {
    },
    methods: {
      parentIdChange(option){

      },
      changId(val) {
        this.data.tenantId = val
      },
      handleSubmit(callback) {
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
