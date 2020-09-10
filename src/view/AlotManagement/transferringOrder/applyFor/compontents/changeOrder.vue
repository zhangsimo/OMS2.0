<template>
  <vxe-modal title="订单调整" class="vxeModel" v-model="changeOrderModel" width="1000" hide-footer mask-closable :position="{top: 50}">
    <template v-slot>
      <div class="pb10">
        <Button type='primary' size="small" class="mr20" @click="saveCancelQty">保存</Button>
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
        class="cancelTable"
        height="300"
        :loading="loading"
        keep-source
        size="mini"
        :data="tbdata"
        :edit-rules="validRules"
        :edit-config="{trigger: 'click', mode: 'cell',showStatus: true}">
        <vxe-table-column  show-overflow="tooltip" type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="partInnerId" title="配件内码" width="100"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="partCode" title="配件编码" width="100"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="partName" title="配件名称" width="156"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="partBrand" title="品牌" width="100"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="oemCode" title="OEM码" width="100"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="applyQty" title="申请数量" width="80"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="hasAcceptQty" title="受理数量" width="80"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="hasCancelQty" title="已取消数量" width="80"></vxe-table-column>
        <vxe-table-column  show-overflow="tooltip" field="cancelQty" title="本次取消数量" width="120" :edit-render="{name: 'input', props: {type: 'integer'}}">
        </vxe-table-column>
      </vxe-table>
    </template>
  </vxe-modal>
</template>

<script>
  import {
    getPartBrand
  } from "@/api/business/stockSearch";
  import { getAllotApplyDetail,setAllotApplyDetail} from '../../../../../api/AlotManagement/transferringOrder';
	export default {
		name: "changeOrder",
    data(){
		  const cancelQtyValid = ({ cellValue,row }) =>{
        return new Promise((resolve, reject) => {
          let num = parseInt(row.applyQty)-parseInt(row.hasAcceptQty)-parseInt(row.hasCancelQty);
          console.log(num)
          if (cellValue && (parseInt(cellValue)>num)) {
            reject(new Error(`只能输入小于${num}`))
          } else {
            resolve()
          }
        })
      }
		  return {
        changeOrderModel:false,
        partBrandList:[],
        partName:'',
        partBrand:'',
        Adjusted:false,
        tbdata:[],
        loading:false,
        validRules: {
          cancelQty: [
            { validator: cancelQtyValid}
          ]
        }
      }
    },
    methods:{
		  init(id){
		    setTimeout(() => {
          this.changeOrderModel = true;
        },500)

		    if(this.partBrandList.length==0){
		      this.getBand();
        }
		    this.getDetail(id)
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
		    this.loading = true;
		    let rep = await getAllotApplyDetail({mainId:id});
		    this.loading = false;
		    if(rep.code==0){
		      this.tbdata = rep.data||[];
        }
      },
      async saveCancelQty(){
        const errMap = await this.$refs.xTable.validate().catch(errMap => errMap)
        if (errMap) {
          return
        }
        let rep = await setAllotApplyDetail(this.tbdata);
        if(rep.code==0){
          this.$message.success("调整成功");
        }
      }
    }
	}
</script>

<style lang="less">
.vxeModel{
  .vxe-modal--header{
    background: #fd5c5c;
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
  .cancelTable{
    .vxe-body--column.col--valid-error .vxe-cell--valid{
      width: 120px;
      .vxe-cell--valid-msg{
        padding: 4px;
      }
    }
  }
}
</style>
