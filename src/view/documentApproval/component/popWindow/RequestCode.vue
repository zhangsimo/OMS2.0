<template>
  <Modal
    v-model="modelShow"
    title="请示申请查询"
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
        @radio-change="getRaido"
        size="mini"
        :data="tableData">
        <vxe-table-column type="radio" title="选择" width="60"></vxe-table-column>
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="applyNo" title="申请单号"></vxe-table-column>
        <vxe-table-column field="applyAmt" title="申请费用"></vxe-table-column>
        <vxe-table-column field="applyTime" title="申请日期"></vxe-table-column>
        <vxe-table-column field="applicant" title="申请人"></vxe-table-column>
        <vxe-table-column field="topic" title="主题"></vxe-table-column>
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
  import {getApplyList} from '_api/documentApproval/ExpenseReimbursement'
    export default {
        name: "requestCode",
      data(){
          return {
            modelShow: false,//模态框状态
            date:[],//时间
            tableData:[],//表格数据
            oneapplet:{},//获取到的信息
            indexNum:0,
          }
      },
      methods: {
          //打开模态框
        async open() {
          this.modelShow = true
          let date = []
          let weekOfday = parseInt(moment().format('d')) // 计算今天是这周第几天 周日为一周中的第一天
          let start = moment().subtract(weekOfday-1, 'days').format('YYYY-MM-DD') // 周一日期
          let end = moment().add(7 - weekOfday, 'days').format('YYYY-MM-DD') // 周日日期
          date.push(start)
          date.push(end)
          this.date = date
          this.query()
        },

        //查询
        async query(){
          let data ={}
          data.startTime = this.date[0] ? moment(this.date[0]).startOf('day').format("YYYY-MM-DD HH:mm:ss") : ""
          data.endTime = this.date[1] ? moment(this.date[1]).endOf('day').format("YYYY-MM-DD HH:mm:ss") : ''
          let res = await getApplyList(data)
          if(res.code === 0) {
            this.tableData = res.data
            if(this.indexNum!==0){
              this.$Message.success('查询成功')
            }
            this.indexNum++;
          }
        },

        //选择
        getRaido({row}){
          this.oneapplet = row
        },

        //确定
        submit(){
          if (Object.keys(this.oneapplet).length < 1) return this.$Message.error('请选择一条信息')
          this.$emit('backList' ,this.oneapplet)
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
