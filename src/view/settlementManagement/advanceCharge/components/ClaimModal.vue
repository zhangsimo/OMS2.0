<template>
  <div>
    <Modal class="claim" :title="titleName" width="1000" v-model="visibal">
      <div class="flex-jb mb20">
        <Button class="fl" @click="openPClaimModal">选择单据</Button>
      </div>

      <vxe-table
        border
        show-footer
        highlight-hover-row
        highlight-current-row
        @current-change="selectRow"
        show-overflow="title"
        :auto-resize="true"
        :edit-rules="validRules"
        size="mini"
        align="center"
        ref="xTree"
        :data="tableData"
        :footer-method="addFooter"
        :edit-config="{trigger: 'click', mode: 'cell', showStatus: true}"
      >
        <vxe-table-column title="操作" show-overflow="tooltip">
          <template v-slot="{ row }">
            <Button type="text" @click="deleteItem(row)">删除</Button>
          </template>
        </vxe-table-column>
        <vxe-table-column title="发生日期" width="80" field="createTime" show-overflow="tooltip"></vxe-table-column>
        <vxe-table-column title="账户" width="100" field="accountName" show-overflow="tooltip"></vxe-table-column>
        <vxe-table-column title="支出金额" width="100" field="paidMoney" show-overflow="tooltip"></vxe-table-column>
        <vxe-table-column title="收入金额" width="100" field="incomeMoney" show-overflow="tooltip"></vxe-table-column>
        <vxe-table-column
          title="本次认领金额"
          width="120"
          field="thisClaimedAmt"
          show-overflow="tooltip"
          :edit-render="{ name: 'input' }"
        >
          <template v-slot:edit="{ row }">
            <el-input-number
              :min="0"
              @change="changeNum"
              v-model="row.thisClaimedAmt"
              :controls="false"
              :precision="2"
              size="mini"
            />
          </template>
        </vxe-table-column>
        <vxe-table-column title="已认领金额" width="100" field="claimedAmt" show-overflow="tooltip"></vxe-table-column>
        <vxe-table-column title="未认领金额" width="100" field="unClaimedAmt" show-overflow="tooltip"></vxe-table-column>
        <vxe-table-column title="智能匹配往来单位" width="180" field="suppliers" show-overflow="tooltip"></vxe-table-column>
      </vxe-table>
      <div class="mt10">
        <span class="mr10">备注:</span>
        <Input v-model.trim="remark" type="text" show-word-limit maxlength="500" style="width: 925px;" />
      </div>
      <div slot="footer">
        <Button type="primary" @click="confirm">确定</Button>
        <Button @click="close">取消</Button>
      </div>
    </Modal>
    <PreClaimModal ref="PClaimModal"></PreClaimModal>
  </div>
</template>

<script>
  import PreClaimModal from "./PreClaimModal";
  import {addClaim} from "_api/settlementManagement/advanceCollection.js";
  import {saveAccount} from "_api/settlementManagement/seleteAccount";
  import {wirteAccount} from "_api/settlementManagement/seleteAccount";

  export default {
    components: {
      PreClaimModal
    },
    props: ['titleName'],
    data() {
      return {
        visibal: false,
        calculation: '', //选中辅助计算的名称
        tableData: [],
        outFlag: false,
        type: this.amountType,
        remark:"",
        financeAccountCashList: [], //选中待认领的数组
        currentRow: {}, // 报销认领弹框中选中的行
        validRules: {
          thisClaimedAmt: [
            {required: true, message: '请输入认领金额'},
            {type: 'number', message: '请输入数字'}
          ]
        },
        thisClaimedAmtSum:0,//预付款认领 本次认领金额 合计  this.$parent.currRow.expenditureAmt
        dataOne: [],//预收款支出认领 one 对账单
        dataTwo: [],//会计科目
        dataThree: [],//数组
        accruedList: [{mateAccountCoding: ""}],
        voucherItem: {}, //获取辅助计算选中的数据
      }
    },
    computed: {},
    methods: {

      // 弹框底部的合计
      addFooter({columns, data}) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return '合计'
            }
            if (['thisClaimedAmt'].includes(column.property)) {
              this.thisClaimedAmtSum=this.sum(data, column.property, columnIndex);
              return this.sum(data, column.property, columnIndex)
            }
            return null
          })
        ]
      },
      sum(data, type, columnIndex) {
        let total = 0
        data.map(item => {
          let value = item[type]
          if (!value || isNaN(value)) {
            value = 0
          }
          total += parseFloat(value)
        })
        return total.toFixed(2)
      },

      //弹框打开
      open() {
        this.tableData = []
        this.remark="";
        this.visibal = true;
        setTimeout(()=>{
          let params={
            accountNo: this.$parent.serviceId,
            sign:this.titleName == '预付款认领'?9:5
          }
          wirteAccount(params).then(res => {
            if (res.code === 0) {
              // this.dataOne=
              res.data.one.furposeName = res.data.one.furpose.name;
              res.data.one.sortName = res.data.one.sort.name;
              this.dataOne = res.data.one;
              res.data.two.map(item => {
                item.businessTypeName = item.businessType.name;
              });
              this.dataTwo = res.data.two;
            }
          })
        },10)
      },

      //弹框关闭
      close() {
        this.visibal = false
      },

      //点击确认按钮后
      confirm() {
        if (this.tableData.length === 0) {
          this.$message.error('请点击选择单据按钮，选择数据')
          return
        }
        let flag1 = this.tableData.some(v => {
          return v.thisClaimedAmt < 0 || v.thisClaimedAmt > v.unClaimedAmt
        })
        if (flag1) {
          this.$message.error("本次认领金额录入错误，请重新输入")
          return
        }
        let flag = this.tableData.some(v => {
          return v.thisClaimedAmt === undefined || v.thisClaimedAmt === null || v.thisClaimedAmt == 0
        })
        if (flag) {
          this.$message.error('认领金额输入错误，不可为空')
          return
        }
        if(this.titleName=="预付款认领" && (this.thisClaimedAmtSum>this.$parent.currRow.payAmt)){
          return this.$Message.error("本次认领金额不可大于本次申请金额")
        }
        if(this.titleName=="预付款收回认领" && (this.thisClaimedAmtSum>this.$parent.currRow.claimAmt)){
          return this.$Message.error("本次认领金额不可大于本次已认领金额")
        }
        if(this.remark){
          if(this.remark.length > 500){
            return this.$message.error('备注500字符以内')
          }
        }
        this.financeAccountCashList = []
        this.tableData.forEach(v => {
          let o = {}
          o.id = v.id
          o.thisClaimedAmt = v.thisClaimedAmt + ''
          this.financeAccountCashList.push(o)
        })
        let arr = [];
        this.tableData.map(el => {
          let data = {};
          data.id = el.id;
          data.thisClaimedAmt = el.thisClaimedAmt;
          arr.push(data)
        })
        let data = {
          one: this.dataOne,
          two: this.dataTwo,
          three: arr
        }
        data.one.remark=this.remark;
        saveAccount(data).then(res => {
          if (res.code === 0) {
            this.$message.success("认领成功")
            this.visibal = false
            this.$parent.getQuery()
          }
        })

      },

      // 删除表格数据
      deleteItem(row) {
        this.tableData = this.tableData.filter(item => item.id !== row.id)
      },

      selectRow({row}) {
        this.currentRow = row
      },

      // 打开认领款弹窗
      openPClaimModal() {
        this.$refs.PClaimModal.open()
      },

      // 选择辅助计算弹框
      chooseAuxiliary() {
        this.$refs.voucherInput.subjectModelShowassist = true
      },

      // 选中的数据拼接去重
      setSelectData(list) {
        let arr = this.tableData.concat(list)
        const result = new Map()
        let arr1 = arr.filter(item => !result.has(item.id) && result.set(item.id, 1))
        this.tableData = arr1
      },

      // 改变认领款值触发
      changeNum(newVal, oldVal) {
        if (newVal === undefined || newVal === null) {
          this.$message.error('本次认领金额录入不可为空')
        }
        if (newVal < 0 || newVal > this.currentRow.unClaimedAmt) {
          this.$message.error('本次认领金额录入错误，请重新输入')
        }
      },
      // validate(num){
      //   let reg = /^\d+(?=\.{0,1}\d+$|$)/
      //     if(reg.test(num)) return true
      //     return false
      // }
      getCallBack() {
        this.getMessage();
      },
      getMessage() {
        this.calculation = this.$refs.voucherInput.AssistAccounting;
        this.voucherItem = this.$refs.voucherInput.voucherItem
      },
    },
  }
</script>

<style lang="less" scoped>

  .el-input-number {
    width: 100px;
  }
  .flex-jb{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
