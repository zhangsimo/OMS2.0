<template>
  <div>
    <Modal v-model="searchPartLayer" title="配件选择" width="1000">
      <div class="partCheck-hd">
        <!--<Select style="z-index: 9999" v-model="searchType" class="w100 mr10">-->
          <!--<Option v-for="item in searchTypeArr" :value="item.value" :key="item.value">{{item.label}}</Option>-->
        <!--</Select>-->
        <el-input class="w250 mr10" v-model="partName" placeholder="请输入配件内码/编码/名称/OE码" ref="elinput" @change="search"></el-input>

        <!-- <Select placeholder="选择品牌" filterable v-model="selectBrand" class="w150 mr10">
          <Option v-for="item in partBrandData" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select> -->
        <Button @click="search" class="mr10" type="primary">
          <Icon type="ios-search" size="14" />查询
        </Button>
        <Button class="mr10" type="default" @click="throwData">
          <Icon type="md-checkmark" />选择
        </Button>
        <Button class="mr10" type="default" @click="throwDatatwo">
          <Icon type="md-close" />取消
        </Button>
        <Button type="default" v-if="isShowAddPartBtn" @click="applyPart">
          <Icon type="md-add" />配件申请
        </Button>
      </div>
      <div class="partCheck-main clearfix">
<!--        <div class="partCheck-left fl">-->
<!--          <div class="partCheck-left-tit">系统分类</div>-->
<!--          <div class="partCheck-left-tree">-->
<!--            <Tree v-loading="treeLoading" :data="treeData" @on-select-change="selectTree"></Tree>-->
<!--          </div>-->
<!--        </div>-->
<!--       partCheck-right之前是758px -->
        <div class="fr partCheck-right" style="width: 100%">
          <Table
            height="389"
            @on-selection-change="selectTabelData"
            :loading="loading"
            border
            :stripe="true"
            :columns="columnsPart"
            :data="partData"
            @on-row-dblclick="dblclick"
          ></Table>
          <Page
            size="small"
            class-name="page-con fr pt10"
            :current="page.num"
            :total="page.total"
            :page-size="page.size"
            @on-change="changePage"
            @on-page-size-change="changeSize"
            show-sizer
            show-total
            :page-size-opts="[50, 100, 300,500]"
          ></Page>
        </div>
      </div>
      <div slot="footer">
        <!--<Button type='primary' @click='submit("proModal")'>确定</Button>-->
        <!--<Button type='default' @click='proModal = false'>取消</Button>-->
      </div>
    </Modal>
    <!--<part-info ref="partInfo" :is-add-part="true" @throwData="addPartFun"></part-info>-->
    <select-part-info ref="selectPartInfo" @throwData2="throwChangeData"></select-part-info>
  </div>
</template>

<script>
import {
  getAllBrand,
  getCarClassifys,
  getCarPartName
} from "_api/system/partsExamine/partsExamineApi";
import PartInfo from "_c/partInfo/partInfo";
import { mixSelectPartCom } from "./mixSelectPartCom";
import SelectPartInfo from "./selectPartInfo";
export default {
  name: "supplier",
  mixins: [mixSelectPartCom],
  components: {SelectPartInfo, PartInfo },
  props: {
    isShowAddPartBtn: false
  },
  methods: {
    throwDatatwo() {
      this.searchPartLayer = false;
    }
  }
};
</script>

<style lang="less" scoped>
.partCheck-hd {
  //border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}
.partCheck-left {
  border: 1px solid #ddd;
  width: 200px;
  .partCheck-left-tit {
    text-align: center;
    border-bottom: 1px solid #ddd;
    line-height: 36px;
  }
}
.partCheck-left-tree {
  padding: 10px;
  height: 350px;
  overflow-y: auto;
}

.custom-main {
  border-top: 1px solid #ddd;
  .custom-type-hd {
    padding: 10px 0 6px;
  }
  .tag-span {
    cursor: pointer;
    background: #f8f8f8;
    border: 1px solid #e8e8e8;
    padding: 4px 10px;
    border-radius: 2px;
    display: inline-block;
    &.active {
      background: #fd5c5c;
      border-color: #fd5c5c;
      color: #fff;
    }
  }
}
</style>
