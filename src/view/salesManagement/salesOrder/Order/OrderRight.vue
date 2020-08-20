<template>
  <div style="height: 100%;">
    <div class="tablebox">
      <Form
        inline
        :show-message="false"
        ref="formPlan"
        :model="formPlan"
        :rules="ruleValidate"
        :label-width="80"
      >
        <div class="pane-made-hd fs12">
          <span class="titler mr5">固定额度:</span>
          <span class="titler mr10">{{ limitList.fixationQuota |priceFilters}}</span>
          <span class="titler mr5">临时额度:</span>
          <span class="titler mr10">{{ limitList.tempQuota |priceFilters}}</span>
          <span class="titler mr5">可用余额:</span>
          <span class="titler mr5">{{ limitList.sumAmt  |priceFilters}}</span>
        </div>
        <div class="clearfix purchase pb10" ref="planForm">
          <FormItem label="客户：" prop="guestId" :show-message="false" inline>
            <Row>
              <!--<Tooltip :content="formPlan.fullName">-->
                <!--<Input placeholder="请选择客户" v-model="formPlan.fullName" readonly disabled style="width:134px;"/>-->
              <!--</Tooltip>-->
              <sales-cus style="width:130px; display: inline-block" :disabled-prop="draftShow != 0|| this.$parent.$parent.ispart" :title="formPlan.fullName" placeholder="请输入客户" :search-value="formPlan.fullName" @throwName="throwNameFun"></sales-cus>
              <Button
                class="ml5"
                size="small"
                type="default"
                @click="openAddCustomer"
                :disabled="draftShow != 0|| this.$parent.$parent.ispart"
              >
                <Icon type="md-checkmark"/>
              </Button>
              <Button
                class="ml5"
                size="small"
                type="default"
                @click="openAddNewClient"
                :disabled="draftShow != 0"
              >
                <Icon type="md-add"/>
              </Button>
            </Row>
          </FormItem>
          <FormItem label="销售员：" prop="orderManId">
            <!--          <Input class="w160" v-model="formPlan.orderMan" :disabled="draftShow != 0" />-->
            <Select
              :value="formPlan.orderManId"
              @on-change="selectOrderMan"
              filterable
              style="width: 200px"
              :disabled="draftShow != 0|| this.$parent.$parent.ispart"
              label-in-value
            >
              <Option v-for="item in salesList" :value="item.id" :key="item.id">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="订单类型：">
            <Select v-model="formPlan.orderTypeValue" style="width:200px" disabled>
              <Option v-for="item in orderType" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="往来单号：">
            <Input class="w200 orderNo" v-model="formPlan.code" disabled/>
          </FormItem>
          <FormItem label="票据类型：" prop="billTypeId">
            <Select
              v-model="formPlan.billTypeId"
              style="width:200px"
              :disabled="draftShow != 0|| this.$parent.$parent.ispart"
            >
              <Option
                v-for="item in settleTypeList.CS00107"
                :value="item.itemCode"
                :key="item.itemCode"
              >{{ item.itemName }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="结算方式：" prop="settleTypeId">
            <Select
              v-model="formPlan.settleTypeId"
              style="width:200px"
              :disabled="draftShow != 0|| this.$parent.$parent.ispart"
            >
              <Option
                v-for="item in settleTypeList.CS00106"
                :value="item.itemCode"
                :key="item.itemCode"
              >{{ item.itemName }}
              </Option>
            </Select>
          </FormItem>
          <!-- <FormItem label="计划发货日期：" prop="planSendDate">
            <DatePicker
              v-model="formPlan.planSendDate"
              :options="options1"
              type="date"
              class="w140"
              @on-change="getplanSendDate"
              placeholder="选择日期"
              style="width: 120px"
              :disabled="draftShow != 0|| this.$parent.$parent.ispart"
              clearable
            ></DatePicker>
          </FormItem>
          <FormItem label="计划到货日期：" prop="planArriveDate">
            <DatePicker
              :value="formPlan.planArriveDate"
              @on-change="getplanArriveDate"
              :options="options2"
              type="date"
              class="w130"
              placeholder="选择日期"
              style="width: 120px"
              :disabled="draftShow != 0|| this.$parent.$parent.ispart"
              clearable
              ref="clearplanArriveDate"
            ></DatePicker>
          </FormItem> -->
          <FormItem label="交货仓库：" prop="storeId">
            <Select
              v-model="formPlan.storeId"
              style="width:200px"
              :disabled="draftShow != 0|| this.$parent.$parent.ispart"
            >
              <Option :disabled="item.sellSign||item.isDisabled" v-for="item in WarehouseList" :value="item.id"
                      :key="item.id">{{ item.name }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="备注：">
            <Tooltip :content="formPlan.remark">
              <Input
                style="width: 200px"
                v-model="formPlan.remark"
                :disabled="draftShow != 0|| this.$parent.$parent.ispart"
              />
            </Tooltip>
          </FormItem>

          <FormItem label="订单号：">
            <Input class="w200 orderNo" v-model="formPlan.serviceId" disabled/>
          </FormItem>
        </div>
        <div class="flex plan-cz-btn" style="padding-bottom: 5px" ref="planBtn">
          <div class="clearfix">
            <div class="fl mb5">
              <Button
                size="small"
                :disabled="draftShow != 0|| this.$parent.$parent.ispart"
                class="mr10"
                @click="addMountings "
                v-has="'addMountings'"
              >
                <Icon type="md-add"/>
                添加配件
              </Button>
            </div>
            <div class="fl mb5">
              <Button
                size="small"
                :disabled="draftShow != 0 || this.$parent.$parent.ispart"
                class="mr10"
                @click="deletePart"
                v-has="'deletePart'"
              >
                <i class="iconfont mr5 iconlajitongicon"></i> 删除配件
              </Button>
            </div>
            <div class="fl mb5">
              <Button
                size="small"
                :disabled="draftShow != 0|| this.$parent.$parent.ispart"
                class="mr10"
                @click="openBarchModal"
                v-has="'Barch'"
              >批次配件
              </Button>
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
                  :disabled="draftShow != 0 || this.$parent.$parent.ispart||this.$parent.$parent.isAdd || !this.$parent.$parent.selectItemId"
                  v-has="'getBarch'"
                >
                <span class="center">
                  <Icon custom="iconfont icondaoruicon icons"/>导入配件
                </span>
                </Button>
              </Upload>
            </div>
            <div class="fl mr10">
              <Button size="small" @click="down">
                <Icon custom="iconfont iconxiazaiicon icons"/>
                下载模板
              </Button>
            </div>
            <div class="fl mb5">
              <Button
                size="small"
                :disabled="draftShow != 0|| this.$parent.$parent.ispart"
                class="mr10"
                @click="openActivityModal"
              >选择活动
              </Button>
            </div>
            <div class="fl mb5">
              <Button
                size="small"
                :disabled="draftShow != 0|| this.$parent.$parent.ispart "
                class="mr10"
                @click="openGodownEntryModal"
                v-has="'goDown'"
              >选择入库单
              </Button>
            </div>
            <div class="fl mb5">
              <Button
                size="small"
                :disabled="draftShow != 0 || this.$parent.$parent.ispart"
                class="mr10"
                @click="openAddressShow"
                v-has="'openAddress'"
              >编辑发货信息
              </Button>
            </div>
            <div class="fl mb5">
              <Button
                size="small"
                class="mr10"
                @click="openAlot"
              >
                调拨申请
              </Button>
            </div>
          </div>
        </div>
        <vxe-table
          border
          resizable
          show-footer
          ref="xTable"
          align="center"
          size="mini"
          :edit-rules="validRules"
          :data="formPlan.detailList"
          :height="rightTableHeight"
          :edit-config="{trigger: 'click', mode: 'cell'}"
          :checkbox-config="{labelField: 'name',strict:'true', checkMethod}"
          @select-change="selectTable"
          @select-all="selectAllTable"
          @edit-actived="editActivedEvent"
          :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true}"
          @keydown="keydown"
          :footer-method="footerMethod"
        >
          <vxe-table-column show-overflow="tooltip" fixed="left" type="index" width="50" title="序号"></vxe-table-column>
          <vxe-table-column show-overflow="tooltip" fixed="left" type="checkbox" width="50"></vxe-table-column>
          <vxe-table-column show-overflow="tooltip" fixed="left" title="操作" width="60">
            <template v-slot="{ row,rowIndex }">
              <a class="blue" @click="openFileModal(row)">查看</a>
            </template>
          </vxe-table-column>
          <vxe-table-column show-overflow="tooltip" fixed="left" field="partCode" title="配件编码"
                            width="100"></vxe-table-column>
          <vxe-table-column show-overflow="tooltip" fixed="left" width="110" field="partName"
                            title="配件名称"></vxe-table-column>
          <vxe-table-column show-overflow="tooltip" fixed="left" field="partBrand" title="品牌"
                            width="80"></vxe-table-column>
          <vxe-table-column
            show-overflow="tooltip"
            field="orderQty"
            title="数量"
            :edit-render="{name: 'input',attrs: {disabled: false}}"
            width="100"
          >
            <template v-slot:edit="{ row }">
              <el-input-number
                style="width:80px;"
                :min="0"
                :max="row.isMarkBatch == 1 ? row.adjustQty : 999999"
                v-model="row.orderQty"
                :controls="false"
                size="mini"
                :precision="0"
              />
            </template>
          </vxe-table-column>
          <vxe-table-column
            show-overflow="tooltip"
            field="orderPrice"
            title="单价"
            width="100"
            :edit-render="{name: 'input' ,attrs: {disabled: false}}"
          >
          </vxe-table-column>
          <vxe-table-column show-overflow="tooltip" title="金额" width="110">
            <template v-slot="{ row }">
              <span>{{ countAmount(row) |priceFilters}}</span>
            </template>
          </vxe-table-column>
          <!-- <vxe-table-column  show-overflow="tooltip" field="averagePrice" title="参考价" width="70"></vxe-table-column> -->
          <vxe-table-column show-overflow="tooltip" field="stockOutQty" title="缺货数量" width="80">
            <template v-slot="{row}">
              <span style="color:#ed4014" v-if="row.stockOutQty*1>0">{{row.stockOutQty}}</span>
              <span v-else>{{row.stockOutQty}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column show-overflow="tooltip" field="oemCode" title="OEM码" width="100"></vxe-table-column>
          <vxe-table-column show-overflow="tooltip" title="品牌车型" width="100">
            <template v-slot="{row,rowIndex}">
              <span>{{row.carBrandName}} {{row.carModelName}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column show-overflow="tooltip" field="unit" title="单位" width="60"></vxe-table-column>
          <vxe-table-column show-overflow="tooltip" field title="批次" width="50">
            <template v-slot="{ row,rowIndex }">
              <Checkbox disabled :value="row.isMarkBatch == 1"></Checkbox>
            </template>
          </vxe-table-column>
          <vxe-table-column show-overflow="tooltip" title="活动" width="50">
            <template v-slot="{ row,rowIndex }">
              <Checkbox disabled :value="row.isMarkActivity == 1"></Checkbox>
            </template>
          </vxe-table-column>
          <vxe-table-column show-overflow="tooltip" title="赠送" width="50">
            <template v-slot="{ row,rowIndex }">
              <Checkbox disabled :value="row.isGift == 1"></Checkbox>
            </template>
          </vxe-table-column>
          <vxe-table-column show-overflow="tooltip" field="storeShelf" title="仓位" width="100"></vxe-table-column>
          <vxe-table-column show-overflow="tooltip"
                            field="remark"
                            title="备注"
                            min-width="120"
                            :edit-render="{name: 'input',attrs: {disabled: false}}"
          ></vxe-table-column>
          <vxe-table-column show-overflow="tooltip" field="spec" title="规格" width="100"></vxe-table-column>
          <vxe-table-column show-overflow="tooltip" field="showDirection" title="方向" width="100"></vxe-table-column>
          <vxe-table-column show-overflow="tooltip" field="partInnerId" title="配件内码" width="120"></vxe-table-column>
        </vxe-table>
      </Form>
    </div>

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
    <goods-info ref="goodsInfo" :guestId="formPlan.guestId" :mainId="formPlan.id" :row='this.formPlan'></goods-info>
    <!--      添加配件-->
    <select-part-com ref="selectPartCom" :guestId="formPlan.guestId" :storeId="formPlan.storeId"
                     @selectPartName="getPartNameList" @throwPartNameList2="getPartNameList2"></select-part-com>
    <!--      批次配件-->
    <barch ref="barch" :guestId="formPlan.guestId" :storeId="formPlan.storeId" @selectPartName="getBarchList"></barch>
    <!--      选择客户-->
    <Select-the-customer ref="AddCustomerModel" @getOne="setOneClient"></Select-the-customer>
    <!--      选择入库单-->
    <Godown-entry ref="GodownEntryModal" @godownList="getGodown" :store-id="formPlan.storeId"></Godown-entry>
    <!--      选择活动-->
    <Activity ref="activity" @getActivity="activiyList"></Activity>
    <!--      查看详情-->
    <See-file ref="fileList" :data="oneRow"></See-file>
    <alot-model ref="AlotModel"></alot-model>
  </div>
</template>

<script>
  import ClientData from "../../../system/essentialData/clientManagement/ClientData";
  import goodsInfo from "../../../AlotManagement/transferringOrder/applyFor/compontents/goodsInfo/GoodsInfo";
  import selectPartCom from "../components/selectPartCom";
  import SelectTheCustomer from "../../commonality/SelectTheCustomer";
  import GodownEntry from "../../commonality/GodownEntry";
  import Activity from "../../commonality/Activity";
  import SeeFile from "../../commonality/SeeFile";
  import * as tools from "../../../../utils/tools";
  import {area} from "@/api/lease/registerApi";
  import {
    getSales,
    getClient,
    getRightList,
    getWarehouseList,
    getLimit,
    getSave,
    getStockOut,
    getSubmitList,
    getAccessories,
    getDeleteList,
    getup,
    getAccessList
  } from "@/api/salesManagment/salesOrder";
  import {getDigitalDictionary} from "@/api/system/essentialData/clientManagement";
  import {getNewClient} from "@/api/system/essentialData/clientManagement";
  import {getClientTreeList} from "@/api/system/essentialData/clientManagement";
  import Cookies from "js-cookie";
  import {TOKEN_KEY} from "@/libs/util";
  import barch from "../batch/selectPartCom";
  import baseUrl from "_conf/url";
  import {conversionList, conversionListNoNum} from "@/components/changeWbList/changewblist";
  import {down} from "@/api/system/essentialData/commoditiesInShortSupply.js"
  import AlotModel from "../components/AlotModel"
  import SalesCus from "../../../../components/allocation/salesCus";

  export default {
    name: "OrderRight",
    inject: ["reload"],
    components: {
      SalesCus,
      ClientData,
      goodsInfo,
      selectPartCom,
      SelectTheCustomer,
      GodownEntry,
      Activity,
      SeeFile,
      barch,
      AlotModel
    },
    data() {
      let changeNumber = ({cellValue}) => {
        const reg = /^[1-9]\d{0,}$/;
        if (!reg.test(cellValue)) {
          return Promise.reject(new Error('数量输入不正确'))
        }
      };

      let money = ({cellValue}) => {
        const reg = /^\d+(\.\d{0,2})?$/i;
        if (!reg.test(cellValue)) {
          return Promise.reject(new Error('最多保留2位小数'))
        }
      };
      let options2DisabledDate = date => {
        const orderDate = this.formPlan.planSendDate;
        if (orderDate) {
          return date && orderDate && date.valueOf() < orderDate;
        } else {
          return true
        }
      };
      return {
        options1: {
          disabledDate(date) {
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
        options2: {
          disabledDate: options2DisabledDate
        },
        formPlan: {
          detailList: [],
          storeId: '',
          orderManId: '',
          planSendDate: ''
          // orderTypeValue:'0'
        }, //获取到数据
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
        provinceArr: [], //获取数据字典地址
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
        salesList: [], //销售员列表
        ruleValidate: {
          guestId: [
            {required: true, type: "string", message: " ", trigger: "change"}
          ],
          orderManId: [
            {required: true, type: "string", message: "  ", trigger: "change"}
          ],
          billTypeId: [
            {required: true, type: "string", message: " ", trigger: "change"}
          ],
          settleTypeId: [
            {required: true, type: "string", message: " ", trigger: "change"}
          ],
          storeId: [
            {required: true, type: "string", message: " ", trigger: "change"}
          ],
          // planSendDate: [
          //   { required: true, type: "date", message: " ", trigger: "change" }
          // ],
        },
        //form表单校验
        validRules: {
          orderQty: [{required: true, validator: changeNumber}],
          orderPrice: [{required: true, validator: money}]
        }, //表格校验
        selectTableList: [], //table表格选中的数据
        door: {
          outStockDoor: true
        },
        ispart: true, //添加配件状态
        rightTableHeight: 0
      };
    },
    mounted() {
      // this.getAdress();
      // this.getAllClient();

      this.getType();/*获取客户属性*/
      this.getWarehouse();/*获取仓库*/
      this.getClassifyList();/*获取新增客户二级分类*/
      this.getAllSales();/*获取销售员*/
    },
    computed: {
      getOneOrder() {
        return this.$store.state.dataList.oneOrder;
      }
    },
    methods: {
      throwNameFun(v){
        console.log(v)
        this.setOneClient(v);
      },

      //------------------------------------------------------------------------//
      //表格tab切换可编辑部位
      async editNextCell($table) {
        // @ts-ignore
        const {row, column, $rowIndex, $columnIndex, columnIndex, rowIndex} = await $table.getActiveRecord() || {}
        if (row) { // 当前为编辑状态
          // console.log('row', row)
          // 当前列属性
          const nowField = column.property
          // 获取展示的列
          const {visibleColumn} = $table.getTableColumn()
          // 当前列属性（可以编辑的属性）
          const columnsField = visibleColumn.reduce((a, v, i) => {
            if (i !== 0 && i !== visibleColumn.length - 1 && v.editRender) { // 不是操作和序号且不可以编辑
              a.push(v.property)
            }
            return a
          }, [])
          const nowIndex = columnsField.findIndex(v => v === nowField)
          // 判断当前是否是可编辑倒数地二行
          const isLastColumn = nowIndex === columnsField.length - 2
          // console.log('isLastColumn', isLastColumn)
          if (isLastColumn) {
            // 插入数据

            // 跳转到下一行
            // 判断当前是否为临时数据
            const isInsertByRow = $table.isInsertByRow(row)
            const ROW_INDEX = isInsertByRow ? await $table.$getRowIndex(row) : rowIndex
            const insertRecords = $table.getInsertRecords() // 临时数据
            let nextRow = {}
            // 不是最后一条临时数据
            if (isInsertByRow && insertRecords.length - 1 !== ROW_INDEX) {
              nextRow = $table.getInsertRecords()[ROW_INDEX + 1]
            } else {
              // 当前是最后一条临时数据
              if (isInsertByRow) {
                nextRow = $table.getData()[0]
              } else {
                nextRow = $table.getData()[ROW_INDEX + 1]
              }
            }
            if (nextRow) {
              await $table.scrollTo(0)
              await $table.setActiveCell(nextRow, columnsField[0])
            }
          } else {
            // 跳转下一个编辑
            await $table.setActiveCell(row, columnsField[nowIndex + 1])
          }
        }
      },

      keydown($event) {
        if ($event.$event.keyCode == 9) {
          this.editNextCell($event.$table)
        }
      },
      openAlot() {
        let detailList = JSON.parse(JSON.stringify(this.formPlan.detailList || []));
        if (!detailList.length) {
          return this.$message.error("该订单中没有配件数据!");
        }
        let arr = detailList.filter(el => el.stockOutQty * 1 > 0);
        let hasOutQty = arr.length > 0 ? true : false;
        if (!hasOutQty) {
          return this.$message.error("明细中无配件缺货！");
        }
        this.$refs.AlotModel.init(this.formPlan.serviceId, arr);
      },
      //获取右侧数据
      async getList() {
        let data = {};
        let stop = this.$loading();
        data.id = this.leftOneOrder.id;
        let res = await getRightList(data);
        if (res.code === 0) {
          stop();
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
      //获取销售员
      selectOrderMan(val) {
        this.formPlan.orderMan = val ? (val.label ? val.label : "") : "";
        this.formPlan.orderManId = val ? (val.value ? val.value : "") : "";
      },
      //获取客户额度
      async getAllLimit() {
        let data = {};
        data.guestId = this.leftOneOrder.guestId;
        data.id = this.leftOneOrder ? this.leftOneOrder.id : ''
        let res = await getLimit(data);
        if (res.code === 0) {
          // console.log(res.data)
          this.limitList = res.data;
        }
      },
      //改变客户
      async changeClient(value) {
        if (!value) {
          return false;
        }
        // console.log(this.client)
        let oneClient = [];
        oneClient = this.client.filter(item => {
          return item.id === value;
        });
        for (let i in oneClient) {
          this.formPlan.billTypeId = oneClient[i].billTypeId;
          this.formPlan.settleTypeId = oneClient[i].settTypeId;
        }
        this.leftOneOrder.guestId = value
        const res = await this.getAllLimit()
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
        if (this.client.length <= 0) {
          let res = await getClient();
          if (res.code === 0) {
            this.client = res.data;
          }
        }
      },
      //获取销售员
      async getAllSales() {
        let res = await getSales();
        if (res.code === 0) {
          this.salesList = res.data.content;
          this.salesList.map(item => {
            item.label = item.userName;
          });
        }
      },
      //是否禁用
      checkMethod() {
        return this.draftShow == 0
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
        this.getAdress();
        this.getClassifyList();
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
        count = count.toFixed(2);
        this.totalMoney = count;
        return count;
      },
      //获取尾部总数
      footerMethod({columns, data}) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return "合计";
            }
            // if (["orderPrice"].includes(column.property)) {
            //     return this.$utils.sum(data, column.property).toFixed(2);
            // }
            if (columnIndex === 6) {
              return this.$utils.sum(data, column.property);
            }
            // if (columnIndex === 7) {
            //     return ` ${this.countAllPrice(data)} `;
            // }
            if (columnIndex === 8) {
              return ` ${this.countAllAmount(data)} `;
            }
            return null;
          })
        ];
      },
      //下载模板
      down() {
        // location.href =
        //   baseUrl.omsOrder +
        //   "/sellOrderMain/template?access_token=" +
        //   Cookies.get(TOKEN_KEY);
        down('2200000000');
      },
      //批量上传失败
      onFormatError(file) {
        this.$Message.error("只支持xls xlsx后缀的文件");
      },
      // 上传成功函数
      onSuccess(response) {
        if (response.code == 0) {
          let txt = "上传成功";
          if (response.data.length > 0) {
            this.warning(response.data)
          }else{
            this.$Notice.warning({
              title: "导入成功",
              desc: txt,
              duration: 0
            });
          }
          this.getList()
        } else {
          this.$Message.error(response.message);
        }
      },
      warning(nodesc) {
        let str=""
        if(nodesc.length>0){
          nodesc.map((item,index)=>{
            if(index!=nodesc.length-1){
              str+=`${item}<br/>`
            }else{
              str+=`${item}`
            }
          })
        }
        this.$Notice.warning({
          title: "上传错误信息",
          desc: str,
          duration:0
        });
      },
      //上传之前清空
      beforeUpload() {
        this.$refs.upload.clearFiles();
      },
      //打开收货地址
      openAddressShow() {
        if (!this.formPlan.id) {
          return this.$message.error("请先保存销售单")
        }
        this.$refs.goodsInfo.init();
      },
      //确认收货地址
      changeShippingAddress() {
      },
      //打开添加配件模态框
      addMountings() {
        if (!this.formPlan.guestId) {
          return this.$message.error("请先选择客户!")
        }
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
            data.push({id: item.id});
          });
          const arr = this.formPlan.detailList.filter(
            item => !this.selectTableList.includes(item)
          );
          this.formPlan.detailList = arr;
          if (!data[0].id) return;
          getDeleteList(data).then(res => {
            if (res.code === 0) {
              this.$message.success(res.data);
              this.$parent.$parent.$refs.OrderLeft.tableData.map(
                (item, index) => {
                  if (item.id === this.formPlan.id) {
                    this.$set(
                      this.$parent.$parent.$refs.OrderLeft.tableData[index],
                      "detailList",
                      arr
                    );
                  }
                }
              );
            }
          });
        } else {
          this.$message.error("请选择一条有效数据");
        }
      },
      //计划发货日期
      getplanSendDate(data) {
        const orderDate = this.formPlan.planSendDate;
        console.log(this.formPlan, 111)
        console.log(data, 222)
        this.options2 = {
          disabledDate(date) {
            return date && orderDate && date.valueOf() < new Date(orderDate);
          }
        };
        this.formPlan.planArriveDate = "";
      },
      //计划到货日期
      getplanArriveDate(data) {
        this.formPlan.planArriveDate = data;
      },
      //配件返回的参数
      getPartNameList(val) {
        let vals = conversionList(val);
        this.formPlan.detailList = [
          ...this.formPlan.detailList,
          ...conversionList(val)
        ];
        this.formPlan.detailList.forEach(el => {
          if (!el.orderQty) {
            el.orderQty = 1;
          }
          if (!(el.orderPrice * 1)) {
            el.orderPrice = undefined;
          }
        });
        this.$Message.success("已添加");
      },

      //配件返回的参数
      getPartNameList2(val) {
        this.formPlan.detailList = [
          ...this.formPlan.detailList,
          ...conversionListNoNum(val)
        ];
        this.formPlan.detailList.forEach(el => {
          if (!el.orderQty) {
            el.orderQty = 1;
          }
          if (!(el.orderPrice * 1)) {
            el.orderPrice = undefined;
          }
        });
        this.$Message.success("已添加");
      },

      // 批次配件
      async getBarchList(val) {
        val.map(item => {
          if (!item.orderQty) {
            item.orderQty = undefined;
          }
          if (!(item.orderPrice * 1)) {
            item.orderPrice = undefined;
          }
          item.isMarkBatch = 1;
          item.batchSourceId = item.id || item.batchSourceId;
          item.adjustQty = item.outableQty;
          Reflect.deleteProperty(item, 'id');
        });
        this.formPlan.detailList = [
          ...this.formPlan.detailList,
          ...val
        ]
      },
      //打开客户选择
      openAddCustomer() {
        this.$refs.AddCustomerModel.openModel();
      },
      //打开选择入库单
      openGodownEntryModal() {
        if (!this.formPlan.storeId) {
          this.$message.error("请选择交货仓库");
        } else {
          this.$refs.GodownEntryModal.reset();
          this.$refs.GodownEntryModal.openModal(this.formPlan.storeId);
        }
      },
      //打开活动
      openActivityModal() {
        if (!this.$parent.$parent.$refs.OrderLeft.selectItemId) {
          return this.$message.error("请先保存单据!");
        }
        this.$refs.activity.openModal();
      },
      //获取活动内的数据
      async activiyList(arr) {
        let data = {};
        arr = arr.map(el => {
          el.isMarkActivity = 1;
          el.orderPrice = el.price;
          return el;
        });
        for (let key in this.formPlan) {
          if (this.formPlan[key]) {
            data[key] = this.formPlan[key]
          }
        }
        data.planSendDate ? data.planSendDate = tools.transTime(data.planSendDate) : "";
        data.planArriveDate ? data.planArriveDate = tools.transTime(data.planArriveDate) : "";
        data.detailList = arr;
        let res = await getAccessories(data);
        if (res.code === 0) {
          // this.getList();
          // this.reload();
          this.$parent.$parent.$refs.OrderLeft.gitlistValue()
        }
      },
      //打开查看模态框
      openFileModal(row) {
        this.oneRow = row;
        this.$nextTick(function () {
          this.$refs.fileList.openModal(this.leftOneOrder.guestId);
        });
      },
      //保存
      save() {
        // if(!this.formPlan.planSendDate) {
        //   return this.$Message.error("*为必填项");
        // }
        this.$refs.formPlan.validate(async valid => {
          let zero = tools.isZero(this.formPlan.detailList, {qty: "orderQty", price: "orderPrice"});
          if (zero) return;
          if (valid) {
            try {
              await this.$refs.xTable.validate();
              // if (+this.totalMoney > +this.limitList.sumAmt) {
              //     return this.$message.error("可用余额不足");
              // }
              let data = JSON.parse(JSON.stringify(this.formPlan));
              data.planSendDate ? data.planSendDate = tools.transTime(data.planSendDate) : "";
              data.planArriveDate ? data.planArriveDate = tools.transTime(data.planArriveDate) : "";
              let res = await getSave(data);
              if (res.code === 0) {
                this.$Message.success("保存成功");
                this.$parent.$parent.isAdd = false;
                this.$store.commit("setleftList", res);
                this.$refs.formPlan.resetFields();
                this.limitList = {};
                // this.reload();
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
        this.$set(this.formPlan, "billTypeId", val.billTypeId);
        this.$set(this.formPlan, "settleTypeId", val.settTypeId);
        this.leftOneOrder.guestId = val.id
        this.getAllLimit()
      },
      //判断表格能不能编辑
      editActivedEvent({row}) {
        let xTable = this.$refs.xTable;
        let orderQtyColumn = xTable.getColumnByField("orderQty");
        let orderPriceColumn = xTable.getColumnByField("orderPrice");
        let remarkColumn = xTable.getColumnByField("remark");
        let isDisabled = this.draftShow != 0;
        orderQtyColumn.editRender.attrs.disabled = isDisabled;
        orderPriceColumn.editRender.attrs.disabled = isDisabled;
        if (row.isMarkActivity == 1) {
          orderQtyColumn.editRender.attrs.disabled = false;
          orderPriceColumn.editRender.attrs.disabled = true;
        }
        remarkColumn.editRender.attrs.disabled = isDisabled;
      },
      //出库
      stockOut() {
        let str = '是否确定出库';
        if (this.formPlan.orderAmt * 1 == 0) {
          str = '存在配件单价为0，是否确定出库';
        }
        //this.formPlan.planSendDate = new Date(this.formPlan.planSendDate)
        this.$Modal.confirm({
          title: str,
          onOk: () => {
            if (this.door.outStockDoor) {
              let data = JSON.parse(JSON.stringify(this.formPlan));
              this.door.outStockDoor = false;
              this.$refs.formPlan.validate(async valid => {
                if (valid) {
                  try {
                    await this.$refs.xTable.validate();
                    if (+this.totalMoney > +this.limitList.sumAmt) {
                      return this.$message.error("可用余额不足");
                    }
                    data.planSendDate = tools.transTime(data.planSendDate)
                    data.planArriveDate = tools.transTime(data.planArriveDate)
                    let res = await getStockOut(data);
                    if (res.code === 0) {
                      this.$Message.success("出库成功");
                      this.$store.commit("setleftList", res);
                      this.door.outStockDoor = true;
                      return res;
                    } else {
                      this.door.outStockDoor = true;
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
            }
          },
          onCancel: () => {
            this.$Message.info('已取消出库');
          },
        })
      },
      //提交
      submitList() {
        // if(!this.formPlan.planSendDate) {
        //   return this.$Message.error("*为必填项");
        // }
        this.$refs.formPlan.validate(async valid => {
          let zero = tools.isZero(this.formPlan.detailList, {qty: "orderQty", price: "orderPrice"});
          if (zero) return;
          if (valid) {
            try {
              await this.$refs.xTable.validate();
              if (+this.totalMoney > +this.limitList.sumAmt) {
                return this.$message.error("可用余额不足");
              }
              let data = JSON.parse(JSON.stringify(this.formPlan));
              data.planSendDate ? data.planSendDate = tools.transTime(data.planSendDate) : "";
              data.planArriveDate ? data.planArriveDate = tools.transTime(data.planArriveDate) : "";
              let orderList = [];
              orderList = data.detailList.filter(
                item => item.orderPrice * 1 < item.averagePrice * 1
              );
              if (orderList.length > 0) {
                let text = "";
                orderList.forEach(item => {
                  text += `<p>${item.partName}的销售价格低于进货价</p>`;
                });
                let timer = null;
                clearTimeout(timer);
                timer = setTimeout(() => {
                  this.$Modal.confirm({
                    title: "提示",
                    content: text,
                    onOk: async () => {
                      let res = await getSubmitList(data);
                      if (res.code === 0) {
                        this.$Message.success("提交成功");
                        this.$parent.$parent.isAdd = false;
                        this.$parent.$parent.orderlistType.value = 1;
                        this.limitList = {};
                        this.$store.commit("setleftList", res);
                        this.$refs.formPlan.resetFields();
                      }
                    },
                    onCancel: () => {
                    }
                  });
                }, 500);
              } else {
                let res = await getSubmitList(data);
                if (res.code === 0) {
                  this.$Message.success("提交成功");
                  this.$parent.$parent.isAdd = false;
                  this.limitList = {};
                  this.$store.commit("setleftList", res);
                  this.$refs.formPlan.resetFields();
                  // this.reload();
                }
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
      async getGodown(val,b) {
        let data = JSON.parse(JSON.stringify(this.formPlan));
        if (data.planSendDate) {
          data.planSendDate = tools.transTime(data.planSendDate)
        }
        if (data.planArriveDate) {
          data.planArriveDate = tools.transTime(data.planArriveDate)
        }
        val.details.map(item => {
          item.isMarkBatch = 1;
          item.adjustQty = item.outableQty;
        });
        data.detailList = val.details;
        data.sign = b;
        let res = await getAccessories(data);
        if (res.code === 0) {
          // this.getList();
          // this.reload();
          this.$parent.$parent.parentGetleft();
        }
      },
      getRUl(val) {
        this.upurl = getup + "id=" + this.formPlan.id;
      }
    },
    watch: {
      getOneOrder: {
        handler(old, ov) {
          this.$parent.$parent.ispart = false;
          if (!old.id) {
            this.formPlan = Object.assign({}, {
                billStatusId: {name: "草稿", value: 0},
                detailList: [],
                storeId: this.formPlan.storeId,
                orderTypeValue: 0,
                orderManId: this.$store.state.user.userData.id,
                orderMan: this.$store.state.user.userData.staffName,
                guestId: this.formPlan.guestId
              }
            );
            this.draftShow = 0;
            this.leftOneOrder = this.formPlan
            return false;
          }
          this.leftOneOrder = old;
          this.getList();
          this.getAllLimit();
        },
        // deep: true
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
    margin-bottom: 0px;
  }

  .purchase >>> .ivu-form-item .ivu-form-item-label {
    font-size: 12px !important;
  }

  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }

  .plan-cz-btn .ivu-btn-small {
    font-size: 12px;
  }
</style>
