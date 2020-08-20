<template>
  <div class="db mt10 clearfix">
    <div class="clearfix">
      <div class="db ml10 fr">
        <button
          class="mr10 ivu-btn ivu-btn-default"
          type="button"
          @click="preservationDraft"
          v-if="!disabletype"
        >保存草稿
        </button>
        <button
          class="mr10 ivu-btn ivu-btn-default"
          type="button"
          @click="preservationSubmission"
          v-if="!disabletype"
        >提交
        </button>
      </div>
    </div>
    <div class="content-oper content-oper-flex">
      <section class="oper-box mb10">
        <div class="oper-top flex">
          <div class="wlf">
            <div class="db ml20">
              <span>对账门店：</span>
              <Input class="w150" v-model="infoBase.orgName" readonly/>
            </div>
            <div class="db ml20">
              <span>往来单位：</span>
              <Input class="w150" v-model="infoBase.guestName" readonly/>
            </div>
          </div>
        </div>
      </section>
      <section class="con-box">
        <div class="inner-box">
          <Row>
            <Col span="6">
              <div style="border:1px solid #dddddd;line-height:40px" class="tc h40">已勾选明细统计</div>
            </Col>
            <Col span="6">
              <div style="border:1px solid #dddddd;line-height:40px" class="tc h40">不含税对账单</div>
            </Col>
            <Col span="6">
              <div style="border:1px solid #dddddd;line-height:40px" class="tc h40">含税配件对账单</div>
            </Col>
            <Col span="6">
              <div style="border:1px solid #dddddd;line-height:40px" class="tc h40">含税油品对账单</div>
            </Col>
          </Row>
          <Row>
            <Col span="6">
              <div style="border:1px solid #dddddd;line-height:40px" class="tc h40">对账单号</div>
            </Col>
            <Col span="6">
              <div
                style="border:1px solid #dddddd;line-height:40px"
                class="tc h40"
              >{{accountData[2].accountNo}}
              </div>
            </Col>
            <Col span="6">
              <div
                style="border:1px solid #dddddd;line-height:40px"
                class="tc h40"
              >{{accountData[0].accountNo }}
              </div>
            </Col>
            <Col span="6">
              <div
                style="border:1px solid #dddddd;line-height:40px"
                class="tc h40"
              >{{accountData[1].accountNo}}
              </div>
            </Col>
          </Row>
          <Row>
            <Col span="6">
              <div style="border:1px solid #dddddd;line-height:40px" class="tc h40">对账金额</div>
            </Col>
            <Col span="6">
              <div
                style="border:1px solid #dddddd;line-height:40px"
                class="tc h40"
              >{{accountData[2].accountSumAmt}}
              </div>
            </Col>
            <Col span="6">
              <div
                style="border:1px solid #dddddd;line-height:40px"
                class="tc h40"
              >{{accountData[0].accountSumAmt}}
              </div>
            </Col>
            <Col span="6">
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
              <!--              <span>收款户名：</span>-->
              <!--              <Input type="text" class="w140 mr10" v-model="infoBase.collectionName" readonly />-->
              <!--              <span>开户行：</span>-->
              <!--              <Input v-model="infoBase.bankName" class="w140 mr10" readonly />-->
              <!--              <span>收款账号：</span>-->
              <!--              <Input v-model="infoBase.collectionAccount" class="w140 mr10" readonly />-->
              <!--              <span>本次申请付款账户：</span>-->
              <!--              <Input v-model="infoBase.thisPaymentAccount" class="w140 mr10" />-->

              <span>收款户名：</span>
              <Select
                filterable
                v-model="infoBase.collectionName"
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
              <Input v-model="infoBase.bankName" class="w140 mr10" readonly/>
              <span>收款账号：</span>
              <Input v-model="infoBase.collectionAccount" class="w140 mr10" readonly/>
              <span style="color:red">*</span>
              <span>本次申请付款账户：</span>
              <!--<Input v-model="thisApplyAccount" class="w140 mr10" />-->
              <Select
                filterable
                v-model="infoBase.thisPaymentAccount"
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
              <Input type="text" v-model="infoBase.accountReceivable" readonly class="w60 tc"/>
              <span class="mr5 ml10">应收坏账</span>
              <InputNumber :min="0" v-model="infoBase.badDebtReceivable" :disabled="disabletype" class="w60 tc"/>
              <span class="mr5 ml10">应收返利</span>
              <InputNumber :min="0" v-model="infoBase.receivableRebate" :disabled="disabletype" class="w60 tc"/>
              <span class="mr5 ml10">运费</span>
              <InputNumber :min="0" v-model="infoBase.transportExpenses" :disabled="disabletype" class="w60 tc"/>
              <span class="mr5 ml10">保险费</span>
              <InputNumber :min="0" v-model="infoBase.insuranceExpenses" :disabled="disabletype" class="w60 tc"/>
              <span class="mr5 ml10">手续费</span>
              <InputNumber :min="0" v-model="infoBase.serviceCharge" :disabled="disabletype" class="w60 tc"/>
              <span class="mr5 ml10">配件管理费</span>
              <InputNumber :min="0" v-model="infoBase.partsManagementFee" :disabled="disabletype" class="w60 tc"/>
              <span class="mr5 ml10">其他费用</span>
              <InputNumber :min="0" v-model="infoBase.otherFees" :disabled="disabletype" class="w60 tc"/>
            </div>
            <div class="db mt10 mb10">
              <span class="mr5">对账应付</span>
              <Input type="text" v-model="infoBase.reconciliation" readonly class="w60 tc"/>
              <span class="mr5 ml10">应付坏账</span>
              <InputNumber
                v-model="infoBase.payingBadDebts"
                :disabled="disabletype"
                type="text"
                class="w60 tc"
                :min="0"
              />
              <span class="mr5 ml10">应付返利</span>
              <InputNumber v-model="infoBase.dealingRebates" :disabled="disabletype" class="w60 tc" :min="0"/>
              <span class="mr5 ml10" style="color:#f66">实际应收合计</span>
              <Input v-model="Actualtotalcollect" type="text" class="w60 tc" :disabled="disabletype"/>
              <span class="mr5 ml10" style="color:#f66">实际应付合计</span>
              <Input :value="Actualtotalpayment" class="w60 tc" :disabled="disabletype"/>
              <span class="mr5 ml10">本次对账结算合计(整数收款)</span>
              <Input type="text" v-model="Reconciliationtotal" :disabled="disabletype" class="w60 tc"/>
            </div>
            <div class="db">
              <span class="mr5">计划结算类型</span>
              <Select class="w100" v-model="infoBase.billingType.value" disabled>
                <Option
                  v-for="item in SettlementType"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}
                </Option>
              </Select>
              <span class="mr5 ml10">应收返利请示单号</span>
              <Input type="text" v-model="infoBase.rebateNo" class="w60 tc" :disabled="disabletype"/>
              <span class="mr5 ml10">应收坏账请示单号</span>
              <Input type="text" v-model="infoBase.badDebNo" class="w60 tc" :disabled="disabletype"/>
              <span class="ml10" style="color:red">*</span>
              <span class="mr5">备注</span>
              <Input type="text" v-model="infoBase.remark" class="w260 tc" :disabled="disabletype"/>
            </div>
          </div>
        </div>
      </section>
    </div>
    <Modal v-model="Reconciliation" title="本次不对账" width="1200">
      <div class="flex mb20">
        <span class="mr5">门店</span>
        <Input type="text" readonly class="w140 mr15 tc" :value="store"/>
        <span class="mr5">单据编号</span>
        <Input type="text" readonly class="w180 mr15 tc" :value="bill"/>
        <span class="mr5">业务类型</span>
        <Input type="text" readonly class="w140 mr15 tc" :value="business"/>
        <span class="mr5">往来单位信息</span>
        <Input type="text" readonly class="w140 mr15 tc" :value="thiscompanyInfo"/>
        <span class="mr5">单据日期</span>
        <Input type="text" readonly class="w140 mr15 tc" :value="billDate"/>
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
      <requestCode ref="request" @backList="getBackList"></requestCode>
      <requestCode ref="request2" @backList="getBackList2"></requestCode>
    </Modal>
  </div>
</template>

<script>
  import {creat} from "@/view/settlementManagement/components";
  import {
    getReconciliation,
    getSettlement,
    Preservation,
    getStore,
    getAccountName,
    getPaymentName
  } from "@/api/bill/saleOrder";
  import {getReconciliationNo, CheckForSave, CheckForSubmit} from "@/api/bill/saleOrder";
  import {getThisAllList} from '@/api/documentApproval/documentApproval/documentApproval'
  import {getCustomerDetails} from "../../../../api/system/essentialData/clientManagement";
  import {getNewSupplier, getSupplierTreeList} from "../../../../api/system/essentialData/supplierManagement";
  import {area} from "../../../../api/lease/registerApi";
  import {getGuestShortName} from "@/api/documentApproval/documentApproval/documentApproval";
  import ClientData from "@/view/system/essentialData/clientManagement/ClientData"
  import ClientData2 from "@/view/system/essentialData/supplierManagement/ClientData"
  import requestCode from "@/view/documentApproval/component/popWindow/RequestCode"
  import selectDealings from "../../../settlementManagement/paymentmanage/component/selectCompany";

  export default {
    // props: ["id"],
    props: ["modelType", 'list'],
    data() {
      return {
        accountData: [
          {accountNo: "", accountSumAmt: ""},
          {accountNo: "", accountSumAmt: ""},
          {accountNo: "", accountSumAmt: ""}
        ], //对账单号
        store: "", //弹框门店
        bill: "", //单据编号
        business: "", //业务类型
        companyInfo: "",
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
          actualCollection: this.Actualtotalcollect, //实际收款
          reconciliation: 0, //对账应付
          dealingRebates: 0, //应付返利
          payingBadDebts: 0, //应付坏账
          actualPayment: this.Actualtotalpayment, //实际付款
          settlementTotal: this.Reconciliationtotal, //结算对账合计
          transportExpenses: 0, //运费
          insuranceExpenses: 0, //保险费
          serviceCharge: 0, //手续费
          partsManagementFee: 0, //配件管理费
          otherFees: 0, //其他费用
          collectionName: "", //收款户名
          bankName: "", //开户行
          collectionAccount: "", //收款账号
          thisPaymentAccount: "", //本次申请付款账户
          billingType: {value: 0} //计划结算类型
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
            key: "Detailedstatistics",
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
        Reconciliationcontent: [], //本次不对账弹窗配件
        disabletype: false,//编辑状态
        collectionList: [],
        model1: "",
        paymentUnameList: [],
        provinceArr: [],
        clientDataShow2: false,
        treeDiagramList2: [],
        clientList2: []
      };
    },
    async mounted() {
      let arr = await creat({}, this.$store);
      this.model1 = arr[1];
      await this.getPaymentNameList()
    },
    components: {
      selectDealings,
      ClientData,
      ClientData2,
      requestCode,
    },
    computed: {
      //实际应付合计
      Actualtotalpayment() {
        //对账应付-应付坏账-应付返利
        this.infoBase.payingBadDebts = this.infoBase.payingBadDebts ? this.infoBase.payingBadDebts : 0;
        this.infoBase.dealingRebates = this.infoBase.dealingRebates ? this.infoBase.dealingRebates : 0;
        return (
          this.infoBase.reconciliation * 1 - this.infoBase.payingBadDebts * 1 - this.infoBase.dealingRebates * 1
        );
      },
      //实际应收合计
      Actualtotalcollect() {
        //对账应收-应收坏账-应收返利  +运费(infoBase.transportExpenses)+保险费(infoBase.insuranceExpenses)+手续费(infoBase.serviceCharge)+配件管理费(infoBase.partsManagementFee)+其他费用(infoBase.otherFees)
        this.infoBase.badDebtReceivable = this.infoBase.badDebtReceivable ? this.infoBase.badDebtReceivable : 0;
        this.infoBase.accountReceivable = this.infoBase.accountReceivable ? this.infoBase.accountReceivable : 0;
        return (
          this.infoBase.accountReceivable * 1 - this.infoBase.badDebtReceivable * 1 - this.infoBase.receivableRebate * 1 + this.infoBase.transportExpenses * 1 + this.infoBase.insuranceExpenses * 1 + this.infoBase.serviceCharge * 1 + this.infoBase.partsManagementFee * 1 + this.infoBase.otherFees * 1
        );
      },
      //本次对账结算合计
      Reconciliationtotal() {
        return this.Actualtotalcollect - this.Actualtotalpayment;
      },
    },
    methods: {
      // 获取数据
      async Initialization() {
        this.accountData = [
          {accountNo: "", accountSumAmt: ""},
          {accountNo: "", accountSumAmt: ""},
          {accountNo: "", accountSumAmt: ""}
        ]
        if (this.modelType.type == 3) {
          this.disabletype = true
        } else {
          this.disabletype = false
        }
        if (this.modelType.id) {
          // console.log(this.modelType)
          let data = {};
          data.id = this.modelType.id || ''
          let res = await getThisAllList(data)
          if (res.code == 0) {
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
            if(this.infoBase.guestName!=""){
              getGuestShortName({shortName:this.infoBase.guestName,size:50}).then(res2 => {
                let arr = []
                if (res2.code === 0) {
                  res2.data.content.map(item => {
                    arr.push({
                      value: item.id,
                    });
                  });
                  this.companyInfo = arr[0].value
                  this.getAccountNameList();
                }
              })
            }
          }
        } else {
          getReconciliationNo({id: this.id}).then(res => {
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
            getGuestShortName({shortName:this.infoBase.guestName,size:50}).then(res2 => {
              let arr = []
              if (res2.code === 0) {
                res2.data.content.map(item => {
                  arr.push({
                    value: item.id,
                  });
                });
                this.companyInfo = arr[0].value
                this.getAccountNameList();
              }
            })
          });
        }

      },
      async getAccountNameList(type) {
        this.infoBase.collectionName = "";
        this.infoBase.bankName = "";
        this.infoBase.collectionAccount = "";
        let rep = await getAccountName({"guestId": this.companyInfo});
        if (rep.code == 0) {
          this.collectionList = rep.data;
          if (rep.data.length <= 0) {
            this.changeBtn = true;
          } else {
            this.changeBtn = false;
            //修改收款户默认选中第一条
            if (type) {
              this.infoBase.collectionName = this.collectionList[0].id;
              this.infoBase.bankName = this.collectionList[0].accountBank;
              this.infoBase.collectionAccount = this.collectionList[0].accountBankNo;
            }
          }
        }
      },
      //获取付款户名
      async getPaymentNameList() {
        let rep = await getPaymentName({"orgId": this.model1});
        if (rep.code == 0) {
          this.paymentUnameList = rep.data;
        }
      },
      changeCollectionUname(v) {
        this.collectionObj = v;
        let arrData = this.collectionList.filter(item => item.id == this.infoBase.collectionName);
        if (arrData.length > 0) {
          this.infoBase.bankName = arrData[0].accountBank;
          this.infoBase.collectionAccount = arrData[0].accountBankNo;
        } else {
          this.infoBase.bankName = "";
          this.infoBase.collectionAccount = "";
        }
      },
      collectionUnameClear() {
        this.changeCollectionUname();
      },
      payMentFun(v) {
        this.paymentObj = v;
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
      //获取选择的信息
      getBackList(row) {
        this.infoBase.rebateNo = row.applyNo;
      },
      getBackList2(row) {
        this.infoBase.badDebNo = row.applyNo;
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
      // 保存接口
      async getPreservation(num) {
        if (this.infoBase.billingType.value === "0") {
          if (!this.infoBase.collectionName)
            return this.$message.error("收款户名不能为空");
          if (!this.infoBase.bankName) return this.$message.error("开户行不能为空");
          if (!this.infoBase.collectionAccount)
            return this.$message.error("银行账号不能为空");
          if (!this.infoBase.thisPaymentAccount)
            return this.$message.error("付款账户不能为空");
        }
        if (this.infoBase.badDebtReceivable - this.infoBase.payingBadDebts > 100) {
          if (!this.infoBase.badDebNo) {
            // this.$message.error("请输入应收坏账请示单号");
            this.$message({
              message: "请输入应收坏账请示单号",
              type: "error",
              customClass: "zZindex"
            });
            return "";
          }
        }
        if (this.infoBase.receivableRebate - this.infoBase.dealingRebates > 100) {
          if (!this.infoBase.rebateNo) {
            // this.$message.error("请输入应收返利请示单号");
            this.$message({
              message: "请输入应收返利请示单号",
              type: "error",
              customClass: "zZindex"
            });
            return "";
          }
        }
        if (num == 1) {
          if (!this.infoBase.remark) {
            // this.$message.error("请填写备注");
            this.$message({
              message: "请填写备注",
              type: "error",
              customClass: "zZindex"
            });
            return "";
          }
        }
        this.infoBase.buttonStatus = 1
        this.infoBase.commitType = 1
        this.list.four = [this.infoBase]
        if (num == 0) {
          let res = await CheckForSave(this.list, this.modelType)
          if (res.code === 0) {
            this.$emit('closeModal', {})
          }
        }
        if (num == 1) {
          let res = await CheckForSubmit(this.list, this.modelType)
          if (res.code === 0) {
            this.$emit('closeModal', {})
          }
        }
        // if (this.collectlist.length !== 0 || this.paymentlist.length !== 0) {
        //   let one = [
        //     {
        //       number: "3",
        //       accountNo: this.data[0].Statementexcludingtax,
        //       accountSumAmt: this.data[1].Statementexcludingtax
        //     },
        //     {
        //       number: "1",
        //       accountNo: this.data[0].Taxincludedpartsstatement,
        //       accountSumAmt: this.data[1].Taxincludedpartsstatement
        //     },
        //     {
        //       number: "2",
        //       accountNo: this.data[0].Statementoilincludingtax,
        //       accountSumAmt: this.data[1].Statementoilincludingtax
        //     }
        //   ];
        //   let four = [
        //     {
        //       tenantId: this.$store.state.user.userData.tenantId,
        //       orgId: this.model1,
        //       orgName: this.store,
        //       guestId: this.companyInfo,
        //       serviceId: "XSCDS001-20191000071",
        //       accountReceivable: this.totalcollect,
        //       badDebtReceivable: this.collectBaddebt,
        //       receivableRebate: this.collectRebate,
        //       actualCollection: this.Actualtotalcollect,
        //       reconciliation: this.totalpayment,
        //       payingBadDebts: this.paymentBaddebt,
        //       dealingRebates: this.paymentRebate,
        //       actualPayment: this.Actualtotalpayment,
        //       settlementTotal: this.Reconciliationtotal,
        //       billingType: this.totalvalue,
        //       rebateNo: this.Rebateid,
        //       badDebNo: this.BadDebtid,
        //       buttonStatus: num,
        //       incomeType: this.totalvalue,
        //       remark: this.remark,
        //       collectionName: this.collectionAccountName,
        //       bankName: this.openingBank,
        //       collectionAccount: this.collectionAccount,
        //       thisPaymentAccount: this.thisApplyAccount
        //     }
        //   ];
        //   let obj = {
        //     one,
        //     two: this.collectlist,
        //     three: this.paymentlist,
        //     four
        //   };
        //   Preservation(obj).then(res => {
        //     if (res.code === 0) {
        //       // this.$message.success("保存成功");
        //       this.$message({
        //         message: "保存成功",
        //         type: "success",
        //         customClass: "zZindex"
        //       });
        //       this.modal = false;
        //     }
        //   });
        // } else {
        //   // this.$message.error("请选择要对账的数据");
        //   this.$message({
        //     message: "请选择要对账的数据",
        //     type: "error",
        //     customClass: "zZindex"
        //   });
        // }
      },
      // 保存草稿
      preservationDraft() {
        this.getPreservation(0);
      },
      // 保存并提交
      preservationSubmission() {
        this.getPreservation(1);
      },
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
