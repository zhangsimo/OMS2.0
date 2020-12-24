import { Vue, Component } from "vue-property-decorator";
// @ts-ignore
//import More from "./components/More.vue"
// @ts-ignore
import moment from "moment";
// @ts-ignore
import QuickDate from "../../../../components/getDate/dateget";
import {getBrandList} from "@/view/reportForm/until.js";
import {ToDayStr} from "@/components/getDate/index_bill.js"
@Component({
  components: {
  
    QuickDate
  }
})
export default class Custom extends Vue {
  private search: any = {
    orderDate: ToDayStr(),
    guestName: "",
    partCode: "",
    partBrand: "",
    orderSign: 99,
    orderUnit:""
  }//搜索条件
  //品牌数组
  private brandArr: Array<any> = new Array<any>();//品牌数组
  private body:any={}//查询数据的对象
  private state: any = "0"//状态
  private stateArr: any = [
    { label: "所有", value: 99 },
    { label: "草稿", value: 0 },
    { label: "已提交", value: 1 },
    { label: "已完成", value: 2 },
  ]//状态数据
  private Fittingscode: string = "" //配件内码
  //表格数据
  private claimSupplierData: Array<any> = new Array<any>();
  private page: any = {
    num: 1,
    size: 10,
    total: 0
  };
  private pageOpts: Array<number> = [10, 20, 30, 50];
  //---更多查询的数据
  private moreSearch:any={
    orderDate:[],
    handleType:99,
    guestType:99,
    orderMan:"",
    serviceId:"",
    returnCode:""
  }//更多查询
  private moreModel:boolean=false;
  private handleTypeList:Array<any> =[ //处理类型 1 原货退化 ；2 换货 ；3 退款 ；4 原物销毁 ；
    {value: 99, label: "所有"},
    {value: 1, label: "原货退还"},
    {value: 2, label: "换货"},
    {value: 3, label: "退款"},
    {value: 4, label: "原物销毁"}
  ]
  private guestTypeList:Array<any>=[
    {value:99,label:"全部"},
    {value:1,label:"内部客户"},
    {value:2,label:"外部客户"}
  ]
  async mounted() {
    this.brandArr = await getBrandList(this.search.partBrand)
  }
  //---methods
  private async partBrandRemote(query: string) {
    this.brandArr = await getBrandList(query)
  }
  //获取时间
  private getvalue(value) { 
    this.search.orderDate = value;
  }
  //状态
  private select1() { }
  //获取选择的数据
  private getOne(data) {
    console.log(data);
  }
  //查询
  private query() {
    let data: any = {};
    for (let key in this.search) {
      if (this.search[key]) {
        if (key == "orderDate") {
          data.createStartTime = this.search["orderDate"][0] != "" ?
            moment(this.search["orderDate"][0]).startOf('day').format("YYYY-MM-DD HH:mm:ss") : ""
          data.createEndTime = this.search["orderDate"][1] != "" ?
            moment(this.search["orderDate"][1]).endOf('day').format("YYYY-MM-DD HH:mm:ss") : ""
        } else if (key == "orderSign") {
          data.orderSign = this.search.orderSign == 99 ? "" : this.search.orderSign
        } else {
          data[key] = this.search[key];
        }
      }
    }
    this.body=data
    console.log(data)

   }
  //更多查询
  moreOpen() {
    this.resetMoreReseach()
  }
  private getDataQuick(v){
    this.search.orderDate = v;
  }
  //更多查询确定按钮
  private Morequery() {
    let data:any = {};
    for (let key in this.moreSearch) {
      if (this.moreSearch[key]) {
        if (key == "orderDate") {
          data.createStartTime =this.moreSearch["orderDate"][0]!=""?
            moment(this.moreSearch["orderDate"][0]).startOf('day').format("YYYY-MM-DD HH:mm:ss"):""
          data.createEndTime =this.moreSearch["orderDate"][1]!=""?
            moment(this.moreSearch["orderDate"][1]).endOf('day').format("YYYY-MM-DD HH:mm:ss"):""
        }else {
          data[key] = this.moreSearch[key];
        }
      }
    }
  console.log(data)
  // this.cancelContent(0)
  }
  private poperHide(){
    this.moreModel = false;
  }
  private cancelContent(type) {
    if (type == 0) {//更多点击取消 先清空再关闭
      this.resetMoreReseach()
      this.moreModel = false;
    } else if (type == 1) {//更多查询点击清空查询
      this.resetMoreReseach();
    }
  }
  //更多查询清空
  async resetMoreReseach() {
    let data = {
      orderDate:[],
      handleType:99,
      guestType:99,
      orderMan:"",
      serviceId:"",
      claimDemageCode:""
    }
    this.moreSearch = data;
  }
  //选择日期
  private changePage(p) {  
    this.page.num = p;
   
  }
  private changeSize(size) {
   this.page.num = 1;
    this.page.size = size;
  }
  private getList(){
    let params:any={
      page:this.page.num-1,
      size:this.page.size
    }
    // @ts-ignore
    // let res:any=await api.supplierSettlementQuery(params,this.body)
    // if(res.code===0){
      // this.claimSupplierData=(res.data.content || []).map(el=>{
      //   switch (el.orderSign) {
      //     case 0:
      //       el.orderSignStatus = "草稿";
      //       break;
      //     case 1:
      //       el.orderSignStatus = "已提交";
      //       break;
      //     case 2:
      //       el.orderSignStatus = "已完成";
      //       break;
      //   }
      //   return el;
      // });
      // this.page.total=res.data.totalElements
    //}
  }
  
  //获取点击行
  private getOneClinet(data) {
    console.log(data.row)
  }


  //更多查询的内容
  private openMoreData() {

  }
}