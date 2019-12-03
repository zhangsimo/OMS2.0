<template>
  <Modal v-model="showInfo" title="选择入库单" width="1000">
    <div class="OutboundInfo">
      <div class="header">
        <Form ref="formOne" :model="Outform" inline>
          出库日期：
          <FormItem>
            <DatePicker
              style="width: 200px"
              type="daterange"
              placeholder="请选择日期"
              v-model="Outform.Date"
            ></DatePicker>
          </FormItem>
          <FormItem>
            <Input
              type="text"
              placeholder="业务单号"
              style="width: 150px"
              v-model="Outform.orderId"
            />
          </FormItem>
          <FormItem>
            <Input
              type="text"
              placeholder="出库单号"
              style="width: 150px"
              v-model="Outform.outOrderId"
            />
          </FormItem>
          <FormItem>
            <Input
              type="text"
              placeholder="配件编码"
              style="width: 120px"
              v-model="Outform.fittingsCode"
            />
          </FormItem>

          <Button type="warning" class="mr15">查询</Button>
          <Button type="warning" class="mr15">选入</Button>
          <Button>取消</Button>
        </Form>
      </div>
      <div class="main clearfix">
        <!-- 入库单上 -->
        <vxe-table
          height='200'
          border
          resizable
          auto-resize
          align="center"
          @select-all="allSelect"
          @select-change="selectList"
          size="mini"
          :data="tableDataTop"
        >
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column
            type="index"
            width="50"
            title="序号"
          ></vxe-table-column>
          <vxe-table-column
            field="role"
            title="入库单号"
          ></vxe-table-column>
          <vxe-table-column
            field="sex"
            title="供应商名称"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="入库金额"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="入库日期"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="业务单号"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="入库类型"
          ></vxe-table-column>

        </vxe-table>
        <!-- 入库单下 -->
        <div class="clearfix">
          <Page :total="page.total" :page-size="page.size" :current="page.num"
                show-sizer show-total class-name="page-con fr mr10 mb10 mt10"
                :page-size-opts="page.placement"
                @on-change="selectNum" @on-page-size-change="selectPage" class="mr10"></Page>
        </div>

        <vxe-table
          height='200'
          border
          resizable
          auto-resize
          align="center"
          size="small"
          highlight-hover-row
          highlight-current-row
          :data="tableDataBottom"
        >
          <vxe-table-column
            type="index"
            width="50"
            title="序号"
          ></vxe-table-column>

          <vxe-table-column
            field="role"
            title="配件编码"
          ></vxe-table-column>
          <vxe-table-column
            field="sex"
            title="配件名称"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="品牌"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="OE码"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="单位"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="入库数量"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="入库单价"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="可售数量"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="配件内码"
            width="120"
          ></vxe-table-column>

        </vxe-table>

      </div>
    </div>
    <div slot='footer'>
      <Button type='primary'>确定</Button>
      <Button type='default' @click="showInfo=false">取消</Button>
    </div>
  </Modal>
</template>

<script>
    export default {
        name:'SalesOutBound',
        data(){
            return {
                showInfo: false, // 销售出库订单信息——表单
                Outform :{
                    Date: "", //开始日期
                orderId: "", //业务单号
                outOrderId: "", //出库单号
                fittingsCode: "", //配件编码
                },
                tableDataTop:[
                    {role:123,sex:456},
                    {role:123,sex:456},
                    {role:123,sex:456},
                ],//上面表格数据
                tableDataBottom:[], //下面表格数据
                SalesOutboundTable:{  // 销售出库单列表
                    loading: false,
                },
                page: {
                    num: 1,
                    size: 20,
                    total: 0,
                    placement:[20,40,60,80,100]
                }
            }

        },
        methods:{
            //打开模态框
            openModal() {
                this.showInfo = true;
            },
            //切换页面
            selectNum(){},
            //切换页数
            selectPage(){},
            //入库单上部选择
            selectList(params){
                // console.log(params.selection)
            },
            //入库单上部全选
            allSelect(params){
                console.log(params.selection)
            }
        }

    }
</script>

<style lang="less" scoped>
  .bgc {
    color: #000;
    background-color: #e8e8e8;
  }
  .h40 {
    line-height: 40px;
    padding-left: 5px;
  }
</style>
