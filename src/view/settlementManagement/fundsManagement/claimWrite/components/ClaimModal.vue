<template>
  <div>
    <Modal class="claim" title="转当期损益" width="1000" v-model="visibal">
      <div class="clearfix mb20">
        <div class="fr">
          <span style="color: red" class="mr5">*</span>
          <span>选择会计科目：</span>
          <Input class="w180 mr10" readonly v-model="calculation"/>
          <Button @click="chooseSubject">选择</Button>
        </div>
      </div>

      <vxe-table
        border
        highlight-hover-row
        highlight-current-row
        show-overflow="title"
        :auto-resize="true"
        :edit-rules="validRules"
        size="mini"
        align="center"
        ref="xTree"
        :data="tableData"
        :edit-config="{trigger: 'click', mode: 'cell', showStatus: true}"
      > 
        <vxe-table-column
          title="所属店号" width="80" field="shopCode"  show-overflow="tooltip">
        </vxe-table-column>
        <vxe-table-column
          title="发生日期" width="80" field="createTime"  show-overflow="tooltip">
        </vxe-table-column>
        <vxe-table-column
          title="业务类别" width="80" field="businessType"  show-overflow="tooltip">
        </vxe-table-column>
        <vxe-table-column 
          title="收入金额" width="100" field="incomeMoney" show-overflow="tooltip">
        </vxe-table-column>
        <vxe-table-column 
          title="支出金额" width="100" field="paidMoney" show-overflow="tooltip">
        </vxe-table-column>
        <vxe-table-column 
          title="未认领金额" width="100" field="unClaimedAmt" show-overflow="tooltip">
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
        <vxe-table-column 
          title="对方户名" width="100" field="reciprocalAccountName" show-overflow="tooltip">
        </vxe-table-column>
        <vxe-table-column
          title="交易备注" field="tradingNote" show-overflow="tooltip">
        </vxe-table-column>
      </vxe-table>
      <Row class="mt10">
        <i-col span="1">
          <span style="line-height: 30px">备注:</span>
        </i-col>
        <i-col span="23">
          <i-input :value.sync="remark" maxlength="500" v-model.trim="remark"></i-input>
        </i-col>
      </Row>
      <div slot="footer">
        <Button type="primary" :disabled="isDis" @click="confirm">确定</Button>
        <Button @click="close">取消</Button>
      </div>
    </Modal>

    <voucherInput ref="voucherInput" :oneAccountent="accruedList" @callBackFun="getCallBack" :assistTypeCode="assistTypeCode"></voucherInput>
    <subject ref="subject" @ChildContent="ChildContent"/>
  </div>
</template>

<script>
import voucherInput from "./components/voucherInput";
import subject from "@/view/settlementManagement/otherPayable/components/components/subjects"
import bus from "@/view/settlementManagement/bill/Popup/Bus"
export default {
  components: {
    voucherInput,
    subject,
  },
  props: ['titleName','amountType'],
  data(){
    return {
      isDis: false,
      remark: '',
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
    bus.$on("ChildContent", val => {    //获取辅助核算选择的对象
      console.log(val,'辅助核算')
    })
  },
  methods: {
    
    //弹框打开
    open(){
      this.voucherItem = {} //打开时清空上次选中的辅助核算数据
      this.calculation = '' //打开时清空上次辅助核算名称
      this.visibal = true
      this.remark = ''
      this.fund = ''
      if(this.titleName=='其他付款支出认领'){
        // wirteAccount({accountNo:this.$parent.serviceId,sign:11,id:this.$parent.currRow.id}).then(res=>{
        //   if(res.code===0){
        //     res.data.one.furposeName = res.data.one.furpose.name;
        //     res.data.one.sortName = res.data.one.sort.name;
        //     this.dataOne = res.data.one;
        //     res.data.two.map(item => {
        //       item.businessTypeName = item.businessType.name;
        //       return item
        //     });
        //     this.dataTwo = res.data.two;
        //   }
        // })
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
      if(this.calculation==""){
        this.$Message.error('请选择辅助核算')
        return
      }
      this.financeAccountCashList = []
      this.tableData.forEach(v => {
        let o = {}
        o.id = v.id
        o.thisClaimedAmt = v.thisClaimedAmt + ''
        this.financeAccountCashList.push(o)
      })
      if(this.remark){
        if(this.remark.length > 500){
          return this.$message.error('备注500字符以内')
        }
      }
      

    },

    chooseSubject(){
      this.$refs.subject.subjectModelShow = true
    },

    // 选择辅助计算弹框
    chooseAuxiliary(){
      this.$refs.voucherInput.subjectModelShowassist = true;
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
    ChildContent(val){    //获取会计科目获取的对象
      console.log(val,'会计科目')
    },
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
