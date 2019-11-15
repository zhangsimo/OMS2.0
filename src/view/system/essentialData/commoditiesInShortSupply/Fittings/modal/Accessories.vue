<template>
  <section class="accessories">
    <Modal v-model="proModal" title="配件资料" width="720" @on-visible-change="handleReset('proModalform')">
      <div class="pb10 tr">
        <Checkbox v-model="prohibit">是否禁用</Checkbox>
        <Checkbox v-model="forbidsale">是否禁售</Checkbox>
      </div>
      <Tabs type="card" :animated="false">
        <TabPane label="基本信息">
          <Form ref="proModalform" :model="formValidate" :rules="ruleValidate" :label-width="110">
            <Row>
              <Col span="11">
                <FormItem label="配件品质：" prop="qualityTypeId">
                  <Select v-model="formValidate.qualityTypeId">
                    <Option
                      v-for="item in brandAll"
                      :value="item.value"
                      :key="item.value"
                    >{{item.label}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="配件品牌：" prop="partBrandId">
                  <Select v-model="formValidate.partBrandId">
                    <Option
                      v-for="item in qualitites"
                      :value="item.value"
                      :key="item.value"
                    >{{item.label}}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem label="编码：" prop="code">
                  <Input v-model="formValidate.code"></Input>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="名称：" prop="name">
                  <Input @on-click="showName" icon="ios-clock-outline" v-model="formValidate.name"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem label="单位：" prop="unit">
                  <Select v-model="formValidate.unit"  @on-change="changeSelectUnit">
                    <Option
                      v-for="item in dictCodeAll"
                      :value="item.itemCode"
                      :key="item.itemName"
                      :disabled="item.disabled"
                    >{{item.itemName}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="OE码：">
                  <Input v-model="formValidate.oemCode"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem label="规格：">
                  <Input v-model="formValidate.spec"></Input>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="型号：">
                  <Input v-model="formValidate.model"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="22">
                <FormItem label="适用车型：">
                  <Select class="w140 mr5" v-model="formValidate.applyCarbrandId" @on-change="selectCar">
                    <Option
                      v-for="item in carModelAll"
                      :value="item.value"
                      :key="item.value"
                    >{{item.label}}</Option>
                  </Select>
                  <Input class="w350" v-model="formValidate.explain"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="22">
                <FormItem label="通用编码：">
                  <Input v-model="formValidate.commonCode"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem label="生产厂家：">
                  <Input v-model="formValidate.produceFactory"></Input>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="产地：">
                  <Input v-model="formValidate.origin"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="22">
                <FormItem label="配件全称：">
                  <Input v-model="fullName" disabled></Input>配件全称 = 名称+规格+车型+品牌
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem label="自定义分类：">
                  <Input
                    @on-click="customModalFun"
                    icon="ios-clock-outline"
                    v-model="formValidate.customClassName"
                  ></Input>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="备注：">
                  <Input v-model="formValidate.remarks"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row v-if="yp">
              <Col span="22">
                <FormItem label="单位换算：" class="x11">
                  <div class="flex">
                    <div>
                      <div class="unit-item w300" v-for="(v, index) in valueVOS" :key="index">
                        <Select class="w80" v-model="v.keyFir">
                          <Option
                            v-for="item in dictCodeAll"
                            :value="item.itemName"
                            :key="item.itemName"
                          >{{item.itemName}}</Option>
                        </Select>
                        <Input class="w80" v-model="v.value"></Input>
                        <Select class="w80" v-model="v.keySen">
                          <Option
                            v-for="item in dictCodeAll"
                            :value="item.itemName"
                            :key="item.itemName"
                          >{{item.itemName}}</Option>
                        </Select>
                      </div>
                    </div>
                    <!-- <div>
                      <Button class="ml30" @click="addValueVOS" type="default">
                        <Icon type="md-add" size="14" />新增
                      </Button>
                      <Button class="ml10" @click="delValueVOS" type="primary">
                        <i class="iconfont mr5 iconlajitongicon"></i>删除
                      </Button>
                    </div> -->
                  </div>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </TabPane>
        <TabPane label="包装规格">
          <div class="pb10">
            <Button type="default" @click="addSpec" class="mr10 w90">新增规格</Button>
            <Button @click="delSpec" type="default" class="mr10 w90">删除</Button>
          </div>
          <Table
            height="300"
            size="small"
            :loading="loading"
            border
            :stripe="true"
            :columns="columnsTab"
            :data="formValidate.specVOList"
          >
            <template slot-scope="{ row, index }" slot="meterCompany">
              <span v-if="index===0">{{formValidate.unitname}}</span>
              <Select @on-change="changeSelect" v-else :transfer="true" class="w80" v-model="formValidate.specVOList[index].meterCompany">
                <Option
                  v-for="item in dictCodeAll"
                  :value="item.itemCode"
                  :key="item.itemName"
                  :disabled="item.disabled"
                >{{item.itemName}}</Option>
              </Select>
            </template>
          </Table>
        </TabPane>
      </Tabs>
      <div slot="footer">
        <Button type="primary" @click="submit('proModalform')">确定</Button>
        <Button type="default" @click="proModal = false; handleReset('proModalform')">取消</Button>
      </div>
    </Modal>
    <Modal v-model="linkModal" title="配件名称查询" width="1000">
      <div class="partCheck-hd">
        <Input class="w200 mr10" v-model="content"></Input>
        <Button class="mr10" type="primary" @click="queryTree">
          <Icon type="ios-search" size="14" />查询
        </Button>
        <Button class="mr10" type="default" @click="selectPartName">
          <Icon type="md-checkmark" />选择
        </Button>
        <Button type="default" @click="addPartModal = true">
          <Icon type="md-add" />新增配件名称
        </Button>
      </div>
      <div class="part-main">
        <div class="part-left">
          <div class="partCheck-left-tit">系统分类</div>
          <div class="partCheck-left-tree">
            <Tree :data="treeData" @on-select-change="selectTree"></Tree>
          </div>
        </div>
        <div class="part-right">
          <Table
            @on-current-change="selectTabelData"
            size="small"
            highlight-row
            :loading="partloading"
            border
            :stripe="true"
            :columns="columnsPart"
            :data="tbdata"
          ></Table>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="addPartname">确定</Button>
        <Button type="default" @click="linkModal = false">取消</Button>
      </div>
    </Modal>
    <Modal v-model="customModal" title="自定义分类" width="500">
      <div class="partCheck-hd">
        <Button @click="submitCustom" class="mr10" type='default'><Icon type="md-checkmark" /> 选择</Button>
        <Button @click="customModal=false" type='default'><Icon type="md-close"/> 取消</Button>
      </div>
      <div class="custom-main">
        <div class="custom-item" v-for="(v, index) in customAll" :key="index">
          <p class="custom-type-hd">{{v.dictName}}：</p>
          <div>
            <span
              class="tag-span"
              :class="{'active':customClassName==v1.itemName}"
              @click="handleTag(v1)"
              @on-change="handleTag(v1)"
              v-for="(v1, index) in v.itemVOS" :key="index">{{v1.itemName}}</span>
          </div>
        </div>
      </div>
      <div slot='footer'>
      </div>
    </Modal>
    <Modal v-model="addPartModal" title="新增配件名称" width="500" @on-visible-change="handleReset('PartForm')">
      <Form ref="PartForm" :model="formPart" :rules="rulePart" :label-width="110">
        <FormItem label="标准名称:" prop="nameStd">
          <Input v-model="formPart.nameStd" />
        </FormItem>
        <FormItem label="别名:" prop="nameCn">
          <Input v-model="formPart.nameCn" />
        </FormItem>
        <FormItem label="配件一级分类:" prop="partTypeF">
          <Select class="w120" @on-change="selectOne" v-model="formPart.partTypeF" :transfer="true">
            <Option
              v-for="item in partTypeFT"
              :value="item.id"
              :key="item.id"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="配件二级分类:" prop="partTypeS">
          <Select class="w120" @on-change="selectTwo" v-model="formPart.partTypeS" :transfer="true">
            <Option
              v-for="item in partTypeSD"
              :value="item.id"
              :key="item.id"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="配件三级分类:" prop="partTypeT">
          <Select class="w120" @on-change="selectThree" v-model="formPart.partTypeT" :transfer="true">
            <Option
              v-for="item in partTypeTH"
              :value="item.id"
              :key="item.id"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="补充说明:">
          <Input v-model="formPart.mark" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="addpartCnname('PartForm')">保存</Button>
        <Button type="default" @click="addPartModal = false; handleReset('PartForm')">取消</Button>
      </div>
    </Modal>
  </section>
</template>

<script lang="ts">
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
  private content:string = '';
  private yp:boolean = false;
  /**新增或修改 */
  private update:boolean = false;
  /**修改id */
  private id:string = "";
  /**选择class名字 */
  private customClassName:any = '';
  /**是否禁用 */
  private prohibit: boolean = false;
  /**是否禁售 */
  private forbidsale: boolean = false;
  /**所有品牌 */
  private brandAll: Array<any> = [];
  /**所有品质 */
  private qualitites:Array<any> = [];
  /**所有单位 */
  private dictCodeAll: Array<any> = [];
  /**所有车型 */
  private carModelAll: Array<any> = [];
  /**规格表头 */
  private columnsTab: Array<Tableth> = [
    {
      title: "序号",
      minWidth: 50,
      type: "index"
    },
    {
      title: "计量单位",
      key: "meterCompany",
      slot: "meterCompany",
      minWidth: 90
    },
    {
      title: "单位数量",
      key: "companyNum",
      minWidth: 65
    },
    {
      title: "长",
      key: "longNum",
      minWidth: 50
    },
    {
      title: "宽",
      key: "wide",
      minWidth: 50
    },
    {
      title: "高",
      key: "high",
      minWidth: 50
    },
    {
      title: "体积",
      key: "volume",
      minWidth: 50
    },
    {
      title: "重量",
      key: "weight",
      minWidth: 50
    },
    {
      title: "容积",
      key: "volumeRong",
      minWidth: 50
    },
    {
      title: "设为起订单位",
      key: "name",
      minWidth: 90,
      render: (h: any, params: any) => {
        let com = params.row.isMaxCompany;
        return h("Checkbox", {
          props: {
            value: com === 0 ? false : true
          },
          on: {
            'on-change': (e:boolean) => {
              this.formValidate.specVOList.forEach((el:any) => {
                this.$set(el, 'isMaxCompany', 0);
              });
              if(e) {
                this.formValidate.specVOList[params.index].isMaxCompany = 1;
              } else {
                this.formValidate.specVOList[params.index].isMaxCompany = 0;
              }
            }
          }
        });
      }
    },
    {
      title: "最小起量单位",
      key: "name",
      minWidth: 90,
      render: (h: any, params: any) => {
        let com = params.row.isMinCompany;
        return h("Checkbox", {
          props: {
            value: com === 0 ? false : true
          },
          on: {
            'on-change': (e:boolean) => {
              if(e) {
                this.formValidate.specVOList[params.index].isMinCompany = 1;
              } else {
                this.formValidate.specVOList[params.index].isMinCompany = 0;
              }
            }
          }
        });
      }
    }
  ];
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
      key: "name",
      align: "center",
      children: [
        {
          title: "标准名称",
          key: "nameStd",
          minWidth: 200
        },
        {
          title: "方向",
          key: "orgname",
          minWidth: 120
        },
        {
          title: "别名",
          key: "nameCn",
          minWidth: 120
        },
      ]
    }
  ];
  /**配件信息表 */
  /**tree */
  private treeData:Array<Tree> = [];
  private treeDataOrgin:Array<Tree> = [];
  /**配件名称表 */
  private tbdata: Array<any> = [];
  /**选中的配件名称行 */
  private partnamerow:any = null;
  /**自定义分类 */
  private customAll:Array<any> = [];
  /**新规格 */
  private newSpecObj: any = {
    companyNum: 1, // 数量
    wide: 0, // 宽
    high: 0, // 高
    longNum: 0, // 长
    volume: 0, // 体积
    weight: 0, // 重量
    volumeRong: 0, // 容积
    isMinCompany: 0,
    isMaxCompany: 0,
    meterCompany: '', // 单位
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
  get fullName():string {
    let fullName:string = '';
    if(!!this.formValidate.name) {
      fullName += this.formValidate.name;
    }
    if(!!this.formValidate.spec) {
      fullName += this.formValidate.spec;
    }
    if(!!this.formValidate.applyCarbrandId) {
      fullName += this.formValidate.applyCarbrandId;
    }
    if(!!this.formValidate.partBrandId) {
      fullName += this.formValidate.partBrandId;
    }
    return fullName;
  }
  /**表单数据 */
  private formValidate = {
    id: "",
    tenantId: "",
    applyCarModel: "",
    qualityTypeId: "", //品质
    partBrandId: "", //品牌
    code: "", //配件编码
    name: "", //配件名称
    unit: "", //配件单位
    unitname: "", // 配件单位名称
    oemCode: "", //oe码
    spec: "", //规格
    model: "", //型号
    applyCarbrandId: "", //适用车型Id
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
    specVOList: new Array(), //规格list
    valueVOS: new Array() //单位换算list
  };
  /**校验 */
  private ruleValidate:Kv = {
    qualityTypeId: [
      { required: true, message: "配件品质不能为空", trigger: "change" }
    ],
    partBrandId: [
      { required: true, message: "配件品牌不能为空", trigger: "change" }
    ],
    code: [
      { required: true, message: "配件编码不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "配件名称不能为空", trigger: "blur" }
    ],
    unit: [
      { required: true, message: "配件单位不能为空", trigger: "change" }
    ],
  };
  /**新增配件表单 */
  private formPart:Kv = {
    nameStd: "", // 名称
    nameCn: "", // 别名
    partTypeF: "", // 配件一级分类
    partTypeS:"", // 配件二级分类
    partTypeT: "", // 配件三级分类
    mark: "", // 补充说明
  }
  // 校验
  private rulePart:Kv = {
    nameStd: [
      {required: true, message: "标准名称不能为空", trigger: "blur"}
    ],
    nameCn: [
      {required: true, message: "别名不能为空", trigger: "blur"}
    ],
    partTypeF: [
      {required: true, message: "分类不能为空", trigger: ["blur", "change"]}
    ],
    partTypeS: [
      {required: true, message: "分类不能为空", trigger: ["blur", "change"]}
    ],
    partTypeT: [
      {required: true, message: "分类不能为空", trigger: ["blur", "change"]}
    ],
  }
  // 配件分类名称三级联动
  private partTypeFT:Array<Kv> = [];
  private partTypeSD:Array<Kv> = [];
  private partTypeTH:Array<Kv> = [];
  /**===============mounted============= */
  // 初始化配件分类
  private async treeInit() {
    let res: any = await api.findAllByTree();
    if (res.code == 0) {
      this.treeData = res.data;
      this.partTypeFT = this._.cloneDeep(res.data);
      tools.transTree(this.treeData);
      this.treeDataOrgin = this._.cloneDeep(this.treeData);
    }
  }
  private async mounted() {
    let res = await api.getPartBrand();
    if (res.code == 0) {
      res.data.forEach((el: any) => {
        el.label = el.name;
        el.value = el.id;
        if (el.parentId != '0') {
          this.brandAll.push(el);
        } else {
          this.qualitites.push(el);
        }
      })
    }

    let model:any = await api.findCarModel();
    if(model.code == 0) {
      model.data.forEach((el: any) => {
        el.label = el.carBrandName;
        el.value = el.id;
        this.carModelAll.push(el);
      })
    }

    let classres:any = await api.classification();
    if(classres.code == 0) {
      this.customAll = classres.data||[];
    }

    let disres:any = await api.getdictCode();
    if(disres.code == 0) {
      this.dictCodeAll = disres.data.itemVOS;
    }

    this.treeInit();
    this.getPartsName();
  }

  /**============methods============== */
  /**获取配件名称 */
  private async getPartsName(id?: string) {
    let data:Kv = {}
    if(id) {
      data.type = id
    }
    let res:any = await api.getPartName(data);
    if(res.code == 0) {
      this.tbdata = res.data;
    }
  }

  // 选择车型
  private selectCar(carid:string) {
    let applyCarModel:string = '';
    this.carModelAll.forEach((el:any) => {
      if(this.formValidate.applyCarbrandId == carid) {
        applyCarModel = el.carModel;
      }
    })
    this.formValidate.applyCarModel = applyCarModel;
  }

  /**获取配件资料 */
  private async getpartinfo() {
    let res:any = await api.findbyidInfo(this.id);
    if(res.code == 0) {
      let data = res.data;
      if(data.carTypeIdFir == '1') {
        this.yp = true;
      }
      this.formValidate.id = data.id;
      this.formValidate.tenantId = data.tenantId;
      this.formValidate.qualityTypeId = data.qualityTypeId;
      this.formValidate.partBrandId = data.partBrandId;
      this.formValidate.code = data.code;
      this.formValidate.name = data.name;
      this.formValidate.unit = data.unit;
      this.formValidate.oemCode = data.oemCode;
      this.formValidate.spec = data.spec;
      this.formValidate.model = data.model;
      this.formValidate.explain = data.explain;
      this.formValidate.produceFactory = data.produceFactory;
      this.formValidate.origin = data.origin;
      this.formValidate.fullName = data.fullName;
      this.formValidate.remarks = data.remarks;
      this.formValidate.valueVOS = data.attributeValueVOS || [];
      this.formValidate.specVOList = data.attributeSpecVOS;
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
    this.formValidate.specVOList.push(objData);
  }
  // 删除规格
  private delSpec() {
    let vo:any = this.formValidate.specVOList.pop();
    if(vo) {
      let meterCompany:string = vo.meterCompany;
      this.dictCodeAll.forEach((el:any) => {
        if(el.itemCode === meterCompany) {
          el.disabled = false;
        }
      })
    }
    this.dictCodeAll.push();
  }
  // 单位选择
  private changeSelect(item: string) {
    this.dictCodeAll.forEach((el:any) => {
      el.disabled = false;
      this.formValidate.specVOList.forEach((vo:any) => {
          if(vo.meterCompany === el.itemCode) {
            el.disabled = true;
          }
      })
    })
    this.dictCodeAll.push();
  }
  changeSelectUnit(item:string) {
    this.dictCodeAll.forEach((el:any) => {
      if(el.itemCode === item) {
        el.disabled = true;
        this.formValidate.unitname = el.itemName;
      }
    })
    this.dictCodeAll.push();
  }
  // 选择树
  private selectTree(tree: Tree[], data: Tree) {
    this.getPartsName(data.id);
  }
  // 选中表格名称行
  private selectTabelData(row: any) {
    this.partnamerow = row;
    this.formValidate.name = row.name;
    this.formValidate.carTypeIdFir = row.partTypeF;
    this.formValidate.carTypeIdSen = row.partTypeS;
    this.formValidate.carTypeIdThr = row.partTypeT;
    this.yp = this.partnamerow.partTypeF && this.partnamerow.partTypeF == 0;
  }
  // 选择
  private selectPartName() {
    let self:any = this;
    if(!this.partnamerow) {
      return self.$Message.error('请选择名称');
    }
    this.linkModal = false;
  }
  // 提交新增配件名称
  private addPartname() {}
  //自定义分类
  private customModalFun(){
    this.customModal = true;
  }
  // 选择自定义分类tag
  private handleTag(v:any){
    this.customClassName = v.itemName
  }
  //选择自定义分类
  private submitCustom(){
    this.customModal = false;
   if(this.customClassName) {
     this.formValidate.customClassName = this.customClassName
   }
  }
  // 树形搜索
  private queryTree() {
    let content:string = this.content;
    if(!content) {
      this.treeData = this._.cloneDeep(this.treeDataOrgin);
    } else {
      tools.findTree(this.treeData, content);
    }
  }
  // 选择一级
  private selectOne(id: string) {
    let One:any = {};
    this.partTypeFT.forEach((el:any) => {
      if(el.id === id) {
        One = el;
      }
    })
    this.partTypeSD = One.children || [];
    this.formPart.partTypeS = "";
    this.formPart.partTypeT = "";
  }
  // 选择二级
  private selectTwo(id: string) {
    let One:any = {};
    this.partTypeSD.forEach((el:any) => {
      if(el.id === id) {
        One = el;
      }
    })
    this.partTypeTH = One.children || [];
    this.formPart.partTypeT = "";
  }
  // 选择三级
  private selectThree(id: string) {}

  // 新增配件名称
  private addpartCnname(name: string) {
    let form: any = this.$refs[name];
    form.validate(async (valid: any) => {
      if (valid) {
        let res:any = await api.savePartName(this.formPart);
        if(res.code === 0) {
          let self:any = this;
          this.getPartsName();
          self.$Message.success('保存成功');
          this.addPartModal = false;
        }
      }
    });
  }
  // 提交
  private submit(name: string) {
    let self:any = this;
    let form: any = this.$refs[name];
    form.validate(async (valid: any) => {
      if (valid) {
        let data:any = {
          qualityTypeId: this.formValidate.qualityTypeId,
          partBrandId: this.formValidate.partBrandId,
          code: this.formValidate.code,
          unit: this.formValidate.unit,
          name: this.formValidate.name,
          oemCode: this.formValidate.oemCode,
          spec: this.formValidate.spec,
          model: this.formValidate.model,
          commonCode: this.formValidate.commonCode,
          explain: this.formValidate.explain,
          produceFactory: this.formValidate.produceFactory,
          origin: this.formValidate.origin,
          remarks: this.formValidate.remarks,
          applyCarbrandId: this.formValidate.applyCarbrandId,
          applyCarModel: this.formValidate.applyCarModel,
          attributeSpecVOS: this.formValidate.specVOList,
          fullName: this.fullName,
        };
        if(this.update) {
          data.id = this.formValidate.id;
          data.tenantId = this.formValidate.tenantId;
        } else {
          data.carTypeIdFir = this.formValidate.carTypeIdFir;
          data.carTypeIdSen = this.formValidate.carTypeIdSen;
          data.carTypeIdThr = this.formValidate.carTypeIdThr;

        }
        if(this.prohibit) {
          data.disabled = 1
        } else {
          data.disabled = 0
        }
        if(this.forbidsale) {
          data.isSell = 1
        } else {
          data.isSell = 0
        }
        if(this.yp) {
          data.attributeValueVOS = this.formValidate.valueVOS;
        }
        let res:any = await api.savePart(data);
        if(res.code == 0) {
          this.proModal = false;
          this.handleReset('proModalform');
          this.update = false;
          let parent:any = this.$parent;
          if(parent.isSys) {
            parent.initCloudPartInfo();
          } else {
            parent.initLocalPartInfo();
          }
          self.$Message.success('保存成功');
        }
      }
    });
  }
  // 重置
  private handleReset(name: string) {
    let form: any = this.$refs[name];
    form.resetFields();
  }

  /**========watch========== */
  @Watch('update')
  private changeShow(newval:boolean, oldval:boolean) {
    if(newval) {
      this.getpartinfo();
    }
  }

  @Watch('formValidate.unit')
  private changeUnit(newVal:any, old:any) {
    let objData:any = this._.cloneDeep(this.newSpecObj);
    objData.meterCompany = this.formValidate.unit;
    this.dictCodeAll.forEach((el:any) => {
      if(el.itemCode === objData.meterCompany) {
        el.disabled = true;
      }
    })
    if(this.formValidate.specVOList.length <= 0) {
      this.formValidate.specVOList.push(objData);
    } else {
      this.formValidate.specVOList[0] = objData;
    }

  }
}
</script>

<style lang="less" scoped>
.part-main {
  margin-top: 10px;
  display: flex;
  .part-left {
    width: 220px;
  }
  .part-right {
    width: 780px;
  }
}
.partCheck-hd{
  //border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}
.custom-main{
  border-top: 1px solid #ddd;
  .custom-type-hd{
    padding: 10px 0 6px;
  }
  .tag-span{
    cursor: pointer;
    background: #f8f8f8;
    border: 1px solid #e8e8e8;
    padding: 4px 10px;
    border-radius: 2px;
    &.active{
      background: #fd5c5c;
      border-color: #fd5c5c;
      color: #fff;
    }
  }
}
</style>