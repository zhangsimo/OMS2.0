<template>
  <Modal
    v-model="modals"
    title="人工核销"
    width="90%"
    @on-visible-change="visChange"
  >
    <div>
      <div class="mb20">
        <span>发票申请数据</span>
        <Button class="ml10" type="info" @click="submitConfig">确认核销</Button>
      </div>
      <div>
        <Table
          border
          :columns="columns"
          :data="data"
          ref="summary"
          highlight-row
          max-height="400"
        ></Table>
      </div>
    </div>
    <div class="mt20">
      <div><span>销售发票导入数据</span></div>
      <div style="display:flex" class="mt20 mb20">
        <div class="db ml20">
          <span>开票单位：</span>
          <Select v-model="form.invoiceUnit" style="width:180px" clearable>
            <Option
              v-for="item in invoice.issuingOfficeList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </div>
        <div class="db ml20">
          <span>发票号码：</span>
          <input type="text" class="h30" v-model="form.invoiceNo" />
        </div>
        <div class="db ml20">
          <span>开票单位：</span>
          <input type="text" class="h30" v-model="form.receiptUnit" />
        </div>
        <div class="db ml10">
          <Button class="ml10" type="info" @click="queryDataList">查询</Button>
        </div>
      </div>
      <div>
        <Table
          border
          :columns="columns1"
          :data="data1"
          highlight-row
          @on-selection-change="requireMore"
          max-height="400"
        ></Table>
      </div>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import { getManualList, subManualList } from "_api/salesManagment/invoiceApply";
import { goshop } from "@/api/settlementManagement/shopList";
import { getDataDictionaryTable } from "@/api/system/dataDictionary/dataDictionaryApi";
export default {
  data() {
    return {
      model1: "",
      modals: false,
      hxOjb: {
        invoiceApplyId: "",
        salesInvoiceId: ""
      },
      columns: [
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
          className: "tc"
        },
        {
          title: "发票单位",
          key: "receiptUnit",
          className: "tc"
        },
        {
          title: "申请开票金额",
          key: "applyAmt",
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
          key: "sendingWay",
          className: "tc"
          // render: (h,params) =>{
          //     return h('span',(params.row.orderAmt).toFixed(2))
          // }
        },
        {
          title: "快递单号",
          key: "sendingNumber",
          className: "tc"
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
          key: "importInvoiceUnit",
          className: "tc"
        },
        {
          title: "验证开票单位",
          key: "verifyInvoiceUnit",
          className: "tc"
        },
        {
          title: "发票价税合计",
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
          key: "index",
          title: "选择",
          width: 40,
          type: "selection",
          className: "tc"
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
          title: "发票类型",
          key: "invoiceTypeName",
          className: "tc"
        },
        {
          title: "开票公司",
          key: "invoiceUnitName",
          className: "tc"
        },
        {
          title: "分店",
          key: "orgName",
          className: "tc"
        },
        {
          title: "店号",
          key: "orgCode",
          className: "tc"
        },
        {
          title: "收款方式",
          key: "collectionTypeName",
          className: "tc"
        },
        {
          title: "发票号码",
          key: "invoiceNo",
          className: "tc"
        },
        {
          title: "发票单位",
          key: "receiptUnitName",
          className: "tc"
        },
        {
          title: "开票日期",
          key: "invoiceDate",
          className: "tc"
        },
        {
          title: "本次核销金额",
          key: "rpAmt",
          className: "tc",
          width: 180,
          render: (h, params) => {
            return h("el-input-number", {
              props: {
                precision: 2,
                controls: false,
                value: params.row.paymentBalance  || 0.00,
                size: "small",
                min: 0.00,
                max: params.row.paymentBalance<this.data[0].applyAmt?params.row.paymentBalance:this.data[0].applyAmt,
              },
              on: {
                input: val => {
                  this.data1[params.index].rpAmt = val;
                }
              }
            });
          }
        },
        {
          title: "已核销金额",
          key: "writeOffAmount",
          className: "tc"
        },
        {
          title: "剩余未核销金额",
          key: "paymentBalance",
          className: "tc"
        },
        {
          title: "价税合计",
          key: "priceTaxTotal",
          className: "tc"
        },
        {
          title: "发票金额",
          key: "sendingWay",
          className: "tc"
          // render: (h,params) =>{
          //     return h('span',(params.row.orderAmt).toFixed(2))
          // }
        },
        {
          title: "发票税额",
          key: "invoiceAmount",
          className: "tc"
        },
        {
          title: "往来单位",
          key: "receiptUnitName",
          className: "tc"
        },
        // {
        // title: "开票清单类型",
        // key: "speciesName",
        // className: "tc"
        // },
        {
          title: "开票业务",
          key: "invoiceServiceName",
          className: "tc"
        },
        {
          title: "税率",
          key: "tax",
          className: "tc"
        },
        {
          title: "备注",
          key: "remark",
          className: "tc"
        },
        {
          title: "导入人",
          key: "createUname",
          className: "tc"
        },
        {
          title: "导入时间",
          key: "importTime",
          className: "tc"
        }
      ],
      data1: [],
      form: {
        orgid: "",
        invoiceNo: "",
        receiptUnit: "",
        page: 0,
        size: 9999
      },
      allSelectList: [],
      proTypeList: [],
      invoice: {
        issuingOfficeList: []
      }
    };
  },
  methods: {
    visChange(flag) {
      if (flag) {
        // this.purchaserList = this.$parent.purchaserOptionList;
        // this.taxRate = this.$parent.taxOptionList;
        // this.paymentMethod = this.$parent.payOptionList;
        // this.invoiceSortList = this.$parent.invoiceOptionList;
        // this.listType = this.$parent.billingOptionList;
      }
    },
    submitConfig() {
      if (!this.allSelectList.length) {
        this.$Message.warning("请选择要核销的数据");
      } else if (this.allSelectList.length >= 2) {
        this.$Message.warning("请选择一条数据");
      } else {
        this.hxOjb.salesInvoiceId = this.allSelectList[0].id;
        this.hxOjb.invoiceApplyId = this.data[0].id;
        if(this.allSelectList[0].rpAmt<0.01){
          this.$Message.error("本次核销金额最小为0.01")
          return
        }
        let d = this.data1.find(el => el.id == this.allSelectList[0].id);
        this.hxOjb.rpAmt = d.rpAmt ;
        subManualList(this.hxOjb).then(res => {
          if (res.code === 0) {
            this.$Message.warning("核销成功");
            this.model1 = false;
            this.hxOjb = {
              invoiceApplyId: "",
              salesInvoiceId: ""
            };
            this.$parent.getDataList();
          }
        });
      }
    },
    queryDataList() {
      getManualList(this.form).then(res => {
        if (res.code === 0) {
          this.data1 = res.data.content;
        }
      });
    },
    requireMore(val) {
      this.allSelectList = val;
    },
    async getShop() {
      let data = {};
      data.supplierTypeSecond = this.model1;
      let res = await goshop(data);
      if (res.code === 0) {
        this.proTypeList = [...this.proTypeList, ...res.data];
        this.$nextTick(() => {
          if (localStorage.getItem("oms2-userList")) {
            this.BranchstoreId = JSON.parse(
              localStorage.getItem("oms2-userList")
            ).shopId;
          } else {
            this.BranchstoreId = this.$store.state.user.userData.shopId;
          }
        });
      }
    }
  },
  mounted() {
    this.getShop();
    this.proTypeList.map(itm => {
      this.$refs.registrationEntry.orgName = itm.name;
    });
    getDataDictionaryTable({ dictCode: "KPDW" }).then(res => {
      res.data.map(item => {
        this.invoice.issuingOfficeList.push({
          value: item.itemCode,
          label: item.itemName
        });
      });
    });
  }
};
</script>
<style lang="less" scoped></style>
