
import {getCarBrandAll,getCarModel,getCarSeries} from "_api/system/systemSetting/Initialization";

import {getAllBrand,getAllCustom,setApproval,getExamineDetail} from '_api/system/partsExamine/partsExamineApi'

import {getDataDictionaryTable} from '_api/system/dataDictionary/dataDictionaryApi'

export const mixPartInfo = {
  data(){
    return {
      //是否禁用
      prohibit:false,
      //是否禁售
      forbidsale:false,
      //配件名称查询层
      linkModal: false,
      //配件资料层
      proModal:false,
      //自定义分类层
      customModal:false,
      //配件资料层form数据
      formValidate: {
        qualityTypeId: '',//品质
        partBrandId: '',//品牌
        code: '',//配件编码
        name: '',//配件名称
        unit: '',//配件单位
        oemCode: '1',//oe码
        spec:'',//规格
        model:'',//型号
        applyCarbrandId:'',//适用车型Id
        explain:'',//车型说明
        commonCode:'',//通用编码
        produceFactory:'',//生产厂家
        origin:'',//产地
        fullName:'',//配件全称
        customClassName:'',//选中的自定义分类Name
        remarks:'',//备注
        specVOList:[],//规格list
        valueVOS:[],//单位换算list
      },
      ruleValidate: {
        qualityTypeId: [
          { required: true, message: '配件品质不能为空', trigger: 'change' }
        ],
        partBrandId: [
          { required: true, message: '配件品牌不能为空', trigger: 'blur'}
        ],
        code: [
          { required: true, message: '编码不能为空', trigger: 'blur' }
        ],
        name:[
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        unit:[
          { required: true, message: '单位不能为空', trigger: 'blur'}
        ]
      },
      qualityArr:[],//所有品质
      brandArr:[],//所有品牌

      dictCodeAll:[],//所有单位
      carModelAll:[],//所有车型
      customAll:[],//自定义分类
      customClassName:'',//选中的自定义分类,判断当前高亮
      customClassId:'',//选中的自定义分类id
      //配件资料层车型obj
      carObj:{
        selectCarBrand:'',
        carBrandData:[],
        selectCarSystem:'',
        carSystemData:[],
        selectCarModel:'',
        carModelData:[]
      },
      //配件资料层包装规格表头
      columnsTab: [
        {
          title: '序号',
          minWidth: 50,
          type:'index'
        },
        {
          title: '计量单位',
          key: 'meterCompany',
          slot: 'meterCompany',
          minWidth: 65
        },
        {
          title: '单位数量',
          key: 'companyNum',
          minWidth: 65,
        },
        {
          title: '长',
          key: 'longNum',
          minWidth: 50,
        },
        {
          title: '宽',
          key: 'wide',
          minWidth: 50,
        },
        {
          title: '高',
          key: 'high',
          minWidth: 50,
        },
        {
          title: '体积',
          key: 'volume',
          minWidth: 50,
        },
        {
          title: '重量',
          key: 'weight',
          minWidth: 50,
        },
        {
          title: '容积',
          key: 'volumeRong',
          minWidth: 50,
        },
        {
          title: '设为起订单位',
          key: 'name',
          minWidth: 90,
          render:(h,params) => {
            let com = params.row.isMaxCompany
            return h('Checkbox',{
              props:{
                value:com===0?false:true
              }
            })
          }
        },
        {
          title: '最小起量单位',
          key: 'name',
          minWidth: 90,
          render:(h,params) => {
            let com = params.row.isMinCompany
            return h('Checkbox',{
              props:{
                value:com===0?false:true
              }
            })
          }
        },
      ],
      //规格数据
      Tabdata: [],
      //新增规格obj
      newSpecObj:{
        id:'1'
      },
    }
  },
  methods:{
    //初始化
    init(id){
      this.proModal = true
      //拉取适用车型品牌
      this.getCarBrand();
      //获取系统分类
      //获取所有品质
      this.getQuiltyAndBrand();
      //获取配件单位
      getDataDictionaryTable({"dictCode":"UNIT_CODE_001"}).then(res =>{
        if(res.code==0){
          this.dictCodeAll = res.data
        }
      })
      getExamineDetail({id:id}).then(res => {
        if(res.code==0){
          this.formValidate = res.data||{};
          this.qualityGetBrand()
          // this.$set(this.formValidate,'specVOList',[])
          // this.formValidate.qualityTypeId =
          // objReq.partBrandId = this.formValidate.partBrandId
          // objReq.code = this.formValidate.code
          // objReq.name = this.formValidate.name
          // objReq.unit = this.formValidate.unit
          // objReq.oemCode = this.formValidate.oemCode
          // objReq.spec = this.formValidate.spec
          // objReq.model = this.formValidate.model
          // objReq.applyCarbrandId = this.formValidate.applyCarbrandId
          // objReq.commonCode = this.formValidate.commonCode
          // objReq.produceFactory = this.formValidate.produceFactory
          // objReq.origin = this.formValidate.origin
          // objReq.fullName = this.formValidate.fullName
          // objReq.customClassName = this.formValidate.customClassName
          // objReq.remarks = this.formValidate.remarks
        }
      })
    },
    //获取所有品牌
    getCarBrand(){
      let req = {}
      req.page = 1;
      req.pageSize = 500;
      getCarBrandAll(req).then(res => {
        this.carObj.carBrandData = res.data.content
      })
    },
    //获取车系
    getCarSystem(){
      let req = {}
      req.nameEn = this.carObj.selectCarBrand
      getCarSeries(req).then(res => {
        this.carObj.carSystemData = res.data;
        this.carObj.carModelData = [];
        this.carObj.selectCarModel = '';
      })
    },
    //获取车系
    getCarModelFun(){
      let req = {}
      req.nameEn = this.carObj.selectCarBrand;
      req.page = 1;
      req.pageSize = 200;
      getCarModel(req).then(res => {
        let arrData = res.data.content||[]
        let arr2 = []
        for(let k in arrData){
          arr2.push(...arrData[k])
        }
        this.carObj.carModelData = arr2
      })
    },
    //获取品牌品质
    getQuiltyAndBrand(){
      getAllBrand({page: 1,pageSize: 200}).then(res => {
        if(res.code==0){
          this.qualityArr = res.data.content||{}
        }
      })
    },
    //根据品质获取品牌
    qualityGetBrand(){
      let arrData = this.qualityArr.filter(item => item.qualityCode==this.formValidate.qualityTypeId)
      if(arrData.length>0){
        this.brandArr = arrData[0].children
      }
    },
    //获取选中配件名称
    getSearchPartName(v){
      this.formValidate.name = v.name
    },
    //显示配件名称选择
    showName(){
      this.$refs.searchPartName.init()
    },
    //自定义分类
    customModalFun(){
      this.customModal = true
      getAllCustom().then(res => {
        if(res.code==0){
          this.customAll = res.data||[]
        }
      })
    },
    handleTag(v){
      this.customClassName = v.itemName
      this.customClassId = v.id
    },
    //选择自定义分类
    submitCustom(){
      this.customModal = false
      if(this.customClassName) {
        this.formValidate.customClassName = this.customClassName
      }
    },
    //提交审批
    submit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let objReq = {}
          objReq.qualityTypeId = this.formValidate.qualityTypeId
          objReq.partBrandId = this.formValidate.partBrandId
          objReq.code = this.formValidate.code
          objReq.name = this.formValidate.name
          objReq.unit = this.formValidate.unit
          objReq.oemCode = this.formValidate.oemCode
          objReq.spec = this.formValidate.spec
          objReq.model = this.formValidate.model
          objReq.applyCarbrandId = this.formValidate.applyCarbrandId
          objReq.commonCode = this.formValidate.commonCode
          objReq.produceFactory = this.formValidate.produceFactory
          objReq.origin = this.formValidate.origin
          objReq.fullName = this.formValidate.fullName
          objReq.customClassName = this.formValidate.customClassName
          objReq.remarks = this.formValidate.remarks


          setApproval(objReq).then(res => {
            if(res.code==0){
              this.proModal = false
              this.$Message.success("添加成功")
              this.getList()
            }
          })
        }
      })
    },
  }
}
