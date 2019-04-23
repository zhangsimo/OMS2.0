<template>
  <div>
    <section class="oper-box">
      <div class="oper-top">
        <span>日期：</span>
        <DatePicker @on-change="selectDate" type="daterange" placement="bottom-start" placeholder="选择日期"
                    class="w200"></DatePicker>
        <span class="ml20">查询条件：</span>
        <Select v-model="supplierType" class="w120">
          <Option v-for="item in supplierArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Input v-model="supplierValue" :placeholder="placeh" class="w200"></Input>
        <Button class="ml20" type="warning" @click="searchSupplierFun">查询</Button>
        <Button class="ml20 fr" @click="exportData">导出</Button>
      </div>
    </section>
    <section class="con-box">
      <Table size="small" ref="supplierData" :loading="loading" border :stripe="true" :columns="columns2" :data="supplierData"></Table>
      <Page class-name="page-con" :total="totalElements" :page-size="pageSize" :current="page"
            @on-change="changePage" @on-page-size-change="changeSize" show-sizer show-total></Page>
    </section>
  </div>
</template>
<script>

  import baseUrl from '_conf/url'
  import {getSupplierList} from '_api/business/supplierApi'
  import Cookies from 'js-cookie'
  import {TOKEN_KEY, LOCATION_KEY} from '@/libs/util'

  export default {
    name: 'supplierList',
    computed: {
      placeh() {
        return '请填写' + this.supplierArr.filter(item => item.value === this.supplierType)[0].label
      }
    },
    data() {
      return {
        supplierType: 'supplierName',
        supplierArr: [{
          value: 'supplierName',
          label: '供应商名称'
        }, {
          value: 'supplierCode',
          label: '供应商编号'
        }],
        supplierValue: '',
        dateTime: '',
        totalElements: 0,
        pageSize: 10,
        page: 1,
        loading: true,
        columns2: [
          // {
          //   title: '序号',
          //   align:'center',
          //   type:'index',
          //   key: 'id',
          //   minWidth: 60
          // },
          {
            title: '供应商编号',
            align: 'center',
            key: 'id',
            minWidth: 170
          },
          {
            title: '供应商名称',
            align: 'center',
            key: 'name',
            minWidth: 180
          },
          {
            title: '供应商地址',
            align: 'center',
            key: 'address',
            minWidth: 200
          },
          {
            title: '联系人',
            align: 'center',
            minWidth: 100,
            render: (h, params) => {
              let cards = params.row.cards || []
              return h('span', {}, cards[0] && cards[0].name);
            }
          },
          {
            title: '联系人电话',
            align: 'center',
            key: 'mobile',
            minWidth: 120,
            render: (h, params) => {
              let cards = params.row.cards || []
              return h('span', {}, cards[0] && cards[0].mobile);
            }
          },
          {
            title: '公司电话',
            align: 'center',
            key: 'phone',
            minWidth: 120
          },
          {
            title: '邮编',
            align: 'center',
            key: 'zipCode',
            minWidth: 100
          },
          {
            title: '传真',
            align: 'center',
            key: 'fax',
            minWidth: 120
          },
          {
            title: '备注',
            align: 'center',
            key: 'comment',
            minWidth: 200
          },
          {
            title: '创建人',
            align: 'center',
            key: 'createUserName',
            minWidth: 100
          },
          {
            title: '创建时间',
            align: 'center',
            key: 'createDate',
            minWidth: 150
          },
          {
            title: '最后修改时间',
            align: 'center',
            key: 'updateDate',
            minWidth: 150
          }
        ],
        supplierData: []
      }
    },
    mounted() {
      this.supplierInit()
    },
    methods: {
      //初始化
      supplierInit() {

        const params = {}
        params.page = this.page - 1
        params.size = this.pageSize || 10

        const initBody = {}
        initBody.partnerType = 2

        if (this.dateTime[0]) {
          initBody.startTime = this.dateTime[0] + " 00:00:00"
          initBody.endTime = this.dateTime[1] + " 23:59:59"
        }
        let supplierValue = this.supplierValue.trim()
        if (supplierValue) {
          if (this.supplierType == 'supplierName') {
            initBody.name = supplierValue
          } else {
            supplierValue = this.checkCode(supplierValue)
            if (!supplierValue) {
              return
            }
            initBody.id = supplierValue
          }
        }

        this.loading = true
        getSupplierList({initBody, params}).then(res => {
          this.loading = false
          if (res.code == 0) {
            this.supplierData = res.data.content
            this.totalElements = res.data.totalElements
          }
        })
      },
      //分页
      changePage(p) {
        this.page = p
        this.supplierInit()
      },
      changeSize(size) {
        this.page = 1
        this.pageSize = size
        this.supplierInit()
      },
      //导出列表
      exportData() {

        if (this.supplierData.length == 0) {
          this.$Message.warning('当前查询条件下没有数据可供导出')
          return
        }

        let params = ''
        if (this.dateTime[0]) {
          params += '&startTime=' + this.dateTime[0] + " 00:00:00" + '&endTime=' + this.dateTime[1] + " 23:59:59"
        }
        let supplierValue = this.supplierValue.trim()
        if (supplierValue) {
          if (this.supplierType == 'supplierName') {
            params += '&name=' + supplierValue
          } else {
            supplierValue = this.checkCode(supplierValue)
            if (!supplierValue) {
              return
            }
            params += '&id=' + supplierValue
          }
        }

        location.href = baseUrl.omsApi + '/partner/exportPartnerInfo?partnerType=2&access_token=' + Cookies.get(TOKEN_KEY) + params
      },
      checkCode(val) {
        val = val.split('').map(item => {
          if (!isNaN(item)) {
            return item
          }
        }).join('')
        if (val == '' || val.length > 19) {
          this.$Message.warning('异常编号')
          return false
        }
        return val
      },
      selectDate(date) {
        this.dateTime = date
        this.searchSupplierFun()
      },
      searchSupplierFun() {
        this.page = 1
        this.supplierInit()
      }

    }
  }
</script>
