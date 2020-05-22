<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf wlf-center">
          <div class="db mr10">
            <span>快速查询：</span>
            <getDate class="mr10" @quickDate="getvalue"></getDate>
          </div>
          <div class="db mr10">
            <span class="">订单日期：</span>
            <Date-picker
              type="datetimerange"
              clearable
              class="w320 mr10"
              @on-change="getvalue"
              placeholder="年/月/日-年/月/日"
            >
            </Date-picker>
          </div>
          <div class="db mr10">
            <span>华胜门店：</span>
            <Select v-model="company" class="w200 mr10" placeholder="选择公司" filterable clearable @on-change="getCompany">
              <Option v-for="item in companyListOptions" :value="item.name" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <span>配件编码/名称：</span>
            <Input v-model="searchData.partName" class="w150 mr10" />
          </div>
          <div class="db">
            <Button class="mr15 w90" type="primary" @click="resetData">
              查询
            </Button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-btn">
      <Button class="mr15 w90" @click="search">
        转待处理
      </Button>
      <Button class="mr15" @click="search">
        取消待处理
      </Button>
      <Button class="mr15" @click="search">
        生成销售订单
      </Button>
      <Button class="mr15" @click="search">
        生成调拨申请单
      </Button>
      <Button class="mr15 w90" @click="search">
        导出
      </Button>
    </section>

    <section class="con-box">
      <div class="inner-box">
        <Tabs v-model="tabsName" :animated="false" @on-click="changeTab">
          <TabPane label="可处理信息" name="name1">
            <Table height="389" @on-selection-change="selectTabelData" :loading="loading" border :stripe="true" :columns="columnsPart" :data="hsOrderList1"></Table>
          </TabPane>
          <TabPane label="待处理" name="name2">
            <Table height="389" @on-selection-change="selectTabelData" :loading="loading" border :stripe="true" :columns="columnsPart" :data="hsOrderList1"></Table>
          </TabPane>
          <TabPane label="已处理配件查询" name="name3">
            <Table height="389" @on-selection-change="selectTabelData" :loading="loading" border :stripe="true" :columns="columnsPart" :data="hsOrderList1"></Table>
          </TabPane>
          <TabPane label="历史订单" name="name4">
            <Table height="389" @on-selection-change="selectTabelData" :loading="loading" border :stripe="true" :columns="columnsPart" :data="hsOrderList1"></Table>
          </TabPane>
        </Tabs>
      </div>
    </section>
  </div>
</template>

<script>
  import {getTopList, getClient, selectCompany} from "_api/salesManagment/acceptance.js";
  import {getHuaShengOrders} from "../../../api/salesManagment/sellReturn";
  import getDate from '@/components/getDate/dateget'

  export default {
    name: "hsOrder",
    components: {
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
        //配件名称查询层表头
        columnsPart: [
          {
            title: "序号",
            width: 50,
            type: "index"
          },
          {
            title: "序号",
            type: "selection",
            minWidth: 80
          },
          {
            title: "订单单号",
            key: "ordersNo",
            minWidth: 120
          },
          {
            title: "下单门店",
            key: "companyName",
            minWidth: 120
          },
          {
            title: "备注",
            key: "remark",
            minWidth: 120
          },
          {
            title: "配件内码",
            key: "partInnerId",
            minWidth: 120
          },
          {
            title: "配件编码",
            key: "partCode",
            minWidth: 120
          },
          {
            title: "配件名称",
            key: "partName",
            minWidth: 120
          },
          {
            title: "规格",
            key: "unit",
            minWidth: 60
          },
          {
            title: "OEM码",
            key: "oemCode",
            minWidth: 120
          },
          {
            title: "实物码",
            key: "inkindNo",
            minWidth: 80
          },
          {
            title: "订单数量",
            key: "orderQty",
            minWidth: 80
          },
          {
            title: "本店库存",
            key: "shopStock",
            minWidth: 80
          },
          {
            title: "总部库存",
            key: "headquartersStock",
            minWidth: 80
          },
          {
            title: "配件品质",
            key: "partQuality",
            minWidth: 80
          },
          {
            title: "品牌",
            key: "partBrand",
            minWidth: 80
          },
          {
            title: "厂牌",
            key: "carBrandName",
            minWidth: 80
          },
          {
            title: "品牌车型",
            key: "carModelName",
            minWidth: 120
          },
          {
            title: "单位",
            key: "spec",
            minWidth: 60
          },
          {
            title: "一级分类",
            key: "carTypef",
            minWidth: 180
          },
          {
            title: "二级分类",
            key: "carTypes",
            minWidth: 180
          },
          {
            title: "订单来源",
            key: "orderSource",
            minWidth: 180
          },
          {
            title: "订单人",
            key: "createUname",
            minWidth: 180
          },
          {
            title: "订单日期",
            key: "createTime",
            minWidth: 180
          },
        ],

        tabsName:'name1',
        hsOrderList1:[],
        searchData:{
          status:0,
          partName:''
        }
      }

    },
    mounted() {
      // this.getTopList()
      this.getAllClient()
      this.getAllCompany()
      this.getListData()
    },
    methods: {

      async getListData(){
        let params = {};
        let data = {};
        data.status = this.searchData.status;
        if(this.searchData.partName.trim()){
          data.partName = this.searchData.partName.trim();
        }
        // if (this.purchaseType !== 9999 && this.purchaseType) {
        //   data.billStatusId = this.purchaseType;
        // }
        // if (this.dateTime.length > 0) {
        //   data.startTime = this.dateTime[0];
        //   data.endTime = this.dateTime[1];
        // }
        data.startDate = this.queryTime[0] || ''
        data.endDate = this.queryTime[1] || ''
        params.page = this.page.num - 1;
        params.size = this.page.size;

        let repData = await getHuaShengOrders(params,data);
        if(repData.code===0){
          this.hsOrderList1 = repData.data.content||[];
        }
      },

      changeTab(name){
        switch (name) {
          case 'name1':
            this.searchData.status = 0;
            break;
          case 'name2':
            this.searchData.status = 1;
            break;
          case 'name3':
            this.searchData.status = 2;
            break;
          case 'name4':
            delete this.searchData.status;
            break;
        };
        this.resetData();
      },
      resetData(){
        this.page.num = 1;
        this.page.size = 10;
        this.getListData();
      },

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
        this.resetData();
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
        console.log(this.clickRow)
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
  .con-btn{
    background: #fff;
    padding:10px 20px;
    border-top: 1px solid #eee;
  }
</style>
