<template>
  <div
    class="content-oper content-oper-flex loadingClass"
    style="background-color: #fff"
  >
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db ml15">
            <span>发生日期：</span>
            <Date-picker
              :clearable="noclear"
              v-model="date"
              type="daterange"
              placeholder="选择日期"
              class="w200"
            ></Date-picker>
          </div>
          <!--          type="daterange"-->
          <div class="db ml15">
            <span>门店：</span>
            <Select :disabled="selectShopList" class="w150" v-model="store">
              <Option
                v-for="(item, index) in Branchstore"
                :value="item.id"
                :key="item.id"
                >{{ item.shortName }}
              </Option>
            </Select>
          </div>
          <!--          <div class="db ml15">-->
          <!--            <span>对应科目：</span>-->
          <!--            <Select v-model="subjectId" class="w150">-->
          <!--              <Option-->
          <!--                v-for="item in subjecties"-->
          <!--                :value="item.id"-->
          <!--                :key="item.id"-->
          <!--                >{{ item.titleName }}</Option-->
          <!--              >-->
          <!--            </Select>-->
          <!--          </div>-->
          <div class="db ml15">
            <span>对应科目：</span>
            <el-cascader
              ref="casecader"
              size="small"
              :options="options"
              @change="getKemuList"
              :props="{
                multiple: true,
                children: 'children',
                label: 'titleName',
                value: 'id',
              }"
              collapse-tags
              clearable
            ></el-cascader>
          </div>
          <div class="db ml15">
            <span>凭证生成状态：</span>
            <Select v-model="proofState" class="w150">
              <Option
                v-for="item in proofStateList"
                :value="item.id"
                :key="item.id"
                >{{ item.name }}
              </Option>
            </Select>
          </div>
          <!--          <div class="db ml15" style="line-height: 28px">-->
          <!--            <Checkbox class="mr5" v-model="single" :true-value="1"  :false-value="0" />-->
          <!--            <span>显示待修改凭证</span>-->
          <!--          </div>-->
          <div class="db ml15">
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="query"
            >
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="getExport"
              v-has="'export'"
            >
              <span>导出</span>
            </button>
          </div>
          <div class="db ml5">
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="SubmitAudit"
              v-has="'aduit'"
            >
              <span>审核</span>
            </button>
          </div>

          <div class="db ml5">
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              :disabled="status != 1 || oneList.length <= 0"
              @click="reAudit"
              v-has="'backAudit'"
            >
              <span>撤销审核</span>
            </button>
          </div>

          <div class="db ml5">
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="putVoucher"
              v-has="'change'"
            >
              <span>修改凭证</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <div class="mt15">
      <Tabs type="card" value="capitalChain1" @on-click="changeTabs">
        <TabPane label="未审核" name="capitalChain1">
          <vxe-table
            border
            show-overflow
            highlight-current-row
            highlight-hover-row
            stripe
            resizable
            ref="capitalChain1"
            align="center"
            max-height="500"
            @checkbox-all="selectAllEvent"
            @checkbox-change="selectChangeEvent"
            size="mini"
            :sort-config="{ trigger: 'cell', orders: ['desc', 'asc', null] }"
            :data="tableData"
          >
            <vxe-table-column
              type="checkbox"
              width="60"
              fixed="left"
            ></vxe-table-column>
            <vxe-table-column
              type="seq"
              title="序号"
              fixed="left"
              width="60"
            ></vxe-table-column>
            <vxe-table-column
              field="importTime"
              fixed="left"
              title="导入时间"
              sortable
              width="150"
            ></vxe-table-column>
            <vxe-table-column
              field="createTime"
              fixed="left"
              title="发生日期"
              sortable
              width="150"
            ></vxe-table-column>
            <vxe-table-column
              field="tradingNote"
              fixed="left"
              title="交易备注"
              width="150"
            ></vxe-table-column>
            <vxe-table-column
              field="openingBalance"
              title="期初余额"
              sortable
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="incomeMoney"
              title="收入金额"
              sortable
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="paidMoney"
              title="支出金额"
              sortable
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="balanceMoney"
              title="期末余额"
              sortable
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="reciprocalAccountName"
              title="对方户名"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="businessType"
              title="业务类别"
              width="150"
            ></vxe-table-column>
            <vxe-table-column
              field="claimShopCode"
              title="认领店号"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="statementNumber"
              title="核销对账单号"
              width="180"
            ></vxe-table-column>
            <vxe-table-column
              field="suppliers"
              title="往来单位"
              width="160"
            ></vxe-table-column>
            <vxe-table-column
              field="proofCode"
              title="凭证号"
              width="180"
            ></vxe-table-column>
            <vxe-table-column
              field="accountName"
              title="账户"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="mateAccountName"
              title="对应科目"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="checkAccount"
              title="对账账号"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="reciprocalBankName"
              title="对方开户行"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="shopCode"
              title="所属店号"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="area"
              title="所属区域"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="shopName"
              title="所属门店"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="accountCode"
              title="账号"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="bankName"
              title="开户行"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="leadHandler"
              title="导入经办人"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="claimShopName"
              title="认领门店"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="certificate"
              title="凭证摘要"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="cancelPerson"
              title="认领核销人"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="claimNote"
              title="认领备注"
              width="100"
            ></vxe-table-column>
            <vxe-table-column field="claimType" title="是否认领" width="100">
              <template v-slot="{ row }">
                {{ row.claimType ? "是" : "否" }}
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="accountingExaminer"
              title="会计审核人"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="checkTime"
              title="审核时间"
              width="150"
            ></vxe-table-column>
            <vxe-table-column
              field="proofWords"
              title="凭证字"
              width="100"
            ></vxe-table-column>
          </vxe-table>
          <Page
            size="small"
            :total="page.total"
            :page-size="page.size"
            :current="page.num"
            show-sizer
            show-total
            show-elevator
            transfer
            :page-size-opts="[20, 40, 60, 80, 100]"
            @on-change="selectNumpersonage"
            @on-page-size-change="selectPagepersonage"
            style="float: right; margin-top: 10px; margin-right: 10px"
          />
        </TabPane>
        <TabPane label="已审核" name="capitalChain2">
          <div>
            <vxe-table
              border
              show-overflow
              highlight-current-row
              highlight-hover-row
              stripe
              auto-resize
              resizable
              ref="capitalChain2"
              align="center"
              max-height="500"
              @checkbox-all="selectAllEvent"
              @checkbox-change="selectChangeEvent"
              size="mini"
              :sort-config="{ trigger: 'cell', orders: ['desc', 'asc', null] }"
              :data="tableData1"
            >
              <vxe-table-column
                type="checkbox"
                width="60"
                fixed="left"
              ></vxe-table-column>
              <vxe-table-column
                type="seq"
                title="序号"
                fixed="left"
                width="60"
              ></vxe-table-column>
              <vxe-table-column
                field="importTime"
                fixed="left"
                title="导入时间"
                sortable
                width="150"
              ></vxe-table-column>
              <vxe-table-column
                field="createTime"
                fixed="left"
                title="发生日期"
                sortable
                width="150"
              ></vxe-table-column>
              <vxe-table-column
                field="tradingNote"
                fixed="left"
                title="交易备注"
                width="150"
              ></vxe-table-column>
              <vxe-table-column
                field="openingBalance"
                title="期初余额"
                sortable
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="incomeMoney"
                title="收入金额"
                sortable
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="paidMoney"
                title="支出金额"
                sortable
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="balanceMoney"
                title="期末余额"
                sortable
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="reciprocalAccountName"
                title="对方户名"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="businessType"
                title="业务类别"
                width="150"
              ></vxe-table-column>
              <vxe-table-column
                field="claimShopCode"
                title="认领店号"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="statementNumber"
                title="核销对账单号"
                width="180"
              ></vxe-table-column>
              <vxe-table-column
                field="suppliers"
                title="往来单位"
                width="160"
              ></vxe-table-column>
              <vxe-table-column
                field="proofCode"
                title="凭证号"
                width="180"
              ></vxe-table-column>
              <vxe-table-column
                field="accountName"
                title="账户"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="mateAccountName"
                title="对应科目"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="checkAccount"
                title="对账账号"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="reciprocalBankName"
                title="对方开户行"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="shopCode"
                title="所属店号"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="area"
                title="所属区域"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="shopName"
                title="所属门店"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="accountCode"
                title="账号"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="bankName"
                title="开户行"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="leadHandler"
                title="导入经办人"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="claimShopName"
                title="认领门店"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="certificate"
                title="凭证摘要"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="cancelPerson"
                title="认领核销人"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="claimNote"
                title="认领备注"
                width="100"
              ></vxe-table-column>
              <vxe-table-column field="claimType" title="是否认领" width="100">
                <template v-slot="{ row }">
                  {{ row.claimType ? "是" : "否" }}
                </template>
              </vxe-table-column>
              <vxe-table-column
                field="accountingExaminer"
                title="会计审核人"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="checkTime"
                title="审核时间"
                width="150"
              ></vxe-table-column>
              <vxe-table-column
                field="proofWords"
                title="凭证字"
                width="100"
              ></vxe-table-column>
            </vxe-table>
          </div>
          <Page
            size="small"
            :total="page1.total"
            :page-size="page1.size"
            :current="page1.num"
            show-sizer
            show-total
            show-elevator
            transfer
            :page-size-opts="[20, 40, 60, 80, 100]"
            @on-change="selectNumpersonage1"
            @on-page-size-change="selectPagepersonage1"
            style="float: right; margin-top: 10px; margin-right: 10px"
          />
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
    <Modal v-model="shenhe" title="资金审核">
      <div class="db ml15">
        <span>审核日期：</span>
        <Date-picker
          clearable
          v-model="date2"
          type="date"
          placeholder="选择日期"
          class="w200"
        ></Date-picker>
      </div>
      <div slot="footer">
        <Button type="primary" @click="shenheOk">确认</Button>
        <Button @click="shenheCancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getTableList } from "@/api/accountant/accountant";
import { goshop } from "@/api/settlementManagement/shopList";
import * as api from "@/api/settlementManagement/financialStatement";
import moment from "moment";
import { creat } from "./../components";
import * as tools from "_utils/tools";
import { showLoading, hideLoading } from "@/utils/loading";

export default {
  name: "accountings",
  components: {},
  data() {
    return {
      // 数据类
      oneList: [], // 表格选中
      status: 0, // 当前tabs 0未审核， 1已审核
      tableData: [], // 未审核
      tableData1: [], // 已审核
      date: "", // 发生日期
      store: "", // 门店code
      // single:0,//复选框状态
      Branchstore: [{ id: "0", name: "全部", shortName: "全部" }], //分店名称
      subjectId: "0", // 对应科目id
      subjecties: [{ id: "0", titleName: "全部" }], // 科目
      content: "", // 撤销原因
      // 状态类
      isShow: false, // 撤销原因modal
      page: {
        num: 1,
        size: 20,
        total: 0,
      },
      page1: {
        num: 1,
        size: 20,
        total: 0,
      },
      proofState: 0, //凭证生成状态
      proofStateList: [
        { name: "全部", id: 0 },
        { name: "成功", id: 1 },
        { name: "失败", id: 2 },
      ],
      noclear: true,
      mateAccountCode: "", //对应科目
      options: [],
      date2: "",
      shenhe: false,
    };
  },
  async mounted() {
    await this.getTreeListFun();
    let arr = await creat("", this.$store);
    await this.getShop();
    this.store = arr[1];
    this.query();
  },
  computed: {
    selectShopList() {
      if (this.$store.state.user.userData.currentCompany != null) {
        return this.$store.state.user.userData.currentCompany.isMaster
          ? true
          : false;
      } else {
        return true;
      }
    },
  },
  methods: {
    //获取门店
    async getShop() {
      let data = {};
      let res = await goshop(data);
      if (res.code === 0)
        return (this.Branchstore = [...this.Branchstore, ...res.data]);
    },
    // 获取科目列表
    // async getSubjecties() {
    //   let data = {};
    //   data.parentCode = 101;
    //   let res = await getTableList(data);
    //   if (res.code === 0) {
    //     this.subjecties = [...this.subjecties, ...res.data];
    //   }
    // },
    //获取科目
    async getTreeListFun() {
      let rep2 = await getTableList({ parentCode: 101 });
      if (rep2.code == 0) {
        let content = rep2.data || [];
        this.options = this.treeDataFun(content);
      }
    },
    treeDataFun(content) {
      let level1 = content.filter(
        (item) =>
          item.titleLevel === 1 &&
          (item.titleCode == "1001" ||
            item.titleCode == "1002" ||
            item.titleCode == "1012")
      );
      return this.treeFilterData(level1, content);
    },
    treeFilterData(treeData, content) {
      treeData.map((item) => {
        let arrData = content.filter(
          (item1) => item1.parentCode == item.titleCode
        );
        if (arrData.length > 0) {
          item.children = this.treeFilterData(arrData, content);
        } else {
          item.children = null;
        }
      });
      return treeData;
    },
    getKemuList(v) {
      if (v.length == 0) {
        return (this.mateAccountCode = "");
      }
      let req = [];
      v.map((item) => {
        if (item.length > 0) {
          let end = item.slice(-1);
          if (end.length > 0) {
            end = end.map((item) => {
              return `'${item}'`;
            });
          }
          req.push(end.join(""));
        }
      });
      this.mateAccountCode = req.join(",");
    },
    //导出
    getExport() {
      if (
        this.tableData.length <= 0 ||
        this.tableData1.length <= 0
        
      ) {
        return this.$message.warning("暂无数据导出");
      }
      let data = {};

      // data.areaId = this.model1;
      // data.shopNumber = this.shopCode;
      // data.subjectId = this.subjectCode.length <= 0 ? "" : this.subjectCode;
      // data.accountName = this.accountName;
      // data.bankName = this.bankName;
      data.pagesize =this.page1.total+this.page.total;
      data.PageType = 2;
      let params = "";
      this.oneList = [];
      data.shopNumber= this.store == "0" ? "" : this.store,
      data.mateAccountCode= this.mateAccountCode ? this.mateAccountCode : ""
      
      // console.log(this.date[0]!="",1111)
      if (this.date[0] != "") {
       data.startTime = tools.transDate(this.date[0]) + " 00:00:00";
       data.endTime = tools.transDate(this.date[1]) + " 23:59:59";
      } else {
       data.startTime = "";
       data.endTime = "";
      }
      
     data.proofState = this.proofState;
      for (let d in data) {
        if (!data[d]) {
          delete data[d];
        }
      }
      for (var i in data) {
        params += `${i}=${data[i]}&`;
      }
      console.log(params)
    },
    // 获取列表
    async getTable() {
      // let userdata = this.$store.state.user.userData;
      // this.store = userdata.shopId;
      // console.log(this.store,this.Branchstore,111)
      this.oneList = [];
      let params = {
        shopNumber: this.store == "0" ? "" : this.store,
        mateAccountCode: this.mateAccountCode ? this.mateAccountCode : "",
      };
      // console.log(this.date[0]!="",1111)
      if (this.date[0] != "") {
        params.startTime = tools.transDate(this.date[0]) + " 00:00:00";
        params.endTime = tools.transDate(this.date[1]) + " 23:59:59";
      } else {
        params.startTime = "";
        params.endTime = "";
      }
      // this.date!=""?params.startTime=tools.transDate(this.date[0])+" 00:00:00":""
      // this.date!=""?params.endTime=tools.transDate(this.date[1])+" 23:59:59":""
      // params.occurTime = this.date ? moment(this.date).format("YYYY-MM-DD") : ''
      // for (let key in params) {
      //   if (!params[key]) {
      //     Reflect.deleteProperty(params, key);
      //   }
      // }
      params.proofState = this.proofState;
      try {
        showLoading(".loadingClass", "数据加载中，请勿操作");
        // 未审核
        let res1 = await api.findCertificationAudit({
          ...params,
          auditState: 0,
          page: this.page.num - 1,
          size: this.page.size,
        });
        // 已审核
        let res2 = await api.findCertificationAudit({
          ...params,
          auditState: 1,
          page: this.page1.num - 1,
          size: this.page1.size,
        });
        if (res1.code == 0) {
          this.tableData = res1.data.content;
          this.page.total = res1.data.totalElements;
        }
        if (res2.code == 0) {
          this.tableData1 = res2.data.content;
          this.page1.total = res2.data.totalElements;
        }
        hideLoading();
      } catch (error) {
        hideLoading();
      }
    },
    // 查询
    query() {
      this.page.num = 1;
      this.page1.num = 1;
      this.getTable();
    },

    //未审核分页
    //未审核分页切换页数
    selectNumpersonage(page) {
      this.page.num = page;
      this.getTable();
    },

    //未审核分页分页条数
    selectPagepersonage(size) {
      this.page.num = 1;
      this.page.size = size;
      this.getTable();
    },

    //已审核分页
    //已审核分页切换页数
    selectNumpersonage1(page) {
      this.page1.num = page;
      this.getTable();
    },

    //已审核分页分页条数
    selectPagepersonage1(size) {
      this.page1.num = 1;
      this.page1.size = size;
      this.getTable();
    },

    changeTabs(data) {
      if (data === "capitalChain1") {
        this.status = 0;
      } else {
        this.status = 1;
      }
      this.oneList = [];
      this.$refs[data].clearCheckboxRow();
    },
    //点击获取表格数据
    selectAllEvent({ checked, records }) {
      // console.log(checked ? "所有勾选事件" : "所有取消事件", records);
      this.oneList = records || [];
    },
    selectChangeEvent({ checked, records }) {
      // console.log(checked ? "勾选事件" : "取消事件", records);
      this.oneList = records || [];
    },
    // 审核
    SubmitAudit() {
      this.shenhe = true;
    },
    //确认审核
    async shenheOk() {
      let occurTime = "";
      if (this.date2) {
        occurTime = moment(this.date2).format("YYYY-MM-DD");
      }
      let mateAccountCode = this.subjectId;
      if (!occurTime) {
        return this.$message.error("发生日期必须选择！");
      }
      showLoading(".loadingClass");
      this.shenhe = false;
      let ids = this.oneList.map((el) => el.id);
      let res = await api.certificationAudit({
        ids,
        occurTime,
        shopNumber: this.store,
        mateAccountCode,
      });
      if (res.code == 0) {
        if (res.data instanceof Array) {
          if (res.data[0]) {
            this.$message.error(res.data[0]);
          } else {
            this.$message.success("审核成功！");
          }
        }
        this.query();
        hideLoading();
      } else {
        hideLoading();
      }
      this.query();
    },
    // 取消审核
    shenheCancel() {
      this.shenhe = false;
      this.date2 = "";
    },
    // 撤销审核
    reAudit() {
      this.isShow = true;
      this.content = "";
    },
    // 撤销审核 ok
    async reAuditOk() {
      let occurTime = "";
      if (this.date) {
        occurTime = moment(this.date).format("YYYY-MM-DD");
      }
      let mateAccountCode = this.subjectId;
      if (!occurTime) {
        return this.$message.error("发生日期必须选择！");
      }
      if (!mateAccountCode) {
        return this.$message.error("对应科目必须选择！");
      }
      let remarks = this.content.trim();
      if (remarks.length <= 0) {
        return this.$message.error("请输入撤销原因");
      }
      let ids = this.oneList.map((el) => el.id);
      let res = await api.certificationAuditRevocation({
        ids,
        remarks,
        occurTime,
        mateAccountCode,
        shopNumber: this.store,
      });
      if (res.code == 0) {
        this.$message.success(res.data);
        this.isShow = false;
        this.query();
      }
    },
    // 修改凭证
    putVoucher() {},
  },
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
