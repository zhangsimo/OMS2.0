import { Vue, Component } from "vue-property-decorator";
import { State } from 'vuex-class';
// @ts-ignore
import * as api from "_api/procurement/plan";
import * as tools from "../../../utils/tools";
import {down } from "@/api/system/essentialData/commoditiesInShortSupply.js"
import { orderState } from '../plannedPurchaseOrder/global';
import { getSales } from "@/api/salesManagment/salesOrder";
import QuickDate from '_c/getDate/dateget.vue';
import SelectSupplier from "../plannedPurchaseOrder/components/selectSupplier.vue";
import PurchaseAmount from "../plannedPurchaseOrder/components/PurchaseAmount.vue";
import GoodsInfo from '../plannedPurchaseOrder/components/GoodsInfo.vue';
import MoreSearch from '../plannedPurchaseOrder/components/MoreSearch.vue';
import FeeRegistration from '../plannedPurchaseOrder/components/FeeRegistration.vue';
import ProcurementModal from '../plannedPurchaseOrder/components/ProcurementModal.vue';
import AdjustModel from '../plannedPurchaseOrder/components/AdjustModel.vue';
import TabsModel from '../plannedPurchaseOrder/components/TabsModel.vue';
import StatusModel from '../plannedPurchaseOrder/components/checkApprovalModal.vue';
import SelectPartCom from "../goodsList/components/selectPartCom.vue";
import Cookies from 'js-cookie'
import { TOKEN_KEY } from '@/libs/util'
import { v4 } from "uuid"
import GoodCus from "_c/allocation/GoodCus.vue"
import { checkStore } from "@/api/system/systemApi";

@Component({
  components: {
    QuickDate,
    SelectSupplier,
    PurchaseAmount,
    GoodsInfo,
    MoreSearch,
    FeeRegistration,
    ProcurementModal,
    AdjustModel,
    TabsModel,
    StatusModel,
    SelectPartCom,
    GoodCus
  }
})
export default class OutsidePurchase extends Vue {
  @State('user') user;

  private showSelf: boolean = true;

  private split1: number = 0.2;

  private selectLeftItemId = ''

  private isInput: boolean = true;

  private hideSp: boolean = true;

  //配件数据
  private accData: Array<Option> = [];
  //左侧表格高度
  private leftTableHeight: number = 0;
  //右侧表格高度
  private rightTableHeight: number = 0;

  // 订单调整按钮是否可用
  private adjustButtonDisable: boolean = true;

  // 选中的采购订单列表的状态;
  private selectRowState:orderState| null = null;
  private serviceId:string = '';

  // 快速查询订单状态
  private purchaseType: string | number = "";
  // 快速查询订单状态选项
  private purchaseTypeArr: Array<Option> = []
  private headers={
    Authorization:'Bearer ' + Cookies.get(TOKEN_KEY)
  };//请求头
  private upurl = api.outgetup;//导入地址
  // 采购订单列表——被选中行
  private selectTableRow: any = null;
  private mainId: string|null = null;

  private commitLoading: boolean = false;
  private saveLoading: boolean = false;

  // 采购订单列表
  private purchaseOrderTable = {
    loading: false,
    columns: [
      {
        title: '序号',
        minWidth: 50,
        type: 'index',
      },
      {
        title: '状态',
        key: 'billStatusId',
        minWidth: 80,
        render: (h, p) => {
          let val: string = p.row.billStatusId.name; // orderState[p.row.billStatusId];
          return h('span', val);
        }
      },
      {
        title: '供应商',
        key: 'guestName',
        minWidth: 170
      },
      {
        title: '采购员',
        key: 'orderMan',
        minWidth: 140
      },
      {
        title: '订单单号',
        key: 'serviceId',
        minWidth: 140
      },
      {
        title: '创建人',
        key: 'createUname',
        minWidth: 120
      },
      {
        title: '创建日期',
        key: 'createTime',
        minWidth: 200
      },
      {
        title: '打印次数',
        key: 'printCount',
        minWidth: 100
      },
      {
        title: '提交人',
        key: 'auditor',
        minWidth: 100
      },
      {
        title: '提交日期',
        align: 'center',
        key: 'auditDate',
        minWidth: 140
      },
    ],
    tbdata: new Array(),
    page: {
      num: 1,
      size: 10,
      total: 0,
    }
  }

  private isSelfOk:boolean =  true

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
  }

  keydown($event){
    if ($event.$event.keyCode == 9){
      this.editNextCell($event.$table)
    }
  }
  //批量上传失败
  onFormatError(file) {
    this.$Message.error('只支持xls xlsx后缀的文件')
  };

  // 上传成功函数
  onSuccess(response) {
    if (response.code == 0) {
      if (response.data.errosMsg.length > 0) {
        this.warning(response.data.errosMsg);
      } else {
        this.$Message.success("导入成功");
      }
      let arrData = response.data.details.map(item => {
        item.isOldFlag = true
        return item
      })
      this.tableData = [...this.tableData, ...arrData].map( el => {
        el.uuid = v4();
        return el;
      })
      this.tableData.push();
    } else {
      this.$Message.error(response.message)
    }
  }

  async checkSelf({ row: { storeShelf } }) {
    if (storeShelf == "") {
      this.isSelfOk = true;
    } else {
      let res:any = await checkStore({ storeId: this.formPlanmain.storeId, name: storeShelf });
      if (res.code == 0 && res.data != null) {
        this.isSelfOk = true;
      } else {
        this.isSelfOk = false;
      }
    }
  }

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
  };
  //上传之前清空
  beforeUpload(){
    let upload : any=this.$refs.upload;
    upload.clearFiles()
  };
  //下载模板
  down(){
    down('2000000000')
  };

  // 合计采购金额
  private totalAmt: number = 0;

  // 票据类型
  private pjTypes: Array<Option> = new Array();
  // 结算方式
  private settleMethods: Array<Option> = new Array();
  // 入库仓
  private inStores: Array<Option> = [];
  // 直发门店
  private putStores: Array<Option> = [];

  // 采购订单信息——表单
  private formPlanmain: any = {
    createUid: "",
    guestId: "", // 供应商id
    guestName: "", // 供应商
    advanceAmt:"",//预付款
    orderMan: "", // 采购员
    orderManId: "",
    billTypeId: "", // 票据类型
    settleTypeId: "",  // 结算方式
    storeId: "", // 入库仓
    remark: "", // 备注
    serviceId: "", // 订单号
    processInstanceId: "",
  }
  private ruleValidate: ruleValidate = {
    guestName: [{ required: true, message: '供应商不能为空', trigger: 'blur' }],
    orderManId: [{ required: true, message: '采购员不能为空', trigger: 'change' }],
    billTypeId: [{ required: true, message: "请选票据类型", trigger: "change" }],
    settleTypeId: [{ required: true, message: "请选择结算方式", trigger: "change" }],
    storeId: [{ required: true, message: "请选择入库仓", trigger: "change" }],
  }
  // 采购订单信息表格数据
  private tableData: Array<any> = new Array();

  private salesList:Array<any> = new Array();
  private async getAllSales() {
    let res:any = await getSales();
    if (res.code === 0) {
      this.salesList = res.data.content;
      this.salesList.forEach((item:any) => {
        item.label = item.userName;
        item.value = item.id;
      })
    }
  }
  private selectOrderMan(val:any){
    this.formPlanmain.orderMan = val.label || "";
    this.formPlanmain.orderManId = val.value || "";
  }

  // 采购订单列表-翻页
  private purchaseOrderTableChangePage(p: number) {
    this.purchaseOrderTable.page.num = p;
    this.getListData();
  }

  // 采购订单列表-修改页码
  private purchaseOrderTableChangeSize(size: number) {
    this.purchaseOrderTable.page.num = 1;
    this.purchaseOrderTable.page.size = size;
    this.getListData();
  }

  // 快速查询日期
  private quickDate: Array<string> = new Array();
  private getDataQuick(v: Array<string>) {
    this.quickDate = v;
    this.getListData();
  }
  // 快速查询状态
  private changeState() {
    this.getListData();
  }

  // 新增
  //---- 判断是否能新增
  private isAdd: boolean = true;
  //---- 新增的采购订单列表数据
  private detail: any = {};
  private PTrow: any = {
    new: true,
    _highlight: true,
    id: '',
    billStatusId: '0',
    details: [],
    processInstanceId: "",
  }

  //点击保存后禁用保存按钮
  private isClickSave:boolean = false;
  //---- 新增方法
  private addPro() {
    if (!this.isAdd) {
      return this.$Message.error('请先保存数据');
    }
    const ref: any = this.$refs['formplanref'];
    ref.resetFields();
    const currentRowTable: any = this.$refs["currentRowTable"];
    currentRowTable.clearCurrentRow();
    this.selectLeftItemId=''
    for(let b of this.purchaseOrderTable.tbdata){
      b._highlight = false
    }
    this.selectTableRow = null;
    this.formPlanmain = {
      guestId: "", // 供应商id
      guestName: "", // 供应商
      advanceAmt:"",//预付款
      orderMan: "", // 采购员
      orderManId: "",
      billTypeId: "", // 票据类型
      settleTypeId: "",  // 结算方式
      storeId: "", // 入库仓
      remark: "", // 备注
      serviceId: "", // 订单号
      processInstanceId: "",
    }
    this.formPlanmain.createUid = "";
    this.isAdd = false;
    this.isInput = false;
    this.selectRowState = null;
    this.formPlanmain.orderMan = this.user.userData.staffName;
    this.formPlanmain.orderManId = this.user.userData.id;
    this.formPlanmain.storeId = this.defaultStore;
    this.purchaseOrderTable.tbdata.unshift(this.PTrow);
    this.selectTableRow = this.PTrow;
    this.tableData = new Array();
    this.deletePartArr = new Array();
    this.tmpDeletePartArr = new Array();
  }

  // 保存/修改/提交用数据
  private formdata(refname: string) {
    const ref: any = this.$refs[refname];
    let data: any = {};
    ref.validate((valid: any) => {
      if (valid) {
        data = {
          createUid: this.formPlanmain.createUid,
          guestId: this.formPlanmain.guestId,
          orderMan: this.formPlanmain.orderMan,
          orderManId: this.formPlanmain.orderManId,
          billTypeId: this.formPlanmain.billTypeId,
          settleTypeId: this.formPlanmain.settleTypeId,
          storeId: this.formPlanmain.storeId,
          remark: this.formPlanmain.remark,
          serviceId: this.formPlanmain.serviceId,
          advanceAmt:this.formPlanmain.advanceAmt,
          processInstanceId: this.formPlanmain.processInstanceId,
        };
        for (let k in this.amt) {
          if (this.amt[k] > 0) {
            data[k] = this.amt[k];
          }
        }
      } else {
        this.$Message.error('请添加配件或完善订单信息后再提交!');
        data = null;
      }
    })
    let obj: any = {};
    for (let k in data) {
      let v = data[k];
      if (!!v) {
        obj[k] = v;
      }
    }
    if (!data) {
      return null;
    }
    // obj.details = [];
    return obj;
  }

  // 保存
  private async saveHandle(refname: string) {
    if (!this.isSelfOk) {
      return this.$message.error("请填写正确的仓位!");
    }

    let data: any = this.formdata(refname);
    if (!data) return;

    let zero = tools.isZero(this.tableData, {qty: "orderQty", price: "orderPrice"});
    if(zero) return;

    data = Object.assign({}, this.selectTableRow, data);
    data.details = this.tableData;
    let zerolength = data.details.filter(el => el.orderPrice <= 0)

    if(this.isClickSave){
      return this.$Message.error("正在保存单据请稍后...");
    }
    this.isClickSave = true;
    this.saveLoading = true;
    let res = await api.outsideSaveDraft(data);
    if (res.code == 0) {
      this.$Message.success('保存成功');
      this.resetForm();
      this.getListData();
      this.isAdd = true;
      this.saveLoading = false;

    }
    this.isClickSave = false;
  }

  private resetForm(){
    const ref: any = this.$refs['formplanref']
    ref.resetFields();
  }

  // 提交
  private submit(refname: string) {
    if(!this.selectTableRow.id) return this.$message.error("请先保存再提交");

    if (!this.isSelfOk) {
      return this.$message.error("请填写正确的仓位!");
    }

    let zero = tools.isZero(this.tableData, {qty: "orderQty", price: "orderPrice"});
    if(zero) return;

    this.$Modal.confirm({
      title: '是否提交',
      onOk: async () => {
        let data: any = this.formdata(refname);
        if (!data) return;
        if (this.selectTableRow.id) {
          data = { ...this.selectTableRow, ...data };
        }
        data.details = this.tableData;

        let zerolength = data.details.filter(el => el.orderPrice <= 0)
        if(this.isClickSave){
          return this.$Message.error("正在处理单据请稍后...");
        }
        if(zerolength.length > 0) {
          setTimeout(()=>{
            this.$Modal.confirm({
              title: '',
              content: '<p>存在配件价格为0，是否提交</p>',
              onOk: async () => {
                this.isClickSave = true;
                let res = await api.outsideSaveCommit(data);
                if (res.code == 0) {
                  this.$Message.success('保存成功');
                  this.resetForm();
                  this.getListData();
                  this.isAdd = true;
                }
                this.isClickSave = false;
              },
              onCancel:() => {
                this.isAdd = true;
              }
            })
          },500)
        }else{
          this.isClickSave = true;
          let res = await api.outsideSaveCommit(data);
          if (res.code == 0) {
            this.$Message.success('保存成功');
            this.resetForm();
            this.getListData();
            this.isAdd = true;
          }
          this.isClickSave = false;
        }
      },
      onCancel: () => {
        this.$Message.info('取消提交');
      },
    })
  }



  // 选择要删除配件
  private deletePartArr: Array<any> = new Array();
  private tmpDeletePartArr: Array<any> = new Array();
  private selectAll({ checked }) {
    if (checked) {
      this.tableData.forEach((el: any) => {
        if (el.isOldFlag) {
          this.deletePartArr.push(el)
        } else {
          this.tmpDeletePartArr.push(el);
        }
      })
    } else {
      this.deletePartArr = new Array();
      this.tmpDeletePartArr = new Array();
    }
  }
  private selectChange({ checked, row }) {
    if (checked) {
      if(row.isOldFlag) {
        this.deletePartArr.push(row);
      } else {
        this.tmpDeletePartArr.push(row);
      }
    } else {
      this.deletePartArr.forEach((el: any, index: number, arr: Array<any>) => {
        if (el.isOldFlag && row.id == el.id) {
          arr.splice(index, 1);
        }
      })
      this.tmpDeletePartArr.forEach((el: any, index: number, arr: Array<any>) => {
        if (row.oid == el.oid) {
          arr.splice(index, 1);
        }
      })
    }
  }

  // 删除配件
  private delPart() {
    if (this.deletePartArr.length <= 0 && this.tmpDeletePartArr.length <= 0 ) return this.$Message.error('请选择要删除的配件');
    let delOk:boolean = false;
    let delOk2:boolean = false;
    let isNetWork:boolean = false;
    this.$Modal.confirm({
      title: '是否要删除配件',
      onOk: async () => {
        let arr = [...this.deletePartArr, ...this.tmpDeletePartArr].map(el => el.uuid);

        let res: any;
        if(this.deletePartArr.length > 0) {
          res = await api.delPchsOrderDetail(this.deletePartArr);
        }
        if(this.tmpDeletePartArr.length > 0) {
          res = { code: 0 }
        }

        if (res.code == 0) {
          this.tableData = this.tableData.filter(item => {
            return !arr.includes(item.uuid);
          })
          this.tmpDeletePartArr = [];
          this.deletePartArr = [];
          this.$Message.success('删除成功');
        }
      },
      onCancel: () => {
        // this.$Message.info('取消删除');
      },
    })
  }

  // 废弃
  private abandoned() {
    if(!this.selectTableRow || this.selectTableRow.new) return this.$Message.error('请先保存数据');
    this.$Modal.confirm({
      title: '是否要作废',
      onOk: async () => {
        let res: any = await api.outsideSaveObsolete(this.selectTableRow.id);
        if (res.code == 0) {
          this.$Message.success('作废成功');
          this.resetForm();
          this.getListData();
        }
      },
      onCancel: () => {
        this.$Message.info('取消作废');
      },
    })
  }

  // 打印
  private print() {
    let order:any = {};
    order.name="采购订单"
    order.route=this.$route.name
    order.id=this.mainId
    let routeUrl=this.$router.resolve({name:"print",query:order})
    window.open(routeUrl.href,"_blank");
    this.getListData()
  }

  //表格单选选中
  private selectTabelData(v: any) {
    if (v == null) return;
    this.selectLeftItemId = v.id
    this.deletePartArr = new Array();
    this.tmpDeletePartArr = new Array();
    const currentRowTable: any = this.$refs["currentRowTable"];
    if (!v.new && !this.isAdd) {
      this.$Modal.confirm({
        title: '您正在编辑单据，是否需要保存',
        onOk: () => {
          currentRowTable.clearCurrentRow();
          this.purchaseOrderTable.tbdata[0] = {...this.selectTableRow, ...this.formPlanmain,  _highlight: true };
          const row = this.purchaseOrderTable.tbdata[0];
          this.selectTableRow = this.purchaseOrderTable.tbdata[0];
          this.purchaseOrderTable.tbdata.push();
          this.saveHandle('formplanref');
          this.mainId = row.id || "";
          this.tableData = (row.details || []).map( el => {
            el.uuid = v4();
            return el;
          });
          this.selectRowState = null;
          this.serviceId = row.serviceId || "";
          this.isInput = false;
          this.adjustButtonDisable = true;
          for (let k in this.formPlanmain) {
            this.formPlanmain[k] = row[k];
          }
        },
        onCancel: () => {
          this.purchaseOrderTable.tbdata.splice(0, 1);
          this.isAdd = true;
          currentRowTable.clearCurrentRow();
          const ref: any = this.$refs['formplanref']
          ref.resetFields();

          for(let b of this.purchaseOrderTable.tbdata){
            b._highlight = false
            if(b.id==this.selectLeftItemId){
              b._highlight = true;
              this.setFormPlanmain(b);
              break;
            }
          }
        },
      })
    } else {
      if(this.isAdd) {
        const ref: any = this.$refs['formplanref']
        ref.resetFields();
      }
      this.setFormPlanmain(v);
    }
  }

  private setFormPlanmain(v:any){
    if(v) {
      this.selectTableRow = v;
      this.mainId = v.id;
      this.tableData = (v.details || []).map( el => {
        el.uuid = v4();
        return el;
      });
      this.selectRowState = v.billStatusId.name;
      this.serviceId = v.serviceId;
      this.formPlanmain.createUid = v.createUid;
      this.formPlanmain.processInstanceId = v.processInstanceId;
      if (['草稿', '退回','不通过'].includes(v.billStatusId.name)) {
        this.isInput = false;
      } else {
        this.isInput = true;
      }
      if (['草稿', '已作废'].includes(v.billStatusId.name)  || !v.processInstanceId ) {
        this.hideSp = true;
      } else {
        this.hideSp = false;
      }
      if (['待收货', '部分入库'].includes(v.billStatusId.name)) {
        this.adjustButtonDisable = false;
      } else {
        this.adjustButtonDisable = true;
      }
      for (let k in this.formPlanmain) {
        this.formPlanmain[k] = v[k];
      }
    }
  }

  private editActivedEvent({ row, column }, event) {
    //console.log(`打开 ${column.title} 列编辑`)
  }

  private editClosedEvent({ row, column }, event) {
    //console.log(row,event,column)
    // .log(`关闭 ${column} 列编辑`)
  }

  // 底部合计
  private addFooter({ columns, data }) {
    return [
      columns.map((column, columnIndex) => {
        if (columnIndex === 0) {
          return '合计'
        }
        if (['orderQty', 'orderPrice', 'noTaxPrice', 'noTaxAmt','orderAmt'].includes(column.property)) {
          return this.sum(data, column.property, columnIndex)
        }
        return null
      })
    ]
  }
  // 合计
  private sum(data, type, columnIndex) {
    let total = 0
    data.map(item => {
      let value = item[type]
      if (!value || isNaN(value)) {
        value = 0
      }
      total += parseFloat(value)
    })
    if (['orderPrice', 'noTaxPrice', 'noTaxAmt'].includes(type)) {
      return total.toFixed(2);
    }
    if (type === 'orderAmt') {
      let totals = 0;
      let sumarr = data.map(el => {
        let orderQty = isNaN(el.orderQty * 1) ? 0 : el.orderQty * 1;
        let orderPrice = isNaN(el.orderPrice * 1) ? 0 : el.orderPrice * 1;
        return orderQty * orderPrice;
      })
      totals = sumarr.reduce((total, el) => total += el, 0);
      this.totalAmt = totals;
      return totals.toFixed(2);
    }
    return total
  }

  // 选择采购计划
  private selectPlan() {
    if (!this.formPlanmain.guestId) return this.$Message.error('请选择供应商');
    this.showModel('procurementModal')
  }

  // 费用登记
  private showFee() {
    if(this.selectRowState === null || !this.mainId) return this.$Message.error('请先保存数据');
    this.showModel('feeRegistration');
  }

  // 收货信息
  private showGoodsInfo() {
    if(!this.selectTableRow || this.selectTableRow.new) return this.$Message.error('请先保存数据');
    this.showModel('goodsInfo');
  }
  //查看审批
  private showStatus(){
    this.showModel('StatusModel');
  }
  //添加配件
  private addAcc(){
    this.showModel('selectPartCom')
  }
  //添加配件数据
  private getPartNameList(v){
    let arrData = v||[]
    arrData = JSON.parse(JSON.stringify(arrData));
    arrData.forEach(item => {
      item.specifications = item.spec;
      item.orderPrice = item.recentPrice || undefined;
      item.orderQty = undefined;
    })
    this.tableData = this.tableData.concat(arrData).map(el => {
      el.uuid = v4();
      return el;
    });
    // this.tableData = tools.arrRemoval(this.tableData, 'partCode');
  }

  //添加配件修改数量价格数据
  private getPartNameList2(v){
    let arrData = v||[]
    this.tableData = this.tableData.concat(arrData).map(el => {
      el.uuid = v4();
      return el;
    });
    this.$Message.success("已添加");
  }

  // 显示和初始化弹窗(选择供应商 采购金额填写 收货信息 更多)
  private showModel(name) {
    if(this.formPlanmain.storeId){
      let ref: any = this.$refs[name];
      ref.init();
    }else{
      this.$Message.error("请选择入库仓");
    }
  }
  //导入
  private getRUl(){
    this.upurl=api.outgetup+'id=' + this.mainId;
  }
  // 调节大小
  private getDomHeight() {
    this.$nextTick(() => {
      let paneLeft: any = this.$refs.paneLeft;
      let planForm: any = this.$refs.planForm;
      let planBtn: any = this.$refs.planBtn;
      let wrapH = paneLeft.offsetHeight;
      let planFormH = planForm.offsetHeight;
      let planBtnH = planBtn.offsetHeight;
      // let planPageH = this.$refs.planPage.offsetHeight;
      //获取左侧侧表格高度
      this.leftTableHeight = wrapH - 70;
      //获取右侧表格高度
      this.rightTableHeight = wrapH - planFormH - planBtnH - 38;
    })
  }

  private defaultStore:string = '';
  // 初始化字典
  private async init() {
    let res: any = await api.optGroupInit();
    if (res.code == 0) {
      const { companyMap, invoiceMap, guestMap, levelMap, settlementMap, billStatusMap, storeMap, defaultStore } = res.data;
      // 票据类型
      for (let el in invoiceMap) {
        this.pjTypes.push({ value: invoiceMap[el], label: el })
      }
      // 结算方式
      for (let el in settlementMap) {
        this.settleMethods.push({ value: settlementMap[el], label: el })
      }
      // 入库仓
      for (let el in storeMap) {
        this.inStores.push({ value: storeMap[el], label: el })
      }
      // 直发门店
      for (let el in companyMap) {
        this.putStores.push({ value: companyMap[el], label: el })
      }
      for(let el in billStatusMap) {
        this.purchaseTypeArr.push({ value: billStatusMap[el], label: el })
      }
      if(defaultStore) {
        this.defaultStore = defaultStore;
        this.formPlanmain.storeId = defaultStore;
      }
    }
  }

  // 高级查询
  private moreData: any = {};
  private getmoreData(data) {
    this.moreData = data;
    if (data != null) {
      this.isMore = true;
      this.getListData();
    } else {
      this.isMore = false;
    }
  }

  // 初始化主数据
  //---- 判断是否是高级查询
  private isMore: boolean = false;
  //---- 初始方法
  private async getListData() {
    this.purchaseOrderTable.loading = true;
    let params: any = {}
    let data: any = {}
    data.showSelf = this.showSelf;
    params.size = this.purchaseOrderTable.page.size;
    params.page = this.purchaseOrderTable.page.num - 1;
    if (this.quickDate.length > 0) {
      data.startTime = this.quickDate[0];
      data.endTime = this.quickDate[1];
    }
    if (this.purchaseType != 999 && this.purchaseType) {
      data.billStatusId = this.purchaseType;
    }
    let res: any;
    if (!this.isMore) {
      res = await api.outsideFindPageByDynamicQuery(params, data)
    } else {
      if (this.moreData != null) {
        data = { ...data, ...this.moreData };
      }
      res = await api.outsideQueryByConditions(params, data)
    }
    if (res.code == 0) {
      this.isAdd = true;
      this.isInput = true;
      this.tableData = new Array();
      const ref: any = this.$refs['formplanref'];
      ref.resetFields();
      this.formPlanmain.guestId = '';
      this.formPlanmain.serviceId = '';
      this.purchaseOrderTable.loading = false;
      this.purchaseOrderTable.page.total = res.data.totalElements;
      this.purchaseOrderTable.tbdata = res.data.content;
      this.purchaseOrderTable.tbdata.forEach((el: any) => {
        Array.isArray(el.details) && el.details.forEach((d: any) => {
          d.isOldFlag = true;
        })
      })
      if(this.selectLeftItemId){
        for(let b of this.purchaseOrderTable.tbdata){
          b._highlight = false
          if(b.id==this.selectLeftItemId){
            b._highlight = true;
            this.setFormPlanmain(b);
            break;
          }
        }
      }else{
        if(this.purchaseOrderTable.tbdata.length>0){
          this.purchaseOrderTable.tbdata[0]._highlight=true
          this.setFormPlanmain(this.purchaseOrderTable.tbdata[0]);
        }
      }

    }
  }

  throwNameFun(v) {
    this.selectSupplierName(v);
  }

  // 选择供应商
  private selectSupplierName(row: any) {
    if(row) {
      this.formPlanmain.guestName = row.fullName;
      this.formPlanmain.guestId = row.id;
      //结算方式
      this.formPlanmain.settleTypeId =  row.settTypeId || ''
      //票据类型
      this.formPlanmain.billTypeId = row.billTypeId || ''
    }
  }

  // 采购计划单据
  private getPlanOrder(row: any) {
    if (!row) return;
    this.formPlanmain.code = row.serviceId;
    this.purchaseOrderTable.tbdata.forEach((el: any) => {
      el.details.forEach((d: any, index: number, arr: Array<any>) => {
        if (!d.isOldFlag) {
          arr.splice(index, 1);
        }
      })
    })
    this.tableData = row.details.map( el => {
      el.uuid = v4();
      return el;
    });
    // this.selectTableRow.details = this.tableData;
    this.purchaseOrderTable.tbdata.forEach((el: any) => {
      if (el.id == this.selectTableRow.id) {
        el = this.selectTableRow;
      }
    })
  }

  // 采购金额填写
  private amt: any = {
    disAmt: 0,
    rebateAmt: 0,
  }
  private getAmt(amt) {
    this.amt = amt;
  }
  // 操作-查看
  private partId:string = '';
  private watch(id: any) {
    this.partId = id || null;
    this.$nextTick(() => {
      this.showModel('tabsModel');
    })
  }
  private showOwen() {
    tools.setSession("self", { outsidePurchase: this.showSelf });
    this.getListData();
  }
  private mounted() {
    let self:any = tools.getSession("self");
    this.showSelf = Reflect.has(self, "outsidePurchase") ? self.outsidePurchase : true;


    setTimeout(() => {
      this.getDomHeight();
    }, 0);
    this.init();
    this.getListData();
    this.getAllSales();
  }
}
