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
        <div><span class="skyblueClass">{{ getMsg.cycle | day }} </span>天</div>
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

    <Modal v-model="modal" title="微信支付" :footer-hide="true" width="600" @on-cancel="close">
      <div class="modal" style="color: #afafaf;font-size: 18px">待支付：<span style="color:#00b400;font-size: 22px;padding-right: 5px;font-weight: bold">{{getMsg.salesPrice}}</span> 元</div>
      <div class="modal">
        <!--<div id="qrcode" ref="qrcode"></div>-->
        <qriously :value="erweima" :size="200" />
      </div>
      <div class="modal" style="color: #bbbbbb;padding-bottom: 50px">用微信扫此二维码（10分钟有效）</div>
    </Modal>

  </div>
</template>

<script>
  // import QRCode from 'qrcodejs2'
  // tenantInfogenerateOrder
  import { tenantInfogenerateOrder,generationQR, queryOrder, generationRecord } from '../../../../../api/system/account/account'
    export default {
        name: "ProductsBuy",
      // components: {QRCode},
      data(){
          return {
            getMsg: '',
            modal: false,
            orderNum: '',
            erweima:'',
            timer: null,
            status: '',
          }
      },
      filters: {
        day(val) {
          if(val < 0) {
            val = 0
          }
          return val
        }
      },
      methods: {
        record(){
          this.$router.push('/accountInformation/record')
        },
        pay(){
          let data = {}
          data.id = this.getMsg.id
          data.name = this.getMsg.name
          data.code = this.getMsg.code
          data.remark = this.getMsg.remark
          data.salesPrice = this.getMsg.salesPrice
          data.cycle = this.getMsg.cycle
          tenantInfogenerateOrder(data).then(res => {
              if(res.code === 0 ){
                let data = {}
                this.orderNum = res.data.orderNum
                data.price = this.getMsg.salesPrice
                data.orderNum = res.data.orderNum
                generationQR(data).then(res => {
                  if(res.code === 0){
                    this.erweima = res.data.code_url
                    this.modal = true
                 this.timer =  setInterval(() => {
                      let data1 = {}
                      let params1 = {}
                      params1.orderNum = this.orderNum
                      queryOrder({data:data1,params:params1}).then(res => {
                        if(res.code === 0){
                          if(res.data === 'SUCCESS'){
                            this.$Message.warning('购买成功！')
                            this.modal = false
                            this.$router.push('/accountInformation/record')
                           clearInterval(this.timer)
                            let data2 = {}
                            let params2 = {}
                            params2.orderNum = this.orderNum
                            generationRecord({data:data2,params:params2}).then(res => {

                            })
                          }
                        }
                      })
                    },5000)
                  }
                })
              }
          })
        },
        close(){
          // alert(123456)
            clearInterval(this.timer)
            // let data2 = {}
            // let params2 = {}
            // params2.orderNum = this.orderNum
            // generationRecord({data:data2,params:params2}).then(res => {
            //
            // })
        }
        // qrcodeScan () {//生成二维码
        //   let qrcode = new QRCode('qrcode', {
        //     width: 200,  // 二维码宽度
        //     height: 200, // 二维码高度
        //     text:  `http:// + ${this.erweima}`,
        //     correctLevel : QRCode.CorrectLevel.M
        //   })
        //   console.log(qrcode)
        // },
      },
      mounted(){
        this.getMsg = this.$route.query
        // console.log(this.getMsg)
        // this.qrcodeScan();    // 注：需在mounted里触发qrcodeScan函数
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
