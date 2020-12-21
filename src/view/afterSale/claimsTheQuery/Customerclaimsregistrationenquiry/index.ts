import { Vue, Component } from "vue-property-decorator";
// @ts-ignore
import Selectss from "./components/Selects.vue";
// @ts-ignore
import QuickDate from "../../../../components/getDate/dateget";
@Component({
    components: {
        Selectss,
        QuickDate
    }
})
export default class Custom extends Vue {
    //----data
    private list: Object = []
    private num: string = 'fffffff'
    private createTime: string = ""//创建日期
    private orderUnit: string = ""//理赔单位
    private brand: string = "99"//品牌
    private brandArr: SelectTypes[] = [//品牌数据
    { label: "所有", value: "99" },
    { label: "草稿", value: "0" },
    { label: "已提交", value: "1" },
    { label: "已完成", value: "3" }
    ]
    private state:string=""//状态
    private stateArr :SelectTypes[] = [//状态数据
        { label: "所有", value: "99" },
        { label: "草稿", value: "0" },
        { label: "已提交", value: "1" },
        { label: "已完成", value: "3" }
    ]
    private tableData:any = [
        {
            revokeReason: '哈哈哈哈哈',
            billCreateUname: '草稿'
        }
    ]
    //分页
    private page:any={
         num: 1,
        size: 10,
        total: 0,
    }
    private Fittingscode:string="";//配件内码
    //
    private pageOpts:any=[10, 20, 30, 40, 50] 

    //--------methods
    //品牌
    private getDataType(){

    }
    private getDataType1(){

    }
    $refs: {Selectss: HTMLFormElement}
    private Dealings(){   
   
    this.$refs.Selectss.addressShow = true;
    } 
    //获取选择的数据
    private getOne(val){
        this.orderUnit=val.fullName
  
    }
    //查询 
    private query(){

    }   
    //选择日期
    private getDataQuick(){

    }
    //分页
    private changeSize(size){
        console.log(size)
    }
    private changePage(page){
        console.log(page)
    }
    //获取点击行
    private  getOneClinet(data){
            console.log(data.row)
    }
}