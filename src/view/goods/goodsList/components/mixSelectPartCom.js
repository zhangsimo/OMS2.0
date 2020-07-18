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
          minWidth: 120
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
      params.page = this.page.num - 1;
      params.size = this.page.size;
      data.typeId = this.selectTreeItem.typeId;
      if (this.selectBrand && this.selectBrand !== "9999") {
        data.partBrandId = this.selectBrand;
      }
      const qurry = this.partName.trim();
      if(qurry.length > 0) {
        data.partCode = qurry;
      }
      if(this.formPlanmain && this.formPlanmain.guestId) {
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
      this.getPartBrandAll();
      this.getCarClassifysFun();
      this.getList();
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
      this.$refs.partInfo.saveFlag = false;
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
