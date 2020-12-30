<template>
  <Modal
    v-model="modelShow"
    title="预付款单据"
    width="1000px"
  >
    <div class="clearfix">
      <div class="titleHeader">
        <span class="mr5">申请日期:</span>
        <DatePicker type="daterange" placement="bottom-end"  v-model="date" style="width: 200px" class="mr10"></DatePicker>
        <span class="mr5">往来单位：</span>
        <Select v-model="companyId"
          filterable
          remote
          :remote-method="remoteMethod"
          :loading="loading1"
          clearable
         class="w150 mr10">
          <Option v-for="(item,index) in company" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
        <span class="mr5">金额：</span>
        <Input v-model="money" class="w150 mr10" />
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
        row-id="id"
        :radio-config="{trigger: 'row', highlight: true, range: true, reserve:true}"
        size="mini"
        @checkbox-all="selectAllEvent"
        @checkbox-change="selectChangeEvent"
        :data="tableData">
        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="serviceId" title="订单单号"></vxe-table-column>
        <vxe-table-column field="guestName" title="往来单位"></vxe-table-column>
        <vxe-table-column field="orderDate" title="订单日期"></vxe-table-column>
        <vxe-table-column field="payAmt" title="计划预付款"></vxe-table-column>
        <vxe-table-column field="orderAmt" title="订单金额"></vxe-table-column>
        <vxe-table-column field="hasApplyAmt" title="已申请金额"></vxe-table-column>
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
  import { findGuest } from "_api/settlementManagement/advanceCollection.js";
  import {getPchsList} from '@/api/documentApproval/AdvanceApply.js'
  import {ThisWeekStr} from '@/components/getDate/index.js'
  export default {
    name: "requestCode",
    data(){
      return {
        modelShow: false,//模态框状态
        date:[],//时间
        tableData:[],//表格数据
        checkedList:{},//获取到的信息
        company:[],//往来列表
        companyId:0,//获取到往来单位id
        money:'',//金额
        loading1: false,
      }
    },
    methods: {
      //往来单位查询
      async remoteMethod(query) {
        this.company = [];
        this.loading1 = true
        let arr = []
        let req = {
          fullName: query,
          size: 20,
        }
        let res = await findGuest(req);
        if (res.code == 0) {
          this.loading1 = false
          res.data.content.map(item => {
            arr.push({
              value: item.id,
              label: item.shortName,
            });
          });
        }
        let arrJson = new Set(arr)
        this.company = Array.from(arrJson)
      },
      //打开模态框
      open() {
        this.modelShow = true
        // let date = []
        // let weekOfday = parseInt(moment().format('d'))==0?7:parseInt(moment().format('d')) // 计算今天是这周第几天
        // let start = moment().subtract(weekOfday-1, 'days').format('YYYY-MM-DD') // 周一日期
        // let end = moment().add(7 - weekOfday, 'days').format('YYYY-MM-DD') // 周日日期
        // date.push(start)
        // date.push(end)
        this.companyId = ''
        this.money = ''
        this.date = ThisWeekStr()
        this.checkedList = {}
        this.remoteMethod('')
        this.query()
      },

      // 往来单位选择
      // async getOne() {
      //   this.company = [{label:'全部' ,value: 0 }]
      //   findGuest({ size: 2000 }).then(res => {
      //     if (res.code === 0) {
      //       res.data.content.map(item => {
      //         this.company.push({
      //           value: item.id,
      //           label: item.fullName
      //         });
      //       });
      //     }
      //   });
      // },

      //查询
      async query(){
        let data ={}
        data.startTime = this.date[0] ? moment(this.date[0]).startOf('day').format("YYYY-MM-DD HH:mm:ss") : ""
        data.endTime = this.date[1] ? moment(this.date[1]).endOf('day').format("YYYY-MM-DD HH:mm:ss") : ''
        data.amountCollected = this.money
        data.guestId = this.companyId == 0 ? '' : this.companyId
        let res = await getPchsList(data)
        if(res.code === 0) {
          this.$Message.success('查询成功')
          this.tableData = (res.data || [])
        }
      },

      //选择
      selectChangeEvent({selection}){
        this.checkedList = selection
      },
      //全选
      selectAllEvent({selection}){
        this.checkedList = selection
      },

      //确定
      submit(){
        if (Object.keys(this.checkedList).length < 1) return this.$Message.error('请选择一条信息')
        for(let i = 1; i < this.checkedList.length; i++){
          if(this.checkedList[0].guestId !== this.checkedList[i].guestId){
            return this.$Message.error('请选择往来单位相同的单据！')
          }
        }
        this.$emit('backLists' ,this.checkedList)
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
