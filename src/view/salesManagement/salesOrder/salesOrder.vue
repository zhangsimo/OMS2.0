<template>
    <main class="lightbox-wrap bigBox main-wrap ">
      <!-- <Tabs type="card" name="orderbox">
        <TabPane  label="销售订单" tab="orderbox">
        </TabPane>
      </Tabs> -->
      <div class="marketBox">
        <Order></Order>
      </div>
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
  /*height:  calc(100vh - 170px);*/
  height: 100%;
  width: 100%;
  background-color: #fff;
}
  .bigBox {
    background-color: #fff;
    height: 100%;
    .ivu-tabs{
      height: 100%;
    }
  }
.content-oper{
  box-shadow: none;
}
</style>
<style lang="less">
  .main-wrap{
    .ivu-tabs-content{
      height: 100%;
    }

  }
  .lightbox-wrap{
    .ivu-tabs-bar{
      border:none;
    }
    .ivu-tabs-nav-container{
      display: none;
    }
  }
</style>

