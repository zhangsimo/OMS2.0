<template>
    <div>
      <h5 style="font-size: 14px;margin-bottom: 30px">新闻公告</h5>
      <ul class="newlist">
        <li>
          <p><v-clamp :max-lines="1">● 有新订单即使处理23123123123123123123123123112312312313123 </v-clamp></p>
          <p style="margin-left: 12px;font-size: 12px;margin-top: 10px">2019-12-12 11:11 </p>
        </li>
        <li>
          <p><v-clamp :max-lines="1">● 有新订单即使处理23123123123123123123123123112312312313123 </v-clamp></p>
          <p style="margin-left: 12px;font-size: 12px;margin-top: 10px">2019-12-12 11:11 </p>
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
    width: 360px;
    height: 35px;
    text-align: center;
    line-height: 35px;
    border-radius: 5px;
    cursor: pointer;
    border: solid 1px #e61414;
    color: #e61414;
  }
</style>
