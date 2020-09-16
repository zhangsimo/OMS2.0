<template>
  <div>
    <Modal
      v-model="searchPartLayer"
      title="配件选择"
      width="1100"
      @on-cancel="CancelModal"
    >
      <div class="partCheck-hd">
        <!--<Select style="z-index: 9999" v-model="searchType" class="w100 mr10">-->
        <!--<Option v-for="item in searchTypeArr" :value="item.value" :key="item.value">{{item.label}}</Option>-->
        <!--</Select>-->
        <!-- <el-input
          class="w250 mr10 inputs"
          v-model="partName"
          placeholder="请输入编码"
          @change="search"
          ref="Input"
        ></el-input> -->

        <div class="db mr5 fl">
          <span class="mr5">编码:</span>
          <Input ref="Input" style="width: 120px" placeholder="编码" v-model="partCode" @on-enter="search"/>
        </div>
        <div class="db mr5 fl">
          <span class="mr5">内码:</span>
          <Input placeholder="内码" style="width: 120px" v-model="partId" @on-enter="search"/>
        </div>
        <div class="db mr5 fl">
          <span class="mr5">名称:</span>
          <Input placeholder="名称" style="width: 120px" v-model="partName" @on-enter="search"/>
        </div>
        <div class="db mr5 fl">
          <span class="mr5">OE:</span>
          <Input placeholder="OE码" style="width: 120px" v-model="oemCode" @on-enter="search"/>
        </div>

        <!-- <Select
          placeholder="选择品牌"
          filterable
          v-model="selectBrand"
          class="w150 mr10"
        >
          <Option
            v-for="(item, index) in partBrandData"
            :value="item.code"
            :key="index"
            >{{ item.name }}</Option
          >
        </Select> -->
        <Button @click="search" class="mr10" type="primary"
          ><Icon type="ios-search" size="14" /> 查询</Button
        >
        <Button class="mr10" type="default" @click="throwData"
          ><Icon type="md-checkmark" /> 选择</Button
        >
        <Button class="mr10" type="default" @click="cancel"
          ><Icon type="md-close" /> 取消</Button
        >
        <Button type="default" v-if="isShowAddPartBtn" @click="applyPart"
          ><Icon type="md-add" /> 配件申请</Button
        >
      </div>
      <div class="partCheck-main clearfix">
        <!--        <div class="partCheck-left fl">-->
        <!--          <div class="partCheck-left-tit">系统分类</div>-->
        <!--          <div class="partCheck-left-tree">-->
        <!--            <Tree v-loading="treeLoading" :data="treeData" @on-select-change="selectTree"></Tree>-->
        <!--          </div>-->
        <!--        </div>-->
        <!--   partCheck-right之前是758px-->
        <div class="fr partCheck-right" style="width: 100%">
          <Table
            height="389"
            @on-selection-change="selectTabelData"
            @on-row-dblclick="dblclick"
            :loading="loading"
            border
            :stripe="true"
            :columns="columnsPart"
            :data="partData"
          ></Table>
          <Page
            size="small"
            :current="page.num"
            class-name="page-con fr pt10"
            :total="page.total"
            :page-size="page.size"
            @on-change="changePage"
            @on-page-size-change="changeSize"
            show-sizer
            show-total
            :page-size-opts="[10, 20, 30,50]"
          ></Page>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
    <part-info
      ref="partInfo"
      :is-add-part="true"
      @throwData="addPartFun"
      :show-spe="false"
    ></part-info>
    <select-part-info2 ref="selectPartInfo2" @throwData2="throwDataChangeNum"></select-part-info2>
    <select-part-info  ref="selectPartInfo" @throwData="throwDataChangeNum"></select-part-info>
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
import SelectPartInfo from "../../../salesManagement/salesOrder/components/selectPartInfo";
import SelectPartInfo2 from "../../../AlotManagement/transferringOrder/applyFor/compontents/selectPartInfo";


export default {
  name: "selectPartCom",
  mixins: [mixSelectPartCom],
  components: {SelectPartInfo, PartInfo,SelectPartInfo2 },
  props: {
    isShowAddPartBtn: false
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
