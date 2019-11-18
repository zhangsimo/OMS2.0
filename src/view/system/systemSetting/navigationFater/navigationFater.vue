<template>
  <div class="oper-box">
    <div class="bigbox">
      <Row :gutter="20">
        <Col span="6" v-for="(item,index) in Arr" :key="index">
          <div class="items">
            <div class="item_header">{{ item.title }}</div>
            <div class="item_body">
              <div class="nav">{{ item.remake }}</div>
              <div class="nav_button"><Button type="warning" @click="HopRouting(index)">{{ item.name }}</Button></div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  </div>

</template>

<script>
  import {sysInitialize} from '../../../../api/system/systemSetting/Initialization.js'
  export default {
        name: "navigationFater",
        data(){
          return{
            Arr:[]
          }
        },
      methods:{
        HopRouting(index) {
          // console.log(this.Arr[index].title)
          switch (this.Arr[index].title) {
            case "业务参数":
              this.$router.push()
                  return
            case "门店设置":
                this.$router.push({name:'storeManagement'})
                  return
            case "销售提成设置":
              this.$router.push()
                return
            case "配件提成":
              this.$router.push({name: 'AccessoriesCommission'})
                return
            case "配件品牌":
              this.$router.push({name: 'AccessoriesBrand'})
                return
            case "品牌车型":
              this.$router.push({name: 'brandCarModel'})
              return
            case "配件分类":
              this.$router.push({name: 'AccessoriesCategory'})
              return
            case "自定义分类设置":
              this.$router.push({name: 'CustomClassification'})
              return
            case "备货级别设置":
              this.$router.push({name: 'StockLevel'})
              return
            case "仓库设置":
                this.$router.push({name:'setWarehouse'})
              return
            case "结算账户":
              this.$router.push()
              return
            case "初期库存":
              this.$router.push()
              return
            case "初期现金银行":
              this.$router.push()
              return
            case "初期应收应付":
              this.$router.push({name: 'receiptPayment'})
              return
          }
        }
      },
    mounted(){
      sysInitialize().then(res => {
        this.Arr = res.data
      })
    }
    }
</script>

<style scoped>
@import "index.css";
</style>
