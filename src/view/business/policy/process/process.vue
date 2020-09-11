<template>
  <main
    class="bigBox"
    style="background-color: #fff; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1); padding-top: 16px; height:100%"
  >
    <Tabs type="card" name="orderbox" class="it-box" :active-key="tabKey" @on-click="tabChange">
      <TabPane label="配件组装" tab="orderbox" key="0">
        <div class="content-oper content-oper-flex" style="box-shadow:none">
          <section class="oper-box">
            <div class="oper-top flex">
              <div class="wlf">
                <div class="db">
                  <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>
                  <Select v-model="form.status" @on-change="getDataType" class="w90 mr10">
                    <Option
                      v-for="item in purchaseTypeArr"
                      :value="item.value"
                      :key="item.value"
                    >{{item.label}}</Option>
                  </Select>
                </div>
                <div class="db">
                  <Button type="default" @click="more" class="mr10">
                    <i class="iconfont mr5 iconchaxunicon"></i>更多
                  </Button>
                </div>
                <div class="db">
                  <Button class="mr10" @click="xinzeng" v-has="'add'">
                    <Icon type="md-add" />新增
                  </Button>
                </div>
                <div class="db">
                  <Button
                    type="default"
                    class="mr10"
                    @click="baocun1"
                    v-has="'save'"
                    :loading="saveLoading"
                    :disabled="Leftcurrentrow.status.value!==0"
                  >
                    <i class="iconfont mr5 iconbaocunicon"></i>保存
                  </Button>
                </div>
                <div class="db">
                  <Button
                    class="mr10"
                    @click="tijiao1"
                    v-has="'submit'"
                    :loading="commitLoading"
                    :disabled="Leftcurrentrow.status.value!==0"
                  >
                    <Icon type="md-checkmark" size="14" />提交
                  </Button>
                </div>
                <div class="db">
                  <Button
                    class="mr10"
                    @click="zuofei1"
                    v-has="'zuofei'"
                    :loading="cancelLoading"
                    :disabled="Leftcurrentrow.status.value!==0"
                  >
                    <Icon type="md-close" size="14" />作废
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <section class="con-box">
            <div class="inner-box">
              <div class="con-split" ref="paneLeft">
                <Split v-model="split1" min="200" @on-moving="getDomHeight">
                  <div
                    slot="left"
                    class="con-split-pane-left"
                    style="overflow-y: auto; height: 100%;"
                  >
                    <div class="pane-made-hd">配件组装列表</div>
                    <Table
                      :height="leftTableHeight"
                      @on-current-change="selectTabelData"
                      size="small"
                      highlight-row
                      border
                      :stripe="true"
                      :columns="Left.columns"
                      :data="Left.tbdata"
                    ></Table>
                    <Page
                      size="small"
                      :total="Left.page.total"
                      :page-size="Left.page.size"
                      :current="Left.page.num"
                      show-sizer
                      show-total
                      class-name="page-con"
                      @on-change="changePage"
                      @on-page-size-change="changeSize"
                      class="mr10"
                      :page-size-opts="[20, 50, 100, 200]"
                    ></Page>
                  </div>
                  <div slot="right" class="con-split-pane-right pl5 goods-list-form">
                    <div class="pane-made-hd">配件组装信息</div>
                    <div class="clearfix purchase" ref="planForm">
                      <Form inline :show-message="false" ref="formPlan" :label-width="100">
                        <FormItem label="仓库：" prop="supplyName" class="redIT">
                          <Row class="w160">
                            <Col span="24">
                              <Select
                                v-model="Leftcurrentrow.storeId"
                                :disabled="Leftcurrentrow.status.value !== 0"
                              >
                                <Option
                                  v-for="item in cangkuListall"
                                  :value="item.value"
                                  :disabled="item.isDisabled"
                                  :key="item.value"
                                >{{item.label}}</Option>
                              </Select>
                            </Col>
                          </Row>
                        </FormItem>
                        <FormItem label="创建日期：" prop="billType" class="redIT">
                          <!--                          :disabled="Leftcurrentrow.xinzeng || Leftcurrentrow.status.value !== 0"-->
                          <DatePicker
                            disabled
                            :value="Leftcurrentrow.createTime"
                            format="yyyy-MM-dd HH:mm:ss"
                            type="date"
                            class="w160"
                          ></DatePicker>
                        </FormItem>
                        <FormItem label="操作员：" prop="planDate">
                          <Input class="w160" disabled :value="Leftcurrentrow.orderMan"></Input>
                        </FormItem>
                        <FormItem label="备注：" prop="remark">
                          <Tooltip :content="Leftcurrentrow.remark">
                            <Input
                              :disabled="Leftcurrentrow.status.value !== 0"
                              v-model="Leftcurrentrow.remark"
                              class="w160"
                            ></Input>
                          </Tooltip>
                        </FormItem>
                        <FormItem label="组装单号：" prop="planOrderNum">
                          <Tooltip :content="Leftcurrentrow.serviceId">
                            <Input class="w160" disabled :value="Leftcurrentrow.serviceId"></Input>
                          </Tooltip>
                        </FormItem>
                      </Form>
                    </div>
                    <div class="flex plan-cz-btn" ref="planBtn">
                      <div class="clearfix">
                        <div class="fl mb5">
                          <Button size="small" class="mr10" @click="addProoo" v-has="'ddProoo'">
                            <Icon type="md-add" />选择成品
                          </Button>
                        </div>
                        <div class="fl mb5">
                          <Button size="small" class="mr10" @click="shanchu" v-has="'delete'">
                            <i class="iconfont mr5 iconlajitongicon"></i> 删除
                          </Button>
                        </div>
                      </div>
                    </div>
                    <vxe-table
                      v-if="showit"
                      border
                      auto-resizable
                      show-footer
                      ref="xTable1"
                      size="mini"
                      highlight-current-row
                      highlight-hover-row
                      @current-change="currentChangeEvent"
                      @select-all="selectAllEvent"
                      @select-change="selectChangeEvent"
                      :height="rightTableHeight"
                      :data="Leftcurrentrow.processProductVO"
                      :footer-method="addFooter"
                      :edit-config="Leftcurrentrow.status.value === 0 ? {trigger: 'click', mode: 'cell'} : {}"
                    >
                      <vxe-table-column
                        show-overflow="tooltip"
                        type="seq"
                        width="60"
                        title="序号"
                        fixed="left"
                      ></vxe-table-column>
                      <vxe-table-column
                        show-overflow="tooltip"
                        type="checkbox"
                        width="60"
                        fixed="left"
                      ></vxe-table-column>
                      <vxe-table-column
                        show-overflow="tooltip"
                        field="partCode"
                        title="配件编码"
                        width="100"
                        fixed="left"
                      ></vxe-table-column>
                      <vxe-table-column
                        show-overflow="tooltip"
                        field="partName"
                        title="配件名称"
                        width="100"
                        fixed="left"
                      ></vxe-table-column>
                      <vxe-table-column
                        show-overflow="tooltip"
                        field="partBrand"
                        title="品牌"
                        width="100"
                        fixed="left"
                      ></vxe-table-column>
                      <vxe-table-column show-overflow="tooltip" field="unit" title="单位" width="100"></vxe-table-column>
                      <vxe-table-column
                        show-overflow="tooltip"
                        field="orderQty"
                        :edit-render="{name: 'input', attrs: {type: 'number'}, events: {keyup: keydownEvent}}"
                        title="组装数量"
                        width="100"
                      ></vxe-table-column>
                      <!--                      <vxe-table-column  show-overflow="tooltip" field="orderPrice" title="单价" width="100"></vxe-table-column>-->
                      <!--                      <vxe-table-column  show-overflow="tooltip" field="orderAmt" title="金额" width="100"></vxe-table-column>-->
                      <vxe-table-column
                        show-overflow="tooltip"
                        field="taxPrice"
                        title="含税单价"
                        width="100"
                      ></vxe-table-column>
                      <vxe-table-column
                        show-overflow="tooltip"
                        field="taxAmt"
                        title="含税金额"
                        width="100"
                      ></vxe-table-column>
                      <vxe-table-column
                        show-overflow="tooltip"
                        field="noTaxPrice"
                        title="不含税单价"
                        width="100"
                      ></vxe-table-column>
                      <vxe-table-column
                        show-overflow="tooltip"
                        field="noTaxAmt"
                        title="不含税金额"
                        width="100"
                      ></vxe-table-column>
                      <vxe-table-column show-overflow="tooltip" title="品牌车型" width="100">
                        <template v-slot="{row,rowIndex}">
                          <span>{{row.carBrandName}} {{row.carModelName}}</span>
                        </template>
                      </vxe-table-column>
                      <vxe-table-column
                        show-overflow="tooltip"
                        field="oemCode"
                        title="OE码"
                        width="100"
                      ></vxe-table-column>
                      <vxe-table-column show-overflow="tooltip" field="spec" title="规格" width="100"></vxe-table-column>
                      <vxe-table-column
                        show-overflow="tooltip"
                        field="partInnerId"
                        title="配件内码"
                        width="120"
                      ></vxe-table-column>
                    </vxe-table>

                    <div class="wrapper">
                      <div style="margin: 5px 10px">所需组装零件</div>
                      <vxe-table
                        border
                        auto-resizable
                        show-footer
                        size="mini"
                        ref="aatable"
                        :height="rightTableHeight"
                        :data="currentData"
                        :footer-method="addFooter2"
                        :edit-config="{trigger: 'click', mode: 'cell'}"
                      >
                        <vxe-table-column
                          show-overflow="tooltip"
                          type="seq"
                          width="60"
                          title="序号"
                          fixed="left"
                        ></vxe-table-column>
                        <vxe-table-column
                          show-overflow="tooltip"
                          field="partCode"
                          title="配件编码"
                          fixed="left"
                        ></vxe-table-column>
                        <vxe-table-column
                          show-overflow="tooltip"
                          field="partName"
                          title="配件名称"
                          fixed="left"
                        ></vxe-table-column>
                        <vxe-table-column
                          show-overflow="tooltip"
                          field="partBrand"
                          title="品牌"
                          fixed="left"
                        ></vxe-table-column>
                        <vxe-table-column show-overflow="tooltip" field="unit" title="单位"></vxe-table-column>
                        <vxe-table-column show-overflow="tooltip" field="orderQty" title="需要数量">
<!--                          <template v-slot="{ row, seq }">-->
<!--                            <span>{{ row.qty*currentNum}}</span>-->
<!--                          </template>-->
                        </vxe-table-column>
                        <vxe-table-column show-overflow="tooltip" field="storeStockQty" title="库存"></vxe-table-column>
                        <vxe-table-column show-overflow="tooltip" field="stockOutQty" title="缺货数量"></vxe-table-column>
                        <vxe-table-column show-overflow="tooltip" title="品牌车型" width="100">
                          <template v-slot="{row,rowIndex}">
                            <span>{{row.carBrandName}} {{row.carModelName}}</span>
                          </template>
                        </vxe-table-column>
                        <vxe-table-column show-overflow="tooltip" field="spec" title="规格"></vxe-table-column>
                        <vxe-table-column
                          show-overflow="tooltip"
                          field="partInnerId"
                          title="配件内码"
                          width="120"
                        ></vxe-table-column>
                      </vxe-table>
                    </div>
                  </div>
                </Split>
              </div>
            </div>
          </section>
          <!--更多弹框-->
          <Modal v-model="advanced" title="高级查询" width="600px">
            <Form @keydown.native.enter="Determined">
              <More ref="naform"></More>
            </Form>
            <div slot="footer">
              <Button type="primary" @click="Determined">确定</Button>
              <Button type="default" @click="cancel">取消</Button>
            </div>
          </Modal>
        </div>
      </TabPane>
      <TabPane label="配件拆分" tab="orderbox" key="1">
        <div class="content-oper content-oper-flex" style="box-shadow:none">
          <section class="oper-box">
            <div class="oper-top flex">
              <div class="wlf">
                <div class="db">
                  <quick-date class="mr10" v-on:quickDate="getDataQuick1"></quick-date>
                  <Select v-model="form.status" @on-change="getDataType1" class="w90 mr10">
                    <Option
                      v-for="item in purchaseTypeArr"
                      :value="item.value"
                      :key="item.value"
                    >{{item.label}}</Option>
                  </Select>
                </div>
                <div class="db">
                  <Button type="default" @click="more" class="mr10">
                    <i class="iconfont mr5 iconchaxunicon"></i>更多
                  </Button>
                </div>
                <div class="db">
                  <Button class="mr10" @click="xinzeng" v-has="'add1'">
                    <Icon type="md-add" />新增
                  </Button>
                </div>
                <div class="db">
                  <Button
                    type="default"
                    class="mr10"
                    @click="baocun1"
                    v-has="'save1'"
                    :loading="saveLoading"
                    :disabled="Leftcurrentrow.status.value!==0"
                  >
                    <i class="iconfont mr5 iconbaocunicon"></i>保存
                  </Button>
                </div>
                <div class="db">
                  <Button
                    class="mr10"
                    @click="tijiao1"
                    v-has="'submit1'"
                    :loading="commitLoading"
                    :disabled="Leftcurrentrow.status.value!==0"
                  >
                    <Icon type="md-checkmark" size="14" />提交
                  </Button>
                </div>
                <div class="db">
                  <Button
                    class="mr10"
                    @click="zuofei1"
                    v-has="'zuofei1'"
                    :loading="cancelLoading"
                    :disabled="Leftcurrentrow.status.value!==0"
                  >
                    <Icon type="md-close" size="14" />作废
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <section class="con-box">
            <div class="inner-box">
              <div class="con-split" ref="paneLeft">
                <Split v-model="split1" min="200" @on-moving="getDomHeight">
                  <div
                    slot="left"
                    class="con-split-pane-left"
                    style="overflow-y: auto; height: 100%;"
                  >
                    <div class="pane-made-hd">配件拆分列表</div>
                    <Table
                      :height="leftTableHeight"
                      @on-current-change="selectTabelData"
                      size="small"
                      highlight-row
                      border
                      :stripe="true"
                      :columns="Left.columns"
                      :data="Left.tbdata"
                    ></Table>
                    <Page
                      size="small"
                      :total="Left.page.total"
                      :page-size="Left.page.size"
                      :current="Left.page.num"
                      show-sizer
                      show-total
                      class-name="page-con"
                      @on-change="changePage"
                      @on-page-size-change="changeSize"
                      class="mr10"
                      :page-size-opts="[20, 50, 100, 200]"
                    ></Page>
                  </div>
                  <div slot="right" class="con-split-pane-right pl5 goods-list-form">
                    <div class="pane-made-hd">配件拆分信息</div>
                    <div class="clearfix purchase" ref="planForm">
                      <Form inline :show-message="false" ref="formPlan" :label-width="100">
                        <FormItem label="仓库：" prop="supplyName" class="redIT">
                          <Row class="w160">
                            <Col span="24">
                              <Select
                                v-model="Leftcurrentrow.storeId"
                                style="width:100%"
                                :disabled="Leftcurrentrow.status.value !== 0"
                              >
                                <Option
                                  v-for="item in cangkuListall"
                                  :value="item.value"
                                  :disabled="item.isDisabled"
                                  :key="item.value"
                                >{{item.label}}</Option>
                              </Select>
                            </Col>
                          </Row>
                        </FormItem>
                        <FormItem label="创建日期：" prop="billType" class="redIT">
                          <!--                          :disabled=" Leftcurrentrow.xinzeng || Leftcurrentrow.status.value !== 0"-->
                          <DatePicker
                            disabled
                            :value="Leftcurrentrow.createTime"
                            format="yyyy-MM-dd HH:mm:ss"
                            type="date"
                            class="w160"
                          ></DatePicker>
                        </FormItem>
                        <FormItem label="操作员：" prop="planDate">
                          <Input class="w160" disabled :value="Leftcurrentrow.orderMan"></Input>
                        </FormItem>
                        <FormItem label="备注：" prop="remark">
                          <Tooltip :content="Leftcurrentrow.remark">
                            <Input
                              :disabled="Leftcurrentrow.status.value !== 0"
                              :value="Leftcurrentrow.remark"
                              class="w160"
                            ></Input>
                          </Tooltip>
                        </FormItem>
                        <FormItem label="拆分单号：" prop="planOrderNum">
                          <!--                          :disabled="Leftcurrentrow.status.value !== 0"-->
                          <Tooltip :content="Leftcurrentrow.serviceId">
                            <Input class="w160" disabled :value="Leftcurrentrow.serviceId"></Input>
                          </Tooltip>
                        </FormItem>
                      </Form>
                    </div>
                    <div class="flex plan-cz-btn" ref="planBtn">
                      <div class="clearfix">
                        <div class="fl mb5">
                          <Button size="small" class="mr10" @click="addProoo" v-has="'ddProoo1'">
                            <Icon type="md-add" />选择成品
                          </Button>
                        </div>
                        <div class="fl mb5">
                          <Button size="small" class="mr10" @click="shanchu" v-has="'delete1'">
                            <i class="iconfont mr5 iconlajitongicon"></i> 删除
                          </Button>
                        </div>
                      </div>
                    </div>
                    <vxe-table
                      v-if="showit"
                      border
                      resizable
                      ref="xTable2"
                      size="mini"
                      highlight-current-row
                      highlight-hover-row
                      :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true}"
                      @keydown="keydown"
                      @current-change="currentChangeEvent"
                      @select-all="selectAllEvent"
                      @select-change="selectChangeEvent"
                      :height="rightTableHeight"
                      :data="Leftcurrentrow.processProductVO"
                      :edit-config="Leftcurrentrow.status.value === 0 ? {trigger: 'click', mode: 'cell'} : {}"
                    >
                      <vxe-table-column show-overflow="tooltip" type="seq" width="60" title="序号"></vxe-table-column>
                      <vxe-table-column show-overflow="tooltip" type="checkbox" width="60"></vxe-table-column>
                      <vxe-table-column
                        show-overflow="tooltip"
                        field="partCode"
                        title="配件编码"
                        width="100"
                      ></vxe-table-column>
                      <vxe-table-column
                        show-overflow="tooltip"
                        field="partName"
                        title="配件名称"
                        width="100"
                      ></vxe-table-column>
                      <vxe-table-column
                        show-overflow="tooltip"
                        field="partBrand"
                        title="品牌"
                        width="100"
                      ></vxe-table-column>
                      <vxe-table-column show-overflow="tooltip" field="unit" title="单位" width="100"></vxe-table-column>
                      <vxe-table-column
                        show-overflow="tooltip"
                        field="orderQty"
                        :edit-render="{name: 'input', attrs: {type: 'number'}, events: {keyup: keydownEvent}}"
                        title="数量"
                        width="100"
                      ></vxe-table-column>
                      <vxe-table-column
                        show-overflow="tooltip"
                        field="remark"
                        title="备注"
                        width="100"
                        :edit-render="{name: 'input'}"
                      ></vxe-table-column>
                      <vxe-table-column
                        show-overflow="tooltip"
                        field="storeStockQty"
                        title="库存数量"
                        width="100"
                      ></vxe-table-column>
                      <vxe-table-column
                        show-overflow="tooltip"
                        field="outableQty"
                        title="可用数量"
                        width="100"
                      ></vxe-table-column>
                      <vxe-table-column
                        show-overflow="tooltip"
                        field="stockOutQty"
                        title="缺货数量"
                        width="100"
                      ></vxe-table-column>
                      <vxe-table-column show-overflow="tooltip" title="品牌车型" width="100">
                        <template v-slot="{row,rowIndex}">
                          <span>{{row.carBrandName}} {{row.carModelName}}</span>
                        </template>
                      </vxe-table-column>
                      <vxe-table-column
                        show-overflow="tooltip"
                        field="oemCode"
                        title="OE码"
                        width="100"
                      ></vxe-table-column>
                      <vxe-table-column show-overflow="tooltip" field="spec" title="规格" width="100"></vxe-table-column>
                      <vxe-table-column
                        show-overflow="tooltip"
                        field="partInnerId"
                        title="配件内码"
                        width="120"
                      ></vxe-table-column>
                    </vxe-table>

                    <div class="wrapper">
                      <div style="margin: 5px 10px">拆成零件</div>
                      <vxe-table
                        border
                        resizable
                        size="mini"
                        :height="rightTableHeight"
                        :data="currentData"
                        :edit-config="{trigger: 'click', mode: 'cell'}"
                      >
                        <vxe-table-column show-overflow="tooltip" type="seq" width="60" title="序号"></vxe-table-column>
                        <vxe-table-column
                          show-overflow="tooltip"
                          field="partCode"
                          title="配件编码"
                          width="100"
                        ></vxe-table-column>
                        <vxe-table-column
                          show-overflow="tooltip"
                          field="partName"
                          title="配件名称"
                          width="100"
                        ></vxe-table-column>
                        <vxe-table-column
                          show-overflow="tooltip"
                          field="partBrand"
                          title="品牌"
                          width="100"
                        ></vxe-table-column>
                        <vxe-table-column
                          show-overflow="tooltip"
                          field="unit"
                          title="单位"
                          width="100"
                        ></vxe-table-column>
                        <vxe-table-column
                          show-overflow="tooltip"
                          field="orderQty"
                          title="拆分数量"
                          width="100"
                        >
                          <!--                          <template v-slot="{ row, seq }">-->
                          <!--                            <span>{{ row.qty * currentNum }}</span>-->
                          <!--                          </template>-->
                        </vxe-table-column>
                        <vxe-table-column
                          show-overflow="tooltip"
                          field="costRatio"
                          title="成本比例"
                          width="100"
                        ></vxe-table-column>
                        <vxe-table-column show-overflow="tooltip" title="品牌车型" width="100">
                          <template v-slot="{row,rowIndex}">
                            <span>{{row.carBrandName}} {{row.carModelName}}</span>
                          </template>
                        </vxe-table-column>
                        <vxe-table-column
                          show-overflow="tooltip"
                          field="spec"
                          title="规格"
                          width="100"
                        ></vxe-table-column>
                        <vxe-table-column
                          show-overflow="tooltip"
                          field="partInnerId"
                          title="配件内码"
                          width="120"
                        ></vxe-table-column>
                      </vxe-table>
                    </div>
                  </div>
                </Split>
              </div>
            </div>
          </section>
          <!--更多弹框-->
          <Modal v-model="advanced" title="高级查询" width="600px">
            <Form @keydown.native.enter="Determined">
              <More ref="naform"></More>
            </Form>
            <div slot="footer">
              <Button type="primary" @click="Determined">确定</Button>
              <Button type="default" @click="cancel">取消</Button>
            </div>
          </Modal>
        </div>
      </TabPane>
    </Tabs>
    <add-in-com
      @ok="getOkList"
      @selectAddName="selectAddlierName"
      ref="addInCom"
      headerTit="配件成品选择"
    ></add-in-com>
  </main>
  <!-- 配件组装 -->
</template>

<script>
import AddInCom from "./compontents/AddInCom";
import More from "./compontents/More";
import "../../../lease/product/lease.less";
import moment from "moment";
import QuickDate from "../../../../components/getDate/dateget";
import xeUtils from "xe-utils";
import {
  tijiao,
  zuofei,
  baocun,
  peijianzuzhuang,
  zuzhuangxinxi,
  zuzhuanglingjian,
  daochu,
  tijiao2,
  zuofei2,
  baocun2,
  peijianchaifen,
  chaifenxinxi,
  chaifenlingjian,
  daoru1,
  shanqu,
  cangkulist2,
} from "../../../../api/business/process.js";
export default {
  name: "process",
  components: {
    More,
    QuickDate,
    AddInCom,
  },
  data() {
    return {
      saveLoading: false,
      commitLoading: false,
      cancelLoading: false,
      showit: true,
      form: {
        status: 99,
        qucikTime: "",
      },
      v1: [],
      v2: [],
      rowId: "", //选择配件明细的id
      tabKey: 0,
      modal2: true,
      split1: 0.2,
      tabIndex: 0,
      curronly: false,
      purchaseType: 1, //查询选项
      purchaseTypeArr: [
        {
          label: "所有",
          value: 99,
        },
        {
          label: "草稿",
          value: 0,
        },
        {
          label: "已提交",
          value: 1,
        },

        {
          label: "已作废",
          value: 2,
        },
      ],
      advanced: false, //更多模块的弹框
      //左侧表格高度
      leftTableHeight: 0,
      tableData: [
        {
          name: "a",
          role: "a",
          sex: "a",
          num6: "",
          date12: "",
          data: [
            {
              name: 1,
            },
            { name: 2 },
          ],
        },
        {
          name: "b",
          role: "b",
          sex: "b",
          num6: "",
          date12: "",
        },
        {
          name: "c",
          role: "c",
          sex: "c",
          num6: "",
          date12: "",
        },
        {
          name: "d",
          role: "d",
          sex: "d",
          num6: "",
          date12: "",
        },
      ],
      // 所需零件数据
      components: [],
      //右侧表格高度
      rightTableHeight: 0,
      //左侧的表头内容
      Left: {
        page: {
          num: 1,
          size: 20,
          total: 0,
        },
        loading: false,
        flag: 0,
        columns: [
          {
            title: "序号",
            minWidth: 50,
            key: "index",
          },
          {
            title: "状态",
            key: "statuName",
            minWidth: 70,
          },
          {
            title: "创建日期",
            key: "createTime",
            minWidth: 140,
          },
          {
            title: "操作员",
            key: "orderMan",
            minWidth: 120,
          },
          {
            title: "配件组装单号",
            key: "serviceId",
            minWidth: 160,
          },
          {
            title: "提交人",
            key: "auditor",
            minWidth: 120,
          },
          {
            title: "提交时间",
            key: "auditDate",
            minWidth: 200,
          },
        ],
        tbdata: [],
      },
      Right: {
        page: {
          num: 1,
          size: 20,
          total: 0,
        },
        loading: false,
        columns: [
          {
            title: "序号",
            minWidth: 50,
            key: "id",
          },
          {
            title: "状态",
            key: "venderSkuNo",
            minWidth: 70,
          },
          {
            title: "调出方",
            key: "name",
            minWidth: 170,
          },
          {
            title: "创建日期",
            key: "address",
            minWidth: 120,
          },
          {
            title: "申请人",
            key: "isCycle",
            minWidth: 140,
          },
          {
            title: "申请单号",
            key: "disable",
            minWidth: 200,
          },
          {
            title: "提交人",
            key: "remark",
            minWidth: 100,
          },
          {
            title: "提交日期",
            align: "center",
            key: "qualitySourceName",
            minWidth: 170,
          },
          {
            title: "打印次数",
            key: "categoryName",
            minWidth: 170,
          },
        ],
        tbdata: [],
      },
      currentrow: {
        id: "1",
        name: "2",
      },
      duoxuanList: [],
      currentData: [],
      Leftcurrentrow: {
        status: {
          value: 0,
        },
        storeName: "",
        createTime: "",
        orderMan: "",
        remark: "",
        serviceId: "",
        processProductVO: [],
      },
      currentDataP: [],
      cangkuListall: [],
      currentNum: 1,
      saveBtnClik: false,

      //记录左侧点击的数据
      leftClickItemId: null,
    };
  },
  watch: {
    Leftcurrentrow: {
      handler(newVal) {
        this.Leftcurrentrow = newVal;
      },
      deep: true,
    },
  },
  // created() {
  //   if (this.tabKey === 0) {
  //     // 调接口获取配件组装列表信息
  //     this.getListzu();
  //   } else {
  //     // 调接口获取配件拆分列表信息
  //     this.getListchai();
  //   }
  // },
  methods: {
    //------------------------------------------------------------------------//
    //表格tab切换可编辑部位
    async editNextCell($table) {
      // @ts-ignore
      const { row, column, $rowIndex, $columnIndex, columnIndex, rowIndex } =
        (await $table.getActiveRecord()) || {};
      if (row) {
        // 当前为编辑状态
        // console.log('row', row)
        // 当前列属性
        const nowField = column.property;
        // 获取展示的列
        const { visibleColumn } = $table.getTableColumn();
        // 当前列属性（可以编辑的属性）
        const columnsField = visibleColumn.reduce((a, v, i) => {
          if (i !== 0 && i !== visibleColumn.length - 1 && v.editRender) {
            // 不是操作和序号且不可以编辑
            a.push(v.property);
          }
          return a;
        }, []);
        const nowIndex = columnsField.findIndex((v) => v === nowField);
        // 判断当前是否是可编辑倒数地二行
        const isLastColumn = nowIndex === columnsField.length - 2;
        // console.log('isLastColumn', isLastColumn)
        if (isLastColumn) {
          // 插入数据

          // 跳转到下一行
          // 判断当前是否为临时数据
          const isInsertByRow = $table.isInsertByRow(row);
          const ROW_INDEX = isInsertByRow
            ? await $table.$getRowIndex(row)
            : rowIndex;
          const insertRecords = $table.getInsertRecords(); // 临时数据
          let nextRow = {};
          // 不是最后一条临时数据
          if (isInsertByRow && insertRecords.length - 1 !== ROW_INDEX) {
            nextRow = $table.getInsertRecords()[ROW_INDEX + 1];
          } else {
            // 当前是最后一条临时数据
            if (isInsertByRow) {
              nextRow = $table.getData()[0];
            } else {
              nextRow = $table.getData()[ROW_INDEX + 1];
            }
          }
          if (nextRow) {
            await $table.scrollTo(0);
            await $table.setActiveCell(nextRow, columnsField[0]);
          }
        } else {
          // 跳转下一个编辑
          await $table.setActiveCell(row, columnsField[nowIndex + 1]);
        }
      }
    },

    keydown($event) {
      if ($event.$event.keyCode == 9) {
        this.editNextCell($event.$table);
      }
    },

    keydownEvent({ column }, event) {
      if (parseInt(event.target.value) < 1) {
        this.$Message.info("输入数字不能小于0");
        event.target.value = 1;
        return;
      }
      // if (currentNum)
      // this.keydown($event)
      // let columns=[]
      // for(var key in this.currentData[0]){
      //   columns.push({property:key})
      // }
      this.currentNum = parseInt(event.target.value) || 1;
      if (this.tabKey == 0) {
        this.currentData.map((item) => {
          item.orderQty = this.currentNum * item.qty;
        });
        this.$refs.aatable.updateData()
        this.$refs.aatable.updateFooter();
      } else {
        this.currentData.map((item) => {
          item.orderQty = this.currentNum * item.qty;
        });
        this.$refs.xTable2.updateData()
        this.$refs.xTable2.updateFooter();
      }
    },
    selectAllEvent({ checked }) {
      if (checked) {
        this.rowId = this.Leftcurrentrow.processProductVO[0].id;
      } else {
        this.rowId = "";
      }
    },
    selectChangeEvent({ checked, row }) {
      if (checked) {
        this.rowId = row.id;
      } else {
        this.rowId = "";
      }
    },
    tabChange(key) {
      this.tabKey = key;
      this.Leftcurrentrow.processProductVO = [];
      this.currentData = [];
      this.Leftcurrentrow = {
        status: {
          value: 0,
        },
        storeName: "",
        createTime: "",
        orderMan: "",
        remark: "",
        serviceId: "",
        processProductVO: [],
      };
      if (this.tabKey === 0) {
        // console.log(444444)
        this.getListzu();
      } else {
        this.getListchai();
      }
    },
    baocun1() {
      this.flag = 0;
      //如果点击保存，本次请求屏蔽保存按钮
      if (this.saveBtnClik) {
        return;
      }
      if (!this.Leftcurrentrow.storeId || !this.Leftcurrentrow.orderMan) {
        this.$Message.info("仓库和创建时间为必输项");
        return;
      }
      if (!this.Leftcurrentrow.serviceId) {
        if (this.Leftcurrentrow.xinzeng === "1") {
        } else {
          this.$Message.info("请先选择加工单");
          return;
        }
      }
      if (this.Leftcurrentrow.status.value !== 0) {
        this.$Message.info("只有草稿状态才能进行保存操作");
        return;
      }
      const params = JSON.parse(JSON.stringify(this.Leftcurrentrow));
      params.processProductVO = params.processProductVO.length
        ? params.processProductVO[0]
        : {};
      if (
        !params.processProductVO.orderQty ||
        params.processProductVO.orderQty * 1 < 1
      ) {
        this.$Message.info("组装数量必须大于0");
        return;
      }
      this.saveBtnClik = true;
      if (this.tabKey === 0) {
        // params.processProductVO.detailVOList.map(item=>{
        //   item.qty=item.changeQty
        // })
        //配件组装保存
        this.saveLoading = true;
        baocun(params)
          .then((res) => {
            // 点击列表行==>配件组装信息
            if (res.code == 0) {
              this.Leftcurrentrow.processProductVO = [];
              this.currentData = [];
              this.Leftcurrentrow.createTime = "";
              this.Leftcurrentrow.serviceId = "";
              this.Leftcurrentrow.storeId = "";
              this.Leftcurrentrow.orderMan = "";
              this.Leftcurrentrow.remark = "";
              this.getListzu();
              this.$Message.success("保存成功");
              this.saveBtnClik = false;
            }
            this.saveLoading = false;
          })
          .catch((e) => {
            this.$Message.info("保存配件组装信息失败");
            this.saveBtnClik = false;
            this.saveLoading = false;
          });
      } else {
        // 配件拆分保存
        this.saveLoading = true;
        baocun2(params)
          .then((res) => {
            // 点击列表行==>配件组装信息
            if (res.code == 0) {
              this.Leftcurrentrow.processProductVO = [];
              this.currentData = [];
              this.Leftcurrentrow.createTime = "";
              this.Leftcurrentrow.serviceId = "";
              this.Leftcurrentrow.storeId = "";
              this.Leftcurrentrow.orderMan = "";
              this.Leftcurrentrow.remark = "";
              this.leftClickItemId=null;
              this.getListchai();
              this.$Message.success("保存成功");
              this.saveBtnClik = false;
            }
            this.saveLoading = false;
          })
          .catch((e) => {
            this.$Message.info("保存配件拆分信息失败");
            this.saveBtnClik = false;
            this.saveLoading = false;
          });
      }
    },
    xinzeng() {
      this.flag = 1;
      if (this.Left.tbdata.length === 0) {
      } else {
        if (this.Left.tbdata[0]["xinzeng"] === "1") {
          this.$Message.info(
            "当前加工单列表已有一个新增单等待操作,请先保存当前操作新增单据"
          );
          return;
        }
      }
      const item = {
        index: 1,
        xinzeng: "1",
        status: {
          enum: "DRAFT",
          name: "草稿",
          value: 0,
        },
        statuName: "草稿",
        storeName: "",
        createTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        orderMan: this.$store.state.user.userData.staffName,
        remark: "",
        serviceId: "",
        processProductVO: [],
      };
      this.Left.tbdata.unshift(item);
      this.Left.tbdata.map((item, index) => {
        item.index = index + 1;
        item._highlight=false;
      });
      this.Leftcurrentrow = item;
      this.leftClickItemId=null;
      this.Leftcurrentrow._highlight=true
      // this.Left.tbdata[0]['processProductVO'] = []
      this.currentData = [];
    },
    //提交
    tijiao1() {
      this.$Modal.confirm({
        title: "是否确定提交",
        onOk: () => {
          this.editPro();
        },
        onCancel: () => {},
      });
    },
    zuofei1() {
      if (this.Leftcurrentrow.xinzeng === "1") {
        this.$Message.info("请先保存新增加工单");
        return;
      }
      if (!this.Leftcurrentrow.serviceId) {
        this.$Message.info("请先选择加工单");
        return;
      }
      if (this.Leftcurrentrow.status.value !== 0) {
        this.$Message.info("只有草稿状态加工单能进行作废操作");
        return;
      }

      this.$Modal.confirm({
        title: "是否确定作废",
        onOk: async () => {
          const id = this.Leftcurrentrow.id;
          if (this.tabKey === 0) {
            // 配件组装作废
            this.cancelLoading = true;
            zuofei(id)
              .then((res) => {
                // 点击列表行==>配件组装信息
                if (res.code == 0) {
                  this.getListzu();
                  this.$Message.success("作废成功");
                }
                this.cancelLoading = false;
              })
              .catch((e) => {
                this.$Message.info("作废配件组装信息失败");
                this.cancelLoading = false;
              });
          } else {
            // 配件拆分作废
            this.cancelLoading = true;
            zuofei2(id)
              .then((res) => {
                // 点击列表行==>配件组装信息
                if (res.code == 0) {
                  this.getListchai();
                  this.$Message.success("作废成功");
                }
                this.cancelLoading = false;
              })
              .catch((e) => {
                this.$Message.info("作废配件拆分信息失败");
                this.cancelLoading = false;
              });
          }
        },
        onCancel: () => {
          this.$Message.info("取消作废");
        },
      });
    },
    //选择单据
    selectAddlierName(row) {
      // console.log(row)
      this.Left.tbdata = [...row];
      this.Right = row;
    },
    // 新增按钮
    addProoo() {
      if (!this.Leftcurrentrow.serviceId) {
        if (this.Leftcurrentrow.xinzeng) {
        } else {
          this.$Message.info("请先选择加工单");
          return;
        }
      }
      if (this.Leftcurrentrow.status.value !== 0) {
        this.$Message.info("只有草稿状态加工单能进行选择成品操作");
        return;
      }
      if (this.Leftcurrentrow.processProductVO.length === 1) {
        this.$Message.info(
          "每个加工单只能有一个成品, 如需置换,请删除后添加成品"
        );
        return;
      }
      this.$refs.addInCom.init();
      // 获取成品列表把data赋值给子组件中
      // this.getListPro()
    },
    // 组装
    currentChangeEvent({ row }) {
      this.currentrow = row;
    },
    currentChangeEvent1({ row }) {
      this.currentrow = row;
    },
    //获取表格高度
    getDomHeight() {
      this.$nextTick(() => {
        let wrapH = this.$refs.paneLeft.offsetHeight;
        let planFormH = this.$refs.planForm.offsetHeight;
        let planBtnH = this.$refs.planBtn.offsetHeight;
        // let planPageH = this.$refs.planPage.offsetHeight;
        //获取左侧侧表格高度
        this.leftTableHeight = wrapH - 144;
        //获取右侧表格高度
        this.rightTableHeight = (wrapH - planFormH - planBtnH - 80) / 2;
      });
    },
    //切换tab
    setTab(index) {
      this.tabIndex = index;
      if (this.tabIndex == 1) {
        // console.log("配件拆分");
      }
    },
    getDataQuick(v) {
      // const params = {
      //   startTime: v[0],
      //   endTime: v[1]
      // };
      this.v1 = v;
      this.getListzu();
    },
    //快速查询日期
    getDataQuick1(v) {
      // const params = {
      //   startTime: v[0],
      //   endTime: v[1]
      // };
      this.v2 = v;
      this.getListchai();
    },
    getDataType() {
      // const params = {
      //   status: this.form.status
      // };
      this.getListzu();
    },
    getDataType1() {
      // const params = {
      //   status: this.form.status
      // };
      this.getListchai();
    },
    //更多按钮
    more() {
      this.advanced = true;
    },
    // 提交
    editPro() {
      if (this.Leftcurrentrow.xinzeng === "1") {
        this.$Message.info("请先保存新增加工单");
        return;
      }
      if (!this.Leftcurrentrow.serviceId) {
        this.$Message.info("请先选择加工单");
        return;
      }
      if (this.Leftcurrentrow.status.value === 1) {
        this.$Message.info("当前加工单号已提交审核!无需重复操作");
        return;
      }
      const params = {
        ...this.Leftcurrentrow,
      };
      params.processProductVO = params.processProductVO[0];
      if (this.tabKey === 0) {
        // 配件组装提交
        this.commitLoading = true;
        tijiao(params)
          .then((res) => {
            // 点击列表行==>配件组装信息
            if (res.code == 0) {
              this.getListzu();
              this.$Message.success("提交成功");
            }
            this.commitLoading = false;
          })
          .catch((e) => {
            this.$Message.info("提交配件组装信息失败");
            this.commitLoading = false;
          });
      } else {
        // 配件拆分提交
        this.commitLoading = true;
        tijiao2(params)
          .then((res) => {
            // 点击列表行==>配件组装信息
            if (res.code == 0) {
              this.getListchai();
              this.$Message.success("提交成功");
            }
            this.commitLoading = false;
          })
          .catch((e) => {
            this.$Message.info("提交配件拆分信息失败");
            this.commitLoading = false;
          });
      }
    },
    //作废
    cancellation() {},
    // 打印
    stamp() {},
    //左边列表选中当前行
    selectTabelData(row) {
      if (row.id) {
        this.leftClickItemId = row.id;
        for (let b of this.Left.tbdata) {
          if (b.id == this.leftClickItemId) {
            b._highlight = true;
            break;
          }else{
            b._highlight = false;
          }
        }
      }else{
        this.Left.tbdata[0]._highlight=true;
        this.leftClickItemId=this.Left.tbdata[0].id
      }
      this.Leftcurrentrow = row;
      if (this.flag === 1) {
        this.$Modal.confirm({
          title: "您正在编辑单据，是否需要保存",
          onOk: () => {
            this.baocun1();
          },
          onCancel: () => {
            if (this.tabKey === 0) {
              // 调接口获取配件组装列表信息
              this.getListzu();
            } else {
              // 调接口获取配件拆分列表信息
              this.getListchai();
            }
            this.flag = 0;
          },
        });
        return;
      }
      if (!row.processProductVO) {
        row["processProductVO"] = [];
        this.currentData = [];
      }
      if (Array.isArray(row.processProductVO)) {
        this.Leftcurrentrow.processProductVO = row.processProductVO;
      } else {
        this.Leftcurrentrow.processProductVO = [row.processProductVO];
      }
      if (this.Leftcurrentrow.processProductVO.length > 0) {
        this.currentData = row.processProductVO[0].detailVOList;
      } else {
        this.currentData = [];
      }
    },
    getWareHouse() {
      cangkulist2(this.$store.state.user.userData.shopId)
        .then((res) => {
          // 导入成品, 并把成品覆盖掉当前配件组装信息list
          if (res.code == 0) {
            res.data.map((item) => {
              item["label"] = item.name;
              item["value"] = item.id;
            });
            this.cangkuListall = res.data;
          }
        })
        .catch((e) => {
          this.$Message.info("获取仓库列表失败");
        });
    },
    //分页
    changePage(p) {
      this.Left.page.num = p;
      if (this.tabKey === 0) {
        this.getListzu();
      } else {
        this.getListchai();
      }
    },
    changeSize(size) {
      this.Left.page.size = size;
      if (this.tabKey === 0) {
        this.getListzu();
      } else {
        this.getListchai();
      }
    },
    //表格编辑状态下被关闭的事件
    editClosedEvent() {},
    //footer计算
    addFooter({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "和值";
          }
          if (["orderQty"].includes(column.property)) {
            return this.$utils.sum(data, column.property);
          }
          return null;
        }),
      ];
    },
    addFooter2({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "和值";
          }
          if (
            ["orderQty", "storeStockQty", "stockOutQty"].includes(
              column.property
            )
          ) {
            return this.$utils.sum(data, column.property);
          }
          return null;
        }),
      ];
    },
    // 确定
    Determined() {
      const params = { ...this.form, ...this.$refs.naform.getITPWE() };
      if (this.tabKey === 0) {
        this.getListzu();
      } else {
        this.getListchai();
      }
      this.$refs.naform.reset();
      this.advanced = false;
    },
    ok() {},
    cancel() {
      this.$refs.naform.reset();
      this.advanced = false;
    },
    shanchu() {
      if (this.Leftcurrentrow.status.value !== 0) {
        this.$Message.info("只有草稿状态才能进行删除操作");
        this.rowId = "";
        return;
      }
      if (!this.rowId) {
        this.$Message.info("请先选中至少一个需要删除的配件");
        return;
      }
      if (this.tabKey === 0) {
        // 组装删除
        const seleList = this.$refs.xTable1.getSelectRecords();
        const id = seleList[0].id;
        shanqu(id)
          .then((res) => {
            // 导入成品, 并把成品覆盖掉当前配件组装信息list
            if (res.code == 0) {
              // this.Leftcurrentrow.processProductVO = this.array_diff(
              //   this.Leftcurrentrow.processProductVO,
              //   seleList
              // );
              this.Leftcurrentrow.processProductVO = [];
              this.currentData = [];
              // this.getListzu(this.form);
              this.rowId = "";
              this.$Message.success("删除成功");
            }
          })
          .catch((e) => {
            this.rowId = "";
            this.$Message.info("删除成品失败");
          });
      } else {
        // 拆分删除
        const seleList = this.$refs.xTable2.getSelectRecords();
        const id = seleList[0].id;
        shanqu(id)
          .then((res) => {
            // 导入成品, 并把成品覆盖掉当前配件组装信息list
            if (res.code == 0) {
              // this.Leftcurrentrow.processProductVO = this.array_diff(
              //   this.Leftcurrentrow.processProductVO,
              //   seleList
              // );
              this.Leftcurrentrow.processProductVO = [];
              this.currentData = [];
              // this.getListchai(this.form);
              this.rowId = "";
              this.$Message.success("删除成功");
            }
          })
          .catch((e) => {
            this.rowId = "";
            this.$Message.info("删除成品失败");
          });
      }
    },
    getOkList(list) {
      list["detailVOList"] = list.detailList;
      delete list.detailList;
      this.showit = false;
      if (!this.Leftcurrentrow.processProductVO) {
        this.Leftcurrentrow.processProductVO = [list];
      } else {
        this.Leftcurrentrow.processProductVO.push(list);
      }
      this.currentData = this.Leftcurrentrow.processProductVO[0].detailVOList;
      const tata = this;
      setTimeout(() => {
        tata.showit = true;
      }, 200);
      this.$refs.addInCom.init1();
    },
    getListzu() {
      let params = { ...this.form };
      params.startTime = this.v1[0];
      params.endTime = this.v1[1];
      if (params.qucikTime) {
        (params.startTime = params.qucikTime[0]),
          (params.endTime = params.qucikTime[1]);
        delete params.qucikTime;
      } else {
        delete params.qucikTime;
      }
      this.Leftcurrentrow.processProductVO = [];
      this.currentData = [];
      peijianzuzhuang(params, this.Left.page.size, this.Left.page.num)
        .then((res) => {
          if (res.code == 0) {
            if (!res.data.content) {
              this.Left.tbdata = [];
              this.Left.page.total = 0;
            } else {
              res.data.content.map((item, index) => {
                item["index"] = index + 1;
                item["statuName"] = item.status.name;
              });
              this.Left.tbdata = res.data.content || [];
              this.Left.page.total = res.data.totalElements;
              if (this.leftClickItemId) {
                let bool=false;
                for (let b of this.Left.tbdata) {
                  if (b.id == this.leftClickItemId) {
                    bool=true
                    this.selectTabelData(b);
                    break;
                  }else{
                    bool=false;
                  }
                }
                if(!bool){
                  this.selectTabelData(this.Left.tbdata[0]);
                }
              }else{
                this.selectTabelData(this.Left.tbdata[0]);
              }
            }
          }
        })
        .catch((e) => {
          // this.$Message.info("获取配件组装列表失败");
        });
    },
    getListchai() {
      let params = { ...this.form };
      params.startTime = this.v2[0];
      params.endTime = this.v2[1];
      // if (params.qucikTime) {
      //   (params.startTime = params.qucikTime[0]),
      //     (params.endTime = params.qucikTime[1]);
      // }
      if (params.qucikTime) {
        (params.startTime = params.qucikTime[0]),
          (params.endTime = params.qucikTime[1]);
        delete params.qucikTime;
      } else {
        delete params.qucikTime;
      }
      this.Leftcurrentrow.processProductVO = [];
      this.currentData = [];
      peijianchaifen(params, this.Left.page.size, this.Left.page.num)
        .then((res) => {
          if (res.code == 0) {
            res.data.content.map((item, index) => {
              item["index"] = index + 1;
              item["statuName"] = item.status.name;
            });
            this.Left.tbdata = res.data.content || [];
            this.Left.page.total = res.data.totalElements;
            if (this.leftClickItemId) {
              let bool=false;
              for (let b of this.Left.tbdata) {
                if (b.id == this.leftClickItemId) {
                  bool=true
                  this.selectTabelData(b);
                  break;
                }else{
                  bool=false;
                }
              }
              if(!bool){
                this.selectTabelData(this.Left.tbdata[0]);
              }
            }else{
              this.selectTabelData(this.Left.tbdata[0]);
            }
          }
        })
        .catch((e) => {
        });
    },
    array_diff(a, b) {
      for (var i = 0; i < b.length; i++) {
        for (var j = 0; j < a.length; j++) {
          if (a[j].name === b[i].name) {
            a.splice(j, 1);
            j = j - 1;
          }
        }
      }
      return a;
    },
  },
  mounted() {
    if (this.tabKey === 0) {
      // 调接口获取配件组装列表信息
      this.getListzu();
    } else {
      // 调接口获取配件拆分列表信息
      this.getListchai();
    }
    this.getWareHouse(); //获取仓库列表
    setTimeout(() => {
      this.getDomHeight();
    }, 0);

    window.onresize = () => {
      this.getDomHeight();
    };
  },
};
</script>

<style lang="less" scoped>
.ivu-tabs-bar {
  margin: 0;
}
.tabs-ulwarp {
  padding-top: 17px;
  border-bottom: solid 1px #ddd;
}
.tabs {
  list-style: none;
  display: flex;
  height: 100%;

  li {
    margin: 0;
    margin-right: 4px;
    height: 31px;
    padding: 5px 16px 4px;
    border: 1px solid #ddd;
    border-bottom: 0;
    border-radius: 2px 2px 0 0;
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
    background: #f8f8f8;
    cursor: pointer;
  }

  li.tab-active {
    height: 32px;
    padding-bottom: 5px;
    background: #fff;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    border-color: #ddd;
    color: #fd5c5c;
  }
}
.page-warp {
  padding-right: 20px;
}
.look-nav {
  text-align: center;
  height: 40px;
  margin-top: 20px;
}
.con-box {
  height: 600px;
}
.w550 {
  width: 580px;
}
.mt20 {
  margin-top: 20px;
}
.look {
  width: 100px;
  height: 100px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%);
}

.goods-list-form {
  * {
    font-size: 12px !important;
  }
  .ivu-form-item {
    margin-bottom: 0px;
  }
  .plan-cz-btn {
    border-top: 1px solid #ddd;
    margin-top: 6px;
    justify-content: space-between;
    padding: 8px 10px 4px;
    align-items: center;
  }
  .t-price {
    white-space: nowrap;
  }
}
</style>
<style>
.it-box .ivu-tabs-nav-scroll {
  margin-left: 10px;
}
.it-box .ivu-tabs-bar {
  margin-bottom: 0;
}
.it-box .ivu-tabs-content.ivu-tabs-content-animated {
  height: 100%;
}
.redIT .ivu-form-item-label {
  color: red;
}
</style>
