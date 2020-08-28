<template>
  <Modal v-model="modal1" title="增加不含税销售开票申请" width="1200" @on-visible-change="visChange">
    <div v-if="modelType.type===3">
      <div class="mb10">
        <span class="mr5">申请单号：</span>
        <Input type="text" v-model="formInline.applyNo" style="width: 200px" disabled />
      </div>
      <Row class="tableBox">
        <Col class="inner" span="4">申请人</Col>
        <Col class="inner" span="4">{{formInline.applicant || ''}}</Col>
        <Col class="inner" span="4">部门名称</Col>
        <Col class="inner" span="4">{{formInline.deptName || ' '}}</Col>
        <Col class="inner" span="4">门店店号</Col>
        <Col class="inner" span="4">{{formInline.shopCode || ' '}}</Col>
      </Row>
      <Row class="tableBox twoTable">
        <Col class="inner" span="4">门店名称</Col>
        <Col class="inner" span="4">{{formInline.orgName || ' '}}</Col>
        <Col class="inner" span="4">申请类型</Col>
        <Col class="inner" span="4">{{formInline.applyTypeName || ' '}}</Col>
        <Col class="inner" span="4">申请时间</Col>
        <Col class="inner" span="4">{{formInline.applyTime}}</Col>
      </Row>
      <h4 class="mb10 mt10">对账单明细</h4>
    </div>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="submission"
      v-has="'examine'"
      v-noresub
      :disabled="modelType.type!==1"
    >提交申请</button>
    <h4 class="mt10 mb10">基本信息</h4>
    <Row>
      <Col span="8">
        <span>分店名称：{{information.orgName}}</span>
      </Col>
      <Col span="8">
        <span>分店店号：{{information.code}}</span>
      </Col>
      <Col span="8">
        <span>往来单位：{{information.guestName}}</span>
      </Col>
    </Row>
    <Row class="mt10">
      <Col span="8">
        <span>不含税开票申请单号：{{information.noTaxApply}}</span>
      </Col>
      <Col span="8">
        <span>申请时间：{{information.applicationDate}}</span>
      </Col>
    </Row>
    <h4 class="mt10 mb10">发票数据</h4>
    <Form ref="formCustom" :model="invoice" :rules="invoiceRule" :label-width="80">
      <div style="display: flex">
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="对账单号" prop="accountNo">
            <Input v-model="invoice.accountNo" class="ml5 w100" disabled />
            <i class="iconfont iconcaidan input" v-if="Boolean(modelType.type != 3)" @click="seleteAccount"></i>
          </FormItem>
          <FormItem label="产生税费" prop="taxation">
            <Input v-model="invoice.taxation" class="ml5 w100" disabled />
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="不含税对账单未开金额" prop="notAmt" :label-width="160">
            <Input v-model="invoice.notAmt" class="ml5 w100" disabled />
          </FormItem>
          <FormItem label="实际增加开票金额" prop="invoiceAmt" :label-width="160">
            <Input v-model="invoice.invoiceAmt" class="ml5 w100" disabled />
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="本次不含税开票金额" prop="invoiceTaxAmt" :label-width="150">
            <Input v-model="invoice.invoiceTaxAmt" class="ml5 w100" :disabled="modelType.type!==1" />
          </FormItem>
          <FormItem label="申请说明" :label-width="150">
            <Input v-model="invoice.remark" class="ml5 w400" :disabled="modelType.type!==1" />
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="申请税点" prop="taxPoint">
            <InputNumber
              :disabled="modelType.type!==1"
              :min="0"
              :max="100"
              v-model="invoice.taxPoint"
              class="ml5 w100"
              :formatter="value => `${value}%`"
              :parser="value => value.replace('%', '')"
              @on-change="taxPointChange"/>
          </FormItem>
        </div>
      </div>
    </Form>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="seleteSale"
      v-has="'examine'"
      :disabled="modelType.type!==1"
    >选择必开不含税销售单</button>
    <h4 class="mt10">不含税开票清单</h4>
    <Table
      border
      :columns="accessoriesBilling"
      :data="accessoriesBillingData"
      show-summary
      :summary-method="billSum"
    ></Table>
    <!--<flow v-if="modelType.type===3" />-->
    <!-- 选择销售单据 -->
    <SeleteSale ref="SeleteSale" :popupTit="popupTit" :parameter="invoice" />
    <!-- 选择对账单 -->
    <saleAccount ref="saleAccount" :parameter="modelType" />
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import SeleteSale from "@/view/settlementManagement/bill/Popup/seleteSale";
import saleAccount from "@/view/settlementManagement/bill/Popup/saleAccount";
import { getThisAllList } from '@/api/documentApproval/documentApproval/documentApproval'
import { noTaxApplyNo, partsInvoice, submitNoTax } from "@/api/bill/popup";
import bus from "@/view/settlementManagement/bill/Popup/Bus";
import moment from "moment";
import flow from "../Flow.vue";
export default {
  components: {
    SeleteSale,
    saleAccount,
    flow
  },
  props: ["parameter", "modelType"],
  data() {
    const thisTaxChange = (rule, value, callback) => {
      if (value && parseFloat(value) >= 0) {
        if (value <= this.invoice.notAmt) {
          callback();
        } else {
          callback(new Error("不能大于不含税对账单未开票金额"));
        }
      } else {
        callback(new Error("只能输入数字"));
      }
    };
    return {
      information: {
        orgName: "",
        code: "",
        guestName: "",
        noTaxApply: "",
        applicationDate: ""
      },
      formInline: {
        applicant: "",
        deptName: "",
        shopCode: "",
        orgName: "",
        applyTypeName: "",
        applyTime: "",
        paymentOrgName: ""
      }, //所有数据对象
      tax: "", //税率
      modal1: false, //弹窗显示
      approvalTit: "开票申请流程", //审批流程
      popupTit: "选择必开不含税单据", //选择销售单据标题
      accessoriesBilling: [
        {
          title: "序号",
          type: "index",
          width: 40,
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
          key: "unit",
          className: "tc"
        },
        {
          title: "数量",
          key: "orderQty",
          className: "tc"
        },
        {
          title: "商品含税单价",
          key: "taxPrice",
          className: "tc",
          // render: (h, params) => {
          //   let number = params.row.taxPrice
          //   return h("span", number);
          // }
        },
        {
          title: "商品含税金额",
          key: "taxAmt",
          className: "tc",
          // render: (h, params) => {
          //   let number = params.row.taxAmt
          //
          //   return h("span", number);
          // }
        },
        {
          title: "开票税率",
          key: "invoiceTax",
          className: "tc"
        },
        {
          title: "出库单号",
          key: "orderNo",
          className: "tc"
        },
        {
          title: "销售单价",
          key: "salePrice",
          className: "tc",
          // render: (h, params) => {
          //   return h("span", params.row.salePrice);
          // }
        },
        {
          title: "销售金额",
          key: "saleAmt",
          className: "tc",
          // render: (h, params) => {
          //   return h("span", params.row.saleAmt);
          // }
        },
        {
          title: "已开票金额",
          key: "invoiceAmt",
          className: "tc",
          // render: (h, params) => {
          //   return h("span", params.row.invoiceAmt);
          // }
        },
        {
          title: "未开票金额",
          key: "invoiceNotAmt",
          className: "tc",
          // render: (h, params) => {
          //   return h("span", params.row.invoiceNotAmt);
          // }
        },
        {
          title: "申请开票金额",
          key: "applyAmt",
          className: "tc",
          // render: (h, params) => {
          //   return h("span", params.row.applyAmt);
          // }
        },
        {
          title: "外加税点",
          key: "additionalTaxPoint",
          className: "tc"
        }
      ], //开票配件
      accessoriesBillingData: [], //开票配件数据
      invoice: {
        taxPoint: 0, //申请税点
        taxApplicationList: [
          {
            value: 0.06,
            label: "6%"
          },
          {
            value: 0.07,
            label: "7%"
          }
        ], //申请税点列表
        accountNo: "", //对账单号
        taxation: "", //产生税费
        notAmt: "", //不含税对账单未开金额
        invoiceAmt: "", //实际增加开票金额
        invoiceTaxAmt: "", //本次不含税开票金额
        remark: "" //申请说明
      }, //发票数据表单
      invoiceRule: {
        taxPoint: [
          {
            required: true,
            message: "申请税点不能为空"
          }
        ],
        accountNo: [
          {
            required: true,
            message: "对账单号不能为空"
          }
        ],
        taxation: [
          {
            required: true,
            message: "产生税费不能为空"
          }
        ],
        notAmt: [
          {
            required: true,
            message: "不含税对账单未开金额不能为空"
          }
        ],
        invoiceAmt: [
          {
            required: true,
            message: "实际增加开票金额不能为空"
          }
        ],
        invoiceTaxAmt: [
          {
            required: true,
            // message: "本次含税开票金额不能为空",
            validator: thisTaxChange
          }
        ]
      }, //发票数据表单验证规则
      copyData: [] //深拷贝处理
      // num: 0 //表格数量合计
    };
  },
  mounted() {
    // 对账单
    bus.$on("accountNo", val => {
      this.invoice.taxPoint = 0.07;
      val.notAmt = val.serviceAmt - val.invoiceAmt;
      val.invoiceTaxAmt = val.notAmt;
      this.invoice = { ...this.invoice, ...val };
    });
    // 销售单
    bus.$on("partsData", val => {
      let data = [];
      let num = 0;
      val.map(item => {
        item.details.map(itm => {
          itm.invoiceTax = this.tax;
          num += itm.orderQty;
          data.push(itm);
        });
      });
      let sum = 0;
      data.map((itm, index) => {
        if (this.invoice.taxation) {
          itm.additionalTaxPoint = parseFloat(
            ((itm.orderQty / num) * this.invoice.taxation).toFixed1(2)
          );
          itm.taxAmt = parseFloat(
            (itm.applyAmt * 1 + itm.additionalTaxPoint * 1).toFixed(2)
          );
          itm.taxPrice = parseFloat((itm.taxAmt / itm.orderQty).toFixed(2));
          sum += itm.applyAmt * 1;
          if (sum > this.invoice.invoiceTaxAmt) {
            itm.applyAmt -= sum - this.invoice.invoiceTaxAmt;
            data = data.slice(0, index + 1);
          }
        }
      });
      if (sum < this.invoice.invoiceTaxAmt) {
        this.accessoriesBillingData = [...data, ...this.accessoriesBillingData];
      } else {
        this.accessoriesBillingData = data;
      }
      this.copyData = this.accessoriesBillingData;
    });
  },
  methods: {
    // 对话框是否显示
    async visChange(flag) {
      if (flag) {
        this.$refs.formCustom.resetFields();
        // 开票配件
        partsInvoice({
          accountNo: this.modelType.accountNo,
          taxSign: 0
        }).then(res => {
          if (res.code === 0) {
            this.invoice.taxPoint = 0.07;
            res.data.map(item => {
              item.invoiceTax = this.tax;
            })
            this.accessoriesBillingData = res.data;
            this.copyData = res.data;
          }
        });
        if (this.modelType.type === 3) {
          let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            user = this.$store.state.user.userData;
          this.formInline.applicant = user.staffName;
          this.formInline.deptName =
            user.groups[user.groups.length - 1].name || " 　　";
          this.formInline.shopCode = user.shopCode || " 　　";
          this.formInline.orgName = user.shopName;
          this.formInline.applyTypeName = "不含税开票申请";
          this.formInline.applyTime = date;
          this.formInline.paymentOrgName = user.shopName;
        }
        if(this.modelType.id){
          let data ={}
          data.id = this.modelType.id || ''
          let res = await getThisAllList(data)
          if(res.code == 0){
            // console.log(res.data)
            // this.information = res.data;
            this.formInline.applyNo = res.data.accountNo;
            this.information.code = res.data.orgCode;
            this.information.orgId = res.data.orgid;
            this.information.orgName = res.data.orgName;
            this.information.guestId = res.data.guestId;
            this.information.noTaxApply = res.data.applyNo;
            this.information.guestName = res.data.guestName;
            this.information.applicationDate = res.data.applyDate;
            this.invoice = res.data;
            this.invoice.taxApplicationList = [{value: "0.06", label: "6%"}, {value: "0.07", label: "7%"}];
            console.log(this.invoice)
              this.accessoriesBillingData = res.data.partList;
            // this.remarks = res.data.applyReason
          }
        }
      }
    },
    // 提交申请
    submission() {
      this.$refs.formCustom.validate(val => {
        if (val) {
          let obj = {
            ...{
              orgCode: this.information.code,
              orgid: this.information.orgId,
              orgName: this.information.orgName,
              guestId: this.information.guestId,
              applyNo: this.information.noTaxApply,
              guestName: this.information.guestName,
              partList: this.accessoriesBillingData,
              applyDate: this.information.applicationDate
            },
            ...this.invoice
          };
          if (this.invoice.taxPoint > 0.06) {
            bus.$emit("noTaxSaleList", this.accessoriesBillingData);
            bus.$emit("noTaxInfo", this.invoice);
            this.modal1 = false;
          } else {
            submitNoTax(obj).then(res => {
              if (res.code === 0) {
                this.$message.success("提交成功");
                this.modal1 = false;
              }
            });
          }
        }
      });
    },
    // 选择必开不含税销售单
    seleteSale() {
      this.$refs.SeleteSale.modal1 = true;
    },
    // 开票配件合计
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
        if (index >= 11) {
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
    },
    seleteAccount() {
      this.$refs.saleAccount.modal1 = true;
    },
    //税费计算
    pointComputed(total){
      this.invoicedAmountTotal = total;
      //产生税费
      let taxation = (total/(1-  this.$utils.divide(this.invoice.taxPoint , 100))- this.invoice.invoiceTaxAmt);
      this.invoice.taxation = taxation.toFixed(2);
      //实际增加开票金额
      this.invoice.invoiceAmt = (taxation + this.invoice.invoiceTaxAmt).toFixed(2);
    },

    taxPointChange(){
      this.pointComputed(this.invoicedAmountTotal);
    },
  },
  computed: {
    invoiceTaxAmt() {
      return this.invoice.invoiceTaxAmt;
    },
    taxPoint() {
      return this.invoice.taxPoint;
    }
  },
  watch: {
    invoiceTaxAmt(val, ov) {
      if (this.copyData.length !== 0 && val !== ov) {
        this.invoice.taxation = parseFloat(
          (val / (1 - this.invoice.taxPoint) - val).toFixed(2)
        );
        this.invoice.invoiceAmt = (val * 1 + this.invoice.taxation * 1).toFixed(
          2
        );
        let sum = 0;
        let accData = JSON.parse(JSON.stringify(this.copyData));
        this.accessoriesBillingData = [];
        let num = 0;
        accData.map(item => {
          num += item.orderQty;
        });
        for (let i of accData) {
          sum += i.applyAmt * 1;
          if (sum <= val) {
            this.accessoriesBillingData.push(i);
          } else {
            i.applyAmt -= sum - val;
            i.additionalTaxPoint = parseFloat(
              ((i.orderQty / num) * this.invoice.taxation).toFixed(2)
            );
            i.taxAmt = i.applyAmt + i.additionalTaxPoint;
            i.taxPrice = i.taxAmt / i.orderQty;
            return this.accessoriesBillingData.push(i);
          }
        }
      }
    },
    // 申请税点
    taxPoint(val, ov) {
      if (val !== ov) {
        // console.log(val);
        this.invoice.taxation = parseFloat(
          (
            this.invoice.invoiceTaxAmt / (1 - val) -
            this.invoice.invoiceTaxAmt
          ).toFixed(2)
        );
        this.invoice.invoiceAmt = (
          this.invoice.invoiceTaxAmt * 1 +
          this.invoice.taxation * 1
        ).toFixed(2);
        let num = 0;
        this.accessoriesBillingData.map(item => {
          num += item.orderQty;
        });
        // this.accessoriesBillingData.map(item => {
        //   item.additionalTaxPoint = parseFloat(
        //     ((item.orderQty / num) * this.invoice.taxation).toFixed(2)
        //   );
        //   item.taxAmt = item.applyAmt + item.additionalTaxPoint;
        //   item.taxPrice = item.taxAmt / item.orderQty;
        // });
      }
    },
    tax: {
      handler(val, ov) {
        if (val !== ov) {
          this.accessoriesBillingData.map(item => {
            this.$set(item, "invoiceTax", val);
          });
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.input {
  position: relative;
  left: -26px;
  bottom: -5px;
}
</style>
<style scoped lang="less">
.tableBox {
  line-height: 38px;
  text-align: center;
  border: #cccccc 1px solid;
  border-right: none;
  .inner {
    border-right: #cccccc 1px solid;
    height: 38px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .inner:nth-child(2n-1) {
    background: #f9f9f9;
  }
}

.twoTable {
  border-top: none;
}
</style>
