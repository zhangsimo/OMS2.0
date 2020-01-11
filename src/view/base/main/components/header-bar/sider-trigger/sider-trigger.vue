<template>
  <a @click="handleChange" type="text" class="sider-trigger-a" :class="{'silder-show':collapsed}"><Icon :type="icon" :size="size" /></a>
</template>
<script>
export default {
  name: 'siderTrigger',
  props: {
    collapsed: Boolean,
    icon: {
      type: String,
      default: 'ios-menu'
    },
    size: {
      type: Number,
      default: 24
    }
  },
  methods: {
    handleChange () {
      this.$emit('on-change', !this.collapsed)
    }
  }
}
</script>
<style lang="less">
@import './sider-trigger.less';
</style>
