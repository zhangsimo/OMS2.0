<template>
  <Modal  v-model="modal1" title="客户理赔登记单(已提交的)" width="1200" @on-visible-change="visChange">
    <section class="oper-top">
      <div class="oper-top flex">
        <div class="db mr10 mb10">
          <span class="db mr10">提交日期:</span>
          <DatePicker
            type="daterange"
            placement="bottom-end"
            style="width: 200px"
            v-model.trim="submitData"
            placeholder="年/月/日"
          ></DatePicker>
          <span class="db mr10 ml10">理赔单位:</span>
          <Input type="text" v-model.trim="guestName" placeholder="请输入理赔单位" clearable class="w180"/>
          <span class="db mr10 ml10">品牌:</span>
          <Select
            class="w120"
            clearable
            label-in-value
            filterable
            remote
            :loading="partBrandBool"
            v-model="partBrand"
            placeholder="请选择品牌"
          >
            <Option
              v-for="item in bandArr"
              :value="item.label"
              :key="item.id"
            >{{ item.label }}</Option>
          </Select>
          <span class="db mr10 ml10">配件编码/名称:</span>
          <Input type="text" v-model.trim="partCode" clearable placeholder="请输入配件编码/名称" class="w150"/>
        </div>
        <div class="db">
          <Button type="default" class="mr5" @click="query">查询</Button>
          <Button type="warning" class="mr5" @click="selAddPart">选入</Button>
          <Button type="warning" @click="allSelAddPart">整单选入</Button>
        </div>
      </div>
      <vxe-table
        border
        auto-resize
        resizable
        size="mini"
        :data="data"
        height="500"
        ref="customerXtable"
        :loading="tableLoading"
        show-overflow="title"
        @checkbox-change="checkClaim"
        @checkbox-all="checkClaim"
        @checkbox-cancel="checkClaim"
      >
        <vxe-table-column type="selection" width="30"></vxe-table-column>
        <vxe-table-column type="seq" width="40" title="序号"></vxe-table-column>
        <vxe-table-column title="理赔入库单号" width="100" field="serviceId"></vxe-table-column>
        <vxe-table-column title="理赔单位" width="100" field="guestName"></vxe-table-column>
        <vxe-table-column title="提交日期" width="100" field="orderDate"></vxe-table-column>
        <vxe-table-column title="备注" width="100" field="remark"></vxe-table-column>
        <vxe-table-column title="配件内码" width="100" field="partInnerId"></vxe-table-column>
        <vxe-table-column title="配件编码" width="100" field="partCode"></vxe-table-column>
        <vxe-table-column title="配件名称" width="100" field="partName"></vxe-table-column>
        <vxe-table-column title="品牌" width="60" field="partBrand"></vxe-table-column>
        <vxe-table-column title="理赔原因" width="100" field="afterSaleReason"></vxe-table-column>
        <vxe-table-column title="理赔数量" width="100" field="afterSaleQty"></vxe-table-column>
        <vxe-table-column title="已选入数量" width="100" field="choiceQty"></vxe-table-column>
        <vxe-table-column title="未选入数量" width="100" field="noChoiceQty"></vxe-table-column>
        <vxe-table-column title="OEM码" width="100" field="oemCode"></vxe-table-column>
        <vxe-table-column title="单位" width="100" field="unit"></vxe-table-column>
        <vxe-table-column title="车型" width="100" field="carModelName"></vxe-table-column>
      </vxe-table>
    </section>
    <div slot="footer"></div>
  </Modal>
</template>
<script lang="ts">
  import { Vue, Component , Watch  } from "vue-property-decorator";
  import getDate from "@/components/getDate/dateget_bill.vue";
  import {getBrandList} from "@/view/reportForm/until";
  import {customerClaimQuery,allCustomerClaim} from "@/api/afterSale/claimSheet";
  import moment from "moment";
  // @ts-ignore
  @Component({
    components: {
      getDate
    }
  })
  export default class customerClaim extends Vue {
    //变量
    private modal1:boolean=false;
    private tableLoading:boolean=false;
    private submitData:Array<string>=new Array();//提交日期
    private guestName:string="";//理赔单位
    private partBrand:string="";//品牌
    private partCode:string="";//配件编码/code
    private bandArr:Array<any>=new Array();//品牌数组
    private partBrandBool:boolean=false;//品牌数组是否有值的Boolean
    private data:Array<any>=new Array<any>();//客户理赔登记单数组
    private checkData:Array<any>=new Array<any>()//客户理赔登记单选中
    //methods
    private visChange(type:boolean){
      if(type){
        this.modal1=true;
        this.getBrand("");
        this.query();
      }else{
        this.modal1=false;
        this.submitData=[];
        this.guestName="";
        this.partBrand="";
        this.partCode="";
        this.data=[];
      }
    }
    //获取品牌数组
    private async getBrand(data: string) {
      this.partBrandBool=true
      var queryName:string=data
      if(data==""){
        queryName=""
      }else{
        queryName=data.trim()
      }
      this.bandArr = await getBrandList(queryName)
      this.partBrandBool=false
    }
    //查询客户理赔登记单
    private async query(){
      let data:any={};
      data.orderSign=1;
      if(this.submitData[0]){
        data.orderStartDate=moment(this.submitData[0]).startOf('day').format("YYYY-MM-DD HH:mm:ss");
        data.orderEndDate=moment(this.submitData[1]).endOf('day').format("YYYY-MM-DD HH:mm:ss");
      }
      data.guestName=this.guestName;
      data.partBrand=this.partBrand;
      data.partCode=this.partCode;
      let params:any={};
      params.page=0;
      params.size=10000;
      this.tableLoading=true;
      let res:any=await customerClaimQuery(params,data);
      if(res.code===0){
        this.data=res.data.content;
        this.tableLoading=false;
      }else{
        this.tableLoading=false;
      }
    }
    //选中
    private async checkClaim(selection:any){
      this.checkData=selection.selection;
      let par:any=this.$parent;
      let notSim:boolean=false;
      (par.formPlan.details || []).map(detEL=>{
        (this.checkData || []).map(arrEl=>{
          if(detEL.partInnerId==arrEl.partInnerId){
            notSim=true;
          }
        })
      })
      if(notSim){
        return this.$Message.error("存在已添加的客户理赔登记单!")
      }
    }
    //选入
    private selAddPart(){
      if(this.checkData.length<1){
        return this.$Message.error("请选择客户理赔登记单")
      }else{
        let par:any=this.$parent;
        let notSim:boolean=false;
        if(par.formPlan.details==null||undefined){
          par.formPlan.details=[]
        }
        (par.formPlan.details || []).map(detEL=>{
          (this.checkData || []).map(arrEl=>{
            if(detEL.partInnerId==arrEl.partInnerId){
              notSim=true;
            }
          })
        })
        if(notSim){
          return this.$Message.error("存在已添加的客户理赔登记单!")
        }
        let arr:Array<any>=new Array<any>();
        arr=this.checkData.map(el=>{
          let data:any=Object.assign({}, el);//对象浅拷贝
          data.claimDemageCode="";
          data.afterSaleQty=el.noChoiceQty;
          data.enterMainId=data.mainId;
          data.processedQty=0;
          data.untreatedQty=el.noChoiceQty;
          data.enterDetailId=data.id;
          delete data.id;
          delete data.mainId;
          return data;
        })
        par.formPlan.details=[...arr,...par.formPlan.details];
        par.formPlan.partOrCustomerOnly=2;
      }
    }
    //整单选入
    private async allSelAddPart(){
      let mainIds=new Array<any>();

      this.checkData.map(el=>{
        mainIds.push(el.mainId);
      })
      let res:any=await allCustomerClaim(mainIds);
      if(res.code===0){
        let data:Array<any>=(res.data || []).map(el=>{
          let dataEl:any=Object.assign({}, el);//对象浅拷贝
          dataEl.claimDemageCode="";
          dataEl.afterSaleQty=el.noChoiceQty;
          dataEl.enterMainId=dataEl.mainId;
          dataEl.processedQty=0;
          dataEl.untreatedQty=el.noChoiceQty;
          dataEl.enterDetailId=dataEl.id;
          delete dataEl.id;
          delete dataEl.mainId;
          return dataEl;
        });
        let par:any=this.$parent;
        let notSim:boolean=false;
        if(par.formPlan.details==null||undefined){
          par.formPlan.details=[]
        }
        (par.formPlan.details || []).map(detEL=>{
          (this.checkData || []).map(arrEl=>{
            if(detEL.partInnerId==arrEl.partInnerId){
              notSim=true;
            }
          })
        })
        if(notSim){
          return this.$Message.error("存在已添加的客户理赔登记单!")
        }
        par.formPlan.details=[...data,...par.formPlan.details];
        par.partOrCustomerOnly=2;
        let xtable:any=this.$refs.customerXtable
        xtable.clearCheckboxRow();
        xtable.updateData();
      }
    }
  }
</script>
<style lang="less">

</style>
