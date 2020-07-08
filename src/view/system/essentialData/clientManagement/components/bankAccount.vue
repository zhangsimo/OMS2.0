<template>
  <Form ref="form" :label-width="100" :model="data" :rules="rules">
    <FormItem label="收款户名:" prop="accountName">
      <Input v-model="data.accountName" style="width: 300px" />
    </FormItem>
    <FormItem label="银行卡号:" prop="accountBankNo">
      <Input v-model="data.accountBankNo" style="width: 300px" />
    </FormItem>
    <FormItem label="开户银行:" prop="accountBank">
      <Input v-model="data.accountBank" style="width: 300px" />
    </FormItem>
    <FormItem label="账户类型:">
      <Select filterable v-model="data.accountType" style="width:180px" class="mr10">
        <Option
          v-for="item in listTree"
          :key="item.itemCode"
          :value="item.itemCode"
        >{{ item.itemName}}</Option>
      </Select>
    </FormItem>
  </Form>
</template>

<script>
  import {getAccountType} from "@/api/system/essentialData/clientManagement"
export default {
  name: "bankAccount",
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
        accountName: [{ required: true, message: "收款户名不能为空", trigger: "blur" }],
        accountBankNo: [{ required: true, validator: paragraph, trigger: "blur" }],
        accountBank: [{ required: true, message: "开户银行不能为空", trigger: "blur" }]
      },
      listTree: []
    };
  },
  mounted() {
    this.getAccountTypeList()
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
    },
    getAccountTypeList(){
      getAccountType().then(res=>{
        if(res.code===0){
          this.listTree=res.data
        }
      })
    }
  }
};
</script>

<style scoped>
</style>
