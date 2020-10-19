<template>
  <div class="content-oper content-oper-flex loadingClass">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <quickDate class="mr10" ref="quickDate" @quickDate="quickDate"></quickDate>
          </div>
          <div class="db ml20">
            <span>查询日期：</span>
            <Date-picker
              v-model="value"
              type="daterange"
              placeholder="选择日期"
              class="w200"
              @on-change="changeDate"
            ></Date-picker>
          </div>
          <div class="db ml20">
            <span>分店名称：</span>
            <Select v-model="BranchstoreId" class="w150" filterable clearable @on-change="query" :disabled="selectShopList">
              <Option
                v-for="item in Branchstore"
                :value="item.id"
                :key="item.id"
              >{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db ml20">
            <span>往来单位：</span>
            <Select
              v-model="companyId"
              class="w150"
              clearable
              filterable
              remote
              :loading="remoteloading"
              :remote-method="getOne"
              @on-change="query"
            >
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
        <Button
          v-has="'claim'"
          class="ml10"
          @click="claimCollect(1)"
          :disabled="Boolean(currRow.paymentClaimNo)"
        >其他付款认领</Button>
        <Button
          v-has="'cancel'"
          class="ml10"
          @click="collectWirte"
          :disabled="Boolean(currRow.writeOffReceiptNo)"
        >其他收款核销</Button>
        <Button
          v-has="'back'"
          class="ml10"
          @click="claimCollect(2)"
          :disabled="Boolean(currRow.paymentRegainNo)"
        >其他收款收回</Button>
        <Button v-has="'payBack'" class="ml10" @click="revokeCollection(0)">其他付款认领撤回</Button>
        <Button v-has="'gatheringClaimBack'" class="ml10" @click="revokeCollection(1)">其他收款核销撤回</Button>
        <Button v-has="'gatheringBack'" class="ml10" @click="revokeCollection(2)">其他收款收回撤回</Button>
        <!--<Button class="ml10">导出</Button>-->
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <div class="box mb10">
          <vxe-table
            auto-resize
            resizable
            border
            resizeable
            show-overflow
            highlight-hover-row
            highlight-current-row
            @current-change="currentChangeEvent"
            max-height="400"
            :data="tableData"
            align="center"
            show-footer
            :footer-method="footerMethod"
          >
            <vxe-table-column type="seq" width="60" title="序号" fixed="left"></vxe-table-column>
            <vxe-table-column field="businessType" width="100" title="业务类型" fixed="left">
              <template v-slot="{row}">{{row.businessType.name}}</template>
            </vxe-table-column>
            <vxe-table-column field="guestName" width="100" title="往来单位" fixed="left"></vxe-table-column>
            <vxe-table-column title="基本信息">
              <vxe-table-column field="serviceId" width="140" title="其他付款申请单号"></vxe-table-column>
              <vxe-table-column field="payTime" title="付款时间" width="100"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="金额信息">
              <vxe-table-column field="applyAmt" title="其他付款申请金额" width="140"></vxe-table-column>
              <vxe-table-column field="paymentClaimNo" title="其他付款认领单号" width="140"></vxe-table-column>
              <vxe-table-column field="paymentClaimAmt" title="其他付款认领金额" width="140"></vxe-table-column>
              <vxe-table-column field="writeOffReceiptNo" title="其他收付款核销单号" width="160"></vxe-table-column>
              <vxe-table-column field="writeOffAmount" title="其他收款核销金额" width="140"></vxe-table-column>
              <vxe-table-column field="paymentRegainNo" title="其他收款收回单号" width="140"></vxe-table-column>
              <vxe-table-column field="paymentRegainAmt" title="其他收款收回金额" width="140"></vxe-table-column>
              <vxe-table-column field="paymentBalance" title="其他收款余额" width="120"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="收款方式">
              <vxe-table-column field="account" title="账户" width="60">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.receiveType" :key="index" class="flex">
                      <span class="listChild">{{item.account}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="amt" title="金额" width="60">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.receiveType" :key="index" class="flex">
                      <span class="listChild">{{item.amt}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="age" title="收款所属门店" width="120">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.receiveType" :key="index" class="flex">
                      <span class="listChild">{{item.ownStoreName}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="付款方式">
              <vxe-table-column field="role" title="账户" width="60">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.paymentType" :key="index" class="flex">
                      <span class="listChild">{{item.accountName}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="sex" title="金额" width="60">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.paymentType" :key="index" class="flex">
                      <span class="listChild">{{item.amt}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="age" title="付款所属门店" width="120">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.paymentType" :key="index" class="flex">
                      <span class="listChild">{{item.ownStoreName}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="其他信息">
              <vxe-table-column field="receiver" title="收款人" width="90">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.otherInfo" :key="index" class="flex">
                      <span>{{item.receiver}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="receiveDate" title="收款日期" width="100">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.otherInfo" :key="index" class="flex">
                      <span>{{item.receiveDate}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="receiveRemark" title="收款备注" width="100">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.otherInfo" :key="index" class="flex">
                      <span>{{item.receiveRemark}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="receiveAuditor" title="收款审核人" width="120">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.otherInfo" :key="index" class="flex">
                      <span>{{item.receiveAuditor}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="receiveAuditDate" title="收款审核日期" width="120">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.otherInfo" :key="index" class="flex">
                      <span>{{item.receiveAuditDate}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="payer" title="付款人" width="90">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.otherInfo" :key="index" class="flex">
                      <span>{{item.payer}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="paymentDate" title="付款日期" width="120">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.otherInfo" :key="index" class="flex">
                      <span>{{item.paymentDate}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="paymentRemark" title="付款备注" width="100">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.otherInfo" :key="index" class="flex">
                      <span>{{item.paymentRemark}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="paymentAuditor" title="付款审核人" width="120">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.otherInfo" :key="index" class="flex">
                      <span>{{item.paymentAuditor}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="paymentAuditDate" title="付款审核日期" width="120">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.otherInfo" :key="index" class="flex">
                      <span>{{item.paymentAuditDate}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
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
        <Record ref="Record" :serviceId="serviceId" @Message="getMessage" />
      </div>
    </section>
    <!-- 认领弹框 -->
    <Modal v-model="claimModal" :title="claimTit" width="1000" @on-visible-change="visChangeClaim">
      <span>往来单位：</span>
      <Select
              v-model="companyId"
              class="w150"
              clearable
              filterable
              remote
              :loading="remoteloading"
              :remote-method="getOne"
              @on-change="query"
            >
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
      <Button class="ml10" v-if="claimTit == '其他付款认领'" @click="claimPay">认领</Button>
      <Button class="ml10" v-else @click="claimCollection">认领</Button>
      <div v-if="otherPayCus" style="display: inline-block;" class="ml20">
        <span><i style="color: red" class="mr5">*</i>款项分类：</span>
        <Select v-model="fund" class="w150" placeholder="请选择">
          <Option
            v-for="item in fundList"
            :value="item.itemName"
            :key="item.id"
          >{{ item.itemName }}</Option>
        </Select>
      </div>

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
import settlement from "@/view/settlementManagement/otherReceivables/components/settlement";
// import settlement from "./components/settlement";
import { creat } from "./../components";
import Record from "./components/Record";
// import Record from "../components/Record";
import {

  findAdvance,
  revoke,
  findGuest
} from "_api/settlementManagement/advanceCollection.js";
import { goshop } from "@/api/settlementManagement/shopList";
import { claimedFund } from "_api/settlementManagement/fundsManagement/claimWrite.js";
// import claimGuest from "./components/claimGuest";
import {
  findByDynamicQuery,
  withdraw
} from "_api/settlementManagement/otherReceivables/otherReceivables";
// otherReceivables
import moment from "moment";
import {showLoading, hideLoading} from "@/utils/loading"
import {
  kmType
} from "@/api/settlementManagement/VoucherInput"
export default {
  name: "settlementManagementOtherReceivables",
  components: {
    quickDate,
    claim,
    settlement,
    Record
    // claimGuest
  },
  data() {
    return {
      remoteloading: false,
      value: [], //查询日期数组
      BranchstoreId: "", //分店名称
      company: [], //往来单位数组
      companyId: "", //往来单位
      Branchstore: [
        {id:0 ,name:'全部'}
      ], //分店名称
      currRow: {}, //选中行
      claimModal: false, //认领弹框
      revoke: false, //撤回弹框
      claimTit: "", //认领弹框标题
      revokeTit: "", //撤回弹框标题
      amt: null, //认领弹框金额
      bankNameO: "", //认领弹框对方户名
      reason: "", //撤销原因
      tableData: [], //表格信息
      page: {
        num: 1,
        size: 10,
        total: 0,
        opts: [20, 50, 100, 200]
      }, //分页
      serviceId: "", //给子组件传的值
      reconciliationStatement: {},
      MessageValue: "", //收款记录单的数据
      claimSelection: [],
      typeA: "", //是否收回按钮
      Types: "", //是否点击其他收款核销按钮
      fundList:[],//款项分类
      fund:'',
      otherPayCus:false
    };
  },
  computed:{
    selectShopList(){
      if(this.$store.state.user.userData.currentCompany!=null){
        return this.$store.state.user.userData.currentCompany.isMaster ? true : false
      }else{
        return true
      }
    }
  },
  methods: {
    //获取门店
    async getShop(){
      let data ={}
      let res = await goshop(data)
      if (res.code === 0) return this.Branchstore = [...this.Branchstore , ...res.data]
    },
    // 快速查询
    quickDate(data) {
      this.value = data;
      this.query();
    },
    //查询
    query() {
      this.getQuery();
    },
    //其他付款认领/其他收款收回
    claimCollect(type) {
      if (Object.keys(this.currRow).length !== 0) {
        if (type === 1) {
          this.claimModal = true;
          this.otherPayCus = true;
          this.claimTit = "其他付款认领";
          this.claimedList(2);
        } else {
          if (
            this.currRow.paymentBalance == 0 ||
            !this.currRow.paymentBalance
          ) {
            this.$Message.error("其他收款余额为0无法收回!");
          } else {
            this.claimTit = "其他收款收回";
            this.claimModal = true;
            this.claimedList(1);
          }
        }
      } else {
        this.$message.error("请选择数据！");
      }
    },
    //预收款弹框是否打开
    visChangeClaim(type) {
      this.$refs.claim.currentClaimed = {};
      this.reason = "";
      if (!type) {
        this.companyId = "";
        this.amt = null;
        // this.bankNameOthis = "";
        this.claimSelection = [];
        this.$refs.settlement.tableData = [];
      }
    },
    //其他付款认领弹窗查询
    claimedList(type) {
      let obj = {
        amount: this.amt,
        reciprocalAccountName: this.bankNameO,
        page: this.$refs.claim.claimedPage.page - 1,
        size: this.$refs.claim.claimedPage.size,
        amountType: type,
        guestId: this.companyId,
        claimShopCode:this.$store.state.user.userData.currentCompany.code
      };
      claimedFund(obj).then(res => {
        if (res.code === 0) {
          this.$refs.claim.claimedData = res.data.content;
          this.$refs.claim.claimedPage.total = res.data.totalElements;
        }
      });
    },
    //撤回按钮点击事件
    revokeCollection(type) {
      if (Object.keys(this.currRow).length !== 0) {
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
        // this.revoke = true;
        if (type == 0) {
          if (this.currRow.writeOffReceiptNo) {
            this.$Message.error("其他付款申请单已核销，无法撤回！");
          } else {
            if (this.currRow.paymentRegainNo) {
              this.$Message.error("其他付款已收回，无法撤回！");
            } else {
              if (
                this.currRow.paymentClaimNo &&
                this.MessageValue == "已审核"
              ) {
                this.$Message.error("其他付款认领单号已审核，无法撤销！");
              } else {
                this.revoke = true;
              }
            }
          }
        } else if (type == 1) {
          if (!this.currRow.paymentClaimNo) {
            this.$Message.error("其他付款申请未认领，无法撤回！");
          } else {
            if (!this.currRow.writeOffReceiptNo) {
              this.$Message.error("其他付款申请未核销，无法撤回！");
            } else {
              if (
                this.currRow.writeOffReceiptNo &&
                this.MessageValue == "已审核"
              ) {
                this.$Message.error("其他付款核销单号已审核，无法撤销！");
              } else {
                this.revoke = true;
              }
            }
          }
        } else {
          if (!this.currRow.paymentClaimNo) {
            this.$Message.error("其他付款申请未认领，无法撤回！");
          } else {
            if (!this.currRow.paymentRegainNo) {
              this.$Message.error("不存在其他收款收回单号，无法撤回！");
            } else {
              if (
                this.currRow.paymentRegainNo &&
                this.MessageValue == "已审核"
              ) {
                this.$Message.error("其他收款收回单号已审核，无法撤销！");
              } else {
                this.revoke = true;
              }
            }
          }
        }
      } else {
        this.$message.error("请选择数据");
      }
    },
    //日期组件改变时值
    changeDate(val) {
      // console.log(val)
      this.value = val;
      this.getQuery()
    },
    //收回认领
    claimCollection() {
      if (Object.keys(this.$refs.claim.currentClaimed).length !== 0) {
        // console.log(this.$refs.claim.currentClaimed.incomeMoney  + "    " + this.currRow.paymentBalance)
        if (
          Math.abs(this.$refs.claim.currentClaimed.incomeMoney) <
          this.currRow.paymentBalance
        ) {
          this.$refs.settlement.Settlement = true;
          this.paymentId = "YSK";
          this.typeA = "收回";
        } else {
          this.$message.error("收入金额大于其他其他收款余额，无法认领");
        }
      } else {
        this.$message.error("请选择认领的数据");
      }
    },
    //子组件的数据
    getMessage(value) {
      // console.log(value[0].startStatus.name)
      this.MessageValue = value[0].startStatus.name;
    },
    //其他收款核销
    collectWirte() {
      if (Object.keys(this.currRow).length !== 0) {
        if (this.currRow.paymentBalance == 0 || !this.currRow.paymentBalance) {
          this.$Message.error("其余收款余额为0无法再核销!");
        } else {
          this.$refs.settlement.Settlement = true;
          this.paymentId = "QTYSK";
          this.Types = "其他收款核销";
        }
      } else {
        this.$message.error("请选择数据");
      }
    },
    //认领弹框查询
    queryClaimed() {
      if (this.claimTit === "其他付款认领") {
        this.claimedList(2);
      }else if(this.claimTit === "其他收款收回"){
        this.claimedList(1);
      } else {
        this.claimedList(2);
      }
    },

    //初始化
    getQuery() {
      let obj = {
        startDate: this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD") + " 00:00:00"
          : "",
        endDate: this.value[1]
          ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
          : "",
        orgid: this.BranchstoreId,
        guestId: this.companyId,
      };
      for (let key in obj) {
        if (!obj[key]) {
          Reflect.deleteProperty(obj, key);
        }
      }
      obj.page = this.page.num - 1 
      obj.size = this.page.size
      showLoading(".loadingClass", "数据加载中，请勿操作")
      findByDynamicQuery(obj).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.content;
          this.page.total = res.data.totalElements;
        }
        hideLoading()
      }).catch(e => {
        hideLoading()
      });
      this.serviceId = "";
      // this.$refs.Record.init();
      this.currRow = {};
    },
    //认领弹框认领
    claimPay() {
      if (Object.keys(this.$refs.claim.currentClaimed).length !== 0) {
        if (
          Math.abs(this.$refs.claim.currentClaimed.paidMoney) <=
          this.currRow.applyAmt
        ) {
          if(this.otherPayCus){
            if(!this.fund){
              return this.$message.error("款项分类必填");
            }
          }
          this.$refs.settlement.Settlement = true;
          this.paymentId = "YJDZ";
        } else {
          this.$message.error("金额大于其他付款申请金额，无法认领");
        }
      } else {
        this.$message.error("请选择认领的数据");
      }
    },
    //认领弹框传参数据
    selection(arr) {
      this.claimSelection = [];
      this.claimSelection.push({ id: arr.id });
    },
    //撤回弹框是否打开
    visChange(type) {
      if (!type) {
        // this.guestId = ''
        // this.company = ''
        // this.$refs.table.clearCurrentRow()
      }
    },
    //撤销弹框确定按钮
    revokeDetaim() {
      if (!this.reason) return this.$message.error("撤销原因必填");
      let type = "";
      if (this.revokeTit == "其他付款认领撤回") {
        type = 1;
      } else if (this.revokeTit == "其他收款核销撤回") {
        type = 2;
      } else {
        type = 3;
      }
      let obj = {
        id: this.currRow.id,
        revokeReason: this.reason,
        type: type
      };
      withdraw(obj).then(res => {
        if (res.code === 0) {
          this.$message.success("撤回成功");
          this.revoke = false;
          this.reason = "";
          this.getQuery();
        } else {
          this.reason = "";
          this.revoke = false;
        }
      });
    },
    // 往来单位选择
    async getOne(query) {
      this.company = [];
      if (query != "") {
        this.remoteloading = true;
        findGuest({ fullName: query, size: 20 }).then(res => {
          if (res.code === 0) {
            this.company = [];
            res.data.content.map(item => {
              this.company.push({
                value: item.id,
                label: item.fullName
              });
            });
            this.remoteloading = false;
          }
        });
      } else {
        this.company = [];
      }
    },
    // 选中行
    currentChangeEvent({ row }) {
      this.currRow = row;
      this.reconciliationStatement.accountNo = row.serviceId;
      this.serviceId = row.serviceId;
      this.$refs.Record.init();
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
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "合计";
          }
          if (
            [
              "applyAmt",
              "writeOffAmount",
              "paymentRegainAmt",
              "paymentBalance"
            ].includes(column.property)
          ) {
            return this.$utils.sum(data, column.property);
          }
          return null;
        })
      ];
    },
    //其他辅助核算款项分类
    fundGetList() {
      let params = {};
      params.dictCode = "CW00131";
      kmType(params).then(res => {
        this.fundList = res.data;
      });
    },
  },
  async mounted() {
    let arr = await creat(this.$refs.quickDate.val, this.$store);
    this.value = arr[0];
    this.$nextTick( () => {
      this.BranchstoreId = arr[1]
    })
    this.getShop()
    // this.getOne();
    this.getQuery();
    this.fundGetList();
    this.otherPayCus = false;
  },

};
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
