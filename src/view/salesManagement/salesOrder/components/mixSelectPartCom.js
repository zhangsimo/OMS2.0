import {
  getAllBrand,
  getCarClassifys,
  savePartInfo
} from "_api/system/partsExamine/partsExamineApi";
import { getwbParts,getAccessList,getWbList } from "_api/system/partManager";
import { getDetails } from "@/api/salesManagment/salesOrder";
import { getCarPartClass } from "_api/parts";

export const mixSelectPartCom = {
  inject: ["reload"],
  props:{
    guestId:'',
    keyType:'',//当key==1时表示是从移仓单来的
    storeId: ''
  },
  data() {
    return {
      bands: [],
      Name: '名称',
      loading: false,
      treeLoading: false,

      searchPartLayer: false, //配件名称查询层
      partName: "", //配件名称查询名字
      partCode: "",
      partId: "",
      oemCode: "",
      treeData: [], //系统分类树形数据
      //查询选择

      //配件名称查询层表头
      columnsPart: [
        {
          title: '序号',
          width: 50,
          type:'index'
        },
        {
          title: "序号",
          type: "selection",
          minWidth: 50
        },
        // {
        //   title: '详情',
        //   slot: 'action',
        //   width: 60,
        //   align: 'center'
        // },

        {
          title: "编码",
          key: "partCode",
          minWidth: 120
        },
        {
          title: "名称",
          key: "partStandardName",
          minWidth: 120,
          render:(h,p) => {
            return h('span',p.row.partStandardName||p.row.partName)
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
          title: "品牌",
          key: "partBrand",
          minWidth: 80,
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
          title: "品质",
          key: "quality",
          minWidth: 80
        },
        {
          title: "OEM码",
          key: "oeCode",
          minWidth: 120,
          render:(h,p) => {
            return h('span',p.row.oeCode||p.row.oemCode)
          }
        },
        {
          title: "本店可售",
          key: "outableQty",
          minWidth: 80,
        },
        {
          title: "内码",
          key: "code",
          minWidth: 120,
          render:(h,p) => {
            return h('span',p.row.code||p.row.partInnerId)
          }
        },
        {
          title: "单位",
          key: "minUnit",
          minWidth: 80,
          render:(h,p) => {
            return h('span',p.row.minUnit||p.row.unit)
          }
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
          title: "全称",
          key: "fullName",
          minWidth: 240
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
          title: "产地",
          key: "placeOfOrigin",
          minWidth: 120
        },
        {
          title: "生产厂家",
          key: "manufactor",
          minWidth: 120
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
            let text = params.row.isDisabled ? '禁用' : '启用';
            return h('span', text);
          }
        },
        // {
        //   title: "禁售",
        //   minWidth: 80,
        //   render: (h, params) => {
        //     let text = params.row.isSale ? '禁售' : '可售';
        //     return h('span', text);
        //   }
        // },

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
        // {
        //   value: "keyWord",
        //   label: "拼音"
        // }
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
      //获取点击的数据
      allList: {},
      loading1:false,
    };
  },
  mounted() {
  },
  methods: {
    //初始化数据
    getList() {
      this.loading = true;
      let req = {};
      let params = {};
      if (this.selectTreeItem.id) {
        req.typeId = this.selectTreeItem.typeId;
      }
      if (this.selectBrand && this.selectBrand != "9999") {
        req.partBrandId = this.selectBrand;
      }
      params.page = this.page.num - 1;
      params.size = this.page.size;
      if(this.keyType!=1){
        req.guestId=this.guestId;
        req.storeId=this.storeId;
        // if (this.partName.trim()) {
        //   req.partCode = this.partName.trim()
        // }
        req.partCode = this.partCode
        req.partInnerId = this.partId
        req.name = this.partName
        req.oeCode = this.oemCode.replace(/\s+/g,'');
        let formData = {};
        for (let k in req) {
          if (req[k] && req[k].trim()) {
            formData[k] = req[k];
          }
        }

        getAccessList(params, formData).then(res => {
          this.loading = false;
          this.partData = res.data.content || [];
          this.page.total = res.data.totalElements;
          this.bands = [];
          let arr = res.data.content.map(el => el.partBrand);
          let set = new Set(arr);
          set.forEach(el => {
            this.bands.push({label: el, value: el});
          })
          this.columnsPart[5].filters = this.bands;
          });
      }else if(this.keyType==1){
        req.storeId=this.storeId;

        // if (this.partName.trim()) {
        //   req.partCode = this.partName.trim();
        // }
        req.partCode = this.partCode
        req.partId = this.partId
        req.partName = this.partName
        req.oemCode = this.oemCode.replace(/\s+/g,'');
        let formData = {};
        for (let k in req) {
          if (req[k] && req[k].trim()) {
            formData[k] = req[k];
          }
        }
        getWbList(params,formData).then(res=>{
          this.loading = false;
          this.partData = res.data.content|| [];
          this.page.total = this.partData.length;
          this.bands = [];
          let arr = res.data.content.map(el => el.partBrand);
          let set = new Set(arr);
          set.forEach(el => {
            this.bands.push({label: el, value: el});
          })
          this.columnsPart[5].filters = this.bands;
        })
      }


    },

    //获取配件品牌
    getPartBrandAll() {
      getAllBrand({ page: 1, pageSize: 1000 }).then(res => {
        let arrData = res.data.content || []
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
      if(!this.storeId){
        return this.$Message.warning("请选择交货仓库")
      }
      this.searchPartLayer = true;
      this.allList = {};
      // this.getList();
      // this.getPartBrandAll();
      this.getCarClassifysFun();
      this.$nextTick(() => this.$refs.elinput.focus())
    },

    focus(event){
      event.currentTarget.select();
    },
    focusInput(){
      this.$nextTick(() => {
        if(this.partCode){
          this.$refs.elinput.focus();
        }else if(this.partId){
          this.$refs.elinputpartId.focus();
        }else if(this.partName){
          this.$refs.elinputpartName.focus();
        }else if(this.oemCode){
          this.$refs.elinputoemCode.focus();
        }

      })
    },


    //配件表格点击的行
    selectTabelData(v) {
      this.selectTableItem = v;
    },
    throwData() {
      if (this.selectTableItem.length > 0) {
        let item = this.selectTableItem;
        this.$emit("selectPartName", item);
        this.focusInput();
      } else {
        this.$Message.error("请选择数据");
      }
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
    //placeholder动态绑定值
    ChangeValue(val){
      this.Name = val.label;
    },
    //提交申请配件
    addPartFun(obj) {
      //添加未审核属性
      obj.auditSign = 0;
      savePartInfo(obj).then(res => {
        if(res.code===0){
          this.$Message.success("保存成功！")
          // this.reload();
          this.$refs.partInfo.proModal = false;
          this.$refs.partInfo.btnIsLoadding = false;
        }
        this.$refs.partInfo.saveFlag = false
        // this.$Message.success("保存成功！");
        // this.reload();
      });
    },
    showLink(row) {
      this.partId = row.partId;
      this.$nextTick(() => {
        this.$refs.LinkPart.init();
      })
    },
    //点击详情
    show(val) {
      let data = {};
      if (val.partId) {
        data.partId = val.partId;
      } else {
        data.partId = val.id;
      }
      data.guestId = this.guestId
      data.storeId = this.storeId;
      this.loading1 = true;
      getDetails(data).then(res => {
        this.loading1 = false;
        if (res.code === 0) {
          this.allList = res.data;
          this.allList.priceLever.forEach(element => {

            element.sellPrice = parseFloat(element.sellPrice).toFixed(2);
          });
        }
      });
    },

    clickItem(v){
      this.show(v);
    },

    //双击显示
    dblclick(v){
      if(this.$route.name=="salesOrder"){
        v.partName=v.partStandardName
        v.carBrandName=v.adapterCarBrand
        this.$refs.selectPartInfo.init(v);
      } else {
        this.selectTableItem = [v];
        this.$emit("selectPartName", this.selectTableItem);
        this.focusInput();
      }
    },
    //修改数量价格选中配件
    throwDataChangeNum(v){
      this.$emit("throwPartNameList2",v);
      this.focusInput();
    }
  }
};
