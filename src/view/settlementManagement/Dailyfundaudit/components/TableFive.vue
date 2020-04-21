<template>
  <div style="overflow: hidden ;overflow-x: scroll">
    <vxe-table
      show-overflow
      highlight-current-row
      highlight-hover-row
      stripe
      ref="xTable"
      align="center"
      height="500"
      @checkbox-all="selectAllEvent"
      @checkbox-change="selectChangeEvent"
      size="mini"
      border="full"
      style="width: 3000px"
      :data="tableData"
    >
      <vxe-table-column title="基本信息">
        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="businessNumbers" title="转损益单号"></vxe-table-column>
        <vxe-table-column field="tmp" title="会计科目"></vxe-table-column>
        <vxe-table-column field="tmp" title="收付类型">
          <template v-slot="{ row }">
            <span>{{ row.receiptPaymentType.name }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="tmp" title="核销方式">
          <template v-slot="{ row }">
            <span>{{ row.verificationType.name }}</span>
          </template>
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column title="金额信息">
        <vxe-table-column title="业务类型">
          <template v-slot="{ row }">
            <ul class="list">
              <li v-for="(item, index) of row.moneyInfo" :key="index" class="flex">
                <span class="listChild">{{ item.businessType.name }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
        <vxe-table-column title="收款金额" field="tmp"></vxe-table-column>
        <vxe-table-column title="付款金额" field="tmp"></vxe-table-column>
        <vxe-table-column field="tmp" title="账户"></vxe-table-column>
        <vxe-table-column field="tmp" title="账户所属门店"></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column title="金额信息">
        <vxe-table-column title="收/付款人" field="tmp">
          <template v-slot="{ row }">
            <ul class="list">
              <li v-for="(item, index) of row.payeeInfo" :key="index" class="flex">
                <span class="listChild">{{ item.paymentPersonName }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
        <vxe-table-column title="收/付款日期" field="tmp">
          <template v-slot="{ row }">
            <ul class="list">
              <li v-for="(item, index) of row.payeeInfo" :key="index" class="flex">
                <span class="listChild">{{ item.paymentTime }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="remarks" title="备注"></vxe-table-column>
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
      selectionData: []
    };
  },
  methods: {
    selectAllEvent({ checked, records }) {
      console.log(checked ? "所有勾选事件" : "所有取消事件", records);
    },
    selectChangeEvent({ checked, records }) {
      console.log(checked ? "勾选事件" : "取消事件", records);
    }
  }
};
</script>
