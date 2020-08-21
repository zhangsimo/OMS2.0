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
          <FormItem>
            <span>快速查询：</span>
            <getDate ref="getDate" class="mr5" style="display: inline-block" @quickDate="getvalue"></getDate>
          </FormItem>
          <FormItem>
            <!--<Select v-model="Outform.guestId" filterable style="width:200px">-->
              <!--<Option-->
                <!--v-for="item in clientList"-->
                <!--:value="item.id"-->
                <!--:key="item.id"-->
                <!--&gt;{{ item.fullName }}</Option-->
              <!--&gt;-->
            <!--</Select>-->
            <supplier-cus placeholder="输入供应商名称" :disabled-prop="false" @throwName="throwNameFun"></supplier-cus>
          </FormItem>
          <FormItem>
            <Input
              type="text"
              placeholder="业务单号"
              style="width: 150px"
              v-model="Outform.code"
            />
          </FormItem>
          <FormItem>
            <Select
              v-model="Outform.enterTypeId"
              style="width:100px"
              placeholder="请选择"
              @on-change="query"
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
          <Poptip placement="bottom" width="150">
            <Button type="warning" class="mr15">选入</Button>
            <div class="enter-wrap" slot="content">
              <p @click="selectInto(2)">按入库成本取值</p>
              <p @click="selectInto(3)">按客户销价取值</p>
              <p @click="selectInto(4)">按最近销价取值</p>
            </div>
          </Poptip>
          <!--<Button type="warning" class="mr15" @click="selectInto">选入</Button>-->
          <Button @click="showInfo = false" class="mr10">取消</Button>
          <Checkbox v-model="showSelf" size="small" @on-change="showOwen"
          >显示个人单据</Checkbox
          >
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
            width="200"
            title="入库单号"
          ></vxe-table-column>
          <vxe-table-column
            field="guestName"
            width="150"
            title="供应商名称"
            show-overflow="title"
          ></vxe-table-column>
          <vxe-table-column
            field="remark"
            width="150"
            title="备注"
          ></vxe-table-column>
          <vxe-table-column
            field="enterAmt"
            width="100"
            title="入库金额"
          ></vxe-table-column>
          <vxe-table-column
            field="enterDate"
            width="150"
            title="入库日期"
          ></vxe-table-column>
          <vxe-table-column field="code" title="业务单号" width="200"></vxe-table-column>
          <vxe-table-column
            field="createUname"
            width="100"
            title="创建人"
          ></vxe-table-column>
          <vxe-table-column
            field="enterTypeIdName"
            width="100"
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
            min-width="150"
            title="配件编码"
          ></vxe-table-column>
          <vxe-table-column
            field="partName"
            min-width="200"
            title="配件名称"
          ></vxe-table-column>
          <vxe-table-column field="partBrand" title="品牌" width="150"></vxe-table-column>
          <vxe-table-column field="oemCode" title="OE码" min-width="150"></vxe-table-column>
          <vxe-table-column
            field="systemUnitId"
            title="单位"
            width="100"
          ></vxe-table-column>
          <vxe-table-column
            field="enterQty"
            title="入库数量"
            width="100"
          ></vxe-table-column>
          <vxe-table-column
            field="enterPrice"
            width="100"
            title="入库单价"
          ></vxe-table-column>
          <vxe-table-column
            field="outableQty"
            width="100"
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
import SalesCus from "../../../components/allocation/salesCus";
import SupplierCus from "../../../components/allocation/supplierCus";
import getDate from "@/components/getDate/dateget_bill";
export default {
  name: "SalesOutBound",
  components: {SupplierCus, SalesCus,getDate},
  data() {
    return {
      showInfo: false, // 销售出库订单信息——表单
      Outform: {
        enterTypeId: "12345",
        code: "",
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
      showSelf:true,
    };
  },
  mounted() {
  },
  props: {
    storeId: {
      type: String
    }
  },
  methods: {
    showOwen() {
      this.getList2();
    },
    reset() {
      this.Outform.enterTypeId = '12345';
      this.Outform.code = ''
      this.Outform.guestId = ''
    },
    //打开模态框
    openModal(v) {
      this.showInfo = true;
      this.$refs.getDate.resetFun();
      this.storeId = v;
      this.searchValue = "";
      this.getList(v);
      //this.getClientList();
      this.$refs.Xtable.recalculate(true)
    },
    //获取入库数据
    async getList(v) {
      let data = {};
      data = this.Outform;
      data.page = this.page.num - 1;
      data.size = this.page.size;
      data.showPerson = this.showSelf? 1 : 0;
      data.storeId = v || this.storeId;
      this.Loading = true;
      let res = await getGodown(data);
      this.Loading = false;
      if (res.code === 0) {
        this.tableDataTop = res.data.content.sort((a,b) =>{
          return a.enterDate<b.enterDate?1:-1;
        });
        this.page.total = res.data.totalElements;
      }
    },
    async getList2(v) {
      let data = {};
      data = this.Outform;
      data.page = this.page.num - 1;
      data.size = this.page.size;
      data.storeId = v || this.storeId;
      data.showPerson = this.showSelf? 1 : 0;
      this.Loading = true;
      let res = await getGodown(data);
      if (res.code === 0) {
        this.Loading = false;
        this.tableDataTop = res.data.content.sort((a,b) => {
          return a.enterDate<b.enterDate?1:-1;
        });
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
    getvalue(value) {
      if (value[0]) {
        this.Outform.enterDateStart = value[0];
        this.Outform.enterDateEnd = value[1];
      }else{
        this.Outform.enterDateStart = "";
        this.Outform.enterDateEnd = "";
      }
      this.query();
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
    selectInto(v) {
      if (!this.tableDataBottom.id) {
        this.$Message.error("请选择一条有效数据");
      } else {
        this.$emit("godownList", this.tableDataBottom,v);
        this.showInfo = false;
      }
    },
    throwNameFun(v){
      this.Outform.guestId = v.id ||"";
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
  .enter-wrap{
    line-height: 30px;
    p{
      cursor: pointer;
      text-align: center;
      &:hover{
        color: #fd5c5c;
      }
    }
  }
</style>
