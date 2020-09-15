<template>
  <Modal v-model="model" title="费用报销 申请单" width="1200px">
    <div class="bigbox">
      <div class="clearfix">
        <div class="fr">
          <Button class="mr10" :loading="saveDis" v-if="!modelType" @click="save(0)"
          >保存草稿
          </Button
          >
          <Button class="mr10" :loading="saveDis" v-noresub v-if="!modelType" @click="save(1)"
          >提交申请
          </Button
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
            }}
          </Col>
          <Col class="inner" span="4">申请时间</Col>
          <Col class="inner" span="4">{{ formInline.applyTime }}</Col>
        </Row>

        <div class="tableBox2 mt20">
          <div class="tableline tableright">
            <div class="applyTitle">请示单号</div>
            <a class="pl10">{{ formInline.requestInstructionNo || "" }}</a>
            <a class="fr" @click="openSelect" v-if="!modelType">选择</a>
          </div>
          <div class="tableright">
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
        </div>

        <h5 class="mt20 mb10" style="font-size: 18px">费用支出明细</h5>
        <vxe-table
          border
          resizable
          auto-resize
          ref="xTable"
          keep-source
          show-footer
          size="mini"
          show-overflow="title"
          align="center"
          height="200"
          :footer-method="footerMethod"
          :data="formInline.expenseDetails"
          :edit-rules="validRules"
          :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
          @edit-actived="editActivedEvent"
        >
          <vxe-table-column title="操作" width="80" v-if="!modelType">
            <template v-slot="item">
              <a v-if="item.seq != 1" @click="dele(item)">删除行</a>
              <a v-else @click="addRow">添加行</a>
            </template>
          </vxe-table-column>
          <vxe-table-column
            field="summary"
            title="摘要"
            :edit-render="{
              name: 'input',
              attrs: { type: 'text', disabled: false }
            }"
          ></vxe-table-column>
          <vxe-table-column
            field="expenseType"
            title="费用类型"
            :edit-render="{
              name: 'select',
              options: moneyTypeList,
              attrs: { disabled: false },
              optionProps: { value: 'itemCode', label: 'itemName' },
              events: { change: changeExpenseType }
            }"
          ></vxe-table-column>
          <vxe-table-column
            field="accountEntry"
            title="入账科目"
            :edit-render="{
              name: 'input',
              attrs: { disabled: false, placeholder: '选择会计科目' },
              events: { focus: getSubject }
            }"
          ></vxe-table-column>
          <vxe-table-column
            field="billTypeId"
            title="票据类型"
            :edit-render="{
              name: 'select',
              options: invoiceMap,
              attrs: { disabled: false },
              optionProps: { value: 'itemCode', label: 'itemName' },
              events: { change: changeExpenseType2 }
            }"
          ></vxe-table-column>
          <vxe-table-column
            field="totalAmt"
            title="价税合计"
            :edit-render="{
              name: 'input',
              attrs: { type: 'number' },
              events: { change: gettotal }
            }"
          ></vxe-table-column>
          <vxe-table-column
            field="taxRateCode"
            title="税率"
            :edit-render="{
              name: 'select',
              options: taxRate,
              attrs: { disabled: false },
              optionProps: { value: 'itemCode', label: 'itemName' },
              events: { change: getTax }
            }"
          ></vxe-table-column>
          <vxe-table-column
            field="taxAmt"
            title="税额"
            :edit-render="{
              name: 'input',
              attrs: { type: 'number', disabled: false},
              events: { change: taxCanuse }
            }"
          ></vxe-table-column>
          <vxe-table-column
            field="noTaxAmt"
            title="不含税金额"
            :edit-render="{
              name: 'input',
              attrs: { type: 'number', disabled: false }
            }"
          ></vxe-table-column>
          <vxe-table-column
            field="remark"
            title="备注"
            :edit-render="{
              name: 'input',
              attrs: { type: 'text', disabled: false }
            }"
            width="200"
          ></vxe-table-column>
        </vxe-table>

        <h5 class="mt20 mb10" style="font-size: 18px">借支核销</h5>
        <Button class="mb10" @click="SelectTheDocuments" v-if="!modelType"
        >选择单据
        </Button
        >
        <vxe-table
          class="mt10"
          border
          resizable
          auto-resize
          ref="documentTable"
          show-footer
          show-overflow
          keep-source
          size="mini"
          align="center"
          :footer-method="documentFooterMethod"
          :data="details"
          :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
          @edit-actived="editisDisabled"
        >
          <vxe-table-column title="操作" width="80" v-if="!modelType">
            <template v-slot="item">
              <a @click="deleteDetails(item)">删除行</a>
            </template>
          </vxe-table-column>
          <vxe-table-column
            field="serviceId"
            title="因公借支单号"
          ></vxe-table-column>
          <vxe-table-column
            field="applyAmt"
            title="借支金额"
          ></vxe-table-column>
          <vxe-table-column
            field="writeOffAmt"
            title="因公借支核销金额"
            :edit-render="{
              name: 'input',
              attrs: { type: 'number', disabled: false }
            }"
          ></vxe-table-column>
          <vxe-table-column
            field="borrowDate"
            title="借支日期"
          ></vxe-table-column>
          <vxe-table-column field="topic" title="主题"></vxe-table-column>
        </vxe-table>

        <div>
          <Row class="tableBox mt10">
            <Col span="6" class="businessbg">费用总额</Col>
            <Col span="6" class="businessbg">因公借支总金额</Col>
            <Col span="6" class="businessbg">公司应付</Col>
            <Col span="6" class="businessbg">个人应还</Col>
            <Col span="6" class="moneybd">{{ aggregateCosts }}</Col>
            <Col span="6" class="moneybd">{{ businessMoney }}</Col>
            <Col span="6" class="moneybd">{{ company }}</Col>
            <Col span="6" class="moneybd">{{ personage }}</Col>
          </Row>
        </div>

        <h5 class="mt20 mb10" style="font-size: 18px">收款人信息</h5>
        <div class="proceeds">
          <Checkbox v-model="formInline.accountType" class="ml10">是否搜索内部员工</Checkbox>
          <Row>
            <Col span="8">
              <FormItem
                label="收款人账户"
                prop="receiverId"
                style="margin-bottom: 0px"
              >
                <Select
                  v-model="formInline.receiverId"
                  filterable
                  remote
                  :remote-method="remoteMethod1"
                  :loading="loading1"
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
                />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="银行账号"
                prop="receiveBankNo"
                style="margin-bottom: 0px;border-right: none"
              >
                <Input
                  type="text"
                  :value="formInline.receiveBankNo"
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
                  :value="formInline.paymentBankNo"
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
    <!--    选择的模态框-->
    <requestCode ref="request" @backList="getBackList"></requestCode>

    <!--    入账科目模态框-->
    <subject
      ref="subjectModel"
      @backList="getsubBack"
      :subjet="subjectType"
    ></subject>

    <!--    选择因公模态框-->
    <selectTheDocuments
      ref="documnets"
      @backList="getBusinessList"
    ></selectTheDocuments>
    <div slot="footer"></div>
  </Modal>
</template>

<script>
  import index from "./index/ExpenseReimbursement.js";

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

  .businessbg {
    background-color: #f9f9f9;
    border-bottom: 1px #cccccc solid;
    border-right: 1px #cccccc solid;
  }

  .moneybd {
    border-right: 1px #cccccc solid;
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
