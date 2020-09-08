<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <!--      主菜单导航-->
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>
            <Select v-model="purchaseType" class="w90 mr10">
              <Option
                v-for="item in purchaseTypeArr"
                :value="item.value"
                :key="item.value"
              >{{item.label}}</Option>
            </Select>
          </div>
          <div class="db">
            <Button type="default" @click="More" class="mr10">
              <i class="iconfont mr5 iconchaxunicon"></i>更多
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="addProoo" v-has="'add'">
              <Icon type="md-add" />新增
            </Button>
          </div>
          <div class="db">
            <Button
              @click="baocun"
              v-has="'save'"
              type="default"
              class="mr10"
              :disabled="this.Leftcurrentrow.status.value !== 0"
              :loading="saveLoading"
            >
              <i class="iconfont mr5 iconbaocunicon"></i>保存
            </Button>
          </div>
          <!-- <div class="db">
            <Button class="mr10" @click="audit">
              <Icon type="md-checkmark" size="14" />审核
            </Button>
          </div>-->
          <div class="db">
            <Button
              class="mr10"
              @click="sureEditPro"
              v-has="'submit'"
              :disabled="this.Leftcurrentrow.status.value !== 0"
              :loading="commitLoading"
            >
              <Icon type="md-checkmark" size="14" />提交
            </Button>
          </div>
          <div class="db">
            <Button
              class="mr10"
              @click="cancellation"
              v-has="'cancellation'"
              :disabled="this.Leftcurrentrow.status.value !== 0"
              :loading="cancelLoading"
            >
              <Icon type="md-close" size="14" />作废
            </Button>
          </div>
          <div class="db">
            <Button
              class="mr10"
              @click="printTable"
              v-has="'print'"
              :disabled="this.Leftcurrentrow.status.value === 5"
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
          <Split v-model="split1" min="200" max="500" @on-moving="getDomHeight">
            <div slot="left" class="con-split-pane-left" style="overflow-y: auto; height: 100%;">
              <div class="pane-made-hd">配件组装列表</div>
              <Table
                :height="leftTableHeight"
                @on-current-change="selectTabelData"
                size="small"
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
                show-sizer
                show-total
                class-name="page-con"
                @on-change="changePage"
                @on-page-size-change="changeSize"
                :page-size-opts="[20, 50, 100, 200]"
                class="mr10"
              ></Page>
            </div>
            <div slot="right" class="con-split-pane-right pl5 goods-list-form">
              <div class="pane-made-hd">配件组装信息</div>
              <div class="clearfix purchase" ref="planForm">
                <Form
                  inline
                  :rules="ruleValidate"
                  ref="Leftcurrentrow"
                  :label-width="100"
                  :model="Leftcurrentrow"
                >
                  <FormItem label="移出仓库" prop="storeId">
                    <Select
                      v-model="Leftcurrentrow.storeId"
                      style="width:100px"
                      :disabled="Leftcurrentrow.status.value !== 0"
                    >
                      <Option
                        v-for="item in warehouseList"
                        :disabled="item.isDisabled"
                        :value="item.id"
                        :key="item.id"
                      >{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="移入仓库" prop="receiveStoreId">
                    <Select
                      v-model="Leftcurrentrow.receiveStoreId"
                      style="width:100px"
                      :disabled="Leftcurrentrow.status.value !== 0"
                    >
                      <Option
                        v-for="item in warehouseList"
                        :disabled="item.isDisabled"
                        :value="item.id"
                        :key="item.id"
                      >{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="业务员：" prop="orderManId">
                    <Select
                      :value="Leftcurrentrow.orderManId"
                      @on-change="selectOrderMan"
                      filterable
                      style="width: 240px"
                      :disabled="Leftcurrentrow.status.value !== 0"
                      label-in-value
                    >
                      <Option
                        v-for="item in salesList"
                        :value="item.id"
                        :key="item.id"
                      >{{ item.label }}</Option>
                    </Select>
                    <!-- <Input
                      v-model="Leftcurrentrow.createUname"
                      class="w160"
                      :disabled="Leftcurrentrow.status.value !== 0"
                    />-->
                  </FormItem>
                  <FormItem label="移仓日期" prop="auditDate">
                    <DatePicker
                      :value="Leftcurrentrow.auditDate"
                      format="yyyy-MM-dd HH:mm:ss"
                      @on-change="commitDate"
                      type="datetime"
                      class="w160"
                      :disabled="Leftcurrentrow.status.value !== 0"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="移仓单号" prop="planOrderNum">
                    <Tooltip :content="Leftcurrentrow.serviceId">
                    <Input
                      disabled="disabled"
                      class="w160"
                      v-model="Leftcurrentrow.serviceId"
                      value="YCSDFD839239320"
                    />
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
                      v-has="'addPro'"
                      :disabled="Leftcurrentrow.status.value !== 0"
                    >
                      <Icon type="md-add" />添加配件
                    </Button>
                  </div>
                  <div class="fl mb5">
                    <Poptip placement="bottom">
                      <Button class="mr10" size="small"
                              :disabled="Leftcurrentrow.status.value !== 0||Leftcurrentrow.xinzeng=='1'" v-has="'import'">导入
                      </Button>
                      <div slot="content" class="flex" style="justify-content: space-between">
                        <div class="flex mr10">
                          <Upload
                            ref="upload1"
                            :show-upload-list="false"
                            :action="upurlInnerId"
                            :format="['xlsx', 'xls', 'csv']"
                            :headers="headers"
                            :before-upload="handleBeforeUploadInnerId"
                            :on-success="handleSuccess"
                            :on-format-error="onFormatError"
                          >
                            <Button
                              size="small"
                              class="mr10"
                            >配件内码导入</Button>
                          </Upload>
                        </div>
                        <div class="flex">
                          <Upload
                            ref="upload"
                            :show-upload-list="false"
                            :action="upurl"
                            :format="['xlsx', 'xls', 'csv']"
                            :headers="headers"
                            :before-upload="handleBeforeUpload"
                            :on-success="handleSuccess"
                            :on-format-error="onFormatError"
                          >
                            <Button
                              size="small"
                              class="mr10"
                            >编码品牌导入</Button>
                          </Upload>
                        </div>
                      </div>
                    </Poptip>
                  </div>
                  <div class="fl mb5 mr10">
                    <Poptip placement="bottom">
                      <Button size="small">
                        <Icon custom="iconfont iconxiazaiicon icons" />下载模板
                      </Button>
                      <div slot="content">
                        <Button size="small" class="mr10" @click="downInnerId"><Icon custom="iconfont iconxiazaiicon icons" />配件内码模板</Button>
                        <Button size="small" @click="down">
                          <Icon custom="iconfont iconxiazaiicon icons" />编码品牌模板
                        </Button>
                      </div>
                    </Poptip>
                  </div>
                  <div class="fl mb5">
                    <Button
                      size="small"
                      class="mr10"
                      @click="deletePar"
                      v-has="'deletePar'"
                      :disabled="Leftcurrentrow.status.value !== 0"
                    >
                      <i class="iconfont mr5 iconlajitongicon"></i> 删除
                    </Button>
                  </div>
                </div>
              </div>
              <vxe-table
                ref="xTable1"
                border
                resizable
                auto-resize
                show-overflow
                :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true}"
                @keydown="keydown"
                :height="rightTableHeight"
                :data="Right.tbdata"
                :footer-method="addFooter"
                :edit-config="{trigger: 'click', mode: 'cell'}"
                @edit-actived="editActivedEvent">
              >
                <vxe-table-column  show-overflow="tooltip" type="seq" title="序号" fixed="left" width="60"></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip" type="checkbox" fixed="left"  width="60"></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip" field="partCode" title="配件编码" fixed="left" width="100"></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip" field="partName" title="配件名称" fixed="left" width="100"></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip" field="partBrand" title="品牌" fixed="left" width="100"></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip"
                  field="orderQty"
                  title="数量"
                  width="100"
                  :edit-render="{name: 'input', attrs: {type: 'number',disabled: false},events: {change: numChangeEvent}}"
                ></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip" field="stockOutQty" title="缺货数量" width="100"></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip" field="carModelName" title="品牌车型" width="100"></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip" field="unit" title="单位" width="100"></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip" field="oemCode" title="OE码" width="100"></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip" field="spec" title="规格" width="100"></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip" field="date12" title="方向" width="100"></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip" field="partInnerId" title="配件内码" width="120"></vxe-table-column>
              </vxe-table>
            </div>
          </Split>
        </div>
      </div>
    </section>
    <!--添加配件-->
    <Select-part-com ref="SelectPartRef" @selectPartName="getPartNameList" :keyType="1" :storeId="Leftcurrentrow.storeId"></Select-part-com>
    <!--更多弹框-->
    <More :getShowMore="showMore" @getMoreStatus="getMoreStatus" @getMoreData="getMoreData"></More>
    <!-- 作废提示 -->
    <Modal v-model="showRemove" title="提示" @on-ok="removeOk" @on-cancel="removeCancel">
      <p>是否确定作废</p>
    </Modal>
    <!-- 审核提示 -->
    <!-- <Modal v-model="showAudit" title="提示" @on-ok="auditOK" @on-cancel="auditCancel">
      <p>是否确定审核</p>
    </Modal>-->
    <!-- 打印 -->
    <Print-show ref="printBox"></Print-show>
  </div>
</template>

<script>
  import {
    upxlxsMoveStore/**编码品牌导入配件*/,
    upxlxsInnerIdMoveStore/**内码导入配件*/
  } from "_api/purchasing/purchasePlan";
import {
  getLeftList,
  getstate, //仓库数据
  getRightDatas, //获取右边数据
  updata, ////保存
  getSubmitList, //提交
  getCancellation, //作废
  delectTable, //删除
  getPrint //打印
  // getSubmitList,//提交
  // getCancellation,//作废
  // getDataQuickList,
  // getDataTypeList,
  // saveDataList,
  // submitDataList,
  // outDataList,
  // removeDataList,
  // stampDataList,
  // stampApplyDataList
} from "../../../../api/business/moveStorehouse.js";
import "../../../lease/product/lease.less";
import moment from "moment";
import QuickDate from "../../../../components/getDate/dateget";
import SelectPartCom from "../../../salesManagement/salesOrder/components/selectPartCom";
import PrintShow from "./components/PrintShow";
import More from "./components/More";
import { conversionList } from "@/components/changeWbList/changewblist";
import { transferWarehousing } from "../../../../api/bill/saleOrder";
import {getSales} from "@/api/salesManagment/salesOrder";
import * as tools from "_utils/tools";
  import {down } from "@/api/system/essentialData/commoditiesInShortSupply.js"
  import { TOKEN_KEY } from "@/libs/util";
  import Cookies from "js-cookie";
export default {
  name: "moveStorehouse",
  components: {
    QuickDate,
    PrintShow,
    More,
    SelectPartCom
  },
  data() {
    return {
      saveLoading: false,
      commitLoading: false,
      cancelLoading: false,
      salesList: [], //业务员列表
      flag: 0,
      numberValue: "",
      mainid: "",
      split1: 0.2,
      tabIndex: 0,
      queryTime: "", //快速查询时间
      curronly: false,
      purchaseType: 99, //查询选项
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
          label: "已提交",
          value: 1
        },
        {
          label: "已审核",
          value: 2
        },
        {
          label: "已作废",
          value: 3
        }
      ],
      showMore: false, //更多模块的弹框
      //左侧表格高度
      leftTableHeight: 0,
      Left: {
        loading: false,
        page: {
          num: 1,
          size: 20,
          total: 0
        },
        columns: [
          {
            title: "序号",
            type: "index",
            minWidth: 50
          },
          {
            title: "状态",
            key: "statuName",
            minWidth: 70
          },
          {
            title: "移仓日期",
            key: "auditDate",
            minWidth: 170
          },
          {
            title: "业务员",
            key: "orderMan",
            minWidth: 120
          },
          {
            title: "移仓单号",
            key: "serviceId",
            minWidth: 140
          },
          {
            title: "打印次数",
            key: "printing",
            minWidth: 200
          },
          {
            title: "创建人",
            key: "createUname",
            minWidth: 100
          },
          {
            title: "创建日期",
            key: "createTime",
            minWidth: 170
          },
          {
            title: "提交人",
            key: "commitUname",
            minWidth: 170
          },
          {
            title: "提交日期",
            key: "commitDate",
            minWidth: 170
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
      salesman: "",
      // 所需零件数据
      components: [],
      //右侧表格高度
      rightTableHeight: 0,
      //配件组装信息 表单model
      formModel: [],
      warehouseList: [],
      Leftcurrentrow: {
        status: {
          value: 1
        },
        storeId: "", //移入
        receiveStoreId: "", //移出
        orderMan: "", //业务员
        orderManId:"",
        auditDate: "", //移仓日期
        serviceId: "", //移仓单号
        detailVOList: []
      }, //右边所有数据（含提交）
      ruleValidate: {
        storeId: [
          { required: true, message: "请选择移除仓库", trigger: "change" }
        ],
        receiveStoreId: [
          { required: true, message: "请选择移入仓库", trigger: "change" }
        ],
        orderManId: [
          { required: true, message: "业务员不能为空", trigger: "blur" }
        ],
        auditDate: [
          { required: true, message: "移仓时间不为空", trigger: "change" }
        ]
      },
      showAudit: false, //审核提示
      showRemove: false, //作废提示
      isAddRight: true, //判断右侧是有数据
      showBayer: false, //出库方弹窗
      rightTableStatus: "", //右侧表格状态

      saveButClick:false,//点击保存临时屏蔽保存按钮功能
      leftClickItemId:'',
      upurl:'',//编码品牌导入配件地址
      upurlInnerId:"",//内码导入配件地址
      headers: {
        Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
      },
    };
  },
  watch: {
    purchaseType: function(val, old) {
      // console.log(val, old);
      this.Left.page.num = 1;
      this.Left.page.size = 20;
      this.getList();
    },
    Leftcurrentrow: {
      handler(newVal) {
        this.Leftcurrentrow = newVal;
      },
      deep: true
    }
  },
  created() {
    this.getAllSales();
  },
  methods: {

    //------------------------------------------------------------------------//
    //表格tab切换可编辑部位
    async editNextCell($table){
      // @ts-ignore
      const { row, column, $rowIndex, $columnIndex, columnIndex, rowIndex } = await $table.getActiveRecord() || {}
      if (row) { // 当前为编辑状态
        // console.log('row', row)
        // 当前列属性
        const nowField = column.property
        // 获取展示的列
        const { visibleColumn } = $table.getTableColumn()
        // 当前列属性（可以编辑的属性）
        const columnsField = visibleColumn.reduce((a, v, i) => {
          if (i !== 0 && i !== visibleColumn.length - 1 && v.editRender) { // 不是操作和序号且不可以编辑
            a.push(v.property)
          }
          return a
        }, [])
        const nowIndex = columnsField.findIndex(v => v === nowField)
        // 判断当前是否是可编辑倒数地二行
        const isLastColumn = nowIndex === columnsField.length - 1
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

    keydown($event){
      if ($event.$event.keyCode == 9){
        this.editNextCell($event.$table)
      }
    },

    //------------------------------------------------------------------------//
    //获取销售员
    selectOrderMan(val) {
      this.Leftcurrentrow.orderMan = val ? val.label ? val.label : '':'';
      this.Leftcurrentrow.orderManId = val ? val.value ? val.value : '':'';
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
    // 禁用选中
    checkMethod({ row }) {
      if (this.Leftcurrentrow.status.value === 0) {
        return true
      }
    },
    numChangeEvent({ row }, evnt) {
      this.numberValue = evnt.target.value;
    },
    //获取左侧列表
    getList() {
      //获取左边数据
      let data = {};
      if (this.purchaseType == "-1") {
        this.purchaseType = null;
      }
      if (this.queryTime) {
        data.createStartDate = this.queryTime[0] || "";
        data.createEndDate = this.queryTime[1] || "";
      }
      data.status = "";
      if(this.purchaseType!=99){
        data.status = this.purchaseType;
      }

      let page = this.Left.page.num - 1;
      let size = this.Left.page.size;
      getLeftList(data, page, size).then(res => {
        if (res.code === 0) {
          // this.salesman = res.data.content[0].updateUname;
          if (!res.data.content) {
            this.Left.tbdata = [];
            this.Left.page.total = 0;
          } else {
              // console.log(res.data)
            res.data.content.map((item, index) => {
              item["index"] = index + 1;
              item["statuName"] = item.status.name;
            });
            this.Left.tbdata = res.data.content || [];
            this.Left.page.total = res.data.totalElements;
            if(this.leftClickItemId){
              for(let b of this.Left.tbdata){
                if(b.id==this.leftClickItemId){
                  b._highlight = true;
                  this.selectTabelData(b);
                }
              }
            }else{
              if(this.Left.tbdata.length>0){
                let firstData = this.Left.tbdata[0];
                firstData._highlight = true;
                this.selectTabelData(firstData);
              }
            }
          }
        }
      });
      // .catch(err => {
      //   // this.$Message.info("获取移仓列表失败");
      // });
      // console.log(this.$store.state.user.userData);
    },
    //获取表格高度
    getDomHeight() {
      this.$nextTick(() => {
        let wrapH = this.$refs.paneLeft.offsetHeight;
        let planFormH = this.$refs.planForm.offsetHeight;
        let planBtnH = this.$refs.planBtn.offsetHeight;
        // let planPageH = this.$refs.planPage.offsetHeight;
        //获取左侧侧表格高度
        this.leftTableHeight = wrapH - 104;
        //获取右侧表格高度
        this.rightTableHeight = wrapH - planFormH - planBtnH - 38;
      });
    },
    //判断表格能不能编辑
    editActivedEvent({row}){
      let xTable = this.$refs.xTable1;
      let orderQtyColumn = xTable.getColumnByField("orderQty");
      orderQtyColumn.editRender.attrs.disabled = this.Leftcurrentrow.status.value !== 0;

    },
    //切换tab
    setTab(index) {
      this.tabIndex = index;
      if (this.tabIndex == 1) {
        // console.log("配件拆分");
      }
    },
    //快速查询日期
    getDataQuick(v) {
      this.queryTime = v;
      this.Left.page.num = 1;
      // this.Left.page.size = 20;
      this.getList();
    },
    //改变移仓时间
    commitDate(data) {
      this.Leftcurrentrow.auditDate = data;
    },
    //更多按钮
    More() {
      this.showMore = true;
    },
    //更多弹窗恢复false
    getMoreStatus(val) {
      this.showMore = val;
    },
    //更多搜索接收调拨申请列表
    getMoreData(val) {
      this.Left.tbdata = val.data.content;
      this.Left.page.total = val.data.totalElements;
    },
    //新增
    addProoo() {
      if (this.Left.tbdata.length !== 0) {
        if (this.Left.tbdata[0]["xinzeng"] === "1") {
          this.$Message.info(
            "当前列表已有一个新增单等待操作,请先保存当前操作新增单据"
          );
          return;
        }
      }
      this.leftClickItemId = "";
      this.Left.tbdata.map((item, index) => {
        item._highlight = false;
      });
      this.$refs.Leftcurrentrow.resetFields();
      const item = {
        index: 1,
        xinzeng: "1",
        status: {
          enum: "DRAFT",
          name: "草稿",
          value: 0
        },

        statuName: "草稿",
        serviceId: "",
        printing: "",
        createUname: this.$store.state.user.userData.staffName,
        createdUid:this.$store.state.user.userData.id,
        commitUname: "",
        detailVOList: [],
        //业务员-业务员id
        orderMan:"",
        orderManId:this.$store.state.user.userData.id || "",
        //移仓时间
        auditDate:tools.transTime(new Date()),

        _highlight: true
      };
      this.flag = 1;
      this.Leftcurrentrow = item;
      // this.Leftcurrentrow.createUname = item.createUname;
      // this.Leftcurrentrow.xinzeng = "1";
      this.Right.tbdata = [];
      this.Left.tbdata.unshift(item);
      this.Left.tbdata.map((item, index) => {
        item.index = index + 1;
      });
      // let TrowLeft = {} //新增左侧
      // this.isAddRight = false
      // this.Left.tbdata.unshift(TrowLeft)
    },
    //保存
    baocun() {
      this.Leftcurrentrow.auditDate=tools.transTime(this.Leftcurrentrow.auditDate)
      if(this.saveButClick){
        return
      }
      this.saveButClick = true;

      let zero = tools.isZero(this.Right.tbdata, {qty: "orderQty",});
      if(zero) return this.saveButClick = false;

      if (!this.Leftcurrentrow.serviceId) {
        if (this.Leftcurrentrow.xinzeng !== "1") {
          this.saveButClick = false;
          return this.$Message.info("请先选择移仓单");
        }
      }
      // if (
      //   !this.Leftcurrentrow.receiveStoreId ||
      //   !this.Leftcurrentrow.storeId ||
      //   !this.Leftcurrentrow.createUname ||
      //   !this.Leftcurrentrow.serviceId
      // ) {
      //   this.$Message.error("请填写移仓信息");
      //   return;
      // }
      if (
        this.Leftcurrentrow.status.value &&
        this.this.Leftcurrentrow.status.value !== 0
      ) {
        this.$Message.error("只有草稿状态才能保存");
        this.saveButClick = false;
        return;
      }
      if (this.numberValue&&this.numberValue <=0) {
        this.$Message.error("数量须大于0");
        this.saveButClick = false;
        return;
      }
      // this.Leftcurrentrow.auditDate = this.Leftcurrentrow.commitDate;
      this.Leftcurrentrow.detailVOList = [...this.Right.tbdata];
      const params = JSON.parse(JSON.stringify(this.Leftcurrentrow));
      if(params.xinzeng==1){
          params.commitUname='';
      }
      this.$refs.Leftcurrentrow.validate(valid => {
        if (valid) {
          //成功
          this.flag = 0;
          this.saveLoading = true
          updata(params)
            .then(res => {
              this.saveButClick = false
              if (res.code == 0) {
                // console.log(res, "res=>616");
                this.$Message.success("保存成功");
                this.getList();
                this.Leftcurrentrow.serviceId = "";
                this.Leftcurrentrow.xinzeng = 2;
                this.$refs.Leftcurrentrow.resetFields();
              }
              this.saveLoading = false
            })
            .catch(e => {
              this.saveButClick = false;
              this.saveLoading = false;
              this.$Message.info("保存失败");
            });
        } else {
          this.saveButClick = false;
          this.saveLoading = false;
          this.$Message.error("*都是必填项");
        }
      });
    },
      //确认提交
      sureEditPro(){
          this.$Modal.confirm({
              title: '提示',
              content: '<p>确认要提交么?</p>',
              onOk: () => {
                  this.editPro()
              },
          });
      },
    // 提交
    editPro() {
      if (
        this.Leftcurrentrow.status.value &&
        this.this.Leftcurrentrow.status.value !== 0
      ) {
        this.$Message.error("只有草稿状态才能保存");
        return;
      }
        if (this.numberValue <=0) {
            this.$Message.error("数量须大于0");
            this.saveButClick = false;
            return;
        }
      let zero = tools.isZero(this.Right.tbdata, {qty: "orderQty",});
      if(zero) return;

      this.Leftcurrentrow.billStatusId = 1;
      this.Leftcurrentrow.detailVOList = [...this.Right.tbdata];
      const params = JSON.parse(JSON.stringify(this.Leftcurrentrow));
      this.commitLoading = true;
      getSubmitList(params)
        .then(res => {
          if (res.code == 0) {
            this.getList();
            this.$Message.success("提交成功");
            this.flag = 0;
          }
          this.commitLoading = false;

        })
        .catch(e => {
          this.$Message.info("提交失败");
          this.commitLoading = false;
        });
    },
    //作废
    //作废提示
    cancellation() {
      this.showRemove = true;
    },
    //确认作废
    removeOk() {
      // if(this.Leftcurrentrow.xinzeng === '1') {
      //   this.$Message.info('请先保存新增加工单')
      //     return
      // }
      if (!this.Leftcurrentrow.id) {
        this.$Message.info("请先选择盘点单");
        return;
      }
      if (this.Leftcurrentrow.status.value !== 0) {
        this.$Message.info("只有草稿状态加工单能进行作废操作");
        return;
      }
      const data = {};
      data.id = this.Leftcurrentrow.id;
      // if(this.draftShow && this.draftShow !== 0) {
      //   this.$Message.error('只有草稿状态才能作废')
      // }
      this.cancelLoading = true;
      getCancellation(data)
        .then(res => {
          if (res.code === 0) {
            this.showRemove = false;
            this.getList();
          }
          this.cancelLoading = false;
        })
        .catch(err => {
          this.showRemove = false;
          this.cancelLoading = false;
          this.$Message.info("作废草稿失败");
        });
    },
    removeCancel() {
      this.showRemove = false;
    },

    // 打印
    printTable() {
      // this.$refs.printBox.openModal(this.Leftcurrentrow.id, this.Leftcurrentrow.status.value);
      let order = {};
      order.name="移仓单"
      order.route=this.$route.name
      order.id=this.Leftcurrentrow.id
      let routeUrl=this.$router.resolve({name:"print",query:order})
      window.open(routeUrl.href,"_blank");
      this.getList()
    },
    //添加配件
    addPro() {
      this.$refs.SelectPartRef.init();
    },
    //左边列表选中当前行
    selectTabelData(row) {
      // console.log(row)
      if(row.id){
        this.leftClickItemId = row.id;
      }
      if (this.flag === 1) {
        this.$Modal.confirm({
          title: "您正在编辑单据，是否需要保存",
          onOk: () => {
            this.baocun();
          },
          onCancel: () => {
            this.getList();
            this.flag = 0;
          }
        });
        return;
      }
      // this.salesList.map(item=>{
      //   if(item.label===row.createUname) {
      //     row.createdUid = item.id
      //   }
      // })
      this.Leftcurrentrow = {...row};
      // console.log(this.Leftcurrentrow, "this.Leftcurrentrow =>713");
      if (!row.detailVOList) {
        row["detailVOList"] = [];
        this.currentData = [];
      }
      if (Array.isArray(row.detailVOList)) {
        this.Leftcurrentrow.detailVOList = row.detailVOList;
      } else {
        this.Leftcurrentrow.detailVOList = [row.detailVOList];
      }
      if (this.Leftcurrentrow.detailVOList.length > 0) {
        this.Right.tbdata = row.detailVOList;
      } else {
        this.Right.tbdata = [];
      }
      if (this.Leftcurrentrow.id != undefined) {
        getRightDatas(this.Leftcurrentrow.id).then(res => {
          // console.log(res, "res=>728");
          this.Right.tbdata = res.data;
          this.Leftcurrentrow.detailVOList = res.data;
        });
      }
      if (this.Leftcurrentrow.createUname == "") {
        this.Leftcurrentrow.createUname = this.salesman;
      }
      this.upurl = upxlxsMoveStore + row.id;
      this.upurlInnerId=upxlxsInnerIdMoveStore+row.id;
    },

    //添加配件
    getPartNameList(val) {
      var datas = [...val].map(el => {
        el.orderQty = undefined;
        return el;
      });

      var arr = [];

      datas.forEach(item => {
        let filterArr = this.Right.tbdata.map(({ partCode }) => partCode)
        if(!filterArr.includes(item.partCode)) {
          arr.push(item)
        }
      })

      // console.log(arr, datas)

      arr.forEach(item => {
        delete item.id;
        this.Right.tbdata.unshift(item);
      });
      if(arr.length != datas.length) {
        this.$Message.success("配件已存在请勿重复添加");
      } else {
        this.$Message.success("已添加");
      }
    },
    //删除
    deletePar() {
      const seleList = this.$refs.xTable1.getSelectRecords();
      if (seleList.length == 0) return this.$Message.error("请选择一条数据");
      const ids = [];
      // console.log(seleList, "seleList =>753");
      // seleList.forEach(item => {
      //   ids.push(Number(item.id));
      // });
      for (var i = 0; i < seleList.length; i++) {
        ids.push(seleList[i].id);
        this.mainid = seleList[i].mainId;
      }
      // console.log(ids, this.mainId);
      let arrParams = {
        ids: ids,
        mainId: this.mainid
      };
      // this.array_diff(this.Right.tbdata, seleList);
      this.Right.tbdata = this.Right.tbdata.filter(
        item => !seleList.includes(item)
      );
      this.array_diff(this.Leftcurrentrow.detailVOList, seleList);
      const flag = ids.some(item => !item);
      if (flag) return this.$message.success("删除成功");

      // this.array_diff(this.Leftcurrentrow.detailVOList, seleList);

      // console.log(arrParams, "arrParams781");

      delectTable(arrParams)
        .then(res => {
          // console.log(res, "783");
          if (res.code == 0) {
            this.$Message.success("删除成功");
            this.selectTabelData(this.Leftcurrentrow);
            // this.selectTabelData();
          }
        })
        .catch(err => {
          this.showRemove = false;
        });
    },
    //分页
    changePage(p) {
      // this.page.num = p
      // this.getList()
    },
    changeSize(size) {
      // this.page.num = 1
      // this.page.size = size
      // this.getList()
    },
    //表格编辑状态下被关闭的事件
    editClosedEvent() {},
    //footer计算
    addFooter() {},
    // 确定
    Determined() {},
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
    },
    // 导入 编码品牌 导入配件
    handleBeforeUpload() {
      if (this.Leftcurrentrow.xinzeng=='1') {
        return this.$Message.error("请先保存数据!");
      }
      let refs = this.$refs;
      refs.upload.clearFiles();
    },
    //内码导入配件
    handleBeforeUploadInnerId(){
      if (this.Leftcurrentrow.xinzeng=='1') {
        return this.$Message.error("请先保存数据!");
      }
      let refs = this.$refs;
      refs.upload1.clearFiles();
    },
    handleSuccess(res, file) {
      let self = this;
      if (res.code == 0) {
        this.getList();
        // self.$Message.success("导入成功");
        if (res.data.length > 0) {
          this.warning(res.data);
        } else  {
          self.$Message.success("导入成功");
        }
        // this.tableData = [...this.tableData, ...res.data.details].map(item => {
        //   item.uuid = v4();
        //   return item;
        // });
        // this.tableData.push();
      } else {
        self.$Message.error(res.message);
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
        title: '上传错误信息',
        desc: str,
        duration: 0
      });
    },
    onFormatError(file) {
      this.$Message.error('只支持xls xlsx后缀的文件')
    },
    //下载模板 编码品牌模板
    down(){
      down('2500000000')
    },
    //下载模板 配件内码模板
    downInnerId(){
      down('3500000000')
    }
  },
  mounted() {

    //获取右边仓库数据
    getstate()
      .then(res => {
        if (res.code === 0) {
          this.warehouseList = res.data;
        }
      })
      .catch(err => {
        this.$Message.info("获取仓库信息失败"); //获取仓库数据
      });

    setTimeout(() => {
      this.getDomHeight();
    }, 0);
    // this.getList();
    window.onresize = () => {
      this.getDomHeight();
    };
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
  text-align: center;
  height: 40px;
  margin-top: 20px;
}
/*.con-box {*/
/*  height: 600px;*/
/*}*/
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
