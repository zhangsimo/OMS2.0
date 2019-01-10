<template>
  <div>
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <!--<div class="db">-->
            <!--<span>日期：</span>-->
            <!--<DatePicker @on-change="selectDate" type="daterange" placement="bottom-start" placeholder="选择日期"-->
                        <!--class="w200 mr20"></DatePicker>-->
          <!--</div>-->
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
      <div class="oper-bottom flex">
        <Button type="primary" @click="add" class="">新增</Button>
      </div>
    </section>
    <section class="con-box">
      <Table size="small" :loading="loading" border :stripe="true" :columns="columns" :data="tbdata"></Table>
      <Page class-name="page-con" :current="page.num" :total="page.total" :page-size="page.size" @on-change="changePage"
            @on-page-size-change="changeSize" show-sizer show-total></Page>
    </section>

    <Modal v-model="modal" :title="data.id ? '修改最小起订量' : '新增'" width="400">
      <Form :label-width="100">
        <FormItem label="配件内码：" v-if="data.id">
          <Input v-model="data.skuNo" class="w200" readonly/>
        </FormItem>
        <FormItem label="配件内码：" v-else>
          <Input v-model="data.skuNo" class="w140" :readonly="skuIsValidate"/>
          <Button size="small" @click="resetSku" class="ml20" v-if="skuIsValidate">重置</Button>
          <Button type="primary" size="small" @click="checkSku" class="ml20" v-else>校验</Button>
        </FormItem>

        <FormItem label="配件名称：" v-if="skuIsValidate && !data.id">
          <Input v-model="data.skuName" class="w200" readonly/>
        </FormItem>

        <FormItem label="配件编码：" v-if="skuIsValidate && !data.id">
          <Input v-model="data.venderSkuNo" class="w200" readonly/>
        </FormItem>

        <FormItem label="供应商：" v-if="skuIsValidate">
          <Input v-model="data.supplyName" class="w200" readonly v-if="data.id"/>
          <Select class='w200' v-model='data.supplyId' @on-change='supplierChange' v-else>
            <Option v-for='item in supplierArr' :value='item.id' :key='item.id'>{{item.name}}</Option>
          </Select>
        </FormItem>

        <FormItem label="供应商编号：" v-if="skuIsValidate">
          <Input v-model="data.supplyNo" class="w200" readonly/>
        </FormItem>

        <FormItem label="最小起订量：" v-if="skuIsValidate">
          <InputNumber v-model="data.minQuantity" :min="1" class="w200"/>
        </FormItem>
      </Form>
      <div slot='footer'>
        <Button type='text' @click='modal = false'>取消</Button>
        <Button type='primary' :disabled="!skuIsValidate" @click='submit'>确定</Button>
      </div>
    </Modal>

  </div>
</template>
<script>

  import {findBySkuNo} from '_api/business/goodsApi'
  import {queryAllSupplySku, findAllSupplyPartner, saveSupplySku, update, del} from '_api/business/supplySkuApi'

  export default {
    name: 'supplySkuList',
    data() {
      return {
        modal: false,
        skuIsValidate: false,
        data: {
          id: null,
          skuId: '',
          skuNo: '',
          skuName: '',
          venderSkuNo: '',
          supplyId: '',
          supplyName: '',
          supplyNo: '',
          minQuantity: 1
        },
        supplierArr: [],
        searchValue: '',
        searchType: 'skuNo',
        searchTypeArr: [
          {value: 'skuNo', name: '配件内码'},
          {value: 'venderSkuNo', name: '配件编码'},
          {value: 'supplyName', name: '供应商名称'},
          {value: 'supplyNo', name: '供应商编号'}
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
            title: '操作',
            align: 'center',
            minWidth: 120,
            key: '',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  class: 'pointer mr15',
                  on: {
                    click: () => {
                      this.data = params.row
                      this.skuIsValidate = true
                      this.modal = true
                    }
                  }
                }, '修改最小起订量'),
                h('span', {
                  class: 'delete',
                  on: {
                    click: () => {
                      let id = params.row.id
                      if (!id) {
                        this.$Message.warning('数据异常')
                        return
                      }
                      this.$Modal.confirm({
                        title: '提示',
                        content: '确定要删除吗？',
                        onOk: () => {
                          this.del(id)
                        }
                      })
                    }
                  }
                }, '删除')
              ])
            }
          },
          {
            title: '配件内码',
            align: 'center',
            minWidth: 120,
            key: 'skuNo'
          },
          {
            title: '配件编码',
            align: 'center',
            key: 'venderSkuNo',
            minWidth: 120
          },
          {
            title: '供应商',
            align: 'center',
            key: 'supplyName',
            minWidth: 200
          },
          {
            title: '供应商编号',
            align: 'center',
            key: 'supplyNo',
            minWidth: 200
          },
          {
            title: '最小起订量',
            align: 'center',
            key: 'minQuantity',
            minWidth: 200
          }
        ],
        tbdata: []
      }
    },
    mounted() {
      this.initStart()
    },
    methods: {
      del(id) {
        let stop = this.$loading()
        del({id}).then(res => {
          stop()
          if (res.code == 0) {
            this.$Message.success('删除成功')
            this.getList()
          }
        }).catch(err => {
          stop()
        })
      },
      checkSku() {
        this.data.skuNo = this.data.skuNo.trim()
        if (!this.data.skuNo) {
          this.$Message.warning('配件内码不能为空')
          return
        }
        findBySkuNo(this.data.skuNo).then(res => {
          if (res.code == 0 && res.data) {
            this.data.skuName = res.data.name
            this.data.skuId = res.data.id
            this.data.venderSkuNo = res.data.venderSkuNo
            this.skuIsValidate = true
          }
        })
      },
      resetSku() {
        this.skuIsValidate = false
        // this.data.supplyId = ''
        // this.data.supplyNo = ''
        // this.data.supplyName = ''
        this.data.minQuantity = 1
      },
      add() {
        this.data = {
          id: null,
          skuId: '',
          skuNo: '',
          skuName: '',
          venderSkuNo: '',
          supplyId: '',
          supplyName: '',
          supplyNo: '',
          minQuantity: 1
        }
        this.supplierArr = []
        this.skuIsValidate = false
        this.modal = true
        findAllSupplyPartner({}).then(res => {
          this.supplierArr = res.data || []
          let supplier = this.supplierArr[0] || {}
          this.data.supplyName = supplier.name || ''
          this.data.supplyNo = supplier.code || ''
          this.data.supplyId = supplier.id || ''
        })
      },
      submit() {
        // console.log(JSON.stringify(this.data))

        let action = this.data.id ? update : saveSupplySku
        let stop = this.$loading()
        action(this.data).then(res => {
          stop()
          if (res.code == 0) {
            this.$Message.success(this.data.id ? '编辑成功' : '新增成功')
            this.modal = false
            this.search()
          }
        }).catch(err => {
          stop()
        })
      },
      supplierChange(id) {
        let supplier = this.supplierArr.filter(item => item.id == id)[0] || {}
        this.data.supplyName = supplier.name
        this.data.supplyNo = supplier.code
      },
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
          params[this.searchType] = searchValue
        }

        params.page = this.page.num - 1
        params.size = this.page.size

        this.loading = true
        queryAllSupplySku({params}).then(res => {
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
