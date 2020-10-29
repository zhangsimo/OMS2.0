import {getAllBrand,getCarClassifys,savePartInfo} from "_api/system/partsExamine/partsExamineApi";
// import {getwbParts} from "_api/system/partManager";
import {getDetails} from '@/api/salesManagment/salesOrder'
import {getParnt} from '@/api/salesManagment/salesOrder'


export const mixSelectPartCom  = {
  inject:['reload'],
  props:{
    guestId:''
  },
  data(){
    return {
      loading:false,
      treeLoading:false,
      loading2:false,
      searchPartLayer:false,//配件名称查询层
      partName:'',//配件名称查询名字
      treeData:[],//系统分类树形数据
      //查询选择

      //配件名称查询层表头
      columnsPart:[
        {
          title: '序号',
          width: 50,
          type:'index'
        },
        {
          title: "序号",
          type: "selection",
          minWidth: 30
        },
        {
          title: "配件编码",
          key: "partCode",
          minWidth: 110,
          tooltip:true
        },
        {
          title: "配件名称",
          key: "partName",
          minWidth: 110,
          tooltip:true
        },
        {
          title: "品牌",
          key: "partBrand",
          minWidth: 80,
          tooltip:true
        },
        {
          title: "OEM码",
          key: "oemCode",
          minWidth: 110,
          tooltip:true
        },
        {
          title: "批次库存",
          key: "enterQty",
          minWidth: 70,
        },
        {
          title: "可售数量",
          key: "outableQty",
          minWidth: 70
        },
        {
          title: "本店库龄",
          key: "branchStockAge",
          minWidth: 70
        },
        {
          title: "成本单价",
          key: "enterQty",
          minWidth: 80
        },
        {
          title: "税率",
          key: "enterQty",
          minWidth: 50
        },
        {
          title: "含税单价",
          key: "enterQty",
          minWidth: 70
        },
        {
          title: "不含税单价",
          key: "enterQty",
          minWidth: 80
        },
        {
          title: "入库日期",
          key: "enterDate",
          minWidth: 110,
          tooltip:true
        },
        {
          title: "供应商",
          key: "guestName",
          minWidth: 120,
          tooltip:true
        },
        {
          title: "品牌车型",
          minWidth: 120,
          tooltip:true,
          key:"carModelName",
          slot:'action',
          render: (h, params) => {
            let text = '';
            try {
              text = params.row.carBrandName+params.row.carModelName
            } catch(e) {}
            return h('Tooltip',{
              props:{
                placement:'top'
              }
            },[
              h('span',{
                class:'text-overflow'
              },text),
              h('div',{
                slot:'content',
                style:{
                  'white-space':'normal',
                  'color':'#fff'
                }
              },text)
            ]);
          }
        },
        {
          title: "单位",
          key: "enterUnitId",
          minWidth: 50
        },
        {
          title: "规格",
          key: "spec",
          tooltip:true,
          minWidth: 120
        },
      ],
      //配件名称查询层配件数据
      partData:[],
      //配件数据选中的数据
      selectTableItem:[],
      //树形选中数据
      selectTreeItem:{},
      //分页obj
      page: {
        num: 1,
        size: 20,
        total: 0
      },
      //配件查询分类
      searchType:'fullName',
      searchTypeArr:[
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
      ],
      //查询关键字
      searchValue:'',
      //所有配件品牌
      selectBrand:'9999',
      partBrandData:[
        {
          "label":"全部",
          "value":"9999"
        }
      ],
      //获取点击的数据
      allList:{},
    }
  },
  mounted(){

  },
  methods:{
    //初始化数据
    getList(){
      this.loading = true
      let req = {}
      if(this.selectTreeItem.id){
        req.typeId = this.selectTreeItem.id
      }
      if(this.selectBrand&&this.selectBrand!='9999'){
        req.partBrand = this.selectBrand
      }

      if(this.partName.trim()){
        req.partCode = this.partName.replace(/[\W]/g,'');
      }
      req.page = this.page.num -1;
      req.size = this.page.size;
      req.storeId=this.storeId;
      req.guestId=this.guestId;
      this.partData = [];
      getParnt(req).then(res => {
        this.loading = false;
        this.partData = res.data.content||[];
        this.page.total = res.data.totalElements;

        let brands = [];
        let arr = res.data.content.map(el => el.partBrand);
        let set = new Set(arr);
        set.forEach(el => {
          brands.push({ label: el, value: el });
        });

        this.$nextTick(()=>{
          const xtable = this.$refs.xTable3;
          const column = xtable.getColumnByField('partBrand');
          xtable.setFilter(column, brands);
          xtable.updateData();
        })
      })
    },

    //获取配件品牌
    getPartBrandAll(){
      getAllBrand({page: 1,pageSize: 1000}).then(res => {
        console.log(res)
        let filterData = res.data.content.filter(item => item.qualityCode=='000071')
        if(filterData.length>0){
          if(filterData[0].children&&filterData[0].children.length>0){
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
    getCarClassifysFun(){
      this.treeLoading = true
      getCarClassifys({page: 1,pageSize: 500}).then(res => {
        this.treeLoading = false
        this.treeData = this.resetData(res.data.content||[])
      })
    },
    //树形数组递归加入新属性
    resetData(treeData){
      treeData.map(item => {
        item.title = item.typeName
        if(item.children&&item.children.length>0){
          item.children = this.resetData(item.children)
        }
      })
      return treeData
    },

    search(){
      this.page.num=1
      this.getList()
    },
    //系统分类树形节点点击数据
    selectTree(v){
      if(v.length>0){
        this.selectTreeItem = v[0];
        this.getList();
      }
    },
    //显示层
    init(){
      this.searchPartLayer = true;
      this.getList();
      if(this.partBrandData.length==1){
        this.getPartBrandAll();
      }

      // this.getCarClassifysFun();
    },
    //配件表格点击的行
    selectTabelData({selection}){
      this.selectTableItem = selection
    },
    throwData(){
      if(this.selectTableItem.length>0){
        this.$emit('selectPartName',this.selectTableItem);
        this.searchPartLayer = false;
      }else{
        this.$Message.error("请选择数据")
      }
    },
    cancel(){
      this.searchPartLayer = false
      this.partName=''
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
    //申请配件按钮
    applyPart(){
      this.searchPartLayer = false;
      this.$refs.partInfo.init();
    },
    //提交申请配件
    addPartFun(obj){
      //添加未审核属性
      obj.auditSign = 0
      savePartInfo(obj).then(res => {
        this.$Message.success("保存成功！")
        this.reload();
      })
    },

    //点击详情
    show(val){
      let data = {}
      data.partId = val.partId;
      if(this.guestId){
        data.guestId = this.guestId
      }
      this.loading2 = true;
      this.allList = {};
      getDetails(data).then( res => {
        this.loading2 = false;
        if(res.code  === 0){
          this.allList = res.data
        }

      })
    },
    currentItem({row}) {
      this.show(row);
    },
    filterNameMethod1({ value, row, column }){
      if(!value){
        return !row.partBrand
      }
      if(row.partBrand){
        return row.partBrand.indexOf(value) > -1;
      }else{
        return false
      }
    },
    //双击显示
    dblclick({row}){
      if(this.$route.name=="salesOrder"){
        this.$refs.selectPartInfo.init(row);
      } else {
        this.selectTableItem = [row];
        this.$emit("selectPartName", this.selectTableItem);
      }
    },
    //修改数量价格选中配件
    throwDataChangeNum(v){
      this.$emit("throwPartNameList2",v)
    }
  }
}
