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
              <span>查询日期：</span>
              <Date-picker :value="value" type="daterange" placeholder="选择日期" class="w200"></Date-picker>
            </div>
            <div class="db ml20">
              <span>分店名称：</span>
              <Select v-model="BranchstoreId" class="w150" filterable clearable >
                <Option
                  v-for="item in Branchstore"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </div>
            <div class="db ml20">
              <span>往来单位：</span>
              <Select v-model="companyId" class="w150" filterable clearable >
                <Option v-for="item in company" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="db ml20">
              <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="query">
                <i class="iconfont iconchaxunicon mr5"></i>
                <span>查询</span>
              </button>
            </div>
          </div>
        </div>
        <div class="mt10 mb10">
          <Button class="ml10" @click="claimCollect(1)">其他付款认领</Button>
          <Button class="ml10" @click="collectWirte">其他收款核销</Button>
          <Button class="ml10" @click="claimCollect(2)">其他收款收回</Button>
          <Button class="ml10" @click="revokeCollection(0)">其他付款认领撤回</Button>
          <Button class="ml10" @click="revokeCollection(1)">其他收款核销撤回</Button>
          <Button class="ml10" @click="revokeCollection(2)">其他收款收回撤回</Button>
          <Button class="ml10">导出</Button>
        </div>
      </section>
      <!-- 认领弹框 -->
      <Modal v-model="claimModal" :title="claimTit" width="1000" @on-visible-change="visChangeClaim">
        <span>往来单位：</span>
        <Select v-model="companyId" class="w150" filterable>
          <Option v-for="item in company" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <span class="ml10">金额：</span>
        <InputNumber v-model="amt" class="w50" />
        <span class="ml10">对方户名：</span>
        <Input v-model="bankNameO" class="w100" />
        <button class="ivu-btn ivu-btn-default ml10" type="button" @click="queryClaimed">
          <i class="iconfont iconchaxunicon"></i>
          <span>查询</span>
        </button>
        <Button class="ml10" @click="claimPay">认领</Button>
        <!--<Button class="ml10" v-else @click="claimCollection">预收款认领</Button>-->
        <claim ref="claim" @selection="selection" />
        <!--<claimGuest ref="claimGuest" />-->
        <div slot="footer"></div>
      </Modal>
      <!-- 撤回弹框 -->
      <Modal v-model="revoke" :title="revokeTit" @on-visible-change="visChange">
        <span>撤销原因</span>
        <Input class="w200 ml10" v-model="reason" />
        <div slot="footer">
          <Button type="primary" @click="revokeDetaim">确认</Button>
          <Button @click="revoke=false">取消</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
  import quickDate from "@/components/getDate/dateget_bill.vue";
  import claim from "./components/claimed";
  import settlement from "../bill/components/settlement";
  import { creat } from "./../components";
  import { findAdvance, revoke, findGuest } from "_api/settlementManagement/advanceCollection.js";
    export default {
        name: "otherReceivables",
        components: {
          quickDate,
          claim,
          settlement
        },
        data(){
          return{
            value: [], //查询日期数组
            BranchstoreId: '', //分店名称
            company: [], //往来单位数组
            companyId: "", //往来单位
            Branchstore: [], //分店名称
            currRow: {}, //选中行
            claimModal: false, //认领弹框
            revoke: false, //撤回弹框
            claimTit: '', //认领弹框标题
            revokeTit: '', //撤回弹框标题
            amt: null, //认领弹框金额
            bankNameO: '', //认领弹框对方户名
            reason: '', //撤销原因
          }
        },
        methods :{
          // 快速查询
          quickDate(data) {
            this.value = data;
            // this.getQuery();
          },
          //查询
          query(){},
          //其他付款认领/其他收款收回
          claimCollect(type){
            if (type === 1) {
              this.claimModal = true;
              this.claimTit = "其他付款认领";
              // this.claimedList(1);
            } else {
              this.claimTit = "其他收款收回";
              // if (
              //   Object.keys(this.currRow).length !== 0 &&
              //   this.currRow.expenditureNo &&
              //   !this.currRow.expenditureClaimAmt
              // ) {
                this.claimModal = true;
                // this.claimedList(2);
              // } else {
              //   this.$message.error("请选择有预收款支出单号且未支出认领的数据");
              // }
            }
          },
          //预收款弹框是否打开
          visChangeClaim(type) {
            // if (!type) {
            //   this.companyId = "";
            //   this.amt =null;
            //   this.bankNameOthis = "";
            //   this.claimSelection=[]
            //   this.$refs.settlement.tableData=[]
            // }
          },
          //撤回按钮点击事件
          revokeCollection(type){
            switch (type) {
              case 0:
                this.revokeTit = "其他付款认领撤回";
                break;
              case 1:
                this.revokeTit = "其他收款核销撤回";
                break;
              case 2:
                this.revokeTit = "其他收款收回撤回";
                break;
            }
            this.revoke = true;
          },
          //其他收款核销
          collectWirte() {
            // if (Object.keys(this.currRow).length !== 0) {
            //   this.$refs.settlement.Settlement = true;
            //   this.paymentId = "YSK";
            // } else {
            //   this.$message.error("请选择数据");
            // }
          },
          //认领弹框查询
          queryClaimed(){},
          //认领弹框认领
          claimPay(){},
          //认领弹框传参数据
          selection(arr) {
            this.claimSelection=[]
            this.claimSelection.push({ id: arr.id });
          },
          //撤回弹框是否打开
          visChange(type){
            if(!type){
              // this.guestId = ''
              // this.company = ''
              // this.$refs.table.clearCurrentRow()
            }
          },
          //撤销弹框确定按钮
          revokeDetaim(){},
          // 往来单位选择
          async getOne() {
            findGuest({ size: 2000 }).then(res => {
              if (res.code === 0) {
                res.data.content.map(item => {
                  this.company.push({
                    value: item.id,
                    label: item.fullName
                  });
                });
              }
            });
          },
        },
      async mounted() {
        let arr = await creat(this.$refs.quickDate.val, this.$store);
        this.value = arr[0];
        this.BranchstoreId = arr[1];
        this.Branchstore = arr[2];
        this.getOne();
        // this.getQuery();
      },
    }
</script>

<style scoped>

</style>
