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
// import {showLoading, hideLoading} from "@/utils/loading"
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
    isSupplier: true


  }
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
  private printList: any = []
  private moreList: any = {}
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
    },
    tableList: [

    ]
  }
  //右上的数据
  //请求头

  private headers = {
    Authorization: 'Bearer ' + Cookies.get(TOKEN_KEY)
  };//请求头
  //导入
  private upurl = api.outgetup;//导入地址
  private upurlInnerId = api.outgetupInnerId //按照内码 导入配件
  // private upurl = api.outgetup;//导入地址
  // private upurlInnerId=api.outgetupInnerId //按照内码 导入配件
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
  private rightTop: any = {
    details: [
    ],
  }
  private Leftcurrentrow: any = {

  }
  //右下的表格
  private currentData: any = [
  ]
  //-------methods
  //   : "2021-01-19 23:59:59"
  // acceptEnterTimeStart: "2020-12-01 00:00:00"
  // allotEnterTimeEnd: "2021-01-22 23:59:59"
  // allotEnterTimeStart: "2020-12-02 00:00:00"
  $refs: {
    upload: HTMLFormElement, xTable2: HTMLFormElement, child: HTMLFormElement,
    SelectPartRef: HTMLFormElement, selectSupplier: HTMLFormElement,
    paneLeft: HTMLFormElement, planForm: HTMLFormElement, planBtn: HTMLFormElement, more: HTMLFormElement,
    printZF: HTMLFormElement
  }
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
    moreData.moreData.orderId ? data.guestId = moreData.moreData.orderId : ""
    //配件内码
    moreData.moreData.partCode ? data.partInnerId = moreData.moreData.partCod : ""
    //理赔单号 
    moreData.moreData.serviceId ? data.serviceId = moreData.moreData.serviceId : ""
    //配件编码
    moreData.moreData.partCode ? data.partCode = moreData.moreData.partCode : ""
    //配件名称
    moreData.moreData.partName ? data.partName = moreData.moreData.partName : ""
    //创建人
    moreData.moreData.createName ? data.createName = moreData.moreData.orderMan : ""
    //console.log(this.purchaseType)
    this.purchaseType == 99 ? data.orderSign = "" : data.orderSign = this.purchaseType
    console.log(data)
    let res: any = await all.getListSale(params, data);
    console.log(res)
    if (res.code == 0) {
      //  if(res.data.totalElements==0){
      //     console.log(1111111)
      // }

      this.Left.page.total = res.data.totalElements;
      this.Left.tableList = (res.data.content || []).map(el => {

        el.orderDate ? el.orderDate = moment(el.orderDate).format("YYYY-MM-DD") : el.orderDate = ""
        el.createTime = moment(el.createTime).format("YYYY-MM-DD")
        switch (el.orderSign) {
          case 0:
            el.orderSignStatus = "草稿";
            break;
          case 1:
            el.orderSignStatus = "已提交";
            break;
          case 2:
            el.orderSignStatus = "已完成";
            break;
        }
        return el;
      });
      this.form.serviceId = res.data.content[0].serviceId
      this.form.guestId = res.data.content[0].guestId
      this.form.afterSaleDate = moment(res.data.content[0].afterSaleDate).format("YYYY-MM-DD")
      res.data.content[0].manualId ? this.form.moblenumber = res.data.content[0].manualId : this.form.moblenumber = "";
      res.data.content[0].manualId && data.row.remark ? this.form.remark = res.data.content[0].remark : this.form.remark = ""
      this.form.units = res.data.content[0].guestName
      this.form.serviceId = res.data.content[0].serviceId
      this.row = res.data.content[0];
      this.relevanceList = res.data.content;
      this.rightTop.details = res.data.content[0].details


      if (res.data.content[0].orderSignStatus == "草稿") this.flag = true




      //console.log(this.relevanceList)
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
    let res: any = await all.getListSale(params, data);
    if (res.code === 0) {
      this.Left.tableList = (res.data.content || []).map(el => {
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
      // this.Leftcurrentrow.serviceId
      //给表单赋值
      this.form.serviceId = res.data.content[0].serviceId
      this.form.guestId = res.data.content[0].guestId
      this.form.afterSaleDate = moment(res.data.content[0].afterSaleDate).format("YYYY-MM-DD")
      res.data.content[0].manualId ? this.form.moblenumber = res.data.content[0].manualId : this.form.moblenumber = "";
      res.data.content[0].manualId && data.row.remark ? this.form.remark = res.data.content[0].remark : this.form.remark = ""
      this.form.units = res.data.content[0].guestName
      this.form.serviceId = res.data.content[0].serviceId
      //默认标识
      this.row = res.data.content[0];
      this.rightTop.details = res.data.content[0].details
      this.Left.page.total = res.data.totalElements;
      if (res.data.content[0].orderSignStatus == "草稿") this.flag = true
    }
  }
  //快速查询
  private getDataQuick1(v) {
    this.queryDate = v;
    this.Left.page.num = 1;
    // this.moreQueryList = {};
    this.getLeftLists();
  }
  //获取类型
  private getDataType1(v) {
    console.log(v)
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
    this.bcflag = true
    this.flag = true;
    this.bjFlag = true
    if (this.Left.tableList.length === 0) {
    } else {
      if (this.Left.tableList[0]["xinzeng"] === "1") {
        this.$Message.info(
          "当前加工单列表已有一个新增单等待操作,请先保存当前操作新增单据"
        );
        return;
      }
    }
    this.row.orderSignStatus = "草稿"
    this.rightTop.details = []
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
      orderMan: this.$store.state.user.userData.staffName,
    };
    this.Left.tableList.unshift(item);
    this.Left.tableList.map((item, index) => {
      item.index = index + 1;
      item._highlight = false;
    });

    //this.leftClickItemId=null;
    //this.Leftcurrentrow._highlight=true
    // this.Left.tableList[0]['processProductVO'] = []
    this.currentData = [];
  }
  //提交
  private async tijiao() {
    if (!this.row.orderSignStatus) {
      this.row = this.Left.tableList[0]
    }
    if (!this.form.units || !this.form.afterSaleDate) {
      return this.$Message.error("*为必填项");
    }
    // if (this.row.orderSignStatus!="草稿") {
    //   return this.$Message.error("请先保存在提交");
    // }
    if (this.rightTop.details.length == 0) {
      return this.$Message.error("请添加明细");
    }
    let hh = this.rightTop.details.every((item, i) => {
      return item.afterSaleReason != null
    })
    let ge = this.rightTop.details.every((item, i) => {
      return item.afterSaleQty != 0
    })
    if (!ge) { return this.$Message.info("理赔数量不能为0") }
    if (!hh) { return this.$Message.info("请填写理赔原因") }
    Object.assign(this.Leftcurrentrow, this.form, this.rightTop)
    console.log(this.Leftcurrentrow)
    this.Leftcurrentrow.afterSaleDate = this.Leftcurrentrow.afterSaleDate
      ? moment(this.Leftcurrentrow.afterSaleDate).format("YYYY-MM-DD")
      : "";
    let res: any = await all.submitSale(this.Leftcurrentrow);
    if (res.code == 0) {
      this.getList()
      this.flag = false
      this.$Message.success("提交成功");
      this.bcflag = false
      this.Leftcurrentrow = {
        //moblenumber: ""

      }
    }


  }
  //打印

  // $refs: { }
  private stamp() {
    if (!this.mainId) {
      return this.$Message.error("请选择要打印的单据");
    }
    let order: any = {};
    order.id = this.mainId;
    let printZF = this.$refs.printZF;
    printZF.openModal(order)
    //this.$refs.getLeftLists()
  }
  //按照编码品牌导入
  private getRUl() {
    this.upurl = api.outgetup + 'id=' + this.mainId;
  }
  private onSuccess(response) {
    if (response.code == 0) {
      if (response.data.list && response.data.list.length > 0) {
        this.warning(response.data.list[0]);
      }
      //this.getLeftLists();
      this.formPlan = {
        code: ""
      };
      this.$Message.success("保存成功");
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
    this.upurlInnerId = api.outgetupInnerId + 'id=' + this.mainId;
  };
  //配件内码模板----下载魔板
  private downInnerId() {
    down('3800000000')

  }
  //
  private getSupplierNamea(val) {

    console.log(val.id)
    this.$set(this.form, 'guestId', val.id)
    this.$set(this.form, 'units', val.fullName)
  }
  //删除配件
  private shanchu() {
    if (this.delArr.length === 0) {
      this.$Message.info("请勾选要删除的配件");


    }
  }


  //获取表格高度
  // private getDomHeight() {
  //   this.$nextTick(() => {
  //     let wrapH = this.$refs.paneLeft.offsetHeight;
  //     let planFormH = this.$refs.planForm.offsetHeight;
  //     let planBtnH = this.$refs.planBtn.offsetHeight;
  //     // let planPageH = this.$refs.planPage.offsetHeight;
  //     //获取左侧侧表格高度
  //     this.leftTableHeight = wrapH - 144;
  //     //获取右侧表格高度
  //     this.rightTableHeight = (wrapH - planFormH - planBtnH - 80) / 2;
  //   });
  // }
  //添加配件
  private changep() {
    //console.log(this.$refs.selectPartCom)
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
    //console.log(this.$refs.selectSupplier);
    this.$refs.selectSupplier.init();
  }
  //更多的弹框回调
  private openMoreflag(val) {
    this.showMore = val;
  }
  //回调弹框表单里的数据
  private openMoreData(val) {
    // this.moreList = val
    // console.log(val)
    this.getList()
  }
  //查看客户
  private watchke() {
    this.clientDataShow = true;
    // if () {
    //   return this.$Message.error("请选择一条客户信息");
    // }
    // let data:any = {};
    // data.id = this.clientList.partId;
    // this.$refs.child.$refs.form.resetFields()
    // getCustomerDetails(data).then((res:any) => {
    //   if (res.code == 0) {
    //     this.clientList = res.data;
    //     this.clientList.isNeedPack = this.clientList.isNeedPack == 1 ? true : false
    //     this.clientList.isFatCompany = this.clientList.isFatCompany == 1 ? true : false
    //     this.clientList.isDisabled = this.clientList.isDisabled == 1 ? true : false
    //     this.clientList.isSupplier = this.clientList.isSupplier == 1 ? true : false
    //     this.clientList.belongSystem = JSON.parse(this.clientList.belongSystem).value
    //     this.$refs.child.placeList = this.clientList.guestLogisticsVOList;
    //     this.$refs.child.relevanceClientShow = this.clientList.guestVOList;
    //     this.$refs.child.invoice = this.clientList.guestTaxpayerVOList;
    //     this.$refs.child.financeList=this.clientList.guestAccountVoList
    //     this.nameChange=true;
    //   }
    //   // console.log(this.clientList);
    //   this.clientDataShow = true;
    // });

  }
  //保存
  private async baocun() {

    // if (this.rightTop.details.length <= 0) {
    //   return this.$Message.error("请填选明细");
    // }
    if (!this.form.units || !this.form.afterSaleDate) {
      return this.$Message.error("*为必填项");
    }
    // if (!this.form.serviceId) {
    //   if (this.form.xinzeng === "1") {
    //   } else {
    //     this.$Message.info("请先选择加工单");
    //     return;
    //   }
    // }
    if (this.row.orderSignStatus != "草稿") {
      this.$Message.info("只有草稿状态才能进行保存操作");
      return;
    }
    // let hh = this.Leftcurrentrow.details.every((item, i) => {
    //   return item.afterSaleReason != null
    // })
    // if (!hh) { return this.$Message.info("请填写理赔原因") }


    Object.assign(this.Leftcurrentrow, this.form, this.rightTop)

    this.Leftcurrentrow.afterSaleDate = this.Leftcurrentrow.afterSaleDate
      ? moment(this.Leftcurrentrow.afterSaleDate).format("YYYY-MM-DD")
      : "";
    let res: any = await all.saveSale(this.Leftcurrentrow);
    if (res.code == 0) {
      this.bcflag = false
      this.tjflag = true
      this.getList()
      this.flag = false;
      this.bjFlag = false
      this.$Message.success("保存成功");
      this.Leftcurrentrow = {
        //moblenumber: ""
      }
    }

    // const params = JSON.parse(JSON.stringify(this.Leftcurrentrow));
    // params.details = params.details.length
    //   ? params.details[0]
    //   : {};
    // if (
    //   !params.details.orderQty ||
    //   params.details.orderQty * 1 < 1
    // ) {
    //   this.$Message.info("组装数量必须大于0");
    //   return;
    // }

    // }

  }
  //------左边的table 
  private changePage(v) {
    this.Left.page.num = v
    this.getList()
  }
  private changeSize(size) {
    this.Left.page.num = 1
    this.Left.page.size = size
    this.getList()
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
      let filterArr = this.rightTop.details.map(({ partCode }) => partCode)
      if (!filterArr.includes(item.partCode)) {
        arr.push(item)
      }
    })
    arr.forEach(item => {
      delete item.id;
      this.rightTop.details.unshift(item);
    });
    //this.setFilterArr(this.Leftcurrentrow.details || [])
    if (arr.length != datas.length) {
      return this.$Message.info("配件已存在请勿重复添加");
    }
    this.$Message.success("已添加");


  }
  //选中的行
  private getOneClinet(data) {
    if (this.flag == true && data.row.orderSignStatus == "草稿" && this.bjFlag) {
      this.$Modal.confirm({
        title: "您正在编辑单据，是否需要保存",
        onOk: () => {
          //this.flag=true
          this.baocun();
        },
        onCancel: () => {
          // this.getLeftLists();
          this.flag = false;
        }
      });
      return;
    }
    this.bcflag = true
    // this.tjflag=true
    this.row = data.row
    this.form.id = data.row.id
    this.mainId = data.row.id
    this.form.serviceId = data.row.serviceId
    this.form.guestId = data.row.guestId
    this.form.afterSaleDate = moment(data.row.afterSaleDate).format("YYYY-MM-DD")
    data.row.manualId ? this.form.moblenumber = data.row.manualId : this.form.moblenumber = "";
    data.row.manualId && data.row.remark ? this.form.moblenumber = data.row.remark : this.form.moblenumber = ""
    this.form.units = data.row.guestName

    this.rightTop.details = data.row.details
    if (data.row.orderSignStatus != "草稿") {
      this.flag = false
    } else {
      this.flag = true
    }
  }
  //------右上边的table

  private keydown() {

  }
  //手动全选触发
  private selectAllEvent() {

  }
  //选中当前行
  private currentChangeEvent(e) {
    this.clientList = e.row
    console.log(e.row)
  }
  private logDataLoading: boolean = false
  private async logDataMethod({ row }) {
    // if (this.addNewBool) {
    // return
    // } else {
    this.logDataLoading = true;
    let data = {
      detailId: row.id
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
    this.printList.push(e.row)
  }
  private keydownEvent() {

  }
  //---mounted
  mounted() {
    this.getList()
    // window.onresize = () => {
    //   this.getDomHeight();
    // };
  }


}