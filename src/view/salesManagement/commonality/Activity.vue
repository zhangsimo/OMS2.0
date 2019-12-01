<template>
  <Modal v-model="showInfo" title="选择入库单" width="1300">
    <div class="OutboundInfo">
      <div class="header">
        <Form ref="formOne" :model="Outform" inline>
          <span>编码/名称/拼音：</span>
          <FormItem>
            <Input
              type="text"
              placeholder="配件编码/名称/拼音"
              style="width: 120px"
              v-model="Outform.fittingsCode"
            />
          </FormItem>
          <span>内码:</span>
          <FormItem>
            <Input
              type="text"
              placeholder="内码"
              style="width: 120px"
              v-model="Outform.fittingsCode"
            />
          </FormItem>
          <Button class="mr10" type='warning'><Icon type="ios-search" size="14" /> 查询</Button>
          <Button class="mr10" type='default'><Icon type="md-checkmark" /> 确定</Button>

        </Form>
      </div>
      <div class="main clearfix">
        <vxe-table
          height='200'
          border
          resizable
          auto-resize
          align="center"
          size="mini"
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
            title="活动名称"
          ></vxe-table-column>
          <vxe-table-column
            field="sex"
            title="配件内码"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="配件编码"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="配件名称"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="品牌"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="活动"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="活动单价"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="是否赠送"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="OEM编码"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="车型"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="活动ID"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="备注"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="开始日期"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="结束日期"
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
                tableDataBottom:[], //下面表格数据
            }

        },
        methods: {
            //打开模态框
            openModal() {
                this.showInfo = true;
            },

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
