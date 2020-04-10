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
            <span>申请状态：</span>
            <Select v-model="Reconciliationtype" class="w120" placeholder="全部">
              <Option
                v-for="item in Reconciliationlist"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
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
            <button class="ivu-btn ivu-btn-default ml15" type="button" @click="TheApplication">起草申请</button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <vxe-table
        border
        resizable
        ref="xTable"
        show-footer
        :footer-method="addFooter"
        stripe
        size="mini"
        align="center"
        :auto-resize="true"
        highlight-hover-row
        highlight-current-row
        show-overflow
        :data="tableData">
        <vxe-table-column title="操作">
          <template v-slot="{ row }">
            <template>
              <vxe-button>编辑</vxe-button>
              <vxe-button>查看</vxe-button>
              <vxe-button>删除</vxe-button>
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
  </div>
</template>

<script>
  import moment from "moment";
  import quickDate from "@/components/getDate/dateget_bill.vue";

    export default {
        name: "myApplication",
        components: {
          quickDate,
        },
      data(){
        return {
          value: [], //日期控件的数组
          Reconciliationtype: "9999", //申请状态
          Reconciliationlist: [
            {
              value: "9999",
              label: "全部"
            },
            {
              value: "1",
              label: "草稿"
            },
            {
              value: "2",
              label: "审批中"
            },
            {
              value: "3",
              label: "审批通过"
            },
            {
              value: "4",
              label: "审批不通过"
            }
          ], //申请状态数组
          ApplicationType: "9999", //申请类型
          ApplicationTypelist: [
            {
              value: "9999",
              label: "全部"
            },
            {
              value: "1",
              label: "对账单申请"
            },
          ], //申请类型数组
          tableData:[], //表格内容
          falg: false, //判断审批进度是否显示
          statusData: [
            { name: "提交", status: "已提交" },
            { name: "产品总监审批", status: "已审批" }
          ], //进度数据
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
        // 查询按钮
        query(){},
        //起草申请
        TheApplication(){
          this.$router.push({name: "documentApproval-draftingOfApplication"})
        },
        //vxe表格计算和值
        addFooter ({ columns, data }) {
          return [
            columns.map((column, columnIndex) => {
              if (columnIndex === 0) {
                return '合计 :'
              }
              // if (['debitAmount'].includes(column.property)) {
              //   return this.$utils.sum(data, column.property)
              // }
              // if (["lenderAmount"].includes(column.property)) {
              //   return this.$utils.sum(data, column.property)
              // }
              return null
            })
          ]
        },
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

