<template>
    <div style="height: 100%">
      <div class="titleMoney">
        <Divider orientation="left">
          <span class="titler mr5">固定额度:</span>
          <span class="titler mr10">{{ 31231 |priceFilters}}</span>
          <span class="titler mr5">临时余额:</span>
          <span class="titler mr10">{{ 31231 |priceFilters}}</span>
          <span class="titler mr5">可用余额:</span>
          <span class="titler mr5">{{ 31231 |priceFilters}}</span>
        </Divider>
      </div>
      <div>
        <span class="mr5">客户:</span>
      </div>
    </div>
</template>

<script>
    export default {
        name: "OrderRight"
    }
</script>

<style scoped lang="less">
.titleMoney {
 .titler {
   font-size: 14px;
 }
}
</style>
