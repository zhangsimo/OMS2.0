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
            <Date-picker :value="value" type="daterange" placeholder="选择日期" class="w200"></Date-picker>
          </div>
          <div class="db ml15">
            <span>门店：</span>
            <Select v-model="shopCode" filterable class="w150 mr10">
              <Option
                v-for="item in Branchstore"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
            <span>对应科目：</span>
            <Input value="库存现金" class="w100" />
            <button class="ml10 ivu-btn ivu-btn-default" type="button" @click="query">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
        </div>
      </div>
      <div class="oper-top flex">
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="deleteExport">
            <span>删除导入</span>
          </button>
        </div>
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="intelligent">
            <span>智能匹配</span>
          </button>
        </div>
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="distribution">
            <span>人工分配</span>
          </button>
        </div>
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="distributionDelete">
            <span>撤销分配</span>
          </button>
        </div>
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="capitalWrite">
            <span>资金认领核销</span>
          </button>
        </div>
      </div>
    </section>
    <amtData ref="amtData" />
    <div class="mt15">
      <Tabs type="card" value="capitalChain1">
        <TabPane label="全部数据" name="capitalChain1">
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
              max-height="500"
              @current-change="getOneList"
              size="mini"
              style="width: 3000px"
              :data="tableData"
            >
              <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
              <vxe-table-column field="name" title="所属门店"></vxe-table-column>
              <vxe-table-column field="age" title="日期"></vxe-table-column>
              <vxe-table-column field="date" title="录入备注"></vxe-table-column>
              <vxe-table-column field="address" title="收入金额"></vxe-table-column>
              <vxe-table-column field="address" title="支出金额"></vxe-table-column>
              <vxe-table-column field="address" title="余额"></vxe-table-column>
              <vxe-table-column field="address" title="是否认领"></vxe-table-column>
              <vxe-table-column field="address" title="业务类别"></vxe-table-column>
              <vxe-table-column field="address" title="导入经办人"></vxe-table-column>
              <vxe-table-column field="address" title="认领门店"></vxe-table-column>
              <vxe-table-column field="address" title="认领店号"></vxe-table-column>
              <vxe-table-column field="address" title="凭证摘要"></vxe-table-column>
              <vxe-table-column field="address" title="认领核销人"></vxe-table-column>
              <vxe-table-column field="address" title="核销对账单号"></vxe-table-column>
              <vxe-table-column field="address" title="往来单位"></vxe-table-column>
              <vxe-table-column field="address" title="认领备注"></vxe-table-column>
            </vxe-table>
          </div>
        </TabPane>
        <TabPane label="已核销" name="capitalChain2">
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
              max-height="500"
              @current-change="getOneList"
              size="mini"
              style="width: 3000px"
              :data="tableData"
            >
              <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
              <vxe-table-column field="name" title="所属门店"></vxe-table-column>
              <vxe-table-column field="age" title="日期"></vxe-table-column>
              <vxe-table-column field="date" title="录入备注"></vxe-table-column>
              <vxe-table-column field="address" title="收入金额"></vxe-table-column>
              <vxe-table-column field="address" title="支出金额"></vxe-table-column>
              <vxe-table-column field="address" title="余额"></vxe-table-column>
              <vxe-table-column field="address" title="是否认领"></vxe-table-column>
              <vxe-table-column field="address" title="业务类别"></vxe-table-column>
              <vxe-table-column field="address" title="导入经办人"></vxe-table-column>
              <vxe-table-column field="address" title="认领门店"></vxe-table-column>
              <vxe-table-column field="address" title="认领店号"></vxe-table-column>
              <vxe-table-column field="address" title="凭证摘要"></vxe-table-column>
              <vxe-table-column field="address" title="认领核销人"></vxe-table-column>
              <vxe-table-column field="address" title="核销对账单号"></vxe-table-column>
              <vxe-table-column field="address" title="往来单位"></vxe-table-column>
              <vxe-table-column field="address" title="认领备注"></vxe-table-column>
            </vxe-table>
          </div>
        </TabPane>
        <TabPane label="未核销" name="capitalChain3">
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
              max-height="500"
              @current-change="getOneList"
              size="mini"
              style="width: 3000px"
              :data="tableData"
            >
              <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
              <vxe-table-column field="name" title="所属门店"></vxe-table-column>
              <vxe-table-column field="age" title="日期"></vxe-table-column>
              <vxe-table-column field="date" title="录入备注"></vxe-table-column>
              <vxe-table-column field="address" title="收入金额"></vxe-table-column>
              <vxe-table-column field="address" title="支出金额"></vxe-table-column>
              <vxe-table-column field="address" title="余额"></vxe-table-column>
              <vxe-table-column field="address" title="是否认领"></vxe-table-column>
              <vxe-table-column field="address" title="业务类别"></vxe-table-column>
              <vxe-table-column field="address" title="导入经办人"></vxe-table-column>
              <vxe-table-column field="address" title="认领门店"></vxe-table-column>
              <vxe-table-column field="address" title="认领店号"></vxe-table-column>
              <vxe-table-column field="address" title="凭证摘要"></vxe-table-column>
              <vxe-table-column field="address" title="认领核销人"></vxe-table-column>
              <vxe-table-column field="address" title="核销对账单号"></vxe-table-column>
              <vxe-table-column field="address" title="往来单位"></vxe-table-column>
              <vxe-table-column field="address" title="认领备注"></vxe-table-column>
            </vxe-table>
          </div>
        </TabPane>
      </Tabs>
    </div>
    <artificial ref="art" />
  </div>
</template>

<script>
import quickDate from "@/components/getDate/dateget_bill.vue";
import { creat } from "../../components";
import amtData from '../../components/amtData'
import artificial from '../../components/artificial'
import {shop} from '@/api/settlementManagement/fundsManagement/cashJournal'

import moment from "moment";
export default {
  components: {
    quickDate,
    amtData,
    artificial
  },
  data() {
    return {
      value: [], //日期
      Branchstore: [], //门店
      shopCode: "", //门店
      formInline: {}, //统计数据
      tableData: [
      ], //全部数据
      currentChange: {} //当前选中数据
    };
  },
  async mounted() {
    let arr = await creat(this.$refs.quickDate.val, this.$store);
    this.value = arr[0];
    this.getShop()
  },
  methods: {

    //获取门店列表
    async getShop(){
      let res = await shop()
      console.log(res)
      if (res.code === 0) return this.Branchstore = res.data
    },
    // 快速查询
    quickDate(data) {
      this.value = data;
      this.querySelete();
    },
    //点击获取表格数据
    getOneList(val) {
      // console.log(val, 789);
      this.currentChange = val;
    },
    //查询
    query() {
      this.querySelete();
    },
    //查询接口
    querySelete() {
      let obj = {
        startDate: this.value[0]
          ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endDate: this.value[1]
          ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        orgId: this.model1
      };
    },
    //删除导入
    deleteExport() {
      if (Object.keys(this.currentChange).length !== 0) {
        if (this.currentChange) {
        } else {
          this.$Modal.confirm({
            title: "是否删除该条数据",
            onOk: () => {},
            onCancel: () => {}
          });
        }
      } else {
        this.$message.error("请先选择要删除的数据");
      }
    },
    //智能匹配
    intelligent() {
      this.$Modal.confirm({
        title: "是否执行智能匹配",
        onOk: () => {
          this.$message.success("此次匹配成功数据X条");
        },
        onCancel: () => {}
      });
    },
    //人工分配
    distribution() {
      if (this.currentChange) {
        this.$refs.art.openModal()
      } else {
        this.$message.error("请选择未核销的数据");
      }
    },
    //资金认领核销
    capitalWrite(){
      this.$router.push({name:'claimWrite'})
    },
    //撤销分配
    distributionDelete(){
      if(Object.keys(this.currentChange).length!==0){
        if(this.currentChange){
          this.$Modal.confirm({
            title:'是否撤回分配',
            onOk:()=>{},
            onCancel:()=>{}
          })
        } else {
          this.$message.error('请选择已分配的数据')
        }
      } else {
        this.$message.error('请先选择数据')
      }
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
