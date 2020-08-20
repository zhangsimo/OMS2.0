<template>
  <Modal v-model="modal" title="预收款认领">
    <span>往来单位</span>
    <Select v-model="companyId" class="w100 ml10 mr10" filterable>
      <Option v-for="item in company" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <button class="ivu-btn ivu-btn-default" type="button" @click="query">
      <i class="iconfont iconchaxunicon"></i>
      <span>查询</span>
    </button>
    <Table
      border
      class="mt10"
      :columns="advance"
      :data="advanceData"
      max-height="400"
      highlight-row
      @on-current-change="advanceChange"
    ></Table>
    <div slot="footer">
      <Button type="primary" @click="claim">认领</Button>
      <Button @click="modal = false">返回</Button>
    </div>
  </Modal>
</template>
<script>
import { findGuest} from "_api/settlementManagement/advanceCollection.js";
export default {
  data() {
    return {
      modal: false, //弹框
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
          title: "往来单位",
          key: "guestName",
          align: "center"
        },
        {
          title: "编号",
          key: "accountNo",
          align: "center"
        },
        {
          title: "简称",
          key: "guestName",
          align: "center"
        }
      ], //表格
      advanceData: [{guestName:1}] ,//表格
      currentData:{}//当前选中的数据
    };
  },
  mounted() {
  },
  methods: {
    //打开页面
    init(){
      this.getOne();
      this.modal = true
    },
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
    advanceChange(val){
      this.currentData = val
    },
    //认领
    claim(){
      if(Object.keys(this.currentData).length!==0){

      } else {
        this.$message.error('请选择一条数据');
      }
    }
  }
};
</script>
