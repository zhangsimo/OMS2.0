<template>
  <Modal v-model="Settlement" title="收付款结算" width="1300" @on-visible-change="hander">
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
          <i class="iconfont iconcaidan input" v-if="showModalOne == 0" @click="accountNoClick"></i>
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
          ref="xTree"
          :edit-rules="validRules"
          border
          resizable
          auto-resize
          show-footer
          size="mini"
          show-overflow="title"
          max-height="400"
          align="center"
          :data="BusinessType"
          :footer-method="offWrite"
          :edit-config="{trigger: 'click', mode: 'cell'}"
          @edit-closed="editClosedEvent"
        >
          <vxe-table-column title="核销信息">
            <vxe-table-column field="guestName" width="120" title="往来单位"></vxe-table-column>
            <vxe-table-column field="businessTypeName" width="100" title="业务类型"></vxe-table-column>
            <vxe-table-column field="reconciliationAmt" width="80" title="对账金额"></vxe-table-column>
            <vxe-table-column field="hasAmt" width="120" title="已收/付金额"></vxe-table-column>
            <vxe-table-column field="unAmt" width="120" title="未收/付金额"></vxe-table-column>
            <vxe-table-column
              field="rpAmt"
              title="本次核销金额"
              width="140"
            >
              <template v-slot="{row}">
                <vxe-input type="number" size="mini" v-model="row.rpAmt" @change="rpAmtChange(row)"></vxe-input>
              </template>
            </vxe-table-column>
            <vxe-table-column field="unAmtLeft" width="140" title="剩余未收/未付"></vxe-table-column>
            <vxe-table-column field="accountNo" width="120" title="对账单号"></vxe-table-column>
            <vxe-table-column field="orgName" width="120" title="门店"></vxe-table-column>
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
              v-model="remark"
            />
          </section>
        </div>
      </Col>
      <Col span="8">
        <vxe-table
          class="ml10"
          style="flex:4"
          border
          resizable
          auto-resize
          show-footer
          size="mini"
          show-overflow="title"
          max-height="400"
          ref="xTable"
          align="center"
          :footer-method="payCollection"
          :data="tableData"
          :edit-config="{trigger: 'click', mode: 'cell'}"
        >
          <vxe-table-column title="收/付款信息">
            <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
            <vxe-table-column field="accountName" width="120" title="收/付款账户"></vxe-table-column>
            <vxe-table-column field="mateAccountName" width="100" title="科目代码"></vxe-table-column>
            <vxe-table-column field="createTime" width="120" title="发生日期"></vxe-table-column>
            <vxe-table-column field="incomeMoney" width="80" title="收入金额"></vxe-table-column>
            <vxe-table-column field="paidMoney" width="80" title="支出金额"></vxe-table-column>
            <vxe-table-column field="orgName" width="120" title="所属门店"></vxe-table-column>
          </vxe-table-column>
        </vxe-table>
      </Col>
    </Row>
    <div slot="footer"></div>
    <accountSelette ref="accountSelette" @accountHedNo2="accountHedNo2"/>
    <subjexts ref="subjexts"/>
  </Modal>
</template>
<script>
  import accountSelette from "./components/accountWirte";
  import {wirteAccount, saveAccount} from "_api/settlementManagement/seleteAccount";
  import {expenditureClaim, orderWriteOff} from "_api/settlementManagement/otherPayable/otherPayable";
  import subjexts from "./components/subjects";
  import bus from "../../bill/Popup/Bus";
  import moment from "moment";
  import {showLoading, hideLoading} from "@/utils/loading"

  export default {
    components: {
      accountSelette,
      subjexts
    },
    data() {
      const amtValid = ({row}) => {
        return new Promise((resolve, reject) => {
          let trueValue = Math.abs(row.rpAmt) > Math.abs(row.unAmt);
          if (row.isSubject != 1 && trueValue) {
            reject(new Error("本次核销金额绝对值不能大于未收/付金额"));
          } else {
            resolve(true);
          }
        });
      };
      return {
        validRules: {
          // rpAmt: [{required: true, validator: amtValid}]
        },
        Settlement: false, //弹框显示
        conserveDis: false,//保存接口返回之前按钮不可点击
        check: 0,
        remark: "",
        reconciliationStatement: {accountNo: 123, receiptPayment: 456},
        BusinessType: [],
        tableData: [],
        collectPayId: "",
        obj: {},
        showModalOne: 2, //判断是否显示...
        accountCode: "",
      };
    },
    mounted() {
      //对账单号
      // bus.$on("accountHedNo", val => {
      //   this.reconciliationStatement.accountNo = this.reconciliationStatement.accountNo + val.serviceId;
      //   // val.two.map(item => {
      //   //   item.businessTypeName = item.businessType.name;
      //   // });
      //   // this.BusinessType = [...this.BusinessType, ...val.two];
      //   let jsonArr = [val]
      //   jsonArr.map(item => {
      //     item.orgName = this.reconciliationStatement.orgName;
      //     item.accountNo = item.serviceId;
      //     // item.guestName = item.guestName;
      //     item.businessTypeName = item.businessType.name;
      //     item.reconciliationAmt = item.paymentClaimAmt;
      //     item.hasAmt = +item.paymentClaimAmt - +item.paymentBalance;
      //     item.unAmt = -item.paymentBalance;
      //     item.rpAmt = -item.paymentBalance;
      //     item.unAmtLeft = +item.rpAmt - +item.unAmt;
      //   })
      //   this.BusinessType.push(...jsonArr)
      //   this.checkComputed()
      // });
      //选择科目
      bus.$on("hedInfo", val => {
        this.BusinessType.push({
          businessTypeName: val.titleName,
          reconciliationAmt: 0,
          hasAmt: 0,
          unAmt: 0,
          rpAmt: 0,
          unAmtLeft: 0,
          isSubject: 1//与本来对账单区分
        });
      });
      bus.$on("content", val => {
        this.obj = val;
      });
      bus.$on("ChildContent", value => {
        value.auxiliaryTypeCode = value.auxiliaryTypeCode == 2 ? 1 : value.auxiliaryTypeCode //辅助核算选中哪一个
        if (value.auxiliaryTypeCode == "1" || value.auxiliaryTypeCode == "2" || value.auxiliaryTypeCode == "3" || value.auxiliaryTypeCode == "4") {
          value.isAuxiliaryAccounting = 0 //是否辅助核算类
        } else {
          value.isAuxiliaryAccounting = 1
        }
        if (value.fullName) {
          this.BusinessType.push({
            serviceTypeName: this.obj.fullName + "-" + value.fullName,
            reconciliationAmt: 0,
            hasAmt: 0,
            unAmt: 0,
            rpAmt: 0,
            unAmtLeft: 0,
            mateAccountName: this.obj.titleName,
            mateAccountCode: this.obj.titleCode,
            auxiliaryTypeCode: value.auxiliaryTypeCode, //辅助核算选中哪一个
            isAuxiliaryAccounting: value.isAuxiliaryAccounting,//是否辅助核算类
            auxiliaryName: value.fullName, //辅助核算名称
            auxiliaryCode: value.code, //辅助核算项目编码
            isSubject: 1
          });
        } else if (value.userName) {
          this.BusinessType.push({
            serviceTypeName: this.obj.fullName + "-" + value.userName,
            reconciliationAmt: 0,
            hasAmt: 0,
            unAmt: 0,
            rpAmt: 0,
            unAmtLeft: 0,
            mateAccountName: this.obj.titleName,
            mateAccountCode: this.obj.titleCode,
            auxiliaryTypeCode: value.auxiliaryTypeCode, //辅助核算选中哪一个
            isAuxiliaryAccounting: value.isAuxiliaryAccounting,//是否辅助核算类
            auxiliaryName: value.fullName, //辅助核算名称
            auxiliaryCode: value.code, //辅助核算项目编码
            isSubject: 1
          });
        } else if (value.itemName) {
          this.BusinessType.push({
            serviceTypeName: this.obj.fullName + "-" + value.itemName,
            reconciliationAmt: 0,
            hasAmt: 0,
            unAmt: 0,
            rpAmt: 0,
            unAmtLeft: 0,
            mateAccountName: this.obj.titleName,
            mateAccountCode: this.obj.titleCode,
            auxiliaryTypeCode: value.auxiliaryTypeCode, //辅助核算选中哪一个
            isAuxiliaryAccounting: value.isAuxiliaryAccounting,//是否辅助核算类
            auxiliaryName: value.fullName, //辅助核算名称
            auxiliaryCode: value.code, //辅助核算项目编码
            isSubject: 1
          });
        }
      });
      //收付款信息
      bus.$on("paymentInfo", val => {
        val.map(item => {
          item.createTime = moment(item.createTime).format("YYYY-MM-DD HH:mm:ss");
          item.orgName = item.shopName;
          item.paidMoney = !item.paidMoney ? 0 : item.paidMoney < 0 ? -item.paidMoney : item.paidMoney;
          delete item.businessType;
        });
      });
    },
    methods: {
      accountHedNo2(val) {
        this.reconciliationStatement.accountNo = this.reconciliationStatement.accountNo + ';' + val.serviceId;
        let jsonArr = [val]
        if (jsonArr.length >= 1) {
          jsonArr.map(item => {
            item.orgName = this.reconciliationStatement.orgName;
            item.accountNo = item.serviceId;
            item.businessTypeName = item.businessType ? item.businessType.name : '';
            item.reconciliationAmt = item.paymentClaimAmt;
            item.hasAmt = +item.paymentClaimAmt - +item.paymentBalance;
            item.unAmt = -item.paymentBalance;
            item.rpAmt = -item.paymentBalance;
            item.unAmtLeft = +item.rpAmt - +item.unAmt;
          })
        }
        this.BusinessType.push(...jsonArr)
        this.checkComputed()
      },


      // 选择科目弹框
      subject() {
        this.$refs.subjexts.subjectModelShow = true;
      },
      // 对账单号选择
      accountNoClick() {
        this.$refs.accountSelette.compyName = this.reconciliationStatement.guestName;
        this.$refs.accountSelette.init();
      },
      //弹框打开
      hander(type) {
        if (!type) {
          this.check = 0;
          this.remark = "";
          this.reconciliationStatement = {};
          this.BusinessType = [];
          this.tableData = [];
          this.collectPayId = "";
          this.$parent.Types = '';
          if (this.$parent.paymentId === "YSKZC") {
            this.$parent.claimModal = false
          }
        } else {
          let sign = 0;
          if (this.$parent.paymentId === "YSK") {
            sign = 2;
          } else if (this.$parent.paymentId === "YFK") {
            sign = 4;
          } else if (this.$parent.paymentId === "YJDZ") {
            sign = 1;
          } else if (this.$parent.paymentId === "YSKZC") {
            sign = 3;
          } else if (this.$parent.type === 0) {
            sign = 6;
          } else if (this.$parent.type === 1) {
            sign = 7;
          } else if (this.$parent.type === 2) {
            sign = 8;
          } else if (this.$parent.paymentId === 'QTYSK') {
            sign = 11;
          }
          if (this.$parent.Types === '其他付款核销') {
            this.showModalOne = 0;
            sign = 13;
          } else {
            this.showModalOne = 1;
          }
          let accountNo = this.$parent.reconciliationStatement ? this.$parent.reconciliationStatement.accountNo : this.$parent.currentAccount.accountNo;
          let id = this.$parent.currRow.id;
          wirteAccount({
            accountNo,
            sign,
            id
          }).then(res => {
            if (res.code === 0) {
              res.data.one.furposeName = res.data.one.furpose.name;
              res.data.one.sortName = res.data.one.sort.name;
              this.reconciliationStatement = res.data.one;
              if (this.showModalOne !== 1) {
                this.reconciliationStatement.accountNo = '';
              }
              this.reconciliationStatement.accountNo = accountNo
              res.data.two.map(item => {
                item.businessTypeName = item.businessType.name;
              });
              this.BusinessType = res.data.two;
              // if(this.tableData){
              //   this.BusinessType[0].rpAmt = this.tableData[0].paidMoney;
              //   this.BusinessType[0].unAmtLeft = this.BusinessType[0].unAmt - this.BusinessType[0].rpAmt;
              // }
              // console.log(this.tableData)
              this.checkComputed();
            }
          });
        }
      },
      //本次核销金额输入
      rpAmtChange(row) {
        let arr=this.$refs.xTree.footerData[0];
        let unAmtSumIdx;
        arr.map((item,index)=>{
          if(item=="合计"){
            return unAmtSumIdx=index+1;
          }
        })
        if(row.isSubject==1){
          //若为会计科目项  则是若表格合计第一项为负则只可输入正数；表格合计第一项为正则只可输入负数
          let sumUnAmt = this.$utils.toNumber(arr[unAmtSumIdx])
          this.$refs.xTree.updateFooter();
          this.checkComputed();
          if ((sumUnAmt < 0 && row.rpAmt <= 0) || (sumUnAmt > 0 && row.rpAmt >= 0)) {
            return this.$Message.error("金额录入错误，请重新录入！")
          }
        }else{
          //若不为会计科目项  则是若表格当前行的未收/付款 为负则只可输入负数；为正则只可输入正数；
          let sumUnAmt = row.unAmt
          this.$refs.xTree.updateFooter();
          this.checkComputed();
          if ((sumUnAmt > 0 && row.rpAmt <= 0) || (sumUnAmt < 0 && row.rpAmt >= 0)) {
            return this.$Message.error("金额录入错误，请重新录入！")
          }
        }
      },
      //保存
      async conserve() {
        const errMap = await this.$refs.xTree
          .fullValidate()
          .catch(errMap => errMap);
        if (errMap) return this.$Message.error("表格校验错误");
        if (!Number(this.check)) {
          // console.log(this.$parent.Types)
          if (this.$parent.Types == '其他付款核销') {
            if (errMap) {
              this.$XModal.Message({status: 'error', message: '校验不通过！'})
            } else {
              let bool = true;
              let arr=this.$refs.xTree.footerData[0];
              let unAmtSumIdx;
              arr.map((item,index)=>{
                if(item=="合计"){
                  return unAmtSumIdx=index+1;
                }
              })
              this.BusinessType.map(row=>{
                if(row.isSubject==1){
                  //若为会计科目项  则是若表格合计第一项为负则只可输入正数；表格合计第一项为正则只可输入负数
                  let sumUnAmt = this.$utils.toNumber(arr[unAmtSumIdx])
                  this.$refs.xTable.updateFooter();
                  this.checkComputed();
                  if ((sumUnAmt < 0 && row.rpAmt <= 0) || (sumUnAmt > 0 && row.rpAmt >= 0)) {
                    this.$Message.error("金额录入错误，请重新录入！")
                    bool = false
                    return
                  }
                }else{
                  //若不为会计科目项  则是若表格当前行的未收/付款 为负则只可输入负数；为正则只可输入正数；
                  let sumUnAmt = row.unAmt;
                  this.$refs.xTable.updateFooter();
                  this.checkComputed();
                  if ((sumUnAmt > 0 && row.rpAmt <= 0) || (sumUnAmt < 0 && row.rpAmt >= 0)) {
                    this.$Message.error("金额录入错误，请重新录入！")
                    bool = false
                    return
                  }
                }
              })
              if(bool){
                let obj = {
                  one: this.reconciliationStatement,
                  two: this.BusinessType,
                  // three: this.tableData,
                  type: 1
                };
                this.conserveDis = true;
                showLoading()
                orderWriteOff(obj).then(res => {
                  if (res.code === 0) {
                    hideLoading()
                    this.conserveDis = false;
                    this.Settlement = false;
                    this.$message.success("其他付款核销成功");
                    this.$parent.getQuery();
                  } else {
                    this.conserveDis = false;
                    hideLoading()
                  }
                }).catch(err => {
                  hideLoading()
                })
                this.$XModal.message({status: 'success', message: '校验成功！'})
              }
            }
          } else {
            let obj = {
              one: this.reconciliationStatement,
              two: this.BusinessType,
              // three: this.tableData
            };
            this.conserveDis = true;
            showLoading()
            expenditureClaim(obj).then(res => {
              if (res.code === 0) {
                hideLoading()
                this.conserveDis = false;
                this.Settlement = false;
                this.$message.success("保存成功");
                this.$parent.getQuery();
                this.$emit("reloadParList")
              } else {
                hideLoading()
                this.conserveDis = false;
              }
            }).catch(err => {
              hideLoading()
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
            if (["incomeMoney", "paidMoney"].includes(column.property)) {
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
        let sum3 = 0;
        this.BusinessType.map(item => {
          sum1 += item.rpAmt * 1;
        });
        this.tableData.map(item => {
          sum2 += item.incomeMoney ? item.incomeMoney * 1 : 0;
          sum3 += item.paidMoney ? item.paidMoney * 1 : 0;
        });
        this.check = (sum1 - sum2 - sum3).toFixed(2);
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
</style>
