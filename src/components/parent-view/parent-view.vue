<template>
  <keep-alive :include="cacheList">
    <router-view/>
  </keep-alive>
</template>
<script>
export default {
  name: 'ParentView',
  computed:{
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    cacheList () {
      let cacheList = this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []
      return cacheList
    }
  }
}
</script>
