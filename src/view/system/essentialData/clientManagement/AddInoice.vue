<template>
    <Form ref="form" :label-width="100" :model='data' >
      <FormItem label='开票名称:' >
        <Input v-model='data.taxpayerName' style="width: 300px" ></Input>
      </FormItem>
      <FormItem label='税号:'  >
        <Input v-model='data.taxpayerCode' style="width: 300px" ></Input>
      </FormItem>
      <FormItem label='地址电话:' >
        <Input v-model='data.taxpayerTel' style="width: 300px" ></Input>
      </FormItem>
      <FormItem label='开户银行:' >
        <Input v-model='data.accountBankNo' style="width: 300px" ></Input>
      </FormItem>
    </Form>
</template>

<script>
    export default {
        name: "AddInoice",
        props:{
            data:''
        },
        data(){
            return {
                // rules:{
                //    name: [
                //        {required: true, message: '姓名不能为空', trigger: 'blur'}
                //    ],
                //     duty:[
                //         {required: true, message: '税号不能为空', trigger: 'blur'}
                //     ],
                //     tel:[
                //         {required: true, message: '电话不能为空', trigger: 'blur'}
                //     ],
                //     bank:[
                //         {required: true, message: '开户行不能为空', trigger: 'blur'}
                //     ]
                // }
            }
        },
        methods:{
            resetFields() {
                this.$refs.form.resetFields()
            },
            handleSubmit (callback) {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        callback && callback()
                    } else {
                        this.$Message.error('信息填写错误');
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>
