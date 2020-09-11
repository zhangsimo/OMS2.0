<template>
    <main class="bigBox"
    style="background-color: #fff; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1); height:100%">
      <div class="content-oper content-oper-flex">
        <section class="oper-box">
          <div class="oper-top flex">
            <div class="wlf">
              <div class="db">
                <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>
                <Select v-model="purchaseType" class="w90 mr10" @on-change="SelectChange">
                  <Option v-for="item in purchaseTypeArr" :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
              </div>
              <div class="db">
                <Button type="default" @click="moreaa" class="mr10"><i class="iconfont mr5 iconchaxunicon"></i>更多</Button>
              </div>
              <div class="db">
                <Button class="mr10" @click="addProoo" v-has="'add'"><Icon type="md-add"/> 新增</Button>
              </div>
              <div class="db">
                <Button :loading="isSaveClick" type="default" @click='SaveMsg' class="mr10" :disabled="buttonDisable || presentrowMsg !== 0"><i class="iconfont mr5 iconbaocunicon"></i>保存</Button>
              </div>
              <div class="db">
                <Button :loading="isCommitClick" class="mr10" @click="instance('formPlan')" v-has="'save'" :disabled="buttonDisable || presentrowMsg !== 0"><i class="iconfont mr5 iconziyuan2"></i>提交</Button>
              </div>
              <div class="db">
                <Button :loading="isCancelClick" @click="cancellation" class="mr10" v-has="'Cancellation'" :disabled="buttonDisable || presentrowMsg !== 0"><Icon type="md-close" size="14" /> 作废</Button>
              </div>
              <div class="db">
                <Button @click="stamp" :disabled="(presentrowMsg === 0 && resId)||presentrowMsg === 7||presentrowMsg === 8 " class="mr10" v-has="'print'"><i class="iconfont mr5 icondayinicon"></i> 打印</Button>
              </div>
              <div class="db">
                <div class="mt5"><Checkbox v-model="showSelf" @on-change="showOwen">显示个人单据</Checkbox></div>
              </div>
            </div>
          </div>
        </section>
        <section class="con-box">
          <div class="inner-box">
            <div class="con-split" ref="paneLeft" >
              <Split v-model="split1" min="200" @on-moving="getDomHeight">
                <div slot="left" class="con-split-pane-left" style="overflow-y: auto; height: 100%;">
                  <div class="pane-made-hd">
                    调拨申请列表
                  </div>
                  <Table
                    ref="currentRowTable"
                    :height="leftTableHeight"
                    @on-current-change="selectTabelData"
                    size="small"
                    highlight-row
                    border
                    :stripe="true"
                    :columns="Left.columns"
                    :data="Left.tbdata"
                    @on-row-click="selection"></Table>
                  <Page
                    class-name="fl pt10"
                    size="small"
                    :current="Left.page.num"
                    :total="Left.page.total"
                    :page-size="Left.page.size"
                    :page-size-opts="Left.page.opts"
                    @on-change="changePageLeft"
                    @on-page-size-change="changeSizeLeft"
                    show-sizer
                    show-total>
                  </Page>
                  <!-- <Page
                    class-name="fl pt10"
                    size="small"
                    :current="page.num"
                    :total="page.total"
                    :page-size="page.size"
                    @on-change="changePage"
                    @on-page-size-change="changeSize"
                    show-sizer
                    show-total
                  ></Page> -->
                </div>
                <div slot="right" class="con-split-pane-right pl5 goods-list-form">
                  <div class="pane-made-hd">
                    调拨申请信息
                  </div>
                  <div class="clearfix purchase" ref="planForm">
                    <Form inline
                          :model="formPlan"
                          ref="formPlan"
                          :rules="ruleValidate"
                          :label-width="120">
                      <FormItem label="调出方：" prop="guestName" class="fs12 formItem w400">
                        <Row >
                          <Col span="22">
                            <!--<Input placeholder="请选择调出方" v-model="formPlan.guestName" readonly disabled />-->
                            <allocation-cus placeholder="请选择调出方" :search-value="formPlan.guestName" @throwName="throwNameFun" :disabledProp="presentrowMsg !== 0 || buttonDisable"></allocation-cus>
                            <!-- <Select placeholder="请选择调出方" @on-change="selectOption" v-model="formPlan.guestName" label-in-value filterable :disabled="presentrowMsg !== 0 || buttonDisable">
                              <Option v-for="item in ArrayValue" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select> -->
                          </Col>
                          <Col span="2">
                            <Button class="ml5" size="small" type="default" @click="addSuppler" :disabled="buttonDisable || presentrowMsg !== 0"><i class="iconfont iconxuanzetichengchengyuanicon"></i></Button>
                          </Col>
                        </Row>
                      </FormItem>
                      <FormItem class="formItem" label="调入仓库：" prop="storeId" >
                        <Select class="w160" :disabled="presentrowMsg !== 0 || buttonDisable" v-model="formPlan.storeId" @on-change="selectStoreId">
                          <Option :disabled="item.isDisabled" v-for="item in List" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                      </FormItem>
                      <FormItem label="调拨申请日期：" prop="orderDate" class="fs12 formItem ml50">
                        <DatePicker
                          type="datetime"
                          format="yyyy-MM-dd HH:mm:ss"
                          style="width: 200px"
                          placeholder="请选择调拨申请日期"
                          :options="options1"
                          v-model="formPlan.orderDate"
                          :disabled="presentrowMsg !== 0 || buttonDisable"
                        ></DatePicker>
                      </FormItem>
                      <FormItem class="formItem" label="备注：" prop="remark">
                        <Tooltip :content="formPlan.remark" :disabled="(formPlan.remark||'').trim()==''">
                          <Input
                            class="w160"
                            :disabled="presentrowMsg !== 0 || buttonDisable"
                            v-model="formPlan.remark"
                            :maxlength="100"
                          />
                          <div slot="content" style="width: 100%;white-space:normal;word-wrap:break-word;">{{(formPlan.remark||"").trim()}}</div>
                        </Tooltip>
                      </FormItem>
                      <FormItem label="申请人：" prop="planner">
                        <Input class="w160" :disabled="buttonDisableTwo" v-model="formPlan.createUname"></Input>
                      </FormItem>
                      <FormItem label="申请单号:" prop="planOrderNum" class="ml50">
                        <Tooltip :content="formPlan.serviceId">
                        <Input class="w200" :disabled="buttonDisableTwo" v-model="formPlan.serviceId"></Input>
                        </Tooltip>
                      </FormItem>
                    </Form>
                  </div>
                  <div class="flex plan-cz-btn" ref="planBtn">
                    <div class="clearfix">
                      <div class="fl mb5">
                        <Button size="small" class="mr10" @click="addPro" v-has="'addAccessories'" :disabled="buttonDisable || presentrowMsg !== 0||!formPlan.guestName"><Icon type="md-add"/> 添加配件</Button>
                      </div>
                      <div class="fl mb5">
                        <Poptip placement="bottom">
                          <Button class="mr10" size="small"
                                  :disabled="![0, 4].includes(datadata&&datadata.status.value) || !selectRowId"
                                  v-has="'import'"
                          >导入
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
                            <Button
                              size="small"
                              @click="down"
                            >
                              <Icon custom="iconfont iconxiazaiicon icons" />编码品牌模板
                            </Button>
                          </div>
                        </Poptip>
                      </div>
                      <div class="fl mb5">
                        <Button size="small" class="mr10" :disabled="buttonDisable || presentrowMsg !== 0" v-has="'deleteAccessories'" @click="Delete"><i class="iconfont mr5 iconlaji调拨申请信息tongicon"></i> 删除配件</Button>
                      </div>
                      <div class="fl mb5">
                        <Button size="small" class="mr10" @click="GoodsInfoModal" :disabled="buttonDisable || presentrowMsg !== 0" v-has="'EditAddress'"><i class="iconfont mr5 iconbianjixiugaiicon"></i> 编辑收货信息</Button>
                      </div>
                      <div class="fl mb5">
                        <Button size="small" :disabled="changeOrderBtn" class="mr10" @click="changeOrderFun" v-has="'addAccessories'">订单调整</Button>
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
                    size="mini"
                    :edit-rules="validRules"
                    :height="rightTableHeight"
                    :data="Right.tbdata"
                    :footer-method="addFooter"
                    @select-all="selectAll"
                    @edit-actived="editActivedEvent"
                    :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true}"
                    @keydown="keydown"
                    :edit-config="{trigger: 'click', mode: 'cell'}">
                    <vxe-table-column  show-overflow="tooltip" type="seq" width="60" title="序号" fixed="left"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" type="checkbox" width="60" fixed="left"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" field="partCode" title="配件编码" fixed="left" width="100"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" field="partName" title="配件名称" fixed="left" width="100"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" field="partBrand" title="品牌" fixed="left" width="100"></vxe-table-column>
                     <vxe-table-column  show-overflow="tooltip"
                       field="applyQty"
                       title="申请数量"
                       :edit-render="{name: 'input',attrs: {disabled: false}}" width="100">
                    </vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" field="remark" title="备注" :edit-render="{name: 'input',attrs: {disabled: presentrowMsg !== 0,maxlength:100}}" width="100"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" field=`carBrandName + carModelName` title="品牌车型" width="100"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" field="unit" title="单位" width="100"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" field="oemCode" title="OE码" width="100"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" field="spec" title="规格" width="100"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" field="enterUnitId" title="方向" width="100"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" field="partInnerId" title="配件内码" width="120"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" title="紧销品" width="100">
                      <template v-slot="{ row }">
                        <Checkbox disabled :value="row.isTight == 1 ? true:false"></Checkbox>
                      </template>
                    </vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" field="hasAcceptQty" title="受理数量" width="100"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" field="hasCancelQty" title="取消数量" width="100"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" field="hasOutQty" title="出库数量" width="100"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" field="hasInQty" title="入库数量" width="100"></vxe-table-column>
                  </vxe-table>
                  <!-- <div ref="planPage">
                  <Page size="small" class-name="page-con" :current="Right.page.num" :total="Right.page.total" :page-size="Right.page.size" @on-change="changePage"
                  @on-page-size-change="changeSize" show-sizer show-total></Page>
                  </div> -->
                </div>
              </Split>
            </div>
          </div>
        </section>
        <!--更多弹框-->
              <More @sendMsg="getMsg" ref="moremore"></More>
        <!--选择配件-->
        <supplier :guestId="guestidId" :storeId="formPlan.storeId" ref="SelectPartCom" @selectPartName="getPartNameList" @selectPartName2="getPartNameList2"></supplier>
        <!--编辑收货信息-->
          <goods-info ref="goodsInfo" :mainId="mainId" :row="datadata" :guestId="guestidId"></goods-info>
      </div>
      <!--供应商资料-->
      <select-supplier ref="selectSupplier" header-tit="供应商资料" @selectSupplierName="getSupplierName"></select-supplier>
      <!--订单调整-->
      <change-order ref="changeOrder" :updata="leftgetList"></change-order>
    </main>
</template>

<script>
  import * as tools from "../../../../utils/tools";

  import QuickDate from '../../../../components/getDate/dateget'
  import More from './compontents/More'
  // import SelectPartCom from "../../../goods/goodsList/components/selectPartCom";
  import GoodsInfo from './compontents/goodsInfo/GoodsInfo'
  import SelectSupplier from "./compontents/supplier/selectSupplier2";
  import '../../../lease/product/lease.less';
  import "../../../goods/goodsList/goodsList.less";
  import supplier from './compontents/newSelectPartCompontent/selectPartCom'
  import { queryAll,findById,queryByOrgid,save,commit} from '../../../../api/AlotManagement/transferringOrder';
  import {findForAllot} from "_api/purchasing/purchasePlan";
  import {down } from "@/api/system/essentialData/commoditiesInShortSupply.js"
  import {
    upxlxs
  } from "_api/purchasing/purchasePlan";
  import { TOKEN_KEY } from "@/libs/util";
  import Cookies from "js-cookie";
  import {upxlxsDBo/**编码品牌导入配件*/,upxlxsDBoInnerId/**内码导入配件*/} from "@/api/purchasing/purchasePlan";
  import AllocationCus from "../../../../components/allocation/allocationCus";
  import ChangeOrder from "./compontents/changeOrder";

  export default {
      name: "applyFor",
      components: {
        ChangeOrder,
        AllocationCus,
        QuickDate,
        More,
        supplier,
        // SelectPartCom,
        GoodsInfo,
        SelectSupplier
      },
      data() {
        let changeNumber = ({cellValue }) => {
          const reg = /^[1-9]\d{0,}$/;
          if(!reg.test(cellValue)) {
            return Promise.reject(new Error('数量输入不正确'))
          }
        };
        return {
          //订单调整按钮
          changeOrderBtn:true,
          showSelf: true,
          headers: {
            Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
          },
          upurl:"",//编码品牌导入配件地址
          upurlInnerId:"",//内码导入配件地址
          selectRowId: '',
          selectvalue: '',
          //校验输入框的值
          validRules: {
            applyQty:[{ required: true, validator: changeNumber }]
          },
          options1: {
            disabledDate (date) {
                return date && date.valueOf() < Date.now() - 86400000;
            }
          },
          StoreId :'', //默认仓
          ArraySelect: [], //供应商下拉框
          isInternalId:'',//后端需要的供应商的一个id
          rowOrgId: '',
          checkboxArr:[],// checkbox选中
          disSave: false, // 保存按钮是否禁用
             PTrow: {//新增当前行
                new: true,
                _highlight: true,
               status: {"name":"草稿","value":0},
               guestName: '',
               createUname: '',
               serviceId: '',
               orderMan:'',
               // orderDate: tools.transTime(new Date()),
               printing: '',
               createTime: '',
               detailVOS: [],
          },
          //表单验证
          ruleValidate: {
            guestName: [{ required: true, type:'string',message: '调出方不能为空', trigger: 'change' }],
            storeId: [{ required: true,type:'string', message: '调入仓库不能为空', trigger: 'change' }],
            orderDate: [{ required: true, type: 'date', message: '请选择', trigger: 'change' }],
            remark:[{max: 100, message:'备注长度输入小于100个字符', trigger:'blur'}]
          },
          datadata: null,
          rowId:'', //当前行的id
          buttonDisable: true,
          buttonDisableTwo: true,
          split1:0.2,
          purchaseType: '9999',
          purchaseTypeArr:[
            { label:'所有',value:'9999' },
            { label:'草稿',value:'DRAFT' },
            { label:'待受理',value:'UNACCEPTED' },
            { label:'已受理',value:'ACCEPTED' },
            // { label:'待分拣',value:'SORTING' },
            // { label:'待发货',value:'SHIPPED' },
            { label:'已完成',value:'STOCKING' },
            // { label:'已入库',value:'WAREHOUSING' },
            { label:'部分受理',value:'SECTION_ACCEPT' },
            { label:'已拒绝',value:'REJECTED' },
            { label:'已作废',value:'INVALID' },
          ],
          List:[],
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
                title: '序号',
                minWidth: 50,
                type:'index'
              },
              {
                title: '状态',
                key: 'status',
                minWidth: 70,
                render:(h,params) => {
                  // let Identity = JSON.parse(params.row.status ||{})
                  let name = params.row.status.name
                  return h('span',name)
                }
              },
              {
                title: '调出方',
                key: 'guestName',
                minWidth: 80
              },
              {
                title: '创建日期',
                key: 'createTime',
                minWidth: 120
              },
              {
                title: '申请人',
                key: 'createUname',
                minWidth: 100
              },
              {
                title: '申请单号',
                key: 'serviceId',
                minWidth: 120
              },
              {
                title: '提交人',
                key: 'commitUname',
                minWidth: 100
              },
              {
                title: '提交日期',
                align:'center',
                key: 'commitDate',
                minWidth: 170
              },
              {
                title: '打印次数',
                key: 'printing',
                minWidth: 70
              }
            ],
            tbdata: []
          },
          tableData:[],
          //左侧表格高度
          leftTableHeight:0,
          //右侧表格高度
          rightTableHeight:0,
          Right: {
            page: {
              num: 1,
              size: 10,
              total: 0
            },
            loading: false,
            tbdata: [],
          },
          advanced: false, //更多模块的弹框
          GainInformation: false, //编辑收获信息
          rowData: '',  //声明一个数据，用于赋值右边内容
          selectArr:[], //快速查询的数组 用于赋值,
          moreArr: {},
          presentrowMsg: 0,
          resId: true,
          guestidId: '' ,//给后台传值保存调出方的id
           isAdd:true, //判断是否能新增
          formPlan: {
            guestName:'',//调出方
            storeId: this.$store.state.user.userId, //调入仓库
            orderDate: '', //申请调拨日期
            remark: '', //备注
            createUname: '', //申请人
            serviceId: '', //申请单号
          },
          mainId: null, //选中行的id
          clickdelivery: false,
          Flaga: false,
          ArrayValue: [],
          getArray: [],
          currentRow: {},
          //临时禁用保存提交作废按钮
          isSaveClick:false,
          isCommitClick: false,
          isCancelClick: false,

          isSaveOk: true
        }
      },
      methods: {
        throwNameFun(v){
          this.getSupplierName(v)
        },


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

        keydown($event){
          if ($event.$event.keyCode == 9){
            this.editNextCell($event.$table)
          }
        },

        //------------------------------------------------------------------------//

        showOwen() {
          tools.setSession("self", { applyFor: this.showSelf });
          this.leftgetList();
        },
        selectOption(date) {
          this.selectvalue = date.value
        },
        getArrayParams() {
          var req = {};
          req.page = 0;
          req.size = 1000;
          findForAllot(req).then(res => {
            const { content } = res.data;
            this.getArray = content;
            content.forEach(item => {
              this.ArrayValue.push({value:item.id,label:item.fullName});
            });
          });
        },
        //删除配件
        Delete(){
          if (this.checkboxArr.length <= 0) {
            return this.$Message.error("请先选择配件!")
          }
          var set = this.checkboxArr.map(item=>item.partId)
          var resArr = this.Right.tbdata.filter(item => !set.includes(item.partId))
          this.Right.tbdata = resArr
          let data = {}
           data.id = this.rowId
                    data.orgid = this.rowOrgId
                    data.guestOrgid = this.formPlan.guestOrgid
                    data.guestId = this.guestidId
                    // data.guestId = this.formPlan.guestName
                    data.storeId = this.formPlan.storeId
                    // data.guestName = this.formPlan.guestName
                    data.orderDate = tools.transTime(this.formPlan.orderDate)
                    data.remark = this.formPlan.remark
                    data.createUname  = this.formPlan.createUname
                    data.serviceId = this.formPlan.serviceId
                    data.detailVOS = resArr
               save(data).then(res => {
                      if(res.code === 0){
                        this.$message.success('删除成功！！！')
                      }
                    })
        },
        //更多按钮
        moreaa(){
          this.$refs.moremore.init()
        },
        //调出方下拉框
        selectGuestName(val){
          this.formPlan.guestName = val.value
        },
        // 新增按钮
        addProoo(){
          let currentRowTable = this.$refs["currentRowTable"];
          currentRowTable.clearCurrentRow();
          this.Left.tbdata.forEach(el => {
            el._highlight = false;
          })
          var date = new Date()
          // date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
          var dataTime = tools.transTime(date)
          this.buttonDisable = false
          this.presentrowMsg = 0
          this.resId = true
          if (!this.isAdd) {
            return this.$Message.error('请先保存数据');
          }
          this.$refs.formPlan.resetFields();
          this.Left.tbdata.unshift(this.PTrow)
          this.currentRow = this.PTrow;
          this.isAdd = false;
          this.datadata = this.PTrow
          this.formPlan.guestName = '',//调出方
            this.formPlan.guestOrgid = '',
          this.formPlan.shortName = '',
            this.formPlan.storeId =  this.StoreId, //调入仓库
            this.formPlan.orderDate =  dataTime, //申请调拨日期
            this.formPlan.remark =  '', //备注
            this.formPlan.createUname =  '', //申请人
            this.formPlan.serviceId =  '' //申请单号
            this.Right.tbdata = []
            this.rowId = ''
        },
        // 调入仓库下拉改变事件
        selectStoreId(val){
          // console.log(val)
        },
        //判断表格能不能编辑
        editActivedEvent({row}){
          let xTable = this.$refs.xTable;
          let orderQtyColumn = xTable.getColumnByField("applyQty");
          let remarkColumn = xTable.getColumnByField("remark");
          let isDisabled = this.presentrowMsg !== 0
          orderQtyColumn.editRender.attrs.disabled = isDisabled;
          remarkColumn.editRender.attrs.disabled = isDisabled;
        },
        //添加配件按钮
        addPro(){
          this.$refs.SelectPartCom.init()
        },
        // 下拉框查询
        SelectChange(){
          this.leftgetList()
        },
        selectTabelData(){},
        //保存按钮
        SaveMsg(){
          let zero = tools.isZero(this.Right.tbdata, {qty: "applyQty"});
          if(zero) return;
              this.$refs.formPlan.validate(async valid => {
                if (valid) {
                  await this.$refs.xTable.validate();
                    let data = {}
                    // for (var i = 0; i < this.getArray.length; i++) {
                    //   if (this.getArray[i].id == this.formPlan.guestName) {
                    //     data.guestOrgid = this.getArray[i].isInternalId;
                    //     data.guestId = this.getArray[i].id;
                    //   }
                    // }
                    data.id = this.rowId
                    data.orgid = this.rowOrgId
                    // data.guestOrgid = this.isInternalId || this.datadata.guestOrgid
                    data.guestId =  this.guestidId
                    data.guestOrgid = this.formPlan.guestOrgid
                    // data.guestId = this.formPlan.guestName
                    data.storeId = this.formPlan.storeId
                    // data.guestName = this.formPlan.guestName
                    data.orderDate = tools.transTime(this.formPlan.orderDate)
                    data.remark = this.formPlan.remark
                    data.createUname  = this.formPlan.createUname
                    data.serviceId = this.formPlan.serviceId
                    data.detailVOS = this.Right.tbdata

                    var date = new Date()
                    var dataTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
                    var orderDateTime = this.formPlan.orderDate
                    var orderTime = orderDateTime.getFullYear() + '-' + (orderDateTime.getMonth() + 1) + '-' + orderDateTime.getDate()
                    if (orderTime < dataTime) {
                      this.$Message.error('调拨申请日期不小于当前日期')
                      return
                    }
                    var date = new Date()
                    var dataTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
                    var orderDateTime = this.formPlan.orderDate
                    var orderTime = orderDateTime.getFullYear() + '-' + (orderDateTime.getMonth() + 1) + '-' + orderDateTime.getDate()
                    if (orderTime < dataTime) {
                      this.$Message.error('调拨申请日期不小于当前日期')
                      return
                    }
                    this.isSaveClick = true;
                    save(data).then(res => {
                      if(!res){
                        this.isSaveClick = false;
                      }
                      if(res.code === 0){
                        this.$message.success('保存成功！');
                        this.formPlan.guestName = '',
                        this.formPlan.shortName = '',
                        this.formPlan.storeId =  '',
                        this.formPlan.remark =  '',
                        this.formPlan.createUname =  '',
                        this.formPlan.serviceId =  '',
                        // this.formPlan.orderDate = ''
                        this.Right.tbdata = []
                        this.isAdd = true
                        this.$refs.formPlan.resetFields();
                        this.leftgetList()
                      }
                    }).catch(e => {
                      this.isSaveClick = false;
                    })
                  // try {

                  // }
                  // catch (errMap) {
                  //   this.$XModal.message({
                  //     status: "error",
                  //     message: "申请数量必须输入大于0的正整数"
                  //   });
                  // }
                } else {
                  if(!this.formPlan.guestName){
                    this.$Message.warning('请选择调出方！')
                  }
                  if(!this.guestidId && !this.formPlan.storeId && !formPlan.orderDate){
                    this.$Message.error('*为必填！');
                  }
                }
              })
        },
        //作废
        cancellation(){
          this.$Modal.confirm({
            title: '是否作废',
            onOk: async () => {
                let data = {}
                data.status = 8
                data.id = this.rowId
                data.orgid = this.rowOrgId
                data.guestId = this.guestidId
                data.guestOrgid = this.formPlan.guestOrgid
                data.storeId = this.formPlan.storeId
                data.orderDate = tools.transTime(this.formPlan.orderDate)
                data.remark = this.formPlan.remark
                data.createUname  = this.formPlan.createUname
                data.serviceId = this.formPlan.serviceId
                data.detailVOS = this.Right.tbdata
                if(this.isCancelClick){
                  return this.$message.error('请稍后数据处理中....');
                }
                try {

                  this.isCancelClick = true;
                  let res = await save(data);
                  if(!res){
                    this.isCancelClick = false;
                  }
                  if (res.code == 0) {
                    this.$Message.success('作废成功');
                    this.leftgetList();
                    this.isAdd = true;
                  }
                } catch (error) {
                  this.isCancelClick = false;

                }
            },
            onCancel: () => {
              this.$Message.info('取消作废');
            },
          })
        },
        // 打印
        stamp(){
          let order = {};
          order.name="调拨申请"
          order.route=this.$route.name
          order.id=this.mainId
          let routeUrl=this.$router.resolve({name:"print",query:order})
          window.open(routeUrl.href,"_blank");
          this.leftgetList()
        },
        //右侧表格复选框选中
        selectChange(msg){
          this.checkboxArr = msg.selection
        },
        // 全选
        selectAll(val){
          this.checkboxArr = val.selection
        },
        //分页
        changePageLeft(p) {
          this.Left.page.num = p
          this.leftgetList()
        },
        changeSizeLeft(size) {
          this.Left.page.num = 1
          this.Left.page.size = size
          this.leftgetList()
        },
        //右部分分页
        changePage(p) {
          this.Left.page.num = p
          // this.getList()
        },
        changeSize(size) {
          this.Left.page.num = 1
          this.Left.page.size = size
          // this.getList()
        },
        // 查询下拉框
        getDataQuick(v){
          this.selectArr = v
          this.leftgetList()
        },
        //供应商下拉查询
        // selecQuery(){
        //   let req = {}
        //   findForAllot(req).then(res => {
        //     this.ArraySelect = res.data.content||[];
        //   })
        // },
        //footer计算
        addFooter ({ columns, data }) {
          return [
            columns.map((column, columnIndex) => {
              if (columnIndex === 0) {
                return '和值'
              }
              if (['applyQty'].includes(column.property)) {
                return this.$utils.sum(data, column.property)
              }
              return null
            })
          ]
        },
        //表格编辑状态下被关闭的事件
        editClosedEvent(){},

        // 更多子组件的参数
        getMsg(msg){
          this.moreArr = msg
          this.leftgetList()
        },
        //子组件的参数
        getPartNameList(ChildMessage){
          // console.log(ChildMessage)
          let parts = ChildMessage.map( item => {

            return {
              partName : item.partStandardName,
              unit : item.minUnit,
              // oemCode : item.brandPartCode,
              // spec : item.specifications,
              enterUnitId : item.direction,
              applyQty :1,
              remark : '',
              partInnerId : item.code,
              partCode : item.partCode,
              oemCode : item.oeCode,
              partBrand : item.partBrand,
              carBrandName : item.adapterCarBrand,
              carModelName : item.adapterCarModel,
              carTypef : item.baseType ? item.baseType.firstType ? item.baseType.firstType.typeName ? item.baseType.firstType.typeName : '' : '' : '',
              cartypes : item.baseType ? item.baseType.secondType ? item.baseType.secondType.typeName ? item.baseType.secondType.typeName : '' : '': '',
              carTypet : item.baseType ? item.baseType.thirdType ? item.baseType.thirdType.typeName ? item.baseType.thirdType.typeName : '': '': '',
              spec : item.specifications || item.spec,
              partId : item.id,
              fullName : item.fullName,
              systemUnitId : item.minUnit,
              isTight: !!item.isTightPart == true? 1:0,
            }
          })
          this.Right.tbdata = [...this.Right.tbdata,...parts]
          this.Right.tbdata = tools.arrRemoval(this.Right.tbdata, 'partInnerId')
          this.$Message.success("已添加");
        },

        //添加配件双击配件填入的数据
        getPartNameList2(ChildMessage){
          let parts = ChildMessage.map( item => {

            return {
              partName : item.partStandardName,
              unit : item.minUnit,
              // oemCode : item.brandPartCode,
              // spec : item.specifications,
              enterUnitId : item.direction,
              applyQty :item.orderQty||1,
              remark : '',
              partInnerId : item.code,
              partCode : item.partCode,
              oemCode : item.oeCode,
              partBrand : item.partBrand,
              carBrandName : item.adapterCarBrand,
              carModelName : item.adapterCarModel,
              carTypef : item.baseType ? item.baseType.firstType ? item.baseType.firstType.typeName ? item.baseType.firstType.typeName : '' : '' : '',
              cartypes : item.baseType ? item.baseType.secondType ? item.baseType.secondType.typeName ? item.baseType.secondType.typeName : '' : '': '',
              carTypet : item.baseType ? item.baseType.thirdType ? item.baseType.thirdType.typeName ? item.baseType.thirdType.typeName : '': '': '',
              spec : item.specifications,
              partId : item.id,
              fullName : item.fullName,
              systemUnitId : item.minUnit,
              isTight: !!item.isTightPart == true? 1:0,
            }
          })
          this.Right.tbdata = [...this.Right.tbdata,...parts]
          this.Right.tbdata = tools.arrRemoval(this.Right.tbdata, 'partInnerId')
          this.$Message.success("已添加");
        },



        //编辑收货信息弹框显示
        GoodsInfoModal(){
          if(!this.datadata || this.datadata.new) return this.$Message.error('请先保存数据');
          this.clickdelivery = true
          this.$refs.goodsInfo.init()
        },
        //供应商弹框
        addSuppler(){
          this.$refs.selectSupplier.init()
        },
        // 供应商子组件内容
        getSupplierName(a){
          this.formPlan.guestOrgid = a.id;
          // this.formPlan.guestName = a.name;
          this.formPlan.guestName = a.shortName || "";
          this.guestidId = a.guestId
          this.isInternalId = a.id
        },
        leftgetList(){
          let params = {}
          params.page = this.Left.page.num - 1
          params.size = this.Left.page.size
          if(this.selectArr !== '9999'){
            params.startTime = this.selectArr[0]
            params.endTime = this.selectArr[1]
          }
          if(this.moreArr.createData){
            params.startTime = this.moreArr.createData[0] + " 00:00:00"
            params.endTime = this.moreArr.createData[1] + " 23:59:59"
          }
          if(this.purchaseType !== '9999'){
            params.status = this.purchaseType
          }
          if(this.moreArr.submitData){
            params.commitDateStart = this.moreArr.submitData[0] + " 00:00:00"
            params.commitDateEnd = this.moreArr.submitData[1] + " 23:59:59"
          }
          if(this.moreArr.callout){
            params.guestId = this.moreArr.guestId
          }
          if(this.moreArr.numbers){
            params.serviceId = this.moreArr.numbers
          }
          if(this.moreArr.coding){
            params.partCode = this.moreArr.coding
          }
          if(this.moreArr.Accessories){
            params.createUname = this.moreArr.Accessories
          }
          if(this.moreArr.Name){
            params.fullName = this.moreArr.Name
          }
          if(this.showSelf) {
            let createUid = this.$store.state.user.userData.id;
            params.createUid = createUid;
          } else {
            Reflect.deleteProperty(params, "createUid")
          }
          queryAll(params).then(res => {
            if(res.code === 0){
              this.Left.tbdata = res.data.content
              this.Left.page.total = res.data.totalElements;
              if(this.currentRow.id) {
                this.Left.tbdata.forEach(el => {
                  if (el.id == this.currentRow.id) {
                    el._highlight = true;
                    this.isAdd = true;
                    this.setRow(el)
                  }
                })
              } else if(this.Left.tbdata.length > 0) {
                this.Left.tbdata[0]._highlight = true;
                this.isAdd = true;
                this.setRow(this.Left.tbdata[0]);
              }else {
                this.isSaveClick = false;
                this.isCommitClick = false;
                this.isCancelClick = false;
              }
            }else {
              this.Left.page.total = 0;
              this.isSaveClick = false;
              this.isCommitClick = false;
              this.isCancelClick = false;
            }
          })
        },
        roleChangeEvent({ row }, evnt) {
          // 使用内置 select 需要手动更新，使用第三方组件如果是 v-model 就不需要手动赋值
          // this.currentrow.storeId = evnt.target.value
        },

        // 左边部分的当前行
        selection(row){
          if (row == null) return;
          this.selectRowId = row.id;
          this.currentRow = row;
          let currentRowTable = this.$refs["currentRowTable"];
          if(!this.Flaga && !this.isAdd && row.id){
            this.$Modal.confirm({
              title: '您正在编辑单据，是否需要保存',
              onOk: () => {
                this.$refs.formPlan.validate((valid) => {
                  if (valid) {
                    let data = {};
                    data.id = this.rowId;
                    data.orgid = this.rowOrgId;
                    data.guestOrgid = this.formPlan.guestOrgid;
                    data.guestId = this.guestidId
                    // data.guestId = this.formPlan.guestName
                    data.storeId = this.formPlan.storeId
                    // data.guestName = this.formPlan.guestName
                    data.orderDate = tools.transTime(this.formPlan.orderDate)
                    data.remark = this.formPlan.remark
                    data.createUname  = this.formPlan.createUname
                    data.serviceId = this.formPlan.serviceId
                    data.detailVOS = this.Right.tbdata
                    save(data).then(res => {
                      if(res.code === 0){
                        currentRowTable.clearCurrentRow();
                        this.isAdd = true;
                        this.$message.success('保存成功！')
                        this.formPlan.guestName = '',
                        this.formPlan.storeId =  '',
                        this.formPlan.remark =  '',
                        this.formPlan.createUname =  '',
                        this.formPlan.serviceId =  '',
                        this.formPlan.orderDate = null;
                        this.Right.tbdata = []
                        this.$refs.formPlan.resetFields();
                        this.leftgetList()
                      }
                    })
                  } else {
                    currentRowTable.clearCurrentRow();
                    this.Left.tbdata.forEach(el => {
                      el._highlight = false;
                    })
                    this.Left.tbdata[0]._highlight = true;
                    this.$Message.error('*为必填！');
                  }
                })
              },
              onCancel: () => {
                this.Left.tbdata.splice(0, 1);
                currentRowTable.clearCurrentRow();
                this.Left.tbdata.forEach(el => {
                  if (el.id == row.id) {
                    el._highlight = true;
                    this.isAdd = true;
                    this.$refs.formPlan.resetFields();
                    this.setRow(row)
                  }
                })
                // this.isAdd = true;
                // this.formPlan.guestName = '',
                // this.formPlan.storeId =  '',
                // this.formPlan.remark =  '',
                // this.formPlan.createUname =  '',
                // this.formPlan.serviceId =  '',
                // this.formPlan.orderDate = ''
                // this.Right.tbdata = []
                // this.$refs.formPlan.resetFields();
              },
            })
          }else{
            if(row.id){
              this.setRow(row)
            }
            // console.log(row);
            // this.formPlan.guestName = row.guestName
          }

        },
        setRow(row) {
          // this.leftgetList()
          this.rowOrgId = row.orgid
          this.selectRowId = row.id;
          this.mainId = row.id
          this.guestidId = row.guestId
          this.datadata = row;
          this.isInternalId = row.guestOrgid;
          this.formPlan.guestOrgid = row.guestOrgid;
          this.formPlan.guestName = this.datadata.guestName
          // this.formPlan.guestName = this.datadata.guestId
          this.formPlan.storeId = this.datadata.storeId
          this.formPlan.orderDate = new Date(this.datadata.orderDate);
          this.formPlan.remark = this.datadata.remark
          this.formPlan.createUname = this.datadata.createUname
          this.formPlan.serviceId = this.datadata.serviceId
          // this.guestidId = this
          this.presentrowMsg = row.status.value
          this.resId = false
          this.rowId = row.id
          this.buttonDisable = false
          if(row.status&&(row.status.value==9||row.status.value==1)){
            this.changeOrderBtn = false;
          }else{
            this.changeOrderBtn = true;
          }
          this.getRightlist();

          this.upurl = upxlxsDBo + row.id;
          this.upurlInnerId=upxlxsDBoInnerId + row.id;
        },
        //右部分接口
        getRightlist(){
          let params = {}
          params.id = this.rowId
          findById(params).then(res => {
            this.isSaveClick = false;
            this.isCommitClick = false;
            this.isCancelClick = false;
            if(res.code === 0){
              this.rowData = res.data
              this.Right.tbdata = res.data.detailVOS
            }
          })
        },
        // 仓库下拉框
        warehouse(){
          queryByOrgid().then(res => {
              if(res.code === 0){
                this.List = res.data
                 res.data.map(item => {
                   if(item.isDefault == true){
                     this.formPlan.storeId = item.id
                     this.StoreId = item.id
                   }
                 })
              }
          })
        },
        // 提交按钮
        instance (name) {
          if (this.rowId.length <= 3) {
            return this.$message.error("请先保存数据，再提交！")
          }
          let zero = tools.isZero(this.Right.tbdata, {qty: "applyQty"});
          if(zero) return;
          this.$refs[name].validate((valid) => {
            if (valid) {
              this.$Modal.confirm({
                title: '是否提交',
                onOk: async () => {
                  // if(this.clickdelivery){
                    let data = {}
                    // data.guestOrgid = this.datadata.guestOrgid || this.isInternalId;
                    data.id = this.rowId
                    data.orgid = this.rowOrgId
                    data.guestId = this.guestidId
                    data.guestOrgid = this.formPlan.guestOrgid
                    // data.guestId = this.formPlan.guestName
                    data.storeId = this.formPlan.storeId
                    data.orderDate = tools.transTime(this.formPlan.orderDate)
                    data.remark = this.formPlan.remark
                    data.createUname  = this.formPlan.createUname
                    data.serviceId = this.formPlan.serviceId
                    data.detailVOS = this.Right.tbdata
                    if(this.isCommitClick){
                      return this.$message.error('请稍后数据处理中....');
                    }
                    try {
                      this.isCommitClick = true;
                      let res = await commit(data);
                      if(!res){
                        this.isCommitClick = false;
                      }
                      if (res.code == 0) {
                        this.$Message.success('提交成功');
                        this.leftgetList();
                        this.isAdd = true;
                        this.$refs.formPlan.resetFields();
                      }
                    } catch (error) {
                      this.isCommitClick = false;
                    }
                  // }else{
                  //   this.$Message.warning('请先编辑收货信息')
                  // }
                },
                onCancel: () => {
                  this.$Message.info('取消提交');
                },
              })
            } else {
              this.$Message.error('*为必填项！');
            }
          })
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
            this.rightTableHeight = wrapH - planFormH - planBtnH - 38 - 64;
          });
        },

        //下载模板 编码品牌导入
        down(){
          down('2300000000')
        },
        //配件内码模板
        downInnerId(){
          down('3400000000')
        },
        // 导入 编码品牌导入配件
        handleBeforeUpload() {
          if (this.datadata.new) {
            return this.$Message.error("请先保存数据!");
          }
          let refs = this.$refs;
          refs.upload.clearFiles();
        },
        // 导入 内码导入配件
        handleBeforeUploadInnerId(){
          if (this.datadata.new) {
            return this.$Message.error("请先保存数据!");
          }
          let refs = this.$refs;
          refs.upload1.clearFiles();
        },
        handleSuccess(res, file) {
          let self = this;
          if (res.code == 0) {
            if(res.data.length<=0){
              self.$Message.success("导入成功");
              this.leftgetList()
            }else{
              this.Left.tbdata.forEach(el => {
                if (el.id == this.selectRowId) {
                  el._highlight = true;
                  this.isAdd = true;
                  this.setRow(el);
                  this.warning(res.data);
                }
              })
            }
          } else {
            self.$Message.error(res.message);
          }
        },
        warning(nodesc){
          let str=""
          if(nodesc.length>0){
            nodesc.map((item,index)=>{
              if(index!=nodesc.length-1){
                str+=`${item}<br/>`;
              }else{
                str+=`${item}`;
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
        changeOrderFun(){
          this.$refs.changeOrder.init(this.selectRowId);
        }
      },
      mounted(){
        let self = tools.getSession("self");
        this.showSelf = Reflect.has(self, "applyFor") ? self.applyFor : true;

        setTimeout(() => {
          this.getDomHeight();
        }, 0);

        window.onresize = () => {
          this.getDomHeight();
        };
          // this.leftgetList();
          this.warehouse();
          // this.getArrayParams();
          // this.selecQuery();
      }
    }
</script>
<style>
.ivu-form-item-error-tip {
  display: none !important;
  opacity: 0 !important;
}
</style>
<style scoped>
  .con-box{
    height: 700px;
  }
  .w640{
    width: 620px;
  }

  /*.formItem {*/
    /*margin-bottom: 15px;*/
  /*}*/
</style>
