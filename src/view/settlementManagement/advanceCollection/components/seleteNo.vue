<template>
  <Modal v-model="modal" title="预收款单据" width="800" @on-visible-change="visChange">
    <span>申请日期</span>
    <Date-picker :value="value" type="daterange" placeholder="选择日期" class="w200 ml5 mr10"></Date-picker>
    <span>往来单位：</span>
    <Select v-model="companyId" class="w150" filterable>
      <Option v-for="item in company" :value="item.value" :key="item.value">
        {{
        item.label
        }}
      </Option>
    </Select>
    <span class="ml10">金额：</span>
    <InputNumber v-model="amt" class="w50" />
    <button class="ml10 ivu-btn ivu-btn-default" type="button" @click="query">
      <i class="iconfont iconchaxunicon"></i>
      <span>查询</span>
    </button>
    <Table
      class="mt10"
      border
      :columns="billColumns"
      :data="billData"
      max-height="400"
      highlight-row
      @on-current-change="currentChange"
    ></Table>
    <div class="h40">
      <Page
        class-name="fr mb10 mt10"
        size="small"
        :current="page.num"
        :total="page.total"
        :page-size="page.size"
        @on-change="changePage"
        @on-page-size-change="changeSize"
        show-sizer
        show-total
      ></Page>
    </div>
    <div slot="footer">
      <Button type="primary" @click="detamin">确认</Button>
      <Button @click="modal=false">取消</Button>
    </div>
  </Modal>
</template>
<script>
import {
  findAdvance,
  findGuest
} from "_api/settlementManagement/advanceCollection.js";
export default {
  props: ["orgId"],
  data() {
    return {
      amt: null, //金额
      modal: false,
      company: [], //往来单位
      companyId: "", //往来单位id
      value: [], //日期
      billColumns: [
        {
          type: "index",
          title: "序号",
          width: 40
        },
        {
          title: "预收款收款单号",
          key: "serviceId"
        },
        {
          title: "往来单位",
          key: "guestName"
        },
        {
          title: "日期",
          key: "receiveDate"
        },
        {
          title: "预收款认领金额",
          key: "claimAmt"
        },
        {
          title: "预收款核销金额",
          key: "writeOffAmt"
        },
        {
          title: "预收款支出金额",
          key: "expenditureAmt"
        },
        {
          title: "预收款支出已认领金额",
          key: "expenditureClaimAmt"
        },
        {
          title: "预收款余额",
          key: "remainingAmt"
        }
      ], //表格数据
      billData: [], //表格数据
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      currentRow:{},
    };
  },
  methods: {
    //选中行
    currentChange(cur){
      this.currentRow = cur
    },
    // 确认
    detamin() {
      if(Object.keys(this.currentRow).length!==0){
        this.$emit('bill',this.currentRow)
        this.modal=false
      } else {
        this.$message.error('请选择数据')
      }
    },
    //弹框是否打开
    visChange(type) {
      if (type) {
        this.getQuery();
        this.getOne();
      }
    },
    // 往来单位选择
    async getOne() {
      findGuest({ size: 2000 }).then(res => {
        if (res.code === 0) {
          this.company=[]
          res.data.content.map(item => {
            this.company.push({
              value: item.id,
              label: item.fullName
            });
          });
        }
      });
    },
    //查询
    query() {
      this.getQuery();
    },
    //接口查询
    getQuery() {
      let obj = {
        startDate: this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endDate: this.value[1]
          ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        guestId: this.companyId,
        size: this.page.size,
        page: this.page.page - 1,
        remainingAmt: this.amt,
        orgid: this.orgId
      };
      findAdvance(obj).then(res => {
        if (res.code === 0) {
          this.billData = res.data.content;
          this.page.total = res.data.totalElements;
        }
      });
    },
    //分页
    changePage(p) {
      this.page.num = p;
      this.getQuery();
    },
    changeSize(size) {
      this.page.num = 1;
      this.page.size = size;
      this.getQuery();
    }
  }
};
</script>