<template>
  <Form ref="form" :label-width="100" :model="data" :rules="rules">
    <FormItem label="开票名称:" prop="taxpayerName">
      <Input v-model="data.taxpayerName" style="width: 300px"/>
    </FormItem>
    <FormItem label="税号:" prop="taxpayerCode">
      <Input v-model="data.taxpayerCode" style="width: 300px"/>
    </FormItem>
    <FormItem label="地址电话:" prop="taxpayerTel">
      <Input v-model="data.taxpayerTel" style="width: 300px"/>
    </FormItem>
    <FormItem label="开户银行:" prop="accountBankNo">
      <Input v-model="data.accountBankNo" style="width: 300px"/>
    </FormItem>
  </Form>
</template>

<script>
export default {
  name: "AddInoice",
  props: {
    data: ""
  },
  data() {
    return {
      rules: {
        taxpayerName: [{ required: true, message: "开票名称不能为空", trigger: "blur" }],
        taxpayerCode: [{ required: true, message: "税号不能为空", trigger: "blur" }],
        taxpayerTel: [{ required: true, message: "电话不能为空", trigger: "blur" }],
        accountBankNo: [{ required: true, message: "开户行不能为空", trigger: "blur" }]
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
