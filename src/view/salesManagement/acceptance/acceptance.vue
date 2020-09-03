<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf wlf-center">
          <div class="db mr10">
            <getDate class="mr10" @quickDate="getvalue"></getDate>
          </div>
          <div class="db mr10">
            <span class="mr10">日期：</span>
            <Date-picker
              type="datetimerange"
              clearable
              class="w320 mr10"
              :options="options3"
              @on-change="getvalue"
              placeholder="年/月/日-年/月/日"
            >
            </Date-picker>
          </div>
          <div class="db mr10">
            <Select v-model="orderType" style="width:100px" class="mr10" @on-change="getOrderType">
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <Select v-model="guestId" class="w150 mr10" placeholder="选择客户" filterable clearable
                    @on-change="getCustomer">
              <Option v-for="item in client" :value="item.id" :key="item.id">{{ item.fullName }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <Select v-model="company" class="w200 mr10" placeholder="选择公司" filterable clearable @on-change="getCompany">
              <Option v-for="item in companyListOptions" :value="item.name" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
        </div>
      </div>
    </section>


    <section class="con-box">
      <div class="inner-box">
        <!--         上表格-->
        <div class="topTableDate">
          <vxe-table
            ref="xTable"
            border
            resizable
            size="mini"
            height='300'
            :queryTime="queryTime"
            :orderType="orderType"
            :company="company"
            :guestId="guestId"
            :data="TopTableData"
            highlight-hover-row
            highlight-current-row
            @current-change="selectTabelData"
            :edit-config="{ trigger: 'click', mode: 'cell' }"
          >
            <vxe-table-column  show-overflow="tooltip"
              type="seq"
              title="序号"
            ></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" title="操作" width="120">
              <template v-slot="{ row,rowIndex }">
                <vxe-button v-if="row.status.value == 1" type="text" @click="showNewOrder(row)">生成采购单</vxe-button>
              </template>
            </vxe-table-column>

            <vxe-table-column  show-overflow="tooltip"
              field="company"
              title="公司"
            ></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip"
              field="guestName"
              title="客户"
            ></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip"
              field="serviceId"
              title="预售单号"
            ></vxe-table-column>

            <vxe-table-column  show-overflow="tooltip" field="status" title="状态">
              <template v-slot="{ row }">
                <span>{{row.status.name}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="orderQty" title="订单数量">
            </vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" title="订单金额" field="orderAmt">
            </vxe-table-column>
            <vxe-table-column  show-overflow="tooltip"
              field="commitTime"
              title="提交日期"
            ></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip"
              field="planSendDate"
              title="预计发货日期"
            ></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip"
              field="planArriveDate"
              title="预计到货日期"
            ></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip"
              field="remark"
              title="备注"

            ></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip"
              field="pchsMainCode"
              title="采购单号"
            ></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip"
              field="settleMan"
              title="受理人"
            ></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip"
              field="settleDate"
              title="受理日期"
            ></vxe-table-column>

          </vxe-table>
        </div>

        <!--     分页-->
        <Row class="mt10 mb10">
          <Col span="12">
            <div>
              <Page :total="page.total" :page-size="page.size" :current="page.num" show-sizer show-total
                    class-name="page-con"
                    @on-change="selectNum" @on-page-size-change="selectPage"
              ></Page>
            </div>
          </Col>
          <Col span="12" class="mt20">
            <div style="text-align: right">
              每页{{this.page.size}}条,
              共{{this.page.total}}条
            </div>

          </Col>
        </Row>
        <!--        下表格-->
        <div class="bottomTableDate">
          <vxe-table
            border
            show-footer
            :footer-method="footerMethod"
            resizable
            size="mini"
            height='400'
            :data="BottomTableData"
            :edit-config="{ trigger: 'click', mode: 'cell' }"
          >
            <vxe-table-column  show-overflow="tooltip"
              type="seq"
              title="序号"
            ></vxe-table-column>

            <!-- <vxe-table-column  show-overflow="tooltip" title="操作" width="80">
              <template v-slot="{ row }">
                <Button type="text">查看</Button>
              </template>
            </vxe-table-column> -->

            <vxe-table-column  show-overflow="tooltip"
              field="partCode"
              title="配件编码"
            ></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip"
              field="partName"
              title="配件名称"
            ></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip"
              field="partBrand"
              title="品牌"
            ></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="orderQty" title="数量"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="orderPrice" title="销价"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" title="金额">
              <template v-slot="{ row }">
                <span>{{ countAmount(row)| priceFilters }} </span>
              </template>
            </vxe-table-column>
            <vxe-table-column  show-overflow="tooltip"
              field="remark"
              title="备注"
            ></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" title="品牌车型">
              <template v-slot="{row,rowIndex}">
                <span>{{row.carBrandName}} {{row.carModelName}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column  show-overflow="tooltip"
              field="unit"
              title="单位"
            ></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip"
              field="oemCode"
              title="OE码"
            ></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip"
              field="spec"
              title="规格"
            ></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="partInnerId" title="配件内码" width="120"></vxe-table-column>
          </vxe-table>
        </div>
      </div>
    </section>
    <!--    新增采购订单-->
    <new-order ref="newOrder" :data = 'clickRow'></new-order>
  </div>
</template>

<script>
  import {getTopList, getClient, selectCompany} from "_api/salesManagment/acceptance.js";
  import getDate from '@/components/getDate/dateget'
  import NewOrder from './components/NewOrder';

  export default {
    name: "acceptance",
    components: {
      NewOrder,
      getDate
    },
    data() {
      return {
        conditionData: {
          character: "",  // 快速查询
          status: '1',  //受理状态
        },
        orderType: 1,
        typeList: [
          {value: 1, name: '待受理'},
          {value: 3, name: '已受理'},
          {value: 4, name: '已完成'},

        ],
        // 日期数据
        options3: {
          disabledDate(date) {
            return date && date.valueOf() > Date.now();
          }
        },
        id:'',
        company: '', //公司选择
        companyListOptions: [],//选择公司下拉列表
        guestId: '',
        // company: '',
        client: [],//选择客户列表
        TopTableData: [],//上侧表格list
        BottomTableData: [],//下侧表格list
        //分页
        page: {
          total: 0,
          size: 10,
          num: 1
        },
        totalMoney: '',//总价
        queryTime: '',//快速查询时间
        queryDate: '',//获取查询日期
        clickRow:'',//打开采购订单信息
      }

    },
    mounted() {
      this.getTopList()
      this.getAllClient()
      this.getAllCompany()
    },
    methods: {
      //获取选择状态类型
      getOrderType(v) {
        this.orderType = v
      },
      //获取选择客户
      getCustomer(v) {
        this.guestId = v
      },
      //获取选择公司
      getCompany(v) {
        console.log('vvv',v)
        this.company = v
      },
      //获取时间
      getvalue(date) {
        this.queryTime = date
      },
      //客户列表
      getAllClient() {
        getClient().then(res => {
          if (res.code === 0) {
            this.client = res.data
          }
        })
      },
      newArr(arr) {
        // console.log(arr)
        return arr.reduce((pre, cur) => {
          // console.log(pre, cur)
          let flag = Array.isArray(cur.childs) && Array.isArray(cur.childs)
          return pre.concat(flag ? this.newArr(cur.childs) : cur)
        }, [])
      },
      toList(arr) {
        // console.log(arr)v
        return arr.reduce((ret, v) => {
          // console.log(ret, v)
          let item = this.deepClone(v)
          delete item.childs
          this.companyListOptions.push(item)
          let flag = Array.isArray(v.childs) && v.childs.length > 0
          return ret.concat(flag ? this.toList(v.childs) : v)
        }, [])
      },
      deepClone(obj) {
        let ret
        ret = JSON.stringify(obj)
        ret = JSON.parse(ret)
        return ret
      },
      //获取公司信息列表
      getAllCompany() {
        // selectCompany({pId: this.$store.state.user.userData.groupId}).then(res => {
        //   if (res.code === 0) {
        //     let data = res.data
        //     let item = this.deepClone(data)
        //     delete item.childs
        //     this.companyListOptions.push(item)
        //     this.toList(data.childs)
        //   }
        // })
        selectCompany().then(res=>{

          if(res.code==0){
            this.companyListOptions=[]
            Object.keys(res.data).forEach((key)=>{
              // this.companyListOptions=res.data[key]
              this.companyListOptions.push({
                id: key,
                name: res.data[key]
              })
            })
            // console.log('res',this.companyListOptions)
          }
        })
      },
      //切换页面
      selectNum(val) {
        this.page.num = val
        this.getTopList()
      },
      //切换页数
      selectPage(val) {
        this.page.num = 1
        this.page.size = val
        this.getTopList()
      },
      showNewOrder(row) { //弹出生成采购订单模态框
        this.clickRow = JSON.parse(JSON.stringify(row));
        // console.log(this.clickRow)
        this.$refs.newOrder.openModal()
      },
      //分页查询预售单受理信息上
      getTopList() {
        let data = {}
        this.companyListOptions.map(item=>{
          if (item.name===this.company){
            data.orgid=item.id
          }
        })
        data.commitTimeStart = this.queryTime[0] || ''
        data.commitTimeEnd = this.queryTime[1] || ''
        data.guestId = this.guestId
        data.status = this.orderType
        let page = this.page.num - 1
        let size = this.page.size
        getTopList(size, page, data).then(res => {
          // console.log('shuhuhuhu',res)
          if (res.code === 0) {
            // res.data.content.map(item => item.status = JSON.parse(item.status))
            this.page.total = res.data.totalElements
            this.TopTableData = res.data.content
            this.$refs.xTable.clearCurrentRow();
            for(let b of this.TopTableData) {
              if(b.id === this.currentRow.id) {
                this.$refs.xTable.setCurrentRow(b)
                this.BottomTableData = b.detailVOList
              }
            }
          }
        })

      },
      //获取下侧表格一行选中的数据
      selectTabelData(v) {
        this.currentRow = v
        this.BottomTableData = v.row.detailVOList
      },
      //计算表格数据
      countAmount(row) {
        return this.$utils.toNumber(row.orderQty) * this.$utils.toNumber(row.orderPrice)
      },
      // 计算尾部总和
      countAllAmount(data) {
        let count = 0
        data.forEach(row => {
          count += this.countAmount(row)
        })
        this.totalMoney = count
        return count.toFixed(2);
      },
      //获取尾部总数
      footerMethod({columns, data}) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return '和值'
            }
            if (['orderPrice', 'orderAmt'].includes(column.property)) {
              return this.$utils.sum(data, column.property).toFixed(2);
            }
            // if (['orderQty'].includes(column.property)) {
            //   return this.$utils.sum(data, column.property).toFixed(0);
            // }
            if (columnIndex === 6) {
              return ` ${this.countAllAmount(data)} `
            }
            return null
          })
        ]
      },
    },
    watch: {
      //监听时间
      queryTime: function (val, old) {
        this.page.num = 1
        this.page.size = 10
        this.getTopList()
      },
      // //监听日期
      // queryDate:function (val,old) {
      //   this.page.num = 1
      //   this.page.size = 10
      //   this.getTopList()
      //
      // }
      //监听客户状态
      guestId: function (val, old) {
        this.page.num = 1
        this.page.size = 10
        this.getTopList()
      },
      //监听状态
      orderType: function (val, old) {
        this.page.num = 1
        this.page.size = 10
        this.getTopList()
      },
      //监听公司
      company: function (val, old) {
        this.page.num = 1
        this.page.size = 10
        this.getTopList()
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url("../../lease/product/lease.less");


  * {
    font-size: 12px !important;
  }

  .ivu-form-item {
    margin-bottom: 0px;
  }

  .wlf-center {
    display: flex;
    align-items: center;
  }

  .main .ivu-layout .page-con {
    text-align: left;
    padding-left: 10px;
  }

  .ivu-row {
    margin-right: 10px;
  }
</style>
