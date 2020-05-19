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
                      >{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="供应商简称:" prop="shortName" class="h50">
                    <Input v-model="data.shortName" style="width: 180px" />
                  </FormItem>
                </Col>
              </Row>
            </div>
          </div>
          <FormItem class="h50" label="供应商全称:" prop="fullName">
            <Input v-model="data.fullName" style="width: 480px" />
          </FormItem>
          <div style="display: flex">
            <div style="flex-flow: row nowrap;width: 100%">
              <FormItem label="票据类型:" prop="billTypeId" class="h50">
                <Select v-model="data.billTypeId" style="width:180px" class="mr10">
                  <Option
                    v-for="item in dataList.CS00107"
                    :value="item.itemCode"
                    :key="item.id"
                  >{{ item.itemName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="联系人:" prop="contactor" class="h50">
                <Input v-model="data.contactor" style="width: 180px" />
              </FormItem>
              <FormItem label="省份:" prop="provinceId" class="h50">
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
              <FormItem label="结算方式:" prop="settTypeId" class="h50">
                <Select v-model="data.settTypeId" style="width:180px" class="mr10">
                  <Option
                    v-for="item in dataList.CS00106"
                    :value="item.itemCode"
                    :key="item.id"
                  >{{ item.itemName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="联系方式:" prop="contactorTel" class="h50">
                <Input v-model="data.contactorTel" style="width: 180px" />
              </FormItem>
              <FormItem label="城市:" prop="cityId" class="h50">
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
          <FormItem label="地址:" class="h50">
            <Input v-model="data.streetAddress" style="width: 380px" />
          </FormItem>
          <div style="display: flex">
            <div style="flex-flow: row nowrap;width: 100%">
              <FormItem label="业务员:" class="h50">
                <Input v-model="data.salesman" style="width: 180px" />
              </FormItem>
              <FormItem label="职务:" class="h50">
                <Select v-model="data.salesmanDuty" style="width:180px" class="mr10">
                  <Option
                    v-for="item in dataList.CS00110"
                    :value="item.itemCode"
                    :key="item.id"
                  >{{ item.itemName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="供应类型:" class="h50">
                <Select v-model="data.supplierType" style="width:180px" class="mr10">
                  <Option
                    v-for="item in dataList.CS00111"
                    :value="item.itemCode"
                    :key="item.id"
                  >{{ item.itemName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="邮箱:" class="h50">
                <Input v-model="data.email" style="width: 180px" />
              </FormItem>
              <FormItem label="QQ/微信:" class="h50">
                <Input v-model="data.instantMsg" style="width: 180px" />
              </FormItem>
            </div>
            <div style="flex-flow: row nowrap;width: 100%">
              <FormItem label="业务员手机:" class="h50">
                <Input v-model="data.salesmanTel" style="width: 180px" />
              </FormItem>
              <!--             <FormItem label='信誉额度:' >-->
              <!--                 <Input v-model='data.contactor' style="width: 180px" />-->
              <!--             </FormItem>-->
              <FormItem label="邮政编码:" class="h50">
                <Input v-model="data.postalCode" style="width: 180px" />
              </FormItem>
              <FormItem label="优势品牌/产品:" class="h50">
                <Input v-model="data.advantageCarbrandId" style="width: 180px" />
              </FormItem>
              <FormItem label="电话:" class="h50">
                <Input v-model="data.tel" style="width: 180px" />
              </FormItem>
            </div>
          </div>
          <FormItem label="备注:" class="h50">
            <Input v-model="data.remark" style="width: 480px" />
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
                  >{{ item.title }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="二级分类:" prop="supplierTypeSecond">
                <Select v-model="data.supplierTypeSecond" style="width:180px" placement="top">
                  <Option
                    v-for="item in treelist "
                    v-if="data.supplierTypeFirst == item.parentId"
                    :value="item.id"
                    :key="item.id"
                  >{{ item.title }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="其他信息" tab="clientBox">
          <div>
            <p style="margin-bottom: 10px">财务信息</p>
            <div>
              <FormItem label="收款户名:" prop="receiveName" class="h50">
                <Input v-model="data.receiveName" style="width: 450px" />
              </FormItem>
              <FormItem label="银行账号:" prop="accountBankNo" class="h50">
                <Input v-model="data.accountBankNo" style="width: 450px" />
              </FormItem>
              <FormItem label="开户银行:" prop="accountBank" class="h50">
                <Input v-model="data.accountBank" style="width: 450px" />
              </FormItem>
              <div style="display: flex">
                <div style="flex-flow: row nowrap;width: 100%">
                  <FormItem label="纳税人编码:" prop="phone" class="h50">
                    <Input v-model="data.taxpayerCode" style="width: 150px" />
                  </FormItem>
                </div>
                <div style="flex-flow: row nowrap;width: 100%">
                  <FormItem label="纳税人电话:" prop="phone" class="h50">
                    <Input v-model="data.taxpayerTel" style="width: 150px" />
                  </FormItem>
                </div>
              </div>
              <FormItem label="纳税人名称:" class="h50">
                <Input v-model="data.taxpayerName" style="width: 450px" />
              </FormItem>
            </div>
            <p style="margin-bottom: 10px">其他信息</p>
            <FormItem label="网址:" class="h50">
              <Input v-model="data.website" style="width: 450px" />
            </FormItem>
            <FormItem label="传真:" class="h50">
              <Input v-model="data.fax" style="width: 450px" />
            </FormItem>
            <FormItem label="经营地址:" class="h50">
              <Input v-model="data.addr" style="width: 450px" />
            </FormItem>
            <FormItem label="会员卡号:" class="h50">
              <Input v-model="data.memCarNo" style="width: 450px" />
            </FormItem>
            <div style="display: flex">
              <div style="flex-flow: row nowrap;width: 100%">
                <FormItem label="会员等级:" prop="phone" class="h50">
                  <Input v-model="data.memLevelId" style="width: 150px" />
                </FormItem>
              </div>
              <div style="flex-flow: row nowrap;width: 100%">
                <FormItem label="邮政编码:" prop="phone" class="h50">
                  <Input v-model="data.postalCode" style="width: 150px" />
                </FormItem>
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </Form>
</template>

<script>
import { getDigitalDictionary,getCustomer } from "@/api/system/essentialData/clientManagement";

export default {
  name: "Data",
  components: {},
  props: {
    data: "",
    provincearr: "",
    treelist: ""
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
    return {
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
        receiveName: [
          { required: true, message: " 不能为空", trigger: "change" }
        ],
        accountBankNo: [
          {
            required: true,
            message: "不能为空",
            // validator: creditLimit,
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
          { required: true, validator: validateTel, trigger: "blur" }
        ],
        tel: [{ required: true, validator: validatePhone, trigger: "blur" }],
        salesmanTel: [
          { required: true, validator: validatePhone, trigger: "blur" }
        ],
        cityId: [{ required: true, message: " ", trigger: "change" }],
        guestType: [{ required: true, message: " ", trigger: "change" }],
        guestTypeFloor: [{ required: true, message: " ", trigger: "change" }],
        supplierTypeFirst: [{required: true, message: " ", trigger: "change"}],
        supplierTypeSecond: [{required: true, message: " ", trigger: "change"}]
      },
      dataList: ""
    };
  },
  created() {
    this.getList();
  },
  methods: {
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
    selection() {},
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
