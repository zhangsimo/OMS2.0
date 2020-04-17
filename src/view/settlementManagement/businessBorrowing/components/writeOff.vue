<template>
  <Modal title="因公借支核销" width="1000" footer-hide v-model="show">
    <Row>
      <Button>因公借支核销</Button>
    </Row>
    <Row class="mt20">
      <vxe-table
        auto-resize
        resizable
        border
        highlight-hover-row
        highlight-current-row
        @current-change="currentChangeEvent"
        :data="tableData"
        align="center"
      >
        <vxe-table-column
          field="temp"
          title="因公借支申请单号"
        ></vxe-table-column>
        <vxe-table-column field="temp" title="申请时间"></vxe-table-column>
        <vxe-table-column field="temp" title="申请人"></vxe-table-column>
        <vxe-table-column field="temp" title="因公借支金额"></vxe-table-column>
        <vxe-table-column field="temp" title="报销金额"></vxe-table-column>
        <vxe-table-column
          field="temp"
          title="因公借支核销金额"
          :edit-render="{ name: 'input' }"
        >
          <template v-slot:edit="{ row }">
            <el-input-number
              :min="0"
              v-model="row.temp"
              :controls="false"
              size="medium"
              :precision="2"
            />
          </template>
        </vxe-table-column>
      </vxe-table>
    </Row>
    <Row class="mb20 mt20">
      <Col span="8">
        <span>日期：</span>
        <DatePicker
          type="date"
          placeholder="请选择日期"
          v-model="date"
        ></DatePicker>
      </Col>
      <Col span="8">
        <span>金额：</span>
        <el-input-number
          :min="0"
          v-model="price"
          :controls="false"
          size="mini"
          :precision="2"
        />
      </Col>
    </Row>
    <Row>
      <vxe-table
        auto-resize
        resizable
        border
        highlight-hover-row
        highlight-current-row
        @radio-change="radioChangeEventCost"
        :data="tbdata"
        align="center"
      >
        <vxe-table-column type="radio" title="选择"></vxe-table-column>
        <vxe-table-column type="seq" width="60"></vxe-table-column>
        <vxe-table-column
          field="temp"
          title="费用报销申请单号"
        ></vxe-table-column>
        <vxe-table-column field="temp" title="申请时间"></vxe-table-column>
        <vxe-table-column field="temp" title="申请人"></vxe-table-column>
        <vxe-table-column field="temp" title="报销金额"></vxe-table-column>
        <vxe-table-column field="temp" title="摘要"></vxe-table-column>
      </vxe-table>
      <Page
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
      ></Page>
    </Row>
  </Modal>
</template>

<script>
export default {
  name: "writeOff",
  props: {},
  data() {
    return {
      show: false,
      tableData: [],
      price: 0,
      date: null,
      tbdata: [],
      page: {
        num: 1,
        size: 10,
        total: 0,
        opts: [20, 50, 100, 200]
      } //分页
    };
  },
  methods: {
    open() {
      this.show = true;
    },
    cancel() {
      this.show = false;
    },
    currentChangeEvent({ row }) {},
    radioChangeEventCost({ row }) {},
    //分页
    changePage(p) {
      this.page.num = p;
    },
    changeSize(size) {
      this.page.num = 1;
      this.page.size = size;
    }
  }
};
</script>

<style lang="scss" scoped></style>
