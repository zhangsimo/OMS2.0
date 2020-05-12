<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box paddinSize">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <quickDate class="mr10" ref="quickDate" @quickDate="quickDate"></quickDate>
          </div>
          <div class="db ml20">
            <span>申请时间：</span>
            <Date-picker
              format="yyyy-MM-dd"
              :value="value"
              @on-change="changedate"
              type="daterange"
              placeholder="选择日期"
              class="w200"
            ></Date-picker>
          </div>
          <div class="ml20 flexd" >
             <span>分店名称：</span>
              <Select v-model="form.orgName" style="width:180px">
                <Option v-for="item in proTypeList" :value="item.id" :key="item.id">{{item.name}}</Option>
              </Select>
            <!-- <i class="iconfont iconcaidan input" @click="Dealings(1)"></i> -->
          </div>
          <div class="db ml20">
            <span>客户：</span>
              <Select v-model="form.guestId" style="width:180px">
                <Option v-for="item in guestNameList" :value="item.id" :key="item.id">{{item.fullName}}</Option>
              </Select>
          </div>
          <div class="db ml10">
            <button class="ivu-btn ivu-btn-default" type="button" @click="query">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
          <div class="db ml10">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="modal1 = true">
              <i class="iconfont iconcaidan"></i>
              <span>更多</span>
            </button>
          </div>
        </div>
      </div>
      <div>
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="operation(1)"
          v-has="'export'"
        >导出汇总</button>
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="operation(2)"
          v-has="'export'"
        >导出明细</button>
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="operation(3)"
          v-has="'export'"
        >智能核销</button>
        <button
          class="ivu-btn ivu-btn-default mr10"
          type="button"
          @click="operation(4)"
          v-has="'export'"
        >人工核销</button>
        <button
          class="ivu-btn ivu-btn-default"
          type="button"
          @click="operation(5)"
          v-has="'export'"
        >撤销核销</button>
      </div>
      <div class="mt20">
        <Button class="mr10" :type="isActive===''?'info':'default'" @click="chooseTable('')">全部显示</Button>
        <Button class="mr10" :type="isActive==1?'info':'default'" @click="chooseTable(1)">已核销</Button>
        <Button :type="isActive===0?'info':'default'" @click="chooseTable(0)">未核销</Button>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <Table
          border
          :columns="columns"
          :data="data"
          ref="summary"
          highlight-row
          @on-selection-change="requires"
          max-height="400"
        ></Table>
        <Page
          :total="pagetotal"
          show-elevator
          class="mt10 fr"
          show-sizer
          @on-change="pageCode"
          show-total
          size="small"
        />
        <button class="mt30 ivu-btn ivu-btn-default" type="button">开票申请配件明细</button>
        <Table border :columns="columns1" :data="data1" class="mt10" max-hight="400" ref="parts"></Table>
      </div>
    </section>
    <invoiceApplyModelTost ref="Toast"></invoiceApplyModelTost>
  </div>
</template>
<script>
import {
  getInvoiceList,
  getDetailsList,
  IntelligenceList,
  updateNumber,
  writeData,
  getOptionFdList,
  getOptionGuesList
} from "_api/salesManagment/invoiceApply";
import invoiceApplyModelTost from "./invoiceApplyModelTost.vue";
import quickDate from "@/components/getDate/dateget_bill.vue";
import moment from "moment";
export default {
  components: {
    invoiceApplyModelTost,
    quickDate
  },
  data() {
    return {
      proTypeList:[],//分店
      columns: [
        {
          title: "选择",
          width: 40,
          type: "selection"
        },
        {
          title: "序号",
          className: "tc",
          render: (h, params) => {
            return h(
              "span",
              params.index + this.form.page * this.form.size + 1
            );
          }
        },
        {
          title: "分店名称",
          key: "orgName",
          className: "tc"
        },
        {
          title: "店号",
          key: "orgCode",
          className: "tc"
        },
        {
          title: "往来单位",
          key: "guestName",
          className: "tc"
        },
        {
          title: "申请日期",
          key: "applyDate",
          className: "tc"
        },
        {
          title: "对账单号",
          key: "accountNo",
          className: "tc",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: "red"
                },
                on: {
                  click: () => {
                    this.details.accountNo = params.row.accountNo;
                    this.getDetails();
                  }
                }
              },
              params.row.accountNo
            );
          }
        },
        {
          title: "开票单位",
          key: "receiptUnit",
          className: "tc"
        },
        {
          title: "申请开票金额",
          key: "apply_amt",
          className: "tc"
        },
        {
          title: "开票公司",
          key: "invoiceUnit",
          className: "tc"
        },
        {
          title: "开票清单类型",
          key: "species",
          className: "tc"
        },
        {
          title: "寄件方式",
          key: "sending_way",
          className: "tc"
        },
        {
          title: "快递单号",
          key: "sending_number",
          className: "tc",
          render: (h, params) => {
            return h("Input", {
              style: {
                width: "60px"
              },
              props: {
                type: "text",
                // value:this.data1[params.index].sort
                value: params.row.sendingNumber
              },
              on: {
                "on-blur": event => {
                  // this.data1[params.index].sort =event.target.value
                  let form = {
                    id: params.row.id,
                    sendingNumber: event.target.value
                  };
                  updateNumber(form).then(res => {
                    if (res.code === 0) {
                      this.$Message.success(res.data);
                      this.getDataList();
                    }
                  });
                }
              }
            });
          }
        },
        {
          title: "发票代码",
          key: "invoiceCode",
          className: "tc"
        },
        {
          title: "发票号码",
          key: "invoiceNo",
          className: "tc"
        },
        {
          title: "导入开票单位",
          key: "import_invoice_unit",
          className: "tc"
        },
        {
          title: "验证开票单位",
          key: "verify_invoice_unit",
          className: "tc"
        },
        {
          title: "增发票价税合计加类型",
          key: "priceTaxTotal",
          className: "tc"
        },
        {
          title: "发票不含税金额",
          key: "notTaxAmt",
          className: "tc"
        },
        {
          title: "发票税额",
          key: "invoiceTax",
          className: "tc"
        },
        {
          title: "已核销金额",
          key: "canceledTax",
          className: "tc"
        },
        {
          title: "剩余未核销开票",
          key: "remainCancelTax",
          className: "tc"
        }
      ],
      data: [],
      columns1: [
        {
          title: "序号",
          width: 40,
          className: "tc",
          render: (h, params) => {
            return h("span", params.index + 1);
          }
        },
        {
          title: "分店名称",
          key: "orgName",
          className: "tc"
        },
        {
          title: "店号",
          key: "orgId",
          className: "tc"
        },
        {
          title: "往来单位",
          key: "guestName",
          className: "tc"
        },
        {
          title: "申请日期",
          key: "applyDate",
          className: "tc"
        },
        {
          title: "对账单号",
          key: "accountNo",
          className: "tc"
        },
        {
          title: "油品清单开票申请单号",
          key: "oilsListOrder",
          className: "tc"
        },
        {
          title: "配件清单开票申请单号",
          key: "partsListOrder",
          className: "tc"
        },
        {
          title: "发票种类",
          className: "tc",
          render: (h , params) => {
            return h('span' , params.row.invoiceKind == 1 ? '增值税普通发票' : '增值税专用发票')
          }
        },
        {
          title: "购方税号",
          key: "customDuty",
          className: "tc"
        },
        {
          title: "购方手机号",
          key: "customPhone",
          className: "tc"
        },
        {
          title: "购方邮箱",
          key: "customMail",
          className: "tc"
        },
        {
          title: "购方开户行及账号",
          key: "customAccount",
          className: "tc"
        },
        {
          title: "购方开户行",
          key: "customBank",
          className: "tc"
        },
        {
          title: "购方地址、电话",
          key: "customAddress",
          className: "tc"
        },
        {
          title: "开票申请单号",
          key: "applyNo",
          className: "tc"
        },
        {
          title: "开票单位",
          key: "invoiceUnit",
          className: "tc"
        },
        {
          title: "客户税号",
          key: "taxNo",
          className: "tc"
        },
        {
          title: "地址电话",
          key: "tel",
          className: "tc"
        },
        {
          title: "银行账号",
          key: "bankAccountNumber",
          className: "tc"
        },
        {
          title: "配件名称",
          key: "partName",
          className: "tc"
        },
        {
          title: "配件编码",
          key: "partCode",
          className: "tc"
        },
        {
          title: "单位",
          key: "company",
          className: "tc"
        },
        {
          title: "数量",
          key: "qty",
          className: "tc"
        },
        {
          title: "商品含税单价",
          key: "taxPrice",
          className: "tc"
        },
        {
          title: "商品含税金额",
          key: "taxAmt",
          className: "tc"
        },
        {
          title: "开票税率",
          key: "taxRate",
          className: "tc"
        },
        {
          title: "出库单号",
          key: "outNo",
          className: "tc"
        },
        {
          title: "销售单价",
          key: "salePrice",
          className: "tc"
        },
        {
          title: "销售金额",
          key: "saleAmt",
          className: "tc"
        },
        {
          title: "外加税点",
          key: "additionalTaxPoint",
          className: "tc"
        },
        {
          title: "申请开票总金额",
          key: "billstate",
          className: "tc"
        },
        {
          title: "开票公司",
          key: "receiptUnit",
          className: "tc"
        },
        {
          title: "收款方式",
          key: "collection_type",
          className: "tc"
        },
        {
          title: "发票类型",
          key: "invoiceType",
          className: "tc"
        },
        {
          title: "开票清单类型",
          key: "species",
          className: "tc"
        },
        {
          title: "备注",
          key: "remark",
          className: "tc"
        },
        {
          title: "快递方式",
          key: "sendingWay",
          className: "tc"
        }
      ],
      data1: [],
      value: [],
      model1: "",
      Branchstore: [1, 2, 3, 4, 5],
      Reconciliationlist: [],
      pagetotal: 0,
      Reconciliationtype: "",
      isActive: "",
      guestNameList:[],
      form: {
        orgName:'',
        guestId:'',
        page: 0,
        size: 10,
        startDate: "",
        endDate: "",
        cancalStatus: 1
      },
      details: {
        page: 0,
        size: 10,
        accountNo: ""
      },
      allTablist: [],
      flag: true
    };
  },
  methods: {
    //选择查询条件
    chooseTable(num) {
      this.isActive = num;
      this.form.page = 0;
      this.form.cancalStatus = num;
      this.getDataList();
    },
    quickDate(data){
      this.value = data;
      this.form.startDate=this.value[0]?moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss"): ""
      this.form.endDate=this.value[1]? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss"): "",
      this.getDataList();
    },
    query() {
      this.form.startDate = this.value.length ? this.value[0] : "";
      this.form.endDate = this.value.length ? this.value[1] : "";
      this.getDataList();
    },
    operation(num) {
      switch (num) {
        case 1:
          break;
        case 2:
          this.modifyData();
          break;
        case 3:
          this.Intelligence();
          break;
        case 4:
          this.cancellation();
          break;
        case 5:
          this.writeDataList();
          break;
      }
    },
    Dealings(num) {},
    //撤销核销
    writeDataList() {
      if (!this.allTablist.length) {
        return this.$Message.warning("请选择要撤销核销的数据");
      } else {
        let writeList = [];
        this.allTablist.forEach((item, index) => {
          writeList.push({
            id: item.id
          });
          if (item.canceledTax == 0 || item.canceledTax == null) {
            return (this.flag = false);
          } else {
            this.flag = true;
          }
        });
        if (this.flag) {
          this.$Modal.confirm({
            title: "警告",
            content: "<p>确认撤回核销？</p>",
            onOk: () => {
              writeData(writeList).then(res => {
                if (res.code === 0) {
                  this.$Message.success(res.data);
                  this.getDataList();
                }
              });
            },
            onCancel: () => {}
          });
        } else {
          return this.$Message.warning("请选择已核销金额不为0的数据");
        }
      }
    },
    //表格全选的时候
    requires(val) {
      this.allTablist = val;
    },
    cancellation() {
      if (!this.allTablist.length) {
        return this.$Message.warning("请选择要核销的数据！");
      } else if (this.allTablist.length >= 2) {
        return this.$Message.warning("请选择一条要核销的数据！");
      } else {
        this.$refs.Toast.data = this.allTablist;
        this.$refs.Toast.modals = true;
      }
    },
    // 选择日期
    changedate(daterange) {
      this.value = daterange;
    },
    pageCode() {},
    getDetails() {
      getDetailsList(this.details).then(res => {
        if (res.code === 0) {
          this.data1 = res.data.content;
        }
      });
    },
    getDataList() {
      getInvoiceList(this.form).then(res => {
        if (res.code === 0) {
          this.data = res.data.content;
          this.pagetotal = res.data.totalElements;
        }
      });
    }
  },
  mounted() {
    this.getDataList();
    getOptionFdList().then(res=>{
      if(res.code===0){
        this.proTypeList=res.data
      }
    })
    getOptionGuesList().then(res=>{
      if(res.code===0){
        this.guestNameList = res.data
      }
    })
  }
};
</script>
<style lang="less" scoped>
.input {
  position: relative;
  left: -26px;
  bottom: -2px;
}
.flexd{
  display: flex;
  align-items: center;
}
</style>
