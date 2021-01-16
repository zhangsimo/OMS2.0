import {getDataDictionaryType,getDataDictionaryTable,saveTreeDetailItem,saveTreeItem} from '../../../api/system/dataDictionary/dataDictionaryApi'

let price = (rule, value, callback) => {
  if (!value&&value!==0) {
    callback(new Error('单次扣减华币不能为空'));
  } else {
    let reg = /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^([^0][0-9]+|0)$/;

    if(!reg.test(value)){
      callback('请输入正确格式')
    }else{
      callback()
    }
  }
}
let price2 = (rule, value, callback) => {
  if (!value) {
    callback(new Error('销售价不能为空'));
  } else {
    if(!/[^\d.]/g.test(value)){
      if(/[.]/g.test(value)){
        let reg=/^\d+\.\d{1,2}$/;
        if(!reg.test(value)){
          callback('请输入正确格式')
        }else{
          callback()
        }
      }else{
        callback()
      }
    }else{
      callback('请输入数字格式')
    }
    //
    //
    // if(!reg.test(value)){
    //
    // }else{
    //   callback()
    // }
  }
}

let nameCode = (rule, value, callback) => {
  if (!value&&value!==0) {
    callback(new Error('字典项编码不能为空'));
  } else {
    let reg = /^[0-9a-zA-Z]*$/g;
    if(!reg.test(value)){
      callback('只能输入数字、字母')
    }else{
      callback()
    }
  }
}

let typeCode = (rule, value, callback) => {
  if (!value&&value!==0) {
    callback(new Error('类型编码不能为空'));
  } else {
    let reg = /^[a-zA-Z0-9_]*$/g;
    if(!reg.test(value)){
      callback('只能输入数字、字母')
    }else{
      callback()
    }
  }
}

export const dataMixin = {
  data(){
    return {
      split:0.55,
      dicTypeCode:'',
      dicTypeName:'',
      treeData:[
        {
          title: 'parent 1',
          expand: true,
          render:(h,{root,node,data})=>{
            return h('div',{
              style:{
                display:'inline-block',
              },
              class:'data-dic-th'
            },[
              h('span','字典编码'),
              h('span','名称'),
              h('span','备注')
            ])
          },
          children: []
        }
      ],
      classIndex:0,
      formValidate: {
        id:'',
        dicTypeName:'',
        dicCode: '',
        dicName: '',
        isDisable: '1',
        itemValueOne:'',
        itemValueTwo:'',
        itemValueThree:''
      },
      ruleValidate: {
        dicCode: [
          { required: true, validator: nameCode, trigger: 'blur' }
        ],
        dicName: [
          { required: true,message:'字典项名称不能为空', trigger: 'blur'}
        ]
      },
      formModelData: {
        dictCode:'',
        dictName: '',
        dictDescribe: '',
        parentMenu: [],
      },
      ruleModelData: {
        dictCode: [
          { required: true, validator:typeCode,  trigger:'blur' }
        ],
        dictName: [
          { required: true, message: '类型名称不能为空', trigger:'blur' }
        ],
      },
      selectTreeItem:'',
      selectTableItem:'',
      changeTabelItemTitle:'添加字典项',
      changeTreeItemTitle:'添加字典类型'
    }
  },
  methods:{
    // checkChange(v){
    //   // console.log(v)
    // },
    selectTreeData(v){
      this.selectTreeItem = v
      // if(v.children&&v.children.length>=0){
      //   this.selectTreeItem = v
      // }else{
      //   this.selectTreeItem = ''
      // }
      this.treeActive(this.treeData[0].children,this.selectTreeItem)
    },
    selectTable(v){
      this.selectTableItem = v
    },
    treeActive(treeData,vdata){
      treeData.map((item)=>{
        item.isSelect = false
        if(vdata&&vdata.id==item.id){
          item.isSelect = true
        }
        if(item.children&&item.children.length>0){
          this.treeActive(item.children,vdata)
        }
      })
    },
    //初始化
    getList() {
      const params = {}
      let dictCode = this.dicTypeCode.trim()
      let dictName = this.dicTypeName.trim()
      if(dictCode){
        params.dictCode = dictCode
      }
      if(dictName){
        params.dictName = dictName
      }
      this.loading = true
      this.selectTreeItem = "";
      this.formModelData.parentMenu=[]
      getDataDictionaryType(params).then(res => {
        this.loading = false
        if (res.code == 0) {
          let arrData = res.data || []

          this.treeData[0].children = this.hideShow(arrData)
        }

      })
    },
    hideShow(treeData){
      treeData.map((item,index)=>{
        item.expand = false
        item.title = item.dictCode
        item.label = item.dictName
        item.value = item.id
        item.isSelect = false
        item.render = (h,{ root, node, data })=>{
          let className = ''
          if(item.isSelect){
            className = 'data-dic-select'
          }
          return h('span',{
            style:{
              display:'inline-block',
              cursor:'pointer'
            },
            class:`data-dic-th data-dic-th2 ${className}`,
            on:{
              'click':()=>{
                this.getTableData(data.dictCode)
                this.selectTreeData(data)
              }
            }
          },[
            h('span',data.dictCode),
            h('span',data.dictName),
            h('span',data.dictDescribe),
          ])
        }
        if(item.children&&item.children.length>0){
          this.hideShow(item.children)
        }
      })
      return treeData
    },
    //拉取数据字典项明细
    getTableData(dictCode){
      this.selectTableItem=''
      let params = {
        'dictCode':dictCode
      }
      getDataDictionaryTable(params).then(res => {
        if(res.code==0){
          this.tbdata = res.data
        }
      })
    },
    //新增数据字典项
    addNew(){
      this.changeTabelItemTitle='新增字典项'
      this.$refs.proModal2.resetFields()
      if(this.formValidate.id){
        delete this.formValidate.id
      }
      if(this.selectTreeItem){
        this.addNewItem = true
        this.formValidate.dicTypeName = this.selectTreeItem.dictName
      }else{
        this.$Message.error("请选择主数据")
      }
    },
    //修改新增数据字典项
    changeNew(){
      this.changeTabelItemTitle='修改字典项'
      if(this.selectTableItem){
        this.addNewItem = true
        this.formValidate.dicTypeName = this.selectTreeItem.dictName
        this.formValidate.dicCode = this.selectTableItem.itemCode
        this.formValidate.dicName = this.selectTableItem.itemName
        this.formValidate.isDisable = this.selectTableItem.isDisable.toString()
        this.formValidate.itemValueOne = this.selectTableItem.itemValueOne
        this.formValidate.itemValueTwo = this.selectTableItem.itemValueTwo
        this.formValidate.itemValueThree = this.selectTableItem.itemValueThree
        this.formValidate.id = this.selectTableItem.id
      }else{
        this.$Message.error("请选择要修改数据")
      }
    },
    submit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let objReq = {}
          objReq.dictCode = this.selectTreeItem.dictCode
          if(this.formValidate.id){
            objReq.id = this.formValidate.id
          }
          objReq.itemCode = this.formValidate.dicCode
          objReq.itemName = this.formValidate.dicName
          objReq.isDisable = this.formValidate.isDisable
          objReq.itemValueOne = this.formValidate.itemValueOne
          objReq.itemValueTwo = this.formValidate.itemValueTwo
          objReq.itemValueThree = this.formValidate.itemValueThree
          saveTreeDetailItem(objReq).then(res => {
            if(res.code==0){
              this.addNewItem = false
              this.$Message.success("保存成功")
              this.getTableData(this.selectTreeItem.dictCode)
            }
          })
        }
      })
    },
    //新增数据字典类型
    addNewModelFun(){
      this.addNewModal = true
      this.changeTreeItemTitle='添加字典类型'
      this.$refs.proModal.resetFields()
      if(this.selectTreeItem.parentId==0){
        if(this.selectTreeItem.value){
          this.formModelData.parentMenu=[this.selectTreeItem.value]
        }else{
          this.formModelData.parentMenu=[]
        }
      }else{
        if(this.selectTreeItem.value){
          this.formModelData.parentMenu=[this.selectTreeItem.parentId,this.selectTreeItem.value]
        }else{
          this.formModelData.parentMenu=[this.selectTreeItem.parentId]
        }
      }
      if(this.formModelData.id){
        delete this.formModelData.id
      }
    },
    //修改数据字典类型
    changeModelFun(){
      this.changeTreeItemTitle='修改字典类型';
      if(this.selectTreeItem){
        this.addNewModal = true
        this.$refs.proModal.resetFields();
        this.formModelData.dictCode = this.selectTreeItem.dictCode
        this.formModelData.dictName = this.selectTreeItem.dictName
        this.formModelData.dictDescribe = this.selectTreeItem.dictDescribe
        if(this.selectTreeItem.parentId==0){
          if(this.selectTreeItem.value){
            this.formModelData.parentMenu=[this.selectTreeItem.value]
          }else{
            this.formModelData.parentMenu=[]
          }
        }else{
          if(this.selectTreeItem.value){
            this.formModelData.parentMenu=[this.selectTreeItem.parentId,this.selectTreeItem.value]
          }else{
            this.formModelData.parentMenu=[this.selectTreeItem.parentId]
          }
        }
        this.formModelData.id = this.selectTreeItem.id
      }
      else{
        this.$Message.error("请选择修改数据")
      }
    },
    //提交字典类型
    submitType(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let len = this.formModelData.parentMenu.length
          if(len>0){
            this.formModelData.parentId = this.formModelData.parentMenu[len-1]
          }else{
            this.formModelData.parentId = 0
          }
          saveTreeItem(this.formModelData).then(res => {
            if(res.code==0){
              this.addNewModal = false
              this.$Message.success("保存成功")
              this.selectTreeItem = "";
              this.getList()
            }
          })
        }
      })
    }
  }
}
