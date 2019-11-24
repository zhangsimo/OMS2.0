<template>
  <div class="content-oper content-oper-flex">
    <!-- 头部 -->
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询:</span>
            <quick-date class="mr10"></quick-date>
            <Select v-model="purchaseType" class="w90 mr10">
              <Option
                v-for="item in purchaseTypeArr"
                :value="item.value"
                :key="item.value"
              >{{item.label}}</Option>
            </Select>
          </div>
          <div class="db">
            <Button type="default" @click="search" class="mr10">
              <i class="iconfont mr5 iconchaxunicon"></i>更多
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="addPro">
              <Icon type="md-add" />新增
            </Button>
          </div>
          <div class="db">
            <Button type="default" class="mr10">
              <i class="iconfont mr5 iconbaocunicon"></i>保存
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="editPro">
              <i class="iconfont mr5 iconziyuan2"></i>提交
            </Button>
          </div>
          <div class="db">
            <Button @click="linkProMadel" class="mr10">
              <i class="iconfont mr5 icondayinicon"></i> 打印
            </Button>
          </div>
          <div class="db">
            <Button @click="linkProMadel" class="mr10">
              <Icon type="md-close" size="14" />作废
            </Button>
          </div>

          <div class="db">
            <Button @click="linkProMadel" class="mr10">
              <i class="iconfont mr5 iconshenheicon"></i> 查看审批
            </Button>
          </div>
          <div class="db">
            <Button @click="showCost" class="mr10">费用登记</Button>
          </div>
        </div>
      </div>
    </section>
    <!-- main -->
    <section class="con-box">
      <div class="inner-box">
        <div class="con-split" ref="paneLeft">
          <Split v-model="split1" min="200" max="500">
            <!--main split 左 -->
            <div slot="left" class="con-split-pane-left" style="height: 100%;">
              <div class="pane-made-hd">采购订单列表</div>
              <Table
                :height="leftTableHeight"
                size="small"
                highlight-row
                border
                :stripe="true"
                :columns="columns"
              ></Table>
              <Page
                simple
                size="small"
                :current="page.num"
                :total="100"
                :page-size="page.size"
                @on-change="changePage"
                show-sizer
                show-total
              ></Page>
            </div>
            <!--main split 右 -->
            <div
              slot="right"
              class="con-split-pane-right pl5 goods-list-form"
              style="height: 100%;"
            >
              <div class="pane-made-hd">本年采购总金额:</div>
              <div class="clearfix purchase" ref="planForm">
                <Form
                  inline
                  :show-message="false"
                  ref="formPlan"
                  :model="formPlan"
                  :rules="rulePlan"
                  :label-width="100"
                >
                  <FormItem label="供应商：" prop="supplyName">
                    <Row class="w160">
                      <Col span="19">
                        <Input placeholder="请选择供应商"></Input>
                      </Col>
                      <Col span="5">
                        <Button @click="linkProMadel" class="ml5" size="small" type="default">
                          <i class="iconfont iconxuanzetichengchengyuanicon"></i>
                        </Button>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem label="采购员">
                    <Input class="w160"></Input>
                  </FormItem>
                  <FormItem label="票据类型：">
                    <Select class="w160">
                      <Option value="beijing">New York</Option>
                      <Option value="shanghai">London</Option>
                      <Option value="shenzhen">Sydney</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="结算方式：">
                    <Select class="w160">
                      <Option value="beijing">New York</Option>
                      <Option value="shanghai">London</Option>
                      <Option value="shenzhen">Sydney</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="入库仓：">
                    <Select class="w160">
                      <Option value="beijing">New York</Option>
                      <Option value="shanghai">London</Option>
                      <Option value="shenzhen">Sydney</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="备注：">
                    <Input class="w160"></Input>
                  </FormItem>
                  <FormItem label="预付款：">
                    <Input class="w160"></Input>
                  </FormItem>
                  <FormItem label="订单号：">
                    <Input class="w160"></Input>
                  </FormItem>
                </Form>
                <!-- split 右下 -->
                <div class="flex plan-cz-btn" ref="planBtn">
                  <div class="clearfix">
                    <div class="fl mb5">
                      <Button size="small" class="mr10" @click="addPro">
                        <Icon type="md-add" />添加配件
                      </Button>
                    </div>
                    <div class="fl mb5">
                      <Button size="small" class="mr10" @click="addPro">
                        <Icon type="ios-trash" />删除配件
                      </Button>
                    </div>
                    <div class="fl mb5">
                      <Button size="small" class="mr10" @click="addPro">导入配件</Button>
                    </div>
                    <div class="fl mb5">
                      <Button size="small" class="mr10" @click="addPro">订单调整</Button>
                    </div>
                    <div class="fl mb5">
                      <Button size="small" class="mr10" @click="showGoods">收货信息</Button>
                    </div>
                    <div class="fl mb5">
                      <Button size="small" class="mr10" @click="sumMod = true">采购金额填写</Button>
                    </div>
                  </div>
                  <div class="t-price">采购计划金额：120000.00</div>
                </div>
                <!-- split 右下表格 -->
                <vxe-table
                  border
                  resizable
                  @edit-closed="editClosedEvent"
                  size="mini"
                  :height="rightTableHeight"
                  :data="tableData"
                  :edit-config="{trigger: 'dblclick', mode: 'cell'}"
                >
                  <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                  <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                  <vxe-table-column field="name" title="操作" width="100"></vxe-table-column>
                  <vxe-table-column field="role" title="配件编码" width="100"></vxe-table-column>
                  <vxe-table-column field="sex" title="配件名称" width="100"></vxe-table-column>
                  <vxe-table-column field="num6" title="品牌" width="100"></vxe-table-column>
                  <vxe-table-column
                    field="sss"
                    title="采购数量"
                    :edit-render="{name: 'input'}"
                    width="100"
                  >
                    <template v-slot:edit="{ row }">
                      <InputNumber :max="9999" :min="0" v-model="row.sss"></InputNumber>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column
                    field="ddd"
                    title="采购单价"
                    :edit-render="{name: 'input'}"
                    width="100"
                  >
                    <template v-slot:edit="{ row }">
                      <InputNumber :max="9999" :min="0" v-model="row.ddd"></InputNumber>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column title="采购金额" width="100">
                    <template v-slot="{ row }">
                      <span>{{ parseFloat(row.sss*row.ddd).toFixed(2) }} 元</span>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column
                    field="num6"
                    title="备注"
                    :edit-render="{name: 'input'}"
                    width="100"
                  ></vxe-table-column>
                  <vxe-table-column field="id" title="不含税单价" width="120"></vxe-table-column>
                  <vxe-table-column field="num6" title="不含税金额" width="120"></vxe-table-column>
                  <vxe-table-column field="num6" title="品牌车型" width="100"></vxe-table-column>
                  <vxe-table-column field="num6" title="单位" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="OE码" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="规格" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="方向" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="订单取消数量" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="验收数量" width="100"></vxe-table-column>
                </vxe-table>
              </div>
            </div>
          </Split>
        </div>
      </div>
    </section>
    <!-- 更多 对话框 -->
    <Modal title="高级查询" v-model="serchN" :styles="{top: '50px', width: '500px'}">
      <div class="data ml30 pl25">
        <Row class="mb30">
          <span>订货日期:</span>
          <DatePicker type="daterange" placement="bottom-end" style="width: 300px"></DatePicker>
        </Row>
        <Row class="mb30">
          <span>创建日期:</span>
          <DatePicker type="daterange" placement="bottom-end" style="width: 300px"></DatePicker>
        </Row>
        <Row class="mb30">
          <span>提交日期:</span>
          <DatePicker type="daterange" placement="bottom-end" style="width: 300px"></DatePicker>
        </Row>
      </div>
      <Form
        ref="formInline"
        :model="formInline"
        :rules="ruleInline"
        :label-width="80"
        class="ml10 pl25"
      >
        <FormItem prop="user" label="供 应 商: ">
          <Input type="text" placeholder="请选择供应商..." class="w300 ml5"></Input>
        </FormItem>
        <FormItem prop="password" label="订单单号: ">
          <Input type="text" class="w300 ml5" size="large"></Input>
        </FormItem>
        <FormItem prop="password" label="配件编码: ">
          <Input type="text" class="w300 ml5" size="large"></Input>
        </FormItem>
        <FormItem label="品牌: ">
          <Input type="password" class="w300 ml5"></Input>
        </FormItem>
        <FormItem label="提交人: ">
          <Input type="password" class="w300 ml5"></Input>
        </FormItem>
        <FormItem label="创建人: ">
          <Input type="password" class="w300 ml5"></Input>
          <Radio v-model="single">Radio</Radio>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button class="mr15" type="primary">确定</Button>
        <Button>取消</Button>
      </div>
    </Modal>
    <!-- 采购金额 对话框 -->
    <Modal title="采购金额填写" v-model="sumMod" :styles="{top: '50px', width: '500px'}">
      <Form
        ref="formInline"
        :model="formInline"
        :rules="ruleInline"
        :label-width="100"
        class="ml10 pl25"
      >
        <FormItem prop="user" label="合计采购金额: ">
          <Input type="text" class="w300 ml5"></Input>
        </FormItem>
        <FormItem label="折扣金额: ">
          <Input type="password" placeholder="请输入" class="w300 ml5"></Input>
        </FormItem>
        <FormItem label="返利金额: ">
          <Input type="password" placeholder="请输入" class="w300 ml5"></Input>
        </FormItem>
        <FormItem label="实际应付金额: ">
          <Input type="password" class="w300 ml5"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary">保存</Button>
        <Button type="default">取消</Button>
      </div>
    </Modal>
    <!-- 收货信息 对话框 -->
    <Modal v-model="isShow" title="收货信息" width="1000">
      <goods-info></goods-info>
      <div slot="footer"></div>
    </Modal>
    <!-- 费用登记 对话框 -->
    <Modal v-model="isCost" title="费用登记" width="1000">
      <div class="costBox clearfix con-split">
        <div class="fl">
          <div class="leftT">
            <Select v-model="model2" size="small" style="width:100px" class="mr15">
              <Option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
            <Input
              v-model="value"
              placeholder="Enter something..."
              style="width: 250px"
              size="small"
              class="mr15"
            />
            <Button type="primary" size="small">查询</Button>
          </div>
          <div class="pane-made-hd mt15">往来单位列表</div>
          <div class="w420">
            <vxe-table
              border
              resizable
              :data="tableData">
              <vxe-table-column type="index" width="80" title="序号"></vxe-table-column>
              <vxe-table-column field="name" title="操作" width="80"></vxe-table-column>
              <vxe-table-column field="sex" title="往来单位" width="130"></vxe-table-column>
              <vxe-table-column field="age" title="编码" width="130"></vxe-table-column>
            </vxe-table>
          </div>
        </div>
        <div class="fr w480 h600">
          <div class="right">
            <Button type="primary" size="small" class="mr10">保存</Button>
            <Button size="small">取消</Button>
          </div>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import "../../lease/product/lease.less";
import QuickDate from "_c/getDate/dateget";
import goodsInfo from "../../../components/goodsInfo/goodsInfo";
export default {
  name: "categoryList",
  components: { QuickDate, goodsInfo },
  data() {
    return {
      //Cost 对话框
      isCost: false,
      //serch对话框
      sumMod: false,
      serchN: false,
      // 右侧表单数据双向绑定
      formPlan: {
        supplyName: "", //供应商
        buyer: "", //采购员
        PaperType: "", //票据类型
        closeType: "", //结算方式
        enterStorage: "", //入库仓
        remarks: "", //备注
        beforePay: "", //预付款
        orderNum: "" //订单号
      },
      split1: 0.2,
      columns: [
        {
          title: "序号",
          minWidth: 50,
          key: "id",
          align: "center"
        },
        {
          title: "状态",
          key: "venderSkuNo",
          minWidth: 70,
          align: "center"
        },
        {
          title: "供应商",
          key: "name",
          minWidth: 170,
          align: "center"
        },
        {
          title: "采购员",
          key: "address",
          minWidth: 120,
          align: "center"
        },
        {
          title: "订单单号",
          key: "isCycle",
          minWidth: 140,
          align: "center"
        },
        {
          title: "创建人",
          key: "salesPrice",
          minWidth: 120,
          align: "center"
        },
        {
          title: "创建日期",
          key: "disable",
          minWidth: 200,
          align: "center"
        },
        {
          title: "打印次数",
          key: "remark",
          minWidth: 100,
          align: "center"
        },
        {
          title: "提交人",
          align: "center",
          key: "qualitySourceName",
          minWidth: 170,
          align: "center"
        },
        {
          title: "提交日期",
          key: "categoryName",
          minWidth: 170,
          align: "center"
        }
      ],
      tableData: [
        { id: "1", sss: "33", ddd: "33" },
        { id: "1", sss: "22", ddd: "33" }
      ],
      page: {
        num: 1,
        size: 10,
        total: 0
      },
      purchaseType: 0,
      purchaseTypeArr: [
        {
          label: "所有",
          value: 0
        },
        {
          label: "草稿",
          value: 1
        },
        {
          label: "审批中",
          value: 2
        },
        {
          label: "已审批",
          value: 3
        },
        {
          label: "已完成",
          value: 4
        },
        {
          label: "不通过",
          value: 5
        },
        {
          label: "已作废",
          value: 6
        }
      ],
      //左侧表格高度
      leftTableHeight: 0,
      //右侧表格高度
      rightTableHeight: 0,
      isShow: false,
      //下拉框数据
      cityList: [
        {
          value: "New York",
          label: "New York"
        },
        {
          value: "London",
          label: "London"
        },
        {
          value: "Sydney",
          label: "Sydney"
        },
        {
          value: "Ottawa",
          label: "Ottawa"
        },
        {
          value: "Paris",
          label: "Paris"
        },
        {
          value: "Canberra",
          label: "Canberra"
        }
      ]
    };
  },
  activated() {},
  mounted() {
    this.$nextTick(() => {
      let wrapH = this.$refs.paneLeft.offsetHeight;
      let planFormH = this.$refs.planForm.offsetHeight;
      let planBtnH = this.$refs.planBtn.offsetHeight;
      // let planPageH = this.$refs.planPage.offsetHeight;
      //获取左侧侧表格高度
      this.leftTableHeight = wrapH - 70;
      //获取右侧表格高度
      this.rightTableHeight = wrapH - planFormH - planBtnH + 80;
    });
  },
  methods: {
    //展示费用登记
    showCost() {
      this.isCost = true;
    },
    search() {
      this.serchN = true;
    },
    showGoods() {
      this.isShow = true;
    }
  },
  computed: {}
};
</script>

<style lang="less" scoped>
.ivu-btn .ivu-btn-text {
  border: 1px solid #ccc;
}
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal {
    top: 0;
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
</style>
