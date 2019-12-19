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
              <Button class="mr10" @click="instance" :disabled="buttonDisable || presentrowMsg !== 0"><i class="iconfont mr5 iconziyuan2"></i>提交</Button>
            </div>
            <div class="db">
              <Button @click="cancellation" class="mr10" :disabled="buttonDisable || presentrowMsg !== 0"><Icon type="md-close" size="14" /> 作废</Button>
            </div>
            <div class="db">
              <Button @click="derive" class="mr10"><i class="iconfont mr5 icondayinicon"></i> 导出</Button>
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
                  预订单列表
                </div>
                <Table :height="leftTableHeight"  @on-current-change="selectTabelData" size="small" highlight-row  border :stripe="true" :columns="Left.columns" :data="Left.tbdata" @on-row-click="selection"></Table>
                <Page
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
                  <Form inline
                        :model="formPlan"
                        :show-message="false"
                        ref="formPlan"
                        :rules="ruleValidate"
                        :label-width="100">
                    <FormItem label="业务员：" prop="salesman">
                      <Input class="w160" :disabled="true" v-model="formPlan.salesman"></Input>
                    </FormItem>
                    <FormItem label="预订单号:" prop="Reservation" class="ml50">
                      <Input class="w160" :disabled="true" v-model="formPlan.Reservation"></Input>
                    </FormItem>
                    <FormItem label="期望到货日期：" prop="orderDate" class="fs12 ml50">
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
                      <Input class="w490" :disabled="presentrowMsg !== 0 || buttonDisable" v-model="formPlan.remark"></Input>
                    </FormItem>
                  </Form>
                </div>
                <div class="flex plan-cz-btn" ref="planBtn">
                  <div class="clearfix">
                    <div class="fl mb5">
                      <Button size="small" class="mr10" @click="addPro" :disabled="presentrowMsg !== 0 || buttonDisable"><Icon type="md-add"/> 添加配件</Button>
                    </div>
                    <div class="fl mb5">
                      <Button size="small" class="mr10" :disabled="presentrowMsg !== 0 || buttonDisable" @click="Delete"><i class="iconfont mr5 iconlajitongicon"></i> 删除配件</Button>
                    </div>
                    <!--<div class="fl mb5">-->
                      <!--<Button size="small" class="mr10" @click="GoodsInfoModal" :disabled="presentrowMsg !== 0"><i class="iconfont mr5 iconbianjixiugaiicon"></i> 编辑收货信息</Button>-->
                    <!--</div>-->
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
                        :before-upload ='beforeUpload'
                      >
                    <Button size="small" class="mr10" @click="getRUl" :disabled="presentrowMsg !== 0 || buttonDisable"><i class="iconfont mr5 iconbianjixiugaiicon"></i>导入配件</Button>
                   </Upload>
                    </div>
                  </div>
                </div>
                <vxe-table
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
                  :edit-config="{trigger: 'click', mode: 'cell'}">
                  <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                  <vxe-table-column width="60" type="checkbox"></vxe-table-column>
                  <vxe-table-column field="partCode" title="配件编码" width="100"></vxe-table-column>
                  <vxe-table-column field="partName" title="配件名称" width="150"></vxe-table-column>
                  <vxe-table-column field="partBrand" title="品牌" width="100"></vxe-table-column>
                  <vxe-table-column field="unit" title="单位" width="100"></vxe-table-column>
                  <vxe-table-column field="preQty" title="预定数量" :edit-render="{name: 'input'}" width="100">
                    <template v-slot:edit="{ row }">
                      <InputNumber
                        :max="999999"
                        :min="0"
                        v-model="row.preQty"
                        :disabled="presentrowMsg !== 0"
                      ></InputNumber>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="remark" title="备注" :edit-render="{name: 'input',attrs: {disabled: presentrowMsg !== 0}}" width="100"></vxe-table-column>
                  <vxe-table-column field="acceptQty" title="受理数量" width="100"></vxe-table-column>
                  <vxe-table-column field="oemCode" title="OE码" width="100"></vxe-table-column>
                  <vxe-table-column field="spec" title="规格" width="100"></vxe-table-column>
                  <vxe-table-column field="direction" title="方向" width="100"></vxe-table-column>
                  <vxe-table-column field="partInnerId" title="配件内码" width="150"></vxe-table-column>
                </vxe-table>
                <div ref="planPage">
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
      <!--<Modal v-model="GainInformation" title="编辑收获信息" width="1200px">-->
      <goods-info ref="goodsInfo" :mainId="mainId"></goods-info>
      <!--<div slot='footer'>-->
      <!--<Button type='primary' @click="Determined">确定</Button>-->
      <!--<Button type='default' >取消</Button>-->
      <!--</div>-->
      <!--</Modal>-->
    </div>
    <!--供应商资料-->
    <select-supplier ref="selectSupplier" header-tit="供应商资料" @selectSupplierName="getSupplierName"></select-supplier>
  </div>
</template>

<script>
  import * as tools from "../../../../utils/tools";

  import QuickDate from '../../../../components/getDate/dateget'
  import More from './compontents/More'
  // import SelectPartCom from "../../../goods/goodsList/components/selectPartCom";
  import GoodsInfo from '../../../../view/goods/plannedPurchaseOrder/components/GoodsInfo'
  import SelectSupplier from "../../../goods/goodsList/components/supplier/selectSupplier";
  import '../../../lease/product/lease.less';
  import "../../../goods/goodsList/goodsList.less";
  import supplier from './compontents/supplier'
  import PrintShow from "./compontents/PrintShow";
  import Cookies from 'js-cookie'
  import { optGroup ,deleteit, save, commitOrder, invalid, getup} from '../../../../api/business/advanceOrder';
  import { TOKEN_KEY } from '@/libs/util'
  import baseUrl from '_conf/url'
export default {
    name: 'bookingSheet',
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
        salesman: [{ required: true ,message: '调出方不能为空', trigger: 'blur' }]
      },
      datadata: null,
      rowId:'', //当前行的id
      buttonDisable: true,
      buttonDisableTwo: true,
      split1:0.2,
      purchaseType: '99',
      purchaseTypeArr:[
        { label:'所有',value:'99' },
        { label:'草稿',value:'0' },
        { label:'待受理',value:'1' },
        { label:'已受理',value:'3' },
        { label:'已作废',value:'5' },
      ],
      //校验输入框的值
      validRules: {
        applyQty: [
          { required: true,validator:changeNumber },
        ]
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
              let name = params.row.status.name
              return h('span',name)
            }
          },
          {
            title: '公司',
            key: 'company',
            minWidth: 80
          },
          {
            title: '创建日期',
            key: 'createTime',
            minWidth: 120
          },
          {
            title: '业务员',
            key: 'salesman',
            minWidth: 100
          },
          {
            title: '预定单号',
            key: 'orderNo',
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
            key: 'commitTime',
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
        salesman: '', //业务员
        Reservation: '', //预订单号
        orderDate: tools.transTime(new Date()), //期望到货日期
        remark: '', //备注
      },
      headers: {
        Authorization:'Bearer ' + Cookies.get(TOKEN_KEY)
      },//请求头
      upurl: getup,//导入地址
      mainId: null, //选中行的id
      clickdelivery: false
    }
  },
  methods: {
      //改变日期
    changedate(a){
      this.formPlan.orderDate = a
    },
    //删除配件
    Delete(){
      // var set = this.checkboxArr.map(item=>item.id)
      // var resArr = this.Right.tbdata.filter(item => !set.includes(item.id))
      // this.Right.tbdata = resArr
      let data = this.checkboxArr.map(item => {
        return {
          id: item.id
        }
      })
      deleteit(data).then(res => {
        if(res.code === 0){
          this.$message.warning('删除成功！')
          this.leftgetList()
          this.formPlan.salesman = ''
          this.formPlan.Reservation = ''
          this.formPlan.remark = ''
          this.Right.tbdata = []
        }
      })
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
      this.formPlan.salesman = this.$store.state.user.userData.staffName
      // console.log(this.$store.state.user.userData.staffName)
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
      this.$refs.formPlan.validate((valid) => {
        if (valid) {
          let data = {}
          data.id = this.rowId
          data.salesman =  this.formPlan.salesman
          data.orderNo =  this.formPlan.Reservation
          data.expectedArrivalDate = tools.transDate(this.formPlan.orderDate)
          console.log(tools.transDate(this.formPlan.orderDate))
          data.remark = this.formPlan.remark
          data.detailVOList = this.Right.tbdata
          save(data).then(res => {
            if(res.code === 0){
              this.$message.success('保存成功！')
              this.leftgetList(),
                this.formPlan.salesman =  '', //业务员
                this.formPlan.Reservation =  '',
                this.formPlan.remark =  '',
                this.Right.tbdata = []
                this.isAdd = true
            }
          })
        } else {
          this.$Message.error('*为必填！');
        }
      })
    },
    //checkbox全选
    selectAll(a){
      this.checkboxArr = a.selection
      console.log(this.checkboxArr)
    },
    //作废
    cancellation(){
      this.$Modal.confirm({
        title: '是否作废',
        onOk: async () => {
          this.$refs.formPlan.validate((valid) => {
            if (valid) {
              let params = {}
              params.id = this.rowId
              invalid(params).then(res => {
                if(res.code === 0){
                  this.$message.success('作废成功！')
                  this.leftgetList(),
                    this.formPlan.salesman =  '', //业务员
                    this.formPlan.Reservation =  '',
                    this.formPlan.remark =  '',
                    this.Right.tbdata = []
                }
              })
            } else {
              this.$Message.error('*为必填！');
            }
          })
        },
        onCancel: () => {
          this.$Message.info('取消作废');
        },
      })
    },
    // 导出
    derive(){
      if(!this.mainId){
        this.$message.error('请选择一条有效数据')
        return false
      }else {
        location.href = baseUrl.omsOrder + '/preOrderMain/export?id='+ this.mainId +'&access_token=' + Cookies.get(TOKEN_KEY)
      }
      },
    //导入配件
    getRUl(){
      this.upurl = getup +'id=' + this.mainId
    },
    //批量上传失败
    onFormatError(file) {
      this.$Message.error('只支持xls xlsx后缀的文件')
    },
    // 上传成功函数
    onSuccess (response) {
      if(response.code == 0 ){
        console.log(response.data)
        if (response.data.list && response.data.list.length > 0) {
          this.warning(response.data.List[0])
        }
      }else {
        this.$Message.error('上传失败')
      }
    },
    //上传之前清空
    beforeUpload(){
      this.$refs.upload.clearFiles()
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
          if (['preQty'].includes(column.property)) {
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
      let parts = [] 
      ChildMessage.map( item => {
        parts.push({
          partCode : item.partCode, //编码
          partName : item.partStandardName, //名称
          unit : item.minUnit, //单位
          partBrand : item.partBrand, //品牌
          spec : item.specifications,  //规格
          preQty : '', //预定数量
          remark : '', //备注
          acceptQty: 0, //受理数量
          oemCode : item.oeCode, //oe码
          direction: item.direction, //方向
          partInnerId: item.code, //配件内码
          partId : item.id,
        }) 
      })
      if(this.Right.tbdata){
        this.Right.tbdata = [...this.Right.tbdata,...parts]
      } else {[
        this.Right.tbdata = parts
      ]}
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
      let data = {}
      params.page = this.Left.page.num - 1
      params.size = this.Left.page.size
      if(this.selectArr !== '9999'){
        data.createTimeStart = this.selectArr[0]
        data.createTimeEnd = this.selectArr[1]
      }
      if(this.moreArr.createData != null){
        data.createTimeStart = this.moreArr.createData[0] + " 00:00:00"
        data.createTimeEnd = this.moreArr.createData[1] + " 23:59:59"
      }
      if(this.purchaseType !== '99'){
        data.status = this.purchaseType
      }
      if(this.moreArr.submitData != null){
        data.commitTimeStart = this.moreArr.submitData[0] + " 00:00:00"
        data.commitTimeEnd = this.moreArr.submitData[1] + " 23:59:59"
      }
      if(this.moreArr.callout){
        console.log(this.moreArr.callout)
        data.salesman = this.moreArr.callout
      }
      if(this.moreArr.numbers){
        data.orderNo = this.moreArr.numbers
      }
      if(this.moreArr.coding){
        data.partCode = this.moreArr.coding
      }
      if(this.moreArr.Name){
        data.fullName = this.moreArr.Name
      }
      if(this.moreArr.brand){
        data.partBrandCode = this.moreArr.brand
      }
      if(this.moreArr.Accessories){
        data.commitUname = this.moreArr.Accessories
      }
      optGroup({params:params,data:data}).then(res => {
        if(res.code === 0){
          this.Left.tbdata = res.data.content
          this.Left.page.total = res.data.totalElements
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
      this.formPlan.salesman = this.datadata.salesman
      this.formPlan.Reservation = this.datadata.orderNo
      this.formPlan.orderDate = this.datadata.expectedArrivalDate
      this.formPlan.remark = this.datadata.remark
      this.Right.tbdata = this.datadata.detailVOList
      this.presentrowMsg = row.status.value
      console.log(this.presentrowMsg)
      this.rowId = row.id
      if(row.id){
        this.buttonDisable = false
      }
    },
    Determined(){

    },
    // 提交按钮
    instance () {
      this.$Modal.confirm({
        title: '是否提交',
        onOk: async () => {
          this.$refs.formPlan.validate((valid) => {
            if (valid) {
              let data = {}
              data.id = this.rowId
              data.salesman =  this.formPlan.salesman
              data.orderNo =  this.formPlan.Reservation
              data.expectedArrivalDate = tools.transDate(this.formPlan.orderDate)
              console.log(tools.transDate(this.formPlan.orderDate))
              data.remark = this.formPlan.remark
              data.detailVOList = this.Right.tbdata
              commitOrder(data).then(res => {
                if(res.code === 0){
                  this.$message.success('提交成功！')
                  this.leftgetList(),
                    this.formPlan.salesman =  '', //业务员
                    this.formPlan.Reservation =  '',
                    this.formPlan.remark =  '',
                    this.Right.tbdata = []
                }
              })
            } else {
              this.$Message.error('*为必填！');
            }
          })
        },
        onCancel: () => {
          this.$Message.info('取消提交');
        },
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
  .w490{
    width: 480px;
  }
</style>
