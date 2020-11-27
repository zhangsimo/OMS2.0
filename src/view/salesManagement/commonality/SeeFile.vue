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
          :data="allList.priceLever"
         >
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column field="strategyName" title="级别名称"></vxe-table-column>
          <vxe-table-column title="级别销价" >
            <template v-slot="{ row }">
              <span v-if="row.strategyName == '最低售价'">{{ row.sellPrice | priceFilters }} - {{ row.minRequiredQty }}</span>
              <span v-else>{{ row.sellPrice | priceFilters }}</span>
              <!-- <el-input-number
                :disabled="true"
                v-model="row.sellPrice"
                :controls="false"
                size="small"
                :precision="2"
              /> -->
              </template>
          </vxe-table-column>
          <vxe-table-column field="updateUname" title="更新人" ></vxe-table-column>
          <vxe-table-column field="updateTime" title="更新日期" ></vxe-table-column>
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
          :data="allList.orgStock"
        >
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column field="partCode" title="配件编码"></vxe-table-column>
          <vxe-table-column field="partName" title="配件名称" ></vxe-table-column>
          <vxe-table-column field="unit" title="单位" ></vxe-table-column>
          <vxe-table-column field="storeName" title="仓库" ></vxe-table-column>
          <vxe-table-column field="stockQty" title="库存数量" ></vxe-table-column>
          <vxe-table-column field="occupyQty" title="订单占用" ></vxe-table-column>
          <vxe-table-column field="outableQty" title="可开单数量" ></vxe-table-column>
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
          :data="allList.chainStock"
        >
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column field='partCode' title="配件编码"></vxe-table-column>
          <vxe-table-column field="companyName" title="公司名称" ></vxe-table-column>
          <vxe-table-column field="storeName" title="仓库" ></vxe-table-column>
          <vxe-table-column field="outableQty" title="可售数量" ></vxe-table-column>
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
          :data="allList.sellHistory"
        >
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column field="partCode" title="配件编码"></vxe-table-column>
          <vxe-table-column field="partName" title="配件名称" ></vxe-table-column>
          <vxe-table-column field="companyName" title="公司" ></vxe-table-column>
          <vxe-table-column field="guestName" title="客户" ></vxe-table-column>
          <vxe-table-column field="finishDate" title="销售日期" ></vxe-table-column>
          <vxe-table-column field="sellQty" title="数量" ></vxe-table-column>
          <vxe-table-column field="sellPrice" title="销价" ></vxe-table-column>
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
                allList:{},//获取到全部数据
            }
        },
        methods:{
            openModal(v){
                this.fileShow = true
                let data = {};
                data.partId = this.data.partId;
                if(v){
                    data.guestId=v
                }
                getDetails(data).then( res => {
                    if(res.code  === 0){
                       this.allList = res.data;
                       this.allList.priceLever = this.allList.priceLever.filter(item => item.strategyName!='最低售价'||(item.strategyName=='最低售价'&&item.removeLimit!=1))

                    }

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
