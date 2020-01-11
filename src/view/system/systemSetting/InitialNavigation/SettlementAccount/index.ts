import { Vue, Component } from 'vue-property-decorator'
import { State } from 'vuex-class';
// @ts-ignore
import * as api from "_api/system/SettlementAccount.js"

@Component
export default class SettlementAccount extends Vue {
    @State('user') userData;
    // let user = this.$store.state.user.userData

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
            key: "code",
            minWidth: 120
        },
        {
            title: "账户名称",
            key: "name",
            minWidth: 180
        },
        {
            title: "账户类型",
            minWidth: 120,
            render: (h:any, params:any) => {
                let value:string|number = '';
                this.AccountType.forEach((el: Option) => {
                    if(el.value == params.row.accountTypeId) {
                        value = el.label;
                    }
                })
                return h('span', value);
            }
        },
        {
            title: "是否禁用",
            minWidth: 80,
            render: (h:any, params:any) => {
                let value:string = '';
                if(params.row.isDisabled == 0) {
                    value = '启用'
                } else {
                    value = '禁用'
                }
                return h('span', value);
            }
        },
        {
            title: "备注",
            key: "remark",
            minWidth: 120
        },
        {
            title: "最近修改人",
            key: "updateUname",
            minWidth: 120
        },
        {
            title: "修改日期",
            key: "updateTime",
            minWidth: 120
        },
    ]
    private SelectRow:any = null;
    private modal: boolean = false;
    private title: string = "新增账户";
    private AccountType: Array<Option> = [
        {
            value: '1',
            label: '现金',
        },
        {
            value: '2',
            label: '银行存款',
        },
        {
            value: '3',
            label: '积分/卡券',
        },
    ]
    private formData:Kv = {
        name: '',
        type: '',
        mark: '',
        mode: [{}],
        deleteItems: [],
    }
    private ruleValidate:ruleValidate = {
        name: [
            {required: true, message: "请输入账户名称", trigger: "blur"}
        ],
        type: [
        {required: true, message: "请选择账户类型", trigger: "change"}
      ],
    }
    private SettlementMode:Array<Option> = []
    private itemVOS:Array<any> = [];

    private created() {
        this.getSettlementMode();
    }

    private mounted() {
        this.getAccounts();
    }

    private async getAccounts() {
        this.loading = true;
        const res:any = await api.getAccounts(this.userData.userData.shopId);
        if(res.code == 0) {
            this.loading = false;
            this.tbdata = res.data;
        }
    }

    private async getSettlementMode() {
        const res:any = await api.getdictCode('CUSTOM_003');
        if(res.code == 0) {
            this.itemVOS = res.data.itemVOS;
            this.SettlementMode = res.data.itemVOS.map((el:any) => {
                let obj:Option = {
                    value: el.itemCode,
                    label: el.itemName,
                }
                return obj;
            })
        }
    }

    private currRow(row:any) {
        // 1禁用
        this.SelectRow = row;
        this.buttonDisable = false;
        if(row.isDisabled == 0) {
           this.buttonOn =  true;
        } else {
            this.buttonOn =  false;
        }
    }

    private async onOffAccount() {
        let res:any = await api.onOffAccount(this.SelectRow.id);
        if(res.code == 0) {
            this.$Message.success(res.message);
            this.refresh();
        }
    }

    private del() {
       this.$Modal.confirm({
           title: '是否确定删除?',
           onOk: async () => {
            let res:any = await api.delAccount(this.SelectRow.id);
                if(res.code == 0) {
                    this.$Message.success('删除成功');
                    this.refresh();
                }
            },
            onCancel: () => {
                // this.$Message.info('取消删除');
            }
       })
    }

    private refresh() {
        this.getAccounts();
    }

    private add() {
        this.isNew = true;
        this.modal = true;
        this.reset();
    }

    private update() {
        this.isNew = false;
        this.modal = true;
        this.reset();
        this.setFormDataMode();
        this.formData.name = this.SelectRow.name;
        this.formData.type = this.SelectRow.accountTypeId.toString();
    }

    private submit(name, type) {
        const formref:any = this.$refs[name];
        formref.validate(async (valid) => {
            let bool:boolean = this.formData.mode.every((el:any) => el.id);
            if(!bool) {
                return this.$Message.error('必须选择结算方式');
            }
            if (valid) {
                let data = this.getdata();
                let res:any = await api.addOrUpAccount(data);
                if(res.code == 0) {
                    this.$Message.success('保存成功');
                    this.refresh();
                    if(type == 'save') {
                        this.modal = false;
                    } else {
                        this.add();
                    }
                }
            }
        })
    }

    private setFormDataMode() {
        this.formData.mode = [];
        Array.isArray(this.SelectRow.settleType) && this.SelectRow.settleType.forEach((el:any) => {
            this.formData.mode.push({
                id: el.customId,
                oid: el.id,
                accountId: el.accountId,
            });
        })
        if(this.formData.mode.length <= 0) {
            this.formData.mode = [{}];
        }
    }

    private getdata() {
        let data:any = {
            settleAccount: {},
            settleTypeAdd: [],
            settleTypeDelete: [],
        }
        data.settleAccount.name = this.formData.name;
        data.settleAccount.accountTypeId = this.formData.type;
        data.settleAccount.remark = this.formData.mark;
        if(!this.isNew) {
            data.settleAccount.id = this.SelectRow.id;
        }
        this.formData.mode.forEach((el:any) => {
            for(let i = 0; i < this.itemVOS.length; i++) {
                let item:any = this.itemVOS[i];
                if(el.id == item.itemCode) {
                    let obj:any = {
                        name: this.formData.name,
                        customName: item.itemName,
                        customId: item.itemCode,
                    }
                    if(el.oid) {
                        obj.accountId = el.accountId;
                        obj.id = el.oid;
                    }
                    data.settleTypeAdd.push(obj);
                }
            }
        })
        this.formData.deleteItems.forEach((el:any) => {
            for(let i = 0; i < this.itemVOS.length; i++) {
                let item:any = this.itemVOS[i];
                if(el.code == item.itemCode) {
                    let obj:any = {
                        name: this.formData.name,
                        customName: item.itemName,
                        customId: item.itemCode,
                    }
                    if(!this.isNew) {
                        obj.id = el.oid;
                    }
                    data.settleTypeDelete.push(obj);
                }
            }
        })
        return data;
    }

    private reset() {
        const formData:any = this.$refs['formData'];
        formData.resetFields();
        this.formData.mode = [{}];
        this.formData.deleteItems = [];
    }

    private insert() {
        this.formData.mode.push({});
    }

    private remove(index:number) {
        if(this.formData.mode.length <= 1) return;
        let obj = this.formData.mode.splice(index, 1)[0];
        if(obj.oid) {
            this.formData.deleteItems.push({oid: obj.oid, code: obj.id});
        }
    }
}
