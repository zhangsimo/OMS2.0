<template>
<Modal footer-hide title="详细信息" v-model="fileShow" width="1000px">
<div>
  <Tabs type="card" name="list">
    <TabPane  label="级别价格" tab="list">
      <div class="marketBox">
        <vxe-table
          auto-resize
          border
          height="500"
          resizable
          align="center"
          highlight-hover-row
          :data="tableData"
         >
          <vxe-table-column type="index" title="序号" width="50"></vxe-table-column>
          <vxe-table-column title="级别名称"></vxe-table-column>
          <vxe-table-column field="name" title="级别销假" ></vxe-table-column>
          <vxe-table-column field="name" title="更新人" ></vxe-table-column>
          <vxe-table-column field="name" title="更新日期" ></vxe-table-column>
        </vxe-table>
      </div>
    </TabPane>
    <TabPane  label="本店库存" tab="list"><div>
      <div class="marketBox">
        <vxe-table
          auto-resize
          height="500"
          border
          resizable
          align="center"
          highlight-hover-row
          :data="tableData"
        >
          <vxe-table-column type="index" title="序号" width="50"></vxe-table-column>
          <vxe-table-column title="配件编码"></vxe-table-column>
          <vxe-table-column field="name" title="配件名称" ></vxe-table-column>
          <vxe-table-column field="name" title="公司" ></vxe-table-column>
          <vxe-table-column field="name" title="客户" ></vxe-table-column>
          <vxe-table-column field="name" title="销售日期" ></vxe-table-column>
          <vxe-table-column field="name" title="数量" ></vxe-table-column>
          <vxe-table-column field="name" title="销假" ></vxe-table-column>
        </vxe-table>
      </div>
    </div></TabPane>
    <TabPane  label="连锁库存" tab="list">
      <div class="marketBox">
        <vxe-table
          border
          auto-resize
          resizable
          align="center"
          height="500"
          highlight-hover-row
          :data="tableData"
        >
          <vxe-table-column type="index" title="序号" width="50"></vxe-table-column>
          <vxe-table-column title="公司名称"></vxe-table-column>
          <vxe-table-column field="name" title="仓库" ></vxe-table-column>
          <vxe-table-column field="name" title="库存数量" ></vxe-table-column>
          <vxe-table-column field="name" title="可售数量" ></vxe-table-column>
        </vxe-table>
      </div>
    </TabPane>
    <TabPane  label="销售记录" tab="list">
      <div class="marketBox">
        <vxe-table
          border
          auto-resize
          resizable
          align="center"
          height="500"
          highlight-hover-row
          :data="tableData"
        >
          <vxe-table-column type="index" title="序号" width="50"></vxe-table-column>
          <vxe-table-column title="配件编码"></vxe-table-column>
          <vxe-table-column field="name" title="配件名称" ></vxe-table-column>
          <vxe-table-column field="name" title="公司" ></vxe-table-column>
          <vxe-table-column field="name" title="客户" ></vxe-table-column>
          <vxe-table-column field="name" title="销售日期" ></vxe-table-column>
          <vxe-table-column field="name" title="数量" ></vxe-table-column>
          <vxe-table-column field="name" title="销价" ></vxe-table-column>
        </vxe-table>
      </div>
    </TabPane>
  </Tabs>
</div>
</Modal>
</template>

<script>
  import {getDetails} from '@/api/salesManagment/salesOrder'
    export default {
        name: "SeeFile",
        props:{
            data:''
        },
        data(){
            return {
                fileShow: false,//模态框
                tableData:[],//表格数据
            }
        },
        methods:{
            openModal(){
                this.fileShow = true
                let data = {}
                data.partId = this.data.partId
                getDetails(data).then( res => {
                    if(res.code  === 0){

                    }
                    console.log(res ,999)

                })

            }
        }
    }
</script>

<style scoped>
.marketBox {
  padding-bottom: 10px;
}
</style>
