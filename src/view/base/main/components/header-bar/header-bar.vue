<template>
  <div class="header-bar">
    <sider-trigger :collapsed="collapsed" icon="navicon-round" @on-change="handleCollpasedChange"></sider-trigger>
    <div class="custom-content-con" style="width: 90%">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import siderTrigger from './sider-trigger'
import './header-bar.less'
export default {
  name: 'HeaderBar',
  components: {
    siderTrigger
  },
  props: {
    collapsed: Boolean
  },
  computed: {
    // breadCrumbList () {
    //   return this.$store.state.app.breadCrumbList
    // }
  },
  methods: {
    handleCollpasedChange (state) {
      this.$emit('on-coll-change', state)
    }
  }
}
</script>
