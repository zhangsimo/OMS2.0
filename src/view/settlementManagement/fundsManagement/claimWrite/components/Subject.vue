<template>
  <Modal v-model="subjectModelShow" title="选择会计科目" width="800px">
    <vxe-table
      border
      align="center"
      ref="xTable"
      highlight-hover-row
      auto-resize
      height="300"
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
      <vxe-table-column field="titleTypeName" title="科目分类"></vxe-table-column>
      <vxe-table-column field="titleCode" title="科目编码"></vxe-table-column>
      <vxe-table-column field="titleName" title="科目名称"></vxe-table-column>
      <vxe-table-column field="titleLevel" title="层级"></vxe-table-column>
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
</template>

<script>
import { getSubjectList } from "_api/documentApproval/ExpenseReimbursement";
import { TurnToTheProfitAndLoss } from "_api/settlementManagement/fundsManagement/claimWrite.js";
export default {
  name: "subject",
  props: {
    clime: ""
  },
  data() {
    return {
      subjectModelShow: false, //模态框展示
      oneSubject: {}, //单选获取到的数据
      tableData: [], //表格数据
      maker: "" //备注
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
      let res = await getSubjectList(data);
      if (res.code === 0) {
        this.tableData = res.data;
      }
    },
    //判断是否可选择
    checkMethod({ row }) {
      return row.isDetailSubject == 0;
    },
    //获取单选框
    getRaido({ row }) {
      this.oneSubject = row;
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
      data.claimeType=8
      let res = await TurnToTheProfitAndLoss(data);
      if (res.code === 0) {
        this.subjectModelShow = false;
        this.$Message.success("转益成功");
      }
    }
  },
  watch: {}
};
</script>

<style scoped>
</style>
