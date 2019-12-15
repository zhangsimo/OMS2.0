<template>
  <div class="db">
    <Modal v-model="modal" title="对账单" width="1200" @on-visible-change="hander">
      <div class="content-oper content-oper-flex">
        <section class="oper-box mb10">
          <div class="oper-top flex">
            <div class="wlf">
              <div class="db ml20">
                <span>对账门店：</span>
                <Select v-model="model1" class="w150">
                  <Option
                    v-for="item in Branchstore"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </div>
              <div class="db ml20">
                <span>往来单位：</span>
                <input type="text" class="h30" :value="companyInfo" />
                <i class="iconfont iconcaidan input" @click="Dealings"></i>
              </div>
              <div class="db ml5">
                <button class="mr10 ivu-btn ivu-btn-default" type="button">
                  <i class="iconfont iconchaxunicon"></i>
                  <span>查询</span>
                </button>
              </div>
              <div class="db ml10">
                <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="report(0)">导出对账清单</button>
                <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="report(1)">导出配件明细</button>
              </div>
            </div>
          </div>
        </section>
        <section class="con-box">
          <div class="inner-box">
            <Table :columns="columns" :data="data" border max-height="400"></Table>
            <div class="db mt10 info" v-if="info">
              <h5 class="p10">付款信息</h5>
              <div class="flex p10">
                <span>收款户名：</span>
                <Input type="text" class="w140 mr10" />
                <i class="iconfont iconcaidan input" @click="Dealings"></i>
                <span>开户行：</span>
                <Input type="text" class="w140 mr10" />
                <span>收款账号：</span>
                <Input type="text" class="w140 mr10" />
                <span>本次申请付款账户：</span>
                <Input type="text" class="w140 mr10" />
              </div>
            </div>
            <div class="db mt20">
              <h5>应收业务销售出库/退货对账</h5>
              <Table
                :columns="columns1"
                :data="data1"
                border
                max-height="400"
                @on-select="collectCheckout"
                @on-select-all="collectCheckoutAll"
                @on-select-cancel="collectNoCheckout"
                @on-select-all-cancel="collectNoCheckoutAll"
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
                @on-select="paymentCheckout"
                @on-select-all="paymentCheckoutAll"
                @on-select-cancel="paymentNoCheckout"
                @on-select-all-cancel="paymentNoCheckoutAll"
                show-summary
                ref="payable"
              ></Table>
            </div>
            <div class="flex mt20">
              <div class="totalcollect p10">
                <span class="mr5">应收合计</span>
                <Input type="text" v-model="totalcollect" disabled class="w60 mr10 tc" />
                <span class="mr5">应收坏账</span>
                <InputNumber :min="0" v-model="collectBaddebt" class="w60 mr10 tc" disabled />
                <span class="mr5">应收返利</span>
                <InputNumber :min="0" v-model="collectRebate" class="w60 mr10 tc" disabled />
                <span class="mr5" style="color:#f66">实际应收合计</span>
                <Input v-model="Actualtotalcollect" type="text" class="w60 mr10 tc" disabled />
              </div>
              <div class="totalpayment p10 ml10">
                <span class="mr5">应付合计</span>
                <Input type="text" v-model="totalpayment" disabled class="w60 mr10 tc" />
                <span class="mr5">应付坏账</span>
                <InputNumber v-model="paymentBaddebt" type="text" class="w60 mr10 tc" disabled />
                <span class="mr5">应付返利</span>
                <InputNumber v-model="paymentRebate" class="w60 mr10 tc" disabled />
                <span class="mr5" style="color:#f66">实际应付合计</span>
                <Input :value="Actualtotalpayment" class="w60 mr10 tc" disabled />
              </div>
            </div>
            <div class="db total mt20 p10">
              <span class="mr5">本次对账结算合计(整数收款)</span>
              <Input type="text" v-model="Reconciliationtotal" disabled class="w60 mr10 tc" />
              <span class="mr5">计划结算类型</span>
              <Select class="w100 mr10" v-model="totalvalue">
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
              <Input type="text" v-model="remark" class="w60 mr10 tc" disabled />
            </div>
          </div>
        </section>
        <selectDealings ref="selectDealings" @getOne="getOne" />
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
    </Modal>
  </div>
</template>

<script>
import selectDealings from "./selectCompany";
import { creat } from "./../../components";
import {
  getReconciliation,
  getSettlement,
  Preservation,
  reportParts
} from "@/api/bill/saleOrder";
import axios from "axios";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
import baseUrl from "_conf/url";
export default {
  components: {
    selectDealings
  },
  data() {
    return {
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
      columns: [
        {
          title: "已勾选明细统计",
          key: "Detailedstatistics",
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
          title: "序号",
          key: "num",
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
          key: "num",
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
      ],
      data: [],
      data1: [],
      data2: [],
      Reconciliationcontent: [],
      parameter: {},
      paymentlist: [],
      collectlist: [],
      companyInfoId: "",
      flag: false
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
    // 对账单弹框出现加载数据
    hander() {
      this.flag = false;
      this.info = false;
      let { orgId, startDate, endDate, guestId } = this.parameter;
      this.companyInfo = this.parameter.guestName;
      this.companyInfoId = this.parameter.guestId;
      this.store = this.parameter.orgId;
      let obj = {
        orgId,
        startDate: "2019-10-03",
        endDate: "2019-12-07",
        guestId
      };
      getReconciliation(obj).then(res => {
        let Statementexcludingtax = 0;
        let Taxincludedpartsstatement = 0;
        let Statementoilincludingtax = 0;
        let Statementexcludingtax1 = 0;
        let Taxincludedpartsstatement1 = 0;
        let Statementoilincludingtax1 = 0;
        for (let i of res.data.one) {
          if (i.number === 1) {
            Statementexcludingtax = i.accountNo;
            Statementexcludingtax1 = i.accountSumAmt;
          } else if (i.number === 2) {
            Taxincludedpartsstatement = i.accountNo;
            Taxincludedpartsstatement1 = i.accountSumAmt;
          } else {
            Statementoilincludingtax = i.accountNo;
            Statementoilincludingtax1 = i.accountSumAmt;
          }
        }
        this.data = [
          {
            Detailedstatistics: "对账单号",
            Statementexcludingtax,
            Taxincludedpartsstatement,
            Statementoilincludingtax
          },
          {
            Detailedstatistics: "对账金额",
            Statementexcludingtax: Statementexcludingtax1,
            Taxincludedpartsstatement: Taxincludedpartsstatement1,
            Statementoilincludingtax: Statementoilincludingtax1
          }
        ];
        if (res.data.two.length !== 0) {
          let num = 0;
          res.data.two.map(item => {
            item.num = ++num;
            item.serviceTypeName = item.serviceType.name;
            item.speciesName = item.species.name;
          });
          this.data1 = res.data.two;
        }
        if (res.data.three.length !== 0) {
          let num = 0;
          res.data.three.map(item => {
            item.num = ++num;
            item.serviceTypeName = item.serviceType.name;
            item.speciesName = item.species.name;
          });
          this.data2 = res.data.three;
        }
      });
    },
    // 选择往来单位
    getOne(data) {
      this.companyInfo = data.shortName;
      this.companyInfoId = data.id;
    },
    // 往来单位
    Dealings() {
      this.$refs.selectDealings.openModel();
    },
    // 已勾选结算类型计算
    getSettlementComputed() {
      getSettlement({ one: this.collectlist, two: this.paymentlist }).then(
        res => {
          this.$set(this.data, 1, {
            Detailedstatistics: "对账金额",
            Statementexcludingtax: res.data.one,
            Taxincludedpartsstatement: res.data.two,
            Statementoilincludingtax: res.data.three
          });
        }
      );
    },
    // 应付选中
    paymentCheckout(selection, row) {
      this.paymentlist = selection;
      this.totalpayment = 0;
      selection.map(item => {
        this.totalpayment += item.thisAccountAmt;
      });
      this.getSettlementComputed();
    },
    // 应收选中
    collectCheckout(selection, row) {
      this.collectlist = selection;
      this.totalcollect = 0;
      this.Actualtotalcollect = 0;
      selection.map(item => {
        this.totalcollect += item.thisAccountAmt;
      });
      this.getSettlementComputed();
    },
    // 应收全选
    collectCheckoutAll(selection) {
      this.collectlist = selection;
      this.totalcollect = selection[selection.length - 1].thisAccountAmt;
      this.getSettlementComputed();
    },
    // 应付全选
    paymentCheckoutAll(selection) {
      this.paymentlist = selection;
      this.totalpayment = selection[selection.length - 1].thisAccountAmt;
      this.getSettlementComputed();
    },
    // 应付取消选中
    paymentNoCheckout(selection, row) {
      this.paymentlist = selection;
      this.totalpayment -= row.thisAccountAmt;
      this.getSettlementComputed();
    },
    // 应收取消选中
    collectNoCheckout(selection, row) {
      this.collectlist = selection;
      this.totalcollect -= row.thisAccountAmt;
      this.getSettlementComputed();
    },
    // 应付取消全选
    paymentNoCheckoutAll() {
      this.paymentlist = [];
      this.totalpayment = 0;
      this.Actualtotalpayment = 0;
      this.getSettlementComputed();
    },
    // 应收取消全选
    collectNoCheckoutAll() {
      this.collectlist = 0;
      this.totalcollect = 0;
      this.Actualtotalcollect = 0;
      this.getSettlementComputed();
    },
    // 保存接口
    getPreservation(num) {
      if (this.collectBaddebt - this.paymentBaddebt > 100) {
        if (!this.BadDebtid) {
          this.$message.error("请输入应收坏账请示单号");
          return "";
        }
      }
      if (this.collectRebate - this.paymentRebate > 100) {
        if (!this.Rebateid) {
          this.$message.error("请输入应收返利请示单号");
          return "";
        }
      }
      if (!this.remark) {
        this.$message.error("请填写备注");
        return "";
      }
      if (this.collectlist.length !== 0 || this.paymentlist.length !== 0) {
        let one = [
          {
            number: "1",
            accountNo: this.data[0].Statementexcludingtax,
            accountSumAmt: this.data[1].Statementexcludingtax
          },
          {
            number: "2",
            accountNo: this.data[0].Statementoilincludingtax,
            accountSumAmt: this.data[1].Statementoilincludingtax
          },
          {
            number: "3",
            accountNo: this.data[0].Taxincludedpartsstatement,
            accountSumAmt: this.data[1].Taxincludedpartsstatement
          }
        ];
        let four = [
          {
            tenantId: 0,
            orgId: this.store,
            orgName: "null",
            guestId: this.companyInfoId,
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
            rebateNo: this.Rebateid,
            badDebNo: this.BadDebtid,
            buttonStatus: num
          }
        ];
        let obj = {
          one,
          two: this.collectlist,
          three: this.paymentlist,
          four
        };
        Preservation(obj).then(res => {
          console.log(res);
        });
      } else {
        this.$message.error("请选择要对账的数据");
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
    // 导出
    report(type) {
      if (type) {
        if (this.data1.length !== 0 || this.data2.length !== 0) {
          let arr = [];
          this.data1.map(item => {
            arr.push({
              orderCode: item.serviceId,
              orderType: item.serviceType.value
            });
          });
          this.data2.map(item => {
            arr.push({
              orderCode: item.serviceId,
              orderType: item.serviceType.value
            });
          });
          // console.log(encodeURI(arr))
          // console.log(JSON.stringify(arr))
          // location.href = `${
          //   baseUrl.omsOrder
          // }/pchsEnterMain/export/in/detail?access_token=${Cookies.get(
          //   TOKEN_KEY
          // )}&jsonObject=${JSON.stringify(arr)}`;
          location.href = `${
            baseUrl.omsOrder
          }/pchsEnterMain/export/in/detail?access_token=${Cookies.get(
            TOKEN_KEY
          )}&jsonObject=${encodeURI(arr)}`;
          // reportParts({ one: this.data1, two: this.data2, three: obj }).then(
          //   res => {
          // var blob = new Blob([res]); //创建一个blob对象
          // var a = document.createElement("a"); //创建一个<a></ a>标签
          // a.href = URL.createObjectURL(blob); // response is a blob
          // a.download = "用户列表.csv"; //文件名称
          // a.style.display = "none";
          // document.body.appendChild(a);
          // a.click();
          // a.remove();

          // const blob = new Blob([res]);
          // const fileName = "配件明细.csv";
          // const elink = document.createElement("a");
          // elink.download = fileName;
          // elink.style.display = "none";
          // elink.href = URL.createObjectURL(blob);
          // document.body.appendChild(elink);
          // elink.click();
          // URL.revokeObjectURL(elink.href); // 释放URL 对象
          // document.body.removeChild(elink);

          // const link = document.createElement("a");
          // let blob = new Blob([res]);
          // link.style.display = "none";
          // link.href = URL.createObjectURL(blob);
          // link.setAttribute("download", "配件明细.csv");
          // document.body.appendChild(link);
          // link.click();
          // document.body.removeChild(link);
          // }
          // );
        } else {
          this.$message.error("应收/应付暂无数据");
        }
      } else {
        if (this.data1.length !== 0 || this.data2.length !== 0) {
          if (this.data2.length !== 0) {
            this.$refs.payable.exportCsv({
              filename: "采购清单"
            });
          }
          if (this.data1.length !== 0) {
            this.$refs.receivable.exportCsv({
              filename: "销售清单"
            });
          }
        } else {
          this.$message.error("应收/应付暂无数据");
        }
      }
    }
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
</style>