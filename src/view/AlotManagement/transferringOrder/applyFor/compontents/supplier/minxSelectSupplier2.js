import {
  getfindTypeList,
  getSupplierList,
  findForAllot,
  transferringFindForAllot
} from "_api/purchasing/purchasePlan";
import {
  getAllBrand,
  getCarClassifys,
  getCarPartName
} from "_api/system/partsExamine/partsExamineApi";

export const mixSelectSupplier2 = {
  data() {
    return {
      ArrayList: [],
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
          title: "机构简称",
          key: "shortName",
          width: 200,
          tooltip: true,
        },
        {
          title: "编码",
          key: "code",
          width: 100,
          tooltip: true,
        },
        {
          title: "状态",
          key: "groupName",
          minWidth: 70,
          render:(h,p) => {
            return h('span',p.row.isDisabled===0?'启用':'禁用');
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
          title: "机构全称",
          key: "name",
          minWidth: 200
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
          key: "isSupplier",
          minWidth: 120
        },
        {
          title: "优势品牌/产品",
          key: "advantageCarbrandId",
          minWidth: 120
        }
      ],
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
  // mounted() {
  //   this.getList();
  // },
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
        req.name = this.fullName.trim();
      }
      if (this.code.trim()) {
        req.code = this.code.trim();
      }
      if (this.contactorTel.trim()) {
        req.tel = this.contactorTel.trim();
      }
      if (this.selectTreeItem) {
        req.supplierTypeFirst = this.selectTreeItem.id;
      }
      req.isDisabled = this.isDisable ? 1 : 0;

      req.page = this.page.num -1;
      req.size = this.page.size;
      transferringFindForAllot(req).then(res => {
        // console.log(res.data.content, "res =>138");
        this.loading = false;
        this.partData = res.data.content || [];
        // this.partData = this.partData.filter((item) => {
        //   return item.id!=this.$store.state.user.userData.shopId
        // })
        this.page.total = res.data.totalElements;
        const { content } = res.data;
        // console.log(content, "content ==>146");
        content.forEach(item => {
          this.ArrayList.push(item.fullName);
        });
        //   向父组件传值
        // this.$emit("getArray", this.ArrayList);
      });
    },
    search() {
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
      this.searchPartLayer = true;
      this.getList();
      this.getfindTypeListFun();
      this.$nextTick(()=>this.$refs.focusInput.focus())
    },
    //配件表格点击的行
    selectTabelData(v) {
      this.selectTableItem = v;
    },
    throwData() {
      this.$emit("selectSupplierName", this.selectTableItem);
      this.searchPartLayer = false;
      // console.log(this.selectTableItem)
    },
    dblclick(){
      this.throwData();
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
