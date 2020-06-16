<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <!--      主菜单导航-->
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>
            <Select v-model="purchaseType" class="w90 mr10">
              <Option
                v-for="item in purchaseTypeArr"
                :value="item.value"
                :key="item.value"
              >{{item.label}}</Option>
            </Select>
          </div>
          <div class="db">
            <Button type="default" @click="More" class="mr10">
              <i class="iconfont mr5 iconchaxunicon"></i>更多
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="addProoo">
              <Icon type="md-add" />新增
            </Button>
          </div>
          <div class="db">
            <Button @click="editPro" type="default" class="mr10">提交</Button>
          </div>
          <div class="db">
            <Button @click="baocun" type="default" class="mr10">保存</Button>
          </div>
          <!-- <div class="db">
            <Button class="mr10">
              <Icon type="md-checkmark" size="14" />导出
            </Button>
          </div>-->
          <div class="db">
            <Button class="mr10" @click="cancellation">
              <Icon type="md-close" size="14" />作废
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="printTable">
              <i class="iconfont mr5 icondayinicon"></i> 打印
            </Button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <div class="con-split" ref="paneLeft">
          <Split v-model="split1" min="200" max="500" @on-moving="getDomHeight">
            <div slot="left" class="con-split-pane-left" style="overflow-y: auto; height: 100%;">
              <div class="pane-made-hd">盘点列表</div>
              <Table
                :height="leftTableHeight"
                @on-current-change="selectTabelData"
                size="small"
                highlight-row
                border
                :stripe="true"
                :columns="Left.columns"
                :data="Left.tbdata"
              ></Table>
              <Page
                size="small"
                :total="Left.page.total"
                :page-size="Left.page.size"
                :current="Left.page.num"
                show-sizer
                show-total
                class-name="page-con"
                @on-change="changePage"
                @on-page-size-change="changeSize"
                class="mr10"
              ></Page>
            </div>
            <div slot="right" class="con-split-pane-right pl5 goods-list-form">
              <div class="pane-made-hd">盘点信息</div>
              <div class="clearfix purchase" ref="planForm">
                <Form inline :show-message="false" ref="formPlan" :label-width="100">
                  <FormItem label="盘点仓库：">
                    <Select
                      v-model="formPlan.storeId"
                      style="width:100px"
                      :disabled="draftShow != 0"
                    >
                      <Option
                        v-for="item in warehouseList"
                        :value="item.id"
                        :disabled="item.isDisabled"
                        :key="item.id"
                      >{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="盘点员：" prop="supplyOut">
                    <Input v-model="formPlan.orderMan" value="半成品" :disabled="draftShow != 0" />
                  </FormItem>
                  <FormItem label="盘点日期" prop="remark">
                    <DatePicker
                      :disabled="draftShow != 0"
                      @on-change="auditDate"
                      type="date"
                      class="w160"
                      :value="formPlan.auditDate"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="盘点单号" prop="planOrderNum">
                    <Input
                      v-model="formPlan.serviceId"
                      class="w160"
                      value="YCSDFD839239320"
                      :disabled="draftShow != 0"
                    />
                  </FormItem>
                </Form>
              </div>
              <div class="flex plan-cz-btn" ref="planBtn">
                <div class="clearfix">
                  <div class="fl mb5">
                    <Button size="small" class="mr10" @click="addPro">
                      <Icon type="md-add" />添加配件
                    </Button>
                  </div>
                  <div class="fl mb5">
                    <Button size="small" class="mr10" @click="shanchu">
                      <i class="iconfont mr5 iconlajitongicon"></i> 删除
                    </Button>
                  </div>
                  <div class="fl mb5">
                    <Button size="small" class="mr10">
                      <i class="iconfont mr5 iconlajitongicon"></i> 导入
                    </Button>
                  </div>
                </div>
              </div>
              <vxe-table
                ref="xTable1"
                border
                resizable
                @edit-closed="editClosedEvent"
                size="mini"
                :height="rightTableHeight"
                :data="Right.tbdata"
                :footer-method="addFooter"
                :edit-config="{ trigger: 'click', mode: 'cell' }"
              >
                <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                <vxe-table-column field="partCode" title="配件编码" width="100"></vxe-table-column>
                <vxe-table-column field="partName" title="配件名称" width="100"></vxe-table-column>
                <vxe-table-column field="partBrand" title="品牌" width="100"></vxe-table-column>
                <vxe-table-column field="spec" title="规格" width="100"></vxe-table-column>
                <vxe-table-column field="carBrandName" title="品牌车型" width="100"></vxe-table-column>
                <vxe-table-column field="enterUnitId" title="单位" width="100"></vxe-table-column>
                <vxe-table-column field="sysQty" title="系统数量" width="100"></vxe-table-column>
                <vxe-table-column
                  field="trueQty"
                  title="实盘数量"
                  width="100"
                  :edit-render="{ name: 'input' }"
                >
                  <template v-slot:edit="{ row }">
                    <el-input-number
                      :max="999999999999"
                      :min="0"
                      v-model="row.trueQty"
                      :controls="false"
                      :precision="0"
                      size="mini"
                    />
                  </template>
                </vxe-table-column>
                <vxe-table-column
                  field="truePrice"
                  title="成本单价"
                  width="100"
                  :edit-render="{name: 'input'}"
                ></vxe-table-column>
                <vxe-table-column field="dc" title="盈亏状态" width="100">
                  <template v-slot="{ row, seq }">
                    <span v-show="row.sysQty- row.trueQty > 0">{{ "盈利" }}</span>
                    <span v-show="row.sysQty- row.trueQty < 0">{{ "亏损" }}</span>
                    <span v-show="row.sysQty- row.trueQty == 0">{{ "无盈亏" }}</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="exhibitQty" title="盈亏数量" width="100">
                  <template v-slot="{ row, seq }">
                    <span>{{ Math.abs(row.sysQty - row.trueQty) }}</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="exhibitAmt" title="盘亏金额" width="120">
                  <template v-slot="{ row, seq }">
                    <span>{{ Math.abs(row.exhibitQty * row.truePrice) }}</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="sysAmt" title="系统成本" width="100"></vxe-table-column>
                <vxe-table-column field="oemCode" title="OE码" width="100"></vxe-table-column>
              </vxe-table>
            </div>
          </Split>
        </div>
      </div>
    </section>
    <!--添加配件-->
    <Select-part-com ref="SelectPartRef" @selectPartName="getPartNameList" :storeId="Leftcurrentrow.storeId"></Select-part-com>

    <!--更多弹框-->
    <More :getShowMore="showMore" @getMoreStatus="getMoreStatus" @getMoreData="getMoreData"></More>
    <!-- 作废提示 -->
    <Modal v-model="showRemove" title="提示" @on-ok="removeOk" @on-cancel="removeCancel">
      <p>是否确定作废</p>
    </Modal>
    <!-- 审核提示 -->
    <!-- <Modal v-model="showAudit" title="提示" @on-ok="auditOK" @on-cancel="auditCancel">
      <p>是否确定审核</p>
    </Modal>-->
    <!-- 打印 -->
    <Print-show ref="printBox"></Print-show>
  </div>
</template>

<script>
import {
  getLeftList,
  getRightDatas, //获取右侧所有数据
  getstate, //仓库数据
  getSubmitList, //提交
  getCancellation, //作废
  getDataQuickList,
  getDataTypeList,
  saveDataList,
  submitDataList,
  outDataList,
  removeDataList,
  stampDataList,
  stampApplyDataList
} from "../../../../api/business/takeStock.js";
import "../../../lease/product/lease.less";
import { conversionList } from "@/components/changeWbList/changewblist";
import QuickDate from "../../../../components/getDate/dateget";
import "../../../lease/product/lease.less";
import SelectPartCom from "../../../salesManagement/salesOrder/components/selectPartCom";
import PrintShow from "./components/PrintShow";
import More from "./components/More";
import * as tools from "_utils/tools";

export default {
  name: "takeStock",
  components: {
    QuickDate,
    PrintShow,
    More,
    SelectPartCom
  },
  data() {
    return {
      split1: 0.2,
      tabIndex: 0,
      curronly: false,
      purchaseType: 99, //查询选项
      purchaseTypeArr: [
        {
          label: "所有",
          value: 99
        },
        {
          label: "草稿",
          value: 0
        },

        {
          label: "已提交",
          value: 1
        },

        {
          label: "已完成",
          value: 4
        },
        {
          label: "已作废",
          value: 5
        }
      ],
      showMore: false, //更多模块的弹框
      //左侧表格高度
      leftTableHeight: 0,
      Left: {
        loading: false,
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        columns: [
          //key要修改
          {
            title: "序号",
            minWidth: 50,
            type: "index"
          },
          {
            title: "状态",
            key: "billStatusId",
            minWidth: 70
          },
          {
            title: "盘点日期",
            key: "auditDate",
            minWidth: 120
          },
          {
            title: "盘点员",
            key: "orderMan",
            minWidth: 170
          },
          {
            title: "盘点单号",
            key: "serviceId",
            minWidth: 140
          },
          {
            title: "打印次数",
            key: "print",
            minWidth: 120
          },
          {
            title: "创建人",
            key: "createUname",
            minWidth: 200
          },
          {
            title: "创建日期",
            key: "createTime",
            minWidth: 200
          },
          {
            title: "提交人",
            key: "subMan",
            minWidth: 200
          },
          {
            title: "提交日期",
            key: "subDate",
            minWidth: 200
          }
        ],
        tbdata: []
      },
      Right: {
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        loading: false,
        tbdata: []
      },
      queryList: {
        showPerson: true
      }, //更多查询
      queryTime: "", //快速查询时间
      orderType: {
        value: 0
      }, //默认状态
      changeLeft: "", //发生改变数据调动左侧list
      // 所需零件数据
      components: [],
      //右侧表格高度
      rightTableHeight: 0,
      //右边仓库数据
      warehouseList: {},
      //配件组装信息 表单model
      formPlan: {
        // storeId:{},
        // orderMan: "",
        // auditDate: "",
        // serviceId: ""
      },
      draftShow: 0, //判断是不是草稿
      showAudit: false, //审核提示
      showRemove: false, //作废提示
      isAddRight: true, //判断右侧是有数据
      showBayer: false, //出库方弹窗
      rightTableStatus: "" //右侧表格状态
    };
  },
  created() {
    this.getList();
  },
  watch: {
    purchaseType: function(val, old) {
      console.log(val, old);
      this.Left.page.num = 1;
      this.Left.page.size = 10;
      this.getList();
    }
  },
  methods: {
    //获取左侧列表
    getList() {
      //获取右边仓库数据
      getstate()
        .then(res => {
          if (res.code === 0) {
            this.warehouseList = res.data;
          }
        })
        .catch(err => {
          this.$Message.info("获取仓库信息失败"); //获取仓库数据
        });
      //获取左边数据
      let data = {};
      if (this.purchaseType == "99") {
        this.purchaseType = null;
      }
      data.startTime = this.queryTime[0] || "";
      data.endTime = this.queryTime[1] || "";
      data.billStatusId = this.purchaseType;
      // data = this.query
      let page = this.Left.page.num - 1;
      let size = this.Left.page.size;
      getLeftList(data, page, size)
        .then(res => {
          console.log(res);
          if (res.code === 0) {
            this.Left.tbdata = res.data.content || [];
            this.Left.page.total = res.data.totalElements;
          }
        })
        .catch(err => {
          this.$Message.info("获取盘点列表失败");
        });
      console.log(this.$store.state.user.userData);
    },

    //获取表格高度
    getDomHeight() {
      this.$nextTick(() => {
        let wrapH = this.$refs.paneLeft.offsetHeight;
        let planFormH = this.$refs.planForm.offsetHeight;
        let planBtnH = this.$refs.planBtn.offsetHeight;
        // let planPageH = this.$refs.planPage.offsetHeight;
        //获取左侧侧表格高度
        this.leftTableHeight = wrapH - 104;
        //获取右侧表格高度
        this.rightTableHeight = wrapH - planFormH - planBtnH - 38;
      });
    },
    //快速查询日期
    getDataQuick(v) {
      this.queryTime = v;
      this.Left.page.num = 1;
      this.Left.page.size = 10;
      this.getList();
    },
    //改变盘点时间
    auditDate(data) {
      this.formPlan.auditDate = data + " " + "00:00:00";
    },
    //更多按钮
    More() {
      this.showMore = true;
    },
    //更多弹窗恢复false
    getMoreStatus(val) {
      this.showMore = val;
    },
    //更多搜索接收调拨申请列表
    getMoreData(val) {
      this.Left.tbdata = val.data || [];
      this.Left.page.total = bal.totalElements;
    },
    //新增
    addProoo() {
      if (!this.isAddRight) {
        return this.$Message.error("请先保存数据");
      }
      let TrowLeft = {
        billStatusName: '',

        auditDate: "",

        orderMan: "",

        serviceId: "",
        print: "",
        createUname: "",
        createTime: "",
        createUname: "",
        createTime: ""
      }; //新增左侧
      this.isAddRight = false;
      this.Left.tbdata.push(TrowLeft);
    },
    // 提交
    editPro() {
      //判断是否为草稿状态
      if (this.Right.tbdata.length < 1) {
        this.$Message.error("请选择数据");
        return;
      }
      if (this.formPlan.billStatusId !== 0) {
        this.$Message.error("只有草稿状态才能提交");
        return;
      }
      let zero = tools.isZero(this.Right.tbdata, {qty: "trueQty"});
      if(zero) return;
      if (
        !this.formPlan.auditDate ||
        !this.formPlan.storeId ||
        !this.formPlan.orderMan ||
        !this.formPlan.serviceId
      ) {
        this.$Message.error("请填写盘点信息");
        return;
      }
      this.formPlan.billStatusId = 1;
      getSubmitList(this.formPlan).then(res => {
        console.log(res);
        if (res.code == 0) {
          his.$Message.error("提交成功");
        }
      });
    },
    //保存
    baocun() {
      if (this.Right.tbdata.length < 1) {
        this.$Message.error("请选择数据");
        return;
      }
      let zero = tools.isZero(this.Right.tbdata, {qty: "trueQty"});
      if(zero) return;
      //判断是否为草稿状态
      if (this.formPlan.billStatusId !== 0) {
        this.$Message.error("只有草稿状态才能保存");
        return;
      }
      if (
        !this.formPlan.auditDate ||
        !this.formPlan.storeId ||
        !this.formPlan.orderMan ||
        !this.formPlan.serviceId
      ) {
        this.$Message.error("请填写盘点信息");
        return;
      }
      getSubmitList(this.formPlan).then(res => {
        if (res.code == 0) {
          his.$Message.error("保存成功");
        }
      });
    },
    //导出
    setDerive() {
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
    //作废
    //作废提示
    cancellation() {
      this.showRemove = true;
    },
    //确认作废
    removeOk() {
      console.log(this.formPlan.id);
      if (this.Right.tbdata.length < 1) {
        this.$Message.error("请选择数据");
        return;
      }
      //判断是否为草稿状态
      if (this.formPlan.billStatusId !== 0) {
        this.$Message.error("只有草稿状态才能作废");
        return;
      }
      getCancellation(this.formPlan.id)
        .then(res => {
          if (res.code === 0) {
            this.showRemove = false;
          }
        })
        .catch(err => {
          this.showRemove = false;
          this.$Message.info("作废草稿失败");
        });
    },
    removeCancel() {
      this.showRemove = false;
    },
    auditCancel() {
      this.showRemove = false;
    },
    // 打印
    printTable() {
      this.$refs.printBox.openModal(this.formPlan.id);
    },

    //添加配件
    addPro() {
      this.$refs.SelectPartRef.init();
    },
    //左边列表选中当前行
    selectTabelData(data) {
      console.log(data);
      this.formPlan = data;
      // getRightDatas(data.id)
      // .then(res=>{
      //   console.log(res)
      // })
      //  .catch(err => {
      //    // this.$Message.info('作废草稿失败')
      //   })
      this.Right.tbdata = data.detailVOList;
      if (data.billStatusId) {
        this.draftShow = data.billStatusId;
      }
    },
    shanchu() {
      if (this.formPlan.billStatusId !== 0) {
        this.$Message.info("只有草稿状态才能进行删除操作");
        return;
      }
      // 组装删除
      const seleList = this.$refs.xTable1.getSelectRecords();
      console.log(seleList);
      const id = seleList[0].id;
      this.Right.tbdata = this.array_diff(
        this.Leftcurrentrow.processProductVO,
        seleList
      );
      this.currentData = [];
      this.$Message.success("删除成功");
    },
    //配件返回的参数
    getPartNameList(val) {
      var datas = conversionList(val);
      datas.forEach(item => {
        item.trueQty = undefined;
      });
      this.Right.tbdata = this.Right.tbdata.concat(datas);
      this.formPlan.detailVOList = this.formPlan.detailVOList.concat(datas);
    },
    //分页
    changePage(p) {
      // this.page.num = p
      // this.getList()
    },
    changeSize(size) {
      // this.page.num = 1
      // this.page.size = size
      // this.getList()
    },
    //表格编辑状态下被关闭的事件
    editClosedEvent() {},
    //footer计算
    addFooter() {},
    // 确定
    Determined() {},
    array_diff(a, b) {
      for (var i = 0; i < b.length; i++) {
        for (var j = 0; j < a.length; j++) {
          if (a[j].name === b[i].name) {
            a.splice(j, 1);
            j = j - 1;
          }
        }
      }
      return a;
    }
  },
  mounted() {
    setTimeout(() => {
      this.getDomHeight();
    }, 0);

    window.onresize = () => {
      this.getDomHeight();
    };
  }
};
</script>

<style lang="less" scoped>
.tabs-ulwarp {
  padding-top: 17px;
  border-bottom: solid 1px #ddd;
}
.tabs {
  list-style: none;
  display: flex;

  li {
    margin: 0;
    margin-right: 4px;
    height: 31px;
    padding: 5px 16px 4px;
    border: 1px solid #ddd;
    border-bottom: 0;
    border-radius: 2px 2px 0 0;
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
    background: #f8f8f8;
    cursor: pointer;
  }

  li.tab-active {
    height: 32px;
    padding-bottom: 5px;
    background: #fff;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    border-color: #ddd;
    color: #fd5c5c;
  }
}
.page-warp {
  padding-right: 20px;
}
.look-nav {
  text-align: center;
  height: 40px;
  margin-top: 20px;
}
.con-box {
  height: 600px;
}
.w550 {
  width: 580px;
}
.mt20 {
  margin-top: 20px;
}
.look {
  width: 100px;
  height: 100px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%);
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
</style>
