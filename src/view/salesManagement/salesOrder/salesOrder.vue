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


  .main .ivu-layout-wrap{
    padding: 16px;
  }
  .main .content-wrapper{
    padding: 0 16px;
    top: 60px!important;
  }
  .ivu-btn-default.ivu-btn:not([disabled]):hover{
    color: #1890ff;
    border-color: #1890ff;
  }
  .tags-nav .tag-item:hover{
    border-color: #1890ff;
    box-shadow: 0px 3px 3px rgba(24, 144, 255, 0.15)
  }
  .tags-nav .tag-item:hover .ivu-tag-text, .tags-nav .tag-item:hover i{
    color: #1890ff;
  }
  .tags-nav .tag-item.tag-item-selected{
    background: #1890ff;
  }
  .ivu-avatar{
    margin-right: 5px;
  }
  .main .ivu-layout .oper-box .oper-top, .main .ivu-layout .oper-box .oper-bottom{
    min-height: 24px;
    padding-bottom: 10px;
  }
  .wlf > div{
    padding-top: 10px;
  }
  .orderNo .ivu-input{
    font-size: 12px;
  }
  a.blue{
    color:#1890ff;
  }
</style>

