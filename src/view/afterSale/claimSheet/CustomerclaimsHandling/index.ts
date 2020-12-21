import { Vue, Component } from "vue-property-decorator";
import moment from "moment";
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
    //var userTestStatus: { id: number, name: string }[] = [
    //     { "id": 0, "name": "Available" }
    //     { "id": 1, "name": "Ready" }
    //     { "id": 2, "name": "Started" }
    //    ];
    //----data
    private showit: Boolean = true
    private rightTableHeight: any = 440
    private tableData: any = [{
        partInnerId: '88888888888sssssssssssssssssssssiiiii',
    }]

    private form: any = {
        status: '99',
        tablestatus:{value:0},
        storeName: "",
        createTime: "",
        orderMan: "",
        remark: "",
        serviceId: "",
        processProductVO: [],
        purchaseTypeArr: [
            { label: "所有", value: "99" },
            { label: "草稿", value: "0" },
            { label: "已提交", value: "1" },
            { label: "已完成", value: "3" }
        ]
    }
    //---methods
    //原货退换
    private kickback() {
        this.$confirm('是否确定原货退还', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });
        });
    }

    //换货处理
    private barter() {
        this.$confirm('是否确定换货处理', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });
        });
     }
    //退款处理
    private reimburse() {
        this.$confirm('是否确定退款处理', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });
        });
     }
    //原物销毁 
    private destory() {
        this.$confirm('是否确定原物销毁', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async() => {
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });
        });
    }
    //选择品牌
    private getDataType() {

    }
    //查询
    private query() {
        
    let hh= moment(this.form.createTime).format("YYYY-MM-DD")
    console.log(hh)
    }
    //导出
    private getExport() { }

    private keydownEvent() {

    }

    private keydown() {

    }

    private currentChangeEvent(val) {
            console.log(val.row)
    }

    private selectChangeEvent() {

    }

    private selectAllEvent(row) {
        console.log(row)
     }
}