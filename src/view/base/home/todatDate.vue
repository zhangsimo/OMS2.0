<template>
  <div class="todayData">
    <p style="margin-bottom: 20px">当前机构今日数据</p>
    <ul class="allDataList">
      <li class="dataOne">
        <img src="../../../assets/images/home/income.png" alt="" style="margin: 0 auto">
        <p class="moneyColer" style="color: #e61414">
         <span style="position: relative"><span class="money">￥</span>{{dataObj.sellOrderAmount}}</span>
        </p>
        <p class="dataTitle">今日营业额</p>
      </li>
      <li class="dataOne">
        <img src="../../../assets/images/home/expend.png" alt="" style="margin: 0 auto">
        <p class="moneyColer"  style="color: #02b9af;">
          <span style="position: relative"><span class="money">￥</span>{{dataObj.pchsOrderAmount}}</span>
        </p>
        <p class="dataTitle">今日采购金额</p>
      </li>
      <li class="dataOne">
        <img src="../../../assets/images/home/debit.png" alt="" style="margin: 0 auto">
        <p class="moneyColer">
          <span style="position: relative"><span class="money"></span>{{dataObj.enterOrderCount}}</span> <span style="font-size: 20px">单</span>
        </p>
        <p class="dataTitle">今日入库单量</p>
      </li>
      <li class="dataOne">
        <img src="../../../assets/images/home/inventory.png" alt="" style="margin: 0 auto">
        <p class="moneyColer">
          <span style="position: relative"><span class="money">￥</span>{{dataObj.partEnterCount}}</span>
        </p>
        <p class="dataTitle">今日入库总数</p>
      </li>
      <li class="dataOne">
        <img src="../../../assets/images/home/kind.png" alt="" style="margin: 0 auto">
        <p class="moneyColer">
          <span style="position: relative"><span class="money">￥</span>{{dataObj.outOrderCount}}</span>
        </p>
        <p class="dataTitle">今日出库单量</p>
      </li>
      <li class="dataOne">
        <img src="../../../assets/images/home/supplier.png" alt="" style="margin: 0 auto">
        <p class="moneyColer">
          <span style="position: relative"><span class="money">￥</span>{{dataObj.partOutCount}}</span>
        </p>
        <p class="dataTitle">今日出库总数</p>
      </li>
    </ul>
  </div>
</template>

<script>
    export default {
        name: "todatDate",
        props:{
            dataObj:{
                type:Object,
                default:function(){
                    return {}
                }
            }
        }
    }
</script>

<style scoped lang="less">
  .todayData{
    padding: 20px;
    background-color: #fff;
    font-size: 14px;
    color: #333333;
    box-shadow: 0px 2px 6px 0px
    rgba(229, 229, 229, 0.8);
    border-radius: 5px;
  }
  .allDataList{
    list-style: none;
    display: flex;
    .dataOne {
      flex-flow: row nowrap;
      text-align: center;
      width: 100%;
    }
    .moneyColer {
      color: #333333;
      font-size: 20px;
      font-weight: 700;
      font-style: normal;
      margin-bottom: 10px;
    }
    .dataTitle{
      font-family: SourceHanSansCN-Regular;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      color: #666666;
    }
    .money{
      font-weight: normal;
      font-size: 12px;
      position: absolute;
      left: -11px;
      top: 6px;
    }
  }
</style>
