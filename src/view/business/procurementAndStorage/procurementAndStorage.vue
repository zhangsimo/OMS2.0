<template>
  <div style="height:100%" class="bigBox">
    <div class="headerBox">
      <span class="mr10">快速查询:</span>
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
        :disabled="formPlan.serviceId && formPlan.billStatusValue != 0"
      >
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
                  <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
                  <vxe-table-column field="billStatusName" title="状态"></vxe-table-column>
                  <vxe-table-column field="guestName" title="供应商"></vxe-table-column>
                  <vxe-table-column field="orderMan" title="采购员"></vxe-table-column>
                  <vxe-table-column field="serviceId" title="入库单号"></vxe-table-column>
                  <vxe-table-column field="createUname" title="创建人"></vxe-table-column>
                  <vxe-table-column field="createTime" title="创建日期"></vxe-table-column>
                  <vxe-table-column field="print" title="打印次数"></vxe-table-column>
                  <vxe-table-column field="finishDate" title="入库日期"></vxe-table-column>
                  <vxe-table-column field="orderMan" title="入库人"></vxe-table-column>
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
            <div style="height: 100%;">
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
                    <Row style="width: 310px">
                      <Select
                        v-model="formPlan.guestId"
                        filterable
                        style="width: 240px"
                        @on-change="changeClient"
                        :disabled="formPlan.billStatusValue != 0 || formPlan.code != '' || legtTableData.length!==0 ? legtTableData[0].guestId !== '':true"
                      >
                        <Option
                          v-for="item in client"
                          :value="item.id"
                          :key="item.id"
                        >{{ item.fullName }}</Option>
                      </Select>
                      <Button
                        class="ml5"
                        size="small"
                        type="default"
                        :disabled="formPlan.billStatusValue != 0 || formPlan.code != '' || legtTableData.length!==0 ? legtTableData[0].guestId !== '':true"
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
                      :disabled="formPlan.billStatusValue != 0"
                    />
                  </FormItem>
                  <FormItem label="订货日期：" prop="orderDate">
                    <DatePicker
                      type="datetime"
                      placeholder="选择日期"
                      format="yyyy-MM-dd HH:mm:ss"
                      v-model="formPlan.orderDate"
                      style="width: 200px"
                      :disabled="formPlan.billStatusValue != 0 || formPlan.code != ''"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="入库单号：">
                    <Input class="w160" v-model="formPlan.serviceId" disabled />
                  </FormItem>
                  <FormItem label="票据类型:" prop="billTypeId">
                    <Select
                      v-model="formPlan.billTypeId"
                      style="width:100px"
                      :disabled="formPlan.billStatusValue != 0 "
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
                      :disabled="formPlan.billStatusValue != 0"
                    >
                      <Option
                        v-for="item in settleTypeList.CS00106"
                        :value="item.itemCode"
                        :key="item.itemCode"
                      >{{ item.itemName }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="备注：">
                    <Input
                      style="width: 370px"
                      v-model="formPlan.remark"
                      :disabled="formPlan.billStatusValue != 0 || formPlan.code != '' || legtTableData.length!==0 ? legtTableData[0].guestId !== '':true"
                    />
                  </FormItem>
                  <FormItem label="往来单号：">
                    <Input class="w210" v-model="formPlan.code" disabled />
                  </FormItem>
                  <FormItem label="交货仓库：" prop="storeId">
                    <Select
                      v-model="formPlan.storeId"
                      style="width:200px"
                      :disabled="formPlan.billStatusValue != 0 || formPlan.code != '' || legtTableData.length!==0 ? legtTableData[0].guestId !== '':true"
                    >
                      <Option
                        v-for="item in WarehouseList"
                        :value="item.id"
                        :key="item.id"
                      >{{ item.name }}</Option>
                    </Select>
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
                <div class="tableBox">
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
                    showOverflow="true"
                    height="425"
                    @select-change="selectSameList"
                    @select-all="selectAllList"
                    :data="formPlan.details"
                    style="width: 2000px"
                    :edit-config="{trigger: 'click', mode: 'cell'}"
                  >
                    <vxe-table-column type="index" width="50" title="序号"></vxe-table-column>
                    <vxe-table-column type="checkbox" width="50"></vxe-table-column>
                    <vxe-table-column field="partCode" title="配件编码"></vxe-table-column>
                    <vxe-table-column field="partName" title="配件名称"></vxe-table-column>
                    <vxe-table-column field="partBrand" title="品牌"></vxe-table-column>
                    <vxe-table-column
                      field="orderQty"
                      title="数量"
                      :edit-render="{name: 'input',immediate: true,attrs: {disabled: formPlan.billStatusValue === 4}, events: {input: updateFooterEvent}}"
                    ></vxe-table-column>
                    <vxe-table-column
                      field="orderPrice"
                      title="单价"
                      :edit-render="{name: 'input',immediate: true,attrs: {disabled: formPlan.billStatusValue === 4}, events: {input: updateFooterEvent}}"
                    ></vxe-table-column>
                    <vxe-table-column title="金额">
                      <template v-slot="{ row }">
                        <span>{{ countAmount(row) | priceFilters }}</span>
                      </template>
                    </vxe-table-column>
                    <vxe-table-column field="sourceEnterableQty" title="可入库数量"></vxe-table-column>
                    <vxe-table-column
                      field="remark"
                      title="备注"
                      :edit-render="{name: 'input',immediate: true, events: {input: updateFooterEvent}}"
                    ></vxe-table-column>
                    <vxe-table-column title="不含税单价">
                      <template v-slot="{row}">
                        <span>{{countTaxRate(row) |priceFilters}}</span>
                      </template>
                    </vxe-table-column>
                    <vxe-table-column title="不含税金额">
                      <template v-slot="{row}">
                        <span>{{countTaxRateAll(row) |priceFilters}}</span>
                      </template>
                    </vxe-table-column>
                    <vxe-table-column field="carBrandName" title="品牌车型"></vxe-table-column>
                    <vxe-table-column field="unit" title="单位"></vxe-table-column>
                    <vxe-table-column field="oemCode" title="OE码"></vxe-table-column>
                    <vxe-table-column field="spec" title="规格"></vxe-table-column>
                    <!--                  <vxe-table-column field="name" title="已验收数量"></vxe-table-column>-->
                  </vxe-table>
                </div>
              </Form>
            </div>
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
        :serviceId="formPlan.serviceId"
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
  height: 100%;
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
.purchase >>> .ivu-form-item {
  margin-bottom: 10px;
}
</style>
