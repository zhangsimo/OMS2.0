<template>
  <Modal v-model="modal1" title="销售开票申请" width="1300" @on-visible-change="visChange">
    <Button
      class="ivu-btn ivu-btn-default mr10"
      @click="preservation"
      :loading="proserDis"
      v-has="'examine'"
    >保存草稿</Button>
    <Button
      class="ivu-btn ivu-btn-default mr10"
      v-noresub
      @click="submission"
      :loading="proserDis"
      v-has="'examine'"
    >提交申请</Button>
    <!--<button-->
      <!--class="ivu-btn ivu-btn-default mr10"-->
      <!--type="button"-->
      <!--@click="add"-->
      <!--v-has="'examine'"-->
    <!--&gt;增加不含税销售开票申请</button>-->
    <h4 class="mt10 mb10">基本信息</h4>
    <Row>
      <Col span="6">
        <span>分店名称：{{information.orgName}}</span>
      </Col>
      <Col span="6">
        <span>分店店号：{{information.code}}</span>
      </Col>
      <Col span="6">
        <span>往来单位：{{information.guestName}}</span>
      </Col>
      <Col span="6">
        <span>对账单号：{{information.accountNo}}</span>
      </Col>
    </Row>
    <Row class="mt10 ml10">
      <Col span="6">
        <span>开票申请单号：{{information.applyNo}}</span>
      </Col>
      <Col span="6">
        <span>申请时间：{{information.applicationDate}}</span>
      </Col>
      <Col span="6">
        <span>油品-开票申请单号： <span>{{information.oilsListOrder}}</span></span>
      </Col>
      <Col span="6">
        <span>配件-开票申请单号： <span>{{information.partsListOrder}}</span></span>
      </Col>
    </Row>
    <h4 class="mt10 mb10">发票数据</h4>
    <Form ref="formCustom" :model="invoice" :rules="invoiceRule" :label-width="160">
      <div style="display: flex">
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="发票单位" prop="receiptUnit">
            <Select v-model="invoice.receiptUnit" class="ml5 w200" @on-change="invoiceChange">
              <Option
                v-for="item in invoice.receiptUnitList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="税号" prop="taxNo">
            <Input v-model="invoice.taxNo" class="ml5 w200" />
          </FormItem>
          <FormItem label="地址电话" prop="tel">
            <Input v-model="invoice.tel" class="ml5 w200" />
          </FormItem>
          <FormItem label="开户行及账号" prop="bankName">
            <Input v-model="invoice.bankName" class="ml5 w200" />
          </FormItem>
          <FormItem label="开票单位" prop="invoiceUnit">
            <Select v-model="invoice.invoiceUnit" class="ml5 w200">
              <Option
                v-for="item in invoice.issuingOfficeList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="开票税率" prop="invoiceTax">
            <Select v-model="invoice.invoiceTax" class="ml5 w200" disabled>
              <Option
                v-for="item in invoice.rateBillingList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="票据类型" prop="invoiceType">
            <Select v-model="invoice.invoiceType" class="ml5 w200">
              <Option
                v-for="item in invoice.typeBillingList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="收款方式" prop="collectionType">
            <Select v-model="invoice.collectionType" class="ml5 w200">
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
            <Input v-model="invoice.consignee" class="ml5 w200" />
          </FormItem>
          <FormItem label="收件地址" prop="address">
            <Input v-model="invoice.address" class="ml5 w200" />
          </FormItem>
          <FormItem label="电话" prop="phone">
            <Input v-model="invoice.phone" class="ml5 w200" placeholder="固定电话格式为xxx-xxxxxx"/>
          </FormItem>
          <FormItem label="寄件方式" prop="sendingWay">
            <Select v-model="invoice.sendingWay" class="ml5 w200">
              <Option
                v-for="item in invoice.waySendingList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="费用承担" prop="costBear">
            <Select v-model="invoice.costBear" class="ml5 w200">
              <Option
                v-for="item in invoice.bearingCostList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="快递备注">
            <Input v-model="invoice.remark" class="ml5 w200" />
          </FormItem>
          <FormItem>
            <span style="color:#0099FF;cursor:pointer;" @click="quote">引用上次申请信息</span>
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="对账单欠票金额" prop="statementAmtOwed">
            <Input v-model="invoice.statementAmtOwed" class="ml5 w200" disabled />
          </FormItem>
          <FormItem label="本次申请开票含税金额" prop="applyTaxAmt" >
            <Input-number :max="1000000000" :min="0" v-model="invoice.applyTaxAmt" class="ml5 w200" @on-blur="confirmTheAmount " />
          </FormItem>
          <!--<FormItem label="不含税金额" prop="notTaxAmt">-->
            <!--<Input v-model="invoice.notTaxAmt" class="ml5 w200" disabled />-->
          <!--</FormItem>-->
          <!--<FormItem label="外加税点" prop="additionalTaxPoint">-->
            <!--<Input v-model="invoice.additionalTaxPoint" class="ml5 w200" disabled />-->
          <!--</FormItem>-->
          <!--<FormItem label="申请开票金额" >-->
            <!--<Input v-model="invoice.applyAmt" class="ml5 w200" disabled />-->
          <!--</FormItem>-->
          <FormItem label="开票说明" >
            <Input v-model="invoice.underTicketExplain" class="ml5 w200" />
          </FormItem>
        </div>
      </div>
    </Form>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="seleteSale"
      v-has="'examine'"
    >选择必开销售单</button>
    <Tabs type="card" value="invoice1" class="mt10">
      <TabPane label="配件清单" name="invoice1">

        <vxe-table
          border
          resizable
          show-footer
          auto-resize
          ref="xTable1"
          :footer-method="footerMethod"
          :data="accessoriesBillingData1"
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
          <!--<vxe-table-column field="applyAmt" title="申请开票金额"  :edit-render="{name: '$input', props: {type: 'float', digits: 2}}"></vxe-table-column>-->
          <vxe-table-column field="applyAmt" title="申请开票金额" >
            <template v-slot="{ row }">
              {{row.applyAmt | priceFilters}}
            </template>
          </vxe-table-column>
          <vxe-table-column field="additionalTaxPoint" title="外加税点" ></vxe-table-column>
        </vxe-table>

      </TabPane>
      <TabPane label="油品清单" name="invoice2">
        <vxe-table
          border
          resizable
          ref="xTable2"
          auto-resize
          show-footer
          :footer-method="footerMethod"
          :data="accessoriesBillingData2"
          :edit-config="{trigger: 'click', mode: 'row'}"
        >
          <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
          <vxe-table-column field="partName" title="配件名称" ></vxe-table-column>
          <vxe-table-column field="partCode" title="配件编码" ></vxe-table-column>
          <vxe-table-column field="unit" title="单位" ></vxe-table-column>
          <vxe-table-column field="qty" title="数量" ></vxe-table-column>
          <vxe-table-column field="oilsSpec" title="油品包装规格" ></vxe-table-column>
          <vxe-table-column field="oilsUnit" title="油品换算单位" ></vxe-table-column>
          <vxe-table-column field="oilsQty" title="油品换算数量" ></vxe-table-column>
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
          <!--<vxe-table-column field="applyAmt" title="申请开票金额"  :edit-render="{name: '$input', props: {type: 'float', digits: 2}}"></vxe-table-column>-->
          <vxe-table-column field="applyAmt" title="申请开票金额" >
            <template v-slot="{ row }">
              {{row.invoiceNotAmt | priceFilters}}
            </template>
          </vxe-table-column>
          <vxe-table-column field="additionalTaxPoint" title="外加税点" ></vxe-table-column>
        </vxe-table>

      </TabPane>
    </Tabs>
    <SeleteSale ref="SeleteSale" :popupTit="popupTit" :parameter="parameter" @partsData="partsData"/>
    <noTax ref="noTax" :information="information" :parameter="parameter"  @taxList="getnoTaxSaleList" />
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import approval from "./approval";
import SeleteSale from "./seleteSale";
import noTax from "./noTax";
import { getDataDictionaryTable } from "@/api/system/dataDictionary/dataDictionaryApi";
import { approvalStatus } from "_api/base/user";
import {
  noTaxApplyNo,
  ditInvoice,
  informationCitation,
  partsInvoice,
  saveDraft,
  submitDraft,
  getDraftList
} from "@/api/bill/popup";
import bus from "./Bus";
import index from "../../../admin/roles";
export default {
  components: {
    approval,
    SeleteSale,
    noTax
  },
  data() {
    const validateTax = (rule, value, callback) => {
      if (value) {
        if (parseFloat(value) > parseFloat(this.invoice.statementAmtOwed)) {
          callback(new Error("不得大于欠票金额"));
        } else {
          callback();
        }
      } else {
        callback(new Error("本次申请开票含税金额不能为空"));
      }
    };
    const validateTicket = (rule, value, callback) => {
      if (
        parseFloat(this.invoice.applyTaxAmt) !=
        parseFloat(this.invoice.statementAmtOwed) && this.invoice.underTicketExplain.trim() == ''
      ) {
          callback(new Error("欠票金额不等于本次申请开票含税金额"));
      } else {
        callback();
      }
    };
    const applyAmtValid = ({ cellValue, rule, rules, row, }) => {
      if( cellValue) {
        return Promise.reject(new Error('申请开票金额不能大于未开票金额'))
      }
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
    const thisOneMoney = ({ cellValue, rule, rules, row, }) => {
      if(row.invoiceNotAmt < cellValue) {
        return Promise.reject(new Error('申请开票金额不能大于未开票金额'))
      }
    }
    return {
      isCanRequest:true, //请求拦截
      parameter: {}, //销售单参数
      information: {}, //基本信息数据
      approvalTit: "开票申请流程", //审批流程
      popupTit: "选择必开销售单", //选择必开销售单弹框标题
      modal1: false, // 弹框开关
      proserDis:false,//保存草稿 按钮接口返回前不可再次点击
      invoice: {
        consignee: "", //快递收件人
        receiptUnit: "", // 发票单位
        receiptUnitList: [], //发票单位列表
        taxNo: "", //税号
        tel: "", //地址电话
        bankName: "", //开户行及账号
        invoiceUnit: "", //开票单位
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
        statementAmtOwed: "", //对账单欠票金额
        applyAmt: "", //申请开票金额
        address: "", //收件地址
        remark: "", //备注
        applyTaxAmt: "", //本次申请开票含税金额
        underTicketExplain: "", //欠票未全金额开具说明
        phone: "", //电话
        notTaxAmt: "", //不含税金额
        sendingWay: "", //寄件方式
        waySendingList: [], //寄件方式列表
        additionalTaxPoint: "" //外加税点
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
        invoiceUnit: [
          {
            required: true,
            message: "开票单位不能为空",
            trigger: "change"
          }
        ],
        invoiceType: [
          {
            required: true,
            message: "开票类型不能为空",
            trigger: "change"
          }
        ],
        invoiceTax: [
          {
            required: true,
            message: "开票税率不能为空",
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
        statementAmtOwed: [
          {
            required: true,
            message: "对账单欠票金额不能为空"
          }
        ],
        // applyAmt: [
        //   {
        //     required: true,
        //     message: "申请开票金额不能为空"
        //   }
        // ],
        address: [
          {
            required: true,
            message: "收件地址不能为空"
          }
        ],
        applyTaxAmt: [
          {
            required: true,
            message:'本次申请开票含税金额不能为空'
          }
        ],
        underTicketExplain: [
          {
            validator: validateTicket
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
      }, //发票数据表单验证规则
      accessoriesBillingData: [], //开票配件数据
      accessoriesBillingData1:[],
      accessoriesBillingData2:[],
      validRules: {
        applyAmt: [
          { validator:applyAmtValid }
        ],
    },
      copyData: [], //开票配件复制数据
      OilPartShow:true, //油品展示
    };
  },
  mounted() {
    // 税率和开票类型数据字典
    getDataDictionaryTable({ dictCode: "CS00107" }).then(res => {
      res.data.map(item => {
        this.invoice.typeBillingList.push({
          value: item.itemCode,
          label: item.itemName
        });
        this.invoice.rateBillingList.push({
          value: item.itemCode,
          label: (item.itemValueOne * 100).toFixed(0) + "%"
        });
      });
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
    // 开票单位数据字典
    getDataDictionaryTable({ dictCode: "KPDW" }).then(res => {
      res.data.map(item => {
        this.invoice.issuingOfficeList.push({
          value: item.itemCode,
          label: item.itemName
        });
      });
    });



    // // 选择销售单
    // bus.$on("partsData", val => {
    //   let data = [];
    //   val.map(item => {
    //     item.details.map(itm => {
    //       // itm.invoiceTax = this.$refs.noTax.tax;
    //       data.push(itm);
    //     });
    //   });
    //   let sum = 0;
    //   data.map((itm, index) => {
    //     itm.taxAmt = parseFloat(
    //       (itm.applyAmt * 1 + itm.additionalTaxPoint * 1).toFixed(2)
    //     );
    //     itm.taxPrice = parseFloat((itm.taxAmt / itm.orderQty).toFixed(2));
    //     sum += itm.applyAmt * 1;
    //     if (sum > this.invoice.applyTaxAmt) {
    //       itm.applyAmt -= sum - this.invoice.applyTaxAmt;
    //       data = data.slice(0, index + 1);
    //     }
    //   });
    //   if (sum < this.invoice.applyTaxAmt) {
    //     this.accessoriesBillingData = [...data, ...this.accessoriesBillingData];
    //     let s = 0
    //     this.accessoriesBillingData.map((item,index)=>{
    //       s+=item.applyAmt * 1
    //       if (s > this.invoice.applyTaxAmt) {
    //       item.applyAmt -= s - this.invoice.applyTaxAmt;
    //       this.accessoriesBillingData = this.accessoriesBillingData.slice(0, index + 1);
    //     }
    //     })
    //   } else {
    //     if (this.invoice.additionalTaxPoint) {
    //       this.accessoriesBillingData = [
    //         ...data,
    //         ...this.accessoriesBillingData
    //       ];
    //     } else {
    //       this.accessoriesBillingData = data;
    //     }
    //   }
    //   this.copyData = this.accessoriesBillingData;
    // });
    // 不含税表格数据
    bus.$on("noTaxSaleList", val => {
      this.accessoriesBillingData = [...val, ...this.accessoriesBillingData];
    });
    // 不含税信息
    bus.$on("noTaxInfo", val => {
      this.invoice.notTaxAmt = val.taxation;
      this.invoice.additionalTaxPoint = val.invoiceTaxAmt;
    });
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
        if (this.$parent.reconciliationStatement.isOilPart == 1){
          this.accessoriesBillingData1 = bbArr.concat(arrData1)
        } else {
          this.accessoriesBillingData2 = bbArr.concat(arrData1)
        }

      }
    },

    //本次开票含税金额确认
    confirmTheAmount(){
        if (this.invoice.applyTaxAmt > this.invoice.statementAmtOwed){
          this.$Modal.confirm({
            title: '提示',
            content: '<p>申请金额大于欠票金额，是否确认继续开票？</p>',
            onOk: () => {

            },
            onCancel: () => {
              this.invoice.applyTaxAmt = ''
            }
          });
        }
    },

    // 引用上次申请信息
    quote() {
      informationCitation({ guestId: this.information.guestId }).then(res => {
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
    // 对话框是否显示
    visChange(flag) {
      this.$refs.xTable1.recalculate(true)
      this.$refs.xTable2.recalculate(true)
      if (flag) {
        this.$refs.formCustom.resetFields();
        this.invoice.statementAmtOwed = this.information.statementAmtOwed
        this.invoice.applyTaxAmt = this.invoice.statementAmtOwed;
        this.invoice.notTaxAmt = 0
        this.invoice.applyAmt = this.invoice.applyTaxAmt + this.invoice.notTaxAmt
        // 发票单位
        ditInvoice({ guestId: this.information.guestId }).then(res => {
          if (res.code === 0) {
            res.data.map(item => {
              item.label = item.taxpayerName;
              item.value = item.id;
            });
            this.invoice.receiptUnitList = res.data;
          }
        });
        // approvalStatus({ instanceId: this.information.processInstance }).then(res => {
        //   if (res.code == 0) {
        //     bus.$emit('approval',res.data.operationRecords)
        //   }
        // });

        this.$nextTick(()=>{
          if(this.information.owned ==1) {
            getDraftList({accountNo: this.information.accountNo}).then(res => {
              if (res.code === 0) {
                Object.keys(this.invoice).forEach( key => {
                  if (res.data.hasOwnProperty(key)){
                    this.invoice[key] = res.data[key]
                  }
                })
                this.information.applyNo = res.data.applyNo;
                this.information.code = res.data.orgCode;
                this.information.oilsListOrder = res.data.oilsListOrder;
                this.information.partsListOrder = res.data.partsListOrder;

                this.accessoriesBillingData = res.data.partList
                this.information.id = res.data.id;
                this.setTableData();
              }
            })
          }else{
            // 开票配件
            partsInvoice({
              accountNo: this.information.accountNo,
              taxSign: 1
            }).then(res => {
              if (res.code === 0) {
                this.invoice.invoiceType = "010103";
                this.invoice.invoiceTax = "010103";
                this.accessoriesBillingData = res.data;
                this.copyData = res.data;

                this.setTableData();
              }
            });
          }
        })


      }
    },
    //填充表格数据
    setTableData(){
      if (this.$parent.reconciliationStatement.isOilPart == 1){
        this.accessoriesBillingData1 = this.accessoriesBillingData
      } else {
        this.accessoriesBillingData2 = this.accessoriesBillingData
      }
    },
    // 增加不含税销售开票申请
    async add() {
      const errMap1 = await this.$refs.xTable1.validate().catch(errMap => errMap)
      const errMap2 = await this.$refs.xTable2.validate().catch(errMap => errMap)
      if (errMap1){
        return this.$Message.error('增加不含税销售开票申请前请先保存草稿')
      }
      if (errMap2){
        return this.$Message.error('增加不含税销售开票申请前请先保存草稿')
      }

      this.$refs.formCustom.validate(vald => {
        if (vald) {
          let info = {
            orgCode: this.information.code,
            orgid: this.information.orgId,
            orgName: this.information.orgName,
            guestId: this.information.guestId,
            accountNo: this.information.accountNo,
            applyNo: this.information.applyNo,
            applyDate: this.information.applicationDate,
            guestName: this.information.guestName,
            oilsListOrder:this.information.oilsListOrder,
            partsListOrder:this.information.partsListOrder,
            isOilPart: this.$parent.data1[0].isOilPart,
            invoiceNotTaxApply:this.information.invoiceNotTaxApply
          };
          let obj = Object.assign(
            { partList: this.accessoriesBillingData },
            info,
            this.invoice
          );
          saveDraft(obj).then(res => {
            if (res.code === 0) {
              this.$message.success("保存成功");
              // 不含税申请单号
              this.information.id = res.data.id
              noTaxApplyNo({ orgid: this.information.orgId }).then(res => {
                if (res.code === 0) {
                  this.$refs.noTax.information.noTaxApply = res.data.applyNo;
                  this.$refs.noTax.information.code = res.data.orgCode;
                }
              });
              setTimeout(() => {
                this.$refs.noTax.modal1 = true;
              }, 100);

            }
          });
        }
      });



    },

    //增加不函数开票申请返回值
    getnoTaxSaleList(row){
      this.information.invoiceNotTaxApply = row.id
    },

    // 保存草稿
   async preservation() {
     if (!this.isCanRequest) return
     const errMap1 = await this.$refs.xTable1.validate().catch(errMap => errMap)
     const errMap2 = await this.$refs.xTable2.validate().catch(errMap => errMap)
     if (errMap1){
       return this.$Message.error('校验失败')
     }
     if (errMap2){
       return this.$Message.error('校验失败')
     }

      this.$refs.formCustom.validate(vald => {
        if (vald) {
          let info = {
            orgCode: this.information.code,
            orgid: this.information.orgId,
            orgName: this.information.orgName,
            guestId: this.information.guestId,
            accountNo: this.information.accountNo,
            applyNo: this.information.applyNo,
            applyDate: this.information.applicationDate,
            guestName: this.information.guestName,
            oilsListOrder:this.information.oilsListOrder,
            partsListOrder:this.information.partsListOrder,
            isOilPart: this.$parent.data1[0].isOilPart,
            invoiceNotTaxApply:this.information.invoiceNotTaxApply,
            id:this.information.id ? this.information.id : ""
          };
          let obj = Object.assign(
            { partList: this.accessoriesBillingData },
            info,
            this.invoice
          );

          this.isCanRequest = !this.isCanRequest
          // console.log(obj , 888)
          this.proserDis=true;
          saveDraft(obj).then(res => {
            this.isCanRequest = !this.isCanRequest
            if (res.code === 0) {
              this.$message.success("保存成功");
              this.proserDis=false;
              this.modal1 = false;
              this.$parent.query();
            }else{
              this.proserDis=false;
            }
          });
        }
      });
    },
    // 提交申请
   async submission() {
     if (!this.isCanRequest) return
     const errMap1 = await this.$refs.xTable1.validate().catch(errMap => errMap)
     const errMap2 = await this.$refs.xTable2.validate().catch(errMap => errMap)
          if (errMap1){
            return this.$Message.error('校验失败')
          }
          if (errMap2){
            return this.$Message.error('校验失败')
          }
      this.$refs.formCustom.validate(vald => {
        if (vald) {
          let info = {
            orgCode: this.information.code,
            orgid: this.information.orgId,
            orgName: this.information.orgName,
            guestId: this.information.guestId,
            accountNo: this.information.accountNo,
            applyNo: this.information.applyNo,
            applyDate: this.information.applicationDate,
            guestName: this.information.guestName,
            oilsListOrder:this.information.oilsListOrder,
            partsListOrder:this.information.partsListOrder,
            isOilPart: this.$parent.data1[0].isOilPart,
            invoiceNotTaxApply:this.information.invoiceNotTaxApply,
            id:this.information.id ? this.information.id : ""
          };
          let obj = Object.assign(
            { partList: this.accessoriesBillingData },
            info,
            this.invoice
          );
          this.isCanRequest = !this.isCanRequest
          // console.log(obj,111111)
          if(obj.additionalTaxPoint){
            delete obj.additionalTaxPoint
          }
          this.proserDis=true;
          submitDraft(obj).then(res => {
            this.isCanRequest = !this.isCanRequest
            if (res.code === 0) {
              this.$message.success("提交成功");
              this.modal1 = false;
              this.proserDis=false;
            }else{
              this.proserDis=false;
            }
          });
        }
      });
    },
    // 选择必开销售单
    seleteSale() {
      this.$refs.SeleteSale.modal1 = true;
    },
    // 开票配件合计
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '和值'
          }
          if (['applyAmt'].includes(column.property)) {
            let num = this.$utils.sum(data, column.property)
            this.$set(this.invoice , 'applyTaxAmt' , num)
            this.$set(this.invoice , 'applyAmt' , this.$utils.add(num, this.invoice.notTaxAmt))


          }
          if (['orderQty', 'taxPrice','taxAmt','applyAmt','additionalTaxPoint'].includes(column.property)) {
            return this.$utils.sum(data, column.property)
          }

          return null
        })
      ]
    }
  },
  computed: {
    invoiceTax() {
      return this.invoice.invoiceTax;
    },
    applyTaxAmt() {
      return this.invoice.applyTaxAmt;
    }
  },
  // watch: {
  //   // 开票税率
  //   invoiceTax(val) {
  //     this.invoice.rateBillingList.map(item => {
  //       if (val === item.value) {
  //         this.accessoriesBillingData.map(itm => {
  //           this.$set(itm, "invoiceTax", item.label);
  //         });
  //         this.$refs.noTax.tax = item.label;
  //       }
  //     });
  //   },
  //   applyTaxAmt(val, ov) {
  //     if (this.copyData.length !== 0 && val !== ov) {
  //       let sum = 0;
  //       let accData = JSON.parse(JSON.stringify(this.copyData));
  //       this.accessoriesBillingData = [];
  //       for (let i of accData) {
  //         sum += i.applyAmt * 1;
  //         if (sum <= val) {
  //           this.accessoriesBillingData.push(i);
  //         } else {
  //           i.applyAmt -= sum - val;
  //           return this.accessoriesBillingData.push(i);
  //         }
  //       }
  //     }
  //   },
  //   accessoriesBillingData:{
  //     handler(val){
  //       if (val.length < 1) return
  //       if (this.$parent.reconciliationStatement.isOilPart == 1){
  //         this.accessoriesBillingData1 = val
  //         this.OilPartShow = false
  //       } else {
  //         this.accessoriesBillingData2 = val
  //         this.OilPartShow = true
  //       }
  //       val.map(item => item.isOilPart =  this.$parent.data1[0].isOilPart)
  //     },
  //     deep:true
  //   }
  // }
};
</script>
