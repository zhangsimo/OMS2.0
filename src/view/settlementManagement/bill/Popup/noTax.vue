<template>
  <Modal v-model="modal1" title="增加不含税销售开票申请" width="1200" @on-visible-change="visChange">
    <Button
      class="ivu-btn ivu-btn-default mr10"
      @click="submission(1)"
      v-has="'examine'"
    >保存草稿
    </Button>
    <Button
      class="ivu-btn ivu-btn-default mr10"
      @click="submission(2)"
      v-has="'examine'"
    >提交申请
    </Button>
    <h4 class="mt10 mb10">基本信息</h4>
    <Row style="border:1px solid #000c17;">
      <Col span="8" class="pt10 pb10 pl10" style="padding: 10px;box-sizing:border-box;border-right:1px solid #000c17">
        <span>分店名称：{{information.orgName}}</span>
      </Col>
      <Col span="8" class="pt10 pb10 pl10" style="padding: 10px;border-right:1px solid #000c17">
        <span>分店店号：{{information.code}}</span>
      </Col>
      <Col span="8" class="pt10 pb10 pl10" style="padding: 10px;">
        <Poptip placement="top" trigger="hover" :content="information.guestNames" max-width="140">
          <div style="width: 300px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">往来单位：{{information.guestNames}}</div>
        </Poptip>
      </Col>
    </Row>
    <Row style="border:1px solid #000c17;border-top: none;">
      <Col span="8" class="pt10 pb10 pl10" style="padding: 10px;border-right:1px solid #000c17">
        <span>不含税开票申请单号：{{information.noTaxApply}}</span>
      </Col>
      <Col span="8" class="pt10 pb10 pl10" style="padding: 10px;border-right:1px solid #000c17">
        <span>申请时间：{{information.applicationDate}}</span>
      </Col>
      <Col span="8" class="pt10 pb10 pl10" style="padding: 10px;">
        <Poptip placement="top" trigger="hover" :content="information.accountNos" max-width="140">
          <div style="width: 300px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">对账单号：{{information.accountNos}}</div>
        </Poptip>
      </Col>
    </Row>
    <h4 class="mt10 mb10">发票数据</h4>
    <Form ref="formCustom" :model="invoice" :rules="invoiceRule" :label-width="160">
      <div style="display: flex">
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="发票单位" prop="receiptUnit">
            <Select v-model.trim="invoice.receiptUnit" class="ml5 w200" @on-change="invoiceChange">
              <Option
                v-for="item in invoice.receiptUnitList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="税号" prop="taxNo">
            <Input v-model.trim="invoice.taxNo" class="ml5 w200" />
          </FormItem>
          <FormItem label="地址电话" prop="tel">
            <Input v-model.trim="invoice.tel" class="ml5 w200" />
          </FormItem>
          <FormItem label="开户行及账号" prop="bankName">
            <Input v-model.trim="invoice.bankName" class="ml5 w200" />
          </FormItem>
          <FormItem label="开票单位" prop="issuingOfficeId">
            <Select v-model.trim="invoice.issuingOfficeId" class="ml5 w200" @on-change="invoUnitChange" >
              <Option
                v-for="item in invoice.issuingOfficeList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="开票税率" prop="invoiceTax">
            <Input type="text" v-model.trim="invoice.invoiceTax" class="ml5 w200" disabled/>
          </FormItem>
          <FormItem label="票据类型" prop="invoiceType">
            <Input type="text" v-model.trim="invoice.invoiceType" class="ml5 w200" disabled/>
          </FormItem>
          <FormItem label="收款方式" prop="collectionType">
            <Select v-model.trim="invoice.collectionType" class="ml5 w200">
              <Option
                v-for="item in invoice.paymentMethodList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="快递收件人" prop="consignee">
            <Input v-model.trim="invoice.consignee" class="ml5 w200" />
          </FormItem>
          <FormItem label="收件地址" prop="address">
            <Input v-model.trim="invoice.address" class="ml5 w200" />
          </FormItem>
          <FormItem label="电话" prop="phone">
            <Input v-model.trim="invoice.phone" class="ml5 w200" placeholder="固定电话格式为xxx-xxxxxx"/>
          </FormItem>
          <FormItem label="寄件方式" prop="sendingWay">
            <Select v-model.trim="invoice.sendingWay" class="ml5 w200">
              <Option
                v-for="item in invoice.waySendingList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="费用承担" prop="costBear">
            <Select v-model.trim="invoice.costBear" class="ml5 w200">
              <Option
                v-for="item in invoice.bearingCostList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="快递备注">
            <Input v-model.trim="invoice.remark" class="ml5 w200" />
          </FormItem>
          <FormItem>
            <span style="color:#0099FF;cursor:pointer;" @click="quote">引用上次申请信息</span>
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="不含税对账单未开金额">
            <Input v-model="information.statementAmtOwed" class="ml5 w200" disabled/>
          </FormItem>
          <FormItem label="产生税费">
            <Input :value="getTaxesAndDues" class="ml5 w200" disabled/>
          </FormItem>
          <FormItem label="本次不含税开票金额" prop="invoiceTaxAmt">
            <InputNumber :max="1000000000" :min="0" v-model="invoice.invoiceTaxAmt" class="w200" style="margin-left:5px;"/>
          </FormItem>
          <FormItem label="本次实际申请开票金额">
            <Input :value="showPay" class="ml5 w200" disabled/>
          </FormItem>
          <FormItem label="申请税点">
            <InputNumber
              :min="0"
              :max="100"
              v-model="invoice.taxPoint"
              class="w200"
              style="margin-left:5px;"
              :formatter="value => `${value}%`"
              :parser="value => value.replace('%', '')"
            />
          </FormItem>
          <FormItem label="申请说明">
            <Input v-model="invoice.underTicketExplain" class="ml5 w200"/>
          </FormItem>
        </div>
      </div>
    </Form>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="seleteSale"
      v-has="'examine'"
    >选择必开不含税销售单
    </button>
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
      <vxe-table-column field="partName" title="配件名称"></vxe-table-column>
      <vxe-table-column field="partCode" title="配件编码"></vxe-table-column>
      <vxe-table-column field="unit" title="单位"></vxe-table-column>
      <vxe-table-column field="qty" title="数量"></vxe-table-column>
      <vxe-table-column field="taxPrice" title="商品含税单价">
        <template v-slot="{row}">
          {{row.taxPrice | priceFilters}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="taxAmt" title="商品含税金额">
        <template v-slot="{row}">
          {{row.taxAmt | priceFilters}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="taxRate" title="开票税率"></vxe-table-column>
      <vxe-table-column field="outNo" title="出库单号"></vxe-table-column>
      <vxe-table-column field="salePrice" title="销售单价">
        <template v-slot="{row}">
          {{row.salePrice | priceFilters}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="saleAmt" title="销售金额">
        <template v-slot="{row}">
          {{row.saleAmt | priceFilters}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="thisAccountAmt" title="本次对账金额" >
        <template v-slot="{row}">
          {{row.thisAccountAmt | priceFilters}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="invoiceAmt" title="已开票金额">
        <template v-slot="{row}">
          {{row.invoiceAmt | priceFilters}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="invoiceNotAmt" title="未开票金额">
        <template v-slot="{row}">
          {{row.invoiceNotAmt | priceFilters}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="applyNoTaxAmt" title="本次不含税开票金额"></vxe-table-column>
      <vxe-table-column field="applyAmt" title="申请开票金额" :edit-render="{autofocus: '.vxe-input--inner'}">
        <template v-slot:edit="{ row }">
          <vxe-input type="float" v-model="row.applyAmt" :max="row.saleAmt" digits="2"></vxe-input>
        </template>
      </vxe-table-column>
    </vxe-table>
    <!-- 选择销售单据 -->
    <SeleteSale ref="SeleteSale" :popupTit="popupTit" :parameter="information" @partsData="partsData"/>
    <!-- 选择对账单 -->
    <saleAccount ref="saleAccount" :parameter="parameter"/>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
  import SeleteSale from "./seleteSale";
  import approval from "./approval";
  import saleAccount from "./saleAccount";
  import {noTaxApplyNo, partsInvoice, submitNoTax, ditInvoices,findCurrentIssuing,saveNoTaxDraft, getNoTaxDraft,informationNoCitation} from "@/api/bill/popup";
  import bus from "./Bus";
  import {approvalStatus} from "_api/base/user";
  import moment from "moment";
  import {showLoading, hideLoading} from "../../../../utils/loading";
  import { getDataDictionaryTable } from "@/api/system/dataDictionary/dataDictionaryApi";

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
      const applyAmtValid = ({cellValue, rule, rules, row,}) => {
        return new Promise((resolve, reject) => {
          if (parseFloat(row.salePrice) < parseFloat(cellValue)) {
            reject(new Error('申请开票金额不能大于销售金额'))
          } else {
            resolve();
          }
        })

      }
      const validPhone = (rule , value ,callback) => {
        let phone = /^(\d{3,4}-)?\d{7,8}$/
        let tel = /^1[3456789]\d{9}$/
        if (value) {
          if (phone.test(value) || tel.test(value)) {
            callback();
          } else {
            callback(new Error("电话号码格式不对"));
          }
        } else {
          callback(new Error("电话号码不能为空"));
        }
      }
      return {
        tax: "", //税率
        modal1: false, //弹窗显示
        approvalTit: "开票申请流程", //审批流程
        popupTit: "选择必开不含税单据", //选择销售单据标题
        accessoriesBillingData: [], //开票配件数据
        validRules: {
          applyAmt: [
            {validator: applyAmtValid}
          ],
        },//表格校验
        invoice: {
          consignee: "", //快递收件人
          receiptUnit: "", // 发票单位
          receiptUnitList: [], //发票单位列表
          taxNo: "", //税号
          tel: "", //地址电话
          bankName: "", //开户行及账号
          issuingOfficeId: "", //开票单位
          issuingOfficeList: [], //开票单位列表
          invoiceType: "", //开票类型
          typeBillingList: [], //开票类型列表
          invoiceTax: "", //开票税率
          rateBillingList: [], //开票税率列表
          collectionType: "", //收款方式
          paymentMethodList: [], //收款方式列表
          costBear: "", //费用承担
          bearingCostList: [
            {
              value: '0',
              label: "现付"
            },
            {
              value: '1',
              label: "到付"
            },
            {
              value: '2',
              label: "自取"
            }
          ], //费用承担列表
          applyAmt: "", //申请开票金额
          address: "", //收件地址
          remark: "", //备注
          phone: "", //电话
          notTaxAmt: "", //不含税金额
          sendingWay: "", //寄件方式
          waySendingList: [], //寄件方式列表
          additionalTaxPoint: "", //外加税点
          taxPoint: 0, //申请税点
          taxation: "", //产生税费
          invoiceAmt: "", //实际增加开票金额
          invoiceTaxAmt: 0, //本次不含税开票金额
          underTicketExplain: "" //申请说明
        }, //发票数据表单
        invoiceRule: {
          consignee: [
            {
              required: true,
              message: "快递收件人不能为空"
            }
          ],
          receiptUnit: [
            {
              required: true,
              message: "发票单位不能为空"
            }
          ],
          taxNo: [
            {
              required: true,
              message: "税号不能为空"
            }
          ],
          tel: [
            {
              required: true,
              message: "地址电话不能为空"
            }
          ],
          bankName: [
            {
              required: true,
              message: "开户行及账号不能为空"
            }
          ],
          issuingOfficeId: [
            {
              required: true,
              message: "开票单位不能为空",
              trigger: "change"
            }
          ],
          collectionType: [
            {
              required: true,
              message: "收款方式不能为空",
              trigger: "change"
            }
          ],
          costBear: [
            {
              required: true,
              message: "费用承担不能为空"
            }
          ],
          address: [
            {
              required: true,
              message: "收件地址不能为空"
            }
          ],
          phone: [
            {
              required: true,
              validator: validPhone,
            }
          ],
          sendingWay: [
            {
              required: true,
              message: "寄件方式不能为空",
              trigger: "blur"
            }
          ],
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
        invoicedAmountTotal: 0,//总开票金额
      };
    },
    mounted() {
      // 对账单
      bus.$on("accountNo", val => {
        this.invoice.taxPoint = 7;
        val.notAmt = val.noInvoiceAmt
        val.invoiceTaxAmt = 0;
        this.invoice = {...this.invoice, ...val};
      });
      // 收款方式数据字典
      getDataDictionaryTable({ dictCode: "RECEIVABLE_TYPE" }).then(res => {
        res.data.map(item => {
          this.invoice.paymentMethodList.push({
            value: item.itemCode,
            label: item.itemName
          });
        });
      });
      // 寄件方式数据字典
      getDataDictionaryTable({ dictCode: "MAIL_TYPE" }).then(res => {
        res.data.map(item => {
          this.invoice.waySendingList.push({
            value: item.itemCode,
            label: item.itemName
          });
        });
      });
      // 开票单位
      findCurrentIssuing().then(res => {
        res.data.map(item => {
          this.invoice.issuingOfficeList.push({
            value: item.id,
            label: item.name,
            taxRateName:item.taxRateName,
            invoiceTypeName:item.invoiceTypeName
          });
        });
      });
    },
    methods: {
      invoUnitChange(option){
        this.invoice.issuingOfficeList.map(el=>{
          if(el.value==option){
            this.invoice.invoiceTax=el.taxRateName;
            this.invoice.invoiceType=el.invoiceTypeName;
          }
        })
      },
      //够选的数据放上面
      partsData(v) {
        let oldPartData = [...this.accessoriesBillingData];
        if (v && v.length > 0) {
          let orderNoArr = v.map(item => item.orderNo);
          let arrData1 = [];
          let bbArr = oldPartData.filter(item => {
            if (orderNoArr.includes(item.outNo)) {
              item.ifNecessary = 1
              return item;
            } else {
              arrData1.push(item);
            }
          });
          this.accessoriesBillingData = bbArr.concat(arrData1)
        }
      },
      // 发票单位带出税号等信息
      invoiceChange(val) {
        this.invoice.receiptUnitList.map(item => {
          if (item.value === val) {
            this.invoice.taxNo = item.taxpayerCode;
            this.invoice.tel = item.taxpayerTel;
            this.invoice.bankName = item.accountBankNo;
          }
        });
      },
      // 引用上次申请信息
      quote() {
        informationNoCitation({ guestId: this.information.guestId }).then(res => {
          if (res.code === 0) {
            for(let key in this.invoice){
              if(key!="statementAmtOwed"&&key!="applyTaxAmt"){
                if (res.data.hasOwnProperty(key)){
                  this.invoice[key] = res.data[key]
                }
              }
            }
          }
        });
      },
      async init() {
        this.$refs.xTable2.recalculate(true)
        if (this.information.owned) {
          this.modal1 = true;
          this.getDraftInfo(this.information.accountNos.split(";"));
        } else {
          this.visChange(true);
          let rep = await noTaxApplyNo();
          if (rep.code == 0) {
            this.modal1 = true;
            this.information.noTaxApply = rep.data.applyNo;
            this.information.code = rep.data.orgCode;
            this.information.applicationDate = moment(
              new Date()
            ).format("YYYY-MM-DD HH:mm:ss");
            this.information.orgName = this.$store.state.user.userShopName;
            // 发票单位
            ditInvoices(this.information.guestIds.split(";") ).then(res => {
              if (res.code === 0) {
                res.data.map(item => {
                  item.label = item.taxpayerName;
                  item.value = item.id;
                });
                this.invoice.receiptUnitList = res.data;
              }
            });
          }
        }
      },

      async getDraftInfo(code) {
        let rep = await getNoTaxDraft({accountNos: code})
        if (rep.code == 0) {
          // this.information = {};
          this.information.code = rep.data.orgCode || "";
          this.information.orgId = rep.data.orgid || "";
          this.information.orgName = rep.data.orgName || "";
          this.information.guestId = rep.data.guestId || "";
          this.information.noTaxApply = rep.data.applyNo || "";
          this.information.guestNames = rep.data.guestName || "";
          this.information.applicationDate = rep.data.applyDate || "";
          this.information.statementAmtOwed = parseFloat(rep.data.notAmt).toFixed(2) || "";
          this.information.accountNo = rep.data.accountNo || "";
          this.information.id = rep.data.id;
          this.invoice.taxPoint = parseFloat(rep.data.taxPoint) || 0;
          this.invoice.taxation = rep.data.taxation || 0;
          this.invoice.invoiceAmt = rep.data.invoiceAmt || 0;
          this.invoice.invoiceTaxAmt = rep.data.invoiceTaxAmt || 0;
          this.invoice.underTicketExplain = rep.data.underTicketExplain || "";
          this.accessoriesBillingData = rep.data.partList || [];
          // 发票单位
          ditInvoices(this.information.guestIds.split(";") ).then(res => {
            if (res.code === 0) {
              res.data.map(item => {
                item.label = item.taxpayerName;
                item.value = item.id;
              });
              this.invoice.receiptUnitList = res.data;
            }
          });
        }
      },

      // 开票配件合计
      footerMethod({columns, data}) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return '合计'
            }
            if (['applyAmt'].includes(column.property)) {
              this.$set(this.invoice, 'invoiceTaxAmt', this.$utils.sum(data, column.property))
            }
            if (['orderQty', 'taxPrice', 'taxAmt', 'applyAmt', 'additionalTaxPoint'].includes(column.property)) {
              return this.$utils.sum(data, column.property)
            }
            return null
          })
        ]
      },
      // 对话框是否显示
      visChange(flag) {
        if (flag) {
          this.$refs.formCustom.resetFields();
          // 开票配件
          partsInvoice({
            accountNos: this.information.accountNos.split(";"),
            taxSign: 0,
          }).then(res => {
            if (res.code === 0) {
              this.invoice.taxPoint = 7;
              res.data.map(item => {
                item.invoiceTax = this.tax;
              });
              this.accessoriesBillingData = res.data;
              this.copyData = res.data;
            }
          });
        }else{
          this.information.statementAmtOwed =0
        }
      },
      // 提交申请
      submission(type) { //type 1保存为草稿 2提交申请
        this.$refs.formCustom.validate(async val => {
          if (this.invoice.invoiceTaxAmt > this.information.statementAmtOwed) return this.$Message.error('本次不含税开票金额不能大于不含税对账单未开票金额')
          if (val) {
            let obj = {
              ...this.invoice,
              ...{
                orgCode: this.$store.state.user.userData.currentCompany.code,
                orgid: this.$store.state.user.userData.currentCompany.id,
                orgName: this.information.orgName || "",
                guestIds: this.information.guestIds.split(";"),
                applyNo: this.information.noTaxApply,
                guestNames: this.information.guestNames.split(";"),
                partList: this.accessoriesBillingData,
                applyDate: this.information.applicationDate,
                notAmt: this.information.statementAmtOwed,
                accountNos: this.information.accountNos.split(";")
              }
            };
            if (this.information.owned) {
              obj.id = this.information.id;
            }
            if (this.invoice.taxPoint > 6) {
              bus.$emit("noTaxSaleList", this.accessoriesBillingData);
              bus.$emit("noTaxInfo", this.invoice);
              this.modal1 = false;
            }
            if (type == 2) {
              showLoading()
              submitNoTax(obj).then(res => {
                if (res.code === 0) {
                  this.$emit('taxList', res.data)
                  this.$message.success('提交成功')
                  hideLoading()
                  this.modal1 = false;
                  this.$parent.query();
                } else {
                  hideLoading()
                }
              });
            } else {
              showLoading()
              let rep = await saveNoTaxDraft(obj);
              if (rep.code === 0) {
                this.$emit('taxList', rep.data)
                this.$message.success('保存成功')
                this.modal1 = false;
                hideLoading()
                this.$parent.query();
              } else {
                hideLoading()
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
      billSum({columns, data}) {
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
      getTaxesAndDues() {
        this.invoice.taxation = this.$utils.subtract(this.$utils.divide(this.invoice.invoiceTaxAmt, this.$utils.subtract(1, this.$utils.divide(this.invoice.taxPoint, 100))), this.invoice.invoiceTaxAmt)
        return this.invoice.taxation.toFixed(2)
      },
      //本次实际金额
      //本次不含税开票金额 / (1-税率)
      showPay() {
        this.invoice.invoiceAmt = this.$utils.divide(this.invoice.invoiceTaxAmt, this.$utils.subtract(1, this.$utils.divide(this.invoice.taxPoint, 100)))
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
