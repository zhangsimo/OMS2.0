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
      <Button type="default" @click="addNew" class="mr10 w90"  v-has="'add'">
        <Icon type="md-add" size="14" />新增
      </Button>
      <Button class="mr10 w90" @click="setSave" :disabled="orderlistType.value != 0"  v-has="'save'">
        <span class="center">
          <Icon custom="iconfont iconbaocunicon icons" />保存
        </span>
      </Button>
      <Button class="mr10" @click="sumbit" :disabled="orderlistType.value != 0"  v-has="'submit'">
        <i class="iconfont mr5 iconxuanzetichengchengyuanicon"></i>提交
      </Button>
      <Button
        class="mr10"
        @click="setStockOut"
        :disabled="orderlistType.value != 1||isWms"
        v-has="'StockOut'"
      >
      <!--orderlistType.isWms == 1 || ^-->
        <i class="iconfont mr5 iconxuanzetichengchengyuanicon"></i>出库
      </Button>
      <Button class="mr10" @click="printTable"   v-has="'print'">
        <i class="iconfont mr5 icondayinicon"></i> 打印
      </Button>
      <Button class="mr10" @click="setBackOrder" :disabled="orderlistType.value != 1" v-has="'BackOrder'">
        <i class="iconfont mr5 iconziyuan14"></i> 返单
      </Button>
      <Button class="mr10" @click="setCancellation" :disabled="orderlistType.value != 0" v-has="'Cancellation'">
        <Icon type="md-close" size="14" />作废
      </Button>
      <Button class @click="setDerive"  v-has="'Derive'">
        <i class="iconfont mr5 icondaochuicon"></i> 导出
      </Button>
    </div>
    <div class="conter">
      <div class="demo-split">
        <Split v-model="split1">
          <div slot="left" class="demo-split-pane">
            <OrderLeft
              ref="OrderLeft"
              :queryTime="queryTime"
              :orderType="orderType"
              @getOneOrder="getOrder"
              :changeLeftList="changeLeft"
              @refresh= "getDutyInfo"
            ></OrderLeft>
          </div>
          <div slot="right" class="demo-split-pane">
            <OrderRight @parentGetleft="parentGetleft" ref="right"></OrderRight>
          </div>
        </Split>
      </div>
      <!--        更多搜索-->
      <More-query :data="queryList" ref="morequeryModal" @resetData="reset"></More-query>
      <!--        打印-->
      <Print-show ref="printBox"></Print-show>
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
import PrintShow from "../../commonality/PrintShow";
import { getCancellation, getReorder } from "@/api/salesManagment/salesOrder";

export default {
  name: "Order",
  components: {
    getDate,
    OrderLeft,
    OrderRight,
    MoreQuery,
    PrintShow
  },
  data() {
    return {
      isNew:true,//页面开始禁用
      isAdd:false,//判断是否新增
      orderType: 6,
      typeList: [
        { value: 6, name: "全部" },
        { value: 0, name: "草稿" },
        { value: 1, name: "已提交" },
        { value: 2, name: "待拣货" },
        { value: 3, name: "待出库" },
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
      changeLeft: "" ,//发生改变数据调动左侧list
      ispart:true,
      isWms:false
    };
  },
  methods: {
    //用于父子组件之间的方法通信
    getDutyInfo(){
      this.setSave();
    },
    //  调用left方法
    parentGetleft() {
      this.$refs.OrderLeft.gitlistValue();
    },
    //获取时间
    getvalue(date) {
      this.queryTime = date;
    },
    //打印表格
    printTable() {
      this.$refs.printBox.openModal();
    },
    //打开更多搜索
    openQueryModal() {
      this.queryList = { showPerson: true };
      this.$refs.morequeryModal.openModal();
    },
    //左侧点击数据
    getOrder(data) {
      this.isWms = false;
      this.orderlistType = data.billStatusId;
      if(this.orderlistType&&this.orderlistType.value===1&&data.isWms===1){
        this.isWms = true;
      }
    },
    //保存
    setSave() {
      let res = this.$refs.right.save();
    },
    //出库
    setStockOut() {
      let res = this.$refs.right.stockOut();
      if(res.code===0){
        this.$message.success('出库成功')
      }
    },
    //提交
    sumbit() {
      let list = this.$store.state.dataList.oneOrder;
        this.$refs.right.$refs.formPlan.validate(async valid => {
            if(valid){
                if (list.id||this.isAdd) {
                    this.$Modal.confirm({
                        title: '是否确定提交',
                        onOk: async () => {
                          await this.$refs.right.submitList();
                        },
                        onCancel: () => {
                          this.$Message.info('取消提交');
                        },
                    })
                }else{
                    this.$Message.warning('请选择一条有效数据')
                }
            }else{
                this.$Message.error("*为必填项");
            }
        })
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
      if (list.id) {
        this.$Modal.confirm({
          title: '是否确定作废',
          onOk: async () => {
            let data = {};
            data.id = list.id;
            let res = await getCancellation(data);
            if (res.code === 0) {
              this.changeLeft = res;
              let data = {};
              this.$store.commit("setOneOrder", data);
            }
          },
          onCancel: () => {
            this.$Message.info('取消作废');
          },
        })
      } else {
        this.$Message.warning('请选择一条有效数据')
      }
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
        if(this.isAdd){
            return this.$Message.error("请先保存数据");
        }
      this.$refs.OrderLeft.change();
      this.ispart=false
      this.orderlistType.value = 0
      this.$store.commit("setOneOrder", {});
      this.$refs.OrderLeft.getAdd();
      this.$refs.right.limitList.fixationQuota = '00.00'
      this.$refs.right.limitList.tempQuota  = '00.00'
      this.$refs.right.limitList.sumAmt = '00.00';
      this.isAdd=true;
      this.$refs.right.WarehouseList.map(item=>{
          if(item.isDefault){
              this.$refs.right.formPlan=Object.assign({},{storeId:item.id});
          }
      })
    },
    //重置额度
      reset(){
        this.$refs.right.limitList={
            fixationQuota:'',
            tempQuota:'',
            sumAmt:'',
        }
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
