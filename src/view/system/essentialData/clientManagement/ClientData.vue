<template>
  <Form :label-width="100" :model="data" :rules="rules" ref="form">
    <div class="header-box clearfix">
      <span class="isDisabeld">
        是否禁用
        <Checkbox v-model="data.isDisabled" />
      </span>
      <span class="isDisabeld">
        供应商
        <Checkbox v-model="data.isSupplier" />
      </span>
      <span class="isDisabeld">
        客户
        <Checkbox v-model="clinet" disabled />
      </span>
    </div>
    <!--   切换栏-->
    <div class="tabList">
      <Tabs type="card" name="clientBox">
        <TabPane label="基本信息" tab="clientBox">
          <div style="display: flex">
            <div style="flex-flow: row nowrap;width: 100%">
              <FormItem label="客户属性:" prop="guestProperty">
                <Select v-model="data.guestProperty" style="width:180px" class="mr10">
                  <Option
                    v-for="item in dataList.CS00105"
                    :value="item.itemCode"
                    :key="item.itemCode"
                  >{{ item.itemName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="客户简称:" prop="shortName">
                <Input v-model="data.shortName" style="width: 180px" maxlength="30"  :disabled="dis" />
              </FormItem>
              <FormItem label="客户全称:" prop="fullName">
                <Input v-model="data.fullName" style="width: 180px"  :disabled="dis" />
              </FormItem>
              <FormItem label="拼音码:">
                <Input v-model="spellCode" style="width: 180px" readonly/>
              </FormItem>
              <FormItem label="联系人:" prop="contactor">
                <Input v-model="data.contactor" style="width: 180px" maxlength="8" />
              </FormItem>
              <FormItem label="省份:" prop="provinceId">
                <Select filterable v-model="data.provinceId" style="width:180px" class="mr10">
                  <Option
                    v-for="item in provincearr"
                    v-show="item.parentId==0"
                    :key="item.id"
                    :value="item.id"
                  >{{ item.name}}</Option>
                </Select>
              </FormItem>
            </div>
            <div style="flex-flow: row nowrap;width: 100%">
              <FormItem label="所属体系:" prop="belongSystem" class="h40">
                <Select v-model="data.belongSystem" style="width:180px" class="mr10">
                  <Option
                    v-for="item in Subordinate"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
              <FormItem label="票据类型:" prop="billTypeId">
                <Select v-model="data.billTypeId" style="width:180px" class="mr10">
                  <Option
                    v-for="item in dataList.CS00107"
                    :value="item.itemCode"
                    :key="item.id"
                  >{{ item.itemName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="结算方式:" prop="settTypeId">
                <Select v-model="data.settTypeId" style="width:180px" class="mr10">
                  <Option
                    v-for="item in dataList.CS00106"
                    :value="item.itemCode"
                    :key="item.id"
                  >{{ item.itemName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="所属门店:">
                <Select v-model="data.compCode" style="width:180px" class="mr10">
                  <Option
                    v-for="item in tableComData"
                    :value="item.orgid"
                    :key="item.orgid"
                  >{{ item.shortName }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="联系人手机:" prop="contactorTel">
                <Input v-model="data.contactorTel" style="width: 180px" />
              </FormItem>
              <FormItem label="城市:" prop="cityId">
                <Select filterable v-model="data.cityId" style="width:180px" class="mr10">
                  <Option
                    v-for="item in provincearr"
                    v-if="data.provinceId==item.parentId"
                    :key="item.id"
                    :value="item.id"
                  >{{ item.name}}</Option>
                </Select>
              </FormItem>
            </div>
          </div>
          <FormItem label="地址:">
            <Input v-model="data.streetAddress" style="width: 380px" />
          </FormItem>
          <div style="display: flex">
            <div style="flex-flow: row nowrap;width: 100%">
              <FormItem label="业务员:">
                <Input v-model="data.salesman" style="width: 180px" />
              </FormItem>
              <FormItem v-if="sessionKey === 0" label="信用等级:">
                <Select v-model="data.tgrade" style="width:180px" class="mr10">
                  <Option
                    v-for="item in dataList.CS00112"
                    :value="item.itemCode"
                    :key="item.itemCode"
                  >{{ item.itemName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="电话:">
                <Input v-model="data.tel" style="width: 180px" />
              </FormItem>
              <FormItem label="备注:">
                <Input v-model="data.remark" style="width: 180px" />
              </FormItem>
              <FormItem label="一级分类:" prop="guestType">
                <Select v-model="data.guestType" style="width:180px" class="mr10" placement="top">
                  <Option
                    v-for="item in treelist"
                    v-if="item.lever == 1"
                    :value="item.code"
                    :key="item.id"
                  >{{ item.title }}</Option>
                </Select>
              </FormItem>
              <FormItem v-if="sessionKey == 0" label="信誉额度:" prop="creditLimit">
                <Input v-model="data.creditLimit" style="width: 180px" />
              </FormItem>
            </div>
            <div style="flex-flow: row nowrap;width: 100%">
              <FormItem label="业务员手机:">
                <Input v-model="data.salesmanTel" style="width: 180px" />
              </FormItem>

              <FormItem label="QQ/微信:">
                <Input v-model="data.instantMsg" style="width: 180px" />
              </FormItem>
              <FormItem label="默认物流:">
                <Input v-model="data.defaultLogistics" style="width: 180px" />
              </FormItem>
              <FormItem label="二级分类:">
                <Select
                  v-model="data.guestTypeFloor"
                  style="width:180px"
                  class="mr10"
                  placement="top"
                >
                  <Option
                    v-for="item in treelist "
                    v-if="data.guestType == item.parentId"
                    :value="item.id"
                    :key="item.id"
                  >{{ item.title }}</Option>
                </Select>
              </FormItem>
            </div>
          </div>
          <span style="margin-left: 100px">
            <Checkbox v-model="data.isNeedPack"></Checkbox>需求打包发货
          </span>
          <span style="margin-left: 100px">
            <Checkbox v-model="data.isFatCompany"></Checkbox>是否成品油企业
          </span>
        </TabPane>
        <TabPane label="其他信息" tab="clientBox">
          <div>
            <p style="margin-bottom: 10px">财务信息</p>
            <div class="finance">
              <div class="financePlace">
                <a class="mr10" @click="addPlaceFin" v-has="'finAddAccount'">
                  <Icon custom="iconfont iconxinzengicon icons" />新增
                </a>
                <a class="mr10" @click="changeplageFin" v-has="'finChangeAccount'">
                  <Icon custom="iconfont iconbianjixiugaiicon icons" />修改
                </a>
                <a class="mr10" @click="changePlaceFin" v-has="'finEnable'">{{enAble}}</a>
              </div>
              <div class="financeTab">
                <Table
                  @on-current-change="selectFin"
                  highlight-row
                  border
                  resizable
                  auto-resize
                  stripe
                  size="small"
                  height="200"
                  max-height="200"
                  ref="finance"
                  :columns="columnsFin"
                  :data="financeList"
                ></Table>
              </div>
            </div>
            <p style="margin-bottom: 10px;margin-top:10px;">其他信息</p>
            <FormItem label="网址:">
              <Input v-model="data.website" style="width: 450px" />
            </FormItem>
            <FormItem label="传真:">
              <Input v-model="data.fax" style="width: 450px" />
            </FormItem>
            <FormItem label="经营地址:">
              <Input v-model="data.addr" style="width: 450px" />
            </FormItem>
            <FormItem label="会员卡号:">
              <Input v-model="data.memCarNo" style="width: 450px" />
            </FormItem>
            <div style="display: flex">
              <div style="flex-flow: row nowrap;width: 100%">
                <FormItem label="会员等级:" prop="phone">
                  <Input v-model="data.memLevelId" style="width: 150px" />
                </FormItem>
              </div>
              <div style="flex-flow: row nowrap;width: 100%">
                <FormItem label="邮政编码:" prop="phone">
                  <Input v-model="data.postalCode" style="width: 150px" />
                </FormItem>
              </div>
            </div>
            <Modal v-model="bankAccount" :title="bankAccountTit" width="600">
              <bank-account ref="bankAccount"></bank-account>
              <div slot="footer">
                <Button type="primary" @click="addNewClientBank">保存</Button>
                <Button type="default" @click="bankAccount=false">取消</Button>
              </div>
            </Modal>
          </div>
        </TabPane>
        <TabPane label="收货地址" tab="clientBox">
          <div>
            <div class="place">
              <a class="mr10" @click="addPlace">
                <Icon custom="iconfont iconxinzengicon icons" />新增
              </a>
              <a class="mr10" @click="changeplage">
                <Icon custom="iconfont iconbianjixiugaiicon icons" />修改
              </a>
              <a class="mr10" @click="deletPlace">
                <Icon custom="iconfont iconlajitongicon icons" />删除
              </a>
            </div>
            <Table
              border
              height="400"
              size="small"
              highlight-row
              :stripe="true"
              ref="addressTable"
              :columns="columns"
              :edit-rules="validRulesAddress"
              :data="placeList"
              @on-current-change="selection"
            >
              <template slot-scope="{ row }" slot="isDefault">
                <span style="color:#2399ff;cursor:pointer" v-if="!row.isDefault" @click.stop="setDefault(row.id)">否</span>
                <span v-else>是</span>
              </template>
            </Table>
          </div>
          <Modal v-model="newplace" :title="title" width="700">
            <Newplace :data="oneNew" :place="provincearr" ref="child"></Newplace>
            <div slot="footer">
              <Button type="primary" @click="addplaceSure">确定</Button>
              <Button type="default" @click="newplace = false">取消</Button>
            </div>
          </Modal>
        </TabPane>
        <TabPane label="关联客户" tab="clientBox">
          <div>
            <div class="place">
              <span>客户名称:</span>
              <Input type="text" v-model="customerName" class="staff-name mr10" />
              <Button type="warning" class="w90 mr10" @click="queryClientList">
                <span class="center">
                  <Icon custom="iconfont iconchaxunicon icons" />查询
                </span>
              </Button>
              <Button type="warning" class="w90 mr10" @click="joinClientList">
                <span class="center">
                  <Icon custom="iconfont iconxuanzetichengchengyuanicon" />选入
                </span>
              </Button>
            </div>
            <div>
              <Table
                size="small"
                :loading="loading1"
                border
                :stripe="true"
                :columns="columns1"
                :data="relevanceClient"
                height="200"
                @on-selection-change="pitchOnClient"
              ></Table>
              <div class="clearfix" style="margin-bottom: 10px">
                <Page
                  class-name="page-con"
                  :current="page.num"
                  :total="page.total"
                  :page-size="page.size"
                  @on-change="changePage1"
                  @on-page-size-change="changeSize1"
                  show-sizer
                  show-total
                  show-elevator
                  style="float: right;margin-top: 10px"
                  class="mr10"
                ></Page>
              </div>
              <div>
                <div class="place">
                  <span>已选择的客户</span>
                  <Button class="mr10 w90" @click="deletAllClient">
                    <span class="center">
                      <Icon custom="iconfont iconlajitongicon icons" />删除
                    </span>
                  </Button>
                </div>
                <Table
                  size="small"
                  border
                  :stripe="true"
                  :columns="columns2"
                  :data="relevanceClientShow"
                  height="200"
                  @on-selection-change="deleteClient"
                ></Table>
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane label="开票信息" tab="clientBox">
          <div>
            <div class="place">
              <a class="mr10" @click="addInoice" v-has="'taxAdd'">
                <Icon custom="iconfont iconxinzengicon icons" />新增
              </a>
              <a class="mr10" @click="changeBank" v-has="'taxChange'">
                <Icon custom="iconfont iconbianjixiugaiicon icons" />修改
              </a>
              <a class="mr10" @click="deletBank" v-has="'taxEnable'">{{enAbleTax}}</a>
            </div>
            <div class="financeTab">
              <Table
                @on-current-change="pitchOnBank"
                @on-row-dblclick="pitchOnBank"
                @on-row-click="pitchOnBank"
                highlight-row
                border
                resizable
                auto-resize
                stripe
                size="small"
                height="200"
                max-height="200"
                ref="validData"
                :edit-rules="validRules"
                :columns="columnsTax"
                :data="invoice"
                props="row"
              ></Table>
            </div>
          </div>
          <Modal v-model="newInoiceShow" :title="tit">
            <AddInoice :data="addInoiceOne" ref="AddInoice" :me-tit="tit"></AddInoice>
            <div slot="footer">
              <Button type="primary" @click="addNewBank">确定</Button>
              <Button type="default" @click="cancelNewBank">取消</Button>
            </div>
          </Modal>
        </TabPane>
      </Tabs>
    </div>
  </Form>
</template>

<script>
//拼音码引入文件
import {pinyin} from "../../../../utils/py.js"
import Newplace from "./Newplace";
import AddInoice from "@/view/system/essentialData/clientManagement/AddInoice";
import {
  getDigitalDictionary,
  getCustomerInformation,
  getCustomer
} from "@/api/system/essentialData/clientManagement";
import bankAccount from "@/view/system/essentialData/clientManagement/components/bankAccount";
import {getUserAllCompany/**获取门店*/} from '@/api/base/user'
import { forOf } from "xe-utils/methods";
export default {
  name: "Data",
  components: {
    Newplace,
    AddInoice,
    bankAccount
  },
  props: {
    data: {
      type: Object,
      default: {}
    },
    provincearr: {
      type: Array,
      default:()=>[]
    },
    treelist: {
      type: Array,
      default: ()=>[]
    },
    dis:""
  },
  data() {
    const contactorTel = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else if (!/^1[345789]\d{9}$/.test(value)) {
        callback(new Error("手机号格式不正确"));
      } else {
        callback();
      }
    };
    const creditLimit = (rule, value, callback) => {
      if (value) {
        if (!/^\d{1,}$/.test(value)) {
          callback(new Error("只能输入数字"));
        } else {
          callback();
        }
      } else {
        callback(new Error("只能输入数字"));
      }
    };
    const creditLimit2 = ({ cellValue }) => {
      return new Promise((resolve, reject) => {
        if (cellValue) {
          if (!/^\d{1,}$/.test(cellValue)) {
            reject(new Error("只能输入数字"));
          } else {
            resolve();
          }
        } else {
          reject(new Error("只能输入数字"));
        }
      });
    };
    const paragraph = ({ cellValue }) => {
      return new Promise((resolve, reject) => {
        if (cellValue) {
          if (!/^[0-9a-zA-Z]+$/.test(cellValue)) {
            reject(new Error("只能输入数字和字母"));
          } else {
            resolve();
          }
        } else {
          reject(new Error("只能输入数字和字母"));
        }
      });
    };
    const fullName = (rule, value, callback) => {
      if (value) {
        let obj = {};
        if (this.data.id) {
          obj.id = this.data.id;
          obj.name = this.data.fullName;
        } else {
          obj.name = this.data.fullName;
        }
        // callback()
        getCustomer(obj).then(res => {
          if (res.data) {
            callback(new Error("客户名称不可重复"));
          } else {
            callback();
          }
        });
      } else {
        callback(new Error("客户全称不可为空"));
      }
    };
    const paragraphPhone = ({cellValue})=>{
      return new Promise((resolve, reject) => {
        if (cellValue) {
          if (!/^\d{3}-\d{8}|\d{4}-\{7,8}$/.test(cellValue)) {
            reject(new Error("手机号格式不正确"));
          } else {
            resolve();
          }
        } else {
          reject(new Error("手机号格式不正确"));
        }
      });
    }
    return {
      enAble: "启用", //启用 禁用 字段
      enAbleTax: "启用", //启用 禁用 字段
      selectFinTab: {}, // 财务信息 表格选中行的内容暂时性存储
      selectTaxTab: {},
      selectFinId: 0,
      finAddArr:[],//新增财务信息数组
      accountAddId:0,
      sessionKey: "0",
      Subordinate: [
        {
          label: "华胜连锁",
          value: 0
        },
        {
          label: "体系外",
          value: 1
        },
        {
          label: "体系内",
          value: 2
        }
      ],
      tree: this.treelist,
      clinet: true, //是否客户 //是
      list: [
        {
          label: 123,
          value: 1
        },
        {
          label: 456,
          value: 2
        }
      ],
      validRules: {
        taxpayerName: [{ required: true, message: "", trigger: "change" }],
        taxpayerCode: [
          { required: true, validator: paragraph, trigger: "change" }
        ],
        taxpayerTel: [
          {
            required: true,
            validator: creditLimit2,
            type: "Number",
            trigger: "change"
          }
        ],
        accountBankNo: [{ required: true, message: "", trigger: "change" }]
      },
      validRulesFin: {},
      validRulesAddress:{
        receiveManTel:[{require:true,validator:paragraphPhone,trigger:"change"}]
      },
      columnsFin: [
        {
          title: "序号",
          align: "center",
          type: "index"
        },
        {
          title: "账户类型",
          align: "center",
          render: (h, params) => {
            let text = "";
            if(params.row.accountType=="ZHLX001"){
              text="个人账户"
            } else if(params.row.accountType=="ZHLX002"){
              text="公户"
            }
            return h("span", {}, text);
          }
        },
        {
          title: "收款户名",
          align: "center",
          key: "accountName"
        },
        {
          title: "银行卡号",
          align: "center",
          key: "accountBankNo"
        },
        {
          title: "开户银行",
          align: "center",
          key: "accountBank"
        },
        {
          title: "默认",
          align: "center",
          render: (h, params) => {
            let text = "";
            params.row.acquiesce == true
              ? (text = "已默认")
              : (text = "设为默认");
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.financeList.map(item => {
                      if (item.id == params.row.id) {
                        item.acquiesce = !item.acquiesce;
                      } else {
                        if (item.acquiesce) {
                          item.acquiesce = false;
                        }
                      }
                    });
                    this.disposeFinData();
                  }
                }
              },
              text
            );
          }
        },
        {
          title: "状态",
          align: "center",
          render: (h, params) => {
            let text = "";
            params.row.accountSign == true ? (text = "启用") : (text = "禁用");
            return h("span", {}, text);
          }
        }
      ],
      columnsTax: [
        {
          title: "序号",
          align: "center",
          type: "index"
        },
        {
          title: "开票名称",
          align: "center",
          key: "taxpayerName"
        },
        {
          title: "税号",
          align: "center",
          key: "taxpayerCode"
        },
        {
          title: "开户行及账号",
          align: "center",
          key: "accountBankNo"
        },
        {
          title: "地址电话",
          align: "center",
          key: "taxpayerTel"
        },
        {
          title: "是否一般纳税人",
          align: "center",
          render: (h, params) => {
            let text = "";
            params.row.taxpayerSign == true ? (text = "是") : (text = "否");
            return h(
              "a",
              {
                on: {
                  click: () => {
                    params.row.taxpayerSign = !params.row.taxpayerSign;
                    this.invoice[params.index].taxpayerSign=params.row.taxpayerSign;
                    this.inoiceIndex=params.index;
                    this.disposeTax();
                  }
                }
              },
              text
            );
          }
        },
        {
          title: "状态",
          align: "center",
          render: (h, params) => {
            let text = "";
            params.row.taxpayerType == true ? (text = "启用") : (text = "禁用");
            return h("span", {}, text);
          }
        }
      ],
      columns: [
        {
          title: "收货单位",
          align: "center",
          key: "receiveCompName"
        },
        {
          title: "收货人",
          align: "center",
          key: "receiveMan",
          minWidth: 80
        },
        {
          title: "联系方式",
          align: "center",
          key: "receiveManTel"// ^[\+\-]?\d+(\.\d+)?$
        },
        {
          title: "收货地址",
          align: "center",
          key: "address"
        },
        {
          title: "默认",
          key: "isDefault",
          slot: 'isDefault',
          align: "center",
          // render: (h, params) => {
          //   let text = "";
          //   params.row.isDefault ? (text = "是") : (text = "否");
          //   let style=!params.row.isDefault?{
          //     color:'#2399ff',
          //     cursor:'pointer'
          //   }:"";
          //   return h("span", {
          //     style,
          //     on:{
          //       'click.stop':()=>{
          //         if(!params.row.isDefault){
          //           this.setDefault(params.row.id)
          //         }
          //       }
          //     }
          //   }, text);
          // }
        }
      ],
      columns1: [
        {
          title: "序号",
          align: "center",
          type: "index"
        },
        {
          key: "id",
          align: "center",
          type: "selection",
          width: 40
        },
        {
          title: "客户简称",
          align: "center",
          key: "shortName",
          minWidth: 80
        },
        {
          title: "客户全称",
          align: "center",
          key: "fullName"
        },
        {
          title: "创建日期",
          align: "center",
          key: "createTime"
        }
      ],
      columns2: [
        {
          title: "序号",
          align: "center",
          type: "index"
        },
        {
          key: "id",
          align: "center",
          type: "selection",
          width: 40
        },
        {
          title: "客户简称",
          align: "center",
          key: "shortName",
          minWidth: 80
        },
        {
          title: "客户全称",
          align: "center",
          key: "fullName"
        },
        {
          title: "创建日期",
          align: "center",
          key: "createTime"
        }
      ],
      columns3: [
        {
          title: "序号",
          align: "center",
          type: "index"
        },
        {
          title: "开票名称",
          align: "center",
          key: "taxpayerName"
        },
        {
          title: "税号",
          align: "center",
          key: "taxpayerCode"
        },
        {
          title: "地址电话",
          align: "center",
          key: "taxpayerTel"
        },
        {
          title: "开户行及账号",
          align: "center",
          key: "accountBankNo"
        }
      ],
      relevanceClientShow: [],
      invoice: [],
      page: {
        num: 1,
        size: 10,
        total: 0
      },
      placeList: [],
      newplace: false, //收货地址
      newInoiceShow: false, //开票
      bankAccount: false, //财务信息
      loading: true,
      loading1: true,
      title: "新增收货地址",
      bankAccountTit: "新增银行账户",
      oneNew: {},
      relevanceClient: [],
      addInoiceOne: {},// 开票信息 表格选中行的内容暂时性存储
      inoiceIndex:0,//开票选中暂存
      rules: {
        belongSystem: [
          {
            required: true,
            message: "不能为空",
            trigger: "change",
            type: "number"
          }
        ],
        // accountName: [
        //   { required: true, message: " 不能为空", trigger: "change" }
        // ],
        // accountBankNo: [
        //   { required: true, message: "不能为空", trigger: "change" }
        // ],
        // accountBank: [
        //   { required: true, message: " 不能为空", trigger: "change" }
        // ],
        guestProperty: [{ required: true, message: " ", trigger: "change" }],
        shortName: [{ required: true, message: " ", trigger: "blur" }],
        settTypeId: [{ required: true, message: " ", trigger: "change" }],
        billTypeId: [{ required: true, message: " ", trigger: "change" }],
        fullName: [{ required: true, validator: fullName, trigger: "blur" }],
        contactor: [{ required: true, message: " ", trigger: "blur" }],
        provinceId: [{ required: true, message: " ", trigger: "change" }],
        contactorTel: [
          { required: true, validator: contactorTel, trigger: "blur" }
        ],
        tel: [{ required: true, validator: contactorTel, trigger: "blur" }],
        salesmanTel: [
          { required: true, validator: contactorTel, trigger: "blur" }
        ],
        cityId: [{ required: true, message: " ", trigger: "change" }],
        guestType: [{ required: true, message: " ", trigger: "change" }],
        guestTypeFloor: [{ required: true, message: " ", trigger: "change" }]
      },
      dataList: "",
      id: 0,
      bankId: 0,
      customerName: "", //客户名称
      pitchOnClientList: [], //选中关联客户
      deleteOneClient: [], //获取删除项
      pitchOneBank: [],
      tit: "新增开票", //开票弹窗
      financeList:[],
      tableComData:[]//门店数组
    };
  },
  computed:{
    // place(){
    //   return this.data
    // }
    spellCode(){
      let spell=this.data?(this.data.fullName?(this.data.fullName==""?"":pinyin.getCamelChars(this.data.fullName)):""):""
      return (this.data.pyName=spell)
    }
  },
  mounted() {
    this.placeList = this.data.guestLogisticsVOList || [];
    this.relevanceClientShow = this.data.guestVOList || [];
    this.invoice = this.data.guestTaxpayerVOList || [];
    this.getList();
    this.getComList();
    this.getClienlist();
    this.disposeFinData();
    this.sessionKey = sessionStorage.getItem("key");
  },
  methods: {
    //获取所有公司信息
    async getComList() {
      let data = {}
      data.size = 10000
      data.page = 0
      data.id = this.$store.state.user.userData.id
      data.tenantCompanyName = "";
      let res = await getUserAllCompany(data)
      if (res.code === 0) {
        this.tableComData = res.data.content
      }
    },
    //设置为默认收货地址
    setDefault(id){
      this.placeList.map(item => {
        if(item.id==id){
          item.isDefault = 1;
        }else{
          item.isDefault = 0;
        }
      });
      this.oneNew = {};
    },
    //获取关联客户
    async getClienlist() {
      this.loading1 = true;
      let data = {};
      data.page = this.page.num - 1;
      data.size = this.page.size;
      data.fullName = this.customerName;
      let res = await getCustomerInformation(data);
      if (res.code == 0) {
        this.loading1 = false;
        this.relevanceClient = res.data.content;
        this.page.total = res.data.totalElements;
      }
    },
    //获取客户属性
    async getList() {
      let data = {};
      data = ["CS00105", "CS00106", "CS00107", "CS00112"];
      let res = await getDigitalDictionary(data);
      if (res.code == 0) {
        this.dataList = res.data;
      }
    },
    // 处理财务信息数据
    disposeFinData() {
      let defauDat = [];
      this.financeList.map(item => {
        if (item.acquiesce == true) {
          defauDat.push(item);
        }
      });
      if (defauDat.length != 1) {
        this.financeList.map(item => {
          if (item != defauDat[0]) {
            item.acquiesce = false;
          }
        });
      }
    },
    // 财务信息表格中选中某一行
    selectFin(row) {
      this.selectFinTab = row || {};
      if (row.accountSign == true) {
        this.enAble = "禁用";
      } else {
        this.enAble = "启用";
      }
      this.disposeFinData();
    },
    // 财务信息银行卡弹框确定
    addNewClientBank() {
      this.$refs.bankAccount.handleSubmit(() => {
        if (this.bankAccountTit == "修改银行账户信息") {
          let bool = true;
          this.selectFinTab = this.$refs.bankAccount.data;
          this.financeList.map(item => {
            if(item.accountAddId!=undefined){
              if (item.accountAddId == this.selectFinTab.accountAddId) {
                let newarr = {};
                newarr = JSON.parse(JSON.stringify(this.selectFinTab));
                item.id = newarr.id;
                item.tenantId = newarr.tenantId;
                item.guestId = newarr.guestId;
                item.accountBank = newarr.accountBank;
                item.accountBankNo = newarr.accountBankNo;
                item.accountName = newarr.accountName;
                item.accountType = newarr.accountType;
                item.acquiesce = true;
                this.disposeFinData();
              }
            }else{
              if (item.id == this.selectFinTab.id) {
                let newarr = {};
                newarr = JSON.parse(JSON.stringify(this.selectFinTab));
                item.id = newarr.id;
                item.tenantId = newarr.tenantId;
                item.guestId = newarr.guestId;
                item.accountBank = newarr.accountBank;
                item.accountBankNo = newarr.accountBankNo;
                item.accountName = newarr.accountName;
                item.accountType = newarr.accountType;
                item.acquiesce = true;
                this.disposeFinData();
              }
            }
          });
          this.$Message.success("修改银行卡信息成功");
          this.bankAccount = false;
          this.data.guestAccountVoList = this.financeList;
        } else {
          let newarr = {};
          let bool = true;
          this.selectFinTab = this.$refs.bankAccount.data;
          newarr = JSON.parse(JSON.stringify(this.selectFinTab));
          this.financeList.map(item => {
            if (item.accountBankNo == this.selectFinTab.accountBankNo) {
              bool = false;
            }
          });
          if (bool == true) {
            newarr.acquiesce = true;
            newarr.accountSign = true;
            newarr.accountType = newarr.accountType || "ZHLX001";
            newarr.accountAddId=this.accountAddId
            this.accountAddId++;
            this.financeList=[newarr,...this.financeList]
            this.data.guestAccountVoList = this.financeList;
            this.bankAccount = false;
            this.disposeFinData();
            this.$Message.success("添加银行卡成功");
          } else {
            return this.$Message.error("该银行卡已添加过");
          }
        }
      });
    },
    // 其他信息 财务信息
    addPlaceFin() {
      this.bankAccount = true;
      this.bankAccountTit = "新增银行账户";
      this.$refs.bankAccount.data = {accountType:"ZHLX002"};
      this.$refs.bankAccount.resetFields();
    },
    changeplageFin() {
      if (Object.keys(this.selectFinTab).length == 0) {
        this.$Message.error("请先选中需要修改的信息");
        return false;
      }
      this.bankAccountTit = "修改银行账户信息";
      this.bankAccount = true;
      this.$refs.bankAccount.data = this.selectFinTab;
    },
    // 修改启用禁用
    changePlaceFin() {
      this.financeList.map(item => {
        if(this.selectFinTab.id==undefined){
          if (item.accountAddId == this.selectFinTab.accountAddId) {
            item.accountSign = !item.accountSign;
          } else {
            item.accountSign;
          }
        }else{
          if (item.id == this.selectFinTab.id) {
            item.accountSign = !item.accountSign;
          } else {
            item.accountSign;
          }
        }
      });
    },
    //校验表单
    handleSubmit(callback) {
      this.$refs.form.validate(valid => {
        if (valid) {
          callback && callback();
        } else {
          this.$Message.error("带*为必填");
        }
      });
    },
    // 获取新增地址
    selection(item) {
      this.oneNew = {...item};
      this.oneNew.isDefault == 1
        ? (this.oneNew.isDefault = true)
        : (this.oneNew.isDefault = false);
    },
    //新增地址表单校验
    addplaceSure() {
      // console.log(this.placeList)
      this.$refs.child.handleSubmit(() => {
        if (this.placeList.some(item => item.id == this.oneNew.id)) {
          this.oneNew.isDefault
            ? (this.oneNew.isDefault = 1)
            : (this.oneNew.isDefault = 0);
          let idx = this.placeList.findIndex(item => item.id == this.oneNew.id);
          if(this.placeList.length>1){
            this.placeList.map((item,index) => {
              if(this.oneNew.isDefault){
                if(index!=idx){
                  item.isDefault = 0
                }
              }
            })
          }
          this.$set(this.placeList, idx, this.oneNew);
          this.data.guestLogisticsVOList = this.placeList;
          this.newplace = false;
          this.oneNew = {};
        } else {
          this.oneNew.isDefault
            ? (this.oneNew.isDefault = 1)
            : (this.oneNew.isDefault = 0);
          let newarr = {};
          newarr = JSON.parse(JSON.stringify(this.oneNew));
          newarr.id = this.id;
          this.id++;
          if(this.placeList.length>1){
            this.placeList.map((item,index) => {
              if(this.oneNew.isDefault){
                item.isDefault = 0
              }
            })
          }
          this.placeList.push(newarr);
          this.data.guestLogisticsVOList = this.placeList;
          this.newplace = false;
        }
      });
    },
    //修改地址表单
    changeplage() {
      // console.log(this.oneNew);
      if (Object.keys(this.oneNew).length == 0) {
        this.$Message.error("至少选项一条地址");
        return false;
      }
      if (
        this.oneNew.cityId == undefined ||
        this.oneNew.provinceId == undefined
      ) {
        this.$Message.error("至少选项一条地址");
        return false;
      }
      this.newplace = true;
      this.title = "修改收货地址";
    },
    //表单清除
    handleReset() {
      this.data.isNeedPack = false;
      this.data.isFatCompany = false;
      this.data.isDisabled = false;
      this.data.isSupplier = false;
      this.$refs.form.resetFields();
    },
    //新增地址
    addPlace() {
      this.oneNew = {};
      this.newplace = true;
      this.$refs.addressTable.clearCurrentRow();
      this.$refs.child.resetFields();
    },
    //删除地址
    deletPlace() {
      if (Object.keys(this.oneNew).length == 0) {
        this.$Message.error("至少选项一条地址");
        return false;
      }
      this.placeList = this.placeList.filter(item => item.id != this.oneNew.id);
      this.data.guestLogisticsVOList = this.placeList;
      this.oneNew = {};
    },
    //查询关联客户
    queryClientList() {
      this.getClienlist();
    },
    //查询关联客户分页
    changePage1(data) {
      this.page.num = data;
      this.getClienlist();
    },
    //查询关联客户切换条数
    changeSize1() {
      this.page.num = 1;
      this.page.size = data;
      this.getClienlist();
    },
    //选中查询关联客户
    pitchOnClient(selection) {
      this.pitchOnClientList = selection;
    },
    //加入查询
    joinClientList() {
      let can = true;
      // console.log(this.pitchOnClientList, "this.pitchOnClientList");
      // console.log(this.relevanceClientShow, "this.relevanceClientShow");
      // if (this.pitchOnClientList.length != 0) {
      //   for (var i = 0; i < this.pitchOnClientList.length; i++) {
      //     console.log(1212);
      //     for (var k = 0; k <script this.relevanceClientShow.length; k++) {
      //       if (
      //         this.pitchOnClientList[i].id == this.relevanceClientShow[k].id
      //       ) {
      //         can = false;
      //       }
      //     }
      //   }
      this.relevanceClientShow = this.pitchOnClientList;
      // this.pitchOnClientList.forEach(item => {
      //   this.relevanceClientShow.forEach(val => {
      //     if (item.id == val.id) {
      //       can = false;
      //     }
      //   });
      // });
      // } else {
      //   this.$message.error("请勾选客户");
      //   return;
      // }
      if (can) {
        this.relevanceClientShow = [
          ...this.relevanceClientShow
          // ...this.pitchOnClientList
        ];
        this.data.guestVOList = this.relevanceClientShow;
      } else {
        this.$Message.error("选择重复");
      }
    },
    //获取删除关联客户
    deleteClient(selection) {
      this.deleteOneClient = selection;
    },
    //删除
    deletAllClient() {
      if (this.deleteOneClient.length !== 0) {
        this.deleteOneClient.forEach(item => {
          this.relevanceClientShow.forEach((val, index, arr) => {
            if (val.id === item.id) {
              arr.splice(index, 1);
            }
          });
        });
        this.data.guestVOList = this.relevanceClientShow;
      } else {
        this.$message.error("请勾选要删除的客户");
      }
    },
    //新增银行
    addInoice() {
      this.addInoiceOne = {};
      this.tit = "新增开票";
      this.newInoiceShow = true;
      this.$refs.AddInoice.data={taxpayerSign:false}
      this.$refs.AddInoice.resetFields();
    },
    // 确认新增
    addNewBank() {
      this.$refs.AddInoice.handleSubmit(() => {
        if (this.tit == "新增开票") {
          let newarr = {};
          newarr = JSON.parse(JSON.stringify(this.addInoiceOne));
          newarr.bankId = this.bankId;
          newarr.taxpayerType=true
          newarr.taxpayerSign = newarr.taxpayerSign || false;
          this.bankId++;
          this.invoice.push(newarr);
          this.data.guestTaxpayerVOList = this.invoice;
          this.newInoiceShow = false;
          this.addInoiceOne={}
        } else {
          this.invoice.map(item => {
            this.addInoiceOne = this.$refs.AddInoice.data;
            if(item.bankId!=undefined){
              if (item.bankId == this.addInoiceOne.bankId) {
                let newarr = {};
                newarr = JSON.parse(JSON.stringify(this.addInoiceOne));
                item.taxpayerName = newarr.taxpayerName;
                item.taxpayerCode = newarr.taxpayerCode;
                item.taxpayerTel = newarr.taxpayerTel;
                item.accountBankNo = newarr.accountBankNo;
                item.taxpayerSign = newarr.taxpayerSign;
                item.taxpayerType=true
              }
            }else{
              if (item.id == this.addInoiceOne.id) {
                let newarr = {};
                newarr = JSON.parse(JSON.stringify(this.addInoiceOne));
                item.taxpayerName = newarr.taxpayerName;
                item.taxpayerCode = newarr.taxpayerCode;
                item.taxpayerTel = newarr.taxpayerTel;
                item.accountBankNo = newarr.accountBankNo;
                item.taxpayerSign = newarr.taxpayerSign;
                item.taxpayerType=true
              }
            }
          });
          this.data.guestTaxpayerVOList = this.invoice;
          this.newInoiceShow = false;
        }
      });
    },
    cancelNewBank(){
      this.newInoiceShow = false
      //this.addInoiceOne={}
    },
    disposeTax() {
      let defauDat = [];
      this.invoice.map(item => {
        if (item.taxpayerSign == true) {
          defauDat.push(item);
        }
      });
      if (defauDat.length != 1) {
        this.invoice.map(item => {
          if (item != defauDat[0]) {
            item.taxpayerSign = false;
          }
        });
      }
    },
    //选中银行
    pitchOnBank(selection,index) {
      this.addInoiceOne = selection;
      this.inoiceIndex=index;
      if (selection.taxpayerType == true) {
        this.enAbleTax = "禁用";
      } else {
        this.enAbleTax = "启用";
      }
      this.disposeTax();
    },
    //修改银行
    changeBank() {
      if (Object.keys(this.addInoiceOne).length == 0) {
        this.$Message.error("请先选中需要修改的信息");
        return false;
      }
      this.tit = "修改开票信息";
      this.addInoiceOne=this.invoice[this.inoiceIndex];
      this.invoice.map((el,idx)=>{
        if(idx==this.inoiceIndex){
          el._highlight=true;
        }
      })
      this.newInoiceShow = true;
      this.disposeTax();
    },
    deletBank() {
      this.invoice.map(item => {
        if(this.addInoiceOne.id==undefined){
          // bankId
          if (item.bankId == this.addInoiceOne.bankId) {
            item.taxpayerType = !item.taxpayerType;
          } else {
            item.taxpayerType;
          }
        }else{
          if (item.id == this.addInoiceOne.id) {
            item.taxpayerType = !item.taxpayerType;
          } else {
            item.taxpayerType;
          }
        }
      });
      this.pitchOnBank()
    }
  }
};
</script>

<style scoped lang="less">
.isDisabeld {
  float: right;
}
.finance {
  border: 1px solid #ccc;
  .financePlace {
    line-height: 40px;
    padding-left: 10px;
    border-bottom: 1px solid #ccc;
    span {
      padding: 5px;
    }
  }
  .financeTab {
    padding: 5px 10px;
  }
}
.place {
  line-height: 40px;
  padding-left: 10px;
  border: 1px solid #eee;
}
.staff-name {
  width: 200px;
}
</style>
<style scoped>
.tabList >>> .ivu-form-item {
  margin-bottom: 10px;
}
.tabList >>> .ivu-form-item-content {
  margin-bottom: 10px;
}
</style>
