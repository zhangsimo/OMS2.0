<template>
  <div class="oper-box">
    <div class="bigbox">
      <Row :gutter="20">
        <Col span="6" v-for="(item,index) in Arr" :key="index">
          <div class="items" v-has:[item.mark]="">
            <div class="item_header">{{ item.title }}</div>
            <div class="item_body">
              <div class="nav">{{ item.remake }}</div>
              <div class="nav_button">
                <Button type="warning" @click="HopRouting(index)">{{ item.name }}</Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  </div>

</template>

<script>
  import {sysInitialize} from '../../../../api/system/systemSetting/Initialization.js'
  import routers from "../../../../router/routers";

  export default {
    name: "navigationFater",
    data() {
      return {
        Arr: []
      }
    },
    methods: {
      HopRouting(index) {
        // console.log(this.Arr[index].title)
        switch (this.Arr[index].title) {
          case "业务参数":
            this.$router.push({name: 'sysetmset'})
            return
          case "门店设置":
            this.$router.push({name: 'storeManagement'})
            return
          // case "销售提成设置":
          //   this.$router.push({name: ''})
          //     return
          // case "配件提成":
          //   this.$router.push({name: 'AccessoriesCommission'})
          //     return
          // case "配件品牌":
          //   this.$router.push({name: 'AccessoriesBrand'})
          //     return
          case "品牌车型":
            this.$router.push({name: 'brandCarModel'})
            return
          // case "配件分类":
          //   this.$router.push({name: 'AccessoriesCategory'})
          //   return
          case "自定义分类设置":
            this.$router.push({name: 'CustomClassification'})
            return
          case "备货级别设置":
            this.$router.push({name: 'StockLevel'})
            return
          case "仓库设置":
            this.$router.push({name: 'setWarehouse'})
            return
          case "结算账户":
            this.$router.push({name: 'SettlementAccount'})
            return
          case "期初库存":
            this.$router.push({name: 'inventory'})
            return
          case "期初现金银行":
            this.$router.push({name: 'setBank'})
            return
          // case "期初应收应付":
          //   this.$router.push({name: 'receiptPayment'})
          //   return
        }
      },
      flatten: function (arr) {
        return [].concat(...arr.map(item => [].concat(item, ...this.flatten(item.children?item.children:[]))))
      }
    },
    created() {
      let arr=this.flatten(routers)
      sysInitialize().then(res => {
        this.Arr = res.data.map(el=>{
          arr.map(el2=>{
            if(el2.meta && (el2.meta.title==el.title)){
              el.mark=el2.mark;
            }
          })
          return el;
        })
      })
    }
  }
</script>

<style scoped>
  @import "index.css";
</style>
