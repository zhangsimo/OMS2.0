<template>
  <main class="bigBox" style="background-color: #fff; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1); padding-top: 16px; height:100%">
    <Tabs type="card" name="orderbox" class="it-box" style="height: 100%" :active-key="tabKey" @on-click="tabChange">
      <TabPane label="配件组装" tab="orderbox" key="0">
        <div class="content-oper content-oper-flex" style="box-shadow:none">
          <section class="oper-box">
            <div class="oper-top flex">
              <div class="wlf">
                <div class="db">
                  <span>快速查询：</span>
                  <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>
                  <Select v-model="form.status" class="w90 mr10">
                    <Option
                      v-for="item in purchaseTypeArr"
                      :value="item.value"
                      :key="item.value"
                    >{{item.label}}</Option>
                  </Select>
                </div>
                <div class="db">
                  <Button type="default" @click="more" class="mr10">
                    <i class="iconfont mr5 iconchaxunicon"></i>更多
                  </Button>
                </div>
                <div class="db">
                  <Button class="mr10" @click="xinzeng">
                    <Icon type="md-add" />新增
                  </Button>
                </div>
                <div class="db">
                  <Button type="default" class="mr10" @click="baocun1">
                    <i class="iconfont mr5 iconbaocunicon"></i>保存
                  </Button>
                </div>
                <div class="db">
                  <Button class="mr10" @click="tijiao1">
                    <Icon type="md-checkmark" size="14" />提交
                  </Button>
                </div>
                <div class="db">
                  <Button class="mr10" @click="zuofei1">
                    <Icon type="md-close" size="14" />作废
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <section class="con-box">
            <div class="inner-box">
              <div class="con-split" ref="paneLeft">
                <Split v-model="split1" min="200" @on-moving="getDomHeight">
                  <div
                    slot="left"
                    class="con-split-pane-left"
                    style="overflow-y: auto; height: 100%;"
                  >
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
                     <Page size="small" :total="Left.page.total" :page-size="Left.page.size" :current="Left.page.num" show-sizer show-total class-name="page-con"
                    @on-change="changePage" @on-page-size-change="changeSize" class="mr10"></Page>
                  </div>
                  <div slot="right" class="con-split-pane-right pl5 goods-list-form">
                    <div class="pane-made-hd">配件组装信息</div>
                    <div class="clearfix purchase" ref="planForm">
                      <Form inline :show-message="false" ref="formPlan" :label-width="100">
                        <FormItem label="仓库：" prop="supplyName" class="redIT">
                          <Row class="w160">
                            <Col span="24">
                              <Select v-model="Leftcurrentrow.storeId" :disabled="Leftcurrentrow.status.value !== 0">
                                <Option
                                  v-for="item in cangkuListall"
                                  :value="item.value"
                                  :key="item.value"
                                >{{item.label}}</Option>
                              </Select>
                            </Col>
                          </Row>
                        </FormItem>
                        <FormItem label="创建日期：" prop="billType" class="redIT">
                          <DatePicker :disabled="Leftcurrentrow.xinzeng || Leftcurrentrow.status.value !== 0" :value="Leftcurrentrow.createTime" format="yyyy-MM-dd HH:mm:ss" type="date" class="w160"></DatePicker>
                        </FormItem>
                        <FormItem label="操作员：" prop="planDate">
                          <Input class="w160" :disabled="Leftcurrentrow.status.value !== 0" :value="Leftcurrentrow.orderMan"></Input>
                        </FormItem>
                        <FormItem label="备注：" prop="remark">
                          <Input :disabled="Leftcurrentrow.status.value !== 0" :value="Leftcurrentrow.remark" class="w160"></Input>
                        </FormItem>
                        <FormItem label="组装单号：" prop="planOrderNum">
                          <Input class="w160" :disabled="Leftcurrentrow.status.value !== 0" :value="Leftcurrentrow.serviceId"></Input>
                        </FormItem>
                      </Form>
                    </div>
                    <div class="flex plan-cz-btn" ref="planBtn">
                      <div class="clearfix">
                        <div class="fl mb5">
                          <Button size="small" class="mr10" @click="addProoo">
                            <Icon type="md-add"/>选择成品
                          </Button>
                        </div>
                        <div class="fl mb5">
                          <Button size="small" class="mr10" @click="shanchu">
                            <i class="iconfont mr5 iconlajitongicon"></i> 删除
                          </Button>
                        </div>
                      </div>
                    </div>
                    <vxe-table
                      v-if="showit"
                      border
                      resizable
                      ref="xTable1"
                      size="mini"
                      highlight-current-row
                      highlight-hover-row
                      @current-change="currentChangeEvent"
                      @select-all="selectAllEvent"
                      @select-change="selectChangeEvent"
                      :height="rightTableHeight"
                      :data="Leftcurrentrow.processProductVO"
                      :footer-method="addFooter"
                      :edit-config="Leftcurrentrow.status.value === 0 ? {trigger: 'dblclick', mode: 'cell'} : {}"
                    >
                      <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                      <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                      <vxe-table-column field="partCode" title="配件编码" width="100"></vxe-table-column>
                      <vxe-table-column field="partName" title="配件名称" width="100"></vxe-table-column>
                      <vxe-table-column field="partBrand" title="品牌" width="100"></vxe-table-column>
                      <vxe-table-column field="unit" title="单位" width="100"></vxe-table-column>
                      <vxe-table-column field="orderQty" :edit-render="{name: 'input', attrs: {type: 'number'}, events: {keyup: keydownEvent}}" title="组装数量" width="100">
                      </vxe-table-column>
                      <vxe-table-column field="orderPrice" title="单价" width="100"></vxe-table-column>
                      <vxe-table-column field="orderAmt" title="金额" width="100"></vxe-table-column>
                      <vxe-table-column field="TaxPrice" title="含税单价" width="100"></vxe-table-column>
                      <vxe-table-column field="TaxAmt" title="含税金额" width="100"></vxe-table-column>
                      <vxe-table-column field="noTaxPrice" title="不含税单价" width="100"></vxe-table-column>
                      <vxe-table-column field="noTaxAmt" title="不含税金额" width="100"></vxe-table-column>
                      <vxe-table-column title="品牌车型">
                        <template v-slot="{row,rowIndex}">
                          <span>{{row.carBrandName}} {{row.carModelName}}</span>
                        </template>
                      </vxe-table-column>
                      <vxe-table-column field="oemCode" title="OE码" width="100"></vxe-table-column>
                      <vxe-table-column field="spec" title="规格" width="100"></vxe-table-column>
                    </vxe-table>

                    <div class="wrapper">
                      <div style="margin: 5px 10px">所需组装零件</div>
                      <vxe-table
                        border
                        resizable
                        size="mini"
                        :height="rightTableHeight"
                        :data="currentData"
                        :footer-method="addFooter"
                        :edit-config="{trigger: 'click', mode: 'cell'}"
                      >
                        <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                        <vxe-table-column field="partCode" title="配件编码" width="100"></vxe-table-column>
                        <vxe-table-column field="partName" title="配件名称" width="100"></vxe-table-column>
                        <vxe-table-column field="partBrand" title="品牌" width="100"></vxe-table-column>
                        <vxe-table-column field="unit" title="单位" width="100"></vxe-table-column>
                        <vxe-table-column field="orderQty" title="需要数量" width="100">
                          <template v-slot="{ row, seq }">
                            <span>{{ row.orderQty * currentNum }}</span>
                          </template>
                        </vxe-table-column>
                        <vxe-table-column field="storeStockQty" title="库存" width="100"></vxe-table-column>
                        <vxe-table-column field="stockOutQty" title="缺货数量" width="100"></vxe-table-column>
                        <vxe-table-column title="品牌车型">
                          <template v-slot="{row,rowIndex}">
                            <span>{{row.carBrandName}} {{row.carModelName}}</span>
                          </template>
                        </vxe-table-column>
                        <vxe-table-column field="spec" title="规格" width="100"></vxe-table-column>
                      </vxe-table>
                    </div>
                  </div>
                </Split>
              </div>
            </div>
          </section>
          <!--更多弹框-->
          <Modal v-model="advanced" title="高级查询" width="600px">
            <More ref="naform"></More>
            <div slot="footer">
              <Button type="primary" @click="Determined">确定</Button>
              <Button type="default">取消</Button>
            </div>
          </Modal>
        </div>
      </TabPane>
      <TabPane label="配件拆分" tab="orderbox" key="1">
          <div class="content-oper content-oper-flex" style="box-shadow:none">
          <section class="oper-box">
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
                  <Button type="default" @click="more" class="mr10">
                    <i class="iconfont mr5 iconchaxunicon"></i>更多
                  </Button>
                </div>
                <div class="db">
                  <Button class="mr10" @click="xinzeng">
                    <Icon type="md-add" />新增
                  </Button>
                </div>
                <div class="db">
                  <Button type="default" class="mr10" @click="baocun1">
                    <i class="iconfont mr5 iconbaocunicon"></i>保存
                  </Button>
                </div>
                <div class="db">
                  <Button class="mr10" @click="tijiao1">
                    <Icon type="md-checkmark" size="14" />提交
                  </Button>
                </div>
                <div class="db">
                  <Button class="mr10" @click="zuofei1">
                    <Icon type="md-close" size="14" />作废
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <section class="con-box">
            <div class="inner-box">
              <div class="con-split" ref="paneLeft">
                <Split v-model="split1" min="200" @on-moving="getDomHeight">
                  <div
                    slot="left"
                    class="con-split-pane-left"
                    style="overflow-y: auto; height: 100%;"
                  >
                    <div class="pane-made-hd">配件拆分列表</div>
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
                     <Page size="small" :total="Left.page.total" :page-size="Left.page.size" :current="Left.page.num" show-sizer show-total class-name="page-con"
                    @on-change="changePage" @on-page-size-change="changeSize" class="mr10"></Page>
                  </div>
                  <div slot="right" class="con-split-pane-right pl5 goods-list-form">
                    <div class="pane-made-hd">配件拆分信息</div>
                       <div class="clearfix purchase" ref="planForm">
                      <Form inline :show-message="false" ref="formPlan" :label-width="100">
                        <FormItem label="仓库：" prop="supplyName" class="redIT">
                          <Row class="w160">
                            <Col span="24">
                              <Select v-model="Leftcurrentrow.storeId" style="width:100%" :disabled="Leftcurrentrow.status.value !== 0" >
                                <Option
                                  v-for="item in cangkuListall"
                                  :value="item.value"
                                  :key="item.value"
                                >{{item.label}}</Option>
                              </Select>
                            </Col>
                          </Row>
                        </FormItem>
                        <FormItem label="创建日期：" prop="billType" class="redIT">
                          <DatePicker :disabled=" Leftcurrentrow.xinzeng || Leftcurrentrow.status.value !== 0" :value="Leftcurrentrow.createTime" format="yyyy-MM-dd HH:mm:ss" type="date" class="w160"></DatePicker>
                        </FormItem>
                        <FormItem label="操作员：" prop="planDate">
                          <Input class="w160" :disabled="Leftcurrentrow.status.value !== 0" :value="Leftcurrentrow.orderMan"></Input>
                        </FormItem>
                        <FormItem label="备注：" prop="remark">
                          <Input :disabled="Leftcurrentrow.status.value !== 0" :value="Leftcurrentrow.remark" class="w160"></Input>
                        </FormItem>
                        <FormItem label="拆分单号：" prop="planOrderNum">
                          <Input class="w160" :disabled="Leftcurrentrow.status.value !== 0" :value="Leftcurrentrow.serviceId"></Input>
                        </FormItem>
                      </Form>
                    </div>
                    <div class="flex plan-cz-btn" ref="planBtn">
                      <div class="clearfix">
                        <div class="fl mb5">
                          <Button size="small" class="mr10" @click="addProoo">
                            <Icon type="md-add"/>选择成品
                          </Button>
                        </div>
                        <div class="fl mb5">
                          <Button size="small" class="mr10" @click="shanchu">
                            <i class="iconfont mr5 iconlajitongicon"></i> 删除
                          </Button>
                        </div>
                      </div>
                    </div>
                    <vxe-table
                      v-if="showit"
                      border
                      resizable
                      ref="xTable2"
                      size="mini"
                      highlight-current-row
                      highlight-hover-row
                      @current-change="currentChangeEvent"
                      @select-all="selectAllEvent"
                      @select-change="selectChangeEvent"
                      :height="rightTableHeight"
                      :data="Leftcurrentrow.processProductVO"
                      :footer-method="addFooter"
                    >
                      <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                      <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                      <vxe-table-column field="partCode" title="配件编码" width="100"></vxe-table-column>
                      <vxe-table-column field="partName" title="配件名称" width="100"></vxe-table-column>
                      <vxe-table-column field="partBrand" title="品牌" width="100"></vxe-table-column>
                      <vxe-table-column field="unit" title="单位" width="100"></vxe-table-column>
                      <vxe-table-column field="orderQty" :edit-render="{name: 'input', attrs: {type: 'number'}, events: {keyup: keydownEvent}} " title="数量" width="100">
                      </vxe-table-column>
                      <vxe-table-column field="remark" title="备注" width="100"></vxe-table-column>
                      <vxe-table-column field="storeStockQty" title="库存数量" width="100"></vxe-table-column>
                      <vxe-table-column field="outableQty" title="可用数量" width="100"></vxe-table-column>
                      <vxe-table-column field="stockOutQty" title="缺货数量" width="100"></vxe-table-column>
                      <vxe-table-column title="品牌车型">
                        <template v-slot="{row,rowIndex}">
                          <span>{{row.carBrandName}} {{row.carModelName}}</span>
                        </template>
                      </vxe-table-column>
                      <vxe-table-column field="oemCode" title="OE码" width="100"></vxe-table-column>
                      <vxe-table-column field="spec" title="规格" width="100"></vxe-table-column>
                    </vxe-table>

                    <div class="wrapper">
                      <div style="margin: 5px 10px">拆成零件</div>
                        <vxe-table
                        border
                        resizable
                        size="mini"
                        :height="rightTableHeight"
                        :data="currentData"
                        :footer-method="addFooter"
                        :edit-config="{trigger: 'click', mode: 'cell'}"
                      >
                        <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                        <vxe-table-column field="partCode" title="配件编码" width="100"></vxe-table-column>
                        <vxe-table-column field="partName" title="配件名称" width="100"></vxe-table-column>
                        <vxe-table-column field="partBrand" title="品牌" width="100"></vxe-table-column>
                        <vxe-table-column field="unit" title="单位" width="100"></vxe-table-column>
                          <vxe-table-column field="orderQty" title="拆分数量" width="100">
                          <template v-slot="{ row, seq }">
                            <span>{{ row.orderQty * currentNum }}</span>
                          </template>
                        </vxe-table-column>
                        <vxe-table-column field="costRatio" title="成本比例" width="100"></vxe-table-column>
                          <vxe-table-column title="品牌车型">
                            <template v-slot="{row,rowIndex}">
                              <span>{{row.carBrandName}} {{row.carModelName}}</span>
                            </template>
                          </vxe-table-column>
                        <vxe-table-column field="spec" title="规格" width="100"></vxe-table-column>
                      </vxe-table>
                    </div>
                  </div>
                </Split>
              </div>
            </div>
          </section>
          <!--更多弹框-->
          <Modal v-model="advanced" title="高级查询" width="600px">
            <More ref="naform"></More>
            <div slot="footer">
              <Button type="primary" @click="Determined">确定</Button>
              <Button type="default">取消</Button>
            </div>
          </Modal>
        </div>
      </TabPane>
    </Tabs>
      <add-in-com :tbdata="tableData1" @search21="searchPro" @ok="getOkList" @selectAddName="selectAddlierName" ref="addInCom" headerTit="配件成品选择"></add-in-com>
  </main>
  <!-- 配件组装 -->
</template>

<script>
import AddInCom from './compontents/AddInCom'
import More from './compontents/More'
import '../../../lease/product/lease.less'
import moment from 'moment'
import QuickDate from '../../../../components/getDate/dateget'
import {
  tijiao, zuofei, baocun, peijianzuzhuang, zuzhuangxinxi, zuzhuanglingjian, daochu,
  tijiao2, zuofei2, baocun2, peijianchaifen, chaifenxinxi, chaifenlingjian, daoru1, shanqu,
  chengping, cangkulist2
} from '../../../../api/business/process.js'
export default {
  name: 'process',
  components: {
    More,
    QuickDate,
    AddInCom
  },
  data() {
    return {
      showit: true,
      form: {
        status: 99,
        qucikTime: ''
      },
      tabKey: '0',
      modal2: true,
      split1: 0.2,
      tabIndex: 0,
      curronly: false,
      purchaseType: 1, //查询选项
      purchaseTypeArr: [
        {
          label: '所有',
          value: 99
        },
        {
          label: '草稿',
          value: 0
        },
        {
          label: '已提交',
          value: 1
        },

        {
          label: '已作废',
          value: 2
        }
      ],
      advanced: false, //更多模块的弹框
      //左侧表格高度
      leftTableHeight: 0,
      tableData: [
        {
          name: 'a',
          role: 'a',
          sex: 'a',
          num6: '',
          date12: '',
          data: [{
            name: 1
          }, {name: 2}]
        },
        {
          name: 'b',
          role: 'b',
          sex: 'b',
          num6: '',
          date12: ''
        },
        {
          name: 'c',
          role: 'c',
          sex: 'c',
          num6: '',
          date12: ''
        },
        {
          name: 'd',
          role: 'd',
          sex: 'd',
          num6: '',
          date12: ''
        }
      ],
      // 所需零件数据
      components: [],
      //右侧表格高度
      rightTableHeight: 0,
      //左侧的表头内容
      Left: {
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        loading: false,
        columns: [
          {
            title: '序号',
            minWidth: 50,
            key: 'index'
          },
          {
            title: '状态',
            key: 'statuName',
            minWidth: 70
          },
          {
            title: '创建日期',
            key: 'createTime',
            minWidth: 140
          },
          {
            title: '操作员',
            key: 'orderMan',
            minWidth: 120
          },
          {
            title: '配件组装单号',
            key: 'serviceId',
            minWidth: 160
          },
          {
            title: '审核人',
            key: 'auditor',
            minWidth: 120
          },
          {
            title: '审核日期',
            key: 'auditDate',
            minWidth: 200
          }
        ],
        tbdata: [],
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
            title: '序号',
            minWidth: 50,
            key: 'id'
          },
          {
            title: '状态',
            key: 'venderSkuNo',
            minWidth: 70
          },
          {
            title: '调出方',
            key: 'name',
            minWidth: 170
          },
          {
            title: '创建日期',
            key: 'address',
            minWidth: 120
          },
          {
            title: '申请人',
            key: 'isCycle',
            minWidth: 140
          },
          {
            title: '申请单号',
            key: 'disable',
            minWidth: 200
          },
          {
            title: '提交人',
            key: 'remark',
            minWidth: 100
          },
          {
            title: '提交日期',
            align: 'center',
            key: 'qualitySourceName',
            minWidth: 170
          },
          {
            title: '打印次数',
            key: 'categoryName',
            minWidth: 170
          }
        ],
        tbdata: []
      },
      currentrow: {
          id: '1',
          name: '2'
        },
      duoxuanList: [],
      currentData: [],
      Leftcurrentrow: {
        status: {
          value: 0
        },
        storeName: '',
        createTime: '',
        orderMan: '',
        remark: '',
        serviceId: '',
        processProductVO: []
      },
      currentDataP: [],
      cangkuListall: [],
      tableData1: [],
      currentNum: 1
    }
  },
  watch: {
    Leftcurrentrow: {
      handler(newVal) {
        console.log(newVal)
        this.Leftcurrentrow = newVal
      },
      deep: true
    }
  },
  created() {
    if (this.tabKey === '0') {
      // 调接口获取配件组装列表信息
       this.getListzu(this.form)
    } else {
      // 调接口获取配件拆分列表信息
      this.getListchai(this.form)
    }
  },
  methods: {
    keydownEvent({ column }, event) {
      if (parseInt(event.target.value) < 0 ) {
        this.$Message.info('输入数字不能小于0')
        event.target.value = 1
        return
      }
      // if (currentNum)
      this.currentNum =  parseInt(event.target.value)
    },
    selectAllEvent ({ checked }) {
    },
    selectChangeEvent ({ checked, row }) {
        console.log(checked ? '勾选事件' : '取消事件')
    },
    tabChange(key) {
      this.tabKey = key
      console.log(this.tabKey)
      if (this.tabKey === 0) {
        this.getListzu(this.form)
      } else {
        this.getListchai(this.form)
      }

    },
    baocun1() {
      if (!this.Leftcurrentrow.storeId || !this.Leftcurrentrow.orderMan) {
        this.$Message.info('仓库和创建时间为必输项')
        return
      }
      if (!this.Leftcurrentrow.serviceId) {
          if(this.Leftcurrentrow.xinzeng === '1') {
          } else {
            this.$Message.info('请先选择加工单')
             return
          }
      }
      if (this.Leftcurrentrow.status.value !== 0) {
          this.$Message.info('只有草稿状态才能进行保存操作')
          return
      }
      const params = JSON.parse(JSON.stringify(this.Leftcurrentrow))
      params.processProductVO = params.processProductVO.length ? params.processProductVO[0] : {}
      if (this.tabKey === '0') {
        //配件组装保存
        baocun(params).then(res => {
            // 点击列表行==>配件组装信息
                  if (res.code == 0) {
                    this.getListzu(this.form)
                    this.$Message.success('保存成功');
                  }
                }).catch(e => {
                  this.$Message.info('保存配件组装信息失败')
        })
      } else {
        // 配件拆分保存
         baocun2(params).then(res => {
            // 点击列表行==>配件组装信息
                  if (res.code == 0) {
                    this.getListchai(this.form)
                    this.$Message.success('保存成功');
                  }
                }).catch(e => {
                  this.$Message.info('保存配件拆分信息失败')
        })
      }
    },
    xinzeng() {
      if (this.Left.tbdata.length === 0) {
      } else {
        if (this.Left.tbdata[0]['xinzeng'] === '1') {
          this.$Message.info('当前加工单列表已有一个新增单等待操作,请先保存当前操作新增单据')
          return
        }
      }
      const item =  {
        index: 1,
        xinzeng: '1',
        status: {
          enum: "DRAFT",
          name: "草稿",
          value: 0
        },
        statuName: '草稿',
        storeName: '',
        createTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        orderMan: this.$store.state.user.userData.staffName,
        remark: '',
        serviceId: '',
        processProductVO: []
      }
      this.Left.tbdata.unshift(item)
      this.Left.tbdata.map((item,index) => {
        item.index = index + 1
      })
      // this.Left.tbdata[0]['processProductVO'] = []
    },
    tijiao1() {
      if(this.Leftcurrentrow.xinzeng === '1') {
        this.$Message.info('请先保存新增加工单')
          return
      }
      if (!this.Leftcurrentrow.serviceId) {
         this.$Message.info('请先选择加工单')
          return
      }
      if (this.Leftcurrentrow.status.value === 1) {
          this.$Message.info('当前加工单号已提交审核!无需重复操作')
          return
      }
       const params = {
        ...this.Leftcurrentrow
      }
      params.processProductVO = params.processProductVO[0]
      if (this.tabKey === '0') {
        // 配件组装提交
        tijiao(params).then(res => {
            // 点击列表行==>配件组装信息
                  if (res.code == 0) {
                    this.getListzu(this.form)
                    this.$Message.success('提交成功');
                  }
                }).catch(e => {
                  this.$Message.info('提交配件组装信息失败')
        })
      } else {
        // 配件拆分提交
        tijiao2(params).then(res => {
            // 点击列表行==>配件组装信息
                  if (res.code == 0) {
                    this.getListchai(this.form)
                    this.$Message.success('提交成功');
                  }
                }).catch(e => {
                  this.$Message.info('提交配件拆分信息失败')
        })
      }
    },
    zuofei1() {
      if(this.Leftcurrentrow.xinzeng === '1') {
        this.$Message.info('请先保存新增加工单')
          return
      }
      if (!this.Leftcurrentrow.serviceId) {
         this.$Message.info('请先选择加工单')
          return
      }
      if (this.Leftcurrentrow.status.value !== 0) {
          this.$Message.info('只有草稿状态加工单能进行作废操作')
          return
      }
      const id = this.Leftcurrentrow.id
      if (this.tabKey === '0') {
        // 配件组装作废
        zuofei(id).then(res => {
            // 点击列表行==>配件组装信息
                  if (res.code == 0) {
                   this.getListzu(this.form)
                   this.$Message.success('作废成功');
                  }
                }).catch(e => {
                  this.$Message.info('作废配件组装信息失败')
        })
      } else {
        // 配件拆分作废
        zuofei2(id).then(res => {
            // 点击列表行==>配件组装信息
                  if (res.code == 0) {
                    this.getListchai(this.form)
                    this.$Message.success('作废成功');
                  }
                }).catch(e => {
                  this.$Message.info('作废配件拆分信息失败')
        })
      }
    },
    //选择单据
    selectAddlierName(row) {
      this.Left.tbdata = [...row]
      this.Right = row
    },
    // 新增按钮
    addProoo() {
      if (!this.Leftcurrentrow.serviceId) {
        if (this.Leftcurrentrow.xinzeng) {

        } else {
          this.$Message.info('请先选择加工单')
           return
        }
      }
      if (this.Leftcurrentrow.status.value !== 0) {
          this.$Message.info('只有草稿状态加工单能进行作废操作')
          return
      }
      if (this.Leftcurrentrow.processProductVO.length === 1) {
        this.$Message.info('每个加工单只能有一个成品, 如需置换,请删除后添加成品')
        return
      }
      chengping('', '').then(res => {
          // 导入成品, 并把成品覆盖掉当前配件组装信息list
                if (res.code == 0) {
                  this.tableData1 = res.data
                  console.log(this.tableData1)
                  this.$refs.addInCom.init()
                  this.$Message.success('获取成品列表成功');
                }
              }).catch(e => {
              this.$Message.info('获取成品失败')
      })
      // 获取成品列表把data赋值给子组件中
      // this.getListPro()
    },
    searchPro(params) {
      console.log(params, 'huoqucanshu')
       chengping(params.productCode, params.productName).then(res => {
          // 导入成品, 并把成品覆盖掉当前配件组装信息list
                if (res.code == 0) {
                  this.tableData1 = res.data
                }
              }).catch(e => {
              this.$Message.info('获取成品失败')
      })
      // 获取成品列表把data赋值给子组件中
      // this.getListPro()
    },
    // 组装
    currentChangeEvent({ row }) {
      this.currentrow = row
    },
    currentChangeEvent1({ row }) {
      this.currentrow = row
    },
    //获取表格高度
    getDomHeight() {
      this.$nextTick(() => {
        let wrapH = this.$refs.paneLeft.offsetHeight
        let planFormH = this.$refs.planForm.offsetHeight
        let planBtnH = this.$refs.planBtn.offsetHeight
        // let planPageH = this.$refs.planPage.offsetHeight;
        //获取左侧侧表格高度
        this.leftTableHeight = wrapH - 144
        //获取右侧表格高度
        this.rightTableHeight = (wrapH - planFormH - planBtnH - 38) / 2
      })
    },
    //切换tab
    setTab(index) {
      this.tabIndex = index
      if (this.tabIndex == 1) {
        console.log('配件拆分')
      }
    },
    //快速查询日期
    getDataQuick(v) {
      this.form.qucikTime = v
      console.log(v)
    },
    //更多按钮
    more() {
      this.advanced = true
    },
    // 提交
    editPro() {},
    //作废
    cancellation() {},
    // 打印
    stamp() {},
    //左边列表选中当前行
    selectTabelData(row) {
      this.Leftcurrentrow = row
      if (!row.processProductVO) {
        row['processProductVO'] = []
        this.currentData = []
      }
      if (Array.isArray(row.processProductVO)){
        this.Leftcurrentrow.processProductVO = row.processProductVO
      } else {
        this.Leftcurrentrow.processProductVO = [row.processProductVO]
      }
      if (this.Leftcurrentrow.processProductVO.length > 0) {
        this.currentData  = row.processProductVO[0].detailVOList
      } else {
        this.currentData = []
      }

      cangkulist2(this.$store.state.user.userData.groupId).then(res => {
          // 导入成品, 并把成品覆盖掉当前配件组装信息list
                if (res.code == 0) {
                  res.data.map(item => {
                    item['label'] = item.name
                    item['value'] = item.id
                  })
                 this.cangkuListall = res.data
                }
              }).catch(e => {
              this.$Message.info('获取仓库列表失败')
      })
    },
    //分页
    changePage(p) {
      this.Left.page.num = p
      if (this.tabKey === '0') {
        this.getListzu(this.form)
      } else {
        this.getListchai(this.form)
      }
    },
    changeSize(size) {
      this.Left.page.size = size
      if (this.tabKey === '0') {
        this.getListzu(this.form)
      } else {
        this.getListchai(this.form)
      }
    },
    //表格编辑状态下被关闭的事件
    editClosedEvent() {},
    //footer计算
    addFooter() {},
    // 确定
    Determined() {
      const params ={...this.form , ...this.$refs.naform.getITPWE()}
      if ( this.tabKey === '0') {
        this.getListzu(params)
      } else {
        this.getListchai(params)
      }
      this.$refs.naform.reset()
      this.advanced = false
    },
    ok(){},
    cancel() {},
    shanchu() {
      if (this.Leftcurrentrow.status.value !== 0) {
          this.$Message.info('只有草稿状态才能进行删除操作')
          return
        }
      if (this.tabKey === '0') {
        // 组装删除
        const seleList = this.$refs.xTable1.getSelectRecords()
        console.log(seleList)
        const id =  seleList[0].id
        shanqu(id).then(res => {
          // 导入成品, 并把成品覆盖掉当前配件组装信息list
                if (res.code == 0) {
                  this.Leftcurrentrow.processProductVO = this.array_diff(this.Leftcurrentrow.processProductVO, seleList)
                  this.currentData = []
                  this.$Message.success('删除成功');
                }
              }).catch(e => {
              this.$Message.info('删除成品失败')
      })

      } else {
        // 拆分删除
        const seleList = this.$refs.xTable2.getSelectRecords()
        console.log(seleList)
        const id =  seleList[0].id
        shanqu(id).then(res => {
          // 导入成品, 并把成品覆盖掉当前配件组装信息list
                if (res.code == 0) {
                  this.Leftcurrentrow.processProductVO = this.array_diff(this.Leftcurrentrow.processProductVO, seleList)
                  this.currentData = []
                  this.$Message.success('删除成功');
                }
              }).catch(e => {
              this.$Message.info('删除成品失败')
        })
      }
    },
    getOkList(list) {
      console.log(list, '获取的条数')
      console.log(list.detailList)
      list['detailVOList'] = list.detailList
      delete list.detailList
      console.log(list.detailVOList)
      this.showit = false
      if (!this.Leftcurrentrow.processProductVO) {
        this.Leftcurrentrow.processProductVO = [list]
      } else {
         this.Leftcurrentrow.processProductVO.push(list)
      }
      this.currentData = this.Leftcurrentrow.processProductVO[0].detailVOList
      console.log(this.currentData)
      console.log(this.Leftcurrentrow.processProductVO)
      const tata = this
      setTimeout(() => {
        tata.showit = true
      }, 200)
      this.$refs.addInCom.init1()
    },
    getListzu(params) {
      if (params.qucikTime) {
        params.createTime = params.qucikTime[0],
        params.endTime = params.qucikTime[1]
        delete params.qucikTime
      } else {
        delete params.qucikTime
      }
      peijianzuzhuang(params, this.Left.page.size, this.Left.page.num).then(res => {
                 if (res.code == 0) {

                  if (!res.data.content) {
                    this.Left.tbdata = []
                    this.Left.page.total = 0
                  } else {
                    res.data.content.map((item, index) => {
                    item['index'] = index + 1
                    item['statuName'] = item.status.name
                  })
                    this.Left.tbdata = res.data.content || []
                    this.Left.page.total = res.data.totalElements
                  }
                }
              }).catch(e => {
                this.$Message.info('获取配件组装列表失败')
      })
    },
    getListchai(params) {
      if (params.qucikTime) {
        params.createTime = params.qucikTime[0],
        params.endTime = params.qucikTime[1]
      }
      peijianchaifen(params, this.Left.page.size, this.Left.page.num).then(res => {
                if (res.code == 0) {
                  res.data.content.map((item, index) => {
                    item['index'] = index + 1
                    item['statuName'] = item.status.name
                  })
                  this.Left.tbdata = res.data.content || []
                  this.Left.page.total = res.data.totalElements
                }
              }).catch(e => {
                this.$Message.info('获取拆分列表失败')
      })
    },
    getListPro() {
      chengping().then(res => {
                if (res.code == 0) {
                  this.tbdata = res.data || []
                  this.page.total = res.totalElements
                }
              }).catch(e => {
                this.$Message.info('获取成品列表失败')
      })
    },
    array_diff(a, b) {
      for (var i = 0; i < b.length; i++) {
        for (var j = 0; j < a.length; j++) {
          if (a[j].name === b[i].name) {
            a.splice(j, 1)
            j = j - 1
          }
        }
      }
      return a
    }
  },
  mounted() {
    setTimeout(() => {
      this.getDomHeight()
    }, 0)

    window.onresize = () => {
      this.getDomHeight()
    }
  }
}
</script>

<style lang="less" scoped>
.ivu-tabs-bar{
  margin: 0
}
.tabs-ulwarp {
  padding-top: 17px;
  border-bottom: solid 1px #ddd;
}
.tabs {
  list-style: none;
  display: flex;
  height: 100%;

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
<style>
.it-box .ivu-tabs-nav-scroll{
  margin-left: 10px
}
.it-box .ivu-tabs-bar{
  margin-bottom: 0;
}
.it-box .ivu-tabs-content.ivu-tabs-content-animated{
  height: 100%;
}
.redIT .ivu-form-item-label{
  color: red
}
</style>
