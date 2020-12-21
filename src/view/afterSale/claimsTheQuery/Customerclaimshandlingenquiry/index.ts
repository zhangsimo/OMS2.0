import { Vue, Component } from "vue-property-decorator";
// @ts-ignore
import More from "./components/More.vue"
// @ts-ignore
import QuickDate from "../../../../components/getDate/dateget";
@Component({
    components: {
        More,
        QuickDate
    }
})
export default class Custom extends Vue {
    //var userTestStatus: { id: number, name: string }[] = [
//     { "id": 0, "name": "Available" }
//     { "id": 1, "name": "Ready" }
//     { "id": 2, "name": "Started" }
//    ];
    //----data
 private  showMore:boolean= false//更多查询弹框开关
   private createTime:any= "" //创建日期
   private orderUnit:any= "" //理赔单位
   private orderNumber:any=''//理赔单号
   private brand:string= "99" //品牌
   private brandArr:any= [
      //品牌数据
      { label: "所有", value: "99" },
      { label: "草稿", value: "0" },
      { label: "已提交", value: "1" },
      { label: "已完成", value: "3" },
    ]
   private state:any= "0"//状态
   private stateArr:any= [
      { label: "所有", value: "999" },
      { label: "草稿", value: "0" },
      { label: "已提交", value: "2" },
      { label: "已完成", value: "4" },
    ]//状态数据
   private Fittingscode:string= "" //配件内码
   private tableData:any=[
      {
        revokeReason:'哈哈哈哈哈',
        billCreateUname:'草稿'
      }
    ] //表格数据
   private page:any= {
      num: 1,
      size: 10,
      total:1000,
    }
   private pageOpts:number[]= [10, 20, 30, 40, 50]
  //---methods
 private getDataType() {}
  //状态
 private getDataType1() {}
  //获取选择的数据
 private getOne(data) {
    console.log(data);
  }
  //查询
 private query() {}
  //更多查询
  Morequery(){
    this.showMore=true
  }
  //选择日期
 private getDataQuick(v) {
    console.log(v)
  }
 private changePage(p) {
    // this.page.num = p;
    // this.getList();
  }
 private changeSize(size) {
    // this.page.num = 1;
    // this.page.size = size;
    // this.getList();
  }
  //获取点击行
 private getOneClinet(data){
    console.log(data.row)
  }
  //更多查询开关
 private openMoreflag(val){
    this.showMore=val
  }
  //更多查询的内容
 private openMoreData(){

  }
}