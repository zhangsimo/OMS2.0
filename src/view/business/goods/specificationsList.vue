<template>
  <div>
    <section class="oper-box">
      <div class="oper-top flex shelf-wrap">
        <div class="shelf-left">
          <!--<div>-->
            <!--<span>快速查询：</span>-->
            <!--<quick-date v-on:quickDate="getDataQuick" class="mr20"></quick-date>-->
            <!--<span>日期：</span>-->
            <!--<DatePicker @on-change="selectDate" type="daterange" placement="bottom-start" placeholder="选择日期"  class="w200 mr20"></DatePicker>-->
            <!--<span>状态：</span>-->
            <!--<Select v-model="taskStatusValue" class="w120 mr20" @on-change="changeState">-->
              <!--<Option v-for="item in taskStatusArr" :value="item.value" :key="item.value">{{ item.name }}</Option>-->
            <!--</Select>-->
          <!--</div>-->
          <div>
            <span>查询条件：</span>
            <Select v-model="searchType" class="w100">
              <Option v-for="item in searchTypeArr" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
            <Input v-model="searchValue" :placeholder="placeh" clearable class="w200 mr20"></Input>
            <Button type="warning" @click="searchClick" class="mr20">查询</Button>
          </div>
        </div>
      </div>
      <!--<div class="oper-bottom just-s flex">-->
        <!--<div>-->
          <!--<Button icon="plus" type="primary" class="mr20" @click="addReplenish">新增补货单</Button>-->
        <!--</div>-->
        <!--<Button class="ml20" @click="exportData">导出</Button>-->
      <!--</div>-->
    </section>
    <section class="con-box">
      <Table size="small" :loading="loading" border :stripe="true" :columns="columns" :data="data"></Table>
      <Page class-name="page-con" :total="page.total" :page-size="page.size" :current="page.num" @on-change="changePage" @on-page-size-change="changeSize" show-sizer show-total></Page>
    </section>

    <Modal v-model="specModal" width="300" title="编辑规格">
      <Form :label-width="80">
        <FormItem label="小包：">
          <InputNumber v-model="specData.single" :min="1" :step="1" @on-change="singleChange" class="w160"></InputNumber>
        </FormItem>
        <FormItem label="中包：">
          <InputNumber v-model="specData.middle" :min="specData.single" :step="specData.single" @on-change="middleChange" class="w160"></InputNumber>
        </FormItem>
        <FormItem label="大包：">
          <InputNumber v-model="specData.shipper" :min="specData.middle" :step="specData.middle" class="w160"></InputNumber>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="specModal = false">取消</Button>
        <Button type="primary" @click="ok">确定</Button>
      </div>
    </Modal>

  </div>
</template>
<script>

  import {queryAll, save} from '_api/business/goodsApi'

  export default {
    name: 'specificationsList',
    data() {
      return {
        specModal: false,
        specData: {
          single: 1,
          middle: 2,
          shipper: 3
        },
        curId: null,
        searchValue: '',
        searchType: 'name',
        searchTypeArr: [
          {value: 'name', name: '配件名称'},
          {value: 'skuNo', name: '配件内码'},
          {value: 'venderSkuNo', name: '配件编码'}
        ],
        loading: false,
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        columns: [
          {
            title: '操作',
            align: 'center',
            key: '',
            minWidth: 120,
            render: (h, params) => {
              return h('span', {
                class: 'orderid pointer',
                on: {
                  click: () => {
                    let packingSpecification = params.row.packingSpecification || {single: 1, middle: 1, shipper: 1}
                    this.editSpec(params.row.id, packingSpecification)
                  }
                }
              }, '编辑规格')
            }
          },
          {
            title: '包装规格',
            align: 'center',
            key: '',
            minWidth: 120,
            render: (h, params) => {
              let packingSpecification = params.row.packingSpecification, text = ''
              if (packingSpecification) {
                let single = packingSpecification.single
                let middle = packingSpecification.middle
                let shipper = packingSpecification.shipper
                // text = `小包：${single}，中包：${middle}，大包：${shipper}`
                text = `${single}：${middle}：${shipper}`
              }
              return h('span', text)
            }
          },
          {
            title: '配件名称',
            align: 'center',
            key: 'name',
            minWidth: 120
          },
          {
            title: '配件内码',
            align: 'center',
            key: 'skuNo',
            minWidth: 120
          },
          {
            title: '配件编码',
            align: 'center',
            key: 'venderSkuNo',
            minWidth: 120
          },
          {
            title: '单位',
            align: 'center',
            key: 'skuUnitDesc',
            minWidth: 120
          },
          {
            title: '品牌',
            align: 'center',
            key: 'brandName',
            minWidth: 120
          },
          {
            title: '配件全称',
            align: 'center',
            key: 'fullName',
            minWidth: 120
          }
        ],
        data: []
      }
    },
    components: {},
    activated() {
    },
    mounted() {
      this.search()
    },
    methods: {
      singleChange() {
        // if (this.specData.middle <= this.specData.single) {
        // }
        // if (this.specData.shipper <= this.specData.middle) {
        // }
        this.specData.shipper = this.specData.middle = this.specData.single
      },
      middleChange() {
        // if (this.specData.shipper <= this.specData.middle) {
        // }
        this.specData.shipper = this.specData.middle
      },
      ok() {
        console.log(JSON.stringify(this.specData))
        let stopLoading = this.$loading()
        let data = {
          id: this.curId,
          packingSpecification: this.specData
        }
        save(data).then(res => {
          stopLoading()
          if (res.code === 0) {
            this.specModal = false
            this.search()
          }
        }).catch(err => {
          stopLoading()
        })
      },
      editSpec(id, packingSpecification) {
        this.specData = packingSpecification
        this.curId = id
        this.specModal = true
      },
      searchClick() {
        this.page.num = 1
        this.search()
      },
      changePage(num) {
        this.page.num = num
        this.search()
      },
      changeSize(size) {
        this.page.num = 1
        this.page.size = size
        this.search()
      },
      search() {
        let params = {
          page: this.page.num - 1,
          size: this.page.size
        }
        let searchValue = this.searchValue.trim()
        if (searchValue) {
          params[this.searchType] = searchValue
        }
        this.loading = true
        queryAll({params}).then(res => {
          this.loading = false
          if (res.code === 0) {
            this.data = res.data || []
            this.page.total = res.totalElements || 0
          }
        })
      }
    },
    computed: {
      placeh() {
        return (
          "请填写" + this.searchTypeArr.filter(item => item.value === this.searchType)[0].name
        )
      }
    }
  }
</script>
