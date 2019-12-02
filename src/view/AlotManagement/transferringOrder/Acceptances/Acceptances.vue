<template>
    <div class="content-oper content-oper-flex">
      <section class="oper-box">
        <div class="oper-top flex">
          <div class="wlf">
            <div class="db mr10">
              <span>快速查询：</span>
              <quickDate @quickDate="getData"></quickDate>
            </div>
            <div class="db flex">
              <span>开始日期：</span>
              <DatePicker @on-change="selectDate" type="daterange" placement="bottom-start" placeholder="选择日期"
                          class="w200 mr20">
              </DatePicker>
            </div>
            <div class="db mr10">
              <Select v-model="searchType2" class="w100">
                <Option v-for="item in ListTwo" :value="item.value" :key="item.value">{{ item.name }}</Option>
              </Select>
            </div>
            <div class="db">
              <Input v-model="productName" placeholder="请输入申请公司" style="width: 120px" class="mr10"></Input>
              <Button type="warning" class="mr10 w90" @click="search"><Icon custom="iconfont iconchaxunicon icons"/>查询</Button>
            </div>
          </div>
        </div>
      </section>
      <section class="con-box">
        <div class="boxbox">
          <div class="top">
            <div>
              <div class="pl10 pr10 Tablebox">
                <vxe-table
                  border
                  resizable
                  :data="topRight.tbdata"
                  :edit-config="{trigger: 'click', mode: 'cell'}"
                  @edit-actived="editActivedEvent"
                  @edit-closed="editClosedEvent">
                  <vxe-table-column title="序号" type="index" width="60"></vxe-table-column>
                  <vxe-table-column field="" title="操作" >
                    <template>
                      <vxe-button type="primary" size="small">受理</vxe-button>
                      <vxe-button size="small">拒绝</vxe-button>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="" title="申请公司"></vxe-table-column>
                  <vxe-table-column field="" title="调拨申请单号"></vxe-table-column>
                  <vxe-table-column field="" title="状态"></vxe-table-column>
                  <vxe-table-column field="" title="提交日期"></vxe-table-column>
                  <vxe-table-column field="" title="申请日期"></vxe-table-column>
                  <vxe-table-column field="" title="备注"></vxe-table-column>
                  <vxe-table-column field="" title="受理人"></vxe-table-column>
                  <vxe-table-column field="" title="受理日期"></vxe-table-column>
                </vxe-table>
                <Page class-name="page-con" :current="topRight.page.num" :total="topRight.page.total" :page-size="topRight.page.size" @on-change="changePageTop"
                      @on-page-size-change="changeSizeTop" show-sizer show-total>
                </Page>
              </div>
            </div>
          </div>
          <div class="bottom pt10">
            <div class="pl10 pr10 Tablebox">
              <vxe-table
                border
                resizable
                :data="Bottom.tbdata"
                :edit-config="{trigger: 'click', mode: 'cell'}"
                :footer-method="footerMethod"
                @edit-actived="editActivedEvent"
                @edit-closed="editClosedEvent">
                <vxe-table-column title="序号" type="index" width="60"></vxe-table-column>
                <vxe-table-column field="" title="配件编码" ></vxe-table-column>
                <vxe-table-column field="" title="配件名称"></vxe-table-column>
                <vxe-table-column field="" title="品牌"></vxe-table-column>
                <vxe-table-column field="" title="单位"></vxe-table-column>
                <vxe-table-column field="" title="OE码"></vxe-table-column>
                <vxe-table-column field="" title="申请数量"></vxe-table-column>
                <vxe-table-column field="" title="紧销品" type="checkbox"></vxe-table-column>
                <vxe-table-column field="" title="备注"></vxe-table-column>
              </vxe-table>
              <Page class-name="page-con" :current="Bottom.page.num" :total="Bottom.page.total" :page-size="Bottom.page.size" @on-change="changePageBottom"
                    @on-page-size-change="changeSizeBottom" show-sizer show-total>
              </Page>
            </div>
          </div>
        </div>
      </section>
    </div>
</template>

<script>
  import QuickDate from '../../../../components/getDate/dateget'
  import '../../../lease/product/lease.less';
  import "../../../goods/goodsList/goodsList.less";
    export default {
        name: "Acceptances",
      components: {
        QuickDate
      },
        data(){
          return {
            selectOne: '', //定义变量赋值日期子组件的数据
            searchType2: 9999, //绑定的下拉框
            ListTwo: [{
              value: 9999,
              name: '全部'
            },
              {
                value: 1,
                name: '待受理'
              },
              {
                value: 2,
                name: '已受理'
              },
              {
                value: 3,
                name: '已拒绝'
              }],
            productName: '',
            topRight: {
              loading: false,
              tbdata:[],
              page: {
                num: 1,
                size: 10,
                total: 0
              },
              newArr:[] //表格新数组，用于赋值
            },
            Bottom: {
              loading: false,
              page: {
                num: 1,
                size: 10,
                total: 0
              },
              tbdata:[],
            }
          }
        },
      methods: {
        //  日期选择器从子组件哪来的数据
        getData(A){
          console.log(A)
          this.selectOne = A
        },
        //选中的日期
        selectDate(date){
          this.dateTime = date
          console.log(this.dateTime)
        },
        //搜索
        search(){
          // this.getList()
        },
        //底部的每行点击事件
        selctionBottom(a){
          console.log(a)
        },
        //多选框
        selctionTopBottom(a){
          console.log(a)
        },
        // 单元格被激活事件
        editActivedEvent ({ row, column }, event) {
          console.log(`打开 ${column.title} 列编辑`)
        },
        // 单元格被关闭事件
        editClosedEvent ({ row, column }, event) {
          console.log(`关闭 ${column.title} 列编辑`)
        },
        //合计
        footerMethod({ columns, data }) {
          return [
            columns.map((column, columnIndex) => {
              if (columnIndex === 0) {
                return '和值'
              }
              if (['age', 'rate'].includes(column.property)) {
                return this.$utils.sum(data, column.property)
              }
              return null
            })
          ]
        },
        //分页上部分
        changePageTop(p) {
          this.topRight.page.num = p
          // this.getList()
        },
        changeSizeTop(size) {
          this.topRight.page.num = 1
          this.topRight.page.size = size
          // this.getList()
        },
        //分页下部分
        changePageBottom(p) {
          this.Bottom.page.num = p
          // this.getList()
        },
        changeSizeBottom(size) {
          this.Bottom.page.num = 1
          this.Bottom.page.size = size
          // this.getList()
        },
      }
    }
</script>

<style scoped>
.flex{
  display: flex;
  align-items: center;
}
.boxbox{
  height: 700px;
  background: #ffffff;
}
.top,.bottom{
  width: 100%;
  height: 50%;
}
.top{
  border-bottom: 1px solid lightgray;
}
.Tablebox{
  height: 320px;
  overflow-y: auto;
}
</style>
