<template>
  <div style="height: 100%;">
    <Form
      inline
      :show-message="false"
      ref="formPlan"
      :model="formPlan"
      :rules="ruleValidate"
      :label-width="100"
    >
      <div class="pane-made-hd">
        <span class="titler mr5">固定额度:</span>
        <span class="titler mr10">{{ limitList.fixationQuota |priceFilters}}</span>
        <span class="titler mr5">临时额度:</span>
        <span class="titler mr10">{{ limitList.tempQuota |priceFilters}}</span>
        <span class="titler mr5">可用余额:</span>
        <span class="titler mr5">{{ limitList.sumAmt |priceFilters}}</span>
      </div>
      <div class="clearfix purchase" ref="planForm">
        <FormItem label="客户：" prop="fullName">
          <Row style="width: 310px">
            <!-- <Select v-model="formPlan.guestId" filterable style="width: 240px" :disabled="draftShow != 0" @on-change="changeClient">
                  <Option v-for="item in client" :value="item.id" :key="item.id">{{ item.fullName }}</Option>
            </Select>-->
            <Input
              class="w240"
              v-model="formPlan.fullName"
              :disabled="draftShow != 0"
              @on-change="changeClient"
            />
            <Button
              class="ml5"
              size="small"
              type="default"
              @click="openAddCustomer"
              :disabled="draftShow != 0"
            >
              <Icon type="md-checkmark" />
            </Button>
            <Button
              class="ml5"
              size="small"
              type="default"
              @click="openAddNewClient"
              :disabled="draftShow != 0"
            >
              <Icon type="md-add" />
            </Button>
          </Row>
        </FormItem>
        <FormItem label="销售员：" prop="orderMan">
          <Input class="w160" v-model="formPlan.orderMan" :disabled="draftShow != 0" />
        </FormItem>
        <FormItem label="订单类型：">
          <Select v-model="formPlan.orderTypeValue" style="width:100px" disabled>
            <Option v-for="item in orderType" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="往来单号：">
          <Input class="w210" v-model="formPlan.code" disabled />
        </FormItem>
        <FormItem label="票据类型:" prop="billTypeId">
          <Select v-model="formPlan.billTypeId" style="width:100px" :disabled="draftShow != 0">
            <Option
              v-for="item in settleTypeList.CS00107"
              :value="item.itemCode"
              :key="item.itemCode"
            >{{ item.itemName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="结算方式：" prop="settleTypeId">
          <Select v-model="formPlan.settleTypeId" style="width:100px" :disabled="draftShow != 0">
            <Option
              v-for="item in settleTypeList.CS00106"
              :value="item.itemCode"
              :key="item.itemCode"
            >{{ item.itemName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="备注：">
          <Input style="width: 370px" v-model="formPlan.remark" :disabled="draftShow != 0" />
        </FormItem>
        <FormItem label="订单号:">
          <Input class="w210" v-model="formPlan.serviceId" disabled />
        </FormItem>
        <FormItem label="计划发货日期:" prop="planSendDate">
          <!-- @on-change="getplanSendDate" -->
          <DatePicker
            :value="formPlan.planSendDate"
            :options="options1"
            type="date"
            @on-change="getplanSendDate"
            placeholder="选择日期"
            style="width: 120px"
            :disabled="draftShow != 0"
          ></DatePicker>
        </FormItem>
        <FormItem label="计划到货日期:" prop="planArriveDate">
          <DatePicker
            :value="formPlan.planArriveDate"
            @on-change="getplanArriveDate"
            :options="options2"
            type="date"
            placeholder="选择日期"
            style="width: 120px"
            :disabled="draftShow != 0"
          ></DatePicker>
        </FormItem>
        <FormItem label="交货仓库：" prop="storeId">
          <Select v-model="formPlan.storeId" style="width:200px" :disabled="draftShow != 0">
            <Option v-for="item in WarehouseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </div>
      <div class="flex plan-cz-btn" ref="planBtn">
        <div class="clearfix">
          <div class="fl mb5">
            <Button size="small" :disabled="draftShow != 0" class="mr10" @click="addMountings ">
              <Icon type="md-add" />添加配件
            </Button>
          </div>
          <div class="fl mb5">
            <Button size="small" :disabled="draftShow != 0" class="mr10" @click="deletePart">
              <i class="iconfont mr5 iconlajitongicon"></i> 删除配件
            </Button>
          </div>
          <div class="fl mb5">
            <Button
              size="small"
              :disabled="draftShow != 0"
              class="mr10"
              @click="openBarchModal"
            >批次配件</Button>
          </div>
          <div class="fl mb5">
            <Upload
              ref="upload"
              style="display: inline-block"
              :show-upload-list="false"
              :action="upurl"
              :headers="headers"
              :format="['xlsx','xls']"
              :on-format-error="onFormatError"
              :on-success="onSuccess"
              :before-upload="beforeUpload"
            >
              <Button
                size="small"
                class="mr10"
                @click="getRUl"
                :disabled="draftShow != 0 || !formPlan.id"
              >
                <span class="center">
                  <Icon custom="iconfont icondaoruicon icons" />导入配件
                </span>
              </Button>
            </Upload>
          </div>
          <div class="fl mr10">
            <Button size="small" @click="down">
              <Icon custom="iconfont iconxiazaiicon icons" />下载模板
            </Button>
          </div>
          <div class="fl mb5">
            <Button
              size="small"
              :disabled="draftShow != 0"
              class="mr10"
              @click="openActivityModal"
            >选择活动</Button>
          </div>
          <div class="fl mb5">
            <Button
              size="small"
              :disabled="draftShow != 0 || !formPlan.id"
              class="mr10"
              @click="openGodownEntryModal"
            >选择入库单</Button>
          </div>
          <div class="fl mb5">
            <Button
              size="small"
              :disabled="draftShow != 0 || !formPlan.id"
              class="mr10"
              @click="openAddressShow"
            >编辑发货信息</Button>
          </div>
        </div>
      </div>
      <div class="tableBox">
        <vxe-table
          border
          align="center"
          size="mini"
          resizable
          stripe
          ref="xTable"
          show-footer
          :footer-method="footerMethod"
          showOverflow="true"
          height="400"
          :edit-rules="validRules"
          :data="formPlan.detailList"
          @select-change="selectTable"
          @select-all="selectAllTable"
          @edit-actived="editActivedEvent"
          style="width: 2000px"
          :edit-config="{trigger: 'click', mode: 'cell'}"
        >
          <vxe-table-column type="index" width="50" title="序号"></vxe-table-column>
          <vxe-table-column type="checkbox" width="50"></vxe-table-column>
          <vxe-table-column title="操作">
            <template v-slot="{ row,rowIndex }">
              <a @click="openFileModal(row)">查看</a>
            </template>
          </vxe-table-column>
          <vxe-table-column field="partCode" title="配件编码"></vxe-table-column>
          <vxe-table-column field="partName" title="配件名称"></vxe-table-column>
          <vxe-table-column field="partBrand" title="品牌"></vxe-table-column>
          <vxe-table-column
            field="orderQty"
            title="数量"
            :edit-render="{name: 'input',attrs: {disabled: false}}"
          ></vxe-table-column>
          <vxe-table-column
            field="orderPrice"
            title="单价"
            :edit-render="{name: 'input' ,attrs: {disabled: false}}"
          ></vxe-table-column>
          <vxe-table-column title="金额">
            <template v-slot="{ row }">
              <span>{{ countAmount(row) }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="remark" title="备注"></vxe-table-column>
          <vxe-table-column field="storeShelf" title="仓位"></vxe-table-column>
          <vxe-table-column field="stockOutQty" title="缺货数量"></vxe-table-column>
          <vxe-table-column field title="批次">
            <template v-slot="{ row,rowIndex }">
              <Checkbox disabled :value="row.isMarkBatch == 1"></Checkbox>
            </template>
          </vxe-table-column>
          <vxe-table-column title="活动">
            <template v-slot="{ row,rowIndex }">
              <Checkbox disabled :value="row.isMarkActivity == 1"></Checkbox>
            </template>
          </vxe-table-column>
          <vxe-table-column title="品牌车型">
            <template v-slot="{row,rowIndex}">
              <span>{{row.carBrandName}} {{row.carModelName}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="unit" title="单位"></vxe-table-column>
          <vxe-table-column field="oemCode" title="OE码"></vxe-table-column>
          <vxe-table-column field="spec" title="规格"></vxe-table-column>
          <vxe-table-column field="showDirection" title="方向"></vxe-table-column>
        </vxe-table>
      </div>
    </Form>

    <!--   新增客户资料-->
    <Modal v-model="clientDataShow" title="客户资料" width="700">
      <ClientData
        :data="clientList"
        :provincearr="provinceArr"
        :treelist="treeDiagramList"
        ref="child"
      ></ClientData>
      <div slot="footer">
        <Button type="primary" @click="addNewClient">确定</Button>
        <Button type="default" @click="clientDataShow = false">取消</Button>
      </div>
    </Modal>

    <!--  编辑发货地址 -->
    <!--      <Modal v-model="addressShow" title="收货信息"  width="1000">-->
    <goods-info ref="goodsInfo" :mainId="formPlan.id"></goods-info>
    <!--        <div slot='footer'>-->
    <!--          <Button type='primary' @click = changeShippingAddress>确定</Button>-->
    <!--          <Button type='default' @click='addressShow = false'>取消</Button>-->
    <!--        </div>-->
    <!--      </Modal>-->

    <!--      添加配件-->
    <select-part-com ref="selectPartCom" @selectPartName="getPartNameList"></select-part-com>
    <!--      批次配件-->
    <barch ref="barch" @selectPartName="getBarchList"></barch>
    <!--      选择客户-->
    <Select-the-customer ref="AddCustomerModel" @getOne="setOneClient"></Select-the-customer>
    <!--      选择入库单-->
    <Godown-entry ref="GodownEntryModal" @godownList="getGodown"></Godown-entry>
    <!--      选择活动-->
    <Activity ref="activity" @getActivity="activiyList"></Activity>
    <!--      查看详情-->
    <See-file ref="fileList" :data="oneRow"></See-file>
  </div>
</template>

<script>
import ClientData from "../../../system/essentialData/clientManagement/ClientData";
import goodsInfo from "../../../goods/plannedPurchaseOrder/components/GoodsInfo";
import selectPartCom from "../components/selectPartCom";
import SelectTheCustomer from "../../commonality/SelectTheCustomer";
import GodownEntry from "../../commonality/GodownEntry";
import Activity from "../../commonality/Activity";
import SeeFile from "../../commonality/SeeFile";
import { area } from "@/api/lease/registerApi";
import {
  getClient,
  getRightList,
  getWarehouseList,
  getLimit,
  getSave,
  getStockOut,
  getSubmitList,
  getAccessories,
  getDeleteList,
  getup
} from "@/api/salesManagment/salesOrder";
import { getDigitalDictionary } from "@/api/system/essentialData/clientManagement";
import { getNewClient } from "@/api/system/essentialData/clientManagement";
import { getClientTreeList } from "@/api/system/essentialData/clientManagement";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
import barch from "../batch/selectPartCom";
import baseUrl from "_conf/url";
import { conversionList } from "@/components/changeWbList/changewblist";

export default {
  name: "OrderRight",
  components: {
    ClientData,
    goodsInfo,
    selectPartCom,
    SelectTheCustomer,
    GodownEntry,
    Activity,
    SeeFile,
    barch
  },
  data() {
    let changeNumber = (rule, value, callback) => {
      if (!value && value != "0") {
        callback(new Error("请输入大于或等于0的正整数"));
      } else {
        const reg = /^([0]|[1-9][0-9]*)$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入大于或等于0的正整数"));
        }
      }
    };
    let money = (rule, value, callback) => {
      if (!value && value != "0") {
        callback(new Error("最多保留4位小数"));
      } else {
        const reg = /^([1-9]\d{0,15}|0)(\.\d{1,4})?$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("最多保留4位小数"));
        }
      }
    };
    let options2DisabledDate = (date) => {
      const orderDate = this.formPlan.planSendDate;
      return date && orderDate && date.valueOf() < orderDate;
    }
    return {
      options1: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      options2: {
        disabledDate: options2DisabledDate,
      },
      formPlan: {}, //获取到数据
      headers: {
        Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
      }, //请求头
      upurl: getup, //导入地址
      orderType: [
        {
          value: 0,
          label: "销售开单"
        },
        {
          value: 1,
          label: "电商订单"
        }
      ], //订单类型
      clientList: {}, //新增客户资料
      provinceArr: {}, //获取数据字典地址
      treeDiagramList: [], //新增客户树形图信息
      clientDataShow: false, //新增客户模态框关闭
      addressShow: false, //收货地址显示
      leftOneOrder: {}, //获取到的左侧数据
      draftShow: "", //判定是不是草稿
      settleTypeList: {}, //结账类型
      WarehouseList: [], //仓库
      oneRow: {}, //点击详情的数据
      limitList: {}, //额度信息
      totalMoney: "", //总价
      client: [], //客户列表
      ruleValidate: {
        fullName: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ],
        orderMan: [{ required: true, message: "  ", trigger: "blur" }],
        billTypeId: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ],
        settleTypeId: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ],
        storeId: [
          { required: true, type: "string", message: " ", trigger: "change" }
        ]
      },
      //form表单校验
      validRules: {
        orderQty: [{ required: true, validator: changeNumber }],
        orderPrice: [{ required: true, validator: money }]
      }, //表格校验
      selectTableList: [], //table表格选中的数据
    }
  },
  mounted() {
    this.getAdress();
    this.getAllClient();
    this.getType();
    this.getWarehouse();
    this.getClassifyList();
  },
  computed: {
    getOneOrder() {
      return this.$store.state.dataList.oneOrder;
    }
  },
  methods: {
    //获取右侧数据
    async getList() {
      let data = {};
      let stop = this.$loading();
      data.id = this.leftOneOrder.id;
      let res = await getRightList(data);
      if (res.code === 0) {
        stop();
        // this.draftShow = JSON.parse(res.data.billStatusId)
        // res.data.orderType =  JSON.parse(res.data.orderType)
        this.draftShow = res.data.billStatusId;
        res.data.orderTypeValue = res.data.orderType.value;
        this.formPlan = res.data;
        this.formPlan.fullName = this.formPlan.guestName;
        this.draftShow = this.draftShow.value;
      }
      if (res.code !== 0) {
        stop();
      }
    },
    //获取客户额度
    async getAllLimit() {
      let data = {};
      data.guestId = this.leftOneOrder.guestId;
      let res = await getLimit(data);
      if (res.code === 0) {
        this.limitList = res.data;
      }
    },
    //改变客户
    async changeClient(value) {
      let data = {};
      if (!value) {
        return false;
      }
      data.guestId = value;
      let res = await getLimit(data);
      if (res.code === 0) {
        this.limitList = res.data;
      }
    },
    //获取客户属性
    async getType() {
      let data = {};
      //107票据类型
      //106结算方式
      data = ["CS00106", "CS00107"];
      let res = await getDigitalDictionary(data);
      if (res.code == 0) {
        this.settleTypeList = res.data;
      }
    },
    //获取公司
    async getAllClient() {
      let res = await getClient();
      if (res.code === 0) {
        this.client = res.data;
      }
    },
    // 获取仓库
    async getWarehouse() {
      let res = await getWarehouseList({
        groupId: this.$store.state.user.userData.groupId
      });
      if (res.code === 0) {
        this.WarehouseList = res.data;
      }
    },
    //打开新增客户
    openAddNewClient() {
      this.clientList = {};
      this.clientDataShow = true;
    },
    //获取新增客户二级分类
    getClassifyList() {
      getClientTreeList().then(res => {
        if (res.code == 0) {
          this.treeDiagramList = res.data;
          let leverOne = res.data.filter(item => item.lever == 1);
          leverOne.map(item => {
            item.children = [];
            item.code = item.id;
            this.treeDiagramList.forEach(el => {
              if (item.id == el.parentId) {
                item.children.push(el);
              }
            });
          });
        }
      });
    },

    //新增客户确认
    addNewClient() {
      this.$refs.child.handleSubmit(async () => {
        let data = {};
        data = this.clientList;
        data.isNeedPack ? (data.isNeedPack = 1) : (data.isNeedPack = 0);
        data.isSupplier ? (data.isSupplier = 1) : (data.isSupplier = 0);
        data.isDisabled ? (data.isDisabled = 1) : (data.isDisabled = 0);
        let res = await getNewClient(this.clientList);
        if (res.code == 0) {
          this.clientDataShow = false;
        }
      });
    },
    //获取数据字典地址
    getAdress() {
      area().then(res => {
        if (res.code == 0) {
          this.provinceArr = res.data;
        }
      });
    },
    //计算表格数据
    countAmount(row) {
      return (
        this.$utils.toNumber(row.orderQty) *
        this.$utils.toNumber(row.orderPrice)
      );
    },
    // 计算尾部总和
    countAllAmount(data) {
      let count = 0;
      data.forEach(row => {
        count += this.countAmount(row);
      });
      this.totalMoney = count;
      return count;
    },
    //获取尾部总数
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "和值";
          }
          if (["orderQty", "orderPrice"].includes(column.property)) {
            return this.$utils.sum(data, column.property);
          }
          if (columnIndex === 8) {
            return ` ${this.countAllAmount(data)} `;
          }
          return null;
        })
      ];
    },
    //下载模板
    down() {
      location.href =
        baseUrl.omsOrder +
        "/sellOrderMain/template?access_token=" +
        Cookies.get(TOKEN_KEY);
    },
    //批量上传失败
    onFormatError(file) {
      this.$Message.error("只支持xls xlsx后缀的文件");
    },
    // 上传成功函数
    onSuccess(response) {
      if (response.code == 0) {
        if (response.data.list && response.data.list.length > 0) {
          this.warning(response.data.list[0]);
        }
      } else {
        this.$Message.error("上传失败");
      }
    },
    warning(nodesc) {
      this.$Notice.warning({
        title: "上传错误信息",
        desc: nodesc
      });
    },
    //上传之前清空
    beforeUpload() {
      this.$refs.upload.clearFiles();
    },
    //打开收货地址
    openAddressShow() {
      this.$refs.goodsInfo.init();
    },
    //确认收货地址
    changeShippingAddress() {},
    //打开添加配件模态框
    addMountings() {
      this.$refs.selectPartCom.init();
    },
    //打开批次配件框
    openBarchModal() {
      this.$refs.barch.init();
    },
    //多选内容
    selectTable(data) {
      this.selectTableList = data.selection;
    },
    //全选内容
    selectAllTable(data) {
      this.selectTableList = data.selection;
    },
    //删除配件
    deletePart() {
      if (this.selectTableList.length > 0) {
        let data = [];
        this.selectTableList.forEach(item => {
          data.push({ id: item.id });
        });
        console.log(data);
        getDeleteList(data).then(res => {
          if (res.code === 0) {
            this.getList();
          }
        });
      } else {
        this.$message.error("请选择一条有效数据");
      }
    },
    //计划发货日期
    getplanSendDate(data) {
      this.formPlan.planSendDate = data + " " + "00:00:00";
      const orderDate = this.formPlan.planSendDate;
      this.options2 = {
        disabledDate(date) {
          return date && orderDate && date.valueOf() < new Date(orderDate);
        }
      }
    },
    //计划到货日期
    getplanArriveDate(data) {
      this.formPlan.planArriveDate = data + " " + "00:00:00";
    },

    //配件返回的参数
    getPartNameList(val) {
      this.$refs.formPlan.validate(async valid => {
        if (valid) {
          let data = {};
          data = this.formPlan;
          data.detailList = conversionList(val);
          let res = await getAccessories(data);
          if (res.code === 0) {
            this.$emit("parentGetleft");
          }
        } else {
          this.$Message.error("*为必填项");
        }
      });
    },
    // 批次配件
    async getBarchList(val) {
      this.$refs.formPlan.validate(async valid => {
        if (valid) {
          let data = {};
          val.map(item => {
            item.isMarkBatch = 1;
          });
          data = this.formPlan;
          data.detailList = val;
          let res = await getAccessories(data);
          if (res.code === 0) {
            this.getList();
          }
        } else {
          this.$Message.error("*为必填项");
        }
      });
    },
    //打开客户选择
    openAddCustomer() {
      this.$refs.AddCustomerModel.openModel();
    },
    //打开选择入库单
    openGodownEntryModal() {
      this.$refs.GodownEntryModal.openModal();
    },
    //打开活动
    openActivityModal() {
      this.$refs.activity.openModal();
    },
    //获取活动内的数据
    async activiyList(val) {
      let data = {};
      val.isMarkActivity = 1;
      data = this.formPlan;
      data.detailList = [val];
      let res = await getAccessories(data);
      if (res.code === 0) {
        this.getList();
      }
    },
    //打开查看模态框
    openFileModal(row) {
      this.oneRow = row;
      this.$nextTick(function() {
        this.$refs.fileList.openModal();
      });
    },
    //保存
    save() {
      this.$refs.formPlan.validate(async valid => {
        if (valid) {
          try {
            await this.$refs.xTable.validate();

            if (+this.totalMoney > +this.limitList.sumAmt) {
              return this.$message.error("可用余额不足");
            }

            // this.formPlan.orderType = JSON.stringify(this.formPlan.orderType)
            let res = await getSave(this.formPlan);
            if (res.code === 0) {
              this.$Message.success("保存成功");
              this.$store.commit("setleftList", res);
              this.isAdd = true;
            }
          } catch (errMap) {
            this.$XModal.message({
              status: "error",
              message: "表格校验不通过！"
            });
          }
        } else {
          this.$Message.error("*为必填项");
        }
      });
    },
    //获取搜索框内的数据
    setOneClient(val) {
      this.$set(this.formPlan, "guestId", val.id);
      this.$set(this.formPlan, "fullName", val.fullName);
    },
    //判断表格能不能编辑
    editActivedEvent({ row }) {
      let xTable = this.$refs.xTable;
      let orderQtyColumn = xTable.getColumnByField("orderQty");
      let orderPriceColumn = xTable.getColumnByField("orderPrice");
      let sexColumn = xTable.getColumnByField("sex");
      let isDisabled = this.draftShow != 0;
      orderQtyColumn.editRender.attrs.disabled = isDisabled;
      orderPriceColumn.editRender.attrs.disabled = isDisabled;
    },
    //出库
    stockOut() {
      this.$refs.formPlan.validate(async valid => {
        if (valid) {
          try {
            await this.$refs.xTable.validate();

            if (+this.totalMoney > +this.limitList.sumAmt) {
              return this.$message.error("可用余额不足");
            }

            this.formPlan.orderType = JSON.stringify(this.formPlan.orderType);
            let res = await getStockOut(this.formPlan);
            if (res.code === 0) {
              this.$Message.success("出库成功成功");
              return res;
            }
          } catch (errMap) {
            this.$XModal.message({
              status: "error",
              message: "表格校验不通过！"
            });
          }
        } else {
          this.$Message.error("*为必填项");
        }
      });
    },
    //提交
    submitList() {
      this.$refs.formPlan.validate(async valid => {
        if (valid) {
          try {
            await this.$refs.xTable.validate();
            if (+this.totalMoney > +this.limitList.sumAmt) {
              return this.$message.error("可用余额不足");
            }
            this.formPlan.orderType = JSON.stringify(this.formPlan.orderType);
            let res = await getSubmitList(this.formPlan);
            if (res.code === 0) {
              this.$Message.success("出库成功成功");
              this.$store.commit("setleftList", res);
            }
          } catch (errMap) {
            // this.$XModal.message({ status: 'error', message: '表格校验不通过！' })
          }
        } else {
          this.$Message.error("*为必填项");
        }
      });
    },
    //获取选择入库单的信息
    async getGodown(val) {
      let data = {};
      data = this.formPlan;
      val.map(item => {
        item.isMarkBatch = 1;
      });
      data.detailList = val.details;
      data.sign = 1;
      let res = await getAccessories(data);
      if (res.code === 0) {
        this.getList();
      }
    },
    getRUl() {
      this.upurl = getup + "id=" + this.formPlan.id;
    }
  },
  watch: {
    getOneOrder: {
      handler(old, ov) {
        if (!old.id) {
          this.formPlan = {
            billStatusId: { name: "草稿", value: 0 },
            orderMan: this.$store.state.user.userData.username || ""
          };
          this.draftShow = 0;
          return false;
        }
        this.leftOneOrder = old;
        this.getList();
        this.getAllLimit();
      },
      deep: true
    }
  }
};
</script>

<style scoped lang="less">
.purchase {
  padding-top: 10px;
  padding-left: 10px;
  border-bottom: 1px #e8eaec solid;
}
.pane-made-hd {
  line-height: 30px;
  border-bottom: 1px #e8eaec solid;
  background-color: #f8f8f8;
  padding-left: 15px;
}
.plan-cz-btn {
  justify-content: space-between;
  padding: 10px 15px 10px;
  align-items: center;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.tableBox {
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-x: scroll;
}
</style>
<style scoped>
.purchase >>> .ivu-form-item {
  margin-bottom: 10px;
}
</style>
