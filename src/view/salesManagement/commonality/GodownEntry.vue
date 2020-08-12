<template>
  <Modal
    v-model="showInfo"
    title="选择入库单"
    width="1200"
    @on-visible-change="openOrClose"
  >
    <div class="OutboundInfo">
      <div class="header">
        <Form ref="formOne" :model="Outform" inline>
          入库日期：
          <FormItem>
            <DatePicker
              style="width: 200px"
              type="daterange"
              placeholder="请选择日期"
              @on-change="getTime"
            ></DatePicker>
          </FormItem>
          <FormItem>
            <Select v-model="Outform.guestId" filterable style="width:200px">
              <Option
                v-for="item in clientList"
                :value="item.id"
                :key="item.id"
                >{{ item.fullName }}</Option
              >
            </Select>
          </FormItem>
          <FormItem>
            <Input
              type="text"
              placeholder="入库单号"
              style="width: 150px"
              v-model="Outform.serviceId"
            />
          </FormItem>
          <FormItem>
            <Select
              v-model="Outform.enterTypeId"
              style="width:100px"
              placeholder="请选择供应商"
            >
              <Option
                v-for="item in enterTypeList"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>

          <Button type="warning" class="mr15" @click="query">查询</Button>
          <Button type="warning" class="mr15" @click="selectInto">选入</Button>
          <Button @click="showInfo = false">取消</Button>
        </Form>
      </div>
      <div class="main clearfix">
        <!-- 入库单上 -->
        <vxe-table
          height="200"
          border
          :loading="Loading"
          resizable
          auto-resize
          align="center"
          highlight-current-row
          @radio-change="selectOne"
          @current-change="selectOne"
          :radio-config="{trigger: 'row'}"
          size="mini"
          :data="tableDataTop"
        >
          <vxe-table-column
            type="radio"
            title="选择"
            width="60"
          ></vxe-table-column>
          <vxe-table-column
            type="index"
            width="50"
            title="序号"
          ></vxe-table-column>
          <vxe-table-column
            field="serviceId"
            title="入库单号"
          ></vxe-table-column>
          <vxe-table-column
            field="guestName"
            title="供应商名称"
          ></vxe-table-column>
          <vxe-table-column
            field="remark"
            title="备注"
          ></vxe-table-column>
          <vxe-table-column
            field="enterAmt"
            title="入库金额"
          ></vxe-table-column>
          <vxe-table-column
            field="enterDate"
            title="入库日期"
          ></vxe-table-column>
          <vxe-table-column field="code" title="业务单号"></vxe-table-column>
          <vxe-table-column
            field="enterTypeIdName"
            title="入库类型"
          ></vxe-table-column>
        </vxe-table>
        <!-- 入库单下 -->
        <div class="clearfix">
          <Page
            :total="page.total"
            :page-size="page.size"
            :current="page.num"
            show-sizer
            show-total
            class-name="page-con fr mr10 mb10 mt10"
            :page-size-opts="page.placement"
            @on-change="selectNum"
            @on-page-size-change="selectPage"
            class="mr10"
          ></Page>
        </div>

        <vxe-table
          height="200"
          border
          resizable
          auto-resize
          ref="Xtable"
          align="center"
          size="small"
          highlight-hover-row
          highlight-current-row
          :data="tableDataBottom.details"
        >
          <vxe-table-column
            type="index"
            width="50"
            title="序号"
          ></vxe-table-column>

          <vxe-table-column
            field="partCode"
            title="配件编码"
          ></vxe-table-column>
          <vxe-table-column
            field="partName"
            title="配件名称"
          ></vxe-table-column>
          <vxe-table-column field="partBrand" title="品牌"></vxe-table-column>
          <vxe-table-column field="oemCode" title="OE码"></vxe-table-column>
          <vxe-table-column
            field="systemUnitId"
            title="单位"
          ></vxe-table-column>
          <vxe-table-column
            field="enterQty"
            title="入库数量"
          ></vxe-table-column>
          <vxe-table-column
            field="enterPrice"
            title="入库单价"
          ></vxe-table-column>
          <vxe-table-column
            field="outableQty"
            title="可售数量"
          ></vxe-table-column>
        </vxe-table>
      </div>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>

<script>
import { getGodown, getSupplier } from "@/api/salesManagment/salesOrder";

export default {
  name: "SalesOutBound",
  data() {
    return {
      showInfo: false, // 销售出库订单信息——表单
      Outform: {
        enterTypeId: "",
        serviceId: "",
        guestId: "",
        enterDateStart: "",
        enterDateEnd: ""
      },
      clientList: [], //客户列表
      enterTypeList: [
        { label: "全部", value: "12345" },
        { label: "采购入库", value: "050101" },
        { label: "调拨入库", value: "050104" }
      ], //入库类型
      tableDataTop: [], //上面表格数据
      tableDataBottom: {}, //下面表格数据
      SalesOutboundTable: {
        // 销售出库单列表
        loading: false
      },
      page: {
        num: 1,
        size: 20,
        total: 0,
        placement: [20, 40, 60, 80, 100]
      },
      Loading: true, //状态
      // storeId: "" //参考id
    };
  },
  mounted() {},
  props: {
    storeId: {
      type: String
    }
  },
  methods: {
    reset() {
      this.Outform = {
        enterTypeId: "",
        serviceId: "",
        guestId: "",
        enterDateStart: "",
        enterDateEnd: ""
      };
    },
    //打开模态框
    openModal(v) {
      this.storeId = v;
      this.getList(v);
      this.getClientList();
      this.showInfo = true;
      this.$refs.Xtable.recalculate(true)
    },
    //获取入库数据
    async getList(v) {
      if (this.tableDataTop.length > 0) return;
      let data = {};
      data = this.Outform;
      data.page = this.page.num - 1;
      data.size = this.page.size;
      data.storeId = v || this.storeId;
      this.Loading = true;
      let res = await getGodown(data);
      if (res.code === 0) {
        this.Loading = false;
        this.tableDataTop = res.data.content;
        this.page.total = res.data.totalElements;
      }
    },
    async getList2(v) {
      let data = {};
      data = this.Outform;
      data.page = this.page.num - 1;
      data.size = this.page.size;
      data.storeId = v || this.storeId;
      this.Loading = true;
      let res = await getGodown(data);
      if (res.code === 0) {
        this.Loading = false;
        this.tableDataTop = res.data.content;
        this.page.total = res.data.totalElements;
      }
    },
    //获取供应商列表
    async getClientList() {
      if (this.clientList.length > 0) return;
      let res = await getSupplier({});
      if (res.code === 0) {
        this.clientList = res.data || [];
      }
    },
    //获取时间
    getTime(value) {
      if (value[0]) {
        this.Outform.enterDateStart = value[0] + " " + "00:00:00";
        this.Outform.enterDateEnd = value[1] + " " + "23:59:59";
      }
    },
    //查询
    query() {
      this.getList2(this.storeId);
    },
    //切换页面
    selectNum(val) {
      this.page.num = val;
      this.getList2();
    },
    //切换页数
    selectPage(val) {
      this.page.num = 1;
      this.page.size = val;
      this.getList2();
    },
    //上部表格选中
    selectOne(data) {
      this.tableDataBottom = data.row;
    },
    openOrClose() {
      this.tableDataBottom = {};
    },
    //选入
    selectInto() {
      if (!this.tableDataBottom.id) {
        this.$Message.error("请选择一条有效数据");
      } else {
        this.$emit("godownList", this.tableDataBottom);
        this.showInfo = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.bgc {
  color: #000;
  background-color: #e8e8e8;
}
.h40 {
  line-height: 40px;
  padding-left: 5px;
}
</style>
