<template>
  <section class="oper-top pb15">
    <div class="oper-top">
      <div class="oper-top flex">
        <div class="wlf ml10">
          <div class="db mr10">
            <span class="mr10">提交日期：</span>
            <DatePicker
              @on-change="getDataQuick"
              :value="search.orderDate"
              type="daterange"
              placement="bottom-start"
              placeholder="选择日期"
              class="w200 mr10"
              clearable
            >
            </DatePicker>
          </div>
          <div class="db mr10">
            <span class="mr10">供应商:</span>
            <Input
              v-model.trim="search.guestName"
              placeholder="请输入供应商"
              class="w120 mr10"
              clearable
            />
          </div>
          <div class="db mr10">
            <span class="mr10">配件编码/名称/内码:</span>
            <Input
              v-model.trim="search.partCode"
              placeholder="请输入配件编码/名称/内码"
              class="w120 mr10"
              clearable
            />
          </div>
          <div class="db mr10">
            <span class="mr10">品牌:</span>
            <Select
              class="w120"
              clearable
              label-in-value
              filterable
              @on-change="select1"
              v-model.trim="search.partBrand"
              placeholder="请选择品牌"
            >
              <Option v-for="item in bandArr" :value="item.label" :key="item.id">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <span class="mr10">理赔单号:</span>
            <Input
              v-model.trim="search.serviceId"
              placeholder="请输入理赔单号"
              class="w120"
              clearable
            />
          </div>
          <div class="db mr10">
            <span class="mr10">索赔编号:</span>
            <Input
              v-model.trim="search.claimDemageCode"
              placeholder="请输入索赔编号"
              class="w120"
              clearable
            />
          </div>
          <div class="db">
            <Button type="warning" @click="query" class="mr10">查询</Button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
  import {Vue, Component, Watch} from "vue-property-decorator";
  import {getBrandList} from "@/view/reportForm/until.js"
  import {ToDayStr} from "@/components/getDate/index_bill.js"
  import moment from "moment";
  @Component
  export default class panne extends Vue {
    private search: any = {
      orderDate: ToDayStr(),
      guestName: "",
      partCode: "",
      partBrand: "",
      serviceId: "",
      claimDemageCode: ""
    }//搜索条件
    private bandArr: Array<any> = new Array<any>();//品牌数组


    async mounted() {
      this.bandArr = await getBrandList(this.search.partBrand)
    }
    private getDataQuick(v){
      this.search.orderDate = v;
    }
    private async partBrandRemote(query: string) {
      this.bandArr = await getBrandList(query)
    }
    private query() {
      let data:any = {};
      for (let key in this.search) {
        if (this.search[key]) {
          if (key == "orderDate") {
            data.orderStartDate =this.search["orderDate"][0]!=""?
              moment(this.search["orderDate"][0]).startOf('day').format("YYYY-MM-DD HH:mm:ss"):""
            data.orderEndDate =this.search["orderDate"][1]!=""?
              moment(this.search["orderDate"][1]).endOf('day').format("YYYY-MM-DD HH:mm:ss"):""
          } else {
            data[key] = this.search[key];
          }
        }
      }
      this.$emit("search", data);
    }
    private exportxls(){
      this.$emit("export")
    }
  }
</script>
<style lang="less"></style>
