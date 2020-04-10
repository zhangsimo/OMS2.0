<template>
  <Modal
    v-model="subjectModelShow"
    title="选择会计科目"
    width="800px"
  >
    <vxe-table
      border
      align="center"
      highlight-hover-row
      auto-resize
      height="300"
      @radio-change="getRaido"
      size="mini"
      :data="tableData">
      <vxe-table-column type="radio" title="选择" width="60"></vxe-table-column>
      <vxe-table-column field="name" title="科目分类"></vxe-table-column>
      <vxe-table-column field="sex" title="科目编码"></vxe-table-column>
      <vxe-table-column field="age" title="科目名称"></vxe-table-column>
      <vxe-table-column field="age" title="层级"></vxe-table-column>
    </vxe-table>

    <div slot='footer'>
      <Button type='primary' @click='save'>保存</Button>
      <Button type='default' @click='subjectModelShow = false'>返回</Button>
    </div>
  </Modal>
</template>

<script>
    export default {
        name: "subject",
      props:{
        subjet:''
      },
      data(){
          return {
            subjectModelShow: false, //模态框展示
            oneSubject:{},//单选获取到的数据
            tableData:[
              {name:'zs'},
              {name:'ls'},
              {name:'ww'},
            ],//表格数据
          }
      },
      methods:{
          // 打开模态框
          open(){
            this.subjectModelShow = true
            console.log(this.subjet)
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
      }
    }
</script>

<style scoped>

</style>
