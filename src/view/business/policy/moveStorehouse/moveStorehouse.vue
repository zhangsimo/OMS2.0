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
                <Option v-for="item in purchaseTypeArr" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </div>
            <div class="db">
              <Button type="default" @click="more()" class="mr10"><i class="iconfont mr5 iconchaxunicon"></i>更多</Button>
            </div>
            <div class="db">
              <Button class="mr10" @click="addPro"><Icon type="md-add"/> 新增</Button>
            </div>
            <div class="db">
              <Button type="default" @click='Save()' class="mr10"><i class="iconfont mr5 iconbaocunicon"></i>保存</Button>
            </div>
            <div class="db">
              <Button class="mr10" @click="editPro"><i class="iconfont mr5 iconziyuan2"></i>提交</Button>
            </div>
            <div class="db">
              <Button class="mr10" @click="check"><i class="iconfont mr5 iconziyuan2"></i>审核</Button>
            </div>
            <div class="db">
              <Button @click="cancellation" class="mr10"><Icon type="md-close" size="14" /> 作废</Button>
            </div>
            <div class="db">
              <Button @click="stamp" class="mr10"><i class="iconfont mr5 icondayinicon"></i> 打印</Button>
            </div>
          </div>
        </div>
      </section>
      <section class="con-box">
        <div class="inner-box">
          <div class="con-split" ref="paneLeft" >
            <Split v-model="split1" min="200" max="500">
              <div slot="left" class="con-split-pane-left" >
                <div class="pane-made-hd center">
                  移仓列表
                </div>
                <Table :height="leftTableHeight"  @on-current-change="selectTabelData" size="small" highlight-row  border :stripe="true" :columns="Left.columns" :data="Left.tbdata"></Table>
                <Page simple class-name="fl pt10" size="small" :current="Left.page.num" :total="100" :page-size="Left.page.size" @on-change="changePage"
                      @on-page-size-change="changeSize" show-sizer show-total>
                </Page>
              </div>
              <div slot="right" class="con-split-pane-right pl5 goods-list-form">
                <div class="pane-made-hd center">
                  移仓信息
                </div>
                <div class="clearfix purchase" ref="planForm">
                  <Form inline :show-message="false" ref="formPlan" :label-width="100">
                    <FormItem label="移出仓库：">
                      <Select class="w120" >
                        <Option value="beijing">半成品</Option>
                        <Option value="shanghai">嘻嘻</Option>
                        <Option value="shenzhen">哈哈</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="移入仓库：">
                      <Select class="w120" >
                        <Option value="beijing">主仓</Option>
                        <Option value="shanghai">嘻嘻</Option>
                        <Option value="shenzhen">哈哈</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="业务员：" class="fs12 ml20">
                      <Input class="w120" >吴力</Input>
                    </FormItem>
                    <FormItem label="移仓日期：" class="fs12 ml20">
                      <DatePicker type="date" @on-change="submit" style="width: 140px"></DatePicker>
                    </FormItem>

                    <FormItem label="移仓单号：" class="ml20">
                      <Input class="w120" ></Input>
                    </FormItem>
                  </Form>
                </div>
                <div class="flex plan-cz-btn" ref="planBtn">
                  <div class="clearfix">
                    <div class="fl mb5">
                      <Button size="small" class="mr10" @click="addParts"><Icon type="md-add"/> 添加配件</Button>
                    </div>
                    <div class="fl mb5">
                      <Button size="small" class="mr10"><i class="iconfont mr5 iconlajitongicon"></i> 删除</Button>
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
                  :edit-config="{trigger: 'click', mode: 'cell'}">
                  <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                  <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                  <vxe-table-column field="name" title="配件编码" width="120"></vxe-table-column>
                  <vxe-table-column field="role" title="配件名称" width="120"></vxe-table-column>
                  <vxe-table-column field="sex" title="品牌" width="120"></vxe-table-column>
                  <vxe-table-column field="num6" title="数量" width="120"></vxe-table-column>
<!--                  <vxe-table-column field="num6" title="备注" :edit-render="{name: 'input'}" width="100"></vxe-table-column>-->
                  <vxe-table-column field="num6" title="缺货数量" width="120"></vxe-table-column>
                  <vxe-table-column field="date12" title="品牌车型" width="120"></vxe-table-column>
                  <vxe-table-column field="date12" title="单位" width="120"></vxe-table-column>
                  <vxe-table-column field="date12" title="OE码" width="120"></vxe-table-column>
                  <vxe-table-column field="date12" title="规格" width="120"></vxe-table-column>
                  <vxe-table-column field="date12" title="方向" width="120"></vxe-table-column>
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
      <!--    提交确认框-->
      <Modal
        v-model="modal1"
        title="提示"
        @on-ok="ok"
        @on-cancel="cancel">
        <p>是否确认提交?</p>
      </Modal>
      <!--配件选择弹框-->
      <Modal v-model="modal2" title="配件选择" :footer-hide="true" width="1020">
        <Dia-log @getMsg="getMsg2"></Dia-log>
      </Modal>
      <!--      添加配件-->
<!--      <select-part-com ref="selectPartCom" @selectPartName="getPartNameList" ></select-part-com>-->
    </div>

  </div>
</template>

<script>
    import QuickDate from '../../../../components/getDate/dateget'
    import DiaLog from '../../../../components/Accessories/dialog';
    import More from '../process/compontents/More'
    import './index.less';
    export default {
        name: "moveStorehouse",
        components: {
            QuickDate,
            More,
            DiaLog
        },
        data() {
            return {
                modal1:false, //提交确认框
                modal2:false, //配件选择框
                split1:0.2,
                purchaseType: 9999,
                purchaseTypeArr:[
                    {label:'所有',value:9999}
                ],
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
                            key: 'aaa',
                            minWidth: 70
                        },
                        {
                            title: '移仓日期',
                            key: 'aaa',
                            minWidth: 120
                        },
                        {
                            title: '业务员',
                            key: 'aaa',
                            minWidth: 140
                        },
                        {
                            title: '移仓单号',
                            key: 'aaa',
                            minWidth: 120
                        },
                        {
                            title: '打印次数',
                            key: 'aaa',
                            minWidth: 200
                        },
                        {
                            title: '创建人',
                            key: 'aaa',
                            minWidth: 100
                        },
                        {
                            title: '创建日期',
                            align:'center',
                            key: 'aaa',
                            minWidth: 170
                        },
                        {
                            title: '提交人',
                            key: 'aaa',
                            minWidth: 170
                        },
                        {
                            title: '提交日期',
                            key: 'aaa',
                            minWidth: 170
                        },
                        {
                            title: '审核人',
                            key: 'aaa',
                            minWidth: 170
                        },
                        {
                            title: '审核日期',
                            key: 'aaa',
                            minWidth: 170
                        },
                    ],
                    tbdata: []
                },
                tableData:[],
                //左侧表格高度
                leftTableHeight:0,
                //右侧表格高度
                rightTableHeight:0,
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
                advanced: false, //更多模块的弹框
                GainInformation: false //编辑收获信息
            }
        },
        methods: {
            //更多按钮
            more(){
                this.advanced = true
            },
            //保存按钮
            Save(){
                this.$message.success('已保存')
            },
            // 提交
            editPro(){
                this.modal1 = true
            },
            //作废
            cancellation(){},
            // 打印
            stamp(){},
            //审核
            check(){},
            //新增
            addPro(){
                // this.$refs.selectPartCom.init()
            },
            // 添加配件
            addParts(){
                this.modal2=true
            },
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
            //split 分割
            getDataQuick(v){
                // console.log(v)
            },
            //footer计算
            addFooter(){},
            //表格编辑状态下被关闭的事件
            editClosedEvent(){},
            //更多弹框的确定按钮
            Determined(){},
            //子组件的参数
            getPartNameList(){},
            //编辑收货信息弹框显示
            GoodsInfoModal(){
                this.GainInformation = true
            },
            //移仓日期
            submit(date){
                console.log(date)
            },
            //获取子组件数据
            getMsg2(){},
            ok() {
                this.$Message.success('已提交');
            },
            cancel() {
                this.$Message.warning('已取消');
            },
            //配件返回的参数
            getPartNameList(){
            },

        },
        mounted(){
            this.$nextTick(()=>{
                let wrapH = this.$refs.paneLeft.offsetHeight;
                let planFormH = this.$refs.planForm.offsetHeight;
                let planBtnH = this.$refs.planBtn.offsetHeight;
                let planPageH = this.$refs.planPage.offsetHeight;
                //获取左侧侧表格高度
                this.leftTableHeight = wrapH-70;
                //获取右侧表格高度
                this.rightTableHeight = wrapH-planFormH-planBtnH-65;
            })
        }
    }
</script>

<style scoped>
  .con-box{
    height: 600px;
  }
  .w550{
    width: 580px;
  }
</style>
