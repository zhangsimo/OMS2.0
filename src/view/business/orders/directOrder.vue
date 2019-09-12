<template>
  <div>
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db clearfix">
            <div class="fl">
              <span>查询条件：</span>
              <Select v-model="searchType" class="w120">
                <Option v-for="item in searchTypeArr" :value="item.value" :key="item.value">{{ item.name }}</Option>
              </Select>
              <Input v-model="searchValue" :placeholder="placeh" class="w200 mr20" clearable></Input>
            </div>
            <div class="fl">
              <span>门店区域：</span>
              <Select v-model="storeArea" class="w120 mr20">
                <Option v-for="item in storeAreaArr" :value="item.id" :key="item.id">{{ item.areaName }}</Option>
              </Select>
            </div>
            <div class="fl">
              <span>门店：</span>
              <Select v-model="storeName" filterable class="w150 mr20">
                <Option v-for="item in storeNameArr" :value="item.companiesNo" :key="item.companiesNo">{{ item.shortName }}</Option>
              </Select>
            </div>
            <div class="fl">
              <span>下单时间：</span>
              <DatePicker @on-change="selectDate" format="yyyy-MM-dd" type="daterange" class="mr20" placement="bottom-end" placeholder="年/月/日--年/月/日" style="width: 200px"></DatePicker>
              <Button type="warning" @click="search" class="mr20">查询</Button>
              <Button type="warning" @click="orderDownloadFun" class="mr20">导出</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <Table size="small" :loading="loading" border :stripe="true" :columns="columns" :data="tbdata"></Table>
      <Page class-name="page-con" :current="page.num" :total="page.total" :page-size="page.size" @on-change="changePage"
            @on-page-size-change="changeSize" show-sizer show-total></Page>
    </section>
  </div>
</template>

<script>

  import {queryAllDirectBill,getStoreArea,getStoreList,orderDownload,orderExport} from '_api/business/orderApi'
  import orderLine from './orderLine'

  export default {
    name: "directOrder",
    components: {orderLine},
    data() {
      return {
        searchValue: '',
        searchType: 'orderNo',
        storeArea:'',
        storeAreaArr:[],
        storeName:'',
        storeNameArr:[],
        date:[],
        searchTypeArr: [
          {value: 'orderNo', name: '定向单号'},
          {value: 'originNo', name: '华胜单号'}
        ],
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        loading: false,
        columns: [
          {
            title: '明细',
            align: 'center',
            type: 'expand',
            width: 70,
            render: (h, params) => {
              let tbdata = params.row.orderLines || []
              return h(orderLine, {props: {tbdata, parent: 'directOrder'}})
            }
          },
          {
            title: '定向单号',
            align: 'center',
            minWidth: 210,
            key: '',
            render: (h, params) => {
              let id = params.row.id
              return h('span', {
                class: 'pointer',
                on: {
                  click: () => {
                    this.$router.push({
                      name: 'orderLink',
                      query: {id, type: 'hs'}
                    })
                  }
                }
              }, [...(params.row.orderNo || '')].reverse().join(''))
            }
          },
          {
            title: '华胜单号',
            align: 'center',
            key: 'originNo',
            minWidth: 210
          },
          {
            title: '门店名称',
            align: 'center',
            key: 'deliveryLinkman',
            minWidth: 140
          },
          {
            title: '门店所属区域',
            align: 'center',
            key: 'storeAreaName',
            minWidth: 120
          },
          {
            title: '门店编号',
            align: 'center',
            key: 'storeNo',
            minWidth: 120
          },
          {
            title: '下单金额',
            align: 'center',
            key: 'amount',
            minWidth: 100
          },
          {
            title: '下单sku个数',
            align: 'center',
            key: 'goodsItems',
            minWidth: 120
          },
          {
            title: '下单sku总数量',
            align: 'center',
            key: 'goodsQty',
            minWidth: 120
          },
          // {
          //   title: '订单状态',
          //   align: 'center',
          //   key: '',
          //   minWidth: 120,
          //   render: (h, params) => {
          //     let status = JSON.parse(params.row.status || '{}')
          //     let cls = 'text-state-warn'
          //     if (status.value == 1) {
          //       cls = 'text-state-ok'
          //     }
          //     return h('span', {class: cls}, status.name)
          //   }
          // },
          {
            title: '拆单状态',
            align: 'center',
            key: '',
            minWidth: 120,
            render: (h, params) => {
              let status = JSON.parse(params.row.routeResult || '{}')
              let cls = 'text-state-warn'
              if (status.value == 1) {
                cls = 'text-state-ok'
              }
              return h('span', {class: cls}, status.name)
            }
          },
          {
            title: '接收时间',
            align: 'center',
            key: 'captureTime',
            minWidth: 150
          },
          {
            title: '下单时间',
            align: 'center',
            key: 'createTime',
            minWidth: 150
          },
          {
            title: '备注',
            align: 'center',
            key: 'memo',
            minWidth: 120
          }
        ],
        tbdata: [],
        downloadPramas:''
      }
    },
    mounted() {
      this.getList()
      getStoreArea({cropId:"HS"}).then(res=>{
        if(res.code==0){
          this.storeAreaArr = res.data||[]
          this.storeAreaArr.unshift({
            "areaName":"全部",
            "id":"99"
          })
        }
      })
      getStoreList({cropId:0}).then(res=>{
        if(res.code==0){
          this.storeNameArr = res.data||[]
          this.storeNameArr.unshift({
            "shortName":"全部",
            "companiesNo":"99"
          })
        }
      })
    },
    methods: {
      selectDate(date){
        this.date = date
      },

      getList() {
        const params = {}
        let searchValue = this.searchValue.trim()
        if (searchValue) {
          if (this.searchType == 'orderNo') {
            searchValue = [...searchValue].reverse().join('')
          }
          params[this.searchType] = searchValue
          //this.downloadPramas += `&${this.type}=${searchValue}`
        }
        if(this.storeArea&&this.storeArea!='99'){
          params.storeAreaId = this.storeArea
          //this.downloadPramas += `&storeAreaId=${this.storeArea}`
        }
        if(this.storeName&&this.storeName!='99'){
          params.partnerCompanyNo = this.storeName
          //this.downloadPramas += `&partnerCompanyNo=${this.storeName}`
        }
        if(this.date&&this.date.length>0){
          params.startTime = this.date[0]&&this.date[0]+' 00:00:00'
          params.endTime = this.date[1]&&this.date[1]+' 23:59:59'
          //this.downloadPramas += `&startTime=${this.date[0]} 00:00:00&endTime=${this.date[1]} 23:59:59`
        }

        params.page = this.page.num - 1
        params.size = this.page.size
        this.loading = true
        this.downloadPramas = params
        queryAllDirectBill(params).then(res => {
          this.loading = false
          if (res.code == 0) {
            this.tbdata = res.data.content || []
            this.page.total = res.data.totalElements
          }
        })
      },
      //分页
      changePage(p) {
        this.page.num = p
        this.getList()
      },
      changeSize(size) {
        this.page.num = 1
        this.page.size = size
        this.getList()
      },
      search() {
        this.page.num = 1
        this.getList()
      },
      orderDownloadFun(){
        orderExport(this.downloadPramas).then(res => {
          if(res.code==0){
            window.location.href = orderDownload(res.data)
          }
        })

      }
    },
    computed: {
      placeh() {
        let returnText = ''
        for (let item of this.searchTypeArr) {
          if (item.value == this.searchType) {
            returnText = item.name
            break
          }
        }
        return returnText ? `请填写${returnText}` : ''
      }
    }
  }
</script>

<style scoped>

</style>
