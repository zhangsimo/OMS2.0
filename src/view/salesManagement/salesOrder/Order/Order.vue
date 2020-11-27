<template>
  <div class="warps content-oper content-oper-flex loadingClass" id="parent2">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf wlf-center">
          <div class="db">
            <getDate class="mr5" sizeString="small" @quickDate="getvalue"></getDate>
          </div>
          <div class="db">
            <Select size="small" v-model="orderType" style="width:80px" class="mr5">
              <Option
                v-for="item in typeList"
                :value="item.value"
                :key="item.value"
                >{{ item.name }}</Option
              >
            </Select>
          </div>
          <div class="db">
            <Button type="default" class="mr5" size="small" @click="openQueryModal">
              <Icon type="ios-more" />更多
            </Button>
          </div>
          <div class="db">
            <Button
              type="default"
              @click="addNew"
              class="mr5"
              v-has="'add'"
              size="small"
            >
              <Icon type="md-add" size="14" />新增
            </Button>
          </div>
          <div class="db">
            <Button
              class="mr5"
              @click="setSave"
              size="small"
              :disabled="orderlistType.value != 0"
              :loading="saveLoading"
              v-has="'save'"
            >
              <span class="center">
                <Icon custom="iconfont iconbaocunicon icons" />保存
              </span>
            </Button>
          </div>
          <div class="db">
            <Button
              class="mr5"
              size="small"
              @click="sumbit"
              :loading="commitLoading"
              :disabled="orderlistType.value != 0"
              v-has="'submit'"
            >
              <i class="iconfont mr5 iconxuanzetichengchengyuanicon"></i>提交
            </Button>
          </div>
          <div class="db">
            <Button
              class="mr5"
              size="small"
              @click="setStockOut"
              :loading="outLoading"
              :disabled="orderlistType.value != 1 || isWms"
              v-has="'StockOut'"
            >
              <!--orderlistType.isWms == 1 || ^-->
              <i class="iconfont mr5 iconxuanzetichengchengyuanicon"></i>出库
            </Button>
          </div>
          <div class="db">
            <Button
              class="mr5"
              size="small"
              @click="printTable"
              :disabled="orderlistType.value == 5"
              v-has="'print'"
            >
              <i class="iconfont mr5 icondayinicon"></i> 打印
            </Button>
          </div>
          <div class="db">
            <Button
              class="mr5"
              size="small"
              @click="printModelOpen"
              :disabled="orderlistType.value == 5"
              v-has="'print'"
            >
              <i class="iconfont mr5 icondayinicon"></i> 打印发货申请
            </Button>
          </div>
          <div class="db">
            <Button
              class="mr5"
              size="small"
              @click="setBackOrder"
              :loading="backloading"
              :disabled="backShow"
              v-has="'BackOrder'"
            >
              <i class="iconfont mr5 iconziyuan14"></i> 返单
            </Button>
          </div>
          <div class="db">
            <Button
              class="mr5"
              size="small"
              @click="setCancellation"
              :disabled="orderlistType.value != 0"
              v-has="'Cancellation'"
            >
              <Icon type="md-close" size="14" />作废
            </Button>
          </div>
          <div class="db">
            <Button
              class="mr5"
              size="small"
              @click="resetCancellation"
              :disabled="orderlistType.value != 5"
              v-has="'Cancellation'"
            >
              <Icon type="md-close" size="14" />反作废
            </Button>
          </div>
          <div class="db">
            <Button class="mr5" size="small" @click="setDerive" v-has="'Derive'">
              <i class="iconfont mr5 icondaochuicon"></i> 导出
            </Button>
          </div>
          <div class="db">
            <div style="padding-top: 2px">
              <Checkbox v-model="showSelf" size="small" @on-change="showOwen"
                >显示个人单据</Checkbox
              >
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="conter">
      <div class="demo-split">
        <Split v-model="split1" min="200" max="500" @on-moving="getDomHeight">
          <div
            slot="left"
            ref="paneLeft"
            style="overflow-y: auto; height: 100%;"
            class="demo-split-pane"
          >
            <OrderLeft
              ref="OrderLeft"
              :queryTime="queryTime"
              :orderType="orderType"
              @getOneOrder="getOrder"
              :changeLeftList="changeLeft"
              @refresh="getDutyInfo"
            ></OrderLeft>
          </div>
          <div slot="right" class="demo-split-pane pl5">
            <OrderRight @parentGetleft="parentGetleft" ref="right"></OrderRight>
          </div>
        </Split>
      </div>
      <!--        更多搜索-->
      <More-query
        :data="queryList"
        ref="morequeryModal"
        @resetData="reset"
      ></More-query>
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
import {
  getCancellation,
  getReorder,
  getLeftList,
  getprintList
} from "@/api/salesManagment/salesOrder";
import {showLoading, hideLoading} from "@/utils/loading"
import * as tools from "_utils/tools";

export default {
  name: "Order",
  components: {
    getDate,
    OrderLeft,
    OrderRight,
    MoreQuery
  },
  data() {
    return {
      saveLoading: false,
      commitLoading: false,
      outLoading: false,
      showSelf: true,
      backloading: false,
      isNew: true, //页面开始禁用
      isAdd: false, //判断是否新增
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
      changeLeft: "", //发生改变数据调动左侧list
      ispart: false,
      isWms: false,
      selectItemId:"",
      backShow: false, //作废判断是否wms仓库
      submitloading:false
    };
  },
  mounted() {
    let self = tools.getSession("self");
    let showSelf = Reflect.has(self, "salesOrder") ? self.salesOrder : true;
    this.showSelf = showSelf;
    this.getDomHeight();
  },
  methods: {
    saveLoadingF(a){
      this.saveLoading = a
    },
    showOwen(v) {
      if (this.isAdd) {
        this.$nextTick(()=>{
          this.showSelf = !v;
        })
        return this.$Message.error("请先保存数据");
      }
      tools.setSession("self", { salesOrder: this.showSelf });
      this.reset();
    },
    getDomHeight() {
      this.$nextTick(() => {
        let wrapH = this.$refs.paneLeft.offsetHeight;
        let planFormH = this.$refs.right.$refs.planForm.offsetHeight;
        //获取左侧侧表格高度
        this.$refs.OrderLeft.leftTableHeight = wrapH - 110;
        this.$refs.right.rightTableHeight = wrapH - planFormH - 110;
      });
    },
    gitlistValue(){
      return this.$refs.OrderLeft.gitlistValue()
    },
    //用于父子组件之间的方法通信
    getDutyInfo() {
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
    //创建a标签
    openwin(url) {
      var a = document.createElement("a"); //创建a对象
      a.setAttribute("href", url);
      a.setAttribute("target", "_blank");
      a.setAttribute("id", "camnpr");
      document.body.appendChild(a);
      a.click(); //执行当前对象
      document.body.removeChild(a)
    },
    //打印表格
    async printTable() {
      let order = {};
      order.name="销售订单"
      order.route=this.$route.name
      order.id=this.$store.state.dataList.oneOrder.id;
      let routeUrl=this.$router.resolve({name:"print",query:order})
      // window.open(routeUrl.href,"_blank");
      this.openwin(routeUrl.href)
      this.$refs.OrderLeft.gitlistValue()
    },
    //打印发货申请
    printModelOpen(){
      this.$refs.right.printModelShow();
    },
    //打开更多搜索
    openQueryModal() {
      if (this.isAdd) {
        return this.$Message.error("请先保存数据");
      }
      // this.queryList = { showPerson: true };
      this.$refs.morequeryModal.openModal();
    },
    //左侧点击数据
    getOrder(data) {
      this.isWms = false;
      this.backShow = true;
      this.orderlistType = {...data.billStatusId};
      if (
        data.billStatusId.value == 1 ||
        (data.billStatusId.value == 0 && data.id)
      ) {
        if (data.isWms == 1) {
          this.backShow = true;
        } else {
          this.backShow = false;
        }
      }
      if (
        this.orderlistType &&
        this.orderlistType.value === 1 &&
        data.isWms === 1
      ) {
        this.isWms = true;
      }
    },
    //保存
    setSave() {
      let res = this.$refs.right.save();
    },
    //出库
    setStockOut() {
      this.$refs.right.stockOut();
      // if(res.code===0){
      //   this.$message.success('出库成功')
      // }
    },
    //提交
    sumbit() {
      if(this.submitloading){return }
      let list = this.$store.state.dataList.oneOrder;
      this.$refs.right.$refs.formPlan.validate(async valid => {
        if (valid) {
          if (list.id || this.isAdd) {
            this.$Modal.confirm({
              title: "是否确定提交",
              onOk: async () => {
                await this.$refs.right.submitList();
              },
              onCancel: () => {
                this.$Message.info("取消提交");
              }
            });
          } else {
            this.$Message.warning("请选择一条有效数据");
          }
        } else {
          this.$Message.error("*为必填项");
        }
      });
    },
    //返单
    async setBackOrder() {
      if(this.submitloading){return }
      this.backloading = true;
      let list = this.$store.state.dataList.oneOrder;
      if (!list.id) {
        this.$message.error("请选择一条有效数据");
        this.backloading = false;
        return false;
      }
      let data = {};
      data.id = list.id;
      this.submitloading=true
      let res = await getReorder(data);
      if (res.code === 0) {
        this.changeLeft = res;
        let data = {};
        this.$store.commit("setOneOrder", data);
        this.backloading = false;
        this.submitloading=false;
      }else{
        this.submitloading=false;
        this.backloading = false;
        // this.$Message.error("返单失败")
      }

    },
    //作废
    async setCancellation() {
      if(this.submitloading){return }
      let list = this.$store.state.dataList.oneOrder;
      if (list.id) {
        this.$Modal.confirm({
          title: "是否确定作废",
          onOk: async () => {
            let data = {};
            data.id = list.id;
            this.submitloading=true;
            let res = await getCancellation(data);
            if (res.code === 0) {
              this.changeLeft = res;
              let data = {};
              this.$store.commit("setOneOrder", data);
              this.submitloading=false;
            }else{
              this.submitloading=false;
            }
          },
          onCancel: () => {
            this.$Message.info("取消作废");
          }
        });
      } else {
        this.$Message.warning("请选择一条有效数据");
      }
    },
    //反作废
    resetCancellation(){
      if(this.submitloading){return }
      let list = this.$store.state.dataList.oneOrder;
      if (list.id) {
        this.$Modal.confirm({
          title: "是否确定反作废",
          onOk: async () => {
            let res = this.$refs.right.resetOrder();
          },
          onCancel: () => {
          }
        });
      } else {
        this.$Message.warning("请选择一条有效数据");
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
      if (this.isAdd) {
        return this.$Message.error("请先保存数据");
      }
      this.$refs.OrderLeft.change();
      this.ispart = false;
      this.orderlistType.value = 0;
      this.$store.commit("setOneOrder", {});
      this.$refs.OrderLeft.getAdd();
      this.$refs.right.limitList.fixationQuota = "00.00";
      this.$refs.right.limitList.tempQuota = "00.00";
      this.$refs.right.limitList.sumAmt = "00.00";
      this.isAdd = true;
      this.$refs.right.orderTypeTemp = {
        value:0,
        label:"销售订单"
      }
      // this.$set(this.formPlan, "billTypeId", "020502");

      this.$refs.right.WarehouseList.map(item => {
        if (item.isDefault) {
          this.$refs.right.formPlan = Object.assign({}, { storeId: item.id });
        }
      });
    },
    //重置额度
    reset(v) {
      v = { ...v };
      const left = this.$refs.OrderLeft;
      this.$refs.right.limitList = {
        fixationQuota: "",
        tempQuota: "",
        sumAmt: ""
      };
      // v.showPerson = this.showSelf ? 1 : 0;
      left.page.num = 1;
      left.v = v;
      left.gitlistValue();
      // this.page.size = 10;
      // let page = left.page.num - 1;
      // let size = left.page.size;
      // getLeftList(page, size, v).then(res => {
      //   if (res.code === 0) {
      //     // res.data.content.map( item => {item.billStatusId = JSON.parse(item.billStatusId)})
      //     left.tableData = res.data.content;
      //     left.page.total = res.data.totalElements;
      //   }
      // });
    }
  }
};
</script>

<style scoped lang="less">
.warps {
  height: 100%;
}

.headerBoxqq {
  height: 46px;
  border-bottom: 1px #e0e0e0 solid;
  padding: 10px;
  // padding-bottom: 16px;
  display: flex;
  align-items: center;
}
.demo-split {
  height: 100%;
  border: 1px solid #dcdee2;
}

.conter {
  height: calc(100% - 44px);
  width: 100%;
}
</style>
