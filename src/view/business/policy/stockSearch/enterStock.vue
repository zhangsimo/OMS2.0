<template>
  <div class="content-oper">
    <Modal
      title="库存查询"
      closable
      v-model="modal1"
      width="1100"
      :loading="loading">
      <section class="oper-box">
        <!--      主菜单导航-->
        <div class="db pl10 tabs-ulwarp">
          <ul class="tabs">
            <li v-if="!curronly" class="center lis" :class="{'tab-active': tIndex ==1}"
                @click="setTab(1)">入库明细
            </li>
            <li class="center lis" :class="{'tab-active': tIndex ==2}" @click="setTab(2)">出库明细</li>
            <li class="center lis" :class="{'tab-active': tIndex ==3}" @click="setTab(3)">订单占用</li>
          </ul>
        </div>
        <!--      入库明细-->
        <div class="tabs-warp" v-if="tIndex == 1">
          <!--      搜索工具栏-->
          <div class="oper-top flex mb20">
            <div class="wlf">
              <div class="db">
                <span>入库日期：</span>
                <DatePicker
                  @on-change="selectDate"
                  type="daterange"
                  placement="bottom-start"
                  placeholder="选择日期"
                  class="w200 mr20">
                </DatePicker>
              </div>
              <div class="db">
                <span>供应商: </span>
                <Input v-model="searchForm2.originGuestId" class="w200 mr10"></Input>
              </div>
              <div class="db">
                <Button type="warning" class="mr10 w90" @click="search">
                  <Icon type="ios-search" size="14"/>
                  查询
                </Button>
              </div>
            </div>
          </div>
          <!--      表-->
          <Table class="table-highlight-row" highlight-row size="small"
                 @on-current-change="selectTable"
                 border :stripe="true" :columns="enterInfo" :data="contentOne.dataOne" height="600"></Table>
        </div>
        <!--      出库明细-->
        <div class="tabs-warp" v-if="tIndex == 2">
          <!--      搜索工具栏-->
          <div class="oper-top flex mb20">
            <div class="wlf">
              <div class="db">
                <span>出库日期：</span>
                <DatePicker @on-change="selectDate" type="daterange" placement="bottom-start" placeholder="选择日期"
                            class="w200 mr20">
                </DatePicker>
              </div>
              <div class="db">
                <span>客户: </span>
                <Input v-model="searchForm3.guestName" class="w200 mr10"></Input>
              </div>
              <div class="db">
                <Button type="warning" class="mr10 w90" @click="search">
                  <Icon type="ios-search" size="14"/>
                  查询
                </Button>
              </div>
            </div>
          </div>
          <!--      表-->
          <Table class="table-highlight-row" highlight-row size="small"
                 @on-current-change="selectTable"
                 border :stripe="true" :columns="outInfo" :data="contentTwo.dataTwo" height="600"></Table>
        </div>
        <!--      占用订单-->
        <div class="tabs-warp p10" v-if="tIndex==3">
          <!--      表-->
          <Table class="table-highlight-row" highlight-row size="small"
                 @on-current-change="selectTable"
                 border :stripe="true" :columns="occupy" :data="contentThree.dataThree" height="600"></Table>
        </div>
        <!--      分页-->
        <div class="page-warp">
          <Page
            v-if="tIndex == 1"
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
            v-if="tIndex == 2"
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
          <Page
            v-if="tIndex == 3"
            class-name="page-con"
            :current="contentThree.page.num"
            :total="contentThree.page.total"
            :page-size="contentThree.page.size"
            @on-change="changePageCus"
            @on-page-size-change="changeSizeCus"
            show-sizer
            show-total
            show-elevator
          ></Page>
        </div>
        <!--      点击查看显示-->
      </section>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
    import {getEnter, getOut,getOccupy} from "@/api/business/stockSearch";

    export default {
        name: "enterStock",
        props: {mainData: ''},
        data() {
            return {

                //客户查询
                guestName:'',
                //主表id
                curronly: false,
                // 加载图标
                loading: false,
                // modal显示
                modal1: false,
                // 切换菜单值
                tIndex: 1,
                // 存放点击选中的数据
                selectTableData: '',
                // 入库明细表
                enterInfo: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        key: 'index',
                        minWidth: 40
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
                        title: '单位',
                        align: 'center',
                        key: 'outUnitId',
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
                        key: 'applyCarModel',
                        minWidth: 120
                    },
                    {
                        title: '仓库',
                        align: 'center',
                        key: 'storeName',
                        minWidth: 120

                    },
                    {
                        title: '供应商',
                        align: 'center',
                        key: 'originGuestId',
                        minWidth: 120
                    },
                    {
                        title: '入库日期',
                        align: 'center',
                        key: 'enterDate',
                        minWidth: 80
                    },

                    {
                        title: '入库数量',
                        align: 'center',
                        key: 'enterQty',
                        minWidth: 120
                    },
                    {
                        title: '入库单价',
                        align: 'center',
                        key: 'enterPrice',
                        minWidth: 120
                    },
                    {
                        title: '金额',
                        align: 'center',
                        key: 'enterAmt',
                        minWidth: 120
                    },
                    {
                        title: '税率',
                        align: 'center',
                        key: 'taxRate',
                        minWidth: 120
                    },
                    {
                        title: '不含税单价',
                        align: 'center',
                        key: 'direction',
                        minWidth: 120
                    },
                    {
                        title: '不含税金额',
                        align: 'center',
                        key: 'noTaxPrice',
                        minWidth: 120
                    },
                    {
                        title: '入库单号',
                        align: 'center',
                        key: 'code',
                        minWidth: 120
                    },
                    {
                        title: '入库类型',
                        align: 'center',
                        key: 'enterTypeId',
                        minWidth: 120
                    },
                    {
                        title: '备注',
                        align: 'center',
                        key: 'remark',
                        minWidth: 120
                    }
                ],
                // 出库明细表
                outInfo: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        key: 'index',
                        minWidth: 40
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
                        title: '单位',
                        align: 'center',
                        key: 'outUnitId',
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
                        title: '仓库',
                        align: 'center',
                        key: 'storeName',
                        minWidth: 120

                    },
                    {
                        title: '客户',
                        align: 'center',
                        key: 'guestName',
                        minWidth: 120
                    },
                    {
                        title: '出库日期',
                        align: 'center',
                        key: 'outDate',
                        minWidth: 80
                    },

                    {
                        title: '出库数量',
                        align: 'center',
                        key: 'outUnitId',
                        minWidth: 120
                    },
                    {
                        title: '出库单价',
                        align: 'center',
                        key: 'aaa',
                        minWidth: 120
                    },
                    {
                        title: '出库金额',
                        align: 'center',
                        key: 'sellAmt',
                        minWidth: 120
                    },
                    {
                        title: '税率',
                        align: 'center',
                        key: 'taxRate',
                        minWidth: 120
                    },
                    {
                        title: '不含税单价',
                        align: 'center',
                        key: 'noTaxPrice',
                        minWidth: 120
                    },
                    {
                        title: '不含税金额',
                        align: 'center',
                        key: 'noTaxAmt',
                        minWidth: 120
                    },
                    {
                        title: '出库批次',
                        align: 'center',
                        key: 'isMarkBatch',
                        minWidth: 120
                    },
                    {
                        title: '批次成本',
                        align: 'center',
                        key: 'aaa',
                        minWidth: 120
                    },
                    {
                        title: '批次金额',
                        align: 'center',
                        key: 'aaa',
                        minWidth: 120
                    },
                    {
                        title: '供应商',
                        align: 'center',
                        key: 'originGuestId',
                        minWidth: 120
                    },
                    {
                        title: '出库单号',
                        align: 'center',
                        key: 'code',
                        minWidth: 120
                    },
                    {
                        title: '出库类型',
                        align: 'center',
                        key: 'downLimitWinter',
                        minWidth: 120
                    },
                    {
                        title: '备注',
                        align: 'center',
                        key: '出库类型',
                        minWidth: 120
                    },
                ],
                //订单占用表
                occupy: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        key: 'index',
                        minWidth: 40
                    },
                    {
                        title: '业务单号',
                        align: 'center',
                        key: 'partCode',
                        minWidth: 170,
                    },
                    {
                        title: '客户',
                        align: 'center',
                        key: 'partName',
                        minWidth: 120
                    },
                    {
                        title: '配件编码',
                        align: 'center',
                        key: 'outUnitId',
                        minWidth: 120
                    },
                    {
                        title: '配件名称',
                        align: 'center',
                        key: 'partBrandName',
                        minWidth: 120
                    },
                    {
                        title: '占用数量',
                        align: 'center',
                        key: 'aaa',
                        minWidth: 120
                    },
                    {
                        title: '仓库',
                        align: 'center',
                        key: 'storeName',
                        minWidth: 120

                    },
                    {
                        title: '创建人',
                        align: 'center',
                        key: 'guestName',
                        minWidth: 120
                    },
                    {
                        title: '创建日期',
                        align: 'center',
                        key: 'outDate',
                        minWidth: 80
                    },
                    {
                        title: '备注',
                        align: 'center',
                        key: '',
                        minWidth: 120
                    },
                ],
                // 入库明细数据
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
                //出库明细数据
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
                //订单占用数据
                contentThree: {
                    //分页
                    page: {
                        num: 1,
                        total: 0,
                        size: 10
                    },
                    //数据
                    dataThree: [{
                        aaa: '批次库存',
                        bbb: 5
                    }]
                },

                //入库查询
                searchForm2:{
                    dateTime: '',     // 时间
                    originGuestId:'', // 供应商查询
                },
                //出库查询
                searchForm3:{
                    dateTime: '',     // 时间
                    guestName:'',     // 客户查询
                }
            }
        },
        methods: {
            //表格选中数据
            selectTable(v) {
                this.selectTableData = v
                // console.log(this.selectTableData)
            },
            // 入库明细请求
            async getEnters() {
                this.modal1 = true
                let partId = this.mainData.partId
                let enterData = Object.assign({},this.contentOne.page,{partId})
                let res = await getEnter({enterData})
                if (res.code == 0) {
                    // console.log(res,777)
                    this.contentOne.dataOne = res.data.content
                    this.contentOne.page.total = res.data.totalElements
                    this.contentOne.page.size = res.data.totalPages
                    // console.log(this.dataOne, "dataone的")
                } else {
                    // console.log("bbbb")
                }
            },
            // 出库明细请求
            async getOuts() {
                let partId = this.mainData.partId
                let outData = Object.assign({},this.contentTwo.page,{partId})
                let res = await getOut({outData})
                if (res.code == 0) {
                    this.contentTwo.dataTwo = res.data.content
                    this.contentTwo.page.total = res.data.totalElements
                    this.contentTwo.page.size = res.data.totalPages
                    // console.log(this.contentTwo.dataTwo, "2222")
                } else {
                    // console.log(4444)
                }
            },
            // 占用订单 getOccupy
            async getHold() {
                let partId = this.mainData.partId
                let getData = Object.assign({},this.contentThree.page,{partId})
                let res = await getOccupy({getData})
                if (res.code == 0) {
                    this.contentThree.dataThree = res.data.content
                    this.contentThree.page.total = res.data.totalElements
                    this.contentThree.page.size = res.data.totalPages
                    // console.log(this.contentTwo.dataTwo, "2222")
                } else {
                    console.log(4444)
                }
            },
            // tab切换
            setTab(index) {
                this.tIndex = index;
                console.log(this.tIndex, "tabindex")
                if (this.tIndex == 2) {
                    this.getOuts()
                }
                if (this.tIndex == 1) {
                    this.getEnters()
                }
                if (this.tIndex == 3) {
                    this.getHold()

                }
            },
            // 修改每页显示条数-客户信息
            changeSizeCus(size) {
                if(this.tIndex==1){
                  this.contentOne.page.size = size
                  this.search()
                }else if(this.tabIndex==2){
                  this.contentTwo.page.size = size
                  this.search()
                }else{
                  this.contentThree.page.size = size
                  this.search()
                }
            },
            // 页数变动事件
            changePageCus(currentPage) {
                if(this.tIndex==1){
                  this.contentOne.page.num = currentPage
                  this.search()
                }else if(this.tabIndex==2){
                  this.contentTwo.page.num = currentPage
                  this.search()
                }else{
                  this.contentThree.page.num = currentPage
                  this.search()
                }

            },
            // 获取选择时间
            selectDate(date) {
              console.log(date)
              // 入库获取时间
                if(this.tIndex==1){
                    this.searchForm2.dateTime=date
                }
                if(this.tIndex==2){
                    this.searchForm3.dateTime=date
                }
              this.search()
            },
            // 查询
            search() {
                if(this.tIndex==1){
                  let searchTableList = Object.assign({},this.contentOne.page,this.searchForm2)
                  this.getLotStocks(searchTableList)
                }else if(this.tabIndex==2){
                  let searchTableList = Object.assign({},this.contentTwo.page,this.searchForm3)
                  this.getLotStocks(searchTableList)
                }else{
                  let searchTableList = Object.assign({},this.contentThree.page,this.searchForm3)
                  this.getHold()
                }
            }
        }
    }
</script>

<style scoped xml:lang="less">
  .tabs-ulwarp {
    padding-top: 17px;
    border-bottom: solid 1px #ddd;
  }

  .tabs {
    list-style: none;
    display: flex;
  }

  .lis {
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
  .ivu-modal .ivu-modal-content .ivu-modal-close .ivu-icon-ios-close{
    color: #000c17;
  }

</style>
