
<template>
  <div class="demo-split">
    <Split v-model="split1">
      <div slot="left" class="demo-split-pane">
        <h5>数据字典类型</h5>
        <DictionarieStype></DictionarieStype>
      </div>


      <div slot="right" class="demo-split-pane">
        <h5>数据字典项</h5>
      </div>
    </Split>
  </div>
</template>
<script>
  import DictionarieStype from "./DictionarieStype";
  import DictonarietNape from "./DictonarietNape";
    export default {
        components:{
            DictionarieStype,
            DictonarietNape
        },
        data () {
            return {
                split1: 0.5,
            }
        },
    }
</script>
<style scoped lang="less">
  .demo-split{
    height: 100%;
    background: #ffffff;
    border: 1px solid #dcdee2
  }
  .demo-split-pane{
    h5 {
      font-size: 16px;
      border-bottom: 1px solid #eee;
      padding: 10px
    }
  }
</style>
