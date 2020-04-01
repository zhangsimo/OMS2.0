<template>
  <div class="db">
    <Modal v-model="modal" title="对账单" width="1200" @on-visible-change="hander">
      <div class="content-oper content-oper-flex">
        <section class="oper-box mb10">
          <div class="oper-top flex">
            <div class="wlf">
              <div class="db ml20">
                <span>对账门店：</span>
                <Select v-model="model1" disabled class="w150">
                  <Option
                    v-for="item in Branchstore"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </div>
              <div class="db ml20">
                <span>往来单位：</span>
                <Select v-model="companyInfo" disabled style="width:200px">
                  <Option
                    v-for="item in companyList"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
                <!-- <input type="text" class="h30" :value="companyInfo" />
                <i class="iconfont iconcaidan input" @click="Dealings"></i>-->
              </div>
              <div class="db ml5">
                <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="query">
                  <i class="iconfont iconchaxunicon"></i>
                  <span>查询</span>
                </button>
              </div>
              <div class="db ml10">
                <button
                  class="mr10 ivu-btn ivu-btn-default"
                  type="button"
                  @click="getReportReconciliationt"
                >导出对账清单</button>
                <button
                  class="mr10 ivu-btn ivu-btn-default"
                  type="button"
                  @click="getReportParts"
                >导出配件明细</button>
              </div>
            </div>
          </div>
        </section>
        <section class="con-box">
          <div class="inner-box">
            <!-- <Table :columns="columns" :data="data" border max-height="400"></Table> -->
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
              <Col span="6"><div style="border:1px solid #dddddd;line-height:40px" class="tc h40">对账单号</div></Col>
              <Col span="6"><div style="border:1px solid #dddddd;line-height:40px" class="tc h40"></div></Col>
              <Col span="6"><div style="border:1px solid #dddddd;line-height:40px" class="tc h40"></div></Col>
              <Col span="6"><div style="border:1px solid #dddddd;line-height:40px" class="tc h40"></div></Col>
            </Row>
            <Row>
              <Col span="6"><div style="border:1px solid #dddddd;line-height:40px" class="tc h40">对账金额</div></Col>
              <Col span="6"><div style="border:1px solid #dddddd;line-height:40px" class="tc h40"></div></Col>
              <Col span="6"><div style="border:1px solid #dddddd;line-height:40px" class="tc h40"></div></Col>
              <Col span="6"><div style="border:1px solid #dddddd;line-height:40px" class="tc h40"></div></Col>
            </Row>
            <div class="db mt10 info" v-if="info">
              <h5 class="p10">付款信息</h5>
              <div class="flex p10">
                <span>收款户名：</span>
                <!-- <Select v-model="collectionAccountName" style="width:200px" class="mr10">
                  <Option
                    v-for="item in collectionAccountList"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>-->
                <Input type="text" class="w140 mr10" v-model="collectionAccountName" disabled />
                <!-- <i class="iconfont iconcaidan input" @click="Dealings"></i> -->
                <span>开户行：</span>
                <Input v-model="openingBank" class="w140 mr10" disabled />
                <span>收款账号：</span>
                <Input v-model="collectionAccount" class="w140 mr10" disabled />
                <span>本次申请付款账户：</span>
                <Input v-model="thisApplyAccount" class="w140 mr10" />
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
            <div class="flex mt20" style="justify-content:space-between">
              <div class="totalcollect p10">
                <span class="mr5">应收合计</span>
                <Input type="text" v-model="totalcollect" disabled class="w60 mr10 tc" />
                <span class="mr5">应收坏账</span>
                <InputNumber :min="0" v-model="collectBaddebt" class="w60 mr10 tc" disabled/>
                <span class="mr5">应收返利</span>
                <InputNumber :min="0" v-model="collectRebate" class="w60 mr10 tc" disabled />
                <span class="mr5" style="color:#f66">实际应收合计</span>
                <Input v-model="Actualtotalcollect" type="text" class="w60 mr10 tc" disabled />
              </div>
              <div class="totalpayment p10 ml10">
                <span class="mr5">应付合计</span>
                <Input type="text" v-model="totalpayment" disabled class="w60 mr10 tc" />
                <span class="mr5">应付坏账</span>
                <InputNumber v-model="paymentBaddebt" type="text" class="w60 mr10 tc" :min="0" disabled/>
                <span class="mr5">应付返利</span>
                <InputNumber v-model="paymentRebate" class="w60 mr10 tc" :min="0" disabled/>
                <span class="mr5" style="color:#f66">实际应付合计</span>
                <Input :value="Actualtotalpayment" class="w60 mr10 tc" disabled />
              </div>
            </div>
            <div class="db total mt20 p10">
              <span class="mr5">本次对账结算合计(整数收款)</span>
              <Input type="text" v-model="Reconciliationtotal" disabled class="w60 mr10 tc" />
              <span class="mr5">计划结算类型</span>
              <Select class="w100 mr10" v-model="totalvalue" disabled>
                <Option
                  v-for="item in SettlementType"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
              <span class="mr5">应收返利请示单号</span>
              <Input type="text" v-model="Rebateid" class="w60 mr10 tc" disabled />
              <span class="mr5">应收坏账请示单号</span>
              <Input type="text" v-model="BadDebtid" class="w60 mr10 tc" disabled />
              <span class="mr5">备注</span>
              <Input type="text" v-model="remark" class="w60 mr10 tc w230" disabled />
            </div>
          </div>
        </section>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="Reconciliation" title="本次不对账" width="1200">
      <div class="flex mb20">
        <span class="mr5">门店</span>
        <input type="text" disabled class="w140 mr15 tc" :value="store" />
        <span class="mr5">单据编号</span>
        <input type="text" disabled class="w180 mr15 tc" :value="bill" />
        <span class="mr5">业务类型</span>
        <input type="text" disabled class="w140 mr15 tc" :value="business" />
        <span class="mr5">往来单位信息</span>
        <input type="text" disabled class="w140 mr15 tc" :value="thiscompanyInfo" />
        <span class="mr5">单据日期</span>
        <input type="text" disabled class="w140 mr15 tc" :value="billDate" />
      </div>
      <Table
        :columns="Reconciliationlist"
        :data="Reconciliationcontent"
        border
        max-height="400"
        show-summary
      ></Table>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>

<script>
// import selectDealings from "./component/selectCompany";
import { creat } from "../../components";
import {
  getReconciliation,
  getSettlement,
  Preservation,
  getStore,
  account
} from "@/api/bill/saleOrder";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
import baseUrl from "_conf/url";
import index from "@/view/admin/roles";
export default {
  props:{accountType:''},
  data() {
    return {
      collectionAccountList: [],
      companyList: [],
      info: false,
      store: "",
      bill: "",
      business: "",
      companyInfo: "",
      thiscompanyInfo: "", //弹框往来单位
      billDate: "",
      Rebateid: "", //返利单号
      BadDebtid: "", //坏帐单号
      remark: "", //备注
      totalpayment: 0, //应付合计
      paymentBaddebt: 0, //应付坏账
      paymentRebate: 0, //应付返利
      totalcollect: 0, //应收合计
      collectBaddebt: 0, //应收坏账
      collectRebate: 0, //应收返利
      Reconciliation: false,
      modifyAccountAmt: 0,
      modal: false,
      Branchstore: [],
      model1: "",
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
        {
          title: "油品/配件",
          key: "speciesName",
          className: "tc"
        },
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
                    this.store = params.row.orgId;
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
          value: "0",
          label: "付款"
        },
        {
          value: "1",
          label: "收款"
        },
        {
          value: "2",
          label: "对冲"
        }
      ],
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
          className: "tc",
          render: (h, params) => {
            let label = ''
            label = this.accountType ? 'span' : 'InputNumber'
            return h(label, {
              style: {
                width: "60px"
              },
              props: {
                value: params.row.thisNoAccountAmt,
                type: "number",
                min: "0"
              },
              on: {
                "on-change": event => {
                  this.modifyAccountAmt = event;
                  this.$set(
                    params.row,
                    "thisNoAccountAmt",
                    this.modifyAccountAmt
                  );
                  this.$set(
                    this.Reconciliationcontent,
                    params.index,
                    params.row
                  );
                  params.row.thisAccountAmt =
                    params.row.amount -
                    params.row.accountAmt -
                    this.modifyAccountAmt;
                }
              }
            });
          }
        },
        {
          title: "本次对账金额",
          key: "thisAccountAmt",
          className: "tc"
        },
        {
          title: "差异原因",
          key: "diffeReason",
          className: "tc",
          render: (h, params) => {
            let label = ''
            label = this.accountType ? 'span' : 'Input'
            return h(label, {
              style: {
                width: "60px"
              },
              props: {
                value: ""
              }
            });
          }
        }
      ],
      data1: [],
      data2: [],
      Reconciliationcontent: [],
      parameter: {},
      paymentlist: [],
      collectlist: [],
      companyInfoId: "",
      flag: false,
      infoGet: []
    };
  },
  async mounted() {
    let arr = await creat([], this.$store);
    this.value = arr[0];
    this.model1 = arr[1];
    this.Branchstore = arr[2];
  },
  computed: {
    Actualtotalpayment() {
      this.paymentBaddebt = this.paymentBaddebt ? this.paymentBaddebt : 0;
      this.totalpayment = this.totalpayment ? this.totalpayment : 0;
      return this.totalpayment - this.paymentBaddebt - this.paymentRebate;
    },
    Actualtotalcollect() {
      this.paymentBaddebt = this.paymentBaddebt ? this.paymentBaddebt : 0;
      this.totalpayment = this.totalpayment ? this.totalpayment : 0;
      return this.totalcollect - this.collectBaddebt - this.collectRebate;
    },
    Reconciliationtotal() {
      return this.Actualtotalcollect - this.Actualtotalpayment;
    },
    totalvalue() {
      if (this.paymentlist.length !== 0 || this.collectlist.length !== 0) {
        if (this.Reconciliationtotal > 0) {
          this.info = false;
          return "1";
        } else if (this.Reconciliationtotal < 0) {
          this.info = true;
          return "0";
        } else {
          this.info = false;
          return "2";
        }
      } else {
        return "1";
      }
    }
  },
  methods: {
    query() {
      this.Initialization();
    },
    // 对账单弹框出现加载数据
    hander() {
      if(type){
        this.flag = false;
        this.info = false;
        this.store = this.parameter.orgId;
        this.model1 = this.parameter.orgId;
        this.Rebateid = "";
        this.BadDebtid = "";
        this.remark = "";
        this.totalpayment = 0;
        this.paymentBaddebt = 0;
        this.paymentRebate = 0;
        this.totalcollect = 0;
        this.collectBaddebt = 0;
        this.collectRebate = 0;
        this.Initialization()
      }
      // this.storeAccount(this.parameter.orgId);
    },
    // 获取数据
    Initialization() {
      let { orgId, startDate, endDate, guestId } = this.parameter;
      let obj = { orgId: this.model1, guestId: this.companyInfo };
      getReconciliation(obj).then(res => {
        // let Statementexcludingtax = 0;
        // let Taxincludedpartsstatement = 0;
        // let Statementoilincludingtax = 0;
        // let Statementexcludingtax1 = 0;
        // let Taxincludedpartsstatement1 = 0;
        // let Statementoilincludingtax1 = 0;
        // for (let i of res.data.one) {
        //   if (i.number === 1) {
        //     Statementexcludingtax = i.accountNo;
        //     Statementexcludingtax1 = i.accountSumAmt;
        //   } else if (i.number === 2) {
        //     Taxincludedpartsstatement = i.accountNo;
        //     Taxincludedpartsstatement1 = i.accountSumAmt;
        //   } else {
        //     Statementoilincludingtax = i.accountNo;
        //     Statementoilincludingtax1 = i.accountSumAmt;
        //   }
        // }
        // this.data = [
        //   {
        //     Detailedstatistics: "对账单号",
        //     Statementexcludingtax,
        //     Taxincludedpartsstatement,
        //     Statementoilincludingtax
        //   },
        //   {
        //     Detailedstatistics: "对账金额",
        //     Statementexcludingtax: Statementexcludingtax1,
        //     Taxincludedpartsstatement: Taxincludedpartsstatement1,
        //     Statementoilincludingtax: Statementoilincludingtax1
        //   }
        // ];
        if (res.data.two.length !== 0) {
          res.data.two.map((item,index) => {
            item.index = index + 1
            item.serviceTypeName = item.serviceType.name;
            item.speciesName = item.species.name;
          });
          this.data1 = res.data.two;
        } else {
          this.data1 = [];
        }
        if (res.data.three.length !== 0) {
          res.data.three.map((item,index) => {
            item.index = index + 1
            item.serviceTypeName = item.serviceType.name;
            item.speciesName = item.species.name;
          });
          this.data2 = res.data.three;
        } else {
          this.data2 = [];
        }
      });
    }, 
    // 对账清单导出
    getReportReconciliationt() {
      if (this.paymentlist.length !== 0 || this.collectlist.length !== 0) {
        if (this.paymentlist.length !== 0) {
          this.$refs.payable.exportCsv({
            filename: "采购清单",
            data: this.paymentlist,
            columns: this.columns1.filter((col, index) => index > 0)
          });
        }
        if (this.collectlist.length !== 0) {
          this.$refs.receivable.exportCsv({
            filename: "销售清单",
            data: this.collectlist,
            columns: this.columns1.filter((col, index) => index > 0)
          });
        }
      } else {
        this.$message({message:"请勾选要导出的对账清单",
          type: "error",
          customClass: "zZindex"});
      }
    },
    // 导出配件明细
    getReportParts() {
      if (this.paymentlist.length !== 0 || this.collectlist.length !== 0) {
        let str1 = "";
        let str2 = "";
        this.paymentlist.map(item => {
          str1 += `${item.serviceId}*${item.serviceType.value},`;
        });
        this.collectlist.map(item => {
          str2 += `${item.serviceId}*${item.serviceType.value},`;
        });
        str1 = str1.substring(1, str1.length - 1);
        str2 = str2.substring(1, str2.length - 1);
        // console.log(str1,str2)
        location.href = `${
          baseUrl.omsOrder
        }/pchsEnterMain/export/in/detail?access_token=${Cookies.get(
          TOKEN_KEY
        )}&aOrderCode=${str1}&bOrderCode=${str2}`;
      } else {
        this.$message({message:"请先勾选数据",
          type: "error",
          customClass: "zZindex"});
      }
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
</style>