<template>
  <div>
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>查询条件：</span>
            <Select v-model="searchType" class="w120">
              <Option v-for="item in searchTypeArr" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
            <Input v-model="searchValue" :placeholder="placeh" class="w200 mr20" clearable></Input>
            <Button type="warning" @click="search" class="mr20">查询</Button>
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

  import {queryAllTransferOrder} from '_api/business/orderApi'
  import orderLine from './orderLine'

  export default {
    name: "mallOrder",
    data() {
      return {
        searchValue: '',
        searchType: 'orderNo',
        searchTypeArr: [
          {value: 'orderNo', name: '转单单号'},
          {value: 'originNo', name: '电商单号'}
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
              return h(orderLine, {props: {tbdata}})
            }
          },
          {
            title: '转单单号',
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
                      query: {id, type: 'mall'}
                    })
                  }
                }
              }, [...(params.row.orderNo || '')].reverse().join(''))
            }
          },
          {
            title: '电商单号',
            align: 'center',
            key: 'originNo',
            minWidth: 210
          },
          // {
          //   title: '客户编码',
          //   align: 'center',
          //   key: 'partnerNo',
          //   minWidth: 120
          // },
          // {
          //   title: '门店编号',
          //   align: 'center',
          //   key: 'storeNo',
          //   minWidth: 120
          // },
          // {
          //   title: '订单金额',
          //   align: 'center',
          //   key: 'amount',
          //   minWidth: 120
          // },
          {
            title: '转单状态',
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
            title: 'erp推送状态',
            align: 'center',
            key: '',
            minWidth: 120,
            render: (h, params) => {
              let status = JSON.parse(params.row.erpPushStatus || '{}')
              let cls = 'text-state-warn'
              if (status.value == 3) {
                cls = 'text-state-ok'
              }
              return h('span', {class: cls}, status.name)
            }
          },
          {
            title: '订单类型',
            align: 'center',
            key: '',
            minWidth: 120,
            render: (h, params) => {
              let status = JSON.parse(params.row.mallOrderType || '{}')
              return h('span', status.name)
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
            title: '联系人',
            align: 'center',
            key: 'deliveryLinkman',
            minWidth: 120
          },
          // {
          //   title: '收货人',
          //   align: 'center',
          //   key: 'deliveryName',
          //   minWidth: 120
          // },
          // {
          //   title: '联系方式',
          //   align: 'center',
          //   key: 'deliveryTel',
          //   minWidth: 120
          // },
          {
            title: '收货地址',
            align: 'center',
            tooltip:true,
            ellipsis:true,
            key: 'deliveryAddress',
            minWidth: 200,
            render: (h, params) => {
              return h('Tooltip',{
                props:{
                  placement:"top"
                }
              },[
                h("div",{
                  style: {
                    display: 'inline-block',
                    width: params.column._width*0.8+'px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                },params.row.deliveryAddress),
                h("div",{
                  slot:"content"
                }, params.row.deliveryAddress)
              ])
              // return h('div', [
              //   h('span', {
              //     style: {
              //       display: 'inline-block',
              //       width: '100%',
              //       overflow: 'hidden',
              //       textOverflow: 'ellipsis',
              //       whiteSpace: 'nowrap'
              //     },
              //     domProps: {
              //       title: params.row.deliveryAddress
              //     }
              //   }, params.row.deliveryAddress)
              // ])
            }
          },
          {
            title: '备注',
            align: 'center',
            key: 'memo',
            minWidth: 120
          }
        ],
        tbdata: []
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        const params = {}
        let searchValue = this.searchValue.trim()
        if (searchValue) {
          if (this.searchType == 'orderNo') {
            searchValue = [...searchValue].reverse().join('')
          }
          params[this.searchType] = searchValue
        }

        params.page = this.page.num - 1
        params.size = this.page.size

        this.loading = true
        queryAllTransferOrder(params).then(res => {
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
