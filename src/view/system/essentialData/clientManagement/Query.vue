<template>
  <Form :model="data" :label-width="100">
    <div style="display: flex">
      <div style="flex-flow: row nowrap;width: 100%">
        <FormItem label="客户编码:">
          <Input v-model="data.code" style="width: 180px"/>
        </FormItem>
      </div>
      <div style="flex-flow: row nowrap;width: 100%">
        <FormItem label="客户简称:">
          <Input v-model="data.shortName" style="width: 180px" :maxlength="10"/>
        </FormItem>
      </div>
    </div>
    <FormItem label="客户全称:">
      <Input v-model="data.fullName" style="width: 380px"/>
    </FormItem>
    <div style="display: flex">
      <div style="flex-flow: row nowrap;width: 100%">
        <FormItem label="联系人:">
          <Input v-model="data.contactor" style="width: 180px" :maxlength="8"/>
        </FormItem>
        <FormItem label="信用等级:">
          <Select v-model="data.tgradeName" style="width:180px" class="mr10" v-if="dataList != []">
            <Option
              v-for="item in dataList"
              :value="item.itemCode"
              :key="item.itemCode"
            >{{ item.itemName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="省份:">
          <Select v-model="data.provinceId" style="width:180px" class="mr10">
            <Option
              v-for="item in provincearr"
              v-if="item.parentId==0"
              :key="item.id"
              :value="item.id"
            >{{ item.name}}</Option>
          </Select>
        </FormItem>
      </div>
      <div style="flex-flow: row nowrap;width: 100%">
        <FormItem label="联系人电话：">
          <Input v-model="data.contactorTel" style="width: 180px"/>
        </FormItem>
        <FormItem label="会员卡号：">
          <Input v-model="data.cardNo" style="width: 180px"/>
        </FormItem>
        <FormItem label="城市:">
          <Select v-model="data.cityId" style="width:180px" class="mr10">
            <Option
              v-for="item in provincearr"
              v-if="data.provinceId==item.parentId"
              :key="item.id"
              :value="item.id"
            >{{ item.name}}</Option>
          </Select>
        </FormItem>
      </div>
    </div>
  </Form>
</template>

<script>
import {
  getDigitalDictionary
} from "@/api/system/essentialData/clientManagement";
import {area} from '@/api/lease/registerApi';
export default {
  name: "Query",
  props: {
    data: "",


  },
  data() {
    return {
      list: [
        {
          label: 123,
          value: 1
        },
        {
          label: 456,
          value: 2
        }
      ],
      dataList:[],
      provincearr: []
    };
  },
  mounted(){
    this.getxingyong()
    this.getAdress()
  },
  methods:{
    //获取cs00112
    async getxingyong(){
       let data = {};
       data = ['CS00112']
       let res = await getDigitalDictionary(data);
       if (res.code == 0) {
         this.dataList = res.data.CS00112;

       }

     },
    //获取地址
    async getAdress() {
      let res = await area()
      if (res.code == 0) {
        this.provincearr = res.data
      }
    }
  }
};
</script>

<style scoped>
</style>
