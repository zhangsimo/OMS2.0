<template>
  <Modal
    title="选择采购订单"
    v-model="shows"
    :styles="{ top: '50px', width: '1000px' }"
    @on-visible-change="showChange"
  >
    <div class="top-plan">
      <div class="tools-bar mb10">
        <div class="db mr5">快速查询:</div>
        <div class="db mr5">
          <span>提交日期:</span>
        </div>
        <div class="db mr5">
          <DatePicker
            type="daterange"
            placement="bottom-end"
            placeholder="请选择日期"
            style="width: 200px"
            v-model="auditDate"
          ></DatePicker>
        </div>
        <div class="db mr5">
          <Select v-model="client" filterable style="width: 200px" placeholder="请选择客户">
            <Option v-for="item in clientList" :value="item.id" :key="item.id">{{ item.fullName }}</Option>
          </Select>
        </div>
        <div class="db mr5">
          <Input placeholder="采购单号" v-model="serviceId" />
        </div>
        <div class="db mr5">
          <Button class="w90" type="warning" @click="query">
            <span class="center">
              <Icon custom="iconfont iconchaxunicon icons" />查询
            </span>
          </Button>
        </div>
        <div class="db mr5">
          <Button type="default" @click="ok">
            <i class="iconfont iconxuanzetichengchengyuanicon"></i>选择
          </Button>
        </div>
        <div class="db mr5">
          <Button type="default" @click="cancel">
            <Icon type="md-close" />取消
          </Button>
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
        <vxe-table-column type="radio" title="选择" width="60"></vxe-table-column>
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="serviceId" title="采购单号"></vxe-table-column>
        <vxe-table-column field="guestName" title="供应商名称"></vxe-table-column>
        <vxe-table-column field="orderQty" title="采购总数"></vxe-table-column>
        <vxe-table-column field="billTypeName" title="票据类型"></vxe-table-column>
        <vxe-table-column field="settleTypeName" title="结算方式"></vxe-table-column>
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
          size="small"
          show-sizer
          show-total
          show-elevator
        ></Page>
      </div>
    </div>
    <div class="bottom-plan mt10">
      <vxe-table
        border
        stripe
        ref="xTable1"
        height="300"
        size="small"
        :data="tableDataBm"
        auto-resize
      >
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="partCode" title="配件编码"></vxe-table-column>
        <vxe-table-column field="partName" title="配件名称"></vxe-table-column>
        <vxe-table-column field="partBrand" title="品牌"></vxe-table-column>
        <vxe-table-column field="oemCode" title="OE码"></vxe-table-column>
        <vxe-table-column field="unit" title="单位"></vxe-table-column>
        <vxe-table-column field="carBrandName" title="品牌车型"></vxe-table-column>
        <vxe-table-column field="orderQty" title="订单数量"></vxe-table-column>
        <vxe-table-column title="采购单价" field="orderPrice">
          <!-- <template v-slot:edit="{ row }">
            <el-input-number
              :min="0"
              v-model="row.orderPrice"
              :controls="false"
              size="small"
              :precision="2"
            />
          </template>-->
        </vxe-table-column>
        <vxe-table-column field="orderAmt" title="采购金额">
          <!-- <template v-slot:edit="{ row }">
            <el-input-number
              :min="0"
              v-model="row.orderAmt"
              :controls="false"
              size="small"
              :precision="2"
            />
          </template>-->
        </vxe-table-column>
        <vxe-table-column field="remark" title="备注"></vxe-table-column>
      </vxe-table>
    </div>
    <div slot="footer"></div>
    <!-- 供应商资料
    <select-supplier
      @selectSearchName="selectSupplierName"
      ref="selectSupplier"
      headerTit="供应商资料"
    ></select-supplier>-->
  </Modal>
</template>

<script lang="ts">
import * as tools from "../../../../utils/tools";
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
// @ts-ignore
import { getBuy } from "@/api/business/procurementAndStorage";
// import SelectSupplier from "./selectSupplier.vue";

@Component
export default class ProcurementModal extends Vue {
  private shows: boolean = false;
  private selectRow: any = null;

  @Prop(String) readonly guestId;
  @Prop(Array) readonly clientList;

  private auditDate: Array<Date> = [];
  // private guestname:string = "";
  private serviceId: string = "";

  private page: Page = {
    num: 1,
    size: 10,
    total: 0
  };

  private client: any = "";

  private tableData: Array<any> = new Array();

  private tableDataBm: Array<any> = new Array();

  private init() {
    this.shows = true;
    this.reset();
    this.getPchsPlanList();
  }
  private showChange(type) {
    if (!type) {
      this.selectRow = null;
    }
  }
  @Emit("getPlanOrder")
  private ok() {
    if (!this.selectRow) {
      this.$Message.error("请选择采购订单");
      return null;
    }
    this.shows = false;
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
    this.auditDate = new Array();
    // this.guestId = "";
    // this.guestname = "";
    this.serviceId = "";
  }

  private cellClickEvent() {
    // console.log("单元格点击事件");
  }
  private radioChangeEvent({ row }) {
    this.selectRow = row;
    row.details.map(item => {
      item.orderPrice = item.orderPrice ? parseFloat(item.orderPrice).toFixed(2) : "";
      item.orderAmt = item.orderAmt ? parseFloat(item.orderAmt).toFixed(2) : "";
    });
    this.tableDataBm = row.details || [];
  }

  private query() {
    this.page.num = 1;
    this.getPchsPlanList();
  }

  private async getPchsPlanList() {
    let params: any = {};
    let data: any = {
      guestId: this.client,
      serviceId: this.serviceId,
      auditStartDate: tools.transTime(this.auditDate[0]),
      auditEndDate: tools.transTime(this.auditDate[1])
    };
    params.size = this.page.size;
    params.page = this.page.num - 1;
    let formData = {};
    for (let k in data) {
      if (data[k] && data[k].trim().length > 0) {
        formData[k] = data[k];
      }
    }
    let res: any = await getBuy(params, formData);
    if (res.code == 0) {
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
