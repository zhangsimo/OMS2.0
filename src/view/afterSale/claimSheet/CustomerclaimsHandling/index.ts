import { Vue, Component } from "vue-property-decorator";
import moment from "moment";
import { getBrandList } from "@/view/reportForm/until.js";
import {ToDayStr} from "@/components/getDate/index_bill.js";
import * as all from "@/api/afterSale/CustomerClaimsRegistration/index";
// @ts-ignore
// import More from "./components/More.vue"
// // @ts-ignore
// import QuickDate from "../../../../components/getDate/dateget";
@Component({
    components: {
        // More,
        // QuickDate
    }
})
export default class Custom extends Vue {
    private body:any={}
    private showit: Boolean = true
    private rightTableHeight: any = 440
    //表格数据
    private claimSupplierData: Array<any> = new Array<any>();
    private search: any = {
        orderDate: ToDayStr(),
        guestName: "",//理赔单位
        partCode: "",
        partBrand: "",
        serviceId: ""
      }//搜索条件
      //分页
      private page: any = {
        num: 1,
        size: 10
      };
      private bandArr: Array<any> = new Array<any>();//品牌数组
    //---methods
    private claimSupplierSelData: Array<any> = new Array<any>();
    async mounted() {
        this.bandArr = await getBrandList(this.search.partBrand)
        this.getList()
      }
      private getDataQuick(v){
        this.search.orderDate = v;
      }
      private async partBrandRemote(query: string) {
        this.bandArr = await getBrandList(query)
      }
     private select1(){

      }
    //原货退换
    private async claim(type: number) {
        if (this.claimSupplierSelData.length < 1) {
          return this.$message.error("最少选中一条数据进行处理！")
        }
        let boolAjax:boolean=true;
        this.claimSupplierSelData.map(el=>{
          if(!el.thisTreatmentQty){
            boolAjax=false
          }
        })
        let p = ""
        switch (type) {
          case 1:
            p = "原货退还";
            break;
          case 2:
            p = "换货处理";
            break;
          case 3:
            p = "退货处理";
            break;
          case 4:
            p = "原物销毁";
            break;
        }
        // @ts-ignore
        if(boolAjax){
          this.$Modal.confirm({
            title: '提示',
            content: `<p>是否确定${p}?</p>`,
            onOk: async () => {
              let params: any = {
                orderType: type,
              }
             let res: any = await all.Customerprocessing(params, this.claimSupplierSelData)
              if (res.code === 0) {
                this.getList()
                this.$Message.success("处理成功")
              }
            },
            onCancel: () => {
            }
          });
        }else{
          return this.$message.error("本次处理数量必填")
        }
      }
    //选择品牌
    private getDataType() {

    }
    //选中数据
    private claimSupplierSel({selection}) {
        console.log(selection)
        this.claimSupplierSelData = selection;
      }
    //查询
    private ok(){
      this.getList()
    }
    private query() {

        let data:any = {};
        for (let key in this.search) {
          if (this.search[key]) {
            if (key == "orderDate") {
              data.orderStartDate =this.search["orderDate"][0]!=""?
                moment(this.search["orderDate"][0]).startOf('day').format("YYYY-MM-DD HH:mm:ss"):""
              data.orderEndDate =this.search["orderDate"][1]!=""?
                moment(this.search["orderDate"][1]).endOf('day').format("YYYY-MM-DD HH:mm:ss"):""
            } else {
              data[key] = this.search[key];
            }
          }
        }
        this.body=data
        //console.log(data)
    }
    private async getList(){ 
       this.query()
        let params: any = {
            page: 0,
            size: 10000
          }
        

          //@ts-ignore
          let res: any = await all.CustomerprocessingQuery(params, this.body)
          if (res.code === 0) {
            this.claimSupplierData = res.data.content;
    
          }
    }
    //导出
    private getExport() { }

   
}