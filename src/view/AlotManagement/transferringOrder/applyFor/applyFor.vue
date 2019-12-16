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
                  <Option v-for="item in purchaseTypeArr" :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
              </div>
              <div class="db">
                <Button type="default" @click="moreaa" class="mr10"><i class="iconfont mr5 iconchaxunicon"></i>更多</Button>
              </div>
              <div class="db">
                <Button class="mr10" @click="addProoo"><Icon type="md-add"/> 新增</Button>
              </div>
              <div class="db">
                <Button type="default" @click='SaveMsg' class="mr10" :disabled="buttonDisable || presentrowMsg !== 0"><i class="iconfont mr5 iconbaocunicon"></i>保存</Button>
              </div>
              <div class="db">
                <Button class="mr10" @click="instance('formPlan')" :disabled="buttonDisable || presentrowMsg !== 0"><i class="iconfont mr5 iconziyuan2"></i>提交</Button>
              </div>
              <div class="db">
                <Button @click="cancellation" class="mr10" :disabled="buttonDisable || presentrowMsg !== 0"><Icon type="md-close" size="14" /> 作废</Button>
              </div>
              <div class="db">
                <Button @click="stamp" class="mr10"><i class="iconfont mr5 icondayinicon"></i> 打印</Button>
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
                    调拨申请列表
                  </div>
                  <Table :height="leftTableHeight"  @on-current-change="selectTabelData" size="small" highlight-row  border :stripe="true" :columns="Left.columns" :data="Left.tbdata" @on-row-click="selection"></Table>
                  <Page simple class-name="fl pt10" size="small" :current="Left.page.num" :total="100" :page-size="Left.page.size" @on-change="changePageLeft"
                        @on-page-size-change="changeSizeLeft" show-sizer show-total>
                  </Page>
                </div>
                <div slot="right" class="con-split-pane-right pl5 goods-list-form">
                  <div class="pane-made-hd">
                    调拨申请信息
                  </div>
                  <div class="clearfix purchase" ref="planForm">
                    <Form inline
                          :model="formPlan"
                          :show-message="false"
                          ref="formPlan"
                          :rules="ruleValidate"
                          :label-width="100">
                      <FormItem label="调出方：" prop="guestName" class="fs12">
                        <Row class="w500">
                          <Col span="22"><Input placeholder="请选择调出方" v-model="formPlan.guestName" disabled=""></Input></Col>
                          <Col span="2"><Button class="ml5" size="small" type="default" @click="addSuppler" :disabled="buttonDisable || presentrowMsg !== 0"><i class="iconfont iconxuanzetichengchengyuanicon"></i></Button></Col>
                        </Row>
                      </FormItem>
                      <FormItem label="调入仓库：" prop="storeId" >
                        <Select class="w160" :disabled="presentrowMsg !== 0 || buttonDisable" v-model="formPlan.storeId">
                          <Option v-for="item in List" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                      </FormItem>
                      <FormItem label="调拨申请日期：" prop="orderDate" class="fs12 ml50">
                        <DatePicker
                          style="width: 160px"
                          type="date"
                          placeholder="请选择调拨申请日期"
                          v-model="formPlan.orderDate"
                          :disabled="presentrowMsg !== 0 || buttonDisable"
                          prop="orderDate"
                        ></DatePicker>
                      </FormItem>
                      <FormItem label="备注：" prop="remark">
                        <Input class="w500" :disabled="presentrowMsg !== 0 || buttonDisable" v-model="formPlan.remark"></Input>
                      </FormItem>
                      <FormItem label="创建人：" prop="planner">
                        <Input class="w160" :disabled="buttonDisableTwo" v-model="formPlan.createUname"></Input>
                      </FormItem>
                      <FormItem label="申请单号:" prop="planOrderNum" class="ml50">
                        <Input class="w160" :disabled="buttonDisableTwo" v-model="formPlan.serviceId"></Input>
                      </FormItem>
                    </Form>
                  </div>
                  <div class="flex plan-cz-btn" ref="planBtn">
                    <div class="clearfix">
                      <div class="fl mb5">
                        <Button size="small" class="mr10" @click="addPro" :disabled="buttonDisable || presentrowMsg !== 0"><Icon type="md-add"/> 添加配件</Button>
                      </div>
                      <div class="fl mb5">
                        <Button size="small" class="mr10" :disabled="buttonDisable || presentrowMsg !== 0" @click="Delete"><i class="iconfont mr5 iconlajitongicon"></i> 删除配件</Button>
                      </div>
                      <div class="fl mb5">
                        <Button size="small" class="mr10" @click="GoodsInfoModal" :disabled="buttonDisable || presentrowMsg !== 0"><i class="iconfont mr5 iconbianjixiugaiicon"></i> 编辑收货信息</Button>
                      </div>
                    </div>
                  </div>
                  <vxe-table
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
                    :edit-config="{trigger: 'click', mode: 'cell'}">
                    <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                    <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                    <vxe-table-column field="partCode" title="配件编码" width="100"></vxe-table-column>
                    <vxe-table-column field="partName" title="配件名称" width="100"></vxe-table-column>
                    <vxe-table-column field="partBrand" title="品牌" width="100"></vxe-table-column>
                    <vxe-table-column field="applyQty" title="申请数量" :edit-render="{name: 'input'}" width="100">
                      <template v-slot:edit="{ row }">
                        <InputNumber
                          :max="999999"
                          :min="0"
                          v-model="row.applyQty"
                          :disabled="presentrowMsg !== 0"
                        ></InputNumber>
                      </template>
                    </vxe-table-column>
                    <vxe-table-column field="remark" title="备注" :edit-render="{name: 'input',attrs: {disabled: presentrowMsg !== 0}}" width="100"></vxe-table-column>
                    <vxe-table-column field=`carBrandName + carModelName` title="品牌车型" width="100"></vxe-table-column>
                    <vxe-table-column field="unit" title="单位" width="100"></vxe-table-column>
                    <vxe-table-column field="oemCode" title="OE码" width="100"></vxe-table-column>
                    <vxe-table-column field="spec" title="规格" width="100"></vxe-table-column>
                    <vxe-table-column field="enterUnitId" title="方向" width="100"></vxe-table-column>
                    <vxe-table-column title="紧销品" width="100" type="checkbox">
                      <template v-slot="{ row,rowIndex }">
                        <Checkbox disabled :value="row.isTight == 1"></Checkbox>
                      </template>
                    </vxe-table-column>
                    <vxe-table-column field="hasAcceptQty" title="受理数量" width="100"></vxe-table-column>
                    <vxe-table-column field="hasCancelQty" title="取消数量" width="100"></vxe-table-column>
                    <vxe-table-column field="hasOutQty" title="出库数量" width="100"></vxe-table-column>
                    <vxe-table-column field="hasInQty" title="入库数量" width="100"></vxe-table-column>
                  </vxe-table>
                  <div ref="planPage">
                  <Page size="small" class-name="page-con" :current="Right.page.num" :total="Right.page.total" :page-size="Right.page.size" @on-change="changePage"
                  @on-page-size-change="changeSize" show-sizer show-total></Page>
                  </div>
                </div>
              </Split>
            </div>
          </div>
        </section>
        <!--更多弹框-->
              <More @sendMsg="getMsg" ref="moremore"></More>
        <!--选择配件-->
        <supplier ref="SelectPartCom" @selectPartName="getPartNameList"></supplier>
        <!--编辑收货信息-->
          <goods-info ref="goodsInfo" :mainId="mainId"></goods-info>
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
  // import SelectPartCom from "../../../goods/goodsList/components/selectPartCom";
  import GoodsInfo from '../../../../view/goods/plannedPurchaseOrder/components/GoodsInfo'
  import SelectSupplier from "./compontents/supplier/selectSupplier";
  import '../../../lease/product/lease.less';
  import "../../../goods/goodsList/goodsList.less";
  import supplier from './compontents/supplier'
  import PrintShow from "./compontents/PrintShow";
  import { queryAll,findById,queryByOrgid,save,commit} from '../../../../api/AlotManagement/transferringOrder';
    export default {
      name: "applyFor",
      components: {
        QuickDate,
        More,
        supplier,
        // SelectPartCom,
        GoodsInfo,
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
        return {
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
               orderDate: '',
               printing: '',
               createTime: tools.transTime(new Date()),
            detailVOS: [],
          },
          //表单验证
          ruleValidate: {
            guestName: [{ required: true, type:'string',message: '调出方不能为空', trigger: 'blur' }],
            storeId: [{ required: true,type:'string', message: '调入仓库不能为空', trigger: 'blur' }],
            orderDate: [{ required: true, type: 'date', message: '请选择', trigger: 'change' }]
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
            { label:'待分拣',value:'SORTING' },
            { label:'待发货',value:'SHIPPED' },
            { label:'已出库',value:'STOCKING' },
            { label:'已入库',value:'WAREHOUSING' },
            { label:'已拒绝',value:'REJECTED' },
            { label:'已作废',value:'INVALID' },
          ],
          //校验输入框的值
          validRules: {
            applyQty: [
              { required: true,validator:changeNumber },
            ],
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
                title: '创建人',
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
                key: 'orderMan',
                minWidth: 100
              },
              {
                title: '提交日期',
                align:'center',
                key: 'orderDate',
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
          guestidId: '' ,//给后台传值保存调出方的id
           isAdd:true, //判断是否能新增
          formPlan: {
            guestName:'',//调出方
            storeId: '', //调入仓库
            orderDate: tools.transTime(new Date()), //申请调拨日期
            remark: '', //备注
            createUname: '', //创建人
            serviceId: '', //申请单号
          },
          mainId: null, //选中行的id
          clickdelivery: false
        }
      },
      methods: {
        //删除配件
        Delete(){
          // var arr1=[{id:1},{id:2},{id:3},{id:4},{id:5}]
          // var arr2=[{id:1},{id:2},{id:3}]
          var set = this.checkboxArr.map(item=>item.id)
          // console.log(set)
          var resArr = this.Right.tbdata.filter(item => !set.includes(item.id))
          console.log(resArr)
          this.Right.tbdata = resArr
        },
        //更多按钮
        moreaa(){
          this.$refs.moremore.init()
        },
        // 新增按钮
        addProoo(){
          this.buttonDisable = false
          this.presentrowMsg = 0
          if (!this.isAdd) {
            return this.$Message.error('请先保存数据');
          }
          this.Left.tbdata.unshift(this.PTrow)
          this.isAdd = false;
          this.datadata = this.PTrow
          // console.log(this.Left.tbdata)
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
          console.log(this.$refs['formPlan'].validate())
          this.$refs['formPlan'].validate((valid) => {
            if (valid) {
              let data = {}
              data.id = this.rowId
              data.guestId = this.formPlan.guestidId
              data.storeId = this.formPlan.storeId
              data.guestName = this.formPlan.guestName
              data.orderDate = tools.transTime(this.formPlan.orderDate)
              data.remark = this.formPlan.remark
              data.createUname  = this.formPlan.createUname
              data.serviceId = this.formPlan.serviceId
              data.detailVOS = this.Right.tbdata
              // console.log(data)
              save(data).then(res => {
                if(res.code === 0){
                  this.$message.success('保存成功！')
                  this.leftgetList()
                  this.formPlan.guestName = '',
                    this.formPlan.storeId =  '',
                    this.formPlan.remark =  '',
                    this.formPlan.createUname =  '',
                    this.formPlan.serviceId =  '',
                    this.Right.tbdata = []
                }
              })
            } else {
              this.$Message.error('*为必填！');
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
                data.guestId = this.guestidId
                data.storeId = this.formPlan.storeId
                data.orderDate = tools.transTime(this.formPlan.orderDate)
                data.remark = this.formPlan.remark
                data.createUname  = this.formPlan.createUname
                data.serviceId = this.formPlan.serviceId
                data.detailVOS = this.Right.tbdata
                let res = await save(data);
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
          this.checkboxArr = msg.selection
          console.log(this.checkboxArr)
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
          console.log(v)
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
          // console.log(msg)
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
              applyQty : '',
              remark : '',
              partInnerId : item.code,
              partCode : item.partCode,
              oemCode : item.oeCode,
              partBrand : item.partBrand,
              carBrandName : item.adapterCarBrand,
              carModelName : item.adapterCarModel,
              carTypef : item.baseType.firstType.typeName,
              cartypes : item.baseType.secondType.typeName,
              carTypet : item.baseType.thirdType.typeName,
              spec : item.specifications,
              partId : item.id,
              fullName : item.fullName,
              systemUnitId : item.minUnit,
            }
          })
          console.log(ChildMessage)
          this.Right.tbdata = [...this.Right.tbdata,...parts]
          console.log(this.Right.tbdata)
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
          console.log(a)
          this.formPlan.guestName = a.shortName
          this.formPlan.guestidId = a.id
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
            params.startDate = this.moreArr.submitData[0] + " 00:00:00"
            params.endDate = this.moreArr.submitData[1] + " 23:59:59"
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
          queryAll(params).then(res => {
            if(res.code === 0){
              this.Left.tbdata = res.data.content
            }
          })
        },
        // 左边部分的当前行
        selection(row){
          // console.log(row)
          console.log(row.id)
          this.mainId = row.id
          this.guestidId = row.guestId
            this.datadata = row
          console.log(this.datadata)
            this.formPlan.guestName = this.datadata.guestName
            this.formPlan.storeId = this.datadata.storeId
            this.formPlan.orderDate = this.datadata.orderDate
            this.formPlan.remark = this.datadata.remark
            this.formPlan.createUname = this.datadata.createUname
            this.formPlan.serviceId = this.datadata.serviceId
            // this.guestidId = this
          this.presentrowMsg = row.status.value
          console.log(this.presentrowMsg)
          this.rowId = row.id
          if(row.id){
            this.buttonDisable = false
          }
          this.getRightlist()
        },
        //右部分接口
        getRightlist(){
          let params = {}
          params.id = this.rowId
          findById(params).then(res => {
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
              }
          })
        },
        Determined(){

        },
        // 提交按钮
        instance (name) {
          this.$refs[name].validate((valid) => {
            if (valid) {
              this.$Modal.confirm({
                title: '是否提交',
                onOk: async () => {
                  if(this.clickdelivery){
                    let data = {}
                    data.id = this.rowId
                    data.guestId = this.guestidId
                    data.storeId = this.formPlan.storeId
                    data.orderDate = tools.transTime(this.formPlan.orderDate)
                    data.remark = this.formPlan.remark
                    data.createUname  = this.formPlan.createUname
                    data.serviceId = this.formPlan.serviceId
                    data.detailVOS = this.Right.tbdata
                    let res = await commit(data);
                    if (res.code == 0) {
                      this.$Message.success('提交成功');
                      this.leftgetList();
                      this.isAdd = true;
                    }
                  }else{
                    this.$Message.warning('请先编辑收货信息')
                  }
                },
                onCancel: () => {
                  this.$Message.info('取消提交');
                },
              })
            } else {
              this.$Message.error('*为必填项！');
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
          this.leftgetList();
          this.warehouse()
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
