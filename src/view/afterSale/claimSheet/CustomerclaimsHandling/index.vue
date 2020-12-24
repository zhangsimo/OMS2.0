<template>
  <div class="customer">
    <div class="top">
      <Form inline :show-message="false" ref="formPlan" :label-width="100" class="form">
        <FormItem label="提交日期：" prop="billType">
          <!--                          :disabled=" form.xinzeng || form.status.value !== 0"-->
          <DatePicker
              @on-change="getDataQuick"
              :value="search.orderDate"
              type="daterange"
              placement="bottom-start"
              placeholder="选择日期"
              class="w200 mr10"
              clearable
            >
            </DatePicker>
        </FormItem>
        <FormItem label="理赔单位：" prop="remark"> 
            <Input 
              v-model.trim="search.guestName"
              class="w160"
            ></Input>
        </FormItem>
        <span style="margin-top:2px">配件编码/名称/内码:</span><Input v-model.trim="search.partCode" class="ipt"></Input>
        </FormItem>
        
            <span class="mr10">品牌:</span>
            <Select
              class="w120"
              clearable
              label-in-value
              filterable
              @on-change="select1"
              v-model.trim="search.partBrand"
              placeholder="请选择品牌"
            >
              <Option v-for="item in bandArr" :value="item.label" :key="item.id">{{ item.label }}</Option>
            </Select>
         
          <!--                          :disabled="form.status.value !== 0"-->  
            <span style="margin-top:2px;margin-left:15px">理赔单号:</span><Input class="ipt" v-model.trim="search.claimsCode"></Input>   
        
        <Button style="margin-top:2px" @click="ok">查询</Button>
      </Form>
    </div>
    <div class="nav">
      <Button class="btn" @click="claim(1)">原货退还</Button><Button class="btn" @click="claim(2)">换货处理</Button><Button class="btn" @click="claim(3)">退款处理</Button><Button class="btn" @click="claim(4)">原物销毁</Button><Button class="btn" @click="getExport">导出</Button>
    </div>
    <div class="con">
      <vxe-table
                  v-if="showit"
                 border
      auto-resize
      resizable
      :data="claimSupplierData"
      size="mini"
      ref="xTable"
      show-overflow="title"
      class="mt20"
      :edit-rules="validRules"
      :edit-config="{trigger: 'click', mode: 'cell'}"
      @checkbox-all="claimSupplierSel"
      @checkbox-change="claimSupplierSel"
      @checkbox-cancel="claimSupplierSel"
                >
                  <vxe-table-column
                    show-overflow="tooltip"
                    type="seq"
                    width="60"
                    title="序号"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    type="checkbox"
                    width="60"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="orderDate"
                    title="提交日期"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="serviceId"
                    title="理赔单号"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="partBrand"
                    title="理赔单位"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="partInnerId"
                    title="配件内码"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="partCode"
                    title="配件编码"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="partName"
                    title="配件名称"
                    width="100"
                   
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="oemCode"
                    title="OEM码"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="partBrand"
                    title="品牌"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="afterSaleReason"
                    title="理赔原因"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                  field="afterSaleQty"
                    show-overflow="tooltip"
                    title="理赔数量"
                    width="100"
                  >
                    <template v-slot="{ row }">
                      <span>{{ row.carBrandName }} {{ row.carModelName }}</span>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="processedQty"
                    title="已处理数量"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="untreatedQty"
                    title="未处理数量"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="thisTreatmentQty"
                    title="本次处理数量"
                    width="120"
                     :edit-render="{ name: 'input', autoselect: true }"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="remark"
                    title="备注"
                    width="120"
                     :edit-render="{ name: 'input', autoselect: true }"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="returnQty"
                    title="原货退还"
                    width="120"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="replaceQty"
                    title="换货处理"
                    width="120"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="refundQty"
                    title="退款处理"
                    width="120"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="destructionQty"
                    title="原物销毁"
                    width="120"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="unit"
                    title="单位"
                    width="120"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="carModelName"
                    title="品牌车型"
                    width="120"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="spec"
                    title="规格"
                    width="120"
                  ></vxe-table-column>
                </vxe-table>

                <!--  -->
    </div>
  </div>
</template>

<script src="./index.ts">
</script>

<style scoped lang="less">
.customer{
  width: 100%;
  height: 100%;
  background: white;
  padding-top: 5px;
  .top{
    border-bottom: 4px solid skyblue;

  }
  .form{
    margin-top: 20px;
  }
}
.ipt{
  width: 170px;
  margin:0 10px;
}
.btn{
   margin:3px 15px;
}
</style>