<template>
  <Form ref="form" :label-width="100" :model="data" :rules="rules">
    <FormItem label="人员名称:" prop="name">
      <Input v-model="data.name" style="width: 300px" />
    </FormItem>
    <FormItem label="收款户名:" prop="accountName">
      <Input v-model="data.accountName" style="width: 300px" />
    </FormItem>
    <FormItem label="银行卡号:" prop="accountNumber">
      <Input v-model="data.accountNumber" style="width: 300px" />
    </FormItem>
    <FormItem label="开户银行:" prop="accountBank">
      <Input v-model="data.accountBank" style="width: 300px" />
    </FormItem>
  </Form>
</template>

<script>
  export default {
    name: "addOutStaff",
    data() {
      const paragraph = (rule, value, callback) => {
        if (value) {
          if (!/^[0-9]+$/.test(value)) {
            callback(new Error("只能输入数字"));
          } else {
            callback();
          }
        } else {
          callback(new Error("银行卡号不能为空"));
        }
      };
      return {
        data: {},
        rules: {
          name: [{ required: true, message: "人员名称不能为空", trigger: "blur" }],
          accountName: [{ required: true, message: "收款户名不能为空", trigger: "blur" }],
          accountNumber: [{ required: true, validator: paragraph, trigger: "blur" }],
          accountBank: [{ required: true, message: "开户银行不能为空", trigger: "blur" }]
        }
      };
    },
    methods: {
      resetFields() {
        this.$refs.form.resetFields();
      },
      handleSubmit(callback) {
        this.$refs.form.validate(valid => {
          if (valid) {
            callback && callback();
          } else {
            this.$Message.error("信息填写错误");
          }
        });
      }
    }
  };
</script>

<style scoped>
</style>
