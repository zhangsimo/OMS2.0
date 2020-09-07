<template>
  <div style="height:100%">
    <div class="headerBox">
      <span class="mr10">快速查询:</span>
      <getDate class="mr10" @quickDate="getvalue"></getDate>
      <Select v-model="orderType" style="width:100px" class="mr10">
        <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
      </Select>
      <Button type="default" class="mr10" @click="openQueryModal">
        <Icon type="ios-more" />更多
      </Button>
      <Button type="default" @click="addNew" class="mr10 w90">
        <Icon type="md-add" size="14" v-has="'add'" />新增
      </Button>
      <Button
        class="mr10 w90"
        @click="setSave"
        :disabled="orderlistType != 0||isSaveClick"
        v-has="'save'"
      >
        <span class="center">
          <Icon custom="iconfont iconbaocunicon icons" />保存
        </span>
      </Button>
      <!-- <Button class="mr10" @click="sumbit" :disabled="orderlistType != 0"><i class="iconfont mr5 iconxuanzetichengchengyuanicon"></i>提交</Button> -->
      <Button class="mr10" @click="setStockOut" :disabled="orderlistType != 0" v-has="'StockOut'">
        <i class="iconfont mr5 iconxuanzetichengchengyuanicon"></i>出库
      </Button>
      <Button class="mr10" @click="printTable" v-has="'print'">
        <i class="iconfont mr5 icondayinicon"></i> 打印
      </Button>
      <!-- <Button class="mr10" @click="setBackOrder" :disabled="orderlistType.value != 1"><i class="iconfont mr5 iconziyuan14"></i> 返单</Button> -->
      <Button
        class="mr10"
        @click="setCancellation"
        :disabled="orderlistType != 0"
        v-has="'Cancellation'"
      >
        <Icon type="md-close" size="14" />作废
      </Button>
      <!-- <Button class="" @click="setDerive"><i class="iconfont mr5 icondaochuicon"></i> 导出</Button> -->
    </div>
    <div class="conter">
      <div class="demo-split">
        <Split v-model="split1">
          <div slot="left" class="demo-split-pane">
            <OrderLeft
              ref="leftorder"
              :queryTime="queryTime"
              :orderType="orderType"
              @getOneOrder="getOrder"
              :changeLeftList="changeLeft"
            ></OrderLeft>
          </div>
          <div slot="right" class="demo-split-pane">
            <OrderRight ref="right" @getChangeList="getList"></OrderRight>
          </div>
        </Split>
      </div>
      <!--        更多搜索-->
      <More-query :data="queryList" @getparamsList="searchMore" ref="morequeryModal"></More-query>
    </div>
  </div>
</template>

<script>
import baseUrl from "_conf/url";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
import getDate from "@/components/getDate/dateget";
import OrderLeft from "./OrderLeft";
import OrderRight from "./OrderRight";
import MoreQuery from "../../commonality/MoreQuery";
import { getCancellation, getReorder } from "@/api/salesManagment/salesOrder";
import { getListmore, zuofei } from "@/api/business/market.js";

export default {
  name: "Order",
  components: {
    getDate,
    OrderLeft,
    OrderRight,
    MoreQuery,
  },
  data() {
    return {
      orderType: 99,
      typeList: [
        { value: 99, name: "全部" },
        { value: 0, name: "草稿" },
        { value: 4, name: "已出库" },
        { value: 5, name: "已作废" }
      ],
      split1: 0.2,
      queryList: {
        showPerson: true
      }, //更多查询
      queryTime: "", //快速查询时间
      orderlistType: {
        value: 0
      }, //默认状态
      changeLeft: "", //发生改变数据调动左侧list
      isSaveClick: false
    };
  },
  methods: {
    async searchMore(data) {
      const res = await getListmore(data, 20, 0);
      if (res) {
        this.$refs.leftorder.getData(res.data);
      } else {
        this.$message.error("查询失败");
      }
    },
    getList() {
      this.$refs.leftorder.getList();
    },
    //获取时间
    getvalue(date) {
      this.queryTime = date;
    },
    //打印表格
    printTable() {
      let list = this.$store.state.dataList.oneOrder;
      if (list.xinzeng === "1") {
        this.$message.error("请先保存");
        return false;
      }
      this.$refs.printBox.openModal();
    },
    //打开更多搜索
    openQueryModal() {
      this.queryList = { showPerson: true };
      this.$refs.morequeryModal.openModal();
    },
    //左侧点击数据
    getOrder(data) {
      this.orderlistType = data.billStatusId;
    },
    //保存
    setSave() {
      this.isSaveClick = true; //点击保存后禁用该按钮
      this.$refs.right.save();
    },
    //出库
    setStockOut() {
      this.$refs.right.stockOut();
    },
    //提交
    sumbit() {
      let list = this.$store.state.dataList.oneOrder;
      if (!list.id) {
        this.$message.error("请选择一条有效数据");
        return false;
      }
      let res = this.$refs.right.submitList();
      console.log(res, 789);
    },
    //返单
    async setBackOrder() {
      let list = this.$store.state.dataList.oneOrder;
      if (!list.id) {
        this.$message.error("请选择一条有效数据");
        return false;
      }
      let data = {};
      data.id = list.id;
      let res = await getReorder(data);
      if (res.code === 0) {
        this.changeLeft = res;
        let data = {};
        this.$store.commit("setOneOrder", data);
      }
    },
    //作废
    async setCancellation() {
      let list = this.$store.state.dataList.oneOrder;
      if (!list.id) {
        this.$message.error("请选择一条有效数据");
        return false;
      }
      if (list.xinzeng === "1") {
        this.$message.error("请先保存");
        return false;
      }

      this.$Modal.confirm({
        title: "",
        content: "<p>是否要作废？</p>",
        onOk: async () => {
          let data = {};
          data.id = list.id;
          let res = await zuofei(data);
          if (res.code === 0) {
            this.changeLeft = res;
            let data = {};
            this.$store.commit("setOneOrder", data);
            this.$message.success("已作废");
          }
        }
      });
    },
    //导出
    async setDerive() {
      let list = this.$store.state.dataList.oneOrder;
      if (!list.id) {
        this.$message.error("请选择一条有效数据");
        return false;
      } else {
        location.href =
          baseUrl.omsOrder +
          "/sellOrderMain/export?id=" +
          list.id +
          "&access_token=" +
          Cookies.get(TOKEN_KEY);
      }
    },
    //新增
    addNew() {
      this.$refs.leftorder.addItem();
      // this.$store.commit('setOneOrder',{})
    }
  }
};
</script>

<style scoped lang="less">
.headerBox {
  border-bottom: 1px #e0e0e0 solid;
  padding-left: 10px;
  padding-bottom: 16px;
}
.demo-split {
  height: 100%;
  border: 1px solid #dcdee2;
}

.conter {
  height: 100%;
  width: 100%;
  padding: 10px;
}
</style>
