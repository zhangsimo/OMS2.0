import {getfindTypeList,getSupplierList,findForAllot} from "_api/purchasing/purchasePlan";
import {getAllBrand,getCarClassifys,getCarPartName} from "_api/system/partsExamine/partsExamineApi";

export const mixSelectSupplier ={
  data(){
    return {
      loading:false,
      treeLoading:false,

      searchPartLayer:false,//配件名称查询层
      fullName:'',//供应商名称
      code:'',//编码
      contactorTel:'',//电话
      isDisable:false,//显示禁用

      treeData:[],//供应商分类树形数据
      //供应商名称查询层表头
      columnsPart:[
        {
          title: '序号',
          width: 50,
          type:'index'
        },
        {
          title: '供应商名称',
          key: 'fullName',
          minWidth: 200,
        },
        {
          title: '编码',
          key: 'code',
          minWidth: 200,
        },
        {
          title: '简称',
          key: 'shortName',
          minWidth: 100,
        },
        {
          title: '状态',
          key: 'groupName',
          minWidth: 70,
        },
        {
          title: '联系人',
          key: 'contactor',
          minWidth: 70,
        },
        {
          title: '联系人手机号',
          key: 'contactorTel',
          minWidth: 150,
        },
        {
          title: '业务员',
          key: 'salesman',
          minWidth: 70,
        },
        {
          title: '业务员电话',
          key: 'salesmanTel',
          minWidth: 150,
        },
        {
          title: '票据类型',
          key: 'billTypeName',
          minWidth: 70,
        },
        {
          title: '结算方式',
          key: 'settTypeName',
          minWidth: 70,
        },
        {
          title: '是否内部供应商',
          key: 'isSupplier',
          minWidth: 120,
        },
        {
          title: '优势品牌/产品',
          key: 'advantageCarbrandId',
          minWidth: 120,
        },
      ],
      //配件名称查询层配件数据
      partData:[],
      //配件数据选中的数据
      selectTableItem:{},
      //树形选中数据
      selectTreeItem:{},
      //分页obj
      page: {
        num: 1,
        size: 20,
        total: 0
      },
    }
  },
  mounted(){

  },
  methods:{
    //获取供应商分类
    getfindTypeListFun(){
      this.treeLoading = true
      getfindTypeList({}).then(res => {
        this.treeLoading = false
        this.treeData = res.data||[]
      })
    },

    getList(){
      this.loading = true
      let req = {}
      if(this.fullName.trim()){
        req.fullName = this.fullName.trim()
      }
      if(this.code.trim()){
        req.code = this.code.trim()
      }
      if(this.contactorTel.trim()){
        req.contactorTel = this.contactorTel.trim()
      }
      if(this.selectTreeItem){
        req.supplierTypeFirst = this.selectTreeItem.id
      }
      req.isDisabled = this.isDisable?1:0

      req.page = this.page.num
      req.size = this.page.size
      findForAllot(req).then(res => {
        this.loading = false;
        this.partData = res.data||[];
        this.page.total = res.data.total
      })
    },
    search(){
      //this.page.num=1
      this.getList()
    },
    //系统分类树形节点点击数据
    selectTree(v){
      if(v.length>0){
        this.selectTreeItem = v[0];
        this.getList();
      }
    },
    //显示层
    init(){
      this.searchPartLayer = true;
      this.getList();
      this.getfindTypeListFun();
    },
    //配件表格点击的行
    selectTabelData(v){
      this.selectTableItem = v
    },
    throwData(){
      this.$emit('selectSupplierName',this.selectTableItem);
      this.searchPartLayer = false;
      // console.log(this.selectTableItem)
    },
    //分页
    changePage(p) {
      this.page.num = p
      this.getList()
    },
    changeSize(size) {
      this.page.num = 1
      this.page.size = size
      this.getList()
    },
  }
}
