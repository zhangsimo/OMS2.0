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
      <section class="con-box">
        <div class="inner-box">
          <div class="box mb10">
            <vxe-table
              class="boxData"
              auto-resize
              resizable
              border
              highlight-hover-row
              highlight-current-row
              @current-change="currentChangeEvent"
              max-height="400"
              :data="tableData"
              align="center"
              show-footer
              :footer-method="footerMethod"
            >
              <vxe-table-column title="基本信息">
                <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
                <vxe-table-column field="serviceId" title="其他付款申请单号"></vxe-table-column>
                <vxe-table-column field="guestName" title="往来单位"></vxe-table-column>
                <vxe-table-column field="" title="业务类型"></vxe-table-column>
                <vxe-table-column field="" title="付款时间"></vxe-table-column>
              </vxe-table-column>
              <vxe-table-column title="金额信息">
                <vxe-table-column field="payAmt" title="其他付款申请金额"></vxe-table-column>
                <vxe-table-column field="" title="其他付款认领单号"></vxe-table-column>
                <vxe-table-column field="" title="其他付款认领金额"></vxe-table-column>
                <vxe-table-column field="" title="其他付款核销单号"></vxe-table-column>
                <vxe-table-column field="" title="其他收款核销金额"></vxe-table-column>
                <vxe-table-column field="" title="其他收款收回单号"></vxe-table-column>
                <vxe-table-column field="remainingAmt" title="其他收款余额"></vxe-table-column>
              </vxe-table-column>
              <vxe-table-column title="收款方式">
                <vxe-table-column field="role" title="账户">
                  <template v-slot="{row}">
                    <ul class="list">
                      <li v-for="(item,index) of row.receiveType" :key="index" class="flex">
                        <span class="listChild">{{item.accountName}}</span>
                      </li>
                    </ul>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="sex" title="金额">
                  <template v-slot="{row}">
                    <ul class="list">
                      <li v-for="(item,index) of row.receiveType" :key="index" class="flex">
                        <span class="listChild">{{item.amt}}</span>
                      </li>
                    </ul>
                  </template>
                </vxe-table-column>
              </vxe-table-column>
              <vxe-table-column title="付款方式">
                <vxe-table-column field="age" title="收款所属门店">
                  <template v-slot="{row}">
                    <ul class="list">
                      <li v-for="(item,index) of row.receiveType" :key="index" class="flex">
                        <span class="listChild">{{item.ownStoreName}}</span>
                      </li>
                    </ul>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="role" title="账户">
                  <template v-slot="{row}">
                    <ul class="list">
                      <li v-for="(item,index) of row.paymentType" :key="index" class="flex">
                        <span class="listChild">{{item.accountName}}</span>
                      </li>
                    </ul>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="sex" title="金额">
                  <template v-slot="{row}">
                    <ul class="list">
                      <li v-for="(item,index) of row.paymentType" :key="index" class="flex">
                        <span class="listChild">{{item.amt}}</span>
                      </li>
                    </ul>
                  </template>
                </vxe-table-column>
              </vxe-table-column>
              <vxe-table-column title="其他信息">
                <vxe-table-column field="age" title="付款所属门店">
                  <template v-slot="{row}">
                    <ul class="list">
                      <li v-for="(item,index) of row.paymentType" :key="index" class="flex">
                        <span class="listChild">{{item.ownStoreName}}</span>
                      </li>
                    </ul>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="receiver" title="收款人"></vxe-table-column>
                <vxe-table-column field="receiveDate" title="收款日期"></vxe-table-column>
                <vxe-table-column field="receiveRemark" title="收款备注"></vxe-table-column>
                <vxe-table-column field="receiveAuditor" title="收款审核人"></vxe-table-column>
                <vxe-table-column field="receiveAuditDate" title="收款审核日期"></vxe-table-column>
                <vxe-table-column field="payer" title="付款人"></vxe-table-column>
                <vxe-table-column field="paymentDate" title="付款日期"></vxe-table-column>
                <vxe-table-column field="paymentRemark" title="付款备注"></vxe-table-column>
                <vxe-table-column field="paymentAuditor" title="付款审核人"></vxe-table-column>
                <vxe-table-column field="paymentAuditDate" title="付款审核日期"></vxe-table-column>
              </vxe-table-column>
            </vxe-table>
            <div class="clearfix">
              <Page
                class-name="fr mb10 mt10"
                size="small"
                :current="page.num"
                :total="page.total"
                :page-size="page.size"
                @on-change="changePage"
                @on-page-size-change="changeSize"
                show-sizer
                show-total
              ></Page>
            </div>
          </div>
          <Button>收付款单记录</Button>
          <Record ref="Record" :serviceId="serviceId" />
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
      <!--其他收款核销-->
      <settlement ref="settlement"></settlement>
    </div>
</template>

<script>
  import quickDate from "@/components/getDate/dateget_bill.vue";
  import claim from "./components/claimed";
  import settlement from "./components/settlement";
  import { creat } from "./../components";
  import Record from "../components/Record";
  import { findAdvance, revoke, findGuest } from "_api/settlementManagement/advanceCollection.js";
    export default {
        name: "otherReceivables",
        components: {
          quickDate,
          claim,
          settlement,
          Record
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
            tableData: [], //表格信息
            page: {
              num: 1,
              size: 10,
              total: 0,
              opts: [20, 50, 100, 200]
            }, //分页
            serviceId: "", //给子组件传的值
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
              this.$refs.settlement.Settlement = true;
            //   this.paymentId = "YSK";
            // } else {
            //   this.$message.error("请选择数据");
            // }
          },
          //认领弹框查询
          queryClaimed(){},
          //认领弹框认领
          claimPay(){
            // if (
            //   Math.abs(this.$refs.claim.currentClaimed.paidMoney) <=
            //   this.currRow.remainingAmt
            // ) {
              this.$refs.settlement.Settlement = true;
              // this.paymentId = "YSKZC";
            // } else {
            //   this.$message.error("金额大于预收款余额，无法认领");
            // }
          },
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
          // 选中行
          currentChangeEvent({ row }) {
            // this.currRow = row;
            // this.reconciliationStatement.accountNo = row.serviceId;
            // this.serviceId = row.serviceId;
            // this.$refs.Record.init();
          },
          //分页
          changePage(p) {
            this.page.num = p;
            this.getQuery();
          },
          changeSize(size) {
            this.page.num = 1;
            this.page.size = size;
            this.getQuery();
          },
          //表尾合计
          footerMethod ({ columns, data }) {
            return [
              columns.map((column, columnIndex) => {
                if (columnIndex === 0) {
                  return '合计'
                }
                if (['payAmt', 'writeOffAmt','returnClaimAmt','remainingAmt'].includes(column.property)) {
                  return this.$utils.sum(data, column.property)
                }
                return null
              })
            ]
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

<style>
  .box {
    overflow: auto;
  }
  .boxData {
    width: 2500px;
    /* overflow: auto; */
  }
  .list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .listChild {
    display: inline-block;
    border: 1px solid #e8eaec;
    flex: 1;
    padding: 5px;
  }
  .vxe-table .vxe-cell {
    padding: 0;
  }
  .vxe-table .vxe-body--column:not(.col--ellipsis) {
    padding: 0;
  }
</style>
