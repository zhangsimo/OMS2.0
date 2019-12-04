<template>
  <Modal v-model="showNew" title="新增采购订单" width="600">
    <div class="newOrderInfo">
      <div class="header">
        <Form ref="formOne" :model="Orderform" :label-width="80">
          <div class="db ml20 mb10">
            <Button type="warning" class="mr10"
            ><i class="iconfont mr5 iconbaocunicon"></i>保存
            </Button
            >
            <Button class="mr10"
            >
              <Icon type="md-close" size="14"/>
              取消
            </Button
            >
          </div>
          <Row>
            <FormItem label="往来单位:">
              <Col span="19">
                <Input
                  type="text"
                  placeholder="请选择往来单位"

                  v-model="Orderform.name"
                />
              </Col>
              <Col>
                <Col span="5"
                >
                  <Button

                    class="ml5"
                    size="small"
                    type="default"
                  ><i
                    class="iconfont iconxuanzetichengchengyuanicon"
                  ></i></Button
                  >
                </Col>
              </Col>
            </FormItem>
          </Row>
          <Row>
            <Col span="12">
              <FormItem
                label="票据类型:">
                <Select v-model="Orderform.pjtype"
                        placeholder="请选择票据类型">
                  <Option v-for="item in  pjTypeList" :value="item.value" :key="item.value">{{ item.label }}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="结算方式:">
                <Select v-model="Orderform.jstype"
                        placeholder="请选择结算方式">
                  <Option v-for="item in jsTypeList" :value="item.value" :key="item.value">{{ item.label }}
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="备注:">
            <Input
              type="text"
              placeholder="备注"

              v-model="Orderform.mark"
            />
          </FormItem>
        </Form>
      </div>
      <div class="main clearfix mt20">
        <!-- 销售出库单上 -->
        <vxe-table
          border
          resizable
          size="mini"
          :data="tableDataTop"
          highlight-current-row
        >
          <vxe-table-column
            type="index"
            title="序号"
            width="60"
          ></vxe-table-column>
          <vxe-table-column
            field="role"
            title="配件编码"
            width="150"
          ></vxe-table-column>
          <vxe-table-column
            field="sex"
            title="配件名称"
            width="150"
          ></vxe-table-column>
          <vxe-table-column
            field="sex"
            title="品牌"
            width="100"
          ></vxe-table-column>
          <vxe-table-column
            field="sex"
            title="单位"
            width="60"
          ></vxe-table-column>
          <vxe-table-column
            field="sex"
            title="配件内码"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="采购数量"
            width="80"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="采购单价"
            width="80"
          ></vxe-table-column>
        </vxe-table>
      </div>
    </div>
    <div slot='footer'>
      <Button type='primary'>确定</Button>
      <Button type='default' @click="showNew=false">取消</Button>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'NewOrder',
    data() {
      return {

        pjTypeList: [ //票据类型
          {
            value: '汇票',
            label: '汇票'
          },
          {
            value: '承兑',
            label: '承兑'
          },
        ],
        jsTypeList: [ //结算方式
          {
            value: '月结',
            label: '月结'
          },
          {
            value: '现结',
            label: '现结'
          },
        ],
        showNew: false, // 新增采购订单信息——表单
        Orderform: {
          name: '',//往来单位
          mark: '', //备注
          pjtype: '',//票据类型
          jstype: '',//结算方式
        },
        tableDataTop: [
          {index: 1, role: 123, sex: 456}
        ],//上面表格数据
        tableDataBottom: [], //下面表格数据
        SalesOutboundTable: {  // 销售出库单列表
          loading: false,
        },
        page: {
          num: 1,
          size: 10,
          total: 0
        }
      }

    },
    methods: {
      openModal() {
        this.showNew = true;
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
