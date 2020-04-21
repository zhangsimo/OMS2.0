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
        <vxe-table-column field="businessNumbers" title="收款单号"></vxe-table-column>
        <vxe-table-column field="businessNumbersList" title="对账单单号"></vxe-table-column>
        <vxe-table-column field="guestSourceName" title="来源往来单位"></vxe-table-column>
        <vxe-table-column field="guestTargetName" title="目标往来单位"></vxe-table-column>
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
        <vxe-table-column title="金额">
          <template v-slot="{ row }">
            <ul class="list">
              <li v-for="(item, index) of row.moneyInfo" :key="index" class="flex">
                <span class="listChild">{{ item.auditMoney }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
        <vxe-table-column field="tmp" title="收款合计">
          <template v-slot="{ row }">
             <span>{{ row.moneyInfo[0].auditMoneyTotal }}</span>
          </template>
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column title="收款方式">
        <vxe-table-column title="账户">
          <template v-slot="{ row }">
            <ul class="list">
              <li v-for="(item, index) of row.payeeWay" :key="index" class="flex">
                <span class="listChild">{{ item.accountName }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
        <vxe-table-column title="金额">
          <template v-slot="{ row }">
            <ul class="list">
              <li v-for="(item, index) of row.payeeWay" :key="index" class="flex">
                <span class="listChild">{{ item.paymentMoney }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
        <vxe-table-column title="收款所属门店">
          <template v-slot="{ row }">
            <ul class="list">
              <li v-for="(item, index) of row.payeeWay" :key="index" class="flex">
                <span class="listChild">{{ item.shopName }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column title="收款信息">
        <vxe-table-column field="tmp" title="收款人">
          <template v-slot="{ row }">
            <ul class="list">
              <li v-for="(item, index) of row.payeeInfo" :key="index" class="flex">
                <span class="listChild">{{ item.paymentPersonName }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
        <vxe-table-column field="tmp" title="收款日期">
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
