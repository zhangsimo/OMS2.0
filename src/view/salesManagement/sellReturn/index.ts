import { Vue, Component } from "vue-property-decorator";
// @ts-ignore
// import * as api from "_api/system/partManager";

import QuickDate from '_c/getDate/dateget';
import SelectTheCustomer from '../commonality/SelectTheCustomer'
import SalesOutbound from './components/SalesOutbound.vue';
import MoreSearch from './components/MoreSearch.vue';
import ReturnTreasury from './components/ReturnTreasury.vue';
@Component({
    components: {
        QuickDate,
      SelectTheCustomer,
        SalesOutbound,
        MoreSearch,
        ReturnTreasury,
    }
})
export default class SellReturn extends Vue {
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
            'label':'待入库',
            'value':2
          },
          {
            'label':'已入库',
            'value':3
          },
          {
            'label':'已作废',
            'value':4
          },
    ]

    // 销售退货订单列表——被选中行
    private selectTableRow:any = null;

    // 销售退货订单列表
    private sellOrderTable = {
        loading: false,
        columns: [
            {
              title: '序号',
              minWidth: 50,
              key:'id'
            },
            {
              title: '状态',
              key: 'status',
              minWidth: 70
            },
            {
              title: '客户',
              key: 'name',
              minWidth: 170
            },
            {
              title: '退货日期',
              key: 'sellDate',
              minWidth: 120
            },
            {
              title: '退货员',
              key: 'sellPerson',
              minWidth: 120
            },

            {
              title: '退货单号',
              key: 'disable',
              minWidth: 200
            },
            {
              title: '打印次数',
              key: 'printNum',
              minWidth: 120
            },
            {
              title: '创建人',
              key: 'createPerson',
              minWidth: 100
            },
            {
              title: '创建日期',
              align:'center',
              key: 'createDate',
              minWidth: 170
            },
            {
              title: '提交人',
              key: 'submitPerson',
              minWidth: 100
            },
            {
              title: '提交日期',
              align:'center',
              key: 'submitDate',
              minWidth: 170
            },

        ],
        tbdata: new Array(),
        page: {
            num: 1,
            size: 10,
            total: 0
        }
    }

    // 退货原因
    private thTypes:Array<Option> = [
        {label: '质量有问题', value: '0'},
        {label: '买错零件', value: '1'},
        {label: '录入错误', value: '2'},
        {label: '供应商发错', value: '3'},
        {label: '技术判断错误', value: '4'},
        {label: '其他', value: '5'},
        {label: '跨月发货', value: '6'},
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

    // 销售退货订单信息——表单
    private formPlan = {
        supplier: "", // 客户
        purchaser: "", // 销售退货员
        ReturnType: "", // 退货原因类型
        settlement: "",  // 结算方式
        warehouse: "", // 入库仓
        orderDate: "", // 订货日期
        estimatedArrivalDate: "", // 预计到货日期
        mark: "", // 备注
        sendStore: "", // 直发门店
        orderId: "", // 订单号
        returnId:""//退货单号
    }
    private rulePlan:ruleValidate = {
        supplier: [{ required: true, message: '客户不能为空', trigger: 'blur' }],
        purchaser: [{ required: true, message: '退货员不能为空', trigger: 'blur' }],
        orderDate: [{required: true, message: "请选择订货日期", trigger: "change"}],
        ReturnType: [{required: true, message: "请选退货原因", trigger: "change"}],
        settlement: [{required: true, message: "请选择结算方式", trigger: "change"}],
        warehouse: [{required: true, message: "请选择入库仓", trigger: "change"}],

    }

    // 销售退货订单表格数据
    private tableData:Array<any> = [{id:1,num:0,price:0},{id:2,num:0,price:0},];

    // 销售退货订单列表-翻页
    private sellOrderTableChangePage(p:number) {
        this.sellOrderTable.page.num = p;
    }

    // 销售退货订单列表-修改页码
    private sellOrderTableChangeSize(size:number) {
        this.sellOrderTable.page.num = 1;
        this.sellOrderTable.page.size = size;
    }

    // 快速查询日期
    private getDataQuick(v:Array<string>) {
        console.log(v);
    }

    // 新增
    private addPro() {}

    // 保存
    private saveHandle() {}

    // 提交
    private submit() {}
    //退货入库

    private ReturnTreasury() {}
    // 废弃
    private abandoned() {}

    // 打印
    private print() {}

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
    //显示客户资料
    private CustomerShowModal(){
      this.$refs.selectTheCustomer.openModel()
    }

    // 显示和初始化弹窗(选择供应商 销售退货金额填写 收货信息 更多)
    private showModel(name) {
      let ref:any = this.$refs[name];
      ref.init();
    }

    // 调节大小
     private getDomHeight() {
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
        this.rightTableHeight = wrapH-planFormH-planBtnH-38;
      })
    }

    private mounted() {
      setTimeout(()=>{
        this.getDomHeight();
      },0);
    }
}
