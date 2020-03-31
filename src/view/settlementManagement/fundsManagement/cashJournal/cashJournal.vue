<template>
  <div class="content-oper content-oper-flex" style="background-color: #fff;">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <quickDate class="mr10" ref="quickDate" @quickDate="quickDate"></quickDate>
          </div>
          <div class="db ml15">
            <span>期间：</span>
            <Date-picker :value="value" type="daterange" placeholder="选择日期" class="w200" @on-change="dateChange"></Date-picker>
          </div>
          <div class="db ml15">
            <span>门店：</span>
            <Select  v-model="shopCode" filterable class="w150 mr15">
              <Option
                v-for="item in shopList"
                :value="item.id"
                :key="item.id"
              >{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db">
            <span>会计科目：</span>
            <Select  v-model="subjectCode" filterable class="w150" disabled="">
              <Option
                v-for="item in subJectList"
                :value="item.id"
                :key="item.id"
              >{{ item.titleName }}</Option>
            </Select>
          </div>
          <div class="db ml15">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="query">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
        </div>
      </div>
      <div class="oper-top flex">

<!--        <div class="db ml5">-->
<!--          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="importXSL">-->
<!--            <span>导入日记账</span>-->
<!--          </button>-->
<!--        </div>-->
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="dele">
            <span>删除导入</span>
          </button>
        </div>
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="intellect">
            <span>智能匹配</span>
          </button>
        </div>
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="artificialChange">
            <span>人工分配</span>
          </button>
        </div>
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="revocation">
            <span>撤销分配</span>
          </button>
        </div>
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="goMoney">
            <span>资金认领核销</span>
          </button>
        </div>
      </div>
    </section>

    <!-- 导入模板弹窗组件-->
    <importXLS :URL="impirtUrl" ref="imp" @getNewList="getNew"></importXLS>

    <!--    人工智能分配-->
    <artificial ref="art" :list="oneList" @getNew = 'getNewList'></artificial>

    <!--    余额展示-->
    <amtData :moneyList='allMoneyList'></amtData>

    <div class="mt15">
      <Tabs type="card" value="capitalChain1">
        <TabPane label="全部数据" name="capitalChain1">
          <div style="overflow: hidden ;overflow-x: scroll">
            <vxe-table
              border
              show-footer
              show-overflow
              highlight-current-row
              highlight-hover-row
              stripe
              ref="xTable"
              align="center"
              height="500"
              @current-change="getOneList"
              size="mini"
              style="width: 3000px"
              :data="tableData"
            >
              <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
              <vxe-table-column field="shopName" title="所属门店" ></vxe-table-column>
              <vxe-table-column field="createTime" title="日期"></vxe-table-column>
              <vxe-table-column field="tradingNote" title="交易备注"></vxe-table-column>
              <vxe-table-column field="incomeMoney" title="收入金额"></vxe-table-column>
              <vxe-table-column field="paidMoney" title="支出金额"></vxe-table-column>
              <vxe-table-column field="balanceMoney" title="余额"></vxe-table-column>
              <vxe-table-column field="businessType" title="业务类别"></vxe-table-column>
              <vxe-table-column field="leadHandler" title="导入经办人"></vxe-table-column>
              <vxe-table-column field="claimShopName" title="认领门店"></vxe-table-column>
              <vxe-table-column field="claimShopCode" title="认领店号"></vxe-table-column>
              <vxe-table-column field="certificate" title="凭证摘要"></vxe-table-column>
              <vxe-table-column field="cancelPerson" title="认领核销人"></vxe-table-column>
              <vxe-table-column field="statementNumber" title="核销对账单号"></vxe-table-column>
              <vxe-table-column field="suppliers" title="往来单位"></vxe-table-column>
              <vxe-table-column field="claimNote" title="认领备注"></vxe-table-column>
              <vxe-table-column field="claimType" title="是否认领">
                <template v-slot="{row}">
                  {{row.claimType ? '是':'否'}}
                </template>
              </vxe-table-column>
              <vxe-table-column field="accountingExaminer" title="会计审核人"></vxe-table-column>
              <vxe-table-column field="checkTime" title="审核时间"></vxe-table-column>
              <vxe-table-column field="proofWords" title="凭证字"></vxe-table-column>
              <vxe-table-column field="proofCode" title="凭证号"></vxe-table-column>
            </vxe-table>
          </div>
        </TabPane>
        <TabPane label="已核销" name="capitalChain2">
          <div style="overflow: hidden ;overflow-x: scroll">
            <vxe-table
              border
              show-footer
              show-overflow
              highlight-current-row
              highlight-hover-row
              stripe
              ref="xTable"
              align="center"
              height="500"
              @current-change="getOneList"
              size="mini"
              style="width: 3000px"
              :data="tableData1"
            >
              <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
              <vxe-table-column field="shopName" title="所属门店" ></vxe-table-column>
              <vxe-table-column field="createTime" title="日期"></vxe-table-column>
              <vxe-table-column field="tradingNote" title="交易备注"></vxe-table-column>
              <vxe-table-column field="incomeMoney" title="收入金额"></vxe-table-column>
              <vxe-table-column field="paidMoney" title="支出金额"></vxe-table-column>
              <vxe-table-column field="balanceMoney" title="余额"></vxe-table-column>
              <vxe-table-column field="businessType" title="业务类别"></vxe-table-column>
              <vxe-table-column field="leadHandler" title="导入经办人"></vxe-table-column>
              <vxe-table-column field="claimShopName" title="认领门店"></vxe-table-column>
              <vxe-table-column field="claimShopCode" title="认领店号"></vxe-table-column>
              <vxe-table-column field="certificate" title="凭证摘要"></vxe-table-column>
              <vxe-table-column field="cancelPerson" title="认领核销人"></vxe-table-column>
              <vxe-table-column field="statementNumber" title="核销对账单号"></vxe-table-column>
              <vxe-table-column field="suppliers" title="往来单位"></vxe-table-column>
              <vxe-table-column field="claimNote" title="认领备注"></vxe-table-column>
              <vxe-table-column field="claimType" title="是否认领">
                <template v-slot="{row}">
                  {{row.claimType ? '是':'否'}}
                </template>
              </vxe-table-column>
              <vxe-table-column field="accountingExaminer" title="会计审核人"></vxe-table-column>
              <vxe-table-column field="checkTime" title="审核时间"></vxe-table-column>
              <vxe-table-column field="proofWords" title="凭证字"></vxe-table-column>
              <vxe-table-column field="proofCode" title="凭证号"></vxe-table-column>
            </vxe-table>
          </div>
        </TabPane>
        <TabPane label="未核销" name="capitalChain3">
          <div style="overflow: hidden ;overflow-x: scroll">
            <vxe-table
              border
              show-footer
              show-overflow
              highlight-current-row
              highlight-hover-row
              stripe
              ref="xTable"
              align="center"
              height="500"
              @current-change="getOneList"
              size="mini"
              style="width: 3000px"
              :data="tableData2"
            >
              <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
              <vxe-table-column field="shopName" title="所属门店" ></vxe-table-column>
              <vxe-table-column field="createTime" title="日期"></vxe-table-column>
              <vxe-table-column field="tradingNote" title="交易备注"></vxe-table-column>
              <vxe-table-column field="incomeMoney" title="收入金额"></vxe-table-column>
              <vxe-table-column field="paidMoney" title="支出金额"></vxe-table-column>
              <vxe-table-column field="balanceMoney" title="余额"></vxe-table-column>
              <vxe-table-column field="businessType" title="业务类别"></vxe-table-column>
              <vxe-table-column field="leadHandler" title="导入经办人"></vxe-table-column>
              <vxe-table-column field="claimShopName" title="认领门店"></vxe-table-column>
              <vxe-table-column field="claimShopCode" title="认领店号"></vxe-table-column>
              <vxe-table-column field="certificate" title="凭证摘要"></vxe-table-column>
              <vxe-table-column field="cancelPerson" title="认领核销人"></vxe-table-column>
              <vxe-table-column field="statementNumber" title="核销对账单号"></vxe-table-column>
              <vxe-table-column field="suppliers" title="往来单位"></vxe-table-column>
              <vxe-table-column field="claimNote" title="认领备注"></vxe-table-column>
              <vxe-table-column field="claimType" title="是否认领">
                <template v-slot="{row}">
                  {{row.claimType ? '是':'否'}}
                </template>
              </vxe-table-column>
              <vxe-table-column field="accountingExaminer" title="会计审核人"></vxe-table-column>
              <vxe-table-column field="checkTime" title="审核时间"></vxe-table-column>
              <vxe-table-column field="proofWords" title="凭证字"></vxe-table-column>
              <vxe-table-column field="proofCode" title="凭证号"></vxe-table-column>
            </vxe-table>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
  import quickDate from "@/components/getDate/dateget_bill.vue";
  import {creat} from '../../components'
  import importXLS from '../../components/importXLS'
  import artificial from '../../components/artificial'
  import { goshop , impUrl , goList , deleList , revocation , ait} from '@/api/settlementManagement/fundsManagement/capitalChain'
  import {getTableList}from '@/api/accountant/accountant'
  import amtData from '../../components/amtData'


  import moment from 'moment'
  export default {
    components: {
      quickDate,
      importXLS,
      artificial,
      amtData
    },
    data() {
      return {
        value: [],
        shopCode:0,//获取到门店id
        shopList: [
          {id:0 , name:'全部'}
        ], //门店列表
        subjectCode:1243107543071129600,//科目id
        subJectList:[
          {id:1001 ,titleName:'库存现金'}
        ],//科目列表
        company: "", //往来单位
        companyId: "", //往来单位id
        formInline:{},//统计数据
        tableData:[],//全部数据
        tableData1:[],//已审核数据
        tableData2:[],//未审核数据
        impirtUrl:{
          downId: '1200000000',
          upUrl:impUrl
        },//下载上传路径
        oneList:{},//点击获取到的信息
        allMoneyList:{},//获取到所有余额信息
        canQuickDateList: false,//判断是否可以查询
      };
    },
    async mounted () {
      let arr = await creat (this.$refs.quickDate.val,this.$store)
      this.value = arr[0];
      this.getShop()  //获取门店


    },
    methods: {

      //获取门店
      async getShop(){
        let data ={}
        data.supplierTypeSecond = 0
        this.shopList = [{id:0 , name:'全部'}]
        let res = await goshop(data)
        if (res.code === 0) {
          this.shopList = [...this.shopList , ...res.data]
            this.$nextTick( () => {
              this.shopCode = this.$store.state.user.userData.shopId
            })

        }
      },


      // 日期选择
      dateChange(data){
        this.value = data
      },
      // 快速查询
      quickDate(data){
        this.value = data
        if( this.canQuickDateList){
          this.getList()
        }else {
          this.canQuickDateList = !this.canQuickDateList
        }
      },

      //获取表格信息
      async getList(){
        let data = {}
        data.page = 0
        data.size = 9999
        data.startTime = this.value[0] ? moment(this.value[0]).format("YYYY-MM-DD") : ''
        data.endTime = this.value[1] ? moment(this.value[1]).format("YYYY-MM-DD") : ''
        data.areaId = 0
        data.shopNumber = this.shopCode
        data.subjectId = this.subjectCode
        let res = await goList(data)
        if(res.code === 0){
          if(res.data.content.length > 0){
            this.allMoneyList = res.data.content[0].moneyList
          }
          this.tableData = res.data.content
          this.tableData1 = []
          this.tableData2 = []
          res.data.content.forEach( item => {
            if (item.collateState) {
              this.tableData1.push(item)
            } else {
              this.tableData2.push(item)
            }
          })
        }
      },

      //查询
      query(){
        this.getList()
      },

      //点击获取表格数据
      getOneList(val){
        this.oneList = val.row
      },

      //打开导入模板下载
      importXSL(){
        this.$refs.imp.openModal()
      },

      //导入成功后刷新页
      getNew(data){},

      //人工分配成功后刷新
      getNewList(){
        this.getList()
      },


      //删除导入
      dele(){
        if(Object.keys(this.oneList).length == 0) return this.$Message.error('请至少选择一条数据')
        if(this.oneList.collateState) return this.$Message.error('已核销数据不能删除')
        this.$Modal.confirm({
          title: '提示',
          content: '<p>是否删除该条数据</p>',
          onOk: async () => {
            let data ={}
            data.id = this.oneList.id
            let res = await deleList(data)
            if (res.code === 0){
              this.getList()
              this.$Message.success('删除成功')
            }
          },
          onCancel: () => {
          }
        });
      },

      //智能匹配
      async intellect(){
        let res = await ait()
        if (res.code ===0) {
          this.$Modal.success({
            title: '提示',
            content: res.data
          })
          this.getList()
        }
      },

      //只能匹配

      //人工匹配
      artificialChange(){
        if(Object.keys(this.oneList).length == 0) return this.$Message.error('请至少选择一条数据')
        if(this.oneList.allocation) return this.$Message.error('数据已分配')
        this.$refs.art.openModal()
      },

      //撤销分配
      async revocation(){
        if(Object.keys(this.oneList).length == 0) return this.$Message.error('请至少选择一条数据')
        if(!this.oneList.allocation) return this.$Message.error('数据已分配')
        let data = {}
        data.id = this.oneList.id
        let res = await revocation([this.oneList.id])
        if (res.code === 0){
          this.$Message.success('撤销分配成功')
          this.getList()
        }

      },

      //资金认领核销
      goMoney(){
        this.$router.push({ name: "claimWrite"})
      }

    }
  };
</script>

<style lang="less" scoped>
  .oper-top input {
    border: 1px solid #dddddd;
    text-indent: 4px;
  }
  .oper-top .input {
    position: relative;
    left: -26px;
    bottom: -5px;
  }
  .pro span {
    display: inline-block;
    width: 100px;
    text-align: right;
  }
  .inner-box {
    overflow-x: scroll;
  }

</style>
