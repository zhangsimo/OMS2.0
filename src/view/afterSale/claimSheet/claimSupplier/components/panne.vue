<template>
  <section class="oper-box">
    <div class="flex">
      <div class="con-box flex">
        <div class="wlf">
          <div class="db mr10">
            <span>提交日期：</span>
            <DatePicker
              @on-change="getDataQuick2"
              :value="search.orderDate"
              type="daterange"
              placement="bottom-start"
              placeholder="选择日期"
              class="w200 mr10"
            >
            </DatePicker>
          </div>
          <div class="db mr10">
            <span>供应商:</span>
            <Input
              v-model="search.guestName"
              placeholder="请输入供应商"
              class="w200 mr10"
              clearable
            />
          </div>
          <div class="db mr10">
            <span>配件编码/名称/内码:</span>
            <Input
              v-model="search.partName"
              placeholder="请输入配件编码/名称/内码"
              class="w200 mr10"
              clearable
            />
          </div>
          <div class="db mr10">
            <span>品牌:</span>
            <Select
              class="w240"
              clearable
              label-in-value
              filterable
              remote
              :remote-method="partBrandRemote"
              @on-change="select1"
              v-model="search.partBrand"
              placeholder="请选择品牌"
            >
              <Option
                v-for="item in bandArr"
                :value="item.label"
                :key="item.id"
              >{{ item.label }}</Option
              >
            </Select>
          </div>
          <div class="db mr10">
            <span>理赔单号:</span>
            <Input
              v-model="search.serviceId"
              placeholder="请输入理赔单号"
              class="w120"
              clearable
            />
          </div>
          <div class="db mr10">
            <span>索赔编号:</span>
            <Input
              v-model="search.code"
              placeholder="请输入索赔编号"
              class="w120"
              clearable
            />
          </div>
          <div class="db">
            <Button type="warning" @click="query" class="mr10">查询</Button>
            <Button @click="exportxls">导出</Button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import {Vue, Component, Watch} from "vue-property-decorator";
export default class panne extends Vue {
  private search:any={
    orderDate:[],
    guestName:"",
    partName:"",
  }
}
</script>
<style lang="less"></style>
