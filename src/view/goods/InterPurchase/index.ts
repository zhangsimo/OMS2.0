import { Vue, Component } from "vue-property-decorator";
import { State } from 'vuex-class';
// @ts-ignore
import * as api from "_api/procurement/plan";
import * as tools from "../../../utils/tools";
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
import PrintModel from '../plannedPurchaseOrder/components/print.vue';
import ApportionmentExpenses from '../plannedPurchaseOrder/components/ApportionmentExpenses.vue';

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
    PrintModel,
    ApportionmentExpenses
  }
})
export default class InterPurchase extends Vue {
  @State('user') user;

  private split1: number = 0.2;

  private selectLeftItemId = '';

  private isInput: boolean = true;
  private isDirectCompanyId:boolean = false

  //左侧表格高度
  private leftTableHeight: number = 0;
  //右侧表格高度
  private rightTableHeight: number = 0;

  // 订单调整按钮是否可用
  private adjustButtonDisable: boolean = true;

  // 选中的采购订单列表的状态;
  private selectRowState: orderState | null = null;
  private serviceId: string = '';

  // 快速查询订单状态
  private purchaseType: string | number = "";
  // 快速查询订单状态选项
  private purchaseTypeArr: Array<Option> = []

  // 采购订单列表——被选中行
  private selectTableRow: any = null;
  private mainId: string | null = null;

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
  // 外币种类
  private currencyMap: Array<Option> = [];

  // 采购订单信息——表单
  private formPlanmain: any = {
    createUid: "",
    guestId: "", // 供应商id
    guestName: "", // 供应商
    orderMan: "", // 采购员
    orderManId: "",
    billTypeId: "", // 票据类型
    settleTypeId: "",  // 结算方式
    storeId: "", // 入库仓
    orderDate: "", // 订货日期
    planArriveDate: "", // 预计到货日期
    remark: "", // 备注
    directCompanyId: "", // 直发门店
    serviceId: "", // 订单号
    code: "", // 往来单号
    codeId: "",
    processInstanceId: "",
  }
  private ruleValidate: ruleValidate = {
    guestName: [{ required: true, message: '供应商不能为空', trigger: 'blur' }],
    orderManId: [{ required: true, message: '采购员不能为空', trigger: 'change' }],
    billTypeId: [{ required: true, message: "请选票据类型", trigger: "change" }],
    settleTypeId: [{ required: true, message: "请选择结算方式", trigger: "change" }],
    storeId: [{ required: true, message: "请选择入库仓", trigger: "change" }],
    orderDate: [{ required: true, type: 'date', message: "请选择订货日期", trigger: "change" }],
  }

  // 采购订单信息表格数据
  private tableData: Array<any> = new Array();

  private options1:any = {
    disabledDate (date:any) {
      return date && date.valueOf() < Date.now() - 86400000;
    }
  }

  private options2:any = {
    disabledDate: this.options2DisabledDate,
  }

  private options2DisabledDate (date:any) {
    const orderDate = this.formPlanmain.orderDate;
    return date && orderDate && date.valueOf() < orderDate;
  }

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
    billStatusId: '',
    details: [],
    processInstanceId: "",
  }
  //---- 新增方法
  private addPro() {
    const ref: any = this.$refs['formplanref'];
    if (!this.isAdd) {
      return this.$Message.error('请先保存数据');
    }
    ref.resetFields();
    const currentRowTable: any = this.$refs["currentRowTable"];
    currentRowTable.clearCurrentRow();
    for(let b of this.purchaseOrderTable.tbdata){
      b._highlight = false
    }
    this.selectLeftItemId = "";
    this.formPlanmain = {
      guestId: "", // 供应商id
      guestName: "", // 供应商
      orderMan: "", // 采购员
      orderManId: "",
      billTypeId: "", // 票据类型
      settleTypeId: "",  // 结算方式
      storeId: "", // 入库仓
      orderDate: "", // 订货日期
      planArriveDate: "", // 预计到货日期
      remark: "", // 备注
      directCompanyId: "", // 直发门店
      serviceId: "", // 订单号
      code: "", // 往来单号
      codeId: "",
      processInstanceId: "",
    }
    this.formPlanmain.createUid = "";
    this.formPlanmain.orderDate = new Date();
    this.isAdd = false;
    this.isInput = false;
    this.selectRowState = null;
    this.formPlanmain.orderMan = this.user.userData.staffName;
    this.formPlanmain.orderManId = this.user.userData.id;
    this.formPlanmain.storeId = this.defaultStore;
    this.purchaseOrderTable.tbdata.unshift(this.PTrow);
    this.selectTableRow = this.PTrow;
    this.tableData = new Array();
  }

  // 保存/修改/提交用数据
  private formdata(refname: string) {
    this.formPlanmain.orderDate = new Date(this.formPlanmain.orderDate);
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
          orderDate: tools.transTime(this.formPlanmain.orderDate),
          planArriveDate: tools.transTime(this.formPlanmain.planArriveDate),
          remark: this.formPlanmain.remark,
          directCompanyId: this.formPlanmain.directCompanyId,
          serviceId: this.formPlanmain.serviceId,
          code: this.formPlanmain.code,
          codeId: this.formPlanmain.codeId,
          processInstanceId: this.formPlanmain.processInstanceId,
        };
        for (let k in this.amt) {
          if (this.amt[k] > 0) {
            data[k] = this.amt[k];
          }
        }
        for (let k in this.feeform) {
          if (this.feeform[k]) {
            data[k] = this.feeform[k];
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
    let data: any = this.formdata(refname);
    if (!data) return;

    if(!data.directCompanyId){
      this.selectTableRow.directCompanyId = 0;
    }
    data = Object.assign({}, this.selectTableRow, data);
    data.details = this.tableData;
    let res = await api.saveInterDraft(data);
    if (res.code == 0) {
      this.$Message.success('保存成功');
      this.getListData();
      this.isAdd = true;
    }
  }

  // 提交
  private submit(refname: string) {
    this.$Modal.confirm({
      title: '是否提交',
      onOk: async () => {
        let data: any = this.formdata(refname);
        if (!data) return;

        if(!data.directCompanyId){
          this.selectTableRow.directCompanyId = 0;
        }

        if (this.selectTableRow.id) {
          data = { ...this.selectTableRow, ...data };
        }
        data.details = this.tableData;

        let zerolength = data.details.filter(el => el.orderPrice <= 0)
        if(zerolength.length > 0) {
          setTimeout(()=>{
            this.$Modal.confirm({
              title: '',
              content: '<p>存在配件价格为0，是否提交</p>',
              onOk: async () => {
                let res = await api.saveInterCommit(data);
                if (res.code == 0) {
                  this.$Message.success('保存成功');
                  this.getListData();
                  this.isAdd = true;
                }
              },
              onCancel:() => {
                this.isAdd = true;
              }
            })
          },500)
        }else{
          let res = await api.saveInterCommit(data);
          if (res.code == 0) {
            this.$Message.success('保存成功');
            this.getListData();
            this.isAdd = true;
          }
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
        if(this.deletePartArr.length > 0) {
          let res:any = await api.delPchsOrderDetail(this.deletePartArr);
          if(res.code == 0) {
            delOk = true;
            isNetWork = true;
          }
        } else {
          delOk = true;
        }
        if(this.tmpDeletePartArr.length > 0) {
          this.tmpDeletePartArr.forEach((els:any) => {
            this.tableData.forEach((el: any, index: number, arr: Array<any>) => {
              if(el.oid == els.oid) {
                arr.splice(index, 1);
              }
            })
          })
          this.tmpDeletePartArr = [];
          delOk2 = true;
        } else {
          delOk2 = true;
        }
        if (delOk && delOk2) {
          this.$Message.success('删除成功');
          if(isNetWork) {
            this.getListData();
          }
        }
      },
      onCancel: () => {
        // this.$Message.info('取消删除');
      },
    })
  }

  // 废弃
  private abandoned() {
    if (!this.selectTableRow || this.selectTableRow.new) return this.$Message.error('请先保存数据');
    this.$Modal.confirm({
      title: '是否要作废',
      onOk: async () => {
        let res: any = await api.saveInterObsolete(this.selectTableRow.id);
        if (res.code == 0) {
          this.$Message.success('作废成功');
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
    const ref: any = this.$refs.PrintModel;
    ref.openModal();
  }

  //表格单选选中
  private selectTabelData(v: any) {
    if (v == null) return;
    //记录当前点击的id
    this.selectLeftItemId = v.id
    const currentRowTable: any = this.$refs["currentRowTable"];
    if (!v.new && !this.isAdd) {
      this.$Modal.confirm({
        title: '您正在编辑单据，是否需要保存',
        onOk: () => {
          currentRowTable.clearCurrentRow();
          this.purchaseOrderTable.tbdata[0] = { ...this.selectTableRow, ...this.formPlanmain, _highlight: true };
          const row = this.purchaseOrderTable.tbdata[0];
          this.selectTableRow = this.purchaseOrderTable.tbdata[0];
          this.purchaseOrderTable.tbdata.push();
          this.saveHandle('formplanref');
          this.mainId = row.id || "";
          this.tableData = row.details || [];
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
      if (this.isAdd) {
        const ref: any = this.$refs['formplanref']
        ref.resetFields();
      }
      this.setFormPlanmain(v);
    }
  }

  private setFormPlanmain(v:any){
    if (v) {
      this.selectTableRow = v;
      this.mainId = v.id;
      this.tableData = v.details || [];
      this.selectRowState = v.billStatusId.name;
      this.serviceId = v.serviceId;
      // orderState['草稿'], orderState['退回']
      this.formPlanmain.createUid = v.createUid;
      this.formPlanmain.processInstanceId = v.processInstanceId;
      this.formPlanmain.orderDate = v.orderDate;
      this.formPlanmain.planArriveDate = v.planArriveDate;
      if (['草稿', '退回'].includes(v.billStatusId.name)) {
        this.isInput = false;
      } else {
        this.isInput = true;
      }
      // orderState['待收货'], orderState['部分入库']
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
    //console.log(`关闭 ${column} 列编辑`)
  }

  // 底部合计
  private addFooter({ columns, data }) {
    return [
      columns.map((column, columnIndex) => {
        if (columnIndex === 0) {
          return '合计'
        }
        if (['orderQty', 'orderPrice', 'noTaxPrice', 'noTaxAmt', 'tariffAmt', 'transportAmt', 'vatAmt', 'otherAmt', 'notEnterQty', 'trueEnterQty'].includes(column.property) || columnIndex === 14) {
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
      if (!value) {
        value = 0
      }
      total += parseFloat(value)
    })
    if (['noTaxPrice', 'noTaxAmt', 'tariffAmt', 'transportAmt', 'vatAmt', 'otherAmt'].includes(type)) {
      return total.toFixed(2);
    }
    if (type === 'orderPrice') {
      let totals = 0;
      let sumarr = data.map(el => {
        return el.rmbPrice + el.tariffAmt + el.transportAmt + el.vatAmt + el.otherAmt
      })
      totals = sumarr.reduce((total, el) => total += el, 0);
      return totals.toFixed(2);
    }
    if (columnIndex === 14) {
      let totals = 0;
      let sumarr = data.map(el => {
        return el.orderQty * (el.rmbPrice + el.tariffAmt + el.transportAmt + el.vatAmt + el.otherAmt);
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
    if (this.selectRowState === null || !this.mainId) return this.$Message.error('请先选择保存过的数据');
    this.showModel('feeRegistration');
  }

  // 收货信息
  private showGoodsInfo() {
    if (!this.selectTableRow || this.selectTableRow.new) return this.$Message.error('请先选择保存过的数据');
    this.showModel('goodsInfo');
  }

  // 显示和初始化弹窗(选择供应商 采购金额填写 收货信息 更多)
  private showModel(name) {
    let ref: any = this.$refs[name];
    ref.init();
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
      const { companyMap, currencyMap, invoiceMap, guestMap, levelMap, settlementMap, billStatusMap, storeMap, defaultStore } = res.data;
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
      // 状态
      for (let el in billStatusMap) {
        this.purchaseTypeArr.push({ value: billStatusMap[el], label: el })
      }
      // 外币种类
      for (let el in currencyMap) {
        this.currencyMap.push({ value: currencyMap[el], label: el })
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
      res = await api.findPageByInternationDynamicQuery(params, data)
    } else {
      if (this.moreData != null) {
        data = { ...data, ...this.moreData };
      }
      res = await api.queryByInternationConditions(params, data)
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
      for(let b of this.purchaseOrderTable.tbdata){
        b._highlight = false;
        if(b.id==this.selectLeftItemId){
          b._highlight = true;
          this.setFormPlanmain(b);
          break;
        }
      }
    }
  }

  // 选择供应商
  private selectSupplierName(row: any) {
    if(row) {
      this.formPlanmain.guestName = row.fullName;
      this.formPlanmain.guestId = row.id;
      //结算方式
      this.formPlanmain.settleTypeId = row.settTypeId || ''
      //票据类型
      this.formPlanmain.billTypeId = row.billTypeId || ''

      //清空数据
      this.tableData = [];
      this.formPlanmain.code = row.serviceId;
      this.isDirectCompanyId = false;
      this.formPlanmain.directCompanyId = null;
    }
  }

  // 采购计划单据
  private getPlanOrder(row: any) {
    if (!row) return;
    this.formPlanmain.code = row.serviceId;
    if(row.directCompanyId){
      this.isDirectCompanyId = true;      
    }else{
      this.isDirectCompanyId = false;
    }
    this.formPlanmain.directCompanyId = row.directCompanyId;
    this.purchaseOrderTable.tbdata.forEach((el: any) => {
      el.details.forEach((d: any, index: number, arr: Array<any>) => {
        if (!d.isOldFlag) {
          arr.splice(index, 1);
        }
      })
    })
    this.tableData = row.details;
    this.tableData.map(item => {
      item.orderQty = item.canQty
    })
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
  private partId: string = '';
  private watch(id: any) {
    this.partId = id || null;
    this.$nextTick(() => {
      this.showModel('tabsModel');
    })
  }

  // 分摊费用
  private feeform = {
    currency: "", // 币种
    exchangeRate: 0, // 汇率
    tariffScale: 0, // 关税比例
    transportScale: 0, // 运杂费比例
    vatScale: 0 // 增值税比例
  }
  private async getFeeForm(form: any) {
    if (form === null) return;
    this.feeform = form;
    let data = Object.assign({}, this.selectTableRow, { details: this.tableData }, this.feeform);
    let res: any = await api.calculatAmt(data);
    if (res.code == 0) {
      this.tableData = res.data || [];
    }
  }

  private mounted() {
    setTimeout(() => {
      this.getDomHeight();
    }, 0);
    this.init();
    this.getListData();
    this.getAllSales();
  }
}
