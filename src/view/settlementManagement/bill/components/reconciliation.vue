<template>
  <div class="db">
    <Modal v-model="accountModal" title="对账单" width="1200" @on-visible-change="hander">
      <div class="content-oper content-oper-flex">
        <section class="oper-box mb10">
          <div class="oper-top flex">
            <div class="wlf">
              <div class="db ml20">
                <span>对账门店：</span>
                <Input class="w150" v-model="infoBase.orgName" readonly />
              </div>
              <div class="db ml20">
                <span>往来单位：</span>
                <Input class="w150" v-model="infoBase.guestName" readonly />
              </div>
            </div>
          </div>
        </section>
        <section class="con-box">
          <div class="inner-box">
            <Row>
              <Col span="4">
                <div style="border:1px solid #dddddd;line-height:40px" class="tc h40">已勾选明细统计</div>
              </Col>
              <Col span="5">
                <div style="border:1px solid #dddddd;line-height:40px" class="tc h40">对账申请单</div>
              </Col>
              <Col span="5">
                <div style="border:1px solid #dddddd;line-height:40px" class="tc h40">不含税对账单</div>
              </Col>
              <Col span="5">
                <div style="border:1px solid #dddddd;line-height:40px" class="tc h40">含税配件对账单</div>
              </Col>
              <Col span="5">
                <div style="border:1px solid #dddddd;line-height:40px" class="tc h40">含税油品对账单</div>
              </Col>
            </Row>
            <Row>
              <Col span="4">
                <div style="border:1px solid #dddddd;line-height:40px" class="tc h40">对账单号</div>
              </Col>
              <Col span="5">
                <div
                  style="border:1px solid #dddddd;line-height:40px"
                  class="tc h40"
                >{{accountData[3].accountNo}}
                </div>
              </Col>
              <Col span="5">
                <div
                  style="border:1px solid #dddddd;line-height:40px"
                  class="tc h40"
                >{{accountData[2].accountNo}}
                </div>
              </Col>
              <Col span="5">
                <div
                  style="border:1px solid #dddddd;line-height:40px"
                  class="tc h40"
                >{{accountData[0].accountNo }}
                </div>
              </Col>
              <Col span="5">
                <div
                  style="border:1px solid #dddddd;line-height:40px"
                  class="tc h40"
                >{{accountData[1].accountNo}}
                </div>
              </Col>
            </Row>
            <Row>
              <Col span="4">
                <div style="border:1px solid #dddddd;line-height:40px" class="tc h40">对账金额</div>
              </Col>
              <Col span="5">
                <div
                  style="border:1px solid #dddddd;line-height:40px"
                  class="tc h40"
                >{{accountData[3].accountSumAmt}}
                </div>
              </Col>
              <Col span="5">
                <div
                  style="border:1px solid #dddddd;line-height:40px"
                  class="tc h40"
                >{{accountData[2].accountSumAmt}}
                </div>
              </Col>
              <Col span="5">
                <div
                  style="border:1px solid #dddddd;line-height:40px"
                  class="tc h40"
                >{{accountData[0].accountSumAmt}}
                </div>
              </Col>
              <Col span="5">
                <div
                  style="border:1px solid #dddddd;line-height:40px"
                  class="tc h40"
                >{{accountData[1].accountSumAmt}}
                </div>
              </Col>
            </Row>
            <div class="db mt10 info" v-if="infoBase.billingType.value==0">
              <h5 class="p10">付款信息</h5>
              <div class="flex p10">
                <span>收款户名：</span>
                <Input type="text" class="w140 mr10" v-model="infoBase.collectionName" readonly />
                <span>开户行：</span>
                <Input v-model="infoBase.bankName" class="w140 mr10" readonly />
                <span>收款账号：</span>
                <Input v-model="infoBase.collectionAccount" class="w140 mr10" readonly />
                <span>本次申请付款账户：</span>
                <Input v-model="infoBase.thisPaymentAccount" class="w140 mr10" />
              </div>
            </div>
            <div class="db mt20">
              <h5>应收业务销售出库/退货对账</h5>
              <Table
                :columns="columns1"
                :data="data1"
                border
                max-height="400"
                show-summary
                ref="receivable"
              ></Table>
            </div>
            <div class="db mt20">
              <h5>应付业务采购入库/退货对账</h5>
              <Table
                :columns="columns1"
                :data="data2"
                border
                max-height="400"
                show-summary
                ref="payable"
              ></Table>
            </div>
            <div class="totalcollect p10 mt20">
              <div class="db">
                <span class="mr5">对账应收</span>
                <Input type="text" v-model="infoBase.accountReceivable" readonly class="w60 tc" />
                <span class="mr5 ml10">应收坏账</span>
                <InputNumber :min="0" v-model="infoBase.badDebtReceivable" readonly class="w60 tc" />
                <span class="mr5 ml10">应收返利</span>
                <InputNumber :min="0" v-model="infoBase.receivableRebate" readonly class="w60 tc" />
                <span class="mr5 ml10">运费</span>
                <InputNumber :min="0" v-model="infoBase.transportExpenses" readonly class="w60 tc" />
                <span class="mr5 ml10">保险费</span>
                <InputNumber :min="0" v-model="infoBase.insuranceExpenses" readonly class="w60 tc" />
                <span class="mr5 ml10">手续费</span>
                <InputNumber :min="0" v-model="infoBase.serviceCharge" readonly class="w60 tc" />
                <span class="mr5 ml10">配件管理费</span>
                <InputNumber
                  :min="0"
                  v-model="infoBase.partsManagementFee"
                  readonly
                  class="w60 tc"
                />
                <span class="mr5 ml10">其他费用</span>
                <InputNumber :min="0" v-model="infoBase.otherFees" readonly class="w60 tc" />
              </div>
              <div class="db mt10 mb10">
                <span class="mr5">对账应付</span>
                <Input type="text" v-model="infoBase.reconciliation" readonly class="w60 tc" />
                <span class="mr5 ml10">应付坏账</span>
                <InputNumber
                  v-model="infoBase.payingBadDebts"
                  readonly
                  type="text"
                  class="w60 tc"
                  :min="0"
                />
                <span class="mr5 ml10">应付返利</span>
                <InputNumber v-model="infoBase.dealingRebates" readonly class="w60 tc" :min="0" />
                <span class="mr5 ml10" style="color:#f66">实际应收合计</span>
                <Input v-model="infoBase.actualCollection" type="text" class="w60 tc" readonly />
                <span class="mr5 ml10" style="color:#f66">实际应付合计</span>
                <Input :value="infoBase.actualPayment" class="w60 tc" readonly />
                <span class="mr5 ml10">本次对账结算合计(整数收款)</span>
                <Input type="text" v-model="infoBase.settlementTotal" readonly class="w60 tc" />
              </div>
              <div class="db">
                <span class="mr5">计划结算类型</span>
                <Select class="w100" v-model="infoBase.billingType.value" readonly>
                  <Option
                    v-for="item in SettlementType"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
                <span class="mr5 ml10">应收返利请示单号</span>
                <Input type="text" v-model="infoBase.rebateNo" class="w60 tc" />
                <span class="mr5 ml10">应收坏账请示单号</span>
                <Input type="text" v-model="infoBase.badDebNo" class="w60 tc" />
                <span class="ml10" style="color:red">*</span>
                <span class="mr5">备注</span>
                <Input type="text" v-model="infoBase.remark" class="w260 tc" />
              </div>
            </div>
          </div>
        </section>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="Reconciliation" title="本次不对账" width="1200">
      <div class="flex mb20">
        <span class="mr5">门店</span>
        <Input type="text" readonly class="w140 mr15 tc" :value="store" />
        <span class="mr5">单据编号</span>
        <Input type="text" readonly class="w180 mr15 tc" :value="bill" />
        <span class="mr5">业务类型</span>
        <Input type="text" readonly class="w140 mr15 tc" :value="business" />
        <span class="mr5">往来单位信息</span>
        <Input type="text" readonly class="w140 mr15 tc" :value="thiscompanyInfo" />
        <span class="mr5">单据日期</span>
        <Input type="text" readonly class="w140 mr15 tc" :value="billDate" />
      </div>
      <Table
        :columns="Reconciliationlist"
        :data="Reconciliationcontent"
        border
        max-height="400"
        show-summary
      ></Table>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
// import selectDealings from "./component/selectCompany";
import { creat } from "../../components";
import {
  getReconciliationNo,
  getSettlement,
  Preservation,
  getStore,
  account
} from "@/api/bill/saleOrder";
import index from "@/view/admin/roles";
export default {
  data() {
    return {
      accountData: [
        { accountNo: "", accountSumAmt: "" },
        { accountNo: "", accountSumAmt: "" },
        { accountNo: "", accountSumAmt: "" },
        { accountNo: "", accountSumAmt: "" },
      ], //对账单号
      store: "", //弹框门店
      bill: "", //单据编号
      business: "", //业务类型
      thiscompanyInfo: "", //弹框往来单位
      infoBase: {
        orgId: "", //门店
        guestId: "", //往来单位
        rebateNo: "", //返利单号
        badDebNo: "", //坏帐单号
        remark: "", //备注
        accountReceivable: 0, //对账应收
        receivableRebate: 0, //应收返利
        badDebtReceivable: 0, //应收坏账
        actualCollection: 0, //实际收款
        reconciliation: 0, //对账应付
        dealingRebates: 0, //应付返利
        payingBadDebts: 0, //应付坏账
        actualPayment: 0, //实际付款
        settlementTotal: 0, //结算对账合计
        transportExpenses: 0, //运费
        insuranceExpenses: 0, //保险费
        serviceCharge: 0, //手续费
        partsManagementFee: 0, //配件管理费
        otherFees: 0, //其他费用
        collectionName: "", //收款户名
        bankName: "", //开户行
        collectionAccount: "", //收款账号
        thisPaymentAccount: "", //本次申请付款账户
        billingType: { value: 0 } //计划结算类型
      },
      billDate: "", //单据日期
      Reconciliation: false, //本次不对账弹窗
      accountModal: false, //对账单弹窗
      columns1: [
        {
          title: "序号",
          key: "index",
          width: 40,
          className: "tc"
        },
        {
          title: "客户名称",
          key: "guestName",
          className: "tc"
        },
        {
          title: "日期",
          key: "transferDate",
          className: "tc"
        },
        {
          title: "业务单据号",
          key: "serviceId",
          width: 120,
          className: "tc"
        },
        {
          title: "来源",
          key: "serviceSourceName",
          className: "tc"
        },
        {
          title: "业务类型",
          key: "serviceTypeName",
          className: "tc"
        },
        {
          title: "含税标志",
          key: "taxSignName",
          className: "tc"
        },
        // {
        //   title: "油品/配件",
        //   key: "speciesName",
        //   className: "tc"
        // },
        {
          title: "单据金额",
          key: "rpAmt",
          className: "tc"
        },
        {
          title: "前期已对账金额",
          key: "accountAmt",
          className: "tc"
        },
        {
          title: "前期未对账金额",
          key: "noAccountAmt",
          className: "tc"
        },
        {
          title: "本次不对账金额",
          key: "thisNoAccountAmt",
          className: "tc",
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
                    params.row.detailDtoList.map((item, index) => {
                      item.num = index + 1;
                      item.index = params.index;
                    });
                    this.Reconciliationcontent = params.row.detailDtoList;
                    this.store = params.row.orgName;
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
          className: "tc"
        }
      ],
      SettlementType: [
        {
          value: 0,
          label: "付款"
        },
        {
          value: 1,
          label: "收款"
        },
        {
          value: 2,
          label: "对冲"
        }
      ], //计划结算类型
      Reconciliationlist: [
        {
          title: "序号",
          type: "index",
          width: "40",
          className: "tc"
        },
        {
          title: "配件编码",
          key: "partCode",
          className: "tc"
        },
        {
          title: "配件名称",
          key: "partName",
          className: "tc"
        },
        {
          title: "规格型号",
          key: "partSpecification",
          className: "tc"
        },
        {
          title: "适用车型",
          key: "partModel",
          className: "tc"
        },
        {
          title: "单价",
          key: "price",
          className: "tc"
        },
        {
          title: "数量",
          key: "quantity",
          className: "tc"
        },
        {
          title: "金额",
          key: "amount",
          className: "tc"
        },
        {
          title: "前期已对账金额",
          key: "accountAmt",
          className: "tc"
        },
        {
          title: "前期未对账金额",
          key: "noAccountAmt",
          className: "tc"
        },
        {
          title: "本次不对账金额",
          key: "thisNoAccountAmt",
          className: "tc"
        },
        {
          title: "本次对账金额",
          key: "thisAccountAmt",
          className: "tc"
        },
        {
          title: "差异原因",
          key: "diffeReason",
          className: "tc"
        }
      ], //本次不对账弹窗配件
      data1: [], //应收数据
      data2: [], //应付数据
      Reconciliationcontent: [] //本次不对账弹窗配件
    };
  },
  methods: {
    // 对账单弹框出现加载数据
    hander(type) {
      if (type) {
        this.Initialization();
      }
    },
    // 获取数据
    Initialization() {
      let obj = { id: this.$parent.reconciliationStatement.id };
      getReconciliationNo(obj).then(res => {
        if (res.code === 0 ) {
          this.accountData = [
            {accountNo: "", accountSumAmt: ""},
            {accountNo: "", accountSumAmt: ""},
            {accountNo: "", accountSumAmt: ""},
            { accountNo: "", accountSumAmt: "" },
          ]
        res.data.one.map(item => {
          if (item.number === 1) {
            this.accountData[0] = {
              accountNo: item.accountNo,
              accountSumAmt: item.accountSumAmt
            };
          } else if (item.number === 2) {
            this.accountData[1] = {
              accountNo: item.accountNo,
              accountSumAmt: item.accountSumAmt
            };
          } else if (item.number === 3) {
            this.accountData[2] = {
              accountNo: item.accountNo,
              accountSumAmt: item.accountSumAmt
            };
          }else{
            this.accountData[3] = {
              accountNo: item.accountNo,
              accountSumAmt: item.accountSumAmt
            };
          }
        });
        res.data.two.map((item, index) => {
          item.index = index + 1;
          item.serviceTypeName = item.serviceType.name;
          item.speciesName = item.species.name;
        });
        this.data1 = res.data.two;
        res.data.three.map((item, index) => {
          item.index = index + 1;
          item.serviceTypeName = item.serviceType.name;
          item.speciesName = item.species.name;
        });
        this.data2 = res.data.three;
        this.infoBase = res.data.four[0];
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.zZindex {
  z-index: 3000 !important;
}
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
.infoBase.reconciliation,
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
</style>
