<template>
  <Modal v-model="Settlement" title="收付款结算" width="1300" @on-visible-change="hander">
    <div class="db">
      <button class="ivu-btn ivu-btn-default mr10" type="button" @click="conserve">保存</button>
      <button class="ivu-btn ivu-btn-default mr10" type="button" @click="Settlement = false">关闭</button>
    </div>
    <div class="db p15 mt10 mb10">
      <h4 class="mb10">基本信息</h4>
      <Row>
        <Col span="2" class="tr">
          <span>门店：</span>
        </Col>
        <Col span="6">
          <Input class="w260" v-model="reconciliationStatement.orgName" readonly />
        </Col>
        <Col span="2" class="tr">
          <span>往来单位：</span>
        </Col>
        <Col span="6">
          <Input class="w260" v-model="reconciliationStatement.guestName" readonly />
        </Col>
        <Col span="2" class="tr">
          <span>收付类型：</span>
        </Col>
        <Col span="6">
          <Input class="w260" v-model="reconciliationStatement.sortName" readonly />
        </Col>
      </Row>
      <Row class="mt10">
        <Col span="2" class="tr">
          <span>对账单号：</span>
        </Col>
        <Col span="6">
          <Input class="w260" v-model="reconciliationStatement.accountNo" readonly />
          <i class="iconfont iconcaidan input" v-if="showModalOne !== 1" @click="accountNoClick"></i>
        </Col>
        <Col span="2" class="tr">
          <span>收付款单号：</span>
        </Col>
        <Col span="6">
          <Input class="w260" v-model="reconciliationStatement.serviceId" readonly />
        </Col>
        <Col span="2" class="tr">
          <span>核销方式：</span>
        </Col>
        <Col span="6">
          <Input class="w260" v-model="reconciliationStatement.furposeName" readonly />
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
          ref="xTree"
          :edit-rules="validRules"
          auto-resize
          show-footer
          max-height="400"
          align="center"
          :data="BusinessType"
          :footer-method="offWrite"
          :edit-config="{trigger: 'click', mode: 'cell'}"
          @edit-closed="editClosedEvent"
        >
          <vxe-table-column title="核销信息">
            <vxe-table-column field="orgName" title="门店"></vxe-table-column>
            <vxe-table-column field="accountNo" title="对账单号"></vxe-table-column>
            <vxe-table-column field="guestName" title="往来单位"></vxe-table-column>
            <vxe-table-column field="businessTypeName" title="业务类型"></vxe-table-column>
            <vxe-table-column field="reconciliationAmt" title="对账金额"></vxe-table-column>
            <vxe-table-column field="hasAmt" title="已收/付金额"></vxe-table-column>
            <vxe-table-column field="unAmt"  title="未收/付金额"></vxe-table-column>
            <vxe-table-column
              field="rpAmt"
              title="本次核销金额"
              width="140"
              :edit-render="{name: 'input', attrs: {type: 'number'}}"
            ></vxe-table-column>
            <vxe-table-column field="unAmtLeft" title="剩余未收/未付"></vxe-table-column>
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
          max-height="400"
          align="center"
          :footer-method="payCollection"
          :data="tableData"
          :edit-config="{trigger: 'click', mode: 'cell'}"
        >
          <vxe-table-column title="收/付款信息">
            <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
            <vxe-table-column field="accountName" title="收/付款账户"></vxe-table-column>
            <vxe-table-column field="mateAccountName" title="科目代码"></vxe-table-column>
            <vxe-table-column field="createTime" title="发生日期"></vxe-table-column>
            <vxe-table-column field="incomeMoney" title="收入金额"></vxe-table-column>
            <vxe-table-column field="paidMoney" title="支出金额"></vxe-table-column>
            <vxe-table-column field="orgName" title="所属门店"></vxe-table-column>
          </vxe-table-column>
        </vxe-table>
      </Col>
    </Row>
    <div slot="footer"></div>
    <accountSelette ref="accountSelette" />
    <subjexts ref="subjexts" />
  </Modal>
</template>
<script>
import accountSelette from "./components/accountWirte";
import {
  wirteAccount,
  saveAccount,
  paymentRegain
} from "_api/settlementManagement/otherReceivables/otherReceivables";
import { orderWriteOff } from "_api/settlementManagement/otherPayable/otherPayable";
import subjexts from "./components/subjects";
import bus from "../../bill/Popup/Bus";
import moment from "moment";
export default {
  components: {
    accountSelette,
    subjexts
  },
  data() {
    const amtValid = ({row}) => {
      return new Promise((resolve, reject) => {
        let trueValue = Math.abs(row.rpAmt) > Math.abs(row.unAmt);
        if (trueValue) {
          reject(new Error("本次核销金额绝对值不能大于未收/付金额"));
        } else {
          resolve(true);
        }
      });
    };
    return {
      validRules: {
        rpAmt: [{ required: true, validator: amtValid}]
      },
      Settlement: false, //弹框显示
      check: 0,
      remark: "",
      reconciliationStatement: { accountNo: 123, receiptPayment: 456 },
      BusinessType: [],
      tableData: [],
      collectPayId: "",
      obj: {},
      showModalOne: '',
    };
  },
  mounted() {
    // 对账单号
    bus.$on("accountHedNo", val => {
      // console.log(val , 7879);
      this.reconciliationStatement.accountNo = this.reconciliationStatement.accountNo + val.serviceId;
      // val.map(item => {
      //   item.businessTypeName = item.businessType.name;
      // });
      // this.BusinessType = [...this.BusinessType, ...val];
      // console.log(val)
      let jsonArr = [val]
      jsonArr.map(item => {
        item.orgName = this.reconciliationStatement.orgName;
        item.accountNo = item.serviceId;
        // item.guestName = item.guestName;
        item.businessTypeName = item.orderTypeName;
        item.reconciliationAmt = - item.amountCollected; //对账金额
        item.hasAmt = +item.amountCollected - +item.paymentBalance; //已收/付金额
        item.unAmt = -item.paymentBalance; //未收/付金额
        item.rpAmt = -item.paymentBalance;
        item.unAmtLeft = item.unAmt - item.rpAmt;
      })
      // console.log(jsonArr)
      this.BusinessType.push(...jsonArr)
      // console.log(this.BusinessType)
      this.checkComputed()
    });
    //选择科目
    bus.$on("hedInfo", val => {
      this.BusinessType.push({
        businessTypeName: val.titleName,
        reconciliationAmt: 0,
        hasAmt: 0,
        unAmt: 0,
        rpAmt: 0,
        unAmtLeft: 0
      });
    });
    bus.$on("content", val => {
      this.obj = val;
    });
    bus.$on("ChildContent", value => {
      if (value.fullName) {
        this.BusinessType.push({
          businessTypeName: this.obj.fullName + "-" + value.fullName,
          reconciliationAmt: 0,
          hasAmt: 0,
          unAmt: 0,
          rpAmt: 0,
          unAmtLeft: 0
        });
      } else if (value.userName) {
        this.BusinessType.push({
          businessTypeName: this.obj.fullName + "-" + value.userName,
          reconciliationAmt: 0,
          hasAmt: 0,
          unAmt: 0,
          rpAmt: 0,
          unAmtLeft: 0
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
      this.tableData = val;
    });
  },
  methods: {
    setData(d){
      d.map(item=>{
        item.paidMoney=Math.abs(item.paidMoney)
      })

      this.tableData = d;
    },
    // 选择科目弹框
    subject() {
      this.$refs.subjexts.subjectModelShow = true;
    },
    // 对账单号选择
    accountNoClick() {
      this.$refs.accountSelette.modal1 = true;
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
        if(this.$parent.paymentId === "YSKZC"){
          this.$parent.claimModal=false
        }
      } else {
        let sign = 0;
        if (this.$parent.paymentId === "YSK") {
          sign = 2;
          this.showModalOne = 1;
        } else if (this.$parent.paymentId === "YFK") {
          this.showModalOne = 0;
          sign = 4;
          this.showModalOne = 0;
        } else if (this.$parent.paymentId === "YJDZ") {
          sign = 1;
          this.showModalOne = 1;
        }else if (this.$parent.paymentId === "YSKZC") {
          this.showModalOne = 0;
          sign = 3;
        } else if (this.$parent.type === 0) {
          sign = 6;
        } else if (this.$parent.type === 1) {
          sign = 7;
        } else if (this.$parent.type === 2) {
          sign = 8;
        }else if(this.$parent.paymentId === 'QTYSK'){
          sign = 11;
          this.showModalOne = 0;
        }
        let accountNo = this.$parent.reconciliationStatement
          ? this.$parent.reconciliationStatement.accountNo
          : this.$parent.currentAccount.accountNo;
        wirteAccount({
          accountNo,
          sign
        }).then(res => {
          if (res.code === 0) {
            res.data.one.furposeName = res.data.one.furpose.name;
            res.data.one.sortName = res.data.one.sort.name;
            this.reconciliationStatement = res.data.one;
            // console.log(this.reconciliationStatement);
            // console.log(this.showModalOne)
            if(this.showModalOne !== 1){
              this.reconciliationStatement.accountNo = '';
            }
            res.data.two.map(item => {
              item.businessTypeName = item.businessType.name;
            });
            this.BusinessType = res.data.two;
            // if(this.tableData){
            //   this.BusinessType[0].rpAmt = this.tableData[0].paidMoney;
            //   this.BusinessType[0].unAmtLeft = this.BusinessType[0].unAmt - this.BusinessType[0].rpAmt;
            // }
            this.checkComputed();
          }
        });
      }
    },
    //保存
    conserve() {
      if (!Number(this.check)) {
        if(this.$parent.typeA === '收回'){
          let obj = {
            one: this.reconciliationStatement,
            two: this.BusinessType,
            three: this.tableData
          };
          paymentRegain(obj).then(res => {
            if (res.code === 0) {
              this.Settlement = false;
              this.$parent.claimModal = false;
              this.$message.success("其他收款收回成功!");
              this.$parent.getQuery();
              this.$parent.typeA = '';
            }
          });
        } else if(this.$parent.Types === '其他收款核销'){
          this.$refs.xTree.validate((errMap) => {
            if (errMap) {
              this.$XModal.Message({status: 'error', message: '校验不通过！'})
            } else {
              let obj3 = {}
              obj3.one = this.reconciliationStatement;
              obj3.two = this.BusinessType;
              obj3.three = this.tableData;
              obj3.type= 2
              orderWriteOff(obj3).then(res => {
                if (res.code === 0) {
                  this.Settlement = false;
                  this.$parent.claimModal = false;
                  this.$message.success("其他收款核销成功!");
                  this.$parent.Types = '';
                  this.$parent.getQuery();
                }
              });
              // this.$XModal.message({ status: 'success', message: '校验成功！' })
            }
          })
        } else {
          let obj2 = {
            one: this.reconciliationStatement,
            two: this.BusinessType,
            three: this.tableData
          };
          if(this.$parent.otherPayCus){
            obj2.one.paymentTypeCode = this.$parent.fund
          }
          saveAccount(obj2).then(res => {
            if (res.code === 0) {
              this.Settlement = false;
              this.$parent.claimModal = false;
              this.$message.success("其他付款认领成功！");
              this.$parent.getQuery();
            }
          });
        }
      } else {
        this.$message.error("核对金额为0才能保存");
      }
    },
    // 核销单元格编辑状态下被关闭时
    editClosedEvent({ row, rowIndex }) {
      row.unAmtLeft = (row.unAmt * 1 - row.rpAmt * 1).toFixed(2);
      this.$set(this.BusinessType, rowIndex, row);
      this.checkComputed();
    },
    // 核销信息合计
    offWrite({ columns, data }) {
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
    payCollection({ columns, data }) {
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
