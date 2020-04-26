<template>
  <Modal title="因公借支核销" width="1000" footer-hide v-model="show">
    <Row>
      <Button :disabled="selectArr.length <= 0" @click="submit">保存</Button>
    </Row>
    <Row class="mt20">
      <vxe-table
        auto-resize
        resizable
        border
        highlight-hover-row
        highlight-current-row
        :data="tableData"
        align="center"
      >
        <vxe-table-column
          field="serviceId"
          title="费用报销申请单号"
        ></vxe-table-column>
        <vxe-table-column
          field="applicationTime"
          title="申请时间"
        ></vxe-table-column>
        <vxe-table-column field="applicant" title="申请人"></vxe-table-column>
        <vxe-table-column
          field="reimbursementAmount"
          title="费用报销总金额"
        ></vxe-table-column>
        <vxe-table-column
          field="totalPrice"
          title="因公借支总金额"
        ></vxe-table-column>
        <vxe-table-column field="" title="公司应付"></vxe-table-column>
        <vxe-table-column field="" title="个人应还"></vxe-table-column>
      </vxe-table>
    </Row>
    <Row class="mb20 mt20">
      <Col span="8">
        <button
          class="ivu-btn ivu-btn-default ml10"
          type="button"
          @click="selectPage"
        >
          <i class="iconfont iconchaxunicon"></i>
          <span>选择单据</span>
        </button>
      </Col>
    </Row>
    <Row>
      <vxe-table
        auto-resize
        resizable
        border
        highlight-hover-row
        highlight-current-row
        show-footer
        :footer-method="footerMethod"
        :data="selectArr"
        align="center"
        :edit-config="{ trigger: 'click', mode: 'cell' }"
      >
        <vxe-table-column title="操作">
          <template v-slot="{ row }">
            <vxe-button type="text" @click="del(row)">删除</vxe-button>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="serviceId"
          title="因公借支单号"
        ></vxe-table-column>
        <vxe-table-column field="payAmt" title="借支金额"></vxe-table-column>
        <vxe-table-column
          field="writeOffAmount"
          title="因公借支核销金额"
          :edit-render="{ name: 'input' }"
        >
          <template v-slot:edit="{ row }">
            <el-input-number
              :min="0"
              v-model="row.writeOffAmount"
              :controls="false"
              size="mini"
              :precision="2"
            />
          </template>
        </vxe-table-column>
        <vxe-table-column field="applyTime" title="借支日期"></vxe-table-column>
        <vxe-table-column field="summary" title="摘要"></vxe-table-column>
      </vxe-table>
    </Row>
    <Modal title="因公借支申请查询" width="600" v-model="showChild">
      <Row>
        <span>申请日期：</span>
        <Date-picker
          v-model="dates"
          type="daterange"
          placeholder="选择日期"
          class="w200"
        ></Date-picker>
        <Button @click="getQuery" class="ml10">
          <i class="iconfont iconchaxunicon"></i>
          <span>查询</span>
        </Button>
      </Row>
      <br />
      <Row>
        <vxe-table
          auto-resize
          resizable
          border
          highlight-hover-row
          highlight-current-row
          @checkbox-all="selectAllEvent"
          @checkbox-change="selectChangeEvent"
          :data="tbdataChild"
          align="center"
          ref="xTableChild"
        >
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column
            field="serviceId"
            title="因公借支单号"
          ></vxe-table-column>
          <vxe-table-column field="payAmt" title="借支金额"></vxe-table-column>
          <vxe-table-column
            field="applyTime"
            title="申请日期"
          ></vxe-table-column>
          <vxe-table-column field="applicant" title="申请人"></vxe-table-column>
          <vxe-table-column field="summary" title="摘要"></vxe-table-column>
        </vxe-table>
      </Row>
      <br />
      <div slot="footer">
        <Button type="primary" @click="ok">确认</Button>
        <Button @click="re">返回</Button>
      </div>
    </Modal>
    <!-- <Page
        class-name="mb10 mt10 fr"
        :current="page.num"
        :total="page.total"
        :page-size="page.size"
        :page-size-opts="page.opts"
        @on-change="changePage"
        @on-page-size-change="changeSize"
        show-elevator
        show-sizer
        show-total
      ></Page> -->
    <br />
  </Modal>
</template>

<script>
import * as api from "_api/settlementManagement/businessBorrowing";
import xeUtils from "xe-utils";
import moment from "moment";
export default {
  name: "writeOff",
  props: {
    table: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      show: false,
      showChild: false,
      dates: [],
      currRow: null,
      tbdataChild: [],
      totalPrice: 0,
      selectTmpArr: [],
      selectArr: [],
      page: {
        num: 1,
        size: 10,
        total: 0,
        opts: [20, 50, 100, 200]
      } //分页
    };
  },
  computed: {
    tableData() {
      return [{ ...this.table, totalPrice: this.totalPrice }];
    }
  },
  methods: {
    open() {
      this.show = true;
      this.init();
    },
    init() {
      this.page = {
        num: 1,
        size: 10,
        total: 0,
        opts: [20, 50, 100, 200]
      };
    },
    cancel() {
      this.show = false;
    },
    del(row) {
      this.selectArr.forEach((el, index, arr) => {
        if (el.id == row.id) {
          arr.splice(index, 1);
        }
      });
    },
    //分页
    changePage(p) {
      this.page.num = p;
    },
    changeSize(size) {
      this.page.num = 1;
      this.page.size = size;
    },
    selectPage() {
      this.showChild = true;
      this.getQuery();
    },
    getQuery() {
      let params = {
        size: 10000,
        page: 0
      };
      let data = {
        startTime: this.dates[0]
          ? moment(this.dates[0]).format("YYYY-MM-DD") + " 00:00:00"
          : "",
        endTime: this.dates[1]
          ? moment(this.dates[1]).format("YYYY-MM-DD") + " 23:59:59"
          : ""
        // serviceId: this.requestCode
        // guestId: this.companyId,
      };
      for (let d in data) {
        if (!data[d]) {
          delete data[d];
        }
      }
      api.findListPageAll(params, data).then(res => {
        if (res.code == 0) {
          this.tbdataChild = res.data.content;
          // this.page.total = res.data.totalElements;
        }
      });
    },
    selectAllEvent({ checked, records }) {
      this.selectTmpArr = records;
    },
    selectChangeEvent({ checked, records }) {
      this.selectTmpArr = records;
    },
    ok() {
      this.showChild = false;
      this.selectArr = this.selectTmpArr;
      this.selectTmpArr = [];
      this.totalPrice = this.selectArr.reduce((total, next) => {
        let price = parseFloat(next.payAmt);
        if (isNaN(price)) {
          price = 0;
        }
        total += price;
        return total;
      }, 0);
      this.totalPrice = this.totalPrice.toFixed(2);
    },
    re() {
      this.showChild = false;
      this.selectTmpArr = [];
      this.selectArr = [];
    },
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "合计";
          }
          if (["payAmt", "writeOffAmount"].includes(column.property)) {
            return xeUtils.sum(data, column.property);
          }
          return null;
        })
      ];
    },
    async submit() {
      let data = {
        sourceDto: {
          id: this.tableData[0].id,
          rpAmt: this.tableData[0].totalPrice,
        },
        wrtiteOffDtos: this.selectArr.map(el => { return {id: el.id} }),
      }

      let res = await api.orderWriteOff(data, 2)
      if (res.code == 0) {
        this.$message.success(res.data);
        this.$parent.getQuery();
        this.cancel();
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
