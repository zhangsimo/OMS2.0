<template>
  <Modal v-model="modal" title="其他收款认领" width="800" @on-visible-change='visChange'>
    <div class="db ml20">
      <span>往来单位：</span>
      <Input v-model="company" class="w100" />
      <Button @click="query" class="ml10">
        <i class="iconfont iconchaxunicon"></i>
        <span>查询</span>
      </Button>
    </div>
    <Table
      border
      class="mt10"
      :columns="columns1"
      ref="table"
      :data="data1"
      max-height="400"
      highlight-row
      @on-current-change="currentChange"
    ></Table>
    <div style="height: 50px">
      <Page
        show-sizer
        show-total
        class-name="fr mb10 mt10"
        size="small"
        :current="page.page"
        :total="page.total"
        :page-size="page.size"
        @on-change="changePage"
        @on-page-size-change="changeSize"
      ></Page>
    </div>
    <div slot="footer">
      <Button type="primary" @click="detaim">确认</Button>
      <Button @click="modal=false">取消</Button>
    </div>
  </Modal>
</template>
<script>
import { findGuest } from "_api/settlementManagement/advanceCollection";
import { addClaim } from "_api/settlementManagement/otherPayable/otherPayable";

import bus from '../../bill/Popup/Bus'
export default {
  data() {
    return {
      modal: false,
      company: "", //往来单位
      columns1: [
        {
          title: "序号",
          type: "index",
          width: 40
        },
        {
          title: "往来单位",
          key: "fullName"
        },
        {
          title: "编号",
          key: "code"
        },
        {
          title: "简称",
          key: "shortName"
        }
      ],
      data1: [],
      page: {
        total: 0,
        page: 1,
        size: 10
      },
      guestId:'',//选中往来单位的id
      financeAccountCashList:[]
    };
  },
  mounted() {
    bus.$on("paymentInfo",val=>{
      this.financeAccountCashList= []
      val.map(item=>{
        this.financeAccountCashList.push({id:item.id})
      })
    })
  },
  methods: {
    //弹框是否打开
    visChange(type){
      if(!type){
        this.guestId = ''
        this.company = ''
        // this.$refs.table.clearCurrentRow()
      }else{
        if(this.data1.length==0){
          this.getOne();
        }
      }
    },
    // 往来单位选择
    async getOne() {
      let obj = {
        page: this.page.page - 1,
        size: this.page.size,
        fullName: this.company
      };
      findGuest(obj).then(res => {
        if (res.code === 0) {
          this.data1 = res.data.content;
          this.page.total = res.data.totalElements;
        }
      });
    },
    //查询
    query() {
      this.getOne();
    },
    //确定
    detaim(){
      if(this.guestId){
        let obj = {};
        obj.guestId = this.guestId;
        obj.financeAccountCashList = this.financeAccountCashList
        obj.claimType = 0
        addClaim(obj).then(res=>{
          if(res.code===0){
            this.$Message.success('认领成功')
            this.modal = false;
            this.$parent.getQuery()
            this.$parent.$refs.settlement.tableData = []
          }
        })
      } else {
        this.$Message.error('请选择一个往来单位');
      }
    },
    // 选中行
    currentChange(row){
      this.guestId = row.id
    },
    //分页
    changePage(p) {
      this.page.page = p;
      this.getOne();
    },
    changeSize(size) {
      this.page.page = 1;
      this.page.size = size;
      this.getOne();
    }
  }
};
</script>
