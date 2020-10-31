<template>
  <div class="content-oper content-oper-flex loadingClass">
    <section class="oper-box">
      <!--      主菜单导航-->
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
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
          <!--<div class="db">-->
          <!--<Button class="mr10" @click="addProoo" v-has="'add'">-->
          <!--<Icon type="md-add" />新增-->
          <!--</Button>-->
          <!--</div>-->
          <!--<div class="db">-->
            <!--<Button-->
              <!--@click="baocun"-->
              <!--v-has="'save'"-->
              <!--type="default"-->
              <!--class="mr10"-->
              <!--:disabled="this.formPlan.statuName!== '草稿'"-->
            <!--&gt;保存</Button>-->
          <!--</div>-->
          <div class="db">
            <Button
              @click="editPro"
              v-has="'submit'"
              type="default"
              class="mr10"
              :loading="commitLoading"
              :disabled="this.formPlan.statuName!== '草稿'"
            >提交</Button>
          </div>
          <!--<div class="db">-->
          <!--<Button-->
          <!--class="mr10"-->
          <!--v-has="'cancellation'"-->
          <!--@click="cancellation"-->
          <!--:disabled="this.formPlan.statuName!== '草稿'"-->
          <!--&gt;-->
          <!--<Icon type="md-close" size="14" />作废-->
          <!--</Button>-->
          <!--</div>-->
          <!--<div class="db">-->
          <!--<Button-->
          <!--class="mr10"-->
          <!--@click="printTable"-->
          <!--v-has="'print'"-->
          <!--:disabled="this.formPlan.statuName!== '草稿'"-->
          <!--&gt;-->
          <!--<i class="iconfont mr5 icondayinicon"></i> 打印-->
          <!--</Button>-->
          <!--</div>-->
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
                :page-size-opts="[20, 50, 100, 200]"
              ></Page>
            </div>
            <div slot="right" class="con-split-pane-right pl5 goods-list-form">
              <div class="pane-made-hd">出库信息</div>
              <div class="clearfix purchase" ref="planForm">
                <Form
                  inline
                  :show-message="false"
                  ref="form"
                  :model="formPlan"
                  :label-width="100"
                  :rules="ruleValidate"
                >
                  <FormItem label="出库单号：" prop="serviceId">
                    <Tooltip :content="formPlan.serviceId">
                    <Input
                      v-model="formPlan.serviceId"
                      class="w160"
                      value="YCSDFD839239320"
                      disabled
                    />
                    </Tooltip>
                  </FormItem>
                  <FormItem label="关联单号：" prop="code">
                    <Tooltip :content="formPlan.code">
                    <Input
                      v-model="formPlan.code"
                      class="w160"
                      value="YCSDFD839239320"
                      disabled
                    />
                    </Tooltip>
                  </FormItem>
                  <FormItem label="创建日期：" prop="createTime">
                    <Input
                      v-model="formPlan.createTime"
                      class="w160"
                      value="YCSDFD839239320"
                      disabled
                    />
                  </FormItem>
                  <FormItem label="出库仓库：" prop="storeId">
                    <Select
                      v-model="formPlan.storeId"
                      style="width:100px"
                      disabled
                    >
                      <Option
                        v-for="item in warehouseList"
                        :disabled="item.isDisabled"
                        :value="item.id"
                        :key="item.id"
                      >{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="票据类型：" prop="serviceId">
                    <Select
                      v-model="formPlan.billTypeId"
                      style="width:100px"
                      disabled
                    >
                      <Option
                        v-for="item in settleTypeList.CS00107"
                        :value="item.itemCode"
                        :key="item.itemCode"
                      >{{ item.itemName }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="客户：" prop="orderMan">
                    <Tooltip :content="formPlan.orderMan">
                    <Input
                      v-model="formPlan.orderMan"
                      class="w160"
                      value="YCSDFD839239320"
                      disabled
                    />
                    </Tooltip>
                  </FormItem>
                  <FormItem label="备注：" prop="remark">
                    <Tooltip :content="formPlan.remark">
                    <Input
                      v-model="formPlan.remark"
                      class="w160"
                    />
                    </Tooltip>
                  </FormItem>
                  <FormItem label="来源：">
                    <Input
                      class="w160"
                      :value="formPlan.source===0?'OMS盘点':formPlan.source?formPlan.source===1||formPlan.source===2?'WMS盘点':'OMS盘点':''"
                      disabled
                    />
                  </FormItem>
                </Form>
              </div>
              <div class="flex plan-cz-btn" ref="planBtn">
                <!--<div class="clearfix">-->
                <!--<div class="fl mb5">-->
                <!--<Button-->
                <!--size="small"-->
                <!--class="mr10"-->
                <!--@click="addPro"-->
                <!--v-has="'addPro'"-->
                <!--:disabled="draftShow != 0||!formPlan.storeId"-->
                <!--&gt;-->
                <!--<Icon type="md-add" />添加配件-->
                <!--</Button>-->
                <!--</div>-->
                <!--<div class="fl mb5">-->
                <!--<Button-->
                <!--size="small"-->
                <!--class="mr10"-->
                <!--@click="shanchu"-->
                <!--v-has="'delete'"-->
                <!--:disabled="draftShow != 0"-->
                <!--&gt;-->
                <!--<i class="iconfont mr5 iconlajitongicon"></i> 删除-->
                <!--</Button>-->
                <!--</div>-->
                <!--<div class="fl mb5">-->
                <!--<Upload-->
                <!--ref="upload"-->
                <!--:show-upload-list="false"-->
                <!--:headers="headers"-->
                <!--:action="upurl"-->
                <!--:format="['xlsx', 'xls', 'csv']"-->
                <!--:before-upload="handleBeforeUpload"-->
                <!--:on-format-error="onFormatError"-->
                <!--:on-success="handleSuccess"-->
                <!--:disabled="draftShow != 0||!formPlan.serviceId"-->
                <!--&gt;-->
                <!--<Button-->
                <!--@click="importAss"-->
                <!--size="small"-->
                <!--class="mr10"-->
                <!--v-has="'import'"-->
                <!--:disabled="draftShow != 0||!formPlan.storeId"-->
                <!--&gt;导入</Button>-->
                <!--</Upload>-->
                <!--&lt;!&ndash; <Button size="small" @click="importAss" class="mr10" :disabled="draftShow != 0">-->
                <!--<i class="iconfont mr5 iconlajitongicon"></i> 导入-->
                <!--</Button>&ndash;&gt;-->
                <!--</div>-->
                <!--</div>-->
              </div>
              <vxe-table
                ref="xTable1"
                border
                resizable
                auto-resize
                @edit-closed="editClosedEvent"
                @edit-actived="editActivedEvent"
                size="mini"
                :height="rightTableHeight"
                :data="Right.tbdata"
                :footer-method="addFooter"
                :edit-config="{trigger: 'click', mode: 'cell'}"
              >
                <vxe-table-column  show-overflow="tooltip" type="seq" width="80" title="序号" fixed="left"></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip" field="partCode" title="配件编码" width="120" fixed="left"></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip" field="partName" title="配件名称" width="120" fixed="left"></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip" field="partBrand" title="品牌" width="100" fixed="left"></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip" field="unit" title="单位" width="100"></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip" field="sysQty" title="系统数量" width="100"></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip"
                  field="trueQty"
                  title="实盘数量"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip"
                  field="exhibitQty"
                  title="出库数量"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip"
                  field="exhibitPrice"
                  title="出库单价"
                  width="100"
                ></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip"
                  field="exhibitPrice"
                  title="出库金额"
                  width="100"
                >
                  <template v-slot="{ row, seq }">
                    <span>{{(Math.abs(row.exhibitPrice * row.exhibitQty))||0 }}</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column  show-overflow="tooltip"
                  field="oemCode"
                  title="OE"
                  width="100"
                >
                </vxe-table-column>
                <vxe-table-column  show-overflow="tooltip" field="carBrandName" title="品牌车型" width="100"></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip" field="spec" title="规格" width="100"></vxe-table-column>
                <vxe-table-column  show-overflow="tooltip" field="partInnerId" title="配件内码" width="120"></vxe-table-column>
              </vxe-table>
            </div>
          </Split>
        </div>
      </div>
    </section>
    <!--添加配件-->
    <Select-part-com ref="SelectPartRef" @selectPartName="getPartNameList" :keyType="1" :storeId="formPlan.storeId" ></Select-part-com>
    <!--更多弹框-->
    <More
      :getShowMore="showMore"
      @getMoreStatus="getMoreStatus"
      @getMoreData="getMoreData"
      :billStatusId="purchaseType"
      ref="More"
    ></More>
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
    saveVentory,
    submitVentory,
    getCancellation, //作废
    delectTable, //删除
    importAccessories, //导入
    //getDataQuickList,
    getDataTypeList,
    //saveDataList,
    submitDataList,
    //outDataList,
    removeDataList,
    stampDataList,
    stampApplyDataList
  } from "../../../../api/inventory/salesList";

  import {getDigitalDictionary} from "../../../../api/system/essentialData/clientManagement";
  import { getSales } from "@/api/salesManagment/salesOrder";
  import "../../../lease/product/lease.less";
  import { conversionList } from "@/components/changeWbList/changewblist";
  import QuickDate from "../../../../components/getDate/dateget";
  import "../../../lease/product/lease.less";
  import SelectPartCom from "../../../salesManagement/salesOrder/components/selectPartCom";
  import PrintShow from "./components/PrintShow";
  import More from "./components/More";
  import moment, { months } from "moment";
  import Cookies from "js-cookie";
  import { TOKEN_KEY } from "@/libs/util";
  import * as tools from "../../../../utils/tools";
  import { hideLoading, showLoading } from "@/utils/loading";

  export default {
    name: "inventoryLosses",
    components: {
      QuickDate,
      PrintShow,
      More,
      SelectPartCom
    },
    data() {
      return {
        commitLoading: false,
        salesList: [], //盘点员列表
        dis: false,
        split1: 0.2,
        tabIndex: 0,
        curronly: false,
        purchaseType: 99, //查询选项
        flag:0,
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
            value: 8
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
            size: 20,
            total: 0
          },
          columns: [
            //key要修改
            {
              title: "序号",
              width: 50,
              type: "index",
              resizable:true
            },
            {
              title: "状态",
              key: "statuName",
              width: 70,
              resizable:true
            },
            {
              title: "客户",
              key: "orderMan",
              width: 120,
              resizable:true
            },
            {
              title: "出库单号",
              key: "serviceId",
              width: 170,
              resizable:true
            },
            {
              title: "关联单号",
              key: "code",
              width: 140,
              resizable:true
            },
            {
              title: "创建人",
              key: "createUname",
              width: 200,
              resizable:true
            },
            {
              title: "创建日期",
              key: "createTime",
              width: 200,
              resizable:true
            },
            {
              title: "提交人",
              key: "subMan",
              width: 200,
              resizable:true
            },
            {
              title: "提交日期",
              key: "subDate",
              width: 200,
              resizable:true
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
        formPlan: {},
        headers: {
          Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
        },
        //导入上传接口
        upurl: "",
        draftShow: 0, //判断是不是草稿
        showAudit: false, //审核提示
        showRemove: false, //作废提示
        isAddRight: true, //判断右侧是有数据
        showBayer: false, //出库方弹窗
        rightTableStatus: "", //右侧表格状态
        ruleValidate: {
        },
        settleTypeList:{},//票据类型
        //左侧选中id
        selectLeftItemId:''
      };
    },
    // created() {
    //   this.getList();
    //   this.getAllSales();
    //   this.getType();
    // },
    methods: {

      //获取客户属性
      async getType() {
        let data = {}
        //107票据类型`
        //106结算方式
        data = ['CS00106', 'CS00107']
        let res = await getDigitalDictionary(data)
        if (res.code == 0) {
          this.settleTypeList = res.data
        }
      },

      //获取销售员
      async getAllSales() {
        let res = await getSales();
        if (res.code === 0) {
          this.salesList = res.data.content;
          this.salesList.map(item => {
            item.label = item.userName;
          });
        }
      },
      //获取销售员
      selectOrderMan(val) {
        this.formPlan.orderMan = val ? (val.label ? val.label : "") : "";
        this.formPlan.orderManId = val ? (val.value ? val.value : "") : "";
      },
      editActivedEvent({ row }) {
        this.dis = this.formPlan.billStatusId
          ? this.formPlan.billStatusId.value === 0
            ?false
            :true
          : false;
      },
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
        data.inventoryOrderType = 2;
        let page = this.Left.page.num - 1;
        let size = this.Left.page.size;
        getLeftList(data, page, size)
          .then(res => {
            // console.log(res)
            if (res.code === 0) {
              if (!res.data.content) {
                this.Left.tbdata = [];
                this.Left.page.total = 0;
              } else {
                res.data.content.map((item, index) => {
                  item["index"] = index + 1;
                  item["statuName"] = item.billStatusId?item.billStatusId.name:"";
                });
                this.Left.tbdata = res.data.content || [];
                this.Left.page.total = res.data.totalElements;
                if(this.selectLeftItemId){
                  for(let b of this.Left.tbdata){
                    if(this.selectLeftItemId==b.id){
                      b._highlight = true;
                      this.selectTabelData(b);
                      break
                    }
                  }
                }
              }
            }
          })
          .catch(err => {
            this.$Message.info("获取盘点列表失败");
          });
      },

      //清除表单校验
      handleReset() {
        this.$refs.form.resetFields();
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
      // //盘点仓库
      // infoFormPlan1(value) {
      //   console.log(value)
      //   this.formPlan.storeId = value
      // },
      // // 盘点员
      // infoFormPlan2(event) {
      //   this.formPlan.orderMan = event.target.value
      //   console.log(this.formPlan.orderMan)
      // },
      // 盘点日期
      // auditDateForm(data) {

      // },
      //更多按钮
      More() {
        this.$refs.More.reset();
        this.selectLeftItemId = "";
        this.showMore = true;
      },
      //更多弹窗恢复false
      getMoreStatus(val) {
        this.showMore = val;
      },
      //更多搜索接收调拨申请列表
      getMoreData(val) {
        let arrData = val.data.content||[]
        arrData.map((item, index) => {
          item["index"] = index + 1;
          item["statuName"] = item.billStatusId.name;
        });
        this.Left.tbdata = arrData;
        this.Left.page.total = val.data.totalElements;
      },
      //新增
      addProoo() {
        if (this.Left.tbdata.length !== 0) {
          if (this.Left.tbdata[0]["xinzeng"] === "1") {
            this.$Message.info(
              "当前列表已有一个新增单等待操作,请先保存当前操作新增单据"
            );
            return;
          }
        }
        let item = {
          index: 1,
          xinzeng: "1",
          billStatusId: {
            enum: "DRAFT",
            name: "草稿",
            value: 0
          },
          statuName: "草稿",
          checkDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          orderMan: this.$store.state.user.userData.staffName || "", //盘点人
          orderManId: this.$store.state.user.userData.id || "", //盘点人id
          serviceId: "",
          print: "",
          createUname: "",
          createTime: "",
          commitUname: "",
          createTime: "",
          //commitDate:"",
          //createTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          //createUname: this.$store.state.user.userData.staffName,
          detailVOList: [],
          _highlight: true
        };
        this.draftShow = 0;
        this.formPlan = item;
        this.Right.tbdata = [];
        let newItem = JSON.parse(JSON.stringify(item));
        this.Left.tbdata.unshift(newItem);
        this.flag = 1;
        this.Left.tbdata.map((item, index) => {
          item.index = index + 1;
        });
      },
      // 提交
      editPro() {
        //判断是否是新增状态
        if(this.flag){
          return this.$Message.error("提交前请先保存单据信息");
        }
        //判断是否为草稿状态
        if (this.Right.tbdata.length < 1) {
          this.$Message.error("请选择数据");
          return;
        }
        if (this.formPlan.billStatusId.value !== 0) {
          this.$Message.error("只有草稿状态才能提交");
          return;
        }
        // this.$refs.form.validate(valid => {
        //   if (valid) {
        //     this.formPlan.checkDate = moment(this.formPlan.checkDate).format(
        //       "YYYY-MM-DD HH:mm:ss"
        //     );
        //     this.formPlan.billStatusId = 1;
        //     getSubmitList(this.formPlan).then(res => {
        //       if (res.code == 0) {
        //         this.$Message.success("提交成功");
        //         this.getList();
        //       }
        //     });
        //   } else {
        //     callback(new Error("带*必填"));
        //   }
        // });
        this.$Modal.confirm({
          title: "是否确定提交订单",
          onOk: () => {
            this.commitLoading = true;
            showLoading(".loadingClass", "数据加载中，请勿操作")
            submitVentory(this.formPlan).then(res => {
              if (res.code == 0) {
                this.$Message.success("提交成功");
                this.getList();
              }
              hideLoading()
              this.commitLoading = false;
            }).catch(e => {
              hideLoading()
              this.commitLoading = false;
            });
          },
          onCancel: () => {
            this.$Message.info("取消提交");
          }
        });
      },
      //保存
      baocun() {
        saveVentory(this.formPlan).then(res => {
          if (res.code == 0) {
            this.flag = 0;
            this.isAddRight = true;
            this.Right.tbdata = [];
            this.formPlan = {};
            this.$Message.success("保存成功");
            this.getList();
          }
          this.handleReset();
          // else{
          //   this.formPlan.checkDate = preTime;
          // }
        });
      },
      //导出
      //  setDerive(){
      //   let list = this.$store.state.dataList.oneOrder
      //   if(!list.id){
      //       this.$message.error('请选择一条有效数据')
      //       return false
      //   }else {
      //       location.href = baseUrl.omsOrder + '/sellOrderMain/export?id='+ list.id +'&access_token=' + Cookies.get(TOKEN_KEY)
      //   }
      //  },

      //作废
      //作废提示
      cancellation() {
        this.showRemove = true;
      },
      //确认作废
      removeOk() {
        if (this.Right.tbdata.length < 1) {
          this.$Message.error("请选择数据");
          return;
        }
        //判断是否为草稿状态
        if (this.formPlan.billStatusId.value !== 0) {
          this.$Message.error("只有草稿状态才能作废");
          return;
        }
        getCancellation(this.formPlan.id)
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
      auditCancel() {
        this.showRemove = false;
      },
      // 打印
      printTable() {
        this.$refs.printBox.openModal(this.formPlan.id,this.warehouseList);
      },

      //添加配件
      addPro() {
        this.$refs.SelectPartRef.init();
      },
      //左边列表选中当前行
      selectTabelData(data, val) {
        if (this.flag === 1) {
          this.$Modal.confirm({
            title: "您正在编辑单据，是否需要保存",
            onOk: () => {
              this.baocun();
            },
            onCancel: () => {
              this.getList();
              this.flag = 0;
            }
          });
          return;
        }
        // this.salesList.map(item => {
        //   if (item.label === data.createUname) {
        //     data.orderManId = item.id;
        //   }
        // });
        this.selectLeftItemId = data.id||"";
        this.formPlan = data;
        this.Right.tbdata = data.detailVOList;
        this.draftShow = data.billStatusId.value;
      },
      shanchu() {
        if (
          this.formPlan.hasOwnProperty("billStatusId") &&
          this.formPlan.billStatusId.value !== 0
        ) {
          this.$Message.info("只有草稿状态才能进行删除操作");
          return;
        }
        // 组装删除
        const seleList = this.$refs.xTable1.getSelectRecords();
        const ids = [];
        seleList.forEach(item => {
          ids.push(item.id);
        });
        // console.log(this.formPlan)
        this.Right.tbdata = this.Right.tbdata.filter(
          item => !seleList.includes(item)
        );
        if (!ids[0]) return;
        // this.array_diff(this.Right.tbdata, seleList);
        this.Left.tbdata.map((item, index) => {
          if (item.id === this.formPlan.id) {
            this.$set(this.Left.tbdata[index], "detailVOList", this.Right.tbdata);
          }
        });
        delectTable(ids)
          .then(res => {
            if (res.code == 0) {
              this.$Message.success("删除成功");
            }
          })
          .catch(err => {
            this.showRemove = false;
          });
      },
      //导入
      importAss() {
        if(!this.formPlan.serviceId){
          return this.$Message.warning("请先保存信息生成盘点单号才能导入配件");
        }
        this.upurl = `${importAccessories}?id=${this.formPlan.id}`;
      },
      // handleSuccess(res, file) {
      //   let self = this;
      //   if (res.code == 0) {
      //     self.$Message.success("导入成功");
      //     this.Right.tbdata = res.data.details;
      //     this.getList();
      //   } else {
      //     self.$Message.error(res.message);
      //   }
      // },
      onFormatError(file) {
        this.$Message.error("只支持xls xlsx后缀的文件");
      },
      handleSuccess(response) {
        if (response.code == 0) {
          let txt = "上传成功";
          if (response.data.length > 0) {
            txt = response.data.join(",");
          }
          this.$Notice.warning({
            title: "",
            desc: txt,
            duration: 0
          });
        } else {
          this.$Message.error(response.message);
        }
        this.getList();
      },
      handleBeforeUpload() {
        if (!this.formPlan.billStatusId) {
          return this.$Message.error("请先保存数据!");
        }
        let refs = this.$refs;
        refs.upload.clearFiles();
      },
      //配件返回的参数
      getPartNameList(val) {
        var datas=val;
        datas.map(item=>{
          item.id=''
        })
        this.formPlan.detailVOList = datas;
        this.Right.tbdata = [...this.Right.tbdata, ...datas];
        // this.formPlan.checkDate = moment(this.formPlan.checkDate).format(
        //   "YYYY-MM-DD HH:mm:ss"
        // );
        this.$refs.SelectPartRef.searchPartLayer = false;
        this.$Message.success("已添加");
        // getSubmitList(this.formPlan)
        //   .then(res => {
        //
        //     this.getList();
        //   })
        //   .catch(err => {
        //     this.showRemove = false;
        //     this.$Message.info("添加失败");
        //   });
      },
      //分页
      changePage(p) {
        this.Left.page.num = p;
        this.getList();
      },
      changeSize(size) {
        this.Left.page.num = 1;
        this.Left.page.size = size;
        this.getList();
      },
      //表格编辑状态下被关闭的事件
      editClosedEvent() {},
      //改变时间类型
      dateType() {
        // this.formPlan.checkDate=moment(this.formPlan.checkDate).format(
        //   "YYYY-MM-DD HH:mm:ss")
        // console.log( this.formPlan.checkDate)
      },
      //footer计算
      addFooter() {},
      // 确定
      Determined() {},
      array_diff(a, b) {
        for (var i = 0; i < b.length; i++) {
          for (var j = 0; j < a.length; j++) {
            if (a[j].id === b[i].id) {
              a.splice(j, 1);
              j = j - 1;
            }
          }
        }
        return a;
      },
    },
    mounted() {
      this.getList();
      this.getAllSales();
      this.getType();
      setTimeout(() => {
        this.getDomHeight();
      }, 0);

      window.onresize = () => {
        this.getDomHeight();
      };
    },
    watch: {
      purchaseType: {
        handler(newVal) {
          this.Left.page.num = 1;
          this.Left.page.size = 20;
          this.getList();
        },
        deep: true
      }
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
