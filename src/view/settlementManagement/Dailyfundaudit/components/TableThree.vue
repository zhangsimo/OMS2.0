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
      size="mini"
      border="full"
      style="width: 3000px"
      :data="tableData"
    >
      <vxe-table-column title="基本信息">
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="businessNumbers" title="付款单号"></vxe-table-column>
        <vxe-table-column field="businessNumbersList" title="申请单号"></vxe-table-column>
        <vxe-table-column field="proposerName" title="申请人"></vxe-table-column>
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
        <vxe-table-column field="tmp" title="付款合计">
          <template v-slot="{ row }">
             <span>{{ row.moneyInfo[0].auditMoneyTotal }}</span>
          </template>
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column title="收款方式">
        <vxe-table-column title="科目/账户">
          <template v-slot="{ row }">
            <ul class="list">
              <li v-for="(item, index) of row.payeeWay" :key="index" class="flex">
                <span class="listChild">{{ item.accountName }} / {{ item.mateAccountName }}</span>
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
        <vxe-table-column title="所属门店">
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
        <vxe-table-column field="tmp" title="付款人">
          <template v-slot="{ row }">
            <ul class="list">
              <li v-for="(item, index) of row.payeeInfo" :key="index" class="flex">
                <span class="listChild">{{ item.paymentPersonName }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
        <vxe-table-column field="tmp" title="付款日期">
          <template v-slot="{ row }">
            <ul class="list">
              <li v-for="(item, index) of row.payeeInfo" :key="index" class="flex">
                <span class="listChild">{{ item.paymentTime }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
        <vxe-table-column field="remarks" title="备注"></vxe-table-column>
      </vxe-table-column>
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
  methods: {}
};
</script>
