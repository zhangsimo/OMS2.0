import { Vue, Component } from "vue-property-decorator";
import ClientData from "./components/ClientData.vue";
// @ts-ignore
import More from "./components/More";
// @ts-ignore
import "../../../lease/product/lease.less";
// @ts-ignore
import moment from "moment";
// @ts-ignore
import QuickDate from "../../../../components/getDate/dateget";
// @ts-ignore
import xeUtils from "xe-utils";
// @ts-ignore
import { hideLoading, showLoading } from "@/utils/loading";
// @ts-ignore
import SelectSupplier from "./compontents/supplier/selectSupplier";
//import Tab from "./component/Tab.vue"
import Cookies from 'js-cookie';
import { TOKEN_KEY } from "@/libs/util";
// import SelectPartCom from "./compontents/selectPartCom";
// @ts-ignore
import SelectPartCom from "@/view/goods/goodsList/components/selectPartCom.vue";
import Print from "./component/Print.vue";
import {
  getCustomerInformation,
  getNewClient,
  getCustomerDetails
} from "@/api/system/essentialData/clientManagement";
import { down } from "./api/index";
import * as api from "@/api/procurement/plan";
import * as all from "@/api/afterSale/CustomerClaimsRegistration/index";
// @ts-ignore
import { showLoading, hideLoading } from "@/utils/loading"
@Component({
  components: {
    ClientData,
    More,
    QuickDate,
    SelectSupplier,
    SelectPartCom,
    Print
  }
})
export default class Customs extends Vue {

  //---------data
  // <!--      客户资料-->
  private nameChange: boolean = false
  //树形结构
  private treeDiagramList: any = []
  private provinceArr: any = []
  private clientList: any = {


  }
  //查看客户id
  private chaId: any = ""
  //默认选中的行高亮
  private highlight: any = {}
  //打印Id
  private mainId: any = ""
  //关联Id
  private relevanceId: any = ''
  //关联数组
  private relevanceList: any = []
  // private flag:boolean=false
  private storeId: any = ""
  private showit: boolean = true
  //更多的开关
  private showMore: Boolean = false
  //查看客户开关
  private clientDataShow: boolean = false
  private saveLoading: Boolean = false
  private commitLoading: boolean = false
  private cancelLoading: boolean = false
  //记录时间
  private queryDate: any = []
  private purchaseType: any = 99 //查询选项
  private split1: number = 0.2
  private purchaseTypeArr: any = [
    { label: "所有", value: 99 },
    { label: "草稿", value: 0 },
    { label: "已提交", value: 1 },
    { label: "已完成", value: 2 },
  ]
  private advanced: boolean = false
  private allList: any = []

  private formPlan: any = {
    storeId: ""
  }
  private moreQueryList: any = {

  }
  private changeNumber = ({ cellValue }) => {
    const reg = /^[1-9]\d*$/;
    if (!reg.test(cellValue)) {
      return Promise.reject(new Error("数量输入不正确"));
    }
  }
  //--------左边的table 
  //记录左边点击的数据 
  //选中的行
  private bcflag: boolean = false
  private row: any = {
    orderSignStatus: "草稿"
  }
  private rowid: any = ''
  private tjflag: boolean = false
  private bjFlag: boolean = false
  private flag: boolean = false
  private rightTableHeight: any = 0;
  private leftTableHeight: any = 500
  private leftClickItemId: any = null

  private Left: any = {
    page: {
      total: 0,
      size: 10,
      num: 1
    }
    //左边的表格

  }
  private tableList: any = []


  //请求头
  private headers = {
    Authorization: 'Bearer ' + Cookies.get(TOKEN_KEY)
  };
  //导入
  private upurlInnerId = all.getup;//导入地址
  //要删除的配件
  private delArr: any = []
  //右上的表格
  //表单数据
  private form: any = {
    units: "",
    guestId: "",
    storeName: "",
    afterSaleDate: moment(new Date()).format("YYYY-MM-DD"),
    orderMan: "",
    remark: "",
    serviceId: "",
    moblenumber: '',//手工单号

  }
  //右上的数据
  private details:Array<any>=new Array<any>()
  private currentData: any = []
  private Leftcurrentrow: any = {

  }
  $refs: {
    upload: HTMLFormElement, xTable2: HTMLFormElement, child: HTMLFormElement,
    SelectPartRef: HTMLFormElement, selectSupplier: HTMLFormElement,
    paneLeft: HTMLFormElement, planForm: HTMLFormElement, planBtn: HTMLFormElement, more: HTMLFormElement,
    printZF: HTMLFormElement, xTable: HTMLFormElement, morequeryModal: HTMLFormElement
  }
  private keydown() { }
  //更多搜索
  private async getList() {
    let data: any = {};
    let params: any = {}
    params.page = this.Left.page.num - 1;
    params.size = this.Left.page.size;
    let moreData: any = this.$refs.more
    moreData.moreData.acceptEnterTimeEnd ? data.endTime = moreData.moreData.acceptEnterTimeEnd : ""
    moreData.moreData.acceptEnterTimeStart ? data.startTime = moreData.moreData.acceptEnterTimeStart : ""
    moreData.moreData.allotEnterTimeEnd ? data.orderEndTime = moreData.moreData.allotEnterTimeEnd : ""
    moreData.moreData.allotEnterTimeStart ? data.orderStartTime = moreData.moreData.allotEnterTimeStart : ""
    //理赔单位
    moreData.moreData.orderUnit ? data.guestName = moreData.moreData.orderUnit : ""
    //配件内码
    moreData.moreData.partCode ? data.partInnerId = moreData.moreData.partCode : ""
    //理赔单号 
    moreData.moreData.serviceId ? data.serviceId = moreData.moreData.serviceId : ""
    //配件编码
    moreData.moreData.code ? data.partCode = moreData.moreData.code : ""
    //配件名称
    moreData.moreData.partName ? data.partName = moreData.moreData.partName : ""
    //创建人
    moreData.moreData.orderMan ? data.createUname = moreData.moreData.orderMan : ""
    //console.log(this.purchaseType)
    this.purchaseType == 99 ? data.orderSign = "" : data.orderSign = this.purchaseType
    console.log(data)
    // showLoading()
    let res: any = await all.getListSale(params, data);
    if (res.code == 0) {

      if (res.data.content && res.data.content.length > 0) {
        this.tableList = res.data.content.map(el => {
          el.orderDate ? el.orderDate = moment(el.orderDate).format("YYYY-MM-DD") : el.orderDate = ""
          el.createTime = moment(el.createTime).format("YYYY-MM-DD")
          switch (el.orderSign || "") {
            case 0:
              el.orderSignStatus = "草稿";
              break;
            case 1:
              el.orderSignStatus = "已提交";
              break;
            case 2:
              el.orderSignStatus = "已完成";
              break;
            default:
              el.orderSignStatus = "草稿"
              break;
          }
          return el;
        });
        this.$set(this.Left.page, "total", res.data.totalElements)
        // this.row = res.data.content[0];
        res.data.content[0].details.length != 0 ? this.details = res.data.content[0].details : this.details = []

        // hideLoading()
        let hg = this.filters(this.tableList);
        console.log(hg,1)
        let row:any = null
        if (hg !== undefined) {
          row = hg
        } else {
          row = this.tableList[0]
        }
        this.details=row.details
        this.$refs.xTable.setCurrentRow(row);

        //给表单赋值
        this.format(res.data.content)
      } else {
        this.tableList = []
        this.details = []
        this.$set(this.Left.page, "total", 0)
      }
    }
  }
  //给表单赋值
  private format(data) {
    this.form.id=data[0].id
    this.form.serviceId = data[0].serviceId
    this.form.guestId = data[0].guestId
    this.form.afterSaleDate = moment(data[0].afterSaleDate).format("YYYY-MM-DD")
    data[0].manualCode ? this.form.moblenumber = data[0].manualCode : this.form.moblenumber = "";
    this.form.remark = data[0].remark
    this.form.units = data[0].guestName
    this.form.serviceId = data[0].serviceId
    this.highlight = data[0]
    this.row = data[0];
    console.log(data[0].id)
    this.mainId=data[0].id
    this.relevanceList = data;
    if(data.length==1&&this.flag==false){
      this.peiflag=true
    }
      if (data[0].orderSignStatus == "草稿") {
        this.flag = true;
        this.bcflag = true
        this.tjflag = true
        this.mainId = data[0].id
      
    }
  }
  //左边表格数据
  private async getLeftLists() {
    let data: any = {};
    if (this.queryDate) {
      data.startTime = this.queryDate[0];
      data.endTime = this.queryDate[1];
    } else {
      data.startTime = ""
      data.endTime = ""
    }
    let params: any = {}
    this.purchaseType == 99 ? data.orderSign = "" : data.orderSign = this.purchaseType
    params.page = this.Left.page.num - 1;
    params.size = this.Left.page.size;
    // showLoading()
    let res: any = await all.getListSale(params, data);
    if (res.code === 0) {
      if (res.data.content && res.data.content.length > 0) {
        this.tableList = res.data.content.map(el => {
          el.orderDate ? el.orderDate = moment(el.orderDate).format("YYYY-MM-DD") : el.orderDate = ""
          el.createTime = moment(el.createTime).format("YYYY-MM-DD")
          switch (el.orderSign || "") {
            case 0:
              el.orderSignStatus = "草稿";
              break;
            case 1:
              el.orderSignStatus = "已提交";
              break;
            case 2:
              el.orderSignStatus = "已完成";
              break;
            default:
              el.orderSignStatus = "草稿"
              break;
          }
          return el;
        });
        this.$set(this.Left.page, "total", res.data.totalElements)
        // hideLoading()
        let hg = this.filters(this.tableList);
        //console.log(hg)
        let row:any = null
        if (hg !== undefined) {
          row = hg
        } else {
          
          row = this.tableList[0]
        }
        this.details=row.details
        // if(this.bjFlag!=false){
        //   row = this.tableList[0]
        // }
        this.$refs.xTable.setCurrentRow(row);
        //给表单赋值
        this.format(res.data.content)
      } else {
        this.tableList = []
        this.details = []
        this.$set(this.Left.page, "total", 0)
      }
    }
  }
  //快速查询
  private getDataQuick1(v) {
    this.queryDate = v;
    this.Left.page.num = 1;
    this.getLeftLists();
  }
  //获取类型
  private getDataType1(v) {

    this.Left.page.num = 1;
    this.purchaseType = v;
    this.getLeftLists()
  }
  //更多按钮
  private addmore() {
    this.showMore = true;
  }
  private Moresearch() {

  }
  //新增
  private add() {
    this.peiflag=true
    this.tjflag = false
    this.bcflag = true
    this.flag = true;
    this.bjFlag = true
  
    if (this.tableList.length === 0) {
    } else {
      if (this.tableList[0]["xinzeng"] === "1") {
        this.$Message.info(
          "当前加工单列表已有一个新增单等待操作,请先保存当前操作新增单据"
        );
        return;
      }
    }
    if(this.tableList.length > 0){
  this.form.id=""
    }
  this.mainId=""
    this.row.orderSignStatus = "草稿"
    this.details = []
    this.form.serviceId = ""
    this.form.guestId = ""
    this.form.afterSaleDate = moment(new Date()).format("YYYY-MM-DD")
    this.form.moblenumber = ""
    this.form.remark = ""
    this.form.units = ""
    this.form.serviceId = ""
    let item: any = {
      code: "2",
      index: 1,
      xinzeng: "1",
     
    };
    this.tableList.unshift(item);
    this.$refs.xTable.setCurrentRow(this.tableList[0]);
    // this.tableList.map((item, index) => {
    //   item.index = index + 1;
    //   item._highlight = false;
    // });

  }
  //提交
  private async tijiao() {
    if (!this.form.units || !this.form.afterSaleDate) {
      return this.$Message.error("*为必填项");
    }
    if (this.details.length == 0) {
      return this.$Message.error("请添加明细");
    }
    let hh = this.details.every((item, i) => {
      return item.afterSaleReason != null
    })
    let ge = this.details.every((item, i) => {
      return item.afterSaleQty != 0 && item.afterSaleQty != null
    })
    if (!ge) { return this.$Message.info("理赔数量不能为0") }
    if (!hh) { return this.$Message.info("请填写理赔原因") }
    Object.assign(this.Leftcurrentrow, this.form)

    this.Leftcurrentrow.details = this.details
    this.Leftcurrentrow.afterSaleDate = this.Leftcurrentrow.afterSaleDate
      ? moment(this.Leftcurrentrow.afterSaleDate).format("YYYY-MM-DD")
      : "";
    let res: any = await all.submitSale(this.Leftcurrentrow);
    if (res.code == 0) {
      this.getLeftLists()
      // this.$refs.xTable.setCurrentRow(this.highlight);
      this.flag = false
      this.$Message.success("提交成功");
      this.bcflag = false
      this.Leftcurrentrow = {
      }
    }

  }
  //高亮单元行的方法
  private filters(data) {
    return data.find(ele => ele.id === this.mainId)
  }
  //打印
  private stamp() {
    if (!this.mainId) {
      return this.$Message.error("请选择要打印的单据");
    }
    let order: any = {};
    order.id = this.mainId;
    let printZF = this.$refs.printZF;
    printZF.openModal(order)
    setTimeout(() => {
        this.getLeftLists()
    }, 0);
    //this.$refs.xTable.setCurrentRow(this.highlight);
    //this.$refs.getLeftLists()
   // location.reload()

  }
  //上传成功
  private onSuccess(response) {
    if (response.code == 0) {
      if (response.data.list && response.data.list.length > 0) {
        this.warning(response.data.list[0]);
      }
      //this.getLeftLists();
      // this.formPlan = {
      //   code: ""
      // };
      this.$Message.success("导入成功");
      this.getLeftLists()
    } else {
      this.$Message.error("上传失败");
    }
  }
  private beforeUpload() {
    this.$refs.upload.clearFiles();
  }
  private beforeUploadInnerId() { }
  private onFormatError() { }
  private warning(nodesc) {
    this.$Notice.warning({
      title: "上传错误信息",
      desc: nodesc
    });
  }
  //按照配件内码导入
  private getRUlInnerId() {
    this.upurlInnerId = all.getup + '?id=' + this.mainId;
  };
  //配件内码模板----下载魔板
  private downInnerId() {
    down('3800000000')

  }
  private getSupplierNamea(val) {
    console.log(val.id)
    this.chaId= val.id
    this.$set(this.form, 'guestId', val.id)
    this.$set(this.form, 'units', val.fullName)
  }
  //删除配件
  private shanchu() {
    //console.log(this.rightTop.details)
    if (this.delArr.length === 0) {
      return this.$Message.info("请勾选要删除的配件");
    }
    this.delArr.map(el => {
      this.details.map((el2, idx) => {
        if (el.id == el2.id) {
          this.details.splice(idx, 1)
          idx = idx - 1;
        }
      })
    })

    this.flag = true
  }
  //添加配件
  private changep() {
    this.$refs.SelectPartRef.init();
  }
  private afterSaleQtyChange(row) {
    if (row.isAddPart == 0) {
      row.untreatedQty = row.afterSaleQty
    }
    this.updateFooterEvent()
  }
  // 在值发生改变时更新表尾合计
  private updateFooterEvent() {
    let xTable = this.$refs.xTable2;
    xTable.updateFooter();
  }
  //计算底部
  private footerMethod({ columns, data }) {
    return [
      columns.map((column, columnIndex) => {
        if (columnIndex === 0) {
          return "和值";
        }
        if (
          [
            "afterSaleQty",
            "processedQty",
            "untreatedQty"
          ].includes(column.property)
        ) {
          return this.$utils.sum(data, column.property);
        }
        return null;
      })
    ];
  }
  //理赔单位的对勾
  private addSuppler() {
    this.$refs.selectSupplier.init();
  }
  //更多的弹框回调
  private openMoreflag(val) {
    this.showMore = val;
  }
  //回调弹框表单里的数据
  private openMoreData(val) {
    this.Left.page.num = 1;
    this.getList()
  }
  //查看客户
  private watchke() {
    if (!this.chaId) {
      return this.$Message.error("请选择一条客户信息");
    }
    let data: any = {};
    data.id = this.chaId;
    this.$refs.child.$refs.form.resetFields()
    getCustomerDetails(data).then((res: any) => {
      console.log(res)
      if (res.code == 0) {
        this.clientList = res.data;
        this.clientList.isNeedPack = this.clientList.isNeedPack == 1 ? true : false
        this.clientList.isFatCompany = this.clientList.isFatCompany == 1 ? true : false
        this.clientList.isDisabled = this.clientList.isDisabled == 1 ? true : false
        this.clientList.isSupplier = this.clientList.isSupplier == 1 ? true : false
        this.clientList.belongSystem = JSON.parse(this.clientList.belongSystem).value
        this.$refs.child.placeList = this.clientList.guestLogisticsVOList;
        this.$refs.child.relevanceClientShow = this.clientList.guestVOList;
        this.$refs.child.invoice = this.clientList.guestTaxpayerVOList;
        this.$refs.child.financeList = this.clientList.guestAccountVoList
        this.nameChange = true;
        this.getLeftLists()
      }
     
      this.clientDataShow = true;
    });

  }
  //保存
  //配件禁用
  private peiflag=false
  private async baocun() {
   
    if (!this.form.units || !this.form.afterSaleDate) {
      return this.$Message.error("*为必填项");
    }
    if (this.row.orderSignStatus != "草稿") {
      this.$Message.info("只有草稿状态才能进行保存操作");
      return;
    }
    Object.assign(this.Leftcurrentrow, this.form)
    this.Leftcurrentrow.details = this.details
    this.Leftcurrentrow.afterSaleDate = this.Leftcurrentrow.afterSaleDate
      ? moment(this.Leftcurrentrow.afterSaleDate).format("YYYY-MM-DD")
      : "";
    let res: any = await all.saveSale(this.Leftcurrentrow);
    if (res.code == 0) {
      this.bcflag = false
      this.tjflag = true
      this.getLeftLists()
      this.flag = false;
      this.bjFlag = false
      this.peiflag=false
      this.$Message.success("保存成功");
      this.Leftcurrentrow = {
      }
    }
  }
  //------左边的table 
  private changePage(v) {
    this.Left.page.num = v
    this.getLeftLists()
  }
  private changeSize(size) {
    this.Left.page.num = 1
    this.Left.page.size = size
    this.getLeftLists()
  }
  //添加配件
  private getPartNameList(val) {
    console.log(val)
    let datas = [...val].map(el => {
      //el.orderQty = undefined;
      return el;
    });
    let arr: any = [];

    datas.forEach((item) => {
      let filterArr = this.details.map(({ partCode }) => partCode)
      if (!filterArr.includes(item.partCode)) {
        arr.push(item)
      }
    })
    arr.forEach(item => {
      delete item.id;
      this.details.unshift(item);
    });
    //this.setFilterArr(this.Leftcurrentrow.details || [])
    if (arr.length != datas.length) {
      return this.$Message.info("配件已存在请勿重复添加");
    }
    this.$Message.success("已添加");


  }
  //选中的行
  private getOneClinet(data) {
    if (this.flag == true && data.row.orderSignStatus && this.bjFlag) {
      this.$Modal.confirm({
        title: "您正在编辑单据，是否需要保存",
        onOk: () => {
          //this.flag=true
          this.baocun();
        },
        onCancel: () => {
          this.tableList.shift(this.tableList[0])

          this.flag = false;
        }
      });
      return;
    }
    this.peiflag=false
    this.currentData = []
    this.bcflag = true
    if (data.row.orderSignStatus == "草稿") {
      this.tjflag = true
    }
    // this.tjflag=true
    this.highlight = data.row
    this.row = data.row
    this.chaId = data.row.guestId
    this.form.id = data.row.id
    this.mainId = data.row.id
    this.form.serviceId = data.row.serviceId
    this.form.guestId = data.row.guestId
    this.form.afterSaleDate = moment(data.row.afterSaleDate).format("YYYY-MM-DD")
    data.row.manualCode ? this.form.moblenumber = data.row.manualCode : this.form.moblenumber = "";
    data.row.manualCode ? this.form.moblenumber = data.row.manualCode : this.form.moblenumber = ""
    this.form.units = data.row.guestName

    this.details = data.row.details
    if (data.row.orderSignStatus != "草稿") {
      this.flag = false
    } else {
      this.flag = true
    }
  }
  //手动全选触发
  private selectAllEvent(e) {
    this.delArr = e.selection
  }

  //选中当前行
  private currentChangeEvent(e) {
    // this.clientList = e.row
    console.log(e.row)
  }
  private logDataLoading: boolean = false
  //获取日志
  private async logDataMethod({ row }) {
    this.logDataLoading = true;
    let data = {
      detailId: row.id
    }
    if (this.row.orderSignStatus == "草稿") {
      return;
    }
    let res: any = await all.registerPartsProcesLog(data)
    if (res.code === 0) {
      this.currentData = (res.data || []).map(el => {
        switch (el.recordType) {
          case "1":
            el.recordTypeStatus = "理赔出库";
            break;
          case "2":
            el.recordTypeStatus = "理赔入库";
            break;
        }
        return el;
      });
      this.logDataLoading = false;
    } else {
      this.logDataLoading = false;
    }
  }

  //选中单个框
  private selectChangeEvent(e) {
    console.log(e.row)
    this.delArr.push(e.row)
  }
  private keydownEvent() {

  }
  mounted() {
   
  }

}