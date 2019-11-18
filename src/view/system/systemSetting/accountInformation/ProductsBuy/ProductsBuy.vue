<template>
  <div class="bigbox2">
    <div class="headerRecharge">
      <p class="mr10">到期日期:
        <span style="font-weight: bold;padding: 0 5px;color: #40a6ff">{{ status }}</span>
          (剩余: <span style="font-weight: bold;padding: 0 3px 0 5px;color:#ff6700">{{ remainingDays }}</span>天)</p>
      <Button class="mr10" @click="record"><span class="center"><Icon custom="iconfont iconziyuan10 icons" />充值消费记录</span></Button>
    </div>
    <div class="boxContent">
      <div class="thisRow">
        <div class="label"><label>产品名称:</label></div>
        <div></div>
      </div>
      <div class="thisRow">
        <div class="lavbl"><label>充值天数:</label></div>
        <div></div>
      </div>
      <div class="thisRow">
        <div class="label"><label>产品描述:</label></div>
        <div></div>
      </div>
      <div class="thisRow">
        <div class="label"><label>支付金额:</label></div>
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
        name: "ProductsBuy",
      data(){
          return {
            status: '未够买',
            remainingDays: 0
          }
      }
    }
</script>

<style scoped>
  @import "../../accountInformation/accointInformation.css";
</style>
