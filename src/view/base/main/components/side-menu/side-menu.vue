<template>
  <div class="side-menu-wrapper">
    <slot></slot>
    <div class="leftInner" id="leftInner" :class="{'leftActive':!collapsed}" >
      <Menu ref="menu"  :active-name="activeName" :open-names="openMenuFun" :accordion="accordion" class="left-menu"  width="auto" @on-select="handleSelect">
        <template v-for="item in menuList">
          <template v-if="item.children && item.children.length === 1">
            <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
            <menu-item v-else :name="getNameOrHref(item, true)" :key="`menu-${item.children[0].name}`">
              <div class="l_inner"><span class="leftSilderItemIcon"><common-icon :size="18" :type="item.children[0].icon || ''"/></span><span>{{ showTitle(item.children[0]) }}</span></div>
            </menu-item>
          </template>
          <template v-else>
            <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
            <menu-item v-else :name="getNameOrHref(item)" :key="`menu-${item.name}`"><div class="l_inner"><span>{{ showTitle(item) }}</span></div></menu-item>
          </template>
        </template>
      </Menu>
    </div>
      <div class="menu-collapsed" :class="{'leftActive':collapsed}" :list="menuList" >
        <template v-for="item in menuList">
          <collapsed-menu  v-if="item.children && item.children.length > 1" @on-click="handleSelect" hide-title :root-icon-size="rootIconSize" :icon-size="iconSize" :theme="theme" :parent-item="item" :key="`drop-menu-${item.name}`" :active-name="activeName"></collapsed-menu>
          <Tooltip v-else :content="item.meta.title || item.children[0].meta.title" placement="right" :key="`drop-menu-${item.name}`">
            <a @click="handleSelect(getNameOrHref(item, true))" class="drop-menu-a" :style="{textAlign: 'center'}" :class="{'active':item.children[0].name == getThisName}"><Icon :size="rootIconSize" :type="item.icon || item.children[0].icon"/></a>
          </Tooltip>
        </template>
      </div>

  </div>
</template>
<script>
import SideMenuItem from './side-menu-item.vue'
import CollapsedMenu from './collapsed-menu.vue'
import { setScrollBar } from "@/libs/common";
import { getUnion } from '@/libs/tools'
import mixin from './mixin'

export default {
  name: 'SideMenu',
  mixins: [ mixin ],
  components: {
    SideMenuItem,
    CollapsedMenu
  },
  props: {
    menuList: {
      type: Array,
      default () {
        return []
      }
    },
    collapsed: {
      type: Boolean
    },
    theme: {
      type: String,
      default: ''
    },
    rootIconSize: {
      type: Number,
      default: 23
    },
    iconSize: {
      type: Number,
      default: 16
    },
    accordion: Boolean,
    activeName: {
      type: String,
      default: ''
    },
    openNames: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      openedNames: [],
    }
  },
  methods: {
    handleSelect (name) {
      this.$emit('on-select', name)
    },
    getOpenedNamesByActiveName (name) {
      return this.$route.matched.map(item => item.name).filter(item => item !== name)
    },
  },
  computed: {
    openMenuFun(){
      const openName = []
      this.$route.matched.forEach((v,i) => {
        if(i<this.$route.matched.length-1&&v.name){
          openName.push(v.name)
        }
      })
      return openName
    },
    textColor () {
      return this.theme === 'dark' ? '#fff' : '#ada5a5'
    },
    getThisName(){
      return this.$route.name
    },
  },
  watch: {
    activeName (name) {
      if (this.accordion) this.openedNames = this.getOpenedNamesByActiveName(name)
      else this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
    },
    openNames (newNames) {
      this.openedNames = newNames
    },
    openedNames () {
      this.$nextTick(() => {
        //this.$refs.menu.updateOpened()
      })
    }
  },
  mounted () {
    this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
    setScrollBar('leftInner')
  }
}
</script>
<style lang="less">
@import './side-menu.less';
</style>
