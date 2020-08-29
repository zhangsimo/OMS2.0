<template>
  <Modal
    v-model="model"
    title="因公借支申请 申请单"
    width="1200px"
  >
    <div class="bigbox">
      <div class="clearfix">
        <div class="fr">
          <Button class="mr10" v-if="!modelType" @click="save(0)">保存草稿</Button>
          <Button class="mr10" v-noresub v-if="!modelType" @click="save(1)">提交申请</Button>
          <Button class="mr10" @click="model =false">取消</Button>
        </div>
      </div>
      <Form ref="formInline" :model="formInline" :label-width="100" :rules="ruleValidate">
        <div class="mb10">
          <span class="mr5">申请单号：</span>
          <Input type="text" v-model="formInline.applyNo" style="width: 200px" disabled>
          </Input>
        </div>
        <Row class="tableBox">
          <Col class="inner" span="4">申请人</Col>
          <Col class="inner" span="4">{{formInline.applicant || ''}}</Col>
          <Col class="inner" span="4">部门名称</Col>
          <Col class="inner" span="4">{{formInline.deptName || ' '}}</Col>
          <Col class="inner" span="4">门店店号</Col>
          <Col class="inner" span="4">{{formInline.shopCode || ' '}}</Col>
        </Row>
        <Row class="tableBox twoTable">
          <Col class="inner" span="4">门店名称</Col>
          <Col class="inner" span="4">{{formInline.orgName || ' '}}</Col>
          <Col class="inner" span="4">申请类型</Col>
          <Col class="inner" span="4">{{formInline.applyTypeName || ' '}}</Col>
          <Col class="inner" span="4">申请时间</Col>
          <Col class="inner" span="4">{{formInline.applyTime}}</Col>
        </Row>

        <div class="tableBox2 mt20">
          <div class="tableline tableright">
            <div class="applyTitle">请示单号</div>
            <a class="ml10">{{formInline.requestInstructionNo || ''}}</a>
            <a class="fr" @click="openSelect" v-if="!modelType">选择</a>
          </div>
          <div class="tableright" style="border-bottom: 1px #cccccc solid">
            <FormItem label="主题" style="margin-bottom: 0px" prop="topic">
              <Input type="text" v-model="formInline.topic" style="width: 100%" :disabled="modelType">
              </Input>
            </FormItem>
          </div>
          <div class="tableright">
            <FormItem label="借支金额" style="margin-bottom: 0px" prop="applyAmt">
              <Input type="number" v-model="formInline.applyAmt" style="width: 100%" :disabled="modelType">
              </Input>
            </FormItem>
          </div>
        </div>

        <h5 class="mt20 mb10" style="font-size: 18px">收款人信息</h5>
        <div class="proceeds">
          <Row>
            <Col span="8">
              <FormItem label="收款人账户" prop="receiverId" style="margin-bottom: 0px">
                <Select
                  v-model="formInline.receiverId"
                  filterable
                  remote
                  :remote-method="remoteMethod1"
                  style="width: 90%;padding-left: 5px"
                  label-in-value
                  @on-change="getCompany"
                  :disabled="modelType"
                  placeholder="请输入姓名查询选择"
                >
                  <Option
                    v-for="item in options1"
                    :value="item.id"
                    :key="item.id"
                  >{{ item.accountName }}
                  </Option
                  >
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="开户行名称" prop="receiveBank" style="margin-bottom: 0px">
                <Input type="text" v-model="formInline.receiveBank" style="width: 90%;padding-left: 5px" disabled></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="银行账号" prop="receiveBankNo" style="margin-bottom: 0px;border-right: none">
                <Input type="text" :value="formInline.receiveBankNo" style="width: 90%;padding-left: 5px" disabled></Input>
              </FormItem>
            </Col>
          </Row>
        </div>


        <h5 class="mt20 mb10" style="font-size: 18px">支付信息</h5>
        <div class="proceeds">
          <Row>
            <Col span="6">
              <FormItem label="支付门店" style="margin-bottom: 0px">
                <Input type="text" v-model="formInline.paymentOrgName" style="width: 90%;padding-left: 5px"
                       disabled></Input>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem label="付款账户" prop="paymentAccount" style="margin-bottom: 0px">
                <Select
                  v-model="formInline.paymentAccount"
                  style="width: 90%;padding-left: 5px"
                  @on-change="getPay"
                >
                  <Option v-for="item in payUserList" :value="item.id" :key="item.id">{{ item.accountName }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem label="支付银行" style="margin-bottom: 0px">
                <Input type="text" v-model="formInline.paymentBank " style="width: 90%;padding-left: 5px"
                       disabled></Input>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem label="支付账号" style="margin-bottom: 0px">
                <Input type="text" :value="formInline.paymentBankNo" style="width: 90%;padding-left: 5px"
                       disabled></Input>
              </FormItem>
            </Col>
          </Row>
        </div>


        <h5 class="mt20 mb10" style="font-size: 18px">凭证图片</h5>
        <upphoto @backUpImgList="getImgList" ref="upImg" :list="Pictures"></upphoto>
        <flowbox :approvalTit="list" v-if="list.type == 4"></flowbox>
      </Form>
    </div>
    <!--    选择的模态框-->
    <requestCode ref="request" @backList='getBackList'></requestCode>


    <div slot='footer'></div>
  </Modal>
</template>

<script>
  import index from './index/PublicRequest.js'

  export default index
</script>

<style scoped lang="less">
  .tableBox {
    line-height: 38px;
    text-align: center;
    border: #cccccc 1px solid;
    border-right: none;

    .inner {
      border-right: #cccccc 1px solid;
      height: 38px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .inner:nth-child(2n-1) {
      background: #f9f9f9;
    }
  }

  .tableBox2 {
    line-height: 38px;
    border: #cccccc 1px solid;
    border-right: none;
  }

  .twoTable {
    border-top: none;
  }

  .tableline {
    border-bottom: #cccccc 1px solid;
    padding-right: 10px;
  }

  .tableright {
    border-right: #cccccc 1px solid;
  }

  .applyTitle {
    width: 100px;
    border-right: #cccccc 1px solid;
    text-align: center;
    background-color: #f9f9f9;
    display: inline-block;
  }

  .proceeds {
    border: #cccccc 1px solid;
    line-height: 38px;

  }
</style>
<style scoped>
  .tableright >>> .ivu-form-item-label {
    text-align: center;
    border-right: #cccccc 1px solid;
    background-color: #f9f9f9;
  }

  .proceeds >>> .ivu-form-item-label {
    border-right: #cccccc 1px solid;
  }

  .proceeds >>> .ivu-form-item {
    border-right: #cccccc 1px solid;
  }

  .bigbox {
    height: 700px;
    overflow: hidden;
    overflow-y: auto;
  }

  /*滚动条是否隐藏*/
  /*.bigbox::-webkit-scrollbar {display:none}*/
</style>
