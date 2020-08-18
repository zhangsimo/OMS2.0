<template>
  <Modal title="因公借支核销" width="1000" footer-hide v-model="show">
    <Row>
      <Button :disabled="disabled" @click="submit">因公借支核销</Button>
    </Row>
    <Row class="mt20">
      <vxe-table
        auto-resize
        resizable
        border
        highlight-hover-row
        highlight-current-row
        height="150"
        size="mini"
        @current-change="currentChangeEvent"
        :data="tableData"
        align="center"
        :edit-config="{ trigger: 'click', mode: 'cell' }"
        :edit-rules="validRules"
        ref="tableXt"
      >
        <vxe-table-column
          field="serviceId"
          title="因公借支申请单号"
        ></vxe-table-column>
        <vxe-table-column field="applyTime" title="申请时间"></vxe-table-column>
        <vxe-table-column field="applicant" title="申请人"></vxe-table-column>
        <vxe-table-column field="paymentReturnBalance" title="因公借支金额"></vxe-table-column>
        <vxe-table-column field="totalPrice" title="报销金额"></vxe-table-column>
        <vxe-table-column
          field="writeOffAmount"
          title="因公借支核销金额"
          :edit-render="{ name: 'input' }"
        >
          <template v-slot:edit="{ row }">
            <el-input-number
              v-model="row.writeOffAmount"
              :controls="false"
              size="mini"
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
          type="daterange"
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
      <Col span="8">
        <button
        class="ivu-btn ivu-btn-default ml10"
        type="button"
        @click="query"
      >
        <i class="iconfont iconchaxunicon"></i>
        <span>查询</span>
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
        @radio-change="radioChangeEventCost"
        size="mini"
        :data="tbdata"
        align="center"
        ref="xTable1"
      >
        <vxe-table-column type="radio" title="选择"></vxe-table-column>
        <vxe-table-column type="seq" width="60"></vxe-table-column>
        <vxe-table-column
          field="serviceId"
          title="费用报销申请单号"
        ></vxe-table-column>
        <vxe-table-column field="applicationTime" title="申请时间"></vxe-table-column>
        <vxe-table-column field="applicant" title="申请人"></vxe-table-column>
        <vxe-table-column field="reimbursementAmount" title="报销金额"></vxe-table-column>
        <vxe-table-column field="paymentBalance" title="报销未核销余额"></vxe-table-column>
        <vxe-table-column field="summary" title="摘要"></vxe-table-column>
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
    const amtValid = ({ row, cellValue }) => {
      return new Promise((resolve, reject) => {
        if(cellValue&&cellValue>0){
          if(cellValue>row.totalPrice){
            reject(new Error("因公借支核销金额不能大于报销未核销余额"));

          }else {
            resolve();
          }
        }else{
          if(cellValue==0){
            reject(new Error("因公借支核销金额不能为0"));
          }else{
            reject(new Error("因公借支核销金额必填"));
          }
        }


        // row.paymentReturnBalance <= 0
        //   ? row.payAmt
        //   : row.paymentReturnBalance
        //
        // let max =
        //   this.tableData[0].paymentBalance < this.tableData[0].totalPrice ?  this.tableData[0].paymentBalance : this.tableData[0].totalPrice ;
        // if (cellValue > max) {
        //   reject(new Error(`因公借支核销金额不能大于借支金额${max}`));
        // } else {
        //   resolve(true);
        // }
      });
    };
    return {
      validRules: {
        maxWidth:100,
        writeOffAmount: [
          {  required: true,validator: amtValid } // message: "因公借支核销金额必填" ,
        ]
      },
      show: false,
      disabled: true,
      currRow: null,
      price: 0,
      date: [],
      tbdata: [],
      // tableData: [],
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
    max() {
      if(this.table) {
        return 0
      }
      return this.table.payAmt > this.table.totalPrice ? this.table.totalPrice : this.table.payAmt
    },
    tableData() {
      return [{...this.table, totalPrice: this.totalPrice}]
    },
  },
  methods: {
    open() {
      // this.tableData = [{...this.table, totalPrice: this.totalPrice}];
      this.show = true;
      this.init();
      this.query();
    },
    init() {
      this.date = [];
      this.price = 0;
      this.disabled = true;
      this.page = {
        num: 1,
        size: 20,
        total: 0,
        opts: [20, 50, 100, 200]
      }
    },
    cancel() {
      this.show = false;
    },
    currentChangeEvent({ row }) {},
    radioChangeEventCost({ row }) {
      this.disabled = false;
      this.currRow = row;
      this.totalPrice = row.paymentBalance;
      // this.tableData[0].totalPrice = this.totalPrice;
    },
    //分页
    changePage(p) {
      this.page.num = p;
      this.query();
    },
    changeSize(size) {
      this.page.num = 1;
      this.page.size = size;
      this.query();
    },
    async query() {
      this.totalPrice = 0;
      this.currRow = null;
      this.$refs.xTable1.clearRadioRow()

      let params = {
        page: this.page.num - 1,
        size: this.page.size,
      }
      let data = {
        writeOffStatus: 0,
        reimbursementAmount:1
      }

      if (this.date.length === 2 && this.date[0]) {
        data.startTime = moment(this.date[0]).format("YYYY-MM-DD") + " 00:00:00";
        data.endTime = moment(this.date[1]).format("YYYY-MM-DD") + " 23:59:59";
      }

      if (this.price > 0) {
        data.reimbursementAmount = this.price;
      }

      let res = await api.findByDynamicQuery(params, data);

      if(res.code == 0) {
        this.tbdata = res.data.content;
        this.page.total = res.data.totalElements;
      }
    },
    async submit() {
      const errMap = await this.$refs.tableXt.validate().catch(errMap => errMap)
      if(errMap){

      }else{
        let data = {
          sourceDto: {
            id: this.tableData[0].id,
            rpAmt: this.tableData[0].writeOffAmount,
          },
          wrtiteOffDto: {
            id: this.currRow.id,
          },
        }

        let res = await api.orderWriteOff(data)
        if (res.code == 0) {
          this.$message.success(res.data);
          this.$parent.getQuery();
          this.query();
          this.cancel();
        }
      }
    },
  }
};
</script>

<style lang="scss" scoped></style>
