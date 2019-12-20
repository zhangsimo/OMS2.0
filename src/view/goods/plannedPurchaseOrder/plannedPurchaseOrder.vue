<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf wlf-center">
          <div class="db">
            <span>快速查询：</span>
          </div>
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
              ><Icon type="md-add" /> 新增</Button
            >
          </div>
          <div class="db">
            <Button
              type="default"
              @click="saveHandle('formplanref')"
              class="mr10"
              :disabled="isInput"
              ><i class="iconfont mr5 iconbaocunicon"></i>保存</Button
            >
          </div>
          <div class="db">
            <Button
              class="mr10"
              @click="submit('formplanref')"
              :disabled="isInput"
              ><i class="iconfont mr5 iconziyuan2"></i>提交</Button
            >
          </div>
          <div class="db">
            <Button @click="print" class="mr10" :disabled="selectTableRow === null"
              ><i class="iconfont mr5 icondayinicon"></i> 打印</Button
            >
          </div>
          <div class="db">
            <Button @click="abandoned" class="mr10" :disabled="!selectTableRow || selectTableRow.billStatusId.name != '草稿'"
              ><Icon type="md-close" size="14" /> 作废</Button
            >
          </div>
          <div class="db">
            <Button @click="showFee" class="mr10"
              ><i class="iconfont mr5 iconshenheicon"></i> 费用登记</Button
            >
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
                        ><Input
                          v-model="formPlanmain.guestName"
                          placeholder="请选择供应商"
                          :disabled="isInput"
                          readonly
                      /></Col>
                      <Col span="5"
                        ><Button
                          @click="showModel('selectSupplier')"
                          class="ml5"
                          size="small"
                          type="default"
                          :disabled="isInput"
                          ><i
                            class="iconfont iconxuanzetichengchengyuanicon"
                          ></i></Button
                      ></Col>
                    </Row>
                  </FormItem>
                  <FormItem class="form-Item" label="采购员：" prop="orderMan">
                    <Input
                      class="w160"
                      placeholder="请输入采购员"
                      v-model="formPlanmain.orderMan"
                      :disabled="isInput"
                      readonly
                    />
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
                      :options="options1"
                      :disabled="isInput"
                    ></DatePicker>
                  </FormItem>
                  <FormItem class="form-Item" label="预计到货日期：">
                    <DatePicker
                      style="width: 160px"
                      type="date"
                      placeholder="请选择预计到货日期"
                      :options="options2"
                      v-model="formPlanmain.planArriveDate"
                      :disabled="isInput"
                    ></DatePicker>
                  </FormItem>
                  <FormItem class="form-Item" label="备注：">
                    <Input
                      placeholder="请输入备注"
                      class="w160"
                      v-model="formPlanmain.remark"
                      :disabled="isInput"
                      maxlength="100"
                    />
                  </FormItem>
                  <FormItem class="form-Item" label="直发门店：">
                    <Select
                      class="w160"
                      v-model="formPlanmain.directGuestId"
                      :disabled="isInput"
                    >
                      <Option
                        v-for="(item, index) in putStores"
                        :key="index"
                        :value="item.value"
                        >{{ item.label }}</Option
                      >
                    </Select>
                  </FormItem>
                  <FormItem class="form-Item" label="订单号：">
                    <Input
                      placeholder="请输入订单号"
                      class="w160"
                      readonly
                      v-model="formPlanmain.serviceId"
                      :disabled="isInput"
                    />
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
                      >选择采购计划</Button
                    >
                  </div>
                  <div class="fl mb5">
                    <Button
                      size="small"
                      class="mr10"
                      @click="delPart"
                      :disabled="isInput"
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
                      >订单调整</Button
                    >
                  </div>
                  <div class="fl mb5">
                    <Button
                      size="small"
                      class="mr10"
                      :disabled="isInput"
                      @click="showGoodsInfo"
                      >收货信息</Button
                    >
                  </div>
                  <div class="fl mb5">
                    <Button
                      size="small"
                      class="mr10"
                      @click="showModel('purchaseAmount')"
                      :disabled="isInput"
                      >采购金额填写</Button
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
                size="mini"
                :height="rightTableHeight"
                :data="tableData"
                :footer-method="addFooter"
                :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
              >
                <vxe-table-column
                  type="index"
                  width="60"
                  title="序号"
                ></vxe-table-column>
                <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                <vxe-table-column title="操作" width="80">
                  <template v-slot="{ row }">
                    <Button type="text" @click="watch(row.partId)">查看</Button>
                  </template>
                </vxe-table-column>
                <vxe-table-column
                  field="partCode"
                  title="配件编码"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="partName"
                  title="配件名称"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="partBrand"
                  title="品牌"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="orderQty"
                  title="采购数量"
                  :edit-render="{ name: 'input' }"
                  width="120"
                >
                  <template v-slot:edit="{ row }">
                    <InputNumber
                      :max="999999"
                      :min="0"
                      v-model="row.orderQty"
                    ></InputNumber>
                  </template>
                </vxe-table-column>
                <vxe-table-column
                  field="orderPrice"
                  title="采购单价"
                  :edit-render="{ name: 'input' }"
                  width="120"
                >
                  <template v-slot:edit="{ row }">
                    <InputNumber
                      :max="999999"
                      :min="0"
                      v-model="row.orderPrice"
                      :precision="2"
                    ></InputNumber>
                  </template>
                  <template v-slot="{ row }">
                    {{ row.orderPrice | priceFilters }}
                  </template>
                </vxe-table-column>
                <vxe-table-column title="采购金额" filed="orderAmt" width="120">
                  <template v-slot="{ row }">
                    {{ (row.orderPrice * row.orderQty) | priceFilters }}
                  </template>
                </vxe-table-column>
                <vxe-table-column
                  field="remark"
                  title="备注"
                  :edit-render="{ name: 'input' }"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="noTaxPrice"
                  title="不含税单价"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="noTaxAmt"
                  title="不含税金额"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="carBrand"
                  title="品牌车型"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="enterUnitId"
                  title="单位"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="oeCode"
                  title="OE码"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="specifications"
                  title="规格"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="direction"
                  title="方向"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="cancelQty"
                  title="订单取消数量"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="acceptQty"
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
      @amt="getAmt"
    ></purchase-amount>
    <!-- 收货信息 -->
    <goods-info ref="goodsInfo" :mainId="mainId"></goods-info>
    <!-- 订单调整 -->
    <adjust-model ref="adjustModel" :mainId="mainId"></adjust-model>
    <!-- 查看 -->
    <tabs-model ref="tabsModel" :partId="partId"></tabs-model>
    <!-- 打印 -->
    <print-model ref="PrintModel" :orderId="mainId"></print-model>
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less" scoped>
@import url("../../lease/product/lease.less");
@import url("./index");
</style>
