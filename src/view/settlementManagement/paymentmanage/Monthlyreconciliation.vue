<template>
  <div class="db">
    <Modal v-model="modal" title="对账单" width="1200" @on-visible-change="hander">
      <div class="content-oper content-oper-flex">
        <section class="oper-box mb10">
          <div class="oper-top flex">
            <div class="wlf">
              <div class="db">
                <span>快速查询：</span>
                <quickDate class="mr8" ref="quickDate" @quickDate="quickDate"></quickDate>
              </div>
              <div class="db ml10">
                <span>转单期间：</span>
                <Date-picker
                  format="yyyy-MM-dd"
                  :value="value"
                  @on-change="changedate"
                  type="daterange"
                  placeholder="选择日期"
                  class="w200"
                ></Date-picker>
              </div>
              <div class="db ml10">
                <span>对账门店：</span>
                <Select
                  filterable
                  v-model="model1"
                  class="w200"
                  @on-change="storeAccount"
                  disabled
                  clearable
                >
                  <Option
                    v-for="item in Branchstore"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}
                  </Option>
                </Select>
              </div>
              <div class="db ml10">
                <span>往来单位：</span>
                <Select
                  disabled
                  ref="companyGuset"
                  v-model="companyInfoGuestname"
                  filterable
                  remote
                  class="w150"
                  :remote-method="getOrignCompany"
                  @on-change="getAccountNameListFun"
                  :loading="searchLoading">
                  <Option v-for="(option, index) in companyList" :value="option.id" :key="index">{{option.fullName}}
                  </Option>
                </Select>
              </div>
              <div class="db ml10">
                <button class="ivu-btn ivu-btn-default" type="button" @click="query">
                  <i class="iconfont iconchaxunicon"></i>
                  <span>查询</span>
                </button>
                <button class="ivu-btn ivu-btn-default ml10" type="button" @click="moreAccountShow">
                  <span>更多</span>
                </button>
              </div>
              <div class="db ml10">
                <button
                  class="mr8 ivu-btn ivu-btn-default"
                  type="button"
                  @click="getReportReconciliationt"
                >导出对账清单
                </button>
              </div>
              <div class="db ml10">
                <Poptip placement="bottom">
                  <button class="mr8 ivu-btn ivu-btn-default" type="button" v-has="'export'">导出配件明细</button>
                  <div slot="content">
                    <button
                      class="mr8 ivu-btn ivu-btn-default"
                      type="button"
                      @click="getReportParts(0)"
                    >导出全部
                    </button>
                    <button
                      class="mr8 ivu-btn ivu-btn-default"
                      type="button"
                      @click="getReportParts(1)"
                    >导出勾选
                    </button>
                  </div>
                </Poptip>
                <Button
                  class="mr8 ivu-btn ivu-btn-default"
                  @click="preservationDraft"
                  :loading="disabledBtn"
                >保存
                </Button>
                <Button
                  class="mr8 ivu-btn ivu-btn-default"
                  v-noresub
                  @click="preservationSubmission"
                  :loading="disabledBtn"
                >提交
                </Button>
              </div>
            </div>
          </div>
        </section>
        <!--        对账单单号明细-->

        <section class="con-box">
          <div class="inner-box">
            <!--            对账单单号-->
            <Table :columns="columns" :data="data" border max-height="400" v-if="handervis"></Table>
            <div class="db mt10 info" v-show="info">
              <h5 class="p10">付款信息</h5>
              <div class="flex p10">
                <span>收款户名：</span>
                <Select
                  filterable
                  v-model="collectionUname"
                  label-in-value
                  style="width:150px;margin-right: 10px"
                  @on-change="changeCollectionUname"
                  clearable
                  @on-clear="collectionUnameClear"
                >
                  <Option
                    v-for="item in collectionList"
                    :value="item.id"
                    :key="item.id"
                  >{{ item.accountName }}
                  </Option>
                </Select>
                <span>开户行：</span>
                <Input v-model="openingBank" class="w140 mr10" readonly/>
                <span>收款账号：</span>
                <Input v-model="collectionAccount" class="w140 mr10" readonly/>
                <span style="color:red">*</span>
                <span>本次申请付款账户：</span>
                <Select
                  filterable
                  v-model="paymentUname"
                  @on-change="payMentFun"
                  label-in-value
                  style="width:150px"
                  clearable
                >
                  <Option
                    v-for="item in paymentUnameList"
                    :value="item.id"
                    :key="item.id"
                  >{{ item.accountName }}
                  </Option>
                </Select>
                <button
                  class="ml50 ivu-btn ivu-btn-default"
                  type="button"
                  @click="changeKh"
                >新增
                </button>
              </div>
            </div>
            <!-- 应收业务销售出库/退货对账 -->
            <div class="db mt20">
              <h5>应收业务销售出库/退货对账</h5>
              <vxe-table
                border
                :row-class-name="rowClassName"
                ref="receivable"
                show-overflow="title"
                max-height="300"
                auto-resize
                size="mini"
                :data="data1"
                :loading="data1Loading"
                :sort-config="{trigger: 'cell', defaultSort: {field: 'transferDate', order: 'asc'}, orders: ['desc', 'asc']}"
                @sort-change="sortMethodCollect"
                @checkbox-all="collectCheckoutAll"
                @checkbox-change="collectCheckout"
              >
                <vxe-table-column type="checkbox" width="50" fixed="left"></vxe-table-column>
                <vxe-table-column width="50" type="seq" title="序号" align="center"></vxe-table-column>
                <vxe-table-column field="guestName" title="客户名称" align="center" width="100"></vxe-table-column>
                <vxe-table-column field="transferDate" title="日期" align="center" width="100"
                                  remote-sort></vxe-table-column>
                <vxe-table-column field="serviceId" title="业务单据号" align="center" width="100"></vxe-table-column>
                <vxe-table-column field="serviceSourceName" title="来源" align="center" width="100"></vxe-table-column>
                <vxe-table-column field="serviceTypeName" title="业务类型" align="center" width="80"></vxe-table-column>
                <vxe-table-column field="taxSignName" title="含税标志" align="center" width="80"></vxe-table-column>
                <vxe-table-column field="rpAmt" title="单据金额" align="center" width="80" remote-sort></vxe-table-column>
                <vxe-table-column field="accountAmt" title="前期已对账金额" align="center" width="140"></vxe-table-column>
                <vxe-table-column field="noAccountAmt" title="前期未对账金额" align="center" width="140"></vxe-table-column>
                <vxe-table-column
                  field="thisNoAccountAmt"
                  title="本次不对账金额"
                  align="center"
                  width="140"
                >
                  <template v-slot="{row,rowIndex}">
                    <span style="cursor:pointer;color:#87CEFA" @click="openThisRec(row,rowIndex)">{{row.thisNoAccountAmt}}</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="thisAccountAmt" title="本次对账金额" align="center" width="140">
                </vxe-table-column>
                <vxe-table-column field="remark" title="订单备注" align="center" width="140">
                </vxe-table-column>
              </vxe-table>
              <vxe-pager
                background
                size="mini"
                :current-page.sync="pageObj.num"
                :page-size.sync="pageObj.size"
                :total="pageObj.total"
                @page-change="pageChange"
                :page-sizes="[50,100,200,500,1000]"
                :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']">
              </vxe-pager>
            </div>
            <!-- 应付业务采购入库/退货对账 -->
            <div class="db mt20">
              <h5>应付业务采购入库/退货对账</h5>
              <vxe-table
                border
                :row-class-name="rowClassName"
                show-overflow="title"
                max-height="300"
                auto-resize
                size="mini"
                :data="data2"
                ref="payable"
                :loading="data2Loading"
                :sort-config="{trigger: 'cell', defaultSort: {field: 'transferDate', order: 'asc'}, orders: ['desc', 'asc']}"
                @sort-change="sortMethodPay"
                @checkbox-all="paymentCheckoutAll"
                @checkbox-change="paymentCheckout"
              >
                <vxe-table-column type="checkbox" width="50" fixed="left"></vxe-table-column>
                <vxe-table-column width="50" type="seq" title="序号" align="center"></vxe-table-column>
                <vxe-table-column field="guestName" title="客户名称" align="center" width="100"></vxe-table-column>
                <vxe-table-column field="transferDate" title="日期" align="center" width="100"
                                  remote-sort></vxe-table-column>
                <vxe-table-column field="serviceId" title="业务单据号" align="center" width="100"></vxe-table-column>
                <vxe-table-column field="serviceSourceName" title="来源" align="center" width="100"></vxe-table-column>
                <vxe-table-column field="serviceTypeName" title="业务类型" align="center" width="80"></vxe-table-column>
                <vxe-table-column field="taxSignName" title="含税标志" align="center" width="80"></vxe-table-column>
                <vxe-table-column field="rpAmt" title="单据金额" align="center" width="80" remote-sort></vxe-table-column>
                <vxe-table-column field="accountAmt" title="前期已对账金额" align="center" width="140"></vxe-table-column>
                <vxe-table-column field="noAccountAmt" title="前期未对账金额" align="center" width="140"></vxe-table-column>
                <vxe-table-column
                  field="thisNoAccountAmt"
                  title="本次不对账金额"
                  align="center"
                  width="140"
                >
                  <template v-slot="{row,rowIndex}">
                    <span style="cursor:pointer;color:#87CEFA" @click="openThisRec(row,rowIndex)">{{row.thisNoAccountAmt}}</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="thisAccountAmt" title="本次对账金额" align="center" width="140">
                </vxe-table-column>
                <vxe-table-column field="remark" title="订单备注" align="center" width="140">
                </vxe-table-column>
              </vxe-table>
              <vxe-pager
                background
                size="mini"
                :current-page.sync="pageObj1.num"
                :page-size.sync="pageObj1.size"
                :total="pageObj1.total"
                @page-change="pageChange2"
                :page-sizes="[50,100,200,500,1000]"
                :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']">
              </vxe-pager>
            </div>
            <div class="totalcollect p10 mt20">
              <div class="db">
                <span class="mr5">对账应收</span>
                <Input type="text" v-model="totalcollect" readonly class="w80 tc"/>
                <span class="mr5 ml10">应收坏账</span>
                <InputNumber v-model="collectBaddebt" class="w80 tc" :readonly="totalcollect==0"/>
                <span class="mr5 ml10">应收返利</span>
                <InputNumber v-model="collectRebate" class="w80 tc" :readonly="totalcollect==0"/>
                <span class="mr5 ml10">运费</span>
                <InputNumber v-model="transportExpenses" class="w60 tc"/>
                <span class="mr5 ml10">保险费</span>
                <InputNumber v-model="insuranceExpenses" class="w60 tc"/>
                <span class="mr5 ml10">手续费</span>
                <InputNumber v-model="serviceCharge" class="w60 tc"/>
                <span class="mr5 ml10">配件管理费</span>
                <InputNumber v-model="partsManagementFee" class="w60 tc"/>
                <span class="mr5 ml10">其他费用</span>
                <InputNumber v-model="otherFees" class="w60 tc"/>
              </div>
              <div class="db mt10 mb10">
                <span class="mr5">对账应付</span>
                <Input type="text" v-model="totalpayment" readonly class="w80 tc"/>
                <span class="mr5 ml10">应付坏账</span>
                <InputNumber v-model="paymentBaddebt" type="text" class="w80 tc" :readonly="totalpayment==0"/>
                <span class="mr5 ml10">应付返利</span>
                <InputNumber v-model="paymentRebate" class="w80 tc" :readonly="totalpayment==0"/>
                <span class="mr5 ml10" style="color:#f66">实际应收合计</span>
                <Input v-model="Actualtotalcollect" type="text" class="w80 tc" readonly/>
                <span class="mr5 ml10" style="color:#f66">实际应付合计</span>
                <Input :value="Actualtotalpayment" class="w80 tc" readonly/>
                <span class="mr5 ml10">本次对账结算合计(整数收款)</span>
                <Input type="text" v-model="Reconciliationtotal" readonly class="w80 tc"/>
              </div>
              <div class="db mt10">
                <span class="mr5">计划结算类型</span>
                <Select class="w100" v-model="totalvalue" label-in-value @on-change="changeTotal">
                  <Option
                    v-for="item in SettlementType"
                    :value="item.value"
                    :key="item.value"
                    :disabled="item.disabled"
                  >{{ item.label }}
                  </Option>
                </Select>
                <span class="mr5 ml10">应收返利请示单号</span>
                <Input type="text" readonly v-model="RebateidCollect" class="w200"/>
                <button
                  class="mr8 ml10 ivu-btn ivu-btn-default"
                  type="button"
                  @click="openSelect('request')"
                >选择
                </button>
                <span class="mr5 ml10 mt10">应收坏账请示单号</span>
                <Input type="text" readonly v-model="BadDebtidCollect" class="w200"/>
                <button
                  class="mr8 ml10 ivu-btn ivu-btn-default"
                  type="button"
                  @click="openSelect('request2')"
                >选择
                </button>
              </div>
              <div class="db mt10">
                <span style="color:red">*</span>
                <span class="mr5">备注</span>
                <Input type="text" v-model="remark" class="w150 tc"/>
                <span class="mr5 ml10">应付返利请示单号</span>
                <Input type="text" readonly v-model="RebateidPayment" class="w200"/>
                <button
                  class="mr8 ml10 ivu-btn ivu-btn-default"
                  type="button"
                  @click="openSelect('requestPay')"
                >选择
                </button>
                <span class="mr5 ml10">应付坏账请示单号</span>
                <Input type="text" readonly v-model="BadDebtidPayment" class="w200"/>
                <button
                  class="mr8 ml10 ivu-btn ivu-btn-default"
                  type="button"
                  @click="openSelect('requestPay2')"
                >选择
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!-- 本次不对帐 -->
    <Modal v-model="Reconciliation" title="本次不对账" width="1200">
      <div class="flex mb20">
        <div class="db h20">
          <span class="mr5">门店</span>
          <Tooltip :content="store" max-width="140">
            <Input type="text" readonly class="w140 mr15 tc" :value="store"/>
          </Tooltip>
        </div>
        <div class="db h20">
          <span class="mr5">单据编号</span>
          <Tooltip :content="bill" max-width="200">
            <Input type="text" readonly class="w180 mr15 tc" :value="bill"/>
          </Tooltip>
        </div>
        <div class="db h20">
          <span class="mr5">业务类型</span>
          <Tooltip :content="business" max-width="140">
            <Input type="text" readonly class="w140 mr15 tc" :value="business"/>
          </Tooltip>
        </div>
        <div class="db h20">
          <span class="mr5">往来单位信息</span>
          <Tooltip :content="thiscompanyInfo" max-width="140">
            <Input type="text" readonly class="w140 mr15 tc" :value="thiscompanyInfo"/>
          </Tooltip>
        </div>
        <div class="db h20">
          <span class="mr5">单据日期</span>
          <Tooltip :content="billDate" max-width="140">
            <Input type="text" readonly class="w140 mr15 tc" :value="billDate"/>
          </Tooltip>
        </div>
      </div>
      <vxe-table
        border
        ref="xTable"
        height="500px"
        show-overflow="title"
        show-footer
        auto-resize
        size="mini"
        :footer-method="handleSummary"
        :data="Reconciliationcontent"
        :edit-rules="validRules"
        :edit-config="{trigger: 'click', mode: 'cell', showStatus: true}"
      >
        <vxe-table-column type="seq" title="序号" align="center" width="60" fixed="left"></vxe-table-column>
        <vxe-table-column field="partCode" title="配件编码" align="center" width="120" fixed="left"></vxe-table-column>
        <vxe-table-column field="partName" title="配件名称" align="center" width="120" fixed="left"></vxe-table-column>
        <vxe-table-column field="partSpecification" title="规格型号" align="center" width="80"
                          fixed="left"></vxe-table-column>
        <vxe-table-column field="partModel" title="适用车型" align="center" width="120" fixed="left"></vxe-table-column>
        <vxe-table-column field="price" title="单价" align="center" width="80"></vxe-table-column>
        <vxe-table-column field="quantity" title="数量" align="center" width="80"></vxe-table-column>
        <vxe-table-column field="amount" title="金额" align="center" width="80"></vxe-table-column>
        <vxe-table-column field="accountAmt" title="前期已对账金额" align="center" width="120"></vxe-table-column>
        <vxe-table-column field="noAccountAmt" title="前期未对账金额" align="center" width="120"></vxe-table-column>
        <vxe-table-column field="noAccountQty" title="前期未对账数量" align="center" width="120"></vxe-table-column>
        <vxe-table-column
          field="thisNoAccountQty"
          title="本次不对账数量"
          :edit-render="{name: 'input', attrs: {type: 'number'},immediate:true,events: {input: updateFooterEvent},defaultValue:0}"
          align="center"
          width="140"
        ></vxe-table-column>
        <vxe-table-column
          field="thisNoAccountAmt"
          title="本次不对账金额"
          align="center"
          width="140"
        >
          <template v-slot="{ row }">
            <span>{{ row.thisNoAccountQty*row.price | priceFilters }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column width="120" title="本次对账金额" align="center" field="thisAccountAmt">
          <template v-slot="{ row }">
            <span>{{ countAmount(row) | priceFilters }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column
          width="180"
          field="diffeReason"
          title="差异原因"
          :edit-render="{name: 'input'}"
          align="center"
        ></vxe-table-column>
      </vxe-table>
      <div slot="footer">
        <Button class="mr10" type="primary" @click="noReconciliation">确认</Button>
        <Button class="mr10" type="default" @click="Reconciliation = false">取消</Button>
      </div>
    </Modal>
    <!--更多查询-->
    <Modal v-model="accountLayer" class="accountLayer" title="高级查询" width="400">
      <!--      <p>-->
      <!--        <span class="sp-l">转单日期：</span>-->
      <!--        <DatePicker type="daterange" v-model="moreSearch.accountDate" placeholder="转单日期" style="width: 200px" @on-change="changedate"></DatePicker>-->
      <!--      </p>-->
      <p>
        <span class="sp-l">业务类型：</span>
        <Select v-model="moreSearch.businessType" style="width:200px">
          <Option v-for="item in businessArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </p>
      <p>
        <span class="sp-l">含税标识：</span>
        <Select v-model="moreSearch.taxMark" style="width:200px">
          <Option v-for="item in markArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </p>
      <p>
        <span class="sp-l">业务单号：</span>
        <Input v-model="moreSearch.orderNo" placeholder="业务单号" style="width: 200px"/>
      </p>
      <div slot="footer">
        <Button class="mr10" type="primary" @click="moreOk">确认</Button>
        <Button class="mr10" type="default" @click="accountLayer = false">取消</Button>
      </div>
    </Modal>
    <!--修改客户资料-->
    <Modal v-model="clientDataShow" title="客户资料" width="700">
      <ClientData
        :data="clientList"
        :provincearr="provinceArr"
        :treelist="treeDiagramList"
        ref="child"
      ></ClientData>
      <div slot="footer">
        <Button type="primary" @click="addNewClient">确定</Button>
        <Button type="default" @click="clientDataShow = false">取消</Button>
      </div>
    </Modal>
    <!-- 供应商资料-->
    <Modal
      v-model="clientDataShow2"
      title="供应商资料"
      width="700"
      height="2100"
    >
      <ClientData2
        :data="clientList2"
        :provincearr="provinceArr"
        :treelist="treeDiagramList2"
        ref="child2"
      ></ClientData2>
      <div class="footerMargin" slot="footer">
        <Button type="primary" @click="addNewSupplier">确定</Button>
        <Button type="default" @click="clientDataShow2=false">取消</Button>
      </div>
      <!--    选择的模态框-->
      <!--      应收返利-->
      <requestCode ref="request" @backList="getBackList"></requestCode>
      <!--      应收坏账-->
      <requestCode ref="request2" @backList="getBackList2"></requestCode>
      <!--      应付返利-->
      <requestCode ref="requestPay" @backList="getBackListPay"></requestCode>
      <!--      应付坏账-->
      <requestCode ref="requestPay2" @backList="getBackListPay2"></requestCode>
    </Modal>
  </div>
</template>

<script>
  import selectDealings from "./component/selectCompany";
  import ClientData from "../../system/essentialData/clientManagement/ClientData"
  import ClientData2 from "../../system/essentialData/supplierManagement/ClientData"
  import requestCode from "@/view/documentApproval/component/popWindow/RequestCode"
  import {
    getCustomerDetails,
    getNewClient,
    getClientTreeList
  } from "@/api/system/essentialData/clientManagement";
  import {getSupplierTreeList, getNewSupplier} from "@/api/system/essentialData/supplierManagement";
  import {
    payColMonthExportAcSta/**导出对账清单*/,
    payColMonthExportParts/**导出配件明细勾选*/,
    payColMonthExportPartsAll/**导出配件明细全部*/
  } from "@/api/settlementManagement/Import/index.js"
  import {creat} from "./../components";
  import {area} from "../../../api/lease/registerApi";
  import {
    getReconciliation,
    getSettlement,
    Preservation,
    getStore,
    getAccountName,
    getPaymentName,
    colOrPaySort/**应收、应付数据*/
  } from "@/api/bill/saleOrder";
  import index from "../../admin/roles";
  import {findGuest} from "@/api/settlementManagement/advanceCollection";
  import quickDate from "@/components/getDate/dateget_noEmit.vue";
  import moment from "moment";

  export default {
    components: {
      selectDealings,
      ClientData,
      ClientData2,
      requestCode,
      quickDate,
    },
    data() {
      const roleValid = ({cellValue, row}) => {
        let reg = /^[1-9]\d*$/
        return new Promise((resolve, reject) => {
          if (!reg.test(cellValue)) {
            row.thisNoAccountQty = 0;
            reject(new Error("请输入正整数!"));
          } else if (cellValue < 0) {
            row.thisNoAccountQty = 0;
            reject(new Error("本次不对账数量不可小于零"));
          } else if (cellValue > row.noAccountQty) {
            row.thisNoAccountQty = 0;
            reject(new Error("本次不对账数量不可大于前期未对账数量"));
          }
        })
      };
      return {
        value: [],
        disabledBtn: false,
        summer: null, //计算费用合计
        validRules: {
          thisNoAccountQty: [
            // {required: true, message: '不对账数量必填'},
            {validator: roleValid}
          ]
        },
        arrId: [],
        accountData: [], //浅拷贝数据
        handervis: false,
        collectionAccountName: "",
        openingBank: "",
        collectionAccount: "",
        thisApplyAccount: "",
        collectionAccountList: [],
        companyList: [],
        info: false,
        store: "",
        bill: "",
        business: "",
        companyInfo: "",
        thiscompanyInfo: "", //弹框往来单位
        billDate: "",
        RebateidCollect: "", //返利单号 应收
        BadDebtidCollect: "", //坏帐单号 应收
        RebateidPayment: "", //返利单号 应付
        BadDebtidPayment: "", //坏帐单号 应付
        remark: "", //备注
        totalpayment: 0, //应付合计
        paymentBaddebt: 0, //应付坏账
        paymentRebate: 0, //应付返利
        totalcollect: 0, //应收合计
        collectBaddebt: 0, //应收坏账
        collectRebate: 0, //应收返利
        transportExpenses: 0, //运费
        insuranceExpenses: 0, //保险费
        serviceCharge: 0, //手续费
        partsManagementFee: 0, //配件管理费
        otherFees: 0, //其他费用
        noPayTotal: 0,  //本次不对账合计
        totalvalue: "2",
        Reconciliation: false,
        modifyAccountAmt: 0,
        modal: false,
        Branchstore: [],
        model1: "",
        columns: [
          {
            title: "已勾选明细统计",
            key: "Detailedstatistics",
            className: "tc"
          },
          {
            title: '对账单申请',
            key: 'information',
            className: "tc"
          },
          {
            title: "不含税对账单",
            key: "Statementexcludingtax",
            className: "tc"
          },
          {
            title: "含税配件对账单",
            key: "Taxincludedpartsstatement",
            className: "tc"
          },
          {
            title: "含税油品对账单",
            key: "Statementoilincludingtax",
            className: "tc"
          }
        ],
        columns1: [
          {
            type: "selection",
            width: 40,
            align: "center"
          },
          {
            title: "序号",
            type: "index",
            width: 40,
            className: "tc"
          },
          {
            title: "客户名称",
            key: "guestName",
            className: "tc",
            minWidth: 100,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  domProps: {
                    title: params.row.guestName
                  }
                }, params.row.guestName)
              ])
            }
          },
          {
            title: "日期",
            key: "transferDate",
            className: "tc",
            sortable: true,
            minWidth: 100,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  domProps: {
                    title: params.row.transferDate
                  }
                }, params.row.transferDate)
              ])
            }
          },
          {
            title: "业务单据号",
            key: "serviceId",
            className: "tc",
            minWidth: 100,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  domProps: {
                    title: params.row.serviceId
                  }
                }, params.row.serviceId)
              ])
            }
          },
          {
            title: "来源",
            key: "serviceSourceName",
            className: "tc",
            minWidth: 100
          },
          {
            title: "业务类型",
            key: "serviceTypeName",
            className: "tc",
            width: '80'
          },
          {
            title: "含税标志",
            key: "taxSignName",
            className: "tc",
            width: '80'
          },
          // {
          //   title: "油品/配件",
          //   key: "speciesName",
          //   className: "tc"
          // },
          {
            title: "单据金额",
            key: "rpAmt",
            className: "tc",
            sortable: true,
            width: '80'
          },
          {
            title: "前期已对账金额",
            key: "accountAmt",
            className: "tc",
            minWidth: 140
          },
          {
            title: "前期未对账金额",
            key: "noAccountAmt",
            className: "tc",
            minWidth: 140
          },
          {
            title: "本次不对账金额",
            key: "thisNoAccountAmt",
            className: "tc",
            minWidth: 140,
            render: (h, params) => {
              return h(
                "span",
                {
                  style: {
                    cursor: "pointer",
                    color: "#87CEFA"
                  },
                  on: {
                    click: () => {
                      this.Reconciliation = true;
                      this.$refs.xTable.recalculate(true)
                      params.row.detailDtoList.map((item, index) => {
                        item.num = index + 1;
                        item.index = params.index;
                      });
                      this.Reconciliationcontent = params.row.detailDtoList;
                      const store = this.Branchstore.filter(
                        item => item.value === this.model1
                      );
                      this.store = store[0].label;
                      this.bill = params.row.serviceId;
                      this.business = params.row.serviceTypeName;
                      this.thiscompanyInfo = params.row.guestName;
                      this.billDate = params.row.transferDate;
                    }
                  }
                },
                params.row.thisNoAccountAmt
              );
            }
          },
          {
            title: "本次对账金额",
            key: "thisAccountAmt",
            className: "tc",
            sortable: true,
            minWidth: 140
          }
        ],
        SettlementType: [
          {
            value: "0",
            label: "付款",
            disabled: false
          },
          {
            value: "1",
            label: "收款",
            disabled: false
          },
          {
            value: "2",
            label: "对冲",
            disabled: false
          }
        ],
        data: [],
        data1: [],
        data1Loading: false,
        data2: [],
        data2Loading: false,
        Reconciliationcontent: [],
        parameter: {},
        paymentlist: [],
        collectlist: [],
        companyInfoId: "",
        flag: false,
        infoGet: [],
        //更多查询
        accountLayer: false,
        valueDate: '',
        moreSearch: {},
        businessArr: [
          {
            value: "CGRK",
            label: "采购入库"
          },
          {
            value: "CGTH",
            label: "采购退货"
          },
          {
            value: "XSCK",
            label: "销售出库"
          },
          {
            value: "XSTH",
            label: "销售退货"
          }
        ],
        markArr: [
          {
            value: '1',
            label: "是"
          },
          {
            value: '0',
            label: "否"
          }
        ],
        //收款户名
        collectionUname: '',
        collectionList: [],
        collectionObj: {},
        //付款户名
        paymentUname: '',
        paymentUnameList: [],
        paymentObj: {},
        //往来单位
        searchLoading: false,
        companyInfoGuestname: "",
        //添加客户资料修改按钮
        changeBtn: false,
        clientDataShow: false,
        clientList: {},
        provinceArr: [],
        treeDiagramList: [],
        //修改供应商资料
        clientDataShow2: false,
        clientList2: {},
        provinceArr2: [],
        treeDiagramList2: [],
        pageObj: {
          size: 50,
          total: 0,
          num: 1
        },
        pageObj1: {
          size: 50,
          total: 0,
          num: 1
        },
        copyData: [],
        copyData1: [],
        //临时存储应付业务采购入库/退货对账勾选数据
        tempPaymentlist: {},
        //临时存储应收业务销售出库/退货对账
        tempCollectlist: {},
      };
    },
    async mounted() {
      // let arr = await creat(this.$refs.quickDate.val, this.$store);
      // this.value = arr[0];
      // this.model1 = arr[1];
      // this.Branchstore = arr[2];
      // // let obj={
      // //   startDate: this.value[0]
      // //     ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
      // //     : "",
      // //   endDate: this.value[1]
      // //     ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
      // //     : ""
      // // }
      // this.$refs.quickDate.getval(1);
    },
    computed: {
      //门店禁选
      selectShopList() {
        if (this.$store.state.user.userData.currentCompany != null) {
          return this.$store.state.user.userData.currentCompany.isMaster ? true : false
        } else {
          return true
        }
      },
      //实际应付合计
      Actualtotalpayment() {
        //对账应付-应付坏账-应付返利
        this.paymentBaddebt = this.paymentBaddebt ? this.paymentBaddebt : 0;
        this.totalpayment = this.totalpayment ? this.totalpayment : 0;
        return parseFloat(
          this.totalpayment * 1 - this.paymentBaddebt * 1 - this.paymentRebate * 1
        ).toFixed(2);
      },
      //实际应收合计
      Actualtotalcollect() {
        //对账应收-应收坏账-应收返利  +运费(transportExpenses)+保险费(insuranceExpenses)+手续费(serviceCharge)+配件管理费(partsManagementFee)+其他费用(otherFees)
        this.collectBaddebt = this.collectBaddebt ? this.collectBaddebt : 0;
        this.totalcollect = this.totalcollect ? this.totalcollect : 0;
        return parseFloat(
          this.totalcollect * 1 - this.collectBaddebt * 1 - this.collectRebate * 1 + this.transportExpenses * 1 + this.insuranceExpenses * 1 + this.serviceCharge * 1 + this.partsManagementFee * 1 + this.otherFees * 1
        ).toFixed(2);
      },
      //本次对账结算合计
      Reconciliationtotal() {
        let sumAmt = parseFloat(this.Actualtotalcollect - this.Actualtotalpayment).toFixed(2);
        if (sumAmt > 0) {
          this.SettlementType.map(el => {
            if (el.value == 0) { //大于零时付款不可选
              el.disabled = true;
            } else {
              el.disabled = false;
            }
          })
        } else if (sumAmt < 0) {
          this.SettlementType.map(el => {
            if (el.value == 1) { //小于零时收款不可选
              el.disabled = true;
            } else {
              el.disabled = false;
            }
          })
        }
        if (sumAmt == 0) {
          this.SettlementType.map(el => {
            if (el.value == 2) { //等于零时收款、付款均不可选
              el.disabled = false;
            } else {
              el.disabled = true;
            }
          })
        }
        return sumAmt
      },
    },
    methods: {
      //计划结算类型
      totalvalueFun() {
        if (this.paymentlist.length !== 0 || this.collectlist.length !== 0) {
          if (this.Reconciliationtotal > 0) {
            this.info = false;
            this.totalvalue = "1";
          } else if (this.Reconciliationtotal < 0) {
            this.info = true;
            this.totalvalue = "0";
          } else {
            this.info = false;
            this.totalvalue = "2";
          }
        } else {
          this.info = false;
          this.totalvalue = "2";
        }
      },
      changeTotal() {
        if (this.totalvalue == "1" || this.totalvalue == "2") {
          this.info = false;
        } else if (this.totalvalue == "0") {
          this.info = true;
        }
      },
      pageChange({type, currentPage, pageSize, $event}) {
        this.pageObj.num = currentPage;
        this.pageObj.size = pageSize;
        this.data1 = this.changePageList(currentPage, pageSize, this.copyData);
        let currentPageArr = this.tempCollectlist['page' + currentPage];
        if (currentPageArr && currentPageArr.length && currentPageArr.length > 0) {
          this.$refs.receivable.setCheckboxRow(currentPageArr, true)
        }
      },
      pageChange2({type, currentPage, pageSize, $event}) {
        this.pageObj1.num = currentPage;
        this.pageObj1.size = pageSize;
        this.data2 = this.changePageList(currentPage, pageSize, this.copyData1);
        let currentPageArr = this.tempPaymentlist['page' + currentPage];
        if (currentPageArr && currentPageArr.length && currentPageArr.length > 0) {
          this.$refs.payable.setCheckboxRow(currentPageArr, true)
        }
      },
      changePageList(currentPage, pageSize, sourceData) {
        let firstNum = pageSize * (currentPage - 1);
        let lastNum = firstNum + pageSize;
        let arrData = (sourceData || []).slice(firstNum, lastNum);
        return arrData || [];
      },


      // 快速查询
      quickDate(data) {
        this.value = data ? data : ["", ""];
        let obj = {
          orgId: this.model1,
          startDate: this.value[0]
            ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
            : "",
          endDate: this.value[1]
            ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
            : ""
        };
        this.query(obj);
      },
      // 在值发生改变时更新表尾合计
      updateFooterEvent(params) {
        params.row.thisNoAccountAmt = params.row.thisNoAccountQty * params.row.price;
        if (params.row.amount > 0) {
          params.row.thisAccountAmt =
            this.$utils.toNumber(params.row.amount) -
            this.$utils.toNumber(params.row.accountAmt) -
            this.$utils.toNumber(params.row.thisNoAccountQty) * params.row.price
        } else {
          params.row.thisAccountAmt =
            this.$utils.toNumber(params.row.amount) -
            this.$utils.toNumber(params.row.accountAmt) -
            this.$utils.toNumber(params.row.thisNoAccountQty) * params.row.price
        }
        let xTable = this.$refs.xTable;
        xTable.updateFooter();
      },
      countAmount(row) {
        if (row.amount > 0) {
          return (
            this.$utils.toNumber(row.amount) -
            this.$utils.toNumber(row.accountAmt) -
            this.$utils.toNumber(row.thisNoAccountQty) * row.price
          );
        } else {
          return (
            this.$utils.toNumber(row.amount) -
            this.$utils.toNumber(row.accountAmt) -
            this.$utils.toNumber(row.thisNoAccountQty) * row.price
          );
        }
      },
      // 计算尾部总和
      countAllAmount(data) {
        let count = 0;
        data.forEach(row => {
          count += +this.countAmount(row);
        });
        count = count.toFixed(2);
        return count;
      },
      // 总表格合计方式
      handleSummary({columns, data}) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return "合计";
            }
            if (
              [
                "quantity",
                "amount",
                "accountAmt",
                "noAccountAmt",
                "noAccountAmt",
                "noAccountQty",
                "thisNoAccountQty",
                "thisNoAccountAmt",
                "thisAccountAmt"
              ].includes(column.property)
            ) {
              return this.$utils.sum(data, column.property);
            }
            if (columnIndex === 11) {
              return ` ${this.countAllAmount(data)} `;
            }
            return null;
          })
        ];
      },
      query() {
        this.moreSearch = {};
        this.Initialization();
      },
      //打开模态框
      openSelect(request) {
        this.$refs[request].open();
      },
      //获取选择的信息
      //应收返利
      getBackList(row) {
        this.RebateidCollect = row.applyNo;
      },
      //应收坏账
      getBackList2(row) {
        this.BadDebtidCollect = row.applyNo;
      },
      //应付返利
      getBackListPay(row) {
        this.RebateidPayment = row.applyNo;
      },
      //应付坏账
      getBackListPay2(row) {
        this.BadDebtidPayment = row.applyNo;
      },
      // 计算应收业务销售出库/退货对账的总计
      collectSum(sumData) {
        var collectSum = 0;
        sumData.map(item => {
          collectSum += parseFloat(item.thisAccountAmt)
        })
        return collectSum
      },
      // 对账单弹框出现加载数据
      async hander(type) {
        if (type) {
          let arr = await creat(this.$refs.quickDate.val, this.$store);
          this.value = arr[0];
          this.model1 = arr[1];
          this.Branchstore = arr[2];
          // let obj={
          //   startDate: this.value[0]
          //     ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
          //     : "",
          //   endDate: this.value[1]
          //     ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
          //     : ""
          // }

          this.handervis = false;
          this.flag = false;
          this.info = false;
          this.store = this.parameter.orgName;
          this.model1 = this.parameter.orgId;
          this.companyInfo = this.parameter.guestId;
          this.$refs.companyGuset.query = this.parameter.guestName;
          this.RebateidCollect = ""; //应收返利请示单号清空
          this.BadDebtidCollect = "";//应收坏账请示单号清空
          this.RebateidPayment = "";//应付返利请示单号清空
          this.BadDebtidPayment = "";//应付坏账请示单号清空
          this.remark = "";
          this.totalpayment = 0;
          this.paymentBaddebt = 0;
          this.paymentRebate = 0;
          this.totalcollect = 0;
          this.collectBaddebt = 0;
          this.collectRebate = 0;
          this.transportExpenses = 0;
          this.insuranceExpenses = 0;
          this.serviceCharge = 0;
          this.partsManagementFee = 0;
          this.otherFees = 0;
          this.collectlist = [];
          this.paymentlist = [];
          this.tempCollectlist = [];
          this.tempPaymentlist = [];
          // this.storeAccount(this.parameter.orgId);
          // this.Initialization();

          this.pageObj.size = 50;
          this.pageObj.total = 0;
          this.pageObj.num = 1;
          this.pageObj1.size = 50;
          this.pageObj1.total = 0;
          this.pageObj1.num = 1;
          this.copyData = [];
          this.copyData1 = [];

          this.$refs.quickDate.resetFun();
        }
      },
      getAccountNameListFun(v) {
        this.companyInfo = v;
        this.changeGuestName();
      },

      //往来单位切换数据还原
      changeGuestName() {
        this.info = false;
        this.handervis = false;
        this.paymentlist = [];
        this.collectlist = [];
        this.totalcollect = 0;
        this.Actualtotalcollect = 0;
        this.Actualtotalpayment = 0;
        this.Reconciliationtotal = 0;
        this.totalpayment = 0;
        this.collectBaddebt = 0;
        this.collectRebate = 0;
        this.transportExpenses = 0;
        this.insuranceExpenses = 0;
        this.serviceCharge = 0;
        this.partsManagementFee = 0;
        this.otherFees = 0;
        this.paymentBaddebt = 0;
        this.paymentRebate = 0;
        this.getAccountNameList();
        this.Initialization();
      },
      //应收 / 应付数据 排序
      async colOrPaySortMethod(data) {
        let obj = {orgId: this.model1, guestId: this.companyInfo};
        if (data) {
          obj.type = data.type;//应收1应付-1
          obj.dateSort = data.dateSort?data.dateSort:0;//日期排序 1升序 -1降序
          obj.amtSort = data.amtSort?data.amtSort:0;//单据金额 1升序 -1降序
        }
        obj.startDate = this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
          : "";
        obj.endDate = this.value[1]
          ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
          : ""
        if (obj.endDate) {
          obj.endDate = obj.endDate.split(' ')[0] + " 23:59:59"
        }
        if (this.moreSearch.businessType) {
          obj.serviceType = this.moreSearch.businessType;
        }
        if (this.moreSearch.orderNo) {
          obj.serviceId = this.moreSearch.orderNo;
        }
        if (this.moreSearch.orderNo) {
          obj.serviceId = this.moreSearch.orderNo;
        }
        if (this.moreSearch.taxMark) {
          obj.taxSign = this.moreSearch.taxMark;
        }
        if (data.type == 1) {
          this.data1Loading = true;
          this.data1 = [];
        } else if(data.type == -1) {
          this.data2Loading = true;
          this.data2 = []
        }
        let res = await colOrPaySort(obj);
        if (res.code === 0) {
          if (data.type == 1) {
            this.data1Loading = false;
            this.data1 = res.data;
          }  else if(data.type == -1)  {
            this.data2Loading = false;
            this.data2 = res.data;
          }
        }
      },
      // 获取数据
      Initialization(data) {
        // let { orgId, startDate, endDate, guestId } = this.parameter;
        let obj = {orgId: this.model1, guestId: this.companyInfo};
        // if(this.moreSearch.accountDate&&this.moreSearch.accountDate.length>0&&this.moreSearch.accountDate[0]&&this.moreSearch.accountDate[1]) {
        obj.startDate = this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
          : "";
        obj.endDate = this.value[1]
          ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
          : ""
        // }
        if (obj.endDate) {
          obj.endDate = obj.endDate.split(' ')[0] + " 23:59:59"
        }
        if (this.moreSearch.businessType) {
          obj.serviceType = this.moreSearch.businessType;
        }
        if (this.moreSearch.orderNo) {
          obj.serviceId = this.moreSearch.orderNo;
        }
        if (this.moreSearch.orderNo) {
          obj.serviceId = this.moreSearch.orderNo;
        }
        if (this.moreSearch.taxMark) {
          obj.taxSign = this.moreSearch.taxMark;
        }
        this.data1Loading = true;
        this.data2Loading = true;
        this.data1 = [];
        this.data2 = [];

        this.pageObj.total = 0;
        this.pageObj.num = 1;
        this.pageObj1.total = 0;
        this.pageObj1.num = 1;
        getReconciliation(obj).then(res => {
          this.data1Loading = false;
          this.data2Loading = false;
          for (let i of res.data.one) {
            if (i.number === 3) {
              this.arrId[0] = i.accountNo;
            } else if (i.number === 1) {
              this.arrId[1] = i.accountNo;
            } else if (i.number === 2) {
              this.arrId[2] = i.accountNo;
            } else {
              this.arrId[3] = i.accountNo;
            }
          }

          if (res.data.two.length !== 0) {
            res.data.two.map(item => {
              item.serviceTypeName = item.serviceType.name;
              item.speciesName = item.species.name;
            });
            this.copyData = res.data.two;
            this.pageObj.total = res.data.two.length;
            this.data1 = this.changePageList(this.pageObj.num, this.pageObj.size, this.copyData);
          } else {
            this.data1 = [];
          }
          if (res.data.three.length !== 0) {
            res.data.three.map(item => {
              item.serviceTypeName = item.serviceType.name;
              item.speciesName = item.species.name;
            });
            // this.data2 = res.data.three;

            this.copyData1 = res.data.three;
            this.pageObj1.total = res.data.three.length;
            this.data2 = this.changePageList(this.pageObj1.num, this.pageObj1.size, this.copyData1);

          } else {
            this.data2 = [];
          }
        });
      }, // 对账门店
      storeAccount(val) {
        this.info = false;
        this.handervis = false;
        this.paymentlist = [];
        this.collectlist = [];
        this.totalcollect = 0;
        this.Actualtotalcollect = 0;
        this.Actualtotalpayment = 0;
        this.Reconciliationtotal = 0;
        this.getPaymentNameList();
        this.Initialization();
      },
      // 切换往来单位
      companySelect(val) {
        this.infoGet.map(item => {
          if (item.id === val) {
            // this.collectionAccountList.push({
            //   value: 0,
            //   label: item.receiveName
            // });
            this.collectionAccountName = item.accountReceiveName; // item.receiveName;
            this.openingBank = item.accountBank;
            this.collectionAccount = item.accountBankNo;
          }
        });
      },
      // 已勾选结算类型计算
      getSettlementComputed() {
        let obj = {
          one: this.collectlist,
          two: this.paymentlist,
          three: [
            {
              transportExpenses: this.transportExpenses,
              insuranceExpenses: this.insuranceExpenses,
              serviceCharge: this.serviceCharge,
              partsManagementFee: this.partsManagementFee,
              otherFees: this.otherFees,
              payingBadDebts: this.paymentBaddebt,
              dealingRebates: this.paymentRebate,
              badDebtReceivable: this.collectBaddebt,
              receivableRebate: this.collectRebate
            }
          ]
        };
        getSettlement(obj).then(res => {
          this.handervis = true;
          this.data = [
            {
              Detailedstatistics: "对账单号",
              information: this.collectlist.length > 0 || this.paymentlist.length > 0 ? this.arrId[3] : "",
              Statementexcludingtax: res.data.hasOwnProperty("one")
                ? this.arrId[0]
                : "",
              Taxincludedpartsstatement: res.data.hasOwnProperty("two")
                ? this.arrId[1]
                : "",
              Statementoilincludingtax: res.data.hasOwnProperty("three")
                ? this.arrId[2]
                : ""
            },
            {
              Detailedstatistics: "对账金额",
              information: this.collectlist.length > 0 || this.paymentlist.length > 0 ? this.Reconciliationtotal : "",
              Statementexcludingtax: res.data.hasOwnProperty("one")
                ? res.data.one
                : "",
              Taxincludedpartsstatement: res.data.hasOwnProperty("two")
                ? res.data.two
                : "",
              Statementoilincludingtax: res.data.hasOwnProperty("three")
                ? res.data.three
                : ""
            }
          ];

        });
      },
      //获取收款户名
      async getAccountNameList(type) {
        this.collectionUname = "";
        this.openingBank = "";
        this.collectionAccount = "";
        let rep = await getAccountName({"guestId": this.companyInfo});
        if (rep.code == 0) {
          this.collectionList = rep.data;
          if (rep.data.length <= 0) {
            this.changeBtn = true;
          } else {
            this.changeBtn = false;
            //修改收款户默认选中第一条
            if (type) {
              this.collectionUname = this.collectionList[0].id;
              this.openingBank = this.collectionList[0].accountBank;
              this.collectionAccount = this.collectionList[0].accountBankNo;
            }
          }
        }
      },
      changeCollectionUname(v) {
        this.collectionObj = v;
        let arrData = this.collectionList.filter(item => item.id == this.collectionUname);
        if (arrData.length > 0) {
          this.openingBank = arrData[0].accountBank;
          this.collectionAccount = arrData[0].accountBankNo;
        } else {
          this.openingBank = "";
          this.collectionAccount = "";
        }
      },
      collectionUnameClear() {
        this.changeCollectionUname();
      },

      payMentFun(v) {
        this.paymentObj = v;
      },

      //获取付款户名
      async getPaymentNameList() {
        let rep = await getPaymentName({"orgId": this.model1});
        if (rep.code == 0) {
          this.paymentUnameList = rep.data;
        }
      },

      //获取往来单位
      async getOrignCompany(query) {
        if (query !== '') {
          this.searchLoading = true;
          let req = {
            fullName: query,
            size: 100,
          }
          let rep = await findGuest(req);
          this.searchLoading = false;
          if (rep.code == 0) {
            this.companyList = rep.data.content;
          }
        } else {
          this.companyList = [];
        }
      },


      // 应付选中
      paymentCheckout({selection, row}) {
        this.setTempPaymentList(selection);
        this.getSettlementComputed();
        this.getAccountNameList();
        this.getPaymentNameList();
        this.totalvalueFun();
      },

      // 应收选中
      collectCheckout({selection, row}) {
        this.setTempCollectlist(selection);
        this.getSettlementComputed();
        this.getAccountNameList();
        this.getPaymentNameList();
        this.totalvalueFun();
      },
      // 应收全选
      collectCheckoutAll({selection}) {
        this.setTempCollectlist(selection);
        this.getSettlementComputed();
        this.getAccountNameList();
        this.getPaymentNameList();
        this.totalvalueFun();
      },
      //应收 排序
      sortMethodCollect({column, property, order}) {
        //order:asc 升序 desc 降序
        //property:多个排序时所点击的头部
        //column:本列
        let data = {
          type: 1
        };
        switch (property) {
          case "transferDate":
            data.dateSort = order == "asc" ? 1 : -1;
            data.amtSort ? delete data.amtSort : "";
            break;
          case "rpAmt":
            data.amtSort = order == "asc" ? 1 : -1;
            data.dateSort ? delete data.dateSort : "";
            break;
        }
        this.colOrPaySortMethod(data);
      },
      setTempCollectlist(selection) {
        this.tempCollectlist['page' + this.pageObj.num] = selection;
        this.totalcollect = 0;
        // this.Actualtotalcollect = 0;
        this.collectlist = [];
        for (let k in this.tempCollectlist) {
          let total = 0;
          this.collectlist = [...this.collectlist, ...this.tempCollectlist[k]];
          total = this.tempCollectlist[k].reduce((pre, curr) => {
            if (!isNaN(Number(curr.thisAccountAmt))) {
              return pre + parseFloat(curr.thisAccountAmt);
            }
          }, 0);
          this.totalcollect += total;
        }
        this.totalcollect = this.totalcollect.toFixed(2);

      },


      //选中提醒
      tipText(row) {
        let dartArr = row.filter(item => item.existDraft === 1);
        if (dartArr.length == 1) {
          this.$Modal.warning({
            title: "提示",
            content: "该业务单号已存在" + dartArr[0].draftUname + "草稿箱中，请及时提交申请"
          })
        }
        if (dartArr.length > 1) {
          let isRepeatArr = dartArr.filter(item => item.draftUname == dartArr[0].draftUname)
          if (isRepeatArr.length == dartArr.length) {
            this.$Modal.warning({
              title: "提示",
              content: "置灰的业务单号已存在" + dartArr[0].draftUname + "草稿箱中，请及时提交申请"
            })
          } else {
            this.$Modal.warning({
              title: "提示",
              content: "置灰的业务单号已存在草稿箱中，请及时提交申请"
            })
          }
        }
      },
      // 应付全选
      paymentCheckoutAll({selection}) {
        this.setTempPaymentList(selection);
        this.getSettlementComputed();
        this.getAccountNameList();
        this.getPaymentNameList();
        this.totalvalueFun();
      },
      //应付 排序
      sortMethodPay({column, property, order}) {
        //order:asc 升序 desc 降序
        //property:多个排序时所点击的头部
        //column:本列
        let data = {
          type: -1
        };
        switch (property) {
          case "transferDate":
            data.dateSort = order == "asc" ? 1 : -1;
            data.amtSort ? delete data.amtSort : "";
            break;
          case "rpAmt":
            data.amtSort = order == "asc" ? 1 : -1;
            data.dateSort ? delete data.dateSort : "";
            break;
        }
        this.colOrPaySortMethod(data);
      },
      setTempPaymentList(selection) {
        this.tempPaymentlist['page' + this.pageObj1.num] = selection;
        this.totalpayment = 0;
        this.paymentlist = [];
        for (let k in this.tempPaymentlist) {
          this.paymentlist = [...this.paymentlist, ...this.tempPaymentlist[k]];
          let total = this.tempPaymentlist[k].reduce((pre, curr) => {
            if (!isNaN(Number(curr.thisAccountAmt))) {
              return pre + parseFloat(curr.thisAccountAmt);
            }
          }, 0);
          this.totalpayment += total;
        }
        this.totalpayment = this.totalpayment.toFixed(2);
      },

      // 应付取消选中
      paymentNoCheckout(selection, row) {
        this.paymentlist = selection;
        this.totalpayment -= row.thisAccountAmt;
        this.getSettlementComputed();
        this.getAccountNameList();
        this.getPaymentNameList();
        this.totalvalueFun();
      },
      // 应收取消选中
      collectNoCheckout(selection, row) {
        this.collectlist = selection;
        this.totalcollect -= row.thisAccountAmt;
        this.getSettlementComputed();
        this.getAccountNameList();
        this.getPaymentNameList();
        this.totalvalueFun();
      },
      // 应付取消全选
      paymentNoCheckoutAll() {
        this.paymentlist = [];
        this.totalpayment = 0;
        this.Actualtotalpayment = 0;
        this.getSettlementComputed();
        this.getAccountNameList();
        this.getPaymentNameList();
        this.totalvalueFun();
      },
      // 应收取消全选
      collectNoCheckoutAll() {
        this.collectlist = [];
        this.totalcollect = 0;
        this.Actualtotalcollect = 0;
        this.getSettlementComputed();
        this.getAccountNameList();
        this.getPaymentNameList();
        this.totalvalueFun();
      },
      // 本次不对帐金额弹窗
      async noReconciliation() {
        const errMap = await this.$refs.xTable.validate().catch(errMap => errMap)
        let sum = 0;
        let boolShow = true;
        let reg = /^[1-9]\d*$/
        this.Reconciliationcontent.map(item => {
          item.thisNoAccountAmt = this.$utils.toNumber(item.thisNoAccountQty) * item.price
          sum += item.thisNoAccountAmt * 1;
          if (this.$utils.toNumber(item.thisNoAccountQty) > item.noAccountQty || this.$utils.toNumber(item.thisNoAccountQty) < 0) {
            boolShow = false;
          }
          // if(item.thisNoAccountQty && !reg.test(item.thisNoAccountQty)){
          //   boolShow=false;
          // }
          // if(item.diffeReason && item.diffeReason.trim()=="" || !item.diffeReason){
          //   boolShow=false;
          // }
        });
        if (!errMap && boolShow) {
          const index = this.Reconciliationcontent[0].index;
          if (this.business === "销售退货" || this.business === "销售出库") {

            //金额为负数是退货
            let sum1 = 0;
            if (this.data1[index].rpAmt >= 0) {
              sum1 =
                this.data1[index].rpAmt - this.data1[index].accountAmt - sum;

              if (sum > this.data1[index].rpAmt - this.data1[index].accountAmt)
                return this.$message.error(
                  "本次不对账合计不能大于总金额减去前期已对账"
                );
            } else {
              sum1 =
                this.data1[index].rpAmt - this.data1[index].accountAmt - sum;

              if (
                sum + (this.data1[index].rpAmt - this.data1[index].accountAmt) >
                0
              )
                return this.$message.error(
                  "本次不对账合计不能大于总金额减去前期已对账"
                );
            }
            this.$set(this.data1[index], "thisNoAccountAmt", sum);
            this.$set(this.data1[index], "thisAccountAmt", sum1);
            this.$set(this.data1[index], 'detailDtoList', this.Reconciliationcontent)
            let sum3 = 0
            this.data1.forEach(item => {
              sum3 += parseFloat(item.thisAccountAmt)
            })
            this.totalcollect = sum3
            this.Actualtotalcollect = sum3
            this.setTempCollectlist(this.collectlist);
            this.getSettlementComputed();
            this.getAccountNameList();
            this.getPaymentNameList();
            this.totalvalueFun();
          } else {
            let sum1 = 0
            // this.data2[index].rpAmt - this.data2[index].accountAmt - sum;
            if (this.data2[index].rpAmt >= 0) {
              sum1 =
                this.data2[index].rpAmt - this.data2[index].accountAmt - sum;
              if (sum > this.data2[index].rpAmt - this.data2[index].accountAmt)
                return this.$message.error(
                  "本次不对账合计不能大于总金额减去前期已对账"
                );
            } else {
              sum1 =
                this.data2[index].rpAmt - this.data2[index].accountAmt - sum;
              if (
                sum + (this.data2[index].rpAmt + this.data2[index].accountAmt) >
                0
              )
                return this.$message.error(
                  "本次不对账合计不能大于总金额减去前期已对账"
                );
            }
            this.$set(this.data2[index], "thisNoAccountAmt", sum);
            this.$set(this.data2[index], "thisAccountAmt", sum1);
            this.$set(this.data2[index], 'detailDtoList', this.Reconciliationcontent)
            let sum3 = 0
            this.data2.forEach(item => {
              sum3 += parseFloat(item.thisAccountAmt)
            })
            this.totalpayment = sum3
            this.Actualtotalpayment = sum3
            this.setTempPaymentList(this.paymentlist);
            this.getSettlementComputed();
            this.getAccountNameList();
            this.getPaymentNameList();
            this.totalvalueFun();
          }
          this.Reconciliation = false;
        } else {
          this.$message.error("信息填写错误");
          return
        }
      },
      // 保存接口
      getPreservation(num) {
        //判断是否存在草稿占用
        let selectArrData = [...this.collectlist, ...this.paymentlist]
        let dartArr = selectArrData.filter(item => item.existDraft === 1);
        if (dartArr.length > 0) {
          this.tipText(selectArrData);
          return
        }

        if (this.totalvalue === "0") {
          if (num === 1 && !this.collectionUname)
            return this.$message.error("收款户名不能为空");
          if (num === 1 && !this.openingBank) return this.$message.error("开户行不能为空");
          if (num === 1 && !this.collectionAccount)
            return this.$message.error("银行账号不能为空");
          if (num === 1 && !this.paymentUname)
            return this.$message.error("付款账户不能为空");
        }
        if (num != 0) {
          if (this.collectBaddebt > 100) {
            if (!this.BadDebtidCollect) {
              // this.$message.error("请输入应收坏账请示单号");
              this.$message({
                message: "请输入应收坏账请示单号",
                type: "error",
                customClass: "zZindex"
              });
              return "";
            }
          }
          if (this.paymentBaddebt < -100) {
            if (!this.BadDebtidPayment) {
              this.$message({
                message: "请输入应付坏账请示单号",
                type: "error",
                customClass: "zZindex"
              });
              return "";
            }
          }
          if (this.collectRebate > 100) {
            if (!this.RebateidCollect) {
              // this.$message.error("请输入应收返利请示单号");
              this.$message({
                message: "请输入应收返利请示单号",
                type: "error",
                customClass: "zZindex"
              });
              return "";
            }
          }
          if (this.paymentRebate < -100) {
            if (!this.RebateidPayment) {
              this.$message({
                message: "请输入应付返利请示单号",
                type: "error",
                customClass: "zZindex"
              });
              return "";
            }
          }
        }
        if (this.collectlist.length !== 0 || this.paymentlist.length !== 0) {
          if (num != 0) {
            if (!this.remark) {
              // this.$message.error("请填写备注");
              this.$message({
                message: "请填写备注",
                type: "error",
                customClass: "zZindex"
              });
              return "";
            }
          }
          let one = [
            {
              number: "3",
              accountNo: this.data[0].Statementexcludingtax,
              accountSumAmt: this.data[1].Statementexcludingtax
            },
            {
              number: "1",
              accountNo: this.data[0].Taxincludedpartsstatement,
              accountSumAmt: this.data[1].Taxincludedpartsstatement
            },
            {
              number: "2",
              accountNo: this.data[0].Statementoilincludingtax,
              accountSumAmt: this.data[1].Statementoilincludingtax
            },
            {
              number: "0",
              accountNo: this.data[0].information,
            }
          ];
          let four = [
            {
              tenantId: this.$store.state.user.userData.tenantId,
              orgId: this.model1,
              orgName: this.store,
              guestId: this.companyInfo,
              serviceId: "XSCDS001-20191000071",
              accountReceivable: this.totalcollect,
              badDebtReceivable: this.collectBaddebt,
              receivableRebate: this.collectRebate,
              actualCollection: this.Actualtotalcollect,
              reconciliation: this.totalpayment,
              payingBadDebts: this.paymentBaddebt,
              dealingRebates: this.paymentRebate,
              actualPayment: this.Actualtotalpayment,
              settlementTotal: this.Reconciliationtotal,
              billingType: this.totalvalue,
              rebateNo: this.RebateidCollect, //应收返利请示单号
              badDebNo: this.BadDebtidCollect,//应收坏账请示单号
              payingRebateNo: this.RebateidPayment, //应付返利请示单号
              payingBadDebtNo: this.BadDebtidPayment,//应付坏账请示单号
              buttonStatus: num,
              incomeType: this.totalvalue,
              remark: this.remark,
              collectionName: this.collectionObj ? this.collectionObj.label : '',
              collectionId: this.collectionUname || "",
              bankName: this.openingBank,
              collectionAccount: this.collectionAccount,
              thisPaymentAccount: this.paymentObj.label,
              thisPaymentAccountId: this.paymentUname,
              transportExpenses: this.transportExpenses,
              insuranceExpenses: this.insuranceExpenses,
              serviceCharge: this.serviceCharge,
              partsManagementFee: this.partsManagementFee,
              otherFees: this.otherFees
            }
          ];
          let obj = {
            one,
            two: this.collectlist,
            three: this.paymentlist,
            four
          };
          this.disabledBtn = true;
          Preservation(obj).then(res => {
            setTimeout(() => {
              this.disabledBtn = false;
            }, 500)
            if (res.code === 0) {
              // this.$message.success("保存成功");
              if (num == 0) {
                this.$message({
                  message: "草稿保存成功",
                  type: "success",
                  customClass: "zZindex"
                });
              } else {
                this.$message({
                  message: "提交成功",
                  type: "success",
                  customClass: "zZindex"
                });
              }

              this.modal = false;
            } else if (res.code === 1) {
              this.$Message.error(res.message)
            }
          }).catch(err => {
            setTimeout(() => {
              this.disabledBtn = false;
            }, 500)
          });
        } else {
          // this.$message.error("请选择要对账的数据");
          return this.$message({
            message: "请选择要对账的数据",
            type: "error",
            customClass: "zZindex"
          });
          setTimeout(() => {
            this.disabledBtn = false;
          }, 500)
        }
      },
      // 保存草稿
      preservationDraft() {
        this.getPreservation(0);
      },
      // 保存并提交
      preservationSubmission() {
        this.getPreservation(1);
      },
      // 对账清单导出
      getReportReconciliationt() {
        if (this.paymentlist.length !== 0 || this.collectlist.length !== 0) {
          let str = "";
          this.paymentlist.map(item => {
            str += `serviceIdList=${item.serviceId}&`;
          });
          this.collectlist.map(item => {
            str += `serviceIdList=${item.serviceId}&`;
          });
          location.href = payColMonthExportAcSta(str);
        } else {
          // this.$message.error("请勾选要导出的对账清单");
          this.$message({
            message: "请勾选要导出的对账清单",
            type: "error",
            customClass: "zZindex"
          });
        }
      },
      // 导出配件明细
      getReportParts(type) {
        if (type == 1) {
          if (this.paymentlist.length !== 0 || this.collectlist.length !== 0) {
            let str1 = "";
            let str2 = "";
            this.paymentlist.map(item => {
              str1 += `${item.serviceId}*${1 * item.serviceType.value + 1},`;
            });
            this.collectlist.map(item => {
              str2 += `${item.serviceId}*${1 * item.serviceType.value + 1},`;
            });
            str1 = str1.substring(0, str1.length - 1);
            str2 = str2.substring(0, str2.length - 1);
            // console.log(str1,str2)
            location.href = payColMonthExportParts(str1, str2)
          } else {
            // this.$message.error("请先勾选数据");
            this.$message({
              message: "请先勾选数据",
              type: "error",
              customClass: "zZindex"
            });
          }
        } else {
          let obj = {orgId: this.model1, guestId: this.companyInfo};
          obj.startDate = this.value[0]
            ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
            : ""
          obj.endDate = this.value[1]
            ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
            : ""
          if (this.moreSearch.businessType) {
            obj.serviceType = this.moreSearch.businessType;
          }
          if (this.moreSearch.orderNo) {
            obj.serviceId = this.moreSearch.orderNo;
          }
          if (this.moreSearch.orderNo) {
            obj.serviceId = this.moreSearch.orderNo;
          }
          if (this.moreSearch.taxMark) {
            obj.taxSign = this.moreSearch.taxMark;
          }
          location.href = payColMonthExportPartsAll(obj)
        }
      },
      //更多查询
      moreAccountShow() {
        this.accountLayer = true;
        this.moreSearch = {}
      },
      // 选择日期
      changedate(daterange) {
        this.quickDate(daterange)
      },
      moreOk() {
        this.Initialization();
        this.accountLayer = false;
        this.moreSearch = {}
      },
      rowClassName({row, rowIndex}) {
        if (row.existDraft === 1) {
          return 'Isdraft';
        }
        return '';
      },
      //修改收款账户
      async changeKh() {
        this.getAdress();
        let rep = await getCustomerDetails({id: this.companyInfo});
        if (rep.code == 0) {
          //修改供应商
          if (this.paymentlist.length > 0 || (this.paymentlist.length > 0 && this.collectlist.length > 0)) {
            this.clientDataShow2 = true;
            this.getList2();
            this.clientList2 = rep.data || {};
            this.clientList2.isDisabled == 1
              ? (this.clientList2.isDisabled = true)
              : (this.clientList2.isDisabled = false);
            this.clientList2.isClient == 1
              ? (this.clientList2.isClient = true)
              : (this.clientList2.isClient = false);
            this.clientList2.belongSystem = JSON.parse(
              this.clientList2.belongSystem
            ).value;
            // this.clientList = this.pitchSupplierOne;
            this.$refs.child2.financeList = this.clientList2.guestAccountVoList
          }
          //修改客户
          if (this.collectlist.length > 0 && this.paymentlist.length == 0) {
            this.clientDataShow = true;
            this.getList();
            this.clientList = rep.data || {};
            this.clientList.isNeedPack = this.clientList.isNeedPack == 1 ? true : false
            this.clientList.isFatCompany = this.clientList.isFatCompany == 1 ? true : false
            this.clientList.isDisabled = this.clientList.isDisabled == 1 ? true : false
            this.clientList.isSupplier = this.clientList.isSupplier == 1 ? true : false
            this.clientList.belongSystem = JSON.parse(this.clientList.belongSystem).value
            this.$refs.child.placeList = this.clientList.guestLogisticsVOList;
            this.$refs.child.relevanceClientShow = this.clientList.guestVOList;
            this.$refs.child.invoice = this.clientList.guestTaxpayerVOList;
            this.$refs.child.financeList = this.clientList.guestAccountVoList
          }
        }
      },
      //获取地址
      getAdress() {
        area().then(res => {
          if (res.code == 0) {
            this.provinceArr = res.data;
          }
        });
      },
      //新增客户确认
      addNewClient() {
        this.$refs.child.handleSubmit(async () => {
          let data = {};
          data = this.clientList;
          data.isNeedPack ? (data.isNeedPack = 1) : (data.isNeedPack = 0);
          data.isSupplier ? (data.isSupplier = 1) : (data.isSupplier = 0);
          data.isDisabled ? (data.isDisabled = 1) : (data.isDisabled = 0);
          data.isFatCompany = data.isFatCompany ? 1 : 0
          let res = await getNewClient(this.clientList);
          if (res.code == 0) {
            this.clientDataShow = false;
            this.$refs.child.invoice = [];
            this.getAccountNameList("add");
          }
        });
      },
      //确认添加一条信息
      addNewSupplier() {
        this.$refs.child2.$refs.form.validate(async valid => {
          if (valid) {
            let data = this.clientList2;
            data.isDisabled ? (data.isDisabled = 1) : (data.isDisabled = 0);
            data.isClient ? (data.isClient = 1) : (data.isClient = 0);
            let res = await getNewSupplier(data);
            if (res.code === 0) {
              this.clientDataShow2 = false;
              this.getAccountNameList("add");
            }
          } else {
            this.$Message.error("信息填写错误");
          }
        });
      },
      //获取客户分类
      getList() {
        getClientTreeList().then(res => {
          if (res.code == 0) {
            res.data.map(item => {
              item.children = [];
              item.code = item.id;
            });
            this.treeDiagramList = res.data || [];
          }
        });
      },
      //获取供应商分类
      getList2() {
        getSupplierTreeList().then(res => {
          if (res.code == 0) {
            res.data.map(item => {
              item.children = [];
              item.code = item.id;
            });
            this.treeDiagramList2 = res.data || [];
          }
        })
      },

      //销售出库，本次不对账金额弹窗
      openThisRec(row, i) {
        this.Reconciliation = true;
        this.$refs.xTable.recalculate(true)
        row.detailDtoList.map((item, index) => {
          item.num = index + 1;
          item.index = i;
        });
        this.Reconciliationcontent = row.detailDtoList;
        const store = this.Branchstore.filter(
          item => item.value === this.model1
        );
        this.store = store[0].label;
        this.bill = row.serviceId;
        this.business = row.serviceTypeName;
        this.thiscompanyInfo = row.guestName;
        this.billDate = row.transferDate;
      }
    },
    watch: {
      //应收坏账
      collectBaddebt: {
        handler(val, ov) {
          if (val !== ov) {
            this.getSettlementComputed(val);
          }
        }
      },
      //应收返利
      collectRebate: {
        handler(val, ov) {
          if (val !== ov) {
            this.getSettlementComputed(val);
          }
        }
      },
      //运费
      transportExpenses: {
        handler(val, ov) {
          if (val !== ov) {
            this.getSettlementComputed(val);
          }
        }
      },
      //保险费
      insuranceExpenses: {
        handler(val, ov) {
          if (val !== ov) {
            this.getSettlementComputed(val);
          }
        }
      },
      //手续费
      serviceCharge: {
        handler(val, ov) {
          if (val !== ov) {
            this.getSettlementComputed(val);
          }
        }
      },
      //其他费用
      otherFees: {
        handler(val, ov) {
          if (val !== ov) {
            this.getSettlementComputed(val);
          }
        }
      },
      //应付坏账
      paymentBaddebt: {
        handler(val, ov) {
          if (val !== ov) {
            this.getSettlementComputed(val);
          }
        }
      },
      //应付返利
      paymentRebate: {
        handler(val, ov) {
          if (val !== ov) {
            this.getSettlementComputed(val);
          }
        }
      },
      //配件管理费
      partsManagementFee: {
        handler(val, ov) {
          if (val !== ov) {
            this.getSettlementComputed(val);
          }
        }
      },
    }
  };
</script>

<style lang="less" scoped>
  .oper-top input {
    border: 1px solid #dddddd;
    text-indent: 4px;
  }

  .oper-top .input {
    position: relative;
    left: -26px;
    bottom: -5px;
  }

  .totalcollect,
  .totalpayment,
  .total {
    border: 1px solid #dddddd;
  }

  .info {
    border: 1px solid #dddddd;
  }

  .info > h5 {
    border-bottom: 1px solid #dddddd;
    background-color: #f8f8f8;
  }

  .info .flex {
    align-items: center;
  }

  .info .flex i {
    position: relative;
    left: -30px;
  }

  .zZindex {
    z-index: 9999 !important;
  }

  .accountLayer {
    p {
      padding-bottom: 20px;
    }

    .sp-l {
      display: inline-block;
      width: 100px;
      text-align: right;
    }
  }
</style>
<style lang="less">
  .ivu-table .Isdraft * {
    color: #bbb;
  }
</style>
