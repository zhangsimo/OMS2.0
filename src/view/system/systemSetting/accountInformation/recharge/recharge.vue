<template>
    <div class="bigbox2">
        <div class="headerRecharge">
          <p class="mr10" style="color: #ff6700">注:&nbsp;1元人民币 = 100个华币</p>
          <Button class="mr10" @click="record"><span class="center"><Icon custom="iconfont iconziyuan10 icons" />充值消费记录</span></Button>
        </div>
        <div class="boxContent">
          <div class="thisRow">
            <div class="label"><label>剩余华币:</label></div>
            <div></div>
          </div>
          <div class="thisRow">
            <div class="lavbl"><label>选择套餐:</label></div>
            <div></div>
          </div>
          <div class="thisRow">
            <div class="label"><label>支付金额:</label></div>
            <div></div>
          </div>
          <div class="thisRow">
            <div class="label"><label></label></div>
            <div><Button type="warning">确认购买</Button></div>
          </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "recharge"
    }
</script>

<style scoped>
@import "../../accountInformation/accointInformation.css";
</style>
