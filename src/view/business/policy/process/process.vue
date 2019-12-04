<template>
  <div class="content-oper">
    <!--    头部-->
    <section class="oper-box">
      <!--      主菜单导航-->
      <div class="db pl10 tabs-ulwarp">
        <ul class="tabs">
          <li v-if="!curronly" class="center" :class="{'tab-active': tabIndex == 0}" @click="setTab(0)">配件组装</li>
          <li class="center" :class="{'tab-active': tabIndex == 1}" @click="setTab(1)">配件拆分</li>
        </ul>
      </div>
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>
            <Select v-model="purchaseType" class="w90 mr10">
              <Option v-for="item in purchaseTypeArr" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </div>
          <div class="db">
            <Button type="default" @click="more()" class="mr10"><i class="iconfont mr5 iconchaxunicon"></i>更多</Button>
          </div>
          <div class="db">
            <Button class="mr10">
              <Icon type="md-add"/>
              新增
            </Button>
          </div>
          <div class="db">
            <Button type="default" class="mr10"><i class="iconfont mr5 iconbaocunicon"></i>保存</Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="editPro"><i class="iconfont mr5 iconziyuan2"></i>提交</Button>
          </div>
          <div class="db">
            <Button @click="cancellation" class="mr10">
              <Icon type="md-close" size="14"/>
              作废
            </Button>
          </div>
        </div>
      </div>
    </section>
    <!--    下面-->
    <!--    配件组装-->
    <div v-if="tabIndex==0">
      <section class="con-box">
        <div class="inner-box">
          <div class="con-split hei" ref="paneLeft">
            <Split v-model="split1" min="200" max="500">
              <!--            左边-->
              <div slot="left" class="con-split-pane-left">
                <div class="pane-made-hd center p10">
                  <h5>配件组装列表</h5>
                </div>
                <Table height="670" @on-current-change="selectTabelData" size="small" highlight-row border
                       :stripe="true"
                       :columns="Left.columns" :data="Left.tbdata"></Table>
                <Page :total="0" :page-size="Left.page.size" :current="Left.page.num" show-sizer show-total
                      class-name="page-con"
                      @on-change="changePage" @on-page-size-change="changeSize" class="mr10"></Page>
              </div>
              <!--            右边-->
              <div slot="right" class="con-split-pane-right pl5 goods-list-form bd">
                <!--              右边的上面-->
                <div class="pane-made-hd center p10">
                  <h5>配件组装信息</h5>
                </div>
                <div class="clearfix purchase" ref="planForm">
                  <Form inline :show-message="false" ref="formPlan" :label-width="100">
                    <FormItem label="仓库：">
                      <Select class="w260">
                        <Option value="beijing">主仓</Option>
                        <Option value="shanghai">嘻嘻</Option>
                        <Option value="shenzhen">哈哈</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="创建日期：" class="fs12 ml50">
                      <Input class="w260"></Input>
                    </FormItem>
                    <FormItem label="操作员：">
                      <Input class="w260"></Input>
                    </FormItem>
                    <FormItem label="备注：" class="mt15">
                      <Input class="w260"></Input>
                    </FormItem>
                    <FormItem label="组装单号：" class="mt15 ml50">
                      <Input class="w260"></Input>
                    </FormItem>
                  </Form>
                </div>
                <div class="db mt10 mb10 ml10">
                  <Button class="mr10 w90"><span class="center"><Icon type="md-add"/>选择成品</span></Button>
                  <Button class="mr10 w90"><span class="center"><Icon
                    custom="iconfont iconlajitongicon icons"/>删除</span>
                  </Button>
                </div>
                <vxe-table
                  border
                  resizable
                  show-footer
                  @edit-closed="editClosedEvent"
                  size="mini"
                  height="260"
                  :data="tableData1"
                  :footer-method="addFooter"
                  :edit-config="{trigger: 'click', mode: 'cell'}">
                  <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                  <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                  <vxe-table-column field="name" title="配件编码" width="100"></vxe-table-column>
                  <vxe-table-column field="role" title="配件名称" width="100"></vxe-table-column>
                  <vxe-table-column field="sex" title="品牌" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="单位" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="组装数量" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="备注" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="方向" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="品牌车型" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="OE码" width="120"></vxe-table-column>
                  <vxe-table-column field="date12" title="规格" width="120"></vxe-table-column>
                  <vxe-table-column field="date12" title="方向" width="120"></vxe-table-column>
                </vxe-table>
                <!--              右边的下面表-->
                <div class="pane-made-hd center p10">
                  <h5>所需组装零件</h5>
                </div>
                <vxe-table
                  border
                  resizable
                  show-footer
                  @edit-closed="editClosedEvent"
                  size="mini"
                  height="280"
                  :data="tableData2"
                  :footer-method="addFooter"
                  :edit-config="{trigger: 'click', mode: 'cell'}">
                  <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                  <vxe-table-column field="name" title="配件编码" width="100"></vxe-table-column>
                  <vxe-table-column field="role" title="配件名称" width="100"></vxe-table-column>
                  <vxe-table-column field="sex" title="品牌" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="单位" width="100"></vxe-table-column>
                  <vxe-table-column field="num6" title="需要数量" width="100"></vxe-table-column>
                  <vxe-table-column field="num6" title="库存" width="120"></vxe-table-column>
                  <vxe-table-column field="date12" title="缺货数量" width="120"></vxe-table-column>
                  <vxe-table-column field="date12" title="库存单价" width="120"></vxe-table-column>
                  <vxe-table-column field="date12" title="品牌车型" width="120"></vxe-table-column>
                  <vxe-table-column field="date12" title="规格" width="120"></vxe-table-column>
                  <vxe-table-column field="date12" title="方向" width="120"></vxe-table-column>
                </vxe-table>
              </div>
            </Split>
          </div>
        </div>
      </section>
    </div>
    <!--    配件拆分-->
    <div v-else>
      <section class="con-box">
        <div class="inner-box">
          <div class="con-split hei" ref="paneLeft">
            <Split v-model="split1" min="200" max="500">
              <!--            左边-->
              <div slot="left" class="con-split-pane-left">
                <div class="pane-made-hd center p10">
                  <h5>配件组装列表</h5>
                </div>
                <Table height="670" @on-current-change="selectTabelData" size="small" highlight-row border
                       :stripe="true"
                       :columns="Left.columns" :data="Left.tbdata"></Table>
                <Page :total="0" :page-size="Left.page.size" :current="Left.page.num" show-sizer show-total
                      class-name="page-con"
                      @on-change="changePage" @on-page-size-change="changeSize" class="mr10"></Page>
              </div>
              <!--            右边-->
              <div slot="right" class="con-split-pane-right pl5 goods-list-form bd">
                <!--              右边的上面-->
                <div class="pane-made-hd center p10">
                  <h5>配件组装信息</h5>
                </div>
                <div class="clearfix purchase" ref="planForm">
                  <Form inline :show-message="false" ref="formPlan" :label-width="100">
                    <FormItem label="仓库：">
                      <Select class="w260">
                        <Option value="beijing">主仓</Option>
                        <Option value="shanghai">嘻嘻</Option>
                        <Option value="shenzhen">哈哈</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="创建日期：" class="fs12 ml50">
                      <Input class="w260"></Input>
                    </FormItem>
                    <FormItem label="操作员：">
                      <Input class="w260"></Input>
                    </FormItem>
                    <FormItem label="备注：" class="mt15">
                      <Input class="w260"></Input>
                    </FormItem>
                    <FormItem label="拆分单号：" class="ml50 mt15">
                      <Input class="w260"></Input>
                    </FormItem>
                  </Form>
                </div>
                <div class="db mt10 mb10 ml10">
                  <Button class="mr10 w90"><span class="center"><Icon type="md-add"/>选择成品</span></Button>
                  <Button class="mr10 w90"><span class="center"><Icon
                    custom="iconfont iconlajitongicon icons"/>删除</span>
                  </Button>
                </div>
                <vxe-table
                  border
                  resizable
                  show-footer
                  @edit-closed="editClosedEvent"
                  size="mini"
                  height="260"
                  :data="tableData1"
                  :footer-method="addFooter"
                  :edit-config="{trigger: 'click', mode: 'cell'}">
                  <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                  <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                  <vxe-table-column field="name" title="配件编码" width="100"></vxe-table-column>
                  <vxe-table-column field="role" title="配件名称" width="100"></vxe-table-column>
                  <vxe-table-column field="sex" title="品牌" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="单位" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="组装数量" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="备注" width="120"></vxe-table-column>
                  <vxe-table-column field="date12" title="方向" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="品牌车型" width="120"></vxe-table-column>
                  <vxe-table-column field="date12" title="OE码" width="120"></vxe-table-column>
                  <vxe-table-column field="date12" title="规格" width="120"></vxe-table-column>
                  <vxe-table-column field="date12" title="方向" width="120"></vxe-table-column>
                </vxe-table>
                <!--              右边的下面表-->
                <div class="pane-made-hd center p10">
                  <h5>拆成零件</h5>
                </div>
                <vxe-table
                  border
                  resizable
                  show-footer
                  @edit-closed="editClosedEvent"
                  size="mini"
                  height="280"
                  :data="tableData2"
                  :footer-method="addFooter"
                  :edit-config="{trigger: 'click', mode: 'cell'}">
                  <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                  <vxe-table-column field="name" title="配件编码" width="100"></vxe-table-column>
                  <vxe-table-column field="role" title="配件名称" width="100"></vxe-table-column>
                  <vxe-table-column field="sex" title="品牌" width="100"></vxe-table-column>
                  <vxe-table-column field="date12" title="单位" width="100"></vxe-table-column>
                  <vxe-table-column field="num6" title="需要数量" width="100"></vxe-table-column>
                  <vxe-table-column field="num6" title="库存" width="120"></vxe-table-column>
                  <vxe-table-column field="date12" title="缺货数量" width="120"></vxe-table-column>
                  <vxe-table-column field="date12" title="库存单价" width="120"></vxe-table-column>
                  <vxe-table-column field="date12" title="品牌车型" width="120"></vxe-table-column>
                  <vxe-table-column field="date12" title="规格" width="120"></vxe-table-column>
                  <vxe-table-column field="date12" title="方向" width="120"></vxe-table-column>
                </vxe-table>
              </div>
            </Split>
          </div>
        </div>
      </section>
    </div>

    <!--更多弹框-->
    <Modal v-model="advanced" title="高级查询" width="600px">
      <More></More>
      <div slot='footer'>
        <Button type='primary' @click="Determined">确定</Button>
        <Button type='default'>取消</Button>
      </div>
    </Modal>
    <!--    确认框-->
    <Modal
      v-model="modal1"
      title="提示"
      @on-ok="ok"
      @on-cancel="cancel">
      <p>是否确认提交?</p>
    </Modal>
  </div>
</template>

<script>
    import More from './compontents/More'
    import "../../../goods/goodsList/goodsList.less";
    import './index.less';
    import './lease.less';

    export default {
        name: "process",
        components: {
            More
        },
        data() {
            return {
                modal1: false,        //提交确认框
                split1: 0.2,
                tabIndex: 0,
                curronly: false,
                purchaseType: 9999,    //查询选项
                purchaseTypeArr: [
                    {label: '所有', value: 9999},
                    {label: '本日', value: 1},
                    {label: '昨日', value: 2},
                    {label: '本周', value: 3},
                    {label: '上周', value: 4},
                    {label: '本月', value: 5},
                    {label: '上月', value: 6},
                ],
                advanced: false,       //更多模块的弹框
                leftTableHeight: 0,    //左侧表格高度
                tableData1: [],        // 组装信息表
                tableData2: [],        // 组装零件表
                rightTableHeight: 0,   // 右侧表格高度
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
                            key: 'id'
                        },
                        {
                            title: '状态',
                            key: 'venderSkuNo',
                            minWidth: 70
                        },
                        {
                            title: '创建日期',
                            key: 'address',
                            minWidth: 120
                        },
                        {
                            title: '操作员',
                            key: 'name',
                            minWidth: 170
                        },
                        {
                            title: '配件组装单号',
                            key: 'isCycle',
                            minWidth: 140
                        },
                        {
                            title: '提交人',
                            key: 'salesPrice',
                            minWidth: 120
                        },
                        {
                            title: '提交日期',
                            key: 'disable',
                            minWidth: 200
                        },
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
                    tbdata: [],
                },
            }
        },
        methods: {
            // 切换tab
            setTab(index) {
                this.tabIndex = index
                if (this.tabIndex == 1) {
                }
            },
            // split 分割
            getDataQuick(v) {
            },
            // 更多按钮
            more() {
                this.advanced = true
            },
            // 提交
            editPro() {
                this.modal1 = true
            },
            // 作废
            cancellation() {
            },
            // 打印
            stamp() {
            },
            // 左边列表选中当前行
            selectTabelData() {
            },
            // 分页
            changePage(p) {
                this.page.num = p
                // this.getList()
            },
            changeSize(size) {
                this.page.num = 1
                this.page.size = size
                // this.getList()
            },
            // 表格编辑状态下被关闭的事件
            editClosedEvent() {
            },
            // footer计算
            addFooter() {
            },
            // 切换页面
            selectNum() {
            },
            //切换页数
            selectPage() {
            },
            ok() {
                this.$Message.success('已提交');
            },
            cancel() {
                this.$Message.warning('已取消');
            }
        }
    }
</script>

<style scoped>

  .con-box {
    height: 600px;
  }

  /*.w550 {*/
  /*  width: 580px;*/
  /*}*/

  /*.ivu-split-horizontal {*/
  /*  height: 630px;*/
  /*}*/

  /*.ivu-table-tip {*/
  /*  height: 665px;*/
  /*}*/

  .con-box[data-v-49eda4e0] {
    height: 770px;
  }

  /*.ivu-split-trigger-vertical {*/
  /*  height: 770px;*/
  /*}*/

  .hei {
    height: 740px;
  }

  .con-box[data-v-49eda4e0][data-v-49eda4e0] {
    height: 790px;
  }
  .content-oper{
    height: 100%;
    overflow: hidden;
  }


</style>
