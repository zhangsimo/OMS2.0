<template>
  <Modal v-model="showInfo" title="选择销售出库单" width="1000"  @on-visible-change="openOrClose">
    <div class="OutboundInfo">
      <div class="header">
        <Form ref="formOne" :model="Outform" inline>
          出库日期：
          <FormItem>
            <DatePicker
              style="width: 200px"
              type="daterange"
              placeholder="请选择日期"
              v-model="time"
              @on-change="getTime"
              @on-clear="clearTime"
            ></DatePicker>
          </FormItem>
          <FormItem>
            <Input
              type="text"
              placeholder="业务单号"
              style="width: 150px"
              v-model="Outform.code"
            />
          </FormItem>
          <FormItem>
            <Input
              type="text"
              placeholder="出库单号"
              style="width: 150px"
              v-model="Outform.serviceId"
            />
          </FormItem>
          <FormItem>
            <Input
              type="text"
              placeholder="配件编码"
              style="width: 120px"
              v-model="Outform.partCode"
            />
          </FormItem>

          <Button type="warning" @click="search">查询</Button>
          <Button type="warning" @click="selectEnter" class="ml10 mr10">选入</Button>
          <Button @click="cancel">取消</Button>
        </Form>
      </div>
      <div class="main clearfix">
        <!-- 销售出库单上 -->
        <vxe-table
          @radio-change="selectTabelData"
          height='200'
          border
          resizable
          auto-resize
          size="mini"
          :data="tableDataTop"
          highlight-current-row
          :radio-config="{ labelField: '', trigger: 'row' }"
        >
          <vxe-table-column
            type="seq"
            title="序号"
          ></vxe-table-column>
          <vxe-table-column type='radio'  title="选择">
          </vxe-table-column>
          <vxe-table-column
            field="guestName"
            title="往来单位"
          ></vxe-table-column>
          <vxe-table-column
            field="orderMan"
            title="销售员"

          ></vxe-table-column>
          <vxe-table-column
            title="出库金额"
            field="outAmt"
          >
          </vxe-table-column>
          <vxe-table-column
            field="code"
            title="业务单号"

          ></vxe-table-column>
          <vxe-table-column
            field="orderDate"
            title="订单日期"

          ></vxe-table-column>
          <vxe-table-column
            field="serviceId"
            title="出库单号"

          ></vxe-table-column>
          <vxe-table-column
            field="outDate"
            title="出库日期"

          ></vxe-table-column>
        </vxe-table>

        <!-- 销售出库单下 -->
        <div class="mt5 pr10 h40">订单数量共{{this.page.total}}条</div>
        <vxe-table
          height='200'
          border
          resizable
          show-footer
          :footer-method="footerMethod"
          auto-resize
          size="small"
          @select-change="selectTable"
          @select-all="selectAllTable"
          :data="tableDataBottom.details"
          highlight-current-row
          :radio-config="{ labelField: '', trigger: 'row' }"
        >
          <vxe-table-column
            type="seq"

            title="序号"
          ></vxe-table-column>
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column
            field="partCode"
            title="配件编码"
          ></vxe-table-column>
          <vxe-table-column
            field="partName"
            title="配件名称"
          ></vxe-table-column>
          <vxe-table-column
            field="partBrand"
            title="品牌"
          ></vxe-table-column>
          <vxe-table-column
            field="oemCode"
            title="OE码"
          ></vxe-table-column>
          <vxe-table-column
            field="systemUnitId"
            title="单位"
          ></vxe-table-column>
          <vxe-table-column
            field="sellQty"
            title="出库数量"
          ></vxe-table-column>

          <vxe-table-column
            field="sellPrice"
            title="出库单价"
          ></vxe-table-column>
          <vxe-table-column
            field="sellAmt"
            title="出库金额"
          ></vxe-table-column>
          <vxe-table-column
            field="remark"
            title="备注"
          ></vxe-table-column>
        </vxe-table>
<!--        分页-->
        <div class="clearfix">
          <Page :total="page.total" :page-size="page.size" :current="page.num"
                show-sizer show-total class-name="page-con fr mr10 mb10 mt10"
                :page-size-opts="page.placement"
                @on-change="selectNum" @on-page-size-change="selectPage" class="mr10"></Page>
        </div>
      </div>
    </div>
    <div slot='footer'>
    </div>
  </Modal>
</template>

<script>
  import {getoutList} from "_api/salesManagment/sellReturn.js";
  export default {
    name: 'SalesOutBound',
    props:{
        guestId:''
      },
    data() {
      return {
        showInfo: false, // 销售出库订单信息——表单
        Outform: {},
        tableDataTop: [],//上面表格数据
        tableDataBottom: {}, //下面表格数据
        SalesOutboundTable: {  // 销售出库单列表
          loading: false,
        },
        page: {
          num: 1,
          size: 20,
          total: 0,
          placement:[20,40,60,80,100]
        },
        selectTableList:[], //下侧table表格选中的数据
        time:''
      }

    },
    methods: {
      clearTime(){
        this.Outform.startOutDate=null
        this.Outform.endOutDate=null
        this.getList()
      },
      //查询
      search(){
        this.tableDataBottom = {}
        this.getList()
      },
      openModal() {
        this.showInfo = true;
        this.tableDataBottom = {}
        this.getList()
      },
      //取消
      cancel(){
        this.showInfo = false;
      },
      //切换页面
      selectNum(val){
        this.page.num = val
        this.tableDataBottom = {}
        this.getList()
      },
      //切换页数
      selectPage(val){
        this.page.num = 1
        this.page.size = val
        this.tableDataBottom = {}
        this.getList()
      },
      //获取时间
      getTime(value){
        if(value[0]){
          this.Outform.startOutDate = value[0] +  " " + "00:00:00"
          this.Outform.endOutDate = value[1] +' '+ '23:59:59'
        }
      },
      //上表格选中
      selectTabelData(data){
        this.tableDataBottom = data.row
      },
      //多选内容
      selectTable(data){
        this.selectTableList = data.selection||[]
      },
      //全选内容
      selectAllTable(data){
        this.selectTableList = data.selection || []
      },
      //选入
      selectEnter(){
        if(this.selectTableList.length === 0){
          this.$Message.error('请选择一条有效数据')
        }else {
          this.selectTableList.forEach(el => {
            el.oid = el.id;
            el.unit = el.systemUnitId;
          })
          this.$emit('salesOutList',this.selectTableList)
          this.showInfo = false
        }
      },
      openOrClose(){
        this.Outform={}
        this.time=''
        this.selectTableList=[]
      },

      //获取销售出库单列表
      getList(){
        let data={}
        let page = this.page.num -1
        let size = this.page.size
         data=this.Outform
         data.guestId = this.guestId
        getoutList(page,size,data).then(res=>{
          if(res.code==0){
            this.tableDataTop= res.data.content || []
            this.page.total = res.data.totalElements
          }
        })
      },
      //计算表格数据
      // countAmount(row) {
      //   return this.$utils.toNumber(row.trueOutQty) * this.$utils.toNumber(row.orderPrice)
      // },
      // 计算尾部总和
      countAllAmount(data) {
        let count = 0
        data.forEach(row => {
          count += this.countAmount(row)
        })
        this.totalMoney = count
        return count
      },
      //获取尾部总数
      footerMethod({columns, data}) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return '和值'
            }
            if (['sellQty', 'sellPrice', 'sellAmt'].includes(column.property)) {
              return this.$utils.sum(data, column.property)
            }
            if (columnIndex === 7) {
              return ` ${this.countAllAmount(data)} `
            }
            return null
          })
        ]
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
