<template>
  <div class="content-oper content-oper-flex" style="background-color: #fff;">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db ml15">
            <span>发生日期：</span>
            <Date-picker
              v-model="date"
              type="date"
              placeholder="选择日期"
              class="w200"
            ></Date-picker>
          </div>
          <div class="db ml15">
            <span>门店：</span>
            <Select v-model="store" class="w150">
              <Option
                v-for="item in Branchstore"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </div>
          <div class="db ml15">
            <span>对应科目：</span>
            <Select v-model="subjectId" class="w150">
              <Option
                v-for="item in subjecties"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </div>
          <div class="db ml15">
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="query"
            >
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
          <div class="db ml5">
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="SubmitAudit"
            >
              <span>审核</span>
            </button>
          </div>

          <div class="db ml5">
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="reAudit"
            >
              <span>撤销审核</span>
            </button>
          </div>

          <div class="db ml5">
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="putVoucher"
            >
              <span>修改凭证</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <div class="mt15">
      <Tabs type="card" value="capitalChain1">
        <TabPane label="未审核" name="capitalChain1">
          <div style="overflow: hidden ;overflow-x: scroll">
            <vxe-table
              border
              show-footer
              show-overflow
              highlight-current-row
              highlight-hover-row
              stripe
              ref="xTable"
              align="center"
              height="500"
              @current-change="getOneList"
              size="mini"
              style="width: 3000px"
              :data="tableData"
            >
              <vxe-table-column
                type="seq"
                title="序号"
                width="60"
              ></vxe-table-column>
              <vxe-table-column
                field="importTime"
                title="导入时间"
              ></vxe-table-column>
              <vxe-table-column
                field="area"
                title="所属区域"
              ></vxe-table-column>
              <vxe-table-column
                field="shopName"
                title="所属门店"
              ></vxe-table-column>
              <vxe-table-column
                field="shopCode"
                title="所属店号"
              ></vxe-table-column>
              <vxe-table-column
                field="accountName"
                title="账户"
              ></vxe-table-column>
              <vxe-table-column
                field="accountCode"
                title="账号"
              ></vxe-table-column>
              <vxe-table-column
                field="bankName"
                title="开户行"
              ></vxe-table-column>
              <vxe-table-column
                field="mateAccountName"
                title="对应科目"
              ></vxe-table-column>
              <vxe-table-column
                field="createTime"
                title="发生日期"
              ></vxe-table-column>
              <vxe-table-column
                field="incomeMoney"
                title="收入金额"
              ></vxe-table-column>
              <vxe-table-column
                field="paidMoney"
                title="支出金额"
              ></vxe-table-column>
              <vxe-table-column
                field="balanceMoney"
                title="余额"
              ></vxe-table-column>
              <vxe-table-column
                field="reciprocalAccountName"
                title="对方户名"
              ></vxe-table-column>
              <vxe-table-column
                field="checkAccount"
                title="对账账号"
              ></vxe-table-column>
              <vxe-table-column
                field="reciprocalBankName"
                title="对方开户行"
              ></vxe-table-column>
              <vxe-table-column
                field="tradingNote"
                title="交易备注"
              ></vxe-table-column>
              <vxe-table-column
                field="businessType"
                title="业务类别"
              ></vxe-table-column>
              <vxe-table-column
                field="leadHandler"
                title="导入经办人"
              ></vxe-table-column>
              <vxe-table-column
                field="claimShopCode"
                title="认领店号"
              ></vxe-table-column>
              <vxe-table-column
                field="claimShopName"
                title="认领门店"
              ></vxe-table-column>
              <vxe-table-column
                field="certificate"
                title="凭证摘要"
              ></vxe-table-column>
              <vxe-table-column
                field="cancelPerson"
                title="认领核销人"
              ></vxe-table-column>
              <vxe-table-column
                field="statementNumber"
                title="核销对账单号"
              ></vxe-table-column>
              <vxe-table-column
                field="suppliers"
                title="往来单位"
              ></vxe-table-column>
              <vxe-table-column
                field="claimNote"
                title="认领备注"
              ></vxe-table-column>
              <vxe-table-column field="claimType" title="是否认领">
                <template v-slot="{ row }">
                  {{ row.claimType ? "是" : "否" }}
                </template>
              </vxe-table-column>
              <vxe-table-column
                field="accountingExaminer"
                title="会计审核人"
              ></vxe-table-column>
              <vxe-table-column
                field="checkTime"
                title="审核时间"
              ></vxe-table-column>
              <vxe-table-column
                field="proofWords"
                title="凭证字"
              ></vxe-table-column>
              <vxe-table-column
                field="proofCode"
                title="凭证号"
              ></vxe-table-column>
            </vxe-table>
          </div>
        </TabPane>
        <TabPane label="已审核" name="capitalChain2">
          <div style="overflow: hidden ;overflow-x: scroll">
            <vxe-table
              border
              show-footer
              show-overflow
              highlight-current-row
              highlight-hover-row
              stripe
              ref="xTable"
              align="center"
              height="500"
              @current-change="getOneList"
              size="mini"
              style="width: 3000px"
              :data="tableData1"
            >
              <vxe-table-column
                type="seq"
                title="序号"
                width="60"
              ></vxe-table-column>
              <vxe-table-column
                field="importTime"
                title="导入时间"
              ></vxe-table-column>
              <vxe-table-column
                field="area"
                title="所属区域"
              ></vxe-table-column>
              <vxe-table-column
                field="shopName"
                title="所属门店"
              ></vxe-table-column>
              <vxe-table-column
                field="shopCode"
                title="所属店号"
              ></vxe-table-column>
              <vxe-table-column
                field="accountName"
                title="账户"
              ></vxe-table-column>
              <vxe-table-column
                field="accountCode"
                title="账号"
              ></vxe-table-column>
              <vxe-table-column
                field="bankName"
                title="开户行"
              ></vxe-table-column>
              <vxe-table-column
                field="mateAccountName"
                title="对应科目"
              ></vxe-table-column>
              <vxe-table-column
                field="createTime"
                title="发生日期"
              ></vxe-table-column>
              <vxe-table-column
                field="incomeMoney"
                title="收入金额"
              ></vxe-table-column>
              <vxe-table-column
                field="paidMoney"
                title="支出金额"
              ></vxe-table-column>
              <vxe-table-column
                field="balanceMoney"
                title="余额"
              ></vxe-table-column>
              <vxe-table-column
                field="reciprocalAccountName"
                title="对方户名"
              ></vxe-table-column>
              <vxe-table-column
                field="checkAccount"
                title="对账账号"
              ></vxe-table-column>
              <vxe-table-column
                field="reciprocalBankName"
                title="对方开户行"
              ></vxe-table-column>
              <vxe-table-column
                field="tradingNote"
                title="交易备注"
              ></vxe-table-column>
              <vxe-table-column
                field="businessType"
                title="业务类别"
              ></vxe-table-column>
              <vxe-table-column
                field="leadHandler"
                title="导入经办人"
              ></vxe-table-column>
              <vxe-table-column
                field="claimShopCode"
                title="认领店号"
              ></vxe-table-column>
              <vxe-table-column
                field="claimShopName"
                title="认领门店"
              ></vxe-table-column>
              <vxe-table-column
                field="certificate"
                title="凭证摘要"
              ></vxe-table-column>
              <vxe-table-column
                field="cancelPerson"
                title="认领核销人"
              ></vxe-table-column>
              <vxe-table-column
                field="statementNumber"
                title="核销对账单号"
              ></vxe-table-column>
              <vxe-table-column
                field="suppliers"
                title="往来单位"
              ></vxe-table-column>
              <vxe-table-column
                field="claimNote"
                title="认领备注"
              ></vxe-table-column>
              <vxe-table-column field="claimType" title="是否认领">
                <template v-slot="{ row }">
                  {{ row.claimType ? "是" : "否" }}
                </template>
              </vxe-table-column>
              <vxe-table-column
                field="accountingExaminer"
                title="会计审核人"
              ></vxe-table-column>
              <vxe-table-column
                field="checkTime"
                title="审核时间"
              ></vxe-table-column>
              <vxe-table-column
                field="proofWords"
                title="凭证字"
              ></vxe-table-column>
              <vxe-table-column
                field="proofCode"
                title="凭证号"
              ></vxe-table-column>
            </vxe-table>
          </div>
        </TabPane>
      </Tabs>
    </div>

    <!-- 资金审核撤销 -->
    <Modal v-model="isShow" title="资金审核撤销">
      <span>撤销原因：</span>
      <Input class="w200 ml10" v-model="content" />
      <div slot="footer">
        <Button type="primary" @click="reAuditOk">确认</Button>
        <Button @click="isShow = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      // 数据类
      oneList: null, // 表格选中
      tableData: [], // 未审核
      tableData1: [], // 已审核
      date: null, // 发生日期
      store: "", // 门店id
      Branchstore: [], // 门店
      subjectId: "", // 对应科目id
      subjecties: [], // 科目
      content: "", // 撤销原因
      // 状态类
      isShow: false, // 撤销原因modal
    };
  },
  async mounted() {},
  methods: {
    // 获取门店列表
    getStores() {},
    // 获取科目列表
    getSubjecties() {},
    // 获取已审核列表
    getTable() {},
    // 获取未审核列表
    getTable1() {},
    // 查询
    query() {},
    //点击获取表格数据
    getOneList(val) {
      this.oneList = val.row;
    },
    // 审核
    SubmitAudit() {
        this.$Modal.confirm({
            title: "资金审核",
            content: "确认审核？",
            onOk() {},
            onCancel() {},
        })
    },
    // 撤销审核
    reAudit() {
        this.isShow = true;
    },
    // 撤销审核 ok
    reAuditOk() {},
    // 修改凭证
    putVoucher() {}
  }
};
</script>

<style lang="less" scoped>
.oper-top input {
  border: 1px solid #dddddd;
  text-indent: 4px;
}
.oper-top .input {
  position: relative;
  left: -26px;
  bottom: -5px;
}
.pro span {
  display: inline-block;
  width: 100px;
  text-align: right;
}
.inner-box {
  overflow-x: scroll;
}
</style>
