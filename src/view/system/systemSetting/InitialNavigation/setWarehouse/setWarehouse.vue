<template>
  <div class="warehouseBigBox">
  <div class="demo-split">
    <Split v-model="split1">
      <div slot="left" class="demo-split-pane">
        <WarehouseLeft></WarehouseLeft>
      </div>
      <div slot="right" class="demo-split-pane">
        Right Pane
      </div>
    </Split>
  </div>
  </div>
</template>

<script>
  import WarehouseLeft from "./WarehouseLeft";
    export default {
        name: "setWarehouse",
        components:{
            WarehouseLeft,
        },
        data () {
            return {
                split1: 0.2
            }
        },
    }
</script>

<style scoped lang="less">
  .warehouseBigBox {
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
  .demo-split{
    height: 100%;
    border: 1px solid #dcdee2;
  }
  .demo-split-pane{
  }
</style>
