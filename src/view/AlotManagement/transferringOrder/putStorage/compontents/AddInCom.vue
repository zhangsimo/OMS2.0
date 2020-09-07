<template>
  <Modal v-model="searchPartLayer" title="选择调拨申请单" width="1000" @on-ok="ok">
    <section class="oper-box">
      <div class="oper-top flex mb10">
        <Form @keydown.native.enter="search2">
        <div class="wlf">
          <div class="db mr10">
            <span class>申请日期：</span>
            <DatePicker
              @on-change="getDate"
              type="daterange"
              style="width:140px"
            ></DatePicker>
          </div>
          <div class="db mr10">
            <span>调 出 方 ：</span>
<!--            <Input style="width: 120px"  placeholder="简称/编码/全称" v-model="penSalesData.guestId" />-->
            <Select
              v-model="penSalesData.guestId"
              filterable
              clearable
              remote
              :remote-method="getGuestList"
              style="width: 120px"
              label-in-value
              placeholder="调出方名称"
            >
              <Option
                v-for="(item,index) in guestList"
                :value="item.id"
                :key="item.id"
              >{{item.shortName}}</Option>
            </Select>
            <!-- <Input
              clearable
              @on-focus="getName"
              @on-clear="clearNameId"
              v-model="penSalesData.guestId"
              style="width: 128px"
            /> -->
            <!-- <Button @click="getName" class="ml5" size="small" type="default">
              <i class="iconfont iconxuanzetichengchengyuanicon"></i>
            </Button> -->
          </div>
          <div class="db mr10">
            <Input
              v-model="penSalesData.serviceId"
              placeholder="申请单号"
              style="width: 160px"
              class="mr10"
            ></Input>
          </div>
          <div class="db mr10">
            <Button @click="search2" type="primary" class="mr20">查询</Button>
          </div>
          <div class="db mr10 btn">
            <Button @click="ok" type="warning" class="mr20">选入</Button>
          </div>
          <div class="db mr10 btn">
            <Button @click="init1" type="warning" class="mr20">取消</Button>
          </div>
          <div class="db">
            <div class="mt5"><Checkbox v-model="showSelf" @on-change="showOwen">显示个人单据</Checkbox></div>
          </div>
        </div>
        </Form>
      </div>
    </section>
    <section class="con-box">
      <!--上表格-->
      <div class="topTableDate">
        <vxe-table
          border
          resizable
          ref="xtale"
          size="mini"
          :height="200"
          auto-resize
          :data="tabList"
          highlight-current-row
          highlight-hover-row
          @current-change="selectTabelData"
          :radio-config="{labelField: 'name', trigger: 'row'}"
        >
          <vxe-table-column type="seq" width="50" title="序号"></vxe-table-column>
<!--          <vxe-table-column type="radio" width="50" title=" "></vxe-table-column>-->
          <!-- <vxe-table-column field="name" title="客户" width="100"></vxe-table-column> -->
          <vxe-table-column field="serviceId" title="申请单" width="150"></vxe-table-column>
          <vxe-table-column field="guestName" title="调出方" width="160"></vxe-table-column>
          <vxe-table-column field="status.name" title="受理状态" width="70"></vxe-table-column>
          <vxe-table-column field="remark" title="备注" width="130"></vxe-table-column>
          <vxe-table-column field="orderMan" title="申请人" width="80"></vxe-table-column>
          <vxe-table-column field="createTime" title="申请日期" width="86"></vxe-table-column>
          <vxe-table-column field="createUname" title="提交人" width="80"></vxe-table-column>
          <vxe-table-column field="createTime" title="提交日期" width="86"></vxe-table-column>
        </vxe-table>
      </div>

      <!--     分页-->
      <Row class="mt10 mb10">
        <Col span="12" offset="12" style="text-align:right">
          <div>
            <Page
              :current="pageList.page"
              :total="pageDataObj.totalElements"
              :page-size="pageList.size"
              :page-size-opts="pageList.pageSizeOpts"
              show-sizer
              @on-change="changePage"
              @on-page-size-change="changeSize"
            />
          </div>
        </Col>
      </Row>
      <!--        下表格-->
      <div class="bottomTableDate">
        <vxe-table border resizable auto-resize height="230" :data="currentData" size="mini">
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column field="partCode" title="配件编码" width="140"></vxe-table-column>
          <vxe-table-column field="partName" title="配件名称" width="130"></vxe-table-column>
          <vxe-table-column field="partBrand" title="品牌" width="90"></vxe-table-column>
          <vxe-table-column field="oemCode" title="OE码" width="170"></vxe-table-column>
          <vxe-table-column field="unit" title="单位" width="60"></vxe-table-column>
          <vxe-table-column field="applyQty" title="申请数量" width="90"></vxe-table-column>
          <vxe-table-column field="hasAcceptQty" title="受理数量" width="90"></vxe-table-column>
          <vxe-table-column field="hasOutQty" title="出库数量" width="90"></vxe-table-column>
        </vxe-table>
      </div>
    </section>
    <div slot="footer"></div>
  </Modal>
</template>

<script >
// import '@/view/lease/product/lease.less'
// import '@/view/goods/goodsList/goodsList.less'
import * as tools from "../../../../../utils/tools";
import moment from "moment";
import { getParticulars } from "_api/system/partsExamine/partsExamineApi";
import {transferringFindForAllot} from "_api/purchasing/purchasePlan";

export default {
  data() {
    return {
      showSelf: true,
      searchPartLayer: false,
      // 日期数据
      options1: [],
      tabList: [],
      // 调出方查询
      penSalesData: {
        endTime: "", //申请单号
        startTime: "",
        guestId: "",
        serviceId: ""
      },
      guestList:[],
      customerListOptions: [], //调出方下拉列表
      tableData: [{ name1: "123" }, {}, {}, {}],
      TopTableData: [], //上侧表格list
      BottomTableData: [], //下侧表格list
      // 分页数据
      pageList: {
        page: 1,
        total: 0,
        size: 10,
        pageSizeOpts: [10, 20, 30]
      },
      xuanzhognList: [],
      checkRow: {},
      currentData: []
    };
  },
  watch: {
    // tbdata: {
    //   handler(newVal) {
    //     this.tabList = newVal;
    //   },
    //   deep: true
    // },
    dcList: {
      handler(newVal) {
        this.diaochuList = newVal;
      },
      deep: true
    },
    dcName: {
      handler(newVal) {
        this.penSalesData.guestId = newVal;
      },
      deep: true
    },
    dcId: {
      handler(newVal) {
        this.penSalesData.guestId = newVal;
      },
      deep: true
    }
  },
  props: {
    pageDataObj:{
      type:Object,
      default:{}
    },
    tbdata: {
      type: Array,
      default: function() {
        return [];
      }
    },
    dcList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    dcName: {
      type: String,
      default: ""
    },
    dcId: {
      type: String,
      default: ""
    }
  },
  methods: {
    showOwen() {
      tools.setSession("self", { addInCom: this.showSelf });
      this.search();
    },
    getDate(v) {
      this.penSalesData.startTime = v[0] + " 00:00:00";
      this.penSalesData.endTime = v[1] + " 23:59:59";
    },
    //分页
    changePage(p) {
      this.pageList.page = p;
      this.search();
    },
    changeSize(size) {
      this.pageList.size = size;
      this.search();
    },
    getName() {
      this.$emit("getName", 2);
    },
    async getGuestList(query){
      let data={
        name:query,
        page:0,
        size:20
      }
      let res=await transferringFindForAllot(data)
      if(res.code===0){
        this.guestList=res.data.content || []
      }
    },
    init() {
      let self = tools.getSession("self");
      this.showSelf = Reflect.has(self, "addInCom") ? self.addInCom : true;
      this.searchPartLayer = true;
      this.reset();
    },
    init1() {
      // let self = tools.getSession("self");
      // this.showSelf = Reflect.has(self, "addInCom") ? self.addInCom : true;
      this.searchPartLayer = false;
    },
    reset() {
      // this.penSalesData = {
      //   endTime: "", //申请单号
      //   startTime: "",
      //   guestName: "",
      //   guestId: "",
      //   serviceId: ""
      // }
      this.currentData = [];
    },
    //选中的日期
    selectDate(date) {
      this.penSalesData.option1 = date;
      // console.log(this.penSalesData.option1);
    },
    //搜索
    search2() {
      this.pageList.page = 1;
      this.search();
    },
    search() {
      let size = this.pageList.size;
      let num = this.pageList.page;
      if (this.penSalesData.startTime) {
        this.penSalesData.startTime = moment(
          this.penSalesData.startTime
        ).format("YYYY-MM-DD HH:mm:ss");
      }
      if (this.penSalesData.endTime) {
        this.penSalesData.endTime = moment(this.penSalesData.endTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      let reqData = {...this.penSalesData}
      for (let k in reqData) {
        if (!reqData[k]) {
          delete reqData[k];
        }
      }
      reqData.enterSelect = 123;
      reqData.status = "STOCKING";
      if(this.showSelf) {
        let createUid = this.$store.state.user.userData.id;
        reqData.createUid = createUid;
      } else {
        Reflect.deleteProperty(reqData, "createUid")
      }
      this.$emit("search21", reqData, size, num);
    },
    getParams() {
      let data = {...this.penSalesData}
      if(this.showSelf) {
        let createUid = this.$store.state.user.userData.id;
        data.createUid = createUid;
      } else {
        Reflect.deleteProperty(data, "createUid")
      }
      data.status = "STOCKING";
      this.$emit("getLisw", data);
    },
    //确定
    chose() {
      // 将选中的行添加到下面
      // this.bData.push(this.checkRow)
    },
    //取消
    cancel() {},
    echoDate() {},
    selectTabelData({ row }) {
      this.checkRow = row;
      var params = {
        mainId: row.id
      };
      getParticulars(params).then(res => {
        this.currentData = res.data;

        // this.$emit("getArray", this.currentData);
      });
    },
    ok() {
      // 将选好的成品传父组件
      if(!this.currentData || this.currentData.length <= 0) {
        return this.$message.error("请选择调拨申请单!");
      }
      this.checkRow.detailVOS = this.currentData;
      this.$emit("ok", this.checkRow);
    },
    //清除guestid
    clearNameId(){
      this.penSalesData.guestId = ""
    }
  }
};
</script>

<style lang="less" scoped>
.wlf {
  margin-bottom: 10px;
  .db {
    padding-top: 0px;
  }
  .abd {
    padding-top: 18px;
    margin-right: -15px;
  }
  .abc {
    margin-right: 15px;
  }
  .btn {
    margin-right: 0px;
  }
}
.goods-list-form {
  * {
    font-size: 12px !important;
  }
  .ivu-form-item {
    margin-bottom: 0px;
  }
  .plan-cz-btn {
    border-top: 1px solid #ddd;
    margin-top: 6px;
    justify-content: space-between;
    padding: 8px 10px 4px;
    align-items: center;
  }
  .t-price {
    white-space: nowrap;
  }
}
//lease
.lease-model-body {
  height: 400px;
  border: 1px solid #ddd;
  .model-left-hd {
    border-bottom: 1px solid #ddd;
    padding: 10px;
    min-width: 300px;
  }
  .ivu-split-pane {
    overflow: auto;
  }
  .ivu-tree {
    min-width: 300px;
    padding: 10px;
  }
}

.ivu-modal {
  top: 50px;
}

.con-split {
  & * {
    font-size: 12px;
  }
  .pane-made-hd {
    height: 30px;
    background-color: #f8f8f8;
    line-height: 30px;
    border: 1px solid #ddd;
    border-bottom: 0;
    padding: 0 9px;
    color: #333;
    font-size: 12px;
    font-weight: bold;
  }
  .right-pane {
    border-right: 1px solid #ddd;
    .pane-made-hd {
      border-right: 0;
    }
  }
}

.purchase {
  padding-top: 10px;
  border-top: 1px solid #ddd;
}

.purchase-label {
  width: 86px;
  display: inline-block;
  text-align: right;
  margin-bottom: 10px;
  line-height: 30px;
}

.con-datadictionary-split {
  & * {
    font-size: 14px;
  }
  .pane-made-hd {
    height: 40px;
    background-color: #f8f8f8;
    line-height: 40px;
    border: 1px solid #ddd;
    border-right: 0px;
    border-left: 0px;
    padding: 0 9px;
    color: #333;
    font-size: 14px;
    font-weight: bold;
  }
  .con-split-pane-left {
    border-left: 1px solid #ddd;
    .data-dic-wrap {
      min-width: 300px;
      border: 1px solid #e8e8e8;
      margin: 0 10px;
      .ivu-tree {
        & > ul > li {
          position: relative;
          margin: 0;
          padding: 0 10px;

          &:after {
            background: #f8f8f8;
            content: "";
            position: absolute;
            left: 0px;
            top: 0px;
            width: 100%;
            height: 32px;
            z-index: 0;
            border-bottom: 1px solid #e8e8e8;
          }
          & > span,
          & > label,
          & > div {
            z-index: 2;
            position: relative;
          }
        }
        ul {
          li {
            margin: 0px;
          }
        }
      }
      .data-dic-th {
        width: 95%;
        span {
          text-align: center;
          line-height: 30px;
          display: inline-block;
          width: 200px;

          &:last-child {
            border-right: none;
          }
          &:first-child {
            width: 400px;
          }
        }
      }
      .data-dic-th2 {
        span {
          background: none;
          &:first-child {
            width: 382px;
            text-align: left;
          }
        }
      }
      .data-dic-th3 {
        span {
          &:first-child {
            width: 364px;
            text-align: left;
          }
        }
      }
    }
  }
}
.dicTypeTop {
  border-top: 1px solid #ddd;
}
.data-dic-select {
  background: #a8e3fd;
}
.lease-model-right {
  padding-left: 5px;
}
</style>
