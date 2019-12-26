<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf wlf-center">
          <div class="db">
            <span>快速查询：</span>
          </div>
          <div class="db">
            <getDate class="mr10" @quickDate="getvalue"></getDate>
          </div>
          <div class="db">
            <Select v-model="orderType" style="width:100px" class="mr10" @on-change="getOrderType">
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db">
            <Button
              type="default"
              class="mr10"
              @click="moreQueryShowModal"
            >
              <Icon type="ios-more"/>
              更多
            </Button
            >
          </div>
          <div class="db">
            <Button class="mr10"
                    @click="addOrder"
            >
              <Icon type="md-add"/>
              新增
            </Button
            >
          </div>
          <div class="db">
            <Button type="default" class="mr10"
                    :disabled="draftShow != 0||isNew"
                    @click="isSave"
            ><i class="iconfont mr5 iconbaocunicon"></i>保存
            </Button
            >
          </div>
          <div class="db">
            <Button class="mr10"
                    @click="isSubmit"
                    :disabled="draftShow != 0||isNew"
            ><i class="iconfont mr5 iconziyuan2"></i>提交
            </Button
            >
          </div>
          <div class="db">
            <Button class="mr10"
                    @click="printTable"
            ><i class="iconfont mr5 icondayinicon"></i> 打印
            </Button
            >
          </div>

          <div class="db">
            <Button class="mr10"
                    @click="isDelete"
                    :disabled="draftShow != 0"
            >
              <Icon type="md-close" size="14"/>
              作废
            </Button
            >
          </div>
          <div class="db">
            <Button class="mr10"
                    @click="Output"
            ><i class="iconfont mr5 icondaochuicon"></i> 导出
            </Button
            >
          </div>
          <div class="db">
            <Button class="mr10"
                    :disabled="draftShow != 3"
                    @click="finish"
            ><i class="iconfont mr5 "></i> 完成销售
            </Button
            >
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <div class="con-split" ref="paneLeft">
          <Split v-model="split1" min="300" max="500">
            <!--   左边表格-->
            <div
              slot="left"
              class="con-split-pane-left"
              style="overflow-y: auto; height: 100%;"
            >
              <div class="pane-made-hd">
                预销售单列表
              </div>
              <Table
                :queryTime="queryTime"
                :orderType="orderType"
                height="660"
                size="small"
                highlight-row
                border
                :stripe="true"
                :loading="preSellOrderTable.loading"
                :columns="preSellOrderTable.columns"
                :data="preSellOrderTable.tbData"
                @on-current-change="selectTabelData"
              ></Table>


              <Page :total="page.total" :page-size="page.size" :current="page.num" show-sizer show-total
                    class-name="page-con"
                    @on-change="selectNum" @on-page-size-change="selectPage" class="mr10"></Page>
            </div>
            <!-- 右边表格-->
            <div slot="right" class="con-split-pane-right pl5 goods-list-form" style="overflow-y: auto; height: 100%;">

              <div class="pane-made-hd">
                <span class="titler mr5">固定额度:</span>
                <span class="titler mr10">{{this.limitList.fixationQuota |priceFilters}}</span>
                <span class="titler mr5">临时余额:</span>
                <span class="titler mr10">{{this.limitList.tempQuota |priceFilters}}</span>
                <span class="titler mr5">可用余额:</span>
                <span class="titler mr5">{{ this.limitList.sumAmt |priceFilters}}</span>
              </div>
              <Form
                inline
                ref="formPlan"
                :model="formPlan"
                :label-width="120"
                :rules="ruleValidate"
              >
                <div class="clearfix purchase" ref="planForm">

                  <FormItem label="客户：" prop="guestId">
                    <Row style="width: 310px">
                      <Select v-model="formPlan.guestId" filterable style="width: 240px"
                              :disabled="draftShow != 0||isNew" @on-change="changeClient">
                        <Option v-for="item in client" :value="item.id" :key="item.id">{{ item.fullName }}</Option>
                      </Select>
                      <Button class="ml5" size="small" type="default" @click="CustomerShowModel"
                              :disabled="draftShow != 0||isNew">
                        <Icon type="md-checkmark"/>
                      </Button>

                    </Row>
                  </FormItem>
                  <FormItem label="业务员：" prop="orderManId">
<!--                    <Input-->
<!--                      class="w160"-->
<!--                      placeholder="请输入业务员"-->
<!--                      v-model="formPlan.orderMan"-->
<!--                      :disabled="draftShow != 0||isNew"-->
<!--                    />-->
                    <Select :value="formPlan.orderManId"
                            @on-change="selectOrderMan" filterable style="width: 240px" :disabled="draftShow != 0||isNew"  label-in-value>
                      <Option v-for="item in salesList" :value="item.id" :key="item.id">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="交货仓库：" prop="storeId">
                    <Select v-model="formPlan.storeId" style="width:200px" :disabled="draftShow != 0||isNew"
                            @on-change="getStore">
                      <Option v-for="item in WareHouseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="预售单号：">
                    <Input class="w160" v-model="formPlan.serviceId" disabled/>
                  </FormItem>
                  <FormItem label="票据类型:" prop="billTypeId">
                    <Select v-model="formPlan.billTypeId" style="width:100px" :disabled="draftShow != 0||isNew">
                      <Option v-for="item in settleTypeList.CS00107" :value="item.itemCode" :key="item.itemCode">{{
                        item.itemName }}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="结算方式：" prop="settleTypeId">
                    <Select v-model="formPlan.settleTypeId" style="width:100px" :disabled="draftShow != 0||isNew">
                      <Option v-for="item in settleTypeList.CS00106" :value="item.itemCode" :key="item.itemCode">{{
                        item.itemName }}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="预计发货日期:">
                    <DatePicker :value="formPlan.planSendDate" @on-change="getplanSendDate"
                                @on-clear="clearplanSendDate"
                                v-bind:options="planSendDatePicker" type="date" placeholder="选择日期" style="width: 120px"
                                :disabled="draftShow != 0||isNew"></DatePicker>
                  </FormItem>
                  <FormItem label="预计到货日期:">
                    <DatePicker :value="formPlan.planArriveDate" @on-change="getplanArriveDate"
                                v-bind:options="planArriveDatePicker" type="date"
                                placeholder="选择日期"
                                @on-clear="clearplanArriveDate"
                                style="width: 120px" :disabled="draftShow != 0||isNew"></DatePicker>
                  </FormItem>
                  <FormItem label="备注：">
                    <Input style="width: 370px" v-model="formPlan.remark" :disabled="draftShow != 0||isNew"/>
                  </FormItem>
                </div>
                <div class="flex plan-cz-btn" ref="planBtn">
                  <div class="clearfix">
                    <div class="fl mb5">
                      <Button size="small" class="mr10" @click="addMountings " :disabled="draftShow != 0||isNew">
                        <Icon type="md-add"/>
                        添加配件
                      </Button>
                    </div>
                    <div class="fl mb5">
                      <Button size="small" class="mr10" :disabled="draftShow != 0||isNew"
                              @click="deletePart"
                      >
                        <Icon custom="iconfont iconlajitongicon icons"/>
                        删除配件
                      </Button
                      >
                    </div>
                    <div class="fl mb5">
                      <Upload
                        ref="upload"
                        style="display: inline-block"
                        :show-upload-list="false"
                        :action="upurl"
                        :headers="headers"
                        :format="['xlsx','xls']"
                        :on-format-error="onFormatError"
                        :on-success="onSuccess"
                        :before-upload='beforeUpload'
                      >
                        <Button size="small" class="mr10" @click="getRUl" :disabled="draftShow != 0||isNew">
                          <span class="center"><Icon custom="iconfont icondaoruicon icons"/>导入配件</span>
                        </Button>
                      </Upload>
                    </div>
                    <div class="fl mb5">
                      <Button size="small" class="mr10" @click="openAddressShow" :disabled="draftShow != 0||isNew">
                        编辑发货信息
                      </Button>
                    </div>
                  </div>
                </div>
                <vxe-table
                  border
                  :edit-rules="validRules"
                  show-footer
                  :footer-method="footerMethod"
                  resizable
                  auto-resize
                  size="mini"
                  ref="xTable"
                  height='500'
                  @select-change="selectTable"
                  @select-all="selectAllTable"
                  :data="formPlan.detailVOList"
                  :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
                >
                  <vxe-table-column
                    type="index"
                    title="序号"
                  ></vxe-table-column>
                  <vxe-table-column type="checkbox"></vxe-table-column>
                  <vxe-table-column title="操作">
                    <template v-slot="{ row,rowIndex }">
                      <a @click="openFileModal(row)">查看</a>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column
                    field="partCode"
                    title="配件编码"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="partName"
                    title="配件名称"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="partBrand"
                    title="品牌"
                  ></vxe-table-column>
                  <vxe-table-column field="orderQty" title="数量" :edit-render="{name: 'input'}"></vxe-table-column>
                  <vxe-table-column field="orderPrice" title="销价" :edit-render="{name: 'input'}"></vxe-table-column>
                  <vxe-table-column title="金额">
                    <template v-slot="{ row }">
                      <span>{{ countAmount(row) }} </span>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column
                    field="remark"
                    title="备注"
                    :edit-render="{name: 'input'}"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="storeName"
                    title="仓库"
                    disabled
                  >
                    <template v-slot:edit="{ row }">
                      <Select style="width:100px">
                        <Option
                          v-for="item in WareHouseList"
                          :value="item.id"
                          :key="item.id"
                        >{{ item.name }}
                        </Option
                        >
                      </Select>
                    </template>

                  </vxe-table-column>

                  <vxe-table-column title="品牌车型">
                    <template v-slot="{row,rowIndex}">
                      <span>{{row.carBrandName}} {{row.carModelName}}</span>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column
                    field="unit"
                    title="单位"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="oemCode"
                    title="OEM码"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="spec"
                    title="规格"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="showDirection"
                    title="方向"
                  ></vxe-table-column>
                </vxe-table>
              </Form>
            </div>
          </Split>
        </div>
      </div>
    </section>
    <!--        打印-->
    <Print-show ref="printBox" :id="id"></Print-show>
    <!--      添加配件-->
    <select-part-com ref="selectPartCom" @selectPartName="getPartNameList"></select-part-com>
    <!--    选择客户-->
    <select-the-customer ref="selectTheCustomer" @getOne="setOneClient"></select-the-customer>
    <!--更多 搜索-->
    <More-search :data="moreQueryList" ref="morequeryModal" @moreQuery="queryList"></More-search>
    <!--      查看详情-->
    <See-file ref="fileList" :data="oneRow"></See-file>
    <goods-info ref="goodsInfo" :mainId="id"></goods-info>
  </div>

</template>

<script>
  import baseUrl from '_conf/url'
  import {TOKEN_KEY} from '@/libs/util'
  import {
    getSales,
    getLeftList,
    getClient,
    getWarehouseList,
    getDelete,
    getSave,
    getSubmit,
    getLimit,
    finishSales,
    getDeleteList,
    getup
  } from "_api/salesManagment/presell.js";
  import getDate from '@/components/getDate/dateget'
  import goodsInfo from "../../goods/plannedPurchaseOrder/components/GoodsInfo";
  import selectTheCustomer from '../commonality/SelectTheCustomer.vue'
  import selectPartCom from "../salesOrder/components/selectPartCom";
  import MoreSearch from "./components/MoreSearch";
  import PrintShow from "./components/PrintShow";
  import SeeFile from "../commonality/SeeFile";
  import {getDigitalDictionary} from '@/api/system/essentialData/clientManagement'
  import {conversionList} from '@/components/changeWbList/changewblist'
  import * as tools from "../../../utils/tools";
  import Cookies from "js-cookie";
  export default {
    name: "presell",
    components: {
      getDate,
      goodsInfo,
      selectTheCustomer,
      selectPartCom,
      MoreSearch,
      SeeFile,
      PrintShow
    },
    data() {
      // let changeNumber = (rule, value, callback) => {
      //   if (!value && value != '0') {
      //     callback(new Error("请输入大于或等于0的正整数"));
      //   } else {
      //     const reg = /^([0]|[1-9][0-9]*)$/
      //     if (reg.test(value)) {
      //       callback();
      //     } else {
      //       callback(new Error("请输入大于或等于0的正整数"));
      //
      //     }
      //   }
      // };
      let changeNumber = (rule, value, callback) => {
        if (!value && value != "0") {
          callback(new Error("请输入大于0的正整数"));
        } else {
          const reg = /^[1-9]+\d?$/;
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error("请输入大于0的正整数"));
          }
        }
      };
      // let money = (rule, value, callback) => {
      //   if (!value && value != '0') {
      //     callback(new Error("最多保留2位小数"));
      //   } else {
      //     const reg = /^\d+(\.\d{0,2})?$/
      //     if (reg.test(value)) {
      //       callback();
      //     } else {
      //       callback(new Error("最多保留2位小数"));
      //
      //     }
      //   }
      // };
      let money = (rule, value, callback) => {
        if (!value && value != "0") {
          callback(new Error("最多保留2位小数"));
        } else {
          const reg = /^\d+(\.\d{0,2})?$/i;
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error("最多保留2位小数"));
          }
        }
      };
      return {
        isNew: true, //判断页面开始是否禁用
        headers: {
          Authorization: 'Bearer ' + Cookies.get(TOKEN_KEY)
        },//请求头
        upurl: getup,//导入地址
        oneRow: {},//点击详情的数据
        draftShow: '',//判定是不是草稿
        settleTypeList: {},//结账类型
        moreQueryList: {},//更多查询
        model1: '',
        WareHouseList: [], //交货仓库
        limitList: [], //客户额度
        //分页
        page: {
          total: 0,
          size: 10,
          num: 1
        },
        split1: 0.2,//左右框
        preSellOrderTable: {
          loading: false,
          columns: [
            {
              title: '序号',
              minWidth: 50,
              type: 'index',
              align: 'center'
            },
            {
              title: '状态',
              minWidth: 70,
              render: (h, params) => {
                let tex = params.row.status.name
                return h('span', {}, tex)
              }
            },
            {
              title: '客户',
              key: 'guestName',
              minWidth: 170
            },
            {
              title: '创建日期',
              key: 'createTime',
              minWidth: 120
            },
            {
              title: '创建人',
              key: 'createUname',
              minWidth: 100
            },
            {
              title: '预售单单号',
              key: 'serviceId',
              minWidth: 200
            },
            {
              title: '打印次数',
              key: 'printTime',
              minWidth: 120
            },
            {
              title: '提交人',
              key: 'commitUname',
              minWidth: 100
            },
            {
              title: '提交日期',
              align: 'center',
              key: 'commitTime',
              minWidth: 170
            },

          ],
          tbData: [],

        }, //表格属性
        orderType: 99,  //快速查询状态
        typeList: [
          {value: 99, name: '所有'},
          {value: 0, name: '草稿'},
          {value: 1, name: '待受理'},
          {value: 3, name: '已受理'},
          {value: 4, name: '已完成'},
          {value: 5, name: '已作废'}
        ],
        //右侧表格数据
        tableData: [],
        formPlan: {},//表单对象
        addressShow: false,//收货地址显示
        query: {},//更多搜索信息
        client: [],//客户列表
        totalMoney: '',//总价
        ruleValidate: { //表单校验
          guestId: [
            {required: true, type: 'string', message: ' ', trigger: 'change'}
          ],
          orderManId: [{ required: true, type:'string',message: "  ", trigger: "change" }],
          billTypeId: [
            {required: true, type: 'string', message: ' ', trigger: 'change'}
          ],
          settleTypeId: [
            {required: true, type: 'string', message: ' ', trigger: 'change'}
          ],
          storeId: [
            {required: true, type: 'string', message: ' ', trigger: 'change'}
          ]
        },
        validRules: { //表格校验
          orderQty: [
            {required: true, validator: changeNumber},
          ],
          orderPrice: [
            {required: true, validator: money}
          ]
        },
        queryTime: '',//快速查询时间
        isAdd: true, //判断是否新增
        salesList:[],//业务员列表
        id: '',  //左侧表格id
        PTrow: {
          _highlight: true,
          status: {name: '草稿', value: 0},
            orderMan: this.$store.state.user.userData.staffName,
            orderManId:  this.$store.state.user.userData.id

          // id: '0',
          // details: [],
          // createTime: tools.transTime(new Date())
        },
        selectTableList: [], //右侧table表格选中的数据
        // isCommit: false, //判断是否已提交
        planSendDatePicker: {
          disabledDate: function (date) {
            //不能选择小于当前时间的日期；
            return date.getTime() < new Date(new Date().toLocaleDateString()).getTime();
          },
        },
        planArriveDatePicker: {
        },
      }
    },
    mounted() {
      this.getLeftList()
      this.getAllClient()
      this.getWarehouse()
      this.getType()
      this.getAllSales()

    },
    methods: {
      //获取销售员
      async getAllSales() {
        let res = await getSales();
        if (res.code === 0) {
          this.salesList = res.data.content;
          this.salesList.map(item => {
            item.label = item.userName
          })
        }
      },
      //多选内容
      selectTable(data) {
        this.selectTableList = data.selection
      },
      //全选内容
      selectAllTable(data) {
        this.selectTableList = data.selection
      },
      //获取销售员
      selectOrderMan(val){
        this.formPlan.orderMan = val.label
        this.formPlan.orderManId = val.value

      },
      //导出
      Output() {
        let id = this.id
        if (!id) {
          this.$message.error('请选择一条有效数据')
          return false
        } else {
          location.href = baseUrl.omsOrder + '/guestOrderMain/export?id=' + id + '&access_token=' + Cookies.get(TOKEN_KEY)
        }

      },
      //打印弹出框
      printTable() {
        this.$refs.printBox.openModal()
      },
      // getLimit() {
      //   this.getAllLimit()
      // },
      //获取客户额度
      getAllLimit() {
        let guestId = this.formPlan.guestId
        getLimit(guestId).then(res => {
          // console.log('客户额度数据',res)
          if (res.code === 0) {
            this.limitList = res.data

          }
        })
      },
      //改变客户
      async changeClient(value) {
        // console.log('44444',value)
        if (!value) {
          return false;
        }
        let oneClient = []
        oneClient = this.client.filter( item => {
          return   item.id === value
        })

        console.log(oneClient,5656)
        for(var i  in  oneClient){
          this.formPlan.billTypeId=oneClient[i].billTypeId
          this.formPlan.settleTypeId=oneClient[i].settTypeId

        }
        let guestId = value;
        let res = await getLimit(guestId);
        if (res.code === 0) {
          this.limitList = res.data;
        }
      },

      //更多搜索
      queryList() {
        this.page.num = 1
        let page = this.page.num - 1
        let size = this.page.size
        let data = this.moreQueryList
        getLeftList(size, page, data).then(res => {
          if (res.code === 0) {
            // this.draftShow = value
            this.preSellOrderTable.tbData = res.data.content || []
            this.page.total = res.data.totalElements
          }
        })
      },

      //仓库改变右侧表格改变
      getStore(data) {
        let house = this.WareHouseList.filter(item => item.id == data)
        this.formPlan.detailVOList=[]
        this.formPlan.detailVOList.map(val => {
          val.storeName = house[0].name
        })

      },
      //获取搜索框内的数据
      setOneClient(val) {
        this.$set(this.formPlan, "guestId", val.id);
        this.$set(this.formPlan, "fullName", val.fullName);
        this.$set(this.formPlan,"billTypeId",val.billTypeId)
        this.$set(this.formPlan,"settleTypeId",val.settTypeId)
      },
      //获取表单预计发货时间
      getplanSendDate(data) {
        // this.formPlan.planSendDate = data + ' ' + "00:00:00"
        this.formPlan.planSendDate= tools.transTime(data)
        console.log('11',this.formPlan.planSendDate)

        //选择日期时，不能小于预计发货日期
        let statDt = this.formPlan.planSendDate
        this.planArriveDatePicker = {
          disabledDate(endTime) {
            return endTime.getTime() < new Date(statDt).getTime();
          }
        }
      },
      //获取表单计划到货日期
      getplanArriveDate(data) {
        // this.formPlan.planArriveDate = data + ' ' + "00:00:00"
        this.formPlan.planArriveDate=tools.transTime(data)
        // console.log('22', this.formPlan.planArriveDate)
      },
 //清空日期
      clearplanSendDate(v){
        // console.log('77',v)
        this.formPlan.planSendDate=null
        // console.log('222', this.formPlan.planSendDate)
      },
      clearplanArriveDate(v){
        this.formPlan.planArriveDate=null
      },
      //获取选择状态类型
      getOrderType(v) {
        this.orderType = v
      },
      //获取时间
      getvalue(date) {
        this.queryTime = date
      },
      //切换页面
      selectNum(val) {
        this.page.num = val
        this.getLeftList()
      },
      //切换页数
      selectPage(val) {
        this.page.num = 1
        this.page.size = val
        this.getLeftList()
      },
      //打开新增客户
      CustomerShowModel() {
        this.$refs.selectTheCustomer.openModel()
      },
      //选择更多
      moreQueryShowModal(row) {
        this.oneRow = row
        this.moreQueryList = {}
        this.$refs.morequeryModal.openModal()
      },
      //点击查看
      openFileModal(row) {
        this.oneRow = row
        this.$nextTick(function () {
          this.$refs.fileList.openModal()
        })
      },
      //打开收货地址
      openAddressShow() {
        this.$refs.goodsInfo.init()
      },
      //添加配件
      addMountings() {
        this.$refs.selectPartCom.init()
      },

      //配件返回的参数
      getPartNameList(val) {
        this.$refs.formPlan.validate(async (valid) => {
          if (valid) {
            let data = {}
            data = this.formPlan
            data.detailVOList = conversionList(val)
            let res = await getSave(data)
            if (res.code === 0) {
              this.getLeftList()
              this.formPlan={}
              this.isNew=true
              this.$refs.formPlan.resetFields()
            }
          } else {
            this.$Message.error('*为必填项');
          }
        })

      },
      //客户列表
      getAllClient() {
        getClient().then(res => {
          if (res.code === 0) {
            this.client = res.data
          }
        })
      },
      //分页查询预售单信息左侧
      getLeftList() {
        let data = {}
        data.commitTimeStart = this.queryTime[0] || ''
        data.commitTimeEnd = this.queryTime[1] || ''
        data.status = this.orderType
        let page = this.page.num - 1
        let size = this.page.size
        getLeftList(size, page, data).then(res => {
          if (res.code === 0) {
            // this.draftShow = value
            this.preSellOrderTable.tbData = res.data.content || []
            this.page.total = res.data.totalElements
          }

        })

      },
      //获取左侧表格一行选中的数据
      selectTabelData(v) {
        console.log('左侧数据',v)
        console.log(v)
        this.currentRow = v
        this.id = v.id
        this.isNew = false
        this.draftShow = v.status.value
        this.tableData = v.detailVOList
        this.formPlan = v
      },
      // 获取仓库
      async getWarehouse() {
        let res = await getWarehouseList({groupId: this.$store.state.user.userData.groupId})
        if (res.code === 0) {
          this.WareHouseList = res.data
        }
      },
      //计算表格数据
      countAmount(row) {
        return this.$utils.toNumber(row.orderQty) * this.$utils.toNumber(row.orderPrice)
      },
      // 计算尾部总和
      countAllAmount(data) {
        let count = 0
        data.forEach(row => {
          count += this.countAmount(row)
        })
        this.totalMoney = count
        return count.toFixed(2)
      },
      //获取尾部总数
      footerMethod({columns, data}) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return '和值'
            }
            if (['orderQty', 'orderPrice', 'orderAmt'].includes(column.property)) {
              return this.$utils.sum(data, column.property).toFixed(2)
            }
            if (columnIndex === 8) {
              return ` ${this.countAllAmount(data)} `
            }
            return null
          })
        ]
      },
      //获取客户属性
      async getType() {
        let data = {}
        //107票据类型
        //106结算方式
        data = ['CS00106', 'CS00107']
        let res = await getDigitalDictionary(data)
        if (res.code == 0) {
          this.settleTypeList = res.data
        }

      },

      //新增按钮
      addOrder() {
        this.$refs.formPlan.resetFields();
        this.isNew = false;
        this.tableData = []
        this.formPlan = {}
        this.draftShow = 0
        if (!this.isAdd) {
          return this.$Message.error('请先保存数据');
        }
        this.preSellOrderTable.tbData.unshift(this.PTrow)
        this.formPlan.orderManId=this.PTrow.orderManId
        this.formPlan.orderMan=this.PTrow.orderMan
        this.isAdd = false;
      },
      //作废按钮
      isDelete() {
        if (this.id) {
          this.$Modal.confirm({
            title: '是否确定作废',
            onOk: async () => {
              let id = this.id
              let res = await getDelete(id);
              if (res.code == 0) {
                this.$Message.success('作废成功');
                this.getLeftList()
                this.id = null
                this.formPlan = {}
                this.isNew=true
                this.$refs.formPlan.resetFields();
              }
            },
            onCancel: () => {
              this.$Message.info('取消提交');
            },
          })
        } else {
          this.$Message.warning('请选择草稿状态下的一条有效数据')
        }
      },
      //保存
      isSave() {
        this.$refs.formPlan.validate(async (valid) => {
          if (valid) {
            try {
              await this.$refs.xTable.validate()
              if ((+this.totalMoney) > (+this.limitList.sumAmt)) {
                return this.$message.error('可用余额不足')
              }
              // this.formPlan.orderType = JSON.stringify(this.formPlan.orderType)
              let res = await getSave(this.formPlan)
              if (res.code === 0) {
                this.isAdd = true;
                this.isNew=true
                // this.isCommit = true
                this.$Message.success('保存成功');
                this.getLeftList()
                this.formPlan = {}
                this.$refs.formPlan.resetFields();
              }
            } catch (errMap) {
              // console.log("保存异常信息:"+errMap.message())
              this.$XModal.message({status: 'error', message: '表格校验不通过！'})
            }
          } else {
            this.$Message.error('*为必填项');
          }
        })

      },
      //提交
      isSubmit() {
        // if (!this.isCommit||!this.formPlan.id) {
        //   return this.$Message.error('请先保存数据')
        // }

        this.$Modal.confirm({
          title: '是否确定提交订单',
          onOk: async () => {
            let data = {}
            data = this.formPlan
            let res = await getSubmit(data);
            if (res.code == 0) {
              this.$Message.success('提交成功');
              this.getLeftList()
              // this.isCommit = false;
              this.isNew = true
              this.formPlan = {}
              this.id = null
              this.$refs.formPlan.resetFields();
              this.getLeftList()
            }
          },
          onCancel: () => {
            this.$Message.info('取消提交');
          },
        })
      },

      //完成销售
      finish() {
        if (this.id) {
          this.$Modal.confirm({
            title: '是否确定已完成销售',
            onOk: async () => {
              let id = this.id
              let res = await finishSales(id);
              if (res.code == 0) {
                this.$Message.success('操作成功');
                this.getLeftList()
                this.id = null
                this.$refs.formPlan.resetFields();
                this.formPlan = {}
              }
            },
            onCancel: () => {
              this.$Message.info('取消提交');
            },
          })
        } else {
          this.$Message.warning('请选择已受理状态下的一条有效数据')
        }
      },

      //删除配件
      deletePart() {
        if (this.selectTableList.length > 0) {
          let data = []
          this.selectTableList.forEach(item => {
            data.push({id: item.id})
          })
          getDeleteList(data).then(res => {
            if (res.code === 0) {
              this.$Message.success('删除配件成功');
              this.getLeftList()
              this.formPlan = {}
              this.tableData = []
              this.$refs.formPlan.resetFields();
              this.isNew=true
            }
          })
        } else {
          this.$Message.error('请选择一条有效数据')
        }
      },
      //批量上传失败
      onFormatError(file) {
        this.$Message.error('只支持xls xlsx后缀的文件')
      },
      // 上传成功函数
      onSuccess(response) {
        if (response.code != 0) {
          this.$Message.error(response.message)
        } else {
          this.$Message.success(response.message)
        }
        this.getLeftList()
      },
      //上传之前清空
      beforeUpload() {
        this.$refs.upload.clearFiles()
      },

      //导入配件
      getRUl() {
        let id = this.id
        this.upurl = getup + 'id=' + id
      },
    },
    watch: {
      //监听时间
      queryTime: function (val, old) {
        this.page.num = 1
        this.page.size = 10
        this.getLeftList()
      },
      //监听状态
      orderType: function (val, old) {
        this.page.num = 1
        this.page.size = 10
        this.getLeftList()

      },
      formPlan: {
        handler(val, old) {
          if (!val.id) {
            return false
          }
          this.getAllLimit()
        },
        deep: true
      }
    }
  }

</script>

<style lang="less" scoped>
  @import url("../../lease/product/lease.less");

  .goods-list-form {
    * {
      font-size: 12px !important;
    }

    .ivu-form-item {
      margin-bottom: 10px;
    }

    .plan-cz-btn {
      border-top: 1px solid #ddd;
      margin-top: 6px;
      justify-content: space-between;
      padding: 8px 10px 4px;
      align-items: center;
    }
  }

  .wlf-center {
    display: flex;
    align-items: center;
  }


</style>
