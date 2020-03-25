<template>
  <Modal v-model="Settlement" title="对账单收付款结算" width="1200" @on-visible-change="hander">
    <div class="db">
      <button class="ivu-btn ivu-btn-default mr10" type="button" @click="conserve">保存</button>
      <button class="ivu-btn ivu-btn-default mr10" type="button" @click="Settlement = false">关闭</button>
    </div>
    <div class="db p15 mt10 mb10">
      <Row>
        <Col span="8">
          <span>门店：</span>
          <Input class="w200" v-model="reconciliationStatement.orgName" />
        </Col>
        <Col span="8">
          <span>往来单位：</span>
          <Input class="w200" v-model="reconciliationStatement.guestName" />
        </Col>
        <Col span="8">
          <span>收付类型：</span>
          <Input class="w200" v-model="reconciliationStatement.sortName" />
        </Col>
      </Row>
      <Row class="mt10">
        <Col span="8">
          <span>对账单号：</span>
          <Input class="w200" v-model="reconciliationStatement.accountNo" />
          <i class="iconfont iconcaidan input" @click="accountNoClick"></i>
        </Col>
        <Col span="8">
          <span>收付款单号：</span>
          <Input class="w200" v-model="reconciliationStatement.serviceId" />
        </Col>
        <Col span="8">
          <span>核销方式：</span>
          <Input class="w200" v-model="reconciliationStatement.furposeName" />
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
            <vxe-table-column field="unAmt" title="未收/付金额"></vxe-table-column>
            <vxe-table-column
              field="rpAnt"
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
import accountSelette from "./accountWirte";
import { wirteAccount } from "_api/settlementManagement/seleteAccount.js";
import subjexts from "./subjects";
import bus from "../Popup/Bus";
export default {
  components: {
    accountSelette,
    subjexts
  },
  data() {
    return {
      Settlement: false, //弹框显示
      check: 0,
      remark: "",
      reconciliationStatement: { accountNo: 123, receiptPayment: 456 },
      BusinessType: [],
      tableData: [],
      collectPayId: "",
      obj: {}
    };
  },
  mounted() {
    // 对账单号
    bus.$on("accountHedNo", val => {
      this.reconciliationStatement.accountNo =
        this.reconciliationStatement.accountNo + "," + val.accountNo;
        val.two.map(item=>{
          item.businessTypeName = item.businessType.name;
        })
      this.BusinessType = [...this.BusinessType,...val.two]
    });
    //选择科目
    bus.$on("hedInfo", val => {
      this.BusinessType.push({
        businessTypeName: val.fullName,
        reconciliationAmt: 0,
        hasAmt: 0,
        unAmt: 0,
        rpAnt: 0,
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
          rpAnt: 0,
          unAmtLeft: 0
        });
      } else if (value.loginName) {
        this.BusinessType.push({
          businessTypeName: this.obj.fullName + "-" + value.loginName,
          reconciliationAmt: 0,
          hasAmt: 0,
          unAmt: 0,
          rpAnt: 0,
          unAmtLeft: 0
        });
      }
    });
    //收付款信息
    bus.$on("paymentInfo", val => {
      val.map(item=>{
        item.orgName = item.shopName
        item.paidMoney = item.paidMoney ? -item.paidMoney :0
        console.log(item.paidMoney)
      })
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
      } else {
        let sign =
          this.$parent.paymentId === "YJDZ"
            ? 1
            : this.$parent.paymentId === "YSK"
            ? 2
            : 4;
        wirteAccount({
          accountNo: this.$parent.currentAccount.accountNo,
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
    //保存
    conserve() {
      if (!this.check) {
      } else {
        this.$message.error("核对金额为0才能保存");
      }
    },
    // 核销单元格编辑状态下被关闭时
    editClosedEvent({ row, rowIndex }) {
      row.unAmtLeft = row.unAmt * 1 - row.rpAnt * 1;
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
              "rpAnt",
              "unAmtLeft"
            ].includes(column.property)
          ) {
            return this.$utils.sum(data, column.property);
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
            return this.$utils.sum(data, column.property);
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
        sum1 += item.rpAnt * 1;
      });
      this.tableData.map(item => {
        sum2 += item.incomeMoney ? item.incomeMoney * 1 : 0;
        sum3 += item.paidMoney ? item.paidMoney * 1 : 0;
      });
      this.check = sum1 - sum2 - sum3;
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