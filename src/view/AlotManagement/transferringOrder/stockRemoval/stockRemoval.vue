<template>
  <main
    class="bigBox"
    style="background-color: #fff; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1); height:100%"
  >
    <div class="content-oper content-oper-flex loadingClass" style="box-shadow:none">
      <section class="oper-box">
        <div class="oper-top flex">
          <div class="wlf">
            <div class="db">
              <quick-date class="mr10" @quickDate="getDataQuick"></quick-date>
              <Select
                v-model="form.status"
                @on-change="getDataType"
                class="w90 mr10"
              >
                <Option
                  v-for="item in purchaseTypeArr"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}
                </Option
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
                <Icon type="md-add"/>
                新增
              </Button>
            </div>
            <div class="db">
              <Button
                v-has="'save'"
                type="default"
                class="mr10"
                @click="baocun1"
                :disabled="![0].includes(buttonDisable)"
                :loading="isSaveClick"
              >
                <i class="iconfont mr5 iconbaocunicon"></i>保存
              </Button>
            </div>
            <div class="db">
              <Button
                class="mr10"
                v-has="'submit'"
                :disabled="![0].includes(buttonDisable)"
                @click="tijiao1"
                :loading="isCommitClick"
              >
                <Icon type="md-checkmark" size="14"/>
                提交
              </Button>
            </div>
            <div class="db">
              <Button
                :disabled="![1].includes(buttonDisable) || isWms"
                v-has="'delivery'"
                class="mr10"
                @click="chuku"
                :loading="isOutClick"
              >
                <Icon type="md-checkmark" size="14"/>
                出库
              </Button>
            </div>
            <div class="db">
              <Button
                v-has="'cancellation'"
                class="mr10"
                @click="zuofei1"
                :loading="isCancelClick"
                :disabled="
                  ![0].includes(buttonDisable) || Leftcurrentrow.code != ''
                "
              >
                <Icon type="md-close" size="14"/>
                作废
              </Button>
            </div>
            <div class="db">
              <Button v-has="'print'" class="mr10" @click="printTable">
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
                <div class="pane-made-hd">调拨受理列表</div>
                <Table
                  ref="leftTable"
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
              <div
                slot="right"
                class="con-split-pane-right pl5 goods-list-form"
              >
                <div class="pane-made-hd">调拨受理信息</div>
                <div v-if="showit" class="clearfix purchase" ref="planForm">
                  <Form
                    :model="Leftcurrentrow"
                    inline
                    ref="formPlan"
                    :label-width="120"
                  >
                    <FormItem label="调入方：" prop="guestName" class="redIT">
                      <Row>
                        <Col span="18">
                          <!--<Tooltip :content="Leftcurrentrow.guestName">-->
                            <!--<Input-->
                              <!--readonly-->
                              <!--v-model="Leftcurrentrow.guestName"-->
                              <!--placeholder="请选择调入方"-->
                            <!--/>-->
                          <!--</Tooltip>-->
                          <allocation-cus :title="Leftcurrentrow.guestName" placeholder="请输入调入方" :search-value="Leftcurrentrow.guestName" @throwName="throwNameFun" :disabled-prop="buttonShow || this.flagValue1 !== 0"></allocation-cus>
                          <!-- <Select
                            v-model="Leftcurrentrow.guestName"
                            label-in-value
                            filterable
                            :disabled="this.flagValue != 0"
                          >
                            <Option v-for="item in ArrayValue" :value="item" :key="item">{{ item }}</Option>
                          </Select> -->
                        </Col>
                        <Col span="6">
                          <Button
                            :disabled="this.flagValue != 0"
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
                      <Row class="w140">
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
                              :disabled="item.isDisabled"
                              :value="item.id"
                              :key="item.id"
                            >{{ item.name }}
                            </Option
                            >
                          </Select>
                        </Col>
                      </Row>
                    </FormItem>
                    <FormItem
                      label="调拨受理日期："
                      prop="billType"
                      class="redIT"
                    >
                      <DatePicker
                        disabled
                        @on-change="changeDate"
                        v-model="Leftcurrentrow.createTime"
                        class="w140"
                      ></DatePicker>
                    </FormItem>
                    <FormItem label="备注：" prop="remark">
                      <Tooltip :content="Leftcurrentrow.remark">
                        <Input
                          v-model="Leftcurrentrow.remark"
                          class="w160"
                        ></Input>
                      </Tooltip>
                    </FormItem>
                    <FormItem label="受理人：" prop="createUname">
                      <Input
                        class="w160"
                        disabled
                        :value="Leftcurrentrow.createUname"
                      ></Input>
                    </FormItem>
                    <FormItem label="申请单号：" prop="code">
                      <Tooltip :content="Leftcurrentrow.code">
                        <Input
                          class="w160"
                          disabled
                          :value="Leftcurrentrow.code"
                        ></Input>
                      </Tooltip>
                    </FormItem>
                    <FormItem label="受理单号：" prop="serviceId">
                      <Tooltip :content="Leftcurrentrow.serviceId">
                        <Input
                          class="w160"
                          :disabled="Leftcurrentrow.status.value !== 0"
                          :value="Leftcurrentrow.serviceId"
                          disabled
                        />
                      </Tooltip>
                    </FormItem>
                  </Form>
                </div>
                <div class="flex plan-cz-btn" ref="planBtn">
                  <div class="clearfix">
                    <div class="fl mb5">
                      <Button
                        v-has="'addMountings'"
                        size="small"
                        :disabled="
                          !(!Leftcurrentrow.code && buttonDisable == 0)
                        "
                        class="mr10"
                        @click="addMountings"
                      >
                        <Icon type="md-add"/>
                        添加配件
                      </Button>
                    </div>
                    <div class="fl mb5">
                      <Button
                        v-has="'delete'"
                        :disabled="
                          buttonDisable != 0
                        "
                        size="small"
                        class="mr10"
                        @click="shanchu"
                      >
                        <i class="iconfont mr5 iconlajitongicon"></i> 删除配件
                      </Button>
                    </div>
                    <div class="fl mb5">
                      <Button
                        v-has="'GoodsInfoModal'"
                        size="small"
                        class="mr10"
                        @click="GoodsInfoModal"
                        :disabled="[2, 3].includes(buttonDisable)"
                      >
                        <i class="iconfont mr5 iconlajitongicon"></i>
                        编辑发货信息
                      </Button>
                    </div>
                  </div>
                </div>
                <vxe-table
                  auto-resize
                  border
                  resizable
                  ref="xTable1"
                  size="mini"
                  @select-all="selectAllEvent"
                  @select-change="selectChangeEvent"
                  :height="rightTableHeight"
                  :edit-rules="validRules"
                  :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true}"
                  @keydown="keydown"
                  show-overflow
                  :data="Leftcurrentrow.detailVOS"
                  :edit-config="{ trigger: 'click', mode: 'cell' }"
                  :footer-method="footerMethod"
                  show-footer
                  @filter-change="filterChange"
                >
                  <vxe-table-column
                    show-overflow="tooltip"
                    type="seq"
                    width="50"
                    title="序号"
                    fixed="left"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    type="checkbox"
                    width="40"
                    fixed="left"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="partCode"
                    title="配件编码"
                    :filters="[]"
                    :filter-method="filterOrderNo"
                    width="100"
                    fixed="left"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="partName"
                    title="配件名称"
                    :filters="[]"
                    :filter-method="filterOrderNo"
                    width="100"
                    fixed="left"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="partBrand"
                    title="品牌"
                    :filters="[]"
                    :filter-method="filterOrderNo"
                    width="100"
                    fixed="left"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="applyQty"
                    title="申请数量"
                    width="80"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="hasAcceptQty"
                    :edit-render="{ name: 'input',autoselect: true , attrs: { disabled: false } }"
                    width="100"
                    title="受理数量"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="stockOutQty"
                    :filters="[]"
                    :filter-method="filterOrderNo"
                    title="缺货数量"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="storeShelf"
                    title="仓位"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" title="紧销品" width="60">
                    <template v-slot="{ row }">
                      <Checkbox disabled :value="row.isTight == 1 ? true:false"></Checkbox>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="carBrandName"
                    title="品牌车型"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="unit"
                    title="单位"
                    width="50"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="oemCode"
                    title="OE码"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="partInnerId"
                    title="配件内码"
                    width="90"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="spec"
                    title="规格"
                    width="80"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="hasOutQty"
                    title="出库数量"
                    width="80"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="hasCancelQty"
                    title="取消数量"
                    width="80"
                  ></vxe-table-column>
                </vxe-table>
                <div class="table-bottom-text flex"><span>创建人：{{datadata?datadata.createUname:""}}</span><span>创建日期：{{datadata?datadata.createTime:""}}</span><span>提交人：{{datadata?datadata.commitUname:""}}</span><span>提交日期：{{datadata?datadata.commitDate:""}}</span></div>
              </div>
            </Split>
          </div>
        </div>
      </section>
      <!--更多弹框-->
      <Modal
        v-model="advanced"
        title="高级查询"
        width="600px"
        @on-visible-change="moreChange"
      >
        <Form @keydown.native.enter="Determined">
          <More
            ref="naform"
            :ArrayValue="ArrayValue"
            @getName="showModel2"
            :dcName="diaochuName"
            :dcId="diaochuID"
          ></More>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="Determined">确定</Button>
          <Button type="default" @click="advanced = false">取消</Button>
        </div>
      </Modal>
    </div>
    <!--      添加配件-->
    <select-part-com
      ref="selectPartCom"
      @selectPartName="getPartNameList"
    ></select-part-com>
    <!--编辑收货信息-->
    <!--    <Modal v-model="GainInformation" title="编辑发货信息" width="1200px">-->
    <!--      <goods-info ref="goodI" @init="GainInformation = false"></goods-info>-->
    <!--      <div slot="footer">-->
    <!--        &lt;!&ndash; <Button type="primary" @click="getMessage">确定</Button>-->
    <!--        <Button type="default">取消</Button>&ndash;&gt;-->
    <!--      </div>-->
    <!--    </Modal>-->
    <!--编辑收货信息-->
    <goods-info
      ref="goodsInfo"
      :mainId="MainID"
      :row="datadata"
      :orgid="orgid"
    ></goods-info>
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
  </main>
  <!-- 配件组装 -->
</template>

<script>
  import AddInCom from "./compontents/AddInCom";
  import More from "./compontents/More";
  import "../../../lease/product/lease.less";

  import selectPartCom from "@/view/AlotManagement/transferringOrder/stockRemoval/compontents/selectPartCom";
  import GoodsInfo from "./compontents/goodsInfo";
  import moment from "moment";
  import QuickDate from "../../../../components/getDate/dateget";
  // import SelectSupplier from './compontents/selectSupplier'
  import SelectSupplier from "../../transferringOrder/applyFor/compontents/supplier/selectSupplier2";
  import {findForAllot} from "_api/purchasing/purchasePlan";
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
  import * as tools from "_utils/tools";
  import { hideLoading, showLoading } from "@/utils/loading";


  import {queryByOrgid} from "../../../../api/AlotManagement/transferringOrder";
  import AllocationCus from "../../../../components/allocation/allocationCus";

  export default {
    name: "stockRemoval",
    components: {
      AllocationCus,
      More,
      QuickDate,
      AddInCom,
      SelectSupplier,
      GoodsInfo,
      selectPartCom
    },
    data() {
      let changeNumber = ({cellValue}) => {
        const reg = /^[0-9]\d{0,}$/;
        if (!reg.test(cellValue)) {
          return Promise.reject(new Error("受理数量输入不正确"));
        }
      };
      return {
        flag1: false,
        validRules: {
          hasAcceptQty: [{required: true, validator: changeNumber}]
        },
        checkboxArr: [], // checkbox选中
        idsId: [],
        MainID: "",
        datadata: null,
        getArray: [],
        tuneOut: false,
        flag: 0,
        flagState: 0,
        flagValue: 0,
        flagValue1: 0,
        ArrayValue: [],
        ArrayKeyValue: [],
        orgid: "",
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
            label: "已完成",
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
              {name: 2}
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
              width: 50,
              key: "index",
              resizable:true
            },
            {
              title: "状态",
              key: "statuName",
              width: 70,
              resizable:true
            },
            {
              title: "调入方",
              key: "guestName",
              width: 120,
              resizable:true
            },
            {
              title: "创建日期",
              key: "createTime",
              width: 140,
              resizable:true,
              render(h, params) {
                let time = moment(params.row.createTime).format("YYYY-MM-DD HH:mm:ss");
                return h("span", {}, time);
              }
            },
            {
              title: "受理人",
              key: "createUname",
              width: 100,
              resizable:true
            },
            {
              title: "受理单号",
              key: "serviceId",
              width: 240,
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
              key: "commitDate",
              width: 160,
              resizable:true
            },
            {
              title: "打印次数",
              key: "printing",
              width: 100,
              resizable:true
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
        clickdelivery: false,
        isWms: false, //仓库是否启用wms
        createTime: new Date(),
        isSaveClick:false,
        isCommitClick: false,
        isCancelClick: false,
        isOutClick: false,
        filterCheckObj: {},
      };
    },
    // watch: {
    //   Leftcurrentrow: {
    //     handler(newVal) {
    //       this.Leftcurrentrow = newVal;
    //     },
    //     deep: true
    //   }
    // },
    created() {
      // 调接口获取配件组装列表信息
    },
    methods: {
      //合计
      footerMethod({ columns, data }) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              // let tex = this.Bottom.tbdata.length
              return "合计";
            }
            if (columnIndex === 2) {
              // let tex = this.Bottom.tbdata.length
              return (data||[]).length +"条";
            }
            if (["applyQty",'hasAcceptQty','stockOutQty','hasOutQty','hasCancelQty'].includes(column.property)) {
              return this.$utils.sum(data, column.property);
            }
            return null;
          })
        ];
      },


      throwNameFun(name){
        this.selectSupplierName(name)
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
          // 判断当前是否是可编辑倒数第一行
          const isLastColumn = nowIndex === columnsField.length - 1
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
            // await this.$refs.xTable1.setActiveCell(row, "hasAcceptQty")

          }
        }
      },
      keydown($event) {
        if ($event.$event.keyCode == 9) {
          this.editNextCell($event.$table)
        }
      },
      //------------------------------------------------------------------------//

      // 高级查询弹框
      moreChange(type) {
        this.$refs.naform.reset();
      },
      getArrayParams() {
        var req = {};
        req.page = 0;
        req.size = 1000;
        findForAllot(req).then(res => {
          const {content} = res.data;
          this.getArray = content;
          content.forEach(item => {
            this.ArrayValue.push(item.shortName);
            this.ArrayKeyValue.push({name: item.shortName, orgid: item.orgid});
          });
        });
      },
      //  获取子组件逐渐传过来的值
      // getArray(data) {
      //   this.ArrayValue = data;
      // },
      //配件返回的参数
      getPartNameList(val) {
        var arr = [];
        val.forEach(item => {
          item.partName = item.partStandardName;
          item.hasAcceptQty = undefined;
          item.carBrandName = item.adapterCarBrand;
          item.orderPrice = item.minUnit;
          item.oemCode = item.oeCode;
          item.spec = item.specifications || item.spec;
          item.partId = item.orgid;
          item.partInnerId = item.code;
          item.unit = item.minUnit;
          let el = Object.assign({}, item);
          delete el.id;
          delete el.orderPrice;
          arr.push(el);
        });

        var allArr = []; //新数组

        this.Leftcurrentrow.detailVOS = [
          ...this.Leftcurrentrow.detailVOS,
          ...arr
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
        this.setFilterArr(this.Leftcurrentrow.detailVOS || [])
        // this.Leftcurrentrow.detailVOS=this.Leftcurrentrow.detailVOS.map(item=>{item.hasAcceptQty=parseInt(item.hasAcceptQty)})
        // console.log(this.Leftcurrentrow.detailVOS)
        this.$Message.success("已添加");
      },
      // getMessage() {
      //   const params = this.$refs.goodI.getParams()
      //   this.Leftcurrentrow['sendWay'] = params
      //   this.GainInformation = false
      // },
      selectAllEvent({checked, selection}) {
        if (checked) {
          selection.forEach(el => {
            this.idsId.push(el.id);
          });
          this.checkboxArr = selection;
        } else {
          this.idsId = [];
          this.checkboxArr = [];
        }
      },
      selectChangeEvent(msg) {
        this.idsId.push(msg.row.id);
        this.checkboxArr = msg.selection;
      },
      getDataType() {
        this.getList();
      },
      async baocun1() {
        let zero = tools.isZero1(this.Leftcurrentrow.detailVOS, {
          qty: "hasAcceptQty"
        });
        if (zero) return;
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
        const params = JSON.parse(JSON.stringify(this.Leftcurrentrow));

        params.detailVOS.forEach(el => (el.systemUnitId = el.unit));
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
        // if(typeof this.Leftcurrentrow.createTime !== "string") {
        //   params.createTime = moment(this.Leftcurrentrow.createTime).format(
        //     "YYYY-MM-DD HH:mm:ss"
        //   );
        // }
        params.createTime = this.createTime;
        if (this.flag1 == true) {
          params.id = "";
        }
        try {
          await this.$refs.xTable1.validate();
          //配件组装保存
          this.isSaveClick = true;
          baocun(params)
            .then(res => {
              if(!res){
                this.isSaveClick = false;
              }
              // 点击列表行==>配件组装信息
              if (res.code == 0) {
                this.flag = 0;
                this.flag1 = false;
                this.getList();
                this.$Message.success("保存成功");
                this.$refs.formPlan.resetFields();
              }
              this.isSaveClick = false;
            }).catch(e => {
              this.isSaveClick = false;
            })
          // .catch(e => {
          //   this.$Message.info("保存配件组装信息失败");
          // });
        } catch (errMap) {
          this.isSaveClick = false;
          this.$XModal.message({
            status: "error",
            message: "受理数量输入错误！"
          });
        }
      },
      xinzeng() {
        this.$refs.leftTable.clearCurrentRow();
        this.flag1 = true;
        this.flagState = 1;
        this.flagValue = 0;
        this.flagValue1 = 0;
        this.buttonDisable = 0;
        let createTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        this.createTime = createTime;
        for (let b of this.Left.tbdata) {
          b._highlight = false;
        }
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
          createTime,
          orderMan: this.$store.state.user.userData.staffName,
          remark: "",
          serviceId: "",
          detailVOS: [],
        };
        // console.log(item);
        if (this.cangkuListall.length > 0) {
          this.cangkuListall.forEach(el => {
            if (el.isDefault) {
              item.storeId = el.id;
            }
          });
        } else {
          item.storeId = "";
        }
        this.buttonShow = false;
        this.tuneOut = false;
        if (this.Left.tbdata.length === 0) {
        } else {
          if (this.Left.tbdata[0]["xinzeng"] === "1") {
            this.$Message.info("请先保存数据");
            return;
          }
        }
        this.flag = 1;
        this.datadata = null;
        this.Left.tbdata.unshift(item);
        this.Left.tbdata.map((item, index) => {
          item.index = index + 1;
        });
        this.Leftcurrentrow = this.Left.tbdata[0];
        this.setFilterArr(this.Leftcurrentrow.detailVOS || [])
      },
      tijiao1() {
        this.$Modal.confirm({
          title: "提示",
          content: "是否确定提交？",
          onOk: () => {
            if (this.Leftcurrentrow.xinzeng === "1") {
              this.$Message.info("请先保存新增出库单");
              return;
            }
            let zero = tools.isZero1(this.Leftcurrentrow.detailVOS, {
              qty: "hasAcceptQty"
            });
            if (zero) return;

            let outStockFilter = this.Leftcurrentrow.detailVOS.filter(item => item.stockOutQty>0);
            if(outStockFilter.length>0){
              this.$Message.info("配件明细存在缺货，请修改受理数量并保存后提交！");
              return
            }

            const params = JSON.parse(JSON.stringify(this.Leftcurrentrow));
            if (params.status.value != undefined) {
              params.status = params.status.value;
            }
            if (params.settleStatus && params.settleStatus.value != undefined) {
              params.settleStatus = params.settleStatus.value;
            }
            if (params.orderTypeId && params.orderTypeId.value != undefined) {
              params.orderTypeId = params.orderTypeId.value;
            }
            // this.Leftcurrentrow.createTime = this.Leftcurrentrow.createTime
            //   ? this.Leftcurrentrow.createTime
            //   : new Date();
            // params.createTime = moment(this.Leftcurrentrow.createTime).format(
            //   "YYYY-MM-DD HH:mm:ss"
            // );
            params.createTime = this.createTime;
            if(this.isCommitClick){
              return this.$message.error('请稍后数据处理中....');
            }
            this.isCommitClick = true;
            showLoading(".loadingClass", "数据加载中，请勿操作")
            tijiao(params)
              .then(res => {
                // 点击列表行==>配件组装信息
                if (res.code == 0) {
                  this.flag = 0;
                  this.buttonDisable = null;
                  this.getList();
                  this.$Message.success("提交成功");
                  this.$refs.formPlan.resetFields();
                  this.isCommitClick = false;
                  hideLoading()
                }else{
                  this.isCommitClick = false;
                  hideLoading()
                }
              }).catch(e => {
                this.isCommitClick = false;
                hideLoading()
              })
            // .catch(e => {
            //   this.$Message.info("提交失败");
            // });
          },
          onCancel: () => {
            return;
          }
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
            if(this.isCancelClick){
              return this.$message.error('请稍后数据处理中....');
            }
            this.isCancelClick = true;
            zuofei(paramster)
              .then(res => {
                // 点击列表行==>配件组装信息
                if (res.code == 0) {
                  this.$Message.success("作废成功");
                  this.getList();
                }
                this.isCancelClick = false;
              }).catch(e => {
                this.isCancelClick = false;
              })
            // .catch(e => {
            //   this.$Message.info("作废失败");
            //   this.getList();
            // });
          },
          onCancel: () => {
            this.Leftcurrentrow.serviceId = "";
            this.getList();
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
        // .catch(e => {
        //   this.$Message.info("获取成品失败");
        // });
        // 获取成品列表把data赋值给子组件中
        // this.getListPro()
      },
      changeDate(val) {
        this.Leftcurrentrow.createTime = val;
      },
      //编辑收货信息弹框显示
      GoodsInfoModal() {
        if (!this.datadata) {
          return this.$Message.info("请选择保存过的调拨单");
        }
        if (!this.currentrow.id) {
          this.$Message.info("请选择编辑项");
          return;
        }
        this.ArrayKeyValue.forEach(el => {
          if (el.name == this.Leftcurrentrow.guestName) {
            this.orgid = el.orgid;
          }
        });
        setTimeout(() => {
          this.clickdelivery = true;
          this.$refs.goodsInfo.init();
        }, 0);
      },
      //创建a标签
      openwin(url) {
        var a = document.createElement("a"); //创建a对象
        a.setAttribute("href", url);
        a.setAttribute("target", "_blank");
        a.setAttribute("id", "camnpr");
        document.body.appendChild(a);
        a.click(); //执行当前对象
        document.body.removeChild(a)
      },
      //打印表格
      printTable() {
        // if(this.$refs.goodsInfo.formDateRight.streetAddress==""){
        //   this.$Message.error("请先编辑地址信息")
        //   return
        // }
        let order = {};
        order.name="调拨出库"
        order.route=this.$route.name
        order.id=this.dayinCureen.id
        let routeUrl=this.$router.resolve({name:"print",query:order})
        // window.open(routeUrl.href,"_blank");
        this.openwin(routeUrl.href)
        this.getList()
      },
      chuku() {
        this.$Modal.confirm({
          title: "是否确定出库？",
          onOk: () => {
            const params = {
              id: this.Leftcurrentrow.id
            };
            // 配件组装作废
            if(this.isOutClick){
              return this.$message.error('请稍后数据处理中....');
            }
            this.isOutClick = true;
            showLoading(".loadingClass", "数据加载中，请勿操作")
            outDataList(params)
              .then(res => {
                // 点击列表行==>配件组装信息
                if (res.code == 0) {
                  this.getList();
                  this.$Message.success("出库成功");
                }
                this.isOutClick = false;
                hideLoading()
              }).catch(e => {
                this.isOutClick = false;
                hideLoading()
              })
            // .catch(e => {
            //   this.$Message.info("出库失败");
            // });
          },
          onCancel: () => {
          }
        });
      },
      searchPro(params, size, page) {
        chengping({...params}, size, page)
          .then(res => {
            // 导入成品, 并把成品覆盖掉当前配件组装信息list
            if (res.code == 0) {
              this.tableData1 = res.data;
            }
          })
        // .catch(e => {
        //   this.$Message.info("获取成品失败");
        // });
        // 获取成品列表把data赋值给子组件中
        // this.getListPro()
      },
      // 组装
      currentChangeEvent({row}) {
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
          this.leftTableHeight = wrapH - 110;
          //获取右侧表格高度
          this.rightTableHeight = wrapH - planFormH - planBtnH - 68;
        });
      },
      getDataQuick(v) {
        (this.form.createTimeStart = v[0]), (this.form.createTimeEnd = v[1]);
        this.getList();
      },
      //更多按钮
      more() {
        this.$refs.naform.reset();
        this.advanced = true;
      },
      //左边列表选中当前行
      async selectTabelData(row) {
        this.flagValue1 = 0;
        if (this.flag === 1) {
          this.$Modal.confirm({
            title: "您正在编辑单据，是否需要保存",
            onOk: () => {
              this.flag = 0;
              this.flagState = 0;
              this.baocun1();
            },
            onCancel: () => {
              this.flag = 0;
              this.flagState = 0;
              this.getList();
            }
          });
          return;
        }
        this.buttonDisable = 0; // 草稿
        this.dayinCureen = row;
        this.Leftcurrentrow = row;
        this.createTime = row.createTime;
        if (row.statuName == "待出库") {
          this.buttonDisable = 1;
        }
        if (row.statuName == "已出库") {
          this.buttonDisable = 2;
        }
        if (row.statuName == "已作废") {
          this.buttonDisable = 3;
        }

        //判断仓库是否启用wms
        this.isWms = false;
        if (this.buttonDisable === 1 && row.isWms === 1) {
          this.isWms = true;
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
          let timeCreate=row.createTime;
          this.MainID = row.id;
          const params = {
            mainId: row.id
          };
          const res = await getListDetail(params);
          this.Leftcurrentrow.detailVOS = res.data;
          this.setFilterArr(this.Leftcurrentrow.detailVOS || [])
          this.isSaveClick = false;
          this.datadata = row;
          this.datadata.createTime=timeCreate;
        } else {
          this.datadata = null;
          this.isSaveClick = false;
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
      editClosedEvent() {
      },
      //footer计算
      addFooter() {
      },
      // 确定
      Determined() {
        this.$refs.naform.cancelTrim();
        this.form = {
          ...this.form,
          ...this.$refs.naform.getITPWE()
        };
        for (var i = 0; i < this.getArray.length; i++) {
          if (this.getArray[i].shortName == this.form.guestName) {
            this.form.guestId = this.getArray[i].id;
          }
        }
        this.advanced = false;
        this.getList();
        this.form = {};
        this.$refs.naform.reset();
      },
      ok() {
      },
      cancel() {
      },
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
            this.setFilterArr(this.Leftcurrentrow.detailVOS || [])
            this.$Message.success("删除成功");
          }, 1000);

          seleList.map(item => {
            if (item.id) arr.push(item.id);
          });
          const params = {
            ids: arr,
            mainId: this.Leftcurrentrow.id
          };
          if (params.ids.length === 0) return;
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
          // .catch(e => {
          //   this.$Message.info("删除成品失败");
          // });
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
        this.formPlan.guestName = a.shortName;
        this.formPlan.guestidId = a.id;
      },
      //选择方
      selectSupplierName(row) {
        this.guestOrgid = row.id;
        if (this.val === "0") {
          this.showit = false;
          this.Leftcurrentrow.guestName = row.shortName;
          this.Leftcurrentrow.guestId = row.guestId;
          this.Leftcurrentrow.guestOrgid = row.id;
          const tata = this;
          setTimeout(() => {
            tata.showit = true;
          }, 200);
        } else {
          this.diaochuName = row.shortName;
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
        params = {...params, ...this.form};
        delete params.status;
        delete params.guestName;
        getList1(params, this.Left.page.size, this.Left.page.num)
          .then(async res => {
            if(!res){
              this.isSaveClick = false;
            }
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
            // Leftcurrentrow
            if(this.Leftcurrentrow.id){
              for (let b of this.Left.tbdata) {
                b._highlight = false;
                if (b.id == this.Leftcurrentrow.id) {
                  b._highlight = true;
                  this.Leftcurrentrow = b;
                  this.buttonDisable = 0;
                  if (b.statuName == "待出库") {
                    this.buttonDisable = 1;
                  }
                  if (b.statuName == "已出库") {
                    this.buttonDisable = 2;
                  }
                  if (b.statuName == "已作废") {
                    this.buttonDisable = 3;
                  }

                  //判断仓库是否启用wms
                  this.isWms = false;
                  if (this.buttonDisable === 1 && b.isWms === 1) {
                    this.isWms = true;
                  }
                  const params = {
                    mainId: b.id
                  };
                  const res = await getListDetail(params);
                  this.Leftcurrentrow.detailVOS = res.data || [];
                  this.setFilterArr(this.Leftcurrentrow.detailVOS || [])
                  this.isSaveClick = false;
                  return;
                }
                // this.Leftcurrentrow.detailVOS = [];
              }
            }else{
              if(this.Left.tbdata.length==0){
                this.isSaveClick = false;
                return
              }
              let b = this.Left.tbdata[0];
              b._highlight = false;
              if (b.id == this.Leftcurrentrow.id) {
                b._highlight = true;
                this.Leftcurrentrow = b;
                this.buttonDisable = 0;
                if (b.statuName == "待出库") {
                  this.buttonDisable = 1;
                }
                if (b.statuName == "已出库") {
                  this.buttonDisable = 2;
                }
                if (b.statuName == "已作废") {
                  this.buttonDisable = 3;
                }

                //判断仓库是否启用wms
                this.isWms = false;
                if (this.buttonDisable === 1 && b.isWms === 1) {
                  this.isWms = true;
                }
                const params = {
                  mainId: b.id
                };
                const res = await getListDetail(params);
                this.Leftcurrentrow.detailVOS = res.data || [];
                this.setFilterArr(this.Leftcurrentrow.detailVOS || [])
                this.isSaveClick = false;
                return;
              }
            }

          })
        // .catch(e => {
        //   this.$Message.info("获取配件组装列表失败");
        // });
      },
      getListPro() {
        chengping()
          .then(res => {
            if (res.code == 0) {
              this.tbdata = res.data || [];
              this.page.total = res.totalElements;
            }
          })
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
      },
      returnData(rData,cos){
        let arrData = [];
        let arr = rData.map(el => el[cos])
        let set = new Set(arr);
        set.forEach(el => {
          let filterData = this.filterCheckObj[cos]||[]
          if(filterData.includes(el)){
            arrData.push({ label: el, value: el ,checked:true});
          }else{
            arrData.push({ label: el, value: el });
          }

        });
        this.$nextTick(()=>{
          const xtable = this.$refs.xTable1;
          const column = xtable.getColumnByField(cos);
          xtable.setFilter(column, arrData);
          xtable.updateData();
        });
      },

      setFilterArr(rData){
        this.returnData(rData,'partCode');
        this.returnData(rData,'partName');
        this.returnData(rData,'partBrand');
        this.returnData(rData,'stockOutQty');
      },

      filterOrderNo({ value, row, column }){
        let {property} = column;
        if(!value){
          return !row[property]
        }
        if(row[property]){
          return row[property] == value;
        }else{
          return false
        }
      },
      filterChange({property, values}){
        this.filterCheckObj[property] = values;
      }
    },
    mounted() {
      setTimeout(() => {
        this.getDomHeight();
      }, 0);
      // window.onresize = () => {
      //   this.getDomHeight();
      // };
      // this.getArrayParams();
      this.warehouse();
      this.getList();
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

  /*.con-box {*/
    /*height: 600px;*/
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
