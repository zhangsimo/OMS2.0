<template>
  <div style="height: 100%">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" :max="10" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" :max="10" />
  </div>
</template>
<script>
export default {
  name: 'ParentView',
  computed:{
    // tagNavList () {
    //   return this.$store.state.app.tagNavList
    // },
    // cacheList () {
    //   let cacheList = this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []
    //   return cacheList
    // }
  }
}
</script>
