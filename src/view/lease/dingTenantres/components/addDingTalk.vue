<template>
  <Form ref="form" :label-width="100" :model="data" :rules="rules">
    <FormItem label="名称:" prop="name">
      <Select v-model="data.name" style="width:180px" label-in-value class="mr10" @on-change="changeName">
        <Option
          v-for="item in typeList"
          :value="item.name"
          :key="item.value"
          :disabled="item.disable"
        >{{item.name}}</Option>
      </Select>
    </FormItem>
    <FormItem label="类型:">
      <Input v-model="data.type" style="width: 180px" readonly/>
    </FormItem>
    <FormItem label="code:" prop="code">
      <Input v-model="data.code" style="width: 180px"/>
    </FormItem>
    <div style="paddingLeft:100px">
      <Checkbox v-model="data.disabled">启用</Checkbox>
    </div>
  </Form>
</template>

<script>
  import * as Api from "_api/lease/tenantres";

  export default {
    name: "AddDingTalk",
    props: ['data'],
    data() {
      return {
        rules: {
          name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
          code: [{ required: true, message:"code不能为空",trigger: "blur" }]
        },
        typeList:[],
        typeListzanshi:[]
      };
    },
    mounted() {
      this.getTypeList()
    },
    methods: {
      //获取类型
      async getTypeList(){
        let res=await Api.getTypeList();
        if(res.code===0){
          this.typeListzanshi=res.data
          this.typeList=res.data
        }
      },
      changeName(option){
        this.data.name=option.value?option.value:"";
        this.typeList.map(el=>{
          if(option.value&&el.name==option.value){
            this.data.type=el.value;
          }
        })
      },
      resetFields() {
        this.data.type="";
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
