<template>
  <div id="app">
    <keep-alive>
    <router-view :key="getRouteKey" v-if="isRouterAlive && $route.meta.keepAlive"/>
    </keep-alive>
    <router-view  :key="getRouteKey" v-if="isRouterAlive && !$route.meta.keepAlive"/>

  </div>
</template>

<script>
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true,
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      })
    },
  },
 computed:{
   getRouteKey () {
     // 当前路由的唯一key
     return this.$route.name + (this.$route.params.id || '')
   }
   },

  watch: {
      $route:{
          handler(val) {
              this.$ButtonShow()
          },
          deep:true
      }
  }
};
</script>

<style lang="less">
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
