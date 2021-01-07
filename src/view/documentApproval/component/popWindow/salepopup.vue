<template>
  <Modal v-model="modal1" title="销售开票申请" width="1300" @on-visible-change="visChange">
    <div>
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
    <Button
      class="ivu-btn ivu-btn-default mr10"
      @click="preservation"
      :disabled="modelType.type==3"
    >保存草稿</Button>
    <Button
      class="ivu-btn ivu-btn-default mr10"
      @click="submission"
      :disabled="modelType.type==3"
    >提交申请</Button>
<!--    <button-->
<!--      class="ivu-btn ivu-btn-default mr10"-->
<!--      type="button"-->
<!--      @click="add"-->
<!--      :disabled="modelType.type==3"-->
<!--    >增加不含税销售开票申请</button>-->
    <h4 class="mt10 mb10">基本信息</h4>

    <Row style="border:1px solid #000c17;">
      <Col span="8" class="pt10 pb10 pl10" style="padding: 10px;box-sizing:border-box;border-right:1px solid #000c17">
        <span>分店名称：{{information.orgName}}</span>
      </Col>
      <Col span="8" class="pt10 pb10 pl10" style="padding: 10px;border-right:1px solid #000c17">
        <span>分店店号：{{information.code}}</span>
      </Col>
      <Col span="8" class="pt10 pb10 pl10" style="padding: 10px;">
        <Poptip placement="top" trigger="hover" :content="information.guestName" max-width="160">
          <div style="width: 300px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">往来单位：{{information.guestName}}</div>
        </Poptip>
      </Col>
    </Row>
    <Row style="border:1px solid #000c17;border-top: none;">
      <Col span="8" class="pt10 pb10 pl10" style="padding: 10px;border-right:1px solid #000c17">
        <span>开票申请单号：{{information.applyNo}}</span>
      </Col>
      <Col span="8" class="pt10 pb10 pl10" style="padding: 10px;border-right:1px solid #000c17">
        <span>申请时间：{{information.applicationDate}}</span>
      </Col>
      <Col span="8" class="pt10 pb10 pl10" style="padding: 10px;">
        <Poptip placement="top" trigger="hover" :content="information.accountNo" max-width="160">
          <div  style="width: 300px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">对账单号：{{information.accountNo}}</div>
        </Poptip>
      </Col>
    </Row>
    <h4 class="mt10 mb10">发票数据</h4>
    <Form ref="formCustom" :model="invoice" :rules="invoiceRule" :label-width="160">
      <div style="display: flex">
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="发票单位" prop="receiptUnit">
            <Select
              v-model="invoice.receiptUnit"
              class="ml5 w200"
              @on-change="invoiceChange"
              :disabled="modelType.type==3"
            >
              <Option
                v-for="item in receiptUnitList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="税号" prop="taxNo">
            <Input v-model="invoice.taxNo" class="ml5 w200" :disabled="modelType.type==3" />
          </FormItem>
          <FormItem label="地址电话" prop="tel">
            <Input v-model="invoice.tel" class="ml5 w200" :disabled="modelType.type==3" />
          </FormItem>
          <FormItem label="开户行及账号" prop="bankName">
            <Input v-model="invoice.bankName" class="ml5 w200" :disabled="modelType.type==3" />
          </FormItem>
          <FormItem label="开票单位" prop="issuingOfficeId">
            <Select v-model.trim="invoice.issuingOfficeId" class="ml5 w200" @on-change="invoUnitChange" :disabled="modelType.type==3"  >
              <Option
                v-for="item in issuingOfficeList"
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
            <Select
              v-model="invoice.collectionType"
              class="ml5 w200"
              :disabled="modelType.type==3"
            >
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
            <Input v-model="invoice.consignee" class="ml5 w200" :disabled="modelType.type==3" />
          </FormItem>
          <FormItem label="收件地址" prop="address">
            <Input v-model="invoice.address" class="ml5 w200" :disabled="modelType.type==3" />
          </FormItem>
          <FormItem label="电话" prop="phone">
            <Input v-model="invoice.phone" class="ml5 w200" :disabled="modelType.type==3" />
          </FormItem>
          <FormItem label="寄件方式" prop="sendingWay">
            <Select v-model="invoice.sendingWay" class="ml5 w200" :disabled="modelType.type==3">
              <Option
                v-for="item in invoice.waySendingList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="费用承担" prop="costBear">
            <Select v-model="invoice.costBear" class="ml5 w200" :disabled="modelType.type==3">
              <Option
                v-for="item in bearingCostList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="备注">
            <Input v-model="invoice.remark" class="ml5 w200" :disabled="modelType.type==3" />
          </FormItem>
          <FormItem>
            <span style="color:#0099FF;cursor:pointer;" @click="quote">引用上次申请信息</span>
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%">
          <FormItem label="对账单欠票金额" prop="statementAmountOwed">
            <Input v-model="invoice.statementAmountOwed" class="ml5 w200" disabled />
          </FormItem>
          <FormItem label="本次申请开票含税金额" prop="applyTaxAmt">
            <Input v-model="invoice.applyTaxAmt" class="ml5 w200" :disabled="modelType.type==3" />
          </FormItem>
          <FormItem label="申请开票金额" prop="applyMoney">
            <Input v-model="invoice.applyMoney" class="ml5 w200" disabled />
          </FormItem>
          <FormItem label="开票说明" >
            <Input v-model.trim="invoice.underTicketExplain" class="ml5 w200" :disabled="modelType.type==3" />
          </FormItem>
        </div>
      </div>
    </Form>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="seleteSale"
      v-has="'examine'"
      :disabled="modelType.type==3"
    >选择必开销售单</button>

    <Tabs type="card" value="invoice1" class="mt10">
      <TabPane label="配件清单" name="invoice1">
        <Table
          border
          :columns="accessoriesBilling"
          :data="accessoriesBillingData"
          show-summary
          :summary-method="billSum"
        ></Table>
      </TabPane>
      <TabPane label="油品清单" name="invoice2">
        <Table
          border
          :columns="accessoriesBilling1"
          :data="accessoriesBillingData2"
          show-summary
          :summary-method="billSum"
        ></Table>
      </TabPane>
    </Tabs>
    <!--<flow v-if="modelType.type===3" />-->
    <SeleteSale ref="SeleteSale" :popupTit="popupTit" :parameter="parameter" />
    <noTax ref="noTax" :information="information" :parameter="parameter" />
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import SeleteSale from "@/view/settlementManagement/bill/Popup/seleteSale";
import noTax from "@/view/settlementManagement/bill/Popup/noTax";
import bus from "@/view/settlementManagement/bill/Popup/Bus";
import { getDataDictionaryTable } from "@/api/system/dataDictionary/dataDictionaryApi";
import flow from "../Flow.vue";
import { approvalStatus } from "_api/base/user";
import { getThisAllList } from '@/api/documentApproval/documentApproval/documentApproval'
import moment from 'moment'
import {
  noTaxApplyNo,
  ditInvoices,
  informationCitation,
  partsInvoice,
  saveDraft,
  submitDraft,
  findCurrentIssuing
} from "@/api/bill/popup";
import {showLoading,hideLoading} from "../../../../utils/loading";

export default {
  props: ["modelType"],
  components: {
    SeleteSale,
    noTax,
    flow
  },
  data() {
    const validateTax = (rule, value, callback) => {
      if (value) {
        if (parseFloat(value) > parseFloat(this.invoice.statementAmountOwed)) {
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
        parseFloat(this.invoice.applyTaxAmt) !==
        parseFloat(this.invoice.statementAmountOwed)
      ) {
        callback(new Error("欠票金额不等于本次申请开票含税金额"));
      } else {
        callback();
      }
    };
    return {
      formInline: {
        applicant: "",
        deptName: "",
        shopCode: "",
        orgName: "",
        applyTypeName: "",
        applyTime: "",
        paymentOrgName: ""
      }, //所有数据对象
      parameter: {}, //销售单参数
      information: {}, //基本信息数据
      approvalTit: "开票申请流程", //审批流程
      popupTit: "选择必开销售单", //选择必开销售单弹框标题
      modal1: false, // 弹框开关
      bearingCostList: [
        {
          value: "0",
          label: "现付"
        },
        {
          value: "1",
          label: "到付"
        },
        {
          value: "2",
          label: "自取"
        }
      ], //费用承担列表
      issuingOfficeList:[],//开票单位列表
      receiptUnitList: [], //发票单位列表
      invoice: {
        consignee: "", //快递收件人
        receiptUnit: "", // 发票单位
        taxNo: "", //税号
        tel: "", //地址电话
        bankName: "", //开户行及账号
        issuingOfficeId: "", //开票单位
        invoiceType: "", //开票类型
        typeBillingList: [], //开票类型列表
        invoiceTax: "", //开票税率
        rateBillingList: [], //开票税率列表
        collectionType: "", //收款方式
        paymentMethodList: [], //收款方式列表
        costBear: "", //费用承担
        // bearingCostList: [
        //   {
        //     value: 0,
        //     label: "现付"
        //   },
        //   {
        //     value: 1,
        //     label: "到付"
        //   },
        //   {
        //     value: 2,
        //     label: "自取"
        //   }
        // ], //费用承担列表
        statementAmountOwed: "", //对账单欠票金额
        applyMoney: "", //申请开票金额
        address: "", //收件地址
        remark: "", //备注
        applyTaxAmt: "", //本次申请开票含税金额
        phone: "", //电话
        amountExcludingTax: "", //不含税金额
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
        invoiceType: [
          {
            required: true,
            message: "开票类型不能为空",
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
        statementAmountOwed: [
          {
            required: true,
            message: "对账单欠票金额不能为空"
          }
        ],
        // applyMoney: [
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
            message: "",
            validator: validateTax
          }
        ],
        phone: [
          {
            required: true,
            message: "电话不能为空"
          }
        ],
        sendingWay: [
          {
            required: true,
            message: "寄件方式不能为空",
            trigger: "blur"
          }
        ]
      }, //发票数据表单验证规则
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
          key: "qty",
          className: "tc"
        },
        {
          title: "商品含税单价",
          key: "taxPrice",
          className: "tc",
        },
        {
          title: "商品含税金额",
          key: "taxAmt",
          className: "tc",
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
          className: "tc",
        },
        {
          title: "销售金额",
          key: "saleAmt",
          className: "tc",
        },
        {
          title: "已开票金额",
          key: "invoiceAmt",
          className: "tc",
        },
        {
          title: "未开票金额",
          key: "invoiceNotAmt",
          className: "tc",
        },
        {
          title: "申请开票金额",
          key: "applyAmt",
          className: "tc",
        },
        {
          title: "外加税点",
          key: "additionalTaxPoint",
          className: "tc"
        }
      ], //开票配件
      accessoriesBilling1: [
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
          key: "qty",
          className: "tc"
        },
        {
          title: "油品包装规格",
          key: "oilsSpec",
          className: "tc"
        },
        {
          title: "油品换算单位",
          key: "oilsUnit",
          className: "tc"
        },
        {
          title: "油品换算数量",
          key: "oilsQty",
          className: "tc"
        },

        {
          title: "商品含税单价",
          key: "taxPrice",
          className: "tc",
          // render: (h, params) => {
          //   return h("span", params.row.taxPrice.toFixed(2));
          // }
        },
        {
          title: "商品含税金额",
          key: "taxAmt",
          className: "tc",
          // render: (h, params) => {
          //   return h("span", params.row.taxAmt.toFixed(2));
          // }
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
          className: "tc",
          // render: (h, params) => {
          //   return h("span", params.row.salePrice.toFixed(2));
          // }
        },
        {
          title: "销售金额",
          key: "saleAmt",
          className: "tc",
          // render: (h, params) => {
          //   return h("span", params.row.saleAmt.toFixed(2));
          // }
        },
        {
          title: "已开票金额",
          key: "invoiceAmt",
          className: "tc",
          // render: (h, params) => {
          //   return h("span", params.row.invoiceAmt.toFixed(2));
          // }
        },
        {
          title: "未开票金额",
          key: "invoiceNotAmt",
          className: "tc",
          // render: (h, params) => {
          //   return h("span", params.row.invoiceNotAmt.toFixed(2));
          // }
        },
        {
          title: "申请开票金额",
          key: "applyAmt",
          className: "tc",
          // render: (h, params) => {
          //   return h("span", params.row.applyAmt.toFixed(2));
          // }
        },
        {
          title: "外加税点",
          key: "additionalTaxPoint",
          className: "tc"
        }
      ], //开票配件
      accessoriesBillingData: [], //开票配件数据
      accessoriesBillingData2:[],//开票油品数据
      copyData: [], //开票配件复制数据
      row: {},//申请单页面的信息

    };
  },
  mounted() {
    this.getListOne();
    // 选择销售单
    bus.$on("partsData", val => {
      let data = [];
      val.map(item => {
        item.details.map(itm => {
          // itm.taxRate = this.$refs.noTax.tax;
          data.push(itm);
        });
      });
      let sum = 0;
      data.map((itm, index) => {
        itm.taxAmt = parseFloat(
          (itm.applyAmt * 1 + itm.additionalTaxPoint * 1).toFixed(2)
        );
        itm.taxPrice = parseFloat((itm.taxAmt / itm.orderQty).toFixed(2));
        sum += itm.applyAmt * 1;
        if (sum > this.invoice.applyTaxAmt) {
          itm.applyAmt -= sum - this.invoice.applyTaxAmt;
          data = data.slice(0, index + 1);
        }
      });
      if (sum < this.invoice.applyTaxAmt) {
        this.accessoriesBillingData = [...data, ...this.accessoriesBillingData];
        let s = 0;
        this.accessoriesBillingData.map((item, index) => {
          s += item.applyAmt * 1;
          if (s > this.invoice.applyTaxAmt) {
            item.applyAmt -= s - this.invoice.applyTaxAmt;
            this.accessoriesBillingData = this.accessoriesBillingData.slice(
              0,
              index + 1
            );
          }
        });
      } else {
        if (this.invoice.additionalTaxPoint) {
          this.accessoriesBillingData = [
            ...data,
            ...this.accessoriesBillingData
          ];
        } else {
          this.accessoriesBillingData = data;
        }
      }
      this.copyData = this.accessoriesBillingData;
    });
    // 不含税表格数据
    bus.$on("noTaxSaleList", val => {
      this.accessoriesBillingData = [...val, ...this.accessoriesBillingData];
    });
    // 不含税信息
    bus.$on("noTaxInfo", val => {
      this.invoice.amountExcludingTax = val.taxation;
      this.invoice.additionalTaxPoint = val.taxRateAmt;
    });
  },
  methods: {
    invoUnitChange(option){
      this.issuingOfficeList.map(el=>{
        if(el.id==option.value){
          this.invoice.invoiceTax=el.taxRateName;
          this.invoice.invoiceType=el.invoiceTypeName;
        }
      })
    },
    open(row){
      this.modal1 = true
      this.row = Object.assign({},row)
    },
    // 引用上次申请信息
    quote() {
      informationCitation({ guestId: this.information.guestId }).then(res => {
        if (res.code === 0) {
          this.invoice.consignee = res.data.consignee;
          this.invoice.address = res.data.address;
          this.invoice.phone = res.data.phone;
        }
      });
    },
    // 发票单位带出税号等信息
    invoiceChange(val) {
      this.receiptUnitList.map(item => {
        if (item.value === val) {
          this.invoice.taxNo = item.taxpayerCode;
          this.invoice.tel = item.taxpayerTel;
          this.invoice.bankName = item.accountBankNo;
        }
      });
    },
    //获取接口
    async getListOne(){
      // 税率和开票类型数据字典
      // await getDataDictionaryTable({ dictCode: "CS00107" }).then(res => {
      //   res.data.map(item => {
      //     this.invoice.typeBillingList.push({
      //       value: item.itemCode,
      //       label: item.itemName
      //     });
      //     this.invoice.rateBillingList.push({
      //       value: item.itemCode,
      //       label: (item.itemValueOne * 100).toFixed(0) + "%"
      //     });
      //   });
      // });
      // 收款方式数据字典
      await getDataDictionaryTable({ dictCode: "RECEIVABLE_TYPE" }).then(res => {
        res.data.map(item => {
          this.invoice.paymentMethodList.push({
            value: item.itemCode,
            label: item.itemName
          });
        });
      });
      // 寄件方式数据字典
      await getDataDictionaryTable({ dictCode: "MAIL_TYPE" }).then(res => {
        res.data.map(item => {
          item.value = item.itemCode,
            item.label= item.itemName
        });
        this.$set(this.invoice , 'waySendingList' , res.data)
      });
      // 开票单位
      findCurrentIssuing().then(res => {
        res.data.map(item => {
          this.issuingOfficeList.push({
            value: item.id,
            label: item.name,
            taxRateName:item.taxRateName,
            invoiceTypeName:item.invoiceTypeName
          });
        });
      });
    },

    // 对话框是否显示
    async visChange(flag) {
      if (flag) {
          this.$refs.formCustom.resetFields();
          this.invoice.statementAmountOwed =
            this.information.taxArrearsOfPart + this.information.taxArrearsOfOil;
          this.invoice.applyTaxAmt = this.invoice.statementAmountOwed;
          this.invoice.applyAmt =
            this.invoice.applyTaxAmt + this.invoice.amountExcludingTax;
          // 开票配件
          partsInvoice({
            accountNo: this.information.accountNo,
            taxSign: 1
          }).then(res => {
            if (res.code === 0) {
              res.data.map(item => {
                item.taxAmt = item.applyAmt + item.additionalTaxPoint;
                item.taxPrice = item.taxAmt / item.orderQty;
              });
              this.invoice.invoiceType = "";
              this.invoice.taxRate = "" ;
              this.accessoriesBillingData = res.data;
              this.copyData = res.data;
            }
          });
          if(this.modelType.type == 1){
            let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
              user = this.$store.state.user.userData;
            this.formInline.applicant = user.staffName;
            this.formInline.deptName =
              user.groups[user.groups.length - 1].name || " 　　";
            this.formInline.shopCode = user.shopCode || " 　　";
            this.formInline.orgName = user.shopName;
            this.formInline.applyTypeName = "销售开票申请";
            this.formInline.applyTime = date;
            this.formInline.paymentOrgName = user.shopName;
          }else{
            this.formInline = this.row
          }
          if(this.modelType.id) {
            let data = {}
            data.id = this.modelType.id || ''
            let res = await getThisAllList(data)
            if (res.code == 0) {
              this.invoice.receiptUnit = Number(res.data.receiptUnit);
              this.formInline.applyNo = res.data.accountNo;
              this.information.code = res.data.orgCode;
              this.information.orgId = res.data.orgid;
              this.information.orgName = res.data.orgName;
              this.information.guestId = res.data.guestId;
              this.information.accountNo = res.data.accountNo;
              this.information.applyNo = res.data.applyNo;
              this.information.applicationDate = res.data.applyDate;
              this.information.guestName = res.data.guestName;
              this.information.guestIds = res.data.guestIds;
              // 发票单位
              let guestIdsOne=this.information.guestIds.replace('[',"").replace("]","").split(",")
              ditInvoices(guestIdsOne).then(res2 => {
                if (res2.code === 0) {
                  res2.data.map(item => {
                    item.label = item.taxpayerName;
                    item.value = item.id;
                  });
                  this.receiptUnitList = res2.data;
                }
              });
              const rate = res.data.invoiceType
              this.invoice = res.data;
              this.accessoriesBillingData =[];
              this.accessoriesBillingData2 =[];
              this.invoice.statementAmountOwed = res.data.statementAmtOwed;
              this.invoice.amountExcludingTax = res.data.notTaxAmt;
              this.invoice.applyMoney = res.data.applyAmt;
              this.invoice.typeBillingList = [];
              this.invoice.rateBillingList = [];
              this.invoice.paymentMethodList = [];
              this.invoice.waySendingList = [];
              await this.getListOne();
              if(res.data.isOilPart==1){
                this.accessoriesBillingData =[];
                this.accessoriesBillingData2 =res.data.partList
              }else{
                this.accessoriesBillingData = res.data.partList;
                this.accessoriesBillingData2 =[]
              }
              this.invoice.invoiceType = rate
              this.invoice.taxRate = rate
          }
        };
        // 发票单位
      }
    },
    // 增加不含税销售开票申请
    add() {
      // 不含税申请单号
      noTaxApplyNo({ orgid: this.information.orgId }).then(res => {
        if (res.code === 0) {
          this.$refs.noTax.information.noTaxApply = res.data.applyNo;
          this.$refs.noTax.information.code = res.data.orgCode;
        }
      });
      setTimeout(() => {
        this.$refs.noTax.modal1 = true;
      }, 500);
    },
    // 保存草稿
    preservation() {
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
            guestName: this.information.guestName
          };
          let obj = Object.assign(
            { partList: this.accessoriesBillingData },
            info,
            this.invoice
          );
          obj.guestIds= this.information.guestIds.replace('[',"").replace("]","").split(",")
            showLoading()
          saveDraft(obj).then(res => {
            if (res.code === 0) {
              this.$message.success("保存成功");
              this.modal1 = false;
              hideLoading()
            }else{
              hideLoading()
            }
          });
        }
      });
    },
    // 提交申请
    submission() {
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
            guestName: this.information.guestName
            // orgCode:this.information
          };
          let obj = Object.assign(
            { partList: this.accessoriesBillingData },
            info,
            this.invoice
          );
          obj.guestIds= this.information.guestIds.replace('[',"").replace("]","").split(",")
          showLoading()
          submitDraft(obj).then(res => {
            if (res.code === 0) {
              this.$message.success("提交成功");
              hideLoading()
            }else{
              hideLoading()
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
        if ((index > 3 && index < 7) || index > 12) {
          if (!values.every(value => isNaN(value))) {
            const v = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            if (index !== 4 && index !== 14) {
              sums[key] = {
                key,
                value: v.toFixed(2)
              };
            } else {
              sums[key] = {
                key,
                value: v
              };
            }
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
  },
  computed: {
    applyTaxAmt() {
      return this.invoice.applyTaxAmt;
    }
  },
  watch: {
    // 开票税率
    taxRate(val) {
      this.invoice.rateBillingList.map(item => {
        if (val === item.value) {
          this.accessoriesBillingData.map(itm => {
            this.$set(itm, "taxRate", item.label);
          });
          this.$refs.noTax.tax = item.label;
        }
      });
    },
    applyTaxAmt(val, ov) {
      if (this.copyData.length !== 0 && val !== ov) {
        let sum = 0;
        let accData = JSON.parse(JSON.stringify(this.copyData));
        this.accessoriesBillingData = [];
        for (let i of accData) {
          sum += i.applyAmt * 1;
          if (sum <= val) {
            this.accessoriesBillingData.push(i);
          } else {
            i.applyAmt -= sum - val;
            return this.accessoriesBillingData.push(i);
          }
        }
      }
    }
  }
};
</script>
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
