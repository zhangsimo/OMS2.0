<template>
  <Modal v-model="modal1" title="对账单查询" width="860" @on-visible-change="visChange">
    <span class="mr5">对账期间：</span>
    <DatePicker v-model="dateQuery" type="daterange" placement="bottom-start" style="width: 200px"></DatePicker>
    <span>往来单位：</span>
    <Select
      v-model="companyId"
      class="w150"
      clearable
      filterable
      remote
      :loading="remoteloading"
      :remote-method="getOne"
    >
      <Option v-for="item in company" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <span class="ml10">收付款类型：</span>
    <Select v-model="paymentId" class="w150" filterable>
      <Option v-for="item in paymentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <Button @click="query" class="ml10">查询</Button>
    <vxe-table
      border
      auto-resize
      resizable
      stripe
      align="center"
      show-overflow="title"
      size="mini"
      :data="accountData"
      highlight-hover-row
      highlight-current-row
      :loading="detailLoading"
      class="mt10"
      max-hight="450"
      ref="table"
      @current-change="seleteDate"
    >
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="collectionTime" title="对账日期" min-width="100"></vxe-table-column>
      <vxe-table-column title="对账单号" min-width="100">
        <template v-slot="{row}">
          <span style="cursor:pointer;color:#87CEFA" @click="accountNoClick(row)">{{row.serviceId}}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="guestName" title="往来单位" min-width="80"></vxe-table-column>
      <vxe-table-column field="orderTypeName" title="收付类型" min-width="100"></vxe-table-column>
      <vxe-table-column field="amountCollected" title="实际收付款金额" min-width="180"></vxe-table-column>
    </vxe-table>
    <div class="clearfix">
      <Page
        class-name="fr mb10 mt10"
        size="small"
        :current="page.num"
        :total="page.total"
        :page-size="page.size"
        :page-size-opts="page.sizeArr"
        @on-change="changePage"
        @on-page-size-change="changeSize"
        show-sizer
        show-total
      ></Page>
    </div>
    <div slot="footer">
      <Button type="primary" @click="determine">确定</Button>
      <Button @click="modal1=false">取消</Button>
    </div>
    <idDetailed ref="idDetailed" />
    <!-- <selectDealings ref="selectDealings" @selectSearchName="getOne"  /> -->
  </Modal>
</template>
<script>
import idDetailed from "./idDetailed";
import { findGuest } from "_api/settlementManagement/advanceCollection.js";
import { findAccount } from "_api/settlementManagement/seleteAccount.js";
import { findByDynamicQuery } from "_api/settlementManagement/otherPayable/otherPayable";
import { getDataDictionaryTable } from "@/api/system/dataDictionary/dataDictionaryApi";
import bus from "../../../bill/Popup/Bus";
import moment from "moment";
export default {
  props: ["information"],
  components: {
    idDetailed
    // selectDealings
  },
  data() {
    return {
      dateQuery: "", //时间
      company: [], //往来单位
      companyId: "", //往来单位id
      modal1: false, //弹窗展示
      page:{
        num:1,
        size:10,
        total:0,
        sizeArr:[10,20,30,50,100]
      },
      detailLoading:false,//loading
      account: [
        {
          title: "序号",
          type: "index",
          width: 40,
          className: "tc"
        },
        // {
        //   title: "门店",
        //   key: "",
        //   className: "tc"
        // },
        {
          title: "对账日期",
          key: "collectionTime",
          className: "tc",
          // render: (h, params) => {
          //   return h(
          //     "span",
          //     params.row.otherInfo[0].collectionTime !== null ? params.row.otherInfo[0].collectionTime : ''
          //   );
          // }
        },
        {
          title: "对账单号",
          key: "serviceId",
          className: "tc",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  cursor: "pointer",
                  color: "#87CEFA"
                },
                on: {
                  click: () => {
                    this.$refs.idDetailed.modal1 = true;
                    this.$refs.idDetailed.infoData = {
                      orgId:params.row.orgId,
                      guestId:params.row.guestId,
                      accountNo:params.row.accountNo
                    }
                  }
                }
              },
              params.row.serviceId
            );
          }
        },
        {
          title: "往来单位",
          key: "guestName",
          className: "tc"
        },
        {
          title: "收付类型",
          key: "orderTypeName",
          className: "tc",
          render: (h, params) => {
            return h(
              "span","其他应付款"
            );
          }
        },
        {
          title: "实际收付款金额",
          key: "amountCollected",
          className: "tc"
        }
      ], //选择不含税对账单单
      accountData: [], //选择不含税对账单单表格数据
      seleteData: {}, //单选数据
      paymentId: "QTYFK", //收付类型
      paymentList: [], //收付类型下拉框
      remoteloading: false, //搜索框loading
    };
  },
  methods: {
    // 往来单位选择
    async getOne(query) {
      this.company = [];
      if (query != "") {
        this.remoteloading = true;
        findGuest({ fullName: query, size: 20 }).then(res => {
          if (res.code === 0) {
            this.company = [];
            res.data.content.map(item => {
              this.company.push({
                value: item.id,
                label: item.fullName
              });
            });
            this.remoteloading = false;
          }
        });
      } else {
        this.company = [];
      }
    },
    // 对话框是否显示
    visChange(flag) {
      if (flag) {
        //收付类型数据字典
        getDataDictionaryTable({ dictCode: "RECEIVE_PAYMENT_TYPE" }).then(
          res => {
            this.paymentList = [];
            res.data.map(item => {
              this.paymentList.push({
                value: item.itemCode,
                label: item.itemName
              });
            });
          }
        );
        this.seleteQuery();
      }
    },
    changePage(p) {
      this.page.num = p;
      this.query();
    },
    changeSize(size) {
      this.page.num = 1;
      this.page.size = size;
      this.query();
    },
    seleteQuery() {
      this.detailLoading=true;
      let obj = {
        startTime: this.dateQuery[0]
          ? moment(this.dateQuery[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endTime: this.dateQuery[1]
          ? moment(this.dateQuery[1]).format("YYYY-MM-DD 23:59:59")
          : "",
        receivePaymentType: this.paymentId,
        guestId: this.companyId,
        writeOffStatus: "0"
      };
      obj.size = this.page.size;
      obj.page = this.page.num-1;
      findByDynamicQuery(obj).then(res => {
        if (res.code === 0) {
          this.accountData = res.data.content.map(el=>{
            el.orderTypeName="其他应付款"
            return el;
          });
          this.detailLoading=false;
          this.page.total=res.data.totalElements;
        }
      });
    },
    accountNoClick(row){
      this.$refs.idDetailed.modal1 = true;
      // this.$refs.idDetailed.infoData = {
      //   orgId:row.orgId,
      //   guestId:row.guestId,
      //   accountNo:row.accountNo
      // }
    },
    // 日期查询
    query() {
      this.seleteQuery();
    },
    // 确认按钮
    determine() {
      if (this.seleteData && Object.keys(this.seleteData).length !== 0) {
        bus.$emit("accountHedNo", this.seleteData);
        this.modal1 = false;
      } else {
        this.$message.error("请选择一条对账单");
      }
    },
    // 单选数据
    seleteDate(currentRow) {
      let row=currentRow.row;
      let account = this.$parent.$parent.$parent.reconciliationStatement;
      if (row&&account && account.accountNo === row.accountNo) {
        this.$refs.table.clearCurrentRow()
        return this.$message.error("对账单号已存在");
      } else {
        this.seleteData = row;
      }
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
