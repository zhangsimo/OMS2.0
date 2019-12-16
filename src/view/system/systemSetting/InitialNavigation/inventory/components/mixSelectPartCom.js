import {getAllBrand, getCarClassifys, savePartInfo} from "_api/system/partsExamine/partsExamineApi";
import {getwbParts} from "_api/system/partManager";
import {saveList} from "@/api/system/systemSetting/inventory";


export const mixSelectPartCom = {
  inject: ['reload'],
  data() {
    return {
      loading: false,
      treeLoading: false,
      numberAmount: false, //入库信息层
      searchPartLayer: false,//配件名称查询层
      partName: '',//配件名称查询名字
      treeData: [],//系统分类树形数据
      // partId: '', // details里的id提交时传
      // code: '',//内码  提交时传
      partInfo:{}, // 存放新增配件信息
      //选择按钮表单
      formInfo: {
        partStandardName: '', //配件名称
        partCode: '',//编码
        minUnit: '',//单位
        fullName: '',//全称
        enterQty: '', //手输数量  校验
        enterPrice: '', //手输单价  校验
        enterAmt: '', //手输金额  校验
        remark: "", //手输备注
      },
      //表单校验
      ruleValidate: {
        enterQty: [
          {required: true, message: '请输入数量', trigger: 'blur'},
        ],
        enterPrice: [
          {required: true, message: '请输入单价', trigger: 'blur'},
        ],
        enterAmt: [
          {required: true, message: '请输入金额', trigger: 'blur'},
        ]
      },

      //配件名称查询层表头
      columnsPart: [
        {
          title: '序号',
          width: 50,
          type: 'index'
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
          title: "单位",
          key: "minUnit",
          minWidth: 120
        },
        {
          title: "规格",
          key: "specifications",
          minWidth: 120
        },
        {
          title: "品牌车型",
          key: "adapterCarModel",
          minWidth: 120
        },
        {
          title: "一级分类",
          minWidth: 120,
          render: (h, params) => {
            let text = '';
            try {
              text = params.row.baseType.firstType.typeName
            } catch (e) {
            }
            return h('span', text);
          }
        },
        {
          title: "二级分类",
          minWidth: 120,
          render: (h, params) => {
            let text = ''
            try {
              text = params.row.baseType.secondType.typeName
            } catch (e) {
            }
            return h('span', text);
          }
        },
        {
          title: "三级分类",
          minWidth: 120,
          render: (h, params) => {
            let text = ''
            try {
              text = params.row.baseType.thirdType.typeName
            } catch (e) {
            }
            return h('span', text);
          }
        },
        {
          title: "生产厂家",
          key: "manufactor",
          minWidth: 120
        },
        {
          title: "型号",
          key: "brandName",
          minWidth: 120
        },
        {
          title: "配件ID",
          key: "id",
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
      },
      //配件查询分类
      searchType: 'fullName',
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
          value: "applyCarModel",
          label: "车型"
        },
        {
          value: "keyWord",
          label: "拼音"
        }
      ],
      //查询关键字
      searchValue: '',
      //所有配件品牌
      selectBrand: '9999',
      partBrandData: [
        {
          "label": "全部",
          "value": "9999"
        }
      ],
    }
  },
  mounted() {

  },
  methods: {
    //初始化数据
    getList() {
      this.loading = true
      let req = {}
      if (this.selectTreeItem.id) {
        req.typeId = this.selectTreeItem.id
      }
      if (this.selectBrand && this.selectBrand != '9999') {
        req.partBrandCode = this.selectBrand
      }

      if (this.searchValue.trim()) {
        req[this.searchType] = this.searchValue.trim()
      }
      req.page = this.page.num
      req.size = this.page.size
      getwbParts(req).then(res => {
        this.loading = false;
        this.partData = res.data.content || [];
        this.page.total = res.data.totalElements
      })
    },
    //获取配件品牌
    getPartBrandAll() {
      getAllBrand({page: 1, pageSize: 1000}).then(res => {
        let filterData = res.data.content.filter(item => item.quality == '品牌件')
        console.log(filterData)
        if (filterData.length > 0) {
          if (filterData[0].children && filterData[0].children.length > 0) {
            filterData[0].children.map(item => {
              let objData = {}
              objData.label = item.name
              objData.value = item.code
              this.partBrandData.push(objData)
            })
          }
        }
      })
    },
    //获取系统分类
    getCarClassifysFun() {
      this.treeLoading = true
      getCarClassifys({page: 1, pageSize: 500}).then(res => {
        this.treeLoading = false
        this.treeData = this.resetData(res.data.content || [])
      })
    },
    //树形数组递归加入新属性
    resetData(treeData) {
      treeData.map(item => {
        item.title = item.typeName
        if (item.children && item.children.length > 0) {
          item.children = this.resetData(item.children)
        }
      })
      return treeData
    },
    search() {
      this.page.num = 1
      this.getList()
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
      this.selectTableItem = v
      // console.log(this.selectTableItem, 4544)
    },
    throwData() {
        this.$emit('selectPartName', this.selectTableItem);
        this.numberAmount = true;
    },
    cancel(){
      this.numberAmount=false
      this.formInfo={}
    },//取消
    //添加
    async addAccessories() {
      if(parseFloat(this.formInfo.enterQty)<0||parseFloat(this.formInfo.enterPrice)<0||parseFloat(this.formInfo.enterAmt)<0){
        this.$Message.error('数值不可小于0')
        return false
      }
      this.partInfo=this.mainData
      this.selectTableItem.partId=this.selectTableItem.id
      this.selectTableItem.id=''
      this.selectTableItem.taxRate=0.07
      this.selectTableItem.partName=this.selectTableItem.partStandardName
      this.selectTableItem.enterUnitId=this.selectTableItem.minUnit
      this.selectTableItem.systemUnitId=this.selectTableItem.minUnit
      this.selectTableItem.brandCode=this.selectTableItem.partBrandCode
      this.selectTableItem.partInnerId=this.selectTableItem.code
      this.selectTableItem.enterQty = parseFloat(this.formInfo.enterQty)
      this.selectTableItem.enterPrice = parseFloat(this.formInfo.enterPrice)
      this.selectTableItem.enterAmt = parseFloat(this.formInfo.enterAmt)
      this.selectTableItem.remark = this.formInfo.remark
      this.partInfo.details=[]
      this.partInfo.details.push(this.selectTableItem)

      this.$refs.formInfo.resetFields()
      let res = await saveList(this.partInfo)
      if (res.code === 0) {
        this.numberAmount=false
        this.$Message.success('保存成功，入库单的配件添加成功')
        this.$parent.getList()
        // alert('成功')
      }
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
    // //申请配件按钮
    // applyPart() {
    //   this.searchPartLayer = false;
    //   this.$refs.partInfo.init();
    // },
    // //提交申请配件
    // addPartFun(obj) {
    //   //添加未审核属性
    //   obj.auditSign = 0
    //   savePartInfo(obj).then(res => {
    //     this.$Message.success("保存成功！")
    //     this.reload();
    //   })
    // }
    // formInfo() {
    //
    // }
  }
}
