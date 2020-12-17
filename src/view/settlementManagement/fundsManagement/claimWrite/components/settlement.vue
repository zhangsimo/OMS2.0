<template>
  <Modal v-model="Settlement" title="对账单收付款结算" width="1200" @on-visible-change="hander">
    <div class="db">
      <Button class="ivu-btn ivu-btn-default mr10" @click="conserve" :loading="conserveDis">保存</Button>
      <button class="ivu-btn ivu-btn-default mr10" type="button" @click="Settlement = false">关闭</button>
    </div>
    <div class="db p15 mt10 mb10">
      <h4 class="mb10">基本信息</h4>
      <Row>
        <Col span="2" class="tr">
          <span>门店：</span>
        </Col>
        <Col span="6">
          <Input class="w260" v-model="reconciliationStatement.orgName" readonly/>
        </Col>
        <Col span="2" class="tr">
          <span>往来单位：</span>
        </Col>
        <Col span="6">
          <Input class="w260" v-model="reconciliationStatement.guestName" readonly/>
        </Col>
        <Col span="2" class="tr">
          <span>收付类型：</span>
        </Col>
        <Col span="6">
          <Input class="w260" v-model="reconciliationStatement.sortName" readonly/>
        </Col>
      </Row>
      <Row class="mt10">
        <Col span="2" class="tr">
          <span>对账单号：</span>
        </Col>
        <Col span="6">
          <Input class="w260" v-model="reconciliationStatement.accountNo" readonly/>
          <i class="iconfont iconcaidan input" @click="accountNoClick"></i>
        </Col>
        <Col span="2" class="tr">
          <span>收付款单号：</span>
        </Col>
        <Col span="6">
          <Input class="w260" v-model="reconciliationStatement.serviceId" readonly/>
        </Col>
        <Col span="2" class="tr">
          <span>核销方式：</span>
        </Col>
        <Col span="6">
          <Input class="w260" v-model="reconciliationStatement.furposeName" readonly/>
        </Col>
      </Row>
    </div>
    <Button @click="subject">选择添加科目</Button>
    <Row class="mt10">
      <Col span="16">
        <vxe-table
          style="flex:6"
          border
          resizable
          auto-resize
          show-footer
          max-height="400"
          align="center"
          size="mini"
          ref="account"
          show-overflow="title"
          :data="BusinessType"
          :footer-method="offWrite"
          :edit-config="{trigger: 'click', mode: 'cell' , showStatus: true}"
          @edit-closed="editClosedEvent"
        >
          <vxe-table-column title="核销信息">
            <vxe-table-column field="guestName" title="往来单位" width="120"></vxe-table-column>
            <vxe-table-column field="businessTypeName" title="业务类型" width="80"></vxe-table-column>
            <vxe-table-column field="reconciliationAmt" title="对账金额" width="80"></vxe-table-column>
            <vxe-table-column field="hasAmt" title="已收/付金额" width="100"></vxe-table-column>
            <vxe-table-column field="unAmt" title="未收/付金额" width="100"></vxe-table-column>
            <vxe-table-column
              field="rpAmt"
              title="本次核销金额"
              width="140"
            >
              <template v-slot="{row}">
                <vxe-input type="number" size="mini" v-model="row.rpAmt" @change="rpAmtChange(row)"></vxe-input>
              </template>
            </vxe-table-column>
            <vxe-table-column field="unAmtLeft" title="剩余未收/未付" width="100"></vxe-table-column>
            <vxe-table-column field="accountNo" title="对账单号" width="120"></vxe-table-column>
            <vxe-table-column field="orgName" title="门店" width="120"></vxe-table-column>
          </vxe-table-column>
        </vxe-table>
        <div>
          <section class="flex">
            <p
              class="w80 pl5 pr10"
              style="border:1px solid #ddd;border-top:0;border-right:0;line-height: 40px"
            >核对</p>
            <span
              class="w700 tc"
              style="display:inline-block;border:1px solid #ddd;border-top:none;line-height:40px"
            >{{check}}</span>
          </section>
          <section class="flex">
            <p
              class="w80 pl5 pr10"
              style="border:1px solid #ddd;border-top:0;border-right:0;line-height: 40px"
            >备注</p>
            <input
              type="text"
              size="large"
              class="w700"
              style="border:1px solid #ddd;border-top:none;text-indent:5px"
              v-model="reconciliationStatement.remark"
            />
          </section>
        </div>
      </Col>
      <Col span="8" style="overflow: hidden">
        <vxe-table
          class="ml10"
          border
          resizable
          auto-resize
          show-footer
          ref="vxeTable"
          align="center"
          size="mini"
          show-overflow="title"
          :edit-rules="validRules"
          :footer-method="payCollection"
          :data="tableData"
          :edit-config="{trigger: 'click', mode: 'cell',showStatus: true}"
        >
          <vxe-table-column title="收/付款信息">
            <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
            <vxe-table-column field="incomeMoney" title="收入金额" width="80"></vxe-table-column>
            <vxe-table-column field="paidMoney" title="支出金额" width="80"></vxe-table-column>
            <vxe-table-column field="unClaimedAmt" title="未认领金额" width="80"></vxe-table-column>
            <vxe-table-column
              field="thisClaimedAmt"
              title="本次认领金额"
              width="120"
              :edit-render="{name: 'input', props: {type: 'float', digits: 2},immediate:true}"
            >
            </vxe-table-column>
            <vxe-table-column field="accountName" title="收/付款账户" width="100"></vxe-table-column>
            <vxe-table-column field="mateAccountName" title="科目代码" width="100"></vxe-table-column>
            <vxe-table-column field="createTime" title="发生日期" width="100"></vxe-table-column>
            <vxe-table-column field="orgName" title="所属门店" width="160"></vxe-table-column>
          </vxe-table-column>
        </vxe-table>
      </Col>
    </Row>
    <div slot="footer"></div>
    <accountSelette ref="accountSelette" :accountNo="accountNo"/>
    <subjexts ref="subjexts"/>
  </Modal>
</template>
<script>
  import accountSelette from "../../../bill/components/accountWirte";
  import {
    wirteAccount,
    saveAccount
  } from "_api/settlementManagement/seleteAccount.js";
  import subjexts from "../../../bill/components/subjects";
  import bus from "../../../bill/Popup/Bus";
  import moment from "moment";
  import {showLoading, hideLoading} from "../../../../../utils/loading";

  export default {
    components: {
      accountSelette,
      subjexts
    },
    data() {
      const roleValid = ({cellValue, row}) => {
        return new Promise((resolve, reject) => {
          let Money = row.incomeMoney ? Math.abs(row.incomeMoney) : (row.paidMoney ? Math.abs(row.paidMoney) : 0)
          let reg = /^([1-9]\d*(\.\d+)?)$/
          if (cellValue && cellValue > Money) {
            reject(new Error('本次认领金额录入有误，请重新录入'))
          } else if (cellValue && !reg.test(cellValue)) {
            reject(new Error('输入数字不能小于0'))
          } else {
            resolve()
          }
        })
      }
      return {
        Settlement: false, //弹框显示
        check: 0,
        remark: "",
        accountNo: "",
        conserveDis: false,//保存 接口返回前不可点击
        reconciliationStatement: {accountNo: 123, receiptPayment: 456},
        BusinessType: [],
        tableData: [],
        collectPayId: "",
        obj: {},
        //表格校验
        validRules: {
          thisClaimedAmt: [
            {validator: roleValid}
          ]
        }
      };
    },
    mounted() {
      // 对账单号
      bus.$on("accountHedNo", (val, val1) => {
        this.reconciliationStatement.accountNo =
          this.reconciliationStatement.accountNo + "," + val1;
        val.two.map(item => {
          item.businessTypeName = item.businessType.name;
        });
        this.BusinessType = [...this.BusinessType, ...val.two];
        this.checkComputed()
      });
      //选择科目
      bus.$on("hedInfo", val => {
        this.BusinessType.push({
          mateAccountCode: val.titleCode,
          mateAccountName: val.titleName,
          businessTypeName: val.titleName,
          reconciliationAmt: 0,
          hasAmt: 0,
          unAmt: 0,
          rpAmt: 0,
          unAmtLeft: 0,
          thisClaimedAmt: 0,
          isSubject: 1//是否会计科目
        });
      });
      bus.$on("content", val => {
        this.obj = val;
      });
      bus.$on("ChildContent", value => {
        if (value.auxiliaryTypeCode == "1" || value.auxiliaryTypeCode == "2" || value.auxiliaryTypeCode == "3" || value.auxiliaryTypeCode == "4") {
          value.isAuxiliaryAccounting = 0 //是否辅助核算类
        } else {
          value.isAuxiliaryAccounting = 1
        }
        if (value.fullName) {
          this.BusinessType.push({
            businessTypeName: this.obj.fullName + "-" + value.shortName,
            reconciliationAmt: 0,
            hasAmt: 0,
            unAmt: 0,
            rpAmt: 0,
            unAmtLeft: 0,
            mateAccountCode: this.obj.titleCode,
            mateAccountName: this.obj.titleName,
            auxiliaryTypeCode: value.auxiliaryTypeCode, //辅助核算选中哪一个
            isAuxiliaryAccounting: value.isAuxiliaryAccounting,//是否辅助核算类
            auxiliaryName: value.shortName, //辅助核算名称
            auxiliaryCode: value.code, //辅助核算项目编码
            isSubject: 1,
            paymentTypeCode: value.paymentTypeCode ? value.paymentTypeCode : '',
            paymentTypeName: value.paymentTypeName ? value.paymentTypeName : '',
          });
        } else if (value.userName) {
          this.BusinessType.push({
            businessTypeName: this.obj.fullName + "-" + value.userName,
            reconciliationAmt: 0,
            hasAmt: 0,
            unAmt: 0,
            rpAmt: 0,
            unAmtLeft: 0,
            mateAccountCode: this.obj.titleCode,
            mateAccountName: this.obj.titleName,
            auxiliaryTypeCode: value.auxiliaryTypeCode, //辅助核算选中哪一个
            isAuxiliaryAccounting: value.isAuxiliaryAccounting,//是否辅助核算类
            auxiliaryName: value.userName, //辅助核算名称
            auxiliaryCode: value.code || value.id, //辅助核算项目编码
            isSubject: 1,
            paymentTypeCode: value.paymentTypeCode ? value.paymentTypeCode : '',
            paymentTypeName: value.paymentTypeName ? value.paymentTypeName : '',
          });
        } else if (value.itemName) {
          this.BusinessType.push({
            businessTypeName: this.obj.fullName + "-" + value.itemName,
            reconciliationAmt: 0,
            hasAmt: 0,
            unAmt: 0,
            rpAmt: 0,
            unAmtLeft: 0,
            mateAccountCode: this.obj.titleCode,
            mateAccountName: this.obj.titleName,
            auxiliaryTypeCode: value.dictCode, //辅助核算选中哪一个
            isAuxiliaryAccounting: value.isAuxiliaryAccounting,//是否辅助核算类
            auxiliaryName: value.itemName, //辅助核算名称
            auxiliaryCode: value.itemCode, //辅助核算项目编码
            isSubject: 1,
            paymentTypeCode: value.paymentTypeCode ? value.paymentTypeCode : '',
            paymentTypeName: value.paymentTypeName ? value.paymentTypeName : '',
          });
        }
      });
      //收付款信息
      bus.$on("paymentInfo", val => {
        val.map(item => {
          item.createTime = moment(item.createTime).format("YYYY-MM-DD HH:mm:ss");
          item.orgName = item.shopName;
          item.paidMoney = !item.paidMoney
            ? 0
            : item.paidMoney < 0
              ? item.paidMoney
              : -item.paidMoney;
          delete item.businessType;
        });
        this.tableData = val;
      });
    },
    methods: {
      // 选择科目弹框
      subject() {
        this.$refs.subjexts.subjectModelShow = true;
      },
      // 对账单号选择
      accountNoClick() {
        this.$refs.accountSelette.modal1 = true;
        this.accountNo = this.reconciliationStatement.accountNo
      },
      //弹框打开
      hander(type) {
        this.$nextTick(() => {
          this.$refs.vxeTable.setActiveCell(this.$refs.vxeTable.getData(0), "thisClaimedAmt")
        })
        if (!type) {
          this.check = 0;
          this.reconciliationStatement.remark = "";
          this.reconciliationStatement = {};
          this.BusinessType = [];
          // this.tableData = [];
          this.collectPayId = "";
        } else {
          let sign = 0;
          if (this.$parent.paymentId === "YSK") {
            sign = 2;
          } else if (this.$parent.paymentId === "YFK") {
            sign = 4;
          } else if (this.$parent.paymentId === "YJDZ") {
            sign = 1;
          } else if (this.$parent.type === 0) {
            sign = 6;
          } else if (this.$parent.type === 1) {
            sign = 7;
          } else if (this.$parent.type === 2) {
            sign = 8;
          }
          let accountNo = this.$parent.reconciliationStatement
            ? this.$parent.reconciliationStatement.accountNo
            : this.$parent.currentAccount.row.accountNo;
          wirteAccount({
            accountNo,
            sign
          }).then(res => {
            if (res.code === 0) {
              res.data.one.furposeName = res.data.one.furpose.name;
              res.data.one.sortName = res.data.one.sort.name;
              this.reconciliationStatement = res.data.one;
              res.data.two.map(item => {
                item.businessTypeName = item.businessType.name;
              });
              this.BusinessType = res.data.two;
              this.checkComputed();
            }
          });
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
      //保存
      async conserve() {
        if (!Number(this.check)) {
          var bool = true;
          this.tableData.map(row => {
            let Money = row.incomeMoney ? Math.abs(row.incomeMoney) : (row.paidMoney ? Math.abs(row.paidMoney) : 0)
            let reg = /^([0-9]\d*(\.\d+)?)$/
            if (row.thisClaimedAmt && row.thisClaimedAmt > Money) {
              this.$message.error("本次认领金额录入有误，请重新录入")
              bool = false
              return
            } else if (row.thisClaimedAmt && !reg.test(row.thisClaimedAmt)) {
              this.$message.error("本次认领金额不可小于0")
              bool = false;
              return
            }
            if (row.thisClaimedAmt <= 0 || row.thisClaimedAmt > row.unClaimedAmt) {
              this.$message.error('本次认领金额不可大于未认领金额')
              bool = false
              return
            }
          })
          let arr = this.$refs.account.footerData[0];
          let unAmtSumIdx;
          arr.map((item, index) => {
            if (item == "合计") {
              return unAmtSumIdx = index + 1;
            }
          })
          this.BusinessType.map(row => {
            if (row.isSubject == 1) {
              //若为会计科目项  则是若表格合计第一项为负则只可输入正数；表格合计第一项为正则只可输入负数
              let sumUnAmt = this.$utils.toNumber(arr[unAmtSumIdx])
              this.$refs.account.updateFooter();
              this.checkComputed();
              // if ((sumUnAmt < 0 && row.rpAmt < 0) || (sumUnAmt > 0 && row.rpAmt > 0)) {
              //   this.$Message.error("金额录入错误，请重新录入！")
              //   bool = false
              //   return
              // }
            } else {
              //若不为会计科目项  则是若表格当前行的未收/付款 为负则只可输入负数；为正则只可输入正数；
              let sumUnAmt = row.unAmt
              this.$refs.account.updateFooter();
              this.checkComputed();
              if ((sumUnAmt > 0 && row.rpAmt < 0) || (sumUnAmt < 0 && row.rpAmt > 0) || (Math.abs(sumUnAmt) < Math.abs(row.rpAmt))) {
                this.$Message.error("金额录入错误，请重新录入！")
                bool = false
                return
              }
            }
          })
          if (bool) {
            this.$refs.vxeTable.validate((errMap) => {
              if (errMap) {
                errMap && errMap()
              } else {
                let obj = {
                  one: this.reconciliationStatement,
                  two: this.BusinessType,
                  three: this.tableData
                };
                this.conserveDis = true;
                showLoading()
                saveAccount(obj).then(res => {
                  if (res.code === 0) {
                    this.$parent.queryNoWrite()
                    this.$parent.claimedList();
                    this.conserveDis = false;
                    this.Settlement = false;
                    this.$parent.accountNoWriteData = [];
                    this.$parent.claimedAmt = null;
                    this.$parent.difference = null;
                    this.$parent.currentAccount = {};
                    this.$message.success("保存成功");
                    hideLoading()
                  }
                }).catch(err => {
                  hideLoading()
                })
              }
            })
          }
        } else {
          this.$message.error("核对金额为0才能保存");
        }
      },
      // 核销单元格编辑状态下被关闭时
      editClosedEvent({row, rowIndex}) {
        row.unAmtLeft = (row.unAmt * 1 - row.rpAmt * 1).toFixed(2);
        this.$set(this.BusinessType, rowIndex, row);
        this.checkComputed();
      },
      rpAmtChange(row) {
        let arr = this.$refs.account.footerData[0];
        let unAmtSumIdx;
        arr.map((item, index) => {
          if (item == "合计") {
            return unAmtSumIdx = index + 1;
          }
        })
        if (row.isSubject == 1) {
          //若为会计科目项  则是若表格合计第一项为负则只可输入正数；表格合计第一项为正则只可输入负数
          let sumUnAmt = this.$utils.toNumber(arr[unAmtSumIdx])
          this.$refs.account.updateFooter();
          this.checkComputed();
          // if ((sumUnAmt < 0 && row.rpAmt < 0) || (sumUnAmt > 0 && row.rpAmt > 0)) {
          //   return this.$Message.error("金额录入错误，请重新录入！")
          // }
        } else {
          //若不为会计科目项  则是若表格当前行的未收/付款 为负则只可输入负数；为正则只可输入正数；
          let sumUnAmt = row.unAmt
          this.$refs.account.updateFooter();
          this.checkComputed();
          if ((sumUnAmt > 0 && row.rpAmt < 0) || (sumUnAmt < 0 && row.rpAmt > 0) || (Math.abs(sumUnAmt) < Math.abs(row.rpAmt))) {
            return this.$Message.error("金额录入错误，请重新录入！")
          }
        }
      },
      // 核销信息合计
      offWrite({columns, data}) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 3) {
              return "合计";
            }
            if (
              [
                "reconciliationAmt",
                "hasAmt",
                "unAmt",
                "rpAmt",
                "unAmtLeft"
              ].includes(column.property)
            ) {
              return this.$utils.sum(data, column.property).toFixed(2);
            }
            return null;
          })
        ];
      },
      // 收款信息合计
      payCollection({columns, data}) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return "合计";
            }
            if (['thisClaimedAmt'].includes(column.property)) {
              this.checkComputed()
              return this.$utils.sum(data, column.property).toFixed(2);
            }
            return null;
          })
        ];
      },
      // 核对计算
      checkComputed() {
        let sum1 = 0;
        let sum2 = 0;
        this.BusinessType.map(item => {
          sum1 += item.rpAmt * 1;
        });
        this.tableData.map(item => {
          sum2 += item.thisClaimedAmt ? item.thisClaimedAmt * 1 : 0;
        });
        this.check = (Math.abs(sum1) - Math.abs(sum2)).toFixed(2);
      }
    }
  };
</script>
<style lang="less" scoped>
  .input {
    position: relative;
    left: -26px;
    bottom: -5px;
  }

  #border {
    border: 1px solid #00a0e9 !important;
  }

  /*:edit-render="{name: 'input', attrs: {type: 'number',id:'border'}}"*/
</style>
