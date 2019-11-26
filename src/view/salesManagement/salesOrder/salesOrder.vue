<template>
    <main class="bigBox">
      <Tabs type="card" name="orderbox">
        <TabPane  label="销售订单" tab="orderbox">
        <div class="marketBox">
          <Order></Order>
        </div>
        </TabPane>
        <TabPane  label="配件信息" tab="orderbox"><div></div></TabPane>
        <TabPane  label="报价列表" tab="orderbox"><div></div></TabPane>
      </Tabs>
    </main>
</template>

<script>
  import Order from "./Order/Order";
    export default {
        name: "salesOrder",
        components:{
            Order,
        }
    }
</script>

<style scoped lang="less">
.marketBox {
  height:  calc(100vh - 170px);
  width: 100%;
  background-color: #fff;
}
  .bigBox {
    background-color: #fff;
  }
</style>

