<template>
  <Modal title="本店待认领款" width="1000" v-model="visibal">
    <div class="clearfix mb20">
      <div class="mr10 fl">
        <span>查询日期：</span>
        <Date-picker
          formate="yyy-MM-dd"
          v-model="dateValue"
          type="daterange"
          placeholder="请选择日期"
          class="w180"
          @on-change="changeDate"
        ></Date-picker>
      </div>
      <div class="mr10 fl">
        <span>金额：</span>
        <Input class="w80" v-model="amount"/>
      </div>
      <div class="mr10 fl">
        <span>对方账户：</span>
        <Input class="w100" v-model="account"/>
      </div>
      <div class="mr10 fl">
        <span>业务类别：</span>
        <Select 
          class="w100"
          clearable
        >
          <Option v-for="(item, index) in options" :value="item" :key="index">{{item}}</Option>
        </Select>
      </div>
      <div>
        <Button icon="ios-search">查询</Button>
      </div>
    </div>
    <vxe-table
      border
      stripe
      highlight-hover-row
      :data="tableData"
      :auto-resize="true"
      size="mini"
      align="center"
    >
      <vxe-table-column type="checkbox"></vxe-table-column>
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column title="所属门店" show-overflow="tooltip"></vxe-table-column>
      <vxe-table-column title="发生日期" show-overflow="tooltip"></vxe-table-column>
      <vxe-table-column title="业务类别" show-overflow="tooltip"></vxe-table-column>
      <vxe-table-column title="支出金额" show-overflow="tooltip"></vxe-table-column>
      <vxe-table-column title="未认领金额" show-overflow="tooltip"></vxe-table-column>
      <vxe-table-column title="对方户名" show-overflow="tooltip"></vxe-table-column>
      <vxe-table-column title="账户" show-overflow="tooltip"></vxe-table-column>
      <vxe-table-column title="交易备注" show-overflow="tooltip"></vxe-table-column>
      <vxe-table-column title="智能匹配往来单位" show-overflow="tooltip"></vxe-table-column>

    </vxe-table>
  </Modal>
</template>

<script>
export default {
  data(){
    return {
      visibal: false, 
      dateValue: '',
      amount: '',
      account: '',
      options: ['选项111', '选项222', '选项333'],
      tableData: []
    }
  },
  methods: {
    open(){
      this.visibal = true
    },
    close(){
      this.visibal = false
    },
    changeDate(val){
    }
  }
}
</script>

<style lang="less" scoped>

</style>