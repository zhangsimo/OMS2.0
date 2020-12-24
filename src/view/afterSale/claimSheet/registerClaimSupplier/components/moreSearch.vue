<template>
  <Modal v-model="moreQueryShow" title="高级查询">
    <div class="box">
      <Form ref="formInline" :model="data" :label-width="100" @keydown.native.enter="suerQuery">
        <FormItem label="创建日期:">
          <DatePicker
            type="daterange"
            placeholder="选择日期"
            style="width: 350px"
            v-model="dateOne"
            @on-change="getCreatDate"
          ></DatePicker>
        </FormItem>
        <FormItem label="提交日期:">
          <DatePicker
            type="daterange"
            placeholder="选择日期"
            style="width: 350px"
            v-model="dateTwo"
            @on-change="getEnterDate"
          ></DatePicker>
        </FormItem>
        <FormItem label="供应商:">
          <Input
            v-model="data.guestName"
            placeholder="请输入供应商名称"
            style="width: 350px"
          />
        </FormItem>
        <FormItem label="理赔单号:">
          <Input
            v-model="data.serviceId"
            placeholder="请输入单号"
            style="width: 350px"
          />
        </FormItem>
        <FormItem label="配件编码:">
          <Input
            v-model="data.partCode"
            placeholder="请输入编码"
            style="width: 350px"
          />
        </FormItem>
        <FormItem label="配件内码:">
          <Input
            v-model="data.partInnerId"
            placeholder="请输入内码"
            style="width: 350px"
          />
        </FormItem>
        <FormItem label="配件名称:">
          <Input
            v-model="data.partName"
            placeholder="请输入配件名称"
            style="width: 350px"
          />
        </FormItem>
        <FormItem label="创建人:">
          <Input
            v-model="data.createUname"
            placeholder="请输入创建人名称"
            style="width: 350px"
          />
        </FormItem>
        <FormItem label="提交人:">
          <Input
            v-model="data.orderMen"
            placeholder="请输入创建人名称"
            style="width: 350px"
          />
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <Button type="primary" @click="suerQuery">确定</Button>
      <Button type="default" @click="moreQueryShow = false">取消</Button>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: "MoreQuery",
    props: {
      data: ""
    },
    data() {
      return {
        moreQueryShow: false, //模态框是否展示
        dateOne: "",
        dateTwo: "",
        salesList: []
      };
    },
    mounted() {},
    methods: {
      openModal() {
        this.moreQueryShow = true;
      },
      //获取创建时间
      getCreatDate(date) {
        if (date[0]) {
          this.data.createStartTime = date[0] + " " + "00:00:00";
          this.data.createEndTime = date[1] + " " + "23:59:59";
        } else {
          this.data.createStartTime = "";
          this.data.createEndTime = "";
        }
      },
      //获取提交时间
      getEnterDate(date) {
        if (date[0]) {
          this.data.orderStartDate = date[0] + " " + "00:00:00";
          this.data.orderEndDate = date[1] + " " + "23:59:59";
        } else {
          this.data.orderStartDate = "";
          this.data.orderEndDate = "";
        }
      },
      //确认
      suerQuery() {
        this.$emit("getSureQuery", {});
        this.moreQueryShow = false;
      }
    }
  };
</script>

<style scoped>
  .box >>> .ivu-form-item {
    margin-bottom: 8px;
  }
</style>
