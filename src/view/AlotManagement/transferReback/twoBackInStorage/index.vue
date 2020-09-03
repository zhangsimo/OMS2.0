<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>
            <Select
              v-model="form.status"
              @on-change="getDataType"
              class="w90 mr10"
            >
              <Option
                v-for="item in purchaseTypeArr"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </div>
          <div class="db">
            <Button type="default" @click="more" class="mr10">
              <i class="iconfont mr5 iconchaxunicon"></i>更多
            </Button>
          </div>
          <div class="db">
            <Button
              v-has="'godown'"
              :disabled="btnIn || isWms"
              type="default"
              @click="inPro"
              class="mr10"
            >
              <i class="iconfont mr5 iconbaocunicon"></i>入库
            </Button>
          </div>
          <div class="db">
            <Button v-has="'print'" @click="stamp" class="mr10">
              <i class="iconfont mr5 icondayinicon"></i> 打印
            </Button>
          </div>
          <!-- 状态定义 -->
          <div class="status">{{ inStatus }}</div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <div class="con-split" ref="paneLeft">
          <Split v-model="split1" min="200" max="500">
            <div slot="left" class="con-split-pane-left">
              <div class="pane-made-hd">调出退回入库列表</div>
              <Table
                :height="leftTableHeight"
                @on-current-change="selectTabelData"
                size="small"
                highlight-row
                border
                :columns="Left.columns"
                :data="Left.tbdata"
              ></Table>
              <Page
                size="small"
                :total="Left.page.total"
                :page-size="size"
                :current="Left.page.num"
                :page-size-opts="opts"
                show-sizer
                show-total
                class-name="page-con"
                @on-change="changePage"
                @on-page-size-change="changeSize"
                class="mr10"
              ></Page>
            </div>
            <div slot="right" class="con-split-pane-right pl5 goods-list-form">
              <div class="pane-made-hd">调出退回信息</div>
              <div class="clearfix purchase" ref="planForm">
                <Form
                  inline
                  :show-message="false"
                  ref="formPlan"
                  :label-width="100"
                  :model="formPlan"
                >
                  <FormItem label="申请方：" class="fs12">
                    <Row class="w500">
                      <Col span="22">
                      <Tooltip :content="formPlan.guestName">
                        <Input
                          disabled
                          readonly
                          v-model="formPlan.guestName"
                          placeholder
                        ></Input>
                      </Tooltip>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem label="入库仓库：">
                    <Select disabled v-model="formPlan.storeId" class="w150">
                      <Option
                        :disabled="item.isDisabled"
                        v-for="item in List"
                        :value="item.id"
                        :key="item.id"
                        >{{ item.name }}</Option
                      >
                    </Select>
                    <!--<Input readonly v-model="formPlan.storeId" placeholder></Input>-->
                  </FormItem>
                  <FormItem label="调出退回日期：" class="fs12 ml50">
                    <Date-picker
                      disabled
                      readonly
                      v-model="formPlan.finishDate"
                      type="date"
                      placeholder
                      class="w160"
                    ></Date-picker>
                  </FormItem>
                  <FormItem label="备注：">
                    <Tooltip :content="formPlan.remark">
                    <Input
                      :disabled="this.flag"
                      class="w500"
                      v-model="formPlan.remark"
                      placeholder="选填"
                      maxlength="100"
                    ></Input>
                    </Tooltip>
                  </FormItem>
                  <FormItem label="处理人：">
                    <Input
                      disabled
                      readonly
                      class="w160"
                      v-model="formPlan.createUname"
                      placeholder
                    ></Input>
                  </FormItem>
                  <FormItem label="申请单号：" class="ml50">
                    <Tooltip :content="formPlan.code">
                    <Input
                      disabled
                      readonly
                      class="w160"
                      v-model="formPlan.code"
                      placeholder
                    ></Input>
                    </Tooltip>
                  </FormItem>
                  <FormItem label="退回单号：" class="ml50">
                    <Tooltip :content="formPlan.serviceId">
                    <Input
                      disabled
                      readonly
                      class="w160"
                      v-model="formPlan.serviceId"
                      placeholder
                    ></Input>
                    </Tooltip>
                  </FormItem>
                </Form>
              </div>
              <div class="flex plan-cz-btn" ref="planBtn">
                <div class="clearfix"></div>
              </div>
              <vxe-table
                v-if="showit"
                border
                resizable
                show-footer
                size="mini"
                :height="rightTableHeight"
                :data="tableData"
                :edit-config="{trigger: 'click', mode: 'cell'}"
              >
                <vxe-table-column  show-overflow="tooltip"
                  type="seq"
                  width="60"
                  title="序号"
                ></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip"
                  field="partCode"
                  title="配件编码"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip"
                  field="partName"
                  title="配件名称"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip"
                  field="partBrand"
                  title="品牌"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip"
                  field="applyQty"
                  title="退回数量"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip"
                  field="remark"
                  title="备注"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip"
                  width="120"
                  field="storeShelf"
                  title="仓位"
                  :edit-render="{name: 'input',immediate: true, events: {blur: checkSelf}}"
                ></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip"
                  field="unit"
                  title="单位"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip"
                  field="carBrandName"
                  title="品牌车型"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip"
                  field="oemCode"
                  title="OE码"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip"
                  field="spec"
                  title="规格"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip" field="partInnerId" title="配件内码" width="120"></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip"
                  field="hasCancelQty"
                  title="统计退回数量"
                  width="100"
                ></vxe-table-column>
              </vxe-table>
            </div>
          </Split>
        </div>
      </div>
    </section>
    <!--更多弹框-->
    <More
      ref="more"
      :getShowMore="showMore"
      @getMoreStatus="getMoreStatus"
      @getMoreData="getMoreData"
    ></More>
    <!-- 入库提示 -->
    <Modal v-model="showIn" title="提示" @on-ok="inOk" @on-cancel="inCancel">
      <p>是否确定入库</p>
    </Modal>
    <!-- 打印 -->
    <PrintShow ref="printBox" :curenrow="Leftcurrentrow"></PrintShow>
  </div>
</template>

<script>
import {
  getList,
  inDataList,
  stampDataList,
  getListDetail
} from "../../../../api/AlotManagement/twoBackInStorage.js";
import More from "./compontents/More";
import QuickDate from "../../../../components/getDate/dateget";
import "../../../lease/product/lease.less";
import "../../../goods/goodsList/goodsList.less";
import PrintShow from "./compontents/PrintShow";
import { queryByOrgid } from "../../../../api/AlotManagement/transferringOrder";
import { checkStore } from '@/api/system/systemApi'

export default {
  name: "twoBackInStorage",
  inject: ["reload"],
  components: {
    More,
    QuickDate,
    PrintShow
  },
  data() {
    return {
      isSelfOk: true,
      flag: false,
      Leftcurrentrow: {},
      dayinCureen: {},
      isWms: false,
      List: [],
      form: {
        createTimeStart: "",
        createTimeEnd: "",
        status: ""
      },
      showit: true,
      split1: 0.2,
      selectDayTypeArr: [
        { label: "所有", value: "" },
        { label: "本日", value: 0 },
        { label: "昨日", value: 1 },
        { label: "本周", value: 2 },
        { label: "上周", value: 3 },
        { label: "本月", value: 4 },
        { label: "上月", value: 5 }
      ],
      purchaseTypeArr: [
        { label: "所有", value: "" },
        { label: "待出库", value: "PENDING_OUTER" },
        { label: "待入库", value: "PENDING_ENTER" },
        { label: "已入库", value: "HAS_ENTER" }
      ],
      //查询
      params: {
        // selectDayType: '', //完成日期12345
        // settleStatus: '',
      },
      size: 20,
      total: 0,
      opts: [20, 50, 100, 200],
      Left: {
        page: {
          num: 1,
          size: 20,
          total: 0,
          opts: [20, 50, 100, 200]
        },
        loading: false,
        columns: [
          {
            title: "序号",
            minWidth: 50,
            type: "index"
          },
          {
            title: "状态",
            key: "name",
            minWidth: 70,
            render: (h, params) => {
              let name = params.row.status.name;
              return h("span", name);
            }
          },
          {
            title: "申请方",
            key: "guestName",
            minWidth: 170
          },
          {
            title: "受理日期",
            key: "createTime",
            minWidth: 120
          },
          {
            title: "受理人",
            key: "createUname",
            minWidth: 140
          },

          {
            title: "退回单号",
            key: "serviceId",
            minWidth: 200
          },
          {
            title: "入库人",
            key: "commitUname",
            minWidth: 100
          },
          {
            title: "调出退回日期",
            align: "center",
            key: "finishDate",
            minWidth: 170
          },
          {
            title: "打印次数",
            key: "printing",
            minWidth: 170
          }
        ],
        tbdata: []
      },
      //right信息
      formPlan: {
        orgid: "", //申请方
        storeId: "", //入库仓库
        finishDate: "", //调出退回日期
        remark: "", //备注
        auditor: "", //入库人
        code: "", //申请单号
        serviceId: "" //退回单号
      },
      //right表格
      tableData: [],
      //左侧表格高度
      leftTableHeight: 0,
      //右侧表格高度
      rightTableHeight: 0,
      Right: {
        loading: false,
        columns: [
          {
            title: "序号",
            minWidth: 50,
            key: "id"
          },
          {
            title: "状态",
            key: "venderSkuNo",
            minWidth: 70
          },
          {
            title: "调出方",
            key: "name",
            minWidth: 170
          },
          {
            title: "创建日期",
            key: "address",
            minWidth: 120
          },
          {
            title: "申请人",
            key: "isCycle",
            minWidth: 140
          },
          {
            title: "申请单号",
            key: "disable",
            minWidth: 200
          },
          {
            title: "提交人",
            key: "remark",
            minWidth: 100
          },
          {
            title: "提交日期",
            align: "center",
            key: "qualitySourceName",
            minWidth: 170
          },
          {
            title: "打印次数",
            key: "categoryName",
            minWidth: 170
          }
        ],
        tbdata: []
      },
      inID: { id: "" }, //入库ID
      btnIn: false, //入库按钮禁用
      showMore: false, //更多模块的弹框
      showIn: false, //是否确定入库弹框
      inStatus: "" //单据状态
    };
  },
  created() {
    this.getinfo();
  },
  methods: {
    checkSelf({ row : { storeShelf } }) {
      if(storeShelf == "") {
        this.isSelfOk = true;
      } else {
        checkStore({ storeId: this.formPlan.storeId , name: storeShelf }).then(res => {
          if(res.code == 0 && res.data != null) {
            this.isSelfOk = true;
          } else {
            this.isSelfOk = false;
          }
        })
      }
    },
    //获取调拨申请列表
    getinfo() {
      let params = {...this.params, ...this.form}
      getList(params)
        .then(async res => {
          if (res.code === 0) {
            // this.$Message.info('成功')
            this.Left.tbdata = res.data.content || [];
            this.Left.page = res.data.pageable;
            this.Left.page.total = res.data.totalElements;
          } else if (res.code === 1) {
            this.$Message.info("未查到数据");
            this.Left.tbdata = [];
          }
          // this.Leftcurrentrow
          for (let b of this.Left.tbdata) {
            b._highlight = false;
            if(b.id == this.Leftcurrentrow.id) {
              b._highlight = true;
              this.Leftcurrentrow = b;
              const params = {
                mainId: b.id
              };
              const res = await getListDetail(params);
              this.Leftcurrentrow.detailVOS = this.tableData = res.data;
              return;
            }
            // this.Leftcurrentrow.detailVOS = [];
          }
        })
        .catch(err => {
          this.$Message.info("初始化数据失败");
        });
    },
    getDataQuick(val) {
      this.form.createTimeStart = val[0];
      this.form.createTimeEnd = val[1];
      this.getinfo();
    },
    //类型查询
    getDataType() {
      this.getinfo();
    },
    //显示更多弹窗
    more() {
      this.$refs.more.init();
      this.showMore = true;
    },
    //更多弹窗恢复false
    getMoreStatus(val) {
      this.showMore = val;
    },
    //更多搜索接收调拨申请列表
    getMoreData(val) {
      this.params = { ...this.params, ...val };
      this.getinfo();
    },
    //
    // 仓库下拉框
    warehouse() {
      queryByOrgid().then(res => {
        if (res.code === 0) {
          this.List = res.data;
        }
      });
    },
    //入库按钮
    inPro() {
      this.showIn = true;
    },
    //确定入库
    inOk() {
      if(!this.isSelfOk) {
        return this.$message.error("请填写正确的仓位!")
      }
      inDataList(this.inID)
        .then(res => {
          if (res.code === 0) {
            this.showIn = false;
            this.$Message.info("确定入库成功");
            this.getinfo();
            // this.reload();
          } else if (res.code === 1) {
            this.$Message.info("提示入库失败");
          }
        })
        .catch(err => {
          this.$Message.info("确定入库失败");
        });
    },
    //取消入库
    inCancel() {
      this.showIn = false;
    },

    // 打印
    stamp() {
      if (!this.dayinCureen.id) {
        this.$Message.info("请选择打印项");
        return;
      }
      let order = this.$store.state.dataList.oneOrder;
      order.name="调拨入库"
      order.route=this.$route.name
      order.id=this.Leftcurrentrow.id
      let routeUrl=this.$router.resolve({name:"print",query:order})
      window.open(routeUrl.href,"_blank");
      this.getList()
    },
    //左边列表选中事件
    async selectTabelData(currentRow) {
      this.isWms =
        this.List.filter(({ id }) => id === currentRow.storeId).find(
          ({ isWms }) => isWms
        ) === undefined
          ? false
          : true;
      if (currentRow.status.name != "已入库") {
        this.flag = false;
      } else {
        this.flag = true;
      }
      this.Leftcurrentrow = currentRow;
      this.dayinCureen = currentRow;
      this.inID.id = currentRow.id;
      this.formPlan = currentRow;
      const params = {
        mainId: currentRow.id
      };
      const res = await getListDetail(params);
      this.tableData = res.data;
      if (currentRow.status === 0) {
        this.inStatus = "未入库";
        this.btnIn = false;
      } else if (currentRow.status === 1) {
        this.inStatus = "部分";
        this.btnIn = false;
      } else if (currentRow.status === 2) {
        this.inStatus = "已入库";
        this.btnIn = true;
      } else {
        // this.$Message.info("状态错误");
      }
    },
    //分页
    changePage(p) {
      this.Left.page.num = p;
      this.getinfo();
    },
    changeSize(s) {
      this.Left.page.size = s;
      this.getinfo();
    }
  },
  mounted() {
    this.$nextTick(() => {
      let wrapH = this.$refs.paneLeft.offsetHeight;
      let planFormH = this.$refs.planForm.offsetHeight;
      let planBtnH = this.$refs.planBtn.offsetHeight;
      // let planPageH = this.$refs.planPage.offsetHeight;
      //获取左侧侧表格高度
      this.leftTableHeight = wrapH - 104;
      //获取右侧表格高度
      this.rightTableHeight = wrapH - planFormH - planBtnH - 65;
    });
    this.warehouse();
  }
};
</script>

<style scoped>
.con-box {
  height: 600px;
}
.w550 {
  width: 580px;
}
.status {
  float: right;
  padding: 20px 10px 5px 10px;
}
</style>
