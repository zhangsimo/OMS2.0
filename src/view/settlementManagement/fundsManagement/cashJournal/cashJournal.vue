<template>
  <div class="content-oper content-oper-flex" style="background-color: #fff;">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <quickDate class="mr10" ref="quickDate" @quickDate="quickDate"></quickDate>
          </div>
          <div class="db ml15">
            <span>期间：</span>
            <Date-picker
              :value="value"
              type="daterange"
              placeholder="选择日期"
              class="w200"
              @on-change="dateChange"
            ></Date-picker>
          </div>
          <div class="db ml15">
            <span>区域：</span>
            <Select v-model="model1" filterable class="w150" @on-change="changeArea" :disabled="selectShopList">
              <Option
                v-for="item in Branchstore"
                :value="item.id"
                :key="item.id"
              >{{ item.companyName }}
              </Option>
            </Select>
          </div>
          <div class="db ml15">
            <span>门店：</span>
            <Select v-model="shopCode" filterable class="w150 mr15" :disabled="selectShopList">
              <Option v-for="item in shopList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db">
            <span>会计科目：</span>
            <Select v-model="subjectCode" filterable class="w150" disabled>
              <Option
                v-for="item in subJectList"
                :value="item.id"
                :key="item.id"
              >{{ item.titleName }}
              </Option>
            </Select>
          </div>
          <div class="db ml15">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="query">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
        </div>
      </div>
      <div class="oper-top flex">
        <!--        <div class="db ml5">-->
        <!--          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="importXSL">-->
        <!--            <span>导入日记账</span>-->
        <!--          </button>-->
        <!--        </div>-->
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="dele" v-has="'delete'">
            <span>删除导入</span>
          </button>
        </div>
        <div class="db ml5">
          <button
            class="mr10 ivu-btn ivu-btn-default"
            type="button"
            @click="intellect"
            v-has="'ai'"
          >
            <span>智能匹配</span>
          </button>
        </div>
        <div class="db ml5">
          <button
            class="mr10 ivu-btn ivu-btn-default"
            type="button"
            @click="artificialChange"
            v-has="'people'"
          >
            <span>人工分配</span>
          </button>
        </div>
        <div class="db ml5">
          <button
            class="mr10 ivu-btn ivu-btn-default"
            type="button"
            @click="revocation"
            v-has="'revoke'"
          >
            <span>撤销分配</span>
          </button>
        </div>
        <div class="db ml5">
          <button
            class="mr10 ivu-btn ivu-btn-default"
            type="button"
            @click="goMoney"
            v-has="'clima'"
          >
            <span>资金认领核销</span>
          </button>
        </div>
        <div class="db ml5">
          <button
            class="mr10 ivu-btn ivu-btn-default"
            type="button"
            @click="openAddModal"
            v-has="'add'"
          >
            <span>新增</span>
          </button>
        </div>
        <div class="db ml5">
          <button
            class="mr10 ivu-btn ivu-btn-default"
            type="button"
            @click="openChangeModal"
            v-has="'change'"
          >
            <span>修改</span>
          </button>
        </div>
      </div>
    </section>

    <!-- 导入模板弹窗组件-->
    <importXLS :URL="impirtUrl" ref="imp" @getNewList="getNew"></importXLS>

    <!--    人工智能分配-->
    <artificial ref="art" :list="oneList" @getNew="getNew2"></artificial>

    <!--    余额展示-->
    <amtData :moneyList="allMoneyList"></amtData>

    <!--    新增-->
    <add ref="addModel" @getAllList="allList" @update="getList"></add>

    <!--    修改-->
    <changeJournal :list="oneList" ref="changeModal" @getAllList="allList"  @update="getList"></changeJournal>

    <div class="mt15">
      <Tabs type="card" value="capitalChain1">
        <TabPane label="全部数据" name="capitalChain1">
          <div>
            <vxe-table
              border
              resizable
              show-overflow
              highlight-current-row
              highlight-hover-row
              stripe
              ref="xTable"
              align="center"
              height="500"
              @current-change="getOneList"
              size="mini"
              :data="tableData"
            >
              <vxe-table-column type="seq" title="序号" min-width="60" fixed="left"></vxe-table-column>
              <vxe-table-column field="shopName" title="所属门店" min-width="100"></vxe-table-column>
              <vxe-table-column field="createTime" title="日期" min-width="100"></vxe-table-column>
              <vxe-table-column field="tradingNote" title="交易备注" min-width="100"></vxe-table-column>
              <vxe-table-column field="incomeMoney" title="收入金额" min-width="100"></vxe-table-column>
              <vxe-table-column field="paidMoney" title="支出金额" min-width="100"></vxe-table-column>
              <vxe-table-column field="balanceMoney" title="余额" min-width="60"></vxe-table-column>
              <vxe-table-column field="businessType" title="业务类别" fixed="left" min-width="100"></vxe-table-column>
              <vxe-table-column field="leadHandler" title="导入经办人" min-width="120"></vxe-table-column>
              <vxe-table-column field="claimShopName" title="认领门店" min-width="100"></vxe-table-column>
              <vxe-table-column field="claimShopCode" title="认领店号" min-width="100"></vxe-table-column>
              <vxe-table-column field="certificate" title="凭证摘要" min-width="100"></vxe-table-column>
              <vxe-table-column field="cancelPerson" title="认领核销人" min-width="120"></vxe-table-column>
              <vxe-table-column field="statementNumber" title="核销对账单号" min-width="120"></vxe-table-column>
              <vxe-table-column field="suppliers" title="往来单位" min-width="100"></vxe-table-column>
              <vxe-table-column field="claimNote" title="认领备注" min-width="100"></vxe-table-column>
              <vxe-table-column field="claimType" title="是否认领" min-width="100">
                <template v-slot="{row}">{{row.claimType ? '是':'否'}}</template>
              </vxe-table-column>
              <vxe-table-column field="accountingExaminer" title="会计审核人" min-width="120"></vxe-table-column>
              <vxe-table-column field="checkTime" title="审核时间" min-width="100"></vxe-table-column>
              <vxe-table-column field="proofWords" title="凭证字" min-width="100"></vxe-table-column>
              <vxe-table-column field="proofCode" title="凭证号" min-width="100"></vxe-table-column>
            </vxe-table>
          </div>
        </TabPane>
        <TabPane label="已核销" name="capitalChain2">
          <div>
            <vxe-table
              border
              resizable
              show-overflow
              highlight-current-row
              highlight-hover-row
              stripe
              ref="xTable"
              align="center"
              height="500"
              @current-change="getOneList"
              size="mini"
              :data="tableData1"
            >
              <vxe-table-column type="seq" title="序号" min-width="60" fixed="left"></vxe-table-column>
              <vxe-table-column field="shopName" title="所属门店" min-width="100"></vxe-table-column>
              <vxe-table-column field="createTime" title="日期" min-width="100"></vxe-table-column>
              <vxe-table-column field="tradingNote" title="交易备注" min-width="100"></vxe-table-column>
              <vxe-table-column field="incomeMoney" title="收入金额" min-width="100"></vxe-table-column>
              <vxe-table-column field="paidMoney" title="支出金额" min-width="100"></vxe-table-column>
              <vxe-table-column field="balanceMoney" title="余额" min-width="60"></vxe-table-column>
              <vxe-table-column field="businessType" title="业务类别" fixed="left" min-width="100"></vxe-table-column>
              <vxe-table-column field="leadHandler" title="导入经办人" min-width="120"></vxe-table-column>
              <vxe-table-column field="claimShopName" title="认领门店" min-width="100"></vxe-table-column>
              <vxe-table-column field="claimShopCode" title="认领店号" min-width="100"></vxe-table-column>
              <vxe-table-column field="certificate" title="凭证摘要" min-width="100"></vxe-table-column>
              <vxe-table-column field="cancelPerson" title="认领核销人" min-width="120"></vxe-table-column>
              <vxe-table-column field="statementNumber" title="核销对账单号" min-width="120"></vxe-table-column>
              <vxe-table-column field="suppliers" title="往来单位" min-width="100"></vxe-table-column>
              <vxe-table-column field="claimNote" title="认领备注" min-width="100"></vxe-table-column>
              <vxe-table-column field="claimType" title="是否认领" min-width="100">
                <template v-slot="{row}">{{row.claimType ? '是':'否'}}</template>
              </vxe-table-column>
              <vxe-table-column field="accountingExaminer" title="会计审核人" min-width="120"></vxe-table-column>
              <vxe-table-column field="checkTime" title="审核时间" min-width="100"></vxe-table-column>
              <vxe-table-column field="proofWords" title="凭证字" min-width="100"></vxe-table-column>
              <vxe-table-column field="proofCode" title="凭证号" min-width="100"></vxe-table-column>
            </vxe-table>
          </div>
        </TabPane>
        <TabPane label="未核销" name="capitalChain3">
          <div>
            <vxe-table
              border
              resizable
              show-overflow
              highlight-current-row
              highlight-hover-row
              stripe
              ref="xTable"
              align="center"
              height="500"
              @current-change="getOneList"
              size="mini"
              :data="tableData2"
            >
              <vxe-table-column type="seq" title="序号" min-width="60" fixed="left"></vxe-table-column>
              <vxe-table-column field="shopName" title="所属门店" min-width="100"></vxe-table-column>
              <vxe-table-column field="createTime" title="日期" min-width="60"></vxe-table-column>
              <vxe-table-column field="tradingNote" title="交易备注" min-width="100"></vxe-table-column>
              <vxe-table-column field="incomeMoney" title="收入金额" min-width="100"></vxe-table-column>
              <vxe-table-column field="paidMoney" title="支出金额" min-width="100"></vxe-table-column>
              <vxe-table-column field="balanceMoney" title="余额" min-width="60"></vxe-table-column>
              <vxe-table-column field="businessType" title="业务类别" fixed="left" min-width="100"></vxe-table-column>
              <vxe-table-column field="leadHandler" title="导入经办人" min-width="120"></vxe-table-column>
              <vxe-table-column field="claimShopName" title="认领门店" min-width="100"></vxe-table-column>
              <vxe-table-column field="claimShopCode" title="认领店号" min-width="100"></vxe-table-column>
              <vxe-table-column field="certificate" title="凭证摘要" min-width="100"></vxe-table-column>
              <vxe-table-column field="cancelPerson" title="认领核销人" min-width="120"></vxe-table-column>
              <vxe-table-column field="statementNumber" title="核销对账单号" min-width="120"></vxe-table-column>
              <vxe-table-column field="suppliers" title="往来单位" min-width="100"></vxe-table-column>
              <vxe-table-column field="claimNote" title="认领备注" min-width="100"></vxe-table-column>
              <vxe-table-column field="claimType" title="是否认领" min-width="100">
                <template v-slot="{row}">{{row.claimType ? '是':'否'}}</template>
              </vxe-table-column>
              <vxe-table-column field="accountingExaminer" title="会计审核人" min-width="120"></vxe-table-column>
              <vxe-table-column field="checkTime" title="审核时间" min-width="100"></vxe-table-column>
              <vxe-table-column field="proofWords" title="凭证字" min-width="100"></vxe-table-column>
              <vxe-table-column field="proofCode" title="凭证号" min-width="100"></vxe-table-column>
            </vxe-table>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
  import quickDate from "@/components/getDate/dateget_bill.vue";
  import {creat} from "../../components";
  import importXLS from "../../components/importXLS";
  import artificial from "../../components/artificial";
  import {
    are,
    impUrl,
    goList,
    deleList,
    revocation,
    ait,
    getSubjectType
  } from "@/api/settlementManagement/fundsManagement/capitalChain";
  import {goshop} from "@/api/settlementManagement/shopList";
  import changeJournal from "../components/changeJournal";
  import add from "../components/addJournal";
  import amtData from "../../components/amtData";

  import moment from "moment";

  export default {
    name: 'cashJournal',
    components: {
      quickDate,
      importXLS,
      artificial,
      amtData,
      changeJournal,
      add
    },
    data() {
      return {
        value: [],
        Branchstore: [{id: 0, companyName: "全部"}],
        model1: 0, //获取到地址id
        shopCode: 0, //获取到门店id
        shopList: [{id: '0', name: "全部"}], //门店列表
        subjectCode: new Array(), //科目id
        subJectList: [], //科目列表
        company: "", //往来单位
        companyId: "", //往来单位id
        formInline: {}, //统计数据
        tableData: [], //全部数据
        tableData1: [], //已审核数据
        tableData2: [], //未审核数据
        impirtUrl: {
          downId: "1200000000",
          upUrl: impUrl
        }, //下载上传路径
        oneList: {}, //点击获取到的信息
        allMoneyList: {}, //获取到所有余额信息
        canQuickDateList: false //判断是否可以查询
      };
    },
    async mounted() {
      let arr = await creat(this.$refs.quickDate.val, this.$store);
      this.value = arr[0];
      this.$nextTick(() => {
        this.shopCode = arr[1]
      })
      this.getShop(); //获取门店
      this.getAllAre(); //获取区域
      this.getSubject(); //获取会计科目
    },
    computed: {
      selectShopList() {
        if (this.$store.state.user.userData.currentCompany != null) {
          return this.$store.state.user.userData.currentCompany.isMaster ? true : false
        } else {
          return true
        }
      }
    },
    methods: {
      //获取全部地址
      async getAllAre() {
        let res = await are();
        if (res.code === 0)
          return (this.Branchstore = [...this.Branchstore, ...res.data]);
      },

      // //切换地址重新调取门店接口
      changeArea() {
        if (this.$store.state.user.userData.shopkeeper == 0) {
          this.shopCode = 0;
          this.getShop();
        }
      },

      //获取当前科目
      async getSubject() {
        let res = await getSubjectType()
        if (res.code === 0) {
          this.subJectList = res.data
          if (res.data.length == 0) return
          this.subjectCode.push(res.data[0].id)
        }
      },


      setAreaDef() {
        if (this.Branchstore.length > 0) {
          this.Branchstore.map(item => {
            this.shopList.map(item2 => {
              if (this.selectShopList) {
                if (item.parentId == item2.supplierTypeFirst && item.id == item2.supplierTypeSecond) {
                  this.model1 = item.id
                }
              } else {
                this.model1 = 0
              }
            })
          })
        }
      },
      //获取门店
      async getShop() {
        let data = {}
        let res = await goshop(data)
        if (res.code === 0) {
          this.shopList = [...this.shopList, ...res.data]
          this.setAreaDef()
        }
      },

      // 日期选择
      dateChange(data) {
        this.value = data;
      },
      // 快速查询
      quickDate(data) {
        this.value = data;
        if (this.canQuickDateList) {
          this.getList();
        } else {
          this.canQuickDateList = !this.canQuickDateList;
        }
      },

      //获取表格信息
      async getList() {
        this.oneList = {};
        let data = {};
        let params = {}
        data.signs=1;//区别现金日记账
        params.page = 0;
        params.size = 9999;
        data.startTime = this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD")
          : "";
        data.endTime = this.value[1]
          ? moment(this.value[1]).format("YYYY-MM-DD")
          : "";
        data.areaId = this.model1;
        data.shopNumber = this.shopCode;
        data.subjectId = [this.subjectCode];
        this.allMoneyList = {};
        let res = await goList(params,data);
        if (res.code === 0) {
          //if (res.data.page.content.length > 0) {
            this.allMoneyList = res.data.moneyList;
          //}
          this.tableData = res.data.page.content;
          this.tableData1 = [];
          this.tableData2 = [];
          res.data.page.content.forEach(item => {
            if (item.collateState) {
              this.tableData1.push(item);
            } else {
              this.tableData2.push(item);
            }
          });
        }
      },

      //查询
      query() {
        this.getList();
      },

      //点击获取表格数据
      getOneList(val) {
        this.oneList = val.row;
      },

      //打开导入模板下载
      importXSL() {
        this.$refs.imp.openModal();
      },

      //导入成功后刷新页
      getNew(data) {
        this.getList();
      },

      //人工分配成功后刷新
      getNew2() {
        this.getList();
      },

      //删除导入
      dele() {
        if (Object.keys(this.oneList).length == 0)
          return this.$Message.error("请至少选择一条数据");
        if (this.oneList.collateState)
          return this.$Message.error("已核销数据不能删除");
        this.$Modal.confirm({
          title: "提示",
          content: "<p>是否删除该条数据</p>",
          onOk: async () => {
            let data = {};
            data.id = this.oneList.id;
            let res = await deleList(data);
            if (res.code === 0) {
              this.getList();
              this.$Message.success("删除成功");
            }
          },
          onCancel: () => {
          }
        });
      },

      //智能匹配
      async intellect() {
        this.$Modal.confirm({
          title: "提示",
          content: "<p>是否执行智能匹配</p>",
          onOk: async () => {
            let res = await ait();
            if (res.code === 0) {
              this.$XModal.alert({
                title: "提示",
                message: res.data,
                status: "success"
              });
              this.getList();
            }
          },
          onCancel: () => {
          }
        });
      },

      //打开新增模态框
      openAddModal() {
        this.oneList = {};
        this.$refs.addModel.open();
      },

      //修改模态框
      openChangeModal() {
        if (Object.keys(this.oneList).length < 1)
          return this.$Message.error("请至少选择一条数据");
        if (this.oneList.collateState == 1)
          return this.$Message.error("只能修改未核销数据");
        this.$refs.changeModal.open();
      },

      //修改成功后刷新页面
      allList() {
        this.getList();
      },

      //人工匹配
      artificialChange() {
        if (Object.keys(this.oneList).length == 0)
          return this.$Message.error("请至少选择一条数据");
        if (this.oneList.allocation) return this.$Message.error("数据已分配");
        this.$refs.art.openModal();
      },

      //撤销分配
      async revocation() {
        if (Object.keys(this.oneList).length == 0)
          return this.$Message.error("请至少选择一条数据");
        if (!this.oneList.allocation)
          return this.$Message.error("请选择已分配的数据");
        this.$Modal.confirm({
          title: "提示",
          content: "<p>是否撤回分配</p>",
          onOk: async () => {
            let data = {};
            data.id = this.oneList.id;
            let res = await revocation([this.oneList.id]);
            if (res.code === 0) {
              this.$Message.success("撤销分配成功");
              this.getList();
            }
          }
        });
      },

      //资金认领核销
      goMoney() {
        this.$router.push({name: "claimWrite"});
      }
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
