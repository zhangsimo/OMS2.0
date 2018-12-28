<template>
  <Submenu :name="`${parentName}`">
    <template slot="title">
      <div class="l_inner"><span class="leftSilderItemIcon"><Icon :type="parentItem.icon" size="18"/></span><span>{{ showTitle(parentItem) }}</span></div>
    </template>
    <template v-for="item in children">
      <template v-if="item.children && item.children.length === 1">
        <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
        <menu-item v-else :name="getNameOrHref(item, true)" :key="`menu-${item.children[0].name}`"><div class="l_inner"><span class="l_w"></span><span>{{ showTitle(item.children[0]) }}</span></div></menu-item>
      </template>
      <template v-else>
        <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
        <menu-item v-else :name="getNameOrHref(item)" :key="`menu-${item.name}`">
          <div class="l_inner"><span class="l_w"></span><span>{{ showTitle(item) }}</span></div>
        </menu-item>
      </template>
    </template>
  </Submenu>
</template>
<script>
import mixin from './mixin'
import itemMixin from './item-mixin'
export default {
  name: 'SideMenuItem',
  mixins: [ mixin, itemMixin ]
}
</script>
