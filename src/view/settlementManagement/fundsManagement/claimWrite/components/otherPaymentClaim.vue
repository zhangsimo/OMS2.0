<template>
  <div>
    <Modal v-model="modal" :title="claimTit" width="1000">
      <Row class="dbd" v-if="claimTit=='预付款认领'">
        <i-col span="14">
          <Checkbox
            v-model="voucherinputModel"
            :checked.sync="voucherinputModel"
            @change="changeModel"
          >是否不生成预付款单号
          </Checkbox>
        </i-col>
        <i-col span="10" v-show="voucherinputModel">
          <Form :model="formValidate" ref="form" :rules="ruleValidate">
            <FormItem label="选择辅助核算" prop="voucherInput">
              <Row>
                <i-col span="8">
                  <i-input :value.sync="formValidate.voucherInput" v-model="MessageValue"></i-input>
                </i-col>
                <i-col span="2" class="ml10">
                  <Button type="default" @click="openVoucherInput">辅助核算</Button>
                </i-col>
              </Row>
            </FormItem>
          </Form>
        </i-col>
      </Row>
      <Row class="dbd" v-else>
        <i-col span="14">
          <div v-show="!voucherinputModel" style="text-indent:-9999px;overflow: hidden">1</div>
          <Form :model="formValidate" :rules="ruleValidate" v-show="voucherinputModel">
            <FormItem label="选择辅助核算">
              <Row>
                <i-col span="8">
                  <i-input :value.sync="formValidate.voucherInput" v-model="MessageValue"></i-input>
                </i-col>
                <i-col span="2" style="paddingLeft:20px">
                  <Button type="default" @click="openVoucherInput">辅助核算</Button>
                </i-col>
              </Row>
            </FormItem>
          </Form>
          <!-- @change="changeModel" -->
        </i-col>
        <i-col span="10" class="tr">
          <Checkbox v-model="voucherinputModel" :checked.sync="voucherinputModel">是否不生成其他付款认领单号</Checkbox>
        </i-col>
      </Row>
      <vxe-table
        border
        align="center"
        ref="xTable"
        :edit-rules="validRules"
        highlight-hover-row
        highlight-current-row
        auto-resize
        @current-change="currentChangeEvent"
        :edit-config="{trigger: 'click', mode: 'cell'}"
        size="mini"
        show-overflow="title"
        :data="accrued"
      >
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="area" width="100" title="所属区域"></vxe-table-column>
        <vxe-table-column field="shopName" width="140" title="所属门店"></vxe-table-column>
        <vxe-table-column field="shopCode" width="80" title="所属店号"></vxe-table-column>
        <vxe-table-column field="accountName" width="100" title="账户"></vxe-table-column>
        <vxe-table-column field="accountCode" width="120" title="账号"></vxe-table-column>
        <vxe-table-column field="bankName" width="120" title="开户行"></vxe-table-column>
        <vxe-table-column field="mateAccountName" width="100" title="对应科目"></vxe-table-column>
        <vxe-table-column field="createTime" width="140" title="发生日期"></vxe-table-column>
        <vxe-table-column field="incomeMoney" width="80" title="收入金额"></vxe-table-column>
        <vxe-table-column title="支出金额" width="80">
          <template v-slot="{row}">
            <div>{{Math.abs(row.paidMoney)}}</div>
          </template>
        </vxe-table-column>
        <vxe-table-column field="unClaimedAmt" width="80" title="未认领金额"></vxe-table-column>
        <vxe-table-column
          field="rpAmt"
          :edit-render="{name: 'input', props: {type: 'float', digits: 2},immediate:true}"
          title="本次认领金额"
          width="120"
          align="center"
        ></vxe-table-column>
        <vxe-table-column field="reciprocalAccountName" width="120" title="对方户名"></vxe-table-column>
        <vxe-table-column
          field="tradingNote"
          :edit-render="{name: 'input',immediate:true, attrs: {type: 'text'}}"
          title="交易备注"
          width="160"
          align="center"
        ></vxe-table-column>
      </vxe-table>
      <div v-if="!voucherinputModel">
        <Row class="mb20 mt20">
          <Col span="8">
            <quickDate class="mr10" ref="quickDate" @quickDate="quickDate"></quickDate>
            <Input class="mr10 w200" v-model="shopName" disabled/>
          </Col>
          <Col span="16">
            <Date-picker v-model="value" type="daterange" placeholder="选择日期11" class="w200"></Date-picker>
            <button class="ivu-btn ivu-btn-default ml10" type="button" @click="getQuery">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </Col>
        </Row>
        <Row>
          <vxe-table
            auto-resize
            border
            highlight-hover-row
            highlight-current-row
            :data="tableData"
            @current-change="selected"
            align="center"
            show-overflow="title"
            size="mini"
            ref="xTable1"
          >
            <!-- <vxe-table-column type="checkbox" width="60"></vxe-table-column> -->
            <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
            <vxe-table-column field="serviceId" title="其他应付款申请单号" v-if="claimTit=='其他付款认领'"></vxe-table-column>
            <vxe-table-column field="serviceId" title="预付款申请单号" v-else></vxe-table-column>
            <vxe-table-column field="orderNo" title="预付款采购单号" v-if="claimTit=='预付款认领'"></vxe-table-column>
            <vxe-table-column field="guestName" title="往来单位"></vxe-table-column>
            <vxe-table-column field="applicant" title="申请人"></vxe-table-column>
            <vxe-table-column field="applyAmt" title="其他付款金额" v-if="claimTit=='其他付款认领'"></vxe-table-column>
            <vxe-table-column field="payAmt" title="预付款金额" v-else></vxe-table-column>
            <vxe-table-column field="businessType.name" title="业务类别" v-if="claimTit=='其他付款认领'"></vxe-table-column>
            <vxe-table-column field="payTime" title="付款时间" v-if="claimTit=='其他付款认领'"></vxe-table-column>
            <vxe-table-column field="receiveRemark" title="付款备注"></vxe-table-column>
          </vxe-table>
          <Page
            class-name="mb10 mt10 fr"
            :current="page.num"
            :total="page.total"
            :page-size="page.size"
            :page-size-opts="page.opts"
            @on-change="changePage"
            @on-page-size-change="changeSize"
            show-elevator
            show-sizer
            show-total
          ></Page>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="openClimed()" class="mr10">确定</Button>
        <Button type="default" @click="modal = false">取消</Button>
      </div>
    </Modal>
    <!-- 认领弹框 -->
    <Modal v-model="claimModal" :title="claimTit" width="1000" @on-visible-change="visChangeClaim">
      <span>往来单位：</span>
      <Select v-model="companyId" class="w150" filterable>
        <Option v-for="item in company" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <span class="ml10">金额：</span>
      <InputNumber v-model="amt" class="w50"/>
      <span class="ml10">对方户名：</span>
      <Input v-model="bankName" class="w100"/>
      <button class="ivu-btn ivu-btn-default ml10" type="button" @click="queryClaimed">
        <i class="iconfont iconchaxunicon"></i>
        <span>查询</span>
      </button>
      <Button class="ml10" v-if="claimTit == '其他付款认领'" @click="claimPay">认领</Button>
      <Button class="ml10" v-else @click="claimCollection">认领</Button>
      <claim ref="claim" @selection="selection"/>
      <div slot="footer"></div>
    </Modal>
    <!-- 辅助核销计算 -->
    <voucherInput ref="voucherInput" :oneAccountent="accruedList" @callBackFun="getCallBack"></voucherInput>
    <settlement ref="settlement" @reloadParList="reloadParentList"></settlement>
    <settlement2 ref="settlement2" @reloadParList="reloadParentList"></settlement2>
    <claimGuest ref="claimGuest"></claimGuest>
  </div>
</template>
<script>
  import voucherInput from "@/view/settlementManagement/fundsManagement/claimWrite/components/components/voucherInput";

  import quickDate from "@/components/getDate/dateget_bill.vue";
  import {findGuest} from "@/api/settlementManagement/advanceCollection.js";
  import claim from "@/view/settlementManagement/otherReceivables/components/claimed.vue";
  import settlement from "@/view/settlementManagement/advanceCharge/components/settlementadv.vue";
  import settlement2 from "@/view/settlementManagement/otherReceivables/components/settlement";
  import {claimedFund} from "@/api/settlementManagement/fundsManagement/claimWrite.js";
  import {TurnToTheProfitAndLoss} from "@/api/settlementManagement/fundsManagement/claimWrite.js";
  import {goshop} from "@/api/settlementManagement/shopList";
  import {
    findByDynamicQuery
  } from "_api/settlementManagement/otherReceivables/otherReceivables";
  import {findPageByDynamicQueryFirst} from "@/api/settlementManagement/advanceCharge";
  import {creat} from "@/view/settlementManagement/components";
  import moment from "moment";
  import claimGuest from "@/view/settlementManagement/advanceCollection/components/claimGuest";
  import {showLoading, hideLoading} from "@/utils/loading"
  import bus from "@/view/settlementManagement/bill/Popup/Bus";

  export default {
    props: {
      accrued: ""
    },
    components: {
      voucherInput,
      claim,
      settlement,
      settlement2,
      quickDate,
      claimGuest
    },
    data() {
      const amtValid = ({cellValue, row}) => {
        return new Promise((resolve, reject) => {
          if (cellValue) {
            let trueValue =
              Math.abs(row.rpAmt) > Math.abs(row.incomeMoney || row.paidMoney);
            let trueValue2 = Math.abs(row.rpAmt) > Math.abs(this.currentAccountItem.payAmt || this.currentAccountItem.applyAmt);
            if (trueValue || trueValue2) {
              reject(new Error("本次核销金额绝对值不能大于未收/付金额"));
            } else {
              resolve();
            }
          } else {
            reject(new Error("本次认领金额必填"));
          }
        });
      };
      return {
        voucherinputModel: false,
        formValidate: {voucherInput: ""},
        ruleValidate: {
          voucherInput: [{required: true, message: "不能为空", trigger: "blur"}]
        },
        // 表格验证  本次认领金额  是否符合条件
        validRules: {
          rpAmt: [{required: true, validator: amtValid}],
          balanceMoney: [{required: true, validator: amtValid}]
        },
        type: 3,
        modal: false, //模态框展示
        oneSubject: {}, //单选获取到的数据
        company: [], //往来单位数组
        companyId: "", //往来单位
        claimModal: false, //认领弹框
        claimTit: "预付款认领", //认领弹框标题
        amt: null, //认领弹框金额
        bankName: "", //认领弹框对方户名
        tableData: [], //表格信息
        page: {
          num: 1,
          size: 20,
          total: 0,
          opts: [20, 50, 100, 200]
        }, //分页
        serviceId: "", //给子组件传的值,
        MessageValue: "",
        claimSelection: [],
        value: [],
        BranchstoreId: "",
        Branchstore: [{id: 0, name: "全部"}],
        currentAccount: {},
        currentAccountItem: {},
        accruedList: [{mateAccountCoding: ""}],
        shopName: '',
      };
    },
    async mounted() {
      let arr = await creat(this.$refs.quickDate.val, this.$store);
      this.value = arr[0];
      this.$nextTick(() => {
        this.BranchstoreId = arr[1];
      });
      this.getShop();
    },
    methods: {
      reloadParentList() {
        //刷新 列表
        this.$parent.$parent.queryClaimed()
        //清空选中
        this.$parent.$parent.$refs.claim.currentClaimed = []
      },
      // 打开模态框
      open() {
        if (this.company.length == 0) {
          this.getOne();
        }
        this.claimTit == '预付款认领' ? this.accruedList[0].mateAccountCoding = "2203" : this.accruedList[0].mateAccountCoding = "2241"
        this.oneSubject = {};
        this.modal = true;

        if (!this.voucherinputModel) {
          this.$refs.quickDate.resetFun()
        }
        this.MessageValue = ''
        this.$refs.voucherInput.AssistAccounting = ''
        // this.getQuery();
        this.$nextTick(() => {
          this.$refs.xTable.setActiveCell(this.$refs.xTable.getData(0), "rpAmt")
        })
      },
      //付款查询接口
      async getQuery() {
        if (this.claimTit == "其他付款认领") {
          let data = {
            startTime: this.value[0]
              ? moment(this.value[0]).format("YYYY-MM-DD") + " 00:00:00"
              : "",
            endTime: this.value[1]
              ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
              : "",
            orgid: this.BranchstoreId,
            guestId: this.companyId,
            claimAmt: 0
          };
          let obj={
            size: this.page.size,
            page: this.page.num - 1,
          }
          findByDynamicQuery(obj,data).then(res => {
            if (res.code === 0) {
              this.tableData = res.data.content;
              this.page.total = res.data.totalElements;
            }
          });
        } else {
          let obj = {};
          obj = {
            startDate: this.value[0]
              ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
              : "",
            endDate: this.value[1]
              ? moment(this.value[1])
                .endOf("day")
                .format("YYYY-MM-DD HH:mm:ss")
              : ""
          };
          obj = {
            ...obj,
            orgId: this.BranchstoreId,
            guestId: this.companyId,
            size: this.page.size,
            page: this.page.num - 1,
            isClaimed: 0,
            claimAmt: 0
          };
          // for (let key in obj) {
          //   if (!obj[key]) {
          //     Reflect.deleteProperty(obj, key);
          //   }
          // }
          let res = await findPageByDynamicQueryFirst(obj);
          if (res.code == 0) {
            if (res.data.content.length <= 0) {
              this.$message.success("暂无数据");
            }
            this.tableData = res.data.content;
            this.page.total = res.data.totalElements;

          }
        }
        this.serviceId = "";
        //   this.$refs.Record.init();
        this.currRow = {};
      },
      // 选中
      selected({row}) {
        this.currentAccountItem = row;
        this.claimTit == "其他付款认领"
          ? (this.currentAccount.accountNo =
            row.serviceId)
          : (this.currentAccount.accountNo =
            row.serviceId);
      },
      //获取门店
      async getShop() {
        let data = {};
        let res = await goshop(data);
        if (res.code === 0){
          res.data.forEach(v => {
            if(v.id == this.BranchstoreId){
              this.shopName = v.shortName
            }
          })
          return (this.Branchstore = [...this.Branchstore, ...res.data]);
        }
      },
      // 快速查询
      quickDate(data) {
        this.page.num = 1
        this.value = data;
        this.getQuery();
      },
      //判断是否可选择
      checkMethod({row}) {
        return row.isDetailSubject == 0;
      },
      //获取单选框
      getRaido({row}) {
        this.oneSubject = row;
      },
      changePage(page) {
        this.page.num = page;
        this.getQuery();
      },
      changeSize(size) {
        this.page.num = 1;
        this.page.size = size;
        this.getQuery();
      },
      openVoucherInput() {
        if (this.claimTit == '预付款认领') {
          this.$refs.voucherInput.Classification = false;
        } else {
          this.$refs.voucherInput.Classification = true;
        }
        this.$refs.voucherInput.subjectModelShowassist = true;
      },
      async openClimed() {
        const errMap = await this.$refs.xTable.validate().catch(errMap => errMap);
        if (errMap) {
          return
        }
        if (!this.voucherinputModel) {
          if (this.currentAccount.accountNo) {
            if (this.accrued[0].rpAmt == null || this.accrued[0].rpAmt <= 0) {
              this.$Message.error("本次认领金额不可为零或小于零")
              return
            } else if (this.accrued[0].rpAmt > Math.abs(this.accrued[0].paidMoney)) {
              this.$Message.error("本次认领金额不可大于支付金额")
              return
            }
            if (this.claimTit == "预付款认领") {
              this.changeAmt();
              this.$refs.settlement.Settlement = true;
            } else {
              this.changeAmt();
              this.paymentId = "YJDZ";
              this.$refs.settlement2.Settlement = true;
            }
          } else {
            this.$Message.error("请先选择预付款申请单")
          }
        } else {
          //勾选框选中时
          this.getMessage()
          if (this.MessageValue == "") {
            this.$Message.error("请选择辅助核算")
          } else {
            // this.$message.success("其他付款认领成功")
            // this.claimedList(2);
            this.ok();
          }
        }
      },
      //预收款弹框是否打开
      visChangeClaim(type) {
        this.$refs.claim.currentClaimed = {};
        if (!type) {
          this.companyId = "";
          this.amt = null;
          this.claimSelection = [];
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
          guestId: this.companyId
        };
        claimedFund(obj).then(res => {
          if (res.code === 0) {
            this.$refs.claim.claimedData = res.data.content;
            this.$refs.claim.claimedPage.total = res.data.totalElements;
          }
        });
      },
      //认领弹框查询
      queryClaimed() {
        if (this.claimTit === "其他付款认领") {
          this.claimedList(0);
        } else {
          this.claimedList(0);
        }
      },
      //收回认领
      claimCollection() {
        if (Object.keys(this.$refs.claim.currentClaimed).length !== 0) {
          if (
            Math.abs(this.$refs.claim.currentClaimed.incomeMoney) <
            this.oneSubject.paymentBalance
          ) {
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
      getMessage() {
        this.MessageValue = this.$refs.voucherInput.AssistAccounting;
      },
      //认领弹框认领
      claimPay() {
        if (Object.keys(this.$refs.claim.currentClaimed).length !== 0) {
          if (
            Math.abs(this.$refs.claim.currentClaimed.paidMoney) <=
            this.oneSubject.applyAmt
          ) {

            if (this.claimTit == "预付款认领") {
              this.$refs.settlement.Settlement = true;
            } else {
              this.$refs.settlement2.Settlement = true;
              this.paymentId = "YJDZ";
            }
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
        this.claimSelection.push({id: arr.id});
      },
      // 往来单位选择
      async getOne() {
        findGuest({size: 2000}).then(res => {
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
      currentChangeEvent({row}) {
        this.oneSubject = row;
        this.serviceId = row.serviceId;
      },
      //表尾合计
      footerMethod({columns, data}) {
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
      changeModel() {
        this.$refs.voucherInput.modal = !this.$refs.voucherInput.modal;
        if ((this.voucherinputModel = true)) {
          this.openVoucherInput();
        } else {
          this.$refs.voucherInput.modal = false;
        }
      },
      async ok() {
        if (this.voucherinputModel) {
          let ajaxBool=true;
          let data = {};
          data.detailId = this.accrued[0].id;
          // if(this.accrued[0].balanceMoney==undefined){
          //   data.claimMoney=this.accrued[0].rpAmt
          // }else{
          //   data.claimMoney=this.accrued[0].balanceMoney
          // }
          if (this.claimTit == "预付款认领") {
            data.claimMoney = this.accrued[0].rpAmt
            data.subjectCode = "2203";
            data.claimType = 4;
          } else {
            data.claimMoney = this.accrued[0].rpAmt;
            data.subjectCode = "1221";
            data.claimType = 6;
            data.paymentTypeCode = this.$refs.voucherInput.formDynamic.fund
          }
          if (data.claimMoney == null || data.claimMoney <= 0) {
            ajaxBool=false;
            this.$Message.error("本次认领金额不可为零或小于零")
            return
          } else if (data.claimMoney > Math.abs(this.accrued[0].paidMoney)) {
            ajaxBool=false;
            this.$Message.error("本次认领金额不可大于支付金额")
            return
          }
          if(data.claimMoney > this.accrued[0].unClaimedAmt){
            ajaxBool=false;
            this.$Message.error('本次认领金额不可大于未认领金额')
            return
          }
          data.auxiliaryTypeCode = this.$refs.voucherInput.auxiliaryTypeCode == 2?1:this.$refs.voucherInput.auxiliaryTypeCode //辅助核算选中哪一个
          if (data.auxiliaryTypeCode == "1" || data.auxiliaryTypeCode == "2" || data.auxiliaryTypeCode == "3" || data.auxiliaryTypeCode == "4") {
            data.isAuxiliaryAccounting = 0 //是否辅助核算类
          } else {
            data.isAuxiliaryAccounting = 1
          }
          data.auxiliaryName = this.MessageValue //辅助核算名称
          data.auxiliaryCode = this.$refs.voucherInput.auxiliaryCode //辅助核算项目编码

          let objItem = this.$refs.voucherInput.voucherItem;
          if (objItem.hasOwnProperty("id")) {
            data.suppliersBean = {
              guestSourceName: objItem.fullName || "",
              guestSourceId: objItem.id || ""
            }
          }
          if(ajaxBool){
            try {
              showLoading('body',"保存中，请勿操作。。。")
              let res = await TurnToTheProfitAndLoss(data);
              if (res.code === 0) {
                this.reloadParentList()
                this.modal = false;
                this.claimTit == "预付款认领"
                  ? this.$Message.success("预付款认领成功")
                  : this.$Message.success("其他付款认领成功");
                this.formValidate.voucherInput = ""
                hideLoading()
              } else {
                hideLoading()
              }
            } catch (error) {
              hideLoading()
            }
          }
        }
      },
      //选择辅助核算回调
      getCallBack() {
        this.getMessage();
      },
      changeAmt() {
        let thisData = this.accrued.map(item1 => {
          let item = {...item1}
          item.accountBankNo = item.accountName
          item.subjectName = item.mateAccountName
          item.paidMoney = Math.abs(item.rpAmt)
          item.thisClaimedAmt = item.rpAmt
          return item
        })
        bus.$emit("paymentInfo", thisData);
        if (this.claimTit == "预付款认领") {
          this.$refs.settlement.gettlementData.sign = "9"
          this.$refs.settlement.gettlementData.accountNo = this.currentAccountItem.serviceId;
          thisData.map(item => item.paidMoney = Math.abs(item.paidMoney))
          this.$refs.settlement.setData(thisData)
        } else {
          this.$refs.settlement2.setData(thisData)
        }
      }
    }
  };
</script>
<style lang="less" scoped>
  .dbd {
    padding-bottom: 25px;
  }
</style>
