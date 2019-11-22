<template>
    <div style="height:100%">
      <div class="headerBox">
      <span class="mr10">快速查询:</span>
      <getDate class="mr10"  @quickDate="getvalue" ></getDate>
        <Select v-model="orderType" style="width:100px" class="mr10">
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
        </Select>
        <Button type="default"  class="mr10">...更多</Button>
        <Button type="default" class="mr10 w90"><Icon type="md-add" size="14" /> 新增</Button>
        <Button class="mr10 w90" ><span class="center"><Icon custom="iconfont iconbaocunicon icons"/>保存</span></Button>
        <Button class="mr10"><i class="iconfont mr5 iconxuanzetichengchengyuanicon"></i>提交</Button>
        <Button class="mr10"><i class="iconfont mr5 iconxuanzetichengchengyuanicon"></i>出库</Button>
        <Button class="mr10"><i class="iconfont mr5 icondayinicon"></i> 打印</Button>
        <Button class="mr10"><Icon type="md-close" size="14" /> 作废</Button>
        <Button class=""><i class="iconfont mr5 icondaochuicon"></i> 导出</Button>
      </div>
      <div class="conter">
        <div class="demo-split">
          <Split v-model="split1">
            <div slot="left" class="demo-split-pane">
              <OrderLeft></OrderLeft>
            </div>
            <div slot="right" class="demo-split-pane">
              <OrderRight></OrderRight>
            </div>
          </Split>
        </div>

      </div>
    </div>
</template>

<script>
  import getDate from '@/components/getDate/dateget'
  import OrderLeft from "./OrderLeft";
  import OrderRight from "./OrderRight";
    export default {
        name: "Order",
        components:{
            getDate,
            OrderLeft,
            OrderRight
        },
        data(){
          return {
              orderType:6,
              typeList:[
                  {value:6,name:'全部'},
                  {value:0,name:'草稿'},
                  {value:1,name:'已提交'},
                  {value:2,name:'待拣货'},
                  {value:3,name:'待出库'},
                  {value:4,name:'已出库'},
                  {value:5,name:'已作废'},
              ],
              split1: 0.2

          }
        },
        methods:{
            //获取时间
            getvalue(date){
                console.log(date)
            }
        }
    }
</script>

<style scoped lang="less">
.headerBox {
  border-bottom: 1px #e0e0e0 solid;
  padding-left: 10px;
  padding-bottom: 16px;
}
.demo-split{
  height: 100%;
  border: 1px solid #dcdee2;
}

  .conter{
    height: 100%;
    width: 100%;
    padding: 10px;
  }
</style>
