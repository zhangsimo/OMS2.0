<template>
  <Modal v-model="modal1" title="对账单查询" width="1000" @on-visible-change="visChange">
    <span class="mr5">对账期间：</span>
    <DatePicker v-model="dateQuery" class="mr10" type="daterange" placement="bottom-start"
                style="width: 200px"></DatePicker>
    <Checkbox v-model="checkSingle" @on-change="canShopList" :disabled="paymentId != 'YJDZ'">是否跨店搜索</Checkbox>
    <span class="ml10">往来单位：</span>
    <Select
      ref="companyGuset"
      v-model="companyName"
      filterable
      clearable
      remote
      class="w150"
      :disabled="isCanChange"
      :remote-method="getOrignCompany"
      @on-change="getAccountNameListFun"
      @on-query-change="queryChange"
      :loading="searchLoading">
      <Option v-for="(option, index) in company" :value="option.id" :key="index">{{option.fullName}}</Option>
    </Select>
    <!--<Select v-model="companyId" class="w150" filterable>-->
    <!--<Option v-for="item in company" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
    <!--</Select>-->
    <span class="ml10">收付款类型：</span>
    <Select v-model="paymentId" class="w150" filterable disabled>
      <Option v-for="item in paymentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <Button @click="query" class="ml10">查询</Button>
    <!--    <Table-->
    <!--      class="mt10"-->
    <!--      :columns="account"-->
    <!--      :data="accountData"-->
    <!--      ref="table"-->
    <!--      max-height="450"-->
    <!--      highlight-row-->
    <!--      @on-current-change="seleteDate"-->
    <!--    ></Table>-->
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
      <vxe-table-column field="orgName" title="门店" min-width="80"></vxe-table-column>
      <vxe-table-column field="createTime" title="对账日期" min-width="100"></vxe-table-column>
      <vxe-table-column title="对账单号" min-width="100">
        <template v-slot="{row}">
          <span style="cursor:pointer;color:#87CEFA" @click="accountNoClick(row)">{{row.accountNo}}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="guestName" title="往来单位" min-width="80"></vxe-table-column>
      <vxe-table-column field="receivePaymentTypeName" title="收付类型" min-width="100"></vxe-table-column>
      <vxe-table-column field="actualCollectionOrPayment" title="实际收付款金额" min-width="180"></vxe-table-column>
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
    <idDetailed ref="idDetailed"/>
    <!-- <selectDealings ref="selectDealings" @selectSearchName="getOne"  /> -->
  </Modal>
</template>
<script>
  import idDetailed from "./idDetailed";
  import {findGuest} from "_api/settlementManagement/advanceCollection.js";
  import {findAccount} from "_api/settlementManagement/seleteAccount.js";
  import {getDataDictionaryTable} from "@/api/system/dataDictionary/dataDictionaryApi"; /*拉取收付款类型字典详情*/
  import bus from "../Popup/Bus";
  import moment from "moment";

  export default {
    props: ["information", "accountNo", 'stateType'],
    components: {
      idDetailed
      // selectDealings
    },
    data() {
      return {
        dateQuery: "", //时间
        company: [], //往来单位
        companyId: "", //往来单位id
        companyName: "",//往来单位name
        searchLoading: false,
        modal1: false, //弹窗展示
        page: {
          num: 1,
          size: 10,
          total: 0,
          sizeArr: [10, 20, 30, 50, 100]
        },
        account: [
          {
            title: "序号",
            type: "index",
            width: 40,
            className: "tc"
          },
          {
            title: "门店",
            key: "orgName",
            className: "tc"
          },
          {
            title: "对账日期",
            key: "createTime",
            className: "tc"
          },
          {
            title: "对账单号",
            key: "accountNo",
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
                        orgId: params.row.orgId,
                        guestId: params.row.guestId,
                        accountNo: params.row.accountNo
                      }
                    }
                  }
                },
                params.row.accountNo
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
            key: "receivePaymentTypeName",
            className: "tc"
          },
          {
            title: "实际收付款金额",
            key: "actualCollectionOrPayment",
            className: "tc"
          }
        ], //选择不含税对账单单
        accountData: [], //选择不含税对账单单表格数据
        detailLoading: false,//loading
        seleteData: {}, //单选数据
        paymentId: "YJDZ", //收付类型
        paymentList: [], //收付类型下拉框,
        sort: '', // 判断是预收款还是预付款其他为空
        isCanChange: false,//往来单位是否可选
        checkSingle: false,
      };
    },
    methods: {
      //  是否可以跨店搜索
      canShopList(e) {
        this.$refs.companyGuset.query = this.$parent.$parent.reconciliationStatement.guestName || ""
        this.companyId = this.$parent.$parent.reconciliationStatement.guestId || "";
        this.seleteQuery();
        this.isCanChange = e
      },

      //获取往来单位
      async getOrignCompany(query) {
        if (query !== '') {
          this.searchLoading = true;
          let req = {
            fullName: query,
            size: 100,
          }
          let rep = await findGuest(req);
          this.searchLoading = false;
          if (rep.code == 0) {
            this.company = rep.data.content;
          }
        } else {
          this.company = [];
        }
      },
      changePage(p) {
        this.page.num = p;
        this.seleteQuery();
      },
      changeSize(size) {
        this.page.num = 1;
        this.page.size = size;
        this.seleteQuery();
      },
      accountNoClick(row) {
        this.$refs.idDetailed.modal1 = true;
        this.$refs.idDetailed.infoData = {
          orgId: row.orgId,
          guestId: row.guestId,
          accountNo: row.accountNo
        }
      },
      // 对话框是否显示
      visChange(flag) {
        if (flag) {
          this.companyId = this.$parent.$parent.reconciliationStatement.guestId || "";
          this.$refs.companyGuset.query = this.$parent.$parent.reconciliationStatement.guestName || ""
          //收付类型数据字典
          getDataDictionaryTable({dictCode: "RECEIVE_PAYMENT_TYPE"}).then(
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
          // this.getOne();
          this.seleteQuery();
        }
      },
      //往来单位搜索词改变触发
      queryChange(v) {
        if (v.trim() === '') {
          this.companyId = ''
        }
      },
      //往来单位选中option改变触发
      getAccountNameListFun(v) {
        this.companyId = v;
        this.seleteQuery();
      },
      seleteQuery() {
        this.detailLoading = true;
        let obj = {
          startDate: this.dateQuery[0]
            ? moment(this.dateQuery[0]).format("YYYY-MM-DD HH:mm:ss")
            : "",
          endDate: this.dateQuery[1]
            ? moment(this.dateQuery[1]).format("YYYY-MM-DD 23:59:59")
            : "",
          receivePaymentType: this.paymentId,
          guestId: this.companyId,
          sort: this.sort,
          crossStoreSearch: this.checkSingle ? 1 : 0
        };
        // if (this.accountNo) {
        //   obj.accountNo = this.accountNo;
        // }
        obj.size = this.page.size;
        obj.page = this.page.num - 1;
        findAccount(obj).then(res => {
          if (res.code === 0) {
            this.accountData = res.data.content;
            this.detailLoading = false;
            this.page.total = res.data.totalElements;
          }
        });
      },
      // 日期查询
      query() {
        this.page.num = 1
        this.seleteQuery();
      },
      // 确认按钮
      determine() {
        if (this.seleteData && Object.keys(this.seleteData).length !== 0) {
          // console.log(this.seleteData ,456)
          // console.log(this.$parent)
          if ((this.stateType == 1 || this.stateType == 2)&&this.$parent.$parent.reconciliationStatement.accountNo.indexOf(",")!=-1) {
            //对账单冲减预收 冲减预付 只可选两条
            this.$Modal.confirm({
              title: '提示',
              content: '<p>一次只能核销一笔账单，是否确认替换之前账单？</p>',
              onOk: async () => {
                bus.$emit("accountHedNo", this.seleteData, this.seleteData.accountNo);
                this.modal1 = false;
                return
              },
              onCancel: () => {

              }
            });
          }else{
            bus.$emit("accountHedNo", this.seleteData, this.seleteData.accountNo);
            this.modal1 = false;
          }
        } else {
          this.$message.error("请选择一条对账单");
        }
      },
      // 单选数据
      seleteDate(currentRow) {
        let row = currentRow.row;
        let list = this.$parent.$parent.BusinessType;
        if (row && list.find(item => item.accountNo === row.accountNo)) {
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
