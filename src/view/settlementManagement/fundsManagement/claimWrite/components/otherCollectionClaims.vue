<template>
  <div>
    <Modal v-model="modal" :title="claimTit" width="1000">
      <Row class="dbd" v-if="claimTit=='预收款认领'">
        <i-col span="15">
          <Checkbox v-model="voucherinputModel" :checked.sync="voucherinputModel">是否不生成预收款单号</Checkbox>
        </i-col>
        <i-col span="9" class="tr">
          <Form :model="formValidate" ref="form" :rules="ruleValidate">
            <FormItem label="选择辅助核算：" prop="voucherInput">
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
        <i-col span="15">
          <Form :model="formValidate" ref="form" :rules="ruleValidate">
            <FormItem label="选择辅助核算：" prop="voucherInput">
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
        <i-col span="9" class="tr">
          <Checkbox v-model="voucherinputModel" :checked.sync="voucherinputModel">是否不生成预收款单号</Checkbox>
        </i-col>
      </Row>

      <vxe-table
        border
        align="center"
        ref="xTable"
        :edit-rules="validRules"
        highlight-hover-row
        highlight-current-row
        show-overflow="title"
        auto-resize
        @current-change="currentChangeEvent"
        :edit-config="{trigger: 'click', mode: 'cell'}"
        size="mini"
        :data="accrued"
      >
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="area" width="80" title="所属区域"></vxe-table-column>
        <vxe-table-column field="shopName" width="120" title="所属门店"></vxe-table-column>
        <vxe-table-column field="shopCode" width="100" title="所属店号"></vxe-table-column>
        <vxe-table-column field="accountName" width="100" title="账户"></vxe-table-column>
        <vxe-table-column field="accountCode" width="100" title="账号"></vxe-table-column>
        <vxe-table-column field="bankName" width="120" title="开户行"></vxe-table-column>
        <vxe-table-column field="mateAccountName" width="80" title="对应科目"></vxe-table-column>
        <vxe-table-column field="createTime" width="140" title="发生日期"></vxe-table-column>
        <vxe-table-column field="incomeMoney" width="80" title="收入金额"></vxe-table-column>
        <vxe-table-column field="paidMoney" width="80" title="支出金额"></vxe-table-column>
        <vxe-table-column field="unClaimedAmt" width="80" title="未认领金额"></vxe-table-column>
        <vxe-table-column
          field="rpAmt"
          :edit-render="{name: 'input', props: {type: 'float', digits: 2},immediate:true}"
          title="本次认领金额"
          align="center"
          width="120"
          v-if="claimTit=='预收款认领'"
        ></vxe-table-column>
        <vxe-table-column
          field="balanceMoney"
          :edit-render="{name: 'input', props: {type: 'float', digits: 2},immediate:true}"
          title="本次认领金额"
          width="120"
          align="center"
          v-else
        ></vxe-table-column>
        <vxe-table-column field="reciprocalAccountName" width="80" title="对方户名"></vxe-table-column>
        <vxe-table-column
          field="tradingNote"
          :edit-render="{name: 'input',immediate:true, attrs: {type: 'text'}}"
          title="交易备注"
          width="200"
          align="center"
        ></vxe-table-column>
      </vxe-table>
      <div slot="footer">
        <Button type="primary" @click="openClimed('预收款认领')" class="mr10" v-if="claimTit=='预收款认领'">确定</Button>
        <Button type="primary" @click="openClimed('其他收款认领')" class="mr10" v-else>确定</Button>
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
      <Button class="ml10" v-if="claimTit == '其他收款认领'" @click="claimPay">认领</Button>
      <Button class="ml10" v-else @click="claimCollection">认领</Button>
      <claim ref="claim" @selection="selection"/>
      <div slot="footer"></div>
    </Modal>
    <claimGuest ref="claimGuest"></claimGuest>
    <!-- 辅助核销计算 -->
    <voucherInput ref="voucherInput" :oneAccountent="accruedList" :assistTypeCode="assistTypeCode"  @callBackFun="getCallBack"></voucherInput>
    <!--其他收款核销-->
    <settlement ref="settlement"></settlement>
  </div>
</template>
<script>
  import voucherInput from "@/view/settlementManagement/fundsManagement/claimWrite/components/components/voucherInput";
  import claim from "@/view/settlementManagement/otherReceivables/components/claimed.vue";
  import quickDate from "@/components/getDate/dateget_bill.vue";
  // import claimGuest from "@/view/settlementManagement/advanceCollection/components/claimGuest";
  import claimGuest from "@/view/settlementManagement/otherPayable/components/claimGuest";

  import {findGuest} from "@/api/settlementManagement/advanceCollection.js";
  import settlement from "@/view/settlementManagement/otherReceivables/components/settlement";
  import {claimedFund} from "@/api/settlementManagement/fundsManagement/claimWrite.js";
  import {TurnToTheProfitAndLoss} from "@/api/settlementManagement/fundsManagement/claimWrite.js";
  import {addClaim} from "_api/settlementManagement/otherPayable/otherPayable";
  import {addClaim2} from "_api/settlementManagement/advanceCollection.js";
  import {showLoading, hideLoading} from "@/utils/loading"

  export default {
    props: {
      accrued: "", //表格数据
    },
    components: {
      voucherInput, claim, settlement, claimGuest
    },
    data() {
      const amtValid = ({cellValue, row}) => {
        return new Promise((resolve, reject) => {
          if (cellValue) {
            let trueValue =
              Math.abs(row.rpAmt) > Math.abs(row.incomeMoney || row.paidMoney);
            if (trueValue) {
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
          voucherInput: [{required: true, message: '必填项', trigger: 'blur'}]
        },
        // 表格验证  本次认领金额  是否符合条件
        validRules: {
          rpAmt: [{validator: amtValid}],
          balanceMoney: [{required: true, validator: amtValid}]
        },
        modal: false, //模态框展示
        oneSubject: {}, //单选获取到的数据
        company: [], //往来单位数组
        companyId: "", //往来单位
        claimModal: false, //认领弹框
        claimTit: "预收款认领", //认领弹框标题
        amt: null, //认领弹框金额
        bankName: "", //认领弹框对方户名
        tableData: [], //表格信息
        page: {
          num: 1,
          size: 10,
          total: 0,
          opts: [20, 50, 100, 200]
        }, //分页
        serviceId: "", //给子组件传的值,
        MessageValue: "",
        claimSelection: [],
        //this.claimTit == '预收款认领' ? this.accruedList[0].mateAccountCoding = "1123" : this.accruedList[0].mateAccountCoding = "1221"
        accruedList: [{mateAccountCoding: ""}],
        outStaffSelect: {}, //辅助核算选择的外部员工对象
        isOutStaff: false, //是否是外部员工
        assistTypeCode: '', //能够选择辅助核算的类型
      };
    },
    mounted() {

    },
    methods: {
      // 打开模态框
      open() {
        this.claimTit == '预收款认领' ? this.accruedList[0].mateAccountCoding = "1123" : this.accruedList[0].mateAccountCoding = "2241"
        this.claimTit == '预收款认领' ? this.assistTypeCode = '1' : this.assistTypeCode = '4'
        if (this.company.length == 0) {
          this.getOne();
        }
        this.oneSubject = {};
        this.modal = true;
        this.MessageValue = ''
        this.$refs.voucherInput.AssistAccounting = ''
        this.$nextTick(() => {
          this.$refs.xTable.setActiveCell(this.$refs.xTable.getData(0), "rpAmt")
        })
      },
      //判断是否可选择
      checkMethod({row}) {
        return row.isDetailSubject == 0;
      },
      //获取单选框
      getRaido({row}) {
        this.oneSubject = row;
      },
      openVoucherInput() {
        if (this.claimTit == '预收款认领') {
          this.$refs.voucherInput.Classification = false;
        } else {
          this.$refs.voucherInput.Classification = true;
        }
        this.$refs.voucherInput.subjectModelShowassist = true;
      },
      async openClimed(claimTit) {
        this.getMessage()
        if (this.MessageValue == "") {
          this.$Message.error("请选择辅助核算")
        } else {
          const errMap = await this.$refs.xTable.validate().catch(errMap => errMap);
          if (errMap) {
          } else {
            this.ok()
          }
        }
      },
      //校验表单
      handleSubmit(callback) {
        this.$refs.form.validate(valid => {
          if (valid) {
            callback && callback();
          } else {
            this.$Message.error("带*为必填");
          }
        });
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
          this.claimedList(2);
        } else {
          this.claimedList(2);
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
      getMessage(item, flag) {
        if (flag) {
          this.outStaffSelect = item
        }
        this.MessageValue = this.$refs.voucherInput.AssistAccounting;
      },
      //认领弹框认领
      claimPay() {
        if (Object.keys(this.$refs.claim.currentClaimed).length !== 0) {
          if (
            Math.abs(this.$refs.claim.currentClaimed.paidMoney) <=
            this.oneSubject.applyAmt
          ) {
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
        // console.log(row,"???")
        //   this.reconciliationStatement.accountNo = row.serviceId;
        //   this.serviceId = row.serviceId;
        //   this.$refs.Record.init();
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
        this.accruedList = this.accrued;
        this.$refs.voucherInput.modal = !this.$refs.voucherInput.modal
        if (this.voucherinputModel = true) {
          this.openVoucherInput()
        } else {
          this.$refs.voucherInput.modal = false
        }
      },
      async ok() {
        let data = {};
        data.detailId = this.accrued[0].id;
        let objItem = this.$refs.voucherInput.voucherItem;
        if (this.voucherinputModel) {
          let ajaxBool = true;
          if (this.claimTit == "预收款认领") {
            data.claimMoney = this.accrued[0].rpAmt;
            data.subjectCode = "1123";
            data.claimType = 3
          } else {
            data.claimMoney = this.accrued[0].balanceMoney
            data.subjectCode = "2241";
            data.claimType = 5;
            data.paymentTypeCode = this.$refs.voucherInput.formDynamic.code;
            data.paymentTypeName = this.$refs.voucherInput.formDynamic.fund;
          }
          data.auxiliaryTypeCode = this.$refs.voucherInput.auxiliaryTypeCode == 2 ? 1 : this.$refs.voucherInput.auxiliaryTypeCode //辅助核算选中哪一个
          if (data.auxiliaryTypeCode == "1" || data.auxiliaryTypeCode == "2" || data.auxiliaryTypeCode == "3" || data.auxiliaryTypeCode == "4") {
            data.isAuxiliaryAccounting = 0 //是否辅助核算类
          } else {
            data.isAuxiliaryAccounting = 1
          }
          data.auxiliaryName = this.MessageValue //辅助核算名称
          data.auxiliaryCode = this.$refs.voucherInput.auxiliaryCode //辅助核算项目编码
          if (objItem.hasOwnProperty("id")) {
            data.suppliersBean = {
              guestSourceName: objItem.fullName || "",
              guestSourceId: objItem.id || ""
            }
          }
          if (data.claimMoney == null || data.claimMoney <= 0) {
            ajaxBool = false;
            return this.$Message.error("本次认领金额不可为零或小于零")
          } else if (data.claimMoney > Math.abs(this.accrued[0].incomeMoney)) {
            ajaxBool = false;
            return this.$Message.error("本次认领金额不可大于支付金额")
          }
          if (data.claimMoney > this.accrued[0].unClaimedAmt) {
            ajaxBool = false;
            return this.$Message.error('本次认领金额不可大于未认领金额')
          }
          if (this.isOutStaff) {
            data.externalEmployeeCode = this.outStaffSelect.itemCode
            data.externalEmployeeName = this.outStaffSelect.itemName
            data.auxiliaryTypeCode = this.outStaffSelect.auxiliaryTypeCode
          }
          showLoading('body', "保存中，请勿操作。。。")
          if (ajaxBool) {
            let res = await TurnToTheProfitAndLoss(data);
            if (res.code === 0) {
              //刷新 列表
              this.$parent.$parent.queryClaimed()
              //清空选中
              this.$parent.$parent.$refs.claim.currentClaimed = []
              this.modal = false;
              this.claimTit == "预收款认领" ? this.$Message.success("预收款认领成功") : this.$Message.success("其他收款认领成功")
              hideLoading()
            } else {
              hideLoading()
            }
          }
        } else {
          let ajaxBool = true;
          data.guestId = objItem.id || "";
          data.financeAccountCashList = this.accrued
          if (this.claimTit == "预收款认领") {
            data.claimMoney = this.accrued[0].rpAmt;
            data.subjectCode = "1123";
            this.accrued.map(el => {
              el.thisClaimedAmt = el.rpAmt;
              if (el.thisClaimedAmt == null || el.thisClaimedAmt <= 0) {
                ajaxBool = false;
                return this.$Message.error("本次认领金额不可为零或小于零")
              }
              if (el.thisClaimedAmt > el.unClaimedAmt) {
                ajaxBool = false;
                return this.$Message.error('本次认领金额不可大于未认领金额')
              }
              return el;
            })
            if (this.isOutStaff) {
              data.externalEmployeeCode = this.outStaffSelect.itemCode
              data.externalEmployeeName = this.outStaffSelect.itemName
              data.auxiliaryTypeCode = this.outStaffSelect.auxiliaryTypeCode
            }
            if (ajaxBool) {
              showLoading('body', "保存中，请勿操作。。。")
              addClaim2(data).then(res => {
                if (res.code === 0) {
                  this.$parent.$parent.queryClaimed()
                  this.$parent.$parent.$refs.claim.currentClaimed = []
                  this.$Message.success('认领成功')
                  this.modal = false;
                  hideLoading()
                } else {
                  hideLoading()
                }
              }).catch(err => {
                hideLoading()
              })
            }
          } else {
            data.subjectCode = "2241";
            data.auxiliaryTypeCode = this.$refs.voucherInput.auxiliaryTypeCode == 2 ? 1 : this.$refs.voucherInput.auxiliaryTypeCode //辅助核算选中哪一个
            data.claimType = 0;
            data.claimMoney = this.accrued[0].balanceMoney
            data.paymentTypeCode = this.$refs.voucherInput.formDynamic.code;
            data.paymentTypeName = this.$refs.voucherInput.formDynamic.fund;
            if (data.claimMoney == null || data.claimMoney <= 0) {
              ajaxBool = false;
              return this.$Message.error("本次认领金额不可为零或小于零")
            } else if (data.claimMoney > Math.abs(this.accrued[0].incomeMoney)) {
              ajaxBool = false;
              return this.$Message.error("本次认领金额不可大于支付金额")
            }
            if (data.claimMoney > this.accrued[0].unClaimedAmt) {
              ajaxBool = false;
              return this.$Message.error('本次认领金额不可大于未认领金额')
            }
            if (this.isOutStaff) {
              data.externalEmployeeCode = this.outStaffSelect.itemCode
              data.externalEmployeeName = this.outStaffSelect.itemName
              data.auxiliaryTypeCode = this.outStaffSelect.auxiliaryTypeCode
            }
            
            if (ajaxBool) {
              showLoading('body', "保存中，请勿操作。。。")
              addClaim(data).then(res => {
                if (res.code === 0) {
                  this.$parent.$parent.queryClaimed()
                  this.$parent.$parent.$refs.claim.currentClaimed = []
                  this.$Message.success('认领成功')
                  this.modal = false;
                  hideLoading()
                } else {
                  hideLoading()
                }
              }).catch(err => {
                hideLoading()
              })
            }
          }
        }
      },
      //选择辅助核算回调
      getCallBack(item, flag) {
        this.getMessage(item, flag);
      }
    }
  };
</script>
<style lang="less" scoped>
  .dbd {
    padding-bottom: 25px;
  }
</style>
