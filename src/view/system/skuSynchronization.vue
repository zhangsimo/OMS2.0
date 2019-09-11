<template>
  <div>
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db clearfix">
            <div class="fl">
              <span>同步日期：</span>
              <DatePicker @on-change="selectDate" :value="date" format="yyyy-MM-dd" type="date" class="mr20" placement="bottom-end" placeholder="年-月-日" style="width: 200px"></DatePicker>
              <Button type="warning" @click="synchron" class="mr20">查询</Button>
              <Tooltip class="top-wrap" content="等待OMS系统定时任务处理" placement="right">
                <span class="tip-text"><Icon type="ios-help-outline" class="fs20"></Icon></span>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import {getDateNoTime} from "../../libs/tools";
  import {skuSync} from "../../api/system/systemApi";

  export default {
		name: "skuSynchronization",
    data(){
		  return {
        date:''
      }
    },
    mounted(){
      this.date = getDateNoTime(new Date().getTime())
    },
    methods:{
      selectDate(date){
        this.date = date
      },
      synchron(){
        skuSync({"date":this.date}).then(res=>{
          if(res.code==0){
            this.$Message.success("设置成功！")
          }
        })
      }
    }
	}
</script>

<style lang="less">
  .tip-text{
    color: #f90;
    vertical-align: middle;
    i{
      vertical-align: middle;
    }
  }
  .top-wrap{
    .ivu-tooltip-inner{
      background-color: #fff;
      color: #f90;
    }
    .ivu-tooltip-popper[x-placement^="right"] .ivu-tooltip-arrow{
      border-right-color: #f90;
    }
  }
</style>
