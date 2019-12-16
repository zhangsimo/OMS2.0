<template>
  <Form :model="data" :label-width="140" ref="form" :rules="ruleValidate">
    <Row>
      <Col span="12">
        <FormItem label="仓库：">
          <Input v-model="wareHouse.name" style="width: 150px" disabled></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="仓位固定位：" prop="firstChar">
          <Input v-model="data.firstChar" style="width: 150px;margin-right: 10px"></Input>
          <span>示例:A-1-2</span>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="仓位流水起始号：" prop="startNum">
          <Input v-model="data.startNum" style="width: 150px"></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="仓位流水终止号：" prop="endNum">
          <Input v-model="data.endNum" style="width: 150px"></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="起始仓位：">
          <Input :value="start" style="width: 150px" disabled></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="终止仓位：">
          <Input :value="end" style="width: 150px" disabled></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="区域：">
          <Input v-model="data.area" style="width: 150px"></Input>
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>

<script>
export default {
  name: "AddNewWarehouse",
  props: {
    data: "",
    wareHouse: ""
  },
  data() {
    return {
      ruleValidate: {
        firstChar: [{ required: true, message: "必填不可为空", trigger: "blur"}],
        startNum: [
          { required: true, message: "必填大于0的正整数", trigger: "blur" }
        ],
        endNum: [
          { required: true, message: "必填大于0的正整数", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    start() {
      if (!this.data.firstChar || !this.data.startNum) {
        return;
      }
      return this.data.firstChar + "-" + this.data.startNum;
    },
    end() {
      if (!this.data.firstChar || !this.data.endNum) {
        return;
      }
      return this.data.firstChar + "-" + this.data.endNum;
    }
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
