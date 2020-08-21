<template>
  <div>
    <div class="box-left">
      <!--      左侧顶部快速导航-->
      <div class="quick-navigation">
        <div style="display: flex">
          <a class="quick-one quick-all" @click="go(1000)">
            <img src="../../../assets/images/home/quick-one.svg" alt="">
            <span>采购计划</span>
          </a>
          <a class="quick-two quick-all" @click="go(1001)">
            <img src="../../../assets/images/home/quick-two.svg" alt="">
            <span>计划采购订单</span>
          </a>
          <a class="quick-three quick-all" @click="go(1003)">
            <img src="../../../assets/images/home/quick-three.svg" alt="">
            <span>临时采购订单</span>
          </a>
          <a class="quick-four quick-all" @click="go(1004)">
            <img src="../../../assets/images/home/quick-four.svg" alt="">
            <span>外采订单</span>
          </a>
        </div>
        <div style="margin: 20px 0px;display: flex">
          <a class="quick-five quick-all" @click="go(2000)">
            <img src="../../../assets/images/home/quick-five.svg" alt="">
            <span>销售订单</span>
          </a>
          <a class="quick-six quick-all" @click="go(3101)">
            <img src="../../../assets/images/home/quick-six.svg" alt="">
            <span>调拨申请</span>
          </a>
          <a class="quick-seven quick-all" @click="go(5200)">
            <img src="../../../assets/images/home/quick-seven.svg" alt="">
            <span>应收应付结算</span>
          </a>
          <a class="quick-enigth quick-all" @click="go(4000)">
            <img src="../../../assets/images/home/quick-enigth.svg" alt="">
            <span>库存查询</span>
          </a>
        </div>
      </div>
      <!--      今日数据-->
      <todat-date :data-obj="homeData"></todat-date>
      <!--      今日看板-->
      <div style="margin-top: 20px">
        <board :data-obj="homeData"></board>
      </div>
    </div>
    <div class="box-right">
      <new-list></new-list>
    </div>
  </div>
</template>

<script>
import * as api from "_api/lease/log";
import {getHomeData} from '_api/base/home'
import todatDate from "./todatDate";
import newList from "./newList";
import board from "./board";

export default {
  name: "home",
  components: {
    "todat-date": todatDate,
    "new-list": newList,
    board: board
  },
  data() {
    return {
        homeData:{}
    };
  },
  mounted() {
    this.notice();
    this.getData();
  },
  methods: {
    async notice() {
      let res = await api.getNotice();
      if (res.code === 0) {
        if (res.data != null) {
          let log = res.data;
          let self = this;
          this.$Notice.open({
            title: log.title,
            duration: 0,
            render: h => {
              return h("div", [
                h("div", {
                  class: 'notice-warp',
                  domProps: {
                    innerHTML: log.content,
                  }
                }),
                h("div", {
                  class: 'btn-warp'
                }, [
                  h("Button", {
                    class: 'notice-button w90',
                    on: {
                      async click() {
                        let res = await api.know();
                        if(res.code === 0) {
                          self.$Notice.destroy();
                        }
                      }
                    }
                  }, '我已知晓')
                ])
              ]);
            }
          });
        }
      }
    },
      go(v){
        let right = this.$store.state.user.userData.resourceVOS
          if (right.some(item => item.name == v)){
              switch (v) {
                  case 1000:
                      this.$router.push({ name: 'goodsList'})
                      break
                  case 1001:
                      this.$router.push({ name: 'PlannedPurchaseOrder'})
                      break
                  case 1003:
                      this.$router.push({ name: 'TemporaryPurchase'})
                      break
                  case 1004:
                      this.$router.push({ name: 'OutsidePurchase'})
                      break
                  case 2000:
                      this.$router.push({ name: 'salesOrder'})
                      break
                  case 3101:
                      this.$router.push({ name: 'applyFor'})
                      break
                  case 5200:
                      this.$router.push({ name: 'payMentmanage'})
                      break
                  case 4000:
                      this.$router.push({ name: 'stockSearch'})
                      break
              }
          }else{
              this.$Message['error']({
                  background: true,
                  content: '暂无权限!需联系管理员开启权限'
              });

          }
      },
      getData(){
        getHomeData().then(res=>{
            if(res.code==0){
                this.homeData=res.data;
                for(let i in this.homeData){
                    this.homeData[i]=this.homeData[i]!==null?this.homeData[i]:0;
                }
            }
        })
      }
  }
};
</script>

<style lang="less" scoped>
.box-left {
  float: left;
  width: 70%;
  .quick-navigation {
    overflow: hidden;
  }
  .quick-all {
    /*background-size: 100% 100%;*/
    background-repeat: no-repeat;
    height: 110px;
    width: 100%;
    line-height: 110px;
    margin-right: 20px;
    flex-flow: row nowrap;
    border-radius: 20px 20px 0 0 ;
    img {
      padding-left: 20px;
      width: 65px;
      /*height: 50px;*/
      vertical-align: middle;
    }
    span {
      margin-left: 10px;
      font-size: 16px;
      color: #ffffff;
    }
  }
  .quick-one {
    background-color: #FD5C5C;
  }
  .quick-two {
    background-color: #FF9920;
  }
  .quick-three {
    background-color: #7562FF;
  }
  .quick-four {
    background-color: #29ABFF;
    margin-right: 0;
  }
  .quick-five {
    background-color: #29ABFF;
  }
  .quick-six {
    background-color: #28C1C1;
  }
  .quick-seven {
    background-color: #FF7743;
  }
  .quick-enigth {
    background-color: #8088A8;
    margin-right: 0;
  }
}
.box-right {
  float: right;
  width: 29%;
  height: 85vh;
  background: #ffffff;
  box-shadow: 0px 2px 6px 0px rgba(229, 229, 229, 0.8);
  border-radius: 5px;
  padding: 32px 20px;
}
</style>
<style>
.notice-warp {
  height: 100px;
  overflow: auto;
}
.btn-warp {
  margin: 10px auto 0px;
  display: flex;
  justify-content: center;
}
</style>
