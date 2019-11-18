<template>
    <div class="bigbox2">
      <div class="header">
        <Button type="warning" class="mr15" @click="recharge"><span class="center"><Icon custom="iconfont iconziyuan12 icons" />华币充值</span></Button>
        <Button class="mr10" @click="record"><span class="center"><Icon custom="iconfont iconziyuan10 icons" />充值消费记录</span></Button>
      </div>
      <div class="boxnav">
        <div class="navone2">
          <div class="navone_one2">
            <span>基础信息</span>
          </div>
          <div class="navationTwo">
            <label>商户号:</label><span> {{ tenantNumber }}</span>
          </div>
          <div class="navationTwo">
            <label>商户名称:</label><span>{{ tenantName }}</span>
          </div>
          <div class="navationTwo">
            <label>服务到期日期:</label><span>{{ maturity }} 剩余{{ remainingDays }}天</span>
          </div>
          <div class="navationTwo">
            <label>华币数量:</label><span>剩余{{ amount }}个</span>
          </div>
          <div class="navationTwo">
            <label>负责人:</label><span>{{ principal }}</span>
          </div>
          <div class="navationTwo">
            <label>联系电话:</label><span>{{ phone }}</span>
          </div>
          <div class="navationTwo">
            <label>分店数量:</label><span>{{ BranchNumber }}</span>
          </div>
          <div class="navationTwo">
            <label>版本:</label><span>{{ versions }}</span>
          </div>
        </div>
        <div class="navone2 mt30">
          <div class="navone_one2">
            <span>模块信息</span>
          </div>
          <div class="navationTwo">
            <label>基础模块</label><span>181........</span>
          </div>
          <div class="navationTwo">
            <label>升级模块</label><span>181........</span>
          </div>
        </div>
      </div>
      <div class="boxBottom">
        <span>注:灰色为未够买产品,点击即可购买!</span>
        <Button typ="warning" @click="ProductsBuy">产品购买</Button>
      </div>
    </div>
</template>

<script>
  import {tenantInfo} from '../../../../api/system/account/account'
    export default {
        name: "accountInformation",
      data(){
          return {
            tenantNumber: '',
            tenantName: '',
            maturity: '',
            remainingDays: '',
            amount: '',
            principal: '',
            phone: '13934891494',
            BranchNumber: '19',
            versions: '连锁版',
            basicModule:[],
            UpgradeModule: []
          }
      },
      methods: {
        //充值按钮
        recharge(){
          this.$router.push('/accountInformation/recharge')
        },
        //消费纪录按钮
        record(){
          this.$router.push('/accountInformation/record')
        },
        ProductsBuy(){
          this.$router.push('/accountInformation/ProductsBuy')
        }
      },
      mounted(){
          let data = {}
        tenantInfo(data).then( res => {
            this.tenantNumber = res.data.code
            this.tenantName = res.data.tenantName
            this.maturity = res.data.endDate
            this.remainingDays = res.data.remainDay
            this.amount = res.data.remainCoin
            this.principal = res.data.salesMan
            this.phone = res.data.mobile
            this.BranchNumber = res.data.orgQty
            // this.versions = res.data
            this.basicModule = res.data
        })
      }
    }
</script>

<style scoped>
  @import "./accointInformation.css";
</style>
