<template>
  <Form :label-width="100" ref="formInline" :model="data" :rules="formInline" class="list Habox">
    <div class="mb10" style="font-weight: bold">工商注册信息</div>
    <div>
      <label style="margin-right: 180px">
        往来单位名称：
        <span>{{ data.fullName }}</span>
      </label>
      <label>
        往来单位分类：
        <span>{{ data.guestTypeName }}</span>
      </label>
    </div>
    <Row>
      <Col span="8">
        <FormItem label="注册号:" prop="bizLicenseNo">
          <Input v-model="data.bizLicenseNo" style="width: 180px"></Input>
        </FormItem>
      </Col>
      <Col span="8">
        <FormItem label="公司性质:" prop="nature">
          <Select style="width:180px" v-model="data.nature">
            <Option
              v-for="item in dataMsg.CS00117"
              :value="item.id"
              :key="item.id"
            >{{ item.itemName }}</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="8">
        <FormItem label="法定代表人:" prop="legalPerson">
          <Input v-model="data.legalPerson" style="width: 180px"></Input>
        </FormItem>
        <FormItem label="经营期限:" prop="operationStart">
          <DatePicker
            v-model="data.operationStart"
            type="date"
            style="width: 180px"
            :options="startTimeOptions"
          ></DatePicker>
        </FormItem>
      </Col>
      <Col span="8">
        <FormItem label="注册资本(万):" prop="registMoney">
          <Input v-model="data.registMoney" style="width: 180px"></Input>
        </FormItem>
        <FormItem label="至" prop="operationEnd">
          <DatePicker
            v-model="data.operationEnd"
            type="date"
            style="width: 180px"
            :options="endTimeOptions"
          ></DatePicker>
        </FormItem>
      </Col>
      <Col span="8">
        <FormItem label="成立日期:" prop="registerDate">
          <DatePicker
            v-model="data.registerDate"
            type="date"
            format="yyyy-MM-dd"
            style="width: 180px"
          ></DatePicker>
        </FormItem>
        <FormItem label="登记状态:" prop="manageStatus">
          <Select v-model="data.manageStatus" style="width:180px">
            <Option
              v-for="item in dataMsg.CS00118"
              :value="item.id"
              :key="item.id"
            >{{ item.itemName }}</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <FormItem label="注册地址:" prop="registAddress">
      <Input v-model="data.registAddress" style="width: 650px"></Input>
    </FormItem>
    <FormItem label="经营地址:" prop="shopAddress">
      <Input v-model="data.shopAddress" style="width: 650px"></Input>
    </FormItem>
    <FormItem label="经营范围:" prop="mainProducts">
      <Input v-model="data.mainProducts" style="width: 650px"></Input>
    </FormItem>
    <Row>
      <Col span="12">
        <FormItem label="经营执照扫描:" prop="businessName">
          <Input v-model="data.businessName" style="width: 150px;float: left" disabled></Input>
          <Upload
            style="float: left;line-height: 29px;margin-left: 10px"
            ref="upload"
            :show-upload-list="false"
            :action="wxImgUrl"
            :format="['jpg','jpeg','png']"
            :headers="headers"
            :before-upload="handleBeforeUpload"
            :on-success="handleSuccess"
          >
            <Button class="uploadbtn">上传</Button>
          </Upload>
          <a
            target="view__blank"
            :href="data.businessName"
            class="download"
            download
            v-if="data.businessName"
          >下载</a>
          <a class="download" v-else @click="clownFile">下载</a>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="购物合同扫描:" prop="purchaseName">
          <Input v-model="data.purchaseName" style="width: 150px;float: left" disabled></Input>
          <Upload
            style="float: left;line-height: 29px;margin-left: 10px"
            ref="upload2"
            :show-upload-list="false"
            :action="wxImgUrl"
            :format="['jpg','jpeg','png']"
            :headers="headers"
            :before-upload="handleBeforeUpload2"
            :on-success="handleSuccess2"
          >
            <Button class="uploadbtn">上传</Button>
          </Upload>
          <a
            target="view__blank"
            :href="data.purchaseName"
            class="download"
            v-if="data.purchaseName"
          >下载</a>
          <a v-else class="download" @click="clownFile2">下载</a>
        </FormItem>
      </Col>
    </Row>
    <FormItem label="备注:" prop="remark">
      <Input v-model="data.remark" style="width: 650px"></Input>
    </FormItem>
    <Row>
      <Col span="8">
        <FormItem label="法人电话:" prop="chargeManTel">
          <Input v-model="data.chargeManTel" style="width: 180px"></Input>
        </FormItem>
        <FormItem label="授权采购员:" prop="salesman">
          <Input v-model="data.salesman" style="width: 180px"></Input>
        </FormItem>
      </Col>
      <Col span="16">
        <FormItem label="身份证号码:" prop="identityCard">
          <Input v-model="data.identityCard" style="width: 380px"></Input>
        </FormItem>
        <FormItem label="采购员电话:" prop="salesmanTel">
          <Input v-model="data.salesmanTel" style="width: 180px"></Input>
        </FormItem>
      </Col>
    </Row>
    <div class="mb10 mt20" style="font-weight: bold">结算约定情况</div>
    <Row>
      <Col span="8"></Col>
      <Col span="8">
        <FormItem label="回款方式:" prop="cashMode">
          <Select v-model="data.cashMode" style="width:180px">
            <Option
              v-for="item in dataMsg.CS00106"
              :value="item.itemCode"
              :key="item.id"
            >{{ item.itemName }}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="8">
        <FormItem label="约定对账日期:" prop="accountDate">
          <!--<Input v-model='data.accountDate' style="width: 180px" ></Input>-->
          <Input v-model="data.accountDate" style="width: 180px"></Input>
        </FormItem>
      </Col>
      <Col span="8">
        <FormItem label="回款日期:" prop="cashDate">
          <Input v-model="data.cashDate" style="width: 180px"></Input>
          <!--<Input v-model='data.cashDate' style="width: 180px" ></Input>-->
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="8">
        <FormItem label="滚动借款周期:" prop="rollingDate">
          <!--<Input v-model='data.rollingDate' style="width: 180px" ></Input>-->
          <InputNumber :min="1" v-model="data.rollingDate" style="width: 180px"></InputNumber>
        </FormItem>
      </Col>
      <Col span="16">
        <FormItem class="ivu-form-item-required" v-if="data.isGuestResearch == 0" label="申请授信额度:" prop="applyTrustMoney">
          <Input v-model="data.applyTrustMoney" style="width: 380px"></Input>
        </FormItem>
        <FormItem v-else label="调整原因:" prop="adjustReason">
          <Input v-model="data.adjustReason" style="width: 380px"></Input>
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>

<script>
import * as api from "_api/lease/customerSM";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
import * as tools from "../../../../utils/tools";

export default {
  name: "SurveyList",
  props: {
    data: "", //父组件中当前行的数据
    dataMsg: "", //父组件中数据字典的数据
    dataJudge: ""
  },
  data() {
    //手机号
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空!"));
      } else if (!/^1[34578]\d{9}$/.test(value)) {
        callback(new Error("手机号格式不正确"));
      } else {
        callback();
      }
    };
    const bigNumber = (rule, value, callback) => {
      let reg = /^\+?[1-9]\d*$/;
      if (!reg.test(value)) {
        return callback(new Error("请输入大于0的正整数!"));
      } else if (value > 10000) {
        return callback(new Error("首次申请额度不能大于10000"));
      } else {
        callback();
      }
    };
    const smallNumber = (rule, value, callback) => {
      if (value < 0||!value) {
        return callback(new Error("请输入大于0的正整数"));
      } else {
        callback();
      }
    };
    //注册号
    const Number = (rule, value, callback) => {
        if(!value){
            return callback(new Error("请输入正确注册号!"));
        }
      if (/^[0-9a-zA-Z]*$/.test(value)) {
        callback();
      } else {
        return callback(new Error("请输入正确注册号!"));
      }
    };
      const OnlyNumber = (rule, value, callback) => {
          if(!value){
              return callback(new Error("请输入正确注册资本！"));
          }
          if (/^[0-9]*$/.test(value)) {
              callback();
          } else {
              return callback(new Error("请输入正确注册资本！"));
          }
      };
    const NumberDate = (rule, value, callback) => {
      if (value >= 1 && value <= 31) {
        callback();
      } else {
        return callback(new Error("只能输入1-31之间的数字"));
      }
    };
    const disabledDateS = date => {
      return date && date.valueOf() > new Date(this.data.operationEnd);
    };
    const disabledDateE = date => {
      return date && date.valueOf() < new Date(this.data.operationStart);
    };
    return {
      formInline: {
        bizLicenseNo: [{ required: true, validator: Number,  trigger: "blur"}],
        nature: [
          {
            required: true,
            type: "string",
            message: "请选择正确公司性质！",
            trigger: "change"
          }
        ],
        legalPerson: [
          {
            required: true,
            type: "string",
            message: "请输入正确法定代表人！",
            trigger: "blur"
          }
        ],
        operationStart: [
          {
            required: true,
            type: "date",
            message: "请输入正确经营期限！",
            trigger: "change"
          }
        ],
        registMoney: [
          {
            required: true,
            type: "number",
            validator: OnlyNumber,
            message: "请输入正确注册资本！",
            trigger: "change"
          }
        ],
        operationEnd: [
          {
            required: true,
            type: "date",
            message: "请选择时间！",
            trigger: "change"
          }
        ],
        registerDate: [
          {
            required: true,
            type: "date",
            message: "请选择成立日期!",
            trigger: "change"
          }
        ],
        manageStatus: [
          {
            required: true,
            type: "string",
            message: "请选择登记状态！",
            trigger: "change"
          }
        ],
        registAddress: [
          {
            required: true,
            type: "string",
            message: "请输入正确注册地址！",
            trigger: "blur"
          }
        ],
        shopAddress: [
          {
            required: true,
            type: "string",
            message: "请输入正确经营地址！",
            trigger: "blur"
          }
        ],
        mainProducts: [
          {
            required: true,
            type: "string",
            message: "请输入正确经营范围！",
            trigger: "blur"
          }
        ],
        businessName: [
          {
            required: true,
            type: "string",
            message: "请上传营业执照！",
            trigger: "change"
          }
        ],
        salesman: [
          {
            required: true,
            type: "string",
            message: "请输入授权采购员！",
            trigger: "blur"
          }
        ],
        salesmanTel: [
          { required: true, validator: validatePhone, trigger: "blur" }
        ],
        cashMode: [
          {
            required: true,
            type: "string",
            message: "请选择回款方式！",
            trigger: "change"
          }
        ],
        accountDate: [
          {
            required: true,
            type: "number",
            validator: NumberDate,
            trigger: "blur"
          }
        ],
        cashDate: [
          {
            required: true,
            type: "number",
            validator: NumberDate,
            trigger: "blur"
          }
        ],
        rollingDate: [
          { required: true, type:"number", validator: smallNumber, trigger: "blur" }
        ],
        applyTrustMoney: [
          { required: true, validator: bigNumber, trigger: "change"},
        ],
        adjustReason:[
          {
            required: true,
            type: "string",
            message: "请填写调整原因",
            trigger: "blur"
          }
        ]
      },
      wxImgUrl: api.wxImgUrl, //图片地址
      headers: {
        Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
      }, //获取token
      startTimeOptions: {
        disabledDate: disabledDateS
      },
      endTimeOptions: {
        disabledDate: disabledDateE
      }
    };
  },
  methods: {
    clownFile() {
      if (this.data.businessName == null) {
        this.$message.warning("无下载文件！");
      }
    },
    handleReset() {
      this.$refs.formInline.resetFields();
      this.data.nature = this.dataMsg.CS00117[0].id;
    },
    clownFile2() {
      if (this.data.purchaseName == null) {
        this.$message.warning("无下载文件！");
      }
    },
    // 上传前
    handleBeforeUpload() {
      this.$refs.upload.clearFiles();
    },
    // 上传成功
    handleSuccess(res, file) {
      //console.log(res);
      if (res.code == 0) {
        this.data.businessName = api.getfile + res.data.url;
        //console.log(this.data.businessName);
      }
      // 二
    },
    // 上传前
    handleBeforeUpload2() {
      this.$refs.upload.clearFiles();
    },
    // 上传成功
    handleSuccess2(res, file) {
      //console.log(res);
      if (res.code == 0) {
        this.data.purchaseName = api.getfile + res.data.url;
      }
    },
    onStartTimeChange(startTime,type) {
      this.endTimeOptions = {
        // 设置结束时间不能选的范围
        disabledDate(endTime) {
          return endTime < startTime
        }
      }
      this.data.operationStart = startTime
    },
    onEndTimeChange(endTime,type) {
      this.startTimeOptions = {
        // 设置开始时间不能选的范围
        disabledDate(startTime) {
          return startTime > endTime
        }
      }
      this.data.operationEnd = endTime
    }
  },
};
</script>

<style scoped>
.download {
  display: inline-block;
  padding: 0 10px;
  line-height: 28px;
  box-sizing: border-box;
  margin-left: 10px;
  border: 1px #ddd solid;
}
.uploadbtn:hover {
  color: #03a9f4;
}
.list >>> .ivu-form-item {
  margin-bottom: 15px;
}
.list >>> label {
  width: 105px !important;
}
.list >>> .ivu-form-item-error-tip {
  position: absolute;
  top: 100%;
  left: 5px;
  line-height: 1;
  padding-top: 2px !important;
  color: #ed4014;
}
</style>

