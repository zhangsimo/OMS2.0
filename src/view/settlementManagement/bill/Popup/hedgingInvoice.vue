<template>
  <Modal v-model="modal1" title="发票对冲申请" width="1200">
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="preservation"
      v-has="'examine'"
    >保存草稿</button>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="submission"
      v-has="'examine'"
    >提交申请</button>
    <h4 class="mt10 mb10">基本信息</h4>
    <Row>
      <Col span="4">
        <span>分店名称：</span>
      </Col>
      <Col span="4">
        <span>分店店号：</span>
      </Col>
      <Col span="4">
        <span>往来单位：</span>
      </Col>
      <Col span="4">
        <span>对冲申请单号：</span>
      </Col>
      <Col span="4">
        <span>申请时间：</span>
      </Col>
    </Row>
    <Row class="mt10 ml10">
      <Col span="4">
        <span>申请人：</span>
        <Input v-model="applicant" class="ml5 w100" disabled />
      </Col>
      <Col span="4">
        <span>对冲发票：</span>
        <Input v-model="invoiceHedging" class="ml5 w100" disabled />
      </Col>
      <Col span="4">
        <span>对冲油品：</span>
        <Input v-model="oilHedging" class="ml5 w100" disabled />
      </Col>
      <Col span="12">
        <span>对冲申请原因说明：</span>
        <Input v-model="remarks" class="ml5 w260" />
      </Col>
    </Row>
    <button
      class="ivu-btn ivu-btn-default mt10"
      type="button"
      @click="seleteAccount"
      v-has="'examine'"
    >选择对账单</button>
    <Table
      class="mt10"
      border
      :columns="accessoriesBilling"
      :data="accessoriesBillingData"
      show-summary
      :summary-method="billSum"
    ></Table>
    <h4 class="mt10">发票对冲申请</h4>
    <approval :approvalTit='approvalTit'/>
    <saleSelete ref='saleSelete'/>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import approval from './approval';
import saleSelete from './saleSelete';
export default {
  components:{
    approval,
    saleSelete
  },
  data() {
    return {
      approvalTit:'对冲申请流程',//审批流程
      modal1: false, //弹框显示
      applicant: "", //申请人
      invoiceHedging: "", //对冲发票
      oilHedging: "", //对冲油品
      remarks: "", //对冲申请原因说明
      accessoriesBilling: [
        {
          title: "序号",
          key: "index",
          width: 40,
          className: "tc"
        },
        {
          title: "公司名称",
          key: "orgName",
          className: "tc"
        },
        {
          title: "对账单号",
          key: "accountNo",
          className: "tc"
        },
        {
          title: "往来单位",
          key: "accountNo",
          className: "tc"
        },
        {
          title: "收付类型",
          key: "accountNo",
          className: "tc"
        },
        {
          title: "含税配件欠票",
          key: "accountNo",
          className: "tc"
        },
        {
          title: "含税油品欠票",
          key: "accountNo",
          className: "tc"
        },
        {
          title: "对冲配件发票",
          key: "accountNo",
          className: "tc",
          render:(h, params) => {
            return h('Input',params.row.accountNo)
          }
        },
        {
          title: "对冲油品发票",
          key: "accountNo",
          className: "tc",
          render:(h, params) => {
            return h('Input',params.row.accountNo)
          }
        },
        {
          title: "剩余含税配件欠票",
          key: "accountNo",
          className: "tc"
        },
        {
          title: "剩余含税油品欠票",
          key: "accountNo",
          className: "tc"
        }
      ], //对账单列表
      accessoriesBillingData: [{index:1}] //对账单列表数据
    };
  },
  methods: {
    // 保存草稿
    preservation() {},
    // 提交申请
    submission() {},
    // 选择对账单
    seleteAccount() {
      this.$refs.saleSelete.modal1=true
    },
    // 表格合计
    billSum({ columns, data }) {
      const sums = {};
      columns.forEach((column, index) => {
        const key = column.key;
        if (index === 0) {
          sums[key] = {
            key,
            value: "合计"
          };
          return;
        }
        const values = data.map(item => Number(item[key]));
        if (index === 7||index===8) {
          if (!values.every(value => isNaN(value))) {
            const v = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[key] = {
              key,
              value: v.toFixed(2)
            };
          }
        } else {
          sums[key] = {
            key,
            value: " "
          };
        }
      });
      return sums;
    }
  }
};
</script>