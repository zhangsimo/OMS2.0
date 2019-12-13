import {
  getPurchaseInit,
  saveDraft,
  findPageByDynamicQuery,
  queryByConditions,
  saveCommit,
  saveObsolete,
  saveReverse
} from "_api/purchasing/purchasePlan";
import * as tools from "../../../utils/tools";
// import {purchaseTypeList} from "./goodsList";

export const mixGoodsData = {
  data() {
    return {
      //计划采购信息
      formPlan: {
        supplyName: "", //供应商
        guestId: "", //供应商id

        planDate: "", //计划日期
        planDateformat: "",

        planner: this.$store.state.user.userData.staffName || "", //计划人
        remark: "", //备注
        billType: "", //票据类型
        hairShop: "", //直发门店
        planOrderNum: "新计划采购", //计划单号
        otherPrice: 0, //其他费用
        totalPrice: 0 //合计总金额
      },
      rulePlan: {
        supplyName: [
          { required: true, message: "供应商不能为空", trigger: "blur" }
        ],
        planDate: [
          {
            required: true,
            type: "date",
            message: "计划采购日期不能为空",
            trigger: "change"
          }
        ],
        planner: [
          { required: true, message: "计划员不能为空", trigger: "blur" }
        ],
        billType: [
          { required: true, message: "票据类型不能为空", trigger: "change" }
        ]
      },
      tableData: [],
      //待删除数据
      delArr: [],
      //票据类型
      invoiceMap: [],
      //直发门店
      companyMap: [],
      //选中的采购计划单
      selectPlanOrderItem: {},

      //高级查询
      seniorFormData: {
        name: "",
        url: "",
        owner: "",
        type: "",
        approver: "",
        date: "",
        desc: ""
      }
    };
  },
  mounted() {
    getPurchaseInit({}).then(res => {
      //票据类型
      let invoiceMap = res.data.invoiceMap || {};
      if (invoiceMap) {
        for (let v in invoiceMap) {
          let objData = {
            label: v,
            value: invoiceMap[v]
          };
          this.invoiceMap.push(objData);
        }
      }
      //直发门店
      let companyMap = res.data.companyMap || {};
      if (companyMap) {
        for (let v in companyMap) {
          let objData = {
            label: v,
            value: companyMap[v]
          };
          this.companyMap.push(objData);
        }
      }
    });
  },
  methods: {
    //初始化
    async getList() {
      let params = {};
      let data = {};
      if (this.purchaseType !== 9999) {
        data.billStatusId = this.purchaseType;
      }
      if (this.dateTime.length > 0) {
        data.startTime = this.dateTime[0];
        data.endTime = this.dateTime[1];
      }
      params.page = this.page.num;
      params.size = this.page.size;
      let res;
      if (!this.isMore) { 
        res = await findPageByDynamicQuery(params, data);
       } else {
        if (this.moreData != null) {
          data = { ...data, ...this.moreData };
        }
        res = await queryByConditions(params, data);
      }
      if (res.code == 0) {
        this.loading = false;
        this.tbdata = res.data.content || [];
        this.page.total = res.data.totalElements;
      }
    },
    //采购计划列表选中数据
    selectVxeData({ selection, rowIndex, reserves }) {
      console.log(selection);
      this.delArr = selection;
    },
    //删除选中数据
    delTableData() {
      if (this.delArr.length == 0) {
        this.$message.error("选择要删除的数据");
      } else {
        this.delArr.map(item => {
          this.tableData.map((v2, i) => {
            if (item.id == v2.id) {
              this.tableData.splice(i, 1);
            }
          });
        });
        this.delArr = [];
      }
    },
    //计算合计
    addFooter({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "合计";
          }
          if (['totalStockQty',
          'masterStockQty',
          'branchStockQty',
          'onWayQty',
          'unsalableQty',
          'orderQty',
          'orderPrice',
          'noTaxPrice',
          'noTaxAmt',
          'recentPrice',
          ].includes(column.property) || columnIndex === 12 || columnIndex === 17 ) {
            return this.sum(data, column.property, columnIndex);
          }
          return null;
        })
      ];
    },
    sum(data, type, columnIndex) {
      let total = 0;
      data.map(item => {
        let value = item[type];
        if (!value) {
          value = 0;
        }
        total += parseFloat(value);
      });
      if (['totalStockQty',
      'masterStockQty',
      'branchStockQty',
      'onWayQty',
      'unsalableQty',
      'orderQty',
      'orderPrice',
      'noTaxPrice',
      'noTaxAmt',
      'recentPrice',].includes(type)) {
        return total.toFixed(2);
      }
      if (columnIndex === 12) {
        let totals = 0;
        let sumarr = data.map(el => {
          return row.orderPrice * row.orderQty;
        })
        totals = sumarr.reduce((total, el) => total += el, 0);
        this.totalAmt = totals;
        return totals.toFixed(2);
      }
      if(columnIndex === 17) {
        let totals = 0;
        let sumarr = data.map(el => {
          return Math.abs(row.orderPrice - row.recentPrice);
        })
        totals = sumarr.reduce((total, el) => total += el, 0);
        this.totalAmt = -1 * totals;
        return totals.toFixed(2);
      }
      return total;
    },
    //添加配件数据
    getPartNameList(v) {
      this.tableData = this.tableData.concat(v);
    },
    //获取选中供应商
    getSupplierName(v) {
      //赋值供应商名称
      this.formPlan.supplyName = v.fullName || "";
      //赋值供应商id
      this.formPlan.guestId = v.id || "";
      //赋值票据类型id
      this.formPlan.billType = v.billTypeId || "";
    },
    //选择日期
    setDataFun(v) {
      console.log(v);
      this.formPlan.planDateformat = v;
    },
    //获取订单状态
    // returnOrderType(n){
    //   return purchaseTypeList(n)
    // },
    //采购计划单选中
    selectTabelData(v) {
      // console.log(v)
      if (v) {
        this.isinput = false;
        this.selectPlanOrderItem = v || {};
        this.selectPlanOrderItem.billStatusId = v.billStatusId.value;
        this.formPlan.supplyName = v.guest || "";
        this.formPlan.guestId = v.guestId || "";
        this.formPlan.planDate = v.orderDate || "";
        this.formPlan.planDateformat = v.orderDate || "";
        this.formPlan.remark = v.remark || "";
        this.formPlan.billType = v.billTypeId || "";
        this.formPlan.hairShop = v.directOrgid || "";
        this.formPlan.planOrderNum = v.serviceId || "";
        this.formPlan.otherPrice = v.otherAmt || 0;
        this.formPlan.totalPrice = v.totalAmt || 0;
        this.tableData = v.details || [];
        this.mainId = v.id;
      }
    },

    //新增采购计划单
    addOrder() {
      if (this.newadd) {
        return this.$Message.error("请先保存数据");
      }
      this.isinput = false;
      this.newadd = true;
      this.$refs["planOrderTable"].clearCurrentRow();
      this.$refs["formPlan"].resetFields();
      (this.formPlan = {
        supplyName: "", //供应商
        guestId: "", //供应商id

        planDate: "", //计划日期
        planDateformat: "",

        planner: this.$store.state.user.userData.staffName || "", //计划人
        remark: "", //备注
        billType: "", //票据类型
        hairShop: "", //直发门店
        planOrderNum: "新计划采购", //计划单号
        otherPrice: 0, //其他费用
        totalPrice: 0 //合计总金额
      }),
        (this.tableData = []);
      this.selectPlanOrderItem = {};
      this.selectPlanOrderItem.billStatusId = 0;
      this.tbdata.unshift({
        new: true,
        _highlight: true,
        id: "0",
        billStatusId: "",
        createTime: tools.transTime(new Date()),
        details: []
      });
    },

    //作废--反作废
    saveObsoleteFun(type) {
      if (type === 1) {
        let req = {
          id: this.selectPlanOrderItem.id
        };
        saveObsolete(req).then(res => {
          if (res.code == 0) {
            this.$Message.success("提交成功");
            this.getList();
          }
        });
      } else {
        let req = {
          id: this.selectPlanOrderItem.id
        };
        saveReverse(req).then(res => {
          if (res.code == 0) {
            this.$Message.success("提交成功");
            this.getList();
          }
        });
      }
    },
    //保存采购计划信息
    submit(name, subType) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let objReq = {};
          if (this.selectPlanOrderItem.id) {
            objReq.id = this.selectPlanOrderItem.id;
          }
          //供应商id
          objReq.guestId = this.formPlan.guestId;
          objReq.guest = this.formPlan.supplyName;
          //计划日期
          objReq.orderDate = this.formPlan.planDateformat;
          //计划员name
          objReq.orderMan = this.formPlan.planner;
          //备注
          objReq.remark = this.formPlan.remark;
          //票据类型
          objReq.billTypeId = this.formPlan.billType;
          //直发门店
          objReq.directOrgid = this.formPlan.hairShop;
          //计划单号
          if (
            this.formPlan.planOrderNum &&
            this.formPlan.planOrderNum != "新计划采购"
          ) {
            objReq.serviceId = this.formPlan.planOrderNum;
          }
          //其它费用
          objReq.otherAmt = parseFloat(this.formPlan.otherPrice);
          //合计总金额
          objReq.totalAmt = parseFloat(this.formPlan.totalPrice);
          //配件详情
          objReq.details = this.tableData;
          // console.log(objReq)
          // return
          if (subType === 1) {
            saveDraft(objReq).then(res => {
              if (res.code == 0) {
                this.newadd = false;
                this.proModal = false;
                this.$Message.success("添加成功");
                this.getList();
              }
            });
          } else if (subType === 2) {
            saveCommit(objReq).then(res => {
              if (res.code == 0) {
                this.newadd = false;
                this.proModal = false;
                this.$Message.success("提交成功");
                this.getList();
              }
            });
          }
        } else {
          this.$Message.error("必填数据未填写");
        }
      });
    }
  }
};
