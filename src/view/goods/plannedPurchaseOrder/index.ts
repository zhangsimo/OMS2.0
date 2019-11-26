import { Vue, Component } from "vue-property-decorator";
// @ts-ignore
// import * as api from "_api/system/partManager";

import QuickDate from '_c/getDate/dateget';
import SelectSupplier from "./components/selectSupplier.vue";
@Component({
    components: {
        QuickDate,
        SelectSupplier
    }
})
export default class PlannedPurchaseOrder extends Vue {
    private split1:number = 0.2
    //左侧表格高度
    private leftTableHeight:number = 0;
    //右侧表格高度
    private rightTableHeight:number = 0;

    // 快速查询订单状态
    private purchaseType:string = "";
    // 快速查询订单状态选项
    private purchaseTypeArr:Array<Option> = [
        {
            'label':'所有',
            'value':0
          },
          {
            'label':'草稿',
            'value':1
          },
          {
            'label':'审批中',
            'value':2
          },
          {
            'label':'已审批',
            'value':3
          },
          {
            'label':'已完成',
            'value':4
          },
          {
            'label':'不通过',
            'value':5
          },
          {
            'label':'已作废',
            'value':6
          },
    ]

    // 采购订单列表——被选中行
    private selectTableRow:any = null;

    // 采购订单列表
    private purchaseOrderTable = {
        loading: false,
        columns: [
            {
              title: '序号',
              minWidth: 50,
              key:'id'
            },
            {
              title: '状态',
              key: 'venderSkuNo',
              minWidth: 70
            },
            {
              title: '供应商',
              key: 'name',
              minWidth: 170
            },
            {
              title: '创建日期',
              key: 'address',
              minWidth: 120
            },
            {
              title: '创建人',
              key: 'isCycle',
              minWidth: 140
            },
            {
              title: '计划员',
              key: 'salesPrice',
              minWidth: 120
            },
            {
              title: '计划单号',
              key: 'disable',
              minWidth: 200
            },
            {
              title: '提交人',
              key: 'remark',
              minWidth: 100
            },
            {
              title: '提交日期',
              align:'center',
              key: 'qualitySourceName',
              minWidth: 170
            },
            {
              title: '打印次数',
              key: 'categoryName',
              minWidth: 170
            }
        ],
        tbdata: new Array(),
        page: {
            num: 1,
            size: 10,
            total: 0
        }
    }

    // 票据类型
    private pjTypes:Array<Option> = [
        {label: '增票', value: '0'},
        {label: '普票', value: '1'},
        {label: '收据', value: '2'},
    ];
    // 结算方式
    private settleMethods:Array<Option> = [
        {label: '现结', value: '0'},
        {label: '月结', value: '1'},
    ];
    // 入库仓
    private inStores:Array<Option> = [];
    // 直发门店
    private putStores:Array<Option> = [];

    // 采购订单信息——表单
    private formPlan = {
        supplier: "", // 供应商
        purchaser: "", // 采购员
        billType: "0", // 票据类型
        settlement: "",  // 结算方式
        warehouse: "", // 入库仓
        orderDate: "", // 订货日期
        estimatedArrivalDate: "", // 预计到货日期
        mark: "", // 备注
        sendStore: "", // 直发门店
        orderId: "", // 订单号
    }
    private rulePlan:ruleValidate = {
        supplier: [{ required: true, message: '供应商不能为空', trigger: 'blur' }],
        purchaser: [{ required: true, message: '采购员不能为空', trigger: 'blur' }],
        billType: [{required: true, message: "请选票据类型", trigger: "change"}],
        settlement: [{required: true, message: "请选择结算方式", trigger: "change"}],
        warehouse: [{required: true, message: "请选择入库仓", trigger: "change"}],
        orderDate: [{required: true, message: "请选择订货日期", trigger: "change"}],
    }

    // 采购订单表格数据
    private tableData:Array<any> = [{id:1,num:0,price:0},{id:2,num:0,price:0},];

    // 采购订单列表-翻页
    private purchaseOrderTableChangePage(p:number) {
        this.purchaseOrderTable.page.num = p;
    }

    // 采购订单列表-修改页码
    private purchaseOrderTableChangeSize(size:number) {
        this.purchaseOrderTable.page.num = 1;
        this.purchaseOrderTable.page.size = size;
    }

    // 快速查询日期
    private getDataQuick(v:Array<string>) {
        console.log(v);
    }

    // 更多
    private more() {}

    // 新增
    private addPro() {}

    // 保存
    private saveHandle() {}

    // 提交
    private submit() {}

    // 废弃
    private abandoned() {}

    // 打印
    private print() {}

    // 费用登记
    private expenseReg() {}

    //表格单选选中
    private selectTabelData(v:any) {
        this.selectTableRow = v
    }

    private editActivedEvent ({ row, column }, event) {
      //console.log(`打开 ${column.title} 列编辑`)
    }

    private editClosedEvent ({ row, column }, event) {
      //console.log(row,event,column)
      //console.log(`关闭 ${column} 列编辑`)
    }

    // 底部合计
    private addFooter({ columns, data }){
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['num', 'price'].includes(column.property) || columnIndex === 8) {
            return this.sum(data,column.property, columnIndex)
          }
          return null
        })
      ]
    }
    // 合计
    private sum(data,type,columnIndex){
      let total = 0
      data.map(item => {
        let value = item[type]
        if(!value){
          value = 0
        }
        total+=parseFloat(value)
      })
      if(type=='price'){
        return total.toFixed(2);
      }
      if(columnIndex === 8) {
        let totals = 0;
        let sumarr = data.map(el => {
          return el.num * el.price;
        })
        totals = sumarr.reduce((total, el) => total += el, 0);
        return totals.toFixed(2);
      }
      return total
    }

    // 选择供应商
    private addSuppler(){
      let selectSupplier:any = this.$refs.selectSupplier;
      selectSupplier.init();
    };

    private mounted() {
        this.$nextTick(()=>{
          let paneLeft:any = this.$refs.paneLeft;
          let planForm:any = this.$refs.planForm;
          let planBtn:any = this.$refs.planBtn;
          let wrapH = paneLeft.offsetHeight;
          let planFormH = planForm.offsetHeight;
          let planBtnH = planBtn.offsetHeight;
          // let planPageH = this.$refs.planPage.offsetHeight;
          //获取左侧侧表格高度
          this.leftTableHeight = wrapH-70;
          //获取右侧表格高度
          this.rightTableHeight = wrapH-planFormH-planBtnH-65;
        })
    }
}