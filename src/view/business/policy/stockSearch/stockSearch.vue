<template>
  <div class="content-oper">
    <section class="oper-box">
      <!--      主菜单导航-->
      <div class="db pl10 tabs-ulwarp">
        <ul class="tabs">
          <li v-if="!curronly" class="center" :class="{'tab-active': tabIndex == 0}" @click="setTab(0)">汇总库存</li>
          <li class="center" :class="{'tab-active': tabIndex == 1}" @click="setTab(1)">批次库存</li>
        </ul>
      </div>
      <!--      汇总库存表-->
      <div class="tabs-warp" v-if="tabIndex == 0">
        <!--      搜索工具栏-->
        <div class="oper-top flex">
          <div class="wlf">
            <div class="db">
              <Input v-model="searchForm.partCode" placeholder="配件编码" class="w200 mr10"></Input>
            </div>
            <div class="db">
              <Input v-model="searchForm.partName" placeholder="配件名称/拼音" class="w200 mr10"></Input>
            </div>
            <div class="db">
              <Select class="w120 mr10" v-model="searchForm.partBrandValue"  placeholder="品牌">
                <!-- <Option value="9999" v-for="item in partBrandList">品牌</Option> -->
                <Option
                v-for="item in partBrandList"
                :value="item.partBrandValue"
                :key="item.partBrandValue"
              >{{ item.partBrandName}}</Option>
              </Select>
            </div>
            <div class="db">
              <Select class="w120 mr10" v-model="searchForm.storeId" placeholder="仓库">
                <Option
                v-for="item in storeList"
                :value="item.storeId"
                :key="item.storeId"
              >{{ item.storeName}}</Option>
              </Select>
            </div>
            <div class="db">
              <Input placeholder="仓位" class="w120 mr10" v-model="searchForm.shelf"></Input>
            </div>
            <div class="db">
              <Button class="mr10" @click="showQty">显示零库存</Button>
            </div>
            <div class="db">
              <Button type="warning" class="mr10 w90" @click="serch">
                <Icon type="ios-search" size="14"/>
                查询
              </Button>
            </div>
            <div class="db">
              <Button class="mr10 w90"><i class="iconfont mr5 icondaochuicon"></i> 导出</Button>
            </div>
            <div class="db">
              <Button class="mr10 w120" @click="sfy"> 安全库存设置</Button>
            </div>
          </div>
        </div>
        <!--    表-->
        <Table class="table-highlight-row" highlight-row size="small"
               @on-current-change="selectTable"
               border :stripe="true" :columns="columns1" :data="contentOne.dataOne" height="600"></Table>

      </div>
      <!--      批次库存表-->
      <div class="tabs-warp" v-else>
        <!--      搜索工具栏-->
        <div class="oper-top flex">
          <div class="wlf">
            <div class="db">
              <Input v-model="searchForm1.partCode" placeholder="配件编码" class="w200 mr10"></Input>
            </div>
            <div class="db">
              <Input v-model="searchForm1.partName" placeholder="配件名称/拼音" class="w200 mr10"></Input>
            </div>
            <div class="db">
              <Select class="w120 mr10" v-model="searchForm1.partBrandValue" placeholder="品牌">
                  <Option
                v-for="item in partBrandList"
                :value="item.partBrandValue"
                :key="item.partBrandValue"
              >{{ item.partBrandName}}</Option>
              </Select>
            </div>
            <div class="db">
              <Select class="w120 mr10" v-model="searchForm1.storeId" placeholder="仓库">
                <Option
                v-for="item in storeList"
                :value="item.storeId"
                :key="item.storeId"
              >{{ item.storeName}}</Option>
              </Select>
            </div>
            <div class="db">
              <Input v-model="searchForm1.shelf" placeholder="仓位" class="w120 mr10"></Input>
            </div>
            <div class="db">
              <Button class="mr10">显示零库存</Button>
            </div>
            <div class="db">
              <Button type="warning" class="mr10 w90">
                <Icon type="ios-search" size="14"/>
                查询
              </Button>
            </div>
            <div class="db">
              <Button class="mr10 w90"><i class="iconfont mr5 icondaochuicon"></i> 导出</Button>
            </div>
            <div class="db">
              <Button class="mr10 w120" @click="sfy"> 安全库存设置</Button>
            </div>
          </div>
        </div>
        <!--        表-->
        <Table class="table-highlight-row" highlight-row size="small"
               @on-current-change="selectTable"
               border :stripe="true" :columns="columns2" :data="contentTwo.dataTwo" height="700"></Table>
      </div>
      <!--      分页-->
      <div class="page-warp">
        <Page
          v-if="tabIndex == 0"
          class-name="page-con"
          :current="contentOne.page.num"
          :total="contentOne.page.total"
          :page-size="contentOne.page.size"
          @on-change="changePageCus"
          @on-page-size-change="changeSizeCus"
          show-sizer
          show-total
          show-elevator
        ></Page>
         <Page
          v-else
          class-name="page-con"
          :current="contentTwo.page.num"
          :total="contentTwo.page.total"
          :page-size="contentTwo.page.size"
          @on-change="changePageCus"
          @on-page-size-change="changeSizeCus"
          show-sizer
          show-total
          show-elevator
        ></Page>
      </div>
      <!--      点击查看显示-->
      <enter-stock ref="look" :mainData="selectTableData"></enter-stock>
<!--      <div class="look" v-if="look">-->
<!--        <ul>-->
<!--          <li>入库明细</li>-->
<!--          <li>出库明细</li>-->
<!--          <li>订单占用</li>-->
<!--        </ul>-->
<!--      </div>-->
    </section>
  </div>
</template>
<script>
    import {getAllStock, getLotStock} from "@/api/business/stockSearch";
    import  EnterStock from "./enterStock";
    import {getwarehouse} from "@/api/system/setWarehouse";

    export default {
        name: "stockSearch",
        components:{EnterStock},
        data() {
            return {
                // 品牌选项
                partBrandList:[
                  {partBrandName:'小花',partBrandValue:1 },
                  {partBrandName:'小草',partBrandValue:2 },
                  {partBrandName:'小树',partBrandValue:3 },
                  {partBrandName:'小花',partBrandValue:4 }
                ],
                //默认仓库选项
                storeList:[
                  {storeName:'小花',storeId:1 },
                  {storeName:'小草',storeId:2 },
                  {storeName:'小树',storeId:3 },
                  {storeName:'小花',storeId:4 }
                ],
                //汇总库存查询条件表单
                searchForm:{
                  partBrandValue:'',   //品牌id
                  partCode:'',         //配件编码
                  storeId:'',            //仓库id
                  partName:'',         //配件名称
                  shelf:'',            //仓位
                  stockQty:'',         //库存
                },
                 //批次库存查询条件表单
                searchForm1:{
                  partBrandValue:'',   //品牌id
                  partCode:'',         //配件编码
                  storeId:'',            //仓库id
                  partName:'',         //配件名称
                  shelf:'',            //仓位
                  stockQty:'',         //库存
                },
                curronly: false,
                storeName: '999',
                // tab索引
                tabIndex: 0,

                // partCode:'', //配件编码
                // partName:'', //配件名称
                // shelf:'', //仓位
                // stockQty:'',//库存
                // 存放点击选中的数据
                selectTableData: '',
                //查看框
                look: false,
                // 汇总库存列表
                columns1: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        key: 'index',
                        minWidth: 40
                    },
                    {
                        title: '操作',
                        align: 'center',
                        minWidth: 80,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small',
                                    },
                                    on: {
                                        click: () => {
                                            this.$refs.look.getEnters()
                                        }
                                    }
                                }, '查看')
                            ]);
                        }
                    },
                    {
                        title: '配件编码',
                        align: 'center',
                        key: 'partCode',
                        minWidth: 170,
                    },
                    {
                        title: '配件名称',
                        align: 'center',
                        key: 'partName',
                        minWidth: 120
                    },
                    {
                        title: 'OE码',
                        align: 'center',
                        key: 'oemCode',
                        minWidth: 120
                    },
                    {
                        title: '品牌',
                        align: 'center',
                        key: 'partBrandName',
                        minWidth: 120
                    },
                    {
                        title: '品牌车型',
                        align: 'center',
                        key: 'aaa',
                        minWidth: 120
                    },
                    {
                        title: '单位',
                        align: 'center',
                        key: 'outUnitId',
                        minWidth: 120
                    },
                    {
                        title: '库存数量',
                        align: 'center',
                        key: 'stockQty',
                        minWidth: 120
                    },
                    {
                        title: '可售数量',
                        align: 'center',
                        key: 'outableQty',
                        minWidth: 80
                    },
                    {
                        title: '仓库',
                        align: 'center',
                        key: 'storeName',
                        minWidth: 120

                    },
                    {
                        title: '仓位',
                        align: 'center',
                        key: 'shelf',
                        minWidth: 120
                    },
                    {
                        title: '库存单价',
                        align: 'center',
                        key: 'costPrice',
                        minWidth: 120
                    },
                    {
                        title: '库存金额',
                        align: 'center',
                        key: 'stockAmt',
                        minWidth: 120
                    },
                    {
                        title: '规格',
                        align: 'center',
                        key: 'spec',
                        minWidth: 120
                    },
                    {
                        title: '方向',
                        align: 'center',
                        key: 'direction',
                        minWidth: 120
                    },
                    {
                        title: '最近入库日期',
                        align: 'center',
                        key: 'lastEnterDate',
                        minWidth: 120
                    },
                    {
                        title: '最近出库日期',
                        align: 'center',
                        key: 'lastOutDate',
                        minWidth: 120
                    },
                    {
                        title: '库存上限',
                        align: 'center',
                        key: 'upLimit',
                        minWidth: 120
                    },
                    {
                        title: '库存下限',
                        align: 'center',
                        key: 'downLimitWinter',
                        minWidth: 120
                    }
                ],
                //批次库存列表
                columns2: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        key: 'aaa',
                        minWidth: 40
                    },
                    {
                        title: '配件编码',
                        align: 'center',
                        minWidth: 80,
                        key: 'partCode'
                    },
                    {
                        title: '配件名称',
                        align: 'center',
                        key: 'partName',
                        minWidth: 120
                    },
                    {
                        title: 'OE码',
                        align: 'center',
                        key: 'oemCode',
                        minWidth: 120
                    },
                    {
                        title: '品牌',
                        align: 'center',
                        key: 'partBrandName',
                        minWidth: 120
                    },
                    {
                        title: '品牌车型',
                        align: 'center',
                        key: 'aaa',
                        minWidth: 120
                    },
                    {
                        title: '单位',
                        align: 'center',
                        key: 'aaa',
                        minWidth: 120
                    },
                    {
                        title: '规格',
                        align: 'center',
                        key: 'spec',
                        minWidth: 120
                    },
                    {
                        title: '方向',
                        align: 'center',
                        key: 'aaa',
                        minWidth: 120
                    },
                    {
                        title: '库存数量',
                        align: 'center',
                        key: 'stockQty',
                        minWidth: 120
                    },
                    {
                        title: '可售数量',
                        align: 'center',
                        key: 'aaa',
                        minWidth: 80
                    },
                    {
                        title: '仓库',
                        align: 'center',
                        key: 'storeName',
                        minWidth: 120

                    },
                    {
                        title: '仓位',
                        align: 'center',
                        key: 'shelf',
                        minWidth: 120
                    },
                    {
                        title: '库存单价',
                        align: 'center',
                        key: 'costPrice',
                        minWidth: 120
                    },
                    {
                        title: '库存金额',
                        align: 'center',
                        key: 'stockAmt',
                        minWidth: 120
                    },
                    {
                        title: '税率',
                        align: 'center',
                        key: 'aaa',
                        minWidth: 120
                    },
                    {
                        title: '不含税单价',
                        align: 'center',
                        key: 'aaa',
                        minWidth: 120
                    },
                    {
                        title: '不含税金额',
                        align: 'center',
                        key: 'aaa',
                        minWidth: 120
                    },
                    {
                        title: '本店库龄',
                        align: 'center',
                        key: 'aaa',
                        minWidth: 120
                    },
                    {
                        title: '滞销',
                        align: 'center',
                        key: 'aaa',
                        minWidth: 120
                    },
                ],
                // 汇总库存的数据
                contentOne: {
                    //数据
                    dataOne: [{
                        aaa: '暂无字段',
                        bbb: 5
                    }],
                    // 分页
                    page: {
                        num: 1,
                        total: 0,
                        size: 10
                    },
                },
                //批次库存的数据
                contentTwo: {
                    //分页
                    page: {
                        num: 1,
                        total: 0,
                        size: 10
                    },
                    //数据
                    dataTwo: [{
                        aaa: '批次库存',
                        bbb: 5
                    }]
                },
            }
        },
        created() {
          this.serch()
        },
        methods: {
            //搜索
            serch(){
                if(this.tabIndex==0){
                  let searchTableList = Object.assign({},this.contentOne.page,this.searchForm)
                  this.getAllStocks(searchTableList)
                }else if(this.tabIndex==1){
                  let searchTableList = Object.assign({},this.contentTwo.page,this.searchForm1)
                  this.getLotStocks(searchTableList)
                }else{
                    alert('无法请求')
                    return false
                }
            },
            // 汇总库存请求
            async getAllStocks() {
                let res = await getAllStock({
                    page: 1,
                    size: 10
                })
                if (res.code == 0) {
                    this.contentOne.dataOne = res.data.content
                    this.contentOne.page.total = res.data.totalElements
                    this.contentOne.page.size = res.data.totalPages
                }
            },
            // 批次库存请求
            async getLotStocks() {
                let res = await getLotStock({
                    page: 1,
                    size: 10
                })
                if (res.code == 0) {
                    this.contentTwo.dataTwo = res.data.content

                    console.log(this.contentTwo.dataTwo,777)
                }
            },
            // tab切换
            setTab(index) {
                this.tabIndex = index;
                console.log(this.tabIndex, "tabindex")
                if (this.tabIndex == 1) {
                    this.getLotStocks()
                }
            },
            //表格选中数据
            selectTable(v) {
                this.selectTableData = v
                // console.log(this.selectTableData)
            },
            // 单选行
            selectRow(row) {
                this.currRow = row;
            },
            // 修改每页显示条数-客户信息
            changeSizeCus(size) {
                this.customer.page.num = 1;
                this.customer.page.size = size;
                this.getCus();
            },
            changePageCus() {
              this.serch()
            },
            //安全库存弹窗
            sfy() {
                // this.safetyModal = true
            },
            //获取仓库下拉选择信息
            async getStoreHoure() {
                let res = await getwarehouse({});
                if (res.code == 0) {
                    res.data.map(item => {
                        item.store = item.id;
                    })
                    this.storeList = res.data;
                    // console.log(this.storeList,"默认仓库选项")
                } else {
                    console.log('22')
                }
            },
            //显示零库存
            showQty(){
              if(this.tabIndex==0){
                this.getAllStocks()
              }
              if(this.tabIndex==1){
                this.getLotStocks()
              }
            }
        }
    }
</script>

<style lang="less" scoped>
  .tabs-ulwarp {
    padding-top: 17px;
    border-bottom: solid 1px #ddd;
  }

  .tabs {
    list-style: none;
    display: flex;

    li {
      margin: 0;
      margin-right: 4px;
      height: 31px;
      padding: 5px 16px 4px;
      border: 1px solid #ddd;
      border-bottom: 0;
      border-radius: 2px 2px 0 0;
      -webkit-transition: all 0.3s ease-in-out;
      transition: all 0.3s ease-in-out;
      background: #f8f8f8;
      cursor: pointer;
    }

    li.tab-active {
      height: 32px;
      padding-bottom: 5px;
      background: #fff;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
      border-color: #ddd;
      color: #fd5c5c;
    }
  }
  .page-warp {
    padding-right: 20px;
  }
  .look-nav {
    text-align: center;
    height: 40px;
    margin-top: 20px;
  }
  .mt20 {
    margin-top: 20px;
  }
  .look{
    width: 100px;
    height: 100px;
    position: fixed;
    top:50%;
    left: 50%;
    transform: translate(-50%);
  }
</style>
