<template>
  <div class="content-oper" style="height:50vh;">
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
      <div class="tabs-warp" v-if="tabIndex == 0" >
        <!--      搜索工具栏-->
        <div class="oper-top flex" >
          <div class="wlf" style="line-height: 54px">
            <Input
              v-model="searchForm.partName"
              placeholder="配件编码/名称/内码/OEM码"
              class="w200 mr10"
              @on-enter="serch"
            />
            <!-- <Select
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
            </Select> -->
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
        <Table
          class="table-highlight-row"
          highlight-row
          ref="table1"
          border
          align="left"
          :stripe="true"
          height="400"
          resizable
          :columns="columns1"
          :data="contentOne.dataOne"
          show-summary
          :summary-method="handleSummary"
        ></Table>
      </div>
      <!--      批次库存表-->
      <div class="tabs-warp" v-else-if="tabIndex == 1">
        <!--      搜索工具栏-->
        <div class="oper-top flex">
          <div class="wlf" style="line-height: 54px">
            <!--<Input v-model="searchForm1.partCode" placeholder="配件编码" class="w200 mr10"></Input>-->
            <Input
              v-model="searchForm1.partName"
              placeholder="配件编码/名称/内码/OEM码"
              class="w200 mr10"
              @on-enter="queryBatch"
            ></Input>
            <!-- <Select
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
            </Select> -->
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
        <Table
          class="table-highlight-row"
          highlight-row
          size="small"
          ref="table2"
          align="left"
          border
          :stripe="true"
          :columns="columns2"
          :data="contentTwo.dataTwo"
          height="400"
          show-summary
          :summary-method="handleSummary"
        ></Table>
      </div>
      <!-- hs -->
      <div class="tabs-warp" v-else>
        <div class="oper-top flex">
          <div class="wlf wlf-center">
            <div class="db mr10">
              <span>公司编号：</span>
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
        <Table
          size="small"
          height="389"
          ref="hsOrder"
          :loading="hsloading"
          resizable
          border
          :stripe="true"
          :columns="columnsPart"
          :data="templateData"
        ></Table>
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
  EtabulatData
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
      shopId: JSON.parse(sessionStorage.getItem("vuex")).user.userData.currentCompany.id,
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
        noStock: "", //零库存
        old: "" //仓库
      },
      //批次库存查询条件表单
      searchForm1: {
        partBrand: "", //品牌id
        partCode: "", //配件编码
        storeIds: [], //仓库id
        partName: "", //配件名称
        shelf: "", //仓位
        noStock: "", //库存
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
          width: 50,
          type: "index",
          tooltip: true
        },
        {
          title: "配件ID",
          key: "partID",
          minWidth: 150,
          tooltip: true
        },
        {
          title: "配件编码",
          key: "partCode",
          minWidth: 150,
          tooltip: true
        },
        {
          title: "配件名称",
          key: "partName",
          minWidth: 120,
          tooltip: true
        },
        {
          title: "品牌名称",
          key: "brandName",
          minWidth: 120,
          tooltip: true
        },
        {
          title: "入库数量",
          key: "amount",
          minWidth: 120,
          tooltip: true
        },
        {
          title: "可出库数",
          key: "outAmount",
          minWidth: 120,
          tooltip: true
        },
        {
          title: "门店名称",
          key: "shortname",
          minWidth: 120,
          tooltip: true
        },
        {
          title: "单位",
          key: "unit",
          minWidth: 120,
          tooltip: true
        },
        {
          title: "入库日期",
          key: "deliveryDue",
          minWidth: 60,
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
      }
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
    this.getTemplateList();
    this.getHsStoreFun();
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
      let arr = [
        {
          title: "序号",
          type: "index",
          key: "index",
          minWidth: 60,
          render: (h, params) => {
            return h(
              "span",
              params._index +
                (this.contentOne.page.num - 1) * this.contentOne.page.size +
                1
            );
          },
          tooltip: true
        },
        {
          title: "操作",
          minWidth: 60,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.showList(params.row);
                    }
                  }
                },
                "查看"
              )
            ]);
          },
          tooltip: true
        },
        {
          title: "配件编码",
          key: "partCode",
          minWidth: 130,
          tooltip: true
        },
        {
          title: "配件名称",
          key: "partName",
          minWidth: 130,
          tooltip: true
        },
        {
          title: "OE码",
          key: "oemCode",
          minWidth: 130,
          tooltip: true
        },
        {
          title: "品牌",
          key: "partBrand",
          minWidth: 90,
          filters: this.bands1,
          filterMethod(value, row) {
            if(!value){
              return !row.partBrand
            }
            if(row.partBrand){
              return row.partBrand.indexOf(value) > -1;
            }else{
              return false
            }
          },
          tooltip: true
        },
        {
          title: "品牌车型",
          key: "carModelName",
          minWidth: 130,
          tooltip: true
        },
        {
          title: "单位",
          key: "unit",
          minWidth: 50,
          tooltip: true
        },
        {
          title: "库存数量",
          key: "stockQty",
          minWidth: 90,
          tooltip: true
        },
        {
          title: "可售数量",
          key: "outableQty",
          minWidth: 80,
          render: (h, params) => {
            let tex = params.row.sellSign ? 0 : params.row.outableQty;
            return h("span", {}, tex);
          },
          tooltip: true
        },
        {
          title: "仓库",
          key: "storeName",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "仓位",
          key: "shelf",
          minWidth: 120,
          tooltip: true
        },
        {
          title: "库存单价",
          key: "costPrice",
          minWidth: 100,
          render: (h, params) => {
            let tex = params.row.costPrice.toFixed(2);
            return h("span", {}, tex);
          },
          tooltip: true
        },
        {
          title: "库存金额",
          key: "stockAmt",
          minWidth: 100,
          render: (h, params) => {
            let tex = params.row.stockAmt.toFixed(2);
            return h("span", {}, tex);
          },
          tooltip: true
        },
        {
          title: "规格",
          key: "spec",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "配件内码",
          key: "partInnerId",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "最近入库日期",
          key: "lastEnterDate",
          minWidth: 130,
          tooltip: true
        },
        {
          title: "最近出库日期",
          key: "lastOutDate",
          minWidth: 130,
          tooltip: true
        },
        {
          title: "库存上限",
          key: "upLimit",
          minWidth: 80,
          tooltip: true
        },
        {
          title: "库存下限",
          key: "downLimit",
          tooltip: true,
          minWidth: 80
        },
        {
          title: "采购在途库存",
          key: "pchRoadQty",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "调拨在途库存",
          key: "attotRoadQty",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "合计在途库存",
          key: "onRoadQty",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "机构名称",
          key: "orgName",
          minWidth: 150,
          tooltip: true
        }
      ];
      let arr2 = [
        {
          title: "序号",
          key: "index",
          minWidth: 60,
          tooltip: true
        },
        {
          title: "配件编码",
          minWidth: 130,
          key: "partCode",
          tooltip: true
        },
        {
          title: "配件名称",
          key: "partName",
          minWidth: 130,
          tooltip: true
        },
        {
          title: "OE码",
          key: "oemCode",
          minWidth: 130,
          tooltip: true
        },
        {
          title: "品牌",
          key: "partBrand",
          minWidth: 100,
          filters: [],
          filterMethod(value, row) {
            if(!value){
              return !row.partBrand
            }
            if(row.partBrand){
              return row.partBrand.indexOf(value) > -1;
            }else{
              return false
            }
          },
          tooltip: true
        },
        {
          title: "品牌车型",
          key: "carModelName",
          minWidth: 130,
          tooltip: true
        },
        {
          title: "单位",
          key: "enterUnitId",
          minWidth: 50,
          tooltip: true
        },
        {
          title: "规格",
          key: "spec",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "配件内码",
          key: "partInnerId",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "入库数量",
          key: "enterQty",
          minWidth: 90,
          tooltip: true
        },
        {
          title: "可售数量",
          key: "outableQty",
          minWidth: 80,
          tooltip: true
        },
        {
          title: "仓库",
          key: "storeName",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "库存单价",
          key: "enterPrice",
          minWidth: 100,
          render: (h, params) => {
            let tex = params.row.enterPrice.toFixed(2);
            return h("span", {}, tex);
          },
          tooltip: true
        },
        {
          title: "库存金额",
          key: "enterAmt",
          minWidth: 100,
          render: (h, params) => {
            let tex = params.row.enterAmt.toFixed(2);
            return h("span", {}, tex);
          },
          tooltip: true
        },
        {
          title: "税率",
          key: "taxRate",
          minWidth: 60,
          tooltip: true
        },
        {
          title: "含税单价",
          key: "taxPrice",
          minWidth: 100,
          render: (h, params) => {
            let tex = params.row.taxPrice || 0;
            tex = tex.toFixed(2);
            return h("span", {}, tex);
          },
          tooltip: true
        },
        {
          title: "含税金额",
          key: "taxAmt",
          minWidth: 100,
          render: (h, params) => {
            let tex = params.row.taxAmt || 0;
            tex = tex.toFixed(2);
            return h("span", {}, tex);
          },
          tooltip: true
        },
        {
          title: "不含税单价",
          key: "noTaxPrice",
          minWidth: 100,
          render: (h, params) => {
            let tex = params.row.noTaxPrice.toFixed(2);
            return h("span", {}, tex);
          },
          tooltip: true
        },
        {
          title: "不含税金额",
          key: "noTaxAmt",
          minWidth: 100,
          render: (h, params) => {
            let tex = params.row.noTaxAmt.toFixed(2);
            return h("span", {}, tex);
          },
          tooltip: true
        },
        {
          title: "连锁库龄",
          key: "chainStockAge",
          minWidth: 90,
          tooltip: true
        },
        {
          title: "本店库龄",
          key: "branchStockAge",
          minWidth: 90,
          tooltip: true
        },
        {
          title: "滞销",
          key: "isUnsalable",
          render: (h, params) => {
            let tex = params.row.isUnsalable == 0 ? "否" : "是";
            return h("span", {}, tex);
          },
          minWidth: 50,
          tooltip: true
        },
        {
          title: "入库日期",
          key: "createTime",
          minWidth: 120,
          tooltip: true
        },
        {
          title: "入库单号",
          key: "serviceId",
          minWidth: 124,
          tooltip: true
        },
        {
          title: "第一供应商",
          key: "originGuestName",
          minWidth: 150,
          tooltip: true
        },
        {
          title: "最近供应商",
          key: "guestName",
          minWidth: 150,
          tooltip: true
        },
        {
          title: "机构名称",
          key: "orgName",
          minWidth: 150,
          tooltip: true
        }
      ];
      console.log(this.selectShopList,this.shopkeeper,this.shopId,this.searchForm.old)
      if(this.selectShopList){
        this.columns2 = [...arr2.slice(0, 24), ...arr2.slice(25)];
        if (this.shopkeeper != 1 && this.shopId != this.searchForm.old) {
          this.columns1 = [arr[0], ...arr.slice(2, 8), ...arr.slice(9)];

          // this.columns1 = [arr[0], ...arr.slice(2, 8), ...arr.slice(9, 11), ...arr.slice(14)];
          // this.columns2 = [...arr.slice(0, 12), ...arr.slice(19)];
        } else {
          this.columns1 = arr;
        }
      }else{
        this.columns1 = arr;
        this.columns2 = arr2;
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
    //获取风电
    async getCommpany() {
      let arr = await creat([], this.$store);
      this.Branchstore = [{ value: "", label: "全连锁" }, ...arr[2]] || [
        { value: "", label: "全连锁" }
      ];
      this.searchForm.old = arr[1] || "";
      this.searchForm1.old = arr[1] || "";
      this.getAllStocks(); //table请求
      this.getStoreHoure();
      // this.getBand(); //获取品牌
      this.getLotStocks(); //获取批次
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
      let res = await getAllStock(data);
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
      // console.log('数据',data)
      let res = await getLotStock(data);
      if (res.code == 0) {
        this.contentTwo.dataTwo = res.data.content;
        this.contentTwo.dataTwo.map((item, index) => {
          item.index = index + 1;
          item.outableQty = item.sellSign ? 0 : item.outableQty;
        });
        this.contentTwo.page.total = res.data.totalElements;
        this.bands2 = [];
        let arr = res.data.content.map(el => el.partBrand);
        let set = new Set(arr);
        set.forEach(el => {
          this.bands2.push({ label: el, value: el });
        });
        this.columns2[4].filters = this.bands2;
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
          el.name = el.name;
          el.id = el.id;
          this.storeList.push(el);
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
        if (newData.length >= 0) {
          this.$refs.table1.exportCsv({
            filename: "汇总库存",
            original: true,
            columns: this.columns1,
            data: newData
          });
        }else{
          this.$Message.error("这个公司暂时没有库存")
        }
      }
    },

    //汇总导出
    exportTheSummary() {
      this.getStockAll();
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
      this.getBatchStockAll();
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
        // console.log(rep);
        this.hsStore = rep.data || [];
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
      const sums = {};
      columns.forEach((column, index) => {
        const key = column.key;
        if (index === 0) {
          sums[key] = {
            key,
            value: "当前页和值"
          };
          return;
        }
        const values = data.map(item => Number(item[key]));
        if (!values.every(value => isNaN(value))) {
          const v = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          if (
            [
              "stockQty",
              "outableQty",
              "stockAmt",
              "pchRoadQty",
              "attotRoadQty",
              "onRoadQty",
              "enterAmt",
              "taxAmt",
            ].includes(key)
          ) {
            if (key == "stockAmt") {
              sums[key] = {
                key,
                value: v.toFixed(2)
              };
            } else {
              sums[key] = {
                key,
                value: v
              };
            }
          } else {
            sums[key] = {
              key,
              value: ""
            };
          }
        } else {
          sums[key] = {
            key,
            value: ""
          };
        }
      });
      // console.log(sums);
      return sums;
    }
  }
};
</script>

<style lang="less" scoped>
.tabs-ulwarp {
  padding-top: 17px;
  border-bottom: solid 1px #ddd;
}

.tabs {
  list-style: none;
  display: flex;

  li {
    margin: 0;
    margin-right: 4px;
    height: 31px;
    padding: 5px 16px 4px;
    border: 1px solid #ddd;
    border-bottom: 0;
    border-radius: 2px 2px 0 0;
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
    background: #f8f8f8;
    cursor: pointer;
  }

  li.tab-active {
    height: 32px;
    padding-bottom: 5px;
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
<style scoped>
  .table-highlight-row >>> td {
    height: 40px !important;
  }

</style>
