<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf wlf-center">
          <div class="db">
            <span>快速查询：</span>
          </div>
          <div class="db">
            <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>
          </div>
          <div class="db">
            <Select v-model="salesType" class="w90 mr10">
              <Option
                v-for="item in salesTypeArr"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}
              </Option
              >
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
            >
              <Icon type="md-add"/>
              新增
            </Button
            >
          </div>
          <div class="db">
            <Button type="default" class="mr10"
            ><i class="iconfont mr5 iconbaocunicon"></i>保存
            </Button
            >
          </div>
          <div class="db">
            <Button class="mr10"
            ><i class="iconfont mr5 iconziyuan2"></i>提交
            </Button
            >
          </div>
          <div class="db">
            <Button class="mr10"
            ><i class="iconfont mr5 icondayinicon"></i> 打印
            </Button
            >
          </div>

          <div class="db">
            <Button class="mr10"
            >
              <Icon type="md-close" size="14"/>
              作废
            </Button
            >
          </div>
          <div class="db">
            <Button class="mr10"
            ><i class="iconfont mr5 icondaochuicon"></i> 导出
            </Button
            >
          </div>
          <div class="db">
            <Button class="mr10"
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
                height="660"
                size="small"
                highlight-row
                border
                :stripe="true"
                :loading="preSellOrderTable.loading"
                :columns="preSellOrderTable.columns"
                :data="preSellOrderTable.tbData"
              ></Table>


              <Page :total="page.total" :page-size="page.size" :current="page.num" show-sizer show-total
                    class-name="page-con"
                    @on-change="selectNum" @on-page-size-change="selectPage" class="mr10"></Page>
            </div>
            <!-- 右边表格-->
            <div slot="right" class="con-split-pane-right pl5 goods-list-form" style="overflow-y: auto; height: 100%;">
              <div class="pane-made-hd">
                <span class="titler mr5">固定额度:</span>
                <span class="titler mr10">{{ 31231 |priceFilters}}</span>
                <span class="titler mr5">临时余额:</span>
                <span class="titler mr10">{{ 31231 |priceFilters}}</span>
                <span class="titler mr5">可用余额:</span>
                <span class="titler mr5">{{ 31231 |priceFilters}}</span>
              </div>
              <div class="clearfix purchase" ref="planForm">
                <Form
                  inline
                  ref="formPlan"
                  :model="formPlan"
                  :label-width="120"

                >
                  <FormItem label="客户：" prop="name">
                    <Row class="w160">
                      <Col span="19"
                      ><Input
                        v-model="formPlan.asd" disabled
                        placeholder="请选择客户"
                      /></Col>
                      <Col span="5"
                      >
                        <Button
                          @click="CustomerShowModel"
                          class="ml5"
                          size="small"
                          type="default"
                        ><i
                          class="iconfont iconxuanzetichengchengyuanicon"
                        ></i></Button
                        >
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem label="业务员：">
                    <Input
                      class="w160"
                      placeholder="请输入业务员"

                    />
                  </FormItem>
                  <FormItem label="交货仓库：">
                    <Select v-model="model1" style="width:100px">
                      <Option v-for="item in wareHouseList" :value="item.value" :key="item.value">{{ item.label }}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="退货日期：">
                    <DatePicker
                      style="width: 160px"
                      type="date"
                      placeholder="请选择退货日期"

                    ></DatePicker>
                  </FormItem>
                  <FormItem label="预售单号：">
                    <Input class="w160"/>
                  </FormItem>
                  <FormItem label="票据类型:">
                    <Select v-model="model1" style="width:100px">
                      <Option v-for="item in wareHouseList" :value="item.value" :key="item.value">{{ item.label }}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="结算方式：">
                    <Select v-model="model1" style="width:100px">
                      <Option v-for="item in wareHouseList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="预计发货日期:">
                    <DatePicker type="date" placeholder="选择日期" style="width: 150px"></DatePicker>
                  </FormItem>
                  <FormItem label="预计到货日期:">
                    <DatePicker type="date" placeholder="选择日期" style="width: 150px"></DatePicker>
                  </FormItem>
                  <FormItem label="备注：">
                    <Input style="width: 370px" v-model="formPlan.type"></Input>
                  </FormItem>
                </Form>
              </div>
              <div class="flex plan-cz-btn" ref="planBtn">
                <div class="clearfix">
                  <div class="fl mb5">
                    <Button size="small" class="mr10" @click="addMountings ">
                      <Icon type="md-add"/>
                      添加配件
                    </Button>
                  </div>
                  <div class="fl mb5">
                    <Button size="small" class="mr10"
                    >
                      <Icon custom="iconfont iconlajitongicon icons"/>
                      删除配件
                    </Button
                    >
                  </div>
                  <div class="fl mb5">
                    <Button size="small" class="mr10">
                      <span class="center"><Icon custom="iconfont icondaoruicon icons"/>导入配件</span>
                    </Button>
                  </div>
                  <div class="fl mb5">
                    <Button size="small" class="mr10" @click="openAddressShow"> 编辑发货信息</Button>
                  </div>
                </div>
              </div>
              <vxe-table
                border
                resizable
                size="mini"
                height='500'
                :data="tableData"
                :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
              >
                <vxe-table-column
                  type="index"
                  title="序号"
                ></vxe-table-column>
                <vxe-table-column type="checkbox"></vxe-table-column>
                <!-- <vxe-table-column title="操作" width="80">
                  <template v-slot="{ row }">
                    <Button type="text">查看</Button>
                  </template>
                </vxe-table-column> -->

                <vxe-table-column
                  field="name"
                  title="配件编码"
                ></vxe-table-column>
                <vxe-table-column
                  field="role"
                  title="配件名称"
                ></vxe-table-column>
                <vxe-table-column
                  field="sex"
                  title="品牌"
                ></vxe-table-column>
                <vxe-table-column field="num" title="数量">
                  <template v-slot:edit="{ row }">
                    <InputNumber
                      :max="9999"
                      :min="0"
                      v-model="row.num"
                    ></InputNumber>
                  </template>
                </vxe-table-column>

                <vxe-table-column field="price" title="销价" :edit-render="{name: 'input'}">
                  <template v-slot:edit="{ row }">
                    <InputNumber
                      :max="9999"
                      :min="0"
                      v-model="row.price"
                    ></InputNumber>
                  </template>
                  <template v-slot="{ row }">
                    {{ row.price | priceFilters }}
                  </template>
                </vxe-table-column>
                <vxe-table-column title="金额" filed="totalprice" :edit-render="{name: 'input'}">
                  <template v-slot="{ row }">
                    {{ (row.price * row.num) | priceFilters }}
                  </template>
                </vxe-table-column>
                <vxe-table-column
                  field="num6"
                  title="备注"
                  :edit-render="{name: 'input'}"
                ></vxe-table-column>
                <vxe-table-column
                  field="date12"
                  title="仓库"
                  :edit-render="{name: 'select', options: inStores}"
                ></vxe-table-column>

                <vxe-table-column
                  field="date12"
                  title="品牌车型"
                ></vxe-table-column>
                <vxe-table-column
                  field="date12"
                  title="单位"
                ></vxe-table-column>
                <vxe-table-column
                  field="date12"
                  title="OEM码"
                ></vxe-table-column>
                <vxe-table-column
                  field="date12"
                  title="规格"
                ></vxe-table-column>
                <vxe-table-column
                  field="date12"
                  title="方向"
                ></vxe-table-column>
              </vxe-table>
            </div>
          </Split>
        </div>
      </div>
    </section>
    <select-part-com ref="selectPartCom" @selectPartName="getPartNameList"></select-part-com>
    <!--    选择客户-->
    <select-the-customer ref="selectTheCustomer"></select-the-customer>
    <!--更多 搜索-->
    <More-search :data="moreQueryList" ref="moreQuery"></More-search>
    <!--  编辑发货地址 -->
    <Modal v-model="addressShow" title="收货信息" width="1000">
      <goods-info></goods-info>
      <div slot='footer'>
        <Button type='primary' @click=changeShippingAddress>确定</Button>
        <Button type='default' @click='addressShow = false'>取消</Button>
      </div>
    </Modal>
  </div>

</template>

<script>
  import {getLeftList} from "_api/salesManagment/presell.js";
  import QuickDate from '_c/getDate/dateget';
  import goodsInfo from "../../../components/goodsInfo/goodsInfo";
  import selectTheCustomer from '../commonality/SelectTheCustomer.vue'
  import selectPartCom from "../salesOrder/components/selectPartCom";
  import MoreSearch from "./components/MoreSearch";

  export default {
    name: "presell",
    components: {
      QuickDate,
      goodsInfo,
      selectTheCustomer,
      selectPartCom,
      MoreSearch
    },
    data() {
      return {
        moreQueryList: {},//更多查询
        model1: '',
        inStores: [],// 入库仓
        wareHouseList: [ //交货仓库
          {
            value: 'New York',
            label: 'New York'
          },
          {
            value: 'New York1',
            label: 'New York1'
          },
        ],
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
        salesTypeArr: [
          {
            'label': '所有',
            'value': 0
          },
          {
            'label': '草稿',
            'value': 1
          },
          {
            'label': '待受理',
            'value': 2
          },
          {
            'label': '已受理',
            'value': 3
          },
          {
            'label': '已完成',
            'value': 4
          },
          {
            'label': '已作废',
            'value': 5
          },
        ],//快速查询订单状态选项
        salesType: '',//快速查询选中
        //右侧表格数据
        tableData: [],
        formPlan: {},//表单对象
        addressShow: false,//收货地址显示
        query:{},//更多搜索信息
      }


    },
    mounted(){
      this.getLeftList()
    },
    methods: {
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
      // 快速查询日期
      getDataQuick(v) {
        // console.log(v);
        //  this.startTime=v[0]
        //  this.endTime=v[1]
        // console.log(this.startTime,this.endTime)
      },
      //打开新增客户
      CustomerShowModel() {
        // console.log(44)
        this.$refs.selectTheCustomer.openModel()
      },
      //选择更多
      moreQueryShowModal() {
        this.$refs.moreQuery.openModal()
      },
      //打开收货地址
      openAddressShow() {
        this.addressShow = true
      },
      //添加配件
      addMountings() {
        this.$refs.selectPartCom.init()
      },
      //配件返回的参数
      getPartNameList() {

      },
      //确认收货地址
      changeShippingAddress() {
      },
      //分页查询预售单信息左侧
      getLeftList(){
        let data={

        }
        // params=this.query
        let page = this.page.num -1
        let size = this.page.size
        getLeftList(size,page,data).then(res =>{
          // console.log('打印出来的数据',res)

          if(res.code===0){
            res.data.content.map( item => item.status = JSON.parse(item.status))
            this.preSellOrderTable.tbData = res.data.content
            this.page.total = res.data.totalElements
          }

        })

      }
    },
  }
</script>

<style lang="less" scoped>
  @import url("../../lease/product/lease.less");

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
  }

  .wlf-center {
    display: flex;
    align-items: center;
  }


</style>
