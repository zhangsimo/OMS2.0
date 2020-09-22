<template>
  <div>
    <Modal class="claim" :title="titleName" width="1000" v-model="visibal">
      <div class="clearfix mb20">
        <Button class="fl" @click="openPClaimModal">选择单据</Button>
        <!-- <div class="fr" v-if="this.$route.name !== 'settlementManagementExpensereimbursement'">
          <span style="color: red" class="mr5">*</span>
          <span>选择辅助核算：</span>
          <Input class="w180 mr10" v-model="calculation"/>
          <Button @click="chooseAuxiliary">辅助计算</Button>
        </div> -->
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
        <vxe-table-column
          title="发生日期" width="80" field="createTime"  show-overflow="tooltip">
        </vxe-table-column>
        <vxe-table-column title="账户" width="100" field="accountName" show-overflow="tooltip">

        </vxe-table-column>
        <vxe-table-column title="支出金额" width="100" field="paidMoney" show-overflow="tooltip">

        </vxe-table-column>
        <vxe-table-column title="收入金额" width="100" field="incomeMoney" show-overflow="tooltip">

        </vxe-table-column>
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
              size="mini"
            />
          </template>
        </vxe-table-column>
        <vxe-table-column title="已认领金额" width="100" field="claimedAmt" show-overflow="tooltip">

        </vxe-table-column>
        <vxe-table-column title="未认领金额" width="100" field="unClaimedAmt" show-overflow="tooltip">

        </vxe-table-column>
        <vxe-table-column title="智能匹配往来单位" width="180" field="suppliers" show-overflow="tooltip">

        </vxe-table-column>
      </vxe-table>

      <div slot="footer">
        <Button type="primary" @click="confirm">确定</Button>
        <Button @click="close">取消</Button>
      </div>
    </Modal>
    <PreClaimModal ref="PClaimModal"></PreClaimModal>
    <voucherInput ref="voucherInput"></voucherInput>
  </div>
</template>

<script>
import PreClaimModal from "./PreClaimModal"
import voucherInput from "@/view/settlementManagement/fundsManagement/claimWrite/components/components/voucherInput";
import { addClaim } from "_api/settlementManagement/businessBorrowing";

export default {
  components: {
    PreClaimModal,
    voucherInput,
  },
  props: ['titleName','amountType'],
  data(){
    return {
      visibal: false,
      calculation: '',
      tableData: [],
      outFlag: false,
      type: this.amountType,
      financeAccountCashList: [], //选中待认领的数组
      currentRow: {}, // 报销认领弹框中选中的行
      validRules: {
        thisClaimedAmt: [
          { required: true, message: '请输入认领金额' },
          { type: 'number', message: '请输入数字' }
        ]
      }
    }
  },
  computed: {

  },
  methods: {

    // 弹框底部的合计
    addFooter({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['thisClaimedAmt'].includes(column.property)) {
            return this.sum(data, column.property, columnIndex)
          }
          return null
        })
      ]
    },
    sum(data, type, columnIndex){
      let total = 0
      data.map(item => {
        let value = item[type]
        if(!value || isNaN(value)){
          value = 0
        }
        total += parseFloat(value)
      })
      return total
    },

    //弹框打开
    open(){
      this.tableData = []
      this.visibal = true
    },

    //弹框关闭
    close(){
      this.visibal = false
    },
    
    //点击确认按钮后
    confirm(){
      if(this.tableData.length === 0){
        this.$message.error('请点击选择单据按钮，选择数据')
        return
      }
      // this.$refs.xTree.validate((err) => {
      //   if(err){
      //     this.$message.error('待认领金额输入不正确')
      //   }else{
      //     this.$message.success('认领成功')
      //   }
      // })
      if(this.$parent.condition == 1){
        let flag1 = this.tableData.some(v => {
          return v.thisClaimedAmt < 0 || v.thisClaimedAmt > v.paidMoney
        })
        if(flag1){
          this.$message.error('认领金额超出范围')
          return
        }
      }else{
        let flag2 = this.tableData.some(v => {
          return v.thisClaimedAmt < 0 || v.thisClaimedAmt > v.incomeMoney
        })
        if(flag2){
          this.$message.error('认领金额超出范围')
          return
        }
      }
      let flag = this.tableData.some(v => {
        return v.thisClaimedAmt === undefined || v.thisClaimedAmt === null || v.thisClaimedAmt == 0 
      })
      if(flag){
        this.$message.error('认领金额输入错误，不可为空')
        return
      }
      
      
      this.financeAccountCashList = []
      this.tableData.forEach(v => {
        let o = {}
        o.id = v.id
        o.thisClaimedAmt = v.thisClaimedAmt + ''
        this.financeAccountCashList.push(o)
      })
      let obj = {
        financeAccountCashList: this.financeAccountCashList,
        loanId:this.$parent.loanId,
        claimType: this.$parent.claimType
      }
      addClaim(obj).then(res => {
        if(res.code === 0){
          this.$message.success('认领成功')
          this.visibal = false
          this.$parent.getQuery()
        }
      })

    },

    deleteItem(row){
      this.tableData = this.tableData.filter(item => item.id !== row.id)
    },

    selectRow({row}){
      this.currentRow = row
    },

    openPClaimModal(){
      this.$refs.PClaimModal.open()
    },

    // 选择辅助计算弹框
    chooseAuxiliary(){
      this.$refs.voucherInput.subjectModelShowassist = true
    },

    setSelectData(list){
      let arr = this.tableData.concat(list)
      const result = new Map()
      let arr1 = arr.filter(item => !result.has(item.id) && result.set(item.id, 1))   
      this.tableData = arr1
    },

    changeNum(newVal,oldVal){
      // console.log(newVal)
      // if(newVal === undefined || newVal === null){
      //   this.$message.error('本次认领金额录入不可为空')
      // }
      // if(0 < newVal <= this.currentRow.incomeMoney || 0 < newVal <= this.currentRow.paidMoney) {
      //   this.$message.error('本次认领金额录入错误，请重新输入')
      // }
    },
    validate(num){
      let reg = /^\d+(?=\.{0,1}\d+$|$)/
        if(reg.test(num)) return true
        return false
    }
  },
}
</script>

<style lang="less" scoped>

.el-input-number{
  width: 100px;
}
// /deep/.vxe-table--header{
//   width: 968px !important;
// }

// /deep/.vxe-table--body{
//   width: 968px !important;
// }

</style>