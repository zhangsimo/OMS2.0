<template>
      <div class="bigbox">
        <Split v-model="split" mode="vertical">
          <div slot="top" class="demo-split-pane2 no-paddipng">
            <div class="top_left">
              <div class="db btn-title">
                <p class="mr10">备货级别定义:</p>
                <Button class="mr10 w90" @click="add">
              <span class="center">
                <Icon type="md-add" />新增
              </span>
                </Button>
                <Button class="mr10 w90" @click="save">
              <span class="center">
                <Icon custom="iconfont iconbaocunicon icons" />保存
              </span>
                </Button>
              </div>
              <Table
                border
                highlight-row
                size="small"
                :loading="topLeft.loading"
                :stripe="true"
                :columns="topLeft.columns"
                :data="topLeft.tbdata"
              ></Table>
            </div>
            <div class="top_right">right</div>
          </div>
          <div slot="bottom" class="demo-split-pane">
            Bottom Pane
          </div>
        </Split>
      </div>
</template>

<script>
    export default {
        name: "AccessoriesBrand",
      data(){
          return {
            split: 0.5,
            topLeft:{
              loading: false,
              tbdata:[],
              columns:[]
            }
          }
      }
    }
</script>

<style scoped>
.bigbox{
  height: 750px;
  background: #ffffff;
}
  .demo-split-pane{
    padding: 10px;
  }
  .no-paddipng{
    padding: 0;
  }
  .demo-split-pane2{
    height: 100%;
    display: flex;
  }
  .top_left{
    padding: 10px;
    width: 40%;
    height: 100%;
  }
  .top_right{
    width: 60%;
    height: 100%;
    padding: 10px;
  }
</style>
