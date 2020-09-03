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
          <Input disabled class="w200" v-model="reconciliationStatement.orgName" />
        </Col>
        <Col span="8">
          <span>往来单位：</span>
          <Input disabled class="w200" v-model="reconciliationStatement.guestName" />
        </Col>
        <Col span="8">
          <span>收付类型：</span>
          <Input disabled class="w200" v-model="reconciliationStatement.sort.name" />
        </Col>
      </Row>
      <Row class="mt10">
        <Col span="8">
          <span>对账单号：</span>
          <Input class="w200" v-model="accountNo" :disabled="accountDisabeld" />
          <i class="iconfont iconcaidan input" @click="accountNoClick"></i>
        </Col>
        <Col span="8">
          <span>收付款单号：</span>
          <Input disabled class="w200" v-model="reconciliationStatement.serviceId" />
        </Col>
        <Col span="8">
          <span>核销方式：</span>
          <Input disabled class="w200" v-model="reconciliationStatement.furpose.name" />
        </Col>
      </Row>
    </div>
    <Button @click="subject">选择添加科目</Button>
    <Row class="mt10">
      <Col span="16">
        <vxe-table
          style="flex:6"
          height="314"
          border
          resizable
          align="center"
          size="mini"
          auto-resize
          show-footer
          :data="BusinessType"
          :footer-method="offWrite"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
          @edit-closed="editClosedEvent"
        >
          <vxe-table-column title="核销信息">
            <vxe-table-column field="orgName" title="门店"></vxe-table-column>
            <vxe-table-column field="accountNo" title="对账单号"></vxe-table-column>
            <vxe-table-column field="guestName" title="往来单位"></vxe-table-column>
            <vxe-table-column field="serviceTypeName" title="业务类型"></vxe-table-column>
            <vxe-table-column field="reconciliationAmt" title="对账金额"></vxe-table-column>
            <vxe-table-column field="hasAmt" title="已收/付金额"></vxe-table-column>
            <vxe-table-column field="unAmt" title="未收/付金额"></vxe-table-column>
            <vxe-table-column
              field="rpAmt"
              title="本次核销金额"
              width="140"
              :edit-render="{ name: 'input', attrs: { type: 'number' } }"
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
            >{{ check }}</span>
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
          size="mini"
          align="center"
          show-footer
          :footer-method="payCollection"
          :data="gettlementData.list"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
        >
          <vxe-table-column title="收/付款信息">
            <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
            <vxe-table-column field="accountBankNo" title="收/付款账户"></vxe-table-column>
            <vxe-table-column field="subjectName" title="科目名称"></vxe-table-column>
            <vxe-table-column field="incomeMoney" title="收入金额"></vxe-table-column>
            <vxe-table-column field="paidMoney" title="支出金额"></vxe-table-column>
            <vxe-table-column field="ownStoreName" title="所属门店"></vxe-table-column>
          </vxe-table-column>
        </vxe-table>
      </Col>
    </Row>
    <div slot="footer"></div>
    <accountSelette @accountHedNo="selectAccountNo" ref="accountSelette" />
    <subjexts ref="subjexts" />
  </Modal>
</template>
<script>
import * as api from "_api/settlementManagement/advanceCharge";
import { mapGetters } from "vuex";
import accountSelette from "./accountSelette";
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
      reconciliationStatement: {
        sort: { name: "" },
        furpose: { name: "" }
      },
      BusinessType: [],
      collectPayId: "",
      obj: {},
      accountDisabeld: true //对账单号是否可选
    };
  },
  computed: {
    ...mapGetters(["gettlementData"]),
    accountNo() {
      return (
        this.reconciliationStatement.accountNo +
        ";" +
        (this.reconciliationStatement.accountNo2 == undefined
          ? " "
          : this.reconciliationStatement.accountNo2)
      );
    }
  },
  mounted() {
    // 对账单号
    // bus.$on("accountHedNo", val => {
    //   this.reconciliationStatement.accountNo = val.serviceId;
    // });
    //选择科目
    bus.$on("hedInfo", val => {
      this.BusinessType.push({
        serviceTypeName: val.fullName,
        reconciliationAmt: 0,
        hasAmt: 0,
        unAmt: 0,
        rpAmt: 0,
        unAmtLeft: 0,
        mateAccountName:val.titleName,
        mateAccountCode:val.titleCode,
      });
    });
    bus.$on("content", val => {
      this.obj = val;
    });
    bus.$on("ChildContent", value => {
      if (value.fullName) {
        this.BusinessType.push({
          serviceTypeName: this.obj.fullName + "-" + value.fullName,
          reconciliationAmt: 0,
          hasAmt: 0,
          unAmt: 0,
          rpAmt: 0,
          unAmtLeft: 0,
          mateAccountName:val.titleName,
          mateAccountCode:val.titleCode,
        });
      } else if (value.userName) {
        this.BusinessType.push({
          serviceTypeName: this.obj.fullName + "-" + value.userName,
          reconciliationAmt: 0,
          hasAmt: 0,
          unAmt: 0,
          rpAmt: 0,
          unAmtLeft: 0,
          mateAccountName:val.titleName,
          mateAccountCode:val.titleCode,
        });
      }
    });
    //收付款信息
    bus.$on("paymentInfo", val => {
      this.tableData = val;
    });
  },
  methods: {
    setData(d){
      // console.log(d)
      this.gettlementData.list = d;
    },
    init() {
      this.Settlement = true;
      this.accountDisabeld = this.gettlementData.sign == 9 ? true : false;
    },
    // 选择科目弹框
    subject() {
      this.$refs.subjexts.subjectModelShow = true;
    },
    // 对账单号选择
    accountNoClick() {
      if (this.gettlementData.sign == 9) return false;
      this.$refs.accountSelette.modal1 = true;
    },
    //弹框打开
    hander(type) {
      if (!type) {
        this.check = 0;
        this.remark = "";
        this.reconciliationStatement = {sort: { name: "" },
        furpose: { name: "" }};
        this.BusinessType = [];
        this.tableData = [];
        this.collectPayId = "";
      } else {
        this.checkComputed();
        this.getList();
      }
    },
    async getList() {
      let params = {
        sign: this.gettlementData.sign,
        accountNo: this.gettlementData.accountNo
      };
      let res = await api.settlementInit(params);
      if (res.code == 0 && res.data != null) {
        this.reconciliationStatement = res.data.one;
        this.BusinessType = res.data.two.map(el => {
          try {
            el.serviceTypeName = el.businessType.name;
          } catch (e) {
            el.serviceTypeName = "";
          }
          return el;
        });
        this.checkComputed(); // add new
      }
    },
    //获取到对账单号下的数据
    selectAccountNo(row) {
      this.reconciliationStatement = { ...this.reconciliationStatement };
      // 选择的对账类型
      this.reconciliationStatement.receivePaymentType = row.receivePaymentType;
      // 选择的对账单号
      this.reconciliationStatement.accountNo2 = row.accountNo;
      let two = [];
      if (row.two !== undefined) {
        two = row.two;
        Reflect.deleteProperty(row, "two");
        two = [...two];
      } else {
      }
      two = two.map(el => {
        try {
          el.serviceTypeName = el.businessType.name;
        } catch (e) {
          el.serviceTypeName = "";
        }
        return el;
      });
      this.BusinessType.push(...two);
      this.checkComputed();
    },
    // getSendData(row) {
    //   console.log("1", row);
    // },
    // getChildContent(row) {
    //   console.log("2", row);
    // },
    //保存
    async conserve() {
      if (!this.check) {
        if (this.reconciliationStatement.receivePaymentType == "") {
          return this.$message.error("请先选择对账单");
        }
        let data = {
          one: {
            orgId: this.reconciliationStatement.orgId,
            orgName: this.reconciliationStatement.orgName,
            guestId: this.reconciliationStatement.guestId,
            sort: this.reconciliationStatement.sort,
            accountNo: this.accountNo,
            serviceId: this.reconciliationStatement.serviceId,
            furpose: this.reconciliationStatement.furpose,
            // receivePaymentType:this.reconciliationStatement.receivePaymentType,
            remark: this.remark
          },
          two: []
        };
        this.BusinessType.forEach(el => {
          let item = {
            orgId: el.orgId,
            orgName: el.orgName,
            accountNo: el.accountNo,
            guestId: el.guestId,
            guestName: el.guestName,
            businessType: !el.businessType ? null : el.businessType,
            reconciliationAmt: el.reconciliationAmt,
            hasAmt: el.hasAmt,
            unAmt: el.unAmt,
            rpAmt: el.rpAmt,
            unAmtLeft: el.unAmtLeft,
            mateAccountName:el.mateAccountName,
            mateAccountCode:el.mateAccountCode,
          };
          data.two.push(item);
        });
        if (this.gettlementData.sign == 4) {
          // 预付款核销
          let res = await api.addAll(data);
          if (res.code == 0) {
            this.Settlement = false;
            this.$emit("getNewList", {});
            return this.$message.success("核销成功");
          }
        }
        if (this.gettlementData.sign == 5) {
          // 预付款收回认领
          data.three = [];
          this.gettlementData.list.forEach(el => {
            let item = {
              accountName: el.accountName,
              id: el.id,
              mateAccountCode: el.mateAccountCode,
              mateAccountName: el.mateAccountName,
              incomeMoney: el.incomeMoney,
              paidMoney: el.paidMoney,
              orgId: el.ownStoreId,
              orgName: el.ownStoreName,
              amt: el.amt
            };
            data.three.push(item);
          });
          let res = await api.addAll(data);
          if (res.code == 0) {
            this.Settlement = false;
            this.$emit("getNewList", {});
            return this.$message.success("收回认领成功");
          }
        }
        if (this.gettlementData.sign == 9) {
          // 预付款认领
          data.three = [];
          this.gettlementData.list.forEach(el => {
            let item = {
              accountName: el.accountName,
              id: el.id,
              mateAccountCode: el.mateAccountCode,
              mateAccountName: el.mateAccountName,
              incomeMoney: Math.abs(el.incomeMoney),
              paidMoney: Math.abs(el.paidMoney),
              orgId: el.ownStoreId,
              orgName: el.ownStoreName,
              amt: el.amt
            };
            data.three.push(item);
          });
          let res = await api.addAll(data);
          if (res.code == 0) {
            this.Settlement = false;
            this.$emit("getNewList", {});
            return this.$message.success("预付款认领成功");
          }
        }
      } else {
        this.$message.error("核对金额为0才能保存");
      }
    },
    // 核销单元格编辑状态下被关闭时
    editClosedEvent({ row, rowIndex }) {
      if (isNaN(row.reconciliationAmt)) {
        row.reconciliationAmt = 0;
      }
      if (isNaN(row.unAmtLeft)) {
        row.unAmtLeft = 0;
      }
      if (isNaN(row.endAmt)) {
        row.endAmt = 0;
      }
      if (isNaN(row.rpAmt)) {
        row.rpAmt = 0;
      }
      if (isNaN(row.uncollectedAmt)) {
        row.uncollectedAmt = 0;
      }
      row.unAmtLeft = row.reconciliationAmt * 1 - row.rpAmt * 1;
      row.endAmt = +row.rpAmt * 1;
      row.uncollectedAmt = row.reconciliationAmt * 1 - row.rpAmt;
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
        item.rpAmt = item.rpAmt == "" ? 0 : item.rpAmt;
        sum1 += parseFloat(item.rpAmt);
      });
      this.gettlementData.list.map(item => {
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
