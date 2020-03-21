<template>
  <Modal v-model="artificialShow" title="人工分配" width="600px">
    <div>
      <p class="headerTitle pl10 ">需分配金额</p>
      <Row class="box mb10">
        <Col span="12" class="title rigt">收入金额</Col>
        <Col span="12" class="title">支出金额</Col>
        <Col span="12" class="rigt">col-12</Col>
        <Col span="12">col-12</Col>
      </Row>
     <div class="mb10">
      <Button class="mr10 w90" @click="add">
        <Icon type="md-add" />添加
      </Button>
      <Button type="default" class="mr10 w90" @click="delet">删除</Button>
     </div>

      <vxe-table
      border
      ref="xTable"
      align="center"
      show-footer
      resizable
      auto-resize
      max-height="400px"
      size="mini"
      :data="tableData"
      :footer-span-method="footerColspanMethod"
      :footer-method="footerMethod"
      @checkbox-change="getOneList"
      @checkbox-all ='getAllList'
      :edit-config="{trigger: 'click', mode: 'cell'}"
      >
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
        <vxe-table-column type="checkbox" width="50"></vxe-table-column>
        <vxe-table-column  title="分配店号" >
        <template v-slot="{row}">
          <Select v-model="row.name">
            <Option v-for="item in shopList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
      </vxe-table-column>
      <vxe-table-column field="role" title="收入金额" :edit-render="{name: 'input', attrs: {type: 'number'} , events: {input: updateFooterEvent}}"></vxe-table-column>
      <vxe-table-column field="num6" title="支出金额" :edit-render="{name: 'input', attrs: {type: 'number'} , events: {input: updateFooterEvent}}"></vxe-table-column>
    </vxe-table>
    <div></div>
    </div>

    <div slot="footer">
      <Button type="primary" @click="sure">确定</Button>
      <Button type="default" @click="artificialShow = false">取消</Button>
    </div>
  </Modal>

</template>

<script>
    export default {
        name: "artificial",
      data(){
          return {
            artificialShow : false,//模态框状态
            tableData:[],//表格数据
            shopList:[
              {label:'1号店',value:1},
              {label:'2号店',value:2},
            ],
            oneList:{},//当前行数据
          }
      },
      methods:{
         //打开模态框
        openModal(){
          this.artificialShow = true
          this.oneList = []
          this.tableData=[{},{},{},{},{},{},{},{},{},{},{}]

        },

        // 在值发生改变时更新表尾合计
        updateFooterEvent (params) {
          let xTable = this.$refs.xTable
          xTable.updateFooter()
        },

        //表格尾部合计
        footerMethod ({ columns, data }) {
          return [
            columns.map((column, columnIndex) => {
              if (columnIndex === 0) {
                return '分配合计'
              }
              if (['role', 'num6'].includes(column.property)) {
                return this.$utils.sum(data, column.property)
              }
              return null
            }),
            columns.map((column, columnIndex) => {
              if (columnIndex === 0) {
                return '核对'
              }
              if (['role'].includes(column.property)) {
                return 1000 - this.$utils.sum(data, column.property)
              }
              if (['num6'].includes(column.property)) {
                return 2000 - this.$utils.sum(data, column.property)
              }
              return null
            })
          ]
        },

        //表格合并
        footerColspanMethod ({ columnIndex }) {
          if (columnIndex === 0) {
            return {
              rowspan: 1,
              colspan: 3
            }
          }else if (columnIndex === 1 || columnIndex === 2) {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        },

        //点击获取当前行数据
        getOneList(v){
          this.oneList = v.selection
        },

        //全选
        getAllList(v){
          this.oneList = v.selection
        },

        //添加行
        add(){
          this.tableData.unshift({})
        },

      //删除选中行
        delet(){
          if (this.oneList.length == 0) return this.$Message.error('至少选择一条数据删除')
          this.oneList.forEach( item => {
           this.tableData.forEach( (el , index) => {
              if(el._XID == item._XID){
                this.tableData.splice(index , 1)
              }
            })
          })
          this.oneList = []
        },

        //确定
        sure(){
          this.artificialShow = false
        }
      }
    }
</script>

<style scoped lang="less">
.headerTitle {
  line-height: 24px;
  background-color: #cccccc;
  /*font-size: 20px;*/
  font-weight: 700;
}
.box {
  border: 1px #cccccc solid;
  line-height: 28px;
  text-align: center;
  .title {
    border-bottom: 1px #cccccc solid;
  }
  .rigt{
    border-right:1px #cccccc solid ;
  }
}
</style>
