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

    <voucherInput ref="voucherInput" :oneAccountent="accruedList" :assistTypeCode="assistTypeCode"></voucherInput>
    <subject ref="subject" @ChildContent="getSubjectList" />
  </div>
</template>

<script>
import voucherInput from "./components/voucherInput";
import subject from "@/view/settlementManagement/otherPayable/components/components/subjects"
import bus from "@/view/settlementManagement/bill/Popup/Bus"
import { TurnToTheProfitAndLoss } from "_api/settlementManagement/fundsManagement/claimWrite.js";
import {showLoading, hideLoading} from "@/utils/loading"
export default {
  components: {
    voucherInput,
    subject,
  },
  props: ['amountType'],
  data(){
    return {
      isDis: false,
      remark: '',
      visibal: false,
      calculation: '', //选中会计科目的名称
      tableData: [],
      outFlag: false,
      type: this.amountType,
      currentRow: {}, // 报销认领弹框中选中的行
      validRules: {
        thisClaimedAmt: [
          { required: true, message: '请输入认领金额' },
          { type: 'number', message: '请输入数字' }
        ]
      },
      thisClaimedAmtSum:0,//其他付款支出认领 本次认领金额 合计  this.$parent.currRow.expenditureAmt
      dataOne:[],//其他付款支出认领 one 对账单
      dataTwo:[],//会计科目
      dataThree:[],//数组
      accruedList:[{mateAccountCoding:""}],
      voucherItem:{}, //获取辅助计算选中的数据
      assistTypeCode: '4',
      subjectObj: {}, //获取到的会计科目对象
      auxiliaryObj: {},  //获取到的辅助核算对象
    }
  },
  computed: {

  },
  mounted() {
    bus.$on("ChildContent", val => {    //获取辅助核算选择的对象
      this.auxiliaryObj = val
    })
    bus.$on('hedInfo', val =>{  //获取会计科目选择的对象
      this.subjectObj = val
      this.calculation  = val.titleName
    })
  },
  methods: {
    getSubjectList(val){
      this.subjectObj = val
      this.calculation  = val.titleName
    },
    //弹框打开
    open(){
      this.voucherItem = {} //打开时清空上次选中的辅助核算数据
      this.calculation = '' //打开时清空上次辅助核算名称
      this.subjectObj = {}
      this.auxiliaryObj = {}
      this.visibal = true
      this.remark = ''
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
        this.accruedList[0].mateAccountCoding = "2241"
        this.$refs.voucherInput.Classification = true;
    },

    //弹框关闭
    close(){
      this.visibal = false
    },

    //点击确认按钮后
    async confirm(){
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
        this.$Message.error('请选择会计科目')
        return
      }
      if(this.remark){
        if(this.remark.length > 500){
          return this.$message.error('备注500字符以内')
        }
      }
      let data = {
        detailId: this.tableData[0].id,
        subjectName :  this.subjectObj.titleName,
        subjectCode :  this.subjectObj.titleCode,
        subjectId :  this.subjectObj.id,
        claimType: 8,
        claimMoney: this.tableData[0].thisClaimedAmt,
        remark: this.remark
      }
      console.log(this.auxiliaryObj)
      if(Object.keys(this.auxiliaryObj).length != 0){
        data.auxiliaryTypeCode = this.auxiliaryObj.auxiliaryTypeCode == 2?1:this.auxiliaryObj.auxiliaryTypeCode //辅助核算选中哪一个
        if(data.auxiliaryTypeCode=="1" || data.auxiliaryTypeCode=="2" || data.auxiliaryTypeCode=="3" || data.auxiliaryTypeCode=="4"){
          data.isAuxiliaryAccounting=0 //是否辅助核算类
        }else{
          data.isAuxiliaryAccounting=1
        }
        if(this.auxiliaryObj.auxiliaryTypeCode === '3'){
          data.auxiliaryName=this.auxiliaryObj.fullName //辅助核算名称
          data.auxiliaryCode=this.auxiliaryObj.code //辅助核算项目编码
        }else{
          data.auxiliaryName=this.auxiliaryObj.auxiliaryName //辅助核算名称
          data.auxiliaryCode=this.auxiliaryObj.auxiliaryCode //辅助核算项目编码
        }
        data.paymentTypeName = this.auxiliaryObj.paymentName
        data.paymentTypeCode = this.auxiliaryObj.paymentCode
        if(this.auxiliaryObj.hasOwnProperty("id")){
          data.suppliersBean = {
            guestSourceName:this.auxiliaryObj.fullName||"",
            guestSourceId:this.auxiliaryObj.id||""
          }
        }else {
          // this.$refs.voucherInput.subjectModelShowassist = true;
          // setTimeout(() =>{
          //   this.$Message.warning("请选择辅助核算");
          // },500)
          // return;
        }
      }
      try {
        showLoading('body',"保存中，请勿操作。。。")
        let res = await TurnToTheProfitAndLoss(data);
        if (res.code === 0) {
          this.visibal = false;
          hideLoading()
          this.$Message.success("转益成功");
          //刷新本店待认领款 列表
          this.$parent.queryClaimed()
        }else{
          hideLoading()
        }
      } catch (error) {
        hideLoading()
      }
      
      

    },
    //选择会计科目
    chooseSubject(){
      this.$refs.subject.subjectModelShow = true
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
    // getCallBack() {
    //   this.getMessage();
    // },
    // getMessage() {
    //   this.calculation = this.$refs.voucherInput.AssistAccounting.fullName || this.$refs.voucherInput.AssistAccounting.itemName || this.$refs.voucherInput.AssistAccounting.userName || this.$refs.voucherInput.AssistAccounting[0].name;
    //   this.voucherItem = this.$refs.voucherInput.AssistAccounting
    // },
  }
}
</script>

<style lang="less" scoped>

.el-input-number{
  width: 100px;
}

</style>
