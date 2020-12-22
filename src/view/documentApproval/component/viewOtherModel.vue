<template>
  <Modal
    v-model="model"
    :title="modelTitle"
    width="1200px"
  >
    <div v-show="modelTitle=='盘亏出库'">
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
          <td>{{mainData.exhibitAmt|priceFilters}}</td>
          <td class="table-th">出库单号</td>
          <td>{{mainData.serviceId}}</td>
        </tr>
      </table>
      <p class="p10 fs14">单据明细</p>
      <vxe-table
        border
        resizable
        show-footer
        size="mini"
        height="300"
        :data="mainData.detailVOList"
        :footer-method="addFooter"
      >
        <vxe-table-column fixed="left" type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column fixed="left" field="partCode" title="配件编码" width="100"></vxe-table-column>
        <vxe-table-column fixed="left" field="partName" title="配件名称" width="150"></vxe-table-column>
        <vxe-table-column fixed="left" field="partBrand" title="品牌" width="100"></vxe-table-column>
        <vxe-table-column field="unit" title="单位" width="100"></vxe-table-column>
        <vxe-table-column field="sysQty" title="系统数量" width="100"></vxe-table-column>
        <vxe-table-column field="trueQty" title="实盘数量" width="100"></vxe-table-column>
        <vxe-table-column field="exhibitQty" title="出库数量" width="100"></vxe-table-column>
        <vxe-table-column field="exhibitPrice" title="出库单价" width="100"></vxe-table-column>
        <vxe-table-column field="exhibitAmt" title="出库金额" width="100">
        </vxe-table-column>

        <vxe-table-column field="carModelName" title="品牌车型" width="100"></vxe-table-column>
        <vxe-table-column field="oemCode" title="OE码" width="100"></vxe-table-column>
        <vxe-table-column field="spec" title="规格" width="100"></vxe-table-column>
      </vxe-table>
    </div>
    <div v-show="modelTitle=='盘盈入库'">
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
          <td>{{mainData.exhibitAmt|priceFilters}}</td>
          <td class="table-th">入库单号</td>
          <td>{{mainData.serviceId}}</td>
        </tr>
      </table>
      <p class="p10 fs14">单据明细</p>
      <vxe-table
        border
        resizable
        show-footer
        size="mini"
        height="300"
        :data="mainData.detailVOList"
        :footer-method="addFooter"
      >
        <vxe-table-column fixed="left" type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column fixed="left" field="partCode" title="配件编码" width="100"></vxe-table-column>
        <vxe-table-column fixed="left" field="partName" title="配件名称" width="150"></vxe-table-column>
        <vxe-table-column fixed="left" field="partBrand" title="品牌" width="100"></vxe-table-column>
        <vxe-table-column field="unit" title="单位" width="100"></vxe-table-column>
        <vxe-table-column field="sysQty" title="系统数量" width="100"></vxe-table-column>
        <vxe-table-column field="trueQty" title="实盘数量" width="100"></vxe-table-column>
        <vxe-table-column field="exhibitQty" title="入库数量" width="100"></vxe-table-column>
        <vxe-table-column field="exhibitPrice" title="入库单价" width="100"></vxe-table-column>
        <vxe-table-column field="exhibitAmt" title="入库金额" width="100">
        </vxe-table-column>

        <vxe-table-column field="carModelName" title="品牌车型" width="100"></vxe-table-column>
        <vxe-table-column field="oemCode" title="OE码" width="100"></vxe-table-column>
        <vxe-table-column field="spec" title="规格" width="100"></vxe-table-column>
      </vxe-table>
    </div>
    <div v-show="modelTitle=='采购计划单'">
      <p>申请单号：<Input disabled :value="mainData.serviceId" placeholder="申请单号" style="width: 300px" /></p>
      <table class="table-1" style="width: 100%" cellspacing="0" cellpadding="0">
        <tr>
          <td class="table-th">供应商</td>
          <td>{{mainData.guestName}}</td>
          <td class="table-th">计划采购日期</td>
          <td>{{mainData.orderDate}}</td>
          <td class="table-th">计划员</td>
          <td>{{mainData.orderMan}}</td>
        </tr>
        <tr>
          <td class="table-th">票据类型</td>
          <td>{{getBillTypeName}}</td>
          <td class="table-th">备注</td>
          <td>{{mainData.remark}}</td>
          <td class="table-th">直发门店</td>
          <td>{{mainData.directCompanyName}}</td>
        </tr>
        <tr>
          <td class="table-th">其他费用</td>
          <td>{{mainData.otherAmt}}</td>
          <td class="table-th">合计总金额</td>
          <td>{{mainData.totalAmt|priceFilters}}</td>
          <td class="table-th">单号</td>
          <td>{{mainData.serviceId}}</td>
        </tr>
      </table>
      <p class="p10 fs14">单据明细</p>
      <vxe-table
        border
        resizable
        show-footer
        size="mini"
        height="300"
        :data="mainData.details"
        :footer-method="addFooter2"
      >
        <vxe-table-column fixed="left" type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column fixed="left" field="partCode" title="配件编码" width="100"></vxe-table-column>
        <vxe-table-column fixed="left" field="partName" title="配件名称" width="150"></vxe-table-column>
        <vxe-table-column fixed="left" field="partBrand" title="品牌" width="100"></vxe-table-column>

        <vxe-table-column field="totalStockQty" title="连锁库存" width="100"></vxe-table-column>
        <vxe-table-column field="masterStockQty" title="总部库存" width="100"></vxe-table-column>
        <vxe-table-column field="branchStockQty" title="门店库存" width="100"></vxe-table-column>
        <vxe-table-column field="onWayQty" title="采购在途库存" width="100"></vxe-table-column>
        <vxe-table-column field="unsalableQty" title="滞销库存" width="100">
        </vxe-table-column>

        <vxe-table-column field="orderQty" title="计划采购数量" width="100"></vxe-table-column>
        <vxe-table-column field="orderPrice" title="计划采购单价" width="100"></vxe-table-column>
        <vxe-table-column field="orderAmt" title="计划采购金额" width="100"></vxe-table-column>
        <vxe-table-column field="remark" title="备注" width="100"></vxe-table-column>
        <vxe-table-column field="noTaxPrice" title="不含税单价" width="100"></vxe-table-column>
        <vxe-table-column field="noTaxAmt" title="不含税金额" width="100"></vxe-table-column>
        <vxe-table-column field="recentPrice" title="最近采购单价" width="100"></vxe-table-column>
        <vxe-table-column field="diffAmt" title="单价差" width="100"></vxe-table-column>
        <vxe-table-column field="" title="库存上限" width="100"></vxe-table-column>
        <vxe-table-column field="" title="库存下限" width="100"></vxe-table-column>
        <vxe-table-column field="carModelName" title="品牌车型" width="100"></vxe-table-column>
        <vxe-table-column field="unit" title="单位" width="100"></vxe-table-column>
        <vxe-table-column field="oemCode" title="OE码" width="100"></vxe-table-column>
        <vxe-table-column field="spec" title="规格" width="100"></vxe-table-column>
        <vxe-table-column field="planCancelQty" title="计划取消数量" width="100"></vxe-table-column>
      </vxe-table>
    </div>
    <div v-show="modelTitle=='临时采购订单'">
      <p>申请单号：<Input disabled :value="mainData.serviceId" placeholder="申请单号" style="width: 300px" /></p>
      <table class="table-1" style="width: 100%" cellspacing="0" cellpadding="0">
        <tr>
          <td class="table-th">供应商</td>
          <td>{{mainData.guestName}}</td>
          <td class="table-th">预付款</td>
          <td>{{mainData.advanceAmt}}</td>
          <td class="table-th">采购员</td>
          <td>{{mainData.orderMan}}</td>
        </tr>
        <tr>
          <td class="table-th">票据类型</td>
          <td>{{getBillTypeName}}</td>
          <td class="table-th">结算方式</td>
          <td>{{getSettleTypeName}}</td>
          <td class="table-th">入库仓库</td>
          <td>{{mainData.storeName}}</td>
        </tr>
        <tr>
          <td class="table-th">订货日期</td>
          <td>{{mainData.orderDate}}</td>
          <td class="table-th">备注</td>
          <td>{{mainData.remark}}</td>
          <td class="table-th">直发门店</td>
          <td>{{mainData.companyName}}</td>
        </tr>
        <tr>
          <td class="table-th">预计到货日期</td>
          <td>{{mainData.planArriveDate}}</td>
          <td class="table-th">合计总金额</td>
          <td>{{mainData.orderAmt|priceFilters}}</td>
          <td class="table-th">单号</td>
          <td>{{mainData.serviceId}}</td>
        </tr>
      </table>
      <p class="p10 fs14">单据明细</p>
      <vxe-table
        border
        resizable
        show-footer
        size="mini"
        height="300"
        :data="mainData.details"
        :footer-method="addFooter3"
      >
        <vxe-table-column fixed="left" type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column fixed="left" field="partCode" title="配件编码" width="100"></vxe-table-column>
        <vxe-table-column fixed="left" field="partName" title="配件名称" width="150"></vxe-table-column>
        <vxe-table-column fixed="left" field="partBrand" title="品牌" width="100"></vxe-table-column>

        <vxe-table-column field="orderQty" title="采购数量" width="100"></vxe-table-column>
        <vxe-table-column field="orderPrice" title="采购单价" width="100">
          <template v-slot="{row}">
            {{row.orderPrice|priceFilters}}
          </template>
        </vxe-table-column>
        <vxe-table-column field="orderAmt" title="采购金额" width="100">
          <template v-slot="{row}">
            {{row.orderAmt|priceFilters}}
          </template>
        </vxe-table-column>
        <vxe-table-column field="remark" title="备注" width="100"></vxe-table-column>
        <vxe-table-column field="noTaxPrice" title="不含税单价" width="100"></vxe-table-column>
        <vxe-table-column field="noTaxAmt" title="不含税金额" width="100"></vxe-table-column>
        <vxe-table-column field="carBrand" title="品牌车型" width="100"></vxe-table-column>
        <vxe-table-column field="unit" title="单位" width="100"></vxe-table-column>
        <vxe-table-column field="oemCode" title="OE码" width="100"></vxe-table-column>
        <vxe-table-column field="spec" title="规格" width="100"></vxe-table-column>
        <vxe-table-column field="direction" title="方向" width="100"></vxe-table-column>
        <vxe-table-column field="planCancelQty" title="计划取消数量" width="100"></vxe-table-column>
        <vxe-table-column field="acceptQty" title="验收数量" width="100"></vxe-table-column>
      </vxe-table>
    </div>
    <div v-show="modelTitle=='门店外采订单'">
      <p>申请单号：<Input disabled :value="mainData.serviceId" placeholder="申请单号" style="width: 300px" /></p>
      <table class="table-1" style="width: 100%" cellspacing="0" cellpadding="0">
        <tr>
          <td class="table-th">供应商</td>
          <td>{{mainData.guestName}}</td>
          <td class="table-th">预付款</td>
          <td>{{mainData.advanceAmt}}</td>
          <td class="table-th">采购员</td>
          <td>{{mainData.orderMan}}</td>
        </tr>
        <tr>
          <td class="table-th">票据类型</td>
          <td>{{getBillTypeName}}</td>
          <td class="table-th">结算方式</td>
          <td>{{getSettleTypeName}}</td>
          <td class="table-th">入库仓库</td>
          <td>{{mainData.storeName}}</td>
        </tr>
        <tr>
          <td class="table-th">备注</td>
          <td>{{mainData.remark}}</td>
          <td class="table-th">合计总金额</td>
          <td>{{mainData.orderAmt|priceFilters}}</td>
          <td class="table-th">单号</td>
          <td>{{mainData.serviceId}}</td>
        </tr>
      </table>
      <p class="p10 fs14">单据明细</p>
      <vxe-table
        border
        resizable
        show-footer
        size="mini"
        height="300"
        :data="mainData.details"
        :footer-method="addFooter3"
      >
        <vxe-table-column fixed="left" type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column fixed="left" field="partCode" title="配件编码" width="100"></vxe-table-column>
        <vxe-table-column fixed="left" field="partName" title="配件名称" width="150"></vxe-table-column>
        <vxe-table-column fixed="left" field="partBrand" title="品牌" width="100"></vxe-table-column>

        <vxe-table-column field="orderQty" title="采购数量" width="100"></vxe-table-column>
        <vxe-table-column field="orderPrice" title="采购单价" width="100">
          <template v-slot="{row}">
            {{row.orderPrice|priceFilters}}
          </template>
        </vxe-table-column>
        <vxe-table-column field="orderAmt" title="采购金额" width="100">
          <template v-slot="{row}">
            {{row.orderAmt|priceFilters}}
          </template>
        </vxe-table-column>
        <vxe-table-column field="remark" title="备注" width="100"></vxe-table-column>
        <vxe-table-column field="noTaxPrice" title="不含税单价" width="100"></vxe-table-column>
        <vxe-table-column field="noTaxAmt" title="不含税金额" width="100"></vxe-table-column>
        <vxe-table-column field="carBrand" title="品牌车型" width="100"></vxe-table-column>
        <vxe-table-column field="unit" title="单位" width="100"></vxe-table-column>
        <vxe-table-column field="oemCode" title="OE码" width="100"></vxe-table-column>
        <vxe-table-column field="spec" title="规格" width="100"></vxe-table-column>
        <vxe-table-column field="direction" title="方向" width="100"></vxe-table-column>
        <vxe-table-column field="planCancelQty" title="计划取消数量" width="100"></vxe-table-column>
        <vxe-table-column field="acceptQty" title="验收数量" width="100"></vxe-table-column>
      </vxe-table>
    </div>
    <div v-show="modelTitle=='活动审批'">
      <p>申请单号：<Input disabled :value="mainData.applyId" placeholder="申请单号" style="width: 300px" /></p>
      <table class="table-1" style="width: 100%" cellspacing="0" cellpadding="0">
        <tr>
          <td class="table-th">申请分店</td>
          <td>{{mainData.orgname}}</td>
          <td class="table-th">是否厂家提供</td>
          <td>{{mainData.isBelowCost ? "是" : "否"}}</td>
          <td class="table-th">创建时间</td>
          <td>{{mainData.createTime}}</td>
        </tr>
        <tr>
          <td class="table-th">创建人</td>
          <td>{{mainData.createUname}}</td>
          <td class="table-th">备注</td>
          <td colspan="3">{{mainData.remark}}</td>
        </tr>
      </table>
      <p class="p10 fs14">活动信息</p>
      <vxe-table
        border
        resizable
        size="mini"
        height="300"
        :data="mainData.details"
        :footer-method="addFooter3"
      >
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="activityName" title="活动名称" width="100"></vxe-table-column>
        <vxe-table-column field="partName" title="指定公司" width="150"></vxe-table-column>
        <vxe-table-column field="partCode" title="配件编码" width="100"></vxe-table-column>

        <vxe-table-column field="partName" title="配件名称" width="100"></vxe-table-column>
        <vxe-table-column field="partBrandName" title="品牌" width="100">
        </vxe-table-column>
        <vxe-table-column field="num" title="活动数量" width="100">
        </vxe-table-column>
        <vxe-table-column field="price" title="活动单价" width="100"></vxe-table-column>
        <vxe-table-column field="noTaxPrice" title="是否赠送" width="100">
          <template v-slot="{row}">
            <checkbox disabled :value="row.isGift == 0 ? false : true"></checkbox>
          </template>
        </vxe-table-column>
        <vxe-table-column field="oemCode" title="OEM码" width="100"></vxe-table-column>
        <vxe-table-column field="carModelName" title="车型" width="100"></vxe-table-column>
        <vxe-table-column field="activityId" title="活动ID" width="100"></vxe-table-column>
        <vxe-table-column field="remark" title="备注" width="100"></vxe-table-column>
        <vxe-table-column field="beginDate" title="开始日期" width="100"></vxe-table-column>
        <vxe-table-column field="endDate" title="结束日期" width="100"></vxe-table-column>
        <vxe-table-column field="createUname" title="创建人" width="100"></vxe-table-column>
        <vxe-table-column field="createTime" title="创建日期" width="100"></vxe-table-column>
      </vxe-table>
    </div>
    <div slot='footer'></div>
  </Modal>
</template>

<script>
  import {findByCodeDetail,findGoodsByCodeDetail,findLsOrWcDetail,findActivty} from "../../../api/documentApproval/documentApproval/documentApproval";

  export default {
		name: "viewOtherModel",
    props:{
      mainStore:{
        type:Array,
        default:[]
      },
      billTypeArr:{
        type:Object,
        default:{}
      }
    },
    data(){
		  return {
		    model:false,
        mainData:{},
        modelTitle:''
      }
    },
    computed:{
		  getStoreName(){
        let storeName = this.mainStore.filter(item => item.id==this.mainData.storeId) || [];
        return storeName.length>0?storeName[0].name: this.mainData.storeName;
      },

      getBillTypeName(){
		    if(this.billTypeArr.CS00107){
          let storeName = this.billTypeArr.CS00107.filter(item => item.itemCode==this.mainData.billTypeId);
          return storeName.length>0?storeName[0].itemName:"";
        }
      },

      getSettleTypeName(){
        if(this.billTypeArr.CS00106){
          let storeName = this.billTypeArr.CS00106.filter(item => item.itemCode==this.mainData.settleTypeId);
          return storeName.length>0?storeName[0].itemName:"";
        }

      }
    },
    methods:{
		  async init(row){
		    this.model = true;
		    this.modelTitle = row.applyTypeName||"";
        this.mainData = {};

		    if(this.modelTitle=="盘盈入库"||this.modelTitle=="盘亏出库"){
		      this.panYK(row);
        }
		    if(this.modelTitle=="采购计划单"){
		      this.getGoodsDetail(row);
        }
        if(this.modelTitle=="临时采购订单"||this.modelTitle=="门店外采订单"){
          this.getLsOrWcDetail(row);
        }
        if(this.modelTitle=="活动申请"){
          this.getActivtyDetail(row);
        }
      },
      //盘盈、盘亏详情
      async panYK(row){
        let rep = await findByCodeDetail({'code':row.applyNo});
        if(rep.code==0){
          this.mainData = rep.data||{};
          this.mainData.exhibitAmt = this.mainData.detailVOList.reduce((total,cur) => {
            return total+(cur.exhibitAmt||0)
          },0)
        }
      },
      //采购计划详情
      async getGoodsDetail(row){
        let rep = await findGoodsByCodeDetail({'code':row.applyNo});
        if(rep.code==0){
          this.mainData = rep.data||{};
        }
      },
      //获取临时采购、外采订单详情
      async getLsOrWcDetail(row){
        let rep = await findLsOrWcDetail({'code':row.applyNo});
        if(rep.code==0){
          this.mainData = rep.data||{};
        }
      },
      //活动申请详情
      async getActivtyDetail(row){
        let rep = await findActivty({'code':row.applyNo});
        if(rep.code==0){
          this.mainData = rep.data.activity||{};
          this.mainData.details = [];
          for(let b in rep.data.query){
            if(Array.isArray(rep.data.query[b])){
              this.mainData.details.push(...rep.data.query[b])
            }else{
              this.mainData.details.push(rep.data.query[b])
            }
          }
        }
        console.log(this.mainData)
      },

      //计算合计
      //盘盈盘亏
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
      //采购计划
      addFooter2({ columns, data }) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return "合计";
            }
            if (
              [
                "orderQty",
                "orderPrice",
                "orderAmt",
                "noTaxAmt",
                "recentPrice",
                "diffAmt"
              ].includes(column.property)
            ) {
              return this.sum(data, column.property, columnIndex);
            }
            return null;
          })
        ];
      },

      //临时采购订单
      addFooter3({ columns, data }) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return "合计";
            }
            if (
              [
                "orderAmt",
                "noTaxAmt",
                "planCancelQty",
                "acceptQty"
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
