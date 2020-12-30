<template>
  <main
    class="bigBox loadingClass"
    style="
      background-color: #fff;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      padding-top: 5px;
      height: 100%;
    "
  >
    <div class="content-oper content-oper-flex" style="box-shadow: none">
      <section class="oper-box">
        <div class="oper-top flex">
          <div class="wlf">
            <div class="db">
              <span>快速查询：</span>
              <quick-date
                ref="quickdate"
                class="mr10"
                v-on:quickDate="getDataQuick1"
              ></quick-date>
              <Select
                v-model="purchaseType"
                @on-change="getDataType1"
                class="w90 mr10"
              >
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
                @click="addmore"
                class="mr10"
                v-has="'more'"
              >
                <i class="el-icon-more"></i>
                更多
              </Button>
            </div>
            <div class="db">
              <Button class="mr10" @click="add" v-has="'add'">
                <Icon type="md-add" />新增
              </Button>
            </div>
            <div class="db">
              <Button
                type="default"
                class="mr10"
                v-has="'save'"
                @click="baocun"
                :loading="saveLoading"
                :disabled="flag == false||!bcflag"
              >
                <i class="iconfont mr5 iconbaocunicon"></i>保存
              </Button>
            </div>
            <div class="db">
              <Button
                class="mr10"
                v-has="'tijiao'"
                @click="tijiao"
                :loading="commitLoading"
                :disabled="
                  row.orderSign != 0 ||
                  mainId == '' ||
                  tjflag == false
                "
              >
                提交
              </Button>
            </div>
            <div class="db">
              <Button
                class="mr10"
                @click="stamp"
                :loading="cancelLoading"
                v-has="'stamp'"
              >
                打印
              </Button>
            </div>
            <div class="db">
              <Button
                class="mr10"
                v-has="'watchke'"
                @click="watchke"
                :loading="cancelLoading"
              >
                查看客户
              </Button>
            </div>
        </div>
        </div>
      </section>
      <section class="con-box">
        <div class="inner-box">
          <div class="con-split" ref="paneLeft">
            <Split v-model="split1" min="200">
              <div
                slot="left"
                class="con-split-pane-left"
                style="overflow-y: auto; height: 100%"
              >
                <div class="pane-made-hd">单据列表</div>
                <vxe-table
                  border
                  ref="xTable"
                  resizable
                  size="mini"
                  align="center"
                  auto-resize
                  resizeable
                  highlight-hover-row
                  highlight-current-row
                  show-overflow
                  @current-change="getOneClinet"
                  :height="leftTableHeight"
                  :data="tableList"
                >
                  <vxe-table-column
                    type="seq"
                    title="序号"
                    width="60"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="orderSignStatus"
                    title="状态"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="guestName"
                    title="理赔单位"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="serviceId"
                    title="理赔单号"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="createUname"
                    title="创建人"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="createTime"
                    title="创建日期"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="print"
                    title="打印次数"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="orderMan"
                    title="提交人"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="orderDate"
                    title="提交日期"
                    width="100"
                  ></vxe-table-column>
                </vxe-table>
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
                  :page-size-opts="[20, 30, 40, 50]"
                ></Page>
              </div>
              <div
                slot="right"
                class="con-split-pane-right pl5 goods-list-form"
              >
                <div class="clearfix purchase" ref="planForm">
                  <Form
                    inline
                    :show-message="false"
                    ref="formPlan"
                    :label-width="100"
                  >
                    <span class="xin">*</span>
                    <FormItem label="理赔单位：">
                      <Tooltip
                        :content="form.units"
                        placement="bottom"
                        max-width="140"
                      >
                        <Input
                          show-overflow="tooltip"
                          :disabled="flag == false || row.manualCode"
                          v-model="form.units"
                          class="w160"
                        />
                      </Tooltip>
                    </FormItem>
                    <Button
                      class="ml5 btn1"
                      size="small"
                      type="default"
                      :disabled="flag == false || row.manualCode"
                      @click="addSuppler"
                    >
                      <Icon type="md-checkmark" />
                    </Button>
                    <span class="xin">*</span>
                    <FormItem label="理赔日期：">
                      <!-- :disabled=" Leftcurrentrow.xinzeng || Leftcurrentrow.status.value !== 0" -->
                      <DatePicker
                        v-model="form.afterSaleDate"
                        format="yyyy-MM-dd"
                        type="date"
                        class="w160"
                        :disabled="flag == false || row.manualCode"
                      ></DatePicker>
                    </FormItem>
                    <FormItem label="备注：">
                      <Tooltip
                        :content="form.remark"
                        placement="bottom"
                        max-width="180"
                      >
                        <Input
                          show-overflow="bottom"
                          :disabled="flag == false"
                          v-model="form.remark"
                          class="w160"
                          maxlength="255"
                        />
                      </Tooltip>
                    </FormItem>
                    <FormItem label="理赔单号：">
                      <!--                          :disabled="form.status.value !== 0"-->
                      <Tooltip
                        :content="form.serviceId"
                        placement="bottom"
                        max-width="180"
                      >
                        <Input
                          show-overflow="bottom"
                          class="w160"
                          v-model="form.serviceId"
                          disabled
                        />
                      </Tooltip>
                    </FormItem>
                    <FormItem label="手工单号：">
                      <!-- :disabled="form.status.value !== 0" -->
                      <Tooltip
                        :content="form.moblenumber"
                        placement="bottom"
                        max-width="180"
                      >
                        <Input
                          show-overflow="tooltip"
                          class="w160"
                          v-model="form.moblenumber"
                          disabled
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
                        @click="changep"
                        v-has="'addpj'"
                        :disabled="flag == false || row.manualCode"
                      >
                        添加配件
                      </Button>
                    </div>
                    <div class="fl mb5">
                      <div
                        slot="content"
                        class="flex"
                        style="justify-content: space-between"
                      >
                        <div class="flex mr10">
                          <Upload
                            ref="upload1"
                            :show-upload-list="false"
                            :action="upurlInnerId"
                            :headers="headers"
                            :format="['xlsx', 'xls']"
                            :on-format-error="onFormatError"
                            :on-success="onSuccess"
                            :before-upload="beforeUploadInnerId"
                          >
                            <Button
                              size="small"
                              v-has="'Import'"
                              :disabled="
                                row.orderSign !=0||
                                row.manualCode ||
                                peiflag == true
                              "
                              @click="getRUlInnerId"
                              ><span class="center"
                                ><Icon
                                  custom="iconfont icondaoruicon icons"
                                />配件导入</span
                              >
                            </Button>
                          </Upload>
                        </div>
                      </div>
                    </div>
                    <div class="fl mb5">
                      <Button
                        size="small"
                        class="btns"
                        @click="downInnerId"
                        v-has="'down'"
                      >
                        <Icon custom="iconfont iconxiazaiicon icons" />下载模板
                      </Button>
                    </div>
                    <div class="fl mb5">
                      <Button
                        size="small"
                        class="mr10"
                        v-has="'del'"
                        @click="shanchu"
                        :disabled="row.manualCode||row.orderSign!=0"
                      >
                        删除配件
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
                  align="center"
                  show-footer
                  :footer-method="footerMethod"
                  highlight-current-row
                  highlight-hover-row
                  :keyboard-config="{
                    isArrow: true,
                    isDel: true,
                    isEnter: true,
                    isTab: true,
                    isEdit: true,
                  }"
                  @keydown="keydown"
                  @current-change="logDataMethod"
                  @select-all="selectAllEvent"
                  @checkbox-change="selectChangeEvent"
                  :height="rightTableHeight"
                  :data="details"
                  :edit-config="{trigger: 'click', mode: 'cell',method:updateFooterEvent}"
                >
                  <vxe-table-column
                    show-overflow="tooltip"
                    type="seq"
                    width="60"
                    title="序号"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    type="checkbox"
                    width="60"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="partInnerId"
                    title="配件内码"
                    width="100"
                  ></vxe-table-column>
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
                    field="afterSaleQty"
                    title="理赔数量"
                    width="100"
                  >
                    <template v-slot="{ row }">
                      <vxe-input
                        type="number"
                        :disabled="form.moblenumber != ''"
                        :min="1"
                        v-model="row.afterSaleQty"
                        :controls="false"
                        :precision="0"
                        @change="afterSaleQtyChange(row)"
                        size="mini"
                      />
                    </template>
                  </vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="afterSaleReason"
                    title="理赔原因"
                    width="100"
              
                  >
                  <template v-slot="{ row }">
                      <vxe-input
                        type="string"
                            @change="afterSaleReasonChange(row)"
                        v-model="row.afterSaleReason"
                        :controls="false"
                        :precision="0"
                        size="mini"
                      />
                  </template>
                  </vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="processedQty"
                    title="已处理数量"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="untreatedQty"
                    title="未处理数量"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="oemCode"
                    title="OE码"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="carModelName"
                    title="品牌车型"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="spec"
                    title="规格"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="carBrandName"
                    title="厂牌"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="unit"
                    title="单位"
                    width="120"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="direction"
                    title="方向"
                    width="100"
                  ></vxe-table-column>
                </vxe-table>

                <div class="wrapper" style="margin-top: 20px">
                  <div style="margin: 5px 10px">处理日志</div>
                  <vxe-table
                    border
                    resizable
                    size="mini"
                    align="center"
                    :height="rightTableHeight"
                    :data="currentData"
                    :edit-config="{ trigger: 'click', mode: 'cell' }"
                  >
                    <vxe-table-column
                      show-overflow="tooltip"
                      type="seq"
                      width="60"
                      title="序号"
                    ></vxe-table-column>
                    <vxe-table-column
                      show-overflow="tooltip"
                      field="createTime"
                      title="操作日期"
                      width="100"
                    ></vxe-table-column>
                    <vxe-table-column
                      show-overflow="tooltip"
                      field="direction"
                      title="方向"
                      width="100"
                    ></vxe-table-column>
                    <vxe-table-column
                      show-overflow="tooltip"
                      field="guestName"
                      title="往来单位名称"
                      width="100"
                    ></vxe-table-column>
                    <vxe-table-column
                      show-overflow="tooltip"
                      field="recordTypeStatus"
                      title="处理类型"
                      width="100"
                    ></vxe-table-column>
                    <vxe-table-column
                      show-overflow="tooltip"
                      field="recordQty"
                      title="数量"
                      width="100"
                    >
                      <!--                          <template v-slot="{ row, seq }">-->
                      <!--                            <span>{{ row.qty * currentNum }}</span>-->
                      <!--                          </template>-->
                    </vxe-table-column>
                    <vxe-table-column
                      show-overflow="tooltip"
                      field="createUname"
                      title="操作人"
                      width="100"
                    ></vxe-table-column>
                    <vxe-table-column
                      field="afterSaleCode"
                      show-overflow="tooltip"
                      title="处理单号"
                      width="100"
                    >
                    </vxe-table-column>
                    <vxe-table-column
                      show-overflow="tooltip"
                      field="remark"
                      title="备注"
                      width="100"
                    ></vxe-table-column>
                    <vxe-table-column
                      show-overflow="tooltip"
                      field="returnCode"
                      title="返回单号"
                      width="120"
                    ></vxe-table-column>
                  </vxe-table>
                </div>
              </div>
            </Split>
          </div>
        </div>
      </section>
      <!--添加配件//SelectPartRef-->
      <select-part-com
        ref="SelectPartRef"
        :formPlanmain="formPlan"
        @selectPartName="getPartNameList"
        :is-show-add-part-btn="true"
        :noDBclick="true"
      ></select-part-com>
      <!--更多弹框-->
      <!--      客户资料-->

      <Modal v-model="clientDataShow" title="客户资料" width="700">
        <ClientData
          :data="clientList"
          :provincearr="provinceArr"
          :treelist="treeDiagramList"
          :dis="nameChange"
          ref="child"
        ></ClientData>
        <div slot="footer">
          <b @click="clientDataShow = false" class="close">关闭</b>
          <!-- <Button type="primary" @click="addNewClient">确定</Button>
        <Button type="default" @click="">取消</Button> -->
        </div>
      </Modal>
      <More
        ref="more"
        :getShowMore="showMore"
        @getMoreStatus="openMoreflag"
        @getMoreData="openMoreData"
      ></More>

      <select-supplier
        ref="selectSupplier"
        header-tit="客户资料"
        @getOne="getSupplierNamea"
      ></select-supplier>
      <Print ref="printZF" v-show="false"></Print>
    </div>
  </main>
  <!-- 配件组装 -->
</template>

<script src="./index.ts">
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
  /* // height: 100%; */
}
.redIT .ivu-form-item-label {
  color: red;
}
.close {
  color: skyblue;
}
.close:hover {
  cursor: pointer;
}
.btns {
  margin: 0 15px;
}
.xin {
  position: relative;
  color: red;
  left: 20px;
  top: 8px;
}
.btn1 {
  position: relative;
  left: -5px;
  top: 5px;
}
</style>
