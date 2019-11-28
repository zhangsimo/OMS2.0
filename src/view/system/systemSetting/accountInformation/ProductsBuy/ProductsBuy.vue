<template>
  <div class="bigbox2">
    <div class="headerRecharge">
      <p class="mr10">到期日期:
        <span style="font-weight: bold;padding: 0 5px;color: #40a6ff">{{ getMsg.expiryDate }}</span>
          (剩余: <span style="font-weight: bold;padding: 0 3px 0 5px;color:#ff6700">{{ getMsg.remainDay || 0}}</span>天)</p>
      <Button class="mr10" @click="record"><span class="center"><Icon custom="iconfont iconziyuan10 icons" />充值消费记录</span></Button>
    </div>
    <div class="boxContent">
      <div class="thisRow">
        <div class="label"><label>产品名称:</label></div>
        <div class="skyblueClass">{{ getMsg.name }}</div>
      </div>
      <div class="thisRow">
        <div class="label"><label>充值天数:</label></div>
        <div><span class="skyblueClass">{{ getMsg.cycle }} </span>天</div>
      </div>
      <div class="thisRow">
        <div class="label"><label>产品描述:</label></div>
        <div>{{ getMsg.remark }}</div>
      </div>
      <div class="thisRow">
        <div class="label"><label>支付金额:</label></div>
        <div><span class="skyblueClass">{{ getMsg.salesPrice }}</span> 元</div>
      </div>
      <div class="thisRow">
        <div class="label"><label></label></div>
        <div><Button type="warning" @click="pay">确认购买</Button></div>
      </div>
    </div>

    <Modal v-model="modal" title="微信支付" :footer-hide="true" width="600" >
      <div class="modal" style="color: #afafaf;font-size: 18px">待支付：<span style="color:#00b400;font-size: 22px;padding-right: 5px;font-weight: bold">{{getMsg.salesPrice}}</span> 元</div>
      <div class="modal"><img class="image" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574059290282&di=cfb384a5d560c01318477cbf828f4c72&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fc8807656f986d5352a7f9e6c436a50ea44e3b19c2396-QzGPTm_fw658" alt=""></div>
      <div class="modal" style="color: #bbbbbb;padding-bottom: 50px">用微信扫此二维码（10分钟有效）</div>
    </Modal>

  </div>
</template>

<script>
  // tenantInfogenerateOrder
  import { tenantInfogenerateOrder,generationQR } from '../../../../../api/system/account/account'
    export default {
        name: "ProductsBuy",
      data(){
          return {
            getMsg: '',
            modal: false,
            orderNum: ''
          }
      },
      methods: {
        record(){
          this.$router.push('/accountInformation/record')
        },
        pay(){
          tenantInfogenerateOrder().then(res => {
              if(res.code === 0 ){
                 this.orderNum = res.data.orderNum
              }
          })
          let data = {}
          data.price = this.getMsg.salesPrice
          data.orderNo = this.orderNum
          generationQR(data).then(res => {
            console.log(res)
          })
          this.modal = true
        }
      },
      mounted(){
        this.getMsg = this.$route.query
      },
      activated(){
          this.getMsg = this.$route.query
          console.log(this.getMsg)
      }
    }
</script>

<style scoped>
  @import "../../accountInformation/accointInformation.css";
</style>
<style scoped>
  .skyblueClass{
    color: #40a6ff;
    font-size: 16px;
    font-weight: bold;
  }
  .modal{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
  .image{
    width: 160px;
    height: 160px;
  }
</style>
