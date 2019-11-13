// import * as api from "_api/lease/customerSM";
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class SettlementAccount extends Vue {
    /**启用or禁用 true启用 */
    private buttonOn: boolean = true;
    /**按钮状态 */
    private buttonDisable: boolean = true;
    /**新增or修改 */
    private isNew: boolean = true;
    private loading: boolean = false;
    private tbdata: Array<any> = [];
    private tbhead: Array<Tableth> = [
        {
            title: "序号",
            minWidth: 50,
            type: "index"
        },
        {
            title: "账号编码",
            key: "meterCompany",
            slot: "meterCompany",
            minWidth: 120
        },
        {
            title: "账户名称",
            key: "meterCompany",
            slot: "meterCompany",
            minWidth: 180
        },
        {
            title: "账户类型",
            key: "meterCompany",
            slot: "meterCompany",
            minWidth: 120
        },
        {
            title: "是否禁用",
            key: "meterCompany",
            slot: "meterCompany",
            minWidth: 80
        },
        {
            title: "备注",
            key: "meterCompany",
            slot: "meterCompany",
            minWidth: 240
        },
        {
            title: "最近修改人",
            key: "meterCompany",
            slot: "meterCompany",
            minWidth: 120
        },
        {
            title: "修改日期",
            key: "meterCompany",
            slot: "meterCompany",
            minWidth: 120
        },
    ]
    private modal: boolean = false;
    private title: string = "新增账户";
    private AccountType: Array<Option> = [
        {
            value: '0',
            label: '现金',
        },
        {
            value: '1',
            label: '银行存款',
        },
        {
            value: '2',
            label: '积分/卡券',
        },
    ]
    private formData:Kv = {
        name: '',
        type: '',
        mark: '',
        mode: [],
    }
    private ruleValidate:ruleValidate = {
        name: [
            {required: true, message: "请输入账户名称", trigger: "blur"}
        ],
        type: [
            {required: true, message: "请选择账户类型", trigger: "change"}
        ],
    }
    private SettlementMode:Array<Option> = [
        {
            value: "0",
            label: "预收款支付",
        }
    ]
    private modalData:Array<any> = [
        {}
    ];


    private add() {
        this.isNew = true;
        this.modal = true;
        this.reset();
    }

    private update() {
        this.isNew = false;
        this.modal = true;
    }

    private reset() {
        const formData:any = this.$refs['formData'];
        formData.resetFields();
    }

    private insert() {
        this.modalData.push({});
    }

    private remove(index:number) {
        console.log(index);
        this.modalData.splice(index, 1);
    }
}