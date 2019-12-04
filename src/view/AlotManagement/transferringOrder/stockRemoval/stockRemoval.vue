<template>
  <div>
    <div class="content-oper content-oper-flex">
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
              <Button type="default" @click="more()" class="mr10">
                <i class="iconfont mr5 iconchaxunicon"></i>更多
              </Button>
            </div>
            <div class="db">
              <Button class="mr10" @click="addProoo">
                <Icon type="md-add" />新增
              </Button>
            </div>
            <div class="db">
              <Button type="default" @click="Save()" class="mr10">
                <i class="iconfont mr5 iconbaocunicon"></i>保存
              </Button>
            </div>
            <div class="db">
              <Button class="mr10" @click="editPro">
                <i class="iconfont mr5 iconziyuan2"></i>提交
              </Button>
            </div>
            <div class="db">
              <Button class="mr10" @click="oution">
                <i class="iconfont mr5 iconziyuan2"></i>出库
              </Button>
            </div>
            <div class="db">
              <Button @click="cancellation" class="mr10">
                <Icon type="md-close" size="14" />作废
              </Button>
            </div>
            <div class="db">
              <Button @click="stamp" class="mr10">
                <i class="iconfont mr5 icondayinicon"></i> 打印
              </Button>
            </div>
            <div class="db">
              <Button @click="stamp" class="mr10">
                <i class="iconfont mr5 icondayinicon"></i> 打印发货申请
              </Button>
            </div>
            <!-- 状态定义 -->
            <div class="status">草稿</div>
          </div>
        </div>
      </section>
      <section class="con-box">
        <div class="inner-box">
          <div class="con-split" ref="paneLeft">
            <Split v-model="split1" min="200" max="500">
              <div slot="left" class="con-split-pane-left">
                <div class="pane-made-hd">调拨申请列表</div>
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
                  simple
                  class-name="fl pt10"
                  size="small"
                  :current="Left.page.num"
                  :total="100"
                  :page-size="Left.page.size"
                  @on-change="changePage"
                  @on-page-size-change="changeSize"
                  show-sizer
                  show-total
                ></Page>
              </div>
              <div slot="right" class="con-split-pane-right pl5 goods-list-form">
                <div class="pane-made-hd">调拨受理信息</div>
                <div class="clearfix purchase" ref="planForm">
                  <!-- 未定义form字段 -->
                  <Form
                    inline
                    :show-message="false"
                    ref="formPlan"
                    :label-width="100"
                    :model="formPlan"
                  >
                    <FormItem label="调入方：" prop="supplyName" class="fs12">
                      <Row class="w500">
                        <Col span="22">
                          <Input placeholder="请选择调入方" v-model="formPlan.item1"></Input>
                        </Col>
                        <Col span="2">
                          <Button class="ml5" size="small" type="default" @click="showModel">
                            <i class="iconfont iconxuanzetichengchengyuanicon"></i>
                          </Button>
                        </Col>
                      </Row>
                    </FormItem>
                    <FormItem label="调出仓库：" prop="billType">
                      <Select class="w160" v-model="formPlan.item2">
                        <Option value="beijing">主仓</Option>
                        <Option value="shanghai">嘻嘻</Option>
                        <Option value="shenzhen">哈哈</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="调拨受理日期：" prop="planDate" class="fs12 ml50">
                      <Date-picker
                        type="date"
                        placeholder="选择日期"
                        v-model="formPlan.item3"
                        class="w160"
                      ></Date-picker>
                    </FormItem>
                    <FormItem label="备注：" prop="remark">
                      <Input class="w500" v-model="formPlan.item4"></Input>
                    </FormItem>
                    <FormItem label="受理人：" prop="planner">
                      <Input class="w160" v-model="formPlan.item5"></Input>
                    </FormItem>
                    <FormItem label="申请单号：" prop="planOrderNum" class="ml50">
                      <Input class="w160" v-model="formPlan.item6"></Input>
                    </FormItem>
                    <!-- prop字段 -->
                    <FormItem label="受理单号：" prop="planNum" class="ml50">
                      <Input class="w160" v-model="formPlan.item7"></Input>
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
                      <Button size="small" class="mr10">
                        <i class="iconfont mr5 iconlajitongicon"></i> 删除配件
                      </Button>
                    </div>
                    <div class="fl mb5">
                      <Button size="small" class="mr10" @click="GoodsInfoModal">
                        <i class="iconfont mr5 iconbianjixiugaiicon"></i> 编辑发货信息
                      </Button>
                    </div>
                  </div>
                </div>
                <vxe-table
                  border
                  resizable
                  show-footer
                  @edit-closed="editClosedEvent"
                  size="mini"
                  :height="rightTableHeight"
                  :data="tableData"
                  :footer-method="addFooter"
                  :edit-config="{trigger: 'click', mode: 'cell'}"
                >
                  <!--type字段  -->
                  <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                  <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                  <vxe-table-column field="name" title="配件编码" width="100"></vxe-table-column>
                  <vxe-table-column field="role" title="配件名称" width="100"></vxe-table-column>
                  <vxe-table-column field="sex" title="品牌" width="100"></vxe-table-column>
                  <vxe-table-column field="num6" title="申请数量" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="受理数量" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="缺货数量" width="100"></vxe-table-column>
                  <vxe-table-column field="num6" title="品牌车型" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="单位" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="OE码" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="规格" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="方向" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="出库数量" width="100"></vxe-table-column>
                </vxe-table>
                <div ref="planPage">
                  <Page
                    size="small"
                    class-name="page-con"
                    :current="Right.page.num"
                    :total="Right.page.total"
                    :page-size="Right.page.size"
                    @on-change="changePage"
                    @on-page-size-change="changeSize"
                    show-sizer
                    show-total
                  ></Page>
                </div>
              </div>
            </Split>
          </div>
        </div>
      </section>
      <!--更多弹框-->
      <Modal v-model="advanced" title="高级查询" width="600px">
        <More></More>
        <div slot="footer">
          <Button type="primary" @click="Determined">确定</Button>
          <Button type="default">取消</Button>
        </div>
      </Modal>
      <!--选择配件-->
      <Select-part-com ref="SelectPartCom" @selectPartName="getPartNameList"></Select-part-com>
      <!--编辑收货信息-->
      <Modal v-model="GainInformation" title="编辑发货信息" width="1200px">
        <goods-info></goods-info>
        <div slot="footer">
          <Button type="primary" @click="Determined">确定</Button>
          <Button type="default">取消</Button>
        </div>
      </Modal>
      <!-- 选择调入方 -->
      <select-supplier
        @selectSearchName="selectSupplierName"
        ref="selectSupplier"
        headerTit="供应商资料"
      ></select-supplier>

      <!-- 出库提示 -->
      <Modal v-model="showOut" title="提示" @on-ok="outOk" @on-cancel="outCancel">
        <p>是否确定出库</p>
      </Modal>
      <!-- 作废提示 -->
      <Modal v-model="showRemove" title="提示" @on-ok="removeOk" @on-cancel="removeCancel">
        <p>是否确定作废</p>
      </Modal>
    </div>
  </div>
</template>

<script>
import QuickDate from '../../../../components/getDate/dateget'
import More from './compontents/More'
import SelectSupplier from './compontents/selectSupplier'
import SelectPartCom from '../../../goods/goodsList/components/selectPartCom'
import GoodsInfo from '../../../../components/goodsInfo/goodsInfo'
import '../../../lease/product/lease.less'
import '../../../goods/goodsList/goodsList.less'
export default {
  name: 'stockRemoval',
  components: {
    QuickDate,
    More,
    SelectPartCom,
    SelectSupplier,
    GoodsInfo
  },
  data() {
    return {
      split1: 0.2,
      purchaseType: 9999,
      purchaseTypeArr: [{ label: '所有', value: 9999 }],
      Left: {
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        loading: false,
        columns: [
          //key要修改
          {
            title: '序号',
            key: 'left1',
            minWidth: 50
          },
          {
            title: '状态',
            key: 'left2',
            minWidth: 70
          },
          {
            title: '调入方',
            key: 'left3',
            minWidth: 170
          },
          {
            title: '创建日期',
            key: 'left4',
            minWidth: 120
          },
          {
            title: '受理人',
            key: 'left5',
            minWidth: 140
          },
          {
            title: '受理单号',
            key: 'left6',
            minWidth: 200
          },
          {
            title: '提交人',
            key: 'left7',
            minWidth: 100
          },
          {
            title: '提交日期',
            align: 'center',
            key: 'left8',
            minWidth: 170
          },
          {
            title: '打印次数',
            key: 'left9',
            minWidth: 170
          }
        ],
        tbdata: [
          {
            left1: 1,
            left2: '草稿',
            left3: '公司名称',
            left4: '2019-10-01',
            left5: '李四',
            left6: 'GT11121223',
            left7: '张三',
            left8: '2019-10-21',
            left9: '10'
          }
        ]
      },
      tableData: [],
      //左侧表格高度
      leftTableHeight: 0,
      //右侧表格高度
      rightTableHeight: 0,
      //单据表头
      formPlan: {
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        item6: '',
        item7: ''
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
      advanced: false, //更多模块的弹框
      GainInformation: false, //编辑收获信息
      showOut: false, //出库提示
      showRemove: false, //作废提示
      isAdd: true, //判断是否能新增
      showBayer: false //出库方弹窗
    }
  },
  methods: {
    //更多按钮
    more() {
      this.advanced = true
    },
    // 新增按钮
    addProoo() {
      if (!this.isAdd) {
        return this.$Message.error('请先保存数据')
      }
      let PTrow = {}
      this.isAdd = false
      this.Left.tbdata.push(PTrow)
      this.tableData.push({})
    },
    //添加配件按钮
    addPro() {
      this.$refs.SelectPartCom.init()
    },
    //保存按钮
    Save() {},
    // 提交
    editPro() {},
    //出库
    oution() {
      this.showOut = true
    },
    //作废
    cancellation() {
      this.showRemove = true
    },
    // 打印
    stamp() {},
    //左边列表选中当前行
    selectTabelData() {},
    //分页
    changePage(p) {
      this.page.num = p
      // this.getList()
    },
    changeSize(size) {
      this.page.num = 1
      this.page.size = size
      // this.getList()
    },
    //split 分割
    getDataQuick(v) {
      // console.log(v)
    },
    //footer计算
    addFooter() {},
    //表格编辑状态下被关闭的事件
    editClosedEvent() {},
    //更多弹框的确定按钮
    Determined() {},
    //子组件的参数
    getPartNameList() {},
    //编辑收货信息弹框显示
    GoodsInfoModal() {
      this.GainInformation = true
    },
    //展示出库方
    showModel() {
      this.$refs.selectSupplier.init()
    },
    //选择出库方
    selectSupplierName(row) {
      this.formPlan.item1 = row.fullName
      this.showBayer = false
    },
    //出库提示
    outOK() {},
    outCancel() {},
    //入库提示
    removeOk() {},
    removeCancel() {}
  },
  mounted() {
    this.$nextTick(() => {
      let wrapH = this.$refs.paneLeft.offsetHeight
      let planFormH = this.$refs.planForm.offsetHeight
      let planBtnH = this.$refs.planBtn.offsetHeight
      // let planPageH = this.$refs.planPage.offsetHeight;
      //获取左侧侧表格高度
      this.leftTableHeight = wrapH - 70
      //获取右侧表格高度
      this.rightTableHeight = wrapH - planFormH - planBtnH - 65
    })
  }
}
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
