<template>
  <div style="height:100%" class="bigBox loadingClass">
    <div class="headerBox">
      <span>快速查询:</span>
      <quick-date class="ml5 mr10" v-on:quickDate="getDataQuick"></quick-date>
      <Select v-model="orderSign" style="width:100px" class="mr10" @on-change="selectTypetList">
        <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
      </Select>
      <Button type="default" @click="openQueryModal" class="mr10">
        <Icon type="ios-more"/>
        更多
      </Button>
      <Button type="default" class="mr10 w90" @click="addNew">
        <Icon type="md-add" size="14"/>
        新增
      </Button>
      <Button
        class="mr10 w90"
        @click="save"
      >
        <span class="center">
          <Icon custom="iconfont iconbaocunicon icons"/>保存
        </span>
      </Button>
      <Button
        class="mr10"
        @click="submit"
      >
        <i class="iconfont mr5 iconxuanzetichengchengyuanicon"></i>提交
      </Button>
      <Button class="mr10" @click="setPrint">
        <i class="iconfont mr5 icondayinicon"></i> 打印
      </Button>
      <Button type="default" class="mr10" @click="supplierExamie">查看供应商</Button>
    </div>
    <div class="conter">
      <div class="demo-split">
        <Split v-model="split1">
          <!--          左侧表格-->
          <div slot="left" class="demo-split-pane">
            <div>
              <div class="orderList">
                <h5>单据列表</h5>
              </div>
              <div class="orderCenter">
                <vxe-table
                  ref="xTab"
                  border
                  align="left"
                  size="mini"
                  @current-change="clickOnesList"
                  highlight-hover-row
                  highlight-current-row
                  style="width: 1000px"
                  height="593"
                  :data="leftTableData"
                  resizable
                >
                  <vxe-table-column show-overflow="tooltip" type="seq" title="序号" width="60"></vxe-table-column>
                  <vxe-table-column show-overflow="tooltip" field="orderSignStatus" title="状态"></vxe-table-column>
                  <vxe-table-column show-overflow="tooltip" field="handleSignStatus" title="供应商处理"></vxe-table-column>
                  <vxe-table-column show-overflow="tooltip" field="guestName" title="供应商"></vxe-table-column>
                  <vxe-table-column show-overflow="tooltip" field="serviceId" title="理赔单号"></vxe-table-column>
                  <vxe-table-column show-overflow="tooltip" field="createUname" title="创建人"></vxe-table-column>
                  <vxe-table-column show-overflow="tooltip" field="createTime" title="创建日期"></vxe-table-column>
                  <vxe-table-column show-overflow="tooltip" field="print" title="打印次数"></vxe-table-column>
                  <vxe-table-column show-overflow="tooltip" field="orderMen" title="提交人"></vxe-table-column>
                  <vxe-table-column show-overflow="tooltip" field="orderDate" title="提交日期"></vxe-table-column>
                </vxe-table>
              </div>
              <Page
                :total="leftPage.total"
                :page-size="leftPage.size"
                size="small"
                :current="leftPage.num"
                show-sizer
                show-total
                class-name="page-con"
                @on-change="selectNum"
                @on-page-size-change="selectPage"
                class="mr10"
                :page-size-opts="[ 50, 100, 200]"
              ></Page>
            </div>
          </div>
          <!--          右侧详情数据显示-->
          <div slot="right" class="demo-split-pane">
            <Form
              inline
              ref="formPlan"
              :model="formPlan"
              :rules="ruleValidate"
              :label-width="100"
            >
              <div class="clearfix purchase" ref="planForm">
                <FormItem label="供应商：" class="w300" prop="guestId">
                  <Row>
                    <Tooltip :content="formPlan.guestName">
                      <GoodCus style="width: 140px"
                               :title="formPlan.guestName"
                               placeholder="请输入供应商"
                               :search-value="formPlan.guestName"
                               @throwName="throwNameFun"
                               :disabled-prop="formPlan.orderSign&&formPlan.orderSign!=0"
                      >
                      </GoodCus>
                    </Tooltip>
                    <Button
                      class="ml5 w30"
                      size="small"
                      type="default"
                      @click="addSuppler"
                      :disabled="formPlan.orderSign&&formPlan.orderSign!=0"
                    >
                      <Icon type="md-checkmark"/>
                    </Button>
                  </Row>
                </FormItem>
                <FormItem label="理赔日期：" prop="afterSaleDate">
                  <DatePicker
                    type="date"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    v-model="formPlan.afterSaleDate"
                    :disabled="formPlan.orderSign&&formPlan.orderSign!=0"
                    style="width: 200px"
                  ></DatePicker>
                </FormItem>
                <FormItem label="备注：">
                  <Tooltip :content="formPlan.remark" placement="bottom" max-width="140">
                    <Input
                      style="width: 340px"
                      v-model="formPlan.remark"
                      :disabled="formPlan.orderSign&&formPlan.orderSign!=0"
                    />
                  </Tooltip>
                </FormItem>
                <FormItem label="理赔单号：">
                  <Tooltip :content="formPlan.serviceId">
                    <Input class="w200" v-model="formPlan.serviceId" disabled/>
                  </Tooltip>
                </FormItem>
                <FormItem label="手工单号：">
                  <Tooltip :content="formPlan.code">
                    <Input class="w200" v-model="formPlan.code" disabled/>
                  </Tooltip>
                </FormItem>
              </div>
              <div class="flex plan-cz-btn" ref="planBtn">
                <div class="clearfix pt5 pb5">
                  <div class="fl mb5">
                    <Button size="small" class="mr10" @click="addMountings"
                            :disabled="formPlan.orderSign&&formPlan.orderSign!=0 || formPlan.partOrCustomerOnly==2">
                      <Icon type="md-add"/>
                      添加配件
                    </Button>
                  </div>
                  <div class="fl mb5">
                    <Button
                      @click="delect"
                      size="small"
                      class="mr10"
                      :disabled="formPlan.orderSign&&formPlan.orderSign!=0"
                    >
                      <i class="iconfont mr5 iconlajitongicon"></i> 删除配件
                    </Button>
                  </div>
                  <div class="fl mb5">
                    <Upload
                      ref="upload"
                      style="display: inline-block"
                      :show-upload-list="false"
                      :action="upurl"
                      :headers="headers"
                      :format="['xlsx','xls']"
                      :on-format-error="onFormatError"
                      :on-success="onSuccess"
                      :before-upload='beforeUpload'
                      :disabled="formPlan.orderSign&&formPlan.orderSign!=0"
                    >
                      <Button size="small" class="mr10" :disabled="formPlan.billStatusValue != 0 "
                              type="default" @click="getRUl"><i class="iconfont icondaoruicon icons"/> 导入配件
                      </Button>
                    </Upload>
                  </div>
                  <div class="fl mb5">
                    <Button type="default" @click="openCustomer" size="small"
                            :disabled="formPlan.orderSign&&formPlan.orderSign!=0 || formPlan.partOrCustomerOnly==1">
                      选择客户理赔登记单
                    </Button>
                  </div>
                </div>
              </div>
              <vxe-table
                border
                align="left"
                size="mini"
                resizable
                stripe
                highlight-current-row
                highlight-hover-row
                ref="xTable"
                show-overflow="tooltip"
                show-footer
                :footer-method="footerMethod"
                :edit-rules="validRules"
                @select-change="selectSameList"
                @select-all="selectAllList"
                @current-change="logDataMethod"
                :data="formPlan.details"
                class="ml15"
                :edit-config="{trigger: 'click', mode: 'cell',method:updateFooterEvent}"
              >
                <vxe-table-column type="seq" width="50" title="序号"></vxe-table-column>
                <vxe-table-column type="checkbox" width="50"></vxe-table-column>
                <vxe-table-column field="partInnerId" title="配件内码" width="100"></vxe-table-column>
                <vxe-table-column field="partCode" title="配件编码" width="100"></vxe-table-column>
                <vxe-table-column field="partName" title="配件名称" width="100"></vxe-table-column>
                <vxe-table-column field="partBrand" title="品牌" width="100"></vxe-table-column>
                <vxe-table-column field="afterSaleQty" title="理赔数量" width="100">
                  <template v-slot="{ row }">
                    <vxe-input
                      type="number"
                      :max="row.isAddPart!=0?row.untreatedQty:100000000000"
                      :min="1"
                      v-model="row.afterSaleQty"
                      :controls="false"
                      :precision="0"
                      @change="afterSaleQtyChange(row)"
                      size="mini"
                    />
                  </template>
                </vxe-table-column>
                <vxe-table-column field="afterSaleReason" title="理赔原因" width="100">
                  <template v-slot="{ row }">
                    <vxe-input
                      v-model="row.afterSaleReason"
                      :controls="false"
                      size="mini"
                    />
                  </template>
                </vxe-table-column>
                <vxe-table-column field="claimDemageCode" title="索赔编号" width="100">
                  <template v-slot="{ row }">
                    <vxe-input
                      v-model="row.claimDemageCode"
                      :controls="false"
                      size="mini"
                    />
                  </template>
                </vxe-table-column>
                <vxe-table-column field="processedQty" title="已处理数量" width="100"></vxe-table-column>
                <vxe-table-column field="untreatedQty" title="未处理数量" width="100"></vxe-table-column>
                <vxe-table-column field="oemCode" title="OEM码" width="100"></vxe-table-column>
                <vxe-table-column field="spec" title="规格" width="100"></vxe-table-column>
                <vxe-table-column field="carBrandName" title="厂牌" width="100"></vxe-table-column>
                <vxe-table-column field="unit" title="单位" width="100"></vxe-table-column>
                <vxe-table-column field="direction" title="方向" width="100"></vxe-table-column>
              </vxe-table>
              <div class="ml15" v-show="!addNewBool">处理日志</div>
              <vxe-table
                border
                auto-resize
                resizable
                size="mini"
                align="left"
                :data="logData"
                :loading="logDataLoading"
                show-overflow="title"
                class="ml15"
                stripe
                v-show="!addNewBool"
              >
                <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
                <vxe-table-column title="操作日期" field="createTime" width="100"></vxe-table-column>
                <vxe-table-column title="方向" field="direction" width="60"></vxe-table-column>
                <vxe-table-column title="往来单位名称" field="guestName" width="120"></vxe-table-column>
                <vxe-table-column title="处理类型" field="recordTypeStatus" width="60"></vxe-table-column>
                <vxe-table-column title="数量" field="recordQty" width="40"></vxe-table-column>
                <vxe-table-column title="操作人" field="createUname" width="60"></vxe-table-column>
                <vxe-table-column title="处理单号" field="afterSaleCode"></vxe-table-column>
                <vxe-table-column title="备注" field="remark"></vxe-table-column>
                <vxe-table-column title="返回单号" field="returnCode"></vxe-table-column>
              </vxe-table>
            </Form>
          </div>
        </Split>
      </div>
      <!--        更多搜索-->
      <More-query ref="morequeryModal" @getSureQuery="moreQuery" :data="moreQueryList"></More-query>

      <select-part-com ref="selectPartCom" :formPlanmain="formPlan" @selectPartName="getPartNameList"
                       :is-show-add-part-btn="true" :noDBclick="true"></select-part-com>

      <!--打印弹框-->
      <printZF ref="printZF" style="display: none"></printZF>
      <!--选择供应商-->
      <select-supplier
        ref="selectSupplier"
        header-tit="供应商资料"
        @selectSupplierName="getSupplierName"
      ></select-supplier>
      <!--查看供应商-->
      <Modal
        v-model="clientDataShow"
        title="供应商资料"
        @on-visible-change="supplierExamie"
        width="700"
        height="2100"
      >
        <supplierExamie
          :data="supplierData.clientList"
          :provincearr="provinceArr"
          :treelist="treeList"
          :dis="supplierData.nameChange"
          ref="child"
        ></supplierExamie>
        <div slot="footer">
          <Button @click="clientDataShow=false">关闭</Button>
        </div>
      </Modal>
      <!--选择客户理赔登记单-->
      <customerClaim ref="customerClaim"></customerClaim>
    </div>
  </div>
</template>


<script src="./index.js">
</script>

<style scoped lang="less">
  .headerBox {
    border-bottom: 1px #e0e0e0 solid;
    padding-left: 10px;
    padding-bottom: 16px;
    padding-top: 16px;
  }

  .demo-split {
    height: 100%;
    border: 1px solid #dcdee2;
  }

  .conter {
    height: calc(~"100% - 63px");
    width: 100%;
    padding: 10px;
  }

  .bigBox {
    background-color: #fff;
  }

  .demo-split[data-v-4dd5fe70] {
    height: 93%;
  }

  .orderList {
    line-height: 30px;
    padding-left: 10px;
    /*border-bottom: 1px solid #dcdee2;*/
    background-color: #f8f8f8;
  }

  .orderCenter {
    overflow: hidden;
    overflow-x: scroll;
  }

  .purchase {
    padding-top: 10px;
    padding-left: 10px;
    border-bottom: 1px #e8eaec solid;
  }

  .pane-made-hd {
    line-height: 30px;
    border-bottom: 1px #e8eaec solid;
    background-color: #f8f8f8;
    padding-left: 15px;
  }

  .plan-cz-btn {
    justify-content: space-between;
    padding: 10px 15px 10px;
    align-items: center;
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .tableBox {
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-x: scroll;
  }
</style>
<style scoped>
  .purchase .ivu-form-item {
    margin-bottom: 0px;
  }
</style>
