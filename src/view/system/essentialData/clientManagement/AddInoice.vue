<template>
  <Form ref="form" :label-width="100" :model="data" :rules="rules">
    <FormItem label="开票名称:" prop="taxpayerName" v-if="meTit=='新增开票'">
      <Input v-model="data.taxpayerName" style="width: 300px"/>
    </FormItem>
    <FormItem label="开票名称:" prop="taxpayerName" v-else>
      <Input v-model="data.taxpayerName" disabled style="width: 300px"/>
    </FormItem>
    <FormItem label="税号:" prop="taxpayerCode" v-if="meTit=='新增开票'">
      <Input v-model="data.taxpayerCode" style="width: 300px"/>
    </FormItem>
    <FormItem label="税号:" prop="taxpayerCode"  v-else>
      <Input v-model="data.taxpayerCode" disabled style="width: 300px"/>
    </FormItem>
    <FormItem label="地址电话:" prop="taxpayerTel">
      <Input v-model="data.taxpayerTel" style="width: 300px"/>
    </FormItem>
    <FormItem label="开户银行:" prop="accountBankNo">
      <Input v-model="data.accountBankNo" style="width: 300px"/>
    </FormItem>
    <div style="paddingLeft:100px">
      <Checkbox v-model="data.taxpayerSign">是否为一般纳税人</Checkbox>
      <!--<input type="checkbox" v-model="data.taxpayerSign" name="taxpayerSign" id="taxpayerSign">-->
      <!--<label for="taxpayerSign">是否为一般纳税人</label>-->
    </div>
  </Form>
</template>

<script>
export default {
  name: "AddInoice",
  props: {
    data: "",
      meTit:''
  },
  data() {
    const paragraph = (rule, value, callback) => {
      if (value) {
        if (!/^[0-9a-zA-Z]+$/.test(value)) {
          callback(new Error("只能输入数字和字母"));
        } else {
          callback();
        }
      } else {
        callback(new Error("税号不能为空"));
      }
    };
    const taxpayerTel = (rule, value, callback) => {
      if (value) {
        if (!/^\d{1,}$/.test(value)) {
          callback(new Error("只能输入数字"));
        } else {
          callback();
        }
      } else {
        callback(new Error("电话不能为空"));
      }
    }
    return {
      rules: {
        taxpayerName: [{ required: true, message: "开票名称不能为空", trigger: "blur" }],
        taxpayerCode: [{ required: true, validator: paragraph, trigger: "blur" }],
        taxpayerTel: [{ required: true, message:"地址电话不能为空",trigger: "blur" }],
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
