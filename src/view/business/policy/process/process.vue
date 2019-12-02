<template>
  <div class="content-oper">
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
            <Button class="mr10"><Icon type="md-add"/> 新增</Button>
          </div>
          <div class="db">
            <Button type="default" class="mr10"><i class="iconfont mr5 iconbaocunicon"></i>保存</Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="editPro"><i class="iconfont mr5 iconziyuan2"></i>提交</Button>
          </div>
          <div class="db">
            <Button @click="cancellation" class="mr10"><Icon type="md-close" size="14" /> 作废</Button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <div class="con-split" ref="paneLeft" >
          <Split v-model="split1" min="200" max="500">
            <div slot="left" class="con-split-pane-left" >
              <div class="pane-made-hd center p10">
                <h5>配件组装列表</h5>
              </div>
              <Table :height="leftTableHeight"  @on-current-change="selectTabelData" size="small" highlight-row  border :stripe="true" :columns="Left.columns" :data="Left.tbdata"></Table>
              <Page simple class-name="fl pt10" size="small" :current="Left.page.num" :total="100" :page-size="Left.page.size" @on-change="changePage"
                    @on-page-size-change="changeSize" show-sizer show-total>
              </Page>
            </div>
            <div slot="right" class="con-split-pane-right pl5 goods-list-form">
              <div class="pane-made-hd center p10">
                <h5>配件组装信息</h5>
              </div>
              <div class="clearfix purchase" ref="planForm">
                <Form inline :show-message="false" ref="formPlan" :label-width="100">
                  <FormItem label="调出方：" prop="supplyName" class="fs12">
                    <Row class="w500">
                      <Col span="22"><Input placeholder="请选择调出方"></Input></Col>
                      <Col span="2"><Button class="ml5" size="small" type="default"><i class="iconfont iconxuanzetichengchengyuanicon"></i></Button></Col>
                    </Row>
                  </FormItem>
                  <FormItem label="调入仓库：" prop="billType">
                    <Select class="w160" >
                      <Option value="beijing">主仓</Option>
                      <Option value="shanghai">嘻嘻</Option>
                      <Option value="shenzhen">哈哈</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="调拨申请日期：" prop="planDate" class="fs12 ml50">
                    <Input class="w160" ></Input>
                  </FormItem>
                  <FormItem label="备注：" prop="remark">
                    <Input class="w500" ></Input>
                  </FormItem>
                  <FormItem label="申请人：" prop="planner" >
                    <Input class="w160" ></Input>
                  </FormItem>
                  <FormItem label="申请单号：" prop="planOrderNum" class="ml50">
                    <Input class="w160" ></Input>
                  </FormItem>
                </Form>
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
                :edit-config="{trigger: 'click', mode: 'cell'}">
                <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                <vxe-table-column field="name" title="配件编码" width="100"></vxe-table-column>
                <vxe-table-column field="role" title="配件名称" width="100"></vxe-table-column>
                <vxe-table-column field="sex" title="品牌" width="100"></vxe-table-column>
                <vxe-table-column field="num6" title="申请数量" width="100"></vxe-table-column>
                <vxe-table-column field="num6" title="备注" :edit-render="{name: 'input'}" width="100"></vxe-table-column>
                <vxe-table-column field="num6" title="品牌车型" width="100"></vxe-table-column>
                <vxe-table-column field="date12" title="单位" width="100"></vxe-table-column>
                <vxe-table-column field="date12" title="OE码" width="100"></vxe-table-column>
                <vxe-table-column field="date12" title="规格" width="100"></vxe-table-column>
                <vxe-table-column field="date12" title="方向" width="100"></vxe-table-column>
                <vxe-table-column field="date12" title="紧销品" width="100" type="checkbox"></vxe-table-column>
                <vxe-table-column field="date12" title="受理数量" width="100"></vxe-table-column>
                <vxe-table-column field="date12" title="取消数量" width="100"></vxe-table-column>
                <vxe-table-column field="date12" title="出库数量" width="100"></vxe-table-column>
                <vxe-table-column field="date12" title="入库数量" width="100"></vxe-table-column>
              </vxe-table>
              <div ref="planPage">
                <Page size="small" class-name="page-con" :current="Right.page.num" :total="Right.page.total" :page-size="Right.page.size" @on-change="changePage"
                      @on-page-size-change="changeSize" show-sizer show-total></Page>
              </div>
            </div>
          </Split>
        </div>
      </div>
    </section>
    <!--更多弹框-->
    <Modal v-model="advanced" title="高级查询" width="600px">
      <More></More>
      <div slot='footer'>
        <Button type='primary' @click="Determined">确定</Button>
        <Button type='default' >取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
    import More from './compontents/More'
    export default {
        name: "process",
        components:{
            More,
        },
        data() {
            return {
                split1:0.2,
                tabIndex:0,
                curronly:false,
                purchaseType: 9999, //查询选项
                purchaseTypeArr:[
                    {label:'所有',value:9999},
                    {label:'本日',value:1},
                    {label:'昨日',value:2},
                    {label:'本周',value:3},
                    {label:'上周',value:4},
                    {label:'本月',value:5},
                    {label:'上月',value:6},
                ],
                advanced: false, //更多模块的弹框
                //左侧表格高度
                leftTableHeight:0,
                tableData:[],
                //右侧表格高度
                rightTableHeight:0,
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
                            key:'id'
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
                            key:'id'
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
                            align:'center',
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
            //切换tab
            setTab(index){
                this.tabIndex=index
                if(this.tabIndex==1){
                    console.log("配件拆分")
                }
            },
            //split 分割
            getDataQuick(v){
                // console.log(v)
            },
            //更多按钮
            more(){
                this.advanced = true
            },
            // 提交
            editPro(){},
            //作废
            cancellation(){},
            // 打印
            stamp(){},
            //左边列表选中当前行
            selectTabelData(){},
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
            //表格编辑状态下被关闭的事件
            editClosedEvent(){},
            //footer计算
            addFooter(){},
        },
        mounted(){
            this.$nextTick(()=>{
                let wrapH = this.$refs.paneLeft.offsetHeight;
                let planFormH = this.$refs.planForm.offsetHeight;
                let planBtnH = this.$refs.planBtn.offsetHeight;
                // let planPageH = this.$refs.planPage.offsetHeight;
                //获取左侧侧表格高度
                this.leftTableHeight = wrapH-70;
                //获取右侧表格高度
                this.rightTableHeight = wrapH-planFormH-planBtnH-65;
            })
        },
    }
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
  .con-box{
    height: 600px;
  }
  .w550{
    width: 580px;
  }
  .mt20 {
    margin-top: 20px;
  }
  .look{
    width: 100px;
    height: 100px;
    position: fixed;
    top:50%;
    left: 50%;
    transform: translate(-50%);
  }
</style>
