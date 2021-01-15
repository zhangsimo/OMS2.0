import { mapMutations } from "vuex";

const mixin = {
  ...mapMutations([ "setTagNavList"]),
  data() {
    return {
    }
  },
  mounted() {
    this.routePath = this.$route.path
    //进入页面判断是否是缓存组件
    if (this.$route.meta.keepAlive){
      let key = !this.$vnode.key ? this.$vnode.componentOptions.Ctor.cid : this.$vnode.key
      let list =  this.$store.state.app.tagNavList
      list.forEach( item => {
        if(item.name === this.$route.name){
          item.key = key
        }
      })
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.app.tagNavList
    }
  },
  watch: {
    visitedViews(value ,old){
      if (value.length < old.length) {
        let destroyDom = old.filter( item => {
          let list = value.map( v => v.name)
          return !list.includes(item.name)
        })
        if (destroyDom && destroyDom.length >0 ){
          if (this.$vnode.componentOptions){
            let cache = this.$vnode.parent.componentInstance.cache
            let keys = this.$vnode.parent.componentInstance.keys
            destroyDom.forEach( item =>{
              if (keys.includes(item.key)){
                delete cache[item.key]
              }
            })
            this.$destroy()
          }
        }
      }
    }
  }
}


export default mixin
