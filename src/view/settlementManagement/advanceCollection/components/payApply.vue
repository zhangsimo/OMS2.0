<template>
  <Modal v-model="modal" title="预收款支出申请单" width="800" @on-visible-change="visChange">
    <Row class="mb20">
      <Col span="12">
        <h3 class="tr">预收款支出申请单</h3>
      </Col>
      <Col span="12" class="tr">
        <Button class="mr10" @click="save(0)">保存草稿</Button>
        <Button class="mr10" @click="save(1)">提交申请</Button>
        <Button @click="modal = false">取消</Button>
      </Col>
    </Row>
    <div class="mb10">
      <span>申请单号：</span>
      <Input class="w200" v-model="info.expenditureNo" readonly />
    </div>
    <Row>
      <Col span="2" class="tab tc p10" style="background:#F2F2F2">申请人</Col>
      <Col span="6" class="tab tc p10">{{info.applyUserName}}</Col>
      <Col span="2" class="tab tc p10" style="background:#F2F2F2">部门名称</Col>
      <Col span="6" class="tab tc p10">{{info.departName}}</Col>
      <Col span="2" class="tab tc p10" style="background:#F2F2F2">门店店号</Col>
      <Col span="6" class="tab tc p10">{{info.shopCode}}</Col>
    </Row>
    <Row>
      <Col span="2" class="tab tc p10" style="background:#F2F2F2">门店名称</Col>
      <Col span="6" class="tab tc p10">{{info.shopName}}</Col>
      <Col span="2" class="tab tc p10" style="background:#F2F2F2">申请类型</Col>
      <Col span="6" class="tab tc p10">{{info.applyType}}</Col>
      <Col span="2" class="tab tc p10" style="background:#F2F2F2">申请时间</Col>
      <Col span="6" class="tab tc p10">{{info.applyDate}}</Col>
    </Row>
    <Form class="mt10" :label-width="128" ref="baseInfo" :model="baseInfo" :rules="ruleBaseInfo">
      <FormItem label="主题" prop="tit">
        <Input class="w400" v-model="baseInfo.tit" />
      </FormItem>
      <FormItem label="申请金额" prop="amt">
        <Input class="w400" v-model="baseInfo.amt" />
      </FormItem>
    </Form>
    <h5 class="mt10 mb10">预付款单据</h5>
    <Button @click="seleteBill">选择单据</Button>
    <Table class="mt10" border :columns="payColumns" :data="payData">
      <template slot-scope="{ row, index }" slot="action">
        <Button size="small" @click="remove(index)">删除</Button>
      </template>
    </Table>
    <h5 class="mt10 mb10">收款人信息</h5>
    <Form class="mt10" ref="collectInfo" :model="payInfo" :rules="ruleCollectInfo">
      <div style="display: flex">
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="往来单位" prop="guestName">
            <Input v-model="payInfo.guestName" class="w100" readonly />
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="收款人账户" prop="accountName">
            <Input class="w100" v-model="payInfo.accountName" />
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="开户行名称" prop="accountBank">
            <Input class="w100" v-model="payInfo.accountBank" />
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="银行账号" prop="accountBankNo">
            <Input class="w100" v-model="payInfo.accountBankNo" />
          </FormItem>
        </div>
      </div>
    </Form>
    <h5 class="mt10 mb10">支付信息</h5>
    <Form class="mt10" ref="paymentInfo" :model="info" :rules="rulePaymentInfo">
      <div style="display: flex">
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="支付门店" prop="paymentShopName">
            <Input v-model="info.paymentShopName" class="w100" readonly />
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="付款账户" prop="paymentAccountNo">
            <Select v-model="info.paymentAccountNo" class="w200">
              <Option
                v-for="(item,index) of info.paymentAccountList"
                :value="item.paymentAccountNo"
                :key="index"
              >{{item.paymentAccountNo}}</Option>
            </Select>
          </FormItem>
        </div>
      </div>
    </Form>
    <h5 class="mt10 mb10">凭证图片</h5>
    <div class="flex">
      <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
        <img :src="item" style="width: 58px;height:58px;line-height: 58px;" />
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
        </div>
      </div>
      <div class="flex" style="align-items: flex-end;">
        <span v-if="uploadListModal.length>5" class="mr5" @click="visible1=true" style="cursor: pointer;font-size:12px">查看全部</span>
      </div>
      <Upload
        ref="upload"
        type="drag"
        multiple
        :show-upload-list="false"
        :action="getfile"
        :max-size="1024"
        :format="['jpg','jpeg','png']"
        :on-exceeded-size="handleMaxSize"
        :headers="headers"
        :before-upload="handleBeforeUpload"
        :on-success="handleSuccess"
      >
        <div class="tc" style="width: 58px;height:58px;line-height: 58px;">
          <Icon type="ios-camera" size="20"></Icon>
        </div>
      </Upload>
    </div>
    <div slot="footer"></div>
    <Modal v-model="visible">
      <img :src="imgName " style="width: 100%" />
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="visible1">
      <div class="demo-upload-list" v-for="(item,index) in uploadListModal" :key="index">
        <img :src="item" style="width: 58px;height:58px;line-height: 58px;" />
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
    <seleteNo ref="seleteNo" :orgId="info.orgId" @bill="bill" />
  </Modal>
</template>
<script>
import {
  findApplyInfo,
  findCollectionInfo,
  savePay
} from "_api/settlementManagement/advanceCollection.js";
import seleteNo from "./seleteNo";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
import * as api from "_api/lease/log.js";
import index from "../../../admin/roles";
export default {
  components: { seleteNo },
  data() {
    return {
      visible: false, //图片弹框
      visible1:false,//查看全部弹框
      imgName: "", //看大图
      modal: false,
      payColumns: [
        {
          title: "操作",
          slot: "action"
        },
        {
          title: "预收款收款单号",
          key: "serviceId"
        },
        {
          title: "往来单位",
          key: "guestName"
        },
        {
          title: "日期",
          key: "receiveDate"
        },
        {
          title: "预收款认领金额",
          key: "claimAmt"
        },
        {
          title: "预收款核销金额",
          key: "writeOffAmt"
        },
        {
          title: "预收款支出金额",
          key: "expenditureAmt"
        },
        {
          title: "预收款支出已认领金额",
          key: "expenditureClaimAmt"
        },
        {
          title: "预收款余额",
          key: "remainingAmt"
        }
      ],
      payData: [],
      info: {}, //基础信息和支付信息
      payInfo: {}, //收款人信息
      baseInfo: {
        tit: "",
        amt: null
      }, //主题，申请金额
      ruleBaseInfo: {
        tit: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ],
        amt: [
          {
            required: true,
            message: "不能为空且要大于0",
            trigger: "blur"
          }
        ]
      }, //基本信息校验规则
      ruleCollectInfo: {
        accountName: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ],
        accountBank: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ],
        accountBankNo: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ]
      }, //收款校验规则
      rulePaymentInfo: {
        paymentShopName: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ],
        paymentAccountNo: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ]
      }, //付款校验规则
      headers: {
        Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
      }, //获取token
      getfile: api.putImgUrl,
      uploadList: [],//5张图片
      uploadListModal:[],//全部图片
    };
  },
  methods: {
    //图片查看
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    //图片删除
    handleRemove(index) {
      this.uploadList.splice(index, 1);
      this.uploadListModal.splice(index, 1);
    },
    //上传出错
    handleMaxSize(file) {
      this.$message.error("图片不能超过1M");
    },
    //弹框是否打开
    visChange(type) {
      if (type) {
        //预收款支出申请基础信息和支付信息
        findApplyInfo().then(res => {
          if (res.code === 0) {
            this.info = res.data;
          }
        });
        this.find(this.$parent.currRow.serviceId);
      } else {
        this.payData = [];
        this.uploadList = [];
        this.$refs.baseInfo.resetFields();
        this.$refs.collectInfo.resetFields();
        this.$refs.paymentInfo.resetFields();
      }
    },
    //传参
    bill(obj) {
      this.find(obj.serviceId);
    },
    //保存/提交
    save(type) {
      let obj = {
        ...this.info,
        ...this.payInfo,
        theme: this.baseInfo.tit,
        applyAmt: this.baseInfo.amt,
        imageList: this.uploadList,
        status: type,
        receiveAccountName: this.payInfo.accountName,
        serviceId: this.payData[0].serviceId,
        paymentAccountName: this.info.paymentAccountNo
      };
      if (type) {
        let f1 = null;
        this.$refs.baseInfo.validate(val => (f1 = val));
        let f2 = null;
        this.$refs.collectInfo.validate(val => (f2 = val));
        let f3 = null;
        this.$refs.paymentInfo.validate(val => (f3 = val));
        if (f1 && f2 & f3) {
          savePay(obj).then(res => {
            if (res.code === 0) {
              this.$message.success("申请成功");
              this.modal = false;
              this.$parent.getQuery();
            }
          });
        }
      } else {
        savePay(obj).then(res => {
          if (res.code === 0) {
            this.$message.success("保存成功");
            this.modal = false;
            this.$parent.getQuery();
          }
        });
      }
    },
    //选择单据
    seleteBill() {
      if (this.payData.length === 0) {
        this.$refs.seleteNo.modal = true;
      } else {
        this.$message.error("请先删除表格数据");
      }
    },
    //删除数据
    remove(ind) {
      this.payData.splice(ind, 1);
      this.payInfo = {};
    },
    find(serviceId) {
      //预收款单据和往来单位信息
      findCollectionInfo({ serviceId }).then(res => {
        if (res.code === 0) {
          this.payData.push(res.data.one);
          this.payInfo = res.data.two;
        }
      });
    },
    //上传前
    handleBeforeUpload() {
      this.$refs.upload.clearFiles();
    },
    // 上传成功
    handleSuccess(res, file) {
      if (res.code == 0) {
        if (this.uploadListModal.length < 50) {
          if(this.uploadList.length<5){
            this.uploadList.push(api.getfile + res.data.url);
          }
          this.uploadListModal.push(api.getfile + res.data.url);
        } else {
          this.$message.error("只能上传50张图片");
        }
      }
    }
  }
};
</script>
<style>
.tab {
  border: 1px solid #e4e4e4;
  height: 60px;
}
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>