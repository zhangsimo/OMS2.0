import {
    getAllBrand,
    getCarClassifys,
    savePartInfo
  } from "_api/system/partsExamine/partsExamineApi";
  import { getwbParts } from "@/api/system/priceManage";
  import { getDetails } from "@/api/salesManagment/salesOrder";
  import { getCarPartClass } from "_api/parts";
  
  export const mixSelectPartCom = {
    props:["partTable"],
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
            title: "内码",
            key: "code",
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
            title: "编码",
            key: "partCode",
            minWidth: 120
          },
          {
            title: "名称",
            key: "partStandardName",
            minWidth: 120
          },
          {
            title: "全称",
            key: "fullName",
            minWidth: 240
          },
          {
            title: "OEM码",
            key: "oeCode",
            minWidth: 120
          },
          {
            title: "产地",
            key: "placeOfOrigin",
            minWidth: 120
          },
          {
            title: "单位",
            key: "minUnit",
            minWidth: 120
          },
          {
            title: "规格",
            key: "specifications",
            minWidth: 120,
            render:(h,p) => {
              return h('span',p.row.specifications||p.row.spec)
            }
          },
          {
            title: "型号",
            key: "brandName",
            minWidth: 120,
            render:(h,p) => {
              return h('span',p.row.brandName||p.row.carModelName)
            }
          },
          {
            title: "品牌车型",
            key: "adapterCarModel",
            minWidth: 120,
            render:(h,p) => {
              return h('span',p.row.adapterCarModel||p.row.carBrandName)
            }
          },
          {
            title: "一级分类",
            minWidth: 120,
            render: (h, params) => {
              let text = '';
              try {
                text = params.row.baseType.firstType.typeName
              } catch(e) {}
              return h('span', text||params.row.carTypef);
            }
          },
          {
            title: "二级分类",
            minWidth: 120,
            render: (h, params) => {
              let text = ''
              try {
                text = params.row.baseType.secondType.typeName
              } catch(e) {}
              return h('span', text||params.row.carTypes);
            }
          },
          {
            title: "备注",
            key: "remark",
            minWidth: 120
          },
          {
            title: "状态",
            minWidth: 80,
            render: (h, params) => {
              let text = params.row.isDisabled ? "禁用" : "启用";
              return h("span", text);
            }
          },
          {
            title: "禁售",
            minWidth: 80,
            render: (h, params) => {
              let text = params.row.isSale ? "禁售" : "可售";
              return h("span", text);
            }
          },
          {
            title: "生产厂家",
            key: "manufactor",
            minWidth: 120
          }
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
        searchType: "fullName",
        searchTypeArr: [
          {
            value: "partCode",
            label: "编码"
          },
          {
            value: "fullName",
            label: "名称"
          },
          {
            value: "adapterCarModels",
            label: "车型"
          },
          {
            value: "keyWord",
            label: "拼音"
          }
        ],
        //查询关键字
        searchValue: "",
        //所有配件品牌
        selectBrand: "9999",
        partBrandData: [
          {
            label: "全部",
            value: "9999"
          }
        ],
        //获取点击的数据
        allList: {},
        apiDataId:""
      };
    },
    mounted() {},
    methods: {
      //初始化数据
      getList() {
        this.loading = true;
        let params = {};
        let req = {};
        if (this.selectTreeItem.id) {
          params.typeId = this.selectTreeItem.typeId;
        }
        if (this.selectBrand && this.selectBrand != "9999") {
          params.partBrandId = this.selectBrand;
        }
          params.partCode = this.partName;
        params.page = this.page.num - 1;
        params.size = this.page.size;
        params.strategyId=this.apiDataId;
        getwbParts(params, req).then(res => {
          this.loading = false;
          this.partData = res.data.content || [];
          this.page.total = res.data.totalElements;
        });
      },
  
      //获取配件品牌
      getPartBrandAll() {
        getAllBrand({ page: 1, pageSize: 1000 }).then(res => {
          let filterData = res.data.content.filter(
            item => item.qualityCode == "000070" || item.qualityCode == "000071"
          );
          if (filterData.length > 0) {
            if (filterData[0].children && filterData[0].children.length > 0) {
              filterData[0].children.map(item => {
                let objData = {};
                objData.label = item.name;
                objData.value = item.code;
                this.partBrandData.push(objData);
              });
            }
          }
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
        treeData.map(item => {
          item.title = item.typeName;
          if (item.children && item.children.length > 0) {
            item.children = this.resetData(item.children);
          }
        });
        return treeData;
      },
  
      search() {
        this.page.num = 1;
        this.getList();
        this.partName=""
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
        this.getPartBrandAll();
        this.getCarClassifysFun();
      },
      //配件表格点击的行
      selectTabelData(v) {
        this.selectTableItem = v;
      },
      throwData() {
        if (this.selectTableItem.length > 0) {
          this.selectTableItem = this.selectTableItem.map(el => {
            el.orgid = el.id;
            return el;
          })
          this.$emit("selectPartName", this.selectTableItem);
        }else if(this.partTable.indexOf(this.selectTableItem)!=-1){
          this.$Message.error("配件已存在")
        } else {
          this.$Message.error("请选择数据");
        }
      },
      cancel() {
        this.searchPartLayer = false;
        this.partData = [];
        this.page.total =10;
        this.partBrandData=[]
        this.treeData = [];
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
          this.$Message.success("保存成功！");
          this.reload();
        });
      }
    }
  };
  