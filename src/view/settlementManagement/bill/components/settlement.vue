<template>
  <Modal v-model="Settlement" title=" 对账单收付款结算" width="1200" @on-visible-change="hander">
    <div class="db">
      <button class="ivu-btn ivu-btn-default mr10" type="button" @click="conserve">保存</button>
      <button class="ivu-btn ivu-btn-default mr10" type="button" @click="Settlement = false">关闭</button>
    </div>
    <div class="db p15 mt10 mb10">
      <Row>
        <Col span="8">
        <span>门店：</span>
        <Input class="w200" v-model="reconciliationStatement.orgName" /></Col>
        <Col span="8">
        <span>往来单位：</span>
        <Input class="w200" v-model="reconciliationStatement.guestName" /></Col>
        <Col span="8">
        <span>收付类型：</span>
        <Input class="w200" v-model="reconciliationStatement.billingTypeName" /></Col>
      </Row>
      <Row class="mt10">
        <Col span="8">
        <span>对账单号：</span>
        <Input class="w200" v-model="reconciliationStatement.accountNo" />
        <i class="iconfont iconcaidan input" @click="accountNoClick"></i>
        </Col>
        <Col span="8">
        <span>实际收款/付款：</span>
        <Input class="w200" v-model="reconciliationStatement.receiptPayment" /></Col>
        <Col span="8">
        <span>收付款单号：</span>
        <Input class="w200" v-model="collectPayId" /></Col>
      </Row>
    </div>
    <Button @click="subject">选择添加科目</Button>
    <Row class="mt10">
      <Col span="16">
        <vxe-table
          style="flex:6"
          border
          resizable
          auto-resize
          show-footer
          :data="BusinessType"
          :footer-method="offWrite"
          :edit-config="{trigger: 'click', mode: 'cell'}"
          @edit-closed="editClosedEvent"
        >
          <vxe-table-column title="核销信息">
            <vxe-table-column field="orgName" title="门店"></vxe-table-column>
            <vxe-table-column field="accountNo" title="对账单号"></vxe-table-column>
            <vxe-table-column field="guestName" title="往来单位"></vxe-table-column>
            <vxe-table-column field="serviceTypeName" title="业务类型"></vxe-table-column>
            <vxe-table-column field="accountAmt" title="对账金额"></vxe-table-column>
            <vxe-table-column field="endAmt" title="已收/付金额"></vxe-table-column>
            <vxe-table-column field="uncollectedAmt" title="未收/付金额"></vxe-table-column>
            <vxe-table-column
              field="checkAmt"
              title="本次核销金额"
              width="140"
              :edit-render="{name: 'input', attrs: {type: 'number'}}"
            ></vxe-table-column>
            <vxe-table-column field="unAmt" title="剩余未收/未付"></vxe-table-column>
          </vxe-table-column>
        </vxe-table>
        <div>
            <section class="flex">
              <p
                class="w80 pl5 pr10"
                style="border:1px solid #ddd;border-top:0;border-right:0;line-height: 40px"
              >核对</p>
              <span class="w700" style="display:inline-block;border:1px solid #ddd;border-top:none;">{{check}}</span>
            </section>
            <section class="flex">
              <p
                class="w80 pl5 pr10"
                style="border:1px solid #ddd;border-top:0;border-right:0;line-height: 40px"
              >备注</p>
              <input
                type="text"
                size="large"
                class="w700"
                style="border:1px solid #ddd;border-top:none;text-indent:5px"
                v-model="remark"
              />
            </section>
          </div>
      </Col>
      <Col span="8">
        <vxe-table
          class="ml10"
          style="flex:4"
          border
          resizable
          auto-resize
          show-footer
          :footer-method="payCollection"
          :data="tableData"
          :edit-config="{trigger: 'click', mode: 'cell'}"
        >
          <vxe-table-column title="收/付款信息">
            <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
            <vxe-table-column field="paymentAmtName" title="收/付款账户"></vxe-table-column>
            <vxe-table-column field="paymentAmtName" title="科目代码"></vxe-table-column>
            <vxe-table-column field="createTime" title="发生日期"></vxe-table-column>
            <vxe-table-column field="collection" title="收入金额"></vxe-table-column>
            <vxe-table-column field="payAmt" title="支出金额"></vxe-table-column>
            <vxe-table-column field="orgName" title="所属门店"></vxe-table-column>
          </vxe-table-column>
        </vxe-table>
      </Col>
    </Row>
    <div slot="footer"></div>
    <accountSelette ref="accountSelette" />
    <subjexts ref="subjexts" />
  </Modal>
</template>
<script>
import accountSelette from './accountSelette'
import subjexts from './subjects'
import bus from '../Popup/Bus'
export default {
  components:{
    accountSelette,
    subjexts
  },
  data() {
    return {
      Settlement: false, //弹框显示
      check: "",
      remark: "",
      reconciliationStatement: "",
      BusinessType: [
        {
          orgName: "1",
          accountAmt: 1,
          endAmt: 1,
          uncollectedAmt: 1,
          checkAmt: 1,
          unAmt: 1
        }
      ],
      tableData: [{ payAmt: 1 }],
      collectPayId: ""
    };
  },
  mounted(){
    // 对账单号
    bus.$on("accountHedNo", val=>{
      console.log(val)
    });
    bus.$on('sub',val=>{
      console.log(val)
    })
  },
  methods: {
    // 选择科目弹框
    subject(){
      this.$refs.subjexts.modal = true
    },
    // 对账单号选择
    accountNoClick(){
      this.$refs.accountSelette.modal1 = true
    },
    //弹框打开
    hander(type) {
      if(type){
        this.check= "",
        this.remark= "",
        this.reconciliationStatement= "",
        this.BusinessType= [],
        this.tableData= [],
        this.collectPayId= ""
      }
    },
    //保存
    conserve() {},
    // 核销单元格编辑状态下被关闭时
    editClosedEvent({ row, rowIndex }) {
      row.unAmt =
        row.accountAmt * 1  -
        row.checkAmt * 1;
      row.endAmt = + row.checkAmt * 1;
      row.uncollectedAmt = row.accountAmt * 1 - row.checkAmt;
      this.$set(this.BusinessType, rowIndex, row);
      // let obj = {
      //   serviceTypeName: "合计",
      //   accountAmt: this.BusinessType[0].accountAmt,
      //   endAmt: this.BusinessType[0].endAmt,
      //   uncollectedAmt: this.BusinessType[0].uncollectedAmt,
      //   checkAmt: this.BusinessType[0].checkAmt,
      //   unAmt: this.BusinessType[0].unAmt
      // };
      // let total = this.getTotal(obj);
      // this.$set(this.BusinessType, 5, obj);
    },
    // 核销信息合计
    offWrite({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 3) {
            return "合计";
          }
          if (
            [
              "accountAmt",
              "endAmt",
              "uncollectedAmt",
              "checkAmt",
              "unAmt"
            ].includes(column.property)
          ) {
            return this.$utils.sum(data, column.property);
          }
          return null;
        })
      ];
    },
    // 收款信息合计
    payCollection({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "合计";
          }
          if (["collection", "payAmt"].includes(column.property)) {
            return this.$utils.sum(data, column.property);
          }
          return null;
        })
      ];
    }
  }
};
</script>
<style lang="less" scoped>
.input {
  position: relative;
  left: -26px;
  bottom: -5px;
}
</style>