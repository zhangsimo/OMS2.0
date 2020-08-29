<template>
  <div>
    <vxe-table
      show-overflow
      highlight-current-row
      highlight-hover-row
      stripe
      ref="xTable"
      align="center"
      height="500"
      auto-resize
      resizable
      border="full"
      :data="tableData"
      @checkbox-all="selectAllEvent"
      @checkbox-change="selectChangeEvent"
    >
      <vxe-table-column type="checkbox" min-width="60"     ></vxe-table-column>
      <vxe-table-column type="seq" title="序号" min-width="60"     ></vxe-table-column>
      <vxe-table-column title="往来单位"      min-width="120">
        <template v-slot="{row}">
          <ul class="list">
            <li v-for="(item, index) of row.suppliers" :key="index" class="flex">
              <span class="listChild">{{ item.guestSourceName }}</span>
            </li>
          </ul>
        </template>
      </vxe-table-column>
      <vxe-table-column title="基本信息">
        <vxe-table-column field="businessNumbers" title="收付款单号" min-width="120"></vxe-table-column>
        <vxe-table-column field="businessNumbersList" title="预收款单号" min-width="120"></vxe-table-column>
<!--        <vxe-table-column field="tmp" title="来源往来单位">-->
<!--          <template v-slot="{ row }">-->
<!--            <ul class="list">-->
<!--              <li v-for="(item, index) of row.suppliers" :key="index" class="flex">-->
<!--                <span class="listChild">{{ item.guestSourceName }}</span>-->
<!--              </li>-->
<!--            </ul>-->
<!--          </template>-->
<!--        </vxe-table-column>-->
<!--        <vxe-table-column field="tmp" title="目标往来单位">-->
<!--          <template v-slot="{ row }">-->
<!--            <ul class="list">-->
<!--              <li v-for="(item, index) of row.suppliers" :key="index" class="flex">-->
<!--                <span class="listChild">{{ item.guestTargetName }}</span>-->
<!--              </li>-->
<!--            </ul>-->
<!--          </template>-->
<!--        </vxe-table-column>-->
        <vxe-table-column field="tmp" title="收付类型" min-width="100">
          <template v-slot="{ row }">
            <span>{{ row.receiptPaymentType.name }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="tmp" title="核销方式" min-width="100">
          <template v-slot="{ row }">
            <span>{{ row.verificationType.name }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column width="100" field="createUname" title="操作人">
        </vxe-table-column>
        <vxe-table-column width="150" field="createTime" title="操作时间">
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column title="金额信息">
        <vxe-table-column title="业务类型" field="tmp" min-width="100">
          <template v-slot="{ row }">
            <ul class="list">
              <li v-for="(item, index) of row.moneyInfo" :key="index" class="flex">
                <span class="listChild">{{ item.businessTypeName? item.businessTypeName  : '' }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
        <vxe-table-column title="金额" field="tmp" min-width="60">
          <template v-slot="{ row }">
            <ul class="list">
              <li v-for="(item, index) of row.moneyInfo" :key="index" class="flex">
                <span class="listChild">{{ item.auditMoney }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
        <vxe-table-column field="tmp" title="合计" min-width="60">
          <template v-slot="{ row }">
            <span>{{ row.moneyInfo[0].auditMoneyTotal }}</span>
          </template>
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column title="收付款方式">
        <vxe-table-column title="账户" min-width="60">
          <template v-slot="{ row }">
            <ul class="list">
              <li v-for="(item, index) of row.payeeWay" :key="index" class="flex">
                <span class="listChild">{{ item.accountName }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
        <vxe-table-column title="收款金额" min-width="100">
          <template v-slot="{ row }">
            <ul class="list">
              <li v-for="(item, index) of row.payeeWay" :key="index" class="flex">
                <span class="listChild">{{ item.incomeMoney }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
        <vxe-table-column title="付款金额" min-width="100">
          <template v-slot="{ row }">
            <ul class="list">
              <li v-for="(item, index) of row.payeeWay" :key="index" class="flex">
                <span class="listChild">{{ item.paymentMoney }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
        <vxe-table-column title="账户所属门店" min-width="120">
          <template v-slot="{ row }">
            <ul class="list">
              <li v-for="(item, index) of row.payeeWay" :key="index" class="flex">
                <span class="listChild">{{ item.shopName }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column title="收付款信息">
        <vxe-table-column field="tmp" title="付款人" min-width="100">
          <template v-slot="{ row }">
            <ul class="list">
              <li v-for="(item, index) of row.payeeInfo" :key="index" class="flex">
                <span class="listChild">{{ item.paymentPersonName }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
        <vxe-table-column field="tmp" title="付款日期" min-width="100">
          <template v-slot="{ row }">
            <ul class="list">
              <li v-for="(item, index) of row.payeeInfo" :key="index" class="flex">
                <span class="listChild">{{ item.paymentTime }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
        <vxe-table-column field="tmp" title="收款人" min-width="100">
          <template v-slot="{ row }">
            <ul class="list">
              <li v-for="(item, index) of row.payeeInfo" :key="index" class="flex">
                <span class="listChild">{{ item.paymentPersonNameIn }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
        <vxe-table-column field="tmp" title="收款日期" min-width="100">
          <template v-slot="{ row }">
            <ul class="list">
              <li v-for="(item, index) of row.payeeInfo" :key="index" class="flex">
                <span class="listChild">{{ item.paymentTimeIn }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="remarks" title="备注" min-width="60"></vxe-table-column>
    </vxe-table>
  </div>
</template>

<script>
  export default {
    name: "tableone",
    props: {
      tbdata: {
        type: Array,
        default: [],
      }
    },
    computed: {
      tableData() {
        return this.tbdata;
      }
    },
    data() {
      return {
      };
    },
    methods: {
      clear() {
        this.$refs.xTable.clearCheckboxRow();
        this.$emit("selection", []);
      },
      selectAllEvent({ checked, records }) {
        // console.log(checked ? "所有勾选事件" : "所有取消事件", records);
        this.$emit("selection", records);
      },
      selectChangeEvent({ checked, records }) {
        // console.log(checked ? "勾选事件" : "取消事件", records);
        this.$emit("selection", records);
      }
    }
  };
</script>

<style scoped>
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
    line-height: 24px;
    padding:0 5px;
  }
  .vxe-table .vxe-cell {
    padding: 0;
  }
  .vxe-table .vxe-body--column:not(.col--ellipsis) {
    padding: 0;
  }
</style>
