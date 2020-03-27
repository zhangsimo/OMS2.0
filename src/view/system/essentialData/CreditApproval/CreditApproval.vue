<template>
  <div class="all-box">
    <div class="oper-top">
      <span class="ml10">快速查询：</span>
      <dateget class="mr10" @quickDate="quickDate"></dateget>
      <span class="mr10">申请日期：</span>
      <Date-picker
        type="daterange"
        class="w200 mr20"
        :options="options3"
        @on-change="dateChange"
        placeholder="请选择日期"
        @on-clear="dateList.startApplyTime='';dateList.endApplyTime=''"
      ></Date-picker>
      <Button type="warning" class="mr20" @click="serchCredit">
        <Icon custom="iconfont iconchaxunicon icons" />查询
      </Button>
      <Button type="default" class="mr10" @click="openDetail">
        <Icon custom="iconfont iconshenheicon icons" />查看明细
      </Button>
    </div>
    <div class="Credtitle">
      <Table
        height="400"
        @on-row-click="onRowClick"
        highlight-row
        border
        :columns="columns"
        :data="creditList"
        show-summary
        :summary-method="handleSummary"
      ></Table>
    </div>
    <div class="db mt10" v-if="flag">
      <h4 class="p10 mb10" style="background-color:#f8f8f8">审批进度</h4>
      <section class="data-container">
        <div class="modal-data">
          <span class="data-name">审批人:</span>
          <div class="data-value flex-center">
            <template v-for="(item,i) in statusData">
              <div class="status-box flex-center" :key="i">
                <span class="status">{{item.userName}}</span>
                <span class="arrow-box" v-if="i<statusData.length-1"></span>
              </div>
            </template>
          </div>
        </div>
        <div class="modal-data">
          <span class="data-name">审批状态:</span>
          <div class="data-value flex-center">
            <template v-for="(item,i) in statusData">
              <div class="status-box flex-center" :key="i">
                <span
                  class="words"
                  :class="{res:item.operationResult=='REFUSE'}"
                >{{item.operationResult|status}}</span>
              </div>
            </template>
          </div>
        </div>
        <div class="modal-data">
          <span class="data-name">审批日期:</span>
          <div class="data-value flex-center">
            <template v-for="(item,i) in statusData">
              <div class="status-box flex-center" :key="i">
                <span class="date">{{item.date | date}}</span>
              </div>
            </template>
          </div>
        </div>
        <div class="modal-data">
          <span class="data-name">审批意见:</span>
          <div class="data-value flex-center">
            <template v-for="(item,i) in statusData">
              <div class="status-box flex-center" :key="i">
                <span class="remark">{{item.remark}}</span>
              </div>
            </template>
          </div>
        </div>
      </section>
    </div>
    <!--信用额度查看-->
    <Modal v-model="CreditLineApplicationShow" title="客户信用额度表" width="900" :mask-closable="false">
      <CreditLineApplication
        ref="creditLineApplication"
        :data="creaditList"
        :customerIfo="customerIfo"
        :customerDetails="customerDetails"
        :sixMonthPerformance="sixMonthPerformance"
        :sellOrderList="sellOrderList"
      ></CreditLineApplication>
      <div slot="footer">
        <!-- <Button type='primary' >确定</Button> -->
        <Button type="default" @click="CreditLineApplicationShow = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import CreditLineApplication from "./CreditLineApplication";
import dateget from "../../../../components/getDate/dateget";
import "../../../../components/getDate/index";
import {
  getCreditApprovalTable,
  conditionalQuery,
  viewDetails,
  guestAdjust
} from "../../../../api/system/essentialData/creditApproval";
import { approvalStatus } from "_api/base/user";
export default {
  name: "CreditApproval",
  components: {
    CreditLineApplication,
    dateget
  },
  data() {
    return {
      statusData: [
        { name: "提交", status: "已提交" },
        { name: "产品总监审批", status: "已审批" }
      ],
      flag: false,
      options3: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        }
      },
      // 客户信息数据
      customerIfo: [],
      // 客户数据明细
      customerDetails: {},
      sixMonthPerformance: [],
      sellOrderList: [],
      // 申请日期数据
      dateList: {
        startApplyTime: "",
        endApplyTime: "",
        startTime: "",
        endTime: ""
      },
      dateArray: [],
      // 快速查询数据
      quickList: {
        startTime: "",
        endTime: ""
      },
      quickArray: [],
      searchType1: "",
      // 表格数据
      columns: [
        {
          title: "序号",
          type: "index",
          width: 70,
          align: "center"
          // render: (h, params) => {
          //     return h('span',{class:'table-radio'})
          // }
        },
        {
          title: "业务单号",
          align: "center",
          key: "serviceId"
        },
        {
          title: "单据状态",
          align: "center",
          key: "auditSign",
          Width: 40,
          render: (h, params) => {
            // console.log(params)
            let JsonString = params.row.auditSign;
            let auditsign = JSON.parse(JsonString);
            // console.log(auditsign)
            if (auditsign === null) {
              return h("span", {}, "");
            } else {
              return h("span", {}, auditsign.name);
            }
          }
        },
        {
          title: "主题",
          align: "center",
          key: "quotaReason"
          // render:(h ,params)=>{
          //     let text = params.row.gender == 0 ? '男' : '女'
          //     return h('span' ,{}, text)
          // }
        },
        {
          title: "客户名称",
          align: "center",
          key: "guestName"
          // render: (h, params) => {
          //     return h('span', {}, transTime(params.row.birthDay))
          // },
        },
        {
          title: "客户编码",
          align: "center",
          key: "guestCode"
        },
        {
          title: "当前额度",
          align: "center",
          key: "applyQuota"
          // render:(h , params) => {
          //     let text = params.row.openSystem ? '是':'否'
          //     return h('span' , {} ,text)
          // }
        },
        {
          title: "申请时间",
          align: "center",
          key: "applyDate"
          // render:(h ,params) => {
          //     let text = params.row.office ? '是' : '否'
          //     return h('span' ,{} ,text)
          // }
        },
        {
          title: "提交人",
          align: "center",
          key: "applyMan"
        }
      ],
      creditList: [],
      creditData: {
        guestId: "",
        adjustType: 0,
        orgId: ""
      },
      CreditLineApplicationShow: false,
      creaditList: {},
      // 步骤条数据
      stepsCurrent: 2,
      stepsStatus: "error"
    };
  },
  mounted() {
    this.getCredit();
  },
  filters: {
    date(value = 0) {
      let date = new Date(value).toLocaleDateString();
      let time = new Date(value).toLocaleTimeString();
      value = date.split("/").join("-") + " " + time.substr(2);
      return value;
    },
    status(value = "") {
      value = value.toLowerCase();
      switch (value) {
        case "none":
          value = "已提交";
          break;
        case "agree":
          value = "已同意";
          break;
        case "refuse":
          value = "已拒绝";
          break;
        case "redirected":
          value = "已转交";
          break;
      }
      return value;
    }
  },
  methods: {
    // 获取页面数据
    getCredit() {
      getCreditApprovalTable({adjustType:0}).then(res => {
        if (res.code === 0) {
          this.creditData = {}
          this.creditList = res.data;
        }
      });
    },
    // 根据条件查询数据
    serchCredit() {
      if (this.dateArray[0]) {
        this.dateList.startApplyTime = this.dateArray[0] + " " + "00:00:00";
        this.dateList.endApplyTime = this.dateArray[1] + " " + "23:59:59";
      } else {
        this.dateList.startTime = this.quickArray[0] || "";
        this.dateList.endTime = this.quickArray[1] || "";
      }
      this.dateList.adjustType = 0
      conditionalQuery(this.dateList).then(res => {
        if (res.code === 0) {
          this.creditData = {}
          this.creditList = res.data;
        }
      });
    },
    // 获取快速查询
    quickDate(item) {
      // console.log('777777',item)
      this.quickArray = item;
      this.serchCredit();
      // this.quickList.startTime = item[0]
      // this.quickList.endTime = item[1]
      // console.log(this.quickList.startTime,this.quickList.endTime)
    },
    // 获取日期
    dateChange(value) {
      this.dateArray = value;
    },
    handleSummary({ columns, data }) {
      // console.log(columns, data);
      const sums = {};
      columns.forEach((column, index) => {
        const key = column.key;
        if (key === "serviceId") {
          sums[key] = {
            key,
            value: data.length
          };
          return;
        }
        sums[key] = {
          key,
          value: ""
        };
      });

      return sums;
    },
    // 查看明细
    openDetail() {
      if (!this.creditData.id) {
        this.$Message.error("请选择一条数据");
      } else {
        this.CreditLineApplicationShow = true;
        viewDetails({id:this.creditData.id}).then(res => {
          if (res.code === 0) {
            console.log(res)
            this.creaditList = this.creditData
            this.customerIfo = res.data.guestAdjustVOList
            this.customerDetails = res.data.guestAdjustVO;
            this.sixMonthPerformance = res.data.sixMonthPerformance;
            this.sellOrderList = res.data.sellOrderList;
            this.$refs.creditLineApplication.init();
          }
        });
      }
    },
    // 单击表格行获取行数据
    onRowClick(value) {
      this.flag = true;
      this.creditData = value;
      approvalStatus({ instanceId: value.processInstanceId }).then(res => {
        if (res.code == "0") {
          this.statusData = res.data.operationRecords;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.all-box {
  background-color: #fff;
  .oper-top {
    line-height: 57px;
    border-bottom: 1px solid #eee;
  }
  .Credtitle {
    padding: 10px;
  }
  .flowImg {
    padding: 10px;
    // background-color: #EEDEE2;
    .flowImg-title {
      line-height: 35px;
      border-bottom: 1px solid #eee;
      padding: 0 10px;
      font-size: 18px;
      font-weight: bold;
    }
    .expand-row {
      margin-left: 20px;
      line-height: 50px;
    }
  }
  .flowTitle {
    line-height: 57px;
    // font-size: 24px;
    padding-left: 10px;
  }
  .flow {
    font-size: 14px;
    padding: 10px 0;
    overflow: hidden;
    .titlecenter {
      width: 120px;
      text-align: right;
      /*background-color: #000;*/
      .oneHeight {
        line-height: 50px;
      }
      .twoHeight {
        line-height: 30px;
      }
    }
  }
}
.pro span {
  display: inline-block;
  width: 100px;
  text-align: right;
}
.pro i {
  font-style: normal;
}
.pro input {
  border: 1px solid #dddddd;
  height: 28px;
}
.settlement {
  border: 1px solid #dddddd;
}
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.data-container {
  padding: 20px 10px;
  .modal-data {
    height: 34px;
    margin-bottom: 20px;
    line-height: 34px;
    .data-name {
      width: 70px;
      margin-right: 40px;
      float: left;
    }
    .data-value {
      float: left;
    }
  }
  .status-box {
    .status {
      width: 120px;
      height: 32px;
      border: 1px solid #0099ff;
      border-radius: 4px;
      line-height: 32px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .words {
      width: 120px;
      color: #00cc66;
      text-align: center;
      margin-left: 70px;
    }
    .date {
      width: 120px;
      text-align: center;
      margin-left: 70px;
      font-size: 12px;
    }
    .remark {
      width: 120px;
      text-align: center;
      margin-left: 70px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
    }
    &:first-child {
      .words {
        margin-left: 0;
      }
      .date {
        margin-left: 0;
      }
      .remark {
        margin-left: 0;
      }
    }
  }
  .arrow-box {
    width: 60px;
    height: 2px;
    position: relative;
    margin: 0 7px 4px 3px;
    background-color: #0099ff;
    &:after {
      content: "";
      width: 0;
      height: 0;
      border-right: 5px solid transparent;
      border-left: 5px solid #0099ff;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      position: absolute;
      top: -4px;
      right: -10px;
    }
  }
}
.res {
  color: #ff3600 !important;
}
</style>
