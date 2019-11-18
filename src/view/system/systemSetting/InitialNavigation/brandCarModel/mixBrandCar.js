import {getCarBrandAll,getCarModel} from "_api/system/systemSetting/Initialization";

export const mixBrandCar = {
  data(){
    return {
      //====品牌===
      carBrandObj:{
          carBrandLayer:false,//品牌弹层
          carBrandLayerTit:"新增品牌",//品牌弹层title
      },
      //品牌table选中的数据
      carBrandTabelClickData:'',
      //品牌form表单
      formValidate: {
        enName: '',
        cnName: ''
      },
      ruleValidate: {
        enName: [
          { required: true, message: '品牌英文不能为空', trigger: 'blur' }
        ],
        cnName: [
          { required: true, message: '品牌中文不能为空', trigger: 'blur'}
        ],
      },
      tbdata:[],
      //====车系===
      carSystemObj:{
        carSystemLayer:false,//车系弹层
        carSystemLayerTit:"新增车系",//车系弹层title
      },
      //车系table选中的数据
      carSystemTabelClickData:'',
      //车系form表单
      systemFormValidate: {
        brand: '',
        firm: '',
        systemName:''
      },
      systemRuleValidate: {
        firm: [
          { required: true, message: '厂商不能为空', trigger: 'blur'}
        ],
        systemName: [
          { required: true, message: '车系不能为空', trigger: 'blur'}
        ],
      },

      //====车型===
      carTypeObj:{
        carTypeLayer:false,//车系弹层
        carTypeLayerTit:"新增车系",//车系弹层title
      },
      //车型table选中的数据
      carTypeTabelClickData:'',
      //车系form表单
      typeFormValidate: {
        brand: '',
        firm: '',
        systemName:'',
        typeCar:''
      },
      typeRuleValidate: {
        typeCar: [
          { required: true, message: '品牌车型不能为空', trigger: 'blur'}
        ],
      },
      carModeldata:[],



      //快速查询状态
      status:'',
      //


    }
  },
  mounted(){
    this.getList()
  },
  methods:{
    getList(){
      this.brandLoading = true
      let req = {}
      req.status = this.status
      getCarBrandAll(req).then(res => {
        this.brandLoading = false
        this.tbdata = res.data.data.list||[]
      })
    },
    //修改or新增品牌
    brandBtnClick(type){
      this.carBrandObj.carBrandLayer = true
      if(type=='add'){

      }else{
        this.carBrandObj.carBrandLayerTit = '修改品牌'
      }
    },
    //修改or新增车系
    systemBtnClick(type){
      this.carSystemObj.carSystemLayer = true
      if(type=='add'){

      }else{
        this.carBrandObj.carBrandLayerTit = '修改车系'
      }
    },
    //修改or新增车型
    typeBtnClick(type){
      this.carTypeObj.carTypeLayer = true
      if(type=='add'){

      }else{
        this.carTypeObj.carTypeLayerTit = '修改车系'
      }
    },
    submitBtn(name){
      this.$refs[name].validate((valid) => {
        if (valid) {

        }
      })
    },
    //点击品牌table选中数据
    carBrandTabelClick(v){
      this.carBrandTabelClickData = v;
      this.carModelLoading = true
      getCarModel({"nameEn":v.nameEn}).then(res => {
        this.carModelLoading = false
        this.carModeldata = res.data.data.list
      })
    },
    //点击车系table选中数据
    carSystemTabelClick(v){
      this.carSystemTabelClickData = v;
    },
    //点击车型table选中数据
    carTypeTabelClick(v){
      this.carTypeTabelClickData = v;
    },
    quickBtnClik(type){
      this.status = type
    },
    //合并单元格
    handleSpan ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 0) {
        return [1, 2];
      }
    }
  }
}
