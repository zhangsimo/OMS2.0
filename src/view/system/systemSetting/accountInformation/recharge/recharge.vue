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
                  <p style="font-size: 16px;font-weight: bold;"> ￥{{ item.price }}</p>
                  <p style="padding-top: 5px"> 售价 ￥{{ item.totalCoin }}</p>
                  <p class="zhekou" v-if="item.price !== item.price ">
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
      <Modal v-model="modal" title="微信支付" :footer-hide="true" width="600" >
        <div class="modal" style="color: #afafaf;font-size: 18px">待支付：<span style="color:#00b400;font-size: 22px;padding-right: 5px;font-weight: bold">{{payMoney}}</span> 元</div>
        <div class="modal"><img class="image" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574059290282&di=cfb384a5d560c01318477cbf828f4c72&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fc8807656f986d5352a7f9e6c436a50ea44e3b19c2396-QzGPTm_fw658" alt=""></div>
        <div class="modal" style="color: #bbbbbb;padding-bottom: 50px">用微信扫此二维码（10分钟有效）</div>
      </Modal>
    </div>
</template>

<script>
  import {rechargeCoinInfo,generateOrder,generationQR} from '../../../../../api/system/account/account'
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
            totalCoin:''
          }
      },
      methods:{
        //路由跳转
        record(){
          this.$router.push('/accountInformation/record')
        },
        //选择套餐
        selectClass(index,item){
          // console.log(item)
          this.selectClassA = index
          this.payMoney = item.price
          this.remark = item.remark
          this.totalCoin = item.totalCoin
        },
        Pay(){
          if (this.selectClassA !== null){
            //生成订单的接口
            let data = {}
            generateOrder(data).then(res => {
          //       if(res.code === 0){
          //       this.modal = true
          //       let dataa = {}
          //       dataa.price = this.payMoney
          //       dataa.orderNo = '201911191752030001'
          //   generationQR(dataa).then(res => {
          //
            })
          // }
          //   })

          } else {
            this.$Message.warning('请选择套餐！')
          }
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
