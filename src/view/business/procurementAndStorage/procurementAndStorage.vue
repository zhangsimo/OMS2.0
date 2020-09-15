<template>
  <div style="height:100%" class="bigBox loadingClass">
    <div class="headerBox">
      <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>
      <Select v-model="orderType" style="width:100px" class="mr10" @on-change="selectTypetList">
        <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
      </Select>
      <Button type="default" @click="openQueryModal" class="mr10">
        <Icon type="ios-more" />更多
      </Button>
      <Button type="default" class="mr10 w90" @click="addNew" v-has="'add'">
        <Icon type="md-add" size="14" />新增
      </Button>
      <Button
        class="mr10 w90"
        @click="save"
        :disabled="formPlan.billStatusValue != 0"
        v-has="'save'"
        :loading="saveLoading"
      >
        <span class="center">
          <Icon custom="iconfont iconbaocunicon icons" />保存
        </span>
      </Button>
      <Button
        class="mr10"
        @click="godown"
        :disabled="formPlan.billStatusValue != 0"
        v-has="'godown'"
        :loading="goDownLoading"
      >
        <i class="iconfont mr5 iconxuanzetichengchengyuanicon"></i>入库
      </Button>
      <Button
        class="mr10"
        :disabled="formPlan.billStatusValue != 0 || !formPlan.hasOwnProperty('guestId')"
        @click="selectPlan"
        v-has="'selectPlan'"
      >选择采购订单</Button>
      <Button class="mr10" @click="setPrint" v-has="'print'">
        <i class="iconfont mr5 icondayinicon"></i> 打印
      </Button>
      <Button
        class="mr10"
        @click="showFee"
        v-has="'showFee'"
        :disabled="!formPlan.serviceId"
      >
      <!--formPlan.serviceId && formPlan.billStatusValue != 0-->
        <i class="iconfont mr5 iconshenheicon" /> 登记费用
      </Button>
    </div>
    <div class="conter">
      <div class="demo-split">
        <Split v-model="split1">
          <!--          左侧表格-->
          <div slot="left" class="demo-split-pane">
            <div>
              <div class="orderList">
                <h5>采购入库列表</h5>
              </div>
              <div class="orderCenter">
                <vxe-table
                  ref="xTab"
                  border
                  align="center"
                  size="mini"
                  @current-change="clickOnesList"
                  highlight-hover-row
                  highlight-current-row
                  style="width: 1000px"
                  height="593"
                  :data="legtTableData"
                >
                  <vxe-table-column  show-overflow="tooltip" type="seq" title="序号" width="60"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="billStatusName" title="状态"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="guestName" title="供应商"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="orderMan" title="采购员"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="serviceId" title="入库单号"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="createUname" title="创建人"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="createTime" title="创建日期"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="print" title="打印次数"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="finishDate" title="入库日期"></vxe-table-column>
                  <vxe-table-column  show-overflow="tooltip" field="orderMan" title="入库人"></vxe-table-column>
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
                :page-size-opts="[20, 50, 100, 200]"
              ></Page>
            </div>
          </div>
          <!--          右侧详情数据显示-->
          <div slot="right" class="demo-split-pane">
<!--            <div style="height: 100%;">-->
              <Form
                inline
                ref="formPlan"
                :model="formPlan"
                :rules="ruleValidate"
                :label-width="100"
              >
                <div class="pane-made-hd">
                  <span class="titler mr5">本年采购总额:</span>
                  <span class="titler mr10">{{ allMoney |priceFilters}}</span>
                </div>
                <div class="clearfix purchase" ref="planForm">
                  <FormItem label="供应商：" prop="guestId">
                    <Row>
                      <Tooltip :content="formPlan.guestName">
                      <Input placeholder="请选择供应商" v-model="formPlan.guestName" readonly disabled style="width:200px;" />
                      </Tooltip>
                      <!-- <Select
                        v-model="formPlan.guestId"
                        filterable
                        style="width: 240px"
                        @on-change="changeClient"
                        disabled
                      >
                        <Option
                          v-for="item in client"
                          :value="item.id"
                          :key="item.id"
                        >{{ item.fullName }}</Option>
                      </Select> -->
                      <Button
                        class="ml5"
                        size="small"
                        type="default"
                        disabled
                        @click="addSuppler"
                      >
                        <Icon type="md-checkmark" />
                      </Button>
                    </Row>
                  </FormItem>
                  <FormItem label="采购员：" prop="orderMan">
                    <Input
                      class="w160"
                      v-model="formPlan.orderMan"
                      disabled
                    />
                  </FormItem>
                  <FormItem label="订货日期：" prop="orderDate">
                    <DatePicker
                      type="datetime"
                      placeholder="选择日期"
                      format="yyyy-MM-dd HH:mm:ss"
                      v-model="formPlan.orderDate"
                      style="width: 200px"
                      disabled
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="入库仓库：" prop="storeId">
                    <Select
                      v-model="formPlan.storeId"
                      style="width:180px"
                      disabled
                    >
                      <Option
                        v-for="item in WarehouseList"
                        :disabled="item.isDisabled"
                        :value="item.id"
                        :key="item.id"
                      >{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="入库单号：">
                    <Tooltip :content="formPlan.serviceId">
                    <Input class="w230 mr5" v-model="formPlan.serviceId" disabled />
                    </Tooltip>
                  </FormItem>
                  <FormItem label="票据类型:" prop="billTypeId">
                    <Select
                      v-model="formPlan.billTypeId"
                      style="width:100px"
                      disabled
                    >
                      <Option
                        v-for="item in settleTypeList.CS00107"
                        :value="item.itemCode"
                        :key="item.itemCode"
                      >{{ item.itemName }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="结算方式：" prop="settleTypeId">
                    <Select
                      v-model="formPlan.settleTypeId"
                      style="width:100px"
                      disabled
                    >
                      <Option
                        v-for="item in settleTypeList.CS00106"
                        :value="item.itemCode"
                        :key="item.itemCode"
                      >{{ item.itemName }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="备注：">
                    <Tooltip :content="formPlan.remark">
                    <Input
                      style="width: 340px"
                      v-model="formPlan.remark"
                      disabled
                    />
                    </Tooltip>
                  </FormItem>
                  <FormItem label="往来单号：">
                    <Tooltip :content="formPlan.code">
                    <Input class="w230" v-model="formPlan.code" disabled />
                    </Tooltip>
                  </FormItem>
                </div>
                <div class="flex plan-cz-btn" ref="planBtn">
                  <div class="clearfix pt5 pb5">
                    <!-- <div class="fl mb5">
                    <Button :disabled="formPlan.billStatusValue != 0 ? true : formPlan.code ? true : false" size="small" class="mr10" v-has="'addMountings'" @click="addMountings">
                      <Icon type="md-add"/>
                      添加配件
                    </Button>
                    </div>-->
                    <div class="fl mb5">
                      <Button
                        @click="delect"
                        :disabled="formPlan.billStatusValue != 0"
                        v-has="'delete'"
                        size="small"
                        class="mr10"
                      >
                        <i class="iconfont mr5 iconlajitongicon"></i> 删除配件
                      </Button>
                    </div>
                    <!-- <div class="fl mb5">
                    <Upload
                      ref="upload"
                      style="display: inline-block"
                      :show-upload-list="false"
                      :action="upurl"
                      :headers="headers"
                      :format="['xlsx','xls']"
                      :on-format-error="onFormatError"
                      :on-success="onSuccess"
                      :before-upload ='beforeUpload'
                    >
                      <Button size="small"  class="mr10" :disabled="formPlan.billStatusValue != 0 " v-has="'export'" type="default"  @click="getRUl"> <i class="iconfont icondaoruicon icons" /> 导入配件</Button>
                    </Upload>
                    </div>-->
                  </div>
                </div>
<!--                <div class="tableBox">-->
                  <vxe-table
                    border
                    align="center"
                    size="mini"
                    resizable
                    stripe
                    ref="xTable"
                    show-footer
                    :footer-method="footerMethod"
                    :edit-rules="validRules"
                    height="425"
                    @select-change="selectSameList"
                    @select-all="selectAllList"
                    :data="formPlan.details"
                    :edit-config="{trigger: 'click', mode: 'cell'}"
                  >
                    <vxe-table-column  show-overflow="tooltip" type="seq" width="50" title="序号" fixed="left"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" type="checkbox" width="50" fixed="left"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" field="partCode" title="配件编码" fixed="left" width="100"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" field="partName" title="配件名称" fixed="left" width="100"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" field="partBrand" title="品牌" fixed="left" width="100"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip"
                      field="orderQty"
                      width="100"
                      title="数量"
                      :edit-render="{name: 'input',immediate: true,attrs: {disabled: billStatusValue != 0}, events: {input: updateFooterEvent}}"
                    ></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip"
                      field="orderPrice"
                      title="单价"
                      width="100"
                    ></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" title="金额" width="100">
                      <template v-slot="{ row }">
                        <span>{{ countAmount(row) | priceFilters }}</span>
                      </template>
                    </vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" field="sourceEnterableQty" title="可入库数量" width="100"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip"
                      field="remark"
                      title="备注"
                      width="160"
                      :edit-render="{name: 'input',immediate: true, events: {input: updateFooterEvent}}"
                    ></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip"
                      field="storeShelf"
                      title="仓位"
                      width="100"
                      :edit-render="{name: 'input',immediate: true, events: {blur: checkSelf}}"
                    ></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" title="不含税单价" width="100">
                      <template v-slot="{row}">
                        <span>{{countTaxRate(row) |priceFilters}}</span>
                      </template>
                    </vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" title="不含税金额" width="100">
                      <template v-slot="{row}">
                        <span>{{countTaxRateAll(row) |priceFilters}}</span>
                      </template>
                    </vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" field="carBrandName" title="品牌车型" width="100"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" field="unit" title="单位" width="100"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" field="oemCode" title="OE码" width="100"></vxe-table-column>
                    <vxe-table-column  show-overflow="tooltip" field="spec" title="规格" width="100"></vxe-table-column>
                    <!--                  <vxe-table-column  show-overflow="tooltip" field="name" title="已验收数量"></vxe-table-column>-->
                  </vxe-table>
<!--                </div>-->
              </Form>
<!--            </div>-->
          </div>
        </Split>
      </div>
      <!--        更多搜索-->
      <More-query ref="morequeryModal" @getSureQuery="moreQuery" :data="moreQueryList"></More-query>
      <!--        打印-->
      <Print-show ref="printBox" :data="formPlan"></Print-show>
      <!--      添加配件-->
      <select-part-com ref="selectPartCom" @selectPartName="getPartNameList"></select-part-com>
      <!--      费用登记-->
      <fee-registration
        ref="feeRegistration"
        :state="selectRowState"
        :serviceId="formPlan.code"
      ></fee-registration>
      <!-- 选择采购计划单 -->
      <procurement-modal
        ref="procurementModal"
        :guestId="formPlan.guestId"
        :clientList="client"
        @getPlanOrder="getPlanOrder"
      ></procurement-modal>
      <!--选择供应商-->
      <select-supplier
        ref="selectSupplier"
        header-tit="供应商资料"
        @selectSupplierName="getSupplierName"
      ></select-supplier>
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
.purchase  .ivu-form-item {
  margin-bottom: 0px;
}
</style>
