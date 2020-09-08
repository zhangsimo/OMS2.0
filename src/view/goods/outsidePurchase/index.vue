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
            ><i class="iconfont mr5 iconziyuan2"></i>提交入库</Button
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
            <Button @click="showStatus" class="mr10" :disabled="hideSp"
            v-has="'approval'"
            ><i class="iconfont mr5 iconshenheicon"></i>查看审批</Button
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
                        <GoodCus style="width: 120px"
                            :title="formPlanmain.guestName"
                            placeholder="请输入供应商"
                            :search-value="formPlanmain.guestName"
                            @throwName="throwNameFun"
                            :disabled-prop="isInput">
                          </GoodCus>
                      <!-- <Input
                        v-model="formPlanmain.guestName"
                        placeholder="请选择供应商"
                        :disabled="isInput"
                      /> -->
                      </Tooltip>
                      </Col>
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
                  <FormItem class="form-Item" label="预付款：" prop="advanceAmt">
                    <Input
                      class="w160"
                      v-model="formPlanmain.advanceAmt"
                      :disabled="isInput"
                    />
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
                  <FormItem class="form-Item" label="订单号：">
                    <Tooltip :content="formPlanmain.serviceId">
                    <Input
                      readonly
                      placeholder=""
                      class="w160"
                      v-model="formPlanmain.serviceId"
                      :disabled="isInput"
                    />
                    </Tooltip>
                  </FormItem>
                  <FormItem class="form-Item" label="备注：">
                    <Tooltip :content="formPlanmain.remark" :disabled="(formPlanmain.remark||'').trim()==''">
                      <Input
                        placeholder="请输入备注"
                        class="w160"
                        v-model="formPlanmain.remark"
                        :disabled="isInput"
                        maxlength="100"
                      />
                      <div slot="content" style="width: 100%;white-space:normal;word-wrap:break-word;">{{(formPlanmain.remark||"").trim()}}</div>
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
                      @click="addAcc"
                      :disabled="isInput||!formPlanmain.guestId"
                      v-has="'addPart'"
                    >添加配件</Button
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
                    <Poptip placement="bottom">
                      <Button class="mr10" size="small" :disabled="!mainId || selectTableRow.new || isInput" v-has="'import'">导入
                      </Button>
                      <div slot="content" class="flex" style="justify-content: space-between">
                        <div class="flex mr10">
                          <Upload
                            ref="upload1"
                            :show-upload-list="false"
                            :action="upurlInnerId"
                            :headers="headers"
                            :format="['xlsx','xls']"
                            :on-format-error="onFormatError"
                            :on-success="onSuccess"
                            :before-upload='beforeUploadInnerId'
                          >
                            <Button
                              size="small"
                              @click="getRUlInnerId"
                              v-has="'importInnerId'"
                            ><span class="center"><Icon custom="iconfont icondaoruicon icons" />配件内码导入</span>
                            </Button>
                          </Upload>
                        </div>
                        <div class="flex">
                          <Upload
                            ref="upload"
                            :show-upload-list="false"
                            :action="upurl"
                            :headers="headers"
                            :format="['xlsx','xls']"
                            :on-format-error="onFormatError"
                            :on-success="onSuccess"
                            :before-upload ='beforeUpload'
                          >
                            <Button size="small" class="mr10" @click="getRUl" v-has="'importBrand'">
                              <span class="center"><Icon custom="iconfont icondaoruicon icons" />编码品牌导入</span>
                            </Button>
                          </Upload>
                        </div>
                      </div>
                    </Poptip>
                  </div>
                  <div class="fl mb5 mr10">
                    <Poptip placement="bottom">
                      <Button size="small">
                        <Icon custom="iconfont iconxiazaiicon icons" />下载模板
                      </Button>
                      <div slot="content">
                        <Button
                          size="small"
                          class="mr10"
                          @click="downInnerId"
                        >配件内码模板
                        </Button>
                        <Button
                          size="small"
                          @click="down"
                        >编码品牌模板</Button>
                      </div>
                    </Poptip>
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
                  width="60"
                  title="序号"
                  fixed="left"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip" fixed="left" type="checkbox" width="60"></vxe-table-column>
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
                      :max="999999"
                      :min="0"
                      v-model="row.orderQty"
                      :controls="false"
                      size="mini"
                      :precision="0"
                    />
                  </template>
                </vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="orderPrice"
                  title="采购单价"
                  :edit-render="{ name: 'input' }"
                  width="160"
                >
                  <template v-slot:edit="{ row }">
                    <el-input-number
                      :max="999999"
                      :min="0"
                      v-model="row.orderPrice"
                      :precision="2"
                      :controls="false"
                      size="mini"
                    />
                  </template>
                  <template v-slot="{ row }">
                    {{ row.orderPrice | priceFilters }}
                  </template>
                </vxe-table-column>
                <vxe-table-column show-overflow="tooltip" title="采购金额" field="orderAmt" width="120">
                  <template v-slot="{ row }">
                    {{ (row.orderPrice * row.orderQty) | priceFilters }}
                  </template>
                </vxe-table-column>
                <vxe-table-column  show-overflow="tooltip"
                   field="storeShelf"
                   title="仓位"
                   width="100"
                   :edit-render="{name: 'input',immediate: true, events: {blur: checkSelf}}"
                ></vxe-table-column>
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
                  field="carModelName"
                  title="品牌车型"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column show-overflow="tooltip"
                  field="enterUnitId"
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
                  field="direction"
                  title="方向"
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
    <tabs-model ref="tabsModel" type="外采" :partId="partId"></tabs-model>
    <!-- 打印 -->
    <print-model ref="PrintModel" :orderId="mainId"></print-model>
    <!--审批状态-->
    <status-model ref="StatusModel" :orderId="selectTableRow"></status-model>
    <!--添加配件-->
    <select-part-com ref="selectPartCom" :formPlanmain="formPlanmain" @selectPartName="getPartNameList" @selectPartName2="getPartNameList2" :is-show-add-part-btn="true"></select-part-com>
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less" scoped>
  @import url("../../lease/product/lease.less");
  @import url("../plannedPurchaseOrder/index");
</style>
