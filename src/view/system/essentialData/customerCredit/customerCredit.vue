<template>
  <div class="customerCredit-box">
    <div class="customerCredit-header">
      <span>客户名称:</span>
      <Input class="mr10" style="width: 150px" v-model="Name" placeholder="请输入客户名称"/>
      <span>授权采购员:</span>
      <Input class="mr10" style="width: 150px" v-model="salesman" placeholder="请输入授权采购员"/>
      <span>采购员电话:</span>
      <Input class="mr10" style="width: 150px" v-model="telephone" placeholder="请输入采购员电话"/>
      <Button type="warning" class="w90 mr10" @click="search">
        <span class="center">
          <Icon custom="iconfont iconchaxunicon icons"/>查询
        </span>
      </Button>
      <Button class="mr10" @click="addLimit" v-has="'applyCredit'">
        <span class="center">申请信用额度</span>
      </Button>
      <Button class="mr10" @click="opensurveyShow" v-show="this.state == 0" v-has="'credit'">
        <span class="center">申请信用调查</span>
      </Button>
      <Button
        class="mr10"
        v-has="'credit'"
        v-show="this.state == 1 && (this.researchStatus == 2||this.researchStatus == 4)"
        @click="opensurveyShow"
      >
        <span class="center">修改信用调查</span>
      </Button>
      <Button
        class="mr10"
        @click="openAdjustment"
        v-has="'change'"
      >
        <span class="center">额度调整</span>
      </Button>
      <Button
        class="mr10"
        @click="openImportXLS"
        v-has="'allChange'"
      >
        <span class="center">额度批量调整</span>
      </Button>
    </div>
    <div class="customerCredit-title">
      <div style="width: 3000px;padding-right: 10px">
        <Table
          highlight-row
          size="small"
          :loading="Loading"
          border
          :columns="columns"
          :data="creditList"
          @on-row-click="selection"
          height="350"
        ></Table>
      </div>
    </div>
    <Page
      class="mr10"
      :total="page.total"
      :page-size="page.size"
      :current="page.num"
      show-sizer
      show-total
      class-name="page-con"
      @on-change="selectNum"
      @on-page-size-change="selectPage"
    ></Page>
    <div class="record">
      <span class="creditRecord">客户信用额度记录</span>
      <div class="creditTitle">
        <Row :gutter="10">
          <Col span="12" style="padding-top: 10px">
            <div style="margin-bottom: 10px">客户信用额度记录表</div>
            <div style="overflow: auto">
              <Table
                :columns="columns1"
                border
                highlight-row
                stripe
                size="small"
                height="200"
                :data="creditArr"
              ></Table>
            </div>
          </Col>
          <Col span="12" style="padding-top: 10px">
            <div style="margin-bottom: 10px">客户信息变更记录表</div>
            <div style="overflow: auto">
              <Table
                :columns="columns2"
                highlight-row
                border
                stripe
                size="small"
                height="200"
                :data="alterArr"
              ></Table>
            </div>
          </Col>
        </Row>
      </div>
    </div>

    <!--      申请信用额度-->
    <Modal v-model="CreditLineApplicationShow" title="申请信用额度" width="1100">
      <CreditLineApplication
        ref="child"
        :data="creaditList"
        :sendMsg="applicationArr"
        :localTime="date12"
        :payable="payable"
        :quality="quality"
      ></CreditLineApplication>
      <div slot="footer">
        <Button type="primary" @click="Determined">确定</Button>
        <Button type="default" @click="cancel2">取消</Button>
      </div>
    </Modal>
    <!--      申请信用调查-->
    <div class="credit">
      <Modal v-model="surveyShow" title="信用调查表" width="1000" style="top: 50px!important;">
        <SurveyList :data="creaditList" :dataMsg="costList" ref="SurveyList"></SurveyList>
        <div slot="footer">
          <Button type="primary" @click="confirm">确定</Button>
          <Button type="default" @click="cancel">取消</Button>
        </div>
      </Modal>
    </div>
    <!--      修改信用调查-->
    <Modal v-model="surveyShow" title="信用调查表" width="1000">
      <SurveyList :data="creaditList" :dataMsg="costList" :dataJudge="creditArr" ref="SurveyList"></SurveyList>
      <div slot="footer">
        <Button type="primary" @click="confirm">确定</Button>
        <Button type="default" @click="cancel">取消</Button>
      </div>
    </Modal>
    <!--      额度调整-->
    <Modal v-model="adjustment" title="客户信用额度调整表">
      <QuotaAdjustment
        :data="creaditList"
        :dataMsg="adjustmentMsg"
        :datetoday="today"
        ref="formRule"
      ></QuotaAdjustment>
      <div slot="footer">
        <Button type="primary" @click="adjustmentconfirm">确定</Button>
        <Button type="default" @click="cancelChange">取消</Button>
      </div>
    </Modal>
    <!-- 申请额度批量调整 -->
    <importXLS :URL="impirtUrl" ref="imp" @getNewList="getNew"></importXLS>
  </div>
</template>

<script>
  import CreditLineApplication from "./CreditLineApplication";
  import QuotaAdjustment from "./QuotaAdjustment";
  import SurveyList from "./SurveyList";
  import importXLS from "@/view/settlementManagement/components/importXLS"
  import {
    queryCreditList,
    guestCreditHistory,
    saveOrUpdate,
    adjustment,
    save,
    guestAdjust
  } from "../../../../api/system/CustomerManagement/CustomerManagement";
  import {getDigitalDictionary, impUrl} from "@/api/system/essentialData/clientManagement";
  import * as tools from "../../../../utils/tools";
  import moment from "moment";
  import {showLoading, hideLoading} from "../../../../utils/loading";

  export default {
    name: "clientCredit",
    components: {
      CreditLineApplication,
      SurveyList,
      QuotaAdjustment,
      importXLS
    },
    data() {
      return {
        date12: "",
        creditArr: [],
        alterArr: [],
        Name: "", //客户名称
        salesman: "", //授权业务员
        telephone: "", //业务员电话
        creditList: [],
        Loading: true,
        columns: [
          {
            title: "序号",
            type: "index",
            align: "center",
            key: ""
          },
          {
            title: "基本信息",
            align: "center",
            key: "",
            children: [
              {
                title: "是否客户调查",
                align: "center",
                key: "isGuestResearch",
                render: (h, params) => {
                  let state = params.row.isGuestResearch;
                  let zi = "";
                  let jsonStatus = JSON.parse(params.row.researchStatus)
                  jsonStatus.value == 2 ? (state == 0 ? zi = "否" : zi = "是") : (jsonStatus.value == 1 ? zi = "审批中" : (jsonStatus.value == 4 ? zi = "审批拒绝" : (state == 0 ? zi = "否" : zi = "是")))
                  return h("span", zi);
                }
              },
              {
                title: "客户名称",
                align: "center",
                key: "fullName"
              },
              {
                title: "信用额度",
                align: "center",
                key: "creditLimit",
                render: (h, params) => {
                  let state = params.row.creditLimit + params.row.tempCreditLimit;
                  return h("span", state);
                }
              },
              {
                title: "客户分类",
                align: "center",
                key: "guestTypeName"
              },
              {
                title: "注册号",
                align: "center",
                key: "bizLicenseNo"
              },
              {
                title: "法定人",
                align: "center",
                key: "legalPerson"
              },
              {
                title: "负责人电话",
                align: "center",
                key: "chargeManTel"
              },
              {
                title: "注册地址",
                align: "center",
                key: "registAddress"
              },
              {
                title: "经营地址",
                align: "center",
                key: "shopAddress"
              },
              {
                title: "注册资本(万)",
                align: "center",
                key: "registMoney"
              },
              {
                title: "授权采购员",
                align: "center",
                key: "salesman"
              },
              {
                title: "采购员电话",
                align: "center",
                key: "salesmanTel"
              }
            ]
          },
          {
            title: "业务信息",
            align: "center",
            children: [
              {
                title: "回款方式",
                align: "center",
                key: "cashModeName"
              },
              {
                title: "对账日期",
                align: "center",
                key: "accountDate"
              },
              {
                title: "信用级别",
                align: "center",
                key: "tgradeName"
              },
              {
                title: "信用积分",
                align: "center",
                key: "guestIntegrals"
              },
              {
                title: "备注",
                align: "center",
                key: "remark"
              }
            ]
          },
          {
            title: "审核信息",
            align: "center",
            children: [
              {
                title: "制单人",
                align: "center",
                key: "createUname"
              },
              {
                title: "制单日期",
                align: "center",
                key: "createTime"
              },
              {
                title: "审核人",
                align: "center",
                key: "auditor"
              },
              {
                title: "审核日期",
                align: "center",
                key: "auditDate"
              }
            ]
          },
          {
            title: "修改信息",
            align: "center",
            children: [
              {
                title: "修改人",
                align: "center",
                key: "updateUname"
              },
              {
                title: "修改日期",
                align: "center",
                key: "updateTime"
              }
            ]
          }
        ],
        columns1: [
          {
            title: "序号",
            type: "index",
            align: "center",
            width: "60"
          },
          {
            title: "申请额度原因",
            align: "center",
            key: "quotaReason",
          },
          {
            title: "申请增加额度合计",
            align: "center",
            key: "addTotalQuota",
          },
          {
            title: "调整后总额度",
            align: "center",
            key: "totalQuota"
          },
          {
            title: "调整后剩余余额",
            align: "center",
            key: "afterAdjustQuota"
          },
          {
            title: "申请类型",
            align: "center",
            key: "adjustType",
            render: (h, p) => {
              let adjustType = p.row.adjustType;
              return h('span', adjustType === 1 ? "额度调整" : "额度申请");
            }
          },
          {
            title: "申请人",
            align: "center",
            key: "applyMan"
          },
          {
            title: "申请时间",
            align: "center",
            key: "applyDate"
          },
          {
            title: "审核人",
            align: "center",
            key: "auditor"
          },
          {
            title: "审核日期",
            align: "center",
            key: "auditDate"
          }
        ],
        columns2: [
          {
            title: "序号",
            type: "index",
            align: "center"
          },
          {
            title: "调整原因",
            align: "center",
            key: "adjustReason"
          },
          {
            title: "申请人",
            align: "center",
            key: "applyMan"
          },
          {
            title: "申请日期",
            align: "center",
            key: "applyDate"
          },
          {
            title: "审核人",
            align: "center",
            key: "auditor"
          },
          {
            title: "审核日期",
            align: "center",
            key: "auditDate"
          }
        ],
        page: {
          size: 10,
          num: 1,
          total: 0
        },
        CreditLineApplicationShow: false, //申请信用额度
        surveyShow: false, //申请信用调查
        adjustment: false, //额度调整
        creaditList: {},
        surveyAllList: [],
        adjustmentOne: {}, //额度调整信息
        impirtUrl: {
          downId: '2400000000',
          upUrl: impUrl
        },//下载上传路径
        ID: "", //保存当前行id
        state: -1, //保存当前行的客户调查状态
        Limitstate: "", //保存当前的额度状态
        rowMessage: {}, //当前的客户信息
        costList: "", //数据字典数据
        researchStatus: "", //保存当前的申请状态
        adjustmentMsg: "", //给子组件的调整信息
        today: "", //发送子组件的当前日期
        applicationArr: [], //申请信用额度的传给子组件的数组
        payable: "", //传给子组件的应收应付
        quality: "", //某个值
        total: "", //调整后剩余额度
        totalSuma: "",
        flag: "",
        editTopItemId: ""//记录操作的是第几条数据
      };
    },
    methods: {
      // totalSum(suma){
      //   console.log(suma)
      //   this.totalSuma = suma
      // },
      // total(sum) {
      //   // console.log(sum)
      //   this.total = sum
      // },
      // @total="total" @totalSum="totalSum"
      //搜索
      search() {
        this.page.num = 1;
        this.getListTop();
      },
      selectNum(p) {
        this.page.num = p;
        this.getListTop();
      },
      //当前行
      selection(row) {
        if (!row) {
          return
        }
        // console.log(row)
        this.editTopItemId = row.id
        this.rowMessage = row;
        this.state = row.isGuestResearch;
        this.ID = row.guestId;
        this.Limitstate = row.auditSign ? JSON.parse(row.auditSign).value : "";
        this.creaditList = row;
        // this.creaditList.tempEnd = new Date(row.tempEnd)
        // this.creaditList.tempStart = new Date(row.tempStart)
        this.creaditList.rollingDate = this.creaditList.rollingDate || 1;
        this.creaditList.applyTrustMoney = this.creaditList.applyTrustMoney || 1;
        this.creaditList.operationStart = new Date(this.creaditList.operationStart)
        this.creaditList.operationEnd = new Date(this.creaditList.operationEnd)
        this.creaditList.registerDate = new Date(this.creaditList.registerDate)
        this.flag = row.isGuestResearch;
        // this.creaditList.nature = this.costList.CS00117[0].id;
        this.researchStatus = row.researchStatus
          ? JSON.parse(row.researchStatus).value
          : "";
        this.credit();
      },
      selectPage(size) {
        this.page.num = 1;
        this.page.size = size;
        this.getListTop();
      },
      //申请信用额度
      addLimit() {
        if (this.ID) {
          if (this.Limitstate && this.Limitstate === 1) {
            this.$Message.warning("正在审批中，请等待审批完成！");
            return
          }
          if (this.Limitstate && this.Limitstate === 3) {
            this.$Message.warning("禁止额度申请中，请联系管理员!");
            return
          }
          let staVal=JSON.parse(this.creaditList.researchStatus).value
          if(this.creaditList.researchStatus && (staVal==1)){
            this.$Message.warning("该客户正在申请信用调查，不可申请信用额度");
            return
          }
          this.date12 = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
          this.CreditLineApplicationShow = true;
          // this.creaditList.tempStart='';
          // this.creaditList.tempEnd='';
          this.alertBox();
        } else {
          this.$Message.warning("请选择要申请的客户！");
        }
      },
      //申请信用调查
      opensurveyShow() {
        if (this.researchStatus === 1) {
          return this.$Message.warning("信用调查正在审批中");
        }
        let jsonStatus=JSON.parse(this.creaditList.researchStatus)
        if (this.creaditList.isGuestResearch === 0 && jsonStatus.value!=4) {
          this.$refs.SurveyList.$refs.formInline.resetFields();
        }
        this.creaditList.rollingDate = this.creaditList.rollingDate || 1;
        this.surveyShow = true;
      },
      //额度调用
      openAdjustment() {
        if (this.Limitstate && this.Limitstate === 1) {
          this.$Message.warning("信用额度审批中，请等待审批完成！");
          return
        }
        if (Object.keys(this.rowMessage) == 0) return this.$Message.error('请至少选择一条信息')
        this.adjustment = true;
        this.adjustmenttt();
      },
      //初始化top部分
      getListTop() {
        let params = {};
        params.page = this.page.num - 1;
        params.size = this.page.size;
        if (this.Name) {
          params.fullName = this.Name;
        }
        if (this.salesman) {
          params.salesman = this.salesman;
        }
        if (this.telephone) {
          params.salesmanTel = this.telephone;
        }

        queryCreditList(params).then(res => {
          this.Loading = false;
          if (res.code === 0) {
            this.creditList = res.data.content || [];
            this.page.total = res.data.totalElements;
            for (let b of this.creditList) {
              b._highlight = false;
              if (b.id == this.editTopItemId) {
                b._highlight = true;
                this.selection(b);
                break;
              }
            }
          }
        });
      },
      //信誉额度记录表
      credit() {
        let data = {};
        data.guestId = this.ID;
        guestCreditHistory(data).then(res => {
          if (res.code === 0) {
            this.creditArr = res.data.guestAdjustVOList || [];
            this.alterArr = res.data.changeVOList || [];
          }
        });
      },
      //数据字典
      async information() {
        let data = {};
        data = ["CS00106", "CS00118", "CS00117"];
        let res = await getDigitalDictionary(data);
        if (res.code === 0) {
          this.costList = res.data;
        }
      },
      // 信用等级
      async informationTwo() {
        let data = {};
        data = ["CS00112"];
        let res = await getDigitalDictionary(data);
        if (res.code === 0) {
          this.quality = res.data.CS00112;
        }
      },
      //确定按钮
      confirm() {
        this.$refs["SurveyList"].$refs["formInline"].validate(valid => {
          if (valid) {
            showLoading()
            let data = JSON.parse(JSON.stringify(this.creaditList));
            if (this.creaditList.registerDate) {
              data.registerDate = tools.transTime(this.creaditList.registerDate);
            }
            if (this.creaditList.operationEnd) {
              data.operationEnd = tools.transTime(this.creaditList.operationEnd);
            }
            if (this.creaditList.operationStart) {
              data.operationStart = tools.transTime(this.creaditList.operationStart);
            }
            if (this.creaditList.tempStart) {
              data.tempStart = tools.transTime(this.creaditList.tempStart);
            }
            if (this.creaditList.tempEnd) {
              data.tempEnd = tools.transTime(this.creaditList.tempEnd);
            }
            data.guestId = this.ID;
            saveOrUpdate(data).then(res => {
              if (res.code === 0) {
                this.getListTop();
                this.surveyShow = false;
                this.$Message.warning("成功！");
              }
              hideLoading()
            }).catch(err=>{
              hideLoading()
            })
          } else {
            this.$message.warning("* 为必填！");
          }
        });
      },
      //取消a按钮
      cancel() {
        this.surveyShow = false;
      },
      //调整额度的接口
      adjustmenttt() {
        let params = {};
        params.guestId = this.rowMessage.guestId;
        // params.orgId = this.rowMessage.orgid;
        adjustment(params).then(res => {
          if (res.code === 0) {
            this.adjustmentMsg = res.data;
          }
        });
      },
      //打开导入模板下载
      openImportXLS() {
        this.$refs.imp.openModal()
      },
      // 额度批量调整
      getNew(data) {
        this.$Message.warning("保存成功");
        this.getListTop();
      },
      //调整信用额度的确定
      adjustmentconfirm() {
        this.$refs["formRule"].$refs["formRule"].validate(valid => {
          if (valid) {
            showLoading()
            this.creaditList.operationStart = moment(this.creaditList.operationStart).format("YYYY-MM-DD")
            this.creaditList.operationEnd = moment(this.creaditList.operationEnd).format("YYYY-MM-DD")
            this.creaditList.registerDate = moment(this.creaditList.registerDate).format("YYYY-MM-DD")
            let data = {};
            data.guestId = this.creaditList.guestId;
            // data.applyDate = this.today
            data.payableAmt = this.adjustmentMsg.payableAmt;
            data.receivableAmt = this.adjustmentMsg.receivableAmt;
            data.sumAmt = this.adjustmentMsg.sumAmt;
            data.thirtyAmt = this.adjustmentMsg.thirtyAmt;
            data.sixtyAmt = this.adjustmentMsg.sixtyAmt;
            data.moreSixtyAmt = this.adjustmentMsg.moreSixtyAmt;
            data.fixationQuotaTotal = this.creaditList.fixationQuotaTotal;
            data.isForbid = this.adjustmentMsg.isForbid;
            data.quotaReason = this.creaditList.quotaReason;
            data.totalQuota =
              +this.creaditList.creditLimit + this.creaditList.tempCreditLimit;
            data.beforeAdjustTempQuota = this.creaditList.tempCreditLimit;
            data.tempQuotaTotal = this.creaditList.tempCreditLimit;
            data.tempStart = tools.transTime(this.creaditList.tempStart);
            data.tempEnd = tools.transTime(this.creaditList.tempEnd);
            if (data.tempEnd) {
              data.tempEnd = data.tempEnd.split(" ")[0] + ' 23:59:59'
            }
            data.orgId = this.creaditList.orgid;
            data.adjustType = 1;
            data.afterAdjustQuota =
              this.adjustmentMsg.payableAmt -
              this.adjustmentMsg.fixationQuotaTotal;
            save(data).then(res => {
              if (res.code === 0) {
                this.adjustment = false;
                this.$Message.warning("保存成功");
                this.getListTop();
              }
              hideLoading()
            }).catch(err=>{
              hideLoading()
            })
          } else {
            this.$message.warning("* 为必填！");
          }
        });
      },
      //调整取消框
      cancelChange() {
        this.adjustment = false;
      },
      //子组件的参数
      getMsg(msg) {
        // this.today = a
      },
      //申请信用额度弹框
      alertBox() {
        let dataa = {};
        dataa.guestId = this.rowMessage.guestId;
        dataa.orgId = this.rowMessage.orgid;
        guestAdjust(dataa).then(res => {
          if (res.code === 0) {
            this.applicationArr = res.data;
            this.payable = res.data.payable || {};
            this.$refs.child.init();
          }
        });
      },
      //确定申请
      Determined() {
        if (this.$refs.child.data.tempQuota) {
          this.$refs.child.ruls.quotaReason = [
            {required: true, message: "申请额度说明必填！", trigger: "blur"}
          ];
          this.$refs.child.ruls.tempStart = [
            {required: true, type: 'date', message: "临时额度开始时间", trigger: "blur"}
          ];
          this.$refs.child.ruls.tempEnd = [
            {required: true, type: 'date', message: "临时额度结束时间", trigger: "blur"}
          ];
        } else {
          this.$refs.child.ruls.quotaReason = [
            {required: true, message: "申请额度说明必填！", trigger: "blur"}
          ];
          this.$refs.child.ruls.tempStart = [
            {required: false}
          ];
          this.$refs.child.ruls.tempEnd = [
            {required: false}
          ];
        }
        this.$refs.child.$refs.form.validate(valid => {
          if (valid) {
            if (this.$refs.child.data.applyQuota && this.flag == 0) {
              this.$Message.error("请先完成信用调查");
              return;
            }
            if (Number(this.$refs.child.data.tempQuota) > 5000) {
              if (this.flag == 0) {
                this.$Message.error("请先完成信用调查");
              } else {
                this.confirmFn();
              }
            } else {
              this.confirmFn();
            }
          } else {
            this.$Message.error("必填项必须填!");
          }
        });
      },
      //确定取消
      cancel2() {
        this.CreditLineApplicationShow = false;
      },
      confirmFn() {
        showLoading()
        let data = {};
        data.guestId = this.rowMessage.guestId;
        data.orgId = this.rowMessage.orgid;
        this.creaditList.applyQuota = this.creaditList.applyQuota
          ? this.creaditList.applyQuota
          : 0;
        this.creaditList.tempQuota = this.creaditList.tempQuota
          ? this.creaditList.tempQuota
          : 0;
        data.fixationQuotaTotal =
          this.creaditList.applyQuota * 1 + this.creaditList.creditLimit * 1 ||
          0 + this.creaditList.applyQuota * 1;
        data.tempQuotaTotal =
          this.creaditList.tempQuota * 1 + this.creaditList.tempCreditLimit * 1 ||
          0 + this.creaditList.tempQuota * 1;
        data.applyQuota = this.creaditList.applyQuota || 0;
        data.tempQuota = this.creaditList.tempQuota || 0;
        //如果临时额度大于零，添加开始结束时间参数
        if (data.tempQuota > 0) {
          data.tempStart = tools.transTime(this.creaditList.tempStart);
          data.tempEnd = tools.transTime(this.creaditList.tempEnd) ? tools.transTime(this.creaditList.tempEnd).split(" ")[0] + ' 23:59:59' : "";
        }
        data.payableAmt = +this.payable.payableAmt || 0;
        data.tgrade = this.creaditList.tgrade || "";
        data.thirtyAmt = +this.payable.thirtyAmt || 0;
        data.sixtyAmt = +this.payable.sixtyAmt || 0;
        data.moreSixtyAmt = this.payable.moreSixtyAmt || 0;
        data.afterAdjustQuota = this.creaditList.totalSum;
        data.quotaReason = this.creaditList.quotaReason || "";
        data.receivableAmt = this.payable.receivableAmt || 0;
        data.totalQuota =
          +this.creaditList.applyQuota +
          this.creaditList.creditLimit +
          (+this.creaditList.tempQuota + this.creaditList.tempCreditLimit) ||
          +this.creaditList.applyQuota + +this.creaditList.tempQuota;
        data.addTotalQuota = this.creaditList.tototo || 0;
        data.adjustType = 0;
        //新加入字段
        data.beforeAdjustQuota = this.$refs.child.beforeAdjustQuota;
        data.afterAdjustQuota = this.$refs.child.afterAdjustQuota;
        data.afterAdjustQuota = this.$refs.child.afterAdjustQuota;
        data.sumAmt = this.payable.sumAmt || 0;
        data.preAmt = this.payable.preAmt;
        // console.log(data)
        // return
        save(data).then(res => {
          if (res.code === 0) {
            this.CreditLineApplicationShow = false;
            this.$Message.warning("保存成功");
            this.getListTop();
          }
          hideLoading()
        }).catch(err=>{
          hideLoading()
        })
      }
    },
    mounted() {
      this.getListTop();
      this.information();
      this.informationTwo();
      const ToDayStr = () => {
        var returnStr = "";
        var date = new Date(); //当前时间
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        //var hour = date.getHours();
        //var minutes = date.getMinutes();
        //var second = date.getSeconds();
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        returnStr = year + "-" + month + "-" + day;
        return returnStr;
      };
      this.today = ToDayStr();
    }
  };
</script>

<style scoped lang="less">
  .customerCredit-box {
    background-color: #fff;
    border: 1px solid #eee;
    height: 100%;
  }

  .customerCredit-header {
    line-height: 57px;
    padding: 0 20px;
    border-bottom: 1px solid #eee;
  }

  .customerCredit-title {
    padding: 10px;
    overflow: hidden;
    overflow-x: scroll;
  }

  .record {
    height: calc(~"100% - 560px");
    padding: 10px;
    position: relative;
    padding-top: 21px;
  }

  .creditRecord {
    line-height: 30px;
    border: 1px solid #eee;
    border-bottom: none;
    position: absolute;
    padding: 0 10px;
    background-color: #fff;
    top: -9px;
  }

  .creditTitle {
    height: 100%;
    width: 100%;
    border: 1px solid #eee;
    display: flex;
  }
</style>
