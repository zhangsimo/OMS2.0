<template>
  <Modal v-model="modal" title="预收款支出认领" width=800 @on-visible-change="showOrhideModel">
    <span>往来单位</span>
    <Select v-model="companyId" class="w100 ml10 mr10" filterable>
      <Option v-for="item in company" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <span class="mr10">金额</span>
    <InputNumber v-model="amt" class="w100" />
    <button class="ivu-btn ivu-btn-default ml10" type="button" @click="query">
      <i class="iconfont iconchaxunicon"></i>
      <span>查询</span>
    </button>
    <button class="ivu-btn ivu-btn-default ml10" type="button" @click="claim">认领</button>
    <Table
      border
      class="mt10"
      :columns="advance"
      :data="advanceData"
      max-height="400"
      highlight-row
      @on-current-change="advanceChange"
    ></Table>
    <div slot="footer"></div>
    <settlement ref="settlement" />
  </Modal>
</template>
<script>
import settlement from "../../../bill/components/settlement";
import { findGuest} from "_api/settlementManagement/advanceCollection.js";
export default {
  components:{settlement},
  data() {
    return {
      modal: false, //弹框
      amt: 0, //金额
      company: [], //往来单位
      companyId: "", //往来单位
      advance: [
        {
          title: "序号",
          type: "index",
          align: "center",
          width: 40
        },
        {
          title: "预收款单号",
          key: "guestName",
          align: "center"
        },
        {
          title: "往来单位",
          key: "accountNo",
          align: "center"
        },
        {
          title: "预收款认领金额",
          key: "guestName",
          align: "center"
        },
        {
          title: "预收款核销收款单号",
          key: "guestName",
          align: "center"
        },
        {
          title: "预收款核销金额",
          key: "guestName",
          align: "center"
        },
        {
          title: "预收款支出对账单号",
          key: "guestName",
          align: "center"
        },
        {
          title: "预收款支出已认领金额",
          key: "guestName",
          align: "center"
        },
        {
          title: "预收款余额",
          key: "guestName",
          align: "center"
        }
      ], //表格
      advanceData: [{ guestName: 1 }], //表格
      currentData: {} //当前选中的数据
    };
  },
  mounted() {
    // this.getOne();
  },
  methods: {
    // 往来单位选择
    async getOne() {
      findGuest({size:2000}).then(res => {
        if (res.code === 0) {
          res.data.content.map(item=>{
            this.company.push({
              value:item.id,
              label:item.fullName
            })
          })
        }
      });
    },
    //查询
    query() {},
    //当前选中的数据
    advanceChange(val) {
      this.currentData = val;
    },
    //认领
    claim() {
      if (Object.keys(this.currentData).length !== 0) {
        this.$refs.settlement.Settlement = true;
      } else {
        this.$message.error("请选择一条数据");
      }
    },
    showOrhideModel(v){
      if(v&&this.company.length==0){
        this.getOne();
      }
    }
  }
};
</script>
