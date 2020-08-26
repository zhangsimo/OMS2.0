import { getfindTypeList, getSupplierList } from "_api/purchasing/purchasePlan";
import {
  getParamsBrand,
  getAllBrand,
  getCarClassifys,
  getCarPartName
} from "_api/system/partsExamine/partsExamineApi";
import * as api from "_api/procurement/plan";
export const mixSelectSupplier = {
  data() {
    return {
      params: "",
      loading: false,
      treeLoading: false,

      searchPartLayer: false, //配件名称查询层
      fullName: "", //供应商名称
      code: "", //编码
      contactorTel: "", //电话
      isDisable: false, //显示禁用

      treeData: [], //供应商分类树形数据
      //供应商名称查询层表头
      columnsPart: [
        {
          title: "序号",
          width: 50,
          type: "index"
        },
        {
          title: "供应商名称",
          key: "fullName",
          minWidth: 200,
          tooltip: true,
        },
        {
          title: "编码",
          key: "code",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "简称",
          key: "shortName",
          minWidth: 100
        },
        {
          title: "状态",
          key: "isDisable",
          minWidth: 70,
          render:(h,p) => {
            let text = p.row.isDisable===1?"禁用":"有效"
            return h('span',text)
          }
        },
        {
          title: "联系人",
          key: "contactor",
          minWidth: 70
        },
        {
          title: "联系人手机号",
          key: "contactorTel",
          minWidth: 150
        },
        {
          title: "业务员",
          key: "salesman",
          minWidth: 70
        },
        {
          title: "业务员电话",
          key: "salesmanTel",
          minWidth: 150
        },
        {
          title: "票据类型",
          key: "billTypeName",
          minWidth: 70
        },
        {
          title: "结算方式",
          key: "settTypeName",
          minWidth: 70
        },
        {
          title: "是否内部供应商",
          key: "belongSystem",
          minWidth: 120,
          render:(h,p) => {
            let belong = p.row.belongSystem?JSON.parse(p.row.belongSystem):"";
            return h('span',belong.value===2?"是":"否")
          }
        },
        {
          title: "优势品牌/产品",
          key: "advantageCarbrandId",
          minWidth: 120
        }
      ],
      ArrayList: [],
      //配件名称查询层配件数据
      partData: [],
      //配件数据选中的数据
      selectTableItem: {},
      //树形选中数据
      selectTreeItem: {},
      //分页obj
      page: {
        num: 1,
        size: 20,
        total: 0
      }
    };
  },
  mounted() {},
  methods: {
    //获取供应商分类
    getfindTypeListFun() {
      this.treeLoading = true;
      getfindTypeList({}).then(res => {
        this.treeLoading = false;
        this.treeData = res.data || [];
      });
    },

    getList() {
      this.loading = true;
      let req = {};
      if (this.fullName.trim()) {
        req.fullName = this.fullName.trim();
      }
      if (this.code.trim()) {
        req.code = this.code.trim();
      }
      if (this.contactorTel.trim()) {
        req.contactorTel = this.contactorTel.trim();
      }
      if (this.selectTreeItem) {
        req.supplierTypeFirst = this.selectTreeItem.id;
      }
      // req.isDisabled = this.isDisable ? 1 : 0;

      req.page = this.page.num - 1;
      req.size = this.page.size;
      this.params = req;
      this.getNameList();
    },
    getNameList() {
      this.ArrayList = [];
      api.getSupplier(this.params).then(res => {
        this.loading = false;
        this.partData = res.data.content || [];
        this.page.total = res.data.totalElements;
        // console.log(res.data, "res =>135");
        for (var i = 0; i < res.data.length; i++) {
          this.ArrayList.push(res.data[i].fullName);
        }
        // console.log(this.ArrayList, "this.ArrayList");
        this.$emit("func", this.ArrayList);
      });
    },
    search() {
      this.page.num=1
      this.getList();
    },
    //系统分类树形节点点击数据
    selectTree(v) {
      if (v.length > 0) {
        this.selectTreeItem = v[0];
        this.getList();
      }
    },
    //显示层
    init() {
      this.selectTableItem = null;
      this.searchPartLayer = true;
      this.getList();
      this.getfindTypeListFun();
      this.$nextTick(()=>this.$refs.focusInput.focus());
    },
    //配件表格点击的行
    selectTabelData(v) {
      this.selectTableItem = v;
    },
    dblclick(v){
      this.selectTableItem = v;
      this.throwData();
    },
    throwData() {
      if (!this.selectTableItem) {
        return this.$Message.error("请选择供应商");
      }
      this.$emit("selectSupplierName", this.selectTableItem);
      this.searchPartLayer = false;
      // console.log(this.selectTableItem)
    },
    //分页
    changePage(p) {
      this.page.num = p;
      this.getList();
    },
    changeSize(size) {
      this.page.num = 1;
      this.page.size = size;
      this.getList();
    }
  }
};
