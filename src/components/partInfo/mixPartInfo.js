//适用车型，品牌及车型接口
import { getCarBrandAll, getCarModel } from "_api/system/systemSetting/Initialization";
//品牌品质，自定义分类接口
import { getAllBrand, getAllCustom } from '_api/system/partsExamine/partsExamineApi'

import { getDataDictionaryTable } from '_api/system/dataDictionary/dataDictionaryApi'

export const mixPartInfo = {

  data() {
    //数字加字母校验
    const NumberA = (rule, value, callback) => {
      // 模拟异步验证效果
      let reg = /^[0-9a-zA-Z]*$/;
      if (!value) {
        callback(new Error('配件编码不能为空！'));
      } else if(!reg.test(value)){
        callback(new Error('配件编码格式不正确!'));
      }else {
        callback()
      }
    };
    return {
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
        qualityTypeId: '',//品质
        partBrandId: '',//品牌
        code: '',//配件编码
        name: '',//配件名称
        partNameId: '',//配件id
        unitId: '',//配件单位
        oemCode: '1',//oe码
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
    }
  },
  methods: {
    // 弹框打开关闭
    visible(type){
      if(type){
        this.$refs.proModalForm.resetFields()
      }
    },
    //初始化
    init(setData) {
      this.proModal = true
      console.log(this.showSpe)
      //拉取适用车型品牌
      this.getCarBrand();
      //获取所有品质
      this.getQuiltyAndBrand();
      //拉取自定义分类
      this.getCustomData();
      //获取配件单位
      getDataDictionaryTable({ "dictCode": "UNIT_CODE_001" }).then(res => {
        if (res.code == 0) {
          this.dictCodeAll = res.data
        }
      })
      if (setData) {
        this.formValidate = setData;
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
      this.getFullName();
    },

    //获取所有车型品牌
    getCarBrand() {
      let req = {}
      req.page = 1;
      req.pageSize = 500;
      getCarBrandAll(req).then(res => {
        this.carObj.carBrandData = res.data.content || []
        if (this.formValidate.carBrandName) {
          this.getCarModelFun();
        }
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
      req.pageSize = 200;
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
      getAllBrand({ page: 1, pageSize: 200 }).then(res => {
        if (res.code == 0) {
          this.qualityArr = res.data.content || {};
          //根据品质获取品牌
          if (this.formValidate.qualityTypeId) {
            this.qualityGetBrand()
          }
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
      this.formValidate.partNameId = v.id
      this.formValidate.carTypeF = v.baseType.firstType.typeId
      this.formValidate.carTypeS = v.baseType.secondType.typeId
      this.formValidate.carTypeT = v.baseType.thirdType.typeId
      this.formValidate.carTypefName = v.baseType.firstType.typeName
      this.formValidate.carTypesName = v.baseType.secondType.typeName
      this.formValidate.carTypetName = v.baseType.thirdType.typeName
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
    getCustomData() {
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
    //删除包装规格数据
    delSpec() {
      if (this.formValidate.specVOS.length > 1) {
        this.formValidate.specVOS.pop()
      }
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
      this.$refs[name].validate((valid) => {
        if (valid) {
          //判断包装规格计量单位是否为空
          let errorT = 0
          this.formValidate.specVOS.map(item => {
            if (item.meterCompany == "") {
              errorT++
            }
          })
          if (errorT > 0) {
            this.$message.error('包装规格计量单位必填')
            return
          }
          let objReq = {}
          //品质
          objReq.qualityTypeId = this.formValidate.qualityTypeId
          //品质名称
          let arrData = this.qualityArr.filter(item => item.qualityCode == this.formValidate.qualityTypeId)
          if (arrData.length > 0) {
            objReq.qualityName = arrData[0].quality
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

          //使用车型品牌
          let selectBrandData = this.carObj.carBrandData.filter(item => item.id == this.formValidate.carBrandName)
          if (selectBrandData.length > 0) {
            objReq.carBrand = selectBrandData[0].nameCn
            objReq.carBrandName = selectBrandData[0].id
          }
          objReq.carModelName = this.formValidate.carModelName

          objReq.commonId = this.formValidate.commonId
          objReq.manufacture = this.formValidate.manufacture
          objReq.prdtPlace = this.formValidate.prdtPlace
          objReq.fullName = this.formValidate.fullName
          objReq.customType = this.customClassName.itemCode

          objReq.direction = this.formValidate.direction
          //审批状态
          objReq.auditSign = auditSign
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
          this.$emit('throwData', objReq)
        } else {
          this.$Message.error('带*必填')
          return
        }
      })

    },
  }
}
