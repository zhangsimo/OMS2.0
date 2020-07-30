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
        <FormItem label="入库日期:">
          <DatePicker
            type="daterange"
            placeholder="选择日期"
            style="width: 350px"
            v-model="dateTwo"
            @on-change="getEnterDate"
          ></DatePicker>
        </FormItem>
        <FormItem label="供应商:">
          <Select v-model="data.guestId" filterable style="width: 240px">
            <Option v-for="item in client" :value="item.id" :key="item.id">{{
              item.fullName
            }}</Option>
          </Select>
        </FormItem>
        <FormItem label="入库单号:">
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
        <FormItem label="配件名称:">
          <Input
            v-model="data.partName"
            placeholder="请输入配件名称"
            style="width: 350px"
          />
        </FormItem>
        <FormItem label="创建人:">
          <Select
            style="width: 350px"
            v-model="data.createUname"
            label-in-value
            filterable
          >
            <Option
              v-for="item in salesList"
              :value="item.label"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
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
// import {getClient} from '@/api/salesManagment/salesOrder'
import { getfindTypeList, getSupplierList } from "_api/purchasing/purchasePlan";
import { getSales } from "@/api/salesManagment/salesOrder";
export default {
  name: "MoreQuery",
  props: {
    data: ""
  },
  data() {
    return {
      moreQueryShow: false, //模态框是否展示
      client: [], //客户下拉框
      dateOne: "",
      dateTwo: "",
      salesList: []
    };
  },
  mounted() {},
  methods: {
    openModal() {
      this.getAllClient();
      this.getAllSales();
      // this.dateOne = "";
      // this.dateTwo = "";
      this.moreQueryShow = true;
    },
    //获取公司
    async getAllClient() {
      if(this.client.length > 0) return;
      let res = await getSupplierList({});
      if (res.code === 0) {
        this.client = res.data;
      }
    },
    //获取创建时间
    getCreatDate(date) {
      if (date[0]) {
        this.data.startTime = date[0] + " " + "00:00:00";
        this.data.endTime = date[1] + " " + "23:59:59";
      } else {
        this.data.startTime = "";
        this.data.endTime = "";
      }
    },
    //获取入库时间
    getEnterDate(date) {
      if (date[0]) {
        this.data.startEnterDate = date[0] + " " + "00:00:00";
        this.data.endEnterDate = date[1] + " " + "23:59:59";
      } else {
        this.data.startEnterDate = "";
        this.data.endEnterDate = "";
      }
    },
    //确认
    suerQuery() {
      this.$emit("getSureQuery", {});
      this.moreQueryShow = false;
    },
    async getAllSales() {
      if(this.salesList.length > 0) return;
      let res = await getSales();
      if (res.code === 0) {
        this.salesList = res.data.content;
        this.salesList.forEach(item => {
          item.label = item.userName;
          item.value = item.id;
        });
      }
    }
  }
};
</script>

<style scoped>
.box >>> .ivu-form-item {
  margin-bottom: 8px;
}
</style>
