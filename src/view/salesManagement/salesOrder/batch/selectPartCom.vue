<template>
  <div>
    <Modal v-model="searchPartLayer" class="batch-model" title="选择批次配件" width="1000">
      <div class="partCheck-hd">
        <!--<Select style="z-index: 9999" v-model="searchType" class="w100 mr10">-->
          <!--<Option v-for="item in searchTypeArr" :value="item.value" :key="item.value">{{item.label}}</Option>-->
        <!--</Select>-->
        <Input class="w250 mr10" v-model="partName" placeholder="配件编码/名称/车型" @on-enter="search"></Input>

        <Select placeholder="选择品牌" filterable v-model="selectBrand" class="w150 mr10">
          <Option v-for="item in partBrandData" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
        <Button @click="search" class="mr10" type='primary'><Icon type="ios-search" size="14" /> 查询</Button>
        <Button class="mr10" type='default' @click="throwData"><Icon type="md-checkmark" /> 选择</Button>
        <Button class="mr10" type='default' @click="cancel"><Icon type="md-close" /> 取消</Button>
        <Button type='default'  @click="applyPart"><Icon type="md-add" /> 配件申请</Button>
      </div>
      <div class="partCheck-main clearfix">
<!--        <div class="partCheck-left fl">-->
<!--          <div class="partCheck-left-tit">系统分类</div>-->
<!--          <div class="partCheck-left-tree">-->
<!--            <Tree v-loading="treeLoading" :data="treeData" @on-select-change="selectTree"></Tree>-->
<!--          </div>-->
<!--        </div>-->
<!--        partCheck-right之前是758px-->
        <div class="fr partCheck-right" style="width: 100%">
          <!--<Table height="389" @on-selection-change="selectTabelData" @on-current-change="currentItem" size="small" highlight-row :loading="loading" border :stripe="true" :columns="columnsPart" :data="partData">-->
            <!--<template slot-scope="{ row, index }" slot="action">-->
              <!--<a @click="show(row)">查看</a>-->
            <!--</template>-->
          <!--</Table>-->
          <vxe-table
            class="setPadding"
            border
            ref="xTable3"
            show-overflow="title"
            size="mini"
            height="350"
            :loading="loading"
            highlight-current-row
            highlight-hover-row
            @current-change="currentItem"
            @checkbox-all="selectTabelData"
            @checkbox-change="selectTabelData"
            @cell-dblclick="dblclick"
            :data="partData">
            <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
            <vxe-table-column type="checkbox" width="30"></vxe-table-column>
            <vxe-table-column field="partCode" title="配件编码" width="110"></vxe-table-column>
            <vxe-table-column field="partName" title="配件名称" width="110"></vxe-table-column>
            <vxe-table-column :filters="[]" :filter-method="filterNameMethod1" field="partBrand" title="品牌" width="80"></vxe-table-column>
            <vxe-table-column field="oemCode" title="OEM码" width="110"></vxe-table-column>
            <vxe-table-column field="enterQty" title="批次库存" width="70"></vxe-table-column>
            <vxe-table-column field="outableQty" title="可售数量" width="70"></vxe-table-column>
            <vxe-table-column field="branchStockAge" title="本店库龄" width="70"></vxe-table-column>
            <vxe-table-column field="enterPrice" title="成本单价" width="80">
              <template v-slot="{row}">
                {{row.enterPrice|priceFilters}}
              </template>
            </vxe-table-column>
            <vxe-table-column field="taxRate" title="税率" width="50"></vxe-table-column>
            <vxe-table-column field="taxPrice" title="含税单价" width="70">
              <template v-slot="{row}">
                {{row.taxPrice|priceFilters}}
              </template>
            </vxe-table-column>
            <vxe-table-column field="noTaxPrice" title="不含税单价" width="80">
              <template v-slot="{row}">
                {{row.noTaxPrice|priceFilters}}
              </template>
            </vxe-table-column>
            <vxe-table-column field="enterDate" title="入库日期" width="110"></vxe-table-column>
            <vxe-table-column field="guestName" title="供应商" width="120"></vxe-table-column>
            <vxe-table-column field="carModelName" title="品牌车型" width="120">
              <template v-slot="{row}">
                {{(row.carBrandName||"")+(row.carModelName||"")}}
              </template>
            </vxe-table-column>
            <vxe-table-column field="enterUnitId" title="单位" width="50"></vxe-table-column>
            <vxe-table-column field="spec" title="规格" width="120"></vxe-table-column>
          </vxe-table>
          <Page size="small" class-name="page-con fr pt10" :current="page.num" :total="page.total" :page-size="page.size" @on-change="changePage"
                @on-page-size-change="changeSize" show-sizer show-total></Page>
        </div>
      </div>
      <div class="mt10 clearfix">
        <Tabs type="card" name="search" class="fl mr10" style="width:600px">
          <TabPane  label="本店库存" tab="search"><div>
            <div class="marketBox">
              <vxe-table
                auto-resize
                height="200"
                border
                :loading="loading2"
                show-overflow="title"
                size="mini"
                resizable
                class="setPadding"
                highlight-hover-row
                :data="allList.orgStock"
              >
                <vxe-table-column type="index" title="序号" width="50"></vxe-table-column>
                <vxe-table-column field="partCode" title="配件编码" width="110"></vxe-table-column>
                <vxe-table-column field="partName" title="配件名称" width="110"></vxe-table-column>
                <vxe-table-column field="unit" title="单位" width="50"></vxe-table-column>
                <vxe-table-column field="storeName" title="仓库" width="100"></vxe-table-column>
                <vxe-table-column field="stockQty" title="库存数量" width="70"></vxe-table-column>
                <vxe-table-column field="occupyQty" title="订单占用" width="70"></vxe-table-column>
                <vxe-table-column field="outableQty" title="可开单数量" width="80"></vxe-table-column>
              </vxe-table>
            </div>
          </div></TabPane>
          <TabPane  label="连锁库存" tab="search">
            <div class="marketBox">
              <vxe-table
                border
                auto-resize
                resizable
                :loading="loading2"
                height="200"
                class="setPadding"
                show-overflow="title"
                highlight-hover-row
                :data="allList.chainStock"
              >
                <vxe-table-column type="index" title="序号" width="50"></vxe-table-column>
                <vxe-table-column field='partCode' title="配件编码" width="110"></vxe-table-column>
                <vxe-table-column field="companyName" title="公司名称" width="110"></vxe-table-column>
                <vxe-table-column field="storeName" title="仓库" width="100"></vxe-table-column>
                <vxe-table-column field="stockQty" title="库存数量" width="70"></vxe-table-column>
              </vxe-table>
            </div>
          </TabPane>
          <TabPane  label="销售记录" tab="search">
            <div class="marketBox">
              <vxe-table
                border
                auto-resize
                resizable
                :loading="loading2"
                height="200"
                class="setPadding"
                show-overflow="title"
                highlight-hover-row
                :data="allList.sellHistory"
              >
                <vxe-table-column type="index" title="序号" width="50"></vxe-table-column>
                <vxe-table-column field="partCode" title="配件编码" width="110"></vxe-table-column>
                <vxe-table-column field="partName" title="配件名称" width="110"></vxe-table-column>
                <vxe-table-column field="companyName" title="公司" width="110"></vxe-table-column>
                <vxe-table-column field="guestName" title="客户" width="100"></vxe-table-column>
                <vxe-table-column field="finishDate" title="销售日期" width="110"></vxe-table-column>
                <vxe-table-column field="sellQty" title="数量" width="70"></vxe-table-column>
                <vxe-table-column field="sellPrice" title="销价" width="70"></vxe-table-column>
              </vxe-table>
            </div>
          </TabPane>
        </Tabs>
        <Tabs type="card" name="money" class="fl" style="width:350px">
          <TabPane  label="级别价格" tab="money">
            <div class="marketBox">
              <vxe-table
                border
                auto-resize
                resizable
                :loading="loading2"
                height="200"
                class="setPadding"
                size="mini"
                show-overflow="title"
                highlight-hover-row
                :data="allList.priceLever"
              >
                <vxe-table-column field="strategyName" title="级别" width="110"></vxe-table-column>
                <vxe-table-column field="sellPrice" title="销售价" width="70"></vxe-table-column>
                <vxe-table-column field="updateUname" title="更新人" width="70"></vxe-table-column>
                <vxe-table-column field="updateTime" title="更新日期"></vxe-table-column>
              </vxe-table>
            </div>
          </TabPane>
        </Tabs>

      </div>

      <div slot='footer'>
        <!--<Button type='primary' @click='submit("proModal")'>确定</Button>-->
        <!--<Button type='default' @click='proModal = false'>取消</Button>-->
      </div>
    </Modal>
    <part-info ref="partInfo" :is-add-part="true" @throwData="addPartFun"></part-info>
    <select-part-info ref="selectPartInfo" @throwData="throwDataChangeNum"></select-part-info>
  </div>
</template>

<script>
  import {getAllBrand,getCarClassifys,getCarPartName} from "_api/system/partsExamine/partsExamineApi";
  import PartInfo from "_c/partInfo/partInfo";
  import {mixSelectPartCom} from "./mixSelectPartCom";
  import SelectPartInfo from "../components/selectPartInfo";
  export default {
    name: "selectPartCom",
    mixins:[mixSelectPartCom],
    components: {PartInfo,SelectPartInfo},
    props:{
        guestId:'',//客户id
        storeId:'',//仓库id
    },

  }
</script>

<style lang="less" scoped>
  .partCheck-hd{
    //border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
  }
  .partCheck-left{
    border:1px solid #ddd;
    width: 200px;
    .partCheck-left-tit{
      text-align: center;
      border-bottom: 1px solid #ddd;
      line-height: 36px;
    }
  }
  .partCheck-left-tree{
    padding: 10px;
    height: 350px;
    overflow-y: auto;
  }

  .custom-main{
    border-top: 1px solid #ddd;
    .custom-type-hd{
      padding: 10px 0 6px;
    }
    .tag-span{
      cursor: pointer;
      background: #f8f8f8;
      border: 1px solid #e8e8e8;
      padding: 4px 10px;
      border-radius: 2px;
      display: inline-block;
      &.active{
        background: #fd5c5c;
        border-color: #fd5c5c;
        color: #fff;
      }
    }
  }
</style>
<style lang="less">
  .batch-model .ivu-modal{
    top:50px;
    .text-overflow{
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      display: block;
      width: 100px;
    }
  }
</style>
