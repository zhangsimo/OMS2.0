<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <quickDate class="mr10" ref="quickDate" @quickDate="quickDate"></quickDate>
          </div>
          <div class="db ml20">
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
          <div class="db ml20">
            <span>分店名称：</span>
            <Select v-model="model1" class="w150">
              <Option
                v-for="item in Branchstore"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db ml5">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="query">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
          <div class="db ml10">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="modal1 = true">
              <i class="iconfont iconcaidan"></i>
              <span>更多</span>
            </button>
          </div>
          <div class="db ml10">
            <Poptip placement="bottom">
              <button class="mr10 ivu-btn ivu-btn-default" type="button">导出</button>
              <div slot="content">
                <button
                  class="mr10 ivu-btn ivu-btn-default"
                  type="button"
                  @click="exportSummary"
                >导出汇总</button>
                <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="exportBill">导出单据</button>
              </div>
            </Poptip>
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="Monthlyreconciliation"
            >月结对账</button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <Table
          max-height="400"
          highlight-row
          border
          :columns="columns"
          :data="data"
          @on-row-click="selete"
          ref="summary"
        ></Table>
        <Tabs v-model="detailedList" class="mt10" @click="tabName">
          <Tab-pane label="销售清单" name="key1">
            <Table
              border
              :columns="columns1"
              :data="data1"
              class="mt10"
              max-height="400"
              show-summary
              ref="sale"
            ></Table>
          </Tab-pane>
          <Tab-pane label="采购清单" name="key2">
            <Table
              border
              :columns="columns2"
              :data="data2"
              class="mt10"
              max-height="400"
              show-summary
              ref="purchase"
            ></Table>
          </Tab-pane>
        </Tabs>
      </div>
    </section>
    <selectDealings ref="selectDealings" />
    <Modal v-model="modal1" title="高级查询" @on-ok="senior">
      <div class="db pro mt20">
        <span>转单日期：</span>
        <Date-picker
          :value="value"
          format="yyyy-MM-dd"
          type="daterange"
          placeholder="选择日期"
          class="w200"
          @on-change="changedate"
        ></Date-picker>
      </div>
      <div class="db pro mt20">
        <span>客户类型：</span>
        <Select v-model="model2" style="width:200px">
          <Option v-for="item in typelist" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="db pro mt20">
        <span>客户名称：</span>
        <input type="text" class="w200" v-model="nametext" />
      </div>
      <div class="db pro mt20">
        <span>分店名称：</span>
        <Select v-model="model1" style="width:200px">
          <Option v-for="item in Branchstore" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="db pro mt20">
        <span>业务类型：</span>
        <Select v-model="model3" style="width:200px">
          <Option v-for="item in business" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="db pro mt20">
        <span>业务单号：</span>
        <input type="text" class="w200" v-model="text" />
      </div>
    </Modal>
    <Modal v-model="outStock" title="出库明细" width="1200">
      <div class="db">
        <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="print">打印</button>
        <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="exportDetail(0)">导出</button>
      </div>
      <Table
        border
        :columns="columns3"
        :data="data3"
        class="mt10"
        max-height="400"
        show-summary
        ref="noWarehousing"
      ></Table>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="onStock" title="入库明细" width="1200">
      <div class="db">
        <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="print">打印</button>
        <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="exportDetail(1)">导出</button>
      </div>
      <Table
        border
        :columns="columns4"
        :data="data4"
        class="mt10"
        max-height="400"
        show-summary
        ref="warehousing"
      ></Table>
      <div slot="footer"></div>
    </Modal>
    <Monthlyreconciliation ref="Monthlyreconciliation" />
    <PrintShow ref="PrintShow" />
  </div>
</template>

<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import selectDealings from "./../bill/components/selectCompany";
import Monthlyreconciliation from "./Monthlyreconciliation.vue";
import PrintShow from "./component/PrintShow";
import {
  getStorelist,
  getreceivable,
  getSalelist,
  getNumberList
} from "@/api/bill/saleOrder";
import { creat } from "./../components";
export default {
  components: {
    quickDate,
    selectDealings,
    Monthlyreconciliation,
    PrintShow
  },
  data() {
    return {
      detailedList: "key1",
      value: [],
      model1: "",
      model2: "",
      model3: "",
      text: "",
      nametext: "",
      modal1: false,
      outStock: false,
      onStock: false,
      flag: false,
      columns: [
        {
          title: "序号",
          type: "index",
          width: 40,
          className: "tc"
        },
        // {
        //   title: "区域",
        //   key: "area",
        //   className: "tc"
        // },
        {
          title: "店号",
          key: "orgId",
          className: "tc"
        },
        {
          title: "客户/供应商名称",
          key: "guestName",
          className: "tc"
        },
        {
          title: "客户/供应商类别",
          key: "guestTypeName",
          className: "tc"
        },
        {
          title: "对账类别",
          key: "paymentTypeName",
          className: "tc"
        },
        {
          title: "采购入库",
          key: "stockAmtIn",
          className: "tc"
        },
        {
          title: "采购退货",
          key: "stockAmtOut",
          className: "tc"
        },
        {
          title: "销售出库",
          key: "salesAmtOut",
          className: "tc"
        },
        {
          title: "销售退货",
          key: "salesAmtReturn",
          className: "tc"
        },
        {
          title: "应收应付金额",
          key: "duePayableAmt",
          className: "tc"
        },
        {
          title: "已对账未收金额",
          key: "receivedAmt",
          className: "tc"
        },
        {
          title: "已对账未付金额",
          key: "paidAmt",
          className: "tc"
        },
        {
          title: "已对账合计",
          key: "reconciledSumAmt",
          className: "tc"
        },
        {
          title: "未对账应收金额",
          key: "uncollectedAmt",
          className: "tc"
        },
        {
          title: "未对账应付金额",
          key: "unpaidAmt",
          className: "tc"
        },
        {
          title: "未对账合计",
          key: "unReconciledSumAmt",
          className: "tc"
        }
      ],
      columns1: [
        {
          title: "序号",
          type: "index",
          width: 40,
          className: "tc"
        },
        // {
        //   title: "区域",
        //   key: "area",
        //   className: "tc"
        // },
        {
          title: "店号",
          key: "orgId",
          className: "tc"
        },
        {
          title: "客户/供应商名称",
          key: "guestName",
          className: "tc"
        },
        {
          title: "客户供应商类别",
          key: "guestTypeName",
          className: "tc"
        },
        {
          title: "销售订单号",
          key: "orderNo",
          className: "tc"
        },
        {
          title: "出库单号",
          key: "serviceId",
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
                  click: async () => {
                    this.outStock = true;
                    let obj = {
                      orderCode: params.row.serviceId,
                      orderType: params.row.serviceType.value
                    };
                    let res = await this.getList(obj);
                    res.detailed.map(item => {
                      item.orderCode = params.row.serviceId;
                      item.orderType = params.row.serviceType.value;
                      item.orgId = params.row.orgId;
                      item.guestId = params.row.guestId;
                    });
                    this.data3 = res.detailed;
                  }
                }
              },
              params.row.serviceId
            );
          }
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
          title: "转单日期",
          key: "transferDate",
          className: "tc"
        },
        {
          title: "应收金额",
          key: "rpAmt",
          className: "tc"
        },
        {
          title: "已收金额",
          key: "charOffAmt",
          className: "tc"
        },
        {
          title: "未收金额",
          key: "noCharOffAmt",
          className: "tc"
        },
        {
          title: "业务员",
          key: "salesman",
          className: "tc"
        },
        {
          title: "已对账金额",
          key: "accountAmt",
          className: "tc"
        },
        {
          title: "未对账金额",
          key: "noAccountAmt",
          className: "tc"
        },
        {
          title: "草稿金额",
          key: "draftAmt",
          className: "tc"
        },
        {
          title: "备注",
          key: "remark",
          className: "tc"
        },
        {
          title: "对账门店",
          key: "accountOrgName",
          className: "tc"
        },
        {
          title: "对账人",
          key: "accountMan",
          className: "tc"
        },
        {
          title: "对账订单",
          key: "accountNo",
          className: "tc"
        }
      ],
      columns2: [
        {
          title: "序号",
          type: "index",
          width: 40,
          className: "tc"
        },
        // {
        //   title: "区域",
        //   key: "area",
        //   className: "tc"
        // },
        {
          title: "店号",
          key: "orgId",
          className: "tc"
        },
        {
          title: "客户/供应商名称",
          key: "guestName",
          className: "tc"
        },
        {
          title: "客户供应商类别",
          key: "guestTypeName",
          className: "tc"
        },
        {
          title: "采购订单号",
          key: "orderNo",
          className: "tc"
        },
        {
          title: "入库单号",
          key: "serviceId",
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
                  click: async () => {
                    this.onStock = true;
                    let obj = {
                      orderCode: params.row.serviceId,
                      orderType: params.row.serviceType.value
                    };
                    let res = await this.getList(obj);
                    this.data4 = res.detailed;
                  }
                }
              },
              params.row.serviceId
            );
          }
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
          title: "转单日期",
          key: "transferDate",
          className: "tc"
        },
        {
          title: "应付金额",
          key: "rpAmt",
          className: "tc"
        },
        {
          title: "已付金额",
          key: "charOffAmt",
          className: "tc"
        },
        {
          title: "未付金额",
          key: "noCharOffAmt",
          className: "tc"
        },
        {
          title: "业务员",
          key: "salesman",
          className: "tc"
        },
        {
          title: "已对账金额",
          key: "accountAmt",
          className: "tc"
        },
        {
          title: "未对账金额",
          key: "noAccountAmt",
          className: "tc"
        },
        {
          title: "草稿金额",
          key: "draftAmt",
          className: "tc"
        },
        {
          title: "备注",
          key: "remark",
          className: "tc"
        },
        {
          title: "对账门店",
          key: "accountOrgName",
          className: "tc"
        },
        {
          title: "对账人",
          key: "accountMan",
          className: "tc"
        },
        {
          title: "对账订单",
          key: "accountNo",
          className: "tc"
        }
      ],
      columns3: [
        {
          title: "序号",
          type: "index",
          width: 40,
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
          title: "配件规格",
          key: "specification",
          className: "tc"
        },
        {
          title: "配件车型",
          key: "carModel",
          className: "tc"
        },
        {
          title: "配件品牌",
          key: "partBrand",
          className: "tc"
        },
        {
          title: "配件厂牌",
          key: "factoryBrand",
          className: "tc"
        },
        {
          title: "OEM码",
          key: "oemCode",
          className: "tc"
        },
        {
          title: "税率",
          key: "taxRate",
          className: "tc"
        },
        {
          title: "数量",
          key: "qty",
          className: "tc"
        },
        {
          title: "单位",
          key: "unitId",
          className: "tc"
        },
        {
          title: "单价",
          key: "price",
          className: "tc"
        },
        {
          title: "金额",
          key: "orderAmt",
          className: "tc"
        },
        {
          title: "备注",
          key: "remark",
          className: "tc"
        }
      ],
      columns4: [
        {
          title: "序号",
          type: "index",
          width: 40,
          className: "tc"
        },
        {
          title: "门店名称",
          key: "orgName",
          className: "tc"
        },
        {
          title: "是否直发",
          key: "isDirect",
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
          title: "配件规格",
          key: "specification",
          className: "tc"
        },
        {
          title: "配件车型",
          key: "carModel",
          className: "tc"
        },
        {
          title: "配件品牌",
          key: "partBrand",
          className: "tc"
        },
        {
          title: "配件厂牌",
          key: "factoryBrand",
          className: "tc"
        },
        {
          title: "OEM码",
          key: "oemCode",
          className: "tc"
        },
        {
          title: "税率",
          key: "taxRate",
          className: "tc"
        },
        {
          title: "数量",
          key: "qty",
          className: "tc"
        },
        {
          title: "单位",
          key: "unitId",
          className: "tc"
        },
        {
          title: "单价",
          key: "price",
          className: "tc"
        },
        {
          title: "金额",
          key: "orderAmt",
          className: "tc"
        },
        {
          title: "备注",
          key: "remark",
          className: "tc"
        },
        {
          title: "不含税价格",
          key: "noTaxPrice",
          className: "tc"
        },
        {
          title: "不含税金额",
          key: "noTaxAmt",
          className: "tc"
        },
        {
          title: "含税单价",
          key: "taxPrice",
          className: "tc"
        },
        {
          title: "含税金额",
          key: "taxAmt",
          className: "tc"
        }
      ],
      data: [],
      data1: [],
      data2: [],
      data3: [],
      data4: [],
      typelist: [
        {
          value: "HS",
          label: "华胜"
        },
        {
          value: "NB",
          label: "内部"
        },
        {
          value: "WB",
          label: "外部"
        }
      ],
      Branchstore: [],
      business: [
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
      ]
    };
  },
  async mounted() {
    this.parameter = [];
    let arr = await creat(this.$refs.quickDate.val, this.$store);
    let obj = {
      orgId: arr[1],
      startDate: arr[0][0],
      endDate: arr[0][1]
    };
    this.getGeneral(obj);
    this.value = arr[0];
    this.model1 = arr[1];
    this.Branchstore = arr[2];
  },
  methods: {
    // 快速查询
    quickDate(data) {
      this.value = data;
    },
    // 选择日期
    changedate(daterange) {
      this.value = daterange;
    },
    // 更多条件查询
    senior() {
      let obj = {
        orgId: this.model1,
        startDate: this.value[0],
        endDate: this.value[1],
        guestType: this.model2,
        tenantName: this.nametext,
        serviceType: this.model3,
        serviceId: this.text
      };
      this.getGeneral(obj);
    },
    // 查询应收/应付总表
    query() {
      let obj = {
        orgId: this.model1,
        startDate: this.value[0],
        endDate: this.value[1]
      };
      this.getGeneral(obj);
    },
    // 应收应付接口
    getGeneral(obj) {
      getreceivable(obj).then(res => {
        if (res.data.length !== 0) {
          res.data.map((item, index) => {
            item.num = index + 1;
          });
          this.data = res.data;
        }
      });
    },
    // 销售/采购接口
    getDetailed(data, obj) {
      getSalelist({
        tenantId: data.tenantId,
        orgId: data.orgId,
        startDate: obj.startDate,
        endDate: obj.endDate,
        guestId: data.guestId
      }).then(res => {
        if (res.data.one) {
          res.data.one.map((item, index) => {
            item.num = index + 1;
            item.guestTypeName = item.guestType.name;
            item.serviceTypeName = item.serviceType.name;
            item.speciesName = item.species.name;
          });
          this.data1 = res.data.one;
        } else {
          this.data1 = [];
        }
        if (res.data.two) {
          res.data.two.map((item, index) => {
            item.num = index + 1;
            item.guestTypeName = item.guestType.name;
            item.serviceTypeName = item.serviceType.name;
            item.speciesName = item.species.name;
          });
          this.data2 = res.data.two;
        } else {
          this.data2 = [];
        }
      });
    },
    // 往来单位
    Dealings() {
      this.$refs.selectDealings.openModel();
    },
    // 月结对账
    Monthlyreconciliation() {
      // this.$refs.Monthlyreconciliation.modal = true;
      if (JSON.stringify(this.$refs.Monthlyreconciliation.parameter) !== "{}") {
        this.$refs.Monthlyreconciliation.modal = true;
      } else {
        this.$Message.warning("请选择要对账的数据");
      }
    },
    // 点击总汇表数据查询销售/采购清单
    selete(data) {
      let date = {
        startDate: this.value[0],
        endDate: this.value[1]
      };
      this.$refs.Monthlyreconciliation.parameter = { ...data, ...date };
      this.getDetailed(data, this.value);
    },
    // 查询出/入库单号明细
    async getList(obj) {
      let detailed = [];
      await getNumberList(obj).then(res => {
        res.data.map((item, index) => {
          item.num = index + 1;
        });
        detailed = res.data;
      });
      return { detailed };
    },
    // 导出汇总
    exportSummary() {
      if (this.data.length !== 0) {
        this.$refs.summary.exportCsv({
          filename: "应收应付汇总表"
        });
      } else {
        this.$message.error("应收应付汇总表暂无数据");
      }
    },
    // 当前标签页的name
    tabName(name) {
      this.detailedList = name;
    },
    // 导出单据
    exportBill() {
      if (this.detailedList === "key1") {
        if (this.data1.length !== 0) {
          this.$refs.sale.exportCsv({
            filename: "销售清单"
          });
        } else {
          this.$message.error("销售清单暂无数据");
        }
      } else if (this.detailedList === "key2") {
        if (this.data2.length !== 0) {
          this.$refs.purchase.exportCsv({
            filename: "采购清单"
          });
        } else {
          this.$message.error("销售清单暂无数据");
        }
      }
    },
    // 出/入库明细导出
    exportDetail(type) {
      if (type) {
        this.$refs.warehousing.exportCsv({
          filename: "入库单配件明细"
        });
      } else {
        this.$refs.noWarehousing.exportCsv({
          filename: "出库单配件明细"
        });
      }
    },
    // 打印
    print() {
      // console.log(this.$refs.PrintShow)
      this.$refs.PrintShow.openModal();
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
.pro span {
  display: inline-block;
  width: 100px;
  text-align: right;
}
.pro i {
  font-style: normal;
}
.pro input {
  border: 1px solid #dddddd;
  height: 28px;
}
</style>