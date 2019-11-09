<template>
  <custom-bread-crumb show-icon  :list="levelList" v-if="levelList.length>0"></custom-bread-crumb>
</template>

<script>
import customBreadCrumb from '../custom-bread-crumb/'
import routes from '@/router/routers'
export default {
  name: 'myBreadCrumb',
  components: {
    customBreadCrumb
  },
  data () {
    return {
      levelList: null
    }
  },
  created () {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb () {
      if (this.$route.name !== 'home') {
        this.getSecondsCrumb()
      }else{
        this.levelList=[]
      }
    },
    getSecondsCrumb(){
      const activName = this.$route.meta.activeName
      if (activName) {
        let leveArr = routes.filter(item => item.name==this.$route.matched[0].name)
        if(leveArr.length>0){
          if(leveArr[0].children&&leveArr[0].children.length>0){
            let secondObj = leveArr[0].children.filter(item => item.name==activName)
            let arrData = []
            this.$route.matched.forEach(item => {
              arrData.push(item)
            })

            arrData.splice(1,0,secondObj[0])
            this.levelList = arrData
          }
        }
      }else{
        this.levelList = this.$route.matched
      }
    }
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  }
}
</script>

<style scoped>

</style>
