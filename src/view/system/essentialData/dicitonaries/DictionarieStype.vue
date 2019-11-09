<template>
<div>
  <div class="dictonariesInquire">
    <span class="mr10">字典编码:</span>
    <input type="text">
    <span class="mr10">字典名称:</span>
    <input type="text">
    <Button type="warning"  class="w90 inquireBtn"><i class="iconfont mr5 iconchaxunicon"></i>查询</Button>
  </div>
  <div style="padding: 0 10px;width: 100%;height: 100%">
    <div class="treeTable">
      <p style="padding: 0 20px;line-height: 30px">
        <a> <i class="iconfont iconxinzengicon mr10" />添加</a>
        <a>修改</a>
      </p>
    </div>
  </div>
</div>
</template>

<script>
    export default {
        name: "dictionarieStype"
    }
</script>

<style scoped lang="less">
.dictonariesInquire{
  padding: 0px 20px;
  line-height: 57px;
  position: relative;
  input {
    height: 30px;
    width: 140px;
  }
  .inquireBtn {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.treeTable{
  width: 100%;
  height: 100%;
  border: 1px solid #dcdee2;
}
</style>
