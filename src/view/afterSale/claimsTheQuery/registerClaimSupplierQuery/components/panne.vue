<template>
  <section class="oper-top">
    <div class="oper-top">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="mr10 ml10">
            <quickDate ref="quickDate" @quickDate="getvalue"></quickDate>
          </div>
          <div class="db mr10">
            <span class="mr5">创建日期：</span>
            <DatePicker
              @on-change="getDataQuick"
              :value="search.orderDate"
              type="daterange"
              placement="bottom-start"
              placeholder="选择日期"
              class="w200"
              clearable
            >
            </DatePicker>
          </div>
          <div class="db mr10">
            <span class="mr5">供应商:</span>
            <Input
              v-model.trim="search.guestName"
              placeholder="请输入供应商"
              class="w120"
              clearable
            />
          </div>
          <div class="db mr10">
            <span class="mr5">品牌:</span>
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
            <span class="mr5">配件编码/名称/内码:</span>
            <Input
              v-model.trim="search.partCode"
              placeholder="请输入配件编码/名称/内码"
              class="w180"
              clearable
            />
          </div>
          <div class="db mr10">
            <span class="mr5">状态:</span>
            <Select v-model="search.orderSign" style="width:100px" @on-change="query">
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db">
            <Button type="warning" @click="query" class="mr5">查询</Button>
            <!--            <Button type="warning" @click="exportxls" class="mr5">导出</Button>-->
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
  import quickDate from "@/components/getDate/dateget_bill.vue";
  import moment from "moment";

  @Component({
    components: {
      quickDate: quickDate
    }
  })
  export default class panne extends Vue {
    private search: any = {
      orderDate: ToDayStr(),
      guestName: "",
      partCode: "",
      partBrand: "",
      orderSign: 99
    }//搜索条件
    private bandArr: Array<any> = new Array<any>();//品牌数组
    private typeList: Array<any> = [ //单据状态
      {value: 99, name: "所有"},
      {value: 3, name: "草稿"},
      {value: 1, name: "已提交"},
      {value: 2, name: "已完成"}
    ]

    async mounted() {
      this.bandArr = await getBrandList(this.search.partBrand)
    }

    //获取时间
    private getvalue(value) {
      this.search.orderDate = value;
      this.query();
    }

    private getDataQuick(v) {
      this.search.orderDate = v;
    }

    private async partBrandRemote(query: string) {
      this.bandArr = await getBrandList(query)
    }

    private query() {
      let data: any = {};
      for (let key in this.search) {
        if (this.search[key]) {
          if (key == "orderDate") {
            data.createStartTime = this.search["orderDate"][0] != "" ?
              moment(this.search["orderDate"][0]).startOf('day').format("YYYY-MM-DD HH:mm:ss") : ""
            data.createEndTime = this.search["orderDate"][1] != "" ?
              moment(this.search["orderDate"][1]).endOf('day').format("YYYY-MM-DD HH:mm:ss") : ""
          } else if (key == "orderSign") {
            data.orderSign = this.search.orderSign == 99 ? "" : this.search.orderSign
          } else {
            data[key] = this.search[key];
          }
        }
      }
      this.$emit("search", data);
    }

    private exportxls() {
      this.$emit("export")
    }
  }
</script>
<style lang="less"></style>
