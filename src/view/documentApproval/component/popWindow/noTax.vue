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
      v-has="'examine'"
      @click="submission"
      :disabled="modelType.type!==1"
    >提交申请</button>
    <h4 class="mt10 mb10">基本信息</h4>
    <Row style="border:1px solid #000c17;">
      <Col span="8" class="pt10 pb10 pl10" style="padding: 10px;box-sizing:border-box;border-right:1px solid #000c17">
        <span>分店名称：{{information.orgName}}</span>
      </Col>
      <Col span="8" class="pt10 pb10 pl10" style="padding: 10px;border-right:1px solid #000c17">
        <span>分店店号：{{information.code}}</span>
      </Col>
      <Col span="8" class="pt10 pb10 pl10" style="padding: 10px;">
        <Poptip placement="top" trigger="hover" :content="information.guestName" max-width="140">
          <div style="width: 300px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">往来单位：{{information.guestName}}</div>
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
        <Poptip placement="top" trigger="hover" :content="information.accountNo" max-width="140">
          <div style="width: 300px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">对账单号：{{information.accountNo}}</div>
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
                v-for="item in paymentMethodList"
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
                v-for="item in waySendingList"
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
          <FormItem label="不含税对账单未开金额">
            <Input v-model="information.notAmt" class="ml5 w200" disabled/>
          </FormItem>
          <FormItem label="产生税费">
            <Input :value="getTaxesAndDues" class="ml5 w200" disabled/>
          </FormItem>
          <FormItem label="本次不含税开票金额" prop="invoiceTaxAmt">
            <InputNumber :max="1000000000" :min="0" v-model="invoice.invoiceTaxAmt" class="w200" style="margin-left:5px;" :disabled="modelType.type!==1" />
          </FormItem>
          <FormItem label="本次实际申请开票金额">
            <Input :value="showPay" class="ml5 w200" disabled/>
          </FormItem>
          <FormItem label="申请税点">
            <InputNumber
              :min="0"
              :max="100"
              v-model="invoice.taxPoint"
              style="margin-left:5px;"
              class="w200"
              :formatter="value => `${value}%`"
              :parser="value => value.replace('%', '')"
            />
          </FormItem>
          <FormItem label="申请说明">
            <Input v-model="invoice.underTicketExplain" class="ml5 w200" :disabled="modelType.type!==1" />
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
import { noTaxApplyNo, partsInvoice, submitNoTax,ditInvoices,findCurrentIssuing,informationNoCitation } from "@/api/bill/popup";
import { getDataDictionaryTable } from "@/api/system/dataDictionary/dataDictionaryApi";
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
          key: "qty",
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
          key: "taxRate",
          className: "tc"
        },
        // {
        //   title: "出库单号",
        //   key: "outNo",
        //   className: "tc",
        //   tooltip: true
        // },
        {
          title: '出库单号',
          align: 'center',
          tooltip: true,
          ellipsis: true,
          key: 'outNo',
          render: (h, params) => {
            return h('Tooltip', {
              props: {
                placement: "top",
              }
            }, [
              h("div", {
                style: {
                  display: 'inline-block',
                  width: params.column._width * 0.8 + 'px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
              }, params.row.outNo),
              h("div", {
                slot: "content"
              }, params.row.outNo)
            ])
          }
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
          title: "本次不含税开票金额",
          key: "applyNoTaxAmt",
          className: "tc",
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
      paymentMethodList:[],
      waySendingList:[],
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
        costBear: "", //费用承担
        address: "", //收件地址
        remark: "", //备注
        phone: "", //电话
        amountExcludingTax: "", //不含税金额
        sendingWay: "", //寄件方式
        additionalTaxPoint: "", //外加税点
        taxPoint: 0, //申请税点
        accountNo: "", //对账单号
        taxation: "", //产生税费
        notAmt: "", //不含税对账单未开金额
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
            // message: "本次含税开票金额不能为空",
            validator: thisTaxChange
          }
        ]
      }, //发票数据表单验证规则
      copyData: [], //深拷贝处理
      row: {},//申请单选中的数据
      // num: 0 //表格数量合计
    };
  },
  async mounted() {
    // 收款方式数据字典
    getDataDictionaryTable({ dictCode: "RECEIVABLE_TYPE" }).then(res => {
      res.data.map(item => {
        this.paymentMethodList.push({
          value: item.itemCode,
          label: item.itemName
        });
      });
    });
    // 寄件方式数据字典
    getDataDictionaryTable({ dictCode: "MAIL_TYPE" }).then(res => {
      res.data.map(item => {
        this.waySendingList.push({
          value: item.itemCode,
          label: item.itemName
        });
      });
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
    open(row){
      this.modal1 = true
      this.row = Object.assign({}, row);//对象浅拷贝row
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
    invoUnitChange(option){
      this.issuingOfficeList.map(el=>{
        if(el.id==option.value){
          this.invoice.invoiceTax=el.taxRateName;
          this.invoice.invoiceType=el.invoiceTypeName;
        }
      })
    },
    // 引用上次申请信息
    quote() {
      informationNoCitation({ guestId: this.information.guestId }).then(res => {
        if (res.code === 0) {
          this.invoice.consignee = res.data.consignee;
          this.invoice.address = res.data.address;
          this.invoice.phone = res.data.phone;
        }
      });
    },
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
        if (this.modelType.type === 1) {
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
        }else{
          this.formInline = this.row
        }
        if (this.modelType.id) {
          let data = {}
          data.id = this.modelType.id || ''
          let res = await getThisAllList(data)
          if (res.code == 0) {
            // console.log(res.data)
            // this.information = res.data;
            this.formInline.applyNo = res.data.accountNo;
            this.information.code = res.data.orgCode;
            this.information.orgId = res.data.orgid;
            this.information.orgName = res.data.orgName;
            this.information.guestId = res.data.guestId;
            this.information.guestIds = res.data.guestIds;
            this.information.noTaxApply = res.data.applyNo;
            this.information.guestName = res.data.guestName;
            this.information.accountNo = res.data.accountNo;
            this.information.applicationDate = res.data.applyDate;
            this.information.notAmt = res.data.notAmt;
            this.invoice = res.data;
            this.invoice.taxPoint=Number(this.invoice.taxPoint)
            this.invoice.invoiceTaxAmt=Number(this.invoice.invoiceTaxAmt)

            this.invoice.taxApplicationList = [{value: "0.06", label: "6%"}, {value: "0.07", label: "7%"}];
            this.accessoriesBillingData = res.data.partList;
            // this.remarks = res.data.applyReason
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
    },
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
  //     }
  //   },
  //   // 申请税点
  //   taxPoint(val, ov) {
  //     if (val !== ov) {
  //       // console.log(val);
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
  //       //   item.taxAmt = item.applyAmt + item.additionalTaxPoint;
  //       //   item.taxPrice = item.taxAmt / item.orderQty;
  //       // });
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
/deep/.ivu-tooltip-inner>div{
  width: 100%;
  white-space:normal;
  word-wrap:break-word;
  color: white;
}
</style>
