import { Vue, Component } from 'vue-property-decorator'
// @ts-ignore
import * as api from "_api/system/ProductLA.js";
import Cookies from 'js-cookie'
import { TOKEN_KEY } from '@/libs/util'

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
    private employeeSelecteOption: string = "0"
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
    private roleSelectOption: string = ""
    /**员工表表头 */
    private employeeTableHead: Array<Tableth> = [
        {
            title: "序号",
            minWidth: 50,
            type: "index"
        },
        {
            title: "分配状态",
            minWidth: 120,
            render: (h, params) => {
                var val = '';
                if (params.row.allocation == 0) {
                    val = "已分配"
                } else {
                    val = "未分配"
                }
                return h('span', val);
            }
        },
        {
            title: "角色",
            key: "roleName",
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
            key: "remark",
            minWidth: 240
        },
    ]
    /**员工表数据 */
    private employeeData = []
    /**员工表分页 */
    private employeePage: Page = {
        num: 1,
        total: 0,
        size: 10
    }
    /**员工表加载状态 */
    private employeeLoading: boolean = false;
    /**选择的员工id */
    private employeeId: string = '';
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
            label: '车型',
        },
        // {
        //     value: '3',
        //     label: '首字拼音',
        // },
    ]
    /**待分配列表选中的分配状态选项 */
    private waitPartTransListSelecteOption: string = "0"
    /**待分配列表查询内容 */
    private waitPartTransListContent: string = ""
    /**待分配列表表头 */
    private waitPartListTableHead: Array<Tableth> = [
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
            key: "qualityName",
            minWidth: 180
        },
        {
            title: "品牌",
            key: "partBrandName",
            minWidth: 120
        },
        {
            title: "编码",
            key: "code",
            minWidth: 120
        },
        {
            title: "名称",
            key: "partBrandName",
            minWidth: 100
        },
        {
            title: "全称",
            key: "fullName",
            minWidth: 200
        },
        {
            title: "单位",
            key: "unitld",
            minWidth: 80
        },
        {
            title: "规格",
            key: "spec",
            minWidth: 80
        },
        {
            title: "车型",
            key: "carModelName",
            minWidth: 100
        },
    ]
    /**待分配列表数据 */
    private waitPartListData = []
    /**待分配列表分页 */
    private waitPartListPage: Page = {
        num: 1,
        total: 0,
        size: 10
    }
    /**待分配列表加载状态 */
    private waitPartListLoading: boolean = false;
    private distPartLoading:boolean = false;
    /**已分配列表数据 */
    private distPartListData = []
    /**移入移出按钮是否可用 */
    private buttonOnDisable: boolean = true;
    private buttonOffDisable: boolean = true;
    /**待分配查询按钮是否可用 */
    private buttonWaitQuery: boolean = true;
    private selectionWaitPartArr:Array<any> = [];
    private selectionDistPartArr:Array<any> = [];
    // 上传 请求头
    private headers = {
        Authorization:'Bearer ' + Cookies.get(TOKEN_KEY)
    }
    // 上传地址
    private upurl:string = api.upxlxs;

    // mounted
    private async mounted() {
        this.getStaff();
        const roles = await api.getRoles()
        if (roles.code == 0) {
            this.roleOptions = roles.data.content.map((el: any) => {
                return {
                    label: el.displayName,
                    value: el.displayName
                }
            })
            this.roleOptions.unshift({ label: "全部", value: '全部' })
        }
    }

    // methods
    //获取员工表
    private async getStaff() {
        this.employeeLoading = true;
        let params: any = {}
        params.size = this.employeePage.size;
        params.page = this.employeePage.num - 1;
        if(this.employeeSelectContent.trim().length > 0) {
            if (this.employeeSelecteOption == '0') {
                params.userName = this.employeeSelectContent.trim();
            }
            if (this.employeeSelecteOption == '1') {
                params.phone = this.employeeSelectContent.trim();
            }
        }
        if (this.DistributionStateSelecteOption != '0') {
            if (this.DistributionStateSelecteOption == '1') {
                params.allocation = 1;
            } else {
                params.allocation = 0;
            }
        }
        if (this.roleSelectOption != "全部") {
            params.roleName = this.roleSelectOption;
        }
        let res = await api.getStaffList(params);
        if (res.code == 0) {
            this.employeeLoading = false;
            this.employeeData = res.data.content;
            this.employeePage.total = res.data.totalElements
        } else {
            this.employeeLoading = false;
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

    // 名字loginName
    private loginName:string = "";
    // 选取员工列表
    private currentRow(row: any) {
        let id: string = row.id;
        this.employeeId = id;
        this.buttonWaitQuery = false;
        this.loginName = row.loginName;
        this.waitPartListLoading = false;
        this.distPartLoading = false;
        this.getwaitEmps();
        this.getEmps();
    }

    // 获取待分配列表
    private async getwaitEmps() {
        this.waitPartListData = [];
        this.waitPartListLoading = true;
        let params: any = {}
        let data: any = {};
        data.empId = this.employeeId;
        params.size = this.waitPartListPage.size;
        params.page = this.waitPartListPage.num - 1;
        if(this.waitPartTransListContent.trim().length > 0) {
            switch (this.waitPartTransListSelecteOption) {
                case "0":
                    data.partCode = this.waitPartTransListContent;
                    break;
                case "1":
                    data.fullName = this.waitPartTransListContent;
                    break;
                case "2":
                    data.adapterCarModel = this.waitPartTransListContent;
                    break;
                case "3":
                    data.keyWord = this.waitPartTransListContent;
                    break;
                default:
                    break;
            }
        }
        let res: any = await api.findByEmp(params, data);
        if(res.code == 0) {
            this.waitPartListLoading = false;
            this.waitPartListData = res.data.content.map((el:any) => {
                let obj = {...el};
                if(obj.isDistribution != null) {
                    obj._disabled = true;
                }
                return obj;
            });
            this.waitPartListPage.total = res.data.totalElements;
        }
    }

    // 获取已分配列表
    private async getEmps() {
        this.distPartLoading = true;
        this.distPartListData = [];
        let params: any = { empId: this.employeeId }
        let res: any = await api.findAttByEmpId(params);
        if(res.code == 0) {
            this.distPartLoading = false;
            this.distPartListData = res.data;
        }
    }

    // 查询待分配列表
    private queryWaitPart() {
        this.getwaitEmps();
    }

    //  翻页-待分配列表
    private waitPartListChangePage(p: number) {
        this.waitPartListPage.num = p;
        this.getwaitEmps();
    }
    // 修改每页显示条数-待分配列表
    private waitPartListChangeSize(size: number) {
        this.waitPartListPage.num = 1;
        this.waitPartListPage.size = size;
        this.getwaitEmps();
    }

    // 选择待选
    private selectWaitPart(selection) {
        this.selectionWaitPartArr = selection;
    }

    // 选择已分配
    private selectDistPart(selection) {
        this.selectionDistPartArr = selection;
    }

    // 移入
    private async moveOn() {
        if(this.selectionWaitPartArr.length <=0 ) {
            return this.$Message.error('请选择配件')
        }
        let data:any = this.selectionWaitPartArr.map((el:any) => {
            return {
                partCode: el.partCode,
                empId: this.employeeId,
                partBrandCode: el.partBrandCode,
                partId: el.partId,
                partInnerId: el.code,
                partBrand: el.partBrand,
                empName: this.loginName,
            }
        })
        this.distPartListData = JSON.parse(JSON.stringify(this.selectionWaitPartArr))
        this.selectionWaitPartArr = [];
        let res:any = await api.employeeAddPart(data);
        if(res.code == 0) {
            this.$Message.success('移入成功')
        }
        this.getwaitEmps();
        this.getEmps();
    }

    // 移出
    private async moveOff() {
        if(this.selectionDistPartArr.length <=0 ) {
            return this.$Message.error('请选择配件')
        }
        let data:any = this.selectionDistPartArr.map((el:any) => {
            return {
                id: el.id
                // id: el.empAttributeId,
                // attId: el.id,
                // empId: this.employeeId,
            }
        })
        this.selectionDistPartArr = [];
        let res:any = await api.employeeDeletePart(data);
        if(res.code == 0) {
            this.$Message.success('移出成功')
        }
        this.getwaitEmps();
        this.getEmps();
    }

    // 上传前
    private handleBeforeUpload() {
        let refs:any =  this.$refs;
        refs.upload.clearFiles();
    }
    // 上传成功
    private handleSuccess(res, file){
        let self:any = this;
        if(res.code == 0) {
            self.$Message.success('导入成功');
            self.$Message.success(res.data);
            // this.getwaitEmps();
            // this.getEmps();
        } else {
            self.$Message.error(res.message);
        }
    }

    private down() {
        api.down('1100000000');
    }
}