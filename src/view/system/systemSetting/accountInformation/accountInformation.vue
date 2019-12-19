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
            <label>服务到期日期:</label><span>{{ maturity }} 剩余 <span style="color:#40a6ff;font-weight: bold;padding: 0 5px">{{ remainingDays }}</span>天</span>
          </div>
          <div class="navationTwo">
            <label>华币数量:</label><span>剩余 <span style="color: #40a6ff;font-weight: bold;padding: 0 5px">{{ amount }}</span>个</span>
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
            <label>版本:</label><span>非1.0版本</span>
          </div>
        </div>
        <div class="navone2 mt30">
          <div class="navone_one2">
            <span>模块信息</span>
          </div>
          <div class="navationTwo">
            <label>基础模块</label>
            <span>
             <ul class="List">
                 <li class="List_item" v-for="(item,index) in basicModule" :key="index">
                   <Button shape="circle" type="warning" class="colorWhite">{{ item.resName }}</Button>
                 </li>
             </ul>
            </span>
          </div>
          <div class="navationTwo">
            <label>升级模块</label>
            <span>
              <ul class="List">
                <li class="List_item" v-for="(item,index) in UpgradeModule" :key="index">
                  <Poptip trigger="hover"  :content="'有效期至:'+ item.expiryDate" v-if="item.flag == 1">
                    <Button shape="circle" :type="[item.flag === 1? 'warning':'Default']" class="colorWhite" @click="ProductsBuy(item)">{{ item.name }}</Button>
                  </Poptip>
                    <Button v-else shape="circle" :type="[item.flag === 1? 'warning':'Default']" class="colorWhite" @click="ProductsBuy(item)">{{ item.name }}</Button>
                </li>
                <!--<li class="List_item" v-for="(item,index) in UpgradeModule" :key="index"><Poptip trigger="hover" v-else :content="无有效期"><Button shape="circle" :type="[item.flag === 1? 'warning':'Default']" class="colorWhite" @click="ProductsBuy(item)">{{ item.name }}</Button></Poptip></li>-->
             </ul>
            </span>
          </div>
        </div>
      </div>
      <div class="boxBottom">
        <span>注:灰色为未够买产品,点击即可购买!</span>
      </div>
    </div>
</template>

<script>
  import { tenantInfo } from '../../../../api/system/account/account'
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
            phone: '',
            BranchNumber: '',
            versions: '',
            basicModule:[],
            UpgradeModule: [],
            hslArray: [],
            sendMsg:{}
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
        //购买产品
        ProductsBuy(item){
          // console.log(item)
          this.sendMsg = item
          console.log(this.sendMsg)
          if(item.flag !== 1){
            this.$router.push({
              path: '/accountInformation/ProductsBuy',
              query: this.sendMsg
            })
          }
        },
        // //随机颜色
        // randomRgb(item) {
        //   let R = Math.floor(Math.random() * 255);
        //   let G = Math.floor(Math.random() * 255);
        //   let B = Math.floor(Math.random() * 255);
        //   return {
        //     background: 'rgb(' + R + ',' + G + ',' + B + ')'
        //   };
        // },
  // :style="randomRgb()"
        //初始化
        getList(){
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
            this.basicModule = res.data.menus
            this.UpgradeModule = res.data.products
            console.log('我是贩夫贩妇',this.UpgradeModule)
            // this.hslArray = this.getHslArray();
          })
        },
        // hslToRgb: function (H, S, L) {
        //   var R, G, B;
        //   if (+S === 0) {
        //     R = G = B = L; // 饱和度为0 为灰色
        //   } else {
        //     var hue2Rgb = function (p, q, t) {
        //       if (t < 0) t += 1;
        //       if (t > 1) t -= 1;
        //       if (t < 1/6) return p + (q - p) * 6 * t;
        //       if (t < 1/2) return q;
        //       if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        //       return p;
        //     };
        //     var Q = L < 0.5 ? L * (1 + S) : L + S - L * S;
        //     var P = 2 * L - Q;
        //     R = hue2Rgb(P, Q, H + 1/3);
        //     G = hue2Rgb(P, Q, H);
        //     B = hue2Rgb(P, Q, H - 1/3);
        //   }
        //   return [Math.round(R * 255), Math.round(G * 255), Math.round(B * 255)];
        // },
        // 获取随机HSL
        randomHsl: function () {
          var H = Math.random();
          var S = Math.random();
          var L = Math.random();
          return [H, S, L];
        },

        // 获取HSL数组
        // getHslArray: function () {
        //   var HSL = [];
        //   var hslLength = this.basicModule.length; // 获取数量
        //   for (var i = 0; i < hslLength; i++) {
        //     var ret = this.randomHsl();
        //
        //     // 颜色相邻颜色差异须大于 0.25
        //     if (i > 0 && Math.abs(ret[0] - HSL[i - 1][0]) < 0.25) {
        //       i--;
        //       continue; // 重新获取随机色
        //     }
        //     ret[1] = 0.7 + (ret[1] * 0.2); // [0.7 - 0.9] 排除过灰颜色
        //     ret[2] = 0.4 + (ret[2] * 0.4); // [0.4 - 0.8] 排除过亮过暗色
        //
        //     // 数据转化到小数点后两位
        //     ret = ret.map(function (item) {
        //       return parseFloat(item.toFixed(2));
        //     });
        //
        //     HSL.push(ret);
        //   }
        //   return HSL;
        // }
      },
      mounted(){
          this.getList()
      },
      created: function () {

      },
      // computed: {
      //   rgbArray: function () {
      //     var self = this;
      //     if (!self.hslArray.length) return [];
      //
      //     var rgbArray = self.basicModule.map(function (item) {
      //       return self.hslToRgb.apply(this,item);
      //     });
      //
      //     return rgbArray.map(function (item) {
      //       console.log(item)
      //       return item.style = { background: 'rgb(' + item.toString() + ')' }
      //
      //     });
      //   }
      // },
    }
</script>

<style scoped>
  @import "./accointInformation.css";
</style>
<style scoped>
  .List{
    display: flex;
    align-items: center;
    list-style: none;
  }
  .List_item{
    margin-right: 5px;
  }
  .colorWhite{
    /*color: white;*/
    /*border: none!important;*/
  }
</style>
