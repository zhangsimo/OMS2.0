<template>
  <Modal
    v-model="modelShow"
    title="因公借支申请查询"
    width="700px"
  >
    <div class="clearfix">
      <div class="titleHeader">
        <span class="mr5">申请日期:</span>
        <DatePicker type="daterange" placement="bottom-end"  v-model="date" style="width: 200px" class="mr10"></DatePicker>
        <Button type="warning" class="mr20" @click="query">
          <Icon custom="iconfont iconchaxunicon icons" />查询
        </Button>
      </div>
      <vxe-table
        border
        align="center"
        highlight-hover-row
        auto-resize
        height="300"
        :checkbox-config="{trigger: 'row', highlight: true, range: true}"
        size="mini"
        @checkbox-all="selectAllEvent"
        @checkbox-change="selectChangeEvent"
        :data="tableData">
        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="applyNo" title="因公借支单号"></vxe-table-column>
        <vxe-table-column field="applyAmt" title="借支金额"></vxe-table-column>
        <vxe-table-column field="applyTime" title="申请日期"></vxe-table-column>
        <vxe-table-column field="applicant" title="申请人"></vxe-table-column>
        <vxe-table-column field="topic" title="摘要"></vxe-table-column>
      </vxe-table>
    </div>
    <div slot='footer'>
      <Button type='primary' @click='submit'>确定</Button>
      <Button type='default' @click='modelShow = false'>返回</Button>
    </div>
  </Modal>

</template>

<script>
  import moment from 'moment'
  import {getOnBusiness} from '_api/documentApproval/ExpenseReimbursement'
  import {ThisWeekStr} from '@/components/getDate/index.js'

  export default {
    name: "requestCode",
    data(){
      return {
        modelShow: false,//模态框状态
        date:[],//时间
        tableData:[],//表格数据
        checkedList:[],//获取到的信息
      }
    },
    methods: {
      //打开模态框
      open() {
        this.checkedList =[]
        this.modelShow = true
        // let date = []
        // let weekOfday = parseInt(moment().format('d'))==0?7:parseInt(moment().format('d')) // 计算今天是这周第几天 周日为一周中的第一天
        // let start = moment().subtract(weekOfday-1, 'days').format('YYYY-MM-DD') // 周一日期
        // let end = moment().add(7 - weekOfday, 'days').format('YYYY-MM-DD') // 周日日期
        // date.push(start)
        // date.push(end)
        this.date = ThisWeekStr()
        this.query()
      },

      //查询
     async query(){
        let data ={}
       data.startTime = this.date[0] ? moment(this.date[0]).startOf('day').format("YYYY-MM-DD HH:mm:ss") : ""
       data.endTime = this.date[1] ? moment(this.date[1]).endOf('day').format("YYYY-MM-DD HH:mm:ss") : ''
       let res = await getOnBusiness(data)
       if(res.code === 0){
         this.tableData = res.data
       }
      },

      //全选
      selectAllEvent(column){
        this.checkedList = column.selection

      },
      //选择
      selectChangeEvent(column){
        this.checkedList = column.selection

      },

      //确定
      submit(){
        if (this.checkedList.length < 1) return this.$Message.error('请选择一条信息')
        this.$emit('backList' ,this.checkedList)
        this.modelShow = false
      }
    }
  }
</script>

<style scoped lang="less">
  .titleHeader {
    line-height: 38px;
  }
</style>
