<template>
  <Form :label-width="100" :model="data" :rules="rules" ref="form">
    <div class="header-box clearfix">
      <span class="isDisabeld">
        是否禁用
        <Checkbox v-model="data.isDisabled"></Checkbox>
      </span>
      <span class="isDisabeld">
        供应商
        <Checkbox v-model="clientDisable" disabled></Checkbox>
      </span>
      <span class="isDisabeld">
        客户
        <Checkbox v-model="data.isClient"></Checkbox>
      </span>
    </div>
    <!--   切换栏-->
    <div class="tabList">
      <Tabs type="card">
        <TabPane label="基本信息">
          <div style="display: flex">
            <div style="flex-flow: row nowrap;width: 100%">
              <Row>
                <Col span="12">
                  <FormItem label="所属体系:" prop="belongSystem" class="h40">
                    <Select v-model="data.belongSystem" style="width:180px" class="mr10">
                      <Option
                        v-for="item in Subordinate"
                        :value="item.value"
                        :key="item.value"
                      >{{ item.label }}
                      </Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="供应商简称:" prop="shortName" class="h50">
                    <Input v-model="shortName" style="width: 180px" disabled/>
                  </FormItem>
                </Col>
              </Row>
            </div>
          </div>
          <FormItem class="h50" label="供应商全称:" prop="fullName">
            <Input v-model="data.fullName" style="width: 480px" :disabled="dis"/>
          </FormItem>
          <FormItem class="h50" label="拼音码:">
            <Input v-model="spellCode" style="width: 480px" readonly/>
          </FormItem>
          <div style="display: flex">
            <div style="flex-flow: row nowrap;width: 100%">
              <FormItem label="票据类型:" prop="billTypeId" class="h50">
                <Select v-model="data.billTypeId" style="width:180px" class="mr10">
                  <Option
                    v-for="item in dataList.CS00107"
                    :value="item.itemCode"
                    :key="item.id"
                  >{{ item.itemName }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="联系人:" prop="contactor" class="h50">
                <Input v-model="data.contactor" style="width: 180px"/>
              </FormItem>
              <FormItem label="省份:" prop="provinceId" class="h50">
                <Select filterable v-model="data.provinceId" style="width:180px" class="mr10">
                  <Option
                    v-for="item in provincearr"
                    v-if="item.parentId==0"
                    :key="item.id"
                    :value="item.id"
                  >{{ item.name}}
                  </Option>
                </Select>
              </FormItem>
            </div>
            <div style="flex-flow: row nowrap;width: 100%">
              <FormItem label="结算方式:" prop="settTypeId" class="h50">
                <Select v-model="data.settTypeId" style="width:180px" class="mr10">
                  <Option
                    v-for="item in dataList.CS00106"
                    :value="item.itemCode"
                    :key="item.id"
                  >{{ item.itemName }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="联系方式:" prop="contactorTel" class="h50">
                <Input v-model="data.contactorTel" style="width: 180px"/>
              </FormItem>
              <FormItem label="城市:" prop="cityId" class="h50">
                <Select filterable v-model="data.cityId" style="width:180px" class="mr10">
                  <Option
                    v-for="item in provincearr"
                    v-if="data.provinceId==item.parentId"
                    :key="item.id"
                    :value="item.id"
                  >{{ item.name}}
                  </Option>
                </Select>
              </FormItem>
            </div>
          </div>
          <FormItem label="地址:" class="h50">
            <Input v-model="data.streetAddress" style="width: 380px"/>
          </FormItem>
          <div style="display: flex">
            <div style="flex-flow: row nowrap;width: 100%">
              <FormItem label="业务员:" class="h50">
                <Input v-model="data.salesman" style="width: 180px"/>
              </FormItem>
              <FormItem label="职务:" class="h50">
                <Select v-model="data.salesmanDuty" style="width:180px" class="mr10">
                  <Option
                    v-for="item in dataList.CS00110"
                    :value="item.itemCode"
                    :key="item.id"
                  >{{ item.itemName }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="供应类型:" class="h50">
                <Select v-model="data.supplierType" style="width:180px" class="mr10">
                  <Option
                    v-for="item in dataList.CS00111"
                    :value="item.itemCode"
                    :key="item.id"
                  >{{ item.itemName }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="邮箱:" class="h50">
                <Input v-model="data.email" style="width: 180px"/>
              </FormItem>
              <FormItem label="QQ/微信:" class="h50">
                <Input v-model="data.instantMsg" style="width: 180px"/>
              </FormItem>
            </div>
            <div style="flex-flow: row nowrap;width: 100%">
              <FormItem label="业务员手机:" class="h50">
                <Input v-model="data.salesmanTel" style="width: 180px"/>
              </FormItem>
              <!--             <FormItem label='信誉额度:' >-->
              <!--                 <Input v-model='data.contactor' style="width: 180px" />-->
              <!--             </FormItem>-->
              <FormItem label="邮政编码:" class="h50">
                <Input v-model="data.postalCode" style="width: 180px"/>
              </FormItem>
              <FormItem label="优势品牌/产品:" class="h50">
                <Input v-model="data.advantageCarbrandId" style="width: 180px"/>
              </FormItem>
              <FormItem label="电话:" class="h50">
                <Input v-model="data.tel" style="width: 180px"/>
              </FormItem>
              <FormItem label="所属门店:" class="h50">
                <Select v-model="data.compCode" style="width:180px" class="mr10">
                  <Option
                    v-for="item in tableComData"
                    :value="item.orgid"
                    :key="item.orgid"
                  >{{ item.shortName }}
                  </Option>
                </Select>
              </FormItem>
            </div>
          </div>
          <FormItem label="备注:" class="h50">
            <Input v-model="data.remark" style="width: 480px"/>
          </FormItem>
          <Row id="rowMargin" style="marginBottom: 60px">
            <Col span="12">
              <FormItem label="一级分类:" prop="supplierTypeFirst">
                <Select v-model="data.supplierTypeFirst" style="width:180px" placement="top">
                  <Option
                    v-for="item in treelist"
                    v-if="item.lever == 1"
                    :value="item.id"
                    :key="item.code"
                  >{{ item.title }}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="二级分类:">
                <Select v-model="data.supplierTypeSecond" style="width:180px" placement="top">
                  <Option
                    v-for="item in treelist "
                    v-if="data.supplierTypeFirst == item.parentId"
                    :value="item.id"
                    :key="item.id"
                  >{{ item.title }}
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="其他信息" tab="clientBox">
          <div>
            <p style="margin-bottom: 10px">财务信息</p>
            <div class="finance">
              <div class="financePlace">
                <a class="mr10" @click="addPlaceFin" v-has="'finAdd'">
                  <Icon custom="iconfont iconxinzengicon icons"/>
                  新增
                </a>
                <a class="mr10" @click="changeplageFin" v-has="'finChange'">
                  <Icon custom="iconfont iconbianjixiugaiicon icons"/>
                  修改
                </a>
                <a class="mr10" @click="changePlaceFin" v-has="'finAble'">{{enAble}}</a>
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
            <p style="margin-bottom: 10px">其他信息</p>
            <FormItem label="网址:" class="h50">
              <Input v-model="data.website" style="width: 450px"/>
            </FormItem>
            <FormItem label="传真:" class="h50">
              <Input v-model="data.fax" style="width: 450px"/>
            </FormItem>
            <FormItem label="经营地址:" class="h50">
              <Input v-model="data.addr" style="width: 450px"/>
            </FormItem>
            <FormItem label="会员卡号:" class="h50">
              <Input v-model="data.memCarNo" style="width: 450px"/>
            </FormItem>
            <div style="display: flex">
              <div style="flex-flow: row nowrap;width: 100%">
                <FormItem label="会员等级:" prop="phone" class="h50">
                  <Input v-model="data.memLevelId" style="width: 150px"/>
                </FormItem>
              </div>
              <div style="flex-flow: row nowrap;width: 100%">
                <FormItem label="邮政编码:" prop="phone" class="h50">
                  <Input v-model="data.postalCode" style="width: 150px"/>
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
        <TabPane label="开票信息" tab="clientBox">
          <div>
            <div class="place">
              <a class="mr10" @click="addInoice" v-has="'taxSuAdd'">
                <Icon custom="iconfont iconxinzengicon icons"/>
                新增
              </a>
              <a class="mr10" @click="changeBank" v-has="'taxSuChange'">
                <Icon custom="iconfont iconbianjixiugaiicon icons"/>
                修改
              </a>
              <a class="mr10" @click="deletBank" v-has="'taxSuEnable'">{{enAbleTax}}</a>
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
  import {
    getDigitalDictionary,
    getCustomer
  } from "@/api/system/essentialData/clientManagement";
  import bankAccount from "@/view/system/essentialData/clientManagement/components/bankAccount";
  import AddInoice from "@/view/system/essentialData/clientManagement/AddInoice";
  import {pinyin} from "../../../../utils/py";
  import {getUserAllCompany/**获取门店*/} from '@/api/base/user'

  export default {
    name: "Data",
    components: {bankAccount, AddInoice},
    props: {
      data: "",
      provincearr: "",
      treelist: "",
      dis:""
    },
    data() {
      // v-if="data.supplierTypeFirst == item.parentId"
      const validateTel = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("手机号不能为空"));
        } else if (!/^\d{1,}$/.test(value)) {
          callback(new Error("手机号格式不正确"));
        } else {
          callback();
        }
      };
      const validatePhone = (rule, value, callback) => {
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
          callback();
        }
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
              callback(new Error("供应商全称不可重复"));
            } else {
              callback();
            }
          });
        } else {
          callback(new Error("供应商全称不可为空"));
        }
      };
      const paragraph = ({cellValue}) => {
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
      const creditLimit2 = ({cellValue}) => {
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
      return {
        enAble: "启用", //启用 禁用 字段
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
        clientDisable: true,
        rules: {
          belongSystem: [
            {
              required: true,
              message: "不能为空",
              trigger: "change",
              type: "number"
            }
          ],
          creditLimit: [
            {
              message: "只能填写整数或者两位小数",
              pattern: /^\d+(?:\.\d{2})?$/,
              trigger: "blur" ///^[0-9]{1}([0-9]|[.])*$/
            }
          ],
          // receiveName: [
          //   { required: true, message: " 不能为空", trigger: "change" }
          // ],
          // accountBankNo: [
          //   {
          //     required: true,
          //     message: "不能为空",
          //     // validator: creditLimit,
          //     trigger: "change"
          //   }
          // ],
          // accountBank: [
          //   { required: true, message: " 不能为空", trigger: "change" }
          // ],
          guestProperty: [{required: true, message: " ", trigger: "change"}],
          shortName: [{required: true, message: " ", trigger: "blur"}],
          settTypeId: [{required: true, message: " ", trigger: "change"}],
          billTypeId: [{required: true, message: " ", trigger: "change"}],
          fullName: [{required: true, validator: fullName, trigger: "blur"}],
          contactor: [{required: true, message: " ", trigger: "blur"}],
          provinceId: [{required: true, message: " ", trigger: "change"}],
          contactorTel: [
            {required: true, validator: validateTel, trigger: "blur"}
          ],
          tel: [{required: true, validator: validatePhone, trigger: "blur"}],
          salesmanTel: [
            {required: true, validator: validatePhone, trigger: "blur"}
          ],
          cityId: [{required: true, message: " ", trigger: "change"}],
          guestType: [{required: true, message: " ", trigger: "change"}],
          guestTypeFloor: [{required: true, message: " ", trigger: "change"}],
          supplierTypeFirst: [
            {required: true, message: " ", trigger: "change"}
          ],
          supplierTypeSecond: [
            {required: true, message: " ", trigger: "change"}
          ]
        },
        dataList: "",
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
              if (params.row.accountType == "ZHLX001") {
                text = "个人账户"
              } else if (params.row.accountType == "ZHLX002") {
                text = "公户"
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
        bankAccount: false,
        bankAccountTit: "新增银行账户",
        accountAddId: 0,
        financeList: [],
        addInoiceOne: {},// 开票信息 表格选中行的内容暂时性存储
        enAbleTax: "启用", //启用 禁用 字段
        validRules: {
          taxpayerName: [{required: true, message: "", trigger: "change"}],
          taxpayerCode: [
            {required: true, validator: paragraph, trigger: "change"}
          ],
          taxpayerTel: [
            {
              required: true,
              validator: creditLimit2,
              type: "Number",
              trigger: "change"
            }
          ],
          accountBankNo: [{required: true, message: "", trigger: "change"}]
        },
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
        invoice: [],
        newInoiceShow: false, //开票
        inoiceIndex:0,//开票选中暂存
        bankId:0,
        tit: "新增开票", //开票弹窗
        tableComData:[],//门店数组
      };
    },
    created() {
      this.invoice = this.data.guestTaxpayerVOList || [];
      this.getList();
      this.getComList();
    },
    computed:{
      spellCode(){
        let spell=this.data?(this.data.fullName?(this.data.fullName==""?"":pinyin.getCamelChars(this.data.fullName)):""):""
        return (this.data.pyName=spell)
      },
      shortName(){
        return this.data.fullName
      }
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
      //获取客户属性
      async getList() {
        let data = {};
        data = ["CS00107", "CS00106", "CS00111", "CS00110"];
        let res = await getDigitalDictionary(data);
        if (res.code == 0) {
          this.dataList = res.data;
        }
      },
      //清除内容
      resetFields() {
        this.$refs.form.resetFields();
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
      // 其他信息 财务信息
      addPlaceFin() {
        this.bankAccount = true;
        this.bankAccountTit = "新增银行账户";
        this.$refs.bankAccount.data = {accountType: "ZHLX002"};
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
        // //console.log(this.$refs.bankAccount.data, "????");
      },
      // 修改启用禁用
      changePlaceFin() {
        this.financeList.map(item => {
          if (this.selectFinTab.id == undefined) {
            if (item.accountAddId == this.selectFinTab.accountAddId) {
              item.accountSign = !item.accountSign;
            } else {
              item.accountSign;
            }
          } else {
            if (item.id == this.selectFinTab.id) {
              item.accountSign = !item.accountSign;
            } else {
              item.accountSign;
            }
          }
        });
      },
      // 财务信息银行卡弹框确定
      addNewClientBank() {
        this.$refs.bankAccount.handleSubmit(() => {
          if (this.bankAccountTit == "修改银行账户信息") {
            let bool = true;
            this.selectFinTab = this.$refs.bankAccount.data;
            this.financeList.map(item => {
              if (item.accountAddId != undefined) {
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
                  item.acquiesce = newarr.acquiesce;
                  item.accountSign = true
                  this.disposeFinData();
                }
              } else {
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
                  item.acquiesce = newarr.acquiesce;
                  item.accountSign = true
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
              newarr.accountType = newarr.accountType || "ZHLX002";
              newarr.accountAddId = this.accountAddId
              this.accountAddId++;
              this.financeList.push(newarr);
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
      //选中开票
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
      //新增开票
      addInoice() {
        this.addInoiceOne = {};
        this.tit = "新增开票";
        this.newInoiceShow = true;
        this.$refs.AddInoice.data = {taxpayerSign:false}
        this.$refs.AddInoice.resetFields();
      },
      //修改开票
      changeBank() {
        if (Object.keys(this.addInoiceOne).length == 0) {
          this.$Message.error("请先选中需要修改的信息");
          return false;
        }
        this.tit = "修改开票信息";
        this.addInoiceOne=this.invoice[this.inoiceIndex];
        this.disposeTax();
        this.newInoiceShow = true;
      },
      deletBank() {
        this.invoice.map(item => {
          if (this.addInoiceOne.id==undefined) {
            if (item.bankId == this.addInoiceOne.bankId) {
              item.taxpayerType = !item.taxpayerType;
            } else {
              item.taxpayerType;
            }
          } else {
            if (item.id == this.addInoiceOne.id) {
              item.taxpayerType = !item.taxpayerType;
            } else {
              item.taxpayerType;
            }
          }
        });
        this.pitchOnBank()
      },
      // 确认新增
      addNewBank() {
        this.$refs.AddInoice.handleSubmit(() => {
          if (this.tit == "新增开票") {
            let newarr = {};
            newarr = JSON.parse(JSON.stringify(this.addInoiceOne));
            newarr.bankId = this.bankId;
            newarr.taxpayerType = true
            newarr.taxpayerSign = newarr.taxpayerSign || false;
            this.bankId++;
            this.invoice.push(newarr);
            this.data.guestTaxpayerVOList = this.invoice;
            this.newInoiceShow = false;
            this.addInoiceOne = {}
          } else {
            this.invoice.map(item => {
              this.addInoiceOne = this.$refs.AddInoice.data;
              if (item.bankId != undefined) {
                if (item.bankId == this.addInoiceOne.bankId) {
                  let newarr = {};
                  newarr = JSON.parse(JSON.stringify(this.addInoiceOne));
                  item.taxpayerName = newarr.taxpayerName;
                  item.taxpayerCode = newarr.taxpayerCode;
                  item.taxpayerTel = newarr.taxpayerTel;
                  item.accountBankNo = newarr.accountBankNo;
                  item.taxpayerSign = newarr.taxpayerSign;
                  item.taxpayerType = true
                }
              } else {
                if (item.id == this.addInoiceOne.id) {
                  let newarr = {};
                  newarr = JSON.parse(JSON.stringify(this.addInoiceOne));
                  item.taxpayerName = newarr.taxpayerName;
                  item.taxpayerCode = newarr.taxpayerCode;
                  item.taxpayerTel = newarr.taxpayerTel;
                  item.accountBankNo = newarr.accountBankNo;
                  item.taxpayerSign = newarr.taxpayerSign;
                  item.taxpayerType = true
                }
              }
            });
            this.data.guestTaxpayerVOList = this.invoice;
            this.newInoiceShow = false;
          }
        })
      },
      cancelNewBank() {
        this.newInoiceShow = false
        //this.addInoiceOne = {}
      },
      disposeTax() {
        let defauDat = [];
        //console.log(this.invoice[2],111222)
        this.invoice.map(item => {
          if (item.taxpayerSign == true) {
            defauDat.push(item.taxpayerSign);
          }
        });
        this.invoice.map((el,idx)=>{
          if(idx==this.inoiceIndex){
            el._highlight=true;
          }else{
            el._highlight=false;
          }
        })
        if (defauDat.length != 1) {
          this.invoice=this.invoice.map(item => {
            if (item.taxpayerSign != defauDat[0]) {
              item.taxpayerSign = false;
            }
            return item;
          });
        }
      },
      selection() {
      },
      addPlace() {
        this.newplace = true;
      }
    }
  };
</script>

<style scoped lang="less">
  .isDisabeld {
    float: right;
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

  /* >>> .ivu-select-dropdown {
    height: 35px;
  } */
</style>
