<template>
    <Form :label-width="100" ref="form" class="list">
      <div class="mb10" style="font-weight: bold">
        工商注册信息
      </div>
      <div>
        <label style="margin-right: 180px">往来单位名称：<span>{{ data.fullName }}</span></label>
        <label>往来单位分类：<span>{{ data.guestTypeName }}</span></label>
      </div>
      <Row>
        <Col span="8">
          <FormItem label='注册号:' >
            <Input v-model='data.bizLicenseNo' style="width: 180px" ></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label='公司性质:' >
            <!--&lt;!&ndash;<Input v-model='data.bizLicenseNo' style="width: 180px" ></Input>&ndash;&gt;nature-->
            <Select style="width:180px" v-model="data.nature">
              <Option v-for="item in dataMsg.CS00117" :value="item.id" :key="item.id">{{ item.itemName }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label='法定代表人:' >
            <Input v-model='data.legalPerson' style="width: 180px" ></Input>
          </FormItem>
          <FormItem label='经营期限:' >
            <DatePicker :value="data.operationStart" format="yyyy-MM-dd"  style="width: 180px" @on-change="ChangeTime"></DatePicker>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label='注册资本(万):' >
            <Input v-model='data.registMoney' style="width: 180px" ></Input>
          </FormItem>
          <FormItem label='至' >
            <DatePicker :value="data.operationEnd"   style="width: 180px" @on-change="ChangeTime2"></DatePicker>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label='成立日期:' >
            <DatePicker :value="data.registerDate"  style="width: 180px" @on-change="ChangeTime3"></DatePicker>
          </FormItem>
          <FormItem label='登记状态:' >
            <Select v-model="data.manageStatus" style="width:180px" >
              <Option v-for="item in dataMsg.CS00118" :value="item.id" :key="item.id">{{ item.itemName }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <FormItem label="注册地址:">
        <Input v-model='data.registAddress' style="width: 650px" ></Input>
      </FormItem>
      <FormItem label="经营地址:">
        <Input v-model='data.shopAddress' style="width: 650px" ></Input>
      </FormItem>
      <FormItem label="经营范围:">
        <Input v-model='data.mainProducts' style="width: 650px" ></Input>
      </FormItem>
      <Row>
        <Col span="12">
          <FormItem label="经营执照扫描:">
            <Input v-model='data.businessName' style="width: 150px;float: left"  disabled></Input>
            <Upload style="float: left;line-height: 29px;margin-left: 10px"
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
            <a target="view__blank" :href="data.businessName" class="download" download="" v-if="data.businessName">下载</a>
            <a class="download" v-else>下载</a>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="购物合同扫描:">
            <Input v-model='data.purchaseName' style="width: 150px;float: left" disabled></Input>
            <Upload style="float: left;line-height: 29px;margin-left: 10px"
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
            <a target="view__blank" :href="data.purchaseName" class="download" v-if="data.purchaseName">下载</a>
            <a v-else class="download">下载</a>
          </FormItem>
        </Col>
      </Row>
      <FormItem label="备注:">
        <Input v-model='data.remark' style="width: 650px" ></Input>
      </FormItem>
      <Row>
        <Col span="8">
          <FormItem label="法人电话:">
            <Input v-model='data.chargeManTel' style="width: 180px" ></Input>
          </FormItem>
          <FormItem label="授权采购员:">
            <Input v-model='data.salesman' style="width: 180px" ></Input>
          </FormItem>
        </Col>
        <Col span="16">
          <FormItem label="身份证号码:">
            <Input v-model='data.identityCard' style="width: 380px" ></Input>
          </FormItem>
          <FormItem label="采购员电话:">
            <Input v-model='data.salesmanTel' style="width: 180px" ></Input>
          </FormItem>
        </Col>
      </Row>
      <div class="mb10 mt20" style="font-weight: bold">
        结算约定情况
      </div>
      <Row>
        <Col span="8">

        </Col>
        <Col span="8">
          <FormItem label="回款方式:">
            <!--<Input v-model='data.cashMode' style="width: 180px" ></Input>-->
            <Select v-model="data.cashMode" style="width:180px" >
              <Option v-for="item in dataMsg.CS00106" :value="item.id" :key="item.id">{{ item.itemName }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="约定对账日期:">
            <Input v-model='data.accountDate' style="width: 180px" ></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="回款日期:">
            <Input v-model='data.cashDate' style="width: 180px" ></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="滚动借款周期:">
            <Input v-model='data.rollingDate' style="width: 180px" ></Input>
          </FormItem>
        </Col>
        <Col span="16">
          <FormItem label="申请受用额度:">
            <Input v-model='data.applyTrustMoney' style="width: 380px" @on-blur="verify"></Input>
          </FormItem>
        </Col>
      </Row>
    </Form>
</template>

<script>
  import * as api from "_api/lease/customerSM";
  import Cookies from 'js-cookie'
  import { TOKEN_KEY } from '@/libs/util'

  export default {
        name: "SurveyList",
        props:{
            data:'', //父组件中当前行的数据
            dataMsg: '', //父组件中数据字典的数据
        },
        data(){
            return {
              wxImgUrl: api.wxImgUrl,//图片地址
              headers: {
                Authorization:'Bearer ' + Cookies.get(TOKEN_KEY)
              }, //获取token
            }
        },
    methods: {
      verify() {
        var reg = /^\+?[1-9]\d*$/;
        if (!reg.test(this.data.applyTrustMoney)) {
          this.$Message.error('请输入大于0的正整数!')
        }
        if (this.data.applyTrustMoney > 10000) {
          this.$message.error('首次申请额度不能大于10000')
        }
      },
      ChangeTime(value) {
        // console.log(value)
        this.data.operationStart = value
      },
      ChangeTime2(value) {
        // console.log(value,2312312312)
        this.data.operationEnd = value
      },
      ChangeTime3(value) {
        this.data.registerDate = value
      },
      // 上传前
      handleBeforeUpload() {
        this.$refs.upload.clearFiles();
      },
      // 上传成功
      handleSuccess(res, file) {
        console.log(res)
        if (res.code == 0) {
          this.data.businessName = api.getfile + res.data.url
          console.log(this.data.businessName)
        }
        // 二
      },
      // 上传前
      handleBeforeUpload2() {
        this.$refs.upload.clearFiles();
      },
      // 上传成功
      handleSuccess2(res, file) {
        console.log(res)
        if (res.code == 0) {
          this.data.purchaseName = api.getfile + res.data.url
        }
      }
    }
    }
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
.list>>>.ivu-form-item {
  margin-bottom: 10px;
}
</style>
