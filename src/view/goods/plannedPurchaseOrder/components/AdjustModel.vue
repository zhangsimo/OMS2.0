<template>
  <Modal
    title="订单数量调整"
    v-model="show"
    :styles="{ top: '50px', width: '1000px' }"
  >
    <div>
      <div class="tools-bar mb10">
        <div class="db mr5">
          <Button type="default"
            ><i class="iconfont iconxuanzetichengchengyuanicon"></i>保存</Button
          >
        </div>
        <div class="db mr10">
          <Button type="default"><Icon type="md-close" />取消</Button>
        </div>
        <div class="db mr10">|</div>
        <div class="db mr10">
          <Button class="w90" type="warning">
            <span class="center">全部取消</span>
          </Button>
        </div>
        <div class="db mr5">
          <span>配件编码:</span>
          <Input class="w180" placeholder="请输入配件编码" />
        </div>
        <div class="db mr10">
          <span>配件名称:</span>
          <Input class="w180" placeholder="请输入配件名称" />
        </div>
        <div class="db">
          <Button class="w90" type="warning">
            <span class="center">
              <Icon custom="iconfont iconchaxunicon icons" />查询
            </span>
          </Button>
        </div>
      </div>
      <div>
        <vxe-table border resizable height="auto" size="mini" :data="tableData">
          <vxe-table-column
            type="index"
            width="80"
            title="序号"
          ></vxe-table-column>
          <vxe-table-column field="age" title="配件编码"></vxe-table-column>
          <vxe-table-column field="age" title="配件名称"></vxe-table-column>
          <vxe-table-column field="age" title="订单数量"></vxe-table-column>
          <vxe-table-column field="age" title="实际入库数量"></vxe-table-column>
          <vxe-table-column field="age" title="已调整数量"></vxe-table-column>
          <vxe-table-column
            field="age"
            title="本次调整数量"
            :edit-render="{ name: 'input' }"
            width="120"
          >
            <template v-slot:edit="{ row }">
              <Input />
            </template>
          </vxe-table-column>
          <vxe-table-column field="age" title="备注"></vxe-table-column>
        </vxe-table>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class AdjustModel extends Vue {
  private show: boolean = false;

  private tableData: Array<any> = new Array();

  private init(): void {
    this.show = true;
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
