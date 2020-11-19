<template>
  <div class="el-select-menu-layer" style="position: relative">
    <Input
      search
      :disabled="disabledProp"
      v-model="isLayerValue"
      :placeholder="placeholder"
      @keydown.native.enter.prevent="onSearch"
      @keydown.native.down.stop.prevent="navigateOptions('next')"
      @keydown.native.up.stop.prevent="navigateOptions('prev')"
      @on-focus="handleFocus"
      @keyup.native="changeValue"
      clearable
      @on-clear="clearFun"
    />
    <transition
      name="el-zoom-in-top">
      <div
        ref="popper"
        class="el-select-menu-wrap w200 fs12"
        v-show="isLayer">
        <el-scrollbar
          tag="ul"
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
          ref="scrollbar2"
          class="w200 fs12"
          v-show="options.length>0">
          <p class="el-select-menu-item" @click="selectItem(item)" :class="{'hoverSelect':hoverIndex==index+1}"
             v-for="(item,index) in options" :key="item.id" :title="item.fullName">{{item.fullName}}</p>
        </el-scrollbar>
        <template v-show="options.length==0">
          <div v-show="loading" style="text-align: center">
            <i class="el-icon-loading"></i>
          </div>
          <span v-show="!loading&&options.length == 0">暂无数据</span>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
  import { getTreeClient, getClientType } from "@/api/salesManagment/salesOrder";
  export default {
    name: "salesCus",
    props:{
      placeholder:'',
      searchValue:'',
      disabledProp:{
        type:Boolean,
        default:true
      }
    },
    data(){
      return {
        isLayerValue:"",
        isLayer:false,
        options:[],
        loading:false,
        hoverIndex:0,
      }
    },
    mounted(){
      this.isLayerValue = this.searchValue||"";
      document.addEventListener("click",this.clickDom)
    },
    methods:{
      onSearch(event) {
        if(event.keyCode=='13'){
          if(this.hoverIndex==0){
            this.isLayer = true;
            this.getList(event.target.value);
          }else{
            this.selectItem(this.options[this.hoverIndex-1])
          }
        }
      },
      onBlur(){
        this.isLayer = false;
      },

      handleFocus(){
        if(this.options.length>0){
          this.isLayer = true;
        }
      },
      changeValue(event){
        if(event.key!='Enter'&&event.key!='ArrowUp'&&event.key!='ArrowDown'){
          this.onBlur();
          this.hoverIndex = 0;
          this.options = [];
          if(event.target.value==''){
            this.$emit("throwName", {});
          }
        }
      },
      clearFun(){
        this.$emit("throwName", {});
      },
      navigateOptions(direction) {
        // if (!this.visible) {
        //   this.visible = true;
        //   return;
        // }
        if (this.options.length === 0) return;
        if (direction === 'next') {
          this.hoverIndex++;
          if (this.hoverIndex > this.options.length) {
            this.hoverIndex = 1;
          }
        } else if (direction === 'prev') {
          this.hoverIndex--;
          if (this.hoverIndex < 1) {
            this.hoverIndex = this.options.length;
          }
        }

        this.$nextTick(()=>{
          let wrapH = this.$refs.scrollbar2.$el.querySelector('.el-select-dropdown__wrap').clientHeight-32;
          let itemTop = this.$refs.scrollbar2.$el.querySelector('.hoverSelect').offsetTop;
          if(itemTop>wrapH){
            this.$refs.scrollbar2.$el.querySelector('.el-select-dropdown__wrap').scrollTop = itemTop-wrapH
          }else{
            this.$refs.scrollbar2.$el.querySelector('.el-select-dropdown__wrap').scrollTop = 0;
          }
        })
      },

      getList(v) {
        if(!v){
          return this.$Message.error("请输入内容");
        }
        let req = {};
        // if(/^[\u4e00-\u9fa5]/.test(v)){
          req.shortName = v.trim();
        // }else{
        //   req.code = v.trim();
        // }
        req.page = 0;
        req.size = 1000;
        this.options = [];
        this.loading = true;
        getTreeClient(req).then(res => {
          this.loading = false;
          this.options = (res.data.content || []).filter(el=>el.isDisabled==0);
        });
      },
      selectItem(v){
        this.isLayerValue = v.fullName||"";
        this.onBlur();
        this.$emit("throwName",v);
      },
      clickDom(v){
        let classN = v.path.filter(item => {
          if(item.className&&item.className.indexOf('el-select-menu-layer')>-1){
            return item.className
          }
        })
        if(classN.length==0){
          this.onBlur();
        }
      }
    },
    watch:{
      searchValue(val) {
        this.isLayerValue = val||"";
      }
    }
  }
</script>

<style lang="less">
  .el-select-menu-layer{
    position: relative;
    .el-select-menu-wrap{
      position: absolute;
      width: 100%;
      z-index: 100;
      left: 0;
      top: 34px;
      background: #fff;
      box-shadow:0px 2px 6px rgba(0,0,0,.1);
      .el-select-menu-item{
        padding: 0 10px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        &:hover,&.hoverSelect{
          cursor: pointer;
          background: #f8f8f8;
          color: #e82f2f;
        }
      }
    }
    .ivu-icon{
      display: none;
    }
    .ivu-input-with-suffix{
      padding-right: 7px;
    }
  }
</style>
