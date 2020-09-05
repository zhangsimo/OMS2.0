<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf wlf-center">
          <div class="db">
            <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>
          </div>
          <div class="db">
            <Select
              @on-change="changeState"
              v-model="purchaseType"
              class="w90 mr10"
            >
              <Option
                v-for="(item, index) in purchaseTypeArr"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </div>
          <div class="db">
            <Button type="default" @click="showModel('moreSearch')" class="mr10"
              ><Icon type="ios-more" />更多</Button
            >
          </div>
          <div class="db">
            <Button class="mr10" @click="addPro"
            v-has="'add'"
              ><Icon type="md-add" /> 新增</Button
            >
          </div>
          <div class="db">
            <Button
              type="default"
              @click="saveHandle('formplanref')"
              class="mr10"
              :disabled="isInput"
              v-has="'save'"
              :loading='saveLoading'
              v-noresub
              ><i class="iconfont mr5 iconbaocunicon"></i>保存</Button
            >
          </div>
          <div class="db">
            <Button
              class="mr10"
              @click="submit('formplanref')"
              :disabled="isInput"
              v-has="'submit'"
              :loading='commitLoading'
              v-noresub
              ><i class="iconfont mr5 iconziyuan2"></i>提交</Button
            >
          </div>
          <div class="db">
            <Button @click="print" class="mr10" :disabled="selectTableRow === null"
            v-has="'print'"
              ><i class="iconfont mr5 icondayinicon"></i> 打印</Button
            >
          </div>
          <div class="db">
            <Button @click="abandoned" class="mr10" :disabled="!selectTableRow || selectTableRow.billStatusId.name != '草稿'"
            v-has="'invalidate'"
              ><Icon type="md-close" size="14" /> 作废</Button
            >
          </div>
          <div class="db">
            <Button @click="showFee" class="mr10"
            v-has="'reg'"
              ><i class="iconfont mr5 iconshenheicon"></i> 费用登记</Button
            >
          </div>
          <div class="db">
            <div class="mt5"><Checkbox v-model="showSelf" @on-change="showOwen">显示个人单据</Checkbox></div>
          </div>
          <!-- <div class="db"><span>本年采购总金额：200000.00元</span></div> -->
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <div class="con-split" ref="paneLeft">
          <Split v-model="split1" min="200" max="500" @on-moving="getDomHeight">
            <div
              slot="left"
              class="con-split-pane-left"
              style="overflow-y: auto; height: 100%;"
            >
              <div class="pane-made-hd">
                采购订单列表
              </div>
              <Table
                :height="leftTableHeight"
                @on-current-change="selectTabelData"
                size="small"
                highlight-row
                border
                :stripe="true"
                :loading="purchaseOrderTable.loading"
                :columns="purchaseOrderTable.columns"
                :data="purchaseOrderTable.tbdata"
                ref="currentRowTable"
              ></Table>
              <Page
                class-name="fl pt10"
                size="small"
                :current="purchaseOrderTable.page.num"
                :total="purchaseOrderTable.page.total"
                :page-size="purchaseOrderTable.page.size"
                @on-change="purchaseOrderTableChangePage"
                @on-page-size-change="purchaseOrderTableChangeSize"
                show-sizer
                show-total
              >
              </Page>
            </div>
            <div slot="right" class="con-split-pane-right pl5 goods-list-form">
              <div class="pane-made-hd">
                采购订单信息
              </div>
              <div class="clearfix purchase" ref="planForm">
                <Form
                  inline
                  ref="formplanref"
                  :model="formPlanmain"
                  :rules="ruleValidate"
                  :label-width="106"
                  :show-message="true"
                >
                  <FormItem class="form-Item" label="供应商：" prop="guestName">
                    <Row class="w160">
                      <Col span="19"
                        >
                        <Tooltip :content="formPlanmain.guestName">
                        <!-- <Input
                          v-model="formPlanmain.guestName"
                          placeholder="请选择供应商"
                          :disabled="isInput"
                          readonly
                        /> -->
                          <GoodCus style="width: 120px"
                            :title="formPlanmain.guestName"
                            placeholder="请输入供应商"
                            :search-value="formPlanmain.guestName"
                            @throwName="throwNameFun"
                            :disabled-prop="isInput">
                          </GoodCus>
                        </Tooltip>
                      </Col>
                      <Col span="5"
                        ><Button
                          @click="showModel('selectSupplier')"
                          class="ml5"
                          size="small"
                          type="default"
                          :disabled="isInput"
                          v-has="'supplier'"
                          ><i
                            class="iconfont iconxuanzetichengchengyuanicon"
                          ></i></Button
                      ></Col>
                    </Row>
                  </FormItem>
                  <FormItem class="form-Item" label="采购员：" prop="orderManId">
                    <Select v-model="formPlanmain.orderManId"
                      class="w160"
                      :disabled="isInput"
                      label-in-value
                      @on-change="selectOrderMan"
                      filterable
                    >
                      <Option v-for="item in salesList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem
                    class="form-Item"
                    label="票据类型："
                    prop="billTypeId"
                  >
                    <Select
                      class="w160"
                      v-model="formPlanmain.billTypeId"
                      :disabled="isInput"
                    >
                      <Option
                        v-for="(item, index) in pjTypes"
                        :key="index"
                        :value="item.value"
                        >{{ item.label }}</Option
                      >
                    </Select>
                  </FormItem>
                  <FormItem
                    class="form-Item"
                    label="结算方式："
                    prop="settleTypeId"
                  >
                    <Select
                      class="w160"
                      v-model="formPlanmain.settleTypeId"
                      :disabled="isInput"
                    >
                      <Option
                        v-for="(item, index) in settleMethods"
                        :key="index"
                        :value="item.value"
                        >{{ item.label }}</Option
                      >
                    </Select>
                  </FormItem>
                  <FormItem class="form-Item" label="入库仓：" prop="storeId">
                    <Select
                      class="w160"
                      v-model="formPlanmain.storeId"
                      :disabled="isInput"
                    >
                      <Option
                        v-for="(item, index) in inStores"
                        :key="index"
                        :value="item.value"
                        >{{ item.label }}</Option
                      >
                    </Select>
                  </FormItem>
                  <FormItem
                    class="form-Item"
                    label="订货日期："
                    prop="orderDate"
                  >
                    <DatePicker
                      style="width: 160px"
                      type="date"
                      placeholder="请选择订货日期"
                      v-model="formPlanmain.orderDate"
                      :disabled="isInput"
                    ></DatePicker>
                  </FormItem>
                  <FormItem class="form-Item" label="预计到货日期：">
                    <DatePicker
                      style="width: 160px"
                      type="date"
                      placeholder="请选择预计到货日期"
                      v-model="formPlanmain.planArriveDate"
                      :disabled="isInput"
                      :options="options2"
                    ></DatePicker>
                  </FormItem>
                  <FormItem class="form-Item" label="备注：">
                    <Tooltip :content="formPlanmain.remark">
                    <Input
                      placeholder="请输入备注"
                      class="w160"
                      v-model="formPlanmain.remark"
                      :disabled="isInput"
                      maxlength="100"
                    />
                    </Tooltip>
                  </FormItem>
                  <FormItem class="form-Item" label="直发门店：">
                    <Select
                      class="w160"
                      v-model="formPlanmain.directCompanyId"
                      :disabled="isInput||isDirectCompanyId"
                      clearable
                    >
                      <Option
                        v-for="(item, index) in putStores"
                        :key="index"
                        :value="item.value"
                        v-show="item.value!=$store.state.user.userData.shopId"
                        >{{ item.label }}</Option
                      >
                    </Select>
                  </FormItem>
                  <FormItem class="form-Item" label="订单号：">
                    <Tooltip :content="formPlanmain.serviceId">
                    <Input
                      placeholder=""
                      class="w160"
                      v-model="formPlanmain.serviceId"
                      :disabled="isInput"
                      readonly
                    />
                    </Tooltip>
                  </FormItem>
                  <FormItem class="form-Item" label="往来单号：">
                    <Tooltip :content="formPlanmain.code">
                    <Input
                      placeholder=""
                      class="w160"
                      readonly
                      v-model="formPlanmain.code"
                      :disabled="isInput"
                    />
                    </Tooltip>
                  </FormItem>
                </Form>
              </div>
              <div class="flex plan-cz-btn" ref="planBtn">
                <div class="clearfix">
                  <div class="fl mb5">
                    <Button
                      size="small"
                      class="mr10"
                      @click="selectPlan"
                      :disabled="isInput || formPlanmain.guestId.length <= 0"
                      v-has="'selectProject'"
                      >选择滚动计划</Button
                    >
                  </div>
                  <div class="fl mb5">
                    <Button
                      size="small"
                      class="mr10"
                      @click="delPart"
                      :disabled="isInput"
                      v-has="'delete'"
                      ><Icon custom="iconfont iconlajitongicon icons" />
                      删除配件</Button
                    >
                  </div>
                  <div class="fl mb5">
                    <Button
                      size="small"
                      class="mr10"
                      :disabled="adjustButtonDisable"
                      @click="showModel('adjustModel')"
                      v-has="'adj'"
                      >订单调整</Button
                    >
                  </div>
                  <div class="fl mb5">
                    <Button
                      size="small"
                      class="mr10"
                      :disabled="isInput"
                      @click="showGoodsInfo"
                      v-has="'info'"
                      >收货信息</Button
                    >
                  </div>
                  <div class="fl mb5">
                    <Button
                      size="small"
                      class="mr10"
                      @click="showModel('purchaseAmount')"
                      :disabled="isInput"
                      v-has="'amount'"
                      >采购金额填写</Button
                    >
                  </div>
                  <div class="fl mb5">
                    <Button
                      size="small"
                      class="mr10"
                      @click="showModel('apportionmentExpenses')"
                      :disabled="isInput"
                      v-has="'expenses'"
                      >分摊费用填写</Button
                    >
                  </div>
                </div>
              </div>
              <vxe-table
                border
                resizable
                show-footer
                @edit-closed="editClosedEvent"
                @select-change="selectChange"
                @select-all="selectAll"
                :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true}"
                @keydown="keydown"
                size="mini"
                :height="rightTableHeight"
                :data="tableData"
                :footer-method="addFooter"
                :edit-config="{ trigger: 'click', mode: 'cell' }"
              >
                <vxe-table-column show-overflow="tooltip"
                  type="seq"
                  width="50"
                  title="序号"
                  fixed="left"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip" fixed="left" type="checkbox" width="50"></vxe-table-column>
                <vxe-table-column show-overflow="tooltip" fixed="left" title="操作" width="80">
                  <template v-slot="{ row }">
                    <Button type="text" @click="watch(row.partId)">查看</Button>
                  </template>
                </vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="partCode"
                  title="配件编码"
                  width="100"
                  fixed="left"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="partName"
                  title="配件名称"
                  width="100"
                  fixed="left"
                ></vxe-table-column>
                <vxe-table-column fixed="left" show-overflow="tooltip" field="partInnerId" title="配件内码" width="100"></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="partBrand"
                  title="品牌"
                  width="100"
                  fixed="left"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="orderQty"
                  title="采购数量"
                  :edit-render="{ name: 'input' }"
                  width="160"
                >
                  <template v-slot:edit="{ row }">
                    <el-input-number
                      :max="row.canQty"
                      :min="0"
                      v-model="row.orderQty"
                      :controls="false"
                      :precision="0"
                      size="mini"
                    />
                  </template>
                </vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="fcPrice"
                  title="采购裸价(外币)"
                  width="120"
                >
                  <template v-slot:edit="{ row }">
                    {{feeform.exchangeRate == 0 ? '0.00' : (row.rmbPrice / feeform.exchangeRate) | priceFilters }}
                  </template>
                </vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="rmbPrice"
                  title="采购裸价(人民币)"
                  :edit-render="{ name: 'input' }"
                  width="160"
                >
                  <template v-slot:edit="{ row }">
                    <el-input-number
                      :min="0"
                      v-model="row.rmbPrice"
                      :precision="2"
                      :controls="false"
                      size="mini"
                    />
                  </template>
                  <template v-slot="{ row }">
                    {{ row.rmbPrice | priceFilters }}
                  </template>
                </vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="tariffAmt"
                  title="关税费"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="transportAmt"
                  title="运杂费"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="vatAmt"
                  title="增值税"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="otherAmt"
                  title="其他费用"
                  :edit-render="{ name: 'input' }"
                  width="160"
                >
                  <template v-slot:edit="{ row }">
                    <el-input-number
                      :max="999999"
                      :min="0"
                      v-model="row.otherAmt"
                      :precision="2"
                      :controls="false"
                      size="mini"
                    />
                  </template>
                  <template v-slot="{ row }">
                    {{ row.otherAmt | priceFilters }}
                  </template>
                </vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="orderPrice"
                  title="采购单价"
                  width="120"
                >
                  <template v-slot:default="{ row }">
                    {{ (row.rmbPrice + row.tariffAmt + row.transportAmt + row.vatAmt + row.otherAmt) | priceFilters }}
                  </template>
                </vxe-table-column>
                <vxe-table-column show-overflow="tooltip" title="采购金额" field="orderAmt" width="120">
                  <template v-slot:default="{ row }">
                    {{ ((row.rmbPrice + row.tariffAmt + row.transportAmt + row.vatAmt + row.otherAmt) * row.orderQty) | priceFilters }}
                  </template>
                </vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="remark"
                  title="备注"
                  :edit-render="{ name: 'input' }"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="noTaxPrice"
                  title="不含税单价"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="noTaxAmt"
                  title="不含税金额"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="carBrandName"
                  title="品牌车型"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="unit"
                  title="单位"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="oemCode"
                  title="OE码"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="spec"
                  title="规格"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="adjustQty"
                  title="订单取消数量"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="trueEnterQty"
                  title="验收数量"
                  width="100"
                ></vxe-table-column>
              </vxe-table>
            </div>
          </Split>
        </div>
      </div>
    </section>
    <!-- 更多 -->
    <more-search @getmoreData="getmoreData" ref="moreSearch"></more-search>
    <!-- 费用登记 -->
    <fee-registration ref="feeRegistration" :state="selectRowState" :serviceId="serviceId"></fee-registration>
    <!-- 供应商资料 -->
    <select-supplier
      @selectSearchName="selectSupplierName"
      ref="selectSupplier"
      headerTit="供应商资料"
    ></select-supplier>
    <!-- 选择采购计划单 -->
    <procurement-modal
      ref="procurementModal"
      :guestId="formPlanmain.guestId"
      @getPlanOrder="getPlanOrder"
    ></procurement-modal>
    <!-- 采购金额 -->
    <purchase-amount
      ref="purchaseAmount"
      :totalAmt="totalAmt"
      :parentAmt="selectTableRow"
      @amt="getAmt"
    ></purchase-amount>
    <!-- 收货信息 -->
    <goods-info ref="goodsInfo" :mainId="mainId" :row="formPlanmain"></goods-info>
    <!-- 订单调整 -->
    <adjust-model ref="adjustModel" :mainId="mainId"></adjust-model>
    <!-- 查看 -->
    <tabs-model ref="tabsModel" :partId="partId"></tabs-model>
    <!-- 打印 -->
    <print-model ref="PrintModel" :orderId="mainId"></print-model>
    <!-- 分摊费用 -->
    <apportionment-expenses ref="apportionmentExpenses" :parentFeeform="selectTableRow" :currencies="currencyMap" @currencyForm="getFeeForm"></apportionment-expenses>
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less" scoped>
@import url("../../lease/product/lease.less");
@import url("../plannedPurchaseOrder/index");
</style>
