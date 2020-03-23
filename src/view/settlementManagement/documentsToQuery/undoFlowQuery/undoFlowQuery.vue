<template>
  <div class="content-oper content-oper-flex" style="background-color: #fff;">
      <div class="oper-top pl10">

            <span class="mr5">快速查询：</span>
            <quickDate class="mr10" ref="quickDate" @quickDate="quickDate"></quickDate>
            <span class="mr5">期间：</span>
            <Date-picker :value="value" type="daterange" placeholder="选择日期" class="w200 mr15" @on-change="dateChange"></Date-picker>
            <span class="mr5">分店名称：</span>
            <Select  v-model="model1" filterable class="w150 mr15">
              <Option
                v-for="item in shopList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          <button class="mr15 ivu-btn ivu-btn-default" type="button">
            <i class="iconfont iconchaxunicon"></i>
            <span>查询</span>
          </button>
          <button class=" ivu-btn ivu-btn-default" type="button" @click="exportSelectEvent">
            <span>导出</span>
          </button>
        </div>
        <vxe-table
          border
          ref="xTable1"
          resizable
          size="mini"
          align="center"
          highlight-hover-row
          highlight-current-row
          show-overflow
          height="600"
          :data="tableData">
          <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
          <vxe-table-column field="name" title="撤销单号"></vxe-table-column>
          <vxe-table-column field="role" title="撤单类型"></vxe-table-column>
          <vxe-table-column field="age" title="撤销来源" ></vxe-table-column>
          <vxe-table-column field="time" title="对账单号"></vxe-table-column>
          <vxe-table-column field="time" title="单号生成时间"></vxe-table-column>
          <vxe-table-column field="time" title="单号制单人"></vxe-table-column>
          <vxe-table-column field="time" title="单号金额"></vxe-table-column>
          <vxe-table-column field="time" title="撤销时间"></vxe-table-column>
          <vxe-table-column field="time" title="撤销人"></vxe-table-column>
          <vxe-table-column field="time" title="撤销原因"></vxe-table-column>
        </vxe-table>

  </div>
</template>

<script>
  import quickDate from "@/components/getDate/dateget_bill.vue";
  import {creat} from '../../components'

  import moment from 'moment'
  export default {
    components: {
      quickDate
    },
    data() {
      return {
        fno:'',//调拨单号
        value: [],
        shopList: [],
        model1: "",
        tableData: [],//表格数据

      };
    },
    async mounted () {
      let arr = await creat (this.$refs.quickDate.val,this.$store)
      this.value = arr[0];
      this.model1 = arr[1];
    },
    methods: {
      // 快速查询
      quickDate(data){
        this.value = data
      },
      // 日期选择
      dateChange(data){
        this.value = data
      },

      //导出数据
      exportSelectEvent () {
        if(this.tableData.length === 0) return this.$Message.error('暂无数据导出')
        this.$refs.xTable1.exportData({
          data: this.$refs.xTable1.getCheckboxRecords()
        })
      },
    }
  };
</script>

<style lang="less" scoped>
  .oper-top {
    line-height: 50px;
    border-bottom: 1px #dddddd solid;
  }


</style>
