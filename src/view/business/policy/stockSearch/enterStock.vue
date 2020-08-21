<template>
  <div class="content-oper">
    <Modal
      title="库存查询"
      closable
      v-model="modal1"
      @on-visible-change="hander"
      width="1100"
      :loading="loading"
    >
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
        <!--      入库明细-->
        <div class="tabs-warp" v-if="tIndex == 1">
          <!--      搜索工具栏-->
          <div class="oper-top flex mb20">
            <div class="wlf">
              <div class="db">
                <span>快速查询：</span>
                <quick-date
                  class="mr10"
                  ref="quickDate1"
                  v-on:quickDate="getDataQuick"
                ></quick-date>
              </div>
              <div class="db">
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
              <div class="db">
                <span>供应商: </span>
                <Input
                  v-model="searchForm2.guestName"
                  class="w200 mr10"
                ></Input>
              </div>
              <div class="db">
                <Button type="warning" class="mr10 w90" @click="search">
                  <Icon type="ios-search" size="14" />
                  查询
                </Button>
              </div>
            </div>
          </div>
          <!--      表-->
          <Table
            class="table-highlight-row"
            highlight-row
            size="small"
            @on-current-change="selectTable"
            border
            :stripe="true"
            :columns="enterInfo"
            :data="contentOne.dataOne"
            height="450"
            show-summary
            :summary-method="handleSummary1"
          ></Table>
        </div>
        <!--      出库明细-->
        <div class="tabs-warp" v-if="tIndex == 2">
          <!--      搜索工具栏-->
          <div class="oper-top flex mb20">
            <div class="wlf">
              <div class="db">
                <span>快速查询：</span>
                <quick-date
                  class="mr10"
                  ref="quickDate2"
                  v-on:quickDate="getDataQuick"
                ></quick-date>
              </div>
              <div class="db">
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
              <div class="db">
                <span>客户: </span>
                <Input
                  v-model="searchForm3.guestName"
                  class="w200 mr10"
                ></Input>
              </div>
              <div class="db">
                <Button type="warning" class="mr10 w90" @click="search">
                  <Icon type="ios-search" size="14" />
                  查询
                </Button>
              </div>
            </div>
          </div>
          <!--      表-->
          <Table
            class="table-highlight-row"
            highlight-row
            size="small"
            @on-current-change="selectTable"
            border
            :stripe="true"
            :columns="outInfo"
            :data="contentTwo.dataTwo"
            height="450"
            show-summary
            :summary-method="handleSummary2"
          ></Table>
        </div>
        <!--      占用订单-->
        <div class="tabs-warp p10" v-if="tIndex == 3">
          <!--      表-->
          <Table
            class="table-highlight-row"
            highlight-row
            size="small"
            @on-current-change="selectTable"
            border
            :stripe="true"
            :columns="occupy"
            :data="contentThree.dataThree"
            height="450"
          ></Table>
        </div>
        <!--      级别销价-->
        <div class="tabs-warp p10" v-if="tIndex == 4">
          <p style="line-height: 30px">
            本店可售库存: <span class="ml5">{{mainData.outableQty}}</span>
          </p>
          <!--      表-->
          <Table
            class="table-highlight-row"
            highlight-row
            size="small"
            @on-current-change="selectTable"
            border
            :stripe="true"
            :columns="levelType"
            :data="levelList"
            height="420"
          ></Table>
        </div>
        <!--      滞销信息-->
        <div class="tabs-warp p10" v-if="tIndex == 5">
          <p style="line-height: 30px">
            连锁库龄: <span class="ml5">{{branchAge}}</span>天
          </p>
          <!--      表-->
          <Table
            class="table-highlight-row"
            highlight-row
            size="small"
            @on-current-change="selectTable"
            border
            :stripe="true"
            :columns="unsalableType"
            :data="unsalableList"
            height="450"
          ></Table>
        </div>
        <!--      分页-->
        <div class="page-warp clearfix">
          <Page
            class="fr mr10 mt10"
            v-if="tIndex == 1"
            class-name="page-con"
            :page-size-opts="[100,300,500]"
            :current="contentOne.page.num"
            :total="contentOne.page.total"
            :page-size="contentOne.page.size"
            @on-change="changePageCus"
            @on-page-size-change="changeSizeCus"
            show-sizer
            show-total
          ></Page>
          <Page
            class="fr mr10 mt10"
            v-if="tIndex == 2"
            class-name="page-con"
            :page-size-opts="[100,300,500]"
            :current="contentTwo.page.num"
            :total="contentTwo.page.total"
            :page-size="contentTwo.page.size"
            @on-change="changePageCus"
            @on-page-size-change="changeSizeCus"
            show-sizer
            show-total
          ></Page>
          <Page
            class="fr mr10 mt10"
            v-if="tIndex == 3"
            class-name="page-con"
            :page-size-opts="[100,300,500]"
            :current="contentThree.page.num"
            :total="contentThree.page.total"
            :page-size="contentThree.page.size"
            @on-change="changePageCus"
            @on-page-size-change="changeSizeCus"
            show-sizer
            show-total
          ></Page>
        </div>
        <!--      点击查看显示-->
      </section>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import {
  getEnter,
  getOut,
  getOccupy,
  OtotalData,
  EtotalData,
  getLevel,
  getUnsalable
} from "@/api/business/stockSearch";
import QuickDate from "_c/getDate/dateget_bill.vue";

export default {
  name: "enterStock",
  props: { mainData: "" },
  components: { QuickDate },
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
      // 入库明细表
      enterInfo: [
        {
          title: "序号",
          type: "index",
          align: "center",
          key: "index",
          minWidth: 100
        },
        {
          title: "配件编码",
          align: "center",
          key: "partCode",
          minWidth: 170
        },
        {
          title: "配件名称",
          align: "center",
          key: "partName",
          minWidth: 120
        },
        {
          title: "单位",
          align: "center",
          key: "enterUnitId",
          minWidth: 120
        },
        {
          title: "品牌",
          align: "center",
          key: "partBrand",
          minWidth: 120
        },
        {
          title: "品牌车型",
          align: "center",
          key: "carModelName",
          minWidth: 120
        },
        {
          title: "仓库",
          align: "center",
          key: "storeName",
          minWidth: 120
        },
        {
          title: "供应商",
          align: "center",
          key: "guestName",
          minWidth: 120
        },
        {
          title: "入库日期",
          align: "center",
          key: "createTime",
          minWidth: 80
        },

        {
          title: "入库数量",
          align: "center",
          key: "enterQty",
          minWidth: 120
        },
        {
          title: "入库单价",
          align: "center",
          key: "enterPrice",
          minWidth: 120,
          render: (h, params) => {
            let tex = parseFloat(params.row.enterPrice).toFixed(2);
            return h("span", {}, tex);
          }
        },
        {
          title: "金额",
          align: "center",
          key: "enterAmt",
          minWidth: 120,
          render: (h, params) => {
            let tex = parseFloat(params.row.enterAmt).toFixed(2);
            return h("span", {}, tex);
          }
        },
        {
          title: "税率",
          align: "center",
          key: "taxRate",
          minWidth: 120
        },
        {
          title: "不含税单价",
          align: "center",
          key: "noTaxPrice",

          minWidth: 120,
          render: (h, params) => {
            let tex = parseFloat(params.row.noTaxPrice).toFixed(2);
            return h("span", {}, tex);
          }
        },
        {
          title: "不含税金额",
          align: "center",
          key: "noTaxAmt",
          minWidth: 120,
          render: (h, params) => {
            let tex = parseFloat(params.row.noTaxAmt).toFixed(2);
            return h("span", {}, tex);
          }
        },
        {
          title: "入库单号",
          align: "center",
          key: "serviceId",
          minWidth: 120
        },
        {
          title: "入库类型",
          align: "center",
          key: "enterTypeId",
          minWidth: 120
        },
        {
          title: "备注",
          align: "center",
          key: "remark",
          minWidth: 120
        }
      ],
      // 出库明细表
      outInfo: [
        {
          title: "序号",
          type: "index",
          align: "center",
          key: "index",
          minWidth: 100
        },
        {
          title: "配件编码",
          align: "center",
          key: "partCode",
          minWidth: 170
        },
        {
          title: "配件名称",
          align: "center",
          key: "partName",
          minWidth: 120
        },
        {
          title: "单位",
          align: "center",
          key: "systemUnitId",
          minWidth: 120
        },
        {
          title: "品牌",
          align: "center",
          key: "partBrand",
          minWidth: 120
        },
        {
          title: "品牌车型",
          align: "center",
          key: "carModelName",
          minWidth: 120
        },
        {
          title: "仓库",
          align: "center",
          key: "storeName",
          minWidth: 120
        },
        {
          title: "客户",
          align: "center",
          key: "guestName",
          minWidth: 120
        },
        {
          title: "出库日期",
          align: "center",
          key: "outDate",
          minWidth: 80
        },

        {
          title: "出库数量",
          align: "center",
          key: "sellQty",
          minWidth: 120
        },
        {
          title: "出库单价",
          align: "center",
          key: "sellPrice",
          minWidth: 120,
          render: (h, params) => {
            let tex = parseFloat(params.row.sellPrice).toFixed(2);
            return h("span", {}, tex);
          }
        },
        {
          title: "出库金额",
          align: "center",
          key: "sellAmt",
          minWidth: 120,
          render: (h, params) => {
            let tex = parseFloat(params.row.sellAmt).toFixed(2);
            return h("span", {}, tex);
          }
        },
        {
          title: "含税标记",
          align: "center",
          key: "taxRate",
          minWidth: 120,
          render: (h, params) => {
            let checked = params.row.taxSign == 0 ? false : true;
            return h("Checkbox", {
              props: {
                value: checked,
                disabled: true
              }
            });
          }
        },
        {
          title: "税率",
          align: "center",
          key: "taxRate",
          minWidth: 120
        },
        {
          title: "含税单价",
          align: "center",
          key: "taxPrice",
          minWidth: 120
        },
        {
          title: "含税金额",
          align: "center",
          key: "taxAmt",
          minWidth: 120
        },
        {
          title: "不含税单价",
          align: "center",
          key: "noTaxPrice",
          minWidth: 120,
          render: (h, params) => {
            let tex = parseFloat(params.row.noTaxPrice).toFixed(2);
            return h("span", {}, tex);
          }
        },
        {
          title: "不含税金额",
          align: "center",
          key: "noTaxAmt",
          minWidth: 120,
          render: (h, params) => {
            let tex = parseFloat(params.row.noTaxAmt).toFixed(2);
            return h("span", {}, tex);
          }
        },
        {
          title: "出库单号",
          align: "center",
          key: "serviceId",
          minWidth: 120
        },
        {
          title: "出库类型",
          align: "center",
          key: "enterTypeId",
          minWidth: 120
        },
        {
          title: "备注",
          align: "center",
          key: "remark",
          minWidth: 120
        }
      ],
      //级别销价
      levelType:[
        {
          title: "配件编码",
          align: "center",
          key: "partCode",
        },
        {
          title: "配件名称",
          align: "center",
          key: "partName",
        },
        {
          title: "品牌",
          align: "center",
          key: "partBrand",
        },
        {
          title: "级别",
          align: "center",
          key: "strategyName",
        },
        {
          title: "销售价",
          align: "center",
          key: "sellPrice",
          render(h, params) {
            if(params.row.strategyName == "最低售价") {
              return h("span", `${params.row.sellPrice} - ${params.row.minRequiredQty}`);
            } else {
              return h("span", params.row.sellPrice);
            }
          },
        },
        {
          title: "更新人",
          align: "center",
          key: "updateUname",
        },
        {
          title: "更新日期",
          align: "center",
          key: "updateTime",
        },
      ],
      //滞销信息
      unsalableType:[
        {
          title: "配件编码",
          align: "center",
          key: "partCode",
          minWidth: 170
        },
        {
          title: "配件名称",
          align: "center",
          key: "partName",
          minWidth: 170
        },
        {
          title: "品牌",
          align: "center",
          key: "partBrand",
          minWidth: 170
        },
        {
          title: "分店名称",
          align: "center",
          key: "orgName",
          minWidth: 170
        },
        {
          title: "滞销数量",
          align: "center",
          key: "enterQty",
          minWidth: 170
        },
      ],
      //订单占用表
      occupy: [
        {
          title: "序号",
          type: "index",
          align: "center",
          key: "index",
          minWidth: 40
        },
        {
          title: "业务单号",
          align: "center",
          key: "serviceId",
          minWidth: 170
        },
        {
          title: "客户",
          align: "center",
          key: "guestName",
          minWidth: 120
        },
        {
          title: "配件编码",
          align: "center",
          key: "partCode",
          minWidth: 120
        },
        {
          title: "配件名称",
          align: "center",
          key: "partName",
          minWidth: 120
        },
        {
          title: "占用数量",
          align: "center",
          key: "lockStockQty",
          minWidth: 120
        },
        {
          title: "仓库",
          align: "center",
          key: "storeName",
          minWidth: 120
        },
        {
          title: "创建人",
          align: "center",
          key: "createUname",
          minWidth: 120
        },
        {
          title: "创建日期",
          align: "center",
          key: "createDate",
          minWidth: 80
        },
        {
          title: "备注",
          align: "center",
          key: "remark",
          minWidth: 120
        }
      ],
      // 入库明细数据
      contentOne: {
        //数据
        dataOne: [],
        // 分页
        page: {
          num: 1,
          total: 0,
          size: 100
        }
      },
      //出库明细数据
      contentTwo: {
        //分页
        page: {
          num: 1,
          total: 0,
          size: 100
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
          size: 100
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
      levelList:[],
      //滞销信息
      unsalableList:[],
      //库龄
      branchAge:0,
      //入库查询
      searchForm2: {},
      //出库查询
      searchForm3: {},

      total1: {},
      total2: {}
    };
  },
  methods: {
    //表格选中数据
    selectTable(v) {
      this.selectTableData = v;
      // console.log(this.selectTableData)
    },
    getDataQuick(v) {
      if (this.tIndex == 1) {
        this.searchForm2.startEnterDate = v[0];
        this.searchForm2.endEnterDate = v[1];
        this.getList();
      }
      if (this.tIndex == 2) {
        this.searchForm3.startEnterDate = v[0];
        this.searchForm3.endEnterDate = v[1];
        this.getOuts();
      }
    },
    // 入库明细请求
    async getEnters() {
      this.oneTime = "";
      this.twoTime = "";
      this.searchForm2.startEnterDate = "";
      this.searchForm2.endEnterDate = "";
      this.searchForm2.guestName = "";
      this.modal1 = true;
      this.tIndex = 4;
      this.getLevelList();
    },
    hander(type) {
      // this.modal1 = true
      if (type) {
        this.getEnters();
      }
    },

    //级别销价请求
    async getLevelList(){
      let data = {}
         data.partId = this.mainData.partId
      let res = await getUnsalable(data)
        if (res.code === 0) {
          this.levelList = res.data
        }
    },

    //滞销信息请求
    async getUnsalableList(){
      let data = {}
      data.partId = this.mainData.partId
      let res = await getLevel(data)
      if (res.code === 0) {
        this.unsalableList = res.data
        if (res.data.length > 0){
          this.branchAge = res.data[0].branchStockAge ? res.data[0].branchStockAge : 0
        }else {

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

      let res = await getEnter(data);
      if (res.code == 0) {
        this.contentOne.dataOne = res.data.content;
        this.contentOne.page.total = res.data.totalElements;
      }
      this.$refs.quickDate1.searchQuick="7"
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
      let res = await getOut(data);
      if (res.code == 0) {
        this.contentTwo.dataTwo = res.data.content;
        this.contentTwo.page.total = res.data.totalElements;
      }
      this.$refs.quickDate2.searchQuick="7"
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
      this.tIndex = index;
      if (this.tIndex == 2) {
        this.getOuts();
      }
      if (this.tIndex == 1) {
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
    },
    // // 修改每页显示条数-客户信息
    changeSizeCus(size) {
      if (this.tIndex == 1) {
        this.contentOne.page.size = size;
        this.contentOne.page.page = 1;
        this.getList();
      } else if (this.tabIndex == 2) {
        this.contentTwo.page.size = size;
        this.contentTwo.page.page = 1;
        this.getOuts();
      } else {
        this.contentThree.page.page = 1;
        this.contentThree.page.size = size;
        this.getHold();
      }
    },
    // // 页数变动事件
    changePageCus(currentPage) {
      if (this.tIndex == 1) {
        this.contentOne.page.num = currentPage;
        this.getList();
      } else if (this.tIndex == 2) {
        this.contentTwo.page.num = currentPage;
        this.getOuts();
      } else {
        this.contentThree.page.num = currentPage;
        this.getHold();
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
    handleSummary1({ columns, data }) {
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
    handleSummary2({ columns, data }) {
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
.tabs-ulwarp {
  padding-top: 17px;
  border-bottom: solid 1px #ddd;
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
