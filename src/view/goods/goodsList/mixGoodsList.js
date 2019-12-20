import {
  getPurchaseInit,
  saveDraft,
  findPageByDynamicQuery,
  queryByConditions,
  saveCommit,
  saveObsolete,
  saveReverse,
  exportXls,
  upxlxs,
  deleteparts,
} from "_api/purchasing/purchasePlan";
import * as tools from "../../../utils/tools";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
// import {purchaseTypeList} from "./goodsList";

export const mixGoodsData = {
  data() {
    return {
      upurl: "",
      //计划采购信息
      formPlan: {
        supplyName: "", //供应商
        guestId: "", //供应商id
        settleTypeId: "", // 结算方式
        planArriveDate: "", //计划日期
        // planDateformat: "",

        planner: this.$store.state.user.userData.staffName || "", //计划人
        remark: "", //备注
        billType: "", //票据类型
        directGuestId: "", //直发门店
        planOrderNum: "新计划采购", //计划单号
        otherPrice: 0, //其他费用
        totalPrice: 0 //合计总金额
      },
      rulePlan: {
        supplyName: [
          { required: true, message: "供应商不能为空", trigger: "blur" }
        ],
        planArriveDate: [
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
        ],
        settleTypeId: [
          { required: true, message: "请选择结算方式", trigger: "change" }
        ]
      },
      tableData: [],
      //待删除数据
      delArr: [],
      //票据类型
      invoiceMap: [],
      // 结算方式
      settleMethods: [],
      //直发门店
      companyMap: [],
      //选中的采购计划单
      selectPlanOrderItem: {},

      headers: {
        Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
      }
    };
  },
  mounted() {
    getPurchaseInit({}).then(res => {
      //票据类型
      let { invoiceMap, settlementMap } = res.data || {};
      if (invoiceMap) {
        for (let v in invoiceMap) {
          let objData = {
            label: v,
            value: invoiceMap[v]
          };
          this.invoiceMap.push(objData);
        }
        for (let el in settlementMap) {
          this.settleMethods.push({ value: settlementMap[el], label: el });
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
      if (this.purchaseType !== 9999 && this.purchaseType) {
        data.billStatusId = this.purchaseType;
      }
      if (this.dateTime.length > 0) {
        data.startTime = this.dateTime[0];
        data.endTime = this.dateTime[1];
      }
      params.page = this.page.num - 1;
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
        this.newadd = false;
        this.loading = false;
        this.tbdata = res.data.content || [];
        this.tableData = [];
        this.$refs["planOrderTable"].clearCurrentRow();
        this.$refs["formPlan"].resetFields();
        this.formPlan = {
          supplyName: "", //供应商
          guestId: "", //供应商id
          settleTypeId: "", // 结算方式
          planArriveDate: "", //计划日期
          planner: this.$store.state.user.userData.staffName || "", //计划人
          remark: "", //备注
          billType: "", //票据类型
          directGuestId: "", //直发门店
          planOrderNum: "新计划采购", //计划单号
          otherPrice: 0, //其他费用
          totalPrice: 0 //合计总金额
        };
        this.page.total = res.data.totalElements;
      }
    },
    //采购计划列表选中数据
    selectVxeData({ selection, rowIndex, reserves }) {
      console.log(selection);
      this.delArr = selection;
    },
    selectAll({ checked }) {
      if (checked) {
        this.tableData.forEach(el => {
          this.delArr.push(el)
        })
      } else {
        this.delArr = new Array();
      }
    },
    //删除选中数据
    delTableData() {
      if (this.delArr.length == 0) {
        this.$message.error("选择要删除的数据");
      } else {
        // this.delArr.map(item => {
        //   this.tableData.map((v2, i) => {
        //     if (item.id == v2.id) {
        //       this.tableData.splice(i, 1);
        //     }
        //   });
        // });
        this.$Modal.confirm({
          title: '是否要删除配件',
          onOk: async () => {
            let res = await deleteparts(this.delArr);
            if (res.code == 0) {
              this.$Message.success('删除成功');
              this.getList();
            }
          },
          onCancel: () => {
            this.$Message.info('取消删除');
          },
        })
      }
    },
    //计算合计
    addFooter({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "合计";
          }
          if (
            [
              "totalStockQty",
              "masterStockQty",
              "branchStockQty",
              "onWayQty",
              "unsalableQty",
              "orderQty",
              "orderPrice",
              "noTaxPrice",
              "noTaxAmt",
              "recentPrice"
            ].includes(column.property) ||
            columnIndex === 12 ||
            columnIndex === 17
          ) {
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
      if (
        [
          "totalStockQty",
          "masterStockQty",
          "branchStockQty",
          "onWayQty",
          "unsalableQty",
          "orderQty",
          "orderPrice",
          "noTaxPrice",
          "noTaxAmt",
          "recentPrice"
        ].includes(type)
      ) {
        return total.toFixed(2);
      }
      if (columnIndex === 12) {
        let totals = 0;
        let sumarr = data.map(el => {
          return el.orderPrice * el.orderQty;
        });
        totals = sumarr.reduce((total, el) => (total += el), 0);
        this.totalAmt = totals;
        this.formPlan.totalPrice = totals + this.formPlan.otherPrice;
        return totals.toFixed(2);
      }
      if (columnIndex === 17) {
        let totals = 0;
        let sumarr = data.map(el => {
          return Math.abs(el.orderPrice - el.recentPrice);
        });
        totals = sumarr.reduce((total, el) => (total += el), 0);
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
      this.formPlan.settleTypeId = v.settTypeId || "";
    },
    //选择日期
    setDataFun(v) {
      // console.log(v);
      this.formPlan.planArriveDate = v;
    },
    //获取订单状态
    // returnOrderType(n){
    //   return purchaseTypeList(n)
    // },
    //采购计划单选中
    selectTabelData(v) {
      // console.log(this.formPlan)
      // console.log(this.newadd)
      // if(this.newadd){
      //   Object.keys(this.formPlan).forEach((key) => {
      //     if (key !== 'planner' && key !== 'planOrderNum') {
      //       if (this.formPlan[key] !== '') {
      //         confirm('您正在编辑单据，是否需要保存')
      //       }
      //     }
      //   })
      // }
      this.$refs['formPlan'].resetFields();
      if (this.newadd && this.selectPlanOrderItem.new) {
        this.tbdata.splice(0, 1);
        this.newadd = false;
        this.$refs.planOrderTable.clearCurrentRow();
      }
      if (v) {
        this.isinput = false;
        this.selectPlanOrderItem = v || {};
        this.selectPlanOrderItem.billStatusId = v.billStatusId.value;
        this.formPlan.supplyName = v.guest || "";
        this.formPlan.guestId = v.guestId || "";
        this.formPlan.planArriveDate = new Date(v.orderDate) || "";
        // this.formPlan.planDateformat = v.orderDate || "";
        this.formPlan.remark = v.remark || "";
        this.formPlan.billType = v.billTypeId || "";
        this.formPlan.directGuestId = v.directGuestId || "";
        this.formPlan.planOrderNum = v.serviceId || "";
        this.formPlan.otherPrice = v.otherAmt || 0;
        this.formPlan.totalPrice = v.totalAmt || 0;
        this.tableData = v.details || [];
        this.mainId = v.id;
        this.upurl = upxlxs + v.id;
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
      this.formPlan = {
        supplyName: "", //供应商
        guestId: "", //供应商id

        planArriveDate: new Date(), //计划日期

        planner: this.$store.state.user.userData.staffName || "", //计划人
        remark: "", //备注
        billType: "", //票据类型
        directGuestId: "", //直发门店
        planOrderNum: "新计划采购", //计划单号
        otherPrice: 0, //其他费用
        totalPrice: 0 //合计总金额
      };
      this.tableData = [];
      let row = {
        new: true,
        _highlight: true,
        id: "",
        billStatusId: "",
        createTime: tools.transTime(new Date()),
        details: []
      };
      this.selectPlanOrderItem = row;
      this.tbdata.unshift(row);
    },

    //作废--反作废
    saveObsoleteFun(type) {
      if (this.selectPlanOrderItem.new) {
        return this.$Message.error("请先保存数据!");
      }
      let title = "";
      if (type === 1) {
        title = "是否要作废";
      } else {
        title = "是否要反作废";
      }
      this.$Modal.confirm({
        title: title,
        onOk: () => {
          if (type === 1) {
            saveObsolete(this.selectPlanOrderItem.id).then(res => {
              if (res.code == 0) {
                this.$Message.success("提交成功");
                this.getList();
              }
            });
          } else {
            saveReverse(this.selectPlanOrderItem).then(res => {
              if (res.code == 0) {
                this.$Message.success("提交成功");
                this.getList();
              }
            });
          }
        },
        onCancel: () => {}
      });
    },
    //保存采购计划信息
    submit(subType) {
      this.$refs['formPlan'].validate(valid => {
        if (valid) {
          let objReq = {};
          if (this.selectPlanOrderItem.id) {
            objReq.id = this.selectPlanOrderItem.id;
          }
          //供应商id
          objReq.guestId = this.formPlan.guestId;
          objReq.guest = this.formPlan.supplyName;
          //计划日期
          objReq.orderDate = tools.transTime(this.formPlan.planArriveDate);
          //计划员name
          objReq.orderMan = this.formPlan.planner;
          //备注
          objReq.remark = this.formPlan.remark;
          //票据类型
          objReq.billTypeId = this.formPlan.billType;
          //直发门店
          objReq.directGuestId = this.formPlan.directGuestId;
          //计划单号
          objReq.settleTypeId = this.formPlan.settleTypeId;
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
            if(this.tableData.length <= 0) {
              return this.$Message.error('请添加配件后再提交');
            }
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
    },

    // 导出
    exportHandle() {
      if (this.selectPlanOrderItem.new) {
        return this.$Message.error("请先保存数据!");
      }
      if (!this.mainId || this.mainId.length <= 0) {
        return this.$Message.error("请选择要导出的数据!");
      }
      let url = exportXls(this.mainId);
      window.open(url, "_balnk");
    },

    // 导入
    handleBeforeUpload() {
      if (this.selectPlanOrderItem.new) {
        return this.$Message.error("请先保存数据!");
      }
      let refs = this.$refs;
      refs.upload.clearFiles();
    },
    handleSuccess(res, file) {
      let self = this;
      if (res.code == 0) {
        self.$Message.success("导入成功");
        this.tableData = res.data.details;
      } else {
        self.$Message.error(res.message);
      }
    },

    changeTotals() {
      let totals = 0;
      this.tableData.forEach(el => {
        totals += el.orderPrice * el.orderQty;
      })
      this.formPlan.totalPrice = totals + this.formPlan.otherPrice;
    }
  }
};
