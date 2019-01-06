<template>
  <div>
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>日期：</span>
            <DatePicker @on-change="selectDate" type="daterange" placement="bottom-start" placeholder="选择日期"
                        class="w200 mr20"></DatePicker>
          </div>
          <div class="db">
            <span>查询条件：</span>
            <Select v-model="searchType" class="w120">
              <Option v-for="item in searchTypeArr" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
            <Input v-model="searchValue" :placeholder="placeh" class="w200 mr20" clearable></Input>
            <Checkbox v-show="searchType == 'fullname'" v-model="fullNameState" class="mr15">模糊匹配</Checkbox>
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

  import {queryAll} from '_api/business/goodsApi'

  export default {
    name: 'goodsList',
    data() {
      return {
        fullNameState: false,
        searchValue: '',
        searchType: 'skuName',
        searchTypeArr: [
          {value: 'skuName', name:'配件名称'},
          {value: 'skuNo', name: '配件内码'},
          {value: 'venderSkuNo', name: '配件编码'}
        ],
        dateTime: '',
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        loading: false,
        columns: [
          {
            title: '配件内码',
            align:'center',
            minWidth: 120,
            key:'skuNo'
          },
          {
            title: '配件编码',
            align:'center',
            key: 'venderSkuNo',
            minWidth: 120
          },
          {
            title: '配件全称',
            align:'center',
            key: 'fullName',
            minWidth: 170
          },
          {
            title: '品牌名称',
            align:'center',
            key: 'brandName',
            minWidth: 120
          },
          {
            title: '厂牌名称',
            align:'center',
            key: 'applyBrandName',
            minWidth: 120
          },
          {
            title: '单位描述',
            align:'center',
            key: 'skuUnitDesc',
            minWidth: 120
          },
          {
            title: '规格',
            align:'center',
            key: 'specification',
            minWidth: 200
          },
          {
            title: '颜色',
            align:'center',
            key: 'colour',
            minWidth: 100
          },
          // {
          //   title: '品质',
          //   align:'center',
          //   key: 'qualitySourceName',
          //   minWidth: 170,
          //   render:(h,params) => {
          //     return h('span',params.row.qualitySourceName)
          //   }
          // },
          {
            title: '配件类型',
            align:'center',
            key: 'categoryName',
            minWidth: 170
          },
          {
            title: '旧件名称',
            align:'center',
            key: 'former',
            minWidth: 170
          },
          {
            title: '创建时间',
            align:'center',
            key: 'createTime',
            minWidth: 170
          },
          {
            title: '最后修改时间',
            align:'center',
            key: 'updateTime',
            minWidth: 170
          }
        ],
        tbdata: []
      }
    },
    mounted() {
      this.initStart()
    },
    methods: {
      initStart() {
        this.getList()
      },
      //初始化
      getList() {
        const params = {}
        if (this.dateTime[0]) {
          params.startTime = this.dateTime[0] + " 00:00:00"
          params.endTime = this.dateTime[1] + " 23:59:59"
        }
        let searchValue = this.searchValue.trim()
        if (searchValue) {
          if (this.searchType == 'fullName' && !this.fullNameState) {
            searchValue = `###${searchValue}###`
          }
          params[this.searchType] = searchValue
        }

        params.page = this.page.num - 1
        params.size = this.page.size

        this.loading = true
        queryAll({params}).then(res => {
          this.loading = false
          if (res.code == 0) {
            this.tbdata = res.data || []
            this.page.total = res.totalElements
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
      //搜索
      selectDate(date) {
        this.dateTime = date
        this.search()
      },
      search() {
        this.page.num = 1
        this.getList()
      }
    },
    computed: {
      placeh() {
        let returnText = ""
        this.searchTypeArr.filter((item) => {
          if (item.value == this.searchType) {
            returnText = "请填写" + item.name
          }
        })
        return returnText
      }
    },
  }
</script>
