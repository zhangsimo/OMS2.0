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

  import {queryAllDirectBill} from '_api/business/orderApi'
  import orderLine from './orderLine'

  export default {
    name: "directOrder",
    components: {orderLine},
    data() {
      return {
        searchValue: '',
        searchType: 'orderNo',
        searchTypeArr: [
          {value: 'orderNo', name: '定向单号'},
          {value: 'originNo', name: '原始单号'}
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
            title: '定向单号',
            align: 'center',
            minWidth: 180,
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
            minWidth: 120
          },
          {
            title: '门店编号',
            align: 'center',
            key: 'storeNo',
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
            minWidth: 120
          },
          {
            title: '下单时间',
            align: 'center',
            key: 'createTime',
            minWidth: 120
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
          params[this.searchType] = searchValue
        }

        params.page = this.page.num - 1
        params.size = this.page.size

        this.loading = true
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
