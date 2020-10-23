<template>
  <Modal v-model="modal1" title="增加不含税销售开票申请" width="1200">
    <Button
      class="ivu-btn ivu-btn-default mr10"
      @click="submission(1)"
      :loading="subDis"
      v-has="'examine'"
    >保存草稿</Button>
    <Button
      class="ivu-btn ivu-btn-default mr10"
      @click="submission(2)"
      :disabled="subDis"
      v-has="'examine'"
    >提交申请</Button>
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
          <FormItem label="对账单号" >
            <Input v-model="information.accountNo" style="width: 204px" class="ml5 " readonly />
            <!--<i class="iconfont iconcaidan input" @click="seleteAccount"></i>-->
          </FormItem>
          <FormItem label="产生税费" >
            <Input :value="getTaxesAndDues" class="ml5 w150" disabled />
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="不含税对账单未开金额":label-width="160">
            <Input v-model="information.statementAmtOwed" class="ml5 w100" disabled />
          </FormItem>
          <FormItem label="本次实际申请开票金额"  :label-width="160">
            <Input  :value="showPay" class="ml5 w100" disabled />
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="本次不含税开票金额" prop="invoiceTaxAmt" :label-width="150">
            <InputNumber :max="1000000000" :min="0" v-model="invoice.invoiceTaxAmt" class="ml5 w100"/>
          </FormItem>
          <FormItem label="申请说明" :label-width="150">
            <Input v-model="invoice.remark" class="ml5 w100" />
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="申请税点">
            <InputNumber
              :min="0"
              :max="100"
              v-model="invoice.taxPoint"
              class="ml5 w100"
              :formatter="value => `${value}%`"
              :parser="value => value.replace('%', '')"
             />
          </FormItem>
          <!--<FormItem label="外加税点总计" :label-width="150">-->
            <!--<Input v-model="invoice.additionalTaxPoint" class="ml5 w100"  readonly/>-->
          <!--</FormItem>-->
        </div>
      </div>
    </Form>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="seleteSale"
      v-has="'examine'"
    >选择必开不含税销售单</button>
    <h4 class="mt10">不含税开票清单</h4>

    <vxe-table
      border
      resizable
      ref="xTable2"
      auto-resize
      show-footer
      :footer-method="footerMethod"
      :data="accessoriesBillingData"
      :edit-config="{trigger: 'click', mode: 'cell'}"
    >
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="partName" title="配件名称" ></vxe-table-column>
      <vxe-table-column field="partCode" title="配件编码" ></vxe-table-column>
      <vxe-table-column field="unit" title="单位" ></vxe-table-column>
      <vxe-table-column field="qty" title="数量" ></vxe-table-column>
      <vxe-table-column field="taxPrice" title="商品含税单价" >
        <template v-slot="{row}">
          {{row.taxPrice | priceFilters}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="taxAmt" title="商品含税金额" >
        <template v-slot="{row}">
          {{row.taxAmt | priceFilters}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="taxRate" title="开票税率" ></vxe-table-column>
      <vxe-table-column field="outNo" title="出库单号" ></vxe-table-column>
      <vxe-table-column field="salePrice" title="销售单价" >
        <template v-slot="{row}">
          {{row.salePrice | priceFilters}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="saleAmt" title="销售金额" >
        <template v-slot="{row}">
          {{row.saleAmt | priceFilters}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="invoiceAmt" title="已开票金额" >
        <template v-slot="{row}">
          {{row.invoiceAmt | priceFilters}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="invoiceNotAmt" title="未开票金额" >
        <template v-slot="{row}">
          {{row.invoiceNotAmt | priceFilters}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="applyAmt" title="申请开票金额" :edit-render="{autofocus: '.vxe-input--inner'}">
        <template v-slot:edit="{ row }">
          <vxe-input type="float"  v-model="row.applyAmt" :max="row.saleAmt" digits="2"></vxe-input>
        </template>
      </vxe-table-column>
<!--      <vxe-table-column field="additionalTaxPoint" title="外加税点" ></vxe-table-column>-->
    </vxe-table>


<!--    <Table-->
<!--      border-->
<!--      :columns="accessoriesBilling"-->
<!--      :data="accessoriesBillingData"-->
<!--      show-summary-->
<!--      :summary-method="billSum"-->
<!--    ></Table>-->
    <div class="mt10">
<!--      <h4>不含税销售开票申请</h4>-->
<!--      <approval :approvalTit="approvalTit" />-->
    </div>
    <!-- 选择销售单据 -->
    <SeleteSale ref="SeleteSale" :popupTit="popupTit" :parameter="information" @partsData="partsData"/>
    <!-- 选择对账单 -->
    <saleAccount ref="saleAccount" :parameter="parameter" />
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import SeleteSale from "./seleteSale";
import approval from "./approval";
import saleAccount from "./saleAccount";
import { noTaxApplyNo, partsInvoice, submitNoTax ,saveNoTaxDraft,getNoTaxDraft} from "@/api/bill/popup";
import bus from "./Bus";
import { approvalStatus } from "_api/base/user";
import moment from "moment";

export default {
  components: {
    SeleteSale,
    approval,
    saleAccount
  },
  props: ["information", "parameter"],
  data() {
    const thisTaxChange = (rule, value, callback) => {
      if (value) {
        if (value > this.information.statementAmtOwed) {
          callback(new Error("不能大于不含税对账单未开票金额"));
        }
      } else {
        callback();
      }
    };
    const applyAmtValid = ({ cellValue, rule, rules, row, }) => {
      return new Promise((resolve,reject) => {
        if(parseFloat(row.salePrice) < parseFloat(cellValue)) {
           reject(new Error('申请开票金额不能大于销售金额'))
        }else{
          resolve();
        }
      })

    }
    return {
      tax: "", //税率
      modal1: false, //弹窗显示
      approvalTit: "开票申请流程", //审批流程
      popupTit: "选择必开不含税单据", //选择销售单据标题
      accessoriesBillingData: [], //开票配件数据
      subDis:false,//保存草稿按钮接口没有返回不可点击
      validRules: {
        applyAmt: [
          { validator:applyAmtValid }
        ],
      },//表格校验
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
        //accountNo: "", //对账单号
        taxation: "", //产生税费
        //notAmt: "", //不含税对账单未开金额
        invoiceAmt: "", //实际增加开票金额
        invoiceTaxAmt: 0, //本次不含税开票金额
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
            message: '不能为空'
          }
        ]
      }, //发票数据表单验证规则
      copyData: [], //深拷贝处理
      // num: 0 //表格数量合计
      invoicedAmountTotal:0,//总开票金额
    };
  },
  mounted() {
    // 对账单
    bus.$on("accountNo", val => {
      this.invoice.taxPoint = 7;
      val.notAmt = val.noInvoiceAmt
      val.invoiceTaxAmt = 0;
      this.invoice = { ...this.invoice, ...val };
    });
    // 销售单
    // bus.$on("partsData", val => {
    //   let data = [];
    //   let num = 0;
    //   val.map(item => {
    //     item.details.map(itm => {
    //       itm.invoiceTax = this.tax;
    //       num += itm.orderQty;
    //       data.push(itm);
    //     });
    //   });
    //   let sum = 0;
    //   data.map((itm, index) => {
    //     if (this.invoice.taxation) {
    //       itm.additionalTaxPoint = parseFloat(
    //         ((itm.orderQty / num) * this.invoice.taxation).toFixed1(2)
    //       );
    //       itm.taxAmt = parseFloat(
    //         (itm.applyAmt * 1 + itm.additionalTaxPoint * 1).toFixed(2)
    //       );
    //       itm.taxPrice = parseFloat((itm.taxAmt / itm.orderQty).toFixed(2));
    //       sum += itm.applyAmt * 1;
    //       if (sum > this.invoice.invoiceTaxAmt) {
    //         itm.applyAmt -= sum - this.invoice.invoiceTaxAmt;
    //         data = data.slice(0, index + 1);
    //       }
    //     }
    //   });
    //   if (sum < this.invoice.invoiceTaxAmt) {
    //     this.accessoriesBillingData = [...data, ...this.accessoriesBillingData];
    //   } else {
    //     this.accessoriesBillingData = data;
    //   }
    //   this.copyData = this.accessoriesBillingData;
    // });
  },
  methods: {
    //够选的数据放上面
    partsData(v){
      let oldPartData = [...this.accessoriesBillingData];
      if(v&&v.length>0){
        let orderNoArr = v.map(item => item.orderNo);
        let arrData1 = [];
        let bbArr = oldPartData.filter(item => {
          if(orderNoArr.includes(item.outNo)){
            return item;
          }else{
            arrData1.push(item);
          }
        });
        this.accessoriesBillingData = bbArr.concat(arrData1)
      }
    },
    async init(){
      this.$refs.xTable2.recalculate(true)
      if(this.information.owned){
        this.modal1 = true;
        this.getDraftInfo(this.information.accountNo);
      }else{
        this.visChange(true);
        let rep = await noTaxApplyNo({ orgid: this.information.orgId});
        if(rep.code==0){
          this.modal1 = true;
          this.information.noTaxApply = rep.data.applyNo;
          this.information.code = rep.data.orgCode;
          this.information.applicationDate = moment(
            new Date()
          ).format("YYYY-MM-DD HH:mm:ss");
        }
      }
    },

    async getDraftInfo(code){
      let rep = await getNoTaxDraft({accountNo:code})
      if(rep.code==0){
        // this.information = {};
        this.information.code = rep.data.orgCode||"";
        this.information.orgId = rep.data.orgid||"";
        this.information.orgName= rep.data.orgName||"";
        this.information.guestId= rep.data.guestId||"";
        this.information.noTaxApply= rep.data.applyNo||"";
        this.information.guestName= rep.data.guestName||"";
        this.information.applicationDate= rep.data.applyDate||"";
        this.information.statementAmtOwed= rep.data.notAmt||"";
        this.information.accountNo = rep.data.accountNo||"";
        this.information.id = rep.data.id;
        this.invoice.taxPoint = parseFloat(rep.data.taxPoint)||0;
        this.invoice.taxation = rep.data.taxation||0;
        this.invoice.invoiceAmt = rep.data.invoiceAmt||0;
        this.invoice.invoiceTaxAmt = rep.data.invoiceTaxAmt||0;
        this.invoice.remark = rep.data.remark||"";
        this.accessoriesBillingData = rep.data.partList||[];

      }
    },

    // 开票配件合计
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['applyAmt'].includes(column.property)) {
            this.$set(this.invoice , 'invoiceTaxAmt' , this.$utils.sum(data, column.property))
            // this.pointComputed(this.$utils.sum(data, column.property))
          }
          if (['orderQty', 'taxPrice','taxAmt','applyAmt','additionalTaxPoint'].includes(column.property)) {
            return this.$utils.sum(data, column.property)
          }
          return null
        })
      ]
    },

    //税费计算
    // pointComputed(total){
    //   this.invoicedAmountTotal = total;
    //   //产生税费
    //   console.log(total , 12)
    //   console.log(this.$utils.divide(this.invoice.taxPoint , 100) , 789)
    //   let taxation = (total/(1 - this.$utils.divide(this.invoice.taxPoint , 100)) - this.invoice.invoiceTaxAmt);
    //   this.invoice.taxation = taxation.toFixed(2);
    //   //实际增加开票金额
    //   this.invoice.invoiceAmt = (taxation + this.invoice.invoiceTaxAmt).toFixed(2);
    // },
    //
    // taxPointChange(){
    //   this.pointComputed(this.invoicedAmountTotal);
    // },

    // 对话框是否显示
    visChange(flag) {
      if (flag) {
        this.$refs.formCustom.resetFields();
        // 开票配件
        partsInvoice({
          accountNo: this.information.accountNo,
          taxSign: 0
        }).then(res => {
          if (res.code === 0) {
            // this.invoice = { ...this.invoice, ...this.information };
            // this.invoice.notAmt =
            //   this.invoice.accountsReceivable -
            //   this.invoice.taxAmountOfPartOpened;
            // this.invoice.invoiceTaxAmt = this.invoice.notAmt;
            this.invoice.taxPoint = 7;
            res.data.map(item => {
              item.invoiceTax = this.tax;
            });
            this.accessoriesBillingData = res.data;
            this.copyData = res.data;
          }
        });
        // approvalStatus({ instanceId: this.information.processInstance }).then(res => {
        //   if (res.code == 0) {
        //     bus.$emit('approval',res.data.operationRecords)
        //   }
        // });
      }
    },
    // 提交申请
     submission(type) { //type 1保存为草稿 2提交申请
      this.$refs.formCustom.validate(async val => {
        if (this.invoice.invoiceTaxAmt > this.information.statementAmtOwed ) return  this.$Message.error('本次不含税开票金额不能大于不含税对账单未开票金额')
        if (val) {
          let obj = {
            ...this.invoice,
            ...{
              orgCode: this.information.code,
              orgid: this.information.orgId,
              orgName: this.information.orgName||"",
              guestId: this.information.guestId,
              applyNo: this.information.noTaxApply,
              guestName: this.information.guestName,
              partList: this.accessoriesBillingData,
              applyDate: this.information.applicationDate,
              notAmt: this.information.statementAmtOwed,
              accountNo:this.information.accountNo
            }
          };
          if(this.information.owned){
            obj.id = this.information.id;
          }
          if (this.invoice.taxPoint > 6) {
            bus.$emit("noTaxSaleList", this.accessoriesBillingData);
            bus.$emit("noTaxInfo", this.invoice);
            this.modal1 = false;
          }
          if(type==2){
            this.subDis=true;
            submitNoTax(obj).then(res => {
              if(res.code===0){
                this.$emit('taxList' , res.data)
                this.$message.success('提交成功')
                this.subDis=false;
                this.modal1 = false;
                this.$parent.query();
              }else{
                this.subDis=false;
              }
            });
          }else{
            this.subDis=true;
            let rep = await saveNoTaxDraft(obj);
            if(rep.code===0){
              this.$emit('taxList' , rep.data)
              this.$message.success('保存成功')
              this.modal1 = false;
              this.subDis=false;
              this.$parent.query();
            }else{
              this.subDis=false;
            }
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
    }
  },
  computed: {
    invoiceTaxAmt() {
      return this.invoice.invoiceTaxAmt;
    },
    taxPoint() {
      return this.invoice.taxPoint;
    },
    //计算税费
    //本次不含税开票金额 / (1-税率) - 本次不含税开票金额
    getTaxesAndDues(){
      this.invoice.taxation =  this.$utils.subtract( this.$utils.divide(this.invoice.invoiceTaxAmt ,this.$utils.subtract(1 , this.$utils.divide( this.invoice.taxPoint , 100))  )  , this.invoice.invoiceTaxAmt )
      return this.invoice.taxation.toFixed(2)
    },
    //本次实际金额
    //本次不含税开票金额 / (1-税率)
    showPay(){
      this.invoice.invoiceAmt = this.$utils.divide(this.invoice.invoiceTaxAmt ,this.$utils.subtract(1 , this.$utils.divide( this.invoice.taxPoint , 100)  ))
      return this.invoice.invoiceAmt.toFixed(2)
    }
  },
  // watch: {
  //   invoiceTaxAmt(val, ov) {
  //     if (this.copyData.length !== 0 && val !== ov) {
  //       this.invoice.taxation = parseFloat(
  //         (val / (1 - this.invoice.taxPoint) - val).toFixed(2)
  //       );
  //       this.invoice.invoiceAmt = (val * 1 + this.invoice.taxation * 1).toFixed(
  //         2
  //       );
  //       let sum = 0;
  //       let accData = JSON.parse(JSON.stringify(this.copyData));
  //       this.accessoriesBillingData = [];
  //       let num = 0;
  //       accData.map(item => {
  //         num += item.orderQty;
  //       });
  //       for (let i of accData) {
  //         sum += i.applyAmt * 1;
  //         if (sum <= val) {
  //           this.accessoriesBillingData.push(i);
  //         } else {
  //           i.applyAmt -= sum - val;
  //           i.additionalTaxPoint = parseFloat(
  //             ((i.orderQty / num) * this.invoice.taxation).toFixed(2)
  //           );
  //           i.taxAmt = i.applyAmt + i.additionalTaxPoint;
  //           i.taxPrice = i.taxAmt / i.orderQty;
  //           return this.accessoriesBillingData.push(i);
  //         }
  //       }
  //       this.invoice.additionalTaxPoint = this.invoice.taxation
  //
  //     }
  //   },
  //   // 申请税点
  //   taxPoint(val, ov) {
  //     if (val !== ov) {
  //       this.invoice.taxation = parseFloat(
  //         (
  //           this.invoice.invoiceTaxAmt / (1 - val) -
  //           this.invoice.invoiceTaxAmt
  //         ).toFixed(2)
  //       );
  //       this.invoice.invoiceAmt = (
  //         this.invoice.invoiceTaxAmt * 1 +
  //         this.invoice.taxation * 1
  //       ).toFixed(2);
  //       let num = 0;
  //       this.accessoriesBillingData.map(item => {
  //         num += item.orderQty;
  //       });
  //       // this.accessoriesBillingData.map(item => {
  //       //   item.additionalTaxPoint = parseFloat(
  //       //     ((item.orderQty / num) * this.invoice.taxation).toFixed(2)
  //       //   );
  //       //   // item.taxAmt = item.applyAmt
  //       //   item.taxPrice = item.taxAmt / item.orderQty;
  //       // });
  //
  //         this.invoice.additionalTaxPoint = this.invoice.taxation
  //     }
  //   },
  //   tax: {
  //     handler(val, ov) {
  //       if (val !== ov) {
  //         this.accessoriesBillingData.map(item => {
  //           this.$set(item, "invoiceTax", val);
  //         });
  //       }
  //     }
  //   }
  // }
};
</script>
<style lang="less" scoped>
.input {
  position: relative;
  left: -26px;
  bottom: -5px;
}
</style>
