<template>
  <div style="height: 100%">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
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
