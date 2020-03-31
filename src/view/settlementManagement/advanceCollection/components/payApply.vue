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
            <Input v-model="payInfo.guestName" class="w100" />
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
            <Input v-model="info.paymentShopName" class="w100" />
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
    <div class="tc" style="width: 58px;height:58px;line-height: 58px;border:1px dashed #e4e4e4 " v-for="(item,index) in uploadList" :key="index">
      <img :src="item.url" />
    </div>
    <Upload
      ref="upload"
      :show-upload-list="false"
      :action="getfile"
      :format="['jpg','jpeg','png']"
      :headers="headers"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess"
    >
      <div class="tc" style="width: 58px;height:58px;line-height: 58px;border:1px dashed #e4e4e4 ">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
    <div slot="footer"></div>
    <seleteNo ref="seleteNo" :orgId='info.orgId' @bill='bill'/>
  </Modal>
</template>
<script>
import {
  findApplyInfo,
  findCollectionInfo,
  savePay
} from "_api/settlementManagement/advanceCollection.js";
import seleteNo from './seleteNo'
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
import * as api from "_api/lease/customerSM";
export default {
  components:{seleteNo},
  data() {
    return {
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
      getfile: api.getfile,
      uploadList:[]
    };
  },
  mounted(){
    this.uploadList = this.$refs.upload.fileList;
  },
  methods: {
    //弹框是否打开
    visChange(type) {
      if (type) {
        //预收款支出申请基础信息和支付信息
        findApplyInfo().then(res => {
          if (res.code === 0) {
            this.info = res.data;
          }
        });
        //预收款单据和往来单位信息
        findCollectionInfo({ serviceId: this.$parent.currRow.serviceId }).then(
          res => {
            if (res.code === 0) {
              this.payData.push(res.data.one);
              this.payInfo = res.data.two;
            }
          }
        );
      } else {
        this.payData=[]
        this.$refs.baseInfo.resetFields();
        this.$refs.collectInfo.resetFields();
        this.$refs.paymentInfo.resetFields();
      }
    },
    //传参
    bill(obj){
      this.payData.push(obj)
    },
    //保存/提交
    save(type) {
      let f1 = null;
      this.$refs.baseInfo.validate(val => (f1 = val));
      let f2 = null;
      this.$refs.collectInfo.validate(val => (f2 = val));
      let f3 = null;
      this.$refs.paymentInfo.validate(val => (f3 = val));
      if (f1 && f2 & f3) {
        let obj = {
          ...this.info,
          ...this.payInfo,
          theme: this.baseInfo.tit,
          applyAmt: this.baseInfo.amt,
          imageList: this.uploadList,
          status: type,
          receiveAccountName:this.payInfo.accountName,
          serviceId:this.payData[0].serviceId,
          paymentAccountName:this.info.paymentAccountNo
        };
        savePay(obj).then(res => {
          if(res.code===0){
            this.$message.success('申请成功')
            this.modal=false
            this.$parent.getQuery()
          }
        });
      }
    },
    //选择单据
    seleteBill(){
      if(this.payData.length===0){
        this.$refs.seleteNo.modal=true
      } else {
        this.$message.error('请先删除表格数据')
      }
    },
    //删除数据
    remove(ind) {
      this.payData.splice(ind, 1);
    },
    //上传前
    handleBeforeUpload() {
      this.$refs.upload.clearFiles();
    },
    // 上传成功
    handleSuccess(res, file) {
      console.log(res, file);
    }
  }
};
</script>
<style>
.tab {
  border: 1px solid #e4e4e4;
  height: 60px;
}
</style>