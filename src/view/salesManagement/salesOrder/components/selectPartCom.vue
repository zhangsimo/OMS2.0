<template>
  <div>
    <Modal v-model="searchPartLayer" title="配件选择" width="1000">
      <div class="partCheck-hd">
        <!--<Select style="z-index: 9999" v-model="searchType" class="w100 mr10" label-in-value @on-change="ChangeValue">-->
        <!--<Option v-for="item in searchTypeArr" :value="item.value" :key="item.value">{{item.label}}</Option>-->
        <!--</Select>-->
        <el-input
          class="w250 mr10"
          v-model="partName"
          placeholder="请输入配件内码/编码/名称/OE码"
          @change="search"
          :autofocus="true"
          ref="elinput"
        ></el-input>

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
        <Button class="mr10" type="default" @click="searchPartLayer = false"
          ><Icon type="md-close" /> 取消</Button
        >
        <Button
          v-if="$route.name != 'takeStock' && $route.name != 'moveStorehouse'"
          type="default"
          @click="applyPart"
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
        <!--    partCheck-right原来为758px    -->
        <div class="fr partCheck-right" style="width:100%">
          <Table
            height="389"
            @on-selection-change="selectTabelData"
            :loading="loading"
            border
            :stripe="true"
            :columns="columnsPart"
            :data="partData"
            @on-row-dblclick="dblclick"
          >
            <template slot-scope="{ row, index }" slot="action">
              <a @click="show(row)">查看</a>
            </template>
          </Table>
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
      <div class="mt10 clearfix">
        <Tabs type="card" name="search" class="fl mr10" style="width:600px">
          <!-- <TabPane label="本店库存" tab="search"
            ><div>
              <div class="marketBox">
                <vxe-table
                  auto-resize
                  height="200"
                  border
                  size="mini"
                  resizable
                  align="center"
                  highlight-hover-row
                  :data="allList.orgStock"
                >
                  <vxe-table-column
                    type="index"
                    title="序号"
                    width="50"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="partCode"
                    title="配件编码"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="partName"
                    title="配件名称"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="unit"
                    title="单位"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="storeName"
                    title="仓库"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="stockQty"
                    title="库存数量"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="occupyQty"
                    title="订单占用"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="outableQty"
                    title="可开单数量"
                  ></vxe-table-column>
                </vxe-table>
              </div></div
          ></TabPane> -->
          <TabPane label="关联配件" tab="search">
            <div class="marketBox">
              <vxe-table
                border
                auto-resize
                resizable
                align="center"
                size="mini"
                height="200"
                highlight-hover-row
                :data="allList.relearnedPart"
              >
                <vxe-table-column title="操作" width="50">
                  <template v-slot="{ row }">
                    <a @click="showLink(row)">查看</a>
                  </template>
                </vxe-table-column>
                <vxe-table-column
                  field="code"
                  title="配件编码"
                  width="120"
                ></vxe-table-column>
                <vxe-table-column
                  field="partName"
                  width="120"
                  title="配件名称"
                ></vxe-table-column>
                <vxe-table-column
                  field="partBrandName"
                  width="100"
                  title="品牌"
                ></vxe-table-column>
                <vxe-table-column
                  field="quality"
                  width="100"
                  title="品质"
                ></vxe-table-column>
                <vxe-table-column
                  field="outableQty"
                  min-width="100"
                  title="本店可售"
                ></vxe-table-column>
              </vxe-table>
            </div>
          </TabPane>
          <TabPane label="连锁库存" tab="search">
            <div class="marketBox">
              <vxe-table
                border
                auto-resize
                resizable
                size="mini"
                align="center"
                height="200"
                highlight-hover-row
                :data="allList.chainStock"
              >
                <vxe-table-column
                  type="index"
                  title="序号"
                  width="50"
                ></vxe-table-column>
                <vxe-table-column
                  field="partCode"
                  title="配件编码"
                  width="120"
                ></vxe-table-column>
                <vxe-table-column
                  field="companyName"
                  title="公司名称"
                  width="120"
                ></vxe-table-column>
                <vxe-table-column
                  field="storeName"
                  title="仓库"
                  width="120"
                ></vxe-table-column>
                <vxe-table-column
                  field="outableQty"
                  title="可售数量"
                  min-width="120"
                ></vxe-table-column>
              </vxe-table>
            </div>
          </TabPane>
          <TabPane label="销售记录" tab="search">
            <div class="marketBox">
              <vxe-table
                border
                auto-resize
                resizable
                size="mini"
                align="center"
                height="200"
                highlight-hover-row
                :data="allList.sellHistory"
              >
                <vxe-table-column
                  type="index"
                  title="序号"
                  width="50"
                ></vxe-table-column>
                <vxe-table-column
                  field="partCode"
                  title="配件编码"
                  width="120"
                ></vxe-table-column>
                <vxe-table-column
                  field="partName"
                  title="配件名称"
                  width="120"
                ></vxe-table-column>
                <vxe-table-column
                  field="companyName"
                  title="公司"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="guestName"
                  title="客户"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="finishDate"
                  title="销售日期"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="sellQty"
                  title="数量"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="sellPrice"
                  title="销价"
                  width="100"
                ></vxe-table-column>
              </vxe-table>
            </div>
          </TabPane>
        </Tabs>
        <Tabs type="card" name="money" class="fl" style="width:350px">
          <TabPane label="级别价格" tab="money">
            <div class="marketBox">
              <vxe-table
                border
                auto-resize
                resizable
                align="center"
                height="200"
                size="mini"
                highlight-hover-row
                :data="allList.priceLever"
              >
                <vxe-table-column
                  field="strategyName"
                  width="80"
                  title="级别"
                ></vxe-table-column>
                <vxe-table-column field="sellPrice" width="100" title="销售价">
                  <template v-slot="{ row }">
                    <span v-if="row.strategyName == '最低售价'"
                      >{{ row.sellPrice | priceFilters }} -
                      {{ row.minRequiredQty }}</span
                    >
                    <span v-else>{{ row.sellPrice | priceFilters }}</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column
                  field="updateUname"
                  title="更新人"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="updateTime"
                  title="更新日期"
                  width="100"
                ></vxe-table-column>
              </vxe-table>
            </div>
          </TabPane>
        </Tabs>
      </div>
      <div slot="footer">
        <!--<Button type='primary' @click='submit("proModal")'>确定</Button>-->
        <!--<Button type='default' @click='proModal = false'>取消</Button>-->
      </div>
    </Modal>
    <part-info
      ref="partInfo"
      :is-add-part="true"
      @throwData="addPartFun"
    ></part-info>
    <select-part-info ref="selectPartInfo" @throwData="throwDataChangeNum"></select-part-info>
    <link-part
      ref="LinkPart"
      :guestId="guestId"
      :storeId="storeId"
      :partId="partId"
    ></link-part>
  </div>
</template>

<script>
import PartInfo from "_c/partInfo/partInfo";
import { mixSelectPartCom } from "./mixSelectPartCom";
import SelectPartInfo from "./selectPartInfo";
import LinkPart from "./LinkPart";

export default {
  name: "selectPartCom",
  mixins: [mixSelectPartCom],
  components: { SelectPartInfo, PartInfo, LinkPart },
  props: {
    guestId: "",
    storeId: ""
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
