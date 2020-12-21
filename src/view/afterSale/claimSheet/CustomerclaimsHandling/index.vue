<template>
  <div class="customer">
    <div class="top">
      <Form inline :show-message="false" ref="formPlan" :label-width="100" class="form">
        <FormItem label="提交日期：" prop="billType">
          <!--                          :disabled=" form.xinzeng || form.status.value !== 0"-->
          <DatePicker
            v-model="form.createTime"
            format="yyyy-MM-dd HH:mm:ss"
            type="date"
            class="w160"
          ></DatePicker>
        </FormItem>
        <FormItem label="理赔单位：" prop="remark"> 
            <Input 
              v-model="form.remark"
              class="w160"
            ></Input>
        </FormItem>
        <span style="margin-top:2px">配件编码/名称/内码:</span><Input v-model="form.orderMan" class="ipt"></Input>
        </FormItem>
        品牌:
        <Select
                v-model="form.status"
                @on-change="getDataType"
                class="w90 mr10"
              >
                <Option
                  v-for="item in form.purchaseTypeArr"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}
                  </Option
                >
          </Select>
        
          <!--                          :disabled="form.status.value !== 0"-->  
            <span style="margin-top:2px">理赔单号:</span><Input class="ipt" v-model="form.serviceId"></Input>   
        
        <Button style="margin-top:2px" @click="query">查询</Button>
      </Form>
    </div>
    <div class="nav">
      <Button class="btn" @click="kickback">原货退还</Button><Button class="btn" @click="barter">换货处理</Button><Button class="btn" @click="reimburse">退款处理</Button><Button class="btn" @click="destory">原物销毁</Button><Button class="btn" @click="getExport">导出</Button>
    </div>
    <div class="con">
      <vxe-table
                  v-if="showit"
                  border
                  resizable
                  ref="xTable2"
                  size="mini"
                  align="center"
                
                  highlight-current-row
                  highlight-hover-row
                  :keyboard-config="{
                    isArrow: true,
                    isDel: true,
                    isEnter: true,
                    isTab: true,
                    isEdit: true,
                  }"
                  @keydown="keydown"
                  @current-change="currentChangeEvent"
                  @select-all="selectAllEvent"
                  @select-change="selectChangeEvent"
                  :height="rightTableHeight"
                  :data="tableData"
                  :edit-config="
                    form.tablestatus.value === 0
                      ? { trigger: 'click', mode: 'cell' }
                      : {}
                  "
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
                    field="partCode"
                    title="提交日期"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="partName"
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
                    field="unit"
                    title="配件内码"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="orderQty"
                    title="配件编码"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="remark"
                    title="配件名称"
                    width="100"
                   
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="storeStockQty"
                    title="OEM码"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="outableQty"
                    title="品牌"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="stockOutQty"
                    title="理赔原因"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
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
                    field="oemCode"
                    title="已处理数量"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="spec"
                    title="未处理数量"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="partInnerIda"
                    title="本次处理数量"
                    width="120"
                     :edit-render="{
                      name: 'input',
                      autoselect: true,
                      attrs: { type: 'number' },
                      events: { keyup: keydownEvent },
                    }"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="partInnerIds"
                    title="备注"
                    width="120"
                     :edit-render="{ name: 'input', autoselect: true }"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="partInnerId3"
                    title="原货退还"
                    width="120"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="partInnerId1"
                    title="换货处理"
                    width="120"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="partInnerId2"
                    title="退款处理"
                    width="120"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="partInnerId4"
                    title="原物销毁"
                    width="120"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="partInnerId5"
                    title="单位"
                    width="120"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="partInnerId6"
                    title="品牌车型"
                    width="120"
                  ></vxe-table-column>
                  <vxe-table-column
                    show-overflow="tooltip"
                    field="partInnerId7"
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