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
              <quick-date
                class="mr10"
                v-on:quickDate="getDataQuick"
              ></quick-date>
              <Select
                v-model="form.status"
                @on-change="getDataType"
                class="w90 mr10"
              >
                <Option
                  v-for="item in purchaseTypeArr"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
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
                type="default"
                :disabled="this.remarkStatus"
                v-has="'save'"
                class="mr10"
                @click="baocun1"
              >
                <i class="iconfont mr5 iconbaocunicon"></i>保存
              </Button>
            </div>
            <div class="db">
              <Button
                class="mr10"
                :disabled="this.remarkStatus"
                v-has="'submit'"
                @click="tijiao1"
              >
                <Icon type="md-checkmark" size="14" />提交
              </Button>
            </div>
            <div class="db">
              <Button
                v-has="'delivery'"
                :disabled="Leftcurrentrow.statuName != '已受理'"
                class="mr10"
                @click="chuku"
              >
                <Icon type="md-checkmark" size="14" />出库
              </Button>
            </div>
            <div class="db">
              <Button
                :disabled="newFlag"
                v-has="'cancellation'"
                class="mr10"
                @click="zuofei1"
              >
                <Icon type="md-close" size="14" />作废
              </Button>
            </div>
            <div class="db">
              <Button
                v-has="'print'"
                :disabled="newFlag"
                class="mr10"
                @click="printTable"
              >
                <i class="iconfont mr5 icondayinicon"></i> 打印
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section class="con-box">
        <div class="inner-box">
          <div class="con-split" ref="paneLeft">
            <Split v-model="split1" min="200" @on-moving="getDomHeight">
              <div
                slot="left"
                class="con-split-pane-left"
                style="overflow-y: auto; height: 100%;"
              >
                <div class="pane-made-hd">退回申请列表</div>
                <Table
                  :height="leftTableHeight"
                  @on-current-change="selectTabelData"
                  size="small"
                  ref="xTable"
                  highlight-row
                  border
                  :stripe="true"
                  :columns="Left.columns"
                  :data="Left.tbdata"
                ></Table>
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
              <div
                slot="right"
                class="con-split-pane-right pl5 goods-list-form"
              >
                <div class="pane-made-hd">调入退回信息</div>
                <div v-if="showit" class="clearfix purchase" ref="planForm">
                  <Form
                    inline
                    :show-message="false"
                    ref="formPlan"
                    :label-width="120"
                  >
                    <FormItem label="调出方：" prop="supplyName" class="redIT">
                      <Row>
                        <Col span="22">
                          <!-- <Input
                            readonly
                            :disabled="Leftcurrentrow.status.value != 0"
                            v-model="Leftcurrentrow.guestName"
                            placeholder="请选择调出方"
                          ></Input>-->
                          <!-- <Select v-model="Leftcurrentrow.guestName" label-in-value filterable>
                            <Option v-for="item in ArrayValue" :value="item" :key="item">{{ item }}</Option>
                          </Select>-->
                          <Input
                            disabled
                            :value="Leftcurrentrow.guestName"
                            class="w160"
                          ></Input>
                        </Col>
                        <Col span="2">
                          <Button
                            disabled
                            @click="showModel"
                            class="ml5"
                            size="small"
                            type="default"
                          >
                            <i
                              class="iconfont iconxuanzetichengchengyuanicon"
                            ></i>
                          </Button>
                        </Col>
                      </Row>
                    </FormItem>
                    <FormItem
                      label="调出仓库："
                      prop="supplyName"
                      class="redIT"
                    >
                      <Row class="w160">
                        <Col span="24">
                          <Select
                            :disabled="this.remarkStatus"
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
                              :disabled="item.isDisabled"
                              :key="item.id"
                              >{{ item.name }}</Option
                            >
                          </Select>
                        </Col>
                      </Row>
                    </FormItem>
                    <FormItem
                      label="退回申请日期："
                      prop="billType"
                      class="redIT"
                    >
                      <DatePicker
                        :value="Leftcurrentrow.createTime"
                        disabled
                        format="yyyy-MM-dd HH:mm:ss"
                        type="date"
                        class="w160"
                      ></DatePicker>
                    </FormItem>
                    <FormItem label="备注：" prop="remark">
                      <Input
                        :disabled="this.remarkStatus"
                        v-model="Leftcurrentrow.remark"
                        class="w160"
                      ></Input>
                    </FormItem>
                    <FormItem label="申请人：" prop="planDate">
                      <Input
                        disabled
                        class="w160"
                        :value="Leftcurrentrow.createUname"
                      ></Input>
                    </FormItem>
                    <FormItem label="退回申请号：" prop="planOrderNum">
                      <Input disabled class="w160" :value="serviceId"></Input>
                    </FormItem>
                  </Form>
                </div>
                <div class="flex plan-cz-btn" ref="planBtn">
                  <div class="clearfix">
                    <div class="fl mb5">
                      <Button
                        :disabled="this.remarkStatus"
                        v-has="'addProoo'"
                        size="small"
                        class="mr10"
                        @click="addProoo"
                      >
                        <Icon type="md-add" />选择调拨入库单
                      </Button>
                    </div>
                    <div class="fl mb5">
                      <Button
                        :disabled="this.remarkStatus"
                        v-has="'delete'"
                        size="small"
                        class="mr10"
                        @click="shanchu"
                      >
                        <i class="iconfont mr5 iconlajitongicon"></i> 删除配件
                      </Button>
                    </div>
                  </div>
                </div>
                <vxe-table
                  v-if="showit"
                  border
                  resizable
                  ref="xTable1"
                  size="mini"
                  highlight-current-row
                  highlight-hover-row
                  @current-change="currentChangeEvent"
                  @select-all="selectAllEvent"
                  @select-change="selectChangeEvent"
                  :height="rightTableHeight"
                  :data="Leftcurrentrow.detailVOS"
                  :stripe="true"
                  :footer-method="addFooter"
                  :edit-config="
                    Leftcurrentrow.status.value === 0
                      ? { trigger: 'click', mode: 'cell' }
                      : {}
                  "
                >
                  <vxe-table-column
                    type="index"
                    width="60"
                    title="序号"
                  ></vxe-table-column>
                  <vxe-table-column
                    type="checkbox"
                    width="60"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="partCode"
                    title="配件编码"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="partName"
                    title="配件名称"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="partBrand"
                    title="品牌"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="applyQty"
                    :edit-render="{ name: 'input' }"
                    title="申请退回数量"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="remark"
                    :edit-render="{ name: 'input' }"
                    title="备注"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="carBrandName"
                    title="品牌车型"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="unit"
                    title="单位"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="oemCode"
                    title="OE码"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="spec"
                    title="规格"
                    width="100"
                  ></vxe-table-column>
                </vxe-table>
              </div>
            </Split>
          </div>
        </div>
      </section>
      <!--更多弹框-->
      <Modal v-model="advanced" title="高级查询" width="600px">
        <More
          ref="naform"
          @getName="showModel2"
          :dcName="diaochuName"
          :dcId="diaochuID"
        ></More>
        <div slot="footer">
          <Button type="primary" @click="Determined">确定</Button>
          <Button type="default" @click="advanced = false">取消</Button>
        </div>
      </Modal>
    </div>
    <!-- 选择调出方 -->
    <!--<select-supplier @selectSearchName="selectSupplierName" ref="selectSupplier" headerTit="调出方资料"></select-supplier>-->
    <select-supplier
      ref="selectSupplier"
      header-tit="调出方资料"
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
} from "../../../../api/AlotManagement/twoBackApply.js";

import { queryByOrgid } from "../../../../api/AlotManagement/transferringOrder";

export default {
  name: "twoBackApply",
  components: {
    More,
    QuickDate,
    AddInCom,
    SelectSupplier,
    PrintShow
  },
  data() {
    return {
      serviceId: "",
      newFlag: true,
      remarkStatus: true,
      flagStatus: false,
      flagValue: [],
      flag: 0,
      getArray: [],
      ArrayValue: [],
      dcData: [],
      showit: true,
      form: {
        status: "",
        qucikTime: ""
      },
      tabKey: "0",
      modal2: true,
      split1: 0.2,
      tabIndex: 0,
      curronly: false,
      purchaseType: "0", //查询选项
      purchaseTypeArr: [
        {
          label: "所有",
          value: ""
        },
        {
          label: "草稿",
          value: "ALLOT_DRAFT"
        },
        {
          label: "待出库",
          value: "ALLOT_WAIT_OUT"
        },
        {
          label: "已出库",
          value: "ALLOT_OUT_ALL"
        },
        {
          label: "已作废",
          value: "ALLOT_INVALID"
        },
        {
          label: "已受理",
          value: "ACCEPTED"
        },
        {
          label: "待受理",
          value: "UNACCEPTED"
        },
        {
          label: "已入库",
          value: "WAREHOUSING"
        },
        {
          label: "已拒绝",
          value: "REJECTED"
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
            title: "调出方",
            key: "guestName",
            minWidth: 120
          },
          {
            title: "创建日期",
            key: "createTime",
            minWidth: 140
          },
          {
            title: "创建人",
            key: "createUname",
            minWidth: 100
          },
          {
            title: "退回申请单号",
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
          value: 1
        },
        storeName: "",
        createTime: "",
        orderMan: "",
        createUname: "",
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
      diaochuID: ""
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
    this.getList(this.form);
    this.getArrayParams();
  },
  methods: {
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

    getDataType() {
      const params = {
        status: this.form.status
      };
      this.getList(params);
    },
    selectAllEvent({ checked }) {},
    selectChangeEvent({ checked, row }) {
      // console.log(checked ? "勾选事件" : "取消事件");
    },
    baocun1() {
      if (
        !this.Leftcurrentrow.storeId ||
        !this.Leftcurrentrow.createTime ||
        !this.Leftcurrentrow.guestName
      ) {
        this.$Message.error("调出仓库为必填项");
        return;
      }
      // if (!this.Leftcurrentrow.serviceId) {
      //   console.log(this.Leftcurrentrow)
      //   if (this.Leftcurrentrow.xinzeng === "1") {
      //   } else {
      //     this.$Message.error("请先选择加工单");
      //     return;
      //   }
      // }
      // if (this.Leftcurrentrow.status.value !== 0) {
      //   this.$Message.error("只有草稿状态才能进行保存操作");
      //   return;
      // }
      const params = JSON.parse(JSON.stringify(this.Leftcurrentrow));
      if (params.xinzeng) {
        delete params.status;
      }
      if (params.status) {
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
      // for (var i = 0; i < params.detailVOS.length; i++) {
      //   params.detailVOS[i].id = "";
      // }
      // if (this.flagValue == []) {
      //   params.detailVOS[i].id = "";
      // }

      //配件组装保存
      baocun(params)
        .then(res => {
          // 点击列表行==>配件组装信息
          if (res.code == 0) {
            this.getList(this.form);
            this.$Message.success("保存成功");
            this.flag = 0;
            this.Leftcurrentrow.guestName = "";
            this.Leftcurrentrow.storeId = "";
            this.Leftcurrentrow.createTime = "";
            this.Leftcurrentrow.remark = "";
            this.Leftcurrentrow.serviceId = "";
            this.Leftcurrentrow.orderMan = "";
            this.Leftcurrentrow.detailVOS = [];
          }
        })
        .catch(e => {
          this.$Message.error("保存配件组装信息失败");
        });
    },
    xinzeng() {
      this.newFlag = true;
      this.serviceId = "";
      this.Leftcurrentrow = {
        status: {
          value: 1,
          name: ""
        },
        storeName: "",
        createTime: "",
        orderMan: "",
        createUname: "",
        remark: "",
        serviceId: "",
        detailVOS: [],
        xinzeng: "1"
      };
      // console.log(this.$store);
      if (this.Left.tbdata.length === 0) {
      } else {
        if (this.Left.tbdata[0]["xinzeng"] === "1") {
          this.$Message.error("请先保存数据");
          return;
        }
      }
      this.flag = 1;
      this.remarkStatus = false;
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
        serviceId: "",
        detailVOS: [],
        new: true,
        _highlight: true
      };
      this.Leftcurrentrow.guestName = "";
      this.Leftcurrentrow.createUname = "";
      this.Leftcurrentrow.remark = "";
      this.Leftcurrentrow.serviceId = "";
      this.Leftcurrentrow.createTime = "";
      this.Leftcurrentrow.storeId = "";
      this.Leftcurrentrow.detailVOS = [];
      this.Left.tbdata.unshift(item);
      this.Leftcurrentrow.status.value = 0;
      this.Left.tbdata.map((item, index) => {
        item.index = index + 1;
      });
    },
    // 仓库下拉框
    warehouse() {
      queryByOrgid().then(res => {
        if (res.code === 0) {
          this.cangkuListall = res.data;
        }
      });
    },
    tijiao1() {
      if (this.Leftcurrentrow.xinzeng === "1") {
        this.$Message.error("请先保存新增加工单");
        return;
      }
      if (!this.Leftcurrentrow.serviceId) {
        this.$Message.error("请先选择保存申请单");
        return;
      }
      if (this.Leftcurrentrow.status.value === 1) {
        this.$Message.error("当前申请单已提交审核!无需重复操作");
        return;
      }
      const params = JSON.parse(JSON.stringify(this.Leftcurrentrow));
      params.status = params.status.value;
      params.settleStatus = params.settleStatus.value;
      params["orderTypeId"] = "3";
      tijiao(params)
        .then(res => {
          // 点击列表行==>配件组装信息
          if (res.code == 0) {
            this.getList(this.form);
            this.$Message.success("提交成功");
          }
        })
        .catch(e => {
          this.$Message.error("提交失败");
        });
    },
    zuofei1() {
      this.$Modal.confirm({
        title: "是否确定作废订单!",
        onOk: () => {
          if (this.Leftcurrentrow.xinzeng === "1") {
            this.$Message.error("请先保存新增加工单");
            return;
          }
          if (!this.Leftcurrentrow.serviceId) {
            this.$Message.error("请先选择加工单");
            return;
          }
          if (this.Leftcurrentrow.status.value !== 0) {
            this.$Message.error("只有草稿状态的单据才能进行作废操作");
            return;
          }
          const params = {
            id: this.Leftcurrentrow.id
          };
          // 配件组装作废
          zuofei(params)
            .then(res => {
              // 点击列表行==>配件组装信息
              if (res.code == 0) {
                this.getList(this.form);
                this.$Message.success("作废成功");
              }
            })
            .catch(e => {
              this.$Message.error("作废失败");
            });
        },
        onCancel: () => {
          this.getList(this.form);
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
      // if (!this.Leftcurrentrow.serviceId) {
      //   if (this.Leftcurrentrow.xinzeng) {
      //   } else {
      //     this.$Message.error("请先选择申请单");
      //     return;
      //   }
      // }
      // if (this.Leftcurrentrow.status.value !== 0) {
      //   this.$Message.error("只有草稿状态申请单能进行添加操作");
      //   return;
      // }
      const params = {
        mainId: this.Leftcurrentrow.id,
        status: "HAS_ENTER"
      };
      this.$refs.addInCom.init();
      chengping(params, 10, 1)
        .then(res => {
          // 导入成品, 并把成品覆盖掉当前配件组装信息list
          if (res.code == 0) {
            this.tableData1 = res.data.content;
          }
        })
        .catch(e => {
          this.$Message.error("数据加载失败");
        });
      // 获取成品列表把data赋值给子组件中
      // this.getListPro()
    },
    //打印表格
    printTable() {
      if (!this.dayinCureen.id) {
        this.$Message.error("请选择打印项");
        return;
      }
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
            this.getList(this.form);
            this.$Message.success("出库成功");
          }
        })
        .catch(e => {
          this.$Message.error("出库失败");
        });
    },
    searchPro(params, size, page) {
      chengping({ ...params }, size, page).then(res => {
        // 导入成品, 并把成品覆盖掉当前配件组装信息list
        if (res.code == 0) {
          this.tableData1 = res.data.content;
        }
      });
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
    //快速查询日期
    getDataQuick(v) {
      const params = {
        createTimeStart: v[0],
        createTimeEnd: v[1]
      };
      this.getList(params);
    },
    //更多按钮
    more() {
      this.advanced = true;
    },
    //左边列表选中当前行
    async selectTabelData(row) {
      if (row.id) {
        this.newFlag = false;
      }
      if (row.status.name != "草稿") {
        this.remarkStatus = true;
      } else {
        this.remarkStatus = false;
      }
      if (row.status.name != "已受理") {
        this.flagStatus = true;
      } else {
        this.flagStatus = false;
      }
      if (row.createUname == undefined || row.createUname == "") {
      } else {
        if (this.flag == 1) {
          this.$Modal.confirm({
            title: "您正在编辑单据，是否需要保存",
            onOk: () => {
              this.baocun1();
            },
            onCancel: () => {
              this.getList(this.form);
              this.flag = 0;
            }
          });
          return;
        }
      }
      this.dayinCureen = row;
      this.Leftcurrentrow = row;
      this.serviceId = this.Leftcurrentrow.serviceId;
      const params = {
        mainId: row.id
      };
      let res = {};
      if (this.Leftcurrentrow.xinzeng != 1) {
        res = await getListDetail(params);
      }
      this.flagValue = res.data;
      this.showit = false;
      this.Leftcurrentrow.detailVOS = res.data;
      const that = this;
      setTimeout(() => {
        that.showit = true;
      }, 100);

      cangkulist2(this.$store.state.user.userData.groupId)
        .then(res => {
          if (res.code == 0) {
            res.data.map(item => {
              item["label"] = item.name;
              item["value"] = item.id;
            });
            // this.cangkuListall = res.data
            this.dcData = res.data;
          }
        })
        .catch(e => {
          this.$Message.error("获取仓库列表失败");
        });
    },
    //分页
    changePage(p) {
      this.Left.page.num = p;
      this.getList(this.form);
    },
    changeSize(size) {
      this.Left.page.size = size;
      this.getList(this.form);
    },
    //表格编辑状态下被关闭的事件
    editClosedEvent() {},
    //footer计算
    addFooter() {},
    // 确定
    Determined() {
      const params = { ...this.form, ...this.$refs.naform.getITPWE() };
      this.getList(params);
      this.$refs.naform.reset();
      this.advanced = false;
    },
    ok() {},
    cancel() {},
    shanchu() {
      var idArr = [];

      if (this.Leftcurrentrow.status.value !== 0) {
        this.$Message.error("只有草稿状态才能进行删除操作");
        return;
      }
      // 组装删除
      const seleList = this.$refs.xTable1.getCheckboxRecords();
      seleList.forEach(el => (el.oid = el.id));
      // this.Leftcurrentrow.detailVOS = this.array_diff(
      //   this.Leftcurrentrow.detailVOS,
      //   seleList
      // );
      // const idValue = seleList[0].id;
      idArr = seleList;
      let idArr1 = [];
      let idArr2 = [];
      idArr.forEach(el => {
        if (el.id) {
          idArr1.push(el.id);
        } else {
          idArr2.push(el);
        }
      });
      if (idArr1.length > 0) {
        shanqu({ ids: idArr1 })
          .then(res => {
            // 导入成品, 并把成品覆盖掉当前配件组装信息list
            if (res.code == 0) {
              idArr1.forEach(el => {
                this.Leftcurrentrow.detailVOS.forEach((el2, index) => {
                  if (el2.id == el) {
                    this.Leftcurrentrow.detailVOS.splice(index, 1);
                  }
                });
              });
              this.$Message.success("删除成功");
              // this.getList();
            }
          })
          .catch(e => {
            this.$Message.error("删除成品失败");
          });
      }
      if (idArr2.length > 0) {
        idArr2.forEach(el => {
          this.Leftcurrentrow.detailVOS.forEach((el2, index) => {
            if (el2.partName == el.partName) {
              this.Leftcurrentrow.detailVOS.splice(index, 1);
            }
          });
        });
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
    //选择方
    selectSupplierName(row) {
      if (this.val === "0") {
        this.showit = false;
        this.Leftcurrentrow.guestName = row.id;
        this.Leftcurrentrow.guestId = row.id;
        const tata = this;
        setTimeout(() => {
          tata.showit = true;
        }, 200);
      } else {
        this.diaochuName = row.id;
        this.diaochuID = row.id;
      }
    },
    getOkList(list, rowValue) {
      this.showit = false;
      this.Leftcurrentrow.detailVOS = [];
      for (var i = 0; i < list.length; i++) {
        list[i].oid = list[i].id;
        list[i].id = "";
        this.Leftcurrentrow.detailVOS.push(list[i]);
      }
      // var result = [];
      // var obj = {};
      // for (var i = 0; i < this.Leftcurrentrow.detailVOS.length; i++) {
      //   if (!obj[this.Leftcurrentrow.detailVOS[i].partCode]) {
      //     result.push(this.Leftcurrentrow.detailVOS[i]);
      //     obj[this.Leftcurrentrow.detailVOS[i].partCode] = true;
      //   }
      // }
      // this.Leftcurrentrow.detailVOS = result;
      this.Leftcurrentrow.remark = list[0].remark;

      this.Leftcurrentrow.guestName = rowValue.guestName;
      this.Leftcurrentrow.createUname = rowValue.commitUname;
      this.Leftcurrentrow.remark = rowValue.remark;
      this.Leftcurrentrow.serviceId = rowValue.serviceId;
      this.Leftcurrentrow.guestId = rowValue.guestId;
      this.Leftcurrentrow.guestOrgid = rowValue.guestOrgid;
      this.Leftcurrentrow.createTime = moment(new Date()).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const tata = this;
      setTimeout(() => {
        tata.showit = true;
      }, 200);
      this.$refs.addInCom.init1();
    },
    getList(params) {
      if (params.qucikTime) {
        (params.createTime = params.qucikTime[0]),
          (params.endTime = params.qucikTime[1]);
        delete params.qucikTime;
      } else {
        delete params.qucikTime;
      }
      var array = [];
      var allArr = []; //新数组
      getList1(params, this.Left.page.size, this.Left.page.num)
        .then(res => {
          if (res.code == 0) {
            for (var i = 0; i < res.data.content.length; i++) {
              array.push(res.data.content[i].status);
            }
            var result = [];
            var obj = {};
            for (var i = 0; i < array.length; i++) {
              if (!obj[array[i].name]) {
                result.push(array[i]);
                obj[array[i].name] = true;
              }
            }
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
          this.$Message.error("获取配件组装列表失败");
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
          this.$Message.error("获取成品列表失败");
        });
    },
    array_diff(a, b) {
      for (var i = 0; i < b.length; i++) {
        for (var j = 0; j < a.length; j++) {
          if (a[j].oid === b[i].oid) {
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
