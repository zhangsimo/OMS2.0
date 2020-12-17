<template>
  <Modal
    v-model="model"
    title="内部资金调拨 申请单"
    width="1200px"
  >
    <div class="bigbox">
      <div class="clearfix">
        <div class="fr">
          <Button class="mr10" v-if="!modelType" :loading="saveDis" @click="save(0)">保存草稿</Button>
          <Button class="mr10" v-if="!modelType"  :loading="saveDis" @click="save(1)">提交申请</Button>
          <Button class="mr10" @click="model =false" >取消</Button>
        </div>
      </div>
      <Form ref="formInline" :model="formInline" :label-width="100"  :rules="ruleValidate">
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
          <div class="tableright" style="border-bottom: 1px #cccccc solid">
            <FormItem label="主题" style="margin-bottom: 0px" prop="topic">
              <Input type="text"  v-model="formInline.topic" style="width: 100%" :disabled="modelType">
              </Input>
            </FormItem>
          </div>
          <div class="tableright">
            <Row>
              <Col span="12">
                <FormItem label="申请金额" style="margin-bottom: 0px" prop="applyAmt">
                  <Input type="number"  v-model="formInline.applyAmt" style="width: 100%" :disabled="modelType">
                  </Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="付款期限" style="margin-bottom: 0px" prop="paymentTerm">
                  <DatePicker type="date" v-model="formInline.paymentTerm" style="width: 100%" :disabled="modelType"></DatePicker>
                </FormItem>
              </Col>
            </Row>

          </div>
        </div>


        <h5 class="mt20 mb10" style="font-size: 18px">调拨信息</h5>
        <div class="financePlace">
          <a class="mr10" @click="addAccountRow">
            <Icon custom="iconfont iconxinzengicon icons" />添加行
          </a>
          <a class="mr10" @click="delAccountRow">
            <Icon custom="iconfont iconbianjixiugaiicon icons" />删除行
          </a>
        </div>
        <div class="financeTab">
          <vxe-table
            ref="xTable"
            auto-resize
            resizable
            border
            highlight-current-row
            @current-change="currentChangeEvent"
            :data="accountList"
            align="center"
            height="250"
            show-footer
          >
            <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
            <vxe-table-column field="outOrgName" title="转出门店"></vxe-table-column>
            <vxe-table-column title="转出账户" width="160">
              <template v-slot="{row}">
                <Select v-model="row.outAccount" style="width: 90%;padding-left: 5px;" filterable @on-change="getOutApply(row)" :disabled="modelType">
                  <Option v-for="item in payUserList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </template>
            </vxe-table-column>
            <vxe-table-column field="outAccountNo" title="转出账号"></vxe-table-column>
            <vxe-table-column title="转入门店" width="160">
              <template v-slot="{row}">
                <Select @on-change="getCompany" filterable v-model="row.enterOrgid" style="width: 90%;padding-left: 5px" :disabled="modelType">
                  <Option v-for="item in company" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
              </template>
            </vxe-table-column>
            <vxe-table-column title="转入账户" width="160">
              <template v-slot="{row}">
                <Select  v-model="row.enterAccount" filterable @on-change="getinto" style="width: 90%;padding-left: 5px" :disabled="modelType">
                  <Option v-for="item in row.enterAccountList" :value="item.id" :key="item.id">{{ item.accountName }}</Option>
                </Select>
              </template>
            </vxe-table-column>
            <vxe-table-column field="enterAccountNo" title="转入账号"></vxe-table-column>
          </vxe-table>
        </div>
        <h5 class="mt20 mb10" style="font-size: 18px">凭证图片</h5>
        <upphoto @backUpImgList="getImgList" ref="upImg" :list="Pictures"></upphoto>
        <flowbox :approvalTit="list" v-if="list.type == 4"></flowbox>
      </Form>
    </div>

    <div slot='footer'></div>
  </Modal>
</template>

<script>
  import index from './index/InternalFinance.js'
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
  .tableBox2{
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
  .proceeds >>>.ivu-form-item {
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
