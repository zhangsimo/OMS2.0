<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <quickDate class="mr10" ref="quickDate"></quickDate>
          </div>
          <div class="db ml20">
            <span>转单期间：</span>
            <Date-picker :value="value" type="daterange" placeholder="选择日期" class="w200"></Date-picker>
          </div>
          <div class="db ml20">
            <span>分店名称：</span>
            <i-select v-model="model1" class="w150">
              <i-option
                v-for="item in Branchstore"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</i-option>
            </i-select>
          </div>
          <div class="db ml5">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="query">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
          <div class="db ml10">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="modal1 = true;value1=[]">
              <i class="iconfont iconcaidan"></i>
              <span>更多</span>
            </button>
          </div>
          <div class="db ml10">
            <Poptip placement="bottom">
              <button class="mr10 ivu-btn ivu-btn-default" type="button">导出</button>
              <div slot="content">
                <button class="mr10 ivu-btn ivu-btn-default" type="button">导出汇总</button>
                <button class="mr10 ivu-btn ivu-btn-default" type="button">导出单据</button>
                <button class="mr10 ivu-btn ivu-btn-default" type="button">导出配件明细</button>
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
        <i-table class="detailed" border :columns="columns" :data="data" @on-row-click="selete"></i-table>
        <Tabs active-key="key1" class="mt10">
          <Tab-pane label="销售清单" key="key1">
            <i-table
              border
              :columns="columns1"
              :data="data1"
              class="mt10 detailed"
              @on-row-click="seletelist"
            ></i-table>
          </Tab-pane>
          <Tab-pane label="采购清单" key="key2">
            <i-table
              border
              :columns="columns2"
              :data="data2"
              class="mt10 detailed"
              @on-row-click="seletelist"
            ></i-table>
          </Tab-pane>
        </Tabs>
      </div>
    </section>
    <selectDealings ref="selectDealings" />
    <Modal v-model="modal1" title="高级查询" @on-ok="senior">
      <div class="db pro mt20">
        <span>转单日期：</span>
        <Date-picker :value="value1" format="yyyy-MM-dd" type="daterange" placeholder="选择日期" class="w200" @on-change="changedate"></Date-picker>
      </div>
      <div class="db pro mt20">
        <span>客户类型：</span>
        <i-select v-model="model2" style="width:200px">
          <i-option v-for="item in typelist" :value="item.value" :key="item.value">{{ item.label }}</i-option>
        </i-select>
      </div>
      <div class="db pro mt20">
        <span>客户名称：</span>
        <input type="text" class="w200" v-model="nametext" />
      </div>
      <div class="db pro mt20">
        <span>分店名称：</span>
        <i-select v-model="model1" style="width:200px">
          <i-option
            v-for="item in Branchstore"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</i-option>
        </i-select>
      </div>
      <div class="db pro mt20">
        <span>业务类型：</span>
        <i-select v-model="model3" style="width:200px">
          <i-option v-for="item in business" :value="item.value" :key="item.value">{{ item.label }}</i-option>
        </i-select>
      </div>
      <div class="db pro mt20">
        <span>业务单号：</span>
        <input type="text" class="w200" v-model="text" />
      </div>
    </Modal>
    <Modal v-model="modal2" title="单号明细" width="1200">
      <div class="db">
        <button class="mr10 ivu-btn ivu-btn-default" type="button">打印</button>
        <button class="mr10 ivu-btn ivu-btn-default" type="button">导出</button>
      </div>
      <i-table border :columns="columns3" :data="data3" class="mt10"></i-table>
      <div slot="footer"></div>
    </Modal>
    <Monthlyreconciliation ref="Monthlyreconciliation" />
  </div>
</template>

<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import selectDealings from "./../bill/components/selectCompany";
import Monthlyreconciliation from "./Monthlyreconciliation.vue";
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
    Monthlyreconciliation
  },
  data() {
    return {
      value: [],
      value1: ["2019-12-02", "2019-12-16"],
      model1: "",
      model2: "",
      model3: "",
      text: "",
      nametext: '',
      modal1: false,
      modal2: false,
      flag: false,
      columns: [
        {
          title: "序号",
          key: "num",
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
          key: "num",
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
          key: "guestType",
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
          className: "tc"
        },
        {
          title: "来源",
          key: "serviceSourceName",
          className: "tc"
        },
        {
          title: "业务类型",
          key: "serviceType",
          className: "tc"
        },
        {
          title: "含税标志",
          key: "taxSignName",
          className: "tc"
        },
        {
          title: "油品/配件",
          key: "species",
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
          key: "num",
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
          key: "guestType",
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
          className: "tc"
        },
        {
          title: "来源",
          key: "serviceSourceName",
          className: "tc"
        },
        {
          title: "业务类型",
          key: "serviceType",
          className: "tc"
        },
        {
          title: "含税标志",
          key: "taxSignName",
          className: "tc"
        },
        {
          title: "油品/配件",
          key: "species",
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
          key: "num",
          width: 40,
          className: "tc"
        },
        {
          title: "配件内码",
          key: "partInnerId;",
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
          title: "基本单位",
          key: "basicUnit",
          className: "tc"
        },
        {
          title: "件规",
          key: "guige",
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
      data: [],
      data1: [],
      data2: [],
      data3: [],
      typelist: [
        {
          value: "type1",
          label: "外部"
        },
        {
          value: "type2",
          label: "华胜"
        },
        {
          value: "type3",
          label: "内部"
        }
      ],
      Branchstore: [],
      business: [
        {
          value: "business1",
          label: "销售出库"
        },
        {
          value: "business2",
          label: "采购入库"
        },
        {
          value: "business3",
          label: "采购退货"
        },
        {
          value: "business4",
          label: "销售退货"
        }
      ]
    };
  },
  async mounted() {
    let arr = await creat(this.$refs.quickDate.val, this.$store);
    this.getGeneral(arr);
    this.getDetailed();
    this.value = arr[0];
    this.model1 = arr[1];
    this.Branchstore = arr[2];
  },
  methods: {
    changedate (daterange) {
      this.value1 = daterange
    },
    senior() {
      console.log(this.value1);
      console.log(this.model1);
      console.log(this.model2);
      console.log(this.model3);
      console.log(this.text);
      console.log(this.nametext);
    },
    query() {
      this.value = this.$refs.quickDate.val;
      console.log(this.value);
      let arr = [this.value, this.model1];
      this.getGeneral(arr);
    },
    getGeneral(arr) {
      getreceivable({
        orgId: arr[1],
        startDate: "2019-10-01 00:00:00",
        endDate: "2019-12-30 00:00:01"
      }).then(res => {
        res.data.list.map((item, index) => {
          item.num = index + 1;
        });
        this.data = res.data.list;
      });
    },
    getDetailed() {
      getSalelist().then(res => {
        let number = 0;
        let totalrpAmt = 0;
        let totalcharOffAmt = 0;
        let totalnoCharOffAmt = 0;
        let totalaccountAmt = 0;
        let totalnoAccountAmt = 0;
        let number1 = 0;
        let totalrpAmt1 = 0;
        let totalcharOffAmt1 = 0;
        let totalnoCharOffAmt1 = 0;
        let totalaccountAmt1 = 0;
        let totalnoAccountAmt1 = 0;
        res.data.one.map((item, index) => {
          item.num = index + 1;
          let guestType = JSON.parse(item.guestType);
          let serviceType = JSON.parse(item.serviceType);
          let species = JSON.parse(item.species);
          item.guestType = guestType.name;
          item.serviceType = serviceType.name;
          item.species = species.name;
          number += 1;
          totalrpAmt += item.rpAmt;
          totalcharOffAmt += item.charOffAmt;
          totalnoCharOffAmt += item.noCharOffAmt;
          totalaccountAmt += item.accountAmt;
          totalnoAccountAmt += item.noAccountAmt;
        });
        res.data.two.map((item, index) => {
          item.num = index + 1;
          let guestType = JSON.parse(item.guestType);
          let serviceType = JSON.parse(item.serviceType);
          let species = JSON.parse(item.species);
          item.guestType = guestType.name;
          item.serviceType = serviceType.name;
          item.species = species.name;
          number1 += 1;
          totalrpAmt1 += item.rpAmt;
          totalcharOffAmt1 += item.charOffAmt;
          totalnoCharOffAmt1 += item.noCharOffAmt;
          totalaccountAmt1 += item.accountAmt;
          totalnoAccountAmt1 += item.noAccountAmt;
        });
        this.data1 = res.data.one;
        this.data2 = res.data.two;
        this.data1.push({
          num: "合计",
          serviceId: number,
          rpAmt: totalrpAmt,
          charOffAmt: totalcharOffAmt,
          noCharOffAmt: totalnoCharOffAmt,
          accountAmt: totalaccountAmt,
          noAccountAmt: totalnoAccountAmt
        });
        this.data2.push({
          num: "合计",
          serviceId: number1,
          rpAmt: totalrpAmt1,
          charOffAmt: totalcharOffAmt1,
          noCharOffAmt: totalnoCharOffAmt1,
          accountAmt: totalaccountAmt1,
          noAccountAmt: totalnoAccountAmt1
        });
      });
    },
    Dealings() {
      this.$refs.selectDealings.openModel();
    },
    Monthlyreconciliation() {
      this.$refs.Monthlyreconciliation.modal = true;
    },
    selete(data, index) {
      // console.log(data)
      // console.log(this.ind)
    },
    seletelist() {
      this.modal2 = true;
      getNumberList({
        orderCode: "CGR00000020191116010100000190",
        orderType: "0"
      }).then(res => {
        let partId = 0;
        let qty = 0;
        let orderAmt = 0
        res.data.map((item,index) => {
          item.num = index + 1
          partId++
          qty += item.qty
          orderAmt += item.orderAmt
        })
        this.data3 = res.data
        this.data3.push({
          num: '合计',
          partId,
          qty,
          orderAmt
        })
      });
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
.ivu-poptip-popper .ivu-poptip-body {
  padding: 0;
  height: 150px;
}
.detailed {
  max-height: 400px;
  overflow: auto;
}
</style>