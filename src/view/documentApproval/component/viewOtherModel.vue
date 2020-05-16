<template>
  <Modal
    v-model="model"
    :title="modelTitle"
    width="1200px"
  >
    <div v-if="modelTitle=='盘亏出库'">
      <p>申请单号：<Input disabled :value="mainData.serviceId" placeholder="申请单号" style="width: 300px" /></p>
      <table class="table-1" style="width: 100%" cellspacing="0" cellpadding="0">
        <tr>
          <td class="table-th">供应商</td>
          <td>{{mainData.orgName}}</td>
          <td class="table-th">光联单号</td>
          <td>{{mainData.code}}</td>
          <td class="table-th">创建日期</td>
          <td>{{mainData.createTime}}</td>
        </tr>
        <tr>
          <td class="table-th">出库仓库</td>
          <td>{{getStoreName}}</td>
          <td class="table-th">票据类型</td>
          <td>{{getBillTypeName}}</td>
          <td class="table-th">备注</td>
          <td>{{mainData.remark}}</td>
        </tr>
        <tr>
          <td class="table-th">来源</td>
          <td>{{mainData.source===0?"OMS盘点":"WMS盘点"}}</td>
          <td class="table-th">合计总金额</td>
          <td>{{mainData.exhibitAmt}}</td>
          <td class="table-th">出库单号</td>
          <td>{{mainData.serviceId}}</td>
        </tr>
      </table>
      <p class="p10 fs14">单据明细</p>
      <vxe-table
        border
        resizable
        show-footer
        @select-all="selectAll"
        @select-change="selectVxeData"
        size="mini"
        height="300"
        :data="mainData.detailVOList"
        :footer-method="addFooter"
        :edit-config="{ trigger: 'click', mode: 'cell' }"
      >
        <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="partCode" title="配件编码" width="100"></vxe-table-column>
        <vxe-table-column field="partName" title="配件名称" width="100"></vxe-table-column>
        <vxe-table-column field="partBrand" title="品牌" width="100"></vxe-table-column>
        <vxe-table-column field="unit" title="单位" width="100"></vxe-table-column>
        <vxe-table-column field="sysQty" title="系统数量" width="100"></vxe-table-column>
        <vxe-table-column field="trueQty" title="实盘数量" width="100"></vxe-table-column>
        <vxe-table-column field="stockOutQty" title="出库数量" width="100"></vxe-table-column>
        <vxe-table-column field="exhibitPrice" title="出库单价" width="100"></vxe-table-column>
        <vxe-table-column field="exhibitAmt" title="出库金额" width="100">
        </vxe-table-column>

        <vxe-table-column field="carModelName" title="品牌车型" width="100"></vxe-table-column>
        <vxe-table-column field="oemCode" title="OE码" width="100"></vxe-table-column>
        <vxe-table-column field="spec" title="规格" width="100"></vxe-table-column>
      </vxe-table>
    </div>
    <div v-if="modelTitle=='盘盈入库'">
      <p>申请单号：<Input disabled :value="mainData.serviceId" placeholder="申请单号" style="width: 300px" /></p>
      <table class="table-1" style="width: 100%" cellspacing="0" cellpadding="0">
        <tr>
          <td class="table-th">供应商</td>
          <td>{{mainData.orgName}}</td>
          <td class="table-th">光联单号</td>
          <td>{{mainData.code}}</td>
          <td class="table-th">创建日期</td>
          <td>{{mainData.createTime}}</td>
        </tr>
        <tr>
          <td class="table-th">入库仓库</td>
          <td>{{getStoreName}}</td>
          <td class="table-th">票据类型</td>
          <td>{{getBillTypeName}}</td>
          <td class="table-th">备注</td>
          <td>{{mainData.remark}}</td>
        </tr>
        <tr>
          <td class="table-th">来源</td>
          <td>{{mainData.source===0?"OMS盘点":"WMS盘点"}}</td>
          <td class="table-th">合计总金额</td>
          <td>{{mainData.exhibitAmt}}</td>
          <td class="table-th">入库单号</td>
          <td>{{mainData.serviceId}}</td>
        </tr>
      </table>
      <p class="p10 fs14">单据明细</p>
      <vxe-table
        border
        resizable
        show-footer
        @select-all="selectAll"
        @select-change="selectVxeData"
        size="mini"
        height="300"
        :data="mainData.detailVOList"
        :footer-method="addFooter"
        :edit-config="{ trigger: 'click', mode: 'cell' }"
      >
        <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="partCode" title="配件编码" width="100"></vxe-table-column>
        <vxe-table-column field="partName" title="配件名称" width="100"></vxe-table-column>
        <vxe-table-column field="partBrand" title="品牌" width="100"></vxe-table-column>
        <vxe-table-column field="unit" title="单位" width="100"></vxe-table-column>
        <vxe-table-column field="sysQty" title="系统数量" width="100"></vxe-table-column>
        <vxe-table-column field="trueQty" title="实盘数量" width="100"></vxe-table-column>
        <vxe-table-column field="stockOutQty" title="入库数量" width="100"></vxe-table-column>
        <vxe-table-column field="exhibitPrice" title="入库单价" width="100"></vxe-table-column>
        <vxe-table-column field="exhibitAmt" title="入库金额" width="100">
        </vxe-table-column>

        <vxe-table-column field="carModelName" title="品牌车型" width="100"></vxe-table-column>
        <vxe-table-column field="oemCode" title="OE码" width="100"></vxe-table-column>
        <vxe-table-column field="spec" title="规格" width="100"></vxe-table-column>
      </vxe-table>
    </div>
    <div slot='footer'></div>
  </Modal>
</template>

<script>
  import {findByCodeDetail,findByStore} from "../../../api/documentApproval/documentApproval/documentApproval";

  export default {
		name: "viewOtherModel",
    props:{
      mainStore:{
        type:Array,
        default:[]
      },
      billTypeArr:{
        type:Array,
        default:[]
      }
    },
    data(){
		  return {
		    model:false,
        mainData:null,
        modelTitle:''
      }
    },
    computed:{
		  getStoreName(){
        let storeName = this.mainStore.filter(item => item.id==this.mainData.storeId);
        return storeName.length>0?storeName[0].name:"";
      },
      getBillTypeName(){
        let storeName = this.billTypeArr.filter(item => item.id==this.mainData.billTypeId);
        return storeName.length>0?storeName[0].itemName:"";
      }
    },
    methods:{
		  async init(row){
		    this.model = true;
		    this.modelTitle = row.applyTypeName||"";
		    let rep = await findByCodeDetail({'code':row.applyNo});
        if(rep.code==0){
          this.mainData = rep.data||{};
        }
      },

      //计算合计
      addFooter({ columns, data }) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return "合计";
            }
            if (
              [
                "exhibitPrice",
                "exhibitAmt",
              ].includes(column.property)
            ) {
              return this.sum(data, column.property, columnIndex);
            }
            return null;
          })
        ];
      },
      sum(data, type, columnIndex) {
        let total = 0;
        data.map(item => {
          let value = item[type];
          if (!value) {
            value = 0;
          }
          total += parseFloat(value);
        });
        return total;
      },
    }
	}
</script>

<style scoped lang="less">
  .table-1{
    border-left: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    cell-padding:0px;
    margin-top: 10px;
    td{
      border-top: 1px solid #ddd;
      border-right: 1px solid #ddd;
      width: 21%;
      padding: 8px;
      box-sizing: border-box;
      font-size: 12px;
    }
    .table-th{
      background: #f8f8f8;
      width: 12%;
      text-align: center;
    }
  }
</style>
