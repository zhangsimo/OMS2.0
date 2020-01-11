// import * as api from "_api/lease/customerSM";
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class FittingReplacement extends Vue {
    // data
    /**配件列表查询选项 */
    private fittingOptions: Array<Option> = [{
        value: '0',
        label: '配件编码',
    }, {
        value: '1',
        label: '配件名称',
    },{
        value: '2',
        label: '车型',
    },{
        value: '3',
        label: '拼音',
    },]
    /**配件列表选中的查询选项 */
    private fittingSelecteOption: string = ""
    /**配件列表查询内容 */
    private fittingSelectContent: string = ""
    /**配件列表表头 */
    private fittingTableHead:Array<Tableth> = [
        {
            title: "序号",
            minWidth: 50,
            type: "index"
        },
        {
            title: "分配状态",
            key: "meterCompany",
            slot: "meterCompany",
            minWidth: 120
        },
        {
            title: "角色",
            key: "meterCompany",
            slot: "meterCompany",
            minWidth: 240
        },
        {
            title: "员工名称",
            key: "meterCompany",
            slot: "meterCompany",
            minWidth: 120
        },
        {
            title: "电话号码",
            key: "meterCompany",
            slot: "meterCompany",
            minWidth: 120
        },
        {
            title: "备注",
            key: "meterCompany",
            slot: "meterCompany",
            minWidth: 240
        },
    ]
    /**配件列表数据 */
    private fittingData = []
    /**配件列表分页 */
    fittingPage: Page = {
        num: 1,
        total: 0,
        size: 10
    }
    /**配件列表加载状态 */
    fittingLoading:boolean = false;
    /**替换配件选择查询选项 */
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
    /**替换配件选择选中的分配状态选项 */
    private waitPartTransListSelecteOption: string = ""
    /**替换配件选择查询内容 */
    private waitPartTransListContent:string = ""
    /**替换配件选择表头 */
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
    /**替换配件选择数据 */
    private waitPartListData = []
    /**替换配件选择分页 */
    private waitPartListPage:Page = {
        num: 1,
        total: 0,
        size: 10
    }
    /**替换配件选择加载状态 */
    waitPartListLoading:boolean = false;
    /**替换配件列表数据 */
    private distPartListData = []

    // mounted
    private mounted() {}

    // methods
    //  翻页-员工列表
    private fittingChangePage(p: number) {
        this.fittingPage.num = p;
    }
    // 修改每页显示条数-员工列表
    private fittingChangeSize(size: number) {
        this.fittingPage.num = 1;
        this.fittingPage.size = size;
    }
    //  翻页-替换配件选择
    private waitPartListChangePage(p: number) {
        this.fittingPage.num = p;
    }
    // 修改每页显示条数-替换配件选择
    private waitPartListChangeSize(size: number) {
        this.fittingPage.num = 1;
        this.fittingPage.size = size;
    }
}