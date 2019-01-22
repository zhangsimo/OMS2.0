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

  import {queryAllQuoteBill} from '_api/business/orderApi'
  import orderLine from './orderLine'

  export default {
    name: "inquiryBackOrder",
    components: {orderLine},
    data() {
      return {
        searchValue: '',
        searchType: 'orderNo',
        searchTypeArr: [
          {value: 'orderNo', name: '报价单号'},
          {value: 'originNo', name: '询价单号'}
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
            title: '报价单号',
            align: 'center',
            minWidth: 210,
            key: '',
            render: (h, params) => {
              return h('span', [...(params.row.orderNo || '')].reverse().join(''))
            }
          },
          {
            title: '询价单号',
            align: 'center',
            key: '',
            minWidth: 210,
            render: (h, params) => {
              return h('span', [...(params.row.originNo || '')].reverse().join(''))
            }
          },
          {
            title: '回单时间',
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
          params[this.searchType] = [...searchValue].reverse().join('')
        }

        params.page = this.page.num - 1
        params.size = this.page.size

        this.loading = true
        queryAllQuoteBill(params).then(res => {
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
