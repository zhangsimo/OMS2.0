import { Vue, Component } from "vue-property-decorator";
// @ts-ignore
import * as api from "_api/procurement/plan";
import * as tools from "../../../utils/tools";

import QuickDate from '_c/getDate/dateget.vue';
import SelectSupplier from "./components/selectSupplier.vue";
import PurchaseAmount from "./components/PurchaseAmount.vue";
import GoodsInfo from './components/GoodsInfo.vue';
import MoreSearch from './components/MoreSearch.vue';
import FeeRegistration from './components/FeeRegistration.vue';
import ProcurementModal from './components/ProcurementModal.vue';
import AdjustModel from './components/AdjustModel.vue';
import TabsModel from './components/TabsModel.vue';

enum orderState {
  '草稿', '待发货', '待收货', '部分入库', '全部入库', '已退回', '关闭'
}

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
  }
})
export default class PlannedPurchaseOrder extends Vue {
  private split1: number = 0.2;
  //左侧表格高度
  private leftTableHeight: number = 0;
  //右侧表格高度
  private rightTableHeight: number = 0;

  // 快速查询订单状态
  private purchaseType: string|number = "";
  // 快速查询订单状态选项
  private purchaseTypeArr: Array<Option> = [
    {
      'label': '所有',
      'value': 999
    },
    {
      'label': '草稿',
      'value': 0
    },
    {
      'label': '审批中',
      'value': 1
    },
    {
      'label': '已审批',
      'value': 2
    },
    {
      'label': '已完成',
      'value': 3
    },
    {
      'label': '不通过',
      'value': 4
    },
    {
      'label': '已作废',
      'value': -1
    },
  ]

  // 采购订单列表——被选中行
  private selectTableRow: any = null;

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
          let val:string = orderState[p.row.billStatusId];
          return h('span', val);
        }
      },
      {
        title: '供应商',
        key: 'guest',
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
        key: 'updateUname',
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

  // 票据类型
  private pjTypes: Array<Option> = new Array();
  // 结算方式
  private settleMethods: Array<Option> = new Array();
  // 入库仓
  private inStores: Array<Option> = [];
  // 直发门店
  private putStores: Array<Option> = [];

  // 采购订单信息——表单
  private formPlan = {
    guest: "", // 供应商
    orderMan: "", // 采购员
    billTypeId: "", // 票据类型
    settleTypeId: "",  // 结算方式
    storeName: "", // 入库仓
    orderDate: "", // 订货日期
    planArriveDate: "", // 预计到货日期
    remark: "", // 备注
    companyName: "", // 直发门店
    serviceId: "", // 订单号
  }
  private rulePlan: ruleValidate = {
    guest: [{ required: true, message: '供应商不能为空', trigger: 'blur' }],
    orderMan: [{ required: true, message: '采购员不能为空', trigger: 'blur' }],
    billTypeId: [{ required: true, message: "请选票据类型", trigger: "change" }],
    settleTypeId: [{ required: true, message: "请选择结算方式", trigger: "change" }],
    storeName: [{ required: true, message: "请选择入库仓", trigger: "change" }],
    orderDate: [{ required: true, message: "请选择订货日期", trigger: "change" }],
  }

  // 采购订单信息表格数据
  private tableData: Array<any> = new Array();

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
  private quickDate:Array<string> = new Array();
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
  private PTrow: any = {
    billStatusId: '0',
    createTime: tools.transTime(new Date()),
  }
  //---- 新增方法
  private addPro() {
    if (!this.isAdd) {
      return this.$Message.error('请先保存数据');
    }
    this.isAdd = false;
    this.purchaseOrderTable.tbdata.push(this.PTrow);
    this.tableData.push({});
  }

  // 保存
  private saveHandle() { }

  // 提交
  private submit() { }

  // 废弃
  private abandoned() { }

  // 打印
  private print() { }

  //表格单选选中
  private selectTabelData(v: any) {
    this.selectTableRow = v;
    this.tableData = v.details || [];
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
        if (['orderQty', 'orderPrice'].includes(column.property) || columnIndex === 8) {
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
    if (type == 'orderPrice') {
      return total.toFixed(2);
    }
    if (columnIndex === 8) {
      let totals = 0;
      let sumarr = data.map(el => {
        return el.orderQty * el.orderPrice;
      })
      totals = sumarr.reduce((total, el) => total += el, 0);
      return totals.toFixed(2);
    }
    return total
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

  // 初始化字典
  private async init() {
    let res: any = await api.optGroupInit();
    if (res.code == 0) {
      const { companyMap, invoiceMap, guestMap, levelMap, settlementMap, storeMap } = res.data;
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
    }
  }

  // 初始化主数据
  //---- 判断是否是高级查询
  private isMore: boolean = false;
  //---- 初始方法
  private async getListData() {
    let params: any = {}
    let data:any = {}
    params.size = this.purchaseOrderTable.page.size;
    params.page = this.purchaseOrderTable.page.num - 1;
    if(this.quickDate.length > 0) {
      data.startTime = this.quickDate[0];
      data.endTime = this.quickDate[1];
    }
    if(this.purchaseType != 999) {
      data.flag = this.purchaseType;
    }
    let res: any;
    if (!this.isMore) {
      res = await api.findPageByDynamicQuery(params, data)
    } else {
      res = await api.queryByConditions(params, data)
    }
    if (res.code == 0) {
      this.purchaseOrderTable.page.total = res.data.totalElements;
      this.purchaseOrderTable.tbdata = res.data.content;
    }
  }

  // 选择供应商
  private selectSupplierName(row: any) {
    this.formPlan.guest = row.fullName;
  }

  // 操作-查看
  private watch(row: any) {
    this.showModel('tabsModel');
  }

  private mounted() {
    setTimeout(() => {
      this.getDomHeight();
    }, 0);
    this.init();
    this.getListData();
  }
}