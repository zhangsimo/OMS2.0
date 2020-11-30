<template>
  <Modal v-model="Settlement" title="对账单收付款结算" width="1200" @on-visible-change="hander">
    <div class="db">
      <Button class="ivu-btn ivu-btn-default mr10" :loading="conserveDis" v-noresub @click="conserve">保存</Button>
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
          <i class="iconfont iconcaidan input" @click="accountNoClick"></i>
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
          auto-resize
          size="mini"
          show-overflow="title"
          ref="xTable"
          show-footer
          max-height="400"
          align="center"
          :edit-rules="validRules"
          :data="BusinessType"
          :footer-method="offWrite"
          :edit-config="{trigger: 'click', mode: 'cell'}"
          @edit-closed="editClosedEvent"
        >
          <vxe-table-column title="核销信息">
            <vxe-table-column field="guestName" width="120" title="往来单位"></vxe-table-column>
            <vxe-table-column field="businessTypeName" width="80" title="业务类型"></vxe-table-column>
            <vxe-table-column field="reconciliationAmt" width="80" title="对账金额"></vxe-table-column>
            <vxe-table-column field="hasAmt" width="100" title="已收/付金额"></vxe-table-column>
            <vxe-table-column field="unAmt" width="100" title="未收/付金额"></vxe-table-column>
            <vxe-table-column
              field="rpAmt"
              title="本次核销金额"
              width="140"
            >
              <template v-slot="{row}">
                <vxe-input type="number" size="mini" v-model="row.rpAmt" @change="rpAmtChange(row)"></vxe-input>
              </template>
            </vxe-table-column>
            <vxe-table-column field="unAmtLeft" width="120" title="剩余未收/未付"></vxe-table-column>
            <vxe-table-column field="accountNo" width="120" title="对账单号"></vxe-table-column>
            <vxe-table-column field="orgName" width="140" title="门店"></vxe-table-column>
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
          size="mini"
          show-overflow="title"
          auto-resize
          show-footer
          max-height="400"
          ref="xTable2"
          align="center"
          :footer-method="payCollection"
          :data="tableData"
          :edit-config="{trigger: 'click', mode: 'cell'}"
        >
          <vxe-table-column title="收/付款信息">
            <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
            <vxe-table-column field="accountName" width="120" title="收/付款账户"></vxe-table-column>
            <vxe-table-column field="mateAccountName" width="120" title="科目代码"></vxe-table-column>
            <vxe-table-column field="createTime" width="140" title="发生日期"></vxe-table-column>
            <vxe-table-column field="incomeMoney" width="100" title="收入金额"></vxe-table-column>
            <vxe-table-column field="paidMoney" width="100" title="支出金额">
              <template v-slot="{row}">
                {{Math.abs(row.paidMoney)}}
              </template>
            </vxe-table-column>
            <vxe-table-column field="thisClaimedAmt" width="100" title="本次认领金额"></vxe-table-column>
            <vxe-table-column field="orgName" width="120" title="所属门店"></vxe-table-column>
          </vxe-table-column>
        </vxe-table>
      </Col>
    </Row>
    <div slot="footer"></div>
    <accountSelette ref="accountSelette" :accountNo="accountNo" />
    <subjexts ref="subjexts" />
  </Modal>
</template>
<script>
import accountSelette from "./accountWirte";
import {
  wirteAccount,
  saveAccount,
  getHedging
} from "_api/settlementManagement/seleteAccount.js";
import subjexts from "./subjects";
import bus from "../Popup/Bus";
import moment from "moment";
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
      conserveDis:false,//保存点击后等待接口返回后再次点击
      Settlement: false, //弹框显示
      check: 0,
      remark: "",
      reconciliationStatement: { accountNo: 123, receiptPayment: 456 },
      accountNo:"",
      BusinessType: [],
      tableData: [],
      collectPayId: "",
      showchange:false,//控制子组件内部往来单位是否可以查询
      obj: {},
      //表格校验
      validRules: {
        rpAmt: [{ validator: rpAmtValid }]
      }
    };
  },
  mounted() {
    // 对账单号
    bus.$on("accountHedNo", val => {
      this.reconciliationStatement.accountNo =
        this.reconciliationStatement.accountNo + "," + val.accountNo;
      // console.log(val,1111)
      val.two.map(item => {
        item.businessTypeName = item.businessType.name;
      });
      this.BusinessType = [...this.BusinessType, ...val.two];
      this.BusinessType =  this.BusinessType.filter( item => item.reconciliationAmt != 0 )
      this.checkComputed();
    });
    //选择科目
    bus.$on("hedInfo", val => {
      this.BusinessType.push({
        businessTypeName: val.titleName,
        reconciliationAmt: 0,
        mateAccountCode: val.titleCode,
        mateAccountName: val.titleName,
        hasAmt: 0,
        unAmt: 0,
        rpAmt: 0,
        unAmtLeft: 0,
        isSubject:1,//与原本对账单作出区分
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
          businessTypeName: this.obj.fullName + "-" + value.fullName,
          mateAccountCode: this.obj.titleCode,
          mateAccountName: this.obj.titleName,
          reconciliationAmt: 0,
          hasAmt: 0,
          unAmt: 0,
          rpAmt: 0,
          unAmtLeft: 0,
          auxiliaryTypeCode:value.auxiliaryTypeCode, //辅助核算选中哪一个
          isAuxiliaryAccounting:value.isAuxiliaryAccounting,//是否辅助核算类
          auxiliaryName:value.fullName, //辅助核算名称
          auxiliaryCode:value.code ,//辅助核算项目编码
          isSubject:1,//与原本对账单作出区分
        });
      } else if (value.userName) {
        this.BusinessType.push({
          businessTypeName: this.obj.fullName + "-" + value.userName,
          mateAccountCode: this.obj.titleCode,
          mateAccountName: this.obj.titleName,
          reconciliationAmt: 0,
          hasAmt: 0,
          unAmt: 0,
          rpAmt: 0,
          unAmtLeft: 0,
          auxiliaryTypeCode:value.auxiliaryTypeCode, //辅助核算选中哪一个
          isAuxiliaryAccounting:value.isAuxiliaryAccounting,//是否辅助核算类
          auxiliaryName:value.userName, //辅助核算名称
          auxiliaryCode:value.code, //辅助核算项目编码
          isSubject:1,//与原本对账单作出区分
        });
      }else if(value.itemName){
        this.BusinessType.push({
          businessTypeName: this.obj.fullName + "-" + value.itemName,
          mateAccountCode: this.obj.titleCode,
          mateAccountName: this.obj.titleName,
          reconciliationAmt: 0,
          hasAmt: 0,
          unAmt: 0,
          rpAmt: 0,
          unAmtLeft: 0,
          auxiliaryTypeCode:value.auxiliaryTypeCode, //辅助核算选中哪一个
          isAuxiliaryAccounting:value.isAuxiliaryAccounting,//是否辅助核算类
          auxiliaryName:value.itemName, //辅助核算名称
          auxiliaryCode:value.code, //辅助核算项目编码
          isSubject:1,//与原本对账单作出区分
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
      // this.tableData = val;
    });
  },
  methods: {
    setData(d){
      // this.tableData = d;
    },
    // 选择科目弹框
    subject() {
      this.$refs.subjexts.subjectModelShow = true;
    },
    // 对账单号选择
    accountNoClick() {
      this.$refs.accountSelette.isCanChange = this.showchange
      this.$refs.accountSelette.modal1 = true;
      if(this.$parent.paymentId == "DYD" && [","].includes(this.reconciliationStatement.accountNo)){
        this.accountNo=this.reconciliationStatement.accountNo;
      }else{
        this.accountNo=this.reconciliationStatement.accountNo.split(",")[this.reconciliationStatement.accountNo.split(",").length-1]
      }
      switch (this.$parent.paymentId) {
        case "YSK":
          this.$refs.accountSelette.paymentId = "YJDZ";
          this.$refs.accountSelette.sort = "SK";
          break;
        case "DYD":
          this.$refs.accountSelette.paymentId = "YJDZ";
          break;
        case "YS":
          this.$refs.accountSelette.paymentId = "YSK";
          break;
        case "YF":
          this.$refs.accountSelette.paymentId = "YFK";
          break;
        default :
          this.$refs.accountSelette.paymentId = "YJDZ";
          break;
      }
    },
    //弹框打开
    hander(type) {
      this.$refs.xTable.recalculate(true)
      this.$refs.xTable2.recalculate(true)
      if (!type) {
        this.check = 0;
        this.remark = "";
        this.reconciliationStatement = {};
        this.BusinessType = [];
        this.tableData = [];
        this.collectPayId = "";
        if (this.$parent.paymentId === "YSKZC") {
          this.$parent.claimModal = false;
        }
      } else {
        if(this.$route.name=="accountStatement"){
          this.tableData = [];
        }
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
        } else if (this.$parent.type === 3) {
          sign = 9;
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
            res.data.two.map(item => {
              item.businessTypeName = item.businessType.name;
            });
            this.BusinessType = res.data.two;
            this.BusinessType =  this.BusinessType.filter( item => item.reconciliationAmt != 0 )
            this.checkComputed();
          }
        });
      }
    },


    //清除表单内容
    handleReset () {
      this.remark = ""
      this.reconciliationStatement = {}
      this.BusinessType = []
      this.tableData = []
      this.collectPayId = ""
    },
    //本次核销金额输入
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
      if (!Number(this.check)) {
        const errMap = await this.$refs.xTable
          .fullValidate()
          .catch(errMap => errMap);
        if (errMap) return this.$Message.error("表格校验错误");
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
          let obj = {
            one: this.reconciliationStatement,
            two: this.BusinessType,
            // three: this.tableData
          };
          this.conserveDis=true;
          saveAccount(obj).then(res => {
            if (res.code === 0) {
              this.$message.success("保存成功");
              if(this.$parent.paymentId=="DYD"){
                this.$Modal.confirm({
                  title: '提示',
                  content: '<p>是否同时发起发票对冲申请</p>',
                  onOk: async () => {
                    let res = await getHedging(obj)
                    if (res.code === 0){
                      this.$message.success("发票对冲申请单");
                      this.$emit('getNewList')
                    }
                    this.conserveDis=false;
                    this.Settlement = false;
                    this.handleReset()
                  },
                  onCancel: () => {
                    this.conserveDis=false;
                    this.Settlement = false;
                    this.handleReset()
                    this.$message.success("对账单对冲成功");
                  }
                });
              }else{
                this.conserveDis=false;
                this.Settlement = false;
                this.handleReset()
                this.$message.success("对账单对冲成功");
              }
            }else{
              this.conserveDis=false;
            }
          })
        }
      } else {
        this.$message.error("核对金额为0才能保存");
      }
    },
    // 核销单元格编辑状态下被关闭时
    editClosedEvent({ row, rowIndex }) {
      row.unAmtLeft = this.$utils.subtract(row.unAmt, row.rpAmt).toFixed(2);
      // row.unAmtLeft = row.unAmt ? (row.unAmt * 1 - row.rpAmt ? row.rpAmt * 1 : 0).toFixed(2) : 0;
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
            if(["paidMoney"].includes(column.property)){
              return Math.abs(this.$utils.sum(data, column.property)).toFixed(2);
            }
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
        sum1 += (item.rpAmt ? this.$utils.toNumber(item.rpAmt * 1) : 0);
      });
      this.tableData.map(item => {
        sum2 += item.incomeMoney ? item.incomeMoney * 1 : 0;
        sum3 += item.paidMoney ? item.paidMoney * 1 : 0;
      });
      //this.check = (sum1 - sum2 - sum3).toFixed(2);
      this.check = (Math.abs(sum1) - Math.abs(sum3)).toFixed(2);
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
