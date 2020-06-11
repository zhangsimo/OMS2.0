<template>
  <Modal
    v-model="subjectModelShow"
    title="选择会计科目"
    width="800px"
  >
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
      <vxe-table-column type="radio" disabled title="选择"  field="raido" :editRender="{attrs: { disabled: true } }" width="60"></vxe-table-column>
      <vxe-table-column field="titleTypeName" title="科目分类"></vxe-table-column>
      <vxe-table-column field="titleCode" title="科目编码"></vxe-table-column>
      <vxe-table-column field="titleName" title="科目名称"></vxe-table-column>
      <vxe-table-column field="titleLevel" title="层级"></vxe-table-column>
    </vxe-table>

    <div slot='footer'>
      <Button type='primary' @click='save'>保存</Button>
      <Button type='default' @click='subjectModelShow = false'>返回</Button>
    </div>
  </Modal>
</template>

<script>
  import {getSubjectList} from '_api/documentApproval/ExpenseReimbursement'
  export default {
        name: "subject",
      props:{
        subjet:''
      },
      data(){
          return {
            subjectModelShow: false, //模态框展示
            oneSubject:{},//单选获取到的数据
            tableData:[],//表格数据
          }
      },
      methods:{
          // 打开模态框
          open(){
            this.oneSubject = {}
            this.subjectModelShow = true
          },

        async getList(v){
            let data = {},
              type = v.expenseType
            switch (type) {
              case "FY001":
                data.parentCode = 6602
                break;
              case "FY002":
                data.parentCode = 6603
                break;
              case "FY003":
                data.parentCode = 6601
                break;
              case "FY004":
                data.parentCode = 6403
                break;
              case "FY005":
                data.parentCode = 6711
                break;
            }
            let res = await getSubjectList(data)
          if (res.code === 0){
            this.tableData = res.data
          }
        },
        //判断是否可选择
        checkMethod({ row }){
          return row.isDetailSubject == 0
        },
        //获取单选框
        getRaido({row}){
            this.oneSubject = row
        },

        //保存
        save(){
            if(Object.keys(this.oneSubject).length < 1) return this.$Message.error('请至少选择一条数据')
            this.$emit('backList',this.oneSubject)
            this.subjectModelShow = false
            this.$Message.success('添加成功')
        }
      },
    watch:{
      subjet:{
        handler(v,ov){
          this.getList(v)
        },
        deep:true
      }
    }
    }
</script>

<style scoped>

</style>
