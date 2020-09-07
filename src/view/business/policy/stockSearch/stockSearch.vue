<template>
  <div class="content-oper" style="height: 100%" ref="operWrap">
    <section class="oper-box">
      <!--      主菜单导航-->
      <div class="db pl10 tabs-ulwarp">
        <ul class="tabs">
          <li
            v-if="!curronly"
            class="center"
            :class="{ 'tab-active': tabIndex == 0 }"
            @click="setTab(0)"
          >
            汇总库存
          </li>
          <li
            class="center"
            :class="{ 'tab-active': tabIndex == 1 }"
            @click="setTab(1)"
          >
            批次库存
          </li>
          <li
            class="center"
            :class="{ 'tab-active': tabIndex == 2 }"
            @click="setTab(2)"
          >
            华胜库存查询
          </li>
        </ul>
      </div>
      <!--      汇总库存表-->
      <div class="tabs-warp" v-show="tabIndex == 0" >
        <!--      搜索工具栏-->
        <div class="oper-top flex" >
          <div class="pt10">
            <Input
              v-model="searchForm.partName"
              placeholder="配件编码/名称/内码/OEM码"
              class="w200 mr10"
              @on-enter="serch"
            />
            <Select
              filterable
              clearable
              class="w120 mr10"
              v-model="searchForm.partBrand"
              placeholder="品牌"
              @on-change="serch"
            >
              <Option
                v-for="item in partBrandList"
                :value="item.name"
                :key="item.id"
                >{{ item.name }}</Option
              >
            </Select>
            <Select
              class="w200 mr10"
              filterable
              @on-change="changecompanyFun"
              v-model="searchForm.old"
              placeholder="公司"
            >
              <Option
                v-for="item in Branchstore"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option>
            </Select>
            <Select
              class="w150 mr10"
              multiple
              v-model="searchForm.storeIds"
              placeholder="仓库"
              @on-change="select1"
            >
              <Option
                :disabled="item.isDisabled"
                v-show="item.orgid == searchForm.old || item.id == 1"
                v-for="item in storeList"
                :value="item.id"
                :key="item.id"
                >{{ item.name }}</Option
              >
            </Select>
            <Input
              placeholder="仓位"
              class="w120 mr10"
              v-model="searchForm.shelf"
              @on-enter="serch"
            />
            <span class="mr5">显示零库存:</span>
            <Checkbox v-model="searchForm.noStock"></Checkbox>
            <Button type="warning" class="mr10 w90" @click="serch">
              <Icon type="ios-search" size="14" />查询
            </Button>
            <Button class="mr10 w90" @click="exportTheSummary" v-has="'export'">
              <i class="iconfont mr5 icondaochuicon"></i> 导出
            </Button>
          </div>
        </div>
        <!--    表-->
        <!--<Table-->
          <!--class="table-highlight-row"-->
          <!--highlight-row-->
          <!--ref="table1"-->
          <!--border-->
          <!--size="small"-->
          <!--:loading="loading1"-->
          <!--align="left"-->
          <!--:stripe="true"-->
          <!--height="400"-->
          <!--resizable-->
          <!--:columns="columns1"-->
          <!--:data="contentOne.dataOne"-->
          <!--show-summary-->
          <!--:summary-method="handleSummary"-->
        <!--&gt;</Table>-->
        <vxe-table
          border
          ref="xTable2"
          :height="tableHeight"
          highlight-hover-row
          highlight-current-row
          stripe
          show-overflow
          resizable
          :loading="loading1"
          size="mini"
          show-footer
          :footer-method="handleSummary"
          :data="contentOne.dataOne">
          <vxe-table-column type="seq" title="序号" width="50" fixed="left"></vxe-table-column>
          <vxe-table-column field="cz" title="操作" width="50" fixed="left">
            <template v-slot="{row}">
              <vxe-button type="text" @click="showList(row);">查看</vxe-button>
            </template>
          </vxe-table-column>
          <vxe-table-column field="orgName" title="机构名称" width="130" fixed="left"></vxe-table-column>
          <vxe-table-column field="partCode" title="配件编码" width="100" fixed="left"></vxe-table-column>
          <vxe-table-column field="partName" title="配件名称" width="100" fixed="left"></vxe-table-column>
          <vxe-table-column field="oemCode" title="OE码" width="110" fixed="left"></vxe-table-column>
          <vxe-table-column field="carBrandName" title="厂牌" width="80" fixed="left"></vxe-table-column>
          <vxe-table-column field="partBrand" title="品牌" width="80" fixed="left" :filters="[]" :filter-method="filterNameMethod1"></vxe-table-column>
          <vxe-table-column field="carModelName" title="品牌车型" width="110"></vxe-table-column>
          <vxe-table-column field="stockQty" title="库存数量" width="70"></vxe-table-column>
          <vxe-table-column field="outableQty" title="可售数量" width="70">
            <template v-slot="{row}">
              {{row.sellSign ? 0 : row.outableQty}}
            </template>
          </vxe-table-column>
          <vxe-table-column field="storeName" title="仓库" width="80"></vxe-table-column>
          <vxe-table-column field="shelf" title="仓位" width="100"></vxe-table-column>
          <vxe-table-column field="costPrice" title="库存单价" width="80">
            <template v-slot="{row}">
              {{row.costPrice.toFixed(2)}}
            </template>
          </vxe-table-column>
          <vxe-table-column field="stockAmt" title="库存金额" width="90">
            <template v-slot="{row}">
              {{row.stockAmt.toFixed(2)}}
            </template>
          </vxe-table-column>
          <vxe-table-column field="unit" title="单位" width="50"></vxe-table-column>
          <vxe-table-column field="spec" title="规格" width="80"></vxe-table-column>
          <vxe-table-column field="partInnerId" title="配件内码" width="70"></vxe-table-column>
          <vxe-table-column field="lastEnterDate" title="最近入库日期" width="120"></vxe-table-column>
          <vxe-table-column field="lastOutDate" title="最近出库日期" width="120"></vxe-table-column>
          <vxe-table-column field="upLimit" title="库存上限" width="70"></vxe-table-column>
          <vxe-table-column field="downLimit" title="库存下限" width="70"></vxe-table-column>
          <vxe-table-column field="pchRoadQty" title="采购在途库存" width="100"></vxe-table-column>
          <vxe-table-column field="attotRoadQty" title="调拨在途库存" width="100"></vxe-table-column>
          <vxe-table-column field="onRoadQty" title="合计在途库存" width="100"></vxe-table-column>
        </vxe-table>
      </div>
      <!--      批次库存表-->
      <div class="tabs-warp" v-show="tabIndex == 1">
        <!--      搜索工具栏-->
        <div class="oper-top flex">
          <div class="pt10">
            <!--<Input v-model="searchForm1.partCode" placeholder="配件编码" class="w200 mr10"></Input>-->
            <Input
              v-model="searchForm1.partName"
              placeholder="配件编码/名称/内码/OEM码"
              class="w200 mr10"
              @on-enter="queryBatch"
            ></Input>
            <Select
              filterable
              clearable
              class="w120 mr10"
              v-model="searchForm1.partBrand"
              placeholder="品牌"
              @on-change="queryBatch"
            >
              <Option
                v-for="item in partBrandList"
                :value="item.name"
                :key="item.id"
                >{{ item.name }}</Option
              >
            </Select>
            <Select
              v-if="showSearch == true"
              class="w200 mr10"
              filterable
              @on-change="changecompanyFun2"
              v-model="searchForm1.old"
              placeholder="公司"
            >
              <Option
                v-for="item in Branchstore"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
            <Select
              class="w240 mr10"
              multiple
              v-model="searchForm1.storeIds"
              placeholder="仓库"
              @on-change="select2"
            >
              <Option
                :disabled="item.isDisabled"
                v-show="item.orgid == searchForm1.old || item.id == 1"
                v-for="item in storeList"
                :value="item.id"
                :key="item.storeId"
                >{{ item.name }}</Option
              >
            </Select>
            <!-- <Input
              v-model="searchForm1.shelf"
              placeholder="仓位"
              class="w120 mr10"
            ></Input> -->
            <!--<span class="mr5">显示零库存:</span>-->
            <!--<Checkbox v-model="searchForm1.noStock"></Checkbox>-->
            <Button type="warning" class="mr10 w90" @click="queryBatch">
              <Icon type="ios-search" size="14" />查询
            </Button>
            <Button class="mr10 w90" @click="exportBatch">
              <i class="iconfont mr5 icondaochuicon" v-has="'exportBatch'"></i>
              导出
            </Button>
            <!--<Button class="mr10 w120" @click="sfy" v-has="'safe'">安全库存设置</Button>-->
          </div>
        </div>
        <!--        表-->
        <!--<Table-->
          <!--class="table-highlight-row"-->
          <!--highlight-row-->
          <!--size="small"-->
          <!--ref="table2"-->
          <!--align="left"-->
          <!--border-->
          <!--:loading="loading2"-->
          <!--:stripe="true"-->
          <!--:columns="columns2"-->
          <!--:data="contentTwo.dataTwo"-->
          <!--height="400"-->
          <!--show-summary-->
          <!--:summary-method="handleSummary"-->
        <!--&gt;</Table>-->
        <vxe-table
          border
          ref="xTable3"
          :height="tableHeight"
          highlight-hover-row
          highlight-current-row
          stripe
          show-overflow
          resizable
          :loading="loading2"
          size="mini"
          show-footer
          :footer-method="handleSummary"
          @sort-change="sortEnterDateMethod"
          :sort-config="{trigger: 'cell', defaultSort: {field: 'createTime', order: 'desc'}, orders: ['desc', 'asc']}"
          :data="contentTwo.dataTwo">
          <vxe-table-column type="seq" title="序号" width="50" fixed="left"></vxe-table-column>
          <vxe-table-column field="guestName" title="供应商" width="140" fixed="left"></vxe-table-column>
          <vxe-table-column field="createTime" title="入库日期" width="100" fixed="left"  remote-sort></vxe-table-column>
          <vxe-table-column field="partCode" title="配件编码" width="110" fixed="left"></vxe-table-column>
          <vxe-table-column field="partName" title="配件名称" width="110" fixed="left"></vxe-table-column>
          <vxe-table-column field="partBrand" title="品牌" width="80" fixed="left" :filters="[]" :filter-method="filterNameMethod1"></vxe-table-column>
          <vxe-table-column field="carModelName" title="品牌车型" width="90"></vxe-table-column>
          <vxe-table-column field="oemCode" title="OE码" width="100"></vxe-table-column>
          <vxe-table-column field="carBrandName" title="厂牌" width="80"></vxe-table-column>
          <vxe-table-column field="enterQty" title="入库数量" width="70">
          </vxe-table-column>
          <vxe-table-column field="outableQty" title="可售数量" width="70"></vxe-table-column>
          <vxe-table-column field="storeName" title="仓库" width="80"></vxe-table-column>
          <vxe-table-column field="enterPrice" title="成本单价" width="80">
            <template v-slot="{row}">
              {{selectShopList&&row.enterTypeId!='050101'?'-':row.enterPrice.toFixed(2)}}
            </template>
          </vxe-table-column>
          <vxe-table-column field="enterAmt" title="成本金额" width="90">
            <template v-slot="{row}">
              {{selectShopList&&row.enterTypeId!='050101'?'-':row.enterAmt.toFixed(2)}}
            </template>
          </vxe-table-column>
          <vxe-table-column field="taxRate" title="税率" width="60">
            <template v-slot="{row}">
              {{selectShopList&&row.enterTypeId!='050101'?'-':row.taxRate}}
            </template>
          </vxe-table-column>
          <vxe-table-column field="taxPrice" title="含税单价" width="100">
            <template v-slot="{row}">
              {{selectShopList&&row.enterTypeId!='050101'?'-':(row.taxPrice || 0).toFixed(2)}}
            </template>
          </vxe-table-column>
          <vxe-table-column field="taxAmt" title="含税金额" width="100">
            <template v-slot="{row}">
              {{selectShopList&&row.enterTypeId!='050101'?'-':(row.taxAmt || 0).toFixed(2)}}
            </template>
          </vxe-table-column>
          <vxe-table-column field="noTaxPrice" title="不含税单价" width="100">
            <template v-slot="{row}">
              {{selectShopList&&row.enterTypeId!='050101'?'-':(row.noTaxPrice || 0).toFixed(2)}}
            </template>
          </vxe-table-column>
          <vxe-table-column field="noTaxAmt" title="不含税金额" width="100">
            <template v-slot="{row}">
              {{selectShopList&&row.enterTypeId!='050101'?'-':(row.noTaxAmt || 0).toFixed(2)}}
            </template>
          </vxe-table-column>
          <vxe-table-column field="chainStockAge" title="连锁库龄" width="70"></vxe-table-column>
          <vxe-table-column field="branchStockAge" title="本店库龄" width="70"></vxe-table-column>
          <vxe-table-column field="isUnsalable" title="滞销" width="50">
            <template v-slot="{row}">
              {{row.isUnsalable == 0 ? "否" : "是"}}
            </template>
          </vxe-table-column>
          <vxe-table-column field="serviceId" title="入库单号" width="124"></vxe-table-column>
          <vxe-table-column field="originGuestName" title="第一供应商" width="150"></vxe-table-column>
          <vxe-table-column field="enterUnitId" title="单位" width="50"></vxe-table-column>
          <vxe-table-column field="spec" title="规格" width="80"></vxe-table-column>
          <vxe-table-column field="partInnerId" title="配件内码" width="70"></vxe-table-column>
          <vxe-table-column field="orgName" title="机构名称" width="150"></vxe-table-column>
        </vxe-table>
      </div>
      <!-- hs -->
      <div class="tabs-warp" v-show="tabIndex == 2">
        <div class="oper-top flex">
          <div class="wlf wlf-center wlf-center-hs">
            <div class="db mr10">
              <span>公司名称：</span>
              <Select
                v-model="company"
                class="w200 mr10"
                placeholder="选择公司"
                filterable
                clearable
                @on-change="resetData"
              >
                <Option
                  v-for="item in hsStore"
                  :value="item.erpCompCode"
                  :key="item.id"
                  >{{ item.fullName }}</Option
                >
              </Select>
            </div>
            <div class="db mr10">
              <span>查询项：</span>
              <Select v-model="searchData.partType" class="w120 mr10">
                <Option
                  v-for="item in partType"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.name }}</Option
                >
              </Select>
              <Input
                v-model="searchData.partName"
                class="w250 mr10"
                @on-enter="resetData"
              />
            </div>
            <div class="db">
              <Button
                class="mr10 w90"
                type="warning"
                @click="resetData"
                v-has="'examine'"
              >
                <Icon type="ios-search" size="14" />查询
              </Button>
            </div>
          </div>
        </div>
        <!--<Table-->
          <!--size="small"-->
          <!--height="389"-->
          <!--ref="hsOrder"-->
          <!--:loading="hsloading"-->
          <!--resizable-->
          <!--border-->
          <!--:stripe="true"-->
          <!--:columns="columnsPart"-->
          <!--:data="templateData"-->
        <!--&gt;</Table>-->
        <vxe-table
          border
          ref="hsOrder"
          :height="tableHeight"
          highlight-hover-row
          highlight-current-row
          stripe
          show-overflow
          resizable
          :loading="hsloading"
          size="mini"
          :data="templateData">
          <vxe-table-column type="seq" title="序号" width="80"></vxe-table-column>
          <vxe-table-column field="partID" title="配件ID" width="150"></vxe-table-column>
          <vxe-table-column field="partCode" title="配件编码" width="200"></vxe-table-column>
          <vxe-table-column field="partName" title="配件名称" width="300"></vxe-table-column>
          <vxe-table-column field="brandName" title="品牌名称" width="200"></vxe-table-column>
          <vxe-table-column field="amount" title="入库数量" width="120"></vxe-table-column>
          <vxe-table-column field="outAmount" title="可出库数" width="120"></vxe-table-column>
          <vxe-table-column field="shortname" title="门店名称" width="200">
          </vxe-table-column>
          <vxe-table-column field="unit" title="单位" width="120"></vxe-table-column>
          <vxe-table-column field="deliveryDue" title="入库日期" width="200">
            <template v-slot="{row}">
              {{refilterData(row.deliveryDue)}}
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
      <!--      分页-->
      <div class="page-warp fw">
        <p v-if="tabIndex == 0">
          <span>查询结果统计</span>
          <span
            >总库存：<span>{{ total1.stockQty }}</span></span
          >
          <span
            >可售库存：<span>{{ total1.outableQty }}</span></span
          >
          <span
            >总金额：<span>{{ total1.stockAmt }}</span></span
          >
        </p>

        <p v-if="tabIndex == 1">
          <span>查询结果统计</span>
          <span
            >总库存：<span>{{ total2.enterQty }}</span></span
          >
          <span
            >可售库存：<span>{{ total2.outableQty }}</span></span
          >
          <span
            >总金额：<span>{{ total2.enterAmt }}</span></span
          >
        </p>

        <Page
          v-if="tabIndex == 0"
          class-name="page-con"
          :current="contentOne.page.num"
          :total="contentOne.page.total"
          :page-size="contentOne.page.size"
          @on-change="changePageAlways"
          @on-page-size-change="changeSizeAlways"
          size="small"
          show-sizer
          show-total
          :page-size-opts="[10,20,30,50]"
        ></Page>
        <Page
          v-if="tabIndex == 1"
          class-name="page-con"
          :current="contentTwo.page.num"
          :total="contentTwo.page.total"
          :page-size="contentTwo.page.size"
          @on-change="changePageCus"
          @on-page-size-change="changeSizeCus"
          size="small"
          show-sizer
          show-total
          :page-size-opts="[10,20,30,50]"
        ></Page>
        <Page
          v-if="tabIndex == 2"
          class-name="page-con"
          :current="hspage.num"
          :total="hspage.total"
          :page-size="hspage.size"
          @on-change="selectNum"
          @on-page-size-change="selectPage"
          size="small"
          show-sizer
          show-total
        ></Page>
      </div>
      <!--      点击查看显示-->
      <enter-stock ref="look" :mainData="selectTableData"></enter-stock>
    </section>
  </div>
</template>
<script>
import {
  getAllStock,
  getLotStock,
  getPartBrand,
  getPartBrandNoWB,
  findMasterOrgId,
  getStoreAll,
  PtabulatData,
  EtabulatData,
  exportAll,
  exportPart
} from "@/api/business/stockSearch";
import EnterStock from "./enterStock";
import { getwarehouse } from "@/api/system/setWarehouse";
import { creat } from "../../../settlementManagement/components";
///// hs
import {
  getAllTemplate,
  getAllFile,
  getStock,
  getHsStore
} from "@/api/system/systemSetting/systemset";
import api from "_conf/url";
import { TOKEN_KEY } from "@/libs/util";
import Cookies from "js-cookie";
import moment from "moment";
import axios from '@/libs/api.request'
// import * as api from "_api/system/partManager";
export default {
  name: "stockSearch",
  components: { EnterStock },
  data() {
    return {
      bands1: [],
      bands2: [],
      total1: {},
      total2: {},
      shopkeeper: 0, // 1 总部
      shopId: this.$store.state.user.userData.currentCompany.id,
      // 品牌选项
      partBrandList: [],
      //默认仓库选项
      storeList: [{ name: "全部", id: 1 }],
      //汇总库存查询条件表单
      searchForm: {
        partBrand: "", //品牌id
        partCode: "", //配件编码
        storeIds: [], //仓库id
        partName: "", //配件名称
        shelf: "", //仓位
        noStock: false, //零库存
        old: "" //仓库
      },
      //批次库存查询条件表单
      searchForm1: {
        partBrand: "", //品牌id
        partCode: "", //配件编码
        storeIds: [], //仓库id
        partName: "", //配件名称
        shelf: "", //仓位
        noStock: false, //库存
        old: "" //仓库
      },
      curronly: false,
      storeName: "999",
      // tab索引
      tabIndex: 0,
      showSearch: true,
      selectTableData: "",
      //查看框
      look: false,
      // 汇总库存列表
      columns1: [],
      //批次库存列表
      columns2: [],
      // 汇总库存的数据
      contentOne: {
        //数据
        dataOne: [],
        // 分页
        page: {
          num: 1,
          total: 0,
          size: 10
        }
      },
      //批次库存的数据
      contentTwo: {
        //分页
        page: {
          num: 1,
          total: 0,
          size: 10
        },
        //数据
        dataTwo: []
      },
      //分店
      Branchstore: [],
      ////////// hs
      company: "",
      hsStore: [],

      //查询项
      partType: [
        {
          name: "配件编码",
          value: "partCode"
        },
        {
          name: "品牌名称",
          value: "brandName"
        },
        {
          name: "配件ID",
          value: "partID"
        }
      ],
      //分页
      hspage: {
        total: 0,
        size: 10,
        num: 1
      },
      //配件名称查询层表头
      columnsPart: [
        {
          title: "序号",
          width: 80,
          type: "index",
          tooltip: true
        },
        {
          title: "配件ID",
          key: "partID",
          width: 150,
          resizable: true,
          tooltip: true
        },
        {
          title: "配件编码",
          key: "partCode",
          width: 200,
          resizable: true,
          tooltip: true
        },
        {
          title: "配件名称",
          key: "partName",
          width: 300,
          resizable: true,
          tooltip: true
        },
        {
          title: "品牌名称",
          key: "brandName",
          width: 200,
          resizable: true,
          tooltip: true
        },
        {
          title: "入库数量",
          key: "amount",
          width: 120,
          resizable: true,
          tooltip: true
        },
        {
          title: "可出库数",
          key: "outAmount",
          width: 120,
          resizable: true,
          tooltip: true
        },
        {
          title: "门店名称",
          key: "shortname",
          width: 200,
          resizable: true,
          tooltip: true
        },
        {
          title: "单位",
          key: "unit",
          width: 120,
          resizable: true,
          tooltip: true
        },
        {
          title: "入库日期",
          key: "deliveryDue",
          width: 200,
          resizable: true,
          render: (h, p) => {
            if (p.row.deliveryDue) {
              let day = moment(p.row.deliveryDue).format("YYYY-MM-DD HH:mm:ss");
              return h("span", day);
            }
          },
          tooltip: true
        }
      ],

      hsloading: false,
      //tabs切换标签
      //模板数据
      templateData: [],
      //搜索条件
      searchData: {
        partName: "",
        partType: "partCode"
      },
      //表格勾选数据
      selectTableDataArr: [],
      headers: {
        Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
      },
      loading1:false,
      loading2:false,
      tableHeight:0,
      defaultSort:'desc'
    };
  },
  computed:{
    selectShopList(){
      if(this.$store.state.user.userData.currentCompany!=null){
        return this.$store.state.user.userData.currentCompany.isMaster ? true : false
      }else{
        return true
      }
    }
  },
  mounted() {
    this.getCommpany();
    this.getMasterId();
    this.getHsStoreFun();

    this.$nextTick(() => {
      this.tableHeight = this.$refs.operWrap.offsetHeight - 146;
    })
  },
  methods: {
    select1(option) {
      if (option.slice(-1)[0] == 1) {
        option = [1];
      } else if (option.includes(1)) {
        option = option.filter(el => el != 1);
      }
      this.searchForm.storeIds = option;
      this.serch();
    },
    select2(option) {
      if (option.slice(-1)[0] == 1) {
        option = [1];
      } else if (option.includes(1)) {
        option = option.filter(el => el != 1);
      }
      this.searchForm1.storeIds = option;
      this.queryBatch();
    },
    getColumns() {
      if(this.selectShopList){
        this.$nextTick(() => {
          this.$refs.xTable3.hideColumn(this.$refs.xTable3.getColumnByField('originGuestName'));
          this.$refs.xTable2.hideColumn(this.$refs.xTable2.getColumnByField('costPrice'));
          this.$refs.xTable2.hideColumn(this.$refs.xTable2.getColumnByField('stockAmt'));
        })
        if (this.shopkeeper != 1 && this.shopId != this.searchForm.old) {
          this.$nextTick(() => {
            //this.$refs.xTable2.hideColumn(this.$refs.xTable2.getColumnByField('cz'))
            this.$refs.xTable2.hideColumn(this.$refs.xTable2.getColumnByField('stockQty'))
          })
        } else {
          this.$nextTick(() => {
            this.$refs.xTable2.showColumn(this.$refs.xTable2.getColumnByField('cz'))
            this.$refs.xTable2.showColumn(this.$refs.xTable2.getColumnByField('stockQty'))
          })
        }
      }else{
        this.$nextTick(() => {
          this.$refs.xTable2.showColumn(this.$refs.xTable2.getColumnByField('cz'))
          this.$refs.xTable2.showColumn(this.$refs.xTable2.getColumnByField('stockQty'))
        })
        this.$nextTick(() => {
          this.$refs.xTable3.showColumn(this.$refs.xTable3.getColumnByField('originGuestName'))
        })
      }
    },
    changecompanyFun() {
      this.searchForm.storeIds = [];
      this.getColumns();
      this.serch();
    },
    changecompanyFun2() {
      this.searchForm1.storeIds = [];
      this.queryBatch();
    },
    changeStore() {
      this.serch();
    },
    changeStore2() {
      this.queryBatch();
    },
    //获取用户所属机构
    async getMasterId() {
      let reqData = await findMasterOrgId();
      if (!reqData.data) {
        this.columns2.forEach((el, index, arr) => {
          if (el.key === "originGuestName") {
            arr.splice(index, 1);
          }
        });
      }
    },
    //获取分店
    async getCommpany() {
      let arr = await creat([], this.$store);
      this.Branchstore = [{ value: "", label: "全连锁" }, ...arr[2]] || [
        { value: "", label: "全连锁" }
      ];
      this.searchForm.old = arr[1] || "";
      this.searchForm1.old = arr[1] || "";
      this.getStoreHoure();
      this.getBand(); //获取品牌
      //this.getAllStocks(); //table请求
      this.getColumns();
    },
    //搜索
    serch() {
      this.contentOne.page.num = 1;
      this.getAllStocks();
    },
    // 汇总库存请求
    async getAllStocks() {
      let data = {};
      data = JSON.parse(JSON.stringify(this.searchForm));
      data.partName = data.partName.trim();
      if (data.storeIds[0] == 1) {
        data.storeIds = [];
      }
      if (data.old === "all") {
        Reflect.deleteProperty(data, "old");
      }
      data.page = this.contentOne.page.num - 1;
      data.size = this.contentOne.page.size;
      data.noStock = data.noStock ? 1 : 0;
      this.loading1 = true;
      this.contentOne.dataOne = [];
      let res = await getAllStock(data);
      this.loading1 = false;
      if (res.code == 0) {
        this.contentOne.dataOne = res.data.content;
        this.contentOne.page.total = res.data.totalElements;
        let row = res.data.content[0];
        if (row != undefined) {
          this.shopkeeper = Reflect.has(row, "isMaster") ? row.isMaster : 0;
        }
        this.bands1 = [];
        let arr = res.data.content.map(el => el.partBrand);
        let set = new Set(arr);
        set.forEach(el => {
          this.bands1.push({ label: el, value: el });
        });
        this.$nextTick(()=>{
          const xtable = this.$refs.xTable2;
          const column = xtable.getColumnByField('partBrand');
          xtable.setFilter(column, this.bands1);
          xtable.updateData();
        })

        // this.columnsPart[6].filters = this.bands1;
        this.getColumns();
      }

      let res1 = await PtabulatData(data);
      if (res1.code == 0) {
        this.total1 = res1.data;
        // console.log(res1.data);
      }
    },
    //汇总分页
    changePageAlways(val) {
      // console.log('11',val)
      this.contentOne.page.num = val;
      this.getAllStocks();
    },
    //汇总条数
    changeSizeAlways(val) {
      // console.log('22',val)
      this.contentOne.page.num = 1;
      this.contentOne.page.size = val;
      this.getAllStocks();
    },
    //汇总查看
    showList(val) {
      this.selectTableData = val;
      this.$refs.look.getEnters();
    },
    // 批次库存请求
    async getLotStocks() {
      let data = {};
      data = JSON.parse(JSON.stringify(this.searchForm1));
      data.partName = data.partName.trim();
      if (data.storeIds[0] == 1) {
        data.storeIds = [];
      }
      if (data.old === "all") {
        Reflect.deleteProperty(data, "old");
      }
      data.page = this.contentTwo.page.num - 1;
      data.size = this.contentTwo.page.size;
      data.noStock = data.noStock ? 1 : 0;
      this.defaultSort=='asc'?data.enterTimeSort = 1:"";
      this.loading2 = true;
      this.contentTwo.dataTwo = [];
      let res = await getLotStock(data);
      this.loading2 = false;
      if (res.code == 0) {
        this.contentTwo.dataTwo = res.data.content;
        this.contentTwo.dataTwo.map((item, index) => {
          item.index = index + 1;
          item.outableQty = item.sellSign ? 0 : item.outableQty;
          if(this.selectShopList&&item.enterTypeId!='050101'){
            item.enterPrice = '-';
            item.enterAmt = '-';
            item.taxRate = '-';
            item.taxPrice = '-';
            item.taxAmt = '-';
            item.noTaxPrice = '-';
            item.noTaxAmt = '-';
          }
        });
        this.contentTwo.page.total = res.data.totalElements;
        this.bands2 = [];
        let arr = res.data.content.map(el => el.partBrand);
        let set = new Set(arr);
        set.forEach(el => {
          this.bands2.push({ label: el, value: el });
        });
        this.$nextTick(()=>{
          const xtable = this.$refs.xTable3;
          const column = xtable.getColumnByField('partBrand');
          xtable.setFilter(column, this.bands2);
          xtable.updateData();
        })
      }

      let res1 = await EtabulatData(data);
      if (res1.code == 0) {
        this.total2 = res1.data;
        // console.log(res1.data);
      }
    },
    // tab切换
    setTab(index) {
      this.tabIndex = index;
      this.showSearch = this.shopkeeper == 1 || index == 0;
      // if (index==1&&this.contentTwo.dataTwo.length==0){
      //   this.getLotStocks(); //获取批次
      // }
      // if(index==2&&this.templateData.length==0){
      //   this.getTemplateList();
      // }
      this.$nextTick(()=>{
        this.$refs.xTable3.recalculate();
        this.$refs.xTable2.recalculate();
        this.$refs.hsOrder.recalculate();
      })
    },
    // 修改每页显示条数-客户信息
    changeSizeCus(val) {
      // console.log('22',val)
      this.contentTwo.page.num = 1;
      this.contentTwo.page.size = val;
      this.getLotStocks();
    },
    changePageCus(val) {
      // console.log('22',val)
      this.contentTwo.page.num = val;
      this.getLotStocks();
    },
    //安全库存弹窗
    sfy() {
      this.safetyModal = true;
    },
    //获取仓库下拉选择信息
    async getStoreHoure() {
      // let res = await getwarehouse({});
      let res = await getStoreAll();
      if (res.code == 0) {
        // this.storeList = res.data;
        // console.log("222", res);
        res.data.forEach(el => {
          if(el.id){
            el.name = el.name;
            el.id = el.id;
            this.storeList.push(el);
          }
        });
      }
      // this.storeList.unshift({ name: "全部", storeId: '1' })
    },
    async getBand() {
      let res = await getPartBrand({ pageSize: 10000 });
      if (res.code === 0) {
        let arr = [];
        let arrData = res.data.content || [];
        arrData.forEach(item => {
          arr.push(...item.children);
        });
        this.partBrandList = arr;
      }
    },
    //查询批次
    queryBatch() {
      this.contentTwo.page.num = 1;
      this.getLotStocks();
    },

    //汇总库存请求当前全数据
    async getStockAll() {
      let data = {};
      data = this.searchForm;
      data.page = 0;
      data.size = this.contentOne.page.total;
      data.noStock = data.noStock ? 1 : 0;
      data.isImport = 1;
      if(this.contentOne.dataOne.length<=0){
        this.$Message.error("这个公司暂时没有库存")
        return
      }
      let res = await getAllStock(data);
      if (res.code == 0) {
        let arrData = res.data.content || [];
        let newData = arrData.map((item1, index) => {
          let item = { ...item1 };
          for (let b in item) {
            if (item[b] && typeof item[b] == "string") {
              item[b] = item[b].replace(/[\r\n,"]/g, "");
              item[b] = "\t" + item[b];
            }
          }
          item.index = index + 1;
          item.outableQty = item.sellSign ? 0 : item.outableQty;
          item.costPrice = item.costPrice.toFixed(2);
          item.stockAmt = item.stockAmt.toFixed(2);
          item.partCode = "\t" + item.partCode;
          item.oemCode = "\t" + item.oemCode;
          return item;
        });
        // if (newData.length >= 0) {
        //   this.$refs.table1.exportCsv({
        //     filename: "汇总库存",
        //     original: true,
        //     columns: this.columns1,
        //     data: newData
        //   });
        // }else{
        //   this.$Message.error("这个公司暂时没有库存")
        // }
      }
    },

    //汇总导出
    exportTheSummary() {
      let data = {};
      data = this.searchForm;
      data.page = 0;
      data.size = this.contentOne.page.total;
      data.noStock = data.noStock ? 1 : 0;
      data.isImport = 1;
      if(this.contentOne.dataOne.length<=0){
        this.$Message.error("这个公司暂时没有库存")
        return
      }
      if (data.old === "all" || data.old==undefined) {
        Reflect.deleteProperty(data, "old");
      }
      data.old == "all"?data.old="":"";
      let str=""
      for(var key in data){
        str+=`${key}=${data[key]}&`
      }
      let PaymentRecordUrl=`${exportAll}${str.slice(0,str.length-1)}` +
        "&access_token=" +
        Cookies.get(TOKEN_KEY);
      location.href =PaymentRecordUrl
    },

    //批次库存请求当前全数据
    async getBatchStockAll() {
      let data = {};
      data = this.searchForm1;
      data.page = 0;
      data.size = this.contentTwo.page.total;
      data.noStock = data.noStock ? 1 : 0;
      data.isImport = 1;
      if(this.contentTwo.dataTwo.length<=0){
        this.$Message.error("这个公司暂时没有库存")
        return
      }
      if (data.old === "all") {
        Reflect.deleteProperty(data, "old");
      }
      let res = await getLotStock(data);
      if (res.code == 0) {
        let arrData2 = res.data.content || [];
        let newData=arrData2.map((item, index) => {
          item.index = index + 1;
          item.outableQty = item.sellSign ? 0 : item.outableQty;
        });
        if (arrData2.length > 0) {
          let arrData = arrData2.map(item => {
            let objData = { ...item };
            for (let b in objData) {
              if (objData[b] && typeof objData[b] == "string") {
                objData[b] = objData[b].replace(/[\r\n,"]/g, "");
              }
            }
            objData.enterPrice = objData.enterPrice.toFixed(2);
            objData.enterAmt = objData.enterAmt.toFixed(2);
            objData.noTaxPrice = objData.noTaxPrice.toFixed(2);
            objData.noTaxAmt = objData.noTaxAmt.toFixed(2);
            objData.isUnsalable = objData.isUnsalable === 0 ? "否" : "是";
            objData.partCode = "\t" + objData.partCode;
            objData.oemCode = "\t" + objData.oemCode;
            return objData;
          });
          if (newData.length >= 0) {
            this.$refs.table2.exportCsv({
              filename: "批次库存",
              original: false,
              columns: this.columns2,
              data: arrData
            });
          }else{
            this.$Message.error("这个公司暂时没有库存呢")
          }
        }
      }
    },
    //导出批次
    exportBatch() {
      let data = {};
      data = this.searchForm1;
      data.page = 0;
      data.size = this.contentTwo.page.total;
      data.noStock = data.noStock ? 1 : 0;
      data.isImport = 1;
      if(this.contentTwo.dataTwo.length<=0){
        this.$Message.error("这个公司暂时没有库存")
        return
      }
      if (data.old === "all" || data.old==undefined) {
        Reflect.deleteProperty(data, "old");
      }
      let str=""
      for(var key in data){
        str+=`${key}=${data[key]}&`
      }
      let PaymentRecordUrl=`${exportPart}/partStoreStock/export/PartStoreStock?${str.slice(0,str.length-1)}` +
        "&access_token=" +
        Cookies.get(TOKEN_KEY);
      location.href =PaymentRecordUrl
    },

    /////////////////////// hs
    async getTemplateList() {
      let req = {};
      let params = {};
      if (this.searchData.partName.trim()) {
        req[this.searchData.partType] = this.searchData.partName;
      }
      if (this.company) {
        req["compcodes"] = [this.company];
      }
      req.page = this.hspage.num;
      req.pageSize = this.hspage.size;
      this.hsloading = true;
      let rep = await getStock(req, params);
      this.hsloading = false;
      if (rep.code === 0) {
        this.templateData = rep.data.data.items || [];
        this.hspage.total = rep.data.data.total;
      }
    },
    async getHsStoreFun() {
      let rep = await getHsStore();
      if (rep.code == 0) {
        this.hsStore = (rep.data || []).filter(item => item.erpCompCode);
      }
    },
    resetData() {
      this.hspage.num = 1;
      this.hspage.size = 10;
      this.getTemplateList();
    },
    //切换页面
    selectNum(val) {
      this.hspage.num = val;
      this.getTemplateList();
    },
    //切换页数
    selectPage(val) {
      this.hspage.num = 1;
      this.hspage.size = val;
      this.getTemplateList();
    },
    handleSummary({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '和值'
          }
          if ([
            "stockQty",
            "outableQty",
            "stockAmt",
            "pchRoadQty",
            "attotRoadQty",
            "onRoadQty",
            "enterAmt",
            "taxAmt",
            "costPrice",
            "upLimit",
            "downLimit"
          ].includes(column.property)) {
            const v = data.reduce((prev, curr) => {
              const value = Number(curr[column.property]);
              if (!isNaN(value)) {
                return prev + curr[column.property];
              } else {
                return prev;
              }
            }, 0);
            if(['stockAmt','costPrice','enterAmt'].includes(column.property)){
              return v.toFixed(2);
            }
            return v
          }
          return null
        })
      ]
    },
    filterNameMethod1({ value, row, column }){
      if(!value){
        return !row.partBrand
      }
      if(row.partBrand){
        return row.partBrand.indexOf(value) > -1;
      }else{
        return false
      }
    },
    refilterData(data){
      if(!data){
        return ""
      }
      return moment(data).format("YYYY-MM-DD HH:mm:ss")
    },
    sortEnterDateMethod({ order }){
      this.defaultSort = order;
      this.getLotStocks();
    }
  }
};
</script>

<style lang="less" scoped>
.tabs-ulwarp {
  padding-top: 10px;
  border-bottom: solid 1px #ddd;
}

.tabs {
  list-style: none;
  display: flex;

  li {
    margin: 0;
    margin-right: 4px;
    height: 30px;
    line-height: 30px;
    padding: 0px 16px;
    border: 1px solid #ddd;
    border-bottom: 0;
    border-radius: 2px 2px 0 0;
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
    background: #f8f8f8;
    cursor: pointer;
  }

  li.tab-active {
    height: 30px;
    background: #fff;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    border-color: #ddd;
    color: #fd5c5c;
  }
}

.page-warp {
  padding-right: 20px;
}

.look-nav {
  text-align: left;
  height: 40px;
  margin-top: 20px;
}

.mt20 {
  margin-top: 20px;
}

.look {
  width: 100px;
  height: 100px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%);
}

.fw {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  p {
    padding: 0 20px;
    span {
      padding: 0 10px;
    }
  }
}
</style>

<style>
  .table-highlight-row >>> td {
    height: 40px !important;
  }
  .tabs-warp .oper-top{
    padding: 0 10px 10px!important;
  }
  .table-highlight-row .ivu-table-overflowX{
    z-index: 2;
    position: relative;
  }

  .wlf-center-hs > div{
    padding-top: 10px;
  }

  .ivu-table-filter-list-item{
    max-height: 200px;
    overflow-y: auto;
  }
  .tabs-warp{
    /*height:calc(100% - 41px);*/
  }
</style>
