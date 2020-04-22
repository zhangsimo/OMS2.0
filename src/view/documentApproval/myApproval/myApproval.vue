<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <quickDate class="mr10" ref="quickDate" @quickDate="quickDate"></quickDate>
          </div>
          <div class="db ml20">
            <Date-picker
              format="yyyy-MM-dd"
              :value="value"
              @on-change="changedate"
              type="daterange"
              placeholder="选择日期"
              class="w200"
            ></Date-picker>
          </div>
          <div class="db ml20">
            <span>申请类型：</span>
            <Select v-model="ApplicationType" class="w120" placeholder="全部">
              <Option
                v-for="item in ApplicationTypelist"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db ml15">
            <button class="ivu-btn ivu-btn-default" type="button" @click="query">
              <i class="iconfont iconchaxunicon mr5"></i>
              <span>查询</span>
            </button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <vxe-table
        border
        resizable
        ref="xTable"
        stripe
        size="mini"
        align="center"
        :auto-resize="true"
        highlight-hover-row
        highlight-current-row
        show-overflow
        :height="500"
        :data="tableData">
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column title="操作">
          <template v-slot="{ row }">
            <template>
              <vxe-button @click="lookOver(row)"> 查 看 </vxe-button>
            </template>
          </template>
        </vxe-table-column>
        <vxe-table-column field="" title="当前状态"></vxe-table-column>
        <vxe-table-column field="" title="申请单号"></vxe-table-column>
        <vxe-table-column field="" title="申请时间"></vxe-table-column>
        <vxe-table-column field="" title="申请类型"></vxe-table-column>
        <vxe-table-column field="" title="主题"></vxe-table-column>
        <vxe-table-column field="" title="总金额"></vxe-table-column>
        <vxe-table-column field="" title="当前审批人"></vxe-table-column>
      </vxe-table>
      <Page
        :current="page.num"
        :total="page.total"
        :page-size="page.size"
        :page-size-opts="page.opts"
        @on-change="changePage"
        @on-page-size-change="changeSize"
        class="mt10 tr"
        show-elevator
        show-sizer
        show-total
      ></Page>
      <div class="db mt10" v-if="falg">
        <h4 class="p10 mb10" style="background-color:#f8f8f8">审批进度</h4>
        <section class="data-container">
          <div class="modal-data">
            <span class="data-name">流程节点:</span>
            <div class="data-value flex-center">
              <template v-for="(item,i) in statusData">
                <div class="status-box flex-center" :key="i">
                  <span class="status">{{item.userName}}</span>
                  <span class="arrow-box" v-if="i<statusData.length-1"></span>
                  <!--<span-->
                  <!--class="words"-->
                  <!--:class="{res:item.operationResult=='REFUSE'}"-->
                  <!--&gt;{{item.operationResult|status}}</span>-->
                </div>
              </template>
            </div>
          </div>
          <div class="modal-data">
            <span class="data-name">审批人:</span>
            <div class="data-value flex-center">
              <template v-for="(item,i) in statusData">
                <div class="status-box flex-center" :key="i">

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
          <div class="modal-data">
            <span class="data-name">审批时间:</span>
            <div class="data-value flex-center">
              <template v-for="(item,i) in statusData">
                <div class="status-box flex-center" :key="i">
                  <span class="date">{{item.date | date}}</span>
                </div>
              </template>
            </div>
          </div>
        </section>
      </div>
    </section>
    <!--<approval :approvalTit="approvalTit"></approval>-->
  </div>
</template>

<script>
  import moment from "moment";
  import quickDate from "@/components/getDate/dateget_bill.vue";
  import approval from '@/view/settlementManagement/bill/Popup/approval'

    export default {
        name: "myApproval",
      components: {
        quickDate,
        approval
      },
      data(){
        return {
          value: [], //日期控件的数组
          ApplicationType: "99", //申请类型
          ApplicationTypelist: [
            {
              value: "99",
              label: "全部"
            },
            {
              value: "0",
              label: "费用报销"
            },
            {
              value: "1",
              label: "预收款支出"
            },
            {
              value: "2",
              label: "请示申请"
            },
            {
              value: "3",
              label: "采购预付款"
            },
            {
              value: "4",
              label: "因公借支"
            },
            {
              value: "5",
              label: "内部资金调拨"
            },
            {
              value: "6",
              label: "其他付款"
            },
            {
              value: "7",
              label: "对账单"
            },
            {
              value: "8",
              label: "销售开票"
            },
            {
              value: "9",
              label: "不含税开票"
            },
            {
              value: "10",
              label: "发票对冲"
            },
          ], //申请类型数组
          tableData:[{status: 0}], //表格内容
          falg: false, //判断审批进度是否显示
          statusData: [
            // { name: "提交", status: "已提交" },
            // { name: "产品总监审批", status: "已审批" }
          ], //进度数据
          approvalTit:'流程节点',//审批流程
          page: {
            num: 1,
            size: 10,
            total: 0,
            opts: [20, 50, 100, 200]
          } //分页
        }
      },
      mounted(){},
      methods: {
        // 快速查询日期
        quickDate(data) {
          this.value = data;
          let obj = {
            startDate: this.value[0]
              ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
              : "",
            endDate: this.value[1]
              ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
              : "",
            orgId: this.model1,
            statementStatus: this.Reconciliationtype
          };
          // this.getAccountStatement(obj);
        },

        // 选择日期
        changedate(daterange) {
          this.value = daterange;
        },

        //初始化列表
        getList(){

        },

        // 查询按钮
        query(){},

        //查看按钮
        lookOver(row){},

        //分页
        changePage(p) {
          this.page.num = p;
        },
        changeSize(size) {
          this.page.num = 1;
          this.page.size = size;
        }
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
      }
    }
</script>

<style lang="less" scoped>
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
  .zZindex {
    z-index: 3000 !important;
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
  .hide1 {
    overflow-x: auto;
  }
</style>
