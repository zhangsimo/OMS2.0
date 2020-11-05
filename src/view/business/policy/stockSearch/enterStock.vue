<template>
  <vxe-modal className="vxe-modal-table" v-model="modal1" title="库存查询" id="myModal1" width="1000" height="450" min-width="900" min-height="320" resize remember transfer mask-closable  @show="hander">
    <template v-solt>
      <section class="oper-box">
        <!--      主菜单导航-->
        <div class="db pl10 tabs-ulwarp">
          <ul class="tabs">
            <li
              v-if="!curronly"
              class="center lis"
              :class="{ 'tab-active': tIndex == 4 }"
              @click="setTab(4)"
            >
              级别销价
            </li>
            <li
              v-if="!curronly"
              class="center lis"
              :class="{ 'tab-active': tIndex == 6 }"
              @click="setTab(6)"
            >
              本店库存
            </li>
            <li
              v-if="!curronly"
              class="center lis"
              :class="{ 'tab-active': tIndex == 5 }"
              @click="setTab(5)"
            >
              滞销信息
            </li>
            <li
              v-if="!curronly"
              class="center lis"
              :class="{ 'tab-active': tIndex == 1 }"
              @click="setTab(1)"
            >
              入库明细
            </li>
            <li
              class="center lis"
              :class="{ 'tab-active': tIndex == 2 }"
              @click="setTab(2)"
            >
              出库明细
            </li>
            <li
              class="center lis"
              :class="{ 'tab-active': tIndex == 3 }"
              @click="setTab(3)"
            >
              订单占用
            </li>
          </ul>
        </div>
        <!--本店库存-->
        <div class="tabs-warp tabs-warp2 mt10" v-show="tIndex == 6">
          <vxe-table
            border
            stripe
            ref="hsOrder"
            height="auto"
            highlight-hover-row
            show-overflow="title"
            resizable
            auto-resize
            align="left"
            show-footer
            :footer-method="handleSummary4"
            :loading="outLoading"
            size="mini"
            :data="selfShopStock">
            <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
            <vxe-table-column field="partCode" title="配件编码" width="110"></vxe-table-column>
            <vxe-table-column field="partName" title="配件名称" width="110"></vxe-table-column>
            <vxe-table-column field="partBrand" title="品牌" width="80"></vxe-table-column>
            <vxe-table-column field="storeName" title="仓库" width="120"></vxe-table-column>
            <vxe-table-column field="enterQty" title="入库数量" width="90"></vxe-table-column>
            <vxe-table-column field="outableQty" title="可出库数量" width="90"></vxe-table-column>
            <vxe-table-column field="enterPrice" title="入库单价" width="120">
              <template v-slot="{row}">
                {{(row.enterPrice||0).toFixed(2)}}
              </template>
            </vxe-table-column>
            <vxe-table-column field="taxRate" title="税率" width="70">
            </vxe-table-column>
            <vxe-table-column field="taxPrice" title="含税单价" width="70">
              <template v-slot="{row}">
                {{(row.taxPrice||0).toFixed(2)}}
              </template>
            </vxe-table-column>
            <vxe-table-column field="noTaxPrice" title="不含税单价" width="90">
              <template v-slot="{row}">
                {{(row.noTaxPrice||0).toFixed(2)}}
              </template>
            </vxe-table-column>
            <vxe-table-column field="guestName" title="供应商" width="120">
            </vxe-table-column>
            <vxe-table-column field="createTime" title="入库日期" width="120">
            </vxe-table-column>
            <vxe-table-column field="branchStockAge" title="本店库龄" width="80">
            </vxe-table-column>
            <vxe-table-column field="chainStockAge" title="连锁库龄" width="80">
            </vxe-table-column>
          </vxe-table>
        </div>
        <!--      入库明细-->
        <div class="tabs-warp tabs-warp3" v-show="tIndex == 1">
          <!--      搜索工具栏-->
          <div class="oper-top flex">
            <div class="wlf">
              <div class="db mr10" style="padding-top: 10px">
                <span>快速查询：</span>
                <quick-date
                  class="mr10"
                  ref="quickDate1"
                  @quickDate="getDataQuick1"
                ></quick-date>
              </div>
              <div class="db pt10" style="padding-top: 10px">
                <span>入库日期：</span>
                <DatePicker
                  @on-change="selectDate"
                  type="daterange"
                  v-model="oneTime"
                  placement="bottom-start"
                  placeholder="选择日期"
                  class="w200 mr20"
                >
                </DatePicker>
              </div>
              <div class="db pt10" style="padding-top: 10px">
                <span>供应商: </span>
                <Input
                  v-model="searchForm2.guestName"
                  class="w200 mr10"
                ></Input>
              </div>
              <div class="db pt10" style="padding-top: 10px">
                <Button type="warning" class="mr10 w90" @click="search">
                  <Icon type="ios-search" size="14"/>
                  查询
                </Button>
              </div>
            </div>
          </div>
          <!--      表-->
          <div class="table-wrap-auto-height2">
            <vxe-table
              border
              stripe
              ref="hsOrder"
              height="auto"
              highlight-hover-row
              show-overflow="title"
              resizable
              auto-resize
              align="left"
              :loading="enterLoading"
              size="mini"
              :data="contentOne.dataOne"
              show-footer
              :footer-method="handleSummary">
              <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
              <vxe-table-column field="partCode" title="配件编码" width="110"></vxe-table-column>
              <vxe-table-column field="partName" title="配件名称" width="110"></vxe-table-column>
              <vxe-table-column field="enterUnitId" title="单位" width="50"></vxe-table-column>
              <vxe-table-column field="partBrand" title="品牌" width="80"></vxe-table-column>
              <vxe-table-column field="carModelName" title="品牌车型" width="90"></vxe-table-column>
              <vxe-table-column field="storeName" title="仓库" width="70"></vxe-table-column>
              <vxe-table-column field="guestName" title="供应商" width="120"></vxe-table-column>
              <vxe-table-column field="createTime" title="入库日期" width="120">
              </vxe-table-column>
              <vxe-table-column field="enterMan" title="入库人" width="70">
              </vxe-table-column>
              <vxe-table-column field="enterQty" title="入库数量" width="70">
              </vxe-table-column>
              <vxe-table-column field="enterPrice" title="入库单价" width="70">
                <template v-slot="{row}">
                  {{(row.enterPrice||0).toFixed(2)}}
                </template>
              </vxe-table-column>
              <vxe-table-column field="enterAmt" title="金额" width="80">
                <template v-slot="{row}">
                  {{(row.enterAmt||0).toFixed(2)}}
                </template>
              </vxe-table-column>
              <vxe-table-column field="taxRate" title="税率" width="50">
              </vxe-table-column>
              <vxe-table-column field="noTaxPrice" title="不含税单价" width="80">
                <template v-slot="{row}">
                  {{(row.noTaxPrice||0).toFixed(2)}}
                </template>
              </vxe-table-column>
              <vxe-table-column field="noTaxAmt" title="不含税金额" width="80">
                <template v-slot="{row}">
                  {{(row.noTaxAmt||0).toFixed(2)}}
                </template>
              </vxe-table-column>
              <vxe-table-column field="code" title="入库单号" width="160">
              </vxe-table-column>
              <vxe-table-column field="createUname" title="创建人" width="70">
              </vxe-table-column>
              <vxe-table-column field="enterTypeId" title="入库类型" width="70">
              </vxe-table-column>
              <vxe-table-column field="remark" title="备注" width="140">
              </vxe-table-column>
            </vxe-table>
          </div>
        </div>
        <!--      出库明细-->
        <div class="tabs-warp tabs-warp3" v-show="tIndex == 2">
          <!--      搜索工具栏-->
          <div class="oper-top flex">
            <div class="wlf">
              <div class="db mr10" style="padding-top: 10px">
                <span>快速查询：</span>
                <quick-date
                  class="mr10"
                  ref="quickDate2"
                  @quickDate="getDataQuick2"
                ></quick-date>
              </div>
              <div class="db" style="padding-top: 10px">
                <span>出库日期：</span>
                <DatePicker
                  v-model="twoTime"
                  @on-change="selectDate"
                  type="daterange"
                  placement="bottom-start"
                  placeholder="选择日期"
                  class="w200 mr20"
                >
                </DatePicker>
              </div>
              <div class="db" style="padding-top: 10px">
                <span>客户: </span>
                <Input
                  v-model="searchForm3.guestName"
                  class="w200 mr10"
                ></Input>
              </div>
              <div class="db" style="padding-top: 10px">
                <Button type="warning" class="mr10 w90" @click="search">
                  <Icon type="ios-search" size="14"/>
                  查询
                </Button>
              </div>
            </div>
          </div>
          <!--      表-->
          <div class="table-wrap-auto-height2">
            <vxe-table
              border
              stripe
              ref="hsOrder"
              height="auto"
              highlight-hover-row
              show-overflow="title"
              resizable
              auto-resize
              align="left"
              :loading="outLoading"
              size="mini"
              :data="contentTwo.dataTwo"
              show-footer
              :footer-method="handleSummary">
              <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
              <vxe-table-column field="partCode" title="配件编码" width="110"></vxe-table-column>
              <vxe-table-column field="partName" title="配件名称" width="110"></vxe-table-column>
              <vxe-table-column field="systemUnitId" title="单位" width="50"></vxe-table-column>
              <vxe-table-column field="partBrand" title="品牌" width="80"></vxe-table-column>
              <vxe-table-column field="carModelName" title="品牌车型" width="90"></vxe-table-column>
              <vxe-table-column field="storeName" title="仓库" width="70"></vxe-table-column>
              <vxe-table-column field="guestName" title="客户" width="120"></vxe-table-column>
              <vxe-table-column field="outDate" title="出库日期" width="120">
              </vxe-table-column>
              <vxe-table-column field="outMan" title="出库人" width="70">
              </vxe-table-column>
              <vxe-table-column field="sellQty" title="出库数量" width="70">
              </vxe-table-column>
              <vxe-table-column field="sellPrice" title="出库单价" width="70">
                <template v-slot="{row}">
                  {{(row.sellPrice||0).toFixed(2)}}
                </template>
              </vxe-table-column>
              <vxe-table-column field="sellAmt" title="出库金额" min-width="100">
                <template v-slot="{row}">
                  {{(row.sellAmt||0).toFixed(2)}}
                </template>
              </vxe-table-column>
              <vxe-table-column field="taxRate" title="含税标记" width="70">
                <template v-slot="{row}">
                  <vxe-checkbox :disabled="true" v-model="row.taxSign == 0 ? false : true" size="small"></vxe-checkbox>
                </template>
              </vxe-table-column>
              <vxe-table-column field="taxRate" title="税率" width="50">
              </vxe-table-column>
              <vxe-table-column field="taxPrice" title="含税单价" width="70">
                <template v-slot="{row}">
                  {{(row.taxPrice||0).toFixed(2)}}
                </template>
              </vxe-table-column>
              <vxe-table-column field="taxAmt" title="含税金额" width="80">
                <template v-slot="{row}">
                  {{(row.taxAmt||0).toFixed(2)}}
                </template>
              </vxe-table-column>
              <vxe-table-column field="noTaxPrice" title="不含税单价" width="80">
                <template v-slot="{row}">
                  {{(row.noTaxPrice||0).toFixed(2)}}
                </template>
              </vxe-table-column>
              <vxe-table-column field="noTaxAmt" title="不含税金额" width="80">
                <template v-slot="{row}">
                  {{(row.noTaxAmt||0).toFixed(2)}}
                </template>
              </vxe-table-column>
              <vxe-table-column field="serviceId" title="出库单号" width="160">
              </vxe-table-column>
              <vxe-table-column field="createUname" title="创建人" width="70">
              </vxe-table-column>
              <vxe-table-column field="enterTypeId" title="出库类型" width="70">
              </vxe-table-column>
              <vxe-table-column field="remark" title="备注" width="140">
              </vxe-table-column>
            </vxe-table>
          </div>
        </div>
        <!--      占用订单-->
        <div class="tabs-warp tabs-warp2 mt10" v-show="tIndex == 3">
          <!--      表-->
          <vxe-table
            border
            stripe
            height="auto"
            highlight-hover-row
            show-overflow="title"
            resizable
            auto-resize
            align="left"
            size="mini"
            show-footer
            :footer-method="handleSummary4"
            :data="contentThree.dataThree">
            <vxe-table-column type="seq" width="60" title="序号" ></vxe-table-column>
            <vxe-table-column field="serviceId" title="业务单号" min-width="180"></vxe-table-column>
            <vxe-table-column field="guestName" title="客户" min-width="150"></vxe-table-column>
            <vxe-table-column field="partCode" title="配件编码" min-width="120"></vxe-table-column>
            <vxe-table-column field="partName" title="配件名称" min-width="120"></vxe-table-column>
            <vxe-table-column field="orderQty" title="订单数量" min-width="80"></vxe-table-column>
            <vxe-table-column field="lockStockQty" title="占用数量" min-width="80"></vxe-table-column>
            <vxe-table-column field="storeName" title="仓库" min-width="80"></vxe-table-column>
            <vxe-table-column field="createUname" title="创建人" min-width="70"></vxe-table-column>
            <vxe-table-column field="createDate" title="创建日期" min-width="80"></vxe-table-column>
            <vxe-table-column field="remark" title="备注" min-width="120"></vxe-table-column>
          </vxe-table>
        </div>
        <!--      级别销价-->
        <div class="tabs-warp" v-show="tIndex == 4">
          <p style="line-height: 30px">
            本店可售库存: <span class="ml5">{{mainData.outableQty}}</span>
          </p>
          <!--      表-->
          <div class="table-wrap-auto-height">
            <vxe-table
              border
              stripe
              height="auto"
              highlight-hover-row
              show-overflow="title"
              resizable
              auto-resize
              align="left"
              :loading="levelLoading"
              size="mini"
              :data="levelList">
              <vxe-table-column field="partCode" title="配件编码" ></vxe-table-column>
              <vxe-table-column field="partName" title="配件名称" ></vxe-table-column>
              <vxe-table-column field="partBrand" title="品牌" ></vxe-table-column>
              <vxe-table-column field="strategyName" title="级别"></vxe-table-column>
              <vxe-table-column field="sellPrice" title="销售价" >
                <template v-slot="{row}">
                  {{row.strategyName=='最低售价'?`${row.sellPrice} - ${row.minRequiredQty}`:row.sellPrice}}
                </template>
              </vxe-table-column>
              <vxe-table-column field="updateUname" title="更新人"></vxe-table-column>
              <vxe-table-column field="updateTime" title="更新日期"></vxe-table-column>
            </vxe-table>
          </div>
        </div>
        <!--      滞销信息-->
        <div class="tabs-warp" v-show="tIndex == 5">
          <p style="line-height: 30px">
            连锁库龄: <span class="ml5">{{branchAge}}</span>天
          </p>
          <!--      表-->
          <div class="table-wrap-auto-height">
            <vxe-table
              border
              stripe
              height="auto"
              highlight-hover-row
              show-overflow="title"
              resizable
              auto-resize
              align="left"
              size="mini"
              show-footer
              :footer-method="handleSummary4"
              :data="unsalableList">
              <vxe-table-column field="partCode" title="配件编码" ></vxe-table-column>
              <vxe-table-column field="partName" title="配件名称" ></vxe-table-column>
              <vxe-table-column field="partBrand" title="品牌" ></vxe-table-column>
              <vxe-table-column field="orgName" title="分店名称"></vxe-table-column>
              <vxe-table-column field="enterQty" title="滞销数量" ></vxe-table-column>
            </vxe-table>
          </div>

        </div>
        <!--      分页-->
        <div class="page-warp clearfix" v-show="tIndex == 1||tIndex == 2||tIndex == 3||tIndex == 6">
          <div class="pt5">
            <vxe-pager
              background
              size="mini"
              v-show="tIndex == 1"
              :current-page.sync="contentOne.page.num"
              :page-size.sync="contentOne.page.size"
              :total="contentOne.page.total"
              :page-sizes="[10,20,30,40,50]"
              @page-change="changePageCus"
              :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']">
            </vxe-pager>
            <vxe-pager
              background
              size="mini"
              v-show="tIndex == 2"
              :current-page.sync="contentTwo.page.num"
              :page-size.sync="contentTwo.page.size"
              :total="contentTwo.page.total"
              :page-sizes="[10,20,30,40,50]"
              @page-change="changePageCus"
              :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']">
            </vxe-pager>
            <vxe-pager
              background
              size="mini"
              v-show="tIndex == 3"
              :current-page.sync="contentThree.page.num"
              :page-size.sync="contentThree.page.size"
              :total="contentThree.page.total"
              :page-sizes="[10,20,30,40,50]"
              @page-change="changePageCus"
              :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']">
            </vxe-pager>
            <vxe-pager
              background
              size="mini"
              v-show="tIndex == 6"
              :current-page.sync="selfShopStockPage.num"
              :page-size.sync="selfShopStockPage.size"
              :total="selfShopStockPage.total"
              :page-sizes="[10,20,30,40,50]"
              @page-change="changePageCus"
              :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']">
            </vxe-pager>
          </div>
        </div>
        <!--      点击查看显示-->
      </section>
    </template>
  </vxe-modal>
</template>

<script>
  import {
    getEnter,
    getOut,
    getOccupy,
    OtotalData,
    EtotalData,
    getLevel,
    getUnsalable,
    getLotStock
  } from "@/api/business/stockSearch";
  import QuickDate from "_c/getDate/dateget_bill1.vue";
  import {ThisYearStr} from "_c/getDate/index_bill.js"

  export default {
    name: "enterStock",
    props: {mainData: ""},
    components: {QuickDate},
    data() {
      return {
        oneTime: "", //出库时间
        twoTime: "", //出库时间
        //客户查询
        guestName: "",
        //主表id
        curronly: false,
        // 加载图标
        loading: false,
        // modal显示
        modal1: false,
        // 切换菜单值
        tIndex: 4,
        // 存放点击选中的数据
        selectTableData: "",
        //本店库存数据
        selfShopStock:[],
        selfShopStockPage:{
          num:1,
          total:0,
          size:10
        },
        levelLoading:false,
        // 入库明细数据
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
        //出库明细数据
        contentTwo: {
          //分页
          page: {
            num: 1,
            total: 0,
            size: 10
          },
          //数据
          dataTwo: [
            {
              aaa: "批次库存",
              bbb: 5
            }
          ]
        },
        //订单占用数据
        contentThree: {
          //分页
          page: {
            num: 1,
            total: 0,
            size: 20
          },
          //数据
          dataThree: [
            {
              aaa: "批次库存",
              bbb: 5
            }
          ]
        },
        //级别销价
        levelList: [],
        //滞销信息
        unsalableList: [],
        //库龄
        branchAge: 0,
        //入库查询
        searchForm2: {},
        //出库查询
        searchForm3: {},

        total1: {},
        total2: {},
        enterLoading:false,
        outLoading:false
      };
    },
    methods: {
      //表格选中数据
      selectTable(v) {
        this.selectTableData = v;
        // console.log(this.selectTableData)
      },
      getDataQuick1(v) {
        this.searchForm2.startEnterDate = v[0];
        this.searchForm2.endEnterDate = v[1];
        this.getList();
      },
      getDataQuick2(v) {
        this.searchForm3.startEnterDate = v[0];
        this.searchForm3.endEnterDate = v[1];
        this.getOuts();
      },
      // 入库明细请求
      async getEnters() {
        this.oneTime = "";
        this.twoTime = "";
        this.searchForm2.startEnterDate = ThisYearStr()[0];
        this.searchForm2.endEnterDate = ThisYearStr()[1];
        this.searchForm2.guestName = "";
        this.modal1 = true;
        this.tIndex = 4;
        this.levelList =[];
        setTimeout(()=>{
          this.getLevelList();
        },0)

      },
      hander({type}) {
        // this.modal1 = true
        if (type) {
          this.searchForm3.startEnterDate=ThisYearStr()[0]
          this.searchForm3.endEnterDate=ThisYearStr()[1]
          this.searchForm3.guestName="";
          if (this.$refs.quickDate1) {
            this.$refs.quickDate1.searchQuick = "7";
          }
          if (this.$refs.quickDate2) {
            this.$refs.quickDate2.searchQuick = "7";
          }
          // this.getEnters();
        }
      },

      //级别销价请求
      async getLevelList() {
        let data = {}
        this.levelLoading=true;
        data.partId = this.mainData.partId
        let res = await getUnsalable(data)
        if (res.code === 0) {
          this.levelLoading=false;
          this.levelList = res.data
        }else{
          this.levelLoading=false;
        }
      },

      //滞销信息请求
      async getUnsalableList() {
        let data = {}
        data.partId = this.mainData.partId
        let res = await getLevel(data)
        if (res.code === 0) {
          this.unsalableList = res.data
          if (res.data.length > 0) {
            this.branchAge = res.data[0].branchStockAge ? res.data[0].branchStockAge : 0
          } else {

          }
        }
      },

      //入库明细请求
      async getList() {
        let data = {};
        data = this.searchForm2;
        data.partId = this.mainData.partId;
        data.orgid = this.mainData.orgid;
        data.page = this.contentOne.page.num - 1;
        data.size = this.contentOne.page.size;
        data.guestName = typeof data.guestName === "string" ? data.guestName.trim() : "";
        this.contentOne.dataOne = [];
        this.enterLoading = true;
        let res = await getEnter(data);
        this.enterLoading = false;
        if (res.code == 0) {
          this.contentOne.dataOne = res.data.content;
          this.contentOne.page.total = res.data.totalElements;
        }
        let res1 = await EtotalData(data);
        if (res1.code == 0) {
          this.total1 = res1.data;
          // console.log(res1);
        }
      },
      // 出库明细请求
      async getOuts() {
        let data = {};
        data = this.searchForm3;
        data.partId = this.mainData.partId;
        data.orgid = this.mainData.orgid;
        data.page = this.contentTwo.page.num - 1;
        data.size = this.contentTwo.page.size;
        data.guestName = typeof data.guestName === "string" ? data.guestName.trim() : "";
        this.contentTwo.dataTwo = [];
        this.outLoading = true;
        let res = await getOut(data);
        this.outLoading = false;
        if (res.code == 0) {
          this.contentTwo.dataTwo = res.data.content;
          this.contentTwo.page.total = res.data.totalElements;
        }
        let res1 = await OtotalData(data);
        if (res1.code == 0) {
          this.total2 = res1.data;
          // console.log(res1);
        }
      },
      // 占用订单 getOccupy
      async getHold() {
        let data = {};
        data.partId = this.mainData.partId;
        data.orgid = this.mainData.orgid;
        data.page = this.contentThree.page.num - 1;
        data.size = this.contentThree.page.size;
        let res = await getOccupy(data);
        if (res.code == 0) {
          this.contentThree.dataThree = res.data.content;
          this.contentThree.page.total = res.data.totalElements;
        }
      },
      // tab切换
      setTab(index) {
        this.contentOne.page.num = 1;
        this.contentTwo.page.num = 1;
        this.selfShopStockPage.num=1;
        this.contentThree.page.num = 1;
        this.tIndex = index;
        if (this.tIndex == 2) {
          //这里是因为tab切换时quickDate的searchQuick没有清空转回到7
          if (this.$refs.quickDate1) {
            this.$refs.quickDate1.searchQuick = "7";
          }
          this.getOuts();
        }
        if (this.tIndex == 1) {
          //这里是因为tab切换时quickDate的searchQuick没有清空转回到7
          if (this.$refs.quickDate2) {
            this.$refs.quickDate2.searchQuick = "7";
          }
          this.getList();
        }
        if (this.tIndex == 3) {
          this.getHold();
        }
        if (this.tIndex == 4) {
          this.getLevelList();
        }
        if (this.tIndex == 5) {
          this.getUnsalableList();
        }
        if (this.tIndex == 6) {
          this.getLotList();
        }
      },
      // // 修改每页显示条数-客户信息
      changeSizeCus(size) {
        if (this.tIndex == 1) {
          this.contentOne.page.size = size;
          this.contentOne.page.page = 1;
          this.getList();
        } else if (this.tIndex == 2) {
          this.contentTwo.page.size = size;
          this.contentTwo.page.page = 1;

          this.getOuts();
        }  else if (this.tIndex == 6){
          this.selfShopStockPage.size = size;
          this.selfShopStockPage.num=1;
          this.getLotList()
        } else {
          this.contentThree.page.page = 1;
          this.contentThree.page.size = size;
          this.getHold();
        }
      },
      // // 页数变动事件
      changePageCus({currentPage, pageSize}) {
        if (this.tIndex == 1) {
          this.contentOne.page.num = currentPage;
          this.contentOne.page.size = pageSize;
          this.getList();
        } else if (this.tIndex == 2) {
          this.contentTwo.page.size = pageSize;
          this.contentTwo.page.num = currentPage;
          this.getOuts();
        } else if (this.tIndex == 6){
          this.selfShopStockPage.num=currentPage;
          this.selfShopStockPage.size = pageSize;
          this.getLotList()
        } else {
          this.contentThree.page.num = currentPage;
          this.contentThree.page.size = pageSize;
          this.getHold();
        }
      },

      async getLotList(){
        let data = {};
        data.partCode = this.mainData.partCode;
        data.old = this.mainData.orgid;
        data.noStock = 0;
        data.page = this.selfShopStockPage.num-1;
        data.size =this.selfShopStockPage.size;
        this.outLoading = true;
        this.selfShopStock = [];
        const rep = await getLotStock(data);
        this.outLoading = false;
        if(rep.code==0){
          this.selfShopStock = rep.data.content||[];
          this.selfShopStockPage.total=rep.data.totalElements;
        }
      },


      // 获取选择时间
      selectDate(date) {
        // 入库获取时间
        if (this.tIndex == 1) {
          if (date[0]) {
            this.searchForm2.startEnterDate = date[0] + " " + "00:00:00";
            this.searchForm2.endEnterDate = date[1] + " " + "23:59:59";
          } else {
            this.searchForm2.startEnterDate = "";
            this.searchForm2.endEnterDate = "";
          }
        }
        if (this.tIndex == 2) {
          if (date[0]) {
            this.searchForm3.startEnterDate = date[0] + " " + "00:00:00";
            this.searchForm3.endEnterDate = date[1] + " " + "23:59:59";
          } else {
            this.searchForm3.startEnterDate = "";
            this.searchForm3.endEnterDate = "";
          }
        }
      },
      // 查询
      search() {
        if (this.tIndex == 1) {
          this.getList();
        } else if (this.tIndex == 2) {
          this.getOuts();
        } else {
          this.getHold();
        }
      },
      handleSummary1({columns, data}) {
        const sums = {};
        columns.forEach((column, index) => {
          const key = column.key;
          if (index === 0) {
            sums[key] = {
              key,
              value: "查询结果合值"
            };
            return;
          }
          if (["enterQty", "enterAmt"].includes(key)) {
            if (key == "enterQty") {
              sums[key] = {
                key,
                value: this.total1.enterQty
              };
            } else {
              sums[key] = {
                key,
                value: this.total1.enterAmt
              };
            }
          } else {
            sums[key] = {
              key,
              value: ""
            };
          }
        });

        return sums;
      },
      handleSummary4({columns, data}) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return '合值'
            }
            if ([
              "orderQty",
              "lockStockQty",
              "outableQty",
              "enterQty"
            ].includes(column.property)) {
              const v = data.reduce((prev, curr) => {
                const value = Number(curr[column.property]);
                if (!isNaN(value)) {
                  return prev + curr[column.property];
                } else {
                  return prev;
                }
              }, 0);
              return v
            }
            return null
          })
        ]
      },

      handleSummary({ columns, data }) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return '合值'
            }
            if ([
              "sellQty",
              "sellAmt",
              "enterQty",
              "enterAmt"
            ].includes(column.property)) {
              const v = data.reduce((prev, curr) => {
                const value = Number(curr[column.property]);
                if (!isNaN(value)) {
                  return prev + curr[column.property];
                } else {
                  return prev;
                }
              }, 0);
              if(['sellAmt',"enterAmt"].includes(column.property)){
                return v.toFixed(2);
              }
              return v
            }
            return null
          })
        ]
      },


      handleSummary2({columns, data}) {
        const sums = {};
        columns.forEach((column, index) => {
          const key = column.key;
          if (index === 0) {
            sums[key] = {
              key,
              value: "查询结果合值"
            };
            return;
          }
          if (["sellQty", "sellAmt"].includes(key)) {
            if (key === "sellQty") {
              sums[key] = {
                key,
                value: this.total2.sellQty
              };
            } else {
              sums[key] = {
                key,
                value: this.total2.sellAmt
              };
            }
          } else {
            sums[key] = {
              key,
              value: ""
            };
          }
        });

        return sums;
      }
    }
  };
</script>

<style scoped xml:lang="less">
  .oper-box{
    height: 100%;
  }
  .tabs-warp{
    height: calc(100% - 33px);
  }
  .tabs-warp2{
    height: calc(100% - 90px);
  }
  .tabs-warp3{
    height: calc(100% - 80px);
  }
  .table-wrap-auto-height{
    height: calc(100% - 33px);
  }
  .table-wrap-auto-height2{
    height: calc(100% - 50px);
  }

  .tabs-ulwarp {
    border-bottom: solid 1px #ddd;
    height: 32px;
    overflow: hidden;
  }

  .tabs {
    list-style: none;
    display: flex;
  }


  .lis {
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

  .page-warp {
    padding-right: 20px;
  }

  .look-nav {
    text-align: center;
    height: 40px;
    margin-top: 20px;
  }

  .mt20 {
    margin-top: 20px;
  }

  .ivu-modal .ivu-modal-content .ivu-modal-close .ivu-icon-ios-close {
    color: #000c17;
  }
</style>
