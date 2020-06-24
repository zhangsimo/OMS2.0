<template>
  <Modal
    title="选择采购入库单11"
    v-model="shows"
    :styles="{ top: '50px', width: '1100px' }"
  >
    <div class="top-plan">
      <div class="tools-bar mb10">
        <div class="db mr5">
          <span class="mr5">快速查询:</span>
          <getDate class="mr10" v-on:quickDate="getDataQuick"></getDate>
        </div>
        <div class="db mr5">
          <Input placeholder="配件内码/编码/名称/OE码" v-model="serviceId" />
        </div>
        <div class="db mr5">
          <span class=" mr5">品牌:</span>
          <Select  v-model="band" filterable style="width:140px" class="mr20">
            <Option v-for="item in bands" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="db mr5"><span>入库日期:</span></div>
        <div class="db mr5">
          <DatePicker
            type="daterange"
            placement="bottom-end"
            placeholder="请选择日期"
            style="width: 120px"
            :value="auditDate"
            @on-change="getDate"
          ></DatePicker>
        </div>
        <div class="db mr5">
          <Button class="w90" type="warning" @click="query">
            <span class="center">
              <Icon custom="iconfont iconchaxunicon icons" />查询
            </span>
          </Button>
        </div>
        <div class="db mr5">
          <Button type="default" @click="ok"
            >选择</Button
          >
        </div>
        <div class="db mr5">
          <Button type="default" @click="cancel"
            >整单选择</Button
          >
        </div>
      </div>
      <vxe-table
        border
        stripe
        align="center"
        ref="xTable1"
        height="300"
        column-min-width="100px"
        size="small"
        :data="tableData"
        show-overflow
        :checkbox-config="{trigger: 'row', highlight: true, range: true ,reserve:true}"
        @checkbox-all="cellClickEvent"
        @checkbox-change="radioChangeEvent"
        @getCheckboxReserveRecords='getReserve'
        auto-resize
      >
        <vxe-table-column
          type="checkbox"
          width="60"
        ></vxe-table-column>
        <vxe-table-column
          type="index"
          title="序号"
          width="60"
        ></vxe-table-column>
        <vxe-table-column  field="serviceId" title="配件编码"></vxe-table-column>
        <vxe-table-column  field="guestName" title="配件名称"></vxe-table-column>
        <vxe-table-column  field="orderAmt" title="OE码"></vxe-table-column>
        <vxe-table-column  field="finishDate" title="品牌"></vxe-table-column>
        <vxe-table-column  field="code" title="是否含税"></vxe-table-column>
        <vxe-table-column  field="remark" title="税率"></vxe-table-column>
        <vxe-table-column  field="remark" title="出库数量"></vxe-table-column>
        <vxe-table-column  field="remark" title="出库单价"></vxe-table-column>
        <vxe-table-column  field="remark" title="可退数量"></vxe-table-column>
        <vxe-table-column  field="remark" title="单位"></vxe-table-column>
        <vxe-table-column  field="remark" title="供应商"></vxe-table-column>
        <vxe-table-column  field="remark" title="出库单号"></vxe-table-column>
        <vxe-table-column  field="remark" title="出库日期"></vxe-table-column>
        <vxe-table-column  field="remark" title="关联销售订单"></vxe-table-column>
        <vxe-table-column  field="remark" title="第一供应商"></vxe-table-column>
      </vxe-table>
      <div class="page-warp">
        <Page
          class-name="page-con"
          :current="page.num"
          :total="page.total"
          :page-size="page.size"
          @on-change="changePageToTable"
          @on-page-size-change="changeSizeToTable"
          show-sizer
          show-total
          show-elevator
        ></Page>
      </div>
    </div>

     <!-- 供应商资料
    <select-supplier
      @selectSearchName="selectSupplierName"
      ref="selectSupplier"
      headerTit="供应商资料"
    ></select-supplier> -->
  </Modal>
</template>

<script lang="ts">
import  * as tools from "../../../../../utils/tools";
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
// @ts-ignore
import * as api from "../../../../../api/procurement/planTwo";
import { getPartBrand } from "@/api/business/stockSearch";
import getDate from "@/components/getDate/dateget_bill.vue";

@Component({
  components:{
    getDate
  }
})
export default class ProcurementModal extends Vue {
  private shows: boolean = false;
  private selectRow: any = null;

  @Prop(String)
  private readonly guestId;

  private auditDate:Array<Date> = [];
  // private guestname:string = "";
  private serviceId:string = "";

  private page: Page = {
    num: 1,
    size: 10,
    total: 0
  };

  private tableData: Array<any> = [
    {serviceId:'123'},
    {serviceId:'456'},
    {serviceId:'789'},
    ];

  private band:any = '0' //获取当前品牌code

  private bands: Array<any> =[{ value: "0", label: "全部" }] //品牌列表

  private tableDataBm: Array<any> = new Array();

  private init() {
    this.shows = true;
    this.reset();
    this.getPchsPlanList();
  }

  @Emit('getPlanOrder')
  @Emit('selectRow')
  private ok() {
    if(!this.selectRow) {this.$Message.error('请选择采购入库单'); return};
    this.shows = false;
    this.selectRow.details.forEach((el:any) => {
      Reflect.deleteProperty(el, 'id');
    })
    return this.selectRow;
  }


//生命周期
  created () {
    this.getBand() //调用品牌接口
  }

  private showModel(name) {
    let ref: any = this.$refs[name];
    ref.init();
  }

  private cancel() {
    this.shows = false;
  }

  private reset() {
    this.selectRow = null;
    this.auditDate = new Array();
    this.tableDataBm = new Array();
    // this.guestId = "";
    // this.guestname = "";
    this.serviceId = "";
  }

  //点击全选
  private cellClickEvent( {selection} ) {
    // console.log(selection);
  }

  //点击复选框获取当前已选择数据
  private radioChangeEvent( {selection} ) {
    this.selectRow = selection;
    // console.log(this.selectRow , 7777)
    // this.tableDataBm = row.details || [];
  }

  //获取保留复选数据
  getReserve(v){
    console.log(v)
  }


  private query() {
    this.page.num = 1;
    this.getPchsPlanList();
  }

  //快速查询日期
  private getDataQuick(v){
    this.auditDate = v
  }


  //出库日期获取
  private getDate(v){
    if (v[0]){
      v[0] = v[0] + " 00:00:00"
      v[1] = v[1] + " 23:59:59"
    }
    this.auditDate = v
  }

  //获取品牌
  private async getBand() {
    let res:any = await getPartBrand({ pageSize: 10000 });
    if (res.code === 0) {
      let arr:any = [];
      res.data.content.forEach(item => {
        arr.push(...item.children);
      });
      arr.map(item => {
        this.bands.push({
          value: item.code,
          label: item.name
        });
      });
    }
  }


  private async getPchsPlanList() {
    let params: any = {};
    let data:any = {
      guestId: this.guestId,
      serviceId: this.serviceId,
      startTime: this.auditDate[0]?this.auditDate[0]+" 00:00:00":"",
      endTime: this.auditDate[1]?this.auditDate[1]+" 23:59:59":"",
    };
    params.pageSize = this.page.size;
    params.page = this.page.num - 1;
    let formData = {};
    for(let k in data) {
      if(data[k] && data[k].trim().length > 0) {
        formData[k] = data[k];
      }
    }
    let res:any = await api.getPchsPlan(params, formData);
    if(res.code == 0) {
      this.page.total = res.data.totalElements;
      // this.tableData = res.data.content;
    }
  }

  private changePageToTable(p: number) {
    this.page.num = p;
    this.getPchsPlanList();
  }
  private changeSizeToTable(size: number) {
    this.page.num = 1;
    this.page.size = size;
    this.getPchsPlanList();
  }

}
</script>

<style lang="less">
.tools-bar {
  display: flex;
  align-items: center;
}
.page-warp {
  margin-top: 10px;
  text-align: right;
}
</style>
