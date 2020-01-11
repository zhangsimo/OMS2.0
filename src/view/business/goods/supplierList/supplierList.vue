<template>
  <div>
    <div class="content-oper content-oper-flex">
      <section class="oper-box">
        <div class="oper-top flex">
          <div class="wlf">
            <div class="db">
              <span>快速查询：</span>
              <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>
              <Select v-model="purchaseType" class="w90 mr10" @on-change="SelectChange">
                <Option v-for="item in statusArr" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </div>
            <div class="db">
              <Button type="default" @click="moreaa" class="mr10"><i class="iconfont mr5 iconchaxunicon"></i>更多</Button>
            </div>
            <div class="db">
              <Button class="mr10" @click="addProoo" v-has="'add'"><Icon type="md-add"/> 新增</Button>
            </div>
            <div class="db">
              <Button type="default" @click='SaveMsg' v-has="'save'" class="mr10" :disabled="buttonDisable || presentrowMsg !== 0"><i class="iconfont mr5 iconbaocunicon"></i>保存</Button>
            </div>
            <div class="db">
              <Button class="mr10" @click="instance" v-has="'submit'" :disabled="buttonDisable || presentrowMsg !== 0"><i class="iconfont mr5 iconziyuan2"></i>提交</Button>
            </div>
            <div class="db">
              <Button class="mr10" :disabled="presentrowMsg !== 1" @click="salesReturn" v-has="'return'"><i class="iconfont mr5 iconziyuan2"></i>退货</Button>
            </div>
            <div class="db">
              <Button @click="cancellation" v-has="'cancellation'" class="mr10" :disabled="buttonDisable || presentrowMsg !== 0"><Icon type="md-close" size="14" /> 作废</Button>
            </div>
            <div class="db">
              <Button @click="stamp" class="mr10" v-has="'print'"><i class="iconfont mr5 icondayinicon"></i> 打印</Button>
            </div>
          </div>
        </div>
      </section>
      <section class="con-box">
        <div class="inner-box">
          <div class="con-split" ref="paneLeft" >
            <Split v-model="split1" min="200" max="500">
              <div slot="left" class="con-split-pane-left" >
                <div class="pane-made-hd">
                  采购退货列表
                </div>
                <Table :height="leftTableHeight"  @on-current-change="selectTabelData" size="small" highlight-row  border :stripe="false" :columns="Left.columns" :data="Left.tbdata" @on-row-click="selection" ref="currentRowTable"></Table>
                <Page class-name="fl pt10" size="small" :current="Left.page.num" :total="Left.page.total" :page-size="Left.page.size" @on-change="changePageLeft"
                      @on-page-size-change="changeSizeLeft" show-sizer show-total>
                </Page>
              </div>
              <div slot="right" class="con-split-pane-right pl5 goods-list-form">
                <div class="pane-made-hd">
                  采购退货信息
                </div>
                <div class="clearfix purchase" ref="planForm">
                  <Form inline
                        :model="formPlan"
                        :show-message="false"
                        ref="formPlan"
                        :rules="ruleValidate"
                        :label-width="100">
                    <FormItem label="供应商：" prop="guestName" class="fs12">
                      <Row class="w350">
                        <Col span="22">
                          <!--<Input placeholder="请选择供应商" v-model="formPlan.guestName" disabled></Input>-->
                          <Select v-model="formPlan.guestName" filterable :disabled="buttonDisable || presentrowMsg !== 0" @on-change="SelectGuest">
                            <Option v-for="item in ArraySelect" :value="item.id" :key="item.id">{{ item.fullName }}</Option>
                          </Select>
                        </Col>
                        <Col span="2"><Button class="ml5" size="small" type="default" @click="addSuppler" :disabled="buttonDisable || presentrowMsg !== 0"><i class="iconfont iconxuanzetichengchengyuanicon"></i></Button></Col>
                      </Row>
                    </FormItem>
                    <FormItem label="退货员：" prop="storeId" >
                      <Select class="w160" :disabled="presentrowMsg !== 0 || buttonDisable" v-model="formPlan.storeId" filterable label-in-value @on-change="selectOrderMan">
                        <Option v-for="item in userMap" :value="item.id" :key="item.id">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="退货日期：" prop="orderDate" class="fs12">
                      <DatePicker
                        style="width: 160px"
                        type="date"
                        placeholder="请选择调拨申请日期"
                        v-model="formPlan.orderDate"
                        :disabled="presentrowMsg !== 0 || buttonDisable"
                      ></DatePicker>
                    </FormItem>
                    <FormItem label="采退单号：" prop="numbers" class="fs12">
                    <Input class="w160" :disabled="true" v-model="formPlan.numbers"></Input>
                    </FormItem>
                    <FormItem label="退货原因：" prop="cause">
                      <Select class="w120" :disabled="presentrowMsg !== 0 || buttonDisable" v-model="formPlan.cause">
                        <Option v-for="item in purchaseTypeArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="结算方式：" prop="clearing">
                      <Select class="w120" :disabled="presentrowMsg !== 0 || buttonDisable" v-model="formPlan.clearing">
                        <Option v-for="item in settleMethods" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="备注：" prop="remark">
                      <Input class="w160" :disabled="presentrowMsg !== 0 || buttonDisable" v-model="formPlan.remark"></Input>
                    </FormItem>
                    <FormItem label="退货仓库：" prop="planner">
                      <Select class="w160" :disabled="presentrowMsg !== 0 || buttonDisable" v-model="formPlan.warehouse">
                        <Option v-for="item in inStores" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="采购订单:" prop="planOrderNum" class="">
                      <Input class="w160" :disabled="buttonDisableTwo" v-model="formPlan.serviceId"></Input>
                    </FormItem>
                  </Form>
                </div>
                <div class="flex plan-cz-btn" ref="planBtn">
                  <div class="clearfix">
                    <div class="fl mb5">
                      <Button size="small" class="mr10" @click="addPro" v-has="'selectProject'" :disabled="presentrowMsg !== 0"><Icon type="md-add"/> 选择采购入库单</Button>
                    </div>
                    <div class="fl mb5">
                      <Button size="small" class="mr10" :disabled="presentrowMsg !== 0" @click="Delete" v-has="'delete'"><i class="iconfont mr5 iconlajitongicon"></i> 删除配件</Button>
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
                  size="mini"
                  :edit-rules="validRules"
                  :height="rightTableHeight"
                  :data="Right.tbdata"
                  :footer-method="addFooter"
                  showOverflow="true"
                  height="500"
                  @edit-actived="editActivedEvent"
                  :edit-config="{trigger: 'click', mode: 'cell'}">
                  <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                  <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                  <vxe-table-column field="partCode" title="配件编码" width="100"></vxe-table-column>
                  <vxe-table-column field="partName" title="配件名称" width="100"></vxe-table-column>
                  <vxe-table-column field="partBrand" title="品牌" width="100"></vxe-table-column>
                  <vxe-table-column field="outUnitId" title="单位" width="100"></vxe-table-column>
                  <vxe-table-column field="canReQty" title="可退数量" width="100"></vxe-table-column>
                  <vxe-table-column field="orderQty" title="退货数量" :edit-render="{name: 'input',attrs: {disabled: false}}" width="100">
                  </vxe-table-column>
                  <vxe-table-column field="orderPrice" title="退货单价" :edit-render="{name: 'input'}" width="100">
                  </vxe-table-column>
                  <vxe-table-column field="orderAmt" title="退货金额" width="100">
                    <template v-slot="{ row }">
                      {{ countAmount(row) | priceFilters }}
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="remark" title="备注" :edit-render="{name: 'input',attrs: {disabled: presentrowMsg !== 0}}" width="100"></vxe-table-column>
                  <vxe-table-column field="stockOutQty" title="缺货数量" width="100"></vxe-table-column>
                  <vxe-table-column field="oemCode" title="OE码" width="100"></vxe-table-column>
                  <vxe-table-column field="spec" title="规格" width="100"></vxe-table-column>
                </vxe-table>
                <!--<div ref="planPage">-->
                  <!--<Page size="small" class-name="page-con" :current="Right.page.num" :total="Right.page.total" :page-size="Right.page.size" @on-change="changePage"-->
                        <!--@on-page-size-change="changeSize" show-sizer show-total></Page>-->
                <!--</div>-->
              </div>
            </Split>
          </div>
        </div>
      </section>
      <!--更多弹框-->
      <More @sendMsg="getMsg" ref="moremore"></More>
      <!--选择采购计划弹窗-->
      <procurement-modal ref="procurementModal" :guestId="guestidId" @getPlanOrder="getPlanOrder" @selectRow="selectRow"></procurement-modal>
    </div>
    <!--供应商资料-->
    <select-supplier ref="selectSupplier" header-tit="供应商资料" @selectSupplierName="getSupplierName"></select-supplier>
    <!--打印弹框-->
    <print-show ref="PrintModel" :orderId="mainId"></print-show>
  </div>
</template>
<script>
  import * as tools from "../../../../utils/tools";

  import QuickDate from '../../../../components/getDate/dateget'
  import More from './compontents/More'
  import SelectSupplier from "../../../goods/goodsList/components/supplier/selectSupplier";
  import '../../../lease/product/lease.less';
  import "../../../goods/goodsList/goodsList.less";
  import PrintShow from "./compontents/PrintShow";
  // import ProcurementModal from '../../../goods/plannedPurchaseOrder/components/ProcurementModal.vue';
  import ProcurementModal from './compontents/ProcurementModal'
  import { optGroup, findPageByDynamicQuery,saveDraft,sellOrderReturn,saveCommit,returnPchs,saveObsolete,queryByConditions } from '../../../../api/business/supplierListApi';
  import { getSupplierList } from "_api/purchasing/purchasePlan";
  import { getSales } from "@/api/salesManagment/salesOrder";
  export default {
    name: 'supplierList',
    components: {
      QuickDate,
      More,
      ProcurementModal,
      SelectSupplier,
      PrintShow
    },
    data() {
      let changeNumber = (rule, value, callback) => {
        if (!value && value != '0') {
          callback(new Error("请输入大于或等于0的正整数"));
        } else {
          const reg = /^([0]|[1-9][0-9]*)$/
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error("请输入大于或等于0的正整数"));
          }
        }
      };
      //价格（2位小数）
      let money = (rule, value, callback) => {
        if (!value && value != "0") {
          callback(new Error("最多保留2位小数"));
        } else {
          const reg = /^\d+(\.\d{0,2})?$/i;
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error("最多保留2位小数"));
          }
        }
      };
      return {
        ArraySelect: [], //供应商下拉框
        checkboxArr:[],// checkbox选中
        disSave: false, // 保存按钮是否禁用
        PTrow: {//新增当前行
          new: true,
          _highlight: true,
          billStatusId: {name: "草稿", value: 0, enum: "DRAFT"},
          guestId : ''  , //调出方
          orderMan : this.$store.state.user.userData.id ,   //退货员
          orderDate : tools.transTime(new Date()),  //退货日期
          serviceId : '',  //采退单号
          rtnReasonId : '',  //退货原因
          settleTypeId : '',  //结算方式
          remark : '',  //备注
          storeId : '',  //退货仓库
          code : '', //采购订单
          details : '' //子表格
        },
        //表单验证
        ruleValidate: {
          guestName: [{ required: true,type: 'string',message: '供应商不能为空', trigger: 'change' }],
          storeId: [{ required: true, type: 'string',message: '请选择退货员', trigger: 'change' }],
          // orderDate: [{ required: true, type: 'date', message: '请选择', trigger: 'change' }],
          cause: [{ required: true, type: 'string',message: '请选择退货原因', trigger: 'change' }],
          clearing: [{ required: true, type: 'string',message: '请选择结算方式', trigger: 'change' }]
        },
        datadata: null,
        rowId:'', //当前行的id
        buttonDisable: true,
        buttonDisableTwo: true,
        split1:0.2,
        purchaseType: '99',
        statusArr:[], //状态
        settleMethods: [], //结算方式
        inStores: [], //退货仓
        purchaseTypeArr: [], //退货原因
        userMap: [], //退货员
        //校验输入框的值
        validRules: {
          orderQty: [{ required: true,validator:changeNumber }],
          orderPrice:[{required: true,validator:money}]
          // remark: [
          //   { required: true, validator:changeNumber }
          // ]
        },
        List:[],
        Left: {
          page: {
            num: 1,
            size: 10,
            total: 0
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
              key: 'billStatusId',
              minWidth: 70,
              render:(h,params) => {
                let name = params.row.billStatusId.name
                return h('span',name)
              }
            },
            {
              title: '供应商',
              key: 'guestName',
              minWidth: 80
            },
            {
              title: '创建日期',
              key: 'createTime',
              minWidth: 120
            },
            {
              title: '创建人',
              key: 'createUname',
              minWidth: 100
            },
            {
              title: '采退单号',
              key: 'serviceId',
              minWidth: 120
            },
            {
              title: '打印次数',
              key: 'printTimes',
              minWidth: 70
            },
            {
              title: '提交人',
              key: 'auditor',
              minWidth: 100
            },
            {
              title: '提交日期',
              align:'center',
              key: 'auditDate',
              minWidth: 170
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
        guestidId: '' ,//给后台传值保存调出方的id
        isAdd:true, //判断是否能新增
        formPlan: {
          cause: '',  //退货原因
          clearing: '', //结算方式
          guestName:'',//供应商
          storeId: this.$store.state.user.userData.id , //退货员id
          storeName: '', //退货员名称
          orderDate: tools.transTime(new Date()), //退货日期
          remark: '', //备注
          warehouse: '', //退货仓库
          serviceId: '', //采购单号
          numbers: '' ,//采退单号
        },
        mainId: null, //选中行的id
        clickdelivery: false,
        Flaga: false, //判断是否出现退出弹框
        Acode: '', //保存,提交时需给后台传的code
        AcodeId: '', //保存,提交时需给后台传的codeId
        successNOid: '', //没有id
        successHaveId: '', //有id
      }
    },
    methods: {
      //计算表格数据
      countAmount(row) {
        return (
          this.$utils.toNumber(row.orderQty) *
          this.$utils.toNumber(row.orderPrice)
        );
      },
      //判断从表input能不能编辑
      editActivedEvent({row}){
        let xTable = this.$refs.xTable;
        let orderQtyColumn = xTable.getColumnByField("orderQty");
        let remarkColumn = xTable.getColumnByField("remark");
        let isDisabled = this.presentrowMsg !== 0
        orderQtyColumn.editRender.attrs.disabled = isDisabled;
        remarkColumn.editRender.attrs.disabled = isDisabled;
      },
      //删除配件
      Delete(){
        if(this.checkboxArr.length > 0){
          var result = this.checkboxArr.every(item => item.id)
          var resultTwo = this.checkboxArr.some(item => item.id)
          if(result){
            let data = this.checkboxArr.map(item => {
              return item.id
            })
            sellOrderReturn(data).then(res => {
              if(res.code === 0){
                this.$Message.success('删除成功！')
                this.leftgetList();
                // this.$refs.formPlan.resetFields();
                let checkBoxArr = this.checkboxArr.map(item => item.id)
                this.Right.tbdata = this.Right.tbdata.filter(item => !checkBoxArr.includes(item.id))
              }
            })
          }else if(resultTwo){
            let haveId = this.checkboxArr.filter(item => item.id)
            let NoId = this.checkboxArr.filter(item => !item.id)
            let NoIdPartCode = NoId.map(item => item.partCode)
            let AddNoId = this.Right.tbdata.filter(item => !item.id)
            let NoRepeat = AddNoId.filter(item => !NoIdPartCode.includes(item.partCode))
            // let data = {}
            // data.code = this.Acode || this.formPlan.serviceId
            // data.codeId = this.AcodeId
            // data.id = this.rowId
            // data.guestId = this.formPlan.guestName   //调出方
            // data.orderManId = this.formPlan.storeId     //退货员id
            // data.orderMan = this.formPlan.orderMan //退货员
            // data.orderDate = tools.transTime(this.formPlan.orderDate)  //退货日期
            // data.serviceId = this.formPlan.numbers  //采退单号
            // data.rtnReasonId = this.formPlan.cause  //退货原因
            // data.settleTypeId = this.formPlan.clearing  //结算方式
            // data.remark = this.formPlan.remark  //备注
            // data.storeId = this.formPlan.warehouse  //退货仓库
            // // data.code = this.formPlan.serviceId //采购订单
            // data.details = NoRepeat
            // //保存假增的数据
            // saveDraft(data).then(res => {
            //   if(res.code === 0){
            //     this.successHaveId = true
            //   }
            // })
            let dataTwo = haveId.map(item => {
              return item.id
            })
            //删除真增加的数据
            sellOrderReturn(dataTwo).then(res => {
              if(res.code == 0){
                this.successHaveId = true
              }
            })
            setTimeout(() => {
              this.$nextTick( () => {
                // if(this.successNOid && this.successHaveId){
                  if(this.successHaveId){
                    this.$message.success('删除成功！');
                  let checkBoxArr = this.checkboxArr.map(item => item.id)
                  this.Right.tbdata = this.Right.tbdata.filter(item => !checkBoxArr.includes(item.id))
                }
              })
            },1000)
          }else {
            // var set = this.checkboxArr.map(item => item.partCode)
            // var resArr = this.Right.tbdata.filter(item => !set.includes(item.partCode))
            // let data = {}
            // data.code = this.Acode || this.formPlan.serviceId
            // data.codeId = this.AcodeId
            // data.id = this.rowId
            // // data.guestId = this.guestidId   //调出方
            // data.guestId = this.formPlan.guestName   //调出方
            // data.orderManId = this.formPlan.storeId     //退货员id
            // data.orderMan = this.formPlan.orderMan //退货员
            // data.orderDate = tools.transTime(this.formPlan.orderDate)  //退货日期
            // data.serviceId = this.formPlan.numbers  //采退单号
            // data.rtnReasonId = this.formPlan.cause  //退货原因
            // data.settleTypeId = this.formPlan.clearing  //结算方式
            // data.remark = this.formPlan.remark  //备注
            // data.storeId = this.formPlan.warehouse  //退货仓库
            // data.details = resArr
            // saveDraft(data).then(res => {
            //   if(res.code === 0){
            //     this.$message.success('删除成功！')
            //     this.$refs.formPlan.resetFields();
            //     let checkBoxArr = this.checkboxArr.map(item => item.partCode)
            //     this.Right.tbdata  = this.Right.tbdata.filter(item => !checkBoxArr.includes(item.partCode))
            //   }
            // })
                let checkBoxArr = this.checkboxArr.map(item => item.partCode)
                this.Right.tbdata = this.Right.tbdata.filter(item => !checkBoxArr.includes(item.partCode))
                this.$Message.warning('删除成功！')
          }
        }else {
          this.$Message.warning('请选择要删除的配件！')
        }
      },
      //更多按钮
      moreaa(){
        this.$refs.moremore.init()
      },
      // 计算尾部总和
      countAllAmount(data) {
        let count = 0;
        data.forEach(row => {
          count += this.countAmount(row);
        });
        count = count.toFixed(2)
        this.totalMoney = count;
        return count;
      },
      // 新增按钮
      addProoo(){
        this.$refs.formPlan.resetFields();
        this.buttonDisable = false
        this.presentrowMsg = 0
        if (!this.isAdd) {
          return this.$Message.error('请先保存数据');
        }
          this.formPlan.cause =  '',  //退货原因
          this.formPlan.clearing =  '', //结算方式
          this.formPlan.guestName = '',//供应商
          this.formPlan.storeId =  this.$store.state.user.userData.id , //退货员
          this.formPlan.orderDate =  tools.transTime(new Date()), //退货日期
          this.formPlan.remark =  '', //备注
          this.formPlan.warehouse =  '', //退货仓库
          this.formPlan.serviceId =  '', //采购单号
          this.formPlan.numbers =  '' ,//采退单号
          this.Right.tbdata = []
          this.isAdd = false;
        this.Left.tbdata.unshift(this.PTrow)
        this.datadata = this.PTrow
        this.rowId = ''

        // console.log(this.Left.tbdata)
      },
      //删除配件的全选
      selectAll(aaa){
        this.checkboxArr = aaa.selection
        // console.log(this.checkboxArr)
      },
      //添加配件按钮
      addPro(){
        if (!this.formPlan.guestName) return this.$Message.error('请选择供应商');
        this.showModel('procurementModal')
      },
      //显示子组件封装的方法
      showModel(name) {
        let ref = this.$refs[name];
        ref.init();
      },
      // 下拉框查询
      SelectChange(){
        this.leftgetList()
      },
      //获取销售员
      selectOrderMan(val){
        // console.log(val)
        this.formPlan.storeId = val.value
        // this.formPlan.orderManId = val.value
      },
      //供应商下拉查询
      selecQuery(){
        let req = {}
        getSupplierList(req).then(res => {
          this.ArraySelect = res.data||[];
        })
      },
      //供应商下拉框发生改变
      SelectGuest(val){
        // console.log(val)
        this.guestidId = val
      },
      //选择采购入库单
      getPlanOrder(Msg){
        let arr = Msg.details || []
        arr.map(item => {
          item.outUnitId = item.unit
          item.stockOutQty = item.totalStockQty
        })
        if(this.Right.tbdata){
          this.Right.tbdata = [...this.Right.tbdata,...arr];
          this.Right.tbdata = tools.arrRemoval(this.Right.tbdata,'oemCode');
        } else {
          this.Right.tbdata = arr
        }
      },
      //选择采购入库单的主表code
      selectRow(val){
        this.Acode =  val.code
        this.AcodeId =  val.codeId
      },
      selectTabelData(){},
      //保存按钮
      SaveMsg(){
        this.$refs.formPlan.validate(async valid => {
          if (valid) {
            try {
              await this.$refs.xTable.validate();
              let data = {}
              data.code = this.Acode || this.formPlan.serviceId
              data.codeId = this.AcodeId
              data.id = this.rowId
              // data.guestId = this.guestidId   //调出方
              data.guestId = this.formPlan.guestName   //调出方
              data.orderManId = this.formPlan.storeId     //退货员id
              data.orderMan = this.formPlan.orderMan //退货员
              data.orderDate = tools.transTime(this.formPlan.orderDate)  //退货日期
              data.serviceId = this.formPlan.numbers  //采退单号
              data.rtnReasonId = this.formPlan.cause  //退货原因
              data.settleTypeId = this.formPlan.clearing  //结算方式
              data.remark = this.formPlan.remark  //备注
              data.storeId = this.formPlan.warehouse  //退货仓库
              // data.code = this.formPlan.serviceId //采购订单
              data.details = this.Right.tbdata
              // console.log(data.code)
              saveDraft(data).then(res => {
                if(res.code === 0){
                  this.$message.success('保存成功！')
                  this.$refs.formPlan.resetFields();
                  this.leftgetList()
                  this.isAdd = true;
                  this.rowId = '';
                  this.formPlan.guestName = ''   //调出方
                  this.formPlan.storeId = ''   //退货员
                  // tools.transTime(this.formPlan.orderDate)  //退货日期
                  this.formPlan.numbers = '' //采退单号
                  this.formPlan.cause  = '' //退货原因
                  this.formPlan.clearing = '' //结算方式
                  this.formPlan.remark  = '' //备注
                  this.formPlan.warehouse = ''  //退货仓库
                  this.formPlan.serviceId = '' //采购订单
                  this.Right.tbdata  =  [] //子表格
                  this.$refs.formPlan.resetFields();
                }
              })
            } catch (errMap) {
              this.$XModal.message({
                status: "error",
                message: "申请数量必须输入大于0的正整数！"
              });
            }
          } else {
            // console.log(this.isAdd)
            this.$Message.error('*为必填！');
          }
        })
      },
      //作废
      cancellation(){
        this.$Modal.confirm({
          title: '是否作废',
          onOk: async () => {
            let params = {}
            params.id = this.rowId
            let res = await saveObsolete({params:params});
            if (res.code == 0) {
              this.$Message.success('作废成功');
              this.leftgetList();
              this.isAdd = true;
            }
          },
          onCancel: () => {
            this.$Message.info('取消作废');
          },
        })
      },
      // 打印
      stamp(){
        const ref =  this.$refs.PrintModel;
        ref.openModal();
      },
      //右侧表格复选框选中
      selectChange(msg){
        // console.log(msg.selection)
        this.checkboxArr = msg.selection
        // console.log(this.checkboxArr)
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
        // console.log(v)
        this.selectArr = v
        this.leftgetList()
      },
      //footer计算
      addFooter ({ columns, data }) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return '和值'
            }
            // if (columnIndex === 9) {
            //   return this.$utils.sum(data, column.property,columnIndex).toFixed(2)
            // }
            if(['canReQty','orderQty'].includes(column.property)){
              return this.$utils.sum(data, column.property,columnIndex)
            }
            if (columnIndex === 9) {
              return ` ${this.countAllAmount(data)} `;
            }
            return null
          })
        ]
      },
      //表格编辑状态下被关闭的事件
      editClosedEvent(){},
      //获取销售员
      async getAllSales() {
        let res = await getSales();
        if (res.code === 0) {
          this.userMap = res.data.content;
          this.userMap.map(item => {
            item.label = item.userName
          })
        }
      },
      // 更多子组件的参数
      getMsg(msg){
        this.moreArr = msg
        // console.log(this.moreArr)
        this.LeftgetlistTwo()
        // console.log(msg)
      },
      //供应商弹框
      addSuppler(){
        this.$refs.selectSupplier.init()
      },
      // 供应商子组件内容
      getSupplierName(a){
        // console.log(a)
        this.formPlan.guestName = a.id
        this.guestidId = a.id
      },
      leftgetList(){
        let data = {}
        let params = {}
        params.page = this.Left.page.num - 1
        params.size = this.Left.page.size
        //快速选择
        if(this.selectArr !== '9999'){
          data.startTime = this.selectArr[0]
          data.endTime = this.selectArr[1]
        }
        // //创建日期
        // if(this.moreArr.createData != null){
        //   data.startTime = this.moreArr.createData[0] + " 00:00:00"
        //   data.endTime = this.moreArr.createData[1] + " 23:59:59"
        // }
        //状态
        if(this.purchaseType !== '99'){
          data.billStatusId = this.purchaseType
        }
        //提交日期
        // if(this.moreArr.submitData != null){
        //   data.auditStartTime = this.moreArr.submitData[0] + " 00:00:00"
        //   data.auditEndTime  = this.moreArr.submitData[1] + " 23:59:59"
        // }
        // 供应商
        // if(this.moreArr.callout != null){
        //   data.guestId = this.moreArr.guestId
        // }
        // //采退单号
        // if(this.moreArr.numbers !=null ){
        //   data.serviceId = this.moreArr.numbers
        // }
        // //配件编码
        // if(this.moreArr.coding != null){
        //   data.partCode = this.moreArr.coding
        // }
        // //配件名称
        // if(this.moreArr.Name != null ){
        //   data.partName = this.moreArr.Name
        // }
        // //采购订单
        // if(this.moreArr.purchase != null ){
        //   data.code = this.moreArr.purchase
        // }
        // //退货员
        // if(this.moreArr.Return != null ){
        //   data.orderMan = this.moreArr.Return
        // }
        // //创建人
        // if(this.moreArr.Accessories != null ){
        //   data.createUname = this.moreArr.Accessories
        // }
        // //提交人
        // if(this.moreArr.submitter != null){
        //   data.auditor = this.moreArr.submitter
        // }

        findPageByDynamicQuery({params:params,data:data}).then(res => {
          if(res.code === 0){
            this.Left.tbdata = res.data.content || []
            this.Left.page.total = res.data.totalElements
          }
        })
      },
      // 更多查询单独接口
      LeftgetlistTwo(){
        let data = {}
        let params = {}
        params.page = this.Left.page.num - 1
        params.size = this.Left.page.size
        //创建日期
        if(this.moreArr.createData != null){
          data.startTime = this.moreArr.createData[0] + " 00:00:00"
          data.endTime = this.moreArr.createData[1] + " 23:59:59"
        }
        //提交日期
        if(this.moreArr.submitData != null){
          data.auditStartTime = this.moreArr.submitData[0] + " 00:00:00"
          data.auditEndTime  = this.moreArr.submitData[1] + " 23:59:59"
        }
        //供应商
        if(this.moreArr.callout != null){
          data.guestId = this.moreArr.guestId
        }
        //采退单号
        if(this.moreArr.numbers !=null ){
          data.serviceId = this.moreArr.numbers
        }
        //配件编码
        if(this.moreArr.coding != null){
          data.partCode = this.moreArr.coding
        }
        //配件名称
        if(this.moreArr.Name != null ){
          data.partName = this.moreArr.Name
        }
        //采购订单
        if(this.moreArr.purchase != null ){
          data.code = this.moreArr.purchase
        }
        //退货员
        if(this.moreArr.Return != null ){
          data.orderMan = this.moreArr.Return
        }
        //创建人
        if(this.moreArr.Accessories != null ){
          data.createUname = this.moreArr.Accessories
        }
        //提交人
        if(this.moreArr.submitter != null){
          data.auditor = this.moreArr.submitter
        }
        //是否显示单据
        if (this.moreArr.Ischeck){
          data.showSelf = this.moreArr.Ischeck
        }
        queryByConditions({params:params,data:data}).then(res => {
          if(res.code === 0){
            this.Left.tbdata = res.data.content || []
            this.Left.page.total = res.data.totalElements
          }
        })
      },
      // 左边部分的当前行
      selection(row){
        if (row == null) return;
        let currentRowTable = this.$refs["currentRowTable"];
        if(!this.Flaga && !this.isAdd && row.id){
          this.$Modal.confirm({
            title: '您正在编辑单据，是否需要保存',
            onOk: () => {
              currentRowTable.clearCurrentRow();
              this.$refs.formPlan.validate((valid) => {
                if (valid) {
                  let data = {}
                  data.id = this.rowId
                  // data.guestId = this.guestidId   //调出方
                  data.guestId = this.formPlan.guestName   //调出方
                  data.orderManId = this.formPlan.storeId     //退货员id
                  data.orderMan = this.formPlan.orderMan //退货员
                  data.orderDate = tools.transTime(this.formPlan.orderDate)  //退货日期
                  data.serviceId = this.formPlan.numbers  //采退单号
                  data.rtnReasonId = this.formPlan.cause  //退货原因
                  data.settleTypeId = this.formPlan.clearing  //结算方式
                  data.remark = this.formPlan.remark  //备注
                  data.storeId = this.formPlan.warehouse  //退货仓库
                  data.code = this.formPlan.serviceId //采购订单
                  data.details = this.Right.tbdata
                  // data.details = this.Right.tbdata.map(item => {
                  //   return {
                  //     partId : item.partId,
                  //     partCode : item.partCode,
                  //     partName : item.partName,
                  //     partBrand : item.partBrand,
                  //     outUnitId : item.outUnitId,
                  //     canReQty : item.canReQty,
                  //     orderQty : item.orderQty,
                  //     orderPrice : item.orderPrice,
                  //     orderAmt : item.orderAmt,
                  //     remark : item.remark,
                  //     stockOutQty : item.stockOutQty,
                  //     oemCode : item.oemCode,
                  //     spec : item.spec
                  //   }
                  // }) //子表格
                  saveDraft(data).then(res => {
                    if(res.code === 0){
                      this.$message.success('保存成功！')
                      this.$refs.formPlan.resetFields();
                      this.leftgetList()
                      this.isAdd = true;
                      this.rowId = '';
                      this.formPlan.guestName = ''   //调出方
                      this.formPlan.storeId = ''   //退货员
                      // tools.transTime(this.formPlan.orderDate)  //退货日期
                      this.formPlan.numbers = '' //采退单号
                      this.formPlan.cause  = '' //退货原因
                      this.formPlan.clearing = '' //结算方式
                      this.formPlan.remark  = '' //备注
                      this.formPlan.warehouse = ''  //退货仓库
                      this.formPlan.serviceId = '' //采购订单
                      this.Right.tbdata  =  [] //子表格
                      this.$refs.formPlan.resetFields();
                    }
                  })
                } else {
                  this.$Message.error('*为必填！');
                }
              })
            },
            onCancel: () => {
              this.Left.tbdata.splice(0, 1);
              currentRowTable.clearCurrentRow();
              this.isAdd = true;
              this.rowId = '';
              this.formPlan.guestName = ''   //调出方
              this.formPlan.storeId = ''   //退货员
              // tools.transTime(this.formPlan.orderDate)  //退货日期
              this.formPlan.numbers = '' //采退单号
              this.formPlan.cause  = '' //退货原因
              this.formPlan.clearing = '' //结算方式
              this.formPlan.remark  = '' //备注
              this.formPlan.warehouse = ''  //退货仓库
              this.formPlan.serviceId = '' //采购订单
              this.Right.tbdata  =  [] //子表格
            },
          })
        }else{
          if(row.id){
            // this.leftgetList();
            this.mainId = row.id
            this.guestidId = row.guestId
            this.datadata = row
              this.formPlan.guestName = this.datadata.guestId
              this.formPlan.storeId = this.datadata.orderManId
              this.formPlan.orderDate = this.datadata.orderDate
              this.formPlan.numbers = this.datadata.serviceId
              this.formPlan.cause = this.datadata.rtnReasonId
              this.formPlan.clearing = this.datadata.settleTypeId
              this.formPlan.remark = this.datadata.remark
              this.formPlan.warehouse = this.datadata.storeId
              this.formPlan.serviceId = this.datadata.code
              row.details.map(item => {
                item.orderPrice = Number(item.orderPrice).toFixed(2)
              })
              this.Right.tbdata = this.datadata.details
              this.presentrowMsg = row.billStatusId.value
              // console.log(this.presentrowMsg)
              this.rowId = row.id
              this.buttonDisable = false
          }else {
            this.formPlan.guestName = ''
            this.formPlan.storeId = ''
            this.formPlan.orderDate = ''
            this.formPlan.numbers = ''
            this.formPlan.cause = ''
            this.formPlan.clearing = ''
            this.formPlan.remark = ''
            this.formPlan.warehouse = ''
            this.formPlan.serviceId = ''
            this.Right.tbdata = []
            this.$refs.formPlan.resetFields();
          }
        }
      },

      // 仓库下拉框
      warehouse(){},
      Determined(){},
      // 提交按钮
      instance () {
        if(this.Right.tbdata.length > 0){
          this.$Modal.confirm({
            title: '是否提交',
            onOk: async () => {
              let data = {}
              data.code = this.Acode || this.formPlan.serviceId
              data.codeId = this.AcodeId
              data.id = this.rowId
              data.guestId = this.formPlan.guestName   //调出方
              data.orderManId = this.formPlan.storeId     //退货员id
              data.orderMan = this.formPlan.orderMan //退货员
              data.orderDate = tools.transTime(this.formPlan.orderDate)  //退货日期
              data.serviceId = this.formPlan.numbers  //采退单号
              data.rtnReasonId = this.formPlan.cause  //退货原因
              data.settleTypeId = this.formPlan.clearing  //结算方式
              data.remark = this.formPlan.remark  //备注
              data.storeId = this.formPlan.warehouse  //退货仓库
              // data.code = this.formPlan.serviceId //采购订单
              data.details = this.Right.tbdata
              let res = await saveCommit(data);
              if (res.code == 0) {
                this.$Message.success('提交成功');
                this.leftgetList();
                this.isAdd = true;
              }
            },
            onCancel: () => {
              this.$Message.info('取消提交');
            },
          })
        }else {
          this.$Message.warning('请添加配件后再提交!')
        }

      },
      // 退货
      salesReturn(){
        this.$Modal.confirm({
          title: '是否退货',
          onOk: async () => {
            let data = {}
            data.id = this.rowId
            data.guestId = this.guestidId   //调出方
            data.orderMan = this.formPlan.storeId     //退货员
            data.orderDate = tools.transTime(this.formPlan.orderDate)  //退货日期
            data.serviceId = this.formPlan.numbers  //采退单号
            data.rtnReasonId = this.formPlan.cause  //退货原因
            data.settleTypeId = this.formPlan.clearing  //结算方式
            data.remark = this.formPlan.remark  //备注
            data.storeId = this.formPlan.warehouse  //退货仓库
            data.code = this.formPlan.serviceId //采购订单
            data.details = this.Right.tbdata.map(item => {
              return {
                partId: item.partId,
                partCode: item.partCode,
                partName: item.partName,
                partBrand: item.partBrand,
                outUnitId: item.outUnitId,
                canReQty: item.canReQty,
                orderQty: item.orderQty,
                orderPrice: item.orderPrice,
                orderAmt: item.orderAmt,
                remark: item.remark,
                stockOutQty: item.stockOutQty,
                oemCode: item.oemCode,
                spec: item.spec
              }
            }) //子表格
            let res = await returnPchs(data);
            if (res.code == 0) {
              this.$Message.success('退货成功');
              this.leftgetList();
              this.isAdd = true;
            }
          },
          onCancel: () => {
            this.$Message.info('取消退货');
          }
        })
      },
      //所有下拉框
      allSelect(){
        let data = {}
        optGroup(data).then(res => {
          if (res.code === 0) {
            const {billStatusMap, companyMap, guestMap, invoiceMap, levelMap, rtnReasonMap, sellOrderStatusMap, settlementMap, storeMap, userMap} = res.data;
            // 结算方式
            for (let el in settlementMap) {
              this.settleMethods.push({value: settlementMap[el], label: el})
            }
            // 退货仓
            for (let el in storeMap) {
              this.inStores.push({value: storeMap[el], label: el})
            }
            // 状态
            for (let el in sellOrderStatusMap) {
              this.statusArr.push({value: sellOrderStatusMap[el], label: el})
            }
            //退货原因
            for (let el in rtnReasonMap) {
              this.purchaseTypeArr.push({value: rtnReasonMap[el], label: el})
            }
            // userMap 用户
            for (let el in userMap) {
              this.userMap.push({value: userMap[el], label: el})
            }
          }
        })
      }
    },
    mounted(){
      this.$nextTick(()=>{
        let wrapH = this.$refs.paneLeft.offsetHeight;
        let planFormH = this.$refs.planForm.offsetHeight;
        let planBtnH = this.$refs.planBtn.offsetHeight;
        // let planPageH = this.$refs.planPage.offsetHeight;
        //获取左侧侧表格高度
        this.leftTableHeight = wrapH-70;
        //获取右侧表格高度
        this.rightTableHeight = wrapH-planFormH-planBtnH-65;
      });
      this.allSelect();
      this.leftgetList();
      this.selecQuery();
      this.getAllSales();
    }
  }
</script>

<style scoped>
  .con-box{
    height: 700px;
  }
  .w550{
    width: 580px;
  }
</style>
