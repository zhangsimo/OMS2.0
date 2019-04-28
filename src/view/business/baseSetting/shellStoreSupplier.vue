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
      <div class="oper-bottom flex">
        <Button type="primary" @click="add" class="">新增</Button>
      </div>
    </section>
    <section class="con-box">
      <Table size="small" :loading="loading" border :stripe="true" :columns="columns" :data="tbdata"></Table>
      <Page class-name="page-con" :current="page.num" :total="page.total" :page-size="page.size" @on-change="changePage"
            @on-page-size-change="changeSize" show-sizer show-total></Page>
    </section>

    <Modal v-model="storeModal" :title="storeModalTitle" width="400" :mask-closable="false" :closable="false">
      <Form :label-width="100">

        <FormItem label="门店名称：">
<!--          <Input v-model="store.name" class="w200"/>-->
          <Select ref="storeSelector" v-model="store.id" class="w200" filterable @on-change="storeChange">
            <Option v-for="item in hsData" :value="item.value" :key="item.value">{{ item.name }}</Option>
          </Select>
        </FormItem>

        <FormItem label="门店编号：">
          <Input v-model="store.storeNo" class="w200" readonly/>
        </FormItem>

        <FormItem label="公司Code：">
          <Input v-model="store.companiesNo" class="w200" readonly/>
        </FormItem>

        <FormItem label="门店联系人：">
          <Input v-model="store.contactName" :maxlength="10" class="w200" placeholder="门店联系人"/>
        </FormItem>

        <FormItem label="门店电话：">
          <Input v-model="store.tel" :maxlength="20" class="w200" placeholder="门店电话"/>
        </FormItem>

        <FormItem label="所在城市：">
          <Cascader :data="cityData" v-model="citys" class="w200" @on-change="areaChange"></Cascader>
        </FormItem>
        <FormItem label="门店地址：">
          <Input v-model="store.address" type="textarea" placeholder="门店地址"
                 :autosize="{minRows: 2,maxRows: 5}" :maxlength="99" class="w200"/>
        </FormItem>

      </Form>
      <div slot='footer'>
        <Button type='text' @click='storeModal = false'>取消</Button>
        <Button type='primary' @click='saveStore'>确定</Button>
      </div>
    </Modal>

  </div>
</template>

<script>

  import {queryAll, querySupplyStore, saveStore} from '_api/business/shellStoreSupplierApi'
  import cityData from '@/assets/cityData.json'

  export default {
    name: "shellStoreSupplier",
    data() {
      return {
        cityData: cityData,
        citys: [],
        hsData: [],
        modal: false,
        searchValue: '',
        searchType: 'name',
        searchTypeArr: [
          {value: 'name', name: '门店名称'},
          {value: 'storeNo', name: '门店编号'}
        ],
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        supplyId: '',
        supplierArr: [],
        supplierMap: {},
        supplierArr2: [],

        storeModalTitle: '新增门店',
        storeModal: false,
        store: {
          id: '',
          name: '',
          storeNo: '',
          companiesNo: '',
          contactName: '',
          tel: '',
          province: '',
          city: '',
          address: ''
        },

        loading: false,
        columns: [
          // {
          //   title: '操作',
          //   align: 'center',
          //   width: 150,
          //   key: '',
          //   render: (h, params) => {
          //     let opts = [
          //       h('span', {
          //         class: 'pointer',
          //         on: {
          //           click: () => {
          //             this.store = Object.assign({}, params.row)
          //             this.storeModalTitle = '编辑门店'
          //             this.storeModal = true
          //           }
          //         }
          //       }, '编辑'),
          //       h('span', {
          //         class: 'ml15 delete',
          //         on: {
          //           click: () => {
          //             this.$Modal.confirm({
          //               title: '提示',
          //               content: '确定要删除吗？',
          //               onOk: () => {
          //                 this.del(params.row.id)
          //               }
          //             })
          //           }
          //         }
          //       }, '删除')
          //     ]
          //     return h('div', opts)
          //   }
          // },
          {
            title: '壳牌门店',
            align: 'center',
            key: 'shortName',
            minWidth: 200
          },
          {
            title: '门店编号',
            align: 'center',
            key: 'storeNo',
            minWidth: 120
          },
          {
            title: '门店地址',
            align: 'center',
            key: 'address',
            minWidth: 200
          },
          {
            title: '门店电话',
            align: 'center',
            key: 'tel',
            minWidth: 120
          }
        ],
        tbdata: []
      }
    },
    beforeMount () {
      const params = {
        page: 0,
        size: 300,
        cropId: 0
      }
      let stop = this.$loading()
      queryAll(params).then(res => {
        stop()
        if (res.code == 0) {
          let tmp = res.data.content || []
          this.hsData = tmp.map(item => {
            item.value = item.id
            item.name = item.shortName
            return item
          })
        }
      }).catch(err => {
        stop()
      })
    },
    mounted() {
      this.getList()
    },
    methods: {
      storeChange(val) {
        let store = this.hsData.filter(item => item.value == val)[0]
        this.store.name = store && store.name
        this.store.storeNo = store && store.storeNo
        this.store.companiesNo = store && store.companiesNo
        this.store.tel = store && store.tel
        this.store.address = store && store.address
      },
      areaChange(val, data) {
        this.store.province = data[0].label
        this.store.city = data[1].label
      },
      saveStore() {
        if (!this.store.name) {
          this.$Message.warning('请选择门店')
          return
        }
        this.store.contactName = this.store.contactName.trim()
        if (!this.store.contactName) {
          this.$Message.warning('请输入门店联系人')
          return
        }
        if (!this.store.province) {
          this.$Message.warning('请选择所在城市')
          return
        }
        // if (!this.store.id) {
        //   this.$Message.warning('数据异常，id不能为空')
        //   return
        // }

        this.store.tel = (this.store.tel || '').trim()
        this.store.address = (this.store.address || '').trim()

        if (!this.store.tel || !this.store.address) {
          this.$Message.warning('门店电话或门店地址不能为空')
          return
        }

        // let data = {
        //   id: this.store.id,
        //   tel: this.store.tel,
        //   address: this.store.address
        // }
        // console.log(this.store)
        // return;

        let stop = this.$loading()
        saveStore(this.store).then(res => {
          stop()
          if (res.code == 0) {
            this.getList()
            this.storeModal = false
          }
        }).catch(err => {
          stop()
        })
      },
      add() {
        this.storeModalTitle = '新增门店'
        this.storeModal = true
        this.store = {
          id: '',
          name: '',
          storeNo: '',
          companiesNo: '',
          contactName: '',
          tel: '',
          province: '',
          city: '',
          address: ''
        }
        this.$refs.storeSelector.query = ''
      },
      del(id) {

        let data = {storeNo, supplyNo: partnerNo}

        let stop = this.$loading()
        del(data).then(res => {
          stop()
          if (res.code === 0) {
            this.$Message.success('解绑成功')
            this.getList()
          }
        }).catch(err => {
          stop()
        })

      },
      getList() {
        let params = {cropId: 20}
        let searchValue = this.searchValue.trim()
        if (searchValue) {
          params[this.searchType] = searchValue
        }

        params.page = this.page.num - 1
        params.size = this.page.size

        this.loading = true
        queryAll(params).then(res => {
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
        let returnText = ""
        this.searchTypeArr.filter((item) => {
          if (item.value == this.searchType) {
            returnText = "请填写" + item.name
          }
        })
        return returnText
      }
    }
  }
</script>

<style>
  textarea.ivu-input {
    font-size: 12px;
  }
</style>
