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
            <Button @click="baocun" type="default" class="mr10">
              <i class="iconfont mr5 iconbaocunicon"></i>保存
            </Button>
          </div>
          <!-- <div class="db">
            <Button class="mr10" @click="audit">
              <Icon type="md-checkmark" size="14" />审核
            </Button>
          </div>-->
          <div class="db">
            <Button class="mr10" @click="editPro">
              <Icon type="md-checkmark" size="14" />提交
            </Button>
          </div>
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
              <div class="pane-made-hd">配件组装列表</div>
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
              <div class="pane-made-hd">配件组装信息</div>
              <div class="clearfix purchase" ref="planForm">
                <Form
                  inline
                  :rules="ruleValidate"
                  ref="Leftcurrentrow"
                  :label-width="100"
                  :model="Leftcurrentrow"
                >
                  <FormItem label="移出仓库" prop="storeId">
                    <Select
                      v-model="Leftcurrentrow.storeId"
                      style="width:100px"
                      :disabled="Leftcurrentrow.status.value !== 0"
                    >
                      <Option
                        v-for="item in warehouseList"
                        :value="item.id"
                        :key="item.id"
                      >{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="移入仓库" prop="receiveStoreId">
                    <Select
                      v-model="Leftcurrentrow.receiveStoreId"
                      style="width:100px"
                      :disabled="Leftcurrentrow.status.value !== 0"
                    >
                      <Option
                        v-for="item in warehouseList"
                        :value="item.id"
                        :key="item.id"
                      >{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="业务员：" prop="createUname">
                    <Input
                      v-model="Leftcurrentrow.createUname"
                      class="w160"
                      clearable
                      :disabled="Leftcurrentrow.status.value !== 0"
                    />
                  </FormItem>
                  <FormItem label="移仓日期" prop="commitDate">
                    <DatePicker
                      :value="Leftcurrentrow.commitDate"
                      format="yyyy-MM-dd HH:mm:ss"
                      type="date"
                      class="w160"
                      :disabled="Leftcurrentrow.status.value !== 0"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="移仓单号" prop="planOrderNum">
                    <Input
                      class="w160"
                      v-model="Leftcurrentrow.serviceId"
                      value="YCSDFD839239320"
                      :disabled="Leftcurrentrow.status.value !== 0"
                    />
                  </FormItem>
                </Form>
              </div>
              <div class="flex plan-cz-btn" ref="planBtn">
                <div class="clearfix">
                  <div class="fl mb5">
                    <Button
                      size="small"
                      class="mr10"
                      @click="addPro"
                      :disabled="Leftcurrentrow.status.value !== 0"
                    >
                      <Icon type="md-add" />添加配件
                    </Button>
                  </div>
                  <div class="fl mb5">
                    <Button
                      size="small"
                      class="mr10"
                      @click="deletePar"
                      :disabled="Leftcurrentrow.status.value !== 0"
                    >
                      <i class="iconfont mr5 iconlajitongicon"></i> 删除
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
                :edit-config="{trigger: 'click', mode: 'cell'}"
              >
                <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                <vxe-table-column field="partCode" title="配件编码" width="100"></vxe-table-column>
                <vxe-table-column field="partName" title="配件名称" width="100"></vxe-table-column>
                <vxe-table-column field="partBrand" title="品牌" width="100"></vxe-table-column>
                <vxe-table-column
                  field="orderQty"
                  title="数量"
                  width="100"
                  :edit-render="{name: 'input'}"
                ></vxe-table-column>
                <vxe-table-column field="stockOutQty" title="缺货数量" width="100"></vxe-table-column>
                <vxe-table-column field="carModelName" title="品牌车型" width="100"></vxe-table-column>
                <vxe-table-column field="systemUnitId" title="单位" width="100"></vxe-table-column>
                <vxe-table-column field="oemCode" title="OE码" width="100"></vxe-table-column>
                <vxe-table-column field="spec" title="规格" width="100"></vxe-table-column>
                <vxe-table-column field="date12" title="方向" width="100"></vxe-table-column>
              </vxe-table>
            </div>
          </Split>
        </div>
      </div>
    </section>
    <!--添加配件-->
    <Select-part-com ref="SelectPartRef" @selectPartName="getPartNameList"></Select-part-com>
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
  getstate, //仓库数据
  getRightDatas, //获取右边数据
  updata, ////保存
  getSubmitList, //提交
  getCancellation, //作废
  delectTable, //删除
  getPrint //打印
  // getSubmitList,//提交
  // getCancellation,//作废
  // getDataQuickList,
  // getDataTypeList,
  // saveDataList,
  // submitDataList,
  // outDataList,
  // removeDataList,
  // stampDataList,
  // stampApplyDataList
} from "../../../../api/business/moveStorehouse.js";
import "../../../lease/product/lease.less";
import moment from "moment";
import QuickDate from "../../../../components/getDate/dateget";
import SelectPartCom from "../../../salesManagement/salesOrder/components/selectPartCom";
import PrintShow from "./components/PrintShow";
import More from "./components/More";
import { conversionList } from "@/components/changeWbList/changewblist";
export default {
  name: "moveStorehouse",
  components: {
    QuickDate,
    PrintShow,
    More,
    SelectPartCom
  },
  data() {
    return {
      mainid: "",
      split1: 0.2,
      tabIndex: 0,
      queryTime: "", //快速查询时间
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
          label: "已作废",
          value: 3
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
          {
            title: "序号",
            type: "index",
            minWidth: 50
          },
          {
            title: "状态",
            key: "statuName",
            minWidth: 70
          },
          {
            title: "移仓日期",
            key: "commitDate",
            minWidth: 170
          },
          {
            title: "业务员",
            key: "createUname",
            minWidth: 120
          },
          {
            title: "移仓单号",
            key: "serviceId",
            minWidth: 140
          },
          {
            title: "打印次数",
            key: "printing",
            minWidth: 200
          },
          {
            title: "创建人",
            key: "createUname",
            minWidth: 100
          },
          {
            title: "创建日期",
            align: "createTime",
            key: "left8",
            minWidth: 170
          },
          {
            title: "提交人",
            key: "commitUname",
            minWidth: 170
          },
          {
            title: "提交日期",
            key: "commitDate",
            minWidth: 170
          }
        ],
        tbdata: [
          {
            left1: 1,
            left2: "草稿",
            left3: "公司名称",
            left4: "2019-10-01",
            left5: "李四",
            left6: "GT11121223",
            left7: "张三",
            left8: "2019-10-21",
            left9: "10"
          }
        ]
      },
      Right: {
        page: {
          num: 1,
          size: 10,
          total: 0
        },
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
      // 所需零件数据
      components: [],
      //右侧表格高度
      rightTableHeight: 0,
      //配件组装信息 表单model
      formModel: [],
      Leftcurrentrow: {
        status: {
          value: 0
        },
        storeId: "", //移入
        receiveStoreId: "", //移出
        createUname: "", //业务员
        commitDate: "", //移仓日期
        serviceId: "", //移仓单号
        detailVOList: []
      }, //右边所有数据（含提交）
      ruleValidate: {
        storeId: [
          { required: true, message: "请选择移除仓库", trigger: "change" }
        ],
        receiveStoreId: [
          { required: true, message: "请选择移入仓库", trigger: "change" }
        ],
        createUname: [
          { required: true, message: "业务员不能为空", trigger: "blur" }
        ],
        commitDate: [
          { required: true, message: "移仓时间不为空", trigger: "blur" }
        ]
      },
      showAudit: false, //审核提示
      showRemove: false, //作废提示
      isAddRight: true, //判断右侧是有数据
      showBayer: false, //出库方弹窗
      rightTableStatus: "" //右侧表格状态
    };
  },
  watch: {
    purchaseType: function(val, old) {
      console.log(val, old);
      this.Left.page.num = 1;
      this.Left.page.size = 10;
      this.getList();
    },
    Leftcurrentrow: {
      handler(newVal) {
        this.Leftcurrentrow = newVal;
      },
      deep: true
    }
  },
  created() {
    this.getList();
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
      if (this.purchaseType == "-1") {
        this.purchaseType = null;
      }
      if (this.queryTime) {
        data.startTime = this.queryTime[0] || "";
        data.endTime = this.queryTime[1] || "";
      }
      data.status = this.purchaseType;
      let page = this.Left.page.num - 1;
      let size = this.Left.page.size;
      getLeftList(data, page, size)
        .then(res => {
          console.log(res);
          if (res.code === 0) {
            if (!res.data.content) {
              this.Left.tbdata = [];
              this.Left.page.total = 0;
            } else {
              res.data.content.map((item, index) => {
                item["index"] = index + 1;
                item["statuName"] = item.status.name;
              });
              this.Left.tbdata = res.data.content || [];
              this.Left.page.total = res.data.totalElements;
            }
          }
        })
        .catch(err => {
          this.$Message.info("获取移仓列表失败");
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
    //切换tab
    setTab(index) {
      this.tabIndex = index;
      if (this.tabIndex == 1) {
        console.log("配件拆分");
      }
    },
    //快速查询日期
    getDataQuick(v) {
      this.queryTime = v;
      this.Left.page.num = 1;
      this.Left.page.size = 10;
      this.getList();
    },
    //改变移仓时间
    commitDate(data) {
      console.log(data);
      this.Leftcurrentrow.commitDate = data + " " + "00:00:00";
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
      if (this.Left.tbdata.length === 0) {
      } else {
        if (this.Left.tbdata[0]["xinzeng"] === "1") {
          this.$Message.info(
            "当前列表已有一个新增单等待操作,请先保存当前操作新增单据"
          );
          return;
        }
      }
      const item = {
        index: 1,
        xinzeng: "1",
        status: {
          enum: "DRAFT",
          name: "草稿",
          value: 0
        },
        statuName: "草稿",
        commitDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        createUname: "",
        serviceId: "",
        printing: "",
        createUname: "",
        createTime: "",
        commitUname: "",
        //commitDate:"",
        //createTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        //createUname: this.$store.state.user.userData.staffName,
        detailVOList: []
      };
      this.Left.tbdata.unshift(item);
      this.Left.tbdata.map((item, index) => {
        item.index = index + 1;
      });
      // let TrowLeft = {} //新增左侧
      // this.isAddRight = false
      // this.Left.tbdata.unshift(TrowLeft)
    },
    //保存
    baocun() {
      if (!this.Leftcurrentrow.serviceId) {
        if (this.Leftcurrentrow.xinzeng === "1") {
        } else {
          this.$Message.info("请先选择加工单");
          return;
        }
      }
      // if (
      //   !this.Leftcurrentrow.receiveStoreId ||
      //   !this.Leftcurrentrow.storeId ||
      //   !this.Leftcurrentrow.createUname ||
      //   !this.Leftcurrentrow.serviceId
      // ) {
      //   this.$Message.error("请填写移仓信息");
      //   return;
      // }
      if (
        this.Leftcurrentrow.status.value &&
        this.this.Leftcurrentrow.status.value !== 0
      ) {
        this.$Message.error("只有草稿状态才能保存");
        return;
      }
      const params = JSON.parse(JSON.stringify(this.Leftcurrentrow));
      updata(params)
        .then(res => {
          if (res.code == 0) {
            console.log(res, "res=>616");
            this.$Message.success("保存成功");
            this.getList();
          }
        })
        .catch(e => {
          this.$Message.info("保存失败");
        });
    },
    // 提交
    editPro() {
      //判断是否为草稿状态
      this.$refs.Leftcurrentrow.validate(valid => {
        if (valid) {
          //成功
          console.log("成功", "成功=>651");
        } else {
          console.log("失败", "失败=>653");
          return;
        }
      });
      if (!this.Leftcurrentrow.id) {
        this.$Message.error("请选择数据");
        return;
      }
      if (
        !this.Leftcurrentrow.receiveStoreId ||
        !this.Leftcurrentrow.storeId ||
        !this.Leftcurrentrow.createUname ||
        !this.Leftcurrentrow.serviceId
      ) {
        this.$Message.error("请填写移仓信息");
        return;
      }
      if (
        this.Leftcurrentrow.status.value &&
        this.this.Leftcurrentrow.status.value !== 0
      ) {
        this.$Message.error("只有草稿状态才能保存");
        return;
      }
      this.Leftcurrentrow.billStatusId = 1;
      const params = JSON.parse(JSON.stringify(this.Leftcurrentrow));
      getSubmitList(params)
        .then(res => {
          if (res.code == 0) {
            this.getList();
            this.$Message.success("提交成功");
          }
        })
        .catch(e => {
          this.$Message.info("提交失败");
        });
    },
    //作废
    //作废提示
    cancellation() {
      this.showRemove = true;
    },
    //确认作废
    removeOk() {
      // if(this.Leftcurrentrow.xinzeng === '1') {
      //   this.$Message.info('请先保存新增加工单')
      //     return
      // }
      if (!this.Leftcurrentrow.id) {
        this.$Message.info("请先选择盘点单");
        return;
      }
      if (this.Leftcurrentrow.status.value !== 0) {
        this.$Message.info("只有草稿状态加工单能进行作废操作");
        return;
      }
      const data = {};
      data.id = this.Leftcurrentrow.id;
      // if(this.draftShow && this.draftShow !== 0) {
      //   this.$Message.error('只有草稿状态才能作废')
      // }
      getCancellation(data)
        .then(res => {
          if (res.code === 0) {
            this.showRemove = false;
            this.getList();
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

    // 打印
    printTable() {
      this.$refs.printBox.openModal(this.Leftcurrentrow.id);
    },
    //添加配件
    addPro() {
      this.$refs.SelectPartRef.init();
    },
    //左边列表选中当前行
    selectTabelData(row) {
      this.Leftcurrentrow = row;
      console.log(this.Leftcurrentrow, "this.Leftcurrentrow =>713");
      if (!row.detailVOList) {
        row["detailVOList"] = [];
        this.currentData = [];
      }
      if (Array.isArray(row.detailVOList)) {
        this.Leftcurrentrow.detailVOList = row.detailVOList;
      } else {
        this.Leftcurrentrow.detailVOList = [row.detailVOList];
      }
      if (this.Leftcurrentrow.detailVOList.length > 0) {
        this.Right.tbdata = row.detailVOList;
      } else {
        this.Right.tbdata = [];
      }
      if (this.Leftcurrentrow.id != undefined) {
        getRightDatas(this.Leftcurrentrow.id).then(res => {
          console.log(res, "res=>728");
          this.Right.tbdata = res.data;
          this.Leftcurrentrow.detailVOList = res.data;
        });
      }
    },

    //添加配件
    getPartNameList(val) {
      console.log(val, 999);
      // console.log(conversionList(val),8888)
      var datas = conversionList(val);
      console.log(datas, "datas=>738");
      datas.forEach(item => {
        this.Right.tbdata.push(item);
        this.Leftcurrentrow.detailVOList.push(item);
      });
      console.log(this.Right.tbdata);
      console.log(this.Leftcurrentrow);
      // getSubmitList(this.Leftcurrentrow)
      //   .then(res => {
      //     console.log(res);
      //     this.getList()
      //   })
      //   .catch(err => {
      //     this.showRemove = false;
      //     this.$Message.info("添加失败");
      //   });
    },
    //删除
    deletePar() {
      const seleList = this.$refs.xTable1.getSelectRecords();
      const ids = [];
      console.log(seleList, "seleList =>753");
      // seleList.forEach(item => {
      //   ids.push(Number(item.id));
      // });
      for (var i = 0; i < seleList.length; i++) {
        ids.push(seleList[i].id);
        this.mainid = seleList[i].mainId;
      }
      console.log(ids, this.mainId);
      let arrParams = {
        ids: ids,
        mainId: this.mainid
      };
      // console.log(arrParams, "arrParams =>774");
      this.array_diff(this.Leftcurrentrow.detailVOList, seleList);
      // console.log(arrParams, "arrParams781");
      delectTable(arrParams)
        .then(res => {
          console.log(res, "783");
          if (res.code == 0) {
            this.$Message.success("删除成功");
            // this.selectTabelData();
          }
        })
        .catch(err => {
          this.showRemove = false;
        });
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
