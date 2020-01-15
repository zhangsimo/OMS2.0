<template>
  <main
    class="bigBox"
    style="background-color: #fff; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1); height:100%"
  >
    <div class="content-oper content-oper-flex" style="box-shadow:none">
      <section class="oper-box">
        <div class="oper-top flex">
          <div class="wlf">
            <div class="db">
              <span>快速查询：</span>
              <quick-date class="mr10" @quickDate="getDataQuick"></quick-date>
              <Select v-model="form.status" @on-change="getDataType" class="w90 mr10">
                <Option
                  v-for="item in purchaseTypeArr"
                  :value="item.value"
                  :key="item.value"
                >{{item.label}}</Option>
              </Select>
            </div>
            <div class="db">
              <Button type="default" @click="more" class="mr10">
                <i class="iconfont mr5 iconchaxunicon"></i>更多
              </Button>
            </div>
            <div class="db">
              <Button v-has="'add'" class="mr10" @click="xinzeng">
                <Icon type="md-add" />新增
              </Button>
            </div>
            <div class="db">
              <Button
                v-has="'save'"
                type="default"
                class="mr10"
                @click="baocun1"
                :disabled="buttonDisable == 2"
              >
                <i class="iconfont mr5 iconbaocunicon"></i>保存
              </Button>
            </div>
            <div class="db">
              <Button
                class="mr10"
                v-has="'submit'"
                :disabled="buttonDisable == 1 || buttonDisable == 2"
                @click="tijiao1"
              >
                <Icon type="md-checkmark" size="14" />提交
              </Button>
            </div>
            <div class="db">
              <Button
                :disabled="this.buttonDisable !== 1"
                v-has="'delivery'"
                class="mr10"
                @click="chuku"
              >
                <Icon type="md-checkmark" size="14" />出库
              </Button>
            </div>
            <div class="db">
              <Button
                v-has="'cancellation'"
                class="mr10"
                @click="zuofei1"
                :disabled="buttonDisable == 2"
              >
                <Icon type="md-close" size="14" />作废
              </Button>
            </div>
            <div class="db">
              <Button v-has="'print'" class="mr10" @click="printTable">
                <Icon type="md-close" size="14" />打印
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section class="con-box">
        <div class="inner-box">
          <div class="con-split" ref="paneLeft">
            <Split v-model="split1" min="200" @on-moving="getDomHeight">
              <div slot="left" class="con-split-pane-left" style="overflow-y: auto; height: 100%;">
                <div class="pane-made-hd">调拨受理列表</div>
                <Table
                  :height="leftTableHeight"
                  @on-current-change="selectTabelData"
                  size="small"
                  highlight-row
                  border
                  :stripe="true"
                  :columns="Left.columns"
                  :data="Left.tbdata"
                />
                <Page
                  size="small"
                  :total="Left.page.total"
                  :page-size="Left.page.size"
                  :current="Left.page.num"
                  :page-size-opts="Left.page.opts"
                  show-sizer
                  show-total
                  class-name="page-con"
                  @on-change="changePage"
                  @on-page-size-change="changeSize"
                  class="mr10"
                ></Page>
              </div>
              <div slot="right" class="con-split-pane-right pl5 goods-list-form">
                <div class="pane-made-hd">调拨受理信息</div>
                <div v-if="showit" class="clearfix purchase" ref="planForm">
                  <Form :model="Leftcurrentrow" inline ref="formPlan" :label-width="120">
                    <FormItem label="调入方：" prop="supplyName" class="redIT">
                      <Row>
                        <Col span="22">
                          <!-- <Input
                            readonly
                            v-model="Leftcurrentrow.guestName"
                            placeholder="请选择调入方"
                          ></Input>
                            placeholder="请选择调出方"
                          ></Input>-->
                          <Select
                            v-model="Leftcurrentrow.guestName"
                            label-in-value
                            filterable
                            :disabled="this.flagValue != 0"
                          >
                            <Option v-for="item in ArrayValue" :value="item" :key="item">{{ item }}</Option>
                          </Select>
                        </Col>
                        <Col span="2">
                          <Button
                            :disabled="this.flagValue != 0"
                            @click="showModel"
                            class="ml5"
                            size="small"
                            type="default"
                          >
                            <i class="iconfont iconxuanzetichengchengyuanicon"></i>
                          </Button>
                        </Col>
                      </Row>
                    </FormItem>
                    <FormItem label="调出仓库：" prop="supplyName" class="redIT">
                      <Row class="w160">
                        <Col span="24">
                          <Select
                            :disabled="buttonShow || this.flagValue1 !== 0"
                            v-model="Leftcurrentrow.storeId"
                          >
                            <!--<Option-->
                            <!--v-for="item in cangkuListall"-->
                            <!--:value="item.value"-->
                            <!--:key="item.value"-->
                            <!--&gt;{{item.label}}</Option>-->
                            <Option
                              v-for="item in cangkuListall"
                              :value="item.id"
                              :key="item.id"
                            >{{ item.name }}</Option>
                          </Select>
                        </Col>
                      </Row>
                    </FormItem>
                    <FormItem label="调拨受理日期：" prop="billType" class="redIT">
                      <DatePicker
                        disabled
                        @on-change="changeDate"
                        v-model="Leftcurrentrow.createTime"
                        format="yyyy-MM-dd HH:mm:ss"
                        type="date"
                        class="w160"
                      ></DatePicker>
                    </FormItem>
                    <FormItem label="备注：" prop="remark">
                      <Input v-model="Leftcurrentrow.remark" class="w160"></Input>
                    </FormItem>
                    <FormItem label="受理人：" prop="createUname">
                      <Input class="w160" disabled :value="Leftcurrentrow.createUname"></Input>
                    </FormItem>
                    <FormItem label="申请单号：" prop="code">
                      <Input class="w160" disabled :value="Leftcurrentrow.code"></Input>
                    </FormItem>
                    <FormItem label="受理单号：" prop="serviceId">
                      <Input
                        class="w160"
                        :disabled="Leftcurrentrow.status.value !== 0"
                        :value="Leftcurrentrow.serviceId"
                        disabled
                      />
                    </FormItem>
                  </Form>
                </div>
                <div class="flex plan-cz-btn" ref="planBtn">
                  <div class="clearfix">
                    <div class="fl mb5">
                      <Button
                        v-has="'addMountings'"
                        size="small"
                        :disabled="buttonDisable == 1"
                        class="mr10"
                        @click="addMountings"
                      >
                        <Icon type="md-add" />添加配件
                      </Button>
                    </div>
                    <div class="fl mb5">
                      <Button v-has="'delete'" size="small" class="mr10" @click="shanchu">
                        <i class="iconfont mr5 iconlajitongicon"></i> 删除配件
                      </Button>
                    </div>
                    <div class="fl mb5">
                      <Button
                        v-has="'GoodsInfoModal'"
                        size="small"
                        class="mr10"
                        @click="GoodsInfoModal"
                      >
                        <i class="iconfont mr5 iconlajitongicon"></i> 编辑发货信息
                      </Button>
                    </div>
                  </div>
                </div>
                <vxe-table
                  auto-resize
                  border
                  resizable
                  show-footer
                  ref="xTable1"
                  size="mini"
                  @select-all="selectAllEvent"
                  @select-change="selectChangeEvent"
                  :height="rightTableHeight"
                  :data="Leftcurrentrow.detailVOS"
                  :footer-method="addFooter"
                  :edit-rules="validRules"
                  showOverflow="true"
                  show-overflow
                  :edit-config="{trigger: 'click', mode: 'cell'}"
                >
                  <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                  <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                  <vxe-table-column field="partCode" title="配件编码" width="100"></vxe-table-column>
                  <vxe-table-column field="partName" title="配件名称" width="100"></vxe-table-column>
                  <vxe-table-column field="partBrand" title="品牌" width="100"></vxe-table-column>
                  <vxe-table-column field="applyQty" title="申请数量" width="100"></vxe-table-column>
                  <vxe-table-column
                    field="hasAcceptQty"
                    :edit-render="{name: 'input',attrs: {disabled: false}}"
                    width="100"
                    title="受理数量"
                  ></vxe-table-column>
                  <!-- <vxe-table-column field="stockOutQty" title="缺货数量" width="100"></vxe-table-column> -->
                  <vxe-table-column field="stockOutQty" title="缺货数量" width="100"></vxe-table-column>
                  <vxe-table-column field="carBrandName" title="品牌车型" width="100"></vxe-table-column>
                  <vxe-table-column field="unit" title="单位" width="100"></vxe-table-column>
                  <vxe-table-column field="oemCode" title="OE码" width="100"></vxe-table-column>
                  <vxe-table-column field="spec" title="规格" width="100"></vxe-table-column>
                  <vxe-table-column field="hasOutQty" title="出库数量" width="100"></vxe-table-column>
                </vxe-table>
              </div>
            </Split>
          </div>
        </div>
      </section>
      <!--更多弹框-->
      <Modal v-model="advanced" title="高级查询" width="600px" @on-visible-change="moreChange">
        <More
          ref="naform"
          :ArrayValue="ArrayValue"
          @getName="showModel2"
          :dcName="diaochuName"
          :dcId="diaochuID"
        ></More>
        <div slot="footer">
          <Button type="primary" @click="Determined">确定</Button>
          <Button type="default" @click="advanced=false">取消</Button>
        </div>
      </Modal>
    </div>
    <!--      添加配件-->
    <select-part-com ref="selectPartCom" @selectPartName="getPartNameList"></select-part-com>
    <!--编辑收货信息-->
    <!--    <Modal v-model="GainInformation" title="编辑发货信息" width="1200px">-->
    <!--      <goods-info ref="goodI" @init="GainInformation = false"></goods-info>-->
    <!--      <div slot="footer">-->
    <!--        &lt;!&ndash; <Button type="primary" @click="getMessage">确定</Button>-->
    <!--        <Button type="default">取消</Button>&ndash;&gt;-->
    <!--      </div>-->
    <!--    </Modal>-->
    <!--编辑收货信息-->
    <goods-info ref="goodsInfo" :mainId="MainID" :row="datadata"></goods-info>
    <!-- 选择调出方 -->
    <!--<select-supplier @selectSearchName="selectSupplierName" ref="selectSupplier" headerTit="调出方资料"></select-supplier>-->
    <select-supplier
      ref="selectSupplier"
      header-tit="调入方资料"
      @selectSupplierName="selectSupplierName"
    ></select-supplier>

    <add-in-com
      :tbdata="tableData1"
      @getName="showModel3"
      :dcName="diaochuName"
      :dcId="diaochuID"
      :dcList="dcData"
      @search21="searchPro"
      @ok="getOkList"
      @selectAddName="selectAddlierName"
      ref="addInCom"
      headerTit="配件成品选择"
    ></add-in-com>
    <Print-show ref="printBox" :curenrow="dayinCureen"></Print-show>
  </main>
  <!-- 配件组装 -->
</template>

<script>
import AddInCom from "./compontents/AddInCom";
import More from "./compontents/More";
import "../../../lease/product/lease.less";
import PrintShow from "./compontents/PrintShow";
import selectPartCom from "./compontents/selectPartCom";
import GoodsInfo from "./compontents/goodsInfo";
import moment from "moment";
import QuickDate from "../../../../components/getDate/dateget";
// import SelectSupplier from './compontents/selectSupplier'
import SelectSupplier from "../../transferringOrder/applyFor/compontents/supplier/selectSupplier";
import { findForAllot } from "_api/purchasing/purchasePlan";
import {
  getList1,
  baocun,
  tijiao,
  shanqu,
  zuofei,
  chengping,
  cangkulist2,
  outDataList,
  getListDetail
} from "@/api/AlotManagement/stockRemoval.js";

import { queryByOrgid } from "../../../../api/AlotManagement/transferringOrder";
export default {
  name: "stockRemoval",
  components: {
    More,
    QuickDate,
    AddInCom,
    SelectSupplier,
    PrintShow,
    GoodsInfo,
    selectPartCom
  },
  data() {
    let changeNumber = (rule, value, callback) => {
      if (!value && value != "0") {
        callback(new Error("请输入大于0的正整数"));
      } else {
        const reg = /^[1-9]\d*$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入大于0的正整数"));
        }
      }
    };
    return {
      flag1: false,
      validRules: {
        hasAcceptQty: [{ required: true, validator: changeNumber }]
      },
      checkboxArr: [], // checkbox选中
      idsId: [],
      MainID: "",
      datadata: "",
      getArray: [],
      tuneOut: false,
      flag: 0,
      flagState: 0,
      flagValue: 0,
      flagValue1: 0,
      ArrayValue: [],
      buttonDisable: 0,
      buttonShow: true, //按钮是否禁用
      guestOrgid: "", //保存调出方的id
      GainInformation: false, //编辑收获信息
      staaa: false,
      dcData: [],
      showit: true,
      form: {
        status: "",
        createTimeStart: "",
        createTimeEnd: ""
      },
      tabKey: "0",
      modal2: true,
      split1: 0.2,
      tabIndex: 0,
      curronly: false,
      purchaseType: 1, //查询选项
      purchaseTypeArr: [
        {
          label: "所有",
          value: 99
        },
        {
          label: "草稿",
          value: 0
        },
        {
          label: "待出库",
          value: 1
        },
        {
          label: "已出库",
          value: 2
        },
        {
          label: "已作废",
          value: 3
        }
      ],

      advanced: false, //更多模块的弹框
      //左侧表格高度
      leftTableHeight: 0,
      tableData: [
        {
          name: "a",
          role: "a",
          sex: "a",
          num6: "",
          date12: "",
          data: [
            {
              name: 1
            },
            { name: 2 }
          ]
        },
        {
          name: "b",
          role: "b",
          sex: "b",
          num6: "",
          date12: ""
        },
        {
          name: "c",
          role: "c",
          sex: "c",
          num6: "",
          date12: ""
        },
        {
          name: "d",
          role: "d",
          sex: "d",
          num6: "",
          date12: ""
        }
      ],
      // 所需零件数据
      components: [],
      //右侧表格高度
      rightTableHeight: 0,
      //左侧的表头内容
      Left: {
        page: {
          num: 1,
          size: 20,
          total: 0,
          opts: [20, 50, 100, 200]
        },
        loading: false,
        columns: [
          {
            title: "序号",
            minWidth: 50,
            key: "index"
          },
          {
            title: "状态",
            key: "statuName",
            minWidth: 70
          },
          {
            title: "调入方",
            key: "guestName",
            minWidth: 120
          },
          {
            title: "创建日期",
            key: "createTime",
            minWidth: 140
          },
          {
            title: "受理人",
            key: "createUname",
            minWidth: 100
          },
          {
            title: "受理单号",
            key: "serviceId",
            minWidth: 240
          },
          {
            title: "提交人",
            key: "commitUname",
            minWidth: 100
          },
          {
            title: "提交日期",
            key: "commitDate",
            minWidth: 160
          },
          {
            title: "打印次数",
            key: "printing",
            minWidth: 100
          }
        ],
        tbdata: []
      },
      Right: {
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        loading: false,
        columns: [
          {
            title: "序号",
            minWidth: 50,
            key: "id"
          },
          {
            title: "状态",
            key: "venderSkuNo",
            minWidth: 70
          },
          {
            title: "调出方",
            key: "name",
            minWidth: 170
          },
          {
            title: "创建日期",
            key: "address",
            minWidth: 120
          },
          {
            title: "申请人",
            key: "isCycle",
            minWidth: 140
          },
          {
            title: "申请单号",
            key: "disable",
            minWidth: 200
          },
          {
            title: "提交人",
            key: "remark",
            minWidth: 100
          },
          {
            title: "提交日期",
            align: "center",
            key: "qualitySourceName",
            minWidth: 170
          },
          {
            title: "打印次数",
            key: "categoryName",
            minWidth: 170
          }
        ],
        tbdata: []
      },
      dayinCureen: {},
      currentrow: {
        id: "1",
        name: "2"
      },
      duoxuanList: [],
      currentData: [],
      Leftcurrentrow: {
        status: {
          value: 0
        },
        storeName: "",
        createTime: "",
        orderMan: "",
        remark: "",
        serviceId: "",
        detailVOS: []
      },
      currentDataP: [],
      cangkuListall: [],
      tableData1: [],
      currentNum: 1,
      val: "0",
      diaochuName: "",
      diaochuID: "",
      clickdelivery: false
    };
  },
  watch: {
    Leftcurrentrow: {
      handler(newVal) {
        this.Leftcurrentrow = newVal;
      },
      deep: true
    }
  },
  created() {
    // 调接口获取配件组装列表信息
    this.getList();
    this.getArrayParams();
  },
  methods: {
    // 高级查询弹框
    moreChange(type) {
      if (!type) {
        this.$refs.naform.reset();
      }
    },
    getArrayParams() {
      var req = {};
      req.page = 1;
      req.size = 20;
      findForAllot(req).then(res => {
        const { content } = res.data;
        this.getArray = content;
        content.forEach(item => {
          this.ArrayValue.push(item.fullName);
        });
      });
    },
    //  获取子组件逐渐传过来的值
    // getArray(data) {
    //   this.ArrayValue = data;
    // },
    //配件返回的参数
    getPartNameList(val) {
      val.forEach(item => {
        item.partName = item.partStandardName;
        item.hasAcceptQty = "1";
        item.carBrandName = item.adapterCarModel;
        item.orderPrice = item.minUnit;
        item.oemCode = item.oeCode;
        item.spec = item.specifications;
        item.partId = item.id;
        item.partInnerId = item.code;
        delete item.id;
        delete item.orderPrice;
      });

      var allArr = []; //新数组

      this.Leftcurrentrow.detailVOS = [
        ...this.Leftcurrentrow.detailVOS,
        ...val
      ];
      var allArr = [];
      var oldArr = this.Leftcurrentrow.detailVOS;
      for (var i = 0; i < oldArr.length; i++) {
        var flag = true;
        for (var j = 0; j < allArr.length; j++) {
          if (oldArr[i].oemCode == allArr[j].oemCode) {
            flag = false;
          }
        }
        if (flag) {
          allArr.push(oldArr[i]);
        }
      }
      this.Leftcurrentrow.detailVOS = allArr;

      // var arrSet = this.Leftcurrentrow.detailVOS;
      // console.log(arrSet, "arrSet==606");
      // for (var i = 0; i < this.Leftcurrentrow.detailVOS.length; i++) {
      //   var flag = true;
      //   for (var j = 0; j < allArr.length; j++) {
      //     if (this.Leftcurrentrow.detailVOS[i].id == allArr[j].id) {
      //       flag = false;
      //     }
      //   }
      //   if (flag) {
      //     allArr.push(this.Leftcurrentrow.detailVOS[i]);
      //   }
      // }
      // this.$refs.formPlan.validate(async (valid) => {
      //     if (valid) {
      //         let data ={}
      //         data = this.Leftcurrentrow
      //         data.detailVOS = conversionList(val)
      //         let res = await  baocun(data)
      //         if(res.code === 0){
      //             this.getList()
      //         }
      //     } else {
      //         this.$Message.error('*为必填项');
      //     }
      // })
    },
    // getMessage() {
    //   const params = this.$refs.goodI.getParams()
    //   this.Leftcurrentrow['sendWay'] = params
    //   this.GainInformation = false
    // },
    selectAllEvent({ checked }) {},
    selectChangeEvent(msg) {
      this.idsId.push(msg.row.id);
      this.checkboxArr = msg.selection;
    },
    getDataType() {
      this.getList();
    },
    async baocun1() {
      if (this.Leftcurrentrow.remark.length > 100) {
        this.$Message.info("备注小于100个字符");
        return;
      }
      if (
        !this.Leftcurrentrow.storeId ||
        !this.Leftcurrentrow.createTime ||
        !this.Leftcurrentrow.guestName
      ) {
        this.$Message.info("仓库和创建时间以及调出方为必输项");
        return;
      }
      // if (!this.Leftcurrentrow.serviceId) {
      //   if (this.Leftcurrentrow.xinzeng === "1") {
      //   } else {
      //     this.$Message.info("请先选择加工单");
      //     return;
      //   }
      // }
      // if (this.Leftcurrentrow.status.value !== 0) {
      //   this.$Message.info("只有草稿状态才能进行保存操作");
      //   return;
      // }
      const params = JSON.parse(JSON.stringify(this.Leftcurrentrow));
      if (params.xinzeng) {
        delete params.status;
      }
      if (this.flagState == 1) {
        params.status = 0;
      } else {
        params.status = params.status.value;
      }
      if (params.orderTypeId && params.orderTypeId.name) {
        params.orderTypeId = params.orderTypeId.value;
      }
      if (params.settleStatus && params.settleStatus.name) {
        params.settleStatus = params.settleStatus.value;
      }
      for (var i = 0; i < this.getArray.length; i++) {
        if (this.getArray[i].fullName == this.Leftcurrentrow.guestName) {
          params.guestOrgid = this.getArray[i].isInternalId;
          params.guestId = this.getArray[i].id;
        }
      }
      if (this.flag1 == true) {
        params.id = "";
      }
      try {
        await this.$refs.xTable1.validate();
        //配件组装保存
        baocun(params)
          .then(res => {
            // 点击列表行==>配件组装信息
            if (res.code == 0) {
              this.getList();
              this.$Message.success("保存成功");
              this.flag = 0;
              this.flag1 = false;
              // this.Leftcurrentrow.storeId = ""
              // this.Leftcurrentrow.guestName = ""
              // this.Leftcurrentrow.storeName =  "",
              // this.Leftcurrentrow.createTime =  "",
              // this.Leftcurrentrow.orderMan = "",
              // this.Leftcurrentrow.remark =  "",
              // this.Leftcurrentrow.serviceId =  "",
              // this.Leftcurrentrow.detailVOS =  []
            }
          })
          .catch(e => {
            this.$Message.info("保存配件组装信息失败");
          });
      } catch (errMap) {
        this.$XModal.message({
          status: "error",
          message: "受理数量必须输入大于0的正整数！"
        });
      }
    },
    xinzeng() {
      this.flag1 = true;
      this.flagState = 1;
      this.flagValue = 0;
      this.flagValue1 = 0;
      this.buttonDisable = 0;
      this.Leftcurrentrow.detailVOS = [];
      this.Leftcurrentrow.guestName = "";
      this.Leftcurrentrow.code = "";
      this.Leftcurrentrow.remark = "";
      this.Leftcurrentrow.serviceId = "";
      this.Leftcurrentrow.storeId = this.cangkuListall[0].id;
      this.buttonShow = false;
      this.tuneOut = false;
      this.Leftcurrentrow.createTime = moment(new Date()).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      if (this.Left.tbdata.length === 0) {
      } else {
        if (this.Left.tbdata[0]["xinzeng"] === "1") {
          this.$Message.info("请先保存数据");
          return;
        }
      }
      this.flag = 1;
      this.Leftcurrentrow.statuName = "草稿";
      const item = {
        new: true,
        _highlight: true,
        index: 1,
        xinzeng: "1",
        status: {
          enum: "DRAFT",
          name: "草稿",
          value: 0
        },
        statuName: "草稿",
        storeName: "",
        createTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        orderMan: this.$store.state.user.userData.staffName,
        remark: "",
        serviceId: "",
        detailVOS: []
      };
      this.Left.tbdata.unshift(item);
      this.Left.tbdata.map((item, index) => {
        item.index = index + 1;
      });
    },
    tijiao1() {
      if (this.Leftcurrentrow.xinzeng === "1") {
        this.$Message.info("请先保存新增加工单");
        return;
      }
      // if (!this.Leftcurrentrow.serviceId) {
      //   this.$Message.info("请先选择加工单");
      //   return;
      // }
      // if (this.Leftcurrentrow.status.value === 1) {
      //   this.$Message.info("当前加工单号已提交审核!无需重复操作");
      //   return;
      // }
      const params = JSON.parse(JSON.stringify(this.Leftcurrentrow));
      params.status = params.status.value;
      params.settleStatus = params.settleStatus.value;
      params.orderTypeId = params.orderTypeId.value;
      tijiao(params)
        .then(res => {
          // 点击列表行==>配件组装信息
          if (res.code == 0) {
            this.getList();
            this.$Message.success("提交成功");
          }
        })
        .catch(e => {
          this.$Message.info("提交失败");
        });
    },
    zuofei1() {
      // if (!this.Leftcurrentrow.serviceId) {
      //   this.$Message.info("请先选择加工单");
      //   return;
      // }
      if (this.Leftcurrentrow.xinzeng === "1") {
        this.$Message.info("请先保存新增加工单");
        return;
      }
      if (this.Leftcurrentrow.status.value !== 0) {
        this.$Message.info("只有草稿状态加工单能进行作废操作");
        return;
      }
      const paramster = {
        id: this.Leftcurrentrow.id
      };
      this.$Modal.confirm({
        title: "是否确定作废",
        onOk: () => {
          // 配件组装作废
          zuofei(paramster)
            .then(res => {
              // 点击列表行==>配件组装信息
              if (res.code == 0) {
                this.$Message.success("作废成功");
                this.getList();
              }
            })
            .catch(e => {
              this.$Message.info("作废失败");
              this.getList();
            });
        },
        onCancel: () => {
          this.getList();
          this.Leftcurrentrow.serviceId = "";
        }
      });
    },
    //选择单据
    selectAddlierName(row) {
      this.Left.tbdata = [...row];
      this.Right = row;
    },
    // 新增按钮
    addProoo() {
      chengping({}, 10, 1)
        .then(res => {
          // 导入成品, 并把成品覆盖掉当前配件组装信息list
          if (res.code == 0) {
            this.tableData1 = res.data.content;
            this.$refs.addInCom.init();
            this.$Message.success("获取成品列表成功");
          }
        })
        .catch(e => {
          this.$Message.info("获取成品失败");
        });
      // 获取成品列表把data赋值给子组件中
      // this.getListPro()
    },
    changeDate(val) {
      this.Leftcurrentrow.createTime = val;
    },
    //编辑收货信息弹框显示
    GoodsInfoModal() {
      if (!this.currentrow) {
        this.$Message.info("请选择编辑项");
        return;
      }
      this.clickdelivery = true;
      this.$refs.goodsInfo.init();
    },
    //打印表格
    printTable() {
      // if (!this.dayinCureen.id) {
      //   this.$Message.info('请选择打印项')
      //   return
      // }
      this.$refs.printBox.openModal();
    },
    chuku() {
      const params = {
        id: this.Leftcurrentrow.id
      };
      // 配件组装作废
      outDataList(params)
        .then(res => {
          // 点击列表行==>配件组装信息
          if (res.code == 0) {
            this.getList();
            this.$Message.success("出库成功");
          }
        })
        .catch(e => {
          this.$Message.info("出库失败");
        });
    },
    searchPro(params, size, page) {
      chengping({ ...params }, size, page)
        .then(res => {
          // 导入成品, 并把成品覆盖掉当前配件组装信息list
          if (res.code == 0) {
            this.tableData1 = res.data;
          }
        })
        .catch(e => {
          this.$Message.info("获取成品失败");
        });
      // 获取成品列表把data赋值给子组件中
      // this.getListPro()
    },
    // 组装
    currentChangeEvent({ row }) {
      this.currentrow = row;
    },
    //获取表格高度
    getDomHeight() {
      this.$nextTick(() => {
        let wrapH = this.$refs.paneLeft.offsetHeight;
        let planFormH = this.$refs.planForm.offsetHeight;
        let planBtnH = this.$refs.planBtn.offsetHeight;
        // let planPageH = this.$refs.planPage.offsetHeight;
        //获取左侧侧表格高度
        this.leftTableHeight = wrapH - 144;
        //获取右侧表格高度
        this.rightTableHeight = wrapH - planFormH - planBtnH - 38;
      });
    },
    getDataQuick(v) {
      (this.form.createTimeStart = v[0]), (this.form.createTimeEnd = v[1]);
      this.getList();
    },
    //更多按钮
    more() {
      this.advanced = true;
    },
    //左边列表选中当前行
    async selectTabelData(row) {
      this.flagValue1 = 0;
      if (this.flag === 1) {
        this.$Modal.confirm({
          title: "您正在编辑单据，是否需要保存",
          onOk: () => {
            this.baocun1();
            this.flagState = 0;
          },
          onCancel: () => {
            this.getList();
            this.flag = 0;
            this.flagState = 0;
          }
        });
        return;
      }
      this.buttonDisable = 0;
      this.dayinCureen = row;
      this.Leftcurrentrow = row;
      if (row.statuName == "待出库") {
        this.buttonDisable = 1;
      }
      if (row.statuName == "已出库") {
        this.buttonDisable = 2;
      }
      if (row.id == undefined) {
        row.id = "";
      }
      if (row.code != "") {
        this.flagValue = 1;
        // this.Leftcurrentrow.status.value = 1;
      } else {
        this.flagValue = 0;
      }
      if (row.statuName != "草稿") {
        this.flagValue1 = 1;
      } else {
        this.flagValue1 = 0;
      }
      if (row.id) {
        this.datadata = row;
        this.MainID = row.id;
        const params = {
          mainId: row.id
        };
        const res = await getListDetail(params);
        this.Leftcurrentrow.detailVOS = res.data;
      }
      if (row.status.value === 0) {
        this.buttonShow = false;
      }
      if (row.status.value === 1) {
        // this.tuneOut = false
      }
    },
    //打开添加配件模态框
    addMountings() {
      this.$refs.selectPartCom.init();
    },
    //分页
    changePage(p) {
      this.Left.page.num = p;
      this.getList();
    },
    changeSize(size) {
      this.Left.page.size = size;
      this.getList();
    },
    //表格编辑状态下被关闭的事件
    editClosedEvent() {},
    //footer计算
    addFooter() {},
    // 确定
    Determined() {
      this.$refs.naform.cancelTrim();
      this.form = {
        ...this.form,
        ...this.$refs.naform.getITPWE()
      };
      for (var i = 0; i < this.getArray.length; i++) {
        if (this.getArray[i].fullName == this.form.guestName) {
          this.form.guestId = this.getArray[i].id;
        }
      }
      this.advanced = false;
      this.getList();
      this.$refs.naform.reset();
    },
    ok() {},
    cancel() {},
    shanchu() {
      if (this.Leftcurrentrow.status.value !== 0) {
        this.$Message.info("只有草稿状态才能进行删除操作");
        return;
      }
      // 组装删除
      const seleList = this.$refs.xTable1.getSelectRecords();
      let arr = [];
      if (this.checkboxArr.length > 0) {
        let NoIdPartCode = this.checkboxArr.map(item => item.partCode);
        let NoRepeat = this.Leftcurrentrow.detailVOS.filter(
          item => !NoIdPartCode.includes(item.partCode)
        );
        setTimeout(() => {
          this.Leftcurrentrow.detailVOS = NoRepeat;
        }, 1000);

        seleList.map(item => {
          arr.push(item.id);
        });
        const params = {
          ids: arr,
          mainId: this.Leftcurrentrow.id
        };
        shanqu(params)
          .then(res => {
            // 导入成品, 并把成品覆盖掉当前配件组装信息list
            if (res.code == 0) {
              // this.Leftcurrentrow.detailVOS = this.array_diff(
              //   this.Leftcurrentrow.detailVOS,
              //   seleList
              // );
              this.$Message.success("删除成功");
            }
          })
          .catch(e => {
            this.$Message.info("删除成品失败");
          });
      } else {
        this.$Message.error("请选择要删除的配件!");
        return;
      }
    },
    //展示方
    showModel() {
      this.val = "0";
      this.$refs.selectSupplier.init();
    },
    showModel2(val) {
      this.val = val;
      this.$refs.selectSupplier.init();
    },
    showModel3(val) {
      this.val = val;
      this.$refs.selectSupplier.init();
    },
    // 供应商子组件内容
    getSupplierName(a) {
      this.formPlan.guestName = a.fullName;
      this.formPlan.guestidId = a.id;
    },
    //选择方
    selectSupplierName(row) {
      this.guestOrgid = row.isInternalId;
      if (this.val === "0") {
        this.showit = false;
        this.Leftcurrentrow.guestName = row.fullName;
        this.Leftcurrentrow.guestId = row.id;
        const tata = this;
        setTimeout(() => {
          tata.showit = true;
        }, 200);
      } else {
        this.diaochuName = row.fullName;
        this.diaochuID = row.id;
      }
    },
    // 仓库下拉框
    warehouse() {
      queryByOrgid().then(res => {
        if (res.code === 0) {
          this.cangkuListall = res.data;
          res.data.map(item => {
            if (item.isDefault === true) {
              this.Leftcurrentrow.storeId = item.id;
            }
          });
        }
      });
    },
    getOkList(list) {
      const item = {
        index: 1,
        xinzeng: "1",
        status: {
          enum: "DRAFT",
          name: "草稿",
          value: 0
        },
        statuName: "草稿",
        storeName: "",
        createTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        orderMan: this.$store.state.user.userData.staffName,
        remark: "",
        serviceId: list.serviceId,
        detailVOS: list.detailVOS
      };
      this.Left.tbdata.unshift(item);
      this.Left.tbdata.map((item, index) => {
        item.index = index + 1;
      });
      this.$refs.addInCom.init1();
    },
    getList() {
      let params = {
        statusVaule: this.form.status === "" ? 99 : this.form.status
      };
      params = { ...params, ...this.form };
      delete params.status;
      delete params.guestName;
      getList1(params, this.Left.page.size, this.Left.page.num)
        .then(res => {
          if (res.code == 0) {
            if (!res.data.content) {
              this.Left.tbdata = [];
              this.Left.page.total = 0;
            } else {
              res.data.content.map((item, index) => {
                item["index"] = index + 1;
                item["statuName"] = item.status.name;
              });
              this.Left.tbdata = res.data.content || [];
              this.Left.page.total = res.data.totalElements;
            }
          }
        })
        .catch(e => {
          this.$Message.info("获取配件组装列表失败");
        });
    },
    getListPro() {
      chengping()
        .then(res => {
          if (res.code == 0) {
            this.tbdata = res.data || [];
            this.page.total = res.totalElements;
          }
        })
        .catch(e => {
          this.$Message.info("获取成品列表失败");
        });
    },
    array_diff(a, b) {
      for (var i = 0; i < b.length; i++) {
        for (var j = 0; j < a.length; j++) {
          if (a[j].name === b[i].name) {
            a.splice(j, 1);
            j = j - 1;
          }
        }
      }
      return a;
    }
  },
  mounted() {
    setTimeout(() => {
      this.getDomHeight();
    }, 0);

    window.onresize = () => {
      this.getDomHeight();
    };
    this.warehouse();
  }
};
</script>

<style lang="less" scoped>
.ivu-tabs-bar {
  margin: 0;
}
.tabs-ulwarp {
  padding-top: 17px;
  border-bottom: solid 1px #ddd;
}
.tabs {
  list-style: none;
  display: flex;
  height: 100%;

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
  text-align: center;
  height: 40px;
  margin-top: 20px;
}
.con-box {
  height: 600px;
}
.w550 {
  width: 580px;
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

.goods-list-form {
  * {
    font-size: 12px !important;
  }
  .ivu-form-item {
    margin-bottom: 0px;
  }
  .plan-cz-btn {
    border-top: 1px solid #ddd;
    margin-top: 6px;
    justify-content: space-between;
    padding: 8px 10px 4px;
    align-items: center;
  }
  .t-price {
    white-space: nowrap;
  }
}
</style>
<style>
.it-box .ivu-tabs-nav-scroll {
  margin-left: 10px;
}
.it-box .ivu-tabs-bar {
  margin-bottom: 0;
}
.it-box .ivu-tabs-content.ivu-tabs-content-animated {
  height: 100%;
}
.redIT .ivu-form-item-label {
  color: red;
}
</style>
