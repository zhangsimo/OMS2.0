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
            <Select v-model="BranchstoreId" class="w150" filterable  @on-change="query" :disabled="selectShopList">
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
        <Button v-has="'claim'" class="ml10" @click="claimCollect(1)">其他收款认领</Button>
        <Button
          v-has="'pay'"
          class="ml10"
          @click="applyForOther"
          :disabled="Boolean(currRow.paymentNo)"
        >其他付款申请</Button>
        <Button
          v-has="'payClaim'"
          class="ml10"
          @click="claimCollect(2)"
          :disabled="Boolean(currRow.expenseClaimAmount)"
        >其他付款支出认领</Button>
        <Button
          v-has="'payClaim'"
          class="ml10"
          @click="collectWirte"
          :disabled="Boolean(currRow.paymentBalance<=0)"
        >其他付款核销</Button>
        <Button v-has="'claimrevoke'" class="ml10" @click="revokeCollection(0)">其他收款认领撤回</Button>
        <Button v-has="'payrevoke'" class="ml10" @click="revokeCollection(3)">其他付款申请撤回</Button>
        <Button v-has="'otherPayrevoke'" class="ml10" @click="revokeCollection(1)">其他付款支出认领撤回</Button>
        <Button v-has="'otherClaimRevoke'" class="ml10" @click="revokeCollection(2)">其他付款核销撤回</Button>
        <Button v-has="'export'" class="ml10" @click="exportTable">导出</Button>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <div class="box mb10">
          <vxe-table
            resizable
            auto-resize
            border
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
            <vxe-table-column field="orderTypeName" width="100" title="业务类型" fixed="left"></vxe-table-column>
            <vxe-table-column field="guestName" width="100" title="往来单位"  fixed="left"></vxe-table-column>
            <vxe-table-column title="基本信息">
              <vxe-table-column field="serviceId" width="120" title="其他收款单号"></vxe-table-column>
              <vxe-table-column field="paymentDate" width="100" title="付款时间">
                <!--<ul class="list">-->
                <!--<li v-for="(item,index) of row.otherInfo" :key="index" class="flex">-->
                <!--<span class="listChild">{{item.paymentDate}}</span>-->
                <!--</li>-->
                <!--</ul>-->
              </vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="金额信息">
              <vxe-table-column field="amountCollected" title="其他收款金额" width="120"></vxe-table-column>
              <vxe-table-column field="paymentNo" title="其他付款申请单号" width="140"></vxe-table-column>
              <vxe-table-column field="paymentApplicationAmount" title="其他付款申请金额" width="140"></vxe-table-column>
              <vxe-table-column field="expenseClaimAmount" title="其他付款支出已认领金额" min-width="180"></vxe-table-column>
              <vxe-table-column field="writeOffReceiptNo" title="其他收付款核销单号" width="180"></vxe-table-column>
              <vxe-table-column field="writeOffAmount" title="其他收付款核销金额" width="180"></vxe-table-column>
              <vxe-table-column field="paymentBalance" title="其他付款余额" width="120"></vxe-table-column>
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
                    <li v-for="(item,index) of row.receiveType" :key="index" class="flex">
                      <span class="listChild">{{item.ownStoreName}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="收款方式">
              <vxe-table-column field="role" title="账户" width="60">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.receiveType" :key="index" class="flex">
                      <span class="listChild">{{item.accountName}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="sex" title="金额" width="60">
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
            <vxe-table-column title="其他信息">
              <vxe-table-column field="payer" title="付款人" width="90">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.otherInfo" :key="index" class="flex">
                      <span>{{item.payer}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="paymentDate" title="付款日期" width="100">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.otherInfo" :key="index" class="flex">
                      <span>{{item.paymentDate}}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="receiveRemark" title="付款备注" width="100">
                <template v-slot="{row}">
                  <ul class="list">
                    <li v-for="(item,index) of row.otherInfo" :key="index" class="flex">
                      <span>{{item.receiveRemark}}</span>
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
              <!--<vxe-table-column field="paymentAuditDate" title="付款审核日期"></vxe-table-column>-->
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
        <Record ref="Record" :serviceId="serviceId" :currRow="currRow" @Message="getMessage" />
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
      <Button class="ml10" v-if="claimTit == '其他收款认领'" @click="claimPay">认领</Button>
      <Button class="ml10" v-else @click="claimCollection">支出认领</Button>
      <claim ref="claim" @selection="selection" />
      <!--<claimGuest ref="claimGuest" />-->
      <div slot="footer"></div>
    </Modal>
    <!--点击认领后弹框-->
    <claimGuest ref="claimGuest" />
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
    <!--其他付款申请-->
    <OtherPayment ref="OtherPayment" :list="modelType"></OtherPayment>
    <voucher-input ref="voucherInput" :oneAccountent="claimSelection"  @callBackFun="getCallBack"></voucher-input>
  </div>
</template>

<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import claim from "./components/claimed";
import settlement from "./components/settlement";
import { creat } from "@/view/settlementManagement/components";
// import { creat } from "./../components";
// import Record from "./components/Record";
import Record from "../components/Record";
import claimGuest from "./components/claimGuest";
import OtherPayment from "../../documentApproval/component/OtherPayment";
import { claimedFund } from "_api/settlementManagement/fundsManagement/claimWrite";
import { goshop } from "@/api/settlementManagement/shopList";
import { addClaim } from "_api/settlementManagement/otherPayable/otherPayable";
import {otherPayableExport /**导出*/} from "@/api/settlementManagement/Import"
import {showLoading, hideLoading} from "@/utils/loading"
import {
  findAdvance,
  revoke,
  findGuest
} from "_api/settlementManagement/advanceCollection";
import {
  findByDynamicQuery,
  paymentRevoke
} from "_api/settlementManagement/otherPayable/otherPayable";
import {
  getComenAndGo,
  getAllSalesList,
  getPayList
} from "../../documentApproval/component/utils";

import moment from "moment";
import VoucherInput from "../fundsManagement/claimWrite/components/components/voucherInput";
export default {
  name: "settlementManagementOtherPayable",
  components: {
    VoucherInput,
    quickDate,
    claim,
    settlement,
    Record,
    claimGuest,
    OtherPayment
  },
  data() {
    return {
      remoteloading: false,
      modelType: {
        type: 5, //新增
        id: "",
        rowMessage: {} //当前行数据
      },
      value: [], //查询日期数组
      BranchstoreId: "", //分店名称
      Branchstore: [{ id: 0, name: "全部" }], //分店名称
      company: [], //往来单位数组
      companyId: "", //往来单位
      currRow: {}, //选中行
      claimModal: false, //认领弹框
      revoke: false, //撤回弹框
      claimTit: "", //认领弹框标题
      revokeTit: "", //撤回弹框标题
      amt: null, //认领弹框金额
      bankNameO: null, //认领弹框对方户名
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
      claimSelection: [],
      MessageValue: {}, //子组件传的数据审核状态
      MessageValueNumber: "", //其他付款支出认领单号
      Types: "" //给子组件的判定来调取的接口是哪个
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
    getOne(query) {
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
    // // 往来单位选择
    // async getOne() {
    //   findGuest({ size: 2000 }).then(res => {
    //     if (res.code === 0) {
    //       res.data.content.map(item => {
    //         this.company.push({
    //           value: item.id,
    //           label: item.fullName
    //         });
    //       });
    //     }
    //   });
    // },
    //获取门店
    async getShop(){
      let data ={}
      let res = await goshop(data)
      if (res.code === 0) return this.Branchstore = [...this.Branchstore , ...res.data]
    },
    // 快速查询
    quickDate(data) {
      this.value = data;
      this.getQuery();
    },
    //查询
    query() {
      this.getQuery();
    },
    //日期组件改变时值
    changeDate(val) {
      // console.log(val)
      this.value = val;
      this.query()
    },
    //初始化
    getQuery() {
      let obj = {
        startTime: this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD") + " 00:00:00"
          : "",
        endTime: this.value[1]
          ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
          : "",
        orgid: this.BranchstoreId==0?"":this.BranchstoreId,
        guestId: this.companyId
      };
      let params = {
        page: this.page.num - 1,
        size: this.page.size
      }
      showLoading(".loadingClass", "数据加载中，请勿操作")
      findByDynamicQuery(params,obj).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.content;
          // console.log(res.data.content)
          this.page.total = res.data.totalElements;
        }
        hideLoading()
      }).catch(e => {
        hideLoading()
      });
      this.serviceId = "";
      this.$refs.Record.init();
      this.currRow = {};
    },
    exportTable(){
      if(this.tableData.length<1){
        return this.$Message.error("暂无数据导出")
      }else{
        let obj = {
          startTime: this.value[0]
            ? moment(this.value[0]).format("YYYY-MM-DD") + " 00:00:00"
            : "",
          endTime: this.value[1]
            ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
            : "",
          orgid: this.BranchstoreId==0?"":this.BranchstoreId,
          guestId: this.companyId,
          pagesize: this.page.total,
        };
        let params="";
        for(var i in obj){
          params+=`${i}=${obj[i]}&`
        }
        location.href=otherPayableExport(params)
      }
    },
    //其他收款认领/其他付款支出认领
    claimCollect(type) {
      if (type === 1) {
        this.claimModal = true;
        this.claimTit = "其他收款认领";
        this.claimedList(1);
      } else {
        if (Object.keys(this.currRow).length !== 0) {
          this.claimModal = true;
          this.claimTit = "其他付款支出认领";
          this.claimedList(2);
        } else {
          this.$message.error("请选择数据！");
        }
      }
    },
    //其他付款支出认领
    claimCollection() {
      if (this.claimSelection.length !== 0) {
        if (
          Math.abs(this.$refs.claim.currentClaimed.paidMoney) <=
          this.currRow.paymentBalance
        ) {
          this.$refs.settlement.Settlement = true;
          this.claimModal = false;
          this.paymentId = "QTYSK";
        } else {
          this.$message.error("支出金额大于其他其他付款余额，无法认领");
        }
      } else {
        this.$message.error("请先选择数据");
      }
    },
    //其他收款认领弹窗查询
    claimedList(type) {
      let obj = {
        amount: this.amt,
        page: this.$refs.claim.claimedPage.page - 1,
        size: this.$refs.claim.claimedPage.size,
        amountType: type,
        suppliers: this.companyId,
        claimShopCode:this.$store.state.user.userData.currentCompany.code
      };
      if (this.bankNameO) {
        obj.reciprocalAccountName = this.bankNameO;
      }
      claimedFund(obj).then(res => {
        if (res.code === 0) {
          this.$refs.claim.claimedData = res.data.content;
          this.$refs.claim.claimedPage.total = res.data.totalElements;
        }
      });
    },
    // 其他付款申请
    applyForOther() {
      if (Object.keys(this.currRow).length > 0) {
        this.modelType.id = this.currRow.id;
        this.$refs.OtherPayment.open();
      } else {
        this.$message.error("请选择数据！");
      }
    },
    //子组件的数据
    getMessage(value) {
      // console.log(value[0].fno)
      this.MessageValue = value[0].startStatus.name;
      this.MessageValueNumber = value[0].fno;
    },
    //预收款弹框是否打开
    visChangeClaim(type) {
      if (!type) {
        this.companyId = "";
        this.amt = null;
        this.bankNameOthis = "";
        this.claimSelection = [];
        // this.$refs.settlement.tableData = [];
      }
    },
    //撤回按钮点击事件
    revokeCollection(type) {
      if (Object.keys(this.currRow).length !== 0) {
        switch (type) {
          case 0:
            this.revokeTit = "其他收款认领撤回";
            break;
          case 1:
            this.revokeTit = "其他付款支出认领撤回";
            break;
          case 2:
            this.revokeTit = "其他付款核销撤回";
            break;
          case 3:
            this.revokeTit = "其他付款申请撤回";
            break;
        }
        // this.revoke = true;
        if (type == 0) {
          if (this.currRow.paymentNo) {
            this.$Message.error("其他收款单号已支出，无法撤回！");
          } else {
            if (this.currRow.writeOffReceiptNo) {
              this.$Message.error("其他收付款单号已核销，无法撤回！");
            } else {
              if (this.currRow.serviceId && this.MessageValue == "已审核") {
                this.$Message.error("其他付款认领单号已审核，无法撤销！");
              } else {
                this.revoke = true;
              }
            }
          }
        } else if (type == 1) {
          if (!this.currRow.expenseClaimAmount) {
            this.$Message.error("其他付款支出未认领，无法撤回！");
          } else {
            if (
              this.MessageValueNumber != null &&
              this.MessageValue == "已审核"
            ) {
              this.$Message.error("其他付款单号已审核，无法撤回！");
            } else {
              this.revoke = true;
            }
          }
        } else if (type == 2) {
          if (!this.currRow.writeOffReceiptNo) {
            this.$Message.error("其他收款单号未核销，无法撤回！");
          } else {
            if (
              this.currRow.writeOffReceiptNo &&
              this.MessageValue == "已审核"
            ) {
              this.$Message.error("其他收付款核销单号已审核，无法撤回！");
            } else {
              this.revoke = true;
            }
          }
        } else {
          if (!this.currRow.paymentNo) {
            this.$Message.error("其他付款申请单号不存在，无法撤回！");
          } else {
            if (this.currRow.expenseClaimAmount) {
              this.$Message.error("其他付款申请金额已认领，无法撤回！");
            } else {
              this.revoke = true;
            }
          }
        }
      } else {
        this.$message.error("请选择数据");
      }
    },
    //其他收款核销
    collectWirte() {
      if (Object.keys(this.currRow).length !== 0) {
        this.$refs.settlement.Settlement = true;
        this.paymentId = "QTYSK";
        this.Types = "其他付款核销";
      } else {
        this.$message.error("请选择数据");
      }
    },
    //认领弹框查询
    queryClaimed() {
      if (this.claimTit === "其他收款认领") {
        this.claimedList(1);
      } else {
        this.claimedList(2);
      }
    },
    //认领弹框认领
    claimPay() {
      if (this.claimSelection.length !== 0) {
        // this.$refs.claimGuest.modal = true;
        this.$refs.voucherInput.subjectModelShowassist = true;
        this.$refs.voucherInput.Classification = true;
      } else {
        this.$message.error("请先选择数据");
      }
    },
    getCallBack(){
      if(this.$refs.voucherInput.AssistAccounting){
        let objItem = this.$refs.voucherInput.voucherItem;
        let data = {};
        data.guestId = objItem.id||"";
        data.financeAccountCashList = this.claimSelection;
        data.claimType = 0;
        data.paymentTypeCode = this.$refs.voucherInput.formDynamic.fund;
        addClaim(data).then(res=>{
          if(res.code===0){
            this.$Message.success('认领成功');
            this.claimModal = false;
            this.getQuery();
          }
        })
      } else {
        this.$Message.error('请选择一个往来单位');
      }
    },
    //认领弹框传参数据
    selection(arr) {
      // console.log(arr);
      this.claimSelection = [];
      this.claimSelection.push({ id: arr.id ,mateAccountCoding:arr.mateAccountCoding});
    },
    //撤回弹框是否打开
    visChange(type) {
      if (!type) {
        this.guestId = "";
        this.company = "";
        // this.$refs.table.clearCurrentRow()
      }
    },
    //撤销弹框确定按钮
    revokeDetaim() {
      if (!this.reason) return this.$message.error("撤销原因必填");
      let type = "";
      if (this.revokeTit == "其他收款认领撤回") {
        type = 1;
      } else if (this.revokeTit == "其他付款申请撤回") {
        type = 2;
      } else if (this.revokeTit == "其他付款支出认领撤回") {
        type = 3;
      } else {
        type = 4;
      }
      let obj = {
        id: this.currRow.id,
        revokeReason: this.reason,
        sign: type
      };
      paymentRevoke(obj).then(res => {
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
    // 选中行
    currentChangeEvent({ row }) {
      // console.log(row)
      this.currRow = row;
      this.modelType.rowMessage = row;
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
              "amountCollected",
              "paymentApplicationAmount",
              "expenseClaimAmount",
              "writeOffAmount",
              "paymentBalance"
            ].includes(column.property)
          ) {
            return this.$utils.sum(data, column.property);
          }
          return null;
        })
      ];
    },
    //预收款认领完成刷新页面
    getNewQuery() {
      // this.getQuery();
    }
  },
  async mounted() {
    let arr = await creat(this.$refs.quickDate.val, this.$store);
    this.value = arr[0];
    this.$nextTick( () => {
      this.BranchstoreId = arr[1]
      this.getQuery();
    })
    this.getShop()
    // this.getOne();
    this.modelType.allSalesList = await getAllSalesList();
    this.modelType.salesList = await getComenAndGo();
    this.modelType.payList = await getPayList();
  }
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
