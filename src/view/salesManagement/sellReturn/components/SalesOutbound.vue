<template>
  <Modal v-model="showInfo" title="选择销售出库单" width="1000">
    <div class="OutboundInfo">
      <div class="header">
        <Form ref="formOne" :model="formInfo" inline>
          <!-- <FormItem>
            <Input type="text" placeholder="客户名称"/>
        </FormItem>-->

          出库日期：

          <FormItem>
            <DatePicker
              style="width: 115px"
              type="date"
              placeholder="请选择日期"
              v-model="Outform.startDate"
            ></DatePicker>
          </FormItem>
          <span class="mr8">-</span>
          <FormItem>
            <DatePicker
              style="width: 115px"
              type="date"
              v-model="Outform.endDate"
              placeholder="请选择日期"
            ></DatePicker>
          </FormItem>
          <FormItem>
            <Input
              type="text"
              placeholder="业务单号"
              style="width: 150px"
              v-model="Outform.orderId"
            />
          </FormItem>
          <FormItem>
            <Input
              type="text"
              placeholder="出库单号"
              style="width: 150px"
              v-model="Outform.outOrderId"
            />
          </FormItem>
          <FormItem>
            <Input
              type="text"
              placeholder="配件编码"
              style="width: 120px"
              v-model="Outform.fittingsCode"
            />
          </FormItem>

          <Button type="plain mr15">查询</Button>
          <Button type="primary mr15">选入</Button>
          <Button>取消</Button>
        </Form>
      </div>
      <div class="main clearfix">
        <!-- 销售出库单上 -->
        <vxe-table
          height='140'
          border
          resizable
          size="small"
          :data="tableDataTop"
          highlight-current-row
          :radio-config="{ labelField: '', trigger: 'row' }"
        >
          <vxe-table-column
            type="index"
            width="60"
            title="序号"
          ></vxe-table-column>
          <vxe-table-column type="radio" width="60" title="选择">
          </vxe-table-column>
          <vxe-table-column
            field="role"
            title="往来单位"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="sex"
            title="销售员"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="出库金额"
            width="80"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="业务单号"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="订单日期"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="出库单号"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="出库日期"
            width="120"
          ></vxe-table-column>
        </vxe-table>
        <!-- 销售出库单下 -->
        <div class="bgc mt5 pr10 h40">订单数量共4条</div>
        <vxe-table
          height='140'
          border
          resizable
          size="small"
          :data="tableDataBottom"
          highlight-current-row
          :radio-config="{ labelField: '', trigger: 'row' }"
        >
          <vxe-table-column
            type="index"
            width="60"
            title="序号"
          ></vxe-table-column>
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column
            field="role"
            title="配件编码"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="sex"
            title="配件名称"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="品牌"
            width="80"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="OE码"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="单位"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="出库数量"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="可退数量"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="出库单价"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="出库金额"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="备注"
            width="120"
          ></vxe-table-column>
        </vxe-table>
        <Page
          :current="SalesOutboundTable.page.num"
          :total="SalesOutboundTable.page.total"
          :page-size="SalesOutboundTable.page.size"
          @on-change="SalesOutboundTableChangePage"
          @on-page-size-change="SalesOutboundTableChangeSize"
          size="small"
          show-elevator
          show-sizer
          class="mt10"
        />
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class SalesOutbound extends Vue {
  private showInfo: boolean = false;
  // 销售出库订单信息——表单
  private Outform = {
    startDate: "", //开始日期
    endDate: "", //结束日期
    orderId: "", //业务单号
    outOrderId: "", //出库单号
    fittingsCode: "" //配件编码
  };

  private  tableDataTop: Array<Tableth> = []
  private  tableDataBottom: Array<Tableth> = []
  // 销售出库单列表
  private SalesOutboundTable = {
    loading: false,
    page: {
      num: 1,
      size: 10,
      total: 0
    }
  };
  private init() {
    this.showInfo = true;
  }
  // 销售出库订单列表-翻页
  private SalesOutboundChangePage(p: number) {
    this.SalesOutboundTable.page.num = p;
  }

  // 销售出库订单列表-修改页码
  private SalesOutboundTableChangeSize(size: number) {
    this.SalesOutboundTable.page.num = 1;
    this.SalesOutboundTable.page.size = size;
  }

}
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
