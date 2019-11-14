import { Vue, Component } from 'vue-property-decorator'
// @ts-ignore
import * as api from "_api/system/ProductLA.js";

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
    private employeeSelecteOption: string = ""
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
    private DistributionStateSelecteOption: string = ""
    /**角色选项 */
    private roleOptions: Array<Option> = []
    /**角色选项选中的项 */
    private roleSelectOption:string = ""
    /**员工表表头 */
    private employeeTableHead:Array<Tableth> = [
        {
            title: "序号",
            minWidth: 50,
            type: "index"
        },
        {
            title: "分配状态",
            key: "meterCompany",
            minWidth: 120
        },
        {
            title: "角色",
            key: "meterCompany",
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
            key: "meterCompany",
            minWidth: 240
        },
    ]
    /**员工表数据 */
    private employeeData = []
    /**员工表分页 */
    employeePage: Page = {
        num: 1,
        total: 0,
        size: 10
    }
    /**员工表加载状态 */
    employeeLoading:boolean = false;
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
            label: '编码尾号',
        },
        {
            value: '3',
            label: '首字拼音',
        },
    ]
    /**待分配列表选中的分配状态选项 */
    private waitPartTransListSelecteOption: string = ""
    /**待分配列表查询内容 */
    private waitPartTransListContent:string = ""
    /**待分配列表表头 */
    private waitPartListTableHead:Array<Tableth> = [
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
            key: "meterCompany",
            slot: "meterCompany",
            minWidth: 180
        },
        {
            title: "品牌",
            key: "meterCompany",
            slot: "meterCompany",
            minWidth: 120
        },
        {
            title: "编码",
            key: "meterCompany",
            slot: "meterCompany",
            minWidth: 120
        },
        {
            title: "名称",
            key: "meterCompany",
            slot: "meterCompany",
            minWidth: 100
        },
        {
            title: "全称",
            key: "meterCompany",
            slot: "meterCompany",
            minWidth: 120
        },
        {
            title: "单位",
            key: "meterCompany",
            slot: "meterCompany",
            minWidth: 80
        },
        {
            title: "规格",
            key: "meterCompany",
            slot: "meterCompany",
            minWidth: 80
        },
        {
            title: "型号",
            key: "meterCompany",
            slot: "meterCompany",
            minWidth: 100
        },
    ]
    /**待分配列表数据 */
    private waitPartListData = []
    /**待分配列表分页 */
    private waitPartListPage:Page = {
        num: 1,
        total: 0,
        size: 10
    }
    /**待分配列表加载状态 */
    waitPartListLoading:boolean = false;
    /**已分配列表数据 */
    private distPartListData = []

    // mounted
    private async mounted() {
        const roles = await api.getRoles()
        if(roles.code == 0) {
            this.roleOptions = roles.data.content.map((el:any) => {
                return {
                    label: el.displayName,
                    value: el.id
                }
            })
            this.roleOptions.unshift({label: "全部", value: '0'})
        }

        this.getStaff();
    }

    // methods
    //获取员工表
    private async getStaff() {
        this.employeeLoading = true;
        let params:any = {}
        params.size = this.employeePage.size;
        params.page = this.employeePage.num -1;
        if(this.employeeSelecteOption == '0') {
            params.userName = this.employeeSelectContent.trim();
        }
        if(this.employeeSelecteOption == '1') {
            params.phone = this.employeeSelectContent.trim();
        }
        let res = await api.getStaffList(params);
        if(res.code == 0) {
            this.employeeLoading = false;
            this.employeeData = res.data.content;
            this.employeePage.total = res.data.totalElements
        }
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
    //  翻页-待分配列表
    private waitPartListChangePage(p: number) {
        this.employeePage.num = p;
    }
    // 修改每页显示条数-待分配列表
    private waitPartListChangeSize(size: number) {
        this.employeePage.num = 1;
        this.employeePage.size = size;
    }
}