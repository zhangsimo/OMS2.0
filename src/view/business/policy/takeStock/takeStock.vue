<template>
  <div style="height:100%" class="bigBox">
    <div class="headerBox">
      <span class="mr10">快速查询:</span>
      <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>
      <Select v-model="orderType" style="width:100px" class="mr10">
        <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
      </Select>
      <Button type="default"   @click="openQueryModal" class="mr10"><Icon type="ios-more" />更多</Button>
      <Button type="default" class="mr10 w90"><Icon type="md-add" size="14" /> 新增</Button>
      <Button class="mr10 w90" ><span class="center"><Icon custom="iconfont iconbaocunicon icons"/>保存</span></Button>
      <Button class="mr10"><i class="iconfont mr5 iconxuanzetichengchengyuanicon"></i>出库</Button>
      <Button class="mr10"><i class="iconfont mr5 icondayinicon"></i> 打印</Button>
      <Button class="mr10"><Icon type="md-close" size="14" /> 作废</Button>
    </div>
    <div class="conter">
      <div class="demo-split">
        <Split v-model="split1">
          <div slot="left" class="demo-split-pane">
            <take-stock-left :orderType ='orderType' :queryTime="queryTime"></take-stock-left>
          </div>
          <div slot="right" class="demo-split-pane">
<!--            <market-right ref="right"></market-right>-->
            <take-stock-right ref="right"></take-stock-right>
          </div>
        </Split>
      </div>
      <!--        更多搜索-->
      <More-query :data="queryList" ref="morequeryModal"></More-query>
      <!--        打印-->
      <!--      <Print-show ref="printBox"></Print-show>-->
    </div>
  </div>
</template>

<script>
    import QuickDate from '../../../../components/getDate/dateget' // 日期查询
    import takeStockLeft from "./takeStockLeft";   // 左边
    import takeStockRight from "./takeStockRight"; // 右边
    export default {
        name: "takeStock",
        components:{
            QuickDate,
            takeStockLeft,
            takeStockRight
        },
        data(){
         return{
             advanced: false, //更多模块的弹框
             orderType:4,
             typeList:[
                 {value:4,name:'全部'},
                 {value:0,name:'草稿'},
                 {value:1,name:'已提交'},
                 {value:2,name:'已完成'},
                 {value:3,name:'已作废'},
             ],
             split1: 0.2,
             queryList:{
                 isdisabad:true
             },//更多查询
             queryTime:'',//快速查询时间

         }
         },
        methods:{
            //获取日期
            getDataQuick(v){
                // console.log(v)
            },
            //获取时间
            getvalue(date){
                this.queryTime = date
            },
            //打印表格
            printTable(){
                // this.$refs.printBox.openModal()
            },
            // 打开更多搜索
            openQueryModal(){
                this.$refs.morequeryModal.openModal()
            }
        }

    }
</script>

<style scoped lang="less">
  .headerBox {
    border-bottom: 1px #e0e0e0 solid;
    padding-left: 10px;
    padding-bottom: 16px;
    padding-top: 16px;
  }

  .demo-split {
    height: 100%;
    border: 1px solid #dcdee2;
  }

  .conter {
    height: 100%;
    width: 100%;
    padding: 10px;
    overflow: hidden;
  }

  .bigBox {
    background-color: #fff;

  }
</style>
