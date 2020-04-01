import {
  getAllBrand,
  getCarClassifys,
  savePartInfo
} from "_api/system/partsExamine/partsExamineApi";
import { getwbParts } from "_api/system/partManager";
import {
  getCarPartClass,
  getCarParts
} from "../../../../api/purchasing/purchasePlan";

export const mixSelectPartCom = {
  inject: ["reload"],
  data() {
    return {
      loading: false,
      treeLoading: false,

      searchPartLayer: false, //配件名称查询层
      partName: "", //配件名称查询名字
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
          minWidth: 80
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
          title: "品质",
          key: "quality",
          minWidth: 120
        },
        {
          title: "品牌",
          key: "partBrand",
          minWidth: 120
        },
        {
          title: "OEM码",
          key: "oemCode",
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
          title: "三级分类",
          key: "carTypet",
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
        size: 20,
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
      ]
    };
  },
  props: {
    formPlanmain: Object
  },
  mounted() {},
  methods: {
    // 初始化数据
    getList() {
      this.loading = true;
      let data = {};
      let params = {}
      params.page = this.page.num;
      params.size = this.page.size;
      if (this.selectTreeItem.id) {
        data.typeId = this.selectTreeItem.id;
      }
      if (this.selectBrand && this.selectBrand !== "9999") {
        data.partCodes = [];
        data.partBrandCodes = [this.selectBrand];
      }
      const qurry = this.partName.trim();
      if(qurry.length > 0) {
        switch (this.searchType) {
          case "0":
            data.partCode = qurry;
            break;
          case "1":
            data.fullName = qurry;
            break;
          case "2":
            data.adapterCarModels = [qurry];
            break;
          case "3":
            data.pinyin = qurry;
            break;
          default:
            break;
        }
      }
      if(this.formPlanmain&&this.formPlanmain.guestId) {
        params.guestId = this.formPlanmain.guestId
      }
      getCarParts({data:data,params:params}).then(res => {
        this.loading = false;
        this.partData = res.data.content || [];
        this.page.total = res.data.totalElements;
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
        // let filterData = res.data.content.filter(
        //   item => item.quality == "品牌件"
        // );
        // if (filterData.length > 0) {
        //   if (filterData[0].children && filterData[0].children.length > 0) {
        //     filterData[0].children.map(item => {
        //       let objData = {};
        //       objData.label = item.name;
        //       objData.value = item.code;
        //       this.partBrandData.push(objData);
        //     });
        //   }
        // }
      });
    },
    //获取系统分类
    getCarClassifysFun() {
      this.treeLoading = true;
      let req = {
        page:1,
        pageSize:500
      }
      getCarPartClass(req).then(res => {
        this.treeLoading = false;
        if(res.code==0){
          this.treeData = this.resetData(res.data.content || []);
          // //默认选中第一个
          // if(this.treeData.length>0){
          //   this.treeData[0].selected = true
          //   this.selectTreeItem = this.treeData[0];
          // }
          this.getList();
        }
      });
    },
    //树形数组递归加入新属性
    resetData(treeData) {
      treeData.map((item,index) => {
        item.title = item.typeName;
        item.selected = false
        if (item.children && item.children.length > 0) {
          item.children = this.resetData(item.children);
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
        this.getList();
      }
    },
    //显示层
    init() {
      this.searchPartLayer = true;
      this.partName = "";
      // this.getList();
      this.getPartBrandAll();
      this.getCarClassifysFun();
    },
    //配件表格点击的行
    selectTabelData(v) {
      this.selectTableItem = v;
    },
    throwData() {
      // console.log(this.selectTableItem);
      if (this.selectTableItem.length > 0) {
        this.$emit("selectPartName", this.selectTableItem);
        this.searchPartLayer = false;
      } else {
        this.$Message.error("请选择数据");
      }
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
      obj.auditSign = 0;
      savePartInfo(obj).then(res => {
        if(res.code == 0) {
          this.$Message.success("保存成功！");
          this.reload();
        }
      });
    }
  }
};
