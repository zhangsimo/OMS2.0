<template>
  <div>
    <Modal v-model="modal" title="转应收应付" width="1000">
      <vxe-table
        border
        align="center"
        ref="xTable"
        :edit-rules="validRules"
        highlight-hover-row
        highlight-current-row
        auto-resize
        max-height="300"
        @radio-change="getRaido"
        :edit-config="{trigger: 'click', mode: 'cell'}"
        size="mini"
        show-overflow="title"
        :data="accrued"
      >
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="area" width="80" title="所属区域"></vxe-table-column>
        <vxe-table-column field="shopName" width="120" title="所属门店"></vxe-table-column>
        <vxe-table-column field="shopCode" width="100" title="所属店号"></vxe-table-column>
        <vxe-table-column field="accountName" width="100" title="账户"></vxe-table-column>
        <vxe-table-column field="accountCode" width="120" title="账号"></vxe-table-column>
        <vxe-table-column field="bankName" width="120" title="开户行"></vxe-table-column>
        <vxe-table-column field="mateAccountName" width="100" title="对应科目"></vxe-table-column>
        <vxe-table-column field="createTime" width="140" title="发生日期"></vxe-table-column>
        <vxe-table-column field="incomeMoney" width="80" title="收入金额"></vxe-table-column>
        <vxe-table-column field="paidMoney" width="80" title="支出金额">
          <template v-slot="{row}">
            {{Math.abs(row.paidMoney)}}
          </template>
        </vxe-table-column>
        <vxe-table-column field="unClaimedAmt" width="80" title="未认领金额"></vxe-table-column>
        <vxe-table-column
          field="balanceMoney"
          v-model="accrued[0].balanceMoney"
          :edit-render="{name: 'input',  attrs:{type: 'number'}, props: {type: 'float', digits: 2}}"
          title="本次认领金额"
          width="120"
          align="center"
        ></vxe-table-column>
        <vxe-table-column field="reciprocalAccountName" width="80" title="对方户名"></vxe-table-column>
        <vxe-table-column
          field="tradingNote"
          width="120"
          :edit-render="{name: 'input',immediate:true, attrs: {type: 'text'}}"
          title="交易备注"
          align="center"
        ></vxe-table-column>
      </vxe-table>
      <div class="pt20 pb20">
        <i style="color:red">* </i>
        <span>选择辅助核算：</span>
        <Input v-model="MessageValue" class="w150 mr10" />
        <Button type="default" @click="openVoucherInput">辅助核算</Button>
      </div>
      <div slot="footer">
        <Button type="primary" @click="submitOk" class="mr10">确定</Button>
        <Button type="default" @click="modal = false">取消</Button>
      </div>
    </Modal>
    <voucherInput ref="voucherInput" :oneAccountent="accrued" @callBackFun="getCallBack" :assistTypeCode="assistTypeCode"></voucherInput>
  </div>
</template>
<script>
import voucherInput from "@/view/settlementManagement/fundsManagement/claimWrite/components/components/voucherInput";
import { TurnToTheProfitAndLoss } from "@/api/settlementManagement/fundsManagement/claimWrite.js";
import {showLoading, hideLoading} from "@/utils/loading"
export default {
  props: { accrued: "" },
  components: {
    voucherInput
  },
  data() {
    const amtValid = ({cellValue, row }) => {
      return new Promise((resolve, reject) => {
        if(cellValue){
          let trueValue =
            Math.abs(row.rpAmt) > Math.abs(row.incomeMoney || row.paidMoney);
          if (trueValue) {
            reject(new Error("本次核销金额绝对值不能大于未收/付金额"));
          } else {
            resolve();
          }
        }else{
          reject(new Error("本次认领金额必填"));
        }
      });
    };
    return {
      // 表格验证  本次认领金额  是否符合条件
      validRules: {
        rpAmt: [{validator: amtValid }],
        balanceMoney:[{validator: amtValid }]
      },
      modal: false, //模态框展示
      oneSubject: {}, //单选获取到的数据
      bool:true,
      MessageValue:'',
      assistTypeCode: '1', //控制打开辅助核算类型，默认是客户和供应商往来
    };
  },
  methods: {
    // 打开模态框
    open() {
      this.oneSubject = {};
      this.modal = true;
      this.MessageValue = ""
      this.$nextTick(()=>{
        this.$refs.xTable.setActiveCell(this.$refs.xTable.getData(0),"balanceMoney")
      })
    },
    //判断是否可选择
    checkMethod({ row }) {
      return row.isDetailSubject == 0;
    },
    //获取单选框
    getRaido({ row }) {
      this.oneSubject = row;
    },
    openVoucherInput() {
      this.$refs.voucherInput.AssistAccounting = ''
      this.$refs.voucherInput.subjectModelShowassist = true;
    },

    async submitOk(){
      const errMap = await this.$refs.xTable.validate().catch(errMap => errMap);
      if (errMap) {
      } else {
        if(this.MessageValue){
          let rpAmt=Math.abs(this.accrued[0].incomeMoney==0?this.accrued[0].paidMoney:this.accrued[0].incomeMoney)
          if(this.accrued[0].balanceMoney>rpAmt){
            return this.$message.error("本次认领金额输入错误，请重新输入")
          }else if(this.accrued[0].balanceMoney<0){
            return this.$message.error("本次认领金额不可小于零")
          }else{
            this.ok();
          }
        }else{
          this.$Message.error("请选择辅助核算");
        }
      }
    },

    async ok(){
      let data = {};
      data.detailId = this.accrued[0].id;
      data.claimMoney=this.accrued[0].balanceMoney
      if(data.claimMoney > this.accrued[0].unClaimedAmt){
        this.$Message.error('本次认领金额不可大于未认领金额')
        return
      }
      if(this.bool){
        data.subjectCode="2202";
        data.claimType=2
      }else{
        data.subjectCode="1122";
        data.claimType=1
      }
      data.auxiliaryTypeCode = this.$refs.voucherInput.auxiliaryTypeCode == 2?1:this.$refs.voucherInput.auxiliaryTypeCode //辅助核算选中哪一个
      if(data.auxiliaryTypeCode=="1" || data.auxiliaryTypeCode=="2" || data.auxiliaryTypeCode=="3" || data.auxiliaryTypeCode=="4"){
        data.isAuxiliaryAccounting=0 //是否辅助核算类
      }else{
        data.isAuxiliaryAccounting=1
      }
      data.auxiliaryName=this.MessageValue //辅助核算名称
      data.auxiliaryCode=this.$refs.voucherInput.auxiliaryCode //辅助核算项目编码
      let objItem = this.$refs.voucherInput.voucherItem;
      if(objItem.hasOwnProperty("id")){
        data.suppliersBean = {
          guestSourceName:objItem.shortName||"",
          guestSourceId:objItem.id||""
        }
      }
      try {
        showLoading('body',"保存中，请勿操作。。。")
        let res = await TurnToTheProfitAndLoss(data);
        if (res.code === 0) {
          this.modal = false;
          this.bool?this.$Message.success("转应付款成功"):this.$Message.success("转应收款成功")
          this.$parent.$parent.queryClaimed()
          hideLoading()
        }else{
          hideLoading()
        }
      } catch (error) {
        hideLoading()
      }
    },
    //选择辅助核算回调
    getCallBack(){
      this.getMessage();
    },
    //子组件的数据
    getMessage() {
      this.MessageValue = this.$refs.voucherInput.AssistAccounting;
    },
  }
};
</script>
<style lang="less" scoped>
.dbd {
  padding-bottom: 25px;
}
</style>
