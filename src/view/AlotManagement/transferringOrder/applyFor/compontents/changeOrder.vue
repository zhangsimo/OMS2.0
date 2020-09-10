<template>
  <vxe-modal title="订单调整" class="vxeModel" v-model="changeOrderModel" width="1000" hide-footer mask-closable :position="{top: 50}">
    <template v-slot>
      <div class="pb10">
        <Button type='primary' size="small" class="mr20">保存</Button>
        <span>配件查询：</span>
        <vxe-input v-model="partName" class="w250 mr10" size="mini" placeholder="请输入配件内码/编码/名称/OE码"></vxe-input>
        <span>配件查询：</span>
        <Select
        filterable
        clearable
        class="w120 mr10"
        v-model="partBrand"
        placeholder="品牌"
        transfer
        size="small"
        >
          <Option
          v-for="item in partBrandList"
          :value="item.name"
          :key="item.id"
          >{{ item.name }}</Option
          >
        </Select>
        <Button size="small" class="mr20" type='default'>查询</Button>
        <Checkbox v-model="Adjusted">显示已调整</Checkbox>
      </div>
      <vxe-table
        ref="xTable"
        border
        resizable
        size="mini"
        :data="tbdata"
        :edit-config="{trigger: 'click', mode: 'cell'}">
        <vxe-table-column  show-overflow="tooltip" type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="partCode" title="配件内码" width="100"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="partCode" title="配件编码" width="100"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="partName" title="配件名称"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="partBrand" title="品牌" width="100"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="hasInQty" title="OEM码" width="100"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="hasInQty" title="申请数量" width="100"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="hasInQty" title="受理数量" width="100"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="hasInQty" title="已取消数量" width="100"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="hasInQty" title="本次取消数量" width="100"></vxe-table-column>
      </vxe-table>
    </template>
  </vxe-modal>
  <!--<Modal v-model="changeOrderModel" title="订单调整" width="1000" footer-hide>-->
    <!--<div>-->
      <!--<Button type='primary' size="small" class="mr10">保存</Button>-->
      <!--<span>配件查询：</span>-->
      <!--<vxe-input v-model="partName" class="w250 mr10" size="mini" placeholder="请输入配件内码/编码/名称/OE码"></vxe-input>-->
      <!--<span>配件查询：</span>-->
      <!--<Select-->
        <!--filterable-->
        <!--clearable-->
        <!--class="w120 mr10"-->
        <!--v-model="partBrand"-->
        <!--placeholder="品牌"-->
        <!--size="small"-->
      <!--&gt;-->
        <!--<Option-->
          <!--v-for="item in partBrandList"-->
          <!--:value="item.name"-->
          <!--:key="item.id"-->
        <!--&gt;{{ item.name }}</Option-->
        <!--&gt;-->
      <!--</Select>-->
      <!--<Button size="small" class="mr20" type='default'>查询</Button>-->
      <!--<Checkbox v-model="Adjusted">显示已调整</Checkbox>-->
    <!--</div>-->
    <!--<vxe-table-->
      <!--ref="xTable"-->
      <!--border-->
      <!--resizable-->
      <!--size="mini"-->
      <!--:data="tbdata"-->
      <!--:edit-config="{trigger: 'click', mode: 'cell'}">-->
      <!--<vxe-table-column  show-overflow="tooltip" type="seq" width="60" title="序号" fixed="left"></vxe-table-column>-->
      <!--<vxe-table-column  show-overflow="tooltip" field="partCode" title="配件内码" fixed="left" width="100"></vxe-table-column>-->
      <!--<vxe-table-column  show-overflow="tooltip" field="partCode" title="配件编码" fixed="left" width="100"></vxe-table-column>-->
      <!--<vxe-table-column  show-overflow="tooltip" field="partName" title="配件名称" fixed="left" width="100"></vxe-table-column>-->
      <!--<vxe-table-column  show-overflow="tooltip" field="partBrand" title="品牌" fixed="left" width="100"></vxe-table-column>-->
      <!--<vxe-table-column  show-overflow="tooltip" field="hasInQty" title="OEM码" width="100"></vxe-table-column>-->
      <!--<vxe-table-column  show-overflow="tooltip" field="hasInQty" title="申请数量" width="100"></vxe-table-column>-->
      <!--<vxe-table-column  show-overflow="tooltip" field="hasInQty" title="受理数量" width="100"></vxe-table-column>-->
      <!--<vxe-table-column  show-overflow="tooltip" field="hasInQty" title="已取消数量" width="100"></vxe-table-column>-->
      <!--<vxe-table-column  show-overflow="tooltip" field="hasInQty" title="本次取消数量" width="100"></vxe-table-column>-->
    <!--</vxe-table>-->
  <!--</Modal>-->
</template>

<script>
  import {
    getPartBrand
  } from "@/api/business/stockSearch";
  import { getAllotApplyDetail} from '../../../../../api/AlotManagement/transferringOrder';
	export default {
		name: "changeOrder",
    data(){
		  return {
        changeOrderModel:false,
        partBrandList:[],
        partName:'',
        partBrand:'',
        Adjusted:false,
        tbdata:[]
      }
    },
    methods:{
		  init(){
		    this.changeOrderModel = true;
		    if(this.partBrandList.length==0){
		      this.getBand();
        }
      },
      async getBand() {
        let res = await getPartBrand({ pageSize: 10000 });
        if (res.code === 0) {
          let arr = [];
          let arrData = res.data.content || [];
          arrData.forEach(item => {
            arr.push(...item.children);
          });
          this.partBrandList = arr;
        }
      },
      async getDetail(id){
		    let rep = await getAllotApplyDetail({mainId:id})
      }
    }
	}
</script>

<style lang="less">
.vxeModel{
  .vxe-modal--header{
    background: #f00;
    color: #fff;
    text-align: center;
    padding: 15px 0px;
    .vxe-modal--title{
      font-size: 16px!important;
      font-weight: 400;
    }
  }
  .vxe-modal--box{
    border: none!important;
  }
}
</style>
