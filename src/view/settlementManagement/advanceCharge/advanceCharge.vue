<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <quickDate
              class="mr10"
              ref="quickDate"
              @quickDate="quickDate"
            ></quickDate>
          </div>
          <div class="db ml20">
            <span>对账期间：</span>
            <Date-picker
              v-model="value"
              type="daterange"
              placeholder="选择日期"
              class="w200"
            ></Date-picker>
          </div>
          <div class="db ml20">
            <span>分店名称：</span>
            <Select v-model="BranchstoreId" class="w150" filterable>
              <Option
                v-for="item in Branchstore"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </div>
          <div class="db ml20">
            <span>往来单位：</span>
            <Select v-model="companyId" class="w150" filterable>
              <Option
                v-for="item in company"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </div>
          <div class="db ml5">
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="query"
            >
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
        </div>
      </div>
      <div class="mt10 mb10">
        <Button class="ml10" @click="modal = true">预付款认领</Button>
        <Button class="ml10">预付款核销</Button>
        <Button class="ml10">预付款支出</Button>
        <Button class="ml10">预付款支出认领</Button>
        <Button class="ml10">预付款撤回</Button>
        <Button class="ml10">预付款核销撤回</Button>
        <Button class="ml10">预付款支出撤回</Button>
        <Button class="ml10">导出</Button>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <div class="box mb10">
          <vxe-table
            class="boxData"
            auto-resize
            resizable
            border
            highlight-hover-row
            highlight-current-row
            @current-change="currentChangeEvent"
            max-height="400"
            :data="tableData"
            align="center"
            show-footer
            :footer-method="footerMethod"
          >
            <vxe-table-column title="基本信息">
              <vxe-table-column
                title="序号"
                type="seq"
                width="60"
              ></vxe-table-column>
              <vxe-table-column
                field="serviceId"
                title="预付款单号"
              ></vxe-table-column>
              <vxe-table-column
                field="orderNo"
                title="预付款采购订单号"
              ></vxe-table-column>
              <vxe-table-column
                field="guestName"
                title="往来单位"
              ></vxe-table-column>
              <vxe-table-column
                field="applicant"
                title="申请人"
              ></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="金额信息">
              <vxe-table-column
                field="payAmt"
                title="预付款金额"
              ></vxe-table-column>
              <vxe-table-column
                field="paymentNo"
                title="预付款付款单号"
              ></vxe-table-column>
              <vxe-table-column
                field="claimAmt"
                title="预付款已认领金额"
              ></vxe-table-column>
              <vxe-table-column
                field="writeOffReceiptNo"
                title="预付款核销单号"
              ></vxe-table-column>
              <vxe-table-column
                field="writeOffAmt"
                title="预付款核销金额"
              ></vxe-table-column>
              <vxe-table-column
                field="returnNo"
                title="预付款收回单号"
              ></vxe-table-column>
              <vxe-table-column
                field="returnClaimAmt"
                title="预付款收回认领金额"
              ></vxe-table-column>
              <vxe-table-column
                field="remainingAmt"
                title="预付款余额"
              ></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="付款方式">
              <vxe-table-column field="role" title="账户">
                <template v-slot="{ row }">
                  <ul class="list">
                    <li
                      v-for="(item, index) of row.paymentType"
                      :key="index"
                      class="flex"
                    >
                      <span class="listChild">{{ item.account }}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="sex" title="金额">
                <template v-slot="{ row }">
                  <ul class="list">
                    <li
                      v-for="(item, index) of row.paymentType"
                      :key="index"
                      class="flex"
                    >
                      <span class="listChild">{{ item.amt }}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="age" title="付款所属门店">
                <template v-slot="{ row }">
                  <ul class="list">
                    <li
                      v-for="(item, index) of row.paymentType"
                      :key="index"
                      class="flex"
                    >
                      <span class="listChild">{{ item.ownStoreName }}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="收款方式">
              <vxe-table-column field="role" title="账户">
                <template v-slot="{ row }">
                  <ul class="list">
                    <li
                      v-for="(item, index) of row.receiveType"
                      :key="index"
                      class="flex"
                    >
                      <span class="listChild">{{ item.account }}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="sex" title="金额">
                <template v-slot="{ row }">
                  <ul class="list">
                    <li
                      v-for="(item, index) of row.receiveType"
                      :key="index"
                      class="flex"
                    >
                      <span class="listChild">{{ item.amt }}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
              <vxe-table-column field="age" title="收款所属门店">
                <template v-slot="{ row }">
                  <ul class="list">
                    <li
                      v-for="(item, index) of row.receiveType"
                      :key="index"
                      class="flex"
                    >
                      <span class="listChild">{{ item.ownStoreName }}</span>
                    </li>
                  </ul>
                </template>
              </vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="其他信息">
              <vxe-table-column field="payer" title="付款人"></vxe-table-column>
              <vxe-table-column
                field="paymentDate"
                title="付款日期"
              ></vxe-table-column>
              <vxe-table-column
                field="paymentRemark"
                title="付款备注"
              ></vxe-table-column>
              <vxe-table-column
                field="paymentAuditor"
                title="付款审核人"
              ></vxe-table-column>
              <vxe-table-column
                field="paymentAuditDate"
                title="付款审核日期"
              ></vxe-table-column>
              <vxe-table-column
                field="receiver"
                title="收款人"
              ></vxe-table-column>
              <vxe-table-column
                field="receiveDate"
                title="收款日期"
              ></vxe-table-column>
              <vxe-table-column
                field="receiveRemark"
                title="收款备注"
              ></vxe-table-column>
              <vxe-table-column
                field="receiveAuditor"
                title="收款审核人"
              ></vxe-table-column>
              <vxe-table-column
                field="receiveAuditDate"
                title="收款审核日期"
              ></vxe-table-column>
            </vxe-table-column>
          </vxe-table>
        </div>
        <div class="clearfix">
          <Page
            class-name="fr mb10"
            size="small"
            :current="page.num"
            :total="page.total"
            :page-size="page.size"
            @on-change="changePage"
            @on-page-size-change="changeSize"
            show-sizer
            show-total
          ></Page>
        </div>
        <Button>收付款单记录</Button>
        <Record ref="Record" :serviceId="serviceId" />
      </div>
    </section>
    <Modal v-model="modal" title="预收款认领" width="800">
      <span class="ml10">金额：</span>
      <InputNumber v-model="amt" class="w50" />
      <span class="ml10">对方户名：</span>
      <Input v-model="amt" class="w100" />
      <button
        class="ivu-btn ivu-btn-default ml10"
        type="button"
        @click="queryClaimed"
      >
        <i class="iconfont iconchaxunicon"></i>
        <span>查询</span>
      </button>
      <Button class="ml10">预收款认领</Button>
      <claim ref="claim" />
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import { getbayer } from "@/api/AlotManagement/threeSupplier";
import { getSupplierList } from "_api/purchasing/purchasePlan";
import * as api from "_api/settlementManagement/advanceCharge";
import { creat } from "../components";
import claim from "../components/claimed";
import Record from "../components/Record";
import moment from "moment";
import { mapActions } from "vuex";
export default {
  components: {
    quickDate,
    claim,
    Record
  },
  data() {
    return {
      amt: 0, //
      modal: false, //预收款弹框
      value: [], //日期
      company: [], //往来单位
      companyId: "", //往来单位
      Branchstore: [], //分店名称
      BranchstoreId: "", //分店名称
      tableData: [], //总表数据
      page: {
        num: 1,
        size: 10,
        total: 0,
        opts: [20, 50, 100, 200]
      },
      loading: false,
      currRow: null,
      serviceId: ""
    };
  },
  async mounted() {
    let arr = await creat(this.$refs.quickDate.val, this.$store);
    // this.value = arr[0];
    // this.BranchstoreId = arr[1];
    this.Branchstore = arr[2];
    this.getOne();
  },
  methods: {
    // 往来单位选择
    async getOne() {
      const res = await getSupplierList({});
      const res1 = await getbayer({});
      this.company = [];
      let data = [];
      let result = [];
      let obj = {};
      if (res.data.length !== 0 && res1.data.content.length !== 0) {
        data = [...res.data, ...res1.data.content];
      } else if (res.data.length !== 0) {
        data = res.data;
      } else if (res1.data.content.length !== 0) {
        data = res.data.content;
      }
      for (let i in data) {
        if (!obj[data[i].id]) {
          result.push(data[i]);
          obj[data[i].id] = 1;
        }
      }
      data = result;
      data.map(item => {
        this.company.push({
          label: item.fullName,
          value: item.id
        });
      });
    },
    // 快速查询
    quickDate(data) {
      this.value = data;
      this.getQuery();
    },
    //查询
    query() {
      this.getQuery();
    },
    //查询接口
    async getQuery() {
      let obj = {
        startTime: this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endTime: this.value[1]
          ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        orgId: this.BranchstoreId,
        guestId: this.companyId,
        size: this.page.size,
        page: this.page.num - 1
      };
      for (let key in obj) {
        if (!obj[key]) {
          Reflect.deleteProperty(obj, key);
        }
      }
      let res = await api.findPageByDynamicQuery(obj);
      if (res.code == 0) {
        this.tableData = res.data.content;
        this.page.total = res.data.totalElements;
      }
    },
    // 选中行
    currentChangeEvent({ row }) {
      this.currRow = row;
      this.serviceId = row.serviceId;
      this.$refs.Record.init();
    },
    // 表尾
    footerMethod({ columns, data }) {
      const sum = (arr, filed) => {
        return arr.reduce((total, next) => total + next[filed], 0);
      };
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex == 0) {
            return "合计";
          }
          switch (column.property) {
            case "payAmt":
              return sum(data, "payAmt");
            case "writeOffAmt":
              return sum(data, "writeOffAmt");
            case "returnClaimAmt":
              return sum(data, "returnClaimAmt");
            case "remainingAmt":
              return sum(data, "remainingAmt");
            default:
              return null;
          }
          return null;
        })
      ];
    },
    //分页
    changePage(p) {
      this.page.num = p;
      this.getQuery();
    },
    changeSize(size) {
      this.page.num = 1;
      this.page.size = size;
      this.getQuery();
    },
    // 预收款认领查询
    queryClaimed() {
      // this.claimed();
    }
  }
};
</script>
<style>
.box {
  overflow: auto;
}
.boxData {
  width: 2200px;
  /* overflow: auto; */
}
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.listChild {
  display: inline-block;
  border: 1px solid #e8eaec;
  flex: 1;
  padding: 5px;
}
.vxe-table .vxe-cell {
  padding: 0;
}
.vxe-table .vxe-body--column:not(.col--ellipsis) {
  padding: 0;
}
</style>
