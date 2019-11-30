<template>
  <Modal v-model="isCost" title="退货入库" width="1000">

  </Modal>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class ReturnTreasury extends Vue {
    private isCost:boolean = false;

    private init() {
        this.isCost = true;
    }
}
</script>

<style lang="less">
    .costBox {
        display: flex;
        justify-content: space-between;

    }
</style>
