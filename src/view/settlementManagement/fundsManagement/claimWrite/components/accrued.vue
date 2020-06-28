<template>
  <div>
    <Modal v-model="modal" title="转应收应付" width="800" on-ok="ok">
      <div class="db dbd">
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="openVoucherInput()"
          :disabled="bool"
        >转应收款</button>
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="openVoucherInput()"
          :disabled="!bool"
        >转应付款</button>
      </div>
      <vxe-table
        border
        align="center"
        ref="xTable"
        :edit-rules="validRules"
        highlight-hover-row
        auto-resize
        height="300"
        @radio-change="getRaido"
        :edit-config="{trigger: 'click', mode: 'cell'}"
        size="mini"
        :data="accrued"
      >
        <vxe-table-column type="seq" title="序号"></vxe-table-column>
        <vxe-table-column field="area" title="所属区域"></vxe-table-column>
        <vxe-table-column field="shopName" title="所属门店"></vxe-table-column>
        <vxe-table-column field="shopCode" title="所属店号"></vxe-table-column>
        <vxe-table-column field="accountName" title="账户"></vxe-table-column>
        <vxe-table-column field="accountCode" title="账号"></vxe-table-column>
        <vxe-table-column field="bankName" title="开户行"></vxe-table-column>
        <vxe-table-column field="mateAccountName" title="对应科目"></vxe-table-column>
        <vxe-table-column field="createTime" title="发生日期"></vxe-table-column>
        <vxe-table-column field="incomeMoney" title="收入金额"></vxe-table-column>
        <vxe-table-column field="paidMoney" title="支出金额"></vxe-table-column>
        <vxe-table-column
          field="rpAmt || balanceMoney"
          :edit-render="{name: 'input', props: {type: 'float', digits: 2}}"
          title="本次认领金额"
          align="center"
        ></vxe-table-column>
        <vxe-table-column field="reciprocalAccountName" title="对方户名"></vxe-table-column>
        <vxe-table-column
          field="tradingNote"
          :edit-render="{name: 'input',immediate:true, attrs: {type: 'text'}}"
          title="交易备注"
          align="center"
        ></vxe-table-column>
      </vxe-table>
    </Modal>
    <voucherInput ref="voucherInput" :oneAccountent="accrued"></voucherInput>
  </div>
</template>
<script>
import voucherInput from "@/view/settlementManagement/fundsManagement/claimWrite/components/components/voucherInput";
import { TurnToTheProfitAndLoss } from "@/api/settlementManagement/fundsManagement/claimWrite.js";
export default {
  props: { accrued: "" },
  components: {
    voucherInput
  },
  data() {
    const amtValid = ({ row }) => {
      return new Promise((resolve, reject) => {
        let trueValue =
          Math.abs(row.rpAmt) > Math.abs(row.incomeMoney || row.paidMoney);
        if (trueValue) {
          reject(new Error("本次核销金额绝对值不能大于未收/付金额"));
        } else {
          resolve(true);
        }
      });
    };
    return {
      // 表格验证  本次认领金额  是否符合条件
      validRules: {
        rpAmt: [{ required: true, validator: amtValid }]
      },
      modal: false, //模态框展示
      oneSubject: {}, //单选获取到的数据
      bool:true
    };
  },
  methods: {
    // 打开模态框
    open() {
      this.oneSubject = {};
      this.modal = true;
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
      this.$refs.voucherInput.subjectModelShowassist = true;
    },
    async ok(){
      let data = {};
      data.detailId = this.accrued[0].id;
      if(this.bool){
        data.subjectCode="2202"; 
        data.climeType=2
      }else{
        data.subjectCode="1122";
        data.climeType=1
      }
      let res = await TurnToTheProfitAndLoss(data);
      if (res.code === 0) {
        this.modal = false;
        this.bool?this.$Message.success("转应付款成功"):this.$Message.success("转应收款成功")
      }
    }
  }
};
</script>
<style lang="less" scoped>
.dbd {
  padding-bottom: 25px;
}
</style>