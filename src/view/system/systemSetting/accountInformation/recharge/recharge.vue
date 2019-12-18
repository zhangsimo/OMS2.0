<template>
    <div class="bigbox2">
        <div class="headerRecharge">
          <p class="mr10" style="color: #ff6700">注:&nbsp;1元人民币 = 100个华币</p>
          <Button class="mr10" @click="record"><span class="center"><Icon custom="iconfont iconziyuan10 icons" />充值消费记录</span></Button>
        </div>
        <div class="boxContent">
          <div class="thisRow">
            <div class="label"><label>剩余华币:</label></div>
            <div><span style="color: #40a6ff;font-size: 16px;font-weight: bold">{{ number }} </span>个</div>
          </div>
          <div class="thisRow">
            <div class="label" style="margin-top: 10px"><label>选择套餐:</label></div>
            <div>
              <ul class="item">
                <li v-for="(item,index) in combo" :key="index" class="discountBox itemss" @click="selectClass(index,item)" :class="[selectClassA !== index?'weixuan':'xuan']">
                  <p style="font-size: 16px;font-weight: bold;"> ￥{{ item.sellPrice }}</p>
                  <p style="padding-top: 5px"> 售价 ￥{{ item.totalCoin }}</p>
                  <p class="zhekou" v-if="item.sellPrice !== item.totalCoin">
                    <img v-if="selectClassA !== index" class="zhekou_img" src="../../../../../assets/images/recharge/unselected.png" alt="">
                    <img v-else class="zhekou_img" src="../../../../../assets/images/recharge/selected.png" alt="">
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div class="thisRow">
            <div class="label"><label>支付金额:</label></div>
            <div>{{ payMoney }}({{ remark }})</div>
          </div>
          <div class="thisRow">
            <div class="label"><label></label></div>
            <div><Button type="warning" @click="Pay">确认购买</Button></div>
          </div>
        </div>
      <Modal v-model="modal" title="微信支付" :footer-hide="true" width="600" @on-cancel="close">
        <div class="modal" style="color: #afafaf;font-size: 18px">待支付：<span style="color:#00b400;font-size: 22px;padding-right: 5px;font-weight: bold">{{payMoney}}</span> 元</div>
        <div class="modal"><qriously :value="erweima" :size="200" /></div>
        <div class="modal" style="color: #bbbbbb;padding-bottom: 50px">用微信扫此二维码（10分钟有效）</div>
      </Modal>
    </div>
</template>

<script>
  import {rechargeCoinInfo,generateOrder,generationQR,queryOrder,generationRecord } from '../../../../../api/system/account/account'
  export default {
        name: "recharge",
      data(){
          return {
            number: '',
            combo:[
              // {originalPrice: '20',presentPrice: '20'},
              // {originalPrice: '100',presentPrice: '110'},
              // {originalPrice: '500',presentPrice: '600'},
              // {originalPrice: '1000',presentPrice: '1300'},
              // {originalPrice: '2000',presentPrice: '2800'}
            ],
            selectClassA: null,
            payMoney: '',
            modal: false,
            remark:'',
            totalCoin:'',
            flowPic: '',
            erweima:'' , //微信二维码路径
            orderNum: '',
            Id: '', //选择当前套餐的id
            Name: '', //选择当前套餐的产品名称
            Code: '', //选择当前套餐的餐品编码
            Remark: '', //选择当前套餐的描述
            SalesPrice: '', //选择当前套餐的售价
            Cycle: '', //选择当前套餐的产品天数
            timer: '', //定时器
          }
      },
      methods:{
        //路由跳转
        record(){
          this.$router.push('/accountInformation/record')
        },
        //选择套餐
        selectClass(index,item){
          console.log(item)
          this.selectClassA = index
          this.payMoney = item.sellPrice
          this.remark = item.remark
          this.totalCoin = item.totalCoin
        },
        Pay(){
          if (this.selectClassA !== null){
            //生成订单的接口
            let data = {}
            data.sellPrice = this.payMoney
            data.totalCoin = this.totalCoin
            generateOrder(data).then(res => {
                if(res.code === 0){
                  let num = res.data.orderNum
                  this.orderNum = res.data.orderNum
                  let dataa = {}
                  dataa.price = this.payMoney
                  dataa.orderNum = num
                  // dataa.orderNum = '20191217030100000009'
                  generationQR(dataa).then(res => {
                    if(res.code === 0){
                      this.erweima = res.data.code_url
                      this.modal = true
                   this.timer =  setInterval(() => {
                        let data1 = {}
                        let params1 = {}
                        params1.orderNum = this.orderNum
                        // params1.orderNum = '20191217030100000009'
                        queryOrder({data:data1,params:params1}).then(res => {
                          if(res.code == 0){
                            if(res.data == 'SUCCESS'){
                              this.$Message.warning('购买成功！')
                              this.modal = false
                              clearInterval(this.timer)
                              let data2 = {}
                              let params2 = {}
                              params2.orderNum = this.orderNum
                              generationRecord({data:data2,params:params2}).then(res => {

                              })
                            }
                          }
                        })
                      },10000)
                    }
            })
            }
            })

          } else {
            this.$Message.warning('请选择套餐！')
          }
        },
        close(){
          // let data = {}
          // let params = {}
          // params.orderNum = this.orderNum
          // queryOrder({data:data,params:params}).then(res => {
          //
          // })
        }
      },
      mounted(){
          let params = {}
        rechargeCoinInfo(params).then(res => {
            if(res.code === 0){
              this.combo = res.data.coins
              this.number = res.data.remainCoin
            }
        })
      }
    }
</script>

<style scoped>
@import "../../accountInformation/accointInformation.css";
</style>
<style scoped>
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
