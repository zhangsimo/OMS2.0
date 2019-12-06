const uuidv4 = require("uuid/v4");
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
// @ts-ignore
import * as api from "_api/system/partManager";
// @ts-ignore
import * as tools from "_utils/tools";
let price = (rule: any, value: any, callback: Function) => {
    if (!value && value !== 0) {
        callback(new Error("单次扣减华币不能为空"));
    } else {
        let reg = /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^([^0][0-9]+|0)$/;
        if (!reg.test(value)) {
            callback("请输入正确格式");
        } else {
            callback();
        }
    }
};
let price2 = (rule: any, value: any, callback: Function) => {
    if (!value) {
        callback(new Error("销售价不能为空"));
    } else {
        if (!/[^\d.]/g.test(value)) {
            if (/[.]/g.test(value)) {
                let reg = /^\d+\.\d{1,2}$/;
                if (!reg.test(value)) {
                    callback("请输入正确格式");
                } else {
                    callback();
                }
            } else {
                callback();
            }
        } else {
            callback("请输入数字格式");
        }
    }
};

@Component
export default class Accessories extends Vue {
    private proModal: boolean = false;
    private linkModal: boolean = false;
    private customModal: boolean = false;
    private addPartModal: boolean = false;
    private content: string = "";
    private yp: boolean = false;
    /**新增或修改 */
    private update: boolean = false;
    /**修改id */
    private id: string = "";
    /**选择class名字 */
    private customClassName: any = "";
    /**是否禁用 */
    private prohibit: boolean = false;
    /**是否禁售 */
    private forbidsale: boolean = false;
    /**所有品牌 */
    private brandAll: Array<any> = [];
    /**所有品质 */
    private qualitites: Array<any> = [];
    /**所有单位 */
    private dictCodeAll: Array<any> = [];
    /**所有车型 */
    private carModelAll: Array<any> = [];
    /**规格表头 */
    private columnsTab: Array<Tableth> = [];
    /**规格表加载 */
    private loading: boolean = false;
    /**配件信息表加载 */
    private partloading: boolean = false;
    /**配件信息表表头 */
    private columnsPart: Tableth = [
        {
            title: "序号",
            minWidth: 50,
            type: "index"
        },
        {
            title: "配件名称",
            key: "",
            align: "center",
            children: [
                {
                    title: "标准名称",
                    key: "name",
                    minWidth: 200
                },
                {
                    title: "方向",
                    key: "direction",
                    minWidth: 120
                },
                {
                    title: "别名",
                    key: "nameCn",
                    minWidth: 120
                }
            ]
        }
    ];
    /**配件信息表 */
    /**tree */
    private treeData: Array<Tree> = [];
    private treeDataOrgin: Array<Tree> = [];
    /**配件名称表 */
    private tbdata: Array<any> = [];
    /**选中的配件名称行 */
    private partnamerow: any = null;
    /**自定义分类 */
    private customAll: Array<any> = [];
    /**新规格 */
    private newSpecObj: any = {
        companyNum: 1, // 数量
        wide: 0, // 宽
        high: 0, // 高
        longNum: 0, // 长
        volume: 0, // 体积
        weight: 0, // 重量
        volumeRong: 0, // 容积
        isMinCompany: false,
        meterCompany: "" // 单位
    };
    /**单位换算 */
    private valueVOS: Array<any> = [
        {
            keyFir: "",
            value: "",
            keySen: ""
        }
    ];
    /**单位换算 */
    private valueVo: any = {
        keyFir: "",
        value: "",
        keySen: ""
    };
    // 配件全称
    get fullName(): string {
        let fullName: string = "";
        if (!!this.formValidate.name) {
            fullName += this.formValidate.name;
        }
        if (!!this.formValidate.spec) {
            fullName += this.formValidate.spec;
        }
        if (!!this.formValidate.applyCarbrandId) {
            fullName += this.formValidate.carModelName;
        }
        if (!!this.formValidate.partBrandId) {
            fullName += this.formValidate.partBrandId;
        }
        return fullName;
    }
    /**表单数据 */
    private formValidate = {
        id: "",
        customName: "", // 自定义分类名称
        nameEn: "",
        qualityName: "",
        partNameId: "",
        tenantId: "",
        applyCarModel: "",
        qualityTypeId: "", //品质
        partBrandId: "", //品牌
        partBrandName: "",
        brandPartCode: "",
        code: "", //配件编码
        name: "", //配件名称
        unit: "", //配件单位
        unitname: "", // 配件单位名称
        oemCode: "", //oe码
        spec: "", //规格
        model: "", //型号
        applyCarbrandId: "", //适用车型Id
        carModelName: "",
        carBrand: "",
        explain: "", //车型说明
        commonCode: "", //通用编码
        produceFactory: "", //生产厂家
        origin: "", //产地
        fullName: "", //配件全称
        customClassName: "",
        remarks: "", //备注
        carTypeIdFir: "",
        carTypeIdSen: "",
        carTypeIdThr: "",
        carTypefName: "",
        carTypesName: "",
        carTypetName: "",
        specVOList: new Array(), //规格list
        valueVOS: new Array() //单位换算list
    };
    private formValidate2: any = {};
    /**校验 */
    private ruleValidate: Kv = {
        qualityTypeId: [
            { required: true, message: "配件品质不能为空", trigger: "change" }
        ],
        partBrandId: [
            { required: true, message: "配件品牌不能为空", trigger: "change" }
        ],
        code: [{ required: true, message: "配件编码不能为空", trigger: "blur" }],
        name: [{ required: true, message: "配件名称不能为空", trigger: "blur" }],
        unit: [{ required: true, message: "配件单位不能为空", trigger: "change" }]
    };
    /**新增配件表单 */
    private formPart: Kv = {
        nameStd: "", // 名称
        nameCn: "", // 别名
        partTypeF: "", // 配件一级分类
        partTypeS: "", // 配件二级分类
        partTypeT: "", // 配件三级分类
        mark: "" // 补充说明
    };
    // 校验
    private rulePart: Kv = {
        nameStd: [{ required: true, message: "标准名称不能为空", trigger: "blur" }],
        nameCn: [{ required: true, message: "别名不能为空", trigger: "blur" }],
        partTypeF: [
            { required: true, message: "分类不能为空", trigger: ["blur", "change"] }
        ],
        partTypeS: [
            { required: true, message: "分类不能为空", trigger: ["blur", "change"] }
        ],
        partTypeT: [
            { required: true, message: "分类不能为空", trigger: ["blur", "change"] }
        ]
    };
    // 配件分类名称三级联动
    private partTypeFT: Array<Kv> = [];
    private partTypeSD: Array<Kv> = [];
    private partTypeTH: Array<Kv> = [];
    // 分页
    private part = {
        page: {
            num: 1,
            total: 0,
            size: 10
        }
    };
    /**===============mounted============= */
    // 初始化配件分类
    // 初始化配件分类
    private async treeInit() {
        let res: any = await api.findWbAllByTree();
        if (res.code == 0) {
            this.treeData = res.data.content;
            this.partTypeFT = this._.cloneDeep(res.data);
            tools.transTree(this.treeData, "typeName");
            this.treeDataOrgin = this._.cloneDeep(this.treeData);
        }
    }
    // 配件品质品牌
    private async initwbppb() {
        let res = await api.getWbPartBrand();
        if (res.code == 0) {
            for (let quality of res.data.content) {
                let qua = {
                    label: quality.quality,
                    value: quality.qualityCode,
                    children: quality.children
                };
                this.qualitites.push(qua);
                if (quality.children.length <= 0) {
                    break;
                }
            }
        }
    }

    private async initclassisc() {
        let classres: any = await api.classification();
        if (classres.code == 0) {
            this.customAll = classres.data || [];
        }
    }

    private async initdic() {
        let disres: any = await api.getdictCode();
        if (disres.code == 0) {
            this.dictCodeAll = disres.data.itemVOS;
        }
    }

    private created() {
        this.formValidate2 = this._.cloneDeep(this.formValidate);
    }

    private mounted() {
        this.initdic();
        this.initclassisc();
        this.initwbppb();
        this.getwbBands();
        this.getcarModelall();
        this.treeInit();
        this.getPartsName();
    }

    /**============methods============== */
    // 车型下拉加载更多
    private loadmore() {
        this.getcarModelall();
    }
    // 车型下拉框
    private carModelPage = {
        pageSize: 10,
        page: 0
    };
    private carModelName: string = "";
    private remoteloading: boolean = false;
    private remoteMethod(query) {
        if (query != "") {
            this.carModelPage.page = 0;
            this.carModelName = query;
            this.remoteloading = true;
            this.getcarModelall();
            this.remoteloading = false;
        } else {
            this.carModelName = "";
            this.carModelAll = [];
        }
    }
    private changcarmodel() {
        this.carModelAll = new Array();
        this.getcarModelall()
    }
    private async getcarModelall() {
        let data: any = {
            ...this.carModelPage,
        };
        if (this.carModelName) {
            data.carModelId = this.carModelName;
        }
        if (this.formValidate.nameEn) {
            data.nameEn = this.formValidate.nameEn;
        }
        let model: any = await api.findCarModel(data);
        if (model.code == 0) {
            this.carModelPage.page += 1;
            let all: any;
            for (let key in model.data.content) {
                let carmodel: Array<any> = model.data.content[key];
                carmodel.forEach((el: any) => {
                    if (el.carModelId != "00000000") {
                        el.label = el.carModelName;
                        el.value = uuidv4();
                        this.carModelAll.push(el);
                    } else {
                        if (!all) {
                            el.label = el.carModelName;
                            el.value = el.value = uuidv4();
                            all = el;
                        }
                    }
                });
            }
            if (this.carModelPage.page <= 0) {
                this.carModelAll.push(all);
            }
        }
    }
    // 车型品牌
    private wbBansarr: Array<any> = new Array();
    private async getwbBands() {
        let res: any = await api.getwbBands()
        if (res.code == 0) {
            this.wbBansarr = res.data.content.map((el: any) => {
                return {
                    label: el.nameCn,
                    value: el.nameEn,
                    id: el.id,
                }
            })
        }
    }

    /**获取配件名称 */
    private typeId: string = "";
    private partSnameCn: string = "";
    private async getPartsName() {
        let data: Kv = {};
        if (this.typeId) {
            data.typeId = this.typeId;
        }
        if (this.partSnameCn) {
            data.nameCn = this.partSnameCn;
        }
        let res: any = await api.getPartName(data);
        if (res.code == 0) {
            this.tbdata = res.data.content;
            this.part.page.total = res.data.total;
        }
    }

    // 选择品质
    private async seletBandAll(value: string) {
        let quality: any = {};
        this.brandAll = [];
        this.qualitites.forEach((el: any) => {
            if (el.value === value) {
                quality = el;
                this.formValidate.qualityName = el.label;
            }
        });
        Array.isArray(quality.children) && quality.children.forEach((el: any) => {
            el.label = el.name;
            el.value = el.id;
            this.brandAll.push(el);
        });
    }
    // 选择配件品牌
    selectPartBrand(value: string) {
        this.brandAll.forEach((el: any) => {
            if (el.value === value) {
                this.formValidate.partBrandName = el.label;
                this.formValidate.brandPartCode = el.code;
            }
        });
    }

    // 选择车型
    private selectCar(carid: string) {
        let applyCarModel: string = "";
        this.carModelAll.forEach((el: any) => {
            if (el.value == carid) {
                this.formValidate.carModelName = el.carModelName;
                this.formValidate.carBrand = el.carBrandName;
            }
        });
    }

    /**获取配件资料 */
    private async getpartinfo() {
        let res: any = await api.findbyidInfo(this.id);
        if (res.code == 0) {
            let data = res.data;
            this.formValidate = { ...data };
            this.formValidate.valueVOS = data.attributeValueVOS || [];
            this.formValidate.specVOList = data.attributeSpecVOS || [];
        }
    }
    private showName() {
        this.linkModal = true;
    }
    // 新增单位换算列表
    private addValueVOS() {
        let objItem = Object.assign({}, this.valueVo);
        this.valueVOS.push(objItem);
    }
    // 删除单位换算列表
    private delValueVOS() {
        if (this.valueVOS.length > 1) {
            this.valueVOS.pop();
        }
    }
    //新增规格
    private addSpec() {
        let objData = this._.cloneDeep(this.newSpecObj);
        if (this.formValidate.specVOList.length <= 0) {
            objData.isMinCompany = true;
        }
        this.formValidate.specVOList.push(objData);
    }
    // 删除规格
    private delSpec() {
        if (this.formValidate.specVOList.length <= 1) return;
        let vo: any = this.formValidate.specVOList.pop();
        if (vo) {
            let meterCompany: string = vo.meterCompany;
            this.dictCodeAll.forEach((el: any) => {
                if (el.itemName === meterCompany) {
                    el.disabled = false;
                }
            });
        }
        this.dictCodeAll.push();
    }
    // 单位选择
    private changeSelect(item: string) {
        this.dictCodeAll.forEach((el: any) => {
            el.disabled = false;
            this.formValidate.specVOList.forEach((vo: any) => {
                if (vo.meterCompany === el.itemName) {
                    el.disabled = true;
                }
            });
        });
        this.dictCodeAll.push();
    }
    changeSelectUnit(item: string) {
        this.dictCodeAll = this.dictCodeAll.map((el: any) => {
            if (el.itemName === item) {
                el.disabled = true;
                this.formValidate.unitname = el.itemName;
            }
            return el;
        });
        if (this.formValidate.specVOList.length <= 0) {
            let objData = { ...this.newSpecObj };
            objData.isMinCompany = true;
            objData.meterCompany = this.formValidate.unitname;
            this.formValidate.specVOList.push(objData);
        } else {
            this.formValidate.specVOList[0].meterCompany = this.formValidate.unitname;
            this.formValidate.specVOList.push();
        }
    }
    // 选择树
    private selectTree(tree: Tree[], data: Tree) {
        this.typeId = data.id;
        this.getPartsName();
    }
    // 选中表格名称行
    private selectTabelData(row: any) {
        this.partnamerow = row;
        this.formValidate.name = row.name;
        this.formValidate.partNameId = row.id;
        this.formValidate.carTypeIdFir = row.baseType.firstType.typeId;
        this.formValidate.carTypeIdSen = row.baseType.secondType.typeId;
        this.formValidate.carTypeIdThr = row.baseType.thirdType.typeId;
        this.formValidate.carTypefName = row.baseType.firstType.typeName;
        this.formValidate.carTypesName = row.baseType.secondType.typeName;
        this.formValidate.carTypetName = row.baseType.thirdType.typeName;
        // this.yp = this.partnamerow.partTypeF && this.partnamerow.partTypeF == 0;
    }
    // 选择
    private selectPartName() {
        let self: any = this;
        if (!this.partnamerow) {
            return self.$Message.error("请选择名称");
        }
        this.linkModal = false;
    }
    // 提交新增配件名称
    private addPartname() {
        this.selectPartName();
    }
    //自定义分类
    private customModalFun() {
        this.customModal = true;
    }
    // 选择自定义分类tag
    private customType: string = "";
    private customName: string = "";
    private handleTag(v: any) {
        this.customClassName = v.id;
        this.customType = v.itemCode
        this.customName = v.itemName;
    }
    //选择自定义分类
    private submitCustom() {
        this.customModal = false;
        if (this.customClassName) {
            this.formValidate.customName = this.customName;
            this.formValidate.customClassName = this.customClassName;
        }
    }
    // 树形搜索
    private queryTree() {
        this.partSnameCn = this.content;
        this.getPartsName();
    }
    // 选择一级
    private selectOne(id: string) {
        let One: any = {};
        this.partTypeFT.forEach((el: any) => {
            if (el.id === id) {
                One = el;
            }
        });
        this.partTypeSD = One.children || [];
        this.formPart.partTypeS = "";
        this.formPart.partTypeT = "";
    }
    // 选择二级
    private selectTwo(id: string) {
        let One: any = {};
        this.partTypeSD.forEach((el: any) => {
            if (el.id === id) {
                One = el;
            }
        });
        this.partTypeTH = One.children || [];
        this.formPart.partTypeT = "";
    }
    // 选择三级
    private selectThree(id: string) { }

    private changePartPage(p: number) {
        this.part.page.num = p;
        this.getPartsName();
    }
    private changePartSize(size: number) {
        this.part.page.num = 1;
        this.part.page.size = size;
        this.getPartsName();
    }

    // 新增配件名称
    private addpartCnname(name: string) {
        let form: any = this.$refs[name];
        form.validate(async (valid: any) => {
            if (valid) {
                let res: any = await api.savePartName(this.formPart);
                if (res.code === 0) {
                    let self: any = this;
                    this.getPartsName();
                    self.$Message.success("保存成功");
                    this.addPartModal = false;
                }
            }
        });
    }
    // 提交
    private submit(name: string) {
        let self: any = this;
        let form: any = this.$refs[name];
        let bing: boolean = this.formValidate.specVOList.every((element: any) => element.meterCompany);
        form.validate(async (valid: any) => {
            if (valid && bing) {
                let data: any = {
                    partNameId: this.formValidate.partNameId,
                    qualityTypeId: this.formValidate.qualityTypeId,
                    partBrandId: this.formValidate.partBrandId,
                    partBrandName: this.formValidate.partBrandName,
                    brandPartCode: this.formValidate.brandPartCode,
                    code: this.formValidate.code,
                    unitId: this.formValidate.unit,
                    name: this.formValidate.name,
                    oemCode: this.formValidate.oemCode,
                    spec: this.formValidate.spec,
                    model: this.formValidate.model,
                    commonId: this.formValidate.commonCode,
                    explains: this.formValidate.explain,
                    manufacture: this.formValidate.produceFactory,
                    prdtPlace: this.formValidate.origin,
                    direction: this.formValidate.remarks,
                    carModelName: this.formValidate.carModelName,
                    qualityName: this.formValidate.qualityName,
                    carTypeF: this.formValidate.carTypeIdFir,
                    carTypeS: this.formValidate.carTypeIdSen,
                    carTypeT: this.formValidate.carTypeIdThr,
                    carTypefName: this.formValidate.carTypefName,
                    carTypesName: this.formValidate.carTypesName,
                    carTypetName: this.formValidate.carTypetName,
                    specVOS: this.formValidate.specVOList.map((el: any) => {
                        let obj = this._.cloneDeep(el);
                        obj.isMinCompany = el.isMinCompany ? 1 : 0;
                        return obj;
                    }),
                    fullName: this.fullName
                };
                for (let wb of this.wbBansarr) {
                    if (wb.value == this.formValidate.nameEn) {
                        data.carBrandName = wb.id;
                        data.carBrand = wb.label;
                        this.formValidate.carBrand = wb.value;
                        break;
                    }
                }
                if (this.customType) {
                    data.customType = this.customType;
                }
                if (this.update) {
                    data.id = this.formValidate.id;
                    data.tenantId = this.formValidate.tenantId;
                }
                if (this.prohibit) {
                    data.disabled = 1;
                } else {
                    data.disabled = 0;
                }
                if (this.forbidsale) {
                    data.isSell = 1;
                } else {
                    data.isSell = 0;
                }
                if (this.yp) {
                    data.attributeValueVOS = this.formValidate.valueVOS;
                }
                let res: any = await api.approval(data);
                if (res.code == 0) {
                    this.proModal = false;
                    this.handleReset("proModalform");
                    this.update = false;
                    let parent: any = this.$parent;
                    parent.queryHandle();
                    self.$Message.success("保存成功");
                    this.proModal = false;
                }
            } else {
                self.$Message.error("必填字段未填写!");
            }
        });
    }
    // 重置
    private handleReset(name: string) {
        let form: any = this.$refs[name];
        form.resetFields();
        this.formValidate = this._.cloneDeep(this.formValidate2);
        this.dictCodeAll.forEach((el: any) => {
            el.disabled = false;
        });
        this.prohibit = false;
        this.forbidsale = false;
        this.carModelPage = {
            pageSize: 10,
            page: 0
        };
    }

    private resPart() {
        this.part = {
            page: {
                num: 1,
                total: 0,
                size: 10
            }
        };
        this.getPartsName();
        this.treeData = this._.cloneDeep(this.treeDataOrgin);
    }

    /**========watch========== */
    @Watch('update')
    private changeShow(newval: boolean, oldval: boolean) {
        if (newval) {
            this.getpartinfo();
        }
    }
}