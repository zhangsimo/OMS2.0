import QuickDate from "@/components/getDate/dateget"; //日期查询
import MoreQuery from "./components/moreSearch"; // 更多窗口
import supplierExamie from "@/view/system/essentialData/supplierManagement/ClientData";//查看供应商
import {getCustomerDetails} from "@/api/system/essentialData/clientManagement";//通过供应商ID拿到供应商明细
import GoodCus from "@/components/allocation/GoodCus";//回车下拉框供应商
import * as api from "@/api/afterSale/claimSheet/index.js"
import customerClaim from "./components/customerClaim"
import moment from "moment";
import {claimSupplier} from "@/components/changeWbList/changewblist";


import {
  getLeftList,
  getLeftMoreList,
  saveList,
  getCalculate,
  deletList,
  getup
} from "@/api/business/procurementAndStorage";
import selectPartCom from "@/view/salesManagement/salesOrder/batch/selectPartCom";
import FeeRegistration from "@/view/goods/plannedPurchaseOrder/components/FeeRegistration.vue";
import Cookies from "js-cookie";
import {TOKEN_KEY} from "@/libs/util";
import SelectSupplier from "@/view/goods/goodsList/components/supplier/selectSupplier";
import {checkStore} from "@/api/system/systemApi";
import {hideLoading, showLoading} from "@/utils/loading";
import printZF from "./components/print.vue";


export default {
  name: "registerClaimSupplier",
  inject: ["reload"],
  components: {
    QuickDate,
    GoodCus,
    MoreQuery,
    selectPartCom,
    FeeRegistration,
    SelectSupplier,
    customerClaim,
    supplierExamie,
    printZF
  },
  data() {
    let changeNumber = ({cellValue}) => {
      const reg = /^[1-9]\d{0,}$/;
      if (!reg.test(cellValue)) {
        return Promise.reject(new Error("数量输入不正确"));
      }
    }
    return {
      saveLoading: false,
      submitLoading: false,
      isSelfOk: true,
      dataChange: {}, //左侧当前数据
      StoreId: "", //默认仓
      moment: moment,
      advanced: false, //更多模块的弹框
      supplierData: {},//当前选中项查看供应商数据
      clientDataShow: false,//查看供应商弹框 bool
      orderType: 99,
      typeList: [ //单据状态
        {value: 99, name: "所有"},
        {value: 0, name: "草稿"},
        {value: 1, name: "已提交"},
        {value: 2, name: "已完成"}
      ],
      handleSign: 0,
      split1: 0.2,
      leftPage: {
        total: 0,
        size: 50,
        num: 1
      }, //左侧分页
      leftTableData: [], //左侧数组
      logData:[],//处理日志
      queryDate: [], //快速查询时间
      moreQueryList: {}, //更多搜索信息
      formPlan: {
        details: [],
        code: "",
        serviceId: "",
        remark: "",
        afterSaleDate: moment(new Date()).format("YYYY-MM-DD")
      }, //点击获取左侧数据
      ruleValidate: {
        guestId: [
          {required: true, type: "string", message: " ", trigger: "change"}
        ],
        afterSaleDate: [
          {required: true, type: "date",format:"YYYY-MM-DD", message: " ", trigger: "change"}
        ],
      }, //表单校验
      validRules: {
        afterSaleQty: [{required: true, validator: changeNumber}],
        afterSaleReason: [{required: true, message:" ",trigger:"change"}]
      }, //表格校验
      taxRate: {}, //税率
      selectRowState: "草稿", //费用需要的状态
      rightList: [], //右侧点击数据
      headers: {
        Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
      }, //请求头
      upurl: getup, //批量导入地址
      flag: 0,
      new: false,
      selectLeftItemId: ""
    };
  },
  mounted() {
    this.getLeftLists();
  },
  methods: {
    checkSelf({row: {storeShelf}}) {
      if (storeShelf == "") {
        this.isSelfOk = true;
      } else {
        checkStore({storeId: this.formPlan.storeId, name: storeShelf}).then(
          res => {
            if (res.code == 0 && res.data != null) {
              this.isSelfOk = true;
            } else {
              this.isSelfOk = false;
            }
          }
        );
      }
    },
    //选择供应商
    addSuppler() {
      this.$refs.selectSupplier.init();
    },
    //获取选中供应商
    getSupplierName(val) {
      this.$set(this.formPlan, "guestId", val.id);
      this.$set(this.formPlan, "guestName", val.fullName);
    },
    //查看供应商
    supplierExamie() {
      if (!this.dataChange.row.hasOwnProperty('guestId')) {
        return this.$Message.error("请选择一条单据明细");
      }
      let data = {};
      data.id = this.dataChange.row.guestId;
      this.$refs.child.$refs.form.resetFields()
      getCustomerDetails(data).then(res => {
        if (res.code == 0) {
          this.supplierData.clientList = res.data;
          this.nameChange = true;
        }
        this.clientDataShow = true;
      });
    },
    //快速查询获取日期
    getDataQuick(v) {
      this.queryDate = v;
      this.leftPage.num = 1;
      this.moreQueryList = {};
      this.getLeftLists();
    },
    //打印
    setPrint() {
      if (!this.formPlan.id) return this.$message.error("请至少选择一条数据");
      let storeName;
      (this.WarehouseList || []).map(el => {
        if (el.id == this.dataChange.row.storeId) {
          storeName = el.name;
          return
        }
      })
      // this.$refs.printBox.openModal(this.WarehouseList);
      let order = {};
      order.name = "采购入库"
      order.route = this.$route.name
      order.id = this.formPlan.id;
      order.storeName = storeName;
      let printZF = this.$refs.printZF;
      printZF.openModal(order)
      this.$refs.OrderLeft.gitlistValue()
    },
    // 打开更多搜索
    openQueryModal() {
      this.leftPage.num = 1;
      this.moreQueryList = {};
      this.$refs.morequeryModal.openModal();
    },
    //确认更多查询
    moreQuery() {
      this.leftPage.num = 1;
      this.getmoreyLeftLists();
    },
    //更多查询方法
    async getmoreyLeftLists() {
      let data = this.moreQueryList;
      let params = {}
      params.page = this.leftPage.num - 1;
      params.size = this.leftPage.size;
      data.orderType = this.orderType == 99 ? "" : this.orderType;
      let res = await api.registerClaimsQuery(params, data);
      if (res.code === 0) {
        this.leftTableData = res.data.content;
        this.leftPage.total = res.data.totalElements;
      }
    },
    // 左侧表格数据
    async getLeftLists() {
      let data = {};
      if (this.queryDate) {
        data.createstartTime = this.queryDate[0];
        data.createendTime = this.queryDate[1];
      } else {
        data.createstartTime = "";
        data.createendTime = "";
      }
      let params = {}
      data.orderType = this.orderType == 99 ? "" : this.orderType;
      params.page = this.leftPage.num - 1;
      params.size = this.leftPage.size;
      let res = await api.registerClaimsQuery(params, data);
      if (res.code === 0) {
        this.leftTableData = (res.data.content || []).map(el => {
          switch (el.handleSign) {
            case 0:
              el.handleSignStatus = "待处理";
              break;
            case 1:
              el.handleSignStatus = "处理中";
              break;
            case 2:
              el.handleSignStatus = "已处理";
              break;
          }
          switch (el.orderSign) {
            case 0:
              el.orderSignStatus = "草稿";
              break;
            case 1:
              el.orderSignStatus = "已提交";
              break;
            case 2:
              el.orderSignStatus = "已完成";
              break;
          }
          return el;
        });
        this.leftPage.total = res.data.totalElements;
        if (this.selectLeftItemId) {
          for (let b of this.leftTableData) {
            if (b.id == this.selectLeftItemId) {
              this.clickOnesList({row: b});
              break;
            }
          }
        }
      }
    },
    //回车供应商数据
    throwNameFun(v) {
      this.selectSupplierName(v);
    },
    // 选择供应商
    selectSupplierName(row) {
      if (row) {
        this.formPlanmain.guestName = row.fullName;
        this.formPlanmain.guestId = row.id;
      }
    },
    //选择状态
    selectTypetList(val) {
      this.leftPage.num = 1;
      this.moreQueryList = {};
      this.getLeftLists();
    },
    //选择客户理赔登记单打开
    openCustomer() {
      this.$refs.customerClaim.modal1 = true;
    },
    //切换页面
    selectNum(val) {
      this.leftPage.num = val;
      if (JSON.stringify(this.moreQueryList) == "{}") {
        this.getLeftLists();
      } else {
        this.getmoreyLeftLists();
      }
    },
    //切换页数
    selectPage(val) {
      this.leftPage.num = 1;
      this.leftPage.size = val;
      if (JSON.stringify(this.moreQueryList) == "{}") {
        this.getLeftLists();
      } else {
        this.getmoreyLeftLists();
      }
    },
    //点击获取当前信息
    clickOnesList(data) {
      if (data.row.id) {
        this.selectLeftItemId = data.row.id;
      }
      if (this.flag === 1) {
        this.$Modal.confirm({
          title: "您正在编辑单据，是否需要保存",
          onOk: () => {
            this.save();
          },
          onCancel: () => {
            this.getLeftLists();
            this.flag = 0;
          }
        });
        return;
      }
      this.dataChange = data;
      this.$refs.xTab.setCurrentRow(this.dataChange.row);
      this.formPlan = data.row;
    },
    // 在值发生改变时更新表尾合计
    updateFooterEvent() {
      let xTable = this.$refs.xTable;
      xTable.updateFooter();
    },
    //获取尾部总数
    footerMethod({columns, data}) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "和值";
          }
          if (
            [
              "afterSaleQty",
              "processedQty",
              "untreatedQty"
            ].includes(column.property)
          ) {
            return this.$utils.sum(data, column.property);
          }
          return null;
        })
      ];
    },

    setSelected(row) {
      this.$refs.formPlan.resetFields();
      this.$refs.xTab.setCurrentRow(row);
      this.formPlan = row;
    },

    //保存
    save() {
      if (!this.isSelfOk) {
        return this.$message.error("请填写正确的仓位!");
      }
      this.$refs.formPlan.validate(async valid => {
        if (valid) {
          if (this.dataChange.row) {
            try {
              await this.$refs.xTable.validate();
              this.formPlan.afterSaleDate = this.formPlan.afterSaleDate
                ? moment(this.formPlan.afterSaleDate).format("YYYY-MM-DD")
                : "";
              this.saveLoading = true;
              let res = await api.registerClaimSave(this.formPlan);
              if (res.code === 0) {
                this.getLeftLists();
                this.formPlan = {
                  code: ""
                };
                this.$Message.success("保存成功");
                this.flag = 0;
                this.setSelected(this.dataChange.row);
              }
              this.saveLoading = false;
            } catch (errMap) {
              this.saveLoading = false;
              this.$XModal.message({
                status: "error",
                message: "表格校验不通过！"
              });
            }
          } else {
            this.$message.error("请先选择要保存的数据");
          }
        } else {
          this.$Message.error("*为必填!");
        }
      });
    },
    //打开添加配件模态框
    addMountings() {
      this.$refs.selectPartCom.init();
    },
    //添加配件
    getPartNameList(val) {
      this.$refs.formPlan.validate(async valid => {
        if (valid) {
          this.formPlan.afterSaleDate = this.formPlan.afterSaleDate
            ? moment(this.formPlan.afterSaleDate).format("YYYY-MM-DD")
            : "";
          this.formPlan.details = [...claimSupplier(val),...this.formPlan.details]
          console.log(this.formPlan.details,1111)
        } else {
          this.$Message.error("*为必填项");
        }
      });
    },
    //新增
    addNew() {
      // if ( !this.leftTableData[0] || !this.leftTableData[0].hasOwnProperty("guestId")||this.leftTableData[0].guestId) {
        this.$refs["formPlan"].resetFields();
        this.formPlan = {
          details: [],
          code: "",
          serviceId: "",
          remark: "",
          guestId: "",
          guestName: "",
          afterSaleDate: moment(new Date()).format("YYYY-MM-DD")
        };
        this.leftTableData.unshift(this.formPlan);
        this.$refs.xTab.setCurrentRow(this.leftTableData[0]);
        this.dataChange.row = this.formPlan;
        this.flag = 1;
        this.new = true;
      // } else {
      //   this.$message.error("请先保存数据");
      // }
    },
    //右侧表格多选
    selectSameList(val) {
      this.rightList = val.selection;
    },
    //右侧全选
    selectAllList(val) {
      this.rightList = val.selection;
    },
    //删除
    async delect() {
      if (this.rightList.length < 1)
        return this.$message.error("至少选择一条数据");
      this.formPlan.details.map((el, index) => {
        this.rightList.map(el2 => {
          if (el.id == el2.id) {
            this.formPlan.details.splice(index, 1);
          }
        })
      })
    },
    getRUl() {
      this.upurl = getup + "?id=" + this.formPlan.id;
    },

    //批量上传失败
    onFormatError() {
      this.$Message.error("只支持xls xlsx后缀的文件");
    },
    // 上传成功函数
    onSuccess(response) {
      if (response.code == 0) {
        if (response.data.list && response.data.list.length > 0) {
          this.warning(response.data.list[0]);
        }
        this.getLeftLists();
        this.formPlan = {
          code: ""
        };
        this.$Message.success("保存成功");
      } else {
        this.$Message.error("上传失败");
      }
    },
    warning(nodesc) {
      this.$Notice.warning({
        title: "上传错误信息",
        desc: nodesc
      });
    },
    //上传之前清空
    beforeUpload() {
      this.$refs.upload.clearFiles();
    }
  }
};
