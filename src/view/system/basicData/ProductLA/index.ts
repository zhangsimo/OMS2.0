import { Vue, Component } from 'vue-property-decorator'
// @ts-ignore
import * as api from "_api/system/ProductLA.js";
import {down} from "@/api/system/essentialData/commoditiesInShortSupply.js"

import Cookies from 'js-cookie'
import { TOKEN_KEY } from '@/libs/util'
// @ts-ignore
import {getAllBrand} from "_api/system/partsExamine/partsExamineApi.js";
// @ts-ignore
import {getParamsBrand} from "@/api/purchasing/purchasePlan";

@Component
export default class ProductLA extends Vue {
    // data
    /**员工表查询选项 */
    private employeeOptions: Array<Option> = [{
        value: '0',
        label: '员工名称',
    }, {
        value: '1',
        label: '电话号码',
    },]
    /**员工表选中的查询选项 */
    private employeeSelecteOption: string = "0"
    /**员工表查询内容 */
    private employeeSelectContent: string = ""
    /**分配状态选项 */
    private DistributionStateOptions: Array<Option> = [
        {
            value: '0',
            label: '全部',
        },
        {
            value: '1',
            label: '未分配',
        },
        {
            value: '2',
            label: '已分配',
        },
    ]
    /**员工表选中的分配状态选项 */
    private DistributionStateSelecteOption: string = "0"
    /**角色选项 */
    private roleOptions: Array<Option> = []
    /**角色选项选中的项 */
    private roleSelectOption: string = ""
    /**员工表表头 */
    private employeeTableHead: Array<Tableth> = [
        {
            title: "序号",
            minWidth: 50,
            type: "index"
        },
        {
            title: "分配状态",
            minWidth: 120,
            render: (h, params) => {
                var val = '';
                if (params.row.allocation == 0) {
                    val = "已分配"
                } else {
                    val = "未分配"
                }
                return h('span', val);
            }
        },
        {
            title: "角色",
            key: "roleName",
            minWidth: 240
        },
        {
            title: "员工名称",
            key: "userName",
            minWidth: 120
        },
        {
            title: "电话号码",
            key: "phone",
            minWidth: 120
        },
        {
            title: "备注",
            key: "remark",
            minWidth: 240
        },
    ]
    /**员工表数据 */
    private employeeData = []
    /**添加员工弹窗*/
    private staffModalShow = false
  /**弹窗勾选的员工数据*/
    private  selectStaffList:Array<any> = [];
  /**添加员工弹窗搜索条件*/
  private  staffModalSearchInfo ={
    roleName:'',
    userName:'',
    productAuthority:1
  }
  private staffModalPage :Page = {
    num: 1,
    total: 0,
    size: 10
  }
  /**添加员工弹窗数据列表*/
  private staffModalList = []
  /**添加员工弹窗列表头*/
  private addStaffColumns = [
    {
      type:'selection',
      width:60,
      align:'center'
    },
    {
      title:'员工名称',
      key:'userName'
    },
    {
      title:'角色',
      key:'roleName'
    }
  ]
  /**品牌数据*/
  private partBrandData:Array<any> = [];
  /**选择的品牌*/
  private waitPartTransListBrand='';
  /**一键移入、移出提示*/
  private tipShow:boolean=false
  private tipWords:string=''
    /**员工表分页 */
    private employeePage: Page = {
        num: 1,
        total: 0,
        size: 10
    }
    /**员工表加载状态 */
    private employeeLoading: boolean = false;
    /**选择的员工id */
    private employeeId: string = '';
    /**待分配列表查询选项 */
    private waitPartTransListOptions: Array<Option> = [
        {
            value: '0',
            label: '配件编码',
        },
        {
            value: '1',
            label: '配件名称',
        },
        {
            value: '2',
            label: '车型',
        },
        // {
        //     value: '3',
        //     label: '首字拼音',
        // },
    ]
    /**待分配列表选中的分配状态选项 */
    private waitPartTransListSelecteOption: string = "0"
    /**待分配列表查询内容 */
    private waitPartTransListContent: string = ""
    /**待分配列表表头 */
    private waitPartListTableHead: Array<Tableth> = [
        {
            title: "序号",
            minWidth: 50,
            type: "index"
        },
        {
            minWidth: 50,
            type: "selection"
        },
        {
            title: "品质",
            key: "quality",
            minWidth: 180
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
            minWidth: 100
        },
        {
            title: "全称",
            key: "fullName",
            minWidth: 200
        },
        {
            title: "单位",
            key: "minUnit",
            minWidth: 80
        },
        {
            title: "规格",
            key: "spec",
            minWidth: 80
        },
        {
            title: "车型",
            key: "adapterCarModel",
            minWidth: 100
        },
    ]

    private partListTableHead: Array<Tableth> = [
        {
            title: "序号",
            minWidth: 50,
            type: "index"
        },
        {
            minWidth: 50,
            type: "selection"
        },
        {
            title: "品质",
            key: "qualityName",
            minWidth: 180
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
            key: "name",
            minWidth: 100
        },
        {
            title: "全称",
            key: "fullName",
            minWidth: 200
        },
        {
            title: "单位",
            key: "unitld",
            minWidth: 80
        },
        {
            title: "规格",
            key: "spec",
            minWidth: 80
        },
        {
            title: "车型",
            key: "carModelName",
            minWidth: 100
        },
    ]

    /**待分配列表数据 */
    private waitPartListData = []
    /**待分配列表分页 */
    private waitPartListPage: Page = {
        num: 1,
        total: 0,
        size: 10
    }
    /**待分配列表加载状态 */
    private waitPartListLoading: boolean = false;
    private distPartLoading:boolean = false;
    /**已分配列表数据 */
    private distPartListData = []
    /**移入移出按钮是否可用 */
    private buttonOnDisable: boolean = true;
    private buttonOffDisable: boolean = true;
    /**待分配查询按钮是否可用 */
    private buttonWaitQuery: boolean = true;
    private selectionWaitPartArr:Array<any> = [];
    private selectionDistPartArr:Array<any> = [];
    // 上传 请求头
    private headers = {
        Authorization:'Bearer ' + Cookies.get(TOKEN_KEY)
    }
    // 上传地址
    private upurl:string = api.upxlxs;


  private defaultProps = {
    children: 'children',
    label: 'title'
  }
  private columns1:Array<any> = [
    {
      title: '序号',
      type: 'index',
      width:"100",
    },
    {
      title: '员工名称',
      key: 'userName',
      align:"center"
    },
    {
      title: '角色',
      key: 'roleName',
      align:"center"
    }
    ];
    private tableHeight:number = 0;
    private data1:Array<any> = [];
    private proLineTitle:string = "添加产品线";
    private proLineModel:boolean = false;

    private proLineFormObj = {
      id:"000000",
      parentId:"",
      title:""
    }
    private proLineForm = {
      id:"000000",
      parentId:"",
      title:""
    }

    private proLineSelectData:any = {
      lever : 0
    };

    private proLineFormValidate = {
      title:[
        {required:true, message: '名称必填', trigger: 'blur'}
      ]
    }
    //树形列表
    private treeData:Array<any> = [];


    private treeDataList:Array<any> = [
      {
        id:"000000",
        parentId:"",
        title:"顶级"
      }
    ]

    //产品线分配
    private proLineDis:boolean = false;
    private loading1:boolean = false;
    private StaffList:Array<any>=[];
    private StaffName:any = "";
    private proLineBrandName:any = "";
    private selectTableItem = {
      userName:"",
      userId:""
    };

    // mounted
    private async mounted() {
      // let data:any = {}
      //     data.systemType = 0
      //     data.page = 0
      //     data.size = 1000
      //   this.getStaff();
      //   const roles = await api.getRoles(data)
      //   if (roles.code == 0) {
      //       this.roleOptions = roles.data.content.map((el: any) => {
      //           return {
      //               label: el.displayName,
      //               value: el.displayName
      //           }
      //       })
      //       this.roleOptions.unshift({ label: "全部", value: '全部' })
      //   }

      //获取产品线列表
      this.getProLineList();
      this.$nextTick(()=>{
        let tableWrap:any = this.$refs.tabelWrap;
        // @ts-ignore
        this.tableHeight = tableWrap.offsetHeight-50;
      })
    }
    private activated(){
      this.getProLineList();
      this.proLineSelectData = {};
    }

    // methods
    //获取员工表
    private async getStaff() {
        this.employeeLoading = true;
        let params: any = {}
        params.size = this.employeePage.size;
        params.page = this.employeePage.num - 1;
        if(this.employeeSelectContent.trim().length > 0) {
            if (this.employeeSelecteOption == '0') {
                params.userName = this.employeeSelectContent.trim();
            }
            if (this.employeeSelecteOption == '1') {
                params.phone = this.employeeSelectContent.trim();
            }
        }
        if (this.DistributionStateSelecteOption != '0') {
            if (this.DistributionStateSelecteOption == '1') {
                params.allocation = 1;
            } else if(this.DistributionStateSelecteOption=='2') {
                params.allocation = 0;
            }
        }
        if (this.roleSelectOption != "全部") {
            params.roleName = this.roleSelectOption;
        }
        let res = await api.getStaffList(params);
        if (res.code == 0) {
            this.employeeLoading = false;
            this.employeeData = res.data.content;
            this.employeePage.total = res.data.totalElements
        } else {
            this.employeeLoading = false;
        }
    }
    //新增员工
   private addStaff(){
     this.staffModalShow=true;
     this.staffModalSearch();
   }
   //移出员工
  private removeStaff(){
    if(!this.employeeId){
      this.$message.warning('请勾选员工')
    }else{
      api.removeStaffList({empId:this.employeeId}).then(res=>{
        if(res.code==0){
          this.$message.success('移出成功');
          this.getStaff();
        }else if(res.code==1){
          this.$message.success('移出成功')
        }
      })
    }

  }
   //新增员工弹窗搜索
  private staffModalSearch(){
    this.staffModalSearchInfo.roleName=this.staffModalSearchInfo.roleName=='全部'?'':this.staffModalSearchInfo.roleName;
    let page = {
      size: this.staffModalPage.size,
      page: this.staffModalPage.num
    }
    let data = Object.assign(this.staffModalSearchInfo,page);
    api.getCanSelectStaff(data).then(res=>{
      if(res.code==0){
        this.staffModalList=res.data.content||[];
        this.staffModalPage.total=res.data.totalElements;

      }
    })
  }
  //新增员工弹窗页码change
  private staffModalPageChange(v:number){
      this.staffModalPage.num=v;
      this.staffModalSearch();
  }
  //新增员工弹窗条目change
  private staffModalPageSizeChange(v:number){
    this.staffModalPage.num=1;
    this.staffModalPage.size = v;
    this.staffModalSearch();
  }
  //新增员工弹窗选择
  private staffModalSelect(){
      if(this.selectStaffList.length<1){
        this.$message.warning('请选择员工')
      }else{
        api.addStaff(this.selectStaffList).then(res=>{
          if(res.code==0){
            this.$message.success('添加成功');
            this.getStaff();
          }else{
            this.$message.success('添加失败');
          }
        })
      }
  }
  //新增员工勾选
  private staffModalSelectData(v){
      if(v.length<1){
        this.selectStaffList = [];
      }else{
        v.map((item:any)=>{
          this.selectStaffList.push({empId:item.id})
        })
      }
  }
  //新增员工弹窗关闭
  private CancelStaffModal(){
      this.selectStaffList=[];
  }
  //获取所有品牌
  private getPartBrandAll(treeData) {
    getParamsBrand().then(res => {
      let arrData = res.data||[]
      if(arrData.length==0){
        return this.$Message.error("产品线品牌获取失败");
      }
      this.partBrandData = arrData.map((item,index) => {
        let objData:any = {}
        objData.name = item;
        objData.code = `item${index}`
        objData.isDisable = false;
        let brandArr = treeData.filter(item1=>item1.title==item)
        if(brandArr.length>0){
          objData.isDisable = true;
        }
        return objData;
      })
    });
  }
    // 员工列表查询
    private queryStaff() {
        this.getStaff();
    }

    //  翻页-员工列表
    private employeeChangePage(p: number) {
        this.employeePage.num = p;
        this.getStaff();
    }
    // 修改每页显示条数-员工列表
    private employeeChangeSize(size: number) {
        this.employeePage.num = 1;
        this.employeePage.size = size;
        this.getStaff();
    }

    // 名字loginName
    private loginName:string = "";
    // 选取员工列表
    private currentRow(row: any) {
        let id: string = row.id;
        this.employeeId = id;
        this.buttonWaitQuery = false;
        this.loginName = row.loginName;
        this.waitPartListLoading = false;
        this.distPartLoading = false;
        this.getwaitEmps();
        this.getEmps();
    }

    // 获取待分配列表
    private async getwaitEmps() {
        this.waitPartListData = [];
        this.waitPartListLoading = true;
        let params: any = {}
        let data: any = {};
        data.empId = this.employeeId;
        if(this.waitPartTransListContent){
          data.partCode = this.waitPartTransListContent;
        }
        if(this.waitPartTransListBrand && this.waitPartTransListBrand!='9999'){
          data.partBrandId = this.waitPartTransListBrand;
        }
        params.size = this.waitPartListPage.size;
        params.page = this.waitPartListPage.num - 1;
        if(this.waitPartTransListContent.trim().length > 0) {
            switch (this.waitPartTransListSelecteOption) {
                case "0":
                    data.partCode = this.waitPartTransListContent;
                    break;
                case "1":
                    data.fullName = this.waitPartTransListContent;
                    break;
                case "2":
                    data.adapterCarModel = this.waitPartTransListContent;
                    break;
                case "3":
                    data.keyWord = this.waitPartTransListContent;
                    break;
                default:
                    break;
            }
        }
        let res: any = await api.findByEmp(params, data);
        if(res.code == 0) {
            this.waitPartListLoading = false;
            this.waitPartListData = res.data.content.map((el:any) => {
                let obj = {...el};
                if(obj.isDistribution != null) {
                    obj._disabled = true;
                }
                return obj;
            });
            this.waitPartListPage.total = res.data.totalElements;
        }
    }

    // 获取已分配列表
    private async getEmps() {
        this.distPartLoading = true;
        this.distPartListData = [];
        let params: any = { empId: this.employeeId }
        let res: any = await api.findAttByEmpId(params);
        if(res.code == 0) {
            this.distPartLoading = false;
            this.distPartListData = res.data;
        }
    }

    //添加产品线
    private addProLine(type){
      let proLineForm:any = this.$refs.proLineForm;
      proLineForm.resetFields();
      this.proLineBrandName = "";
      this.proLineSelectData.lever = 0;
      if(this.proLineSelectData.hasOwnProperty("id")){
        // @ts-ignore
        this.proLineForm = {...this.proLineSelectData};
      }
      if(type=='add'){
        this.proLineTitle = "添加产品线";
        this.proLineForm.title = "";
      }
      if(type=='edit'){
        this.proLineTitle = "编辑产品线";
        if(!this.proLineSelectData.hasOwnProperty("id")){
          return this.$message.error("请选择要编辑的产品线");
        }
        let selectBrand = this.partBrandData.filter(item => item.name==this.proLineForm.title)
        if(selectBrand.length>0){
          let refProLineBrandName:any = this.$refs.proLineBrandName;
          refProLineBrandName.setQuery(selectBrand[0].name);
          this.$nextTick(()=>{
            this.proLineBrandName = selectBrand[0].code
          })
        }
      }
      // @ts-ignore
      this.proLineForm.idCopy = this.proLineForm.id;
      if(!this.proLineForm.parentId){
        this.proLineForm.id = '000000';
      }else{
        this.proLineForm.id = this.proLineForm.parentId;
        this.proLineSelectData.lever = 1;
        // @ts-ignore
        this.proLineForm.lever = 1;
      }
      this.proLineModel = true;
    }

    private proLineSubmit(v){
      let refsName:any = this.$refs[v];
      refsName.validate(async (valid) => {
        if (valid) {
          let req = {...this.proLineForm}
          if(this.proLineTitle=="添加产品线"){
            if(req.id=="000000"){
              Reflect.deleteProperty(req,'parentId');
            }else{
              req.parentId = req.id
            }
            Reflect.deleteProperty(req,'id');
          }
          if(this.proLineTitle=="编辑产品线"){
            // @ts-ignore
            req.id = req.idCopy;
            Reflect.deleteProperty(req,'idCopy');
          }
          let rep = await api.addOrEditProLine(req);
          if(rep.code==0){
            this.$message.success("添加成功");
            this.proLineModel = false;
            this.proLineForm = this.proLineFormObj;
            this.proLineSelectData = {};
            this.getProLineList();
          }
        }
      })
    }
    //获取产品线列表
    private async getProLineList(){
      let rep = await api.getProLine();
      if(rep.code==0){
        this.treeData = rep.data.filter(item => item.lever===0);
        this.treeData.map(item => {
          let arrData = rep.data.filter(item1 => item1.lever===1&&item1.parentId==item.id);
          item.children = arrData;
          if(arrData.length==0){
            item.disabled = true;
          }
        })
        this.treeDataList =[this.treeDataList[0],...rep.data];

        this.getProLineDisList(rep.data);

        this.getPartBrandAll(rep.data)
      }
    }

    //产品线点击选中
    private handleNodeClick(data){
      // @ts-ignore
      this.selectTableItem = {};
      this.proLineSelectData = {...data}
      let sourceData:Array<any> = [];
      if(data.lever==0){
        sourceData = this.treeDataList.filter(item => item.parentId==data.id)
      }else{
        sourceData.push(data)
      }
      this.getProLineDisList(sourceData);
    }

    //删除产品线
    private async deleteProLine(){
      if(!this.proLineSelectData.hasOwnProperty("id")){
        return this.$message.error("请选择要删除的数据")
      }
      let rep = await api.deleteProLine(this.proLineSelectData);
      if(rep.code==0){
        this.$message.success("删除成功")
        this.getProLineList();
      }
    }
    //打开产品线分配层
    private disProLine(){
      this.proLineDis = true;
      this.StaffName = "";
      let treeRef:any = this.$refs.tree;
      treeRef.setCheckedKeys([]);
      this.StaffList = [];
      let StaffNameRef:any = this.$refs.StaffName;
      StaffNameRef.query = "";
      if(this.selectTableItem.hasOwnProperty("userId")){
        StaffNameRef.query = this.selectTableItem.userName;
        this.selectStaff(this.selectTableItem.userId)
      }else{
        this.StaffName = "";
      }
    }

    private changeLever(v){
      if(this.proLineForm.id&&this.proLineForm.id!='000000'){
        this.proLineSelectData.lever = 1;
      }else{
        this.proLineSelectData.lever = 0;
      }
    }

    //获取员工
    private async getStaffList(query){
      if (query !== '') {
        this.loading1 = true;
        let rep = await api.getAllStaff({"staffName":query});
        this.loading1 = false;
        if(rep.code==0){
          this.StaffList = rep.data.content||[]
        }
      } else {
        this.StaffList = [];
      }
    }

    private async proLineDisSubmit(){
      if(this.selectTableItem.userId&&(this.selectTableItem.userId==this.StaffName||this.StaffName=="")){
        this.StaffName = this.selectTableItem.userId;
      }
      if(this.StaffName){
        let treeRef:any = this.$refs.tree;
        let treeSelectData = treeRef.getCheckedNodes();
        let newArr = treeSelectData.filter(item => item.id&&item.lever==1).map(item => item.id)
        let reqArr:Array<any> = [];
        let arrList = this.StaffList.filter(item => item.id == this.StaffName);
        if(arrList.length == 0){
          return
        }
        let rolesNames = "";
        if(arrList[0].roles&&arrList[0].roles.length>0){
          rolesNames = arrList[0].roles.filter(item => item.displayName).map(item=> item.displayName).join("，");
        }
        if(newArr.length>0){
          newArr.map(item => {
            let req:any = {
              userId:arrList[0].id,
              userName:arrList[0].staffName,
              roleName:rolesNames||"",
              classTypeId:item
            }
            reqArr.push(req)
          })
        }else{
          let req:any = {
            userId:arrList[0].id,
            userName:arrList[0].staffName,
            roleName:rolesNames||""
          }
          reqArr.push(req)
          // return this.$Message.error("请选择要分配的产品线品牌");
        }
        let rep = await api.setProLineDis(reqArr)
        if(rep.code==0){
          this.$message.success("分配成功");
          this.getProLineList();
          this.proLineDis = false;
          // @ts-ignore
          this.selectTableItem = {};
        }
      }else{
        this.$message.error("请选择员工");
      }
    }
    //获取分配员工列表
    async getProLineDisList(ids){
      let arrData = ids.filter(item => item.lever==1).map(item => {
        let objData:any = {}
        objData.id = item.id;
        return objData
      })
      let rep = await api.getProLineDis(arrData)
      if(rep.code==0){
        this.data1 = rep.data||[];
      }
    }

    private proLineBrandNameChange(v){
      if(v){
        this.proLineForm.title = v.label
      }
    }



    // 查询待分配列表
    private queryWaitPart() {
        this.getwaitEmps();
    }

    //  翻页-待分配列表
    private waitPartListChangePage(p: number) {
        this.waitPartListPage.num = p;
        this.getwaitEmps();
    }
    // 修改每页显示条数-待分配列表
    private waitPartListChangeSize(size: number) {
        this.waitPartListPage.num = 1;
        this.waitPartListPage.size = size;
        this.getwaitEmps();
    }

    // 选择待选
    private selectWaitPart(selection) {
        this.selectionWaitPartArr = selection;
    }

    // 选择已分配
    private selectDistPart(selection) {
        this.selectionDistPartArr = selection;
    }

    // 移入
    private async moveOn() {
        if(this.selectionWaitPartArr.length <=0 ) {
            return this.$Message.error('请选择配件')
        }
        let data:any = this.selectionWaitPartArr.map((el:any) => {
            return {
                partCode: el.partCode,
                empId: this.employeeId,
                partBrandCode: el.partBrandCode,
                partId: el.code,
                partInnerId: el.code,
                partBrand: el.partBrand,
                empName: this.loginName,
                qualityName : el.quality,
                name : el.partStandardName,
                fullName : el.fullName,
                unitld : el.minUnit,
                spec : el.spec,
                carModelName : el.adapterCarModel,
            }
        })
        this.distPartListData = JSON.parse(JSON.stringify(this.selectionWaitPartArr))
        this.selectionWaitPartArr = [];
        let res:any = await api.employeeAddPart(data);
        if(res.code == 0) {
            this.$Message.success('移入成功')
        }
        this.getwaitEmps();
        this.getEmps();
    }

    //一键移入
    private async moveAllOn(){
      if(this.employeeId){
        this.tipShow=true;
        this.tipWords='确定将所有配件一键移入？';
      }else{
        this.$message.warning('请勾选员工')
      }

    }
    private async submitTip(){
      if(this.tipWords.includes('一键移入')){
        let data:any = {};
        data ={
          empId: this.employeeId,
          empName: this.loginName,
        }
        if(this.waitPartTransListContent){
          data.partCode=this.waitPartTransListContent;
        }
        if(this.waitPartTransListBrand&&this.waitPartTransListBrand!='9999'){
          data.partBrandId=this.waitPartTransListBrand;
        }
        this.distPartListData = JSON.parse(JSON.stringify(this.waitPartListData))
        let res:any = await api.employeeAddAllPart(data);
        if(res.code == 0) {
          this.$Message.success('移入成功')
        }
      }else if(this.tipWords.includes('一键移出')){
        let res:any = await api.employeeDeleteAllPart({empId:this.employeeId});
        if(res.code == 0) {
          this.$Message.success('移出成功')
        }
      }
      this.getwaitEmps();
      this.getEmps();
    }
    // 移出
    private async moveOff() {
        if(this.selectionDistPartArr.length <=0 ) {
            return this.$Message.error('请选择配件')
        }
        let data:any = this.selectionDistPartArr.map((el:any) => {
            return {
                id: el.id
                // id: el.empAttributeId,
                // attId: el.id,
                // empId: this.employeeId,
            }
        })
        this.selectionDistPartArr = [];
        let res:any = await api.employeeDeletePart(data);
        if(res.code == 0) {
            this.$Message.success('移出成功')
        }
        this.getwaitEmps();
        this.getEmps();
    }
    //一键移出
  private async moveAllOff(){
      if(this.employeeId){
        this.tipShow=true;
        this.tipWords='确定将所有配件一键移出？';
      }else{
        this.$message.warning('请勾选员工')
      }

  }
  //关闭提示弹窗
  private async CancelTipModal(){
    this.tipShow=false;
    this.tipWords='';
  }
    // 上传前
    private handleBeforeUpload() {
        let refs:any =  this.$refs;
        refs.upload.clearFiles();
    }
    // 上传成功
    private handleSuccess(res, file){
        let self:any = this;
        if(res.code == 0) {
            self.$Message.success('导入成功');
            self.$Message.success(res.data);
            // this.getwaitEmps();
            // this.getEmps();
        } else {
            self.$Message.error(res.message);
        }
    }

    private down() {
        down('1100000000');
    }

    private async selectStaff(v){
      if(v){
        let req = {
          userId:v
        }
        let rep = await api.getAllocatedProLine(req);
        if(rep.code==0){
          let treeRef:any = this.$refs.tree;
          treeRef.setCheckedNodes(rep.data);
        }
      }
    }

    private selectTable(v){
      this.selectTableItem = v;
    }
}
