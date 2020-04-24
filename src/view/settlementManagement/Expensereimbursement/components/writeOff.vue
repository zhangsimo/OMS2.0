<template>
  <Modal title="因公借支核销" width="1000" footer-hide v-model="show">
    <Row>
      <Button :disabled="disabled" @click="submit">保存</Button>
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
        <vxe-table-column field="applyTime" title="申请时间"></vxe-table-column>
        <vxe-table-column field="applicant" title="申请人"></vxe-table-column>
        <vxe-table-column field="payAmt" title="费用报销总金额"></vxe-table-column>
        <vxe-table-column field="totalPrice" title="因公借支总金额"></vxe-table-column>
        <vxe-table-column field="totalPrice" title="公司应付"></vxe-table-column>
        <vxe-table-column field="totalPrice" title="个人应还"></vxe-table-column>
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
        :data="tbdata"
        align="center"
      >
        <vxe-table-column title="操作">
          <template v-slot="{ row }">
            <vxe-button type="text" icon="fa fa-edit" @click="del(row)">删除</vxe-button>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="serviceId"
          title="因公借支单号"
        ></vxe-table-column>
        <vxe-table-column field="applyTime" title="借支金额"></vxe-table-column>
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
              size="medium"
              :precision="2"
            />
          </template>
        </vxe-table-column>
        <vxe-table-column field="applyTime" title="借支日期"></vxe-table-column>
        <vxe-table-column field="applyTime" title="摘要"></vxe-table-column>
      </vxe-table>
    </Row>
    <Modal title="因公借支申请查询" width="600" footer-hide v-model="showChild">
      <Row>
        <span>申请日期：</span>
        <Date-picker
          v-model="dates"
          type="daterange"
          placeholder="选择日期"
          class="w200"
        ></Date-picker>
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
        <vxe-table-column field="applicationTime" title="借支金额"></vxe-table-column>
        <vxe-table-column field="applicationTime" title="申请日期"></vxe-table-column>
        <vxe-table-column field="applicationTime" title="申请人"></vxe-table-column>
        <vxe-table-column field="applicationTime" title="摘要"></vxe-table-column>
      </vxe-table>
      </Row>
      <br />
      <Row>
        <div slot="footer">
          <Button type="primary">确认</Button>
          <Button>返回</Button>
        </div>
      </Row>
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
  </Modal>
</template>

<script>
import * as api from "_api/settlementManagement/businessBorrowing";
import moment from "moment";
export default {
  name: "writeOff",
  props: {
    table: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      show: false,
      showChild: false,
      dates: [],
      disabled: true,
      currRow: null,
      tbdata: [],
      tbdataChild: [],
      totalPrice: 0,
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
      return [{...this.table, totalPrice: this.totalPrice}]
    },
  },
  methods: {
    open() {
      this.show = true;
      this.init();
    },
    init() {
      this.disabled = true;
      this.page = {
        num: 1,
        size: 10,
        total: 0,
        opts: [20, 50, 100, 200]
      }
    },
    cancel() {
      this.show = false;
    },
    del(row) {}, 
    //分页
    changePage(p) {
      this.page.num = p;
    },
    changeSize(size) {
      this.page.num = 1;
      this.page.size = size;
    },
    async selectPage() {
      this.showChild = true;
    },
    selectAllEvent({ checked, records }) {
    },
    selectChangeEvent({ checked, records }) {
    },
    async submit() {
    },
  }
};
</script>

<style lang="scss" scoped></style>
