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
// @ts-ignore
// import {
//     tijiao,
//     zuofei,
//     baocun,
//     peijianzuzhuang,
//     zuzhuangxinxi,
//     zuzhuanglingjian,
//     daochu,
//     tijiao2,
//     zuofei2,
//     baocun2,
//     peijianchaifen,
//     chaifenxinxi,
//     chaifenlingjian,
//     daoru1,
//     shanqu,
//     cangkulist2,
//   } from "@/api/business/process.js";
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
  private v1: any = []
  private purchaseType: string = "99" //查询选项
  private split1: any = 0.2
  private purchaseTypeArr: any = [
    { label: "所有", value: "99" },
    { label: "草稿", value: "0" },
    { label: "已提交", value: "1" },
    { label: "已完成", value: "3" },
  ]
  private advanced: boolean = false
  private allList: any = []
  private form: any = {

    qucikTime: "",
  }
  private formPlan: any = {
    storeId: ""
  }
  private printList: any = []
  private moreList: any = {}
  //--------左边的table 
  //记录左边点击的数据 
  //选中的行
  private bcflag: boolean = false
  private row: any = {}
  private rowid: any = ''
  private flag: boolean = false
  private rightTableHeight: any = 0;
  private leftTableHeight: any = 500
  private leftClickItemId: any = null

  private Left: any = {
    page: {
      total: 100,
      size: 10,
      num: 10
    },
    tableList: [

    ]
  }
  //右上的数据
  //请求头
  private mainId: any = ""
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
  private Leftcurrentrow: any = {
    status: {
      value: 0,
    },
    units: "",
    storeName: "",
    createDate: "",
    orderMan: "",
    remark: "",
    serviceId: "",
    moblenumber: '',//手工单号 
    processProductVO: [
    ],
  }
  //右下的表格
  private currentData: any = [
  ]
  //-------methods
  //初始化
  private getList() {

  }
  //快速查询
  private getDataQuick1(v) {
    console.log(v)
  }
  //获取类型
  private getDataType1(v) {
    console.log(v)
  }
  //更多按钮
  private addmore() {
    this.showMore = true;
  }
  private Moresearch() {

  }
  //新增
  private add() {
    this.flag = true;
    if (this.Left.tableList.length === 0) {
    } else {
      if (this.Left.tableList[0]["xinzeng"] === "1") {
        this.$Message.info(
          "当前加工单列表已有一个新增单等待操作,请先保存当前操作新增单据"
        );
        return;
      }
    }
    let item: any = {
      index: 1,
      xinzeng: "1",
      status: {
        enum: "DRAFT",
        name: "草稿",
        value: 0,
      },
      statuName: "草稿",
      storeName: "",
      createTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      orderMan: this.$store.state.user.userData.staffName,
      remark: "",
      serviceId: "",
      processProductVO: [],
      unit: "",
      moblenumber: ""

    };
    this.Left.tableList.unshift(item);
    this.Left.tableList.map((item, index) => {
      item.index = index + 1;
      item._highlight = false;
    });
    this.Leftcurrentrow = item;
    //this.leftClickItemId=null;
    //this.Leftcurrentrow._highlight=true
    // this.Left.tableList[0]['processProductVO'] = []
    this.currentData = [];
  }
  //提交
  private async tijiao() {
    if (!this.row.statuName) {
      this.row = this.Left.tableList[0]
    }
    if (!this.Leftcurrentrow.unit || !this.Leftcurrentrow.createTime) {
      return this.$Message.error("*为必填项");
    }
    if (!this.bcflag) {
      return this.$Message.error("请先保存在提交");
    }
    this.bcflag = false
    //重新获取列表数据
    this.Left.tableList = []
    this.Leftcurrentrow.unit = ""
    this.Leftcurrentrow.storeName = ""
    this.Leftcurrentrow.createTime = ""
    this.Leftcurrentrow.orderMan = ""
    this.Leftcurrentrow.remark = ""
    this.Leftcurrentrow.serviceId = ""
    this.Leftcurrentrow.processProductVO = [
    ],
      this.$Message.success("提交成功");

  }
  //打印
  $refs: { upload:HTMLFormElement, xTable2:HTMLFormElement, child: HTMLFormElement, print: HTMLFormElement, SelectPartRef: HTMLFormElement, selectSupplier: HTMLFormElement, paneLeft: HTMLFormElement, planForm: HTMLFormElement, planBtn: HTMLFormElement }
  // $refs: { }
  private stamp() {
    if (this.printList.length == 0 || this.row.orderSignStatus == "") {
      return this.$Message.error("请选择要打印的单据");
    }
    // alert('打印成功')
    let order: any = {};
    order.name = "调拨申请"
    order.route = this.$route.name
    order.id = 1111
    //console.log(this.$refs.print.openModel)
    this.$refs.print.openModel(order)

    // this.leftgetList()
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
  private beforeUploadInnerId(){}
  private onFormatError(){}
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
  //编码品牌模板-----下载模板
  private down() {
    down('2000000000')
  }
  //配件内码模板----下载魔板
  private downInnerId() {
    down('3000000000')

  }
  //
  private getSupplierNamea(val) {
    console.log(val.id)
    this.$set(this.Leftcurrentrow, 'units', val.fullName)
  }
  //删除配件
  private shanchu() {
    if (this.delArr.length === 0) {
      this.$Message.info("请勾选要删除的配件");


    }
  }


  //获取表格高度
  private getDomHeight() {
    this.$nextTick(() => {
      let wrapH = this.$refs.paneLeft.offsetHeight;
      let planFormH = this.$refs.planForm.offsetHeight;
      let planBtnH = this.$refs.planBtn.offsetHeight;
      // let planPageH = this.$refs.planPage.offsetHeight;
      //获取左侧侧表格高度
      this.leftTableHeight = wrapH - 144;
      //获取右侧表格高度
      this.rightTableHeight = (wrapH - planFormH - planBtnH - 80) / 2;
    });
  }
  //添加配件
  private changep() {
    //console.log(this.$refs.selectPartCom)
    this.$refs.SelectPartRef.init();
  }
  private afterSaleQtyChange(row){
    if(row.isAddPart==0){
      row.untreatedQty=row.afterSaleQty
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
    this.moreList = val
    console.log(val)
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
  private baocun() {
    if (this.Leftcurrentrow.processProductVO.length <= 0) {
      return this.$Message.error("请填选明细");
    }
    if (!this.Leftcurrentrow.units || !this.Leftcurrentrow.createTime) {
      return this.$Message.error("*为必填项");
    }
    if (!this.Leftcurrentrow.serviceId) {
      if (this.Leftcurrentrow.xinzeng === "1") {
      } else {
        this.$Message.info("请先选择加工单");
        return;
      }
    }
    if (this.Leftcurrentrow.status.value !== 0) {
      this.$Message.info("只有草稿状态才能进行保存操作");
      return;
    }
    let hh = this.Leftcurrentrow.processProductVO.every((item, i) => {
      return item.afterSaleReason != null
    })
    if (!hh) { return this.$Message.info("请填写理赔原因") }
    this.bcflag=true
    this.$Message.success("保存成功");
    // const params = JSON.parse(JSON.stringify(this.Leftcurrentrow));
    // params.processProductVO = params.processProductVO.length
    //   ? params.processProductVO[0]
    //   : {};
    // if (
    //   !params.processProductVO.orderQty ||
    //   params.processProductVO.orderQty * 1 < 1
    // ) {
    //   this.$Message.info("组装数量必须大于0");
    //   return;
    // }

    // }

  }
  //------左边的table 
  private changePage(page) {
    console.log(page)
  }
  private changeSize(size) {
    console.log(size)
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
      let filterArr = this.Leftcurrentrow.processProductVO.map(({ partCode }) => partCode)
      if (!filterArr.includes(item.partCode)) {
        arr.push(item)
      }
    })
    arr.forEach(item => {
      delete item.id;
      this.Leftcurrentrow.processProductVO.unshift(item);
    });
    //this.setFilterArr(this.Leftcurrentrow.processProductVO || [])
    if (arr.length != datas.length) {
      return this.$Message.success("配件已存在请勿重复添加");
    }
    this.$Message.success("已添加");


  }
  //选中的行
  private getOneClinet(data) {
    if (data.row.orderSignStatus != "草稿" && this.Left.tableList.length > 1) {
      this.flag = false
    } else {
      this.flag = true
    }

    console.log(data.row)
    this.mainId='x1111'
    this.row = data.row
    // this,mainId=row.id
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
  //选中单个框
  private selectChangeEvent(e) {
    this.printList.push(e.row)
  }
  private keydownEvent() {

  }
  //---mounted
  mounted() {

    // window.onresize = () => {
    //   this.getDomHeight();
    // };
  }


}