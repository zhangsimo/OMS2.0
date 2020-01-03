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
          <div class="wlf" style="line-height: 54px">
              <Input v-model="searchForm.partCode" placeholder="配件编码" class="w200 mr10"></Input>
              <Input v-model="searchForm.partName" placeholder="配件名称/拼音" class="w200 mr10"></Input>
<!--              <Select class="w120 mr10" v-model="searchForm.partBrandValue" placeholder="品牌" filterable>-->
<!--                &lt;!&ndash; <Option value="9999" v-for="item in partBrandList">品牌</Option> &ndash;&gt;-->
<!--                <Option-->
<!--                  v-for="item in partBrandList"-->
<!--                  :value="item.partBrandValue"-->
<!--                  :key="item.partBrandValue"-->
<!--                >{{ item.partBrandName}}-->
<!--                </Option>-->
<!--              </Select>-->
            <Select   filterable
                      clearable
                      class="w120 mr10" v-model="searchForm.brandCode" placeholder="品牌">
              <!--                <Option-->
              <!--                  v-for="item in partBrandList"-->
              <!--                  :value="item.partBrandValue"-->
              <!--                  :key="item.partBrandValue"-->
              <!--                >{{ item.partBrandName}}-->
              <!--                </Option>-->
              <Option v-for="item in partBrandList" :value="item.code" :key="item.id">{{ item.name}}</Option>
            </Select>
              <Select class="w120 mr10" v-model="searchForm.storeId" placeholder="仓库">
                <Option
                  v-for="item in storeList"
                  :value="item.id"
                  :key="item.id"
                >{{ item.name}}
                </Option>
              </Select>
              <Input placeholder="仓位" class="w120 mr10" v-model="searchForm.shelf"></Input>
              <span class="mr5">显示零库存:</span>
              <Checkbox v-model="searchForm.noStock"></Checkbox>
              <Button type="warning" class="mr10 w90" @click="serch">
                <Icon type="ios-search" size="14"/>
                查询
              </Button>
              <Button class="mr10 w90" @click="exportTheSummary" v-has="'export'"><i class="iconfont mr5 icondaochuicon"></i> 导出</Button>
<!--              <Button class="mr10 w120" @click="sfy"> 安全库存设置</Button>-->
          </div>
        </div>
        <!--    表-->
        <Table class="table-highlight-row" highlight-row ref="table1"
               border :stripe="true" :columns="columns1" :data="contentOne.dataOne" height="600"></Table>

      </div>
      <!--      批次库存表-->
      <div class="tabs-warp" v-else>
        <!--      搜索工具栏-->
        <div class="oper-top flex">
          <div class="wlf" style="line-height: 54px">
              <Input v-model="searchForm1.partCode" placeholder="配件编码" class="w200 mr10"></Input>
              <Input v-model="searchForm1.partName" placeholder="配件名称/拼音" class="w200 mr10"></Input>
              <Select   filterable
                        clearable
                        class="w120 mr10" v-model="searchForm1.brandCode" placeholder="品牌">
<!--                <Option-->
<!--                  v-for="item in partBrandList"-->
<!--                  :value="item.partBrandValue"-->
<!--                  :key="item.partBrandValue"-->
<!--                >{{ item.partBrandName}}-->
<!--                </Option>-->
                <Option v-for="item in partBrandList" :value="item.code" :key="item.id">{{ item.name}}</Option>
              </Select>
              <Select class="w120 mr10" v-model="searchForm1.storeId" placeholder="仓库">
                <Option
                  v-for="item in storeList"
                  :value="item.id"
                  :key="item.storeId"
                >{{ item.name}}
                </Option>
              </Select>
              <Input v-model="searchForm1.shelf" placeholder="仓位" class="w120 mr10"></Input>
              <span class="mr5">显示零库存:</span>
              <Checkbox v-model="searchForm1.noStock"></Checkbox>
              <Button type="warning" class="mr10 w90" @click="queryBatch">
                <Icon type="ios-search" size="14"/>
                查询
              </Button>
              <Button class="mr10 w90" @click="exportBatch"><i class="iconfont mr5 icondaochuicon" v-has="'exportBatch'"></i> 导出</Button>
              <Button class="mr10 w120" @click="sfy" v-has="'safe'"> 安全库存设置</Button>
          </div>
        </div>
        <!--        表-->
        <Table class="table-highlight-row" highlight-row size="small" ref="table2"
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
          @on-change="changePageAlways"
          @on-page-size-change="changeSizeAlways"
          show-sizer
          show-total
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
    import {getAllStock, getLotStock,getPartBrand} from "@/api/business/stockSearch";
    import EnterStock from "./enterStock";
    import {getwarehouse} from "@/api/system/setWarehouse";
    // import * as api from "_api/system/partManager";


    export default {
        name: "stockSearch",
        components: {EnterStock},
        data() {
            return {
                // 品牌选项
                partBrandList: [
                ],
                //默认仓库选项
                storeList: [
                  {name: '全部', id: 1}
                ],
                //汇总库存查询条件表单
                searchForm: {
                    brandCode: '',   //品牌id
                    partCode: '',         //配件编码
                    storeId: '',            //仓库id
                    partName: '',         //配件名称
                    shelf: '',            //仓位
                    noStock:'',//零库存
                },
                //批次库存查询条件表单
                searchForm1: {
                  brandCode: '',   //品牌id
                    partCode:'',         //配件编码
                    storeId:'',            //仓库id
                    partName:'',         //配件名称
                    shelf:"",            //仓位
                    noStock:'',         //库存
                },
                curronly: false,
                storeName: '999',
                // tab索引
                tabIndex: 0,
                selectTableData: '',
                //查看框
                look: false,
                // 汇总库存列表
                columns1: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        minWidth: 40,
                        render: (h,params) => {
                            return h('span' , params._index +  (this.contentOne.page.num - 1) * this.contentOne.page.size + 1)
                        }
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
                                            this.showList(params.row)
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
                        key: 'partBrand',
                        minWidth: 120
                    },
                    {
                        title: '品牌车型',
                        align: 'center',
                        key: 'carBrandName',
                        minWidth: 120
                    },
                    {
                        title: '单位',
                        align: 'center',
                        key: 'unit',
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
                        // key: 'outableQty',
                        minWidth: 80,
                      render:(h,params)=>{
                      let tex =   params.row.sellSign? 0 : params.row.outableQty
                        return h('span' ,{},tex)
                      }
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
                        // key: 'costPrice',
                        minWidth: 120,
                      render: (h, params) => {
                        let tex = params.row.costPrice.toFixed(2)
                        return h('span', {}, tex)

                      },
                    },
                    {
                        title: '库存金额',
                        align: 'center',
                        // key: 'stockAmt',
                        minWidth: 120,
                      render: (h, params) => {
                        let tex = params.row.stockAmt.toFixed(2)
                        return h('span', {}, tex)

                      },
                    },
                    {
                        title: '规格',
                        align: 'center',
                        key: 'spec',
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
                    },
                  {
                    title: '采购在途库存',
                    align: 'center',
                    key: 'pchRoadQty',
                    minWidth: 120
                  },
                  {
                    title: '调拨在途库存',
                    align: 'center',
                    key: 'attotRoadQty',
                    minWidth: 120
                  },
                  {
                    title: '合计在途库存',
                    align: 'center',
                    key: 'onRoadQty',
                    minWidth: 120
                  }
                ],
                //批次库存列表
                columns2: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
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
                        key: 'partBrand',
                        minWidth: 120
                    },
                    {
                        title: '品牌车型',
                        align: 'center',
                        key: 'carBrandName',
                        /*render:(h , params)=>{

                          return h('span' ,{} ,tex)
                        },*/
                        minWidth: 120
                    },
                    {
                        title: '单位',
                        align: 'center',
                        key: 'enterUnitId',
                        minWidth: 120
                    },
                    {
                        title: '规格',
                        align: 'center',
                        key: 'spec',
                        minWidth: 120
                    },
                    {
                        title: '库存数量',
                        align: 'center',
                        key: 'enterQty',
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
                        key: 'storeShelf',
                        minWidth: 120
                    },
                    {
                        title: '库存单价',
                        align: 'center',
                        // key: 'enterPrice',
                        minWidth: 120,
                      render: (h, params) => {
                        let tex = params.row.enterPrice.toFixed(2)
                        return h('span', {}, tex)

                      },

                    },
                    {
                        title: '库存金额',
                        align: 'center',
                        // key: 'enterAmt',
                        minWidth: 120,
                      render: (h, params) => {
                        let tex = params.row.enterAmt.toFixed(2)
                        return h('span', {}, tex)

                      },
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
                        // key: 'noTaxPrice',
                        minWidth: 120,
                      render: (h, params) => {
                        let tex = params.row.noTaxPrice.toFixed(2)
                        return h('span', {}, tex)

                      },
                    },
                    {
                        title: '不含税金额',
                        align: 'center',
                        // key: 'noTaxAmt',
                        minWidth: 120,
                      render: (h, params) => {
                        let tex = params.row.noTaxAmt.toFixed(2)
                        return h('span', {}, tex)

                      },
                    },
                  {
                    title: '连锁库龄',
                    align: 'center',
                    key: 'chainStockAge',
                    minWidth: 120
                  },
                    {
                        title: '本店库龄',
                        align: 'center',
                        key: 'branchStockAge',
                        minWidth: 120
                    },
                    {
                        title: '滞销',
                        align: 'center',
                        // key: 'isUnsalable ',
                        render: (h , params) => {
                            let tex = params.row.isUnsalable == 0 ? '否' : '是'
                      return  h('span', {} , tex)
                    },
                        minWidth: 120
                    },
                  {
                    title: '入库单号',
                    align: 'center',
                    key: 'serviceId',
                    minWidth: 120
                  },
                  {
                    title: '第一供应商',
                    align: 'center',
                    key: 'originGuestName',
                    minWidth: 120
                  },
                  {
                    title: '最近供应商',
                    align: 'center',
                    key: 'guestName',
                    minWidth: 120
                  },
                ],
                // 汇总库存的数据
                  contentOne: {
                    //数据
                    dataOne: [],
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
            this.getAllStocks()//table请求
            this.getStoreHoure()
            this.getBand() //获取品牌
            this.getLotStocks() //获取批次
        },
        methods: {
            //搜索
            serch() {
                this.contentOne.page.num = 1
                this.getAllStocks()
            },
            // 汇总库存请求
            async getAllStocks() {
                let data={}
                data = this.searchForm
                data.page= this.contentOne.page.num -1
                data.size= this.contentOne.page.size
                data.noStock = data.noStock ? 1 : 0
                let res = await getAllStock(data)
                if (res.code == 0) {
                  console.log('汇总库存数据',res)
                    this.contentOne.dataOne = res.data.content
                    this.contentOne.page.total = res.data.totalElements
                }
            },
            //汇总分页
            changePageAlways(val){
              // console.log('11',val)
                this.contentOne.page.num =val
                this.getAllStocks()
            },
            //汇总条数
            changeSizeAlways(val){
              // console.log('22',val)
                this.contentOne.page.num = 1
                this.contentOne.page.size = val
                this.getAllStocks()
            },
            //汇总查看
            showList(val){
                this.selectTableData = val
                this.$refs.look.getEnters()
            },
            // 批次库存请求
            async getLotStocks() {
                let data ={}
                    data = this.searchForm1
                data.page= this.contentTwo.page.num -1
                data.size= this.contentTwo.page.size
                data.noStock = data.noStock ? 1 : 0
              // console.log('数据',data)
                let res = await getLotStock(data)
                if (res.code == 0) {
                    this.contentTwo.dataTwo = res.data.content
                    this.contentTwo.page.total = res.data.totalElements
                }
            },
            // tab切换
            setTab(index) {
                this.tabIndex = index;
            },
            // 修改每页显示条数-客户信息
            changeSizeCus(val) {
              // console.log('22',val)
                this.contentTwo.page.num = 1
                this.contentTwo.page.size = val
             this.getLotStocks()
            },
            changePageCus(val) {
              // console.log('22',val)
                this.contentTwo.page.num = val
             this.getLotStocks()
            },
            //安全库存弹窗
            sfy() {
                this.safetyModal = true
            },
            //获取仓库下拉选择信息
            async getStoreHoure() {
                let res = await getwarehouse({});
                if (res.code == 0) {
                    // this.storeList = res.data;
                  console.log('222',res)
                  res.data.forEach(el => {
                      el.name = el.name;
                      el.id = el.id;
                      this.storeList.push(el);
                  })
                }
              // this.storeList.unshift({ name: "全部", storeId: '1' })
            },

            //获取品牌
            // async getBand() {
          //     let res = await getPartBrand({});
          //     if (res.code == 0) {
          //       // console.log('11',res)
          //         res.data.forEach(el => {
          //             if (el.parentId != '0') {
          //                 el.partBrandName = el.name;
          //                 el.partBrandValue = el.id;
          //                 this.partBrandList.push(el);
          //             }
          //         })
          //     }
          // },
          async getBand() {
            let res = await getPartBrand({ pageSize: 10000 });
            if (res.code === 0) {
              let arr = [];
              res.data.content.forEach(item => {
                arr.push(...item.children);
              });
              this.partBrandList = arr;
              console.log('4455555',this.partBrandList)
            }
          },
            //查询批次
            queryBatch(){
                this.contentTwo.page.num = 1
                this.getLotStocks()
            },
            //汇总导出
            exportTheSummary(){
                if(this.contentOne.dataOne.length > 0){
                    this.$refs.table1.exportCsv({
                        filename: '汇总库存',
                    })
                }
            },
            //导出批次
            exportBatch(){
                if(this.contentTwo.dataTwo.length > 0){
                    this.$refs.table2.exportCsv({
                        filename: '批次库存'
                    });
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

  .look {
    width: 100px;
    height: 100px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%);
  }
</style>
