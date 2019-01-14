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

    <Modal v-model="modal" title="新增华胜门店和供应商关联" width="400" height="500">
      <Form :label-width="100">

        <FormItem label="门店编号：">
          <Input v-model="data.storeNo" class="w140" :readonly="storeIsValidate"/>
          <Button size="small" @click="resetStore" class="ml20" v-if="storeIsValidate">重置</Button>
          <Button type="primary" size="small" @click="checkStore" class="ml20" v-else>校验</Button>
        </FormItem>

        <FormItem label="门店名称：" v-if="storeIsValidate">
          <Input v-model="data.storeName" class="w200" readonly/>
        </FormItem>

        <FormItem label="供应商：" v-if="storeIsValidate">
          <Select class='w200' v-model='supplyId' @on-change='supplierChange'>
            <Option v-for='item in supplierArr' :value='item.supplyId' :key='item.supplyId'>{{item.name}}</Option>
          </Select>
        </FormItem>

        <FormItem label="经销商：" v-if="storeIsValidate">
          <Select class='w200' v-model='data.partnerNo'>
            <Option v-for='item in supplierArr2' :value='item.partnerNo' :key='item.partnerNo'>{{item.name}}</Option>
          </Select>
        </FormItem>

        <FormItem label="经销商编号：" v-if="storeIsValidate">
          <Input v-model="data.partnerNo" class="w200" readonly/>
        </FormItem>
      </Form>

      <div slot='footer'>
        <Button type='text' @click='modal = false'>取消</Button>
        <Button type='primary' :disabled="!storeIsValidate" @click='submit'>保存</Button>
      </div>
    </Modal>

  </div>
</template>

<script>

  import {queryAll, findAllSupplyPartner, findByStoreNo, save, del} from '_api/business/hsStoreSupplierApi'

  export default {
    name: "hsStoreSupplier",
    data() {
      return {
        refreshTree: true,
        modal: false,
        searchValue: '',
        searchType: 'storeName',
        searchTypeArr: [
          {value: 'storeName', name: '门店名称'},
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
        storeIsValidate: false,
        data: {
          storeName: '',
          storeNo: '',
          storeId: '',
          partnerNo: ''
        },
        loading: false,
        columns: [
          // {
          //   title: '操作',
          //   align: 'center',
          //   width: 120,
          //   key: '',
          //   render: (h, params) => {
          //     return h('span', {
          //       class: 'pointer',
          //       on: {
          //         click: () => {
          //           this.data.storeNo = params.row.storeNo
          //           this.data.storeName = params.row.name
          //           this.modal = true
          //         }
          //       }
          //     }, '添加经销商')
          //   }
          // },
          {
            title: '门店',
            align: 'center',
            minWidth: 120,
            key: 'storeName'
          },
          {
            title: '门店编号',
            align: 'center',
            key: 'storeNo',
            minWidth: 120
          },
          {
            title: '经销商',
            align: 'center',
            key: '',
            minWidth: 200,
            render: (h, params) => {
              let parentSupplyId = params.row.parentSupplyId
              let storeNo = params.row.storeNo
              let storeName = params.row.storeName

              let partnerList = params.row.partnerList || [], opts = []

              partnerList.map(item => {
                let partnerName = item.name
                opts.push(
                  h('div', {
                    class: 'mr15 pl10',
                    style: 'display: inline-block;border: 1px solid #ccc;border-radius: 10px'
                  }, [
                    h('span', {
                      class: 'pr10'
                    }, partnerName),
                    h('span', {
                      class: 'close',
                      on: {
                        click: () => {
                          let partnerNo = item.partnerNo
                          this.$Modal.confirm({
                            title: '提示',
                            content: `确定要解除 华胜门店【${storeName}】和经销商【${partnerName}】的绑定关系吗？`,
                            onOk: () => {
                              this.del(parentSupplyId, storeNo, partnerNo)
                            }
                          })
                        }
                      }
                    }, '×')
                  ])
                )
              })

              return h('div', opts)
            }
          }
        ],
        tbdata: [{id: '1001', storeNo: '1001', name: '华胜天河店', supplys: [{id: '11102', no: '11102', name: '美孚经销商02'}]}]
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      checkStore() {
        this.data.storeNo = this.data.storeNo.trim()
        if (!this.data.storeNo) {
          this.$Message.warning('门店编号不能为空')
          return
        }
        let stop = this.$loading()
        findByStoreNo(this.data.storeNo).then(res => {
          stop()
          if (res.code == 0 && res.data) {
            this.data.storeName = res.data.shortName
            this.storeIsValidate = true
          }
        }).catch(err => {
          stop()
        })
      },
      resetStore() {
        this.storeIsValidate = false
        this.data.storeName = ''
        this.data.storeNo = ''
      },
      add() {
        this.data = {
          storeName: '',
          storeNo: '',
          storeId: '',
          partnerNo: ''
        }
        this.supplierArr = []
        this.storeIsValidate = false
        this.modal = true
        findAllSupplyPartner({}).then(res => {

          if (res.code == 0) {
            let data = res.data || []
            data.map(item => {
              let supplyId = item.id
              this.supplierArr.push({supplyId, name: item.name})
              this.supplierMap[supplyId] = (item.partnerList || []).map(p => {
                return {name: p.name, partnerNo: p.partnerNo}
              })
            })
            this.supplyId = this.supplierArr[0] && this.supplierArr[0].supplyId
            this.supplierChange()
          }
        })
      },
      supplierChange() {
        this.supplierArr2 = this.supplierMap[this.supplyId] || []
        this.data.partnerNo = this.supplierArr2[0] && this.supplierArr2[0].partnerNo
      },
      deleteArea(areaIds) {
        let data = {areaIds, storeId: this.storeId}
        let stop = this.$loading()
        del(data).then(res => {
          stop()
          if (res.code === 0) {
            this.getList()
          }
        }).catch(err => {
          stop()
        })
      },
      submit() {

        let parentSupplyId = this.supplyId
        let supplyNo = this.data.partnerNo
        let storeNo = this.data.storeNo

        if (!supplyNo) {
          this.$Message.warning('数据不完整，请检查')
          return
        }

        let data = {parentSupplyId, supplyNo, storeNo}

        let stop = this.$loading()
        save(data).then(res => {
          stop()
          if (res.code === 0) {
            this.$Message.success('新增成功')
            this.getList()
            this.modal = false
          }
        }).catch(err => {
          stop()
        })

      },
      del(parentSupplyId, storeNo, partnerNo) {

        let data = {parentSupplyId, supplyNo: partnerNo, storeNo}

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
        let params = {cropId: 3}
        let searchValue = this.searchValue.trim()
        if (searchValue) {
          params[this.searchType] = searchValue
        }

        params.page = this.page.num - 1
        params.size = this.page.size

        this.loading = true
        queryAll({params}).then(res => {
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
  .close {
    display: inline-block;
    background: #ccc;
    border-radius: 10px;
    width: 20px;
    text-align: center;
    color: #666666;
    cursor: pointer;
  }

  .close:hover {
    background: #ed3f14;
    color: #ffffff;
  }
</style>
