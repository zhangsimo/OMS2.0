<template>
  <section class="oper-top">
    <div class="oper-top">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="mr10 ml10">
            <quickDate ref="quickDate" @quickDate="getvalue"></quickDate>
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
            <span class="mr5">配件编码/名称/内码:</span>
            <Input
              v-model.trim="search.partCode"
              placeholder="请输入配件编码/名称/内码"
              class="w180"
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
            <span class="mr5">理赔单号:</span>
            <Input
              v-model.trim="search.serviceId"
              placeholder="请输入理赔单号"
              class="w180"
              clearable
            />
          </div>
          <div class="db">
            <Button type="warning" @click="query" class="mr5">查询</Button>
            <!--            <Button type="warning" @click="exportxls" class="mr5">导出</Button>-->
            <Poptip placement="bottom-start" v-model="moreModel" @on-popper-hide="poperHide">
              <Button class="mr10" @click="moreOpen">更多查询</Button>
              <div slot="content">
                <Form :label-width="80" class="pl5 h270" :label-position="'left'" style="overflow-y: scroll;overflow-x: visible;">
                  <FormItem label="处理日期: " class="h20">
                    <DatePicker
                      type="daterange"
                      placement="bottom-start"
                      class="ml10 w300"
                      v-model.trim="moreSearch.orderDate"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="处理类型: " class="h20">
                    <Select v-model.trim="moreSearch.handleType" transfer class="ml10 mr10 w300">
                      <Option
                        v-for="item in handleTypeList"
                        :value="item.value"
                        :key="item.value"
                      >{{ item.name }}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="客户类型: " class="h20">
                    <Select v-model.trim="moreSearch.guestType" transfer class="ml10 mr10 w300">
                      <Option
                        v-for="item in guestTypeList"
                        :value="item.value"
                        :key="item.value"
                      >{{ item.name }}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="处理人: " class="h20">
                    <Input type="text" class="w300 ml10" v-model.trim="moreSearch.orderMan"/>
                  </FormItem>
                  <FormItem label="处理单号: " class="h20">
                    <Input type="text" class="w300 ml10" v-model.trim="moreSearch.serviceId"/>
                  </FormItem>
                  <FormItem label="返回单号: " class="h20">
                    <Input type="text" class="w300 ml10" v-model.trim="moreSearch.returnCode"/>
                  </FormItem>
                  <FormItem label="索赔编号: " class="h20">
                    <Input type="text" class="w300 ml10" v-model.trim="moreSearch.claimDemageCode"/>
                  </FormItem>
                </Form>
                <Row style="background-color: #ffffff;" class="pb5 pr30 w400">
                  <Col span="20">
                    <Row>
                      <Col span="7" class="ml5">
                        <Button type="primary" @click="moreQuery">确定</Button>
                      </Col>
                      <Col span="6">
                        <Button @click="cancelContent(0)">取消</Button>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="4" class="flex pl10" style="flex-direction: row-reverse;">
                    <Button type="primary" @click="cancelContent(1)">清空条件</Button>
                  </Col>
                </Row>
              </div>
            </Poptip>
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
      quickDate:quickDate
    }
  })
  export default class panne extends Vue {
    private search: any = {
      orderDate: ToDayStr(),
      guestName: "",
      partCode: "",
      serviceId:"",
      partBrand: ""
    }//搜索条件 panne
    private moreSearch:any={
      orderDate:[],
      handleType:99,
      guestType:99,
      orderMan:"",
      serviceId:"",
      claimDemageCode:""
    }//更多查询
    private moreModel:boolean=false;
    private bandArr: Array<any> = new Array<any>();//品牌数组
    private handleTypeList:Array<any> =[ //处理类型 1 原货退化 ；2 换货 ；3 退款 ；4 原物销毁 ；
      {value: 99, name: "所有"},
      {value: 1, name: "原货退还"},
      {value: 2, name: "换货"},
      {value: 3, name: "退款"},
      {value: 4, name: "原物销毁"}
    ]
    private guestTypeList:Array<any>=[
      {value:99,name:"全部"},
      {value:1,name:"内部客户"},
      {value:2,name:"外部客户"}
    ]
    async mounted() {
      this.bandArr = await getBrandList(this.search.partBrand)
    }
    //获取时间
    private getvalue(value) {
      this.search.orderDate = value;
      this.query();
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
            data.createStartTime =this.search["orderDate"][0]!=""?
              moment(this.search["orderDate"][0]).startOf('day').format("YYYY-MM-DD HH:mm:ss"):""
            data.createEndTime =this.search["orderDate"][1]!=""?
              moment(this.search["orderDate"][1]).endOf('day').format("YYYY-MM-DD HH:mm:ss"):""
          }else {
            data[key] = this.search[key];
          }
        }
      }
      this.$emit("search", data);
    }
    private moreQuery() {
      let data:any = {};
      for (let key in this.moreSearch) {
        if (this.moreSearch[key]) {
          if (key == "orderDate") {
            data.createStartTime =this.moreSearch["orderDate"][0]!=""?
              moment(this.moreSearch["orderDate"][0]).startOf('day').format("YYYY-MM-DD HH:mm:ss"):""
            data.createEndTime =this.moreSearch["orderDate"][1]!=""?
              moment(this.moreSearch["orderDate"][1]).endOf('day').format("YYYY-MM-DD HH:mm:ss"):""
          }else {
            data[key] = this.moreSearch[key];
          }
        }
      }
      this.$emit("search", data);
    }
    // 更多
    private moreOpen() {
      this.resetMoreReseach()
    }
    private poperHide(){
      this.moreModel = false;
    }
    private cancelContent(type) {
      if (type == 0) {//更多点击取消 先清空再关闭
        this.resetMoreReseach()
        this.moreModel = false;
      } else if (type == 1) {//更多查询点击清空查询
        this.resetMoreReseach();
      }
    }
    //更多查询清空
    async resetMoreReseach() {
      let data = {
        orderDate:[],
        handleType:99,
        guestType:99,
        orderMan:"",
        serviceId:"",
        claimDemageCode:""
      }
      this.moreSearch = data;
    }
    private exportxls(){
      this.$emit("export")
    }
  }
</script>
<style lang="less"></style>
