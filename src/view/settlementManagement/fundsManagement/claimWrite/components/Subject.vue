<template>
  <div>
    <Modal v-model="subjectModelShow" title="选择会计科目" width="800px">
      <div class="partCheck-hd" style="padding-bottom: 20px">
        <Input class="w200 mr10" v-model="subjectModel" placeholder="请输入科目" @on-enter="search"></Input>
        <Button @click="search" class="mr10" type='primary'><Icon type="ios-search" size="14" /> 查询</Button>
      </div>
      <vxe-table
        border
        align="center"
        ref="xTable"
        highlight-hover-row
        auto-resize
        height="300"
        :loading="loadingTable"
        @radio-change="getRaido"
        :radio-config="{labelField: 'name', checkMethod}"
        size="mini"
        :data="tableData"
      >
        <vxe-table-column
          type="radio"
          disabled
          title="选择"
          field="raido"
          :editRender="{attrs: { disabled: true } }"
          width="60"
        ></vxe-table-column>
        <vxe-table-column field="titleTypeName" min-width="100" title="科目分类"></vxe-table-column>
        <vxe-table-column field="titleCode" min-width="100" title="科目编码"></vxe-table-column>
        <vxe-table-column field="titleName" min-width="100" title="科目名称"></vxe-table-column>
        <vxe-table-column field="titleLevel" min-width="100" title="层级"></vxe-table-column>
        <vxe-table-column field="auxiliaryAccountingName" min-width="100" title="辅助核算"></vxe-table-column>
      </vxe-table>
      <div class="mt10">
        <span class="mr10">备注:</span>
        <Input v-model="maker" autosize type="textarea" style="width: 400px" />
      </div>
      <div slot="footer">
        <Button type="primary" @click="save">保存</Button>
        <Button type="default" @click="subjectModelShow = false">返回</Button>
      </div>
    </Modal>
    <!-- 辅助核销计算 -->
    <voucherInput ref="voucherInput" :oneAccountent="[oneSubject]" @callBackFun="getCallBack"></voucherInput>
  </div>

</template>

<script>
import { getSubjectList } from "_api/documentApproval/ExpenseReimbursement";
import { TurnToTheProfitAndLoss,getSubjectMsg } from "_api/settlementManagement/fundsManagement/claimWrite.js";
import voucherInput from "@/view/settlementManagement/fundsManagement/claimWrite/components/components/voucherInput";
import {showLoading, hideLoading} from "@/utils/loading"
export default {
  name: "subject",
  props: {
    clime: ""
  },
  components: {
    voucherInput
  },
  data() {
    return {
      subjectModelShow: false, //模态框展示
      oneSubject: {}, //单选获取到的数据
      tableData: [], //表格数据
      maker: "", //备注
      subjectModel:"",
      loadingTable:false
    };
  },
  mounted() {},
  methods: {
    // 打开模态框
    open() {
      this.oneSubject = {};
      this.subjectModelShow = true;
      this.getList();
    },

    async getList() {
      let data = {},
        type = "FY003";
      switch (type) {
        case "FY001":
          data.parentCode = 6002;
          break;
        case "FY002":
          data.parentCode = 6003;
          break;
        case "FY003":
          data.parentCode = 601;
          break;
        case "FY004":
          data.parentCode = 6403;
          break;
        case "FY005":
          data.parentCode = 6711;
          break;
      }
      this.loadingTable = true;
      let res = await getSubjectList(data);
      this.loadingTable = false;
      if (res.code === 0) {
        this.tableData = res.data;
      }
    },
    //科目查询
    search(){
      let data={}
      data.titleTypeCode="601"
      data.titleCode=this.subjectModel
      getSubjectMsg(data).then(res=>{
        if(res.code==0){
          this.tableData = res.data
        }
      })
    },
    //判断是否可选择
    checkMethod({ row }) {
      return row.isDetailSubject == 0;
    },
    //获取单选框
    getRaido({ row }) {
      this.oneSubject = row;
      if(this.oneSubject.auxiliaryAccountingName) {
        this.oneSubject.mateAccountCoding=this.oneSubject.titleCode;
        this.$refs.voucherInput.voucherItem = {};
        this.$refs.voucherInput.groundIds=[];
        this.$refs.voucherInput.subjectModelShowassist = true;
      }
    },
    getCallBack(){
      this.save();
    },
    //保存
    async save() {
      if (Object.keys(this.oneSubject).length < 1)
        return this.$Message.error("请至少选择一条数据");
      let data = {};
      data.remark = this.maker;
      data.detailId = this.clime[0].id;
      data.subjectName = this.oneSubject.titleName;
      data.subjectCode = this.oneSubject.titleCode;
      data.subjectId = this.oneSubject.id;
      data.claimType=8;
      data.claimMoney = this.clime[0].unClaimedAmt
      if(this.oneSubject.auxiliaryAccountingName){
        data.auxiliaryTypeCode = this.$refs.voucherInput.auxiliaryTypeCode == 2?1:this.$refs.voucherInput.auxiliaryTypeCode //辅助核算选中哪一个
        if(data.auxiliaryTypeCode=="1" || data.auxiliaryTypeCode=="2" || data.auxiliaryTypeCode=="3" || data.auxiliaryTypeCode=="4"){
          data.isAuxiliaryAccounting=0 //是否辅助核算类
        }else{
          data.isAuxiliaryAccounting=1
        }
        data.auxiliaryName=this.$refs.voucherInput.AssistAccounting //辅助核算名称
        data.auxiliaryCode=this.$refs.voucherInput.auxiliaryCode //辅助核算项目编码

        let objItem = this.$refs.voucherInput.voucherItem;
        if(objItem.hasOwnProperty("id")){
          data.suppliersBean = {
            guestSourceName:objItem.fullName||"",
            guestSourceId:objItem.id||""
          }
        }else {
          this.$refs.voucherInput.subjectModelShowassist = true;
          setTimeout(() =>{
            this.$Message.warning("请选择辅助核算");
          },500)
          return;
        }
      }
      try {
        showLoading('body',"保存中，请勿操作。。。")
        let res = await TurnToTheProfitAndLoss(data);
        if (res.code === 0) {
          this.subjectModelShow = false;
          hideLoading()
          this.$refs.voucherInput.subjectModelShowassist = false;
          this.$Message.success("转益成功");
          //刷新本店待认领款 列表
          this.$parent.$parent.queryClaimed()
        }else{
          hideLoading()
        }
      } catch (error) {
        hideLoading()
      }
    }
  },
  watch: {}
};
</script>

<style scoped>
</style>
