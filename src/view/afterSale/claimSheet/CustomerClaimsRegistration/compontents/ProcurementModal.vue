<template>
  <Modal
    title="添加配件"
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
          <Input placeholder="配件内码/编码/名称/OE码" v-model="partId" />
        </div>
        <div class="db mr5">
          <span class=" mr5">品牌:</span>
          <Select  v-model="partBrand" filterable style="width:140px" class="mr20">
            <Option v-for="(item, index) in bands" :value="item.value" :key="index">{{ item.label }}</Option>
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
          <Button type="default" @click="selectOrder"
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
        auto-resize
      >
        <vxe-table-column
          type="checkbox"
          width="60"
        ></vxe-table-column>
        <vxe-table-column
          type="seq"
          title="序号"
          width="60"
        ></vxe-table-column>
        <vxe-table-column  field="partCode" title="配件编码"></vxe-table-column>
        <vxe-table-column  field="partName" title="配件名称"></vxe-table-column>
        <vxe-table-column  field="oemCode" title="OE码"></vxe-table-column>
        <vxe-table-column  field="partBrand" title="品牌"></vxe-table-column>
        <vxe-table-column  field="enterQty" title="库存数量"></vxe-table-column>
        <vxe-table-column  field="rtnableQty" title="可退数量"></vxe-table-column>
        <vxe-table-column  field="enterUnitId" title="单位"></vxe-table-column>
        <vxe-table-column  field="branchStockAge" title="库龄"></vxe-table-column>
        <vxe-table-column  field="guestName" title="供应商"></vxe-table-column>
        <vxe-table-column  field="code" title="入库单号"></vxe-table-column>
        <vxe-table-column  field="enterDate" title="入库日期"></vxe-table-column>
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

    <div slot='footer'></div>

  </Modal>
</template>

<script lang="ts">
import  * as tools from "@/utils/tools";
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
// @ts-ignore
import * as api from "@/api/procurement/planTwo";
import { getPartBrand } from "@/api/business/stockSearch";
import getDate from "@/components/getDate/dateget_bill.vue";
import { getParts } from "@/api/salesManagment/salesOrder";

@Component({
  components:{
    getDate
  }
})
export default class ProcurementModal extends Vue {
  private shows: boolean = false;
  private selectRow: Array<any> = new Array();

  @Prop(String) private readonly guestId;
  @Prop(String) private readonly storeId;

  private auditDate:Array<Date> = [];
  // private guestname:string = "";
  private partId:string = "";

  private page: Page = {
    num: 1,
    size: 10,
    total: 0
  };

  private tableData: Array<any> = [];

  private partBrand:any = '' //获取当前品牌code

  private bands: Array<any> =[{ value: "0", label: "全部" }] //品牌列表

  private tableDataBm: Array<any> = new Array();

  private init() {
    this.reset();
    this.getPchsPlanList();
    this.shows = true;
  }

  @Emit('getPlanOrder')
  private ok() {
    let selectRow = JSON.parse(JSON.stringify(this.selectRow))
    if(selectRow.length <= 0) { return this.$Message.error('请勾选要选择的配件!'); };
    // this.shows = false;
    selectRow.forEach((el:any) => {
      el.sourceDetailId = el.id;
      Reflect.deleteProperty(el, 'id');
    })
    return selectRow;
  }

  @Emit('getPlanOrder')
  private async selectOrder() {
    let selectRow = JSON.parse(JSON.stringify(this.selectRow))
    if(selectRow.length <= 0) { return this.$Message.error('请勾选要选择的配件!'); };

    let msg:any = this.$Message.loading({
      content: '加载中...',
      duration: 0
    });

    let row = selectRow[0];

    let params: any = {
      guestId: this.guestId,
      storeId: this.storeId,
      code: row.code,
    }
    params.size = 9999;
    params.page = 0;

    let res:any = await getParts(params);
    let data:Array<any> = new Array();
    if(res.code == 0) {
      data = (res.data.content || []).map(el => {
        el.sourceDetailId = el.id;
        Reflect.deleteProperty(el, 'id');
        return el;
      });
    }
    msg();
    return data;
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
    this.selectRow = new Array();
    this.auditDate = new Array();
    this.tableDataBm = new Array();
    this.partId = "";
  }

  //点击全选
  private cellClickEvent( {selection} ) {
    // console.log(selection);
  }

  //点击复选框获取当前已选择数据
  private radioChangeEvent( {selection} ) {
    this.selectRow = selection;
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
          value: item.name,
          label: item.name
        });
      });
    }
  }


  private async getPchsPlanList() {
    let params: any = {
      guestId: this.guestId,
      storeId: this.storeId,
    };
    params.size = this.page.size;
    params.page = this.page.num - 1;

    let data:any = {
      partId: this.partId,
      partBrand: this.partBrand,
      startEnterDate: this.auditDate[0]?this.auditDate[0]:"",
      endEnterDate: this.auditDate[1]?this.auditDate[1]:"",
    };
    let formData = {};
    for(let k in data) {
      if(data[k] && data[k].trim().length > 0) {
        formData[k] = data[k];
      }
    }

    let obj = {...params, ...formData}

    let res:any = await getParts(obj);
    if(res.code == 0) {
      this.page.total = res.data.totalElements;
      this.tableData = res.data.content;
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
