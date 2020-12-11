<template>
  <div>
    <Modal class="claim" :title="titleName" width="1000" v-model="visibal">
      <div class="clearfix mb20">
        <Button class="fl" @click="openPClaimModal">选择单据</Button>
        <div class="fr" v-show="titleName!='其他付款支出认领'">
          <span style="color: red" class="mr5">*</span>
          <span>选择辅助核算：</span>
          <Input class="w180 mr10" readonly v-model="calculation"/>
          <Button @click="chooseAuxiliary">辅助计算</Button>
        </div>
        <div class="fr" v-show="titleName=='其他付款支出认领'">
          <span><i style="color: red" class="mr5">*</i>款项分类：</span>
          <Select v-model="fund" placeholder="请选择" class="w200" clearable>
            <Option
              v-for="item in fundList"
              :value="item.itemName"
              :key="item.id"
            >{{ item.itemName }}</Option>
          </Select>
        </div>
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
              :precision="2"
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
    <voucherInput ref="voucherInput" :oneAccountent="accruedList" @callBackFun="getCallBack" :assistTypeCode="assistTypeCode"></voucherInput>
  </div>
</template>

<script>
import PreClaimModal from "./PreClaimModal"
import voucherInput from "./components/auxiliary";
import { addClaim ,expenditureClaim} from "_api/settlementManagement/otherPayable/otherPayable";
import {saveAccount} from "../../../../api/settlementManagement/seleteAccount";
import {wirteAccount} from "../../../../api/settlementManagement/seleteAccount";
import {kmType} from "@/api/settlementManagement/VoucherInput";

export default {
  components: {
    PreClaimModal,
    voucherInput,
  },
  props: ['titleName','amountType'],
  data(){
    return {
      visibal: false,
      calculation: '', //选中辅助计算的名称
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
      },
      fund:"",
      fundList:[],//款项分类数组
      thisClaimedAmtSum:0,//其他付款支出认领 本次认领金额 合计  this.$parent.currRow.expenditureAmt
      dataOne:[],//其他付款支出认领 one 对账单
      dataTwo:[],//会计科目
      dataThree:[],//数组
      accruedList:[{mateAccountCoding:""}],
      voucherItem:{}, //获取辅助计算选中的数据
      assistTypeCode: '4',
    }
  },
  computed: {

  },
  mounted() {
    if(this.fundList.length<1){
      this.fundGetList();
    }
  },
  methods: {
    fundGetList() {
      let params = {};
      params.dictCode = "CW00131";
      kmType(params).then(res => {
        this.fundList = res.data.filter(vb=>['2241'].includes(vb.itemValueOne))
      });
    },
    // 弹框底部的合计
    addFooter({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['thisClaimedAmt'].includes(column.property)) {
            this.titleName=='其他付款支出认领'?this.thisClaimedAmtSum=this.sum(data, column.property, columnIndex):0
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
      return total.toFixed(2)
    },

    //弹框打开
    open(){
      this.tableData = []
      this.voucherItem = {} //打开时清空上次选中的辅助核算数据
      this.calculation = '' //打开时清空上次辅助核算名称
      this.visibal = true
      if(this.titleName.trim()=='其他付款支出认领'){
        wirteAccount({accountNo:this.$parent.serviceId,sign:11,id:this.$parent.currRow.id}).then(res=>{
          if(res.code===0){
            // console.log(res.data)
            res.data.one.furposeName = res.data.one.furpose.name;
            res.data.one.sortName = res.data.one.sort.name;
            this.dataOne = res.data.one;
            res.data.two.map(item => {
              item.businessTypeName = item.businessType.name;
            });
            this.dataTwo = res.data.two;
          }
        })
      }else{
        this.accruedList[0].mateAccountCoding = "2241"
        this.$refs.voucherInput.Classification = true;
      }
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
      let flag1 = this.tableData.some(v => {
        return v.thisClaimedAmt < 0 || v.thisClaimedAmt > v.unClaimedAmt
      })
      if(flag1) {
        this.$message.error("本次认领金额录入错误，请重新输入")
        return
      }
      let flag = this.tableData.some(v => {
        return v.thisClaimedAmt === undefined || v.thisClaimedAmt === null || v.thisClaimedAmt == 0
      })
      if(flag){
        this.$Message.error('认领金额输入错误，不可为空')
        return
      }

      if(this.titleName!='其他付款支出认领' && this.calculation==""){
        this.$Message.error('请选择辅助核算')
        return
      }
      if(this.titleName=="其他付款支出认领" && (this.thisClaimedAmtSum>this.$parent.currRow.paymentApplicationAmount)){
        return this.$Message.error("本次认领金额不可大于本次支出申请金额")
      }
      this.financeAccountCashList = []
      this.tableData.forEach(v => {
        let o = {}
        o.id = v.id
        o.thisClaimedAmt = v.thisClaimedAmt + ''
        this.financeAccountCashList.push(o)
      })
      if(this.titleName=='其他收款认领'){
        let obj = {
          financeAccountCashList: this.financeAccountCashList,
          claimType: 0,
          guestId: this.voucherItem.id,
          paymentTypeCode:  this.$refs.voucherInput.formDynamic.fund || ""
        }
        addClaim(obj).then(res => {
          if(res.code === 0){
            this.$message.success('认领成功')
            this.visibal = false
            this.$parent.getQuery()
          }
        })
      }else if(this.titleName=='其他付款支出认领'){
        let arr=[];
        this.tableData.map(el=>{
          let data={};
          data.id=el.id;
          data.thisClaimedAmt=el.thisClaimedAmt;
          arr.push(data)
        })
        let data={
          one:this.dataOne,
          two:this.dataTwo,
          three:arr,
          paymentTypeCode:this.fund
        }
        expenditureClaim(data).then(res=>{
          if(res.code===0){
            this.$message.success("认领成功")
            this.visibal = false
            this.$parent.getQuery()
          }
        })
      }

    },

    // 删除表格数据
    deleteItem(row){
      this.tableData = this.tableData.filter(item => item.id !== row.id)
    },

    selectRow({row}){
      this.currentRow = row
    },

    // 打开认领款弹窗
    openPClaimModal(){
      this.$refs.PClaimModal.open()
    },

    // 选择辅助计算弹框
    chooseAuxiliary(){
      this.$refs.voucherInput.subjectModelShowassist = true;
    },

    // 选中的数据拼接去重
    setSelectData(list){
      let arr = this.tableData.concat(list)
      const result = new Map()
      let arr1 = arr.filter(item => !result.has(item.id) && result.set(item.id, 1))
      this.tableData = arr1
    },

    // 改变认领款值触发
    changeNum(newVal,oldVal){
      if(newVal === undefined || newVal === null){
        this.$message.error('本次认领金额录入不可为空')
      }
      if( newVal < 0 || newVal > this.currentRow.unClaimedAmt) {
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
      this.calculation = this.$refs.voucherInput.AssistAccounting.fullName || this.$refs.voucherInput.AssistAccounting.itemName || this.$refs.voucherInput.AssistAccounting.userName || this.$refs.voucherInput.AssistAccounting[0].name;
      this.voucherItem = this.$refs.voucherInput.AssistAccounting
    },
  },
}
</script>

<style lang="less" scoped>

.el-input-number{
  width: 100px;
}

</style>
