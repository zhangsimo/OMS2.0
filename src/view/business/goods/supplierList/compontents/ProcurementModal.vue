<template>
  <Modal
    title="选择采购入库单11"
    v-model="shows"
    :styles="{ top: '50px', width: '1000px' }"
  >
    <div class="top-plan">
      <div class="tools-bar mb10">
        <div class="db mr5">快速查询:</div>
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
        <!-- <div class="db mr5">
          <Input placeholder="请选择供应商" v-model="guestname"  @on-focus="showModel('selectSupplier')" />
        </div> -->
        <div class="db mr5">
          <Input placeholder="订单号" v-model="serviceId" />
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
        ref="xTable1"
        height="300"
        size="small"
        :data="tableData"
        @cell-click="cellClickEvent"
        @radio-change="radioChangeEvent"
        auto-resize
      >
        <vxe-table-column
          type="radio"
          title="选择"
          width="60"
        ></vxe-table-column>
        <vxe-table-column
          type="index"
          title="序号"
          width="60"
        ></vxe-table-column>
        <vxe-table-column field="serviceId" title="入库单号"></vxe-table-column>
        <vxe-table-column field="guestName" title="供应商名称"></vxe-table-column>
        <vxe-table-column field="orderAmt" title="入库金额"></vxe-table-column>
        <vxe-table-column field="finishDate" title="入库日期"></vxe-table-column>
        <vxe-table-column field="code" title="采购单号"></vxe-table-column>
        <vxe-table-column field="remark" title="备注"></vxe-table-column>
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
// import SelectSupplier from "./selectSupplier.vue";

@Component
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

  private tableData: Array<any> = new Array();

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

  // 选择供应商
  // private selectSupplierName(row: any) {
  //   this.guestId = row.id;
  //   this.guestname = row.fullName;
  // }

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

  private cellClickEvent() {
    // console.log("单元格点击事件");
  }
  private radioChangeEvent({ row }) {
    this.selectRow = row;
    // console.log(this.selectRow)
    this.tableDataBm = row.details || [];
  }

  private query() {
    this.page.num = 1;
    this.getPchsPlanList();
  }

  //获取日期
  private getDate(v){
    this.auditDate = v
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
