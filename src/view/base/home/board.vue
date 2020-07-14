<template>
    <div style="display: flex">
      <div class="boardLeft">
        <h5 style="margin-bottom: 20px">库存统计</h5>
        <div>
          <Row>
            <Col span="12" class="pr10">
              <div class="static pl20" >
                <div class="staticTop">
                  库存总成本
                </div>
                <h5 class="staticBottom">
                  ￥{{dataObj.totalAmt}}
                </h5>
              </div>
            </Col>
            <Col span="12"  class="pl10">
              <div class="static staticColor pl20">
                <div class="staticTop">
                  库存SKU种类
                </div>
                <h5 class="staticBottom">
                  {{dataObj.skuQty}}
                </h5>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div class="boardRight">
        <h5 style="margin-bottom: 20px">待办事项</h5>
        <ul>
          <li>
            <Row>
              <Col span="20">
            <a @click="go(1000)">
            <img src="../../../assets/images/home/rukuguanli.png" alt="">
              待提交采购计划
            </a>
              </Col>
              <Col span="4">
            <span class="munber">{{dataObj.pchsplanQty}}</span>
              </Col>
            </Row>
          </li>

          <li>
            <Row>
              <Col span="20">
            <a>
            <img src="../../../assets/images/home/chukuguanli.png" alt="">
              待提交销售订单
            </a>
              </Col>
              <Col span="4">
              <span class="munber2">{{dataObj.sellOrderQty}}</span>
              </Col>
            </Row>
          </li>


          <li>
            <Row>
              <Col span="20">
              <a>
            <img src="../../../assets/images/home/fukuan.png" alt="">
              待收货计划采购订单
            </a>
              </Col>
              <Col span="4">
                <div v-if="dataObj.submitMap">
                  <span class="munber">{{dataObj.submitMap.planQty}}</span>
                </div>
              </Col>
            </Row>
          </li>

          <li>
            <Row>
              <Col span="20">
              <a>
            <img src="../../../assets/images/home/yingshoukuan.png" alt="">
              已提交销售订单
            </a>
              </Col>
              <Col span="4">
              <span class="munber2">{{dataObj.sellOrderSubmitQty}}</span>
              </Col>
            </Row>
          </li>

          <li>
            <Row>
              <Col span="20">
              <a>
            <img src="../../../assets/images/home/duizhangdan .png" alt="">
            待收货临时采购订单
            </a>
              </Col>
              <Col span="4">
                <div v-if="dataObj.submitMap">
                  <span class="munber">{{dataObj.submitMap.tempQty}}</span>
                </div>
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span="20">
              <a>
            <img src="../../../assets/images/home/caigouguanli .png" alt="">
            待受理调拨申请单
            </a>
              </Col>
              <Col span="4">
              <span class="munber2">{{dataObj.waitAcceptAllocateOrderQty}}</span>
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span="20">
              <a>
            <img src="../../../assets/images/home/tuidanguanli.png" alt="">
            待收货外采订单
            </a>
              </Col>
              <Col span="4">
                <div v-if="dataObj.submitMap">
                  <span class="munber">{{dataObj.submitMap.outQty}}</span>
                </div>
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span="20">
              <a>
              <img src="../../../assets/images/home/tuidanguanli.png" alt="">
              草稿对账单
            </a>
              </Col>
              <Col span="4">
            <span class="munber2">{{dataObj.draftOrderQty}}</span>
              </Col>
            </Row>
          </li>

        </ul>
      </div>
    </div>
</template>

<script>
    export default {
        name: "board",
        methods:{
            go(v){
                let right = this.$store.state.user.userData.resourceVOS
                if (right.some(item => item.name == v)){
                    switch (v) {
                        case 1000:
                            this.$router.push({ name: 'goodsList',params:{}})
                            break
                        case 2000:
                            this.$router.push({ name: 'salesOrder'})
                            break
                        case 1001:
                            this.$router.push({ name: 'plannedPurchaseOrder'})
                            break
                        case 2000:
                            this.$router.push({ name: 'salesOrder'})
                            break
                        case 2000:
                            this.$router.push({ name: 'salesOrder'})
                            break
                        case 3101:
                            this.$router.push({ name: 'applyFor'})
                            break
                        case 5200:
                            this.$router.push({ name: 'settlementManagement-paymentmanage'})
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
        },
      mounted() {
          console.log(this.dataObj,typeof(this.dataObj),"???")
      },
      props:{
        dataObj:{
          type:Object,
          dafault:function(){
            return {}
          }
        }
      }
    }
</script>

<style scoped lang="less">
.static {
  width: 100% ;
  height: 150px;
  background-color: #F7F0FC;
  .staticTop{
    /*height: 50%;*/
    line-height: 75px;
    font-size: 16px;
  }
  .staticBottom {
    /*height: 50%;*/
    font-size: 18px;
    font-weight: 700;
  }
}
.staticColor {
  background-color: #E8F8F0;
}
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
      width: 50%;
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
  /*float: right;*/
  font-weight: 700;
  /*margin-right: 27%;*/
}

.munber2{
  /*float: right;*/
  font-weight: 700;
  /*margin-right: 0px;*/
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
