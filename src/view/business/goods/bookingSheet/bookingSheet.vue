<template>
  <div class="content-oper content-oper-flex loadingClass">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>
            <Select
              v-model="purchaseType"
              class="w90 mr10"
              @on-change="SelectChange"
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
            <Button type="default" @click="moreaa" class="mr10"
              ><i class="iconfont mr5 iconchaxunicon"></i>更多</Button
            >
          </div>
          <div class="db">
            <Button class="mr10" @click="addProoo" v-has="'add'"
              ><Icon type="md-add" /> 新增</Button
            >
          </div>
          <div class="db">
            <Button
              type="default"
              @click="SaveMsg"
              v-has="'save'"
              class="mr10"
              :disabled="buttonDisable || presentrowMsg !== 0"
              :loading='saveLoading'
              ><i class="iconfont mr5 iconbaocunicon"></i>保存</Button
            >
          </div>
          <div class="db">
            <Button
              class="mr10"
              @click="instance"
              v-has="'submit'"
              :loading='commitLoading'
              :disabled="buttonDisable || presentrowMsg !== 0"
              ><i class="iconfont mr5 iconziyuan2"></i>提交</Button
            >
          </div>
          <div class="db">
            <Button
              @click="cancellation"
              v-has="'cancellation'"
              class="mr10"
              :disabled="buttonDisable || presentrowMsg !== 0"
              :loading="cancelLoading"
              ><Icon type="md-close" size="14" /> 作废</Button
            >
          </div>
          <div class="db">
            <Button @click="derive" v-has="'export'" class="mr10"
              ><i class="iconfont mr5 icondayinicon"></i> 导出</Button
            >
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <div class="con-split" ref="paneLeft">
          <Split v-model="split1" min="200" max="500">
            <div slot="left" class="con-split-pane-left">
              <div class="pane-made-hd">
                预订单列表
              </div>
              <Table
                ref="currentRowTable"
                :height="leftTableHeight"
                @on-current-change="selectTabelData"
                size="small"
                highlight-row
                border
                :stripe="false"
                :columns="Left.columns"
                :data="Left.tbdata"
                @on-row-click="selection"
              ></Table>
              <Page
                :page-size-opts="[20, 50, 100, 200]"
                class-name="fl pt10"
                size="small"
                :current="Left.page.num"
                :total="Left.page.total"
                :page-size="Left.page.size"
                @on-change="changePageLeft"
                @on-page-size-change="changeSizeLeft"
                show-sizer
                show-total
              >
              </Page>
            </div>
            <div slot="right" class="con-split-pane-right pl5 goods-list-form">
              <div class="pane-made-hd">
                预订单信息
              </div>
              <div class="clearfix purchase" ref="planForm">
                <Form
                  inline
                  :model="formPlan"
                  :show-message="false"
                  ref="formPlan"
                  :rules="ruleValidate"
                  :label-width="100"
                >
                  <FormItem label="业务员：" prop="salesman">
                    <Input
                      class="w160"
                      :disabled="true"
                      v-model="formPlan.salesman"
                    ></Input>
                  </FormItem>
                  <FormItem label="预订单号:" prop="Reservation" class="ml50">
                    <Tooltip :content="formPlan.Reservation">
                    <Input
                      class="w160"
                      :disabled="true"
                      v-model="formPlan.Reservation"
                    />
                    </Tooltip>
                  </FormItem>
                  <FormItem
                    label="期望到货日期："
                    prop="orderDate"
                    class="fs12 ml50"
                  >
                    <DatePicker
                      @on-change="changedate"
                      style="width: 160px"
                      type="date"
                      placeholder="请选择期望到货日期"
                      v-model="formPlan.orderDate"
                      :disabled="presentrowMsg !== 0 || buttonDisable"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="备注：" prop="remark">
                    <Tooltip :content="formPlan.remark">
                    <Input
                      class="w160"
                      :disabled="presentrowMsg !== 0 || buttonDisable"
                      v-model="formPlan.remark"
                      :maxlength="100"
                    ></Input>
                    </Tooltip>
                  </FormItem>
                </Form>
              </div>
              <div class="flex plan-cz-btn" ref="planBtn">
                <div class="clearfix">
                  <div class="fl mb5">
                    <Button
                      size="small"
                      class="mr10"
                      @click="addPro"
                      v-has="'AddAccessories'"
                      :disabled="presentrowMsg !== 0 || buttonDisable"
                      ><Icon type="md-add" /> 添加配件</Button
                    >
                  </div>
                  <div class="fl mb5">
                    <Button
                      size="small"
                      class="mr10"
                      :disabled="presentrowMsg !== 0 || buttonDisable"
                      @click="Delete"
                      v-has="'deletePart'"
                      ><i class="iconfont mr5 iconlajitongicon"></i>
                      删除配件</Button
                    >
                  </div>
                  <div class="fl mb5">
                    <Poptip placement="bottom">
                      <Button class="mr10" size="small" :disabled="LeadIn || presentrowMsg !== 0" v-has="'import'">导入</Button>
                      <div slot="content" class="flex" style="justify-content: space-between">
                        <div class="flex mr10">
                          <Upload
                            ref="upload1"
                            :show-upload-list="false"
                            :action="upurlInnerId"
                            :format="['xlsx', 'xls', 'csv']"
                            :headers="headers"
                            :before-upload="beforeUploadInnerId"
                            :on-success="onSuccess"
                            :on-format-error="onFormatError"
                          >
                            <Button
                              size="small"
                              @click="getRULInnerId"
                            >配件内码导入</Button>
                          </Upload>
                        </div>
                        <div class="flex">
                          <Upload
                            ref="upload"
                            style="display: inline-block"
                            :show-upload-list="false"
                            :action="upurl"
                            :headers="headers"
                            :format="['xlsx', 'xls']"
                            :on-format-error="onFormatError"
                            :on-success="onSuccess"
                            :before-upload="beforeUpload"
                          >
                            <Button
                              size="small"
                              class="mr10"
                              @click="getRUl"
                            ><i class="iconfont mr5 iconbianjixiugaiicon"></i
                            >编码品牌导入</Button
                            >
                          </Upload>
                        </div>
                      </div>
                    </Poptip>
                  </div>
                  <div class="fl mb5">
                    <Poptip placement="bottom">
                      <Button size="small" :disabled="presentrowMsg !== 0 || buttonDisable">
                        <Icon custom="iconfont iconxiazaiicon icons" />下载模板
                      </Button>
                      <div slot="content">
                        <Button size="small" class="mr10" @click="downInnerId" :disabled="presentrowMsg !== 0 || buttonDisable"><Icon custom="iconfont iconxiazaiicon icons" />配件内码模板</Button>
                        <Button
                          size="small"
                          @click="down"
                          v-has="'download'"
                          :disabled="presentrowMsg !== 0 || buttonDisable"
                        >
                          <Icon custom="iconfont iconxiazaiicon icons" />编码品牌模板
                        </Button>
                      </div>
                    </Poptip>
                  </div>
                </div>
              </div>
              <vxe-table
                ref="xTable"
                border
                resizable
                show-footer
                @select-change="selectChange"
                @edit-closed="editClosedEvent"
                @select-all="selectAll"
                :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true}"
                @keydown="keydown"
                size="mini"
                :edit-rules="validRules"
                :height="rightTableHeight"
                :data="Right.tbdata"
                :footer-method="addFooter"
                showOverflow="true"
                @edit-actived="editActivedEvent"
                :edit-config="{ trigger: 'click', mode: 'cell' }"
              >
                <vxe-table-column show-overflow="tooltip" type="seq" title="序号"></vxe-table-column>
                <vxe-table-column show-overflow="tooltip" type="checkbox"></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="partCode"
                  title="配件编码"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="partName"
                  title="配件名称"
                  width="150"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                                  field="partInnerId"
                                  title="配件内码"
                                  width="150"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="partBrand"
                  title="品牌"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="unit"
                  title="单位"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="preQty"
                  title="预定数量"
                  :edit-render="{ name: 'input',autoselect: true, attrs: { disabled: false } }"
                  width="100"
                >
                </vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="remark"
                  title="备注"
                  :edit-render="{
                    name: 'input',
                    attrs: { disabled: presentrowMsg !== 0 },
                    maxlength: 100
                  }"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="acceptQty"
                  title="受理数量"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="oemCode"
                  title="OE码"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="spec"
                  title="规格"
                  width="100"
                ></vxe-table-column>
                <!--<vxe-table-column show-overflow="tooltip" field="direction" title="方向" width="100"></vxe-table-column>-->
              </vxe-table>
              <div ref="planPage"></div>
            </div>
          </Split>
        </div>
      </div>
    </section>
    <!--更多弹框-->
    <More @sendMsg="getMsg" ref="moremore"></More>
    <!--选择配件-->
    <Select-part-com
      ref="SelectPartCom"
      @selectPartName="getPartNameList"
      @selectPartName2="getPartNameList2"
      :is-show-add-part-btn="true"
      @isShow="false"
    ></Select-part-com>
    <!--编辑收货信息-->
    <goods-info ref="goodsInfo" :mainId="mainId"></goods-info>
    <!--供应商资料-->
    <select-supplier
      ref="selectSupplier"
      header-tit="供应商资料"
      @selectSupplierName="getSupplierName"
    ></select-supplier>
  </div>
</template>

<script>
import * as tools from "../../../../utils/tools";

import QuickDate from "../../../../components/getDate/dateget";
import More from "./compontents/More";
import SelectPartCom from "../../../goods/goodsList/components/selectPartCom";
import GoodsInfo from "../../../../view/goods/plannedPurchaseOrder/components/GoodsInfo";
import SelectSupplier from "../../../goods/goodsList/components/supplier/selectSupplier";
import {down } from "@/api/system/essentialData/commoditiesInShortSupply.js"
import "../../../lease/product/lease.less";
import "../../../goods/goodsList/goodsList.less";
// import supplier from './compontents/supplier'
import Cookies from "js-cookie";
import { hideLoading, showLoading } from "@/utils/loading";

import {
  optGroup,
  deleteit,
  save,
  commitOrder,
  invalid,
  getup,//编码品牌导入配件
  getupInnerId//内码导入配件
} from "../../../../api/business/advanceOrder";
import { TOKEN_KEY } from "@/libs/util";
import baseUrl from "_conf/url";
export default {
  name: "bookingSheet",
  components: {
    QuickDate,
    More,
    // supplier,
    SelectPartCom,
    GoodsInfo,
    SelectSupplier,
  },
  data() {
    let changeNumber = ({ cellValue }) => {
      const reg = /^[1-9]\d{0,}$/;
      if (!reg.test(cellValue)) {
        return Promise.reject(new Error("数量输入不正确"));
      }
    };
    return {
      //校验输入框的值
      validRules: {
        preQty: [{ required: true, validator: changeNumber }]
      },
      LeadIn: true, //判断导入配件的按钮是否启用
      checkboxArr: [], // checkbox选中
      disSave: false, // 保存按钮是否禁用
      PTrow: {
        //新增当前行
        new: true,
        _highlight: true,
        status: { name: "草稿", value: 0 },
        guestName: "",
        createUname: "",
        serviceId: "",
        orderMan: "",
        orderDate: "",
        printing: "",
        createTime: tools.transTime(new Date()),
        detailVOS: []
      },
      //表单验证
      ruleValidate: {
        salesman: [
          { required: true, message: "调出方不能为空", trigger: "blur" }
        ]
      },
      datadata: null,
      rowId: "", //当前行的id
      buttonDisable: true,
      buttonDisableTwo: true,
      split1: 0.2,
      purchaseType: "99",
      purchaseTypeArr: [
        { label: "所有", value: "99" },
        { label: "草稿", value: "0" },
        { label: "待受理", value: "1" },
        { label: "已受理", value: "3" },
        { label: "已作废", value: "5" }
      ],
      List: [],
      Left: {
        page: {
          num: 1,
          size: 20,
          total: 0
        },
        loading: false,
        columns: [
          {
            title: "序号",
            width: 50,
            type: "index",
            resizable:true
          },
          {
            title: "状态",
            key: "status",
            width: 70,
            resizable:true,
            render: (h, params) => {
              let name = params.row.status.name;
              return h("span", name);
            }
          },
          {
            title: "公司",
            key: "company",
            width: 80,
            resizable:true
          },
          {
            title: "创建日期",
            key: "createTime",
            width: 120,
            resizable:true
          },
          {
            title: "业务员",
            key: "salesman",
            width: 100,
            resizable:true
          },
          {
            title: "预定单号",
            key: "orderNo",
            width: 120,
            resizable:true
          },
          {
            title: "提交人",
            key: "commitUname",
            width: 100,
            resizable:true
          },
          {
            title: "提交日期",
            align: "center",
            key: "commitTime",
            width: 170,
            resizable:true
          }
        ],
        tbdata: []
      },
      tableData: [],
      //左侧表格高度
      leftTableHeight: 0,
      //右侧表格高度
      rightTableHeight: 0,
      Right: {
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        loading: false,
        tbdata: []
      },
      advanced: false, //更多模块的弹框
      GainInformation: false, //编辑收获信息
      rowData: "", //声明一个数据，用于赋值右边内容
      selectArr: [], //快速查询的数组 用于赋值,
      moreArr: {},
      presentrowMsg: 0,
      guestidId: "", //给后台传值保存调出方的id
      isAdd: true, //判断是否能新增
      formPlan: {
        salesman: "", //业务员
        Reservation: "", //预订单号
        orderDate: tools.transTime(new Date()), //期望到货日期
        remark: "" //备注
      },
      headers: {
        Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
      }, //请求头
      upurl: getup, //编码品牌导入地址
      upurlInnerId:getupInnerId,//内码导入配件地址
      mainId: null, //选中行的id
      clickdelivery: false,
      Flaga: false,
      successNOid: false,
      successHaveId: false,
      selectLeftItemId: "",
      saveLoading: false,
      commitLoading: false,
      cancelLoading: false,
    };
  },
  methods: {

    //------------------------------------------------------------------------//
    //表格tab切换可编辑部位
    async editNextCell($table) {
      // @ts-ignore
      const { row, column, $rowIndex, $columnIndex, columnIndex, rowIndex } =
        (await $table.getActiveRecord()) || {};
      if (row) {
        // 当前为编辑状态
        // console.log('row', row)
        // 当前列属性
        const nowField = column.property;
        // 获取展示的列
        const { visibleColumn } = $table.getTableColumn();
        // 当前列属性（可以编辑的属性）
        const columnsField = visibleColumn.reduce((a, v, i) => {
          if (i !== 0 && i !== visibleColumn.length - 1 && v.editRender) {
            // 不是操作和序号且不可以编辑
            a.push(v.property);
          }
          return a;
        }, []);
        const nowIndex = columnsField.findIndex((v) => v === nowField);
        // 判断当前是否是可编辑倒数地二行
        const isLastColumn = nowIndex === columnsField.length - 2;
        // console.log('isLastColumn', isLastColumn)
        if (isLastColumn) {
          // 插入数据

          // 跳转到下一行
          // 判断当前是否为临时数据
          const isInsertByRow = $table.isInsertByRow(row);
          const ROW_INDEX = isInsertByRow
            ? await $table.$getRowIndex(row)
            : rowIndex;
          const insertRecords = $table.getInsertRecords(); // 临时数据
          let nextRow = {};
          // 不是最后一条临时数据
          if (isInsertByRow && insertRecords.length - 1 !== ROW_INDEX) {
            nextRow = $table.getInsertRecords()[ROW_INDEX + 1];
          } else {
            // 当前是最后一条临时数据
            if (isInsertByRow) {
              nextRow = $table.getData()[0];
            } else {
              nextRow = $table.getData()[ROW_INDEX + 1];
            }
          }
          if (nextRow) {
            await $table.scrollTo(0);
            await $table.setActiveCell(nextRow, columnsField[0]);
          }
        } else {
          // 跳转下一个编辑
          await $table.setActiveCell(row, columnsField[nowIndex + 1]);
        }
      }
    },

    keydown($event) {
      if ($event.$event.keyCode == 9) {
        this.editNextCell($event.$table);
      }
    },
    //改变日期
    changedate(a) {
      this.formPlan.orderDate = a;
    },
    //删除配件
    Delete() {
      if (this.checkboxArr.length > 0) {
        var result = this.checkboxArr.every((item) => item.id);
        var resultTwo = this.checkboxArr.some((item) => item.id);
        if (result) {
          let dataaa = this.checkboxArr.map((item) => {
            return {
              id: item.id,
            };
          });
          deleteit(dataaa).then((res) => {
            if (res.code === 0) {
              this.$message.warning("删除成功！");
              this.leftgetList();
              let checkBoxArr = this.checkboxArr.map((item) => item.id);
              this.Right.tbdata = this.Right.tbdata.filter(
                (item) => !checkBoxArr.includes(item.id)
              );
              this.checkboxArr = [];
            }
          });
        } else if (resultTwo) {
          let haveId = this.checkboxArr.filter((item) => item.id);
          let NoId = this.checkboxArr.filter((item) => !item.id);
          let NoIdPartCode = NoId.map((item) => item.partCode);
          let AddNoId = this.Right.tbdata.filter((item) => !item.id);
          let NoRepeat = AddNoId.filter(
            (item) => !NoIdPartCode.includes(item.partCode)
          );
          //console.log(NoRepeat)
          //  let dataOne = {}
          //  dataOne.id = this.rowId
          // dataOne.salesman =  this.formPlan.salesman
          // dataOne.orderNo =  this.formPlan.Reservation
          // dataOne.expectedArrivalDate = tools.transDate(this.formPlan.orderDate)
          // dataOne.remark = this.formPlan.remark
          // dataOne.detailVOList = NoRepeat
          // save(dataOne).then(res => {
          //   if(res.code == 0){
          //     this.successNOid = true
          //   }
          // })

          let dataTwo = haveId.map((item) => {
            return {
              id: item.id,
            };
          });
          deleteit(dataTwo).then((res) => {
            if (res.code == 0) {
              this.successHaveId = true;
            }
          });
          setTimeout(() => {
            this.$nextTick(() => {
              // if(this.successNOid && this.successHaveId){
              if (this.successHaveId) {
                this.$message.success("删除成功！");
                let checkBoxArr = this.checkboxArr.map((item) => item.id);
                this.Right.tbdata = this.Right.tbdata.filter(
                  (item) => !checkBoxArr.includes(item.id)
                );
                this.checkboxArr = [];
              }
            });
          }, 1000);
        } else {
          // var set = this.checkboxArr.map(item => item.partCode)
          // var resArr = this.Right.tbdata.filter(item => !set.includes(item.partCode))
          // let data = {}
          // data.id = this.rowId
          // data.salesman =  this.formPlan.salesman
          // data.orderNo =  this.formPlan.Reservation
          // data.expectedArrivalDate = tools.transDate(this.formPlan.orderDate)
          // data.remark = this.formPlan.remark
          // data.detailVOList = resArr
          // save(data).then(res => {
          //   if (res.code === 0) {
          //     this.$message.success('删除成功！')
          //     let checkBoxArr = this.checkboxArr.map(item => item.partCode)
          //     this.Right.tbdata  = this.Right.tbdata.filter(item => !checkBoxArr.includes(item.partCode))
          //   }
          // })
          let checkBoxArr = this.checkboxArr.map((item) => item.partCode);
          this.Right.tbdata = this.Right.tbdata.filter(
            (item) => !checkBoxArr.includes(item.partCode)
          );
          this.$Message.warning("删除成功！");
        }
      } else {
        this.$Message.warning("请选择要删除的配件!");
      }
    },
    //更多按钮
    moreaa() {
      this.$refs.moremore.init();
    },
    //判断表格能不能编辑
    editActivedEvent({ row }) {
      let xTable = this.$refs.xTable;
      let orderQtyColumn = xTable.getColumnByField("preQty");
      let remarkColumn = xTable.getColumnByField("remark");
      let isDisabled = this.presentrowMsg !== 0;
      orderQtyColumn.editRender.attrs.disabled = isDisabled;
      remarkColumn.editRender.attrs.disabled = isDisabled;
    },
    // 新增按钮
    addProoo() {
      this.buttonDisable = false;
      this.presentrowMsg = 0;
      this.rowId = "";
      for (let b of this.Left.tbdata) {
        b._highlight = false;
      }
      if (!this.isAdd) {
        return this.$Message.error("请先保存数据");
      }
      this.Left.tbdata.unshift(this.PTrow);
      this.isAdd = false;
      this.datadata = this.PTrow;
      this.formPlan.salesman = this.$store.state.user.userData.staffName;
      (this.formPlan.Reservation = ""), //预订单号
        (this.formPlan.orderDate = tools.transTime(new Date())), //期望到货日期
        (this.formPlan.remark = ""); //备注
      this.Right.tbdata = [];
    },
    //添加配件按钮
    addPro() {
      this.$refs.SelectPartCom.init();
    },
    //下载模板 编码品牌导入模板
    down() {
      location.href =
        baseUrl.omsOrder +
        "/preOrderMain/template?access_token=" +
        Cookies.get(TOKEN_KEY);
    },
    //下载模板 内码导入配件模板
    downInnerId(){
      down("3100000000")
    },
    // 下拉框查询
    SelectChange() {
      this.leftgetList();
    },
    selectTabelData() {},
    //保存按钮
    SaveMsg() {
      let zero = tools.isZero(this.tableData, { qty: "preQty" });
      if (zero) return;
      this.$refs.formPlan.validate(async (valid) => {
        if (valid) {
          // console.log(this.rowId)
          try {
            await this.$refs.xTable.validate();
            let data = {};
            data.id = this.rowId;
            data.salesman = this.formPlan.salesman;
            data.orderNo = this.formPlan.Reservation;
            data.expectedArrivalDate = tools.transDate(this.formPlan.orderDate);
            data.remark = this.formPlan.remark;
            data.detailVOList = this.Right.tbdata;
            this.saveLoading = true;
            save(data).then((res) => {
              if (res.code === 0) {
                this.$message.success("保存成功！");
                this.leftgetList();
                (this.formPlan.salesman = ""), //业务员
                  (this.formPlan.Reservation = ""),
                  (this.formPlan.remark = ""),
                  (this.Right.tbdata = []);
                this.isAdd = true;
                this.Flaga = true;
              }
              this.saveLoading = false;
            }).catch(e => {
              this.saveLoading = false;
            });
          } catch (errMap) {
            this.$XModal.message({
              status: "error",
              message: "申请数量必须输入大于0的正整数！",
            });
            this.saveLoading = false;
          }
        } else {
          this.$Message.error("*为必填！");
        }
      });
    },
    //checkbox全选
    selectAll(a) {
      this.checkboxArr = a.selection;
      // console.log(this.checkboxArr)
    },
    //作废
    cancellation() {
      this.$refs.formPlan.validate((valid) => {
        if (valid) {
          this.$Modal.confirm({
            title: "是否作废",
            onOk: async () => {
              this.$refs.formPlan.validate((valid) => {
                if (valid) {
                  let params = {};
                  params.id = this.rowId;
                  this.cancelLoading = true;
                  invalid(params).then((res) => {
                    if (res.code === 0) {
                      this.$message.success("作废成功！");
                      this.leftgetList(),
                        (this.formPlan.salesman = ""), //业务员
                        (this.formPlan.Reservation = ""),
                        (this.formPlan.remark = ""),
                        (this.Right.tbdata = []);
                    }
                    this.cancelLoading = false;
                  }).catch(e => {
                    this.cancelLoading = false;
                  });
                } else {
                  this.$Message.error("*为必填！");
                }
              });
            },
            onCancel: () => {
              this.$Message.info("取消作废");
            },
          });
        } else {
          this.$Message.error("*为必填！");
        }
      });
    },
    // 导出
    derive() {
      if (!this.mainId) {
        this.$message.error("请选择一条有效数据");
        return false;
      } else {
        location.href =
          baseUrl.omsOrder +
          "/preOrderMain/export?id=" +
          this.mainId +
          "&access_token=" +
          Cookies.get(TOKEN_KEY);
      }
    },
    //导入配件 编码品牌导入
    getRUl() {
      this.upurl = getup + "id=" + this.mainId;
    },
    getRULInnerId(){
      this.upurlInnerId=getupInnerId+"id="+this.mainId;
    },
    //批量上传失败
    onFormatError(file) {
      this.$Message.error("只支持xls xlsx后缀的文件");
    },
    // 上传成功函数
    onSuccess(response) {
      if (response.code === 0) {
        if (response.data.length === 0) {
          this.$Message.warning("导入成功！");
        } else {
          this.warning(response.data);
        }
        this.leftgetList();
      } else {
        this.$Message.error(response.message);
      }
    },
    warning(nodesc) {
      let str = "";
      if (nodesc.length > 0) {
        nodesc.map((item, index) => {
          if (index != nodesc.length - 1) {
            str += `${item}<br/>`;
          } else {
            str += `${item}`;
          }
        });
      }
      this.$Notice.warning({
        title: "上传错误信息",
        desc: str,
        duration: 0,
      });
    },
    //上传之前清空 编码品牌导入配件
    beforeUpload() {
      this.$refs.upload.clearFiles();
    },
    //上传之前清空 内码导入配件
    beforeUploadInnerId(){
      this.$refs.upload1.clearFiles();
    },
    //右侧表格复选框选中
    selectChange(msg) {
      this.checkboxArr = msg.selection;
      // console.log(this.checkboxArr)
    },
    //分页
    changePageLeft(p) {
      this.Left.page.num = p;
      this.leftgetList();
    },
    changeSizeLeft(size) {
      this.Left.page.num = 1;
      this.Left.page.size = size;
      this.leftgetList();
    },
    //右部分分页
    changePage(p) {
      this.Left.page.num = p;
      // this.getList()
    },
    changeSize(size) {
      this.Left.page.num = 1;
      this.Left.page.size = size;
      // this.getList()
    },
    // 查询下拉框
    getDataQuick(v) {
      // console.log(v)
      this.selectArr = v;
      this.leftgetList();
    },
    //footer计算
    addFooter({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "和值";
          }
          if (["preQty"].includes(column.property)) {
            return this.$utils.sum(data, column.property);
          }
          return null;
        }),
      ];
    },
    //表格编辑状态下被关闭的事件
    editClosedEvent() {},

    // 更多子组件的参数
    getMsg(msg) {
      this.moreArr = msg;
      this.leftgetList();
      // console.log(msg)
    },
    //子组件的参数
    getPartNameList(ChildMessage) {
      // console.log(ChildMessage)
      let parts = [];
      ChildMessage.map((item) => {
        parts.push({
          partCode: item.partCode, //编码
          partName: item.partName, //名称
          unit: item.unit, //单位
          partBrand: item.partBrand, //品牌
          spec: item.spec, //规格
          preQty: undefined, //预定数量
          remark: "", //备注
          acceptQty: 0, //受理数量
          oemCode: item.oemCode, //oe码
          partInnerId: item.partInnerId, //配件内码
          partId: item.partId,
        });
      });
      if (this.Right.tbdata) {
        this.Right.tbdata = [...this.Right.tbdata, ...parts];
        this.Right.tbdata = tools.arrRemoval(this.Right.tbdata, "oemCode");
      } else {
        this.Right.tbdata = parts;
      }

      // this.Right.tbdata.map(
      //   item => (item.preQty = item.preQty > 0 ? item.preQty : 1)
      // );
    },

    getPartNameList2(ChildMessage) {
      // console.log(ChildMessage)
      let parts = [];
      ChildMessage.map((item) => {
        parts.push({
          partCode: item.partCode, //编码
          partName: item.partName, //名称
          unit: item.unit, //单位
          partBrand: item.partBrand, //品牌
          spec: item.spec, //规格
          preQty: item.orderQty || 1, //预定数量
          remark: "", //备注
          acceptQty: 0, //受理数量
          oemCode: item.oemCode, //oe码
          partInnerId: item.partInnerId, //配件内码
          partId: item.partId,
        });
      });
      if (this.Right.tbdata) {
        this.Right.tbdata = [...this.Right.tbdata, ...parts];
        this.Right.tbdata = tools.arrRemoval(this.Right.tbdata, "oemCode");
      } else {
        this.Right.tbdata = parts;
      }
      this.$Message.success("已添加");

      // this.Right.tbdata.map(
      //   item => (item.preQty = item.preQty > 0 ? item.preQty : 1)
      // );
    },

    //编辑收货信息弹框显示
    GoodsInfoModal() {
      if (!this.datadata || this.datadata.new)
        return this.$Message.error("请先保存数据");
      this.clickdelivery = true;
      this.$refs.goodsInfo.init();
    },
    //供应商弹框
    addSuppler() {
      this.$refs.selectSupplier.init();
    },
    // 供应商子组件内容
    getSupplierName(a) {
      // console.log(a)
      this.formPlan.guestName = a.shortName;
      this.formPlan.guestidId = a.id;
    },
    leftgetList() {
      let params = {};
      let data = {};
      params.page = this.Left.page.num - 1;
      params.size = this.Left.page.size;
      if (this.selectArr !== "9999") {
        data.createTimeStart = this.selectArr[0];
        data.createTimeEnd = this.selectArr[1];
      }
      if (this.moreArr.createData != null) {
        data.createTimeStart = this.moreArr.createData[0] + " 00:00:00";
        data.createTimeEnd = this.moreArr.createData[1] + " 23:59:59";
      }
      if (this.purchaseType !== "99") {
        data.status = this.purchaseType;
      }
      if (this.moreArr.submitData != null) {
        data.commitTimeStart = this.moreArr.submitData[0] + " 00:00:00";
        data.commitTimeEnd = this.moreArr.submitData[1] + " 23:59:59";
      }
      if (this.moreArr.callout) {
        // console.log(this.moreArr.callout)
        data.salesman = this.moreArr.callout;
      }
      if (this.moreArr.numbers) {
        data.orderNo = this.moreArr.numbers;
      }
      if (this.moreArr.coding) {
        data.partCode = this.moreArr.coding;
      }
      if (this.moreArr.Name) {
        data.partName = this.moreArr.Name;
      }
      if (this.moreArr.brand) {
        data.partBrand = this.moreArr.brand;
      }
      if (this.moreArr.Accessories) {
        data.commitUname = this.moreArr.Accessories;
      }
      optGroup({ params: params, data: data }).then((res) => {
        if (res.code === 0) {
          this.Left.tbdata = res.data.content;
          this.Left.page.total = res.data.totalElements;

          for (let b of this.Left.tbdata) {
            b._highlight = false;
            if (b.id == this.selectLeftItemId) {
              b._highlight = true;
              this.setRightData(b);
              break;
            }
          }
        }
      });
    },
    // 左边部分的当前行
    selection(row) {
      if (row == null) return;
      this.selectLeftItemId = row.id;
      let currentRowTable = this.$refs["currentRowTable"];
      // console.log(currentRowTable.clearCurrentRow)
      if (!this.Flaga && !this.isAdd && row.id) {
        this.$Modal.confirm({
          title: "您正在编辑单据，是否需要保存",
          onOk: () => {
            currentRowTable.clearCurrentRow();
            this.$refs.formPlan.validate((valid) => {
              if (valid) {
                let data = {};
                data.id = this.rowId;
                data.salesman = this.formPlan.salesman;
                data.orderNo = this.formPlan.Reservation;
                data.expectedArrivalDate = tools.transDate(
                  this.formPlan.orderDate
                );
                data.remark = this.formPlan.remark;
                data.detailVOList = this.Right.tbdata;
                // console.log(this.Right.tbdata)
                save(data).then((res) => {
                  if (res.code === 0) {
                    this.$message.success("保存成功！");
                    this.leftgetList(),
                      (this.formPlan.salesman = ""), //业务员
                      (this.formPlan.Reservation = ""),
                      (this.formPlan.remark = ""),
                      (this.Right.tbdata = []);
                    this.isAdd = true;
                    this.Flaga = true;
                  }
                });
              } else {
                this.$Message.error("*为必填！");
              }
            });
          },
          onCancel: () => {
            this.Left.tbdata.splice(0, 1);
            currentRowTable.clearCurrentRow();
            this.isAdd = true;
            (this.formPlan.salesman = ""), //业务员
              (this.formPlan.Reservation = ""),
              (this.formPlan.remark = ""),
              (this.Right.tbdata = []);

            for (let b of this.Left.tbdata) {
              b._highlight = false;
              if (b.id == this.selectLeftItemId) {
                b._highlight = true;
                this.setRightData(b);
                break;
              }
            }
          },
        });
      } else {
        this.setRightData(row);
      }
    },
    Determined() {},
    //填充右侧数据
    setRightData(row) {
      this.mainId = row.id;
      this.guestidId = row.guestId;
      this.datadata = row;
      if (row.id) {
        // this.leftgetList();
        this.LeadIn = false;
        this.formPlan.salesman = this.datadata.salesman;
        this.formPlan.Reservation = this.datadata.orderNo;
        this.formPlan.orderDate = this.datadata.expectedArrivalDate;
        this.formPlan.remark = this.datadata.remark;
        this.Right.tbdata = this.datadata.detailVOList;
        console.log(this.datadata.detailVOList, "13456");
        this.presentrowMsg = row.status.value;
        // console.log(this.presentrowMsg)
        this.rowId = row.id;
        this.buttonDisable = false;
      } else {
        this.formPlan.salesman = this.$store.state.user.userData.staffName;
        this.formPlan.Reservation = "";
        this.formPlan.orderDate = "";
        this.formPlan.remark = "";
        this.rowId = "";
        this.Right.tbdata = [];
      }
    },
    // 提交按钮
    instance() {
      if (this.Right.tbdata !== null) {
        let zero = tools.isZero(this.tableData, { qty: "preQty" });
        if (zero) return;
        this.$refs.formPlan.validate((valid) => {
          if (valid) {
            this.$Modal.confirm({
              title: "是否提交",
              onOk: async () => {
                this.$refs.formPlan.validate((valid) => {
                  if (valid) {
                    let data = {};
                    data.id = this.rowId;
                    data.salesman = this.formPlan.salesman;
                    data.orderNo = this.formPlan.Reservation;
                    data.expectedArrivalDate = tools.transDate(
                      this.formPlan.orderDate
                    );
                    // console.log(tools.transDate(this.formPlan.orderDate))
                    data.remark = this.formPlan.remark;
                    data.detailVOList = this.Right.tbdata;
                    this.commitLoading = true;
                    showLoading(".loadingClass", "数据加载中，请勿操作")
                    commitOrder(data).then((res) => {
                      if (res.code === 0) {
                        this.$message.success("提交成功！");
                        this.leftgetList(),
                          (this.formPlan.salesman = ""), //业务员
                          (this.formPlan.Reservation = ""),
                          (this.formPlan.remark = ""),
                          (this.Right.tbdata = []);
                        this.Flaga = true;
                        this.commitLoading = false;
                        hideLoading()
                      } else {
                        this.commitLoading = false;
                        hideLoading()
                      }
                    }).catch(e => {
                      hideLoading()
                      this.commitLoading = false;
                    });
                  } else {
                    this.$Message.error("*为必填！");
                  }
                });
              },
              onCancel: () => {
                this.$Message.info("取消提交");
              },
            });
          } else {
            this.$Message.error("*为必填！");
          }
        });
      } else {
        this.$Message.warning("请添加配件或完善订单信息后再提交!");
      }
    },
    // unique(arr) { // 根据唯一标识Id来对数组进行过滤
    //   const res = new Map();  //定义常量 res,值为一个Map对象实例
    //   //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
    //   return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
    // }
  },
  mounted() {
    this.$nextTick(() => {
      let wrapH = this.$refs.paneLeft.offsetHeight;
      let planFormH = this.$refs.planForm.offsetHeight;
      let planBtnH = this.$refs.planBtn.offsetHeight;
      // let planPageH = this.$refs.planPage.offsetHeight;
      //获取左侧侧表格高度
      this.leftTableHeight = wrapH - 70;
      //获取右侧表格高度
      this.rightTableHeight = wrapH - planFormH - planBtnH - 65;
    });
    this.leftgetList();
  },
};
</script>

<style scoped>
.con-box {
  height: 700px;
}
.w550 {
  width: 580px;
}
.w490 {
  width: 480px;
}
</style>
