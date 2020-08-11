<template>
  <div class="brandComponent">
    <!-- 预订单列表头部 -->
    <section class="oper-box">
      <div class="oper-top flex" v-if="tabValue === 'name1'">
        <div class="wlf">
          <div class="db mr10">
            <Select v-model="conditionData.character" class="w100 mr10" clearable @on-change="searchData">
              <Option
                v-for="item in quickArray"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <span class="mr10">日期从：</span>
            <Date-picker
              type="daterange"
              class="w200 mr10"
              :options="options3"
              @on-change="dateChange"
              placeholder="年/月/日-年/月/日"
            ></Date-picker>
          </div>
          <div class="db mr10">
            <Select v-model="conditionData.status" class="w100 mr10" clearable @on-change="searchData">
              <Option value="1" label="待受理"></Option>
              <Option value="3" label="已受理"></Option>
              <Option value="2" label="部分受理"></Option>
            </Select>
          </div>
          <div class="db mr10">
            <Select
              v-model="conditionData.company"
              filterable
              class="w200 mr10"
              clearable
              placeholder="选择公司"
              @on-change="searchData"
            >
              <Option
                v-for="item in companyListOptions"
                :value="item.name"
                :key="item.id"
              >{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <span>品牌：</span>
            <Select
              v-model="conditionData.partBrand"
              filterable
              clearable
              class="w100 mr10"
              placeholder="选择品牌"
              @on-change="searchData"
            >
              <Option v-for="item in brandList" :value="item.name" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db">
            <Button type="warning" class="mr20" @click="searchData">
              <Icon custom="iconfont iconchaxunicon icons" />查询
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- 代采购配件头部 -->
    <section class="oper-box">
      <div class="oper-top flex" v-if="tabValue === 'name2'">
        <div class="wlf">
          <div class="db mr10">
            <Select v-model="penPurchaseData.character" class="w100 mr10" clearable @on-change="showGeneratePurchaseOrder">
              <Option
                v-for="item in quickArray2"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <span class="mr10">日期从：</span>
            <Date-picker
              type="daterange"
              class="w200 mr10"
              :options="options3"
              @on-change="dateChange"
              placeholder="年/月/日-年/月/日"
            ></Date-picker>
          </div>
          <div class="db mr10">
            <Select
              v-model="penPurchaseData.company"
              class="w200 mr10"
              placeholder="选择公司"
              filterable
              clearable
              @on-change="showGeneratePurchaseOrder"
            >
              <Option
                v-for="item in companyListOptions"
                :value="item.name"
                :key="item.id"
              >{{ item.name }}</Option>
            </Select>
          </div>
          <!-- <div class="db mr10">
            <span>品牌：</span>
            <Select
              v-model="penPurchaseData.partBrand"
              class="w100 mr10"
              placeholder="选择品牌"
              filterable
              clearable
              @on-change="showGeneratePurchaseOrder"
            >
              <Option v-for="item in brandList" :value="item.name" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div> -->
          <div class="db">
            <Button type="warning" class="mr20" @click="penPurchaseSearch">
              <Icon custom="iconfont iconchaxunicon icons" />查询
            </Button>
            <Button class="mr10" style="border: none" @click="showGeneratePurchaseOrder">
              <span class="center" style="color: #27A2D2">
                <i class="iconfont iconxuanzetichengchengyuanicon"></i>生成采购订单
              </span>
            </Button>
            <Button class="mr10" style="border: none" @click="showZhiFa">
              <span class="center" style="color: #27A2D2">
                <i class="iconfont iconxuanzetichengchengyuanicon"></i>生成直发采购订单
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- tabs内容 -->
    <section class="con-box">
      <Tabs value="name1" type="card" @on-click="handleClickTab">
        <TabPane label="预订单列表" name="name1">
          <div>
            <Table
              @on-row-click="onRowClick"
              highlight-row
              :columns="columns"
              border
              :data="data"
              height="330"
            >
              <!--<template slot-scope="{ row, index }" slot="action">-->
              <!--<Button-->
              <!--type="default"-->
              <!--@click.stop="showAcceptance($event, index)"-->
              <!--v-if="row.status.value == 1"-->
              <!--&gt;受理</Button>-->
              <!--</template>-->
            </Table>
            <Row>
              <Col id="row">
                <Page
                  id="page"
                  style="flex:right"
                  size="small"
                  :current="List.page"
                  :total="List.total"
                  :page-size="List.pageSize"
                  :page-size-opts="List.pageSizeOpts"
                  show-sizer
                  show-total
                  @on-page-size-change="onPurchasePageSizeChange1"
                  @on-change="onPurchaseChange1"
                ></Page>
              </Col>
            </Row>
          </div>

          <Table
            style="margin-top:40px"
            show-summary
            :summary-method="handleSummary"
            :columns="columns2"
            border
            :data="data2"
            height="260"
          ></Table>
        </TabPane>
        <TabPane label="待采购配件" name="name2">
          <Table
            @on-selection-change="onSelect"
            show-summary
            :summary-method="handleSummary"
            :columns="columns3"
            border
            :data="data3"
            max-height="570"
            ref="tableBox"
          ></Table>
          <Row id="row">
            <Col>
              <div>
                <Page
                  id="page"
                  size="small"
                  @on-page-size-change="onPurchasePageSizeChange"
                  @on-change="onPurchaseChange"
                  :current="pageList.page"
                  :total="this.pageList.total"
                  :page-size="pageList.pageSize"
                  :page-size-opts="pageList.pageSizeOpts"
                  show-sizer
                  show-total
                />
              </div>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </section>

    <!-- 新增采购订单窗口 -->
    <Modal
      :mask-closable="false"
      width="700px"
      v-model="addPurchaseOrderDialog"
      title="新增采购订单"
      @on-cancel="closedPurchaseOrderDialog"
    >
      <section>
        <Form :label-width="80" ref="purchaseOrderList" @submit.native.prevent="">
          <Row>
            <Col span="24">
              <FormItem label="往来单位：">
                <brandCus
                  :title="guestName" 
                  placeholder="请输入供应商" 
                  :search-value="guestName" 
                  @throwName="throwNameFun" 
                  :disabled-prop="false"
                ></brandCus>
                <!-- <Select v-model="transitUnit" filterable clearable @on-change="addChange1">
                  <Option
                    v-for="(item,index) in transitUnitList"
                    :key="index"
                    :value="item.id"
                  >{{item.fullName}}</Option>
                </Select> -->
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="票据类型：">
                <Select v-model="billTypeId" @on-change="addChange2">
                  <Option
                    v-for="item in ticketTypeList"
                    :key="item.itemCode"
                    :value="item.itemCode"
                  >{{item.itemName}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="结算方式：">
                <Select v-model="settleTypeId" @on-change="addChange3">
                  <Option
                    v-for="item in settlementMethodList"
                    :key="item.itemCode"
                    :value="item.itemCode"
                  >{{item.itemName}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <FormItem label="备注：">
                <Input type="textarea" v-model="remark" @on-change="remarks"></Input>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </section>
      <section>
        <Table :columns="columns4" border :data="data4">
          <template slot-scope="{ row, index }" slot="del">
            <Button type="default" size="small" @click="remove(index)">删除</Button>
          </template>
        </Table>
      </section>
      <div slot="footer">
        <Button type="primary" @click="savePre">确定</Button>
        <Button type="default" @click="closedPurchaseOrderDialog">取消</Button>
      </div>
    </Modal>

    <!-- 生成直发采购订单 -->
    <Modal width="700px" v-model="directPurchaseOrderDialog" title="新增采购订单">
      <section>
        <Form :label-width="80">
          <Row>
            <Col span="24">
              <FormItem label="往来单位：">
                <Select v-model="transitUnit" filterable clearable @on-change="addChange1">
                  <Option
                    v-for="(item,index) in transitUnitList"
                    :key="index"
                    :value="item.id"
                  >{{item.fullName}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="票据类型：">
                <Select v-model="billTypeId" @on-change="addChange2">
                  <Option
                    v-for="item in ticketTypeList"
                    :key="item.itemCode"
                    :value="item.itemCode"
                  >{{item.itemName}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="结算方式：">
                <Select v-model="settleTypeId" @on-change="addChange3">
                  <Option
                    v-for="item in settlementMethodList"
                    :key="item.itemCode"
                    :value="item.itemCode"
                  >{{item.itemName}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="直发门店：">
                <Input v-model="straightHairStore" disabled></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="备注：">
                <Input type="textarea" v-model="straightRemark" @on-change="remarks2"></Input>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </section>
      <section>
        <Table :columns="columns4" border :data="data4">
          <template slot-scope="{ row, index }" slot="del">
            <Button type="default" size="small" @click="remove(index)">删除</Button>
          </template>
        </Table>
      </section>
      <div slot="footer">
        <Button type="primary" @click="saveZhifa">确定</Button>
        <Button type="default" @click="cancelZhiFa">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getBrandList,
  getPageList,
  selectCompany,
  searchBrandList,
  pendingPurchase,
  generateOrder,
  allBrand,
  PjType,
  JsStyle,
  activeCompany,
  savePreOrder,
  accept,
  pendingPurchaseSearch,
  getPurchasePageList
} from "@/api/business/brandListApi";
import {
  getPartBrandNoWB
} from "@/api/business/stockSearch";
import { parse } from "qs";
import brandCus from "_c/allocation/brandCus.vue"

export default {
  name: "brandList",
  components: {
    brandCus
  },
  data() {
    return {
      guestName: "",
      // 新增采购订单参数
      guestId: "",
      storeId: "1",
      orderManId: "",
      orderMan: "",
      orderTypeID: "1",
      orgid: "",
      billTypeId: "",
      settleTypeId: "",
      remark: "",
      transitUnit: "",
      billTypeName: "",
      settleTypeName: "",
      straightRemark: "",
      // 受理参数
      acceptObj: {},
      // 预订单条件查询数据集合处
      conditionData: {
        character: "", // 快速查询
        status: "1", //受理状态
        company: "", //公司选择
        partBrand: "" //品牌
      },
      // 代采购条件查询
      penPurchaseData: {
        character: "", // 快速查询
        company: "", //公司选择
        partBrand: "" //品牌
      },
      // 快速查询数据1
      quickArray: [
        {
          value: "本周",
          label: "本周"
        },
        {
          value: "上周",
          label: "上周"
        },
        {
          value: "本月",
          label: "本月"
        },
        {
          value: "上月",
          label: "上月"
        },
        {
          label: "本年",
          value: "本年"
        }
      ],
      // 快速查询数据2
      quickArray2: [
        {
          value: "本周",
          label: "本周"
        },
        {
          value: "上周",
          label: "上周"
        },
        {
          value: "本月",
          label: "本月"
        },
        {
          value: "上月",
          label: "上月"
        },
        {
          label: "本年",
          value: "本年"
        },
        {
          label: "上年",
          value: "上年"
        }
      ],
      querySelect2: "",
      // 日期数据
      options3: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        }
      },
      dateList: {},
      dateArray: [],
      // 选择公司数据
      companyListOptions: [],
      company: "",
      // 品牌选择数据
      brandList: [],
      brand: "",
      brands: [],
      // 分页数据
      List: {
        page: 1,
        total: 0,
        size: 20,
        pageSize: 20,
        pageSizeOpts: [20, 40, 60, 80, 100]
      },
      pageList: {
        page: 1,
        total: 0,
        size: 20,
        pageSize: 20,
        pageSizeOpts: [20, 40, 60, 80, 100]
      },
      pageTotal: 10,
      // tabs切换栏数据
      tabValue: "name1",
      // 预订单列表表格数据
      columns: [
        {
          type: "index",
          width: 60,
          align: "center", tooltip: true,
          title: "序号"
        },
        {
          title: "操作",
          slot: "action",
          align: "center", tooltip: true,
          render: (h, params) => {
            let className = "white";
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small"
                  },
                  style: {
                    color: "white"
                  },
                  class: className,
                  on: {
                    click: () => {
                      event.stopPropagation();
                      this.showAcceptance();
                    }
                  }
                },
                "受理"
              )
            ]);
          }
        },
        {
          title: "公司",
          key: "company",
          align: "center", tooltip: true,
        },
        {
          title: "预订单单号",
          key: "orderNo",
          align: "center", tooltip: true,
        },
        {
          title: "状态",
          key: "status",
          align: "center", tooltip: true,
          render(h, params) {
            // console.log(auditsign)
            return h("span", {}, params.row.status.name);
          }
        },
        {
          title: "期望到货日期",
          key: "expectedArrivalDate",
          align: "center", tooltip: true,
        },
        {
          title: "提交日期",
          key: "commitTime",
          align: "center", tooltip: true,
        },
        {
          title: "提交人",
          key: "commitUname",
          align: "center", tooltip: true,
        },
        {
          title: "备注",
          key: "remark",
          align: "center", tooltip: true,
        }
      ],
      data: [],
      // 预订单列表子表格数据
      columns2: [
        {
          type: "index",
          width: 60,
          align: "center", tooltip: true,
          title: "序号"
        },
        {
          title: "配件编码",
          key: "partCode",
          align: "center", tooltip: true,
        },
        {
          title: "配件名称",
          key: "partName",
          align: "center", tooltip: true,
        },
        {
          title: "品牌",
          key: "partBrand",
          align: "center", tooltip: true,
        },
        {
          title: "配件内码",
          key: "partInnerId",
          align: "center", tooltip: true,
        },
        {
          title: "单位",
          key: "unit",
          align: "center", tooltip: true,
        },
        {
          title: "预订数量",
          key: "preQty",
          align: "center", tooltip: true,
        },
        {
          title: "受理数量",
          key: "acceptQty",
          align: "center", tooltip: true,
          render: (h, params) => {
            let _this = this;
            let statusObj = JSON.parse(params.row.status)||{}
            return h("InputNumber", {
              props: {
                min: 0,
                value: params.row.acceptQty||0,
                disabled:statusObj.value === 3 ? true : false
              },
              style:{
                width:"70px"
              },
              on: {
                "on-change": e => {
                  params.row.acceptQty = e;
                  _this.data2[params.index] = params.row;
                }
              }
            });
          }
        },
        {
          title: "备注",
          key: "remark",
          align: "center", tooltip: true,
        }
      ],
      data2: [],
      // 代采购表格数据
      columns3: [
        {
          type: "index",
          width: 60,
          align: "center", tooltip: true,
          title: "序号"
        },
        {
          type: "selection",
          width: 60,
          align: "center", tooltip: true,
        },
        {
          title: "配件编码",
          key: "partCode",
          align: "center", tooltip: true,
        },
        {
          title: "配件名称",
          key: "partName",
          align: "center", tooltip: true,
        },
        {
          title: "品牌",
          key: "partBrand",
          align: "center", tooltip: true,
          filters: [],
          filterMethod(value, row) {
            return row.partBrand.indexOf(value) > -1;
          }
        },
        {
          title: "配件内码",
          key: "partInnerId",
          align: "center", tooltip: true,
        },
        {
          title: "单位",
          key: "unit",
          align: "center", tooltip: true,
        },
        {
          title: "预定数量",
          key: "preQty",
          align: "center", tooltip: true,
        },
        {
          title: "受理数量",
          key: "acceptQty",
          align: "center", tooltip: true,
        },
        {
          title: "公司",
          key: "company",
          align: "center", tooltip: true,
        },
        {
          title: "预定单号",
          key: "orderNo",
          align: "center", tooltip: true,
        },
        {
          title: "备注",
          key: "remark",
          align: "center", tooltip: true,
        },
        {
          title: "期望到货日期",
          key: "expectedArrivalDate",
          align: "center", tooltip: true,
        }
      ],
      data3: [],
      selectionArr: [],
      // 新增采购订单表格数据
      columns4: [
        {
          type: "index",
          width: 60,
          align: "center", tooltip: true,
          title: "序号"
        },
        {
          title: "操作",
          width: 60,
          align: "center", tooltip: true,
          slot: "del"
          // render: (h, params) =>{
          //   return h('Button', {}, "删除")
          // }
        },
        {
          title: "配件编码",
          key: "partCode",
          align: "center", tooltip: true,
        },
        {
          title: "配件名称",
          key: "partName",
          align: "center", tooltip: true,
        },
        {
          title: "品牌",
          key: "partBrand",
          align: "center", tooltip: true,
        },
        {
          title: "单位",
          key: "unit",
          align: "center", tooltip: true,
        },
        {
          title: "采购数量",
          key: "orderQty",
          align: "center", tooltip: true,
          render: (h, params) => {
            let _this = this;
            return h("InputNumber", {
              props: {
                min: 1,
                value: params.row.orderQty
              },
              on: {
                "on-change": e => {
                  // console.log(e)
                  params.row.orderQty = e;
                  _this.data4[params.index] = params.row;
                }
              }
            });
          }
        },
        {
          title: "采购单价",
          key: "orderPrice",
          align: "center", tooltip: true,
          render: (h, params) => {
            return h("InputNumber", {
              props: {
                value: params.row.orderPrice
              },
              on: {
                "on-change": e => {
                  params.row.orderPrice = e;
                  this.data4[params.index] = params.row;
                }
              }
            });
          }
        }
      ],
      data4: [],
      // 新增采购订单窗口数据
      addPurchaseOrderDialog: false,
      // 往来公司数据
      transitUnit: "",
      transitUnitList: {},
      // 票据类型数据
      ticketType: "",
      ticketTypeList: [],
      // 结算方式
      settlementMethod: "",
      settlementMethodList: [],
      // 生成直发采购订单
      directPurchaseOrderDialog: false,
      generateBrand: [],
      // 直发门店
      straightHairStore: ""
    };
  },
  mounted() {
    this.getBrand();
    this.companyIfo();
    this.getPjType();
    this.getJsStyle();
    this.getActiveCompany();
    // this.getAllBrand();
    // this.getBrandIfoList()
  },
  methods: {
    // 新增采购订单保存数据
    savePre() {
      if (
        this.transitUnit === "" ||
        this.billTypeName === "" ||
        this.settleTypeName === ""
      ) {
        this.$Message.error("请完善单据信息后在保存");
      } else {
        // console.log(this.data4)
        savePreOrder({
          guestId: this.guestId,
          storeId: this.storeId,
          orderManId: this.orderManId,
          orderMan: this.orderMan,
          billTypeId: this.billTypeId,
          settleTypeId: this.settleTypeId,
          details: this.data4,
          remark: this.remark
        }).then(res => {
          if (res.code === 0) {
            this.addPurchaseOrderDialog = false;
            this.$Message.success(res.data);
            this.getPendingPurchaseList();
          }
        });
      }
    },
    // 获取票据类型方法
    getPjType() {
      PjType().then(res => {
        if (res.code === 0) {
          this.ticketTypeList = res.data;
          this.billTypeId = res.data[0].itemCode;
          this.billTypeName = res.data[0].itemName;
        }
      });
    },
    //获取品牌
    async getAllBrand() {
      let res = await getPartBrandNoWB({ pageSize: 10000 });
      if (res.code === 0) {
        let arr = [];
        for(let v in res.data){
          let obj = {}
          obj.code = v;
          obj.id = v;
          obj.name = res.data[v]
          arr.push(obj)
        }
        this.brandList = arr;
      }
    },
    // 往来单位
    getActiveCompany() {
      activeCompany().then(res => {
        console.log(res)
        if (res.code === 0) {
          this.guestId = res.data[0].id;
          this.transitUnitList = res.data;
        }
      });
    },
    // 获取结算方式
    getJsStyle() {
      JsStyle().then(res => {
        if (res.code === 0) {
          this.settlementMethodList = res.data;
          this.settleTypeId = res.data[0].itemCode;
          this.settleTypeName = res.data[0].Name;
        }
      });
    },
    // 获取页面数据
    getBrand() {
      getBrandList(this.conditionData).then(res => {
        // 撒打发
        if (res.code === 0) {
          this.bands = [];
          let arr = res.data.content.map(el => el.partBrand);
          let set = new Set(arr);
          set.forEach(el => {
            this.bands.push({label: el, value: el});
          })
          this.columns3[4].filters = this.bands;
          this.data = res.data.content;
          this.orgid = res.data.content[0].orgid;
          this.data.map(item => {
            // console.log(item.status)
            item.status = item.status;
          });
          // console.log(this.data)
          // console.log(this.orgid)
          this.List.total = res.data.totalElements;
        }
      });
    },
    // 预订单受理按钮
    showAcceptance(e, index) {
      // console.log(e, index)
      this.$Modal.confirm({
        title: "提示",
        content: "是否确定受理",
        onCancel: () => {
          this.$Message.info("取消受理");
        },
        onOk: () => {
          // this.$Message.info('Clicked ok');
          let aceeptOptionList = {};
          aceeptOptionList.id = this.acceptObj.id;
          aceeptOptionList.detailVOList = this.data2;
          // console.log(aceeptOptionList , 123)
          // return
          accept(aceeptOptionList).then(res => {
            if (res.code === 0) {
              this.data2 = [];
              this.getBrand();
            }
          });
        }
      });
    },
    // 获取代采购页面数据
    getPendingPurchaseList(obj) {
      pendingPurchase(obj).then(res => {
        if (res.code === 0) {
          this.data3 = res.data.content;
          this.pageList.total = res.data.totalElements;
        }
      });
    },
    // 获取日期
    dateChange(value) {
      // console.log(value)
      // this.dateArray = [value]
      if (value[0] === "") {
        this.conditionData.commitTimeStart = "";
        this.conditionData.commitTimeEnd = "";
        this.penPurchaseData.commitTimeStart = "";
        this.penPurchaseData.commitTimeEnd = "";
        this.dateArray = [value];
      } else {
        this.conditionData.commitTimeStart = value[0] + " " + "00:00:00";
        this.conditionData.commitTimeEnd = value[1] + " " + "23:59:59";
        this.penPurchaseData.commitTimeStart = value[0] + " " + "00:00:00";
        this.penPurchaseData.commitTimeEnd = value[1] + " " + "23:59:59";
      }
      if(this.tabValue === "name1") {
        this.searchData()
      } else {
        this.penPurchaseSearch();
      }
    },
    newArr(arr) {
      // console.log(arr)
      return arr.reduce((pre, cur) => {
        // console.log(pre, cur)
        let flag = Array.isArray(cur.childs) && Array.isArray(cur.childs);
        return pre.concat(flag ? this.newArr(cur.childs) : cur);
      }, []);
    },
    toList(arr) {
      // console.log(arr)v
      return arr.reduce((ret, v) => {
        // console.log(ret, v)
        let item = this.deepClone(v);
        delete item.childs;
        this.companyListOptions.push(item);
        let flag = Array.isArray(v.childs) && v.childs.length > 0;
        return ret.concat(flag ? this.toList(v.childs) : v);
      }, []);
    },
    throwNameFun(v) {
      this.guestName = v.shortName;
      this.guestId = v.id;
      this.billTypeId = v.billTypeId;
      this.settleTypeId = v.settTypeId;
    },
    // 新增采购往来单位/结算方式/票据类型改变时触发
    addChange1(value) {
      this.guestId = value;
      let btype = this.transitUnitList.filter(item => {
        return item.id === value;
      });
      // let btype = this.transitUnitList.filter(item => item.id = value)
      this.billTypeId = btype[0].billTypeId;
      this.settleTypeId = btype[0].settTypeId;
    },
    // 新增采购结算方式改变时触发
    addChange2(value) {
      // console.log(value)
      // this.settleTypeId = value;
      this.billTypeId = value;
    },
    // 新增采购票据类型改变时触发
    addChange3(value) {
      // console.log(value)
      // this.billTypeId = value;
      this.settleTypeId = value;
    },
    // 新增备注
    remarks(event) {
      this.remark = event.target.value;
    },
    // 新增直发备注
    remarks2(event) {
      // console.log(event)
      this.straightRemark = event.target.value;
    },
    deepClone(obj) {
      let ret;
      ret = JSON.stringify(obj);
      ret = JSON.parse(ret);
      return ret;
    },
    // 公司信息获取
    companyIfo() {
      // let user = this.$store.state.user.userData;
      // // console.log(user)
      // this.orderManId = user.id;
      // this.orderMan = user.staffName;
      // selectCompany({ pId: user.tenantId }).then(res => {
      //   // console.log(res)
      //   if (res.code === 0) {
      //     let data = res.data;
      //     let item = this.deepClone(data);
      //     delete item.childs;
      //     // console.log(item)
      //     this.companyListOptions.push(item);
      //     this.toList(data.childs);
      //     // console.log(this.companyListOptions)
      //   }
      // });

      selectCompany().then(res => {
        if (res.code == 0) {
          this.companyListOptions = [];
          Object.keys(res.data).forEach(key => {
            // this.companyListOptions=res.data[key]
            this.companyListOptions.push({
              id: key,
              name: res.data[key]
            });
          });
        }
      });
    },
    // 查询
    searchData() {
      searchBrandList(this.conditionData).then(res => {
        if (res.code === 0) {
          this.data = res.data.content;
          this.data.map(item => {
            item.status = JSON.parse(item.status);
          });
          this.List.total = res.data.totalElements;
        }
      });
    },
    // 待采购查询
    penPurchaseSearch() {
      pendingPurchaseSearch(this.penPurchaseData).then(res => {
        if (res.code === 0) {
          this.data3 = res.data.content;
          this.pageList.total = res.data.totalElements;
        }
      });
    },
    // 点击tabs切换头部
    handleClickTab(item) {
      this.tabValue = item;
      if (item === "name2") {
        this.getPendingPurchaseList();
        this.data4 = [];
      } else {
        this.getBrand();
        this.data2 = [];
      }
    },
    // 预订单受理表格单击
    onRowClick(value) {
      // console.log(value)
      this.acceptObj = value;
      this.orgid = value.orgid;
      this.data2 = value.detailVOList;
    },
    // 待采购订单单选
    onSelect(row, selection) {
      // console.log(selection)
      this.generateBrand = row;
      this.data4 = row;
    },
    // 待采购订单全选
    onSelectAll(selection) {
      // console.log(selection)
      this.selectionArr = selection;
      this.generateBrand = row;
      this.data4 = row;
    },
    // 代采购订单单选取消
    onSelectCancel() {
      this.generateBrand = [];
      this.data4 = [];
    },
    // 代采购订单全选取消
    onSelectAllCancel() {
      this.generateBrand = [];
      this.data4 = [];
    },
    // 待采购页面生成采购订单按钮
    showGeneratePurchaseOrder() {
      if (this.data4.length < 1) {
        this.$Message.error("请选择待采购的配件！");
      } else {
        this.addPurchaseOrderDialog = true;
      }
    },
    closedPurchaseOrderDialog() {
      //关闭生成采购按钮
      this.addPurchaseOrderDialog = false;
      this.$refs.tableBox.selectAll(false);

      // this.data4 = []
    },
    // 直发采购订单
    showZhiFa() {
      let value;
      if (this.data4.length > 0) {
        value = this.data4[0].company;
        let flag = this.data4.every(item => item.company == value);
        if (flag) {
          this.data4 = this.data4.map(item => {
            item.minAcceptQty = item.acceptQty;
            return item;
          });
          this.directPurchaseOrderDialog = true;
          this.straightHairStore = value;
        } else {
          this.$Message.error("请选择相同公司下的预定配件");
        }
      } else {
        this.$Message.error("请选择代采购的配件！");
      }
      // if(this.generateBrand.length < 1){
      //   this.$Message.error("请选择代采购的配件！")
      // }else{
      //   this.directPurchaseOrderDialog = true
      // }
    },
    // 直发确定按钮
    saveZhifa() {
      if (
        this.transitUnit === "" ||
        this.billTypeName === "" ||
        this.settleTypeName === ""
      ) {
        this.$Message.error("请完善单据信息后在保存");
      } else if (this.data4.orderPrice == 0) {
        this.$Message.error("存在单价为0");
      } else {
        savePreOrder({
          guestId: this.guestId,
          storeId: this.storeId,
          directOrgid: this.orgid,
          orderManId: this.orderManId,
          orderMan: this.orderMan,
          orderTypeId: this.orderTypeId,
          billTypeId: this.billTypeId,
          settleTypeId: this.settleTypeId,
          details: this.data4,
          remark: this.straightRemark
        }).then(res => {
          if (res.code === 0) {
            this.$Message.success(res.data);
            this.directPurchaseOrderDialog = false;
            this.getPendingPurchaseList();
            this.data4 = [];
          }
        });
      }
    },
    // 直发取消按钮
    cancelZhiFa() {
      this.directPurchaseOrderDialog = false;
    },
    // 代采购删除按钮
    remove(index) {
      this.data4.splice(index, 1);
    },
    // 预订单页码切换
    onChange(value) {
      // console.log(`当前页码${value}`)
      this.pageList.page = value;
      // console.log(value)
      getPageList(this.pageList).then(res => {
        if (res.code === 0) {
          this.data = res.data.content;
          this.data.map(item => {
            item.status = item.status;
          });
        }
      });
      this.data2 = [];
    },
    // 预订单每页条数切换
    onPageSizeChange(value) {
      // console.log(`每页条数${value}`)
      this.pageList.size = value;
      getPageList(this.pageList).then(res => {
        if (res.code === 0) {
          this.data = res.data.content;
          this.data.map(item => {
            item.status = item.status;
          });
        }
      });
      this.data2 = [];
    },
    // 代采购页码切换
    onPurchaseChange(value) {
      // console.log(`当前页码${value}`)
      this.pageList.page = value;
      getPurchasePageList(this.pageList).then(res => {
        if (res.code === 0) {
          this.data3 = res.data.content;
          this.data3.map(item => {
            item.status = item.status;
          });
        }
      });
      this.data2 = [];
    },
    // 代采购每页条数切换
    onPurchasePageSizeChange(value) {
      // console.log(`${value}`)
      this.pageList.size = value;
      // console.log(this.pageList)
      getPurchasePageList(this.pageList).then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.data3 = res.data.content;
          this.data3.map(item => {
            item.status = item.status;
          });
        }
      });
      this.data2 = [];
    },
    // 代采购页码切换
    onPurchaseChange1(value) {
      // console.log(`当前页码${value}`)
      this.List.page = value;
      this.getBrand();

      this.data2 = [];
    },
    // 代采购每页条数切换
    onPurchasePageSizeChange1(value) {
      // console.log(`${value}`)
      this.List.size = value;
      // console.log(this.pageList)
      this.getBrand();

      this.data2 = [];
    },
    // 表格底部合计
    handleSummary({ columns, data }) {
      // console.log(columns, data);
      const sums = {};
      columns.forEach((column, index) => {
        const key = column.key;
        if (key === "partCode") {
          sums[key] = {
            key,
            value: data.length
          };
          return;
        }
        if (key === "acceptQty") {
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
            sums[key] = {
              key,
              value: v
            };
          } else {
            sums[key] = {
              key,
              value: "N/A"
            };
          }
          return;
        }
        if (key === "preQty") {
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
            sums[key] = {
              key,
              value: v
            };
          } else {
            sums[key] = {
              key,
              value: "N/A"
            };
          }
          return;
        }
        sums[key] = {
          key,
          value: ""
        };
      });
      return sums;
    },
    // 弹出新增采购订单窗口
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    }
    // showPurchaseOrder() {
    //   this.addPurchaseOrderDialog = true
    // }
  }
};
</script>

<style lang="less">
.ivu-row {
  margin: 10px 0px;
  line-height: 30px;
}
</style>
<style>
.ivu-table .white span {
  color: white !important;
}
#row {
  position: relative;
}
#page {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
