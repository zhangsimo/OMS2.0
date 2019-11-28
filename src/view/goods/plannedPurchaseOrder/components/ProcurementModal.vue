<template>
  <Modal
    title="选择采购计划单"
    v-model="shows"
    :styles="{ top: '50px', width: '1000px' }"
  >
    <div class="top-plan">
      <div class="tools-bar">
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
          <Button size="small" type="default"
            ><i class="iconfont iconxuanzetichengchengyuanicon"></i
          >选择</Button>
        </div>
        <div class="db mr5">
          <Button size="small" type="default"
            ><Icon type="md-close" />取消</Button>
        </div>
      </div>
    </div>
    <div class="bottom-plan"></div>
  </Modal>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class ProcurementModal extends Vue {
  private shows: boolean = true;

  private init() {
    this.shows = true;
  }
}
</script>

<style lang="less">
.tools-bar {
  display: flex;
  align-items: center;
}
</style>
