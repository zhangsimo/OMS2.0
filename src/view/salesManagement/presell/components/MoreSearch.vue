<template>
  <Modal v-model="moreQueryShow" title="高级查询">
    <div class="box">
      <Form ref="formInline" :model="data" :label-width="100" @keydown.native.enter="getMoreSearch">
        <FormItem label="创建日期:">
          <DatePicker
            type="daterange"
            v-model="data.start"
            :editable="false"
            @on-change="getCreatDate"
            placement="bottom"
            placeholder="选择日期"
            style="width: 350px"
          ></DatePicker>
        </FormItem>
        <FormItem label="提交日期:">
          <DatePicker
            type="daterange"
            v-model="data.end"
            :editable="false"
            @on-change="getSubmitDate"
            placement="bottom"
            placeholder="选择日期"
            style="width: 350px"
          ></DatePicker>
        </FormItem>
        <FormItem label="客户:">
          <Select
            v-model="data.guestId"
            filterable
            style="width: 350px"
            placeholder="请输入公司全称"
            remote
            :remote-method="getAllClient"
            :loading="loading">
            <Option v-for="(item, index) in clientList" :value="item.id" :key="index">{{item.fullName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="预售单号:">
          <Input
            v-model="data.serviceId"
            maxlength="100"
            :rows="4"
            show-word-limit
            type="textarea"
            placeholder="请输入预售单号"
            style="width: 350px"
          />
        </FormItem>
        <FormItem label="配件编码:">
          <Input
            v-model="data.partCode"
            maxlength="100"
            :rows="4"
            show-word-limit
            type="textarea"
            placeholder="请输入配件编码"
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
        <!--<FormItem label="创建人:">-->
        <!--<Input v-model="data.createUname"    placeholder="请输入创建人" style="width: 350px" />-->
        <!--</FormItem>-->
        <!--<FormItem label="提交人:">-->
        <!--<Input v-model="data.commitUname"    placeholder="请输入提交人" style="width: 350px" />-->
        <!--</FormItem>-->

        <FormItem label="提交人: ">
          <Select
            v-model="data.commitUname"
            class="w350"
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
        <FormItem label="创建人: ">
          <Select
            v-model="data.createUname"
            class="w350"
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
      <Button type="primary" @click="getMoreSearch">确定</Button>
      <Button type="default" @click="moreQueryShow = false">取消</Button>
    </div>
  </Modal>
</template>

<script>
import { getClient } from "_api/salesManagment/presell.js";
import { getSales, getTreeClient } from "@/api/salesManagment/salesOrder";
import * as tools from "../../../../utils/tools";
export default {
  name: "MoreSearh",
  props: {
    data: ""
  },
  data() {
    return {
      moreQueryShow: false, //模态框是否展示
      clientList: [], //客户下拉框
      data: {}, //表单数据
      page: {
        total: 0,
        size: 10,
        num: 1
      },
      salesList: [], //创建人提交人数据
      loading:false, //模糊查询框
    };
  },
  mounted() {
  },
  methods: {
    async getAllSales() {
      if(this.salesList.length > 0) {
        return;
      }
      let res = await getSales();
      if (res.code === 0) {
        this.salesList = res.data.content;
        this.salesList.forEach(item => {
          item.label = item.userName;
          item.value = item.id;
        });
      }
    },

    openModal() {
      this.getAllClient();
      this.getAllSales();
      this.moreQueryShow = true;
    },

    //获取公司
    async getAllClient(query) {
      if (query && query.trim()) {
        this.loading = true;
        let data ={}
        data.fullName = query
        data.page = 0
        data.size = 30
        let res = await getTreeClient(data)
        if(res.code === 0 ){
          this.loading = false;
          this.clientList = res.data.content;
        }else{
          this.loading = false;
        }
      }else {
        this.clientList = []
      }
    },
    //获取创建时间
    getCreatDate(date) {
      // this.data.createTimeStart = date[0] + " " + "00:00:00"
      this.data.createTimeStart = tools.transTime(date[0]);
      // this.data.createTimeEnd = date[1] + ' ' + '23:59:59'
      this.data.createTimeEnd = tools.transTime(date[1]);
      // console.log('33333',  this.data.createTimeStart,this.data.createTimeEnd)
    },
    //提交日期
    getSubmitDate(date) {
      // this.data.commitTimeStart = date[0] + " " + "00:00:00"
      // this.data.commitTimeEnd = date[1] + ' ' + '23:59:59'
      this.data.commitTimeStart = tools.transTime(date[0]);
      this.data.commitTimeEnd = tools.transTime(date[1]);
      // console.log('4444',   this.data.commitTimeStart,this.data.commitTimeEnd)
    },
    //更多搜索
    getMoreSearch() {
      if (this.data.createTimeStart) {
        this.data.createTimeStart =
          this.data.createTimeStart.substr(0, 10) + " 00:00:00";
      }
      if (this.data.createTimeEnd) {
        this.data.createTimeEnd =
          this.data.createTimeEnd.substr(0, 10) + " 23:59:59";
      }
      this.$emit("moreQuery", this.data);
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
