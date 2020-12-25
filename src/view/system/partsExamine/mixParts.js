import {
  setApproval,
  getExamineList,
  getExamineDetail
} from "_api/system/partsExamine/partsExamineApi";
import {showLoading,hideLoading} from "../../../utils/loading";

export const minxParts = {
  data() {
    return {
      //快速查询
      purchaseType: "queryCode",
      purchaseTypeArr: [
        {
          label: "编码",
          value: "queryCode"
        },
        {
          label: "名称",
          value: "fullName"
        },
        {
          label: "车型",
          value: "carModelName"
        }
        // {
        //   label: "拼音",
        //   value: "pyCode"
        // }
      ],
      //审核状态查询
      approvalType: 0,
      approvalTypeArr: [
        {
          label: "已审",
          value: 1
        },
        {
          label: "待审核",
          value: 0
        },
        {
          label: "不通过",
          value: 2
        },
        {
          label: "待审批",
          value: 3
        },
      ],

      //新增配件名称层
      addPartModal: false,
      //快速查询输入值
      searchValue: "",
      //审核日期查询
      dateTime: "",
      //显示自己
      showPerson:true,
      //单位换算存在的list
      valueVOS: [
        {
          unit1: "",
          inputNum: "",
          unit2: ""
        }
      ],
      //单位换算item obj
      valueVo: {
        unit1: "",
        inputNum: "",
        unit2: ""
      },
      //分页obj
      page: {
        num: 1,
        size: 10,
        total: 0
      },
      loading: false,
      //审核按钮loding
      approvalLoading: false,
      //配件标定审核list表头
      columns: [
        {
          title: "序号",
          minWidth: 50,
          type: "index"
        },
        {
          title: "配件信息",
          key: "venderSkuNo",
          align: "center",
          children: [
            // {
            //   title: "所属体系",
            //   key: "tenantName",
            //   // key:"belongSystem",
            //   minWidth: 70
            // },
            {
              title: "申请分店",
              key: "orgname",
              minWidth: 70
            },
            {
              title: "配件编码",
              key: "code",
              minWidth: 70
            },
            {
              title: "配件名称",
              key: "name",
              minWidth: 70
            },
            {
              title: "配件品质",
              key: "qualityName",
              minWidth: 70,
            },
            {
              title: "品牌车型",
              key: "carModelName",
              minWidth: 150,
              render: (h, params) => {
                return h(
                  "span",
                  params.row.carBrand == null
                    ? ""
                    : params.row.carBrand + " " + params.row.carModelName
                );
              }
            },
            {
              title: "配件类别一级",
              key: "carTypefName",
              minWidth: 70
            },
            {
              title: "配件类别二级",
              key: "carTypesName",
              minWidth: 70
            },
            {
              title: "单位",
              key: "unitId",
              minWidth: 70
            },
            {
              title: "规格",
              key: "spec",
              minWidth: 70
            },
            {
              title: "审核",
              key: "approval",
              minWidth: 70,
              render: (h, params) => {
                let approval = params.row.auditSign || 0;
                let className = "";
                let apptxt = "待审核";
                if (approval == 1) {
                  className = "blue";
                  apptxt = "审批通过";
                } else if (approval == 2) {
                  apptxt = "未通过";
                  className = "red";
                } else if (approval == 3) {
                  apptxt = "待审批";
                }
                return h(
                  "span",
                  {
                    class: className
                  },
                  "●" + apptxt
                );
              }
            },
            {
              title: "所属事业部",
              key: "businessUnit",
              minWidth: 70
            },
            {
              title: "产品负责人",
              key: "dutyMan",
              minWidth: 70
            },
          ]
        },
        {
          title: "操作信息",
          key: "venderSkuNo",
          align: "center",
          children: [
            {
              title: "创建人",
              key: "createUname",
              minWidth: 70
            },
            {
              title: "创建日期",
              key: "createTime",
              minWidth: 70
            },
            {
              title: "审核人",
              key: "auditor",
              minWidth: 70
            },
            {
              title: "审核日期",
              key: "auditDate",
              minWidth: 70
            }
          ]
        }
      ],
      tbdata: [], //审批数据
      //配件审核标定点击选中的table数据
      selectTable: {},
      //高度
      heightWrap: 0
    };
  },
  mounted() {
    this.initStart();
  },
  methods: {
    initStart() {
      this.getList();
    },
    //初始化
    getList() {
      const params = {};
      //快速查询输入条件
      let searchValue = this.searchValue.trim();
      if (searchValue) {
        params[this.purchaseType] = searchValue;
      }
      //审核日期
      if (this.dateTime[0]) {
        params.startTime = this.dateTime[0] + " 00:00:00";
        params.endTime = this.dateTime[1] + " 23:59:59";
      }
      //配件审核状态
      params.auditSign = this.approvalType;
      //显示自己
      this.showPerson?params.showPerson = 1:"";
      params.page = this.page.num - 1;
      params.size = this.page.size;
      this.loading = false;
      getExamineList(params).then(res => {
        this.loading = false;
        if (res.code == 0) {
          this.tbdata = res.data.content || [];
          this.page.total = res.data.totalElements;
        }
      });
    },
    //新增产品
    approval() {
      this.approvalLoading = true;
      getExamineDetail({ id: this.selectTable.id }).then(res => {
        this.approvalLoading = false;
        if (res.code == 0) {
          this.$refs.partInfo.init(res.data || {});
          this.$refs.partInfo.code=this.selectTable.id
        }
      });
    },

    //配件名称查询层显示
    showName() {
      this.$refs.searchPartName.init();
    },
    //分页
    changePage(p) {
      this.page.num = p;
      this.getList();
    },
    changeSize(size) {
      this.page.num = 1;
      this.page.size = size;
      this.getList();
    },
    //选择的时间
    selectDate(date) {
      this.dateTime = date;
      this.search();
    },
    search() {
      this.page.num = 1;
      this.getList();
    },

    //表格单选选中
    selectTabelData(v) {
      this.selectTable = v;
    },

    //提交审批
    submitSave(obj) {
      //当前编辑id
      if (this.selectTable.id) {
        obj.id = this.selectTable.id;
      }
      this.$refs.partInfo.saveFlag = false;
      showLoading();
      setApproval(obj).then(res => {
        hideLoading();
        if (res.code == 0) {
          this.$refs.partInfo.proModal = false;
          // obj.auditSign===1? this.$message.success('审核通过')
          this.$message.success('操作成功')
          this.getList();
          this.selectTable = {};
        }
      });
    }
  }
};
