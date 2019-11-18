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
                <li v-for="(item,index) in combo" :key="index" class="discountBox items" @click="selectClass(index)" :class="[activeted?'weixuan':'xuan']">
                  <p style="font-size: 16px;font-weight: bold;"> {{ item.originalPrice }}</p>
                  <p style="padding-top: 5px"> 售价{{ item.presentPrice }}</p>
                  <p class="zhekou" v-if="item.originalPrice !== item.presentPrice ">
                    <img v-if="selectClassA === index" class="zhekou_img" src="../../../../../assets/images/recharge/unselected.png" alt="">
                    <img v-else class="zhekou_img" src="../../../../../assets/images/recharge/selected.png" alt="">
                  </p>
                </li>
              </ul>
            </div>
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
        name: "recharge",
      data(){
          return {
            number: 520,
            combo:[
              {originalPrice: '¥ 20',presentPrice: '¥ 20'},
              {originalPrice: '¥100',presentPrice: '¥110'},
              {originalPrice: '¥500',presentPrice: '¥600'},
              {originalPrice: '¥1000',presentPrice: '¥1300'},
              {originalPrice: '¥2000',presentPrice: '¥2800'}
            ],
            selectClassA: '',
            activeted: true,
          }
      },
      methods:{
        record(){},
        selectClass(index){
          // console.log(index)
          this.selectClassA = index
          this.activeted = false
        }
      }
    }
</script>

<style scoped>
@import "../../accountInformation/accointInformation.css";
</style>
