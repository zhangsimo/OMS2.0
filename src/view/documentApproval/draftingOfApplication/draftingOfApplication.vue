<template>
  <div class="bigbox">
    <h5 class="title">行政流程</h5>
    <Row class="mt20">
      <Col span="6">
        <div class="omnirange" @click="open(0)">
          <span>费用报销申请</span>
          <img src="@/assets/images/documentApproval/expenseReimbursement.png" alt />
        </div>
      </Col>
      <Col span="6">
        <div class="omnirange" @click="open(1)">
          <span>因公借支申请</span>
          <img src="@/assets/images/documentApproval/atStateExpense.png" alt />
        </div>
      </Col>
      <Col span="6">
        <div class="omnirange" @click="open(2)">
          <span>请示单申请</span>
          <img src="@/assets/images/documentApproval/checkWithSingle.png" alt />
        </div>
      </Col>
    </Row>
    <h5 class="title mt30">财务流程</h5>
    <Row class="mt20">
      <Col span="6">
        <div class="omnirange" @click="open(3)">
          <span>内部资金调拨申请</span>
          <img src="@/assets/images/documentApproval/interior.png" alt />
        </div>
      </Col>
      <Col span="6">
        <div class="omnirange" @click="open(4)">
          <span>其他付款申请</span>
          <img src="@/assets/images/documentApproval/Other.png" alt />
        </div>
      </Col>
      <Col span="6">
        <div class="omnirange" @click="open(5)">
          <span>预收款支出申请</span>
          <img src="@/assets/images/documentApproval/forwardSale.png" alt />
        </div>
      </Col>
    </Row>
    <h5 class="title mt30">业务流程</h5>
    <Row class="mt20">
      <Col span="6">
        <div class="omnirange" @click="open(6)">
          <span>对账单申请</span>
          <img src="@/assets/images/documentApproval/reconciliation.png" alt />
        </div>
      </Col>
      <Col span="6">
        <div class="omnirange" @click="open(7)">
          <span>预付款申请</span>
          <img src="@/assets/images/documentApproval/advancePayment.png" alt />
        </div>
      </Col>
    </Row>

    <!--      对应各个模态框-->
    <!--      费用报销报销-->
    <ExpenseReimbursement ref="ExpenseReimbursement" :list="modelType"></ExpenseReimbursement>
    <!--      其他付款申请-->
    <OtherPayment ref="OtherPayment" :list="modelType"></OtherPayment>
    <!--      因公借支申请-->
    <PublicRequest ref="PublicRequest" :list="modelType"></PublicRequest>
    <!--      请示单申请-->
    <AskForInstrucions ref="AskForInstrucions" :list="modelType"></AskForInstrucions>
    <!--      预收款支出申请-->
    <CreditSpending ref="CreditSpending" :list="modelType"></CreditSpending>
    <!--      预付款申请-->
    <AdvanceApply ref="AdvanceApply" :list="modelType"></AdvanceApply>
    <!--      内部资金调拨-->
    <InternalFinance ref="InternalFinance" :list="modelType"></InternalFinance>
  </div>
</template>

<script>
import ExpenseReimbursement from "../component/ExpenseReimbursement";
import OtherPayment from "../component/OtherPayment";
import PublicRequest from "../component/PublicRequest";
import AskForInstrucions from "../component/AskForInstructions";
import CreditSpending from "../component/CreditSpending";
import AdvanceApply from "../component/AdvanceApply";
import InternalFinance from "../component/InternalFinance";
import { getComenAndGo, getAllSalesList, getPayList } from "../component/utils";


export default {
  name: "documentApprovalDraftingOfApplication",
  components: {
    ExpenseReimbursement,
    OtherPayment,
    PublicRequest,
    AskForInstrucions,
    CreditSpending,
    AdvanceApply,
    InternalFinance
  },

  data() {
    return {
      //打开模态框状态 type 1 新增 2修改 3查看 4审核
      modelType: {
        type: 1,
        id: ""
      }
    };
  },
  async mounted() {
    this.modelType.allSalesList = await getAllSalesList();
    // this.modelType.salesList = await getComenAndGo();
    this.modelType.payList = await getPayList();
  },
  methods: {
    open(index) {
      let arr = document.getElementsByClassName("omnirange");
      arr.forEach(item => {
        if (item.classList.contains("active")) {
          item.classList.remove("active");
        }
      });
      arr[index].classList.add("active");
      switch (index) {
        case 0:
          this.$refs.ExpenseReimbursement.open();
          break;
        case 1:
          this.$refs.PublicRequest.open();
          break;
        case 2:
          this.$refs.AskForInstrucions.open();
          break;
        case 3:
          this.$refs.InternalFinance.open();
          break;
        case 4:
          this.$refs.OtherPayment.open();
          break;
        case 5:
          this.$refs.CreditSpending.open();
          break;
        case 6:
          // console.log(index);
          break;
        case 7:
          this.$refs.AdvanceApply.open();
          break;
      }
    }
  }
};
</script>

<style scoped lang="less">
.bigbox {
  height: 100%;
  background-color: #fff;
  padding: 20px;
  .title {
    font-size: 20px;
  }
  .omnirange {
    width: 80%;
    line-height: 100px;
    padding-left: 20px;
    background-color: #f9f9f9;
    position: relative;
    img {
      position: absolute;
      right: 10%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .omnirange:hover {
    background-color: #f1f5ff;
    cursor: pointer;
  }
  .active {
    background-color: #f1f5ff;
  }
}
</style>
