<template>
  <custom-bread-crumb show-icon  :list="levelList"></custom-bread-crumb>
</template>

<script>
import customBreadCrumb from '../custom-bread-crumb/'
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
      let matched = this.$route.matched.filter((item, index) => {
        if ( index > 0 ) {
          return item.name
        }
      })
      const first = matched[0]
      if (first && first.name === 'home') {
        matched = []
      }
      this.levelList = matched
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
