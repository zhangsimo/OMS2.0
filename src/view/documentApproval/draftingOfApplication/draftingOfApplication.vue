<template>
    <div class="bigbox" >
      <h5 class="title">行政流程</h5>
      <Row class="mt20">
        <Col span="6">
          <div class="omnirange" @click="open(0)">
            <span>费用报销申请</span>
            <img src="@/assets/images/documentApproval/expenseReimbursement.png" alt="">
          </div>
        </Col>
        <Col span="6">
          <div class="omnirange" @click="open(1)">
            <span>应公借支申请</span>
            <img src="@/assets/images/documentApproval/atStateExpense.png" alt="">
          </div>
        </Col>
        <Col span="6">
          <div class="omnirange" @click="open(2)">
            <span>请示单申请</span>
            <img src="@/assets/images/documentApproval/checkWithSingle.png" alt="">
          </div>
        </Col>
      </Row>
      <h5 class="title mt30">财务流程</h5>
      <Row class="mt20">
        <Col span="6">
          <div class="omnirange" @click="open(3)">
            <span>内部资金调拨申请</span>
            <img src="@/assets/images/documentApproval/interior.png" alt="">
          </div>
        </Col>
        <Col span="6">
          <div class="omnirange" @click="open(4)">
            <span>其他付款申请</span>
            <img src="@/assets/images/documentApproval/Other.png" alt="">
          </div>
        </Col>
        <Col span="6">
          <div class="omnirange" @click="open(5)">
            <span>预收款支出申请</span>
            <img src="@/assets/images/documentApproval/forwardSale.png" alt="">
          </div>
        </Col>
      </Row>
      <h5 class="title mt30">业务流程</h5>
      <Row class="mt20">
        <Col span="6">
          <div class="omnirange" @click="open(6)">
            <span>对账单申请</span>
            <img src="@/assets/images/documentApproval/reconciliation.png" alt="">
          </div>
        </Col>
        <Col span="6">
          <div class="omnirange" @click="open(7)">
            <span>预付款申请</span>
            <img src="@/assets/images/documentApproval/advancePayment.png" alt="">
          </div>
        </Col>
      </Row>

<!--      对应各个模态框-->
<!--      给用报销-->
      <ExpenseReimbursement ref="ExpenseReimbursement" :list="id"></ExpenseReimbursement>
    </div>
</template>

<script>
  import ExpenseReimbursement from '../component/ExpenseReimbursement'
    export default {
        name: "draftingOfApplication",
      components:{
        ExpenseReimbursement
      },
      data(){
          return {
            id:{
              name:'zs'
            }
          }
      },
      methods:{
          open(index){
            let arr = document.getElementsByClassName('omnirange')
                arr.forEach( item => {
                  if (item.classList.contains('active')){
                    item.classList.remove('active')
                  }
                })
            arr[index].classList.add('active')
            switch (index) {
              case 0:
                this.$refs.ExpenseReimbursement.open()
                break;
              case 1:
                console.log(index)
                break
              case 2:
                console.log(index)
                break
              case 3:
                console.log(index)
                break
              case 4:
                console.log(index)
                break
              case 5:
                console.log(index)
                break
              case 6:
                console.log(index)
                break
              case 7:
                console.log(index)
                break
            }

          }
      }
    }
</script>

<style scoped lang="less">
.bigbox {
  height: 100%;
  background-color: #fff;
  padding: 20px;
  .title{
    font-size: 20px;
  }
  .omnirange{
    width: 80%;
    line-height: 100px;
    padding-left: 20px;
    background-color: #f9f9f9
  ;
    position: relative;
    img {
      position: absolute;
      right: 10%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .omnirange:hover{
    background-color: #f1f5ff;
    cursor:pointer
  ;
  }
  .active {
    background-color: #f1f5ff;
  }
}
</style>
