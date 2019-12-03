<template>
  <Form :rules='ruleValidate' ref='form' :label-width="90" :model='data'>
    <FormItem label='租户名称：' prop='userName'>
      <Input placeholder='请输入租户名称' v-model='data.userName'></Input>
    </FormItem>
    <FormItem label='备注：' prop='remark'>
      <Input placeholder='请输备注' :disabled="disabled" v-model='data.remark'></Input>
    </FormItem>
  </Form>
</template>
<script>
    export default {
        props: {
            groupData: Array,
            data: '',
            disabled: Boolean
        },
        data () {
            return {
                ruleValidate: {
                    userName: [
                        {required:true, message:'租户名称不能为空', trigger:'blur'}
                    ],
                }
            }
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
