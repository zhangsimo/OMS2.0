<template>
    <div style="display: flex">
      <div class="boardLeft">
        <h5 style="margin-bottom: 20px">今日看板</h5>
        <div style="display: flex;margin-bottom: 20px">
          <div class="flex board-one" style="margin-right: 20px">待处理销售订单
            <span style="font-size: 18px;font-weight: 700;margin-left: 20px">15单</span>
            <img src="../../../assets/images/home/daichulijihua.png" width="26" height="26" alt="">
          </div>
          <div class="flex board-two">待入库订单
            <span style="font-size: 18px;font-weight: 700;margin-left: 20px">15单</span>
            <img src="../../../assets/images/home/dengdai.png" width="26" height="26" alt="">
          </div>
        </div>
        <div style="display: flex">
          <div class="flex board-three" style="margin-right: 20px">待处理售后订单
            <span style="font-size: 18px;font-weight: 700;margin-left: 20px">15单</span>
            <img src="../../../assets/images/home/daichuli (1).png" width="26" height="26" alt="">
          </div>
          <div class="flex board-four">待出库订单
            <span style="font-size: 18px;font-weight: 700;margin-left: 20px">15单</span>
            <img src="../../../assets/images/home/wait.png" width="26" height="26" alt="">
          </div>
        </div>
      </div>
      <div class="boardRight">
        <h5 style="margin-bottom: 20px">待办事项</h5>
        <ul>
          <li>
            <img src="../../../assets/images/home/rukuguanli.png" alt="">
            未入库采购订单
            <span class="munber">15</span>
          </li>
          <li>
            <img src="../../../assets/images/home/chukuguanli.png" alt="">
            未入出库销售订单
            <span class="munber2">15</span>
          </li>
          <li>
            <img src="../../../assets/images/home/fukuan.png" alt="">
            未付款对账单
            <span class="munber">15</span>
          </li>
          <li>
            <img src="../../../assets/images/home/yingshoukuan.png" alt="">
            未收款对账单
            <span class="munber2">15</span>
          </li>
          <li>
            <img src="../../../assets/images/home/duizhangdan .png" alt="">
            本月月结未对账
            <span class="munber">15</span>
          </li>
          <li>
            <img src="../../../assets/images/home/caigouguanli .png" alt="">
            待受理采购订单
            <span class="munber2">15</span>
          </li>
          <li>
            <img src="../../../assets/images/home/tuidanguanli.png" alt="">
            待受理客户退单
            <span class="munber">15</span>
          </li>


        </ul>
      </div>
    </div>
</template>

<script>
    export default {
        name: "board"
    }
</script>

<style scoped lang="less">
.boardLeft {
  flex-flow: row nowrap;
  margin-right: 20px;
  width: 100%;
  height: 235px;
  background-color: #ffffff;
  box-shadow: 0px 2px 6px 0px
  rgba(229, 229, 229, 0.8);
  border-radius: 5px;
  padding: 20px;
}
.boardRight {
  flex-flow: row nowrap;
  width: 100%;
  height: 235px;
  background-color: #ffffff;
  box-shadow: 0px 2px 6px 0px
  rgba(229, 229, 229, 0.8);
  border-radius: 5px;
  padding: 20px;
  ul {
    list-style: none;
    li {
      display: inline-block;
      width: 57%;
      height: 45px;
      box-sizing: border-box;
      img {
        vertical-align: middle;
        margin-right: 5px;
      }
    }
    li:nth-child(2n){
      width: 40%;
    }
  }
}
.munber {
  float: right;
  font-weight: 700;
  margin-right: 27%;
}

.munber2{
  float: right;
  font-weight: 700;
  margin-right: 0px;
}
.board-one{
  background-color: #f7f0fc;
}
.board-two {
  background-color: #eef0fb;
}
.board-three{
  background-color: #eaf9f9;
}
.board-four {
  background-color: #e8f8f0;
}
.flex{
  flex-flow: row nowrap;
  width: 100%;
  height: 70px;
  line-height: 70px;
  padding-left: 13px;
  font-size: 12px;
  color: #333333;
  position: relative;
  img {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 25px;
  }
}
</style>
