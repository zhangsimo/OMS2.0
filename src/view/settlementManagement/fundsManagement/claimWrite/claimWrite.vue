<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="db mt20">
          <span>门店：</span>
          <Input v-model="orgName" readonly class="w100" />
          <Button class="ml10">核销对账单</Button>
        </div>
      </div>
      <div class="ml20 mb10">
        <Row>
          <Col span="6">
            <span>对账单勾选金额</span>
          </Col>
          <Col span="3">
            <span>11</span>
          </Col>
          <Col span="6">
            <span>认领款勾选金额</span>
          </Col>
          <Col span="3">
            <span>11</span>
          </Col>
          <Col span="2">
            <span>差异</span>
          </Col>
          <Col span="2">
            <span>11</span>
          </Col>
        </Row>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <Split v-model="split1">
          <div slot="left">
            <h4 class="mb10 p5 pl10" style="background:#F2F2F2">未核销对账单</h4>
            <span>往来单位：</span>
            <Select v-model="companyId" class="w100" filterable>
              <Option v-for="item in company" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <span class="ml10">收付类型：</span>
            <Select v-model="paymentId" class="w100" filterable>
              <Option
                v-for="item in paymentList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
            <span class="ml10">金额：</span>
            <InputNumber v-model="amt" class="w50" />
            <button class="ivu-btn ivu-btn-default ml10 mt10" type="button" @click="queryNoWrite">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
            <Table
              border
              class="mt10"
              :columns="accountNoWrite"
              :data="accountNoWriteData"
              max-height="400"
            ></Table>
            <Page
              show-sizer
              show-total
              show-elevator
              class="mt10 tr mr10"
              size="small"
              :total="accountPage.total"
              :current="accountPage.page"
              :page-size="accountPage.size"
              @on-change="pageChangeNo"
              @on-page-size-change="sizeChangeNo"
            />
          </div>
          <div slot="right" class="h500">
            <Split v-model="split2" mode="vertical">
              <div slot="top">
                <h4 class="mb10 p5 pl10" style="background:#F2F2F2">本店待认领款</h4>
                <span class="ml10">往来单位：</span>
                <Select v-model="companyId" class="w150" filterable>
                  <Option
                    v-for="item in company"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
                <span class="ml10">金额：</span>
                <InputNumber v-model="amt" class="w50" />
                <span class="ml10">对方户名：</span>
                <Input v-model="amt" class="w100" />
                <button class="ivu-btn ivu-btn-default ml10" type="button" @click="queryClaimed">
                  <i class="iconfont iconchaxunicon"></i>
                  <span>查询</span>
                </button>
                <br />
                <Button class="mt10 ml10">撤销分配</Button>
                <Button class="mt10 ml10">预收款认领</Button>
                <Button class="mt10 ml10">预收款支出认领</Button>
                <Button class="mt10 ml10">预付款认领</Button>
                <Button class="mt10 ml10">预付款收回认领</Button>
                <Table border class="mt10" :columns="claimed" :data="claimedData" max-height="400"></Table>
                <Page
                  show-sizer
                  show-total
                  show-elevator
                  class="mt10 tr"
                  size="small"
                  :total="claimedPage.total"
                  :current="claimedPage.page"
                  :page-size="claimedPage.size"
                  @on-change="pageChangeAmt"
                  @on-page-size-change="sizeChangeAmt"
                />
              </div>
              <div slot="bottom">
                <h4 class="mb10 p5 pl10" style="background:#F2F2F2">连锁待分配款项</h4>
                <span class="ml10">区域：</span>
                <Select v-model="companyId" class="w150" filterable>
                  <Option
                    v-for="item in company"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
                <span class="ml10">门店：</span>
                <Select v-model="companyId" class="w150" filterable>
                  <Option
                    v-for="item in company"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
                <span class="ml10">金额：</span>
                <InputNumber v-model="amt" class="w50" />
                <span class="ml10">对方户名：</span>
                <Input v-model="amt" class="w100" />
                <button
                  class="ivu-btn ivu-btn-default ml10 mt10"
                  type="button"
                  @click="queryDistribution"
                >
                  <i class="iconfont iconchaxunicon"></i>
                  <span>查询</span>
                </button>
                <button class="ivu-btn ivu-btn-default ml10 mt10" type="button" @click="queryClaimed">分配至本店</button>
                <Table
                  border
                  class="mt10"
                  :columns="distribution"
                  :data="distributionData"
                  max-height="400"
                ></Table>
                <Page
                  show-sizer
                  show-total
                  show-elevator
                  class="mt10 tr"
                  size="small"
                  :total="distributionPage.total"
                  :current="distributionPage.page"
                  :page-size="distributionPage.size"
                  @on-change="pageChange"
                  @on-page-size-change="sizeChange"
                />
              </div>
            </Split>
          </div>
        </Split>
      </div>
    </section>
  </div>
</template>
<script>
import { getbayer } from "@/api/AlotManagement/threeSupplier";
import { getSupplierList } from "_api/purchasing/purchasePlan";
export default {
  data() {
    return {
      split1: 0.4, //左右面板分割
      split2: 0.52, //上下面板分割
      orgName: "", //门店
      companyId: "", //往来单位
      company: [], //往来单位下拉框
      paymentId: "", //收付类型
      paymentList: [], //收付类型下拉框
      amt: 0, //金额
      accountPage: {
        page: 1,
        total: 12,
        size: 10
      }, //未核销分页
      accountNoWrite: [
        {
          title: "序号",
          type: "index",
          align: "center",
          width: 40
        },
        {
          title: "门店名称",
          key: "orgName",
          align: "center"
        },
        {
          title: "对账单号",
          key: "accountNo",
          align: "center"
        },
        {
          title: "往来单位",
          key: "guestName",
          align: "center"
        },
        {
          title: "收付类型",
          key: "paymentTypeName",
          align: "center"
        },
        {
          title: "实际收款/付款",
          key: "receiptPayment",
          align: "center"
        },
        {
          title: "已收/已付金额",
          key: "name",
          align: "center"
        },
        {
          title: "未收/未付金额",
          key: "name",
          align: "center"
        }
      ], //未核销对账单表格数据
      accountNoWriteData: [], //未核销对账单表格数据
      claimedPage: {
        page: 1,
        total: 12,
        size: 10
      }, //本店待认领款分页
      claimed: [
        {
          title: "选择",
          type: "selection",
          align: "center",
          width: 40
        },
        {
          title: "序号",
          type: "index",
          align: "center",
          width: 40
        },
        {
          title: "所属区域",
          key: "index",
          align: "center"
        },
        {
          title: "所属门店",
          key: "index",
          align: "center"
        },
        {
          title: "所属店号",
          key: "index",
          align: "center"
        },
        {
          title: "账户",
          key: "index",
          align: "center"
        },
        {
          title: "账号",
          key: "index",
          align: "center"
        },
        {
          title: "开户行",
          key: "index",
          align: "center"
        },
        {
          title: "对应科目",
          key: "index",
          align: "center"
        },
        {
          title: "发生日期",
          key: "index",
          align: "center"
        },
        {
          title: "收入金额",
          key: "index",
          align: "center"
        },
        {
          title: "支出金额",
          key: "index",
          align: "center"
        },
        {
          title: "对方户名",
          key: "index",
          align: "center"
        },
        {
          title: "交易备注",
          key: "index",
          align: "center"
        },
        {
          title: "智能匹配往来单位",
          key: "index",
          align: "center"
        }
      ], //本店待认领款
      claimedData: [], //本店待认领款
      distribution: [
        {
          title: "选择",
          type: "selection",
          align: "center",
          width: 40
        },
        {
          title: "序号",
          type: "index",
          align: "center",
          width: 40
        },
        {
          title: "所属区域",
          key: "index",
          align: "center"
        },
        {
          title: "所属门店",
          key: "index",
          align: "center"
        },
        {
          title: "所属店号",
          key: "index",
          align: "center"
        },
        {
          title: "账户",
          key: "index",
          align: "center"
        },
        {
          title: "账号",
          key: "index",
          align: "center"
        },
        {
          title: "开户行",
          key: "index",
          align: "center"
        },
        {
          title: "对应科目",
          key: "index",
          align: "center"
        },
        {
          title: "发生日期",
          key: "index",
          align: "center"
        },
        {
          title: "收入金额",
          key: "index",
          align: "center"
        },
        {
          title: "支出金额",
          key: "index",
          align: "center"
        },
        {
          title: "对方户名",
          key: "index",
          align: "center"
        },
        {
          title: "交易备注",
          key: "index",
          align: "center"
        }
      ], //连锁待分配款项
      distributionData: [], //连锁待分配款项列表
      distributionPage: {
        page: 1,
        total: 12,
        size: 10
      } //连锁待分配款项分页
    };
  },
  mounted() {
    this.getOne();
  },
  methods: {
    // 往来单位选择
    async getOne() {
      const res = await getSupplierList({});
      const res1 = await getbayer({});
      this.company = [];
      let data = [];
      let result = [];
      let obj = {};
      if (res.data.length !== 0 && res1.data.content.length !== 0) {
        data = [...res.data, ...res1.data.content];
      } else if (res.data.length !== 0) {
        data = res.data;
      } else if (res1.data.content.length !== 0) {
        data = res.data.content;
      }
      for (let i in data) {
        if (!obj[data[i].id]) {
          result.push(data[i]);
          obj[data[i].id] = 1;
        }
      }
      data = result;
      data.map(item => {
        this.company.push({
          label: item.fullName,
          value: item.id
        });
      });
    },
    //未核销对账单查询
    queryNoWrite() {
      this.noWrite();
    },
    // 本店待认领款查询
    queryClaimed() {
      this.claimed();
    },
    //连锁待分配款项
    queryDistribution() {
      this.distribution();
    },
    //未核销对账单查询接口
    noWrite() {
      let obj = {
        amt: this.amt,
        guestId: this.companyId,
        type: this.paymentId,
        page: this.accountPage.page,
        size: this.accountPage.size
      };
    },
    //本店待认领款查询接口
    claimedList() {
      let obj = {
        amt: this.amt,
        guestId: this.companyId,
        type: this.paymentId,
        page: this.accountPage.page,
        size: this.accountPage.size
      };
    },
    //连锁待分配款项查询接口
    distributionList() {
      let obj = {
        amt: this.amt,
        guestId: this.companyId,
        type: this.paymentId,
        page: this.accountPage.page,
        size: this.accountPage.size
      };
    },
    //未核销对账单页码改变
    pageChangeNo(val) {
      this.accountPage.page = val;
    },
    //未核销对账单每页条数改变
    sizeChangeNo(val) {
      this.accountPage.size = val;
    },
    //本店待认领款页码
    pageChangeAmt(val) {
      this.claimedPage.page = val;
    },
    //本店待认领款每页条数
    sizeChangeAmt(val) {
      this.claimedPage.size = val;
    },
    // 连锁待分配款项页码
    pageChange(val) {
      this.distributionPage.page = val;
    },
    // 连锁待分配款项每页条数
    sizeChange(val) {
      this.distributionPage.size = val;
    }
  }
};
</script>
<style>
.top-pane, .bottom-pane{
  overflow: auto;
}
</style>