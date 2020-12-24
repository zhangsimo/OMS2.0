import QuickDate from "@/components/getDate/dateget"; //日期查询
import MoreQuery from "./components/moreSearch"; // 更多窗口
import supplierExamie from "@/view/system/essentialData/supplierManagement/ClientData";//查看供应商
import {getCustomerDetails} from "@/api/system/essentialData/clientManagement";//通过供应商ID拿到供应商明细
import GoodCus from "@/components/allocation/GoodCus";//回车下拉框供应商
import * as api from "@/api/afterSale/claimSheet/index.js"
import customerClaim from "./components/customerClaim"
import moment from "moment";
import {claimSupplier} from "@/components/changeWbList/changewblist";
import {hideLoading, showLoading} from "@/utils/loading";
import selectPartCom from "@/view/goods/goodsList/components/selectPartCom.vue";
import {area} from "@/api/lease/registerApi";
import {getSupplierTreeList} from '@/api/system/essentialData/supplierManagement'
import {down} from "@/api/system/essentialData/commoditiesInShortSupply.js"

import Cookies from "js-cookie";
import {TOKEN_KEY} from "@/libs/util";
import SelectSupplier from "@/view/goods/goodsList/components/supplier/selectSupplier";
import printZF from "./components/print.vue";
import {v4} from "uuid";


export default {
  name: "registerClaimSupplier",
  inject: ["reload"],
  components: {
    QuickDate,
    GoodCus,
    MoreQuery,
    selectPartCom,
    SelectSupplier,
    customerClaim,
    supplierExamie,
    printZF
  },
  data() {
    let changeNumber = ({cellValue}) => {
      const reg = /^[1-9]\d*$/;
      if (!reg.test(cellValue)) {
        return Promise.reject(new Error("数量输入不正确"));
      }
    }
    return {
      dataChange: {}, //左侧当前数据
      moment: moment,
      supplierData: {
        clientList: {guestTaxpayerVOList: []},
      },//当前选中项查看供应商数据
      clientDataShow: false,//查看供应商弹框 bool
      orderSign: 99,
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
      logData: [],//处理日志
      logDataLoading: false,//处理日志表格
      queryDate: [], //快速查询时间
      moreQueryList: {}, //更多搜索信息
      formPlan: {
        details: [],
        code: "",
        serviceId: "",
        remark: "",
        partOrCustomerOnly: 0,//添加配件1 或者选择 客户理赔登记单2 只可选择一种
        orderSign: 1,
        afterSaleDate: moment(new Date()).format("YYYY-MM-DD")
      }, //点击获取左侧数据
      ruleValidate: {
        guestId: [
          {required: true, type: "string", message: " ", trigger: "change"}
        ],
        afterSaleDate: [
          {required: true, type: "date", message: "", trigger: "change"}
        ],
      }, //表单校验
      validRules: {
        afterSaleQty: [{required: true, validator: changeNumber}],
        afterSaleReason: [{required: true, message: "理赔原因必填", trigger: "change"}]
      }, //表格校验
      list: [],//暂存 treeList
      treeList: [],
      provinceArr: [],
      rightList: [], //右侧点击数据
      headers: {
        Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
      }, //请求头
      upurl: api.getup, //批量导入地址
      flag: 0,
      addNewBool: false,
      selectLeftItemId: ""
    };
  },
  mounted() {
    this.getLeftLists();
    this.getAdress();
    this.getTreeList();
    this.$refs.child.getList()
    this.$refs.child.getComList()
  },
  methods: {
    //选择供应商
    addSuppler() {
      this.$refs.selectSupplier.init();
    },
    //获取选中供应商
    getSupplierName(val) {
      this.$set(this.formPlan, "guestId", val.id);
      this.$set(this.formPlan, "guestName", val.fullName);
    },
    //获取地址 查看供应商使用
    getAdress() {
      area().then(res => {
        if (res.code == 0) {
          this.provinceArr = res.data || [];
        }
      });
    },
    //查看供应商 treelist
    getTreeList() {
      getSupplierTreeList().then(res => {
        if (res.code == 0) {
          this.list = res.data
          let leverOne = res.data.filter(item => item.lever == 1)
          leverOne.map(item => {
            item.children = []
            item.code = item.id
            this.list.forEach(el => {
              if (item.id == el.parentId) {
                item.children.push(el)
              }
            })
          })
          this.treeList = leverOne
        }
      })
    },
    //获取客户属性
    async getList() {
      let data = {};
      data = ["CS00107", "CS00106", "CS00111", "CS00110"];
      let res = await getDigitalDictionary(data);
      if (res.code == 0) {
        this.dataList = res.data;
      }
    },
    //查看供应商
    supplierExamie(type) {
      if (type) {
        if (!this.dataChange.row.hasOwnProperty('guestId')) {
          return this.$Message.error("请选择一条单据明细");
        }
        let data = {};
        data.id = this.dataChange.row.guestId;
        getCustomerDetails(data).then(res => {
          if (res.code === 0) {
            this.supplierData.clientList = res.data;
            this.supplierData.clientList.belongSystem = JSON.parse(
              this.supplierData.clientList.belongSystem
            ).value;
            this.supplierData.clientList.guestTaxpayerVOList = res.data.guestTaxpayerVOList || [];
            this.$refs.child.financeList = res.data.guestAccountVoList || []
            this.$refs.child.invoice = res.data.guestTaxpayerVOList || []
            this.nameChange = true;
          }
          this.clientDataShow = true;
        });
      }
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
      let order = {};
      order.id = this.formPlan.id;
      let printZF = this.$refs.printZF;
      printZF.openModal(order)
      this.$refs.getLeftLists()
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
      data.orderSign = this.orderSign == 99 ? "" : this.orderSign;
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
        } else {
          this.clickOnesList(this.leftTableData[0]);
        }
      }
    },
    // 左侧表格数据
    async getLeftLists() {
      let data = {};
      if (this.queryDate) {
        data.createStartTime = this.queryDate[0];
        data.createEndTime = this.queryDate[1];
      } else {
        data.createStartTime = "";
        data.createEndTime = "";
      }
      let params = {}
      data.orderSign = this.orderSign == 99 ? "" : this.orderSign;
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
          switch (el.orderSign || "") {
            case 0:
              el.orderSignStatus = "草稿";
              break;
            case 1:
              el.orderSignStatus = "已提交";
              break;
            case 2:
              el.orderSignStatus = "已完成";
              break;
            default:
              el.orderSignStatus = "草稿"
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
        } else {
          this.clickOnesList(this.leftTableData[0]);
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
        this.formPlan.guestName = row.fullName;
        this.formPlan.guestId = row.id;
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
      if (data.row && data.row.id || data.id) {
        this.selectLeftItemId = data.row && data.row.id || data.id;
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
      this.$refs.xTab.setCurrentRow(data.row == undefined ? data : data.row);
      this.formPlan = data.row == undefined ? data : data.row;
      this.formPlan.afterSaleDate = this.formPlan.afterSaleDate || new Date()
        ? new Date(this.formPlan.afterSaleDate)
        : "";
      if (this.formPlan.details.length < 1 || this.formPlan.details.length==undefined) {
        this.formPlan.partOrCustomerOnly = 0;
      } else {
        if (this.formPlan.details[0].enterMainId) {//判断是否从客户理赔登记单录入
          this.formPlan.partOrCustomerOnly = 2;
        } else {
          this.formPlan.partOrCustomerOnly = 1;
          this.formPlan.details = this.formPlan.details.map(el => {
            el.isAddPart = 0;
            return el;
          })
        }
      }
      this.logDataLoading=false;
      this.logData=[];
    },
    //理赔数量录入
    afterSaleQtyChange(row) {
      if (row.isAddPart == 0) {
        row.untreatedQty = row.afterSaleQty
      }
      this.updateFooterEvent()
    },
    //理赔原因录入
    afterSaleReasonChange(row) {
      if (row.afterSaleReason == "") {
        return this.$Message.error("理赔原因必填")
      }
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
    downModal() {
      down('3900000000')
    },
    //保存
    save() {
      this.formPlan.afterSaleDate = this.formPlan.afterSaleDate
        ? new Date(this.formPlan.afterSaleDate)
        : "";
      this.$refs.formPlan.validate(async valid => {
        (this.formPlan.details || []).map(el => {
          if (el.afterSaleReason == "") {
            valid = false;
          }
        })
        if (valid) {
          if (this.dataChange.row) {
            try {
              await this.$refs.xTable.validate();
              this.formPlan.afterSaleDate = this.formPlan.afterSaleDate
                ? moment(this.formPlan.afterSaleDate).format("YYYY-MM-DD")
                : "";
              showLoading()
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
              hideLoading()
            } catch (errMap) {
              hideLoading()
              this.$XModal.message({
                status: "error",
                message: "表格校验不通过！"
              });
            }
          } else {
            this.$message.error("请先选择要保存的数据");
          }
        } else {
          this.$Message.error("理赔数量、理赔原因为必填!");
        }
      });
    },
    //提交
    submit() {
      if (this.formPlan.details && this.formPlan.details.length < 1) {
        return this.$message.error("配件明细不可为空")
      }
      this.formPlan.afterSaleDate = this.formPlan.afterSaleDate
        ? new Date(this.formPlan.afterSaleDate)
        : "";
      this.$refs.formPlan.validate(async valid => {
        (this.formPlan.details || []).map(el => {
          if (el.afterSaleReason == "") {
            valid = false;
          }
        })
        if (valid) {
          if (this.dataChange.row) {
            try {
              await this.$refs.xTable.validate();
              this.formPlan.afterSaleDate = this.formPlan.afterSaleDate
                ? moment(this.formPlan.afterSaleDate).format("YYYY-MM-DD")
                : "";
              showLoading()
              let res = await api.registerClaimSubmit(this.formPlan);
              if (res.code === 0) {
                this.getLeftLists();
                this.formPlan = {
                  code: ""
                };
                this.$Message.success("保存成功");
                this.flag = 0;
                this.setSelected(this.dataChange.row);
              }
              hideLoading()
            } catch (errMap) {
              hideLoading()
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
      this.formPlan.afterSaleDate = this.formPlan.afterSaleDate
        ? new Date(this.formPlan.afterSaleDate)
        : "";
      this.$refs.selectPartCom.init();
    },
    //添加配件
    getPartNameList(val) {
      this.$refs.formPlan.validate(async valid => {
        if (valid) {
          this.formPlan.afterSaleDate = this.formPlan.afterSaleDate
            ? moment(this.formPlan.afterSaleDate).format("YYYY-MM-DD")
            : "";
          let boolNotSim = false;
          (this.formPlan.details || []).map(delEl => {
            (val || []).map(valEl => {
              if (delEl.partInnerId == valEl.partInnerId) {
                boolNotSim = true;
              }
            })
          })
          if (boolNotSim) {
            return this.$message.error("存在已添加配件")
          }
          this.formPlan.details = [...claimSupplier(val), ...(this.formPlan.details || [])]
          this.formPlan.partOrCustomerOnly = 1;
        } else {
          this.$Message.error("*为必填项");
        }
      });
    },
    //新增
    addNew() {
      if (this.formPlan.hasOwnProperty("id") || !this.formPlan.hasOwnProperty("guestId")) {
        this.formPlan = {
          details: [],
          code: "",
          serviceId: "",
          remark: "",
          guestId: "",
          guestName: "",
          partOrCustomerOnly: 0,
          orderSign: 0,//草稿状态
          afterSaleDate: moment(new Date()).format("YYYY-MM-DD")
        };
        this.leftTableData.unshift(this.formPlan);
        this.$refs.xTab.setCurrentRow(this.leftTableData[0]);
        this.dataChange.row = this.formPlan;
        this.flag = 1;
        this.addNewBool = true;
      } else {
        this.$message.error("请先保存数据");
      }
    },
    //右侧表格多选
    selectSameList(val) {
      this.rightList = val.selection;
    },
    //选中出现 处理记录
    async logDataMethod({row}) {
      if (this.addNewBool) {
        return
      } else {
        this.logDataLoading = true;
        let data = {
          detailId: row.id
        }
        let res = await api.registerPartsProcesLog(data)
        if (res.code === 0) {
          this.logData = (res.data || []).map(el => {
            switch (el.recordType) {
              case "1":
                el.recordTypeStatus = "理赔出库";
                break;
              case "2":
                el.recordTypeStatus = "理赔入库";
                break;
            }
            return el;
          });
          this.logDataLoading = false;
        } else {
          this.logDataLoading = false;
        }
      }
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
      this.upurl = api.getup + "?id=" + this.formPlan.id;
    },

    //批量上传失败
    onFormatError() {
      this.$Message.error("只支持xls xlsx后缀的文件");
    },
    // 上传成功函数
    onSuccess(response) {
      if (response.code == 0) {
        if (response.data && response.data.length > 0) {
          this.warning(response.data);
        }
        this.getLeftLists();
        this.formPlan.partOrCustomerOnly = 1;
        this.formPlan = {
          code: ""
        };
        this.$Message.success("保存成功");
      } else {
        this.$Message.error("上传失败");
      }
    },
    warning(nodesc) {
      let str = ""
      if (nodesc.length > 0) {
        nodesc.map((item, index) => {
          if (index != nodesc.length - 1) {
            str += `${item}<br/>`;
          } else {
            str += `${item}`;
          }
        })
      }
      this.$Notice.warning({
        title: '上传错误信息',
        desc: `<div style="height:300px;overflow-y: scroll;">${str}</div>`,
        duration: 0
      });
    },
    //上传之前清空
    beforeUpload() {
      this.$refs.upload.clearFiles();
    }
  }
};
