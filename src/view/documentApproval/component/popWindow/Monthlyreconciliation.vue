<template>
  <div class="db">
    <div class="content-oper content-oper-flex">
      <section class="oper-box mb10">
        <div class="oper-top flex">
          <div class="wlf">
            <div class="db ml20">
              <span>对账门店：</span>
              <Select v-model="model1" class="w150" @on-change="storeAccount" :disabled="modelType.type==3">
                <Option
                  v-for="item in Branchstore"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </div>
            <div class="db ml20">
              <span>往来单位：</span>
              <Select v-model="companyInfo" style="width:200px" @on-change="companySelect" :disabled="modelType.type==3">
                <Option
                  v-for="item in companyList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </div>
            <div class="db ml5">
              <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="query" :disabled="modelType.type==3">
                <i class="iconfont iconchaxunicon"></i>
                <span>查询</span>
              </button>
            </div>
            <div class="db ml10">
              <button
                class="mr10 ivu-btn ivu-btn-default"
                type="button"
                @click="preservationDraft"
                v-if="modelType.type!=3"
              >保存草稿</button>
              <button
                class="mr10 ivu-btn ivu-btn-default"
                type="button"
                @click="preservationSubmission"
                v-if="modelType.type!=3"
                v-noresub
              >保存并提交</button>
              <button
                class="mr10 ivu-btn ivu-btn-default"
                type="button"
                @click="getReportReconciliationt"
                v-if="false"
              >导出对账清单</button>
              <button
                class="mr10 ivu-btn ivu-btn-default"
                type="button"
                @click="getReportParts"
                v-if="false"
              >导出配件明细</button>
            </div>
          </div>
        </div>
      </section>
      <section class="con-box">
        <div class="inner-box">
          <Table :columns="columns" :data="data" border max-height="400" v-if="handervis"></Table>
          <div class="db mt10 info" v-if="info">
            <h5 class="p10">付款信息</h5>
            <div class="flex p10">
              <span>收款户名：</span>
              <Input type="text" class="w140 mr10" v-model="collectionAccountName" :disabled="modelType.type==3" />
              <span>开户行：</span>
              <Input v-model="openingBank" class="w140 mr10" :disabled="modelType.type==3" />
              <span>收款账号：</span>
              <Input v-model="collectionAccount" class="w140 mr10" :disabled="modelType.type==3" />
              <span>本次申请付款账户：</span>
              <Input v-model="thisApplyAccount" class="w140 mr10"  :disabled="modelType.type==3" />
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
              <Input type="text" v-model="totalcollect" disabled class="w60 mr10 tc" :disabled="modelType.type==3"/>
              <span class="mr5">应收坏账</span>
              <InputNumber :min="0" v-model="collectBaddebt" class="w60 mr10 tc" :disabled="modelType.type==3"/>
              <span class="mr5">应收返利</span>
              <InputNumber :min="0" v-model="collectRebate" class="w60 mr10 tc" :disabled="modelType.type==3"/>
              <span class="mr5" style="color:#f66">实际应收合计</span>
              <Input v-model="Actualtotalcollect" type="text" class="w60 mr10 tc" disabled />
            </div>
            <div class="totalpayment p10 ml10">
              <span class="mr5">应付合计</span>
              <Input type="text" v-model="totalpayment" disabled class="w60 mr10 tc" :disabled="modelType.type==3" />
              <span class="mr5">应付坏账</span>
              <InputNumber v-model="paymentBaddebt" type="text" class="w60 mr10 tc" :min="0" :disabled="modelType.type==3" />
              <span class="mr5">应付返利</span>
              <InputNumber v-model="paymentRebate" class="w60 mr10 tc" :min="0" :disabled="modelType.type==3"/>
              <span class="mr5" style="color:#f66">实际应付合计</span>
              <Input :value="Actualtotalpayment" class="w60 mr10 tc" disabled />
            </div>
          </div>
          <div class="db total mt20 p10">
            <span class="mr5">本次对账结算合计(整数收款)</span>
            <Input type="text" v-model="Reconciliationtotal" disabled class="w60 mr10 tc" />
            <span class="mr5">计划结算类型</span>
            <Select class="w100 mr10" v-model="totalvalue" :disabled="modelType.type==3">
              <Option
                v-for="item in SettlementType"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
            <span class="mr5">应收返利请示单号</span>
            <Input type="text" v-model="Rebateid" class="w60 mr10 tc" :disabled="modelType.type==3"/>
            <span class="mr5">应收坏账请示单号</span>
            <Input type="text" v-model="BadDebtid" class="w60 mr10 tc" :disabled="modelType.type==3"/>
            <span class="mr5">备注</span>
            <Input type="text" v-model="remark"  :disabled="modelType.type==3" class="w60 mr10 tc" />
          </div>
        </div>
      </section>
    </div>
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
      <vxe-table
        border
        show-overflow
        ref="xTable"
        height="500px"
        show-footer
        auto-resize
        :footer-method="handleSummary"
        :data="Reconciliationcontent"
        :edit-rules="validRules"
        :edit-config="{trigger: 'click', mode: 'cell', showStatus: true}"
      >
        <vxe-table-column type="index" title="序号" align="center"></vxe-table-column>
        <vxe-table-column field="partCode" title="配件编码" align="center"></vxe-table-column>
        <vxe-table-column field="partName" title="配件名称" align="center"></vxe-table-column>
        <vxe-table-column field="partSpecification" title="规格型号" align="center"></vxe-table-column>
        <vxe-table-column field="Detailedstatistics" title="适用车型" align="center"></vxe-table-column>
        <vxe-table-column field="price" title="单价" align="center"></vxe-table-column>
        <vxe-table-column field="quantity" title="数量" align="center"></vxe-table-column>
        <vxe-table-column field="amount" title="金额" align="center"></vxe-table-column>
        <vxe-table-column field="accountAmt" title="前期已对账金额" align="center"></vxe-table-column>
        <vxe-table-column field="noAccountAmt" title="前期未对账金额" align="center"></vxe-table-column>
        <vxe-table-column
          field="thisNoAccountAmt"
          title="本次不对账金额"
          :edit-render="{name: 'input',immediate:true,events: {input: updateFooterEvent}}"
          align="center"
        ></vxe-table-column>
        <vxe-table-column title="本次对账金额" align="center">
          <template v-slot="{ row }">
            <span>{{ countAmount(row) | priceFilters }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column
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
  </div>
</template>

<script>
import { creat } from "@/view/settlementManagement/components";
import {
  getReconciliation,
  getSettlement,
  Preservation,
  getStore
} from "@/api/bill/saleOrder";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
import baseUrl from "_conf/url";
import index from "@/view/admin/roles";
export default {
  // components: {
  //   selectDealings
  // },
  props: ["modelType"],
  data() {
    const roleValid = (rule, value, callback, { row }) => {
      if (value >= 0) {
        if (value > row.amount - row.accountAmt) {
          callback(
            new Error("配件本次不对账金额不能大于金额减掉前期已对账金额")
          );
        } else {
          callback();
        }
      } else {
        callback(new Error("不能小于0"));
      }
    };
    const diffeReason = (rule, value, callback, { row }) => {
      if (row.thisNoAccountAmt > 0) {
        if (!value) {
          callback(new Error("差异原因必填"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      validRules: {
        thisNoAccountAmt: [{ validator: roleValid, trigger: "change" }],
        diffeReason: [{ validator: diffeReason }]
      },
      arrId: [],
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
            return h("InputNumber", {
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
                  if (event > params.row.amount - params.row.accountAmt)
                    return this.$message.error(
                      "配件的本次不对账金额不能大于金额减前期已对账金额"
                    );
                  this.flag = true;
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
            return h("Input", {
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
      data: [],
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
    // 在值发生改变时更新表尾合计
    updateFooterEvent(params) {
      let xTable = this.$refs.xTable;
      xTable.updateFooter();
    },
    countAmount(row) {
      return (
        this.$utils.toNumber(row.amount) -
        this.$utils.toNumber(row.accountAmt) -
        this.$utils.toNumber(row.thisNoAccountAmt)
      );
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
    handleSummary({ columns, data }) {
      //   console.log(columns,data)return [
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
              "thisNoAccountAmt"
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
      this.Initialization();
    },
    // 获取数据
    Initialization() {
      // let { orgId, startDate, endDate, guestId } = this.parameter;
      let obj = { orgId: this.model1, guestId: this.companyInfo };
      getReconciliation(obj).then(res => {
        // let Statementexcludingtax = 0;
        // let Taxincludedpartsstatement = 0;
        // let Statementoilincludingtax = 0;
        // let Statementexcludingtax1 = 0;
        // let Taxincludedpartsstatement1 = 0;
        // let Statementoilincludingtax1 = 0;
        for (let i of res.data.one) {
          if (i.number === 3) {
            this.arrId[0] = i.accountNo;
            // Statementexcludingtax = i.accountNo;
            // Statementexcludingtax1 = i.accountSumAmt;
          } else if (i.number === 1) {
            this.arrId[1] = i.accountNo;
            // Taxincludedpartsstatement = i.accountNo;
            // Taxincludedpartsstatement1 = i.accountSumAmt;
          } else {
            this.arrId[2] = i.accountNo;
            // Statementoilincludingtax = i.accountNo;
            // Statementoilincludingtax1 = i.accountSumAmt;
          }
        }
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
          res.data.two.map(item => {
            item.serviceTypeName = item.serviceType.name;
            item.speciesName = item.species.name;
          });
          this.data1 = res.data.two;
        } else {
          this.data1 = [];
        }
        if (res.data.three.length !== 0) {
          res.data.three.map(item => {
            item.serviceTypeName = item.serviceType.name;
            item.speciesName = item.species.name;
          });
          this.data2 = res.data.three;
        } else {
          this.data2 = [];
        }
      });
    }, // 对账门店
    storeAccount(val) {
      this.Branchstore.map(item => {
        if (item.value === val) {
          getStore({ orgId: val, orgName: item.label }).then(res => {
            this.infoGet = res.data;
            this.companyList = [];
            this.collectionAccountList = [];
            this.companyInfo = this.parameter.guestId;
            res.data.map((item, index) => {
              this.companyList.push({
                value: item.id,
                label: item.fullName
              });
              if (item.id === this.companyInfo) {
                this.collectionAccountName = item.receiveName;
                this.openingBank = item.accountBank;
                this.collectionAccount = item.accountBankNo;
              }
            });
            this.Initialization();
          });
        }
      });
    },
    // 切换往来单位
    companySelect(val) {
      this.infoGet.map(item => {
        if (item.id === val) {
          // this.collectionAccountList.push({
          //   value: 0,
          //   label: item.receiveName
          // });
          this.collectionAccountName = item.receiveName;
          this.openingBank = item.accountBank;
          this.collectionAccount = item.accountBankNo;
        }
      });
    },
    // 已勾选结算类型计算
    getSettlementComputed() {
      getSettlement({ one: this.collectlist, two: this.paymentlist }).then(
        res => {
          this.handervis = true;
          this.data = [
            {
              Detailedstatistics: "对账单号",
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
          // this.$set(this.data, 1, {
          //   Detailedstatistics: "对账金额",
          //   Statementexcludingtax: res.data.one,
          //   Taxincludedpartsstatement: res.data.two,
          //   Statementoilincludingtax: res.data.three
          // });
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
      selection.map(item => {
        this.totalcollect += item.thisAccountAmt;
      });
      this.getSettlementComputed();
    },
    // 应付全选
    paymentCheckoutAll(selection) {
      this.paymentlist = selection;
      selection.map(item => {
        this.totalpayment += item.thisAccountAmt;
      });
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
      this.collectlist = [];
      this.totalcollect = 0;
      this.Actualtotalcollect = 0;
      this.getSettlementComputed();
    },
    // 本次不对帐金额弹窗
    noReconciliation() {
      this.$refs.xTable.validate(val => {
        if (val) {
          // if (this.flag) {
          //   if (this.Reason) {
          //     this.$message({
          //       message: "差异原因必填",
          //       type: "error",
          //       customClass: "zZindex"
          //     });
          //     return "";
          //   }
          // }
          let sum = 0;
          this.Reconciliationcontent.map(item => {
            sum += item.thisNoAccountAmt * 1;
          });
          const index = this.Reconciliationcontent[0].index;
          if (this.business === "销售退货" || this.business === "销售出库") {
            const sum1 =
              this.data1[index].rpAmt - this.data1[index].accountAmt - sum;
            if (sum > this.data1[index].rpAmt - this.data1[index].accountAmt)
              return this.$message.error(
                "本次不对账合计不能大于总金额减去前期已对账"
              );
            this.$set(this.data1[index], "thisNoAccountAmt", sum);
            this.$set(this.data1[index], "thisAccountAmt", sum1);
          } else {
            const sum1 =
              this.data2[index].rpAmt - this.data2[index].accountAmt - sum;
            if (sum > this.data2[index].rpAmt - this.data2[index].accountAmt)
              return this.$message.error(
                "本次不对账合计不能大于总金额减去前期已对账"
              );
            this.$set(this.data2[index], "thisNoAccountAmt", sum);
            this.$set(this.data2[index], "thisAccountAmt", sum1);
          }
          this.Reconciliation = false;
        } else {
          this.Reconciliation = true;
          this.$message.error("信息填写错误");
        }
      });
    },
    // 保存接口
    getPreservation(num) {
      if (this.totalvalue === "0") {
        if (!this.collectionAccountName)
          return this.$message.error("收款户名不能为空");
        if (!this.openingBank) return this.$message.error("开户行不能为空");
        if (!this.collectionAccount)
          return this.$message.error("银行账号不能为空");
        if (!this.thisApplyAccount)
          return this.$message.error("付款账户不能为空");
      }
      if (this.collectBaddebt - this.paymentBaddebt > 100) {
        if (!this.BadDebtid) {
          // this.$message.error("请输入应收坏账请示单号");
          this.$message({
            message: "请输入应收坏账请示单号",
            type: "error",
            customClass: "zZindex"
          });
          return "";
        }
      }
      if (this.collectRebate - this.paymentRebate > 100) {
        if (!this.Rebateid) {
          // this.$message.error("请输入应收返利请示单号");
          this.$message({
            message: "请输入应收返利请示单号",
            type: "error",
            customClass: "zZindex"
          });
          return "";
        }
      }
      if (!this.remark) {
        // this.$message.error("请填写备注");
        this.$message({
          message: "请填写备注",
          type: "error",
          customClass: "zZindex"
        });
        return "";
      }
      if (this.collectlist.length !== 0 || this.paymentlist.length !== 0) {
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
            rebateNo: this.Rebateid,
            badDebNo: this.BadDebtid,
            buttonStatus: num,
            incomeType: this.totalvalue,
            remark: this.remark,
            collectionName: this.collectionAccountName,
            bankName: this.openingBank,
            collectionAccount: this.collectionAccount,
            thisPaymentAccount: this.thisApplyAccount
          }
        ];
        let obj = {
          one,
          two: this.collectlist,
          three: this.paymentlist,
          four
        };
        Preservation(obj).then(res => {
          if (res.code === 0) {
            // this.$message.success("保存成功");
            this.$message({
              message: "保存成功",
              type: "success",
              customClass: "zZindex"
            });
            this.modal = false;
          }
        });
      } else {
        // this.$message.error("请选择要对账的数据");
        this.$message({
          message: "请选择要对账的数据",
          type: "error",
          customClass: "zZindex"
        });
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
        // this.$message.error("请勾选要导出的对账清单");
        this.$message({
          message: "请勾选要导出的对账清单",
          type: "error",
          customClass: "zZindex"
        });
      }
    },
    // 导出配件明细
    getReportParts() {
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
        location.href = `${
          baseUrl.omsOrder
        }/pchsEnterMain/export/in/detail?access_token=${Cookies.get(
          TOKEN_KEY
        )}&aOrderCode=${str1}&bOrderCode=${str2}`;
      } else {
        // this.$message.error("请先勾选数据");
        this.$message({
          message: "请先勾选数据",
          type: "error",
          customClass: "zZindex"
        });
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
.zZindex {
  z-index: 3000 !important;
}
</style>
