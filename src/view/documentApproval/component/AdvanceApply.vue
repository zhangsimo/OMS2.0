<template>
  <Modal v-model="model" title="采购预付款 申请单" width="1200px">
    <div class="bigbox">
      <div class="clearfix">
        <div class="fr">
          <Button class="mr10" v-if="!modelType" :loading="saveDis" @click="save(0)"
            >保存草稿</Button
          >
          <Button class="mr10" v-if="!modelType" :loading="saveDis"  @click="save(1)"
            >提交申请</Button
          >
          <Button class="mr10" @click="model = false">取消</Button>
        </div>
      </div>
      <Form
        ref="formInline"
        :model="formInline"
        :label-width="100"
        :rules="ruleValidate"
      >
        <div class="mb10">
          <span class="mr5">申请单号：</span>
          <Input
            type="text"
            v-model="formInline.applyNo"
            style="width: 200px"
            disabled
          >
          </Input>
        </div>
        <Row class="tableBox">
          <Col class="inner" span="4">申请人</Col>
          <Col class="inner" span="4">{{ formInline.applicant || "" }}</Col>
          <Col class="inner" span="4">部门名称</Col>
          <Col class="inner" span="4">{{ formInline.deptName || " " }}</Col>
          <Col class="inner" span="4">门店店号</Col>
          <Col class="inner" span="4">{{ formInline.shopCode || " " }}</Col>
        </Row>
        <Row class="tableBox twoTable">
          <Col class="inner" span="4">门店名称</Col>
          <Col class="inner" span="4">{{ formInline.orgName || " " }}</Col>
          <Col class="inner" span="4">申请类型</Col>
          <Col class="inner" span="4">{{
            formInline.applyTypeName || " "
          }}</Col>
          <Col class="inner" span="4">申请时间</Col>
          <Col class="inner" span="4">{{ formInline.applyTime }}</Col>
        </Row>

        <div class="tableBox2 mt20">
          <div class="tableright" style="border-bottom: 1px #cccccc solid">
            <FormItem label="主题" style="margin-bottom: 0px" prop="topic">
              <Input
                type="text"
                v-model="formInline.topic"
                style="width: 100%"
                :disabled="modelType"
              >
              </Input>
            </FormItem>
          </div>
          <div class="tableright">
            <FormItem
              label="申请金额"
              style="margin-bottom: 0px"
              prop="applyAmt"
            >
              <Input
                type="number"
                v-model="applyAmtTotal"
                style="width: 100%"
                :disabled="modelType"
                readonly
              >
              </Input>
            </FormItem>
          </div>
        </div>

        <h5 class="mt20 mb10" style="font-size: 18px">预付款采购单据</h5>
        <Button class="mb10" @click="SelectTheDocuments" v-if="!modelType"
          >选择单据</Button
        >
        <vxe-table
          class="mt10"
          border
          resizable
          auto-resize
          ref="documentTable"
          show-footer
          show-overflow
          :footer-method="documentFooterMethod"
          size="mine"
          align="center"
          :data="formInline.details"
          :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
        >
          <vxe-table-column title="操作" width="80" v-if="!modelType">
            <template v-slot="item">
              <a @click="dele(item)">删除行</a>
            </template>
          </vxe-table-column>
          <vxe-table-column
            field="serviceId"
            title="订单单号"
          ></vxe-table-column>
          <vxe-table-column
            field="guestName"
            title="往来单位"
          ></vxe-table-column>
          <vxe-table-column field="orderDate" title="订单日期"></vxe-table-column>
          <vxe-table-column
            field="payAmt"
            title="计划预付款"
          >
          <template v-slot="{row}">
              <span>{{Number(row.payAmt).toFixed(2)}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="orderAmt" title="订单金额">
            <template v-slot="{row}">
              <span>{{Number(row.orderAmt).toFixed(2)}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="hasApplyAmt" title="已申请金额">
            <template v-slot="{row}">
              <span>{{Number(row.hasApplyAmt).toFixed(2)}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column title="申请前剩余金额" field="lastAmt">
            <template v-slot="{row}">
              <span>{{(Number(row.orderAmt) - Number(row.hasApplyAmt) - Number(row.adjustAmt)).toFixed(2)}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="applyAmt"  title="本次申请金额" :edit-render="{name: 'input', attrs: {type: 'number', disabled: modelType},events: {change: changeThisA}}">
          </vxe-table-column>

        </vxe-table>

        <h5 class="mt20 mb10" style="font-size: 18px">收款人信息</h5>
        <div class="proceeds">
          <Row>
            <Col span="6">
              <FormItem label="往来单位" style="margin-bottom: 0px">
                <Select
                  @on-change="getCompany"
                  v-model="formInline.receiveGuestId"
                  label-in-value
                  clearable
                  filterable
                  remote
                  :loading="remoteloading"
                  :remote-method="remoteMethod"
                  style="width: 90%;padding-left: 5px"
                  :disabled="modelType"
                >
                  <Option
                    v-for="item in company"
                    :value="item.value"
                    :key="item.value"
                    >{{ item.label }}</Option
                  >
                </Select>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem
                label="收款人账户"
                style="margin-bottom: 0px"
              >
                <Select
                  @on-change="changeCollectionUname"
                  v-model="formInline.receiverId"
                  filterable
                  style="width: 90%;padding-left: 5px"
                  :disabled="modelType"
                >
                  <Option
                    v-for="item in receiverArr"
                    :value="item.id"
                    :key="item.id"
                    >{{ item.accountName }}</Option
                  >
                </Select>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem
                label="开户行名称"
                prop="receiveBank"
                style="margin-bottom: 0px"
              >
                <Input
                  type="text"
                  v-model="formInline.receiveBank"
                  style="width: 90%;padding-left: 5px"
                  disabled
                ></Input>
              </FormItem>
            </Col>

            <Col span="6">
              <FormItem
                label="银行账号"
                prop="receiveBankNo"
                style="margin-bottom: 0px;border-right: none"
              >
                <Input
                  type="text"
                  v-model="formInline.receiveBankNo"
                  style="width: 90%;padding-left: 5px"
                  disabled
                ></Input>
              </FormItem>
            </Col>
          </Row>
        </div>

        <h5 class="mt20 mb10" style="font-size: 18px">支付信息</h5>
        <div class="proceeds">
          <Row>
            <Col span="6">
              <FormItem label="支付门店" style="margin-bottom: 0px">
                <Input
                  type="text"
                  v-model="formInline.paymentOrgName"
                  style="width: 90%;padding-left: 5px"
                  disabled
                ></Input>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem
                label="付款账户"
                prop="paymentAccount"
                style="margin-bottom: 0px"
              >
                <Select
                  v-model="formInline.paymentAccount"
                  style="width: 90%;padding-left: 5px"
                  @on-change="getPay"
                >
                  <Option v-for="item in payUserList" :value="item.id" :key="item.id">{{ item.accountName }}</Option>
                </Select>
<!--                <Select-->
<!--                  v-model="formInline.paymentAccount"-->
<!--                  style="width: 90%;padding-left: 5px"-->
<!--                  filterable-->
<!--                  remote-->
<!--                  :remote-method="remoteMethod2"-->
<!--                  label-in-value-->
<!--                  @on-change="getPayList"-->
<!--                  :disabled="modelType"-->
<!--                >-->
<!--                  <Option-->
<!--                    v-for="item in payUserList"-->
<!--                    :value="item.value"-->
<!--                    :key="item.value"-->
<!--                    >{{ item.label }}</Option-->
<!--                  >-->
<!--                </Select>-->
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem label="支付银行" style="margin-bottom: 0px">
                <Input
                  type="text"
                  v-model="formInline.paymentBank"
                  style="width: 90%;padding-left: 5px"
                  disabled
                ></Input>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem label="支付账号" style="margin-bottom: 0px">
                <Input
                  type="text"
                  v-model="formInline.paymentBankNo"
                  style="width: 90%;padding-left: 5px"
                  disabled
                ></Input>
              </FormItem>
            </Col>
          </Row>
        </div>

        <h5 class="mt20 mb10" style="font-size: 18px">凭证图片</h5>
        <upphoto
          @backUpImgList="getImgList"
          ref="upImg"
          :list="Pictures"
        ></upphoto>
        <flowbox :approvalTit="list" v-if="list.type == 4"></flowbox>
      </Form>
    </div>

    <!--    选择单据模态框-->
    <selectAdvanceApply
      ref="documnets"
      @backLists="otherPayList"
    ></selectAdvanceApply>
    <div slot="footer"></div>
  </Modal>
</template>

<script>
import index from "./index/AdvanceApply.js";
import { Prop } from 'vue-property-decorator';
export default index;
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
