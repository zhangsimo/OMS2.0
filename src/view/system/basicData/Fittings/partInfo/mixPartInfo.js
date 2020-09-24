//适用车型，品牌及车型接口
import { getCarBrandAll, getCarModel } from "_api/system/systemSetting/Initialization";
//品牌品质，自定义分类接口
import { getAllBrand, getAllCustom } from '_api/system/partsExamine/partsExamineApi'

import { getDataDictionaryTable } from '_api/system/dataDictionary/dataDictionaryApi'

import { getCarPartClass,getAllParts,getByManyCode,getAlreadyParts,savePartChange } from "_api/parts";
import {pinyin} from "../../../../../utils/py";
export const mixPartInfo = {

  data() {
    //数字加字母校验
    const NumberA = (rule, value, callback) => {
      // 模拟异步验证效果
      let reg = /^[0-9a-zA-Z]*$/;
      if (!value) {
        callback(new Error('不能为空！'));
      } else {
        callback()
      }
    };
    return {
      btnIsLoadding: false,
      typepf: [],
      typeps: [],
      saveFlag:false,
      //car
      isCart:false,
      validRules: {
        companyNum: [{ required: true, message: "单位数量不能为空且只能是数字", trigger: "change", pattern: /^\d{1,}$/ }],
        longNum: [{ required: true, message: "长不能为空且最多保留两位小数", trigger: "change", pattern: /^\d{1,}(\.\d{1,2})?$/ }],
        wide: [{ required: true, message: "宽不能为空且最多保留两位小数", trigger: "change", pattern: /^\d{1,}(\.\d{1,2})?$/ }],
        high: [{ required: true, message: "高不能为空且最多保留两位小数", trigger: "change", pattern: /^\d{1,}(\.\d{1,2})?$/ }],
        volume: [{ required: true, message: "体积不能为空且最多保留两位小数", trigger: "change", pattern: /^\d{1,}(\.\d{1,2})?$/ }],
        weight: [{ required: true, message: "重量不能为空且最多保留两位小数", trigger: "change", pattern: /^\d{1,}(\.\d{1,2})?$/ }],
        volumeRong: [{ required: true, message: "容积不能为空且最多保留两位小数", trigger: "change", pattern: /^\d{1,}(\.\d{1,2})?$/ }],
      },
      // 选中包装规格行
      currRow: null,
      //是否禁用
      prohibit: false,
      //是否禁售
      forbidsale: false,
      //配件名称查询层
      linkModal: false,
      //配件资料层
      proModal: false,
      //自定义分类层
      customModal: false,
      //配件资料层form数据
      formValidate: {
        partTypeS: "",
        partTypeF: "",
        qualityTypeId: '',//品质
        partBrandId: '',//品牌
        code: '',//配件编码
        name: '',//配件名称
        partNameId: '',//配件id
        unitId: '',//配件单位
        oemCode: '',//oe码
        spec: '',//规格
        model: '',//型号
        carModelName: '',//适用车型name
        carBrandName: '',//车型品牌Id
        commonId: '',//通用编码
        manufacture: '',//生产厂家
        prdtPlace: '',//产地
        fullName: '',//配件全称
        customType: '',//自定义分类itemCode
        customClassName: '',//自定义分类名称
        remarks: '',//备注
        //三级分类书籍
        carTypeF: '',
        carTypeS: '',
        carTypeT: '',
        carTypefName: '',
        carTypesName: '',
        carTypetName: '',
        specVOS: [],//规格list
      },
      ruleValidate: {
        qualityTypeId: [
          { required: true, message: '配件品质不能为空', trigger: 'change' }
        ],
        partBrandId: [
          { required: true, message: '配件品牌不能为空', trigger: 'change' }
        ],
        code: [
          { required: true, validator: NumberA, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '名称不能为空', trigger: 'change' }
        ],
        unitId: [
          { required: true, message: '单位不能为空', trigger: 'change' }
        ],
        partTypeF: [
          { required: true, message: '一级分类不能为空', trigger: 'change' }
        ],
        partTypeS: [
          { required: true, message: '二级分类不能为空', trigger: 'change' }
        ],
        oemCode: [
          { required: true, validator: NumberA, trigger: 'blur' }
        ]
      },
      qualityArr: [],//所有品质
      brandArr: [],//所有品牌

      dictCodeAll: [],//所有单位
      carModelAll: [],//所有车型

      customAll: [],//自定义分类
      customClassName: '',//选中的自定义分类,判断当前高亮
      //配件资料层车型obj
      carObj: {
        carBrandData: [],
        selectCarModel: '',
        carModelData: []
      },
      //新增规格obj
      newSpecObj: {
        //计量单位
        meterCompany: '',
        //单位数量
        companyNum: 0,
        //长
        longNum: 0,
        //宽
        wide: 0,
        //高
        high: 0,
        //体积
        volume: 0,
        //重量
        weight: 0,
        //容积
        volumeRong: 0,
        //最小计量单位
        isMinCompany: 0,
        //checkbox
        checkboxsing: false
      },
      showSpe: true,//是否显示包装规格

      //tab页控制
      tabsActive:'active1',

      //适用车型
      carItemObj:{
        carBrand:"",
        carName:""
      },
      carList:[],
      code:"",
      //关联配件
      partName:"",//关联配件查询input
      levelType:[], //配件分类列表
      page:{
        num: 1,
        total: 0,
        size: 10
      },
      selectLevelFirst:"",//配件一级分类model
      selectLevelSecond:"",//配件二级分类model
      allPartLoading:false,//全部配件/左侧表格Loading
      alreadyPartLoading:false,//已关联配件表格Loading
      allPartList:[],//全部配件表格数据
      alreadyPartList:[],//已关联配件表格数据
      allPartColumns:[
        {
          title: "序号",
          type: "index",
          minWidth: 60,
          align:"center"
        },
        {
          type:"selection",
          align:"center",
          minWidth: 40
        },
        {
          title: "内码",
          key: "code",
          minWidth: 50,
          align:"center"
        },
        {
          title: "编码",
          key: "partCode",
          minWidth: 100,
          align:"center"
        },
        {
          title: "名称",
          key: "fullName",
          minWidth: 100,
          align:"center"
        },
        {
          title: "规格",
          key: "spec",
          minWidth: 100,
          align:"center"
        },
        {
          title: "品牌",
          key: "partBrandName",
          minWidth: 100,
          align:"center"
        },
        {
          title: "OEM码",
          key: "oeCode",
          minWidth: 100,
          align:"center"
        }
      ],//配件表格数据columns
      selectAllPartTab:[],//全部配件数据选中数据
      selectAlreadyPartTab:[],//已关联配件选中数据
      manyCodeModal:false,
      manyCodeInput:"",
      rules:{
        manyCode:[
          {required:true,message:"请输入多个配件编码",trigger:"blur"}
        ]
      }
    }
  },
  computed:{
    spellCode(){
      let car=""
      this.carList.map(vb => {
        let selectBrandData = this.carObj.carBrandData.filter(item => (vb.carBrand && item.erpCarBrandId == vb.carBrand));
        if (selectBrandData.length > 0) {
          car+=(selectBrandData[0].nameCn+vb.carName)
        }
      });
      let brandNameFilter = this.brandArr.filter(item => (this.formValidate.partBrandId!=undefined && item.id == this.formValidate.partBrandId))
      if (brandNameFilter.length > 0) {
        this.formValidate.partBrandName = brandNameFilter[0].name
      }
      //配件名称+品牌车型1+品牌车型2+品牌
      let str=(this.formValidate.name|| "")+(car || "")+(this.formValidate.partBrandName || "")
      let spell=pinyin.getCamelChars(str)
      return (this.formValidate.pyCode=spell)
    }
  },
  mounted(){
    //拉取适用车型品牌submit
    if(this.carObj.carBrandData.length==0){
      this.getCarBrand();
    }
    //获取所有品质
    if(this.qualityArr.length ==0){
      this.getQuiltyAndBrand();
    }
    //拉取自定义分类
    if(this.customAll.length==0){
      this.getCustomData();
    }
    //获取配件单位
    if(this.dictCodeAll.length==0){
      getDataDictionaryTable({ "dictCode": "UNIT_CODE_001" }).then(res => {
        if (res.code == 0) {
          this.dictCodeAll = res.data
        }
      })
    }
    if(this.typepf.length==0){
      this.treeInit();
    }
  },
  methods: {
    async treeInit() {
      let res = await getCarPartClass();
      this.typepf = res;
      if(this.formValidate.partTypeF) {
        this.changetype(this.formValidate.partTypeF);
      }
    },
    changetype(v) {
      let item = this.typepf.filter(el => el.typeId === v);
      if(item.length==0){
        return
      }
      this.formValidate.carTypefName = item[0].title || item[0].name;
      this.typeps = item[0].children
    },
    changetypeS(v) {
      let item = this.typeps.filter(el => el.typeId === v);
      if(item.length==0){
        return
      }
      this.formValidate.carTypesName = item[0].title || item[0].name;
    },
    // 弹框打开关闭
    visible(type) {
      if (type) {
        this.$refs.proModalForm.resetFields()
      }
    },
    //获取左侧全部配件数据接口
    async getAllPartListData(){
      this.allPartLoading = true;
      let params= {};
      let data={};
      params.tenantId = 0;
      params.page = this.page.num - 1;
      params.size = this.page.size;
      const qurry = this.partName.trim();
      if (qurry.length > 0) {
        data.partCode = qurry;
      }
      if(this.selectLevelFirst){
        if(!this.selectLevelSecond){
          data.typef = this.selectLevelFirst
          data.types = "";
        }
      }
      if (this.selectLevelSecond) {
        data.typef = this.selectLevelFirst
        data.types = this.selectLevelSecond;
      }
      let res = await getAllParts(params, data);
      if (res.code == 0) {
        this.page.total = res.data.totalElements;
        this.allPartList = res.data.content
        if(this.allPartList.length>0){  //data是请求后台返回的数据集
          for (let i = 0; i < this.allPartList.length; i++) {
            if (this.allPartList[i].isDistribution ==0 ) {//处理状态 1已处理 则勾选框禁止被勾选(置灰)
              this.allPartList[i]._disabled = true; //给满足条件的行设置 _disabled 属性
            }
          }
        }
        this.allPartLoading = false;
      }
    },
    //获取右侧已关联配件数据接口
    async getAlreadyPartsData(code){
      this.alreadyPartLoading=true
      let data={partInnerId:code};
      let res=await getAlreadyParts(data)
      if(res.code===0){
        this.alreadyPartLoading=false
        this.alreadyPartList=res.data
      }
    },
    //多编码查询接口
    async getByManyCodeFun(data){
      this.allPartLoading = true;
      let res=await getByManyCode(data)
      if (res.code == 0) {
        this.page.total = res.data.totalElements;
        this.allPartList = res.data.content
        // if(this.allPartList.length>0){  //data是请求后台返回的数据集
        //   for (let i = 0; i < this.allPartList.length; i++) {
        //     if (this.allPartList[i].isDistribution ==0 ) {//处理状态 1已处理 则勾选框禁止被勾选(置灰)
        //       this.allPartList[i]._disabled = true; //给满足条件的行设置 _disabled 属性
        //     }
        //   }
        // }
        this.allPartLoading = false;
      }
    },
    //初始化
    init(setData) {
      //清空数据重新赋值
      this.$refs.proModalForm.resetFields();
      this.carList = [];
      this.carItemObj.carName = "";
      this.carItemObj.carBrand = "";
      this.currRow = null
      this.btnIsLoadding = false;
      this.proModal = true;
      this.formValidate.specVOS=[];
      this.saveFlag = false;
      this.selectLevelFirst="";
      this.selectLevelSecond=""
      this.$refs.tabs.activeKey = 'active1'
      this.formValidate.partBrandId=null
      this.formValidate.partBrandName=""
      this.formValidate.carBrandName = ''
      this.formValidate.carModelName = ''
      this.formValidate.fullName = ''
      this.formValidate.customType = ""
      if (setData) {
        this.formValidate = setData;
        //赋值适用车型
        let carModelName = setData.carModelName.indexOf("|") > -1 ? setData.carModelName.split("|") : [setData.carModelName]; //车系
        let carBrandName = setData.carBrandName.indexOf("|") > -1 ? setData.carBrandName.split("|") : [setData.carBrandName]; //车品牌
        let arrNew = carModelName.length>carBrandName.length?carModelName:carBrandName
        arrNew.map((vItem,vindex) => {
          this.carItemObj.carBrand = carBrandName[vindex];
          this.carItemObj.carName = carModelName[vindex];
          this.carList.push({...this.carItemObj});
        });
        // this.carList.push({...this.carItemObj});
      }else{
        this.carList.push({...this.carItemObj});
      }
      //添加自定义分类名称属性
      this.formValidate.customClassName = '';
      //匹配包装规格
      if (this.formValidate.specVOS && this.formValidate.specVOS.length == 0) {
        let objData = { ...this.newSpecObj };
        objData.meterCompany = this.formValidate.unitId
        objData.checkboxsing = true
        objData.isMinCompany = 1
        this.formValidate.specVOS.push(objData)
      }
      this.firstCheckbox();

      //禁用禁售
      this.prohibit = this.formValidate.disabled == 1 ? true : false
      this.forbidsale = this.formValidate.isStopSell == 1 ? true : false
      // this.getFullName();
      //配件资料 关联配件
      this.getAllPartListData()
      this.levelType=this.$parent.treeData

      //修改根据品质获取品牌
      if (this.formValidate.qualityTypeId) {
        this.qualityGetBrand()
      }
      //修改根据一级分类匹配二级分类
      if(this.formValidate.partTypeF) {
        this.changetype(this.formValidate.partTypeF);
      }
      //修改匹配自定义分类
      if (this.formValidate.customType) {
        let newArrMap = []
        this.customAll.map(item => {
          newArrMap.push(...item.itemVOS)
        })
        let newArrFilter = newArrMap.filter(item => item.itemCode == this.formValidate.customType)
        if (newArrFilter.length > 0) {
          this.customClassName = newArrFilter[0]
          this.formValidate.customClassName = newArrFilter[0].itemName
        }
      }
    },

    //获取所有车型品牌
    getCarBrand() {
      let req = {}
      // req.page = 1;
      // req.pageSize = 500;
      getCarBrandAll(req).then(res => {
        let arrData = res.data || []
        this.carObj.carBrandData = arrData.map(item => {
          let obj = {...item};
          obj.id = item.id
          obj.nameCn = item.nameCn
          return obj
        })
        // if (this.formValidate.carBrandName) {
        //   this.getCarModelFun();
        // }
      })
    },
    //获取车型
    getCarModelFun() {
      let req = {}
      let selectBrandData = this.carObj.carBrandData.filter(item => item.id == this.formValidate.carBrandName)
      if (selectBrandData.length > 0) {
        req.nameEn = selectBrandData[0].nameEn
      }
      req.page = 1;
      req.pageSize = 1000;
      getCarModel(req).then(res => {
        let arrData = res.data.content || {}
        let arr2 = []
        for (let k in arrData) {
          arr2.push(...arrData[k])
        }
        this.carObj.carModelData = arr2
      })
    },
    //获取品牌品质
    getQuiltyAndBrand() {
      getAllBrand({ page: 1, pageSize: 1000 }).then(res => {
        console.log(res)
        if (res.code == 0) {
          this.qualityArr = res.data.content
          // .filter( el => (el.qualityCode === "000070" || el.qualityCode === "000071" || el.qualityCode === "000072"))
          .map(el => {
            if(el.qualityCode === "000070") {
              el.name = "原厂件"
            }
            if(el.qualityCode === "000071") {
              el.name = "品牌件"
            }
            if(el.qualityCode === "000072"){
              el.name = "再制造件"
              el.children[0].name = "拆车件"
            }
            return el;
          })
        }
      })
    },
    //根据品质获取品牌
    qualityGetBrand() {
      let arrData = this.qualityArr.filter(item => item.qualityCode == this.formValidate.qualityTypeId)
      if (arrData.length > 0) {
        this.brandArr = arrData[0].children
        this.getFullName();
      }
    },
    //获取选中配件名称
    getSearchPartName(v) {
      this.formValidate.name = v.name
      this.formValidate.partNameId = v.nameId
      this.formValidate.carTypeF = v.carTypef
      this.formValidate.carTypeS = v.carTypes
      this.formValidate.carTypeT = v.carTypet
      this.getFullName();
    },
    //显示配件名称选择
    showName() {
      this.$refs.searchPartName.init()
    },
    //自定义分类
    customModalFun() {
      this.customModal = true
      this.getCustomData();
    },
    //拉取自定义分类
    getCustomData(t) {
      getAllCustom().then(res => {
        if (res.code == 0) {
          this.customAll = res.data || [];
          if (this.formValidate.customType) {
            let newArrMap = []
            res.data.map(item => {
              newArrMap.push(...item.itemVOS)
            })
            let newArrFilter = newArrMap.filter(item => item.itemCode == this.formValidate.customType)
            if (newArrFilter.length > 0) {
              this.customClassName = newArrFilter[0]
              this.formValidate.customClassName = newArrFilter[0].itemName
            }
          }
        }
      })
    },
    //点击自定义分类
    handleTag(v) {
      this.customClassName = v
    },
    //选定自定义分类
    submitCustom() {
      this.customModal = false
      if (this.customClassName) {
        this.formValidate.customClassName = this.customClassName.itemName
      }
    },
    //新增规格
    addSpec() {
      let objData = { ...this.newSpecObj }
      this.formValidate.specVOS.push(objData)
    },
    selectChange(table) {
      this.currRow = table.row
    },
    //删除包装规格数据
    delSpec() {
      if (this.currRow == null) {
        return this.$message.error("请先选择一条数据")
      }
      if (this.currRow.checkboxsing == true) {
        return this.$message.error("不能删除最小计量单位")
      }
      if (this.formValidate.specVOS.length <= 1) {
        return this.$message.error("至少保留一条数据")
      }
      this.formValidate.specVOS.forEach((el, index, arr) => {
        if(el._XID == this.currRow._XID) {
          arr.splice(index, 1)
          this.currRow = null
        }
      });
    },
    //包装规格复选框切换
    changeCheckbox(i) {
      this.formValidate.specVOS.map((item, index) => {
        item.checkboxsing = false
        item.isMinCompany = 0
        if (i == index) {
          item.checkboxsing = true
          item.isMinCompany = 1
        }
      })
    },
    //判断默认勾选一条包装规格
    firstCheckbox() {
      let isCheckbox = 0
      this.formValidate.specVOS.map((item, index) => {
        item.checkboxsing = false
        if (item.isMinCompany == 1) {
          isCheckbox++
          item.checkboxsing = true
        }
      })
      if (isCheckbox === 0) {
        this.formValidate.specVOS[0].isMinCompany = 1;
        this.formValidate.specVOS[0].checkboxsing = true;
      }
    },
    //修改单位
    changeUnit(v) {
      this.formValidate.specVOS[0].meterCompany = v
    },

    //获取配件全称
    getFullName() {
      //配件品牌名
      let brandNameFilter = this.brandArr.filter(item => item.id == this.formValidate.partBrandId)
      let brandName = ''
      if (brandNameFilter.length > 0) {
        brandName = brandNameFilter[0].name
      }
      this.formValidate.fullName = this.formValidate.name + this.formValidate.spec + this.formValidate.carModelName + brandName
    },
    //tab切换
    changeTab() {
      this.$refs.vxeTable.refreshColumn()
    },

    //提交审批
    submit(name, auditSign) {
      this.btnIsLoadding = true
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$refs.vxeTable.validate(val => {
            if (!val) {
              //判断包装规格计量单位是否为空
              let errorT = 0
              this.formValidate.specVOS.map(item => {
                if (item.meterCompany == "") {
                  errorT++
                }
              })
              if (errorT > 0) {
                this.$message.error('包装规格计量单位必填')
                this.btnIsLoadding = false
                return
              }
              if(this.saveFlag) {
                this.btnIsLoadding = false
                return this.$message.error('正在保存数据')
              }
              let objReq = {}
              //品质
              objReq.qualityTypeId = this.formValidate.qualityTypeId
              if(objReq.qualityTypeId === "000070") {
                objReq.qualityName = "原厂件"
              }
              if(objReq.qualityTypeId === "000071") {
                objReq.qualityName = "品牌件"
              }
              //品牌
              objReq.partBrandId = this.formValidate.partBrandId
              //获取品牌code
              let brandCodeFilter = this.brandArr.filter(item => item.id == this.formValidate.partBrandId)
              if (brandCodeFilter.length > 0) {
                objReq.brandPartCode = brandCodeFilter[0].code
                objReq.partBrandName = brandCodeFilter[0].name
              }
              //编码
              objReq.code = this.formValidate.code
              //产品名
              objReq.name = this.formValidate.name
              //产品Id
              objReq.partNameId = this.formValidate.partNameId
              //单位
              objReq.unitId = this.formValidate.unitId
              //oeCode
              objReq.oemCode = this.formValidate.oemCode
              //规格
              objReq.spec = this.formValidate.spec
              //型号
              objReq.model = this.formValidate.model
              objReq.partTypeF = this.formValidate.partTypeF
              objReq.partTypeS = this.formValidate.partTypeS
              //拼音码
              objReq.pyCode=this.formValidate.pyCode
              this.isCart = false;
              if(!this.carList[0].carName && !this.carList[0].id){
                this.btnIsLoadding = false;
                this.isCart = true;
                this.tabsActive = 'active1'
                return
              }

              let carBrand = [];
              let carBrandName = [];
              let carModelName = [];
              this.carList.map(vb => {
                let selectBrandData = this.carObj.carBrandData.filter(item => item.erpCarBrandId == vb.carBrand);
                if (selectBrandData.length > 0) {
                  carBrand.push(selectBrandData[0].nameCn);
                  carBrandName.push(selectBrandData[0].erpCarBrandId);
                  carModelName.push(vb.carName);
                }
              });
              objReq.carBrand = carBrand.join("|");
              objReq.carBrandName = carBrandName.join("|");
              objReq.carModelName = carModelName.join("|");

              objReq.commonId = this.formValidate.commonId
              objReq.manufacture = this.formValidate.manufacture
              objReq.prdtPlace = this.formValidate.prdtPlace
              objReq.fullName = this.formValidate.fullName
              objReq.customType = this.customClassName.itemCode

              objReq.direction = this.formValidate.direction
              //审批状态
              objReq.auditSign = auditSign;
              //配件 1 2 3级类别
              objReq.carTypeF = this.formValidate.carTypeF
              objReq.carTypeS = this.formValidate.carTypeS
              objReq.carTypeT = this.formValidate.carTypeT
              objReq.carTypefName = this.formValidate.carTypefName
              objReq.carTypesName = this.formValidate.carTypesName
              objReq.carTypetName = this.formValidate.carTypetName

              //包装规格
              objReq.specVOS = this.formValidate.specVOS
              //禁用禁售
              objReq.disabled = this.prohibit ? 1 : 0
              objReq.isStopSell = this.forbidsale ? 1 : 0
              //右侧已关联配件集合
              let partRelevanceList=[]
              this.alreadyPartList.map(el=>{
                let data={}
                data.id=el.id
                el.partRelevanceId?data.relevancePartId=el.id :data.relevancePartId=el.newPartId
                data.relevancePartInnerId=el.code;
                partRelevanceList.push(data)
              })
              objReq.partRelevanceList= partRelevanceList || []
              this.saveFlag = true
              this.$emit('throwData', objReq)
              this.btnIsLoadding = false
            } else {
              //this.$message.error('带*必填')
              this.tabsActive = 'active2'
              this.btnIsLoadding = false
              this.changeTab()
            }
          })
        } else {
         // this.$Message.error('带*必填')
          this.saveFlag = false;
          this.tabsActive = 'active1'
          this.btnIsLoadding = false;
          this.changeTab()
          return
        }
      })
    },
    //关联配件查询
    search(){
      this.getAllPartListData()
    },
    //多编码查询弹框
    manyCodeSearch(){
      this.manyCodeInput=""
      this.manyCodeModal=true
    },
    //多编码查询确定
    manyCodeTrue(){
      let data={}
      data.codeList=this.manyCodeInput.split(/[\n,]/g)
      this.getByManyCodeFun(data)
      this.manyCodeModal=false
    },
    //关联配件一级分类二级分类
    // getLevelType(){
    //   this.levelTypeFirst=this.$parent.treeData
    // },
    //左侧全部配件分页
    allPartListChangePage(num){
      this.page.num=num;
      this.getAllPartListData()
    },
    //左侧全部配件分页
    allPartListChangeSize(size){
      this.page.num=1;
      this.page.size=size
      this.getAllPartListData()
    },
    //左侧全部配件选中事件
    selectAllPart(row){
      this.selectAllPartTab=row;
    },
    //右侧已关联配件选中事件
    selectAlreadyPart(row){
      this.selectAlreadyPartTab=row;
    },
    //新增关联
    addContact(){
      if(this.selectAllPartTab.length<=0){
        this.$Message.error("请在左侧表格选择需新增关联的配件")
      }else{
        let str="";
        let bool=false;
        this.selectAllPartTab.map(item2=>{
          this.alreadyPartList.map(item=>{
            if(item2.code==item.code){
              str=item.fullName
              bool=true
            }
          })
        })
        if(bool){
          this.$Message.error(`${str}已添加`)
          return
        }else{
          this.alreadyPartList=[...this.selectAllPartTab,...this.alreadyPartList]
          let set= new Set(this.alreadyPartList)
          this.alreadyPartList=Array.from(set)
        }
        // this.alreadyPartList=[...addArr,...this.alreadyPartList]
        this.selectAlreadyPartTab=[]
      }
    },
    //取消关联
    moveContact(){
      if(this.selectAlreadyPartTab.length<=0){
        this.$Message.error("请在右侧表格中选择需取消关联的配件")
      }else{
        // selectAlreadyPartTab
        if(this.selectAlreadyPartTab.length==this.alreadyPartList.length){
          this.alreadyPartList=[]
        }else{
          this.selectAlreadyPartTab.map((item2,index2)=>{
            this.alreadyPartList.map((item,index)=>{
              if(item2.code==item.code){
                this.alreadyPartList.splice(index,1)
              }
            })
          })
        }
        let set= new Set(this.alreadyPartList)
        this.alreadyPartList=Array.from(set)
        this.selectAlreadyPartTab=[]
      }
    },
    //添加车型
    addCarItem(){
      this.carList.push({...this.carItemObj});
    },
    //删除车型
    removeCarItem(index){
      this.carList.map((v,i) => {
        if(i==index){
          this.carList.splice(i,1)
        }
      })
    },
    getSelectCarBrand(v){
      // console.log(v)
    }
  }
}
