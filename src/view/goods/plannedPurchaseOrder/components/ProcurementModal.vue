<template>
  <Modal
    title="选择采购计划单"
    v-model="shows"
    :styles="{ top: '50px', width: '1000px' }"
  >
    <div class="top-plan">
      <div class="tools-bar mb10">
        <div class="db mr5">快速查询:</div>
        <div class="db mr5"><span>提交日期:</span></div>
        <div class="db mr5">
          <DatePicker
            type="daterange"
            placement="bottom-end"
            placeholder="请选择日期"
            style="width: 120px"
          ></DatePicker>
        </div>
        <div class="db mr5">
          <Input placeholder="请选择供应商" />
        </div>
        <div class="db mr5">
          <Input placeholder="订单号" />
        </div>
        <div class="db mr5">
          <Button class="w90" type="warning">
            <span class="center">
              <Icon custom="iconfont iconchaxunicon icons" />查询
            </span>
          </Button>
        </div>
        <div class="db mr5">
          <Button type="default"
            ><i class="iconfont iconxuanzetichengchengyuanicon"></i>选择</Button
          >
        </div>
        <div class="db mr5">
          <Button type="default"
            ><Icon type="md-close" />取消</Button
          >
        </div>
      </div>
      <vxe-table
        border
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
        <vxe-table-column field="sex" title="计划单号"></vxe-table-column>
        <vxe-table-column field="sex" title="供应商"></vxe-table-column>
        <vxe-table-column field="sex" title="计划采购日期"></vxe-table-column>
        <vxe-table-column field="sex" title="计划员"></vxe-table-column>
        <vxe-table-column field="sex" title="提交日期"></vxe-table-column>
        <vxe-table-column field="sex" title="备注"></vxe-table-column>
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
    <div class="bottom-plan mt10">
        <vxe-table
        border
        ref="xTable1"
        height="300"
        size="small"
        :data="tableDataBm"
        auto-resize
      >
        <vxe-table-column
          type="index"
          title="序号"
          width="60"
        ></vxe-table-column>
        <vxe-table-column field="sex" title="配件编码"></vxe-table-column>
        <vxe-table-column field="sex" title="配件名称"></vxe-table-column>
        <vxe-table-column field="sex" title="计划采购数量"></vxe-table-column>
        <vxe-table-column field="sex" title="调整数量"></vxe-table-column>
        <vxe-table-column field="sex" title="已转订单数量"></vxe-table-column>
        <vxe-table-column field="sex" title="未转订单数量"></vxe-table-column>
        <vxe-table-column field="sex" title="备注"></vxe-table-column>
      </vxe-table>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class ProcurementModal extends Vue {
  private shows: boolean = false;
  private selectRow: any = null;

  private page: Page = {
    num: 1,
    size: 10,
    total: 0
  };

  private tableData: Array<any> = new Array();

  private tableDataBm: Array<any> = new Array();

  private init() {
    this.shows = true;
  }

  private cellClickEvent() {
    console.log("单元格点击事件");
  }
  private radioChangeEvent({ row }) {
    this.selectRow = row;
    console.log("单选事件");
  }

  private changePageToTable(p: number) {
    this.page.num = p;
  }
  private changeSizeToTable(size: number) {
    this.page.num = 1;
    this.page.size = size;
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
