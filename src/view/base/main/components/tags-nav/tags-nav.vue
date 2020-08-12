<template>
  <div class="tags-nav">
    <div class="close-con">
      <Dropdown transfer @on-click="handleTagsOption">
        <Icon :size="18" type="ios-close-circle-outline"></Icon>
        <DropdownMenu slot="list">
          <DropdownItem name="close-all">关闭所有</DropdownItem>
          <DropdownItem name="close-others">关闭其他</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div class="btn-con left-btn" :class="{'noActive':noLeftActive}">
      <Button icon="ios-arrow-back" type="text" @click="handleScroll(240)"></Button>
    </div>
    <div class="btn-con right-btn" :class="{'noActive':noRightActive}">
      <Button icon="ios-arrow-forward" type="text" @click="handleScroll(-240)"></Button>
    </div>
    <div class="scroll-outer" ref="scrollOuter" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll">
      <div ref="scrollBody" class="scroll-body" :style="{left: tagBodyLeft + 'px'}">
        <transition-group name="taglist-moving-animation">
          <Tag
            v-for="item in list"
            class="tag-item"
            :class="item.name === value.name ? 'tag-item-selected' : ''"
            ref="tagsPageOpened"
            :key="`tag-nav-${item.name}`"
            :name="item.name"
            @on-close="handleClose"
            @click.native="handleClick(item)"
            :closable="item.name !== 'home'"
          >{{ showTitleInside(item) }}</Tag>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { showTitle } from '@/libs/util'
export default {
  name: 'TagsNav',
  props: {
    value: Object,
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      tagBodyLeft: 0,
      noLeftActive:false,
      noRightActive:false
    }
  },
  mounted(){
    this.initBg()
  },
  methods: {
    handlescroll (e) {
      var type = e.type
      let delta = 0
      if (type === 'DOMMouseScroll' || type === 'mousewheel') {
        delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40
      }
      this.handleScroll(delta)
    },
    handleScroll (offset) {
      if (offset > 0) {
        this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset)
      } else {
        if (this.$refs.scrollOuter.offsetWidth < this.$refs.scrollBody.offsetWidth) {
          if (this.tagBodyLeft < -(this.$refs.scrollBody.offsetWidth - this.$refs.scrollOuter.offsetWidth)) {
            this.tagBodyLeft = this.tagBodyLeft
          } else {
            this.tagBodyLeft = Math.max(this.tagBodyLeft + offset, this.$refs.scrollOuter.offsetWidth - this.$refs.scrollBody.offsetWidth)

          }
        } else {
          this.tagBodyLeft = 0
        }
      }
      this.initBg()
    },
    handleTagsOption (type) {
      if (type === 'close-all') {
        // 关闭所有，除了home
        let res = this.list.filter(item => item.name === 'home')
        this.$emit('on-close', res, 'all')
      } else {
        // 关闭除当前页和home页的其他页
        let res = this.list.filter(item => item.name === this.value.name || item.name === 'home')
        this.$emit('on-close', res, 'others')
      }
    },
    handleClose (e, name) {
      let res = this.list.filter(item => item.name !== name)
      this.$emit('on-close', res, undefined, name)
      setTimeout(()=>{
        this.initBg()
      },500)
    },
    handleClick (item) {
      this.$emit('input', item)
    },
    showTitleInside (item) {
      return showTitle(item, this)
    },
    initBg(){
      let that = this
      this.$nextTick(()=>{
        if(that.$refs.scrollOuter.offsetWidth < that.$refs.scrollBody.offsetWidth){
          that.noRightActive = false
          that.noLeftActive = false
          if(that.tagBodyLeft==0){
            that.noLeftActive = true
          }else{
            that.noRightActive = true
          }
        }else{
          that.noRightActive = true
          that.noLeftActive = true
        }
      })
    }
  },
  watch:{
    list:{
      handler(v,ov){
        this.initBg()
      },
      deep:true
    }
  }
}
</script>

<style lang="less">
@import './tags-nav.less';
</style>
