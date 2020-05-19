<template>
  <Dropdown @on-click="handleClick" transer placement="right-start">
    <a
      class="drop-menu-a"
      :class="{ active: parentItem.name == this.$route.matched[0].name }"
      type="text"
      :style="{ textAlign: !hideTitle ? 'left' : '' }"
    >
      <Icon :size="rootIconSize" :type="parentItem.icon"/>
      <span class="menu-title" v-if="!hideTitle">{{
        showTitle(parentItem)
      }}</span>
      <Icon
        v-if="!hideTitle"
        :size="10"
        :color="textColor"
        type="chevron-right"
        style="float: right;margin-top: 4px;"
    /></a>
    <DropdownMenu slot="list">
      <template v-for="child in children">
        <collapsed-menu
          v-if="showChildren(child)"
          :icon-size="iconSize"
          :parent-item="child"
          :key="`drop-${child.name}`"
        ></collapsed-menu>

        <template v-else-if="child.children && child.children.length === 1">
          <DropdownItem
            :key="`drop-${child.children[0].name}`"
            :name="child.children[0].name"
            ><span class="menu-title">{{
              showTitle(child.children[0])
            }}</span></DropdownItem
          >
        </template>

        <DropdownItem
          v-else
          :key="`drop-${child.name}`"
          :name="child.name"
          :class="{ 'child-item-active': child.name == activeName }"
          ><span class="menu-title">{{ showTitle(child) }}</span></DropdownItem
        >
      </template>
    </DropdownMenu>
  </Dropdown>
</template>
<script>
import mixin from "./mixin";
import itemMixin from "./item-mixin";
export default {
  name: "CollapsedMenu",
  mixins: [mixin, itemMixin],
  props: {
    hideTitle: {
      type: Boolean,
      default: false
    },
    rootIconSize: {
      type: Number,
      default: 16
    },
    activeName: {
      type: String,
      default: ""
    }
  },
  methods: {
    handleClick(name) {
      //console.log(name)
      //return false
      this.$emit("on-click", name);
    }
  },
  mounted() {}
};
</script>
