import moment from "moment";
import requestCode from "../popWindow/RequestCode";
import subject from "../popWindow/Subject";
import selectTheDocuments from "../popWindow/SelectTheDocuments";
import upphoto from "../Upphoto";
import flowbox from "../Flow";
import {
  getDictionary,
  getExpSve
} from "_api/documentApproval/ExpenseReimbursement";
import { getThisAllList } from "@/api/documentApproval/documentApproval/documentApproval";
import { getDigitalDictionary } from "../../../../api/system/essentialData/clientManagement";
import { getPost } from "../utils";

export default {
  name: "ExpenseReimbursement",
  components: {
    requestCode,
    subject,
    selectTheDocuments,
    upphoto,
    flowbox
  },
  // inject:['modelType'],
  props: {
    list: ""
  },
  data() {
    const roleValid = ({ cellValue, row }) => {
      if (cellValue && +row.applyAmt < +cellValue) {
        return Promise.reject(new Error("核销金额不能大于借支金额"));
      }
    };
    const notaxValid = rows => {
      if (
        rows.cellValue &&
        rows.row.totalAmt &&
        rows.row.taxAmt &&
        rows.cellValue !=
          this.$utils.subtract(rows.row.totalAmt, rows.row.taxAmt)
      ) {
        return Promise.reject(new Error("不含税金额计算错误"));
      }
    };
    const taxRateCodeValid = ({ cellValue, row }) => {
      if (row.billTypeId && row.billTypeId != "010102") {
        if (cellValue == "TR001") {
          return Promise.reject(new Error("费率必填"));
        }
      }
    };
    return {
      loading1: false,
      model: false, //模态框开关
      modelType: false, //模态框打开模式 0-新增false 1-编辑false 2-查看true 3-审核true
      formInline: {}, //所有数据对象
      //表单校验
      ruleValidate: {
        topic: [{ required: true, message: "主题为必填", trigger: "blur" }],
        receiverId: [
          { required: true, message: "收款人账户为必填", trigger: "change" }
        ],
        receiveBank: [
          { required: true, message: "开户行名称必填", trigger: "blur" }
        ],
        paymentAccount: [
          {
            required: true,
            type: "string",
            message: "付款账户必选",
            trigger: "change"
          }
        ],
        receiveBankNo: [
          { required: true, message: "银行账号必填", trigger: "blur" }
        ]
      },

      //费用类型列表
      moneyTypeList: [],
      subjectType: {}, //当前费用类型
      details: [],
      taxRate: [], //税率
      //费用支出表格的数据校验
      validRules: {
        summary: [{ required: true, message: "必填" }],
        taxRateCode: [{ validator: taxRateCodeValid }],
        accountEntry: [{ required: true, message: "必填" }],
        totalAmt: [
          { required: true, message: "必填" },
          {
            pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
            message: "最多保留2为小数"
          }
        ],
        taxAmt: [
          { required: true, message: "必填" },
          {
            pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
            message: "最多保留2为小数"
          }
        ],
        noTaxAmt: [
          { required: true, message: "必填" },
          {
            pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
            message: "最多保留2为小数"
          },
          { validator: notaxValid }
        ],
        writeOffAmt: [
          { required: true, message: "必填" },
          {
            pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
            message: "最多保留2为小数"
          },
          { validator: roleValid }
        ]
      },
      documentTableData: [], //借支核销表格数据
      moneyTableData: [], //费用明细表格数据
      payeeList: [], //收款人列表
      options1: [],
      payUserList: [], //付款人列表
      Pictures: {}, //请求回来的图片地址状态
      //票据类型
      invoiceMap: []
    };
  },
  mounted() {},
  computed: {
    aggregateCosts: function() {
      if (
        this.formInline.expenseDetails &&
        this.formInline.expenseDetails.length > 0
      ) {
        return this.$utils.sum(this.formInline.expenseDetails, "totalAmt");
      }
      return 0;
    },
    businessMoney: function() {
      if (this.details && this.details.length > 0) {
        return this.$utils.sum(this.details, "applyAmt");
      }
      return 0;
    },
    company: function() {
      let agg = this.aggregateCosts,
        bus = this.businessMoney,
        sum = this.$utils.subtract(agg, bus);
      if (sum < 0) {
        return 0;
      } else {
        return sum;
      }
    },
    personage: function() {
      let agg = this.aggregateCosts,
        bus = this.businessMoney,
        sum = this.$utils.subtract(agg, bus);
      if (sum > 0) {
        return 0;
      } else {
        return this.$utils.subtract(bus, agg);
      }
    }
  },
  methods: {
    //模态框打开111
    async open() {
      this.payeeList = this.list.allSalesList;
      this.options1 = [];
      if(this.$route.name === "documentApproval-myApplication") {
        this.options1 = this.list.allSalesList;
      }
      this.payUserList = this.list.payList;
      this.modelType = false;
      this.getRate();
      this.$refs["formInline"].resetFields();
      this.formInline = {};
      this.$refs.upImg.uploadListModal = [];
      this.$refs.upImg.uploadList = [];
      this.model = true;
      if (this.list.type == 1) {
        this.details = [];
        let arr = [
          { expenseType: "FY001", totalAmt: 0, taxRateCode: "TR001", taxAmt: 0 }
        ];
        this.$set(this.formInline, "expenseDetails", arr);

        //判断模态框状态
        this.modelType = false;
        let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          user = this.$store.state.user.userData;
        this.formInline.applicant = user.staffName;
        this.formInline.deptName =
          user.groups.length > 0
            ? user.groups[user.groups.length - 1].name
            : "";
        this.formInline.shopCode = user.shopCode || " 　　";
        this.formInline.orgName = getPost();
        this.formInline.applyTypeName = "费用报销";
        this.formInline.applyTime = date;
        this.formInline.paymentOrgName = getPost();
      }
      if (this.list.type == 2) {
        this.getList();
      }
      if (this.list.type == 3 || this.list.type == 4) {
        this.getList();
        this.modelType = true;
      }
    },

    remoteMethod1(query) {
      this.options1 = [];
      if (query !== "") {
        this.loading1 = true;
        this.options1 = [];
        const list = this.payeeList.map(item => {
          return {
            value: item.value,
            label: item.label
          };
        });
        this.options1 = list.filter(
          item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
        );
        this.loading1 = false;
      } else {
        this.options1 = [];
      }
    },

    //获取当前信息
    async getList() {
      let data = {};
      data.id = this.list.id || "";
      let res = await getThisAllList(data);
      if (res.code === 0) {
        this.$nextTick(() => {
          this.formInline = res.data;
          this.details = res.data.details || [];
          this.Pictures = {
            voucherPictures: res.data.voucherPictures || [],
            billStatus: res.data.billStatus
          };
        });
      }
    },

    //获取费用类型
    async getRate() {
      let data = {};
      //107票据类型
      data = ["CS00107", "FYLX", "TaxRate"];
      let res = await getDigitalDictionary(data);
      if (res.code == 0) {
        //费用类型
        this.moneyTypeList = res.data["FYLX"] || [];
        //税率
        this.taxRate = res.data["TaxRate"] || [];
        //票据类型
        this.invoiceMap = res.data["CS00107"] || [];
      }
    },

    //获取往来单位
    getCompany(row) {
      let arr = this.payeeList.filter(item => item.value == row.value);
      this.formInline.receiveBank = arr[0].receiveBank || "";
      this.formInline.receiveBankNo = arr[0].receiveBankNo || "";
    },

    //判断表格是否可以编辑
    editActivedEvent({ row }) {
      let xTable = this.$refs.xTable;
      let isDisable = this.modelType;
      let summary = xTable.getColumnByField("summary");
      let expenseType = xTable.getColumnByField("expenseType");
      let accountEntry = xTable.getColumnByField("accountEntry");
      let taxRateCode = xTable.getColumnByField("taxRateCode");
      let taxAmt = xTable.getColumnByField("taxAmt");
      let noTaxAmt = xTable.getColumnByField("noTaxAmt");
      let remark = xTable.getColumnByField("remark");
      let totalAmt = xTable.getColumnByField("totalAmt");
      summary.editRender.attrs.disabled = isDisable;
      expenseType.editRender.attrs.disabled = isDisable;
      accountEntry.editRender.attrs.disabled = isDisable;
      taxRateCode.editRender.attrs.disabled = isDisable;
      taxAmt.editRender.attrs.disabled = isDisable;
      noTaxAmt.editRender.attrs.disabled = isDisable;
      remark.editRender.attrs.disabled = isDisable;
      totalAmt.editRender.attrs.disabled = isDisable;
    },

    //信息不可编辑
    editisDisabled({ row }) {
      let xTable = this.$refs.documentTable;
      let isDisable = this.modelType;
      let writeOffAmt = xTable.getColumnByField("writeOffAmt");
      writeOffAmt.editRender.attrs.disabled = isDisable;
    },

    //打开选择模态框
    openSelect() {
      this.$refs.request.open();
    },

    //获取选择的信息
    getBackList(row) {
      this.$set(this.formInline, "requestInstructionNo", row.applyNo);
    },

    //科目获取焦点
    getSubject({ row }) {
      this.subjectType = row;
      this.$refs.subjectModel.open();
    },

    //获取科目返回的数据
    getsubBack(row) {
      this.$set(this.subjectType, "accountEntry", row.titleCode);
      // 刷新列表方法
      this.$refs.xTable.refreshColumn();
    },

    //修改费用类型改变科目
    changeExpenseType({ row }) {
      row.accountEntry = "";
    },

    //价税合计变更计算
    gettotal(v) {
      let row = v.row,
        column = v.column;

      let tax = this.taxRate.filter(item => item.itemCode == row.taxRateCode);
      let str = 0;
      if (tax[0].itemName != "0%") {
        str = tax[0].itemName.replace("%", "");
        str = str / 100;
      }
      row.taxAmt = this.$utils.multiply(column.model.value, str).toFixed(2);
    },

    //税率变更计算
    getTax(v) {
      let row = v.row,
        column = v.column;
      // editRender model
      let tax = this.taxRate.filter(
        item => item.itemCode == column.model.value
      );
      let str = 0;
      if (tax[0].itemName != "0%") {
        str = tax[0].itemName.replace("%", "");
        str = str / 100;
      }

      //
      row.taxAmt = this.$utils.multiply(row.totalAmt, str).toFixed(2);
    },

    //判断手动输入税额
    taxCanuse(v) {
      let row = v.row,
        column = v.column,
        tax = this.taxRate.filter(item => item.itemCode == row.taxRateCode);
      let str = 0;
      if (tax[0].itemName != "0%") {
        str = tax[0].itemName.replace("%", "");
        str = str / 100;
      }
      let taxMoney = this.$utils.multiply(row.totalAmt, str).toFixed(2);
      let diff = this.$utils.subtract(column.model.value, taxMoney);
      if (diff > 0.01) {
        this.$Modal.confirm({
          title: "警告",
          content: "<p>税额有误差，是否确认提交</p>",
          onOk: () => {},
          onCancel: () => {
            row.taxAmt = taxMoney;
          }
        });
      }
    },

    //删除行
    dele(row) {
      this.formInline.expenseDetails.splice(row.seq - 1, 1);
    },

    //添加行
    addRow() {
      let data = {};
      data.expenseType = "FY001";
      data.totalAmt = 0;
      data.taxRateCode = "TR001";
      data.taxAmt = 0;
      this.formInline.expenseDetails.splice(1, 0, data);
    },

    // 表格尾部合计
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "合计";
          }
          if (["totalAmt", "taxAmt", "noTaxAmt"].includes(column.property)) {
            return this.$utils.sum(data, column.property);
          }
          return null;
        })
      ];
    },

    //删除行借支核销
    deleteDetails(row) {
      this.details.splice(row.seq - 1, 1);
    },

    //借支核销尾部合计
    documentFooterMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "合计";
          }
          if (["writeOffAmt", "applyAmt"].includes(column.property)) {
            return this.$utils.sum(data, column.property);
          }
          return null;
        })
      ];
    },

    //选择单据
    SelectTheDocuments() {
      this.$refs.documnets.open();
    },

    //获取到因公数据
    getBusinessList(row) {
      row.map(item => {
        delete item.id;
        item.borrowDate = item.applyTime || "";
        item.serviceId = item.applyNo || "";
      });
      this.details = row;
      // this.$set(this.formInline,'details' , row)
    },

    //获取付款信息
    getPayList(value) {
      if (!value) return;
      let list = this.payUserList.filter(item => item.id == value)[0];
      this.formInline.paymentBank = list.bankName || "";
      this.formInline.paymentBankNo = list.accountCode;
    },

    //获取到上传图片地址
    getImgList(row) {
      this.formInline.voucherPictures = row.list;
    },

    //保存审核
    save(type) {
      this.$refs.formInline.validate(async valid => {
        if (valid) {
          const errMap = await this.$refs.xTable
            .fullValidate()
            .catch(errMap => errMap);
          const errTwo = await this.$refs.documentTable
            .fullValidate()
            .catch(errTwo => errTwo);
          if (errMap || errTwo) {
            if (errTwo) return this.$Message.error("核销金额不能大于借支金额");
            //this.$Message.error('表格校验失败')
          } else {
            this.formInline.step = type;
            this.formInline.details = this.details;
            let msg = this.$Message.loading({
              content: '处理中...',
              duration: 0
            });
            let res = await getExpSve(this.formInline);
            msg();
            if (res.code == 0) {
              this.$Message.success("操作成功");
              this.model = false;
            }
          }
        } else {
          this.$Message.error("带*必填");
        }
      });
    }
  }
};
