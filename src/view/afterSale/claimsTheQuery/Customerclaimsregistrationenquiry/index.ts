import { Vue, Component } from "vue-property-decorator";
// @ts-ignore
import Selectss from "./components/Selects.vue";
// @ts-ignore
import { ToDayStr } from "@/components/getDate/index_bill.js"
// @ts-ignore
import QuickDate from "../../../../components/getDate/dateget";
import { getBrandList } from "@/view/reportForm/until.js";
import moment from "moment";
@Component({
    components: {
        Selectss,
        QuickDate
    }
})
export default class Custom extends Vue {
    //----data
    private body={}
    //表格数据
    private claimSupplierData:Array<any>=new Array<any>();
    private search: any = {
        orderDate: ToDayStr(),
        gustId:"",
        partCode: "",
        orderUnit: "",//理赔单位
        partBrand: "",//品牌
        orderSign: 99//状态 
    }
    private brandArr: Array<any> = new Array<any>();//品牌数组
    async mounted() {
        this.brandArr = await getBrandList(this.search.partBrand)
    }
    private async partBrandRemote(query: string) {
        this.brandArr = await getBrandList(query)
    }

    private typeList: Array<any> = [ //单据状态
        {value: 99, name: "所有"},
        {value: 3, name: "草稿"},
        {value: 1, name: "已提交"},
        {value: 2, name: "已完成"}
      ]
    private tableData: any = [
        {
            revokeReason: '哈哈哈哈哈',
            billCreateUname: '草稿'
        }
    ]
    private select1() {

    }
    
    //分页
    private page: any = {
        num: 1,
        size: 10,
        total: 0,
    }
    private pageOpts: any = [10, 20, 30, 50]

    //--------methods
    //品牌
    private getDataType() {

    }
    private getDataType1() {

    }
    $refs: { Selectss: HTMLFormElement }
    private Dealings() {

        this.$refs.Selectss.addressShow = true;
    }
    //获取选择的数据
    private getOne(val) {
        this.search.orderUnit = val.fullName;
        this.search.gustId=val.id

    }
    //获取表格数据
    private async getList(){
        let params:any={
          page:this.page.num-1,
          size:this.page.size
        }
        // // @ts-ignore
        // let res:any=await api.supplierSettlementQuery(params,this.body)
        // if(res.code===0){
        //   this.claimSupplierData=(res.data.content || []).map(el=>{
        //     switch (el.orderSign) {
        //       case 0:
        //         el.orderSignStatus = "草稿";
        //         break;
        //       case 1:
        //         el.orderSignStatus = "已提交";
        //         break;
        //       case 2:
        //         el.orderSignStatus = "已完成";
        //         break;
        //     }
        //     return el;
        //   });
        //   this.page.total=res.data.totalElements
        // }
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
        console.log(data)
        this.body=data
      }
    //获取时间
    private getvalue(value) {
        this.search.orderDate = value;
        this.query();
      }
  
      private getDataQuick(v) {
        this.search.orderDate = v;
      }
    //分页
    //分页
    private changePage(p) {
        this.page.num = p;
       // this.getList();
      }
      private changeSize(size) {
        this.page.num = 1;
        this.page.size = size;
       // this.getList();
      }
    //获取点击行
    private getOneClinet(data) {
        console.log(data.row)
    }
}