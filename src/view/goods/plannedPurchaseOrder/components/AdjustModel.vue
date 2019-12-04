<template>
  <Modal
    title="订单数量调整"
    v-model="show"
    :styles="{ top: '50px', width: '1000px' }"
  >
    <div>
      <div class="tools-bar mb10">
        <div class="db mr5">
          <Button type="default" @click="save"
            ><i class="iconfont iconxuanzetichengchengyuanicon"></i>保存</Button
          >
        </div>
        <div class="db mr10">
          <Button type="default" @click="cancel"><Icon type="md-close" />取消</Button>
        </div>
        <div class="db mr10">|</div>
        <div class="db mr10">
          <Button class="w90" type="warning" @click="allAdj">
            <span class="center">全部调整</span>
          </Button>
        </div>
        <div class="db mr5">
          <span>配件编码:</span>
          <Input class="w180" v-model="partCode" placeholder="请输入配件编码" />
        </div>
        <div class="db mr10">
          <span>配件名称:</span>
          <Input class="w180" v-model="partName" placeholder="请输入配件名称" />
        </div>
        <div class="db">
          <Button class="w90" type="warning" @click="query">
            <span class="center">
              <Icon custom="iconfont iconchaxunicon icons" />查询
            </span>
          </Button>
        </div>
      </div>
      <div>
        <vxe-table
          border
          auto-resize
          :loading="loading"
          height="420"
          size="mini"
          :data="tableData"
          :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
        >
          <vxe-table-column
            type="index"
            width="80"
            title="序号"
          ></vxe-table-column>
          <vxe-table-column
            field="partCode"
            title="配件编码"
          ></vxe-table-column>
          <vxe-table-column
            field="partName"
            title="配件名称"
          ></vxe-table-column>
          <vxe-table-column field="orderQty" title="订单数量"></vxe-table-column>
          <vxe-table-column field="trueEnterQty" title="实际入库数量"></vxe-table-column>
          <vxe-table-column field="notEnterQty" title="已调整数量"></vxe-table-column>
          <vxe-table-column
            field="adjustQty"
            title="本次调整数量"
            :edit-render="{ name: 'input' }"
            width="120"
          >
            <template v-slot:edit="{ row }">
              <InputNumber :min="0" :max="row.orderQty" v-model="row.adjustQty" />
            </template>
          </vxe-table-column>
          <vxe-table-column field="remark" title="备注"></vxe-table-column>
        </vxe-table>
      </div>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
// @ts-ignore
import * as api from "_api/procurement/plan";

@Component
export default class AdjustModel extends Vue {
  private show: boolean = false;
  private loading:boolean = false;

  @Prop(String) readonly mainId;

  private tableData: Array<any> = new Array();

  private partCode: string = "";
  private partName: string = "";

  private init(): void {
    this.show = true;
    this.reset();
    this.getList();
  }

  private cancel():void {
    this.show = false;
  }

  private reset(): void {
    this.partCode = "";
    this.partName = "";
  }

  private query() {
    this.getList();
  }

  private async getList() {
    this.loading = true;
    let data: any = {};
    data.mainId = this.mainId;
    if (this.partCode.trim()) {
      data.partCode = this.partCode.trim();
    }
    if (this.partName.trim()) {
      data.partName = this.partName.trim();
    }
    let res: any = await api.queryModifyOrder(data);
    if(res.code == 0) {
        this.loading = false;
        this.tableData = res.data;
    }
  }

  private async save() {
    let res: any = await api.saveModifyOrder(this.tableData);
    if(res.code == 0) {
      this.$Message.success('保存成功!');
      this.getList()
    }
  }

  private async allAdj() {
    let res:any = await api.saveModifyAllOrder({ mainId: this.mainId });
    if(res.code == 0) {
      this.$Message.success('保存成功!');
      this.getList()
    }
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
