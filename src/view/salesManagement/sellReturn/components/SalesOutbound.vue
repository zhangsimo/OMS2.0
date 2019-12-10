<template>
  <Modal v-model="showInfo" title="选择销售出库单" width="1000">
    <div class="OutboundInfo">
      <div class="header">
        <Form ref="formOne" :model="Outform" inline>
          出库日期：
          <FormItem>
            <DatePicker
              style="width: 200px"
              type="daterange"
              placeholder="请选择日期"
              v-model="Outform.startDate"
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

          <Button type="warning mr15">查询</Button>
          <Button type="warning mr15">选入</Button>
          <Button>取消</Button>
        </Form>
      </div>
      <div class="main clearfix">
        <!-- 销售出库单上 -->
        <vxe-table
          @on-current-change="selectTabelData"
          height='200'
          border
          resizable
          size="small"
          :data="tableDataTop"
          highlight-current-row
          :radio-config="{ labelField: '', trigger: 'row' }"
        >
          <vxe-table-column
            type="index"
            width="60"
            title="序号"
          ></vxe-table-column>
          <vxe-table-column type="radio" width="60" title="选择">
          </vxe-table-column>
          <vxe-table-column
            field="role"
            title="往来单位"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="sex"
            title="销售员"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="出库金额"
            width="80"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="业务单号"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="订单日期"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="出库单号"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="出库日期"
            width="120"
          ></vxe-table-column>
        </vxe-table>
        <!-- 销售出库单下 -->
        <div class="mt5 pr10 h40">订单数量共{{this.page.total}}条</div>
        <vxe-table
          height='140'
          border
          resizable
          size="small"
          :data="tableDataBottom"
          highlight-current-row
          :radio-config="{ labelField: '', trigger: 'row' }"
        >
          <vxe-table-column
            type="index"
            width="60"
            title="序号"
          ></vxe-table-column>
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column
            field="role"
            title="配件编码"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="sex"
            title="配件名称"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="品牌"
            width="80"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="OE码"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="单位"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="出库数量"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="可退数量"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="出库单价"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="出库金额"
            width="120"
          ></vxe-table-column>
          <vxe-table-column
            field="num6"
            title="备注"
            width="120"
          ></vxe-table-column>
        </vxe-table>
        <Page
          :current="page.num"
          :total="page.total"
          :page-size="page.size"
          :page-size-opts="page.placement"
          size="small"
          show-elevator
          show-sizer
          @on-change="selectNum" @on-page-size-change="selectPage"
          class="mt10 fr mr10"
        />
      </div>
    </div>
    <div slot='footer'>
      <Button type='primary'>确定</Button>
      <Button type='default' @click="showInfo=false">取消</Button>
    </div>
  </Modal>
</template>

<script>
  import {getoutList} from "_api/salesManagment/sellReturn.js";
  export default {
    name: 'SalesOutBound',
    data() {
      return {
        showInfo: false, // 销售出库订单信息——表单
        Outform: {
          startDate: "", //开始日期
          endDate: "", //结束日期
          orderId: "", //业务单号
          outOrderId: "", //出库单号
          fittingsCode: "", //配件编码
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
          size: 20,
          total: 0,
          placement:[20,40,60,80,100]
        }
      }

    },
    methods: {
      openModal() {
        this.showInfo = true;
        this.getList()
      },
      //切换页面
      selectNum(val){
        this.page.num = val
        this.getList()
      },
      //切换页数
      selectPage(val){
        this.page.num = 1
        this.page.size = val
        this.getList()
      },
      //上表格选中
      selectTabelData(data){
        this.tableDataBottom = data.row
      },
      //获取销售出库单列表
      getList(){
        getoutList().then(res=>{
          // console.log('我是获取到的列表',res)
          if(res.code==0){
            this.tableDataTop= res.data.content || []
            this.page.total = res.data.totalElements
          }
        })
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
