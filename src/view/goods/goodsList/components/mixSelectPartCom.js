import {
  getAllBrand,
  getCarClassifys,
  savePartInfo
} from "_api/system/partsExamine/partsExamineApi";
import { getwbParts } from "_api/system/partManager";
import {
  getCarParts
} from "../../../../api/purchasing/purchasePlan";

import { getCarPartClass } from "_api/parts";

export const mixSelectPartCom = {
  inject: ["reload"],
  data() {
    return {
      routeName:"",
      loading: false,
      treeLoading: false,

      searchPartLayer: false, //配件名称查询层
      partName: "", //配件名称查询名字
      partId: "",
      partCode: "",
      oemCode: "",
      showDisabled:false,//显示禁用
      treeData: [], //系统分类树形数据

      //查询选择

      //配件名称查询层表头
      columnsPart: [
        {
          title: "序号",
          width: 50,
          type: "index"
        },
        {
          title: "序号",
          type: "selection",
          minWidth: 50
        },
        {
          title: "配件内码",
          key: "partInnerId",
          minWidth: 120
        },
        {
          title: "配件编码",
          key: "partCode",
          minWidth: 120
        },
        {
          title: "配件名称",
          key: "partName",
          minWidth: 120
        },
        {
          title: "品牌车型",
          key: "carModelName",
          minWidth: 120
        },
        {
          title: "品牌",
          key: "partBrand",
          minWidth: 120,
          filters: [],
          filterMethod(value, row) {
            if(!value){
              return !row.partBrand
            }
            if(row.partBrand){
              return row.partBrand.indexOf(value) > -1;
            }else{
              return false
            }
          }
        },
        {
          title: "OEM码",
          key: "oemCode",
          minWidth: 120
        },
        {
          title: "品质",
          key: "quality",
          minWidth: 120
        },
        {
          title: "规格",
          key: "spec",
          minWidth: 80
        },
        {
          title: "型号",
          key: "brandName",
          minWidth: 120
        },
        {
          title: "单位",
          key: "unit",
          minWidth: 80
        },
        {
          title: "一级分类",
          key: "carTypef",
          minWidth: 120
        },
        {
          title: "二级分类",
          key: "carTypes",
          minWidth: 120
        },
        {
          title: "生产厂家",
          key: "carBrandName",
          minWidth: 120
        },
        {
          title: "配件全称",
          key: "fullName",
          minWidth: 180
        },

      ],
      //配件名称查询层配件数据
      partData: [],
      //配件数据选中的数据
      selectTableItem: [],
      //树形选中数据
      selectTreeItem: {},
      //分页obj
      page: {
        num: 1,
        size: 10,
        total: 0
      },
      //配件查询分类
      searchType: '1',
      searchTypeArr: [
        {
          value: "0",
          label: "编码"
        },
        {
          value: "1",
          label: "名称"
        },
        {
          value: "2",
          label: "车型"
        }
      ],
      //查询关键字
      searchValue: "",
      //所有配件品牌
      selectBrand: "9999",
      partBrandData: [
        {
          name: "全部",
          code: "9999"
        }
      ],
      bands: [],
    };
  },
  props: {
    formPlanmain: Object
  },
  mounted() {
    this.routeName = this.$route.name;
  },
  activated(){
    this.routeName = this.$route.name;
  },
  methods: {
    // 初始化数据
    getList() {
      this.loading = true;
      let data = {};
      let params = {}
      let boolParams=false;
      params.page = this.page.num - 1;
      params.size = this.page.size;
      data.typeId = this.selectTreeItem.typeId;
      if (this.selectBrand && this.selectBrand !== "9999") {
        data.partBrandId = this.selectBrand;
      }
      // const qurry = this.partName.trim()
      // if(qurry.length > 0) {
      //   data.partCode = qurry;
      // }
      data.name = this.partName
      data.partInnerId = this.partId
      data.partCode = this.partCode
      data.oeCode = this.oemCode.replace(/\s+/g,'');
      if(!this.partName && !this.partId && !this.partCode && !this.oemCode){
        boolParams=true
      }
      if(boolParams){
        this.$Message.error("最少有一个筛选条件")
        this.loading = false;
        return false
      }
      let formData = {};
      for (let k in data) {
        if (data[k] && data[k].trim()) {
          formData[k] = data[k];
        }
      }
      formData.isDisabled=this.showDisabled==false?0:1;
      if(this.formPlanmain && this.formPlanmain.guestId) {
        params.guestId = this.formPlanmain.guestId
      }
      getCarParts({data:formData,params:params}).then(res => {
        this.loading = false;
        this.partData = res.data.content || [];
        this.page.total = res.data.totalElements;
        this.bands = [];
        let arr = res.data.content.map(el => el.partBrand);
        let set = new Set(arr);
        set.forEach(el => {
          this.bands.push({label: el, value: el});
        })
        this.columnsPart[6].filters = this.bands;
      });
    },


    //获取配件品牌
    getPartBrandAll() {
      getAllBrand({ page: 1, pageSize: 1000 }).then(res => {
        if(!res.data){
          return
        }
        let arrData = res.data.content||[]
        arrData.map(item => {
          this.partBrandData.push(...item.children);
        })
      });
    },
    //获取系统分类
    getCarClassifysFun() {
      this.treeLoading = true;
      getCarPartClass().then(res => {
        this.treeLoading = false;
        this.treeData = res;
      });
    },
    //树形数组递归加入新属性
    resetData(treeData) {
      treeData.map((item,index) => {
        item.title = item.name;
        item.selected = false
        if (item.secendType && item.secendType.length > 0) {
          item.secendType = this.resetData(item.secendType);
        }
      });
      return treeData;
    },

    search() {
      this.page.num = 1;
      this.getList();
    },
    //系统分类树形节点点击数据
    selectTree(v) {
      if (v.length > 0) {
        this.selectTreeItem = v[0];
        this.page.num = 1;
        this.getList();
      }
    },
    //显示层
    init() {
      this.searchPartLayer = true;
      this.partName = "";
      this.partId = "";
      this.oemCode = "";
      this.partCode = "";
      // this.getPartBrandAll();
      this.getCarClassifysFun();
      this.getList();
      this.$nextTick(() => this.$refs.Input.focus());
    },
    //配件表格点击的行
    selectTabelData(v) {
      this.selectTableItem = v;
    },
    throwData() {
      // console.log(this.selectTableItem);
      if (this.selectTableItem.length > 0) {
        this.$emit("selectPartName", this.selectTableItem);
        // this.searchPartLayer = false;
        this.$Message.success("已添加");
        this.focusInput();
      } else {
        this.$Message.error("请选择数据");
      }
    },
    focus(event){
      event.currentTarget.select();
    },
    focusInput(){
      this.$nextTick(() => {
        if(this.partCode){
          this.$refs.Input.focus();
        }else if(this.partId){
          this.$refs.elinputpartId.focus();
        }else if(this.partName){
          this.$refs.elinputpartName.focus();
        }else if(this.oemCode){
          this.$refs.elinputoemCode.focus();
        }

      })
    },
    cancel() {
      this.searchPartLayer = false;
    },
    //modal 关闭事件
    CancelModal(){
      this.selectTableItem = []
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
    },
    //申请配件按钮
    applyPart() {
      this.searchPartLayer = false;
      this.$refs.partInfo.init();
    },
    //提交申请配件
    addPartFun(obj) {
      //添加未审核属性
      this.$refs.partInfo.saveFlag = false;
      obj.auditSign = 0;
      savePartInfo(obj).then(res => {
        if(res.code == 0) {
          this.$Message.success("保存成功！");
          this.reload();
        }
      });
    },
    //双击显示
    dblclick(v){
      if(this.$route.name=="salesOrder"||this.$route.name=="goodsList"||this.$route.name=="TemporaryPurchase"||this.$route.name=="OutsidePurchase" ||this.$route.name=="bookingSheet"){
        this.$refs.selectPartInfo.init(v);
      }
      // if(this.$route.name=="bookingSheet"){
      //   this.$refs.selectPartInfo2.init(v);
      // }
    },

    throwDataChangeNum(v){
      this.$emit("selectPartName2", v);
      this.focusInput();
    }
  }
};
