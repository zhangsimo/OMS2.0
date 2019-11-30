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
            <Select v-model="purchaseType" class="w90 mr10">
              <Option
                v-for="item in purchaseTypeArr"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </div>
          <div class="db">
            <Button
              type="default"
              class="mr10"
              @click="showModel('moreSearch')"
            >
              <Icon type="ios-more" />更多</Button
            >
          </div>
          <div class="db">
            <Button class="mr10" @click="addPro"
              ><Icon type="md-add" /> 新增</Button
            >
          </div>
          <div class="db">
            <Button type="default" @click="saveHandle" class="mr10"
              ><i class="iconfont mr5 iconbaocunicon"></i>保存</Button
            >
          </div>
          <div class="db">
            <Button class="mr10" @click="submit"
              ><i class="iconfont mr5 iconziyuan2"></i>提交</Button
            >
          </div>
          <div class="db">
            <Button @click="showModel('feeRegistration')" class="mr10"
              ><i class="iconfont mr5 iconshenheicon"></i> 退货入库</Button
            >
          </div>
          <div class="db">
            <Button @click="abandoned" class="mr10"
              ><Icon type="md-close" size="14" /> 作废</Button
            >
          </div>
          <div class="db">
            <Button @click="print" class="mr10"
              ><i class="iconfont mr5 icondayinicon"></i> 打印</Button
            >
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
                销售退货列表
              </div>
              <Table
                :height="leftTableHeight"
                @on-current-change="selectTabelData"
                size="small"
                highlight-row
                border
                :stripe="true"
                :loading="sellOrderTable.loading"
                :columns="sellOrderTable.columns"
                :data="sellOrderTable.tbdata"
              ></Table>
              <Page
                simple
                class-name="fl pt10"
                size="small"
                :current="sellOrderTable.page.num"
                :total="sellOrderTable.page.total"
                :page-size="sellOrderTable.page.size"
                @on-change="sellOrderTableChangePage"
                @on-page-size-change="sellOrderTableChangeSize"
                show-sizer
                show-total
              >
              </Page>
            </div>
            <div slot="right" class="con-split-pane-right pl5 goods-list-form">
              <div class="pane-made-hd">
                销售退货信息
              </div>
              <div class="clearfix purchase" ref="planForm">
                <Form
                  inline
                  ref="formPlan"
                  :model="formPlan"
                  :rules="rulePlan"
                  :label-width="120"
                >
                  <FormItem label="客户：" prop="supplier">
                    <Row class="w160">
                      <Col span="19"
                        ><Input
                          v-model="formPlan.supplier"
                          placeholder="请选择客户"
                      /></Col>
                      <Col span="5"
                        ><Button
                          @click="showModel('selectCustomer')"
                          class="ml5"
                          size="small"
                          type="default"
                          ><i
                            class="iconfont iconxuanzetichengchengyuanicon"
                          ></i></Button
                      ></Col>
                    </Row>
                  </FormItem>
                  <FormItem label="退货员：" prop="purchaser">
                    <Input
                      class="w160"
                      placeholder="请输入退货员"
                      v-model="formPlan.purchaser"
                    />
                  </FormItem>
                  <FormItem label="退货日期：" prop="orderDate">
                    <DatePicker
                      style="width: 160px"
                      type="date"
                      placeholder="请选择退货日期"
                      v-model="formPlan.orderDate"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="往来单号：">
                    <Input class="w160" v-model="formPlan.orderId" />
                  </FormItem>
                  <FormItem label="退货原因：" prop="ReturnType">
                    <Select class="w160" v-model="formPlan.ReturnType">
                      <Option
                        v-for="item in thTypes"
                        :key="item.value"
                        :value="item.value"
                        >{{ item.label }}</Option
                      >
                    </Select>
                  </FormItem>

                  <FormItem label="结算方式：" prop="settlement">
                    <Select class="w160" v-model="formPlan.settlement">
                      <Option
                        v-for="item in settleMethods"
                        :key="item.value"
                        :value="item.value"
                        >{{ item.label }}</Option
                      >
                    </Select>
                  </FormItem>
                  <FormItem label="备注：">
                    <Input
                      placeholder="请输入备注"
                      class="w160"
                      v-model="formPlan.mark"
                    />
                  </FormItem>
                  <FormItem label="入库仓：" prop="warehouse">
                    <Select class="w160" v-model="formPlan.warehouse">
                      <Option
                        v-for="item in inStores"
                        :key="item.value"
                        :value="item.value"
                        >{{ item.label }}</Option
                      >
                    </Select>
                  </FormItem>
                  <FormItem label="退货单号：">
                    <Input class="w160" v-model="formPlan.returnId" />
                  </FormItem>
                </Form>
              </div>
              <div class="flex plan-cz-btn" ref="planBtn">
                <div class="clearfix">
                  <div class="fl mb5">
                    <Button
                      size="small"
                      class="mr10"
                      @click="showModel('salesOutbound')"
                    >
                      选择销售出库单</Button
                    >
                  </div>
                  <div class="fl mb5">
                    <Button size="small" class="mr10"
                      ><Icon custom="iconfont iconlajitongicon icons" />
                      删除配件</Button
                    >
                  </div>
                </div>
              </div>
              <vxe-table
                border
                resizable
                show-footer
                @edit-closed="editClosedEvent"
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
                <!-- <vxe-table-column title="操作" width="80">
                  <template v-slot="{ row }">
                    <Button type="text">查看</Button>
                  </template>
                </vxe-table-column> -->

                <vxe-table-column
                  field="name"
                  title="配件编码"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="role"
                  title="配件名称"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="sex"
                  title="品牌"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column field="num" title="可退数量" width="120">
                  <template v-slot:edit="{ row }">
                    <InputNumber
                      :max="9999"
                      :min="0"
                      v-model="row.num"
                    ></InputNumber>
                  </template>
                </vxe-table-column>

                <vxe-table-column field="num" title="退货数量" width="120" :edit-render="{name: 'input'}" >
                  <template v-slot:edit="{ row }">
                    <InputNumber
                      :max="9999"
                      :min="0"
                      v-model="row.num"
                    ></InputNumber>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="price" title="单价" width="120" :edit-render="{name: 'input'}">
                  <template v-slot:edit="{ row }">
                    <InputNumber
                      :max="9999"
                      :min="0"
                      v-model="row.price"
                    ></InputNumber>
                  </template>
                  <template v-slot="{ row }">
                    {{ row.price | priceFilters }}
                  </template>
                </vxe-table-column>
                <vxe-table-column title="金额" filed="totalprice" width="120":edit-render="{name: 'input'}" >
                  <template v-slot="{ row }">
                    {{ (row.price * row.num) | priceFilters }}
                  </template>
                </vxe-table-column>
                <vxe-table-column
                  field="num6"
                  title="备注"
                  width="100"
                  :edit-render="{name: 'input'}"
                ></vxe-table-column>
                <vxe-table-column
                  field="date12"
                  title="仓库"
                 :edit-render="{name: 'select', options: inStores}"
                  width="100"

                ></vxe-table-column>
                <vxe-table-column
                  field="date12"
                  title="仓位"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="date12"
                  title="品牌车型"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="date12"
                  title="单位"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="date12"
                  title="OE码"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="date12"
                  title="规格"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column
                  field="date12"
                  title="方向"
                  width="100"
                ></vxe-table-column>

                <vxe-table-column
                  field="date12"
                  title="配件内码"
                  width="100"
                ></vxe-table-column>
              </vxe-table>
            </div>
          </Split>
        </div>
      </div>
    </section>
    <!-- 更多 -->
    <more-search ref="moreSearch"></more-search>
    <!-- 退货入库 -->
    <return-treasury ref="returnTreasury"></return-treasury>
    <!-- 供应商资料 -->
    <select-customer
      ref="selectCustomer"
      headerTit="选择客户"
    ></select-customer>

    <!-- 选择销售出库单 -->
    <sales-outbound ref="salesOutbound"></sales-outbound>
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less" scoped>
@import url("../../lease/product/lease.less");
@import url("./index");
</style>
