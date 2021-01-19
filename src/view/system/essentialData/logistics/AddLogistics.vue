<template>
  <Form :label-width="110" label-position="right" ref="form" :rules="rules" :model="data">
    <div class="header-box clearfix">
      <span class="isDisabeld">
        是否禁用
        <Checkbox v-model="data.isDisabled" :true-value="1" :false-value="0"></Checkbox>
      </span>
    </div>
    <div style="display: flex">
      <div style="flex-flow: row nowrap;width: 100%">
        <FormItem label="物流快递名称:" prop="fullName">
          <Input placeholder="请输入姓名" v-model="data.fullName" style="width: 150px"></Input>
        </FormItem>
      </div>
      <div style="flex-flow: row nowrap;width: 100%">
        <FormItem label="物流快递编码：">
          <Input placeholder="系统生成" v-model="data.code" disabled style="width: 150px"></Input>
        </FormItem>
      </div>
    </div>
    <FormItem label="业务类型:" prop="logisticsType">
      <Select v-model="data.logisticsType" style="width:200px" class="mr10">
        <Option
          v-for="item in typelist"
          :value="item.itemCode"
          :key="item.itemCode"
        >{{ item.itemName }}</Option>
      </Select>
    </FormItem>

    <div style="display: flex">
      <div style="flex-flow: row nowrap;width: 100%">
        <FormItem label="联系人:" prop="contactor">
          <Input placeholder="请输入姓名" v-model="data.contactor" style="width: 150px"></Input>
        </FormItem>
        <FormItem label="省份:">
          <Select v-model="data.provinceId" filterable style="width:100px" class="mr10">
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
        <FormItem label="电话：" prop="contactorTel">
          <Input placeholder="请输入电话" v-model="data.contactorTel" style="width: 150px"></Input>
        </FormItem>
        <FormItem label="城市:">
          <Select v-model="data.cityId" filterable style="width:100px" class="mr10">
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
    <FormItem label="地址:" prop="streetAddress">
      <Input placeholder="请输入地址" v-model="data.streetAddress" style="width: 300px"></Input>
    </FormItem>
    <div style="display: flex">
      <div style="flex-flow: row nowrap;width: 100%">
        <!--          <FormItem label='结算方式:' prop="settTypeId">-->
        <!--            <Select v-model="data.settTypeId" style="width:100px" class="mr10">-->
        <!--              <Option v-for="item in list" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
        <!--            </Select>-->
        <!--          </FormItem>-->
        <FormItem label="结算方式：" prop="settTypeId">
          <Select v-model="data.settTypeId" style="width:100px">
            <Option
              v-for="item in settleTypeList['CS00106']"
              :value="item.itemCode"
              :key="item.itemCode"
            >
              {{
              item.itemName }}
            </Option>
          </Select>
        </FormItem>
      </div>
      <div style="flex-flow: row nowrap;width: 100%">
        <FormItem label="公司电话：" prop="tel">
          <Input placeholder="请输入电话" v-model="data.tel" style="width: 150px"></Input>
        </FormItem>
      </div>
    </div>
    <FormItem label="公司地址:">
      <Input placeholder="请输入公司地址" v-model="data.propertyFeatures" style="width: 300px"></Input>
    </FormItem>

    <div style="display: flex">
      <div style="flex-flow: row nowrap;width: 100%">
        <FormItem label="邮编:">
          <Input placeholder="请输入邮编" v-model="data.postalCode" style="width: 150px"></Input>
        </FormItem>
        <FormItem label="银行账户:" >
          <Input placeholder="请输入银行账户" v-model="data.accountBankNo" style="width: 150px"></Input>
        </FormItem>
        <FormItem label="备注:" prop="remark">
          <Input placeholder="请输入备注" v-model="data.remark" style="width: 300px"></Input>
        </FormItem>
      </div>
      <div style="flex-flow: row nowrap;width: 100%">
        <FormItem label="开户银行:">
          <Input placeholder="请输入银行" v-model="data.accountBank" style="width: 150px"></Input>
        </FormItem>
        <FormItem label="开户人名称:">
          <Input placeholder="请输入开户人名称" v-model="data.accountName" style="width: 150px"></Input>
        </FormItem>
      </div>
    </div>
  </Form>
</template>

<script>
import { getDigitalDictionary } from "@/api/system/essentialData/clientManagement";
export default {
  name: "AddLogistics",
  props: {
    data: "",
    provincearr: "",
    clearinglist: "",
    typelist: ""
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error("手机号格式不正确"));
      } else {
        callback();
      }
    };

    const validateBankNo = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("银行账户不能为空"));
      } else if (!/^\d+$/.test(value)) {
        callback(new Error("银行账号只能输入数字"));
      } else {
        callback();
      }
    };
    return {
      // list: [
      //     {label:'物流' , value: 0},
      //     {label:'快递' , value: 1}
      // ],
      settTypeId: "",
      settleTypeList: {}, //结账类型
      rules: {
        fullName: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        logisticsType: [{ required: true, message: "必选", trigger: "change" }],
        contactor: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        contactorTel: [
          { required: true, validator: validatePhone, trigger: "blur" }
        ],
        accountName: [
          { required: true, message: "账户人名称不能为空", trigger: "blur" }
        ],
        accountBankNo: [
          { required: true, validator: validateBankNo, trigger: "blur" }
        ],
        accountBank: [
          { required: true, message: "开户银行不能为空", trigger: "blur" }
        ],
        settTypeId: [{ required: true, message: "必选", trigger: "change" }],
        re: [{ required: true, message: "地址不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    //获取客户属性
    async getType() {
      let data = {};
      //107票据类型
      //106结算方式
      data = ["CS00106", "CS00107"];
      let res = await getDigitalDictionary(data);
      if (res.code == 0) {
        this.settleTypeList = res.data;
      }
    },
    resetFields() {
      this.$refs.form.resetFields();
    },
    handleSubmit(callback) {
      this.$refs.form.validate(valid => {
        if (valid) {
          callback && callback();
        }
      });
    }
  },
  mounted() {
    this.getType();
  }
};
</script>

<style scoped lang="less">
.header-box {
  padding: 0 10px;
  margin-bottom: 10px;
}
.isDisabeld {
  float: right;
}
</style>
