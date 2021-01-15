<template>
  <Modal v-model="modal1" :title="popupTit" width="800" @on-visible-change="visChange">
    <Table
      :columns="saleSingle"
      :data="saleSingleData"
      @on-selection-change="seleteDate"
    ></Table>
    <div slot="footer">
      <Button type="primary" @click="determine">确定</Button>
      <Button @click="modal1=false">取消</Button>
    </div>
  </Modal>
</template>
<script>
import {saleSlip} from '@/api/bill/popup'
import bus from './Bus'
export default {
  props: ["popupTit",'parameter'],
  data() {
    return {
      modal1: false, //弹框展示
      saleSingle: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "序号",
          type: "index",
          width: 40,
          className: "tc"
        },
        {
          title: "客户名称",
          key: "guestName",
          className: "tc"
        },
        {
          title: "日期",
          key: "transferDate",
          className: "tc"
        },
        {
          title: "业务单据号",
          key: "serviceId",
          className: "tc"
        },
        {
          title: "出库单号",
          key: "orderNo",
          className: "tc"
        },
        {
          title: "含税标志",
          key: "taxSignName",
          className: "tc"
        },
        {
          title: "单据金额",
          key: "accountAmt",
          className: "tc",
          render: (h, params) => {
            return h("span", Number(params.row.accountAmt).toFixed(2));
          }
        }
      ], //选择单据表格
      saleSingleData: [], //选择单据表格数据
      seleteData: [] //选中的数据
    };
  },
  methods: {
    // 对话框是否显示
    visChange(flag) {
      if (flag) {
        let taxSign = 0
        if(this.popupTit === '选择必开销售单') taxSign = 1
        let accountNos=[];
        (this.parameter.accountNos.split(";") || []).map((el,index)=>{
          if(el!=""){
            accountNos.push(el)
          }
        })
        saleSlip({accountNos:accountNos,taxSign}).then(res=>{
          if(res.code===0){
            this.saleSingleData = res.data
          }
        })
      }
    },
    //选择一条数据
    determine() {
      if (this.seleteData.length!==0) {
        if(this.saleSingleData.length===this.seleteData.length){
          this.$emit('partsData',[])
        }else{
          this.seleteData.map(item => item.ifNecessary = 1)
          this.$emit('partsData',this.seleteData);
        }
        this.modal1 = false
      } else {
        this.$message.error("请先选择一条销售单");
      }
    },
    seleteDate(selection) {
      this.seleteData = selection;
    }
  }
};
</script>
