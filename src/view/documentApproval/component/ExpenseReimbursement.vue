<template>
  <Modal
    v-model="model"
    title="费用报销 申请单"
    width="1000px"
    >
    <div class="bigbox">
   <div class="clearfix">
     <div class="fr">
       <Button class="mr10" v-if="modelType != 3" >保存草稿</Button>
       <Button class="mr10" v-if="modelType != 3" >提交申请</Button>
       <Button class="mr10" @click="model =false" v-if="modelType != 3" >取消</Button>
     </div>
   </div>
    <Form ref="formInline" :model="formInline" :label-width="100"  :rules="ruleValidate">
      <div class="mb10">
      <span class="mr5">申请单号：</span>
        <Input type="text" v-model="formInline.user" style="width: 200px" disabled="">
        </Input>
      </div>
      <Row class="tableBox">
        <Col class="inner" span="4">申请人</Col>
        <Col class="inner" span="4">{{formInline.staffName || ''}}</Col>
        <Col class="inner" span="4">部门名称</Col>
        <Col class="inner" span="4">{{formInline.tenantCompanyName || ' '}}</Col>
        <Col class="inner" span="4">门店店号</Col>
        <Col class="inner" span="4">{{formInline.shopCode || ' '}}</Col>
      </Row>
      <Row class="tableBox twoTable">
        <Col class="inner" span="4">门店名称</Col>
        <Col class="inner" span="4">{{formInline.shopName || ' '}}</Col>
        <Col class="inner" span="4">申请类型</Col>
        <Col class="inner" span="4">{{formInline.type || ' '}}</Col>
        <Col class="inner" span="4">申请时间</Col>
        <Col class="inner" span="4">{{formInline.date}}</Col>
      </Row>

      <div class="tableBox2 mt20">
        <div class="tableline tableright">
          <div class="applyTitle">请示单号</div>
          <a>{{formInline.code || ''}}</a>
          <a class="fr" @click="openSelect" v-if="modelType != 3">选择</a>
        </div>
        <div class="tableright">
          <FormItem label="主题" style="margin-bottom: 0px" prop="use">
            <Input type="text"  v-model="formInline.use" style="width: 100%" :disabled="modelType == 3">
            </Input>
          </FormItem>
        </div>
      </div>

      <h5 class="mt20 mb10" style="font-size: 18px">费用支出明显</h5>
      <vxe-table
        border
        resizable
        auto-resize
        ref="xTable"
        show-footer
        show-overflow
        size="mine"
        align="center"
        :footer-method="footerMethod"
        :data="expenditureTableData"
        :edit-rules="validRules"
        :edit-config="{trigger: 'click', mode: 'cell' , showStatus: true}"
        @edit-actived="editActivedEvent"
        >
        <vxe-table-column title="操作" width="80">
          <template v-slot="item">
            <a v-if="item.seq != item.data.length" @click="dele(item)">删除行</a>
            <a v-else @click="addRow">添加行</a>
          </template>
        </vxe-table-column>
        <vxe-table-column field="name" title="摘要" :edit-render="{name: 'input', attrs: {type: 'text',disabled: false}}"></vxe-table-column>
        <vxe-table-column field="sex" title="费用类型" :edit-render="{name: 'select', options: moneyTypeList , attrs: {disabled: false},optionProps: {value: 'id', label: 'name'}}"></vxe-table-column>
        <vxe-table-column field="subjectType" title="入账科目" :edit-render="{name: 'input',attrs: {disabled: false},events: {focus: getSubject}}"></vxe-table-column>
        <vxe-table-column field="num" title="价税合计" :edit-render="{name: 'input', attrs: {type: 'number'},events: {change: gettotal}}"></vxe-table-column>
        <vxe-table-column field="tax" title="税率" :edit-render="{name: 'select', options: taxRate ,attrs: {disabled: false}, optionProps: {value: 'id', label: 'name'},events: {change: getTax}}"></vxe-table-column>
        <vxe-table-column field="taxmoney" title="税额" :edit-render="{name: 'input', attrs: {type: 'number',disabled: false},events: {change: taxCanuse}}"></vxe-table-column>
        <vxe-table-column field="notax" title="不含税金额" :edit-render="{name: 'input', attrs: {type: 'number',disabled: false}}"></vxe-table-column>
        <vxe-table-column field="fd" title="备注" :edit-render="{name: 'input', attrs: {type: 'text',disabled: false}}" width="200"></vxe-table-column>
      </vxe-table>

      <h5 class="mt20 mb10" style="font-size: 18px">借支核销</h5>
      <Button class="mb10" @click="SelectTheDocuments">选择单据</Button>
      <vxe-table
        class="mt10"
        border
        resizable
        auto-resize
        ref="documentTable"
        show-footer
        show-overflow
        size="mine"
        align="center"
        :footer-method="documentFooterMethod"
        :data="documentTableData"
        :edit-rules="validRules"
        :edit-config="{trigger: 'click', mode: 'cell' , showStatus: true}"
      >
        <vxe-table-column title="操作" width="80">
          <template v-slot="item">
            <a >删除行</a>
          </template>
        </vxe-table-column>
        <vxe-table-column field="name" title="因公借支单号"></vxe-table-column>
        <vxe-table-column field="name" title="借支金额"></vxe-table-column>
        <vxe-table-column field="money" title="因公借支核销金额" :edit-render="{name: 'input', attrs: {type: 'number'}}"></vxe-table-column>
        <vxe-table-column field="name" title="借支日期"></vxe-table-column>
        <vxe-table-column field="name" title="主题"></vxe-table-column>
      </vxe-table>
      <vxe-table
        class="mt10"
        border
        resizable
        show-footer
        auto-resize
        show-overflow
        size="mine"
        align="center"
        :data="moneyTableData"
      >
        <vxe-table-column field="name" title="费用总额"></vxe-table-column>
        <vxe-table-column field="name" title="因公借支总金额"></vxe-table-column>
        <vxe-table-column field="money" title="公司应付"></vxe-table-column>
        <vxe-table-column field="name" title="个人应还"></vxe-table-column>
      </vxe-table>


      <h5 class="mt20 mb10" style="font-size: 18px">收款人信息</h5>
      <div class="proceeds">
        <Row>
          <Col span="8">
            <FormItem label="收款人姓名" prop="payee" style="margin-bottom: 0px">
              <Select v-model="formInline.payee" filterable style="width: 90%;padding-left: 5px" :disabled="modelType == 3">
                <Option v-for="item in payeeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="开户行名称" prop="bankName" style="margin-bottom: 0px">
              <Input type="text" v-model="formInline.bankName" style="width: 90%;padding-left: 5px"  :disabled="modelType == 3"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="银行账号" prop="BankNo" style="margin-bottom: 0px;border-right: none">
              <Input type="text" v-model="formInline.BankNo" style="width: 90%;padding-left: 5px" :disabled="modelType == 3"></Input>
            </FormItem>
          </Col>
        </Row>
      </div>


      <h5 class="mt20 mb10" style="font-size: 18px">支付信息</h5>
      <div class="proceeds">
        <Row>
          <Col span="12">
            <FormItem label="支付门店"  style="margin-bottom: 0px">
              <Input type="text" v-model="formInline.bankName" style="width: 90%;padding-left: 5px" disabled></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="付款账户" prop="bankName" style="margin-bottom: 0px">
              <Input type="text" v-model="formInline.bankName" style="width: 90%;padding-left: 5px" :disabled="modelType == 3"></Input>
            </FormItem>
          </Col>
        </Row>
      </div>


      <h5 class="mt20 mb10" style="font-size: 18px">凭证图片</h5>
      <upphoto @backUpImgList="getImgList" ref="upImg"></upphoto>
    </Form>
    </div>
<!--    选择的模态框-->
    <requestCode ref="request" @backList = 'getBackList'></requestCode>

<!--    入账科目模态框-->
    <subject ref="subjectModel" @backList="getsubBack" :subjet="moneyType"></subject>

<!--    选择单据模态框-->
    <selectTheDocuments ref="documnets"></selectTheDocuments>
    <div slot='footer'></div>
  </Modal>
</template>

<script>
 import index from './index/ExpenseReimbursement.js'
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
