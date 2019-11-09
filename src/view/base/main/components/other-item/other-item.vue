<template>
    <div class="other-item">
      <a class="mr20" href="#">客服</a>
      <a class="mr20" href="#">反馈</a>
      <Icon class="mr20" type="md-home" size="16"/>
      <Icon class="mr20" type="md-sync" size="16"/>
      <Icon class="mr20" type="md-close" size="16"/>
    </div>
</template>

<script>
  export default {
    name: 'other-item'
  }
</script>

<style scoped lang="less">
  .other-item > *{
    color: #333;
    cursor: pointer;
  }
</style>
