<template>
  <div class="custom-bread-crumb pt10 pb10">
    <Breadcrumb :style="{fontSize: `${fontSize}px`}">
      <span class="fl red">
        <Icon type="md-pin"/>
      </span>
      <template v-for="(item, index) in list">
        <span class="breaditem" :key="item.path">
          <span v-if='item.redirect==="noredirect"||index==list.length-1' class="no-redirect">{{item.meta.title}}</span>
          <router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link>
          <span class="breadcrumbIcon">&gt;</span>
        </span>
      </template>
    </Breadcrumb>
  </div>
</template>
<script>
import { showTitle } from '_c/common/util'
import CommonIcon from '_c/common-icon'
import './custom-bread-crumb.less'
export default {
  name: 'customBreadCrumb',
  components: {
    CommonIcon
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    fontSize: {
      type: Number,
      default: 14
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    showTitle (item) {
      return showTitle(item, this)
    },
    isCustomIcon (iconName) {
      return iconName.indexOf('_') === 0
    },
    getCustomIconName (iconName) {
      return iconName.slice(1)
    }
  }
}
</script>
