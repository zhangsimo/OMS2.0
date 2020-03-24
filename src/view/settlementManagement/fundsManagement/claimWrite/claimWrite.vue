<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="db mt20">
          <span>门店：</span>
          <Input v-model="orgName" readonly class="w100" />
          <Button class="ml10" @click="write">核销对账单</Button>
        </div>
      </div>
      <div class="ml20 mb10">
        <Row>
          <Col span="6">
            <span>对账单勾选金额</span>
          </Col>
          <Col span="3">
            <span>{{currentAccount.receiptPayment}}</span>
          </Col>
          <Col span="6">
            <span>认领款勾选金额</span>
          </Col>
          <Col span="3">
            <span>{{claimedAmt}}</span>
          </Col>
          <Col span="2">
            <span>差异</span>
          </Col>
          <Col span="2">
            <span>{{difference}}</span>
          </Col>
        </Row>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <Split v-model="split1">
          <div slot="left">
            <h4 class="mb10 p5 pl10" style="background:#F2F2F2">未核销对账单</h4>
            <span>往来单位：</span>
            <Select v-model="companyId" class="w100" filterable>
              <Option v-for="item in company" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <span class="ml10">收付类型：</span>
            <Select v-model="paymentId" class="w100" filterable>
              <Option
                v-for="item in paymentList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
            <span class="ml10">金额：</span>
            <InputNumber v-model="amt" class="w50" />
            <button class="ivu-btn ivu-btn-default ml10 mt10" type="button" @click="queryNoWrite">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
            <Table
              border
              class="mt10"
              :columns="accountNoWrite"
              :data="accountNoWriteData"
              max-height="400"
              highlight-row
              @on-current-change="accountNoWriteChange"
            ></Table>
            <Page
              show-sizer
              show-total
              show-elevator
              class="mt10 tr mr10"
              size="small"
              :total="accountPage.total"
              :current="accountPage.page"
              :page-size="accountPage.size"
              @on-change="pageChangeNo"
              @on-page-size-change="sizeChangeNo"
            />
          </div>
          <div slot="right" class="h500">
            <Split v-model="split2" mode="vertical">
              <div slot="top">
                <h4 class="mb10 p5 pl10" style="background:#F2F2F2">本店待认领款</h4>
                <span class="ml10">往来单位：</span>
                <Select v-model="companyId" class="w150" filterable>
                  <Option
                    v-for="item in company"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
                <span class="ml10">金额：</span>
                <InputNumber v-model="amt" class="w50" />
                <span class="ml10">对方户名：</span>
                <Input v-model="bankNameO" class="w100" />
                <button class="ivu-btn ivu-btn-default ml10" type="button" @click="queryClaimed">
                  <i class="iconfont iconchaxunicon"></i>
                  <span>查询</span>
                </button>
                <br />
                <Button class="mt10 ml10" @click="distributionDelete">撤销分配</Button>
                <Button class="mt10 ml10" @click="clim(0)">预收款认领</Button>
                <Button class="mt10 ml10" @click="clim(1)">预收款支出认领</Button>
                <Button class="mt10 ml10" @click="expenditureClim(0)">预付款认领</Button>
                <Button class="mt10 ml10" @click="expenditureClim(1)">预付款收回认领</Button>
                <claim ref="claim" />
              </div>
              <div slot="bottom">
                <h4 class="mb10 p5 pl10" style="background:#F2F2F2">连锁待分配款项</h4>
                <span class="ml10">区域：</span>
                <Select v-model="areaId" class="w100" filterable>
                  <Option
                    v-for="item in areaList"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
                <span class="ml10">门店：</span>
                <Select v-model="orgId" class="w150" filterable>
                  <Option
                    v-for="item in orgList"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
                <span class="ml10">金额：</span>
                <InputNumber v-model="amt" class="w50" />
                <span class="ml10">对方户名：</span>
                <Input v-model="bankNameO" class="w100" />
                <button
                  class="ivu-btn ivu-btn-default ml10"
                  type="button"
                  @click="queryDistribution"
                >
                  <i class="iconfont iconchaxunicon"></i>
                  <span>查询</span>
                </button>
                <button
                  class="ivu-btn ivu-btn-default ml10 mt10"
                  type="button"
                  @click="distributionShop"
                >分配至本店</button>
                <Table
                  border
                  class="mt10"
                  :columns="distribution"
                  :data="distributionData"
                  max-height="400"
                  @on-selection-change="distributionSelection"
                ></Table>
                <Page
                  show-sizer
                  show-total
                  show-elevator
                  class="mt10 tr"
                  size="small"
                  :total="distributionPage.total"
                  :current="distributionPage.page"
                  :page-size="distributionPage.size"
                  @on-change="pageChange"
                  @on-page-size-change="sizeChange"
                />
              </div>
            </Split>
          </div>
        </Split>
      </div>
    </section>
    <advance ref="advance" />
    <expenditure ref="expenditure" :title="title" />
    <settlement ref="settlement" />
    <chargeAdvance ref="chargeAdvance" />
  </div>
</template>
<script>
import { getbayer } from "@/api/AlotManagement/threeSupplier";
import { getSupplierList } from "_api/purchasing/purchasePlan";
import advance from "./components/Advance";
import chargeAdvance from "./components/chargeAdvance";
import expenditure from "./components/expenditure";
import settlement from "../../bill/components/settlement";
import claim from "../../components/claimed";
import { getDataDictionaryTable } from "@/api/system/dataDictionary/dataDictionaryApi";
import {
  accountNoSelete,
  distributionSelete,
  claimedFund,
  distributionShop
} from "_api/settlementManagement/fundsManagement/claimWrite.js";
import {are } from '@/api/settlementManagement/fundsManagement/capitalChain'
import { creat } from "../../components";
import bus from "../../bill/Popup/Bus";
export default {
  components: { advance, expenditure, settlement, claim, chargeAdvance },
  data() {
    return {
      title: "预付款认领", //弹框标题
      split1: 0.4, //左右面板分割
      split2: 0.52, //上下面板分割
      orgName: "", //门店
      companyId: "", //往来单位
      company: [], //往来单位下拉框
      orgId: "", //门店
      orgList: [], //门店
      areaId:0,//区域
      areaList:[{value:0 ,label:'全部'}],//区域
      bankNameO: "", //对方户名
      paymentId: "YJDZ", //收付类型
      paymentList: [], //收付类型下拉框
      amt: 0, //金额
      accountPage: {
        page: 1,
        total: 0,
        size: 10
      }, //未核销分页
      currentAccount: {}, //未核销选中的数据
      accountNoWrite: [
        {
          title: "序号",
          type: "index",
          align: "center",
          width: 40
        },
        {
          title: "门店名称",
          key: "orgName",
          align: "center"
        },
        {
          title: "对账单号",
          key: "accountNo",
          align: "center"
        },
        {
          title: "往来单位",
          key: "guestName",
          align: "center"
        },
        {
          title: "收付类型",
          key: "receivePaymentTypeName",
          align: "center"
        },
        {
          title: "实际收款/付款",
          key: "actualCollectionOrPayment",
          align: "center"
        },
        {
          title: "已收/已付金额",
          key: "amountReceivedOrPaid",
          align: "center"
        },
        {
          title: "未收/未付金额",
          key: "amountNoCharOffOrUnpaid",
          align: "center"
        }
      ], //未核销对账单表格数据
      accountNoWriteData: [], //未核销对账单表格数据
      distribution: [
        {
          title: "选择",
          type: "selection",
          align: "center",
          width: 40
        },
        {
          title: "序号",
          type: "index",
          align: "center",
          width: 40
        },
        {
          title: "所属区域",
          key: "area",
          align: "center"
        },
        {
          title: "所属门店",
          key: "shopName",
          align: "center"
        },
        {
          title: "所属店号",
          key: "shopCode",
          align: "center"
        },
        {
          title: "账户",
          key: "accountName",
          align: "center"
        },
        {
          title: "账号",
          key: "accountCode",
          align: "center"
        },
        {
          title: "开户行",
          key: "bankName",
          align: "center"
        },
        {
          title: "对应科目",
          key: "mateAccountName",
          align: "center"
        },
        {
          title: "发生日期",
          key: "createTime",
          align: "center"
        },
        {
          title: "收入金额",
          key: "incomeMoney",
          align: "center"
        },
        {
          title: "支出金额",
          key: "paidMoney",
          align: "center"
        },
        {
          title: "对方户名",
          key: "reciprocalAccountName",
          align: "center"
        },
        {
          title: "交易备注",
          key: "tradingNote",
          align: "center"
        }
      ], //连锁待分配款项
      distributionData: [], //连锁待分配款项列表
      distributionPage: {
        page: 1,
        total: 0,
        size: 10
      }, //连锁待分配款项分页
      currentDistribution: [], //本店待认领款选中的数据
      claimedAmt: 0, //认领款勾选金额
      difference: 0 //差异
    };
  },
  async mounted() {
    this.getOne();
    //收付类型数据字典
    getDataDictionaryTable({ dictCode: "RECEIVE_PAYMENT_TYPE" }).then(res => {
      res.data.map(item => {
        this.paymentList.push({
          value: item.itemCode,
          label: item.itemName
        });
      });
    });
    let arr = await creat([], this.$store);
    this.orgName = arr[3];
    this.orgId = arr[1];
    this.orgList = arr[2];
    this.claimedList();
    this.distributionList();
    this.getAllAre()
    if (Object.keys(this.$route.params).length !== 0) {
      this.$route.params.data.receivePaymentTypeName = this.$route.params.data.paymentTypeName;
      this.$route.params.data.actualCollectionOrPayment = this.$route.params.data.receiptPayment;
      if (this.$route.params.data.billingTypeName === "付款") {
        this.$route.params.data.amountReceivedOrPaid = this.$route.params.data.amountPaid;
        this.$route.params.data.amountNoCharOffOrUnpaid = this.$route.params.data.unpaidAmount;
      } else {
        this.$route.params.data.amountReceivedOrPaid = this.$route.params.data.amountReceived;
        this.$route.params.data.amountNoCharOffOrUnpaid = this.$route.params.data.noCharOffAmt;
      }
      this.accountNoWriteData.push(this.$route.params.data);
    }
  },
  methods: {
    // 往来单位选择
    async getOne() {
      const res = await getSupplierList({});
      const res1 = await getbayer({});
      this.company = [];
      let data = [];
      let result = [];
      let obj = {};
      if (res.data.length !== 0 && res1.data.content.length !== 0) {
        data = [...res.data, ...res1.data.content];
      } else if (res.data.length !== 0) {
        data = res.data;
      } else if (res1.data.content.length !== 0) {
        data = res.data.content;
      }
      for (let i in data) {
        if (!obj[data[i].id]) {
          result.push(data[i]);
          obj[data[i].id] = 1;
        }
      }
      data = result;
      data.map(item => {
        this.company.push({
          label: item.fullName,
          value: item.id
        });
      });
    },
    //核销对账单
    write() {
      if (Object.keys(this.currentAccount).length === 0)
        return this.$message.error("请选择一条未核销对账单");
      if (this.currentClaimed.length === 0)
        return this.$message.error("至少选择一条本店待认领款");
      this.$refs.settlement.Settlement = true;
    },
    //未核销对账单查询
    queryNoWrite() {
      this.noWrite();
    },
    // 本店待认领款查询
    queryClaimed() {
      this.claimedList();
    },
    //连锁待分配款项
    queryDistribution() {
      this.distributionList();
    },
    //撤销分配
    distributionDelete() {
      if (this.currentClaimed.length !== 0) {
        this.$Modal.confirm({
          title: "是否撤回分配",
          onOk: () => {},
          onCancel: () => {}
        });
      } else {
        this.$message.error("请先选择数据");
      }
    },
    //预收款认领/预收款支出认领
    clim(type) {
      if (
        this.$refs.claim.currentClaimed.length !== 0 &&
        this.$refs.claim.currentClaimed[0].incomeMoney
      ) {
        if (type) {
          this.$refs.chargeAdvance.modal = true;
        } else {
          this.$refs.advance.modal = true;
        }
      } else {
        this.$message.error("至少选择一条数据且是收款数据");
      }
    },
    //预付款认领/预付款收回认领
    expenditureClim(type) {
      if (
        this.$refs.claim.currentClaimed.length !== 0 &&
        this.$refs.claim.currentClaimed[0].paidMoney
      ) {
        if (type) {
          this.title = "预付款收回认领";
        } else {
          this.title = "预付款认领";
        }
        this.$refs.expenditure.modal = true;
      } else {
        this.$message.error("至少选择一条数据且是付款数据");
      }
    },
    //分配至本店
    distributionShop() {
      if (this.currentDistribution.length !== 0) {
        let obj =[]
        this.currentDistribution.map(item=>{
          obj.push({id:item.id})
        })
        distributionShop(obj).then(res => {
          if(res.code===0){
            this.distributionSelection()
            this.claimedList()
          }
        });
      } else {
        this.$message.error("请先选择数据");
      }
    },
    //未核销选中的数据
    accountNoWriteChange(currentRow) {
      this.currentAccount = currentRow;
      this.difference = currentRow.actualCollectionOrPayment - this.claimedAmt;
    },
    //连锁待分配款项选中的数据
    distributionSelection(selection) {
      this.currentDistribution = selection;
      bus.$emit("paymentInfo", selection);
    },
    //未核销对账单查询接口
    noWrite() {
      let obj = {
        amount: this.amt,
        guestId: this.companyId,
        receivePaymentType: this.paymentId,
        page: this.accountPage.page - 1,
        size: this.accountPage.size
      };
      accountNoSelete(obj).then(res => {
        if (res.code === 0) {
          this.accountNoWriteData = res.data.content;
          this.accountPage.total = res.data.totalElements;
        }
      });
    },
    //本店待认领款查询接口
    claimedList() {
      let obj = {
        amount: this.amt,
        suppliers: this.companyId,
        reciprocalAccountName: this.bankNameO,
        page: this.$refs.claim.claimedPage.page - 1,
        size: this.$refs.claim.claimedPage.size
      };
      claimedFund(obj).then(res => {
        if (res.code === 0) {
          this.$refs.claim.claimedData = res.data.content;
          this.$refs.claim.claimedPage.total = res.data.totalElements
        }
      });
    },
    //连锁待分配款项查询接口
    distributionList() {
      let obj = {
        area: this.areaId,
        orgId: this.orgId,
        amount: this.amt,
        reciprocalAccountName: this.bankNameO,
        page: this.distributionPage.page - 1,
        size: this.distributionPage.size
      };
      distributionSelete(obj).then(res => {
        if(res.code===0){
          this.distributionData = res.data.content
          this.distributionPage.total = res.data.totalElements
        }
      });
    },
    //获取全部地址
    async getAllAre() {
      let res = await are();
      if (res.code === 0) {
        res.data.map(item=>{
          this.areaList.push({
            value:item.id,
            label:item.companyName
          })
        })
      }
    },
    //未核销对账单页码改变
    pageChangeNo(val) {
      this.accountPage.page = val;
    },
    //未核销对账单每页条数改变
    sizeChangeNo(val) {
      this.accountPage.size = val;
    },
    // 连锁待分配款项页码
    pageChange(val) {
      this.distributionPage.page = val;
    },
    // 连锁待分配款项每页条数
    sizeChange(val) {
      this.distributionPage.size = val;
    }
  },
  watch: {
    currentClaimed: {
      handler(val, od) {
        if (val !== od) {
          this.claimedAmt = 0;
          val.map(item => {
            this.claimedAmt += item.index * 1;
          });
          this.difference = this.currentAccount.actualCollectionOrPayment
            ? this.currentAccount.actualCollectionOrPayment - this.claimedAmt
            : 0 - this.claimedAmt;
        }
      },
      deep: true
    }
  }
};
</script>
<style>
.top-pane,
.bottom-pane {
  overflow: auto;
}
</style>