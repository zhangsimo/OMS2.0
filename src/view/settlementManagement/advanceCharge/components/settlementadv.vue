<template>
  <Modal v-model="Settlement" title="对账单收付款结算" width="1200" @on-visible-change="hander">
    <div class="db">
      <Button class="ivu-btn ivu-btn-default mr10" @click="conserve" :loading="conserveDis">保存</Button>
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
          ref="xTable"
          show-overflow="title"
          auto-resize
          show-footer
          :data="BusinessType"
          :edit-rules="validRules"
          :footer-method="offWrite"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
          @edit-closed="editClosedEvent"
        >
          <vxe-table-column title="核销信息">
            <vxe-table-column field="guestName" width="100" title="往来单位"></vxe-table-column>
            <vxe-table-column field="serviceTypeName" width="80" title="业务类型"></vxe-table-column>
            <vxe-table-column field="reconciliationAmt" width="80" title="对账金额"></vxe-table-column>
            <vxe-table-column field="hasAmt" title="已收/付金额" width="140"></vxe-table-column>
            <vxe-table-column field="unAmt" title="未收/付金额" width="140"></vxe-table-column>
<!--            <vxe-table-column-->
<!--              field="rpAmt"-->
<!--              title="本次核销金额"-->
<!--              width="140"-->
<!--              :edit-render="{ name: 'input', attrs: { type: 'number' } }"-->
<!--            ></vxe-table-column>-->
            <vxe-table-column
              field="rpAmt"
              title="本次核销金额"
              width="140"
            >
              <template v-slot="{row}">
                <vxe-input type="number" size="mini" v-model="row.rpAmt" @change="rpAmtChange(row)"></vxe-input>
              </template>
            </vxe-table-column>
            <vxe-table-column field="unAmtLeft" title="剩余未收/未付" width="140"></vxe-table-column>
            <vxe-table-column field="accountNo" width="120" title="对账单号"></vxe-table-column>
            <vxe-table-column field="orgName" width="100" title="门店"></vxe-table-column>
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
          show-overflow="title"
          align="center"
          show-footer
          :footer-method="payCollection"
          :data="gettlementData.list"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
        >
          <vxe-table-column title="收/付款信息">
            <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
            <vxe-table-column field="accountBankNo" width="120" title="收/付款账户"></vxe-table-column>
            <vxe-table-column field="subjectName" width="80" title="科目名称"></vxe-table-column>
            <vxe-table-column field="incomeMoney" width="80" title="收入金额"></vxe-table-column>
            <vxe-table-column field="paidMoney" width="80" title="支出金额"></vxe-table-column>
            <vxe-table-column field="ownStoreName" width="120" title="所属门店"></vxe-table-column>
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
import {showLoading, hideLoading} from "@/utils/loading"
export default {
  components: {
    accountSelette,
    subjexts
  },
  data() {
    const rpAmtValid = ({ cellValue, row }) => {
      return new Promise((resolve, reject) => {
        if (cellValue) {
          if (row.isSubject!=1 && Math.abs(cellValue) > Math.abs(row.unAmt)) {
            reject(new Error("本次核销金额不能大于未收/付金额"));
          } else {
            resolve();
          }
        } else {
          resolve();
        }
      });
    };
    return {
      Settlement: false, //弹框显示
      conserveDis:false,//保存接口返回之前按钮不可点击
      check: 0,
      remark: "",
      reconciliationStatement: {
        sort: { name: "" },
        furpose: { name: "" }
      },
      BusinessType: [],
      collectPayId: "",
      obj: {},
      accountDisabeld: true, //对账单号是否可选
      //表格校验
      validRules: {
        rpAmt: [{ validator: rpAmtValid }]
      }
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
        isSubject:1,
      });
    });
    bus.$on("content", val => {
      this.obj = val;
    });
    bus.$on("ChildContent", value => {
      value.auxiliaryTypeCode = value.auxiliaryTypeCode == 2?1:value.auxiliaryTypeCode //辅助核算选中哪一个
      if(value.auxiliaryTypeCode=="1" || value.auxiliaryTypeCode=="2" || value.auxiliaryTypeCode=="3" || value.auxiliaryTypeCode=="4"){
        value.isAuxiliaryAccounting=0 //是否辅助核算类
      }else{
        value.isAuxiliaryAccounting=1
      }
      if (value.fullName) {
        this.BusinessType.push({
          serviceTypeName: this.obj.fullName + "-" + value.fullName,
          reconciliationAmt: 0,
          hasAmt: 0,
          unAmt: 0,
          rpAmt: 0,
          unAmtLeft: 0,
          mateAccountName:this.obj.titleName,
          mateAccountCode:this.obj.titleCode,
          auxiliaryTypeCode:value.auxiliaryTypeCode, //辅助核算选中哪一个
          isAuxiliaryAccounting:value.isAuxiliaryAccounting,//是否辅助核算类
          auxiliaryName:value.fullName, //辅助核算名称
          auxiliaryCode:value.code, //辅助核算项目编码
          isSubject:1
        });
      } else if (value.userName) {
        this.BusinessType.push({
          serviceTypeName: this.obj.fullName + "-" + value.userName,
          reconciliationAmt: 0,
          hasAmt: 0,
          unAmt: 0,
          rpAmt: 0,
          unAmtLeft: 0,
          mateAccountName:this.obj.titleName,
          mateAccountCode:this.obj.titleCode,
          auxiliaryTypeCode:value.auxiliaryTypeCode, //辅助核算选中哪一个
          isAuxiliaryAccounting:value.isAuxiliaryAccounting,//是否辅助核算类
          auxiliaryName:value.fullName, //辅助核算名称
          auxiliaryCode:value.code, //辅助核算项目编码
          isSubject:1
        });
      }else if(value.itemName){
        this.BusinessType.push({
          serviceTypeName: this.obj.fullName + "-" + value.itemName,
          reconciliationAmt: 0,
          hasAmt: 0,
          unAmt: 0,
          rpAmt: 0,
          unAmtLeft: 0,
          mateAccountName:this.obj.titleName,
          mateAccountCode:this.obj.titleCode,
          auxiliaryTypeCode:value.auxiliaryTypeCode, //辅助核算选中哪一个
          isAuxiliaryAccounting:value.isAuxiliaryAccounting,//是否辅助核算类
          auxiliaryName:value.fullName, //辅助核算名称
          auxiliaryCode:value.code, //辅助核算项目编码
          isSubject:1
        });
      }
    });
    //收付款信息
    bus.$on("paymentInfo", val => {
      // this.tableData = val;
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
    rpAmtChange(row) {
      let arr=this.$refs.xTable.footerData[0];
      let unAmtSumIdx;
      arr.map((item,index)=>{
        if(item=="合计"){
          return unAmtSumIdx=index+1;
        }
      })
      let sumUnAmt = row.isSubject==1 ? this.$utils.toNumber(arr[unAmtSumIdx]) : row.unAmt
      this.$refs.xTable.updateFooter();
      this.checkComputed();
      if ((sumUnAmt > 0 && row.rpAmt <= 0) || (sumUnAmt < 0 && row.rpAmt >= 0) || (row.isSubject==undefined && Math.abs(row.rpAmt)>Math.abs(row.unClaimedAmt))) {
        return this.$Message.error("金额录入错误，请重新录入！")
      }
    },
    //保存
    async conserve() {
      const errMap = await this.$refs.xTable
        .fullValidate()
        .catch(errMap => errMap);
      if (errMap) return this.$Message.error("表格校验错误");
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
            thisClaimedAmt:el.rpAmt,
            unAmtLeft: el.unAmtLeft,
            mateAccountName:el.mateAccountName,
            mateAccountCode:el.mateAccountCode,
            auxiliaryTypeCode:el.auxiliaryTypeCode, //辅助核算选中哪一个
            isAuxiliaryAccounting:el.isAuxiliaryAccounting,//是否辅助核算类
            auxiliaryName:el.auxiliaryName, //辅助核算名称
            auxiliaryCode:el.auxiliaryCode //辅助核算项目编码
          };
          data.two.push(item);
        });
        if (this.gettlementData.sign == 4) {
          // 预付款核销
          let bool = true;
          let arr=this.$refs.xTable.footerData[0];
          let unAmtSumIdx;
          arr.map((item,index)=>{
            if(item=="合计"){
              return unAmtSumIdx=index+1;
            }
          })
          this.BusinessType.map(row=>{
            let sumUnAmt = row.isSubject==1 ? this.$utils.toNumber(arr[unAmtSumIdx]) : row.unAmt
            if ((sumUnAmt > 0 && row.rpAmt <= 0) || (sumUnAmt < 0 && row.rpAmt >= 0) || (row.isSubject!=1 && Math.abs(row.rpAmt)>Math.abs(row.unClaimedAmt))) {
              this.$Message.error("金额录入错误，请重新录入！")
              bool = false
              return
            }
          })
          if(bool){
            this.conserveDis=true;
            showLoading()
            let res = await api.addAll(data);
            if (res.code == 0) {
              hideLoading()
              this.conserveDis=false;
              this.Settlement = false;
              this.$emit("getNewList", {});
              return this.$message.success("核销成功");
            }else{
              hideLoading()
              this.conserveDis=false;
            }
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
          this.conserveDis=true;
          showLoading()
          let res = await api.addAll(data);
          if (res.code == 0) {
            hideLoading()
            this.conserveDis=false
            this.Settlement = false;
            this.$emit("getNewList", {});
            return this.$message.success("收回认领成功");
          }else{
            hideLoading()
            this.conserveDis=false
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
          this.conserveDis=true;
          showLoading()
          let res = await api.addAll(data);
          if (res.code == 0) {
            hideLoading()
            this.conserveDis=false;
            this.Settlement = false;
            this.$emit("getNewList", {});
            this.$emit("reloadParList")
            return this.$message.success("预付款认领成功");
          }else{
            hideLoading()
            this.conserveDis=false;
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
      row.unAmtLeft = this.$utils.subtract ( row.reconciliationAmt , row.rpAmt)
      row.endAmt = row.rpAmt;
      row.uncollectedAmt =this.$utils.subtract(row.reconciliationAmt , row.rpAmt)
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
        console.log()
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
