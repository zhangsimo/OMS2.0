<template>
  <div>
    <Modal class="claim" title="预收款认领" width="1000" v-model="visibal">
      <div class="clearfix mb20">
        <Button class="fl" @click="openPClaimModal">选择单据</Button>
        <div class="fr">
          <span style="color: red" class="mr5">*</span>
          <span>选择辅助核算：</span>
          <Input class="w180 mr10" v-model="calculation"/>
          <Button>辅助计算</Button>
        </div>
      </div>

      <vxe-table
        border
        show-footer
        highlight-hover-row
        highlight-current-row
        @on-current-change="currentRow"
        :auto-resize="true"
        size="mini"
        align="center"
        :data="tableData"
        :edit-config="{ trigger: 'click', mode: 'cell' }"
        :footer-method="addFooter"
      >
        <vxe-table-column title="操作" show-overflow="tooltip">
          <template v-slot="{ row }">
            <Button type="text" @click="deleteItem(row)">删除</Button>
          </template>
        </vxe-table-column>
        <vxe-table-column
          title="发生日期" width="80" field="data1"  show-overflow="tooltip">
        </vxe-table-column>
        <vxe-table-column title="账户" width="100" field="data2" show-overflow="tooltip">

        </vxe-table-column>
        <vxe-table-column title="支出金额" width="100" field="data3" show-overflow="tooltip">

        </vxe-table-column>
        <vxe-table-column title="收入金额" width="100" field="data4" show-overflow="tooltip">

        </vxe-table-column>
        <vxe-table-column
          title="本次认领金额"
          width="120" 
          field="data5" 
          show-overflow="tooltip"
          :edit-render="{ name: 'input' }"
          >
          <template v-slot:edit="{ row }">
            <el-input-number
              :min="0"
              v-model="row.data5"
              :controls="false"
              size="mini"
              :precision="0"
            />
          </template>
        </vxe-table-column>
        <vxe-table-column title="已认领金额" width="100" field="data6" show-overflow="tooltip">

        </vxe-table-column>
        <vxe-table-column title="未认领金额" width="100" field="data7" show-overflow="tooltip">

        </vxe-table-column>
        <vxe-table-column title="智能匹配往来单位" width="180" field="data8" show-overflow="tooltip">

        </vxe-table-column>
      </vxe-table>

      <div slot="footer">
        <Button type="primary" @click="confirm">确定</Button>
        <Button @click="close">取消</Button>
      </div>
    </Modal>
    <PreClaimModal ref="PClaimModal"></PreClaimModal>
  </div>
</template>

<script>
import PreClaimModal from "./PreClaimModal"
import { claimedFund } from "_api/settlementManagement/fundsManagement/claimWrite.js";
export default {
  components: {
    PreClaimModal
  },
  data(){
    return {
      visibal: false,
      calculation: '',
      tableData: [
        {id: 0, data1: 1, data2: 2, data3: 3, data4: 4, data5: 5,data6: 6, data7: 7, data8: 8 },
        {id: 1, data1: 1, data2: 2, data3: 3, data4: 4, data5: 5,data6: 6, data7: 7, data8: 8 },
        {id: 2, data1: 1, data2: 2, data3: 3, data4: 4, data5: 5,data6: 6, data7: 7, data8: 8 },
        {id: 3, data1: 1, data2: 2, data3: 3, data4: 4, data5: 5,data6: 6, data7: 7, data8: 8 },
        {id: 4, data1: 1, data2: 2, data3: 3, data4: 4, data5: 5,data6: 6, data7: 7, data8: 8 },
        {id: 5, data1: 1, data2: 2, data3: 3, data4: 4, data5: 5,data6: 6, data7: 7, data8: 8 },
        {id: 6, data1: 1, data2: 2, data3: 3, data4: 4, data5: 5,data6: 6, data7: 7, data8: 8 },
        {id: 7, data1: 1, data2: 2, data3: 3, data4: 4, data5: 5,data6: 6, data7: 7, data8: 8 },
      ]
    }
  },


  methods: {

    // 弹框底部的合计
    addFooter({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['data3', 'data4', 'data5', 'data6','data7'].includes(column.property)) {
            return this.sum(data, column.property, columnIndex)
          }
          return null
        })
      ]
    },
    sum(data, type, columnIndex){
      let total = 0
      data.map(item => {
        let value = item[type]
        if(!value || isNaN(value)){
          value = 0
        }
        total += parseFloat(value)
      })
      return total
    },

    //弹框打开
    open(){
      this.visibal = true
      this.getTableList()
    },

    //弹框关闭
    close(){
      this.visibal = false
    },
    
    //点击确认按钮后
    confirm(){


      this.visibal = false
    },

    deleteItem(row){
      console.log(row)
    },

    currentRow({row}){
      console.log(row.id)
    },

    openPClaimModal(){
      this.close()
      this.$refs.PClaimModal.open()
    },

    async getTableList(){
      console.log(111)
      let obj = {}
      let res = await claimedFund(obj)
      console.log(res)
    }
  },
}
</script>

<style lang="less" scoped>

.el-input-number{
  width: 100px;
}
// /deep/.vxe-table--header{
//   width: 968px !important;
// }

// /deep/.vxe-table--body{
//   width: 968px !important;
// }

</style>