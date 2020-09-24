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
        <Button class="ml10" type="info" @click="submitConfig" :loading="submitConfigDis">确认核销</Button>
      </div>
      <div>
        <Table
          border
          :columns="columns"
          :data="data"
          ref="summary"
          highlight-row
          :tooltip="true"
          max-height="400"
          size="small"
        ></Table>
      </div>
    </div>
    <div class="mt20">
      <div><span>销售发票导入数据</span></div>
      <div style="display:flex" class="mt20 mb20">
        <div class="db ml20">
          <span>开票公司：</span>
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
          size="small"
          :columns="columns1"
          :data="data1"
          :tooltip="true"
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
      submitConfigDis:false,//核销接口没有返回之前按钮不可点击
      hxOjb: {
        invoiceApplyId: "",
        salesInvoiceId: ""
      },
      columns: [
        {
          title: "序号",
          className: "tc",
          width: 80,
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
          className: "tc",
          tooltip: true,
          width: 140
        },
        {
          title: "店号",
          key: "orgCode",
          tooltip: true,
          width: 80,
          className: "tc"
        },
        {
          title: "往来单位",
          key: "guestName",
          tooltip: true,
          width: 140,
          className: "tc"
        },
        {
          title: "申请日期",
          key: "applyDate",
          tooltip: true,
          width: 130,
          className: "tc"
        },
        {
          title: "对账单号",
          key: "accountNo",
          tooltip: true,
          width: 130,
          className: "tc"
        },
        {
          title: "发票单位",
          key: "receiptUnit",
          tooltip: true,
          width: 120,
          className: "tc"
        },
        {
          title: "申请开票金额",
          key: "applyAmt",
          tooltip: true,
          width: 100,
          className: "tc"
        },
        {
          title: "开票公司",
          key: "invoiceUnit",
          tooltip: true,
          width: 120,
          className: "tc"
        },
        {
          title: "开票清单类型",
          key: "species",
          tooltip: true,
          width: 120,
          className: "tc"
        },
        {
          title: "寄件方式",
          key: "sendingWay",
          tooltip: true,
          width: 80,
          className: "tc"
          // render: (h,params) =>{
          //     return h('span',(params.row.orderAmt).toFixed(2))
          // }
        },
        {
          title: "快递单号",
          key: "sendingNumber",
          tooltip: true,
          width: 120,
          className: "tc"
        },
        {
          title: "发票代码",
          key: "invoiceCode",
          tooltip: true,
          width: 120,
          className: "tc"
        },
        {
          title: "发票号码",
          key: "invoiceNo",
          tooltip: true,
          width: 120,
          className: "tc"
        },
        {
          title: "导入开票单位",
          key: "importInvoiceUnit",
          tooltip: true,
          width: 120,
          className: "tc"
        },
        {
          title: "验证开票单位",
          key: "verifyInvoiceUnit",
          tooltip: true,
          width: 120,
          className: "tc"
        },
        {
          title: "发票价税合计",
          key: "priceTaxTotal",
          tooltip: true,
          width: 100,
          className: "tc"
        },
        {
          title: "发票不含税金额",
          key: "notTaxAmt",
          tooltip: true,
          width: 110,
          className: "tc"
        },
        {
          title: "发票税额",
          key: "invoiceTax",
          tooltip: true,
          width: 80,
          className: "tc"
        },
        {
          title: "已核销金额",
          key: "canceledTax",
          tooltip: true,
          width: 80,
          className: "tc"
        },
        {
          title: "剩余未核销开票",
          key: "remainCancelTax",
          tooltip: true,
          width: 120,
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
          tooltip: true,
          width: 80,
          className: "tc"
        },
        {
          title: "开票公司",
          key: "invoiceUnitName",
          tooltip: true,
          width: 120,
          className: "tc"
        },
        {
          title: "分店",
          key: "orgName",
          tooltip: true,
          width: 120,
          className: "tc"
        },
        {
          title: "店号",
          key: "orgCode",
          tooltip: true,
          width: 120,
          className: "tc"
        },
        {
          title: "收款方式",
          key: "collectionTypeName",
          tooltip: true,
          width: 80,
          className: "tc"
        },
        {
          title: "发票号码",
          key: "invoiceNo",
          tooltip: true,
          width: 120,
          className: "tc"
        },
        {
          title: "发票单位",
          key: "receiptUnitName",
          tooltip: true,
          width: 120,
          className: "tc"
        },
        {
          title: "开票日期",
          key: "invoiceDate",
          tooltip: true,
          width: 130,
          className: "tc"
        },
        {
          title: "本次核销金额",
          key: "rpAmt",
          className: "tc",
          tooltip: true,
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
          tooltip: true,
          width: 80,
          className: "tc"
        },
        {
          title: "剩余未核销金额",
          key: "paymentBalance",
          tooltip: true,
          width: 110,
          className: "tc"
        },
        {
          title: "价税合计",
          key: "priceTaxTotal",
          tooltip: true,
          width: 80,
          className: "tc"
        },
        {
          title: "发票金额",
          key: "sendingWay",
          tooltip: true,
          width: 80,
          className: "tc"
          // render: (h,params) =>{
          //     return h('span',(params.row.orderAmt).toFixed(2))
          // }
        },
        {
          title: "发票税额",
          key: "invoiceAmount",
          tooltip: true,
          width: 80,
          className: "tc"
        },
        {
          title: "往来单位",
          key: "receiptUnitName",
          tooltip: true,
          width: 120,
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
          tooltip: true,
          width: 80,
          className: "tc"
        },
        {
          title: "税率",
          key: "tax",
          tooltip: true,
          width: 80,
          className: "tc"
        },
        {
          title: "备注",
          key: "remark",
          tooltip: true,
          width: 120,
          className: "tc"
        },
        {
          title: "导入人",
          key: "createUname",
          tooltip: true,
          width: 80,
          className: "tc"
        },
        {
          title: "导入时间",
          key: "importTime",
          tooltip: true,
          width: 130,
          className: "tc"
        }
      ],
      data1: [],
      form: {
        orgid: "",
        invoiceNo: "",
        receiptUnit: "",
        page: 0,
        size: 9999,
        invoiceUnit: "",
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
        this.submitConfigDis=true;
        subManualList(this.hxOjb).then(res => {
          if (res.code === 0) {
            this.submitConfigDis=false;
            this.$Message.warning("核销成功");
            this.model1 = false;
            this.hxOjb = {
              invoiceApplyId: "",
              salesInvoiceId: ""
            };
            this.$parent.getDataList();
          }else{
            this.submitConfigDis=false;
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
    this.form.invoiceUnit = this.$store.state.user.userData.makeCode;
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
