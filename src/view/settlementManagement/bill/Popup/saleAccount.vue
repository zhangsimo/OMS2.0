<template>
  <Modal v-model="modal1" title="选择不含税对账单" @on-visible-change="visChange">
    <span class="mr5">对账期间：</span>
    <DatePicker type="daterange" placement="bottom-start" style="width: 200px"></DatePicker>
    <Button @click="query" class="ml10">查询</Button>
    <Table class="mt10" :columns="noTax" :data="noTaxData" highlight-row @on-current-change="seleteDate"></Table>
    <div slot="footer">
      <Button type="primary" @click="determine">确定</Button>
      <Button @click="modal1=false">取消</Button>
    </div>
    <idDetailed ref="idDetailed" />
  </Modal>
</template>
<script>
import idDetailed from '../components/idDetailed'
import { noTaxAccount} from "@/api/bill/popup";
import bus from './Bus'
export default {
  props:['parameter'],
  components:{
    idDetailed
  },
  data(){
    return {
      modal1:false,//弹窗展示
      noTax:[
        {
          title: "序号",
          key: "index",
          width: 40,
          className: "tc"
        },
        {
          title: "客户名称",
          key: "orgName",
          className: "tc"
        },
        {
          title: "日期",
          key: "createTime",
          className: "tc"
        },
        {
          title: "对账单号",
          key: "guestName",
          className: "tc",
          render:(h,params)=>{
            return h("span",
              {
                style: {
                  cursor: "pointer",
                  color: "#87CEFA"
                },
                on: {
                  click: () => {
                    this.$refs.idDetailed.modal1=true
                  }
                }
              },
              params.row.serviceId)
          }
        },
        {
          title: "对账金额",
          key: "guestName",
          className: "tc"
        }
      ],//选择不含税对账单单
      noTaxData:[],//选择不含税对账单单表格数据
      seleteData:{}//单选数据
    }
  },
  methods:{
        // 对话框是否显示
    visChange(flag) {
      if (flag) {
        noTaxAccount({guestId:this.parameter.guestId,taxSign:0}).then(res=>{
          console.log(res)
        })
      }
    },
    // 日期查询
    query(){},
    // 确认按钮
    determine(){
      if(Object.keys(this.seleteData).length!==0){
        bus.$emit('accountNo',this.seleteData)
      } else {
        this.$message.error('请选择一条对账单')
      }
    },
    // 单选数据
    seleteDate(currentRow){
      this.seleteData = currentRow
    }
  }
}
</script>