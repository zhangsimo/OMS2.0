<template>
  <div class="el-select-menu-layer" style="position: relative">
    <Input
      search
      :disabled="disabledProp"
      v-model="isLayerValue"
      :placeholder="placeholder"
      @on-search="onSearch"
    />
    <transition name="el-zoom-in-top">
      <div ref="popper" class="el-select-menu-wrap" v-show="isLayer">
        <el-scrollbar
          tag="ul"
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
          ref="scrollbar"
          v-show="options.length > 0"
        >
          <p
            class="el-select-menu-item"
            @click="selectItem(item)"
            v-for="item in options"
            :key="item.id"
          >
            {{ item.shortName }}
          </p>
          <p></p>
        </el-scrollbar>
        <template v-show="options.length == 0">
          <div v-show="loading" style="text-align: center">
            <i class="el-icon-loading"></i>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
import {
 activeCompany
} from "@/api/business/brandListApi";
import { transferringFindForAllot } from "_api/purchasing/purchasePlan";
export default {
  name: "allocationCus",
  props: {
    placeholder: "",
    searchValue: "",
    disabledProp: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isLayerValue: "",
      isLayer: false,
      options: [],
      loading: false
    };
  },
  mounted() {
    this.isLayerValue = this.searchValue || "";
    document.addEventListener("click", this.clickDom);
  },
  methods: {
    onSearch(v) {
      this.isLayer = true;
      this.getList(v);
    },
    onBlur() {
      this.isLayer = false;
    },
    getList(v) {
      if (!v) {
        return this.$Message.error("请输入内容");
      }
      let req = {};
      // if (/^[\u4e00-\u9fa5]/.test(v)) {
        req.fullName = v.trim();
      // } else {
      //   req.code = v.trim();
      // }
      req.num = 0;
      req.size = 1000;
      this.loading = true;
      this.options = [];
      activeCompany(req).then(res => {
        if (res.code === 0) {
          this.loading = false;
          this.options = res.data.content || [];
        }
      });
    },
    selectItem(v) {
      this.isLayerValue = v.shortName || "";
      this.onBlur();
      this.$emit("throwName", v);
    },
    clickDom(v) {
      let classN = v.path.filter(item => {
        if (
          item.className &&
          item.className.indexOf("el-select-menu-wrap") > -1
        ) {
          return item.className;
        }
      });
      if (classN.length == 0) {
        this.onBlur();
      }
    }
  },
  watch: {
    searchValue(val) {
      this.isLayerValue = val || "";
    }
  }
};
</script>

<style lang="less">
.el-select-menu-layer {
  position: relative;
  .el-select-menu-wrap {
    position: absolute;
    width: 100%;
    z-index: 100;
    left: 0;
    top: 34px;
    background: #fff;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
    .el-select-menu-item {
      padding: 0 10px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      &:hover {
        cursor: pointer;
        background: #f8f8f8;
        color: #e82f2f;
      }
    }
  }
  .ivu-icon {
    display: none;
  }
  .ivu-input-with-suffix {
    padding-right: 7px;
  }
}
</style>
