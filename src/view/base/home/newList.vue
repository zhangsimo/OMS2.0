<template>
    <div>
      <h5 style="font-size: 14px;margin-bottom: 30px">新闻公告</h5>
      <ul class="newlist">
        <li>
          <h5><v-clamp :max-lines="1">● 2020年9月1日起，佳配新ERP（OMS 2.0）正式上线启用，替换老ERP系统 </v-clamp></h5>
          <p style="margin-left: 12px;font-size: 12px;margin-top: 10px">
            老ERP系统将作以下调整：<br/>
              关闭所有业务单据开单、申请功能
              将保留2020年9月1日之前的所有业务数据、单据查询、报表查询、财务查询等统计导出功能
            9月1日之前，敬请大家百忙抽空，熟悉并试用新系统，提出宝贵建议。</p>
        </li>
      </ul>
      <div class="btn">查看更多</div>
    </div>
</template>

<script>
    import VClamp from 'vue-clamp'
    export default {
        name: "newList",
        components:{
            VClamp
        }
    }
</script>

<style scoped lang="less">
.newlist {
  width: 100%;
  list-style: none;
  li {
    color: #666666;
    margin-bottom: 32px;
  }
  li:hover {
    color: #e61414;
    cursor: pointer
  }
}
  .btn {
    width: 90%;
    height: 35px;
    text-align: center;
    line-height: 35px;
    border-radius: 5px;
    cursor: pointer;
    border: solid 1px #e61414;
    color: #e61414;
  }
</style>
