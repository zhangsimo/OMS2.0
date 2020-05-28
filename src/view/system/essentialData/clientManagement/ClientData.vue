<template>
  <Form :label-width="100" :model="data" :rules="rules" ref="form">
    <div class="header-box clearfix">
      <span class="isDisabeld">
        是否禁用
        <Checkbox v-model="data.isDisabled" :false-value="0" :true-value="1" />
      </span>
      <span class="isDisabeld">
        供应商
        <Checkbox v-model="data.isSupplier" :false-value="0" :true-value="1" />
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
                <Input v-model="data.shortName" style="width: 180px" maxlength="10" />
              </FormItem>
              <FormItem label="客户全称:" prop="fullName">
                <Input v-model="data.fullName" style="width: 180px" />
              </FormItem>
              <FormItem label="联系人:" prop="contactor">
                <Input v-model="data.contactor" style="width: 180px" maxlength="8" />
              </FormItem>
              <FormItem label="省份:" prop="provinceId">
                <Select filterable v-model="data.provinceId" style="width:180px" class="mr10">
                  <Option
                    v-for="item in provincearr"
                    v-if="item.parentId==0"
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
              <FormItem label="电话:" >
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
              <FormItem label="业务员手机:" >
                <Input v-model="data.salesmanTel" style="width: 180px" />
              </FormItem>

              <FormItem label="QQ/微信:">
                <Input v-model="data.instantMsg" style="width: 180px" />
              </FormItem>
              <FormItem label="默认物流:">
                <Input v-model="data.defaultLogistics" style="width: 180px" />
              </FormItem>
              <FormItem label="二级分类:" prop="guestTypeFloor">
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
        </TabPane>
        <TabPane label="其他信息" tab="clientBox">
          <div>
            <p style="margin-bottom: 10px">财务信息</p>
            <div>
              <FormItem label="收款户名:" prop="accountName">
                <Input v-model="data.accountName" style="width: 450px" />
              </FormItem>
              <FormItem label="银行账号:" prop="accountBankNo">
                <Input v-model="data.accountBankNo" style="width: 450px" />
              </FormItem>
              <FormItem label="开户银行:" prop="accountBank">
                <Input v-model="data.accountBank" style="width: 450px" />
              </FormItem>
              <div style="display: flex">
                <div style="flex-flow: row nowrap;width: 100%">
                  <FormItem label="纳税人编码:" prop="phone">
                    <Input v-model="data.taxpayerCode" style="width: 150px" />
                  </FormItem>
                </div>
                <div style="flex-flow: row nowrap;width: 100%">
                  <FormItem label="纳税人电话:" prop="phone">
                    <Input v-model="data.taxpayerTel" style="width: 150px" />
                  </FormItem>
                </div>
              </div>
              <FormItem label="纳税人名称:">
                <Input v-model="data.taxpayerName" style="width: 450px" />
              </FormItem>
            </div>
            <p style="margin-bottom: 10px">其他信息</p>
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
              :columns="columns"
              :data="placeList"
              @on-current-change="selection"
            ></Table>
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
              <a class="mr10" @click="addInoice">
                <Icon custom="iconfont iconxinzengicon icons" />新增
              </a>
              <a class="mr10" @click="changeBank">
                <Icon custom="iconfont iconbianjixiugaiicon icons" />修改
              </a>
              <a class="mr10" @click="deletBank">
                <Icon custom="iconfont iconlajitongicon icons" />删除
              </a>
            </div>
            <vxe-table
              highlight-current-row
              @current-change="pitchOnBank"
              border
              auto-resize
              show-overflow
              ref="validData"
              :mouse-config="{selected: true}"
              :data="invoice"
              height="300px"
              :edit-rules="validRules"
              :keyboard-config="{isArrow: true, isDel: true, isTab: true, isEdit: true}"
              :edit-config="{trigger: 'click', mode: 'cell'}"
            >
              <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
              <vxe-table-column field="taxpayerName" title="开票名称" :edit-render="{name: 'input'}"></vxe-table-column>
              <vxe-table-column field="taxpayerCode" title="税号" :edit-render="{name: 'input'}"></vxe-table-column>
              <vxe-table-column field="taxpayerTel" title="地址电话" :edit-render="{name: 'input'}"></vxe-table-column>
              <vxe-table-column field="accountBankNo" title="开户行及账号" :edit-render="{name: 'input'}"></vxe-table-column>
            </vxe-table>
          </div>
          <Modal v-model="newInoiceShow" :title="tit">
            <AddInoice :data="addInoiceOne" ref="AddInoice"></AddInoice>
            <div slot="footer">
              <Button type="primary" @click="addNewBank">确定</Button>
              <Button type="default" @click="newInoiceShow = false">取消</Button>
            </div>
          </Modal>
        </TabPane>
      </Tabs>
    </div>
  </Form>
</template>

<script>
  import Newplace from "./Newplace";
  import AddInoice from "./AddInoice";
  import {
    getDigitalDictionary,
    getCustomerInformation,
    getCustomer
  } from "@/api/system/essentialData/clientManagement";

  export default {
    name: "Data",
    components: {
      Newplace,
      AddInoice
    },
    props: {
      data: {
        type:Object,
        default:{}
      },
      provincearr: {
        type:Array,
        default:[]
      },
      treelist: {
        type:Array,
        default:[]
      }
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
      const creditLimit2 = ({cellValue}) => {
        return new Promise((resolve, reject) => {
          if (cellValue) {
            if (!/^\d{1,}$/.test(cellValue)) {
              reject(new Error('只能输入数字'))
            } else {
              resolve()
            }
          } else {
            reject(new Error('只能输入数字'))
          }
        })
      };
      const paragraph = ({cellValue }) => {
        return new Promise((resolve, reject) => {
          if (cellValue) {
            if (!/^[0-9a-zA-Z]+$/.test(cellValue)) {
              reject(new Error('只能输入数字和字母'))
            } else {
              resolve()
            }
          } else {
            reject(new Error('只能输入数字和字母'))
          }
        })

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
      return {
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
            key: "receiveManTel"
          },
          {
            title: "收货地址",
            align: "center",
            key: "address"
          },
          {
            title: "默认",
            key: "id",
            align: "isDefault",
            render: (h, params) => {
              let text = "";
              params.row.isDefault ? (text = "是") : (text = "否");
              return h("span", {}, text);
            }
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
        loading: true,
        loading1: true,
        title: "新增收货地址",
        oneNew: {},
        relevanceClient: [],
        addInoiceOne: {},
        rules: {
          belongSystem: [
            {
              required: true,
              message: "不能为空",
              trigger: "change",
              type: "number"
            }
          ],
          // creditLimit: [
          //   {
          //     validator: creditLimit,
          //     trigger: "change"
          //   }
          // ],
          accountName: [
            { required: true, message: " 不能为空", trigger: "change" }
          ],
          accountBankNo: [
            {
              required: true,
              // validator: creditLimit,
              message: "不能为空",
              trigger: "change"
            }
          ],
          accountBank: [
            { required: true, message: " 不能为空", trigger: "change" }
          ],
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
        tit: "" //开票弹窗
      };
    },
    // computed:{
    //   place(){
    //     return this.data
    //   }
    // },
    mounted() {
      this.placeList = this.data.guestLogisticsVOList || [];
      this.relevanceClientShow = this.data.guestVOList || [];
      this.invoice = this.data.guestTaxpayerVOList || [];
      this.getList();
      this.getClienlist();
      this.sessionKey = sessionStorage.getItem("key");
    },
    methods: {
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
      //校验表单
      handleSubmit(callback) {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$refs.validData.validate(valid => {
              console.log(valid)
              if (!valid) {
                callback && callback();
              } else {
                this.$Message.error("带*为必填");
              }
            });
          } else {
            this.$Message.error("带*为必填");
          }
        });
      },
      // 获取新增地址
      selection(item) {
        this.oneNew = item;
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
      //新增地址
      addPlace() {
        this.oneNew = {};
        this.newplace = true;
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
        //     for (var k = 0; k < this.relevanceClientShow.length; k++) {
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
          console.log("......" + this.data.guestVOList);
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
        this.$refs.AddInoice.resetFields();
      },
      // 确认新增银行
      addNewBank() {
        this.$refs.AddInoice.handleSubmit(() => {
          if (
            this.invoice.some(item => item.bankId == this.addInoiceOne.bankId)
          ) {
            let idx = this.invoice.findIndex(
              item => item.bankId == this.addInoiceOne.bankId
            );
            // console.log(idx);
            this.$set(this.invoice, idx, this.addInoiceOne);
            this.data.guestTaxpayerVOList = this.invoice;
            this.newInoiceShow = false;
            this.addInoiceOne = {};
          } else {
            let newarr = {};
            newarr = JSON.parse(JSON.stringify(this.addInoiceOne));
            newarr.bankId = this.bankId;
            this.bankId++;
            this.invoice.push(newarr);
            // console.log(newarr, 638);
            this.data.guestTaxpayerVOList = this.invoice;
            this.newInoiceShow = false;
          }
        });
      },
      //选中银行
      pitchOnBank(selection) {
        this.addInoiceOne = selection;
      },
      //修改银行
      changeBank() {
        if (Object.keys(this.addInoiceOne).length == 0) {
          this.$Message.error("请先选中需要修改的信息");
          return false;
        }
        this.tit = "修改开票信息";
        this.addInoiceOne = this.addInoiceOne.row;
        this.newInoiceShow = true;
      },
      //删除银行
      deletBank() {
        if (Object.keys(this.addInoiceOne).length == 0) {
          this.$Message.error("请先选中需要删除的信息");
          return false;
        }
        this.invoice = this.invoice.filter(
          item => item.bankId != this.addInoiceOne.row.bankId
        );
        console.log(this.invoice, this.addInoiceOne);
        this.data.guestTaxpayerVOList = this.invoice;
        this.addInoiceOne = {};
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
  .tabList >>> .ivu-form-item-content {
    margin-bottom: 10px;
  }
</style>
